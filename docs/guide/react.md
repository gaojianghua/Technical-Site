# React
## 特点

1. 声明式设计: React采用声明范式, 可以轻松描述应用

2. 高效: React通过对DOM的模拟(虚拟dom), 最大限度的减少与DOM的交互
3. 灵活: React可以与已知的库或框架很好的配合
4. JSX: jsx是JavaScript语法的扩展
5. 组件: 通过React构建组件, 使得代码更加容易复用, 能够很好的应用到大项目中
6. 单向响应的数据流: React实现了单向响应的数据流, 从而减少了重复代码, 这也是它为什么比传统数据绑定更简单



## Next.js

### 部署
- 将Next.js项目输出为独立的SSR程序
  ~~~shell
  #next.config.js
  reactStrictMode: true, 
  swcMinify: true,
  output:"standalone",
  #执行yarn build时，Next.js会将SSR服务器作为一个独立的程序输出到.next/standalone目录中，其中仅包含服务器所需的文件
  ~~~
- 启动SSR服务
  ~~~shell
  #在 .next/standalone 目录中打开终端，输入node server.js,默认会在3000端口启动
  PORT=8000 node server.js    # linux上指定端口启动
  ~~~
- Nginx配置
  ~~~shell
  1. /html 目录下新建 wolffy 文件夹, 可以自定义文件名
  2. 将standalone目录拷贝到 /html/wolffy 目录下
  3. 将 public 目录拷贝到 wolffy/standalone 目录中, 将 .next/static 目录拷贝到 wolffy/standalone/.next 目录中
  4. 打开 nginx 配置文件: nginx.conf 将如下配置添加进去
    # 定义根目录变量
	set $root html/wolffy/standalone;
	root $root;
	access_log html/wolffy/access.log;
	error_log html/wolffy/error.log;
	# 匹配前端路由url，将请求转发至SSR服务器
	location / {
		proxy_pass http://localhost:5000;
	}
	# 用alias（别名）方式提供/.next/static/目录下的静态文件
	# Next.js生成的页面引用/.next/static/目录下的静态文件时，使用的url前缀是/_next/static/
	location /_next/static/ {
		alias $root/.next/static/;
	}
	# 用alias（别名）方式提供/public/images/目录下的静态文件
	location /images/ {
		alias $root/public/images/;
	}
	# 用alias（别名）方式提供直接位于public目录下的静态文件
	location /favicon.ico {
		alias $root/public/favicon.ico;
	}
  ~~~
