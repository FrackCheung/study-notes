+ [总目录](../readme.md)
***
#### 代理和反射
+ 代理(`Proxy`)基础概念:
  - 代理对象是目标对象的替身, 所有在代理对象上的操作, 都会传播到目标对象上
  - 传播到目标对象前, 开发者可以拦截操作并嵌入额外的行为, 甚至修改操作的结果
  - 创建代理使用`Proxy`构造函数, 参数是目标对象和处理程序对象
  - `Proxy`构造函数没有`prototype`属性, 没有原型, 因此不能使用`instanceof`
  ```JavaScript
  const person = {
    name: 'zhangsan',
    age: 18
  };
  // 创建一个空程序处理对象, 代理对象的操作将没有任何拦截
  const proxy = new Proxy(person, {});
  console.log(proxy.name); // zhangsan
  console.log(proxy.age); // 18
  proxy.sex = 'male';
  console.log(person.sex); // male

  console.log(proxy instanceof Proxy); // 直接报错
  ```
+ 程序处理对象(捕获器)
  - 可以在程序处理对象中, 定义零个或多个捕获器方法
  - 操作代理对象时, 会执行相应操作的捕获器方法, 嵌入额外行为, 和修改原始行为
  - 捕获器方法只有有限种, 且每种方法都有固定的参数, 这个需要考验记忆力
  ```JavaScript
  const person = {
    name: 'zhangsan',
    age: 18
  };
  // 定义程序处理对象
  const handler = {
    get(target, property, reciever) {
      if (property === 'name') {
        return 'It is a secret';
      }
      if (property === 'age') {
        return `${target[property]}岁`;
      }
      return target[property];
    }
  };
  const proxy = new Proxy(person, handler);
  console.log(proxy.name); // It is a secret
  console.log(proxy.age); // 18岁
  ```
+ `get`捕获器方法比较简单, 可以直接通过手写来重建原始行为, 但有很多捕获器方法很复杂, 全靠手写不现实, 因此可以借助`反射API`
+ 反射(`Reflect`)基础概念:
  - `Reflect`首先是一个对象, 该对象定义了一堆方法
  - 所有的代理捕获器方法, 都可以在`Reflect`对象上找到同名的方法
  - 代理捕获器方法, 和`Reflect`同名方法, 签名一致, 行为一致
  ```JavaScript
  const person = {
    name: 'zhangsan',
    age: 18
  };
  const proxy = new Proxy(person, {
    get: Reflect.get
  });
  console.log(proxy.name); // zhangsan
  console.log(proxy.age); // 18
  ```
+ 单独使用反射 API
  - `Reflect API`并不只是局限于代理捕获器, 可以单独使用
  - 大多数反射 API 都返回状态标记, 即成功与否的布尔值, 而不是抛出错误
  ```JavaScript
  const o = {};
  if (Reflect.defineProperty(0, 'name', { value: 'zhangsan' })) {
    console.log('success');
  } else {
    console.log('failure');
  }
  ```
+ 捕获器方法总结表 (以下方法在`Reflect`上都有同名同参数, 且行为一致的方法) :

|         捕获器方法         |             作用             |               方法参数                |
| :------------------------: | :--------------------------: | :-----------------------------------: |
|           `get`            |          访问属性值          |    `(target, property, reciever)`     |
|           `set`            |          设置属性值          | `(target, property, value, reciever)` |
|      `deleteProperty`      |           删除属性           |         `(target, property)`          |
|          `apply`           |       属性是函数/方法        |     `(target, thisArg, argsList)`     |
|        `construct`         |      目标对象是构造函数      |    `(target, argsList, newTarget)`    |
| `getOwnPropertyDescriptor` |        获取属性描述符        |         `(target, property)`          |
|      `defineProperty`      |        设置属性描述符        |   `(target, property, descripter)`    |
|      `getPrototypeOf`      |         获取对象原型         |              `(target)`               |
|      `setPrototypeOf`      |         设置对象原型         |         `(target, prototype)`         |
|    `preventExtensions`     |         禁止扩展对象         |              `(target)`               |
|       `isExtensible`       |        对象是否可扩展        |              `(target)`               |
|         `ownKeys`          |    获取对象自有属性/符号     |              `(target)`               |
|        `enumerate`         |   获取对象可枚举属性迭代器   |              `(target)`               |
|           `has`            | 是否拥有某个属性(包括原型链) |         `(target, property)`          |

***
**注解**: 触发捕获器方法的方式:
+ `get`捕获器: `.`点运算符 & `...`展开运算符
+ `set`捕获器: `=`赋值 & 解构赋值
+ `deleteProperty`捕获器: `delete`
+ `apply`捕获器: `call` & `apply` & 直接加`()`调用
+ `construct`捕获器: `new`调用
+ `ownKeys`捕获器: `Object.keys` & `Object.getOwnPropertyNames` & `Object.getOwnSymbolProperties` & `JSON.stringify`
+ `enumerate`捕获器: `for...in`
+ `has`捕获器: `in` & `Object.hasOwnProperty`
***
+ 捕获器不变式
  - 目标对象做了某些限制, 比如不可扩展, 不可修改属性值等
  - 在代理上执行这些限制操作, 则会抛出错误
  ```JavaScript
  const person = {};
  Object.defineProperty(person, 'name', {
    value: 'zhangsan',
    writable: false,
    configurable: false
  });
  const proxy = new Proxy(person, {
    get() {
      return 'lisi';
    }
  });
  console.log(proxy.name); // TypeError
  ```
+ 可撤销代理: 使用`Proxy.revocable()`定义, 不加`new`, 参数一致
  ```JavaScript
  const person = { name: 'zhangsan' };
  const { proxy, revoke } = Proxy.revocable(person, {});
  console.log(proxy.name); // zhangsan
  revoke();
  console.log(proxy.name); // TypeError
  ```
+ 代理对象调用方法, `this`依旧指向代理对象(依然遵循谁调用, 指向谁的原则)
  ```JavaScript
  const person = {
    getThis() {
      console.log(this);
    }
  };
  const proxy = new Proxy(person, {});
  person.getThis(); // person对象
  proxy.getThis(); // Proxy(Object)
  ```
+ 目标对象如果有依赖`this`的情况, 则会出现 bug
  ```JavaScript
  const wm = new WeakMap();
  class Person {
    constructor() {
      wm.set(this, 'privateValue');
    }
    getPrivateValue() {
      console.log(wm.get(this));
    }
  }
  const person = new Person();
  person.getPrivateValue(); // privateValue

  const proxy = new Proxy(person, {});
  proxy.getPrivateValue(); // undefined

  // 修正, 代理类, 而非实例
  const PersonProxy = new Proxy(Person, {});
  const proxy = new PersonProxy();
  proxy.getPrivateValue(); // privateValue
  ```
+ 代理的示例1: 函数调用计时
  ```JavaScript
  function isPrime(number) {
    // ...是否为素数
  }
  isPrime = new Proxy(isPrime, {
    apply(target, thisArg, args){
      console.time('isPrime');
      const result = Reflect.apply(target, thisArg, args);
      console.timeEnd('isPrime');
      return result;
    }
  })
  ```
+ 代理示例2: 日志记录
  ```JavaScript
  const person = {};
  const proxy = new Proxy(person, {
    setPrototypeOf(target, prototype) {
      console.log(`修改${target}对象的原型, 修改时间: ${TimeUtil.getFormatTime()}`);
      return Reflect.setPrototypeOf(target, prototype);
    }
  });
  Object.setPrototypeOf(proxy, {});
  ```
