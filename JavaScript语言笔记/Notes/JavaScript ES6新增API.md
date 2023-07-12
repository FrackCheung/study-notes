# JavaScript ES6新增API

**[返回主目录](../readme.md)**

#### Array.from()
+ 只传入一个数字参数, 会构造一个`空数组`, 其长度为参数
+ 可以将类数组对象转换为数组, 类数组对象: 具有`length`属性
+ `Array.from()`永远不会产生空槽位, 而是真正的`undefined`值
+ 某些数组方法, 如`map()`会跳过空槽位, 而`Array.from()`则不会
```JavaScript
// Array.from()转换类数组对象
const likeArray = {
    length: 3,
    0: 'value1',
    1: 'value2'
};
const resultArray = Array.from(likeArray);
console.log(resultArray); // [ 'value1', 'value2', undefined ]
// 结果中的undefined是真正的undefined, 而不是空槽位
```
+ `Array.from()`接收第二个参数, 对参数进行转换
```JavaScript
// Array.from()的第二个参数
const resultArray2 = Array.from(likeArray, (value, index) => {
    if (value === undefined) {
        return index;
    } else {
        return value.toString().toUpperCase();
    }
});
console.log(resultArray2); // [ 'VALUE1', 'VALUE2', 2 ]
```
#### Array.of()
+ 只传入一个数字参数, 会构造一个`该值`为元素的`长度为1`的数组

#### Array.copyWith() 
+ 从数组中`复制`一部分到`同一数组`的其它位置, 并`覆盖`原有值
+ 复制结果`不会`超过数组的长度, 到达数组结尾便会停止
+ 复制并非总是索引递增, 如果`源/目标范围重叠`, 内部算法会`反向复制`
```JavaScript
// Array.copyWith(target, start, end?)
// target: 要复制到的目标索引
// 开始复制的索引, 包含
// end: 可选, 结束复制的索引, 不包含, 为负值则相对于数组结束位置
// 即将[start, end]的元素复制到target开始的位置
[1, 2, 3, 4, 5, 6].copyWithin(3, 0, 2); // [ 1, 2, 3, 1, 2, 6 ]
[1, 2, 3, 4, 5, 6].copyWithin(4, 0, 3); // [ 1, 2, 3, 4, 1, 2 ]
[1, 2, 3, 4, 5, 6].copyWithin(0, 4, -1); // [ 5, 2, 3, 4, 5, 6 ]
[1, 2, 3, 4, 5, 6].copyWithin(3, 0); // [ 1, 2, 3, 1, 2, 3 ]

// Array.copyWith()
const copyWithArray = [1, 2, 3, 4, 5].copyWithin(2, 1);
console.log(copyWithArray); // [ 1, 2, 2, 3, 4 ]
// 上述代码, 欲将索引位于1,2,3的元素复制到原数组索引位于2,3,4位置
// 第一步: 将位置1元素复制到位置2-->[1, 2, 2, 4, 5]
// 第二步: 将位置2元素复制到位置3-->[1, 2, 2, 2, 5]
// 第三步: 将位置3元素复制到位置4-->[1, 2, 2, 2, 2]
// 所以最后结果应该是[1, 2, 2, 2, 2], 是吗?
// 非也, 由于源范围和目标范围重叠, 所以算法会反向复制
// 反向复制顺序:
// 第一步: 将位置3元素复制到位置4-->[1, 2, 3, 4, 4]
// 第二步: 将位置2元素复制到位置3-->[1, 2, 3, 3, 4]
// 第三步: 将位置1元素复制到位置2-->[1, 2, 2, 3, 4]
// 最终结果为[1, 2, 2, 3, 4]
```

##### Object.is()
+ 执行比`===`更严格的的值比较
+ `Object.is(NaN, NaN)`的结果为`true`

#### String.prototype.repeat(n)
+ 字符串复制

