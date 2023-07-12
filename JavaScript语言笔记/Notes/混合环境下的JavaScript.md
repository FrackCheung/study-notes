# 混合环境下的JavaScript

**[返回主目录](../readme.md)**

#### 宿主对象
+ 宿主环境(`浏览器`/`Node.js`等)提供给JavaScript引擎使用的变量:
  - `window`
  - `document`
  - ...
```JavaScript
// 特殊的宿主对象示例
const div = document.createElement('div');
typeof div; // "object"
Object.prototype.toString.call(div); // "[object HTMLDivElement]";
div.tagName; // "DIV"
```

#### 宿主对象的行为差异
+ 无法访问`Object`内建方法, 如`toString()`等;
+ 无法写覆盖
+ 包含一些预定义的只读属性
+ 无法将`this`重载为其他对象的方法

#### DOM的小知识
+ 创建带有`id`属性的DOM元素时会创建同名的`全局变量`
```JavaScript
// 假设: <div id="message"></div>
console.log(message); // HTML元素
```

#### 原生原型
+ 不要扩展原生原型
+ 确定要加则需要判断一下
```JavaScript
// 扩展原生原型
if (!Object.prototype.XXX) {
    Object.prototype.XXX = function() {
        // 兼容代码
    }
}
```

#### script标签
+ `<script>`可以引入外部代码, 也可以用包裹内联代码
+ 外部/内联代码共享`global/window`对象, 共享`命名空间`, 可以`进行交互`
+ 变量提升, 在`边界`中不适用: 即在第一个`<script>`中调用第二个`<script>`中定义的方法
+ 内联代码中不能包含`</script>`字符串, 变通方法: 拆开再拼接, 如 `</scr` + `ipt>`


#### 保留字
+ 保留字不能用于变量名, 但可以用于对象字面量中`属性名`或者`键值`(ES6之后)

#### 实现限制
+ JavaScript`规范`对于字符串最大长度, 函数参数个数等没有限制, 但`引擎`有限制
+ 补充的一些实现限制:
  - 字符串常量中允许的最大字符数
  - 可以作为参数传递到函数中的数据大小(栈大小, 单位:字节)
  - 函数中声明的参数个数
  - 未经优化的调用栈(如递归)的最大层数, 即函数调用链的最大长度
  - JavaScript程序以阻塞方式在浏览器中运行的最长时间(秒)
  - 变量名的最大长度
  - ...

****
**[返回主目录](../readme.md)**