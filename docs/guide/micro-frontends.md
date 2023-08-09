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

在模块化的示例中可以发现，设计 `JavaScript` 时只需要通过 `import` 的方式进行按需加载，例如需要依赖 `add.js`，则只需要通过 `import` 的方式加载 `add.js`，而且不需要考虑加载顺序的问题。

除此之外，在 `conflict.js` 中声明的 `_` 变量只能在当前模块范围内生效，不会影响到全局作用域，而 `lodash` 也可以通过模块化的方式进行按需加载，从而可以避免在全局 `window` 对象挂载 `_` 所需要考虑的防冲撞问题。

通过模块化的方式引入 `lodash` 的 `isNull` 函数，还可以天然实现三方库的按需引入，从而减少 `HTTP` 的请求体积。因此，在浏览器中使用 `ES Modules`:
- 不需要构建工具进行打包处理；
- 天然按需引入，并且不需要考虑模块的加载顺序；
- 模块化作用域，不需要考虑变量名冲突问题。

### 构建工具
应用的开发态可以直接在浏览器中使用 `ES Modules` 规范，但是生产态需要生成浏览器兼容性更好的 `ES5` 脚本，为此需要通过构建工具将多个 `ES Modules` 打包成兼容浏览器的 `ES5` 脚本。如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1595301275.png)

>温馨提示：`Webpack` 可以对 `ES Modules` 和 `CommonJS` 进行模块化组装，是一种常用的打包工具。除此之外， `Webpack` 可以借助 `Babel` 转译工具实现代码的 **ES6+** 到 **ES5** 的转译工作，最终可以打包出兼容浏览器的代码。

