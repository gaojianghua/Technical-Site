# Nvm
## 起步
node版本管理工具

可在[点此在github](https://github.com/coreybutler/nvm-windows/releases)上下载最新版本,本次下载安装的是windows版本。打开网址我们可以看到有两个版本：

- nvm-noinstall.zip：绿色免安装版，但使用时需进行配置。
- nvm-setup.zip：安装版，推荐使用



chcp 437: 开启活动代码页( 437表示GBK用于显示中文使用的 )



## 命令大全:

1,nvm nvm list 是查找本电脑上所有的node版本

\- nvm list 查看已经安装的版本
\- nvm list installed 查看已经安装的版本
\- nvm list available 查看网络可以安装的版本

2,nvm install 安装最新版本nvm

3,nvm use `<version>` ## 切换使用指定的版本node

4,nvm ls 列出所有版本

5,nvm current显示当前版本

6,nvm alias `<name>` `<version>` ## 给不同的版本号添加别名

7,nvm unalias `<name>` ## 删除已定义的别名

8,nvm reinstall-packages `<version>` ## 在当前版本node环境下，重新全局安装指定版本号的npm包

9,nvm on 打开nodejs控制

10,nvm off 关闭nodejs控制

11,nvm proxy 查看设置与代理

12,nvm node_mirror [url] 设置或者查看setting.txt中的node_mirror，如果不设置的默认是 https://nodejs.org/dist/
　　nvm npm_mirror [url] 设置或者查看setting.txt中的npm_mirror,如果不设置的话默认的是： https://github.com/npm/npm/archive/.

13,nvm uninstall `<version>` 卸载制定的版本

14,nvm use [version] [arch] 切换制定的node版本和位数

15,nvm root [path] 设置和查看root路径

16,nvm version 查看当前的版本
