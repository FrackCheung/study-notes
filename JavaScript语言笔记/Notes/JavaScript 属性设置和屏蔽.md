# JavaScript 属性设置和屏蔽

**[返回主目录](../readme.md)**

#### JavaScript属性设置和屏蔽
+ 原型链`就近`原则: 前端的属性和方法, 会遮蔽掉原型链上的同名属性和方法
+ 假设在某对象上执行语句: `obj.key = value`
  - 自身有key属性, 且`writable`为`true`, 则会修改其值为value
  - 自身有key属性, 且`writable`为`false`, 则赋值失败, 严格模式会报错
  - 自身无key属性, 原型链上也无key属性, 则会直接在`obj`上添加key属性
+ 假设自身无key属性, 但原型链上有key属性:
  - `writable`为`true`, 则在`obj`上添加key属性, 且屏蔽掉原型链上的
  - `writable`为`false`, 赋值语句会抛出错误, 也不会屏蔽
  - key定义了`setter`, 则会触发该`setter`, `obj`上不会添加key属性
+ 上述6种情况, 仅针对于使用`=`赋值的情况, `Object.defineProperty`不受此影响

#### 注意
```JavaScript
// 不小心导致屏蔽的情况
const obj = {
  a: 2
}
const obj2 = Object.create(obj);
obj2.a++; // 隐式屏蔽, 相当于obj2.a = obj2.a + 1;
console.log(obj2.a); // 3
```

****
**[返回主目录](../readme.md)**