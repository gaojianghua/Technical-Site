<!--
 * @Author: 高江华 g598670138@163.com
 * @Date: 2023-04-11 16:57:52
 * @LastEditors: 高江华
 * @LastEditTime: 2023-09-08 10:35:18
 * @Description: file content
-->
# TypeScript
[官方文档](https://www.typescriptlang.org/zh/)

## 简介
`TypeScript` 是一种基于 `JavaScript` 构建的强类型编程语言。`TypeScript` 限制了 `JavaScript` 的灵活性，但也增强了项目代码的健壮性。

## 理解原始类型与对象类型
首先，我们来看 [JavaScript的内置原始类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Data_structures#%E5%8E%9F%E5%A7%8B%E5%80%BC_primitive_values)。除了最常见的 `number` / `string` / `boolean` / `null` / `undefined`， ECMAScript 2015（ES6）、2020 (ES11) 又分别引入了 2 个新的原始类型：`symbol` 与 `bigint` 。在 `TypeScript` 中它们都有对应的类型注解：
~~~ts
const name: string = 'zhangsan';
const age: number = 24;
const male: boolean = false;
const undef: undefined = undefined;
const nul: null = null;
const obj: object = { name, age, male };
const bigintVar1: bigint = 9007199254740991n;
const bigintVar2: bigint = BigInt(9007199254740991);
const symbolVar: symbol = Symbol('unique');
~~~
其中，除了 `null` 与 `undefined` 以外，余下的类型基本上可以完全对应到 `JavaScript` 中的数据类型概念，因此这里我们只对 `null` 与 `undefined` 展开介绍。

### null 与 undefined
在 `JavaScript` 中，`null` 与 `undefined` 分别表示“**这里有值，但是个空值**”和“**这里没有值**”。而在 `TypeScript` 中，`null` 与 `undefined` 类型都是有具体意义的类型。也就是说，它们作为类型时，表示的是一个有意义的具体类型值。这两者在没有开启 `strictNullChecks` 检查的情况下，会被视作其他类型的子类型，比如 `string` 类型会被认为包含了 `null` 与 `undefined` 类型：
~~~ts
const tmp1: null = null;
const tmp2: undefined = undefined;

const tmp3: string = null; // 仅在关闭 strictNullChecks 时成立，下同
const tmp4: string = undefined;
~~~
除了上面介绍的原始类型以及 `null`、`undefined` 类型以外，在 `TypeScript` 中还存在着一个特殊的类型：`void`，它和 `JavaScript` 中的 `void` 同样不是一回事，我们接着往下看。

### void
~~~html
<a href="javascript:void(0)">清除缓存</a>
~~~
这里的 `void(0)` 等价于 `void 0`，即 `void expression` 的语法。`void` 操作符会执行后面跟着的表达式并返回一个 `undefined`，如你可以使用它来执行一个**立即执行函数（IIFE）**：
~~~ts
void function iife() {
  console.log("Invoked!");
}();
~~~
能这么做是因为，`void` 操作符强制将后面的函数声明转化为了表达式，因此整体其实相当于：`void((function iife(){})())`。

事实上，`TypeScript` 的原始类型标注中也有 `void`，但与 `JavaScript` 中不同的是，这里的 `void` 用于描述一个内部没有 `return` 语句，或者没有显式 `return` 一个值的函数的返回值，如：
~~~ts
function func1() {}
function func2() {
  return;
}
function func3() {
  return undefined;
}
~~~
在这里，`func1` 与 `func2` 的返回值类型都会被隐式推导为 `void`，只有显式返回了 `undefined` 值的 `func3` 其返回值类型才被推导为了 `undefined`。但在实际的代码执行中，`func1` 与 `func2` 的返回值均是 `undefined`。
::: tip
虽然 `func3` 的返回值类型会被推导为 `undefined`，但是你仍然可以使用 `void` 类型进行标注，因为在类型层面 `func1`、`func2`、`func3` 都表示“**没有返回一个有意义的值**”。
:::
这里可能有点绕，你可以认为 `void` 表示一个空类型，而 `null` 与 `undefined` 都是一个具有意义的实际类型（注意与它们在 `JavaScript` 中的意义区分）。而 `undefined` 能够被赋值给 `void` 类型的变量，就像在 `JavaScript` 中一个没有返回值的函数会默认返回一个 `undefined` 。`null` 类型也可以，但需要在关闭 `strictNullChecks` 配置的情况下才能成立。
~~~ts
const voidVar1: void = undefined;

const voidVar2: void = null; // 需要关闭 strictNullChecks
~~~

### 数组的类型标注
数组同样是我们最常用的类型之一，在 `TypeScript` 中有两种方式来声明一个数组类型：
~~~ts
const arr1: string[] = [];

const arr2: Array<string> = [];
~~~
这两种方式是完全等价的，但其实更多是以前者为主，如果你将鼠标悬浮在 `arr2` 上，会发现它显示的类型签名是 `string[]`。数组是我们在日常开发大量使用的数据结构，但在某些情况下，使用 元组（`Tuple`） 来代替数组要更加妥当，比如一个数组中只存放固定长度的变量，但我们进行了超出长度地访问：
~~~ts
const arr3: string[] = ['lin', 'bu', 'du'];

console.log(arr3[599]);
~~~
这种情况肯定是不符合预期的，因为我们能确定这个数组中只有三个成员，并希望在越界访问时给出类型报错。这时我们可以使用元组类型进行类型标注：
~~~ts
const arr4: [string, string, string] = ['lin', 'bu', 'du'];

console.log(arr4[599]);
~~~
此时将会产生一个类型错误：**长度为“3”的元组类型“[string, string, string]”在索引“599“处没有元素**。除了同类型的元素以外，元组内部也可以声明多个与其位置强绑定的，不同类型的元素：
~~~ts
const arr5: [string, number, boolean] = ['zhangsan', 599, true];
~~~
在这种情况下，对数组合法边界内的索引访问（即 `0、1、2`）将精确地获得对应位置上的类型。同时元组也支持了在某一个位置上的可选成员：
~~~ts
const arr6: [string, number?, boolean?] = ['zhangsan'];
// 下面这么写也可以
// const arr6: [string, number?, boolean?] = ['zhangsan', , ,];
~~~
对于标记为可选的成员，在 `--strictNullCheckes` 配置下会被视为一个 `string | undefined` 的类型。此时元组的长度属性也会发生变化，比如上面的元组 `arr6` ，其长度的类型为 `1 | 2 | 3`：
~~~ts
type TupleLength = typeof arr6.length; // 1 | 2 | 3
~~~
也就是说，这个元组的长度可能为 `1、2、3`。
::: tip
关于类型别名（`type`）、类型查询（`typeof`）以及联合类型，我们会在后面讲到，这里你只需要简单了解即可。
:::
你可能会觉得，元组的可读性实际上并不好。比如对于 `[string, number, boolean]` 来说，你并不能直接知道这三个元素都代表什么，还不如使用对象的形式。而在 `TypeScript 4.0` 中，有了具名元组（[Labeled Tuple Elements](https://github.com/Microsoft/TypeScript/issues/28259)）的支持，使得我们可以为元组中的元素打上类似属性的标记：
~~~ts
const arr7: [name: string, age: number, male: boolean] = ['zhangsan', 599, true];
~~~
有没有很酷？考虑到某些拼装对象太麻烦，我们完全可以使用具名元组来做简单替换。具名元组可选元素的修饰符将成为以下形式：
~~~ts
const arr7: [name: string, age: number, male?: boolean] = ['zhangsan', 599, true];
~~~
实际上除了显式地越界访问，还可能存在隐式地越界访问，如通过解构赋值的形式：
~~~ts
const arr1: string[] = [];

const [ele1, ele2, ...rest] = arr1;
~~~
对于数组，此时仍然无法检查出是否存在隐式访问，因为类型层面并不知道它到底有多少个元素。但对于元组，隐式的越界访问也能够被揪出来给一个警告：
~~~ts
const arr5: [string, number, boolean] = ['zhangsan', 599, true];

// 长度为 "3" 的元组类型 "[string, number, boolean]" 在索引 "3" 处没有元素。
const [name, age, male, other] = arr5;
~~~
`JavaScript` 的开发者对元组 `Tuple` 的概念可能比较陌生，毕竟在 `JavaScript` 中我们很少声明定长的数组。但使用元组确实能帮助我们进一步提升数组结构的严谨性，包括基于位置的类型标注、避免出现越界访问等等。除了通过数组类型提升**数组结构的严谨性**，`TypeScript` 中的对象类型也能帮助我们提升对象结构的严谨性。接下来我们就一起来看看。

### 对象的类型标注
作为 `JavaScript` 中使用最频繁的数据结构，对象的类型标注是我们本节要重点关注的部分。接下来我们会学习如何在 `TypeScript` 中声明对象、修饰对象属性，以及了解可能存在的使用误区。这些内容能够帮助你建立起对 `TypeScript` 中立体类型（我们可以理解为前面的原始类型是“**平面类型**”）的了解，正式入门 `TypeScript` 。

类似于数组类型，在 `TypeScript` 中我们也需要特殊的类型标注来描述对象类型，即 `interface` ，你可以理解为它代表了这个对象对外提供的接口结构。

首先我们使用 `interface` 声明一个结构，然后使用这个结构来作为一个对象的类型标注即可：
~~~ts
interface IDescription {
  name: string;
  age: number;
  male: boolean;
}

const obj1: IDescription = {
  name: 'zhangsan',
  age: 599,
  male: true,
};
~~~
这里的“描述”指：
- 每一个属性的值必须一一对应到接口的属性类型 
- 不能有多的属性，也不能有少的属性，包括直接在对象内部声明，或是 `obj1.other = 'xxx'` 这样属性访问赋值的形式

除了声明属性以及属性的类型以外，我们还可以对属性进行修饰，常见的修饰包括**可选（Optional）** 与 **只读（Readonly）** 这两种。

#### 修饰接口属性
类似于上面的元组可选，在接口结构中同样通过 `?` 来标记一个属性为可选：
~~~ts
interface IDescription {
  name: string;
  age: number;
  male?: boolean;
  func?: Function;
}

const obj2: IDescription = {
  name: 'zhangsan',
  age: 599,
  male: true,
  // 无需实现 func 也是合法的
};
~~~
在这种情况下，即使你在 `obj2` 中定义了 `male` 属性，但当你访问 `obj2.male` 时，它的类型仍然会是 `boolean | undefined`，因为毕竟这是我们自己定义的类型嘛。

假设新增一个可选的函数类型属性，然后进行调用：**obj2.func()** ，此时将会产生一个类型报错：**不能调用可能是未定义的方法**。但可选属性标记不会影响你对这个属性进行赋值，如：
~~~ts
obj2.male = false;
obj2.func = () => {};
~~~
即使你对可选属性进行了赋值，`TypeScript` 仍然会使用**接口的描述为准**进行类型检查，你可以使用类型断言、非空断言或可选链解决（别急，我们在后面会讲到）。

除了标记一个属性为可选以外，你还可以标记这个属性为只读：`readonly`。很多同学对这一关键字比较陌生，因为以往 `JavaScript` 中并没有这一类概念，它的作用是**防止对象的属性被再次赋值**。
~~~ts
interface IDescription {
  readonly name: string;
  age: number;
}

const obj3: IDescription = {
  name: 'zhangsan',
  age: 599,
};

// 无法分配到 "name" ，因为它是只读属性
obj3.name = "张三";
~~~
其实在数组与元组层面也有着只读的修饰，但与对象类型有着两处不同。
- 你只能将整个数组/元组标记为只读，而不能像对象那样标记某个属性为只读。
- 一旦被标记为只读，那这个只读数组/元组的类型上，将不再具有 `push`、`pop` 等方法（即会修改原数组的方法），因此报错信息也将是类型 
  `xxx` 上不存在属性“`push`”这种。这一实现的本质是只读数组与只读元组的类型实际上变成了 `ReadonlyArray`，而不再是 `Array`。

#### type 与 interface
我也知道，很多同学更喜欢用 `type（Type Alias，类型别名）`来代替接口结构描述对象，而我更推荐的方式是，`interface` 用来描述**对象、类的结构**，而类型别名用来**将一个函数签名、一组联合类型、一个工具类型等等抽离成一个完整独立的类型**。但大部分场景下接口结构都可以被类型别名所取代，因此，只要你觉得统一使用类型别名让你觉得更整齐，也没什么问题。

### object、Object 以及 {}
`object`、`Object` 以及`{}`（一个空对象）这三者的使用可能也会让部分同学感到困惑，所以我也专门解释下。

首先是 `Object` 的使用。被 `JavaScript` 原型链折磨过的同学应该记得，原型链的顶端是 `Object` 以及 `Function`，这也就意味着所有的原始类型与对象类型最终都指向 `Object`，在 `TypeScript` 中就表现为 `Object` 包含了所有的类型：
~~~ts
// 对于 undefined、null、void 0 ，需要关闭 strictNullChecks
const tmp1: Object = undefined;
const tmp2: Object = null;
const tmp3: Object = void 0;

const tmp4: Object = 'linbudu';
const tmp5: Object = 599;
const tmp6: Object = { name: 'linbudu' };
const tmp7: Object = () => {};
const tmp8: Object = [];
~~~
和 `Object` 类似的还有 `Boolean`、`Number`、`String`、`Symbol`，这几个**装箱类型（Boxed Types）** 同样包含了一些超出预期的类型。以 `String` 为例，它同样包括 `undefined`、`null`、`void`，以及代表的 **拆箱类型（Unboxed Types）** `string`，但并不包括其他装箱类型对应的拆箱类型，如 `boolean` 与 基本对象类型，我们看以下的代码：
~~~ts
const tmp9: String = undefined;
const tmp10: String = null;
const tmp11: String = void 0;
const tmp12: String = 'linbudu';

// 以下不成立，因为不是字符串类型的拆箱类型
const tmp13: String = 599; // X
const tmp14: String = { name: 'linbudu' }; // X
const tmp15: String = () => {}; // X
const tmp16: String = []; // X
~~~
**在任何情况下，你都不应该使用这些装箱类型。**

`object` 的引入就是为了解决对 `Object` 类型的错误使用，它代表**所有非原始类型的类型，即数组、对象与函数类型这些**：
~~~ts
const tmp17: object = undefined;
const tmp18: object = null;
const tmp19: object = void 0;

const tmp20: object = 'linbudu';  // X 不成立，值为原始类型
const tmp21: object = 599; // X 不成立，值为原始类型

const tmp22: object = { name: 'linbudu' };
const tmp23: object = () => {};
const tmp24: object = [];
~~~
最后是`{}`，一个奇奇怪怪的空对象，如果你了解过字面量类型，可以认为`{}`就是一个对象字面量类型（对应到字符串字面量类型这样）。否则，你可以认为使用`{}`作为类型签名就是一个合法的，但**内部无属性定义的空对象**，这类似于 `Object`（想想 `new Object()`），它意味着任何非 `null / undefined` 的值：
~~~ts

const tmp25: {} = undefined; // 仅在关闭 strictNullChecks 时成立，下同
const tmp26: {} = null;
const tmp27: {} = void 0; // void 0 等价于 undefined

const tmp28: {} = 'linbudu';
const tmp29: {} = 599;
const tmp30: {} = { name: 'linbudu' };
const tmp31: {} = () => {};
const tmp32: {} = [];
~~~
虽然能够将其作为变量的类型，但你实际上**无法对这个变量进行任何赋值操作**：
~~~ts
const tmp30: {} = { name: 'linbudu' };

tmp30.age = 18; // X 类型“{}”上不存在属性“age”。
~~~
这是因为它就是纯洁的像一张白纸一样的空对象，上面没有任何的属性（除了 `toString` 这种与生俱来的）。在类型层级一节我们还会再次见到它，不过那个时候它已经被称为“万物的起源”了。

最后，为了更好地区分 `Object`、`object` 以及`{}`这三个具有迷惑性的类型，我们再做下总结：
- 在任何时候都**不要，不要，不要使用** Object 以及类似的装箱类型。
- 当你不确定某个变量的具体类型，但能确定它不是原始类型，可以使用 `object`。但我更推荐进一步区分，也就是使用 `Record<string, 
  unknown>` 或 `Record<string, any>` 表示对象，`unknown[]` 或 `any[]` 表示数组，`(...args: any[]) => any`表示函数这样。
- 我们同样要避免使用`{}`。`{}`意味着任何非 `null / undefined` 的值，从这个层面上看，使用它和使用 `any` 一样恶劣。

### unique symbol
`Symbol` 在 `JavaScript` 中代表着一个唯一的值类型，它类似于字符串类型，可以作为对象的属性名，并用于避免错误修改 `对象 / Class` 内部属性的情况。而在 `TypeScript` 中，`symbol` 类型并不具有这一特性，一百个具有 `symbol` 类型的对象，它们的 `symbol` 类型指的都是 `TypeScript` 中的同一个类型。为了实现“**独一无二**”这个特性，`TypeScript` 中支持了 `unique symbol` 这一类型声明，它是 `symbol` 类型的子类型，每一个 `unique symbol` 类型都是独一无二的。
~~~ts
const uniqueSymbolFoo: unique symbol = Symbol("linbudu")

// 类型不兼容
const uniqueSymbolBar: unique symbol = uniqueSymbolFoo
~~~
在 `JavaScript` 中，我们可以用 `Symbol.for` 方法来复用已创建的 `Symbol`，如 `Symbol.for("zhangsan")` 
会首先查找全局是否已经有使用 `zhangsan` 作为 key 的 `Symbol` 注册，如果有，则返回这个 `Symbol`，否则才会创建新的 
`Symbol` 。

在 `TypeScript` 中，如果要引用已创建的 `unique symbol` 类型，则需要使用类型查询操作符 `typeof` ：
~~~ts
declare const uniqueSymbolFoo: unique symbol;

const uniqueSymbolBaz: typeof uniqueSymbolFoo = uniqueSymbolFoo
~~~
::: tip
以上代码实际执行时会报错，这是因为 `uniqueSymbolFoo` 是一个仅存在于类型空间的值，这里只是为了进行示例~

这里的 `declare`、`typeof` 等使用，都会在后面有详细地讲解。同时 `unique symbol` 在日常开发的使用非常少见，这里做了解就好~
:::

## 掌握字面量类型与枚举
了解了原始类型与对象类型以后，我们已经能完成简单场景的类型标注了。但这还远远不够，我们还可以让这些类型标注更精确一些。比如，有一个接口结构，它描述了响应的消息结构：
~~~ts
interface IRes {
  code: number;
  status: string;
  data: any;
}
~~~
在大多数情况下，这里的 `code` 与 `status` 实际值会来自于一组确定值的集合，比如 `code` 可能是 `10000 / 10001 / 50000`，`status` 可能是 `"success" / "failure"`。而上面的类型只给出了一个宽泛的 `number（string）`，此时我们既不能在访问 `code` 时获得精确的提示，也失去了 `TypeScript` 类型即文档的功能。

这个时候要怎么做？

### 字面量类型与联合类型
我们可以使用联合类型加上字面量类型，把上面的例子改写成这样：
~~~ts
interface Res {
  code: 10000 | 10001 | 50000;
  status: "success" | "failure";
  data: any;
}
~~~
这个时候，我们就能在访问时获得精确地类型推导了。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/a428d95d0eee4c269302df47bf45e7b3~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

对于 `declare var res: Res`，你可以认为它其实就是快速生成一个符合指定类型，但没有实际值的变量，同时它也不存在于运行时中。上面引入了一些新的概念，我们来一个一个了解。

#### 字面量类型
最开始你可能觉得很神奇，`success` 不是一个值吗？为什么它也可以作为类型？在 `TypeScript` 中，这叫做**字面量类型（Literal Types）**，它代表着比原始类型更精确的类型，同时也是原始类型的子类型（关于类型层级，我们会在后面详细了解）。

字面量类型主要包括**字符串字面量类型、数字字面量类型、布尔字面量类型和对象字面量类型**，它们可以直接作为类型标注：
~~~ts
const str: "linbudu" = "linbudu";
const num: 599 = 599;
const bool: true = true;
~~~
为什么说字面量类型比原始类型更精确？我们可以看这么个例子：
~~~ts
// 报错！不能将类型“"linbudu599"”分配给类型“"linbudu"”。
const str1: "linbudu" = "linbudu599";

const str2: string = "linbudu";
const str3: string = "linbudu599";
~~~
上面的代码，原始类型的值可以包括任意的同类型值，而字面量类型要求的是**值级别的字面量一致**。

单独使用字面量类型比较少见，因为单个字面量类型并没有什么实际意义。它通常和联合类型（即这里的 `|`）一起使用，表达一组字面量类型：
~~~ts
interface Tmp {
  bool: true | false;
  num: 1 | 2 | 3;
  str: "lin" | "bu" | "du"
}
~~~

#### 联合类型
而联合类型你可以理解为，它代表了**一组类型的可用集合**，只要最终赋值的类型属于联合类型的成员之一，就可以认为符合这个联合类型。联合类型对其成员并没有任何限制，除了上面这样对同一类型字面量的联合，我们还可以将各种类型混合到一起：
~~~ts
interface Tmp {
  mixed: true | string | 599 | {} | (() => {}) | (1 | 2)
}
~~~
这里有几点需要注意的：
- 对于联合类型中的函数类型，需要使用括号`()`包裹起来
- 函数类型并不存在字面量类型，因此这里的 `(() => {})` 就是一个合法的函数类型
- 你可以在联合类型中进一步嵌套联合类型，但这些嵌套的联合类型最终都会被展平到第一级中

联合类型的常用场景之一是通过多个对象类型的联合，来实现手动的互斥属性，即这一属性如果有字段1，那就没有字段2：
~~~ts
interface Tmp {
  user:
    | {
        vip: true;
        expires: string;
      }
    | {
        vip: false;
        promotion: string;
      };
}

declare var tmp: Tmp;

if (tmp.user.vip) {
  console.log(tmp.user.expires);
}
~~~
在这个例子中，`user` 属性会满足普通用户与 `VIP` 用户两种类型，这里 `vip` 属性的类型基于布尔字面量类型声明。我们在实际使用时可以通过判断此属性为 `true` ，确保接下来的类型推导都会将其类型收窄到 `VIP` 用户的类型（即联合类型的第一个分支）。这一能力的使用涉及类型守卫与类型控制流分析，我们会在后面的章节详细来说。

我们也可以通过类型别名来复用一组字面量联合类型：
~~~ts
type Code = 10000 | 10001 | 50000;

type Status = "success" | "failure";
~~~
除了原始类型的字面量类型以外，对象类型也有着对应的字面量类型。

#### 对象字面量类型
类似的，对象字面量类型就是一个对象类型的值。当然，这也就意味着这个对象的值全都为字面量值：
~~~ts
interface Tmp {
  obj: {
    name: "linbudu",
    age: 18
  }
}

const tmp: Tmp = {
  obj: {
    name: "linbudu",
    age: 18
  }
}
~~~
如果要实现一个对象字面量类型，意味着完全的实现这个类型每一个属性的每一个值。对象字面量类型在实际开发中的使用较少，我们只需要了解。

总的来说，在需要更精确类型的情况下，我们可以使用字面量类型加上联合类型的方式，将类型从 `string` 这种宽泛的原始类型直接收窄到 `"resolved" | "pending" | "rejected"` 这种精确的字面量类型集合。

::: tip
需要注意的是，**无论是原始类型还是对象类型的字面量类型，它们的本质都是类型而不是值**。它们在编译时同样会被擦除，同时也是被存储在内存中的类型空间而非值空间。

如果说字面量类型是对原始类型的进一步扩展（对象字面量类型的使用较少），那么枚举在某些方面则可以理解为是对对象类型的扩展。
:::

### 枚举
枚举并不是 `JavaScript` 中原生的概念，在其他语言中它都是老朋友了（`Java、C#、Swift` 等）。目前也已经存在给 `JavaScript（ECMAScript）`引入枚举支持的 `proposal-enum` 提案，但还未被提交给 `TC39` ，仍处于 `Stage 0` 阶段。

如果要和 `JavaScript` 中现有的概念对比，我想最贴切的可能就是你曾经写过的 `constants` 文件了：
~~~ts
export default {
  Home_Page_Url: "url1",
  Setting_Page_Url: "url2",
  Share_Page_Url: "url3",
}

// 或是这样：
export const PageUrl = {
  Home_Page_Url: "url1",
  Setting_Page_Url: "url2",
  Share_Page_Url: "url3",
}
~~~
如果把这段代码替换为枚举，会是如下的形式：
~~~ts
enum PageUrl {
  Home_Page_Url = "url1",
  Setting_Page_Url = "url2",
  Share_Page_Url = "url3",
}

const home = PageUrl.Home_Page_Url;
~~~
这么做的好处非常明显。首先，你拥有了更好的类型提示。其次，这些常量被真正地**约束在一个命名空间**下（上面的对象声明总是差点意思）。如果你没有声明枚举的值，它会默认使用数字枚举，并且从 `0` 开始，以 `1` 递增：
~~~ts
enum Items {
  Foo,
  Bar,
  Baz
}
~~~
在这个例子中，`Items.Foo` , `Items.Bar` , `Items.Baz`的值依次是 `0，1，2` 。

如果你只为某一个成员指定了枚举值，那么之前未赋值成员仍然会使用从 `0` 递增的方式，之后的成员则会开始从枚举值递增。
~~~ts
enum Items {
  // 0 
  Foo,
  Bar = 599,
  // 600
  Baz
}
~~~
在数字型枚举中，你可以使用延迟求值的枚举值，比如函数：
~~~ts
const returnNum = () => 100 + 499;

enum Items {
  Foo = returnNum(),
  Bar = 599,
  Baz
}
~~~
但要注意，延迟求值的枚举值是有条件的。**如果你使用了延迟求值，那么没有使用延迟求值的枚举成员必须放在使用常量枚举值声明的成员之后（如上例），或者放在第一位**：
~~~ts
enum Items {
  Baz,
  Foo = returnNum(),
  Bar = 599,
}
~~~
`TypeScript` 中也可以同时使用字符串枚举值和数字枚举值：
~~~ts
enum Mixed {
  Num = 599,
  Str = "linbudu"
}
~~~
枚举和对象的重要差异在于，**对象是单向映射的**，我们只能从键映射到键值。而**枚举是双向映射的**，即你可以从枚举成员映射到枚举值，也可以从枚举值映射到枚举成员：
~~~ts
enum Items {
  Foo,
  Bar,
  Baz
}

const fooValue = Items.Foo; // 0
const fooKey = Items[0]; // "Foo"
~~~
要了解这一现象的本质，我们需要来看一看枚举的编译产物，如以上的枚举会被编译为以下 `JavaScript` 代码：
~~~ts
"use strict";
var Items;
(function (Items) {
    Items[Items["Foo"] = 0] = "Foo";
    Items[Items["Bar"] = 1] = "Bar";
    Items[Items["Baz"] = 2] = "Baz";
})(Items || (Items = {}));
~~~
`obj[k] = v` 的返回值即是 `v`，因此这里的 `obj[obj[k] = v] = k` 本质上就是进行了 `obj[k] = v 与 obj[v] = k` 这样两次赋值。

但需要注意的是，仅有值为数字的枚举成员才能够进行这样的双向枚举，**字符串枚举成员仍然只会进行单次映射**：
~~~ts
enum Items {
  Foo,
  Bar = "BarValue",
  Baz = "BazValue"
}

// 编译结果，只会进行 键-值 的单向映射
"use strict";
var Items;
(function (Items) {
    Items[Items["Foo"] = 0] = "Foo";
    Items["Bar"] = "BarValue";
    Items["Baz"] = "BazValue";
})(Items || (Items = {}));
~~~
除了数字枚举与字符串枚举这种分类以外，其实还存在着普通枚举与常量枚举这种分类方式。

### 常量枚举
常量枚举和枚举相似，只是其声明多了一个 `const`：
~~~ts
const enum Items {
  Foo,
  Bar,
  Baz
}

const fooValue = Items.Foo; // 0
~~~
它和普通枚举的差异主要在访问性与编译产物。对于常量枚举，你只能通过枚举成员访问枚举值（而不能通过值访问成员）。同时，在编译产物中并不会存在一个额外的辅助对象（如上面的 `Items` 对象），对枚举成员的访问会被直接内联替换为枚举的值。以上的代码会被编译为如下形式：
~~~ts
const fooValue = 0 /* Foo */; // 0
~~~
::: tip
实际上，常量枚举的表现、编译产物还受到配置项 `--isolatedModules` 以及 `--preserveConstEnums` 等的影响，我们会在后面的 `TSConfig` 详解中了解更多。
:::

### 类型控制流分析中的字面量类型
除了手动声明字面量类型以外，实际上 `TypeScript` 也会在某些情况下将变量类型推导为字面量类型，看这个例子：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1748979376.png)

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1286157135.png)

你会发现，使用 `const` 声明的变量，其类型会从值推导出最精确的字面量类型。而对象类型则只会推导至符合其属性结构的接口，不会使用字面量类型：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1209480132.png)

