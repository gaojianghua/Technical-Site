# Electron
[官方文档](https://www.electronjs.org/zh/)

## 简介
Electron是一个使用 JavaScript、HTML 和 CSS 构建桌面应用程序的框架。Electron 内部封装了 Chromium 浏览器核心和 Node.js，而且还为开发者暴露出了很多必要的操作系统 API，有了它，前端开发者就可以使用前端开发技术来开发桌面应用了。
Electron 可以使用几乎所有的 Web 前端生态领域及 Node.js 生态领域的组件和技术方案。
<br>
<br>
不足之处：
* 打包后的应用体积巨大
  <br>
  <br>
  一个功能不算多的桌面应用，通过 electron-builder 压缩打包后至少要 50M。而且如果开发者不做额外的 Hack 工作的话，用户每次升级应用程序，还要让用户再下载一次同样体积的安装包。这对于应用分发来说是一个不小的负担。但随着网络环境越来越好，用户磁盘的容积越来越大，此问题给用户带来的损失会慢慢被削弱。
  <br>
  <br>
* 版本发布过快
  <br>
  <br>
  为了跟进 Chromium (和 Node.js) 的版本发布节奏，Electron 也有非常频繁的版本发布机制，每次 Chromium 的改动，都可能导致 Electron 冒出很多新的问题，甚至稳定版本都有很多未解决的问题。好在关键核心功能一直以来都是稳定的。
  <br>
  <br>
* 安全性问题
  <br>
  <br>
  Electron 把一些有安全隐患的模块和 API 都设置为默认不可用的状态，但这些模块和 API 都是非常常用的，有的时候开发者不得不打开这些开关，一旦处理不当，就可能导致他们开发的应用存在安全隐患，给开发者乃至终端用户带来伤害。
  <br>
  <br>
* 资源消耗较大
  <br>
  <br>
  Electron 底层基于 Chromium 浏览器，资源占用较多一直以来都是 Chromium 被人诟病的问题，目前来看这个问题还没有很好的解决办法，只能依赖 Chromium 团队对 Chromium 的优化工作了。
  <br>
  <br>
* 性能问题
  <br>
  <br>
  Electron 本身是多进程、多线程的框架，但 JavaScript 是单线程运行的，如果产品的需求中有大量音视频编解码、复杂数据格式化这类 CPU 消耗性的需求，那么不应该在 Electron 内使用 JavaScript 来实现这些需求，而应该使用 Node.js 的原生模块来实现这些需求。与其说这是一个 Electron 的不足，不如说这是 JavaScript 的不足。
  <br>
  <br>


## 构建开发环境
- 创建项目
  ~~~shell
  npm create vite@latest Electron-Vue-TMP -- --template vue-ts
  ~~~
- 安装 Electron 开发依赖
  ~~~shell
  npm install electron -D
  ~~~
  package.json 文件应该与下面大体类似
  ~~~json
  {
    "name": "electron-jue-jin",
    "private": true,
    "version": "0.0.1",
    "scripts": {
      "dev": "vite",
      "build": "vue-tsc --noEmit && vite build",
      "preview": "vite preview"
    },
    "dependencies": {},
    "devDependencies": {
      "vue": "^3.2.37",
      "@vitejs/plugin-vue": "^3.0.0",
      "electron": "^19.0.8",
      "typescript": "^4.6.4",
      "vite": "^3.0.0",
      "vue-tsc": "^0.38.4"
    }
  }
  ~~~
  注意：这里我们把 vue 从 dependencies 配置节移至了 devDependencies 配置节。这是因为在 Vite 编译项目的时候，Vue 库会被编译到输出目录下，输出目录下的内容是完整的，没必要把 Vue 标记为生产依赖；而且在我们将来制作安装包的时候，还要用到这个 package.json 文件，它的生产依赖里不应该有没用的东西，所以我们在这里做了一些调整。
  <br>
  <br>
- 创建主进程入口代码
  ~~~js
  //src/main/mainEntry.ts
  import { app, BrowserWindow } from "electron";

  let mainWindow: BrowserWindow;

  app.whenReady().then(() => {
    mainWindow = new BrowserWindow({});
    mainWindow.loadURL(process.argv[2]);
  });
  ~~~
  上面这段代码里，我们在 app ready 之后创建了一个简单的 BrowserWindow 对象。app 是 Electron 的全局对象，用于控制整个应用程序的生命周期。在 Electron 初始化完成后，app 对象的 ready 事件被触发，这里我们使用 app.whenReady() 这个 Promise 方法来等待 ready 事件的发生。
  <br>
  <br>
  mainWindow 被设置成一个全局变量，这样可以避免主窗口被 JavaScript 的垃圾回收器回收掉。另外，窗口的所有配置都使用了默认的配置。
  <br>
  <br>
  这个窗口加载了一个 Url 路径，这个路径是以命令行参数的方式传递给应用程序的，而且是命令行的第三个参数。
  <br>
  <br>
  app 和 BrowserWindow 都是 Electron 的内置模块，这些内置模块是通过 ES Module 的形式导入进来的，我们知道 Electron 的内置模块都是通过 CJS Module 的形式导出的，这里之所以可以用 ES Module 导入，是因为我们接下来做的主进程编译工作帮我们完成了相关的转化工作。
  <br>
  <br>
- 开发环境 Vite 插件  
  <br>
  主进程的代码写好之后，只有编译过之后才能被 Electron 加载，我们是通过 Vite 插件的形式来完成这个编译工作和加载工作的，如下代码所示：
  ~~~js
  //plugins/devPlugin.ts
  import { ViteDevServer } from "vite";
  /**
   * vite 插件作用是用来监听vite 启动时候去触发 electron 启动‘mainEntry.ts^
   * 并且传入°mainEntry.ts°中监听的从vite传入的启动地址
   */
  export let devPlugin = () => {
    return {
      name: "dev-plugin",
      configureServer(server: ViteDevServer) {
        // Electron 的内置模块都是通过 CJS Module 的形式导出的，这里之所以可以用 ES Module，完全利用 esbuild 进行了转换。
        require("esbuild").buildSync({
          // 转换文件
          entryPoints: ["./src/main/mainEntry.ts"],
          bundle: true,
          // 平台
          platform: "node",
          // 转换后输出文件
          outfile: "./dist/mainEntry.js",
          // 不会构建原样输出
          external: ["electron"], 
        });
        // 开始监听vite的启动，如果vite 启动了触发钩子再去启动electron
        server.httpServer.once("listening", () => {
          // 启动一个子进程来执行命令，理解成通过node 脚本执行一个控制 输入的指令
          let { spawn } = require("child_process");
          let addressInfo = server.httpServer.address();
          /**
           * 如果打印出来的地址 http://：：1:5173 需要把${addressInfo.address} 改为 localhost
           */ 
          let httpAddress = `http://${addressInfo.address}:${addressInfo.port}`;
          /**
           * 下面代码中用到的 spawn 方法：第一个参数是要运行的命令，第二个参数是字符串参数的列表，第三个参数是一些配置项
           * 下面代码实际执行的是: node_moduleslelectronldistlelectron.exe ./dist/mainEntry .js http://127.0.0.1:5173/
           */
          let electronProcess = spawn(
            require("electron").toString(), 
            // ./dist/mainEntry. js是我们在上面利用esbuild输出的cjs形式的真正 electron 入口使用配置
            ["./dist/mainEntry.js", httpAddress],
            {
              // 设置触发的根目录process.cwd(）返回的值就是当前项目的根目录
              cwd: process.cwd(), 
              // 设置了stdio："inherit’，在执行代码的时候，子进程会继承主进程的stdin, stdout, stderr。这会使子进程data事件处理函数的打印输出到主进程的标准输出中
              stdio: "inherit", 
            }
          );
          // 当electron 子进程退出的时候，我们要关闭 Vite的http服务，并且控制父进程退出
          electronProcess.on("close", () => {
            server.close();
            process.exit();
          });
        });
      },
    };
  };
  ~~~
  这个插件中我们注册了一个名为 configureServer 的钩子，当 Vite 为我们启动 Http 服务的时候，configureServer钩子会被执行。
  <br>
  <br>
  这个钩子的输入参数为一个类型为 ViteDevServer 的对象 server，这个对象持有一个 http.Server 类型的属性 httpServer，这个属性就代表着我们调试 Vue 页面的 http 服务，一般情况下地址为：http://127.0.0.1:5173/。
  <br>
  <br>
  为什么这里传递了两个命令行参数，而主进程的代码接收第三个参数（process.argv[2]）当作 http 页面的地址呢？因为默认情况下 electron.exe 的文件路径将作为第一个参数。也就是我们通过 require("electron") 获得的字符串。
  > 这个路径一般是：node_modules/electron/dist/electron.exe，如果这个路径下没有对应的文件，说明你的 Electron 模块没有安装好。
  
  我们是通过 Node.js child_process 模块的 spawn 方法启动 electron 子进程的，除了两个命令行参数外，还传递了一个配置对象。
  <br>
  <br>
  这个对象的 cwd 属性用于设置当前的工作目录，process.cwd() 返回的值就是当前项目的根目录。stdio 用于设置 electron 进程的控制台输出，这里设置 inherit 可以让 electron 子进程的控制台输出数据同步到主进程的控制台。这样我们在主进程中 console.log 的内容就可以在 VSCode 的控制台上看到了。
  <br>
  <br>
  当 electron 子进程退出的时候，我们要关闭 Vite 的 http 服务，并且控制父进程退出，准备下一次启动。

  <br>
  http 服务启动之前，我们使用 esbuild 模块完成了主进程 TypeScript 代码的编译工作，这个模块是 Vite 自带的，所以我们不需要额外安装，可以直接使用。
  <br>
  <br>
  主进程的入口文件是通过 entryPoints 配置属性设置的，编译完成后的输出文件是通过 outfile 属性配置的。
  <br>
  <br>
  编译平台 platform 设置为 node，排除的模块 external 设置为 electron，正是这两个设置使我们在主进程代码中可以通过 import 的方式导入 electron 内置的模块。非但如此，Node 的内置模块也可以通过 import 的方式引入。
  <br>
  <br>
  这个 Vite 插件的代码编写好后，在 vite.config.ts 文件中引入一下就可以使用了，如下代码所示：
  
  ~~~js
  // vite.config.ts
  import { defineConfig } from "vite";
  import vue from "@vitejs/plugin-vue";
  import { devPlugin } from "./plugins/devPlugin";

  export default defineConfig({
    plugins: [devPlugin(), vue()],
  });
  ~~~
  现在执行命令 npm run dev，你会看到 Electron 应用加载了 Vue 的首页
  <br>
  <br>
- 渲染进程集成内置模块
  <br>
  <br>
  现在主进程内可以自由的使用 Electron 和 Node.js 的内置模块了，但渲染进程还不行。首先我们修改一下主进程的代码，打开渲染进程的一些开关，允许渲染进程使用 Node.js 的内置模块，如下代码所示：
  ~~~js
  // src/main/mainEntry.ts
  import { app, BrowserWindow } from "electron";
  process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
  let mainWindow: BrowserWindow;

  app.whenReady().then(() => {
    let config = {
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        allowRunningInsecureContent: true,
        contextIsolation: false,
        webviewTag: true,
        spellcheck: false,
        disableHtmlFullscreenWindowResize: true,
      },
    };
    mainWindow = new BrowserWindow(config);
    mainWindow.webContents.openDevTools({ mode: "undocked" });
    mainWindow.loadURL(process.argv[2]);
  });
  ~~~
  这段代码中，有以下几点需要注意：
  1. ELECTRON_DISABLE_SECURITY_WARNINGS 用于设置渲染进程开发者调试工具的警告，这里设置为 true 就不会再显示任何警告了。
     >如果渲染进程的代码可以访问 Node.js 的内置模块，而且渲染进程加载的页面（或脚本）是第三方开发的，那么恶意第三方就有可能使用 Node.js 的内置模块伤害最终用户 。这就是为什么这里要有这些警告的原因。如果你的应用不会加载任何第三方的页面或脚本。那么就不用担心这些安全问题啦。
  2. nodeIntegration配置项的作用是把 Node.js 环境集成到渲染进程中，contextIsolation配置项的作用是在同一个 JavaScript 上下文中使用 Electron API。其他配置项与本文主旨无关，大家感兴趣的话可以自己翻阅官方文档。
  3. webContents的openDevTools方法用于打开开发者调试工具
  <br>
  <br>
