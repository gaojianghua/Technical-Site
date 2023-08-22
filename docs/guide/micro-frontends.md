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
::: tip
温馨提示：`MPA` 模式下后端的技术栈方案非常多，可以是单个服务框架，可以是多个不同的服务框架，还可以是微服务框架。不同路由的 `HTTP` 请求将被分发到对应的服务上，这些服务可能是 `Nginx` 反向代理后的服务、`Nginx` 部署的静态资源服务、`CDN` 服务以及对象存储服务等。
:::

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
::: tip 
温馨提示：新开的标签页和 `Renderer` 进程并不一定是 **1: 1 的关系**，例如，多个新开的空白标签页为了节省资源，有可能被合并成一个 `Renderer` 进程。
:::
上图只是一个简单的多进程架构示意，事实上 Chrome 浏览器包括 **Browser 进程**、**网络进程**、**数据存储进程**、**插件进程**、**Renderer 进程**和 **GPU 进程**等。除此之外，Chrome 浏览器会根据当前设备的性能和存储空间来动态设置部分进程是否启用，例如低配 Android 手机的设备资源相对紧张时，部分进程（**存储进程**、**网络进程**、**设备进程**等）会被合并到 `Browser` 主进程，完整的多进程架构如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/399538227.png)

### 浏览器沙箱隔离
由于 Web 应用运行在 `Renderer` 进程中，浏览器为了提升安全性，需要通过常驻的 `Browser` 主进程对 `Renderer` 进程进行沙箱隔离设计，从而实现 Web 应用进行**隔离和管控**，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/282191177.png)

::: tip
温馨提示：从 Chrome 浏览器开发商的角度出发，需要将非浏览器自身开发的 Web 应用设定为三方不可信应用，防止 Web 页面可以通过 Chrome 浏览器进入用户的操作系统执行危险操作。
:::
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

