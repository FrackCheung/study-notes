+ [总目录](../readme.md)
***
- [Cookie](#cookie)
- [sessionStorage](#sessionstorage)
- [localStorage](#localstorage)
- [indexedDB](#indexeddb)
***
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
+ indexedDB的结构:
  - indexedDB可以包含多个`对象仓库`(Object Store)
  - 每个对象仓库用于存放固定结构的数据
+ indexedDB一般遵循以下的使用过程:
  - 打开或创建数据库
  - 创建或更新数据库模式
  - 通过事务来执行数据库操作, 即增删查改
***
**注解1:** 对象仓库, 类似于MySQL的表, 同一个对象仓库所存放的数据, 其结构是一样的

**注解2:** indexedDB的概念繁多, 很多概念需要结合示例才能理解, 我们假设有如下的数据, 我们的数据库将会用来保存这些数据
```JavaScript
const studentsData = [
  { name: '张三', id: '070501', sex: 'male', tel: '112233' },
  { name: '李四', id: '070502', sex: 'female', tel: '445566' },
  { name: '王五', id: '070503', sex: 'male', tel: '778899' }
];

// 数据库的名称固定
const dbName = 'students';
```
***
+ 数据库操作: (1) 打开或创建数据库
  - 调用indexedDB的`open`方法
  - `open`方法返回打开/创建的请求实例
  - 需要监听请求实例的`onerror`和`onsuccess`方法获取结果
  - 事件`event`参数的`target`属性均指向请求实例
  - 如果成功, 可以通过`event.target.result`获取数据库实例
```JavaScript
const request = indexedDB.open(dbName, 1);
request.addEventListener('error', event => {
  console.log(`数据库错误: ${event.target.errorCode}`);
});
request.addEventListener('success', event => {
  // 数据库实例
  const db = event.target.result;
});
```
***
**注解1:** `open`方法的第二个参数是数据库版本, 这个概念不好理解

**注解2:** 理解数据库的版本
+ 数据库的版本, 确定了该数据库的对象仓库, 以及存储的结构, 统称数据库模式
+ `open`方法中的数据库版本参数可以省略, 但是要分两种情况说明:
  - 对于新建数据库, 省略参数, 默认会使用1
  - 对于打开已有数据库, 省略参数, 则默认使用该数据库的版本
+ 数据库版本涉及到一个重要事件`onupgradeneeded`, 以下情况会触发:
  - 新建数据库, 数据库版本默认传1, 会强制触发该事件
  - 打开已有数据库, 但传入了比该数据库版本更高的版本, 会触发该事件
  - **PS:** 需要在请求实例上监听该事件
+ **重点:** 修改数据库模式, 必须在`onupgradeneeded`事件中进行
+ 解释:
  - 新建数据库, 此时数据库模式是空的, 啥都没有, 因此需要创建数据库模式
  - 打开已有数据库, 但传入高版本, 说明数据库模式需要更新, 因此触发事件
  - 如果不需要更新数据库模式, 则千万不要传入高版本, 省略版本参数即可

**注解3:** 浓缩的重点
+ 新建数据库, 版本传1, 并在`onupgradeneeded`事件中创建数据库模式
+ 更新已有数据库模式, 传入高版本参数, 并在`onupgradeneeded`事件中更新
+ 无需更新数据库模式, 则版本参数省略

**注解4:** 数据库版本参数只能使用整数, 因为该值会被保存为`unsigned long long`类型, 使用浮点数可能会导致打开数据库失败
***
+ 数据库操作: (2) 创建对象仓库
  - 使用数据库实例的`createObjectStore`方法, 两个参数
  - 参数1: 对象仓库的名称, 类似于MySQL的表名称
  - 参数2: 配置项, 包含两个属性:
    + `KeyPath`: 相当于表的主键
    + `autoIncrement`: 使用自增ID作为主键
  - 创建对象仓库前, 先判断一下是否存在: `objectStoreNames.contain`
```JavaScript
const request = indexedDB.open(dbName, 1);
request.addEventListener('error', event => {
  console.log(`数据库错误: ${event.target.errorCode}`);
});
request.addEventListener('upgradeneeded', event => {
  /**
   * @type {IDBDatabase}
   */
  const db = event.target.result;

  if (!db.objectStoreNames.contains('students_table')) {
    const objectStore = db.createObjectStore('students_table', {
      keyPath: 'id'
    });
  }
  /**
   * 或者使用自增ID作为主键
   * const objectStore = db.createObjectStore('students_table', {
   *   autoIncrement: true
   * });
   */
});
```
***
**注解1:** 当监听了`onupgradeneeded`事件后, 可以不用再监听`onsuccess`事件了, 同样可以通过事件参数的`event.target.result`取得数据库实例

**注解2:** 数据库主键, 能够唯一标识每一条记录的字段, 一般选取绝对不会重复的字段, 或者给数据库设置一个自增ID
***
+ 数据库操作: (3) 创建索引
  - 使用对象仓库的`createIndex`方法, 接收三个参数
  - 参数1: 索引名称
  - 参数2: 索引对应的数据的键值
  - 参数3: 配置项, 常用`unique`, 表示该键值的数据是否包含重复
  - 索引暂时先不讲述其用途, 放到文档最后再讲
```JavaScript
request.addEventListener('upgradeneeded', event => {
  const db = event.target.result;
  const objectStore = db.createObjectStore('students_table', {
    KeyPath: 'id'
  });
  objectStore.createIndex('tel', 'tel', { unique: true });
});
```
***
**注解:** 直到创建索引这一步, 在`onupgradeneeded`事件中需要做的事情已经做完了, 即创建数据库模式, 后续的数据操作, 不能在该事件中执行了
***
+ 数据库操作: (4) 新增数据
  - 数据库的操作必须通过事务来完成, 事务使用数据库实例的`transaction`方法
  - `transaction`参数1: 要操作的对象仓库名称, 多个名称需要使用字符串数组
  - `transaction`参数2: 操作方式, 包括`readonly`, 以及`readwrite`
  - 通过事务的`objectStore`方法, 获取对象仓库, 传参为对象仓库名称
  - 调用对象仓库的`add`方法, 新增数据, 返回值是一个新增请求实例
  - 监听返回值的`onerror`和`onsuccess`判断是否新增成功
```JavaScript
const studentObjectStore = db
  .transaction('students_table', 'readwrite')
  .objectStore('students_table');
studentsData.forEach(data => {
  studentObjectStore.add(data);
});
/**
 * 监听返回值
 * const addRequest = studentObjectStore.add(data);
 * addRequest.onerror = event => {  }
 * addRequest.onsuccess = event => {  }
 */
```
+ 数据库操作: (5) 读取数据
  - 读取数据也必须通过事务完成
  - 中间过程和新增数据一致
  - 使用`get`方法读取数据, 传参是主键的值
  - `get`方法返回值是一个读取请求实例, 后文不再赘述
  - 通过事件参数的`event.target.result`属性, 获取读取结果
```JavaScript
const readRequest = db
  .transaction('students_table', 'readonly')
  .objectStore('students_table')
  .get('070501');
readRequest.addEventListener('success', event => {
  console.log(event.target.result);
  // { name: '张三', id: '070501', sex: 'male', tel: '112233' }
});
```
+ 数据库操作: (6) 游标遍历数据
  - 仍然要通过事务, 并通过事务的`objectStore`方法拿到对象仓库
  - 调用对象仓库的`openCursor`方法, 获取游标, 该方法返回游标请求实例
  - 在游标请求实例的`onsuccess`事件的`event.target.result`中获取游标
  - 使用游标遍历数据, 游标有如下的关键属性
    + `key`: 当前记录数据的主键
    + `value`: 表示了当前的这一条完整记录数据
  - 使用游标的`continue`方法移动到下一条记录, 该方法会重用事件
```JavaScript
const cursorRequest = db
  .transaction('students_table', 'readonly')
  .objectStore('students_table')
  .openCursor();
cursorRequest.addEventListener('success', event => {
  const cursor = event.target.result;
  if (cursor) {
    console.log(`id: ${cursor.key}`);
    console.log(`name: ${cursor.value.name}`);
    console.log(`sex: ${cursor.value.sex}`);
    console.log(`tel: ${cursor.value.tel}`);
    cursor.continue();
  } else {
    console.log('Done');
  }
});
```
+ 数据库操作: (7) 更新数据
  - 更新数据也必须通过事务完成
  - 中间过程和新增数据一致
  - 使用`put`方法更新数据, 传参新的记录数据, 但主键不能变
  - `put`方法返回值是一个更新请求实例
```JavaScript
const readRequest = db
  .transaction('students_table', 'readonly')
  .objectStore('students_table')
  .put({ name: '张麻子', id: '070501', sex: 'male', tel: '112233' });
readRequest.addEventListener('success', () => {
  console.log(`更新成功`);
});
```
+ 数据库操作: (8) 删除数据
  - 删除数据也必须通过事务完成
  - 中间过程和新增数据一致
  - 使用`delete`方法删除数据, 传参是主键的值
  - `delete`方法返回值是一个更新请求实例
```JavaScript
const readRequest = db
  .transaction('students_table', 'readonly')
  .objectStore('students_table')
  .delete('070501');
readRequest.addEventListener('success', () => {
  console.log(`删除成功`);
});
```
+ 数据库操作: (9) 使用索引
  - 在数据库的创建过程中, 还使用`createIndex`创建了索引
  - 索引的用处是可以搜索任意字段, 不建立索引的话, 只能使用主键搜索
  - 和前面一样, 使用事务, 获取对象仓库
  - 调用对象仓库的`index`方法, 传入创建的索引名称, 获取索引实例
  - 调用索引实例的`get`方法, 传入索引键对应的值, 返回搜索请求实例
  - 通过事件参数的`event.target.result`属性, 获取搜索
```JavaScript
const indexSearchRequest = db
  .transaction('students_table', 'readonly')
  .objectStore('students_table')
  .index('tel')
  .get('112233');
indexSearchRequest.addEventListener('success', event => {
  console.log(`搜索结果: ${event.target.result || 'NotFound'}`);
});
```
***
**总结:** 学得会就学, 学不会就TM算了
***