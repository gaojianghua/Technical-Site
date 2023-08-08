# 微前端(Micro-Frontends)


## 简介
微前端（Micro Frontends）是一种将前端应用程序分解为独立、可单独开发和部署的小型应用程序的架构模式。这种模式的目标是将微服务的理念应用到前端开发中，以解决大型、复杂的单体前端应用程序带来的问题。

微前端的主要优点包括：
1. **解耦**：每个微前端应用都可以由不同的团队独立开发和部署，这使得团队可以更加专注于自己的业务领域。
2. **技术栈无关**：每个微前端应用都可以选择最适合自己的技术栈，不受其他应用的影响。
3. **并行开发**：由于微前端应用之间的解耦，团队可以并行开发各自的应用，提高开发效率。
4. **独立部署**：每个微前端应用都可以独立部署，不需要重新部署整个前端应用。

然而，微前端也有一些挑战，例如如何组织和协调各个微前端应用，如何处理公共依赖和公共状态，如何保证用户体验的一致性等。

总的来说，微前端是一种新的架构模式，它可以帮助大型组织更有效地开发和管理复杂的前端应用程序。

### 微前端的特性
微前端的本质是降低大型复杂应用的开发、升级、维护和团队协作成本。假设在团队协作的过程中，各个团队使用了不同的技术栈进行应用开发，如果不进行应用拆分解耦，势必需要通过迁移和改造来兼容整个单体应用。

如果能实现应用拆分，就可以使得各个团队的应用保持独立自治，不会互相依赖彼此，也不需要在单体应用中进行技术栈的迁移和改造，极大的减少各个团队的开发、升级和维护成本。

为了使整个单体应用可以根据不同的业务进行解耦，微前端会将单个应用拆分成多个聚合在一起的小型应用，这些应用具备独立开发、独立部署和独立运行的特性。

在聚合的过程中需要一个容器应用（在微前端里称作主应用），主应用通过设计导航将各个拆分的小型应用（在微前端里称作微应用）聚合在一起，可以根据导航进行微应用的切换。具体如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1721605104.png)

主应用的导航可以是前端框架（React 或 Vue 框架）的路由，也可以是后端服务路由，还可以是前端自己设计的切换逻辑：
- 如果主应用是 **SPA** 应用，此时导航是路由跳转，根据前端路由进行微应用切换；
- 如果主应用是 **MPA** 应用，此时导航是链接跳转，根据后端路由进行微应用切换；
- **SPA** 和 **MPA** 应用都可以通过其他方式来切换微应用，例如动态切换微应用的 `Script`
- 除此之外，复杂的业务场景还可以是上述几种方案的结合体

拆分的微应用需要具备**独立开发、独立部署和独立运行的特性**：
- 微应用可以采用不同的技术栈，支持**独立开发**；
- 微应用可以单独部署到不同的服务器上，支持**独立部署**；
- 微应用的运行可以不依赖其他微应用，支持**独立运行**。

### 微前端的方案
在了解了微前端能解决哪些业务场景以及特性之后，我们可以根据项目的实际情况出发，选择合适的微前端方案。在实际开发项目的过程中，如果项目本身采用 **SPA** 模式进行开发，则可以通过以下方案进行微前端改造：
- **基于 NPM 包的微前端**：将微应用打包成独立的 `NPM` 包，然后在主应用中安装和使用；
- **基于代码分割的微前端**：在主应用中使用懒加载技术，在运行时动态加载不同的微应用；
- **基于 Web Components 的微前端**：将微应用封装成自定义组件，在主应用中注册使用；
- **基于 Module Federation 的微前端**：借助 Webpack 5 的 `Module Federation` 实现微前端；
- **基于动态 Script 的微前端**：在主应用中动态切换微应用的 `Script` 脚本来实现微前端；
- **基于 iframe 的微前端**：在主应用中使用 `iframe` 标签来加载不同的微应用；
- **基于框架（JavaScript SDK）的微前端**：使用 `single-spa`、`qiankun`、`wujie` 等通用框架。

如果项目是在 **MPA** 的模式下，则前端应用可以天然做到小型应用的拆分，各自部署在相应的服务下，在主应用中通过服务端的路由来请求和渲染不同的微应用。当然服务端的设计方案非常多，如何实现微应用之间的通信和数据共享是需要考虑的一个重要问题。
> 温馨提示：`MPA` 模式下后端的技术栈方案非常多，可以是单个服务框架，可以是多个不同的服务框架，还可以是微服务框架。不同路由的 `HTTP` 请求将被分发到对应的服务上，这些服务可能是 `Nginx` 反向代理后的服务、`Nginx` 部署的静态资源服务、`CDN` 服务以及对象存储服务等。

