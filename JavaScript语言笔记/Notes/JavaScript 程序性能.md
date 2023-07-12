# JavaScript 程序性能

**[返回主目录](../readme.md)**

#### Web Worker
+ 浏览器分配一个新的线程用于处理必要的操作
+ `Worker`内部无法访问主程序的任何资源
+ `Worker`可以访问几个重要的全局变量和功能的`副本`: `navigator`, `location`, `JSON`和`applicationCache`
+ `Worker`内部可以通过`importScripts()`添加额外的JavaScript脚本(`同步加载`)
+ `Worker`和主程序通过`message`事件和`postMessage`来通信
+ `Worker`主要用于执行密集型数学计算, 大数据集排序, 数据处理, 高流量网络通信等
```JavaScript
// Web Worker
const anotherJavaScriptFile = 'xxx.js'; // 另一个JavaScript文件路径
const worker = new Worker(anotherJavaScriptFile); // 创建新的工作线程
// 监听来自工作线程中的信息传递
worker.addEventListener('message', msg => {
    handleMessage(msg);
});
// 向工作线程中传递消息
worker.postMessage('Hello, Worker');

// 在xxx.js中, 信息传递采用相同的方式, 不需要加前缀
// xxx.js
addEventListener('message', msg=>{
    handleMessage(msg);
});
postMessage('Hello, Main Thread');
```

#### 尾调用优化
+ 出现在A函数结尾处的B函数调用
+ B函数调用完毕后, 就没有其余事情要做了, 除了`return`
+ 如果B函数调用完成之后, A函数也就完成了, 则可以优化
+ 优化过程, 引擎可以将A的调用栈帧复用为B的, 而无需重新分配栈帧
```JavaScript
// 尾调用优化
function certainMethod() {
    // 一些其他操作
    return tailCallMethod(); // 尾调用
}
// tailCallMethod()执行完毕后, certainMethod()也就结束了
// 浏览器执行到tailCallMethod()时, 可复用certainMethod()的栈帧
// 而无需再重新创建一个新的栈帧

// 非尾调用优化
function certainMethod() {
    // 一些其他操作
    return 10 + tailCallMethod(); // 非尾调用!!!
}
// tailCallMethod()执行完毕后, certainMethod()并没有结束
// tailCallMethod()的结果还需要进行计算, 
// 因此certainMethod()函数栈帧必须保留,
// 浏览器需要重新为tailCallMethod()分配一个栈帧
```

****
**[返回主目录](../readme.md)**