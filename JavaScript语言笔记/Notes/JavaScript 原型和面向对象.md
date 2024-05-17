+ [总目录](../readme.md)
***
+ 使用`new`调用构造函数创建对象的过程
  - 会首先创建一个新对象
  - 新对象的`[[prototype]]`内部属性被赋值为构造函数的原型
***
**小知识**: 内部属性
+ 内部属性就是一个属性, 有对应的属性值
+ 内部属性不对外开放, 是引擎再后台处理相关操作时会用到的属性
+ 一切针对普通属性的读取, 赋值, 修改, 编辑方法, 对内部属性统统无效
+ 总结: 除非官方提供了操作内部属性的API, 否则读不到, 看不到, 操作不到
+ 另外一个内部属性: `[[class]]`, 用于`Object.prototype.toString`方法的显示
```JavaScript
const arr = [1, 2, 3];
const pattern = /^(WX|00|30|50|80|60)\d+$/;
const obj = { name: 'zhangsan' };
const add = (a, b) => a + b;
const date = new Date();

console.log(Object.prototype.toString.call(arr)); // [object Array]
console.log(Object.prototype.toString.call(pattern)); // [object RegExp]
console.log(Object.prototype.toString.call(obj)); // [object Object]
console.log(Object.prototype.toString.call(add)); // [object Function]
console.log(Object.prototype.toString.call(date)); // [object Date]
```
***
  - 执行构造函数中的代码, 其`this`被赋值为新创建的对象
  - 构造函数中显示返回的非空对象将覆盖创建的对象, 其他的返回值将被忽略
  - 构造函数如果没有参数, `new`调用时可以不加括号(不推荐)
  - 不加`new`调用构造函数, 和普通函数没区别
  ```JavaScript
  // new调用的内部过程示例
  function Person(name, age) {
    this.name = name;
    this.age = age;
  }
  const person = new Person('zhangsan', 18);
  // ============= 过程解析 ===============
  {
    const emptyObject = {};
    Object.setPropertyOf(emptyObject, Person.prototype);
    Person.call(emptyObject, ...args);
    return emptyObject;
  }
  // =====================================


  // 显示返回非空对象
  function Person(name, age) {
    this.name = name;
    this.age = age;
    return { index: 1 };
  }
  console.log(new Person('zhangsan', 18)); // { index: 1 }
  ```
+ 构造函数中赋值给`this`的引用值, 在不同的实例上并不等价
  ```JavaScript
  function Person() {
    this.method = function() {
      console.log(111)
    };
    this.key = [1, 2, 3];
  }
  const person1 = new Person();
  const person2 = new Person();
  console.log(person1.method === person2.method); // false
  console.log(person1.key === person2.key); // false
  ```
+ 原型`prototype`
  - 创建函数时, 函数自动获得`prototype`属性
  - 函数的`prototype`属性指向一个对象, 该对象被称为原型对象
  - 原型对象至少具有一个属性`constructor`, 指向函数
    ```JavaScript
    function circleArea(radius) {
      return Math.PI * radius * radius;
    }
    console.log(circleArea.prototype.constructor === circleArea);
    // true
    ```
  - 上述三点的关系图如下
  ```mermaid
  graph TD
  A[函数] -->|通过.prototype属性| C[原型对象]
  C[原型对象] -->|通过.constructor属性| A[函数]
  C[原型对象]-->|包含其他| D[原型属性和方法]
  ```
  - 原型对象上的属性和方法, 可以被`new`调用该函数创建的对象所共享
  - 函数才有`prototype`属性, 普通对象只有一个`[[prototype]]`内部属性(后文称之为原型指针)
***
**小知识**: 任何对象都有`[[prototype]]`内部属性, 即使是对象字面量形式创建的对象
```JavaScript
const arr = [1, 2, 3];
const obj = { name: 'zhangsan' };
console.log(Object.getPrototypeOf(arr) === Array.prototype);
console.log(Object.getPrototypeOf(obj) === Object.prototype);
```
***
  - 普通对象的原型指针, 指向构造函数的原型对象, 以此来引用原型属性和方法
  - 上述三点的关系如下
  ```mermaid
  graph TD
  A[构造函数] -->|通过new调用, 得到| B[实例对象]
  A[构造函数] -->|通过.prototype属性| C[原型对象]
  B[实例对象] -->|通过原型指针, 指向| C[原型对象]
  C[原型对象]-->|通过.constructor| A[构造函数]
  C[原型对象]-->|包含其他| D[原型属性和方法]
  ```
  - 对象调用自身没有的属性和方法时, 会在原型指针指向的原型对象上查找, 没有就继续往上查找, 直到`null`
  - `原型链`就是通过原型指针, 将多个对象链接起来 
  - 原型链就近原则: 对象查找属性和方法, 是从自身开始, 直至找到或者`null`
  ```mermaid
  graph TD
  A[调用方法 / 获取属性] -->|没找到, 通过原型指针| B[原型对象1]
  B[原型对象1] -->|没找到, 通过原型指针| C[原型对象2]
  C[原型对象2] -->|没找到, 通过原型指针| D[原型对象3]
  D[原型对象3] -->|...| E[null]
  C[原型对象2] -->|找到了, 返回属性值或执行方法| A[调用方法 / 获取属性]
  E[null] -->|还是没找到| F[undefined或者抛出错误]
  ```