采用 **MPA** 的模式设计微前端可以使前后端采用不同的技术框架来实现，从而解决更加宽泛的团队协作问题。同时这种方式对于整体框架的设计更加灵活多变，可以很好解决不同技术栈之间因为差异大而难以进行迁移和兼容的问题，是微前端架构中采用最多且也是最容易实现的方案。需要注意目前社区常见的微前端框架基本上都是倾向于使用 **SPA** 模式进行开发，主要解决的是前端应用自身的解耦问题，这个解耦的过程本身可能不涉及服务端的任何更改。

## iframe 方案
iframe 是常用的微前端设计方案之一，它已经是非常成熟的一种技术手段。下面讲解它背后的浏览器知识，从而帮助大家更好地理解 `iframe` 和后续的微前端知识。
- 浏览器多进程架构：了解浏览器多进程架构设计；
- 浏览器沙箱隔离：了解浏览器的沙箱隔离设计；
- 浏览器站点隔离：了解浏览器中 `iframe` 的沙箱隔离策略；
- `iframe` 设计方案：基于浏览器知识，讲解 `iframe` 设计方案的优缺点；

### 浏览器多进程架构
浏览器是一个多进程（`Multi Process`）的设计架构，通常在打开浏览器标签页访问 `Web` 应用时，多个浏览器标签页之间互相不会受到彼此的影响，例如某个标签页所在的应用崩溃，其他的标签页应用仍然可以正常运行，这和浏览器的多进程架构息息有关。

以 `Chrome` 浏览器为例，在运行时会常驻 `Browser` 主进程，而打开新标签页时会动态创建对应的 `Renderer` 进程，两者的关系如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/875451223.png)

- **Browser 主进程**：主要负责处理网络资源请求、用户的`输入输出 UI 事件`、`地址栏 URL 管理`、`书签管理`、`回退与前进按钮`、`文件访问`、`Cookie 数据存储`等。`Browser` 进程是一个常驻的主进程，它也被称为代理进程，会派生进程并监督它们的活动情况。除此之外，`Browser` 进程会对派生的进程进行沙箱隔离，具备沙箱策略引擎服务。`Browser` 进程通过内部的 I/O 线程与其他进程通信，通信的方式是 [IPC](https://www.chromium.org/developers/design-documents/inter-process-communication/) & [Mojo](https://chromium.googlesource.com/chromium/src/+/HEAD/mojo/README.md)。
- **Renderer 进程**：主要负责标签页和 `iframe` 所在 `Web` 应用的 **UI 渲染**和 **JavaScript 执行**。`Renderer` 进程由 `Browser` 主进程派生，每次手动新开标签页时，`Browser` 进程会创建一个新的 `Renderer` 进程。
> 温馨提示：新开的标签页和 `Renderer` 进程并不一定是 **1: 1 的关系**，例如，多个新开的空白标签页为了节省资源，有可能被合并成一个 `Renderer` 进程。

上图只是一个简单的多进程架构示意，事实上 Chrome 浏览器包括 **Browser 进程**、**网络进程**、**数据存储进程**、**插件进程**、**Renderer 进程**和 **GPU 进程**等。除此之外，Chrome 浏览器会根据当前设备的性能和存储空间来动态设置部分进程是否启用，例如低配 Android 手机的设备资源相对紧张时，部分进程（**存储进程**、**网络进程**、**设备进程**等）会被合并到 `Browser` 主进程，完整的多进程架构如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/399538227.png)

### 浏览器沙箱隔离
由于 Web 应用运行在 `Renderer` 进程中，浏览器为了提升安全性，需要通过常驻的 `Browser` 主进程对 `Renderer` 进程进行沙箱隔离设计，从而实现 Web 应用进行**隔离和管控**，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/282191177.png)

> 温馨提示：从 Chrome 浏览器开发商的角度出发，需要将非浏览器自身开发的 Web 应用设定为三方不可信应用，防止 Web 页面可以通过 Chrome 浏览器进入用户的操作系统执行危险操作。

