# JavaScript 原生函数

**[返回主目录](../readme.md)**

#### 内置原生函数
+ `String`
+ `Number`
+ `Boolean`
+ `Array`
+ `Object`
+ `Function`
+ `RegExp`
+ `Date`
+ `Error`
+ `Symbol`
```JavaScript
// 通过new构造函数创建出来的是对象, 而非基本类型
const aString = new String('Hello');
typeof aString; // 'object'
aString instanceof String; // true
Object.prototype.toString.call(aString); // "[object String]"
```

#### 原生函数的一些知识点
+ 所有`typeof`返回值为`object`的对象, 内部都包含一个`[[class]]`属性
+ `[[class]]`属性`无法直接访问`, 可以通过`Object.prototype.toString`查看, 通常情况下, 查看结果和原生构造函数是相对应的, 例外的情况见下方示例代码
```JavaScript
// [[class]]属性和原生对象构造函数通常是相对应的
Object.prototype.toString.call([1, 2, 3]); // "[object Array]"
Object.prototype.toString.call(function () { }); // "[object Function]"
Object.prototype.toString.call(/^[a-zA-Z0-9]+$/); // "[object RegExp]"
// 例外的是null和undefined, 这两个并不是原生构造函数
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
// Object.prototype.toString.call()中传入的原始值会被转为对象(引用包装)
Object.prototype.toString.call(123); // "[object Number]"
```
+ 封装对象的坑: `Boolean`, 见下方代码

```JavaScript
// new Boolean的坑, new的结果是一个对象!!
const booleanA = new Boolean(false);
const booleanB = new Boolean("");
const booleanC = new Boolean(null);
const booleanD = new Boolean(undefined);
const booleanE = new Boolean(NaN);
const booleanF = new Boolean([]);
const booleanG = new Boolean({});
const booleanH = new Boolean(0);
// 以上结果放在if语句中是无法达到效果的!!!
if (!booleanA) {
    // 这里的代码永远执行不到
}
// 如要执行布尔类型转换, 直接使用Boolean(), 而非new Boolean();
const booleanI = Boolean(false);
const booleanJ = Boolean("");
const booleanK = Boolean(null);
const booleanL = Boolean(undefined);
const booleanM = Boolean(NaN);
const booleanN = Boolean([]);
const booleanO = Boolean({});
const booleanP = Boolean(0);
```
+ 如果要得到使用`new构造函数`创建的`封装对象中的值`, 可以使用`valueOf()`方法
```JavaScript
// 使用valueOf方法获取封装对象的值
const stringObject = new String('Hello');
console.log(stringObject.valueOf()); // 'Hello'
```
+ `Array()`和`new Array()`的效果是`一样`的, 要注意只传入一个参数的情况
```JavaScript
// Array构造函数只传入一个参数会被视为数组的预设长度
const array = new Array(3);
console.log(array.length); // 3
```
+ 数组中`手动赋值的undefined`, 和`空槽位`是`不一样`的

```JavaScript
// 数组中手动赋值的undefined, 和因改变length, delete等造成的空单元是不一样的
const emptyArray1 = new Array(3); // [ <3 empty items> ]

const emptyArray2 = [];
emptyArray2.length = 3; // [ <3 empty items> ]

const emptyArray3 = [undefined, undefined, undefined]; 
// [ undefined, undefined, undefined ]

// emptyArray1和emptyArray2是一样的
// 部分数组方法会有不一样的结果
emptyArray2.map((_, index) => index); 
// [ <3 empty items> ] 数组没有元素, map无从遍历

emptyArray3.map((_, index) => index);
// [0, 1, 2] 数组有三个元素, 值都为undefined

emptyArray2.join('-'); // '--'
emptyArray3.join('-'); // '--' join()方法结果一样!!!
```
+ 永远不要创建和使用`空槽位数组`
```JavaScript
// 创建包含undefined值的数组(不是空单元!)
// apply接受的第二个参数是数组或类数组对象, 这里的{legnth: 3}就是类数组对象
// apply内部循环处理类数组对象, 其结果与Array(undefined, undefined, undefined)是一样的
const undefindArray = Array.apply(null, { length: 3 });
console.log(undefindArray); // [undefined, undefined, undefined]
```
+ `Date类型`, 使用`new`调用会创建日期对象, 不用`new`则会得到当前日期的字符串值
+ `Symbol`构造函数`不能使用new`操作符, 否则会出错
```JavaScript
// Symbol()用于创建具有唯一性的特殊值, 该值无法查看和访问
const symbolValue = Symbol('symbolTag');
console.log(symbolValue); // Symbol(symbolTag)
console.log(symbolValue.toString()); // Symbol(symbolTag)
typeof symbolValue; // symbol
const symbolObject = {};
symbolObject[symbolValue] = 'zhangzhen';
Object.getOwnPropertySymbols(symbolObject); // [ Symbol(symbolTag) ]

// ES6预定义符号, 以Symbol静态属性出现, 可以直接使用
symbolObject[Symbol.iterator] = function () { /** */ };
```

#### 一些奇怪的行为
```JavaScript
// 奇怪的行为
typeof Function.prototype; // function 空函数
RegExp.prototype.toString(); // "/(?:)/" 空正则表达式
Array.isArray(Array.prototype); // true 空数组
```

****
**[返回主目录](../readme.md)**