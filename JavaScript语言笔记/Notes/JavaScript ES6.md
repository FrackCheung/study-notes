# JavaScript ES6

**[返回主目录](../readme.md)**

#### 解构赋值

+ 解构赋值的几种情况: `对象解构`, `默认赋值`, `函数参数解构`
+ 对象结构
```JavaScript
// 对象的两种解构赋值
function objectDestructing1() {
    return { a: 1, b: 2, c: 3 }
}
const { a, b, c } = objectDestructing1();
console.log(a, b, c); // 1 2 3
const { a: valueA, b: valueB, c: valueC } = objectDestructing1();
console.log(valueA, valueB, valueC); // 1 2 3
```
+ 默认赋值
```JavaScript
// 解构中的默认赋值
function objectDestructing2() {
    return { key1: 1, key2: 2 }
}
const { key1 = 10, key2 = 20, key3 = 30 } = objectDestructing2();
console.log(key1, key2, key3); // 1 2 30
// 没有给默认值的情况下, 多出来的值都为undefined
function objectDestructing3() {
    return [1, 2]
}
const [value1 = 10, value2 = 20, value3 = 30] = objectDestructing3();
console.log(value1, value2, value3); // 1 2 30
```
+ 函数参数解构
```JavaScript
// 函数参数解构
const functionParameter = {
    name: 'zhangzhen',
    age: 28
}
function functionDestructing({ name, age }) {
    console.log(name, age);
}
functionDestructing(functionParameter); // zhangzhen 28
```

#### 非class中的super
+ `super`只允许出现在`简洁`方法中
```JavaScript
// 非class中的super使用
const superObject1 = {
    log() {
        console.log('output from superObject1');
    }
};
const superObject2 = {
    // 如果是log: function() {...则不能使用super
    log() {
        super.log(); // super只能出现在简洁方法中
        console.log('output from superObject2');
    }
}
Object.setPrototypeOf(superObject2, superObject1);
superObject2.log();
// output from superObject1
// output from superObject2
```

#### 标签函数
+ 标签函数: 第一个参数是以`插入值`分割的模板数组, 后续参数是`插入值`
+ 原始字符串: 
  - 原始字符串保留了原始的`转义码`, 如\n等等
  - 标签函数第一个参数有一个`raw`属性, 保留了字符串模板数组每一项的`原始版本`
  - 也可通过`String.raw()`获取原始字符串, 这样获取的结果是一个字符串
```JavaScript
// 标签函数, 可以对模板字符串进行一些自定义的处理操作
function labelFunction(strings, ...values) {
    console.log(strings);
    console.log(values);
    console.log(strings.raw); // 输出原始模板字符串数组
    console.log(String.raw(strings)); // 输出原始字符串
}
const myName = 'zhangzhen';
const myAge = 28;
labelFunction`My name is ${myName}, \nI\`m ${myAge} years old!`;
// [ 'My name is ', ', I`m ', ' years old!' ]
// [ 'zhangzhen', 28 ]
// [ 'My name is ', ', \\nI\\`m ', ' years old!' ]
// My name is , \nI\`m  years old!
```

#### 箭头函数
+ 箭头函数没有自己的`this`, 它是从包围的作用域中词法`继承而来`的`this`
+ 箭头函数没有自己的`arguments`数组, 而是继承自父层
+ 箭头函数的`super`和`new.target`也是继承自父层
```JavaScript
// 箭头函数
const arrowFunctionObject = {
    method1: () => {
        console.log(123);
    },
    method2: () => {
        this.method1(); // 无法调用到method1
    }
}
```
#### for...of循环
+ 可使用`for...of`的目标
  - `Arrays`
  - `Strings`
  - `Generators`
  - `Collections`
  - `TypedArrays`
+ `for...of`中的迭代值可以是`声明`, 也可以是`赋值`
```JavaScript
// for...of中的声明和赋值
const forOfArrays = [
    { x: 1 },
    { x: 2 },
    { x: 3 }
];
const emptyObject = {};
// 声明
for (const item of forOfArrays) {
    console.log(item);
    // { x: 1 }
    // { x: 2 }
    // { x: 3 }
}
// 赋值
for ({ x: emptyObject.a } of forOfArrays) {
    console.log(emptyObject.a);
    // 1
    // 2
    // 3
}
```

#### Symbol
+ `symbol`用于创建一个`类字符串`的, 且不会与其他任何值冲突的值 
+ `symbol`没有字面量形式
+ 使用`const sym = Symbol(...)`创建, 不能使用new
+ 传给Symbol()的参数是`可选`的, 仅仅是为了友好阅读而设置的描述文本
+ `symbol`不是对象, 也不是`Symbol`的实例
```JavaScript
// Symbol
const sym = Symbol('some description');
console.log(sym.toString()); // Symbol(some description)
console.log(sym instanceof Symbol); // false
console.log(Object(sym) instanceof Symbol); // true
```
+ `Symbol.for(...)`: 在全局符号注册表搜索, 若有相同文字描述的直接返回, 若无则创建一个并返回
+ `Symbol.keyFor(...)`: 通过存储的符号值, 查询其描述文本, `和Symbol.for()搭配使用`
```JavaScript
// Symbol.for()
const symbolKey = Symbol.for('Unique.Key');
const symbolObject = {};
symbolObject[symbolKey] = "Some Information";
// 覆盖
symbolObject[symbolKey] = "Another Information"; // 方法1
symbolObject[Symbol.for('Unique.key')] = "Another Information"; // 方法2

