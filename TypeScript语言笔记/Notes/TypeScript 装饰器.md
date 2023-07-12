# TypeScript 装饰器

**[返回主目录](../readme.md)**

#### 装饰器的概念
+ 不修改类声明和类结构的条件下, 改变类的行为
+ 一个很好的比喻: 
  - 就像是套在水龙头上的泡沫器
  - 可以使水带上泡沫, 也可以啥也不干
  - 而且不影响水龙头本身的结构
+ TypeScript装饰器只能出现在`类`中各处, 使用`@Decorator`形式
+ 按照出现的位置, 可分为
  - `类`装饰器: 修饰类本身
  - `方法`装饰器: 修饰类方法(包括实例方法和静态方法)
  - `属性`装饰器: 修饰类属性(包括实例属性和静态属性)
  - `访问`装饰器: 修饰get/set访问器属性
  - `参数`装饰器: 修饰方法参数(包括实例方法参数, 静态方法参数和构造函数参数)
***
**初步入门:** 装饰器修饰效果如下, 后文会详细介绍每一种装饰器的含义和用法
```TypeScript
@ClassDecorator // 类装饰器
class Person {

    @AttributeDecorator // 属性装饰器
    private _name: string;

    constructor(@ParamDecorator name: string) { // 参数装饰器
        this._name = name;
    }

    @MethodDecorator // 方法装饰器
    public greeting(): void {
        return `Hello`;
    }

    @AccessDecorator // 访问装饰器
    private get name(): void {
        return this._name;
    }

    @MethodDecorator // 方法装饰器
    public static GetStandardWeight(@ParamDecorator height: number): number { // 参数装饰器
        return height - 105;
    }
}
```
***



#### 装饰器的释义
+ 装饰器使用形如`@Decorator`的语句, 放置在对应的目标上方, 已达到修饰作用
+ 装饰器的`求值结果`必须是一个带有符合要求的参数的`函数`
  - 使用`@Decorator`: 本身是一个符合要求的函数
  - 使用`@Decorator()`, 其运行结果是一个符合要求的函数
+ 更推荐使用`@Decorator()`, 可以实现更多的操作

```TypeScript
// 以类装饰器为例, 类装饰器函数只有一个参数: 类的构造函数

// 定义装饰器函数
function Decorator(constructor) { /**  */ }

@Decorator // 使用装饰器, 这里代表了一个接受constructor参数的函数
class Person { /**  */ }



// 第二种装饰器函数的定义方法
function Decraotor() {
    return function(constructor) { /**  */ };
}

@Decorator() // 使用装饰器, 这里也代表了一个接受constructor参数的函数
class Person { /**  */ }
```

#### 装饰器的应用顺序
+ 首先是处理`实例成员`, 依次应用:
  - `参数`装饰器
  - `方法`装饰器
  - `访问`装饰器
  - `属性`装饰器
+ 其次是处理`静态成员`, 依次应用: 
  - `参数`装饰器
  - `方法`装饰器
  - `访问`装饰器
  - `属性`装饰器
+ 接着是处理`构造函数`, 应用`参数`装饰器
+ 最后在`类`上应用`类`装饰器

#### 类装饰器
+ **参数:** 类装饰器只有一个参数, 类的`构造函数`
+ **返回值:** 返回值会`替换`类原本的声明(变成新的类)

```TypeScript
// 利用类装饰器, 将被装饰的类完全替换成一个新的类
function ClassDecorator<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        public property1: string = 'decorator';
        public property2: string = 'decorator';
    }
}

@ClassDecorator
class ExampleClass {
    public property1: string = 'not decorator';
    public property2: string;
    constructor(message: string) {
        this.property2 = message;
    }
}
const ec = new ExampleClass('zhagnzhen');
console.log(ec); 
// Person { property1: 'decorator', property2: 'decorator' }
```

#### 方法装饰器
+ **参数:** `target`, `property`, `descripter`
  - `target`: 对于`静态成员`: 是类的构造函数, 对于`实例成员`: 是类的原型对象
  - `property`: 成员的`名字`
  - `descripter`: 成员的`属性描述符`(若TS代码编译目标`低于ES5`, 将会为`undefined`)
+ **返回值:** 返回值会用作方法的属性描述符
```TypeScript
// 利用方法装饰器, 改写被装饰的方法, 这里用到了参数来控制是否改写
function MethodDecorator(override: boolean) {
    return function (target: any, propertyKey: string, descripter: PropertyDescriptor) {
        if (override) {

            // 改写原方法
            descripter.value = function () {
                console.log('this method was override!');
            }
        }
    }
}

class ExampleClass {

    @MethodDecorator(true)
    public doSomething1(): void {
        console.log('something1 was did!');
    }

    @MethodDecorator(false)
    public doSomething2(): void {
        console.log('something2 was did!');
    }
}
const ec = new ExampleClass();
ec.doSomething1(); 
// this method was override!
ec.doSomething2(); 
// something2 was did!
```

#### 访问装饰器
+ **参数:** `target`, `property`, `descripter`
  - `target`: 对于`静态成员`: 是类的构造函数, 对于`实例成员`: 是类的原型对象
  - `property`: 成员的`名字`
  - `descripter`: 成员的`属性描述符`(若TS代码编译目标`低于ES5`, 将会为`undefined`)
+ **返回值:** 返回值会用作方法的属性描述符
+ 不允许同时装饰一个成员的`get`和`set`访问器

```TypeScript
// 访问装饰器, 目前还没研究出有什么用, 估计是要和其他东东一起使用
function AccessorDecorator(configurable: boolean) {
    return function (target: any, propertyKey: string, descripter: PropertyDescriptor) {
        descripter.configurable = configurable;
    }
}

class ExampleClass {
    private _x: number;
    private _y: number;
    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    @AccessorDecorator(true)
    public get x() {
        return this._x;
    }

    @AccessorDecorator(false)
    public get y() {
        return this._y;
    }
}
```

#### 属性装饰器
+ **参数:** `target`, `property`
  - `target`: 对于`静态成员`: 是类的构造函数, 对于`实例成员`: 是类的原型对象
  - `property`: 成员的名字
+ **返回值:** 会被忽略
```TypeScript
// 利用属性装饰器给属性赋默认值(研究一下Angular的@Input())
function AttributeDecorator(value: string) {
    return function (target: any, property: string) {
        target[property] = value;
    }
}

class ExampleClass {

    @AttributeDecorator('default-title') title: string | undefined;

    @AttributeDecorator('default-name') name: string | undefined;

    public log(): void {
        console.log(this.title);
        console.log(this.name);
    }
}
const ec = new ExampleClass();
ec.log();
// default-title
// default-name
```

#### 参数装饰器
+ **参数:** `target`, `property`, `index`
  - `target`: 对于`静态成员`: 是类的构造函数, 对于`实例成员`: 是类的原型对象
  - `property`: 成员的名字
  - `index`: 参数在函数参数列表中的`索引`
+ **返回值:** 会被忽略

```TypeScript
// 参数装饰器查看参数的索引, 目前没有研究出有什么用, 估计是和其它东东一起使用
function ParameterDecorator() {
    return function (target: any, propertyKey: string, index: number) {
        console.log(`参数装饰器装饰在了第${index}个参数上`)
    }
}

class ExampleClass {
    public mutiParameterMethod(
        name: string,
        age: number,
        @ParameterDecorator() height: number,
        weight: number
    ) {
        // 逻辑代码
    }
}
const ec = new ExampleClass();
ec.mutiParameterMethod('zhangzhen', 28, 173, 180);
// 参数装饰器装饰在了第2个参数上
```
****
**[返回主目录](../readme.md)**