+ [总目录](../readme.md)
***
- [标准盒模型](#标准盒模型)
- [替代盒模型](#替代盒模型)
- [外边距](#外边距)
- [值和单位](#值和单位)
***
#### 标准盒模型
+ 界面上所有的元素, 都被一个盒子所包围
+ 盒子类型一般分为两种: 块级盒子和行内盒子
+ 块级盒子的行为:
  - 块级盒子前后会换行, 即块级盒子会独占一行
  - 块级盒子可以使用`width`和`height`属性指定宽高
  - 块级盒子的内边距, 外边距会推开周围的其他元素
  - 块级盒子宽度会填充容器的可用空间, 除非显示指定`width`
+ 行内盒子的行为:
  - 行内盒子前后不会换行, 即行内盒子会和其他行内盒子一起排列
  - 行内盒子无法使用`width`和`height`属性, 不起作用
  - 行内盒子垂直方向的内外边距和边框可以用, 但不会推开其他行内盒子
  - 行内盒子水平方向的内外边距和边框可以用, 而且会推开其他行内盒子
```HTML
<style>
  html, body { margin: 0; }
  .inline, .block {
    width: 100px;
    height: 100px;
    padding: 20px;
    margin: 20px;
    border: 1px solid red;
  }
</style>
<body>
  <div class="block">HelloWorld</div>
  <span class="inline">Hello</span>
  <span class="inline">World</span>
</body>
```
+ 通过`display`属性, 可以修改盒子的类型为`inline`或者`block`
+ 盒子还有内部显示类型, 即盒子内部的元素的排列布局方式:
  - 默认情况: 盒子内部的元素盒子, 也表现为块级或行内
  - 通过`display`属性, 可以修改内部显示类型, 如`flex`和`grid`
***
**注解1:** 关于`display`属性
+ `inline`和`block`修改的是盒子的外部显示类型
+ `flex`和`grid`修改的是盒子的内部显示类型
+ 示例: 将div设置为`display: flex`, div外部依然表现为块级盒子, 但内部将表现为弹性盒, div的子元素, 将遵循弹性布局

**注解2:** 关于`display`的更多属性值, 后续将会一一讲解
***
+ 盒子的组成部分, 符合该条件的盒子, 即被称为标准盒模型
  - 内容: 使用`width`和`height`指定的区域
  - 内边距: 内容周围的空白, 使用`padding`指定
  - 边框: 用于包裹内容和内边距区域, 使用`border`指定
  - 外边距: 当前盒子和其他盒子之间的空白, 使用`margin`指定
+ 盒子的实际可见尺寸: 外边框组成的边界尺寸, 即盒子的尺寸止于边框
```CSS
div {
  width: 200px;
  height: 200px;
  padding: 100px;
  border: 50px solid red;
  margin: 100px;
}
/** 盒子的实际可见尺寸: 宽度500px, 高度500px */
```
***
**注解1:** 标准盒模型适用于块级盒子, 而行内盒子仅仅只是用到了标准盒模型的部分行为

**注解2:** 使用标准盒模型, 一定要注意`width`和`height`:
+ `width`和`height`指定的是盒子的内容区域尺寸
+ 边框/外边距/内边距, 会追加到内容区域, 可见尺寸会增大
+ 布局设计时, 容易导致元素折行错位, 效果不达预期
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
```
***
**注解1:** `box-sizing`的默认值是`content-box`, 使用`width`和`height`指定内容区域尺寸, 即标准盒模型

**注解2**: 补充知识, 关于边框, 边框必须设置样式, 宽度和颜色都可以忽略
+ 省略颜色, 浏览器将采用默认颜色, 多数情况下, 和默认文本同颜色(黑色)
+ 省略宽度, 浏览器将采用默认的`medium`值, 另外还有`thick`和`thin`值
+ 边框宽度不允许设置为负数和百分数
```CSS
div {
  border: solid;
}
```
***
+ 关于行内盒子: 要了解块级盒子和行内盒子的行为差异
```HTML
<style>
  span {
    margin: 20px;
    padding: 20px;
    width: 80px;
    height: 50px;
    border: 2px solid blue;
  }
</style>
<p style="width: 200px">
  p元素中插入了一个<span>span</span>元素, width和height无效, 上下外边距也不会推开其他内容
</p>
```
+ 关于`inline-block`, 会创建行内块级盒子, 拥有部分块级和行内盒子的效果
  - 行内块级盒子可以设置`width`和`height`
  - 行内块级盒子的`padding`, `margin`, `border`可以推开其他内容
  - 行内块级盒子前后不会换行, 和其他行内盒子排在同一行
```HTML
<style>
  span {
    display: inline-block;
    margin: 20px;
    padding: 20px;
    width: 80px;
    height: 50px;
    border: 2px solid blue;
  }
</style>
<p style="width: 200px">
  p元素中插入了一个<span>span<span>元素, display设置为inline-block
</p>
```

#### 外边距
+ 外边距可以设置为负数, 从而产生不同的效果
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
***
**注解:** 对于行内盒子来说, 水平方向的外边距依然遵循上述规律, 但垂直方向的外边距会被忽略
***
+ 外边距折叠, **TIPS:** 只有垂直方向的上下外边距会折叠, 水平方向不会
  - 两个正外边距, 结果取较大的值
  ```CSS
  div { width: 200px; height: 200px }
  div.top {
    margin-bottom: 30px;
  }
  div.bottom {
    margin-top: 20px;
  }
  /** 两个盒子间隔距离为30px */
  ```
  - 两个负外边距, 结果取较小的值
  ```CSS
  div { width: 200px; height: 200px }
  div.top {
    margin-bottom: -30px;
  }
  div.bottom {
    margin-top: -20px;
  }
  /** 两个盒子间隔距离为-30px, top会将bottom拉近30px, 二者重叠 */
  ```
  - 一正一负外边距, 结果为二者之和
  ```CSS
  div { width: 200px; height: 200px }
  div.top {
    margin-bottom: 30px;
  }
  div.bottom {
    margin-top: -20px;
  }
  /** 两个盒子中间间隔距离为10px */
  ```
+ 外边距折叠的条件
  - 相邻的兄弟元素盒子之间会发生边距折叠, 见上述示例
  - 没有内容将父子元素分开, 父子元素会边距折叠, 且折叠部分会溢出父元素
  ```CSS
  div.container { height: 500px; margin-top: 0; }
  div.content { height: 200px; margin-top: 100px; }
  /** 子元素带着父元素一起向下跑了 */
  ```
***
**注解1:** 关于"没有内容将父子元素分开"
+ 没有设置边框/内边距/行内容, 也没有创建BFC, 用于分隔块级元素和子元素的上边距
+ 没有设置边框/内边距/行内容, 也没有创建BFC, 用于分隔块级元素和子元素的下边距
+ 要解决上述父子元素的问题, 只需要反过来, 设置边框/内边距/行内容, 创建BFC
```HTML
<style>
  div.container { height: 500px; margin-top: 0; }
  div.content { height: 200px; margin-top: 100px; }
</style>
<body>
  <div class="container">
    打破折叠!
    <div class="content"></div>
  </div>
</body>
```

**注解2:** 关于BFC, 块格式化上下文, Block Formatting Context
+ BFC是一个布局上下文, 为其中的所有元素提供了布局的规则和环境
+ `<html>`元素为文档提供了一个初始BFC, 所有元素都在其中进行布局
+ 任何块级元素, 都可以通过使用某些CSS规则, 创建一个新的BFC
  - 块级元素创建的新的BFC, 是完全隔离的布局上下文
  - 块级元素的所有子元素和内容, 都在该BFC下进行布局
  - 块级元素的所有子元素和内容无论怎样布局, 都不会影响BFC外部的内容
  - 块级元素创建的新的BFC, 会脱离文档流
+ 创建BFC的部分方式:
  - 使用浮动元素: 即`float`属性不为`none`
  - 绝对定位元素: 即`position`属性为`absolute`或`fixed`
  - 行内块级元素: 即`display`属性为`inline-block`
  - `overflow`属性值不为`visible`或者`clip`的块级元素
  - ...
+ 大白话解释: 假设div里面的内容在不断变化, 就可能影响到周边的其他元素
  - 例如: 内容过多, 导致溢出div, 从而产生横向或纵向滚动条
  - 例如: 子元素增多, 导致div尺寸变化, 进而导致界面显示错乱
  - 设置div的`overflow`为`auto`, 现在不怕了, 不会影响div以外了
+ 使用BFC修改上述边距折叠的问题
```CSS
div.container { height: 500px; margin-top: 0; overflow: auto; }
div.content { height: 200px; margin-top: 100px; }
```
***

#### 值和单位
  
+ 百分比长度: 主要讨论盒模型的相关尺寸, 即内外边距, 内容区域
  - `width`和`height`使用百分比, 相对于容器的内容区域宽高进行计算
  ```CSS
  div.container {
    box-sizing: border-box;
    width: 500px;
    height: 500px;
    padding: 50px;
    border: 20px solid red;
    margin: 0;
  }
  div.content {
    width: 60%; /** 216px */
    height: 40%; /** 144px */
  }
  ```
  - 内边距, 外边距使用百分比, 相对于容器的内容区域的宽度进行计算
  ```CSS
  div.container {
    box-sizing: border-box;
    width: 500px;
    height: 500px;
    padding: 50px;
    border: 20px solid red;
    margin: 0;
  }
  div.content {
    padding: 10%; /** 36px */
    margin: 10%; /** 36px */
  }
  ```
  - 关于其他非盒模型尺寸使用百分比长度, 内容太多, 不做介绍了