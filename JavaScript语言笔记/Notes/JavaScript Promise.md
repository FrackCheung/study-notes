+ [总目录](../readme.md)
***
#### Promise
+ 仅作了解: 信任问题和回调地狱
  - 传统的异步函数, 开发者无法准确的获知结束时间, 如果又需要依赖结果值, 就只能使用回调
    ```JavaScript
    const fs = require('fs');
    fs.readFile('./file.txt', (err, doc) => {
      if (err) {
        return;
      }
      console.log(doc);
    });

    // 假设, readFile的定义是这样的:
    function readFile(path, callback) {
      // ...
      for (let index = 0; index <= 1000; index++) {
        callback(err, doc);
      }
    }
    ```
  - 回调函数有时候需要适配错误处理, 就必须要分别提供成功和失败的回调, 陷入回调地狱
    ```JavaScript
    /**
     * 将参数乘以2之后, 再用回调处理它
     */
    function double(value, callback) {
      setTimeout(() => {
        callback(value * 2);
      }, 1000);
    }

    // 问题是, value * 2 也许会出错, 这就还需要提供一个发生错误时介入的回调函数
    function double(value, successCallback, failureCallback) {
      setTimeout(() => {
        try {
          successCallback(value * 2);
        } catch (err) {
          failureCallback(err);
        }
      }, 1000);
    }

    const successCallback = value => console.log(value);
    const failureCallback = error => console.err(error);

    double(3, successCallback, failureCallback);
    ```
+ Promise是为了让异步函数能够在自己完成时, 向开发者发出通知
  ```JavaScript
  function double(value) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(value * 2);
      }, 1000)
    });
  }
  double(3)
    .then(value => {
      console.log(value)
    })
    .catch(err => {
      console.error(err);
    })
  ```
+ JavaScript线程, 消息队列和事件循环(浏览器)
  - JavaScript是单线程的, 代码只能按照出现的顺序, 依次执行
  - 浏览器不是单线程, JavaScript线程只是浏览器众多线程其中之一
  - JavaScript有些事做不到, 需要委托给浏览器: 网络通信, 延时函数等
  - 浏览器提供了这些事情的API, 当遇到时, 会交给浏览器单独的线程处理
  - JavaScript主线程会继续向下执行代码
  - JavaScript主线程代码执行完毕, 开始轮询消息队列, 取出任务执行
  - 浏览器线程执行完毕后, 将回调函数推入消息队列, 等待事件循环检索并执行
  - 用`xmlHttpRequest`和`setTimeout`为例, 图解
  ```mermaid
  graph TD
  subgraph JavaScript
  A[JavaScript线程] ==>|向下依次执行主线程代码| B[同步代码]
  B[同步代码] ==>|遇到xmlHttpRequest| C["xhr.onload = function() {}"]
  C["xhr.onload = function() {}"] ==>|继续向下执行同步代码| E[同步代码]
  E[同步代码] ==>|遇到setTimeout| F["setTimeout(callback, delay)"]
  F["setTimeout(callback, delay)"] ==>|继续向下执行同步代码| H[同步代码]
  H[同步代码] ==>|同步代码执行完毕| I[开启事件循环]

  subgraph Browser
  D[网络线程]
  G[延时/计时线程]
  end

  subgraph TaskQueue
  J[消息队列]
  end

  end

  C["xhr.onload = function() {}"] ==>|委托给浏览器网络线程| Browser
  F["setTimeout(callback, delay)"] ==>|委托给延时线程| Browser
  I[开启事件循环] ==>|轮询消息队列, 从中取出任务执行| TaskQueue
  Browser ==>|执行完毕, 将回调推入消息队列| TaskQueue

  style Browser fill:#EBCDCC
  style TaskQueue fill:#EBCDCC
  ```
