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
    "build": "vue-cli-service build --target lib --name vue-app --inline-vue src/main.js"
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
            break;
          case "y":
            window.yMount("#micro-app-slot");
            window.xUnmount();
            break;
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
~~~c
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
~~~c
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

~~~c
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
~~~c
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
~~~
~~~ts
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
<html lang="zh">

<body>
    <iframe src="iframe.html"></iframe>
    <script>
        // 当前全局上下文为 main.html 对应的 Context
        let a = 1;
        let iframe = document.querySelector("iframe");
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
    let a = 2;
    function func() {
        console.log('iframe a:', a); // iframe a: 2
    }
</script>
~~~
::: tip
温馨提示：参考官方的 [V8 / Contexts](https://v8.dev/docs/embed#contexts) 进行阅读会更加有体感，本质上是 `JS` 全局执行上下文栈的 `PUSH` 和 `POP` 处理。需要注意，上述示例代码因为 `iframe` 和所在 `Web` 应用同源，因此会处于同一个 `Renderer` 进程的同一个主线程，并且会处于同一个 `V8` 的 `Isolate` 实例。
:::
在 `JavaScript` 代码层面感知不到 `Context` 在全局上下文栈中的切换情况，事实上在执行 `main.html` 中的 `JavaScript` 代码时可以简单理解为底层的 `C++` 做了如下操作：
~~~c
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


## 框架原理：iframe 隔离
在 `V8` 隔离中我们知道了 `Isolate` 以及 `Context` 的概念，这也是 `V8` 实现 `JS` 执行上下文隔离的重要能力。接下来我们主要了解如何利用 `iframe` 实现在 `SPA` 模式下的 `Context` 隔离思路，从而帮助大家更好的理解 `JS` 隔离。

### 隔离思路
在动态 `Script` 方案中，我们发现在同一个全局执行上下文加载不同微应用的 `JS` 进行执行时，由于没有隔离措施，很容易导致微应用产生 `JS` 运行时冲突。

在 `V8` 的隔离中我们了解到可以通过创建不同的 `Isolate` 或者 `Context` 对 `JS` 代码进行上下文隔离处理，但是这种能力没有直接开放给浏览器，因此我们无法直接利用 `Web API` 在动态 `Script` 方案中实现微应用的 `JS` 隔离。

同时我们了解到在浏览器中创建 `iframe` 时会创建相应的全局执行上下文栈，用于切换主应用和 `iframe` 应用的全局执行上下文环境，因此可以通过在应用框架中创建空白的 `iframe` 来隔离微应用的 `JS` 运行环境。

为此，我们大致可以做如下几个阶段的隔离尝试：
- 阶段一：加载空白的 `iframe` 应用，例如 `src="about:blank"`，生成新的微应用执行环境
  - 解决全局执行上下文隔离问题
  - 解决加载 `iframe` 的白屏体验问题

- 阶段二：加载同源的 `iframe` 应用，返回空的内容，生成新的微应用执行环境
  - 解决全局执行上下文隔离问题
  - 解决加载 `iframe` 的白屏体验问题
  - 解决数据状态同步问题
  - 解决前进后退问题

接下来将实现上述两个阶段的隔离能力。

### 阶段一：空白页隔离
在动态 `Script` 方案中，微应用的 `JS` 运行在主应用的 `Renderer UI` 线程中（通过 `Script` 标签进行加载执行），这会导致微应用和主应用共享**一个 JS 执行环境**而产生**全局属性冲突**。

为了解决冲突问题，当时采用了立即执行的匿名函数来创建各自执行的作用域，但是没有在本质上隔离全局执行上下文（**例如原型链**），接下来我们重新设计一个 `iframe` 隔离方案，使微应用和主应用彼此可以真正隔离 `JS` 的运行环境。具体方案如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/d172ebbed9464e49a1d7f2c39f5e935a~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

大致实现的思路如下所示：
- 通过请求获取后端的微应用列表数据，动态创建主导航
- 根据导航切换微应用，切换时会跨域请求微应用 `JS` 的文本内容并进行缓存处理
- 微应用的 `JS` 会在 `iframe` 环境中通过 `Script` 标签进行隔离执行

导航的两个按钮（微应用导航）根据后端数据动态渲染，点击按钮后会跨域请求微应用的 `JS` 静态资源并创建空白的 `iframe` 进行隔离执行

文件的结构目录如下所示：
~~~shell
├── public                  # 托管的静态资源目录
│   ├── main/               # 主应用资源目录                        
│   │   └── index.html                                        
│   └── micro/              # 微应用资源目录
│        ├── micro1.js        
│        └── micro2.js      
├── config.js               # 公共配置
├── main-server.js          # 主应用服务
└── micro-server.js         # 微应用服务
~~~
`iframe` 隔离中获取微应用 `JS` 进行执行的方式和动态 `Script` 的方案存在差异
- 在动态 `Script` 的方案中利用浏览器内置的 `<script>` 标签进行请求和执行，天然支持跨域。
- 而在 `iframe` 隔离中需要通过 `Ajax` 的形式获取 `JS` 文件进行手动隔离执行。
  
由于微应用和主应用跨域，因此需要微应用的服务支持跨域请求，具体如下所示：
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();

const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

// 设置支持跨域请求头（也可以使用 cors 中间件）
// 这里设置了所有请求的跨域支持，也可以单独对 express.static 设置跨域响应头
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Allow", "GET, POST, OPTIONS");
  next();
});

app.use(
  express.static(path.join("public", "micro"))
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
在动态 `Script` 的微应用设计中，必须通过立即执行的匿名函数进行作用域隔离，为了验证 `iframe` 隔离的效果，这里把立即执行的匿名函数去除：
~~~ts
// public/micro/micro1.js
let root;
root = document.createElement("h1");
root.textContent = "微应用1";
document.body.appendChild(root);
~~~
~~~ts
// public/micro/micro2.js
let root;
root = document.createElement("h1");
root.textContent = "微应用2";
document.body.appendChild(root);
~~~
如果是在动态 `Script` 的方案下，上述 `micro1.js` 和 `micro2.js` 由于都是在主应用的全局执行上下文中执行，会产生属性命令冲突。这里通过空白的 `iframe` 来建立完整的隔离执行环境，具体实现如下所示：
~~~html
<!-- public/main/index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>

  <body>
    <h1>Hello，Sandbox Script!</h1>

    <!-- 主应用导航 -->
    <div id="nav"></div>

    <!-- 主应用内容区 -->
    <div id="container"></div>

    <script type="text/javascript">
      // 隔离类
      class MicroAppSandbox {
        // 配置信息
        options = null;
        // iframe 实例
        iframe = null;
        // iframe 的 Window 实例
        iframeWindow = null;
        // 是否执行过 JS
        exec = false;

        constructor(options) {
          this.options = options;
          // 创建 iframe 时浏览器会创建新的全局执行上下文，用于隔离主应用的全局执行上下文
          this.iframe = this.createIframe();
          this.iframeWindow = this.iframe.contentWindow;
        }

        createIframe() {
          const { rootElm, id, url } = this.options;
          const iframe = window.document.createElement("iframe");
          // 创建一个空白的 iframe
          const attrs = {
            src: "about:blank",
            "app-id": id,
            "app-src": url,
            style: "border:none;width:100%;height:100%;",
          };
          Object.keys(attrs).forEach((name) => {
            iframe.setAttribute(name, attrs[name]);
          });
          rootElm?.appendChild(iframe);
          return iframe;
        }

        // 激活
        active() {
          this.iframe.style.display = "block";
          // 如果已经通过 Script 加载并执行过 JS，则无需重新加载处理
          if(this.exec) return;
          this.exec = true;
          const scriptElement = this.iframeWindow.document.createElement('script');
          scriptElement.textContent = this.options.scriptText;
          this.iframeWindow.document.head.appendChild(scriptElement);
        }

        // 失活
        // INFO: JS 加载以后无法通过移除 Script 标签去除执行状态
        // INFO: 因此这里不是指代失活 JS，如果是真正想要失活 JS，需要销毁 iframe 后重新加载 Script
        inactive() {
          this.iframe.style.display = "none";
        }

        // 销毁隔离实例
        destroy() {
          this.options = null;
          this.exec = false;
          if(this.iframe) {
            this.iframe.parentNode?.removeChild(this.iframe);
          }
          this.iframe = null;
        }
      }

      // 微应用管理
      class MicroApp {
        // 缓存微应用的脚本文本（这里假设只有一个执行脚本）
        scriptText = "";
        // 隔离实例
        sandbox = null;
        // 微应用挂载的根节点
        rootElm = null;

        constructor(rootElm, app) {
          this.rootElm = rootElm;
          this.app = app;
        }

        // 获取 JS 文本（微应用服务需要支持跨域请求获取 JS 文件）
        async fetchScript(src) {
          try {
            const res = await window.fetch(src);
            return await res.text();
          } catch (err) {
            console.error(err);
          }
        }

        // 激活
        async active() {
          // 缓存资源处理
          if (!this.scriptText) {
            this.scriptText = await this.fetchScript(this.app.script);
          }

          // 如果没有创建隔离实例，则实时创建
          // 需要注意只给激活的微应用创建 iframe 隔离，因为创建 iframe 会产生内存损耗
          if (!this.sandbox) {
            this.sandbox = new MicroAppSandbox({
              rootElm: this.rootElm,
              scriptText: this.scriptText,
              url: this.app.script,
              id: this.app.id,
            });
          }

          this.sandbox.active();
        }

        // 失活
        inactive() {
          this.sandbox?.inactive();
        }
      }

      // 微前端管理
      class MicroApps {
        // 微应用实例映射表
        appsMap = new Map();
        // 微应用挂载的根节点信息
        rootElm = null;

        constructor(rootElm, apps) {
          this.rootElm = rootElm;
          this.setAppMaps(apps);
        }

        setAppMaps(apps) {
          apps.forEach((app) => {
            this.appsMap.set(app.id, new MicroApp(this.rootElm, app));
          });
        }

        // TODO: prefetch 微应用
        prefetchApps() {}

        // 激活微应用
        activeApp(id) {
          const app = this.appsMap.get(id);
          app?.active();
        }

        // 失活微应用
        inactiveApp(id) {
          const app = this.appsMap.get(id);
          app?.inactive();
        }
      }

      // 主应用管理
      class MainApp {
        microApps = [];
        microAppsManager = null;

        constructor() {
          this.init();
        }

        async init() {
          this.microApps = await this.fetchMicroApps();
          this.createNav();
          this.navClickListener();
          this.hashChangeListener();
          // 创建微前端管理实例
          this.microAppsManager = new MicroApps(
            document.getElementById("container"),
            this.microApps
          );
        }

        // 从主应用服务器获请求微应用列表信息
        async fetchMicroApps() {
          try {
            const res = await window.fetch("/microapps", {
              method: "post",
            });
            return await res.json();
          } catch (err) {
            console.error(err);
          }
        }

        // 根据微应用列表创建主导航
        createNav(microApps) {
          const fragment = new DocumentFragment();
          this.microApps?.forEach((microApp) => {
            // TODO: APP 数据规范检测 (例如是否有 script）
            const button = document.createElement("button");
            button.textContent = microApp.name;
            button.id = microApp.id;
            fragment.appendChild(button);
          });
          nav.appendChild(fragment);
        }

        // 导航点击的监听事件
        navClickListener() {
          const nav = document.getElementById("nav");
          nav.addEventListener("click", (e) => {
            // 并不是只有 button 可以触发导航变更，例如 a 标签也可以，因此这里不直接处理微应用切换，只是改变 Hash 地址
            // 不会触发刷新，类似于框架的 Hash 路由
            window.location.hash = event?.target?.id;
          });
        }

        // hash 路由变化的监听事件
        hashChangeListener() {
          // 监听 Hash 路由的变化，切换微应用（这里设定一个时刻只能切换一个微应用）
          window.addEventListener("hashchange", () => {
            this.microApps?.forEach(async ({ id }) => {
              id === window.location.hash.replace("#", "")
                ? this.microAppsManager.activeApp(id)
                : this.microAppsManager.inactiveApp(id);
            });
          });
        }
      }

      new MainApp();
    </script>
  </body>
</html>
~~~
上述示例中主要设计了几个类，具体的功能如下所示：
- **MainApp**：负责管理主应用，包括获取微应用列表、创建微应用的导航、切换微应用
- **MicroApps**：负责维护微应用列表，包括预加载、添加和删除微应用等
- **MicroApp**：负责维护微应用，包括请求和缓存静态资源、激活微应用、状态管理等
- **MicroAppSandbox**：负责维护微应用隔离，包括创建、激活和销毁隔离实例等

**使用该隔离方案不仅仅可以解决动态 Script 方案无法解决的全局执行上下文隔离问题（包括 CSS 隔离），还可以通过空闲时间预获取微应用的静态资源来加速 iframe 内容的渲染，从而解决原生 iframe 产生的白屏体验问题。** 除此之外，使用 `src=about:blank` 会使当前 `iframe` 继承父浏览上下文的源，从而会遵循同源策略：
~~~ts
// iframe src: about:blank 
// 嵌入一个遵从同源策略的空白页：https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/iframe
// 源的继承：在页面中通过 about:blank 或 javascript: URL 执行的脚本会继承打开该 URL 的文档的源，因为这些类型的 URL 没有包含源服务器的相关信息：https://developer.mozilla.org/zh-CN/docs/Web/Security/Same-origin_policy#%E6%BA%90%E7%9A%84%E7%BB%A7%E6%89%BF
console.log(window.document.domain === window.parent.document.domain);  // true
~~~
因此在 `iframe` 中可以像动态 `Script` 脚本一样发起 `Ajax` 请求，例如：
~~~ts
// 可以请求主应用服务所在的接口，因为继承了主应用的源
var oReq = new XMLHttpRequest();
oReq.addEventListener("load", reqListener);
oReq.open("POST", "/microapps");
oReq.send();
function reqListener() {
  console.log(this.responseText);
}
~~~
需要注意，将 `iframe` 设置成 `src=about:blank` 会产生一些限制，例如在 `Vue` 中使用 `Vue-Router` 时底层框架源码会用到 `history.pushState` 或者 `history.replaceState`，此时会因为 `about:blank` 而导致 `iframe` 无法正常运行，例如：
~~~ts
// 在微应用的 micro1.js 中运行如下代码会 产生 history 报错
window.history.pushState({ key: "hello" }, "", "/test");
~~~

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3546608134.png)

使用 `history` 更改 `URL` 时可以保持页面无刷（不会发起服务请求，除非手动刷新页面），但是必须使新的 `URL` 和当前 `URL` 同源，否则就会抛出上述异常。此时很多同学可能会联想到 `SPA` 应用的路由，在 `Vue` 或者 `React` 框架中，路由可以分为 `hash` 模式或者 `history` `模式，hash` 模式本质使用 `window.location.hash` 进行处理，而 `history` 模式本质使用 `history.pushState` 或者 `history.replaceState` 进行处理。如果使用路由模式在空白的 `iframe` 中运行，会使得框架出错。

### 阶段二：同源 iframe 隔离
使用 `about:blank` 会导致 `history` 无法正常工作，因此可以在空白页的基础上进行改造，例如在主应用的服务中提供一个空白的 `HTML` 页面，可用于 `iframe` 的请求加载，从而保持和主应用完全同域。具体方案如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/0feba6f1a3774b78a539d440f5c0ed67~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

大致实现的思路如下所示：
- 通过请求获取后端的微应用列表数据，动态创建主导航
- 根据导航切换微应用，切换时会跨域请求微应用 `JS` 的文本内容并进行缓存处理
- 切换微应用的同时创建一个同域的 `iframe` 应用，请求主应用下空白的 `HTML` 进行渲染
- `DOM` 渲染完成后，微应用的 `JS` 会在 `iframe` 环境中通过 `Script` 标签进行隔离执行

导航的两个按钮（微应用导航）根据后端数据动态渲染，点击按钮后会跨域请求微应用的 `JS` 静态资源并创建同域的 `iframe` 进行隔离执行

文件的结构目录如下所示：
~~~shell
├── public                  # 托管的静态资源目录
│   ├── main/               # 主应用资源目录      
│   │   ├── blank.html      # 用于 iframe 应用进行空白页渲染                          
│   │   └── index.html                                        
│   └── micro/              # 微应用资源目录
│        ├── micro1.js        
│        └── micro2.js      
├── config.js               # 公共配置
├── main-server.js          # 主应用服务
└── micro-server.js         # 微应用服务
~~~
相对于空白页隔离，`iframe` 同源隔离需要在主应用中提供一个空白的 `HTML` 页面，从而可以使 `iframe` 和主应用完全同域，具体的改动主要是 `MicroAppSandbox` 类：
~~~ts
  // 隔离类
  class MicroAppSandbox {
    // 配置信息
    options = null;
    // iframe 实例
    iframe = null;
    // iframe 的 Window 实例
    iframeWindow = null;
    // 是否执行过 JS
    exec = false;
    // iframe 加载延迟执行标识
    iframeLoadDeferred = null;

    constructor(options) {
      this.options = options;
      // 创建 iframe 时浏览器会创建新的全局执行上下文，用于隔离主应用的全局执行上下文
      this.iframe = this.createIframe();
      this.iframeWindow = this.iframe.contentWindow;
      this.iframeLoadDeferred = this.deferred();
      this.iframeWindow.onload = () => {
        // 用于等待 iframe 加载完成
        this.iframeLoadDeferred.resolve();
      };
    }

    deferred() {
      const deferred = Object.create({});
      deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
      });
      return deferred;
    }

    createIframe() {
      const { rootElm, id, url } = this.options;
      const iframe = window.document.createElement("iframe");
      const attrs = {
        // 请求主应用服务下的 blank.html（保持和主应用同源）
        src: "blank.html",
        "app-id": id,
        "app-src": url,
        style: "border:none;width:100%;height:100%;",
      };
      Object.keys(attrs).forEach((name) => {
        iframe.setAttribute(name, attrs[name]);
      });
      rootElm?.appendChild(iframe);
      return iframe;
    }

    // 激活
    async active() {
      this.iframe.style.display = "block";
      // 如果已经通过 Script 加载并执行过 JS，则无需重新加载处理
      if (this.exec) return;
      // 延迟等待 iframe 加载完成（这里会有 HTML 请求的性能损耗，可以进行优化处理）
      await this.iframeLoadDeferred.promise;
      this.exec = true;
      const scriptElement =
        this.iframeWindow.document.createElement("script");
      scriptElement.textContent = this.options.scriptText;
      this.iframeWindow.document.head.appendChild(scriptElement);
    }

    // 失活
    // INFO: JS 加载以后无法通过移除 Script 标签去除执行状态
    // INFO: 因此这里不是指代失活 JS，如果是真正想要失活 JS，需要销毁 iframe 后重新加载 Script
    inactive() {
      this.iframe.style.display = "none";
    }

    // 销毁
    destroy() {
      this.options = null;
      this.exec = false;
      if (this.iframe) {
        this.iframe.parentNode?.removeChild(this.iframe);
      }
      this.iframe = null;
      this.iframeWindow = null;
    }
  }
~~~
此时由于和主应用完全同源，在微应用的 `Vue` 或者 `React` 中使用路由调用 `history` 不会存在异常问题，并且浏览器的前进和后退按钮都可以正常工作。

至此 `iframe` 隔离的基本功能已经完成，需要注意该隔离示例只是用于理解隔离的简单示例，真正在生产环境使用时，还需要考虑如下设计：
- 主应用刷新时，`iframe` 微应用无法保持自身 `URL` 的状态
- 主应用和 `iframe` 微应用处于不同的浏览上下文，无法使 `iframe` 中的模态框 `Modal` 相对于主应用居中
- 主子应用的通信处理以及持久化数据的隔离处理
- 解决主应用空白 `HTML` 请求的性能优化处理（例如 `GET` 请求空内容、请求渲染时中断请求等）

::: tip
温馨提示：关于模态框居中的问题，如果主应用本身只是一层壳子，只包含了应用顶部和左侧菜单信息，微应用渲染的区域占据了主要的空间，那么模态框居中的问题可以被忽略。当然，如果要使的微应用中的模态框完全居中，可以在微应用中对模态框的位置进行调整，从而适配成相对于主应用进行居中展示。
:::
需要注意，采用 `iframe` 隔离和之前讲解的 `iframe` 方案是有差异的，具体优势在于：
- 可以持续优化白屏体验
- 可以实现 URL 状态同步
- 可以额外处理浏览上下文隔离
- 同域带来的便利性（应用免登、数据共享、通信等）

感兴趣的同学可以在隔离示例的基础上进行设计，上述未完成的设计可以根据业务的需求进行不同方案的设计考虑。以模态框无法居中的情况为例，可以在已有模态框组件的基础上进行再次封装，从而使其可以适配隔离方案相对于主应用居中。当然如果想要真正实现天然居中，也可以考虑在 `iframe` 外进行 `DOM` 渲染（感兴趣的同学可以思考一下大致的实现思路），从而保持和主应用完全一致的 `DOM` 环境，当然此种方案还需要额外考虑 `CSS` 的隔离问题，如果不是为了实现非常通用的微前端框架，个人觉得会有一些得不偿失的感觉。

## 框架原理：iframe + Proxy 隔离
上一节我们了解了 `src = about:blank` 的 `iframe` 隔离和同源的 `iframe` 隔离，后者需要服务端提供空白页或者服务接口才能实现，并且请求本身也会产生性能损耗，如果能够解决前者隔离的 `history` 运行问题，那么可以减少服务接口和网络请求，从而达到隔离效果。本课程会重点讲解如何解决 `src = about:blank` 的 `iframe` 隔离的运行问题。

### 隔离思路
在 `iframe` 中可以创建新的全局执行上下文从而和主应用彻底隔离，因此我们可以将 `iframe` 创建的 `window` 对象作为微应用的全局对象，从而实现应用之间 `JS` 的彻底隔离，但是在之前的 `iframe` 隔离设计中还存在以下问题没有解决：
- `src = about:blank` 的 `iframe` 隔离的 `history` 无法正常工作，框架的路由功能丢失
- 虽然 `DOM` 环境天然隔离，却无法使得 `iframe` 中的 `Modal` 相对于主应用居中
- 主应用和微应用的 `URL` 状态没有同步

同源的 `iframe` 方案虽然能解决 `history` 运行的问题，但是需要主应用额外提供服务接口，对于框架设计而言并不是特别通用（如果业务本身能够支持，那么这种方案是非常不错的选择）。我们可以换个方式思考一下，是否可以将 `src = about:blank` 的 `iframe` 隔离的 `history` 使用主应用的 `history` 代替运行，这样带来的好处如下：
- 不同微应用可以拥有各自 `iframe` 对应的全局上下文执行环境，可以实现 `JS` 的彻底隔离
- 使用主应用的 `history`，`iframe` 可以设置成 `src = about:blank`，不会产生运行时错误
- 使用主应用的 `history，未来可以处理主应用和微应用的历史会话同步问题`

为了实现上述思路，可以使用 `Proxy` 对 `iframe` 的 `window` 对象进行拦截处理，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/69730bd61316495ab5c9b511c2c1425d~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

::: tip
温馨提示：真正要实现会话同步还需要考虑主子应用之间的路由冲突问题。

除此之外，如果要实现 `iframe` 中的模态框相对于主应用进行居中，可以在设计时将微应用的 `document` 代理成主应用 `document`，并且将需要渲染的微应用内容放在主应用的 `DOM` 环境中。当然这种方式解除了 `iframe` 中 `DOM` 天然隔离的限制，并且可以使得微应用任意修改主应用的 `DOM` 环境，而且还需要额外处理 `DOM` 的副作用（例如移除微应用时需要清空相应的 `DOM` 事件）以及 `CSS` 隔离问题，如果考虑不够完善，很容易产生意想不到的 `Bug`。
:::
为了实现该代理功能，接下来需要额外了解一些 `JavaScript` 的语言特性，从而帮助大家更好的理解方案设计。

### Proxy 代理
`Proxy` 可以对需要访问的对象进行拦截，并可以通过拦截函数对返回值进行修改，这种特性可以使我们在微应用中访问 `window` 对象的属性时，返回定制化的属性值，例如：
~~~ts
const iframe = document.createElement("iframe");
// 设置成 about:blank 后和主应用同源
iframe.src = "about:blank";
// 这里只用于演示 JS 运行，暂时不考虑加载微应用的 DOM，可以隐藏 iframe 处理
iframe.style = "display: none";
document.body.appendChild(iframe);

// iframe.contentWindow： iframe 的 window 对象
iframe.contentWindow.proxy = new Proxy(iframe.contentWindow, {
  get: (target, prop) => {
    console.log("[proxy get 执行] 拦截的 prop: ", prop);
    // 访问微应用的 window.history 时，返回主应用的 history
    if (prop === "history") {
      return window[prop];
    }
    // target 是被代理的 iframe.contentWindow
    // 除了 history，其余都返回 iframe 上 window 的属性值
    return target[prop];
  },

  set: (target, prop, value) => {
    console.log("[proxy set 执行] 拦截的 prop: ", prop);
    target[prop] = value;
  },
});

