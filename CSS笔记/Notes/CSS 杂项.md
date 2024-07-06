+ [总目录](../readme.md)
***
- [变换](#变换)
- [伪元素content](#伪元素content)
- [CSS计数器](#css计数器)
- [媒体查询](#媒体查询)
- [表格布局](#表格布局)
- [Web字体](#web字体)
***
#### 变换
+ 平移变换: 支持`px`像素值和百分数 (相对于元素边框外侧范围)
  - `translateX`/`translateY`/`translateZ`: 沿自身`x`/`y`/`z`轴平移
  - `translate`: 同时指定`x`, `y`轴上的平移
  - `translate3d`: 同时指定`x`, `y`, `z`轴上的平移距离
+ 缩放变换: 使用纯数字, 不支持百分数
  - `scaleX`/`scaleY`/`scaleZ`: 围绕自身的`x`/`y`/`z`轴缩放
  - `scale`: 同时指定`x`, `y`轴上的缩放
  - `scale3d`: 同时指定`x`, `y`, `z`轴上的缩放
+ 旋转变换: 接受有效的角度值, 如`deg`等, 正数顺时针, 负数逆时针
  - `rotateX`/`rotateY`/`rotateZ`: 围绕自身的`x`/`y`/`z`轴旋转
  - `rotate`: 等同于`rotateZ`, 绕`z`轴旋转
  - `rotate3d`: 绕指定轴旋转, 需要指明轴向量, 和旋转角度
+ 倾斜变换: 接受有效的角度值, 如`deg`等
  - `skewX`/`skewY`: 沿自身的`x`/`y`轴倾斜指定角度
  - `skew`: 同时指定`x`, `y`上的倾斜角度
+ 视矩变换: 这里需要非常熟悉线性代数, 或了解图形学, 否则可以直接略过
  - `matrix`: 使用6个数值, 指定2D变换矩阵
  - `matrix3d`: 使用16个数值, 以列主序方式指定3D变换矩阵
  - `perspective`: 视域, 金字塔透视效果, 接受`px`长度值, 只能正数
***
**注解1:** 变换相对元素自身, `x`轴向右, `y`轴向下, `z`轴向外, 且会随元素变化

**注解2:** `scale`如果只给定一个值, 将同时用于`x`, `y`轴缩放
***
+ 使用`transform`应用上述变换, 变换函数需要空格分隔, 从左到右依次处理
```CSS
div { transform: translate(20px, 50px) rotate(45deg) skewX(10deg); }
```
+ 其他的一些不常用属性:
  - 设置变换的原点, 使用`transform-origin`属性, 默认值是`50% 50%`
  ```CSS
  div { transform-origin: left top 0; } /** z方向可选, 默认为0 */
  ```
  - 设置3D变换方式, 使用`transform-style`属性, 默认值是`flat`
  ```CSS
  div { transform-style: preserve-3d; }
  ```
  - 背景剔除, 使用`backface-visibility`属性, 默认值是`visible`
  ```CSS
  div { backface-visibility: hidden; }
  ```
***
**注解:** 平时只需要了解平移, 缩放, 旋转的常规用法即可
***

#### 伪元素content
+ 使用`::after`和`::before`定义伪元素
```CSS
a[href]::after { content: "[link]" }
```
+ 伪元素必须添加`content`属性, 即使没有内容, 也必须指定空字符串
```CSS
a[href$=".pdf"]::after {
  background-image: url(@/pdf.png);
  width: 20px;
  height: 20px;
  content: "";
}
```
+ 伪元素的`content`可以使用`attr`引用当前元素的属性值
```CSS
a[href]::after { content: attr(href); }
```
+ 伪元素`content`属性中不能使用HTML内容, 会原样显示
```CSS
span::after { content: "<label>Hello, World</label>" }
```
+ 伪元素`content`属性使用空格分隔多个内容
```CSS
a[href]::after { content: "[ " attr(href)  " ]"; }
```
+ 伪元素`content`属性中, 添加`\`以换行书写, 但内容不会换行
```CSS
a[href]::after {
  content: "Hello \
    World";
}
```
+ 伪元素`content`属性中, 如果内容需要再界面上换行, 使用`\A`
```CSS
a[href]::after { content: "Hello \A World"; }
```

#### CSS计数器
+ 创建计数器的名称和起点: 使用`counter-reset`属性, 起点默认为`0`
```CSS
:root { counter-reset: my_counter 4; } /** 从4开始 */
:root { counter-reset: my_counter -10; } /** 可以指定负数 */
:root { counter-reset: my_counter1 1 my_counter2 4; } /** 可以指定多个 */
```
***
**注解:** 计数器可以在全局指定, 也可以在某个元素中指定, 重要的是名称和初始值
***
+ 指定计数器的名称和增量: 使用`counter-increment`属性, 增量默认是`1`
```CSS
h1 { counter-increment: mu_counter; } /** 默认是1 */
h1 { counter-increment: mu_counter 2; } /** 指定为正数 */
h1 { counter-increment: mu_counter -1; } /** 指定为负数 */
```
***
**注解1:** 计数器不会显示初始值, 而是从第一个增量值开始
```CSS
:root { counter-reset: my_counter 5; }
h1 { counter-increment: my_counter -1; }
/** 实际显示的计数为: 4, 3, 2, 1, 0, -1... */
```

**注解2:** 必须定义在需要计数的元素上, 对应元素将会按照源码顺序增量计数
***
+ 显示计数器: 在伪元素的`content`属性中使用`counter`获取计数器的值
```CSS
h1::after { content: counter(my_counter); }
```
+ 计数器完整示例
```HTML
<style>
  :root { counter-reset: myCounter 0; }
  h1 { counter-increment: myCounter; }
  h1::after { content: counter(myCounter); color: red; }
</style>
<body>
  <h1>Title</h1>
  <h1>Title</h1>
  <h1>Title</h1>
</body>
```

#### 媒体查询
+ 媒体查询: 根据不同的设备类型, 应用特定的CSS样式
+ 媒体类型: 即不同的显示设备类型, 具有如下一些关键字
  - `all`: 所有能够呈现Web内容的媒体
  - `print`: 打印媒体, 适用于打印预览
  - `screen`: 呈现Web内容的屏幕媒体, 包括显示器, 手持设备等
  - `speech`: 语音合成, 屏幕阅读等音频渲染设备
+ 基本媒体查询: 针对媒体类型
  - 在`link`标签或`style`标签上使用`media`属性
  ```HTML
  <link media="print" rel="stylesheet" type="text/css" href="index.css">

  <style type="text/css" media="screen"></style>
  ```
  - 在样式表文件中, 使用`@import`限定媒体类型
  ```CSS
  @import url(screen.css) screen;
  ```
  - 在样式表文件中, 使用`@media`指定媒体类型对应的规则
  ```CSS
  @media screen { }
  ```
***
**注解1:** 不指定媒体类型的CSS规则, 将应用于所有媒体类型, 适合通用样式

**注解2:** 以上指定媒体类型的地方, 都可以使用逗号分隔多个媒体
```HTML
<style type="text/css" media="screen, print"></style>
```
***
+ 复杂媒体查询: 针对媒体特性, 特性需要加`()`, 以下介绍部分
  - 视口尺寸: `width`/`height`, 包括`min-`/`max-`, 不再赘述
  ```CSS
  @media (min-width: 1024px) {  }
  ```
  - 设备尺寸: `device-width`/`device-height`, 包括`min-`/`max-`, 不再赘述
  ```CSS
  @media (min-device-width: 1024px) {  }
  ```
  - 视口宽高比: `aspect-ratio`, 包括`min-`/`max-`, 不再赘述
  ```CSS
  @media (min-aspect-ratio: 1.7) {  }
  ```
  - 设备宽高比: `device-aspect-ratio`, 包括`min-`/`max-`, 不再赘述
  ```CSS
  @media (max-device-aspect-ratio: 1.7) {  }
  ```
  - 彩色显示: `color`, 包括`min-`/`max-`, 不再赘述
  ```CSS
  @media (max-color: 128) {  }
  ```
  - 分辨率: `resolution`, 包括`min-`/`max-`, 不再赘述
  ```CSS
  @media (min-resolution: 72) {  }
  ```
  - 是否横屏: `orientation`, 其值只有两个, `portrait`/`landscape`
  ```CSS
  @media (orientation: portrait) {  } /** 竖屏显示 */
  @media (orientation: landscape) {  } /** 横屏显示 */
  ```
+ 组合多个媒体查询
  - 使用逗号, 执行`或`运算, 一个满足条件即可应用
  ```CSS
  @media (max-width: 640px), (orientation: portrait) {  }
  ```
  - 使用`and`, 执行`且`运算, 全部满足条件才可应用
  ```CSS
  @media screen and (color) {  }
  ```
  - 使用`not`执行`非`运算, 必须用在最前面, 否定`整个`查询
  ```CSS
  @media not print and (min-width: 1024px) {  }
  ```
  - `only`: 在不支持媒体查询的浏览器中隐藏样式表
  ```CSS
  @import url(index.css) only screen;
  /** 如果支持媒体查询, 正常应用, 不支持, index.css不会应用 */
  ```
***
**注解:** 分页媒体, 和印刷媒体等几乎用不到的东西, 不再赘述
***
+ 视口`meta`标签: 用于指定视口宽度, 仅适用于移动端
  - 该标签告诉移动端, 网页是响应式的, 如果不加, 移动端将会模拟桌面浏览器
  - 使用`initial-scale`指定缩放比例, 使用`width`指定宽度
```HTML
<meta name="viewport" content="width=device-width, initial-scale=1">
```

#### 表格布局
+ 表格布局: 使用CSS将元素展示为和`table`标签一样的效果
+ 表格布局: 使用`display`属性, 将元素指定显示为表格相关的内容
  - `table`: 将元素显示为块级表格, 类似于创建了`<table>`表格
  - `table-caption`: 类似于创建了`<caption>`标签
  - `table-header-group`: 类似于创建了`<thead>`标签
  - `table-footer-group`: 类似于创建了`<tfoot>`标签
  - `table-row`: 类似于创建了`<tr>`标签
  - `table-row-group`: 类似于创建了`<tbody>`标签
  - `table-cell`: 类似于创建了`<td>`标签
  - `table-column`: 类似于创建了`<col>`标签
  - `table-column-group`: 类似于创建了`<colgroup>`标签
+ 示例代码:
```HTML
<style>
  .table { display: table; }
  .table-caption { display: table-caption; }
  .table-header-group { display: table-header-group; }
  .table-row-group { display: table-row-group; }
  .table-row { display: table-row; }
  .table-cell { display: table-cell; }
  .table-footer-group { display: table-footer-group; }
</style>
<div class="table">
  <div class="table-caption">Table Title</div>
  <div class="table-header-group">
    <div class="table-cell">Name</div>
    <div class="table-cell">Age</div>
  </div>
  <div class="table-row-group">
    <div class="table-row">
      <div class="table-cell">张三</div>
      <div class="table-cell">18</div>
    </div>
    <div class="table-row">
      <div class="table-cell">李四</div>
      <div class="table-cell">20</div>
    </div>
  </div>
  <div class="table-footer-group">Table Footer</div>
</div>
```
+ 关于`table-column`和`table-column-group`, 即`col`和`colgroup`标签
  - `col`和`colgroup`针对表格中的某一列或多列进行处理, 如设置列样式
  - `colgroup`表示列组, 使用`span`属性指定列组中列的数量
  ```HTML
  <!-- 假设表格一共有5列, 前3列背景色是绿色, 后3页背景是黄色 -->
  <table>
    <colgroup span="3" style="background-color: green"></colgroup>
    <colgroup span="2" style="background-color: yellow"></colgroup>
    <!-- 省略 -->
  </table>
  ```
  - `colgroup`中嵌套使用`col`, 可以对列组中的列进一步设置
  ```HTML
  <table>
    <colgroup span="3" style="background-color: green">
      <col span="2" style="color: red;">
      <col span="1" style="color: black;">
    </colgroup>
    <!-- 省略 -->
  </table>
  ```
  - `display`设置`table-column`/`table-column-group`的元素不会渲染, 仅作列分组
  ```HTML
  <style>
    .table-column-group {
      display: table-column-group;
      background-color: green;
    }
    .table-column { display: table-column; }
  </style>
  <div class="table">
    <div class="table-column-group" span="2">
      <div class="table-column" span="1" style="width: 200px;"></div>
      <div class="table-column" span="1" style="width: 300px;"></div>
    </div>
    <!-- 省略 -->
  </div>
  ```
+ 表格对齐: 水平使用`text-align`, 垂直使用`vertical-align`, 不再赘述
+ 表格边框: 使用`border-collapse`定义单元格边框是否折叠, 默认值`seperate`

#### Web字体
+ 使用`@font-face`定义字体, 必须包含字体名称和路径
```CSS
@font-face {
  font-family: 'MyFont';
  src: url(my_font.woff) format('woff');
}
```
***
**注解:** 关于路径
+ 可以使用`local`加载本地字体, 如果用户计算机已经安装该字体, 则可用
+ 需要指定格式, 所有浏览器都支持`woff`, `woff2`压缩率更高, 但支持度不高
+ 可以指定多个字体源, 用逗号分隔
```CSS
@font-face {
  font-family: 'MyFont';
  src: local('Custom Font'),
       local('Custom Font2'),
       url(@/font.woff2) format('woff2'),
       url(@/font.woff) format('woff');
}
```
***
+ `@font-face`中可以指定字体的样式, 也可以在使用的时候指定
```CSS
@font-face {
  font-family: 'MyFont';
  src: url(@/font.woff) format('woff');
  font-style: normal;
  font-weight: bold;
}
```
+ 使用字体, 直接在其他使用字体的元素中指定`font-family`属性
```CSS
div { font-family: 'MyFont', sans-serif; } /** 一定要提供回退字体 */
```