要解答这个现象，需要你回想 `let` 和 `const` 声明的意义。我们知道，使用 `let` 声明的变量是可以再次赋值的，在 `TypeScript` 中要求赋值类型始终与原类型一致（如果声明了的话）。因此对于 `let` 声明，**只需要推导至这个值从属的类型即可**。而 `const` 声明的原始类型变量将不再可变，因此类型可以直接一步到位收窄到最精确的字面量类型，但对象类型变量仍可变（但同样会要求其属性值类型保持一致）。

这些现象的本质都是 `TypeScript` 的类型控制流分析，我们会在后面的类型系统部分中讲到。

## 详解函数重载与面向对象
我们了解了日常开发中最常用的、基础的变量类型标注，包括原始类型、对象类型、字面量类型与枚举类型。而实际开发中还有一个重要的朋友：**函数**。函数能够帮助我们进一步抽离与封装代码逻辑，所以掌握函数类型必不可少。如果说函数代表着**面向过程**的编程，那么 `Class` 则代表着**面向对象**的编程

### 函数
#### 函数的类型签名
如果说变量的类型是描述了这个变量的值类型，那么函数的类型就是描述了**函数入参类型与函数返回值类型**，它们同样使用`:`的语法进行类型标注。我们直接看最简单的例子：
~~~ts
function foo(name: string): number {
  return name.length;
}
~~~
在函数类型中同样存在着类型推导。比如在这个例子中，你可以不写返回值处的类型，它也能被正确推导为 `number` 类型。