+ 对象的原型指针不能直接获取, 可以通过`Object.getPrototypeOf`方法获取 (不要使用`__proto__`这种非规范的方式!)
+ 对象的原型指针不能直接修改, 可以通过`Object.setPrototypeOf`方法修改
+ `A instanceof B`: 实例判断, 在`A`的原型链上是否存在`B`的原型
  - `A`必须是对象, 不能是其他, 否则返回`false`
  - `B`必须是构造函数(类), 不能是其他, 否则会报错
  ```JavaScript
  /**
   * instanceof近似实现
   * @param {Object} source
   * @param {Function} target 
   * @returns 
   */
  function instanceof(source, target) {
    if (!isObject(source) || !isConstructor(target)) {
      return false;
    }
    let prototype = Object.getPrototypeOf(source);
    while (prototype !== null) {
      if (prototype === target.prototype) {
        return true;
      }
      prototype = Object.getPrototypeOf(prototype);
    }
    return false
  }
  ```
+ 不要对构造函数的原型对象重新赋值! 会影响`instanceof`的判断
  ```JavaScript
  function Person() {
    this.name = 'zhangsan';
  }
  Person.prototype = {};
  const person = new Person();
  console.log(person instanceof Person); // false
  console.log(person instanceof Object); // true
  ```
+ 原型是动态的, 但是: 旧实例引用旧原型, 新实例引用新原型
  - 示例
  ```JavaScript
  function Person() {}
  Person.prototype.sayName = function() {
    console.log('name');
  }
  const person1 = new Person();

  Person.prototype = {
    constructor: Person,
    sayAge() {
      console.log('age');
    }
  }
  const person2 = new Person();

  Person.prototype.sayHello = function() {
    console.log('Hello');
  }

  person1.sayName(); // name
  person1.sayAge(); // Error!
  person1.sayHello(); // Error!

  person2.sayName(); // Error!
  person2.sayAge(); // age
  person2.sayHello(); // hello
  ```
  - 图解
  ```mermaid
  graph TD
  A[Person] -->|通过.prototype| B[原型对象1]
  B[原型对象1] -->|添加sayName方法| C[sayName]
  A[Person] -->|new实例化, 得到| D[person1]
  D[person1] -->|通过原型指针| B[原型对象1]

  A[Person] -->|将.prototype改写为| E[原型对象2]
  E[原型对象2] -->|添加sayAge方法| F[sayAge, sayHello]
  E[原型对象2] -->|添加sayHello方法| F[sayAge, sayHello]
  A[Person] -->|new实例化, 得到| G[person2]
  G[person2] -->|通过原型指针| E[原型对象2]
  ```
+ `class`类
  - `constructor`中的属性定义在实例中
  - 类体中的属性也定义在实例中
  - 类体中的方法定义在原型上
  - `static`静态方法直接定义在函数对象上
  ```TypeScript
  class Person {
    
    secret = 'I love XXX';

    constructor(name, age) {
      this.name = name;
      this.age = age;
    }

    sayName() {
      console.log(this.name);
    }
  }

  const person = new Person('zhangsan', 18);

  console.log(person.hasOwnProperty('name')); // true
  console.log(person.hasOwnProperty('age')); // true
  console.log(person.hasOwnProperty('secret')); // true
  console.log(person.hasOwnProperty('sayName')); // false
  console.log('sayName' in person); // true
  ```
+ 在构造函数中可以调用`new`关键字, `new`有一个`target`属性, 指向构造函数
  ```JavaScript
  class Person {
    constructor() {
      console.log(new.target);
    }
  }
  new Person(); // Person

  // 一个抽象类示范
  class AbstractClass {
    constructor() {
      if (new.target === AbstractClass) {
        throw new Error('抽象类不允许被实例化');
      }
    }
  }
  new AbstractClass(); // Error: 抽象类不允许被实例化
  ```
+ `class`类的缺陷: 意外屏蔽
  ```JavaScript
  class C {
    constructor(id) {
      this.id = id;
    }

    id() {
      console.log(this.id);
    }
  }
  new C().id(); // TypeError
  ```