- 设置 Vite 模块别名与模块解析钩子
  <br>
  <br>
  虽然我们可以在开发者调试工具中使用 Node.js 和 Electron 的内置模块，但现在还不能在 Vue 的页面内使用这些模块。
  <br>
  <br>
  这是因为 Vite 主动屏蔽了这些内置的模块，如果开发者强行引入它们，那么大概率会得到如下报错：
  ~~~rust
  Module "xxxx" has been externalized for browser compatibility and cannot be accessed in client code.
  ~~~
  首先我们为工程安装一个 Vite 组件：[vite-plugin-optimizer](https://github.com/vite-plugin/vite-plugin-optimizer)。
  ~~~shell
  npm i vite-plugin-optimizer -D
  ~~~
  ~~~js
  // vite.config.ts
  import { defineConfig } from "vite";
  import vue from "@vitejs/plugin-vue";
  import { devPlugin, getReplacer } from "./plugins/devPlugin";
  import optimizer from "vite-plugin-optimizer";

  export default defineConfig({
    plugins: [optimizer(getReplacer()), devPlugin(), vue()],
  });
  ~~~
  vite-plugin-optimizer 插件会为你创建一个临时目录：node_modules.vite-plugin-optimizer。
  <br>
  <br>
  然后把类似 ```const fs = require('fs'); export { fs as default }``` 这样的代码写入这个目录下的 fs.js 文件中。
  <br>
  <br>
  渲染进程执行到：import fs from "fs" 时，就会请求这个目录下的 fs.js 文件，这样就达到了在渲染进程中引入 Node 内置模块的目的。
  <br>
  <br>
  getReplacer 方法是我们为 vite-plugin-optimizer 插件提供的内置模块列表。代码如下所示：
  ~~~ts
  // plugins/devPlugin.ts
  export let getReplacer = () => {
    let externalModels = ["os", "fs", "path", "events", "child_process", "crypto", "http", "buffer", "url", "better-sqlite3", "knex"];
    let result = {};
    for (let item of externalModels) {
      result[item] = () => ({
        find: new RegExp(`^${item}$`),
        code: `const ${item} = require('${item}');export { ${item} as default }`,
      });
    }
    result["electron"] = () => {
      let electronModules = ["clipboard", "ipcRenderer", "nativeImage", "shell", "webFrame"].join(",");
      return {
        find: new RegExp(`^electron$`),
        code: `const {${electronModules}} = require('electron');export {${electronModules}}`,
      };
    };
    return result;
  };
  ~~~
  我们在这个方法中把一些常用的 Node 模块和 electron 的内置模块提供给了 vite-plugin-optimizer 插件，以后想要增加新的内置模块只要修改这个方法即可。而且 vite-plugin-optimizer 插件不仅用于开发环境，编译 Vue 项目时，它也会参与工作 。
  <br>
  <br>
  再次运行你的应用，看看现在渲染进程是否可以正确加载内置模块了呢？你可以通过如下代码在 Vue 组件中做这项测试：
  ~~~js
  //src/render/App.vue
  import fs from "fs";
  import { ipcRenderer } from "electron";
  import { onMounted } from "vue";
  onMounted(() => {
    console.log(fs.writeFileSync);
    console.log(ipcRenderer);
  });
  ~~~


- 开发打包 Vite 插件
  <br>
  <br>
  1. 编译结束钩子函数
     <br>
     <br>
     新增 build 配置项
     ~~~js
     //vite.config.ts
     //import { buildPlugin } from "./plugins/buildPlugin";
     build: {
       rollupOptions: {
         plugins: [buildPlugin()]
       }
     }
     ~~~
     新建 buildPlugin 插件
     ~~~ts
     //plugins/buildPlugin.ts
     export let buildPlugin = () => {
       return {
         name: "build-plugin",
         closeBundle: () => {
           let buildObj = new BuildObj();
           buildObj.buildMain();
           buildObj.preparePackageJson();
           buildObj.buildInstaller();
         },
       };
     };
     ~~~
     这是一个标准的 Rollup 插件（Vite 底层就是 Rollup，所以 Vite 兼容 Rollup 的插件），我们在这个插件中注册了 closeBundle 钩子。
     <br>
     <br>
     在 Vite 编译完代码之后（也就是我们执行 npm run build 指令，而且这个指令的工作完成之后），这个钩子会被调用。我们在这个钩子中完成了安装包的制作过程。
     <br>
     <br>
  2. 制作应用安装包
     <br>
     <br>
     Vite 编译完成之后，将在项目dist目录内会生成一系列的文件（如下图所示），此时closeBundle钩子被调用，我们在这个钩子中把上述生成的文件打包成一个应用程序安装包。
     <br>
     <br>
     这些工作是通过一个名为buildObj的对象完成的，它的代码如下所示：
     ~~~ts
     //plugins/buildPlugin.ts
     import path from "path";
     import fs from "fs";

     class BuildObj {
       //编译主进程代码
       buildMain() {
         require("esbuild").buildSync({
           entryPoints: ["./src/main/mainEntry.ts"],
           bundle: true,
           platform: "node",
           minify: true,
           outfile: "./dist/mainEntry.js",
           external: ["electron"],
         });
       }
       //为生产环境准备package.json
       preparePackageJson() {
         let pkgJsonPath = path.join(process.cwd(), "package.json");
         let localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8"));
         let electronConfig = localPkgJson.devDependencies.electron.replace("^", "");
         localPkgJson.main = "mainEntry.js";
         delete localPkgJson.scripts;
         delete localPkgJson.devDependencies;
         localPkgJson.devDependencies = { electron: electronConfig };
         let tarJsonPath = path.join(process.cwd(), "dist", "package.json");
         fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson));
         fs.mkdirSync(path.join(process.cwd(), "dist/node_modules"));
       }
       //使用electron-builder制成安装包
       buildInstaller() {
         let options = {
           config: {
             directories: {
               output: path.join(process.cwd(), "release"),
               app: path.join(process.cwd(), "dist"),
             },
             files: ["**"],
             extends: null,
             productName: "JueJin",
             appId: "com.juejin.desktop",
             asar: true,
             nsis: {
               oneClick: true,
               perMachine: true,
               allowToChangeInstallationDirectory: false,
               createDesktopShortcut: true,
               createStartMenuShortcut: true,
               shortcutName: "juejinDesktop",
             },
             publish: [{ provider: "generic", url: "http://localhost:5500/" }],
           },
           project: process.cwd(),
         };
         return require("electron-builder").build(options);
       }
     }
     ~~~
     这个对象通过三个方法提供了三个功能，按照这三个方法的执行顺序，它们的功能如下：
     <br>
     <br>
     1. buildMain
        <br>
        <br>
        由于 Vite 在编译之前会清空 dist 目录，所以我们在上一节中生成的 mainEntry.js 文件也被删除了，此处我们通过buildMain方法再次编译主进程的代码。不过由于此处是在为生产环境编译代码，所以我们增加了minify: true 配置，生成压缩后的代码。如果你希望与开发环境复用编译主进程的代码，也可以把这部分代码抽象成一个独立的方法。
        <br>
        <br>
     2. preparePackageJson
        <br>
        <br>
        用户安装我们的产品后，在启动我们的应用程序时，实际上是通过 Electron 启动一个 Node.js 的项目，所以我们要为这个项目准备一个 package.json 文件，这个文件是以当前项目的 package.json 文件为蓝本制作而成的。里面注明了主进程的入口文件，移除了一些对最终用户没用的配置节。
        > 生成完 package.json 文件之后，还创建了一个 node_modules 目录。此举是为了阻止 electron-builder 的一些默认行为（这一点我们后续章节还会介绍，目前来说它会阻止electron-builder为我们创建一些没用的目录或文件）。
     
        >这段脚本还明确指定了 Electron 的版本号，如果 Electron 的版本号前面有"^"符号的话，需把它删掉。这是 electron-builder 的一个 Bug，这个 bug 导致 electron-builder 无法识别带 ^ 或 ~ 符号的版本号。
        
        <br>
     3. buildInstaller
        <br>
        <br>
        这个方法负责调用electron-builder提供的 API 以生成安装包。最终生成的安装包被放置在release目录下，这是通过config.directories.output指定的。静态文件所在目录是通过config.directories.app配置项指定。其他配置项，请自行查阅[官网文档](https://www.electron.build/)。

  >在真正创建安装包之前，你应该已经成功通过npm install electron-builder -D安装了 electron-builder 库。

  做好这些配置之后，执行npm run build就可以制作安装包了，最终生成的安装文件会被放置到 release 目录下。


## electron-builder 原理
1. 收集应用程序的配置信息。比如应用图标、应用名称、应用 id、附加资源等信息。有些配置信息可能开发者并没有提供，这时 electron-builder 会使用默认的值，总之，这一步工作完成后，会生成一个全量的配置信息对象用于接下来的打包工作。
<br>
<br>
2. 检查我们在输出目录下准备的 package.json 文件，查看其内部是否存在 dependencies 依赖，如果存在，electron-builder 会帮我们在输出目录下安装这些依赖。
<br>
<br>
3. 根据用户配置信息：asar 的值为 true 或 false，来判断是否需要把输出目录下的文件合并成一个 asar 文件。
<br>
<br>
4. 把 Electron 可执行程序及其依赖的动态链接库及二进制资源拷贝到安装包生成目录下的 win-ia32-unpacked 子目录内。
<br>
<br>
5. 检查用户是否在配置信息中指定了 extraResources 配置项，如果有，则把相应的文件按照配置的规则，拷贝到对应的目录中。
<br>
<br>
6. 根据配置信息使用一个二进制资源修改器修改 electron.exe 的文件名和属性信息（版本号、版权信息、应用程序的图标等）。
<br>
<br>
7. 如果开发者在配置信息中指定了签名信息，那么接下来 electron-builder 会使用一个应用程序签名工具来为可执行文件签名。
<br>
<br>
8. 使用 7z 压缩工具，把子目录 win-ia32-unpacked 下的内容压缩成一个名为 yourProductName-1.3.6-ia32.nsis.7z 的压缩包。
<br>
<br>
9. 使用 NSIS 工具生成卸载程序的可执行文件，这个卸载程序记录了 win-ia32-unpacked 目录下所有文件的相对路径，当用户卸载我们的应用时，卸载程序会根据这些相对路径删除我们的文件，同时它也会记录一些安装时使用的注册表信息，在卸载时清除这些注册表信息。
<br>
<br>
10. 使用 NSIS 工具生成安装程序的可执行文件，然后把压缩包和卸载程序当作资源写入这个安装程序的可执行文件中。当用户执行安装程序时，这个可执行文件会读取自身的资源，并把这些资源释放到用户指定的安装目录下。
<br>
<br>
>如果开发者配置了签名逻辑，则 electron-builder 也会为安装程序的可执行文件和卸载程序的可执行文件进行签名。


## 主进程生产环境加载本地文件
安装包无法正常启动，是因为应用程序的主进程还在通过 ```process.argv[2]``` 加载首页。显然用户通过安装包安装的应用程序没有这个参数。接下来就要让应用程序在没有这个参数的时候，也能加载我们的静态页面。
~~~js
//src/main/customScheme.ts
import { protocol } from "electron";
import fs from "fs";
import path from "path";

//为自定义的app协议提供特权
let schemeConfig = { standard: true, supportFetchAPI: true, bypassCSP: true, corsEnabled: true, stream: true };
protocol.registerSchemesAsPrivileged([{ scheme: "app", privileges: schemeConfig }]);

export class CustomScheme {
  //根据文件扩展名获取mime-type
  private static getMimeType(extension: string) {
    let mimeType = "";
    if (extension === ".js") {
      mimeType = "text/javascript";
    } else if (extension === ".html") {
      mimeType = "text/html";
    } else if (extension === ".css") {
      mimeType = "text/css";
    } else if (extension === ".svg") {
      mimeType = "image/svg+xml";
    } else if (extension === ".json") {
      mimeType = "application/json";
    }
    return mimeType;
  }
  //注册自定义app协议
  static registerScheme() {
    protocol.registerStreamProtocol("app", (request, callback) => {
      let pathName = new URL(request.url).pathname;
      let extension = path.extname(pathName).toLowerCase();
      if (extension == "") {
        pathName = "index.html";
        extension = ".html";
      }
      let tarFile = path.join(__dirname, pathName);
      callback({
        statusCode: 200,
        headers: { "content-type": this.getMimeType(extension) },
        data: fs.createReadStream(tarFile),
      });
    });
  }
}
~~~
<b>这段代码在主进程app ready前，通过 protocol 对象的 registerSchemesAsPrivileged 方法为名为 app 的 scheme 注册了特权（可以使用 FetchAPI、绕过内容安全策略等）。
<br>
<br>
在app ready之后，通过 protocol 对象的 registerStreamProtocol 方法为名为 app 的 scheme 注册了一个回调函数。当我们加载类似app://index.html这样的路径时，这个回调函数将被执行。</b>
<br>
<br>
这个函数有两个传入参数 request 和 callback，我们可以通过 request.url 获取到请求的文件路径，可以通过 callback 做出响应。
<br>
<br>
给出响应时，要指定响应的 statusCode 和 content-type，这个 content-type 是通过文件的扩展名得到的。这里我们通过 getMimeType 方法确定了少量文件的 content-type，如果你的应用要支持更多文件类型，那么可以扩展这个方法。
<br>
<br>
响应的 data 属性为目标文件的可读数据流。这也是为什么我们用 registerStreamProtocol 方法注册自定义协议的原因。当你的静态文件比较大时，不必读出整个文件再给出响应。
<br>
<br>
在 src/main/mainEntry.ts 中使用这段代码:
~~~js
//src/main/mainEntry.ts
if (process.argv[2]) {
  mainWindow.loadURL(process.argv[2]);
} else {
  CustomScheme.registerScheme();
  mainWindow.loadURL(`app://index.html`);
}
~~~
这样当存在指定的命令行参数时，我们就认为是开发环境，使用命令行参数加载页面，当不存在命令行参数时，我们就认为是生产环境，通过app:// scheme 加载页面。
>如果你不希望在开发环境中通过命令行参数的形式传递信息，那么你也可以在上一节介绍的代码中，为electronProcess 附加环境变量（使用spawn方法第三个参数的env属性附加环境变量）。


## 如何管控应用窗口
按照 Electron 官网的建议，窗口一开始应该是隐藏的，在ready-to-show事件触发后再显示窗口，如下代码所示：
~~~js
const { BrowserWindow } = require("electron");
const win = new BrowserWindow({ show: false });
win.once("ready-to-show", () => {
  win.show();
});
~~~
但这个事件对于我们来说触发的还是太早了，<b>因为 Vue 项目的 HTML 加载之后，JavaScript 脚本还需要做很多事情才能把组件渲染出来。况且开发者可能还会在 Vue 组件初始化的早期做很多额外的工作（比如准备基础数据之类的事情），所以显示窗口不能依赖ready-to-show事件，必须手动控制才好。</b>
<br>
<br>
主窗口对象mainWindow初始化时，把配置属性show设置为false，就可以让主窗口初始化成功后处于隐藏状态。接下来再在合适的时机让渲染进程控制主窗口显示出来即可。这里我们在WindowMain.vue组件渲染完成之后来完成这项工作，如下代码所示，showWindow事件是在我们上一节讲的CommonWindowEvent类注册的。
~~~js
// layout为布局页面也是主窗口页面
// src/render/layout/index.vue
import { ipcRenderer } from "electron";
import { onMounted } from "vue";
onMounted(() => {
  ipcRenderer.invoke("showWindow");
});
~~~
- 自定义窗口标题栏
~~~vue
<!--src/render/layout/components/t-title.vue-->
<template>
  <div class="topBar">
    <div class="winTitle">{{ title }}</div>
    <div class="winTool">
      <div @click="minimizeMainWindow">
        <i class="icon icon-minimize" />
      </div>
      <div v-if="isMaximized" @click="unmaximizeMainWindow">
        <i class="icon icon-restore" />
      </div>
      <div v-else @click="maxmizeMainWin">
        <i class="icon icon-maximize" />
      </div>
      <div @click="closeWindow">
        <i class="icon icon-close" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onUnmounted } from "vue";