在 `JavaScript` 中，我们称 `function name () {}` 这一声明函数的方式为**函数声明（Function Declaration）**。除了函数声明以外，我们还可以通过**函数表达式（Function Expression）**，即 `const foo = function(){}` 的形式声明一个函数。在表达式中进行类型声明的方式是这样的：
~~~ts
const foo = function (name: string): number {
  return name.length
}
~~~
我们也可以像对变量进行类型标注那样，对 `foo` 这个变量进行类型声明：
~~~ts
const foo: (name: string) => number = function (name) {
  return name.length
}
~~~
这里的 `(name: string) => number` 看起来很眼熟，对吧？它是 `ES6` 的重要特性之一：箭头函数。但在这里，它其实是 `TypeScript` 中的**函数类型签名**。而实际的箭头函数，我们的类型标注也是类似的：
~~~ts
// 方式一
const foo = (name: string): number => {
  return name.length
}
~~~
~~~ts
// 方式二
const foo: (name: string) => number = (name) => {
  return name.length
}
~~~
在方式二的声明方式中，你会发现函数类型声明混合箭头函数声明时，代码的可读性会非常差。因此，一般不推荐这么使用，要么**直接在函数中进行参数和返回值的类型声明，要么使用类型别名将函数声明抽离出来**：
~~~ts
type FuncFoo = (name: string) => number

