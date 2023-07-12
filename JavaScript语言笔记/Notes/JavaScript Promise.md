# JavaScript Promise

**[返回主目录](../readme.md)**

#### Promise的一些概念:
+ `不`把自己的程序`交给第三方`, 而是第三方通知任务结束
```JavaScript
// 希望两个值都已经决议之后, 再输出两个变量之和
function addPromiseValue() {
    return Promise.all([APromiseMethod(), BPromiseMethod()])
        .then(valuesArray => {
            return valuesArray.reduce((x, y) => x + y);
        })
}
addPromiseValue().then(result => {
    console.log(result);
});
```
+ Promise封装了依赖于时间的状态, 因此Promise本身是`与时间无关`的
+ Promise按照`可预测`的方式组成, 而无需关心时序或底层的结果
+ Promise一旦决议, 将永远保持在这个状态, 此时Promise将成为`不变值`
+ Promise是一种封装和组合未来值的易于复用的机制
+ 只有`真正的Promise才能被拒绝`, 如果在构造过程中出现错误, 会`抛出异常`, 而不是被拒绝的Promise, 例如: 
  - `new Promise(null)`
  - `Promise.race(12)`
  - ...

#### thenable
+ `thenable`: 判断某个值是否是Promise
```JavaScript
// thenable鸭子类型检测
if (
    p !== null
    && (typeof p === 'objec' || typeof p === 'function')
    && typeof p.then === 'function'
) {
    // 这是一个thenable
} else {
    // 这不是一个thenable
}
```
+ `p instanceof Promise`, 这个方法并不完全有效
+ `thenable`判断, 任何具有`then()方法`的对象和函数, 都被认为是Promise一致的`thenable`
+ `thenable`并不等价于Promise, 但是如果把非Promise的东西识别为了Promise, 会出bug
+ Promise不能决议一个`thenable`对象!!! 这会导致奇怪的bug, 而且期约解决值会永远挂住
+ 上面这点会在后面详细介绍Promise决议的时候再谈

#### Promise需要掌握的一些难点
+ Promise的`then`总是`异步`调用, Promise会自动防止调用过早的情况出现
+ 一个Promise决议后, 通过`then(..)`注册的回调都会在下一个异步时机点上依次被立即调用
```JavaScript
// Promise通过then注册的回调会在下一个异步时机点上依次被立即调用
const p = new Promise(resolve => resolve(123));
p.then(() => {
    p.then(() => {
        console.log('C');
    });
    console.log('A');
});
p.then(() => {
    console.log('B');
}); // --> A B C
// 巩固
const p3 = new Promise(resolve => resolve('A'));
const p1 = new Promise(resolve => resolve(p3));
const p2 = new Promise(resolve => resolve('B'));
p1.then((result) => console.log(result));
p2.then((result) => console.log(result));
// 最终输出结果, B A
    
// 执行顺序, 先p1, 再p2, 但p1嵌套了一个promise, 多了一层异步
// 第一步: 执行p1, 执行结果是将p1展开为p3
// 第二步: 执行p2, 得到解决值'B', 输出
// 第三步: 执行p3, 得到解决值'A', 输出
```
+ Promise决议`thenable`会导致挂起, 无法决议, 提供`竞态机制`来解决

