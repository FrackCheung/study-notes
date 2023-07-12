# JavaScript 事件

**[返回主目录](../readme.md)**

本文档中的事件循环和计时器案例均不考虑UI渲染事件

#### 事件循环
+ 广为人知的事件循环, 指的是`事件队列`, 即依次处理浏览器事件的队列, 实则不然
+ 事件循环至少包含两个队列: `宏任务队列`和`微任务队列`
+ 宏任务队列: 
  - 创建主文档对象
  - 解析HTML
  - 执行全局(主线)JavaScript代码
  - 更改当前URL
  - 各种事件
  - ...
+ 微任务队列, 比宏任务队列更小, 负责更新应用程序状态
  - DOM变化
  - `Promise回调`
  - ...

#### 宏任务:
+ 宏任务代表一个个离散的, 独立的工作单元
+ 运行完宏任务后, 浏览器可以进行继续其他调度(重绘页面, 垃圾回收等) 

#### 微任务
+ 微任务必须在`浏览器任务`继续执行其他任务之前执行
+ 微任务需要尽快的, 通过异步的方式执行
+ 微任务的执行不能产生新的微任务
+ 微任务使得浏览器能够在重绘UI前执行指定的行为
+ **PS:** 浏览器任务: 重绘UI, 垃圾回收等 
 
#### 事件循环的过程
+ 事件循环的实现通常至少需要一个宏任务队列, 和至少一个微任务队列
+ 两种队列在同一时刻, 都只能执行一个任务
+ `再次温习`: 宏任务主要包括执行全局JavaScript代码, 处理各种事件等
+ `再次温习`: 微任务主要包括DOM变化, Promise期约的回调函数等
+ 事件循环首先检查宏任务队列, 如果有宏任务在等待, 则取出, 开始执行
+ 当宏任务执行完毕, 或宏任务队列为空, 事件循环开始移动到微任务队列
+ 如果有多个微任务在队列中等待, 则取出开始执行, 直到微任务`全部`执行完毕
+ **注意:** 单次循环迭代中, 最多处理一个宏任务, 其余的继续等待, 而微任务会被`全部`处理完毕
+ 微任务队列执行完毕清空后, 事件循环检查是否需要更新UI渲染, 需要则重绘UI
+ 事件循环进入下一个迭代, 开始检查宏任务队列, 开启新一轮的事件循环
```JavaScript
// 伪代码表示的事件循环过程
const MacroTaskQueue = ['MouseClickEvent', 'InternetEvent', 'NavigatorURLEvent'];
const MicroTaskQueue = ['PromiseCallback', 'DOMChange'];

// 宏任务队列检查
const MacroTaskQueueCheck = () => {
    if (isNotEmpty(MacroTaskQueue)) {

        // 只处理宏任务队列的第一个任务, 其他的继续排队
        process(getFirstTask(MacroTaskQueue));
    }
};

// 微任务队列检查
const MicroTaskQueueCheck = () => {

    // 微任务队列中的任务会全部执行完毕
    MicroTaskQueue.forEach(task => {
        process(task);
    })
}

// 执行浏览器任务
const BrowerTask = () => {

    // 重绘UI
    if (isNeedRerenderUI()) {
        RerenderUI();
    }

    // 垃圾回收
    if (isNeedGarbageCollection()) {
        GarbageCollection();
    }

    // 其他浏览器任务
}

// 事件循环永不停止
while (true) {

    // 首先检查宏任务队列
    MacroTaskQueueCheck();

    // 再检查微任务队列
    MicroTaskQueueCheck();

    // 执行浏览器任务
    BrowerTask();

    // 完毕后继续检查宏任务队列, 开启新的事件循环
}
```

#### 需要注意的点
+ 宏任务队列和微任务队列是`独立于`事件循环的, 事件循环负责检测队列, 取任务执行
+ 向队列中添加任务也是在事件循环之外进行的, 事件循环运行过程中依然可以向队列添加任务
+ JavaScript是`单线程`模型, 因此两类任务都是`逐个执行`, 执行期间不会被其他任务中断
+ 微任务会在下一次渲染之前完成, 因为微任务目标就是在渲染前更新应用程序状态
+ 页面会尝试每秒渲染`60`次页面, 即每次`16ms`, 页面UI渲染时, 任何任务都无法再修改
+ 想要实现平滑的页面效果, 单个宏任务及其附属的所有微任务, 都最好在`16ms`内完成

#### 进入下一轮事件循环后, 可能出现的几种情况
+ 16ms后, 事件循环决策"是否更新UI", 如果没有显示指定UI更新, 可能不会更新UI
+ 16ms后, 事件循环决策"是否更新UI", 随即进行UI更新, 以提供流畅的应用体验
+ 事件循环中任务执行时间超过16ms, 浏览器无法按目标帧率更新UI, 会延迟更新
+ **PS:** 如果延迟几百ms还能忍受, 要是几千ms, 则可能出现页面卡顿甚至无响应

