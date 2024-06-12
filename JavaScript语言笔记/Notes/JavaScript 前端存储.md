#### Cookie
+ Cookie最初用于在客户端存储会话信息
+ Cookie最初是由服务器在响应头中指定`Set-Cookie`来存储信息
+ 客户端发送的请求, 其头部中都会使用`cookie`带上浏览器存储的Cookie
+ 向跨源服务器发送请求, 即使响应头设置了`Set-Cookie`, 也会被浏览器忽略
```JavaScript
// server.js
const user = 'zhangsan';
const expires = 'Wed, 15-Jan-2025 20:22:42 GMT+0800'
const domain = 'localhost';
const path = '/';

const cookie = `user=${user};expires=${expires};domain=${domain};path=${path}`

app.post("/login", (_, res) => {
  res.setHeader('Set-Cookie', cookie);
  res.send({ result: 'OK' });
});
```
***
**小知识:** 在express中, 如果多次调用`setHeader()`方法, 且第一个参数一致, 后面的会覆盖前面的, 如果想同时设置多个Cookie, 使用`cookie()`方法
```JavaScript
const cookie1 = `user=zhangsan;expires=...`;
const cookie2 = `login=on;expires=...`;
app.post("/login", (_, res) => {
  res.cookie(cookie1);
  res.cookie(cookie2);
  res.send({ result: 'OK' });
});
```
***
+ 前端访问`/login`接口后, cookie信息就会被存到浏览器中
+ cookie的构成: 名称和值共成一部分, 其他的各自为一部分, 使用分号隔开
  - 名称: Cookie的唯一标识, 不区分大小写, 但建议区分
  - 值: 存在Cookie中的字符串值, 值必须经过URL编码
  - 域(**domain**): Cookie有效的域, 不指定则默认为设置该Cookie的域
  - 路径(**path**): Cookie有效的路径
  - 过期时间(**expires**): Cookie会在到期后被删除, 默认是会话周期
  - 安全标识(**secure**): 仅在HTTPS页面中才会发送Cookie到服务器
  - HTTP-only: 只有服务器才能读取到该Cookie, 客户端无法读取
***
**注解1:** 过期时间必须是GMT格式, 设置为其他格式将被忽略, 过期时间为会话周期
```JavaScript
const GMT_TIME = new Date().toGMTString();
```

**注解2:** Cookie的示例, `secure`不需要设置值, 给定标识即可
```bash
user=zhangsan; expires=Wed, 17 Jun 2024 04:59:52 GMT; domain=localhost; path=/; secure
```

**注解3** 请求只会把Cookie的名称和值发送至服务器, 其他的内容都是给浏览器准备的, 以便浏览器判断是否应该发送或删除Cookie
***
+ Cookie的限制: 对于浏览器总Cookie的数量, 单个域下的Cookie数量, 以及占用的磁盘空间, 不同的浏览器有不同的限制
***
**注解1:** 遵循以下要求, 基本上就不会遇到问题(该数据可能已经过时, 仅做参考)
+ 所有Cookie: 数量不要超过300个
+ 单个域Cookie
  - 数量不要超过20个, 总大小不要超过80KB
  - 单个Cookie大小不要超过4KB

**注解2:** 如果设置的Cookie数量超过上限, 浏览器会删除之前的Cookie; 如果设置的Cookie大小超过限制, 该Cookie会静默删除
***
+ JavaScript Cookie: 使用`document.cookie`
  - 调用`document.cookie`, 返回当前页面所有有效的cookie, 只包含名称和值, 分号隔开
  ```JavaScript
  console.log(document.cookie); // user=zhangsan; login=on
  ```
  - 返回的名称和值都是经过`encodeURIComponent`编码的, 因此需要解码
  ```JavaScript
  const cookies = document.cookie.split(';').map(item => {
    const [key, value] = item.split('=');
    return [ decodeURIComponent(key), decodeURIComponent(value) ];
  });
  const cookieMap = new Map(cookies);
  ```
  - 调用`document.cookie`可以直接设置cookie, 格式和前文一致
  ```JavaScript
  document.cookie = 'name=value;expires=...;domain=...';
  ```
  - 设置cookie之前, 最好先用`encodeURIComponent`编码
  ```JavaScript
  document.cookie = `
    ${encodeURIComponent(name)}=${encodeURIComponent(name)}
  `;
  ```
  - **PS:** 通过`document.cookie`设置的Cookie不会前后覆盖
  ```JavaScript
  document.cookie = 'name=zhangsan;expires=...';
  document.cookie = 'age=18;expires=...';
  document.cookie = 'sex=male;expires=...';

  console.log(document.cookie);
  // name=zhangsan; age=18; sex=male
  ```
