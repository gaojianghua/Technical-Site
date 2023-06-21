# Vite
[官方文档](https://cn.vitejs.dev/)

## 简介
Vite（法语意为 "快速的"，发音 /vit/，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

* 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。

* 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

Vite 意在提供开箱即用的配置，同时它的 插件 API 和 JavaScript API 带来了高度的可扩展性，并有完整的类型支持。


## 认识配置文件
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















## 起步

创建项目: npm init @vitejs/app

vue3支持jsx语法: yarn add -D @vitejs/plugin-vue-jsx

vite创建vue2:

先创建原生项目,再安装插件: yarn add  vite-plugin-vue2 vue vue-template-compiler