const foo: FuncFoo = (name) => {
  return name.length
}
~~~
如果只是为了描述这个函数的类型结构，我们甚至可以使用 `interface` 来进行函数声明：
~~~ts
interface FuncFooStruct {
  (name: string): number
}
~~~
这时的 `interface` 被称为 **Callable Interface**，看起来可能很奇怪，但我们可以这么认为，`interface` 就是用来描述一个类型结构的，而函数类型本质上也是一个结构固定的类型罢了。

#### void 类型
在 `TypeScript` 中，一个没有返回值（即没有调用 `return` 语句）的函数，其返回类型应当被标记为 `void` 而不是 `undefined`，即使它实际的值是 `undefined`。
~~~ts
// 没有调用 return 语句
function foo(): void { }

// 调用了 return 语句，但没有返回值
function bar(): void {
  return;
}
~~~
原因和我们在原始类型与对象类型一节中讲到的：**在 TypeScript 中，undefined 类型是一个实际的、有意义的类型值，而 void 才代表着空的、没有意义的类型值**。 相比之下，`void` 类型就像是 `JavaScript` 中的 `null` 一样。因此在我们没有实际返回值时，使用 `void` 类型能更好地说明这个函数**没有进行返回操作**。但在上面的第二个例子中，其实更好的方式是使用 `undefined` ：
~~~ts
function bar(): undefined {
  return;
}
~~~
此时我们想表达的则是，这个函数**进行了返回操作，但没有返回实际的值**。