当然，除了应用开发需要使用构建工具，在业务组件的开发中也需要使用构建工具，需要注意的是两者的构建是有差异的，**应用的构建需要生成 HTML 文件并打包 JS、CSS 以及图片等静态资源，业务组件的构建更多的是打包成应用需要通过模块化方式引入使用的 [JavaScript 库](https://webpack.docschina.org/guides/author-libraries/)。**

业务组件的设计是一种通用的库包建设，当开发完一个版本之后，通常会发布成 NPM 包。**应用在构建时为了提升构建速度，同时也为了简化构建配置，通常在使用 [babel-loader](https://github.com/babel/babel-loader#babel-loader-is-slow) （转译工具）进行转译时 ， 会屏蔽 node_modules 目录下的 NPM 包**，因此需要将发布的 NPM 组件转译成大多数浏览器能够兼容的 ES5 标准，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/446798271.png)

>温馨提示：从 [JavaScript 标准版本的兼容性](https://kangax.github.io/compat-table/es6/) 可以发现，想要兼容大部分浏览器，需要将 ES6 或更高标准的 ECMAScript 转换成 [ES5 标准](https://caniuse.com/?search=ES5)，而如果要支持 IE9 及以下版本的浏览器，还需要使用 [polyfill](https://en.wikipedia.org/wiki/Polyfill_(programming)) (例如 [core-js](https://github.com/zloirock/core-js)) 来扩展浏览器中缺失的 API（例如 ES3 标准中缺失 `Array.prototype.forEach`）。如果对上图中的 ECMAScript 标准不了解，可以自行搜索和查看 ES2015 ~ ES2022（ES6 ~ ES13）、ESNext 等。

不同应用的开发态环境可能不同，例如应用 `A` 采用 `ES6 & TypeScript` 进行开发，而应用 `B` 则采用 `ES13` 进行开发，两个应用最终都需要通过构建工具生成浏览器能够兼容的 `ES5` 标准。

假设业务组件的开发环境使用 `ES13 & TypeScript` ，如果不进行组件本身的 `ES5` 标准构建，而是直接在应用中引入源码使用，那么应用 `A` 和应用 `B` 各自需要额外考虑组件的构建配置项，例如需要使应用 `A` 支持更高的 `ES13` 标准，需要使应用 `B` 支持 `TypeScript`，才能将加载的组件对应的源码在应用层面构建成 `ES5` 标准。如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2205909131.png)

>温馨提示：注意直接输出 `ES13` 源代码和 NPM 发布的 `ES Modules` 模块有一定的差异，前者所有的代码都是 `ES13` 标准，后者只是导入导出的 `import` 和 `export` 符合 `ES Modules` 规范，其余的语法仍然是浏览器或 `Node.js` 能够兼容的 `ES5` 标准。这样前者一定需要在应用层被转译成 `ES5` 标准，而后者只是模块化标准需要被转译和打包处理，而内部代码不需要编译，具体可以查看 `pkg.module`。除此之外，这里需要额外了解发布 `ES Modules` 模块的好处是什么。

从上图可以看出，为了使应用层面不用关心业务组件设计的开发态环境，建议将业务组件的源代码构建成 `ES5` 标准，这样应用 `A` 和应用 `B` 就不需要考虑组件设计的开发态环境所带来的构建配置问题，只需要关注应用自身的开发态构建配置即可。

### NPM 设计方案
NPM 的微前端设计方案如下所示，微应用 `A` / `B` / `C` 可以采用不同的技术栈，但是构建时需要像发布业务组件一样输出 `ES5 & 模块化标准的 JavaScript 库`（尽管开发的是应用，但是构建的不是应用程序，不需要额外生成 `HTML`），从而使主应用安装各自的依赖时，可以通过模块化的方式引入微应用。主应用不需要关心微应用的技术栈，不需要关心微应用的构建配置项：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/356953142.png)

业务组件的开发往往是和框架息息相关，组件发布以后的应用环境通常和组件使用同一个框架，例如 `React` 组件发布以后会被 `React` 技术栈的项目进行使用，此时业务组件发布时不需要构建 `React` 框架代码，只需要通过 [peerDependencies](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#peerdependencies) 来指定兼容的 `React` 版本。

而微应用 `A` / `B` / `C` 理论上不会依赖主应用的技术栈，主应用可以是 `React`、`Vue`、`Angular` 甚至是 `jQuery` 技术栈，因此大部分情况下需要将框架代码完全构建到 NPM 包中，当然如果知晓主应用的技术框架并且可以兼容，那么也可以像业务组件那样构建时排除框架代码，从而依赖主应用的框架运行。

了解了 `NPM` 设计方案的原理之后，会发现它的**特点**如下：
- 微应用可以使用不同的技术栈进行开发；
- 微应用不需要进行静态资源托管，只需要发布到 NPM 仓库即可；
- 移植性和复用性好，可以便捷地嵌在不同的主应用中；
- 微应用和主应用共享浏览器的 `Renderer` 进程、浏览上下文和内存数据。
- 使用该方案需要关注以下一些注意事项：

如何处理主应用和各个微应用的`全局变量`、`CSS 样式`和`存储数据`的冲突问题；
- 微应用的构建需要做额外的配置，构建的不是应用程序而是 `JavaScript` 库；
- 由于微应用构建的是库包，因此不需要代码分割和静态资源分离（例如图片资源、`CSS` 资源需要内联在 `JS` 中）；
- 微应用发布后，主应用需要重新安装依赖并重新构建部署。

从上述特性可以发现，`NPM` 设计仅仅适合集成一些小型微应用，如果微应用的资源过大，势必要对微应用的构建进行资源优化处理，例如多入口应用的三方库去重、弱网环境下 `chunk 大小分离控制`、`懒加载`、`预加载`等。

除此之外，主应用集成的微应用过多，也会导致构建多份重复的框架带来构建体积过大的问题，还需要考虑主子应用的共用框架抽离问题。

### NPM 的设计示例
设计示例采用 [Monorepo](https://monorepo.tools/#understanding-monorepos) 结构，项目的目录结构如下所示：
~~~
├── packages                                                                                                 
│   ├── main-app/      # 主应用                
│   ├── react-app/     # React 微应用
│   └── vue-app/       # Vue 微应用
└── lerna.json         # Lerna 配置
~~~
在主应用中通过路由的方式切换微应用，代码如下所示：
~~~tsx
// main-app/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactApp from "./React";
import VueApp from "./Vue";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "react",
        element: <ReactApp />,
      },
      {
        path: "vue",
        element: <VueApp />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
~~~
~~~tsx
// main-app/React.js
// React 微应用
const { mount, unmount } = require("react-micro-app");
import React, { useEffect } from "react";

const containerId = 'react-app';

function ReactApp() {
  useEffect(() => {
    mount(containerId);
    return () => {
      unmount();
    };
  }, []);
  return <div id={containerId}></div>;
}

export default React.memo(ReactApp);
~~~
~~~tsx
// main-app/Vue.js
// Vue 微应用
import React, { useEffect } from "react";
const { mount, unmount } = require('vue-micro-app')

const containerId = 'vue-app';

function VueApp() {
  useEffect(() => {
    mount(containerId);
    return () => {
      unmount();
    };
  }, []);
  return <div id={containerId} style={{ textAlign: "center" }}></div>;
}

export default VueApp;
~~~
~~~json
// package.json
{
  "name": "root",
  "private": true,
  "workspaces": [
    "packages/*"
  ],
  "scripts": {
    "bootstrap": "lerna bootstrap"
  },
  "devDependencies": {
    "lerna": "^6.3.0"
  },
  "dependencies": {
    "react-router-dom": "^6.6.1"
  },
  "engines": {
    "node": ">16"
  },
  "engineStrict": true
}
~~~
进入 `main-app` 后执行 `npm start` 启动主应用，可以根据左侧导航切换 `React` 和 `Vue` 微应用，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3726492730.png)

微应用需要发布成模块规范的 `NPM` 包，这里为了方便，采用了 `Lerna` 工具进行 `NPM` 包之间的软 `Link` 操作，主要的思路是将入口文件构建成 ES5 标准的 `CommonJS` 规范（在 `Webpack` 中除了可以构建 `CommonJS` 规范，也可以构建 `UMD` 和 `ES Modules` 规范，具体可以查看 `output.library.type` 配置项），通过主应用的引入方式可以发现示例中输出了 `CommonJS` 规范。

> 温馨提示：在 Lerna 中执行 `lerna bootstrap`，可以让本地的 NPM 包之间快速形成软链接，从而不需要发布 NPM 仓库，当然如果不使用 Lerna 工具，也可以手动通过 `npm link` 进行处理。

除此之外，如果不想额外引入微应用的 `CSS` 样式，那么可以将样式内联到 `JS` 中，当然其它的一些静态资源也需要内联到 `JS` 中，通过 `Webpack` 可以进行很好的处理。在 `Vue` 微应用中采用 `Vue CLI` 快速生成了 `Vue 3.x` 项目，只需要简单做如下改动即可：

~~~json
// package.json
{
  // NPM 包名
  "name": "vue-micro-app",
  // NPM 包默认的入口文件
  "main": "dist/vue-app.common.js",
    
  "scripts": {
    // Vue CLI 构建目标：https://cli.vuejs.org/zh/guide/build-targets.html
    // target 设置为 lib，可以输出 commonjs 和 umd 模块文件
    // --inline-vue 可以将 Vue 框架代码构建到模块文件中
    // src/main.js 为构建的入口文件
    "build": "vue-cli-service build --target lib --name vue-app --inline-vue src/main.js",
  }
}
~~~
~~~ts
// vue.config.js
const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // 内联 CSS 样式处理
  css: { extract: false }
});
~~~
~~~ts
// src/main.js 
// 对外提供 mount 和 unmount 接口，用于加载和卸载 vue 微应用
import { createApp } from "vue";
import App from "./App.vue";
let app;