***
**补充说明**:
+ 通常将JavaScript主线程上一直执行到底的代码成为同步代码
+ 将需要委托给浏览器执行的代码, 称之为异步代码
+ 异步代码的回调函数最终由其他线程执行完毕后推入消息队列
+ 如果过早推入, 也要等到JavaScript主线程同步代码执行完毕之后, 再开始处理消息队列
```JavaScript
for (let index = 0; index < 100; index++) {
  console.log(index);
}

setTimeout(console.log, 0, '最后执行');

for (let index = 101; index < 200; index++) {
  console.log(index);
}
```
***
+ Promise的一些重要概念(暂时不考虑`async`/`await`)
  - Promise的执行函数是同步执行的, 执行函数: 传入`new Promise`的函数
  ```JavaScript
  console.log(1);
  new Promise(resolve => {
    console.log(2);
    resolve();
  });
  console.log(3);
  // 1
  // 2
  // 3
  ```
  - Promise状态是私有的, 除了`resolve/reject`方法, 其他方法无法修改状态
  ```JavaScript
  new Promise(() => {}); // 永远挂起
  ```
  - Promise的`resolve/reject`是异步代码, 其结果值已经脱离了主线程, 在浏览器内部保存
  - 想要获取`resolve/reject`的结果值, 只能使用`then`或者`catch`
  - 通过`then`和`catch`, 浏览器内部会将挂载的回调, 推入消息队列
  - 可以这么理解: `then`和`catch`是JavaScript同步线程和异步状态的媒介
  ```JavaScript
  console.log(1);
  const p = new Promise(resolve => {
    resolve(4);
  });
  console.log(2);
  p.then(value => {
    console.log(value);
  });
  console.log(3);
  ```
  ```mermaid
  graph TD
  subgraph JavaScript
  A[JavaScript线程] ==>|向下依次执行主线程代码| B["同步代码console.log(1)"]
  B["同步代码console.log(1)"] ==>|遇到resolve| C["resolve(4)"]
  C["resolve(4)"] ==>|继续向下执行同步代码| E["同步代码console.log(2)"]
  E["同步代码console.log(2)"] ==>|遇到then| F["then(callback)"]
  F["then(callback)"] ==>|继续向下执行同步代码| H["同步代码console.log(3)"]
  H["同步代码console.log(3)"] ==>|同步代码执行完毕| I[开启事件循环]

  subgraph Browser
  D[Promise状态管理器]
  end

  subgraph TaskQueue
  J[消息队列]
  end

  end

  C["resolve(4)"] ==>|委托给浏览器内部| Browser
  F["then(callback)"] ==>|通过then请求结果值| Browser
  I[开启事件循环] ==>|轮询消息队列, 从中取出任务执行| TaskQueue
  Browser ==>|已有结果值4, 将then回调推入消息队列| TaskQueue

  style Browser fill:#EBCDCC
  style TaskQueue fill:#EBCDCC
  ```
  ```JavaScript
  const p = new Promise(resolve => {
    setTimeout(() => {
      resolve(1);
    }, 3000)
  });
  p.then(value => {
    console.log(value);
  });
  ```
  - Promise挂载的`then`回调会按照顺序依次被调用
  ```JavaScript
  const p = new Promise(resolve => {
    resolve(1);
  });
  p.then(value => console.log(1, value));
  p.then(value => console.log(2, value));
  p.then(value => console.log(3, value));
  p.then(value => console.log(4, value));
  // 1 1
  // 2 1
  // 3 1
  // 4 1
  ```
  - `then`中如果定义了`return`, 会将该值用`Promise.resolve`包装, 以保证返回的是Promise
  ```JavaScript
  const p = new Promise(resolve => resolve(1));
  p
    .then(value => value * 2)
    .then(value => value * 3)
    .then(value => value * 4)
    .then(console.log);
  // 24

  // 例外情况
  const p = new Promise(resolve => resolve(1));
  p
    .then(value => {
      setTimeout(() => {
        return value * 2;
      }, 0);
    })
    .then(console.log); // undefined
  
  // 修正
  const p = new Promise(resolve => resolve(1));
  p
    .then(value => new Promise(resolve => {
      setTimeout(resolve, 0, value * 2);
    }))
    .then(console.log); // 2
  ```
  - Promise创建过程中出现的任何错误, 都会导致该Promise以此理由被拒绝
  - 基于上述原因: 无法使用`try...catch`同步捕获`reject`的错误
  ```JavaScript
  try {
    new Promise((_, reject) => {
      throw new Error('Not Promise Error');
      reject(new Error('Promise Error'));
    }).catch(err => {
      console.log(err); // Error: Not Promise Error
    });
  } catch (err) {
    console.log(err); // 不会捕获到
  }
  ```
