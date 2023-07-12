# JavaScript 值类型

**[返回主目录](../readme.md)**

#### JavaScript值类型
+ `delete`删除数组元素`不会更改`数组长度, 其值会变为`undefined`
+ `字符串不可变`: 成员函数`不会改变原始值`, 而是创建并返回新的字符串
```JavaScript
// 字符串可以借用数组的非变更方法来处理字符串
const myString = "zhangzhen";
const resultString = Array.prototype.map.call(myString, (char) => {
    return char.toUpperCase() + '-';
}); // Z-H-A-N-G-Z-H-E-N-
//上述操作没什么意义, 最合适的办法 
const resultString2 = myString.split('').map(char => `${char.toUpperCase()}-`).join("");
```
+ 字符串反转
```JavaScript
// 字符串反转的方法
// 注意: 对于复杂字符串并不适用(Unicode字符, 星号, 多字节字符等)!!!
const reverseString = myString.split('').reverse().join('');
```
+ JavaScript`没有真正意义上的整数`, 没有小数部分, 或者小数部分都为0的十进制数都被视为整数
+ JavaScript数字类型采用`IEEE 754`标准, 也被称为浮点数, JavaScript使用`双精度`, 即64位二进制
```JavaScript
// 小数点会被优先识别为数字字面量的一部分
// 因此 123.toString() 会抛出错误, 以下是正确的用法
(123).toString();
123..toString();
123 .toString(); // 数字后有一个空格

// 由于精度的问题, 0.1 + 0.2 === 0.3 会返回false
// 判断方法1: 给定一个允许的精度范围, Number.EPSILON
function checkNumberEqual(num1, num2) {
    return Math.abs(num1 - num2) < Number.EPSILON;
}
console.log(checkNumberEqual(0.1 + 0.2, 0.3)); // true
```
+ `Number.EPSILON`: 机器精度, 其值通常为`Math.pow(2, -52)`;
+ JavaScript能够呈现的`最大浮点数`, 1.798E+308, 保存在`Number.MAX_VALUE`中
+ JavaScript能够呈现的`最小浮点数`, 5E-324, 保存在`Number.MIN_VALUE`中, 不是负数, 无限接近0
```JavaScript
// JavaScript数学运算如果超过处理范围, 采用"就近取整"
const numberA = Number.MAX_VALUE; // 1.7976931348623157e+308
numberA + numberA; // Infinity;
numberA + Math.pow(2, 970); // Infinity 更接近Infinity
numberA + Math.pow(2, 969); // 1.7976931348623157e+308 更接近Number.MAX_VALUE
```
+ JavaScript能够"`安全`"呈现的最大/最小整数:
  - `Number.MAX_SAFE_INTEGER`
  - `Number.MIN_SAFE_INTEGER`
+ 32位有符号整数, 某些数字操作只支持32位数字, 通过 `number | 0`, 可将数值转换为`32位有符号整数`
+ `window.isNaN()` 有缺陷, 尽量使用`Number.isNaN()`方法
```JavaScript
// NaN是唯一一个与自身不相等的数值
typeof NaN; // 'number'
NaN !== NaN; // true

// window.isNaN()的缺陷: 检查方式过于死板, 结果不准确, 尽量使用Number.isNaN()
const num1 = 2 / 'zhangzhen';
const num2 = 'zhangzhen';
console.log(window.isNaN(num1)); // true
console.log(window.isNaN(num2)); // true
console.log(Number.isNaN(num1)); // true
console.log(Number.isNaN(num2)); // false
```
+ 加减法操作`不会得到`负零(`-0`)
+ `-0`转为字符串的结果为`'0'`
+ 但将`'-0'`字符串转为数值, 则是`-0`
```JavaScript
// 0和-0直接比较无法区分
console.log(0 == -0); // true
console.log(0 === -0); // true

// 区分0和-0的方法一
function isNegetiveZero(num) {
    return typeof num === 'number'
        && num === 0
        && (1 / num) === -Infinity
}

// 区分0和-0的方法二: Object.is(), 判断两个值是否绝对相等
Object.is(0, -0); // false
```

#### 补充小知识: void
```JavaScript
// void运算符, 让表达式没有返回值, 但不改变表达式的结果
const aNumber = 42;
console.log(void aNumber, aNumber); // undefined, 42
// 很多函数当不需要返回值的时候, 会单独使用return, 这和void类似
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

****
**[返回主目录](../readme.md)**