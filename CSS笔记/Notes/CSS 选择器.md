+ [总目录](../readme.md)
***
- [基础选择器](#基础选择器)
- [复合选择器](#复合选择器)
- [伪元素选择器](#伪元素选择器)
- [伪类选择器](#伪类选择器)
***
#### 基础选择器
+ 通配选择器: 使用`*`通配符
  ```CSS
  * { font-size: 14px; }
  ```
+ 标签选择器: 使用元素标签
  ```CSS
  div { font-size: 14px; }
  ```
+ 类选择器: 使用`.`加上`class`名称
  ```CSS
  .container { font-size: 14px; }
  ```
***
**注解:** 空格分隔的多个词组成的`class`, 依然可以通过单个词的类选择器选择
```HTML
<style>
  .login {
    background-color: orange;
  }
</style>
<button class="login primary large">Login</button>
```
***
+ ID选择器: 使用`#`加上ID名称
  ```CSS
  #login { display: block; }
  ```
+ 属性选择器: 使用`[]`, 具体有如下几种情况
  - 选择拥有属性的元素: 使用`[attr]`
  ```CSS
  /** 选择所有具有href属性的元素 */
  [href] { color: black; }
  ```
  - 选择属性值严格等于`value`的元素: 使用`[attr="value"]`
  ```CSS
  /** 选择所有type属性为file的元素 */
  [type="file"] { display: block; }
  ```
  - 选择属性值以`value-`开头的元素: 使用`[attr|="value"]`
  ```CSS
  /** 选择所有class属性为login-开头的元素 */
  [class|="login"] { display: block; }
  ```
  - 选择属性值包含`value`子串的元素: 使用`[attr*="value"]`
  ```CSS
  /** 选择所有href属性包含https的元素 */
  [href*="https"] { color: orange; }
  ```
  - 选择空格分隔的属性值包含`value`的元素: 使用`[attr~="value"]`
  ```CSS
  /** <button class="login small primary">login</button> */
  /** 选择所有class属性包含value的元素 */
  [class~="login"] { display: block; }
  ```
  - 选择属性值以`value`开头的元素: 使用`[attr^="value"]`
  ```CSS
  /** 选择所有href属性以https开头的元素 */
  [href^="https"] { color: orange; }
  ```
  - 选择属性值以`value`结尾的元素: 使用`[attr$="value"]`
  ```CSS
  /** 选择所有href以.pdf结尾的元素 */
  [href$=".pdf"] { background-image: url(@images/pdf.icon.png); }
  ```
***
**注解:** 选择器都默认在全局中搜索, 如果要指定搜索元素, 需要手动指定
```CSS
/** 默认, 选择所有type属性为file的元素 */
[type="file"] {
  display: inline-block;
}

/** 选择所有type属性为file的input元素 */
input[type="file"] {
  display: inline-block;
}
```
*** 

#### 复合选择器
+ 组合选择器: 使用`,`逗号分隔, 同时选中多个元素
  ```CSS
  h1, h2, h3, h4, h5, h6 { font-weight: bold; }
  ```
+ 后代选择器: 使用` `空格, 选中元素的后代元素
  ```CSS
  div span { font-weight: bold; }
  ```
+ 子元素选择器: 使用`>`符号, 选中元素的直系子元素
  ```CSS
  body > * > span { font-weight: bold; }
  ```
+ 相邻兄弟选择器: 使用`+`符号, 选中元素紧跟着的兄弟元素
  ```CSS
  label + input { text-align: center; }
  ```
+ 普通兄弟选择器: 使用`~`符号, 选中元素后面的兄弟元素, 可以不相邻
  ```CSS
  label ~ input { text-align: center; }
  ```
***
**注解:** 要注意, 选中的元素可能不止一个
***

#### 伪元素选择器
+ 伪元素在HTML结构中并不存在, 相当于CSS提供的一个福利
+ 伪元素需要使用两个`::`, 以区别接下来的伪类
+ 首行伪元素: 使用`::first-line`, 选中元素中文本的首行
  ```CSS
  p::first-line { text-indent: 10px; }
  ```
+ 首字母伪元素: 使用`::first-letter`, 选中元素文本中的首字母
  ```CSS
  p::first-letter { text-transform: uppercase; }
  ```
***
**注解:** 首行和首字母伪元素选择器只能用在块级元素中
***
+ 在选中元素之前插入内容: 使用`::before`
  ```CSS
  label {
    display: block;
    width: 200px;
    height: 60px;
    border-radius: 30px;
    background-color: gray;
    position: relative;
  }

  label::before {
    content: "";
    position: absolute;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    left: 10px;
    top: 10px;
  }
  ```
+ 在选中元素之后插入内容: 使用`::after`
  ```CSS
  a[href$=".pdf"]::after {
    content: "";
    width: 16px;
    height: 16px;
    background-image: url(@image/pdf.icon.png);
  }
  ```
***
**注解1:** `::after`和`::before`伪元素的样式定义中, `content`属性的内容会成为该伪元素的文本内容, 展示在页面上

**注解2:** `content`必须指定, 即使不需要文本内容, 也要显示的指定空字符串

**注解2:** `::after`和`::before`伪元素插入到当前元素的内容中, 可以简单理解为成为了当前元素的子元素
***
+ CSS计数器, 配合`::before`和`::after`一起使用
  - 在任意地方使用`counter-reset`指定计数器名称和初始值(默认为1)
  - 在`::before`和`::after`中
    - `content`属性中, 使用`counter`引用计数器
    - 使用`counter-increment`属性, 定义计数器增量
  ```HTML
  <style>
   :root {
      counter-reset: countName 0;
    }

    div > p::before {
      content: counter(countName);
      counter-increment: countName 10
    } 
  </style>
  <div>
    <p>段落1</p>
    <p>段落2</p>
    <p>段落3</p>
  <div>
  <!-- 10. 段落1 -->
  <!-- 20. 段落2 -->
  <!-- 30. 段落3 -->
  ```
***
**注解1:** 计数器会先自增, 再赋值给`content`

**注解2:** 关于计数器, 在CSS技巧篇会再次详细描述
***

#### 伪类选择器
+ 伪类使用`:`单个冒号
+ 结构性伪类选择器:
  - 根元素选择器: 使用`:root`
  ```CSS
  :root { font-size: 16px; }
  ```
  - 第一个子元素选择器: 使用`:first-child`
  ```CSS
  p:first-child { font-size: 16px; }
  ```
  - 最后一个子元素选择器: 使用`:last-child`
  ```CSS
  p:last-child { font-size: 16px; }
  ```
  - 唯一子元素选择器: 使用`:only-child`
  ```HTML
  <style>
    :only-child {
      border: 1px solid red;
    }
  </style>
  <p>
    <label>Hello, World!</label>
  </p>
  <div>
    <span>Hello, World!</span>
    <input type="file">
  </div>
  <!-- body和label都会加上边框 -->
  ```
  - 唯一类型的子元素选择器: 使用`:only-of-type`
  ```HTML
  <style>
    :only-of-type {
      border: 1px solid red;
    }
  </style>
  <p>
    <span>Hello</span>
    <img src="index.png">
  </p>
  <!-- span, img, p, body都会加上边框 -->
  ```
  - 第n个子元素选择器: 使用`:nth-child(index)`
  ```HTML
  <!-- 选中body元素的第3个子元素 -->
  <style>
    body > :nth-child(3) {
      color: green;
    }
  </style>
  <body>
    <span>111</span>
    <label>222</label>
    <span>333</span>
    <label>444</label>
  </body>
  <!-- 333的颜色会变成绿色 -->
  ```
  - 倒数第n个子元素选择器: 使用`:nth-last-child(index)`
  - 第n个特性类型的子元素选择器: 使用`:nth-of-type(index)`
  ```HTML
  <!-- 选中body元素的第3个子元素 -->
  <style>
    body > label:nth-of-type(2) {
      color: green;
    }
  </style>
  <body>
    <span>111</span>
    <label>222</label>
    <span>333</span>
    <label>444</label>
  </body>
  <!-- 444的颜色会变成绿色 -->
  ```
  - 倒数第n个特定类型的子元素选择器: 使用`:nth-last-of-type(index)`
***
**注解:** 关于`:only-child`和`:only-of-type`
+ `:only-child`:
  - 单独使用, 选中所有没有任何兄弟元素的元素
  - 如果只想针对某个类型的元素, 则需要组合其他选择器
  - 以下示例, 选中了没有兄弟元素的label元素
  ```CSS
  label:only-child {
    border: 1px solid red;
  }
  ```
+ `:only-of-type`:
  - 单独使用: 会选中所有没有同类兄弟元素的元素
  - 如果只想针对某个类型的元素, 则需要组合其他选择器
  - 以下示例, 选中了没有同类兄弟元素的img元素
  ```CSS
  img:only-of-type {
    border: 1px solid red;
  }
  ```
***
+ UI伪类选择器 (部分):
  - 启用和禁用伪类: 使用`:enabled`和`disabled`
  ```CSS
  /** enabled其实可以省略 */
  input:enabled { border: 1px solid green; }
  input:disabled { border: 1px solid gray; }
  ```
  - 勾选伪类选择器: 使用`checked`
  ```CSS
  input:checked + label { background-color: green; }
  ```
+ 动态伪类选择器: 
  - 未访问和已访问的超链接: 使用`:link`和`:visited`
  ```CSS
  a:link { text-decoration: none; }
  a:visited { color: blue; }
  ```
  - 鼠标悬停伪类选择器: 使用`:hover`
  ```CSS
  button:hover { background-color: gray; }
  ```
  - 点击激活伪类选择器: 使用`:active`
  ```CSS
  button:active { background-color: green; }
  ```
  - 聚焦伪类选择器: 使用`:focus`
  ```CSS
  input:focus { border: 1px solid green; }
  ```
***
**注解:** `:hover`和`:active`触发的方式依照浏览器自行决定, 多数情况下, 是悬停和点击

**思考题:** 在一个元素上点击, `:hover`, `:active`和`:focus`三种样式谁生效?
***
+ 其他伪类选择器:
  - 否定伪类选择器: 使用`:not`
  ```CSS
  a:not([href^="https"]) { color: green; }
  ```
  - 没有子元素的元素选择器: 使用`:empty`
***
**注解1:** `:empty`还有一种解释, 没有任何子节点的元素, 即该元素中不能有任何的节点, 包括元素/文本节点, 但注释节点又不算

**注解2:** 否定伪类只能使用简单选择器, 即类/标签/ID/属性/伪类选择器, 不能包含复合选择器等其他选择器
***
