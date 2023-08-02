# Vue
[官方文档](https://cn.vuejs.org/)
## 简介
渐进式 JavaScript 框架

## 全面拥抱 Vue 3
1. 源码组织上的变化
   <br>
   <br>
   Vue 3 相对于 Vue 2 使用 monorepo 的方式进行包管理，使用 monorepo 的管理方式，使得 Vue 3 源码模块职责显得特别地清晰明了，每个包独立负责一块核心功能的实现，方便开发和测试。
   >比如，compiler-core 专职负责与平台无关层的渲染器底层，对外提供统一调用函数，内部通过完整的测试用例保障功能的稳定性。而 compiler-dom 和 compiler-ssr 则依托于 compiler-core 分别实现浏览器和服务端侧的渲染器上层逻辑，模块核心职责清晰明了，提高了整体程序运行的健壮性！
2. 引入 Composition API
   <br>
   <br>
   在 Vue 2.7 之前，我们去开发 Vue 应用，都是通过 data、computed、methods……这样的选项分类的方式来实现一个组件的开发。其实这样对于没有大量状态逻辑维护、复用的组件来说，是比较直观的组织方式，但是一旦遇到需要大量维护、复用状态的组件来说，这无疑增加了维护的成本和风险。
   <br>
   <br>
   组合式 API (Composition API) 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。
   >但 Composition API 也并不是“银弹”，它也有自己适合的场景，所以 Vue 3 也是在实现层面做到了兼容 Options API 的写法。相对而言，Composition API 更适用于大型的项目，因为大型项目可能会产生大量状态逻辑的维护，甚至跨组件的逻辑复用；而对于中小型项目来说，Options API 可以在你写代码时减少思考组织状态逻辑的方式，也是一种不错的选择。
3. 运作机制的变化
   <br>
   <br>
   Vue 3 则在底层实现中，摒弃了 Vue 2 的部分实现，采用全新的响应式模型进行重写:
   <br>
   <br>
   * 首先，之前通过 new Vue() 来创建 Vue 对象的方式已经变成了 createApp；
   * 其次，在响应式部分也由原来的 Object.defineProperty 改成了现在的 Proxy API 实现；
   * 另外，针对响应式依赖收集的内容，在 Vue 2.x 版本中是收集了 Watcher，而到了 Vue 3 中则成了 effect。
   <br>
   <br>

   除了上面所说的这些变化外，Vue 3 不管是在编译时、还是在运行时都做了大量的性能优化。例如，在编译时，Vue 3 通过标记 /*#__PURE__*/ 来为打包工具提供良好的 Tree-Shaking 机制，通过 静态提升 机制，避免了大量静态节点的重复渲染执行；在运行时，又通过批量队列更新机制优化了更新性能，通过 PatchFlags 和 dynamicChildren 进行了 diff 的靶向更新

## 源码调试
- 克隆 [Vue3 源码](https://github.com/vuejs/core)
  ~~~shell
  git clone https://github.com/vuejs/core.git
  ~~~
- 目录结构
  ~~~rust
  ├── packages              
  │   ├── compiler-core     # 与平台无关的编译器实现的核心函数包
  │   ├── compiler-dom      # 浏览器相关的编译器上层内容
  │   ├── compiler-sfc      # 单文件组件的编译器
  │   ├── compiler-ssr      # 服务端渲染相关的编译器实现
  │   ├── global.d.ts       # ts 相关一些声明文件
  │   ├── reactivity        # 响应式核心包
  │   ├── runtime-core      # 与平台无关的渲染器相关的核心包
  │   ├── runtime-dom       # 浏览器相关的渲染器部分
  │   ├── runtime-test      # 渲染器测试相关代码
  │   ├── server-renderer   # 服务端渲染相关的包
  │   ├── sfc-playground    # 单文件组件演练场
  │   ├── shared            # 工具库相关
  │   ├── size-check        # 检测代码体积相关
  │   ├── template-explorer # 演示模板编译成渲染函数相关的包
  │   └── vue               # 包含编译时和运行时的发布包
  ~~~
  核心内容主要分布在 compiler-core、compiler-dom、reactivity、 runtime-core、runtime-dom 这几个包中。
  <br>
  <br>
- 启动运行
  ~~~shell
  npm run dev # 开启 vue dev 环境 watch
  npm run serve # 启动 example 示例的服务器
  ~~~
  只需要访问 packages/vue/examples/** 中的示例就可以在线调试 Vue 代码了。

## 渲染器:组件如何渲染成DOM
相对于传统的 jQuery 一把梭子撸到底的开发模式，组件化可以帮助我们实现 视图 和 逻辑 的复用，并且可以对每个部分进行单独的思考。对于一个大型的 Vue.js 应用，通常是由一个个组件组合而成

但是我们实际访问的页面，是由 DOM 元素构成的，而组件的 ```<template>``` 中的内容只是一个模板字符串而已。

### 初始化一个 Vue 3 应用
~~~shell
# 安装 vue cli 
$ yarn global add @vue/cli

# 创建 vue3 的基础脚手架 一路回车
$ vue create vue3-demo
~~~
打开项目，可以看到 `Vue.js` 的入口文件 `main.js` 的内容如下：
~~~ts
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')
~~~
这里就有一个根组件 `App.vue`，把 `App.vue` 根组件进行了一个简单的修改：
~~~vue
<template>
  <div class="helloWorld">
    hello world
  </div>
</template>
<script>
export default {
  setup() {
    // ...
  }
}
</script>
~~~
### 根组件模板编译
我们知道 `.vue` 类型的文件无法在 `Web` 端直接加载，我们通常会在 `webpack` 的编译阶段，通过 `vue-loader` 编译生成组件相关的 `JavaScript` 和 `CSS`，并把 `template` 部分编译转换成 `render` 函数添加到组件对象的属性中。

上述的 `App.vue` 文件内的模板其实是会被编译工具在编译时转成一个渲染函数，大致如下：
~~~ts
import { openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

const _hoisted_1 = { class: "helloWorld" }

export function render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, " hello world "))
}
~~~
现在我们只需要知道 `<script>` 中的对象内容最终会和编译后的模板内容一起，生成一个 `App` 对象传入 `createApp` 函数中：
~~~ts
{

  render(_ctx, _cache, $props, $setup, $data, $options) { 
    // ... 
  },
  setup() {
    // ...
  }
}
~~~

### 对象组件渲染成真实的 DOM
接着回到 `main.js` 的入口文件，整个初始化的过程只剩下如下部分了：
~~~ts
createApp(App).mount('#app')
~~~
打开源码，可以看一下 `createApp` 的过程：
~~~ts
// packages/runtime-dom/src/index.ts
export const createApp = (...args) => {
  const app = ensureRenderer().createApp(...args);
  // ...
  return app;
};
~~~
猜测一下，`ensureRenderer().createApp(...args)` 这个链式函数执行完成后肯定返回了 `mount` 函数，`ensureRenderer` 就是构造了一个带有 `createApp` 函数的**渲染器 renderer 对象** ：
~~~ts
// packages/runtime-dom/src/index.ts
function ensureRenderer() {
  // 如果 renderer 有值的话，那么以后都不会初始化了
  return (
    renderer ||
    (renderer = createRenderer(rendererOptions)
  )
}

// renderOptions 包含以下函数：

const renderOptions = {
  createElement,
  createText,
  setText,
  setElementText,
  patchProp,
  insert,
  remove,
}
~~~
这里返回的 `renderer` 对象，可以认为是一个跨平台的渲染器对象，针对不同的平台，会创建出不同的 `renderer` 对象，上述是创建浏览器环境的 `renderer` 对象，对于服务端渲染的场景，则会创建 `server render` 的 `renderer`:
~~~ts
// packages/runtime-dom/src/index.ts
let enabledHydration = false
function ensureHydrationRenderer() {
  renderer = enabledHydration
    ? renderer
    : createHydrationRenderer(rendererOptions)
  enabledHydration = true
  return renderer
}
~~~
再来看一下 `createRenderer` 返回的对象：
~~~ts
// packages/runtime-core/src/renderer.ts
export function createRenderer(options) {
  // ...
  // 这里不介绍 hydrate 模式
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate),
  }
}
~~~
可以看到，`renderer` 对象上包含了 `createApp` 和 `render` 方法。再来看一下 `createApp` 方法：
~~~ts
// packages/runtime-core/src/apiCreateApp.ts
function createAppAPI(render, hydrate) {
  // createApp createApp 方法接收的两个参数：根组件的对象和 prop
  return function createApp(rootComponent, rootProps = null) {
    const app = {
      // ... 省略很多不需要在这里介绍的属性
      _component: rootComponent,
      _props: rootProps,
      mount(rootContainer, isHydrate, isSVG) {
        // ...
      }
    }
    return app
  }
}
~~~
直到这里，我们才真正拨开了 `Vue 3` 初始化根组件的核心方法，也就是入口文件 `createApp` 真正执行的内容就是这里的 `createAppAPI` 函数中的 `createApp` 函数，该函数接收了 `<App />` 组件作为根组件 `rootComponent`，返回了一个包含 `mount` 方法的 `app` 对象。

接下来再深入地看一下 `mount` 的内部实现：
~~~ts
// packages/runtime-core/src/apiCreateApp.ts
mount(rootContainer, isHydrate, isSVG) {
  if (!isMounted) {
    // ... 省略部分不重要的代码
    // 1. 创建根组件的 vnode
    const vnode = createVNode(
      rootComponent,
      rootProps
    )
    
    // 2. 渲染根组件
    render(vnode, rootContainer, isSVG)
    isMounted = true
  }
}
~~~
#### 1. 创建根组件的 vnode
什么是 `vnode` 节点呢？其实它和 `Virtual DOM` 是一个意思，就是将真实的 `DOM` 以普通对象形式的数据结构来表达，简化了很多 `DOM` 中内容。

熟悉 `JS DOM` 编程的小伙伴都知道 `JS` 直接操作 `DOM` 往往会带来许多性能负担，所以 `vnode` 提供了对真实 `DOM` 上的一层虚拟映射，我们只需要操作这个虚拟的数据结构，那些真正费性能的活交给这些框架来操作就好了，框架会帮我们做很多性能优化的事情。这也是 `vnode` 带来的最大的优势之一。

其次，因为 `vnode` 只是一种与平台无关的数据结构而已，所以理论上我们也可以将它渲染到不同平台上从而达到跨平台渲染的目的。这个也是 `weex`、`mpvue` 等跨端渲染框架的核心基础。

上述例子中的 `template` 中的内容用 `vnode` 可以表示为：
~~~ts
const vnode = {
  type: 'div',
  props: { 
    'class': 'helloWorld'
  },
  children: 'helloWorld'
}
~~~
说了这么多，那么根节点是如何被创建成一个 `vnode` 的呢？核心也就在 `createVNode` 函数中：
~~~ts
// packages/runtime-core/src/vnode.ts
function createBaseVNode(...) {
  const vnode = {
    type,
    props,
    key: props && normalizeKey(props),
    children,
    component: null,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    // ... 一些其他属性
  }
  // ...
  return vnode
}
function createVNode(type, props = null, children = null) {
  if (props) {
    // 如果存在 props 则需要对 props 进行一些处理，这里先省略
  }
  // ...
  // 处理 shapeFlag 类型
  const shapeFlag = isString(type)
    ? ShapeFlags.ELEMENT
    : __FEATURE_SUSPENSE__ && isSuspense(type)
    ? ShapeFlags.SUSPENSE
    : isTeleport(type)
    ? ShapeFlags.TELEPORT
    : isObject(type)
    ? ShapeFlags.STATEFUL_COMPONENT
    : isFunction(type)
    ? ShapeFlags.FUNCTIONAL_COMPONENT
    : 0
  
  // ...
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  )
}
~~~
当进行根组件渲染的时候，`createVNode` 的第一个入参 `type` 是我们的 `App` 对象，也就是一个 `Object`，所以得到的 `shapeFlag` 的值是 `STATEFUL_COMPONENT`，代表的是一个有状态组件对象。（这里顺便提一下，如果传入的是个函数，那么就是一个函数式组件 `FUNCTIONAL_COMPONENT`，函数式组件和有状态的对象组件都是 `Vue` 可处理的组件类型，这个会在下面渲染阶段提及。）

到这里，`Vue` 完成了对根组件的 `Vnode` 对象的创建，接下来要做的就是将该组件渲染到页面中。

#### 2. VNode 渲染成真实的组件
回到 `mount` 函数中，接下来一步就是对 `vnode` 的渲染工作，核心代码：
~~~ts
render(vnode, rootContainer);
~~~
那么这里的 `render` 函数是什么呢？通过上面的代码我们发现，其实它是在调用 `createAppAPI` 时传入进来的，而 `createAppAPI` 则是在创建 `renderer` 渲染器的时候调用的。那么，接下来看看 `render` 函数的实现：
~~~ts
// packages/runtime-core/src/renderer.ts
const render = (vnode, container) => {
  if (vnode == null) {
    // 如果 vnode 不存在，表示需要卸载组件
    if (container._vnode) {
      unmount(container._vnode, null, null, true)
    }
  } else {
    // 否则进入更新流程（初始化创建也是特殊的一种更新）
    patch(container._vnode || null, vnode, container)
  }
  // 缓存 vnode
  container._vnode = vnode
}
~~~
很明显，对于初始化根组件的过程中，传入了一个根组件的 `vnode` 对象，所以这里会执行 `patch` 相关的动作。`patch` 本意是补丁的意思，可以理解成为更新做一些补丁的活儿，其实初始的过程也可以看作是一个全量补丁，一种特殊的更新操作。
~~~ts
// packages/runtime-core/src/renderer.ts
function patch(n1,n2,container = null,anchor = null,parentComponent = null) {
  // 对于类型不同的新老节点，直接进行卸载
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }
  // 基于 n2 的类型来判断
  // 因为 n2 是新的 vnode
  const { type, shapeFlag } = n2;
  switch (type) {
    case Text:
       // 处理文本节点
      break;
    // 其中还有几个类型比如： static fragment comment
    default:
      // 这里就基于 shapeFlag 来处理
      if (shapeFlag & ShapeFlags.ELEMENT) {
        // 处理普通 DOM 元素
        processElement(n1, n2, container, anchor, parentComponent);
      } else if (shapeFlag & ShapeFlags.COMPONENT) {
        // 处理 component
        processComponent(n1, n2, container, parentComponent);
      } else if {
        // ... 处理其他元素
      }
  }
}
~~~
`patch` 函数主要接收的参数说明如下：
- `n1` 表示老的 `vnode` 节点；
- `n2` 表示新的 `vnode` 节点；
- `container` 表示需要挂载的 `dom` 容器；
- `anchor` 挂载的参考元素；
- `parentComponent` 父组件。

这里我们主要关注前 3 个参数，因为是初始化的过程，所以 `n1` 本次值为空，核心看 `n2` 的值，`n2` 有一个 `type` 和 `shapeFlag`。当前 `n2` 的 `type` 是 `App` 组件对象，所以逻辑会进入 `Switch` 的 `default` 中。再比较 `shapeFlag` 属性，前面提到 `shapeFlag` 的值是 `STATEFUL_COMPONENT`。

> 这里需要注意的是 `ShapeFlags` 是一个二进制左移操作符生成的对象，其中
`ShapeFlags.COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT`， 所以 `shapeFlag & ShapeFlags.COMPONENT` 这里的值是 `true`，关于二进制左移操作符对象在 `Vue 3` 中会大量使用，后面也会详细介绍。

接着也就进入了 `processComponent` 的逻辑了：
~~~ts
// packages/runtime-core/src/renderer.ts
function processComponent(n1, n2, container, parentComponent) {
  // 如果 n1 没有值的话，那么就是 mount
  if (!n1) {
    // 初始化 component
    mountComponent(n2, container, parentComponent);
  } else {
    updateComponent(n1, n2, container);
  }
}
~~~
同理，这里我们只看初始化的逻辑，所以 `n1` 此时还是个空值，那么就会进入 `mountComponent` 函数对组件进行初始挂载过程。
~~~ts
// packages/runtime-core/src/renderer.ts
function mountComponent(initialVNode, container, parentComponent) {
  // 1. 先创建一个 component instance
  const instance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent
  ));
  
  // 2. 初始化 instance 上的 props, slots, 执行组件的 setup 函数...
  setupComponent(instance);

  // 3. 设置并运行带副作用的渲染函数
  setupRenderEffect(instance, initialVNode, container);
}
~~~
该函数实现过程还是非常清晰的，思考一下，一个组件的初始化要做哪些内容呢？

其实很容易想到，我们需要一个实例化的组件对象，该对象可以在 `Vue` 执行的运行时上下文中随时获取到，另外还需要对实例化后的组件中的属性做一些优化、处理、赋值等操作，最后，就是把组件实例的 `render` 函数执行一遍。

上面也是 `mountComponent` 核心做的事情，我们一个个来看。

第一步是组件实例化，在 `Vue 3` 中通过 `createComponentInstance` 的方法创建组件实例，返回的是一个组件实例的对象，大致包含以下属性：
~~~ts
// packages/runtime-core/src/component.ts
const instance = {
  // 这里是组件对象
  type: vnode.type, 
  // 组件 vnode
  vnode,
  // 新的组件 vnode
  next: null, 
  // props 相关
  props: {}, 
  // 指向父组件
  parent,
  // 依赖注入相关
  provides: parent ? parent.provides : {},
  // 渲染上下文代理
  proxy: null,
  // 标记是否被挂载
  isMounted: false,
  // attrs 相关
  attrs: {}, 
  // slots 相关
  slots: {}, 
  // context 相关
  ctx: {},
  // setup return 的状态数据
  setupState: {}, 
  // ...
};
~~~
上述实例属性，相对源码而言，已经省略了很多内容了，这些属性现在看着肯定不知所云，头皮发麻。但相应的属性是 `vue` 在特定的场景和功能下才会用到的。

然后是对实例化后的组件中的属性做一些优化、处理、赋值等操作，这里主要是初始化了 `props`、`slots`，并执行组件的 `setup` 函数，核心的实现和功能将在后面介绍。
~~~ts
// packages/runtime-core/src/component.ts
export function setupComponent(instance) {
  // 1. 处理 props
  // 取出存在 vnode 里面的 props
  const { props, children } = instance.vnode;
  initProps(instance, props);
  // 2. 处理 slots
  initSlots(instance, children);

  // 3. 调用 setup 并处理 setupResult
  setupStatefulComponent(instance);
}
~~~
最后是把组件实例的 `render` 函数执行一遍，这里是通过 `setupRenderEffect` 来执行的。我们再看一下这个函数的实现：
~~~ts
// packages/runtime-core/src/renderer.ts
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 渲染子树的 vnode
      const subTree = (instance.subTree = renderComponentRoot(instance))
      // 挂载子树 vnode 到 container 中
      patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)
      // 把渲染生成的子树根 DOM 节点存储到 el 属性上
      initialVNode.el = subTree.el
      instance.isMounted = true
    }
    else {
      // 更新相关，后面介绍
    }
  }
  // 创建副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions)
}
~~~
这里我们再看一下 `componentUpdateFn` 这个函数，核心是调用了 `renderComponentRoot` 来生成 `subTree`，然后再把 `subTree` 挂载到 `container` 中。其实 `renderComponentRoot` 的核心工作就是执行 `instance.render` 方法，该方法前面我们已经说了，组件在编译时会生成组件对象，包含了 `render` 函数，该函数内部是一系列的渲染函数的执行：
~~~ts
import { openBlock, createElementBlock } from "vue"

const _hoisted_1 = { class: "helloWorld" }

export function render(...) {
  return (openBlock(), createElementBlock("div", _hoisted_1, " hello world "))
}
~~~
那么只需要看一下 `createElementBlock` 函数的实现：
~~~ts
// packages/runtime-core/src/vnode.ts
export const createElementBlock = (...) => {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true /* isBlock */
    )
  )
};
~~~
可以看到本质还是调用了 `createBaseVNode` 创新 `vnode`。所以，我们可以推导出 `subtree` 就是调用 `render` 函数而生产的 `vnode` 节点。这里需要注意的一点是，因为 `subtree` 调用的 `createBaseVNode` 创建时，传入的 `type = div` 在这里是个 `string`，所以返回的 `shapeFlags` 的值是 `ELEMENT`。

