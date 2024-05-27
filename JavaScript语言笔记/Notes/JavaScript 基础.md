+ [总目录](../readme.md)
***
+ [script标签](#script标签)
+ [严格模式](#严格模式)
+ [定义变量](#定义变量)
+ [表单](#表单)
***
#### script标签
+ `async`: 异步加载脚本, 阻止页面其他行为, 只适用外部脚本
+ `defer`: 文档被完全解析和显示后再执行, 只适用于外部脚本
+ `type`: 值为`module`时, 脚本中才允许出现ES6模块
+ `<script></script>`中包裹的JavaScript代码不允许出现`</script>`字符串, 须使用转义, `<\/script>`
+ `<noscript>`: 针对不支持或关闭JavaScript的浏览器的解决方案
+ `DOMContentLoaded`: 即使是`defer`修饰的脚本, 也会在`DOMContentLoaded`事件前执行
+ 外部/内联代码共享`global/window`对象, 共享命名空间, 可以进行交互
+ 变量提升, 在`边界`中不适用: 即在第一个`<script>`中调用第二个`<script>`中定义的方法

#### 严格模式
+ 在脚本顶部或者函数顶部使用`'use strict'`启用严格模式
+ 严格模式下不允许先使用, 再定义
  ```JavaScript
  'use strict'
  name = 'zhangzhen';
  var name;
  ```
+ 严格模式下直接调用的函数中的`this`指向undefined
+ 严格模式下, 函数内部的`arguments`和传参不再强绑定

#### 定义变量
+ `var`只有两种作用域: 函数作用域和全局作用域
+ `var`定义的变量会提升到`作用域的顶部, 只提升声明, 不提升赋值
  ```JavaScript
  console.log(name); // undefined
  var name = 'zhangzhen';
  ```
+ `var`可以反复重复定义相同名称的变量
  ```JavaScript
  var name = 'zhangsan';
  var name = 'lisi';
  var name = 'wangwu';
  ```
+ `var`定义的全局变量会成为`global`对象的属性(`let/const`则不会)
  ```JavaScript
  var name = 'zhangzhen';
  console.log(window.name); // zhangzhen
  ```
+ `var`定义的for循环变量只有一个, 且会提升到顶部, 导致多个循环迭代共享
  ```JavaScript
  for (var index = 0; index < 5; index++) {
    setTimeout(() => {
      console.log(index);
    }, 0);
  }
  // 5 5 5 5 5
  ```
+ `let/const`会为for循环的每一次迭代单独分配变量
+ `let/const`遵循块级作用域, 且不允许重复声明
  ```JavaScript
  {
    let name = 'zhangzhen';
  }
  console.log(name); // RefrenceError
  ```
+ `let/const`声明的全局变量不会成为`global`的属性
  ```JavaScript
  let name = 'zhangzhen';
  console.log(window.name); // undefined
  ```
+ `const`定义的变量不允许重新赋值, 但可以修改定义对象的内部属性
+ 非严格模式下, 未使用`定义词`定义的变量会自动成为全局变量
  ```JavaScript
  function test() {
    name = 'zhangzhen';
  }
  test();
  console.log(name); // zhangzhen
  ```

#### 表单