#### 元编程
+ `Symbol.toStringTag`, 指定`[object ___]`字符串化时使用的字符串值
```JavaScript
// Symbol.toStringTag
function StringTag() { }
StringTag.prototype[Symbol.toStringTag] = 'StringTag';
const stA = new StringTag();
const stB = new StringTag();
stA[Symbol.toStringTag] = 'CustomTag';
console.log(stA.toString()); // [object CustomTag]
console.log(stB.toString()); // [object StringTag]
```
+ `Symbol.hasInstance`, 构造函数方法, 接收实例对象, 返回true/false指定是否是该构造函数的`实例`
```JavaScript
// Symbol.hasInstance
function InstanceConstructor(value) {
    this.key1 = value;
}
Object.defineProperty(InstanceConstructor, Symbol.hasInstance, {
    value(instance) {
        return instance.key1 === 'zhangzhen';
    }
});
const ins1 = new InstanceConstructor('zhangzhen');
const ins2 = new InstanceConstructor('kejiali');
console.log(ins1 instanceof InstanceConstructor); // true
console.log(ins2 instanceof InstanceConstructor); // false
```
+ `Symbol.toPrimitive`, 指定一个方法, 定制`抽象类型转换`的运算, 详情见示例代码
```JavaScript
// Symbol.toPrimitive
const primitiveArray = [1, 2, 3, 4, 5];
// 方法参数是类型提示, 其值为string, number或者default
// +运算没有提示, 传入default
// *运算会提示为number
// String(primitiveArray), 则会提示string
primitiveArray[Symbol.toPrimitive] = function (hint) {
    if (hint == 'default' || hint == 'number') {
        return this.reduce((x, y) => x + y);
    }
};
console.log(primitiveArray + 10); // 25
```
+ `Symbol.isConcatSpreadable`, 用于指示将一个对象传递给数组的`concat()`时`是否展开`
```JavaScript
// Symbol.isConcatSpreadable
const concatArrayA = [1, 2, 3];
const concatArrayB = [4, 5, 6];
concatArrayB[Symbol.isConcatSpreadable] = false;
console.log([].concat(concatArrayA, concatArrayB)); // [1,2,3,[4,5,6]]
```
+ `Symbol.unscopables`, 用于指示使用`with`语句时哪些属性可以或者不可以`暴露为词法变量`
```JavaScript
// Symbol.unscopables
// 记住这个名字, unscopable
// 因此当配置为true的时候, 不在with中暴露该属性
// 设置为false的时候, 在with中暴露该属性
const unscopeObject = {
    objectKey1: 1,
    objectKey2: 2,
    objectKey3: 3
}
unscopeObject[Symbol.unscopables] = {
    objectKey1: false,
    objectKey2: true,
    objectKey3: false
}
const objectKey1 = 10, objectKey2 = 20, objectKey3 = 30;
with (unscopeObject) {
    console.log(objectKey1, objectKey2, objectKey3);
    // 1 20 3
}
```