#### 可选参数与 rest 参数
在很多时候，我们会希望函数的参数可以更灵活，比如它不一定全都必传，当你不传入参数时函数会使用此参数的默认值。正如在对象类型中我们使用 `?` 描述一个可选属性一样，在函数类型中我们也使用 `?` 描述一个可选参数：
~~~ts
// 在函数逻辑中注入可选参数默认值
function foo1(name: string, age?: number): number {
  const inputAge = age || 18; // 或使用 age ?? 18
  return name.length + inputAge
}

// 直接为可选参数声明默认值
function foo2(name: string, age: number = 18): number {
  const inputAge = age;
  return name.length + inputAge
}
~~~
需要注意的是，**可选参数必须位于必选参数之后**。毕竟在 `JavaScript` 中函数的入参是按照位置（形参），而不是按照参数名（名参）进行传递。当然，我们也可以直接将可选参数与默认值合并，但此时就不能够使用 `?` 了，因为既然都有默认值，那肯定是可选参数啦。
~~~ts
function foo(name: string, age: number = 18): number {
  const inputAge = age || 18;
  return name.length + inputAge
}
~~~
在某些情况下，这里的可选参数类型也可以省略，如这里原始类型的情况可以直接从提供的默认值类型推导出来。但对于联合类型或对象类型的复杂情况，还是需要老老实实地进行标注。

对于 `rest` 参数的类型标注也比较简单，由于其实际上是一个数组，这里我们也应当使用数组类型进行标注：
~~~ts
function foo(arg1: string, ...rest: any[]) { }
~~~
::: tip
对于 `any` 类型，你可以简单理解为它包含了一切可能的类型，我们会在下一节详细介绍。
:::
当然，你也可以使用我们前面学习的元组类型进行标注：
~~~ts
function foo(arg1: string, ...rest: [number, boolean]) { }

foo("linbudu", 18, true)
~~~

#### 重载
在某些逻辑较复杂的情况下，函数可能有多组入参类型和返回值类型：
~~~ts
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}
~~~
在这个实例中，函数的返回类型基于其入参 `bar` 的值，并且从其内部逻辑中我们知道，当 `bar` 为 `true`，返回值为 `string` 类型，否则为 `number` 类型。而这里的类型签名完全没有体现这一点，我们只知道它的返回值是这么个联合类型。

要想实现与入参关联的返回值类型，我们可以使用 `TypeScript` 提供的**函数重载签名（Overload Signature）**，将以上的例子使用重载改写：
~~~ts
function func(foo: number, bar: true): string;
function func(foo: number, bar?: false): number;
function func(foo: number, bar?: boolean): string | number {
  if (bar) {
    return String(foo);
  } else {
    return foo * 599;
  }
}

const res1 = func(599); // number
const res2 = func(599, true); // string
const res3 = func(599, false); // number
~~~
这里我们的三个 `function func` 其实具有不同的意义：
- `function func(foo: number, bar: true): string`，重载签名一，传入 `bar` 的值为 `true` 
时，函数返回值为 `string` 类型。
- `function func(foo: number, bar?: false): number`，重载签名二，不传入 `bar`，或传入 `bar` 的值为 
  `false` 时，函数返回值为 `number` 类型。
- `function func(foo: number, bar?: boolean): string | 
  number`，函数的实现签名，会包含重载签名的所有可能情况。

基于重载签名，我们就实现了将入参类型和返回值类型的可能情况进行关联，获得了更精确的类型标注能力。
::: tip
这里有一个需要注意的地方，拥有多个重载声明的函数在被调用时，是按照重载的声明顺序往下查找的。因此在第一个重载声明中，为了与逻辑中保持一致，即在 `bar` 为 `true` 时返回 `string` 类型，这里我们需要将第一个重载声明的 `bar` 声明为必选的字面量类型。
:::
::: tip
你可以试着为第一个重载声明的 `bar` 参数也加上可选符号，然后就会发现第一个函数调用错误地匹配到了第一个重载声明。
:::
实际上，`TypeScript` 中的重载更像是伪重载，**它只有一个具体实现，其重载体现在方法调用的签名上而非具体实现上**。而在如 C++ 等语言中，重载体现在多个**名称一致但入参不同的函数实现上，这才是更广义上的函数重载**。

