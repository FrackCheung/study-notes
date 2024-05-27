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
+ 使用`form`元素创建表单, 表单具有如下的属性和方法
  - `action`: 表单数据要发送到的URL
  - `method`: 请求的方法, 通常是`get`/`post`
  - `name`: 表单的名字
  - `enctype`: 表单编码方式
  - `submit()`: 提交表单
  - `reset()`: 重置表单
+ 表单元素的获取
  - 使用选择器: `document.querySelector()`
  - 使用索引快速引用: `document.forms[index]`
  - 使用`name`快速引用: `document.forms[name]`
+ 表单的控件: 表单内的所有输入型元素, 每个元素都需要指定`name`属性
+ 表单字段的获取: 表单的`elements`属性, 保存了所有控件的`HTMLCollection`
  - 使用索引: `document.elements[index]`
  - 使用`name`: `document.elements[name]`
+ 提交表单时, 表单会将控件的`name`和其`value`组合为表单数据, 发送给接口
```html
<form name="loginForm" action="/login" method="post">
  <input name="user" type="text" />
  <input name="password" type="password" />
  <input type="submit" />
  <input type="reset" />
</form>
<!-- 最终传给接口的数据 name: value, password: value-->
```
+ 表单重置: 会将表单的字段值重置为默认, 如果指定了`value`, 则使用该值, 没有指定则为空
+ 使用`submit`事件, 可以拦截事件并加入自定义处理
  ```JavaScript
  document.querySelector('form').addEventListener('submit', e => {
    e.preventDefault();
  });
  ```
+ 表单数据
  - 表单数据不会包含被禁用的字段
  - 表单数据不会包含没有值的字段
  - 在前端, 无法使用通用的方法, 将表单数据直接获取到
+ 表单校验
  - 表单在提交时会校验, 对于不符合要求的字段给出提示, 如`required`等
  - 表单只能逐个校验, 每次提交, 只会提示出第一个遇到的不符合要求的值
  - 在表单上使用`formnovalidate`属性, 可以禁用表单的验证
+ 表单编码, 使用`enctype`属性指定表单的数据编码方式
  - `application/x-www-form-urlencoded`: 默认编码方式, 不支持二进制文件, 数据会被进行URL编码
  - `multipart/form-data`: 需要使用文件时, 必须指定为该编码
  ```html
  <!-- 默认编码, 文件名会传到接口, 以字符串的形式 -->
  <form
    name="loginForm"
    action="/login"
    method="post"
    enctype="application/x-www-form-urlencoded"
  >
    <input name="user" type="text" />
    <input name="password" type="password" />
    <input name="file" type="file" />
    <input type="submit" />
    <input type="reset" />
  </form>
  <!-- user=111&password=11&file=alm-next-ui.code-workspace -->

  <!-- 需要上传文件 -->
  <form
    name="loginForm"
    action="/login"
    method="post"
    enctype="multipart/form-data"
  >
    <input name="user" type="text" />
    <input name="password" type="password" />
    <input name="file" type="file" />
    <input type="submit" />
    <input type="reset" />
  </form>
  <!-- user: 111 -->
  <!-- password: 111 -->
  <!-- file: (二进制文件) -->
  ```
+ 表单控件
  - `checkbox`复选框的选中默认value值是`on`, 不勾选, 则表单不会带上该字段
  - `radio`单选框, 多个控件使用相同的`name`, 即可实现互斥的选项
  - `fieldset`分组, 将一批控件塞到一个分组中, 使用`legend`指定描述
  - 在`fieldset`上指定`disabled`属性, 则整个分组的控件会被全部禁用
  ```html
  <fieldset>
    <legend>账户登录</legend>
    <input name="user" type="text" />
    <input name="password" type="password" />
    <input name="remember" type="checkbox" />
  </fieldset>
  <fieldset>
    <legend>兴趣爱好</legend>
    <input name="habit" type="radio" value="sleeping" checked />
    <input name="habit" type="radio" value="dating" />
    <input name="habit" type="radio" value="chatting" />
  </fieldset>
  <!-- 勾选复选框: user=111&password=11&remember=on&habit=sleeping -->
  <!-- 不勾选复选框: user=111&password=11&habit=sleeping -->
  ```
+ 表单外的控件: 给控件指定`form`属性, 其值为表单元素的`id`
  ```html
  <form id="loginForm">
    <input type="submit" />
    <input type="reset" />
  </form>
  <input name="user" type="text" form="loginForm">
  ```
***
**表单的优势**:
+ 表单会自动验证字段的值, 不符合要求会弹出提示
+ 表单会自动整合内部控件的字段值, 以`name + value`的形式
+ 表单提供了`elements`属性, 直接定位到表单内的控件
 
**表单的不足**:
+ 表单验证只能逐个进行, 每次点击提交, 提示第一个遇到的不符合要求的字段
+ 对于禁用/没有值的字段, 表单数据直接不包含
+ 表单的提交默认是同步请求, 会阻塞主线程
+ 表单的数据不是JSON格式, 无法处理更通用的接口通信

**总结**:
+ 表单最大的优势是数据验证和数据整合, 由于诸多缺陷, 通常建议不使用原生表单
+ 如需使用原生表单, 则需要添加进一步的数据处理和校验规则
+ 使用UI库中的表单, 要比直接使用独立组件更好
***
+ 使用独立的文件传输, 在非表单中传输文件
  ```JavaScript
  const file = document.querySelector('input[type="file"]');
  file.addEventListener('change', e => {
    const form = new FormData();
    form.append('file', e.target.files[0]);
    this.axios.post(url, form);
  });
  // 服务器必须处理为接受FormData, 而非JSON
  ```