export function mount(containerId) {
  console.log("vue app mount");
  app = createApp(App);
  app.mount(`#${containerId}`);
}

export function unmount() {
  console.log("vue app unmount: ", app);
  app && app.unmount();
}
~~~
执行 `npm run build` 构建之后，默认会生成如下文件，此时可以通过 `require('vue-micro-app')` 引入 `dist/vue-app.common.js` 中的 `mount` 和 `unmount` 方法：
~~~
DONE  Compiled successfully in 3021ms                                                                     21:09:03

File                       Size                                      Gzipped

dist/vue-app.umd.min.js    85.44 KiB                                 35.97 KiB
dist/vue-app.umd.js        424.09 KiB                                111.78 KiB
dist/vue-app.common.js     423.69 KiB                                111.65 KiB

Images and other types of assets omitted.
Build at: 2023-01-05T13:09:03.077Z - Hash: 1af212ed2f5ac61f4283f8246edc6311fdcda0a55a38a10c - Time: NaNms
~~~
`React` 微应用采用 [Create React App](https://create-react-app.dev/docs/getting-started) 快速生成项目，由于需要构建成类似于库包的模块化规范，需要更改 `Webpack` 的配置，这里采用 `npm run eject` 的方式暴露 `Webpack` 配置，需要做如下简单的改动：
~~~json
// package.json
{
  "name": "react-micro-app",
  "main": "build/main.js"
}
~~~
~~~ts
// config/webpack.config.js
module.exports = function(webpackEnv) {
  // ...

  // common function to get style loaders
  const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
      // 注释掉抽离 CSS 样式的插件功能
      // isEnvDevelopment && require.resolve("style-loader"),
      // isEnvProduction && {
      //   loader: MiniCssExtractPlugin.loader,
      //   // css is located in `static/css`, use '../../' to locate index.html folder
      //   // in production `paths.publicUrlOrPath` can be a relative path
      //   options: paths.publicUrlOrPath.startsWith(".")
      //     ? { publicPath: "../../" }
      //     : {},
      // },
      
      require.resolve("style-loader"),
      {
        loader: require.resolve("css-loader"),
        options: cssOptions,
      },
      // ...
    ].filter(Boolean);
    // ...
    return loaders;
  };
  
  return {
    output: {
      // ...
      // 老版本 Webpack 可以使用 libraryTarget 生成 CommonJS 规范
      // libraryTarget: "commonjs",
      library: {
        type: 'commonjs'
      }
    },

    module: {
      rules: [
        {
          oneOf: [
            // TODO: Merge this config once `image/avif` is in the mime-db
            // https://github.com/jshttp/mime-db
            {
              test: [/.avif$/],
              mimetype: "image/avif",
              // 内联处理
              // https://webpack.js.org/guides/asset-modules/#inlining-assets
              type: 'asset/inline',
            },
            // "url" loader works like "file" loader except that it embeds assets
            // smaller than specified limit in bytes as data URLs to avoid requests.
            // A missing `test` is equivalent to a match.
            {
              test: [/.bmp$/, /.gif$/, /.jpe?g$/, /.png$/],
              // 内联处理
              type: 'asset/inline',
            },
            {
              test: /.svg$/,
              // 内联处理
              type: 'asset/inline',

              // 注释
              
              // use: [
              //   {
              //     loader: require.resolve("@svgr/webpack"),
              //     options: {
              //       prettier: false,
              //       svgo: false,
              //       svgoConfig: {
              //         plugins: [{ removeViewBox: false }],
              //       },
              //       titleProp: true,
              //       ref: true,
              //     },
              //   },
              //   {
              //     loader: require.resolve("file-loader"),
              //     options: {
              //        name: "static/media/[name].[hash].[ext]",
              //     },
              //   },
              // ],
              
              issuer: {
                and: [/.(ts|tsx|js|jsx|md|mdx)$/],
              },
            },
          ]
        }
      ].filter(Boolean),
    },

    plugins: [
      
      // ...
      
      // 构建单个 JS 脚本
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    ].filter(Boolean),
  }
}
~~~
~~~tsx
// src/index.js
// 对外提供 mount 和 unmount 接口，用于加载和卸载 react 微应用
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

