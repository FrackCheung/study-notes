# JavaScript 生成器和迭代器

**[返回主目录](../readme.md)**

#### 生成器和迭代器的一些重要概念
+ 生成器函数是一个特殊的函数, 可以一次或多次启动和停止
+ 第一个`next()`方法用于启动生成器, 并在第一个`yield`处暂停
+ `next()`方法和`yield`可以互相传值
  - `next().value`获取`yield`的值
  - `next(value)`向`yield`传值
+ **重点**: 
  - 第`n`个`next(value)`会获取第`n`个`yield`的值
  - `next`的参数`value`会成为第`n-1`个`yield`表达式的结果值
+ 上一点解析: 
   - `next()`的参数用于给等待中的`yield`提供值, 如果没有等待中的`yield`, 参数会被丢弃 
   - 第一个`next()`方法执行时, 还没有等待中的`yield`, 执行完毕后, 才会有等待中的`yield` 
   - 因此第一个`next()`方法的参数没有意义, 会被丢弃 
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
+ 生成器函数可以有显示的`return`语句, 如果没有, 会默认添加一个`return undefined`语句
+ next()方法返回一个对象, 包含两个属性: `value`和`done`:  
  - 当`next()`遇到`return`语句时, 会将`value`属性设置为`return`的返回值, 将`done`属性设置为`true`
  - 当`done`属性设置为`true`后, 后续执行再多的`next()`都是无意义的
  - 可以通过调用`return()`方法, 来终止迭代器  
+ 假设生成器中有`n`个`yield`:  
  - `next()`最多可以执行`n+1`次, 因为第一次执行是用于启动生成器
  - 第`n+1`次`next()`可以给第`n`个`yield`传值, 其值为`next()`的参数
  - 第`n+1`次`next()`可以获取第`n+1`个`yield`的值, 等等, 总共只有`n`个`yield`啊...
  - 第`n+1`次`next()`会获取return的值, 且`done`属性变为`true`
  - `next()`超过`n+1`次后的调用都是无意义的, 因此才说最多可以执行`n+1`次
```JavaScript
// 生成器的return
function* createGenerator2() {
    yield 1;
    yield 2;
    yield 3;
    // return undefined 没有显示的return语句, 会默认加上该语句
}
const generator2 = createGenerator2();
console.log(generator2.next()); // --> { value: 1, done: false }
console.log(generator2.next()); // --> { value: 2, done: false }
console.log(generator2.next()); // --> { value: 3, done: false }
console.log(generator2.next()); // --> { value: undefined, done: true }

function* createGenerator3() {
    yield 1;
    yield 2;
    yield 3;
    return 4;
}
const generator3 = createGenerator3();
console.log(generator3.next()); // --> { value: 1, done: false }
console.log(generator3.next()); // --> { value: 2, done: false }
console.log(generator3.next()); // --> { value: 3, done: false }
console.log(generator3.next()); // --> { value: 4, done: true }
```
+ 终止迭代器
```JavaScript
// 通过return()终止迭代器
function* createStopedGenerator() {
    let value = 1;
    while (true) {
        value++;
        yield value;
    }
}
const stopedGenerator = createStopedGenerator();
for (const item of stopedGenerator) {
    console.log(item);
    if (item > 100) {
        stopedGenerator.return('stop!');
    }
}
```
+ `for...of`迭代 
   - 在每次迭代中自动调用`next()`, 且不会传递任何值  
   - 只能在可迭代对象上使用, 可迭代对象就是实现了`[Symbol.iterator]`的对象  
   - 通过调用`[Stmbol.iterator]()`方法, 会返回一个迭代器对象, 并开始调用其`next()`方法  
   - 迭代会在遇到`done`属性为`true`的时候停止, 且不会包含该`value`值  
```JavaScript
// 迭代器, 只会迭代done为false的值
for (const item of createGenerator2()) {
    console.log(item); // 1 2 3
}
for (const item of createGenerator3()) {
    console.log(item); // 1 2 3
}
```
+ `[Symbol.iterator]()`迭代
```JavaScript
// [Symbol.iterator]()方法
const symbolIteratorArray = [1, 2, 3];
const symbolIterator = symbolIteratorArray[Symbol.iterator]();
console.log(symbolIterator.next().value); // --> 1
console.log(symbolIterator.next().value); // --> 2
console.log(symbolIterator.next().value); // --> 3
console.log(symbolIterator.next().value); // --> undefined
```

