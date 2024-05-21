+ [总目录](../readme.md)
***

***

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
