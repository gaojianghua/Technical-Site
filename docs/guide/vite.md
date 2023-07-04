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
- 项目初始化pnpm
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

## Rollup 基本概念及使用
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

## 深入理解 Rollup 的插件机制
仅仅使用 Rollup 内置的打包能力很难满足项目日益复杂的构建需求。对于一个真实的项目构建场景来说，我们还需要考虑到模块打包之外的问题，比如路径别名(alias) 、全局变量注入和代码压缩等等。
<br>
<br>
可要是把这些场景的处理逻辑与核心的打包逻辑都写到一起，一来打包器本身的代码会变得十分臃肿，二来也会对原有的核心代码产生一定的侵入性，混入很多与核心流程无关的代码，不易于后期的维护。因此 ，Rollup 设计出了一套完整的插件机制，将自身的核心逻辑与插件逻辑分离，让你能按需引入插件功能，提高了 Rollup 自身的可扩展性。
<br>
<br>
Rollup 的打包过程中，会定义一套完整的构建生命周期，从开始打包到产物输出，中途会经历一些标志性的阶段，并且在不同阶段会自动执行对应的插件钩子函数(Hook)。对 Rollup 插件来讲，最重要的部分是钩子函数，一方面它定义了插件的执行逻辑，也就是"做什么"；另一方面也声明了插件的作用阶段，即"什么时候做"，这与 Rollup 本身的构建生命周期息息相关。
<br>
<br>
因此，要真正理解插件的作用范围和阶段，首先需要了解 Rollup 整体的构建过程中到底做了些什么。

- **Rollup 整体构建阶段**
  <br>
  <br>
  在执行 rollup 命令之后，在 cli 内部的主要逻辑简化如下:
  ~~~js
  // Build 阶段
  const bundle = await rollup.rollup(inputOptions);

  // Output 阶段
  await Promise.all(outputOptions.map(bundle.write));

  // 构建结束
  await bundle.close();
  ~~~
  首先，Build 阶段主要负责创建模块依赖图，初始化各个模块的 AST 以及模块之间的依赖关系。下面我们用一个简单的例子来感受一下:
  ~~~js
  // src/index.js
  import { a } from './module-a';
  console.log(a);

  // src/module-a.js
  export const a = 1;
  ~~~
  执行如下构建脚本:

  ~~~js
  const rollup = require('rollup');
  const util = require('util');
  async function build() {
    const bundle = await rollup.rollup({
      input: ['./src/index.js'],
    });
    console.log(util.inspect(bundle));
  }
  build();
  ~~~
  可以看到这样的 bundle 对象信息:
  ~~~js
  {
    cache: {
      modules: [
        {
          ast: 'AST 节点信息，具体内容省略',
          code: 'export const a = 1;',
          dependencies: [],
          id: '/Users/code/rollup-demo/src/data.js',
          // 其它属性省略
        },
        {
          ast: 'AST 节点信息，具体内容省略',
          code: "import { a } from './data';\n\nconsole.log(a);",
          dependencies: [
            '/Users/code/rollup-demo/src/data.js'
          ],
          id: '/Users/code/rollup-demo/src/index.js',
          // 其它属性省略
        }
      ],
      plugins: {}
    },
    closed: false,
    // 挂载后续阶段会执行的方法
    close: [AsyncFunction: close],
    generate: [AsyncFunction: generate],
    write: [AsyncFunction: write]
  }
  ~~~
  从上面的信息中可以看出，目前经过 Build 阶段的 bundle 对象其实并没有进行模块的打包，这个对象的作用在于存储各个模块的内容及依赖关系，同时暴露generate和write方法，以进入到后续的 Output 阶段（write和generate方法唯一的区别在于前者打包完产物会写入磁盘，而后者不会）。
  <br>
  <br>
  所以，真正进行打包的过程会在 Output 阶段进行，即在bundle对象的 generate或者write方法中进行。还是以上面的 demo 为例，我们稍稍改动一下构建逻辑:
  ~~~ts
  const rollup = require('rollup');
  async function build() {
    const bundle = await rollup.rollup({
      input: ['./src/index.js'],
    });
    const result = await bundle.generate({
      format: 'es',
    });
    console.log('result:', result);
  }

  build();
  ~~~
  执行后可以得到如下的输出:
  ~~~js
  {
    output: [
      {
        exports: [],
        facadeModuleId: '/Users/code/rollup-demo/src/index.js',
        isEntry: true,
        isImplicitEntry: false,
        type: 'chunk',
        code: 'const a = 1;\n\nconsole.log(a);\n',
        dynamicImports: [],
        fileName: 'index.js',
        // 其余属性省略
      }
    ]
  }
  ~~~
  这里可以看到所有的输出信息，生成的output数组即为打包完成的结果。当然，如果使用 bundle.write 会根据配置将最后的产物写入到指定的磁盘目录中。
  <br>
  <br>
  <b>因此，对于一次完整的构建过程而言， Rollup 会先进入到 Build 阶段，解析各模块的内容及依赖关系，然后进入Output阶段，完成打包及输出的过程。对于不同的阶段，Rollup 插件会有不同的插件工作流程，接下来我们就来拆解一下 Rollup 插件在 Build 和 Output 两个阶段的详细工作流程。</b>
  <br>
  <br>