渲染生成子树 `vnode` 后，接下来就是继续调用 `patch` 函数把子树 `vnode` 挂载到 `container` 中了，前面说过了 `patch` 的实现，再来简单看一下当传入的 `vnode` 的 `shapeFlags` 是个 `ELEMENT` 时，会调用 `processElement` 这个函数：
~~~ts
if (shapeFlag & ShapeFlags.ELEMENT) {
  processElement(n1, n2, container, anchor, parentComponent);
}
~~~
我们来看一下 `processElement` 的实现：
~~~ts
// packages/runtime-core/src/renderer.ts
function processElement(n1, n2, container, anchor, parentComponent) {
  if (!n1) {
    // 挂载元素节点
    mountElement(n2, container, anchor);
  } else {
    // 更新元素节点
    updateElement(n1, n2, container, anchor, parentComponent);
  }
}
~~~
因为在初始化的过程中，`n1` 是 `null`，所以这里执行的是 `mountElement` 进行元素的初始化挂载。
~~~ts
// packages/runtime-core/src/renderer.ts
const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let el
  const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode
  // ...
  // 根据 vnode 创建 DOM 节点
  el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is)
  if (props) {
    // 处理 props 属性
    for (const key in props) {
      if (!isReservedProp(key)) {
        hostPatchProp(el, key, null, props[key], isSVG)
      }
    }
  }
  // 文本节点处理
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    hostSetElementText(el, vnode.children)
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    // 如果节点是个数据类型，则递归子节点
    mountChildren(vnode.children, el)
  }
  // 把创建好的 el 元素挂载到容器中
  hostInsert(el, container, anchor)
}
~~~
`mountElemet` 首先是通过 `hostCreateElement` 创建了一个 DOM 节点，然后处理一下 `props` 属性，接着根据 `shapeFlag` 判断子节点的类型，如果节点是个文本节点，则直接创建文本节点，如果子节点是个数组，比如这种情况：
~~~ts
return (openBlock(), createElementBlock("div", _hoisted_1, [
  hoisted_2,
  createVNode(_component_Hello)
]))
~~~
对于这种子节点是数组的情况时，它的 `shapeFlag` 将是一个数组类型 `ARRAY_CHILDREN`。此时会对该 `vnode` 节点的子节点调用 `mountChildren` 进行递归的 `patch` 渲染。

