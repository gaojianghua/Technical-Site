# WebPack
[官方文档](https://webpack.docschina.org/)

## 简介
webpack 是一个用于现代 JavaScript 应用程序的 静态模块打包工具。当 webpack 处理应用程序时，它会在内部从一个或多个入口点构建一个 <b>依赖图(dependency graph)</b>，然后将你项目中所需的每一个模块组合成一个或多个 bundles，它们均为静态资源，用于展示你的内容。
- 依赖图

  每当一个文件依赖另一个文件时，webpack 都会将文件视为直接存在 依赖关系。这使得 webpack 可以获取非代码资源，如 images 或 web 字体等。并会把它们作为 依赖 提供给应用程序。
## 安装配置

npm init :	初始化 package.json

npm install webpack webpack-cli -g :	全局安装webpack

npm install webpack webpack-cli -D :	当前项目下安装webpacks



## 核心概念

### Entry

入口: 指示webpack以哪个文件为入口起点开始打包, 分析构建内部依赖图



### Output

输出: 指示webpack打包后的资源bundles输出到哪里去, 以及如何命名



### Loader

让webpack能过去处理那些非JavaScript文件 ( webpack自身只理解JavaScript )



### Plugins

插件: 可以用于执行范围更广的任务。插件的范围包括，从打包优化和压缩， 

一直到重新定义环境中的变量等



### Mode

模式: 指示webpack使用相应模式的配置

选项一:

- 选项: development
- 描述: 会将 DefinePlugin 中 环境变量NODE_ENV 的值设置为 development
- 启用: NamedChunksPlugin 和 NamedModulesPlugin。
- 特点: 能让代码本地调试运行的环境

选项二:

- 选项: production

- 描述: 会将 DefinePlugin 中 环境变量NODE_ENV 的值设置为 production

- 启用: 

  1. FlagDependencyUsagePlugin

  2. FlagIncludedChunksPlugin
  3. ModuleConcatenationPlugin
  4. NoEmitOnErrorsPlugin
  5. OccurrenceOrderPlugin
  6. SideEffectsFlagPlugin
  7. TerserPlugin

- 特点: 能让代码优化上线 运行的环境