- **拆解插件工作流**
  <br>
  <br>
  插件的各种 Hook 可以根据这两个构建阶段分为两类: <b>Build Hook</b> 与 <b>Output Hook</b>。
  + <b>Build Hook</b>即在Build阶段执行的钩子函数，在这个阶段主要进行模块代码的转换、AST 解析以及模块依赖的解析，那么这个阶段的 Hook 对于代码的操作粒度一般为模块级别，也就是单文件级别。
  + <b>Output Hook</b>(官方称为Output Generation Hook)，则主要进行代码的打包，对于代码而言，操作粒度一般为 chunk级别(一个 chunk 通常指很多文件打包到一起的产物)。
  <br>
  <br>
  
  除了根据构建阶段可以将 Rollup 插件进行分类，根据不同的 Hook 执行方式也会有不同的分类，主要包括Async、Sync、Parallel、Sequential、First这五种。在后文中我们将接触各种各样的插件 Hook，但无论哪个 Hook 都离不开这五种执行方式。
  <br>
  1. <b>Async & Sync</b>
  
     两者是相对的，分别代表异步和同步的钩子函数，两者最大的区别在于同步钩子里面不能有异步逻辑，而异步钩子可以有。
  2. <b>Parallel</b>

     指并行的钩子函数。如果有多个插件实现了这个钩子的逻辑，一旦有钩子函数是异步逻辑，则并发执行钩子函数，不会等待当前钩子完成(底层使用 Promise.all)。
     <br>
     <br>
     比如对于Build阶段的buildStart钩子，它的执行时机其实是在构建刚开始的时候，各个插件可以在这个钩子当中做一些状态的初始化操作，但其实<b>插件之间的操作并不是相互依赖的</b>，也就是可以并发执行，从而提升构建性能。反之，对于<b>需要依赖其他插件处理结果的情况</b>就不适合用 Parallel 钩子了，比如 transform。
  3. <b>Sequential</b>
  
     指串行的钩子函数。这种 Hook 往往适用于插件间处理结果相互依赖的情况，前一个插件 Hook 的返回值作为后续插件的入参，这种情况就需要等待前一个插件执行完 Hook，获得其执行结果，然后才能进行下一个插件相应 Hook 的调用，如transform。

  4. <b>First</b>

     如果有多个插件实现了这个 Hook，那么 Hook 将依次运行，直到返回一个非 null 或非 undefined 的值为止。比较典型的 Hook 是 resolveId，一旦有插件的 resolveId 返回了一个路径，将停止执行后续插件的 resolveId 逻辑。
  
  <br>
  实际上不同的类型是可以叠加的，Async/Sync 可以搭配后面三种类型中的任意一种，比如一个 Hook既可以是 Async 也可以是 First 类型，接着我们将来具体分析 Rollup 当中的插件工作流程，里面会涉及到具体的一些 Hook，大家可以具体地感受一下。
  <br><br>
- **Build 阶段工作流**
![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/58ce9fa2b0f14dd1bc50a9c849157e43~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.png)

  分析 `Build Hooks` 的工作流程:
  1. 首先经历 options 钩子进行配置的转换，得到处理后的配置对象。

  2. 随之 `Rollup` 会调用 `buildStart` 钩子，正式开始构建流程。

  3. `Rollup` 先进入到 `resolveId` 钩子中解析文件路径。(从 `input` 配置指定的入口文件开始)。

  4. `Rollup` 通过调用load钩子加载模块内容。

  5. 紧接着 `Rollup` 执行所有的 `transform` 钩子来对模块内容进行进行自定义的转换，比如 `babel` 转译。

  6. 现在 `Rollup` 拿到最后的模块内容，进行 `AST` 分析，得到所有的 `import` 内容，调用 `moduleParsed` 钩子:

     * 如果是普通的 `import`，则执行 `resolveId` 钩子，继续回到步骤3。 
     * 如果是动态 `import`，则执行 `resolveDynamicImport` 钩子解析路径，如果解析成功，则回到步骤4加载模块，否则回到步骤3通过 `resolveId` 解析路径。
  7. 直到所有的 `import` 都解析完毕，`Rollup` 执行 `buildEnd` 钩子，`Build` 阶段结束。
     
  8. 随后会调用 `generateBundle` 钩子，这个钩子的入参里面会包含所有的打包产物信息，包括 **chunk** (打包后的代码)、**asset**(最终的静态资源文件)。你可以在这里删除一些 `chunk` 或者 `asset`，最终这些内容将不会作为产物输出。

  9. 前面提到了 `rollup.rollup` 方法会返回一个 `bundle` 对象，这个对象是包含 `generate` 和 `write` 两个方法，两个方法唯一的区别在于后者会将代码写入到磁盘中，同时会触发 `writeBundle` 钩子，传入所有的打包产物信息，包括 `chunk` 和 `asset`，和 `generateBundle` 钩子非常相似。不过值得注意的是，这个钩子执行的时候，产物已经输出了，而 `generateBundle` 执行的时候产物还并没有输出。顺序如下图所示:
     ![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/12142ea189be4a8f918cf247f408487e~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.png)
  10. 当上述的 `bundle` 的 `close` 方法被调用时，会触发`closeBundle`钩子，到这里 `Output` 阶段正式结束。
  >注意: 当打包过程中任何阶段出现错误，会触发 renderError 钩子，然后执行 closeBundle 钩子结束打包。

<br>