最后，处理完所有子节点后，通过 `hostInsert` 方法把缓存在内存中的 `DOM el` 映射渲染到真实的 `DOM Container` 当中。
~~~ts
// packages/runtime-dom/src/nodeOps.ts
insert: (child, parent, anchor) {
  parent.insertBefore(child, anchor || null)
}
~~~
到这里，我们已经完成了从入口文件开始，分析根组件如何挂载渲染到真实 `DOM` 的流程，再简单通过一张流程图回顾一下上述内容，绿色部分是初始化的过程，也是本小节的内容，灰色部分我们后面再做介绍。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/30a91d25745e496cb0ad763763f40896~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

然后我们再引用一下 `Vue` 官网上的一张渲染流程图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/05fb0272c6c64b20b77b83012ac99f8c~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

现在再来看这一张图，整体流程就会清晰了很多：在组件初始化挂载阶段，模板被编译成渲染函数的形式，交由渲染器执行，渲染器执行渲染函数得到 `APP` 组件对象的子树 `vnode`，子树 `vnode` 进行递归 `patch` 后生成不同类型的 `DOM` 节点，最后把这些 `DOM` 节点挂载到页面的 `container` 当中。

## 渲染器:数据访问如何被代理
我们先看一个有意思的示例，组件上有一个动态文本节点 `{{ msg }}`，但是却有 `2` 处定义了 `msg` 响应式数据；另外有一个按钮，点击后会修改响应式数据。
~~~vue
<template>
  <p>{{ msg }}</p>
  <button @click="changeMsg">点击试试</button>
</template>
<script>
  import { ref } from 'vue'
  export default {
    data() {
      return {
        msg: 'msg from data'
      }
    },
    setup() {
      const msg = ref('msg from setup')
      return {
        msg
      }
    },
    methods: {
      changeMsg() {
        this.msg = 'change'
      }
    }
  }
</script>
~~~
思考一下：
- 界面显示的内容是什么？
- 点击按钮后，修改的是哪部分的数据？是 `data` 中定义的，还是 `setup` 中的呢？

上一节，我们知道了根组件在初始化渲染的过程中，会执行 `mountComponent` 的函数：
~~~ts
function mountComponent(initialVNode, container, parentComponent) {
  // 1. 先创建一个 component instance
  const instance = (initialVNode.component = createComponentInstance(
    initialVNode,
    parentComponent
  ));
  
  // 2. 初始化组件实例
  setupComponent(instance);

  // 3. 设置并运行带副作用的渲染函数
  setupRenderEffect(instance, initialVNode, container);
}
~~~
上文，我们简单介绍了关于 `setupComponent` 函数的作用是为了对实例化后的组件中的属性做一些优化、处理、赋值等操作。本小节我们将重点介绍 `setupComponent` 的内部实现和作用。

### 初始化组件实例
我们再来回顾一下 `setupComponent` 在源码中的实现：
~~~ts
export function setupComponent(instance, isSSR = false) {
  const { props, children } = instance.vnode
  
  // 判断组件是否是有状态的组件
  const isStateful = isStatefulComponent(instance)
  
  // 初始化 props
  initProps(instance, props, isStateful, isSSR)
  
  // 初始化 slots
  initSlots(instance, children)

  // 如果是有状态组件，那么去设置有状态组件实例
  const setupResult = isStateful
    ? setupStatefulComponent(instance, isSSR)
    : undefined
    
  return setupResult
}
~~~
setupComponent 方法做了什么？
1. 通过 `isStatefulComponent(instance)` 判断是否是有状态的组件；
2. `initProps` 初始化 `props`；
3. `initSlots` 初始化 `slots`；
4. 根据组件是否是有状态的，来决定是否需要执行 `setupStatefulComponent` 函数。

其中， `isStatefulComponent` 判断是否是有状态的组件的函数如下：
~~~ts
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT
}
~~~
前面我们已经说过了，`ShapeFlags` 在遇到组件类型的 `type = Object` 时，`vnode` 的`shapeFlags = ShapeFlags.STATEFUL_COMPONENT`。所以这里会执行 `setupStatefulComponent` 函数。
~~~ts
function setupStatefulComponent(instance, isSSR) {
  // 定义 Component 变量
  const Component = instance.type

  // 1. 创建渲染代理的属性访问缓存
  instance.accessCache = Object.create(null)
  // 2. 创建渲染上下文代理, proxy 对象其实是代理了 instance.ctx 对象
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  // 3. 执行 setup 函数
  const { setup } = Component
  if (setup) {
    // 如果 setup 函数带参数，则创建一个 setupContext
    const setupContext = (instance.setupContext =
      setup.length > 1 ? createSetupContext(instance) : null)
    // 执行 setup 函数，获取结果
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext])
    // 处理 setup 执行结果
    handleSetupResult(instance, setupResult)
  } else {
    // 4. 完成组件实例设置
    finishComponentSetup(instance, isSSR)
  }
}
~~~
`setupStatefulComponent` 字面意思就是设置有状态组件，那么什么是有状态组件呢？简单而言，就是对于有状态组件，`Vue` 内部会保留组件状态数据。相对于有状态组件而言，`Vue` 还存在一种函数组件 `FUNCTIONAL_COMPONENT`，一起看个示例：
~~~ts
import { ref } from 'vue';

export default () => {
  let num = ref(0);
  const plusNum = () => {
    num.value ++;
  };
  return (
    <div>
      <button onClick={plusNum}>
        { num.value }
      </button>
    </div>
  )
}
~~~
`defineComponent` 返回的是个对象类型的 `type`，所以就变成了有状态组件。

好了，搞清楚什么是有状态组件后，我们接着回到 `setupStatefulComponent` 实现中，来一步步地分析其核心实现的原理。

### 创建渲染上下文代理
首先我们看 `1-2` 两个步骤，关于第一点：为什么要创建渲染代理的属性访问缓存呢？这里先卖个关子，先看第二步：创建渲染上下文代理，这里为什么要对 `instance.ctx` 做代理呢？如果熟悉 `Vue 2` 的小伙伴应该了解对于 `Vue 2` 的 `Options API` 的写法如下：
~~~vue
<template>
  <p>{{ num }}</p>
</template>
<script>
export default {
  data() {
    num: 1
  },
  mounted() {
    this.num = 2
  }
}
</script>
~~~
`Vue 2.x` 是如何实现访问 `this.num` 获取到 `num` 的值，而不是通过 `this._data.num` 来获取 `num` 的值呢？其实 `Vue 2.x` 版本中，为 `_data` 设置了一层代理：
~~~ts
_proxy(options.data);

function _proxy (data) {
  const that = this;
  Object.keys(data).forEach(key => {
    Object.defineProperty(that, key, {
      configurable: true,
      enumerable: true,
      get: function proxyGetter () {
        return that._data[key];
      },
      set: function proxySetter (val) {
        that._data[key] = val;
      }
    })
  });
}
~~~
本质就是通过 `Object.defineProperty` 使在访问 `this` 上的某属性时从 `this._data 中读取（写入）`。

而 `Vue 3` 也在这里做了类似的事情，`Vue 3` 内部有很多状态属性，存储在不同的对象上，比如 `setupState`、`ctx`、`data`、`props`。这样用户取数据就会考虑具体从哪个对象中获取，这无疑增加了用户的使用负担，所以对 `instance.ctx` 进行代理，然后根据属性优先级关系依次完成从特定对象上获取值。