Chrome 浏览器在进行沙箱设计时，会尽可能的复用现有操作系统的沙箱技术，例如以 `Windows` 操作系统的沙箱架构为例，**所有的沙箱都会在进程粒度进行控制**，所有的进程都通过 `IPC` 进行通信。在 `Windows` 沙箱的架构中，存在一个 `Broker` 进程和多个 `Target` 进程， `Broker` 进程主要用于派生 `Target` 进程、管理 `Target` 进程的沙箱策略、代理 `Target` 进程执行策略允许的操作，而所有的 `Target` 进程会在运行时受到沙箱策略的管控：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3539000847.png)

在 Chrome 浏览器的多进程架构中，`Browser` 进程对应 `Broker` 进程，可以理解为浏览器沙箱策略的总控制器， `Renderer` 进程对应沙箱化的 `Target` 进程，它主要运行不受信任的三方 Web 应用，因此，在 `Renderer` 进程中的一些系统操作需要经过 `IPC` 通知 `Browser` 进程进行代理操作，例如网络访问、文件访问（磁盘）、用户输入输出的访问（设备）等。

### 浏览器站点隔离
在 Chrome 浏览器中沙箱隔离以 Renderer 进程为单位，而在旧版的浏览器中会存在多个 Web 应用共享同一个 Renderer 进程的情况，此时浏览器会依靠[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)来限制两个不同源的文档进行交互，帮助隔离恶意文档来减少安全风险。

Chrome 浏览器未启动站点隔离之前，标签页应用和内部的 iframe 应用会处于同一个 Renderer 进程，Web 应用有可能发现安全漏洞并绕过[同源策略](https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy)的限制，访问同一个进程中的其他 Web 应用，因此可能产生如下安全风险：
- 获取跨站点 Web 应用的 `Cookie` 和 `HTML 5` 存储数据；
- 获取跨站点 Web 应用的 `HTML`、`XML` 和 `JSON` 数据；
- 获取浏览器保存的密码数据；
- 共享跨站点 Web 应用的授权权限，例如地理位置；
- 绕过 [X-Frame-Options](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/X-Frame-Options) 加载 iframe 应用（例如百度的页面被 iframe 嵌套）；
- 获取跨站点 Web 应用的 `DOM` 元素。

在 **Chrome 67** 版本之后，为了防御多个**跨站的 Web 应用**处于同一个 `Renderer` 进程而可能产生的安全风险，浏览器会给来自不同站点的 Web 应用分配不同的 `Renderer` 进程。例如当前标签页应用中包含了多个不同站点的 `iframe` 应用，那么浏览器会为各自分配不同的 `Renderer` 进程，从而可以基于沙箱策略进行应用的进程隔离，确保攻击者难以绕过安全漏洞直接访问跨站 Web 应用：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2788624398.png)

> 温馨提示：Chrome 为标签页分配 Renderer 进程的策略和 iframe 中的站点隔离策略是有差异的，例如用户自己新开标签页时，不管是否已经存在同站的应用都会创建新的 Renderer 进程。用户通过window.open 跳转新标签页时，浏览器会判断当前应用和跳转后的应用是否属于同一个站点，如果属于同一个站点则会复用当前应用所在的 Renderer 进程。

需要注意**跨站**和**跨域**是有区别的，使用跨站而不是跨域来独立 `Renderer` 进程是为了兼容现有浏览器的能力，例如同站应用通过修改 `document.domain` 进行通信，如果采用域名隔离，那么会导致处于不同 `Renderer` 进程的应用无法实现上述能力。这里额外了解一下**同源**和**同站**的区别，如下所示：
- **同源**：协议（protocol）、主机名（host）和端口（port）相同，则为同源；
- **同站**：有效顶级域名（Effective Top-Level-Domain，eTLD）和二级域名相同，则为同站。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2961889347.png)

