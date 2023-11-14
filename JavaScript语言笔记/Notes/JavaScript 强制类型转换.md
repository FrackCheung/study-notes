# JavaScript 强制类型转换

**[返回主目录](../readme.md)**

#### 原则
+ 强制类型转换总是返回`基本类型`, 不会返回对象和函数
+ 避免踩坑的原则:
  - 如果两边的值中有`true`或`false`，千万不要使用`==`
  - 如果两边的值中有`[]`、`""` 或者`0`，尽量不要使用`==`
```JavaScript
// 显示 & 隐式类型转换
const numberValue = 42;
const stringValue = numberValue + ""; // "42" 隐式类型转换
const stringValue2 = String(numberValue); // "42" 显示类型转换
```

#### ToString转换为字符串的规则
+ JavaScript主要使用 `toString()`/`String()`/`+` 方法
+ 对于`基本类型`, 返回其对应的字符串, 数值如果极小或者极大, 会被转为`指数形式`
```JavaScript
// toString()对于极大或者极小的数值, 返回其指数表示
const numberValue2 = 1.071000100010001000100010001000;
console.log(numberValue2.toString()); // "1.07E+21"
```
+ 对于`普通对象`, 优先返回内部的`[[class]]`属性
+ 若重写`toString()`方法, 则以此对准
```JavaScript
// Array重写了toString方法, 相当于join(',')
[1, 2, 3].toString(); // 1,2,3
```

#### ToNumber转换为数字的规则
+ JavaScript主要使用`Number()`方法
+ 一定要记住的一些转换规则: 
  - `true-->1`
  - `false-->0`
  - `undefined-->NaN`
  - `null-->0`
+ 字符串处理失败时返回`NaN`, 对于`0`的16进制数按`10进制`处理
+ 对象首先检查`valueOf()`, 没有就用`toString()`, 得到基本类型, 再进行类型转换
+ 没有`valueOf()`也没有`toString()`, 会抛出`TypeError`错误
```JavaScript
// 使用Number转换为数字
const objectValue3 = { valueOf() { return '42'; } };
const objectValue4 = { toString() { return '42'; } };
Number(objectValue3); // 42
Number(objectValue4); // 42
Number(""); // 0
Number([]); // 0
Number(['123']); // 123
```

#### ToBoolean转换为布尔值的规则
+ 主要使用`!!`或`Boolean()`方法
+ 假值, 强制类型转换会转为`false`, 假值如下: 
  - `undefined`
  - `null`
  - `false`
  - `+0`
  - `-0`
  - `NaN`
  - `""`
+ 假值以外的值在强制类型转换结果为`true`
```JavaScript
// 布尔类型转数值的应用
// 实现场景, 编写函数, 当入参中仅有一个值为true时, 函数返回true
function onlyOne(...args) {
    let sum = 0;
    for (let i = 0; i < args.length; i++) {
        sum = sum + Number(!!args[i]);
    }
    return sum === 1;
}
```

#### +运算符类型转换的规则
+ 如果一个操作数是`字符串`, 则`+`执行拼接操作, 将另一个数也`转为字符串`
+ 如果一个操作数对象, 通过`优先valueOf()`, 没有就转`toString()`转为`基本类型`, 再按`上一条`规则判断

#### -运算符类型转换的规则
+ 会将两边的操作数都`转为数字`, 再进行计算
+ `对象`会优先调用`valueOf`, 转为基本类型, 没有valueOf, 则调用`toString`

#### &&和||操作符
+ `&&`和`||`都是返回`左右两个操作数中的一个`:
+ `&&`: 返回`第一个遇到`的`可转为false`的值, 否则返回最后一个值; 
+ `||`: 返回`第一个遇到`的`可转为true`的值, 否则返回最后一个值; 

#### ES6符号类型
+ 允许`从符号到字符串`的显示强制类型转换, 但`隐式类型转换会报错`
+ 可以被强制类型转换为布尔值, 无论显示/隐式, `结果都是true`
```JavaScript
// ES6符号类型
const symbolValue = Symbol('symbol');
console.log(String(symbolValue)); // Symbol(symbol)
console.log(symbolValue + ""); // TypeError
```

#### 相等(`==`)和全等(`===`)
+ `错误`的论述: `==`检查值相等, `===`检查值和类型同时相等
+ `正确`的论述: `==`允许比较中进行强制类型转换, `===`不允许
+ 字符串和数字: 将字符串转为数字后进行比较
+ 其他类型和布尔值: 将布尔值转为数值, 再进行下一步转换或比较
+ `null`和`undefined`: `null == undefined`返回`true`
+ 对象和非对象: 对象会按照`valueOf`/`toString`的顺序转换为基本类型, 再进行下一步转换或比较
+ 对象之间的比较, 不进行类型转换, 同一个引用则相等, 不同的对象一律不相等

#### 抽象关系比较: > 和 <
+ 比较双方都是字符串: 按字母顺序比较
+ 其他: 按照`valueOf`/`toString`转为基本类型，如果有非字符串，则强制转为数字比较。
+ `重点`: `(a >= b)`会被处理为`!(b < a)`
```JavaScript
// 抽象关系比较
const a1 = [42];
const b1 = ["43"];
console.log(a1 < b1); // true

const a2 = ["42"];
const b2 = ["043"];
console.log(a2 < b2); // false

const a3 = { b: 42 };
const b3 = { b: 43 };
console.log(a3 < b3); // false
console.log(a3 > b3); // false
console.log(a3 == b3); // false 对象之间的比较
console.log(a3.toString() == b3.toString()); // true
console.log(a3 <= b3); // true
console.log(a3 >= b3); // true
// 上面这个例子的解析:
// (a3 >= b3)会被处理为!(b3 < a3), 因此a3 >= b3结果为true
// (a3 <= b3)同理
```

