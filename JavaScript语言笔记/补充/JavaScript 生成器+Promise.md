# JavaScript 生成器 + Promise

**[返回主目录](../readme.md)**

#### 背景
+ Promise先于`async`/`await`问世, 在此之前
+ Promise只能使用`then`+`解决/拒绝函数`来执行异步流程
+ 如要暂停程序, 并等待Promise的决议值返回, 需借助于生成器
+ `async/await`问世之后, 生成器+Promise的机制慢慢不再使用

**本篇文档使用纯代码, 没有过多的讲解, 请结合注释阅读**

#### 核心知识点
+ 生成器的`同步错误处理`
+ 生成器和迭代器通过`next()`和`yield`互相传值
+ 生成器会在`yield`处`暂停`
```JavaScript
/**
 * 定义一个在指定时间(秒)后随机解决或拒绝的Promise
 * @param {string} id Promise任务的id, 用于标识
 * @param {number} time Promise决议的时间, 秒
 * @param {boolean} resolvePromise 根据此参数值确定解决还是拒绝Promise
 * @returns {Promise<string>}
 */
function asyncPromise(id, time, resolvePromise) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            // 根据resolvePromise参数的结果随机的解决或者拒绝Promise, 以测试全面
            resolvePromise
                ? resolve(`promise ${id} is resolved!`)
                : reject(new Error(`promise ${id} is rejected!`));
        }, time * 1000);
    });
}


/**
 * 希望实现一个awaitPromise函数, 像如下方式使用, 实现Promise的同步等待和错误捕获
 * @notice 先看用法, awaitPromise函数的定义放在最后
 */
awaitPromise(function* () {
    try {
        const result1 = yield asyncPromise('first', 2, true);
        const result2 = yield asyncPromise('second', 3, true);
        console.log(result1, result2); // promise first is resolved! promise second is resolved!
    } catch (err) {
        console.log(err);
    }
});

/**
 * 假设拒绝其中一个Promise, 使之产生错误, awaitPromise中的try...catch也能捕获到
 */
awaitPromise(function* () {
    try {
        const result1 = yield asyncPromise('first', 2, true);

        // 传入false, 使该Promise被拒绝
        const result2 = yield asyncPromise('second', 3, false);
        console.log(result1, result2); // 不会执行到!
    } catch (err) {
        console.log(err); // Error: promise second is rejected!
    }
});


// ==以下是重点: awaitPromise函数的定义==
/**
 * 同步处理Promise的awaitPromise函数定义
 * @param {()=>Generator} generator 生成器函数
 */
function awaitPromise(generator) {

    // 获取生成器的迭代器
    const iterator = generator();

    /**
     * 定义一个处理函数, 用于判断和处理迭代器的next()方法的返回值
     * @param {IteratorResult<string, boolean>} next 
     */
    function processIteratorNext(next) {

        // 如果迭代器结束, 则直接返回, 不作处理
        if (next.done) {
            return;
        }
        const value = next.value;

        // 如果迭代器的next()方法返回了一个Promise
        if (value instanceof Promise) {
            value.then(result => {

                /**
                 * 等待Promise决议后, 将解决值通过next()方法传入生成器
                 * 并且递归的继续处理next()方法的返回值
                 */
                processIteratorNext(iterator.next(result));
            }).catch(err => {

                // 如果捕获到错误, 就向生成器函数中抛入错误信息
                iterator.throw(err);
            });
        }
    }
    try {

        // 调用next()方法启动迭代器, 并开始处理next()方法返回值
        processIteratorNext(iterator.next());
    } catch (err) {

        // 遇到错误, 则向生成器函数中抛入错误
        iterator.throw(err);
    }
}
```

****
**[返回主目录](../readme.md)**