import { ipcRenderer } from "electron";
defineProps<{ title?: string }>();
let isMaximized = ref(false);
//关闭窗口
let closeWindow = () => {
  ipcRenderer.invoke("closeWindow");
};
//最大化窗口
let maxmizeMainWin = () => {
  ipcRenderer.invoke("maxmizeWindow");
};
//最小化窗口
let minimizeMainWindow = () => {
  ipcRenderer.invoke("minimizeWindow");
};
//还原窗口
let unmaximizeMainWindow = () => {
  ipcRenderer.invoke("unmaximizeWindow");
};
//窗口最大化事件
let winMaximizeEvent = () => {
  isMaximized.value = true;
};
//窗口取消最大化事件
let winUnmaximizeEvent = () => {
  isMaximized.value = false;
};
onMounted(() => {
  ipcRenderer.on("windowMaximized", winMaximizeEvent);
  ipcRenderer.on("windowUnmaximized", winUnmaximizeEvent);
});
onUnmounted(() => {
  ipcRenderer.off("windowMaximized", winMaximizeEvent);
  ipcRenderer.off("windowUnmaximized", winUnmaximizeEvent);
});
</script>
<style>
.topBar {
display: flex;
height: 25px;
line-height: 25px;
-webkit-app-region: drag; /* 可拖拽区域 */
width: 100%;
}
.winTitle {
flex: 1;
padding-left: 12px;
font-size: 14px;
color: #888;
}
.winTool {
height: 100%;
display: flex;
-webkit-app-region: no-drag; /* 可拖拽区域内的不可拖拽区域 */
}
.winTool div {
height: 100%;
width: 34px;
text-align: center;
color: #999;
cursor: pointer;
line-height: 25px;
}
.winTool .icon {
font-size: 10px;
color: #666666;
font-weight: bold;
}
.winTool div:hover {
background: #efefef;
}
.winTool div:last-child:hover {
background: #ff7875;
}
.winTool div:last-child:hover i {
color: #fff !important;
}
</style>
~~~
以上代码有以下几点需要注意:
1. 自定义窗口标题栏必须把窗口默认标题栏取消掉，初始化mainWindow对象时把窗口配置对象的frame设置为false使窗口成为无边框窗口。
<br>
<br>
2. 标题栏中可拖拽区域是通过样式-webkit-app-region: drag定义的，鼠标在这个样式定义的组件上拖拽可以移动窗口，双击可以放大或者还原窗口，可以通过-webkit-app-region: no-drag;取消此能力。
<br>
<br>
3. 最大化、最小化、还原、关闭窗口等按钮的点击事件，都是通过ipcRenderer.invoke方法来调用主进程CommonWindowEvent类提供的消息管道来实现对应的功能的
<br>
<br>
4. 由于窗口最大化（或还原）不一定是通过点击最大化按钮（或还原按钮）触发的，有可能是通过双击标题栏可拖拽区域触发的，所以这里我们只能通过ipcRenderer.on来监听窗口的最大化或还原事件，以此来改变对应的最大化或还原按钮的显隐状态。不能在按钮点击事件中来完成这项工作。windowMaximized消息和windowUnmaximized消息也是由主进程的CommonWindowEvent类发来的。
<br>
<br>
5. 由于多个二级路由页面会引用t-title.vue，为了避免在切换路由的时候，反复通过ipcRenderer.on注册消息监听器，所以我们在组件的onUnmounted事件内注销了消息监听器，避免事件泄漏。
<br><br>

