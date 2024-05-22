+ [总目录](../readme.md)
***
- [函数](#函数)
- [作用域和垃圾回收](#作用域和垃圾回收)
***
#### 函数
+ 全局定义的函数会在程序执行前提升: 这意味着函数可以先调用再定义
  ```JavaScript
  const result = add(10, 12); // 22
  function add(num1, num2) {
    return num1 + num2;
  }

  // 不要这么干
  if (window.DEBUG) {
    function add(num1, num2) {
      console.log('DEBUG...');
      return num1 + num2;
    }
  } else {
    function add(num1, num2) {
      return num1 + num2;
    }
  }
  ```
+ `var`定义的函数表达式只提升定义, 不提升赋值, 因此无法先调用再定义
  ```JavaScript
  const result = add(10, 12); // TypeError
  var add = function(num1, num2) {
    return num1 + num2;
  }
  ```
+ `let`/`const`定义的函数表达式没有提升, 也无法先调用再定义
+ JavaScript的函数没有`重载`, 后定义的函数会覆盖先定义的函数
+ 普通函数的一些特性:
  - 普通函数也是对象, 可以拥有属性和方法
  - 普通函数拥有`name`属性, 表示函数名, 以及`length`属性, 表示形参个数
  - 普通函数具有`prototype`属性, 定义了函数的原型对象
  - 普通函数内部可以通过`arguments`对象访问调用时实际传入的参数
  - `arguments`是类数组对象, 不是真正的数组, 无法调用数组的原型方法
  - 非严格模式下, `arguments`参数数组和传入的参数是双向绑定的
  - 严格模式下, `arguments`参数数组和传入的参数不会双向绑定
  ```JavaScript
  function add(num1, num2) {
    num1 = 1;
    num2 = 2;
    arguments[1] = 10;
    console.log(num2);
    return Array.prototype.reduce.call(arguments, (a, b) => a + b);
  }
  console.log(add.name); // add
  console.log(add.length); // 2
  console.log(add(10, 11)); // 先打印出10, 再打印出11

  function add(num1, num2) {
    "use strict"
    num1 = 1;
    num2 = 2;
    return Array.prototype.reduce.call(arguments, (a, b) => a + b);
  }
  console.log(add(10, 11)); // 21
  ```
  - 默认参数会按照顺序依次初始化, 因此后面的参数可以使用前面的参数值
  ```JavaScript
  function add(num1 = 10, num2 = num1) {
    return num1 + num2;
  }
  console.log(add()); // 20
  ```
  - `arguments`对象有一个`callee`属性, 指向`arguments`对象所在的函数
  - 普通函数有一个`caller`属性, 指向调用该函数的函数
  ```JavaScript
  // 阶乘
  function factorial(num) {
    if (num <= 1) {
      return 1;
    }
    return num * arguments.callee(num - 1);
  }

  function outer() {
    function inner() {
      console.log(inner.caller);
    }
    inner();
  }
  outer(); // outer
  ```
+ 箭头函数的一些特性:
  - 箭头函数没有`prototype`属性, 函数内部也不能访问`arguments`对象
  - 箭头函数没有自己的`this`, 因此不能作为构造函数使用, 不能被实例化
  - 箭头函数也不能使用`super`以及`new.target`
+ `...`运算符
  - 在函数定义中, 表示收集参数, 将所有传入的参数推入数组中
  - 在函数调用中, 表示展开参数, 将数组的元素展开为独立的参数
  - 函数定义中, 收集参数必须在最后一个, 因为其个数不明确
  ```JavaScript
  function add(...args) {
    return args.reduce((a, b) => a + b);
  }
  console.log(add(1, 2, 3, 4, 5)); // 15

  function add(num1, num2, num3) {
    return num1 + num2 + num3;
  }
  console.log(add(...[1, 2, 3])); // 6

  function add(num1, ...args) {
    return num1 + args.reduce((a, b) => a + b);
  }
  console.log(add(1, 2, 3, 4, 5)); // 15
  ```
+ 函数的方法
  - `call`: 第一个参数是`this`对象, 第二个参数需要逐个传递
  - `apply`: 第一个参数是`this`对象, 第二个参数需要传入参数数组
  - `bind`: 返回一个绑定了新的`this`上下文的新函数
  ```JavaScript
  function add() {
    const { num1, num2 } = this;
    const result = Array.prototype.reduce.call(arguments, (a, b) => a + b);
    console.log(num1 + num2 + result);
  }
  const obj = { num1: 10, num2: 10 };
  add.call(obj, 1, 2, 3); // 26
  add.apply(obj, [1, 2, 3]); // 26
  (add.bind(obj, 1, 2, 3))(); // 26
  ```
  - `bind`部分传参: 柯里化
  ```JavaScript
  function add() {
    const { num1, num2 } = this;
    const result = Array.prototype.reduce.call(arguments, (a, b) => a + b);
    console.log(num1 + num2 + result);
  }
  const obj = { num1: 10, num2: 10 };
  const newAdd = add.bind(obj, 1, 2);
  newAdd(3); // 26
  ```
+ 函数中的`this`, 有以下的绑定规则:
  - 默认绑定: 直接调用函数, `this`指向`window`, 严格模式下undefined
  - 隐式绑定: 对象方法, 即`obj.method()`, `this`指向`obj`
  - 显示绑定: 通过`call`/`apply`/`bind`定义函数内部`this`的指向
  - `new`绑定: `new`调用构造函数, 函数内部的`this`指向创建的对象
  - 优先级: `new` > 显示 > 隐式 > 默认
  - 以上的几点规则, 都只针对普通函数, 而非箭头函数
  ```JavaScript
  function logThis() { console.log(this); }
  logThis(); // window 严格模式下为undefined

  const obj = {
    index: 1,
    getIndex() {
      console.log(this.index);
    }
  }
  obj.getIndex(); // 1

  function getIndex() {
    console.log(this.index);
  }
  getIndex.call({ index: 1 }); // 1
  ```
  - 箭头函数没有自己的`this`, 内部的`this`从定义处继承而来
  - 箭头函数的判断方法: 将`this`代码从箭头函数内部移到箭头函数外部
  ```JavaScript
  function Button() {
    this.clicked = false;
    this.click = () => {
      this.clicked = !this.clicked;
    }
  }
  const btn = new Button();
  btn.click();

  // 移动
  function Button() {
    this.clicked = false;
    this.click = () => {
      
    }
    // 移动到外部
    this.clicked = !this.clicked; // this指向Button实例
  }
  ```
+ 其他情况下的`this`
  - 原型追加方法, `this`依然指向实际的调用
  - 隐式调用不关心方法来自自身还是原型链, 只关心`作为方法被调用`
  ```JavaScript
  Object.prototype.returnThis = function() {
    return this;
  }
  ([1, 2, 3]).getThis(); // [1, 2, 3]
  ```
  - DOM中的事件, `this`指向绑定事件的元素(非箭头函数)
+ `this`丢失的情况
  - 对象/类方法被复制给其他变量, 或作为回调参数传入
  - 嵌套的普通函数
  ```JavaScript
  const obj = {
    index: 1,
    getIndex() {
      console.log(this.index);
    }
  }
  const f = obj.getIndex;
  f(); // this丢失, 指向window或undefined
  // 修正: const f = obj.getIndex.bind(obj);

  function cb(callback) {
    callback();
  }
  cb(obj.getIndex); // this丢失, 指向window或undefined
  // 修正: cb(obj.getIndex.bind(obj));

  const obj = {
    index: 1,
    getIndex() {
      setTimeout(function() {
        console.log(this.index); // this丢失, 指向window或undefined
      }, 0)
    }
  }

  // 修正1
  const obj = {
    index: 1,
    getIndex() {
      setTimeout(() => {
        console.log(this.index);
      }, 0)
    }
  }

  // 修正2
  const obj = {
    index: 1,
    getIndex() {
      let that = this;
      setTimeout(function() {
        console.log(that.index);
      }, 0)
    }
  }
  ```
+ **重点**: 箭头函数无论何种方式被调用, 其继承的`this`都不变
  ```JavaScript
  const person = {
    index: 1,
    getIndex() {
      const getThis = () => {
        console.log(this.index);
      }
      return getThis;
    }
  };
  const getThis = person.getIndex(); // getThis是箭头函数的引
  const runCallback = cb => cb();
  runCallback(getThis); // 1
  setTimeout(getThis, 0); // 1
  ```
***
**为什么**? 箭头函数没有自己的`this`, 只能从定义处的上下文继承而来, 而继承的方式, 类似于`let that = this`, 将定义处的`this`固化为一个固定值, 固定值再怎么传来传去, 都不会变化
```JavaScript
const person = {
    index: 1,
    getIndex() {
      let that = this;
      const getThis = () => {
        console.log(that.index);
      }
      return getThis;
    }
  };
``` 
***
+ 闭包的概念: 
  - 闭包指的是: 函数和其所有能够访问到的变量构成的封闭集合, 只要函数在, 可访问的变量就一直在
  - 闭包会将函数的可访问的变量锁定住, 函数生命周期不结束, 闭包内的变量也不会被垃圾回收
  - 闭包在JavaScript中的应用主要是 嵌套函数/回调函数
  - 闭包会导致性能问题, 应该谨慎使用
  ```JavaScript
  const name = 'zhangsan';
  function logName() {
    if (name === 'zhangsan') {
      console.log('found!');
    } else {
      console.log('not found!');
    }
  } 
  // 闭包: (logName, name), 只要logName函数在, name变量也就会一直在
  // 用完logName之后, 记得加上logName = null

  function createPrivateValue() {
    let _privateValue = 'private';
    return {
      getPrivateValue() {
        return _privateValue;
      },
      setPrivateValue(value) {
        _privateValue = value;
      }
    }
  }
  const private = createPrivateValue();
  private.setPrivateValue(10);
  console.log(private.getPrivateValue());  // 10
  // 嵌套函数的闭包, 加上一句 private = null; 即可清除闭包, 并触发垃圾回收

  class Person {
    constructor(name, age) {
      this.name = name;
      this.age = age;
    }
    sayName() {
      console.log(this.name);
    }
  }
  const person = new Person('zhangsan', 18);
  function excuteCallback(callback) {
    callback();
  }
  excuteCallback(person.sayName.bind(person));
  // 闭包锁住了整个person! 用完之后, 加上excuteCallback = null, 即可清除闭包
  ```
+ 尾调用优化: 复用栈帧
  - 尾调用的条件: 外部函数的返回值同时也是内部函数的返回值
  - 如果内部函数的返回值还需要额外的处理, 才能得到外部函数的返回值, 就不满足尾调用
  - 对于满足尾调用的情况, 引擎会直接复用当前调用栈, 不需要再新增调用栈
  ```JavaScript
  // 引擎会直接将outer执行上下文踢出栈, 替换为inner的执行上下文
  function outer() {
    return inner(); // 尾调用
  }

  // 引擎不能将outer踢出栈, 只能将inner入栈, 因为inner完毕后还要处理
  function outer() {
    return inner() + 1; // 不满足尾调用
  }
  ```

#### 作用域和垃圾回收
+ 执行上下文: 即JavaScript引擎给即将要执行的代码创建的一个环境
+ JavaScript只有两种执行上下文: 全局执行上下文和函数执行上下文
  - 全局执行上下文: 有且仅有一个, 当JavaScript程序开始执行时就已经创建, 程序完全退出才会销毁
  - 函数执行上下文: 在调用函数时才会创建, 定义函数是不会创建的
+ 执行上下文的过程解析:
  - JavaScript首先会创建一个唯一的全局执行上下文
  - 当遇到函数调用, 引擎创建函数执行上下文, 等待执行完毕后再销毁, 重新回到全局执行上下文
  ```mermaid
  graph BT
  A[全局执行上下文] -->|调用A函数, 创建A函数执行上下文| B[A函数执行上下文] -->|A函数执行完毕, 销毁A函数执行上下文| A[全局执行上下文]
  ```
  - 当遇到函数A调用, 引擎创建A函数执行上下文, 执行过程中需要调用函数B, 引擎停止A执行上下文, 再创建B函数执行上下文
  - 等待B函数执行完毕, 销毁B函数执行上下文, 重新回到A函数执行上下文, 并继续执行, 完毕后销毁A函数执行上下文
  - 再次回到全局执行上下文
  - 更复杂的函数调用情况也是如上分析, JavaScript引擎使用执行上下文栈, 来管理和跟踪执行上下文, 也被称为`调用栈`
  - 图解
  ```mermaid
  graph BT
  A[全局执行上下文] -->|调用A函数, 创建A执行上下文| B[A函数执行上下文] --> |调用B, 创建B执行上下文, A执行上下文暂停| C[B函数执行上下文] -->|B执行完毕, 销毁B执行上下文, A执行上下文回复执行| B[A函数执行上下文] -->|A执行完毕, 销毁A执行上下文| A[全局执行上下文]
  ```
+ 每个执行上下文都有一个与之关联的变量对象, 该上下文中定义的变量和函数都会保存其中, 该变量对象无法通过代码访问
+ 作用域: 就是指执行上下文所关联的变量对象, JavaScript有两种作用域: 全局作用域, 和函数作用域
+ 作用域链: 首先在当前执行上下文的作用域中查找, 没有找到, 就在上一级执行上下文中查找, 直到全局执行上下文
+ 当前执行上下文, 即栈顶上下文的作用域一定是在作用域链的最前端
+ 作用域链增强: 某些语句会在作用域链的前端添加临时上下文, 里面的代码执行完毕后会删除: with/catch/单独的块语句...
  ```JavaScript
  const person = {
    name: "zhangsan",
    age: 18,
  };
  function method() {
    try {
      with (person) {
        name = "lisi";
        age = 20;
      }
    } catch (err) {
      console.log(err);
    }

    {
      const name = "zhangsan";
      console.log(name);
    }

    console.log(person);
    console.log("done");
  }

  method();
  ```
+ JavaScript使用词法作用域
  - 编写代码时, 变量和函数的定义位置就决定了其作用域
  - 词法分析器直接根据源代码分析作用域链
  - 与之相对应的是动态作用域, 基本上没什么语言在用了(Bash, Perl)
+ 垃圾回收: 标记清理和引用计数
  - 标记清理: 变量进入上下文时标记为`在上下文中`, 离开上下文时标记`离开`, 垃圾回收根据标记销毁变量
  - 引用计数: 对每个变量, 记录其引用次数, 引用次数降到0, 则被垃圾回收 (这意味着循环引用永远无法被释放)
  - JavaScript使用的是标记清理
  - 开发者无法手动触发垃圾回收, 但可以间接控制触发垃圾回收的条件
+ 性能:
  - 使用`let`/`const`定义变量, 避免定义大量的全局变量, 块级变量在代码执行结束后会更早的触发垃圾回收
  - 隐藏类和删除操作: 避免先创建再补充的行为, 不需要使用的变量属性, 设置为`null`比使用`delete`更好
  - 避免内存泄漏: 比如不使用定义词定义变量, 会泄漏为全局变量; 使用的定时器要及时销毁等
  - 静态分配和对象池: 避免频繁的创建新对象, 避免频繁的更改对象内容
