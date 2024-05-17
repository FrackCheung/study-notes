+ [总目录](../readme.md)
***
+ [语法和值类型](#语法和值类型)
+ [强制类型转换](#强制类型转换)
***
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