CommonWindowEvent类的实现代码如下所示:
~~~ts
//src/main/commonWindowEvent.ts
import { BrowserWindow, ipcMain, app } from "electron";
// 主进程公共消息处理逻辑
export class CommonWindowEvent {
  private static getWin(event: any) {
    return BrowserWindow.fromWebContents(event.sender);
  }
  public static listen() {
    ipcMain.handle("minimizeWindow", (e) => {
      this.getWin(e)?.minimize();
    });

    ipcMain.handle("maxmizeWindow", (e) => {
      this.getWin(e)?.maximize();
    });

    ipcMain.handle("unmaximizeWindow", (e) => {
      this.getWin(e)?.unmaximize();
    });

    ipcMain.handle("hideWindow", (e) => {
      this.getWin(e)?.hide();
    });

    ipcMain.handle("showWindow", (e) => {
      this.getWin(e)?.show();
    });

    ipcMain.handle("closeWindow", (e) => {
      this.getWin(e)?.close();
    });
    ipcMain.handle("resizable", (e) => {
      return this.getWin(e)?.isResizable();
    });
    ipcMain.handle("getPath", (e, name: any) => {
      return app.getPath(name);
    });
  }
  //主进程公共事件处理逻辑
  public static regWinEvent(win: BrowserWindow) {
    win.on("maximize", () => {
      win.webContents.send("windowMaximized");
    });
    win.on("unmaximize", () => {
      win.webContents.send("windowUnmaximized");
    });
  }
}
~~~
上述代码中listen方法和regWinEvent方法都是静态的，所以可以直接在类型上调用这个方法：```CommonWindowEvent.listen();```（不用实例化这个类，可以直接使用类型调用这个方法），由于listen方法是静态的，而listen方法内部又调用了getWin私有方法，所以getWin方法也应该是静态的。