function execMicroCode() {
  // microCode 可以视为通过请求获取的微应用的 JS 脚本文本（不包括立即执行的匿名函数）
  // 在微应用中执行的 window，就是主应用中执行的 iframe.contentWindow
  // window.proxy 指的是已经设置了代理的 iframe.contentWindow.proxy
  const microCode = `(function(window){

  // 在立即执行的匿名函数中 window.proxy 作为形参被传入
  // 内部使用的 window 本质上是 iframe.contentWindow 的代理对象
  // 任何 window 属性访问和设置都会触发 Proxy 的 get 和 set 拦截行为
  
  // 访问 window.a 触发 Proxy 的 get，本质上读取的是 iframe.contentWindow 的 a 属性值
  // 打印信息 
  // [proxy get 执行] 拦截的 prop:  a
  // [微应用执行] window.a:  undefined
  console.log('[微应用执行] window.a: ', window.a);
  
  // 访问 window.history 触发 Proxy 的 get，本质上读取的是主应用的 history 对象
  // 访问 window.parent 触发 Proxy 的 get，本质上读取的是微应用的 iframe.contentWindow.parent 对象
  // 打印信息 
  // [proxy get 执行] 拦截的 prop:  history
  // [proxy get 执行] 拦截的 prop:  parent
  // [微应用执行] 是否是主应用的 history： true
  console.log('[微应用执行] 是否是主应用的 history：', window.history === window.parent.history);
  
  // 访问 window.history 触发 Proxy 的 get，本质上读取的是主应用的 history 对象
  // 打印信息 
  // [proxy get 执行] 拦截的 prop:  history
  window.history.pushState({}, '', '/micro');
  
  // 设置 window.a 触发 Proxy 的 set，本质上设置的是 iframe.contentWindow 的 a 属性值
  // 打印信息 
  // [proxy set 执行] 拦截的 prop:  a
  window.a = 2;
  
  // 访问 window.a 触发 Proxy 的 get，本质上读取的是 iframe.contentWindow 的 a 属性值
  // 打印信息 
  // [proxy get 执行] 拦截的 prop:  a
  // [微应用执行] window.a:  2
  console.log('[微应用执行] window.a: ', window.a);

})(window.proxy)`;

  const scriptElement =
    iframe.contentWindow.document.createElement("script");
  scriptElement.textContent = microCode;
  // 添加内嵌的 script 元素时会自动触发 JS 的解析和执行
  iframe.contentWindow.document.head.appendChild(scriptElement);
}

// 主应用的 window.a 设置为 1
window.a = 1;

// 执行微应用的代码，此时微应用中的 window 使用了 iframe 的 window 进行代理，不会受到主应用的 window 影响
execMicroCode();

// 主应用的 window 不会受到微应用的影响，输出为 1
// 控制台打印信息 [主应用执行] window.a:  1
console.log('[主应用执行] window.a: ', window.a);
~~~
::: tip
温馨提示：这里立即执行的匿名函数本质上不是为了隔离微应用的执行作用域，因为微应用都运行在 `iframe` 中，已经天然做到了完全隔离，这里的作用是为了通过传入形参的方式改变内部使用的 `window` 变量。
:::
从下图打印的信息可以可以发现， `history` 被正确的进行了代理，并且主应用和微应用由于使用了不同的全局执行上下文，形成了非常彻底的隔离效果：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/b64128270d304e23800ab34d34a3e63b~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

::: tip
温馨提示：从红框部分可以发现，尽管 `iframe` 设置成了 `src=about:blank`，但是由于微应用使用了主应用的 `history` 执行，使得主应用的 `URL` 发生了变化。这里只是演示了主子应用共用 `history` 的情况，真正在设计时还需要考虑处理主子应用以及子应用之间在使用 `Vue` 或者 `React` 框架时的路由嵌套以及冲突问题。
:::
在 `iframe` 隔离中我们知道设置 `src=about:blank` 会使得 `history` 无法正常工作，例如修改上述示例：
~~~ts
function execMicroCode() {
  
  const microCode = `(function(window){

      // 省略微应用执行的代码

   // window 指的是 iframe.contentWindow，注意传入的参数不是 winwow.proxy
   })(window)`;
}
~~~
如果不使用 `Proxy` 进行代理，那么 `window.history` 访问的是 `iframe` 的 `history`，此时页面会无法正常工作：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/7f18c1c432524e9c999735931325c9d2~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

需要注意以下场景无法被 `Proxy` 的 `set` 拦截，通过 `get` 拦截获取属性值时部分场景无法达到预期的效果：
~~~ts
function execMicroCode() {
    
  // 注意传入了第二个参数 contentWindow，这是没有被代理的 iframe 的 window 对象
  const microCode = `(function(window, contentWindow){

    // 没有触发 Proxy 的 set 函数，由于在立即执行的匿名函数中执行 var，此时不是全局变量
    var a = 2;
    
    // 触发 Proxy 的 get
    // 打印信息 
    // [proxy get 执行] 拦截的 prop:  a
    // [微应用执行] window.a:  undefined
    console.log('[微应用执行] window.a: ', window.a);
    
    // 没有触发 Proxy 的 set 函数，因为 this 指代的是没有被代理的 iframe 的 window 对象
    this.a = 2;
    
    // 打印信息 
    // [proxy get 执行] 拦截的 prop:  parent
    // [微应用执行] this 是否是主应用的 window:  false
    console.log('[微应用执行] this 是否是主应用的 window: ', this === window.parent);
    
    // 打印信息 
    // [微应用执行] this 是否是子应用的 window:  true
    console.log('[微应用执行] this 是否是子应用的 window: ', this === contentWindow);
    
    // 打印信息 
    // [proxy get 执行] 拦截的 prop:  a
    // [微应用执行] window.a:  2
    console.log('[微应用执行] window.a: ', window.a);
    
    // 没有触发 Proxy 的 set 函数，因为属性挂载在没有被代理的 iframe 的 window 对象
    b = 2;
    
    // 打印信息 
    // [proxy get 执行] 拦截的 prop:  b
    // [微应用执行] window.b:  2
    console.log('[微应用执行] window.b: ', window.b);
    
    })(window.proxy, window)`;

  const scriptElement =
    iframe.contentWindow.document.createElement("script");
  scriptElement.textContent = microCode;
  // 添加内嵌的 script 元素时会自动触发 JS 的解析和执行
  iframe.contentWindow.document.head.appendChild(scriptElement);
}

// 省略其余代码

// 控制台打印信息 [主应用执行] window.a:  1
console.log('[主应用执行] window.a: ', window.a);
// 控制台打印信息 [主应用执行] window.b:  undefined
console.log('[主应用执行] window.b: ', window.b);
~~~
从下图打印的信息可以可以发现， 在立即执行匿名函数中的 `var` 声明没有被拦截，这和微应用独立运行的结果不一致。而 `this` 赋值和未限定标识符变量时，可以正确设置 `window` 属性，但是没有通过 `Proxy` 代理，因为赋值行为不是发生在代理的 `window` 对象上，而是发生在没有被代理的 `window` 对象上：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/64cbfa652ecc404fbc06c5a0c980a50b~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

如果希望 `this` 也可以受到 `Proxy` 代理的管控，那么可以重新绑定 `this` 的指向：
~~~ts
function execMicroCode() {
    
    // 注意传入了第二个参数 contentWindow，这是没有被代理的 iframe 的 window 对象
    const microCode = `(function(window, contentWindow){
      
      // 打印信息 
      // [proxy set 执行] 拦截的 prop:  a
      this.a = 2;
      
      // 打印信息 
      // [proxy get 执行] 拦截的 prop:  parent
      // this 是否是主应用的 window:  false
      console.log('[微应用执行] this 是否是主应用的 window: ', this === window.parent);
      
      // 打印信息 
      // [微应用执行] this 是否是子应用的 window:  true
      console.log('[微应用执行] this 是否是子应用的 window: ', this === contentWindow);
      
      // 打印信息 
      // [proxy get 执行] 拦截的 prop:  proxy
      // [微应用执行] this 是否是子应用的 window.proxy:  true
      console.log('[微应用执行] this 是否是子应用的 window.proxy: ', this === window.proxy);

    // 将内部的 this 指向 window 的代理对象
    }).bind(window.proxy)(window.proxy, window)`;
  
    const scriptElement =
      iframe.contentWindow.document.createElement("script");
    scriptElement.textContent = microCode;
    // 添加内嵌的 script 元素时会自动触发 JS 的解析和执行
    iframe.contentWindow.document.head.appendChild(scriptElement);
}
~~~
因此具备了上述的 `iframe + Proxy` 隔离设计后：
- 可以解决 `JS` 运行环境的隔离问题，当然除了 `history` 故意不进行隔离
- 微应用在使用 `var` 时需要挂载在全局对象上的能力缺失
- 可以解决微应用之间的全局属性隔离问题，包括使用未限定标识符的变量、`this`
- 使用 `this` 时访问是 `iframe` 的 `window` 代理对象，可以和主应用的 `this` 隔离
- 可以解决 `iframe` 隔离中无法进行 `history` 操作和同步的问题

::: tip
温馨提示：可以将 `Proxy` 理解为微应用隔离的逃生窗口，在上述设计中可以将 `history` 理解为隔离的白名单，在后续的设计中需要精细化考虑子应用的 `history` 操作不能对主应用产生额外的影响。
:::

### Proxy + With
基于上述的 `Proxy` 示例，我们会发现微应用中的 `var` 在主应用中运行时无法挂载在全局属性上。除此之外，我们单独使用 `history` 而不是 `window.history` 进行访问时也无法进行拦截：
~~~ts
 const microCode = `(function(window){
    // 没有触发 Proxy 的 set 函数，由于在立即执行的匿名函数中执行 var，此时不是全局变量
    var a = 2;
    
    // 触发 Proxy 的 get
    
    // 打印信息 
    // [proxy get 执行] 拦截的 prop:  a
    // [微应用执行] window.a:  undefined
    console.log('[微应用执行] window.a: ', window.a);
    
    // window.history.pushState({}, '', '/micro');
    // 如果不使用 window.history，那么无法进行拦截，此时使用的仍然是子应用的 history，执行会报错
    history.pushState({}, '', '/micro');

})(window.proxy)`;
~~~
关于 `history` 的问题解决方案有很多，这里可以列举多种实现方式：
- 在执行微应用的代码前修改 `contentWindow.history`，使其指向主应用的 `history`
- 在立即执行的匿名函数中传入第二个形参 `history`，指向 `widnow.proxy.history`
- 对 `contentWindow.history` 进行单独代理，并传入立即执行的匿名函数

而在函数中声明 `var` 局部变量无法将属性挂载在全局对象上，我们希望微应用独立运行和嵌入主应用运行的行为应该保持一致，为了解决该问题可以使用 `with` 配合 `Proxy` 实现。
::: tip
温馨提示：一般情况下不需要考虑 `var` 声明的问题，例如在 `Vue` 或者 `React` 框架中使用的 `var` 都是在模块中声明的变量，不会挂载在全局属性上。除此之外，在写代码时大概率也不会采用上述的设计风格（声明了 `var` 以后不直接访问，而是通过 `window` 进行访问）。本课程讨论该问题单纯是为了讲述该问题的解决方案。
:::
`with` 设计的本意用于缩短查找作用域链，并且可以减少变量的使用长度，例如：
~~~ts
var person = {
  name: "ziyi",
  address: {
    country: "China",
    city: "Hangzhou",
  },
};

with (person) {
  console.log("name: ", name); // ziyi
  with (address) {
    console.log("country: ", country); // China
    console.log("city: ", city); // Hangzhou
  }
}
~~~
在上述示例中，通过 `with` 语句将 `person` 对象的所有属性和方法添加到了当前作用域链的顶端（作用域链的最底下是全局对象 `window`），因此在 `with` (`person`) 内部需要访问 `person.name` 时可以直接使用 `name`，本质上在查找 `name` 的过程中先判断 `name in person`，如果返回的是 `true`，则直接获取 `person.name` 的值。有了 `with` 的能力后，可以使用 `Proxy` 的 `has` 对 `in` 操作进行拦截，从而对 `var` 进行拦截处理：
~~~ts
const person = {}

with(person) {
  // 此时声明的 var 在全局作用域下，会添加属性到 window 上
  // 注意块级作用域对 var 没有任何作用
  var a = 2;
  console.log('person a: ', person.a); // undefined
  console.log(window.a); // 2
}

const person1 = new Proxy({}, {
  set(target, prop, value) {
    console.log('触发 set: ', prop);
    target[prop] = value
  },
    
  // has 可以拦截的操作类型：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has#%E6%8B%A6%E6%88%AA
  // has 会对 with(proxy) { (foo); }  中的 foo 访问进行拦截 
  // has 返回为 true 时告诉 with 语句，with(proxy) 的 proxy 对象一定存在 foo 属性（实际上可能不存在 foo 属性）
  // 一旦 foo in proxy 为 true，那么 foo 就不会沿着原型链进行向上查找，从而切断了 with 中变量对象的原型链查找能力
  has(target, prop) {
    console.log('触发 has: ', prop);
    return true
  }
})

with(person1) {
  // 实现对 var 的拦截操作，此时的 var 被拦截，无法到达全局对象
  // 触发 has:  a
  // 触发 set:  a
  var a = 2;
}
~~~
了解了上述能力后，我们在 `Proxy` 示例的基础上进行如下代码的尝试：
~~~ts
iframe.contentWindow.proxy = new Proxy(iframe.contentWindow, {
        get: (target, prop) => {
          console.log("[proxy get 执行] 拦截的 prop: ", prop);

          if (prop === "history") {
            return window[prop];
          }

          // 访问 window.window 时返回 proxy
          // 访问 proxy.history 时 history 可以被拦截处理
          if(prop === 'window') {
            return iframe.contentWindow.proxy;
          }

          // target 就是被代理的 iframe.contentWindow
          // 除了 history，其余都返回 iframe 上 window 的属性值
          return target[prop];
        },

        set: (target, prop, value) => {
          console.log("[proxy set 执行] 拦截的 prop: ", prop);
          target[prop] = value;
        },

        
        // 拦截 in 操作符
        // has 可以拦截的操作类型：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/has#%E6%8B%A6%E6%88%AA
        // 返回为 true 时告诉 with 语句，一定存在属性，禁止向上进行原型链查找
        has: (target, prop) => true
      });



const microCode = `(function(window){
    with(window) {
         // 打印信息
         // [proxy get 执行] 拦截的 prop:  Symbol(Symbol.unscopables)
         // [proxy set 执行] 拦截的 prop:  a
         var a = 2;
            
         // 打印信息   
         // [proxy get 执行] 拦截的 prop:  Symbol(Symbol.unscopables)
         // [proxy get 执行] 拦截的 prop:  console
         // [proxy get 执行] 拦截的 prop:  Symbol(Symbol.unscopables)
         // [proxy get 执行] 拦截的 prop:  window
         // [proxy get 执行] 拦截的 prop:  a
         // with a:  2
         console.log('with a: ', window.a); // 注意访问 window.a 在 with 下是访问了 window.window.a
         
         // 打印信息
         // [proxy get 执行] 拦截的 prop:  Symbol(Symbol.unscopables)
         // [proxy get 执行] 拦截的 prop:  history
         history.pushState({}, '', '/micro1');
         
         // 打印信息
         // [proxy get 执行] 拦截的 prop:  window   
         // [proxy get 执行] 拦截的 prop:  history
         window.history.pushState({}, '', '/micro2'); // 在 with 下是访问了 window.window.history
    }

}).bind(window.proxy)(window.proxy)`;
~~~
::: tip
温馨提示：感兴趣的同学可以额外了解一下 `Symbol.unscopables` 的作用。
:::
具备了上述 `iframe + Proxy + With` 的隔离设计后：
- 可以解决 `JS` 运行环境的隔离问题，当然除了 `history` 故意不进行隔离
- 微应用在使用 `var` 时可以挂载在全局对象上
- 可以解决微应用之间的全局属性隔离问题，包括使用未限定标识符的变量、`this`
- 使用 `this` 时访问是 `iframe` 的 `window` 代理对象，可以和主应用的 `this` 隔离
- 可以解决 `iframe` 隔离中无法进行 `history` 操作和同步的问题

::: tip
温馨提示：使用 `with` 可能会产生性能损耗，例如在 `with(window)` 下访问 `window` 时事实上是访问了 `window.window`，导致拦截的频率变高。如果不考虑全局作用域的 `var` 兼容问题，那么完全可以去掉 `with` 从而减少性能损耗。在 `qiankun` 中为了使内部的微应用执行可以快速访问 `history、location` 等，专门进行了作用域内的局部声明，从而防止作用域链查找带来的性能损耗。
:::

