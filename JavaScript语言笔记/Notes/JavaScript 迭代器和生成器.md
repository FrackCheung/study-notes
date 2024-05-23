+ [总目录](../readme.md)
***
+ 迭代: 按照顺序从目标中取到值, 然后执行相同的一段程序, 直到终止
+ JavaScript中的迭代机制, 最为广泛应用的就是`for`循环
  ```JavaScript
  const arr = ['eating', 'sleeping', 'working'];
  for (let index = 0; index < arr.length; index++) {
    console.log(arr[index]);
  }
  ```
+ `for`循环并不是完美的迭代机制, 最大的缺陷是: 只适用特定的结构和特定的场景
  - 迭代之前, 必须首先了解数据结构: `for`循环只能用于数组和类数组对象
  - `for`循环通过递增索引来访问值, 这种方案并不适用其他具有顺序的数据结构
  - 其他具有隐式顺序的数据结构: `Map`/`Set`等
+ JavaScript提供了不依靠递增索引的迭代方法: `forEach`/`map`等, 但都不通用
***
**总结**: 迭代本身是一种思维方式, 但是JavaScript中的迭代却只能用于部分的数据结构, 无法提供一种更通用的, 面向几乎所有数据类型的迭代模式, ES6提供的迭代器正好解决了这个问题
***
+ 可迭代对象: 实现了`可迭代协议`的对象, 就被称之为可迭代对象
***
**可迭代协议**: 是一套规则, 描述了如何将数据结构实现为可迭代对象, 同时也规定了如何从可迭代对象中, 按照指定的方式, 获取迭代值, 后文会详细描述

**规范表达**: 可迭代协议规定了`Iterable`接口, 和`Iterator`迭代方式, 凡是实现了`Iterable`接口的数据结构, 都可以通过`Iterator`迭代方式获取迭代值
***
+ 已经实现了`Iterable`接口的内置数据:
  - 字符串
  - 数组
  - Map映射
  - Set集合
  - arguments
  - NodeList DOM集合
+ 可以使用`Iterator`迭代方式的语言特性:
  - `for...of`循环
  - 数组解构
  - `...`扩展操作符
  - `Array.from`
  - 创建Set集合, 创建Map映射
  - `Promise.all` 和 `Promise.race`
  - `yield*`操作符, 用于生成器
+ 协议详解
  - 可迭代对象, 必须包含`[Symbol.iterator]`属性
  - `[Symbol.iterator]`属性值, 必须是一个迭代器对象, 用于遍历迭代值
  - 迭代器对象必须包含`next()`方法, 用于获取迭代值, 调用一次, 获取一个
  - `next()`方法的返回值是一个对象, 包含两个属性: `value`和`done`
  - `value`表示当前取到的迭代值, `done`表示是否已经全部迭代完毕
  - 当`value`有值的时候, `done`必须为`false`
  - `done`为`true`时, `value`必须为`undefined`
  - 根据以上协议, 手撸一个自定义的迭代器
  ```JavaScript
  const CustomIterator = {
    index: 1,
    [Symbol.iterator]() {
      let that = this;
      return {
        next() {
          if (that.index <= 3) {
            return { value: that.index++, done: false }
          }
          return { value: undefined, done: true }
        }
      }
    }
  };

  for (const item of CustomIterator) {
    console.log(item);
  }

  // 1
  // 2
  // 3
  ```
  - 迭代器对象可以提供可选的`return()`方法, 用于提前终止迭代
  - 当遇到如下情况时, 迭代器会自动调用`return()`方法, 提前终止迭代:
  - (1) `for...of`循环, 通过`break`/`continue`/`return`/`throw`提前退出
  - (2) 解构操作并未使用到所有的值
  - `return()`返回值结构和`next()`一致, 通常是`{ done: true }`
  ```JavaScript
  const CustomIterator = {
    index: 1,
    next() {
      if (this.index <= 3) {
        return { value: this.index++, done: false };
      }
      return { value: undefined, done: true }
    },
    return() {
      console.log('哦豁')
      return { done: true };
    },
    [Symbol.iterator]() {
      return this;
    }
  }

  for (const item of CustomIterator) {
    if (item === 2) {
      return;
    }
    console.log(item);
  }
  // 1
  // 哦豁
  ```
  - 部分数据结构的迭代器是不可关闭的, `return()`只会暂停, 再次迭代会继续从终止处开始
  ```JavaScript
  const arr = [1, 2, 3, 4, 5];
  const iter = arr[Symbol.iterator](); // 获取迭代器对象
  iter.return = function() {
    console.log('哦豁');
    return { done: true }
  };

  for (const item of iter) {
    console.log(item);
    if (item === 3) {
      break;
    }
  }
  // 1
  // 2
  // 3
  // 哦豁

  for (const item of iter) {
    console.log(item);
  }
  // 4
  // 5
  ```