我们在listen方法内部注册了一系列消息管道，方便渲染进程控制主进程的一些行为，标题栏组件的窗口的最大化、最小化、还原等功能都是在这里实现的。在 app ready 之后调用```CommonWindowEvent.listen();```这个方法即可注册这些消息管道。

regWinEvent方法负责为窗口对象注册事件，当窗口最大化或还原后，这些事件的处理函数负责把消息发送给渲染进程。标题栏的对应按钮的图标也会发生相应的变化，同样也是在 app ready 之后调用```CommonWindowEvent.regWinEvent(mainWindow);```这个方法即可。


## BrowserWindow 的问题
Electron 创建一个BrowserWindow对象，并让它成功渲染一个页面是非常耗时的，在一个普通配置的电脑上，这大概需要 2~5 秒左右的时间。原因是与微软的反病毒软件有关。不但BrowserWindow存在这个问题，```<webview>```和BrowserView都存在这个问题（它们背后都使用了相同的多进程渲染技术）。

<b>window.open 解决方案</b>

Electron 允许渲染进程通过window.open打开一个新窗口，但这需要做一些额外的设置。

首先需要为主窗口的webContents注册setWindowOpenHandler方法:
```js
//src/main/commonWindowEvent.ts
const cardback = (e) => {
    return {
        action: "allow",
        overrideBrowserWindowOptions: yourWindowConfig
    }
}
mainWindow.webContents.setWindowOpenHandler(cardback)
```
上面的代码中使用setWindowOpenHandler方法的回调函数返回一个对象，这个对象中```action: "allow"```代表允许窗口打开，如果你想阻止窗口打开，那么只要返回```{action: "deny"}```即可。

返回对象的overrideBrowserWindowOptions属性的值是被打开的新窗口的配置对象。

在渲染进程中打开子窗口的代码如下所示:
~~~js
//src/render/layout/component/l-side.vue
window.open(`/set/account`);
~~~
```window.open```打开新窗口之所以速度非常快，是因为用这种方式创建的新窗口不会创建新的进程。这也就意味着一个窗口崩溃会拖累其他窗口跟着崩溃（主窗口不受影响）。

使用```window.open```打开的新窗口还有一个问题，这类窗口在关闭之后虽然会释放掉大部分内存，但有一小部分内存无法释放（无论你打开多少个子窗口，全部关闭之后总会有那么固定的一小块内存无法释放）

同样使用这个方案也无法优化应用的第一个窗口的创建速度。而且```<webview>```和BrowserView慢的问题无法使用这个方案解决（这类需求还是应该考虑“池”方案）。

但是通过```window.open```打开的新窗口更容易控制，这是这个方案最大的优点。接下来我们就介绍如何使用这个方案控制子窗口。

<b>子窗口的标题栏消息</b>

