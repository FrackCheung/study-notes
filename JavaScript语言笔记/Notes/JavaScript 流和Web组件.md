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
