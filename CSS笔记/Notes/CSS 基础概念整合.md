#### 盒模型可见尺寸
+ 元素框体: 
  - 元素在文档中显示时, 创建的一个矩形的框体
  - 由内容区域, 内边距, 边框, 外边距四部分构成
+ 元素框体可见尺寸: 由内容, 内边距, 边框三部分构成
+ 使用`width`和`height`属性:
  - 默认情况下, 指定的是元素框体内容区域的尺寸
  - 内边距, 边框, 外边距会在内容区域外追加尺寸
  ```CSS
  div {
    width: 200px;
    height: 200px;
    padding: 100px;
    border: 50px solid red;
    margin: 0;
  }
  /** 元素框体的可见尺寸, 宽高500px */
  ```
***
**注解:** 边框必须要设置样式, 否则边框会被忽略, 宽度重置为0
***
+ 修改`width`和`height`的计算规则: 使用`box-sizing`, 三个取值
  - `content-box`: 默认值, 表示内容区域的尺寸
  - `border-box`: 表示边框, 内边距和内容区域加起来的尺寸
  ```CSS
  div.second {
    box-sizing: border-box;
    width: 200px;
    height: 200px;
    padding: 20px;
    border: 20px;
    margin: 0;
  }
  /** 元素框体的实际可见尺寸, 宽高200px */
  /** 元素框体的内容区域尺寸, 宽高120px */
  ```
***
**注解1:** 将`box-sizing`设置为`border-box`后, 使用`width`和`height`指定的就是元素框体的实际可见尺寸

**注解2:** 除非`box-sizing`设置为`content-box`, 否则元素框体的内容区域尺寸没有显示的方法指定

**注解3:** 建议始终使用`border-box`, 便于进行元素排列
```CSS
*, ::before, ::after {
  box-sizing: border-box;
}
```
***
+ 元素框体可见尺寸的变更
  ```CSS
  div {
    box-sizing: border-box;
    width: 200px;
    height: 200px;
    padding: 100px;
    border: 100px solid red;
    margin: 0;
  }
  /** 元素框体的实际可见尺寸, 宽高400px */
  /** 元素框体的内容区域尺寸, 宽高0 */
  ```

#### 盒模型的百分比尺寸
+ 元素框体的容器: 容器为元素框体提供了布局上下文
+ 元素框体的容器: 离元素最近的`块级`祖先元素
+ 在`width`和`height`上使用百分比尺寸:
  - `width`会根据容器内容区域的宽度计算
  - `height`会根据容器内容区域的高度计算
  ```CSS
  div.container {
    box-sizing: border-box;
    width: 300px;
    height: 260px;
    padding: 50px;
    border: 40px solid red;
    margin: 0;
  }

  div.content {
    width: 50%; /** 60px */
    height: 50%; /** 40px */
  }
  ```
+ 在内边距上使用百分比尺寸, 根据容器内容区域的宽度计算
  ```CSS
  div.content {
    width: 50%; /** 60px */
    height: 50%; /** 40px */
    padding: 10%; /** 12px */
  }
  ```
+ 在外边距上使用百分比尺寸, 根据容器内容区域的宽度计算
  ```CSS
  div.content {
    box-sizing: border-box;
    width: 50%; /** 60px */
    height: 50%; /** 40px */
    padding: 10%; /** 12px */
    margin: 20%; /** 24px */
  }
  /** 元素框体的实际可见尺寸, 宽60px, 高40px */
  /** 元素框体的内容区域尺寸, 宽36px, 高16px */
  ```
+ 边框不支持百分比尺寸, 设置百分比尺寸会重置为0

#### 块级盒模型
+ 块级框体: 由块级元素创建的框体
+ 块级元素: 元素独占一行, 前后会折行
+ 置换元素和非置换元素:
  - 非置换元素: 元素内容直接显示在文档上
  - 置换元素: 元素只是一个占位符, 会插入替换内容, 如`img`
