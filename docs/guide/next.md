# Next
`Next.js` 是一个流行的 `React` 框架，用于构建快速、可扩展和灵活的现代 `Web` 应用程序。它基于 `React` 和 `Node.js`，并提供了服务器渲染、静态生成以及其他许多强大功能。

[官方文档](https://www.nextjs.cn/)

## 特点和功能
- **服务器渲染（Server-side Rendering）**：`Next.js` 具有内置的服务器渲染功能，可以在服务器端生成页面内容，然后将其发送到客户端。这有助于提高首次加载性能，并支持搜索引擎优化（`SEO`）。

- **静态生成（Static Generation）**：`Next.js` 支持静态生成，可以在构建时预渲染页面，生成静态 `HTML` 文件。这样可以实现更快的页面加载速度，并且可以部署到任何静态站点托管服务上。

- **热模块替换（Hot Module Replacement）**：通过使用 `Next.js` 的开发服务器，你可以在开发过程中实现热模块替换，即在不刷新整个页面的情况下，只更新修改的模块，加快开发效率。

- **自动代码拆分（Automatic Code Splitting）**：`Next.js` 会自动将应用程序的代码拆分成较小的块，这样只会加载当前页面所需的代码，提高页面加载性能。

- **路由系统**：`Next.js` 提供了一套简单易用的路由系统，可以根据页面文件结构自动配置路由，也支持自定义路由。

- **CSS 模块化和样式作用域**：`Next.js` 内置支持 `CSS` 模块化，你可以在组件级别上使用 `CSS` 模块和样式作用域，避免全局 `CSS` 的冲突问题。

- **快速刷新（Fast Refresh）**：`Next.js` 支持快速刷新功能，当修改代码时，只会重新加载相关模块，而不会重启整个开发服务器。

- **API 路由**：`Next.js` 提供了内置的 `API` 路由功能，可以创建后端 `API` 端点，与前端应用程序无缝集成。

### 部署
- 将 Next.js 项目输出为独立的 SSR 程序
  ```shell
  #next.config.js
  reactStrictMode: true,
  swcMinify: true,
  output:"standalone",
  #执行yarn build时，Next.js会将SSR服务器作为一个独立的程序输出到.next/standalone目录中，其中仅包含服务器所需的文件
  ```
- 启动 SSR 服务
  ```shell
  #在 .next/standalone 目录中打开终端，输入node server.js,默认会在3000端口启动
  PORT=8000 node server.js    # linux上指定端口启动
  ```
- Nginx 配置
  ```shell
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
  ```
