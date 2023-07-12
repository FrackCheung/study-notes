# JavaScript 数据类型

**[返回主目录](../readme.md)**

#### 内置类型
+ JavaScript`内置类型`: 
  - `null`
  - `undefined`
  - `boolean`
  - `string`
  - `number`
  - `object`
  - `symbol`
```JavaScript
// typeof针对函数会返回function, 但function不是JavaScript内置类型
function myFunction1() { }
console.log(typeof myFunction1); // "function"
```
+ 除`object`类型以外, 其余六种被称为`基本类型`
+ 有以下6种类型, `typeof`运算符结果与其一致: 
  -`undefined`
  `boolean`
  `string`
  `number`
  `object`
  `symbol`
```JavaScript
// 函数也是对象, 也可以定义属性, 函数的length属性代表参数个数
function myFunction2(arg1, arg2, arg3) { }
console.log(myFunction2.length); // 3

function myFunction3(...args) { }
console.log(myFunction3.length); // 0
```
+ `typeof null`会返回`object`
```JavaScript
// 检测一个值的类型是否为null
const nullValue = null;
console.log(nullValue === null);
console.log(!nullValue && typeof nullValue === 'object');
```

#### 变量没有类型
+ JavaScript`变量没有类型`, 只有`值才有类型`, 变量可以持有任何类型的值

#### typeof的安全防范机制
+ 引用未声明变量的值, 会抛出`ReferenceError`
+ `typeof`计算未声明的变量, 会返回`undefined`
+ **注意**: 如果通过`点语法`获取对象属性, 即使不存在, 也返回`undefined`, 而不是`ReferenceError`
```JavaScript
// typeof安全防范机制
console.log(aNotDefinedValue); // ReferenceError
typeof aNotDefinedValue; // "undefined"

// typeof安全防范机制的应用
// 假设全局变量DEBUG还未加载, 则以下判断代码会抛出ReferenceError
if (DEBUG) { /** */ }
// 使用typeof就不会出现异常
if (typeof DEBUG !== 'undefined') { /** */ }
// 方法二: 通过点语法读取全局变量属性, 也不会报错
if ((window || global).DEBUG) { /** */ }
// 如果不是全局变量, 则使用typeof运算符更加合适
```

****
**[返回主目录](../readme.md)**