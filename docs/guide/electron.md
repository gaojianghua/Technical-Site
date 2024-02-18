<!--
 * @Author: 高江华 g598670138@163.com
 * @Date: 2023-06-29 11:45:51
 * @LastEditors: 高江华
 * @LastEditTime: 2024-02-18 15:09:46
 * @Description: file content
-->
# Electron
[官方文档](https://www.electronjs.org/zh/)

## 简介
`Electron` 由 `Node.js + Chromium + Native API` 构成。你可以理解成，它是**一个得到了 `Node.js` 和基于不同平台的 `Native API` 加强的 `Chromium` 浏览器。**
![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/2508170558.png)
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

## 基础篇：Electron 的基础概念
`Electron` 继承了来自 `Chromium` 的多进程架构，`Chromium` 始于其主进程。从主进程可以派生出渲染进程。渲染进程与浏览器窗口是一个意思。主进程保存着对渲染进程的引用，并且可以根据需要创建/删除渲染器进程。

每个 `Electron` 的应用程序都有一个主入口文件，它所在的进程被称为 `主进程（Main Process）`。而主进程中创建的窗体都有自己运行的进程，称为 `渲染进程（ Renderer Process）`。**每个 Electron 的应用程序有且仅有一个主进程，但可以有多个渲染进程。**

简单理解下，主进程就相当于浏览器，而渲染进程就相当于在浏览器上打开的一个个网页。

### 主进程
主进程是 `Electron` 应用程序的核心，通常由一个主要的 `JavaScript` 文件（如 `main.js` ）定义，你可以在 `package.json` 中指定它：
~~~json
// package.json
{  
    "name": "app",  
    "version": "1.0.0",
    "description": "Hello World!",  
    // 主进程入口文件
    "main": "main.js",   
    "author": "",  
    "devDependencies": {  
       // ...
    }  
}
~~~

它是应用程序的入口点，负责管理整个应用的生命周期、创建窗口、原生 `API` 调用等。主进程可以访问底层的系统资源，如文件系统、操作系统 API 等，这些功能通常是通过 `Node.js` 提供的模块实现的。它是 `Electron` 应用的主要控制中心。

#### 1. 管理应用程序生命周期
在 `Electron` 的主进程中，你可以使用 `app` 模块来管理应用程序的生命周期，该模块提供了一整套的事件和方法，可以让你用来添加自定义的应用程序行为。
~~~js
const { app } = require('electron')
// 当 Electron 完成初始化时触发
app.on('ready', () => {  
  app.quit()  
})
~~~

app 的常用生命周期钩子如下：
- `will-finish-launching` 在应用完成基本启动进程之后触发。
- `ready` 当 electron 完成初始化后触发。
- `window-all-closed` 所有窗口都关闭的时候触发，在 windows 和 linux 里，所有窗口都退出的时候**通常**是应用退出的时候。
- `before-quit` 退出应用之前的时候触发。
- `will-quit` 即将退出应用的时候触发。
- `quit` 应用退出的时候触发。

而我们通常会在 `ready` 的时候执行创建应用窗口、创建应用菜单、创建应用快捷键等初始化操作。而在 `will-quit` 或者 `quit` 的时候执行一些清空操作，比如解绑应用快捷键。

特别的，在非 `macOS` 的系统下，通常一个应用的所有窗口都退出的时候，也是这个应用退出之时。所以，可以配合 `window-all-closed` 这个钩子来实现：
~~~js
app.on('window-all-closed', () => {
  // 当操作系统不是darwin（macOS）的话
  if (process.platform !== 'darwin') { 
    // 退出应用
    app.quit()
  }
})
~~~

#### 2. 创建窗口
主进程的主要目的之一是使用 [BrowserWindow](https://www.electronjs.org/zh/docs/latest/api/browser-window) 模块创建和管理应用程序窗口。窗口管理是指创建、控制和管理应用程序中的窗口。
~~~js
const { BrowserWindow } = require('electron')  

// 创建窗口
const win = new BrowserWindow({ width: 800, height: 1500 })  
win.loadURL('https://juejin.cn')  
  
// 窗口事件管理
win.on('closed', () => {
  win = undefined;
});

win.once('ready-to-show', () => {
  win.show();
});

// 窗口的尺寸控制
win.minimize();
win.setSize({width: xxx, height: xxx});
~~~

跟 `app` 模块一样，`BrowserWindow` 也有很多常用的事件钩子，比如：
- `closed` 当窗口被关闭的时候。
- `focus` 当窗口被激活的时候。
- `show` 当窗口展示的时候。
- `hide` 当窗口被隐藏的时候。
- `maxmize` 当窗口最大化时。
- `minimize` 当窗口最小化时。


#### 3. 调用原生 API
为了使 `Electron` 的功能不仅仅限于对网页内容的封装，主进程也添加了自定义的 API 来与用户的操作系统进行交互。比如，和 `客户端 GUI` 相关的 `右键菜单、窗⼝定制、系统托盘、Dock……`，和 桌⾯环境集成 相关的系统通知、剪切板、系统快捷键、⽂件拖放……，和 `设备` 相关的`电源监视、内存、CPU、屏幕` 等等。
~~~js
const { clipboard, globalShortcut, Menu } = require('electron')  

// 向剪切板中写入文本
clipboard.writeText('hello world', 'selection')  
console.log(clipboard.readText('selection'))

// 注册全局快捷键
globalShortcut.register('CommandOrControl+X', () => {  
  console.log('CommandOrControl+X is pressed')  
})

// Dock
const dockMenu = Menu.buildFromTemplate([  
  {  
    label: '菜单一',  
    click () { console.log('菜单一') }  
  }, {  
    label: '菜单二',  
    submenu: [  
      { label: '子菜单' },  
    ]  
  },  
  { label: '菜单三' }  
])
~~~

### 渲染进程
渲染进程是 `Electron` 应用程序中负责展示用户界面的部分。每个渲染进程对应一个窗口（`BrowserWindow`）或者一个网页。通常由 `HTML、CSS 和 JavaScript` 构建用户界面。

渲染进程与主进程是分开的，它们之间通过 `IPC（进程间通信）` 来进行通信。渲染进程可以通过一些特定的 `Electron API` 来与主进程进行交互，以实现诸如向主进程发送消息、接收主进程的指令等功能。

其实在 `Electron` 中，因为安全性等问题的考量，提供给 `Renderer` 可用的 `API` 是比较少的，我们可以简单看一下主进程和渲染进程可使用的 API 图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/877089.webp)

可以看到，能够在渲染进程中使用的 API 一共有 7 个。那么如果需要在渲染进程中使用主进程的 API 要怎么操作呢？`Electron` 本身额外提供了一个库 `@electron/remote`，使用这个库可以用来调用主进程的一些 API 能力：
~~~js
// 渲染进程
const { BrowserWindow } = require('@electron/remote')
let win = new BrowserWindow({ width: 800, height: 600 })
win.loadURL('https://juejin.cn')

// 主进程
require('@electron/remote/main').initialize()
~~~
更多关于 @electron/remote 的使用方式可以阅读它的[文档](https://www.npmjs.com/package/@electron/remote)

::: tip
`electron v14` 版本后开始去掉了内置的 `remote` 模块，`@electron/remote` 是 `Electron` 中内置 `remote` 模块的替代品。之所以移除 `remote` 模块，其主要考量是：

**1. 性能问题：** 通过 `remote` 模块可以访问主进程的对象、类型、方法，但这些操作都是跨进程的，跨进程操作性能上的损耗可能是进程内操作的几百倍甚至上千倍。假设你在渲染进程通过 `remote` 模块创建了一个 `BrowserWindow` 对象，不但你创建这个对象的过程很慢，后面你使用这个对象的过程也很慢。小到更新这个对象的属性，大到使用这个对象的方法，都是跨进程的。

**2. 安全性问题：** 使用 `remote` 模块可以让渲染进程直接访问主进程的模块和对象，这可能导致一些潜在的安全风险。因为这种方式打破了主进程和渲染进程之间的隔离，可能存在恶意代码利用这一特性进行攻击或者不当操作。

**3. 影子对象问题：** 我们在渲染进程中通过 `remote` 模块使用了主进程的某个对象，得到的是这个对象的影子（代理），是一个影子对象，它看起来像是真正的对象，但实际上不是。首先，这个对象原型链上的属性不会被映射到渲染进程的代理对象上。其次，类似 `NaN、Infinity` 这样的值不会被正确地映射给渲染进程，如果一个主进程方法返回一个 `NaN` 值，那么渲染进程通过 `remote` 模块访问这个方法将会得到 `undefined`。
:::

### 预加载脚本 preload.js
预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码。 在 `preload.js` 中，我们不仅可以使用 `Node API`，还可以直接使用 `Electron` 渲染进程的 `API 以及 DOM API`，另外可以通过 `IPC` 和主进程进行通信达成调用主进程模块的目的。`preload.js` 脚本虽运行于渲染器的环境中，却因此而拥有了更多的权限。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/29376de0e401431e814b50d782663ad8.webp)

预加载脚本可以在 `BrowserWindow` 构造方法中的 `webPreferences` 选项里被附加到主进程。

~~~js
const { BrowserWindow } = require('electron')  
// ...  
const win = new BrowserWindow({  
  webPreferences: {  
    preload: 'preload.js'  
  }  
})  
// ...
~~~

因为预加载脚本与浏览器共享同一个全局 [Window](https://developer.mozilla.org/en-US/docs/Web/API/Window) 接口，并且可以访问 Node.js API。

~~~js
// preload.js
const fs = require('fs')

window.myAPI = {  
  exists: fs.exists
}

console.log(window.myAPI)
~~~

::: tip
注意：自从 `Electron v12` 版本以后，添加了 `webPreferences.contextIsolation = true` 的默认设置，这就意味着你通过 `preload` 修改 `window` 上的内容后，在渲染进程中并不能访问到。
:::

~~~js
// renderer.js
console.log(window.myAPI)  // => undefined
~~~

### 关于 contextIsolation 的介绍
`contextIsolation` 是 `Electron` 中一个重要的安全特性，用于提高渲染进程的安全性。它的作用在于将渲染进程的 `JavaScript` 上下文（代码执行环境）与主进程隔离开来，以减少安全风险并加强安全性。

举个🌰：

假设有一个 `Electron` 应用程序，其中有一个渲染进程需要执行一些文件系统操作，比如读取本地文件并在界面中显示。在未启用 `contextIsolation` 的情况下，渲染进程可以直接访问 `Node.js` 的 `fs` 模块来进行文件操作。但这样会存在安全风险，因为渲染进程可以执行任意的文件系统操作，**比如文件删除**，可能导致安全漏洞或恶意代码执行。

现在，启用了 `contextIsolation`，渲染进程无法直接访问 `Node.js` 的 `fs` 模块。相反，你可以使用 `preload` 选项来为渲染进程加载一个预加载的脚本，在这个脚本中可以安全地访问 `Node.js` 的 `fs` 模块，并将需要的操作通过 [contextBridge](https://www.electronjs.org/zh/docs/latest/api/context-bridge) 模块封装成 `API` 提供给渲染进程。这样，渲染进程只能通过预加载的 `API` 来请求文件操作，而无法直接执行文件系统操作。

~~~js
// preload.js
const { contextBridge } = require('electron')  
const fs = require('fs')
  
contextBridge.exposeInMainWorld('myAPI', {  
  exists: fs.exists  
})
~~~
~~~js
// renderer.js
console.log(window.myAPI)  
// => { exists: Function }
~~~

## 基础篇：Electron 进程间的通信
进程间通信（IPC）并非仅限于 `Electron`，而是源自甚至早于 `Unix` 诞生的概念。尽管“进程间通信”这个术语的确创造于何时并不清楚，但将数据传递给另一个程序或进程的理念可以追溯至 1964 年，当时 `Douglas McIlroy` 在 `Unix` 的第三版（1973 年）中描述了 `Unix` 管道的概念。

>We should have some ways of coupling programs like garden hose--screw in another segment when it becomes when it becomes necessary to massage data in another way.

我们可以通过使用管道操作符（`|`）将一个程序的输出传递到另一个程序，比如：
~~~bash
# 列出当前目录下的所有.ts文件
ls | grep .ts
~~~

在 `Unix` 系统中，管道只是 `IPC` 的一种形式，还有许多其他形式，比如信号、消息队列、信号量和共享内存。在 `Electron` 中也有自己的 IPC 形式，接下来我们将会详细介绍。

### ipcMain 和 ipcRenderer
与 `Chromium` 相同，`Electron` 使用进程间通信（IPC）来在进程之间进行通信，在介绍 `Electron` 进程间通信前，我们必须先认识一下 `Electron` 的 2 个模块。

- [`ipcMain`](https://www.electronjs.org/zh/docs/latest/api/ipc-main) 是一个仅在主进程中以异步方式工作的模块，用于与渲染进程交换消息。

- [`ipcRenderer`](https://www.electronjs.org/zh/docs/latest/api/ipc-renderer) 是一个仅在渲染进程中以异步方式工作的模块，用于与主进程交换消息。

`ipcMain` 和 `ipcRenderer` 是 `Electron` 中负责通信的两个主要模块。它们继承自 `NodeJS` 的 [EventEmitter](https://nodejs.org/api/events.html#events_class_eventemitter) 模块。在 `EventEmitter` 中允许我们向指定 `channel` 发送消息。`channel` 是一个字符串，在 `Electron` 中 `ipcMain` 和 `ipcRenderer` 使用它来发出和接收事件/数据。
~~~js
// 接受消息
// EventEmitter: ipcMain / ipcRenderer
EventEmitter.on("string", function callback(event, messsage) {});

// 发送消息
// EventEmitter: win.webContents / ipcRenderer
EventEmitter.send("string", "mydata");
~~~

### 渲染进程 -> 主进程
大多数情况下的通信都是从渲染进程到主进程，渲染进程依赖 `ipcRenderer` 模块给主进程发送消息，官方提供了三个方法：
- `ipcRenderer.send(channel, ...args)`
- `ipcRenderer.invoke(channel, ...args)`
- `ipcRenderer.sendSync(channel, ...args)`

`channel` 表示的就是事件名(消息名称)， `args` 是参数。需要注意的是参数将使用结构化克隆算法进行序列化，就像浏览器的 `window.postMessage` 一样，因此不会包含原型链。发送函数、Promise、Symbol、WeakMap 或 WeakSet 将会抛出异常。

#### 1. ipcRenderer.send
渲染进程通过 `ipcRenderer.send` 发送消息：
~~~js
// render.js
import { ipcRenderer } from 'electron';

function sendMessageToMain() {
  ipcRenderer.send('my_channel', 'my_data');
}
~~~
主进程通过 `ipcMain.on` 来接收消息：
~~~js
// main.js
import { ipcMain } from 'electron';

ipcMain.on('my_channel', (event, message) => {
  console.log(`receive message from render: ${message}`) 
})
~~~
请注意，如果使用 `send` 来发送数据，如果你的主进程需要回复消息，那么需要使用 `event.replay` 来进行回复：
~~~js
// main.js
import { ipcMain } from 'electron';

ipcMain.on('my_channel', (event, message) => {
  console.log(`receive message from render: ${message}`)
  event.reply('reply', 'main_data')
})
~~~
同时，渲染进程需要进行额外的监听：
~~~js
// renderer.js
ipcRenderer.on('reply', (event, message) => { 
  console.log('replyMessage', message);
})
~~~

#### 2. ipcRenderer.invoke
渲染进程通过 `ipcRenderer.invoke` 发送消息：
~~~js
// render.js
import { ipcRenderer } from 'electron';

async function invokeMessageToMain() {
  const replyMessage = await ipcRenderer.invoke('my_channel', 'my_data');
  console.log('replyMessage', replyMessage);
}
~~~
主进程通过 `ipcMain.handle` 来接收消息：
~~~js
// main.js
import { ipcMain } from 'electron';
ipcMain.handle('my_channel', async (event, message) => {
  console.log(`receive message from render: ${message}`);
  return 'replay';
});
~~~
注意，渲染进程通过 `ipcRenderer.invok`e 发送消息后，`invoke` 的返回值是一个 `Promise<pending>` 。主进程回复消息需要通过 `return` 的方式进行回复，而 `ipcRenderer` 只需要等到 `Promise resolve` 即可获取到返回的值。

#### 3. ipcRender.sendSync
渲染进程通过 `ipcRender.sendSync` 来发送消息：
~~~js
// render.js
import { ipcRenderer } from 'electron';

async function sendSyncMessageToMain() {
  const replyMessage = await ipcRenderer.sendSync('my_channel', 'my_data');
  console.log('replyMessage', replyMessage);
}
~~~
主进程通过 `ipcMain.on` 来接收消息：
~~~js
// main.js
import { ipcMain } from 'electron';
ipcMain.on('my_channel', async (event, message) => {
  console.log(`receive message from render: ${message}`);
  event.returnValue = 'replay';
});
~~~
注意，渲染进程通过 `ipcRenderer.sendSync` 发送消息后，主进程回复消息需要通过 `e.returnValue` 的方式进行回复，如果 `event.returnValue` 不为 `undefined` 的话，渲染进程会等待 `sendSync` 的返回值才执行后面的代码。

> 发送同步消息将阻止整个渲染过程直到收到回复。这样使用此方法只能作为最后手段。使用异步版本更好 `invoke()`。

#### 4. 小节
- **ipcRenderer.send：** 这个方法是异步的，用于从渲染进程向主进程发送消息。它发送消息后不会等待主进程的响应，而是立即返回，适合在不需要等待主进程响应的情况下发送消息。

- **ipcRenderer.sendSync：** 与 `ipcRenderer.send` 不同，这个方法是同步的，也是用于从渲染进程向主进程发送消息，但是它会等待主进程返回响应。它会阻塞当前进程，直到收到主进程的返回值或者超时。

- **ipcRenderer.invoke：** 这个方法也是用于从渲染进程向主进程发送消息，但是它是一个异步的方法，可以方便地在渲染进程中等待主进程返回 `Promise` 结果。相对于 `send` 和 `sendSync`，它更适合处理异步操作，例如主进程返回 `Promise` 的情况。

### 主进程 -> 渲染进程
主进程向渲染进程发送消息的一种方式是当渲染进程通过 `ipcRenderer.send、ipcRenderer.sendSync、ipcRenderer.invoke` 向主进程发送消息时，主进程通过 `event.replay、event.returnValue、return ...` 的方式进行发送。这种方式是被动的，需要等待渲染进程先建立消息推送机制，主进程才能进行回复。

其实除了上面说的几种被动接收消息的模式进行推送外，还可以通过 **`webContents`** 模块进行消息通信。

#### 1. ipcMain 和 webContents
主进程使用 `ipcMain` 模块来监听来自渲染进程的事件，通过 `event.sender.send()` 方法向渲染进程发送消息。
~~~js
// 主进程
import { ipcMain, BrowserWindow } from 'electron';

ipcMain.on('messageFromMain', (event, arg) => {
  event.sender.send('messageToRenderer', 'Hello from Main!');
});
~~~

#### 2. BrowserWindow.webContents.send
`BrowserWindow.webContents.send` 可以在主进程中直接使用 `BrowserWindow` 对象的 `webContents.send()` 方法向渲染进程发送消息。

~~~js
// 主进程
import { BrowserWindow } from 'electron';

const mainWindow = new BrowserWindow();
mainWindow.loadFile('index.html');

// 在某个事件或条件下发送消息
mainWindow.webContents.send('messageToRenderer', 'Hello from Main!');
~~~

#### 3. 小节
不管是通过 `event.sender.send()` 还是 `BrowserWindow.webContents.send` 的方式，如果你只是单窗口的数据通信，那么本质上是没什么差异的。

但是如果你想要发送一些数据到特定的窗口，那么你可以直接使用 `BrowserWindow.webContents.send` 这种方式。

### 渲染进程 -> 渲染进程
默认情况下，渲染进程和渲染进程之间是无法直接进行通信的：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/2d04e7422d6d4059b1b5585eaf970d63.webp)

既然说的是无法直接通信，那么肯定还有一些“曲线救国”的方式。

#### 1. 利用主进程作为中间人
首先，需要在主进程注册一个事件监听程序，监听来自渲染进程的事件：
~~~js
// main.js

// window 1
function createWindow1 () {
  window1 = new BrowserWindow({width: 800,height: 600})
  window1.loadURL('window1.html')
  window1.on('closed', function () {
     window1 = null
  })
  return window1
}

// window 2
function createWindow2 () {
  window2 = new BrowserWindow({width: 800, height: 600})
  window2.loadURL('window2.html')
  window2.on('closed', function () {
    window2 = null
  })
  return window2
}

app.on('ready', () => {
  createWindow1();
  createWindow2();
  ipcMain.on('win1-msg', (event, arg) => {
    // 这条消息来自 window 1
    console.log("name inside main process is: ", arg); 
    // 发送给 window 2 的消息.
    window2.webContents.send( 'forWin2', arg );
  });
})
~~~

然后在 `window2` 窗口建立一个监听事件：
~~~js
ipcRenderer.on('forWin2', function (event, arg){
  console.log(arg);
});
~~~
这样，`window1` 发送的 `win1-msg` 事件，就可以传输到 `window2`：
~~~js
ipcRenderer.send('win1-msg', 'msg from win1');
~~~

#### 2. 使用 MessagePort
上面的传输方式虽然可以实现渲染进程之间的通信，但是非常依赖主进程，写起来也比较麻烦，那有什么不依赖于主进程的方式嘛？那当然也是有的，那就是 [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)。

`MessagePort` 并不是 `Electron` 提供的能力，而是基于 `MDN` 的 `Web` 标准 `API`，这意味着它可以在渲染进程直接创建。同时 `Electron` 提供了 `node.js` 侧的实现，所以它也能在主进程创建。

接下来，我们将通过一个示例来描述如何通过 `MessagePort` 来实现渲染进程之间的通信。

##### 2.1 主进程中创建 MessagePort
~~~js
import { BrowserWindow, app, MessageChannelMain } from 'electron';

app.whenReady().then(async () => {
  // 创建窗口
  const mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadMain.js'
    }
  })

  const secondaryWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      contextIsolation: false,
      preload: 'preloadSecondary.js'
    }
  })

  // 建立通道
  const { port1, port2 } = new MessageChannelMain()

  // webContents准备就绪后，使用postMessage向每个webContents发送一个端口。
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.postMessage('port', null, [port1])
  })

  secondaryWindow.once('ready-to-show', () => {
    secondaryWindow.webContents.postMessage('port', null, [port2])
  })
})
~~~
实例化 `MessageChannel` 类之后，就产生了两个 `port： port1 和 port2`。接下来只要让 `渲染进程1` 拿到 `port1`、`渲染进程2` 拿到 `port2`，那么现在这两个进程就可以通过 `port.onmessage` 和 `port.postMessage` 来收发彼此间的消息了。如下：
~~~js
// mainWindow
port1.onmessage = (event) => {
  console.log('received result:', event.data)
};
port1.postMessage('我是渲染进程一发送的消息');

