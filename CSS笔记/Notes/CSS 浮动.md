+ [总目录](../readme.md)
***
- [浮动的基本概念](#浮动的基本概念)
- [浮动的规则](#浮动的规则)
- [清除浮动](#清除浮动)
- [块级格式上下文BFC](#块级格式上下文bfc)
***
#### 浮动的基本概念
+ 首先讲述一下正常文档流
  - 文档中的元素按照从左到右, 从上到下的顺序逐行渲染
  - 遇到块级元素, 在单独行渲染
  - 遇到行级元素, 在同行依次渲染, 直至超宽折行
***
**注解1:** 正常文档流中, 块级元素在没有指定高度的情况下, 其高度将由内容决定

**注解2:** 正常文档流的示例, 尝试描述其页面显示
```HTML
<body>
  <div>Hello, DIV</div>
  <img src="index.png">
  <label>Hello, LABEL</label>
  <p>Hello, P</p>
</body>
```
***
+ 通过`float`, 可以将任意元素设置为浮动元素
```CSS
label { float: left; }
```
+ 浮动元素具有如下特点, 以左浮动为例 
  - 浮动元素脱离正常文档流, 不再遵守正常文档流的排布方式
  - 浮动元素吸附到父容器左侧, 其右侧会出现空白区域
  - 浮动元素周围的内容, 进行正常文档流排布, 首先填满右侧区域
  - 浮动元素周围的内容, 填满右侧区域后, 继续向下进行正常文档流排布
***
**总结:** 浮动元素脱离文档流, 周围内容围绕其进行正常文档流排布
***
+ 将上述HTML中的`img`改为左浮动, 尝试描述其页面显示
```HTML
<body>
  <div>Hello, DIV</div>
  <img src="index.png" style="float: left;">
  <label>Hello, LABEL</label>
  <p>Hello, P</p>
</body>
<!-- 你会发现暂时还无法描述的很清楚很准确 -->
```
+ 浮动初衷并不是做页面布局, 而是实现内容环绕, 仍然有必要了解浮动
  - 如果项目需要适配老旧浏览器, `Flexbox`或`Grid`布局无法工作
  - 如果项目需要将浮动布局改造为`Flexbox`或`Grid`布局
  - 如果需要使用浮动的本质目的, 即实现内容环绕效果
***
**注解:** 如果不使用浮动想要实现内容环绕的效果, 所花费的精力和时间将是巨大的
***

#### 浮动的规则
+ 无论什么元素, 在设置为浮动元素后, 都会成为块级盒, 遵守块级盒模型的行为
```CSS
span {
  float: left;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  padding: 10px;
  margin: 10px;
  border: 1px solid green;
  display: block;  /** display语句是多余的 */
}
```
+ 浮动元素相对于父容器的边界:
  - 浮动元素顶部, 不能超过父容器内容区域的顶部
  - 浮动元素左侧, 不能超过父容器内容区域的左侧
  - 浮动元素右侧, 不能超过父容器内容区域的右侧
```CSS
div.container {
  box-sizing: border-box;
  width: 300px;
  padding: 50px;
}
div.content { width: 50px; height: 50px; float: left; }
```
+ 浮动元素不会重叠, 宽度不够就直接换行, 在下一行浮动
```CSS
div.container { width: 300px; height: 300px; }
div[class^="content"] { width: 200px; height: 100px; }
div.content-1 { float: left; }
div.content-2 { float: right; }
```
+ 浮动元素会尽可能浮动在更高的位置上, 但有如下限制:
  - 浮动元素首先要满足父容器边界规则, 即上一条规则
  ```CSS
  div.container { width: 200px; height: 200px; }
  div span { width: 50px; height: 50px; float: left; }
  ```
  - 浮动元素顶部, 不能超过前面的浮动元素的顶部
  ```CSS
  div.container { width: 300px; height: 300px; }
  div[class*="content"] { height: 100px; }
  div.content-1 { width: 200px; float: left; }
  div.content-2 { width: 200px; float: left; }
  div.content-3 { width: 80px; float: right; }
  ```
  - 浮动元素顶部, 不能超过前面的块级元素的顶部
  ```HTML
  <body>
    <div>Hello, DIV</div>
    <img src="index.png" style="float: left;">
    <label>Hello, LABEL</label>
    <p>Hello, P</p>
  </body>
  ```
  - 浮动元素顶部, 不能超过前面的元素生成的盒模型顶部
  ```HTML
  <body style="width: 200px;">
    <span>Hello, SPAN, Hello, SPAN, Hello, SPAN, Hello, SPAN</span>
    <label>
      Hello, LABEL, <img src="index.png" style="float: left"> Hello, LABEL
    </label>
  </body>
  ```
  - 浮动元素尽可能浮动在更高的位置, 即使是新行第一个浮动元素
  ```CSS
  div.container { width: 300px; height: 300px; }
  div[class*="content"] { width: 120px; float: left; }
  div.content-1 { height: 200px; }
  div.content-2 { height: 150px; }
  div.content-3 { height: 150px; }
  ```
***
**注解:** 上述规则中:
+ `前面的元素`: 指的是, 源码中处于浮动元素前面的元素
+ `不能超过`: 指的是, 可以持平
***
+ 打破规则的外边距
  - 负外边距会导致浮动元素溢出父容器内容区域范围
  ```CSS
  div.container { width: 300px; height: 300px; border: 1px solid red; }
  div.content { width: 50px; height: 50px; float: left; margin-left: -10px; }
  ```
  - 外边距会导致后面的浮动元素高于前面的浮动元素
  ```CSS
  div.container { width: 300px; height: 300px; }
  div[class^="content"] { width: 100px; height: 100px; float: left; }
  div.content-1 { margin-top: 50px; }
  ```
***
**注解1:** 可以简单理解为, 上述规则中, 浮动元素以外边距为边界, 负外边距让元素变窄了

**注解2:** 使用负外边距让浮动元素溢出, 和外部内容重叠后, CSS的渲染
+ 和行内元素的盒子重叠, 行内元素的边框/背景/内容, 都在浮动元素之上进行渲染
+ 和块级元素的盒子重叠, 块级元素的边框/背景, 在浮动元素之下渲染, 内容在上

**CSS准则:** 不要在浮动元素上使用负外边距
***

#### 清除浮动
+ 上述浮动规则中, 一直没有提到, 如果浮动元素向下, 直至超过父容器高度会发生什么
+ 答案是: 超过就超过了, 就会一直向下继续浮动, 这样也会对父容器外部的内容产生影响
```CSS
div.container { width: 100px; height: 100px; }
div[class^="content"] { width: 80px; height: 500px; float: left; }
```
***
**注解:** 浮动元素超过父容器高度会对容器外部的内容排布产生影响, 应该尽量避免
***
+ 来看这样一个浮动的例子, 并没有给`div`设置高度
```HTML
<style>
  div { background-color: antiquewhite; }
  img { width: 200px; height:200px; float: left; }
</style>
<div>
  <p>Hello, World</p>
  <img src="index.png">
</div>
<!-- div并没有包裹住img浮动元素, 而是只有p元素的高度 -->
```
+ 这种现场被称为内容折叠
***
**注解1:** 内容折叠是正确的效果, 因为`img`已经脱离文档流, 则`div`高度只由`p`元素决定

**注解2:** 内容折叠不符合预期, 如果想要`div`元素完全包裹住浮动元素, 需要使用清除浮动
***
+ 关于清除浮动: 使用`clear`属性, 其可选值有`left`, `right`, 以及`both`
+ 了解清除浮动的含义, 以左浮动元素为例
  - 浮动元素吸附到父容器左侧, 其右侧的空白区域将由浮动元素后面的元素进行排布
  - 如果希望某个元素, 不要跑到右侧的空白区域, 而是在浮动元素下方重新开始排布
  - 就在该元素上, 使用`clear`属性
+ 清除浮动的真正含义: 让某个元素的左侧, 或者右侧, 或者两侧, 不允许有浮动元素
***
**注解1:** 关于`clear`属性的值:
+ `clear: left`: 元素左侧不允许有浮动元素
+ `clear: right`: 元素右侧不允许有浮动元素
+ `clear: both`: 元素两侧都不允许有浮动元素, 此时元素会在所有浮动元素的下方

**注解2:** 指定清除浮动的元素, 会尽可能的向下移动, 以满足边侧没有浮动元素的条件

**注解3:** 指定清除浮动的元素必须是块级元素
***
+ 解决上述`div`没有完全包裹浮动元素的问题:
  - 方案一: 在`div`中添加一个空元素, 设置清除浮动
  ```HTML
  <style>
  div { background-color: antiquewhite; }
  img { width: 200px; height:200px; float: left; }
  </style>
  <div>
    <p>Hello, World</p>
    <img src="index.png">
    <div style="clear: left"></div> <!-- 添加的空元素 -->
  </div>
  ```
  - 方案二: 使用伪元素, 设置清除浮动
  ```HTML
  <style>
  div { background-color: antiquewhite; }
  img { width: 200px; height:200px; float: left; }
  div::after {
    display: block;
    content: "";
    clear: left;
  }
  </style>
  <div>
    <p>Hello, World</p>
    <img src="index.png">
  </div>
  ```
+ 清除两侧浮动的示例:
```HTML
<style>
  .float-left { width: 200px; height: 200px; float: left; }
  .float-right { width: 200px; height: 600px; float: right; }
  .container::after {
    width: 200px;
    height: 200px;
    content: "";
    display: block;
    clear: both;
  }
</style>
<div class="container">
  <p>Hello, World</p>
  <div class="float-left"></div>
  <div class="float-right"></div>
</div>
```
***
**注解:** 如果伪元素设置的是`clear: left`
+ 伪元素只会处于左浮动元素下方, 因为左侧不允许有浮动元素
+ 伪元素右侧依旧允许有浮动元素
+ 父容器仍然无法完全包裹所有的浮动元素
***
+ 使用清除浮动解决`浮动元素尽可能浮动在更高的位置`所造成的问题:
```CSS
div.container { width: 300px; height: 300px; }
div[class*="content"] { width: 120px; float: left; }
div.content-1 { height: 200px; }
div.content-2 { height: 150px; }
div.content-3 { height: 150px; clear: left; }
```

#### 块级格式上下文BFC
+ 关于浮动元素会影响周围内容排布这个问题:
  - 前文讲的: 浮动元素周围内容, 会填充旁边空白区域, 填满后再在下方区域继续排布
  - 实际情况: 周围的内容, 依旧是从容器内容区域左上角开始排布, 但会避开浮动元素
  ```HTML
  <style>
    div { width: 200px; height: 200px; }
    p { box-sizing: border-box; padding: 0; margin: 0; }
    p.float { width: 100px; height: 100px; float: left; }
    p.normal { width: 100px; }
  </style>
  <div>
    <p class="float">浮动</p>
    <p class="normal">这是一段文本, 而且是一段内容非常多的文本</p>
  </div>
  ```
+ 上述示例, `p.normal`元素的文本并没有进入浮动元素的右侧空白区域
  - 浮动元素和`p.normal`元素都是`100px`的宽度
  - `p.normal`元素按照正常文档流, 会从左边开始, 但会避开浮动元素
  - `p.normal`元素的`100px`宽度制约了文本内容向右渗透
  - `p.normal`元素文本内容只能向下排布, 但也必须避开浮动元素
  - 最终效果: `p.normal`元素文本内容在浮动元素下方排布
***
**注解:** `p.normal`元素的盒子, 包裹了浮动元素的盒子, 二者是重叠的

**思考:** 将`p.normal`元素的宽高设置为`100px`, 会发生什么?
***
+ 将`p.normal`宽度修改为`200px`或者直接移除, 就会看到正常的文字围绕效果
+ 针对上述示例, 进一步提出要求, 希望`p.normal`完全在浮动元素右侧排布
  - `p.normal`在浮动元素右侧
  - `p.normal`文本内容不会进入浮动元素下方
+ 实现方法非常简单, 给`p.normal`设置右浮动`float: right`即可
```HTML
<style>
  div { width: 200px; height: 200px; }
  p { box-sizing: border-box; padding: 0; margin: 0; }
  p.float { width: 100px; height: 100px; float: left; }
  p.normal { width: 100px; float: right; } /** 添加右浮动 */
</style>
<div>
  <p class="float">浮动</p>
  <p class="normal">这是一段文本, 而且是一段内容非常多的文本</p>
</div>
```
***
**注解:** `p.normal`设置右浮动后, 实际上就是在`p.normal`元素上创建了一个BFC
***
+ 关于BFC: 块级格式上下文
  - BFC实际上是一块提供给元素进行布局, 且完全隔离的块级区域
  - BFC内部的元素同样按照标准文档流布局, 也可以创建新的BFC
  - BFC内部的内容, 不会和BFC外部的内容重叠或相互影响
  - BFC彼此之间不会重叠
***
**注解1:** BFC就像小型的文档, 里面的行为和最外层文档的行为没区别, 且里外互不影响

**注解2:** 网页的根元素`html`创建了一个最顶层的BFC
***
+ 如何创建BFC:
  - 将元素设置为浮动元素, 使用`float`属性
  - 将元素的`overflow`属性设置为`visible`以外的值
  - 将元素的`display`设置为`inline-block`, `flex`, `grid`等值
  - 将元素的`position`属性设置为`absolute`或者`fixed`
