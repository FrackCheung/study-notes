# 学习笔记
+ 记录Web领域和程序设计领域的学习笔记
+ 包括但不限于:
  - `JavaScript`
  - `WebGL`
  - `TypeScript`

## TIPS
+ WebGL笔记文档多为`markdown`格式, 其中的部分$\LaTeX$公式可能无法正常预览
+ 这里有两个解决方案: `Github`和`VSCode`
  - VSCode下: 安装`Markdown All in One`扩展或者`Markdown Preview Enhanced`扩展
  - GitHub下: 安装`MathJax Plugin for GitHub`插件(仅在`Chrome`下测试通过)
***
**TIPS:** `MathJax Plugin for GitHub`需要自行查找安装方式, 如果你有梯子, 直接Google扩展市场即可
***


#### GitHub克隆加速配置
+ 首先你得需要一个能够科学上网的梯子, 否则免谈
+ 假设本机的`socks`代理端口是1080, `http`代理端口是1087
+ 配置的目的, 是让`git`相关命令走代理
+ `git clone`有两种常用克隆形式:
  - `SSH`: 使用`git@github.com`的形式
  - `HTTPS`: 使用`https://github.com`的形式
  - 两种方案配置方法不一样!
+ `HTTPS`配置方式, 注意, 两种代理只能留一个:
```bash
# 使用socks代理
git config --global http.proxy socks5://127.0.0.1:1080
git config --global https.proxy socks5://127.0.0.1:1080

## 使用http代理
git config --global http.proxy http://127.0.0.1:1087
git config --global https.proxy http://127.0.0.1:1087

## 取消代理
git config --global --unset http.proxy
git config --global --unset https.proxy
```
+ `SSH`配置方式: 需要区分操作系统, 这里以`Windows 11`和`MacBook Pro M2`为例
+ `SSH`连接需要用到连接工具, 而这个工具在两种操作系统上不同, 这就是主要的区别
+ `Windows 11`的`SSH`配置方式:
  - 首先需要安装`Git`工具, 官网即可
  - 将`C:\Program Files\Git\mingw64\bin`添加到环境变量
  - 打开`cmd`输入`connect`看环境变量是否添加成功
  - 若成功, 则开始配置`git`代理
  - 编辑`~/.ssh/config`文件, 没有就新建一个
  - 写入如下内容, 注意, 两种代理方式只能留一个
```bash
Host github.com
    HostName github.com
    User git
    # 使用socks代理
    ProxyCommand connect -S 127.0.0.1:1080 -a none %h %p
    # 使用http代理
    ProxyCommand connect -H 127.0.0.1:1087 -a none %h %p
```
+ `MacBook Pro M2`的`SSH`配置方式:
  - 同样需要安装`Git`工具, 使用`brew`或官网
  - 打开终端, 输入`nc`命令看是否有该命令
  - 若有`nc`命令, 则开始配置`git`代理
  - 编辑`~/.ssh/config`文件, 没有就新建一个
  - 写入如下内容, 注意, 仅使用`socks`代理
```bash
Host github.com
    HostName github.com
    User git
    # 使用socks代理
    ProxyCommand nc -v -x 127.0.0.1:1080 %h %p
```