### 修正 this 指向
使用 `Proxy` 加载微应用时，由于内部使用的是代理后的 `window` 对象，会产生如下问题：
~~~ts
const microCode = `(function(window){
    with(window) {
       // Uncaught TypeError: Illegal invocation
       // 此时 this 指向了 proxy，而不是 iframe 的 window 对象
       window.alert(1);
       // Uncaught TypeError: Illegal invocation
       window.addEventListener('load', (e) => {});
    }

}).bind(window.proxy)(window.proxy)`;
~~~
::: tip
温馨提示：阅读 [JS中的"非法调用"错误("Illegal invocation" errors in JavaScript)](https://mtsknn.fi/blog/illegal-invocations-in-js/) 了解更多详情信息。
:::

可能上述示例需要一定的理解能力，我们可以换一个示例：
~~~ts
// 正常运行
alert(1);
// 正常运行
window.alert(1);

const obj = {
  // 将 window.alert 赋值给 obj.alert
  alert
}

// Uncaught TypeError: Illegal invocation
// 因为内部的 alert 执行的 this 指向了 obj
// 此时所需要的执行上下文是 window，否则会报错 Illegal invocation
obj.alert(1);

// 正常运行，因为修正了 this 的指向
obj.alert.bind(window)(1);
~~~
为了修正 `this` 指向，需要将 `proxy` 中的原生函数调用指向原始的 `window` 对象，但是在这个识别过程中还需要考虑其他情况，例如有些函数已经进行了 `bind`，那么不应该进行再次的绑定操作，此时可以通过函数名来识别，例如：
~~~ts
// MDN: https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/name#%E7%BB%91%E5%AE%9A%E5%87%BD%E6%95%B0%E7%9A%84%E5%90%8D%E7%A7%B0
function foo() {};
// 绑定后生成的函数的 name 属性会以 bound 开头
foo.bind({}).name; // "bound foo"
~~~
除此之外，一些构造函数不需要进行 `bind` 操作，因为 `bind` 生成的函数会失去原有函数的属性和 `prototype`：
~~~ts
// 也可以是 function Person {} 构造函数
class Person {
    constructor(name) {
      this.name = name;
    }
    getName() {
      return this.name;
    }
}

// 添加一个属性
Person.age = 1;

console.log("Person.prototype: ", Person.prototype); // {constructor: ƒ, getName: ƒ}
console.log("Person.age: ", Person.age); // 1

// 假设不小心进行了 bind 操作
// bind 的 this 指向 Person，bind 的参数为 window，简单理解为 Person.bind(window)
// 返回的是一个改变 this 指向 window 的新的 Person 构造函数
const BoundPerson = Function.prototype.bind.call(Person, window);

// ECMA 2022：https://262.ecma-international.org/13.0/#sec-function.prototype.bind (无法跳转可以搜索 Function.prototype.bind)
// Function objects created using Function.prototype.bind are exotic objects. They also do not have a "prototype" property.
// 从打印信息可以发现 bind 之后的函数失去了原有函数的 prototype 和属性
console.log("BoundPerson.prototype: ", BoundPerson.prototype); // undefined
console.log("BoundPerson.age: ", BoundPerson.age); // undefined

// window.name、this.name 都可以获取
var name = "global ziyi";

// MDN 构造函数使用的绑定函数：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind#%E4%BD%9C%E4%B8%BA%E6%9E%84%E9%80%A0%E5%87%BD%E6%95%B0%E4%BD%BF%E7%94%A8%E7%9A%84%E7%BB%91%E5%AE%9A%E5%87%BD%E6%95%B0
// 绑定函数自动适应于使用 new 操作符去构造一个由目标函数创建的新实例。当一个绑定函数是用来构建一个值的，原来提供的 this 就会被忽略。不过提供的参数列表仍然会插入到构造函数调用时的参数列表之前。
const person = new BoundPerson("ziyi");
// 构造函数绑定的 this 指向被忽略，仍然指向新实例，因此打印的不是 global ziyi
console.log("person.name: ", person.getName()); // ziyi
~~~
为了修复上述问题，可以在 `iframe` 的 `window` 被拦截时对 `prop` 进行判断，通过 `bind` 对 `window.alert` 、`window.addEventListener`、`window.atob` 等进行 `this` 修正：
~~~ts
// 1. 修正 window.alert、window.addEventListener 等 API 的 this 指向，需要识别出这些函数
// 2. 过滤掉已经做了 bind 的函数
// 3. 过滤掉构造函数，例如原生的 Object、Array 以及用户自己创建的构造函数等

function isFunction(value) {
   return typeof value === "function";
}

function isBoundedFunction(fn) {
   // 被绑定的函数本身没有 prototype
   return fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype")
}

// 是否是构造函数（这个实现比较复杂，这里可以简单参考 qiankun 实现）
function isConstructable() {
  // 可以过滤 Object、Array 等
  return (
    // 过滤掉箭头函数、 async 函数等。这些函数没有 prototype
    fn.prototype &&
    // 通常情况下构造函数的 prototype.constructor 指向本身
    fn.prototype.constructor === fn &&
    // 通常情况下构造函数和类都会存在 prototype.constructor，因此长度至少大于 1
    // 需要注意普通函数中也会存在 prototype.constructor，
    // 因此如果 prototype 有自定义属性或者方法，那么判定为类或者构造函数，因此这里的判断是大于 1
    // 注意不要使用 Object.keys 进行判断，Object.keys 无法获取 Object.defineProperty 定义的属性
    Object.getOwnPropertyNames(fn.prototype).length > 1
  );
  // TODO: 没有 constructor 的构造函数识别、class 识别、function Person() {} 识别等
  // 例如 function Person {};  Person.prototype = {}; 此时没有 prototype.constructor 属性
}


// 最后可以对 window 的属性进行修正，以下函数执行在 Proxy 的 get 函数中
function getTargetValue(target, prop) {
    const value = target[prop];
    // 过滤出 window.alert、window.addEventListener 等 API 
    if(isFunction(value) && !isBoundedFunction(value) && !isConstructable(value)) {
        // 修正 value 的 this 指向为 target 
        const boundValue = Function.prototype.bind.call(value, target);
        // 重新恢复 value 在 bound 之前的属性和原型（bind 之后会丢失）
        for (const key in value) {
          boundValue[key] = value[key];
        }
        // 如果原来的函数存在 prototype 属性，而 bound 之后丢失了，那么重新设置回来
        if(value.hasOwnProperty("prototype") && !boundValue.hasOwnProperty("prototype")) {
            boundValue.prototype = value.prototye;
        }
        return boundValue;
    }
    return value;
}
~~~
::: tip
温馨提示：实际在微应用使用的情况千变万化，上述设计并不能覆盖所有场景，如果想了解社区框架的完善程度，可以查看 `qiankun` 框架中的 `getTargetValue` 处理。
:::

### 隔离方案设计
了解了上述 `Proxy` 和 `with` 的作用后，我们可以重新修改 `iframe` 隔离中的空白页隔离方案，具体方案如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/09b0b67875ae4dc89f6e5530eb1d30a5~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

导航的两个按钮（微应用导航）根据后端数据动态渲染，点击按钮后会跨域请求微应用的 `JS` 静态资源并创建空白的 `iframe` 进行隔离执行。

文件的结构目录如下所示：
~~~shell
├── public                  # 托管的静态资源目录
│   ├── main/               # 主应用资源目录                        
│   │   └── index.html                                        
│   └── micro/              # 微应用资源目录
│        ├── micro1.js        
│        └── micro2.js      
├── config.js               # 公共配置
├── main-server.js          # 主应用服务
└── micro-server.js         # 微应用服务
~~~
对前端微应用进行隔离测试：
~~~ts
// public/micro/micro1.js
this.a = 'a';
console.log('微应用1 a: ', a);

var b = 'b';
console.log('微应用1 b: ', window.b);

window.c = 'c';
console.log('微应用1 c: ', window.c);

let root = document.createElement("button");
root.textContent = "微应用 1 更改 history 为 micro1";
document.body.appendChild(root);

// 尽管 iframe 设置了 src="about:blank"，但是由于 history 被代理成主应用的 history，因此不会出错
root.onclick = () => {
  history.pushState({}, '', '/micro1');
}
~~~
~~~ts
// public/micro/micro2.js
this.a = 1;
console.log("微应用2 a: ", a);

var b = 2;
console.log("微应用2 b: ", window.b);

window.c = 3;
console.log("微应用2 c: ", window.c);

let root = document.createElement("button");
root.textContent = "微应用 2 更改 history 为 micro2";
document.body.appendChild(root);

// 尽管 iframe 设置了 src="about:blank"，但是由于 history 被代理成主应用的 history，因此不会出错
root.onclick = () => {
  history.pushState({}, "", "/micro2");
};
~~~
在原有空白 `iframe` 隔离的基础上对 `MicroAppSandbox` 类进行修改，具体如下所示：
~~~html
<!-- public/main/index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Main App Document</title>
  </head>

  <body>
    <h1>Hello，Sandbox Script!</h1>

    <!-- 主应用导航 -->
    <div id="nav"></div>

    <!-- 主应用内容区 -->
    <div id="container"></div>

    <script type="text/javascript">
      // 隔离类
      class IframeSandbox {
        // 沙箱配置信息
        options = null;
        // iframe 实例
        iframe = null;
        // iframe 的 Window 实例
        iframeWindow = null;
        // 是否执行过 JS
        execScriptFlag = false;

        constructor(options) {
          this.options = options;
          // 创建 iframe 时浏览器会创建新的全局执行上下文，用于隔离主应用的全局执行上下文
          this.iframe = this.createIframe();
          this.iframeWindow = this.iframe.contentWindow;
          this.proxyIframeWindow();
        }

        createIframe() {
          const { rootElm, id, url } = this.options;
          const iframe = window.document.createElement("iframe");
          const attrs = {
            src: "about:blank",
            "app-id": id,
            "app-src": url,
            style: "border:none;width:100%;height:100%;",
          };
          Object.keys(attrs).forEach((name) => {
            iframe.setAttribute(name, attrs[name]);
          });
          rootElm?.appendChild(iframe);
          return iframe;
        }

        isBoundedFunction(fn) {
          return (
            // 被绑定的函数本身没有 prototype
            fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype")
          );
        }

        isConstructable(fn) {
          // 可以识别 Object、Array 等原生构造函数，也可以识别用户自己创建的构造函数
          return (
            fn.prototype &&
            // 通常情况下构造函数和类的 prototype.constructor 指向本身
            fn.prototype.constructor === fn &&
            // 通常情况下构造函数和类都会存在 prototype.constructor，因此长度至少大于 1
            // 需要注意普通函数中也会存在 prototype.constructor，
            // 因此如果 prototype 有自定义属性或者方法，那么可以判定为类或者构造函数，因此这里的判断是大于 1
            // 注意不要使用 Object.keys 进行判断，Object.keys 无法获取 Object.defineProperty 定义的属性
            Object.getOwnPropertyNames(fn.prototype).length > 1
          );
          // TODO: 没有 constructor 的构造函数识别、class 识别、function Person() {} 识别等
          // 例如 function Person {};  Person.prototype = {}; 此时没有 prototype.constructor 属性
        }

        // 修复 window.alert、window.addEventListener 等报错 Illegal invocation 的问题
        // window.alert 内部的 this 不是指向 iframe 的 window，而是指向被代理后的 proxy，因此在调用 alert 等原生函数会报错 Illegal invocation
        // 因此这里需要重新将这些原生 native api 的 this 修正为 iframe 的 window
        getTargetValue(target, prop) {
          const value = target[prop];

          // 过滤出 window.alert、window.addEventListener 等 API
          if (
            typeof value === "function" &&
            !this.isBoundedFunction(value) &&
            !this.isConstructable(value)
          ) {

            console.log('修正 this: ', prop);

            // 修正 value 的 this 指向为 target
            const boundValue = Function.prototype.bind.call(value, target);
            // 重新恢复 value 在 bound 之前的属性和原型（bind 之后会丢失）
            for (const key in value) {
              boundValue[key] = value[key];
            }
            // 如果原来的函数存在 prototype 属性，而 bound 之后丢失了，那么重新设置回来
            if (
              value.hasOwnProperty("prototype") &&
              !boundValue.hasOwnProperty("prototype")
            ) {
              boundValue.prototype = value.prototye;
            }
            return boundValue;
          }
          return value;
        }

        proxyIframeWindow() {
          this.iframeWindow.proxy = new Proxy(this.iframeWindow, {
            get: (target, prop) => {
              // console.log("get target prop: ", prop);

              // TODO: 这里只是课程演示，主要用于解决 src:about:blank 下的 history 同域问题，并没有真正设计主子应用的路由冲突问题，后续的课程会进行该设计
              // 思考：为了防止 URL 冲突问题，是否也可以形成设计规范，比如主应用采用 History 路由，子应用采用 Hash 路由，从而确保主子应用的路由不会产生冲突的问题
              if (prop === "history" || prop === "location") {
                return window[prop];
              }

              if (prop === "window" || prop === "self") {
                return this.iframeWindow.proxy;
              }

              return this.getTargetValue(target, prop);
            },

            set: (target, prop, value) => {
  
              target[prop] = value;
              return true;
            },

            has: (target, prop) => true,
          });
        }

        execScript() {
          const scriptElement =
            this.iframeWindow.document.createElement("script");
          scriptElement.textContent = `
              (function(window) {
                with(window) {
                  ${this.options.scriptText}
                }
              }).bind(window.proxy)(window.proxy);
              `;
          this.iframeWindow.document.head.appendChild(scriptElement);
        }

        // 激活
        async active() {
          this.iframe.style.display = "block";
          // 如果已经通过 Script 加载并执行过 JS，则无需重新加载处理
          if (this.execScriptFlag) return;
          this.execScript();
          this.execScriptFlag = true;
        }

        // 失活
        // INFO: JS 加载以后无法通过移除 Script 标签去除执行状态
        // INFO: 因此这里不是指代失活 JS，如果是真正想要失活 JS，需要销毁 iframe 后重新加载 Script
        inactive() {
          this.iframe.style.display = "none";
        }

        // 销毁沙箱
        destroy() {
          this.options = null;
          this.exec = false;
          if (this.iframe) {
            this.iframe.parentNode?.removeChild(this.iframe);
          }
          this.iframe = null;
        }
      }

      // 微应用管理
      class MicroAppManager {
        // 缓存微应用的脚本文本（这里假设只有一个执行脚本）
        scriptText = "";
        // 隔离实例
        sandbox = null;
        // 微应用挂载的根节点
        rootElm = null;

        constructor(rootElm, app) {
          this.rootElm = rootElm;
          this.app = app;
        }

        // 获取 JS 文本（微应用服务需要支持跨域请求）
        async fetchScript(src) {
          try {
            const res = await window.fetch(src);
            return await res.text();
          } catch (err) {
            console.error(err);
          }
        }

        // 激活
        async active() {
          // 缓存资源处理
          if (!this.scriptText) {
            this.scriptText = await this.fetchScript(this.app.script);
          }

          // 如果没有创建沙箱，则实时创建
          // 需要注意只给激活的微应用创建 iframe 沙箱，因为创建 iframe 会产生内存损耗
          if (!this.sandbox) {
            this.sandbox = new IframeSandbox({
              rootElm: this.rootElm,
              scriptText: this.scriptText,
              url: this.app.script,
              id: this.app.id,
            });
          }

          this.sandbox.active();
        }

        // 失活
        inactive() {
          this.sandbox?.inactive();
        }
      }

      // 微前端管理
      class MicroManager {
        // 微应用实例映射表
        appsMap = new Map();
        // 微应用挂载的根节点信息
        rootElm = null;

        constructor(rootElm, apps) {
          this.rootElm = rootElm;
          this.setAppMaps(apps);
        }

        setAppMaps(apps) {
          apps.forEach((app) => {
            this.appsMap.set(app.id, new MicroAppManager(this.rootElm, app));
          });
        }

        // TODO: prefetch 微应用
        prefetchApps() {}

        // 激活微应用
        activeApp(id) {
          const current = this.appsMap.get(id);
          current && current.active();
        }

        // 失活微应用
        inactiveApp(id) {
          const current = this.appsMap.get(id);
          current && current.inactive();
        }
      }

      // 主应用管理
      class MainApp {
        microApps = [];
        microManager = null;

        constructor() {
          this.init();
        }

        async init() {
          this.microApps = await this.fetchMicroApps();
          this.createNav();
          this.navClickListener();
          this.hashChangeListener();
          // 创建微前端管理实例
          this.microManager = new MicroManager(
            document.getElementById("container"),
            this.microApps
          );
        }

        // 从主应用服务器获请求微应用列表信息
        async fetchMicroApps() {
          try {
            const res = await window.fetch("/microapps", {
              method: "post",
            });
            return await res.json();
          } catch (err) {
            console.error(err);
          }
        }

        // 根据微应用列表创建主导航
        createNav(microApps) {
          const fragment = new DocumentFragment();
          this.microApps?.forEach((microApp) => {
            // TODO: APP 数据规范检测 (例如是否有 script）
            const button = document.createElement("button");
            button.textContent = microApp.name;
            button.id = microApp.id;
            fragment.appendChild(button);
          });
          nav.appendChild(fragment);
        }

        // 导航点击的监听事件
        navClickListener() {
          const nav = document.getElementById("nav");
          nav.addEventListener("click", (e) => {
            // 并不是只有 button 可以触发导航变更，例如 a 标签也可以，因此这里不直接处理微应用切换，只是改变 Hash 地址
            // 不会触发刷新，类似于框架的 Hash 路由
            window.location.hash = event?.target?.id;
          });
        }

        // hash 路由变化的监听事件
        hashChangeListener() {
          // 监听 Hash 路由的变化，切换微应用（这里设定一个时刻只能切换一个微应用）
          window.addEventListener("hashchange", () => {
            this.microApps?.forEach(async ({ id }) => {
              id === window.location.hash.replace("#", "")
                ? this.microManager.activeApp(id)
                : this.microManager.inactiveApp(id);
            });
          });
        }
      }

      new MainApp();
    </script>
  </body>
</html>
~~~
可以发现在空白 `iframe` 隔离的基础上增强了能力设计：
- 解决了 `iframe src="about:blank"` 时的 `history` 报错问题
- 后续还可以增强子应用和主应用的 `URL` 同步问题
- `DOM` 环境天然隔离，但是无法处理 `Modal` 相对于主应用的居中问题

## 框架原理：快照隔离
`iframe` 隔离方案是一种非常彻底的隔离实现，接下来会简单讲解一个纯前端基于 `JS` 设计的快照隔离方案，该隔离方案用于简单实现全局对象属性的隔离。

### 隔离思路
在 `V8` 隔离中我们知道如果想要真正做到 `JS` 运行时环境的隔离，本质上需要在底层利用 `V8` 创建不同的 `Isolate` 或者 `Context` 进行隔离，例如 `iframe` 和 `Worker` 线程都可以做到这一点。利用 `iframe` 实现隔离已经在上一节课程中进行了讲解，而 `Worker` 线程因为和 `Renderer UI` 线程在 `Web API` 能力上存在差异，不适合作为微应用的 `JS` 运行环境。本课程接下来讲解的 `JS` 运行时隔离本质上并不是利用 `V8` 来创建不同的 `Context` 实现隔离，而是简单将主应用执行环境中的 `window` 全局对象进行隔离，微应用仍然运行在主应用的全局执行环境中，具体如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/0cd597b8d8214bd5a58082dc649c4ff1~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

为了实现快照隔离功能，首先需要讲解一些 `JavaScript` 的语言特性，从而帮助大家更好的理解方案设计。

### 自执行的匿名函数
在动态 `Script` 的方案中，我们讲解了可以使用自执行的匿名函数来隔绝变量声明的作用域。除此之外，`jQuery` 为了隔绝外部声明的变量和函数也采用了该特性，具体如下所示：
~~~ts
// 自执行的匿名函数（模拟微应用环境）
(function(){
    //局部函数
    function a() {
        alert('inner a');
    }
})();

// 全局函数（主应用环境）
function a() {
    alert('out a');
}

a(); // out a
console.log(window.a); // out a 对应的函数
~~~
从上述示例可以发现自执行匿名函数创建了自己的函数作用域，该作用域内的函数不会和匿名函数外部的同名函数冲突。除此之外，为了加速访问全局对象 `window`，可以进行如下处理：
~~~ts
window.a = 1;

// 访问局部变量 window, 不需要向上遍历作用域链, 缩短查找时间, 同时在压缩代码时局部变量 window 可被压缩
(function(window){
    alert(a);
})(window);

// 向上遍历到顶层作用域, 访问速度变慢, 全局变量 window 不能被压缩
(function(){
    alert(a);
})();
~~~
有了上述知识后，我们可以模仿微应用的执行作用域，具体如下所示：
~~~ts
// 主应用
let a = 0;

// 微应用 A
(function (window) {
    let a = 1;
    console.log(a); // 1，相对于独立运行的微应用 A 而言符合预期
})(window);

// 微应用 B
(function (window) {
    let a = 2;
    console.log(a); // 2，相对于独立运行的微应用 B 而言符合预期
})(window);

console.log(a); // 0
console.log(window.a); // undefined，符合预期，let 不会在全局声明时（在最顶层的作用域）创建 window 对象的属性
~~~
此时因为自执行匿名函数有自己的作用域，在内部声明的 `let` 变量可以被作用域隔离，因为 `let` 声明的变量不会在作用域中被提升。如果我们将 `let` 替换成 `var` 进行尝试：
~~~ts
// 主应用
var a = 0;
console.log("主应用: ", window.a); // 0

// 微应用 A
(function (window) {
    var a = 1;
    console.log("微应用 A: ", window.a); // 0，相对于独立运行的微应用 A 而言不符合预期
})(window);

// 微应用 B
(function (window) {
    var a = 2;
    console.log("微应用 B: ", window.a); // 0，相对于独立运行的微应用 B 而言不符合预期
})(window);

console.log("主应用: ", window.a); // 0，符合预期，主应用中的 window.a 不受微应用执行代码的影响
~~~
我们知道使用 `var` 在全局作用域中声明的变量将作为全局对象 `window` 的不可配置属性被添加，因此在全局作用域声明的变量 `a` 同时也是 `window` 对象的属性。但是如果将 `var` 放入函数中执行（注意不是块级作用域），那么变量的作用域将被限定在函数内部，此时并不会在全局对象 `window` 上添加属性。因此执行上述代码后，微应用中的 `var` 声明不会影响主应用的 `window` 属性，起到了隔离的效果。虽然主应用本身的执行没有受到影响，但是微应用的执行并不符合预期，因为微应用本质上可以独立运行，如果将微应用 `A` 的代码单独拿出来执行：
~~~ts
 // 微应用独立运行时下述代码是在全局作用域中执行，var 的声明可以添加到 window 对象的属性上
 // 微应用在主应用中运行时下述代码是在立即执行的匿名函数中执行，var 的声明只能在函数内部生效
 var a = 1;
 console.log("微应用 A: ", window.a); // 1
~~~
可以发现微应用 `A` 单独执行和在自执行的匿名函数中执行的结果是不一样的，因为一个是在全局作用域内执行，另外一个则是放入了函数作用域进行执行。除此之外，在 `JavaScript` 中使用变量时也可以不限定标识符，此时微应用的执行会污染全局属性，例如：
~~~ts
// 主应用
var a = 0;
console.log("主应用: ", window.a); // 0

// 微应用 A
(function (window) {
    // 非严格模式下不限定 let、const 或者 var 标识符，此时会在全局对象下创建同名属性
    a = 1;
    console.log("微应用 A: ", window.a); // 1，相对于独立运行的微应用 A 而言符合预期
})(window);

// 微应用 B
(function (window) {
    a = 2;
    console.log("微应用 B: ", window.a); // 2，相对于独立运行的微应用 B 而言符合预期
})(window);

console.log("主应用: ", window.a); // 2，不符合预期，主应用中的 window.a 受到了微应用执行代码的影响
~~~
当然，在对 `this` 进行属性赋值时，也会污染全局属性，例如：
~~~ts
// 主应用
var a = 0;
console.log("主应用: ", window.a); // 0

// 微应用 A
(function (window) {
    // 非严格模式下 this 指向 window 全局对象
    this.a = 1;
    console.log("微应用 A: ", window.a); // 1，相对于独立运行的微应用 A 而言符合预期
})(window);

// 微应用 B
(function (window) {
    this.a = 2;
    console.log("微应用 B: ", window.a); // 2，相对于独立运行的微应用 B 而言符合预期
})(window);

console.log("主应用: ", window.a); // 2，不符合预期，主应用中的 window.a 受到了微应用执行代码的影响
~~~
从上述几个测试示例可以发现，仅仅将微应用封装在匿名函数中进行执行：
- 可以解决 `let` 或者 `const` 声明变量的隔离问题
- 未限定标识符声明变量时，无法实现全局属性隔离问题
- 使用 `this` 时访问的仍然是主应用的 `window` 对象，无法实现全局属性隔离问题

采用立即执行的匿名函数可以限定微应用的作用域，从而在创建局部变量时有很好的隔离效果。当然，由于将微应用封装在函数中执行，一些在全局作用域中运行的特性丢失，并且也无法解决全局属性隔离的问题。

### JS 文本执行方式
有了立即执行的匿名函数后，我们可以将微应用的 `JS` 包装在立即执行的匿名函数中运行，这个包装动作需要在主应用的环境中执行，因为微应用可能有很多的 `JS` 脚本需要被包装处理，并且可能还需要支持原有的独立运行能力。为此，通过 `Script` 标签设置 `src` 进行远程请求外部脚本的方式无法满足手动包装 `JS` 脚本执行的诉求，此时需要手动请求获取 `JS` 文本并进行手动执行。在 `iframe` 隔离的方案中，通过 `window.fetch` 手动请求 `JS` 文本内容（也可以通过 `XMLHttpRequest` 进行请求），如果主应用和微应用的服务跨域，那么请求需要服务端额外支持跨域：
~~~ts
// 获取 JS 文本（微应用服务需要支持跨域请求获取 JS 文件）
async fetchScript(src) {
  try {
    const res = await window.fetch(src);
    return await res.text();
  } catch (err) {
    console.error(err);
  }
}
~~~
::: tip
温馨提示： `qiankun` 框架底层默认使用了 `fetch` 进行微应用静态资源的请求，如果是开发态启动的应用，需要额外配置跨域能力。
:::
获取到微应用 `JS` 的文本字符串后，需要具备手动执行 `JS` 文本的能力。在 `Web` 应用中执行 `JS` 文本字符串的方式有如下几种：
- 通过 `Script` 标签加载内嵌的 `JS` 文本
- 通过 `eval` 执行 `JS` 文本
- 通过 `Function` 执行 `JS` 文本

在 `iframe` 隔离中，我们使用了 `Script` 标签请求获取 `JS` 文本进行运行，实现的方式如下所示：
~~~ts
// 在 document 中创建一个 script 元素
const scriptElement = document.createElement('script');
// 指定 Script 元素的文本内容
// scriptText 是通过请求获取的 JS 文本字符串，可以对该内容进行立即执行的匿名函数封装处理
scriptElement.textContent = scriptText;
// 将元素添加到 document 的 head 标签下（添加成功后代码会自动解析执行）
document.head.appendChild(scriptElement);
~~~
除此之外，也可以使用 `eval` 和 `Function` 进行执行，如下所示：
~~~ts
eval("let a =1, b = 2; console.log(a + b);");

// 等同于 function(a, b) { return  a + b; }
// 前面几项是函数的入参，最后一项是函数的执行体
const fn = new Function("a", "b", "return a + b;");
console.log(fn(1, 2));
~~~
当然两者是存在差异的，例如生效的作用域不同：
~~~ts
var hello = 10;
function createFunction1() {
    var hello = 20;
    return new Function('return hello;'); // 这里的 hello 指向全局作用域内的 hello
}
var f1 = createFunction1();
console.log(f1());   // 10


var world = 10;
function createFunction2() {
    var world = 20;
    return eval('world;'); // 这里的 world 指向函数作用域内的 world
}
console.log(createFunction2()); // 20
~~~
从上述的执行示例可以看出，使用 `Function` 的安全性更高。例如在具备模块化开发环境的 `Vue` 或者 `React` 项目中，开发者可能习惯性的在文件顶部使用 `var` 进行变量声明，此时变量被声明在模块的作用域内，而不是全局的作用域（不会被添加到 `window` 上），因此上述代码在模块化的环境中使用 `Function` 执行会报错，而 `eval` 不会。理论上在开发时应该避免上述这种依赖执行的情况出现，如果 `hello` 和 `world` 两个变量在构建时被压缩，那么代码执行就会产生意想不到的错误。当然也可以使得 `eval` 在全局作用域内生效，例如：
~~~ts
var world = 10;
function createFunction2() {
    var world = 20;
    // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval
    // 使用间接调用 (0,eval) 或者 var geval = eval; 可以达到相同的效果
    return window.eval('world;'); // 这里的 world 指向全局作用域内的 world
}
console.log(createFunction2()); // 10
~~~
::: tip
温馨提示：感兴趣的同学还可以了解一下 `Function` 和 `eval` 的执行性能差异。在 `qiankun` 框架中使用了 `(0,eval)` 来执行微应用的 `JS` 文本，在 `icestark` 中优先使用 `Function` 执行 `JS` 文本。
:::
### 隔离方案设计
`Window` 快照会完全复用主应用的 `Context`，本质上没有形成隔离，仅仅是在主应用 `Context` 的基础上记录运行时需要的差异属性，每一个微应用内部都需要维护一个和主应用 `window` 对象存在差异的对象。不管是调用 `Web API` 还是设置 `window` 属性值，本质上仍然是在主应用的 `window` 对象上进行操作，只是会在微应用切换的瞬间恢复主应用的 `window` 对象，此方案无法做到真正的 `Context` 隔离，并且在一个时刻只能运行一个微应用，无法实现多个微应用同时运行，具体方案如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/b8ad089abe594f3eaca923ab3d36f4c0~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

大致实现的思路如下所示：
- 通过请求获取后端的微应用列表数据，动态创建主导航
- 根据导航切换微应用，切换时会跨域请求微应用 `JS` 的文本内容并进行缓存处理
- 切换微应用时需要先失活已经激活的微应用，确保一个时刻只有一个微应用运行
- 运行微应用前需要将微应用之前运行记录的 `DIFF` 对象和主应用的 `window` 快照进行合并，从而恢复微应用之前运行的 `window` 对象
- 失活微应用前需要先通过当前运行时的 `window` 对象和主应用 `window` 快照进行对比，计算出本次运行时的 `DIFF` 差异对象，为下一次恢复微应用的 `window` 对象做准备，同时通过快照恢复主应用的 `window` 对象

导航的两个按钮（微应用导航）根据后端数据动态渲染，点击按钮后会跨域请求微应用的 JS 静态资源并进行快照隔离执行。

快照隔离实现的文件的结构目录如下所示：
~~~shell
├── public                   # 托管的静态资源目录
│   ├── main/                # 主应用资源目录                               
│   │   └── index.html                                        
│   └── micro/               # 微应用资源目录
│        ├── micro1.js        
│        └── micro2.js      
├── config.js                # 公共配置
├── main-server.js           # 主应用服务
└── micro-server.js          # 微应用服务
~~~
其中 `micro1.js` 和 `micro2.js` 是需要被隔离执行的微应用 `JS` 脚本，它们的设计如下所示：
~~~ts
// public/micro/micro1.js
let root = document.createElement("h1");
root.textContent = "微应用1";
root.id = 'micro1-dom';
root.onclick = () => {
  console.log("微应用1 的 window.a: ", window.a);
};
document.body.appendChild(root);

window.a = 1;
~~~
~~~ts
// public/micro/micro2.js
let root = document.createElement("h1");
root.textContent = "微应用2";
root.id = 'micro2-dom';
root.onclick = () => {
  console.log("微应用2 的 window.a: ", window.a);
};
document.body.appendChild(root);

window.a = 2;
~~~
上述代码如果直接使用动态 `Script` 的方案进行请求和执行，会产生如下错误：
- `root` 变量会重复声明报错，在本示例中会使用立即执行的匿名函数进行作用域隔离处理
- `window.a` 不会被隔离，微应用会因为共用 `window.a` 而产生意想不到的结果

接下来我们可以利用立即执行的匿名函数将微应用的 `JS` 文本进行包装，并使用 `eval` 进行手动执行。在这里，我们可以将之前 `iframe` 隔离中的 `MicroAppSandbox` 类进行改造，如下所示：
~~~ts
class MicroAppSandbox {
  // 配置信息
  options = null;
  // 是否执行过 JS
  exec = false;
  // 微应用 JS 运行之前的主应用 window 快照
  mainWindow = {};
  // 微应用 JS 运行之后的 window 对象（用于理解）
  microWindow = {};
  // 微应用失活后和主应用的 window 快照存在差异的属性集合
  diffPropsMap = {};

  constructor(options) {
    this.options = options;
    // 重新包装需要执行的微应用 JS 脚本
    this.wrapScript = this.createWrapScript();
  }

  createWrapScript() {
    // 微应用的代码运行在立即执行的匿名函数中，隔离作用域
    return `;(function(window){
      ${this.options.scriptText}
    })(window)`;
  }

  execWrapScript() {
    // 在全局作用域内执行微应用代码
    (0, eval)(this.wrapScript);
  }

  // 微应用 JS 运行之前需要记录主应用的 window 快照（用于微应用失活后的属性差异对比）
  recordMainWindow() {
    for (const prop in window) {
      if (window.hasOwnProperty(prop)) {
        this.mainWindow[prop] = window[prop];
      }
    }
  }

  // 微应用 JS 运行之前需要恢复上一次微应用执行后的 window 对象
  recoverMicroWindow() {
    // 如果微应用和主应用的 window 对象存在属性差异
    // 上一次微应用 window = 主应用 window + 差异属性（在微应用失活前会记录运行过程中涉及到更改的 window 属性值，再次运行之前需要恢复修改的属性值）
    Object.keys(this.diffPropsMap).forEach((p) => {
      // 更改 JS 运行之前的微应用 window 对象，注意微应用本质上共享了主应用的 window 对象，因此一个时刻只能运行一个微应用
      window[p] = this.diffPropsMap[p];
    });
    // 用于课程理解
    this.microWindow = window;
  }

  recordDiffPropsMap() {
    // 这里的 microWindow 是微应用失活之前的 window（在微应用执行期间修改过 window 属性的 window）
    for (const prop in this.microWindow) {
      // 如果微应用运行期间存在和主应用快照不一样的属性值
      if (
        window.hasOwnProperty(prop) &&
        this.microWindow[prop] !== this.mainWindow[prop]
      ) {
        // 记录微应用运行期间修改或者新增的差异属性（下一次运行微应用之前可用于恢复微应用这一次运行的 window 属性）
        this.diffPropsMap[prop] = this.microWindow[prop];
        // 恢复主应用的 window 属性值
        window[prop] = this.mainWindow[prop];
      }
    }
  }

  active() {
    // 记录微应用 JS 运行之前的主应用 window 快照
    this.recordMainWindow();
    // 恢复微应用需要的 window 对象
    this.recoverMicroWindow();
    if (this.exec) {
      return;
    }
    this.exec = true;
    // 执行微应用（注意微应用的 JS 代码只需要被执行一次）
    this.execWrapScript();
  }

  inactive() {
    // 清空上一次记录的属性差异
    this.diffPropsMap = {};
    // 记录微应用运行后和主应用 Window 快照存在的差异属性
    this.recordDiffPropsMap();
    console.log(
      `${this.options.appId} diffPropsMap: `,
      this.diffPropsMap
    );
  }
}
~~~
`MicroApps` 和 `MicroApp` 和 `iframe` 隔离方案设计基本一致（注释部分是差异部分）：
~~~ts
class MicroApp {
  
  scriptText = "";

  sandbox = null;

  rootElm = null;

  constructor(rootElm, app) {
    this.rootElm = rootElm;
    this.app = app;
  }

  async fetchScript(src) {
    try {
      const res = await window.fetch(src);
      return await res.text();
    } catch (err) {
      console.error(err);
    }
  }

  async active() {

    if (!this.scriptText) {
      this.scriptText = await this.fetchScript(this.app.script);
    }

    if (!this.sandbox) {
      this.sandbox = new MicroAppSandbox({
        scriptText: this.scriptText,
        appId: this.app.id,
      });
    }

    this.sandbox.active();

    // 获取元素并进行展示，这里先临时约定微应用往 body 下新增 id 为 `${this.app.id}-dom` 的元素
    const microElm = document.getElementById(`${this.app.id}-dom`);
    if (microElm) {
      microElm.style = "display: block";
    }
  }

  inactive() {
  
    // 获取元素并进行隐藏，这里先临时约定微应用往 body 下新增 id 为 `${this.app.id}-dom` 的元素
    const microElm = document.getElementById(`${this.app.id}-dom`);
    if (microElm) {
      microElm.style = "display: none";
    }
    this.sandbox?.inactive();
  }
}

class MicroApps {

  appsMap = new Map();

  rootElm = null;

  constructor(rootElm, apps) {
    this.rootElm = rootElm;
    this.setAppMaps(apps);
  }

  setAppMaps(apps) {
    apps.forEach((app) => {
      this.appsMap.set(app.id, new MicroApp(this.rootElm, app));
    });
  }

  prefetchApps() {}

  activeApp(id) {
    const app = this.appsMap.get(id);
    app?.active();
  }

  inactiveApp(id) {
    const app = this.appsMap.get(id);
    app?.inactive();
  }
}
~~~
`MainApp` 中需要确保一个时刻只能运行一个微应用，因此在微应用激活之前，需要先失活已经激活运行的微应用，如下所示：
~~~ts
class MainApp {
  microApps = [];
  microAppsManager = null;

  constructor() {
    this.init();
  }

  async init() {
    this.microApps = await this.fetchMicroApps();
    this.createNav();
    this.navClickListener();
    this.hashChangeListener();
    this.microAppsManager = new MicroApps(
      document.getElementById("container"),
      this.microApps
    );
  }

  async fetchMicroApps() {
    try {
      const res = await window.fetch("/microapps", {
        method: "post",
      });
      return await res.json();
    } catch (err) {
      console.error(err);
    }
  }
  
  createNav(microApps) {
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
      // 此时有一个微应用已经被激活运行
      console.log("主应用 window.a: ", window.a);
      window.location.hash = event?.target?.id;
    });
  }

  hashChangeListener() {
    window.addEventListener("hashchange", () => {
    
      // 需要失活应用，为了确保一个时刻只能激活一个应用（这里可以设计微应用的运行状态，根据状态进行处理）
      this.microApps?.forEach(async ({ id }) => {
        if (id !== window.location.hash.replace("#", "")) {
          this.microAppsManager.inactiveApp(id);
        }
      });

      // 没有微应用被激活时，主应用的 window 对象会被恢复
      console.log("恢复主应用的 window.a: ", window.a);

      // 激活应用
      this.microApps?.forEach(async ({ id }) => {
        if (id === window.location.hash.replace("#", "")) {
          this.microAppsManager.activeApp(id);
        }
      });

    });
  }
}

