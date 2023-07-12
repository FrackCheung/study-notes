# JavaScript 异步与性能

**[返回主目录](../readme.md)**

#### 异步编程
+ 异步编程的`核心`: 程序中`现在`运行的部分和`将来`运行的部分之间的`关系`
+ `console.log`的小坑: 部分开发工具可能会`异步处理`I/O, 提升性能, 因而可能得不到正确的结果
```JavaScript
// console.log()的坑
let logValue = { index: 1 };
console.log(logValue); // 某些地方可能会输出 { index: 2 }
// 因为异步处理了console.log()
logValue.index++; // 最稳妥的方法是使用断点
```

#### JavaScript事件循环
+ `宿主环境提供`的处理程序中多个块的执行的机制, 执行每块时, 通知JavaScript引擎
+ JavaScript引擎`本身没有`时间的概念, 只是一个按需执行JavaScript任意代码的环境
+ JavaScript引擎`没有调度`代码执行的能力, 该能力总是由`宿主环境`执行
```JavaScript
// 事件循环的伪代码表示
let eventsLoop = []; // 队列
let certainEvent;
let always = true;
while (always) {
    // 每次执行被称为一个tick
    if (eventsLoop.length > 0) {
        certainEvent = eventsLoop.shift();
        try {
            certainEvent();
        } catch (err) {
            certainErrorHandler(err);
        }
    }
}
```
+ 事件循环的理解性代码
```JavaScript
// 事件循环示例(个人理解, 未来可能做修正)
function eventLoopA() {
    console.log(1);
}
function eventLoopB(callback) {
    console.log(2);
    setTimeout(callback, 0);
}
function eventLoopC() {
    console.log(3);
}
eventLoopB(eventLoopC);
eventLoopA();
// 事件循环队列(只看最后两行运行的代码)
// 1. console.log(2);
// 2. setTimeout(console.log(3), 0); --> 将console.log推到事件循环末尾
// 3. console.log(1);
// 4. ...其他排队的事件

// 最后的执行顺序是:
// 5. console.log(2)
// 6. console.log(1);
// 7. ...其他排队的事件
// 8. console.log(3); --> 被setTimeout推到事件循环末尾
```

#### setTimeout(setInterval)
+ `setTimeout`并没将回调函数挂在事件循环中;
+ `setTimeout`设定了一个`定时器`, 到时后, 才会将回调推入事件循环;
+ 如果事件循环队列前已经有了其他函数, 则该回调函数会等待
+ 因此使用`setTimeout`的精度并不高, 它只能保证回调函数不会在设定时间之前运行
+ ES6精确制定了事件循环的工作细节, 从本质上改变了在哪里管理时间循环(后文讲述)

#### 并行线程
+ JavaScript是单线程, 从不跨线程共享数据, 不允许对共享内存并行访问和修改

#### 原子性
+ 完整运行(`原子性`): 一个函数开始执行, 其中的代码会先全部执行完毕后再执行后续代码
```JavaScript
// 完整运行(原子性)
function asyncMethod1() { /**... */ }
function asyncMethod2() { /**... */ }
$.ajax(url1, asyncMethod1);
$.ajax(url2, asyncMethod2);
// 要么asyncMethod1先执行, 要么asyncMethod2先执行
// 执行的两种结果是确定的, 唯一不确定的执行的顺序
// 但无论谁先执行, 都会完整执行完毕后才会执行下一个
// 如果JavaScript允许多线程, 情况就会复杂的多
```
#### 并发
+ 两个或多个"进程"(可以理解为任务或函数调用)`同时执行`就出现了并发
+ JavaScript`并不存在`真正严格的同时, 因为单线程事件循环, 可以理解为快速交替进行等
+ `非交互性`: 进程间没有相互影响, 谁先谁后都无所谓, 结果总是一样的
+ `交互性`: 由于竞态条件的存在, 可能会有隐式的影响, 可以使用协调交互顺序
```JavaScript
// 交互性并发
let ajaxResponse = [];
function pushAjaxResult(result) {
    ajaxResponse.push(result);
}
$.ajax(url1, pushAjaxResult);
$.ajax(url2, pushAjaxResult);
// 两个ajax进程相互会影响, 导致ajaxResponse中的元素顺序出现差异
```
+ 协调交互顺序
```JavaScript
// 协调交互顺序
let ajaxValueA, ajaxValueB;
function method1(x) { ajaxValueA = x * 2; log(); }
function method2(y) { ajaxValueA = y * 2; log(); }
function log() { console.log(ajaxValueA + ajaxValueB); }
$.ajax(url1, method1);
$.ajax(url2, method2);
// log()函数会过早执行, 得到预期之外的结果
// log()的第二次调用则结果正常, 两个ajax进程都已执行完毕
    
// 协调交互顺序的改进:
function differentMethod1(x) {
    ajaxValueA = x * 2;
    if (ajaxValueA && ajaxValueB) { // method2也加上这个判断
        log();
    }
}

// 现在不会引发异常, 两个都结束之后才会输出结果
// 门闩
let ajaxValue;
function method1(x) { ajaxValue = x * 2; if (!ajaxValue) log(); }
function method2(y) { ajaxValue = y / 2; if (!ajaxValue) log(); }
function log() { console.log(ajaxValue); }
$.ajax(url1, method1);
$.ajax(url2, method2);
// if判断的代码保证了最终method1和method2只会有一个被执行
```
+ `并发协作`: setTimeout(callback, 0)相当于把callback函数插入到当前事件循环队列的结尾处