#### 任务队列案例1: 只有宏任务的事件循环
```HTML
<!-- 假设主线程的代码执行完毕需要15ms -->
<button id="firstButton"></button>
<button id="secondButton"></button>
<script>
    const firstButton = document.querySelector('#firstButton');
    const secondButton = document.querySelector('#secondButton');
    firstButton.addEventListener('click', () => {
        // 假设这里的代码执行完毕需要8ms
    });
    secondButton.addEventListener('click', () => {
        // 假设这里的代码执行完毕需要5ms
    });
</script>
<!-- 假设场景: 用户在代码执行后5ms点击第一个按钮, 随后在12ms后点击第二个按钮 -->
<!-- 请按照时间线描述出事件循环的处理过程 -->
```
+ 事件循环描述如下:
  - 主线程代码简称`M`
  - 按钮1事件简称`B1`
  - 按钮2事件简称`B2`
  - 进入队列简称`入队`
  - 退出队列简称`出队`
   
    | 时间线 | 任务队列  |         解析         |
    | :----: | :-------: | :------------------: |
    |  0ms   |     M     |   M入队, 开始执行    |
    |  5ms   |   M, B1   |  B1入队, M继续执行   |
    |  12ms  | M, B1, B2 |  B2入队, M继续执行   |
    |  15ms  |  B1, B2   |  M完毕出队, 执行B1   |
    |  23ms  |    B2     |  B1完毕出队, 执行B2  |
    |  28ms  |  (null)   | B2完毕出队, 队列为空 |

+ `关键点`: 宏任务完毕后, 检查微队, 以及UI更新决策  

    | 时间线 |            关键之处            |
    | :----: | :----------------------------: |
    |  15ms  | M完毕, 检查微队, 为空, 更新UI  |
    |  23ms  | B1完毕, 检查微队, 为空, 更新UI |
    |  28ms  | B2完毕, 检查微队, 为空, 更新UI |

#### 任务队列案例2: 同时具有宏任务和微任务的事件循环
```HTML
<!-- 假设主线程的代码执行完毕需要15ms -->
<button id="firstButton"></button>
<button id="secondButton"></button>
<script>
    const firstButton = document.querySelector('#firstButton');
    const secondButton = document.querySelector('#secondButton');
    firstButton.addEventListener('click', () => {
        Promise.resolve().then(() => {
            // 假设这里的代码(Promise的回调处理函数)执行完毕需要4ms
        });
        // 假设这里的代码(firstButton的处理函数)执行完毕需要8ms
        });
    secondButton.addEventListener('click', () => {
        // 假设这里的代码执行完毕需要5ms
    });
</script>
<!-- 假设场景: 用户在代码执行后5ms点击第一个按钮, 随后在12ms后点击第二个按钮 -->
<!-- 请按照时间线描述出事件循环的处理过程 -->
```
+ 事件循环描述如下: 
  - 主线程代码简称`M`
  - 按钮1事件简称`B1`
  - 按钮2事件简称`B2`
  - Promise回调简称`P`
  - 进入队列简称`入队`
  - 退出队列简称`出队`
  - 宏任务队列简称`宏队`
  - 微任务队列简称`微队`

    | 时间线 | 宏任务队列 | 微任务队列 |               解析                |
    | :----: | :--------: | :--------: | :-------------------------------: |
    |  0ms   |     M      |   (null)   |          M入队, 开始执行          |
    |  5ms   |   M, B1    |   (null)   |        B1入宏队, M继续执行        |
    |  12ms  | M, B1, B2  |   (null)   |        B2入宏队, M继续执行        |
    |  15ms  |   B1, B2   |     P      | M完毕出队, 执行B1, 并将P推入微队  |
    |  23ms  |     B2     |     P      | B1完毕出队, 检查微队列, P开始执行 |
    |  27ms  |     B2     |   (null)   |         P完毕出队, 执行B2         |
    |  32ms  |   (null)   |   (null)   |       B2完毕出队, 队列为空        |

+ `关键点`: 宏任务完毕后, 检查微队, 以及UI更新决策
   
    | 时间线 |            关键之处             |
    | :----: | :-----------------------------: |
    |  15ms  |  M完毕, 检查微队, 为空, 更新UI  |
    |  23ms  | B1完毕, 检查微队, 有P, 开始执行 |
    |  27ms  |          P完毕, 更新UI          |
    |  32ms  | B2完毕, 检查微队, 为空, 更新UI  |

#### 计时器: setTimeout和setInterval
+ 两个办法都是挂载在`window`对象上
+ 两个方法并非JavaScript标准定义, 而是宿主环境提供
+ 两个方法的回调执行的时间`无法确保`
+ setInterval到达间隔后, 如已有任务`在队列等待`, 则不再添加
+ setInterval到达间隔后, 如已有任务`在执行`, 则会继续添加

