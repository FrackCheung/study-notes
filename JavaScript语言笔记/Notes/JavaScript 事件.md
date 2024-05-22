+ [总目录](../readme.md)
***
<!-- TOC -->

- [定义事件](#定义事件)
- [部分事件介绍](#部分事件介绍)
- [事件回调中的this](#事件回调中的this)
- [移除事件监听器](#移除事件监听器)
- [事件模拟](#事件模拟)
- [自定义事件](#自定义事件)
- [简易版事件总线](#简易版事件总线)

<!-- /TOC -->
***
#### 定义事件
+ `addEventListener`的第三个参数, 指定了捕获/冒泡模式
+ 默认的事件流是冒泡
+ 事件的传播和执行:
  - 事件流从`document`开始, 传播到目标元素, 沿途定义了捕获模式的事件均会触发
  - 事件流到达目标元素
  - 事件流从目标元素开始, 传播到`document`, 沿途定义了冒泡模式的事件均会触发
```HTML
<div class="outer">
  <div class="center">
    <div class="inner"></div>
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
<!-- 如果在inner上点击, 事件触发的顺序是 center inner outer -->
```

#### 部分事件介绍
+ 焦点事件: `focusin`和`focusout`
  - `focusin`: 元素获得焦点的事件, 支持冒泡
  - `focusout`: 元素失去焦点的事件, 支持冒泡
  - 支持冒泡最大的优势是可以使用事件委托
+ 鼠标点击事件: 
  - `click`事件: 会首先触发`mousedown`事件, 再触发`mouseup`事件, 最后才会触发`click`事件
  - `dblclick`事件: 会依次触发`mousedown`/`mouseup`/`click`事件, 两次后, 再触发`dblclick`事件
  - 点击事件只针对鼠标左键
+ 鼠标点击事件的坐标:
  - 视口坐标: `event.clientX`和`event.clientY`
  - 页面坐标: `event.pageX`和`event.pageY`
  - 屏幕坐标: `event.screenX`和`event.screenY`
***
**页面坐标**: 页面是可能在滚动的, 因此即使点击的是视口上同一位置, 页面如果滚动的不一样, 页面坐标也不一样
***
+ 鼠标事件的修饰键
  - 鼠标事件的参数中有一个修饰键属性, 表示当前用户触发鼠标事件时是否按下的修饰键
  - 修饰键: Ctrl(`ctrlKey`), Shift(`shiftKey`), Alt(`altKey`), Meta(`metaKey`)
  ```JavaScript
  btn.addEventListener('click', event => {
    if (event.ctrlKey) {
      console.log('CTRL + CLICK');
    } else {
      return;
    }
  })
  ```
+ 事件的相关目标`relatedTarget`
  - 相关目标一般只针对鼠标的移动事件
  - `event.target`指向触发该事件的元素
  - `event.relatedTarget`指向触发该事件的元素的相关元素
  ```html
  <body>
    <div style="width: 200px;height: 200px;border: 1px solid red; background-color: green;"></div>
  </body>
  <script>
    document.querySelector('div').addEventListener('mouseenter', e => console.log(e.relatedTarget, e.target))
  </script>
  <!-- target: div -->
  <!-- relatedTarget: body -->
  ```
+ 鼠标移动事件的区别

|   移动事件   |                            描述                            |
| :----------: | :--------------------------------------------------------: |
| `mouseleave` | 不支持冒泡, 指针完全离开目标元素及其所有后代时, 触发该事件 |
|  `mouseout`  |     支持冒泡, 指针离开目标元素的后代时, 也会触发该事件     |
| `mousemove`  |            鼠标指针在元素内部移动时, 触发该事件            |
| `mouseenter` |           鼠标指针首次进入目标元素时, 触发该事件           |
| `mouseover`  |         鼠标指针每次划过目标元素时, 都会触发该事件         |

#### 事件回调中的this
+ 事件处理器中的`this`, 指向注册的元素
+ `event.target`永远指向事件发生的元素
+ 定义箭头函数, 会导致`this`丢失
+ 事件回调参数有一个`currentTarget`属性, 指向回调函数所在的元素, 该值和`this`等同
```HTML
<div class="outer">
  <div class="inner">
  </div>
</div>
<script>
  const outer = document.querySelector('.outer');
  outer.addEventListener('click', function () {
    console.log(this, event.target);
    console.log(this === event.currentTarget); // true
  });
</script>
<!-- 如果在inner上点击, this仍然指向outer, event.target指向inner -->
```

#### 移除事件监听器
+ `removeEventListener`必须传入两个参数, 目标元素和事件回调函数
+ `removeEventListener`传入的事件回调函数必须和`addEventListener`传入的是相同的引用
```JavaScript
// 这种是OK的
const handler = event => console.log(event.clientX, event.clientY);
document.addEventListener('click', handler);
document.removeEventListener('click', handler);

// 这种不行
document.addEventListener('click', event => console.log(event.clientX, event.clientY));
document.removeEventListener('click', event => console.log(event.clientX, event.clientY));
```
***
**注解**: 移除事件监听器必须传入处理回调函数, 是因为元素可以绑定多个同类型的事件, 全部移除太过于极端
***

#### 事件模拟
+ 用于模拟指定的事件, 无需手动触发, 最大的用途是进行前端的UT单元测试
+ 模拟事件的一般步骤:
  - 创建一个指定类型的事件对象
  - 在目标元素上, 调用`dispatchEvent()`, 派发事件, 入参是创建的事件对象
+ 模拟鼠标事件
```JavaScript
const btn = document.querySelector('button');
btn.addEventListener('click', event => console.log(event.ctrlkey));
const mouseEvent = new MouseEvent('click', {
  bubbles: true, // 是否支持冒泡
  cancelable: true, // 是否支持取消
  clientX: 10,
  clientY: 10,
  screenX: 10,
  screenY: 10,
  ctrlKey: true,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  button: 0, // 按键位置 0主键1辅助键2次键
  relatedTarget: null // 只用来模拟鼠标移动事件时需要用到
});
btn.dispatchEvent(mouseEvent);
// true
```
+ 模拟键盘事件
```JavaScript
const input = document.querySelector('input');
input.addEventListener('keydown', event => input.value = event.code);
const keyboardEvent = new KeyboardEvent('keydown', {
  bubbles: false,
  cancelable: false,
  code: 'KeyG',
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
  location: 0,
  repeat: 0
});
input.dispatchEvent(keyboardEvent);
// true
```
***
**注解**: 键盘事件现在使用`code`属性获取键盘的按键码, 使用`key`属性获取对应的字符
***

#### 自定义事件
+ 使用`CustomEvent`构造函数, 接收两个参数, 事件类型, 和事件数据
+ 事件数据类型为`CustomEventInit<T>`, 实例对象仅有一个属性: `detail`
  ```JavaScript
  interface CustomEventInit<T> {
    detail?: T
  }
  ```
+ 在需要触发事件的目标元素上调用`dispatchEvent`派发事件
+ 在需要监听事件的目标对象上使用`addEventListener`监听事件
+ 事件回调函数中, 读取`event.detail`属性获取事件数据
+ **非常重要**: 必须先定义监听, 再派发事件, 否则不会触发
```JavaScript
// 先定义监听事件
window.addEventListener('custom-event-key', event => console.log(event.detail));

// 定义自定义事件并触发
const customEvent = new CustomEvent('custom-event-key', {
  detail: '这是传递的数据'
});
window.dispatchEvent(customEvent);

// 这是传递的数据
```

#### 简易版事件总线
+ 时间总线的核心代码就是自定义事件
+ 尝试用原生代码实现
```TypeScript
export class EventBusService {
  // 记录已经添加的事件, 避免重复添加
  private eventKeySet: Set<string> = new Set();

  /**
   * 监听事件, 返回一个可取消的对象
   * @param key 事件类型, 可以是任意字符串, 不能和已有的标准事件重名
   * @param callback 回调函数
   * @returns 
   */
  public on<T>(key: string, callback: (data: T) => void): { remove: () => void } {
    // 不重复监听
    if (this.eventKeySet.has(key)) {
      return {
        remove: () => {}
      };
    }
    const eventhanlder = event => {
      event.preventDefault();
      event.stopPropagation();
      const data = event.detail as T;
      callback(data);
    }
    window.addEventListener(key, eventhanlder);
    this.eventKeySet.add(key);
    return {
      remove: () => {
        window.removeEventListener(key, eventhanlder);
      }
    }
  }

  /**
   * 触发事件
   * @param key 事件类型
   * @param data 数据
   */
  public cast<T>(key: string, data: T): void {
    const customEvent = new CustomEvent(key, {
      detail: data
    });
    window.dispatchEvent(customEvent);
  }
}
const eventBus = new EventBusService();

// 通常用工具库生成不重复的唯一id
const EVENT_KEY: string = 'fasjkfha4895-fjhasdjfa-358y2389';

const customEvent = eventBus.on<string>(EVENT_KEY, (data: string) => console.log(data));
eventBus.cast<string>(EVENT_KEY, '自定义事件的数据'); // 自定义事件的数据
customEvent.remove();
eventBus.cast<string>(EVENT_KEY, '自定义事件的数据'); // 没有输出
```
