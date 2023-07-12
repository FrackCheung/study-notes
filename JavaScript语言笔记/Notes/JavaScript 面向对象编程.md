# JavaScript中 面向对象编程

**[返回主目录](../readme.md)**

#### JavaScript的类继承方式
+ 原型链继承: 
  - 用法: `Son.prototype = new Father();`
  - 不足: 引用值共享; 无法向父类构造函数传值
+ 盗用父类构造函数: 
  - 用法: `function Son() { Father.call(this); }`
  - 不足: 无法访问父类原型链
+ 组合继承: 
  - 上面两种方式的结合
  - 不足: 父类构造函数调用两次, 性能浪费
+ 原型式继承: `const son = Object.create(father);`
+ 寄生式组合继承:
  - 原型采用原型式继承
  - 在子类中调用父类构造函数
+ 寄生继承: 见下面详细代码
```JavaScript
// 寄生式组合继承
function FatherClass(arg1, arg2) {
    this.arg1 = arg1;
    this.arg2 = arg2;
}
FatherClass.prototype.method = function () { };

function SonClass(arg1, arg2, arg3) {
    FatherClass.call(this, arg1, arg2);
    this.arg3 = arg3;
}
SonClass.prototype = Object.create(FatherClass.prototype);

// 原型对象中的constructor属性指向构造函数
// 因此这里需要重新改写为SonClass
SonClass.prototype.constructor = SonClass;
SonClass.prototype.moreMethod = function () { };

// 寄生继承
function Father() { }
Father.prototype.method = function () { };

function Son() {
    const father = new Father();
    // 扩展方法
    father.moreMethod = function () { };
    return father
}
const son = new Son();
```

#### super
+ 用于在子类中引用父类方法:
+ 在子类构造函数中, `super`代指父类构造函数
+ 在子类普通方法中, `super`通过点语法可引用父类普通方法
+ 在子类静态方法中, `super`通过点语法可引用父类静态方法
```JavaScript
// new操作符调用构造函数, 若函数中有显示的return且返回对象, 则以该对象为准
// 若返回值是基础类型, 则会被丢弃, 返回新创建的对象
function CreartObject1() {
    this.key = 'value';
    return {}
}
function CreartObject2() {
    this.key = 'value';
    return 10;
}
console.log(new CreartObject1()); // {}
console.log(new CreartObject2()); // { key: 'value' }

// 利用constructor属性判断是否由构造函数创建, 该方法是不可信的
// 改写整个原型链会导致constructor属性信息错误
function Construct() { }
Construct.prototype = {};
const obj = new Construct();
console.log(obj.constructor === Construct); // false
console.log(obj.constructor === Object); // true
```

#### ES6 class的缺陷
+ JavaScript没有类`复制`行为, 只有`对象关联`, 修改父类原型会影响子类
+ class中面临`意外屏蔽`的问题, 见下方示例代码
```JavaScript
// ES6 class中的意外屏蔽
class C {
    constructor(id) {
        this.id = id;
    }
    id() {
        console.log(this.id);
    }
}
const c = new C();
C.id(); // TypeError! 自身id属性屏蔽了原型上的id方法
```
+ class类体中的方法定义在`原型`上, 类体中的属性会定义在`实例`上
```JavaScript
class Person {
    name = 'zhangzhen';
    getName() {
        return this.name;
    }
}
const p = new Person();
    
console.log(p.hasOwnProperty('name')); // true
console.log(p.hasOwnProperty('getName')); // false
console.log(Person.prototype.hasOwnProperty('getName')); // true
```
#### 原型可以被替换，但实例依然引用旧原型
+ 对象和函数原型的引用关系, 在`创建对象时`就已经建立
+ 旧对象引用旧的函数原型, 新对象引用新的函数原型
```JavaScript
function Person() { }

// 创建Person的实例, 此时person的[[prototype]]指针指向Person.prototype
const person1 = new Person();

// 给Person原型追加一个greeting方法, person实例会通过原型链索引到该方法
Person.prototype.greeting = function() {
    console.log(`Hello`);
}

// 完全改写Person原型链, 用新对象覆盖, 不再拥有greeting方法
Person.prototype = {
    getAge() {
        console.log(18);
    }
}

// 改写后创建新的实例对象, 此时person2的[[prototype]]指针将指向新的Person.prototype
const person2 = new Person();

// 此时继续对Person的原型进行追加方法, 这只会影响person2, person1将不受影响
Person.prototype.getName = function() {
    console.log('MJ');
}

person1.greeting(); // 'Hello'
person2.greeting(); // TypeError: person2.greeting is not a function

person1.getAge(); // TypeError: person1.getAge is not a function
person2.getAge(); // 18

person1.getName(); // TypeError: person1.getName is not a function
person2.getName(); // MJ
```
***
**上述代码过程解析:**
+ 第一步: 创建`person1`实例, 其`[[prototype]]`指针指向`Person.prototype`(称之为`原型对象1`)
+ 第二步: 在`原型对象1`上追加`greeting`方法, `person1`实例自然可以通过原型链索引到该方法
+ 第三步: 完全改写替换Person的原型对象值(称之为`原型对象2`), 原型对象2上拥有`getAge`方法
+ 第四步: 创建`person2`实例, 其`[[prototype]]`指针指向`原型对象2`, 可以访问`getAge`方法
+ **重点**:
    1. Person原型从原型对象1改写为原型对象2后, 原型对象1并没有消失, 依然存在, 这是理解的重点
    2. 对象和原型的引用关系在对象创建时建立, 因此`person`1的`[[prototype]]`将始终指向`原型对象1`
    3. 因此`person1`始终可以访问原型对象1上的方法, 但无法访问原型对象2上的方法, `person2`同理
+ Person原型再次改写或追加, 都只会影响`person2`或后续新创建的对象, `person1`永远只能访问到`greeting`方法
***

#### new创建的对象, 都有一个`constructor`属性, 指向构造函数或类

```JavaScript
function Person() { }
const p = new Person();
console.log(p.constructor); // Person() {  }

// 也可以这样创建新实例, 但p !== p2
const p2 = new p.constructor();
```
****
**[返回主目录](../readme.md)**