let root;

export function mount(containerId) {
  console.log("react app mount");
  root = ReactDOM.createRoot(document.getElementById(containerId));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

export function unmount() {
  console.log("react app unmount: ", root);
  root && root.unmount();
}
~~~
>温馨提示：使用应用程序的 Webpack 配置进行库构建改造会相对麻烦，这里也可以直接使用一些成熟的业务组件脚手架做处理，仅需要将 React 框架的代码构建到输出目标中即可。

使用 `React` 脚手架制作 NPM 微应用的 `Webpack` 配置相对比较麻烦，本质思路是需要将所有的资源都构建成单个 JS 脚本的方式进行引入（不要抽离通用的 JS 文件，因为不是直接在浏览器中运行），此时执行构建会生成 `CommonJS` 规范的 `build/main.js` 目标文件：
~~~
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  50.28 kB  build/main.js
~~~
>温馨提示：通常在开发态时，为了使得主应用能够查看微应用 NPM 包的集成效果，在修改微应用后需要对微应用进行构建才能在主应用中查看微应用的修改效果。有没有方法可以做到主应用引入方式不变的情况下，在开发态引入的是微应用的源码（修改微应用的代码后不需要构建，直接在主应用中会热更新变更），而在生产态引入的是微应用构建后发布的 NPM 包，这种配置在单个业务组件的开发中尤为重要。

## 动态 Script 方案
在上一节中，我们通过封装 NPM 包的方式实现了微前端，该方案需要我们设计时导出 `mount` 和 `unmount` API，从而可以使主应用进行微应用的加载和卸载处理。NPM 包形式的微应用发布后，往往需要主应用升级相应 NPM 版本依赖并进行构建处理。如果想要主应用具备线上动态的微应用管理能力，最简单的方案是**动态加载 Script**，大致的示例如下所示：
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
    <!-- 主导航设计，这里可以根据后端数据动态渲染导航 -->
    <div id="nav">
      <button onclick="handleClick('x')">x 应用</button>
      <button onclick="handleClick('y')">y 应用</button>
    </div>
    <!-- 内容区设计 -->
    <div class="container">
      <!-- 微应用渲染的插槽 -->
      <div id="micro-app-slot"></div>
    </div>

    <!-- 微应用 x：提供 window.xMount 和 window.xUnmount 全局函数-->
    <script defer src="http://xxx/x.js"></script>
    <!-- 微应用 y：提供 window.yMount 和 window.yUnmount 全局函数-->
    <script defer src="http://yyy/y.js"></script>

    <script>
      function handleClick(type) {
        switch (type) {
          case "x":
            // 告诉微应用需要挂载在 #micro-app-slot 元素上
            window.xMount("#micro-app-slot");
            window.yUnmount();
          case "y":
            window.yMount("#micro-app-slot");
            window.xUnmount();
          default:
            break;
        }
      }
    </script>
  </body>
</html>
~~~
上述只是一个简单的示例，在真正的设计时可以将导航和需要加载的微应用进行动态化，这里给出一个相对完整的示例，大概实现的思路如下所示，主应用 `HTML` 渲染之后：
- 通过请求获取微应用列表数据，动态进行微应用的预获取和导航创建处理
- 根据导航进行微应用的切换，切换的过程会动态加载和执行 `JS` 和 `CSS` 资源
- 微应用需要提供 `mount` 和 `unmount` 全局函数，方便主应用进行加载和卸载处理

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3620211442.png)