+ `class`类不会提升, 必须在定义之后使用
+ `class`类的继承
  - 使用`extends`关键字, 如果父类构造函数需要传参, 需要在子类构造函数中先调用父类构造函数, 使用`super`
    ```JavaScript
    class Super {
      constructor(name, age) {
        this.name = name;
        this.age = age;
      }
    }

    class Sub extends Super {
      constructor(name, age, secret) {
        super(name, age);
        this.secret = secret;
      }
    }
    ```
  - `extends`其实是在子类和父类的原型对象上, 通过原型指针建立关联
  - `super`的一致性: `super`用于在子类中调用父类方法, 可以是构造方法, 普通方法, 以及静态方法
    ```JavaScript
    class Super {
      constructor(name) {
        this.name = name;
      }

      sayName() {
        console.log(this.name);
      }

      static sayHello() {
        console.log('Hello');
      }
    }

    class Sub extends Super {
      constructor(name, age) {
        super(name);
        this.age = age;
      }

      sayName() {
        super.sayName();
      }

      static sayHello() {
        super.sayHello();
      }
    }

    new Sub().sayName();
    Sub.sayHello();
    ```
  - 补充知识: `super`也可以用在普通对象中, 但只能出现在简洁方法中
    ```JavaScript
    const A = {
      // 写成sayName: function() { 是无效的
      sayName() {
        super.sayName();
      }
    };
    const B = {
      sayName() {
        console.log('name');
      }
    };
    Object.setPrototypeOf(A, B);
    A.sayName(); // name
    ```
  - 如果在子类中显示定义了`constructor`, 则必须在里面调用`super`, 或者返回一个新对象(没有意义, 不推荐)
  - 子类的`constructor`中, 不能在调用`super`之前使用`this`, 原因解释放在ES5继承内容讲述之后
+ 补充知识: ES5的类继承
  - 原型链继承: 子类原型赋值为父类的实例
    ```JavaScript
    function Super(name, age) {
      this.name = name;
      this.age = age;
      this.habbits = ['reading'. 'singing'];
    }
    function Sub() {}
    Sub.prototype = new Super();
    const sub = new Sub();

    // 缺点1: 父类的实例属性会被子类实例共享, 尤其是引用值
    // 缺点2: 父类构造函数传参有缺陷 
    ```
  - 盗用父类构造函数: 在子类中调用父类构造函数
    ```JavaScript
    function Super(name, age) {
      this.name = name;
      this.age = age;
    }
    function Sub(name, age, sex) {
      Super.call(this, name, age);
      this.sex = sex;
    }
    const sub = new Sub('zhangsan', 18, 'male');

    // 缺点: 子类无法访问父类原型链上的属性和方法 
    ```
  - 组合继承: 原型链继承和盗用父类构造函数相结合
    ```JavaScript
    function Super(name, age) {
      this.name = name;
      this.age = age;
    }
    function Sub(name, age, sex) {
      Super.call(this, name, age);
      this.sex = sex;
    }
    Sub.prototype = new Super('', 0);
    const sub = new Sub('zhangsan', 18, 'male');

    // 缺点1: 父类构造函数会调用两次, 影响性能
    // 缺点2: 父类的实例属性会同时定义在子类的原型和实例上, 只是实例上的屏蔽掉了原型上的
    ```
  - 原型式继承: 根据给定的对象创建新对象, 新对象的原型指针指向给定的对象
    ```JavaScript
    function createObject(target) {
      const F = function() {};
      F.prototype = target;
      return new F();
    }

    // 缺点: 这不是理解中的继承方式, 没有类, 实例这种概念

    // JavaScript将这种设计标准化了, 即Object.create()方法
    ```
  - 寄生式继承: 在子类中创建和扩展父类
    ```JavaScript
    function Super() { }
    Father.prototype.method = function () { };

    function Sub() {
      const super = new Super();
      // 扩展方法
      super.moreMethod = function () { };
      return super;
    }
    const sub = new Sub();

    // 子类运行的结果是父类的实例, 根本没有子类!
    ```
  - 寄生式组合继承: 原型采用原型式继承, 在子类中调用父类构造函数
    ```JavaScript
    // 寄生式组合继承的设计思路就是ES6 class的标准实现, 但内部实现有差异
    function Super(name, age) {
      this.name = name;
      this.age = age;
    }
    Super.prototype.sayName = function() {
      console.log(this.name);
    }

    function Sub(name, age, sex) {
      Super.call(this, name, age);
      this.sex = sex;
    }
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.prototype.sayAge = function() {
      console.log(this.age);
    }

    const sub = new Sub('zhangsan', 18, 'male');
    ```
  - ES6`class`继承, 在子类构造函数中, 不能在`super`之前访问`this`
    ```JavaScript
    class Sub extends Super {
      constructor() {
        console.log(this); // 报错
      }
    }

    /**
     * class类继承中, 首先实例化的是父类
     * 首先调用父类构造函数, 实例化完毕, 才会开始实例化子类
     * 没有实例化父类前, 子类还啥也不是
     */
    ```