标题栏组件需要监听主进程发来的windowMaximized消息和windowUnmaximized消息，子窗口当然也希望复用这个组件，然而子窗口的窗口对象是在 Electron 内部创建的，不是我们开发者创建的，没有子窗口的窗口对象。

如何使用regWinEvent方法为子窗口注册最大化和还原事件
~~~ts
//src/main/mainEntry.ts
app.on("browser-window-created", (e, win) => {
  CommonWindowEvent.regWinEvent(win);
});
~~~
每当有一个窗口被创建成功后，这个事件就会被触发，主窗口和使用window.open创建的子窗口都一样，所以之前我们为主窗口注册事件的代码CommonWindowEvent.regWinEvent(mainWindow)也可以删掉了。这个事件的第二个参数就是窗口对象。

<b>动态设置子窗口的配置</b>
虽然我们可以在渲染进程中用window.open方法打开一个子窗口，但这个子窗口的配置信息目前还是在主进程中设置的（overrideBrowserWindowOptions），大部分时候我们要根据渲染进程的要求来改变子窗口的配置，所以最好的办法是由渲染进程来设置这些配置信息。
~~~ts
//src/main/commonWindowEvent.ts
//注册打开子窗口的回调函数
win.webContents.setWindowOpenHandler((param) => {
  //基础窗口配置对象
  let config = {
    frame: false,
    show: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
      allowRunningInsecureContent: true,
      contextIsolation: false,
      webviewTag: true,
      spellcheck: false,
      disableHtmlFullscreenWindowResize: true,
      nativeWindowOpen: true,
    },
  };
  //开发者自定义窗口配置对象
  let features = JSON.parse(param.features);
  for (let p in features) {
    if (p === "webPreferences") {
      for (let p2 in features.webPreferences) {
        config.webPreferences[p2] = features.webPreferences[p2];
      }
    } else {
      config[p] = features[p];
    }
  }
  if (config["modal"] === true) config.parent = win;
  //允许打开窗口，并传递窗口配置对象
  return { action: "allow", overrideBrowserWindowOptions: config };
});
~~~
在这段代码中，config对象和主窗口的config对象基本上是一样的，所以最好把它抽离出来，我们这里为了演示方便没做这个工作。

param参数的features属性是由渲染进程传过来的，是一个字符串，这里我们把它当作一个 JSON 字符串使用，这个字符串里包含着渲染进程提供的窗口配置项，这些配置项与 config 对象提供的基础配置项结合，最终形成了子窗口的配置项。

如果配置项中modal属性的值为true的话，说明渲染进程希望子窗口为一个模态窗口，这时我们要为子窗口提供父窗口配置项：parent，这个配置项的值就是当前窗口。

之所以把这段逻辑放置在CommonWindowEvent类的regWinEvent方法中，就是希望更方便地为应用内的所有窗口提供这项能力，如果你不希望这么做，也可以把这段逻辑放置在一个独立的方法中。

现在渲染进程中打开子窗口的代码可以变成这样：
~~~js
//src/render/layout/components/l-side.vue
let openSettingWindow = () => {
  let config = { modal: true, width: 2002, webPreferences: { webviewTag: false } };
  window.open(`/set/account`, "_blank", JSON.stringify(config));
};
~~~
window.open方法的第三个参数官方定义为一个逗号分割的 key-value 列表，但这里我们把它变成了一个 JSON 字符串，这样做主要是为了方便地控制子窗口的配置对象。

使用window.open打开新窗口速度非常快，所以这里我们直接让新窗口显示出来了config.show = true。如果你需要在新窗口初始化时完成复杂耗时的业务逻辑，那么你也应该手动控制新窗口的显示时机。就像我们控制主窗口一样。

<b>封装子窗口加载成功的事件</b>

现在我们遇到了一个问题：不知道子窗口何时加载成功了，注意这里不能单纯地使用window对象的onload事件或者 document 对象的DOMContentLoaded事件来判断子窗口是否加载成功了。因为这个时候你的业务代码（比如从数据库异步读取数据的逻辑）可能尚未执行完成。

在封装这个事件前，我们先来把window.open打开子窗口的逻辑封装到一个Promise对象中，如下代码所示：
~~~ts
//src/render/common/dialog.ts
export let createDialog = (url: string, config: any): Promise<Window> => {
  return new Promise((resolve, reject) => {
    let windowProxy = window.open(url, "_blank", JSON.stringify(config));
    let readyHandler = (e) => {
      let msg = e.data;
      if (msg["msgName"] === `__dialogReady`) {
        window.removeEventListener("message", readyHandler);
        resolve(windowProxy);
      }
    };
    window.addEventListener("message", readyHandler);
  });
};
~~~
在这段代码中，我们把渲染进程的一些工具方法和类放置在src\render\common\目录下（注意，有别于src\common\目录）。

当渲染进程的某个组件需要打开子窗口时，可以使用Dialog.ts提供的createDialog方法。

在这段代码中，我们把window.open的逻辑封装到一个Promise对象中， 通过window.open打开子窗口后，当前窗口马上监听message事件，子窗口有消息发送给当前窗口时，这个事件将被触发。

我们在message事件的处理函数中完成了下面三个工作。

1. e.data 里存放着具体的消息内容，我们把它格式化成一个 JSON 对象。
2. 如果这个 JSON 对象的msgName属性为__dialogReady字符串，我们就成功resolve。
3. Promise对象成功resolve之前要移除掉message事件的监听函数，避免内存泄漏（如果不这么做，用户每打开一个子窗口，就会注册一次message事件）。

window.open方法返回的是目标窗口的引用，我们可以使用这个引用对象向目标窗口发送消息，或执行其他相关操作。

Dialog.ts并非只导出了createDialog这么一个方法，它还导出了dialogReady方法，代码如下所示：
~~~ts
//src\render\common\dialog.ts
export let dialogReady = () => {
  let msg = { msgName: `__dialogReady` };
  window.opener.postMessage(msg);
};
~~~
这个方法是为子窗口服务的，当子窗口完成了必要的业务逻辑之后，就可以执行这个方法，通知父窗口自己已经加载成功。

这个方法通过window.opener对象的postMessage方法向父窗口发送了一个消息，这个消息的内容是一个 JSON 对象，这个 JSON 对象的msgName属性为__dialogReady字符串。

父窗口收到子窗口发来的这个消息后，将触发message事件，也就会执行我们在createDialog方法中撰写的逻辑了。

<b>父子窗口互相通信</b>

我们可以使用 createDialog 方法返回的对象向子窗口发送消息，代码如下所示：
~~~ts
//src\render\components\l-side.vue
let config = { modal: true, width: 800, webPreferences: { webviewTag: false } };
let dialog = await createDialog(`/WindowSetting/AccountSetting`, config);
let msg = { msgName: "hello", value: "msg from your parent" };
dialog.postMessage(msg);
~~~
想要接收子窗口发来的消息，只要监听 window 对象的 message 事件即可，代码如下所示：
~~~ts
//src\render\components\l-side.vue
window.addEventListener("message", (e) => {
  console.log(e.data);
});
~~~
子窗口发送消息给父窗口的代码如下所示：
~~~ts
window.opener.postMessage({ msgName: "hello", value: "I am your son." });
~~~
相对于使用 ipcRender 和 ipcMain 的方式完成窗口间通信来说，使用这种方式完成跨窗口通信有以下几项优势：

