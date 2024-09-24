+ [总目录](../readme.md)
***
- [性能指标](#性能指标)
- [收集性能数据](#收集性能数据)
- [网络性能](#网络性能)
- [浏览器性能1: DOM](#浏览器性能1-dom)
- [浏览器性能2: 异步任务](#浏览器性能2-异步任务)
- [浏览器性能3: 内存](#浏览器性能3-内存)
- [浏览器性能4: ServiceWorker](#浏览器性能4-serviceworker)
- [前端工程性能](#前端工程性能)
***
#### 性能指标
+ 首屏性能指标: `FP`, `FCP`, `FMP`
  - `FP`: 页面首次开始绘制的时间
  - `FCP`: 页面首次绘制出DOM元素的时间
  - `FMP`: 页面首次绘制出有意义的元素的时间
***
**注解:** `FP`和`FCP`意义并不大, 而`FMP`需要自行定义
***
+ 流畅度指标: `FPS`, 即帧率
+ 核心Web指标: `LCP`, `FID`, `CLS`
  - `LCP`: 首屏视图中, 占用页面面积最大的元素渲染完成的时间
  - `FID`: 首次交互延迟, 用户首次交互, 到事件被响应的时间
  - `CLS`: 连续布局偏移, 会持续统计页面整个生命周期内的数据
***
**注解:** 最大元素, 指图片, 以及包含文字的行内/块级元素
***
+ 过程指标: 统计某个综合过程的指标
  - `TTFB`: 客户端发起请求, 到接收服务器响应第一个字节的时间
  - `DOMContentLoaded`: 完成页面解析和阻塞资源加载完毕的时间
  - `Load`: 页面资源完全加载完毕的时间
***
**注解:** 过程指标不需要代码记录, 在Network面板中可以直接查看
***
+ 自定义性能指标: 稍后用代码演示

#### 收集性能数据
+ 收集`FMP`指标的性能数据
  - 关键逻辑计时: 记录关键逻辑运行完毕之后的时间点
  ```JavaScript
  onMounted(async () => {
    await initContent1();
    await initContent2();
    await initContent3();
    console.log(performance.now()); // 记录
  })
  ```
  - 关键元素计时: 记录关键元素渲染完成的时间点
  ```HTML
  <img src="./index.png" onload="recordNowAsFMP()">
  <!-- recordNowAsFMP: console.log(performance.now()) -->
  ```
***
**注解:** `performance.now()`相对于页面打开时间
***
+ 收集流畅度指标的性能数据
  - 使用`requestAnimationFrame`, 统计帧率
  ```JavaScript
  (function() {
    let current = Date.now();
    const recordFPS = () => {
      const timeStap = Date.now() - current;
      const fps = Math.round(1000 / timeStap);
      console.log(fps);
      current = Date.now();
      requestAnimationFrame(recordFPS);
    };
    recordFPS();
  })()
  ```
  - 使用`Performance API`, 统计执行时间超过`50ms`的任务
  ```JavaScript
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // 打印出性能信息, 或者使用其他方式进行处理
      console.log(entry);
    }
  }).observe({ entryTypes: ['longtask'], buffered: true });
  ```
***
**注解:** `iframe`以及后台的`requestAnimationFrame`可能会暂停
***
+ 收集核心Web度量指标的性能数据
  - `LCP`: 首屏视图中, 占用页面面积最大的元素渲染完成的时间
  ```JavaScript
  /* ... */ entryTypes: ["largest-contentful-paint"], // ...
  ```
  - `FID`: 首次交互延迟, 用户首次交互, 到事件被响应的时间
  ```JavaScript
  /* ... */ entryTypes: ["first-input"], // ...
  ```
  - `CLS`: 连续布局偏移, 会持续统计页面整个生命周期内的数据
  ```JavaScript
  /* ... */ entryTypes: ["layout-shift"], // ...
  ```
***
**注解:** `entryTypes`可以整合, 并使用`getEntriesByType`过滤 
***
+ 收集自定义性能数据
  - 使用`performance.mark()`标记时间点
  ```JavaScript
  performance.mark('load-element-plus-start');
  import("element-plus").then(ep => {
    performance.mark('load-element-plus-end');
    // ...
  });

  // 获取所有mark的时间点
  performance
    .getEntriesByType('mark')
    .forEach(item => console.log(item));
  ```
  - 使用`performance.mesure()`测量标记点之间的时间段
  ```JavaScript
  performance.mark('write-file-start');
  UtilService.writeFileSync(filename, content);
  performance.mark('write-file-end');
  performance.mesure(
    'write-file', // 本次测量的标识
    'write-file-start',
    'write-file-end'
  );

  // 获取所有mesure的时间段
  performance
    .getEntriesByType('measure')
    // .getEntriesByName('write-file')
    .forEach(item => console.log(item));
  ```
***
**注解1:** F12性能面板可以查看大部分性能数据, 使用`Performance API`是为了进行上报分析

**注解2:** 性能数据进行统计分析, 常用指标为分位数, 如: 首屏渲染时间应该达到`95`分位数在`2.5`秒
***

#### 网络性能
+ 优化`TTFB`: `TTFB`低于`50ms`是一个预期的值
  - 减少客户端传输量: 减少`Body`和`Cookie`的数据量
  - 减少服务器处理时间: 使用流式渲染, 如`bigpipe`技术
  - 使用CDN托管服务
+ 优化HTTP/HTTPS连接耗时
  - HTTP/HTTPS具有请求复用机制, 无需重复进行TCP握手
  - 使用`preconnect`进行预连接
  ```HTML
  <link rel="preconnect" href="https://xxx.com" crossorigin>
  <!-- 省略 -->
  <img src="https://xxx.com/b/xxx.png">
  ```
  - 使用`preload`进行预加载
  ```HTML
  <link rel="preload" href="/index.js" as="script">
  <!-- 省略 -->
  <script src="/index.js"></script>
  ```
  - `preload`批量预加载
  - 域名收拢和复用连接: 接口尽量使用同一个域名
+ 优化重定向
  - 使用HTML重定向, 尽量避免使用服务器重定向
  ```HTML
  <meta http-equiv="refresh" content="0;url=https://www.xxx.com">
  ```
  - 使用前端路由进行鉴权跳转, 避免使用服务器重定向
  - 将重定向置于CDN托管服务器上
  - 避免使用短链服务
+ 优化HTTPS链接: 仅作了解
  - 确保证书链完整, 避免浏览器发起额外请求补全证书链
  - 启用`TLS 1.3`或者开启`TLS False Start`节约握手时间
  - 不滥用`EV`证书, 导致强制触发`OSCP`查询
  - 后端服务器开启`OSCP Stapling`强验证
+ 压缩和缓存
  - 确保接口都开启了压缩, 至少是`gzip`压缩
  - 静态资源可以提前进行压缩并托管到服务器上, 或CDN上
  - 合理对静态资源使用强缓存或者协商缓存
***
**注解:** 业务上也需要诸多优化HTTP请求的方式
1. 合并请求: 将具有相关性的接口合并在一个接口中
2. 首屏请求尽量不要使用串行模式, 更不要将页面渲染代码放置在`await`之后
3. ...
***

#### 浏览器性能1: DOM
+ DOM渲染流程: 分为主线程, 合成线程, 和GPU共同参与
  - 主线程: 流式解析HTML, 生成DOM树
  - 主线程: 解析CSS, 生成`CSSOM`样式树
  - 主线程: 将DOM树和CSSOM树合并为渲染树
  - 主线程: 计算布局, 生成布局树
  - 主线程: 将布局树划分为多个图层树, 交付给合成线程
  - 合成线程: 将图层树分割成块, 依次交付光栅化线程
  - 光栅化线程: 逐块进行光栅化, 将结果保存在GPU中
  - 合成线程: 将光栅化结果取出, 合并为帧, 交给GPU渲染
  - 以上过程, 仅仅只绘制了一帧的结果
+ **性能优化1:** 优化DOM渲染流程:
  - 阻塞式JavaScript放在HTML最后
  - CSS分割, 只加载当前页面所需要的CSS
+ DOM操作代价昂贵的原因:
  - 主线程会承担大部分的解析和计算, 且结果只绘制出一帧
  - DOM元素大小位置变化时, 会重复执行整个渲染流程(`Reflow`)
  - JavaScript访问DOM存在跨线程通信, 速度本身就慢
  - JavaScript可能会导致浏览器放弃批量优化, 进行强制重排
+ **性能优化2:** 优化DOM操作
  - 聚合DOM操作, 使用`DocumentFragment`, 或字符串拼接
  ```JavaScript
  // DocumentFragment
  const df = document.createDocumentFragment();
  for (const item of list) {
    const a = document.createElement('a');
    a.textContent = item.message;
    a.href = item.url;
    df.appendChild(a);
  }
  document.body.appendChild(df);

  // 字符串拼接
  let html = '';
  for (const item of list) {
    html += `
      <a href=${item.url}>${item.message}</a>
    `;
  }
  document.body.insertAdjacentHTML('beforebegin', html);
  ```
  - 使用纯合成动画: 针对定位元素, 使用不会造成重排重绘的动画
  ```CSS
  .element {
    position: absolute;
    animation: rotate 1s infinite;
    /** ...  */
  }

  @keyframe rotate {
    from { transform: rotate(0deg); }
    /** */
    to { transform: rotate(360deg); }
  }
  ```
***
**注解:** 关于纯合成动画
1. 浏览器将定位元素放置在合成层, 不会和非定位元素混在一起
2. 合成层元素发生变化, 只需要GPU介入, 重新进行合成显示
3. `transform`属性不会引发重排
***

#### 浏览器性能2: 异步任务
+ JavaScript事件循环
  - JavaScript主线程执行完毕同步代码后, 轮询任务队列
  - 异步代码被放入其他线程执行, 完毕后将回调推入任务队列
  - 微任务会阻塞主线程, 如`Promise`的回调, 和DOM变更
  ```JavaScript
  const update = () => {
    console.log(Date.now());
    Promise.resolve().then(update);
  }

  const update = () => {
    console.log(Date.now());
    setTimeout(update);
  }

  const update = () => {
    document.body.innerHTML = Date.now();
    setTimeout(update)
  }
  ```
+ 优化异步任务: 避免微任务进入无限循环
  ```JavaScript
  const update = () => {
    document.body.innerHTML = Date.now();
    requestAnimationFrame(update)
  }
  ```

#### 浏览器性能3: 内存
+ JavaScript内存管理:
  - JavaScript`栈`内存: 用于存放原始值变量, 及引用变量的地址
  - JavaScript`堆`内存: 用于存放引用变量本身的数据
  - JavaScript在定义变量时即分配内存
+ JavaScript垃圾回收: 回收不再使用的变量, 释放内存
  - 引用计数: 缺点是循环引用永远无法回收
  - 标记清理: 缺点是会产生大量的内存碎片
***
**注解1:** Chrome V8引擎使用`分代垃圾回收`
+ 针对新生代变量, 采用`From`-`To`模式的`Scavenge`算法
+ 针对老生代变量, 采用标记清理和标记压缩清理

**注解2:** 垃圾回收会阻塞JS主线程, 被称为`全停顿`

**注解3:** 应该回收的变量没有被回收, 导致内存占用越来越高, 即被称为内存泄漏
+ 内存不够用, 导致JavaScript更加频繁的进行垃圾回收
+ 内存中大量对象存在, 导致垃圾回收进行的更加缓慢
***
+ 内存泄漏的常见原因:
  - 挂载到`BOM`和`DOM`上的变量不会被回收
  ```JavaScript
  for (let index = 0; index < 10000; index++) {
    window[`obj${index}`] = { name: 'zhangsan' };
  }
  ```
  - 事件监听挂载的回调函数不会被回收
  ```JavaScript
  const buttons = document.querySelectorAll('.button');
  const len = buttons.length;
  for (let index = 0; index < len; index++) {
    buttons[index].addEventListener('click', () => {
      // ...
    })
  }
  ```
  - 闭包持有的变量不会被回收
  ```JavaScript
  const logService = new LogService();
  for (let index = 0; index < len; index++) { 
    buttons[index].addEventListener('click', () => {
      logService.log(`You clicked button ${index}`);
    });
  }
  ```
+ **性能优化:** 优化内存占用
  - 使用`let`/`const`定义变量, 避免使用`var`
  - 避免向`DOM`和`BOM`上挂载对象
  - 对象不再使用时, 手动设置为`null`
  - 不再需要事件时移除相应的事件监听器
***
**注解:** 使用`Performance`面板进行内存分析和诊断, 使用`Memory`面板进行堆内存快照比对
***

#### 浏览器性能4: ServiceWorker
+ `ServiceWorker`主要用于在离线时提供内容
  - `ServiceWorker`运行在Web Worker中
  - `ServiceWorker`监听`fetch`事件, 并提供预先准备好的`Response`
  - `ServiceWorker`配合`Cache API`进行工作
+ `Cache API`介绍
  - 使用`caches.open`创建缓存对象, 参数为标识符
  - 使用`caches.put`添加缓存资源, 参数为url和资源
  - 使用`caches.match`匹配客户端请求, 得到缓存资源
+ `ServiceWorker`完整示例
  - HTML文件: `index.html`
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ServiceWWorker</title>
  </head>
  <body>
    <button class="show-img">加载图片</button>
    <button class="show-text">打印文本</button>
    <script src="index.js"></script>
  </body>
  </html>
  ```
  - 客户端js: `index.js`
  ```JavaScript
  /**
   * 注册ServiceWorker
   * @returns {void}
   */
  const registerServiceWorker = async () => {
    if (!navigator.serviceWorker) {
      return;
    }
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      if (registration.installing) {
        console.log('正在安装ServiceWorker');
      }
      if (registration.waiting) {
        console.log('正在激活ServiceWorker');
      }
      if (registration.active) {
        console.log("激活ServiceWorker");
      }
    } catch (err) {
      console.log(`注册ServiceWorker失败: ${err}`);
    }
  }

  registerServiceWorker();

  const showImgBtn = document.querySelector('.show-img');
  const showTextBtn = document.querySelector('.show-text');

  showImgBtn.addEventListener('click', async () => {
    const image = await fetch('/1.png');
    document.body.insertAdjacentHTML('beforeend', `<img src=${image}>`)
  });

  showImgBtn.addEventListener('click', async () => {
    const text = await fetch('/text');
    console.log(text)
  });
  ```
  - ServiceWorker js: `sw.js`
  ```JavaScript
  const cacheId = 'custom-cache';

  /**
  * 向缓存中添加资源
  */
  const addResourcesToCache = async () => {
    const cache = await caches.open(cacheId);
    await cache.addAll(['/1.png']);
    await cache.put('/text', new Response('Hello, Service Worker'));
  }

  /**
  * 监听ServiceWorker的安装时间, 并在此阶段添加资源
  */
  self.addEventListener('install', event => {
    event.waitUntil(addResourcesToCache())
  });

  /**
  * 监听fetch事件
  */
  self.addEventListener('fetch', async event => {
    const response = await caches.match(event.request);
    event.respondWith(response)
  });
  ```
***
**注解1:** `ServiceWorker`只能运行在HTTPS页面中

**注解2:** `ServiceWorker`也可用于资源预加载, 进而优化网络性能
***

#### 前端工程性能
+ 尽可能使用ES6模块, 以便进行静态分析
+ 使用按需引入, 避免全量引入 (包括逻辑组件和样式组件)
  ```JavaScript
  // 避免这样做
  import ElementPlus from 'element-plus'
  import 'element-plus/dist/index.css'
  app.use(ElementPlus)

  // 按需引入 vite.config.ts
  export default defineConfig({
    plugins: [
      AutoImport({ resolvers: [ElementPlusResolver()] }),
      Components({ resolvers: [ElementPlusResolver()] }),
    ],
  })

  // 使用
  import { ElMessage } from "element-plus";
  ```
+ 分割代码, 将代码抽取为多个独立的`chunk`, 重用缓存, 降低文件大小
  ```JavaScript
  // webpack.config.js
  module.exports = {
    optimization: {
      splitChunks: {
        minSize: 30, //提取出的chunk的最小大小, 单位字节, 自行定义
        cacheGroups: {
          utils: {
            // 拆分特定的模块
            test: /(utils\.js)$/,
            name: "utils",
            chunks: "initial",
            priority: -9, // 优先级
          },
          // 拆分npm安装的第三方模块
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor",
            chunks: "initial",
            priority: -10,
          },
          // 拆分剩下的业务代码模块
          default: {
            name: "common",
            chunks: "initial",
            minChunks: 2, //模块被引用2次以上的才抽离
            priority: -20,
          }
        },
      },
    },
  };

  // vite.config.ts 对象指定
  export default {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vue: ["vue"],
            lodash: ["lodash"],
          },
        },
      },
    },
  };

  // vite.config.ts 函数
  export default {
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes("vue")) {
              return "vue";
            }
            if (/node_modules/.test(id)) {
              return "vender";
            }
          },
        },
      },
    },
  };
  ```
+ 代码压缩, 去除不必要的代码
  ```JavaScript
  // webpack.config.js
  const TerserPlugin = require("terser-webpack-plugin");
  const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin')
  module.exports = {
    optimization: {
      minimize: true,
      minimizer: [ new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }) ]
    },
    plugins: [
      new OptimizeCssAssetsWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        minify: { // 压缩html
          collapseWhitespace: true,
          removeComments: true
        }
      })
    ]
  }
  ```
+ 使用服务端渲染: SSR, 略过