#### 代理Proxy和反射Reflect
+ Proxy封装另一个普通对象, 在`代理对象上`注册处理函数, 进行原始对象操作之外的额外操作
+ 有意思的概念: 代理更像是通用化的`getter`和`setter`
```JavaScript
// 使用代理为对象的属性读写都添加日志记录操作
let obj = { name: 'zhangzhen' };

function logAttributeAccess(target) {
    return new Proxy(target, {
        get: (target, prop) => {
            logService.log(`Access property: ${prop}`);
            return target[prop];
        },
        set: (target, prop, value) => {
            loggService.log(`Write property: ${prop} to ${value}`);
            target[prop] = value;
        }
    });
}

// 无需在原对象上添加各种代码
obj = logAttributeAccess(obj);
obj.name; // Access property: name
obj.name = 'MJ'; // Write property: name to MJ
```
+ 使用代理检测代码性能
```JavaScript
// 使用代理检测代码性能
function isPrime(number) {
    if (number < 2) {
        return false;
    }
    for (let index = 2; index < number; index++) {
        if (number % index === 0) {
            return false;
        }
    }
    return true;
}

isPrime = new Proxy(isPrime, {
    apply: (target, thisArg, args) => {
        console.time('isPrime');
        const result = target.apply(thisArg, args);
        console.timeEnd('isPrime');
        return result;
    }
});

// 无需在原函数上添加时间代码
isPrime(1234567);
// isPrime: 0.153076171875 ms
// isPrime: 0.203ms
```
+ 每个可用的代理`Proxy`处理函数都有一个与之对应的同名`Reflect`函数
+ 每个Proxy处理函数的参数都不相同, 所以需要`单独练习使用`
+ 每个Proxy处理函数在任务执行时进行`拦截`, 而每个Reflect在`原始对象`上进行相应的任务
+ 代理在`先`
```JavaScript
// 使用代理, 代理在先
const originMessage = [];
const messageHandler = {
    get(target, key) {
        if (typeof target[key] === 'string') {
            return target[key].replace(/[^\w]/g, "");
        }
        return target[key];
    },
    set(target, key, value) {
        if (typeof value === 'string') {
            value = value.toLowerCase();
            if (target.indexOf(value) == -1) {
                target.push(value.toLowerCase());
            }
        }
        return true;
    }
};
const messageProxy = new Proxy(originMessage, messageHandler);
messageProxy.push('hello...', 42, 'wOrLd!', 'wOrLd!');
messageProxy.forEach(value => console.log(value)); // hello world
originMessage.forEach(value => console.log(value)); // hello... world!
// 上述代码主要是和代理对象交流, 这种形式也被称为代理在先
```
+ 代理在`后`
```JavaScript
// 使用代理, 代理在后
const proxyHandler = {
    get(target, key, context) {
        return function () {
            context.speak(`${key}!`);
        }
    }
};
const proxy = new Proxy({}, proxyHandler);
const targetObject = {
    speak(who = 'someone') {
        console.log(`Hello, ${who}`);
    }
};
Object.setPrototypeOf(targetObject, proxy);
targetObject.speak(); // Hello, someone
targetObject.speak('zhangzhen'); // Hello, zhangzhen
targetObject.everyone(); // Hello, everyone!
// 上述代码, 创建了空对象的一个代理, 并将该代理设置为目标对象的原型
// 访问目标对象有的属性或方法, 就和代理没有联系
// 而访问对象目标上没有的属性或方法, 就会联系原型, 代理派上用场
// 这种形式主要是和目标对象交流, 也被称之为代理在后
```
+ 可用的Proxy处理函数 (并附上对应的Reflect方法和其他可触发的方法): 
    - `get`: 在代理上访问属性
      - `Reflect.get`
      - 点运算符
      - `[...]`运算符
    - `set`: 在代理上设置属性
      - `Reflect.set`
      - `=`运算符
      - 解构赋值  
  - `deleteProperty`: 在代理对象上删除属性
    - `Reflect.deleteProperty`
    - `delete`
  - `apply`: 代理对象是函数/方法
    - `Reflect.apply`
    - `call`
    - `apply`
    - 直接调用
  - `construct`: 将代理作为构造函数调用
    - `Reflect.construct`
    - `new`
  - `getOwnPropertyDescriptor`: 从代理中提取属性描述符
    - `Object.getOwnPropertyDescriptor`
    - `Reflect.getOwnPropertyDescriptor`
  - `defineProperty`: 在代理上设置一个属性描述符
    - `Object.defineProperty`
    - `Reflect.defineProperty`
  - `getPrototypeOf`: 得到代理的Prototype
    - `Object.getPrototypeOf`
    - `Reflect.getPrototypeOf`
  - `setPrototypeOf`: 设置代理的Prototype
    - `Object.setPrototypeOf`
    - `Reflect.setPrototypeOf`
  - `preventExtensions`: 使代理不可扩展
    - `Object.preventExtensions`
    - `Reflect.preventExtensions`
  - `isExtensible`: 检测代理是否可扩展
    - `Object.isExtensible`
    - `Reflect.isExtensible`
  - `ownKeys`: 提取代理自有属性和/或符号属性
    - `Object.keys`
    - `Object.getOwnPropertyNames`
    - `Object.getOwnSymbolProperties`
    - `Reflect.ownKeys`
    - `JSON.stringify`
  - `enumerate`: 取得代理自有的和继承来的可枚举属性的迭代器
    - `Reflect.enumerate`
    - `for...in`
  - `has`: 检查代理是否拥有或者“继承了”某个属性
    - `Reflect.has`
    - `Object.hasOwnProperty`
    - `"prop" in obj`
+ 代理的局限性: 以下方法都无法使用Proxy拦截
  - `typeof`
  - `String()`
  - 相等比较(==)
  - 全等比较(===)
  - 抽象类型运算(<, >)
  - ...
+ `可取消代理`:  
  - 使用`Proxy.revocable()`创建, 返回值是一个`对象`, 包括`proxy`和`revoke`两个对象  
  - 使用`revoke取消代理`后, 任何对它的访问都将抛出`TypeError` 