// secondaryWindow
port2.onmessage = (event) => {
  console.log('received result:', event.data)
};
port2.postMessage('我是渲染进程二发送的消息');
~~~

##### 2.2 渲染进程中获取 port
有了上面的知识，我们最重要的任务就是需要获取主进程中创建的 `port` 对象，要做的是在你的预加载脚本（`preload.js`）中通过 `IPC` 接收 `port`，并设置相应的监听器。
~~~js
// preloadMain.js
// preloadSecondary.js
const { ipcRenderer } = require('electron')

ipcRenderer.on('port', e => {
  // 接收到端口，使其全局可用。
  window.electronMessagePort = e.ports[0]

  window.electronMessagePort.onmessage = messageEvent => {
    // 处理消息
  }
})
~~~

##### 2.3 消息通信
通过上面的一些操作后，就可以在应用程序的任何地方调用 `postMessage` 方法向另一个渲染进程发送消息。
~~~js
// mainWindow renderer.js
// 在 renderer 的任何地方都可以调用 postMessage 向另一个进程发送消息
window.electronMessagePort.postMessage('ping')
~~~

## 基础篇：Electron 的原生能力
前面的章节，我们提到了 `Electron` 的原生能力中包含一些 `Electron` 所提供的原生 API，以及 `Node.js` 提供的一些底层能力，还可以通过 `Node.js` 调用一些原生模块以及通过 `Node.js` 调用一些操作系统的 `OS` 脚本。