#### 计时器案例1: 事件循环中的计时器(本案例不考虑微任务队列)
```HTML
<!-- 假设主线程的代码执行完毕需要18ms -->
<button id="button"></button>
<script>
    setTimeout(() => {
        // 这里的代码执行需要6ms
    }, 10);
    setInterval(() => {
        // 这里的代码执行需要8ms
    }, 10);
    const button = document.querySelector('#id');
    button.addEventListener('click', () => {
        // 这里的代码执行需要10ms
    });
</script>
<!-- 假设场景: 用户在代码执行后6ms点击按钮 -->
<!-- 请按照时间线描述出事件循环的处理过程 -->
```
+ 事件循环描述如下:
  - 主线程代码简称`M`
  - setTimeout计时器回调简称`ST`
  - setInterval计时器回调简称`SL1`,`SL2`,`SL3`...
  - 按钮事件回调简称`B`
  - 进入队列简称`入队`
  - 退出队列简称`出队`
    
    | 时间线 |    任务队列     |                 解析                  |
    | :----: | :-------------: | :-----------------------------------: |
    |  0ms   |        M        |            M入队, 开始执行            |
    |  6ms   |      M, B       |           B入队, M继续执行            |
    |  10ms  | M, B, ST, `SL1` |       ST和`SL1`入队, M继续执行        |
    |  18ms  |  B, ST, `SL1`   |           M完毕出队, 执行B            |
    |  20ms  |  B, ST, `SL1`   |  `SL1`在等待, 不添加`SL2`, B继续执行  |
    |  28ms  |    ST, `SL1`    |           B完毕出队, 执行ST           |
    |  30ms  |    ST, `SL1`    | `SL1`在等待, 不添加`SL2`, ST继续执行  |
    |  34ms  |      `SL1`      |         ST完毕出队, 执行`SL1`         |
    |  40ms  |  `SL1`, `SL2`   | `SL1`在执行, `SL2`入队, `SL1`继续执行 |
    |  42ms  |      `SL2`      |       `SL1`完毕出队, 执行`SL2`        |
    |  50ms  |      `SL3`      |       `SL2`完毕出队, `SL3`入队        |
    |  58ms  |     (null)      |        `SL3`完毕出队, 队列为空        |

#### 计时器案例2: 看似等价却不等价的代码 
```JavaScript
// 方案1
setTimeout(function repeatMe() {
    /** 一些逻辑代码 */
    setTimeout(repeatMe, 10);
}, 10);

// 方案2
setInterval(() => {
    /** 一些逻辑代码 */
}, 10);
```
+ **方案1**: 每个回调执行完毕后, 至少需要等待10ms才会执行下一个, 每次回调执行的时机都会受任务队列和前一个回调的影响, 导致误差会越来越大  
+ **方案2**: 会尝试每间隔10ms调用回调, 即使受任务队列影响, 也会缓慢修正, 因为它始终是间隔10ms调用(这个调度是`宿主环境`负责)

#### 处理计算复杂度高的任务: 任务拆解
***
将大任务拆解为多个任务, 利用`setTimeout`或`setInterval`将推入任务队列(计时器只能推入`宏任务队列`), 宏任务队列每次循环取出队首任务执行, 然后执行微任务队列, 并决策重绘UI
***
+ 使JavaScript创建`20000`行数据的表格
```HTML
<!-- 该方案直接创建, 打开页面会卡顿片刻, 数据才出来 -->
<table>
    <tbody></tbody>
</table>
<script>
    const tbody = document.querySelector('tbody');
    for (let row = 0; row < 20000; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < 6; col++) {
            const td = document.createElement('td');
            td.appendChild(document.createTextNode(`${row},${col}`));
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }
</script>
```
+ 优化方案
```HTML
<!-- 该方案分10次任务创建, 减轻压力, 每次创建2000行, 且每次任务完毕都会重绘UI -->
<table><tbody></tbody></table>
<script>
    // 总共创建行数
    const totalRow = 20000;
        
    // 拆解任务的次数
    const times = 10;

    // 每次任务要创建的行数
    const addRowPerTime = totalRow / times;
        
    // 计数
    const count = 0;

    // 利用setTimeout将回调推入队列
    setTimeout(function createRows() {

        // 起始行索引
        const rowStart = addRowPerTime * count;

        // 结束行索引
        const rowEnd = rowStart + addRowPerTime;
        const tbody = document.querySelector('tbody');
        for (let index = rowStart; index < rowEnd; index++) {
            const tr = document.createElement('tr');
            for (let t = 0; t < 6; t++) {
                const td = document.createElement('td');
                td.appendChild(document.createTextNode(`${index},${t}`));
                tr.appendChild(td);
            }
            tbody.appendChild(tr);
        }
        count++;
        if (count < times) {

            // 如果计数还没有到达最大次数, 就继续异步执行该方法
            setTimeout(createRows, 0);
        }
    }, 0);
</script>
```

