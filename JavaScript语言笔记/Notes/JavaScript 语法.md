# JavaScript 语法

**[返回主目录](../readme.md)**

#### 前言
+ 语句都有一个`结果值`, 可以在`F12`的控制台直接输入语句, 查看结果值
+ 语句的结果值和`console.log()`的`输出结果`完全不是一回事
+ 示例代码若无详细说明, 均指在`F12`控制台直接输入的语句, 而非`console.log()`

#### 规范定义
+ `var`的声明语句, 结果值为`undefined`
```JavaScript
// 声明语句结果值为undefined
var varSentence = 123; // undefined
```
+ `{...}`代码块的结果值为块中`最后一个`语句/表达式的值
```JavaScript
// 代码块结果值为块中最后一个语句/表达式的值
if (true) {
    blockValue = 4 + 38;
} // 42
```
+ 语句结果值`不允许`赋值给其他变量: 
  - `a = if (true) { b = 3 + 38; }` 不可以这么做
+ 要获取语句的结果值, 可以使用`eval()`, 但不推荐这么玩
```JavaScript
// 使用eval()获取语句结果值
var evalExpression = eval('if (true) { b = 4 + 38; }'); // 42
```
+ `do {...}` 语句执行一个代码块, 并返回其中最后一个语句的结果值(`ES7规范`)
```JavaScript
// do {...}语句(ES7规范, 还未实现)
var a = do {if (true) { b = 3 + 38; }}; // 42
```
+ `delete`运算符的结果值, 操作成功返回`true`, 操作失败返回`false`, 操作成功指的是:
  - 删除不存在的属性
  - 删除存在且可配置的属性
```JavaScript
// delete运算符结果值
const deleteObject = {
    a: 123
}
Object.defineProperty(deleteObject, 'b', {
    value: 123,
    writable: false,
    enumerable: false,
    configurable: false
});
delete deleteObject.a; // true 存在且可配置的属性
delete deleteObject.b; // false 存在不可配置的属性
delete deleteObject.c; // true 不存在的属性
```
+ `逗号`运算符, 返回最后一个表达式的值
```JavaScript
// 逗号运算符结果值
negetiveValue2 = negetiveValue++; // 42
negetiveValue2 = (negetiveValue++, negetiveValue); // 43
```
+ `=`运算符, 在非声明语句中, 结果值为所赋的值
```JavaScript
// =运算符结果值
var equalValue = 42; // undefined
equalValue = 43; // 43
```

#### 表达式副作用
+ 使用后值会变化, `++a++`这种会抛出`ReferenceError`错误

```JavaScript
    // 表达式的副作用
    var negetiveValue = 42;
    var negetiveValue2 = negetiveValue++; // 使用negetiveValue后值发生变化
```

#### 链式赋值的坑
+ `var a = b = c = 42;`, 这么做不可以, `b`, `c`严格模式下回抛出错误
+ `var a, b, c; a = b = c = 42;`, 这样可以

####  上下文规则
+ 同样的语法在不同情况下会有不同解释, 如`{...}`
+ 大括号`{...}`
```JavaScript
// 大括号的不同语境下的解释
const phraseObject = {
    keyValue: function() {}
} // 前面有赋值, 这里的大括号是一个对象字面量

{
    keyValue: function method() {}
} // 单独的大括号, 这里是代码块, 其中的keyValue是标签语句的标识
```
+ 代码块`{...}`
  - `[] + {}`的结果和`{} + []`的结果是不一样的, 见下文示例
```JavaScript
// 代码块结果值
[] + {}; // [object Object]
{} + []; // 0
console.log({} + []); // [object Object]
// 解析, 没有console.log()语句时, 考虑的是表达式结果值
// 第一行代码: 类型转换, []转换为"", {}转换为"[object Object]"
// 第二行代码: {}被当成单独代码块, 不参与运算, +[]进行数值类型转换, 结果为0
// 第三行代码: 加入console.log(), 就不再是表达式结果值了, 情况完全不一样
```
+ 对象解构`{...}`
  - `const obj = { a: 123, b:223 };`
  - `const { a, b } = obj;`
+ JavaScript语句中没有`else...if`语句
+ ` if...else`在只有单条语句的时候可以省略`{...}`

#### 运算符优先级(部分)
+ `&&`和`||`和`?...:`的优先级: `&&`> `||` > `?...:`
+ 逗号`,`运算符的优先级`最低`
+ `关联`和`执行顺序`不是一回事, 左右关联可能会造成结果的不同, 见下文示例  
  - `&&`和`||`是`左关联`, 但结果不变, 即`(a && b) && c和a && (b && c)`的结果一样
  - `?...:`是`右关联`, 如果变成左关联, 结果可能会变  
  - `=`是右关联