***
**注解:** JavaScript原生操作Cookie的方式太过于晦涩, 通常都是借助第三方库或者自己编写一个Cookie工具

**练习:** 手动编写一个CookieUtil工具, 支持快速配置Cookie
***
+ 子Cookie: 为了绕过浏览器对于Cookie的数量限制
```JavaScript
document.cookie = `subcookie=user=zhangsan&sex=male;expires=...`;
```
***
**注解:** 完善上述的CookieUtil工具, 需要支持子Cookie
***

#### sessionStorage
+ sessionStorage只存储会话数据
+ sessionStorage数据不受页面刷新影响 (取决于浏览器, IE会丢失)
+ sessionStorage数据只能由设置的页面使用, 无法跨页面使用
+ 使用`setItem`设置值, 或直接使用属性设置值
+ 使用`getItem`读取值, 或直接使用点语法获取值
```JavaScript
sessionStorage.setItem('book', 'JavaScript');
sessionStorage.book = 'Python';
console.log(sessionStorage.getItem('book')); // Python
console.log(sessionStorage.book); // Python
```
+ 使用`removeItem`移除值, 使用`clear`清除所有值
+ sessionStorage的读写操作都是同步的 (IE除外)
+ sessionStorage具有`length`属性, 可以通过`key(index)`方法获取key值
```JavaScript
for (let index = 0; index < sessionStorage.length; index++) {
  const key = sessionStorage.key(index);
  const value = sessionStorage.getItem(key);
  console.log(key, value);
}
```
***
**注解:** sessionStorage只能存储字符串, 非字符串在存储前会自动转为字符串, 此操作不可逆, 取值时, 需要手动解析回原始对象 (可能要出问题)
```JavaScript
const value = { name: 'zhangsan' };
sessionStorage.setItem('key', value); // [object Object]
```
***
+ 存储限制: 取决于具体的浏览器, 按照每个源来设置, 通常为5MB

#### localStorage
+ localStorage遵循同源策略, 必须同域同协议同端口才能访问同一个localStorage
+ localStorage是持久化存储, 直至编码删除, 或者清除浏览器缓存
+ localStorage不受页面刷新/浏览器关闭/重启的影响
+ 和sessionStorage继承了同样的操作方法:
  - `getItem`和`setItem`读取/设置值
  - 通过点语法设置/读取值
  - 使用`removeItem`和`clear`移除单个或全部值
  - 支持`key(index)`方法获取key值
```JavaScript
localStorage.setItem('book', 'JavaScript');
localStorage.book = 'Python';
console.log(localStorage.getItem('book')); // Python
console.log(localStorage.book); // Python

for (let index = 0; index < localStorage.length; index++) {
  const key = localStorage.key(index);
  const value = localStorage.getItem(key);
  console.log(key, value);
}
```
+ 存储限制: 取决于具体的浏览器, 按照每个源来设置, 通常为5MB
***
**注解:** 存储事件: 当sessionStorage或localStorage发生变化时, 会触发`storage`事件, 事件对象有如下属性:
  - domain: 发生变化对应的域
  - key: 发生变化的键
  - newValue: 设置的新值, 如果删除, 则为`null`
  - oldValue: 变化之前的值
```JavaScript
window.addEventListener('storage', event => {
  const { domain, key, newValue, oldValue } = event;
  // ...
})
```
***

#### indexedDB
+ 用于在浏览器中存储大量的结构化数据, 也包括文件/二进制大对象
+ indexedDB是事务型数据库, 允许存储和检索用键索引的对象
+ indexedDB不需要网络连接, 在线和离线状态均可使用
+ indexedDB的操作都是异步的
+ indexedDB一般遵循以下的使用过程:
  - 打开或创建数据库
  - 在数据库中创建一个`对象存储`
  - 启动`事务`, 通过事务来执行数据库操作, 如添加/获取数据等
***
**注解:** indexedDB的概念繁多, 很多概念需要结合示例才能理解, 我们假设有如下的数据, 我们的数据库将会用来保存这些数据
```JavaScript
const students = [
  { name: '张三', id: '070501', sex: 'male', birth: '2000-06-15' },
  { name: '李四', id: '070502', sex: 'female', birth: '2000-09-23' },
  { name: '王五', id: '070503', sex: 'male', birth: '2000-03-17' }
];

// 数据库的名称固定
const dbName = 'students';
```
***
+ 打开或创建数据库, 异步, 需要监听`onerror`和`onsuccess`事件
```JavaScript

```
