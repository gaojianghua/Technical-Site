# Test

## Jest

Facebook出品, 老牌单元测试工具

[文档地址](https://jestjs.io/zh-Hans/docs/getting-started)

### 生命周期

```js
test			// 测试用例
it				// test别名, 功能相同
describe		// 测试分组
beforeAll		// 应用到每次测试中, 全局测试开始前
afterAll		// 应用到每次测试中, 全局测试结束后
beforeEach		// 应用到当前测试中, 当前测试开始后
afterEach		// 应用到当前测试中, 当前测试结束后
```

~~~js
beforeAll(() => console.log('1 - beforeAll'));
afterAll(() => console.log('1 - afterAll'));
beforeEach(() => console.log('1 - beforeEach'));
afterEach(() => console.log('1 - afterEach'));

test('', () => console.log('1 - test'));

describe('Scoped / Nested block', () => {
  beforeAll(() => console.log('2 - beforeAll'));
  afterAll(() => console.log('2 - afterAll'));
  beforeEach(() => console.log('2 - beforeEach'));
  afterEach(() => console.log('2 - afterEach'));

  test('', () => console.log('2 - test'));
});

// 1 - beforeAll
// 1 - beforeEach
// 1 - test
// 1 - afterEach
// 2 - beforeAll
// 1 - beforeEach
// 2 - beforeEach
// 2 - test
// 2 - afterEach
// 1 - afterEach
// 2 - afterAll
// 1 - afterAll
~~~



### Expect断言

在写测试的时候，我们经常需要检查值是否满足指定的条件。 `expect` 让你可以使用不同的“匹配器”去验证不同类型的东西。

~~~js
expect(value)							// 判断一个值是否满足条件, 搭配匹配器使用
expect.extend(matchers)					// 添加自定义匹配器, 传入对象可设置多个匹配器方法
expect.anything()						// 匹配是否是null和undefined之外的任何内容
expect.any(constructor)					// 匹配构造函数创建的实例, 或者原始值类型
expect.arrayContaining(array)			// 匹配接收到的数组, 预期数组是接收数组的子集
expect.assertions(number) 				// 验证在测试期间是否调用了一定数量的断言
expect.hasAssertions()					// 验证在测试期间至少调用了一个断言
expect.closeTo(number, numDigits?)		// 验证浮点数的计算结果, 第二个参数为限制精确位数
expect.not.arrayContaining(array)		// 匹配接收到的数组，该数组不包含预期数组中的所有元素
expect.not.objectContaining(object)		// 匹配接收到的对象, 预期对象不是接收对象的子集
expect.not.stringContaining(string)		// 验证不是一个字符串, 或不包含预期字符串的字符串
expect.objectContaining(object)			// 验证预期对象是接收对象的子集
expect.stringContaining(string)			// 验证预期字符串是接收字符串所包含的
expect.stringMatching(string | regexp)	// 验证是与预期字符串或正则表达式匹配的字符串
~~~



### 匹配器

~~~js
.toBe(value)					// 匹配原始值, 或对象的属性值
.toBeCloseTo					// 匹配浮点数
.toBeDefined					// 检查变量是否未定义
.toHaveLength(number)			// 检查对象是否有length属性, 或指定length值
.toBeNull()						// 检查是否为空
.toBeUndefined()				// 检查变量是否未定义
.toBeNaN()						// 检查值为NaN
.toEqual(value)					// 比较对象是否相等
.toMatch(regexp | string)		// 检查字符串是否与正则表达式匹配
.toThrow(error?)				// 检查是否为抛出异常
~~~



### DOM仿真

~~~shell
pnpm i jsdom -D
~~~

~~~js
// jsdom-config.js
const jsdom = require('jsdom') // eslint-disable-line
const { JSDOM } = jsdom

const dom = new JSDOM('<!DOCTYPE html><head/><body></body>', {
  url: 'http://localhost/',
  referrer: 'https://example.com/',
  contentType: 'text/html',
  userAgent: 'Mellblomenator/9000',
  includeNodeLocations: true,
  storageQuota: 10000000,
})
global.window = dom.window
global.document = window.document
global.navigator = window.navigator
~~~

~~~js
// dom.js
exports.generateDiv = () => {
  const div = document.createElement("div");
  div.className = "c1";
  document.body.appendChild(div);
};
~~~

~~~js
// dom.test.js
const { generateDiv } = require('../dom') 
require('../jsdom-config')
describe('Dom测试', () => {
    
    test('测试dom操作', () => {
        generateDiv()
        expect(document.getElementsByClassName('c1').length).toBe(1)
    })
})
~~~





## Vitest

Vitest 是一个基于 Vite 的测试框架

1. 与 vite 同配置, 共用配置
2. 兼容 Jest 的 API
3. 使用 worker 线程并发执行, 效率高

~~~js
pnpm i -D vitest@"0.21.1" happy-dom@"6.0.4" @vue/test-utils@"2.0.2"
// vitest ：测试框架，用于执行整个测试过程并提供断言库、mock、覆盖率
// happy-dom：是用于提供在 Node 环境中的 Dom 仿真模型
// @vue/test-utils 工具库： Vue推荐的测试工具库
~~~

~~~js
// vite.config.ts
/// <reference types="vitest" />
export default defineConfig({
    ...
    test: {
        // enable jest-like global test APIs
        globals: true,
        // simulate DOM with happy-dom
        // (requires installing happy-dom as a peer dependency)
        environment: 'happy-dom',
        // 支持tsx组件，很关键
        transformMode: {
            web: [/.[tj]sx$/]
        }
    }
})
~~~