+ 关联决定了多种相同运算符的组合顺序, 但执行顺序依然是从左到右
```JavaScript
// 执行顺序和关联性
$a && $b && $c; // 因为左关联, 会被解析为($a && $b) && &c
$a ? $b : $c ? $d : $e; // 因为右关联, 会被解析为$a ? $b : ( $c ? $d : $e )
// 示例
true ? false : true ? true : true; // 真实结果为false
// 左关联: ( true ? false : true ) ? true : true 结果为true
// 右关联: true ? false : ( true ? true : true ) 结果为false
var $a, $b, $c;
$a = $b = $c = 42; // 右关联: $a = ($b = ($c = 42));

// 关联性的综合示例
var $$a = 42;
var $$b = "foo";
var $$c = false;
var $$d = $$a && $$b || $$c ? $$c || $$b ? $$a : $$c && $$b : $$a; // 42

// 解析
// 第一步: 解析(?...:), 将表达式变为
// ( $$a && $$b || $$c ) ? ( $$c || $$b ? $$a : $$c && $$b ) : $$a
// 第二步: 解析&&和||, 将表达式变为
// (($$a && $$b) || $$c ) ? (($$c || $$b) ? $$a : ($$c && $$b)) : $$a
// 替换值
// ((42 && "foo") || false ) ? ((false || "foo") ? 42 : (false && "foo")) : 42
// "foo" ? ("foo" ? 42 : false) : 42
// "foo" ? 42 : 42
// 42
```

####  arguments参数数组
+ `非严格模式`下, `arguments`数组会与函数参数的变化`建立关联`, `同步变化`
+ `严格模式`下, `arguments`数组和传入的参数`不会建立关联`, 函数体内参数重新赋值, `arguments不变`
+ 如果函数没有传入参数, 也不会建立关联
+ `不要同时访问`命名参数和其对应的`arguments`数组单元
+ arguments已被废弃, `不建议再使用`
```JavaScript
// arguments数组
function argumentsArray(a) {
    a = 3;
    console.log(arguments[0]);
}
argumentsArray(2); // 3

function argumentsArray2(a) {
    "use strict"
    a = 3;
    console.log(arguments[0]);
}
argumentsArray2(2); // 2
```

#### try...catch...finally
+ 代码的执行顺序, `try {} > catch {} > finally {}`
+ `try`中`有return`, 见下方示例代码
+ `try`中如果`有throw`抛出错误的语句, 其执行顺序`和第2点相同`
+ 如果`finally`的代码出现错误, 则函数在此终止, `try`中的`return`会被丢弃
+ `finally`中的`return`会覆盖`try`或者`catch`中的`return`, 没有则不覆盖
```JavaScript
// try中有return
function tryCatch() {
    try {
        return 123;
    } finally {
        console.log(666);
    }
    console.log(999); // 这行代码不会被执行
}
console.log(tryCatch()); // 先打印出666, 再打印出返回值123;
// 666
// 123

// return 123先执行, 函数返回值被设置为123, 
// 但是try...finally还未执行完, 所以会继续执行finally中的代码
// 即console.log(语句)
// finally代码执行完毕, 函数也执行完毕, 将返回值返回, 返回123

// finally中有错误
function tryCatch2() {
    try {
        return 123;
    } finally {
        throw new TypeError('');
    }
}
console.log(tryCatch2()); // TypeError, try中的return 123会被丢弃

// try中有continue
for(let i = 0; i < 10; i++) {
    try {
        continue;
    } finally {
        console.log(i);
    }
} // 0,1,2,3,4,5,6,7,8,9

// finally中的return覆盖
function tryCatch3() {
    try {
        return 123;
    } finally {
        return 666;
    }
}
console.log(tryCatch3()); // 666

// finally中的break, 带标签
function tryCatch4() {
    label: {
        try {
            return 123;
        } finally {
            break label;
        }
    }
    console.log(666);
    return 999;
}
    console.log(tryCatch4());
    // 666
    // 999
```

#### break label
+ 结束执行`label`标签处的代码块, 而不是跳转到`label`代码块继续执行

#### switch...case
+ 默认情况下, `case`采用全等`===`进行匹配判断
+ 如需进行类型转换的`==`匹配, 需要做额外处理, 见下文示例
+ `case`可以是表达式, 会将表达式的值和`switch`中的值进行比较(使用`===`严格比较)
+ `default`中如果没有`break`; 后面的代码依然会执行

```JavaScript
// switch...case相等比较
let a = "42";
switch(true) {
    case a == 10:
        console.log(`10 or "10"`);
        break;
    case a == 42:
        console.log(`42 or "42"`);
    default:
        break; // 这里的代码其实永远执行不到
}

// case中的表达式
let caeseA = "Hello World";
let caeseB = 10;

switch(true) {
    // ||返回两个值中的一个, 这里返回的是"Hello World"
    case (a || b == 10):
        // 这里的代码永远不会执行
        break;
    default:
        break;
}

// default中没有break
let defaultA = 10;
switch(defaultA) {
    case 10:
        console.log(10);
    default:
        console.log(123);
    case 10:
        console.log(10);
        break;
}
// 10
// 123
// 10
```

****
**[返回主目录](../readme.md)**