这个小节，我们将详细介绍这几种原生能力的使用方式，帮助你更好地使用一些原生功能。

### Electron 的原生 GUI 能力
我们知道，`Electron` 通过集成浏览器内核，使用 `Web` 技术来实现不同平台下的渲染，并结合了 `Chromium、Node.js` 和用于调用系统本地功能的 `API` 三大板块。但是 `Chromium` 并不具备原生 `GUI（图形用户界面，Graphical User Interface）` 的操作能力，因此 `Electron` 内部集成一些原生 `GUI` 的 API，编写 `UI` 的同时也能够调用操作系统的底层 API。

在 `Electron` 中，涉及到原生 `GUI` 的 `API` 主要有以下几个：
- [BrowserWindow 应用窗口](https://www.electronjs.org/zh/docs/latest/api/browser-window)
- [Tray 托盘](https://www.electronjs.org/zh/docs/latest/api/tray)
- [Notification 通知](https://www.electronjs.org/zh/docs/latest/api/notification)
- [Menu 菜单](https://www.electronjs.org/zh/docs/latest/api/menu)
- [dialog 原生弹窗](https://www.electronjs.org/zh/docs/latest/api/dialog)
- ……

对于开发者而言，这些原生 `GUI API` 都是可以跨平台的，比如 `Notification` 模块，对于开发者的使用方式：
~~~js
// main process
const notify = new Notification({
  title: '标题',
  body: '这是内容',
});
notify.show();
~~~
`Electron` 底层会根据操作系统的不同，调用不同的原生 API，进而展示出不同的交互样式。

### Electron 操作系统底层能力的 API
除了上面介绍的一些原生 `GUI` 能力外，`Electron` 还提供了一些对操作系统底层能力的封装 API。常用的有：
- [clipboard 剪贴板](https://www.electronjs.org/zh/docs/latest/api/clipboard)
- [globalShortcut 全局快捷键](https://www.electronjs.org/zh/docs/latest/api/global-shortcut)
- [screen 屏幕](https://www.electronjs.org/zh/docs/latest/api/screen)
- [desktopCapturer 音视频捕捉](https://www.electronjs.org/zh/docs/latest/api/desktop-capturer)
- ……

使用对应模块也是非常方便，比如需要跨平台的向系统剪贴板中读写文本：
~~~js
import { clipboard } from 'electron';
  
clipboard.writeText('Example string', 'selection');  
console.log(clipboard.readText('selection'));
~~~

### Node.js 的 API
前面的章节，我们提到了 `Electron` 架构中使用了 `Chromium` 的 `Renderer Process` 渲染界面，`Renderer Process` 可以有多个，并且 `Electron` 为其集成了 `Node` 运行时。但每个应用程序只能有一个主线程，主线程位于 `Node.js` 下运行。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/f690e50b308440df902e917f8f38b1ea.webp)

因此，在 `Electron` 中，我们可以在渲染进程和主进程中使用 `Node.js`。既然我们可以使用 `Node` 能力，那么 `Node.js` 中所有的 API 我们都可以直接使用。

比如：我们使用 `fs` 模块进行文件的读写操作，使用 `OS` 模块来提供操作系统相关的实用方法和属性。可以使用 `Node npm` 包进行一些额外的功能集成。

需要注意的是，不同 `Electron` 版本集成的 `Node.js` 版本不一样，所以在使用 `Node.js API` 的时候要注意版本问题，可以通过 [`Electron release`](https://releases.electronjs.org/) 记录查询到对应的 `Node` 版本。

### Node.js 调用原生能力
虽然 `Electron` 已经为我们提供了大量的跨平台的 `Native APIs`，但是依然不能涵盖到桌面端应用开发的方方面面，接下来的内容将会简要介绍 `node` 调用原生能力的几种方式和方法。

#### 1. 使用 C++ 构建 node 原生模块
作为前端开发者而言，都或多或少依赖一些 `native addon`。在前端中比较常见的比如 `node-sass`、 `node-canvas`、 `sharp` 等。在介绍使用 `C++` 构建原生模块前，我们需要先储备一些基础知识。

##### 1.1 原生模块的本质
在介绍使用 `C++` 构建 `node` 原生模块之前，我们需要先了解一下原生模块本质。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/52c613d8ced148b5b3510c83e63d09ba.webp)

当一个 `Node.js` 的 `C++` 模块在 `OSX` 下编译会得到一个后缀是  `*.node` 的模块，本质上是  `*.dylib` 的动态链接库；而在 `Windows` 上本质上是  `*.dll` 的动态链接库。在 Linux 下则是 `.so` 的动态链接库。

##### 1.2 node-gyp
`node-gyp` 是一个 `Node.js` 包，它用于构建 `Node.js C++` 扩展。这个工具允许你编译和构建需要 `C++` 代码的 `Node.js` 模块。它是一个使用 `Python` 和 `C++` 构建 `Node.js` 扩展的构建系统。

`node-gyp` 是基于 `Google` 的 `gyp` 构建系统实现的构建工具，它会识别包或者项目中的 `binding.gyp` 文件，然后根据该配置文件生成各系统下能进行编译的项目，如 `Windows` 下生成 `Visual Studio` 项目文件（ `*.sln` 等），`Unix` 下生成 `Makefile`。在生成这些项目文件之后，`node-gyp` 还能调用各系统的编译工具（如 `GCC`）来将项目进行编译，得到最后的动态链接库  `*.node` 文件。

> 从上面的描述，可以知道，在使用 `node-gyp` 前需要安装 `python` 环境和 `C++`  环境。`Windows` 下编译 `C++` 原生模块是依赖 `Visual Studio` 的，但不是必须的，也可以只安装它的编译器 [Visual Studio Build Tools](https://visualstudio.microsoft.com/zh-hans/thank-you-downloading-visual-studio/?sku=BuildTools)。

> 更多在 `Windows` 下安装 `node-gyp` 构建环境的教程可以参考这篇文章：[windows 下 node-gyp 的环境配置](https://juejin.cn/post/7118412140582535175)。

##### 1.3 编写 C++ 扩展的几种方式
**NAN（Native Abstractions for Node.js）**

[NAN](https://github.com/nodejs/nan)（`Node.js` 的原生抽象）是一个库，提供了一组跨不同版本的 `Node.js API` 的抽象层。它的目标是帮助开发者编写跨版本兼容的 `Node.js C++` 插件。由于 `Node.js` 的 `API` 在不同版本之间可能会变化，`NAN` 提供了一种方式来编写稳定的跨版本插件。

**N-API（Node-API）**

[NAPI](https://github.com/nodejs/node-addon-api) 是 `Node` 在 `8.x` 版本提出的一个新特性，主要为开发者编写 `Node.js` 原生 `C/C++` 插件提供了一个更为便捷和易于理解的方式。它提供了一个稳定的、应对 `Node.js` 版本变化的抽象层，允许开发者编写与 `Node.js` 引擎解耦的代码。这意味着，即使 `Node.js` 更新版本，使用 `N-API` 编写的插件也可以继续在新版本上运行。

**node-addon-api**

[Node-addon-api](https://github.com/nodejs/node-addon-api) 是 `Node.js` 提供的另一个 `C++` 扩展 `API`。它是一个用于编写跨平台的 `Node.js C++` 扩展的库。`Node-addon-api` 是构建在 `NAPI` 之上的，提供了更加简单的 `API`，使得扩展开发者可以更加容易地编写跨版本、跨平台的扩展。它还提供了一些方便的功能，如自动内存管理、`V8` 值的类型转换等。

这三个工具或 `API` 都是为了帮助开发者编写可移植、跨平台的 `Node.js C++` 插件，但它们的定位和功能略有不同。`N-API` 是官方提供的稳定接口，而 `NAN` 则是它的前身，`node-addon-api` 则是基于 `N-API` 的高级封装。

##### 1.4 binding.gyp
`binding.gyp` 是一个用于描述 `Node.js` 插件构建过程的配置文件。这个文件使用 `JSON` 格式，但它实际上是为了描述构建系统（例如 `Node-gyp`）所需的构建配置和元数据。

下面是一个使用 `node-addon-api` 编写的模块的 `binding.gyp` 文件示例：
~~~js
// binding.gyp
{
  "targets": [
    {
      // 链接目标,链接之后，生成 "hello.node"
      "target_name": "hello",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      
      // C++ 源文件
      "sources": [
        "./src/hello.cpp",
        "./src/index.cpp"
      ],
      
      // C++ 头文件目录  
      "include_dirs": ["<!(node -p \"require('node-addon-api').include_dir\")"],
 
      // 预编译宏
      "defines": [ 
        "NAPI_DISABLE_CPP_EXCEPTIONS"
      ],
      // 静态库
      "libraries":[]
    }
  ]
}
~~~

##### 1.5 开发一个 C++ 扩展
有了上面的知识，我们来介绍一下如何开发一个简单的 `C++` 扩展。先来看看目录结构：
~~~shell
.
├── binding.gyp
├── hello.cc
├── index.js
└── package.json
~~~
然后，创建一个原生模块的配置文件 `binding.gyp`，如下代码所示：
~~~json
{
  "targets": [
    {
      "target_name": "hello",
      "cflags!": [ "-fno-exceptions" ],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ "hello.cc" ],
      "include_dirs": ["<!(node -p "require('node-addon-api').include_dir")"],
    }
  ]
}
~~~
接下来编写 `hello.cc` 文件：
~~~c++
#include <napi.h>

Napi::String Method(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  return Napi::String::New(env, "world");
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "hello"),
              Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, Init)
~~~
其中通过 `Napi::CallbackInfo&` 来获取函数参数，例如 `info[0]` 代表第一个参数。`info.Env()` 返回一个 `Napi::Env` 对象，代表了当前的 `Node.js` 环境。

`Napi::Env` 是对 `napi_env` 的封装，代表一个 `JavaScript` 上下文，大部分和 `JavaScript` 交互的场景都需要这个上下文，可以保存起来以供下次使用（但是不要跨线程使用）。

`Napi::String::New` 用来构建 `JavaScript` 值，比如 `Napi::String::New(env, "hello")` 就是创建了一个字符串 `"hello"`。

`Napi::Object exports` 则是这个模块的 `exports` 对象，可以把想要给 `JavaScript` 暴露的值和函数通过 `exports.Set` 设置到这个上面。

`NODE_API_MODULE` 这个宏方法定义此原生模块的入口函数，一旦 `Node.js` 加载该模块时，将执行 `Init` 方法，`NODE_GYP_MODULE_NAME` 宏展开后为编译配置文件 `binding.gyp` 中的 `target_name`。

接着，使用 `node-gyp` 来构建项目：
~~~shell
$ node-gyp configure build
~~~
关于 `node-gyp` 常用的命令：
- `node-gyp configure`： 这个命令用于配置构建环境。它会检查你的系统环境并生成相应的构建文件，例如在 `Windows` 上会生成 `Visual Studio` 的项目文件或在 `macOS` 上生成 `Xcode` 的项目文件。
- `node-gyp build`： 使用这个命令来执行实际的构建过程。它会根据 `binding.gyp` 文件中的配置进行编译和构建，生成可加载的 `Node.js` 模块。
- `node-gyp clean`： 清理构建产生的中间文件和输出目录。这个命令会删除构建生成的文件，以便重新开始构建过程。
- `node-gyp rebuild`： 这个命令相当于执行了 `clean` 后再进行 `configure` 和 `build`。它会重新构建你的模块，无论是否已经构建过。
- `node-gyp install`： 用于安装 `Node.js` 模块的依赖。它会查找 `binding.gyp` 文件中列出的依赖，并尝试安装所需的组件。

最后，编写一个 `index.js` 来引用编译好的 `hello.node` 文件
~~~js
const addon = require('./build/Release/hello.node');

module.exports = addon;
~~~

##### 1.6 使用 node-bindings 包
在上面的例子中，我们在 `index.js` 文件中，直接通过相对路径的方式引用了编译好的 `.node` 文件。但是在大多数情况下，由于 `Node.js Addon` 存在各种不同的方案、构建配置，那 `.node` 文件产物的位置可能也会因此不同，所以我们需要借助一个 `node-bindings` 包来自动为我们寻找 `.node` 文件的位置：
~~~js
const addon = require('bindings')('hello.node');

module.exports = addon;
~~~

##### 1.7 使用 node-pre-gyp
由于使用安装包的用户可能存在着不同的操作系统和 `node ABI` 版本，为了可以自动编译当前系统架构所对应的产物，我们大多数情况下不得不让用户在安装 `C++` 扩展包时使用用户设备进行 `Addon` 的编译，那么这个时候就需要修改一下我们扩展包的 `package.json` 文件：
~~~json
{
  "scripts": {
    "install": "prebuild-install || node-gyp rebuild --release"
  }
}
~~~
这里我们添加了一个 `install` 钩子，来确保用户在执行 `npm install` 时执行 `node-gyp rebuild` 命令来进行本地编译。

但这对没有 `C++` 编译环境的用户来说，使用这个扩展是个非常头疼的问题，因为会各种报错。因此，如果你希望让用户无需具备编译环境即可安装 `Addon`，那么你可以使用 `node-pre-gyp`。

`node-pre-gyp` 允许开发者将预编译的 `Node.js` 插件发布到各种平台（`Windows、macOS、Linux` 等）。这样，用户可以在安装时直接获取预编译的二进制文件，而不需要在他们的机器上进行编译。

这个时候，你的 `package.json` 需要指定对应编译好的 `.node` 文件下载地址，并添加一个 `install` 钩子，让用户在执行 `npm install` 的时候，通过 `node-pre-gyp install` 寻找预编译好的二进制 `.node` 文件。

`node-pre-gyp` 会先检查项目本地是否已经存在二进制构建文件，当不存在时进入用户本地查找，当用户本地也不存在时会执行 `http` 下载。
~~~json
"dependencies"  : {
  "@mapbox/node-pre-gyp": "1.x"
},
"devDependencies": {
  "aws-sdk": "2.x"
}
"scripts": {
  "install": "node-pre-gyp install --fallback-to-build"
},
"binary": {
  "module_name": "your_module",
  "module_path": "./lib/binding/",
  "host": "https://your_module.s3-us-west-1.amazonaws.com"
}
~~~

##### 1.8 Electron 上引入原生模块
如果你使用的 `C++` 扩展是通过安装时编译而不是预编译的方式实现的，那么 `Electron` 在引入包进行本地编译时，编译出的原生模块不一定能在 `Electron` 应用中正常工作，有可能会报以下错误：
~~~bash
Error: The module '/path/to/native/hello.node'
was compiled against a different Node.js version using
NODE_MODULE_VERSION 51. This version of Node.js requires
NODE_MODULE_VERSION 57. Please try re-compiling or re-installing
the module (for instance, using `npm rebuild` or `npm install`).
~~~
原因就是我们前面提到了，`Electron` 自己内部集成了一个 `Node.js` 环境，那么就有可能出现 **`Electron` 内置的 `Node.js` 的版本可能与你编译原生模块使用的 `Node.js` 的版本不同** 的情况。

遇到这种情况，建议开发者使用 `Electron` 团队提供的 [electron-rebuild](https://github.com/electron/rebuild) 工具来进行重新编译，因为 `electron-rebuild` 会帮我们确定 `Electron` 的版本号、`Electron` 内置的 `Node.js` 的版本号、以及 `Node.js` 使用的 `ABI` 的版本号，并根据这些版本号下载不同的头文件和类库：
~~~bash
npm install --save-dev electron-rebuild

# 当你需要安装原生 Native 时，运行下面这个命令
./node_modules/.bin/electron-rebuild --force --module-dir=xxx

# 在 windows 下如果上述命令遇到了问题，尝试这个：
.\node_modules.bin\electron-rebuild.cmd --force --module-dir=xxx
~~~

#### 2. 使用 node-ffi-napi 调用动态链接库
[node-ffi-napi](https://github.com/node-ffi-napi/node-ffi-napi) 是一个用于使用纯 `JavaScript` 加载和调用动态库的 `Node.js` 插件。它可以用来在不编写任何 `C++` 代码的情况下创建与本地 `DLL` 库的绑定。同时它负责处理跨 `JavaScript` 和 `C` 的类型转换。

但是，它的性能可能较低，并且不适用于需要较高性能或对 `V8` 引擎更深层次控制的情况。

`node-ffi-napi` 通过 `Buffer` 类，在 `C` 代码和 `JS` 代码之间实现了内存共享，类型转换则是通过 [`ref-napi`](https://github.com/node-ffi-napi/ref-napi)、[`ref-array-napi`](https://github.com/Janealter/ref-array-napi) 实现。由于 `node-ffi-napi` / `ref-napi` 包含 `C` 原生代码，所以安装需要配置 `Node` 原生插件编译环境。

### Node 调用 OS 脚本
我们也可以使用 `Node.js` 调用系统集成好的一些能力，接下来我们将分别介绍不同平台的一些 `OS` 脚本能力。

#### 1. WinRT
`WinRT（Windows Runtime）` 是 `Microsoft` 开发的一种应用程序框架，用于创建 `Windows` 平台上的通用应用程序。它提供了一系列 `API`，允许开发者使用多种编程语言（如 `C++、C#、JavaScript`）编写适用于 `Windows 8` 及更新版本的应用程序。

`WinRT` 提供了许多功能，包括用户界面、文件访问、网络通信、设备访问等。它旨在支持不同类型的 `Windows` 应用程序开发。

在 `Windows` 中，我们可以使用 [`NodeRT`](https://github.com/NodeRT/NodeRT) 来调用 `WinRT` 的能力，比如使用 `Windows.Devices.Geolocation` 命名空间，在 `Node.js` 中定位用户的位置：
~~~js
const { Geolocator } = require('windows.devices.geolocation')
const locator = new Geolocator()

locator.getGeopositionAsync((error, result) => {
  if (error) {
    console.error(error)
    return
  }

  const { coordinate } = result
  const { longitude, latitude } = coordinate

  console.info(longitude, latitude)
})
~~~
![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/445eab5801ef490ea4b12fe69992b552.webp)

#### 2. AppleScript
`AppleScript` 是 `macOS` 和 `Mac OS Classic` 中的脚本语言，用于自动化和控制 `Mac` 系统上的各种操作和应用程序。

`AppleScript` 允许用户编写脚本来执行诸如文件操作、应用程序控制、系统设置更改等操作。它与 `macOS` 紧密集成，可用于操作系统本身以及许多应用程序。

通常，我们可以使用 [node-applescript](https://github.com/TooTallNate/node-applescript) 来执行一些 `AppScript` 脚本：
~~~js
const applescript = require('applescript');

// 非常基本的 AppleScript 命令。以 'Array' 形式返回 iTunes 中当前选定音轨的歌曲名称。
const script = 'tell application "iTunes" to get name of selection';

applescript.execString(script, (err, rtn) => {
  if (err) {
    // Something went wrong!
  }
  if (Array.isArray(rtn)) {
    for (const songName of rtn) {
      console.log(songName);
    }
  }
});
~~~

#### 3. Shell 脚本
`Shell` 提供了与操作系统交互的命令行界面，允许用户执行文件操作、进程管理、系统设置等。通常我们可以使用 `node` 的 `child_process` 模块来调用和执行一些命令行脚本。比如，我们想调用 `windows` 中的一个 `.exe` 可执行文件：
~~~js
const { execFile } = require('child_process');

const exeRes = execFile('C:\\xxx.exe');

exeRes.on('exit', () => {
  if (code) {
    //  todo
  }
});
~~~

## 基础篇：Electron 跨平台兼容性措施
尽管 `Electron` 在跨平台方面表现出色，但不同平台间细微差异依然存在。仅仅通过单一平台下的测试无法充分证明应用的健壮性（当然，若只为特定平台开发则另当别论）。因此，在针对不同发布平台时，我们需要采取兼容性措施。

### Electron Native API 的平台限制
在开发 `Electron` 应用时，我们常常只专注于查找 `API` 的名称，而忽略了该 `API` 可用的平台限制。在官方文档中，针对一些独占的 `API`，通常会有标识来指明它们的适用平台，比如 `macOS` 下，[`Electron app` 模块](https://www.electronjs.org/zh/docs/latest/api/app)独有的一些钩子函数：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/19521b16a8cf433092f196ba0056e6f4.webp)

这些钩子函数因为和操作系统底层相关，所以有些只有特殊的平台才会有。也有些是特殊平台才具有的功能性 `API`：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/daf56534db044720999b728e9e7a7f81.webp)

在这些特殊平台才具有的功能 API 或钩子函数中，`Electron` 官方都会通过 `tag` 标签为我们标注清楚，我们只需要注意使用即可。不过需要注意的是，还有一些未有平台 `tag` 标识的 `API` 里的配置项、或者通用的配置项，不同平台的值和具体表现可能也有差异：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/Electron/643ae4be8ff9442c8ddf64807c77a7d5.webp)

所以，当你在使用这些 `API` 和钩子函数的时候，需要多多留意这些差异，避免出现不符合预期的 `bug`。

### 操作系统天然的差异性
虽然 `Electron` 的 `API` 帮助我们解决了跨平台的绝大多数场景的问题，但是因为操作系统本身存在着天然的差异性，所以在面对一些 `Electron` 不提供的原生 `API` 时，我们就不得不考虑不同平台的差异性问题。

比如，当我们使用 `C++` 编写原生 `node addon` 开发的时候，为了实现不同平台的能力，需要编写兼容性代码：
~~~js
// binding.gyp
{
  "targets": [
    {
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"],
      "target_name": "addon",
      "include_dirs": ["<!(node -p \"require('node-addon-api').include_dir\")"],
      "sources": ["export.cc"],
      "conditions": [
        [
          'OS=="mac"',
          {
            // ...
          }
        ],
        [
          'OS=="win"',
          {
            // ...
          }
        ]
      ]
    }
  ]
}
~~~
就算我们可能用不到底层原生模块来编写跨平台的扩展，而当我们用 `js` 来调用不同系统的能力时，也需要编写一些兼容性代码来进行适配：
~~~js
let action;
// 判断当前平台
const platform = {
  linux() {
    return process.platform === 'linux';
  },
  macOS() {
    return process.platform === 'darwin';
  },
  windows() {
    return process.platform === 'win32';
  },
};
// 平台判断
if (platform.macOS()) {
  action = require("./darwin");
} else if (platform.windows()) {
  action = require("./win");
} else if (platform.linux()) {
  action = require("./linux");
}

export default action;
~~~
### 用户习惯的差异性
我们知道在桌面端，`macOS` 和 `Windows` 有着特别多的操作差异性，比如在窗口管理上，`Windows` 用户习惯使用最大化、最小化和关闭窗口的按钮，而 `macOS` 用户则通常使用红、黄、绿色的按钮分别表示关闭、最小化和全屏。

除此之外，在 `macOS` 中，即使所有窗口关闭了，应用仍然在底部的菜单栏中保持活动状态。因此，通常需要特殊处理以确保用户主动退出应用程序。而在其他平台（如 `Windows` 或 `Linux`）中，通常情况下关闭最后一个窗口也意味着退出应用程序是合理的行为。所以为了实现这个操作习惯，我们也可以增加一个情况判断：
~~~js
// 当窗口都被关闭了
app.on('window-all-closed', () => { 
  // 如果不是macOS
  if (process.platform !== 'darwin') {
    // 应用退出
    app.quit();
  }
});
~~~
除此之外，我们还知道，不同操作系统对于一些常用功能的键盘快捷键可能有所不同，比如复制、粘贴、撤销等，`Windows` 中使用的 `Ctrl` 作为修饰键，而 `macOS` 中是使用的 `Command` 作为修饰键。所以，当我们需要注册此类快捷键的时候，需要注意使用 `CommandOrControl+xx` 关键词：
~~~js
globalShortcut.register('CommandOrControl+X', () => {
    // todo
});
~~~
### 文件路径的差异
需要留意的是在 `Electron` 的通用 `app.getPath API` 中，获取的返回路径是有差异性的，比如：
~~~js
import { app } from 'electron';
// 获取用户的应用程序数据目录
app.getPath('appData');

// MacOS: ~/Library/Application Support/<Your App Name>
// Windows: C:\Users\<you>\AppData\Local\<Your App Name>
// Linux: ~/.config/<Your App Name>
~~~
此外，在 `Windows` 下，文件路径的分隔符为 `\`、`\\`，而在 `macOS` 和 `Linux` 下，文件路径的分隔符为 `/`。

所以，如果我们在 `MacOS` 系统上编写了操作路径的应用程序，放到 `Windows` 上去运行，就有可能因为路径而出现问题。正确的做法是使用 `path` 模块，帮助处理路径，比如使用 `path.join` 方法来拼接路径：
~~~js
const path = require('path')

// windows __dirname = D:\my\folder
const relativePath = './image/a.png';
console.log(path.join(__dirname, relativePath)); // D:\my\folder\image\a.png

// macOS __dirname = /my/folder
const relativePath = './image/a.png';
console.log(path.join(__dirname, relativePath)); // /my/folder/image/a.png
~~~
### 托盘图标的差异
在 `Electron` 中，应用程序可以通过 `Tray` 类来创建托盘图标。
~~~js
let icon;
if (commonConst.macOS()) {
  icon = './icons/iconTemplate@2x.png';
} else if (commonConst.windows()) {
  icon =
    parseInt(os.release()) < 10
      ? './icons/icon@2x.png'
      : './icons/icon.ico';
} else {
  icon = './icons/icon@2x.png';
}
const appIcon = new Tray(path.join(__static, icon));
~~~
在代码中，有三种图标：`iconTemplate@2x.png`、`icon.ico` 和 `icon@2x.png`。其中 `iconTemplate@2x.png` 用于在 `macOS` 中显示模板图标，而 `icon@2x.png` 用于在 `Windows < 10` 以及 `Linux` 操作系统中显示图标。`icon.ico` 用于在 `Windows >= 10` 的操作系统中展示。

在 `macOS` 使用 `Template` 时：

- 传给托盘构造函数的图标必须是[图片模板](https://www.electronjs.org/zh/docs/latest/api/native-image#template-image) 。
- 为了确保你的图标在视网膜监视器不模糊，请确认你的 `@2x` 图片是 `144dpi` 。
- 如果你正在打包你的应用程序（例如，使用 `webpack` 开发），请确保文件名没有被破坏或哈希。文件名需要以 `Template` 单词结尾，同时 `@2x` 图片需要与标准图片文件名相同，否则 `MacOS` 不会神奇地反转图片的颜色或使用高分图片。
- `16x16 (72dpi)` 和 `32x32@2x (144dpi)` 适合大多数图标。

在 `Windows` 上使用 `icon` 时注意：

- 建议使用 `ICO` 图标获取最佳视觉效果。

### 应用程序上的差异
在 `macOS` 中，未签名的应用可能会面临一些安全提示和限制。其中一个问题是在安装前需要用户确认并授权运行该应用。这是 macOS 的安全特性，用以确保用户知晓并授权运行未签名的应用程序，关于如何对 `Electron` 应用程序签名和公正可以在 **《通用篇：Electron 应用打包》** 章节详细阅读。


































