::: tip
温馨提示：Chrome 为标签页分配 Renderer 进程的策略和 iframe 中的站点隔离策略是有差异的，例如用户自己新开标签页时，不管是否已经存在同站的应用都会创建新的 Renderer 进程。用户通过window.open 跳转新标签页时，浏览器会判断当前应用和跳转后的应用是否属于同一个站点，如果属于同一个站点则会复用当前应用所在的 Renderer 进程。
:::
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
::: tip
温馨提示：如果希望判断微应用是否被其他应用进行嵌入，也可以使用 [location.ancestorOrigins](https://developer.mozilla.org/zh-CN/docs/Web/API/Location/ancestorOrigins) 来进行判断。
:::
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
::: tip
温馨提示：对于非后台管理系统而言，使用 `iframe` 还需要考虑 `SEO`、`移动端兼容性`、`加载性能`等问题。
:::
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
::: tip
温馨提示：当声明全局变量 `_` 之后，lodash 库判断如果 `_` 存在则不做任何处理（防冲撞），防止后续的代码需要使用开发者自己声明的 `_` 时出现问题。
:::
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
::: tip
温馨提示：`import-maps` 存在[浏览器兼容性](https://caniuse.com/?search=import%20maps)问题，可以找相应的 [polyfill](https://github.com/guybedford/es-module-shims) 进行兼容性处理。
在脚本中引入的 `custom_module` 目录下的 `add.js`、`conflict.js` 以及 `node_modules` 目录下的三方模块 `lodash`，都会通过 `HTTP` 请求的方式进行加载，如下所示：
:::
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

::: tip
温馨提示：`Webpack` 可以对 `ES Modules` 和 `CommonJS` 进行模块化组装，是一种常用的打包工具。除此之外， `Webpack` 可以借助 `Babel` 转译工具实现代码的 **ES6+** 到 **ES5** 的转译工作，最终可以打包出兼容浏览器的代码。
:::
当然，除了应用开发需要使用构建工具，在业务组件的开发中也需要使用构建工具，需要注意的是两者的构建是有差异的，**应用的构建需要生成 HTML 文件并打包 JS、CSS 以及图片等静态资源，业务组件的构建更多的是打包成应用需要通过模块化方式引入使用的 [JavaScript 库](https://webpack.docschina.org/guides/author-libraries/)。**

业务组件的设计是一种通用的库包建设，当开发完一个版本之后，通常会发布成 NPM 包。**应用在构建时为了提升构建速度，同时也为了简化构建配置，通常在使用 [babel-loader](https://github.com/babel/babel-loader#babel-loader-is-slow) （转译工具）进行转译时 ， 会屏蔽 node_modules 目录下的 NPM 包**，因此需要将发布的 NPM 组件转译成大多数浏览器能够兼容的 ES5 标准，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/446798271.png)

::: tip
温馨提示：从 [JavaScript 标准版本的兼容性](https://kangax.github.io/compat-table/es6/) 可以发现，想要兼容大部分浏览器，需要将 ES6 或更高标准的 ECMAScript 转换成 [ES5 标准](https://caniuse.com/?search=ES5)，而如果要支持 IE9 及以下版本的浏览器，还需要使用 [polyfill](https://en.wikipedia.org/wiki/Polyfill_(programming)) (例如 [core-js](https://github.com/zloirock/core-js)) 来扩展浏览器中缺失的 API（例如 ES3 标准中缺失 `Array.prototype.forEach`）。如果对上图中的 ECMAScript 标准不了解，可以自行搜索和查看 ES2015 ~ ES2022（ES6 ~ ES13）、ESNext 等。
:::

不同应用的开发态环境可能不同，例如应用 `A` 采用 `ES6 & TypeScript` 进行开发，而应用 `B` 则采用 `ES13` 进行开发，两个应用最终都需要通过构建工具生成浏览器能够兼容的 `ES5` 标准。

假设业务组件的开发环境使用 `ES13 & TypeScript` ，如果不进行组件本身的 `ES5` 标准构建，而是直接在应用中引入源码使用，那么应用 `A` 和应用 `B` 各自需要额外考虑组件的构建配置项，例如需要使应用 `A` 支持更高的 `ES13` 标准，需要使应用 `B` 支持 `TypeScript`，才能将加载的组件对应的源码在应用层面构建成 `ES5` 标准。如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2205909131.png)

::: tip
温馨提示：注意直接输出 `ES13` 源代码和 NPM 发布的 `ES Modules` 模块有一定的差异，前者所有的代码都是 `ES13` 标准，后者只是导入导出的 `import` 和 `export` 符合 `ES Modules` 规范，其余的语法仍然是浏览器或 `Node.js` 能够兼容的 `ES5` 标准。这样前者一定需要在应用层被转译成 `ES5` 标准，而后者只是模块化标准需要被转译和打包处理，而内部代码不需要编译，具体可以查看 `pkg.module`。除此之外，这里需要额外了解发布 `ES Modules` 模块的好处是什么。
:::

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

::: tip
温馨提示：在 Lerna 中执行 `lerna bootstrap`，可以让本地的 NPM 包之间快速形成软链接，从而不需要发布 NPM 仓库，当然如果不使用 Lerna 工具，也可以手动通过 `npm link` 进行处理。
:::
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
::: tip
温馨提示：使用应用程序的 Webpack 配置进行库构建改造会相对麻烦，这里也可以直接使用一些成熟的业务组件脚手架做处理，仅需要将 React 框架的代码构建到输出目标中即可。
:::

使用 `React` 脚手架制作 NPM 微应用的 `Webpack` 配置相对比较麻烦，本质思路是需要将所有的资源都构建成单个 JS 脚本的方式进行引入（不要抽离通用的 JS 文件，因为不是直接在浏览器中运行），此时执行构建会生成 `CommonJS` 规范的 `build/main.js` 目标文件：
~~~
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  50.28 kB  build/main.js
~~~
::: tip
温馨提示：通常在开发态时，为了使得主应用能够查看微应用 NPM 包的集成效果，在修改微应用后需要对微应用进行构建才能在主应用中查看微应用的修改效果。有没有方法可以做到主应用引入方式不变的情况下，在开发态引入的是微应用的源码（修改微应用的代码后不需要构建，直接在主应用中会热更新变更），而在生产态引入的是微应用构建后发布的 NPM 包，这种配置在单个业务组件的开发中尤为重要。
:::

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

::: tip
温馨提示：这里点击导航改变 `Hash` 来模拟 `Vue` 或者 `React` 框架中路由的切换。
:::

两个按钮（微应用导航）根据后端数据动态渲染，点击按钮后会请求微应用的静态资源并解析相应的 `JS` 和 `CSS`，并渲染微应用的文本信息到插槽中。

::: tip
温馨提示：主应用中的文本样式会被切换的微应用样式污染，从一开始的红色变成绿色或蓝色。首次点击按钮加载微应用的静态资源时会命中 `prefetch cache`，从而缩短应用资源的加载时间（不会发送请求给服务端），再次点击按钮请求资源时会命中缓存，状态码是 304。关于缓存会在后续的性能优化课程中详细讲解。
:::

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
::: tip
温馨提示：在微应用切换的执行逻辑中，为什么需要删除 `CSS` 样文件？那为什么不删除 `JS` 文件呢？删除 `JS` 文件会有什么副作用吗？假设删除 `micro1.js`，那么还能获取 `window.micro1_mount` 吗？如果能够获取，浏览器为什么不在删除 JS 的同时进行内存释放处理呢？如果释放，会有什么副作用呢？
:::
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
::: tip
温馨提示：如果去除 `micro1.js` 和 `micro2.js` 的立即执行匿名函数，在微应用切换时，会发生什么情况呢？
:::
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
`Web Components` 可以理解为浏览器的原生组件，它通过组件化的方式封装微应用，从而实现应用自治。本章会在动态 `Script` 方案的基础上做少许改动来实现简单的 `Web Components` 方案

在动态 `Script` 方案的基础上进行少许改动便可以简单支持 `Web Components` 方案，实现思路如下所示：
- 通过请求获取后端的微应用列表数据，动态进行微应用的预获取和导航创建处理
- 根据导航进行微应用的切换，切换的过程会动态加载并执行 JS 和 CSS
- JS 执行后会在主应用中添加微应用对应的自定义元素，从而实现微应用的加载
- 如果已经加载微应用对应的 JS 和 CSS，再次切换只需要对自定义元素进行显示和隐藏操作
- 微应用自定义元素会根据内部的生命周期函数在被添加和删除 DOM 时进行加载和卸载处理

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3796511192.png)

文件的结构目录和动态 Script 保持一致，如下所示：
~~~
├── public                  # 托管的静态资源目录
│   ├── main/               # 主应用资源目录                        
│   │   └── index.html                                        
│   └── micro/              # 微应用资源目录
│        ├── micro1.css   
│        ├── micro1.js    
│        ├── micro2.css         
│        └── micro2.js      
├── config.js                # 公共配置
├── main-server.js           # 主应用服务
└── micro-server.js          # 微应用服务
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
    <h1>Hello，Web Components!</h1>
    <div id="nav"></div>
    <div class="container">
      <div id="micro-app-slot"></div>
    </div>

    <script type="text/javascript">
      class UtilsManager {
        constructor() {}

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

        prefetchStatic(href, as) {
          if (!this.isSupportPrefetch()) {
            return;
          }
          const $link = document.createElement("link");
          $link.rel = "prefetch";
          $link.as = as;
          $link.href = href;
          document.head.appendChild($link);
        }

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

    <script type="text/javascript">
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
            window.location.hash = event?.target?.id;
          });
        }

        hashChangeListener() {
          // Web Components 方案
          // 微应用的插槽
          const $slot = document.getElementById("micro-app-slot");

          window.addEventListener("hashchange", () => {
            this.microApps?.forEach(async (microApp) => {
              // Web Components 方案
              const $webcomponent = document.querySelector(
                `[micro-id=${microApp.id}]`
              );

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

                // 动态 Script 方案
                // window?.[microApp.mount]?.("#micro-app-slot");

                // Web Components 方案
                // 如果没有在 DOM 中添加自定义元素，则先添加处理
                if (!$webcomponent) {
                  // Web Components 方案
                  // 自定义元素的标签是微应用先定义出来的，然后在服务端的接口里通过 customElement 属性进行约定
                  const $webcomponent = document.createElement(
                    microApp.customElement
                  );
                  $webcomponent.setAttribute("micro-id", microApp.id);
                  $slot.appendChild($webcomponent);
                // 如果已经存在自定义元素，则进行显示处理
                } else {
                  $webcomponent.style.display = "block";
                }
              } else {
                this.removeStyle(microApp);
                // 动态 Script 方案
                // window?.[microApp.unmount]?.();

                // Web Components 方案
                // 如果已经添加了自定义元素，则隐藏自定义元素
                if ($webcomponent) {
                  $webcomponent.style.display = "none";
                }
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
`package.json`如下所示：
~~~json
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
微应用的设计如下所示：
~~~ts
// micro1.js

// MDN: https://developer.mozilla.org/zh-CN/docs/Web/Web_Components
// MDN: https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_custom_elements
class MicroApp1Element extends HTMLElement {
  constructor() {
    super();
  }

  // [生命周期回调函数] 当 custom element 自定义标签首次被插入文档 DOM 时，被调用
  // 类似于 React 中的  componentDidMount 周期函数
  // 类似于 Vue 中的 mounted 周期函数
  connectedCallback() {
    console.log(`[micro-app-1]：执行 connectedCallback 生命周期回调函数`);
    // 挂载应用
    // 相对动态 Script，组件内部可以自动进行 mount 操作，不需要对外提供手动调用的 mount 函数，从而防止不必要的全局属性冲突
    this.mount();
  }

  // [生命周期回调函数] 当 custom element 从文档 DOM 中删除时，被调用
  // 类似于 React 中的  componentWillUnmount 周期函数
  // 类似于 Vue 中的 destroyed 周期函数
  disconnectedCallback() {
    console.log(
      `[micro-app-1]：执行 disconnectedCallback 生命周期回调函数`
    );
    // 卸载处理
    this.unmount();
  }

  mount() {
    const $micro = document.createElement("h1");
    $micro.textContent = "微应用1";
    // 将微应用的内容挂载到当前自定义元素下
    this.appendChild($micro);
  }

  unmount() {
    // 这里可以去除相应的副作用处理
  }
}

// MDN：https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/define
// 创建自定义元素，可以在浏览器中使用 <micro-app-1> 自定义标签
window.customElements.define("micro-app-1", MicroApp1Element);
~~~
::: tip
温馨提示：需要注意 Web Components 存在[浏览器兼容性问题](https://caniuse.com/?search=Web%20Components)，可以通过 [Polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/webcomponentsjs) 进行浏览器兼容性处理（IE 只能兼容到 11 版本）。
:::

在 `main-server.js` 中增加微应用对应的自定义元素标签属性：
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
      // Web Components 方案
      // 自定义元素名称
      customElement: 'micro-app-1',
      // 应用脚本（示例给出一个脚本，多个脚本也一样）
      script: `http://${host}:${port.micro}/micro1.js`,
      // 应用样式
      style: `http://${host}:${port.micro}/micro1.css`,
      // 动态 Script 方案
      // 挂载到 window 上的加载函数 window.micro1_mount
      // mount: "micro1_mount",
      // 动态 Script 方案
      // 挂载到 window 上的卸载函数 window.micro1_unmount
      // unmount: "micro1_unmount",
      // 是否需要预获取
      prefetch: true,
    },
    {
      name: "micro2",
      id: "micro2",
      customElement: 'micro-app-2',
      script: `http://${host}:${port.micro}/micro2.js`,
      style: `http://${host}:${port.micro}/micro2.css`,
      prefetch: true,
    },
  ]);
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
对比动态 `Script` 的方案可以发现 `Web Components` 的优势如下所示：
- **复用性**：不需要对外抛出加载和卸载的全局 API，可复用能力更强
- **标准化**：W3C 的标准，未来能力会得到持续升级（说不定支持了 JS 上下文隔离）
- **插拔性**：可以非常便捷的进行移植和组件替换

当然使用 `Web Components` 也会存在一些劣势，例如：
- **兼容性**：对于 IE 浏览器不兼容，需要通过 `Polyfill` 的方式进行处理
- **学习曲线**：相对于传统的 Web 开发，需要掌握新的概念和技术

## iframe Cookie
本章以 `iframe` 方案为例，重点讲解 `iframe` 中的 `Cookie` 数据在跨域和跨站中的表现情况，从而指导大家更加深入的了解微前端 `iframe` 中的 `Cookie` 处理。
::: tip
温馨提示：本课程不会讲解如何实现微应用的 `SSO` 免登和 `CSRF` 防御等处理，只提供解决上述问题所需要的最基础的浏览器和服务端知识。感兴趣的同学需要自行了解实现主子应用免登的方案。
:::
在**iframe 方案**中，我们重点讲解了跨站和跨域的区别，在使用 `iframe` 进行主子应用集成时，很可能存在如下几种情况，接下来我们重点观察这些情况在浏览器中的 `Cookie` 表现：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/4108035869.png)

::: tip
温馨提示：在微前端方案的设计中，如果没有纯三方应用的集成，大多数 `iframe` 应用可以设计成和主应用同域的业务场景，从而简化设计方案。出于安全考虑，浏览器中的 `LocalStorage` 在跨域情况下无法共享，但是面试官可能会给你挖个坑，询问 `Cookie` 在跨域情况下是否可以共享？阅读完本章节可以很好的解答该问题。
:::
`iframe` 测试 `Cookie` 的目录结构如下所示：
~~~
├── same-origin/                 # 主子应用同域
├── same-site/                   # 主子应用跨域同站
├── cross-site/                  # 主子应用跨站
├── public/                      # 前端静态页面
├── config/                      # 服务端配置：端口、IP 等
└── package.json    
~~~
`public` 目录主要存放 Web 前端的静态页面，如下所示：
~~~html
<!-- 主应用 HTML：main.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>主应用</title>
  </head>
  <body>
    <h1>主应用</h1>
    <button onclick="handleConsoleCookie()">主应用 - 打印 cookie</button>
    <button onclick="handleLoadIframe()">加载 iframe 微应用</button>
    <br />
    <br />
  </body>

  <script>
    function handleConsoleCookie() {
      console.log("[主应用 - 打印 cookie]: ", document.cookie);
    }

    function handleLoadIframe() {
      const iframe = document.createElement('iframe');
      // ejs 模版 micro 变量填充: 指向微应用的打开地址
      iframe.src = "<%= micro %>";
      document.body.appendChild(iframe);
    }
  </script>
</html>
~~~
~~~html
<!-- 微应用 HTML：micro.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>iframe 微应用</title>
  </head>
  <body>
    <h1>iframe 微应用</h1>
    <button onclick="handleConsoleCookie()">微应用 - 打印 cookie</button>
  </body>

  <script>
    function handleConsoleCookie() {
      console.log("[微应用 - 打印 cookie] micro-app cookie: ", document.cookie);
    }
  </script>
</html>
~~~
`config.js` 是服务端所有示例的公共配置项，如下所示：
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
`package.json` 中设置了各个示例启动服务的脚本：
~~~json
{
  "name": "micro-framework",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ziyi2/micro-framework.git"
  },
  "scripts": {
    // 启动同域服务
    "same-origin": "node same-origin/main-server.js",
    // 启动跨域同站的两个服务(注意 & 和 && 的区别)
    "same-site": "node same-site/main-server.js & node same-site/micro-server.js",
    // 启动跨站的两个服务
    "cross-site": "node cross-site/main-server.js & node cross-site/micro-server.js"
  },
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/ziyi2/micro-framework/issues"
  },
  "homepage": "https://github.com/ziyi2/micro-framework#readme",
  "dependencies": {
    "cookie-parser": "1.4.6",
    "ejs": "3.1.8",
    "express": "4.18.2",
    "ip": "1.1.8",
    "ngrok": "4.3.3"
  },
  "engines": {
    "node": ">16"
  },
  "engineStrict": true
}
~~~
### 主子应用同域
首先设计一个同域的微前端方案，查看同域情况下主应用和 `iframe` 微应用的 `Cookie` 表现，服务端设计如下所示：
~~~ts
// same-origin/main-server.js
import path from "path";
// express：https://github.com/expressjs/express
import express from "express";
// ejs 中文网站: https://ejs.bootcss.com/#promo
// ejs express 示例: https://github.com/expressjs/express/blob/master/examples/ejs/index.js
import ejs from "ejs";

import config from "../config.js";
const { port, host, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  // 设置主应用的 cookie 标识
  res.cookie("main-app", "true");
  // 使用 ejs 模版引擎填充主应用 public/main.html 中的 micro 变量，并将其渲染到浏览器
  res.render("main", {
    // micro 指向微应用的打开地址
    micro: `http://${host}:${port.main}/micro`,
  });
});

