+ [总目录](../readme.md)
***
- [模块基本概念](#模块基本概念)
- [CommonJS模块](#commonjs模块)
- [异步模块定义](#异步模块定义)
- [通用模块定义](#通用模块定义)
- [ES6模块](#es6模块)
***
#### 模块基本概念
+ 所有模块系统都支持循环依赖: AMD/ES6/CommonJS等
+ ES6模块之前, 通常使用函数作用域和IIFE立即执行函数将模块定义在闭包中
```JavaScript
const Module = (function() {
  let _privateValue = 0;
  return {
    getPrivateValue() {
      return _privateValue;
    },
    setPrivateValue(value) {
      _privateValue = value;
    }
  }
})();

Module.getPrivateValue(); // 0
Module.setPrivateValue(10);
Module.getPrivateValue(); // 10
```

#### CommonJS模块
+ CommonJS模块不能用在浏览器中
+ CommonJS 使用基于文件的模块系统, 一个js文件就是一个模块
+ 使用`require`定义导入
+ 使用`exports`和`module.exports`定义导出
```JavaScript
const fs = require('fs');
module.exports = {
  createReadStream: fs.createReadStream
};
exports.appendFile = fs.appendFile;
```
+ `require`是同步加载, 也可以出现在任何需要的地方
+ 模块标识符可以指向文件, 也可以指向包含index.js文件的目录
```JavaScript
// 在目录modules下创建index.js文件
module.exports = {
  createReadStream: require('fs').createReadStream,
  join: require('path').join
};

// 在其他地方可以直接导入
const myModule = require('./modules');
const file = myModule.join(__dirname, '123.txt');
const stream = myModule.createReadStream(file);
```
+ `require`导入是单例的, 无论导入多少次, 都只有一个实例
```JavaScript
const fs1 = require('fs');
const fs2 = require('fs');
console.log(fs1 === fs2); // true
```
+ `require`会缓存加载后的模块, 后续再加载会获取缓存的模块
+ `require`导入的模块会原封不动的加载, 里面的代码也会执行
```JavaScript
// moduleA.js
console.log('moduleA');
module.exports = {};

// moduleB.js
require('moduleA'); // moduleA
require('moduleA');
```
+ `require`支持动态导入, 可以传入变量
```JavaScript
const moduleMap = new Map([
  ['development', 'moduleDev.js'],
  ['production', 'modulePro.js']
]);
const serverIP = require(moduleMap.get(mode)).serverIP;

const fsModule = 'fs';
const stream = require(fsModule).createReadStream('1.txt');
```
+ CommonJS模块文件内置`module`变量, 其`exports`属性定义了导出接口
+ CommonJS模块文件内置`exports`变量, 是`module.exports`的引用
+ 定义导出接口的唯一方式: 通过`module.exports`定义
+ `exports`可以使用点语法追加导出, 但不能重新赋值
```JavaScript
module.exports = {
  readFile: require('fs').readFile
};
exports.writeFile = require('fs').writeFile;

// 不能这么干
exports = { /** */ }
```
+ CommonJS模块支持动态依赖
```JavaScript
const myModule = condition ? require('moduleA') : require('moduleB');
```

#### 异步模块定义
+ 异步模块定义: Asynchronous Module Definition, AMD
+ AMD的模块系统以浏览器为目标执行环境
+ AMD使用`define`函数定义模块, 该函数有三个参数
  - 要定义的模块名称: 字符串
  - 依赖模块列表: 字符串数组
  - 模块工厂函数: 处理完依赖模块后, 将依赖模块赋给工厂函数的参数
```JavaScript
// 定义moduleA, 依赖moduleB
define('moduleA', ['moduleB'], moduleB => {
  return {
    method: moduleB.method
  }
});
```
+ AMD也支持`require`和`exports`, 可以在模块工厂函数内部使用CommonJS风格的模块
```JavaScript
define('myModule', ['require', 'exports'], (require, exports) =>{
  const moduleB = require('moduleB');
  exports.method = moduleB.method;
});
```

#### 通用模块定义
+ 通用模块定义: Universal Module Definition, UMD
+ UMD为了统一CommonJS和AMD的生态系统
+ UMD可以创建CommonJS和AMD都能使用的模块代码
+ UMD定义的模块在启动时检测使用哪个模块系统, 并将代码包装在IIFE中
```JavaScript
(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define(["moduleB"], factory);
  } else if (typeof module === "object" && module.exports) {
    module.exports = factory(require("moduleB"));
  } else {
    root.returnExports = factory(root.moduleB);
  }
})(this, function (moduleB) {
  return {
    method: moduleB.method,
  };
});
```
+ UMD有现成的处理方式, 开发者只需要关注自身的逻辑, 不要手写上述代码
***
**注解:** 上述几种模块系统是在ES6模块问世前诞生的, 目前ES6模块的支持程度已经越来越高, 开发者应该尽可能使用ES6模块
```json
{
  "type": "module",
  "scripts": {},
  "dependencies": {}
}
```
***

#### ES6模块
+ ES6模块使用`type=module`在脚本中使用, 可以内嵌, 也可以引入
```html
<script type="module">
  import moduleA from 'moduleA';
  export {
    method: moduleA.method
  }
</script>

<script type="module" src="moduleA.js"></script>
```
+ 模块会立即下载, 但只会在文档解析完成后执行, 类似于`defer`
+ 模块的执行顺序和出现的顺序一致
```html
<!-- 第二个执行 -->
<script type="module" src="moduleA.js"></script>
<!-- 第三个执行 -->
<script type="module" src="moduleB.js"></script>
<!-- 第一个执行 -->
<script src="index.js"></script>
```
+ 同一个模块只会被加载一次
```html
<script type="module">
  import moduleA from 'moduleA.js';
</script>
<script type="module">
  import moduleA from 'moduleA.js';
</script>
<script type="module" src="moduleA.js"></script>
<script type="module" src="moduleA.js"></script>
```
+ ES6模块的具体行为
  - 模块代码只在加载后才会执行, 且模块只会加载一次, 单例
  - 模块支持循环依赖
  - 模块内部默认启用严格模式
  - 模块不共享全局命名空间
  - 模块顶级`this`是`undefined`
  - 模块是异步加载和执行的
+ 模块导出: `export`
  - `export`只能在模块顶级使用, 不允许嵌套在其他块中
  - `export`可以先导出, 在定义导出值, 但不推荐这么做
  - `export`支持命名导出, 以及别名导出
  - 使用`export default`和`as default`定义默认导出
  - 一个模块只能有一个默认导出
  - 别名导出只能在花括号内
```JavaScript
// export只允许出现在模块顶级
export const PI = 3.1415926;
if (condiction) {
  export const E = 2.7; // 不允许
}

// 可以先导出, 在定义
export CESIUM_KEY;
const CESIUM_KEY = 'HSDD987789DJKD';

// 命名导出
export class Person {}
export const CESIUM_KEY = 'HSDD987789DJKD';

// 别名导出
export { CESIUM_KEY as KEY };

// 默认导出
export default CESIUM_KEY;
export { CESIUM_KEY as default };
```
***
**注解:** `export`导出的成员在外部被修改, 会影响模块内部的值吗?
***

+ 模块导入: `import`
  - `import`必须出现在模块顶级, 不允许出现在其他块中
  - `import`可以出现在顶级内的任意位置, 但建议写在最顶部
  - `import`语句会被提升到模块最顶部
  - `import`标识符必须是纯字符串, 不能是变量和动态计算结果
  - 浏览器原生加载模块, 文件必须带有`.js`扩展名
  - 导入对于模块而言是只读的, 但可以修改导出对象的属性
  - `* as`批量导入, 不能直接修改其值, 类似于`Object.freeze`
  - `import`可以使用别名, 默认导出的成员也可以赋别名
  - 导入默认导出的成员不需要加括号
```JavaScript
// 导入标识符必须是纯字符串
const A = 'A';
import `module${A}.js`; // 不允许

// 别名
import * as echarts from 'echarts';
import { default as defaultModule } from 'moduleA.js';
```
+ 模块转移导出
```JavaScript
export * from 'moduleA.js';
```
+ 工作模块
```JavaScript
const scriptWorker = new Worker('script.js');
const moduleWorker = new Worker('module.js', {
  type: 'module'
});
```
