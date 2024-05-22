# JavaScript 正则表达式

**[返回主目录](../readme.md)**

#### 正则表达式的创建
+ `字面量`
+ `RegExp对象`
```JavaScript
// 方式一
const pattern = /test/;

// 方式二
const pattern = new RegExp('test');
```

#### 正则表达式修饰符
+ `i`: 不区分大小写
+ `g`: 全局查找所有匹配项
+ `m`: 允许多行匹配
+ `y`: 粘连匹配, 试图从最后一个匹配位置开始
+ `u`: 允许Unicode点转义符

#### 正则表达式重复匹配项
+ `?`: 前面的字符出现0次或1次
+ `+`: 前面的字符出现1次或多次
+ `*`: 前面的字符出现0次或1次或多次
+ `{n}`: 前面的字符出现n次
+ `{n,m}`: 前面的字符出现n次到m次
+ `{n,}`: 前面的字符出现至少n次

#### 正则表达式的贪婪/非贪婪模式:
+ `贪婪模式`: 尽可能多的匹配字符
+ `非贪婪模式`: 尽可能少的匹配字符
+ 在运算符末尾添加`?`, 使其变为非贪婪模式
+ 贪婪/非贪婪主要用在`重复匹配`

```JavaScript
const originString = 'aaaaaaaaaaaaaaa';

// 贪婪匹配
const pattern1 = /a+/; // 'aaaaaaaaaaaaaaa'

// 非贪婪匹配
const pattern2 = /a+?/; // 'a'
```

#### 正则表达式对象独一无二
```JavaScript
const pattern1 = /^[abc].*$/;
const pattern2 = /^[abc].*$/;
console.log(pattern1 === pattern2); // false
```

#### match()方法和捕获组
+ `match()`方法返回的是一个数组
+ 数组的第一个元素是整个正则表达式匹配到的结果
+ 如果正则表达式中有括号用于捕获, 则捕获结果会填充数组的第2, 3, ...个元素
+ 如果正则表达式加上了`/g`全局匹配, 则返回结果只包含匹配数组, 会忽略捕获
+ `/g`全局匹配若想保留捕获内容, 应该使用`exec()`方法
```JavaScript
const string = 'transform: translateX(-20px)'
const pattern = /(translateX)\((.*)\)/; // 有两个括号用于捕获, 因此返回的数组有3个元素

console.log(string.match(pattern)); // ['translateX(-20px)', 'translateX', '-20px']

string.match(pattern).forEach(output=>console.log(output));
// 'translateX(-20px)' 这是整个表达式匹配到的值
// 'translateX' 这是第一个括号捕获到的内容
// '-20px' 这是第二个括号捕获到的内容

// 加入/g标识符
const p = /(tr)/g;
console.log(string.match(p)); // ['tr', 'tr']
```

#### exec()方法和捕获组
+ `exec()`方法返回数组, 包含`匹配内容`和`捕获内容`
+ `exec()`方法只会返回`第一次匹配`的内容, 后面的会忽略
+ 正则表达式加入`/g`标识, 会使`exec()`方法能够`重复调用`
+ 每次调用都从上次结束匹配的位置开始, 搜寻下个匹配, 其返回内容和`match()`一致
+ 如果`exec()`方法搜寻不到新的匹配, 则会返回`null`, 表示搜寻结束
```JavaScript
const string = 'transform: translateX(-20px)'

// 加入/g标识符, 搜寻tr字符串, 同时还使用括号进行捕获
const p = /(tr)/g;

// ['tr', 'tr'] 第一个匹配(transform的tr), 两个元素分别是匹配内容和捕获内容
console.log(p.exec(string));

// ['tr', 'tr'] 第二个匹配(translateX的tr), 两个元素分别是匹配内容和捕获内容
console.log(p.exec(string));

// null 总共只有两个tr, 因此第三次调用将搜寻不到内容, 返回null
console.log(p.exec(string));
```

#### 被动子表达式和捕获组
+ 括号有时不仅是用于捕获, 也需要将一些`字符归类操作`
+ 这样正则表达式中会有很多括号, `match()`等方法可能会产生大量无意义的捕获内容
+ 通过在左括号后面紧跟`?:`, 将该括号的内容视为被动子表达式, 不进行捕获

```JavaScript
// 定义一个字符串
const string = 'prefix-prefix-content'

/**
 * 这里有两个括号
 * 外层括号: 是想捕获content之前的所有内容
 * 里层括号: (prefix-)是为了分组, 配合+符号进行重复匹配
 */
const p = /((prefix-)+)content/;

// ['prefix-prefix-content', 'prefix-prefix-', 'prefix-'] 多了一些捕获内容
console.log(string.match(p));

// 被动子表达式
const pattern = /((?:prefix-)+)content/;

// ['prefix-prefix-content', 'prefix-prefix-'] 得到了想要的内容
console.log(string.match(pattern));
```

#### 字符串替换的replace()方法
+ 普通的用法不再赘述, 很简单
+ `replace()`方法的第二个参数可以是函数, 会在匹配内容上调用
+ 该函数的第一个参数是`匹配的内容`, 第二个参数视情况而定
+ 若有捕获组, 则第二个参数是捕获内容, 若无, 则是匹配内容的索引
```JavaScript
let string = 'border-radius-left-top';

// 没有捕获组
const pattern1 = /-[a-z]/g;
string.replace(pattern1, (matchContent, index)=>{
    console.log(matchContent, index); // -r 6 -l 13 -t 18
});

// 有捕获组
const pattern2 = /-([a-z])/g;
string.replace(pattern2, (matchContent, group)=>{
    console.log(matchContent, group); // -r r -l l -t t
});

// 连字符替换为小驼峰
string = string.replace(pattern2, (_, group) => group.toUpperCase());
console.log(string); // borderRadiusLeftTop
```

#### 正则表达式的一些用法
+ 匹配`换行符`: 普通的正则表达式无法匹配换行符, 可以使用`/[\s\S]*/`, 匹配所有ASCII字符
+ 匹配`Unicode`字符: 使用`/[\w\u0080-\uFFFF_-]*/`, 匹配所有字符, 包括Unicode
+ 匹配转义字符: 使用`/^((\w+)|(\\.))+$/`匹配所有的ACSII字符, 包括所有的转义字符

****
**[返回主目录](../readme.md)**