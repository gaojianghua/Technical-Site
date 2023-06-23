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








































## 起步

创建项目: npm init @vitejs/app

vue3支持jsx语法: yarn add -D @vitejs/plugin-vue-jsx

vite创建vue2:
 
先创建原生项目,再安装插件: yarn add  vite-plugin-vue2 vue vue-template-compiler
