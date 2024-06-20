+ [总目录](../readme.md)
***
- [跨上下文消息](#跨上下文消息)
- [文本编码与解码](#文本编码与解码)
- [文件和Blob](#文件和Blob)
- [原生拖放](#原生拖放)
- [浏览器通知](#浏览器通知)
- [页面可见性](#页面可见性)
- [计时和随机数](#计时和随机数)
- [工作线程](#工作线程)
***
#### 跨上下文消息
+ 使用`postMessage`方法和`message`事件监听交互
+ 主要适用范围: iframe内嵌窗口和Worker工作线程
+ `postMessage`方法, 接收两个参数:
  - 参数1: 传递的数据, `any`类型, 
  - 参数2: 发送者的文档源, 如果发送者不是该源, 则无事发生, 可以使用通配符`*`
  - 其实还有第三个参数, 但仅用在工作线程中, 到时候在描述
+ `message`事件监听, 参数`event`主要使用三个属性
  - `data`: 传递过来的数据
  - `origin`: 发送者的文档源
  - `source`: 发送者的`window`代理对象
+ 始终在目标窗口上调用`postMessage`方法, 因此发送消息前, 要先获取目标窗口的`window`或其代理对象
+ 案例: 假设主文档和iframe文档都部署在`http://my.production.com`服务器上
```html
<!-- index.html -->
<iframe src="iframe.html"></iframe>
<script>
  const iframe = document.querySelector('iframe').contentWindow;
  iframe.postMessage('Hello', 'http://my.production.com');
  window.addEventListener('message', event => {
    const { data } = event;
    console.log(`收到消息: ${data}`);
  });
</script>
```
```html
<!-- iframe.html -->
<script>
window.addEventListener('message', event => {
  const { data, source } = event;
  console.log(`收到消息: ${data}`);
  source.postMessage('Recieved', 'http://my.production.com');
});
</script>
```
***
**注解1**: 源指的是发送者文档所在的协议, 域名, 端口

**注解2:** 可以在iframe页面中, 直接使用`window.parent`获取父窗口的引用
```JavaScript
document.qeuerySelector('button').addEventListener('click', () => {
  window.parent.postMessage('Hello, World');
});
```

**注解3:** 关于`top`, `parent`, `self`
+ 这些都是`window`对象的属性, 用于指代窗口的关系
+ `window.top`: 始终指向最外层窗口
+ `window.parent`: 指向当前窗口的父窗口
+ `window.self`: 指向当前窗口自身, `window.self === window`结果为`true`
```HTML
<!-- index.html -->
<iframe src="./iframe1.html"></iframe>

<!-- iframe1.html -->
<iframe src="./iframe2.html"></iframe>

<!-- iframe2.html -->
<iframe src="./iframe3.html"></iframe>

<!-- iframe3.html -->
<script>
  console.log(window.self); // iframe3页面的window对象
  console.log(window.parent); // iframe2页面的window对象
  console.log(window.parent.parent); // iframe1页面的window对象
  console.log(window.top); // index.html页面的window对象
</script>
```
+ 对于最外层窗口来说, 它的`top`, `parent`, `self`属性是一样的
+ `a`链接打开位置: `_parent`, `_top`, `_self`, `_blank`
  - 前三个都和上述含义一样, 分别表示父窗口, 最外层窗口, 和自身窗口
  - `_blank`指新窗口对象, 这和浏览器的新窗口不同, 可能是在新选项卡中打开
```HTML
<iframe src="./iframe1.html" target="_blank"></iframe>
<iframe src="./iframe2.html" target="_self_"></iframe>
<iframe src="./iframe3.html" target="_parent"></iframe>
<iframe src="./iframe4.html" target="_top"></iframe>
```
***

#### 文本编码与解码
+ 这里主要描述的是字符串和定型数组之间的转换, 和`URL`编码是两回事
+ 文本编码, 将字符串编码为定型数组, 所有的编码器都只使用`UTF-8`
  - 批量编码: 会同步编码整个字符串, 使用`new TextEncoder()`创建实例
  ```JavaScript
  const encoder = new TextEncoder();
  const str = 'Hello, World';

  // encode方法, 直接传入字符串
  const encodeStr = encoder.encode(str);
  console.log(encodeStr); // Uint8Array(12)

  // encodeInto方法, 传入字符串和一个定型数组, 返回编码详情
  const typedArray1 = new Uint8Array(12);
  const typedArray2 = new Uint8Array(10);
  const encodeResul1 = encoder.encodeInto(str, typedArray1);
  const encodeResul2 = encoder.encodeInto(str, typedArray2);
  console.log(encodeResul1); // { read: 12, written: 12 }
  console.log(encodeResul2); // { read: 10, written: 10 }
  ```
  - 流编码: 暂时忽略, 文档后续会介绍流的概念
+ 文本解码, 将定型数组解码为字符串, 解码器支持多种字符编码
  - 批量解码: 会同步解码字符串, 使用`new TextDecoder`创建实例
  ```JavaScript
  const decoder = new TextDecoder(); // 不传参数, 默认使用UTF-8
  const result = decoder.decode(encodeStr);
  console.log(result); // Hello, World
  ```
  - 流解码: 文档后续会介绍流的概念

#### 文件和Blob
+ 文件, 使用`File`类型, `File`对象支持以下只读属性
  - `name`: 文件名
  - `size`: 文件大小, 单位是字节
  - `type`: 包含文件MIME类型的字符串, 如`image/jpeg`
+ `event.target.files`获取文件信息, `files`类型为`FileList`, 类数组对象
  ```html
  <input type="file" multiple />
  <script>
    const input = document.querySelector("input");
    input.addEventListener("change", (event) => {
     /**
      * @type {HTMLInputElement}
      */
      const target = event.target;
      for (let index = 0; index < target.files.length; index++) {
        const { name, size, type } = target.files[index];
        console.log(name, size, type);
      }
    });
    </script>
  ```
+ 文件读取, 使用`FileReader`实例, 实例的方法和说明如下
  - `readAsText(file, encoding)`: 将文件读取为纯文本, 编码参数可选
  - `readAsDataURL(file)`: 读取文件内容的数据URI
  - `readAsBinaryString(file)`: 读取文件每个字符的二进制数据
  - `readAsArrayBuffer(file)`: 读取文件内容并保存为ArrayBuffer类型
  - 以上四个方法的结果都保存在实例的`result`属性中
  - 以上实例方法是异步的, 监听`load`/`progress`/`error`以获取进度或结果
  ```JavaScript
  // 封装Promise风格的读取函数
  const readText = async file => new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => resolve(fileReader.result);
    fileReader.onerror = () => reject('Failed');
    fileReader.readAsText(file);
  });

  // 假设选取一个txt文件, 文件内容是Hello
  input.addEventListener('change', async event => {
    const file = event.target.files[0];
    const content = await readText(file);
    console.log(content); // Hello
  });
  ```
***
**注解:** 针对于内容为"Hello"的txt文件, 其他几个方法读取的结果:
+ `readAsDataURL(file)`: data:text/plain;base64,SGVsbG8=
+ `readAsBinaryString(file)`: Hello
+ `readAsArrayBuffer(file)`: ArrayBuffer(5)
***
+ 文件同步读取, 使用`FileReaderSync`实例, 只能在工作线程中使用
  ```JavaScript
  // worker.js
  self.addEventListener('message', event => {
    const fileReader = new FileReaderSync();
    const result = fileReader.readAsDataUrl(event.data);
    self.postMessage(result);
  });
  ```
+ 文件部分读取, 使用`File`实例的`slice(start, offset)`方法
  ```JavaScript
  const file = event.target.files[0];
  const content = await reader.readText(file.slice(0, 3)); // Hel
  ```
***
**注解:** `File`实例的`slice`方法, 返回结果是`Blob`类型
***
+ Blob: 二进制大对象, 用于存放大量的二进制数据
  - Blob是构造函数: 可以使用`new Blob`创建Blob对象
  - `File`是`Blob`的子类, 因此很多`File`的方法属性, 都是从Blob继承的
  - Blob具有`slice`方法, 具有`size`属性, 具有`type`属性
  ```JavaScript
  class File extends Blob
  ```
  - `Blob`构造函数接收两个参数:
    + 参数1: 字符串数组/ArrayBuffer/ArrayBufferViews/其他Blob
    + MIME类型
  ```JavaScript
  const json = { name: 'zhangsan', age: 18 };
  const jsonStringArray = [JSON.stringify(json, null, 2)];
  console.log(new Blob(jsonStringArray)); // { size: 37, type: '' }

  const blob = new Blob(
    jsonStringArray,
    { type: 'application/json' }
  );
  console.log(blob); // { size: 37, type: 'application/json' }

  // 切分文件
  const file = event.target.files[0];
  const blob = file.slice(0, 5);
  const content = await readText(blob.slice(0, 2)); // He
  ``` 
***
**注解1:** 音频/视频等数据, 无法直接以文本显示, 但数据是由二进制01组成, 这样的数据就被叫二进制数据, 二进制数据通常需要对应的应用程序才能打开

**注解2:** 即使是纯文本数据, 在计算机上依然是由二进制01组成, 因此从广义上来说, 二进制数据其实就泛指一切数据
***
+ Blob URL: 指的是一个指向内存中`Blob`对象的URL地址
  - Blob对象一般的用途是保存文件到本地
  - 使用`URL.createObjectURL`创建Blob URL, 参数可以是`File`/`Blob`
  ```TypeScript
  // 假设从后台接受到了一个软件安装包 installer.exe
  const blob = await axios('url', { responseType: 'blob' });

  // 保存文件到本地
  const saveFile = (blob: Blob, filename: string) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  saveFile(blob, 'installer.exe');
  ```
***
**注解1:** 浏览器不允许直接操作磁盘IO, 只能通过文件保存对话框提示用户保存文件, 因此Blob对象只能转为URL地址, 通过a标签访问和保存

**注解2:** 后台直接返回给前端资源URL, 也能实现文件保存, 但这样会暴露服务器的绝对路径, 不符合网络安全, 返回二进制数据是比较稳妥的
```bash
# 资源URL的示例
http://www.fc.com/resource/download/v3.1.2/installer.exe
```

**注解3:** 针对在线预览的资源, 如音频/视频/图片, 为了确保不暴露服务器绝对路径, 也可以采用传输二进制数据的方式, 前端使用`src`赋值
```JavaScript
const img = await axios('url', { responseType: 'blob' });
const url = URL.createObjectURL(img);
document.qeuerySelector('img').src = url;
```
***
+ 读取拖放文件, 通过`event.dataTransfer.files`获取拖放的文件
  ```JavaScript
  const div = document.querySelector('div');
  div.addEventListener('drop', e => {
    const file = e.dataTransfer.files[0]; // 获取文件
    const { type, name, size } = file;
    console.log(name, size, type);
  });
  ```

#### 原生拖放
+ 拖放指的是在网页中将某个元素拖动并放置到另一个元素上
+ 先指明两个概念: 拖动元素, 和放置元素
  - 拖动元素: 将要被拖动的元素
  - 放置元素: 拖动元素计划放置的目标元素
+ 在拖动元素上, 会依次触发以下事件:
  - `dragstart`: 鼠标在拖动元素上按下, 开始拖动的一瞬间, 触发该事件
  - `drag`: 继续拖动, 则会持续触发该事件
  - `dragend`: 拖动停止时 (松开鼠标), 触发该事件
+ 在放置元素上, 会依次触发以下事件
  - `dragenter`: 拖动元素进入放置元素范围内时, 触发该事件
  - `dragover`: 在放置元素范围内继续拖动, 会持续触发该事件
  - `dragleave`或`drop`:
    - 拖动到放置元素范围以外, 触发`dragleave`
    - 在放置元素范围内松开鼠标, 触发`drop`事件 
+ 有效和无效放置元素
  - 有一些内置元素, 本身是不允许放置其他拖动元素的, 也不会触发`drop`事件
  - 可以通过覆盖默认的行为, 实现让所有元素都成为放置元素
  ```JavaScript
  // 在放置元素上覆盖默认的事件
  element.addEventListener("dragover", event => event.preventDefault());
  element.addEventListener("dragenter", event => event.preventDefault());

  // 正常监听drop事件
  element.addEventListener("drop", event => { /** 实现代码 */ });
  ```
+ 拖动过程中的数据传递: `dataTransfer`
  - 在拖动元素的事件回调中, 使用`event.dataTransfer.setData`设置数据
  - 在放置元素的事件回调中, 使用`event.dataTransfer.getData`获取数据
  ```html
  <img class="from" src="./123.png">
  <img class="to">
  <script>
    const from = document.querySelector('.from');
    const to = document.querySelector('.to');
    from.addEventListener('dragstart', event => {
      event.dataTransfer.setData('key', event.target.src);
    });
    to.addEventListener('drop', event => {
      event.preventDefault(); // 这行代码为了阻止浏览器默认在新窗口中打开拖动的文件或图片
      const url = event.dataTransfer.getData('key');
      event.target.src = url;
    });
  </script>
  ```
  - 从浏览器外部拖动文件时, 通过`drop`事件的`event.dataTransfer.files`获取到文件
  ```JavaScript
  const readFileAsText = async file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('读取失败'));
    reader.readAsText(file);
  });
  const t = document.querySelector("textarea");
  t.addEventListener("drop", async event => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    const content = await readFileAsText(file);
    t.innerHTML = content;
  });
  ```
  - 可以调用`event.dataTransfer.setImageData`, 设置拖动过程中的背景图
***
**注解:** 史诗级bug, 上述示例, 如果在控制台打印`event.dataTransfer`或者`event.dataTransfer.files`, 其结果都是空的, 会误认为没有拿到任何文件, 但其实代码会正常工作, 这是Chrome的bug
```JavaScript
const img = document.querySelector("img");
img.addEventListener("drop", (event) => {
  console.log(event.dataTransfer); // 里面的item, filelist等属性都是空的
  console.log(event.dataTransfer.files); // 也是空的

  console.log(event.dataTransfer.files[0]); // 可以打印出文件信息
});
```
***
+ 可以设置元素的`draggable`属性, 使其成为可拖动或者不可拖动的
  ```html
  <img src="./123.png" draggable="false">
  <div draggable="true"></div>
  ```
***
**注解1**: 以上所说的拖动, 都只是能够响应`drag`等事件的场景, 即支持拖动的元素, 可以向其添加拖动监听事件, 实现某些功能, 这和我们理解的带着元素跟着鼠标指针满世界晃悠, 不是一个概念!

**注解2:** 原生拖放只能在http/https通信的页面才能正常使用, 因此要使用拖放功能, 需要服务器支持
***

#### 浏览器通知
+ 通知功能只能在http/https通信的页面才能正常使用
+ 请求通知权限, 用户一旦拒绝, 除非用户手动重置浏览器设置, 否则无可挽回
  ```JavaScript
  Notification.requestPermission()
    .then((permission) => {
      if (permission === 'granted') {
        console.log('用户同意在此页面使用通知');
      } else {
        console.log('用户拒绝在此页面使用通知');
      }
    })
    .catch((err) => {
      console.log("未知错误");
    });
  ```
+ 显示和隐藏通知, 显示的位置依浏览器实现而定, 编写本文档时: Chrome浏览器的通知出现在桌面的右下角(坐席消息)
  ```JavaScript
  const notify = new Notification('Hello');
  const notify = new Notification('Title', {
    body: 'body用来设置主体消息',
    image: 'image用来设置显示的图片, 使用文件路径',
    vibrate: true // 振动
  });
  setTimeout(() => notify.close(), 3000);
  // 最新的Chrome支持更丰富的通知配置, 请参考MDN
  ```
+ 通知交互, 可以在通知的消息上进行4中操作, 具体行为依浏览器实现
  - `onshow`: 通知显示时触发
  - `onclick`: 通知被点击时触发
  - `onclose`: 通知被关闭时触发
  - `onerror`: 发生错误阻止通知时触发
  ```JavaScript
  const notify = new Notification('title');
  notify.onshow = () => console.log('通知显示了!');
  notify.onclick = () => console.log('通知被点了!');
  notify.onclose = () => console.log('通知关闭了!');
  notify.onerror = () => console.log('通知出错了!');
  ```

#### 页面可见性
+ 使用`document.visibilityState`获取当前页面的可见性, Chrome只实现了两种状态
  - `visible`: 页面可见
  - `hidden`: 页面最小化或隐藏
+ 使用`visibilitychange`事件监听页面状态的变化
  ```JavaScript
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      // ...
    } else {
      // ...
    }
  })
  ```

#### 计时和随机数
+ `Date.now`只精确到毫秒级别, 而且主要用于日期的功能, 不适合用作高精度计时
+ `window.performance.now()`: 返回微秒精度的浮点值, 该方法采用相对度量: 在页面打开时, 从0开始计时
+ `window.performance.timeOrigin`: 属性, 返回计时器初始化时, 全局系统时钟的值
  ```JavaScript
  // 绝对度量
  const absoluteTimeStamp = window.performance.now() + window.performance.timeOrigin;
  ```
+ 随机数: 使用`Math.random`生成的是伪随机数
+ 使用`window.crypto.getRandomValues()`方法生成随机数, `window`可以省略
  - 该方法接受一个定型数组参数
  - 生成的随机值会写入该定型数组, 同时返回该定型数组
  ```JavaScript
  const arr = new Uint8Array(1);
  crypto.getRandomValues(arr);
  console.log(arr[0]);
  ```
  - 如果想生成多个随机值, 设置定型数组的长度即可
+ `Math.random`的安全替代方法
  ```JavaScript
  const random = () => {
    const arr = new Uint32Array(1);
    // 32位无符号整数, 最大值是2^32-1
    const maxUint32 = 0xFFFFFFFF;
    return crypto.getRandomValues(arr)[0] / maxUint32;
  }
  ```
+ 使用`window.crypto.randomUUID()`生成UUID, `window`可省略
  ```JavaScript
  const id = crypto.randomUUID();
  console.log(id); //4d784ad1-4309-46ae-930b-30ccfe95ef0a
  ```

#### 工作线程
+ 用于单独开辟一个独立线程, 执行高性能计算
+ 工作线程只能用于执行计算, 不能操作DOM和页面视图
+ 工作线程的执行逻辑单独存放在一个js文件中
+ 工作线程的具体使用
  - 使用`new Work`构造函数, 参数为js文件
  - 使用`postMessage`互相发送数据, 存在`data`属性中
  - 使用`onmessage`互相监听数据, 存在`data`属性中
+ 工作线程中没有`window`对象, 应该使用`self`
+ 工作线程代码: 单独的js文件
  ```JavaScript
  // Worker.js
  // self是工作线程中的对象, 类似于window

  /**
   * 耗时的操作, 放到工作线程Worker.js中
   * @param {T} data 需要使用的数据, 通常是从主页面传入
   * @returns {M} 执行的结果
   */
  const yourTimeConsumingMethod = (data) => {
    // ...耗时代码, 运行完之后, 得到结果
    return `结果`;
  };

  /**
   * 监听主页面发送过来的数据, 保存在事件参数的data属性中
   * @param {MessageEvent} event 
   */
  self.onmessage = (event) => {

    const receivedData = event.data;

    console.log(`接收到主页面发送的数据: ${receivedData}`)

    // 接收到数据后, 开始进行高耗时操作
    const result = yourTimeConsumingMethod(receivedData);

    // 拿到结果后, 将结果发回给主页面
    self.postMessage(result);
  };
  ```
+ 主页面的代码: 构造工作线程
  ```JavaScript
  // index.js
  // 创建工作线程
  const worker = new Worker('./Worker.js');

  // 向工作线程发消息
  worker.postMessage('数据');

  /**
   * 接受工作线程发来的消息
   * @param {MessageEvent} event 
   */
  worker.onmessage = (event) => {
    const receivedData = event.data;
    console.log(`接收到工作线程发送的数据: ${receivedData}`);

    // 终止工作者线程
    worker.terminate();
  };
  ```
+ 输出结果
  ```bash
  $ 接收到主页面发送的数据: 数据
  $ 接收到工作线程发送的数据: 结果
  ```
