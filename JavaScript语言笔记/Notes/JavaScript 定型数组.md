+ [总目录](../readme.md)
***
- [背景](#背景)
- [ArrayBuffer](#arraybuffer)
- [DataView](#dataview)
- [定型数组](#定型数组)
***
#### 背景
+ JavaScript只有一种数值类型, 采用双精度浮点型
+ WebGL等技术出现后, JavaScript具备了直接和硬件GPU交互的能力, 但GPU通常不需要双精度浮点型的数据
+ 早期WebGL会对JavaScript传递的数值数组进行转换处理, 得到所需要的格式, 这导致了严重的性能问题
+ JavaScript的数值类型和GPU需要的数值类型不匹配, 因此诞生了定型数组
+ 定型数组的数据可以直接传递给图形硬件底层API, 从而使得3D绘制具有更高的性能
***
**注解1:** 早期的时候还没有专门的定型数组, 为了解决不匹配的问题, Mozilla开发出了一个专门存放浮点值的数组, `CanvasFloatArray`, 该数组最终演变成了`Float32Array`, 这也是第一个诞生的定型数组

**注解2:** `Float32Array`实际上是一种`视图`, 视图允许JavaScript访问一种被称为`ArrayBuffer`的预分配内存, 其他定型数组也是如此, 因此, 要了解定型数组, 首先需要从头了解`ArrayBuffer`和`视图`
***

#### ArrayBuffer
+ ArrayBuffer是所有定型数组和视图引用的基本单位
+ ArrayBuffer可以在内存中, 分配指定数量的字节空间
```JavaScript
const buffer = new ArrayBuffer(16);
console.log(buffer.byteLenth); // 16
```
+ ArrayBuffer一经创建, 就不能再修改其大小
+ ArrayBuffer实例可以调用`slice`方法复制部分或全部到新的实例
```JavaScript
const buffer = new ArrayBuffer(16);
const buffer2 = buffer.slice(4, 12);
console.log(buffer2.byteLength); // 8
```
+ ArrayBuffer的一些特点:
  - ArrayBuffer分配内存失败时会抛出错误
  - ArrayBuffer分配的内存大小不能超过`Number.MAX_SAFE_INTEGER`字节
  - ArrayBuffer会将分配的内存空间的所有二进制位设置为0
  - ArrayBuffer分配的内存, 不使用时会被垃圾回收
***
**注解1:** ArrayBuffer分配内存空间后, 不允许对其内部数据进行读写操作

**注解2:** 1 byte = 8 bit, 即一个字节是8位

**注解3:** 要想操作ArrauBuffer, 必须通过`视图`, 视图有很多种类型
***

#### DataView
+ DataView是视图的一种, 用于读写ArrayBuffer分配的内存空间
+ DataView视图是专门为文件I/O和网络I/O设计
+ 所有类型的视图中, DataView对ArrayBuffer的控制程度最高, 但性能也最低
  - DataView的API对于ArrayBuffer的操作是最丰富的
  - DataView不能迭代ArrayBuffer(文档后续会讲解)
+ 使用`new DataView`即可创建一个DataView实例, 接收三个参数:
  - 参数1: 必须, 要操作的ArrauBuffer实例
  - 参数2: 可选, 偏移量, 表示从ArrayBuffer开始读写的位置
  - 参数3: 可选, 表示要读写多少个字节长度
```JavaScript
const buffer = new ArrayBuffer(16);
const dataView = new DataView(buffer);
```
+ DataView实例的属性:
  - `byteOffset`: 表示在当前ArrayBuffer中的读写偏移量
  - `byteLength`: 表示在当前ArrayBuffer中的读写字节长度
  - `buffer`: 表示当前DataView正在操作的ArrayBuffer实例
```JavaScript
const buffer = new ArrayBuffer(16);

const dataView1 = new DataView(buffer);
console.log(dataView1.byteOffset); // 0
console.log(dataView1.byteLength); // 16
console.log(dataView1.buffer === buffer); // true

const dataView2 = new DataView(buffer, 8);
console.log(dataView2.byteOffset); // 8
console.log(dataView2.byteLength); // 8
console.log(dataView2.buffer === buffer); // true

const dataView3 = new DataView(buffer, 8, 16);
console.log(dataView3.byteOffset); // 8
console.log(dataView3.byteLength); // 8
console.log(dataView3.buffer === buffer); // true
```
+ DataView读取操作:
  - DataView必须指定读取类型, 读取的偏移量, 以及读取的字节序
  - DataView实例通过调用`get`方法读取内容
  - 越界读取, 会抛出错误
***
**注解1:** 读取类型, 只包含以下几种
|  类型   |      描述      | 占用字节数 |           范围           |
| :-----: | :------------: | :--------: | :----------------------: |
|  Int8   | 8位有符号整数  |     1      |        -128 - 127        |
|  Uint8  | 8位无符号整数  |     1      |         0 - 255          |
|  Int16  | 16位有符号整数 |     2      |      -32768 - 32767      |
| Uint16  | 16位无符号整数 |     2      |        0 - 65535         |
|  Int32  | 32位有符号整数 |     4      | -2147483648 - 2147483647 |
| Uint32  | 32位无符号整数 |     4      |      0 - 429496295       |
| Float32 |   32位浮点数   |     4      |    -3.4e+38 - 3.4e+38    |
| Float64 |   64位浮点数   |     8      |   -1.7e+308 - 1.7e+308   |

**注解2:** 关于字节序, 在本小节的最后单独讲述
***
```JavaScript
const buffer = new ArrayBuffer(16); // 16字节
const dataView = new DataView(buffer);

// 按照Int8类型, 从第1个字节开始, 读取1个字节
console.log(dataView.getInt8(0)); // 0

// 按照Int32类型, 从第4个字节开始, 读取4个字节
console.log(dataVieww.getInt32(3)); // 0

// 按照Float64类型, 从第15个字节开始, 读取8个字节
console.log(dataView.getFloat64(14)); // RangeError
```
+ DataView写入操作
  - 和读取一样, 首先要指定类型, 偏移量, 以及字节序
  - 值可以是十进制或者十六进制
```JavaScript
const buffer = new ArrayBuffer(2); // 2字节
const dataView = new DataView(buffer);

// 将整个ArrayBuffer全部设置为1
dataView.setInt8(0, 255); // 255的二进制表示为: 11111111
dataView.setInt8(1, 0xFF); // 255的十六进制表示为: 0xFF
```
***
**注解1:** 二进制1个数字表示1位, 十六进制1个数字或字母表示4位

**注解2:** 读取和写入类型不一致的话, 结果也是不一样的
```JavaScript
const buffer = new ArrayBuffer(2); // 2字节
const dataView = new DataView(buffer);
dataView.setInt8(0, 255);
dataView.setInt8(1, 0xFF);

console.log(dataView.getInt16(0)); // -1
console.log(dataView.getUint16(0)); // 65535
```

**注解3:** 二进制表示负数的方法: 补码
+ 计算机中是没有真正的负数这个概念的, 因为二进制都是0和1, 计算出来也只有正数
+ 为了表示负数, 计算机采用补码的形式, 简单记忆为: `按位取反再加1`
  - 首先将负数的绝对值, 表示为二进制
  - 再将所有位反转, 即0变成1, 1变成0
  - 再将结果加上1
+ 示例: 将-5表示为二进制, 以一个字节8位为例:
  - 首先将-5取绝对值, 5, 其二进制是: 00000101
  - 按位取反, 得到: 11111010
  - 再加1, 得到: 11111011, 即为-5的二进制表示
+ 将二进制还原为负数, 就把上述过程反转, 简单记忆为: `减1取反加负号`
+ 将 11111111 转为负数:
  - 先减去1, 得到: 11111110
  - 再按位取反, 得到 00000001, 对应的十进制数字是1
  - 加上负号, 得到-1, 因此11111111负数表示为-1
+ 要想取到负数, 则必须使用有符号类型, 如`Int8`, 不能是无符号类型, 如`Uint8`

**注解:** 思考题, 推导出一个字节能表示的负数范围
***
+ 字节序: 即大端字节序和小端字节序
  - 大端字节序: 最高有效位在第一个字节, 最低有效位在最后一个字节
  - 小端字节序: 最低有效位在第一个字节, 最高有效位在最后一个字节
  - DataView默认使用大端字节序, 但接受布尔参数, 为`true`启用小端字节序
```JavaScript
const buffer = new ArrayBuffer(2);
const dataVieww = new DataView(buffer);

// 将buffer设置为 1000000000000001
// 高位字节: 10000000
// 低位字节: 00000001
dataView.setInt8(0, 0x80);
dataView.setInt8(1, 0x01);

// 大端字节序读取
console.log(dataView.getInt16(0)); // 2*15 + 2^0 = 32769

// 采用小端字节序读取
// 高位字节: 0000 0001
// 低位字节: 1000 0000
// 完整二进制: 0000000110000000
console.log(dataView.getInt16(0, true)); // 2^7 + 2^8 = 384

// =========================================================

const buffer = new ArrayBuffer(2);
const dataView = new DataView(buffer);

// 小端字节序写入数据
// 写入0x0004, 二进制为: 00000000 00000100
dataView.setInt16(0, 0x0004, true);
// 小端写入, 因此字节调换, 实际二进制为: 00000100 00000000

// 大端字节序读取
console.log(dataView.getInt8(0)); // 4
console.log(dataView.getInt8(1)); // 0
```
***
**注解1:** 大端字节符合人类的数字书写习惯, 高位在左, 低位在右

**注解2:** 字节序的意思是排列顺序只影响字节, 而不会影响字节中的bit位, 每个字节中的8个bit位的顺序不变

**注解3:** 再次重复提醒:
+ 1 byte = 8 bit
+ 二进制1个数字是1位
+ 十六进制1个数字是4位, 并以`0x`作为十六进制的标识

**注解4:** 如果逐字节写入数据, 则不管大端还是小端, 结果都一样, 因为第一个参数已经决定了写入哪个字节, 因此写入数据时, 只有多字节写入, 大小端才有区别
```JavaScript
const buffer = new ArrayBuffer(2);
const dataView = new DataView(buffer);

dataView.setInt8(0, 1);
dataView.setInt8(1, 2);
console.log(dataView.getInt8(0), dataView.getInt8(1)); // 1 2

dataView.setInt8(0, 1, true);
dataView.setInt8(1, 2, true);
console.log(dataView.getInt8(0), dataView.getInt8(1)); // 1 2
``` 
***
+ 视图也可以通过字节索引来读取/写入值
```JavaScript
const buffer = new ArrayBuffer(2);
const dataView = new DataView(buffer);

dataView[0] = 0x80; // 10000000
dataView[1] = 0x01; // 00000001

console.log(dataView[0]); // 128
```

#### 定型数组
+ 定型数组也是一种操作ArrayBuffer的视图
+ 定型数组只能使用指定的类型读写ArrayBuffer, 并且扩充了一些API
+ 定型数组拥有比DataView更高的性能, 适合与WebGL, GPU等快速交换数据
+ 定型数组的类型: 拥有和DataView读写类型一致的类型
+ 定型数组统一采用`类型 + Array`的表达方式: 如`Int8Array`等
+ 定型数组的属性:
  - `length`: 表示其中元素的个数
  - `byteLength`: 字节总数
  - `buffer`属性: 指向定型数组引用的ArrayBuffer
  - `BYTES_PER_ELEMENT`: 每个元素的字节数
+ 定型数组的创建: 
  - 使用已有ArrayBuffer创建定型数组
  ```JavaScript
  const buffer = new ArrayBuffer(16);
  const int16 = new Int16Array(buffer);
  console.log(int16.length); // 8
  console.log(int16.byteLength); // 16
  console.log(int16.buffer === buffer); // true
  ```
  - 使用自身构造函数, 创建指定长度的定型数组
  ```JavaScript
  const float32 = new Float32Array(10);
  console.log(float32.length); // 10
  console.log(float32.byteLength); // 40
  console.log(float32.buffer.byteLength); // 40
  ```
  - 使用自身构造函数, 创建包含指定元素的定型数组
  ```JavaScript
  // 三角形的三个顶点的坐标, 每一行一个点, 分别是x, y, z
  const triangle = new Float32Array([
    -1.0, 0.0, 0.0,
     1.0, 0.0, 0.0,
     0.0, 1.0, 0.0
  ]);
  console.log(triangle.length); // 9
  console.log(triangle.byteLength); // 36
  console.log(triangle.BYTES_PER_ELEMENT); // 4
  ```
  - 复制已有的定型数组
  ```JavaScript
  const int16 = new Int16Array([2, 4, 6, 8]);
  const int16_copy = new Int16Array(int16);
  console.log(int16.length); // 4
  console.log(int16.byteLength); // 8
  console.log(int16.BYTES_PER_ELEMENT); // 2
  console.log(int16 === int16_copy); //false
  ```
  - `from`和`of`: `from`传入数组, `of`传入离散值
  ```JavaScript
  const uint8 = Uint8Array.from([2, 4, 6, 8]);
  const int32 = Int32Array.of(2, 4, 6, 8);
  ```
+ 定型数组没有预设值, 则会用0填充所有元素
```JavaScript
const float32 = new Float32Array(10);
console.log(float32[0]); // 0
console.log(float32[4]); // 0
console.log(float32[8]); // 0
```
+ 定型数组的方法:
  - 定型数组支持绝大部分普通数组的方法
  - 定型数组不能修改大小, 不支持长度会发生变化的数组方法
  - 定型数组的独有方法: `set`和`subarray`
+ 给已存在的定型数组赋值, 使用`set`方法:
  - 参数1: 可以是普通数组, 也可以是其他定型数组
  - 参数2: 可选, 从索引处开始赋值, 默认是0
```JavaScript
const int16 = new Int16Array(8);
int16.set([1, 2, 3, 4]);

const int8 = Int8Array.of(5, 6, 7, 8);
int16.set(int8, 4);

console.log(int16); // [1, 2, 3, 4, 5, 6, 7, 8]
```
+ 复制定型数组的值, 生成新的定型数组, 使用`subarray`方法
  - 不指定参数, 复制整个定型数组
  - 参数1: 可选, 起始索引
  - 参数2: 可选, 结束索引, 不加则到末尾
```JavaScript
const int8 = Int8Array.of(1, 2, 3, 4, 5, 6, 7, 8);
const int8_sub1 = int8.subarray();
const int8_sub2 = int8.subarray(4);
const int8_sub3 = int8.subarray(4, 7);

console.log(int8_sub1); // [1, 2, 3, 4, 5, 6, 7, 8]
console.log(int8_sub2); // [5, 6, 7, 8]
console.log(int8_sub3); // [5, 6, 7, 8]
```
***
**注解1:** 单个ArrayBuffer可以关联多个视图
```JavaScript
const buffer = new ArrayBuffer(2);
const uint8 = new Uint8Array(buffer);
const uint16 = new Uint16Array(buffer);
uint16[0] = 3085; // 二进制: 0000110000001101
console.log(uint8[0]); // 13 二进制: 00001101
console.log(uint8[1]); // 12 二进制: 00001100
```

**注解2:** 部分场景下, 可以将常规的数值型数组, 改为使用定型数组, 以提高性能
***