#### get
了解了代理的功能后，我们来具体看一下是如何实现代理功能的，也就是 `proxy` 的 `PublicInstanceProxyHandlers` 它的实现。先看一下 `get` 函数：
~~~ts
export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance
    let normalizedProps
    if (key[0] !== '$') {
      // 从缓存中获取当前 key 存在于哪个属性中
      const n = accessCache![key]
      if (n !== undefined) {
        switch (n) {
          case AccessTypes.SETUP:
            return setupState[key]
          case AccessTypes.DATA:
            return data[key]
          case AccessTypes.CONTEXT:
            return ctx[key]
          case AccessTypes.PROPS:
            return props![key]
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        // 从 setupState 中取
        accessCache![key] = AccessTypes.SETUP
        return setupState[key]
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        // 从 data 中取
        accessCache![key] = AccessTypes.DATA
        return data[key]
      } else if (
        (normalizedProps = instance.propsOptions[0]) &&
        hasOwn(normalizedProps, key)
      ) {
        // 从 props 中取
        accessCache![key] = AccessTypes.PROPS
        return props![key]
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        // 从 ctx 中取
        accessCache![key] = AccessTypes.CONTEXT
        return ctx[key]
      } else if (!__FEATURE_OPTIONS_API__ || shouldCacheAccess) {
        // 都取不到
        accessCache![key] = AccessTypes.OTHER
      }
    }

    const publicGetter = publicPropertiesMap[key]
    let cssModule, globalProperties
    if (publicGetter) {
      // 以 $ 保留字开头的相关函数和方法
      // ...
    } else if (
      // css module
    (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      // ...
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      // ...
    } else if (
      // 全局属性
      ((globalProperties = appContext.config.globalProperties),
      hasOwn(globalProperties, key))
    ) {
      // ...
    } else if (__DEV__) {
      // 一些告警
      // ...
    }
  }
}
~~~
这里，可以回答我们的第一步 创建渲染代理的属性访问缓存 这个步骤的问题了。如果我们知道 `key` 存在于哪个对象上，那么就可以直接通过对象取值的操作获取属性上的值了。如果我们不知道用户访问的 `key` 存在于哪个属性上，那只能通过 `hasOwn` 的方法先判断存在于哪个属性上，再通过对象取值的操作获取属性值，这无疑是多操作了一步，而且这个判断是比较耗费性能的。如果遇到大量渲染取值的操作，那么这块就是个性能瓶颈，所以这里用了 `accessCache` 来标记缓存 `key` 存在于哪个属性上。这其实也**相当于用一部分空间换时间的优化**。

接下来，函数首先判断 `key[0] !== '$'` 的情况（`$` 开头的一般是 `Vue` 组件实例上的内置属性），在 `Vue 3` 源码中，会依次从 `setupState`、`data`、`props`、`ctx` 这几类数据中取状态值。

这里的定义顺序，决定了后续取值的优先级顺序：`setupState` > `data` > `props` > `ctx`。

如果 `key` 是以 `$` 开头，则首先会判断是否是存在于组件实例上的内置属性：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/bf3570bbda1d431fb70e248be0dc75f6~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

整体的获取顺序依次是：`publicGetter` > `cssModule` > `ctx`。最后，如果都取不到，那么在开发环境就会给一些告警提示。

#### set
接着继续看一下设置对象属性的代理函数：
~~~ts
export const PublicInstanceProxyHandlers = {
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      // 设置 setupState
      setupState[key] = value
      return true
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      // 设置 data
      data[key] = value
      return true
    } else if (hasOwn(instance.props, key)) {
      // 不能给 props 赋值
      return false
    }
    if (key[0] === '$' && key.slice(1) in instance) {
      // 不能给组件实例上的内置属性赋值
      return false
    } else {
      // 用户自定义数据赋值
      ctx[key] = value
    }
    return true
  }
}
~~~
可以看到这里也是和前面 `get` 函数类似的通过调用顺序来实现对 `set` 函数不同属性设置优先级的，可以直观地看到优先级关系为：`setupState` > `data` > `props`。同时这里也有说明：就是如果直接对 `props` 或者组件实例上的内置属性赋值，则会告警。

#### has
最后，再看一个 `proxy` 属性 `has` 的实现：
~~~ts
export const PublicInstanceProxyHandlers = {
  has({_: { data, setupState, accessCache, ctx, appContext, propsOptions }}, key) {
    let normalizedProps
    return (
      !!accessCache![key] ||
      (data !== EMPTY_OBJ && hasOwn(data, key)) ||
      (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) ||
      ((normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key)) ||
      hasOwn(ctx, key) ||
      hasOwn(publicPropertiesMap, key) ||
      hasOwn(appContext.config.globalProperties, key)
    )
  },
}
~~~
这个函数则是依次判断 `key` 是否存在于 `accessCache` > `data` > `setupState` > `prop` > `ctx` > `publicPropertiesMap` > `globalProperties`，然后返回结果。

`has` 在业务代码的使用定义如下：
~~~ts
export default {
  created () {
    // 这里会触发 has 函数
    console.log('msg' in this)
  }
}
~~~
至此，我们就搞清楚了创建上下文代理的过程。

### 调用执行 setup 函数
一个简单的包含 `CompositionAPI` 的 `Vue 3 demo` 如下
~~~vue
<template>
  <p>{{ msg }}</p>
</template>
<script>
  export default {
    props: {
      msg: String
    },
    setup (props, setupContext) {
      // todo
    }
  }
</script>
~~~
这里的 `setup` 函数，正是在这里被调用执行的：
~~~ts
// 获取 setup 函数
const { setup } = Component
// 存在 setup 函数
if (setup) {
  // 根据 setup 函数的入参长度，判断是否需要创建 setupContext 对象
  const setupContext = (instance.setupContext =
    setup.length > 1 ? createSetupContext(instance) : null)
  // 调用 setup
  const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext])
  // 处理 setup 执行结果
  handleSetupResult(instance, setupResult)
}
~~~
#### createSetupContext
因为 `setupContext` 是 `setup` 中的第二个参数，所以会判断 `setup` 函数参数的长度，如果大于 `1`，则会通过 `createSetupContext` 函数创建 `setupContext` 上下文。

该上下文创建如下：
~~~ts
function createSetupContext (instance) {
  return {
    get attrs() {
      return attrs || (attrs = createAttrsProxy(instance))
    },
    slots: instance.slots,
    emit: instance.emit,
    expose
  }
}
~~~
可以看到，`setupContext` 中包含了 `attrs`、`slots`、`emit`、`expose` 这些属性。这些属性分别代表着：组件的属性、插槽、派发事件的方法 `emit`、以及所有想从当前组件实例导出的内容 `expose`。

这里有个小的知识点，就是可以通过函数的 `length` 属性来判断函数参数的个数(拥有默认值的参数的前面的参数的个数)
~~~ts
function foo() {};

foo.length // 0

function bar(a) {};

bar.length // 1

function bar(a = "123") {};

bar.length // 0
~~~

#### callWithErrorHandling
第二步，通过 `callWithErrorHandling` 函数来间接执行 `setup` 函数，其实就是执行了以下代码：
~~~ts
const setupResult = setup && setup(shallowReadonly(instance.props), setupContext);
~~~
只不过增加了对执行过程中 `handleError` 的捕获。

在后续的阅读中，你会发现 `Vue 3` 很多函数的调用都是通过 `callWithErrorHandling` 来包裹的：
~~~ts
export function callWithErrorHandling(fn, instance, type, args = []) {
  let res
  try {
    res = args ? fn(...args) : fn()
  } catch (err) {
    handleError(err, instance, type)
  }
  return res
}
~~~
这样的好处一方面可以由 `Vue` 内部统一 `try...catch` 处理用户代码运行可能出现的错误。另一方面这些错误也可以交由用户统一注册的 `errorHandler` 进行处理，比如上报给监控系统。

#### handleSetupResult
最后执行 `handleSetupResult` 函数：
~~~ts
function handleSetupResult(instance, setupResult) {
  if (isFunction(setupResult)) {
    // setup 返回渲染函数
    instance.render = setupResult
  }
  else if (isObject(setupResult)) {
    // proxyRefs 的作用就是把 setupResult 对象做一层代理
    instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance)
}
~~~
`setup` 返回值不一样的话，会有不同的处理，如果 `setupResult` 是个函数，那么会把该函数绑定到 `render` 上。比如：
~~~vue
<script>
  import { createVnode } from 'vue'
  export default {
    props: {
      msg: String
    },
    setup (props, { emit }) {
      return (ctx) => {
        return [
          createVnode('p', null, ctx.msg)
        ]
      }
    }
  }
