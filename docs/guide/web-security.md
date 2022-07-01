# WEB安全
## XSS

Cross Site Scripting

跨站脚本攻击

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210120093829316.png)

- 获取页面数据
- 获取Cookies
- 劫持前端逻辑
- 发送请求
- 偷取用户资料
- 偷取网站任意数据
- 偷取用户密码和登录态
- 欺骗用户



### 反射型攻击

通过url参数直接注入

例如: 在网址url后面加入`<script>`脚本, 便会执行该脚本内容

​		获使用src属性链接远端脚本进行攻击



### 存储型攻击

存储到DB后读取时注入

例如: 在文章底部发表评论带上`<script>`脚本, 那么该条评论会存储到数据库中

​		将该文章网址发给其他用户, 只要打开网址便会中招



### 攻击注入点

- HTML节点内容
- HTML属性
- JavaScript代码
- 富文本



### 防御手段

1. 转义html标签括号

~~~js
let escapeHtml = function (str) {
  str = str.replace(/</g, '&lt;')
  str = str.replace(/>/g, '&gt;')
  return str
}
//在可能出现攻击注入的节点用该方法进行转义
~~~

2. 转义html属性引号与空格

~~~js
let escapeProperty = function (str) {
  if (!str)return ''
  str = str.replace(/"/g, '&quto;')
  str = str.replace(/'/g, '&#39;')
  str = str.replace(/ /g, '&#32;')
  return str
}
~~~

3. 使用JSON.stringfy方法转义解决js代码注入

4. 使用XSS库去转义

5. CSP

   - Content-Security-Policy

   - 内容安全策略
   - 用于指定哪些内容可以执行

   ~~~js
   //在http头中设置来源:Content-Security-Policy
   child-src//页面子内容 如iframa子页面
   connect-src//网络链接 如ajax请求
   default-src//默认链接 其他链接没有指定就找该链接
   font-src//字体
   frame-src//框架
   img-src//图片
   manifest-src//webapp的信息
   media-src//音频视频
   object-src//插件之类的
   script-src//脚本
   style-src//样式
   worker-src//可允许多个源
   //信任来源
   <host-source>//来自哪个主机域名
   <scheme-source>//来自哪种协议
   'self'//与页面同域的
   'unsafe-inline'//直接插入在页面中的内容 如xss攻击
   'unsafe-eval'//信任调用eval函数
   'none'//不信息任何来源
   'nonce-<base64-value>'//指定一次性的匹配内容,匹配才执行
   <hash-source>//后端指定哈希,前端匹配哈希才执行
   'strict-dynamic'//指定信任脚本中又访问的其他脚本和地址是否信任
   //设置http头
   (`Content-Security-Policy`: `default-src 'self'`)
   ~~~

   

## CSRF

Cross Site Request Forgy

跨站请求伪造

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210120133818331.png)

- 利用用户登录态
- 用户不知情
- 完成业务请求
- 盗取用户资金
- 冒充用户发帖背锅
- 损坏网站名誉



### 防御手段

1. 禁止第三方网站带cookie, 设置same-site属性

~~~js
ctx.cookies.set('userId', user.id, {
	httpOnly:false,
	sameSite:'strict'
})
~~~

2. 使用验证码验证信息, 如ccap图形验证码库
3. 使用token验证
4. 验证http请求头中的referer

~~~js
let referer = ctx.request.headers.referer
if(!/^https?:\/\/localhost/.test(referer)){
   throw new Error('非法请求')
}
~~~



## Cookies

### 特性

- 前端数据存储
- 后端通过http头设置
- 请求时通过http头传给后端
- 前端可读写
- 遵守同源策略
- 域名 ( 可以在哪些域名可以使用 )
- 有效期
- 路径 ( 作用于网站的url哪一级 )
- http-only ( http请求和发送可以使用cookie, js不能使用 )
- secure ( 只能在https中使用cookie, http是无法使用的 )

例如: 设置有效期

~~~js
let time = new Date().toGMTString()
document.cookie = `a=1; expires=${time}`
~~~



### 作用

- 存储个性化设置
- 存储未登录时用户唯一标识
- 存储已登录用户的凭证
- 存储其他业务数据



### 安全策略

使用node的crypto模块加密

~~~js
let crypto = require('crypto')
let key = 'gaojianghua'
//加密
let cipher = crypto.createCipher('des', key)
let text = cipher.update('hello world', 'utf8', 'hex')
text += cipher.final('hex')

console.log(text)
//解密
let decipher = crypto.createDecipher('des', key)
let originalText = decipher.update(text, 'hex', 'utf8')
originalText += decipher.final('utf8')

console.log(originalText)
~~~





## 点击劫持

通过iframe标签引用真实页面并将其透明, 显示假的网页

当用户点击时, 点击的是透明的真实页面内容

sandbox可选值为允许哪种操作, 若不填值则表示禁用所有行为

`sandbox="allow-forms"`允许表单提交, 其他行为禁止 ( 下方防御手段js禁止内嵌代码将失效 )

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
<body style="background: url('123.png') no-repeat">
<iframe style="opacity: 0" src="http://localhost:3000" sandbox="allow-forms" width="800" height="600"></iframe>>
</body>
</html>
~~~



### 防御手段

1. JS脚本禁止内嵌网页

- top指向的是body页面本身
- window指向的是iframe引用页面

~~~js
if (top.location != window.location){
  top.location = window.location
}
~~~

2. X-FRAME-OPTIONS禁止内嵌

- 设置http头X-FRAME-OPTIONS

~~~js
ctx.set('X-Frame-Options', 'DENY')//禁止内嵌
//其他值
//SAMEORIGIN 嵌入页和被嵌入页在同一个域下才允许
//ALLOW-FROM http://localhost:3000 允许指定的网址内嵌
~~~





## HTTP传输窃听

http传输协议是明文传输

前端发送请求在代理服务器以及链路层中容易被窃听篡改

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210120175853132.png)



