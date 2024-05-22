+ [总目录](../readme.md)
***
- [表格元素](#表格元素)
- [DOM观察](#dom观察)
- [DOM遍历](#dom遍历)
- [DOM范围](#dom范围)
***
#### 表格元素
+ 使用`appendChild`动态创建表格会写出非常繁琐的代码
+ 表格的`<table>`/`<tbody>`/`<tr>`元素提供了更多的属性和方法

|        属性/方法         | 归属元素  |               作用                |
| :----------------------: | :-------: | :-------------------------------: |
|        `caption`         | `<table>` |           指向`caption`           |
|        `tBodies`         | `<table>` |    包含`tbody`的HTMLCollection    |
|         `tFoot`          | `<table>` |            指向`tfoot`            |
|         `tHead`          | `<table>` |            指向`thead`            |
|          `rows`          | `<table>` |      所有行的HTMLCollection       |
|  `(create/delete)THead`  | `<table>` |         创建/删除`thead`          |
| `(create/delete)Caption` | `<table>` |        创建/删除`caption`         |
|  `(create/delete)TFoot`  | `<table>` |         创建/删除`tfoot`          |
|  `(delete/insert)Rows`   | `<table>` |   插入/删除行, 参数是位置`pos`    |
|          `rows`          |  `tbody`  | `tbody`中的所有行的HTMLCollection |
|  `(insert/delete)Rows`   |  `tbody`  |   插入/删除行, 参数是位置`pos`    |
|         `cells`          |   `tr`    |        `tr`中的所有单元格         |
|  `(insert/delete)Cell`   |   `tr`    | 插入/删除单元格, 参数是位置`pos`  |

```JavaScript
const table = document.createElement('table');
const tbody = document.createElement('tbody');

tbody.insertRow(0);
tbody.rows[0].insertCell(0);
tbody.rows[0].cells[0].appendChild(document.createTextNode('行1-1'));
tbody.rows[0].insertCell(1);
tbody.rows[0].cells[1].appendChild(document.createTextNode('行1-2'));

table.appendChild(tbody);
document.body.appendChild(table);
```

#### DOM观察
+ 观察DOM, 并在其发生更改时, 异步调用回调
+ 可以观察整个DOM或者DOM的一部分, 甚至单个节点
+ 需要预先指定观察点, 以及回调函数
```JavaScript
// 定义一个观察实例, 先指定回调函数
const observer = new MutationObserver(() =>console.log("DOM发生了变化"));

const btn = document.querySelector('button');

// 开始观察 按钮的属性
observer.observe(btn, { attributes: true });
btn.className = 'login';
btn.classList.add('primary');
// DOM发生了变化
// DOM发生了变化
```
+ `oberve`方法的第二个参数, `MutationObserverInit`, 初始化观察配置:
```JavaScript
interface MutationObserverInit {
  attributeFilter?: string[]; // 属性过滤, 传入要观察的属性
  attributeOldValue?: boolean; // 启用记录属性的旧值
  attributes?: boolean; // 观察属性变化
  characterData?: boolean; // 观察文本节点的内容变化
  characterDataOldValue?: boolean; // 启用记录文本节点的旧值
  childList?: boolean; // 观察所有的子节点
  subtree?: boolean; // 观察整个子树
}
```
+ 回调函数的参数: `MutationRecord`, 记录了发生变化的详细信息
+ 类数组对象, 会依次记录目标的各种变化(一次修改), 如果是多次修改, 则会生成多个`MutationRecord`实例
```JavaScript
interface MutationRecord {
  [key: number]: {
    target: Node,
    type: `attributes`|`characterData`|`childList`,
    oldValue: string | null,
    attributeNames: string | null,
    attributeNamespace: string | null,
    addedNodes: NodeList,
    removedNodes: NodeList,
    previousSibling: Node,
    nextSibling: Node
  };
  length: number
}
```
+ `MutationRecord`实例属性

|         属性         |                   描述                   |          针对的类型          |
| :------------------: | :--------------------------------------: | :--------------------------: |
|       `target`       |            发生变化的目标节点            |            `all`             |
|        `type`        | `attributes`/`characterData`/`childList` |            `all`             |
|      `oldValue`      |           记录旧值, 需要先启用           | `attributes`/`characterData` |
|   `attributeNames`   |               变化的属性名               |         `attributes`         |
| `attributeNamespace` |              变化的命名空间              |         `attributes`         |
|     `addedNodes`     |            添加节点的NodeList            |         `childList`          |
|    `removedNodes`    |            移除节点的NodeList            |         `childList`          |
|  `previousSibling`   |         变化节点的前一个兄弟节点         |         `childList`          |
|    `nextSibling`     |         变化节点的下一个兄弟节点         |         `childList`          |

```JavaScript
// <button class="login">Login</button>

// 定义一个观察实例, 先指定回调函数
const observer = new MutationObserver((record) => console.log(record.oldValue));

const btn = document.querySelector('button');

// 开始观察 按钮的属性, 启用记录旧值
observer.observe(btn, { attributes: true, attributeOldValue: true });
btn.className = 'Login';

// login
```
***
**注解**: 命名空间, 使用`element.setAttributeNS()`方法, 三个参数, 分别是命名空间, 属性名, 属性值
```JavaScript
const observer = new MutationObserver((record) => console.log(record.attributeNamespace));

// 开始观察 按钮的属性, 启用记录旧值
observer.observe(document.body, { attributes: true });
document.body.setAttributeNS('namespace', 'id', 'value');
// namespace
```
***
+ 一个`MutationObserver`实例可以观察多个目标
```JavaScript
observer.observe(document.body, { attributes: true });
observer.observe(document.querySelector('button'), { attributes: true });
```
+ 停止观察和复用观察
```JavaScript
const observer = new MutationObserver((record) => console.log(record.oldValue));

// 开始观察 按钮的属性, 启用记录旧值
observer.observe(btn, { attributes: true });

// 停止观察, 这将取消所有的观察!
observer.disconnect();

// 再重启观察
observer.observe(btn, { attributes: true });
btn.className = 'Login';
```
+ 清空记录队列: `takeRecords`, 取出并返回所有的`MutationRecord`实例
```JavaScript
observer.takeRecords();
```
+ 性能:
  - `MutationObserver`对观察目标是弱引用
  - `MutationRecord`不是弱引用, 而且内部可能包含大量节点引用, 如需长期使用, 建议取出关键值, 放到新对象, 然后丢弃`MutationRecord`

#### DOM遍历
+ `childNodes`等属性, 返回了某个节点的所有子节点, 包含文本, 注释等, 但早期的IE浏览器不会包含文本注释, 这导致了行为差异
+ 针对元素的节点关系方法:
  - `childElementCount`: 返回子元素个数
  - `firstElementChild`: 指向第一个`Element`类型的子元素
  - `lastElementChild`: 指向最后一个`Element`类型的子元素
  - `previousElementSibling`: 前一个`Element`类型的兄弟元素
  - `lastElementSibling`: 下一个`Element`类型的兄弟元素
+ `children`属性: 类型为`HTMLCollection`, 只包含`Element`类型的子元素
***
以下介绍两种深度优先DOM遍历方法: `NodeIterator`和`TreeWalker`
***
+ `NodeIterator`: 通过`document.createNodeIterator()`创建实例, 接受4个参数:
  - `root`: `Node`节点, 作为遍历开始的根节点
  - `show`: 数值, 表示应该访问哪些类型的节点, 也有常量定义, 见下表
  - `filter`: `NodeFilter`对象或者函数, 表示是否接受或跳过特定节点
  - `entityReferenceExpansion`: HTML不涉及, 固定传`false`
  - 创建的实例包含两个方法: `nextNode()`和`previousNode()`, 用于遍历
***
**注解1**: 参数2, `show`的相关常量(只列出部分)

|           常量值            |   描述   |
| :-------------------------: | :------: |
|    `NodeFilter.SHOW_ALL`    | 所有节点 |
|  `NodeFilter.SHOW_ELEMENT`  | 元素节点 |
| `NodeFilter.SHOW_ATTRIBUTE` | 属性节点 |
|   `NodeFilter.SHOW_TEXT`    | 文本节点 |
|  `NodeFilter.SHOW_COMMENT`  | 注释节点 |
| `NodeFilter.SHOW_DOCUMENT`  | 文档节点 |

**注解2**: 参数2, `show`参数可以直接传入以上列表中的常量, 也可以使用按位操作拼接多个值, 除了`NodeFilter.SHOW_ALL`
```JavaScript
const show = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT;
```
**注解3**: 参数3, `filter`可以是`NodeFilter`对象, 即包含一个`acceptNode()`方法的对象, 或者就是一个函数, 入参都是节点
+ 如果要接收该节点进行遍历, 方法或者函数必须返回`NodeFilter.FILTER_ACCEPT`
+ 如果要跳过该节点进行遍历, 方法或者函数必须返回`NodeFilter.FILTER_SKIP`
```JavaScript
const filter = {
  acceptNode(node) {
    if (node.tagName.toLowerCase() === 'div') {
      return NodeFilter.FILTER_SKIP;
    }
    return NodeFilter.FILTER_ACCEPT;
  }
};
const filter = node => {
  if (node.tagName.toLowerCase() === 'div') {
    return NodeFilter.FILTER_SKIP;
  }
  return NodeFilter.FILTER_ACCEPT;
}
```
**完整示例**:
```JavaScript
const root = document.documentElement;
const show = NodeFilter.SHOW_ELEMENT;
const filter = node => node.tagName.toLowerCase() === 'div'
  ? NodeFilter.FILTER_SKIP
  : NodeFilter.FILTER_ACCEPT
const iterator = document.createNodeIterator(root, show, filter, false);

// NodeIterator实例有两个方法: nextNode()和previousNode()
let node = iterator.nextNode();
while (node !== null) {
  console.log(node.tagName);
  node = node.nextNode();
}
```
***
+ `TreeWakler`: 通过`document.createTreeWalker()`创建实例
  - 这是`NodeIterator`的进阶版, 接收的入参和`NodeIterator`完全一致
  - 实例也提供了`nextNode()`和`previousNode()`两个方法
  - 实例提供了额外的几个方法:
    - `parentNode()`: 遍历到当前节点的父节点
    - `firstChild()`: 遍历到当前节点的第一个子节点
    - `lastChild()`: 遍历到当前节点的最后一个子节点
    - `nextSibling()`: 遍历到当前节点的下一个同胞节点
    - `previousSibling()`: 遍历到当前节点的上一个同胞节点
  - 过滤参数`filter`提供了新的值: `NodeFilter.FILTER_REJECT`
    - `NodeFilter.FILTER_ACCEPT`: 没有区别
    - `NodeFilter.FILTER_SKIP`: 没有区别, 跳过某个节点
    - `NodeFilter.FILTER_REJECT`: 跳过节点及其该节点的整个子树, 只有`TreeWalker`能用
```JavaScript
const root = document.documentElement;
const show = NodeFilter.SHOW_ELEMENT;
const filterMap = new Map([
  ['div', NodeFilter.FILTER_REJECT],
  ['form', NodeFilter.FILTER_SKIP]
]);
const filter = node => filterMap.get(node.tagName.toLowerCase()) || NodeFilter.FILTER_ACCEPT;
const walker = document.createTreeWalker(root, show, filter, false);
walker.firstChild();
walker.nextSibling();
let node = walker.firstChild();
while (node !== null) {
  console.log(node.tagName);
  node = node.nextSibling();
}
```

#### DOM范围
+ 概念: 在文档中选择内容, 不用考虑节点之间的界限
+ 暂时意义不大, 几乎用不上