#### 异步函数、Generator 函数等类型签名
对于异步函数、`Generator` 函数、异步 `Generator` 函数的类型签名，其参数签名基本一致，而返回值类型则稍微有些区别：
~~~ts
async function asyncFunc(): Promise<void> {}

function* genFunc(): Iterable<void> {}

async function* asyncGenFunc(): AsyncIterable<void> {}
~~~
其中，`Generator` 函数与异步 `Generator` 函数现在已经基本不再使用，这里仅做了解即可。而对于异步函数（即标记为 `async` 的函数），其返回值必定为一个 `Promise` 类型，而 `Promise` 内部包含的类型则通过泛型的形式书写，即 `Promise<T>`（关于泛型我们会在后面进行详细了解）。

在函数这一节中，我们主要关注函数的类型标注。因为 `TypeScript` 中的函数实际上相比 `JavaScript` 也只是多在重载这一点上，我们需要着重掌握的仍然是类型标注。但在 `Class` 中，我们的学习重点其实更侧重于其语法与面向对象的编程理念。

### Class
#### 类与类成员的类型签名
一个函数的主要结构即是参数、逻辑和返回值，对于逻辑的类型标注其实就是对普通代码的标注，所以我们只介绍了对参数以及返回值的类型标注。而到了 `Class` 中其实也一样，它的主要结构只有**构造函数、属性、方法和访问符（`Accessor`）**，我们也只需要关注这三个部分即可。这里我要说明一点，有的同学可能认为装饰器也是 `Class` 的结构，但我个人认为它并不是 `Class` 携带的逻辑，不应该被归类在这里。

属性的类型标注类似于变量，而构造函数、方法、存取器的类型编标注类似于函数：
~~~ts
class Foo {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  get propA(): string {
    return `${this.prop}+A`;
  }

  set propA(value: string) {
    this.prop = `${value}+A`
  }
}
~~~
唯一需要注意的是，`setter` 方法**不允许进行返回值的类型标注**，你可以理解为 `setter` 的返回值并不会被消费，它是一个只关注过程的函数。类的方法同样可以进行函数那样的重载，且语法基本一致，这里我们不再赘述。

就像函数可以通过**函数声明与函数表达式**创建一样，类也可以通过**类声明和类表达式**的方式创建。很明显上面的写法即是类声明，而使用类表达式的语法则是这样的：
~~~ts
const Foo = class {
  prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }
  
  // ...
}
~~~
#### 修饰符
在 `TypeScript` 中我们能够为 `Class` 成员添加这些修饰符：`public` / `private` / `protected` / `readonly`。除 `readonly` 以外，其他三位都属于访问性修饰符，而 `readonly` 属于操作性修饰符（就和 `interface` 中的 `readonly` 意义一致）。

这些修饰符应用的位置在成员命名前：
~~~ts
class Foo {
  private prop: string;

  constructor(inputProp: string) {
    this.prop = inputProp;
  }

  protected print(addon: string): void {
    console.log(`${this.prop} and ${addon}`)
  }

  public get propA(): string {
    return `${this.prop}+A`;
  }

  public set propA(value: string) {
    this.propA = `${value}+A`
  }
}
~~~
::: tip
我们通常不会为构造函数添加修饰符，而是让它保持默认的 `public`。在后面我们会讲到 `private` 修饰构造函数的场景。
:::
如果没有其他语言学习经验，你可能不太理解 `public` / `private` / `protected` 的意义，我们简单做个解释。
- `public`：此类成员在**类、类的实例、子类**中都能被访问。
- `private`：此类成员仅能在**类的内部**被访问。
- `protected`
  ：此类成员仅能在**类与子类中**被访问，你可以将类和类的实例当成两种概念，即一旦实例化完毕（出厂零件），那就和类（工厂）没关系了，即**不允许再访问受保护的成员**。

当你不显式使用访问性修饰符，成员的访问性默认会被标记为 `public`。实际上，在上面的例子中，我们通过构造函数为类成员赋值的方式还是略显麻烦，需要声明类属性以及在构造函数中进行赋值。简单起见，我们可以**在构造函数中对参数应用访问性修饰符**：
~~~ts
class Foo {
  constructor(public arg1: string, private arg2: boolean) { }
}

new Foo("linbudu", true)
~~~
此时，参数会被直接作为类的成员（即实例的属性），免去后续的手动赋值。

#### 静态成员
在 `TypeScript` 中，你可以使用 `static` 关键字来标识一个成员为静态成员：
~~~ts
class Foo {
  static staticHandler() { }

  public instanceHandler() { }
}
~~~
不同于实例成员，在类的内部静态成员无法通过 `this` 来访问，需要通过 `Foo.staticHandler` 这种形式进行访问。我们可以查看编译到 ES5 及以下 `target` 的 `JavaScript` 代码（ES6 以上就原生支持静态成员了），来进一步了解它们的区别：
~~~ts
var Foo = /** @class */ (function () {
    function Foo() {
    }
    Foo.staticHandler = function () { };
    Foo.prototype.instanceHandler = function () { };
    return Foo;
}());
~~~
从中我们可以看到，**静态成员直接被挂载在函数体上**，而**实例成员挂载在原型上**，这就是二者的最重要差异：**静态成员不会被实例继承，它始终只属于当前定义的这个类（以及其子类）**。而原型对象上的实例成员则会**沿着原型链进行传递**，也就是能够被继承。

而对于静态成员和实例成员的使用时机，其实并不需要非常刻意地划分。比如我会用**类 + 静态成员**来收敛变量与 `utils` 方法：
~~~ts
class Utils {
  public static identifier = "linbudu";

  public static makeUHappy() {
    Utils.studyWithU();
    // ...
  }

  public static studyWithU() { }
}

Utils.makeUHappy();
~~~

#### 继承、实现、抽象类
既然说到 `Class`，那就一定离不开继承。与 `JavaScript` 一样，`TypeScript` 中也使用 `extends` 关键字来实现继承：
~~~ts
class Base { }

class Derived extends Base { }
~~~
对于这里的两个类，比较严谨的称呼是 **基类（Base）** 与 **派生类（Derived）**。当然，如果你觉得叫父类与子类更容易理解也没问题。关于基类与派生类，我们需要了解的主要是**派生类对基类成员的访问与覆盖操作**。

基类中的哪些成员能够被派生类访问，完全是由其访问性修饰符决定的。我们在上面其实已经介绍过，派生类中可以访问到使用 `public` 或 `protected` 修饰符的基类成员。除了访问以外，基类中的方法也可以在派生类中被覆盖，但我们仍然可以通过 `super` 访问到基类中的方法：
~~~ts
class Base {
  print() { }
}

class Derived extends Base {
  print() {
    super.print()
    // ...
  }
}
~~~
在派生类中覆盖基类方法时，我们并不能确保派生类的这一方法能覆盖基类方法，万一基类中不存在这个方法呢？所以，`TypeScript 4.3` 新增了 `override` 关键字，来确保派生类尝试覆盖的方法一定在基类中存在定义：
~~~ts
class Base {
  printWithLove() { }
}

class Derived extends Base {
  override print() {
    // ...
  }
}
~~~
在这里 TS 将会给出错误，因为**尝试覆盖的方法并未在基类中声明**。通过这一关键字我们就能确保首先这个方法在基类中存在，同时标识这个方法在派生类中被覆盖了。