new MainApp();
~~~
具备了上述快照隔离能力后：
- 可以解决 `let` 或者 `const` 声明变量的隔离问题
- 可以解决微应用之间的全局属性隔离问题，包括使用未限定标识符的变量、`this`
- 无法实现主应用和微应用同时运行时的全局属性隔离问题

## 框架原理：CSS 隔离
如果要彻底实现 `CSS` 的隔离，最好的方式是实现 `Renderer` 进程中浏览上下文的隔离，例如之前讲解的 `iframe` 隔离，它可以天然实现 `CSS` 隔离。但是如果微应用和主应用在同一个 `DOM` 环境中，那么仍然有几种思路可以避免 `CSS` 样式污染：
- 对微应用的每一个 `CSS` 样式和对应的元素进行特殊处理，从而保证样式唯一性，例如 `Vue` 的 [Scoped CSS](https://vue-loader.vuejs.org/zh/guide/scoped-css.html)
- 对微应用的所有 `CSS` 样式添加一个特殊的选择器规则，从而限定其影响范围
- 使用 `Shadow DOM` 实现 `CSS` 样式隔离

思路一需要微应用自行遵循设计规范，从而解决主子应用的样式冲突问题。思路二则可以在主应用获取微应用 `CSS` 样式时进行特殊处理，从而使其可以在微应用的容器内限定 `CSS` 样式的作用范围。思路三则是利用浏览器的标准来实现同一个 `DOM` 环境中的 `CSS` 样式隔离，本课程主要讲解思路三的一些实现细节。
::: tip
温馨提示：如果是组件库，那么需要组件库具备添加 `class` 前缀的能力，从而可以避免组件库的样式污染。
:::

### Shadow DOM 隔离
在动态 `Script` 以及 `Web Components` 方案中，我们通过动态添加和删除 `Style` 标签来实现微应用的样式处理，动态加载和卸载微应用的 `Style` 标签可以确保微应用之间的样式不会产生污染，但是这种方式无法解决主应用和微应用的样式污染问题，也无法解决多个微应用并存带来的样式污染问题。为了解决该问题，我们可以通过 `Shadow DOM` 对各个微应用的 `DOM` 进行隔离处理，具体如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3970edd6b9e54ace99e3d3982e759a33~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

使用浏览器自带的 [Shadow DOM](https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM) 后，微应用所在的自定义元素会和主应用以及其他微应用的 `DOM` 进行隔离，从而可以做到 `CSS` 的隔离。点击导航按钮后会请求微应用的静态资源并解析 `JS` 和 `CSS`

之前的 `Web Components` 方案中的样式加载，切换应用时每次都需要重新加载对应的 `CSS` 进行样式覆盖，并且覆盖的样式也会污染主应用的标题的样式。而在 `Web Components` 的方案中，由于 `Shadow DOM` 的存在，彼此会产生样式隔离，因此不需要通过再次加载 `CSS` 的方式进行样式覆盖。

该示例的文件结构目录如下所示：
~~~shell
├── public                   # 托管的静态资源目录
│   ├── main/                # 主应用资源目录                        
│   │   └── index.html                                        
│   └── micro/               # 微应用资源目录
│        ├── micro1.css   
│        ├── micro1.js    
│        ├── micro2.css         
│        └── micro2.js      
├── config.js                # 公共配置
├── main-server.js           # 主应用服务
└── micro-server.js          # 微应用服务
~~~
主应用 `HTML` 的实现代码如下所示：
```html
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
    <h1>Hello，Dynamic Script!</h1>
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
            
            // 动态 Script 方案
            // document.body.appendChild($style);

            // Web Components 方案
            // 将微应用的 CSS 样式添加到可以隔离的 Shadow DOM 中   
            const $webcomponent = document.querySelector(`[micro-id=${id}]`);
            const $shadowRoot = $webcomponent?.shadowRoot;
            $shadowRoot?.insertBefore($style, $shadowRoot?.firstChild);
          });
        }
        
        // 动态 Script 方案
        // removeStyle({ id }) {
        //  const $style = document.querySelector(`[micro-style=${id}]`);
        //  $style && $style?.parentNode?.removeChild($style);
        // }

        hasLoadScript({ id }) {
          const $script = document.querySelector(`[micro-script=${id}]`);
          return !!$script;
        }
        
        // 动态 Script 方案
        // hasLoadStyle({ id }) {
        //   const $style = document.querySelector(`[micro-style=${id}]`);
        //   return !!$style;
        // }
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
               
                // Web Components 方案
                if (!$webcomponent) {

                  console.time(`fetch microapp ${microApp.name} static`);
                  microApp?.script &&
                    !this.hasLoadScript(microApp) &&
                    (await this.loadScript(microApp));
                  
                  // 动态 Script 方案
                  // window?.[microApp.mount]?.("#micro-app-slot");

                  // Web Components 方案
                  // 下载并执行相应的 JS 后会声明微应用对应的自定义元素
                  // 在服务端的接口里通过 customElement 属性进行约定
                  const $webcomponent = document.createElement(
                    microApp.customElement
                  );
                  $webcomponent.setAttribute("micro-id", microApp.id);
                  $slot.appendChild($webcomponent);
                    
                  // 将 CSS 插入到自定义元素对应的 Shadow DOM 中
                  this.loadStyle(microApp);
                  console.timeEnd(`fetch microapp ${microApp.name} static`);

                } else {
                  // Web Components 方案
                  $webcomponent.style.display = "block";
                }
              } else {
                // 动态 Script 方案
                // this.removeStyle(microApp);
                // window?.[microApp.unmount]?.();

                // Web Components 方案
                $webcomponent.style.display = "none";
              }
            });
          });
        }
      }

      new MicroAppManager();
    </script>
  </body>
</html>
```
微应用的设计如下所示：
```ts
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
    // 相对比动态 Script，组件内部可以自动进行 mount 操作，不需要对外提供手动调用的 mount 函数，从而防止不必要的全局属性冲突
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
    // MDN: https://developer.mozilla.org/zh-CN/docs/Web/API/Element/attachShadow
    // 给当前自定义元素挂载一个 Shadow DOM
    const $shadow = this.attachShadow({ mode: "open" });
    const $micro = document.createElement("h1");
    $micro.textContent = "微应用1";
    // 将微应用的内容挂载到当前自定义元素的 Shadow DOM 下，从而与主应用进行 DOM 隔离
    $shadow.appendChild($micro);
  }

  unmount() {
    // 这里可以去除相应的副作用处理
  }
}

// MDN：https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/define
// 创建自定义元素，可以在浏览器中使用 <micro-app-1> 自定义标签
window.customElements.define("micro-app-1", MicroApp1Element);
```
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
### Shadow DOM
在讲解了 `Web Components` 的 `CSS` 隔离方案之后，本课程可以额外深入了解一下 `Shadow DOM`，它不仅仅可以做到 `DOM` 元素的 `CSS` 样式隔离，还可以做到事件的隔离处理，例如：
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
    <template id="custom-element-template">
      <h1>Shadow DOM 中的标题</h1>
      <!-- button 按钮会渲染在 Shadow DOM 中 -->
      <button onclick="handleShadowButtonClick(event)">
        Shadow DOM 中的按钮
      </button>
    </template>

    <!-- 普通 DOM 测试-->
    <div id="outer" onclick="handleOuterClick(event)">
      <h1>普通 DOM 中的标题</h1>
      <!-- button 按钮在普通 DOM 下  --->
      <button onclick="handleButtonClick(event)">普通 DOM 中的按钮</button>
    </div>

    <!-- Shadow DOM 测试-->
    <div id="shadow-outer" onclick="handleShadowOuterClick(event)">
      <!-- Shadow Host：一个常规 DOM 节点，Shadow DOM 会被附加到这个节点上 -->
      <!-- template 中的 button 按钮元素的 DOM 副本会被拷贝到该 Shadow Host 下 --->
      <custom-element onclick="handleShadowHostClick(event)"></custom-element>
    </div>

    <script>
      // 普通 DOM 事件
      function handleButtonClick(e) {
        console.log("handleButtonClick: ", e.target);
      }

      // 普通 DOM 事件
      function handleOuterClick(e) {
        console.log("handleOuterClick: ", e.target);
      }

      // Shadow DOM 事件
      function handleShadowButtonClick(e) {
        console.log("handleShadowButtonClick: ", e.target);
      }

      // Shadow DOM 事件
      function handleShadowHostClick(e) {
        console.log("handleShadowHostClick: ", e.target);
      }

      // 普通 DOM 事件
      function handleShadowOuterClick(e) {
        console.log("handleShadowOuterClick: ", e.target);
      }

      // 全局 document 委托事件
      document.onclick = function (e) {
        console.log("document.onclick: ", e.target);
      };

      class CustomElement extends HTMLElement {
        constructor() {
          super();
          // Shadow Root: Shadow Tree 的根节点
          const shadowRoot = this.attachShadow({ mode: "open" });
          const $template = document.getElementById("custom-element-template");
          // cloneNode:
          // 克隆一个元素节点会拷贝它所有的属性以及属性值，当然也就包括了属性上绑定的事件 (比如 onclick="alert(1)"),
          // 但不会拷贝那些使用 addEventListener() 方法或者 node.onclick = fn 这种用 JavaScript 动态绑定的事件。
          shadowRoot.appendChild($template.content.cloneNode(true));
        }
      }
      customElements.define("custom-element", CustomElement);
    </script>
  </body>
</html>
~~~
在浏览器中点击测试可以发现在冒泡阶段普通 `DOM` 和 `Shadow DOM` 的表现情况不一致，普通 `DOM` 点击时可以正确反应当前点击事件的目标对象 `Button` 按钮，而 `Shadow DOM` 点击时在 `Shadow Host` 处已经无法感知到内部触发事件的目标对象 `Button` 按钮。尽管 `DOM` 事件不会被阻断，但是 `Shadow Root` 之上的父节点已经无法获取精准的事件对象。这种情况会带来一个新的问题，例如熟悉 `React` 开发的同学，会发现 `React 17` 以下会使用 `Document` 进行事件委托处理，此时会因为拿不到 `Shadow DOM` 中的事件对象，而导致事件失效。为了解决类似的问题，`React 17` 不再使用 `Document` 进行事件委托，而是使用 `React` 挂载的 `Root` 节点进行事件委托，此时如果在 `Shadow DOM` 中使用 `React` 框架，那么事件可以被正确处理，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/f453490ff59a4b1390f46833f6df5fa6~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

::: tip
温馨提示：关于 `React` 委托事件的变更可以查看 [Changes to Event Delegation](https://legacy.reactjs.org/blog/2020/08/10/react-v17-rc.html#changes-to-event-delegation)。
:::

验证上述行为的方式也很简单，直接使用 `Creat React App` 创建 `React` 项目，然后更改 `public/index.html` 以及 `src/index.js`，具体如下所示：
~~~html
<!-- public/index.html -->

<!DOCTYPE html>
<html lang="en">

<body>
   
  <!-- 将原有的 React 的 index.html 模版信息放在 template 中 -->
  <!-- 模版中的内容信息会在自定义元素的 Shadow DOM 中进行渲染 -->
  <template id="template">
    <!DOCTYPE html>
    <html lang="en">

    <head>
      <meta charset="utf-8" />
      <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="theme-color" content="#000000" />
      <meta name="description" content="Web site created using create-react-app" />
      <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
      <!--
          manifest.json provides metadata used when your web app is installed on a
          user's mobile device or desktop. See https://developers.google.com/web/fundamentals/web-app-manifest/
        -->
      <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
      <!--
          Notice the use of %PUBLIC_URL% in the tags above.
          It will be replaced with the URL of the `public` folder during the build.
          Only files inside the `public` folder can be referenced from the HTML.
  
          Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
          work correctly both with client-side routing and a non-root public URL.
          Learn how to configure a non-root public URL by running `npm run build`.
        -->
      <title>React App</title>
    </head>

    <body>
      <noscript>You need to enable JavaScript to run this app.</noscript>

      <div id="root"></div>
      <!--
          This HTML file is a template.
          If you open it directly in the browser, you will see an empty page.
  
          You can add webfonts, meta tags, or analytics to this file.
          The build step will place the bundled scripts into the <body> tag.
  
          To begin the development, run `npm start` or `yarn start`.
          To create a production bundle, use `npm run build` or `yarn build`.
        -->
    </body>

    </html>
  </template>
  
  <!-- 自定义元素 -->
  <react-app id="app"></react-app>
</body>

<script>
  class ReactApp extends HTMLElement {
    constructor() {
      super();
      // 创建 Shadow Root 并将 React App 的模版信息放入 Shadow Root 中
      const shadowRoot = this.attachShadow({ mode: 'open' });
      const template = document.getElementById('template');
      shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  customElements.define('react-app', ReactApp)
    
  // 全局事件委托
  document.onclick = function (e) {
    console.log('document.onclick: ', e.target)
  }
</script>

</html>
~~~
在 `React` 项目的入口文件 `src/index.js` 中修改寻找 `id` 为 `root` 的元素进行挂载：
~~~tsx
// React 18.x 语法
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const $app = document.getElementById('app');
// 由于自定义元素会将 Template 中的信息放入 Shadow Root 下
// 因此 id 为 root 的元素最终会在 Shadow Root 下进行渲染
const $root = $app.shadowRoot.getElementById('root');
const root = ReactDOM.createRoot($root);

root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// // React 16.x 语法
// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';

// const $app = document.getElementById('app');
// const $root = $app.shadowRoot.getElementById('root');
// ReactDOM.render(<App />, $root);
~~~
在 `src/App.jsx` 简单渲染一个按钮并使用 `React` 的 `click` 事件（注意不是原生的事件，而是 `JSX` 语法的事件注册，会走 `React` 的事件委托机制）：
~~~tsx
import React from 'react';
// import logo from './logo.svg';
import './App.css';

class App extends React.PureComponent {
  handleButtonClick(e) {
    console.log('handleButtonClick', e.target);
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <button onClick={this.handleButtonClick}>Shadow DOM 事件测试</button>
        </header>
      </div>
    );
  }
}

export default App;
~~~
分别使用 `React 18` 和 `React 16` 启动项目进行测试（`React 17` 修改了委托机制），可以发现 `React 16` 因为使用了全局的 `Document` 进行事件委托，并且由于内部的 `Button` 按钮处在 `Shadow DOM` 中，因此委托事件失效无法触发 `React` 的点击事件。需要注意，如果一些微前端框架采用了 `Web Components` 并配合 `Shadow DOM` 进行微应用的渲染，并且微应用采用低版本的 `React` 框架进行设计，那么此时会面临事件失效的问题。

## 框架原理：性能优化
前端应用进行性能优化的方式有很多，例如浏览器为了提升应用的加载性能，不断开放了 `Resource Hints（DNS Prefetch、Reconnect、Prefetch、Prerender）`、`Early Hints` 等功能。在应用缓存方面可以做到多级缓存设计，包括 `Service Worker` & `Cache、HTTP` 缓存、 `HTTP2 / Push` 缓存、`CDN` 缓存和代理缓存等。除此之外，还可以从工程化和应用逻辑层面出发进行优化，包括加载资源优化（公共代码切割 `Split Chunks`、共享远程依赖库 `Module Federation`）、预加载和预渲染等。接下来将简单演示部分优化技术在微前端场景中的使用。
::: tip
温馨提示：这里不会讲解 `Web` 前端性能优化相关的指标（例如 `FCP`、`TTI`）和性能检测工具（例如 `Lighthouse`、`Chrome DevTools`），感兴趣的同学需要自行了解。
:::
### HTTP 缓存
不管是主应用还是微应用，我们都需要对资源进行缓存处理。浏览器支持的缓存能力如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/0184b2fa26ef41d2aaa9b2380fc21821~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

- `Expires` & `Cache-Control`：`HTTP` 请求后的资源会缓存在浏览器本地，再次加载资源时，如果资源没有过期，直接使用本地缓存，不会向服务器发送请求
- `Last-Modified` & `Etag`：如果本地缓存的资源过期，浏览器会重新请求服务端，服务器会对资源的缓存有效性进行校验，如果缓存有效，则响应 304 告诉浏览器继续使用本地缓存，否则会响应 200 并返回新的资源

::: tip
温馨提示：`Expires` & `Cache-Control` 在大部分的科普文章中被称为强缓存，`Last-Modified` & `Etag`被称为协商缓存，但是在 HTTP 1.1 协议中没有发现类似的概述，大家可以自行查阅和理解。
:::

#### Expires & Cache-Control
本地缓存可以分为 HTTP / 1.0 的 Expires 和 HTTP / 1.1 的 Cache-Control，其中 "Expires" ":" HTTP-date 指定了响应过期的绝对时间，其计算规则如下所示：
~~~ts
// https://httpwg.org/specs/rfc7234.html#calculating.freshness.lifetime
// 缓存的新鲜度期限，从响应发送日期开始的时间差
// 响应头的 Expires 绝对时间 - 响应头 Date 的绝对时间
// 注意此种计算方式不会受到时钟偏差的影响，因为所有信息都来自于源服务器
freshness_lifetime = expires - date;

// https://httpwg.org/specs/rfc7234.html#age.calculations
// 从缓存中获取响应后到现在的时间差（计算过程比较复杂）
apparent_age = max(0, response_time - date_value);
response_delay = response_time - request_time;
corrected_age_value = age_value + response_delay;  
corrected_initial_age = max(apparent_age, corrected_age_value);
resident_time = now - response_time;
current_age = corrected_initial_age + resident_time;

// 响应是否刷新
response_is_fresh = (freshness_lifetime > current_age)
~~~
接下来我们实现一个例子：`freshness_lifetime` 设置为 5s，页面加载完成后第一次刷新直接响应 200 返回服务器资源，再次刷新由于超过 5s，也是从服务器响应 200 返回资源，紧接着立即刷新会从浏览器缓存中获取数据。

在服务代码中设置 `Expires` 响应头，如下所示：
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(
  express.static(path.join("public", "micro"), {
    // 禁用 cache-control，HTTP / 1.1 的缓存能力
    cacheControl: false,
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      // 5 秒后缓存失效，注意使用 GMT 格式时间
      res.set("Expires", new Date(Date.now() + 5 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
由于 `Expires` 使用了服务器的绝对时间，结合 `HTTP / 1.1` 协议标准和 [Chromium 的源码实现](https://github.com/chromium/chromium/blob/main/net/http/http_response_headers.cc)，我们会发现：
~~~c
// From RFC 2616 section 13.2.4:
//
// The max-age directive takes priority over Expires, so if max-age is present
// in a response, the calculation is simply:
//
//   freshness_lifetime = max_age_value
//
// Otherwise, if Expires is present in the response, the calculation is:
//
//   freshness_lifetime = expires_value - date_value
//
// Note that neither of these calculations is vulnerable to clock skew, since
// all of the information comes from the origin server.
//
// Also, if the response does have a Last-Modified time, the heuristic
// expiration value SHOULD be no more than some fraction of the interval since
// that time. A typical setting of this fraction might be 10%:
//
//   freshness_lifetime = (date_value - last_modified_value) * 0.10
//
// If the stale-while-revalidate directive is present, then it is used to set
// the |staleness| time, unless it overridden by another directive.
//
HttpResponseHeaders::FreshnessLifetimes
HttpResponseHeaders::GetFreshnessLifetimes(const Time& response_time) const {
  FreshnessLifetimes lifetimes;
  // Check for headers that force a response to never be fresh.  For backwards
  // compat, we treat "Pragma: no-cache" as a synonym for "Cache-Control:
  // no-cache" even though RFC 2616 does not specify it.
  if (HasHeaderValue("cache-control", "no-cache") ||
      HasHeaderValue("cache-control", "no-store") ||
      HasHeaderValue("pragma", "no-cache")) {
    return lifetimes;
  }

  // Cache-Control directive must_revalidate overrides stale-while-revalidate.
  bool must_revalidate = HasHeaderValue("cache-control", "must-revalidate");

  if (must_revalidate || !GetStaleWhileRevalidateValue(&lifetimes.staleness)) {
    DCHECK_EQ(base::TimeDelta(), lifetimes.staleness);
  }

  // NOTE: "Cache-Control: max-age" overrides Expires, so we only check the
  // Expires header after checking for max-age in GetFreshnessLifetimes.  This
  // is important since "Expires: <date in the past>" means not fresh, but
  // it should not trump a max-age value.
  if (GetMaxAgeValue(&lifetimes.freshness))
    return lifetimes;

  // If there is no Date header, then assume that the server response was
  // generated at the time when we received the response.
  Time date_value;
  // 如果没有收到响应头 Date，那么假设服务器响应的时间是我们接收到响应时浏览器产生的绝对时间
  if (!GetDateValue(&date_value))
    date_value = response_time;

  Time expires_value;
  if (GetExpiresValue(&expires_value)) {
    // The expires value can be a date in the past!
    if (expires_value > date_value) {
      lifetimes.freshness = expires_value - date_value;
      return lifetimes;
    }

    DCHECK_EQ(base::TimeDelta(), lifetimes.freshness);
    return lifetimes;
  }
  
  // 剩余代码未展示
}

bool HttpResponseHeaders::GetDateValue(Time* result) const {
  return GetTimeValuedHeader("Date", result);
}
~~~
如果服务器没有返回响应头 `Date`，那么 `date_value` 使用的是客户端产生的绝对时间，此时因为 `Expires` 使用服务器产生的绝对时间，如果两者的时钟本身存在偏差，那么会产生缓存计算偏差，从而可能导致缓存失效。为了解决两者时钟不一致的问题，`HTTP / 1.1` 使用 `Cache-Control` 进行缓存，并且设置的不再是绝对时间：
~~~c
// 缓存的新鲜度期限（注意这里如果是 s-maxage，则 s-maxage 优先，s-maxage 只对共享缓存生效）
// 感兴趣的同学可以了解一下共享缓存和私有缓存的区别
freshness_lifetime = maxAge
~~~
实现一个例子：设置了 `20s（max-age = 20000 ）` 的缓存时间，并且保留了原有的 `Expires`，可以发现原有 5s 的缓存时间失效，因此 `Cache-Control` 设置的 `max-age` 优先级高于 `Expires`

在服务代码中设置 `max-age` 缓存，如下所示：
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(
  express.static(path.join("public", "micro"), {
    // 默认为 true
    // 使用 cache-control，HTTP / 1.1 的缓存能力
    cacheControl: true,
    // 内部会封装成 Cache-Control 响应头的形式进行响应
    // 单位是 ms，这里设置 20s
    maxAge: 20000,
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      // 5 秒后缓存失效，注意使用 GMT 格式时间
      res.set("Expires", new Date(Date.now() + 5 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
尽管 `Expires` 和 `Cache-Control` 可以控制本地缓存的失效时间，但是如果服务端的资源没有任何变化，此时浏览器缓存失效仍然会重新请求资源。那么能否有一种方式，就算是浏览器本地缓存失效，如果服务端资源没有任何变化，我们可以延长本地缓存的有效期。为了实现该功能，`HTTP` 请求可以通过 `Last-Modified` 和 `Etag` 来校验服务器资源是否发生了变更，如果资源没有变化，那么可以返回 304 （不需要携带资源）告诉浏览器继续使用本地缓存。

#### Last-Modified & Etag
`Last-Modified` 的示例中我们使用了 `Cache-Control` 来设置本地缓存，使用 `Last-Modified` 来设置服务器文件的缓存有效性校验。如果 `Cache-Control` 设置的本地缓存失效，浏览器会向服务器发送缓存校验的请求，此时浏览器会通过发送请求头 `If-Modified-Since` （第一次获取文件资源时服务器的响应头 `Last-Modified` 值）给服务器进行缓存校验，服务器获取 `If-Modified-Since` 响应头后会再次获取文件的修改时间来比对文件是否发生改变，如果服务器的文件没有改动（或者早于 `If-Modified-Since` 修改时间 ），那么请求会返回 304 告诉浏览器继续使用本地缓存，如果服务器文件发生了改动，那么服务器会返回 200 和新的文件并促使浏览器重新刷新本地的缓存资源。

在服务代码中开启 `Last-Modified` 校验，如下所示：
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(
  express.static(path.join("public", "micro"), {
    // 使用 cache-control，HTTP / 1.1 的缓存能力
    cacheControl: true,
    // 单位是 ms，这里设置 5s
    maxAge: 5000,
    etag: false,
    lastModified: true,
    setHeaders: (res) => {
      // 1 秒后缓存失效，注意使用 GMT 格式时间
      res.set("Expires", new Date(Date.now() + 1 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
`Last-Modified` 服务器校验会存在如下问题：
- 缓存校验的时间精度是秒，如果一秒内服务器文件进行了多次刷新，尽管文件内容发生了变化，但是由于文件修改时间不变，导致客户端请求时返回的仍然是 304，当然这也可能是服务器正好想要的效果，不想频繁更新
- 缓存的文件内容不变，但是修改时间发生了变化，此时会导致服务器返回 200 从而产生不必要的文件刷新
- 服务器不方便保存文件的修改时间

为了应对上述 `Last-Modified` 产生的问题，可以使用 `Etag` 来进行校验。`Etag` 可用于代表源服务器文件的唯一性，例如根据源服务器的文件内容生成 `Hash` 值，当文件不变时 `Hash` 值不变，当文件内容变化时 `Hash` 值也会跟着变化，从而可用于校验文件内容是否改变。当浏览器接收到 `Etag` 响应头时，如果缓存文件过期，再次发送请求时会携带 `If-None-Match` （之前响应的 `Etag` 值）请求头向服务器进行验证，服务器会重新计算文件的 `Etag` 值并和 `If-None-Match` 比对，如果比对一致则返回 304 告诉浏览器本地缓存仍然有效。

在服务代码中开启 `Etag` 校验，如下所示：
~~~ts
// micro-server.js
import express from "express";
import morgan from "morgan";
import path from "path";
import config from "./config.js";
const app = express();
const { port, host } = config;

// 打印请求日志
app.use(morgan("dev"));

app.use(
  express.static(path.join("public", "micro"), {
    cacheControl: true,
    maxAge: 5000,
    etag: true,
    // 如果设置为 true，那么上述示例中访问拷贝的文件是返回 304 还是 200 呢？
    lastModified: false,
    setHeaders: (res) => {
      // 1 秒后缓存失效，注意使用 GMT 格式时间
      res.set("Expires", new Date(Date.now() + 1 * 1000).toGMTString());
    },
  })
);

// 启动 Node 服务
app.listen(port.micro, host);
console.log(`server start at http://${host}:${port.micro}/`);
~~~
::: tip
温馨提示：`Etag` 存在强校验和弱校验，`Last-Modified` 属于弱校验。由于在 `Express` 中 `Etag` 默认开启弱校验，并且在计算时添加了文件的修改时间，因此拷贝文件（修改时间变化但内容不变）时，仍然会刷新缓存。本课程为了帮助大家验证 `Etag` 可以做到访问拷贝文件仍然使用缓存，更改了底层的 `Etag` 计算逻辑。感兴趣的同学可以查看 `Express` 依赖的 `etag` 和 `fresh` 库，从而了解底层的校验算法。除此之外，如果对 `Etag` 强弱校验感兴趣，可以查看 [Weak versus Strong](https://httpwg.org/specs/rfc7232.html#weak.and.strong.validators)。
:::

### Resource Hints
`Resource Hints` 可分为 `DNS Prefetch`、`Preconnect`、`Prefetch`、`Prerender`，如下所示：
- `DNS Prefetch`：提前处理需要 `DNS` 解析的域名，可以很好的解决移动设备 `DNS` 的高延迟解析问题，主要作用是将域名提前解析成相应的 `IP` 地址，浏览器的兼容性可以查看 `dns-prefetch`；
- `Preconnect`：提前为 `URL` 建立请求连接，包括进行 `DNS` 解析、`TPC` 协议三次握手甚至是 `SSL / TLS` 协议握手，浏览器兼容性可以查看 `preconnect`；
- `Prefetch`：除了提前为 `URL` 建立请求连接，还会请求资源并进行缓存处理，浏览器兼容性可以查看 `prefetch`；
- `Prerender`：除了提前请求并缓存资源，还可以进行应用预渲染，预渲染可以理解为在隐藏的标签页中进行应用的渲染工作，浏览器兼容性可以查看 `prerender`。

::: tip
温馨提示：需要注意，如果在 `SPA` 应用中使用微前端，并且应用本身是通过 `JS` 进行加载，那么无法使用 `Prerender`。除此之外，感兴趣的同学可以额外了解 `Preload` 的作用。
:::

如果应用本身能够准确预测接下来的用户行为，那么使用 `Resource Hints` 是一个非常不错的选择，因为 `Resource Hints` 允许浏览器在空闲时进行稍后可能需要进行的动作，从而提升用户的访问性能。当然，如果预测失败，也会带来副作用，例如 `Prefetch` 额外产生了流量损耗，而 `Prerender` 更是占用了浏览器的内存以及 `CPU`，对电池也会产生更多的消耗。

::: tip
温馨提示：举一个相对明显的例子，当用户访问管理后台的登录页时，此时能够预测用户需要登录管理后台首页，因此可以对登录后的首页进行访问性能优化。
:::

在 `SPA` 的微前端应用中，可以通过 `Prefetch` 来提升用户访问应用的性能。以 `TO B` 类型的管理后台应用为例，应用本身的 `PV` / `UV` 体量小，因此使用 `Prefetch` 不需要过多担心带宽和流量的问题。当然如果需要在意流量问题，但是仍然想做一些访问性能优化，可以先在应用中进行菜单埋点，后期通过收集用户的点击行为进行菜单访问数据分析，从而为高频的菜单应用进行性能优化处理。

`Prefetch` 的实现示例是在之前的 `HTTP` 缓存示例的基础上新增 `Prefetch` 处理，可以发现刷新的时候默认会请求微应用的资源。当真正点击微应用加载资源时会从 `prefetch cache` 中直接获取资源，从而不需要从服务端获取资源。

`Prefetch` 的功能主要在前端进行设计，如下所示（重点关注注释部分的代码）：
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
    <h1>Hello，Dynamic Script!</h1>
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

        // 预请求资源，注意只是请求资源，但是不会解析和执行
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
            document.body.appendChild($style);
          });
        }

        removeStyle({ id }) {
          const $style = document.querySelector(`[micro-style=${id}]`);
          $style && $style?.parentNode?.removeChild($style);
        }

        removeScript({id}) {
          const $script = document.querySelector(`[micro-script=${id}]`);
          $script && $script?.parentNode?.removeChild($script);
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
        
        // 新增 prefetch 处理，浏览器会在空闲时自动请求相应的资源
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
          window.addEventListener("hashchange", () => {
            this.microApps?.forEach(async (microApp) => {
              if (microApp.id === window.location.hash.replace("#", "")) {
                console.time(`fetch microapp ${microApp.name} static`);
                await this.loadStyle(microApp);
                await this.loadScript(microApp);
                console.timeEnd(`fetch microapp ${microApp.name} static`);
                window?.[microApp.mount]?.("#micro-app-slot");
              } else {
                this.removeStyle(microApp);
                this.removeScript(microApp);
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
如果浏览器自身不兼容 `Prefetch` 的能力或者资源需要通过 `Ajax` 请求进行手动隔离执行时，我们也可以在浏览器空闲的时候通过 `JS` 进行资源的 `Ajax` 预请求处理。

## 应用预渲染
在 `Resource Hints` 中我们演示了 `Prefetch` 的功能，该功能可以在我们真正想要渲染应用时节省资源的请求时间。同时我们也知道浏览器的 `Prerender` 功能可以提前进行应用的预渲染，从而节省资源的解析和渲染时间，但是 `Prerender` 必须传入完整的 `HTML` 地址，对于 `MPA` 的应用相对合适。如果我们的微前端运行在 `SPA` 模式下，并且我们的微应用需要手动处理隔离，那么我们需要通过 `Ajax` 的形式对资源进行提前请求（手动实现 `Prefetch` 能力），并通过手动执行的方式实现应用的预渲染。需要注意，预渲染需要微前端具备隔离能力，因为同一时刻会存在两个甚至多个同时运行的微应用，此时快照隔离无法满足预渲染的能力诉求。

除此之外，使用浏览器自带的 `Prefetch` 命中的缓存能力是浏览器自身的控制能力，而手动实现 `Prefetch` 的缓存能力则完全可以由开发者自行决定，可以是 `SessionStorage` 缓存，也可以是 `LocalStorage` 缓存（属于黑科技），当然最常见的是当前应用执行期间的临时缓存能力。

由于需要手动在浏览器空闲时执行 `Prefetch` 和 `Prerender`，我们需要使用 `requestIdleCallback`，该 `API` 将在浏览器主线程空闲时被调用，执行时机如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/96b3928a30d843eab575603acb940907~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

从上图可以发现，在当前一帧完成用户的输入处理、页面的渲染信息计算以及合成之后，如果下一帧 `Frame Start` 未开始（感兴趣的同学可以了解一下 `Vsync` 信号）、用户没有进行输入或者队列中没有可执行的任务，此时浏览器会进入空闲时间，从而会执行 `requestIdleCallback`，可以来看个示例：
~~~ts
console.log("start");

function runMicroTask() {
    Promise.resolve().then(() => {
        console.log("run microtask");
    });
}

runMicroTask();

function loopRaf() {
    // requestAnimationFrame 回调中的 requestAnimationFrame 是在当前帧还是下一帧执行？
    requestAnimationFrame(() => {
        console.log("loop requestAnimationFrame");
        runMicroTask();
        loopRaf();
    });
}

loopRaf();

function loopRic() {
    // requestIdleCallback 回调中的 requestIdleCallback 是在当前帧还是下一帧执行？
    requestIdleCallback(() => {
        console.log("loop requestIdleCallback");
        runMicroTask();
        loopRic();
    });
}

loopRic();
~~~
正确的打印顺序如下所示：
~~~ts
start
// 微任务立即执行
run microtask
loop requestAnimationFrame
// requestAnimationFrame 中回调的微任务立即执行
run microtask
loop requestIdleCallback
// requestIdleCallback 中回调的微任务立即执行
run microtask
loop requestAnimationFrame
run microtask
loop requestIdleCallback
...
~~~
从 `Chrome DevTools` 的 `Performance` 面板可以发现，`requestIdleCallback` 的执行时机和上图相符。

`requestIdleCallback` 可以通过回调参数来查看当前浏览器空闲的剩余时间，具体如下所示：
~~~ts
function loopRic() {
    requestIdleCallback((idleDeadline) => {
        console.log("loop requestIdleCallback");
        // 查看浏览器当前的剩余空闲时间
        console.log("timeRemaining: ", idleDeadline.timeRemaining());
        loopRic();
    });
}

loopRic();
~~~
如果浏览器的主线程处于空闲状态，例如没有 `Frame` 刷新，那么 `requestIdleCallback` 可执行的空闲时间最长可达 50ms。如果有用户的输入事件、动画、`microTasks`、`tasks` 等需要执行，那么主线程可执行的空闲时间会变短。通过 [RAIL 性能模型](https://web.dev/rail/) 可以发现 0 ~ 100ms 内响应用户的操作会让用户觉得体验良好，可执行的空闲时间最长可达 50ms 的情况下，建议在剩余的 50ms 内尽快处理用户响应，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/7c1b2fdd63304e5a9e351c06f18a7937~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

除此之外，通过上述基础知识我们会发现，在 `requestIdleCallback` 中：
- 单次执行任务的时间尽量不要超过 50ms，否则可能会影响用户的交互体验
- 如果任务执行时间长，可以通过类似于 `React` 任务调度的方式实现时间切片来分段执行
- 浏览器非空闲时尽量不要进行 `DOM` 更改的操作，防止当前一帧需要[重新计算页面布局](https://developer.chrome.com/blog/using-requestidlecallback/#using-requestidlecallback-to-make-dom-changes)
- 浏览器非空闲时尽量避免在回调中使用 `Promise`，因为会在回调结束后立即执行，从而可能会影响下一帧，此时可以通过 `Task` 执行任务，从而让出浏览器主线程的执行权

::: tip
温馨提示：在 `requestAnimationFrame` 中更改 DOM 合适吗？可以阅读 [Using requestIdleCallback](https://developer.chrome.com/blog/using-requestidlecallback/) 获取答案。
:::

应用预渲染后节省了网络请求和应用解析时间，从而提升了应用的访问速度。预渲染基本上不需要对服务端和微应用进行改造，我们重点看下前端主应用的代码实现：
~~~html
<!-- public/main/index.html -->

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Main App Document</title>
  </head>

  <body>
    <h1>Hello，Sandbox Script!</h1>

    <div id="nav"></div>

    <div id="container"></div>

    <script type="text/javascript">
      class IframeSandbox {
        options = null;
        iframe = null;
        iframeWindow = null;
        execScriptFlag = false;

        constructor(options) {
          this.options = options;
          this.iframe = this.createIframe();
          this.iframeWindow = this.iframe.contentWindow;
          this.proxyIframeWindow();
        }

        createIframe() {
          const { rootElm, id, url } = this.options;
          const iframe = window.document.createElement("iframe");
          const attrs = {
            src: "about:blank",
            "app-id": id,
            "app-src": url,
            style: "border:none;width:100%;height:100%;",
          };
          Object.keys(attrs).forEach((name) => {
            iframe.setAttribute(name, attrs[name]);
          });
          rootElm?.appendChild(iframe);
          return iframe;
        }

        isBoundedFunction(fn) {
          return (
            fn.name.indexOf("bound ") === 0 && !fn.hasOwnProperty("prototype")
          );
        }

        isConstructable(fn) {
          return (
            fn.prototype &&
            fn.prototype.constructor === fn &&
            Object.getOwnPropertyNames(fn.prototype).length > 1
          );
        }

        getTargetValue(target, prop) {
          const value = target[prop];

          if (
            typeof value === "function" &&
            !this.isBoundedFunction(value) &&
            !this.isConstructable(value)
          ) {
            console.log("修正 this: ", prop);
            const boundValue = Function.prototype.bind.call(value, target);
            for (const key in value) {
              boundValue[key] = value[key];
            }
            if (
              value.hasOwnProperty("prototype") &&
              !boundValue.hasOwnProperty("prototype")
            ) {
              boundValue.prototype = value.prototye;
            }
            return boundValue;
          }
          return value;
        }

        proxyIframeWindow() {
          this.iframeWindow.proxy = new Proxy(this.iframeWindow, {
            get: (target, prop) => {
              if (prop === "history" || prop === "location") {
                return window[prop];
              }

              if (prop === "window" || prop === "self") {
                return this.iframeWindow.proxy;
              }

              return this.getTargetValue(target, prop);
            },

            set: (target, prop, value) => {
              target[prop] = value;
              return true;
            },

            has: (target, prop) => true,
          });
        }

        execScript() {
          const scriptElement =
            this.iframeWindow.document.createElement("script");
          scriptElement.textContent = `
              (function(window) {
                with(window) {
                  ${this.options.scriptText}
                }
              }).bind(window.proxy)(window.proxy);
              `;
          this.iframeWindow.document.head.appendChild(scriptElement);
        }

        async active() {
          this.iframe.style.display = "block";
          if (this.execScriptFlag) return;
          this.execScript();
          this.execScriptFlag = true;
        }

        // 预渲染
        prerender() {
          this.iframe.style.display = "none";
          // 如果已经通过 Script 加载并执行过 JS，则无需重新加载处理
          if (this.execScriptFlag) return;
          this.execScript();
          this.execScriptFlag = true;
        }

        inactive() {
          this.iframe.style.display = "none";
        }

        destroy() {
          this.options = null;
          this.exec = false;
          if (this.iframe) {
            this.iframe.parentNode?.removeChild(this.iframe);
          }
          this.iframe = null;
        }
      }

      class MicroAppManager {
        scriptText = "";
        sandbox = null;
        rootElm = null;

        constructor(rootElm, app) {
          this.rootElm = rootElm;
          this.app = app;
        }

        async fetchScript() {
          try {
            const res = await window.fetch(this.app.script);
            return await res.text();
          } catch (err) {
            console.error(err);
          }
        }

        // 预渲染
        rerender() {
          // 当前主线程中存在多个并行执行的 requestIdleCallback 时，浏览器会根据空闲时间来决定要在当前 Frame 还是下一个 Frame 执行
          requestIdleCallback(async () => {
            // 预请求资源
            this.scriptText = await this.fetchScript();
            // 预渲染处理
            this.idlePrerender();
          });
        }

        idlePrerender() {
          // 预渲染
          requestIdleCallback((dealline) => {
            console.log("deadline: ", dealline.timeRemaining());
            // 这里只有在浏览器非常空闲时才可以进行操作
            if (dealline.timeRemaining() > 40) {
              // TODO: active 中还可以根据 Performance 性能面板进行再分析，如果内部的某些操作比较耗时，可能会影响下一帧的渲染，则可以放入新的 requestIdleCallback 中进行处理
              // 除此之外，例如在子应用中可以先生成虚拟 DOM 树，预渲染不做 DOM 更改处理，真正切换应用的时候进行 DOM 挂载
              // 也可以在挂载应用的时候放入 raF 中进行处理
              this.active(true);
            } else {
              this.idlePrerender();
            }
          });
        }

        async active(isPrerender) {
          if (!this.scriptText) {
            this.scriptText = await this.fetchScript();
          }
          
          if (!this.sandbox) {
            this.sandbox = new IframeSandbox({
              rootElm: this.rootElm,
              scriptText: this.scriptText,
              url: this.app.script,
              id: this.app.id,
            });
          }

          isPrerender ? this.sandbox.prerender() : this.sandbox.active();
        }

        inactive() {
          this.sandbox?.inactive();
        }
      }

      class MicroManager {
        appsMap = new Map();
        rootElm = null;

        constructor(rootElm, apps) {
          this.rootElm = rootElm;
          this.initApps(apps);
        }

        initApps(apps) {
          apps.forEach((app) => {
            const appManager = new MicroAppManager(this.rootElm, app);
            this.appsMap.set(app.id, appManager);
            // 通过服务端配置来决定是否需要开启微应用的预渲染
            if (app.prerender) {
              appManager.rerender();
            }
          });
        }

        activeApp(id) {
          const current = this.appsMap.get(id);
          current && current.active();
        }

        inactiveApp(id) {
          const current = this.appsMap.get(id);
          current && current.inactive();
        }
      }

      class MainApp {
        microApps = [];
        microManager = null;

        constructor() {
          this.init();
        }

        async init() {
          this.microApps = await this.fetchMicroApps();
          this.createNav();
          this.navClickListener();
          this.hashChangeListener();
          this.microManager = new MicroManager(
            document.getElementById("container"),
            this.microApps
          );
        }

        async fetchMicroApps() {
          try {
            const res = await window.fetch("/microapps", {
              method: "post",
            });
            return await res.json();
          } catch (err) {
            console.error(err);
          }
        }

        createNav(microApps) {
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
          window.addEventListener("hashchange", () => {
            this.microApps?.forEach(async ({ id }) => {
              id === window.location.hash.replace("#", "")
                ? this.microManager.activeApp(id)
                : this.microManager.inactiveApp(id);
            });
          });
        }
      }

      new MainApp();
    </script>
  </body>
</html>
~~~
::: tip
温馨提示：真正在框架的设计中需要考虑微应用的运行状态，对运行状态进行防冲突处理，例如当前预渲染正在进行中，但是用户直接点击应用进行加载，需要处理两者的状态冲突问题，防止应用产生不必要的渲染。
:::

## 框架原理：通信
主应用和微应用在运行期间可能需要实现主子应用之间的通信，接下来将重点讲解微前端的通信方式以及实现示例。

### 通信模式
在了解微前端的通信方式之前，我们先来了解两种常用的通信模式：**观察者和发布 / 订阅模式**。两者最主要的区别是一对多单向通信还是多对多双向通信的问题。以微前端为例，如果只需要主应用向各个子应用单向广播通信，并且多个子应用之间互相不需要通信，那么只需要使用观察者模式即可，而如果主应用需要和子应用双向通信，或者子应用之间需要实现去中心化的双向通信，那么需要使用发布 / 订阅模式。

在浏览器中会使用观察者模式来实现**内置 API 的单向通信**，例如 `IntersectionObserver`、`MutationObserver`、`ResizeObserver` 以及 `PerformanceObserver` 等，而发布 / 订阅模式则通常是框架提供的一种供外部开发者自定义通信的能力，例如浏览器中的 `EventTarget`、`Node.js` 中的 `EventEmitter`、`Vue.js` 中的 `$emit` 等。

### 观察者模式
观察者模式需要包含 `Subject` 和 `Observer` 两个概念，其中 `Subject` 是需要被观察的目标对象，一旦状态发生变化，可以通过广播的方式通知所有订阅变化的 `Observer`，而 `Observer` 则是通过向 `Subject` 进行消息订阅从而实现接收 `Subject` 的变化通知，具体如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/e231141543db4bd9bbbc114c6e7da0c1~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

我们以浏览器的 `MutationObserver` 为例，来看下观察者模式如何运作：
~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="subject"></div>
  </body>

  <script>
    // 当观察到变动时执行的回调函数
    const callback = function (mutationsList, observer) {
      // Use traditional 'for loops' for IE 11
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log("A child node has been added or removed.");
        } else if (mutation.type === "attributes") {
          console.log(
            "The " + mutation.attributeName + " attribute was modified."
          );
        }
      }
    };

    // 创建第一个 Observer
    const observer1 = new MutationObserver(callback);

    // Subject 目标对象
    const subject = document.getElementById("subject");
    
    // Observer 的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };

    // Observer 订阅 Subject 的变化
    observer1.observe(subject, config);

    // 创建第二个 Observer
    const observer2 = new MutationObserver(callback);

    // Observer 订阅 Subject 的变化
    observer2.observe(subject, config);

    // Subject 的属性变化，会触发 Observer 的 callback 监听
    subject.className = "change class";
    
    // Subject 的子节点变化，会触发 Observer 的 callback 监听
    subject.appendChild(document.createElement("span"));

    // 这里为什么需要 setTimeout 呢？如果去除会有什么影响吗？
    setTimeout(() => {
      // 取消订阅
      observer1.disconnect();
      observer2.disconnect();
    });
  </script>
</html>
~~~
当 `DOM` 元素（`Subject` 目标对象）改变自身的属性或者添加子元素时，都会将自身的状态变化单向通知给所有订阅该变化的观察者。当然上述 `Web API` 内部包装了很多功能，例如观察者配置。我们可以设计一个更加便于理解的观察者通信方式：
~~~ts
class Subject {
  constructor() {
    this.observers = [];
  }

  // 添加订阅
  subscribe(observer) {
    this.observers.push(observer);
  }

  // 取消订阅
  unsubscribe() {}

  // 广播信息
  broadcast() {
    this.observers.forEach((observer) => observer.update());
  }
}

class Observer {
  constructor() {}

  // 实现一个 update 的接口，供 subject 耦合调用
  update() {
    console.log("observer update...");
  }
}

const subject = new Subject();

subject.subscribe(new Observer());

subject.broadcast();

subject.subscribe(new Observer());

subject.broadcast();
~~~
上述观察者模式没有一个实体的 `Subject` 对象，我们可以结合 `DOM` 做一些小小的改动，例如：
~~~html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!-- 目标对象 -->
    <input type="checkbox" id="checkbox" />

    <!-- 观察者 -->
    <div id="div"></div>
    <h1 id="h1"></h1>
    <span id="span"></span>

    <script>
      class Subject {
        constructor() {
          this.observers = [];
        }

        // 添加订阅
        subscribe(observer) {
          this.observers.push(observer);
        }

        // 取消订阅
        unsubscribe() {}

        // 广播信息
        broadcast(value) {
          this.observers.forEach((observer) => observer.update(value));
        }
      }

      // 观察的目标对象
      const checkbox = document.getElementById("checkbox");

      // 将 subject 实例挂载到 DOM 对象上（也可以单独使用）
      checkbox.subject = new Subject();

      checkbox.onclick = function (event) {
        // 通知观察者 checkbox 的变化
        checkbox.subject.broadcast(event.target.checked);
      };

      // 观察者
      const span = document.getElementById("span");
      const div = document.getElementById("div");
      const h1 = document.getElementById("h1");

      // 观察者实现各自 update 接口
      span.update = function (value) {
        span.innerHTML = value;
      };
      div.update = function (value) {
        div.innerHTML = value;
      };
      h1.update = function (value) {
        h1.innerHTML = value;
      };

      // 添加订阅
      checkbox.subject.subscribe(span);
      checkbox.subject.subscribe(div);
      checkbox.subject.subscribe(h1);
    </script>
  </body>
</html>
~~~
### 发布 / 订阅模式
发布 / 订阅模式需要包含 `Publisher`、`Channels` 和 `Subscriber` 三个概念，其中 Publisher 是信息的发送者，`Subscriber` 是信息的订阅者，而 `Channels` 是信息传输的通道，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/393f05012c7e4c0b848d8ee758c7559f~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

发布者可以向某个通道传输信息，而订阅者则可以订阅该通道的信息变化。通过新增通道，可以将发布者和订阅者解耦出来，从而形成一种去中心化的通信模式。如上图所示，订阅者本身也可以是发布者，从而实现事件的双向通信。我们以浏览器的 `EventTarget` 为例，来看下发布 / 订阅模式如何运作：
~~~ts
const event = new EventTarget();
// event 是订阅者
event.addEventListener("channel1", (e) => console.log(e.detail));
// event 是发布者
event.dispatchEvent(
  new CustomEvent("channel1", { detail: { hello: true } })
);
event.dispatchEvent(
  new CustomEvent("channel2", { detail: { hello: true } })
);
// 由于先发布后订阅，导致订阅失败，但是发布者不感知订阅者的失败状态
event.addEventListener("channel2", (e) => console.log(e.detail));
~~~
我们可以通过简单的几行代码实现上述功能，如下所示：
~~~ts
class Event {
  constructor() {
    this.channels = {};
    // 这里的 token 也可以是随机生成的 uuid
    this.token = 0;
  }

  // 实现订阅
  subscribe(channel, callback) {
    if (!this.channels[channel]) this.channels[channel] = [];
    this.channels[channel].push({
      channel,
      token: ++this.token,
      callback,
    });
    return this.token;
  }

  // 实现发布
  publish(channel, data) {
    const subscribers = this.channels[channel];
    if (!subscribers) return;
    let len = subscribers.length;
    while (len--) {
      subscribers[len]?.callback(data, subscribers[len].token);
    }
  }

  // 取消订阅
  unsubscribe(token) {
    for (let channel in this.channels) {
      const index = this.channels[channel].findIndex(
        (subscriber) => subscriber.token === token
      );
      if (index !== -1) {
        this.channels[channel].splice(index, 1);
        if (!this.channels[channel].length) {
          delete this.channels[channel];
        }
        return token;
      }
    }
  }
}

const event = new Event();
const token = event.subscribe("channel1", (data) => console.log('token: ', data));
const token1 = event.subscribe("channel1", (data) => console.log('token1: ', data));
// 打印 token 和 token1
event.publish("channel1", { hello: true });
event.unsubscribe(token);
// 打印 token1，因为 token 取消了订阅
event.publish("channel1", { hello: true });
~~~
发布 / 订阅模式和观察者模式存在明显差异，首先在功能上观察者模式是一对多的单向通信模式，而发布 / 订阅模式是多对多的双向通信模式。其次观察者模式需要一个中心化的 `Subject` 广播消息，并且需要感知 `Observer`（例如上述的 `observers` 列表) 实现通知，是一种紧耦合的通信方式。而发布 / 订阅模式中的发布者只需要向特定的通道发送信息，并不感知订阅者的订阅状态，是一种松散解耦的通信方式。

### 微前端通信
在微前端中往往需要实现多对多的双向通信模式，例如微应用之间实现通信，主应用和微应用之间实现通信，因此使用发布 / 订阅模式是一种不错的选择。如果微应用和主应用处于同一个全局执行上下文，那么可以利用 `window` 变量实现通信，因为 `window` 实现了 [EventTarget](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget) 的通信接口，例如常见的 `single-spa`，它会将应用的生命周期通过 `EventTarget` （`window.dispatchEvent`）的形式广播出来，从而可以使得 `qiankun` 实现监听处理。

~~~ts
// 主应用
window.addEventListener("microChannel", (e) => {
  console.log("main addEventListener: ", e);

  window.dispatchEvent(
    new CustomEvent("mainChannel", {
      detail: "main",
    })
  );
});
~~~
~~~ts
// iframe 子应用1（加载以后立马触发）
window.parent.addEventListener("mainChannel", (e) => {
  console.log("micro1 addEventListener: ", e);
});

window.parent.dispatchEvent(
  new CustomEvent("microChannel", {
    detail: "micro1",
  })
);
~~~
~~~ts
// iframe 子应用2
window.parent.addEventListener("mainChannel", (e) => {
  console.log("micro2 addEventListener: ", e);
});

window.parent.dispatchEvent(
  new CustomEvent("microChannel", {
    detail: "micro2",
  })
);
~~~
需要注意使用发布 / 订阅模式时先进行订阅处理，从而防止发布后没有及时订阅导致消息丢失。例如上述示例，如果微应用先发布消息然后再进行消息订阅，那么会使得首次无法接收消息。
::: tip
温馨提示：如果想使用自定义的发布 / 订阅模式，可以在 `window` 上挂载一个发布 / 订阅对象实现通信。除此之外，如果通信消息并不是所有子应用都可以订阅，那么可以通过类似于 `props` 的方式传递发布 / 订阅对象给需要的子应用进行处理，例如 `Web Components` 中可以通过属性的方式进行对象传递，从而实现特定范围内的通信。
:::
当然，如果主应用和微应用不同域的情况下通信，则会报跨域的错误：
~~~html
<!-- main.html：http://30.120.112.80:4000/ -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通信测试</title>
  </head>
  <body>
    <h1>main 应用</h1>
    <br />
    <!-- 跨域应用：iframe.html -->
    <iframe id="iframe" src="<%= iframeUrl %>"></iframe>

    <script>
      const iframe = document.getElementById("iframe");

      iframe.onload = () => {
        window.dispatchEvent(
          new CustomEvent({
            detail: "main",
          })
        );
        
        // (index):14 Uncaught DOMException: Blocked a frame with origin "http://30.120.112.80:4000" 
        // from accessing a cross-origin frame. at http://30.120.112.80:4000/:14:21
        iframe.contentWindow.dispatchEvent(
          new CustomEvent({
            detail: "iframe",
          })
        );
      };
    </script>
  </body>
</html>
~~~
~~~html
<!-- 跨域的 iframe.html：http://30.120.112.80:3000/ -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>跨域的 iframe 应用</title>
  </head>
  <body>
    <h1>跨域的 iframe 应用</h1>

    <script>
    
      // (index):14 Uncaught DOMException: Blocked a frame with origin "http://30.120.112.80:3000" 
      // from accessing a cross-origin frame. at http://30.120.112.80:3000/:14:21
      window.parent.addEventListener('main', (e) => {
        console.log('iframe addEventListener: ', e);
      })

      window.addEventListener('iframe', (e) => {
        console.log('iframe addEventListener: ', e);
      })
    </script>
  </body>
</html>
~~~
此时可以通过 `postMessage` 实现跨域通信：
~~~html
<!-- main.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>通信测试</title>
  </head>
  <body>
    <h1>main 应用</h1>
    <br />
    <!-- 跨域应用：iframe.html -->
    <iframe id="micro1" src="<%= micro1 %>"></iframe>
    <iframe id="micro2" src="<%= micro2 %>"></iframe>

    <script>
      const micro1 = document.getElementById("micro1");
      const micro2 = document.getElementById("micro2");

      // 等待 iframe 加载完毕后才能通信
      micro1.onload = () => {
        // 给子应用发送消息，注意明确 targetOrigin
        micro1.contentWindow.postMessage("main", "<%= micro1 %>");
      };

      micro2.onload = () => {
        micro2.contentWindow.postMessage("main", "<%= micro2 %>");
      };

      // 接收来自于 iframe 的消息
      window.addEventListener("message", (data) => {
        // 通过 data.origin 来进行应用过滤
        if (
          data.origin === "<%= micro1 %>" ||
          data.origin === "<%= micro2 %>"
        ) {
          console.log("main: ", data);
        }
      });
    </script>
  </body>
</html>
~~~
~~~html
<!-- micro1.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>跨域的 iframe 应用</title>
  </head>
  <body>
    <h1>跨域的 iframe 应用</h1>

    <script>
      window.addEventListener("message", (data) => {
        console.log("micro1: ", data);

        if (data.origin === "<%= mainUrl %>") {
          window.parent.postMessage("micro1", "<%= mainUrl %>");
        }
      });
    </script>
  </body>
</html>
~~~
~~~html
<!-- micro2.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>跨域的 iframe 应用</title>
  </head>
  <body>
    <h1>跨域的 iframe 应用</h1>

    <script>
      window.addEventListener("message", (data) => {
        console.log("micro2: ", data);
        if (data.origin === "<%= mainUrl %>") {
          window.parent.postMessage("micro1", "<%= mainUrl %>");
        }
      });
    </script>
  </body>
</html>
~~~
三者的服务端设计如下所示：
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
    micro1: 3000,
    micro2: 2000
  },

  // 获取本机的 IP 地址
  host: ip.address(),

  __dirname
};
~~~
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
  // 使用 ejs 模版引擎填充主应用 views/main.html 中的 micro 变量，并将其渲染到浏览器
  res.render("main", {
    // 填充子应用的地址，只有端口不同，iframe 应用和 main 应用跨域
    micro1: `http://${host}:${port.micro1}`,
    micro2: `http://${host}:${port.micro2}`
  });
});

// 启动 Node 服务
app.listen(port.main, host);
console.log(`server start at http://${host}:${port.main}/`);
~~~
~~~ts
// micro1-server.js
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
  res.render("micro1", {
    mainUrl:  `http://${host}:${port.main}`
  });
});

// 启动 Node 服务
app.listen(port.micro1, host);
console.log(`server start at http://${host}:${port.micro1}/`);
~~~
~~~ts
// micro2-server.js
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
  res.render("micro2", {
    mainUrl:  `http://${host}:${port.main}`
  });
});

// 启动 Node 服务
app.listen(port.micro2, host);
console.log(`server start at http://${host}:${port.micro2}/`);
~~~

## 工程设计：设计要素
接下来需要根据原理进行通用的 `JavaScript` 框架设计。在此之前，首先需要考虑通用库的工程化设计。因此在接下来的几节课程中会讲解通用库的工程化设计以及相关的原理知识，为框架设计做工程化准备。

### 设计要素
在**框架原理：设计要素**中讲解了微前端框架的作用，主要是为了辅助微前端中的主应用可以快速集成相应的微应用，该框架本质上是一个通用的 `JavaScript` 库。在 `Web` 前端的开发中，通用的 `JavaScript` 库一般都会发布成 `NPM` 库包，从而可以在各个不同的主应用中引入使用。为了提升库的设计质量，一般需要考虑以下一些设计要素：
- **构建工具**： 需要通过构建工具对 NPM 包进行库构建，构建出 `CommonJS` 或者 `ES Module` 库包
- **按需加载**： 发布的库可以支持按需加载或者支持 `Tree Shaking`，减少业务应用的引入体积
- **版本发布**： 如何基于构建的目标文件进行库的版本发布和使用
- **代码检查**： 在开发时确保代码有统一的检查工具，确保上传到 `Git` 仓库的代码没有低级错误
- **代码格式**： 在开发时确保代码有统一的格式工具，提升团队 `Code Review` 的效率
- **提交规范**： 在代码提交时可以进行拦截设计，包括 `ESLint` 校验、单元测试等
- **更新日志**： 可以根据规范的提交说明自动生成版本日志
- **单元测试**： 在提交代码时单元测试可以确保代码的正确性和稳定性
- **文档指南**： 提供配套的 `API` 说明文档，提升开发者的开发效率
- **集成部署**： 在指定的分支提交代码后，可以自动集成和自动部署

一般在库的设计过程中，需要考虑如何使库的设计更加规范、高效和稳定，而在库的使用过程中，则需要考虑业务的引入体验，确保使用的高效和稳定。
:::  tip
也可以在业务应用的开发中使用部分工程化设计，从而提升应用的开发质量。
:::

### 构建工具
在**方案了解：NPM 方案**中已经重点讲解了为什么需要使用构建工具（简化主应用的构建配置、提升主应用的构建速度、适配浏览器环境），一般会将主应用引入的 `NPM` 库包进行 `ES5` 兼容性和标准化输出构建处理，采用构建工具进行库构建的优势在于：
- **框架库开发态提效**： 框架库的开发态可以使用最新的 `ES` 标准以及 `TypeScript` 语法设计
- **构建标准多样性**： 如果主应用的打包工具支持 `ES Module` 的引入方式并支持 `TreeShaking` 特性，那么可以通过构建工具将框架库构建出 `ES Module` 标准，当然也可以构建出 `CommonJS`、`UMD` 等多种标准，从而可以适配不同的主应用环境
- **智能提示**： 框架库采用 `TypeScript` 进行设计后，可以通过构建工具自动生成 `TypeScript` 声明文件，当主应用通过 `VS Code` 引入框架库时，可以自动提示框架库的 `API` ，包括函数功能说明、出参入参格式、对象的属性等，并可以支持 `ESLint` 的校验工作

在**方案了解：NPM 方案**中已经重点讲解了构建工具的作用，本课程在工程化设计中将继续讲解构建相关的实践知识，从而方便大家了解 `Web` 应用和框架（通用）库的构建差异。

### 按需加载
在应用中经常会考虑组件库的按需加载，例如在主应用中只需要使用 `Antd` 的 `Button` 组件，在设计时不应该将 `Button` 组件以外的其他组件代码打包到主应用，从而增加不必要的应用体积。为了使得主应用可以在引入微前端框架时能够按需加载，往往都需要将框架的库功能按维度进行拆分，例如：
- **NPM 包**： 将微前端框架的各个设计要素通过 `Monorepo` 的设计方式拆分成不同的 `NPM` 包实现按需引入
- **目标文件**： 将微前端框架的各个设计要素拆分成不同的文件夹，通过引入文件夹实现按需引入

由于 `Monorepo` 的设计模式相对成熟，本课程接下来会重点讲解按文件引入的设计方案，并实现相应的构建脚本设计。
::: tip
如果需要设计类似于 `Lodash` 的工具库，那么按需引入的设计非常有用。因为在业务中使用工具方法时，往往希望按需使用。
:::

### 版本发布
在多人协作的情况下，如何确保发布的产物和版本符合开发者约定的规范。本课程会重点讲解基于按需加载构建产物的自动化发布脚本设计，该脚本：
- 支持发布前的构建产物预处理
- 支持发布前的检测处理（可以是开发者约定的发布规范）
- 支持一键发布处理

### 代码检测 & 代码格式
在框架库的设计过程中，如何确保设计的代码符合社区的标准规范。本课程接下来会重点讲解 `ESLint` 和 `Prettier` 相关的知识点，包括：
- 如何支持项目的 `TypeScript` 进行代码校验
- `ESLint` 知识点：层叠配置、自定义解释器、插件以及共享配置等
- `Prettier` 和 `ESLint` 的关系
- 如何配置 `ESLint` 和 `Prettier` 的 `VS Code` 保存自动格式化功能

### 提交规范
在多人协作的开发过程中，并不是所有的开发者都会自动开启 `ESLint` 和 `Prettier` 功能进行实时检查和格式修复，这会导致提交的代码不符合检查标准和格式规范。为了防止不符合校验规范的代码被提交到远程仓库，可以在提交代码时使用工具进行检测，本课程接下来会重点讲解提交检测相关的知识原理和工具，从而帮助大家在多人协作的设计过程中确保提交规范的代码：
~~~shell
# 执行
git add .  
# 执行
git commit -m "feat: add lint git hook"
✔ Preparing lint-staged...
❯ Running tasks for staged files...
  # 可以发现读取了 .lintstagedrc.js 文件
  ❯ .lintstagedrc.js — 6 files
    ❯ src/**/*.ts — 1 file
      # 校验失败
      ✖ eslint [FAILED]
↓ Skipped because of errors from tasks. [SKIPPED]
✔ Reverting to original state because of errors...
✔ Cleaning up temporary files...

✖ eslint:

/Users/zhuxiankang/Desktop/Github/micro-framework/src/index.ts
  15:3   error  Unsafe return of an `any` typed value                                                   @typescript-eslint/no-unsafe-return
  15:10  error  Operands of '+' operation with any is possible only with string, number, bigint or any  @typescript-eslint/restrict-plus-operands

✖ 2 problems (2 errors, 0 warnings)

# husky 中的退出执行（git commit 失败）
husky - pre-commit hook exited with code 1 (error)
~~~

### 变更日志
版本的更新日志可以帮助大家更好的了解微前端框架库设计的版本功能信息，当微前端框架有变更时，大家可能希望通过更新日志了解变更的内容是什么、为什么要进行变更、以及如何进行变更，本课程接下来将重点讲解如何生成规范的 `Commit` 提交说明，以及如何利用工具自动生成更新日志。

### 单元测试
单元测试可以模仿开发者对于 `API` 的调用过程，并且可以通过边界情况来测试 `API` 是否存在异常情况，确保 `API` 的设计可得到预期的结果，从而提升代码质量。当我们对 `API` 进行重构或者优化时，可以通过单元测试的测试案例来确保代码的改动不会影响最终的运行结果，从而提升代码设计的稳定性。

## 工程设计：构建工具
框架（通用）库的设计是为了在不同的应用中进行逻辑复用，从而提升开发效率。在前端开发中，应用主要分为 `Web` 应用和 `Node` 应用，因此框架库主要在这两种应用环境中使用。需要注意，有些库只能在 `Node` 环境中使用，有些库只能在 `Web` 环境中使用，而有些库考虑了兼容性设计，在两者中都可以使用。本小节课程会重点讲解 `Web` 应用和框架库的构建差异，并且会以 `Webpack` 和 `Gulp` 构建工具为例进行讲解。

### 应用构建
在 Web 应用的打包构建中，一般需要考虑以下构建处理，从而生成前端可以部署的静态资源：
- 构建生成 `HTML` 文件并关联相应的 `JS` 和 `CSS`；
- 对 `CSS`、`JS` 、图片、`SVG` 等进行打包处理，从而减少浏览器的请求数量；
- 构建的 `JS` 和 `CSS` 能够兼容大多数浏览器；
- 打包的 `JS` 脚本数量少，减少 `HTTP` 请求的个数；
- 打包的 `JS` 脚本体积小（抽离公共的 `JS` 脚本、压缩处理），减少 `HTTP` 请求的时间；
- 如果是 `React` 或者 `Vue` 框架开发，还需要考虑 `JSX`、`Vue Template` 等支持；
- 如果是 `TypeScript` 开发，还需要考虑支持 `TypeScript` 转译。

::: tip
使用 `React` 或者 `Vue` 框架开发 `Web` 应用时都会配套相应的开发套件，例如 `Create React App` 以及 `Vue CLI`。本课程只是简单讲解和通用库构建息息相关的简单 `JS` 构建配置，帮助没有构建经验的同学可以简单了解应用的构建过程。如果想了解 TypeScript、CSS 预编译 & 抽离、图片内联 & 抽离、JSX 支持、SVG 支持、ESLint 支持、模块热替换等配置，可以额外深入了解上述列举的框架开发套件。
:::

接下来重点讲一下 `JS` 的打包处理，目前主流框架的 `Web` 应用都采用模块化的方式进行开发，为了生成浏览器兼容的 `ES5` 脚本，可以配合打包工具将开发态 `ES6+` 语法的脚本打包成带公共 `chunks` 的兼容性 `ES5` 脚本，如下所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/0fc5aff765904cf19ca3925fb3008122~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

以 `Webpack` 为例，来看一个简单的模块化打包示例：
~~~shell
├── src                # 源文件夹
│   ├── minus.js       # ES Modules                
│   ├── add.js         # ES Modules                                
│   └── index.js       # 入口文件
~~~
在 `index.js` 中通过 `import` 来引入 `add.js` 和 `minus.js` 模块：
~~~ts
// src/add.js
export function add(a, b) {
  return a + b;
}

// src/subtract.js
export function subtract(a, b) {
  return a - b;
}

// src/index.js
import { add } from "./add";
import { subtract } from "./subtract";

let c = add(1, 2);
console.log(c);
let d = add(3, 4);
console.log(d);

let e = subtract(d, 4);
console.log(e);
let f = subtract(c, 2);
console.log(f);
~~~
在 `package.json` 中添加构建命令（在项目中需要安装 `webpack` 和 `webpack-cli`）：
~~~ts
// package.json
"scripts": {
  "build": "webpack"
},
~~~
执行 `npm run build` 之后默认会在 `dist` 目录下生成 `main.bundle.js`，如下所示：
~~~ts
// dist/main.bundle.js
(()=>{"use strict";function o(o,l){return o+l}function l(o,l){return o-l}let e=o(1,2);console.log(e);let n=o(3,4);console.log(n);let t=l(n,4);console.log(t);let c=l(e,2);console.log(c)})();
~~~
可以发现 `Webpack` 将所有的 `ES Modules` 打包成了一个文件并做了压缩处理，但没有将 `ES6+` 语法转换成 `ES5` 语法，例如构建代码中的 let 和箭头函数。如果想要将源代码转换成 `ES5` 语法，需要借助 [Babel](https://babeljs.io/)（转译工具，语法转换和 `Polyfill` 处理），在项目中新增 `webpack.config.js` 配置文件并添加 `babel-loader`：
~~~ts
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
    environment: {
      // 将最外层立即执行的箭头函数改为 ES5 语法
      arrowFunction: false,
    },
  },
  module: {
    rules: [
      {
        test: /.m?js$/,
        // Babel 推荐屏蔽 node_modules 目录，这也是为什么大部分通用库需要构建的主要原因
        // 如果引入的 NPM 库包是 ES6 语法，那么最终的构建产物将包含 ES6 代码
        exclude: /(node_modules)/,
        use: {
          // 将 ES6+ 语法转换成 ES5
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  // 构建生成 HTML 文件，并将构建后的 JS 文件添加的 HTML 中
  plugins: [new HtmlWebpackPlugin()],
};
~~~
::: tip
插件是 `Webpack` 可以额外处理 `JS` 的一个重要功能，举个例子，可以通过正则表达式来匹配 `JS` 和 `CSS` 中的公网地址，并进行下载打包处理，从而解决私有化网络的问题。
:::
执行 `npm run build` 之后会生成可以兼容大部分浏览器的 `ES5` 代码：
~~~ts
!function(){"use strict";function o(o,n){return o+n}function n(o,n){return o-n}var r=o(1,2);console.log(r);var c=o(3,4);console.log(c);var l=n(c,4);console.log(l);var e=n(r,2);console.log(e)}();
~~~
如果在代码中使用了相对通用的三方库，则可以将三方库通过 `Webpack` 自带的功能进行代码分离，例如这里更改源代码，引入 `Lodash` 处理：
~~~ts
// src/add.js
import _ from "lodash";

export function add(a, b) {
  return _.add(a, b);
}

// src/subtract.js
import _ from "lodash";

export function subtract(a, b) {
  return a - b;
}
~~~
更改 `webpack.config.js` 的配置：
~~~ts
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: __dirname + "/dist",
    filename: "[name].bundle.js",
    environment: {
      arrowFunction: false,
    },
  },
  // 提取公共的依赖模块并生成新的 chunk 文件
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  module: {
    rules: [
      {
        test: /.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
};
~~~
执行 `npm run build` 之后会将 `Lodash` 库的代码进行分离：
~~~shell
# 共享模块，内部包含 Lodash 库代码
asset 486.bundle.js 69 KiB [emitted] [minimized] (id hint: vendors) 1 related asset
asset main.bundle.js 1.74 KiB [emitted] [minimized] (name: main)
asset index.html 272 bytes [emitted]
~~~
::: tip
多入口的情况下分离代码，可以防止各自引入重复的代码从而增加构建体积。除此之外，分离代码还可以防止单个 JS 脚本过大从而增加 HTTP 的请求时间。
:::

### 库构建
框架（通用）库的构建并不直接面向浏览器，而是面向 `Web` 应用（或者 `Node` 应用），`Web` 应用会通过模块化的方式加载通用库并进行最终的应用打包。在 `Web` 应用中，框架库是通过 NPM 包的方式引入，而 `babel-loader` 转译时通常会配置忽略 `node_modules` 目录下的库包，因此需要先将库包转译成浏览器能够兼容的 `ES5` 语法进行发布，因为 `Web` 应用在打包时不会对三方 `NPM` 包进行转译处理。除此之外，为了配合 `Web` 应用的打包处理，还需要将库包发布成能够被打包工具识别的模块化标准：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/6605f97f8adb4dc386665a7e3ecf6af4~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

库构建面向应用开发，一般需要考虑如下构建处理，从而生成可以被应用安装的 `NPM` 包：
- 目标代码能够兼容浏览器或者 `Node.js` 环境（`ES5` 标准）；
- 输出模块规范，例如 `CommonJS`、`UMD` 或者 `ES Module`（支持 `Tree Shaking`）；
- 输出 `TypeScript` 声明文件，可以在应用开发中得到库 `API` 的智能提示；
- 不进行三方库的打包处理，防止应用使用同样的三方库时打包两份代码；
- 能够使应用按需引入库代码。

### 按需引入
接下来重点讲解一下库的按需引入功能，从而帮助大家更好了解接下来的构建工具选型。在之前的 `Web` 应用构建中，可以重新修改 `Lodash` 库的引入方式，从而实现按需引入：
~~~ts
// src/add.js
// Lodash 库按需引入的方式非常简单，例如 import funName from `lodash/${funName}`
import _add from "lodash/add";

export function add(a, b) {
  return _add(a, b);
}

// src/subtract.js
import _subtract from "lodash/subtract";

export function subtract(a, b) {
  return _subtract(a, b);
}
~~~
执行 `npm run build` 之后：
~~~shell
# 按需引入的体积 2.74 KiB，按需引入后体积大大减小
asset main.bundle.js 2.74 KiB [emitted] [minimized] (name: main)

# 不按需引入（不对代码进行分离）的体积 69.8 KiB
asset main.bundle.js 69.8 KiB [emitted] [minimized] (name: main) 1 related asset
~~~
::: tip
如果不想改变 `import _ from "lodash"` 的引入方式，也可以将按需引入的解析工作交给 `Webpack` 的插件 `lodash-webpack-plugin` 和 `Babel` 的插件 `babel-plugin-lodash` 来处理，当然最终还是转变成 `import funName from "lodash/${funName}"` 的方式。
:::

如果构建工具本身支持 `Tree Shaking`，那么也可以使用 `Lodash` 的 `ES Module` 标准库（默认安装的 `Lodash` 库输出的是 `CommonJS` 规范），例如：
~~~ts
import { add } from "lodash-es";

export function _add(a, b) {
  return add(a, b);
}

// src/subtract.js
import { subtract } from "lodash-es";

export function subtract(a, b) {
  return subtract(a, b);
}
~~~
此时 `Webpack` 在构建时可以利用 `Tree Shaking` 的特性自动去除未使用的代码，执行 `npm run build` 之后：
~~~shell
# Tree Shaking 后代码的体积大大减少
asset main.bundle.js 1.54 KiB [emitted] [minimized] (name: main)
~~~
总结来说，如果要设计一个 `Lodash` 库并支持按需引入，那么可以对库的开发做如下构建处理：
- 生成 `CommonJS` 规范，构建总入口文件，并为每一个函数构建独立文件；
- 生成 `ES Module` 规范，构建总入口文件，并为每一个函数构建独立文件；
- 为每一个设计的函数进行单独构建和单独发布 `NPM` 包。

有了上述构建库的设计后，按需引入的方式可以包含如下几种：
~~~ts
// 按函数文件名引入
// 此时构建的 NPM 包中需要有一个 add.js 文件，并且该文件在一级目录下
import _add from "lodash/add";

// CommonJS 总引入，需要配合 lodash-webpack-plugin 和 babel-plugin-lodash 一起使用
// 此种方式可以简单理解为通过插件间接将代码转换成 import _add from "lodash/add" 的方式
import _ from "lodash";
_.add(1,2);

// ES Modules 总引入，利用构建工具的 Tree Shaking 能力实现按需构建
// 此时构建的 NPM 包中需要一个总的 lodash.js 文件，该文件导出了所有的工具方法
import _ from "lodash-es";
_.add(1,2);

// 单独的 NPM 按需引入，lodash.add 是一个独立的 NPM 包
import add from "lodash.add"
add(1,2);
~~~

### 构建工具选型
在了解了 `Lodash` 的按需引入功能之后，以微前端框架库的设计为例，假设需要设计一个以下目录结构的库包：
~~~shell
├── src                          # 源文件     
│   ├── index.js                 # 总入口文件
│   ├── core                     # 应用管理
│   │   └── core.js              # 应用管理
│   ├── sandbox                  # 隔离方案
│   │   ├── sandbox1.js          # 隔离功能一
│   │   ├── sandbox2.js          # 隔离功能二
│   │   └── sandbox3.js          # 隔离功能三
│   ├── opt                      # 性能优化
│   │   ├── opt1.js              # 优化功能一
│   │   └── opt2.js              # 优化功能二
│   └── comm                     # 通信
│       ├── comm1.js             # 通信功能一
│       └── comm2.js             # 通信功能二
├── lib                          # 目标文件
│   ├── commonjs                 # CommonJS 标准输出（可以单独发布成库包 micro-framework）
│   │   ├── index.js             # 总入口
│   │   ├── core.js              # 应用管理
│   │   ├── sanbox1.js           # 隔离功能一
│   │   ├── sanbox2.js           # 隔离功能二
│   │   ├── sanbox3.js           # 隔离功能三
│   │   ├── opt1.js              # 优化功能一
│   │   ├── opt2.js              # 优化功能二
│   │   ├── comm1.js             # 通信功能一
│   │   └── comm2.js             # 通信功能二
│   ├── es                       # ES Modules 标准（可以单独发布成库包 micro-framework-es）
│   │   ├── index.js             # 总入口
│   │   ├── core.js              # 应用管理
│   │   ├── sandbox1.js          # 隔离功能一 
│   │   ├── sandbox2.js          # 隔离功能二
│   │   ├── sandbox3.js          # 隔离功能二
│   │   ├── opt1.js              # 优化功能一
│   │   ├── opt2.js              # 优化功能二
│   │   ├── comm1.js             # 通信功能一
│   │   └── comm2.js             # 通信功能二
~~~
::: tip
可以视情况将构建后的文件目录进行平铺，使应用的开发者不需要感知 `sandbox`、`opt` 和 `comm` 等源文件目录路径，提升开发者体验。构建完成后，将上述构建目录的 `lib/commonjs` 发布成独立的 `NPM` 包，包名为 `micro-framework`。
:::
构建并发布后，框架库可以按目标文件进行引入，使用方式如下所示：
~~~ts
// 支持按需引入
import micro from 'micro-framework/core';
import nav from 'micro-framework/nav';
import sandbox1 from 'micro-framework/sandbox1';
import opt1 from 'micro-framework/opt1';
import comm1 from 'micro-framework/comm1';

micro.start({
   // 需要注册的微应用
   apps: [],
   // 启用导航、隔离、性能优化和通信
   plugins: [nav, sandbox1, opt1, comm1],
});
~~~
在应用中通过 `import sandbox1 from 'micro-framework/sandbox1'` 的方式可以做到按需引入 `commonjs/sandbox1.js` 文件，未被引入的文件不会被打包到应用中。

除此之外，不要将三方库打包到框架库的目标文件中，例如 `Web` 应用和框架库的设计都依赖了 `Lodash` 三方库，如果在框架库的 `index.js` 中打包了 `Lodash`，`Web` 应用也打包了 `Lodash`，应用引入框架库后进行打包会导致目标文件中存在两份 `Lodash` 代码。

为了实现上述框架库的构建处理，需要考虑选型合适的构建工具。构建工具的类型有很多，其中转译和打包是两种常用的类型。`babel`、`tsc` 和 `swc` 是常用的转译工具，只负责源文件到目标文件的转译工作，而 `Webpack、Rollup、Vite、Swcpack、Turbopack` 等属于打包工具，打包工具可以将多个模块化的文件组合压缩成单个 `JS` 文件，从而可以减少浏览器的请求数量和体积。当然打包工具的作用还包括代码切割、`TreeShaking`、`CSS` 预编译处理等。如果使用打包工具进行库构建处理，一般需要考虑以下处理：
- 屏蔽 `TreeShaking` 处理；
- 排除三方库的打包处理；
- 多入口处理（生成按需加载的文件）；
- 生成 `TypeScript` 声明文件。
::: tip
打包工具也会具备库的构建能力，例如 `Webpack` 的创建 [library](https://webpack.docschina.org/guides/author-libraries/)，但是不推荐使用多入口的处理方式，并且需要额外排除三方库，当然也可以查看社区是否有排除三方库的工具，例如 `Element` 的 [config.js](https://github.com/ElemeFE/element/blob/dev/build/config.js) 中使用的 `webpack-node-externals`。
:::
如果是组件库的构建，则考虑的情况会相对复杂，例如包含 `CSS`、图片以及 `SVG` 的处理，此时使用打包工具可能是个不错的选择，例如 `Element` 的构建就是使用了 `Webpack` 进行库构建，但是它为了生成按需加载的文件以及排除三方库处理，做了很多复杂的 `Webpack` 配置。

如果只是简单做一个类似于 `Lodash` 的工具库，那么可以考虑使用转译工具处理，此时在开发态希望使用最新的 `ES6+` 语法，而生产态只需要转译处理即可，使用转译工具的优势在于：
- 天然不会处理 `TreeShaking`；
- 天然不打包三方库，不需要做额外的排除处理；
- 天然做到多入多出，因为只是做转译处理，不做打包处理；
- 类似于 `tsc` 天然可以生成 `TypeScript` 声明文件。

除此之外，如果在开发态可以平铺目录，那么最好是在开发态进行目录的平铺处理，只采用一级目录的设计方式，从而在按需加载时不需要考虑多级目录的引入情况。如果在库设计的开发态希望可以按功能进行多级目录的区分，那么也可以简单通过 `Node` 的方式在构建时将目录进行平铺处理，从而确保按需引入的体验。因此，工具库或者框架库的构建可以选择转译工具进行构建处理，在选型时可以考虑以下转译工具：
- `babel`：功能丰富生态强大，但是对 `TypeScript` 支持偏弱，例如类型检查和声明文件生成；
- `tsc`：`TypeScript` 原生构建工具，类型检查速度慢并且对新语法的支持不如 `Babel` 多；
- `swc`：构建速度快，目前正在设计 `TypeScript` 类型检查，预计速度会比 `tsc` 快。

如果熟悉 `babel` 和 `swc`，可以使用 `babel` 和 `swc` 进行代码的转译处理，配合 `tsc` 进行声明文件的生成和类型检查处理，如果只是设计简单的功能库，并且不需要大量的 `polyfill` 支持，那么可以直接选择 `tsc` 进行转译处理。

当然 `tsc` 的功能和生态过于简单，本课程接下来会使用 `gulp-typescript` （利用 `TypeScript` 的 `API` 进行编译，具备类型检查和声明的生成能力）进行流式构建处理，从而方便后续可以借助 `Gulp` 的生态额外定制构建需求，例如文件压缩、合并、添加日志等。

## 工程设计：按需加载
在 `Web` 应用的开发中，通常需要考虑通过打包工具生成 `Bundle`，理论上 `Bundle` 越小，`HTTP` 的请求时间越少，可以在一定程度上增加用户体验。假设在 `Web` 应用中使用了 `Antd` 组件库，并且只用到了其中的 `Button` 组件和 `Input` 组件，那么在设计时，应该只引入 `Button` 和 `Input` 相关的代码，从而避免引入整个组件库带来的构建体积增加，因此在设计库时往往需要考虑按需加载。以下几种情况需要考虑设计按需加载：
- 可以按功能进行拆分（例如组件库），可以按需使用功能；
- 可以按工具方法进行拆分（例如 `Lodash`），可以按需使用工具方法；
- 可以按模块进行拆分（例如 `RxJS`），可以按需使用模块。

当然并不是所有的库都需要实现按需加载，例如以下几种情况可以不考虑按需加载：
- 设计的库足够简单，确定库的体积足够小，不会影响 `Web` 应用的加载性能；
- 设计的库功能单一（例如请求库），大部分代码都会被使用；

微前端框架库，单从库体积维度来考量，可以不做按需加载设计（例如 `qiankun` 的设计），当然本课程对微前端框架的设计按功能进行了解耦拆分（应用管理、隔离、性能优化和通信），在工程上考虑做一个按需加载设计，从而可以方便大家按解耦的功能模块进行逐一学习。如果大家在日常的开发中需要设计一个通用的工具库，完全可以参考本小节的设计思路。

### Gulp 构建
在上节课中，我们重点讲解了库构建的工具选型。为了使构建的库可以进行类型检查和声明文件自动生成，这节课我们会使用 `Gulp` 配合 `gulp-typescript` 实现库构建能力。

`Gulp` 的流式构建可以很好地为多文件构建进行服务，各个文件可以通过构建管道进行重复构建，从而保证源文件目录和目标文件目录一一映射，这正是库设计中按需加载非常重要的一个构建特性。例如构建工具中的微前端框架目录设计：
~~~shell
├── src                            
│   ├── index.js                 
│   ├── core                     
│   │   └── core.js              
│   ├── sandbox                   
│   │   ├── sandbox1.js          
│   │   ├── sandbox2.js          
│   │   └── sandbox3.js                      
│   ├── opt                      
│   │   ├── opt1.js              
│   │   └── opt2.js              
│   └── comm                     
│       ├── comm1.js              
│       └── comm2.js              
├── gulpfile.js                   
├── tsconfig.json                 
└── package.json
~~~
在上述文件目录下，可以简单新增 Gulp 构建来实现：
~~~ts
// gulpfile.js
const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");

const task = {
  // 构建 CommonJS 模块化规范
  commonjs: {
    name: "build commonjs",
    tsconfig: {
      // 指定输出的模块化标准，例如课程中常说的 CommonJS 和 ES Modules（ES2015/ES6/ES2020）
      // 中文查看（模块概念）：https://www.tslang.cn/docs/handbook/modules.html
      // 英文查看（模块编译示例）：https://www.typescriptlang.org/tsconfig/#module
      module: "CommonJS",
      // 指定输出的 JS 标准（ES3/ES5/ES6/.../ESNext）
      // 在课程中已经讲解 ES5 能够兼容大部分的浏览器
      target: "ES5",
    },
    dest: "lib/commonjs",
  },
  
  // 构建 ES Module 模块化规范
  esmodule: {
    name: "build esmodule",
    // 发布的 NPM 库包导入导出使用的是 ES Modules 规范，其余代码都是 ES5 标准
    // 使用 ES Modules 规范可以启用 Tree Shaking 
    // 输出 ES5 标准是为了配置 Babel 时可以放心屏蔽 node_modules 目录的代码转译
    tsconfig: {
      module: "ESNext",
      target: "ES5",
    },
    dest: "lib/es",
  },
};

function build(task) {
  const tsProject = ts.createProject("tsconfig.json", task.tsconfig);
  // tsProject.src() 默认会基于 tsconfig.json 中的 files、exclude 和 include 指定的源文件进行编译
  const tsResult = tsProject.src().pipe(tsProject());
  const tsDest = gulp.dest(task.dest, { overwrite: true });
  return merge([tsResult.dts.pipe(tsDest), tsResult.js.pipe(tsDest)]);
}

gulp.task(task.commonjs.name, () => build(task.commonjs));
gulp.task(task.esmodule.name, () => build(task.esmodule));
gulp.task("default", gulp.parallel([task.commonjs.name, task.esmodule.name]));


// tsconfig.json
// 中文查看：https://www.tslang.cn/docs/handbook/tsconfig-json.html
// 英文查看：https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
{
  "compilerOptions": {
    // 模块解析策略：Node 和 Classic
    // 中文查看：https://www.tslang.cn/docs/handbook/module-resolution.html
    // 英文查看：https://www.typescriptlang.org/docs/handbook/module-resolution.html
    // 一般情况下都是使用 Node，简单理解为参考 Node 的 require 算法解析引入模块的路径
    "moduleResolution": "node",
    // 允许从没有设置默认导出的模块中默认导入
    "allowSyntheticDefaultImports": true,
    // 删除所有注释，除了以 /!* 开头的版权信息
    "removeComments": true,
    // 生成相应的 .d.ts 声明文件
    "declaration": true,
    // 启用所有严格类型检查选项。启用 --strict 相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks, --strictFunctionTypes 和 --strictPropertyInitialization
    "strict": true,
    // 禁止对同一个文件的不一致的引用
    "forceConsistentCasingInFileNames": true,
    // 报错时不生成输出文件
    "noEmitOnError": true,
    // 编译过程中需要引入的库文件的列表，其实就是开发态语法的支持程度配置
    "lib": ["DOM", "ES2015.Promise", "ES6", "ESNext"],
    // 允许使用 import 代替 import *
    // 英文查看：https://www.typescriptlang.org/tsconfig#esModuleInterop
    "esModuleInterop": true,
    "module": "CommonJS",
    // 解析非相对模块名的基准目录
    "baseUrl": ".",
    // 将每个文件作为单独的模块
    "isolatedModules": true,
    // 允许引入 .json 扩展的模块文件
    "resolveJsonModule": true,
    // 启动 decorators
    "experimentalDecorators": true
  },
  // 编译器包含的文件列表，可以使用 glob 匹配模式
  "include": ["src/**/*"],
  // 编译器排除的文件列表
  "exclude": ["node_modules"]
}


// package.json
"scripts": {
  "build": "gulp"
},
~~~
执行 `npm run build` 进行构建，构建后会在 `lib` 目录下生成 `commonjs` 和 `es` 两个文件夹，分别代表生成 `CommonJS` 和 `ESModule` 模块化规范的输出：
~~~shell
[09:00:22] Using gulpfile ~/Desktop/Github/micro-framework/gulpfile.js
[09:00:22] Starting 'default'...
[09:00:22] Starting 'build commonjs'...
[09:00:22] Starting 'build esmodule'...
[09:00:24] Finished 'build esmodule' after 1.55 s
[09:00:24] Finished 'build commonjs' after 1.55 s
[09:00:24] Finished 'default' after 1.56 s
~~~
生成的目录结构如下所示：
~~~shell
lib
├── commonjs                      
│   ├── index.js                 
│   ├── index.d.ts               
│   ├── core                     
│   │   ├── core.d.ts           
│   │   └── core.js              
│   ├── sandbox                   
│   │   ├── sandbox1.d.ts       
│   │   ├── sandbox1.js          
│   │   ├── sandbox2.d.ts       
│   │   ├── sandbox2.js          
│   │   ├── sandbox3.d.ts       
│   │   └── sandbox3.js                    
│   ├── opt                      
│   │   ├── opt1.d.ts           
│   │   ├── opt1.js              
│   │   ├── opt2.d.ts           
│   │   └── opt2.js              
│   └── comm                     
│       ├── comm1.d.ts           
│       ├── comm1.js              
│       ├── comm2.d.ts           
│       └── comm2.js              
├── es                            
│   ├── index.js                 
│   ├── index.d.ts               
│   ├── core                     
│   │   ├── core.d.ts           
│   │   └── core.js              
│   ├── sandbox                   
│   │   ├── sandbox1.d.ts       
│   │   ├── sandbox1.js          
│   │   ├── sandbox2.d.ts       
│   │   ├── sandbox2.js          
│   │   ├── sandbox3.d.ts       
│   │   └── sandbox3.js                 
│   ├── opt                      
│   │   ├── opt1.d.ts           
│   │   ├── opt1.js              
│   │   ├── opt2.d.ts           
│   │   └── opt2.js              
│   └── comm                     
│       ├── comm1.d.ts           
│       ├── comm1.js              
│       ├── comm2.d.ts           
│       └── comm2.js
~~~
此时可以将整个构建的 `lib` 目录发布成 `NPM` 库包，并在 `lib` 目录下新增 `package.json`：
~~~json
// 可以设计构建脚本将 lib 目录平级的 package.json 拷贝到 lib 目录下
{
  "name": "micro-framework",
  "version": "1.0.0",
  "description": "",
  
  // 设置 CommonJS 的默认引入路径（不支持 Tree Shaking）
  "main": "./lib/commonjs/index.js",
  
  // 设置 ES Modules 的默认引入路径（支持 Tree Shaking）
  // 注意这里发布的包的规范：导入导出使用 ES Modules 规范，其余都是 ES5 语法
  "module": "./lib/es/index.js",
  
  "scripts": {
    "build": "gulp"
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
    "@types/lodash": "^4.14.191",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "gulp": "^4.0.2",
    "gulp-typescript": "^6.0.0-alpha.1",
    "merge2": "^1.4.1",
    "typescript": "^4.9.5"
  }
}
~~~
发布 `NPM` 包后，可以在 `Web` 应用中通过如下方式进行引入：
~~~ts
// 总体引入方式
// Web 应用所在打包工具如果支持识别 package.json 中的 module 字段，会优先使用 ES Modules 模块规范，并启用 Tree Shaking
// Web 应用所在打包工具如果不支持识别 package.json 中的 module 字段，那么默认会识别 main 字段启用 CommonJS 规范
import micro from 'micro-framework' 

// 按需引入方式
import sandbox1 from 'micro-framework/commonjs/sandbox/sandbox1'
import sandbox1 from 'micro-framework/es/sandbox/sandbox1'
~~~
::: tip
可以发现按需引入的方式没有 `Lodash` 来的简单方便，需要识别多层目录结构，那么是否可以设计一个构建脚本，将目录结构进行平铺发布呢？接下来的课程可能属于定制化内容，不算是一种通用的设计结构，感兴趣的同学可以继续了解。
:::

### 平铺构建
这里通过手动设计加深大家对于构建设计的理解，从而可以设计更加定制的构建脚本。平铺构建并不一定适合微前端框架的设计，但是非常适合类似于 `Lodash` 的工具库设计。

如果大家希望将按需引入的路径变得更加简洁，例如：
~~~ts
// CommonJS 按需引入方式（类似于 Lodash 的引入方式）
// 原有引入方式：import sandbox1 from 'micro-framework/commonjs/sandbox/sandbox1'
import sandbox1 from 'micro-framework/sandbox1'
// ES Modules 按需引入
// 原有引入方式：import sandbox1 from 'micro-framework/es/sandbox/sandbox1'
import sandbox1 from 'micro-framework-es/sandbox1'
~~~
此时可以将微前端框架库像 `Lodash` 一样发布成两个 NPM 库包，一个库包（`micro-framework`）支持 `CommonJS` 规范，另外一个库包（`micro-framework-es`）支持 `ES Modules` 规范，从而可以让开发者自主进行库包选择。

为了实现上述功能，需要设计一个构建脚本，该脚本能够平铺目录结构。这里对 `Gulp` 构建进行更改，新增 `Node.js` 构建脚本和构建参数，从而可以包裹原有的 `gulp` 构建命令：
~~~ts
{
  "main": "index.js",
  "scripts": {
    // package.json 下原有的构建命令
    // "build": "gulp"
    // 将其更改为使用 Node 脚本执行构建
    "build": "ts-node build/build.ts"
  },
  // https://docs.npmjs.com/cli/v8/configuring-npm/package-json#config
  // 构建配置，可以在代码中通过 process.env.xxx 获取
  // 这里可以额外扩展其他构建配置项
  "config": {
    // 是否平铺
    "flat": true
  },
  
  // 由于需要设计 Node.js 脚本，这里用于安装依赖时提示 Node.js 版本要求
  "engines": { "node": ">=16.18.1" },
  "engineStrict": true
}
~~~
为了支持使用 `ts-node`，需要在 `tsconfig.json` 中配置对 `Node` 的支持：
~~~ts
// tsconfig.json
// 中文查看：https://www.tslang.cn/docs/handbook/tsconfig-json.html
// 英文查看：https://www.typescriptlang.org/docs/handbook/tsconfig-json.html
{
  // ts-node 文档：https://github.com/TypeStrong/ts-node
  // tsconfig extends：https://github.com/tsconfig/bases
  "extends": "ts-node/node16/tsconfig.json",

  "compilerOptions": {
    // 模块解析策略：Node 和 Classic
    // 中文查看：https://www.tslang.cn/docs/handbook/module-resolution.html
    // 英文查看：https://www.typescriptlang.org/docs/handbook/module-resolution.html
    // 一般情况下都是使用 Node，简单理解为参考 Node 的 require 算法解析引入模块的路径
    "moduleResolution": "node",
    // 允许从没有设置默认导出的模块中默认导入
    "allowSyntheticDefaultImports": true,
    // 删除所有注释，除了以 /!* 开头的版权信息
    "removeComments": true,
    // 生成相应的 .d.ts文件
    "declaration": true,
    // 启用所有严格类型检查选项。启用 --strict 相当于启用 --noImplicitAny, --noImplicitThis, --alwaysStrict， --strictNullChecks, --strictFunctionTypes 和 --strictPropertyInitialization
    "strict": true,
    // 禁止对同一个文件的不一致的引用
    "forceConsistentCasingInFileNames": true,
    // 报错时不生成输出文件
    "noEmitOnError": true,
    // 编译过程中需要引入的库文件的列表
    "lib": ["DOM", "ES2015.Promise", "ES6", "ESNext"],
    // 允许使用 import 代替 import *
    // 英文查看：https://www.typescriptlang.org/tsconfig#esModuleInterop
    "esModuleInterop": true,
    "module": "CommonJS",
    // 解析非相对模块名的基准目录
    "baseUrl": ".",
    // 将每个文件作为单独的模块
    "isolatedModules": false,
    // 允许引入 .json 扩展的模块文件
    "resolveJsonModule": true,
    // 启动 decorators
    "experimentalDecorators": true
  },
  // 编译器包含的文件列表，可以使用 glob 匹配模式
  "include": ["src/**/*"],
  // 编译器排除的文件列表
  "exclude": ["node_modules"]
}
~~~
::: tip
如果使用的是 `Node` 其他版本，可以查看 [Centralized Recommendations for TSConfig bases](https://github.com/tsconfig/bases) 的相关配置。
:::
将所有的构建和发布脚本放置在文件夹 `build` 下，方便后续的维护管理。构建脚本的目录结构设计如下所示：
~~~shell
build
├── base.ts                      # 可以被构建、发布等脚本进行继承使用
├── build.ts                     # 构建脚本
├── config.ts                    # 配置，主要被 base 进行消费
├── gulpfile.ts                  # Gulp 构建配置文件
└── type.ts                      # 接口、枚举说明
~~~
接下来重点看一下平铺构建目录的脚本设计，`type.ts` 用于声明类型：
~~~ts
// type.ts
import { Settings } from "gulp-typescript";

export enum TargetTypeEnum {
  CommonJS = "CommonJS",
  ESModule = "ESModule",
}

export interface ITarget {
  name: string;
  type: TargetTypeEnum;
  tsconfig: Settings;
  dest: string;
}
~~~
`config.ts` 用于配置 `Gulp` 构建任务的信息：
~~~ts
// config.ts
import path from "path";
import { TargetTypeEnum } from "./type";

// 输出规范的目标集（这里可能命名成 gulpTasks 更合适）
export const targets = [
  {
    name: "build commonjs",
    type: TargetTypeEnum.CommonJS,
    tsconfig: {
      // 指定输出的模块化标准，例如课程中常说的 CommonJS 和 ES Modules（ES2015/ES6/ES2020）
      // 中文查看（模块概念）：https://www.tslang.cn/docs/handbook/modules.html
      // 英文查看（模块编译示例）：https://www.typescriptlang.org/tsconfig/#module
      module: "CommonJS",
      // 指定输出的 JS 标准（ES3/ES5/ES6/.../ESNext）
      // 在课程中已经讲解 ES5 能够兼容大部分的浏览器
      target: "ES5",
    },
    dest: path.join(__dirname, "../lib/commonjs"),
  },
  {
    name: "build esmodule",
    type: TargetTypeEnum.ESModule,
    tsconfig: {
      // 模块化输出 ES Modules 规范，其余代码编译成 ES5 标准
      module: "ES2015",
      target: "ES5",
    },
    dest: path.join(__dirname, "../lib/es"),
  },
];
~~~
`base.ts` 可以被构建和发布脚本（后续课程设计）共享：
~~~ts
// base.ts
import path from "path";
import { targets } from "./config";
import { ITarget } from "./type";

export class Base {
  public rootPath: string = "";
  public destPaths: string[] = [];

  constructor() {
    this.rootPath = path.join(__dirname, "../");
    this.destPaths = targets.map((target) => target.dest);
  }

  getTargets(): ITarget[] {
    return targets;
  }

  // 是否需要平铺
  isFlat() {
    // package.json 中的 config 参数
    // https://docs.npmjs.com/cli/v8/configuring-npm/package-json#config
    return process.env.npm_package_config_flat;
  }
}
~~~
`gulpfile.ts` 是 `Gulp` 的配置文件：
~~~ts
// gulpfile.ts
import gulp from "gulp";
import ts from "gulp-typescript";
import merge2 from "merge2";
import { Base } from "./base";
import { ITarget } from "./type";

class GulpBuild extends Base {
  constructor() {
    super();
  }

  build(target: ITarget) {
    const tsProject = ts.createProject("../tsconfig.json", target.tsconfig);
    // tsProject.src() 默认会基于 tsconfig.json 中的 files、exclude 和 include 指定的源文件进行编译
    const tsResult = tsProject.src().pipe(tsProject());
    const tsDest = gulp.dest(target.dest, { overwrite: true });
    return merge2([tsResult.dts.pipe(tsDest), tsResult.js.pipe(tsDest)]);
  }

  run() {
    const targets = this.getTargets();
    targets.forEach((target) =>
      gulp.task(target.name, () => this.build(target))
    );
    gulp.task("default", gulp.parallel(targets.map((target) => target.name)));
  }
}

new GulpBuild().run();
~~~
`build.ts` 是核心的构建脚本，它首先会清空构建目录，其次会同步执行 `gulp` 命令（指定配置文件为 `gulpfile.ts`）进行构建，最后对构建后的文件进行平铺处理：
~~~ts
// build.ts
import path from "path";
import fs from "fs-extra";
import shell from "shelljs";
import glob from "glob";
import { Base } from "./base";
import { TargetTypeEnum } from "./type";

// package.json 中的 config 参数
// https://docs.npmjs.com/cli/v8/configuring-npm/package-json#config
const flat = process.env.npm_package_config_flat;

class Build extends Base {
  constructor() {
    super();
  }

  run() {
    // 构建初始化
    this.init();
    // 同步执行构建
    this.build();
    // 平铺构建
    this.flat();
  }

  init() {
    // 清空 lib 目录下的 commonjs 和 es 文件夹
    this.destPaths?.forEach((destPath) => {
      fs.removeSync(destPath);
      fs.emptyDirSync(destPath);
    });
  }

  build() {
    // 构建参数
    // --gulpfile: 指定 gulpfile.ts 的文件路径
    // --color: 构建时打印带颜色的日志
    shell.exec(
      `gulp --gulpfile ${path.join(__dirname, "gulpfile.ts")} --color `,
      {
        // 构建同步执行
        async: false,
        // 构建失败则退出进程（例如 TypeScript 类型检查失败），停止后续的平铺构建处理
        fatal: true,
      }
    );
  }

  flat() {
    if (!this.isFlat()) {
      return;
    }

    // 对 commonjs 规范进行平铺处理（大家可以自行设计一下 ES Modules 的平铺处理）
    const targets = this.getTargets();
    const commonjsTarget = targets?.find(
      (target) => target.type === TargetTypeEnum.CommonJS
    );
    if (!commonjsTarget) {
      return;
    }
    const destPath = commonjsTarget.dest;
    // 同步获取构建目录下的所有文件
    // 例如：files:  [
    //     'lib/commonjs/index.js',
    //     'lib/commonjs/core/core.js',
    //     ...
    //   ]
    const files = glob.globSync(`${destPath}/**/*.js`);

    // 如果存在相同的文件名称，则清空构建目录，并退出构建处理
    if (this.hasSameFileName(files)) {
      this.init();
      return process.exit(1);
    }

    // 进行构建文件的平铺处理
    this.buildFlatFiles(files, destPath);

    // 拷贝声明文件到一级目录下
    this.copyDeclarationFiles(destPath);

    // 清空构建的子文件夹
    this.emptyBuildSubDir(destPath);
  }

  hasSameFileName(files: string[]): boolean {
    // 目录平铺后必须确保不能产生同名文件，例如 lib/commonjs/index.js 和 lib/commonjs/core/index.js
    const fileRepeatMap: { [key: string]: string[] } = {};
    return files.some((file) => {
      // 将 lib/commonjs/index.js 转化为 index.js
      const fileName = file.substring(file.lastIndexOf("/") + 1);
      const fileRepeatArr = fileRepeatMap[fileName];
      // 存储 index.js 为文件名的文件路径数组，例如 { "index.js": ["lib/commonjs/index.js"] }
      fileRepeatMap[fileName] = fileRepeatArr
        ? [...fileRepeatArr, file]
        : [file];
      // 如果 index.js 的文件路径存在多个，则提示错误并退出进程，例如 { "index.js": ["lib/commonjs/index.js", "lib/commonjs/core/index.js" ] }
      if (fileRepeatMap[fileName]?.length > 1) {
        this.logError(`[编译失败] 编译不允许存在相同的文件名称: ${fileName}`);
        this.logError(
          `[编译失败] 相同的文件名称路径：${fileRepeatMap[fileName].join(", ")}`
        );
        return true;
      }
      return false;
    });
  }

  buildFlatFiles(files: string[], destPath: string) {
    // 如果没有同名文件，则进行文件平铺
    files.forEach((file) => {
      // 获取构建文件的目标代码
      let code = fs.readFileSync(file).toString();

      // 正则说明：
      // (?<=require(")(.*?)(?=")) 主要分为三部分: (?<=require(")、(.*?)、(?="))
      // (?<=require("): 反向肯定预查, ?<=pattern, 用于匹配以 require(" 开头的字符串，注意 require(" 是转义后的字符串，匹配的是 require("
      // (.*?): 用于匹配最短路径的内容，其中 ? 用于非贪婪匹配, * 是贪婪匹配，? 是只能匹配 0 ~ 1 次
      // (?=")): 正向肯定预查，?=pattern, 用于匹配以 ") 结尾的字符串，注意 ") 是转义后的字符串，匹配的是 ")

      // 正则场景解释:
      // 例如压缩后的代码： require("./core/core"),fs_1=__importDefault(require("fs")
      // 通过 (.*) 匹配后默认会匹配到 ./core/core"),fs_1=__importDefault(require("fs
      // 通过 (.*?) 匹配后默认会匹配到 ./core/core 和 fs
      // 其中 ? 的作用用于贪婪匹配中的 0 ~ 1 次, 从而阻止了 * 的 0 ~ n 次贪婪匹配

      // 平铺目录后需要将引入路径进行更改，因为平铺后目标文件的位置发送了变化，因此被引用的路径也需要改变
      // 例如在 src/index.ts 中需要引入 core/core.ts，使用 gulp 构建后是 require("./core/core");
      // 但是目录平铺之后 index.js 和 core.js 同级，因此希望将目标代码更改为 require("./core"); 需要去掉中间的目录路径 core

      //   ├── src
      //   │   ├── core/
      //   │   │   ├── core1/
      //   │   │   │   └── core1.ts
      //   │   │   └── core.ts
      //   │   └── index.ts
      //   ├── lib
      //   │   ├── commonjs/
      //   │   │   ├── package.json
      //   │   │   ├── core.ts
      //   │   │   ├── core1.ts
      //   │   │   └── index.ts

      // 转换引入路径，例如: require('./core/core') => require('./core')
      code = code.replace(/(?<=require(")(.*?)(?="))/g, (match) => {
        if (!match) {
          return match;
        }
        // 例如： match = './core/core'
        const paths = match.split("/");
        // 获取文件名
        const fileName = paths.concat().pop();
        // 不需要更改的引用路径的情况，例如 require("lodash")
        if (!fileName || paths.length === 1) {
          return match;
        }
        this.logInfo(
          `[编译信息] 在文件 ${file} 中匹配和替换的 require 路径: ${match} => ./${fileName}`
        );
        // 平铺后直接引入同级目录下的文件
        return `./${fileName}`;
      });

      // TODO: 如果需要生成 sourcemap，则 sourcemap 的路径也需要处理

      // 删除当前目录下的目标文件，例如 lib/commonjs/core/core.js
      fs.rmSync(file);

      // 将 lib/commonjs/core/core.js 转化为 lib/commonjs/core.js
      const fileName = file.substring(file.lastIndexOf("/") + 1);
      // 生成平级文件的写入路径
      const fileOutputPath = path.join(destPath, fileName);
      // 写入更改后的目标代码
      fs.writeFileSync(fileOutputPath, code);
    });
  }

  copyDeclarationFiles(destPath: string) {
    const files = glob.globSync(`${destPath}/**/*.d.ts`);
    files.forEach((file) => {
      // 将 lib/commonjs/index.js 转化为 index.js
      const fileName = file.substring(file.lastIndexOf("/") + 1);
      if (file !== path.join(destPath, fileName)) {
        fs.copySync(file, path.join(destPath, fileName));
        fs.rmSync(file);
      }
    });
  }

  emptyBuildSubDir(destPath: string) {
    // 平铺完成后，匹配文件夹并删除空的文件夹
    // 匹配文件夹：to match only directories, simply put a / at the end of the pattern.
    // 反转以后可以从内到外进行文件夹删除（先删除内部的子文件夹）
    const dirs = glob.globSync(`${destPath}/**/`).reverse();

    dirs.forEach((dir) => {
      const subdirs = fs.readdirSync(dir);
      // 如果文件夹为空，则删除文件夹（注意从内到外进行删除，core/core1 的情况下先删除 core1 文件夹，再删除 core 文件夹）
      if (!subdirs?.length) {
        fs.rmdirSync(dir);
      }
    });
  }
}

new Build().run();
~~~
::: tip
如果 `build` 目录的设计非常通用，可以发布成 `NPM` 包进行处理（例如 `create-react-app` 中的 [react-scripts](https://github.com/facebook/create-react-app/tree/main/packages/react-scripts)），从而可以在各种需要快速创建按需加载的工具库项目中进行构建脚本的复用。除此之外，如果构建脚本的参数非常多，也可以将构建参数提供成配置文件的方式，例如在项目根目录中提供一个 `ziyi-sdk.config.js`，从而可以在构建脚本中引入声明的配置文件进行构建配置读取。
:::
上述构建脚本 `build.ts` 主要做了几件事情：
- 构建脚本的参数处理，例如 `flat` 配置，从而可以满足更灵活的需求；
- 使用 `shelljs` 同步执行 `gulp` 构建命令；
- 构建完成后进行构建目录的平铺处理，从而简化按需引入的路径。

执行 `npm run build` 后可以进行构建处理，如下所示：
~~~shell
npm run build

> micro-framework@1.0.0 build
> ts-node build/build.ts

[09:06:56] Requiring external module ts-node/register
[09:06:56] Working directory changed to ~/Desktop/Github/micro-framework/build
[09:06:57] Using gulpfile ~/Desktop/Github/micro-framework/build/gulpfile.ts
[09:06:57] Starting 'default'...
[09:06:57] Starting 'build commonjs'...
[09:06:57] Starting 'build esmodule'...
[09:06:58] Finished 'build esmodule' after 709 ms
[09:06:58] Finished 'build commonjs' after 710 ms
[09:06:58] Finished 'default' after 711 ms
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./comm/comm1 => ./comm1
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./comm/comm2 => ./comm2
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./core/core => ./core
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./nav/nav => ./nav
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./opt/opt1 => ./opt1
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./opt/opt2 => ./opt2
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./sandbox/sandbox1 => ./sandbox1
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./sandbox/sandbox2 => ./sandbox2
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js 中匹配和替换的 require 路径:  ./sandbox/sandbox3 => ./sandbox3
[编译信息] 在文件 /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/core/core.js 中匹配和替换的 require 路径:  ./core1/core1 => ./core1
~~~
此时会在 `lib` 目录下生成 `commonjs` 和 `es` 文件目录，其中 `commonjs` 做了平铺处理：
~~~shell
# 平铺前
lib
├── commonjs                      
│   ├── index.js                 
│   ├── index.d.ts               
│   ├── core                     
│   │   ├── core.d.ts           
│   │   └── core.js              
│   ├── sandbox                   
│   │   ├── sandbox1.d.ts        
│   │   ├── sandbox1.js          
│   │   ├── sandbox2.d.ts        
│   │   ├── sandbox2.js          
│   │   ├── sandbox3.d.ts        
│   │   └── sandbox3.js                      
│   ├── opt                      
│   │   ├── opt1.d.ts           
│   │   ├── opt1.js              
│   │   ├── opt2.d.ts           
│   │   └── opt2.js              
│   └── comm                     
│       ├── comm1.d.ts           
│       ├── comm1.js              
│       ├── comm2.d.ts           
│       └── comm2.js              


# 平铺后
lib
├── commonjs                      
│   ├── comm1.d.ts                
│   ├── comm1.js                  
│   ├── comm2.d.ts                
│   ├── comm2.js                  
│   ├── core.d.ts                
│   ├── core.js                   
│   ├── index.d.ts               
│   ├── index.js     
│   ├── nav.d.ts                 
│   ├── nav.js    
│   ├── op1.d.ts   
│   ├── op1.js
│   ├── op2.d.ts  
│   ├── op2.js
│   ├── sandbox1.d.ts
│   ├── sandbox1.js  
│   ├── sandbox2.d.ts
│   ├── sandbox2.js  
│   ├── sandbox3.d.ts
│   └── sandbox3.js
~~~
需要注意，在设计的过程中一定要考虑检查同名文件，因为在 `commonjs` 下平铺后不应该存在两个同名文件，例如：
~~~shell
├── src                            
│   ├── index.js                 
│   ├── core                     
│   │    └── index.js  # 同名文件，和 src/index.js 同名
~~~
执行构建时，需要将同名文件识别出来，并进行构建失败提醒：
~~~shell
npm run build

> micro-framework@1.0.0 build
> ts-node build/build.ts

[09:40:47] Requiring external module ts-node/register
[09:40:47] Working directory changed to ~/Desktop/Github/micro-framework/build
[09:40:48] Using gulpfile ~/Desktop/Github/micro-framework/build/gulpfile.ts
[09:40:48] Starting 'default'...
[09:40:48] Starting 'build commonjs'...
[09:40:48] Starting 'build esmodule'...
[09:40:48] Finished 'build commonjs' after 641 ms
[09:40:48] Finished 'build esmodule' after 642 ms
[09:40:48] Finished 'default' after 643 ms
[编译失败] 编译不允许存在相同的文件名称: index.js
[编译失败] 相同的文件名称路径：/Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/index.js, /Users/zhuxiankang/Desktop/Github/micro-framework/lib/commonjs/core/index.js
~~~
当然使用 `gulp-typescript`，相对于 `swc` 以及 `babel` 的好处是可以在构建时进行类型检查，例如在 `src/index.ts` 中新增如下代码：
~~~ts
function a(b: number) {
  console.log(b);
}

// a 函数明显要求传入 number 类型的数据
a("111");
~~~
执行构建时，会直接报错并停止构建：
~~~shell
 npm run build

> micro-framework@1.0.0 build
> ts-node build/build.ts

[09:49:05] Requiring external module ts-node/register
[09:49:05] Working directory changed to ~/Desktop/Github/micro-framework/build
[09:49:06] Using gulpfile ~/Desktop/Github/micro-framework/build/gulpfile.ts
[09:49:06] Starting 'default'...
[09:49:06] Starting 'build commonjs'...
[09:49:06] Starting 'build esmodule'...
../src/index.ts(15,3): error TS2345: Argument of type 'string' is not assignable to parameter of type 'number'.
TypeScript: 1 semantic error
TypeScript: emit failed
[09:49:06] 'build commonjs' errored after 314 ms
[09:49:06] Error: TypeScript: Compilation failed
    at Output.mightFinish (/Users/zhuxiankang/Desktop/Github/micro-framework/node_modules/gulp-typescript/release/output.js:131:43)
    at Output.finish (/Users/zhuxiankang/Desktop/Github/micro-framework/node_modules/gulp-typescript/release/output.js:123:14)
    at ProjectCompiler.inputDone (/Users/zhuxiankang/Desktop/Github/micro-framework/node_modules/gulp-typescript/release/compiler.js:97:29)
    at CompileStream.end (/Users/zhuxiankang/Desktop/Github/micro-framework/node_modules/gulp-typescript/release/project.js:125:31)
    at DestroyableTransform.onend (/Users/zhuxiankang/Desktop/Github/micro-framework/node_modules/readable-stream/lib/_stream_readable.js:577:10)
    at Object.onceWrapper (node:events:627:28)
    at DestroyableTransform.emit (node:events:525:35)
    at DestroyableTransform.emit (node:domain:552:15)
    at endReadableNT (/Users/zhuxiankang/Desktop/Github/micro-framework/node_modules/readable-stream/lib/_stream_readable.js:1010:12)
    at processTicksAndRejections (node:internal/process/task_queues:83:21)
[09:49:06] 'default' errored after 316 ms
~~~