```JavaScript
// 可取消代理
const revokeProxyObject = { birthday: '1993-06-22' };
const proxyHandler = {
    get(target, key, context) {
        console.log(`Accessing: ${key}`);
        return target[key];
    }
};
const { proxy, revoke } = Proxy.revocable(
    revokeProxyObject,
    proxyHandler
);
console.log(proxy.birthday); // Accessing: birthday 1993-06-22
revoke();
console.log(proxy.birthday); // TypeError
```
+ 大量使用代理会严重消耗性能 
+ Reflect API: Reflect对象的静态方法可以单独使用, 类似于`Math`, 不能作为函数/构造器

#### 代理和反射的补充知识
+ 解决访问对象不存在的属性或者方法
```JavaScript
// 没有这个属性/方法!!
// 常规对象中, 访问不存在的属性, 会返回undefined, 而不是抛出错误
// 可以用代理解决这个问题
// 代理在先
const noProMetObject = {
    birthday: '1993-06-22',
    logBirthday() {
        console.log(this.birthday);
    }
};
const processHandler = {
    get(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, context);
        } else {
            throw new ReferenceError('No such property/mothod');
        }
    },
    set(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.set(target, key, context);
        } else {
            throw new ReferenceError('No such property/mothod');
        }
    },
};
const noProMetProxy = new Proxy(noProMetObject, processHandler);
noProMetProxy.birthday = '1993-06-25';
noProMetProxy.logBirthday(); // 1993-06-25
noProMetProxy.name = 'zhangzhen'; // No such property/mothod
noProMetProxy.sayName(); //No such property/mothod
// 代理在后
const emptyHandler = {
    get() {
        throw new ReferenceError('No such property/mothod');
    },
    set() {
        throw new ReferenceError('No such property/mothod');
    }
};
const emptyProxy = new Proxy({}, emptyHandler);
const emptyObject = {};
Object.setPrototypeOf(emptyObject, emptyProxy);
emptyObject.name = 'zhangzhen'; // No such property/mothod
emptyObject.logName(); // No such property/mothod
```
+ 代理`hack`链
```JavaScript
// 代理hack [[prototype]]链
// [[Prototype]]主要靠[[Get]]运算, 当直接对象中没有找到属性时
// [[Get]]会将运算转给[[Prototype]]对象处理
const propHandler = {
    get(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, context);
        } else {
            return Reflect.get(
                target[Symbol.for('[[Prototype]]')],
                key,
                context
            )
        }
    }
};
const propObject1 = new Proxy({
    name: 'zhangzhen1',
    foo() {
        console.log(`foo: ${this.name}`);
    }
}, propHandler);
const propObject2 = Object.assign(
    Object.create(propObject1),
    {
        name: 'zhangzhen2',
        bar() {
            console.log(`bar: ${this.name}`);
            this.foo();
        }
    }
);
propObject1[Symbol.for('[[Prototype]]')] = propObject2;
propObject1.bar();
// bar: zhangzhen1
// foo: zhangzhen1
propObject2.foo();
// foo: zhangzhen2
```
+ 多`prototype`链接(多继承)
```JavaScript
// 多[[prototype]]链接(多继承)
const multiPropObject1 = {
    name: 'zhangzhen1',
    foo() {
        console.log(`Object1.foo: ${this.name}`);
    }
};
const multiPropObject2 = {
    name: 'zhangzhen2',
    foo() {
        console.log(`Object2.foo: ${this.name}`);
    },
    bar() {
        console.log(`Object2.bar: ${this.name}`);
    }
};
const multiPropHandler = {
    get(target, key, context) {
        if (Reflect.has(target, key)) {
            return Reflect.get(target, key, context);
        } else {
            for (let P of target[Symbol.for('[[Prototype]]')]) {
                if (Reflect.has(P, key)) {
                    return Reflect.get(P, key, context);
                }
            }
        }
    }
};
const multiPropObject3 = new Proxy({
    name: 'zhangzhen3',
    baz() {
        this.foo();
        this.bar();
    }
}, multiPropHandler);
multiPropObject3[Symbol.for('[[Prototype]]')] = [
    multiPropObject1,
    multiPropObject2
];
multiPropObject3.baz();
// Object1.foo: zhangzhen3
// Object2.bar: zhangzhen3
```

****
**[返回主目录](../readme.md)**