+ 横向格式化: 框体的属性值的总和必须等于容器内容区域的宽度
  - 框体属性值: 左右外边距, 左右内边距, 左右边框, 内容区域这七个宽度值
  ```CSS
  /** body宽度为1280px */
  div {
    width: 200px;
    padding-left: 100px;
    padding-right: 300px;
    border: 20px solid red;
    margin-left: 100px;
  }
  /** 元素框体的margin-right为540px */
  ```
  - 使用`auto`: 只有外边距和`width`才能使用`auto`
  - 情况1: 有一个`auto`, 则该值为容器内容区域宽度减去另外六个属性
  ```CSS
  /** body宽度为1280px */
  div {
    box-sizing: border-box;
    width: auto;
    padding-left: 100px;
    padding-right: 300px;
    border: 20px solid red;
    margin-left: 100px;
    margin-right: 200px;
  }
  /** 元素框体的内容区域宽度为540px */
  /** 元素框体的width为980px */
  ```
  - 情况2: 两侧外边距为`auto`, `width`为明确值, 则两侧外边距等分剩下的值
  ```CSS
  /** body宽度为1280px */
  div {
    box-sizing: border-box;
    width: 600px;
    padding: 0 100px;
    border: 20px solid red;
    margin: 0 auto;
  }
  /** 元素框体的内容区域宽度为360px */
  /** 元素框体居中显示, 两侧外边距为340px */
  ```
  - 情况3: 一个外边距和`width`为`auto`, 另一个外边距为明确值, 则`auto`外边距为0
  ```CSS
  /** body宽度为1280px */
  div {
    box-sizing: border-box;
    width: auto;
    padding: 0 100px;
    border: 20px solid red;
    margin: 0 auto 0 100px;
  }
  /** 元素框体的内容区域宽度为940px */
  /** 元素框体的width为1180px */
  /** 元素框体的margin-right为0 */
  ```
  - 情况4: 三个值都设为`auto`, 则两侧外边距为0
  ```CSS
  /** body宽度为1280px */
  div {
    box-sizing: border-box;
    width: auto;
    padding: 0 100px;
    border: 20px solid red;
    margin: 0 auto;
  }
  /** 元素框体的内容区域宽度为1040px */
  /** 元素框体的width为1280px */
  /** 元素框体的margin-right和margin-left为0 */
  ```
  - 置换元素: 当`width`设置为`auto`时, 内容区域宽度等于置换内容的实际宽度
  ```CSS
  /** body宽度为1280px */
  /** <img src="index.png"> */
  /** index.png图像宽度为220px */
  img {
    display: block;
    width: auto;
    margin: 0 auto;
    padding: 0 100px;
    border: 10px solid green;
  }
  /** 元素框体的内容区域宽度为220px */
  /** 元素框体的width为440px */
  /** 元素框体的margin-right和margin-left为420px */
  ```
  - 过约束: 当七个值总和不等于容器内容区域宽度, 右外边距会被设置为`auto`
  ```CSS
  /** body宽度为1280px */
  div {
    width: 800px;
    margin: 0 100px 0 0; /** 重置为 margin: 0 auto 0 0 */
    padding: 0 200px;
    border: 100px solid red;
  }
  /** 元素框体的内容区域宽度为800px */
  /** 元素框体的可见尺寸为1400px */
  /** 元素框体的margin-left为0 */
  /** 元素框体的margin-right为-220px */
  /** 元素框体向右溢出 */
  ```
  - 负外边距: 在语义上依然满足横向格式化, 但实际结果会比较反人类
  ```CSS
  /** body宽度为1280px */
  div {
    width: 500px;
    margin: 0 -30px; /** 重置为 margin: 0 auto 0 -30px */
    padding: 0 100px;
    border: 100px solid red;
  }
  /** 元素框体的内容区域宽度为500px */
  /** 元素框体的可见尺寸为900px */
  /** 元素框体的margin-left为-30px */
  /** 元素框体的margin-right为410px */
  /** 元素框体向左溢出 */
  ```
***
**注解1:** 一定要时刻区分`width`和内容区域宽度的差异, 当`box-sizing`设置为`content-box`时, 二者一致, 设置为`border-box`时, 二者不一致

**注解2:** 所有和容器有关的尺寸, 都涉及到容器的内容区域宽度, 这是因为, 元素的内容区域才是实际放置子元素或其他内容的区域, 但容器的内容区域宽度不一定就等于容器的`width`, 参考注解1
***
+ 纵向格式化: 

#### 行内盒模型

#### 盒模型的内边距

#### 盒模型的外边距