除了基类与派生类以外，还有一个比较重要的概念：**抽象类**。抽象类是对类结构与方法的抽象，简单来说，**一个抽象类描述了一个类中应当有哪些成员（属性、方法等）**，**一个抽象方法描述了这一方法在实际实现中的结构**。我们知道类的方法和函数非常相似，包括结构，因此抽象方法其实描述的就是这个方法的**入参类型与返回值类型**。

抽象类使用 `abstract` 关键字声明：
~~~ts
abstract class AbsFoo {
  abstract absProp: string;
  abstract get absGetter(): string;
  abstract absMethod(name: string): string
}
~~~
注意，抽象类中的成员也需要使用 `abstract` 关键字才能被视为抽象类成员，如这里的抽象方法。我们可以实现（`implements`）一个抽象类：
~~~ts
class Foo implements AbsFoo {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
~~~
此时，我们必须完全实现这个抽象类的每一个抽象成员。需要注意的是，在 `TypeScript` 中**无法声明静态的抽象成员**。

对于抽象类，它的本质就是描述类的结构。看到结构，你是否又想到了 `interface?`是的。`interface` 不仅可以声明函数结构，也可以声明类的结构：
~~~ts
interface FooStruct {
  absProp: string;
  get absGetter(): string;
  absMethod(input: string): string
}

class Foo implements FooStruct {
  absProp: string = "linbudu"

  get absGetter() {
    return "linbudu"
  }

  absMethod(name: string) {
    return name
  }
}
~~~
在这里，我们让类去实现了一个接口。这里接口的作用和抽象类一样，都是**描述这个类的结构**。除此以外，我们还可以使用 **Newable Interface** 来描述一个类的结构（类似于描述函数结构的 **Callable Interface**）：
~~~ts
class Foo { }

interface FooStruct {
  new(): Foo
}

declare const NewableFoo: FooStruct;

const foo = new NewableFoo();
~~~

#### 私有构造函数
上面说到，我们通常不会对类的构造函数进行访问性修饰，如果我们一定要试试呢？
~~~ts
class Foo {
  private constructor() { }
}
~~~
看起来好像没什么问题，但是当你想要实例化这个类时，一行美丽的操作就会出现：**类的构造函数被标记为私有，且只允许在类内部访问**。

有些场景下私有构造函数确实有奇妙的用法，比如像我一样把类作为 `utils` 方法时，此时 `Utils` 类内部全部都是静态成员，我们也并不希望真的有人去实例化这个类。此时就可以使用私有构造函数来阻止它被错误地实例化：
~~~ts
class Utils {
  public static identifier = "linbudu";
  
  private constructor(){}

  public static makeUHappy() {
  }
}
~~~
或者在一个类希望把实例化逻辑通过方法来实现，而不是通过 `new` 的形式时，也可以使用私有构造函数来达成目的。

### SOLID 原则
`SOLID` 原则是面向对象编程中的基本原则，它包括以下这些五项基本原则:
- **S（单一功能原则）**：**一个类应该仅具有一种职责**，这也意味着只存在一种原因使得需要修改类的代码。
如对于一个数据实体的操作，其读操作和写操作也应当被视为两种不同的职责，并被分配到两个类中。更进一步，对实体的业务逻辑和对实体的入库逻辑也都应该被拆分开来。
- **O（开放封闭原则）**：**一个类应该是可扩展但不可修改的**。即假设我们的业务中支持通过微信、支付宝登录，原本在一个 `login` 方法中进行 `if else` 判断，
假设后面又新增了抖音登录、美团登录，难道要再加 `else if` 分支（或 `switch case`）吗？
  ~~~ts
  enum LoginType {
    WeChat,
    TaoBao,
    TikTok,
    // ...
  }
  
  class Login {
    public static handler(type: LoginType) {
      if (type === LoginType.WeChat) { }
      else if (type === LoginType.TikTok) { }
      else if (type === LoginType.TaoBao) { }
      else {
        throw new Error("Invalid Login Type!")
      }
    }
  }
  ~~~
  当然不，基于开放封闭原则，我们应当将登录的基础逻辑抽离出来，不同的登录方式通过扩展这个基础类来实现自己的特殊逻辑。
  ~~~ts
  abstract class LoginHandler {
    abstract handler(): void
  }
  
  class WeChatLoginHandler implements LoginHandler {
    handler() { }
  }
  
  class TaoBaoLoginHandler implements LoginHandler {
    handler() { }
  }
  
  class TikTokLoginHandler implements LoginHandler {
    handler() { }
  }
  
