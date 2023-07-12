# JavaScript 对象

**[返回主目录](../readme.md)**

#### 属性描述符
+ `writable`: 是否可修改属性值
+ `configurable`:
  - 是否可使用`Object.defineProperty`配置属性
  - 是否可删除属性
+ `enumerable`: 是否可以枚举, 即:
  - 是否出现在`for...in`中
  - 是否出现在`Object.keys()`中

```JavaScript
// 即使对象的Configurable为false
// 依然可以通过Object.defineProperty()将其Writable从true改为false
// 但无法再将false改为true
const myObject3 = {};
Object.defineProperty(myObject3, 'myAttribute', {
    value: 'attributeValue',
    writable: true,
    configurable: false, // 将配置属性设置为false
    enumerable: true
});
Object.defineProperty(myObject3, 'myAttribute', {
    writable: false // 此处配置是合法的
});
Object.defineProperty(myObject3, 'myAttribute', {
    writable: true  // 此处会失败!
});
```

+ `Object.getOwnProperties`: 返回所有的自身属性, 无论是否可枚举
+ 对象不变性: 是`浅不变性`, 只对`目标对象本身`及`自有属性`生效, 对引用的其他对象无效
```JavaScript
// 对象不变性的实现方法(对于引用的外部对象是无效的)
const myObject4 = {
    value: 123,
    someMethod: Array.prototype.slice  // 此处someMethod属性引用了外部对象
}
Object.defineProperty(myObject4, 'value', {
    writable: false,
    configurable: false
}); // 将赋值和配置都设为false, 则value属性不可更改/删除!
Object.preventExtensions(myObject4); // 禁止对象扩展新属性, 保留当前已有属性
Object.seal(myObject4); // 密封对象, 禁止配置和删除已有属性, 也会禁止扩展新属性
Object.freeze(myObject4); // 冻结对象, 禁止配置和删除已有属性, 禁止扩展新属性, 禁止修改属性值
```

#### 小知识

```JavaScript
// 给数组添加一个属性，且属性名可转为数字，则会变成数值下标
const arr1 = [];
arr1['1'] = 1;
console.log(arr1.length); // 2
console.log(arr1[0]); // undefined
console.log(arr1[1]); // 1
```

****
**[返回主目录](../readme.md)**