1. 消息传递与接收效率都非常高，均为毫秒级；
2. 开发更加简单，代码逻辑清晰，无需跨进程中转消息。


## 引入 SQLite
SQLite 是使用 C 语言编写的嵌入式数据库引擎，它不像常见的客户端-服务器数据库范例，SQLite 内嵌到开发者的应用中，直接为开发者提供数据存储与访问的 API，数据存储介质可以是终端的内存也可以是磁盘，其特点是自给自足、无服务器、零配置、支持事务。它是在世界上部署最广泛的 SQL 数据库引擎。
~~~shell
# 安装better-sqlite3
npm install better-sqlite3 -D
~~~
这个模块安装完成后，大概率你是无法使用这个模块的，你可能会碰到如下报错信息：
~~~rust
Error: The module '...node_modules\better-sqlite3\build\Release\better_sqlite3.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION $XYZ. This version of Node.js requires
NODE_MODULE_VERSION $ABC. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
~~~
这是因为 Electron 内置的 Node.js 的版本可能与你编译原生模块使用的 Node.js 的版本不同导致的。
>Electron 内置的 Node.js 中的一些模块也与 Node.js 发行版不同，比如 Electron 使用了 Chromium 的加密解密库 BoringSL，而 Node.js 发行版使用的是 OpenSSL 加密解密库。

建议开发者使用 Electron 团队提供的 electron-rebuild 工具来完成此工作，因为 electron-rebuild 会帮我们确定 Electron 的版本号、Electron 内置的 Node.js 的版本号、以及 Node.js 使用的 ABI 的版本号，并根据这些版本号下载不同的头文件和类库。
~~~shell
npm install electron-rebuild -D
~~~
然后，在你的工程的 package.json 中增加如下配置节（scripts配置节）：
~~~json
{
  "rebuild": "electron-rebuild -f -w better-sqlite3"
}
~~~
接着执行指令：```npm run rebuild```

当你的工程下出现了这个文件node_modules\better-sqlite3\build\Release\better_sqlite3.node，才证明better_sqlite3模块编译成功了，如果上述指令没有帮你完成这项工作，你可以把指令配置到node_modules\better-sqlite3模块内部再执行一次，一般就可以编译成功了。

尝试创建数据库：
~~~js
const Database = require("better-sqlite3");
const db = new Database("db.db", { verbose: console.log, nativeBinding: "./node_modules/better-sqlite3/build/Release/better_sqlite3.node" });
~~~
不出意外的话，你的工程根目录下将会创建一个名为db.db的 SQLite 数据库文件，说明better-sqlite3库已经生效了。

<b>压缩安装包体积</b>

原生模块是无法被 Vite 编译到 JavaScript的，那我们为什么还要把 better-sqlite3 安装程开发依赖呢？

把better-sqlite3安装成生产依赖，在功能上没有任何问题，electron-builder 在制作安装包时，会自动为安装包附加这个依赖（better-sqlite3这个库自己的依赖也会被正确附加到安装包内）。

但electron-builder会把很多无用的文件（很多编译原生模块时的中间产物）也附加到安装包内。无形中增加了安装包的体积（大概 10M）。
        
下面是解决方案：
~~~shell
# 安装 fs-extra
pnpm i fs-extra
~~~
~~~ts
// plugins\buildPlugin.ts
import fs from "fs-extra";

class BuildObj {
  // ... 
  // 修改 preparePackageJson 方法
  preparePackageJson() {
      // ...
      // 在生成package.json文件之前为其附加两个生产依赖，版本号是否正确无关紧要
      localPkgJson.dependencies["better-sqlite3"] = "*";
      localPkgJson.dependencies["bindings"] = "*";
  }