</script>
~~~
当 `setupResult` 是一个对象的时候，我们为 `setupResult` 对象通过 `proxyRefs` 作了一层代理，方便用户直接访问 `ref` 类型的值。比如，在模板中访问 `setupResult` 中的数据，就可以省略 `.value` 的取值，而由代理来默认取 `.value` 的值。
> 注意，这里 `instance.setupState = proxyRefs(setupResult)`; 之前的 Vue 源码的写法是 `instance.setupState = reactive(setupResult)`; ，至于为什么改成上面的，Vue 作者也有相关说明：[Template auto ref unwrapping for setup() return object is now applied only to the root level refs.](https://github.com/vuejs/core/pull/1682)

#### 完成组件实例设置
最后，到了 `finishComponentSetup` 这个函数了：
~~~ts
function finishComponentSetup(instance) {
  // type 是个组件对象
  const Component = instance.type;
  
  if (!instance.render) {
    // 如果组件没有 render 函数，那么就需要把 template 编译成 render 函数
    if (compile && !Component.render) {
      if (Component.template) {
        // 这里就是 runtime 模块和 compile 模块结合点
        // 运行时编译
        Component.render = compile(Component.template, {
        isCustomElement: instance.appContext.config.isCustomElement || NO
      })
      }
    }

    instance.render = Component.render;
  }
  if (__FEATURE_OPTIONS_API__ && !(__COMPAT__ && skipOptions)) {
    // 兼容选项式组件的调用逻辑
  }
}
~~~
这里主要做的就是根据 `instance` 上有没有 `render` 函数来判断是否需要进行运行时渲染，运行时渲染指的是在浏览器运行的过程中，动态编译 `<template>` 标签内的内容，产出渲染函数。对于编译时渲染，则是有渲染函数的，因为模板中的内容会被 `webpack` 中 `vue-loader` 这样的插件进行编译。

另外需要注意的，这里有个 `__FEATURE_OPTIONS_API__` 变量用来标记是否是兼容 选项式 `API` 调用，如果我们只使用 `Composition Api` 那么就可以通过 `webpack` 静态变量注入的方式关闭此特性。然后交由 `Tree-Shacking` 删除无用的代码，从而减少引用代码包的体积。

### 回答上面《思考一下》的答案
1. 初始化渲染的时候，会从实例上获取状态 `msg` 的值，获取的优先级是：`setupState` > `data` > `props` > `ctx`。`setupState` 就是 `setup` 函数执行后返回的状态值，所以这里渲染的是：`msg from setup`。
2. 点击按钮的时候，会更新实例上的状态，更新的优先级是：`setupState` > `data`。所以会更新 `setup` 中的状态数据 `msg`。


## 渲染器:组件是如何完成更新
接下来，我们将介绍组件的更新逻辑，这部分逻辑主要包含在 `setupRenderEffect` 这个函数中。
~~~ts
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 初始化组件
    }
    else {
      // 更新组件
    }
  }
  // 创建响应式的副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions)
}
~~~
在前面的小节中，我们说完了关于 `mounted` 的流程。接下来我们将着重来看一下组件更新的逻辑：
~~~ts
const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
  function componentUpdateFn() {
    if (!instance.isMounted) {
      // 初始化组件
    }
    else {
      // 更新组件
      let { next, vnode } = instance
      // 如果有 next 的话说明需要更新组件的数组（props, slot 等）
      if (next) {
        next.el = vnode.el
        // 更新组件实例信息
        updateComponentPreRender(instance, next, optimized)
      } else {
        next = vnode
      }
      // 获取新的子树 vnode
      const nextTree = renderComponentRoot(instance)
      // 获取旧的子树 vnode
      const prevTree = instance.subTree
      // 更新子树 vnode
      instance.subTree = nextTree
      // patch 新老子树的 vnode
      patch(
        prevTree, 
        nextTree,
        // 处理 teleport 相关
        hostParentNode(prevTree.el),
        // 处理 fragment 相关
        getNextHostNode(prevTree),
        instance,
        parentSuspense,
        isSVG)
      // 缓存更新后的 DOM 节点
      next.el = nextTree.el
    }
  }
  // 创建响应式的副作用渲染函数
  instance.update = effect(componentUpdateFn, prodEffectOptions)
}
~~~
这里的核心流程是通过 `next` 来判断当前是否需要更新 `vnode` 的节点信息，然后渲染出新的子树 `nextTree`，再进行比对新旧子树并找出需要更新的点，进行 `DOM` 更新。我们先来看一下 `patch` 的更新流程：
~~~ts
function patch(n1, n2, container = null, anchor = null, parentComponent = null) {
  // 对于类型不同的新老节点，直接进行卸载
  if (n1 && !isSameVNodeType(n1, n2)) {
    anchor = getNextHostNode(n1)
    unmount(n1, parentComponent, parentSuspense, true)
    n1 = null
  }
  // 基于 n2 的类型来判断
  // 因为 n2 是新的 vnode
  const { type, shapeFlag } = n2;
  switch (type) {
    case Text:
      processText(n1, n2, container);
      break;
    // 其中还有几个类型比如： static fragment comment
    case Fragment:
      processFragment(n1, n2, container);
      break;
    default:
      // 这里就基于 shapeFlag 来处理
      if (shapeFlag & ShapeFlags.ELEMENT) {
        processElement(n1, n2, container, anchor, parentComponent);
      } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(n1, n2, container, parentComponent);
      }
  }
}
~~~
首先判断当 `n1` 存在，即存在老节点，但新节点和老节点不是同类型的节点情况，那么执行销毁老节点，新增新节点。那么 `Vue` 如何判断是否是不同类型的节点呢？答案就在 `isSameVNodeType` 函数中：  
~~~ts
export function isSameVNodeType(n1, n2) {
  // 新老节点的 type 和 key 都相同
  return n1.type === n2.type && n1.key === n2.key
}
~~~
这里比如从 `div` 变成了 `p` 标签，那么 `isSameVNodeType` 就会是个 `false`。

如果当新老节点是同类型的节点，则会根据 `shapeFlag` 不同走到不同的逻辑，如果是普通元素更新，那么就会走到 `processElement` 的逻辑中；如果是组件更新，则会走到 `processComponent` 中。

接下来分别看看这两种更新机制有什么不同。

### processElement
这里我们也着重看一下 `processElement` 的更新流程：
~~~ts
const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  isSVG = isSVG || n2.type === 'svg'
  if (n1 == null) {
    // 初始化的过程
  }
  else {
    // 更新的过程
    patchElement(n1, n2, parentComponent, parentSuspense, isSVG, optimized)
  }
}
~~~
`processElement` 更新逻辑调用 `patchElement` 函数：
~~~ts
const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, optimized) => {
  const el = (n2.el = n1.el)
  let { patchFlag, dynamicChildren, dirs } = n2
  // ...
  // 旧节点的 props
  const oldProps = (n1 && n1.props) || EMPTY_OBJ
  // 新节点的 props
  const newProps = n2.props || EMPTY_OBJ
  // 对比 props 并更新
  patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG)  
  // 先省略 dynamicChildren 的逻辑，后续介绍... 
  // 全量比对子节点更新
  patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG)
}
~~~
可以看到普通元素的更新主要做的就是先更新 `props` ，当 `props` 更新完成后，然后再统一更新子节点。关于如何进行 `patchProps` 做节点的属性更新不是本小节的重点，这里先跳过。
> 这里省略了对 `dynamicChildren` 存在时，执行 `patchBlockChildren` 的优化 `diff` 过程，我们直接先看全量 `diff` 也就是 `patchChildren` 函数。关于 `patchBlockChildren` 我们将在**编译过程中的优化**小节中进行详细介绍

接着来看 `patchChildren` 更新子节点的函数：
~~~ts
const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized = false) => {
  // c1 代表旧节点的子节点元素
  const c1 = n1 && n1.children
  const prevShapeFlag = n1 ? n1.shapeFlag : 0
  // c2 代表新节点的子节点元素
  const c2 = n2.children
  const { patchFlag, shapeFlag } = n2
  // 新节点是文本
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    // 旧节点是数组
    if (prevShapeFlag & ARRAY_CHILDREN) {
      // 卸载旧节点
      unmountChildren(c1, parentComponent, parentSuspense)
    }
    if (c2 !== c1) {
      // 新旧节点都是文本，但内容不一样，则替换
      hostSetElementText(container, c2)
    }
  } else {
    // 新节点不为文本
    // 旧节点是数组
    if (prevShapeFlag & ARRAY_CHILDREN) {
      // 新节点也是数组
      if (shapeFlag & ARRAY_CHILDREN) {
        // 进行新旧节点的 diff
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      } else {
        // 卸载旧节点
        unmountChildren(c1, parentComponent, parentSuspense, true)
      }
    } else {
      // 新节点不为文本
      // 旧节点不是数组
      // 旧节点是文本
      if (prevShapeFlag & TEXT_CHILDREN) {
        // 则把它清空
        hostSetElementText(container, '')
      }
      // 新节点是数组
      if (shapeFlag & ARRAY_CHILDREN) {
        // 挂载新节点
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, optimized)
      }
    }
  }
}
~~~
对于子节点来说，节点类型只会有三种可能，分别是：文本节点、数组节点、空节点。所以这个方法里所有的 `if else` 分支就是在考虑新旧节点可能的全部情况，并进行相应的处理。这里流程分支有点多，画个图大家就明白在做啥了：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/66213e6cf7cb4e33a7a4a99ec19e7a4b~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

其中新旧节点都是数组的情况涉及到我们平常所说的 `diff` 算法，会放到后面专门去解析。

看完处理`DOM`元素的情况，接下来看处理`vue`组件。

### processComponent
~~~ts
const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
  if (n1 == null) {
    // 初始化的过程
  }
  else {
    // 更新的过程
    updateComponent(n1, n2, parentComponent, optimized)
  }
}
~~~
`processComponent` 更新逻辑调用 `updateComponent` 函数：
~~~ts
const updateComponent = (n1, n2, optimized) => {
  const instance = (n2.component = n1.component)!
   // 根据新老节点判断是否需要更新子组件
  if (shouldUpdateComponent(n1, n2, optimized)) {
    //...
    // 如果需要更新，则将新节点 vnode 赋值给 next
    instance.next = n2
    // 执行前面定义在 instance 上的 update 函数。
    instance.update()
  } else {
    // 如果不需要更新，则将就节点的内容更新到新节点上即可
    n2.el = n1.el
    instance.vnode = n2
  }
}
~~~
`updateComponent` 函数首先通过 `shouldUpdateComponent` 函数来判断当前是否需要更新。 因为有些 `VNode` 值的变化并不需要立即显示更新子组件，举个例子：
~~~vue
<template>
   <div>{{msg}}</div>
   <Child />
</template>
<script setup>
import { ref } from 'vue'

const msg = ref('hello')
</script>
~~~
因为子组件不依赖父组件的状态数据，所以子组件是不需要更新的。这也从侧面反映出 `Vue` 的更新不仅是组件层面的细粒度更新，更在源码层面帮我们处理了一些不必要的子节点更新！

最后执行的 `instance.update`，这个函数其实就是在 `setupRenderEffect` 内创建的。最终子组件的更新还会走一遍自己副作用函数的渲染，然后 `patch` 子组件的子模板 `DOM`，接上上面的流程。

回过头来再看这里我们多次出现了 `next` 变量。为了更好地理解整体的流程，我们再来看一个 `demo`：
~~~vue
<template>
  <div>
    hello world
    <hello :msg="msg" />
    <button @click="changeMsg">修改 msg</button>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  setup () {
    const msg = ref('你好')
    function changeMsg() {
      msg.value = '你好啊，我变了'
    }
    return {
      msg,
      changeMsg
    }
  }
}
</script>

// hello.vue
<template>
  <div>
    {{msg}}
  </div>
</template>
<script>
export default {
  props: {
    msg: String
  }
}
</script>
~~~
这里有个 `App.vue` 组件，内部有一个 `hello` 组件，我们来从头再捋一下整体的流程，就清楚了 `next` 的作用。
- 当点击 修改 `msg` 后， `App` 组件自身的数据变化，导致 `App` 组件进入 `update` 逻辑，此时是没有 `next` 的，接下来渲染新的子组件 `vnode`，得到真实的模板 `vnode` `nextTree`，用新旧`subTree`进行`patch`。
- 此时`patch`的元素类型是 `div`，进入更新普通元素的流程，先更新`props`，再更新子节点，当前`div`下的子节点有`Hello`组件时，进入组件的的更新流程。
- 在更新 `Hello` 组件时，根据 `updateComponent` 函数执行的逻辑，会先将`Hello`组件 `instance.next` 赋值为最新的子组件 `vnode`，之后再主动调用`instance.update` 进入上面的副作用渲染函数，这次的实例是 `Hello` 组件自身的渲染，且 `next` 存在值。