***
**小知识**: 其实`for...of`循环就是调用目标对象上`[Symbol.iterator]`方法, 获取迭代器, 并反复调用`next()`方法, 直到`done`为`true`, 上述的其他语言特性也都如此
***
+ 生成器函数: 在函数名称前加上`*`定义
  - 生成器函数通过`yield`生成迭代值, 可以是单个值, 也可以是可迭代对象
  - 生成器函数执行时遇到`yield`会首先返回迭代值, 并暂停执行, 作用域保留
  - 生成器函数运行的结果, 是一个生成器对象, 同时该对象也是可迭代的
  - 箭头函数不能用来定义生成器函数
  ```JavaScript
  // 生成器函数示例1
  const CustomIterator = function*() {
    yield 1;
    yield 2;
    yield 3;
  }
  const iter = CustomIterator();
  for (const item of iter) {
    console.log(item);
  }
  // 1
  // 2
  // 3

  // 生成器函数示例2
  const CustomIterator = function*() {
    for (let index = 0; index < 3; index++) {
      yield index;
    }
  }
  const iter = CustomIterator();
  for (const item of iter) {
    console.log(item);
  }
  // 0
  // 1
  // 2

  // 生成器函数示例3
  const generator = function*() {
    yield *[1, 2, 3];
  }
  for (const item of generator()) {
    console.log(item);
  }
  // 1
  // 2
  // 3
  ```
+ 生成器对象的概念: 生成器对象是生成器函数的运行结果
  - 生成器对象可迭代, 因为生成器对象也实现了`Iterable`接口
  - 生成器对象具有三个方法: `next()`/`return()`/`throw`
    + `next()`: 获取生成器函数中产生的迭代值, 包含`value`和`done`属性
    + `return()`: 直接关闭生成器, 立即返回`{ done: true, value: 传参 }`
    + `throw()`: 向生成器对象中注入错误信息, 错误信息也会传递到生成器函数中
    + **PS**: 由于生成器可以暂停的特性, 错误信息可以被`try...catch`同步捕获
  - 生成器对象调用`next`方法, 会使暂停中的生成器函数恢复执行
  ```JavaScript
  // 示例1: 生成器对象的next方法, 获取迭代值
  const generator = function*() {
  for (let index = 0; index < 100; index++) {
    yield index;
  }
  const iter = generator();
  console.log(iter.next()); // {value: 1, done: false}
  console.log(iter.next()); // {value: 2, done: false}
  console.log(iter.next()); // {value: 3, done: false}

  // 示例2: 生成器对象的throw方法抛出错误, 外部处理
  const generator = function*() {
    for (let index = 0; index < 100; index++) {
      yield index;
    }
  }
  const iter = generator();
  console.log(iter.next()); // {value: 1, done: false}
  try {
    iter.throw(new Error('抛出错误'));
  } catch(err) {
    console.log(err); // Error: 抛出错误
  }
  console.log(iter.next()); // {value: undefined, done: true}

  // 示例3: 生成器对象的throw方法抛出错误, 内部处理
  const generator = function*() {
    for (let index = 0; index < 100; index++) {
      try {
        yield index;
      } catch(err) {
        console.log(err); // Error: 抛出错误
      }
    }
  }
  const iter = generator();
  console.log(iter.next()); // {value: 1, done: false}
  iter.throw(new Error('抛出错误'));
  console.log(iter.next()); // {value: 2, done: false}
  ```
  - 生成器对象和生成器函数可以互相传参(后文讲述)
  - 生成器函数中定义的`return`, 和生成器对象的`return`方法都会关闭生成器
  - 生成器函数中如果没有`return`, 会在最后默认添加一个`return undefined`
  ```JavaScript
  // 示例1: 生成器对象的return方法, 关闭生成器
  const generator = function*() {
    for (let index = 0; index < 1000; index++) {
      yield index;
    }
  }
  const iter = generator();
  console.log(iter.next()); // {value: 0, done: false}
  console.log(iter.return(100)); // {value: 100, done: true}
  console.log(iter.next()); // {value: undefined, done: true}

  // 示例2: 生成器函数的return, 关闭生成器
  const generator = function*() {
    yield 1;
    return 2;
    yield 3;
  }
  const iter = generator();
  console.log(iter.next()); // {value: 1, done: false}
  console.log(iter.next()); // {value: 2, done: true}
  console.log(iter.next()); // {value: undefined, done: true}
  ```
