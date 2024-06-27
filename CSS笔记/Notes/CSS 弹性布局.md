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
+ 使用`Flexbox`还能实现其他高级的布局效果

#### 弹性布局基本概念