#### addEventListener
+ 可用第三个参数指定事件`捕获`和`冒泡`, `true`(捕获), `false`(冒泡, 默认)
+ 事件从`window`出发, 向目标元素传播, 沿途寻找`捕获模式`的事件, 并调用事件处理器
+ 事件从目标元素触发, 向`window`传播, 沿途寻找`冒泡模式`的事件, 并调用事件处理器
+ 案例1
```HTML
<div class="outer">
    <div class="center">
        <div class="inner"><div>
    </div>
</div>

<script>
    const outer = document.querySelector('.outer');
    const center = document.querySelector('.center');
    const inner = document.querySelector('.inner');

    inner.addEventListener('click', () => { /** inner */ });
    center.addEventListener('click', () => { /** center */ });
    outer.addEventListener('click', () => { /** outer */ });
</script>
<!-- 如果在inner上点击, 请描述事件触发的顺序 -->
```
+ **Answer:** 没有事件设置捕获, 全部默认冒泡, 因此顺序为`inner` -> `center` -> `outer`
+ 案例2
```HTML
<div class="outer">
    <div class="center">
        <div class="inner">
        </div>
    </div>
</div>

<script>
    const outer = document.querySelector('.outer');
    const center = document.querySelector('.center');
    const inner = document.querySelector('.inner');

    inner.addEventListener('click', () => { /** inner */ });
    center.addEventListener('click', () => { /** center */ }, true);
    outer.addEventListener('click', () => { /** outer */ });
</script>
<!-- 如果在inner上点击, 请描述事件触发的顺序 -->
```
+ **Answer:** 从`window`到`inner`, `center`由于捕获最先触发, 剩下的冒泡, 因此顺序为 `center` -> `inner` -> `outer`


#### addEventListener中的this和event.target
+ 事件处理器中的`this`, 指向的是`事件处理器注册的元素`(非箭头函数的情况)
+ **要注意:** 事件处理器使用的是否为箭头函数, 这会影响`this`的指向!
+ `event.target`永远指向事件发生的元素
+ `事件委托`利用了`event.target`指向不变性(将事件注册在`父级`或`祖先元素`上)
***
**详细解析:** 
+ 假设`inner`, `center`, `outer`都注册`click`处理器
+ 在`inner`上触发`click`事件
+ 由于冒泡和捕获的存在, `inner`, `center`, `outer`的`click`事件都会触发;
+ 因此:
  - 在`inner`的事件处理程序中, `this`指向`inner`
  - 在`center`的事件处理程序中, `this`指向`center`
  - 在`outer`的事件处理程序中, `this`指向`outer`
+ 而`event.target`始终指向`inner`
***
+ 案例
```HTML
<div class="outer">
    <div class="center">
        <div class="inner">
        </div>
    </div>
</div>

<script>
    const outer = document.querySelector('.outer');
    const center = document.querySelector('.center');
    const inner = document.querySelector('.inner');

    inner.addEventListener('click', function () {
        console.log(this, event.target); // this指向inner
    });
    center.addEventListener('click', function () {
        console.log(this, event.target); // this指向center
    });
    outer.addEventListener('click', function () {
        console.log(this, event.target); // this指向outer
    });
</script>
<!-- 如果在inner上点击, 请描述this和event.target的指向 -->
```
+ **Answer:** 由于是在`inner`上点击, 因此三个处理器中的`event.target`都指向`inner`

#### 自定义事件: 
+ 使用`CustomEvent`构造函数
+ 两个参数分别是`事件类型`, `传递数据`
+ 传递的数据要赋值给`CustomEvent`第二个参数的`detail`对象
+ 使用`dispatchEvent`派发事件
+ 在目标对象上使用`addEventListener`监听事件
+ 案例
```HTML
<script>
    // 定义函数, 用于快速生成自定义事件
    function triggerEvent(target, eventType, eventDetail) {

        // 传递的数据是eventDetail, 它要赋值给第二个参数的detail对象
        const event = new CustomEvent(eventType, {
            detail: eventDetail
        });

        // 在目标对象上使用dispatchEvent派发事件
        target.dispatchEvent(event);
    }

    // 使用addEventListener监听事件
    document.addEventListener('custom', event => {

        // 从event.datail中取出传递的数据
        const { detail } = event;
        console.log(`I am ${detail.name}, I like ${detail.habit}`);
    });

    // 调用函数, 生成并派发事件
    triggerEvent(document, 'custom', {
        name: 'zhangzhen',
        habit: 'programming'
    });

    // 最终输出: I am zhangzhen, I like programming
</script>
```

****
**[返回主目录](../readme.md)**