// 微应用和主应用同域，只是服务路由不同
app.get("/micro", function (req, res) {
  // 设置 iframe 微应用的 cookie 标识，顺便观察能否覆盖主应用的 cookie 标识
  res.cookie("micro-app", "true").cookie("main-app", "false");
  // 渲染 views/micro.html
  res.render("micro");
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
使用 `npm run same-origin` 启动服务后，可以操作按钮来打印 `Cookie` 信息，一开始只加载主应用的 `HTML` 时打印 `main-app=true`，动态加载 `iframe` 微应用后由于微应用将 `main-app` 设置为 `false`，发现主应用同名属性的 `Cookie` 值被覆盖。因此在同域的方案下，主子应用可以共享 `Cookie` 数据，但是存在同名属性值被覆盖的风险。
::: tip
温馨提示：主子应用同域可以通过共享 `Cookie` 来解决登录态的问题，是非常常用的一种微前端方案。
:::

### 主子应用跨域同站
在 `iframe` 方案中，我们已经讲解了同站的条件，两个应用的 `eTLD + 1` 相同则是同站。这里可以设计两个应用地址分别为 `http://ziyi.example.com` 和 `http://example.com`，其中 `com` 是一个有效顶级域名，因此 `eTLD + 1` 相同。为了模拟上述域名地址，可以使用 `iHosts` 进行域名映射，主要实现如下功能：
- 在主应用中使用 `iHosts` 进行域名映射，将 `example.com` 映射到本地 `IP` 地址
- 在子应用中使用 `iHosts` 进行域名映射，将 `ziyi.example.com` 映射到本地 `IP` 地址

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1031534360.png)

::: tip
温馨提示：`iHosts` 工具本质上是更改了本地系统的 `hosts` 文件，从而起到域名和 `IP` 的匹配映射。这里可以额外了解本地 `hosts` 匹配和 `DNS` 服务解析的差异。
:::
在 `iHosts` 中同一个 `IP` 地址可以指向不同的域名，配置如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/4228648717.png)

服务代码如下所示：
~~~ts
// same-site/main-server.js
// 主应用服务代码
import path from "path";
import express from "express";
import ejs from "ejs";

