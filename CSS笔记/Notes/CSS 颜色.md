+ [总目录](../readme.md)
***
- [渐变的概念](#渐变的概念)
- [线性渐变](#线性渐变)
- [径向渐变](#径向渐变)
- [阴影](#阴影)
- [滤镜](#滤镜)
- [混合](#混合)
- [裁剪](#裁剪)
- [遮罩](#遮罩)
***
#### 渐变的概念
+ 渐变: 从一个颜色到另一个颜色的平滑过渡
+ 渐变可以应用在任何可以使用图片的地方, 如`background-image`
+ 渐变分为两类: 线性渐变, 和径向渐变
***
**注解:** 渐变是图片, 但没有固定尺寸, 设置为`auto`将与边界同尺寸
***
+ 每一种渐变类型又可以分为两类: 非循环渐变, 和循环渐变

#### 线性渐变
+ 线性渐变: 沿着线性向量填充得到的渐变, 该向量称为梯度线
+ 使用`linear-gradient`定义渐变, 需要指明渐变方向, 色标, 和色标位置
+ 渐变方向: 指明线性渐变方向, 可选, 默认值为从顶部到底部
  - 使用`to`加上`left`, `right`, `top`, `bottom`, 可以指定对角
  ```CSS
  /** 指定对角方向, 渐变方向从左下到右上 */
  div {
    background-image: linear-gradient(to top right, red, green);
  }
  ```
  - 使用`deg`角度制, `0deg`向上, 正数顺时针, 一圈为`360deg`
  ```CSS
  /** 渐变方向从上到下 */
  div {
    background-image: linear-gradient(180deg, red, green);
  }
  ```
  - 其他的`rad`, `turn`, `grad`都不再赘述, 也不建议使用
+ 色标: 即颜色节点, 渐变会在色标间平滑过渡, 必须至少定义两个, 用逗号隔开
  ```CSS
  /** 渐变均匀的从红色过渡到绿色, 在过渡到黄色 */
  div {
    background-image: linear-gradient(200grad, red, green, yellow);
  }
  ```
***
**注解:** 关于色标:
+ 第一个色标被视为起始颜色, 渐变的起始颜色必须在渐变方向的起始位置
+ 最后一个色标被视为结束颜色, 渐变的结束颜色必须在渐变方向的结束位置
***
+ 色标位置: 色标相对于渐变方向起始位置的偏移量
  - 色标位置和色标写在一起, 使用空格隔开
  - 色标位置可以使用长度值, 以及百分比
  ```CSS
  /** 渐变均匀的从红色过渡到绿色, 在过渡到黄色 */
  div {
    background-image: linear-gradient(200grad, red, green, yellow);
    /** linear-gradient(200grad, red 0%, green 50%, yellow 100%) */
  }
  ```
  - 不同色标位置重叠, 会造成颜色突变, 丢失渐变效果
  ```CSS
  /** 从上到下, 红绿黄各占三分之一, 没有渐变 */
  div {
    background-image: linear-gradient(200grad,
      red    0%,     red    33.33%,
      green  33.33%, green  66.67%,
      yellow 66.67%, yellow 100%
    );
  }
  ```
  - 色标位置可以用负值, 将位置提前, 但超出边界会被裁剪
***
**注解1:** 色标重叠可以用于制作条纹效果

**注解2:** 上述示例中的`red 0%`和`yellow 100%`可以省略
***
+ 循环线性渐变: 使用`repeating-linear-gradient`属性
  - 最后一个色标必须指明色标位置, 这将作为循环图案的长度
  ```CSS
  /** 红绿相间的条纹 */
  div {
    background-image: repeating-linear-gradient(-45deg,
      red   0,     red   10px,
      green 10px,  green 20px
    );
  }
  ```
  - 如果使用平滑过渡, 则第一个色标和最后一个色标颜色相同效果才好
  ```CSS
  /** 红绿相间的条纹 */
  div {
    background-image: repeating-linear-gradient(-45deg,
      red 0, green 10px; red 20px
    );
  }
  ```

#### 径向渐变
+ 径向渐变: 从一个点开始, 全方位向外扩展
+ 使用`radial-gradient`, 需要指明渐变形状尺寸, 点位置, 色标和色标位置
+ 渐变形状: 只有两种, `circle`和`ellipse`, 可选, 默认以元素尺寸确定
  - `circle`: 对于方形元素, 默认是圆形, 也可以手动指定
  ```CSS
  div {
    background-image: radial-gradient(circle, red, green);
  }
  ```
  - `ellipse`: 对于非方形元素, 默认是椭圆, 也可以手动指定
  ```CSS
  div {
    background-image:
      radial-gradient(ellipse 200px 400px, red, green);
  }
  ```
***
**注解:** 手动指定椭圆渐变的同时, 也要指定长短轴, 否则会以元素尺寸决定 
***
+ 尺寸: 定义水平/垂直方向尺寸, 只设置一个值, 则水平垂直都用该值
  - 尺寸是可选, 默认为元素尺寸
  ```CSS
  div {
    width: 400px; height: 400px;
    background-image: radial-gradient(200px, red, green);
  }
  ```
***
**注解:** 大于定义尺寸以外的区域, 都使用最后一个色标的值
***
+ 点位置: 使用`at`加上位置, 位置`background-position`的定义一样
  - 点位置可选, 默认是`center`
  ```CSS
  div {
    background-image: radial-gradient(at 25% 25%, red, green);
  }
  ```
+ 色标, 和色标位置和线性渐变一致, 不再赘述
+ 循环径向渐变: 使用`repeating-radial-gradient`, 和循环径向渐变一致
```CSS
/** 循环径向渐变的条纹效果 */
div {
  background-image:
    repeating-radial-gradient(
      red   0,    red   10px,
      green 10px, green 20px
    );
}
```

#### 阴影
+ 阴影主要用在两种情况: 文本和盒子, 阴影不影响布局, 默认在边框外侧
+ 文本阴影: 使用`text-shadow`, 定义水平/垂直偏移, 模糊半径, 和颜色
  ```CSS
  div { text-shadow: 3px 3px 1px rgba(0, 0, 0, 0.5); }
  ```
+ 盒子阴影: 使用`box-shadow`, 定义水平/垂直偏移, 模糊/扩展半径, 和颜色
  ```CSS
  div { box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.5); }
  ```
  - 支持多层阴影, 使用逗号分隔
  ```CSS
  button {
    box-shadow: 5px 5px 3px 1px rgba(255, 0, 0, 0.5),
      10px 10px 3px 1px rgba(0, 255, 0, 0.5),
      15px 15px 3px 1px rgba(0, 0, 255, 0.5);
  }
  ```
  - 使用扩展半径模拟边框
  ```CSS
  button { box-shadow: 0 0 0 10px green; }
  ```
    - 使用`inset`让阴影在边框内侧
  ```CSS
  button { box-shadow: inset 3px 3px 3px 1px rgba(0, 0, 0, 0.5); }
  ```
***
**注解1:** 阴影和元素等大且重叠, 在此基础上, 理解阴影偏移

**注解2:** `inset`阴影可以理解为, 一整块阴影, 缺失了元素那一块
***

#### 滤镜
+ 滤镜: 调整元素或图片的视觉外观, 使用`filter`属性, 包含一系列方法
+ 模糊滤镜, `blur()`, 传入模糊偏差值, 不能为负
  ```CSS
  div { filter: blur(1px); }
  ```
+ 透明度滤镜, `opacity()`, 传入0-1的值, 和`opacity`类似
  ```CSS
  div { filter: opacity(0.5); }
  ```
+ 阴影滤镜, `drop-shadow()`, 创建轮廓阴影, 偏移量/模糊半径/颜色
  ```CSS
  div { filter: drop-shadow(5px 5px 1px black); }
  ```
+ 灰阶滤镜, `grayscale()`, 0不变, 1全灰, 中间值部分灰
  ```CSS
  div { filter: grayscale(0.5); }
  ```
+ 褐色滤镜, `sepia()`, 0不变, 1全褐色, 中间值部分褐色
  ```CSS
  div { filter: sepia(0.5); }
  ```
+ 反相滤镜, `invert()`, 0不变, 1完全反转, 中间值部分反转
  ```CSS
  div { filter: invert(1); }
  ```
+ 色相旋转滤镜, `hue-rotate()`, 0和`360*n`不变, 中间值以色轮旋转决定
  ```CSS
  div { filter: hue-rotate(360); }
  ```
+ 亮度滤镜, `brightness()`, 1不变, 0纯黑, 大于1亮度增加
  ```CSS
  div { filter: brightness(10); }
  ```
+ 对比度滤镜, `contrast()`, 1不变, 0纯灰, 大于1对比度增加
  ```CSS
  div { filter: contrast(10); }
  ```
+ 饱和度滤镜, `saturate()`, 1不变, 0没有饱和度, 大于1饱和度增加
  ```CSS
  div { filter: saturate(10); }
  ```
***
**注解1:** 关于`drop-shadow`和`box-shadow`
+ `box-shadow`默认是在元素的边框外侧生成阴影
+ `drop-shadow`滤镜则是在图片的不透明轮廓下方生成阴影

**注解2:** 滤镜可以使用多个, 按照顺序应用效果, 使用空格分隔
```CSS
div { filter: opacity(0.5) blur(1px); }
```
***

#### 混合
+ 混合: 为处于相同位置且重叠的不同元素或者图片指定其混合显示的模式
+ 背景混合: 使用`background-blend-mode`, 混合背景图, 渐变, 背景色等
  - `background-image`: 可以使用多个图片或渐变, 前者覆盖后者
  ```CSS
  div {
    /** 只能看到图片, 看不到渐变, 但可以通过图片的透明部分, 看到渐变 */
    background-image: url(./index.png), linear-gradient(red, green);
  }
  ```
  - 混合模式的计算中, RGB均采用`0-1`的值
  - `darken`: 前后RGB分量中, 取较小值重新组成RGB
  - `lighten`: 前后RGB分量中, 取较大值重新组成RGB
  - `difference`: 前后RGB分量相减, 取绝对值重新组成RGB
  - `exclusion`: result = 前 + 后 - ( 2 * 前 * 后 ), 前后都是0-1的值
  - `multiply`: 前后RGB分量相乘, 结果重新组成RGB
  - `screen`: 前后RGB分量, 各自反相后, 相乘再反相, 组成RGB作为结果
  - `overlay`: 前景RGB低于0.5使用`multiply`, 高于0.5使用`screen`
  - `hard-light`: 背景RGB低于0.5使用`multiply`, 高于0.5使用`screen`
  - `soft-light`: 柔和版的`hard-light`, 公式复杂, 不再赘述
  - `color-dodge`: 前景RGB分量反相后, 再除背景RGB分量, 组成RGB作为结果 
  - `color-burn`: 背景RGB分量反相后, 再除前景RGB分量, 组成RGB作为结果
  - `hue`: 前景的色相角度, 背景的明度和饱和度, 将其合并后作为结果
  - `saturation`: 前景的饱和度, 背景的色相角度和明度, 将其合并后作为结果
  - `color`: 前景的色相角度, 背景的明度, 将其合并后作为结果
  - `luminosity`: 前景的明度, 背景的色相角度和饱和度, 将其合并后作为结果
  ```CSS
  div {
    background-image: url(./index.png), linear-gradient(red, green);
    background-blend-mode: soft-light;
  }
  ```
+ 元素混合: 使用`mix-blend-mode`, 混合重叠的元素, 取值和上述一致
  ```CSS
  div.fore { position: absolute; z-index: 2; mix-blend-mode: darken; }
  div.back { position: absolute; z-index: 1; }
  ```
***
**注解1:** 混合默认值是`normal`, 除了`alpha`通道, 其他原样显示, 也称`alpha`混合

**注解2:** 多个背景, 或者多个元素的混合从后向前, 依次混合

**注解3:** 混合模式可以使用多个, 按照顺序应用效果, 使用逗号分隔
```CSS
div { background-blend-mode: soft-light, lighten, multiply; }
```
***
+ 独立混合: 使用`isolation`属性
  - 使用该属性的元素会单独混合其后代元素和背景, 完成之后再和其他元素混合
  ```CSS
  div { isolation: isolate; }
  ```

#### 裁剪
+ 裁减: 只显示元素的部分区域, 可见区域可以指定为各种形状
+ 此处的裁减和`background-clip`不同, 后者只能设置矩形, 且值有限
+ 使用`clip-path`属性, 对元素进行更为丰富的裁减, 可以使用以下值
  - `none`: 默认值, 不做裁减
  - `url`: 引用外部SVG文件中的`<clipPath>`元素
  ```CSS
  div { clip-path: url(./index.svg#circle); }
  ```
  - `inset`: 矩形裁减, 指定矩形范围, 还可以使用`round`定义圆角
  ```CSS
  div { clip-path: inset(10px 12px 11px 11px round 10px); }
  ```
  - `circle`: 圆形裁减, 指定半径, 再使用`at`指定圆心位置
  ```CSS
  div { clip-path: circle(200px at center); }
  ```
  - `ellipse`: 椭圆裁减, 指定横轴/纵轴半径, 再使用`at`指定圆心位置
  ```CSS
  div { clip-path: ellipse(100px 200px at 25% 25%); }
  ```
  - `polygon`: 多边形裁减, 一系列逗号分隔的`x y`值
  ```CSS
  div { clip-path: polygon(200px 0, 0 400px, 400px 400px); }
  ```
  - 其他裁减方式, 或者和`background-clip`一样, 或者需要使用SVG, 不再赘述
  - 使用`clip-rule`, 可以指定裁减填充方式, 但只适用于SVG, 不再赘述
***
**注解:** 裁减不会改变元素的尺寸, 仅仅只是内容不可见
***

#### 遮罩
+ 遮罩: 也称蒙版, 指定形状, 形状内部的内容可见, 外部不可见
  - 遮罩只能使用图片作为形状
  - 遮罩的精细化控制更强, 可以定位, 设置尺寸, 以及重复蒙版等
+ 定义遮罩, 使用`mask-image`属性
```CSS
div {
  background-image: url(./index.png);
  mask-image: url(./index2.png);
}
```
+ 定义遮罩模式, 使用`mask-mode`属性, 有如下三个值:
  - `alpha`: 透明部分遮挡下方内容, 不透明部分显示下方内容
  - `luminance`: 明度为0的部分遮挡下方内容, 明度为1的部分完全显示下方内容 
  - `match-source`: 默认值, `image`使用`alpha`, SVG使用`luminance`
```CSS
div { mask-mode: luminance; }
```
+ 调整遮罩图片尺寸: 使用`mask-size`属性, 遮罩图片默认是原始尺寸
  - `auto`: 使用默认尺寸, 或者根据宽高比计算, 和`background-size`一致
  - 使用长度值或百分比, 指定宽高, 和`background-size`一致
  - `cover`/`contain`: 和`background-size`一致
```CSS
div { mask-size: cover; }
```
+ 定义遮罩图片重复模式: 使用`mask-repeat`属性
  - 取值和`background-repeat`一致, 不再赘述
```CSS
div { mask-repeat: repeat; }
```
+ 定位遮罩图片位置: 使用`mask-position`
  - 取值和`background-position`一致, 不在赘述
```CSS
div { mask-position: center; }
```
+ 定义蒙版边界: 使用`mask-origin`
  - `background-origin`的值都能使用, 不再赘述
  - `margin-box`, 外边距外侧的边界, 请参阅注解
  - `fill-box`/`stroke-box`/`view-box`: 用于SVG
```CSS
div { mask-origin: margin-box; }
```
***
**注解:** 如果蒙版图片原始尺寸过大, 到达外边距以外, 会造成其他内容也被遮挡
***
+ 定义蒙版图片裁减: 使用`mask-clip`
  - `background-clip`的值都能使用, 不再赘述
  - `margin-box`, 外边距外侧的边界
  - `fill-box`/`stroke-box`/`view-box`: 用于SVG
```CSS
div { mask-clip: margin-box; }
```
+ 遮罩的集合计算: 使用`mask-composite`属性, 这也会改变遮罩的底层处理方式
  - `add`: 并集计算, 同时显示遮罩图片和下方图片
  - `subtract`: 差集计算, 只显示遮罩图片, 并裁减掉和下方图片重叠的部分
  - `intersect`: 交集计算, 只显示遮罩图片和下方图片重叠的部分
  - `exclude`: 去除计算, 同时显示遮罩图片和下方图片, 并裁减掉重叠的部分
```CSS
div {
  background-image: url(./index.png);
  mask-image: url(./index2.png);
  mask-composite: exclude;
}
```
***
**注解:** Chrome浏览器不支持`mask-composite`属性, 加前缀也不行
***
