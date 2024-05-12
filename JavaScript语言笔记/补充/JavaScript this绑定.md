# JavaScript this绑定

**[返回主目录](../readme.md)**

#### this的绑定规则
+ 默认绑定: 直接的函数调用: `someFunction()`;
+ 隐式绑定: 通过`A.B()`调用, `this`指向A对象
+ 显示绑定: 通过`call`, `apply`, `bind`显式修改函数的this指向
+ `new`绑定: 通过`new`操作符调用函数, 函数内部的`this`指向新创建的对象
+ 优先级`: `new` > 显示 > 隐式 > 默认
+ 箭头函数: 无论箭头函数在哪里被调用, `this`都是指向`定义处`所在上下文, 而非动态传入, 但当把方法引用传递给`第三方`时, 是会变化的, 这是个陷阱
```JavaScript
// this指针丢失的情况1: 回调函数中的间接引用
const myObject1 = {
    index: 123,
    getIndex() {
        console.log(this.index);
    }
}
setTimeout(myObject1.getIndex, 0); // undefind
setTimeout(myObject1.getIndex.bind(myObject1), 0); // 123

// 参数部分应用, 也称之为"柯里化", 使用bind将后续参数传入下层函数
function constructorFunction(arg1, arg2) {
    this.value = `${arg1}, ${arg2}`;
}
const bindFunction = constructorFunction.bind(null, 'argument1');
const result = new bindFunction('argument2');
console.log(result.value);
```

#### 箭头函数的陷阱 
+ 使用对象字面量定义对象, 将对象的属性定义为箭头函数, `this`会指向`window`或`undefined`
```JavaScript
const obj = {
    index: 123,
    getIndex: () => {
        return this.index;
    },
    getIndex
}
console.log(obj.getIndex()); // undefined
```
+ 在构造函数中使用箭头函数, `this`会指向新创建的对象
```JavaScript
function Button() {
    this.clicked = false;
    this.click = () => {
        this.clicked = !this.clicked;
    }
}
// 直接调用
const button = new Button();
button.click();
console.log(button.clicked); // true

// 传递引用, 再调用
const click = button.click;
click();
console.log(button.clicked); // false
```
***
**上面两点行为差异的个人理解:** 
+ 箭头函数没有自己的`this`, 将箭头函数内部的`this`拿到外部, `this`应该是相同的
+ 构造函数中的箭头函数:
```JavaScript
function Button() {
    this.clicked = false;
    this.click = () => {
        this.clicked = !this.clicked;
    }
}

// 将箭头函数内部的this代码拿出来, 放在外部
function Button {
    this.clicked = false;
    this.click = () => { };

    // 拿到外部来
    this.clicked = !this.clicked;
}

// 这时很好判断, 外部的this定义在构造函数里面, 指向创建的对象

// 因此箭头函数内部的this, 同样指向创建的对象
```
+ 对象字面量中的箭头函数
```JavaScript
const button = {
    clicked: false,
    click: () => {
        this.clicked = !this.clicked
    }
}

// 同样, 将箭头函数内部的this代码拿到外部
const button = {
    clicked: false,
    click: () => { },

    // 拿到外部
    this.clicked = !this.clicked
}

// 这时的this永远不会作为对象方法被调用到, 因此将不会指向对象

// 因此箭头函数内部的this, 是指向全局的(严格模式下指向undefined)
```
+ 一个复杂的示例:
```JavaScript
const button = {
    clicked: false,
    isClicked() {
        setTimeout(() => {
            console.log(this.clicked);
        }, 0);
    }
}

button.isClicked(); // false

const isClicked = button.isClicked;
isClicked(); // undefined

// 老规矩, this代码移动到外部!
const button = {
    clicked: false,
    isClicked() {
        console.log(this.clicked);
        setTimeout(() => { }, 0);
    }
}

// 这就很简单了, 如果是button.isClicked()调用, this指向button对象

// 如果是将button.isClicked引用传给第三方, 会造成this丢失, 指向undefined或者全局
```
***

**[返回主目录](../readme.md)**