// Symbol.keyFor()
const symbolValue = Symbol.for('This is a description.');
const description = Symbol.keyFor(symbolValue);
console.log(description); // This is a description.
const symbolValue2 = Symbol.for(description);
console.log(symbolValue === symbolValue2); // true
```
+ 符号不出现在一般属性枚举中, 要使用`getOwnPropertySymbols()`获取
```JavaScript
// 对象属性符号
const objectKeySymbol = {
    key1: 10,
    [Symbol('description')]: 'Hello World',
    key2: 20
};
console.log(Object.getOwnPropertyNames(objectKeySymbol));
// [ 'key1', 'key2' ]
console.log(Object.getOwnPropertySymbols(objectKeySymbol));
// [ Symbol(description) ]
```
+ 内置符号: `Symbol.iterator`等
```JavaScript
// 内置符号
const internalSymbol = [1, 2, 3];
const internalIterator = internalSymbol[Symbol.iterator]();
internalIterator.next(); // { value: 1, done: false }
```

#### 迭代器和生成器
+ 迭代器: 基本字符串也可以迭代, 因为引用包装类型的存在
```JavaScript
// 基本字符串的迭代
const iteratorString = 'zhangzhen';
const stringIterator = iteratorString[Symbol.iterator]();
console.log(stringIterator.next()); // { value: 'z', done: false }
```
+ 生成器: 
  - 生成器的每一次调用都会返回一个全新的迭代器, 互不相干
  - 生成器的`try...catch`错误处理可以由内向外, 也可以由外向内
```JavaScript
// 生成器try...catch的由内向外和由外向内
function* errorHandleGenerator() {
    try {
        yield 1;
    } catch (err) {
        console.log(err);
    }
    yield 2;
    throw 'Hellow';
}
const errorHandleIterator = errorHandleGenerator();
errorHandleIterator.next();
try {
    errorHandleIterator.throw('Hi!');
    errorHandleIterator.next();
    console.log('这里的代码永远执行不到');
} catch (err) {
    console.log(err);
}
```
+ 迭代器的斐波那契数列
```JavaScript
// 自定义迭代器来返回斐波那契数列
const FibonaciQueue = {
    [Symbol.iterator]() {
        let n1 = 1, n2 = 1;
        return {
            [Symbol.iterator]() { return this; },
            next() {
                let current = n2;
                n2 = n1;
                n1 = n1 + current;
                return { value: current, done: false };
            },
            return(v) {
                console.log('Abandoned!');
                return { value: v, done: true };
            }
        }
    }
}
```
+ 生成器委托:
  - 用法: `yield`
  - 把生成器控制委托给一个`iterator`, 直到耗尽
```JavaScript
// 生成器委托
function* generatorEntrust() {
    yield* [1, 2, 3];
}
// 这相当于
function* generatorEntrust2() {
    yield 1;
    yield 2;
    yield 3;
}
```
+ 生成器递归
```JavaScript
// 小测验, 生成器递归
function* generatorRecurse(x) {
    if (x < 3) {
        x = yield* generatorRecurse(x + 1);
    }
    return x2;
}
generatorRecurse(1); // 24
```
  
**[返回主目录](../readme.md)**