- **常用 Hook 实战**

  实际上开发 Rollup 插件就是在编写一个个 Hook 函数，你可以理解为一个 Rollup 插件基本就是各种 Hook 函数的组合。
  1. **路径解析: resolveId**
    
     resolveId 钩子一般用来解析模块路径，为Async + First类型即异步优先的钩子。这里我们拿官方的 [alias 插件](https://github.com/rollup/plugins/blob/master/packages/alias/src/index.ts) 来说明，这个插件用法演示如下:
     ~~~js
     // rollup.config.js
     import alias from '@rollup/plugin-alias';
     module.exports = {
       input: 'src/index.js',
       output: {
         dir: 'output',
         format: 'cjs'
       },
       plugins: [
         alias({
           entries: [
             // 将把 import xxx from 'module-a'
             // 转换为 import xxx from './module-a'
             { find: 'module-a', replacement: './module-a.js' },
           ]
         })
       ]
     };
     ~~~
     插件的代码简化后如下:
     ~~~js
     export default alias(options) {
       // 获取 entries 配置
       const entries = getEntries(options);
       return {
         // 传入三个参数，当前模块路径、引用当前模块的模块路径、其余参数
         resolveId(importee, importer, resolveOptions) {
           // 先检查能不能匹配别名规则
           const matchedEntry = entries.find((entry) => matches(entry.find, importee));
           // 如果不能匹配替换规则，或者当前模块是入口模块，则不会继续后面的别名替换流程
           if (!matchedEntry || !importerId) {
             // return null 后，当前的模块路径会交给下一个插件处理
             return null;
           }
           // 正式替换路径
           const updatedId = normalizeId(
             importee.replace(matchedEntry.find, matchedEntry.replacement)
           );
           // 每个插件执行时都会绑定一个上下文对象作为 this
           // 这里的 this.resolve 会执行所有插件(除当前插件外)的 resolveId 钩子
           return this.resolve(
             updatedId,
             importer,
             Object.assign({ skipSelf: true }, resolveOptions)
           ).then((resolved) => {
             // 替换后的路径即 updateId 会经过别的插件进行处理
             let finalResult: PartialResolvedId | null = resolved;
             if (!finalResult) {
               // 如果其它插件没有处理这个路径，则直接返回 updateId
               finalResult = { id: updatedId };
             }
             return finalResult;
           });
         }
       }
     }
     ~~~
     从这里你可以看到 `resolveId` 钩子函数的一些常用使用方式，它的入参分别是当前模块路径、引用当前模块的模块路径、解析参数，返回值可以是 null、string 或者一个对象，我们分情况讨论。

     * 返回值为 `null` 时，会默认交给下一个插件的 `resolveId` 钩子处理。
     * 返回值为 `string` 时，则停止后续插件的处理。这里为了让替换后的路径能被其他插件处理，特意调用了 `this.resolve` 来交给其它插件处理，否则将不会进入到其它插件的处理。
     * 返回值为一个对象，也会停止后续插件的处理，不过这个对象就可以包含更多的信息了，包括解析后的路径、是否被 external、是否需要 `tree-shaking` 等等，不过大部分情况下返回一个 string 就够用了。
    <br>
    <br>
  2. **load**

     load `为Async + First` 类型，即异步优先的钩子，和 `resolveId` 类似。它的作用是通过 `resolveId` 解析后的路径来加载模块内容。这里，我们以官方的 [image 插件](https://github.com/rollup/plugins/blob/master/packages/image/src/index.js) 为例来介绍一下 load 钩子的使用。源码简化后如下所示:
     ~~~js
     const mimeTypes = {
        '.jpg': 'image/jpeg',
        // 后面图片类型省略
     };

     export default function image(opts = {}) {
       const options = Object.assign({}, defaults, opts);
       return {
         name: 'image',
         load(id) {
           const mime = mimeTypes[extname(id)];
           if (!mime) {
             // 如果不是图片类型，返回 null，交给下一个插件处理
             return null;
           }
           // 加载图片具体内容
           const isSvg = mime === mimeTypes['.svg'];
           const format = isSvg ? 'utf-8' : 'base64';
           const source = readFileSync(id, format).replace(/[\r\n]+/gm, '');
           const dataUri = getDataUri({ format, isSvg, mime, source });
           const code = options.dom ? domTemplate({ dataUri }) : constTemplate({ dataUri });

           return code.trim();
         }
       };
     }
     ~~~
     从中可以看到，load 钩子的入参是模块 id，返回值一般是 null、string 或者一个对象：
     * 如果返回值为 null，则交给下一个插件处理；
     * 如果返回值为 string 或者对象，则终止后续插件的处理，如果是对象可以包含 SourceMap、AST 等[更详细的信息](https://rollupjs.org/guide/en/#load)。
  <br>
  <br>
  3. **代码转换: transform**

     `transform` 钩子也是非常常见的一个钩子函数，为 `Async + Sequential` 类型，也就是异步串行钩子，作用是对加载后的模块内容进行自定义的转换。我们以官方的 `replace` 插件为例，这个插件的使用方式如下:
     ~~~ts
     // rollup.config.js
     import replace from '@rollup/plugin-replace';

     module.exports = {
       input: 'src/index.js',
       output: {
         dir: 'output',
         format: 'cjs'
       },
       plugins: [
         // 将会把代码中所有的 __TEST__ 替换为 1
         replace({
            __TEST__: 1
         })
       ]
     };
     ~~~
     内部实现也并不复杂，主要通过字符串替换来实现，核心逻辑简化如下:
     ~~~ts
     import MagicString from 'magic-string';

     export default function replace(options = {}) {
       return {
         name: 'replace',
         transform(code, id) {
           // 省略一些边界情况的处理
           // 执行代码替换的逻辑，并生成最后的代码和 SourceMap
           return executeReplacement(code, id);
         }
       }
     }

     function executeReplacement(code, id) {
       const magicString = new MagicString(code);
       // 通过 magicString.overwrite 方法实现字符串替换
       if (!codeHasReplacements(code, id, magicString)) {
         return null;
       }

       const result = { code: magicString.toString() };

       if (isSourceMapEnabled()) {
         result.map = magicString.generateMap({ hires: true });
       }

       // 返回一个带有 code 和 map 属性的对象
       return result;
     }
     ~~~
     [transform 钩子](https://rollupjs.org/guide/en/#transform)的入参分别为`模块代码`、`模块 ID`，返回一个包含 `code`(代码内容) 和 `map`(SourceMap 内容) 属性的对象，当然也可以返回 `null` 来跳过当前插件的 `transform` 处理。需要注意的是，**当前插件返回的代码会作为下一个插件 transform 钩子的第一个入参**，实现类似于瀑布流的处理。
    <br>
    <br>
  4. **Chunk 级代码修改: renderChunk**

     这里我们继续以 replace插件举例，在这个插件中，也同样实现了 renderChunk 钩子函数:
     ~~~ts
     export default function replace(options = {}) {
     return {
       name: 'replace',
       transform(code, id) {
         // transform 代码省略
         },
         renderChunk(code, chunk) {
           const id = chunk.fileName;
           // 省略一些边界情况的处理
           // 拿到 chunk 的代码及文件名，执行替换逻辑
           return executeReplacement(code, id);
         },
       }
     }
     ~~~
     可以看到这里 `replace` 插件为了替换结果更加准确，在 `renderChunk` 钩子中又进行了一次替换，因为后续的插件仍然可能在 `transform` 中进行模块内容转换，进而可能出现符合替换规则的字符串。
     <br>
     <br>
     这里我们把关注点放到 `renderChunk` 函数本身，可以看到有两个入参，分别为 `chunk 代码内容`、[chunk 元信息](https://rollupjs.org/guide/en/#generatebundle)，返回值跟 `transform` 钩子类似，既可以返回包含 code 和 map 属性的对象，也可以通过返回 null 来跳过当前钩子的处理。
     <br>
     <br>
  5. **产物生成最后一步: generateBundle**

     generateBundle 也是**异步串行**的钩子，你可以在这个钩子里面自定义删除一些无用的 chunk 或者静态资源，或者自己添加一些文件。这里我们以 Rollup 官方的 `html 插件`来具体说明，这个插件的作用是通过拿到 Rollup 打包后的资源来生成包含这些资源的 HTML 文件，源码简化后如下所示:
     ~~~ts
     export default function html(opts: RollupHtmlOptions = {}): Plugin {
       // 初始化配置
       return {
         name: 'html',
         async generateBundle(output: NormalizedOutputOptions, bundle: OutputBundle) {
           // 省略一些边界情况的处理
           // 1. 获取打包后的文件
           const files = getFiles(bundle);
           // 2. 组装 HTML，插入相应 meta、link 和 script 标签
           const source = await template({ attributes, bundle, files, meta, publicPath, title});
           // 3. 通过上下文对象的 emitFile 方法，输出 html 文件
           const htmlFile: EmittedAsset = {
             type: 'asset',
             source,
             name: 'Rollup HTML Asset',
             fileName
           };
           this.emitFile(htmlFile);
         }
       }
     }
     ~~~
     相信从插件的具体实现中，你也能感受到这个钩子的强大作用了。入参分别为`output 配置`、[所有打包产物的元信息对象](https://rollupjs.org/guide/en/#generatebundle)，通过操作元信息对象你可以删除一些不需要的 chunk 或者静态资源，也可以通过 插件上下文对象的 `emitFile 方法`输出自定义文件。


## Vite 高级应用
虽然 Vite 的插件机制是基于 Rollup 来设计的，并且前面我们也已经对 Rollup 的插件机制进行了详细的解读，但实际上 Vite 的插件机制也包含了自己独有的一部分，与 Rollup 的各个插件 Hook 并非完全兼容，因此本节我们将重点关注 Vite 独有的部分以及和 Rollup 所区别的部分。
- 简单的插件示例

  Vite 插件与 Rollup 插件结构类似，为一个name和各种插件 Hook 的对象:
  ~~~ts
  {
    // 插件名称
    name: 'vite-plugin-xxx',
    load(code) {
      // 钩子逻辑
    },
  }
  ~~~
  >如果插件是一个 npm 包，在package.json中的包命名也推荐以vite-plugin开头

  一般情况下因为要考虑到外部传参，我们不会直接写一个对象，而是实现一个返回插件对象的工厂函数，如下代码所示:
  ~~~ts
  // myPlugin.js
  export function myVitePlugin(options) {
    console.log(options)
    return {
      name: 'vite-plugin-xxx',
      load(id) {
        // 在钩子逻辑中可以通过闭包访问外部的 options 传参
      } 
    }
  }

  // 使用方式
  // vite.config.ts
  import { myVitePlugin } from './myVitePlugin';
  export default {
    plugins: [myVitePlugin({ /* 给插件传参 */ })]
  }
  ~~~

- **插件 Hook 介绍**
  1. **通用 Hook**
  
     Vite **开发阶段**会模拟 Rollup 的行为，其中 Vite 会调用一系列与 Rollup 兼容的钩子，这个钩子主要分为三个阶段:
     * **服务器启动阶段**: options和buildStart钩子会在服务启动时被调用。
     * **请求响应阶段**: 当浏览器发起请求时，Vite 内部依次调用resolveId、load和transform钩子。
     * **服务器关闭阶段**: Vite 会依次执行buildEnd和closeBundle钩子。 
     <br>
     <br>
     除了以上钩子，其他 Rollup 插件钩子(如moduleParsed、renderChunk)均不会在 Vite 开发阶段调用。而生产环境下，由于 Vite 直接使用 Rollup，Vite 插件中所有 Rollup 的插件钩子都会生效。

  2. **独有 Hook**

     Vite 中特有的一些 Hook，这些 Hook 只会在 Vite 内部调用，而放到 Rollup 中会被直接忽略。
  
     * **给配置再加点料:config**

       Vite 在读取完配置文件（即vite.config.ts）之后，会拿到用户导出的配置对象，然后执行 config 钩子。在这个钩子里面，你可以对配置文件导出的对象进行自定义的操作，如下代码所示:
       ~~~ts
       // 返回部分配置（推荐）
       const editConfigPlugin = () => ({
         name: 'vite-plugin-modify-config',
         config: () => ({
           alias: {
             react: require.resolve('react')
           }
         })
       })
       ~~~
       官方推荐的姿势是在 config 钩子中返回一个配置对象，这个配置对象会和 Vite 已有的配置进行深度的合并。不过你也可以通过钩子的入参拿到 config 对象进行自定义的修改，如下代码所示:
       ~~~ts
       const mutateConfigPlugin = () => ({
         name: 'mutate-config',
         // command 为 `serve`(开发环境) 或者 `build`(生产环境)
         config(config, { command }) {
           // 生产环境中修改 root 参数
           if (command === 'build') {
             config.root = __dirname;
           }
         }
       })
       ~~~
       在一些比较深层的对象配置中，这种直接修改配置的方式会显得比较麻烦，如 optimizeDeps.esbuildOptions.plugins，需要写很多的样板代码，类似下面这样:
       ~~~ts
       // 防止出现 undefined 的情况
       config.optimizeDeps = config.optimizeDeps || {}
       config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {}
       config.optimizeDeps.esbuildOptions.plugins = config.optimizeDeps.esbuildOptions.plugins || []
       ~~~
       因此这种情况下，建议直接返回一个配置对象，这样会方便很多:
       ~~~ts
       config() {
         return {
           optimizeDeps: {
             esbuildOptions: {
               plugins: []
             }
           }
         }
       }
       ~~~
     
     * **记录最终配置:configResolved** 

       Vite 在解析完配置之后会调用configResolved钩子，这个钩子一般用来记录最终的配置信息，而不建议再修改配置，用法如下图所示:
       ~~~ts
       const exmaplePlugin = () => {
       let config

       return {
         name: 'read-config',

         configResolved(resolvedConfig) {
             // 记录最终配置
             config = resolvedConfig
           },

           // 在其他钩子中可以访问到配置
           transform(code, id) {
             console.log(config)
           }
         }
       }
       ~~~

     * **获取 Dev Server 实例: configureServer**
     
       这个钩子仅在开发阶段会被调用，用于扩展 Vite 的 Dev Server，一般用于增加自定义 server 中间件，如下代码所示:
       ~~~ts
       const myPlugin = () => ({
         name: 'configure-server',
         configureServer(server) {
           // 姿势 1: 在 Vite 内置中间件之前执行
           server.middlewares.use((req, res, next) => {
             // 自定义请求处理逻辑
           })
           // 姿势 2: 在 Vite 内置中间件之后执行
           return () => {
             server.middlewares.use((req, res, next) => {
               // 自定义请求处理逻辑
             })
           }
         }
       })
       ~~~
       
     * **转换 HTML 内容: transformIndexHtml**

       这个钩子用来灵活控制 HTML 的内容，你可以拿到原始的 html 内容后进行任意的转换:
       ~~~ts
       const htmlPlugin1 = () => {
         return {
           name: 'html-transform',
           transformIndexHtml(html) {
             return html.replace(
               /<title>(.*?)</title>/,
               `<title>换了个标题</title>`
             )
           }
         }
       }
       // 也可以返回如下的对象结构，一般用于添加某些标签
       const htmlPlugin2 = () => {
         return {
           name: 'html-transform',
           transformIndexHtml(html) {
             return {
               html,
               // 注入标签
               tags: [
                 {
                   // 放到 body 末尾，可取值还有`head`|`head-prepend`|`body-prepend`，顾名思义
                   injectTo: 'body',
                   // 标签属性定义
                   attrs: { type: 'module', src: './index.ts' },
                   // 标签名
                   tag: 'script',
                 },
               ],
             }
           }
         }
       }
       ~~~
       
     * **热更新处理: handleHotUpdate**

       这个钩子会在 Vite 服务端处理热更新时被调用，你可以在这个钩子中拿到热更新相关的上下文信息，进行热更模块的过滤，或者进行自定义的热更处理。下面是一个简单的例子:
       ~~~ts
       const handleHmrPlugin = () => {
         return {
           async handleHotUpdate(ctx) {
             // 需要热更的文件
             console.log(ctx.file)
             // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
             console.log(ctx.modules)
             // 时间戳
             console.log(ctx.timestamp)
             // Vite Dev Server 实例
             console.log(ctx.server)
             // 读取最新的文件内容
             console.log(await read())
             // 自行处理 HMR 事件
             ctx.server.ws.send({
               type: 'custom',
               event: 'special-update',
               data: { a: 1 }
             })
             return []
           }
         }
       }

       // 前端代码中加入
       if (import.meta.hot) {
         import.meta.hot.on('special-update', (data) => {
           // 执行自定义更新
           // { a: 1 }
           console.log(data)
           window.location.reload();
         })
       }
       ~~~
     <br>
     以上就是 Vite 独有的五个钩子，我们来重新梳理一下:

     * **config**: 用来进一步修改配置。
     * **configResolved**: 用来记录最终的配置信息。
     * **configureServer**: 用来获取 Vite Dev Server 实例，添加中间件。
     * **transformIndexHtml**: 用来转换 HTML 的内容。
     * **handleHotUpdate**: 用来进行热更新模块的过滤，或者进行自定义的热更新处理。
     <br><br>
  3. **插件 Hook 执行顺序**

     下面我们来复盘一下上述的两类钩子，并且通过一个具体的代码示例来汇总一下所有的钩子：
     ~~~ts
     // test-hooks-plugin.ts
     // 注: 请求响应阶段的钩子
     // 如 resolveId, load, transform, transformIndexHtml在下文介绍
     // 以下为服务启动和关闭的钩子
     export default function testHookPlugin () {
       return {
         name: 'test-hooks-plugin',
         // Vite 独有钩子
         config(config) {
           console.log('config');
         },
         // Vite 独有钩子
         configResolved(resolvedCofnig) {
           console.log('configResolved');
         },
         // 通用钩子
         options(opts) {
           console.log('options');
           return opts;
         },
         // Vite 独有钩子
         configureServer(server) {
           console.log('configureServer');
           setTimeout(() => {
             // 手动退出进程
             process.kill(process.pid, 'SIGTERM');
           }, 3000)
         },
         // 通用钩子
         buildStart() {
           console.log('buildStart');
         },
         // 通用钩子
         buildEnd() {
           console.log('buildEnd');
         },
         // 通用钩子
         closeBundle() {
           console.log('closeBundle');
         }
       }
     }
     ~~~
     将插件加入到 Vite 配置文件中，然后启动，你可以观察到各个 `Hook` 的执行顺序:
     * **服务启动阶段**: `config`、`configResolved`、`options`、`configureServer`、`buildStart`
     * **请求响应阶段**: 如果是 `html` 文件，仅执行 `transformIndexHtml` 钩子；对于非 `HTML` 文件，则依次执行 `resolveId`、`load` 和 `transform` 钩子。
     * **热更新阶段**: 执行 `handleHotUpdate` 钩子。
     * **服务关闭阶段**: 依次执行 `buildEnd` 和 `closeBundle` 钩子。
<br>
<br>
- **插件应用位置**

  默认情况下 Vite 插件同时被用于开发环境和生产环境，你可以通过`apply`属性来决定应用场景:
  ~~~ts
  {
    // 'serve' 表示仅用于开发环境，'build'表示仅用于生产环境
    apply: 'serve'
  }
  ~~~
  `apply`参数还可以配置成一个函数，进行更灵活的控制:
  ~~~ts
  apply(config, { command }) {
    // 只用于非 SSR 情况下的生产环境构建
    return command === 'build' && !config.build.ssr
  }
  ~~~
  也可以通过enforce属性来指定插件的执行顺序:
  ~~~ts
  {
    // 默认为`normal`，可取值还有`pre`和`post`
    enforce: 'pre'
  }
  ~~~
  Vite 会依次执行如下的插件(⭐️表示用户插件):

  * **Alias** (路径别名)相关的插件。
  * ⭐️ 带有 `enforce: 'pre'` 的用户插件。 
  * **Vite** 核心插件。 
  * ⭐️ 没有 `enforce` 值的用户插件，也叫普通插件。 
  * **Vite** 生产环境构建用的插件。 
  * ⭐️ 带有 `enforce: 'post'` 的用户插件。 
  * **Vite** 后置构建插件(如压缩插件)。



## 插件开发实战
- **虚拟模块加载**

  作为构建工具，一般需要处理两种形式的模块，一种存在于真实的磁盘文件系统中，另一种并不在磁盘而在内存当中，也就是虚拟模块。通过虚拟模块，我们既可以把自己手写的一些代码字符串作为单独的模块内容，又可以将内存中某些经过计算得出的变量作为模块内容进行加载，非常灵活和方便。
  ~~~shell
  # 初始化一个 react + ts 项目
  npm init vite
  ~~~
  通过pnpm i安装依赖，接着新建**plugins**目录，开始插件的开发:
  ~~~ts
  // plugins/virtual-module.ts
  import { Plugin } from 'vite';

  // 虚拟模块名称
  const virtualFibModuleId = 'virtual:fib';
  // Vite 中约定对于虚拟模块，解析后的路径需要加上`\0`前缀
  const resolvedFibVirtualModuleId = '\0' + virtualFibModuleId;

  export default function virtualFibModulePlugin(): Plugin {
    let config: ResolvedConfig | null = null;
    return {
      name: 'vite-plugin-virtual-module',
      resolveId(id) {
        if (id === virtualFibModuleId) {
          return resolvedFibVirtualModuleId;
        }
      },
      load(id) {
        // 加载虚拟模块
        if (id === resolvedFibVirtualModuleId) {
          return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }';
        }
      }
    }
  }
  ~~~
  在项目中来使用这个插件:
  ~~~ts
  // vite.config.ts
  import virtual from './plugins/virtual-module.ts'

  // 配置插件
  {
    plugins: [react(), virtual()]
  }
  ~~~
  然后在**main.tsx**中加入如下的代码:
  ~~~ts
  import fib from 'virtual:fib';

  alert(`结果: ${fib(10)}`)
  ~~~
  这里我们使用了 `virtual:fib` 这个虚拟模块，虽然这个模块不存在真实的文件系统中，但你打开浏览器后可以发现这个模块导出的函数是可以正常执行的。
  <br>
  通过虚拟模块来读取内存中的变量，在`virtual-module.ts`中增加如下代码:
  ~~~diff
  import { Plugin, ResolvedConfig } from 'vite';

  const virtualFibModuleId = 'virtual:fib';
  const resolvedFibVirtualModuleId = '\0' + virtualFibModuleId;

  + const virtualEnvModuleId = 'virtual:env';
  + const resolvedEnvVirtualModuleId = '\0' + virtualEnvModuleId;

  export default function virtualFibModulePlugin(): Plugin {
  + let config: ResolvedConfig | null = null;
    return {
      name: 'vite-plugin-virtual-fib-module',
  +   configResolved(c: ResolvedConfig) {
  +     config = c;
  +   },
      resolveId(id) {
        if (id === virtualFibModuleId) {
          return resolvedFibVirtualModuleId;
        }
  +     if (id === virtualEnvModuleId) { 
  +       return resolvedEnvVirtualModuleId;
  +     }
      },
      load(id) {
        if (id === resolvedFibVirtualModuleId) {
          return 'export default function fib(n) { return n <= 1 ? n : fib(n - 1) + fib(n - 2); }';
        }
  +     if (id === resolvedEnvVirtualModuleId) {
  +       return `export default ${JSON.stringify(config!.env)}`;
  +     }
      }
    }
  }
  ~~~
  在新增的这些代码中，我们注册了一个新的虚拟模块`virtual:env`，紧接着我们去项目去使用:
  ~~~ts
  // main.tsx
  import env from 'virtual:env';
  console.log(env)
  ~~~
  `virtual:env`一般情况下会有类型问题，我们需要增加一个类型声明文件来声明这个模块:
  ~~~ts
  // types/shim.d.ts
  declare module 'virtual:*' {
    export default any;
  }
  ~~~
  浏览器观察一下输出的情况：
  ~~~js
  {
    BASE_URL: "/",
    DEV: true,
    MODE: "development",
    PROD: false
  }
  ~~~
  Vite 环境变量能正确地在浏览器中打印出来，说明在内存中计算出来的`virtual:env`模块的确被成功地加载了。社区当中也有不少知名的插件(如 `vite-plugin-windicss`、`vite-plugin-svg-icons`等)也使用了虚拟模块的技术。
<br>
<br>
- **Svg 组件形式加载**

  在一般的项目开发过程中，我们有时候希望能将 svg 当做一个组件来引入，这样我们可以很方便地修改 svg 的各种属性，相比于img标签的引入方式也更加优雅。但 Vite 本身并不支持将 svg 转换为组件的代码，需要我们通过插件来实现。
  ~~~shell
  # 安装依赖
  pnpm i resolve @svgr/core -D
  ~~~
  在`plugins`目录新建 `svgr.ts`:
  ~~~ts
  import { Plugin } from 'vite';
  import * as fs from 'fs';
  import * as resolve from 'resolve';

  interface SvgrOptions {
    // svg 资源模块默认导出，url 或者组件
    defaultExport: 'url' | 'component';
  }

  export default function viteSvgrPlugin(options: SvgrOptions) {
    const { defaultExport='url' } = options;
    return {
      name: 'vite-plugin-svgr',
      async transform(code ,id) {
        // 转换逻辑: svg -> React 组件
      }
    }
  }
  ~~~
  先来梳理一下开发需求，用户通过传入 `defaultExport` 可以控制 svg 资源的默认导出:
    * 当 `defaultExport` 为 `component`，默认当做组件来使用，即:
      
      ~~~tsx
      import Logo from './Logo.svg';

      // 在组件中直接使用
      <Logo />
      ~~~
    * 当 `defaultExports` 为 **url**，默认当做 url 使用，如果需要用作组件，可以通过具名导入的方式来支持:
      
      ~~~tsx
      import logoUrl, { ReactComponent as Logo } from './logo.svg';

      // url 使用
      <img src={logoUrl} />
      // 组件方式使用
      <Logo />
      ~~~
    接下来整理一下插件开发的整体思路，主要逻辑在 `transform` 钩子中完成，流程如下:
    * 根据 `id` 入参过滤出 `svg` 资源； 
    * 读取 `svg` 文件内容； 
    * 利用 `@svgr/core` 将 `svg` 转换为 `React` 组件代码; 
    * 处理默认导出为 `url` 的情况； 
    * 将组件的 `jsx` 代码转译为浏览器可运行的代码。
      
  **完整的代码如下：**
  
  ~~~ts
  import { Plugin } from 'vite';
  import * as fs from 'fs';
  import * as resolve from 'resolve';

  interface SvgrOptions {
    defaultExport: 'url' | 'component';
  }

  export default function viteSvgrPlugin(options: SvgrOptions): Plugin {
  const { defaultExport='component' } = options;

  return {
    name: 'vite-plugin-svgr',
      async transform(code, id) {
        // 1. 根据 id 入参过滤出 svg 资源；
        if (!id.endsWith('.svg')) {
          return code;
        }
        const svgrTransform = require('@svgr/core').transform;
        // 解析 esbuild 的路径，后续转译 jsx 会用到，我们这里直接拿 vite 中的 esbuild 即可
        const esbuildPackagePath = resolve.sync('esbuild', { basedir: require.resolve('vite') });
        const esbuild = require(esbuildPackagePath);
        // 2. 读取 svg 文件内容；
        const svg = await fs.promises.readFile(id, 'utf8');
        // 3. 利用 `@svgr/core` 将 svg 转换为 React 组件代码
        const svgrResult = await svgrTransform(
          svg,
          {},
          { componentName: 'ReactComponent' }
        );
        // 4. 处理默认导出为 url 的情况
        let componentCode = svgrResult;
        if (defaultExport === 'url') {
          // 加上 Vite 默认的 `export default 资源路径`
          componentCode += code;
          componentCode = componentCode.replace('export default ReactComponent', 'export { ReactComponent }');
        }
        // 5. 利用 esbuild，将组件中的 jsx 代码转译为浏览器可运行的代码;
        const result = await esbuild.transform(componentCode, {
          loader: 'jsx',
        });
        return {
          code: result.code,
          map: null // TODO
        };
      },
    };
  }
  ~~~
  在`vite.config.ts`中引入插件：
  ~~~ts
  // vite.config.ts
  import svgr from './plugins/svgr';

  // 返回的配置
  {
    plugins: [
      // 省略其它插件
      svgr()
    ]
  }
  ~~~
  项目中用组件的方式引入 `svg`:
  ~~~tsx
  // App.tsx
  import Logo from './logo.svg'

  function App() {
    return (
      <>
        <Logo />
      </>
    )
  }

  export default App;
  ~~~
  打开浏览器，查看组件是否正常显示
<br>
<br>
- **调试技巧**

  本地装上vite-plugin-inspect插件：
  ~~~ts
  // vite.config.ts
  import inspect from 'vite-plugin-inspect';

  // 返回的配置
  {
    plugins: [
      // 省略其它插件
      inspect()
    ]
  }
  ~~~
  再次启动项目时，会多出一个调试地址，通过这个地址来查看项目中各个模块的编译结果。


## HMR
HMR 的全称叫做`Hot Module Replacement`，即模块热替换或者模块热更新。在计算机领域当中也有一个类似的概念叫热插拔，我们经常使用的 USB 设备就是一个典型的代表，当我们插入 U 盘的时候，系统驱动会加载在新增的 U 盘内容，不会重启系统，也不会修改系统其它模块的内容。HMR 的作用其实一样，就是在页面模块更新的时候，直接把**页面中发生变化的模块替换为新的模块**，同时不会影响其它模块的正常运作。

- **深入 HMR API**

  Vite 作为一个完整的构建工具，本身实现了一套 HMR 系统，值得注意的是，这套 HMR 系统基于原生的 ESM 模块规范来实现，在文件发生改变时 Vite 会侦测到相应 ES 模块的变化，从而触发相应的 API，实现局部的更新。
  
  HMR API 的类型定义:
  ~~~ts
  interface ImportMeta {
    readonly hot?: {
      readonly data: any
      accept(): void
      accept(cb: (mod: any) => void): void
      accept(dep: string, cb: (mod: any) => void): void
      accept(deps: string[], cb: (mods: any[]) => void): void
      prune(cb: () => void): void
      dispose(cb: (data: any) => void): void
      decline(): void
      invalidate(): void
      on(event: string, cb: (...args: any[]) => void): void
    }
  }
  ~~~
  **import.meta** 对象为现代浏览器原生的一个内置对象，Vite 所做的事情就是在这个对象上的 hot 属性中定义了一套完整的属性和方法。因此，在 Vite 当中，你就可以通过`import.meta.hot`来访问关于 HMR 的这些属性和方法，比如`import.meta.hot.accept()`。
  <br>
  <br>
  * **模块更新时逻辑: hot.accept**

    `import.meta.hot` 对象上有一个非常关键的方法 `accept`，因为它决定了 Vite 进行热更新的边界。它就是用来接受模块更新的。 一旦 Vite 接受了这个更新，当前模块就会被认为是 HMR 的边界。那么，Vite 接受谁的更新呢？这里会有三种情况：
    * 接受**自身模块**的更新
    * 接受**某个子模块**的更新
    * 接受**多个子模块**的更新
    <br>
    <br>
  
    **1. 接受自身更新**

    当模块接受自身的更新时，则当前模块会被认为 HMR 的边界。也就是说，除了当前模块，其他的模块均未受到任何影响。示例如下：
    ~~~html
    <!-- index.html -->
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite App</title>
      </head>
      <body>
        <div id="app"></div>
        <p>
          count: <span id="count">0</span>
        </p>
        <script type="module" src="/src/main.ts"></script>
      </body>
    </html>
    ~~~
    ~~~ts
    // src/main.ts
    import { render } from './render';
    import { initState } from './state';
    render();
    initState();
    ~~~
    ~~~ts
    // src/render.ts
    // 负责渲染文本内容
    import './style.css'
    export const render = () => {
      const app = document.querySelector<HTMLDivElement>('#app')!
      app.innerHTML = `
        <h1>Hello Vite!</h1>
        <p target="_blank">This is hmr test.123</p>
      `
    }
    // src/state.ts
    // 负责记录当前的页面状态
    export function initState() {
      let count = 0;
      setInterval(() => {
        let countEle = document.getElementById('count');
        countEle!.innerText =  ++count + '';
      }, 1000);
    }
    ~~~
    执行`pnpm i`安装依赖，然后`npm run dev`启动项目，在浏览器中查看，每隔一秒钟，你可以看到这里的`count`值会加 1。
    <br>
    <br>
    下面改动一下 render.ts 的渲染内容：
    ~~~ts
    // render.ts
    export const render = () => {
      const app = document.querySelector<HTMLDivElement>('#app')!
      app.innerHTML = `
        <h1>Hello Vite!</h1>
        <p target="_blank">This is hmr test.123 这是增加的文本</p>
      `
    }
    ~~~
    页面的渲染内容更新了，但count值瞬间被置零了，并且查看控制台，也有这样的 log：
    ~~~shell
    [vite] page reload src/render.ts
    ~~~
    很明显，当 render.ts 模块发生变更时，Vite 发现并没有 HMR 相关的处理，然后直接刷新页面了。现在让我们在render.ts中加上如下的代码:
    ~~~ts
    // 条件守卫
    if (import.meta.hot) {
      import.meta.hot.accept((mod) => mod.render())
    }
    ~~~
    `import.meta.hot`对象只有在开发阶段才会被注入到全局，生产环境是访问不到的，另外增加条件守卫之后，打包时识别到 if 条件不成立，会自动把这部分代码从打包产物中移除，来优化资源体积。因此，我们需要增加这个条件守卫语句。
    <br>
    <br>
    `import.meta.hot.accept`中传入了一个回调函数作为参数，入参即为 Vite 给我们提供的更新后的模块内容，在浏览器中打印mod内容如下，正好是render模块最新的内容。
    <br>
    <br>
    回调中调用了一下 `mod.render` 方法，也就是当模块变动后，每次都重新渲染一遍内容。这时你可以试着改动一下渲染的内容，然后到浏览器中注意一下`count`的情况，并没有被重新置零，而是保留了原有的状态。
    <br>
    <br>
    现在 render 模块更新后，只会重新渲染这个模块的内容，而对于 state 模块的内容并没有影响，并且控制台的 log 也发生了变化:
    ~~~shell
    [vite] hmr update /src/render.ts
    ~~~
    现在我们算是实现了初步的 **HMR**，也在实际的代码中体会到了 **accept** 方法的用途。当然，在这个例子中我们传入了一个回调函数来手动调用 `render` 逻辑，但事实上你也可以什么参数都不传，这样 Vite 只会把 `render模块`的最新内容执行一遍，但 render 模块内部只声明了一个函数，因此直接调用`import.meta.hot.accept()`并不会重新渲染页面。






















## 起步

创建项目: npm init @vitejs/app

vue3支持jsx语法: yarn add -D @vitejs/plugin-vue-jsx

vite创建vue2:
 
先创建原生项目,再安装插件: yarn add  vite-plugin-vue2 vue vue-template-compiler
