+ [总目录](../readme.md)
***
- [层叠](#层叠)
- [选择器优先级](#选择器优先级)
- [继承](#继承)
- [补充知识: 简写属性](#补充知识-简写属性)
***
#### 层叠
+ 层叠, 描述了一整套完整的规则
+ 层叠, 用于解决冲突的 CSS 声明
```CSS
div > ul a[href^="https"] {
  color: red;
}

.ul a {
  color: green;
}

/** 针对href属性为https开头的a元素, 上述规则有冲突 */
```
+ 层叠规则主要使用三个判断依据
  - 样式表的来源
  - 选择器的优先级
  - 源码顺序
***
**注解 1:** 样式表的来源有两类
+ 用户代理样式: 即浏览器默认样式
+ 作者样式: 即开发人员编写的样式

**注解 2:** 作者样式按照来源又分为三类, 将其称为作者来源
+ 直接写在元素标签中的内联样式
+ 使用选择器编写的外部样式表: CSS 文件
+ 使用选择器编写的文档样式表: `style`标签

**注解 3:** 本篇文档不考虑用户代理样式, 只讨论作者样式的层叠
***
+ 作者样式的特例: 使用`!important`标记修饰的样式
  - `!important`只是将 CSS 声明标记为最高优先级, 而非完整的 CSS 规则
  - 当冲突的声明其中一个有`!important`, 该声明直接胜出, 不管来自哪里
  - 当冲突的声明都有`!important`时, 处于内联样式中的声明直接胜出
  - 当冲突的声明都有`!important`, 且非内联样式, 则需比较选择器优先级
  - 当冲突的声明都有`!important`, 且选择器优先级一致, 则源码靠后的胜出
***
**注解:** 关于源码顺序:
+ 在同一个地方(内联/文档/外部), 源码顺序就是书写顺序
+ 文档样式的顺序排在外部样式后面, 即优先采用文档样式
```HTML
<!-- index.css中, div { color: orange !important } -->
<link rel="stylesheet" href="index.css" type="text/css">
<style>
  div { color: green !important; }
</style>
```
***
+ 层叠的基本判断过程如下:
  - 冲突的声明有`!important`时, 按照上述`!important`的规则判断
  - 冲突的声明中有内联样式, 则内联样式胜出, 都在内联样式中, 则源码靠后的胜出
  - 冲突的声明选是择器样式, 选择器优先级高的胜出, 优先级一致, 源码靠后的胜出
+ 层叠值: 在层叠过程中胜出的 CSS 声明, 元素的每个 CSS 属性最多只有一个层叠值
***
**CSS 准则:** 不要使用`!important`
***

#### 选择器优先级
+ 首先, 你需要了解[CSS 选择器](./CSS%20选择器.md)
+ 单个选择器的优先级: ID 选择器 > 类选择器 > 标签选择器
```CSS
div { color: red; }
.container { color: green; }
#container { color: orange; }
```
+ 关于复杂选择器, 判断其优先级, 需要借助选择器标记
```CSS
#container > ul > .item a[href^="https"]::after {
  background-image: url(@/images/pdf1.png);
}

.container > #ul > li > .link[href*="https"]::after {
  background-image: url(@/images/pdf2.png);
}
```
+ 选择器标记: 使用逗号分隔的数值记录选择器的类型和数量
  - ID 选择器: 排在标记的第一位, 记录为`1, 0, 0`
  - 类选择器: 排在标记的第二位, 记录为`0, 1, 0`
  - 标签选择器: 排在标记的第三位, 记录为`0, 0, 1`
***
**注解 1:** 如果选择器中还有伪类, 伪元素, 属性等选择器

+ 属性选择器和伪类选择器, 其标记和类选择器一致, 记录为`0, 1, 0`
+ 伪元素选择器, 其标记和标签选择器一致, 记录为`0, 0, 1`

**注解 2:** 同一条 CSS 规则, 三种类型的选择器标记应该记录到一起
```CSS
#container > ul > .item a[href^="https"]::after {
  background-image: url(@/images/pdf.png);
}
/** 有1个ID选择器, 2个类选择器, 3个标签选择器 */
/** 最终记录值为 1, 2, 3 */
```

**注解 3:** 复合选择器的符号`> + ~`等, 以及通用选择器`*`, 都不参与优先级的判断
***
+ 选择器优先级的判断采用如下的步骤:
  - 写出选择器的标记记录值
  - 顺位比较, 数量多的直接胜出, 不再进行后续比较
  - 数量一致时, 再比较下一位, 以此类推
  - 所有值都一样, 则选择器优先级一致, 再比较源码顺序
```HTML
<style>
  #container > ul > .item a[href^="https"]::after { /** 123 */
    color: red;
  }

  #container > .list > .item > .about { /** 130 */
    color: orange;
  }

  .container > #list > li > .about { /** 121 */
    color: green;
  }
</style>
<div class='container' id="container">
  <ul class="list" id="list">
    <li class="item" id="item">
      <a class="about" id="about" href="/about">关于</a>
    <li>
  </ul>
<div>
```
***
**注解:** 简单记忆:
+ ID 选择器越多的越优先
+ ID 选择器一样, 则类选择器越多越优先
+ ID 选择器和类选择器都一样, 则标签选择器越多越优先
***
+ 一个巨坑: `a`元素的伪类选择器
```CSS
a:focus { color: yellow; }
a:active { color: blue; }
a:hover { color: orange; }
a:visited { color: green; }
a:link { color: red; }
/** :active, :focus, :hover三个样式失效, :visited也可能会失效 */
```
+ 解决方案: 静态样式在前, 交互样式在后, 且都要遵循实际发生的顺序
```CSS
a:link { color: red; }
a:visited { color: green; }
a:focus { color: yellow; }
a:hover { color: orange; }
a:active { color: blue; }
```
***
**CSS准则:** 不要使用 ID 选择器

**CSS准则:** 不要使用内联样式
***

#### 继承
+ 继承是给元素添加样式的一种方式
+ 如果一个 CSS 属性没有显示赋值, 则该属性可能会继承祖先元素的值
```CSS
:root {
  font-family: sans-serif;
}
/** 整个页面的元素, 如果不明确指定字体, 都会使用该字体 */
```
***
**注解:** 如果给某个元素设置了字体, 则该元素的后代元素都会继承该字体
***
+ 可继承属性: 不是所有的属性都能被继承, 以下是部分可继承属性, 参见详细表格
  - 文本相关的属性
  - 列表的部分属性
  - 表格的边框属性

|     可继承属性      |    可继承属性    |   可继承属性    |   可继承属性    |
| :-----------------: | :--------------: | :-------------: | :-------------: |
|        color        |       font       |   font-family   |    font-size    |
|     font-weight     |   font-variant   |   font-style    |   line-height   |
|   letter-spacing    |    text-align    |   text-indent   | text-transform  |
|     white-space     |   word-spacing   |   list-style    | list-style-type |
| list-style-position | list-style-image | border-collapse | border-spacing  |

+ 使用`inherit`和`initial`控制是否继承
  - `inherit`: 强制使 CSS 属性继承祖先元素的值
  ```CSS
  a:link { color: blue; }
  ul a { color: inherit; }
  ```
  - `initial`: 将 CSS 属性重设为默认值
  ```CSS
  a:link { color: green; }
  ul a { color: initial; }
  ```
***
**注解:** `initial`是将属性的值重设为默认, 这种重设行为不在乎是什么元素
```CSS
div {
  display: initial; /** display默认值是inline */
}
```
***

#### 补充知识: 简写属性
+ 简写属性用于同时给多个属性赋值, 常见的简写属性有以下的示例
```CSS
/* font: 同时设置以下5个属性 */
/* font-style */
/* font-weight */
/* font-size */
/* font-height */
/* font-family */
div {
  font: italic bold 18px/1.2 sans-serif;
}
```
+ 部分简写属性可以不用设置所有的值, 但这样做有可能会覆盖其他样式
```CSS
:root { font-weight: bold; }
div {
  font: 32px sans-serif;
}
/** font属性没有配置font-weight, 其默认值为normal, 不加粗 */
```
+ 简写属性的顺序: 大多数简写属性的顺序很宽松, 尤其是每个值类型不一样时
```CSS
div { border: 1px solid red; }
div { border: solid green 10px; }
```
+ 关于四边/四角的简写顺序
  - 四边: 其顺序为 上 右 下 左, 即`TRBL`
  - 四角: 其顺序为 左上 右上 右下 左下
```CSS
div { padding: 10px 20px 20px 10px; }
div { border-radius: 10px 20px 20px 10px; }
```
***
**注解:** 简化记忆: 左上为先顺时针
***
+ 关于四边/四角的省略简写:
  - 只设置1个值, 则应用到所有的边/角
  - 设置2~3个值: 顺序不变, 省略值用对向值
```CSS
div { margin: 10px 20px; }
/** (上)10px (右)20px (下)省略 (左)省略 */
/** 省略值使用对向值, 因此下用上的值, 左用右的值 */
/** 结果: 依次是 (上)10px (右)20px (下)10px (左)20px */

div { border-radius: 10px 30px 20px; }
/** (左上)10px (右上)30px (右下)20px (左下)省略 */
/** 省略值使用对向值, 左下用右上的值 */
/** 结果: (左上)10px (右上)30px (右下)20px (左下)30px */
```
