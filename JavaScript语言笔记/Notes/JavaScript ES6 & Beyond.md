# JavaScript ES6 & Beyond

**[返回主目录](../readme.md)**

#### ES6模块
+ ES6模块是`单文件`模块, 不能把多个模块合在一个文件中
+ ES6是`静态`模块, 需要预先静态定义所有的导入导出, 无法动态补充
+ ES6模块是`单例`, 模块只有一个实例, 多个导入是对单个实例的引用
+ ES6模块导出的属性/方法/原始值都是`绑定`, 类似于`指针`, 模块内部修改会影响导出
+ ES6之前的模块中暴露的`原始值`不是引用, 是`复制赋值`, 模块内部的修改不影响导出
+ 模块导出的陷阱
```JavaScript
// 模块导出的陷阱
// 1
export function moduleA() { }
// 2
function moduleB() { }
export { moduleB as default };
// 第1种: 导出的是函数表达式的值, 即使给moduleA重新赋值, 导出的依然是该函数
// 第2种: 导出的是标识符, 如果对moduleB重新赋值, 导出的值也会随之变化
```
+ `import`和`export`必须出现在`最顶层`作用域
+ `import`导入的成员`不允许`对其`重新赋值`
+ `import`导入语句是会`提升`的
+ ES6模块是`静态加载语义`的, 即使有循环依赖, 任何一个运行之前两者都将加载
+ 循环依赖
```JavaScript
// 循环依赖, 静态决议, 预先静态加载, 
// 模块A
import moduleFromB from B;
export default function methodA(x) {
    if (x >= 10) {
        return methodB(x - 1);
    }
    return x2;
}

// 模块B
import moduleFromA from A
export default function methodB(y) {
    if (y > 5) {
        return methodA(y / 2);
    }
    return y3;
}
// A和B循环依赖, 但是不影响使用, 因为在使用之前A和B都已经加载决议
```

#### 模块加载
+ `import`语句使用外部环境提供的独立机制将模块标识符解析为可用指令
  - `浏览器`会将模块标识符解析为`URL`(一般情况下)
  - `Node.js`会将模块标识符解析为`文件系统路径`
+ 模块加载器本身不由ES6指定


#### class类
+ `constructor`中定义的`变量`最终会定义在`实例`上
+ 类体中定义的`方法`最终会定义在`原型`上
+ `class`定义不会提升, `function`定义会提升
+ `extends`用于在两个函数原型之间建立`[[prototype]]`委托链接
+ `super`在`class`中不同的地方代表的含义是不同的
```JavaScript
// super的不同代表
class PersonA {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    greetingA() {
        console.log(`${this.name}, ${this.age}`);
    }
    static logA() {
        console.log(`this is a static method.`);
    }
}
class PersonB extends PersonA {
    constructor(name, age, height) {
        // constructor中的super代表PersonA
        // 加括号调用, 就相当于new PersonA
        super(name, age);
        this.height = height;
    }
    greetingB() {
        // 类体方法中的super代表PersonA.prototype
        // 可以引用PersonA原型上的方法
        super.greetingA();
        console.log(`${this.height}`);
    }
    static logB() {
        // 在静态方法中, super代表PersonA
        // 可以引用PersonA的静态方法
        super.logA();
        console.log(`you can see`);
    }
}
const p = new PersonB('zhangzhen', 28, 170);
p.greetingB();
```
+ 不能在构造器中使用`super.prototype`
+ 不能在非构造器方法中使用`super.constructor()`
+ `super`并不是动态绑定的, 也`不能重载`
+ 子类继承父类时, 如果不写`constructor`, 会隐式调用`super()`
```JavaScript
// 子类默认的super调用
class ParentClass {
    constructor(name, age, height) {
        this.name = name;
        this.age = age;
        this.height = height;
    }
    log() {
        console.log(this.name, this.age, this.height);
    }
}
class ChildClass extends ParentClass { }
const child = new ChildClass('zhang', 28, 170);
child.log();
// 子类中虽然没有constructor, 但是传参却依然正常生效
// 因为子类会默认调用super(), 并将参数传入, 就像这样:
// constructor(...args){ super(...args); }
```
+ 子类构造器中必须先调用`super()`, 才能使用`this`
```JavaScript
// 子类构造器必须先调用super(), 才能使用this
class ChildClass2 extends ParentClass {
    constructor(name, age, height) {
        // 不能调换顺序 !!!
        // this.id = '123';
        // super(name, age, height); 会抛出错误
        super(name, age, height);
        this.id = '123';
    }
}
// 原因:
// 1. ES6 class中, 创建/初始化实例的this的实际上是父类构造器
// 2. ES6之前, 相反, this是由子类构造器创建, 然后在该this上调用父类构造器

function ParentFunction(name, age, height) {
    this.name = name;
    this.age = age;
    this.height = height;
}
function ChildFunction(name, age, height) {
    // 调换顺序也无所谓
    // ParentClass.call(this, name, age, height);
    // this.id = '123';
    this.id = '123';
    ParentFunction.call(this, name, age, height);
}
ChildFunction.prototype = Object.create(ParentFunction.prototype);
new ChildFunction('zhang', 28, 170);
```
+ ES6之前的通过`prototype`链接到原生类型的对象无法完全继承原生类型的所有特性  
  - 比如扩展`Array`类型的子类, 其`length`属性无法自动更新  
  - 比如扩展`Error`类型的子类, 无法获取错误的`stack`信息, 如文件行号和文件名  
