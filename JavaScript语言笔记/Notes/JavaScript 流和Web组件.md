+ [总目录](../readme.md)
***
- [流](#流)
- [Web组件](#web组件)
***
#### 流
+ 流的基本单位: `chunk`块, 可以是任意数据类型, 通常是定型数组
+ 流的内部队列: 为进入流但尚未离开的`chunk`提供一个队列
+ 流的反压: 进入速度大于离开速度, 内部队列不断增大, 到达阈值后, 会停止进入
+ 流主要分为三大类: 可读流, 可写流, 以及转换流
+ 可读流: 使用`ReadableStream`构造函数创建一个可读流实例, 并实现`start`方法
  - `start`方法的参数是一个控制器, 主要有两个方法
    - `enqueue`方法, 将值传入流
    - `close`方法, 关闭流
  - 调用实例的`getReader`方法, 获取读取实例, 调用该方法后, 还会锁住流
  - 在读取实例上反复调用`read`方法, 持续读取队列中的数据
  ```JavaScript
  // 睡眠函数, 用于间隔时间生成值
  const sleep = delay => new Promise(resolve => setTimeout(resolve, delay));

  // 数据
  const data = [1, 2, 3, 4, 5];

  // 创建可读流, 实现其start方法
  const readableStream = new ReadableStream({
    async start(controller) {
      for (const chunk of data) {
        controller.enqueue(chunk)
        await sleep(Math.random() * 2000);
      }
      controller.close();
    }
  });

  // 从流中读取数据
  console.log(readableStream.locked);
  const reader = readableStream.getReader();
  console.log(readableStream.locked);

  // 一次read, 只会读取一个数据, 所以需要在循环中持续读取
  (async () => {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        return;
      }
      console.log(value);
    }
  })()
  ```
  ```mermaid
  graph TD
  A["new ReadableStream()"]
  G[可读流实例]
  E[读取实例]
  F["值: Promise<{ done: boolean, value: any }>"]

  subgraph CC[构造函数参数, 参数是一个对象]
  B[实现start方法, 参数为控制器, 必须]
  C[调用enqueue传值入流]
  D[调用close关闭流]
  end

  A ==> CC
  B ==> C
  B ==> D
  CC ==> G
  G ==>|调用可读流实例的getReader方法| E
  E ==>|调用read方法读取值| F
  ```
***
**注解1**: 可读流可以向里面添加数据, 这有点反直觉, 可读流的核心是可供读取, 但是不能读一个空的流, 因此可读流提供了添加数据的方法, 这是创建自定义可读流的示例

**注解2**: `start`方法在创建实例时, 只会调用一次, 因此写入数据更适合描述为初始化数据, 实例一旦创建, 可读流中将再也没有任何办法写入数据

**注解3**: 在实际应用中, 开发者收到的都是已经就绪的可读流, 如`fetch`接口的返回值, 不需要手动添加数据, 直接读取即可
***
+ 可写流, 使用`WritableStream`构造函数创建可写流实例, 并实现`write`方法
  - `write`方法不是必须要实现的, 如果没有额外的操作, 也可以不用写
  - 调用实例的`getWriter`方法, 获取写入实例, 调用该方法后, 还会锁住流
  - 在写入实例上反复调用`write`方法, 持续向流中写入数据
  - 写入完成后, 调用写入实例的`close`方法, 关闭流
  ```JavaScript
  // 睡眠函数, 用于间隔时间生成值
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  // 数据
  const data = [1, 2, 3, 4, 5];

  // 直接写const writableStream = new WritableStream()也行
  const writableStream = new WritableStream({
    write(value) {
      console.log(value);
    },
  });

  console.log(writableStream.locked);
  const writer = writableStream.getWriter();
  console.log(writableStream.locked);

  (async () => {
    for (const chunk of data) {
      await writer.write(chunk);
      await sleep(Math.random() * 2000);
    }
    writer.close();
  })()
  ```
  ```mermaid
  graph TD
  A["new WritableStream()"]
  G[可写流实例]
  E[写入实例]
  F[关闭流]

  subgraph CC[构造函数参数, 参数是一个对象]
  B[实现write方法, 提供额外的能力, 可选]
  end

  A ==> CC
  CC ==> G
  G ==>|调用可写流实例的getWriter方法| E
  E ==>|调用write方法写入值| F
  ```
***
**注解1**: 可写流的数据写入过程是在创建可写流实例之后, 只要不调用`close`关闭流, 则可以在任何时候写入数据, 这是和可读流的`start`初始化数据最大的区别

**注解2**: 创建可写流实例的时候实现的`write`方法, 和调用写入实例上的`write`方法, 不是一回事, 不要混为一谈, 但后者每次写入, 也都会调用前者

**注解3**: 可写流没有任何方法可以读取, 如需读取数据, 需要将其转换为可读流, 或者使用接下来要介绍的转换流
***
+ 转换流: 组合可读流和可写流, 可写流通过转换流, 变为可读流
  - 使用`TransformStream`构造函数创建转换流实例, 并实现`transform`方法
  - 数据块从可写流流向可读流, 该过程可以通过`transform`方法拦截并实现额外功能
  - `transform`方法不是必须的, 如果不需要额外能力, 则可以不传
  - 转换流实例会同时提供读取实例和写入实例, 以提供同时读写的能力
  ```JavaScript
  // 睡眠函数, 用于间隔时间生成值
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  // 数据
  const data = [];
  for (let index = 1; index <= 1000; index++) {
    data.push(`数据: ${index}`);
  }

  // 不需要额外能力的话
  // 可以直接写 const { readable, writable } = new TransformStream()
  const { readable, writable } = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(`${chunk}---通过转换流追加的内容`);
    },
  });

  const reader = readable.getReader();
  const writer = writable.getWriter();

  // 写入数据
  (async () => {
    for (const item of data) {
      await writer.write(item);
      await sleep(Math.random() * 200);
    }
    writer.close();
  })();

  // 读取数据
  (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      console.log(value);
    }
  })();
  // 数据: 1---通过转换流追加的内容
  // 数据: 2---通过转换流追加的内容
  // 数据: 3---通过转换流追加的内容
  // 数据: 4---通过转换流追加的内容
  // 数据: 5---通过转换流追加的内容
  // 数据: 6---通过转换流追加的内容
  // ...
  ```
  ```mermaid
  graph TD
  A["new TransformStream()"]
  G[可写流实例]
  E[写入实例]
  F[关闭写入]
  H[可读流实例]
  I[读取实例]
  J["值: Promise<{ done: boolean, value: any }>"]

  subgraph CC[构造函数参数, 参数是一个对象]
  B[实现transform方法, 提供额外的转换能力, 可选]
  end

  A ==> CC
  CC ==> G
  CC ==> H
  G ==>|调用可写流实例的getWriter方法| E
  E ==>|调用write方法写入值| F
  H ==>|调用可读流实例的getReader方法| I
  I ==>|调用read方法读取值| J
  ```
***
**注解1**: 运行上面这个转换流的示例, 控制台会立刻开始打印出读取结果, 并不是等写入完成之后, 才开始读取, 这里用到了两个知识点:
+ 转换流可以边读边写, 互不影响, 写入数据后, 就可以马上读取到
+ `await`的作用是暂停函数, 写入函数和读取函数就在不停的暂停/恢复, 二者反复交替

**注解2**: 小总结
+ `ReadableStream`构造函数, 其参数对象的`start`方法必须, 且只执行一次
+ `WritableStream`构造函数, 其参数对象的`write`方法可选, 且反复执行
+ `TransformStream`构造函数, 其参数对象的`transform`方法可选, 且反复执行

**注解3**: 转换流实例自己提供了可读流和可写流, 用于读写数据, 如果已经有了一个可读流, 需要对其进行转换, 然后将结果输出为新的可读流, 需要借助管道流
***
+ 管道流, 将已有的流用管道相连接, 从一个流到另一个流
  - 只有可读流才能作为管道的起点, 即可读流才有使用管道的能力
  - `pipeThrough`: 将可读流连接到转换流, 以提供额外的能力
  - `pipeTo`: 将可读流连接到可写流, 将值写入可写流
  - 只有可读流实例才有这两个方法
  - 可读流连接到转换流
  ```JavaScript
  // 睡眠函数, 用于间隔时间生成值
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  // 数据
  const data = [1, 2, 3, 4, 5];

  // 创建初始可读流
  const originReadableStream = new ReadableStream({
    async start(controller) {
      for (const chunk of data) {
        controller.enqueue(chunk);
        await sleep(Math.random() * 1000);
      }
      controller.close();
    },
  });

  // 创建一个转换流, 将原值放大10倍
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      controller.enqueue(chunk * 10);
    },
  });

  // 管道连接
  const pipeStream = originReadableStream.pipeThrough(transformStream);

  const reader = pipeStream.getReader();

  (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        return;
      }
      console.log(value);
    }
  })();
  // 10
  // 20
  // 30
  // 40
  // 50
  ```
  - 可读流连接到可写流
  ```JavaScript
  // 睡眠函数, 用于间隔时间生成值
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

  // 数据
  const data = [1, 2, 3, 4, 5];

  // 创建初始可读流
  const originReadableStream = new ReadableStream({
    async start(controller) {
      for (const chunk of data) {
        controller.enqueue(chunk);
        await sleep(Math.random() * 1000);
      }
      controller.close();
    },
  });

  // 创建可写流
  const writeableStream = new WritableStream({
    write(value) {
      console.log(`从可读流中接受到数据, 并写入, 写入值: ${value}`);
    }
  });

  originReadableStream.pipeTo(writeableStream); 
  // 从可读流中接受到数据, 并写入, 写入值: 1
  // 从可读流中接受到数据, 并写入, 写入值: 2
  // 从可读流中接受到数据, 并写入, 写入值: 3
  // 从可读流中接受到数据, 并写入, 写入值: 4
  // 从可读流中接受到数据, 并写入, 写入值: 5
  ```
***
**注解**: `pipeTo`方法隐式获取了可读流的读取器, 并且自动开始读取值, 读到一个, 就写入一个
***

#### Web组件
+ Web组件用于增强DOM的行为, 规范比较混乱, 本文档只针对于Chrome浏览器下的实现
+ Web组件主要包含三个部分的内容: HTML模板, 影子DOM和自定义元素
+ HTML模板, 主要使用`<template>`标签创建, 主要的特点有
  - 使用该标签包裹的HTML结构会被解析为DOM树, 但是不会渲染到页面
  - CSS选择器, 元素查找API等, 都无法选取到该标签内的内容
  - `<template>`标签包裹的HTML片段实际上存在于`DocumentFragment`中
  - 通过`<template>`元素的`content`属性, 可以取到`DocumentFragment`的引用
  - 取到引用之后, 可以使用`appendChild`等方法, 添加到主DOM树中, 并渲染
  - 为保持模板的通用性, 可以使用`document.importNode`深复制, 再添加
  - `<template>`标签内可以包含`<script>`脚本
  - `template`的基本用法
  ```html
  <template>
    <p>Hello, World</p>
  </template>
  <script>
    const p = document.querySelector('p');
    const template = document.querySelector('template').content;
    const tp = template.querySelector('p');
    console.log(p, tp); // null <p>...</p>
    document.body.appendChild(document.importNode(template, true));
  </script>
  ```
  - `template`嵌入脚本内容
  ```html
  <template>
    <script>console.log('Hello, World')</script>
  </template>
  <script>
    const template = document.querySelector('template').content;
    document.body.appendChild(document.importNode(template, true));
    // Hello, World
  </script>
  ```
***
**注解**: `template`的优点是可以组合一个可复用的模板, 缺点是:
+ 除了内联样式, 无法使用独立的CSS样式表, 只能使用全局CSS样式表, 这会影响到全局的其他元素
+ 模板不能像前端框架那样, 提供一个简单的自定义标签来使用, 渲染时自动将自定义标签替换为模板内容
+ 没有自定义标签, 也就不能使用自定义的属性
***
+ 影子DOM, 和`<template>`有相似的地方, 也是定义了一个实际的DOM结构, 具有以下特点
  - 影子DOM必须附着到某个实际的DOM元素上, 不能单独存在, 这个实际的DOM元素被称为影子宿主
  - 影子DOM的内容会直接渲染到页面上, 且其优先级高于影子宿主, 因此会替换掉影子宿主的内容
  - 影子DOM如果提供了插槽`<slot>`, 影子宿主的内容将不会被替换, 而是渲染到插槽中
  - 影子DOM可以提供具名插槽`<slot name="xxx">`, 则影子宿主上`slot="xxx"`的元素会被渲染到对应的插槽中
  - 影子DOM可以封装CSS规则, 或者提供单独的`<style>`样式表, 该样式表只在影子DOM中生效
  - 影子DOM中的事件会渗透到影子宿主上, 这被称为事件重定向
  - 使用`attachShaow`附着影子DOM, 其参数是一个对象, 必须至少包含`mode`属性:
    - `mode`值为`open`: 可以通过影子宿主的`shadowRoot`属性访问到影子DOM
    - `mode`值为`closed`: 影子DOM无法访问到
  - 创建影子DOM
  ```html
  <div>
    <p>Hello, World</p>
  </div>
  <script>
    const div = document.querySelector('div');
    div.attachShadow({ mode: "open" }); // 如果设置为closed, 下面的代码将不会成功
    div.shadowRoot.innerHTML = `
      <p>Shadow DOM</p>
    `;
    // 页面上实际会渲染出 Shadow DOM
  </script>
  ```
  - 插槽`slot`
  ```html
  <div>
    <p>Hello, World</p>
  </div>
  <script>
    const div = document.querySelector('div');
    div.attachShadow({ mode: "open" }); // 如果设置为closed, 下面的代码将不会成功
    div.shadowRoot.innerHTML = `
      <p>Shadow DOM</p>
      <p><slot></slot></p>
    `;
    // 页面上实际会渲染出 Shadow DOM 以及 Hello, World
  </script>
  ```
  - 具名插槽`<slot name="xxx">`
  ```html
  <div>
    <p slot="slot1">Hello, World 1</p>
    <p slot="slot2">Hello, World 2</p>
  </div>
  <script>
    const div = document.querySelector("div");
    div.attachShadow({ mode: "open" });
    div.shadowRoot.innerHTML = `
      <p>Shadow DOM</p>
      <p><slot name="slot1"></slot></p>
      <p><slot name="slot2"></slot></p>
    `;
  // 页面上实际会渲染出 Shadow DOM , Hello, World 1 以及 Hello, World 2
  </script>
  ```
  - 影子DOM和`template`一起使用
  ```html
  <div>
    <p slot="slot1">Hello, World 1</p>
    <p slot="slot2">Hello, World 2</p>
  </div>
  <!-- 创建一个模板作为影子DOM的内容 -->
  <template>
    <p class="red">Shadow DOM</p>
    <p><slot name="slot1"></slot></p>
    <p><slot name="slot2"></slot></p>
    <style>
      .red { color: red; }
    </style>
  </template>
  <script>
    const div = document.querySelector("div");
    div.attachShadow({ mode: "open" });
    div.shadowRoot.appendChild(document.querySelector('template').content);
    // 页面上实际会渲染出 Shadow DOM(红色) , Hello, World 1 以及 Hello, World 2
  </script>
  ```
***
**注解**:   
影子DOM的优点是:
+ 提供了替换影子宿主的模板
+ 使用插槽丰富化渲染
+ 可以使用独立的CSS样式表

缺点是: 
+ 依然无法提供一个单独的自定义标签
+ 没有可配置的自定义属性
***
+ 自定义元素, 通过JavaScript定义并创建自定义元素, 具有如下的特点和要求
  - 创建的自定义元素必须有一个实体类定义, 该类必须继承`HTMLElement`
  - 使用`customElement.define`方法注册自定义元素的标签和实体类
  - 创建的自定义元素名称必须具有一个`-`连字符
  - 自定义元素的生命周期方法, 以下方法需要在实体类中实现
    - `constructor`: 创建元素实例, 或将已有DOM元素升级为自定义元素时调用
    - `connectedCallback`: 将自定义元素添加到DOM时调用
    - `disconnectedCallback`: 将自定义元素从DOM中移除时触发
    - `attributeChangedCallback`: **可观察属性**的值发生变化时调用, 初始化时也会调用
  - 自定义元素的属性操作方法, 自定义元素既是DOM, 也是JavaScript对象, 因此需要对二者进行同步
    - `static get observedAttributes`: 静态方法, 返回字符串数组, 是一组**可观察属性**
    - `get/set 属性值`: 访问器方法, 对此需要调用自定义元素的`get/setAttribute`同步
  - 一个简单的自定义元素, 内联小圆圈, 支持配置背景色和大小
  ```JavaScript
  class InlineCircle extends HTMLElement {
    constructor() {
      super();
    }

    /**
    * 自定义元素被添加到DOM中时调用该方法
    */
    connectedCallback() {
      // 设置默认的样式
      this.style.display = "inline-block";
      this.style.borderRadius = "50%";
      this.style.border = "1px solid black";

      // 加上if, 避免样式被覆盖, 因为这里的代码比attributeChangedCallback后执行
      if (!this.style.width || !this.style.height) {
        this.style.width = "0.8em";
        this.style.height = "0.8em";
      }
    }

    /**
    * 返回可观察的属性, 这里是小圆圈半径和背景色
    */
    static get observedAttributes() {
      return ["radius", "color"];
    }

    /**
    * 可观察属性的值发生变化时, 调用该方法
    * @param {string} name
    * @param {any} oldValue 变化前的属性值
    * @param {any} newValue 变化后的属性值
    */
    attributeChangedCallback(name, oldValue, newValue) {
      switch (name) {
        case "radius":
          this.style.width = newValue;
          this.style.height = newValue;
          break;
        case "color":
          this.style.backgroundColor = newValue;
          break;
        default:
          break;
      }
      console.log(`属性${name}从${oldValue}变化为${newValue}`);
    }

    // ============= 以下是访问和赋值属性时, 需要同步到DOM上的操作 =============

    get radius() {
      return this.getAttribute("radius");
    }

    set radius(value) {
      this.setAttribute("radius", value);
    }

    get color() {
      return this.getAttribute("color");
    }

    set color(value) {
      this.setAttribute("color", value);
    }
  }
  customElements.define("inline-circle", InlineCircle);
  ```
  - 在HTML中, 可以这么使用
  ```html
  <inline-circle radius="20px" color="red"></inline-circle>
  <inline-circle radius="30px" color="green"></inline-circle>
  <inline-circle radius="40px" color="blue"></inline-circle>
  <!-- 将会看到依次排列的三个从小到大的圆圈, 颜色依次为红绿蓝, 大小依次是20, 30, 40 -->
  ```
  - `is`属性指定元素为自定义元素, 前提是自定义元素的实体类必须继承一个元素类, 而不是`HTMLElement`
  ```JavaScript
  class InlineCircle extends HTMLDivElement { /** 省略 */ }
  customElements.define("inline-circle", InlineCircle, { extends: 'div' });
  ```
  - 在HTML中可以这么用, 效果和上面的例子一样
  ```html
  <div is="inline-circle" radius="20px" color="red"></div>
  <div is="inline-circle" radius="30px" color="green"></div>
  <div is="inline-circle" radius="40px" color="blue"></div>
  ```
  - 自定义元素升级, 使用`upgrade`方法
  - 自定义元素, 影子DOM和`template`可以组合使用, 达到最佳效果, 以下是简单的代码示意
  ```html
  <template>
    <!-- 模板内容 -->
  </template>
  <script>
    const template = document.querySelector('template').content;
    const documentFragment = document.createDocumentFragment();
    documentFragment.append(template);
    class InlineCircle extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: "open" });
        this.shadowRoot.append(documentFragment.cloneNode(true));
      }
      // ...省略
    }
    customElements.define("inline-circle", InlineCircle);
  </script>
  ```
