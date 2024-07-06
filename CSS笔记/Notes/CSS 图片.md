+ [总目录](../readme.md)
***
- [设置背景](#设置背景)
- [图片位置](#图片位置)
- [图片尺寸](#图片尺寸)
- [图片重复](#图片重复)
- [图片边界](#图片边界)
- [图片裁减](#图片裁减)
- [图片附着](#图片附着)
- [图片边框](#图片边框)
***
#### 设置背景
+ 使用`background`属性, 可以为元素设置背景, 该属性包含以下8个属性
  - `background-image`: 设置背景图片, 使用`url()`指定路径或`base64`编码
  - `background-position`: 设置图片在边界中的位置
  - `background-size`: 设置图片尺寸
  - `background-repeat`: 设置图片重复
  - `background-origin`: 设置图片显示边界
  - `background-clip`: 设置图片裁减边界
  - `background-attachment`: 设置图片附着, 即是否跟随元素上下滚动
  - `background-color`: 设置纯色背景, 纯色背景会在图片下方渲染
+ 以上属性可以单独使用, 接下来将讲述其中的部分属性
***
**注解:** 以下所有内容的示例代码, 都省略`background-image`, 节省版面
```CSS
div { background-image: url(@/images/background.png); } /** 省略 */
```
***

#### 图片位置
+ 图片位置: 定义图片在边界中的位置, 默认位置是在边界的左上角
***
**注解:** 边界默认是元素内边距外侧
***
+ 使用`background-position`属性, 设置图片的位置
  - 该属性需要指定水平和垂直方向的位置, 默认值是`0% 0%`
  - 该属性可以使用指定的关键字, 百分比, 以及长度值
+ 使用关键字定义图片位置: 包括`top`/`bottom`/`left`/`right`/`center`
  - `top`/`bottom`/`left`/`right`: 图片上/下/左/右侧紧贴边界上/下/左/右侧
  - `center`: 居中, 垂直水平都可以用该值
  - 关键字的顺序可以调换, `right top`和`top right`效果一样
  - 关键字可以省略一个, 省略值处理为`center`
  - 关键字不合理, 则`background-position`会失效, 如`top top`
  ```CSS
  /** 将图片放置在右上角 */
  div { background-position: right top; }

  /** 将图片放置在水平居中, 垂直靠上 */
  div { background-position: top; }
  ```
+ 使用百分比数值: 同时应用到图片和元素上
  - 需要指定水平/垂直方向值, 顺序不能换, 只给一个值, 省略值为`50%`
  - 以左上角为参照, 将图片和元素的百分比对应的位置重合
  ```CSS
  /** 图片在元素中垂直水平居中 */
  div { background-position: 50% 50%; }

  /** 图片在元素中垂直水平居中 */
  div { background-position: 50%; }
  ```
***
**注解1:** 百分比的值, 首先会计算出绝对偏移量
+ 假设有`background-position: 20% 30%`
  - 水平偏移`px`: `(element_width - image_width) * 20%`
  - 垂直偏移`px`: `(element_height - image_height) * 30%`

**注解2:** 分析如下CSS中, 图片的位置
```CSS
div { background-position: calc(100% - 10px) calc(100% - 10px); }
```
***
+ 使用长度值: 指定图片左上角, 相对于边界左上角的偏移
  - 需要指定水平/垂直方向偏移, 顺序不能换, 只给一个值, 省略的方向会居中
  - 正数值使图片向右/向下偏移, 负数值使图片向左/向上偏移
  ```CSS
  /** 将图片相对于元素左上角, 向左偏移372px, 向上偏移523px */
  div { background-position: -372px -523px; }

  /** 将图片相对于元素左上角, 向右偏移20px, 垂直方向居中 */
  div { background-position: 20px; }
  ```
+ 混用: 关键字, 百分比, 长度值可以混合使用
  ```CSS
  /** 将图片相对于元素左上角, 向右偏移20px, 垂直方向居中 */
  div { background-position: 20px 50%; }
  ```
+ 指定偏移边界: 指定关键字和偏移距离
  ```CSS
  /** 这相当于 left 20px top 40px */
  div { background-position: 20px 40px; }

  /** 指定四个参数, 同时修改图片和元素的边界定义, 再进行偏移 */
  div { background-position: right 40px bottom 20px; }
  ```

#### 图片尺寸
+ 图片的尺寸默认使用图片的原始尺寸
+ 使用`background-size`指定图片的尺寸, 指定横向尺寸和纵向尺寸
  - 默认值: `auto`, 使用图片的原始尺寸
  - 使用长度值: 将图片放大或缩小至指定的尺寸
  ```CSS
  div { background-size: 200px 200px; }
  div { background-size: 10em 10em; }
  ```
  - 使用百分数: 相对于图片边界范围进行计算, 而非自身
  ```CSS
  div {
    width: 200px; height: 200px; padding: 50px;
    background-size: 50% 50%; /** 150px 150px */
  }
  ```
  - 使用`cover`: 保持宽高比缩放, 填满整个边界, 允许部分内容超出边界
  ```CSS
  div {
    /** 图片尺寸为100px 100px */
    width: 200px; height: 300px;
    background-size: cover; /** 300px 300px */
  }
  /** 只要边界和图片宽高比不一致, 就一定会有部分图片超出边界 */
  ```
  - 使用`contain`: 保持宽高比缩放, 使边界完全容纳图片, 部分区域可以留空
  ```CSS
  div {
    /** 图片尺寸为100px 100px */
    width: 200px; height: 300px;
    background-size: contain; /** 200px 200px */
  }
  /** 只要边界和图片宽高比不一致, 就一定会有部分区域没有被图片覆盖 */
  ```
+ 图片尺寸还可以使用`auto`值: 
  - 提供一个`auto`, 则等同于`auto auto`, 使用图片原始尺寸
  - 提供一个非`auto`值, 和一个`auto`值, 根据宽高比计算
  ```CSS
  div {
    /** 图片尺寸为100px 100px */
    background-size: 200px auto; /** 200px 200px */
  }
  ```

#### 图片重复
+ 图片重复: 当图片的尺寸小于裁减边界时, 图片会重复平铺, 以填满裁减边界
+ 图片会在`background-position`指定的位置处开始上下左右依次重复平铺
***
**注解1:** 裁减边界, 默认是元素边框外侧, 当图片尺寸无法占满时, 就会重复

**注解2:** 图片的裁减边界, 和图片的边界是两码事, 不要搞混了
***
+ 使用`background-repeat`属性, 设置图片的重复模式
  - 该属性需要指定在水平/垂直方向上的重复模式, 默认是`repeat repeat`
  - 只给定一个值时, 水平垂直方向都采用该重复模式, `repeat-x/y`除外
  ```CSS
  div { background-repeat: repeat no-repeat; }
  div { background-repeat: repeat-x; }
  ```
  - 不重复图片, 指定`no-repeat`, 此时图片只会显示一次
  ```CSS
  div { background-repeat: no-repeat; }
  ```
+ 额外的重复模式1: `space`
  - 会计算裁减边界和图片尺寸的比值, 并向下取整, 得到重复次数
  - 将图片重复平铺, 并使用类似`space-between`的方式均匀分布
  - `space`计算出的重复次数大于`1`, 会忽略`background-position`的值
  ```CSS
  div {
    width: 210px; height: 210px;
    /** 图片尺寸是100px 100px */
    background-repeat: space;
    background-position: 130px 270px;
  }
  ```
+ 额外的重复模式2: `round`
  - 会计算裁减边界和图片尺寸的比值, 并向上取整, 得到重复次数
  - 将图片重复平铺, 并使用类似`space-between`的方式均匀分布
  - `round`模式会自动变更图片的尺寸, 以保证尽量不出现图片裁减的情况
  ```CSS
  div {
    width: 320px; height: 420px;
    /** 图片尺寸 100px 100px */
    background-repeat: round;
    /** 水平方向: 重复4次, 垂直方向: 重复5次 */
    /** 图片尺寸变更为 80px 84px */
  }
  ```
***
**注解:** 关于`round`重复模式
+ `round`模式不会改变`background-position`设置的图片位置
+ 当图片没有紧贴边界时, 可能仍然出现裁减现象
```CSS
  div {
    width: 210px; height: 210px;
    /** 图片尺寸 100px 100px */
    background-repeat: round;
    background-position: center;
    /** 水平方向: 重复3次, 垂直方向: 重复3次 */
    /** 左右两侧, 上下两侧的图片会被裁减 */
  }
  ```
***

#### 图片边界
+ 图片边界: 默认是元素的内边距外侧, 在前文中已经讲述过
+ 使用`background-origin`属性, 设置图片的边界
  - `padding-box`: 默认值, 代表图片边界是元素的内边距外侧
  ```CSS
  /** 图片左侧与元素左内边距外侧紧贴, 图片上侧与元素上内边距外侧紧贴, */
  div {
    width: 200px; height: 200px; padding: 50px;
    border: 50px solid rgba(0, 0, 0, 0.5);
    background-origin: padding-box; /** 默认值, 可以省略 */
  }
  ```
  - `content-box`: 图片边界是元素的内容区域外侧
  ```CSS
  /** 图片左侧与元素内容区域左侧紧贴, 图片上侧与元素内容区域上侧紧贴, */
  div {
    width: 200px; height: 200px; padding: 50px;
    border: 50px solid rgba(0, 0, 0, 0.5);
    background-origin: content-box;
  }
  ```
  - `border-box`: 图片边界是元素的边框外侧, 将边框设为透明, 可以看到图片
  ```CSS
  /** 图片左侧与元素左边框外侧紧贴, 图片上侧与元素上边框外侧紧贴, */
  div {
    width: 200px; height: 200px; padding: 50px;
    border: 50px solid rgba(0, 0, 0, 0.5);
    background-origin: border-box;
  }
  ```
***
**注解1:** 指定`background-origin`属性后, `background-position`也将根据此属性值来计算

**注解2:** 如果指定了图片重复, 重复平铺依然会根据裁减边界决定, 即边框内侧
+ `background-origin`属性指定了图片边界, 背景图默认加载到该边界左上角
+ `background-position`属性指定了图片在图片边界中的位置
+ `background-repeat`属性指定了图片从当前位置开始, 上下左右重复, 直到裁减边界

**注解3:** 再次强调, 图片的裁减边界, 和图片的边界是两码事
***

#### 图片裁减
+ 图片裁减: 定义矩形边界, 只有该边界内的图片才能看到, 边界外的图片被裁减丢弃
+ 裁减边界: 即上述所定义的矩形边界, 默认是元素边框外侧
***
**注解:** 不管是图片重复, 还是图片放大, 裁减边界之外的图片都将不可见
***
+ 使用`background-clip`属性, 设置图片的裁减边界
  - 默认值为`border-box`: 超过元素边框外侧的图片内容被裁减掉
  - **TIPS:** `border-box`是能设置的最大裁减边界
  ```CSS
  div {
    width: 100px; height: 100px;
    padding: 50px; border: 50px solid rgba(0, 0, 0, 0.5);
    background-clip: border-box; /** 默认值 */
  }
  ```
  - `padding-box`: 超过元素内边距外侧的图片内容被裁减掉
  ```CSS
  div { background-clip: padding-box; }
  ```
  - `content-box`: 超过元素内容区域的图片内容被裁减掉
  ```CSS
  div { background-clip: content-box; }
  ```
  - `text`: 背景图片只填充文本线条, 必须移除前景色或设置透明, 否则会遮住背景
  ```HTML
  <style>
    div {
      font-size: 100px; font-weight: bold;
      color: rgba(0, 0, 0, 0.2); /** 或者: color: transparent */
      background-clip: text;
    }
  </style>
  <div>Hello, World</div>
  ```
***
**注解1:** 前面的内容讲了几个边界, 现在来总结一下
+ `background-origin`: 图片相对于该边界设定位置, 但图片可以显示在边界以外
  - 情况1: 设置`background-position`, 将图片定位到边界以外
  - 情况2: 设置图片重复模式, 重复的图片会显示到边界以外
  - 情况3: 放大图片, 图片会显示到边界以外
+ `background-clip`: 裁减边界, 只要图片超过了裁减边界, 一律干掉
+ 将`background-origin`和`background-clip`设置为同样的值, 就省事了

**注解2:** 针对没有边框, 没有内边距的元素, 就可以省去很多烦恼了
***

#### 图片附着
+ 默认情况下, 背景图会和元素保持在一起, 跟随整个文档滚动
+ 使用`background-attachment`属性, 控制背景图是否跟随元素和文档一起滚动
  - `scroll`: 默认值, 元素和背景图, 一起跟随`文档`滚动
  ```CSS
  div {
    width: 400px; height: 3000px;
    background-position: center;
    background-attachment: scroll; /** 默认值 */
  }
  ```
  - `fixed`: 将图片固定在`视口`上, 不跟随滚动, 而且位置也相对于视口计算
  ```CSS
  div {
    width: 400px; height: 3000px;
    background-position: left top; /** 相对于视口定位, 在视口左上角 */
    background-attachment: fixed;
  }
  /** 不管怎么滚动div, 图片都将牢牢的固定在视口左上角 */
  ```
  - `local`: 元素内容溢出, 导致元素内部出现滚动条, 图片跟随`内容`一起滚动
  ```HTML
  <style>
    div {
      width: 400px; height: 400px; overflow: auto; /** 内容滚动 */
      background-position: right top;
      background-attachment: local;
    }
  </style>
  <div>
    <!-- 在这里添加超长的内容, 导致div出现滚动条, 图片会和内容一起滚动 -->
  </div>
  ```
+ `fixed`的注意点: 图片相对视口定位, 但其位置必须在元素范围内才可见
```CSS
  /** 假设当前视口的宽度是1920px, 图片尺寸为100px 100px */
  div {
    width: 800px; height: 3000px;
    background-position: right top; /** 相对于视口定位, 在视口右上角 */
    background-attachment: fixed;
  }
  /** 图片在视口右上角, 没有处在div的元素范围内, 因此看不到图片 */
  /** 缩小视口宽度到800px以内, 就可以看到图片了 */
  ```

#### 图片边框
+ 图片边框: 使用图片填充元素的边框
+ 使用`border-image-source`, 设置边框使用的图片
```CSS
div {
  border: 30px solid;
  border-image-source: url(@/image/border.png);
}
```
+ 使用`border-image-slice`, 使用裁剪线划分图片, 绘制边框
  - 裁减线错过或重叠, 图片只会渲染到四个角
  - 使用`fill`将裁减图片的中间部分绘制到元素的背景之上
```CSS
div {
  border: 30px solid;
  border-image-source: url(@/image/border.png);
  border-image-slice: 10% 10 10 10% fill; /** 默认值100% */
}
```
+ 使用`border-image-width`, 设置独立于`border-width`的图片绘制宽度
```CSS
div {
  border: 30px solid;
  border-image-source: url(@/image/border.png);
  border-image-width: 60px; /** 会覆盖上面的宽度定义 */
}
```
+ 使用`background-image-outset`, 设置外推边框
  - 当浏览器不支持图像边框, 或图像加载失败时, 重新回到常规边框
  - 属性值为`border-width`定义的宽度的倍数
```CSS
div {
  border: 30px solid;
  border-image-source: url(@/image/border.png);
  border-image-outset: 1;
}
```
+ 使用`background-image-repeat`, 设置边框图像的重复模式
```CSS
div {
  border-image-source: url(@/image/border.png);
  border-image-slice: 10% 10 10 10%;
  border-image-repeat: repeat; /** round space stretch(默认) */
  /** repeat会在中间放置一张图, 向两边重复, 宽度不够了就裁减 */
}
```
***
**注解:** 图片边框的简写属性, 使用`border-image`属性, 顺序即为上述顺序
```CSS
div { border-image: url(@/image/border.png) 10% 60px 1 round; }
```
***