```JavaScript
// Promise决议一个thenable对象
function promiseThenable() {
    return new Promise(resolve => {
        const thenable = {
            index: 2,
            then() {
                console.log(this.index);
            }
        }
        resolve(thenable); // 决议一个thenable对象
    })
}
promiseThenable().then(result => {
    console.log(`result: ${result}`); // 这行代码永远不会执行
});
// 由于调用了.then(), 会执行thenable对象中的then方法 --> 2
// 而Promise的决议值会永远挂住, 后面的代码执行不到, holy shit !!
async function promiseThenableTest() {
    const result = await promise(); // 决议值result会永远挂起
    console.log(`result: ${result}`); // 这行代码也不会执行
}
promiseThenableTest(); // 2

// 别干这些傻事情
Object.prototype.then = function () { };
```
+ Promise只会被决议一次, 因此通过`then`注册的回调函数也只会被调用一次
+ Promise只会被决议一次, 但如果注册了多个相同的`then`回调, 则回调会执行多次(`这么玩怕不是傻子`)
+ `resolve()`/`reject()`只能接受`最多一个参数`, 多余的参数会被静默忽略
+ Promise创建或决议过程中, 出现了任何JavaScript错误, 该错误会被捕获, 并以此拒绝Promise
```JavaScript
// Promise创建或决议过程中出现的JavaScript错误会成为拒绝Promise的理由
const errorPromise = new Promise(resolve => {
    const constValue = 123;
    constValue = 456; // 对常量赋值, 导致TypeError
    resolve(constValue);
});
errorPromise
    .then(result => console.log(result)) // 这行代码不会执行到
    .catch(error => console.log(error)); // TypeError
```
+ `then()`方法接受两个回调, 解决回调和拒绝回调, `catch(callback)`方法是`then(_, callback)`的语法糖
+ Promise解决了回调的信任危机, 但`如何保证Promise也值得信任`呢? 毕竟决议`thenable`的时候就会挂起: 竞态机制
```JavaScript
// Promise避免永远不被决议的方案
function neverResolved() {
    // 决议一个thenable
    const thenable = { then() { console.log(123); } };
    return new Promise(resolve => {
        resolve(thenable);
    });
}
function timeoutPromise(delay) {
    return new Promise((_, reject) => {
        setTimeout(() => {
            reject('Timeout!');
        }, delay);
    })
}
Promise.race([neverResolved(), timeoutPromise(3000)])
    .then(result => { console.log(`Promise成功完成决议, 结果: ${result}`) })
    .catch(err => { console.log(`Promise决议失败, 原因: ${err}`) });
```

#### Promise.resolve()
+ 传入非Promise, 非`thenable`的立即值, 会得到用`该值`填充的Promise
+ 传入Promise, 则会`返回该Promise`
```JavaScript
// Promise.resolve()
const promiseValue1 = new Promise(resolve => resolve(123));
const promiseValue2 = Promise.resolve(123);
// promiseValue1和promiseValue2的行为完全一致
const promiseValue3 = Promise.resolve(666);
const promiseValue4 = Promise.resolve(promiseValue3);
console.log(promiseValue3 === promiseValue4); // true
```
+ 传入非Promise的`thenable`值, 会试图展开该值, 直到提取出一个具体的非类Promise的最终值
```JavaScript
// Promise.resolve()接收thenable对象
const thenableValue = {
    then(resolveCallback, rejectCallback) {
        resolveCallback(123);
        rejectCallback('Error');
    }
}
thenableValue.then( // thenableValue并不是真正的Promise
    result => {
        console.log(result); // 这行代码会执行
    },
    error => {
        console.log(error); // 这行代码也会执行
    }
)
const thenablePromise = Promise.resolve(thenableValue);
thenablePromise.then(
    result => console.log(result), // --> 123
    error => console.log(error) // 不会走到这里
); // 123!! 成功执行了!! 
```
+ 向reject()传入Promise或`thenable`值, 会把`该值`设置为拒绝理由

#### Promise链式流
+ 对Promise调用其`then()`方法, 都会创建并返回一个新的Promise
+ `then()`方法的解决回调中的返回值, 会被设置为新创建的Promise的解决值
```JavaScript
// Promise链式流
const chainPromise = Promise.resolve(12);
chainPromise
    .then(value => {
        console.log(value); // --> 12
        return value * 2;
    })
    .then(value => {
        console.log(value); // --> 24
        return value * 2;
    })
    .then(value => {
        console.log(value); // --> 48
    });
```
+ 如果解决回调中没有显示的返回值, 则会隐式的返回`undefined`
+ Promise链中任意位置出错, 则下个Promise的拒绝回调中的返回值会被设置为再下一个Promise的完成值
```JavaScript
// then回调中出现的错误无法被同一个then中的rejectCallback捕获
const thenCatchPromise = new Promise(resolve => resolve(123));
thenCatchPromise.then(
    result => {
        throw new TypeError('error'); // then回调中抛出了错误
        console.log(result); // 永远无法执行到
    },
    error => {
        console.log(error); // 永远无法执行到, 无法捕获then中的错误!!!
    }
).then(null, error => {
    console.log(error); // 可以捕获到, 因为前一个then方法最终也会返回一个Promise
});
// 第一个then中的拒绝回调之所以无法捕获,
// 是因为拒绝回调只会在Promise被拒绝时调用, 
// 但Promise本身已被解决
// 第二个then中的拒绝回调能捕获到错误,
// 是因为第一个then最终也会返回一个Promise,
// 而该Promise中出现了错误, 因此用该错误拒绝了该Promise
```
+ 如果`then()`方法没有显示提供拒绝回调函数, 则会有一个默认的拒绝回调, 将错误直接抛出
```JavaScript
// 默认的拒绝回调
const defaultErrorCallback = Promise.resolve(new TypeError('Error'));
defaultErrorCallback.then(
    result => { console.log(result) },
    // 默认的错误回调: error => { throw error; }
);
// 默认的拒绝回调只是简单的继续将错误抛出, 不进行任何处理
```
+ 如果`then()`方法没有显示提供解决回调函数, 则会有一个默认的解决回调, 将解决值直接返回
```JavaScript
// 默认的解决回调
const defaultResolveCallback = Promise.resolve(12);
defaultResolveCallback.then(
    // 默认的解决回调: result => { return result; },
);
// 默认的解决回调只是简单的继续将值返回, 不进行任何处理
```
+ 无穷无尽的错误: Promise链末尾加上`catch`, 可以捕获前面的错误, 但`如果catch本身出现了错误呢`?
```JavaScript
// 出错的Promise链式流
const errorChainPromise = Promise.resolve(12);
errorChainPromise
    .then(value => {
        console.log(value); // --> 12
        throw new TypeError('Error'); // 抛出错误
    })
    .then(null, error => {
        console.log(error); // TypeError: Error
        return 42;
    })
    .then(value => {
        console.log(value); // --> 42, 上一步拒绝回调中的返回值
    });
```

