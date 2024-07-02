+ [总目录](../readme.md)
***
- [定位](#定位)
- [层叠上下文](#层叠上下文)
***
#### 定位
+ 定位的概念: 相对于元素或视口 (容纳块) 的框体, 定义另一个元素的位置
+ 定位的方式: 
  - 使用`position`属性指定元素的定位类型
  - 使用`left`, `right`, `top`, `bottom`指定元素的位置, 即偏移量
***
**注解1:** `position`属性默认值是`static`
+ 非定位元素: 也叫静态定位元素, 指`position`属性值为`static`的元素
+ 定位元素: 将`position`属性定义为其他值的元素
+ 非定位元素的渲染和显示, 遵循正常文档流

**注解2:** 定位元素都会脱离文档流, 且生成块级框
***
+ 偏移量的概念:
  - `left`: 定位元素的`左`外边距外边界, 相对于容纳块框体`左`边界的偏移
  - `right`: 定位元素的`右`外边距外边界, 相对于容纳块框体`右`边界的偏移量
  - `top`: 定位元素的`上`外边距外边界, 相对于容纳块框体`上`边界的偏移量
  - `bottom`: 定位元素的`下`外边距外边界, 相对于容纳块框体`下`边界的偏移量
  - 以上四个属性的初始值都为`auto`
```CSS
div.container {
  position: relative;
  width: 600px;
  height: 400px;
  border: 1px solid green;
}

div.container > div {
  position: absolute;
  width: 100px;
  height: 100px;
  margin-top: 100px;
  top: 100px;
}
```
+ 偏移量和定位元素的宽高
  - 默认情况下: `left`和`right`为0, 元素宽高由内容决定
  - 偏移量隐式确定定位元素的宽高
  - 偏移量和定位元素宽高都指明的情况下, `right`和`bottom`会被忽略
  - **TIPS:** 通过`margin: auto`将尺寸转为外边距, 实现水平垂直居中
```CSS
/** right和bottom被忽略 */
.dialog {
  position: fixed;
  width: 100px;
  height: 100px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

/** 外边距auto */
.dialog {
  position: fixed;
  width: 100px;
  height: 100px;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: rgba(0, 0, 0, 0.5);
}
```
***
**注解:** 偏移量设置为负数, 可以将定位元素定位到容纳块框体以外
***
+ 定位类型1: 绝对定位, `position`属性值为`absolute`
  - 容纳块是离该元素最近的祖先定位元素, 容纳块框体的边界指的是内边框
  - 没有祖先元素, 则容纳块是初始容纳块, 和视口一样大小, 位于页面顶部
  - 偏移量可以设置为`auto`, 这会将定位元素放置在未定位时应该出现的位置
  - 注意嵌套绝对定位
```CSS
/** auto值 */
div.container { width: 500px; height: 500px; position: relative; }
div.content-1 { width: 200px; height: 200px; display: inline-block; }
div.content-2 {
  width: 500px; height: 200px;
  position: absolute; display: inline-block;
  /** 省略left, right, top, bottom, 其值均为auto */
}

/** 嵌套绝对定位 */
div.container { width: 400px; height: 400px; position: relative; }
div.content { width: 200px; height: 200px; position: absolute; }
div.content > div.subcontent {
  width: 100px; height: 100px;
  position: absolute;
  bottom: 0;
  right: 0;
}
```
***
**注解:** 绝对定位元素会随着文档滚动而滚动
***
+ 定位类型2: 固定定位, `position`属性值为`fixed`
  - 容纳块是视口, 容纳块框体的边界指的是视口的边界
  - 偏移量可以设置为`auto`, 这会将定位元素放置在未定位时应该出现的位置
```CSS
/** auto值 */
div {
  width: 100px; height: 100px; position: fixed;
  /** 省略left, right, top, bottom, 其值均为auto */
}
/** div可能并没有紧贴视口的顶部和左边, 因为Chrome浏览器有默认的margin */
```
***
**注解:** 固定定位元素不会随着文档滚动而滚动
***
+ 定位类型3: 相对定位, `position`属性值为`relative`
  - 容纳块是定位元素自己, 偏移量指定的是自己相对于自己的偏移
  - 偏移量可以设置为`auto`, 相对定位元素不发生偏移, 和没有定位是一样的
  - 相对定位元素不能用偏移量更改自身的尺寸
  - `left`和`right`不能一起使用, `top`和`bottom`不能一起使用, 后者会被忽略
```CSS
/** 移动自身 */
div {
  width: 100px; height: 100px; position: relative;
  left: 100px; top: 100px;
}
/** div向左, 向下移动100px */
```
***
**注解:** 关于相对定位
+ 相对定位元素设置偏移量, 从原有位置上移开后, 原有位置的空间依旧保持占用
+ 相对定位元素会随着文档滚动而滚动
+ 相对定位最常见的用途是作为子元素的容纳块
***
+ 定位类型4: 粘滞定位, `position`属性值为`sticky`
  - 容纳块是最近的块级祖先元素, 偏移量指定相对于容纳块的粘滞定位矩形
  - 定位元素首先在正常文档流中, 跟随文档流正常滚动, 就像`static`
  - 定位元素滚动到粘滞定位矩形边界时, 会停止滚动, 就像`fixed`
  - 定位元素在文档流中的原始位置会被保留, 就像`relative`
  - 当原始位置滚动回粘滞定位矩形边界以内时, 定位元素又将继续跟随文档流滚动
  - 定位元素不允许超出`父元素`范围, 父元素会带着定位元素一起离开容纳块
```HTML
<style>
  html, body { width: 400px; height: 600px; overflow: auto; }
  div.actor { height: 1000px; }
  img { position: sticky; top: 0; }
</style>
<body>
  <div class="actor"></div>
  <div class="actor">
    <img src="index.png">
  </div>
  <div class="actor"></div>
</body>
```
***
**注解:** 总结, 三个概念: 粘滞定位矩形, 粘滞定位元素, 文档初始位置
+ 在粘滞定位矩形以内, 粘滞定位元素和文档初始位置重合, 一起滚动
+ 在粘滞定位矩形边界, 粘滞定位元素停止滚动, 文档初始位置正常跑出去
+ 文档初始位置回到粘滞定位矩形以内时, 粘滞定位元素又与其重合, 一起滚动
+ 父元素可以带着粘滞定位元素一起逃出粘滞定位矩形
***

#### 层叠上下文
+ 处理内容溢出: 内容太多时会从元素中溢出, 使用`overflow`属性处理
  - `visible`: 默认值, 内容溢出, 且可见, 但不会影响元素的盒模型
  - `scroll`: 溢出内容不显示, 但滚动条可能始终呈现, 即使内容不溢出
  - `hidden`: 溢出内容不显示, 也没有滚动条, 溢出内容没有办法查看
  - `auto`: 不溢出时没有滚动条, 溢出时出现滚动条
+ 元素可见性: 使用`visibility`属性控制元素的可见性
  - `visible`: 默认值, 元素可见
  - `hidden`: 元素不可见, 但实际占据的空间依然保留, 如同`opacity: 0`
  - `collapse`: 在表格中使用, 效果等同于非表格元素上的`hidden`
***
**注解:** `display: none`
+ 元素完全隐藏, 且占据的空间也会被释放
+ 元素并未从DOM中移除, 依然可以选中, 且绑定的事件和行为依然可以执行
```HTML
<label for="check">Click Me</label>
<input type="checkbox" id="check" style="display: none;">
<script>
  const input = document.querySelector('input');
  input.addEventListener('input', event => {
    console.log(event.target.checked);
  });
</script>
```
***
+ 渲染和层叠顺序: HTML解析DOM的时候, 决定了元素的绘制顺序
  - 正常文档流: 按照元素在源码中出现的顺序绘制
  ```CSS
  div { width: 100px; height: 100px; border: 1px solid black; }
  div.order1 { margin: 0; }
  div.order2 { margin: -80px 0 0 80px; }
  div.order3 { margin: -60px 0 0 160px; }
  ```
  - 存在定位元素: 首先按照源码顺序绘制非定位元素, 再按照源码顺序绘制定位元素
  ```CSS
  div { width: 100px; height: 100px; border: 1px solid black; }
  div.order1 { margin: 0; position: relative; }
  div.order2 { margin: -80px 0 0 80px; position: relative; }
  div.order3 { margin: -60px 0 0 160px; }
  ```
***
**注解1:** 层叠, 即元素的绘制和重叠情况

**注解2:** 定位元素要注意源码位置, 尽可能避免错误的层叠 
***
+ 精细化控制层叠顺序: 使用`z-index`属性
  - `z-index`只对定位元素有效, 对于非定位元素, 该属性无意义
  ```CSS
  div { width: 100px; height: 100px; border: 1px solid black; }
  div.order1 { margin: 0; z-index: 3; }
  div.order2 { margin: -80px 0 0 80px; z-index: 2; }
  div.order3 { margin: -60px 0 0 160px; z-index: 1; }
  ```
  - `z-index`越大, 位置越靠前, 当为负数时, 会出现在非定位元素后面
  ```CSS
  div { width: 100px; height: 100px; border: 1px solid black; }
  div.order1 { margin: 0; position: relative; }
  div.order2 { margin: -80px 0 0 80px; position: relative; z-index: -1; }
  div.order3 { margin: -60px 0 0 160px; z-index: 1 }
  ```
  - `z-index`的默认值是0
+ 层叠上下文: 管理元素, 决定哪些元素在前, 哪些元素在后
  - 设置了`z-index`的元素, 为所有后代元素提供了一个层叠上下文
  - 设置了`z-index`的元素, 是该层叠上下文的根
  - 不同层叠上下文中的元素, 永远不可能交叠渲染, 必须整体在前或在后
```HTML
<style>
  div { position: relative; }
  div.zIndex-1 { z-index: 1; }
  div.zIndex-10 { z-index: 10; }
  div.zIndex-1000 { z-index: 1000; }
</style>
<div class="zIndex-1">
  <div class="zIndex-1000"></div>
</div>
<div class="zIndex-10"></div>
```
+ 层叠上下文中元素的层叠顺序: 从后向前
  - 层叠上下文的根元素
  - `z-index`为负数的定位元素, 及其子元素
  - 非定位元素
  - `z-index`为`auto`的定位元素, 及其子元素
  - `z-index`为正数的定位元素, 及其子元素
***
**注解:** 在一个层叠上下文中使用`z-index`, 只会影响到该层叠上下文中元素的层叠
***
+ 其他创建层叠上下文的方式: 使用`opacity`/`transform`/`filter`等属性
+ 其他方式在讲述相应的内容时会再讲述
***
**注解:** 关于层叠上下文, 需要掌握的重点
+ 元素绘制顺序: 先非定位元素, 再定位元素, 都按照源码顺序绘制
+ `z-index`只针对定位元素, 对非定位元素无效
+ 层叠上下文不允许交叠
***
