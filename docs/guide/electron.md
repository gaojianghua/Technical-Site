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
  //src/App.vue
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
     