import config from "../config.js";
const { port, host, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

// 使用 iHosts 配置 example.com 指向本机的 ip 地址
// 主应用访问地址：http://example.com:4000
app.get("/", function (req, res) {
  res.cookie("main-app", "true");
  // 为了使同站的微应用可以共享主应用的 Cookie
  // 在设置 Cookie 时，可以使用 Domain 和 Path 来标记作用域
  // 默认不指定的情况下，Domain 属性为当前应用的 host，由于 ziyi.example.com 和 example.com 不同
  // 因此默认情况下两者不能共享 Cookie，可以通过设置 Domain 使其为子域设置 Cookie，例如 Domain=example.com，则 Cookie 也包含在子域 ziyi.example.com 中
  res.cookie("main-app-share", "true", { domain: "example.com" });
  res.render("main", {
    // 使用 iHosts 配置 ziyi.example.com 指向本机的 ip 地址
    // 子应用访问地址： http://ziyi.example.com:3000
    micro: `http://ziyi.example.com:${port.micro}` 
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`main app start at http://${host}:${port.main}/`);
~~~
~~~ts
// same-site/micro-server.js
// 微应用服务代码
import path from "path";
import express from "express";
import ejs from "ejs";
import config from "../config.js";

const { host, port, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

// 浏览器访问 http://${host}:${port.micro}/ 时会渲染 public/micro.html
// 端口不同，主应用和微应用跨域但是不跨站
app.get("/", function (req, res) {
  // 设置 iframe 微应用的 cookie 标识，顺便观察能否覆盖主应用的 cookie 标识
  res.cookie("micro-app", "true").cookie("main-app", "false");
  res.render("micro");
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
使用 `npm run same-site` 可以同时启动主应用和子应用的服务，操作按钮来打印 `Cookie` 信息，在 `host` 不同的情况下，主应用的 `main-app` 字段不会被子应用进行覆盖，主应用和子应用无法共享 `Cookie`。但是如果主应用和子应用同站，那么可以通过设置 `Domain` 使得两个应用可以共享彼此的 `Cookie`，例如上图中的 `main-app-share` 字段，通过设置 `Domain` 为 `example.com` 后可以被子应用进行共享。因此在同站的某些特殊情况下，`Cookie` 是可以在不同的应用中产生共享的。

### 主子应用跨站
跨站的实现方式也非常简单，只需要更改原有的 `iHosts` 配置即可，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/665518776.png)

- 在主应用中使用 `iHosts` 进行域名映射，将 `ziyi.com` 映射到本地 `IP` 地址
- 在子应用中使用 `iHosts` 进行域名映射，将 `ziyi.example.com` 映射到本地 `IP` 地址

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3573074866.png)

此时主子应用因为 `eTLD + 1` 不同形成跨站（`com` 是一个有效顶级域名），由于 `iHosts` 映射的 `IP` 地址不变，因此不需要将将主子应用的 `Node` 服务断开，重新在浏览器中通过 `ziyi.com:4000` 进行访问。

从浏览器的测试信息可以看出：
- 在主应用中设置的 `main-app-share Cookie 值`失效，因为主应用不在 `example.com` 下
- 在子应用中设置的 `micro-app` 和 `main-app 的 Cookie 值`失效

从打印的信息可以发现子应用在跨站的情况下无法设置 `Cookie`，重点可以查看一下 `iframe` 微应用 `Cookie` 设置失效的原因：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/781163118.png)

从警告信息可以看出，如果主应用和内部的 `iframe` 子应用（非顶级浏览上下文）跨站，那么 `iframe` 应用的 `Cookie` 设置会被阻止。查看 [SameSite cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Set-Cookie/SameSite) 发现 `Chrome` 浏览器 `80` 版本将 `SameSite` 的默认值设置为 `Lax`，用于解决 `iframe` 应用产生 `CSRF` 跨站请求伪造的安全问题（防止跨站携带 `Cookie`）。此时解决方案是将 `SameSite` 设置为 `None` 并使用 `Secure` 属性（必须使用 `HTTPS` 协议）。为了实现 `HTTPS` 协议，这里采用 [Ngrok](https://github.com/bubenshchykov/ngrok#readme) 进行反向代理，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/77315839.png)

- 在主应用中使用 `Ngrok` 进行反向代理，建立 `HTTPS` 连接
- 在子应用中使用 `Ngrok` 进行反向代理，建立 `HTTPS` 连接，形成主子应用跨站

::: tip
温馨提示：通过查看 `publicsuffix/list` 可以发现 `ngrok-free.app` 是顶级有效域名，因此上述主应用和子应用跨站。
:::
:::warning
警告 ⚠️：这里为了建立 `HTTPS` 连接使用了 `Ngrok` 进行反向代理，但是这种方式切忌在公司内网尝试，本质上会将本地的网络暴露到公网进行内网穿透，存在安全风险。如果你是在公司内部网络，那么可以尝试下一章的 `Web Components` 持久化示例中的 `Nginx` 配置方案建立 `HTTPS` 连接。课程中使用 `Ngrok` 是为了提供大家一种创建 `HTTPS` 连接的简单示例。
:::
为了实现上述功能，可以借助 `Node` 的 `Ngrok` 客户端建立反向代理，修改服务代码：
~~~ts
// cross-site/main-server.js
// 主应用服务代码
import path from "path";
import express from "express";
import ngrok from "ngrok";
import ejs from "ejs";

import config from "../config.js";
const { port, host, authtoken, __dirname } = config;
const app = express();

// 内网穿透（主应用反向代理）
// ngrok: https://github.com/bubenshchykov/ngrok#readme
// authtoken 需要进行免费注册获取：https://github.com/bubenshchykov/ngrok#auth-token
// 本课程通过 ngrok 全局 CLI 设置了 authtoken，因此不需要传递 authtoken 参数
// https://ngrok.com/docs/getting-started/#step-3-connect-your-agent-to-your-ngrok-account
// ngrok config add-authtoken TOKEN
const main = await ngrok.connect({
  proto: "http",
  // authtoken,
  addr: `http://${host}:${port.main}`,
  // 使用 https 协议
  bind_tls: true,
});

console.log("main app ngrok url: ", main);

// 内网穿透（微应用反向代理）
const micro = await ngrok.connect({
  proto: "http",
  // authtoken,
  addr: `http://${host}:${port.micro}`,
  bind_tls: true,
});

console.log("micro app ngrok url: ", micro);

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  res.cookie("main-app", "true");
  res.render("main", {
    micro,
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
~~~ts
// cross-site/micro-server.js
// 微应用服务代码
import path from "path";
import express from "express";
import ejs from "ejs";
import config from "../config.js";

const { host, port, __dirname } = config;
const app = express();

app.engine(".html", ejs.__express);
app.set("views", path.join(__dirname, "public"));
app.set("view engine", "html");

app.get("/", function (req, res) {
  // 增加 SameSite 和 Secure 属性，从而使浏览器支持 iframe 子应用的跨站携带 Cookie
  // 注意 Secure 需要 HTTPS 协议的支持
  const cookieOptions = { sameSite: "none", secure: true };
  res
    .cookie("micro-app", "true", cookieOptions)
    // 设置 iframe 微应用的 cookie 标识，顺便观察能否覆盖主应用的 cookie 标识
    .cookie("main-app", "false", cookieOptions);
  res.render("micro");
});

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
使用 `npm run cross-site` 可以同时启动主应用和子应用的服务，如下所示：
~~~
# 执行
npm run cross-site

# 打印
> micro-framework@1.0.0 cross-site
> node cross-site/main-server.js & node cross-site/micro-server.js

server start at http://30.120.112.54:3000/
main app ngrok url:  https://3c88-42-120-103-150.ngrok-free.app
micro app ngrok url:  https://64f6-42-120-103-150.ngrok-free.app
server start at http://30.120.112.54:4000/
~~~
默认情况下打开 `Ngrok` 代理地址会产生警告信息，这些信息会提示你切忌使用敏感数据：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/171313349.png)

为了去除警告页从而直接访问本地应用，需要在请求时加上请求头 `ngrok-skip-browser-warning`，可以使用 `Chrome` 的 [Header Editor](https://chrome.google.com/webstore/detail/header-editor/eningockdidmgiojffjmkdblpjocbhgh?hl=zh-CN) 插件进行设置，打开应用后，可以进行 `iframe` 子应用跨站携带 `Cookie` 测试。

通过该示例可以得出两个结论：
- 采用 `iframe` 进行微前端设计时，`Chrome` 浏览器中主子应用跨站的情况下，默认 `iframe` 子应用无法携带 `Cookie`，需要使用 `HTTPS` 协议和并设置服务端 `Cookie` 属性 `SameSite` 和 `Secure` 才行
- 跨站的情况下，主子应用无法进行 `Cookie` 共享

### 总结
在 `iframe` 微前端方案的示例测试中，我们可以发现：
- **主子应用同域**：可以携带和共享 `Cookie`，存在同名属性值被微应用覆盖的风险
- **主子应用跨域同站**：默认主子应用无法共享 `Cookie`，可以通过设置 `Domain` 使得主子应用进行 `Cookie` 共享
- **主子应用跨站**：子应用默认无法携带 `Cookie`（防止 `CSRF` 攻击），需要使用 `HTTPS` 协议并设置服务端 `Cookie` 的 `SameSite` 和 `Secure` 设置才行，并且子应用无法和主应用形成 `Cookie` 共享

了解上述几种 `Cookie` 的携带情况可以帮助我们更好的进行微前端业务方案的设计，`Cookie` 是 `SSO` 免登设计中非常重要的凭证数据。

## Ajax Cookie
本章以 `Web Componets` 为例讲解 `Ajax` 请求中的 `Cookie` 处理。在 `Web Componets` 方案中，虽然主子应用处于同一个 `Host` 地址，但是子应用的服务端此时可能有自己的服务端，因此可以重点查看一下 `Ajax` 请求在跨域时的 `Cookie` 携带情况：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/344287876.png)

回顾一下 `Web Componets` 的微前端示例，目录结构如下所示：
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
为了模拟跨域的 `Ajax` 请求情况，可以使用 `iHosts` 进行域名映射，我们希望实现如下功能：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1597813191.png)

- 在主应用中使用 `iHosts` 进行域名映射，将 `ziyi.com` 映射到本地 `IP` 地址
- 子应用仍然保留原来的 `IP` 地址访问，从而和主应用形成跨域和跨站

`iHosts` 的配置保持不变，`ziyi.com` 可以映射到本地的 `IP` 地址：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3791499823.png)

在之前方案的基础上，使微应用新增跨站的 `Ajax` 请求：
~~~ts
// micro1.js
// micro2.js 同理
class MicroApp1Element extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    console.log(`[micro-app-1]：执行 connectedCallback 生命周期回调函数`);
    this.mount();
  }

  disconnectedCallback() {
    console.log(`[micro-app-1]：执行 disconnectedCallback 生命周期回调函数`);
    this.unmount();
  }

  mount() {
    const $micro = document.createElement("h1");
    $micro.textContent = "微应用1";
    this.appendChild($micro);

    // 新增 Ajax 请求，用于请求子应用服务
    // 需要注意 micro1.js 动态加载在主应用 ziyi.com:4000 下，因此是跨站请求
    
    // 如果先发起 micro1.js 的 Ajax 请求，希望可以响应子应用服务端的 Cookie
    // 再次发起 micro2.js 的同地址的 Ajax 请求，此时希望请求头中可以携带 Cookie
    // 这种情况可用于登录态的免登 Cookie 设计
    window
      .fetch("http://30.120.112.54:3000/cors", {
        method: "post",
        // 允许在请求时携带 Cookie
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Request/credentials
        credentials: "include"
      })
      .then((res) => res.json())
      .then(() => {})
      .catch((err) => {
        console.error(err);
      });
  }

  unmount() {}
}

window.customElements.define("micro-app-1", MicroApp1Element);
~~~
为了使得微应用可以支持跨站请求，需要在服务端进行额外的跨域配置，如下所示：
~~~ts
// main-server.js
import express from "express";
import path from "path";
import morgan from "morgan";
import config from "./config.js";
import cookieParser from "cookie-parser";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

// cookie 中间件
app.use(cookieParser());

app.use(express.static(path.join("public", "main")));

app.post("/microapps", function (req, res) {

  console.log("main cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("main-app", true);

  res.json([
    {
      name: "micro1",
      id: "micro1",
      customElement: "micro-app-1",
      script: `http://${host}:${port.micro}/micro1.js`,
      style: `http://${host}:${port.micro}/micro1.css`,
      prefetch: true,
    },
    {
      name: "micro2",
      id: "micro2",
      customElement: "micro-app-2",
      script: `http://${host}:${port.micro}/micro2.js`,
      style: `http://${host}:${port.micro}/micro2.css`,
      prefetch: true,
    },
  ]);
});

app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import cookieParser from "cookie-parser";
import config from "./config.js";
const app = express();
const { port, host } = config;

app.use(morgan("dev"));

// cookie 中间件
app.use(cookieParser());

// 设置支持跨域请求头
// 示例设置了所有请求的跨域配置，也可以对单个请求进行跨域设置
app.use((req, res, next) => {
  // 跨域请求中涉及到 Cookie 信息传递时值不能为 *，必须是具体的主应用地址
  // 这里的 ziyi.com 使用 iHosts 映射到本地 IP 地址
  res.header("Access-Control-Allow-Origin", `http://ziyi.com:${port.main}`);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS");
  // 允许跨域请求时携带 Cookie
  // https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Access-Control-Allow-Credentials
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  express.static(path.join("public", "micro"), {
    etag: true,
    lastModified: true,
  })
);

app.post("/cors", function (req, res) {

  // 打印子应用的 Cookie 携带情况
  console.log("micro cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("micro-app", true);
  res.json({
    hello: "true",
  });
});

app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
启动主应用和子应用的服务进行 `Ajax` 请求用于观察是否携带 `Cookie`，我们得到如下结果：
- 主应用服务端成功设置 `Cookie`，再次刷新页面时前端的请求会自动携带上 `Cookie` 信息（观察服务端的 `Cookie` 打印信息）
- 子应用进行跨域请求时无法成功设置 `Cookie`

在上述示例中，我们希望两个微应用的第一次 `Ajax` 请求可以响应服务端的 `Cookie` 信息，而第二次的 `Ajax` 请求可以携带第一次 `Ajax` 请求响应的 `Cookie` 信息，但是通过测试发现第二次 `Ajax` 请求并没有携带 `Cookie` 信息，设置 `Cookie` 的警告信息基本上和 `iframe` 中的跨站相同：This Set-Cookie didn't specify a "SameSite" attribute and was default to "SameSite=Lax"， and was blocked because it came from a cross-site response which was not the response to a top-level navigation. The Set-Cookie had to have been set with "SameSite=None" to enable cross-site usage. This Set-Cookie was blocked because it had the "Secure" attribute but was not received over a secure connection. This Set-Cookie was blocked because it was not sent over a secure-connection and would have overwritten a cookie with Secure attribute.

这里和 `iframe` 方案中的跨站情况类似，需要设置 `Cookie` 的 `SameSite` 和 `Secure` 属性并修改成 `HTTPS` 协议。为了支持 `HTTPS` 协议，除了使用 `iframe` 示例中的 `Ngrok`，最基本的方式是提供 `Nginx` 反向代理，在这里可以设置一个反向代理的方案，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1896354420.png)

- 在主应用中使用 `iHosts` 进行域名映射，将 `ziyi.com` 映射到本地 `IP` 地址，映射完成后进行 `Nginx` 反向代理，使其支持 `HTTPS` 协议
- 子应用和主应用跨站，为了支持 `HTTPS` 协议，也需要进行 `Nginx` 反向代理

为了使用 `Nginx` 进行反向代理，首先需要使用 `Homebrew` 进行安装：
~~~
# 执行
brew install nginx

# 安装信息省略
# ...
# 打印
Docroot is: /opt/homebrew/var/www

# 打印信息告知 nginx 的配置文件地址，注意修改该配置后需要重启 nginx 服务
The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /opt/homebrew/etc/nginx/servers/.

To restart nginx after an upgrade:
  # 打印信息告知在后台重启 Nginx 服务的执行命令
  brew services restart nginx
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/nginx/bin/nginx -g daemon off;
==> Summary
🍺  /opt/homebrew/Cellar/nginx/1.23.4: 26 files, 2.2MB
==> Running `brew cleanup nginx`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
==> Caveats
==> nginx
Docroot is: /opt/homebrew/var/www

The default port has been set in /opt/homebrew/etc/nginx/nginx.conf to 8080 so that
nginx can run without sudo.

nginx will load all files in /opt/homebrew/etc/nginx/servers/.

To restart nginx after an upgrade:
  brew services restart nginx
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/nginx/bin/nginx -g daemon off;
~~~
安装后可以简单进行 `Nginx` 反向代理的测试，这里尝试使用 `4001` 端口代理主应用的 `4000` 端口，需要修改 `Nginx` 的配置并重新启动 `Nginx` 服务。从打印信息知道配置文件在 `/opt/homebrew/etc/nginx/nginx.conf` 中，打开配置文件进行简单的代理配置：
~~~shell
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        # 设置主应用的代理端口为 4001
        listen       4001;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            # root   html;
            # index  index.html index.htm;
            # 代理到主应用的 Node 地址
            proxy_pass 'http://30.120.112.54:4000'
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ .php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ .php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /.ht {
        #    deny  all;
        #}
    }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}
    include servers/*;
}
~~~
需要注意在重新启动 `Nginx` 服务之前，可以先进行配置检查，如下所示：
~~~shell
# 执行检查
sudo nginx -t
# 打印信息
nginx: [emerg] unexpected "}" in /opt/homebrew/etc/nginx/nginx.conf:56
nginx: configuration file /opt/homebrew/etc/nginx/nginx.conf test failed
~~~
一般遇到上述情况主要是 `}` 的上一行出现问题 ，仔细观察发现上一行没有以 `;` 结尾：
~~~shell
location / {
    # root   html;
    # index  index.html index.htm;
    # 代理到主应用的地址，结尾处增加分号 ；
    proxy_pass 'http://30.120.112.54:4000';
}
~~~
重新进行 `Nginx` 配置的检测：
~~~shell
# 执行
sudo nginx -t
# 打印
nginx: the configuration file /opt/homebrew/etc/nginx/nginx.conf syntax is ok
nginx: configuration file /opt/homebrew/etc/nginx/nginx.conf test is successful
~~~
此时可以使用 `brew` 提供的命令在后台重新启动 `Nginx` 服务：
~~~shell
# 使用 brew 推荐的 nginx 重启命令
# 建议使用 Nginx 自带的命令，如果遇到代理失败，建议杀掉 Nginx 进程重新尝试
brew services restart nginx

# 打印
Stopping `nginx`... (might take a while)
==> Successfully stopped `nginx` (label: homebrew.mxcl.nginx)
==> Successfully started `nginx` (label: homebrew.mxcl.nginx)
~~~
启动成功后可以通过 `4001` 端口进行访问，发现代理成功：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/111695877.png)

接下来我们需要将 `HTTP` 协议改成 `HTTPS` 协议进行访问，为了在开发态支持 `HTTPS` 协议，可以使用 [mkcert](https://github.com/FiloSottile/mkcert) 生成本地 `CA` 证书：
~~~shell
# 安装 mkcert
brew install mkcert

# 执行以下命令，生成本地 CA 证书
# 进入项目目录
# mkcert example.com "*.example.com" example.test localhost 127.0.0.1 ::1
mkcert ziyi.com 30.120.112.54 localhost 127.0.0.1 ::1

# 打印信息
# ziyi.com 会在 iHosts 中进行 IP 映射
Created a new certificate valid for the following names 📜
 - "ziyi.com"
 - "30.120.112.54"
 - "localhost"
 - "127.0.0.1"
 - "::1"

The certificate is at "./ziyi.com+4.pem" and the key at "./ziyi.com+4-key.pem" ✅

It will expire on 19 July 2025 🗓
~~~
生成本地的 `CA` 证书后将 `Nginx` 的配置进行 `HTTPS` 更改（`Nginx` 配置文件提供了示例，打开注释进行配置即可）：
~~~shell
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    # server {
    #     # 设置主应用的代理端口为 4001
    #     listen       4001;
    #     server_name  localhost;

    #     #charset koi8-r;

    #     #access_log  logs/host.access.log  main;

    #     location / {
    #         # root   html;
    #         # index  index.html index.htm;
    #         # 代理到主应用的地址
    #         proxy_pass 'http://30.120.112.54:4000';
    #     }

    #     #error_page  404              /404.html;

    #     # redirect server error pages to the static page /50x.html
    #     #
    #     error_page   500 502 503 504  /50x.html;
    #     location = /50x.html {
    #         root   html;
    #     }

    #     # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #     #
    #     #location ~ .php$ {
    #     #    proxy_pass   http://127.0.0.1;
    #     #}

    #     # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #     #
    #     #location ~ .php$ {
    #     #    root           html;
    #     #    fastcgi_pass   127.0.0.1:9000;
    #     #    fastcgi_index  index.php;
    #     #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #     #    include        fastcgi_params;
    #     #}

    #     # deny access to .htaccess files, if Apache's document root
    #     # concurs with nginx's one
    #     #
    #     #location ~ /.ht {
    #     #    deny  all;
    #     #}
    # }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

    # HTTPS server
    # 使用 HTTPS 协议，代理到主应用
    server {
       listen       4001 ssl;
       server_name  localhost;

       ssl_certificate      /Users/zhuxiankang/Desktop/Github/micro-framework/ziyi.com+4.pem;
       ssl_certificate_key  /Users/zhuxiankang/Desktop/Github/micro-framework/ziyi.com+4-key.pem;
       
       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
        #    root   html;
        #    index  index.html index.htm;
        proxy_pass 'http://30.120.112.54:4000';
       }
    }

    # HTTPS server
    # 使用 HTTPS 协议，代理到微应用
    server {
       listen       3001 ssl;
       server_name  localhost;
       
       ssl_certificate      /Users/zhuxiankang/Desktop/Github/micro-framework/ziyi.com+4.pem;
       ssl_certificate_key  /Users/zhuxiankang/Desktop/Github/micro-framework/ziyi.com+4-key.pem;

       ssl_session_cache    shared:SSL:1m;
       ssl_session_timeout  5m;

       ssl_ciphers  HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers  on;

       location / {
        #    root   html;
        #    index  index.html index.htm;
        proxy_pass 'http://30.120.112.54:3000';
       }
    }
    include servers/*;
}
~~~
更改服务端代码和前端代码（前端代码不再展示，只需要更改请求的地址即可）：
~~~ts
// main-server.js
import express from "express";
import path from "path";
import morgan from "morgan";
import config from "./config.js";
import cookieParser from "cookie-parser";
const app = express();
const { port, host } = config;

app.use(morgan("dev"));

// cookie 中间件
app.use(cookieParser());

app.use(express.static(path.join("public", "main")));

app.post("/microapps", function (req, res) {
    
  // 再次刷新页面时观察 Cookie 的携带情况
  console.log("main cookies: ", req.cookies);

  // 设置一个响应的 Cookie 数据
  res.cookie("main-app", true);

  res.json([
    {
      name: "micro1",
      id: "micro1",
      customElement: "micro-app-1",
      // 更改微应用资源的加载地址，使用 Nginx 的代理地址
      script: `https://${host}:3001/micro1.js`,
      style: `https://${host}:3001/micro1.css`,
      prefetch: true,
    },
    {
      name: "micro2",
      id: "micro2",
      customElement: "micro-app-2",
      script: `https://${host}:3001/micro2.js`,
      style: `https://${host}:3001/micro2.css`,
      prefetch: true,
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
import path from "path";
import cookieParser from "cookie-parser";
import config from "./config.js";
const app = express();
const { port, host } = config;

app.use(morgan("dev"));

// cookie 中间件
app.use(cookieParser());

app.use((req, res, next) => {
  // 跨域请求中涉及到 Cookie 信息传递，值不能为 *，必须是具体的地址信息
  // 跨域白名单配置为主应用的 Nginx 代理地址
  res.header("Access-Control-Allow-Origin", `https://ziyi.com:4001`);
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS");
  // 允许客户端发送跨域请求时携带 Cookie
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(
  express.static(path.join("public", "micro"), {
    etag: true,
    lastModified: true,
  })
);

app.post("/cors", function (req, res) {
    
  // 用于观察二次请求时的 Cookie 的携带情况
  console.log('micro cookies: ', req.cookies);

  // 增加 SameSite 和 Secure 属性，从而使浏览器支持 iframe 子应用的跨站携带 Cookie
  // 注意 Secure 需要 HTTPS 协议的支持
  const cookieOptions = { sameSite: "none", secure: true };
  // 设置一个响应的 Cookie 数据
  res.cookie("micro-app", true, cookieOptions);
  res.json({
    hello: "true",
  });
});

app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
启动主应用和子应用的服务后可以重点观察 `Cookie` 的携带情况，我们得到如下结果：
- 主应用服务端成功设置 `Cookie`，再次刷新页面时前端的请求会自动携带上 `Cookie` 信息（观察服务端的 `Cookie` 打印信息）
- `Chrome` 浏览器采用跨域 `Ajax` 请求进行设计时，默认无法携带 `Cookie`，需要使用 `HTTPS` 协议和服务端 `Cookie` 属性（`SameSite` 和 `Secure`）设置才行

::: tip
在 Web Components 的 Ajax 请求示例中，我们发现跨站的情况下和 iframe 方案情况相似，需要服务端进行 Cookie 配置和跨域支持，除此之外，在前端的 Ajax 请求中还要配置允许携带 Cookie 的属性 credentials。
:::

## 框架原理：设计要素
前面的示例中讲解了如何将微应用通过不同的技术进行聚合，从而帮助大家理解各自方案的特性。当然，这些示例并不是完整的微前端解决方案，完整的解决方案不仅需要考虑如何进行微应用的聚合，还需要考虑微应用在运行时能否根据业务需求进行实时通信、能否互不干扰、能否做到良好的用户体验等

### MPA 导航
如果项目是在 `MPA` 的模式下，则前端应用天然可以做到小型应用的拆分，微应用只需要考虑如何根据导航进行跳转，此时不存在多个微应用同时并存的情况，因此不需要考虑互相之间的隔离。浏览器自身会处理微应用的加载和卸载，例如大家在面试中经常会被问到在浏览器地址栏中输入 `URL` 地址，浏览器的整个工作过程（这里不讲解页面渲染和 JS 解析的过程）：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/609513152.png)

::: tip
温馨提示：上述图例是在多进程架构的情况下。在运行资源相对紧张的情况下，例如低端的安卓手机中，网络服务也可以是 `Browser` 进程中的一个处理线程。
:::
从标签页的地址栏输入 `URL` 开始，整个页面的导航过程都是由浏览器的 `Browser` 进程进行协调管控，除此之外，如果在 `Renderer` 进程中发起新的导航（例如用户点击链接标签进行跳转或者使用 `JavaScript` 执行 `window.location = "https://new.site.com"`），`Renderer` 进程会通过 `IPC` 告知 `Browser` 进程重复上述处理步骤，如果新导航处理的是不同站点的页面信息，则 `Browserer` 进程会启动新的 `Renderer` 进程进行页面渲染。不管是新开标签页还是提交导航，页面被加载后都会有生命周期的概念，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1510209460.png)

从浏览器导航的整个过程和生命周期可以发现，不管是新开标签页、切换标签页、关闭标签页、在应用中进行新的导航、后退/前进导航以及页面长时间处于非激活的状态，浏览器的内部运行机制都可以很好的管理应用的生命周期，并且会自动处理应用的加载、卸载以及缓存等和导航息息相关的工作。除此之外，在安全隔离方面，浏览器内部还会通过站点隔离（`Renderer` 进程隔离）、跨源隔离、浏览上下文（组）隔离以及 `V8 Isolate` 隔离来处理应用之间的独立运行，保证运行的互不干扰，不仅可以做到应用之间的 `JS` 全局执行上下文、`DOM` 节点和 `CSS` 渲染隔离，还可以防止被恶意网站进行攻击。

### SPA 设计
如果在 `SPA` 模式下加载多个独立的微应用，这些微应用本身将处于同一个 `Renderer` 进程内，并且还会处于同一个浏览上下文和 `V8 Isolate` 中，因此微应用之间无法做到浏览器级别的导航、安全隔离、性能优化以及缓存处理，并且在 `SPA` 模式下多个微应用还可以共存，切换标签页会通过浏览器进行隔离处理，而切换 SPA 的路由则仍然可以使得多个微应用并存。总结来说，在 `SPA` 模式下微应用之间的切换并不是靠 `Browser` 进程进行处理，而是靠 `Renderer` 进程中的 `JavaScript` 逻辑进行处理，此时浏览器内部的运行机制无法起到细粒度的管控作用，需要额外处理以下一些问题：
- **状态**：根据自定义逻辑来管控微应用的状态，包括（预）加载、加载、卸载、（预）渲染等
- **隔离**：在同一个浏览上下文中进行 `DOM` 和 `JS` 隔离
- **性能**：例如支持微应用的预加载、预渲染和缓存，微应用之间的资源共享
- **通信**：如果几个微应用同时并存，如何实现微应用之间的通信

为了使微前端尽可能的模拟浏览器自身的运行机制，需要设计一个通用的 `JavaScript` 框架，这个框架可以协助主应用快速接入并管理不同的微应用，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2398551841.png)

在 `SPA` 模式下主应用主要包含导航和内容设计，通过导航来切换路由，并可以通过微前端框架来控制内容区提供的 `DOM` 容器实现各个微应用的加载和卸载。微前端框架可以像浏览器处理标签页变化（甚至是地址栏的 URL 变化）那样来处理主应用导航的路由变化，从而控制微应用的加载、卸载和缓存处理。在微应用运行的过程中，微前端框架还需要额外处理微应用之间的互相隔离、微应用的性能优化以及通信等，而微应用本身则需要根据微前端框架提供的状态变更来处理自身的加载和卸载等。
::: tip
温馨提示：`JavaScript` 通用库的设计粒度是框架开发者需要考虑的重要问题，例如是否需要使用 `Monorepo` 的设计结构，将上述的几个设计要素进行分包设计，从而方便开发者单独使用这些能力。除此之外，可以在库的基础上进行再次封装，提供一整套的 `React / Vue` 技术栈的解决方案，包括主应用和微应用的开发模板、微应用渲染的封装组件等，这些在后续的工程化课程和解决方案课程中会详细讲解。
::: 

### 状态
`qiankun` 内部的应用状态变更主要依赖 `single-spa`，`single-spa` 框架类似于浏览器应用的生命周期管理。由于应用状态管理本身属于 `JavaScript` 逻辑层面的设计内容，因此会在后续的微前端框架设计中进行详细讲解，在框架原理中不进行过多介绍。

### 隔离
在隔离技术中，本课程会先通过 `V8` 的 `Isolate` 和 `Context` 隔离示例带领大家了解浏览器中 `JavaScript` 的隔离本质。在 `V8` 隔离的基础上，会重点讲解以下几种隔离方案：
- `iframe 隔离`： 空白页`（src="about:blank"） iframe` 隔离和服务端同源的 `iframe` 隔离方案设计。不仅可以利用不同的浏览上下文实现彻底的微应用隔离，与普通 `iframe` 方案而言，还可以解决白屏体验问题，是微前端框架实现隔离的重要手段；
- `iframe + Proxy 隔离`： 解决空白页 `iframe` 隔离无法调用 `history API` 的问题，并可用于解决 `iframe` 方案中无法处理的 URL 状态同步问题；
- `快照隔离`： 浏览器无法兼容 `Proxy` 时，可以通过简单的快照实现 `window` 变量的隔离，但是这种隔离方案限制较多，例如无法实现主子应用的隔离，无法实现多个微应用并存的隔离。当然大多数场景是一个时刻运行一个微应用，因此是一种兼容性良好的隔离方案；
- `CSS 隔离`： 如果主应用和微应用同处于一个 `DOM` 上下文，那么需要考虑 `CSS` 样式的隔离处理。课程中会重点讲解 `Shadow DOM` 实现 `CSS` 隔离的示例以及产生的弊端。

在后续的微前端框架设计课程中，`JS` 隔离会使用 `iframe + Proxy` 以及快照隔离（降级方案）方案进行设计，`CSS` 隔离则不做过多设计，采用 `iframe` 的天然隔离能力。
::: tip
温馨提示：如果要考虑 `iframe` 中的 `Modal` 模态框相对于主应用进行居中处理，通用的微前端框架会考虑将微应用的 `DOM` 渲染放在主应用的 `DOM` 环境中，从而避免在 `iframe` 中渲染 `DOM` 产生的隔离问题。但是这种设计需要额外考虑很多设计因素，例如 `CSS` 样式隔离、`DOM` 卸载时的 `Event` 事件处理等。如果在 `iframe` 中渲染 `DOM` 则可以享受浏览器底层带来的一系列应用周期管理能力。如果不需要考虑实现非常通用的微前端框架，那么可以定制 `Modal` 组件，从而根据业务使其在 `iframe` 中相对于主应用进行居中处理。
:::

### 性能
浏览器和服务器为了提升应用的加载性能，不断的开放了更多相关的功能，包括 `Resource Hints（DNS Prefetch、Preconnect、Prefetch、Prerender）`、`Preload、Early Hints` 等。除此之外，在应用缓存方面还可以做到多级缓存设计，包括 `Memory Cache`、`Service Worker & Cache`、`Disk Cache`、`HTTP 缓存`、 `HTTP2 / Push 缓存`、`CDN 缓存`和`代理缓存`等。除了上述一些功能，还可以从微应用本身出发进行性能优化，包括资源共享、预加载和预渲染等。

### 通信
主子应用之间可以通过观察者模式或者发布订阅模式实现通信，如果是跨域的 `iframe` 则可以通过 `window.postMessage` 实现通信，如果是同域的 `SPA` 应用，则可以通过浏览器原生的 `EventTarget` 或者自定义通信对象。后续会讲解通信方式的实现示例。

## 框架原理：V8 隔离
在介绍动态 `Script` 方案时，需要在全局对象上抛出对应的 `mount` 和 `unmount` 函数，而且内部运行的 `JavaScript` 不建议声明全局属性（采用了立即执行的匿名函数进行作用域的包装处理），否则很容易产生全局变量的命名冲突，从而导致微应用运行出错。为了避免类似的问题，需要考虑微应用之间的 `JavaScript` 隔离。接下来介绍 `V8` 的隔离原理，从而帮助大家更好的了解后续的微应用隔离设计。

在 `SPA` 模式下很容易导致全局变量产生冲突。如果微应用处于 `MPA` 模式，那么 `JS` 可以做到天然隔离，不管是多个标签页之间的应用、标签页和内部的 `iframe` 应用以及同一个 `Renderer` 进程的不同应用，这些都是因为 `Chrome` 浏览器嵌入的 `V8` 引擎本身对 `JS` 的执行上下文做了隔离处理。
::: tip
温馨提示：`Chrome` 中的标签页和内部的 `iframe` 应用、两个不同的标签页应用可能会处于同一个 `Renderer` 进程。
:::
在 `Chrome` 的 `Blink` 渲染引擎中可以通过嵌入 `V8` 来实现 `JS` 代码的解释和执行，因此我们也可以通过类似的方式嵌入 `V8` 来验证上述观点。`V8` 官方提供了 `C++` 的嵌入文档 [Getting started with embedding V8](https://v8.dev/docs/embed)，可以通过官方提供的示例进行简单改造，从而实现如下功能：
- 在同一个 `JS` 上下文中执行两个不同的 `JS` 文件，查看内部的同名全局变量执行情况
- 在不同的 `JS` 上下文中执行 `JS` 文件，查看内部的同名全局变量执行情况
::: tip
温馨提示：如果你对 `C++` 编译不熟悉， 可以先阅读`原理进阶：V8 的嵌入实践`， 重点讲解了 `C++` 的编译工具、多文件开发、`V8` 静态库的编译制作、`V8` 动态库的下载使用等。
:::
官方示例 `hello-world.cc` 将需要执行的 `JavaScript` 固定在 `C++` 代码中，因此每次修改 `JavaScript` 都需要重新编译成可执行的二进制文件。这里对官方示例进行更改，设计一个可以读取 `JS` 文件的 `C++` 代码，将 `JavaScript` 从 `C++` 编译中释放出来：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/80ed26cd7ad6493aa04e61787367b69e~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

在 `main.cpp` 中读取外部的 `JS` 文件进行解释执行，项目的示例结构如下所示：
~~~shell
├── v8                              # 库源码
│   ├── inclide/                    # 头文件
│   │   ├── libplatform/                         
│   │   │   └── libplatform.h        
│   │   └── v8.h                                                
│   └── lib/                        # 动态库
│       ├── libv8.dylib         
│       └── libv8_libplatform.dylib                
├── utils                           # 工具目录
│   ├── file.cpp        
│   ├── file.h
│   └── utils.h                                                                        
├── micro1.js                       # js 文件
├── micro2.js                       # js 文件
└── main.cpp                        # 应用源码
~~~
::: tip
温馨提示：示例源码可以从 `embed-v8` 的 [demo/v8-context](https://github.com/ziyi2/embed-v8/tree/demo/v8-context) 分支获取。由于 `Mac` 存在不同的 `CPU` 架构，建议通过 `Homebrew` 重新下载 `V8` 动态库进行测试，具体可以查看仓库的 `README.md` 说明文件。
:::
`utils` 目录下会实现一个读取 `JS` 文件的工具方法，`utils.h` 是总声明头文件，在 `main.cpp` 中需要引入它，有点类似于 `Web` 前端的某个目录下有一个总的 `index.js` 导出了内部的所有模块：
~~~c++
// utils.h
#ifndef INCLUDE_UTILS_H_
#define INCLUDE_UTILS_H_

#include "file.h"

# endif

// file.h
#ifndef INCLUDE_FILE_H_
#define INCLUDE_FILE_H_

char* readJavaScriptFile(const char* name);

#endif
~~~
`file.h` 声明的 `API` 在 `file.cpp` 中实现，主要用于读取 `JavaScript` 文件的字符串内容：
~~~c++
#include <iostream>
#include <fstream>
#include "file.h"

using namespace std;

// C++ 读写示例：https://cplusplus.com/doc/tutorial/files/
// 查看最后一个示例 Binary files

char* readJavaScriptFile(const char* fileName) {
    
    char* code;

    // 创建一个 ifstream，并打开名为 fileName 的文件
    // fileName 可以是 string 类型，也可以是一个指向字符串存储地址的指针

    // ios::in：打开文件用于读取
    // ios::ate：文件打开后定位到文件末尾
    // 这里的 | 是一个位运算符，表明上述两个操作都要执行
    ifstream file(fileName, ios::in|ios::ate);

    if(file.is_open()) {
        // 由于打开时定位到末尾，因此可以直接获取文件大小
        streampos size = file.tellg();
        // 开辟和文件大小一致的字符串数组空间，从而可以有足够的空间存放文件的字符串内容
        code = new char[size];
        // 重新定位到文件开头
        file.seekg (0, ios::beg);
        // 读取文件的全部内容（通过 size 指定读取的文件大小）
        file.read (code, size);
        // 关闭文件
        file.close();
    }
    
    
    return code;
}
~~~
将 `main.cpp` 中的官方示例进行改造，主要实现如下功能：
- 创建一个 `V8` 上下文，读取并执行 `micro1.js` 和 `micro2.js`
- 创建两个 `V8` 上下文，分别执行 `micro1.js` 和 `micro2.js`

~~~c++
// 包含库的头文件，使用 <>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// 包含自定义的头文件，用 ""
#include "libplatform/libplatform.h"
#include "v8.h"

// 引入自定义的 utils.h 头文件
#include "utils.h"

int main(int argc, char* argv[]) {
  // Initialize V8.
  v8::V8::InitializeICUDefaultLocation(argv[0]);
  v8::V8::InitializeExternalStartupData(argv[0]);
  std::unique_ptr<v8::Platform> platform = v8::platform::NewDefaultPlatform();
  v8::V8::InitializePlatform(platform.get());
  v8::V8::Initialize();

  // Create a new Isolate and make it the current one.
  v8::Isolate::CreateParams create_params;
  create_params.array_buffer_allocator =
      v8::ArrayBuffer::Allocator::NewDefaultAllocator();
  v8::Isolate* isolate = v8::Isolate::New(create_params);
  {
    v8::Isolate::Scope isolate_scope(isolate);

    // Create a stack-allocated handle scope.
    v8::HandleScope handle_scope(isolate);

    /**
     1. 创建一个上下文，执行 micro1.js 和 micro2.js
    */

    {

      // Create a new context.
      // 创建一个上下文
      v8::Local<v8::Context> context = v8::Context::New(isolate);

      // Enter the context for compiling and running the script.
      // 进入该上下文执行 JS 代码
      v8::Context::Scope context_scope(context);

      {
        // 读取当前 main.cpp 同级目录下的 micro1.js 文件
        const char* code = readJavaScriptFile("micro1.js");

        // Create a string containing the JavaScript source code.
        v8::Local<v8::String> source =
            v8::String::NewFromUtf8(isolate, code).ToLocalChecked();

        // Compile the source code.
        v8::Local<v8::Script> script =
            v8::Script::Compile(context, source).ToLocalChecked();

        // Run the script to get the result.
        v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

        // Convert the result to an UTF8 string and print it.
        v8::String::Utf8Value utf8(isolate, result);
        printf("%s\n", *utf8);
      }

      {
        // 读取当前 main.cpp 同级目录下的 micro2.js 文件
        const char* code = readJavaScriptFile("micro2.js");

        // Create a string containing the JavaScript source code.
        v8::Local<v8::String> source =
            v8::String::NewFromUtf8(isolate, code).ToLocalChecked();

        // Compile the source code.
        v8::Local<v8::Script> script =
            v8::Script::Compile(context, source).ToLocalChecked();

        // Run the script to get the result.
        v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

        // Convert the result to an UTF8 string and print it.
        v8::String::Utf8Value utf8(isolate, result);
        printf("%s\n", *utf8);
      }
    }
    
    /**
     2. 创建两个上下文，分别执行 micro1.js 和 micro2.js
    */

    {
      // Create a new context.
      // 创建一个新的上下文
      v8::Local<v8::Context> context = v8::Context::New(isolate);

      // Enter the context for compiling and running the hello world script.
      // 进入新的上下文执行 JS 代码
      v8::Context::Scope context_scope(context);

      // 读取当前 main.cpp 同级目录下的 micro1.js 文件
      const char* code = readJavaScriptFile("micro1.js");

      // Create a string containing the JavaScript source code.
      v8::Local<v8::String> source =
          v8::String::NewFromUtf8(isolate, code).ToLocalChecked();

      // Compile the source code.
      v8::Local<v8::Script> script =
          v8::Script::Compile(context, source).ToLocalChecked();

      // Run the script to get the result.
      v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

      // Convert the result to an UTF8 string and print it.
      v8::String::Utf8Value utf8(isolate, result);
      printf("%s\n", *utf8);
    }

    {
      // Create a new context.
      // 创建一个新的上下文
      v8::Local<v8::Context> context = v8::Context::New(isolate);

      // Enter the context for compiling and running the hello world script.
      // 进入新的上下文执行 JS 代码
      v8::Context::Scope context_scope(context);

      // 读取当前 main.cpp 同级目录下的 micro2.js 文件
      const char* code = readJavaScriptFile("micro2.js");

      // Create a string containing the JavaScript source code.
      v8::Local<v8::String> source =
          v8::String::NewFromUtf8(isolate, code).ToLocalChecked();

      // Compile the source code.
      v8::Local<v8::Script> script =
          v8::Script::Compile(context, source).ToLocalChecked();

      // Run the script to get the result.
      v8::Local<v8::Value> result = script->Run(context).ToLocalChecked();

      // Convert the result to an UTF8 string and print it.
      v8::String::Utf8Value utf8(isolate, result);
      printf("%s\n", *utf8);
    }
  }

  // Dispose the isolate and tear down V8.
  isolate->Dispose();
  v8::V8::Dispose();
  v8::V8::DisposePlatform();
  delete create_params.array_buffer_allocator;
  return 0;
}
~~~
其中 `micro1.js` 和 `micro2.js` 和命名冲突测试中的微应用示例相似，具体代码如下所示：
~~~c++
// micro1.js
var count = 0;
++ count;

// micro2.js
var count;
++ count;
~~~
在 `main.cpp` 中，我们首先创建一个执行上下文，将 `micro1.js` 和 `micro2.js` 都执行一遍，接着我们又各自创建新的执行上下文，分别将 `micro1.js` 和 `micro2.js` 单独执行一遍，查看执行结果：
~~~shell
# 执行
cmake .
# 打印
-- Configuring done
-- Generating done
-- Build files have been written to: /Users/zhuxiankang/Desktop/Github/embed-v8
# 执行
make
# 打印
[ 33%] Building CXX object CMakeFiles/main.dir/main.cpp.o
[ 66%] Building CXX object CMakeFiles/main.dir/utils/file.cpp.o
[100%] Linking CXX executable main
[100%] Built target main
# main 可执行文件生成后，执行
./main

# 同一个执行上下文执行两个 JS 文件
# micro1.js
1
# micro2.js：重复声明的 count 变量无效，直接在 micro1.js 声明的变量上进行 + 1 处理
2

# 不同的执行上下文分别执行 JS 文件
# micro1.js
1
# micro2.js：不受到 micro1.js 的变量影响
NaN
~~~
::: tip
温馨提示：在执行之前需要先编译生成 `main` 可执行文件，查看示例代码的 `README.md`，提供了两种不同的编译方式，方式一使用 `g++` 进行编译，是一种相对原始的编译方式，也是 `V8` 官方使用的方式（你可以简单理解为在 `TypeScript` 中直接使用 `tsc` 进行编译），方式二使用 `CMake` 多文件配置的编译方式（你可以简单理解为使用 `Webpack` 进行编译）。
:::
从上述打印结果可以发现：
- 如果两个 `JS` 文件在相同的全局执行上下文，声明的全局属性会产生覆盖
- 如果两个 `JS` 文件在不同的全局执行上下文，声明的全局属性互不干扰

如果把上述示例中的 `var` 改为 `let` 进行声明处理：
~~~ts
// micro1.js
let count = 0;
++ count;

// micro2.js
let count;
++ count;
~~~
此时重新编译后进行执行，可以发现在同一个执行上下文的 `micro2.js` 会报错：
~~~shell
# 执行
./main

# 同一个执行上下文执行两个 JS 文件
# micro1.js
1
# micro2.js
<unknown>:0: Uncaught SyntaxError: Identifier 'count' has already been declared

#
# Fatal error in v8::ToLocalChecked
# Empty MaybeLocal
#

zsh: trace trap  ./main
~~~
::: tip
温馨提示：可以在 `Chrome` 浏览器中进行测试，会发现同一个执行上下文中行为和嵌入的 `V8` 代码运行一致。
:::
相信很多同学经常会听到全局执行上下文这个概念，在 `V8` 中执行上下文用于隔离不相关的 `JavaScript` 应用，并且这些应用可以处于同一个 `V8` 的 `Isolate` 实例中。那为什么需要在 `V8` 中建立上下文的概念呢？是因为在 `JavaScript` 中提供了很多[内置的工具方法以及对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects)，这些内置对象可以通过 `JavaScript` 运行时进行更改（例如通过原型链进行覆盖，或者声明了一个同名的全局属性），如果两个不相关的 `JavaScript` 应用同时修改了某个全局对象的同名属性，那么很容易产生意想不到的 `Bug`（例如在上述命名冲突的示例中都声明了全局属性 `count`），通过创建不同的全局执行上下文可以解决该问题，这也是不同的 Web 应用可以进行 `JS` 隔离的主要原因。举个例子：
~~~html
<!-- main.html -->
<html>

<body>
    <iframe src="iframe.html"></iframe>
    <script>
        // 当前全局上下文为 main.html 对应的 Context
        var a = 1;
        var iframe = document.querySelector("iframe");
        iframe.onload = function () {
            // 执行 iframe.contentWindow.func 时在全局上下文栈中 push iframe.html 对应的 Context  
            // 当前全局上下文为 iframe.html 对应的 Context
            iframe.contentWindow.func();
            // 执行后在全局上下文栈中 pop iframe.html 对应的 Context  
            // 当前全局上下文为 main.html 对应的 Context
            console.log('main a: ', a); // main a:  1
        }
    </script>
</body>

</html>

<!-- iframe.html -->
<script>
    // 当前全局上下文为 iframe.html 对应的 Context
    var a = 2;
    function func() {
        console.log('iframe a:', a); // iframe a: 2
    }
</script>
~~~
::: tip
温馨提示：参考官方的 [V8 / Contexts](https://v8.dev/docs/embed#contexts) 进行阅读会更加有体感，本质上是 `JS` 全局执行上下文栈的 `PUSH` 和 `POP` 处理。需要注意，上述示例代码因为 `iframe` 和所在 `Web` 应用同源，因此会处于同一个 `Renderer` 进程的同一个主线程，并且会处于同一个 `V8` 的 `Isolate` 实例。
:::
在 `JavaScript` 代码层面感知不到 `Context` 在全局上下文栈中的切换情况，事实上在执行 `main.html` 中的 `JavaScript` 代码时可以简单理解为底层的 `C++` 做了如下操作：
~~~c++
// 在 V8 的隔离实例中创建一个 main.html 对应的上下文
v8::Local<v8::Context> main = v8::Context::New(isolate);
// 在 V8 的隔离实例中创建一个 iframe.html 对应的上下文
v8::Local<v8::Context> iframe = v8::Context::New(isolate);

// 进入 main.html 的 上下文
v8::Context::Scope context_scope(main);

// 编译和执行 main.html 对应的 script 
// ...
// 当执行 iframe.contentWindow.func 时，C++ 中的 V8 会对 contentWindow 属性进行拦截 
// 类似于 Vue 中的数据劫持

// 拦截属性后进行 Context 切换，切换到 iframe.html 对应的 Context
// Context 是一个栈式结构的存储方式，此时栈顶是 iframe.html 对应的 Context

v8::Context::Scope context_scope(iframe);

// iframe.contentWindow 执行完毕后，将 iframe.html 对应的 Context 推出栈顶
// 此时栈顶是 main.html 对应的 Context
~~~
::: tip
温馨提示：关于 `V8` 中 `C++` 代码对 `JavaScript` 属性拦截的操作可以查看 `Interceptors`。想详细了解更多关于 `Web` 应用的全局上下文隔离细节，可以阅读课程`原理进阶：V8 的概念说明`。
:::

### 微应用的 JS 隔离思想
通过 `V8` 隔离的演示说明，可以发现在 `iframe` 方案中，由于 `V8 Context` 的不同，可以做到标签页应用和 `iframe` 应用之间的全局执行上下文隔离，而之前所说的 `NPM` 方案、动态 `Script` 方案以及 `Web Components` 方案，由于各个聚合的微应用处于同一个 `Renderer` 进程的主渲染线程，并且处于同一个 `V8 Isolate` 实例下的同一个 `Context` 中，因此无法通过浏览器的默认能力实现全局执行上下文的隔离。

事实上，`V8` 在运行时隔离方面，主要包括了 `Isolate` 隔离和 `Context` 隔离。
1. `Isolate` 在安全上用于物理空间的隔离，可以防止跨站攻击，有自己的堆内存和垃圾回收器等资源，不同的 `Isolate` 之间的内存和资源相互隔离，它们之间无法共享数据，是非常安全可靠的隔离。
2. 而 `Context` 隔离是指在同一个 `Isolate` 实例中，可以创建不同的 `Context`，这些 `Context` 有自己的全局变量、函数和对象等，默认情况下不同 `Context` 对应的 `JavaScript` 全局上下文无法访问其他全局上下文。

::: tip
需要注意，浏览器目前没有提供 `Web API` 来直接创建新的 `Isolate` 或者 `Context` 隔离 `JavaScript` 运行环境，因此在 SPA 应用中没有直接进行 `JavaScript` 隔离的手段。
:::

在浏览器中可以通过一些额外功能来实现 `JS` 的隔离运行，例如：
- 使用 `WebAssembly` 进行隔离，`WebAssembly` 会被限制运行在一个安全的沙箱执行环境中
- 使用 `Web Worker` 进行隔离，每个 `Worker` 有自己独立的 `Isolate` 实例
- 创建 `iframe` 进行 `Isolate` 或者 `Context` （同一个 `Renderer` 进程）隔离

上述所列举的隔离手段，本质上是利用了浏览器自身的功能特性间接来实现 `JS` 的运行环境隔离。由于是通过浏览器功能间接实现 `JS` 隔离，会受到功能本身的环境特性约束，例如在 `WebAssembly` 运行时不能直接调用 `Web API`，而 `Web Worker` 运行时只能使用部分 `Web API（XMLHttpRequest 和 Web Workers API）`。微应用的 `JS` 本身是为了在 `Renderer` 进程的主线程的 `V8 Isolate` 实例中运行，需要具备完整的 `Web API` 调用能力，这使得 `Web` 微应用需要被隔离的 `JS` 很难运行在这些受到约束的环境中。

当然社区也给出了一些不完美的隔离方案，例如：
- 如果需要使用 `WebAssembly` 进行隔离，需要进行 `Web API` 的桥接和隔离工作，并且为了可以将三方的 `JS` 运行在 `WebAssembly` 的隔离环境中，需要在该环境中提供解释执行 `JS` 的引擎，例如 `QuickJS`、`Duktape`
- 如果需要使用 `Web Worker` 进行隔离，需要实现 `Web` 应用所在的 `Renderer` 执行环境和 `Web Worker` 环境的异步通信能力，从而解决无法在 `Web Worker` 环境中调用完整的 `Web API` 短板，例如 `react-worker-dom`

::: tip
由于微前端中的微应用需要具备 `Renderer` 进程 `UI` 主线程的全部运行环境，因此在后续课程中会重点讲解使用 `iframe` 进行 `JS` 隔离的方案，除此之外，也会在框架源码分析的课程中简单讲解社区框架中的 `JS` 不完全隔离方案（在同一个 `Context` 中通过 `JS` 特性实现隔离）。
:::


## 框架原理:iframe 隔离
在 `V8` 隔离中我们知道了 `Isolate` 以及 `Context` 的概念，这也是 `V8` 实现 `JS` 执行上下文隔离的重要能力。接下来我们主要了解如何利用 `iframe` 实现在 `SPA` 模式下的 `Context` 隔离思路，从而帮助大家更好的理解 `JS` 隔离。

### 隔离思路








