+ [总目录](../readme.md)
***
+ [DOM 的概念](#dom的概念)
+ [节点的层次结构: DOM 树](#节点的层次结构-dom树)
+ [节点的类型](#节点的类型)
+ [节点关系和编辑](#节点关系和编辑)
+ [节点类型: Document(文档)](#节点类型-document文档)
+ [节点类型: Element(元素)](#节点类型-element元素)
+ [节点类型: Text](#节点类型-text)
+ [节点类型: Comment](#节点类型-comment)
+ [节点类型: Attr](#节点类型-attr)
+ [节点类型: DocumentType](#节点类型-documenttype)
+ [节点类型: DocumentFragment](#节点类型-documentfragment)
***

#### DOM 的概念
+ DOM 是 HTML 文档的编程接口, DOM 规范定义了操作文档的方式
+ DOM 是跨平台, 语言无关的表示
+ DOM 规范的具体实现因浏览器而异, 旧浏览器可能没有实现新方法
+ DOM 的第二重身份: 表示了由节点构成的文档本身
+ `总结`: DOM 是一种规范, 定义了操作文档的方式, 同时 DOM 也代表了文档本身
***
**注解**: DOM 不止是用在 HTML 上, 也应用在 XML 文档上
***

#### 节点的层次结构: DOM 树
+ HTML 表示
  ```html
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>标题</title>
    </head>
    <body>
      <!-- 这是一行注释 -->
      <button id="btn">JavaScript DOM</button>
    </body>
  </html>
  ```
+ 节点层次表示
  ```mermaid
  graph TD
  document[文档: Document]
  html[html: Element]
  head[head: Element]
  title[title: Element]
  body[body: Element]
  button[button: Element]

  text1[标题: Text]
  text2["JavaScript DOM: Text"]

  comment[这是一行注释: Comment]

  attribute[id: Attr]

  document ==> html
  html ==> head
  head ==> title
  title ==> text1
  html ==> body
  body ==> comment
  body ==> button
  button ==> text2
  button ==> attribute

  style document color:#FF00FF
  style text1 color:#FF0000
  style text2 color:#FF0000
  style comment color:#00EE00
  style attribute color:#0000FF
  ```

#### 节点的类型
+ 上图罗列出了 5 种节点类型, DOM 总共定义了 12 种节点类型
+ 部分节点类型在浏览器中并不支持, 本文档只介绍使用的类型
+ 所有的节点类型都继承了`Node`接口, 共享定义在`Node`上的基本属性和方法
  ```JavaScript
  // 可以这么理解
  interface Node {}
  class Element extends Node {}
  class Text extends Node {}

  class HTMLElement extends ELement {}
  class HTMLInputElement extends HTMLElment {}
  class HTMLDivElement extends HTMLElment {}
  // ...
  ```
+ 所有的节点都有`nodeType`/`nodeName`/`nodeValue`属性
+ `Node`上也定义了 12 个静态常量, 用于节点类型的判断, 使用点语法读取

|           节点类型            | 类型值 |      描述      |      `nodeName`      | `nodeValue` |
| :---------------------------: | :----: | :------------: | :------------------: | :---------: |
|      `Node.ELEMENT_NODE`      |   1    |    元素节点    |      元素标签名      |   `null`    |
|     `Node.ATTRIBUTE_NODE`     |   2    |    属性节点    |        属性名        |   属性值    |
|       `Node.TEXT_NODE`        |   3    |    文本节点    |       `#text`        |   文本值    |
|      `Node.COMMENT_NODE`      |   8    |    注释节点    |      `#comment`      |  注释信息   |
|     `Node.DOCUMENT_NODE`      |   9    |    文档节点    |     `#document`      |   `null`    |
|   `Node.DOXUMENT_TYPE_NODE`   |   10   |  文档类型节点  |     文档类型名称     |   `null`    |
| `Node.DOCUMENT_FRAGMENT_NODE` |   11   | 轻量级文档节点 | `#document-fragment` |   `null`    |

```JavaScript
const div = document.querySelector('div');
console.log(div.nodeType === 1); // true
console.log(div.nodeType === Node.ELEMENT_NODE); // true
```

#### 节点关系和编辑
+ 关于父节点/子节点/兄弟(同胞)节点的概念不再赘述
+ 以下讲到的属性和方法, 适用于任意类型的节点, 因为所有类型的节点都继承自`Node`
+ `childNodes`属性: 子节点, `NodeList`类型, 是一个类数组对象
  - 使用中括号或`item()`方法索引子节点, 传参是子节点索引值
  - 使用`length`属性获取子节点数量 (结果包含了所有类型的节点)

  ```html
  <ul>
    <!-- 这是注释 -->
    <li>1</li>
    <li>2</li>
    <li>3</li>
  </ul>
  <script>
    const ul = document.querySelector("ul");
    const childs = ul.childNodes;
    console.log(childs[1].nodeValue === "这是注释"); // true
    console.log(childs.item(0).nodeType === Node.TEXT_NODE); // true
    console.log(childs.length); // 9

    const childNodesArray = Array.from(childNodes);
  </script>
  ```
+ `firstChild`/`lastChild`/`parentNode`属性, 表示第 1 个/最后 1 个/父节点
+ `previousSibling`/`nextSibling`属性, 在兄弟节点之间导航
  - `previousSibling`: 当前节点的前一个兄弟节点, 没有则为`null`
  - `nextSibling`: 当前节点的下一个兄弟节点, 没有则为`null`
  - 节点变更时, 属性自动更新, 无需手动维护
  ```JavaScript
  const ul = document.querySelector('ul');
  console.log(ul.firstChild.nextSibling.nodeValue === ' 这是注释 '); // true
  ```
+ `appendChild`方法, 追加或移动节点
  - 如果`appendChild`一个文档中已经存在的节点, 则会将节点移动到新位置
  - `appendChild`将节点追加至最后一个节点
  ```JavaScript
  const ul1 = document.querySelector('.ul1');
  const ul2 = document.querySelector('.ul1');
  ul2.appendChild(ul1.lastChild);
  ```
+ `insertBefore`方法, 追加或移动节点到特定位置, 接受两个参数
  - 参数 1: 要追加或移动的节点
  - 参数 2: 参照节点, 添加到该节点的前面, 如果传入`null`, 效果和`appendChild`相同
  ```JavaScript
  const ul1 = document.querySelector('.ul1');
  const ul2 = document.querySelector('.ul1');
  ul2.insertBefore(ul1.lastChild, ul2.childNodes[2]);
  ```
+ `replaceChild`方法, 替换节点为新的节点, 接受两个参数
  - 参数 1: 要插入的节点
  - 参数 2: 被替换的节点
  ```JavaScript
  const ul1 = document.querySelector('.ul1');
  const ul2 = document.querySelector('.ul1');
  ul2.replaceChild(ul1.lastChild, ul2.childNodes[2]);
  ```
+ `removeChild`方法, 移除子节点
+ `cloneNode`方法, 复制节点, 接受一个布尔参数
  - 复制的节点并不会添加到 DOM 树中, 需要调用上述方法手动添加
  - 传入`true`, 进行深复制, 会复制当前节点和整个子树, `false`只复制当前节点
  - 节点定义的事件不会被复制
  ```JavaScript
  const ul = document.querySelector('ul');
  const copy1 = ul.cloneNode(false);
  const copy2 = ul.cloneNode(true);
  console.log(copy1.childNodes.length); // 0
  console.log(copy2.childNodes.length); // 9
  ```
+ 节点比较:
  - `isSameNode`: 是否完全相同 (指向同一个引用)
  - `isEqualNode`: 是否相等, 拥有相等的类型/属性/子节点
  ```JavaScript
  const btn1 = document.querySelector('.login');
  const btn2 = document.querySelector('.cancel');
  console.log(btn1.isSameNode(btn2)); // false
  console.log(btn1.isEqualNode(btn2)); // false
  console.log(btn1.isSameNode(btn1)); // true

  const btn3 = btn1.cloneNode(true);
  document.body.appendChild(btn3);
  console.log(btn1.isSameNode(btn3)); // false
  console.log(btn1.isEqualNode(btn3)); // true
  ```

***
以下将分别介绍每一种节点类型, 以及其对应的属性, 方法, **PS**: 只针对 HTML
***

#### 节点类型: Document(文档)
+ 类型: `Node.DOCUMENT_NODE`
+ 浏览器将该类型实现为`HTMLDocument`, 其实例为`document`
+ `document`挂载在`window`对象上, 可以直接访问
+ `document`表示文档的根节点, 一般只有两个子节点:
  - `<!DOCTYPE html>`
  - `<html></html>`
  ```JavaScript
  // 以下几个值是完全相等的
  const html1 = document.documentElement;
  const html2 = document.childNodes[1]; // 索引为0的节点是<!DOCTYPE html>
  const html3 = document.lastChild;
  const html4 = document.querySelector('html');
  ```
+ `document`快速访问属性, 由于部分信息大量使用, 因此提供了直接的访问方式

|       属性        |             值              |
| :---------------: | :-------------------------: |
| `documentElement` |      `html`元素的引用       |
|      `body`       |      `body`元素的引用       |
|      `head`       |      `head`元素的引用       |
|      `title`      |      `title`元素的引用      |
|       `URL`       |       完整的 URL 地址       |
|     `domain`      |      域名, 不包含端口       |
|    `referrer`     |            来源             |
|     `anchors`     | 所有包含`name`属性的`a`元素 |
|      `forms`      |      所有的`form`元素       |
|     `images`      |       所有的`img`元素       |
|      `links`      |  所有带`href`属性的`a`元素  |

+ 元素定位: 使用`document.getElementByXXX`/`getElementsByXXX`
  - `getElementsByXXX`返回的是类数组集合, 且是实时的, 其类型为`HTMLCollection`
  - 不要在`getElementsByXXX`的结果循环中创建新的元素, 会导致无穷循环
  ```JavaScript
  const divs = document.getElementsByTagName('div');
  for (let index = 0; index < divs.length; index++) {
    document.body.appendChild(document.createElement('div'));
  }

  // 修正
  for (let index = 0, len = divs.length; index < len; index++) {
    document.body.appendChild(document.createElement('div'));
  }
  ```
***
**注解**: `NodeList`和`HTMLConnection`的区别
+ `getElementsByXXX`从其方法名称上来看, 主要是获取`Element`类型的节点, 即元素, 其返回值被特别设置为`HTMLConnection`
+ 通过读取`childNodes`属性, 得到的子节点数据, 由于不止是元素, 还可能是其他节点类型, 因此其类型被设置为`NodeList`
+ `NodeList`和`HTMLConnection`基本上相同:
  - 都是类数组对象
  - 可以通过中括号, `item`方法, 获取到里面的节点数据
  - 都是实时的, 不要再循环中创建新节点, 除非预先缓存长度
+ `HTMLConnection`多了一些特点:
  - 中括号访问不仅可以传入索引, 还可以传入字符串, 这将匹配`name`属性的值
  - 额外提供`namedItem()`方法, 同样匹配`name`属性的值
  ```html
  <img src="image.png" name="main" />
  <img src="image.png" name="content" />
  <script>
    // 也可以用document.images
    const images = document.getElementsByTagName("a");
    console.log(images[0] === images.namedItem("main")); // true
    console.log(images[0] === images["main"]); // true
  </script>
  ```
***
+ 元素定位新方法: `document.querySelector`/`document.querySelectorAll`
  - 直接传入 CSS 选择器, CSS 支持的选择器都兼容
  - 不能选中伪类, 也不能选中伪元素
  - `querySelectorAll`返回的是静态`NodeList`类型, 非实时
  ```JavaScript
  // 不会陷入无穷循环
  const divs = document.querySelectorAll('div');
  for (let index = 0; index < divs.length; index++) {
    document.body.appendChild(document.createElement('div'));
  }
  ```
+ 创建节点: `document.createXXX`, 烂大街的方法, 没啥讲的
+ 焦点元素: `document.activeElement`, 实时包含当前有焦点的元素, 只读
+ 文档状态: `document.readyState`, 两个值`loading`/`complete`, 只读
+ 渲染模式: `document.compatMode`, 两个值, 只读
  - `CSS1Compat`: 标准模式
  - `BackCompat`: 混杂模式
+ 字符集属性: `document.characterSet`, 可赋值
+ 计算样式: `document.defaultView.getComputedStyle()`: 两个参数
  - 参数 1: 要获取样式的元素
  - 参数 2: 伪元素, 不涉及伪元素则传`null`
  - 返回值类型是`CSSStyleDeclaration` (和`element.style`的值一样)
  ```JavaScript
  const btn = document.querySelector('button');
  const cStyle = document.defaultView.getComputedStyle(btn, null);
  const cStyle = document.defaultView.getComputedStyle(btn, ':after');
  ```
+ 操作样式表: `document.styleSheets`, 意义不大, 省略
  ```html
  <style>
    div {
      width: 200px;
      height: 200px;
    }
  </style>
  <script>
    const sheet = document.styleSheets[0];
    const rule = (sheet.cssRules || sheet.rules)[0];
    console.log(rule.selectorText); // "div"
    console.log(rule.style.cssText); // 完整的CSS代码
    console.log(rule.style.width); // 200px
    console.log(rule.style.height); // 200px
    sheet.insertRule(`html,body { padding: 0; margin: 0 }`);
    sheet.deleteRule(0);
  </script>
  ```

#### 节点类型: Element(元素)
+ 节点类型: `Node.ELEMENT_NODE`
+ HTML 元素都是`HTMLElement`类型, 该类型继承自`Element`, 并扩充了一些属性
  - `id`: 元素在文档中唯一的标识符
  - `title`: 描述信息
  - `className`: class 属性, 因和 JavaScript 重名, 改为`className`, 返回完整的 class 字符串
  - ...
+ 每一种特定元素, 都有特定类型, 但都是从`HTMLElement`继承而来, 进一步扩充了属性
  - `HTMLCanvasElement`: canvas 元素
  - `HTMLButtonElement`: button 元素
  - `HTMLInputElement`: input 元素
  - ...
+ 元素属性操作
  - `getAttribute()`: 获取属性值, 传参为属性名
  - `setAttribute()`: 设置属性, 传参为属性名, 属性值, 有则替换, 无则添加
  - `removeAttribute()`: 移除属性, 传参为属性名
  - 元素属性也是 DOM 对象的属性, 可以直接赋值和读取值
  ```JavaScript
  const btn = document.querySelector('button');
  btn.id = 'login-btn';
  btn.style.width = '200px';
  btn.style.height = '50px';
  console.log(btn.id); // login-btn
  console.log(btn.style.width); // 200px
  console.log(btn.style.height); // 50px
  ```
  - 有些属性不要直接用于后续的功能, 比如`style`
  ```html
  <style>
    button {
      width: 100px !important;
      height: 20px !important;
    }
  </style>
  <button style="width: 200px; height: 50px"></button>
  <script>
    const btn = document.querySelector("button");
    console.log(btn.getAttribute("style")); // "width: 200px; height: 50px"
    console.log(btn.style.width, btn.style.height); // 200px 50px
  </script>
  ```
***
**注解**: 某些属性, 使用`getAttribute()`方法和使用点语法得到的结果有差别
+ `style`属性:
  - 使用`getAttribute`, 得到的是内联样式的源代码字符串
  - 使用`element.style`: 得到的是`CSSStyleDeclaration`类型的对象
+ 事件, 主要指使用`on`直接注册在元素上的事件
  - 使用`getAttribute`: 得到的是字符串类型的函数源代码
  - 使用`element.onXXX`: 得到的是函数的引用, 没有则是`null`
+ 自定义属性, 使用点语法添加的自定义属性, 不会被`getAttribute`方法获取到
  ```JavaScript
  const btn = document.querySelector('button');
  btn.customAttribute = 'customValue';
  console.log(btn.getAttribute('customAttribute')); // null
  ```
***
+ `attributes`属性: 元素类型的节点特有的属性, 其值为`NamedNodeMap`类型的实时集合
  - `getNamedItem(name)`: 返回`nodeName`为参数 name 的节点
  - `removeNamedItem(name)`: 删除`nodeName`等于 name 的节点
  - `setNamedItem(node)`: 添加`node`节点, `node`必须是`Attr`类型
  - `item(pos)`: 返回索引位置为`pos`的节点
  - 一定要理清楚: 上述描述的节点, 都是属性节点, 类型为`Attr`
  ```JavaScript
  // <input id="login" type="button">
  const btn = document.querySelector('input');
  console.log(btn.attributes);
  /**
   * {
   *   0: { nodeName: 'id', nodeValue: 'login' },
   *   1: { nodeName: 'type', nodeValue: 'button' }
   * }
   */
   btn.attributes.getNamedItem('id'),nodeValue; // login
   btn.attributes.item(0).nodeValue; // button
   btn.attributes.removeNamedItem('id');
  ```
+ 动态创建脚本/样式表
  ```JavaScript
  const script = document.createElement('script');
  script.src = 'index.js';
  document.body.appendChild(script);

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';
  style.href = 'index.css';
  documnet.head.appendChild('style');
  ```
+ 元素类操作: `element.classList`, 其类型为`DOMTokenList`
  - `add()`: 添加类
  - `contains()`: 判断是否包含
  - `remove()`: 移除类
  - `toggle()`: 有则删, 没有则添加
+ 元素匹配: `element.matches()`
  - 参数是 CSS 选择器, 和`document.querySelector()`差不多
  - 用于判断元素是否和选择器匹配
  ```JavaScript
  // <button class="login"></button>
  const btn = document.querySelector('button');
  const isMatch = btn.matches('button.login');
  if (isMatch) {
    console.log('按钮的class属性包含login')
  }
  ```
+ 自定义属性: 必须以`data-`开头, 提供`dataset`属性访问和操作, 类型为`DOMStringMap`
  - `dataset`访问自定义属性不需要添加`data-`前缀
  - 自定义属性名中包含`-`连字符, 需要转成小驼峰
  ```JavaScript
  // <div data-app-name="JSStudy" data-key="123"></div>
  const div = document.querySelector('div');
  console.log(div.dataset.key); // 123
  console.log(div.dataset.appName); // JSStudy

  div.dataset.appName = 'JavaScript Study'
  ```
+ `innerHTML`: 插入内容, 可以是文本, 或者 HTML 代码, 特殊字符会编码
  - 插入文本还可以直接使用`innerText`
+ `outerHTML`: 读取时, 返回调用元素及其后代元素的 HTML 字符串, 赋值时, 直接替换调用元素
  - 替换为文本还可以直接使用`outerText`
  ```html
  <ul>
    <li>1</li>
    <li>1</li>
    <li>1</li>
  </ul>
  <script>
    const ul = document.querySelector("ul");
    console.log(ul.outerHTML);

    ul.outerHTML = "<span>Hello</span>";
  </script>
  ```
+ 特定位置插入: `insertAdjacentHTML`/`insertAdjacentText`
  - 参数 1: 表明插入位置, 见下表
  - 参数 2: 要插入的 HTML 片段或者文本

|     参数      |                     位置描述                      |
| :-----------: | :-----------------------------------------------: |
| `beforebegin` | 插入当前元素前面, 成为当前元素的`previousSibling` |
| `afterbegin`  |   插入当前元素内部, 成为当前元素的`firstChild`    |
|  `beforeend`  |    插入当前元素内部, 成为当前元素的`lastChild`    |
|  `afterend`   |   插入当前元素后面, 成为当前元素的`nextSibling`   |

```JavaScript
// <button class="login">登录</button>
const btn = document.querySelector('button');
button.insertAdjacentHTML('beforebegin', '<button>取消</button>');
```
***
**提示**: 将`begin`和`end`理解成当前元素的开始标签和闭合标签
***
+ 元素滚动: `scrollIntoView`方法, 将元素滚动到视口中, 传参有三种形式
  - 布尔值: `true`表示滚动后元素顶部与视口顶部对齐, `false`表示元素底部和视口底部对齐
  - 对象: 更加丰富的指定滚动的效果, 其类型为`scrollIntoViewOptions`
  - 不传任何参数表示默认为`true`
  ```JavaScript
  interface scrollIntoViewOptions {
    behavior: 'smooth'|'auto', // 平滑滚动, 默认auto
    block: 'start'|'center'|'end'|'nearest', // 垂直方向的对齐
    inline: 'start'|'center'|'end'|'nearest' // 水平方向的对齐
  }

  document.forms[0].scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'start'
  });
  ```
+ 内容滚动: `scrollTo`方法, 将元素内的内容滚动区域滚动到指定的位置
  ```JavaScript
  const container = document.querySelector('div');
  container.scrollTo({
    left: container.scrollLeft + 200, // 向左滚动200像素
    behavior: 'smooth'
  });
  ```
+ 后代判断: `contains`, 判断元素是否为调用元素的后代
  ```JavaScript
  const ul = document.querySelector('ul');
  const li = document.querySelector('.item');
  console.log(ul.contains(li));
  ```
+ 元素尺寸, 包括偏移尺寸, 客户端尺寸和滚动尺寸
  - CSS 中定义的`width`和`height`指的是内容宽高, 不包括内边距, 边框和外边距
  - 关于尺寸以及盒模型, 在 CSS 的培训中会专门讲述

|          属性          |                     描述                     |
| :--------------------: | :------------------------------------------: |
| `element.offsetWidth`  |       布局宽度, 包含边框, 内边距和内容       |
| `element.offsetHeight` |       布局高度, 包含边框, 内边距和内容       |
|  `element.offsetLeft`  |      元素左侧到`offsetParent`左侧的距离      |
|  `element.offsetTop`   |      元素顶部到`offsetParent`顶部的距离      |
| `element.clientWidth`  |         客户端宽度, 包含内边距和内容         |
| `element.clientHeight` |         客户端高度, 包含内边距和内容         |
|  `element.clientLeft`  |                  左边框宽度                  |
|  `element.clientTop`   |                  上边框宽度                  |
| `element.scrollWidth`  | 内容区域宽度, 包含`overflow`隐藏部分和内边距 |
| `element.scrollHeight` | 内容区域高度, 包含`overflow`隐藏部分和内边距 |
|  `element.scrollLeft`  |           内容区域左侧隐藏的像素数           |
|  `element.scrollTop`   |           内容区域顶部隐藏的像素数           |

***
**注解 1**: `offsetParent`指离元素最近的祖先定位元素, 没有则为`body`
**注解 2**: 滚动条不会出现在边框外  
**注解 3**: 滚动条的出现会导致`scrollWidth`和`scrollHeight`减少`17`
```html
<style>
  .container {
    width: 200px;
    height: 200px;
    padding: 100px;
    border: 1px solid red;
    overflow: auto;
  }
</style>
<div class="container">
  <div style="height:1000px"></div>
</div>
<!-- scrollWidth是383, 即400 - 17 -->
```
***
+ 确定元素的尺寸和相对于视口的位置: `element.getBoundingClientRect()`
  - 返回`DOMRect`类型的对象, 包含 6 个属性
  - `left`/`right`/`top`/`bottom`/`width`/`height`
  - `left`: 元素左边框外侧距离视口左侧的像素数
  - `right`: 元素右边框外侧距离视口左侧的像素数
  - `top`: 元素上边框外侧距离视口顶部的像素数
  - `bottom`: 元素下边框外侧距离视口顶部的像素数
  - `width`: 元素宽度, 包含内边距, 边框, 和内容
  - `height`: 元素高度, 包含内边距, 边框, 和内容

#### 节点类型: Text
+ 节点类型: `Node.TEXT_NODE`
+ 节点类型可通过`nodeValue`或者`data`属性获取文本, 二者同步
  ```JavaScript
  // <button>login</button>
  const btn = document.querySelector('button');
  const textNode = btn.firstNode;
  console.log(btn.data); // login
  console.log(btn.nodeValue); // login
  btn.nodeValue = '登录';
  console.log(btn.data); // 登录
  ```
+ 文本节点操作方法
  - `appendData(text)`: 向文本节点追加文本`text`
  - `deleteData(offset, count)`: 从文本的`offset`位置开始, 删除`count`个字符
  - `insertData(offset, text)`: 在文本的`offset`处插入`text`, 前插
  - `replaceData(offset, count, text)`: 类似于数组的`splice`方法
  - `splitText(offset)`: 将文本从`offset`处, 拆分为两个文本节点
  - `substringData(offset, count)`: 提取子文本
  ```JavaScript
  // <button>login</button>
  const btn = document.querySelector('button');
  const textNode = btn.firstNode;
  textNode.appendData('-login');
  console.log(textNode.nodeValue); // login-login
  ```
+ 创建文本节点: 使用`document.createTextNode`
  ```JavaScript
  const textNode = document.createTextNode('Hello');
  textNode.appendData('World');
  textNode.insertData(5, ' ');
  textNode.appendData('!');
  const span = document.querySelector('span');
  span.appendChild(textNode); // Hello, World!
  ```
+ `normalize()`方法, 归一化文本节点, 该方法由文本节点的父节点调用
  - 用代码的方式可以创建出兄弟文本节点
  - 使用`normalize()`方法, 将兄弟文本节点合并为一个文本节点
  ```JavaScript
  // <button>MyButton</button>
  const btn = document.querySelector('button');
  console.log(btn.childNodes.length); // 1

  btn.firstChild.splitText(2);

  console.log(btn.childNodes.length); // 2
  console.log(btn.childNodes[0].data); // My
  console.log(btn.childNodes[1].nodeValue); // Button

  btn.normalize();

  console.log(btn.childNodes.length); // 1
  console.log(btn.childNodes[0].data); // MyButton
  ```
+ HTML 解析加载后, 一个元素中的文本只会被解析为一个节点
+ 其他赋值方法: `innerHTML`/`element.textContent = text`

#### 节点类型: Comment
+ 节点类型: `Node.COMMENT_NODE`
+ `Comment`注释节点和`Text`文本节点同时都继承了`CharacterData`基类, 因此可以使用除`splitText`以外的所有属性和方法
  ```JavaScript
  // <button><!--按钮注释-->Login</button>
  const btn = document.querySelector('button');
  console.log(btn.childNodes[0].nodeValue); // 按钮注释
  ```
+ 谁会去用代码操作注释呢?

#### 节点类型: Attr
+ 节点类型: `Node.ATTRIBUTE_NODE`
+ 属性节点的示例有三个属性:
  - `name`: 属性名
  - `value`: 属性值
  - `specified`: 布尔值, 属性值是默认还是指定
+ 属性的创建和设置:
  - `document.createAttribute(name)`: 创建一个属性名为`name`的属性节点
  - `element.setAttributeNode(attr)`: 给元素设置属性节点`attr`
  ```JavaScript
  const attr = document.createAttribute('id');
  attr.value = 'login-button';
  const btn = document.querySelector('button');
  btn.setAttributeNode(attr);

  // <button id="login-button"></button>
  ```
+ 谁会去这么操作属性呢, 还是推荐:
  - `element.getAttribute()`
  - `element.setAttribute()`
  - `element.removeAttribute()`

#### 节点类型: DocumentType
+ 节点类型: `Node.DOCUMENT_TYPE_NODE`
+ 该节点保存了文档类型信息
+ 通过`document.doctype`可访问文档类型信息, 其类型为`DocumentType`
+ `DocumentType`有三个属性, HTML 只需要关心其`name`属性
  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <title>DocumentType</title>
    </head>
    <body>
      <script>
        console.log(document.doctype.name); // html
        console.log(document.doctype);
      </script>
    </body>
  </html>
  ```
+ 其实`document.doctype.name`返回的就是`<!DOCTYPE html>`中, 紧紧跟在`!DOCTYPE`后面的文本

#### 节点类型: DocumentFragment
+ 节点类型: `Node.DOCUMENT_FRAGMENT_NODE`
+ 文档片段的解释:
  - 文档片段可以理解为一个仓库, 可以向里面尽情的添加节点
  - 文档片段的内容不会被添加到 DOM 树, 除非显示的手动添加
  - 将 DOM 中现有的节点添加到文档片段中, 则该节点会从 DOM 树中移除
+ 主要用途: 优化 DOM 创建的性能
  ```JavaScript
  // <ul></ul>
  const ul = document.querySelector('ul');
  for (let index = 0; index < 1000; index++) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`列表的第${index}项`));
    ul.appendChild(li);
  }

  // 优化
  const ul = document.querySelector('ul');
  const documentFragment = document.createDocumentFragment();
  for (let index = 0; index < 1000; index++) {
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`列表的第${index}项`));
    documentFragment.appendChild(li);
  }
  ul.appendChild(documentFragment);
  ```