+ `new.target`:  
  - 在一般函数中是`undefined`  
  - 在构造器中, 指向实际直接调用的构造器, 即使是子类中的`super()`  
```JavaScript
// new.target
class NewClass {
    // 调用new NewClass();
    constructor() {
        // NewClass: NewClass
        console.log(`NewClass: ${new.target.name}`);
    }
}
class NewClassChild extends NewClass {
    // 调用new NewClassChild();
    constructor() {
        // NewClass: NewClassChild, 仍然指向子类
        super();
        // NewClassChild: NewClassChild
        console.log(`NewClassChild: ${new.target.name}`);
    }
    methodNew() {
        // undefined
        console.log(`methodNew: ${new.target}`);
    }
}
```
+ `static`方法直接添加到函数对象上, 而非`prototype`上  
  - 使用`class A extends B`, `A.prototype`通过`prototype`连接到`B.prototype`  
  - 使用`class A extends B`, A函数对象也通过prototype连接到B函数对象  
  - 在子类的静态方法中, `super`代表父类的函数对象, 通过点语法可以调用父类的静态方法  
+ `Symbol.species Getter`构造器:  
  - `static`用处之一, 为派生子类设定`Symbol.species getter`  
  - 当父类方法需要构造新实例, 但不想用子类构造器, 该功能使`子类通知父类应该使用哪个构造器`  
  - 语法: `static get [Symbol.species]() { return ... }`, 指定`new`构造时用哪个构造器  
```JavaScript
// Symbol.species Getter
class MySelfArray extends Array {
    static get [Symbol.species]() {
        return Array;
    }
}
let myArray = new MySelfArray(1, 2, 3);
myArray = myArray.map(v => v2);
console.log(myArray instanceof MySelfArray); // false
console.log(myArray instanceof Array); // true

// Symbol.species Getter 2
class Father {
    static get [Symbol.species]() {
        return this;
    }
    createInstance() {
        return new this.constructor[Symbol.species]();
    }
}
class Son extends Father {
    static get [Symbol.species]() {
        return Father;
    }
}
const v1 = new Father();
const v2 = v1.createInstance();
console.log(v2 instanceof Father); // true
const v3 = new Son();
const v4 = v3.createInstance();
console.log(v4 instanceof Son); // false
```

****
**[返回主目录](../readme.md)**