窃听

- 窃听用户密码
- 窃听传输敏感信息
- 非法获取个人资料

篡改

- 插入广告
- 重定向网站
- 无法防御的XSS和CSRF攻击



### HTTPS

通过TLS ( SSL ) 将明文加密传输到达服务器再进行解密

保证不被窃听篡改 

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210121094308431.png)



存在中间人隐患, 无法确定传输目标的身份

可能出现中间人顶替服务器来接收

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210121092419560.png)



解决中间人隐患, 使用CA证书机制

- 证书无法伪造
- 证书私钥不被泄露
- 域名管理权不泄露
- CA坚守原则

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210121100221790.png)

使用方法:

- 申请域名

- 申请证书 验证域名并下载

- 证书内容

  - ca_bundle.crt	CA证书

  - certificate.crt	个人证书
  - private.key	私钥

- 将CA与个人证书合并为fulichain.crt文件

- 开启https服务

  ~~~js
  const Koa = require('koa')
  const app = new Koa()
  const fs = require('fs')
  const https = require('https')
  
  https.createServer({
    key:fs.readFileSync('./cert/private.key'),
    cert:fs.readFileSync('./cert/fullchain.crt')
  }, app.callback()).listen(3000, function () {
    console.log('https服务已启动!')
  })
  ~~~

- 修改电脑host文件, 将127.0.0.1指向域名地址

- 最后使用域名访问即可



正式环境部署

- curl https://get.acme.sh | sh	安装脚本可申请免费证书

- cd /root/.acme.sh	进入脚本目录

- ./acme.sh --issue -d news.toobug.net --webroot /data/web/news.toobug.net/

  - ./acme.sh --issue	签发新证书
  - news.toobug.net	使用的域名
  - --webroot /data/web/news.toobug.net/	使用的web根目录

- 配置nginx: vi /etc/nginx/conf.d/news.toobug.net.conf

  ~~~nginx
  server {
      listen	80;
      listen	443 ssl http2;
      server_name	news.toobug.net;
      ssl_certificate /root/.acme.sh/news.toobug.net/fullchain.cer;
      ssl_certificate_key /root/.acme.sh/news.toobug.new/news.toobug.net.key;
      
      location / {
          root /data/web/news.toobug.net;
      }
  }
  ~~~

- 重启nginx: nginx -s reload

- 最后使用域名访问即可



## 密码安全

- 密码的作用
- 密码的存储
- 密码的传输
- 密码的替代方案
- 生物特征密码的问题

### 彩虹表

加密字典的收录, 可使用复杂的嵌套加密来对抗彩虹表

如: md5 ( 明文 )	md5( md5 ( 明文 ) )	md5 ( sha1 ( 明文 ) )	md5 ( sha256 ( sha1 ( 明文 ) ) )

使用加盐来加强密码复杂度

盐: 用户的唯一值, 由系统随机生成

如: md5 ( sha1 ( md5 ( ID+ab83kd+原始密码+81kdso+盐+1lso;$2 ) ) )



变换次数越多越安全

- 加密成本几乎不变 ( 密码生成速度会慢些 )
- 彩虹表失效 ( 数量太大, 无法建立通用性 )
- 解密成本增大N倍