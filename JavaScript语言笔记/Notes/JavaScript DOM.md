+ [总目录](../readme.md)

#### DOM的概念
+ DOM是HTML文档的编程接口, DOM规范定义了操作文档的方式
+ DOM是跨平台, 语言无关的表示
+ DOM规范的具体实现因浏览器而异, 旧浏览器可能没有实现新方法
+ DOM的第二重身份: 表示了由节点构成的文档本身
+ `总结`: DOM是一种规范, 定义了操作文档的方式, 同时DOM也代表了文档本身
***
**注解**: DOM不止是用在HTML上, 也应用在XML文档上
***

#### 节点的层次结构: DOM树
+ HTML表示
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
+ 上图罗列出了5种节点类型, DOM总共定义了12种节点类型
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
+ `Node`上也定义了12个静态常量, 用于节点类型的判断, 使用点语法读取

|节点类型|类型值|描述|`nodeName`|`nodeValue`|
|:-:|:-:|:-:|:-:|:-:|
|`Node.ELEMENT_NODE`|1|元素节点|元素标签名|`null`|
|`Node.ATTRIBUTE_NODE`|2|属性节点|属性名|属性值|
|`Node.TEXT_NODE`|3|文本节点|`#text`|文本值|
|`Node.COMMENT_NODE`|8|注释节点|`#comment`|注释信息|
|`Node.DOCUMENT_NODE`|9|文档节点|`#document`|`null`|
|`Node.DOXUMENT_TYPE_NODE`|10|文档类型节点|文档类型名称|`null`|
|`Node.DOCUMENT_FRAGMENT_NODE`|11|轻量级文档节点|`#document-fragment`|`null`|

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
    const ul = document.querySelector('ul');
    const childs = ul.childNodes;
    console.log(childs[1].nodeValue === '这是注释'); // true
    console.log(childs.item(0).nodeType === Node.TEXT_NODE); // true
    console.log(childs.length); // 9

    const childNodesArray = Array.from(childNodes);
  </script>
  ```
+ `firstChild`/`lastChild`/`parentNode`属性, 表示第1个/最后1个/父节点
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
  - 参数1: 要追加或移动的节点
  - 参数2: 参照节点, 添加到该节点的前面, 如果传入`null`, 效果和`appendChild`相同
  ```JavaScript
  const ul1 = document.querySelector('.ul1');
  const ul2 = document.querySelector('.ul1');
  ul2.insertBefore(ul1.lastChild, ul2.childNodes[2]);
  ```
+ `replaceChild`方法, 替换节点为新的节点, 接受两个参数
  - 参数1: 要插入的节点
  - 参数2: 被替换的节点
  ```JavaScript
  const ul1 = document.querySelector('.ul1');
  const ul2 = document.querySelector('.ul1');
  ul2.replaceChild(ul1.lastChild, ul2.childNodes[2]);
  ```
+ `removeChild`方法, 移除子节点
+ `cloneNode`方法, 复制节点, 接受一个布尔参数
  - 复制的节点并不会添加到DOM树中, 需要调用上述方法手动添加
  - 传入`true`, 进行深复制, 会复制当前节点和整个子树, `false`只复制当前节点
  - 节点定义的事件不会被复制
  ```JavaScript
  const ul = document.querySelector('ul');
  const copy1 = ul.cloneNode(false);
  const copy2 = ul.cloneNode(true);
  console.log(copy1.childNodes.length); // 0
  console.log(copy2.childNodes.length); // 9
  ```
***
以下将分别介绍每一种节点类型, 以及其对应的属性, 方法, **PS**: 只针对HTML
***

#### 节点类型: Document
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

|属性|值|
|:-:|:-:|
|`documentElement`|`html`元素的引用|
|`body`|`body`元素的引用|
|`head`|`head`元素的引用|
|`title`|`title`元素的引用|
|`URL`|完整的URL地址|
|`domain`|域名, 不包含端口|
|`referrer`|来源|
|`anchors`|所有包含`name`属性的`a`元素|
|`forms`|所有的`form`元素|
|`images`|所有的`img`元素|
|`links`|所有带`href`属性的`a`元素|

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
  <img src="image.png" name="main">
  <img src="image.png" name="content">
  <script>
    // 也可以用document.images
    const images = document.getElementsByTagName('a');
    console.log(images[0] === images.namedItem('main')); // true
    console.log(images[0] === images['main']); // true
  </script>
  ```
***

+ 元素定位新方法: `document.querySelector`/`document.querySelectorAll`
  - 直接传入CSS选择器, CSS支持的选择器都兼容
  - `querySelectorAll`返回的是静态`NodeList`类型, 非实时
  ```JavaScript
  // 不会陷入无穷循环
  const divs = document.querySelectorAll('div');
  for (let index = 0; index < divs.length; index++) {
    document.body.appendChild(document.createElement('div'));
  }
  ```

+ 创建节点: `document.createXXX`, 烂大街的方法, 没啥讲的


#### 节点类型: Element
+ 节点类型: `Node.ELEMENT_NODE`
+ HTML元素都是`HTMLElement`类型, 该类型继承自`Element`, 并扩充了一些属性
  - `id`: 元素在文档中唯一的标识符
  - `title`: 描述信息
  - `className`: class属性, 因和JavaScript重名, 改为`className`
  - ...
+ 每一种特定元素, 都有特定类型, 但都是从`HTMLElement`继承而来, 进一步扩充了属性
  - `HTMLCanvasElement`: canvas元素
  - `HTMLButtonElement`: button元素
  - `HTMLInputElement`: input元素
  - ...
+ 元素属性操作
  - `getAttribute()`: 获取属性值, 传参为属性名
  - `setAttribute()`: 设置属性, 传参为属性名, 属性值, 有则替换, 无则添加
  - `removeAttribute()`: 移除属性, 传参为属性名
  - 元素属性也是DOM对象的属性, 可以直接赋值和读取值
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
    const btn = document.querySelector('button');
    console.log(btn.getAttribute('style')); // "width: 200px; height: 50px"
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
  - `getNamedItem(name)`: 返回`nodeName`为参数name的节点
  - `removeNamedItem(name)`: 删除`nodeName`等于name的节点
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

+ HTML解析加载后, 一个元素中的文本只会被解析为一个节点

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
+ `DocumentType`有三个属性, HTML只需要关心其`name`属性
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
  - 文档片段的内容不会被添加到DOM树, 除非显示的手动添加
  - 将DOM中现有的节点添加到文档片段中, 则该节点会从DOM树中移除
+ 主要用途: 优化DOM创建的性能
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
