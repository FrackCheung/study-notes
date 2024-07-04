+ [总目录](../readme.md)
***
- [过渡](#过渡)
- [动画](#动画)
***
#### 过渡
+ 过渡: 让CSS属性值发生变化时, 避免突变, 而是在一段时间内完成
+ 过渡使用`transition`属性, 它是以下四个属性的简写形式:
  - `transition-property`: 要应用过渡的CSS属性
  - `transition-duration`: 过渡的持续时间
  - `transition-timing-function`: 过渡的时间曲线
  - `transition-delay`: 过渡的延迟时间
+ 应用过渡的属性: `transition-property`
  - 可以应用在所有的CSS属性上
  - 可以应用在`::after`和`::before`伪元素上
  - 属性值使用逗号分隔
  - `all`: 表示应用到所有支持过渡的属性上
  - `none`: 表示不应用过渡效果, 默认值
  ```CSS
  div { transition-property: color, width; }
  ```
***
**注解:** 如果属性不支持过渡, 或者浏览器不支持过渡, 会自动回退为`none`
***
+ 应用过渡的时间: `transition-duration`
  - 指定过渡从开始到完成, 历经的时间
  - 默认值: `0s`, 可以使用`s`或者`ms`作为时间单位, 不能为负值
  ```CSS
  div { transition-duration: 200ms; }
  ```
  - 可以为指定的属性使用不同的过渡时间, 以逗号分隔
  ```CSS
  div {
    transition-property: color, width;
    transition-duration: 200ms, 500ms;
  }
  ```
***
**注解:** 关于`transition-duration`和`transition-property`的数量
+ 数量相等: 则一一对应, 每一个属性过渡都采用对应的时间
+ 过渡时间数量多: 则多出来的过渡时间都将被忽略
+ 过渡属性数量多: 则多出来的过渡属性都将使用最后一个过渡时间
+ 恰好声明两个过渡时间: 则奇数位的属性用第一个, 偶数位属性用第二个
***
+ 应用过渡的时间曲线: `transition-timing-function`
  - 时间曲线指定了过渡效果的速度, 支持关键字, 自定义贝塞尔曲线, 以及步进方法
  - 关键字: `ease`, 默认值, 慢速开始, 中间加速, 最后减速
  - 关键字: `linear`: 匀速进行
  - 关键字: `ease-in`: 慢速开始, 然后加速直到结束
  - 关键字: `ease-out`: 加速开始, 然后减速直到结束
  - 关键字: `ease-in-out`: 类似于`ease`, 两端慢, 中间快, 但速度不同
  ```CSS
  div { transition-timing-function: ease-in-out; }
  ```
  - 自定义贝塞尔曲线: `cubic-bezier()`, 接受两个控制柄的`x`和`y`坐标
  ```CSS
  /** 这就是linear匀速过渡所对应的贝塞尔曲线 */
  div { transition-timing-function: all cubic-bezier(0, 0, 1, 1); }
  ```
  - 步进方法: 不提供平滑过渡, 将过渡时间等分为`n`段, 在每段上进行突变
  - 步进方法: 使用`start`和`end`指定突变发生在时间段的开始还是结尾 
  - 步进方法: `steps(n, start)`, 时间分为`n`段, 每段中先突变, 再等时间结束
  - 步进方法: `steps(n, end)`, 时间分为`n`段, 每段中先等待时间结束, 再突变
  - 步进方法: `step-start`, 相当于`steps(1, start)`
  - 步进方法: `step-end`, 相当于`steps(1, end)`
  ```CSS
  div { transition-timing-function: width steps(5, start); }
  ```
***
**注解:** 关于贝塞尔曲线, 实在不懂, 就在网上查询相应效果的曲线公式, 直接用
***
+ 应用过渡的延迟时间: 使用`transition-delay`属性
  - 过渡将在延迟时间之后, 再开始, 默认值为`0s`, 可以指定`s`或者`ms`
  - 过渡延迟时间也可以设置为多个值, 用逗号分隔
  ```CSS
  div { transition-delay: 0ms 200ms; }
  ```
***
**注解1:** 延迟时间和过渡属性的数量判断, 与`transition-duration`一致

**注解2:** 延迟时间可以设置为负数
+ 绝对值小于`transition-duration`: 会从中间处等比位置开始过渡
```CSS
div {
  /** 过渡会从3/4处开始, 持续50ms */
  transition-duration: 200ms;
  transition-delay: -150ms;
}
```
+ 绝对值大于`transition-duration`: 则属性值瞬间变化, 和没有过渡一致
***
+ 简写属性: 使用`transition`, 使用如上的顺序
```CSS
div { transition: color 200ms ease-in-out 100ms; }
```
+ 过渡事件: `transitionend`
  - 过渡完成后, 会触发`transitionend`事件
  - 事件回调参数包括 属性名称, 伪元素, 和持续时间
```JavaScript
const div = document.querySelector('div');
div.addEventListener('transitionend', event => {
  const { propertyName, pseudoElement, elapsedTime } = event;
  console.log(propertyName); // 过渡属性名称
  console.log(pseudoElement); // 伪元素, 没有则为空字符串
  console.log(elapsedTime); // 持续时间
});
```
***
**注解:** 过渡成功才会触发`transition`事件, 要注意可能会触发多次
```CSS
div {
  border-radius: 10px;
  transition: border-radius 200ms ease 20ms;
  /** 会触发4次transitionend事件, 因为圆角有四个 */
}
```
***
+ `transition-property`支持所有的属性, 但不是所有属性都支持过渡
```CSS
div { transition: display 100ms ease 20ms; }
/** 可以写, 但display不支持过渡 */
```
***
**注解:** 起始/结束状态有值, 可以通过内插得到中间值的属性, 才支持过渡
***

#### 动画
+ 动画: 和过渡一样, 让CSS属性值发生变化时, 避免突变, 而是在一段时间内完成
+ 过渡是一种简单的动画, 动画优势更明显, 具有更为精细化的控制手段
  - 过渡只提供起始和终止两个状态, 中间状态全权交由浏览器负责
  - 动画可以指定多个中间状态, 浏览器再进行状态之间的填充, 形成更精细的变化
```HTML
<style>
  div {
    background-color: red;
    transition: background-color 200ms ease 10ms;
  }
</style>
<script>
  const div = document.querySelector('div');
  div.addEventListener('click', () => {
    div.style.backgroundColor = 'green';
  });

  // 应用以上代码, div背景色只会从红色, 过渡到绿色, 浏览器负责中间的插值
</script>

<!-- 通过动画, 还可以在红色和绿色之间, 添加任意颜色, 形成更丰富的变化 -->
```
+ CSS动画需要`@keyframes`关键帧和`animation`属性配合使用
+ 定义关键帧: 使用`@keyframes`关键字
  - 定义关键帧的标识符, 紧跟在`@keyframes`后面
  ```CSS
  @keyframes my_animation { /** 关键帧的内容 */ }
  ```
  - 定义关键帧选择器, 使用百分数或关键字`from`/`to`, 这是相对于动画持续时间的
  ```CSS
  /** 百分数 */
  @keyframes my_animation {
    0%   { /** 使用动画的属性和值 */ }
    50%  { /** 使用动画的属性和值 */ }
    100% { /** 使用动画的属性和值 */ }
  }

  /** 关键字 */
  @keyframes my_animation {
    from { /** 使用动画的属性和值 */ }
    to   { /** 使用动画的属性和值 */ }
  }
  ```
  - `from`/`to`表示动画持续时间的开始和结尾, 中间可以混用百分数
  ```CSS
  @keyframes my_animation {
    from { /** 使用动画的属性和值 */ }
    33%  { /** 使用动画的属性和值 */ }
    66%  { /** 使用动画的属性和值 */ }
    to   { /** 使用动画的属性和值 */ }
  }
  ```
  - 定义动画属性, 可以写任意属性, 但只有支持的属性才会生效
  ```CSS
  @keyframes my_animation {
    from { width: 100px; background-color: red; }
    33%  { width: 140px; background-color: green; }
    66%  { width: 120px; background-color: yellow; }
    to   { width: 100px; background-color: red; }
  }
  ```
***
**注解:** `from`和`to`可以省略, 将为其自动添加, 属性值为初始值
```CSS
div { border-radius: 50%; }
@keyframes my_animation {
  0%   { border-radius: 0%; } /** 不省略, 就必须设置为和初始值一样 */
  50%  { border-radius: 50%; }
  100% { border-radius: 0% }  /** 不省略, 就必须设置为和初始值一样 */
}
```
***
**注解:** 可以通过JavaScript操作动画, 在JavaScript DOM中讲述了如何操作样式表
***
+ 在元素上应用动画: 使用`animation`属性, 它是以下属性的简写
  - `animation-name`: 指定动画名称, 即`@kayframes`标识符, 默认值为`none`
  ```CSS
  div { animation-name: my_animation; }

  /** 可以逗号分隔应用多个动画, 无效或不存在的会被忽略 */
  div { animation-name: my_animation, my_animation2; }
  ```
  - `animation-duration`: 指定动画时长, 使用`s`或者`ms`, 默认值为`0s`
  ```CSS
  div { animation-duration: 2s; }

  /** 可以逗号分隔应用多个时间, 为不同的动画指定不同的时间 */
  div {
    animation-name: my_animation, my_animation2;
    animation-duration: 200ms, 400ms;
  }

  /** 如果时间有无效值, 整个声明都将忽略, 相当于animation-duration: 0s */
  div { animation-duration: 2s, 0, 100ms; }
  ```
  - `animation-timing-function`: 设置动画的时间曲线, 和过渡完全一致
  ```CSS
  div { animation-timing-function: ease-in-out; }

  /** animation-timing-function可以放在关键帧中 */
  @keyframes my_animation {
    30% {
      width: 200px;
      animation-timing-function: linear;
    }
    /** ... */
  }
  ```
  - `animation-delay`: 设置动画延迟, 默认值`0s`, 使用`s`或者`ms`
  ```CSS
  div { animation-delay: 200ms; }
  ```
  - `animation-iteration-count`: 指定动画重复次数, 默认值为`1`
  ```CSS
  /** 还有一个关键字: infinite, 表示无限重复 */
  div { animation-iteration-count: infinite; }

  /** 可以指定为小数, 则最后一次动画将在中途结束 */
  div {
    animation-duration: 2s;
    animation-iteration-count: 2.5; /** 最后一次只持续1秒就结束 */
  }

  /** 可以指定多个重复, 为不同的动画提供对应的重复次数 */
  div {
    animation-iteration-count: 1, 2, 3;
  }
  ```
  - `animation-direction`: 设置动画的播放方向, 默认值为`normal`
  ```CSS
  /** normal: 从0%开始, 到100% */
  div { animation-direction: normal; }

  /** reverse: 从100%开始, 到0% */
  div { animation-direction: reverse; }

  /** alternate: 奇数次为normal, 偶数次为reverse */
  div { animation-direction: alternate; }

  /** alternate-reverse: 奇数次为reverse, 偶数次为normal */
  div { animation-direction: alternate-reverse; }
  ```
  - `animation-fill-mode`: 动画的填充模式, 默认值`none`
  ```CSS
  /** 动画开始之前和结束之后, 动画样式都不会再应用到元素上 */
  div { animation-fill-mode: none; }

  /** 动画结束之后, 元素依然应用最后一帧的样式 */
  div { animation-fill-mode: forwards; }

  /** 动画开始之前, 元素就先应用第一帧的样式 */
  div { animation-fill-mode: backwards; }

  /** 同时应用backwards和forwards */
  div { animation-fill-mode: both; }
  ```
  - `animation-play-state`: 动画的暂停和播放, 值为`running`和`paused`
  ```CSS
  div { animation-play-state: running; }
  div:hover { animation-play-state: paused; }
  ```
***
**注解:** 几点说明
+ `animation-delay`也可以设置为负值, 效果可以参考`transition-delay`
+ 动画, 时长, 重复次数都可以设置为多个, 数量不匹配时, 参考过渡中的解释
+ `animation-fill-mode`: 如果设置了延迟时间, 效果会更明显
***
+ 使用`animation`简写属性, 顺序即为上述讲述的顺序
```CSS
@keyframes my_animation {
  20% { background-color: yellow; }
  40% { background-color: green; }
  60% { background-color: pink; }
  80% { background-color: blue; }
}
div {
  animation:
    my_animation /** animation-name */
    2s           /** animation-duration */
    ease-in-out  /** animation-timing-function */
    20ms         /** animation-delay */
    infinite     /** animation-iteration-count */
    reverse      /** animation-direction */
    both         /** animation-fill-mode */
    running      /** animation-play-state */
}
```
+ 动画事件: 动画从开始到结束, 共涉及三个事件
  - `animationstart`: 动画开始时触发
  - `animationiteration`: 在两次重复之间触发
  - `animationend`: 动画结束时触发, `infinite`则永远不会触发
  - 三个事件的回调函数参数都包含了动画名称, 伪元素, 持续时间
```JavaScript
const div = document.querySelector('div');
div.addEventListener('animationstart', event => {
  const { animationName, pseudoElement, elapsedTime } = event;
  console.log(animationName); // 动画名称
  console.log(pseudoElement); // 伪元素, 没有则为空字符串
  console.log(elapsedTime); // 持续时间
});
```
