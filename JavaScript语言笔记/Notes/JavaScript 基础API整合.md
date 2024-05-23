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
**注解**: 源指的是发送者文档所在的协议, 域名, 端口
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
+ 从文件系统中读取文件, 使用`FileReader`, 其实例具有几个方法
  - `readAsText(file, encoding)`: 将文件读取为纯文本, 编码参数可选
  - `readAsDataURL(file)`: 读取文件内容的数据URI
  - `readAsBinaryString(file)`: 读取文件每个字符的二进制数据
  - `readAsArrayBuffer(file)`: 读取文件内容并保存为`ArrayBuffer`类型
  - 以上四个方法的结果都保存在实例的`result`属性中
+ `FileReader`的实例方法是异步的, 会发布几个事件用于跟踪
  - `progress`: 进度事件, 每50ms执行一次
  - `error`: 错误事件, 同时实例的`error`属性被赋值, `error`属性是包含`code`属性的一个对象
  - `load`: 读取完成事件
  ```JavaScript
  input.addEventListener('change', event => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onerror = () => console.log(reader.error);
    reader.onload = () => console.log(reader.result);
    reader.onprogress = progressEvent => console.log(progressEvent.loaded / progressEvent.total);

    reader.readAsText(file);
  });
  ```
+ `FileReaderSync`: 文件读取的同步版本, 只能在Worker线程中使用
  ```JavaScript
  // worker.js
  self.addEventListener('message', event => {
    const fileReader = new FileReaderSync();
    const result = fileReader.readAsDataUrl(event.data);
    self.postMessage(result);
  });
  ```
+ 文件部分读取, 使用`FileReader`的`slice(start, offset)`方法
  - `slice`方法返回值是一个`Blob`类型的实例
  - 可以使用`FileReader`读取`Blob`类型的数据
  - `Blob`类型其实是`File`类型的超类
  ```JavaScript
  const file = event.target.files[0];
  const reader = new FileReader();
  const blob = file.slice(0, 5); // 部分读取文件
  reader.onerror = () => console.log(reader.error);
  reader.onload = () => console.log(reader.result);
  reader.onprogress = progressEvent => console.log(progressEvent.loaded / progressEvent.total);

  reader.readAsText(blob); // 只会读取出前5个字符
  ```
+ Blob对象: 二进制大对象, Blob是对二进制数据的封装
  - Blob对象有`size`属性和`type`属性
  - Blob对象有`slice`方法, 可以用于进一步切分数据
  - `FileReader`可以从Blob中读取数据
  - `File`其实是`Blob`类型的子类
  - `Blob`构造函数只接受字符串数组, ArrayBuffer, ArrayBufferViews, 以及其他Blob'
  - `Blob`构造函数的第二个参数, 可以指定MIME类型
  ```JavaScript
  const json = { name: 'zhangsan', age: 18 };
  console.log(new Blob([JSON.stringify(json, null, 2)])); // { size: 37, type: '' }

  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  console.log(blob); // { size: 37, type: 'application/json' }

  // 进一步部分读取文件
  const file = event.target.files[0];
  const reader = new FileReader();
  const blob = file.slice(0, 5); // 部分读取文件
  reader.onerror = () => console.log(reader.error);
  reader.onload = () => console.log(reader.result);
  reader.onprogress = progressEvent => console.log(progressEvent.loaded / progressEvent.total);
  reader.readAsText(blob.slice(0, 3)); // 只会读取出前3个字符
  ``` 
***
**注解1**: 二进制文件:
+ 狭义的理解是, 除了纯文本文件以外的文件, 都可以叫做二进制文件
+ 广义的理解是, 一切文件都是二进制文件, 因为存储的方式是二进制  

**注解2**: 因此, `Blob`其实可以理解为就是封装了一个数据准备就绪的文件, `File`是`Blob`的子类
***
+ Blob URL: 指的是一个引用了`Blob`对象中数据的URL
  - Blob对象一般的使用用途有保存到本地, 要保存到本地就必须要有一个URL值
  - 使用`URL.createObjectURL`创建Blob URL, 参数可以是`File`或者`Blob`
  ```JavaScript
  const json = { name: 'zhangsan', age: 18 };

  // blob也可以是从接口获取到的后台资源
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
  const saveJSON = (blob, filename) => {
    const a = document.createElement('a');

    // 如果是图片文件数据, 这里还可以使用img.src = URL.createObjectURL(blob);
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  saveJSON(blob, 'file.json');
  ```
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
  element.addEventListener("dragenter", event => { /** 实现代码 */ });
  ```
+ 拖动过程中的数据传递: `dataTransfer`
  - 在拖动元素的事件回调中, 使用`event.dataTransfer.setData`设置数据
  - 在放置元素的事件回调中, 使用`event.dataTransfer.getData`获取数据
  - 可以调用`event.dataTransfer.setImageData`, 设置拖动过程中的背景图
  ```html
  <img class="from" src="./123.png">
  <img class="to">
  <script>
    const from = document.querySelector('.from');
    const to = document.querySelector('.to');
    from.addEventListener('dragstart', event => {
      event.dataTransfer.setData('key', event.target.src);
    })
    to.addEventListener('drop', event => {
      event.preventDefault(); // 这行代码为了阻止浏览器默认在新窗口中打开拖动的文件或图片
      const url = event.dataTransfer.getData('key');
      event.target.src = url;
    })
  </script>
  ```
+ 可以设置元素的`draggable`属性, 使其成为可拖动或者不可拖动的
  ```html
  <img src="./123.png" draggable="false">
  <div draggable="true"></div>
  ```
***
**注解**: 以上所说的拖动, 都只是能够响应`drag`等事件的场景, 即支持拖动的元素, 可以向其添加拖动监听事件, 实现某些功能, 这和我们理解的带着元素跟着鼠标指针满世界晃悠, 不是一个概念!
***

#### 浏览器通知
+ 通知功能只能应用在`https`的页面上
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
