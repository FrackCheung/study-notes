<!-- TOC -->

- [script标签](#script标签)
- [严格模式](#严格模式)
- [定义变量](#定义变量)
- [数据类型](#数据类型)
- [Symbol数据类型](#symbol数据类型)
- [引用数据类型Object](#引用数据类型object)
- [其他数据类型的补充](#其他数据类型的补充)
- [强制类型转换](#强制类型转换)
- [语法和值类型](#语法和值类型)
- [面向对象](#面向对象)
- [代理和反射](#代理和反射)
- [作用域和垃圾回收](#作用域和垃圾回收)
- [函数](#函数)
- [迭代器和生成器](#迭代器和生成器)
- [Promise](#promise)

<!-- /TOC -->
#### script标签
+ `async`: 异步加载脚本, 阻止页面其他行为, 只适用外部脚本
+ `defer`: 文档被完全解析和显示后再执行, 只适用于外部脚本
+ `type`: 值为`module`时, 脚本中才允许出现ES6模块
+ `<script></script>`中包裹的JavaScript代码不允许出现`</script>`字符串, 须使用转义, `<\/script>`
+ `<noscript>`: 针对不支持或关闭JavaScript的浏览器的解决方案
+ `DOMContentLoaded`: 即使是`defer`修饰的脚本, 也会在`DOMContentLoaded`事件前执行
+ 外部/内联代码共享`global/window`对象, 共享命名空间, 可以进行交互
+ 变量提升, 在`边界`中不适用: 即在第一个`<script>`中调用第二个`<script>`中定义的方法

#### 严格模式
+ 在脚本顶部或者函数顶部使用`'use strict'`启用严格模式
+ 严格模式下不允许先使用, 再定义
  ```JavaScript
  'use strict'
  name = 'zhangzhen';
  var name;
  ```
+ 严格模式下直接调用的函数中的`this`指向undefined
+ 严格模式下, 函数内部的`arguments`和传参不再强绑定

#### 定义变量
+ `var`只有两种作用域: 函数作用域和全局作用域
+ `var`定义的变量会提升到`作用域的顶部, 只提升声明, 不提升赋值
  ```JavaScript
  console.log(name); // undefined
  var name = 'zhangzhen';
  ```
+ `var`可以反复重复定义相同名称的变量
  ```JavaScript
  var name = 'zhangsan';
  var name = 'lisi';
  var name = 'wangwu';
  ```
+ `var`定义的全局变量会成为`global`对象的属性(`let/const`则不会)
  ```JavaScript
  var name = 'zhangzhen';
  console.log(window.name); // zhangzhen
  ```
+ `var`定义的for循环变量只有一个, 且会提升到顶部, 导致多个循环迭代共享
  ```JavaScript
  for (var index = 0; index < 5; index++) {
    setTimeout(() => {
      console.log(index);
    }, 0);
  }
  // 5 5 5 5 5
  ```
+ `let/const`会为for循环的每一次迭代单独分配变量
+ `let/const`遵循块级作用域, 且不允许重复声明
  ```JavaScript
  {
    let name = 'zhangzhen';
  }
  console.log(name); // RefrenceError
  ```
+ `let/const`声明的全局变量不会成为`global`的属性
  ```JavaScript
  let name = 'zhangzhen';
  console.log(window.name); // undefined
  ```
+ `const`定义的变量不允许重新赋值, 但可以修改定义对象的内部属性
+ 非严格模式下, 未使用`定义词`定义的变量会自动成为全局变量
  ```JavaScript
  function test() {
    name = 'zhangzhen';
  }
  test();
  console.log(name); // zhangzhen
  ```

#### 数据类型
+ 内置数据类型: `null`/`undefined`/`boolean`/`string`/`number`/`object`/`symbol`
+ 除`object`以外, 其余6种数据类型, 被称为`基本类型`
+ `typeof`返回值: `string`/`number`/`boolean`/`symbol`/`undefined`/`object`/`function`
+ `typeof`判断对象, 包括内置对象, 实例对象等, 其结果为`object`
+ `typeof`判断函数, 会返回`function`, 但其实函数也是对象
+ `typeof`判断`null`, 其结果为`object`
+ `typeof`判断声明未赋值, 或从未声明的变量, 均返回`undefined`
  ```JavaScript
  let name;
  console.log(typeof name); // undefined
  console.log(typeof age); // undefined
  ```
+ 除此之外, `typeof`的判断结果和其类型一致
+ 不要使用`typeof`判断对象, 结果不一定正确
+ 所有`typeof`返回值为`object`的对象, 内部都包含一个`[[class]]`属性, 该属性无法直接访问, 可通过`Object.prototype.toString`查看, 通常情况下结果和原生构造函数一致
  ```JavaScript
  Object.prototype.toString.call([1, 2, 3]); // "[object Array]"
  Object.prototype.toString.call(function () { }); // "[object Function]"
  Object.prototype.toString.call(/^[a-zA-Z0-9]+$/); // "[object RegExp]"

  // 例外
  Object.prototype.toString.call(null); // "[object Null]"
  Object.prototype.toString.call(undefined); // "[object Undefined]"

  // 传入的原始值会被转为对象(引用包装)
  Object.prototype.toString.call(123); // "[object Number]"
  ```
+ 对于对象的判断, 应该使用`instanceof`
+ 检测一个值是否为`null`
  ```JavaScript
  if (value === null) { /** */ }

  if (!value && typeof value === 'object') { /** */ }
  ```
+ `NaN`不是数据类型, 而是一个数值型的值, `typeof`结果为`number`
+ `NaN`与其自身不相等, 判断`NaN`应该使用`isNaN()`或`Object.is()`方法
  ```JavaScript
  console.log(NaN == NaN); // false
  console.log(NaN === NaN); // false
  console.log(Object.is(NaN, NaN)); // true
  ```
+ 应该使用`Number.isNaN()`方法, 而非`window.isNaN()`方法, 后者有缺陷
  ```JavaScript
  const num = 'zhangzhen';
  console.log(window.isNaN(num)); // true
  console.log(Number.isNaN(num)); // false
  ```
+ `===`和`==`无法区分`0`和`-0`, 应该使用`Object.is()`方法
  ```JavaScript
  console.log(0 == -0); // true
  console.log(0 === -0); // true
  console.log(Object.is(0, -0)); // false
  ```
+ `-0`数字转为字符串会得到`0`, 但`'-0'`字符串转为数字, 会得到`-0`
+ 安全防范机制: 使用`typeof`或者对象点语法判断不存在的变量
  ```JavaScript
  if (DEBUG) { /** */ } // 会报错

  if (typeof DEBUG !== undefined) { /** */ }

  if ((window || global).DEBUG) { /** */ }
  ```

#### Symbol数据类型
+ `Symbol`是原始值, 其实例唯一且不可变
+ `Symbol`用于保证对象的属性标识唯一, 不会造成属性冲突
+ 简单来说, `Symbol`用于对象的key值
+ `Symbol`不能用`new`创建, 直接使用`Symbol()`即可
  ```JavaScript
  const uniqueKey = Symbol();
  const obj = {};
  obj[uniqueKey] = 'value';

  const obj2 = {
    [Symbol()]: 'value'
  };
  ```
+ 创建时可以传入字符串参数, 方便调试和描述, 但和符号实例没有任何关联
  ```JavaScript
  const uniqueKey = Symbol('description');
  const obj = {};
  obj[uniqueKey] = 'value';
  ```
+ 即使传相同的字符串参数, 符号实例也是彼此不相等的
  ```JavaScript
  const uniqueKey1 = Symbol('name');
  const uniqueKey2 = Symbol('name');
  console.log(uniqueKey1 === uniqueKey1); // false
  ```
+ 全局符号注册表, 复用相同的符号
  ```JavaScript
  const key = Symbol.for('name');
  const obj = {};
  obj[key] = 'value';

  const obj2 = {};
  const key2 = Symbol.for('name'); // 复用已有的符号
  obj2[key2] = 'value';

  console.log(key === key2); // true
  ```
+ 使用`Symbol.keyFor()`查询全局符号注册表
  ```JavaScript
  const key = Symbol.for('description');
  console.log(Symbol.keyFor(key)); // description
  ```
+ 内置符号: 已经被JavaScript所使用的符号属性, 某些JavaScript方法需要用到该属性值
+ 内置属性示例: 
  - `Symbol.toStringTag`: 使用`toString()`方法时, 会读取目标对象上该属性的值
    ```JavaScript
    class Person {}
    const person = new Person();
    console.log(person.toString()); // [object Object]

    class Person {
      constructor() {
        this[Symbol.toStringTag] = 'Person';
      }
    }
    const person = new Person();
    console.log(person.toString()); // [object Person]
    ```
  - `Symbol.iterator`: 使用`for...of`循环会读取目标对象上该属性的迭代器
    ```JavaScript
    const obj = {
      min: 1,
      max: 3,
      *[Symbol.iterator]() {
        for (let index = this.min; index <= this.max; index++) {
          yield index;
        }
      },
    }
    for (const item of obj) {
      console.log(item);
    }
    // 1
    // 2
    // 3
    // Array实例已经默认实现了[Symbol.iterator]的迭代器方法
    ```
+ 符号属性不可使用`for...in`/`Object.keys`等枚举
+ 使用`Object.getOwnPropertySymbols`获取符号属性

#### 引用数据类型Object
+ 对象数据属性描述符, 不能直接使用, 必须通过`Object.defineProperty`
  - `writable`: 是否可修改属性值
  - `configurable`:
    - 是否可使用`Object.defineProperty`配置属性
    - 是否可删除属性
  - `enumerable`: 是否可以枚举, 即:
    - 是否出现在`for...in`中
    - 是否出现在`Object.keys()`中
  - `value`: 属性的值
  
  ```JavaScript
  // 即使对象的Configurable为false
  // 依然可以通过Object.defineProperty()将其Writable从true改为false
  // 但无法再将false改为true
  const myObject = {};
  Object.defineProperty(myObject, 'myAttribute', {
      value: 'attributeValue',
      writable: true,
      configurable: false, // 将配置属性设置为false
      enumerable: true
  });
  Object.defineProperty(myObject, 'myAttribute', {
      writable: false // 此处配置是合法的
  });
  Object.defineProperty(myObject, 'myAttribute', {
      writable: true  // 此处会失败!
  });
  ```
+ 对象访问器属性描述符, 不能直接使用, 必须通过`Object.defineProperty`
  - `configurable`: 同上
  - `enumerable`: 同上
  - `get`: 获取访问器
  - `set`: 设置访问器
  ```JavaScript
  const obj = { name: 'zhangsan' };
  Object.defineProperty(obj, 'name', {
    get() {
      return this.name;
    },
    set(value) {
      this.name = value;
    }
  })
  ```
+ `Object.getOwnPropertyDescriptor`获取对象的属性描述符
  ```JavaScript
  const obj = {};
  Object.defineProperty(obj, {
    name: {
      value: 'zhangsan',
      writable: true
    }
  });
  const descriptor = Object.getOwnPropertyDescriptor(obj, "name");
  console.log(descriptor.value); // zhangsan
  console.log(descriptor.writable); // true
  ```
+ `Object.getOwnPropertyDescriptors`: ES2017新增方法, 在对象的每个属性上调用`getOwnPropertyDescriptor`, 并组合成一个对象返回
+ `Object.defineProperty`定义多个属性
  ```JavaScript
  const obj = {};
  Object.defineProperty(obj, {
    _age: {
      value: 18
    },
    age: {
      get() {
        return this._age;
      },
      set(value) {
        this._age = value;
      }
    }
  });
  ```
+ `Object.preventExtensions()`: 禁止对象扩展新属性, 保留当前已有属性
+ `Object.seal()`: 密封对象, 禁止配置和删除已有属性, 也会禁止扩展新属性
+ `Object.freeze()`: 冻结对象, 禁止配置和删除已有属性, 禁止扩展新属性, 禁止修改属性值
+ 以上三个方法中所描述的属性, 指的是自有属性, 如果属性值应用了其他对象, 上述方法是无效的
+ 对象属性设置和屏蔽
  - 原型链`就近`原则: 前端的属性和方法, 会遮蔽掉原型链上的同名属性和方法
  - 假设在某对象上执行语句: `obj.key = value`
    - 自身有key属性, 且`writable`为`true`, 则会修改其值为value
    - 自身有key属性, 且`writable`为`false`, 则赋值失败, 严格模式会报错
    - 自身无key属性, 原型链上也无key属性, 则会直接在`obj`上添加key属性
  - 假设自身无key属性, 但原型链上有key属性, 针对`obj.key = value`赋值语句:
    - `writable`为`true`, 则在`obj`上添加key属性, 且屏蔽掉原型链上的
    - `writable`为`false`, 赋值语句会抛出错误, 也不会屏蔽
    - key定义了`setter`, 则会触发该`setter`, `obj`上不会添加key属性
  - 上述情况仅针对于使用`=`赋值的情况, `Object.defineProperty`不受此影响
  ```JavaScript
  // 不小心导致屏蔽的情况
  const obj = {
    a: 2
  }
  const obj2 = Object.create(obj);
  obj2.a++; // 隐式屏蔽, 相当于obj2.a = obj2.a + 1;
  console.log(obj2.a); // 3
  ```
+ 原始值包装, JavaScript在后台创建相应的对象, 并调用其方法, 再移除该对象
  ```JavaScript
  const str = 'zhangzhen';
  console.log(str.split('').reverse().join('')); // nehzgnahz

  // const strObject = new String(str);
  // strObject.split('').reverse().join('');
  // strObject = null
  ```
+ 内置对象: JavaScript规范提供的, 与宿主环境无关的, 程序开始执行时就已经存在的对象: `Object`, `Array`, `String`...
+ 单例内置对象: `Math`和`Global`
+ JavaScript没有真正意义上的全局对象和全局函数, 都会变成`Global`的属性
+ 浏览器将`window`实现为`Global`对象的代理
+ 宿主对象: 由宿主环境(浏览器, Nodejs等)提供给JavaScript使用的对象: `document`等
  - 无法访问`Object`内置方法
  - 如需使用`Object`内置方法, 需使用`Object.prototype.method.call/apply`形式
  - 更详细的宿主对象信息, 将在`BOM`和`DOM`中讲述
+ `Object.assign()`: 有则修改, 无则追加, 只会处理可枚举和自身属性
  ```JavaScript
  const A = { name: 'zhangsan', age: 18 };
  const B = Object.assign(A, { sex: 'male', age: 20 });
  console.log(B);
  // { name: 'zhangsan', age: 20, sex: 'male' }
  ```

#### 其他数据类型的补充
+ `Array()`和`new Array()`效果是完全一样的
+ `Array()`和`new Array()`只传入一个参数, 会被视为数组的预设长度
  ```JavaScript
  const arr = new Array(3);
  console.log(arr.length); // 3
  ```
+ 数组的空槽位: 因创建数组时未赋默认值, `delete`操作符, 或改变数组长度时产生的`undefined`值
+ 数组的空槽位和手动赋值的`undefined`是不一样的
  ```JavaScript
  const emptyArray1 = new Array(3); // [ <3 empty items> ]

  const emptyArray2 = [];
  emptyArray2.length = 3; // [ <3 empty items> ]

  const emptyArray3 = [undefined, undefined, undefined]; 
  // [ undefined, undefined, undefined ]

  // 部分数组方法会有不一样的结果
  emptyArray2.map((_, index) => index); 
  // [ <3 empty items> ] 数组没有元素, map无从遍历

  emptyArray3.map((_, index) => index);
  // [0, 1, 2] 数组有三个元素, 值都为undefined

  emptyArray2.join('-'); // '--'
  emptyArray3.join('-'); // '--' join()方法结果一样
  ```
+ 不要创建包含空槽位的数组
+ `delete`删除数组元素不会改变数组长度
+ 使用`Array`将类数组对象创建为数组, 其结果不会包含空槽位
  ```JavaScript
  const arr = Array.call(null, { length: 3 });
  console.log(arr); // [undefined, undefined, undefined]
  ```
+ `Date`类型, 使用`new`调用会创建日期对象, 不用`new`则会得到当前日期的字符串值
+ 一些奇怪的行为
  ```JavaScript
  // 奇怪的行为
  typeof Function.prototype; // function 空函数
  RegExp.prototype.toString(); // "/(?:)/" 空正则表达式
  Array.isArray(Array.prototype); // true 空数组
  ```
+ `Map`映射
  - `Map`构造函数接收的是包含键值对数组的可迭代对象
    ```JavaScript
    const m = new Map([
      ['key', 'value']
    ]);

    const m = new Map({
      *[Symbol.iterator]() {
        yield ['key', 'value'];
      }
    })
    ```
  - `Object`只能使用字符串/数值/符号作为键值, 但`Map`可以使用任意类型
  - `Map`的键/值如果是对象, 其自身属性被修改时, 映射仍然不变
    ```JavaScript
    const key = {};
    const value = {};
    
    const map = new Map()
    map.set(key, value);

    key.name = 'zhangsan';
    value.age = 18;

    console.log(map.get(key)); // { age: 18 }
    ```
  - `Map`映射对于键值的比较是内部算法, 叫做`SameValueZero`, 有时候也会抽风
    ```JavaScript
    const A = 1 / ''; // NaN
    const B = 2 / ''; // NaN

    const map = new Map();
    
    map.set(A, 10);
    console.log(map.get(B)); // 10

    // 类似于Object.is
    ```
  - `Map`会维护插入顺序, 可以使用`entries()`/`[Symbol.iterator]`迭代, `[Symbol.iterator]`属性方法其实就是引用了`entries()`
    ```JavaScript
    const map = new Map([ ['key', 'value'] ]);
    console.log(map.entries === map[Symbol.iterator]); // true

    for (const keyValue of map.entries()) {
      //...
    }

    for (const keyValue of map[Symbol.iterator]()) {
      // ...
    }
    ```
  - `Map`映射可使用`...`展开为数组, 也可以使用`Array.from()`
    ```JavaScript
    const map = new Map([
      ['key1', 'value1'],
      ['key2', 'value2']
    ]);

    console.log(...map); 
    // [ ['key1', 'value1'], ['key1', 'value1'] ]
    ```
+ `Map`和`Object`的选择
  - 内存占用: 同样的内存, Map大约能比Object多存储50%的键值对
  - 插入性能: Map插入比Object稍快, 因此对于大量的插入操作, Map更快
  - 查找速度: 差异不大, Object部分引擎会优化, 巨量查找更适合Object
  - 删除元素: 大量删除应该使用Map
+ `Set`集合
  - `Set`构造函数接收的是包含元素数组的可迭代对象
    ```JavaScript
    const s = new Set(['value1', 'value2']);

    const s = new Set({
      *[Symbol.iterator]() {
        yield 'value1';
        yield 'value2';
      }
    })
    ```
  - `Set`可以使用任意类型
  - `Set`的值如果是对象, 其自身属性被修改时, 集合仍然不变
    ```JavaScript
    const value = {};
    
    const set = new Set()
    set.add(value);

    value.name = 'zhangsan';
    console.log(set.has(value)); // true
    ```
  - `Set`的内部比较同样是`SameValueZero`, 同样也会维护值的插入顺序, 使用`entries()`和`[Symbol.itrator]`迭代时, 会产生两个值的迭代项
    ```JavaScript
    const s = new Set(['value1', 'value2']);
    for (const item of s.entries()) {
      console.log(item);
    }
    // ['value1', 'value1']
    // ['value2', 'value2']
    ```
  - 同样可以使用`...`展开为数组, 也可以使用`Array.from()`
    ```JavaScript
    const s = new Set(['value1', 'value2']);
    console.log(...s); // ['value1', 'value2']
    ```
+ `WeakMap`和`WeakSet`
  - 两种类型的API和使用方法, 和`Map`/`Set`完全一致, 但是缺了一些方法
  - `WeakMap`只能使用对象作为键, 但值依然可以是任意类型
  - `WeakMap`并没有强引用对象键, 该键没有其他引用时, 不会阻止垃圾回收, 当对象键被回收后, 值也就从WeakMap中消失了
  - `WeakMap`不可迭代, 也没有`clear`方法
    ```JavaScript
    // DOM节点关联一些元数据
    const wm = new WeakMap();
    const loginButton = document.querySelector('.login');
    wm.set(loginButton, { diabled: true });

    // 当登录按钮从DOM树中移除时, 垃圾回收会立即释放内存
    
    // 如果用的Map, 由于Map对键值的强引用, 即是DOM树中移除按钮, 垃圾回收也不会清理
    ```
  - `WeakSet`只能使用对象作为值
  - `WeakSet`并没有强引用对象值, 该值没有其他引用时, 不会阻止垃圾回收, 当对象值被回收后, 值也就从WeakSet中消失了
  - `WeakSet`不可迭代, 也没有`clear`方法
    ```JavaScript
    const disabledElements = new WeakSet();
    const loginButton = document.querySelector('.login');
    disabledElements.add(loginButton);

    // 当登录按钮从DOM树中移除时, 垃圾回收会立即释放内存
    
    // 如果用的Set, 由于Set对键值的强引用, 即是DOM树中移除按钮, 垃圾回收也不会清理
    ```

#### 强制类型转换
+ 强制类型转换的原则: 只会返回`基本类型`, 不会返回函数或者对象
+ `valueOf()`: 默认返回本身的值, 更标准的说法是`valueOf`返回通过`new`构造函数创建的对象的封装值
  ```JavaScript
  Object.prototype.valueOf.call([1, 2, 3]);
  // [1, 2, 3]
  [1, 2, 3].valueOf();
  // [1, 2, 3]
  Object.prototype.valueOf.call({ name: '' });
  // { name: '' }
  ({ name: '' }).valueOf();
  // { name: '' }
  ```
+ 转换为字符串的规则:
  - 主要使用 `toString()`/`String()`/`+` 方法
  - 对于基本类型, 返回其对应的字符串, 数值如果极小或者极大, 会被转为指数形式
    ```JavaScript
    const value = 1.071000100010001000100010001000;
    console.log(value.toString()); // "1.07E+21"
    ```
  - 对于普通对象, 优先返回内部的`[[class]]`属性
    ```JavaScript
    ({}).toString(); // [object Object]
    String({}); // [object Object]
    '' + {}; // [object Object]
    ```
  - 对于函数, 返回函数源代码字符串
    ```JavaScript
    function log(param) {
      console.log(param);
    }
    log.toString();
    // 'function log(param) {\n console.log(param);\n }'
    ```
  - 若重写`toString()`方法, 则以此对准
    ```JavaScript
    [1, 2, 3].toString(); // 1,2,3
    ```
+ 转换为数字的规则
  - 主要使用`Number()`方法
  - `parseInt`和`parseFloat`是解析, 并非类型转换
  - 一些转换规则: 
    - `true --> 1`
    - `false --> 0`
    - `undefined --> NaN`
    - `null --> 0`
    - `"" --> 0`
  - 字符串处理失败时返回`NaN`
  - 对象首先检查`valueOf()`, 没有就用`toString()`, 得到基本类型, 再进行类型转换
  - 没有`valueOf()`也没有`toString()`, 会抛出`TypeError`错误
  ```JavaScript
  const value1 = { valueOf() { return '42'; } };
  const value2 = { toString() { return '42'; } };
  Number(value1); // 42
  Number(value2); // 42
  Number(""); // 0
  Number([]); // 0
  Number(['123']); // 123
  ```
+ 转换为布尔值的规则
  - 主要使用`!!`或`Boolean()`方法
  - 假值, 强制类型转换会转为`false`, 假值如下: 
    - `undefined`
    - `null`
    - `false`
    - `+0`
    - `-0`
    - `NaN`
    - `""`
  + 假值以外的值在强制类型转换结果均为`true`
  + 假值对象结果为`true`
  ```JavaScript
  const obj = new Boolean("");
  if (obj) {
    // 这里的代码会执行到
  }
  ```
+ `+`运算符的规则
  - 如果一个操作数是字符串, 则`+`执行拼接操作, 将另一个数也转为字符串
  - 如果一个操作数对象, 通过优先`valueOf()`, 没有就转`toString()`转为基本类型, 再按上一条规则判断
  ```JavaScript
  const objectA = {
    valueOf() {
      return 21;
    }
  };
  const objectB = {
    toString() {
      return '42';
    }
  };
  console.log(objectA + objectB); 
  // '2142'
  ```
+ `-`运算符的规则
  - 会将两边的操作数都转为数字, 再进行计算
  - 对象会优先调用`valueOf`, 转为基本类型, 没有则调用`toString`
  ```JavaScript
  console.log('3.14' - '0'); // 3.14
  console.log([3] - [1]); // 2
  console.log({} - {}); // NaN

  const objectValue1 = {
    valueOf() {
      return 21;
    },
    toString() {
      return '10';
    }
  }
  const objectValue2 = {
    valueOf() {
      return 42;
    },
    toString() {
      return '5';
    }
  }
  console.log(objectValue1 - objectValue2); // -21
  ```
+ `&&`和`||`操作符
  - `&&`和`||`都是返回左右两个操作数中的一个:
  - `&&`: 返回第一个可转为false的值, 否则返回最后一个值; 
  - `||`: 返回第一个可转为true的值, 否则返回最后一个值; 
  ```JavaScript
  function setHeight(height) {
    element.height = height || '120px';
  }
  ```
+ 相等(`==`)和全等(`===`)
  - 错误的论述: `==`检查值相等, `===`检查值和类型同时相等
  - 正确的论述: `==`允许比较中进行强制类型转换, `===`不允许
  - `==`的比较规则
    - 字符串和数字: 将字符串转为数字后进行比较
    - 其他类型和布尔值: 将布尔值转为数值, 再进行下一步转换或比较
    - `null`和`undefined`: `null == undefined`返回`true`
    - 对象和非对象: 对象会按照`valueOf`/`toString`的顺序转换为基本类型, 再进行下一步转换或比较
    - 对象之间的比较, 不进行类型转换, 同一个引用则相等, 不同的对象一律不相等
  ```JavaScript
  "0" == null; // false
  "0" == undefined; // false
  "0" == false; // true
  "0" == NaN; // false
  "0" == 0; // true
  "0" == ""; // false

  false == null; // false
  false == undefined; // false
  false == NaN; // false
  false == 0; // true
  false == ""; // true
  false == []; // true
  false == {}; // false

  "" == null; // false
  "" == undefined; // false
  "" == NaN; // false
  "" == 0; // true
  "" == []; // true
  "" == {}; // false

  0 == null; // false
  0 == undefined; // false
  0 == NaN; // false
  0 == []; // true
  0 == {}; // false

  [] == ![]; // true
  "" == [null]; // true
  0 == "\n"; // true
  ```
+ 抽象关系比较: `>` 和 `<`
  - 比较双方都是字符串: 按字母顺序比较
  - 其他: 按照`valueOf`/`toString`转为基本类型，如果有非字符串，则强制转为数字比较。
  - `重点`: `(a >= b)`会被处理为`!(b < a)`
  ```JavaScript
  const a = { b: 42 };
  const b = { b: 43 };
  console.log(a < b); // false
  console.log(a > b); // false
  console.log(a3 == b3); // false 对象之间的比较
  console.log(a3.toString() == b3.toString()); // true
  console.log(a <= b); // true
  console.log(a >= b); // true
  ```
+ 解析和转换的区别
  - 解析: 如`parseInt()`等, 允许参数中有非数字字符, `parseInt('123px')`返回123
  - 转换: 如`Number()`, 不允许参数中有非数字字符, `Number('123px')`返回NaN
  - 有趣的例子
  ```JavaScript
  parseInt(1 / 0, 19); // 18
  parseInt(false, 16); // 250
  parseInt(parseInt, 16); // 15 
  ```
+ JSON
  - 对象中定义了`toJSON()`方法, `JSON.stringify()`方法则会先调用它
    ```JavaScript
    const objectValue = {
      a: 2,
      b: function () { },
      toJSON() {
        return { index: 123 }
      }
    }
    JSON.stringify(objectValue); // { "index": 123 }
    ```
  - 安全的JSON值: 能够呈现为有效的JSON格式的值
  - 不安全的JSON值: `undefined`/`function`/`symbol`
  - `JSON.stringify()`方法遇到不安全JSON值时会忽略, 而在数组中则会返回`null`
    ```JavaScript
    JSON.stringify([1, function () { }, 4]); 
    // [1, null, 4]
    JSON.stringify({ a: 2, b: function () { } }); 
    // { a: 2 }
    ```
  - `JSON.stringify()`的第2, 3个参数
    ```JavaScript
    // JSON.stringify()的第二个参数replacer, 指定需要处理的属性
    // 1. 如果replacer是数组, 则必须是字符串数组
    const objectValue = {
      a: 123,
      b: "123",
      d: [1, 2, 3]
    }
    JSON.stringify(objectValue, ["a", "b"]); 
    // {"a":123,"b":"123"} d属性被忽略了

    // 2. 如果replacer是函数, 函数会在对象本身, 及对象每个属性上调用
    JSON.stringify(objectValue, function (k, v) {
      if (k !== 'b') {
        return v;
      }
    }); 
    // {"a":123,"d":[1,2,3]} b属性被忽略掉了

    // JSON.stringify()方法的第三个参数space, 指定缩进格式
    JSON.stringify(objectValue, null, 3); 
    // 缩进为3个空格, 逐级递增
    JSON.stringify(objectValue, null, '----'); 
    // 缩进为'----', 逐级递增
    ```

#### 语法和值类型
+ `delete`运算符的结果值, 操作成功返回`true`, 操作失败返回`false`, 操作成功指的是:
  - 删除不存在的属性
  - 删除存在且可配置的属性
    ```JavaScript
    // delete运算符结果值
    const O = {
        a: 123
    }
    Object.defineProperty(O, 'b', {
        value: 123,
        writable: false,
        enumerable: false,
        configurable: false
    });
    delete deleteObject.a; // true 存在且可配置的属性
    delete deleteObject.b; // false 存在不可配置的属性
    delete deleteObject.c; // true 不存在的属性
    ```
+ 使用`delete`删除对象属性时, 最好加上结果检查
+ `try...catch...finally`:
  - 执行顺序: `try`-->`catch`-->`finally`
  - `try`中有`return`, `finally`中的代码依然会执行
  - `try`中有`throw`, `finally`中的代码依然会执行
  - `finally`中的`return`会覆盖`try`中的`return`
  - `finally`中的`throw`会导致`try`中的`return`被丢弃
  ```JavaScript
  const fun1 = () => {
    try {
      return 111;
    } finally {
      console.log(222);
    }
    console.log(333); // 这行代码会被丢弃, 不会执行
  }
  console.log(fun1());

  // 222
  // 111

  const fun2 = () => {
    try {
      return 111;
    } finally {
      return 222
    }
  }
  console.log(fun2()); // 222

  const fun3 = () => {
    try {
      return 111;
    } finally {
      throw new Error('111')
    }
  }
  console.log(fun3()); // Error: 111
  ```
+ `switch...case`
  - 默认情况下, `case`采用全等`===`进行匹配判断
  - 如需进行类型转换的`==`匹配, 需要做额外处理
  - `case`可以是表达式, 其值和`switch`中的值进行严格比
  - `default`中如果没有`break`; 后面的代码依然会执行
  ```JavaScript
  let a = "42";
  switch(true) {
    case a == 10:
      console.log(`10 or "10"`);
        break;
    case a == 42:
      console.log(`42 or "42"`);
    default:
      break;
  }
  // 42 or "42"
  ```
+ 数值调用方法, 要注意`.`可能引起的bug
  ```JavaScript
  // 123.toString()会抛出错误

  (123).toString();
  123..toString();
  123 .toString();
  ```
+ `for...in`循环会返回原型链上的可枚举属性
  ```JavaScript
  const A = { name: 'zhangsan' };
  const B = { age: 18 }
  Object.setPrototypeOf(A, B);
  for (const key in A) {
    console.log(key);
  }
  // name
  // age
  ```
+ 使用`for...in`循环应该使用`hasOwnProperty`判断
  ```JavaScript
  for (const key in A) {
    if (A.hasOwnProperty(key)) {
      console.log(key);
    }
  }
  // name
  ```
+ `for...in`循环无法保证顺序一致!
+ `for...in`和`Object.keys`内部获取对象属性的方法是一样的, 因此也无法保证顺序
+ `Object.values`/`Object.entries`也是一样的, 无法保证顺序
+ `in`操作符可以单独使用, 对于原型链上的可枚举属性同样会返回`true`
  ```JavaScript
  const A = { name: 'zhangsan' };
  const B = { age: 18 };
  Object.setPrototypeOf(A, B);
  console.log('age' in A); // true
  ```
+ JavaScript没有真正意义上的整数, 没有小数部分, 或者小数部分都为0的十进制数都被视为整数
+ JavaScript数字类型采用`IEEE 754`标准, 也被称为浮点数, JavaScript使用双精度, 即64位二进制
+ JavaScript会将超过一定长度的整数值自动转为科学计数法, 会将超过一定长度的浮点数值截断
  ```JavaScript
  console.log(1); // 1
  console.log(1.3333); // 1.3333
  console.log(1.43598345734857348957348534895); // 1.4359834573485735
  console.log(234579834572348293547345734534985); // 2.345798345723483e+32
  ```
+ `Number.EPSILON`: 机器精度, 其值通常为`Math.pow(2, -52)`;
  ```JavaScript
  // 由于精度的问题, 0.1 + 0.2 === 0.3 会返回false
  function checkNumberEqual(num1, num2) {
      return Math.abs(num1 - num2) < Number.EPSILON;
  }
  console.log(checkNumberEqual(0.1 + 0.2, 0.3)); // true
  // 最好的办法还是转为整数在比较
  ```
+ JavaScript能够呈现的`最大浮点数`, 1.798E+308, 保存在`Number.MAX_VALUE`中
+ JavaScript能够呈现的`最小浮点数`, 5E-324, 保存在`Number.MIN_VALUE`中, 不是负数, 无限接近0
  ```JavaScript
  // JavaScript数学运算如果超过处理范围, 采用"就近取整"
  const numberA = Number.MAX_VALUE; // 1.7976931348623157e+308
  numberA + numberA; // Infinity;
  numberA + Math.pow(2, 970); // Infinity 更接近Infinity
  numberA + Math.pow(2, 969); // 1.7976931348623157e+308 更接近Number.MAX_VALUE
  ```
+ JavaScript能够`安全`呈现的最大/最小整数 (呈现的和实际值一致, 不在这个范围的值, 显示可能会异常):
  - `Number.MAX_SAFE_INTEGER`
  - `Number.MIN_SAFE_INTEGER`
  - Chrome浏览器的测试结果
  ```JavaScript
  console.log(Number.MAX_SAFE_INTEGER); //  9007199254740991
  console.log(Number.MIN_SAFE_INTEGER); // -9007199254740991

  console.log(9007199254740991); // 9007199254740991
  console.log(9007199254740992); // 9007199254740992
  console.log(9007199254740993); // 9007199254740992
  console.log(90071992547409911); // 90071992547409900

  console.log(-9007199254740991); // -9007199254740991
  console.log(-9007199254740992); // -9007199254740992
  console.log(-9007199254740993); // -9007199254740992
  console.log(-90071992547409911); // -90071992547409900
  ```
+ `void`运算符, 让表达式没有返回值, 但不改变表达式的结果
  ```JavaScript
  const num = 42;
  console.log(void num, num); // undefined, 42
  // 不需要返回值的时单独使用return, 这和void类似
  function aFunction() {
    if (someCondition) {
      doSomething();
      return;
    }
  }
  // 类似于
  if (someCondition) {
    return void doSomething();
  }
  ```

#### 面向对象
+ 使用`new`调用构造函数创建对象的过程
  - 会首先创建一个新对象
  - 新对象的原型指针被赋值为构造函数的原型
  - 执行构造函数中的代码, 其`this`被赋值为新创建的对象
  - 构造函数中显示返回的非空对象将覆盖创建的对象, 其他的返回值将被忽略
  - 构造函数如果没有参数, `new`调用时可以不加括号(不推荐)
  - 不加`new`调用构造函数, `this`指向全局`window`(非严格模式)
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
    }
  }
  const person1 = new Person();
  const person2 = new Person();
  console.log(person1.method === person2.method); // false
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
  A[构造函数] -->|通过.prototype属性| C[原型对象]
  C[原型对象] -->|通过.constructor属性| A[构造函数]
  C[原型对象]-->|包含其他| D[原型属性和方法]
  ```
  - 原型对象上的属性和方法, 可以被`new`调用该函数创建的对象所共享
  - 函数才有`prototype`属性, 普通对象只有一个`[[prototype]]`内部属性, 无法直接读取, 我个人称之为原型指针
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
  - 对象调用自身没有的属性和方法时, 会在原型指针指向的原型对象上查找, 没有就继续往上查找, 直到`null`, 这就是原型链
  - 原型链就近原则: 对象查找属性和方法, 是从自身开始, 直至找到或者`null`
  ```mermaid
  graph TD
  A[调用方法 / 获取属性] -->|没找到, 通过内部指针| B[原型对象1]
  B[原型对象1] -->|没找到, 通过内部指针| C[原型对象2]
  C[原型对象2] -->|没找到, 通过内部指针| D[原型对象3]
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

#### 代理和反射

+ 代理(`Proxy`)基础概念:
  - 代理对象是目标对象的替身, 所有在代理对象上的操作, 都会传播到目标对象上
  - 传播到目标对象前, 开发者可以拦截操作并嵌入额外的行为, 甚至修改操作的结果
  - 创建代理使用`Proxy`构造函数, 参数是目标对象和处理程序对象
  - `Proxy`构造函数没有`prototype`属性, 没有原型, 因此不能使用`instanceof`
  ```JavaScript
  const person = {
    name: 'zhangsan',
    age: 18
  };
  // 创建一个空程序处理对象, 代理对象的操作将没有任何拦截
  const proxy = new Proxy(person, {});
  console.log(proxy.name); // zhangsan
  console.log(proxy.age); // 18
  proxy.sex = 'male';
  console.log(person.sex); // male

  console.log(proxy instanceof Proxy); // 直接报错
  ```
+ 程序处理对象(捕获器)
  - 可以在程序处理对象中, 定义零个或多个捕获器方法
  - 操作代理对象时, 会执行相应操作的捕获器方法, 嵌入额外行为, 和修改原始行为
  - 捕获器方法只有有限种, 且每种方法都有固定的参数, 这个需要考验记忆力
  ```JavaScript
  const person = {
    name: 'zhangsan',
    age: 18
  };
  // 定义程序处理对象
  const handler = {
    get(target, property, reciever) {
      if (property === 'name') {
        return 'It is a secret';
      }
      if (property === 'age') {
        return `${target[property]}岁`;
      }
      return target[property];
    }
  };
  const proxy = new Proxy(person, handler);
  console.log(proxy.name); // It is a secret
  console.log(proxy.age); // 18岁
  ```
+ `get`捕获器方法比较简单, 可以直接通过手写来重建原始行为, 但有很多捕获器方法很复杂, 全靠手写不现实, 因此可以借助`反射API`
+ 反射(`Reflect`)基础概念:
  - `Reflect`首先是一个对象, 该对象定义了一堆方法
  - 所有的代理捕获器方法, 都可以在`Reflect`对象上找到同名的方法
  - 代理捕获器方法, 和`Reflect`同名方法, 签名一致, 行为一致
  ```JavaScript
  const person = {
    name: 'zhangsan',
    age: 18
  };
  const proxy = new Proxy(person, {
    get: Reflect.get
  });
  console.log(proxy.name); // zhangsan
  console.log(proxy.age); // 18
  ```
+ 单独使用反射 API
  - `Reflect API`并不只是局限于代理捕获器, 可以单独使用
  - 大多数反射 API 都返回状态标记, 即成功与否的布尔值, 而不是抛出错误
  ```JavaScript
  const o = {};
  if (Reflect.defineProperty(0, 'name', { value: 'zhangsan' })) {
    console.log('success');
  } else {
    console.log('failure');
  }
  ```
+ 捕获器方法总结表 (以下方法在`Reflect`上都有同名同参数, 且行为一致的方法) :

|         捕获器方法         |             作用             |               方法参数                |
| :------------------------: | :--------------------------: | :-----------------------------------: |
|           `get`            |          访问属性值          |    `(target, property, reciever)`     |
|           `set`            |          设置属性值          | `(target, property, value, reciever)` |
|      `deleteProperty`      |           删除属性           |         `(target, property)`          |
|          `apply`           |       属性是函数/方法        |     `(target, thisArg, argsList)`     |
|        `construct`         |      目标对象是构造函数      |    `(target, argsList, newTarget)`    |
| `getOwnPropertyDescriptor` |        获取属性描述符        |         `(target, property)`          |
|      `defineProperty`      |        设置属性描述符        |   `(target, property, descripter)`    |
|      `getPrototypeOf`      |         获取对象原型         |              `(target)`               |
|      `setPrototypeOf`      |         设置对象原型         |         `(target, prototype)`         |
|    `preventExtensions`     |         禁止扩展对象         |              `(target)`               |
|       `isExtensible`       |        对象是否可扩展        |              `(target)`               |
|         `ownKeys`          |    获取对象自有属性/符号     |              `(target)`               |
|        `enumerate`         |   获取对象可枚举属性迭代器   |              `(target)`               |
|           `has`            | 是否拥有某个属性(包括原型链) |         `(target, property)`          |

***
**注解**: 触发捕获器方法的方式:
+ `get`捕获器: `.`点运算符 & `...`展开运算符
+ `set`捕获器: `=`赋值 & 解构赋值
+ `deleteProperty`捕获器: `delete`
+ `apply`捕获器: `call` & `apply` & 直接加`()`调用
+ `construct`捕获器: `new`调用
+ `ownKeys`捕获器: `Object.keys` & `Object.getOwnPropertyNames` & `Object.getOwnSymbolProperties` & `JSON.stringify`
+ `enumerate`捕获器: `for...in`
+ `has`捕获器: `in` & `Object.hasOwnProperty`
***
+ 捕获器不变式
  - 目标对象做了某些限制, 比如不可扩展, 不可修改属性值等
  - 在代理上执行这些限制操作, 则会抛出错误
  ```JavaScript
  const person = {};
  Object.defineProperty(person, 'name', {
    value: 'zhangsan',
    writable: false,
    configurable: false
  });
  const proxy = new Proxy(person, {
    get() {
      return 'lisi';
    }
  });
  console.log(proxy.name); // TypeError
  ```
+ 可撤销代理: 使用`Proxy.revocable()`定义, 不加`new`, 参数一致
  ```JavaScript
  const person = { name: 'zhangsan' };
  const { proxy, revoke } = Proxy.revocable(person, {});
  console.log(proxy.name); // zhangsan
  revoke();
  console.log(proxy.name); // TypeError
  ```
+ 代理对象调用方法, `this`依旧指向代理对象(依然遵循谁调用, 指向谁的原则)
  ```JavaScript
  const person = {
    getThis() {
      console.log(this);
    }
  };
  const proxy = new Proxy(person, {});
  person.getThis(); // person对象
  proxy.getThis(); // Proxy(Object)
  ```
+ 目标对象如果有依赖`this`的情况, 则会出现 bug
  ```JavaScript
  const wm = new WeakMap();
  class Person {
    constructor() {
      wm.set(this, 'privateValue');
    }
    getPrivateValue() {
      console.log(wm.get(this));
    }
  }
  const person = new Person();
  person.getPrivateValue(); // privateValue

  const proxy = new Proxy(person, {});
  proxy.getPrivateValue(); // undefined

  // 修正, 代理类, 而非实例
  const PersonProxy = new Proxy(Person, {});
  const proxy = new PersonProxy();
  proxy.getPrivateValue(); // privateValue
  ```
+ 代理的示例1: 函数调用计时
  ```JavaScript
  function isPrime(number) {
    // ...是否为素数
  }
  isPrime = new Proxy(isPrime, {
    apply(target, thisArg, args){
      console.time('isPrime');
      const result = Reflect.apply(target, thisArg, args);
      console.timeEnd('isPrime');
      return result;
    }
  })
  ```
+ 代理示例2: 日志记录
  ```JavaScript
  const person = {};
  const proxy = new Proxy(person, {
    setPrototypeOf(target, prototype) {
      console.log(`修改${target}对象的原型, 修改时间: ${TimeUtil.getFormatTime()}`);
      return Reflect.setPrototypeOf(target, prototype);
    }
  });
  Object.setPrototypeOf(proxy, {});
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

#### 迭代器和生成器

#### Promise