+ Promise静态方法:
  - `Promise.resolve()`: 立即获得一个解决的Promise, 详情参见以下代码
  ```JavaScript
  // Promise.resolve()其实和以下代码是一样的, 没啥区别
  new Promise(resolve => {
    resolve();
  });

  // Promise.resolve幂等: Promise.resolve如果传入Promise, 则直接返回
  const p1 = Promise.resolve();
  const p2 = Promise.resolve(p1);
  console.log(p1 === p2); // true;

  // Promise.resolve()即使传入错误, 也会得到一个被解决的Promise, 解决值是错误
  const p = Promise.resolve(new Error('111'));
  console.log(p); // Promise {<resolved>: Error: 111

  // Promise.resolve只关心第一个参数, 多余的参数会被忽略
  ```
  - `Promise.reject`: 立即获得一个拒绝的Promise, 详情参加以下代码
  ```JavaScript
  // 如果传入Promise, 则返回拒绝的Promise, 拒绝值是该Promise
  const p1 = Promise.resolve();
  const p2 = Promise.reject(p1);
  console.log(p2); // Promise {<rejected>: Promise}
  ```
  - `Promise.all`: 传入数组, 将每个值用`Promise.resolve`包装
  - `Promise.race`: 传入数组, 将每个值用`Promise.resolve`包装
+ `thenable`对象
  - `thenable`对象指的是有`then`方法的对象
  - Promise不能决议`thenable`对象, 这会导致Promise永远挂起, 且会有奇怪的bug
  ```JavaScript
  const resolveThenable = () => new Promise(resolve => {
    const thenable = {
      index: 1,
      then() {
        console.log(this.index);
      }
    };
    resolve(thenable);
  });
  resolveThenable().then(console.log); // Promise<Pending> 永远挂起
  // 1 thenable中的then方法会被执行
  ```
  - `Promise.resolve`传入`thenable`对象, 会试图展开, 不理解就算了, 我也不理解
  ```JavaScript
  const thenable = {
    then(success, error) {
      success(123);
      error(456);
    }
  };
  Promise.resolve(thenable).then(console.log, console.log); // 123
  ```
+ 异步函数: `async`/`await`
  - 使用`async`修饰的函数被称为异步函数, 异步函数总是返回Promise
  - 异步函数会把返回值用`Promise.resolve`包装, 如果没有返回值, 加不加`async`都一样
  - 异步函数中出现任何错误, 函数都会返回一个被拒绝的Promise, 拒绝理由是该错误
  ```JavaScript
  console.log(1);
  const log = () => console.log(2);
  async function method() {
    log();
    console.log(3);
  }
  method();
  console.log(4);
  // 1
  // 2
  // 3
  // 4

  async function method() {
    let value = 1;
    value();
  }
  method().catch(() => console.log('哦豁')); // 哦豁
  ```
  - `await`暂停异步函数的执行, 等待Promise结果值
  - `await`暂停的是异步函数内部位于`await`后面的代码
  - `await`不会阻止异步函数外部的同步代码
  ```JavaScript
  const p1 = async () => {
    console.log(await Promise.resolve(1));
  }

  const p2 = async () => {
    console.log(await 2);
  }

  const p3 = async () => {
    console.log(3);
  }

  p1();
  p2();
  p3();

  // 3
  // 1
  // 2
  ```
***
**总结**
+ 异步函数中真正起作用的是`await`, 没有`await`的异步函数和普通函数基本没区别
+ 异步函数遇到`await`时, 首先暂停并记录, `await`后面的代码也会挂起
+ 异步函数外部的代码会继续执行下去
+ 等到`await`等待的值可用了, 浏览器会将该值推入消息队列, 并恢复异步函数的执行

***
