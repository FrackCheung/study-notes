+ [总目录](../readme.md)
***
- [传统布局的难题](#传统布局的难题)
- [弹性布局基本概念](#弹性布局基本概念)
- [弹性元素分布和对齐](#弹性元素分布和对齐)
- [弹性元素](#弹性元素)
***
#### 传统布局的难题
+ 垂直居中: 让子元素在父容器垂直方向上处于正中间的位置
  - 方案1: 给自然高度, 即没有显示指定高度的容器设置上下相等的内边距
  ```CSS
  div.container { padding: 100px 0; text-align: center; }
  /** 以上布局实现了子元素水平垂直居中效果 */
  ```
  - 方案2: (无效) 容器设置固定高度, 使用`margin-top`和`transform`
  ```CSS
  div.container { height: 600px; }
  div.content { margin-top: 50%; transform: translateY(-50%); }
  /** 这种方法不能奏效! */
  ```
  - 方案3: 使用`line-height`设置行高为容器高度
  ```CSS
  div.container { height: 600px; }
  div.content { line-height: 600px; text-align: center; }
  /** 以上布局实现了子元素的内容水平垂直居中效果 */
  ```
  - 方案4: 绝对定位
  ```CSS
  div.container { width: 600px; height: 600px; position: relative; }
  div.content {
    position: absolute;
    width: 100px;
    height: 100px;
    left: 250px;
    top: 250px;
  }
  /** 以上布局实现了水平垂直居中效果 */
  ```
  - 方案5: (无效) 使用`vertical-align: middle`
  ```CSS
  div.container { text-align: center; vertical-align: middle; }
  /** 这种方法不能奏效! */
  ```
***
**注解:** 关于上述5中方案
+ 方案1: 只适用于单个子元素的垂直居中
+ 方案2: 内/外边距百分比单位, 是相对于父容器内容区域宽度
+ 方案3: 实际居中的是子元素的文本内容, 而非子元素本身
+ 方案4: 必须要实际知道父元素和子元素的宽高
+ 方案5: `vertical-align`只针对行内元素和`table-cell`元素
  - `vertical-align`控制行内元素之间的对齐方式, 和父容器没关系
  ```HTML
  <style>
    img { vertical-align: middle; }
  </style>
  <div>
    <span>Hello, World</span>
    <img src="index.png"> <!-- img和span水平居中对齐 -->
  </div>
    <!-- 注意: 这里的居中对齐是指基线对齐, 即img中部和span的文本基线对齐 -->
  ```
  - 父容器设置`display: table-cell`后, 此方法能让子元素垂直居中
  ```CSS
  div.container {
    height: 600px;
    display: table-cell;
    vertical-align: middle;
  }
  ```
***
+ 等高列: 在不明确指定高度的情况下, 让两列高度始终相等
  - 使用表格布局
  ```HTML
  <style>
    div.wrapper { margin: 0 -10px; }
    div.container { display: table; border-spacing: 10px 0; }
    div.content-1 { display: table-cell; width: 70%; }
    div.content-2 { display: table-cell; width: 30%; }
  </style>
  <div class="wrapper">
    <div class="container">
      <div class="content-1"></div>
      <div class="content-2"></div>
    </div>
  </div>
  <!-- content-1和content-2将始终等高 -->
  ```
  - 其他方案不再介绍, 动态计算高度必须要JavaScript介入
***
**注解:** 关于表格布局
+ 将父容器设置为`display: table`, 变成表格容器
+ 将子元素设置为`display: table-cell`, 变成表格单元格
+ `table-cell`可以放心的设置加起来为`100%`的宽度, 表格布局会自动处理
+ `border-spacing`用于指定单元格间距, 副作用是该间距也会作用于表格外边缘
+ 在表格容器外再套一层`wrapper`, 设置两侧负外边距, 将表格容器两端拉长
***
+ 使用本篇文档要介绍的`Flexbox`弹性布局, 垂直居中和等高列将是很简单的问题
+ `Flexbox`通过指明子元素的分布对齐方式, 和视觉顺序来进行高阶布局

#### 弹性布局基本概念
+ 弹性容器: 应用了`display: flex`或`display:inline-flex`的元素
***
**注解:** 关于`flex`和`inline-flex`
+ 设置为`flex`, 弹性容器呈现块级盒的行为, 宽度默认填满父容器宽度
+ 设置为`inline-flex`, 弹性容器呈现行内盒的行为, 不会独占一行
***
+ 弹性元素: 弹性容器的直接子元素, 其他后代元素不受影响
+ 轴: 弹性元素沿主轴方向排列, 超宽折行时, 新行沿副轴方向添加
***
**注解1:** 主轴和副轴的默认方向取决于文档的书写模式
+ 书写模式: 大多数都是从左到右, 从上到下, 这也是默认的书写模式
+ 在默认书写模式下: 主轴是横轴, 方向从左到右; 副轴是纵轴, 方向从上到下
+ 显示修改文档的书写模式, 主轴副轴也将同步变化
+ **TIPS:** 主轴和副轴的起点都位于书写模式的起点
```CSS
:root { writing-mode: vertical-rl; }
```

**注解2:** 本篇文档均使用默认书写模式
***
+ 指定主轴: 使用`flex-direction`属性
  - `row`: 默认, 主轴为横向, 弹性元素从左到右排列
  - `row-reverse`: 主轴为横向, 弹性元素从右到左排列
  - `column`: 主轴为纵向, 弹性元素从上到下排列
  - `column-reverse`: 主轴为纵向, 弹性元素从下到上排列
***
**注解1:** 再次强调, 弹性元素沿主轴排列, 需要折行时, 新行沿副轴方向添加

**注解2:** 指定主轴后, 副轴会相应调整, 主轴为横向, 副轴就为纵向, 反之亦然
+ `row`: 副轴为纵向, 新行从上到下添加
+ `row-reverse`: 副轴为纵向, 新行从上到下添加
+ `column`: 副轴为横向, 新行从左到右添加
+ `column-reverse`: 副轴为横向, 新行从左到右添加
***
+ 折行: 使用`flex-wrap`属性
  - 默认情况下, 弹性元素不会换行, 要么缩减尺寸, 要么溢出
  - `nowrap`: 默认, 不换行, 弹性元素只在一行上排布
  - `wrap`: 超宽折行, 新行沿副轴方向添加
  - `wrap-reverse`: 超宽折行, 新行沿副轴反方向添加, 即翻转副轴
***
**注解:** 同时指定主轴和换行: 使用`flex-flow`属性
```CSS
div { flex-flow: column nowrap; }
```
***
+ 创建一个支持换行的弹性布局, 弹性元素从上往下排, 新行在前一行左侧
```CSS
div.flex {
  display: flex;
  flex-flow: column wrap-reverse;
}
```
***
**总结:** 本小节介绍了如下CSS属性
+ `display`: 设置弹性容器
+ `flex-direction`: 设置弹性容器的主轴, 只能用于弹性容器
+ `flex-wrap`: 设置弹性元素是否允许换行, 只能用于弹性容器
+ `flex-flow`: 一并设置`flex-direction`和`flex-wrap`, 只能用于弹性容器
***

#### 弹性元素分布和对齐
+ 弹性元素默认向主轴起点靠近, 彼此之间没有间隔
+ 弹性元素在主轴上的分布: 使用`justify-content`属性, 只能用于弹性容器
  - `flex-start`: 默认, 弹性元素紧靠主轴起点分布
  - `flex-end`: 弹性元素紧靠主轴终点分布
  - `center`: 弹性元素整体居中分布
  - `space-between`: 两端弹性元素紧靠起点终点, 剩余等间距分布
  - `space-around`: 所有弹性元素等间距分布, 两侧空白为间距的一半
  - `space-evenly`: 所有弹性元素等间距分布, 两侧空白和间距相等
***
**注解1:** 间距由弹性容器计算当前行抛开弹性元素后的剩余宽度来决定

**注解2:** 外边距视为弹性元素的一部分, 会一起扣除后再进行间距计算

**注解3:** 如果弹性容器设置`flex-wrap: nowrap`, 但弹性元素超宽
+ `flex-start`: 弹性元素在主轴终点溢出
+ `flex-end`: 弹性元素在主轴起点溢出
+ `center`: 弹性元素向两端溢出, 溢出量相等
+ `space-between`: 弹性元素在主轴终点溢出
+ `space-around`: 弹性元素向两端溢出, 溢出量相等
+ `space-evenly`: 弹性元素向两端溢出, 溢出量相等
***
+ 弹性元素在主轴上的对齐: 使用`align-items`属性, 只能用于弹性容器
  - `flex-start`: 同行所有弹性元素顶端对齐
  - `flex-end`: 同行所有弹性元素底端对齐
  - `center`: 同行所有弹性元素水平居中对齐
  - `baseline`: 同行所有弹性元素的基线对齐
  - `stretch`: 默认值, 同行所有弹性元素被拉伸至同一高度
***
**注解1:** 关于`baseline`基线
+ 元素中第一行文字的底部就是该元素的基线, 可以理解为下划线位置
+ 基线对齐, 就是所有弹性元素第一行文本的基线在同一条线上
```CSS
div.flex { display: flex; align-items: baseline; }
div.flex-item-1 { font-size: 1.5rem; }
div.flex-item-2 { font-size: 2rem; }
div.flex-item-3 { font-size: 3rem; }
```

**注解2:** 关于`stretch`
+ 如果弹性元素设置了显示高度, 则优先级更高, `stretch`属性不起作用
+ 拉伸高度包含弹性元素的上下外边距, 如果设置外边距, 视觉上会短一点
```CSS
div.flex { display: flex; align-items: stretch; }
div:nth-child(2) { margin: 10px 0; }
```
***
+ 单个弹性元素在主轴上的对齐: 使用`align-self`属性, 只能用于弹性元素
  - `align-self`属性值和`align-items`一样
  - `align-self`默认值是`auto`, 继承弹性容器`align-items`的值
  - `align-self`手动赋值, 会覆盖弹性容器设置的`align-items`的值
```CSS
/** 默认情况下 */
div.flex { display: flex; align-items: flex-start; }
div.flex-item { align-self: auto; } /** 继承弹性容器align-items的值 */

/** 手动覆盖 */
div.flex { display: flex; align-items: flex-start; }
div.flex-item { align-self: stretch; }
```
***
**注解1:** 补充说明`align-self`的值
+ `baseline`: 该弹性元素的基线, 和同行中其他弹性元素中最低的基线对齐
+ `center`: 该弹性元素在该行中垂直居中

**注解2:** 行的高度, 是由该行中高度最大的弹性元素决定的
***
+ 弹性元素行在副轴上的对齐: 使用`align-content`属性, 只能用于弹性容器
  - `flex-start`: 弹性元素行紧靠副轴起点分布
  - `flex-end`: 弹性元素行紧靠副轴终点分布
  - `center`: 弹性元素行整体居中分布
  - `space-between`: 两端弹性元素行紧靠起点终点, 剩余等间距分布
  - `space-around`: 所有弹性元素行等间距分布, 两侧空白为间距的一半
  - `space-evenly`: 所有弹性元素行等间距分布, 两侧空白和间距相等
  - `stretch`: 默认, 拉伸各行, 填充所有高度, 将空白区域平均分配给各行
***
**注解1:** 使用`align-content`属性的前提是, 弹性容器具有明确的高度

**注解2:** 所有弹性元素行超高时
+ `flex-start`: 弹性元素行在副轴终点溢出
+ `flex-end`: 弹性元素行在副轴起点溢出
+ `center`: 弹性元素行向两端溢出, 溢出量相等
+ `space-between`: 弹性元素行在副轴终点溢出
+ `space-around`: 弹性元素行向两端溢出, 溢出量相等
+ `space-evenly`: 弹性元素行向两端溢出, 溢出量相等
***
+ 本小节主要讲述了弹性元素, 及其行的分布对齐, 内容较多
***
**总结:** 本小节介绍了如下CSS属性
+ `justify-content`: 同行弹性元素在主轴上的分布方式, 只能用于弹性容器
+ `align-items`: 同行弹性元素在主轴上的对齐方式, 只能用于弹性容器
+ `align-self`: 单个弹性元素在所在行的对齐方式, 只能用于弹性元素
+ `align-content`: 不同的弹性元素行, 在纵轴上的对齐方式, 只能用于弹性容器
***

#### 弹性元素
+ 关于弹性元素的一些特征:
  - 弹性元素的外边距不会折叠和溢出, 因为弹性容器创建了BFC
  - 弹性元素和浮动元素一样, 不论初始类型是什么, 一律生成块级盒
  - 弹性元素不能设置为浮动元素, 也不能设置清除浮动
  - 弹性容器中的注释和空白文本节点会被忽略, 其余元素和文本一律成为弹性元素
```HTML
<style>
  aside { display: flex; align-items: center; }
</style>
<aside>
  <!-- 注释 -->
  <h1>标题</h1>
  <img src="index.png">
  点击链接 <a href="/detail">详细信息</a> 查看详情
</aside>
<!-- 弹性容器aside中共有5个弹性元素 -->
```
***
**注解:** `vertical-align`对于弹性元素没有影响, 不能用于垂直居中
***
+ 弹性元素可以通过绝对定位`position: absolute`移除文档流, 不再参与弹性布局
+ 绝对定位的弹性元素, 其样式还是会受到一些影响
  - 弹性容器上设置的`justify-content`属性
  - 子元素自身设置的`align-self`属性
```CSS
div.flex { display: flex; justify-content: center; }
div.flex .absolute { position: absolute; align-self: center; }
/** 该元素会在弹性容器中水平垂直居中 */
```
+ 弹性元素的宽度在超过弹性容器宽度时, 会自适应缩减尺寸, 以防止溢出
```CSS
/** 假设有5个弹性元素, 会缩减尺寸, 弹性元素不会溢出 */
div.flex { display: flex; width: 800px; }
div.flex-item { width: 200px; }
```
+ 精细化控制单个弹性元素的宽度变化: 使用`flex`属性, 只能用于弹性元素
  - `flex`是简写属性, 包含`flex-grow`, `flex-shrink`, `flex-basis`属性
  - `flex-grow`: 弹性元素宽度的增长因子, 默认值为`0`, 即宽度绝不会增加
  - `flex-shrink`: 弹性元素宽度的缩减因子, 默认值为`1`, 即宽度会缩减
  - `flex-basis`: 弹性元素宽度的基准值, 增长/缩减因子根据基准值计算缩放
***
**注解1:** 首先解释基准值, 稍后再分别讨论增长因子和缩减因子, 根据以下CSS规则
+ 弹性容器的宽度是`600px`
+ 每个弹性元素既不会增大宽度, 也不会缩减宽度, 而是固定在`200px`
+ 弹性元素会向弹性容器右侧溢出
+ **解释:** 基准值, 就是给弹性元素设置的初始基准宽度
```CSS
/** 假设有5个弹性元素 */
div.flex { display: flex; width: 600px; flex-wrap: nowrap; }
div.flex-item { flex: 0 0 200px; }
```

**注解2:** 基准值必须在`min-width`和`max-width`范围内, 不在时会强制适配
***
+ 增长因子: `flex-grow`, 即`flex`的第一个属性值
  - `flex-grow`不能设置负数
  - `flex-grow`设置弹性元素是否允许放大宽度
  - `flex-grow`设置弹性元素相比于同辈其他弹性元素放大多少宽度
```CSS
/** 假设有2个弹性元素 */
div.flex { display: flex; width: 600px; flex-wrap: nowrap; }
div.flex-item-1 { flex: 0 0 200px; }
div.flex-item-2 { flex: 1 0 200px; }
/** flex-item-1不允许变更尺寸, 其宽度固定为200px */
/** flex-item-2允许放大尺寸, 将剩余宽度全部分配给flex-item-2 */
/** flex-item-2的实际宽度为400px */

/** 假设有2个弹性元素 */
div.flex { display: flex; width: 600px; flex-wrap: nowrap; }
div.flex-item-1 { flex: 1 0 200px; }
div.flex-item-2 { flex: 2 0 200px; }
/** flex-item-1和flex-item-2都允许放大尺寸 */
/** 剩余宽度按照比例分配, flex-item-1占1/3, flex-item-2占2/3 */
/** flex-item-2的实际宽度为400px */
```
***
**注解:** 总结增长因子
+ 设置为`0`, 则宽度不允许放大, 尺寸固定在初始宽度
+ 设置为非`0`正数, 宽度允许放大, 并和其他兄弟按比例分配剩余宽度
+ 剩余宽度 = 弹性容器内容区域宽度 - 所有弹性元素实际占用宽度
***
+ 缩减因子: `flex-shrink`, 即`flex`的第二个属性值
  - `flex-shrink`不能设置负数
  - `flex-shrink`设置弹性元素是否允许缩减宽度
  - `flex-shrink`设置弹性元素相比于同辈其他弹性元素缩减多少宽度
+ 缩减因子的用法和增长因子完全一致, 此处就不再给出示例代码了
***
**注解1:** 只有弹性元素溢出时才需要缩减, 因此这里不再是剩余宽度了, 而是溢出宽度

**注解2:** 总结缩减因子
+ 设置为`0`, 则宽度不允许缩减, 尺寸固定在初始宽度
+ 设置为非`0`正数, 宽度允许缩减, 并和其他兄弟按比例分配溢出宽度
+ 溢出宽度 = 所有弹性元素实际占用宽度 - 弹性容器内容区域宽度
***
+ 本小节主要讲述了弹性元素自身尺寸的放大或缩减, 最后讲述几个补充项
  - `flex-basis`可以设置为`content`, 表示基准值实时同步弹性元素内容区域
  - `flex-basis`可以设置为`auto`, 表示基准值实时同步弹性元素的`width`
  - `flex-basis`可以设置为`width`属性支持的其他单位, 计算方法也一致
  - `flex`属性支持进一步简写
+ `flex`属性的简写赋值
  - `initial`: 弹性元素确定宽度后, 允许缩小, 不允许放大
  - `auto`: 弹性元素确定宽度后, 允许缩小, 也允许放大
  - `none`: 弹性元素确定宽度后, 不允许缩小, 不允许放大
  - 数字值: 将增长因子设为该值, 缩减因子设为0, 允许放大, 不允许缩小
***
**总结:** 本小节介绍了如下CSS属性
+ `flex-grow`: 弹性元素宽度是否允许放大和放大多少, 只能用于弹性元素
+ `flex-shrink`: 弹性元素宽度是否允许缩减和缩减多少, 只能用于弹性元素
+ `flex-basis`: 弹性元素的基准宽度值, 只能用于弹性元素
+ `flex`: 上述三个属性的简写属性, 只能用于弹性元素
***