>温馨提示：这里点击导航改变 `Hash` 来模拟 `Vue` 或者 `React` 框架中路由的切换。

两个按钮（微应用导航）根据后端数据动态渲染，点击按钮后会请求微应用的静态资源并解析相应的 `JS` 和 `CSS`，并渲染微应用的文本信息到插槽中。

>温馨提示：主应用中的文本样式会被切换的微应用样式污染，从一开始的红色变成绿色或蓝色。首次点击按钮加载微应用的静态资源时会命中 `prefetch cache`，从而缩短应用资源的加载时间（不会发送请求给服务端），再次点击按钮请求资源时会命中缓存，状态码是 304。关于缓存会在后续的性能优化课程中详细讲解。

文件的结构目录如下所示：
~~~
├── public                  # 托管的静态资源目录
│   ├── main/               # 主应用资源目录                        
│   │   └── index.html                                        
│   └── micro/              # 微应用资源目录
│        ├── micro1.css   
│        ├── micro1.js    
│        ├── micro2.css         
│        └── micro2.js      
├── config.js               # 公共配置
├── main-server.js          # 主应用服务
└── micro-server.js         # 微应用服务
~~~
主应用 HTML 的实现代码如下所示：
~~~html
<!-- public/main/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      h1 {
        color: red;
      }
    </style>
  </head>

  <body>
    <!-- 主应用的样式会被微应用覆盖 -->
    <h1>Hello，Dynamic Script!</h1>
    <!-- 主导航设计，这里可以根据后端数据动态渲染 -->
    <div id="nav"></div>
    <!-- 内容区设计 -->
    <div class="container">
      <!-- 微应用渲染的插槽 -->
      <div id="micro-app-slot"></div>
    </div>

    <!-- 微应用工具类 -->
    <script type="text/javascript">
      class UtilsManager {
        constructor() {}

        // API 接口管理
        getMicroApps() {
          return window
            .fetch("/microapps", {
              method: "post",
            })
            .then((res) => res.json())
            .catch((err) => {
              console.error(err);
            });
        }

        isSupportPrefetch() {
          const link = document.createElement("link");
          const relList = link?.relList;
          return relList && relList.supports && relList.supports("prefetch");
        }

        // 预请求资源，注意此种情况下不会执行 JS
         // 后续在性能优化的课程中还会讲解，暂时可以忽略
        prefetchStatic(href, as) {
          // prefetch 浏览器支持检测
          if (!this.isSupportPrefetch()) {
            return;
          }
          const $link = document.createElement("link");
          $link.rel = "prefetch";
          $link.as = as;
          $link.href = href;
          document.head.appendChild($link);
        }

        // 请求 & 执行 JS（这里封装的不是很通用，可以考虑更加通用的封装处理）
        loadScript({ script, id }) {
          return new Promise((resolve, reject) => {
            const $script = document.createElement("script");
            $script.src = script;
            $script.setAttribute("micro-script", id);
            $script.onload = resolve;
            $script.onerror = reject;
            document.body.appendChild($script);
          });
        }

        loadStyle({ style, id }) {
          return new Promise((resolve, reject) => {
            const $style = document.createElement("link");
            $style.href = style;
            $style.setAttribute("micro-style", id);
            $style.rel = "stylesheet";
            $style.onload = resolve;
            $style.onerror = reject;
            document.head.appendChild($style);
          });
        }

        // 为什么需要删除 CSS 样式？不删除会有什么后果吗？
        // 为什么没有删除 JS 文件的逻辑呢？
        removeStyle({ id }) {
          const $style = document.querySelector(`[micro-style=${id}]`);
          $style && $style?.parentNode?.removeChild($style);
        }

        hasLoadScript({ id }) {
          const $script = document.querySelector(`[micro-script=${id}]`);
          return !!$script;
        }

        hasLoadStyle({ id }) {
          const $style = document.querySelector(`[micro-style=${id}]`);
          return !!$style;
        }
      }
    </script>

    <!-- 根据路由切换微应用 -->
    <script type="text/javascript">
      // 微应用管理
      class MicroAppManager extends UtilsManager {
        micrpApps = [];

        constructor() {
          super();
          this.init();
        }

        init() {
          this.processMicroApps();
          this.navClickListener();
          this.hashChangeListener();
        }

        processMicroApps() {
          this.getMicroApps().then((res) => {
            this.microApps = res;
            this.prefetchMicroAppStatic();
            this.createMicroAppNav();
          });
        }

        prefetchMicroAppStatic() {
          const prefetchMicroApps = this.microApps?.filter(
            (microapp) => microapp.prefetch
          );
          prefetchMicroApps?.forEach((microApp) => {
            microApp.script && this.prefetchStatic(microApp.script, "script");
            microApp.style && this.prefetchStatic(microApp.style, "style");
          });
        }

        createMicroAppNav(microApps) {
          const fragment = new DocumentFragment();
          this.microApps?.forEach((microApp) => {
            // TODO: APP 数据规范检测 (例如是否有 script、mount、unmount 等）
            const button = document.createElement("button");
            button.textContent = microApp.name;
            button.id = microApp.id;
            fragment.appendChild(button);
          });
          nav.appendChild(fragment);
        }

        navClickListener() {
          const nav = document.getElementById("nav");
          nav.addEventListener("click", (e) => {
            // 并不是只有 button 可以触发导航变更，例如 a 标签也可以，因此这里不直接处理微应用切换，只是改变 Hash 地址
            // 不会触发刷新，类似于框架的 Hash 路由
            window.location.hash = event?.target?.id;
          });
        }

        hashChangeListener() {
          // 监听 Hash 路由的变化，切换微应用
          // 这里设定一个时刻页面上只有一个微应用
          window.addEventListener("hashchange", () => {
            this.microApps?.forEach(async (microApp) => {
              // 匹配需要激活的微应用
              if (microApp.id === window.location.hash.replace("#", "")) {
                console.time(`fetch microapp ${microApp.name} static`);
                // 加载 CSS 样式
                microApp?.style &&
                  !this.hasLoadStyle(microApp) &&
                  (await this.loadStyle(microApp));
                // 加载 Script 标签
                microApp?.script &&
                  !this.hasLoadScript(microApp) &&
                  (await this.loadScript(microApp));
                console.timeEnd(`fetch microapp ${microApp.name} static`);
                window?.[microApp.mount]?.("#micro-app-slot");
                // 如果存在卸载 API 则进行应用卸载处理
              } else {
                this.removeStyle(microApp);
                window?.[microApp.unmount]?.();
              }
            });
          });
        }
      }

      new MicroAppManager();
    </script>
  </body>