  // 在 BuildObj 类中加入下面这个方法
  async prepareSqlite() {
    //拷贝better-sqlite3
    let srcDir = path.join(process.cwd(), `node_modules/better-sqlite3`);
    let destDir = path.join(process.cwd(), `dist/node_modules/better-sqlite3`);
    fs.ensureDirSync(destDir);
    fs.copySync(srcDir, destDir, {
      filter: (src, dest) => {
        if (src.endsWith("better-sqlite3") || src.endsWith("build") || src.endsWith("Release") || src.endsWith("better_sqlite3.node")) return true;
        else if (src.includes("node_modules\\better-sqlite3\\lib")) return true;
        else return false;
      },
    });

    let pkgJson = `{"name": "better-sqlite3","main": "lib/index.js"}`;
    let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/better-sqlite3/package.json`);
    fs.writeFileSync(pkgJsonPath, pkgJson);
    //制作bindings模块
    let bindingPath = path.join(process.cwd(), `dist/node_modules/bindings/index.js`);
    fs.ensureFileSync(bindingPath);
    let bindingsContent = `module.exports = () => {
      let addonPath = require("path").join(__dirname, '../better-sqlite3/build/Release/better_sqlite3.node');
      return require(addonPath);
    };`;
    fs.writeFileSync(bindingPath, bindingsContent);

    pkgJson = `{"name": "bindings","main": "index.js"}`;
    pkgJsonPath = path.join(process.cwd(), `dist/node_modules/bindings/package.json`);
    fs.writeFileSync(pkgJsonPath, pkgJson);
  }
}
// 在 closeBundle 钩子函数中调用下面这个方法：
buildObj.prepareSqlite()
~~~
这段代码主要做了两个工作。
1. 把开发环境的node_modules\better-sqlite3目录下有用的文件拷贝到dist\node_modules\better-sqlite3目录下，并为这个模块自制了一个简单的package.json。 
2. 完全自己制作了一个bindings模块，把这个模块放置在dist\node_modules\bindings目录下。

这里bindings模块是better-sqlite3模块依赖的一个模块，它的作用仅仅是确定原生模块文件better_sqlite3.node的路径。

>你可以在release\win-unpacked\resources这个路径下执行asar list app.asar这个命令行指令，观察打包到生产环境的文件（需要全局安装 [asar](https://github.com/electron/asar) 工具）。

>asar 是一种特殊的存档格式，它可以把大批的文件以一种无损、无压缩的方式链接在一起，并提供随机访问支持。默认情况下 electron-builder 会把开发者编写的 HTML、CSS 和 JavaScript 代码以及相关的资源打包成 asar 文件嵌入到安装包中，再分发给用户。electron-builder 是通过 Electron 官方提供的 [asar 工具](https://github.com/electron/asar)制成和提取 asar 文档的。开发者自己全局安装这个工具，随时查阅生产环境下的资源文件。（这是非常有必要的。）


## 引入 Knex.js
使用better-sqlite3读写数据库中的数据时，要书写 SQL 语句，这种语句是专门为数据库准备的指令，是不太符合现代编程语言的习惯的，下面是为 sqlite 数据库建表和在对应表中完成增删改查的 SQL 语句：
~~~sql
create table admin(username text,age integer);
insert into admin values('allen',18);
select * from admin;
update admin set username='allen001',age=88 where username='allen' and age=18;
delete from admin where username='allen001';
~~~
我们完全可以使用Knex.js库来完成对应的操作，Knex.js允许我们使用 JavaScript 代码来操作数据库里的数据和表结构，它会帮我们把 JavaScript 代码转义成具体的 SQL 语句，再把 SQL 语句交给数据库处理。我们可以把它理解为一种 SQL Builder。
~~~shell
# 安装 Knex.js
npm install knex -D
~~~
<b>打包之前编译这个库</b>
~~~ts
// plugins\buildPlugin.ts
// 在 BuildObj 类中加入下面这个方法
class BuildObj {
    prepareKnexjs() {
        let pkgJsonPath = path.join(process.cwd(), `dist/node_modules/knex`);
        fs.ensureDirSync(pkgJsonPath);
        require("esbuild").buildSync({
            entryPoints: ["./node_modules/knex/knex.js"],
            bundle: true,
            platform: "node",
            format: "cjs",
            minify: true,
            outfile: "./dist/node_modules/knex/index.js",
            external: ["oracledb", "pg-query-stream", "pg", "sqlite3", "tedious", "mysql", "mysql2", "better-sqlite3"],
        });
        let pkgJson = `{"name": "bindings","main": "index.js"}`;
        pkgJsonPath = path.join(process.cwd(), `dist/node_modules/knex/package.json`);
        fs.writeFileSync(pkgJsonPath, pkgJson);
    }
}
// 在 closeBundle 钩子函数中调用下面这个方法：
buildObj.prepareKnexjs()
~~~
这段代码有以下几点需要注意:
1. 配置项external是为了避免编译过程中esbuild去寻找这些模块而导致编译失败，也就是说Knex.js中这样的代码会保持原样输出到编译产物中：require('better-sqlite3')。
2. 同样，我们要再为 package.json 增加一个生产依赖：localPkgJson.dependencies["knex"] = "*";，以避免 electron-builder 为我们安装Knex.js模块。
3. 别忘记在closeBundle钩子函数中调用这个方法：buildObj.prepareKnexjs()。

## Knex.js 的使用
关于使用`Knex.js`操作数据库的知识，请参阅[官方文档](https://knexjs.org/guide/)。

接下来数据库并新建`Chat`表

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/794dca78d4ab46939e418eb25365f9ea~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

我们要创建一个数据库访问类，由于主进程的逻辑和渲染进程的逻辑都有可能会访问数据库，所以我们把数据库访问类放置在`src\common`目录下，方便两个进程的逻辑代码使用这个类，代码如下：
~~~ts
//src\common\db.ts
import knex, { Knex } from "knex";
import fs from "fs";
import path from "path";
let dbInstance: Knex;
if (!dbInstance) {
  let dbPath = process.env.APPDATA || (process.platform == "darwin" ? process.env.HOME + "/Library/Preferences" : process.env.HOME + "/.local/share");
  dbPath = path.join(dbPath, "electron-jue-jin/db.db");
  let dbIsExist = fs.existsSync(dbPath);
  if (!dbIsExist) {
    let resourceDbPath = path.join(process.execPath, "../resources/db.db");
    fs.copyFileSync(resourceDbPath, dbPath);
  }
  dbInstance = knex({
    client: "better-sqlite3",
    connection: { filename: dbPath },
    useNullAsDefault: true,
  });
}
export let db = dbInstance;
~~~
这段代码导出一个数据库访问对象，**只有第一次引入这个数据库访问对象的时候才会执行此对象的初始化逻辑**，也就是说，无论我们在多少个组件中引入这个数据库访问对象，它只会被初始化一次，但这个约束只局限在一个进程内，也就是说对于整个应用而言，**主进程有一个 db 实例，渲染进程也有一个 db 实例，两个实例是完全不同的**。

由于渲染进程内的数据库访问对象和主进程内的数据库访问对象不是同一个对象，所以会有并发写入数据的问题，你需要控制好你的业务逻辑，避免两个进程在同一时间写入相同的业务数据。

::: tip
SQLite 不支持并发写入数据，两个或两个以上的写入操作同时执行时，只有一个写操作可以成功执行，其他写操作会失败。并发读取数据没有问题。
:::

第一次初始化数据库链接对象时，我们会检查`C:\Users\[username]\AppData\Roaming\[appname]\db.db`文件是否存在，如果不存在，我们就从应用程序安装目录`C:\Program Files\[appname]\resources\db.db`拷贝一份到该路径下，所以我们要提前把数据库设计好，基础数据也要初始化好，制作安装包的时候，把数据库文件打包到安装包里。

我们是通过为`plugins\buildPlugin.ts`增加配置来把数据库文件打包到安装包内的，其中关键的配置代码如下所示：
~~~ts
//plugins\buildPlugin.ts
//buildInstaller方法内option.config的一个属性
extraResources: [{ from: `./src/common/db.db`, to: `./` }],
~~~
这是 `electron-builder` 的一项配置：`extraResources`，可以让开发者为安装包指定额外的资源文件，`electron-builder` 打包应用时会把这些资源文件附加到安装包内，当用户安装应用程序时，这些资源会释放在安装目录的 `resources\`子目录下。

关于`extraResources`的详细配置信息请参阅[官方文档](https://www.electron.build/configuration/contents.html#filesetto)。

可能有同学会问，为什么要如此麻烦把数据库拷贝到`C:\Users\[username]\AppData\Roaming\[appname]\`目录下再访问，为什么不直接访问安装目录下的数据库文件呢？这是因为**当用户升级应用程序时安装目录下的文件都会被删除，因为我们可能会在数据库中放置很多用户数据，这样的话每次升级应用用户这些数据就都没了。**

我们假定数据库是整个应用的核心组件，没有它数据库应用程序无法正常运行，所以初始化数据库的逻辑都是同步操作（`fs.copyFileSync`），注意这类以 `Sync` 结尾的方法都是同步操作，它们是会阻塞 `JavaScript` 的执行线程的，也就是说在它们执行过程中，其他任何操作都会处于阻塞状态，比如以 `setInterval` 注册的定时器不会按照预期执行，只有等同步操作执行完成之后 `JavaScript` 的执行线程才会继续执行被阻塞的方法，所以**应用中一定要谨慎使用同步操作**。除了 `Node.js` 提供的类似 `fs.copyFileSync` 这样的方法外，还有 `Electron` 提供的 `dialog.showOpenDialogSync` 这样的方法，好在同步方法一般都有对应的异步方法来替代。

实际上对于真实的产品来说，不一定在这里使用同步操作，最好根据你的应用程序的情况来实现这部分逻辑，在需要使用数据库之前把数据库初始化好即可。

在应用程序开发调试阶段，开发者可以先把设计好的数据库文件放置在目标路径 `AppData\Roaming[appname]\` 下，这样调试应用就会方便很多。

`db.ts` 文件导出的是一个 `Knex` 类型的对象，初始化这个对象时，我们传入了一个配置对象，配置对象的 client 属性代表着使用什么模块访问数据库，这里我们要求 `Knex` 使用`better-sqlite3`访问数据库，`Knex` 支持很多数据库，比如MySql、Oracle、SqlServer等，都有对应的数据库访问模块。**由于 SQLite 是一个客户端数据库，所以我们只要把数据库的本地路径告知 Knex 即可，这个属性是通过配置对象的 connection 属性提供的**。配置对象的 `useNullAsDefault` 属性告知 `Knex` 把开发者未明确提供的数据配置为 `Null`。

接下来我们就尝试使用这个数据库访问对象把 `Chat` 表的数据检索出来，代码如下所示：
~~~ts
// src\renderer\main.ts
import { db } from "../common/db";
db("Chat")  // 创建数据库连接
  .first()  // 获取第一条数据
  .then((obj) => {
    console.log(obj);  // 获取成功后打印
  });
~~~