#### Promise.all([...]) 
+ 返回一个Promise
+ 数组参数可以是`Promise/thenable/立即值`, 每个值都会通过`Promise.resolve()`过滤
+ 其`解决值也是一个数组`, 由传入的Promise的解决值组成, `顺序一致`
+ 传入的Promise只要有一个被拒绝, 整个`Promise.all`就会立即以该拒绝值被拒绝, 并丢弃其他所有结果
+ 良好的编码规范, 为每个传入`Promise.all`的Promise关联一个拒绝处理函数
+ 如果传入空数组, `Promise.all`则会立即完成

#### Promise.race([...])
+ 返回一个Promise
+ 数组参数可以是`Promise/thenable/立即值`, 立即值没多大意义, 因为立即值会立刻胜出
+ 数组参数中的任何一个Promise决议完成, 整个`Promise.race`也将以该决议值决议完成 
+ 如果传入空数组, `Promise.race`永远不会决议

#### 并发迭代
+ 有时需要在一列Promise中`迭代`, 并对每个Promise都执行某个任务
+ 如果每个Promise执行的任务是同步的, 可以使用`map()`, `forEach()`等
+ 如果任务是异步的, 原生的同步方法就无法使用, 参见一个map的示例代码
```JavaScript
// 一个异步的map()工具, 接受Promise数组, 外加一个在每个值上运行的函数
if (!Promise.map) {
    Promise.map = function (promises, runTask) {
        return Promise.all(
            promises.map(promise => {
                return new Promise(resolve => {
                    runTask(promise, resolve);
                })
            })
        );
    }
}
const mapPromise1 = Promise.resolve(12);
const mapPromise2 = Promise.resolve(24);
const mapPromise3 = Promise.reject('Error');
Promise.map(
    [mapPromise1, mapPromise2, mapPromise3],
    (promise, r) => {
        Promise.resolve(promise)
            .then(value => {
                r(value * 2);
            }, r);
    }).then(values => {
        console.log(values);
    });
```

#### Promise局限性
+ 顺序错误处理: 除非显示为链上每个Promise指定错误处理程序, 否则最后一个`catch`无法确定来自哪个Promise
+ Promise只能有一个完成值或一个拒绝理由 , 如果需要多个, 可以使用`Promise.all`包裹
+ Promise只能被决议一次, 决议完后之后, 永远不可再变
+ Promise无法被取消

#### 补充小知识

```JavaScript
// 如果then()中需要执行一些异步操作然后再返回, 应该怎样处理呢?
chainPromise
    .then(value => {
        console.log(value); // --> 12
        setTimeout(() => {
                value = value * 2;
        }, 3000);
        return value;
    })
    .then(value => {
        console.log(value); // --> 12 并没有翻倍, 因为setTimeout
    });
    // 正确的处理方式
chainPromise
    .then(value => {
        console.log(value); // --> 12
        return new Promise(resolve => {
            setTimeout(() => {
                value = value * 2;
                resolve(value);
            }, 3000);
        })
    })
    .then(value => {
        console.log(value); // --> 24
    });
```

****
**[返回主目录](../readme.md)**
