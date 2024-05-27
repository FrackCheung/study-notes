+ [总目录](../readme.md)
***
+ [数据类型](#数据类型)
+ [symbol数据类型](#symbol数据类型)
+ [引用数据类型object](#引用数据类型object)
+ [其他数据类型的补充](#其他数据类型的补充)
***
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
