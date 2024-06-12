# JavaScript 模块

#### AMD 模块

- AMD 模块提供了名为`define`的公共函数来创建模块
- define 函数接收三个参数: `模块名称`, `依赖列表`, `工厂函数`
- `优势`: 自动处理依赖; 异步加载模块; 文件中可定义多个模块
- `不足`: 基于浏览器设计, 无法处理通用的 JavaScript 环境(如 Node.js)

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

#### CommonJS 模块

- CommonJS 面向`通用`的 JavaScript 环境, 如 Node.js 服务端等
- CommonJS 使用`基于文件`的模块系统, 一个 js 文件就是一个模块
- CommonJS 在文件中使用`module.exports`作为公共接口
- `优势`: 语法简单; 被 Node.js npm 良好的支持
- `不足`: 并不显式的支持浏览器, 需要配合打包工具

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

#### CommonJS 模块的陷阱

- 文件自动获得变量`module`, 其`exports`属性定义了公共接口

```JavaScript
// 假设模块文件CustomModule.js

// 文件自动获取名为module的内置变量
module.exports = {
  dosomething: () => {
    // do something
  }
}
```

- 文件自动获得变量`exports`, 它是对`module.exports`的引用

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

- 可以直接对`module.exports`进行赋值, 来定义导出
- `exports`不能重新赋值, 否则会引起 bug

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

#### ES6 模块

- 与 CommonJS 模块类似, 以`文件`为单位
- 与 AMD 模块类似, 支持`异步加载`模块
- 必须显式使用标识符导出模块, 才能为外部所用, `export`/`import`

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

- 默认导出: `export default`导出的成员, 导入时`不需要`加花括号

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

- 可以使用`as`对导入导出重命名

---