当 `next` 存在时，会执行 `updateComponentPreRender` 函数：
~~~ts
const updateComponentPreRender = (instance, nextVNode, optimized) => {
  // 新节点 vnode.component 赋值为 instance
  nextVNode.component = instance
  // 获取老节点的 props
  const prevProps = instance.vnode.props
  // 为 instance.vnode 赋值为新的组件 vnode 
  instance.vnode = nextVNode
  instance.next = null
  // 更新 props
  updateProps(instance, nextVNode.props, prevProps, optimized)
  // 更新 slots
  updateSlots(instance, nextVNode.children)
}
~~~
`updateComponentPreRender` 函数核心功能就是完成了对实例上的属性、`vnode` 信息、`slots` 进行更新，当后续组件渲染的时候，得到的就是最新的值。

总而言之，`next` 就是用来标记接下来需要渲染的子组件，如果 `next` 存在，则会进行子组件实例相关内容属性的更新操作，再进行子组件的更新流程。

补齐一下流程图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/f0088d60c2054ec9b204f662e55d22cc~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)


## 渲染器:数组子节点的 DIFF 算法

### 1. 从头比对
`Vue 3` 的 `diff` 算法第一步就是进行新老节点从头比对的方式来判断是否是同类型的节点：
~~~ts
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始比对
  // (a b) c
  // (a b) d e
  while (i <= e1 && i <= e2) {
    const n1 = c1[i]
    const n2 = (c2[i] = optimized
      ? cloneIfMounted(c2[i] as VNode)
      : normalizeVNode(c2[i]))
    // 如果是 sameVnode 则递归执行 patch  
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized)
    } else {
      break
    }
    i++
  }
}
~~~
这里有几个变量需要说明一下：
- `i` 代表的是头部的标记位；
- `e1` 代表的是旧的子节点的尾部标记位；
- `e2` 代表的是新的子节点的尾部标记位。

从头比对就是通过不断移动 `i` 这个头部标记位来判断对应的节点是否是 `sameVnode`。如果是，则进行递归 `patch` 操作，递归 `patch` 就是继续进入到我们上一小节的内容。如果不满足条件，则退出头部比对，进入从尾比对流程。

### 2. 从尾比对
~~~ts
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始比对
  // ...
  // 从尾部开始比对
  // a (b c)
  // d e (b c)
  while (i <= e1 && i <= e2) {
    const n1 = c1[e1]
    const n2 = (c2[i] = optimized
      ? cloneIfMounted(c2[i] as VNode)
      : normalizeVNode(c2[i]))
    // 如果是 sameVnode 则递归执行 patch  
    if (isSameVNodeType(n1, n2)) {
      patch(n1, n2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized)
    } else {
      break
    }
    e1--
    e2--
  }
}
~~~
从尾比对就是通过不断移动新旧节点 `e1` 和 `e2` 的尾部指针来判断对应的节点是否是 `sameVnode`。如果是则进行递归 `patch` 操作，递归 `patch` 也是继续进入到我们上一小节的内容。如果不满足条件，则退出头部比对，进入后续流程。

### 3. 新增节点
假设我们有这样一个旧列表：
~~~html
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
~~~
新列表的变更是在中间插入了一个新节点：
~~~html
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="b">e</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
~~~
那么先进入第一步头部比对流程：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/074804630b39471e809def7080e9614d~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

第一步执行时，会完成对 `a` 和 `b` 头部这 `2` 个节点进行 `patch`。当 `i = 2` 时，由于此时的 `c` 和 `e` 节点的 `key` 不一样，所以退出了头部比对流程，进入尾部比对：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/8b9733b3694f4c81a22015672b56cdf0~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

第二步执行时，会完成对 `c` 和 `d` 尾部这 `2` 个节点进行 `patch`。当 `e1 = 1` 时，由于`i > e1`，所以退出了尾部比对流程。肉眼可见，此时的情况是新节点多了个 `e` 节点的情况，所以我们需要添加多余的剩余节点：
~~~ts
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始必须
  // ...
  // 从尾部开始比对
  // ...
  // 如果有多余的新节点，则执行新增逻辑
  if (i > e1) {
    if (i <= e2) {
      const nextPos = e2 + 1
      const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor
      while (i <= e2) {
        // 新增新节点
        patch(null, c2[i], container, anchor, parentComponent, parentSuspense, isSVG)
        i++
      }
    }
  }
}
~~~

### 4. 删除节点
类比新增节点的情况，假设我们有这样一个旧列表：
~~~html
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="b">e</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
~~~
新列表的变更是在中间删除了一个旧节点：
~~~html
<ul>
  <li key="a">a</li>
  <li key="b">b</li>
  <li key="c">c</li>
  <li key="d">d</li>
</ul>
~~~
那么先进入第一步头部比对流程：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/41f9b957775b441580d331f3c4f3656b~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

第一步执行时，会完成对 `a` 和 `b` 头部这 `2` 个节点进行 `patch`。当 `i = 2` 时，由于此时的 `e` 和 `c` 节点的 `key` 不一样，所以退出了头部比对流程，进入尾部比对：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/5d570fbb6d864c379a0eaf6011cc3521~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

第二步执行时，会完成对 `c` 和 `d` 尾部这 `2` 个节点进行 `patch`。当 `e2 = 1` 时，由于`i > e2`，所以退出了尾部比对流程。肉眼可见，此时的情况是新节点少了个 `e` 节点的情况，所以我们需要删除节点 `e`：
~~~ts
const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, optimized) => {
  let i = 0
  const l2 = c2.length
  // 旧节点的尾部标记位
  let e1 = c1.length - 1
  // 新节点的尾部标记位
  let e2 = l2 - 1
  // 从头部开始比对
  // ...
  // 从尾部开始比对
  // ...
  // 如果有多余的新节点，则执行新增逻辑
  // ...
  // 如果有多余的旧节点，则执行卸载逻辑
  else if (i > e2) {
    while (i <= e1) {
      // 卸载节点
      unmount(c1[i], parentComponent, parentSuspense, true)
      i++
    }
  }
}
~~~

### 5. 未知子序列
经过步骤 1、2 的操作后如果可以直接进入步骤 3、4 那是非常方便的操作了，直接进行多余删除缺少新增的操作。如果步骤 3、4 的条件都不满足的情况，那么 `Vue` 是如何处理的呢？再来看这样一个例子。

旧子节点：
~~~html
<ul>
    <li key="a">a</li>
    <li key="b">b</li>
    <li key="c">c</li>
    <li key="d">d</li>
    <li key="e">e</li>
    <li key="f">f</li>
    <li key="g">g</li>
    <li key="h">h</li>
</ul>
~~~
新子节点：
~~~html
<ul>
    <li key="a">a</li>
    <li key="b">b</li>
    <li key="e">e</li>
    <li key="c">c</li>
    <li key="d">d</li>
    <li key="i">i</li>
    <li key="g">g</li>
    <li key="h">h</li>
</ul>
~~~
此时经过步骤 1、2 后的结果可以表示为如下图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/29972b7a05414f8daf0ffcd348b650b3~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

这种情况，既不满足 `i > e1` 也不满足 `i > e2` 的条件，所以对于这种情况应该如何处理呢？我们知道 `DOM` 更新的性能优劣关系大致为：`属性更新 > 位置移动 > 增删节点`。所以，我们需要尽可能地复用老节点，做属性更新，减少移动次数和增删节点的次数。

那么上述更新策略假设有这样 2 种方式。
- `c` 和 `d` 节点不动，只做 `patch`，`e` 节点 `patch` 后移动到 `c` 节点前面，删除 `f` 节点，然后在 `d` 节点后面添加 `i` 节点。
- `e` 节点不动，只做 `patch`，`c` 和 `d` 节点 `patch` 后移动到 `e` 节点后面，删除 `f` 节点，然后在 `d` 节点后面添加 `i` 节点。

根据上面的性能优劣关系，我们需要尽可能多地保障最多的公共子节点位置不变，只做 `patch` 更新。然后找出多余的节点删除，找出新的节点添加，找出有需要移动的节点移动。

当需要进行移动操作时，那么这个问题就变成了求取新旧子树上的最长公共子序列。当知道了**最长公共子序列**，所有的操作就可以简化为：
1. 如果节点在新节点中，不在旧节点中，那么新增节点。
2. 如果节点在旧节点中，不在新节点中，那么删除节点。
3. 如果节点既在旧节点中，也在新节点中，那么更新。
4. 如果节点需要移动，那么求取最长公共子序列后，进行最小位置移动。

接下来看看 Vue 是如何实现上述能力的。

### 构造新老节点位置映射 keyToNewIndexMap
~~~ts
// 旧子序列开始位置
const s1 = i
// 新子序列开始位置
const s2 = i

// 5.1 构建 key:index 关系索引 map
const keyToNewIndexMap = new Map()
for (i = s2; i <= e2; i++) {
  const nextChild = (c2[i] = optimized
    ? cloneIfMounted(c2[i] as VNode)
    : normalizeVNode(c2[i]))
  if (nextChild.key != null) {
    keyToNewIndexMap.set(nextChild.key, i)
  }
}
~~~
这里的新旧子节点开始位置通过 `s1` 和 `s2` 作为标记，然后开始进行构造新老节点位置映射，这里新节点 `key` -> `index` 关系的索引图是保存在了 `keyToNewIndexMap` 这样一个 `Map` 结构中，其中的 `key` 就是新节点的 `key` 值，而 `value` 则是旧节点对应的位置关系 `index`。这一步完成后，生成的 `keyToNewIndexMap` 结果可以表示为：
~~~ts
keyToNewIndexMap = {e: 2, c: 3, d: 4, i: 5}
~~~

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/b9846f1800394683a19b5a68950f7fe6~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