从上图可以看出，`eTLD + 1` 代表有效顶级域名 + 二级域名。需要注意，有效顶级域名和顶级域名是不一样的概念，例如 `github.io` 是一个有效顶级域名，如果将 `.io` 视为有效顶级域名，那么 `https://ziyi2.github.io` 和 `https://xxholly32.github.io` 将被浏览器视为同站，但显然它们是两个不同的开发者创建的博客站点。有效顶级域名有一个维护列表，具体可以查看 [public_suffix_list](https://publicsuffix.org/list/public_suffix_list.dat)。举个例子：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3875149059.png)

关于站点隔离可以通过启动 Node 并聚合 iframe 应用进行验证，目录结构如下：
~~~
├── views    
│   └── iframe.html                        
│   └── main.html         
├── main-server.js           # main 应用服务
├── micro-server.js          # iframe 应用服务
├── config.js                # 端口，host 等配置
└── package.json    
~~~
启动 Node 服务渲染 `main` 和 内部的 `iframe` 应用：
~~~ts
// main-server.js
import path from 'path';
// https://github.com/expressjs/express
import express from 'express';
// ejs 中文网站: https://ejs.bootcss.com/#promo
// ejs express 示例: https://github.com/expressjs/express/blob/master/examples/ejs/index.js
import ejs from "ejs";
import config from './config.js';
const { port, host, __dirname } = config;

const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

// 浏览器访问 http://${host}:${port.main}/ 时会渲染 views/main.html 
app.get("/", function (req, res) {
  // 使用 ejs 模版引擎填充主应用 views/main.html 中的 iframeUrl 变量，并将其渲染到浏览器
  res.render("main", {
    // 填充 iframe 应用的地址，只有端口不同，iframe 应用和 main 应用跨域但是同站
    iframeUrl: `http://${host}:${port.micro}`
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
~~~ts
// micro-server.js
import path from 'path';
import express from 'express';
import ejs from "ejs";
import config from './config.js';
const { port, host, __dirname } = config;

const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  res.render("iframe");
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
~~~ts
// config.js
// https://github.com/indutny/node-ip
import ip from 'ip';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  port: {
    main: 4000,
    micro: 3000,
  },

  // 获取本机的 IP 地址
  host: ip.address(),

  __dirname
};
~~~
~~~json
// package.json
{
  "name": "micro-framework",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "main-start": "node main-server.js",
    "micro-start": "node micro-server.js"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ziyi2/micro-framework.git"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ziyi2/micro-framework/issues"
  },
  "homepage": "https://github.com/ziyi2/micro-framework#readme",
  "dependencies": {
    "ejs": "^3.1.8",
    "express": "^4.18.2",
    "ip": "^1.1.8"
  },
  "engines": {
    "node": ">16"
  },
  "engineStrict": true
}
~~~
在 `main` 对应的 HTML 中使用 iframe 聚合同站应用：
~~~html
<!-- main.html -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>站点隔离测试</title>
</head>
<body>
    <h1>main 应用</h1>
    <button onclick="javascript:window.open('<%= iframeUrl %>')">在新的标签页打开 iframe 应用</button>
    <br>
    <!-- 同站应用：iframe.html -->
    <iframe src="<%= iframeUrl %>"></iframe>
    <!-- 跨站应用: https://juejin.cn/ -->
    <iframe src="https://juejin.cn"></iframe>
</body>
</html>
~~~
~~~html
<!-- iframe.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>同站的 iframe 应用</title>
  </head>
  <body>
    <h1>同站的 iframe 应用</h1>
  </body>
</html>
~~~
使用 `npm run main-start` 和 `npm run micro-start` 同时启动 `main` 和 `iframe` 应用的服务后，在浏览器中打开 `main` 应用，通过任务管理器查看各自的进程，可以发现**跨站的掘金应用启动了一个新的进程**：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/808265136.png)

为了查看同站 `iframe` 所在应用的进程，可以点击按钮使用 `window.open` 跳转新的标签页，此时可以发现 `iframe` 应用和 `main` 应用处于同一个 `Renderer` 进程中：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2626828282.png)

浏览器的站点隔离功能是可以关闭的，通过 `chrome://flags` 进入，禁用站点隔离后，可以发现主应用和两个 `iframe` 应用处于同一个 `Renderer` 进程。

### 浏览上下文
每一个 `iframe` 都有自己的[浏览上下文](https://www.w3.org/html/wg/spec/browsers.html#browsing-context)，不同的浏览上下文包含了各自的 `Document` 对象以及 `History` 对象，通常情况下 `Document` 对象和 `Window` 对象存在 1:1 的映射关系，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3196492168.png)

在上述示例中，如果主应用是在空白的标签页打开，那么主应用是一个顶级浏览上下文，顶级浏览器上下文既不是嵌套的浏览上下文，自身也没有父浏览上下文，通过访问 `window.top` 可以获取当前浏览上下文的顶级浏览上下文 `window` 对象，通过访问 `window.parent` 可以获取父浏览上下文的 `window` 对象。

例如想要知道当前应用是否在 `iframe` 中打开，可以简单通过如下代码进行判断：
~~~ts
// 如果自己嵌自己会发生什么情况呢？
// 是否可以使用 if(window.parent !== widnow) {} 代替
if(window.top !== window) {}
~~~
>温馨提示：如果希望判断微应用是否被其他应用进行嵌入，也可以使用 [location.ancestorOrigins](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/ancestorOrigins) 来进行判断。

### iframe 设计方案
在微前端中 `iframe` 方案需要一个主应用，包含导航和内容区的设计，通过切换导航来控制内容区微应用 `A` / `B` / `C` 的加载和卸载，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/132893357.png)

在之前我们说过导航切换的设计方案可以是前端框架路由、服务端路由和自己设计的切换逻辑，在 `iframe` 的方案中，导航设计可以是前端框架路由来控制不同微应用所在 `iframe` 的显示和隐藏，也可以通过自己设计切换逻辑来动态加载 `iframe`。

不论使用哪一种切换方式，在首次加载 `iframe` 应用时，都会因为服务端请求而导致内容区带来短暂的**白屏效果**。当然，相比普通 MPA 应用，通过服务端路由的方式来处理，最大的好处是每次切换微应用都不需要刷新主应用。除此之外，`iframe` 应用的特点主要包括：
- 站点隔离和浏览上下文隔离，可以使微应用在运行时天然隔离，适合集成三方应用；
- 移植性和复用性好，可以便捷地嵌在不同的主应用中。

当然在使用 `iframe` 应用时，会产生如下一些问题：
- 主应用刷新时， `iframe` 无法保持 `URL` 状态（会重新加载 `src` 对应的初始 `URL`）；
- 主应用和 `iframe` 处于不同的浏览上下文，无法使 `iframe` 中的模态框相对于主应用居中；
- 主应用和 `iframe` 微应用的数据状态同步问题：持久化数据和通信。
> 温馨提示：对于非后台管理系统而言，使用 `iframe` 还需要考虑 `SEO`、`移动端兼容性`、`加载性能`等问题。

海康威视安防的管理后台系统采用了 `iframe` 作为微前端解决方案，很好利用了 iframe 的优点，从而实现了不同定制产品的组装功能。当然在 `iframe` 的设计方案中，首要解决的是主应用和微应用的免登问题，该问题可以通过主应用和微应用共享 `Cookie` 进行处理，在后面会讲解在 `iframe` 中的 `Cookie` 携带情况。

## NPM 方案
NPM 包是微前端设计方案之一，在设计时需要将微应用打包成独立的 NPM 包，然后在主应用中引入和使用。下面会从基本的模块化和构建工具开始讲解，从而帮助大家更好理解 NPM 包的微前端设计方案。
- **模块化**：了解什么是模块化、为什么需要模块化；
- **构建工具**：了解为什么需要构建工具；
- **NPM 设计方案**：了解 NPM 设计方案的特性；
- **NPM 设计示例**：`React` 和 `Vue` 微应用的 NPM 聚合示例。

### 模块化
早期的 Web 前端开发相对简单，开发者可以将所有的代码全部写在一个 `JavaScript` 文件中，也可以将代码拆分成多个 `JavaScript` 文件进行加载，如下所示：
~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <script src="a.js"></script>
    <script src="b.js"></script>
    <script src="c.js"></script>
    <script src="d.js"></script>
  </body>
</html>
~~~
如果需要依赖三方库，则需要将三方库的代码按顺序进行加载，例如加载 [loadash](https://www.lodashjs.com/) ：
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <script>
      // 未加载 lodash 时，无法获取 _ 变量
      // Uncaught ReferenceError: _ is not defined
      console.log(_); 
    </script>
  
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    
    <script>
      // 加载 lodash 之后，可以获取 _ 变量
      // ƒ Mc(n,t,r){var e=null==n?X:_e(n,t);return e===X?r:e}
      console.log(_.get); 
    </script>
</body>
</html>
~~~
除此之外，多个文件一起加载还需要考虑变量名的冲突情况，如下所示：
~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      const _ = 111;
    </script>
    
    <script>
      console.log(_); // 111
    </script>
    
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    
    <script>
      console.log(_); // 111
      console.log(_.get); // undefined
    </script>
  </body>
</html>
~~~
>温馨提示：当声明全局变量 `_` 之后，lodash 库判断如果 `_` 存在则不做任何处理（防冲撞），防止后续的代码需要使用开发者自己声明的 `_` 时出现问题。

如果项目越来越复杂，下述使用方式很容易造成意想不到的问题，类似全局属性冲突的情况也很难进行问题排查：
~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script src="https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.min.js"></script>
    
    <script>
      // 覆盖三方库的全局变量
      const _ = 111;
    </script>
    
    <script>
      // 这里希望使用 lodash 的 get 方法，但是 _ 被用户覆盖
      // undefined
      console.log(_.get); 
    </script>
  </body>
</html>
~~~
为了解决上述问题，`JavaScript` 开始提供一种将程序拆分为可按需导入的单独模块，例如 `Node.js` 的 `CommonJS` 和 `ES Modules`。这里以 `ES Modules` 为例：
~~~
├── public                 # 托管的静态资源目录
│   ├── custom_modules/    # 自定义模块
│   │   ├── add.js                         
│   │   └── conflict.js                                        
│   ├── node_modules/      # 三方模块
│   │   └── lodash-es/        
│   └── index.html         # 应用页面
└── app.js                 # 应用服务
~~~
浏览器中的 `JavaScript` 由于受到了沙箱限制无法直接访问本地的文件（例如 `file://` 路径文件），因此在浏览器中使用模块化进行开发，无法像 `Node` 应用那样直接在 `JavaScript` 中通过 `require` 加载模块，只能通过 `HTTP` 请求的形式获取，因此在上述示例中，需要使用 `Node.js` 设计 `app.js` 启动 Web 服务：
~~~ts
// app.js
import ip from 'ip';
import express from 'express';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const host = ip.address();
console.log("host: ", host);

// 所有托管的静态资源都放在 public 目录下
app.use(express.static(__dirname + "/public"));

// 启动 Node 服务
app.listen(4444, host);
console.log(`server start at http://${host}:4444/`);
~~~
安装依赖并启动 Web 服务，如下所示：
~~~shell
# 安装依赖
npm i
# 进入 public 目录
cd public
# 安装浏览器 HTTP 请求需要的 public/node_modules 模块
npm i
# 回退到根目录
cd ..
# 启动服务
npm start
~~~
`public` 目录下的静态资源都可以被 `HTTP` 请求访问，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/288693298.png)

`public/node_modules` 目录是 `NPM` 安装三方模块后自动生成的模块目录，其中的 `lodash-es` 是一个符合 `ES Modules` 规范的工具库。`public/custom_modules` 目录是开发者自定义的 `ES Modules` 目录，其中的 `add.js` 和 `conflict.js` 设计很简单，如下所示：
~~~ts
// add.js
export function add(a, b) {
  return a + b;
}

// conflict.js
const _ = 111;
~~~
`public` 目录下的 `index.html` 是在浏览器中启动的 `HTML` 页面，如下所示：
~~~html
<!-- index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <!-- import-maps 主要用于映射 HTTP 请求路径别名，类似于 Webpack 中的 alias 和 TypeScript 中的 paths 配置 -->
    <!-- import-maps:  https://github.com/WICG/import-maps -->
    <script type="importmap">
      {
        "imports": {
          "custom_modules/": "/custom_modules/",
          "lodash/": "/node_modules/lodash-es/"
        }
      }
    </script>

    <script type="module">
      // 自定义模块 - add 函数
      import { add } from "custom_modules/add.js";
      // 自定义模块 - 防冲撞测试
      import "custom_modules/conflict.js";
      // 三方模块 - 按需引入
      import isNull from "lodash/isNull.js";

      console.log(isNull);
      console.log(add(1, 2));

      // 在 confilict.js 中声明的 const _ = 111; 不会作用在当前脚本中
      // Uncaught ReferenceError: _ is not defined
      console.log(_);
    </script>
  </body>
</html>
~~~
> 温馨提示：`import-maps` 存在[浏览器兼容性](https://caniuse.com/?search=import%20maps)问题，可以找相应的 [polyfill](https://github.com/guybedford/es-module-shims) 进行兼容性处理。
在脚本中引入的 `custom_module` 目录下的 `add.js`、`conflict.js` 以及 `node_modules` 目录下的三方模块 `lodash`，都会通过 `HTTP` 请求的方式进行加载，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/4113031072.png)


















































