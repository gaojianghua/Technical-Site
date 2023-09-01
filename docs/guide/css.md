# CSS
[W3CSchool国内教程](https://www.w3cschool.cn/css/)

[W3CSchool国际版文档](https://www.w3school.com.cn/css/index.asp)

## 简介
CSS 是一种描述 HTML 文档样式的语言。描述应该如何显示 HTML 元素。

## 元素层级
通常我们通过 `z-index` 来控制元素层级，但其实是依据层叠水平(`stacking level`):
- 形成堆叠上下文环境的元素的背景与边框
- 拥有负 `z-index` 的子堆叠上下文元素 （负的越高越堆叠层级越低）
- 正常流式布局，非 `inline-block`，无 `position` 定位（`static`除外）的子元素
- 无 `position` 定位（`static`除外）的 `float` 浮动元素
- 正常流式布局，`inline-block`元素，无 `position` 定位（`static`除外）的子元素（包括 `display:table` 和 `display:inline` ）
- 拥有 `z-index:0` 的子堆叠上下文元素
- 拥有正 `z-index:` 的子堆叠上下文元素（正的越低越堆叠层级越低）

触发一个元素形成 **堆叠上下文**(`stacking context`) 的方式:
- 根元素 (`HTML`),
- `z-index` 值不为 `"auto"`的 绝对/相对定位，
- 一个 `z-index` 值不为 `"auto"` 的 `flex` 项目 (`flex item`)，即：父元素 `display: flex|inline-flex`，
- `opacity` 属性值小于 1 的元素（参考 `the specification for opacity`），
- `transform` 属性值不为 `"none"` 的元素，
- `mix-blend-mode` 属性值不为 `"normal"` 的元素，
- `filter` 值不为 `"none"` 的元素，
- `perspective` 值不为 `"none"` 的元素，
- `isolation` 属性被设置为 `"isolate"` 的元素，
- `position: fixed`
- 在 `will-change` 中指定了任意 `CSS` 属性，即便你没有直接指定这些属性的值
- `-webkit-overflow-scrolling` 属性被设置 `"touch"` 的元素

::: tip
当两个同级的元素都拥有堆叠上下文时，要对两者进行层叠排列，就需要 z-index ，z-index 越高的层叠层级越高。如果这两个元素的 `z-index` 都为 `0` 时，层叠顺序由 `DOM` 树顺序决定。即拥有相同 层叠等级(`Stack Level`) 的 盒子(`box`)，层叠顺序由 `DOM` 树顺序决定。
:::