  class Login {
    public static handlerMap: Record<LoginType, LoginHandler> = {
      [LoginType.TaoBao]: new TaoBaoLoginHandler(),
      [LoginType.TikTok]: new TikTokLoginHandler(),
      [LoginType.WeChat]: new WeChatLoginHandler(),
  
    }
    public static handler(type: LoginType) {
      Login.handlerMap[type].handler()
    }
  }
  ~~~
- **L（里式替换原则）**：**一个派生类可以在程序的任何一处对其基类进行替换**。这也就意味着，子类完全继承了父类的一切，对父类进行了功能地扩展（而非收窄）。
- **I（接口分离原则）**：**类的实现方应当只需要实现自己需要的那部分接口**。比如微信登录支持指纹识别，支付宝支持指纹识别和人脸识别，
这个时候微信登录的实现类应该不需要实现人脸识别方法才对。这也就意味着我们提供的抽象类应当按照功能维度拆分成粒度更小的组成才对。
- **D（依赖倒置原则）**：这是实现开闭原则的基础，它的核心思想即是**对功能的实现应该依赖于抽象层**，即不同的逻辑通过实现不同的抽象类。
还是登录的例子，我们的登录提供方法应该基于共同的登录抽象类实现（`LoginHandler`），最终调用方法也基于这个抽象类，而不是在一个高阶登录方法中去依赖多个低阶登录提供方。

## 探秘内置类型：any、unknown、never 与类型断言
此前我们学习基础类型标注、字面量类型与枚举、函数与 `Class` 等概念时，实际上一直在用 `JavaScript` 的概念来进行映射，或者说这可以看作是 `JavaScript` 代码到 `TypeScript` 代码的第一步迁移。
接下来让我们使用 `TypeScript` 提供的内置类型在类型世界里获得更好的编程体验。

### 内置类型：any 、unknown 与 never
有些时候，我们的 `TS` 代码并不需要十分精确严格的类型标注。比如 `console.log` 方法就能够接受任意类型的参数，不管你是数组、字符串、对象或是其他的，统统来者不拒。那么，我们难道要把所有类型用联合类型串起来？

这当然不现实，为了能够表示“**任意类型**”，`TypeScript` 中提供了一个内置类型 `any` ，来表示所谓的任意类型。此时我们就可以使用 `any` 作为参数的类型：
~~~ts
log(message?: any, ...optionalParams: any[]): void
~~~
在这里，一个被标记为 `any` 类型的参数可以接受任意类型的值。除了 `message` 是 `any` 以外，`optionalParams` 作为一个 `rest` 参数，也使用 `any[]` 进行了标记，这就意味着你可以使用任意类型的任意数量类型来调用这个方法。除了显式的标记一个变量或参数为 `any`，在某些情况下你的变量/参数也会被隐式地推导为 `any`。比如使用 `let` 声明一个变量但不提供初始值，以及不为函数参数提供类型标注：
~~~ts
// any
let foo;

// foo、bar 均为 any
function func(foo, bar){}
~~~
以上的函数声明在 `tsconfig` 中启用了 `noImplicitAny` 时会报错，你可以显式为这两个参数指定 `any` 类型，或者暂时关闭这一配置（不推荐）。而 `any` 类型的变量几乎无所不能，它可以在声明后再次接受任意类型的值，同时可以被赋值给任意其它类型的变量：
~~~ts
// 被标记为 any 类型的变量可以拥有任意类型的值
let anyVar: any = "linbudu";

anyVar = false;
anyVar = "linbudu";
anyVar = {
  site: "juejin"
};

anyVar = () => { }

// 标记为具体类型的变量也可以接受任何 any 类型的值
const val1: string = anyVar;
const val2: number = anyVar;
const val3: () => {} = anyVar;
const val4: {} = anyVar;
~~~
你可以在 `any` 类型变量上任意地进行操作，包括赋值、访问、方法调用等等，此时可以认为类型推导与检查是被完全禁用的：
~~~ts
let anyVar: any = null;

anyVar.foo.bar.baz();
anyVar[0][1][2].prop1;
~~~
而 `any` 类型的主要意义，其实就是为了表示一个**无拘无束的“任意类型”，它能兼容所有类型，也能够被所有类型兼容**。这一作用其实也意味着类型世界给你开了一个外挂，无论什么时候，你都可以使用 `any` 类型跳过类型检查。当然，运行时出了问题就需要你自己负责了。
::: tip
`any` 的本质是类型系统中的顶级类型，即 `Top Type`，这是许多类型语言中的重要概念，我们会在类型层级部分讲解。
:::
`any` 类型的万能性也导致我们经常滥用它，比如类型不兼容了就 `any` 一下，类型不想写了也 `any` 一下，不确定可能会是啥类型还是 `any` 一下。此时的 `TypeScript` 就变成了令人诟病的 `AnyScript`。为了避免这一情况，我们要记住以下使用小 `tips` ：
- 如果是类型不兼容报错导致你使用 `any`，考虑用类型断言替代，我们下面就会开始介绍类型断言的作用。
- 如果是类型太复杂导致你不想全部声明而使用 `any`，考虑将这一处的类型去断言为你需要的最简类型。如你需要调用 `foo.bar.baz()`，就可以先将 
  `foo` 断言为一个具有 `bar` 方法的类型。
- 如果你是想表达一个未知类型，更合理的方式是使用 `unknown`。

`unknown` 类型和 `any` 类型有些类似，一个 `unknown` 类型的变量可以再次赋值为任意其它类型，但只能赋值给 `any` 与 `unknown` 类型的变量：
~~~ts
let unknownVar: unknown = "linbudu";

unknownVar = false;
unknownVar = "linbudu";
unknownVar = {
  site: "juejin"
};

unknownVar = () => { }

const val1: string = unknownVar; // Error
const val2: number = unknownVar; // Error
const val3: () => {} = unknownVar; // Error
const val4: {} = unknownVar; // Error

const val5: any = unknownVar;
const val6: unknown = unknownVar;
~~~
`unknown` 和 `any` 的一个主要差异体现在赋值给别的变量时，`any` 就像是 **我身化万千无处不在** ，所有类型都把它当自己人。而 unknown 就像是 **我虽然身化万千，但我坚信我在未来的某一刻会得到一个确定的类型** ，只有 `any` 和 `unknown` 自己把它当自己人。简单地说，`any` 放弃了所有的类型检查，而 `unknown` 并没有。这一点也体现在对 `unknown` 类型的变量进行属性访问时：
~~~ts
let unknownVar: unknown;

unknownVar.foo(); // 报错：对象类型为 unknown
~~~
要对 `unknown` 类型进行属性访问，需要进行类型断言（别急，马上就讲类型断言！），即**“虽然这是一个未知的类型，但我跟你保证它在这里就是这个类型！”**：
~~~ts
let unknownVar: unknown;

(unknownVar as { foo: () => {} }).foo();
~~~
::: tip
在类型未知的情况下，更推荐使用 `unknown` 标注。这相当于你使用额外的心智负担保证了类型在各处的结构，后续重构为具体类型时也可以获得最初始的类型信息，同时还保证了类型检查的存在。当然，`unknown` 用起来很麻烦，一堆类型断言写起来可不太好看。归根结底，到底用哪个完全取决于你自己，毕竟语言只是工具嘛。
:::

如果说，`any` 与 `unknown` 是比原始类型、对象类型等更广泛的类型，也就是说它们更上层一些，就像 `string` 字符串类型比 `'linbudu'` 字符串字面量更上层一些，即 `any/unknown` -> 原始类型、对象类型 -> 字面量类型。那么，是否存在比字面量类型更底层一些的类型？

这里的上层与底层，其实即意味着包含类型信息的多少。`any` 类型包括了任意的类型，字符串类型包括任意的字符串字面量类型，而字面量类型只表示一个精确的值类型。如要还要更底层，也就是再少一些类型信息，那就只能什么都没有了。

而内置类型 `never` 就是这么一个**什么都没有**的类型。此前我们已经了解了另一个**什么都没有**的类型`void`。但相比于 `void`，`never` 还要更加空白一些。

### 虚无的 never 类型
是不是有点不好理解？我们看一个联合类型的例子就能 get 到一些了:
~~~ts
type UnionWithNever = "linbudu" | 599 | true | void | never;
~~~
将鼠标悬浮在类型别名之上，你会发现这里显示的类型是`"linbudu" | 599 | true | void`。`never` 类型被直接无视掉了，而 `void` 仍然存在。这是因为，`void` 作为类型表示一个空类型，就像没有返回值的函数使用 `void` 来作为返回值类型标注一样，`void` 类型就像 `JavaScript` 中的 `null` 一样代表**这里有类型，但是个空类型**。

而 `never` 才是一个**什么都没有**的类型，它甚至不包括空的类型，严格来说`never`类型不携带任何的类型信息，因此会在联合类型中被直接移除，比如我们看 `void` 和 `never` 的类型兼容性：
~~~ts
declare let v1: never;
declare let v2: void;

v1 = v2; // X 类型 void 不能赋值给类型 never

v2 = v1;
~~~
在编程语言的类型系统中，`never` 类型被称为 `Bottom Type`，**是整个类型系统层级中最底层的类型**。和 `null`、`undefined` 一样，它是所有类型的子类型，但只有 `never` 类型的变量能够赋值给另一个 `never` 类型变量。

通常我们不会显式地声明一个 `never` 类型，它主要被类型检查所使用。但在某些情况下使用 `never` 确实是符合逻辑的，比如一个只负责抛出错误的函数：
~~~ts
function justThrow(): never {
  throw new Error()
}
~~~
在类型流的分析中，一旦一个返回值类型为 `never` 的函数被调用，那么下方的代码都会被视为无效的代码（即无法执行到）：
~~~ts
function justThrow(): never {
  throw new Error()
}

function foo (input:number){
  if(input > 1){
    justThrow();
    // 等同于 return 语句后的代码，即 Dead Code
    const name = "linbudu";
  }
}
~~~
我们也可以显式利用它来进行类型检查，即上面在联合类型中 `never` 类型神秘消失的原因。假设，我们需要对一个联合类型的每个类型分支进行不同处理：
~~~ts
declare const strOrNumOrBool: string | number | boolean;

if (typeof strOrNumOrBool === "string") {
  console.log("str!");
} else if (typeof strOrNumOrBool === "number") {
  console.log("num!");
} else if (typeof strOrNumOrBool === "boolean") {
  console.log("bool!");
} else {
  throw new Error(`Unknown input type: ${strOrNumOrBool}`);
}
~~~

























