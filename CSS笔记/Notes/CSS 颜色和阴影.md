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
+ 使用`linear-gradient`属性定义线性渐变, 最简单的使用可以传入两个颜色值
```CSS
div {
  width: 400px; height: 100px;
  background-image: linear-gradient(red, green);
}
/** div背景是从顶部的红色, 渐变到底部的绿色 */
```
+ `linear-gradient`属性需要指明渐变方向, 色标, 和色标位置
+ 渐变方向: 指明线性渐变方向, 有以下几个方法
  - 渐变方向可选, 如果不指定, 默认值为从顶部到底部
  - 使用`to`加上`left`, `right`, `top`, `bottom`
  ```CSS
  /** 渐变方向从左向右 */
  div {
    background-image: linear-gradient(to right, red, green);
  }

  /** 也可指定对角方向, 渐变方向从左下到右上 */
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
  - 使用`rad`弧度制, `0rad`向上, 正数顺时针, 一圈约`6.282rad`
  ```CSS
  /** 渐变方向从上到下 */
  div {
    background-image: linear-gradient(3.141rad, red, green);
  }
  ```
  - 使用`turn`圆周, `0turn`向上, 正数顺时针, `1turn`即`360deg`
  ```CSS
  /** 渐变方向从上到下 */
  div {
    background-image: linear-gradient(0.5turn, red, green);
  }
  ```
  - 使用`grad`百分度, `0grad`向上, 正数顺时针, `100grad`即`90deg`
  ```CSS
  /** 渐变方向从上到下 */
  div {
    background-image: linear-gradient(200grad, red, green);
  }
  ```
***
**注解:** 一个完整的圆周是`400grad`
***
+ 色标: 即颜色节点, 渐变会在色标间平滑过渡
  - 色标必须至少定义两个, 使用`,`逗号隔开
  - 色标在渐变方向上均匀过渡
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
+ 色标位置: 色标相对于元素左侧的偏移量
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
+ 使用`radial-gradient`属性定义径向渐变, 最简单的使用可以传入两个颜色值
```CSS
div {
  width: 400px; height: 100px;
  background-image: radial-gradient(red, green);
}
/** div背景是从中间的红色, 渐变到四周的绿色 */
```
+ `linear-gradient`需要指明渐变形状, 尺寸, 点位置, 色标, 和色标位置
+ 渐变形状: 径向渐变的形状只有两种, 圆形`circle`和椭圆`ellipse`
  - 形状是可选的, 不指定, 则根据元素尺寸来确定, 默认是椭圆
  - `circle`: 对于方形元素, 默认是圆形, 也可以手动指定
  ```CSS
  div {
    width: 400px; height: 100px;
    background-image: radial-gradient(circle, red, green);
  }
  ```
  - `ellipse`: 对于非方形元素, 默认是椭圆, 也可以手动指定
  ```CSS
  div {
    width: 400px; height: 400px;
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
    background-image:
      radial-gradient(200px, red, green);
  }
  ```
***
**注解:** 大于定义尺寸以外的区域, 都使用最后一个色标的值
***
+ 点位置: 使用`at`加上位置, 位置`background-position`的定义一样
  - 点位置可选, 默认是`center`
  ```CSS
  div {
    width: 400px; height: 400px;
    background-image:
      radial-gradient(at 25% 25%, red, green);
  }
  ```
+ 色标, 和色标位置和线性渐变一致, 不再赘述
+ 循环径向渐变: 使用`repeating-radial-gradient`, 和循环径向渐变一致
```CSS
/** 循环径向渐变的条纹效果 */
div {
  width: 400px; height: 400px;
  background-image:
    repeating-radial-gradient(
      red   0,    red   10px,
      green 10px, green 20px
    );
}
```

#### 阴影
+ 阴影主要用在两种情况: 文本和盒子
+ 阴影默认在边框外侧
+ 文本阴影: 使用`text-shadow`
  - 定义阴影的水平/垂直偏移
  - 定义阴影的模糊半径
  ```CSS
  div { text-shadow: 3px 3px 1px rgba(0, 0, 0, 0.5); }
  ```
+ 盒子阴影: 使用`box-shadow`
  - 阴影的水平偏移和垂直偏移, 相对于盒子位置
  - 阴影的模糊半径和扩展半径, 追加到阴影外侧
  - 阴影的颜色
  ```CSS
  div {
    box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.5);
  }
  ```
  - 使用`inset`让阴影在边框内侧
  ```CSS
  button {
    box-shadow: 3px 3px 3px 1px rgba(0, 0, 0, 0.5);
  }

  button:active {
    box-shadow: inset 3px 3px 3px 1px rgba(0, 0, 0, 0.5);
  }
  ```
***
**注解1:** 阴影偏移
+ 水平偏移: 正数表示向右边框之外偏移, 负数表示向左边框之外偏移
+ 垂直偏移: 正数表示想下边框之外偏移, 负数表示想上边框之外偏移

**注解2:** `inset`阴影偏移
+ 水平偏移: 正数表示向左边框之内偏移, 负数表示向右边框之内偏移
+ 垂直偏移: 正数表示想上边框之内偏移, 负数表示向下边框之内偏移
***

#### 滤镜
#### 混合
#### 裁剪
#### 遮罩