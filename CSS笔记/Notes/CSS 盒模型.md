+ [总目录](../readme.md)
***
- [标准盒模型](#标准盒模型)
- [替代盒模型](#替代盒模型)
- [外边距](#外边距)
- [统一间距](#统一间距)
***
#### 标准盒模型
+ 标准盒模型分为两种: 块级盒(`block`)和行内(`inline`)盒
+ 块级盒的行为:
  - 块级盒独占一行, 可以使用`width`和`height`指定宽高
  - 块级盒的内边距, 外边距会推开周围的其他元素
  - 块级盒宽度会填充容器的可用空间, 除非显示指定`width`
+ 行内盒子的行为:
  - 行内盒会和其他行内盒一起排列, 无法使用`width`和`height`
  - 行内盒垂直方向的内外边距和边框可以用, 但不会推开其他行内盒
  - 行内盒水平方向的内外边距和边框可以用, 而且会推开其他行内盒
```HTML
<style>
  html, body { margin: 0; }
  p { width: 200px; }
  span {
    width: 200px;
    height: 200px;
    border: 1px solid green;
    padding: 20px;
    margin: 20px;
  }
</style>
<body>
  <p>
    在p元素中, 写入大量的文本, 并将p元素宽度设置为200px, 
    在此情况下, 文本就会显示为多行, 在文本内容的中间, 
    插入一个<span>span</span>元素, 给span元素设置宽高,
    内外边距和边框, 然后查看效果, 会发现, 宽高不起作用,
    边框/内外边距都应用了, 但是竖直方向的文本排布不受影响
  </p>
</body>
```
***
**注解:** 通过`display`属性可以修改盒类型
***
+ 标准盒模型的组成部分
  - 内容: 使用`width`和`height`指定的区域
  - 内边距: 内容周围的空白, 使用`padding`指定
  - 边框: 用于包裹内容和内边距区域, 使用`border`指定
  - 外边距: 盒与盒之间的空白, 使用`margin`指定
+ 标准盒模型的实际可见尺寸: 外边框组成的边界尺寸
+ 标准盒模型的实际占用尺寸: 外边距组成的边界尺寸
```CSS
div {
  width: 200px;
  height: 200px;
  padding: 100px;
  border: 50px solid red;
  margin: 100px;
}
/** 盒子的实际可见尺寸: 宽度500px, 高度500px */
/** 盒子的实际可见尺寸: 宽度700px, 高度700px */
```
***
**注解1:** 标准盒模型适用于块级盒, 而行内盒仅仅只是用到了标准盒模型的部分行为

**注解2:** 使用标准盒模型, 一定要注意`width`和`height`:
+ `width`和`height`指定的是盒子的内容区域尺寸
+ 边框/外边距/内边距, 会追加到内容区域, 可见尺寸会增大
+ 布局设计时, 容易导致元素折行错位, 效果不达预期
```CSS
html, body { margin: 0; width: 100%; height: 100% }
div {
  display: inline-block;
  padding: 20px;
  border: 5px solid green;
  height: 50px;
}
div.left { width: 50%; }
div.right { width: 50%; }
```

**魔术数字:** 通过不停的修改数值, 从而达到预期布局, 这些值不是设计出来的, 而是"试"出来的

**轮廓:** 轮廓不属于盒模型, 使用`outline`属性为元素指定轮廓
+ 轮廓不影响布局, 不占用任何空间, 只是单纯的视觉效果
+ 轮廓可以是非矩形, 也可以不连续, 无法分别为某条边单独设置
+ 边框外侧线, 骑在轮廓宽度的正中央
```CSS
/** 颜色, 样式, 宽度 */
div { outline: red dashed 10px; }
```
***

#### 替代盒模型
+ 替代盒模型和标准盒模型的行为方式完全一致
+ 替代盒模型使用`width`和`height`指定盒子的实际可见尺寸
+ 指定`box-sizing`属性为`border-box`以使用替代盒模型
```CSS
div { box-sizing: border-box; }
```
+ 替代盒模型中, 内容区域的尺寸等于实际可见尺寸减去边框和内边距
```CSS
div {
  box-sizing: border-box;
  width: 500px;
  height: 500px;
  padding: 50px;
  border: 20px solid red;
  margin: 50px;
}
/** 盒子的实际可见尺寸: 宽度500px, 高度500px */
/** 盒子的内容区域尺寸: 宽度360px, 高度360px */
```
+ 强烈建议使用替代盒模型, 这样就只需要考虑`margin`对于布局的影响
```CSS
*, ::before, ::after {
  box-sizing: border-box;
}
div {
  display: inline-block;
  padding: 20px;
  border: 5px solid green;
  height: 50px;
}
div.left { width: 50%; }
div.right { width: 50%; }
```
***
**注解:** `box-sizing`的默认值是`content-box`, 使用`width`和`height`指定内容区域尺寸, 即标准盒模型
***
+ 关于`inline-block`, 会创建行内块级盒, 拥有部分块级和行内盒的效果
  - 行内块级盒子可以设置`width`和`height`
  - 行内块级盒子的`padding`, `margin`, `border`可以推开其他内容
  - 行内块级盒子前后不会换行, 和其他行内盒子排在同一行
***
**注解:** 行内元素, 包括行内块级元素, 元素之间的空白符, 会导致存在间距
```HTML
<!-- 写法1 -->
<button>Hello</button>
<button>World</button>

<!-- 写法2 -->
<button>Hello</button><button>World</button>
```
***

#### 外边距
+ 外边距是盒模型中唯一可以设置为负数值的属性
+ 外边距在不同的方向设置负数, 会产生不同的行为
  - 设置左侧外边距为负数, 会将自己的盒子向左移动
  ```HTML
  <body>
    <div style="width: 200px; height: 50px; margin-left: -100px"></div>
  </body>
  <!-- 盒子会向左移动100px -->
  ```
  - 设置顶部外边距为负数, 会将自己的盒子向上移动
  ```HTML
  <body>
    <div style="width: 50px; height: 200px; margin-top: -100px"></div>
  </body>
  <!-- 盒子会向上移动100px -->
  ```
  - 设置右侧外边距为负数, 会将右侧的盒子拉向自己
  ```HTML
  <style>
    div { display: inline-block; }
  </style>
  <body>
    <div style="width: 200px; height: 50px; margin-right: -100px"></div>
    <div style="width: 200px; height: 50px;"></div>
  </body>
  <!-- 会把第二个div的盒子向自己拉近100px -->
  ```
  - 设置底部外边距为负数, 会将下方的盒子拉向自己
  ```HTML
  <body>
    <div style="width: 50px; height: 200px; margin-bottom: -100px"></div>
    <div style="width: 50px; height: 200px;"></div>
  </body>
  <!-- 会把第二个div的盒子向自己拉近100px -->
  ```
  - 同时设置左右外边距为负数, 则效果叠加, 既向左移动, 也把右侧盒子拉向自己
  ```HTML
  <body>
    <div style="width: 200px; height: 50px; margin: 0 -100px"></div>
  </body>
  <!-- 盒子会向左移动100px, 右侧没有盒子, 则什么也不做 -->
  ```
  - 同时设置上下外边距为负数, 则效果叠加, 既向上移动, 也把下方盒子拉向自己
  ```HTML
  <body>
    <div style="width: 50px; height: 200px; margin: -100px 0"></div>
  </body>
  <!-- 盒子会向上移动100px, 下方没有盒子, 则什么也不做 -->
  ```
  - **TIPS:** 没有指定宽度的块级元素, 两边设置负外边距, 元素两侧都会拉长
  ```HTML
  <body>
    <div style="height: 200px; margin: 0 -100px"></div>
  </body>
  <!-- 盒子两侧都会溢出100px, 视觉上来看, 就好像盒子被拉长了200px -->
  ```
  
***
**注解:** 对于行内盒来说, 水平方向外边距依然遵循上述规律, 垂直方向外边距会被忽略
***
+ 外边距折叠: 多个外边距最终折叠成单个外边距
+ **TIPS:** 只有垂直方向的外边距会发生折叠, 水平方向不会
```CSS
div.left { margin-right:20px; }
div.right { margin-left: 20px; }
/** 两个div的间距为40px, 不会发生折叠 */
```
+ 垂直方向上外边距折叠的不同情况
  - 两个正外边距, 结果取较大的值
  ```CSS
  div.top { margin-bottom: 30px; }
  div.bottom { margin-top: 20px; }
  /** 两个盒子间隔距离为30px */
  ```
  - 两个负外边距, 结果取较小的值
  ```CSS
  div.top { margin-bottom: -30px; }
  div.bottom { margin-top: -20px; }
  /** 两个盒子间隔距离为-30px, top会将bottom拉近30px, 二者重叠 */
  ```
  - 一正一负外边距, 结果为二者之和
  ```CSS
  div.top { margin-bottom: 30px; }
  div.bottom { margin-top: -20px; }
  /** 两个盒子中间间隔距离为10px */
  ```
+ 其他外边距折叠和溢出的情况
  - 子元素的顶部外边距溢出到父元素之外
  ```HTML
  <style>
    div.container { height: 400px; }
    div.content { height: 100px; margin-top: 100px; }
  </style>
  <body>
    <div class="container">
      <div class="content">Hello</div>
    </div>
  </body>
  <!-- 子元素和父元素顶部贴在一起, 距离视口顶部100px -->
  ```
  - 空块元素自己的上下外边距折叠
  ```HTML
  <style>
    div { margin: 20px 0; }
  </style>
  <body>
    <div></div>
    <div>Hello</div>
    <!-- Hello文本会出现在距顶部20px处 -->
  </body>
  ```
***
**注解:** 空块元素折叠的示例, 按照如上代码, 总共参与折叠的有三部分
+ 空div块的上边距
+ 空div块的下边距
+ Hello块的上边距
***
+ **解析:** 外边距折叠的条件
  - 兄弟元素之间的上下外边距发生折叠
  - 无法分隔父级块元素和其子元素的上/下外边距
  - 空块元素自己的上下外边距发生折叠
***
**注解:** 关于第二点, 无法分隔父级块元素和其子元素的上/下外边距
+ 父级块元素没有设定边框
+ 父级块元素没有设定内边距
+ 父级块元素没有任何行级内容(`inline`或`inline-block`)
+ 父级块元素没有创建BFC: 块级格式上下文

**修复:** 来尝试解决子元素顶部外边距溢出到父元素之外的情况
```HTML
<!-- 方案1: 设定边框 -->
<div class="container" style="border: 1px solid green">
  <div class="content">Hello</div>
</div>

<!-- 方案2: 设定内边距 -->
<div class="container" style="padding: 1px">
  <div class="content">Hello</div>
</div>

<!-- 方案3: 添加行级内容 -->
<div class="container">
  <label>打破折叠!</label>
  <div class="content">Hello</div>
</div>

<!-- 方案4: 创建BFC -->
<div class="container" style="overflow: auto">
  <div class="content">Hello</div>
</div>
```
***

#### 统一间距
+ 统一间距是技巧性内容, 本小节只针对于垂直间距进行说明
+ 案例: 在父容器中添加一些按钮和链接, 要求等间距排列
```CSS
div.container { width: 600px; padding: 20px; }
div > * { display: block; margin-top: 20px; }
```
+ 这有个问题: 容器有内边距, 因此第一个元素顶部空白会更大(`40px`), 修改一下
```CSS
/** 假设login按钮是div中的第一个子元素 */
div > * { display: block; }
button.login ~ * { margin-top: 20px; }
```
+ 现在需要修改布局, 将某个子元素移动到第一个, 以上代码就必须要修改
```CSS
button.contact ~ * { margin-top: 20px; }
```
+ 上述代码已经可以很好的工作了, 但移动元素总要修改代码, 很不爽
+ 我们还有办法让代码变得更通用一点, 首先来看一个案例
```HTML
<div>
  <button>Login</button>
  <button>Register</button>
  <button>Contact us</button>
  <button>Help</button>
</div>
```
+ 针对如上HTML, 如何选中除第一个按钮以外的其它所有按钮?
```CSS
div > button + button { margin-top: 20px; }
```
+ 再进一步, 上述问题扩展为: 如何选中除第一个子元素以外的其它所有子元素?
```CSS
div > * + * { margin-top: 20px; }
```
+ 将上述的案例修改为:
```CSS
div > * { display: block; }
div > * + * { margin-top: 20px; }
```
***
**注解:** 形如`* + *`的选择器, 被称为猫头鹰选择器, 适合于选择页面上所有拥有共同父元素的非第一个子元素
***