#### 解析和转换的区别
+ 解析: 如`parseInt()`等, 允许参数中有非数字字符, `parseInt('123px')`返回123
+ 转换: 如`Number()`, 不允许参数中有非数字字符, `Number('123px')`返回NaN

#### JSON
+ 对象中定义了`toJSON()`方法, `JSON.stringify()`方法则会先调用它
```JavaScript
// toJSON()方法会被JSON.stringify()调用
// toJSON()应该返回安全的JSON值
const objectValue = {
    a: 2,
    b: function () { },
    toJSON() {
        return { index: 123 }
    }
}
JSON.stringify(objectValue); // { "index": 123 }
```
+ `安全的JSON值`: 能够呈现为有效的JSON格式的值
+ `不安全的JSON值`: 
  - `undefined`
  - `function`
  - `symbol`
  - 包含循环引用的对象
+ `JSON.stringify()`方法在遇到不安全JSON值时会忽略, 而在数组中则会返回`null`
```JavaScript
// 不安全的JSON值
JSON.stringify(undefined); // undefined
JSON.stringify(function () { }); // undefined
JSON.stringify([1, undefined, function () { }, 4]); // [1, null, null, 4]
JSON.stringify({ a: 2, b: function () { } }); // { a: 2 }
```
+ `JSON.stringify()`的第2, 3个参数
```JavaScript
// JSON.stringify()的第二个参数replacer, 指定需要处理的属性
// 1. 如果replacer是数组, 则必须是字符串数组
const objectValue2 = {
    a: 123,
    b: "123",
    d: [1, 2, 3]
}
JSON.stringify(objectValue2, ["a", "b"]); // {"a":123,"b":"123"} d属性被忽略了

// 2. 如果replacer是函数, 函数会在对象本身, 及对象每个属性上调用
JSON.stringify(objectValue2, function (k, v) {
    if (k !== 'b') {
        return v;
    }
}); // {"a":123,"d":[1,2,3]} b属性被忽略掉了

// JSON.stringify()方法的第三个参数space, 指定缩进格式
JSON.stringify(objectValue2, null, 3); // 缩进为3个空格, 逐级递增
JSON.stringify(objectValue2, null, '----'); // 缩进为'----', 逐级递增
```
+ `JSON.stringify()`和`!!`的结合
```JavaScript
// !!的使用, 结合JSON.stringify()
const arrayValue = [
    1,
    function () { },
    2,
    function () { }
];
JSON.stringify(arrayValue); // [1, null, 2, null]
JSON.stringify(arrayValue, function (k, v) {
    if (typeof v === 'function') {
        return !!v;
    } else {
        return v;
    }
}); // [1, true, 2, true]
```


#### 杂例汇总
+ 假值对象
```JavaScript
// 假值对象
const booleanObjectA = new Boolean(false);
const booleanObjectB = new Boolean(0);
const booleanObjectC = new Boolean("");
Boolean(booleanObjectA && booleanObjectB && booleanObjectC); // true
```
+ `parseInt()`
```JavaScript
// parseInt在ES5之前的bug, 默认会采用参数第一个字符作为进制解析基底
// 假设解析时间, 当时是08点
parseInt('08'); // ES5之前会按照8进制解析, 最终得到0
// ES5之后parseInt修改为默认采用10进制, 除非指定第二个参数

// parseInt()接收非字符串参数
parseInt(1 / 0, 19); // 18
// 等同于
parseInt(Infinity, 19);

// parseInt会将第一个参数转为字符串, 又等价于
parseInt('Infinity', 19); // 第一个字母I在19进制中表示18, 第二个字母n无法转换, 停止

// 加深印象2
parseInt(false, 16); // 250 false转为字符串为"false", fa
parseInt(parseInt, 16); // 15 parseInt转为字符串为"function ...", 第一个字母f
```
+ `+`运算符
```JavaScript
// +运算符, 对象会优先调用valueOf方法, 无法得到基本类型时, 再调用toString方法
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
console.log(objectA + objectB); // 转换为 21 + '42', 结果为'2142'

// + 运算符2
const arrayA = [1, 2];
const arrayB = [3, 4];
console.log(arrayA + arrayB); // 转换为 '1,2' + '3,4', 结果为1,23,4

// + 运算符3
console.log([] + {}); // 转为 "" + "[object Object]", 结果为[object, Object]

// 通过 a + "" 将a转为字符串, 结果可能和String(a)不同
// 如果a是对象, 会先调用valueOf方法转成基本类型, 再转为字符串
// String()会直接调用toString转为字符串
const objectC = {
    valueOf() {
        return 42;
    },
    toString() {
        return '4';
    }
}
console.log(objectC + ""); // 42
console.log(String(objectC)); // 4
```
+ `-`运算符
```JavaScript
// -运算符
console.log('3.14' - '0'); // 3.14
console.log([3] - [1]); // 2
console.log({} - {}); // NaN

// -运算符2
const objectValue5 = {
    valueOf() {
        return 21;
    },
    toString() {
        return '10';
    }
}
const objectValue6 = {
    valueOf() {
        return 42;
    },
    toString() {
         return '5';
    }
}
console.log(objectValue5 - objectValue6); // -21
```
+ 一些汇总的类型转换的例子
```JavaScript
// 一些汇总的类型转换的例子
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

****
**[返回主目录](../readme.md)**