#### 异步迭代生成器 & 同步错误处理
   - `try...catch`可以写在生成器函数中, 用于捕获错误  
   - `try...catch`也可以写在外部, 包裹`next()`方法, 用于捕获错误  
   - `try...catch`可以捕获通过`throw()`抛入生成器的错误  
   - 生成器 + Promise  
   - 有了`async/await`的支持, 异步迭代生成器就没有存在的价值了  
```JavaScript
// 异步生成迭代器
// 考虑一个场景, 基于传统的回调
function getAJAXResult(url, callback) {
    ajax(url, callback); // 假想的ajax方法, 其回调函数是error-first风格
}
const ajaxUrl = '/restful/dosomthing';
getAJAXResult(ajaxUrl, (error, data) => {
    if (error) {
        console.log(error);
    } else {
        console.log(data);
    }
});

// 改写为生成器
function* getAjaxResultGenerator() {
    try {
        // 代码执行到yield会暂停, 但不阻塞同步线程
        // 仅仅是暂停该生成器函数而已
        const data = yield getAJAXResult2(ajaxUrl);
        console.log(data);
    } catch (error) {
        // 看似捕获的是异步的错误, 其实并不是
        // yield处暂停了, 等待外部传入值, 如果传入一个错误
        // 后续的代码已经是同步的了, try...catch自然可以处理
        console.log(error);
    }
}
function getAJAXResult2(url) {
    ajax(url, (error, data) => {
        if (error) {
            ajaxResultGenerator.throw(error);
        } else {
            // 获取到结果后, 将data返回给生成器中的yield
            // 并继续执行生成器后面的代码
            ajaxResultGenerator.next(data);
        }
    })
}
const ajaxResultGenerator = getAjaxResultGenerator();
ajaxResultGenerator.next(); // 启动, 并在yield处暂停

// 异步生成器中的同步错误处理, 示例1
function* createErrorHandlerGenerator() {
    let x = yield 'Hello World';
    yield x.toUpperCase(); // 引发异常!
}
const errorHandlerGenerator = createErrorHandlerGenerator();
errorHandlerGenerator.next(); // { value: 'Hello World', done: false }
try {
    // 42会传递给第一个yield, 此处已经暂停了, 因此x会获得值42
    errorHandlerGenerator.next(42); // 42没有toUpperCase()方法
} catch (error) {
    console.log(error); // TypeError
}

// 异步生成器中的同步错误处理, 示例2, 通过throw抛出错误
function* createErrorHandlerGenerator2() {
    let x = yield 'Hello World';
    console.log(x); // 这行代码永远执行不到
}
const errorHandlerGenerator2 = createErrorHandlerGenerator2();
errorHandlerGenerator2.next(); // { value: 'Hello World', done: false }
try {
    // 抛出异常
    errorHandlerGenerator2.throw('Oops, Error!');
} catch (error) {
    // 通过throw抛入生成器的异常也可以被try...catch捕获
    console.log(error);
}
```
+ 生成器 + Promise
```JavaScript
// 生成器 + Promise, 和上述示例大致一致
const fetchUrl = '/restful/api/dosomthing';
function getFetchResult(url) {
    return fetch(url);
}
function* createFetchGenerator() {
    try {
        const response = yield getFetchResult(fetchUrl);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
}
const fetchGenerator = createFetchGenerator();
fetchGenerator.next();
getFetchResult()
    .then(response => {
        fetchGenerator.next(response);
    })
    .catch(error => {
        fetchGenerator.throw(error);
    });


// 以上的几个示例, 在实现了async/await的环境下, 就不重要了...
function sleep(deley) {
    return new Promise((resolve, reject) => {
        const randomValue = Math.random();
        const promiseHandle = randomValue > 0.5 ? resolve : reject;
        setTimeout(promiseHandle, deley1000);
    })
}
async function sleepPromiseTest() {
    try {
        await sleep(3);
        console.log('wake up');
    } catch (error) {
        console.log('failed to wake up');
    }
}
console.log(123);
sleepPromiseTest();
console.log(456);
```

#### 迭代生成器的其他实例
+ 生成器委托: 在一个生成器中`yield`另一个生成器
```JavaScript
function * Generator() {
    yield 'zhangzhen';
    yield * Generator2();
    yield 'other4'
}

function * Generator2() {
    yield 'other1';
    yield 'other2';
    yield 'other3';
}

for(let value of Generator()) {
    console.log(value); // zhangzhen other1 other2 other3 other4
}
```
+ 生成器迭代DOM
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

****
**[返回主目录](../readme.md)**