### 继续处理旧节点
有了上面的 `keyToNewIndexMap` 新节点的索引图，接下来我们就需要遍历旧的节点，寻找旧节点在新节点中对应的位置信息，如果找到则做更新，找不到则移除。
~~~ts
// 记录新节点已更新的数目
let patched = 0
// 记录新节点还有多少个没有更新
const toBePatched = e2 - s2 + 1
// 标记是否有必要进行节点的位置移动
let moved = false
// 标记是否有节点进行了位置移动
let maxNewIndexSoFar = 0
// 记录新节点在旧节点中的位置数组
const newIndexToOldIndexMap = new Array(toBePatched)
// newIndexToOldIndexMap 全部置为 0
for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
// 开始遍历旧子节点
for (i = s1; i <= e1; i++) {
  // prevChild 代表旧节点
  const prevChild = c1[i]
  // 还有多余的旧节点，则删除
  if (patched >= toBePatched) {
    unmount(prevChild, parentComponent, parentSuspense, true)
    continue
  }
  // 记录旧节点在新节点中的位置数组
  let newIndex = keyToNewIndexMap.get(prevChild.key)
  
  // 如果旧节点不存在于新节点中，则删除该节点
  if (newIndex === undefined) {
    unmount(prevChild, parentComponent, parentSuspense, true)
  } else {
    // newIndexToOldIndexMap 中元素为 0 表示着新节点不存在于旧节点中
    newIndexToOldIndexMap[newIndex - s2] = i + 1
    // 默认不移动的话，所有相同节点都是增序排列的
    // 如果有移动，必然出现节点降序的情况
    if (newIndex >= maxNewIndexSoFar) {
      maxNewIndexSoFar = newIndex
    } else {
      moved = true
    }
    // 更新节点
    patch(
      prevChild,
      c2[newIndex] as VNode,
      container,
      null,
      parentComponent,
      parentSuspense,
      isSVG,
      slotScopeIds,
      optimized
    )
    // 记录更新的数量
    patched++
  }
}
~~~
我们简单来总结一下这一步的一些核心操作。

**Step 1：** 定义一个初始长度为新节点数组长度且默认值全为 0 的变量 `newIndexToOldIndexMap`，记录新节点中的元素在旧节点中的位置关系。

**Step 2：** 遍历旧的节点数组，如果旧节点不存在于新节点中，则表示旧的节点其实是多余的节点，需要被移除。

**Step 3：** 如果旧节点存在于新节点数组中，则将它在旧子序列中的位置信息记录到 `newIndexToOldIndexMap` 中，同时根据 `newIndex` 是否大于 `maxNewIndexSoFar` 来判断是否有节点移动。

这里我们结合个例子来说明。假如旧节点信息为 `abc`、新节点为 `cab`，当旧节点遍历到 `c` 节点时，此时的`newIndex` 的值为 `0` 而 `maxNewIndexSoFar` 的值为 `2`。这就意味着此时的 `c` 节点并不是升序位于 `ab` 节点之后的，因此需要标记为有需要移动的节点。

**Step 4：** 更新相同节点。

经过上面的一系列操作，我们最终得到了一个 `newIndexToOldIndexMap` 和一个 `moved` 两个变量 ，这两个变量将在下文的移动和新增节点中被使用。

我们来看一下示例处理后的结果，如下图所示：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/dba3693544114cf19ff3114c8becab61~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

此时 `c`、`d`、`e` 因为是相同节点，所以进行 `patch` 更新，`f` 节点因为不存在于新的索引中，所以被删除。最后得到的 `newIndexToOldIndexMap` 数据结构大致如下：
~~~ts
newIndexToOldIndexMap = [5, 3, 4, 0]
~~~
而且此时的 `moved` 也被标记为 `true`。

### 移动和增加新节点
通过前面的操作，我们完成了对旧节点的移除和更新，那么接下来就是需要进行对节点的移动和新节点的增加了：
~~~ts
// 根据 newIndexToOldIndexMap 求取最长公共子序列
const increasingNewIndexSequence = moved
  ? getSequence(newIndexToOldIndexMap)
  : EMPTY_ARR
// 最长公共子序列尾部索引  
j = increasingNewIndexSequence.length - 1
// 从尾部开始遍历
for (i = toBePatched - 1; i >= 0; i--) {
  const nextIndex = s2 + i
  const nextChild = c2[nextIndex]
  const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor
  // 如果新子序列中的节点在旧子序列中不存在，则新增节点
  if (newIndexToOldIndexMap[i] === 0) {
    patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG)
  } else if (moved) {
    // 如果需要移动且
    // 没有最长递增子序列
    // 当前的节点不在最长递增子序列中
    if (j < 0 || i !== increasingNewIndexSequence[j]) {
      move(nextChild, container, anchor, MoveType.REORDER)
    } else {
      j--
    }
  }
}
~~~
**Step 1：** 这里针对 `moved` 是 `true` 的情况，则会进行求取最长递增子序列的索引操作。

什么是最长递增子序列？简单来说指的是找到一个特定的最长的子序列，并且子序列中的所有元素单调递增。本例中，`newIndexToOldIndexMap = [5, 3, 4, 0]` 最长递增子序列的值为 `[3, 4]`, 对应到 `newIndexToOldIndexMap` 中的索引即 `increasingNewIndexSequence = [1, 2]`。关于具体的算法细节，我们后面再详细探讨。

**Step 2：** 从尾部开始遍历新的子序列，在遍历的过程中，如果新子序列中的节点在旧子序列中不存在，也就是 `newIndexToOldIndexMap[i] === 0`，则新增节点。

**Step 3：** 判断是否存在节点移动的情况，如果存在的话则看节点的索引是不是在最长递增子序列中，如果不在，则将它移动到锚点的前面，否则仅移动最长子序列的尾部指针。

针对上述例子中，新的子序列为 `e,c,d,i`。最长递增子序列的索引为 `[1, 2]`。开始遍历到 `i` 节点时，因为 `newIndexToOldIndexMap[i] = 0` 所以新增，然后遍历到 `c,d` 节点，因为存在于最长子序列中，所以最后 `j = -1`。当遍历到 `e` 节点时，此时 `j = -1` 并且 `e` 节点不存在于最长递增子序列索引中，索引最后一步就是把节点 `e` 进行一次移动：
~~~ts
move(nextChild, container, anchor, MoveType.REORDER)
~~~
其中 `anchor` 是参照物，记录着上一次更新的节点信息，也就是节点 `c` 的信息，所以这里的意思就是将节点 `e` 移动到节点 `c` 前面。

至此，完成了所有节点的增、删、更新、移动的操作，此次操作结果如下：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1dcba8989ae348e6af85333a22280da2~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

