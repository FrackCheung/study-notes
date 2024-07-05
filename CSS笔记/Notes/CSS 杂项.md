+ [总目录](../readme.md)
***
- [变换](#变换)
- [列表](#列表)
- [伪元素content](#伪元素content)
- [CSS计数器](#css计数器)
- [媒体查询](#媒体查询)
- [Web字体](#web字体)
***
#### 变换
+ 变换: 对元素进行2D/3D的平移, 旋转和缩放, 倾斜
+ 变换使用`transform`属性, 该属性使用多个变换函数, 并按照顺序处理
***
**注解1:** 变换相对于元素自身坐标系, `x`轴向右, `y`轴向下, `z`轴向外

**注解2:** 元素自身坐标系会随元素变化, 比如元素旋转, 坐标系也会随之旋转
***
+ 平移变换: 支持`px`像素值和百分数 (相对于元素边框外侧范围)
  - `translateX`/`translateY`/`translateZ`: 沿自身`x`/`y`/`z`轴平移
  - `translate`: 同时指定`x`, `y`轴上的平移
  - `translate3d`: 同时指定`x`, `y`, `z`轴上的平移距离
***
**注解:** `translate`和`translate3d`可以省略值, 省略值将视为`0`
***
+ 缩放变换: 使用纯数字, 不支持百分数
  - `scaleX`/`scaleY`/`scaleZ`: 围绕自身的`x`/`y`/`z`轴缩放
  - `scale`: 同时指定`x`, `y`轴上的缩放
  - `scale3d`: 同时指定`x`, `y`, `z`轴上的缩放
***
**注解1:** `scale`如果只给定一个值, 将同时用于`x`, `y`轴缩放

**注解2:** 绕`z`轴旋转的前提是元素必须有深度
***
+ 旋转变换: 接受有效的角度值, 如`deg`等, 正数顺时针, 负数逆时针
  - `rotateX`/`rotateY`/`rotateZ`: 围绕自身的`x`/`y`/`z`轴旋转
  - `rotate`: 等同于`rotateZ`, 绕`z`轴旋转
  - `rotate3d`: 绕指定轴旋转, 需要指明轴向量, 和旋转角度
***
**注解:** `rotate(45deg)`等同于`rotate3d(0, 0, 1, 45deg)`
***
+ 倾斜变换: 接受有效的角度值, 如`deg`等
  - `skewX`/`skewY`: 沿自身的`x`/`y`轴倾斜指定角度
  - `skew`: 同时指定`x`, `y`上的倾斜角度
***
**注解1:** `skew(x, y)`不等于`skewX(x) skewY(y)`

**注解2:** `skew`的省略值被视为`0`
***
+ 视矩变换: 这里需要非常熟悉线性代数, 或了解图形学, 否则可以直接略过
  - `matrix`: 使用6个数值, 指定2D变换矩阵
  - `matrix3d`: 使用16个数值, 以列主序方式指定3D变换矩阵
  - `perspective`: 视域, 金字塔透视效果, 接受`px`长度值, 只能正数
***
**注解1:** `matrix`的6个值会被转成如下四阶矩阵  

$
\begin{Bmatrix}
    v1 & v3 & 0 & v5 \\\\
    v2 & v4 & 0 & v6 \\\\
    0  & 0  & 1 & 0 \\\\
    0  & 0  & 0 & 1
\end{Bmatrix}
$
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

#### 列表
+ 使用`display: list-item`可以将任意元素设置为列表项
```CSS
span { display: list-item; }
```
***
**注解:** `li`元素默认即为`list-item`
***
+ 修改列表项的记号类型: 使用`list-style-type`属性, 有几十个取值
  - 默认值: `disc`, 即一个小圆点
  - `decimal-leading-zero`: 将序号前面补零, 同一长度
  - `lower-alpha`: 小写字母
  - `none`: 不显示记号
  - ...
***
**注解:** `list-style-type`可以使用字符串, 但所有的列表项记号都是一样的 
```CSS
li { list-style-type: "@@: "; }
```
***
+ 修改列表项的显示图片: 使用`list-style-image`属性, 默认值`none`
```CSS
ul li {
  list-style-image: url(@/item.png);

  /** 提供一个默认记号类型, 放置图片无法加载时没有记号 */
  list-style-type: decimal-leading-zero;
}
```
***
**注解:** 使用图像的地方, 都可以使用渐变
***
+ 修改列表项的记号位置: 使用`list-style-position`属性
  - 默认值: `outside`, 记号在内容外侧, 离内容有一点距离
  - `inside`: 会将内容往里推, 离内容更近
```CSS
ul li { list-style-position: inside; }
```
***
**注解:** 文字不好描述, 亲自试一试, 并不是在内容的里面或外面这个意思
***
+ 使用`list-style`简写上述属性
```CSS
ul li { list-style: decimal url(@/item.png) inside; }
```

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