+ 用生成器代替迭代器
  ```JavaScript
  const CustomIterator = {
    min: 1,
    max: 3,
    *[Symbol.iterator]() {
      for (let index = this.min; index <= this.max; index++) {
        yield index;  
      }
    }
  };
  for (const item of CustomIterator()) {
    console.log(item);
  }
  // 1
  // 2
  // 3
  ```
+ 生成器函数和生成器对象互相传值
  - `next().value`获取`yield`的值
  - `next(value)`向`yield`传值
  - 第n个`next`会获取第n个`yield`的值
  - 第n个`next`的参数会成为第n-1个`yield`表达式的结果值
  ```JavaScript
  // next()和yield的不匹配示例
  function * Generator() {
    const receivedValue1 = yield 'yieldValue1';
    console.log(receivedValue1); // nextValue1

    const receivedValue2 = yield 'yieldValue2';
    console.log(receivedValue2); // nextValue2

    const receivedValue3 = yield 'yieldValue3';
    console.log(receivedValue3); // nextValue3
  }

  const generator = Generator();
  console.log(generator.next('会被丢弃').value); // yieldValue1
  console.log(generator.next('nextValue1').value); // yieldValue2
  console.log(generator.next('nextValue2').value); // yieldValue3
  console.log(generator.next('nextValue3').value); // undefined
  ```
***
**解析**:
+ 生成器对象调用`next(value)`, 会将`value`值传递给正在等待中的`yield` 
+ 当生成器对象第一次调用`next`时, 发生了什么?
  - 生成器启动, 遇到第一个`yield`, `yield`将迭代值返回给`next`方法
  - `next`方法已经拿到了迭代值, 生命周期结束
  - 第一个`yield`导致生成器暂停, 等待下一次`next`调用以恢复执行
***
+ 生成器函数的用途1: 迭代DOM
  ```JavaScript
  function * getAllElementOf(element) {
    yield element;
    element = element.firstElementChild;
    while(element) {
      yield * getAllElementOf(element);
      element = element.nextElementSibling;
    }
  }

  const elements = document.querySelector('selector');
  for(let element of getAllElementOf(element)) {
    // do something
  }
  ```
+ 生成器函数的用途2: 生成器+Promise同步错误处理(了解即可)
  ```JavaScript
  const fetchUrl = "/restful/api/dosomthing";
  /**
  * 接口调用
  * @param {string} url 
  * @returns {Promise<Response>}
  */
  function getFetchResult(url) {
    return fetch(url);
  }

  /**
  * 生成器函数
  */
  function* createFetchGenerator() {
    try {
      const response = yield getFetchResult(fetchUrl);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  // 获取生成器对象
  const fetchGenerator = createFetchGenerator();
  fetchGenerator.next();

  getFetchResult()
    .then((response) => {
      fetchGenerator.next(response);
    })
    .catch((error) => {
      fetchGenerator.throw(error);
    });

  ```
***
**小知识**: `async`/`await`和Promise并不是同时出现的, `async`/`await`后面才出来, 因此在这之前, 开发者想要同步捕获Promise错误, 就必须借助生成器

**小知识**: `async`/`await`借鉴了生成器函数可以暂停恢复的特性, 可以说`async`/`await`就是对Promise+生成器的这套实现进行了规范化
***

+ `for...await`循环: 间隔固定时间输出值
  ```JavaScript
  async function *generate(min, max, delay) {
    for(let index = min; index <= max; index++) {
      yield await new Promise(resolve => setTimeout(resolve, delay, index));
    }
  }

  async function start() {
    for await (const item of generate(1, 10, 1000)) {
      console.log(item);
    }
  }

  start();
  ```

***
**补充**: 间隔输出的另一个示例:
```JavaScript
const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

(async () => {
  for (let index = 0; index < 10; index++) {
    console.log(index);
    await sleep(1000);
  }
})()
```
***
