+ [总目录](../readme.md)
***
- [绝对长度单位](#绝对长度单位)
- [相对长度: em和rem](#相对长度-em和rem)
- [相对长度: 视口单位](#相对长度-视口单位)
- [关于auto值](#关于auto值)
- [无单位数值](#无单位数值)
- [CSS变量](#css变量)
***
#### 绝对长度单位
+ CSS支持如下的几种绝对长度单位:
  - 像素(`px`): CSS像素是抽象概念, `1px`被定义为`1/96`英寸
  - 毫米(`mm`)
  - 厘米(`cm`)
  - 英寸(`in`)
  - 点(`pt`): 印刷术语
  - 派卡(`pc`): 印刷术语
***
**注解:** 换算关系: `1in`=`25.4mm`=`2.54cm`=`6pc`=`72pt`=`96px`

**概念:** DPI, 每英寸像素数, 如果设备每英寸具有96像素, 则该设备的DPI为96
***
+ **科普:** CSS像素有时也被视为相对长度, 这是因为虚拟DPI
  - 浏览器定义符合CSS像素概念的虚拟DPI, 即96
  - 浏览器根据系统分辨率和屏幕尺寸, 计算设备真实DPI
  - 浏览器将真实DPI和虚拟DPI的比值保存在`window.devicePixelRatio`
  - 浏览器将CSS像素乘上`window.devicePixelRatio`转换为物理像素
***
+ **示例:** 假设设备分辨率为3840 * 2160, 尺寸为 20 * 11.25
  - 虚拟DPI为96, 这个是固定的, 符合CSS像素概念
  - 真实DPI为192, 则`window.devicePixelRatio`的值就是2
  - CSS声明的`96px`, 在渲染时需要`96 * 2 = 192`个物理像素
***
**注解1:** `window.devicePixelRatio`定义了一个CSS像素应该用多少个物理像素渲染

**注解2:** 在浏览器上使用缩放工具, 其实就是改变了`window.devicePixelRatio`的值
***
+ **小实验:** 无论怎样缩放浏览器, 元素大小在视觉上都不变化
```HTML
<div></div>
<script>
  const div = document.querySelector('div');
  const resetSize = () => {
    const value = `${300 / window.devicePixelRatio}px`;
    div.style.width = value;
    div.style.height = value;
    requestAnimationFrame(resetSize);
  }
  resetSize();
</script>
```

#### 相对长度: em和rem
+ `em`: 根据当前元素的字号来计算, `1em`即为当前元素的字号大小
  ```CSS
  div { font-size: 12px; border-radius: 2em; }
  /** 当前div的圆角值为24px */
  ```
+ `em`: 如果用在字号上, 则根据从父元素继承过来的字号进行计算
  ```CSS
  :root { font-size: 20px; }
  div.outer { font-size: 0.8em; } /** 16px */
  div.center { font-size: 0.8em; } /** 12.8px */
  div.inner { font-size: 0.8em; } /** 10.24px */
  ```
+ `em`: 同时用在字号和其他属性上, 则先计算字号, 再计算其他属性
  ```CSS
  :root { font-size: 20px; }
  div { font-size: 0.8em; border-radius: 0.8em; }
  /** 字号为16px, 圆角值为12.8px */
  ```
+ `rem`: 是`root em`的缩写, 相对于根元素的字号来计算
  ```CSS
  :root { font-size: 20px; }
  div.outer { font-size: 0.8rem; } /** 16px */
  div.center { font-size: 0.8rem; } /** 16px */
  div.inner { font-size: 0.8rem; border-radius: 0.8rem } /** 16px */
  ```
***
**注解1:** `em`的优势: 非常适合设计一系列大小的组件
```CSS
button {
  font-size: 20px;
  padding: 0.5em 1em;
  border: 0.1em solid green;
  border-radius: 1em;
  margin: 1em; 
}
```

**注解2:** `em`缺点: 可能会导致嵌套元素字号出现问题, 应该使用`rem`
```CSS
:root { font-size: 20px; }
button {
  font-size: 1rem;
  padding: 0.5em 1em;
  border: 0.1em solid green;
  margin: 1em; 
}
```

**注解3:** 设计不同尺寸的组件
```CSS
:root { font-size: 20px; }
button {
  padding: 0.5em 1em;
  border: 0.1em solid green;
  border-radius: 0.5em;
  margin: 1em; 
}
button.small { font-size: 0.75rem; }
button.primary { font-size: 1rem; }
button.large { font-size: 1.25rem; }
```

**CSS准则** 使用`rem`定义字号, 使用`px`定义边框, 使用`em`定义其他属性
***

#### 相对长度: 视口单位
- `vw`: 表示视口宽度的百分之一, 随视口变化而变化
- `vh`: 表示视口高度的百分之一, 随视口变化而变化
  ```CSS
  div { width: 50vw; height: 50vh; }
  ```
- `vmin`: 视口宽度和高度取较小值的百分之一
- `vmax`: 视口宽度和高度取较大值的百分之一
  ```CSS
  /** 横屏: 1280px * 960px */
  div { width: 50vmin; height: 50vmin; } /** 480px */
  div { width: 50vmax; height: 50vmax; } /** 640px */
  ```
***
**注解:** 视口单位不受浏览器缩放的影响, 元素大小在视觉上不变
```CSS
div { width: 20vw; height: 20vh; }
```
***
+ 视口单位可以定义字号大小
  - 使用传统的媒体查询, 字号会在媒体查询的临界点突变
  - 使用视口单位定义字号, 可以提供平滑过渡效果
  - 为了避免视口变小导致字体小到不可见, 可以使用`calc()`方法提供最小字体
  ```CSS
  :root {
    font-size: calc(10px + 1vw);
  }
  ```
***
**注解:** 关于`calc()`方法
+ `calc()`支持不同的单位进行运算, 但支持四则运算
+ `calc()`的运算符两侧必须有空格
```CSS
div { width: calc(100%-200px); } /** 不允许, 必须有空格 */
```
***

#### 关于auto值
+ 本小节只讨论元素的`width`, `height`, 以及外边距使用`auto`的情况
+ `auto`值在水平方向和垂直方向上的计算方式有区别
+ 在水平方向上使用`auto`
  - `width`为`auto`, 外边距为定值, `width`等于容器内容区域宽度减去边框/内边距/外边距
  ```CSS
  div.container { width: 1000px; };
  div.content { width: auto; padding: 100px; margin: 0 100px; }
  /** width为600px, 实际可见尺寸为800px */
  ```
  - `width`为定值, 外边距为`auto`, 左右外边距平分容器内容区域宽度减去边框/内边距的值
  ```CSS
  div.container { width: 1000px; };
  div.content { width: 400px; padding: 100px; margin: 0 auto; }
  /** 左右外边距都为200px, 水平居中的实现方式之一 */
  ```
  - `width`和一侧外边距为`auto`, 另一侧为定值, 则`auto`外边距为0, 然后参考上述示例
  ```CSS
  div.container { width: 1000px; };
  div.content { width: auto; padding: 100px; margin: 0 100px 0 auto; }
  /** width为700px, margin-left为0 */
  ```
  - `width`和两侧外边距都为`auto`, 则左右外边距都设置为0, 再参考上述示例
  ```CSS
  div.container { width: 1000px; };
  div.content { width: auto; padding: 100px; margin: 0 auto; }
  /** width为800px, margin-left和margin-right为0 */
  ```
+ 在竖直方向上使用`auto`
  - `margin-top`和`margin-bottom`只要设置为`auto`, 结果就是0
  - `height`设置为`auto`, 则根据实际内容的高度决定, 没有内容就是0
  - 使用`margin: auto 0`的方式不能实现垂直居中
***
**注解:** 关于置换元素的`auto`值
+ 置换元素: 是占位符, 最终会被替换为其他的内容, 如`img`
+ 置换元素当`width`设置为`auto`时, 最终计算为内容宽度
+ 给置换元素设置显示的`width`可以覆盖此行为
+ **TIPS:** 图片占据的是内容区域
```HTML
<style>
  img {
    display: block;
    width: auto;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid green;
  }
</style>
<!-- index.png的宽度是220px -->
<img src="index.png">
<!-- width会被计算为220px -->
```

#### 无单位数值
+ 只有极少数的CSS属性支持无单位数值:
  - `z-index`: 设置定位元素的层级
  - `font-weight`: 700表示`bold`, 400表示`normal`
  - `line-height`: 接下来单独讲述
+ 无单位的`0`
  - 只能用于长度值和百分比: `0px`, `0em`, `0%`等
  - 不能用于角度值和时间值: 度和秒等必须带上单位
  ```CSS
  div {
    margin: 0;
    transition: all linear 0s;
    transform: rotateX(0deg);
  }
  ```
+ 使用无单位的`line-height`, 子元素将继承该值并当作比例, 相对于子元素字号重新计算
  ```CSS
  :root {
    font-size: 16px;
    line-height: 1.2;
  }
  div { font-size: 2rem; }
  /** div的font-size为32px */
  /** div继承的行高为1.2, 并计算行高为: 32 * 1.2 = 38.4px */
  ```
***
**注解:** 元素的`line-height`必须大于元素的`font-size`, 否则会有文字重叠
***
+ 如果`line-height`使用了单位, 可能会造成意想不到的后果
  ```CSS
  :root {
    font-size: 16px;
    line-height: 1.2em; /** 直接相对于:root元素计算出行高值为19.2px */
  }
  div { font-size: 2rem; }
  /** div的font-size为32px */
  /** div继承的行高为19.2px, 行高小于字号, 文字会重叠 */
  ```
***
**CSS准则:** 始终使用无单位的行高
***

#### CSS变量
+ CSS变量名称必须使用`--`开头
+ CSS变量必须定义在CSS规则块中
+ 定义在`:root`中的CSS变量全局都可以使用
+ 使用`var()`方法引用CSS变量
```CSS
:root {
  --background-color: red;
  --font-color: green;
}
div {
  background-color: var(--background-color);
  color: var(--font-color);
}
```
+ `var()`方法可以提供第二个参数, 作为变量不存在时的备用值
```CSS
:root { --background-color: red; }
div {
  background-color: var(--background-color);
  padding: var(--default-padding, 20px);
}
```
+ `var()`方法如果计算出非法值, CSS属性会使用默认值
```CSS
:root { --background-color: red; }
div { padding: var(--background-color); }
/** 颜色值, 非法, 使用默认值0 */
```
+ CSS变量可以在使用时重新赋值
```CSS
:root { --background-color: red; }
div.content {
  --background-color: green;
  background-color: var(--background-color);
}
```
+ CSS变量可以继承和层叠
```HTML
<style>
  :root { --background-color: white; }
  div.normal { background-color: var(--background-color); }
  div.dark { --background-color: black; }
</style>
<div class="normal dark"></div>
```
+ 使用JavaScript修改CSS变量
  - 读取CSS变量: 使用`getComputedStyle`的`getPropertyValue`方法
  - 设置CSS变量: 使用`setProperty`方法
```HTML
<style>
  :root { --background-color: white; }
  div { background-color: var(--background-color); }
</style>
<div></div>
<script>
  const rootElement = document.documentElement;
  const computedStyle = window.getComputedStyle(rootElement);

  // white
  console.log(computedStyle.getPropertyValue('--background-color'));

  // 不能使用computedStyle.setProperty(), 计算样式是只读的
  rootElement.style.setProperty('--background-color', 'green');
</script>
```
