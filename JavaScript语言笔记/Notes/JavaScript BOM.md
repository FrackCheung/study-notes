#### JavaScript BOM
+ `window`对象: BOM的核心, 表示浏览器的实例, 具有双重身份:
  - ECMAScript的Global对象在浏览器的实现, 代表一个全局的作用域 
  - 浏览器窗口的JavaScript编程接口
***
**注解**: `window`是浏览器对Global对象的实现, 而在Node.js中, Global被实现为`globalThis`
***
+ `window`对象作为全局作用域
  - JavaScript中定义的所有成员, 都可以访问`window`上定义的对象和方法
  - JavaScript在全局作用域还暴露了很多其他的对象, 都是`window`的属性
  - 由于`window`代表着全局作用域, 因而访问时, 也可以不加`window`
  ```JavaScript
  const div = window.document.querySelector('div');
  const intNumber = window.parseInt('3.14');
  const timer = window.setTimeout(console.log, 0, 1);

  window.getCircleArea = function(radius) {
    return Math.PI * radius * radius;
  }
  const circleArea = getCircleArea(10);
  console.log(circleArea); // 314.1592653589793
  ```
***
**注解**: `let`/`const`定义的全局变量不会成为`window`的属性, `var`会, 但作用域解析是一样的, 访问某个全局变量或函数时, 首先看全局作用域中有无定义, 没有则会在`window`对象的属性中查找
```JavaScript
function parseInt(str) {
  return `Method override: ${str}`;
}
console.log(parseInt('3.14')); // Method override: 3.14
```
***
+ `window`对象作为浏览器窗口的JavaScript编程接口
  - 像素比: `window.devicePixelRatio`, 其值为 物理像素 / CSS像素
  ```html
  <!-- 运行代码, 然后缩放浏览器, 看看效果 -->
  <div style="width: 300px; height: 300px; border: 1px solid green"></div>
  <script>
    const div = document.querySelector("div");
    const reset = () => {
      const ratio = window.devicePixelRatio;
      div.style.width = `${300 / ratio}px`;
      div.style.height = `${300 / ratio}px`;
      requestAnimationFrame(reset);
    };
    reset()
  </script>
  ```
***
**小知识**: 关于像素
+ 物理像素: 是设备实际的像素, 任何尺寸的设备都对应着一个物理分辨率
+ CSS像素: 像素大小是固定的, 任何尺寸的设备都对应着一个CSS分辨率
***