</html>
~~~
>温馨提示：在微应用切换的执行逻辑中，为什么需要删除 `CSS` 样文件？那为什么不删除 `JS` 文件呢？删除 `JS` 文件会有什么副作用吗？假设删除 `micro1.js`，那么还能获取 `window.micro1_mount` 吗？如果能够获取，浏览器为什么不在删除 JS 的同时进行内存释放处理呢？如果释放，会有什么副作用呢？

微应用的设计如下所示（完全可以替换成 `React` 或者 `Vue` 框架打包的 `JS` 脚本和 `CSS` 资源）：
~~~ts
// micro1.js
// 立即执行的匿名函数可以防止变量 root 产生冲突
(function () {
  let root;

  window.micro1_mount = function (slot) {
    // 以下其实可以是 React 框架或者 Vue 框架生成的 Document 元素，这里只是做一个简单的示例
    root = document.createElement("h1");
    root.textContent = "微应用1";
    // 在微应用插槽上挂载 DOM 元素
    const $slot = document.querySelector(slot);
    $slot?.appendChild(root);
  };

  window.micro1_unmount = function () {
    if (!root) return;
    root.parentNode?.removeChild(root);
  };
})();
~~~
~~~css
/* micro1.css */
h1 {
  color: green;
}
~~~
~~~ts
// micro2.js
// 立即执行的匿名函数可以防止变量 root 产生冲突
(function () {
  let root;

  window.micro2_mount = function (slot) {
    // 以下其实可以是 React 框架或者 Vue 框架生成的 Document 元素，这里只是做一个简单的示例
    root = document.createElement("h1");
    root.textContent = "微应用2";
    const $slot = document.querySelector(slot);
    $slot?.appendChild(root);
  };

  window.micro2_unmount = function () {
    if (!root) return;
    root.parentNode?.removeChild(root);
  };
})();
~~~
~~~css
/* micro2.css */
h1 {
  color: blue;
}
~~~
~~~json
// package.json
{
  "name": "micro-framework",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "dependencies": {
    "express": "^4.18.2",
    "ip": "^1.1.8",
    "morgan": "^1.10.0"
  },
  "scripts": {
    "main": "node main-server.js",
    "micro": "node micro-server.js",
    "test": "echo \"Error: no test specified\" && exit 1"
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
  "homepage": "https://github.com/ziyi2/micro-framework#readme"
}
~~~
>温馨提示：如果去除 `micro1.js` 和 `micro2.js` 的立即执行匿名函数，在微应用切换时，会发生什么情况呢？

相应的服务端设计如下所示：
~~~ts
// config.js
import ip from "ip";

export default {
  port: {
    main: 4000,
    micro: 3000,
  },
  // 获取本机的 IP 地址
  host: ip.address(),
};
~~~
~~~ts
// main-server.js
import express from "express";
import path from "path";
import morgan from "morgan";
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(express.static(path.join("public", "main")));

app.post("/microapps", function (req, res) {
  // 这里可以是管理后台新增菜单后存储到数据库的数据
  // 从而可以通过管理后台动态配置微应用的菜单
  res.json([
    {
      // 应用名称
      name: "micro1",
      // 应用标识
      id: "micro1",
      // 应用脚本（示例给出一个脚本，多个脚本也一样）
      script: `http://${host}:${port.micro}/micro1.js`,
      // 应用样式
      style: `http://${host}:${port.micro}/micro1.css`,
      // 挂载到 window 上的加载函数 window.micro1_mount
      mount: "micro1_mount",
      // 挂载到 window 上的卸载函数 window.micro1_unmount
      unmount: "micro1_unmount",
      // 是否需要预获取
      prefetch: true,
    },
    {
      name: "micro2",
      id: "micro2",
      script: `http://${host}:${port.micro}/micro2.js`,
      style: `http://${host}:${port.micro}/micro2.css`,
      mount: "micro2_mount",
      unmount: "micro2_unmount",
      fetch: true,
    },
  ]);
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from 'path';
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));
app.use(express.static(path.join("public", "micro")));

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
同时启动主应用和微应用的服务，并通过访问主应用的 `HTML` 实现上述动图中的切换效果。动态 `Script` 的方案相对于 `NPM` 方案而言，具备如下优势：
- 主应用在线上运行时可以动态增加、删除和更新（升级或回滚）需要上架的微应用
- 微应用可以进行构建时性能优化，包括代码分割和静态资源分离处理
- 不需要额外对微应用进行库构建配置去适配 `NPM` 包的模块化加载方式

当然，**动态 Script 方案** 和 **NPM 包方案** 一样，会存在如下问题：
- 主应用和各个微应用的**全局变量会产生属性冲突**
- 主应用和各个微应用的 **CSS 样式会产生冲突**

## Web Components 方案




































