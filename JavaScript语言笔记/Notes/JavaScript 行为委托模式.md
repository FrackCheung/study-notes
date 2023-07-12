# JavaScript 行为委托模式

**[返回主目录](../readme.md)**

#### 行为委托模式
+ 行为委托模式也称之为`对象关联`
+ 用行为委托模式来`模拟`面向对象中的`类`, 以及`类继承`
+ 当在自身找不到某个属性或者方法时, 将其委托给`[[prototype]]`链接的对象
+ 行为委托模式的`局限性`
  - 禁止相互委托(`循环委托`), 如果寻找一个不存在的属性或者方法, 就会陷入死循环
  - 调试困难

#### 示例代码: 控件类和按钮类的创建和继承
+ ES6 class实现的代码
```JavaScript
class Widget1 {
    constructor(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    }
    render($where) {
        if (this.$elem) {
            this.$elem.css({
                width: `${this.width}px`,
                height: `${this.height}px`
            }).appendTo($where);
        }
    }
}
class Button1 extends Widget1 {
    constructor(width, height, label) {
        super(width, height);
        this.label = label || 'Default';
    }
    onClick() {
        console.log(`Button ${this.label} clicked!`);
    }
    render($where) {
        super.render($where);
        this.$elem.click(this.onClick.bind(this));
    }
}
```
+ 纯JavaScript实现的模拟类
```JavaScript

function Widget2(width, height) {
    this.width = width || 50;
    this.height = height || 50;
    this.$elem = null; // HTML元素
}
Widget2.prototype.render = function ($where) {
    if (this.$elem) {
        this.$elem.css({
            width: `${this.width}px`,
            height: `${this.height}px`
        }).appendTo($where);
    }
}
function Button2(width, height, label) {
    Widget.call(this, width, height);
    this.label = label || 'Default';
    this.$elem = $('<button>').text(this.label);
}
Button2.prototype = Object.create(Widget.prototype);
Button2.prototype.onClick = function () {
    console.log(`Button ${this.label} clicked!`);
};
Button2.prototype.render = function ($where) {
    Widget.prototype.render.call(this, $where);
    this.$elem.click(this.onClick.bind(this));
};
$(document).ready(function () {
    const $body = $(document.body);
    const btn1 = new Button2(125, 30, 'Hello');
    const btn2 = new Button2(150, 40, 'World');

    btn1.render($body);
    btn2.render($body);
});
```
+ 行为委托模式(尽量不要在不同的对象上使用相同名称的属性或方法)
```JavaScript
const Widget3 = {
    init(width, height) {
        this.width = width || 50;
        this.height = height || 50;
        this.$elem = null;
    },
    insert($where) {
        if (this.$elem) {
            this.$elem.css({
                width: `${this.width}px`,
                height: `${this.height}px`
            }).appendTo($where);
        }
    }
}
const Button3 = Object.create(Widget3);
Button3.setup = function (width, height, label) {
    this.init(width, height);
    this.label = label || 'Default';
    this.$elem = $('<button>').text(this.label);
};
Button3.onClick = function () {
    console.log(`Button ${this.label} clicked!`);
};
Button3.build = function ($where) {
    this.insert($where);
    this.$elem.click(this.onClick.bind(this));
};
$(document).ready(function () {
    const $body = $(document.body);
    // 以下两行代码将创建对象和初始化对象分离
    // 在上面的两种模式中, 创建和初始化是一起的, 有些时候可能需要分开
    // 比如有一个实例池, 需要的时候再取出来初始化, 就可以使用行为委托模式
    const btn1 = Object.create(Button3);
    btn1.setup(120, 30, 'Hello');
    btn1.build($body);
});
```

****
**[返回主目录](../readme.md)**