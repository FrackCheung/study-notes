

#### 概念
- 使用类数组语义结构化访问二进制数据
- `Typed`类型是指看待一组位序列的视图, 本质上是一个映射, 比如 8 位有符号整形
- 通过`ArrayBuffer`构造器来创建位集合, 是一个二进制`buffer`, 预先全部初始化位 0
```JavaScript
// 构建位集合
const buffer = new ArrayBuffer(32); // 开辟了一个32字节的缓冲区
console.log(buffer.byteLength); // 32

// 定型数组, buffer视图
const typedArray = new Uint16Array(buffer);
console.log(typedArray.length); // 16
// buffer是32字节, 也就是256位的缓冲区
// typedArray是Uint16类型的数组, 每个元素是16位, 即两字节
// 因此typedArray的长度是32 / 2, 即16
```

- `buffer`本身除了查看其`byteLength`属性外, 不支持任何其他交互
- 在`buffer`之上, 可以放置一个视图, 该视图以定型数组的形式存在
- 大小端(`Endianness`):
  - `TypedArray`的映射是按照 JavaScript 的平台的大小端设置进行的
  - 大小端的定义: 多字节数字中的低字节位于这个数字字节表示中的右侧还是左侧
  - 不要把`buffer`数组的底层二进制存储的大小端, 和给定数字在 JavaScript 程序中的表示混淆
  - Web 上最常用的是小端表示

```JavaScript
// 大小端
// 设想一个十进制数字: 3085
// 1. 用一个16位容器表示, 无论大小端, 都是: 0000110000001101
// 2. 如果用两个8位数组表示:
//   (1) 大端: 00001100/00001101
//   (2) 小端: 00001101/00001100
// 如果接收到一个来自于小端系统的表示3085的位序列: 0000110100001100
// 在大端系统中为其建立视图, 得到的值将是3340

// 检测JavaScript大小端的方法
function isLittleEndianness() {
  const buffer = new ArrayBuffer(2);
  new DataView(buffer).setInt16(0, 256, true);
  return new Int16Array(buffer)[0] === 256;
}
isLittleEndianness(); // true-->小端, false-->大端

// buffer数组底层大小端存储和JavaScript程序中表示的数字的区别
const display = (3085).toString(2); // 0000110000001101, 大端表示
const isLittleEndian = isLittleEndianness(); // true 系统采用小端

// 上面两行代码是不是矛盾了?
// 输出的3085的二进制表示是0000110000001101
// 但是经过判断, 系统采用的是小端表示, 那应该是0000110100001100才对啊

// 非也: (3085).toString(2)采用的是16位视图, 而并非两个8位
```

- 多视图: 单个`buffer`缓冲区可以关联多个视图

```JavaScript
// 多视图
const multiViewBuffer = new ArrayBuffer(2);
const dataView8 = new Uint8Array(multiViewBuffer);
const dataView16 = new Uint16Array(multiViewBuffer);
dataView16[0] = 3085; // 二进制: 0000110000001101
console.log(dataView8[0]); // 13 二进制: 00001101
console.log(dataView8[1]); // 12 二进制: 00001100
// 交换大小端
const tmp = dataView8[0];
dataView8[0] = dataView8[1];
dataView8[1] = tmp;
console.log(dataView16[0]); // 3340 二进制: 0000110100001100
```

- 定型数组构造器不仅可以传入`buffer`, 还有额外参数`byteOffset`和`length`, 以及多种使用变体
  - `constructor(buffer, byteOffset?, length?)`
  - `constructor(length)`, 在一个新的长度为`length`字节的`buffer`上创建一个新的视图
  - `constructor(typedArray)`, 创建一个新的视图和`buffer`, 把`TypedArray`视图的内容复制进去
  - `constructor(obj)`, 创建一个新的视图和`buffer`, 并在类数组对象 obj 上迭代复制其内容

```JavaScript
// 定型数组的额外参数: 偏移量和长度
// 从不同位置, 不同长度访问缓冲区数据
const buf = new ArrayBuffer(8); // 8个字节的缓冲区
const first = new Uint16Array(buf, 0, 2)[0];
const second = new Uint8Array(buf, 2, 1)[0];
const third = new Uint8Array(buf, 3, 1)[0];
const fourth = new Uint32Array(buf, 4, 4)[0];

// 定型数组的多种变体
console.log(new Uint8Array(16).length);
console.log(new Uint8Array([1, 2, 3]));

// 定型数组赋值超过其声明的位数
const typedArr = new Uint8Array(3); // 创建长度为3个字节的视图
// Uint8Array, 只能创建8位无符号整数, 范围为0-255
typedArr[0] = 10;
typedArr[1] = 20; // 平方值溢出255
typedArr[2] = 30; // 平方值溢出255
const typedArrMap = typedArr.map(v => vv);
console.log(typedArrMap); // [100, 144, 132];
// 解决问题, 使用TypedArray.from()方法
const typedArrFrom = Uint16Array.from(typedArr, v => vv);
console.log(typedArrFrom);
```

- 不能在定型数组上使用不合理的`Array.prototype`方法, 如:
  - `splice()`
  - `push()`
  - `concat()`
  - ...
- 定型数组中的元素时限制在声明的位数中, 如果视图赋值大于其声明的位数, 这个值委会折回
