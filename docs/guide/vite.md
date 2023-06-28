# Vite
[官方文档](https://cn.vitejs.dev/)

## 简介
Vite（法语意为 "快速的"，发音 /vit/，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

* 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。

* 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

Vite 意在提供开箱即用的配置，同时它的 插件 API 和 JavaScript API 带来了高度的可扩展性，并有完整的类型支持。


## 快速上手
- 环境搭建
  * 前往[Node.js官网](https://nodejs.org/)安装Node环境，推荐 12.0.0 及以上版本，如果低于这个版本，推荐使用 nvm 工具切换 Node.js 版本。
  * 安装包管理工具
    ~~~shell
    npm i -g pnpm   # 推荐使用 pnpm 做包管理器
    pnpm config set registry https://registry.npmmirror.com/    # 设置国内镜像源
    ~~~
- 项目初始化
  ~~~shell
  pnpm create vite
  ~~~
  交互流程：
  * 输入项目名称；
  * 选择前端框架；
  * 选择开发语言。
  ~~~shell
  # 进入项目目录
  cd vite-project
  # 安装依赖
  pnpm install
  # 启动项目
  pnpm run dev
  ~~~
- 初识配置文件
    ~~~ts
    // vite.config.ts
    import { defineConfig } from 'vite'
    // 引入 path 包注意两点:
    // 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
    // 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
    import path from 'path'
    import react from '@vitejs/plugin-react'    // 官方 react 插件
    
    export default defineConfig({
      root: path.join(__dirname, 'src'),  // 手动指定项目根目录位置
      plugins: [react()]    // 注入 react 插件来提供 React 项目编译和热更新的功能
    })
    ~~~
## 接入CSS工程化
- 原生css存在的问题
  1. 开发体验欠佳。比如原生 CSS 不支持选择器的嵌套。
  2. 样式污染问题。如果出现同样的类名，很容易造成不同的样式互相覆盖和污染。
  3. 浏览器兼容问题。为了兼容不同的浏览器，我们需要对一些属性(如transition)加上不同的浏览器前缀，比如 -webkit-、-moz-、-ms-、-o-，意味着开发者要针对同一个样式属性写很多的冗余代码。
  4. 打包后的代码体积问题。如果不用任何的 CSS 工程化方案，所有的 CSS 代码都将打包到产物中，即使有部分样式并没有在代码中使用，导致产物体积过大。


- 解决方案
  1. CSS 预处理器：主流的包括Sass/Scss、Less和Stylus。这些方案各自定义了一套语法，让 CSS 也能使用嵌套规则，甚至能像编程语言一样定义变量、写条件判断和循环语句，大大增强了样式语言的灵活性，解决原生 CSS 的开发体验问题。
  2. CSS Modules：能将 CSS 类名处理成哈希值，这样就可以避免同名的情况下样式污染的问题。
  3. CSS 后处理器PostCSS，用来解析和处理 CSS 代码，可以实现的功能非常丰富，比如将 px 转换为 rem、根据目标浏览器情况自动加上类似于--moz--、-o-的属性前缀等等。
  4. CSS in JS 方案，主流的包括emotion、styled-components等等，顾名思义，这类方案可以实现直接在 JS 中写样式代码，基本包含CSS 预处理器和 CSS Modules 的各项优点，非常灵活，解决了开发体验和全局样式污染的问题。
  5. CSS 原子化框架，如Tailwind CSS、Windi CSS，通过类名来指定样式，大大简化了样式写法，提高了样式开发的效率，主要解决了原生 CSS 开发体验的问题。


- CSS 预处理器
  <br>
  <br>
  Vite 底层会调用 CSS 预处理器的官方库进行编译，而 Vite 为了实现按需加载，并没有内置这些工具库，而是让用户根据需要安装。因此，我们首先安装 Sass 的官方库，安装命令如下
  ~~~shell
  pnpm i sass -D
  ~~~

- 配置自动注入全局CSS
  ~~~ts
    // vite.config.ts
    import { normalizePath } from 'vite';
    // 如果类型报错，需要安装 @types/node: pnpm i @types/node -D
    import path from 'path';
    
    // 全局 scss 文件的路径
    // 用 normalizePath 解决 window 下的路径问题
    const variablePath = normalizePath(path.resolve('./src/variable.scss'));
    
    
    export default defineConfig({
      // css 相关的配置
      css: {
        preprocessorOptions: {
          scss: {
          // additionalData 的内容会在每个 scss 文件的开头自动注入
          additionalData: `@import "${variablePath}";`
          }
        }
      }
    })
  ~~~
  
- CSS Modules
  <br>
  <br>
  CSS Modules 在 Vite 也是一个开箱即用的能力，Vite 会对后缀带有.module的样式文件自动应用 CSS Modules。
  ~~~tsx
  // index.tsx
  import styles from './index.module.scss';
  export function Header() {
    return <p className={styles.header}>This is Header</p>
  };
  ~~~

- 自定义 CSS Modules 的哈希类名
  ~~~ts
  // vite.config.ts
  export default {
    css: {
      modules: {
        // 一般我们可以通过 generateScopedName 属性来对生成的类名进行自定义
        // 其中，name 表示当前文件名，local 表示类名
        generateScopedName: "[name]__[local]___[hash:base64:5]"
      },
      preprocessorOptions: {
      // 省略预处理器配置
      }
    }
  }
  ~~~

- PostCSS
  <br>
  <br>
  一般你可以通过 postcss.config.js 来配置 postcss ，不过在 Vite 配置文件中已经提供了 PostCSS 的配置入口，我们可以直接在 Vite 配置文件中进行操作。
  ~~~shell
  # 安装 autoprefixer 插件
  # 插件主要用来自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题
  pnpm i autoprefixer -D
  ~~~
  在 Vite 中 配置该插件
  ~~~ts
  // vite.config.ts 增加如下的配置
  import autoprefixer from 'autoprefixer';

  export default {
    css: {
      // 进行 PostCSS 配置
      postcss: {
        plugins: [
          autoprefixer({
            // 指定目标浏览器
            overrideBrowserslist: ['Chrome > 40', 'ff > 31', 'ie 11']
          })
        ]
      }
    }
  }
  ~~~
  常见的插件还包括:
  * [postcss-pxtorem](https://github.com/cuth/postcss-pxtorem)： 用来将 px 转换为 rem 单位，在适配移动端的场景下很常用。
  * [postcss-preset-env](https://github.com/csstools/postcss-preset-env): 通过它，你可以编写最新的 CSS 语法，不用担心兼容性问题。
  * [cssnano](https://github.com/cssnano/cssnano): 主要用来压缩 CSS 代码，跟常规的代码压缩工具不一样，它能做得更加智能，比如提取一些公共样式进行复用、缩短一些常见的属性值等等。
  
  更多插件请访问：[PostCss插件市场](https://www.postcss.parts/)


- CSS In JS
  * 社区中有两款主流的CSS In JS 方案: styled-components和emotion。
  * 对于 CSS In JS 方案，在构建侧我们需要考虑选择器命名问题、DCE(Dead Code Elimination 即无用代码删除)、代码压缩、生成 SourceMap、服务端渲染(SSR)等问题，而styled-components和emotion已经提供了对应的 babel 插件来解决这些问题，我们在 Vite 中要做的就是集成这些 babel 插件。
  * 上述的两种主流 CSS in JS 方案在 Vite 中集成方式如下:
    ~~~ts
    // vite.config.ts
    import { defineConfig } from 'vite'
    import react from '@vitejs/plugin-react'
    
    // https://vitejs.dev/config/
    export default defineConfig({
      plugins: [
        react({
          babel: {
            // 加入 babel 插件
            // 以下插件包都需要提前安装
            // 当然，通过这个配置你也可以添加其它的 Babel 插件
            plugins: [
              // 适配 styled-component
              "babel-plugin-styled-components",
              // 适配 emotion
              "@emotion/babel-plugin"
            ]
          },
          // 注意: 对于 emotion，需要单独加上这个配置
          // 通过 `@emotion/react` 包编译 emotion 中的特殊 jsx 语法
          jsxImportSource: "@emotion/react"
        })
      ]
    })
    ~~~
    

- CSS 原子化框架
  <br>
  <br>
  1. Windi CSS 接入
     ~~~shell   
     pnpm i windicss vite-plugin-windicss -D
     ~~~
     在配置文件中加入
     ~~~ts
     // vite.config.ts
     import windi from "vite-plugin-windicss";
        
     export default {
       plugins: [
       // 省略其它插件
         windi()
       ]
     }
     ~~~
     接着要注意在src/main.tsx中引入一个必需的 import 语句
     ~~~tsx
     // main.tsx
     // 用来注入 Windi CSS 所需的样式，一定要加上！
     import "virtual:windi.css";
     ~~~
     测试：
     ~~~tsx
     // src/components/Header/index.tsx
     import { devDependencies } from "../../../package.json";
    
     export function Header() {
       return (
         <div className="p-20px text-center">
           <h1 className="font-bold text-2xl mb-2">
             vite version: {devDependencies.vite}
           </h1>
         </div>
       );
     }
     ~~~
     高级功能
     ~~~ts
     import { defineConfig } from "vite-plugin-windicss";

     export default defineConfig({
       // 开启 attributify 属性化， 可以用 props 的方式去定义样式属性。
       attributify: true,
     });
     ~~~
     演示
     ~~~tsx
     <button 
      bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600"
      text="sm white"
      font="mono light"
      p="y-2 x-4"
      border="2 rounded blue-200"
     >
     Button
     </button>
     ~~~
     使用 attributify 的时候需要注意类型问题，你需要添加types/shim.d.ts来增加类型声明，以防类型报错:
     ~~~ts
     import { AttributifyAttributes } from 'windicss/types/jsx';

     declare module 'react' {
        type HTMLAttributes<T> = AttributifyAttributes;
     }
     ~~~
     shortcuts 用来封装一系列的原子化能力，尤其是一些常见的类名集合，配置如下：
     ~~~ts
     //windi.config.ts
     import { defineConfig } from "vite-plugin-windicss";
    
     export default defineConfig({
        attributify: true,
        shortcuts: {
            "flex-c": "flex justify-center items-center",
        }
     });
     ~~~
     演示
     ~~~tsx
     <div className="flex-c"></div>
     <!-- 等同于下面这段 -->
     <div className="flex justify-center items-center"></div>
     ~~~
     
  2. Tailwind CSS
     ~~~shell
     pnpm install -D tailwindcss postcss autoprefixer
     ~~~
     新建两个配置文件tailwind.config.js和postcss.config.js
     ~~~ts
     // tailwind.config.js
     module.exports = {
       content: [
         "./index.html",
         "./src/**/*.{vue,js,ts,jsx,tsx}",
       ],
       theme: {
         extend: {},
       },
       plugins: [],
     }
     ~~~
     ~~~ts
     // postcss.config.js
     // 从中你可以看到，Tailwind CSS 的编译能力是通过 PostCSS 插件实现的
     // 而 Vite 本身内置了 PostCSS，因此可以通过 PostCSS 配置接入 Tailwind CSS
     // 注意: Vite 配置文件中如果有 PostCSS 配置的情况下会覆盖掉 postcss.config.js 的内容!
     module.exports = {
       plugins: {
         tailwindcss: {},
         autoprefixer: {},
       },
     }
     ~~~
     接着在项目的入口 CSS 中引入必要的样板代码:
     ~~~scss
     @tailwind base;
     @tailwind components;
     @tailwind utilities;
     ~~~
     演示
     ~~~tsx
     // App.tsx
     import logo from "./logo.svg";
     import "./App.css";
    
     function App() {
       return (
         <div>
           <header className="App-header">
             <img src={logo} className="w-20" alt="logo" />
             <p className="bg-red-400">Hello Vite + React!</p>
           </header>
         </div>
       );
     }
    
     export default App;
     ~~~

## 代码规范
- ESLint
  ~~~shell
  # 安装
  pnpm i eslint -D
  ~~~
  ~~~shell
  # 初始化
  npx eslint --init
  ~~~
  ~~~shell
  # 安装依赖
  pnpm i eslint-plugin-react@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest -D
  ~~~
- 核心配置解读
  <br>
  <br>
  * parser - 解析器
    + ESLint 底层默认使用 Espree来进行 AST 解析，这个解析器目前已经基于 Acron 来实现，虽然说 Acron 目前能够解析绝大多数的 ECMAScript 规范的语法，但还是不支持 TypeScript ，因此需要引入其他的解析器完成 TS 的解析。
    + 社区提供了@typescript-eslint/parser这个解决方案，专门为了 TypeScript 的解析而诞生，将 TS 代码转换为 Espree 能够识别的格式(即 Estree 格式)，然后在 Eslint 下通过Espree进行格式检查， 以此兼容了 TypeScript 语法。
      <br>
      <br>
  * parserOptions - 解析器选项

    这个配置可以对上述的解析器进行能力定制，默认情况下 ESLint 支持 ES5 语法，你可以配置这个选项，具体内容如下:
    - ecmaVersion: 这个配置和 Acron 的 ecmaVersion 是兼容的，可以配置 ES + 数字(如 ES6)或者ES + 年份(如 ES2015)，也可以直接配置为latest，启用最新的 ES 语法。
    - sourceType: 默认为script，如果使用 ES Module 则应设置为module。
    - ecmaFeatures: 为一个对象，表示想使用的额外语言特性，如开启 jsx。
      <br>
      <br>
  * rules - 具体代码规则

    rules 配置即代表在 ESLint 中手动调整哪些代码规则，比如禁止在 if 语句中使用赋值语句这条规则可以像如下的方式配置:
    ~~~ts
    // .eslintrc.js
    module.exports = {
      // 其它配置省略
      rules: {
        // key 为规则名，value 配置内容
        "no-cond-assign": ["error", "always"]
      }
    }
    ~~~
    在 rules 对象中，key 一般为规则名，value 为具体的配置内容，在上述的例子中我们设置为一个数组，数组第一项为规则的 ID，第二项为规则的配置。

    这里重点说一说规则的 ID，它的语法对所有规则都适用，你可以设置以下的值:
    * off 或 0: 表示关闭规则。
    * warn 或 1: 表示开启规则，不过违背规则后只抛出 warning，而不会导致程序退出。
    * error 或 2: 表示开启规则，不过违背规则后抛出 error，程序会退出。
    
    具体的规则配置可能会不一样，有的是一个字符串，有的可以配置一个对象，你可以参考 [ESLint 官方文档](https://zh-hans.eslint.org/)。

    当然，你也能直接将 rules 对象的 value 配置成 ID，如: "no-cond-assign": "error"。
  <br>
  <br>
  * plugins
  
    我们需要通过添加 ESLint 插件来增加一些特定的规则，比如添加@typescript-eslint/eslint-plugin 来拓展一些关于 TS 代码的规则，如下代码所示:
    ~~~ts
    // .eslintrc.js
    module.exports = {
      // 添加 TS 规则，可省略`eslint-plugin`
      plugins: ['@typescript-eslint']
    }
    ~~~
    值得注意的是，添加插件后只是拓展了 ESLint 本身的规则集，但 ESLint 默认并没有开启这些规则的校验！如果要开启或者调整这些规则，你需要在 rules 中进行配置，如:
    ~~~ts
    // .eslintrc.js
    module.exports = {
      // 开启一些 TS 规则
      rules: {
        '@typescript-eslint/ban-ts-comment': 'error',
        '@typescript-eslint/no-explicit-any': 'warn',
      }
    }
    ~~~
    <br>
  * extends - 继承配置

    extends 相当于继承另外一份 ESLint 配置，可以配置为一个字符串，也可以配置成一个字符串数组。主要分如下 3 种情况:
    + 从 ESLint 本身继承；
    + 从类似 eslint-config-xxx 的 npm 包继承；
    + 从 ESLint 插件继承。
    ~~~ts
    // .eslintrc.js
    module.exports = {
      "extends": [
        // 第1种情况
        "eslint:recommended",
        // 第2种情况，一般配置的时候可以省略 `eslint-config`
        "standard",
        // 第3种情况，可以省略包名中的 `eslint-plugin`
        // 格式一般为: `plugin:${pluginName}/${configName}`
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
      ]
    }
    ~~~
    有了 extends 的配置，对于之前所说的 ESLint 插件中的繁多配置，我们就不需要手动一一开启了，通过 extends 字段即可自动开启插件中的推荐规则:
    ~~~js
    extends: ["plugin:@typescript-eslint/recommended"]
    ~~~
    <br>
  * env 和 globals

    这两个配置分别表示运行环境和全局变量，在指定的运行环境中会预设一些全局变量，比如:
    ~~~ts
    // .eslint.js
    module.export = {
      "env": {
        "browser": "true",
        "node": "true"
      }
    }
    ~~~
    指定上述的 env 配置后便会启用浏览器和 Node.js 环境，这两个环境中的一些全局变量(如 window、global 等)会同时启用。

    有些全局变量是业务代码引入的第三方库所声明，这里就需要在globals配置中声明全局变量了。每个全局变量的配置值有 3 种情况:
    + "writable"或者 true，表示变量可重写；
    + "readonly"或者false，表示变量不可重写；
    + "off"，表示禁用该全局变量。
  
    举例如下：
    ~~~ts
    // .eslintrc.js
    module.exports = {
      "globals": {
        // 不可重写
        "$": false,
        "jQuery": false
      }
    }
    ~~~

- Prettier
<br>
<br>
  ESLint 的主要优势在于代码的风格检查并给出提示，而在代码格式化这一块 Prettier 做的更加专业，因此我们经常将 ESLint 结合 Prettier 一起使用。
  ~~~shell
  # 安装
  pnpm i prettier -D
  ~~~  
  ~~~ts
  // 新建.prettierrc.js配置文件
  module.exports = {
    printWidth: 80, //一行的字符数，如果超过会进行换行，默认为80
    tabWidth: 2, // 一个 tab 代表几个空格数，默认为 2 个
    useTabs: false, //是否使用 tab 进行缩进，默认为false，表示用空格进行缩减
    singleQuote: true, // 字符串是否使用单引号，默认为 false，使用双引号
    semi: true, // 行尾是否使用分号，默认为true
    trailingComma: "none", // 是否使用尾逗号
    bracketSpacing: true // 对象大括号直接是否有空格，默认为 true，效果：{ a: 1 }
  };
  ~~~
  将Prettier集成到现有的ESLint工具中，首先安装两个工具包
  ~~~shell
  # eslint-config-prettier用来覆盖 ESLint 本身的规则配置
  # eslint-plugin-prettier则是用于让 Prettier 来接管eslint --fix即修复代码的能力。
  pnpm i eslint-config-prettier eslint-plugin-prettier -D
  ~~~
  在 .eslintrc.js 配置文件中接入 prettier 的相关工具链，最终的配置代码如下所示
  ~~~ts
  // .eslintrc.js
  module.exports = {
    env: {
      browser: true,
      es2021: true
    },
    extends: [
      "eslint:recommended",
      "plugin:react/recommended",
      "plugin:@typescript-eslint/recommended",
      // 1. 接入 prettier 的规则
      "prettier",
      "plugin:prettier/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaFeatures: {
        jsx: true
      },
      ecmaVersion: "latest",
      sourceType: "module"
    },
    // 2. 加入 prettier 的 eslint 插件
    plugins: ["react", "@typescript-eslint", "prettier"],
    rules: {
      // 3. 注意要加上这一句，开启 prettier 自动修复的功能
      "prettier/prettier": "error",
      quotes: ["error", "single"],
      semi: ["error", "always"],
      "react/react-in-jsx-scope": "off"
    }
  }
  ~~~
  package.json 中定义一个脚本:
  ~~~json
  {
    "scripts": {
      // 省略已有 script
      "lint:script": "eslint --ext .js,.jsx,.ts,.tsx --fix --quiet ./src",
    }
  }
  ~~~
  执行命令
  ~~~shell
  pnpm run lint:script
  ~~~
  这样我们就完成了 ESLint 的规则检查以及 Prettier 的自动修复。不过每次执行这个命令未免会有些繁琐，我们可以在VSCode中安装ESLint和Prettier这两个插件，并且在设置区中开启Format On Save
  >接下来在你按Ctrl + S保存代码的时候，Prettier 便会自动帮忙修复代码格式。

  <br>
- Vite 中接入 ESLint
  <br><br>
  我们可以通过 Vite 插件的方式在开发阶段进行 ESLint 扫描，以命令行的方式展示出代码中的规范问题，并能够直接定位到原文件。
  ~~~shell
  # 安装插件
  pnpm i vite-plugin-eslint -D
  ~~~  
  ~~~ts
  // 注入插件
  // vite.config.ts
  import viteEslint from 'vite-plugin-eslint';

  // 具体配置
  {   
    plugins: [
      // 省略其它插件
      viteEslint(),
    ]
  }
  ~~~
  > 由于这个插件采用另一个进程来运行 ESLint 的扫描工作，因此不会影响 Vite 项目的启动速度，这个大家不用担心。
  
  <br>
- Stylelint
  <br><br>
  Stylelint 主要专注于样式代码的规范检查，内置了 170 多个 CSS 书写规则，支持 CSS 预处理器(如 Sass、Less)，提供插件化机制以供开发者扩展规则，已经被 Google、Github 等大型团队投入使用。与 ESLint 类似，在规范检查方面，Stylelint 已经做的足够专业，而在代码格式化方面，我们仍然需要结合 Prettier 一起来使用。
  ~~~shell
  # 安装套件依赖
  pnpm i stylelint stylelint-prettier stylelint-config-prettier stylelint-config-recess-order stylelint-config-standard stylelint-config-standard-scss -D
  ~~~
  ~~~ts
  // .stylelintrc.js
  module.exports = {
    // 注册 stylelint 的 prettier 插件
    plugins: ['stylelint-prettier'],
    // 继承一系列规则集合
    extends: [
      // standard 规则集合
      'stylelint-config-standard',
      // standard 规则集合的 scss 版本
      'stylelint-config-standard-scss',
      // 样式属性顺序规则
      'stylelint-config-recess-order',
      // 接入 Prettier 规则
      'stylelint-config-prettier',
      'stylelint-prettier/recommended'
    ],
    // 配置 rules
    rules: {
      // 开启 Prettier 自动格式化功能
      'prettier/prettier': true
    }
  };
  ~~~
  可以发现 Stylelint 的配置文件和 ESLint 还是非常相似的，常用的plugins、extends和rules属性在 ESLint 同样存在，并且与 ESLint 中这三个属性的功能也基本相同。不过需要强调的是在 Stylelint 中 rules 的配置会和 ESLint 有些区别，对于每个具体的 rule 会有三种配置方式:
  * null，表示关闭规则。
  * 一个简单值(如 true，字符串，根据不同规则有所不同)，表示开启规则，但并不做过多的定制。
  * 一个数组，包含两个元素，即[简单值，自定义配置]，第一个元素通常为一个简单值，第二个元素用来进行更精细化的规则配置。
  <br>
  <br>
  
  package.json 中，增加如下的 scripts 配置
  ~~~json
  {
    "scripts": {
      // 整合 lint 命令
      "lint": "npm run lint:script && npm run lint:style",
      // stylelint 命令
      "lint:style": "stylelint --fix \"src/**/*.{css,scss}\""
    }
  }
  ~~~
  执行pnpm run lint:style即可完成样式代码的规范检查和自动格式化。当然，你也可以在 VSCode 中安装Stylelint插件，这样能够在开发阶段即时感知到代码格式问题，提前进行修复。
  <br>
  <br>
  当然，我们也可以直接在 Vite 中集成 Stylelint。社区中提供了 Stylelint 的 Vite 插件，实现在项目开发阶段提前暴露出样式代码的规范问题。我们来安装一下这个插件:
  ~~~shell
  # Vite 2.x
  pnpm i @amatlash/vite-plugin-stylelint -D
  # Vite 3.x 及以后的版本
  pnpm i vite-plugin-stylelint -D
  ~~~
  然后在 Vite 配置文件中添加如下的内容:
  ~~~ts
  // vite.config.js
  import viteStylelint from '@amatlash/vite-plugin-stylelint';
  // 注意: Vite 3.x 以及以后的版本需要引入 vite-plugin-stylelint

  // 具体配置
  {
    plugins: [
      // 省略其它插件
      viteStylelint({
        // 对某些文件排除检查
        exclude: /windicss|node_modules/
      }),
    ]
  }
  ~~~
  <br>
- Husky + lint-staged 的 Git 提交工作流集成
  <br>
  <br>
  保证规范问题能够被完美解决，我们可以在代码提交的时候进行卡点检查，也就是拦截 git commit 命令，进行代码格式检查，只有确保通过格式检查才允许正常提交代码。社区中已经有了对应的工具——Husky来完成这件事情，让我们来安装一下这个工具:
  ~~~shell
  pnpm i husky -D
  ~~~
  值得提醒的是，有很多人推荐在package.json中配置 husky 的钩子:
  ~~~json
  // package.json
  {
    "husky": {
      "pre-commit": "npm run lint"
    }
  }
  ~~~
  这种做法在 Husky 4.x 及以下版本没问题，而在最新版本(7.x 版本)中是无效的！在新版 Husky 版本中，我们需要做如下的事情:
  1. 初始化 Husky: npx husky install，并将 husky install作为项目启动前脚本
     ~~~json
     {
       "scripts": {
         // 会在安装 npm 依赖后自动执行
         "prepare": "husky install"
       }
     }
     ~~~
  2. 添加 Husky 钩子，在终端执行如下命令:
     ~~~shell
     npx husky add .husky/pre-commit "npm run lint"
     ~~~
  接着你将会在项目根目录的.husky目录中看到名为pre-commit的文件，里面包含了 git commit前要执行的脚本。现在，当你执行 git commit 的时候，会首先执行 npm run lint脚本，通过 Lint 检查后才会正式提交代码记录。
  <br>
  <br>
  Husky 中每次执行npm run lint都对仓库中的代码进行全量检查，而lint-staged就是用来解决上述全量扫描问题的，可以实现只对存入暂存区的文件进行 Lint 检查
  ~~~shell
  pnpm i -D lint-staged
  ~~~
  然后在 package.json中添加如下的配置:
  ~~~json
  {
    "lint-staged": {
      "**/*.{js,jsx,tsx,ts}": [
        "npm run lint:script",
        "git add ."
      ],
      "**/*.{scss}": [
        "npm run lint:style",
        "git add ."
      ]
    }
  }
  ~~~
  接下来我们需要在 Husky 中应用lint-stage，回到.husky/pre-commit脚本中，将原来的npm run lint换成如下脚本:
  ~~~shell
  npx --no -- lint-staged
  ~~~
  <br>
- 提交时的 commit 信息规范
  ~~~shell
  # 安装工具库
  pnpm i commitlint @commitlint/cli @commitlint/config-conventional -D
  ~~~
  ~~~ts
  // .commitlintrc.js
  module.exports = {
    extends: ["@commitlint/config-conventional"]
  };
  ~~~
  一般我们直接使用@commitlint/config-conventional规范集就可以了，它所规定的 commit 信息一般由两个部分: type 和 subject 组成，结构如下:
  ~~~ts
  // type 指提交的类型
  // subject 指提交的摘要信息
  <type>: <subject>
  ~~~
  常用的 type 值包括如下:
  * feat: 添加新功能。
  * fix: 修复 Bug。
  * chore: 一些不影响功能的更改。
  * docs: 专指文档的修改。
  * perf: 性能方面的优化。
  * refactor: 代码重构。
  * test: 添加一些测试代码等等。

  <br>
  接下来我们将commitlint的功能集成到 Husky 的钩子当中，在终端执行如下命令即可
  
  ~~~shell
  npx husky add .husky/commit-msg "npx --no-install commitlint -e $HUSKY_GIT_PARAMS"
  ~~~
  <br>
- Commitizen
  ~~~shell
  # 安装全局工具
  npm install -g commitizen cz-conventional-changelog
  ~~~
  创建 ~/.czrc 文件，写入如下内容
  ~~~json
  { "path": "cz-conventional-changelog" }
  ~~~
  这时就可以全局使用 git cz 命令来代替 git commit 命令了
  <br>
  <br>
  接下来在项目中安装commitizen
  ~~~shell
  pnpm i commitizen -D
  ~~~
  ~~~json
  // package.json
  {
    "scripts": {
      "commit": "git-cz"
    },
    "config": {
      "commitizen": {
        "path": "node_modules/cz-conventional-changelog"
      }
    }
  }
  ~~~
  
- 定制提交
  ~~~shell
  # 全局安装
  npm i cz-customizable -g
  ~~~
  ~~~json
  {
    "scripts": {
      "commit": "./node_modules/cz-customizable/standalone.js"
    },
    "config": {
      "commitizen": {
        "path": "node_modules/cz-customizable"
      }
    }
  }
  ~~~
  cz-customizable首先会在项目根目录中查找名为.cz-config.js的文件，也可以自定义配置文件路径，如下：
  ~~~json
  {
    "scripts": {
      "commit": "./node_modules/cz-customizable/standalone.js"
    },
    "config": {
      "commitizen": {
        "path": "node_modules/cz-customizable"
      },
      "cz-customizable": {
        "config": "config/path/to/my/config.js"
      }
    }
  }
  ~~~
  配置.cz-config.js文件
  ~~~js
  module.exports = {
    // 可选类型
    types: [
        { value: 'feat', name: 'feat: 新功能' },
        { value: 'fix', name: 'fix: 修复' },
        { value: 'docs', name: 'docs: 文档变更' },
        { value: 'style', name: 'style: 代码格式(不影响代码运行的变动)' },
        { value: 'refactor', name: 'refactor: 重构(既不是增加feature, 也不是修复bug)' },
        { value: 'perf', name: 'perf: 性能优化' },
        { value: 'test', name: 'test: 增加测试' },
        { value: 'chore', name: 'chore: 构建过程或辅助工具的变动' },
        { value: 'revert', name: 'revert: 回退' },
        { value: 'build', name: 'build: 打包' },
        { value: 'ci', name: 'ci: 持续集成相关文件修改' },
        { value: 'release', name: 'release: 发布新版本' },
        { value: 'workflow', name: 'workflow: 工作流相关文件修改' }
    ],
    // 消息步骤
    messages: {
        type: '请选择提交类型:',
        customScope: '请输入修改范围(可选):',
        subject: '请简要描述提交(必填):',
        body: '请输入详细描述(可选):',
        footer: '请输入要关闭的issue(可选):',
        confirmCommit: '请确认使用以上信息提交?(y/n)'
    },
    // 跳过问题
    skipQuestions: ['body', 'footer'],
    // subject文字长度默认是72
    subjectLimit: 72
  }
  ~~~

## 处理静态资源
- 配置路径别名
    ~~~js
    // vite.config.ts
    import path from 'path';

    {
      resolve: {
        // 别名配置
        alias: {
          '@assets': path.join(__dirname, 'src/assets')
        }
      }
    }
    ~~~
  
- 使用Web Worker
  ~~~js
  // 新建 example.js
  const start = () => {
    let count = 0;
    setInterval(() => {
      // 给主线程传值
      postMessage(++count);
    }, 2000);
  };

  start();
  ~~~
  引入时加上?worker后缀，告诉 Vite 这是一个Web Worker脚本文件
  ~~~js
  import Worker from './example.js?worker';
  // 1. 初始化 Worker 实例
  const worker = new Worker();
  // 2. 主线程监听 worker 的信息
  worker.addEventListener('message', (e) => {
    console.log(e);
  });
  ~~~

- 使用Web Assembly
  ~~~js
  // 新建 fib.wasm 文件    
  export function fib(n) {
    var a = 0,
    b = 1;
    if (n > 0) {
      while (--n) {
        let t = a + b;
        a = b;
        b = t;
      }
      return b;
    }
    return a;
  }
  ~~~
  组件中导入fib.wasm文件
  ~~~tsx
  // Header/index.tsx
  import init from './fib.wasm?init';

  type FibFunc = (num: number) => number;

  init({}).then((exports) => {
    const fibFunc = exports.fib as FibFunc;
    console.log('Fib result:', fibFunc(10));
  });
  ~~~
  Vite 会对.wasm文件的内容进行封装，默认导出为 init 函数，这个函数返回一个 Promise，因此我们可以在其 then 方法中拿到其导出的成员——fib方法。


- 其它静态资源
  <br>
  <br>
  除了上述的一些资源格式，Vite 也对下面几类格式提供了内置的支持:
    * 媒体类文件，包括mp4、webm、ogg、mp3、wav、flac和aac。
    * 字体类文件。包括woff、woff2、eot、ttf 和 otf。
    * 文本类。包括webmanifest、pdf和txt。
      
  <br>
  也就是说，你可以在 Vite 将这些类型的文件当做一个 ES 模块来导入使用。如果你的项目中还存在其它格式的静态资源，你可以通过assetsInclude配置让 Vite 来支持加载:
  
  ~~~ts
  // vite.config.ts

  {
    assetsInclude: ['.gltf']
  }
  ~~~

- 特殊资源后缀
  <br>
  <br>
  Vite 中引入静态资源时，也支持在路径最后加上一些特殊的 query 后缀，包括:
  * ?url: 表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用。
  * ?raw: 表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀。
  * ?inline: 表示资源强制内联，而不是打包成单独的文件。
    <br>
    <br>
- 生产环境处理
  1. 自定义部署域名
     ~~~js
     // vite.config.ts
     // 是否为生产环境，在生产环境一般会注入 NODE_ENV 这个环境变量，见下面的环境变量文件配置
     const isProduction = process.env.NODE_ENV === 'production';
     // 填入项目的 CDN 域名地址
     const CDN_URL = 'xxxxxx';

     // 具体配置
     {
       base: isProduction ? CDN_URL: '/'
     }
     ~~~
     注意在项目根目录新增的两个环境变量文件.env.development和.env.production，顾名思义，即分别在开发环境和生产环境注入一些环境变量，这里为了区分不同环境我们加上了NODE_ENV，你也可以根据需要添加别的环境变量。
     > 打包的时候 Vite 会自动将这些环境变量替换为相应的字符串。
     ~~~js
     // .env.development
     NODE_ENV=development
     ~~~
     ~~~js
     // .env.production
     NODE_ENV=production
     ~~~
     有时候可能项目中的某些图片需要存放到另外的存储服务，我们可以通过定义环境变量的方式来解决这个问题，在项目根目录新增.env文件:
     ~~~js
     // 开发环境优先级: .env.development > .env
     // 生产环境优先级: .env.production > .env
     // .env 文件
     VITE_IMG_BASE_URL=https://my-image-cdn.com
     ~~~
     然后进入 src/vite-env.d.ts增加类型声明:
     ~~~ts
     /// <reference types="vite/client" />

     interface ImportMetaEnv {
       readonly VITE_APP_TITLE: string;
       // 自定义的环境变量
       readonly VITE_IMG_BASE_URL: string;
     }

     interface ImportMeta {
       readonly env: ImportMetaEnv;
     }
     ~~~
     如果某个环境变量要在 Vite 中通过 import.meta.env 访问，那么它必须以VITE_开头，如VITE_IMG_BASE_URL。接下来我们在组件中来使用这个环境变量:
     ~~~tsx
     <img src={new URL('./logo.png', import.meta.env.VITE_IMG_BASE_URL).href} />
     ~~~
  2. 单文件 or 内联
    <br>
    <br>
     在 Vite 中，所有的静态资源都有两种构建方式，一种是打包成一个单文件，另一种是通过 base64 编码的格式内嵌到代码中。
     <br>
     <br>
     对于比较小的资源，适合内联到代码中，一方面对代码体积的影响很小，另一方面可以减少不必要的网络请求，优化网络性能。而对于比较大的资源，就推荐单独打包成一个文件，而不是内联了，否则可能导致上 MB 的 base64 字符串内嵌到代码中，导致代码体积瞬间庞大，页面加载性能直线下降
     <br>
     <br>
      Vite 中内置的优化方案是下面这样的:
      * 如果静态资源体积 >= 4KB，则提取成单独的文件
      * 如果静态资源体积 < 4KB，则作为 base64 格式的字符串内联    
     <br>

     上述的4 KB即为提取成单文件的临界值，当然，这个临界值你可以通过build.assetsInlineLimit自行配置，如下代码所示:
     ~~~js
     // vite.config.ts
     {
       build: {
         // 8 KB
         assetsInlineLimit: 8 * 1024
       }
     }
     ~~~
     >svg 格式的文件不受这个临时值的影响，始终会打包成单独的文件，因为它和普通格式的图片不一样，需要动态设置一些属性
     
  3. 图片压缩
     <br>
     <br>
     图片资源的体积往往是项目产物体积的大头，如果能尽可能精简图片的体积，那么对项目整体打包产物体积的优化将会是非常明显的。在 JavaScript 领域有一个非常知名的图片压缩库imagemin，作为一个底层的压缩工具，前端的项目中经常基于它来进行图片压缩，比如 Webpack 中大名鼎鼎的image-webpack-loader。社区当中也已经有了开箱即用的 Vite 插件 vite-plugin-imagemin
     ~~~shell
     # 安装插件
     pnpm i vite-plugin-imagemin -D
     ~~~
     ~~~ts
     //vite.config.ts
     import viteImagemin from 'vite-plugin-imagemin';
    
     {
       plugins: [
         // 忽略前面的插件
         viteImagemin({
           // 无损压缩配置，无损压缩下图片质量不会变差
           optipng: {
             optimizationLevel: 7
           },
           // 有损压缩配置，有损压缩下图片质量可能会变差
           pngquant: {
             quality: [0.8, 0.9],
           },
           // svg 优化
           svgo: {
             plugins: [
               {
                 name: 'removeViewBox'
               },
               {
                 name: 'removeEmptyAttrs',
                 active: false
               }
             ]
           }
         })
       ]
     }
     ~~~

  4. 雪碧图优化
     <br>
     <br>
     在实际的项目中我们还会经常用到各种各样的 svg 图标，虽然 svg 文件一般体积不大，但 Vite 中对于 svg 文件会始终打包成单文件，大量的图标引入之后会导致网络请求增加，大量的 HTTP 请求会导致网络解析耗时变长，页面加载性能直接受到影响。这个问题怎么解决呢？
     >HTTP2 的多路复用设计可以解决大量 HTTP 的请求导致的网络加载性能问题，因此雪碧图技术在 HTTP2 并没有明显的优化效果，这个技术更适合在传统的 HTTP 1.1 场景下使用(比如本地的 Dev Server)。

     Vite 中提供了import.meta.glob的语法糖来解决批量导入的问题
     ~~~js
     const icons = import.meta.glob('../../assets/icons/logo-*.svg');
     ~~~
     icons 的 value 都是动态 import，适合按需加载的场景，在这里我们只需要同步加载即可，可以使用 import.meta.glob('*', { eager: true }) 来完成
     ~~~js
     const icons = import.meta.glob('../../assets/icons/logo-*.svg', { eager: true }) 
     ~~~
     稍作解析，然后将 svg 应用到组件当中
     ~~~tsx
     // Header/index.tsx
     const iconUrls = Object.values(icons).map(mod => mod.default);

     // 组件返回内容添加如下
     {
       iconUrls.map((item) => (
         <img src={item} key={item} width="50" alt="" />
       ))
     }
     ~~~
     每一个svg都会发出一个请求，避免大量的请求，我们可以通过 vite-plugin-svg-icons 来实现雪碧图
     ~~~shell
     # 安装插件
     pnpm i vite-plugin-svg-icons -D
     ~~~
     ~~~js
     // vite.config.ts
     import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';

     {
       plugins: [
         // 省略其它插件
         createSvgIconsPlugin({
           iconDirs: [path.join(__dirname, 'src/assets/icons')]
         })
       ]
     }
     ~~~
     在 src/components目录下新建SvgIcon组件
     ~~~tsx
     // SvgIcon/index.tsx
     export interface SvgIconProps {
       name?: string;
       prefix: string;
       color: string;
       [key: string]: string;
     }
    
     export default function SvgIcon({
       name,
       prefix = 'icon',
       color = '#333',
       ...props
     }: SvgIconProps) {
       const symbolId = `#${prefix}-${name}`;
    
       return (
         <svg {...props} aria-hidden="true">
           <use href={symbolId} fill={color} />
         </svg>
       );
     }
     ~~~
     现在我们回到 Header 组件中，稍作修改
     ~~~tsx
     // index.tsx
     const icons = import.meta.globEager('../../assets/icons/logo-*.svg');
     const iconUrls = Object.values(icons).map((mod) => {
       // 如 ../../assets/icons/logo-1.svg -> logo-1
       const fileName = mod.default.split('/').pop();
       const [svgName] = fileName.split('.');
       return svgName;
     });
    
     // 渲染 svg 组件
     {iconUrls.map((item) => (
       <SvgIcon name={item} key={item} width="50" height="50" />
     ))}
     ~~~
     ~~~js
     // src/main.tsx
     import 'virtual:svg-icons-register';
     ~~~    
     雪碧图包含了所有图标的具体内容，而对于页面每个具体的图标，则通过 use 属性来引用雪碧图的对应内容

## 预构建
+ 首先 Vite 是基于浏览器原生 ES 模块规范实现的 Dev Server，不论是应用代码，还是第三方依赖的代码，理应符合 ESM 规范才能够正常运行。
+ 每个import都会触发一次新的文件请求，因此在这种依赖层级深、涉及模块数量多的情况下，会触发成百上千个网络请求，巨大的请求量加上 Chrome 对同一个域名下只能同时支持 6 个 HTTP 并发请求的限制，导致页面加载十分缓慢，与 Vite 主导性能优势的初衷背道而驰。
  
依赖预构建主要做了两件事情
1. 将其他格式(如 UMD 和 CommonJS)的产物转换为 ESM 格式，使其在浏览器通过 ```<script type="module"><script>``` 的方式正常加载。
2. 打包第三方库的代码，将各个第三方库分散的文件合并到一起，减少 HTTP 请求数量，避免页面加载性能劣化。

而这两件事情全部由性能优异的 Esbuild (基于 Golang 开发)完成，而不是传统的 Webpack/Rollup，所以也不会有明显的打包性能问题，反而是 Vite 项目启动飞快(秒级启动)的一个核心原因
>Vite 1.x 使用了 Rollup 来进行依赖预构建，在 2.x 版本将 Rollup 换成了 Esbuild，编译速度提升了近 100 倍！

- 开启预构建
  * 项目第一次启动时自动开启预构建，项目启动成功后，根目录下的node_modules中的.vite目录，就是预构建产物文件存放的目录。并且对于依赖的请求结果，Vite 的 Dev Server 会设置强缓存，缓存过期时间被设置为一年，表示缓存过期前浏览器对 react 预构建产物的请求不会再经过 Vite Dev Server，直接用缓存结果。
  * 当然，除了 HTTP 缓存，Vite 还设置了本地文件系统的缓存，所有的预构建产物默认缓存在node_modules/.vite目录中。如果以下 3 个地方都没有改动，Vite 将一直使用缓存文件:
     + package.json 的 dependencies 字段
     + 各种包管理器的 lock 文件
     + optimizeDeps 配置内容


- 手动开启
  * 上面提到了预构建中本地文件系统的产物缓存机制，而少数场景下我们不希望用本地的缓存文件，比如需要调试某个包的预构建结果，我推荐使用下面任意一种方法清除缓存:
    * 删除node_modules/.vite目录。
    * 在 Vite 配置文件中，将server.force设为true。(注意，Vite 3.0 中配置项有所更新，你需要将 optimizeDeps.force 设为true)
    * 命令行执行npx vite --force或者npx vite optimize。
  >Vite 项目的启动可以分为两步，第一步是依赖预构建，第二步才是 Dev Server 的启动，npx vite optimize相比于其它的方案，仅仅完成第一步的功能。


- 自定义配置详解
<br>
<br>
  Vite 将预构建相关的配置项都集中在optimizeDeps属性上，我们来一一拆解这些子配置项背后的含义和应用场景。
  <br>
  <br>
  * entries(入口文件)
    <br>
    <br>
    项目第一次启动时，Vite 会默认抓取项目中所有的 HTML 文件（如当前脚手架项目中的index.html），将 HTML 文件作为应用入口，然后根据入口文件扫描出项目中用到的第三方依赖，最后对这些依赖逐个进行编译。
    <br>
    <br>
    当默认扫描 HTML 文件的行为无法满足需求的时候，比如项目入口为vue格式文件时，你可以通过 entries 参数来配置:
    ~~~js
    // vite.config.ts
    {
      optimizeDeps: {
        // 为一个字符串数组
        entries: ["./src/main.vue"];
      }
    }
    ~~~
    entries 配置也支持 [glob 语法](https://github.com/mrmlnc/fast-glob)，非常灵活
    ~~~js
    // 将所有的 .vue 文件作为扫描入口
    entries: ["**/*.vue"];
    ~~~
    不光是.vue文件，Vite 同时还支持各种格式的入口，包括: html、svelte、astro、js、jsx、ts和tsx。可以看到，只要可能存在import语句的地方，Vite 都可以解析，并通过内置的扫描机制搜集到项目中用到的依赖，通用性很强。

  * include(添加依赖)
    <br>
    <br>
    它决定了可以强制预构建的依赖项，使用方式很简单
    ~~~js
    // vite.config.ts
    optimizeDeps: {
      // 配置为一个字符串数组，将 `lodash-es` 和 `vue`两个包强制进行预构建
      include: ["lodash-es", "vue"];
    }
    ~~~
    它在使用上并不难，真正难的地方在于，如何找到合适它的使用场景。前文中我们提到，Vite 会根据应用入口(entries)自动搜集依赖，然后进行预构建，这是不是说明 Vite 可以百分百准确地搜集到所有的依赖呢？事实上并不是，某些情况下 Vite 默认的扫描行为并不完全可靠，这就需要联合配置include来达到完美的预构建效果了。接下来，我们好好梳理一下到底有哪些需要配置include的场景。
    
    + 场景一: 动态 import
        
      在某些动态 import 的场景下，由于 Vite 天然按需加载的特性，经常会导致某些依赖只能在运行时被识别出来。
      ~~~js
      // src/locales/zh_CN.js
      import objectAssign from "object-assign";
      console.log(objectAssign);

      // main.tsx
      const importModule = (m) => import(`./locales/${m}.ts`);
      importModule("zh_CN");
      ~~~
      在这个例子中，动态 import 的路径只有运行时才能确定，无法在预构建阶段被扫描出来。因此在 Vite 运行时发现了新的依赖，随之重新进行依赖预构建，并刷新页面。这个过程也叫二次预构建。在一些比较复杂的项目中，这个过程会执行很多次。，如下面的日志信息所示:
      ~~~
      [vite] new dependencies found: @material-ui/icons/Dehaze, @material-ui/core/Box, @material-ui/core/Checkbox, updating...
      [vite] ✨ dependencies updated, reloading page...
      [vite] new dependencies found: @material-ui/core/Dialog, @material-ui/core/DialogActions, updating...
      [vite] ✨ dependencies updated, reloading page...
      [vite] new dependencies found: @material-ui/core/Accordion, @material-ui/core/AccordionSummary, updating...
      [vite] ✨ dependencies updated, reloading page...
      ~~~
      然而，二次预构建的成本也比较大。我们不仅需要把预构建的流程重新运行一遍，还得重新刷新页面，并且需要重新请求所有的模块。尤其是在大型项目中，这个过程会严重拖慢应用的加载速度！因此，我们要尽力避免运行时的二次预构建。具体怎么做呢？你可以通过include参数提前声明需要按需加载的依赖:
      ~~~js
      // vite.config.ts
      {
        optimizeDeps: {
          include: [
            // 按需加载的依赖都可以声明到这个数组里
            "object-assign",
          ];
        }
      }
      ~~~
    
    + 场景二: 某些包被手动 exclude
    
      exclude 是optimizeDeps中的另一个配置项，与include相对，用于将某些依赖从预构建的过程中排除。不过这个配置并不常用，也不推荐大家使用。如果真遇到了要在预构建中排除某个包的情况，需要注意它所依赖的包是否具有 ESM 格式
      <br>
      <br>
      exclude 的包若是本身具有 ESM 格式的产物，但它的某个依赖包并没有提供 ESM 格式，就导致运行时加载失败。
      <br>
      <br>
      这个时候可以使用 include 强制对这个间接依赖进行预构建，如下：
      ~~~js
      // vite.config.ts
      {
        optimizeDeps: {
          include: [
            // 间接依赖的声明语法，通过`>`分开, 如`a > b`表示 a 中依赖的 b
            "@loadable/component > hoist-non-react-statics",
          ];
        }
      } 
      ~~~
      
  * 自定义 Esbuild 行为

    Vite 提供了esbuildOptions 参数来让我们自定义 Esbuild 本身的配置，常用的场景是加入一些 Esbuild 插件:
    ~~~js
    // vite.config.ts
    {
      optimizeDeps: {
        esbuildOptions: {  
          plugins: [
            // 加入 Esbuild 插件
          ];
        }
      }
    }
    ~~~
    这个配置主要是处理一些特殊情况，如某个第三方包本身的代码出现问题了。
    ~~~js
    // vite.config.ts
    const esbuildPatchPlugin = {
      name: "react-virtualized-patch",
      setup(build) {
        build.onLoad(
          {
            filter: /react-virtualized\/dist\/es\/WindowScroller\/utils\/onScroll.js$/,
          },
          async (args) => {
            const text = await fs.promises.readFile(args.path, "utf8");
            return {
              contents: text.replace(
                'import { bpfrpt_proptype_WindowScroller } from "../WindowScroller.js";',
                ""
              ),
            };
          }
        );
      },
    };
    
    // 插件加入 Vite 预构建配置
    {
      optimizeDeps: {
        esbuildOptions: {
          plugins: [esbuildPatchPlugin];
        }
      }
    }
    ~~~

## 双引擎架构
- Esbuild(性能利器)
  <br>
  <br>
  1. 依赖预构建——作为 Bundle 工具
     <br>
     <br>
     Esbuild是 Vite 高性能的得力助手，在很多关键的构建阶段让 Vite 获得了相当优异的性能，当然，Esbuild 作为打包工具也有一些缺点。
     * 不支持降级到 ES5 的代码。这意味着在低端浏览器代码会跑不起来。
     * 不支持 const enum 等语法。这意味着单独使用这些语法在 esbuild 中会直接抛错。
     * 不提供操作打包产物的接口，像 Rollup 中灵活处理打包产物的能力(如renderChunk钩子)在 Esbuild 当中完全没有。
     * 不支持自定义 Code Splitting 策略。传统的 Webpack 和 Rollup 都提供了自定义拆包策略的 API，而 Esbuild 并未提供，从而降级了拆包优化的灵活性。
     <br>
     <br>
  
     尽管 Esbuild 作为一个社区新兴的明星项目，有如此多的局限性，但依然不妨碍 Vite 在开发阶段使用它成功启动项目并获得极致的性能提升，生产环境处于稳定性考虑当然是采用功能更加丰富、生态更加成熟的 Rollup 作为依赖打包工具了。
     <br>
     <br>
  2. 单文件编译——作为 TS 和 JSX 编译工具
     <br>
     <br>
     在 TS(X)/JS(X) 单文件编译上面，Vite 也使用 Esbuild 进行语法转译，也就是将 Esbuild 作为 Transformer 来用，Esbuild 转译 TS 或者 JSX 的能力通过 Vite 插件提供，这个 Vite 插件在开发环境和生产环境都会执行。
     <br>
     <br>
     虽然 Esbuild Transfomer 能带来巨大的性能提升，但其自身也有局限性，最大的局限性就在于 TS 中的类型检查问题。这是因为 Esbuild 并没有实现 TS 的类型系统，在编译 TS(或者 TSX) 文件时仅仅抹掉了类型相关的代码，暂时没有能力实现类型检查。
     <br>
     <br>
     vite build之前会先执行tsc命令，也就是借助 TS 官方的编译器进行类型检查。
     <br>
     <br>
  3. 代码压缩——作为压缩工具
     <br>
     <br>
     传统的方式都是使用 Terser 这种 JS 开发的压缩器来实现，在 Webpack 或者 Rollup 中作为一个 Plugin 来完成代码打包后的压缩混淆的工作。但 Terser 其实很慢，主要有 2 个原因。
  
     * 压缩这项工作涉及大量 AST 操作，并且在传统的构建流程中，AST 在各个工具之间无法共享，比如 Terser 就无法与 Babel 共享同一个 AST，造成了很多重复解析的过程。
     * JS 本身属于解释性 + JIT（即时编译） 的语言，对于压缩这种 CPU 密集型的工作，其性能远远比不上 Golang 这种原生语言。
     <br>
     <br>
     
     因此，Esbuild 这种从头到尾共享 AST 以及原生语言编写的 Minifier 在性能上能够甩开传统工具的好几十倍。
    <br>
    <br>
- Rollup(构建基石)
  <br>
  <br>
  Rollup 在 Vite 中的重要性一点也不亚于 Esbuild，它既是 Vite 用作生产环境打包的核心工具，也直接决定了 Vite 插件机制的设计。
  <br>
  <br>
  1. 生产环境 Bundle
     <br>
     <br>
     虽然 ESM 已经得到众多浏览器的原生支持，但生产环境做到完全no-bundle也不行，会有网络性能问题。为了在生产环境中也能取得优秀的产物性能，Vite 默认选择在生产环境中利用 Rollup 打包，并基于 Rollup 本身成熟的打包能力进行扩展和优化，主要包含 3 个方面:
     * CSS 代码分割。如果某个异步模块中引入了一些 CSS 代码，Vite 就会自动将这些 CSS 抽取出来生成单独的文件，提高线上产物的缓存复用率。

     * 自动预加载。Vite 会自动为入口 chunk 的依赖自动生成预加载标签<link rel="modulepreload"> ，如:
       ~~~html
       <head>
         <!-- 省略其它内容 -->
         <!-- 入口 chunk -->
         <script type="module" crossorigin src="/assets/index.250e0340.js"></script>
         <!--  自动预加载入口 chunk 所依赖的 chunk-->
         <link rel="modulepreload" href="/assets/vendor.293dca09.js">
       </head>
       ~~~
       这种适当预加载的做法会让浏览器提前下载好资源，优化页面性能。
     * 异步 Chunk 加载优化。在异步引入的 Chunk 中，通常会有一些公用的模块，如现有两个异步引入的 Chunk: A 和 B，而且两者有一个公共依赖 C。一般情况下，Rollup 打包之后，会先请求 A，然后浏览器在加载 A 的过程中才决定请求和加载 C，但 Vite 进行优化之后，请求 A 的同时会自动预加载 C，通过优化 Rollup 产物依赖加载方式节省了不必要的网络开销。
       <br>
       <br>
  2. 兼容插件机制
     <br>
     <br>
     无论是开发阶段还是生产环境，Vite 都根植于 Rollup 的插件机制和生态
     <br>
     <br>
     在开发阶段，Vite 借鉴了 WMR 的思路，自己实现了一个 Plugin Container，用来模拟 Rollup 调度各个 Vite 插件的执行逻辑，而 Vite 的插件写法完全兼容 Rollup，因此在生产环境中将所有的 Vite 插件传入 Rollup 也没有问题。
     <br>
     <br>
     反过来说，Rollup 插件却不一定能完全兼容 Vite。不过，目前仍然有不少 Rollup 插件可以直接复用到 Vite 中，你可以通过这个站点查看所有兼容 Vite 的 Rollup 插件: [vite-rollup-plugins.patak.dev](https://vite-rollup-plugins.patak.dev/) 。

## Esbuild
Esbuild 是由 Figma 的 CTO 「Evan Wallace」基于 Golang 开发的一款打包工具，相比传统的打包工具，主打性能优势，在构建速度上可以比传统工具快 10~100 倍。那么，它是如何达到这样超高的构建性能的呢？主要原因可以概括为 4 点。
1. 使用 Golang 开发，构建逻辑代码直接被编译为原生机器码，而不用像 JS 一样先代码解析为字节码，然后转换为机器码，大大节省了程序运行时间。

2. 多核并行。内部打包算法充分利用多核 CPU 优势，所有的步骤尽可能并行，这也是得益于 Go 当中多线程共享内存的优势。

3. 从零造轮子。 几乎没有使用任何第三方库，所有逻辑自己编写，大到 AST 解析，小到字符串的操作，保证极致的代码性能。

4. 高效的内存利用。Esbuild 中从头到尾尽可能地复用一份 AST 节点数据，而不用像 JS 打包工具中频繁地解析和传递 AST 数据（如 string -> TS -> JS -> string)，造成内存的大量浪费。

- Esbuild 功能使用
  ~~~shell
  # 安装 esbuild
  pnpm i esbuild
  ~~~
  - 命令行调用
    ~~~shell
    # 安装一下所需的依赖
    pnpm install react react-dom
    ~~~
    ~~~js
    // src/index.jsx
    import Server from "react-dom/server";
    
    let Greet = () => <h1>Hello, juejin!</h1>;
    console.log(Server.renderToString(<Greet />));
    ~~~
    接着到package.json中添加build脚本
    ~~~json
    {
       "scripts": {
         "build": "./node_modules/.bin/esbuild src/index.jsx --bundle --outfile=dist/out.js"
       }
    }
    ~~~
    终端执行pnpm run build就可以完成打包工作。
    <br>
    <br>
  - 代码调用
    <br>
    <br>
    Esbuild 对外暴露了一系列的 API，主要包括两类: Build API和Transform API，我们可以在 Nodejs 代码中通过调用这些 API 来使用 Esbuild 的各种功能。
    <br>
    <br>
    + 项目打包——Build API
      <br>
      <br>
      Build API主要用来进行项目打包，包括build、buildSync和serve三个方法。
      <br>
      <br>
      首先我们来试着在 Node.js 中使用build 方法。你可以在项目根目录新建build.js文件，内容如下:
      ~~~ts
      const { build, buildSync, serve } = require("esbuild");

      async function runBuild() {
        // 异步方法，返回一个 Promise
        const result = await build({
          // ----  如下是一些常见的配置  ---
          // 当前项目根目录
          absWorkingDir: process.cwd(),
          // 入口文件列表，为一个数组
          entryPoints: ["./src/index.jsx"],
          // 打包产物目录
          outdir: "dist",
          // 是否需要打包，一般设为 true
          bundle: true,
          // 模块格式，包括`esm`、`commonjs`和`iife`
          format: "esm",
          // 需要排除打包的依赖列表
          external: [],
          // 是否开启自动拆包
          splitting: true,
          // 是否生成 SourceMap 文件
          sourcemap: true,
          // 是否生成打包的元信息文件
          metafile: true,
          // 是否进行代码压缩
          minify: false,
          // 是否开启 watch 模式，在 watch 模式下代码变动则会触发重新打包
          watch: false,
          // 是否将产物写入磁盘
          write: true,
          // Esbuild 内置了一系列的 loader，包括 base64、binary、css、dataurl、file、js(x)、ts(x)、text、json
          // 针对一些特殊的文件，调用不同的 loader 进行加载
          loader: {
            '.png': 'base64',
          }
        });
        console.log(result);
      }
      runBuild();
      ~~~
      执行 ```node build.js```命令进行打包
      <br>
      <br>
      buildSync方法的使用与build几乎相同，不过buildSync为同步执行。
      <br>
      <br>
      并不推荐大家使用 buildSync 这种同步的 API，它们会导致两方面不良后果。一方面容易使 Esbuild 在当前线程阻塞，丧失并发任务处理的优势。另一方面，Esbuild 所有插件中都不能使用任何异步操作，这给插件开发增加了限制。
      <br>
      <br>
      serve 有三个特点：
        1. 开启 serve 模式后，将在指定的端口和目录上搭建一个静态文件服务，这个服务器用原生 Go 语言实现，性能比 Nodejs 更高。
        2. 类似 webpack-dev-server，所有的产物文件都默认不会写到磁盘，而是放在内存中，通过请求服务来访问。
        3. 每次请求到来时，都会进行重新构建(rebuild)，永远返回新的产物。触发 rebuild 的条件并不是代码改动，而是新的请求到来。
        <br>
        <br>
      
      示例：
      ~~~js
      // build.js
      const { build, buildSync, serve } = require("esbuild");
    
      function runBuild() {
        serve(
          {
            port: 8000,
            // 静态资源目录
            servedir: './dist'
          },
          {
            absWorkingDir: process.cwd(),
            entryPoints: ["./src/index.jsx"],
            bundle: true,
            format: "esm",
            splitting: true,
            sourcemap: true,
            ignoreAnnotations: true,
            metafile: true,
          }
        ).then((server) => {
            console.log("HTTP Server starts at port", server.port);
        });
      }
      runBuild();
      ~~~
      浏览器访问localhost:8000可以看到 Esbuild 服务器返回的编译产物，后续每次在浏览器请求都会触发 Esbuild 重新构建，而每次重新构建都是一个增量构建的过程，耗时也会比首次构建少很多(一般能减少 70% 左右)。
      > Serve API 只适合在开发阶段使用，不适用于生产环境。

    - 单文件转译——Transform API
      <br>
      <br>
      Esbuild 还专门提供了单文件编译的能力，即Transform API，与 Build API 类似，它也包含了同步和异步的两个方法，分别是transformSync和transform。下面，我们具体使用下这些方法。
      ~~~js
      // transform.js
      const { transform, transformSync } = require("esbuild");
    
      async function runTransform() {
        // 第一个参数是代码字符串，第二个参数为编译配置
        const content = await transform(
          "const isNull = (str: string): boolean => str.length > 0;",
          {
            sourcemap: true,
            loader: "tsx",
          }
        );
        console.log(content);
      }
      runTransform();
      ~~~
      transformSync 的用法类似，不过由于同步的 API 会使 Esbuild 丧失并发任务处理的优势（Build API的部分已经分析过），不推荐大家使用transformSync。出于性能考虑，Vite 的底层实现也是采用 transform这个异步的 API 进行 TS 及 JSX 的单文件转译的。
      <br>
      <br>
- Esbuild 插件开发
  <br>
  <br>
  * 基本概念
    <br>
    <br>
    插件开发其实就是基于原有的体系结构中进行扩展和自定义。 Esbuild 插件也不例外，通过 Esbuild 插件我们可以扩展 Esbuild 原有的路径解析、模块加载等方面的能力，并在 Esbuild 的构建过程中执行一系列自定义的逻辑。
    <br>
    <br>
    Esbuild 插件结构被设计为一个对象，里面有name和setup两个属性，name是插件的名称，setup是一个函数，其中入参是一个 build 对象，这个对象上挂载了一些钩子可供我们自定义一些钩子函数逻辑。以下是一个简单的Esbuild插件示例:
    ~~~ts
    let envPlugin = {
      name: 'env',
      setup(build) {
        build.onResolve({ filter: /^env$/ }, args => ({
          path: args.path,
          namespace: 'env-ns',
        }))

        build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
          contents: JSON.stringify(process.env),
          loader: 'json',
        }))
      },
    }

    require('esbuild').build({
      entryPoints: ['src/index.jsx'],
      bundle: true,
      outfile: 'out.js',
      // 应用插件
      plugins: [envPlugin],
    }).catch(() => process.exit(1))
    ~~~
    使用插件后效果如下:
    ~~~js
    // 应用了 env 插件后，构建时将会被替换成 process.env 对象
    import { PATH } from 'env'

    console.log(`PATH is ${PATH}`)
    ~~~
    <br>
  * 钩子函数的使用
    <br><br>
    1. onResolve 钩子 和 onLoad钩子
       <br><br> 
       在 Esbuild 插件中，onResolve 和 onload是两个非常重要的钩子，分别控制路径解析和模块内容加载的过程。
       ~~~js
       build.onResolve({ filter: /^env$/ }, args => ({
         path: args.path,
         namespace: 'env-ns',
       }));
       build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => ({
         contents: JSON.stringify(process.env),
         loader: 'json',
       }));
       ~~~
       可以发现这两个钩子函数中都需要传入两个参数: Options 和 Callback。
       <br><br>
       先说说Options。它是一个对象，对于onResolve 和 onload 都一样，包含filter和namespace两个属性，类型定义如下:
       ~~~ts
       interface Options {
         filter: RegExp;
         namespace?: string;
       }
       ~~~
       filter 为必传参数，是一个正则表达式，它决定了要过滤出的特征文件。
       <br><br>
       namespace 为选填参数，一般在 onResolve 钩子中的回调参数返回namespace属性作为标识，我们可以在onLoad钩子中通过 namespace 将模块过滤出来。如上述插件示例就在onLoad钩子通过env-ns这个 namespace 标识过滤出了要处理的env模块。
       <br><br>
       Callback，它的类型根据不同的钩子会有所不同。相比于 Options，Callback 函数入参和返回值的结构复杂得多，涉及很多属性。
       <br><br>
       在 onResolve 钩子中函数参数和返回值梳理如下:
       ~~~ts
       build.onResolve({ filter: /^env$/ }, (args: onResolveArgs): onResolveResult => {
         // 模块路径
         console.log(args.path)
         // 父模块路径
         console.log(args.importer)
         // namespace 标识
         console.log(args.namespace)
         // 基准路径
         console.log(args.resolveDir)
         // 导入方式，如 import、require
         console.log(args.kind)
         // 额外绑定的插件数据
         console.log(args.pluginData)

         return {
           // 错误信息
           errors: [],
           // 是否需要 external
           external: false,
           // namespace 标识
           namespace: 'env-ns',
           // 模块路径
           path: args.path,
           // 额外绑定的插件数据
           pluginData: null,
           // 插件名称
           pluginName: 'xxx',
           // 设置为 false，如果模块没有被用到，模块代码将会在产物中会删除。否则不会这么做
           sideEffects: false,
           // 添加一些路径后缀，如`?xxx`
           suffix: '?xxx',
           // 警告信息
           warnings: [],
           // 仅仅在 Esbuild 开启 watch 模式下生效
           // 告诉 Esbuild 需要额外监听哪些文件/目录的变化
           watchDirs: [],
           watchFiles: []
         }
       })
       ~~~
       在 onLoad 钩子中函数参数和返回值梳理如下:
       ~~~ts
       build.onLoad({ filter: /.*/, namespace: 'env-ns' }, (args: OnLoadArgs): OnLoadResult => {
         // 模块路径
         console.log(args.path);
         // namespace 标识
         console.log(args.namespace);
         // 后缀信息
         console.log(args.suffix);
         // 额外的插件数据
         console.log(args.pluginData);

         return {
           // 模块具体内容
           contents: '省略内容',
           // 错误信息
           errors: [],
           // 指定 loader，如`js`、`ts`、`jsx`、`tsx`、`json`等等
           loader: 'json',
           // 额外的插件数据
           pluginData: null,
           // 插件名称
           pluginName: 'xxx',
           // 基准路径
           resolveDir: './dir',
           // 警告信息
           warnings: [],
           // 同上
           watchDirs: [],
           watchFiles: []
         }
       })
       ~~~
       <br>
       <br>
    2. 其他钩子
        <br>
        <br>
       在 build 对象中，除了onResolve和onLoad，还有onStart和onEnd两个钩子用来在构建开启和结束时执行一些自定义的逻辑，使用上比较简单，如下面的例子所示:
       ~~~ts
       let examplePlugin = {
         name: 'example',
         setup(build) {
           build.onStart(() => {
             console.log('build started')
           });
           build.onEnd((buildResult) => {
             if (buildResult.errors.length) {
               return;
             }
             // 构建元信息
             // 获取元信息后做一些自定义的事情，比如生成 HTML
             console.log(buildResult.metafile)
           })
         },
       }
       ~~~
       在使用这些钩子的时候，有 2 点需要注意。
       + onStart 的执行时机是在每次 build 的时候，包括触发 watch 或者 serve模式下的重新构建。
       + onEnd 钩子中如果要拿到 metafile，必须将 Esbuild 的构建配置中metafile属性设为 true。
<br>
<br>
- 实战 1: CDN 依赖拉取插件
  <br>
  <br>
  Esbuild 原生不支持通过 HTTP 从 CDN 服务上拉取对应的第三方依赖资源，如下代码所示:
  ~~~tsx
  // src/index.jsx
  // react-dom 的内容全部从 CDN 拉取
  // 这段代码目前是无法运行的
  import { render } from "https://cdn.skypack.dev/react-dom";
  import React from 'https://cdn.skypack.dev/react'
    
  let Greet = () => <h1>Hello, juejin!</h1>;
    
  render(<Greet />, document.getElementById("root"));
  ~~~
  示例代码中我们用到了 Skypack 这个提供 npm 第三方包 ESM 产物的 CDN 服务，我们可以通过 url 访问第三方包的资源
  <br>
  <br>
  我们需要通过 Esbuild 插件来识别这样的 url 路径，然后从网络获取模块内容并让 Esbuild 进行加载，甚至不再需要npm install安装依赖了
  <br>
  <br>
  最简单的版本
  ~~~tsx
  // http-import-plugin.js
  module.exports = () => ({
    name: "esbuild:http",
    setup(build) {
      let https = require("https");
      let http = require("http");

      // 1. 拦截 CDN 请求
      build.onResolve({ filter: /^https?:\/\// }, (args) => ({
        path: args.path,
        namespace: "http-url",
      }));

      // 2. 通过 fetch 请求加载 CDN 资源
      build.onLoad({ filter: /.*/, namespace: "http-url" }, async (args) => {
        let contents = await new Promise((resolve, reject) => {
          function fetch(url) {
            console.log(`Downloading: ${url}`);
            let lib = url.startsWith("https") ? https : http;
            let req = lib.get(url, (res) => {
              if ([301, 302, 307].includes(res.statusCode)) {
                // 重定向
                fetch(new URL(res.headers.location, url).toString());
                req.abort();
              } else if (res.statusCode === 200) {
                // 响应成功
                let chunks = [];
                res.on("data", (chunk) => chunks.push(chunk));
                res.on("end", () => resolve(Buffer.concat(chunks)));
              } else {
                reject(
                  new Error(`GET ${url} failed: status ${res.statusCode}`)
                );
              }
            })
            .on("error", reject);
          }
          fetch(args.path);
        });
        return { contents };
      });
    },
  });
  ~~~
  然后我们新建build.js文件，内容如下:
  ~~~js
  const { build } = require("esbuild");
  const httpImport = require("./http-import-plugin");
  async function runBuild() {
    build({
      absWorkingDir: process.cwd(),
      entryPoints: ["./src/index.jsx"],
      outdir: "dist",
      bundle: true,
      format: "esm",
      splitting: true,
      sourcemap: true,
      metafile: true,
      plugins: [httpImport()],
    }).then(() => {
      console.log("🚀 Build Finished!");
    });
  }
  runBuild();
  ~~~
  通过node build.js执行打包脚本，发现插件不能 work，会抛出一个错误。
  <br>
  <br>
  除了要解析 react-dom 这种直接依赖的路径，还要解析它依赖的路径，也就是间接依赖的路径。
  <br>
  <br>
  加入这样一段onResolve钩子逻辑:
  ~~~js
  // 拦截间接依赖的路径，并重写路径
  // tip: 间接依赖同样会被自动带上 `http-url`的 namespace
  build.onResolve({ filter: /.*/, namespace: "http-url" }, (args) => ({
    // 重写路径
    path: new URL(args.path, args.importer).toString(),
    namespace: "http-url",
  }));
  ~~~
  再次执行node build.js，发现依赖已经成功下载并打包
<br>
<br>
- 实战 2: 实现 HTML 构建插件
<br>
<br>
Esbuild 作为一个前端打包工具，本身并不具备 HTML 的构建能力。也就是说，当它把 js/css 产物打包出来的时候，并不意味着前端的项目可以直接运行了，我们还需要一份对应的入口 HTML 文件。而这份 HTML 文件当然可以手写一个，但手写显得比较麻烦，尤其是产物名称带哈希值的时候，每次打包完都要替换路径。那么，我们能不能通过 Esbuild 插件的方式来自动化地生成 HTML 呢？
  <br>
  <br>
  在 Esbuild 插件的 onEnd 钩子中可以拿到 metafile 对象的信息。那么，这个对象究竟什么样呢？
  ~~~json
  {
    "inputs": { /* 省略内容 */ },
    "output": {
      "dist/index.js": {
        imports: [],
        exports: [],
        entryPoint: 'src/index.jsx',
        inputs: {
          'http-url:https://cdn.skypack.dev/-/object-assign@v4.1.1-LbCnB3r2y2yFmhmiCfPn/dist=es2019,mode=imports/optimized/object-assign.js': { bytesInOutput: 1792 },
          'http-url:https://cdn.skypack.dev/-/react@v17.0.1-yH0aYV1FOvoIPeKBbHxg/dist=es2019,mode=imports/optimized/react.js': { bytesInOutput: 10396 },
          'http-url:https://cdn.skypack.dev/-/scheduler@v0.20.2-PAU9F1YosUNPKr7V4s0j/dist=es2019,mode=imports/optimized/scheduler.js': { bytesInOutput: 9084 },
          'http-url:https://cdn.skypack.dev/-/react-dom@v17.0.1-oZ1BXZ5opQ1DbTh7nu9r/dist=es2019,mode=imports/optimized/react-dom.js': { bytesInOutput: 183229 },
          'http-url:https://cdn.skypack.dev/react-dom': { bytesInOutput: 0 },
          'src/index.jsx': { bytesInOutput: 178 }
        },
        bytes: 205284
      },
      "dist/index.js.map": { /* 省略内容 */ }
    }
  }
  ~~~
  从outputs属性中我们可以看到产物的路径，这意味着我们可以在插件中拿到所有 js 和 css 产物，然后自己组装、生成一个 HTML，实现自动化生成 HTML 的效果。
  <br>
  <br>
  我们接着来实现一下这个插件的逻辑，首先新建html-plugin.js，内容如下:
  ~~~ts
  const fs = require("fs/promises");
  const path = require("path");
  const { createScript, createLink, generateHTML } = require('./util');
    
  module.exports = () => {
    return {
      name: "esbuild:html",
      setup(build) {
        build.onEnd(async (buildResult) => {
          if (buildResult.errors.length) {
            return;
          }
          const { metafile } = buildResult;
          // 1. 拿到 metafile 后获取所有的 js 和 css 产物路径
          const scripts = [];
          const links = [];
          if (metafile) {
            const { outputs } = metafile;
            const assets = Object.keys(outputs);

            assets.forEach((asset) => {
              if (asset.endsWith(".js")) {
                scripts.push(createScript(asset));
              } else if (asset.endsWith(".css")) {
                links.push(createLink(asset));
              }
            });
          }
          // 2. 拼接 HTML 内容
          const templateContent = generateHTML(scripts, links);
          // 3. HTML 写入磁盘
          const templatePath = path.join(process.cwd(), "index.html");
          await fs.writeFile(templatePath, templateContent);
        });
      },
    };
  }
  // util.js
  // 一些工具函数的实现
  const createScript = (src) => `<script type="module" src="${src}"></script>`;
  const createLink = (src) => `<link rel="stylesheet" href="${src}"></link>`;
  const generateHTML = (scripts, links) => `
    <!DOCTYPE html>
    <html lang="en">
      <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Esbuild App</title>
        ${links.join("\n")}
      </head>
      <body>
        <div id="root"></div>
          ${scripts.join("\n")}
      </body>
    </html>
    `;
  module.exports = { createLink, createScript, generateHTML };
  ~~~
  现在我们在 build.js 中引入 html 插件:
  ~~~ts
  const html = require("./html-plugin");

  // esbuild 配置
  plugins: [
    // 省略其它插件
    html()
  ]
  ~~~
  然后执行node build.js对项目进行打包，你就可以看到 index.html 已经成功输出到根目录。接着，我们通过 serve 起一个本地静态文件服务器:
  ~~~shell
  # 1. 全局安装 serve
  npm i -g serve
  # 2. 在项目根目录执行
  serve .
  ~~~

## Rollup
Rollup 是一款基于 ES Module 模块规范实现的 JavaScript 打包工具，在前端社区中赫赫有名，同时也在 Vite 的架构体系中发挥着重要作用。不仅是 Vite 生产环境下的打包工具，其插件机制也被 Vite 所兼容，可以说是 Vite 的构建基石。因此，掌握 Rollup 也是深入学习 Vite 的必经之路。
- 快速上手
  ~~~shell
  # 安装
  pnpm i rollup
  ~~~
  接着新增 src/index.js 和 src/util.js 和rollup.config.js 三个文件
  ~~~js
  // src/index.js
  import { add } from "./util";
  console.log(add(1, 2));

  // src/util.js
  export const add = (a, b) => a + b;

  export const multi = (a, b) => a * b;
  
  // rollup.config.js
  // 以下注释是为了能使用 VSCode 的类型提示
  /**
   * @type { import('rollup').RollupOptions }
  */
  const buildOptions = {
    input: ["src/index.js"],
    output: {
      // 产物输出目录
      dir: "dist/es",
      // 产物格式
      format: "esm",
    },
  };

  export default buildOptions;
  ~~~
  可以在package.json中加入如下的构建脚本:
  ~~~json
  {
    // rollup 打包命令，`-c` 表示使用配置文件中的配置
    "build": "rollup -c"
  }
  ~~~
  执行```npm run build``` 打包成功，我们可以去 dist/es 目录查看一下产物的内容:
  ~~~js
  // dist/es/index.js
  // 代码已经打包到一起
  const add = (a, b) => a + b;

  console.log(add(1, 2));
  ~~~
  同时你也可以发现，util.js中的multi方法并没有被打包到产物中，这是因为 Rollup 具有天然的 Tree Shaking 功能，可以分析出未使用到的模块并自动擦除。
  <br>
  <br>
- 常用配置解读
  <br>
  <br>
  1. 多产物配置
     <br>
     <br>
     打包 JavaScript 类库的场景中，我们通常需要对外暴露出不同格式的产物供他人使用，不仅包括 ESM，也需要包括诸如CommonJS、UMD等格式，保证良好的兼容性。
     ~~~js
     // rollup.config.js
     /**
     * @type { import('rollup').RollupOptions }
     */
     const buildOptions = {
       input: ["src/index.js"],
       // 将 output 改造成一个数组
       output: [
         {
           dir: "dist/es",
           format: "esm",
         },
         {
           dir: "dist/cjs",
           format: "cjs",
         },
       ],
     };

     export default buildOptions;
     ~~~
     从代码中可以看到，我们将output属性配置成一个数组，数组中每个元素都是一个描述对象，决定了不同产物的输出行为。
  <br>
  <br>
  2. 多入口配置
     <br>
     <br>
     除了多产物配置，Rollup 中也支持多入口配置，而且通常情况下两者会被结合起来使用。接下来，就让我们继续改造之前的配置文件，将 input 设置为一个数组或者一个对象，如下所示:
     ~~~ts
     {
       input: ["src/index.js", "src/util.js"]
     }
     // 或者
     {
       input: {
         index: "src/index.js",
         util: "src/util.js"
       }
     }
     ~~~
     通过执行npm run build可以发现，所有入口的不同格式产物已经成功输出，如果不同入口对应的打包配置不一样，我们也可以默认导出一个配置数组，如下所示:
     ~~~js
     // rollup.config.js
     /**
     * @type { import('rollup').RollupOptions }
     */
     const buildIndexOptions = {
       input: ["src/index.js"],
       output: [
         // 省略 output 配置
       ],
     };

     /**
     * @type { import('rollup').RollupOptions }
     */
     const buildUtilOptions = {
       input: ["src/util.js"],
       output: [
         // 省略 output 配置
       ],
     };

     export default [buildIndexOptions, buildUtilOptions];
     ~~~
     如果是比较复杂的打包场景(如 [Vite 源码本身的打包](https://github.com/vitejs/vite/blob/main/packages/vite/rollup.config.ts))，我们需要将项目的代码分成几个部分，用不同的 Rollup 配置分别打包，这种配置就很有用了。
     <br>
     <br>
  3. 自定义output配置
     <br>
     <br>
     刚才我们提到了input的使用，主要用来声明入口，可以配置成字符串、数组或者对象，使用比较简单。而output与之相对，用来配置输出的相关信息，常用的配置项如下:
     ~~~js
     output: {
       // 产物输出目录
       dir: path.resolve(__dirname, 'dist'),
       // 以下三个配置项都可以使用这些占位符:
       // 1. [name]: 去除文件后缀后的文件名
       // 2. [hash]: 根据文件名和文件内容生成的 hash 值
       // 3. [format]: 产物模块格式，如 es、cjs
       // 4. [extname]: 产物后缀名(带`.`)
       // 入口模块的输出文件名
       entryFileNames: `[name].js`,
       // 非入口模块(如动态 import)的输出文件名
       chunkFileNames: 'chunk-[hash].js',
       // 静态资源文件输出文件名
       assetFileNames: 'assets/[name]-[hash][extname]',
       // 产物输出格式，包括`amd`、`cjs`、`es`、`iife`、`umd`、`system`
       format: 'cjs',
       // 是否生成 sourcemap 文件
       sourcemap: true,
       // 如果是打包出 iife/umd 格式，需要对外暴露出一个全局变量，通过 name 配置变量名
       name: 'MyBundle',
       // 全局变量声明
       globals: {
         // 项目中可以直接用`$`代替`jquery`
         jquery: '$'
       }
     }
     ~~~
     <br>
  4. 依赖 external
     <br>
     <br>
     对于某些第三方包，有时候我们不想让 Rollup 进行打包，也可以通过 external 进行外部化:
     ~~~js
     {
       external: ['react', 'react-dom']
     }
     ~~~
     在 SSR 构建或者使用 ESM CDN 的场景中，这个配置将非常有用。
     <br>
     <br>
  5. 接入插件能力
     <br>
     <br>
     Rollup 的日常使用中，我们难免会遇到一些 Rollup 本身不支持的场景，比如兼容 CommonJS 打包、注入环境变量、配置路径别名、压缩产物代码 等等。这个时候就需要我们引入相应的 Rollup 插件。
     <br>
     <br>
     虽然 Rollup 能够打包输出出 CommonJS 格式的产物，但对于输入给 Rollup 的代码并不支持 CommonJS，仅仅支持 ESM。你可能会说，那我们直接在项目中统一使用 ESM 规范就可以了啊，这有什么问题呢？需要注意的是，我们不光要考虑项目本身的代码，还要考虑第三方依赖。目前为止，还是有不少第三方依赖只有 CommonJS 格式产物而并未提供 ESM 产物，比如项目中用到 lodash 时，打包项目会出现这样的报错：
     ~~~shell
     [!] Error: 'merge' is not exported by node_modules/-ppm/registry.npmmirror. com+Lodash@4.17.21/node_modules/Loda sh/lodash.js, imported by src/index.js
     https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module
     src/index. js (6:9)
     4:
     5: import { add, multi } from ". /util";
     6: import { merge } from "lodash";
                 ^
     7: console. log (merge);
     8: console. log (add (1, 2));
     Error:
     "merge' is not exported by node_modules/ -pnpm/ reg istry.npmmirror.contlodash@4. 17-21/noce_ modula高4u2 最果 &
     odash. js, imported by src/index. js
     ~~~
     因此，我们需要引入额外的插件去解决这个问题。
     <br>
     <br>
     首先需要安装两个核心的插件包:
     ~~~shell
     pnpm i @rollup/plugin-node-resolve @rollup/plugin-commonjs
     ~~~
     * @rollup/plugin-node-resolve是为了允许我们加载第三方依赖，否则像import React from 'react' 的依赖导入语句将不会被 Rollup 识别。
     * @rollup/plugin-commonjs 的作用是将 CommonJS 格式的代码转换为 ESM 格式
       
     <br>
     然后让我们在配置文件中导入这些插件:
     
     ~~~js
     // rollup.config.js
     import resolve from "@rollup/plugin-node-resolve";
     import commonjs from "@rollup/plugin-commonjs";

     /**
     * @type { import('rollup').RollupOptions }
     */
     export default {
       input: ["src/index.js"],
       output: [
         {
           dir: "dist/es",
           format: "esm",
         },
         {
           dir: "dist/cjs",
           format: "cjs",
         },
       ],
       // 通过 plugins 参数添加插件
       plugins: [resolve(), commonjs()],
     };
     ~~~
     我们以lodash这个只有 CommonJS 产物的第三方包为例测试一下:
     ~~~shell
     pnpm i lodash
     ~~~
     ~~~js
     // src/index.js
     import { merge } from "lodash";
     console.log(merge);
     ~~~
     执行 npm run build，你可以发现产物已经正常生成了
     <br>
     <br>
     Rollup 配置文件中，plugins除了可以与 output 配置在同一级，也可以配置在 output 参数里面，如:
     ~~~js
     // rollup.config.js
     import { terser } from 'rollup-plugin-terser'
     import resolve from "@rollup/plugin-node-resolve";
     import commonjs from "@rollup/plugin-commonjs";

     export default {
       output: {
         // 加入 terser 插件，用来压缩代码
         plugins: [terser()]
       },
       plugins: [resolve(), commonjs()]
     }
     ~~~
     需要注意的是，output.plugins中配置的插件是有一定限制的，只有使用Output 阶段相关钩子的插件才能够放到这个配置中，大家可以去[这个站点](https://github.com/rollup/awesome#output)查看 Rollup 的 Output 插件列表。
     <br>
     <br>
     比较常用的 Rollup 插件库:

     * @rollup/plugin-json： 支持.json的加载，并配合rollup的Tree Shaking机制去掉未使用的部分，进行按需打包。
     * @rollup/plugin-babel：在 Rollup 中使用 Babel 进行 JS 代码的语法转译。
     * @rollup/plugin-typescript: 支持使用 TypeScript 开发。
     * @rollup/plugin-alias：支持别名配置。
     * @rollup/plugin-replace：在 Rollup 进行变量字符串的替换。
     * rollup-plugin-visualizer: 对 Rollup 打包产物进行分析，自动生成产物体积可视化分析图。
     <br>
     

  - JavaScript API 方式调用
    <br>
    <br>
    以上我们通过Rollup的配置文件结合rollup -c完成了 Rollup 的打包过程，但有些场景下我们需要基于 Rollup 定制一些打包过程，配置文件就不够灵活了，这时候我们需要用到对应 JavaScript API 来调用 Rollup，主要分为rollup.rollup和rollup.watch两个 API
    <br>
    <br>
    首先是 rollup.rollup，用来一次性地进行 Rollup 打包，你可以新建build.js，内容如下:
    ~~~js
    // build.js
    const rollup = require("rollup");

    // 常用 inputOptions 配置
    const inputOptions = {
      input: "./src/index.js",
      external: [],
      plugins:[]
    };

    const outputOptionsList = [
      // 常用 outputOptions 配置
      {
        dir: 'dist/es',
        entryFileNames: `[name].[hash].js`,
        chunkFileNames: 'chunk-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        format: 'es',
        sourcemap: true,
        globals: {
          lodash: '_'
        }
      }
      // 省略其它的输出配置
    ];

    async function build() {
      let bundle; 
      let buildFailed = false;
      try {
        // 1. 调用 rollup.rollup 生成 bundle 对象
        bundle = await rollup.rollup(inputOptions);
        for (const outputOptions of outputOptionsList) {
          // 2. 拿到 bundle 对象，根据每一份输出配置，调用 generate 和 write 方法分别生成和写入产物
          const { output } = await bundle.generate(outputOptions);
          await bundle.write(outputOptions);
        }
      } catch (error) {
        buildFailed = true;
        console.error(error);
      }
      if (bundle) {
        // 最后调用 bundle.close 方法结束打包
        await bundle.close();
      }
      process.exit(buildFailed ? 1 : 0);
    }

    build();
    ~~~
    主要的执行步骤如下:

    * 通过 rollup.rollup方法，传入 inputOptions，生成 bundle 对象;
    * 调用 bundle 对象的 generate 和 write 方法，传入outputOptions，分别完成产物和生成和磁盘写入。
    * 调用 bundle 对象的 close 方法来结束打包。
    <br>
    <br>
    
    接着你可以执行node build.js，这样，我们就可以完成了以编程的方式来调用 Rollup 打包的过程。
    <br>
    <br>
    除了通过rollup.rollup完成一次性打包，我们也可以通过rollup.watch来完成watch模式下的打包，即每次源文件变动后自动进行重新打包。你可以新建watch.js文件，内容入下:
    ~~~js
    // watch.js
    const rollup = require("rollup");

    const watcher = rollup.watch({
      // 和 rollup 配置文件中的属性基本一致，只不过多了`watch`配置
      input: "./src/index.js",
      output: [
        {
          dir: "dist/es",
          format: "esm",
        },
        {
          dir: "dist/cjs",
          format: "cjs",
        },
      ],
      watch: {
        exclude: ["node_modules/**"],
        include: ["src/**"],
      },
    });

    // 监听 watch 各种事件
    watcher.on("restart", () => {
      console.log("重新构建...");
    });

    watcher.on("change", (id) => {
      console.log("发生变动的模块id: ", id);
    });

    watcher.on("event", (e) => {
      if (e.code === "BUNDLE_END") {
        console.log("打包信息:", e);
      }
    });
    ~~~
    通过执行node watch.js开启 Rollup 的 watch 打包模式，当你改动一个文件后可以看到如下的日志，说明 Rollup 自动进行了重新打包，并触发相应的事件回调函数:
    ~~~js
    发生变动的模块id: /xxx/src/index.js
    重新构建...
    打包信息: {
      code: 'BUNDLE_END',
      duration: 10,
      input: './src/index.js',
      output: [
        // 输出产物路径
      ],
      result: {
        cache: { /* 产物具体信息 */ },
        close: [AsyncFunction: close],
        closed: false,
        generate: [AsyncFunction: generate],
        watchFiles: [
          // 监听文件列表
        ],
        write: [AsyncFunction: write]
      }
    }
    ~~~
    基于如上的两个 JavaScript API 我们可以很方便地在代码中调用 Rollup 的打包流程，相比于配置文件有了更多的操作空间，你可以在代码中通过这些 API 对 Rollup 打包过程进行定制，甚至是二次开发。


































## 起步

创建项目: npm init @vitejs/app

vue3支持jsx语法: yarn add -D @vitejs/plugin-vue-jsx

vite创建vue2:
 
先创建原生项目,再安装插件: yarn add  vite-plugin-vue2 vue vue-template-compiler
