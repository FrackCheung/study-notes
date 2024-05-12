# JavaScript 模块

**[返回主目录](../readme.md)**

#### AMD模块
+ AMD模块提供了名为`define`的公共函数来创建模块
+ define函数接收三个参数: `模块名称`, `依赖列表`, `工厂函数`
+ `优势`: 自动处理依赖; 异步加载模块; 文件中可定义多个模块
+ `不足`: 基于浏览器设计, 无法处理通用的JavaScript环境(如Node.js)
```JavaScript
// 使用AMD模块机制定义一个依赖jQuery的模块
define('MouseCountModule', ['jQuery'], $ => {
    let countNum = 0;
    const handleClick = () => {
        console.log(++countNum);
    };

    return {
        countClicks: () => {
            $(document).on('click', handleClick);
        }
    }
})
```

#### CommonJS模块
+ CommonJS面向`通用`的JavaScript环境, 如Node.js服务端等
+ CommonJS使用`基于文件`的模块系统, 一个js文件就是一个模块
+ CommonJS在文件中使用`module.exports`作为公共接口
+ `优势`: 语法简单; 被Node.js npm良好的支持
+ `不足`: 并不显式的支持浏览器, 需要配合打包工具
```JavaScript
// 定义CommonJS模块, MouseClickModule.js
const $ = require('jQuery');
let clickNum = 0;
const handleClick = () => {
    console.log(++clickNum);
};

module.exports = {
    countClicks: () => {
        $(document).on('click', handleClick);
    }
}
```

#### CommonJS模块的陷阱
+ 文件自动获得变量`module`, 其`exports`属性定义了公共接口
```JavaScript
// 假设模块文件CustomModule.js

// 文件自动获取名为module的内置变量
module.exports = {
    dosomething: () => {
        // do something
    }
}
```
+ 文件自动获得变量`exports`, 它是对`module.exports`的引用
```JavaScript
// 假设模块文件CustomModule.js

// 文件自动获取名为exports的内置变量, 该变量指向module.exports
exports.doSomething = () => {
    // doSomething
}

exports.doSomething2 = () => {
    // doSomething2
}

// exports通过点语法追加的方法, 会自动应用到module.exports上
```
+ 可以直接对`module.exports`进行赋值, 来定义导出
+ `exports`不能重新赋值, 否则会引起bug
```JavaScript
// 假设模块文件CustomModule.js

// 别这么干!
exports = {
    doSomething: () => {
        // doSomething
    }
}
// 重新赋值会打破对module.exports的引用, 实际上并没有任何导出
```

#### ES6模块
+ 与CommonJS模块类似, 以`文件`为单位
+ 与AMD模块类似, 支持`异步加载`模块
+ 必须显式使用标识符导出模块, 才能为外部所用, `export`/`import`
```JavaScript
// module.js
// 导出
export const PI = 3.1415926;

// 导出
export function getArea(radius) {
    return PI * radius * radius;
}

// other.js
// 导入
import { PI, getArea } from 'module.js';
```
+ 默认导出: `export default`导出的成员, 导入时`不需要`加花括号
```JavaScript
// 默认导出
export default class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}

// 普通导出
export const PI = 3.1415;

// 导入
import Person, { PI } from 'module.js';
```
+ 可以使用`as`对导入导出重命名

#### ES6模块
+ ES6模块是`单文件`模块, 不能把多个模块合在一个文件中
+ ES6是`静态`模块, 需要预先静态定义所有的导入导出, 无法动态补充
+ ES6模块是`单例`, 模块只有一个实例, 多个导入是对单个实例的引用
+ ES6模块导出的属性/方法/原始值都是`绑定`, 类似于`指针`, 模块内部修改会影响导出
+ ES6之前的模块中暴露的`原始值`不是引用, 是`复制赋值`, 模块内部的修改不影响导出
+ 模块导出的陷阱
```JavaScript
// 模块导出的陷阱
// 1
export function moduleA() { }
// 2
function moduleB() { }
export { moduleB as default };
// 第1种: 导出的是函数表达式的值, 即使给moduleA重新赋值, 导出的依然是该函数
// 第2种: 导出的是标识符, 如果对moduleB重新赋值, 导出的值也会随之变化
```
+ `import`和`export`必须出现在`最顶层`作用域
+ `import`导入的成员`不允许`对其`重新赋值`
+ `import`导入语句是会`提升`的
+ ES6模块是`静态加载语义`的, 即使有循环依赖, 任何一个运行之前两者都将加载
+ 循环依赖
```JavaScript
// 循环依赖, 静态决议, 预先静态加载, 
// 模块A
import moduleFromB from B;
export default function methodA(x) {
    if (x >= 10) {
        return methodB(x - 1);
    }
    return x2;
}

// 模块B
import moduleFromA from A
export default function methodB(y) {
    if (y > 5) {
        return methodA(y / 2);
    }
    return y3;
}
// A和B循环依赖, 但是不影响使用, 因为在使用之前A和B都已经加载决议
```

#### 模块加载
+ `import`语句使用外部环境提供的独立机制将模块标识符解析为可用指令
  - `浏览器`会将模块标识符解析为`URL`(一般情况下)
  - `Node.js`会将模块标识符解析为`文件系统路径`
+ 模块加载器本身不由ES6指定

****
**[返回主目录](../readme.md)**