### 最长递增子序列
求最长递增子序列是 LeetCode 上的一道经典算法题，原题：[300. 最长递增子序列](https://leetcode.cn/problems/longest-increasing-subsequence/)。

什么是上升子序列？简单来说指的是找到一个特定的最长的子序列，并且子序列中的所有元素单调递增。

假设我们的序列为 `[5, 3, 4, 9]` ，那么最长的递增子序列是 `[3, 4]`。

那么如何找到最长的递增子序列呢？`Vue` 内部使用的是一套 `贪心 + 二分查找` 的算法，关于贪心和二分查找的解释如下。
1. 贪心算法：贪心算法在每一步都做出了当时看起来最佳的选择，也就是说，它总是做出局部最优的选择，寄希望这样的选择能导致全局最优解。[leetCode 455. 分发饼干](https://leetcode.cn/problems/assign-cookies/description/)。
2. 二分查找：每次的查找都是和区间的中间元素对比，将待查找的区间缩小为一半，直到找到目标元素，或者区间被缩小为 0（没找到）。[leetCode 704. 二分查找](https://leetcode.cn/problems/binary-search/)。

那么这里我们再结合一下贪心算法的思想，在求取最长上升子序列时，对于同样长度是二的序列 `[2, 3]` 一定比 `[2, 5]` 好，因为要想让子序列尽可能地长，那么上升得尽可能慢，这样潜力更大。

所以我们可以创建一个临时数组，用来保存最长的递增子序列，如果当前遍历的元素大于临时数组中的最后一个元素（也就是临时数组的最大值）时，那么将其追加到临时数组的尾部，否则，查找临时数组，找到第一个大于该元素的数并替换它，这样就保证了临时数组上升时最慢的。因为是单调递增的序列，我们也可以在临时数组中用二分查找，降低时间复杂度。

以输入序列 `[1, 4, 5, 2, 8, 7, 6, 0]` 为例，根据上面算法的描述，我们大致可以得到如下的计算步骤：
1. `[1]`
2. `[1, 4]`
3. `[1, 4, 5]`
4. `[1, 2, 5]`
5. `[1, 2, 5, 8]`
6. `[1, 2, 5, 7]`
7. `[0, 2, 5, 6]`

可以看到，如果单纯地按照上述算法的模式，得到的结果的长度虽然一致，但位置顺序和值并不符合预期，预期结果是 `[1, 4, 5, 6]`。那么在 `Vue` 中是如何解决这个顺序和值错乱的问题呢？

我们一起来看看源码的实现：
~~~ts
function getSequence (arr) {
  const p = arr.slice()
  const result = [0]
  let i, j, u, v, c
  const len = arr.length
  for (i = 0; i < len; i++) {
    const arrI = arr[i]
    // 排除等于 0 的情况
    if (arrI !== 0) {
      j = result[result.length - 1]
      // 与最后一项进行比较
      if (arr[j] < arrI) {
        // 存储在 result 更新前的最后一个索引的值
        p[i] = j
        result.push(i)
        continue
      }
      u = 0
      v = result.length - 1
      // 二分搜索，查找比 arrI 小的节点，更新 result 的值
      while (u < v) {
        // 取整得到当前位置
        c = ((u + v) / 2) | 0
        if (arr[result[c]] < arrI) {
          u = c + 1
        }
        else {
          v = c
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          // 正确的结果
          p[i] = result[u - 1]
        }
        // 有可能替换会导致结果不正确，需要一个新数组 p 记录正确的结果
        result[u] = i
      }
    }
  }
  u = result.length
  v = result[u - 1]

  // 回溯数组 p，找到最终的索引
  while (u-- > 0) {
    result[u] = v
    v = p[v]
  }
  return result
}
~~~
其中 `result` 中存储的是长度为 `i` 的递增子序列最小末尾值的索引。`p` 是来存储在每次更新 `result` 前最后一个索引的值，并且它的 `key` 是这次要更新的 `result` 值：
~~~ts
 // 插入
 p[i] = j
 result.push(i)
 // 替换
 p[i] = result[u - 1]
 result[u] = i
~~~
对于上述的实例，我们在进行最后一步回溯数组 `p` 之前，得到的数据机构如下：
~~~ts
result = [ 0, 3, 2, 6 ] // => [0, 2, 5, 6]

p = [1, 0, 1, 0, 2, 2, 2]
~~~
从 `result` 最后一个元素 `6` 对应的索引 `6` 开始回溯，可以看到 `p[6] = 2`，`p[2] = 1`，`p[1] = 0`，所以通过对 `p` 的回溯，得到最终的 `result` 值是 `[0, 1, 2, 6]`，也就找到最长递增子序列的最终索引了。

### 番外
至此我们介绍完了关于 `Vue3` 的 `diff` 算法。接下来小伙伴们可以思考两个问题：
1. 为什么 `Vue 3` 不再沿用之前 `Vue 2` 的双端 `diff` 算法而改成现在的这种模式呢？
2. 我们使用 `v-for` 编写列表时为什么不建议使用 `index` 作为 `key`?

#### 解答第一个问题
在 `Vue2` 里 `diff` 会进行：
1. 头和头比
2. 尾和尾比
3. 头和尾比
4. 尾和头比
5. 都没有命中的对比

在 `Vue3` 里 `diff` 会进行：
1. 头和头比
2. 尾和尾比
3. 基于最长递增子序列进行移动/添加/删除

在 `Vue2` 中，头尾比对和尾头比对就算发现新老节点是属于 `sameVnode` 时还是需要进行节点位置的移动。另外在没有命中 `1-4` 步骤的情况下进行新旧节点的映射关系查找再进行位置移动也不是性能最优的方式。最优的方式本小节已经讲解到，就是基于最长递增子序列进行移动/添加/删除。

在 `Vue3` 中，基于最长递增子序列进行移动/添加/删除 的`diff`更新，已经涵盖了 `Vue2` 的 `3-5` 步骤，而且性能是最优解。所以相对于 `Vue2`，`Vue3` 在`diff`算法方面做了很大的优化工作。

#### 解答第二个问题
[参考这篇文章](https://juejin.cn/post/6844904113587634184#heading-9)


## 响应式原理:基于 Proxy 的响应式





















## Vue2原理
- snabbdom
  <br>
  <br>
  著名的虚拟dom库, diff算法的鼻祖, vue源码借鉴了 [snabbdom](https://github.com/snabbdom/snabbdom)
### h函数
用来生成虚拟节点( vnode )
可嵌套, 一个子元素可以直接当参数传入, 多个需要用数组包裹

~~~js
h('a', { props: { href: 'http://www.baidu.com' } }, '高江华')
//生成的虚拟节点
{
  "sel": "a",
  "data": { props: { href: 'http://www.baidu.com' } },
  "text": "高江华"
}
//真实的DOM节点
<a href="http://www.baidu.com">高江华</a>
~~~

示例 ( 基于snabbdom ) :

~~~js
//创建patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule])
//创建虚拟节点
const myVnode = h('a', { props: { href: 'http://www.baidu.com } }, '高江华')
//让虚拟节点上树
const container = document.getElementById('container')
patch(container, myVnode)
~~~
简易版手写虚拟DOM:
~~~js
function vnode(sel, data, children, text, elm) {
  return {
    sel, data, children, text, elm
  }
}
function h(sel, data, c) {
  if (arguments.length !== 3){
    throw new Error('必须传入3个参数')
  }
  if (typeof c == 'string' || typeof c == 'number'){
    return vnode(sel, data, undefined, c, undefined)
  }else if (Array.isArray(c)){
    let children = []
    for (let i = 0; i < c.length; i++){
      if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel')))
        throw new Error('传入的数组参数中有项不是h函数')
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  }else if (typeof c == 'object' && c.hasOwnProperty('sel')){
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  }else {
    throw new Error('传入的第三个参数不对')
  }
}
let myVnode = h('div', {}, [
  h('ul', {}, [
    h('li', {}, '苹果'),
    h('li', {}, '香蕉'),
    h('li', {}, '桔子'),
    h('li', {}, [
      h('p', {}, '123'),
      h('p', {}, '456')
    ]),
  ])
])
console.log(myVnode)
~~~
###  DIFF算法

- 最小量更新, key很重要, key是这个节点的唯一标识, 告诉diff算法, 在更改前后它们是同一个DOM节点

- 只有是同一个虚拟节点,才进行精细化比较, 否则暴力删旧插新

- 选择器相同且key相同就是同一虚拟节点

- 只进行同层比较, 不会进行跨层比较, 即使同一虚拟节点,但是跨层了也不会精细化比较, 只会删旧插新

- 四种命中查找: 设置四个指针 ( 新前 旧前 新后 旧后 )

  1. 新前与旧前
  2. 新后与旧后
  3. 新后与旧前 ( 此种发生了, 涉及移动节点, 那么新前指向的节点, 移动到旧后之后 )
  4. 新前与旧后 ( 此种发生了, 涉及移动节点, 那么新前指向的节点, 移动到旧前之前 )

  注: 命中一种就不再进行命中判断, 若没命中则继续顺序使用命中判断, 若都未命中则循环旧子节点查找有没有对应的新子节点

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210105173343133.png)

精细化比较如下:

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210107111327461.png)
简易版diff算法:
~~~js
function vnode(sel, data, children, text, elm) {
  const key = data.key
  return {
    sel, data, children, text, elm, key
  }
}
function h(sel, data, c) {
  if (arguments.length !== 3){
    throw new Error('必须传入3个参数')
  }
  if (typeof c == 'string' || typeof c == 'number'){
    return vnode(sel, data, undefined, c, undefined)
  }else if (Array.isArray(c)){
    let children = []
    for (let i = 0; i < c.length; i++){
      if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel')))
        throw new Error('传入的数组参数中有项不是h函数')
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  }else if (typeof c == 'object' && c.hasOwnProperty('sel')){
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  }else {
    throw new Error('传入的第三个参数不对')
  }
}
function createElement(vnode) {
  let domNode = document.createElement(vnode.sel)
  if (vnode.text != '' && (vnode.children == undefined || vnode.children.length == 0)){
    domNode.innerText = vnode.text
    vnode.elm = domNode
  }else if (Array.isArray(vnode.children) && vnode.children.length > 0){
    for (let i = 0; i < vnode.children.length; i++){
      let ch = vnode.children[i]
      let chdom = createElement(ch)
      domNode.appendChild(chdom)
    }
  }
  vnode.elm = domNode
  return vnode.elm
}
function checkSameVnode(a, b) {
  return a.sel == b.sel && a.key == b.key
}
function updateChildren(parentElm, oldCh, newCh){
  //旧前
  let oldStartIdx = 0
  //新前
  let newStartIdx = 0
  //旧后
  let oldEndIdx = oldCh.length - 1
  //新后
  let newEndIdx = newCh.length - 1
  //旧前节点
  let oldStartVnode = oldCh[0]
  //旧后节点
  let oldEndVnode = oldCh[oldEndIdx]
  //新前节点
  let newStartVnode = newCh[0]
  //新后节点
  let newEndVnode = newCh[newEndIdx]
  //标杆
  let keyMap = null
  //循环精细化比较开始
  while (oldStartIdx <= oldEndIdx && newSrartIdx <= newEndIdx) {
    if (oldStartVnode === null || oldCh[oldStartIdx] === undefined){
      oldStartVnode = oldCh[++oldStartIdx]
    }else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined){
      oldEndVnode = oldCh[--oldEndIdx]
    }else if (newStartVnode === null || newCh[newStartIdx] === undefined){
      newStartVnode = newCh[++newStartIdx]
    }else if (newEndVnode === null || newCh[newEndIdx] === undefined){
      newEndVnode = newCh[--newEndIdx]
    }else if (checkSameVnode(oldStartVnode, newSrartIdx)){
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newSrartIdx]
    }else if (checkSameVnode(oldEndVnode,newEndVnode)){
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    }else if (checkSameVnode(oldStartVnode,newEndVnode)){
      patchVnode(oldStartVnode, newEndVnode)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling())
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    }else if (checkSameVnode(oldEndVnode,newStartVnode)){
      patchVnode(oldEndVnode,newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm.nextSibling())
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    }else {
      //四种命中都未命中,则制作keyMap映射对象
      keyMap = {}
      if (!keyMap){
        //从oldStartIdx开始, 到oldEndIdx结束, 创建keyMap映射对象
        for (let i = oldStartIdx; i <= oldEndIdx; i++){
          const key = oldCh[i].key
          if (key !== undefined){
            keyMap[key] = i
          }
        }
      }
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld === undefined){
        //是全新的项, 被加入的项(就是newStartVnode)现不是真正的DOM节点
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }else {
        //不是全新的项,需要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  //判断还有没有剩余的,start比end小
  if (newStartIdx <= newEndIdx){
    //new还有剩余节点没处理
    //const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    for (let i = newStartIdx; i <= newEndIdx; i++){
      //insertBefore方法可以自动识别null, 如果是null就会自动排到队尾去, 和appendChild是一致的
      parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm)
    }
  }else if (oldStartIdx <= oldEndIdx){
    //old还有剩余节点没处理
    for (let i = oldStartIdx; i <= oldEndIdx; i++){
      if (oldCh[i]){
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}
function patchVnode(oldVnode, newVnode) {
  if (oldVnode === newVnode) return ;
  if (newVnode.text != undefined && newVnode.children == undefined || newVnode.children.length == 0){
    if (newVnode.text != oldVnode.text){
      oldVnode.elm.innerText = newVnode.text
    }
  }else {
    if (oldVnode.children != undefined && oldVnode.children.length > 0){
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    }else {
      oldVnode.elm.innerText = ''
      for (let i = 0; i < newVnode.children.length; i++){
        let dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }
    }
  }
}
function patch(oldVnode, newVnode){
  if (oldVnode.sel == '' || oldVnode.sel == undefined){
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  }
  if (oldVnode.key == newVnode.key && oldVnode.sel == oldVnode.sel){
    patchVnode(oldVnode, newVnode)
  }else {
    let newVnodeElm = createElement(newVnode)
    if (oldVnode.elm && newVnodeElm) {
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
let myVnode1 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'E'}, 'E'),
])
const container = document.getElementById('container')
const btn = document.getElementById('btn')
patch(container, myVnode1)
const myVnode2 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'E'}, 'E'),
  h('li', {key: 'F'}, 'F'),
  h('li', {key: 'G'}, 'G'),
])
btn.onclick = function(){
  patch(myVnode1, myVnode2)
}
~~~
