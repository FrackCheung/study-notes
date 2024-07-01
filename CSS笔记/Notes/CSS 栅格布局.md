+ [总目录](../readme.md)
***
- [栅格布局的基本概念](#栅格布局的基本概念)
- [栅格行和栅格列](#栅格行和栅格列)
- [命名栅格区域](#命名栅格区域)
- [栅格布局中的分布对齐](#栅格布局中的分布对齐)
***
#### 栅格布局的基本概念
+ 栅格布局是基于行和列的布局系统, 通过横纵线将区域划分为多个栅格
+ 栅格布局是用于构建整个网页布局的完美解决方案
***
**注解:** 弹性布局的本质是一维的, 栅格布局是二维的
***
+ 栅格容器: 应用了`display: grid`或`display:inline-grid`的元素
+ 栅格元素: 栅格容器的直接子元素, 其他后代元素不受影响
***
**注解1:** 关于`grid`和`inline-grid`
+ 设置为`grid`, 栅格容器呈现块级盒的行为, 宽度默认填满父容器宽度
+ 设置为`inline-grid`, 栅格容器呈现行内盒的行为, 不会独占一行
+ 针对浮动元素或绝对定位元素设置`inline-grid`将变成`grid`

**注解2:** 关于栅格元素
+ 栅格元素外边距不会折叠溢出, 因为栅格容器创建了BFC
+ 栅格元素一律生成块级盒
+ 栅格容器中子元素和非空文本一律成为栅格元素
***
+ 其他概念:
  - 栅格线: 划分栅格容器的横线和纵线
  - 栅格轨道: 两条相邻栅格线之间的整个区域, 又称栅格行或者栅格列
  - 栅格单元: 最小的栅格
  - 栅格区域: 任意两横两纵四条栅格线构成的区域
+ 默认栅格布局: 每个栅格元素都占据一个栅格行, 并向下排列, 即多行单列
```HTML
<style>
  aside { display: grid; }
</style>
<aside>
  <!-- 注释 -->
  <h1>标题</h1>
  <img src="index.png">
  点击链接 <a href="/detail">详细信息</a> 查看详情
</aside>
<!-- 栅格容器aside中共有5个栅格元素, 占据5个栅格行 -->
```
+ 以上代码: 其栅格布局的参数为
  - 栅格线: 横线为六条, 纵线为两条
  - 栅格轨道: 栅格轨道行有五个, 栅格轨道列有一个
  - 栅格单元: 共有五个栅格单元
  - 栅格区域: 最多可以数出15个栅格区域
***
**注解1:** 关于栅格线:
+ 第一条栅格横线, 一定与栅格容器内容区域的上边界重叠
+ 第一条栅格纵线, 一定与栅格容器内容区域的左边界重叠
+ 最后一条栅格横线, 不一定与栅格容器内容区域的下边界重叠
+ 最后一条栅格纵线, 不一定与栅格容器内容区域的右边界重叠

**注解2:** 栅格元素的默认排布, 从左到右, 从上到下, 逐个填充栅格单元
***

#### 栅格行和栅格列
***
**注解:** 以下只针对划分栅格列进行讲述, 划分栅格行的方法和列完全一致, 只有方向的差异
***
+ 划分栅格列, 使用`grid-template-columns`属性, 只能用于栅格容器
  - `grid-template-columns`将栅格容器划分为多个栅格列
  - `grid-template-columns`接受多个长度值, 指明每个栅格列的宽度
  - 栅格列宽度总和小于栅格容器宽度时, 剩余宽度将被忽略, 不会使用
  - 栅格列宽度总和大于栅格容器宽度时, 会溢出栅格容器
```CSS
div.container {
  display: grid;
  width: 600px;
  grid-template-columns: 100px 200px 30%;
}
/** 栅格容器被划分为三列, 宽度依次为: 100px 200px 180px */
/** 剩余120px的宽度将被忽略, 栅格元素不会排布到这里  */
/** 栅格线共有四条, 最后一条没有和容器右边界重叠 */
```
+ 定义栅格列尺寸, 即宽度的其他方法
  - 分数宽度: `fr`, 该值根据栅格容器的可用宽度计算, 并按比例分配
  ```CSS
  div.container {
    display: grid;
    width: 600px;
    grid-template-columns: 1fr 2fr 3fr;
  }
  /** 栅格容器被划分为三列, 宽度依次为: 100px 200px 300px */
  /** 栅格线共有四条, 最后一条和容器右边界重叠 */
  ```
  + 重复指定宽度: 使用`repeat`方法
    - 手动指定重复次数, 重复太多次可能导致溢出
    - 自动填充栅格容器, 直至没有可用的宽度, 剩余宽度将会忽略
  ```CSS
  /** 手动 */
  div.container {
    display: grid;
    grid-template-columns: repeat(4, 1fr 2fr) 1fr;
  }
  /** 相当于 1fr 2fr 1fr 2fr 1fr 2fr 1fr 2fr 1fr */

  /** 自动 */
  div.container {
    display: grid;
    width: 320px;
    grid-template-columns: repeat(auto-fill, 100px);
  }
  /** 容器被划分为三列, 宽度依次为100px 100px 100px , 最后剩余的20px被忽略*/
  ```
***
**注解:** `fr`和其他长度值混用时, 将根据剩余宽度来计算
```CSS
div.container {
  display: grid;
  width: 500px;
  grid-template-columns: 1fr 2fr 100px 20%;
}
/** 栅格容器被划分为四列, 宽度依次为: 100px 200px 100px 100px */
/** 栅格线共有五条, 最后一条和容器右边界重叠 */
```
***
+ 栅格纵线的命名: 使用`[]`包裹名称
  - 将名称放置在`grid-template-columns`中, 栅格线对应的位置
  - 名称可以有多个, 空格分隔, 任意一个都可以索引到该条栅格线
```CSS
div.container {
  display: grid;
  grid-template-columns: [start] 1fr [center] 1fr [end stop];
}
```
+ 栅格纵线的编号: 从第一条栅格线开始, 起始编号为`1`
```CSS
div.container {
  display: grid;
  grid-template-columns: [start] 1fr [center] 1fr [end];
}
/** start为1, center为2, end为3 */
```
+ 划分栅格行: 使用`grid-template-rows`属性, 只能用于栅格容器
  - 其属性值, 尺寸设置, 编号, 命名等都与划分栅格列相同
  - 不再赘述
***
**注解:** 本小节讲述了划分栅格行和列的方法, 涉及到如下CSS属性
+ `grid-template-rows`: 用于划分栅格行
+ `grid-template-columns`: 用于划分栅格列
+ 定义栅格行列的尺寸:
  - `fr`: 分数长度, 根据栅格容器的剩余空间计算, 按照比例分配
  - `repeat`方法: 手动或自动重复栅格行列定义
+ 栅格线的命名和编号: 编号从`1`开始, 命名使用`[]`包裹
***

#### 命名栅格区域
+ 栅格布局中, 有时候可能想要合并栅格单元, 比如将横向导航栏独占一行
+ 通过命名栅格区域, 可以提供合并的栅格单元, 使用`grid-template-area`属性
  - 使用任意的字符串, 定义栅格区域中每个栅格单元的名称
  - 同一行中的名称使用空格分隔, 不同行使用双引号分隔
  ```CSS
  div.container {
    display: grid;
    width: 600px;
    height: 600px;
    grid-template-areas: 
      "top-left top-center top-right"
      "center-left center-center center-right"
      "bottom-left bottom-center bottom-right";
  }
  /** 栅格容器被划分为三行三列,  */
  ```
  - 栅格单元的名称可以任意, 但最好具备标识意义, 以下写法也是合法的
  ```CSS
  div.container {
    display: grid;
    grid-template-areas: "tl tc tr" "cl cc cr" "bl bc br";
  }
  ```
  - 栅格单元的尺寸是自动确定的, 可以结合`grid-template-rows/columns`设置尺寸
  ```CSS
  div.container {
    display: grid;
    grid-template-areas: "tl tc tr" "cl cc cr" "bl bc br";
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
  }
  ```
  - 名称相同的相邻栅格单元, 会被合并到一起, 但还需要额外设置栅格元素
  ```HTML
  <style>
    div.container {
      display: grid;
      grid-template-areas:
        "header header"
        "aside main"
        "aside footer";
      grid-template-rows: 10% 80% 10%;
      grid-template-columns: 30% 70%;
    }
  </style>
  <div class="container">
    <nav class="nav"></nav>
    <aside class="aside"></aside>
    <main class="main"></main>
    <footer class="footer"></footer>
  </div>
  <!-- 到目前为止, 这仍然只是一个三行两列的栅格布局 -->
  <!-- 如果没有设置栅格元素, 栅格元素依然按照默认方式排列, 不会看到任何合并效果 -->
  ```
  - 相邻相同的栅格单元名称必须计算为矩形, 否则无法合并, 且整个栅格布局都将失效
  ```CSS
  div.container {
    display: grid;
    grid-template-areas: 
      "t1 t1 t1"
      "c1 c1 cr"
      "c1 b1 b2";
    grid-template-rows: repeat(3, 1fr);
    grid-template-columns: repeat(3, 1fr);
  }
  /** c1构成了L型, 无法合并, 且该栅格区域也会失效 */
  ```
***
**注解:** 下一节会讲述如何使用命名栅格区域来进行栅格单元的合并
***
+ 命名栅格区域会自动为首尾两条栅格线命名: 在栅格单元名称上加入`-start`和`-end`
```CSS
div.container {
  display: grid;
  grid-template-areas: "tl tc tr" "cl cc cr" "bl bc br";
}
/** 第一行: 第一条栅格线名称为 tl-start, 最后一条栅格线名称为 tr-end */
/** 第一列: 第一条栅格线名称为 tl-start, 最后一条栅格线名称为 bl-end */
/** 其他类似 */
```
***
**注解1:** 通常来说, 不要使用默认栅格线名称, 自己手动指定比较好

**注解2:** 本小节讲述了命名栅格区域, 主要涉及`grid-template-areas`属性
***

#### 栅格元素的排列
+ 前文讲述了划分栅格的集中方法, 现在只需将栅格元素, 放置到想要的位置即可
  - 栅格元素可以放置到栅格单元中, 也可以放置到栅格区域中
  - 并非所有的栅格都必须要放置内容, 不想放可以不放
***
**案例:** 后续讲述的栅格元素放置方法, 都以该示例为例
```HTML
<style>
    div.container {
      display: grid;
      grid-template-areas:
        "header header"
        "aside main"
        "aside footer";
      grid-template-rows: [row-1] 10% [row-2] 80% [row-3] 10% [row-4];
      grid-template-columns: [col-1] 30% [col-2] 70% [col-3];
    }
  </style>
  <div class="container">
    <nav class="nav"></nav>
    <aside class="aside"></aside>
    <main class="main"></main>
    <footer class="footer"></footer>
  </div>
```
***
+ 栅格元素放置方法1: 指定栅格元素的四个边界所对应的栅格线编号或名称
  - `grid-row-start`: 指定和栅格元素`上`边界对齐的栅格横线
  - `grid-row-end`: 指定和栅格元素`下`边界对齐的栅格横线
  - `grid-column-start`: 指定和栅格元素`左`边界对齐的栅格纵线
  - `grid-column-end`: 指定和栅格元素`右`边界对齐的栅格横纵线
  - 可以指定栅格线的编号或者名称
  ```CSS
  /** 将main元素放置到main区域 */
  .main {
    grid-row-start: 2; /** grid-row-start: row-2; */
    grid-row-end: 3; /** grid-row-end: row-3; */
    grid-column-start: 2; /** grid-column-start: col-2; */
    grid-column-end: 3; /** grid-row-start: col-3; */
  }
  ```
  - 使用`span`指定要跨越的栅格轨道
  ```CSS
  /** 将main元素放置到main区域 */
  .main {
    grid-row-start: 2;
    grid-row-end: span 1;
    grid-column-start: span 1;
    grid-column-end: 3;
  }
  ```
  - 以上四个属性, 可以简写为`grid-row`和`grid-column`两个属性
  ```CSS
  /** 将main元素放置到main区域 */
  .main {
    grid-row: 2 / 3; /** 或者 2 / span 1 */
    grid-column: 2 / 3;
  }
  ```
***
**注解1:** 如果省略结束栅格线的定义, 只定义开始栅格线
+ 使用编号: 则结束栅格线编号 = 开始栅格线编号 + 1
```CSS
.main { grid-row-start: 2; grid-column-start: 2; }
/** grid-row-end为3, grid-column-end为3 */
```
+ 使用名称: 情况过于复杂, 此处省略解释

**注解2:** 如果定义的栅格线越界, 会自动创建新的栅格线, 溢出栅格容器
```CSS
.main {
  grid-row: 2 / 5;
  grid-column: 2 / 4;
}
```
***
+ 栅格元素放置方法2: 指定栅格元素需要放置的栅格区域名称
  - `grid-area`属性: 指定栅格元素需要放置的栅格区域名称
  - 名称来自于`grid-template-areas`属性指定的命名栅格区域
  ```CSS
  .nav { grid-area: header; }
  .aside { grid-area: aside; }
  .main { grid: main; }
  .footer { grid: footer; }
  /** 通过这种方式, 即可看到相邻且同名的栅格单元被合并 */
  ```
***
**注解:** 本小节讲述了将栅格元素放置到栅格区域上的方法, 主要涉及如下CSS属性
+ `grid-row-start`: 指定栅格元素起始栅格横线
+ `grid-row-end`: 指定栅格元素终止栅格横线
+ `grid-column-start`: 指定栅格元素起始栅格纵线
+ `grid-column-end`: 指定栅格元素终止栅格纵线
+ `grid-row`: 简写属性, 指定栅格元素起始/终止栅格横线
+ `grid-column`: 简写属性, 指定栅格元素起始/终止栅格纵线
***

#### 栅格布局中的分布对齐
+ 定义栅格单元之间的空白距离, 使用`grid-gap`属性
```CSS
div.container {
  display: grid;
  grid-gap: 10px;

  /** grid-gap: 10px 10px; 定义水平和垂直方向的间距 */
}
```
+ 单个栅格元素, 在所在栅格单元中的水平对齐, 使用`justify-self`属性
  - `start`/`end`/`center`: 栅格元素在栅格单元中左/右/居中对齐
  - `left`/`right`: 效果同`start`/`end`, 在栅格单元中左/右对齐
  - `self-start`/`end-start`: 
  - `stretch`: 当栅格元素的宽度设置为`auto`的时候, 横向拉伸元素尺寸
  ```CSS
  div > img {
    direction: rtl; /** 书写方向从右到左 */
    justify-self: self-start; /** 右对齐 */
  }
  ```
+ 单个栅格元素, 在所在栅格单元中的垂直对齐, 使用`align-self`属性
  - `start`/`end`/`center`: 栅格元素在栅格单元中上/下/居中对齐
  - `left`/`right`: 效果同`start`/`end`, 在栅格单元中上/下对齐
  - `self-start`/`end-start`: 效果同`start`/`end`, 在栅格单元中上/下对齐
  - `stretch`: 当栅格元素的高度设置为`auto`的时候, 纵向拉伸元素尺寸
  - `baseline`/`last-baseline`: 将栅格元素基线和轨道行中第一条/最后一条基线对齐
  ```CSS
  div > img {
    justify-self: self-start; /** 上对齐 */
    align-self: self-end; /** 下对齐 */
  }
  ```
+ 全部栅格元素, 在自身所在栅格单元中的水平对齐: 使用`justify-items`属性
+ 全部栅格元素, 在自身所在栅格单元中的垂直对齐: 使用`align-items`属性
***
**注解1:** 关于`justify-items`和`align-items`
+ 必须用在栅格容器上, 而非单个栅格元素上
+ `*-items`和`*-self`, 取值和效果完全一致

**注解2:** `*-self`属性会覆盖`*-items`属性
***
+ 轨道列在栅格容器中的水平对齐方式: 使用`justify-content`属性
+ 轨道行在栅格容器中的垂直对齐方式: 使用`align-content`属性
  - `justify-content`和`align-content`的取值是一致的
  - 两个属性主要在栅格轨道的尺寸小于容器尺寸时使用
  - `space-between`/`space-around`/`space-evenly`: 同弹性布局
  - `start`/`center`/`end`: 左(上)/居中/右(下)对齐
```CSS
div.container {
  width: 800px;
  height: 600px;
  display: grid;
  grid-template-columns: 100px 400px;
  grid-template-rows: 200px;
  justify-content: space-evenly;
  align-content: space-evenly;
}
```
***
**注解:** 本小节讲述了栅格布局中的分布和对齐方式, 涉及到以下CSS属性
+ `justify-items`: 栅格元素在自身所在栅格区域中的水平对齐, 用于栅格容器
+ `align-items`: 栅格元素在自身所在栅格区域中的垂直对齐, 用于栅格容器
+ `justify-self`: 单个栅格元素在自身所在栅格区域中的水平对齐, 用于栅格元素
+ `align-self`: 单个栅格元素在自身所在栅格区域中的垂直对齐, 用于栅格元素
+ `justify-content`: 栅格列在水平方向的对齐, 用于栅格容器
+ `align-content`: 栅格行在垂直方向的对齐, 用于栅格容器
***