#### 任务队列
+ 任务队列被`事件循环`所调度
+ 任务队列分为`宏任务队列`和`微任务队列`
+ Promise的异步特性就是建立在微任务队列之上的
***
这里只做基本概念介绍, 有关事件循环和任务队列详细的知识, 
请参阅[JavaScript 事件](./JavaScript%20%E4%BA%8B%E4%BB%B6.md)
***

#### 语句顺序
+ 代码中的`语句顺序`和JavaScript引擎的`执行顺序`并不一定要一致
+ 编译器语句重排

#### 回调
+ 回调函数`包裹`或者说`封装`了程序的`延续`(`Continuation`)
+ 回调地狱, 频繁的嵌套回调, 会使得代码变得异常复杂
```JavaScript
// 回调地狱, 假设有一个第三方库名为$, 以下代码也叫嵌套回调
$.listen('click', () => {
    setTimeout(() => {
        $.ajax(url, (response) => {
            hanlder(response);
        })
    }, 1000);
});
// 改写一下结构, 以下代码也叫链式回调
$.listen('click', clickHanlder);
function clickHanlder() {
    setTimeout(sendRequest, 1000);
}
function sendRequest() {
    $.ajax(url, responseHandler);
}
function responseHandler(response) {
    doSomething(response);
}
// 如果任何一个函数执行出错了怎么办? 
// 如果事先考虑到所有的路径和错误处理, 那代码也会变得非常复杂
```
+ 信任问题: `$.ajax(url, callback)`, 需要将`callback`交给`ajax`方法, 信任危机
```JavaScript
// 回调的信任问题
$.ajax = function (url, callback) {
    const response = sendAJAXRequest(url);
    for (let i = 0; i < 5; i++) {
        callback(response);
    }
}
$.ajax(url, (response) => {
    document.write(response); // 这行代码会执行5次, 浪费了性能!!
}); 
// 回调函数存在信任危机, 交给第三方是不安全的, 如果是敏感操作, 问题更大
```
+ 分离回调: 单独提供`成功`和`失败`的回调
```JavaScript
// 分离回调和Node风格回调
function successCallback() {/** */ }
function failureCallback() {/** */ }
$.ajax(url, successCallback, failureCallback);

const fs = require('fs');
fs.readFile(url, (err, doc) => {/** */ });
// 1. 这两种回调并没有解决信任问题
// 2. 成功和失败的回调也不能处理所有的可能情况, 可能同时得到成功或失败的结果
// 3. 还是要自己编写适应代码处理其他可能遇到的情况
```
+ `error-first`风格回调: 回调的第一个参数为`error`对象, 比如Node的大多数API
+ 回调的异步性是无法真正确认的, 请见示例代码, 永远要异步!!!
```JavaScript
// 回调异步性的不确定性
let callbackValue = 0;
function doSomething() {
    console.log(callbackValue);
}
$.ajax(url, doSomething);
callbackValue++;
// 假设我们不知道$.ajax方法的内部实现细节, 不知道它到底是同步还是异步
// 这段代码到底会输出0还是1呢?
// 最稳妥的办法: 永远要异步!!! 将doSomething函数永远异步执行
```

#### 回调已经不够用了 
+ 大脑是`线性阻塞`/`单线程`的语义, 回调流程是`非线性`/`非顺序`, 代码推导难度大
+ 回调受到`控制反转`的影响, 解决控制反转的方式会产生更笨重更难维护的代码

****
**[返回主目录](../readme.md)**
