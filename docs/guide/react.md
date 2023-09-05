# React
[官方文档](https://react.docschina.org/)
## 特点
- **声明式设计**: `React`采用声明范式, 可以轻松描述应用

- **高效**: `React`通过对`DOM`的模拟(虚拟dom), 最大限度的减少与`DOM`的交互

- **灵活**: `React`可以与已知的库或框架很好的配合

- **JSX**: `jsx`是`JavaScript`语法的扩展

- **组件**: 通过`React`构建组件, 使得代码更加容易复用, 能够很好的应用到大项目中

- **单向响应的数据流**: `React`实现了单向响应的数据流, 从而减少了重复代码, 这也是它为什么比传统数据绑定更简单

## React 组件的通信和强化方式
`React` 在引入 `Hooks` 的概念后，函数组件既保留了原本的简洁，也具备了状态管理、生命周期管理等能力，在原来 `Class` 组件所具备的能力基础上，还解决了 `Class` 组件存在的一些代码冗余、逻辑难以复用等问题。因此，在如今的 `React` 中，`Hooks` 已经逐渐取代了 `Class` 的地位，成了主导。

正所谓明其象意，知其本质，要想更好地玩转 `Hooks`，我们首先要了解组件的通信方式、强化方式，从而明确 `Hooks` 的优势所在。

### 组件的通信方式
`React` 将组件分为两大类，一类是类（ `Class` ）组件，另一类是函数（ `Function` ）组件。`React` 中的类和函数与普通的类和函数的区别为：**类和函数组件承载了渲染 UI 和更新 UI 的功能**。

每个组件既然是独立的个体，那么就需要“线”将它串联起来，让彼此知道如何运行，这就涉及到组件之间的相互通信问题。

在 `React` 中一共有五种通信方式，分别是：`props` 和 `callback`、`context`（跨层级）、`Event` 事件、`ref`传递、状态管理（如：`mobx` 等） 方式。

我们需要了解第一种和第二种最常用的方式，方便我们后续更好的学习。

#### props 和 callback 方式
这种方式是 `React` 中最常见、也是最基本的通讯方式，通常运用在父传子、子传父。
- 父传子
	父组件传递子组件：所有的参数都通过 `props` 传递，这里要注意一点，组件包裹的内容都在 `children` 中，如：
	~~~tsx
	import { useState } from "react";
    import { Button } from "antd";

    const Index: React.FC<any> = () => {
      const [flag, setFlag] = useState<boolean>(true);

      return (
        <>
          <div>我是父组件</div>
          <Button type="primary" onClick={() => setFlag((v) => !v)}>
            切换状态
          </Button>
          <Child flag={flag}>大家好，我是小杜杜，一起玩转Hooks吧！</Child>
        </>
      );
    };

    const Child: React.FC<any> = (props) => {
      const { flag, children } = props;
      return (
        <div style={{ border: "1px solid #000", padding: 20 }}>
          <div>我是子组件</div>
          <div>父组件传递的flag：{JSON.stringify(flag)}</div>
          <div>父组件传递的children：{children}</div>
        </div>
      );
    };

    export default Index;
	~~~
- 子传父
	子组件传父组件：子传父，也称状态提升，通过父组件传递的 callback 函数，通知父组件。如：
	~~~tsx
    import { useState } from "react";
    import { Button } from "antd";

    const Index: React.FC<any> = () => {
      	const [number, setNumber] = useState<number>(0);

      return (
        <>
          	<div>我是父组件</div>
          	<div>子组件的number：{number}</div>

          	<Child getNumber={(v: number) => { setNumber(v) }} >
            	大家好，我是小杜杜，一起玩转Hooks吧！
          	</Child>
        </>
      	)
    }

    const Child: React.FC<any> = ({ getNumber }) => {
      const [number, setNumber] = useState<number>(0);

      return (
        <div style={{ border: "1px solid #000", padding: 20 }}>
          <div>我是子组件</div>
          <Button
            type="primary"
            onClick={() => {
              const res = number + 1;
              setNumber(res);
              getNumber(res);
            }}
          >
            点击加一{number}
          </Button>
        </div>
      );
    };

    export default Index;
	~~~

#### context 方式
这种方式常用于上下文，用于实现祖代组件向后代组件跨层级传值。有些小伙伴可能觉得 `context` 在工作运用得较少，但实际上， `context` 是在 `React` 中一个非常重要的概念，`Vue` 中的 `provide & inject` 就来源于 `Context`。

Context 的模式:
- **创建 Context**：`React.createContext()`。
- **Provider**：提供者，外层提供数据的组件。
- **Consumer**：消费者，内层获取数据的组件。

举例：主题切换是 `Context` 最经典的应用之一，这里我们利用它来实现一个简单版的主题切换，帮助大家更好地理解 `Context`。
~~~tsx
import React, { useState, Component } from "react";
import { Checkbox, Button, Input } from "antd";

const ThemeContext: any = React.createContext(null); 

//主题颜色
const theme = {
	dark: {
	color: "#5B8FF9",
	background: "#5B8FF9",
	border: "1px solid #5B8FF9",
	type: "dark",
	buttomType: "primary",
	},
	light: {
	color: "#E86452",
	background: "#E86452",
	border: "1px solid #E86452",
	type: "light",
	buttomType: "default",
	},
};

const Index: React.FC<any> = () => {
	const [themeContextValue, setThemeContext] = useState(theme.dark);

	return (
	<ThemeContext.Provider
		value={{ ...themeContextValue, setTheme: setThemeContext }}
	>
		<Child />
	</ThemeContext.Provider>
	);
};

class Child extends Component<any, any> {
	static contextType = ThemeContext;
	render() {
	const { border, setTheme, color, background, buttomType }: any =
		this.context;
	return (
		<div style={{ border, color, padding: 20 }}>
		<div>
			<span> 选择主题： </span>
			<CheckboxView
			label="主题1"
			name="dark"
			onChange={() => setTheme(theme.dark)}
			/>
			<CheckboxView
			label="主题2"
			name="light"
			onChange={() => setTheme(theme.light)}
			/>
		</div>
		<div style={{ color, marginTop: 8 }}>
			大家好，我是小杜杜，一起玩转Hooks吧！
		</div>
		<div style={{ marginTop: 8 }}>
			<Input
			placeholder="请输入你的名字"
			style={{ color, border, marginBottom: 10 }}
			/>
			<Button type={buttomType}>提交</Button>
		</div>
		</div>
	);
	}
}

class CheckboxView extends Component<any, any> {
	static contextType = ThemeContext;

	render() {
	const { label, name, onChange } = this.props;
	const { color, type }: any = this.context;

	return (
		<div
		style={{
			display: "inline-block",
			marginLeft: 10,
		}}
		>
		<Checkbox checked={type === name} style={{ color }} onChange={onChange}>
			{label}
		</Checkbox>
		</div>
	);
	}
}

export default Index;
~~~
::: tip
- 问：在 Child 和 CheckboxView 中都有一个静态属性 contextType，后面也没有应用到，这个有什么用？

- 答：context 在 React v16 中更新的也较为频繁，static contextType 为新版消费的方式（注意版本在 React v16.6），这个静态属性（ contextType ）会指向需要获取的 context（也就是 ThemeContext ），这样就能通过 this.context 获取 Provider 提供的 contextValue。

- 可以看出 staic contextType 只适用于类中，那么函数式中如何消费？React 也提供了一个 Hooks：useContext 方式来消费，具体的使用在下节课介绍，这里不做过多赘述。
:::

### 强化组件的四种方式
既然组件在 `React` 中的地位超然，那么我们就需要掌握如何强化组件，帮助我们更好造轮子。`React` 提供： `mixin 模式`、`extends 继承模式`、`高阶组件模式`、`自定义 Hooks 模式`，共四种方式来强化组件。

其中，高阶组件模式和自定义 Hooks 模式是目前最常用的两种模式。

#### mixin 模式（已废弃）
`mixin` 模式也叫混合模式，这种模式是 `React` 早期的一种强化组件方式，用法与 `Vue` 中的 `mixins` 类似，但已被淘汰。
::: tip
要注意的是，如果使用 `mixin`，必须使用 `React.createClass`，这种模式类似于滚雪球，会越滚越大，导致复杂度逐渐累加，代码最终难以维护。

所以，在之后的 `React` 中，取消了 `React.createClass`，这也就意味 `mixin` 正式退出了 `React` 的舞台，所以这里我只是提及一下，并不做过多的讲解。
:::

#### extends 继承模式
`extends` 继承模式就是通过继承，一步一步地将组件强化，`React` 中的类本身也是继承， 如 `React.Component` 、 `React.PureComponent` 都是继承，但这种模式需要对组件进行足够的掌握，否则可能会发生一些奇怪的情况。
~~~tsx
import React from "react";
import { Button } from "antd";

class Child extends React.Component<any, any> {
	constructor(props: any) {
	super(props);
	this.state = {
		msg: "大家好，我是小杜杜，一起玩转Hooks吧！",
	};
	}

	speak() {
	console.log("Child中的speak");
	}

	render() {
	return (
		<>
		<div>{this.state.msg}</div>
		<Button type="primary" onClick={() => this.speak()}>
			查看控制台
		</Button>
		</>
	);
	}
}

class Index extends Child {
	speak() {
	console.log("extends 模式，强化后会替代Child的speak方法");
	}
}

export default Index;
~~~
在原本的 `Child` 中，点击按钮后应该打印出 `Child` 中的 `speak` 方法，可经过 `extends` 继承后，替换成 `Index` 中的 `speak` 方法。可见 `extends` 也是一种强化组件的手段。

#### 高阶组件（HOC）模式
高级组件模式也就是 `HOC`，是现如今最常见的强化组件方式，无论是面试还是日常的开发都有它的影子。

但 `HOC` 本身并不是 `React API` 的一部分，而是基于 `React` 的组合特性而形成的设计模式。

::: tip
- 问：什么样的组件被称为高阶组件？

- 答：如果一个组件接收的参数是一个组件，并且返回也是一个组件，那么这个组件就是高阶组件（HOC）。
:::
`Hoc` 模式与 `extends` 模式类似，都是逐渐强化组件，使组件越来越强大、健壮，但 `extends` 继承模式需要考虑的因素很多，HOC 模式适应性更强。举个例子：
~~~tsx
import React, { useState } from "react";
import { Button } from "antd";

const HOC = (Component: any) => (props: any) => {
	return (
	<Component
		name={"大家好，我是小杜杜，一起玩转Hooks吧！"}
		{...props}
	></Component>
	);
};

const Index: React.FC<any> = (props) => {
	const [flag, setFlag] = useState<boolean>(false);

	return (
	<div>
		<Button type="primary" onClick={() => setFlag(true)}>
		获取props
		</Button>
		{flag && <div>{JSON.stringify(props)}</div>}
	</div>
	);
};

export default HOC(Index);
~~~
::: tip
- 问：在上面的例子中， HOC = (Component: any) => (props: any) => {} 这种写法是什么意思？

- 答：这种写法实际是一种简写方式，如果不好理解，可以看看这种方式转化为 ES5 是什么样子：
  	~~~ts
   	var HOC = function (Component) { 
      	return function (props) {
          	return React.createElement(Component, __assign({ name: "大家好，我是小杜杜，一起玩转Hooks吧！" }, props));
      	}; 
    };
  	~~~
:::
::: tip
实际上，`HOC` 可以做很多事情，比如**强化 props、条件渲染、性能优化、事件赋能、反向继承等**，这块内容本身也比较大，感兴趣的话。可以看看以下两篇的内容，帮助大家更好掌握 `HOC`：
- [作为一名 React，我是这样理解 HOC 的；](https://juejin.cn/post/7103345085089054727)
- [花三个小时，完全掌握分片渲染和虚拟列表～。](https://juejin.cn/post/7121551701731409934)
:::

#### 自定义 Hooks 模式
`Hooks` 是 `React v16.8` 以后新增的 `API`，目的是增加代码的可复用性、逻辑性，最主要的目的是解决了函数式组件无状态的问题，这样既保留了函数式的简单，又解决了没有数据管理状态的缺陷。

自定义 `Hooks` 实际上是在辅助组件，让其开发更加丝滑、简洁、维护性更高。

`Hooks` 可以说是现如今最常用、最主流的强化组件方式，学好 `Hooks` 是非常重要的，接下来我们一起来看看 `Hooks` 在 `React` 中的地位。

##### Class 组件的缺陷
在 `React v16.8` 之前，我们都使用 `Class` 组件，很少去用函数组件，根本原因是函数组件虽然简洁，但没有数据状态管理，这个致命的缺陷使 `Class` 组件成为了主流。

但当 `React v16.8` 的出现，带来了全新的 `Hooks API`，它彻底解决了函数式的这个缺陷。这里我们简要列举出 `Class` 组件的 `3` 点主要缺陷，看看为何会出现 `Hooks`。
- **super 的传递**
	
	在讲解 `extends` 继承模式的时候有这样一段代码：
	~~~ts
	class Child extends React.Component<any, any> {
		constructor(props: any) {
			super(props);
			this.state = {
				msg: "大家好，我是小杜杜，一起玩转Hooks吧！",
			};
		}
	}
	~~~
	实际上 `super` 的作用等于执行 `Component` 函数，如果不使用 `super()` 就会导致 `Component` 函数内的 `props` 找不到，也就是在代码中使用 `this.props` 打印出 `undefined`，所以这段代码是必要的。

- **奇怪的 this 指向**
	
	在 `Class` 的写法中，随处可见的就是 `.bind(this)`，为什么所有的方法都要进行绑定呢？不绑定的话，为什么找不到对应的 `this` 呢？有些小伙伴可能会问，看你使用的是箭头函数，并没有绑定 `this` 啊，但要记住箭头函数是 `ES6` 的产物，如果没有箭头函数，还是需要进行 `bind` 绑定。

	之所以 `Class` 组件需要 `bind` 的根本原因是在 `React` 的事件机制中，`dispatchEvent` 调用的 `invokeGuardedCallback` 是直接使用的 `func`，并没有指定调用的组件，所以在 `Class` 组件中的方法都需要手动绑定 `this`。

	而箭头函数本身并不会创建自己的 `this`，它会继承上层的 `thi`s，所以不需要进行绑定，`this` 本身就是指向的组件。

- **繁琐的生命周期**
	在 `Class` 组件中有很多关于生命周期的 `API`，以此用来数据管理，主要的版本分为 `v16.0` 和 `v16.4`，如：`componentDidMount`、`getDerivedStateFromProps(prevProps, prevState)` 等，大概有 9 个 API，我们要完全掌握生命周期的用法，显然并不是一件容易的事。

	在了解到 `Class` 组件的缺陷后，我们反观函数式组件是否存在这些问题。

	从代码中看到函数式组件并没有 `super`，更不用关心 `this` 的指向，相对于类中繁琐的生命周期，都可以使用 `useState`、`useEffect`等 `Hooks` 代替，极大地降低了代码数量、行数，使其更容易上手，代码更加简洁、规整、维护性更高。

##### 更好的状态复用
从强化组件的模型中，我们可以看出自定义 `Hooks` 的模式与 `mixin` 模式更相近。

但为什么 `mixin` 会被废弃，其根本原因是 `mixin` 的弊端太多了，并且 `React` 官方也明确表示不建议我们去使用 `mixins`

而 `Hooks` 可以完美避开 `mixin` 的弊端，并且简单，高度聚合，阅读方便，给开发人员带来效率提升，`Bug` 数减少，这样的 `Hooks`，有谁不爱呢？


##### 友好的替代
当 `React` 官方提供了 `Hooks API` 后，并没有强制开发人员去使用它，而是将优势与劣势摆出来，是否使用的最终决定权交给大众选择。

这样在项目中，即可以使用熟悉的 `Class`，又能尝试新颖的 `Hooks`。当项目的逐渐迭代，开发人员在开发过程中逐渐了解 `Hooks` 的优势。这种悄无声息的改变，使越来越多的人熟悉 `Hooks`、加入 `Hooks`。

## 内置 Hooks
`React v16.8` 中提供了 `useState`、`useEffect`、`useContext`、`useReducer`、`useMemo`、`useCallback`、`useRef`、`useImperativeHandle`、`useLayoutEffect`、`useDebugValue` 这 10 个 API 的使用方法。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/db29d9f0830442a5be642ec3e31eb90b~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

`React v18`中提供了 `useSyncExternalStore`、`useTransition`、`useDeferredValue`、`useInsertionEffect`、`useId` 这 5 个 API 的使用方法。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/4067188b7c524b30ad782014e088b223~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### useState
定义变量，使其具备类组件的 `state`，让函数式组件拥有更新视图的能力。

基本使用：
~~~ts
const [state, setState] = useState(initData)
~~~
- `initData`：默认初始值，有两种情况：函数和非函数，如果是函数，则函数的返回值作为初始值。
- `state`：数据源，用于渲染 `UI 层`的数据源；
- `setState`：改变数据源的函数，可以理解为类组件的 `this.setState`。

基本用法 ( 主要介绍两种`setState`的使用方法 )：
~~~tsx
import { useState } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  	const [count, setCount] = useState<number>(0);

  	return (
    <>
      	<div>数字：{count}</div>
    	<Button type="primary" onClick={() => setCount(count + 1)}>
        	第一种方式+1
    	</Button>
    	<Button
        	type="primary"
        	style={{ marginLeft: 10 }}
        	onClick={() => setCount((v) => v + 1)}
      	>
        第二种方式+1
    	</Button>
    </>
  	);
};

export default Index;
~~~
::: tip
注意： `useState` 有点类似于 `PureComponent`，它会进行一个比较浅的比较，这就导致了一个问题，如果是对象直接传入的时候，并不会实时更新，这点一定要切记。
:::
我们做个简单的对比，比如：
~~~tsx
import { useState } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  const [state, setState] = useState({ number: 0 });
  let [count, setCount] = useState(0);

  return (
    <>
      <div>数字形式：{count}</div>
      <Button
        type="primary"
        onClick={() => {
          count++;
          setCount(count);
        }}
      >
        点击+1
      </Button>
      <div>对象形式：{state.number}</div>
      <Button
        type="primary"
        onClick={() => {
          state.number++;
          setState(state);
        }}
      >
        点击+1
      </Button>
    </>
  );
};

export default Index;
~~~

### useEffect
副作用，这个钩子成功弥补了函数式组件没有生命周期的缺陷，是我们最常用的钩子之一。

基本使用：
~~~ts
useEffect(()=>{ 
    return destory
}, deps)
~~~
- `callback`：`useEffect` 的第一个入参，最终返回 `destory`，它会在下一次 `callback` 执行之前调用，其作用是清除上次的 `callback` 产生的副作用；
- `deps`：依赖项，可选参数，是一个数组，可以有多个依赖项，通过依赖去改变，执行上一次的 `callback` 返回的 `destory` 和新的 `effect` 第一个参数 `callback`。

**模拟挂载和卸载阶段：**
事实上，`destory` 会用在组件卸载阶段上，把它当作组件卸载时执行的方法就 `ok`，通常用于监听 `addEventListener` 和 `removeEventListener` 上，如：
~~~tsx
import { useState, useEffect } from "react";
import { Button } from "antd";

const Child = () => {
  useEffect(() => {
    console.log("挂载");

    return () => {
      console.log("卸载");
    };
  }, []);

  return <div>大家好，我是小杜杜，一起学习hooks吧！</div>;
};

const Index: React.FC<any> = () => {
  const [flag, setFlag] = useState(false);

  return (
    <>
      <Button
        type="primary"
        onClick={() => {
          setFlag((v) => !v);
        }}
      >
        {flag ? "卸载" : "挂载"}
      </Button>
      {flag && <Child />}
    </>
  );
};

export default Index;
~~~
**依赖变化：**
`dep`的个数决定`callback`什么时候执行，如：
~~~tsx
import { useState, useEffect } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  const [number, setNumber] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("count改变才会执行");
  }, [count]);

  return (
    <>
      <div>
        number: {number} count: {count}
      </div>
      <Button type="primary" onClick={() => setNumber((v) => v + 1)}>
        number + 1
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => setCount((v) => v + 1)}
      >
        count + 1
      </Button>
    </>
  );
};

export default Index;
~~~
**无限执行：**
当 `useEffect` 的第二个参数 `deps` 不存在时，会无限执行。更加准确地说，只要数据源发生变化（不限于自身中），该函数都会执行，所以请不要这么做，否则会出现不可控的现象。
~~~tsx
import { useState, useEffect } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  const [count, setCount] = useState(0);
  const [flag, setFlag] = useState(false);

  useEffect(() => {
    console.log("大家好，我是小杜杜，一起学习hooks吧！");
  });

  return (
    <>
      <Button type="primary" onClick={() => setCount((v) => v + 1)}>
        数字加一：{count}
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => setFlag((v) => !v)}
      >
        状态切换：{JSON.stringify(flag)}
      </Button>
    </>
  );
};

export default Index;
~~~

### useContext
上下文，类似于 `Context`，其本意就是设置全局共享数据，使所有组件可跨层级实现共享。

`useContext` 的参数一般是由 `createContext` 创建，或者是父级上下文 `context` 传递的，通过 `CountContext.Provider` 包裹的组件，才能通过 `useContext` 获取对应的值。我们可以简单理解为 `useContext` 代替 `context.Consumer` 来获取 `Provider` 中保存的 `value` 值。

基本使用：
~~~ts
const contextValue = useContext(context)
~~~
- `context`：一般而言保存的是 `context` 对象。
- `contextValue`：返回的数据，也就是`context`对象内保存的`value`值。

基本用法 ( 子组件 `Child` 和孙组件 `Son`，共享父组件 `Index` 的数据 `count` ) ： 
~~~tsx
import { useState, createContext, useContext } from "react";
import { Button } from "antd";

const CountContext = createContext(-1);

const Child = () => {
  const count = useContext(CountContext);

  return (
    <div style={{ marginTop: 10 }}>
      子组件获取到的count: {count}
      <Son />
    </div>
  );
};

const Son = () => {
  const count = useContext(CountContext);

  return <div style={{ marginTop: 10 }}>孙组件获取到的count: {count}</div>;
};

const Index: React.FC<any> = () => {
  let [count, setCount] = useState(0);

  return (
    <>
      <div>父组件中的count：{count}</div>
      <Button type="primary" onClick={() => setCount((v) => v + 1)}>
        点击+1
      </Button>
      <CountContext.Provider value={count}>
        <Child />
      </CountContext.Provider>
    </>
  );
};

export default Index;
~~~

### useReducer
功能类似于 `redux`，与 `redux` 最大的不同点在于它是单个组件的状态管理，组件通讯还是要通过 `props`。简单地说，`useReducer` 相当于是 `useState` 的升级版，用来处理复杂的 `state` 变化。

基本使用：
~~~ts
const [state, dispatch] = useReducer(
    (state, action) => {}, 
    initialArg,
    init
);
~~~
- `reducer`：函数，可以理解为 `redux` 中的 `reducer`，最终返回的值就是新的数据源 `state`；
- `initialArg`：初始默认值；
- `init`：惰性初始化，可选值。
- `state`：更新之后的数据源；
- `dispatch`：用于派发更新的`dispatchAction`，可以认为是`useState`中的`setState`。

::: tip
- 问：什么是惰性初始化？

- 答：惰性初始化是一种延迟创建对象的手段，直到被需要的第一时间才去创建，这样做可以将用于计算 `state` 的逻辑提取到 `reducer` 外部，这也为将来对重置 `state` 的 `action` 做处理提供了便利。换句话说，如果有 `init`，就会取代 `initialArg`。
:::

基本用法：
~~~tsx
import { useReducer } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  const [count, dispatch] = useReducer((state: number, action: any) => {
    switch (action?.type) {
      case "add":
        return state + action?.payload;
      case "sub":
        return state - action?.payload;
      default:
        return state;
    }
  }, 0);

  return (
    <>
      <div>count：{count}</div>
      <Button
        type="primary"
        onClick={() => dispatch({ type: "add", payload: 1 })}
      >
        加1
      </Button>
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => dispatch({ type: "sub", payload: 1 })}
      >
        减1
      </Button>
    </>
  );
};

export default Index;
~~~
::: tip
注意： 在 `reducer` 中，如果返回的 `state` 和之前的 `state` 值相同，那么组件将不会更新。
:::
比如这个组件是子组件，并不是组件本身，然后我们对上面的例子稍加更改，看看这个问题：
~~~tsx
const Index: React.FC<any> = () => {
  console.log("父组件发生更新");
  ...
  return (
    <>
        ...
      <Button
        type="primary"
        style={{ marginLeft: 10 }}
        onClick={() => dispatch({ type: "no", payload: 1 })}
      >
        无关按钮
      </Button>
      <Child count={count} />
    </>
  )
};

const Child: React.FC<any> = ({ count }) => {
  console.log("子组件发生更新");
  return <div>在子组件的count：{count}</div>;
};
~~~
::: tip
当 `count` 无变化时，子组件并不会更新，这点还希望大家铭记。
:::

### useMemo
在每一次的状态更新中，都会让组件重新绘制，而重新绘制必然会带来不必要的性能开销，为了防止没有意义的性能开销，`React Hooks` 提供了 `useMemo` 函数。

理念与 `memo` 相同，都是判断是否满足当前的限定条件来决定是否执行 `callback` 函数。它之所以能带来提升，是因为在依赖不变的情况下，会返回相同的引用，避免子组件进行无意义的重复渲染。

基本使用：
~~~ts
const cacheData = useMemo(fn, deps)
~~~
- `fn`：函数，函数的返回值会作为缓存值；
- `deps`：依赖项，数组，会通过数组里的值来判断是否进行 `fn` 的调用，如果发生了改变，则会得到新的缓存值。
- `cacheData`：更新之后的数据源，即 `fn` 函数的返回值，如果 `deps` 中的依赖值发生改变，将重新执行 `fn`，否则取上一次的缓存值。

举个案例：
~~~tsx
import { useState } from "react";
import { Button } from "antd";

const usePow = (list: number[]) => {
  return list.map((item: number) => {
    console.log("我是usePow");
    return Math.pow(item, 2);
  });
};

const Index: React.FC<any> = () => {
  let [flag, setFlag] = useState(true);

  const data = usePow([1, 2, 3]);

  return (
    <>
      <div>数字集合：{JSON.stringify(data)}</div>
      <Button type="primary" onClick={() => setFlag((v) => !v)}>
        状态切换{JSON.stringify(flag)}
      </Button>
    </>
  );
};

export default Index;
~~~
从例子中来看， 按钮切换的 `flag` 应该与 `usePow` 的数据毫无关系，但当我们点击按钮后，会打印我是 `usePow`，这样就会产生开销。毫无疑问，这种开销并不是我们想要见到的结果，所以有了 `useMemo`。 并用它进行如下改造：
~~~ts
const usePow = (list: number[]) => {
  return useMemo(
    () =>
      list.map((item: number) => {
        console.log(1);
        return Math.pow(item, 2);
      }),
    []
  );
};
~~~

### useCallback
与 `useMemo` 极其类似，甚至可以说一模一样，唯一不同的点在于，`useMemo` 返回的是值，而 `useCallback` 返回的是函数。

基本使用：
~~~ts
const resfn = useCallback(fn, deps)
~~~
- `fn`：函数，函数的返回值会作为缓存值；
- `deps`：依赖项，数组，会通过数组里的值来判断是否进行 `fn` 的调用，如果依赖项发生改变，则会得到新的缓存值。
- `resfn`：更新之后的数据源，即 `fn` 函数，如果 `deps` 中的依赖值发生改变，将重新执行 `fn`，否则取上一次的函数。

基础用法：
~~~tsx
import { useState, useCallback, memo } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  let [count, setCount] = useState(0);
  let [flag, setFlag] = useState(true);

  const add = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <>
      <TestButton onClick={() => setCount((v) => v + 1)}>普通点击</TestButton>
      <TestButton onClick={add}>useCallback点击</TestButton>
      <div>数字：{count}</div>
      <Button type="primary" onClick={() => setFlag((v) => !v)}>
        切换{JSON.stringify(flag)}
      </Button>
    </>
  );
};

const TestButton = memo(({ children, onClick = () => {} }: any) => {
  console.log(children);
  return (
    <Button
      type="primary"
      onClick={onClick}
      style={children === "useCallback点击" ? { marginLeft: 10 } : undefined}
    >
      {children}
    </Button>
  );
});

export default Index;
~~~
简要说明下，`TestButton` 里是个按钮，分别存放着有无 `useCallback` 包裹的函数，在父组件 `Index` 中有一个 `flag` 变量，这个变量同样与 `count` 无关，我们切换 `flag` 的时候，没有经过 `useCallback` 的函数会再次执行，而包裹的函数并没有执行（点击“普通点击”按钮的时候，`useCallbak` 的依赖项 `count` 发生了改变，所以会打印出 `useCallback` 点击）。
::: tip
- 问：为什么在 `TestButton` 中使用了 `React.memo`，不使用会怎样？

- 答：`useCallback` 必须配合 `React.memo` 进行优化，如果不配合使用，性能不但不会提升，还有可能降低。至于为什么，容我在这里先卖个关子，在后面讲解 `useCallback` 源码中详细说明，这节我们只要学会使用即可。
:::

### useRef
用于获取当前元素的所有属性，除此之外，还有一个高级用法：缓存数据（后面介绍自定义`Hooks`的时候会详细介绍）。

基本使用：
~~~ts
const ref = useRef(initialValue);
~~~
- initialValue：初始值，默认值。
- ref：返回的一个 current 对象，这个 current 属性就是 ref 对象需要获取的内容。

基本用法：
~~~tsx
import { useState, useRef } from "react";

const Index: React.FC<any> = () => {
  	const scrollRef = useRef<any>(null);
  	const [clientHeight, setClientHeight] = useState<number>(0);
  	const [scrollTop, setScrollTop] = useState<number>(0);
  	const [scrollHeight, setScrollHeight] = useState<number>(0);

  	const onScroll = () => {
    	if (scrollRef?.current) {
      		let clientHeight = scrollRef?.current.clientHeight; //可视区域高度
      		let scrollTop = scrollRef?.current.scrollTop; //滚动条滚动高度
      		let scrollHeight = scrollRef?.current.scrollHeight; //滚动内容高度
      		setClientHeight(clientHeight);
      		setScrollTop(scrollTop);
      		setScrollHeight(scrollHeight);
    	}
  	};

  	return (
    	<>
      		<div>
        		<p>可视区域高度：{clientHeight}</p>
        		<p>滚动条滚动高度：{scrollTop}</p>
        		<p>滚动内容高度：{scrollHeight}</p>
      		</div>
      		<div
        		style={{ height: 200, border: "1px solid #000", overflowY: "auto" }}
        		ref={scrollRef}
        		onScroll={onScroll}
      		>
        		<div style={{ height: 2000 }}></div>
      		</div>
    	</>
  	)
}

export default Index;
~~~

### useImperativeHandle
可以通过 `ref` 或 `forwardRef` 暴露给父组件的实例值，所谓的实例值是指值和函数。

实际上这个钩子非常有用，简单来讲，这个钩子可以让不同的模块关联起来，让父组件调用子组件的方法。

举个例子，在一个页面很复杂的时候，我们会将这个页面进行模块化，这样会分成很多个模块，有的时候我们需要在**最外层的组件上**控制其他组件的方法，希望最外层的点击事件同时执行**子组件的事件**，这时就需要 `useImperativeHandle` 的帮助（在不用`redux`等状态管理的情况下）。

基本使用：
~~~ts
useImperativeHandle(ref, createHandle, deps)
~~~
- `ref`：接受 `useRef` 或 `forwardRef` 传递过来的 `ref`；
- `createHandle`：处理函数，返回值作为暴露给父组件的 `ref` 对象；
- `deps`：依赖项，依赖项如果更改，会形成新的 `ref` 对象。

父组件是函数式组件：
~~~tsx
import { useState, useRef, useImperativeHandle } from "react";
import { Button } from "antd";

const Child = ({cRef}:any) => {

  const [count, setCount] = useState(0)

  useImperativeHandle(cRef, () => ({
    add
  }))

  const add = () => {
    setCount((v) => v + 1)
  }

  return <div>
    <p>点击次数：{count}</p>
    <Button onClick={() => add()}> 子组件的按钮，点击+1</Button>
  </div>
}

const Index: React.FC<any> = () => {
  const ref = useRef<any>(null)

  return (
    <>
      <div>大家好，我是小杜杜，一起学习hooks吧！</div>
      <div></div>
      <Button
        type="primary"
        onClick={() =>  ref.current.add()}
      >
        父组件上的按钮，点击+1
      </Button>
      <Child cRef={ref} />
    </>
  );
};

export default Index;
~~~
当父组件是类组件时：
- 如果当前的父组件是 `Class` 组件，此时不能使用 `useRef`，而是需要用 `forwardRef` 来协助我们处理。

- `forwardRef`：引用传递，是一种通过组件向子组件自动传递引用 `ref` 的技术。对于应用者的大多数组件来说没什么作用，但对于一些重复使用的组件，可能有用。

- 听完 `forwardRef` 的概念是不是有点云里雾里的感觉，什么是引用传递呢？是不是感觉很陌生，官方中，也对 `forwardRef` 的介绍很少，别纠结，先来思考下。

::: tip
- 问：在上述的例子中，我们通过 `cRef` 传递 `ref`，为什么不能直接用 `ref` 传递 `ref` 呢（毕竟我们平常传递的参数都会尽可能保持一致）？

- 简化一下问题：函数式组件中允许 `ref` 通过 `props` 传参吗？

- 答：在函数式组件中不允许 `ref` 作为参数，除了 `ref`，`key` 也不允许作为参数，原因是在 `React` 内部中，`ref` 和 `key` 会形成单独的 `key` 名。
:::

回过头来看 `forwardRef`，所谓引用传递就是为了解决无法传递 `ref` 的问题。

经过 `forwardRef` 包裹后，会将 `props`（其余参数）和 `ref` 拆分出来，`ref` 会作为第二个参数进行传递。如：
~~~tsx
import { useState, useRef, useImperativeHandle, Component, forwardRef } from "react";
import { Button } from "antd";

const Child = (props:any, ref:any) => {

  const [count, setCount] = useState(0)

  useImperativeHandle(ref, () => ({
    add
  }))

  const add = () => {
    setCount((v) => v + 1)
  }

  return <div>
    <p>点击次数：{count}</p>
    <Button onClick={() => add()}> 子组件的按钮，点击+1</Button>
  </div>
}

const ForwardChild = forwardRef(Child)

class Index extends Component{
  countRef:any = null
  render(){
    return   <>
      <div>大家好，我是小杜杜，一起学习hooks吧！</div>
      <div></div>
      <Button
        type="primary"
        onClick={() => this.countRef.add()}
      >
        父组件上的按钮，点击+1
      </Button>
      <ForwardChild ref={node => this.countRef = node} />
    </>
  }
}

export default Index;
~~~

### useLayoutEffect
与 `useEffect` 基本一致，不同点在于它是同步执行的。简要说明：
- 执行顺序：`useLayoutEffect` 是在 `DOM` 更新之后，浏览器绘制之前的操作，这样可以更加方便地修改 `DOM`，获取 `DOM` 信息，这样浏览器只会绘制一次，所以 `useLayoutEffect` 的执行顺序在 `useEffect` 之前；
- `useLayoutEffect` 相当于有一层防抖效果；
- `useLayoutEffect` 的 `callback` 中会阻塞浏览器绘制。

基本使用：
~~~ts
useLayoutEffect(callback,deps)
~~~

防抖效果：
~~~tsx
import { useState, useEffect, useLayoutEffect } from "react";

const Index: React.FC<any> = () => {
  let [count, setCount] = useState(0);
  let [count1, setCount1] = useState(0);

  useEffect(() => {
    if(count === 0){
      setCount(10 + Math.random() * 100)
    }
  }, [count])

  useLayoutEffect(() => {
    if(count1 === 0){
      setCount1(10 + Math.random() * 100)
    }
  }, [count1])

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <div>useEffect的count:{count}</div>
      <div>useLayoutEffect的count:{count1}</div>
    </>
  );
};

export default Index;
~~~
在这个例子中，我们分别设置 `count` 和 `count1` 两个变量，初始值都为 `0`，然后分别通过 `useEffect` 和 `useLayout` 控制，通过随机值来变更两个变量的值。也就是说，`count` 和 `count1` 连续变更了两次。

`count` 要比 `count1` 更加抖动（效果可能感觉不到，建议自己试试，刷新的快点就能看到效果）。

这是因为两者的执行顺序，简要分析下：
- `useEffect` 执行顺序：`setCount` 设置 => 在 `DOM` 上渲染 => `useEffect` 回调 => `setCount` 设置 => 在 `DOM` 上渲染。
- `useLayoutEffect` 执行顺序：`setCount` 设置 => `useLayoutEffect` 回调 => `setCount` 设置 => 在 `DOM` 上渲染。

可以看出，`useEffect` 实际进行了两次渲染，这样就可能导致浏览器再次回流和重绘，增加了性能上的损耗，从而会有闪烁突兀的感觉。
::: tip
- 问：既然 `useEffect` 会执行两次渲染，导致回流和重绘，相比之下， `useLayoutEffect` 的效果要更好，那么为什么都用 `useEffect` 而不用 `useLayoutEffect` 呢？

- 答：根本原因还是同步和异步，虽然 `useLayoutEffect` 只会渲染一次，但切记，它是同步，类比于 `Class` 组件中，它更像 `componentDidMount`，因为它们都是同步执行。既然是同步，就有可能阻塞浏览器的渲染，而 `useEffect` 是异步的，并不会阻塞渲染。

其次，给用户的感觉不同，对比两者的执行顺序，`useLayoutEffect` 要经过本身的回调才设置到 `DOM` 上，也就是说，`useEffect` 呈现的速度要快于 `useLayoutEffect`，让用户有更快的感知。

最后，即使 `useEffect` 要渲染两次，但从效果上来看，变换的时间非常短，这样情况下，也无所谓，除非闪烁、突兀的感觉非常明显，才会去考虑使用 `useLayoutEffect` 去解决。
:::

### useDebugValue
可用于在 `React` 开发者工具中显示自定义 `Hook` 的标签。这个 `Hooks` 目的就是检查自定义 `Hooks`。
::: tip
注意： 这个标签并不推荐向每个 `hook` 都添加 `debug` 值。当它作为共享库的一部分时才最有价值。（也就是自定义 `Hooks` 被复用的值）。因为在一些情况下，格式化值可能是一项开销很大的操作，除非你需要检查 `Hook`，否则没有必要这么做。
:::
基本使用：
~~~ts
useDebugValue(value, (status) => {})
~~~
- `value`：判断的值；
- `callback`：可选，这个函数只有在 `Hook` 被检查时才会调用，它接受 `debug` 值作为参数，并且会返回一个格式化的显示值。

基本用法：
~~~ts
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  // ...

  // 在开发者工具中的这个 Hook 旁边显示标签  
  // e.g. "FriendStatus: Online"  useDebugValue(isOnline ? 'Online' : 'Offline');
  return isOnline;
}
~~~

### useSyncExternalStore
会通过强制的同步状态更新，使得外部 `store` 可以支持并发读取。
::: tip
注意： 这个 `Hooks` 并不是在日常开发中使用的，而是给第三方库 `redux`、`mobx` 使用的，因为在 R`eact v18` 中，主推的 `Concurrent`（并发）模式可能会出现状态不一致的问题（比如在 `react-redux 7.2.6` 的版本），所以官方给出 `useSyncExternalStore` 来解决此类问题。
:::
简单地说，`useSyncExternalStore` 能够让 `React` 组件在 `Concurrent` 模式下安全、有效地读取外接数据源，在组件渲染过程中能够检测到变化，并且在数据源发生变化的时候，能够调度更新。

当读取到外部状态的变化，会触发强制更新，以此来保证结果的一致性。

基本使用：
~~~ts
const state = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
)
~~~
- `subscribe`：订阅函数，用于注册一个回调函数，当存储值发生更改时被调用。 此外，`useSyncExternalStore` 会通过带有记忆性的 `getSnapshot` 来判断数据是否发生变化，如果发生变化，那么会强制更新数据；
- `getSnapshot`：返回当前存储值的函数。必须返回缓存的值。如果 `getSnapshot` 连续多次调用，则必须返回相同的确切值，除非中间有存储值更新；
- `getServerSnapshot`：返回服务端（`hydration` 模式下）渲染期间使用的存储值的函数。
- `state`：数据源，用于渲染 `UI 层`的数据源。

基本用法：
~~~tsx
import { useSyncExternalStore } from "react";
import { Button } from "antd";
import { combineReducers, createStore } from "redux";

const reducer = (state: number = 1, action: any) => {
  switch (action.type) {
    case "ADD":
      return state + 1;
    case "DEL":
      return state - 1;
    default:
      return state;
  }
};

/* 注册reducer,并创建store */
const rootReducer = combineReducers({ count: reducer });
const store = createStore(rootReducer, { count: 1 });

const Index: React.FC<any> = () => {
  //订阅
  const state = useSyncExternalStore(
    store.subscribe,
    () => store.getState().count
  );

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <div>数据源： {state}</div>
      <Button type="primary" onClick={() => store.dispatch({ type: "ADD" })}>
        加1
      </Button>
      <Button
        style={{ marginLeft: 8 }}
        onClick={() => store.dispatch({ type: "DEL" })}
      >
        减1
      </Button>
    </>
  );
};

export default Index;
~~~
当我们点击按钮后，会触发 `store.subscribe`（订阅函数），执行 `getSnapshot` 后得到新的 `count`，此时 `count` 发生变化，就会触发更新。

### useTransition
返回一个状态值表示过渡更新任务的等待状态，以及一个启动该过渡更新任务的函数。
::: tip
- 问：什么是过渡更新任务？

- 答：过渡任务是对比紧急更新任务所产生的。

紧急更新任务指输入框、按钮等任务需要在视图上立即做出响应，让用户立马能够看到效果的任务。

但有时更新任务不一定那么紧急，或者说需要去请求数据，导致新的状态不能够立马更新，需要一个 loading... 的状态，这类任务称为过渡任务。
:::
我们再来举个比较常见的例子帮助理解紧急更新任务和过渡更新任务。

当我们有一个 `input` 输入框，这个输入框的值要维护一个很大列表（假设列表有 `1w` 条数据），比如说过滤、搜索等情况，这时有两种变化：
- `input` 框内的变化；
- 根据 `input` 的值，`1w` 条数据的变化。

`input` 框内的变化是实时获取的，也就是受控的，此时的行为就是紧急更新任务。而这 `1w` 条数据的变化，就会有过滤、重新渲染的情况，此时这种行为被称为过渡更新任务。

基本使用：
~~~ts
const [isPending, startTransition] = useTransition();
~~~
- `isPending`：布尔值，过渡状态的标志，为 `true` 时表示等待状态；
- `startTransition`：可以将里面的任务变成过渡更新任务。

基本用法：
~~~tsx
import { useState, useTransition } from "react";
import { Input } from "antd";

const Index: React.FC<any> = () => {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [list, setList] = useState<string[]>([]);

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <Input
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          startTransition(() => {
            const res: string[] = [];
            for (let i = 0; i < 10000; i++) {
              res.push(e.target.value);
            }
            setList(res);
          });
        }}
      />
      {isPending ? (
        <div>加载中...</div>
      ) : (
        list.map((item, index) => <div key={index}>{item}</div>)
      )}
    </>
  );
};

export default Index;
~~~
从上述的代码可以看到，我们通过 `input` 去维护了 `1w` 条数据，通过 `isPending` 的状态来控制是否展示完成。

可以看出，`useTransition` 是为了处理大量数据而存在的，那么有些小伙伴可能会问，这种情况不应该用防抖吗？为什么还会出现 `useTransition` 呢？

实际上防抖的本质是 `setTimeout`，也就是减少了渲染的次数，而 `useTransition` 并没有减少其渲染的次数，至于具体的区别，在之后的源码篇中专门介绍，这里我们只要清楚 `useTransition` 的用法即可。

### useDeferredValue
可以让状态滞后派生，与 `useTransition` 功能类似，推迟屏幕优先级不高的部分。

在一些场景中，渲染比较消耗性能，比如输入框。输入框的内容去调取后端服务，当用户连续输入的时候会不断地调取后端服务，其实很多的片段信息是无用的，这样会浪费服务资源， `React` 的响应式更新和 `JS` 单线程的特性也会导致其他渲染任务的卡顿。而 `useDeferredValue` 就是用来解决这个问题的。
::: tip
- 问：`useDeferredValue` 和 `useTransition` 怎么这么相似，两者有什么异同点？

- 答：`useDeferredValue` 和 `useTransition` 从本质上都是标记成了过渡更新任务，不同点在于 `useDeferredValue` 是将原值通过过渡任务得到新的值， 而 `useTransition` 是将紧急更新任务变为过渡任务。

也就是说 `useDeferredValue` 用来处理数据本身，`useTransition` 用来处理更新函数。
:::
基本使用：
~~~ts
const deferredValue = useDeferredValue(value);
~~~
- `value`：接受一个可变的值，如`useState`所创建的值。
- `deferredValue`：返回一个延迟状态的值。

基本用法：
~~~tsx
import { useState, useDeferredValue } from "react";
import { Input } from "antd";

const getList = (key: any) => {
  const arr = [];
  for (let i = 0; i < 10000; i++) {
    if (String(i).includes(key)) {
      arr.push(<li key={i}>{i}</li>);
    }
  }
  return arr;
};

const Index: React.FC<any> = () => {
  //订阅
  const [input, setInput] = useState("");
  const deferredValue = useDeferredValue(input);
  console.log("value：", input);
  console.log("deferredValue：", deferredValue);

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <Input value={input} onChange={(e: any) => setInput(e.target.value)} />
      <div>
        <ul>{deferredValue ? getList(deferredValue) : null}</ul>
      </div>
    </>
  );
};

export default Index;
~~~
上述的功能类似于搜索，从 `1w` 个数中找到输入框内的数。
::: tip
- 问：什么场景下使用 `useDeferredValue` 和 `useTransition` ？

- 答：通过上面的两个例子介绍我们知道，`useDeferredValue` 和 `useTransition` 实际上都是用来处理数据量大的数据，比如，百度输入框、散点图等，都可以使用。它们并不适用于少量数据。

但在这里更加推荐使用 `useTransition`，因为 `useTransition` 的性能要高于 `useDeferredValue`，除非像一些第三方的 `Hooks` 库，里面没有暴露出更新的函数，而是直接返回值，这种情况下才去考虑使用 `useDeferredValue`。

这两者可以说是一把双刃剑，在数据量大的时候使用会优化性能，而数据量低的时候反而会影响性能。
:::

### useInsertionEffect
与 `useEffect` 一样，但它在所有 `DOM` 突变之前同步触发。
::: tip
注意：
- `useInsertionEffect` 应限于 `css-in-js` 库作者使用。在实际的项目中优先考虑使用 `useEffect` 或 `useLayoutEffect` 来替代；
- 这个钩子是为了解决 `CSS-in-JS` 在渲染中注入样式的性能问题而出现的，所以在我们日常的开发中并不会用到这个钩子，但我们要知道如何去使用它。
:::
基本使用：
~~~ts
useInsertionEffect(callback,deps)
~~~
基本用法：
~~~tsx
import { useInsertionEffect } from "react";

const Index: React.FC<any> = () => {
  useInsertionEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .css-in-js{
        color: blue;
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div>
      <div className="css-in-js">大家好，我是小杜杜，一起玩转Hooks吧！</div>
    </div>
  );
};

export default Index;
~~~
在目前的版本中，`React` 官方共提供三种有关副作用的钩子，分别是 `useEffect`、`useLayoutEffect` 和 `useInsertionEffect`，我们一起来看看三者的执行顺序：
~~~ts
import { useEffect, useLayoutEffect, useInsertionEffect } from "react";

const Index: React.FC<any> = () => {
  useEffect(() => console.log("useEffect"), []);

  useLayoutEffect(() => console.log("useLayoutEffect"), []);

  useInsertionEffect(() => console.log("useInsertionEffect"), []);

  return <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>;
};

export default Index;
~~~
运行到浏览器，可知三者的执行的顺序为：`useInsertionEffect` > `useLayoutEffect` > `useEffect`。

### useId
是一个用于生成横跨服务端和客户端的稳定的唯一 ID ，用于解决服务端与客户端产生 ID 不一致的问题，更重要的是保证了 `React v18` 的 `streaming renderer` （流式渲染）中 `id` 的稳定性。

这里我们简单介绍一下什么是 `streaming renderer`:
- 在之前的 `React ssr` 中，`hydrate`（ 与 `render` 相同，但作用于 `ReactDOMServer` 渲染的容器中 ）是整个渲染的，也就是说，无论当前模块有多大，都会一次性渲染，无法局部渲染。但这样就会有一个问题，如果这个模块过于庞大，请求数据量大，耗费时间长，这种效果并不是我们想要看到的。

- 于是在 `React v18` 上诞生出了 `streaming renderer` （流式渲染），也就是将整个模块进行拆分，让加载快的小模块先进行渲染，大的模块挂起，再逐步加载出大模块，就可以就解决上面的问题。

- 此时就有可能出现：服务端和客户端注册组件的顺序不一致的问题，所以 `useId` 就是为了解决此问题而诞生的，这样就保证了 `streaming renderer` 中 `ID` 的稳定性。

基本使用：
~~~ts
const id = useId();
~~~
- id：生成一个服务端和客户端统一的id。

基本用法：
~~~tsx
import { useId } from "react";

const Index: React.FC<any> = () => {
  const id = useId();

  return <div id={id}>大家好，我是小杜杜，一起玩转Hooks吧！</div>;
};

export default Index;
~~~

## 自定义 Hooks：响应式的 useState
![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/8852dc3801e2450ba677706c9c2c17c7~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

`react-hooks` 是 `React16.8` 的产物，目的是增加代码的可复用性、逻辑性，并且解决函数式组件无状态的问题，这样既保留了函数式的简单，又解决了没有数据管理状态的缺陷。

而自定义 `Hooks` 是 `react-hooks` 基础上的一个扩展，它可以根据实际的业务场景、需求制定相应的 `Hooks`， 将对应的逻辑进行封装，从而具备逻辑性、复用性。

从本质而言，**Hooks 就是一个函数**，可以简单地认为 `Hooks` 是用来处理一些通用性数据、逻辑的。

::: tip
普通函数加入 `html（JSX 语法）`就是函数组件，但这个组件无状态，也就是没有数据管理状态，而 `Hooks` 的作用就是让函数组件具备数据管理的能力。如果说函数组件是一辆车，那么 `Hooks` 就是油，驱动这辆车跑起来的燃料。
:::
- Hooks 的驱动条件

所谓驱动条件，就是会改变数据源，从而驱动整个数据状态。通常用 useState、useReducer 为驱动条件，驱动整个自定义 Hooks。

- 通用模式

自定义 Hooks 的名称通常以 use 开头，我们设计为：
~~~ts
const [ xxx, ...] = useXxx(参数一，参数二, ...)
~~~

### useLatest
永远返回最新的值，可以避免闭包问题。

示例：
~~~ts
import { useState, useEffect } from "react";

export default () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("count:", count);
      setCount(count + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div>自定义Hooks：useLatestt</div>
      <div>count: {count}</div>
    </>
  );
};
~~~
打印出的 `count` 为 `0`，页面中的 `count` 为 `1`（具体原因我们在讲 `useEffect` 源码篇时提及，这里先看解决方法）

解决方法：

利用 `useRef` 的高级用法：缓存数据去解决，并且这种方式在`react-redux`源码中进行应用，而不止是获取元素属性。
~~~ts
import { useRef } from "react";

const useLatest = <T,>(value: T): { readonly current: T } => {
  const ref = useRef(value);
  ref.current = value;

  return ref;
};

export default useLatest;
~~~
::: tip
一起来看下这段代码 `<T,>(value: T): { readonly current: T }`。

从作用来看，这个钩子返回的永远是最新值，也就是说，这个钩子的入参与出参都是这个值，但这个值我们却不知道是 `string`、`number` 还是其他类型的值，这时，我们就希望它传入的值与返回的值是同种类型。

简单来说，无论传入什么类型，都要返回对应的类型，这种情况必是泛型。

`:{readonly current: T}` 代表返回结果的类型，由于我们使用的为 `useRef` ，所以，返回的值都在 `current` 内，那么 `current` 的类型就是 `T`。

至于 `readonly` 则是代表的只读不可修改，因为固定模式为 `current` 对象，所以这里使用 `readonly` 。
:::

### useMount 和 useUnmount
- `useMount`：只在组件初始化执行的 `hook`。
- `useUnmount`：只在组件卸载时的 `hook`。

两者都是根据 `useEffect` 演化而来，而 `useUnmount` 需要注意一下，这里传入的函数需要保持最新值，直接使用 `useLatest` 即可：
~~~ts
// useMount
import { useEffect } from "react";

const useMount = (fn: () => void) => {
  useEffect(() => {
    fn?.();
  }, []);
};

export default useMount;

// useUnmount
import { useEffect } from "react";
import useLatest from "../useLatest";

const useUnmount = (fn: () => void) => {
  const fnRef = useLatest(fn);

  useEffect(
    () => () => {
      fnRef.current();
    },
    []
  );
};

export default useUnmount;
~~~
示例：
~~~tsx
import { useState } from "react";
import { useMount, useUnmount } from "../../hooks";

import { Button, message } from "antd";

const Child = () => {
  useMount(() => {
    message.info("首次渲染");
  });

  useUnmount(() => {
    message.info("组件已卸载");
  });

  return <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>;
};

const Index = () => {
  const [flag, setFlag] = useState<boolean>(false);

  return (
    <div>
      <Button type="primary" onClick={() => setFlag((v) => !v)}>
        切换 {flag ? "unmount" : "mount"}
      </Button>
      {flag && <Child />}
    </div>
  );
};

export default Index;
~~~

### useUnmountedRef
获取当前组件是否卸载，这个钩子的思路也很简单，只需要利用 `useEffect` 的状态，来保存对应的值就 ok 了。
~~~ts
import { useEffect, useRef } from "react";

const useUnmountedRef = (): { readonly current: boolean } => {
  const unmountedRef = useRef<boolean>(false);

  useEffect(() => {
    unmountedRef.current = false;
    return () => {
      unmountedRef.current = true;
    };
  }, []);

  return unmountedRef;
};

export default useUnmountedRef;
~~~
示例：
~~~tsx
import { useState } from "react";
import { useUnmountedRef, useUnmount, useMount } from "../../hooks";
import { Button } from "antd";

const Child = () => {
  const unmountedRef = useUnmountedRef();

  useMount(() => {
    console.log("初始化：", unmountedRef);
  });
  useUnmount(() => {
    console.log("卸载：", unmountedRef);
  });

  return <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>;
};

const Index = () => {
  const [flag, setFlag] = useState<boolean>(false);

  return (
    <div>
      <Button type="primary" onClick={() => setFlag((v) => !v)}>
        切换 {flag ? "卸载" : "初始化"}
      </Button>
      {flag && <Child />}
    </div>
  );
};

export default Index;
~~~

### useSafeState
使用方法与 `useState` 的用法完全一致，但在组件卸载后异步回调内的 `setState` 不再执行，这样可以避免因组件卸载后更新状态而导致的内存泄漏。

这里要注意的是卸载后的异步条件，所以直接使用 `useUnmountedRef` 即可，代码如下：
~~~ts
import { useCallback, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import useUnmountedRef from "../useUnmountedRef";

function useSafeState<S>(
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>];
function useSafeState<S = undefined>(): [
  S | undefined,
  Dispatch<SetStateAction<S | undefined>>
];
function useSafeState<S>(initialState?: S | (() => S)) {
  const unmountedRef: { current: boolean } = useUnmountedRef();
  const [state, setState] = useState(initialState);
  const setCurrentState = useCallback((currentState: any) => {
    if (unmountedRef.current) return;
    setState(currentState);
  }, []);

  return [state, setCurrentState] as const;
}

export default useSafeState;
~~~
- 首先，这个钩子和 `useState` 的用法完全一致，所以我们的入参和出参保持一致。这里使用泛型与 `useLatest` 的原因一样；
- 入参：`initialState`，这个参数并不是一定必需的，所以存在两种情况，一种是 S（传入什么就是什么类型）、另一种是 `undefined`，其中 S 还分为是否为函数。所以标准的写法是函数重载，简单理解为：可以在同一个函数下定义多种类型值，最后汇总到一块；
- 返参：`[state, setCurrentState] as const`，这种写法叫做断言，所谓断言，通过 `as` 这个参数告诉编辑器，就是这种类型，不用你再次校验。是不是很任性，像极了你的女朋友，而 `as const` 是标记为不可变，即这个数组的长度与成员类型均不可再进行修改，可翻译为 `readonly [S, Dispatch<SetStateAction<S>>]`，这样可能更加好理解一点；
- 至于 `Dispatch<SetStateAction<S>>` 这种写法是固定的，就是对应 `useState` 的第二个参数。

::: tip
除此之外，这里还用到了 `useCallback`。在之前的介绍中，我说要配合使用 `React.Memo`，那么这里为什么要用呢？

其实这里要特意说明下，如果是在开发自定义 `Hooks` 的时候，可直接使用 `useCallback`，而在具体的业务场景中，`useCallback` 需要配合 `React.Memo` 使用，具体为何，在之后介绍 `useCallBack` 源码篇中进行说明，现在只需要记住即可。
:::

### useUpdate
强制组件重新渲染，最终返回一个函数。

这就回到开头所说的问题，是什么驱动函数式的更新：用 `useState`、`useReducer` 作为更新条件，这里以 `useReducer` 做演示，毕竟大家对 `useState` 都很熟悉。

具体的做法是：搞个累加器，无关的变量，触发一次，就累加 `1`，这样就会强制刷新。
~~~ts
import { useReducer } from "react";

function useUpdate(): () => void {
  const [, update] = useReducer((num: number): number => num + 1, 0);

  return update;
}

export default useUpdate;
~~~
测试：
~~~tsx
import { useUpdate } from "../../hooks";
import { Button, message } from "antd";

const Index = () => {
  const update = useUpdate();

  return (
    <div>
      <div>时间：{Date.now()}</div>
      <Button
        type="primary"
        onClick={() => {
          update();
        }}
      >
        更新
      </Button>
    </div>
  );
};

export default Index;
~~~

### useCreation
强化 `useMemo` 和 `useRef`，用法与 `useMemo` 一样，一般用于性能优化。

useCreation 如何增强：
- `useMemo` 的第一个参数 `fn`，会缓存对应的值，那么这个值就有可能拿不到最新的值，而 `useCreation` 拿到的值永远都是最新值；
- `useRef` 在创建复杂常量的时候，会出现潜在的性能隐患（如：实例化 `new Subject`），但 `useCreation` 可以有效地避免。

来简单分析一下如何实现 `useCreation`:
- 明确出参入参：`useCreation` 主要强化的是 `useMemo`，所以出入参应该保持一致。出参返回对应的值，入参共有两个，第一个对应函数，第二个对应数组（此数组可变触发）；
- 最新值处理：针对 `useMemo` 可能拿不到最新值的情况，可直接依赖 `useRef` 的高级用法来保存值，这样就会永远保存最新值；
- 触发更新条件：比较每次传入的数组，与之前对比，若不同，则触发、更新对应的函数。

~~~ts
import { useRef } from "react";
import type { DependencyList } from "react";

const depsAreSame = (
  oldDeps: DependencyList,
  deps: DependencyList
): boolean => {
  if (oldDeps === deps) return true;

  for (let i = 0; i < oldDeps.length; i++) {
    if (!Object.is(oldDeps[i], deps[i])) return false;
  }

  return true;
};

const useCreation = <T,>(fn: () => T, deps: DependencyList) => {
  const { current } = useRef({
    deps,
    obj: undefined as undefined | T,
    initialized: false,
  });

  if (current.initialized === false || !depsAreSame(current.deps, deps)) {
    current.deps = deps;
    current.obj = fn();
    current.initialized = true;
  }

  return current.obj as T;
};

export default useCreation;
~~~
分析 useRef：

`useRef` 的保存值应该有哪些？其中 `deps` 和 `obj` 不必多说，一个是数组，一个是数据，是必须要保存的，除此之外，还需要保存 `initialized`（初始化条件），这个参数的作用是应对首次保存值，之后判断是否保存，根据 `deps` 判断即可。

测试：
~~~tsx
import React, { useState } from "react";
import { Button } from "antd";
import { useCreation } from "../../hooks";

const Index: React.FC<any> = () => {
  const [flag, setFlag] = useState<boolean>(false);

  const getNowData = () => {
    return Math.random();
  };

  const nowData = useCreation(() => getNowData(), []);

  return (
    <>
      <div>正常的函数： {getNowData()}</div>
      <div>useCreation包裹后的： {nowData}</div>
      <Button
        type="primary"
        onClick={() => {
          setFlag((v) => !v);
        }}
      >
        切换状态{JSON.stringify(flag)}
      </Button>
    </>
  );
};

export default Index;
~~~
在浏览器中运行可以看到，当无关的变量刷新时，会影响 `getNowData` 产生的随机值，但不会影响经过 `useCreation` 包裹后的值，从而增强渲染时的性能问题。

### useReactive
一种具备响应式的 `useState`，用法与 `useState` 类似，但可以动态地设置值。

背景：当我们开发组件或做功能复杂的页面时，会有大量的变量，再来看看 `useState` 的结构`const [count, setCount] = useState<number>(0)`，假设要设置 10 个变量，那么我们是不是要设置 10 个这样的结构？`useReactive` 可以帮我们解决这个问题。

**useReactive 如何设计：**
- `useReactive` 的入参、出参怎么设定？
- 如何制作成响应式数据？
- 如何使用 `Ts` 类型？如何优化 `useReactive` ？

useReactive 整体结构：`const state = useReactive({ count: 0 })` 。
- 使用：`state.count`；
- 设置：`state.count = 7`。

**数据制作成响应式，实际上分两个步骤:**
- 如何检测值的改变，就是当 `state.count = 7` 设置后，怎样让 `state.count` 成为 `7` ？
- 如何刷新视图，让页面看到效果？

刷新视图用上述的 `useUpdate` 即可，而监测数据、改变数据可以使用 `ES6` 提供的 `Proxy` 和 `Reflect` 来处理。

`Proxy` 用于修改某些操作的默认行为，等同于在语言层面做出修改，所以属于一种“元编程”（`meta programming`），即对编程语言进行编程。可以这样理解，`Proxy` 就是在目标对象之前设置的一层拦截，外界想要访问都要经过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

而 `Reflect` 与 `Proxy` 的功能类似，但只能保持 `Object` 的默认行为。

至于优化，直接用 `useCreation` 即可，配合 `useLatest` 来处理存放 `initialState`（初始值），用来确保值永远是最新值。
~~~ts
import { useUpdate, useCreation, useLatest } from "../index";

const observer = <T extends Record<string, any>>(
  initialVal: T,
  cb: () => void
): T => {
  const proxy = new Proxy<T>(initialVal, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      return typeof res === "object"
        ? observer(res, cb)
        : Reflect.get(target, key);
    },
    set(target, key, val) {
      const ret = Reflect.set(target, key, val);
      cb();
      return ret;
    },
  });

  return proxy;
};

const useReactive = <T extends Record<string, any>>(initialState: T): T => {
  const ref = useLatest<T>(initialState);
  const update = useUpdate();

  const state = useCreation(() => {
    return observer(ref.current, () => {
      update();
    });
  }, []);

  return state;
};

export default useReactive;
~~~
**Record 的语法介绍：** `Record<K extends keyof any, T>`。

**作用：** 将 `K` 中所有的属性转化为 `T` 类型。

**举个例子：**
~~~ts
interface Props {
    name: string,
    age: number
}

type InfoProps = 'JS' | 'TS'

const Info: Record<InfoProps, Props> = {
    JS: {
        name: '小杜杜',
        age: 7
    },
    TS: {
        name: 'TypeScript',
        age: 11
    }
}
~~~
也就是说，`InfoProps` 的每一项属性都包含 `Props` 的属性。
::: tip
- 问：为什么 `Proxy` 和 `Reflect` 联合使用？单独使用 `Proxy` 不行吗？

- 答：`ES6` 中的 `Proxy` 和 `Reflect` 在平常的开发中可能运用的比较少，很多小伙伴可能并不了解，`Proxy` 和 `Reflect` 一般是对数据的劫持，有点类似于 `ES5` 中的 `Object.defineProperty()`，但功能要更加强大。

两者联合使用的根本原因是：`this` 的指向，至于具体为什么，这里就不做过多的介绍，但要强调一点，`Proxy` 和 `Reflect` 的作用非常大，在 `Vue/corejs` 的源码中有大量的应用，掌握这两个 API 非常有必要。
:::
验证：
~~~tsx
import { useReactive } from "../../hooks";
import { Button, Input } from "antd";

const Index = () => {
  const state = useReactive<any>({
    count: 0,
    name: "大家好，我是小杜杜，一起玩转Hooks吧！",
    flag: true,
    arr: [],
    bugs: ["小杜杜", "react", "hook"],
    addBug(bug: string) {
      this.bugs.push(bug);
    },
    get bugsCount() {
      return this.bugs.length;
    },
  });

  return (
    <div>
      <div style={{ fontWeight: "bold" }}>基本使用：</div>
      <div style={{ marginTop: 8 }}> 对数字进行操作：{state.count}</div>
      <div
        style={{
          margin: "8px 0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button type="primary" onClick={() => state.count++}>
          加1
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => state.count--}
        >
          减1
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => (state.count = 7)}
        >
          设置为7
        </Button>
      </div>
      <div style={{ marginTop: 8 }}> 对字符串进行操作：{state.name}</div>
      <div
        style={{
          margin: "8px 0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button type="primary" onClick={() => (state.name = "小杜杜")}>
          设置为小杜杜
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => (state.name = "Domesy")}
        >
          设置为Domesy
        </Button>
      </div>
      <div style={{ marginTop: 8 }}>
        {" "}
        对布尔值进行操作：{JSON.stringify(state.flag)}
      </div>
      <div
        style={{
          margin: "8px 0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button type="primary" onClick={() => (state.flag = !state.flag)}>
          切换状态
        </Button>
      </div>
      <div style={{ marginTop: 8 }}>
        {" "}
        对数组进行操作：{JSON.stringify(state.arr)}
      </div>
      <div
        style={{
          margin: "8px 0",
          display: "flex",
          justifyContent: "flex-start",
        }}
      >
        <Button
          type="primary"
          onClick={() => state.arr.push(Math.floor(Math.random() * 100))}
        >
          push
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => state.arr.pop()}
        >
          pop
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => state.arr.shift()}
        >
          shift
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => state.arr.unshift(Math.floor(Math.random() * 100))}
        >
          unshift
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => state.arr.reverse()}
        >
          reverse
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => state.arr.sort()}
        >
          sort
        </Button>
      </div>
      <div style={{ fontWeight: "bold", marginTop: 8 }}>计算属性：</div>
      <div style={{ marginTop: 8 }}>数量：{state.bugsCount} 个</div>
      <div style={{ margin: "8px 0" }}>
        <form
          onSubmit={(e) => {
            state.bug ? state.addBug(state.bug) : state.addBug("domesy");
            state.bug = "";
            e.preventDefault();
          }}
        >
          <Input
            type="text"
            value={state.bug}
            style={{ width: 200 }}
            onChange={(e) => (state.bug = e.target.value)}
          />
          <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
            增加
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => state.bugs.pop()}>
            删除
          </Button>
        </form>
      </div>
      <ul>
        {state.bugs.map((bug: any, index: number) => (
          <li key={index}>{bug}</li>
        ))}
      </ul>
    </div>
  );
};

export default Index;
~~~

## 常用自定义 Hooks 开发
![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/7241b847b14b4c7d81f234488752e8b0~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### useDebounceFn
用来处理防抖函数的 `Hooks`。

**确定出入参:**
- 入参: 分别是：**func（防抖函数）、wait（超时时间/s）、leading（是否延迟开始前调用的函数）、trailing（是否在延迟开始后调用函数）、maxWait（最大等待时间）**。其中，**func（防抖函数）** 是最主要的，所以把它单独拆开，其他的放在一起。
- 出参：触发防抖的函数，官方提供的 `cancel`（取消延迟）和 `flush`（立即调用），这里只返回了触发防抖的函数即可。

**优化方案：** 使用 `useLatest` 处理对应的 `func`，保持函数最新值，利用 `useCreation` 优化整个 `debounce` 即可，另外，需要 `useUnmount` 在卸载的时候调用 `cancel` 方法卸载组件。

**代码展示：**
~~~ts
import { useLatest, useUnmount, useCreation } from "..";
import debounce from "lodash/debounce";

type noop = (...args: any[]) => any;

interface DebounceOptions {
  wait?: number;
  leading?: boolean;
  trailing?: boolean;
  maxWait?: number;
}

const useDebounceFn = <T extends noop>(fn: T, options?: DebounceOptions) => {
  const fnRef = useLatest(fn);

  const debounced = useCreation(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => fnRef.current(...args),
        options?.wait ?? 1000,
        options
      ),
    []
  );

  useUnmount(() => {
    debounced.cancel();
  });

  return debounced;
};

export default useDebounceFn;
~~~
::: tip
- 问：在 `debounce` 中使用 `options?.wait ?? 1000` 中的 ”??“ 是什么？

- 答：?? 是 ES11 的新语法：**空值合并运算符**，只会在左边的值严格等于 `null` 或 `undefined` 时起作用，一起来看看与 || 的区别：
  ~~~ts
  const a = 0
  const b = a || 7 //b = 7
  const c = a ?? 7 // c = 0
  ~~~
也就是说 ?? 可以处理值为 0 的情况，在这里我们如果用 || ，没有办法处理 wait 为 0 的情况，但实际上这种情况是存在，所以使用 ??。
:::

**使用方式：**
~~~ts
const run = useDebounceFn(
  fn:(...args: any[]) => any,
  options?: Options
);
~~~

### useDebounce
用来处理防抖值的 `Hooks`，既然学了处理函数的防抖，那么处理值的防抖就简单多了，我们只需要利用 `useDebounceFn` 即可。

**代码展示：**
~~~ts
import { useDebounceFn, useSafeState, useCreation } from "..";

import type { DebounceOptions } from "../useDebounceFn";

const useDebounce = <T,>(value: T, options?: DebounceOptions) => {
  const [debounced, setDebounced] = useSafeState(value);

  const run = useDebounceFn(() => {
    setDebounced(value);
  }, options);

  useCreation(() => {
    run();
  }, [value]);

  return debounced;
};

export default useDebounce;
~~~
**使用方式：**
~~~ts
const debouncedValue = useDebounce(
  value: any,
  options?: Options
);
~~~

### useThrottleFn 和 useThrottle
useThrottleFn：用来处理节流函数的 `Hooks`。

useThrottle：用来处理节流值的 `Hooks`。

节流与防抖基本一致，只不过缺少 `maxWait`（最大等待时间）字段，其余的都一样。

### useLockFn
竞态锁，防止异步函数并发执行。

我们在表单中或者各种按钮中，都需要与后端进行交互，这个钩子的作用是防止用户重复点击，重复调取接口（特别是订单的提交），所以这个钩子适用场景非常多，也很重要。

**确定出入参**：入参应该是执行函数的效果，出参则是何时执行的函数。

既然 `useLockFn` 是防止异步函数并发执行，那么我们所接受的 `fn` 必然返回 `Promise` 形式，同时，接口也会有各种各样的情况，必须通过 `try catch` 包一层。

那么我们只需要一个状态来判定是否执行对应的函数即可，由于处理的是函数，直接使用 `useCallback` 包裹即可。

**代码展示：**
~~~ts
import { useRef, useCallback } from "react";

const useLockFn = <P extends any[] = any[], V extends any = any>(
  fn: (...args: P) => Promise<V>
) => {
  const lockRef = useRef(false);

  return useCallback(
    async (...args: P) => {
      if (lockRef.current) return;
      lockRef.current = true;
      try {
        const ret = await fn(...args);
        lockRef.current = false;
        return ret;
      } catch (e) {
        lockRef.current = false;
        throw e;
      }
    },
    [fn]
  );
};

export default useLockFn;
~~~
**使用方式：**
~~~ts
const run = useLockFn<P extends any[] = any[], V extends any = any>(
   fn: (...args: P) => Promise<V>
): (...args: P) => Promise<V | undefined>
~~~

### useFullscreen
设置 DOM 元素是否全屏。

**确定出入参：**
- 入参：`target`（目标 `DOM` 元素），其次是进入全屏所触发的方法和退出全屏的方法。
- 出参：当前是否全屏的状态（ `isFullscreen` ），进入（ `enterFullscreen` ）/ 退出（ `exitFullscreen` ）触发的函数，以及是否可全屏的状态（ `isEnabled` ）即可。

优化手段使用：`useLatest` 和 `useCallback` 即可。

**getTarget：**获取 `DOM` 目标。在 `React` 中，除了使用 `document.getElementById` 等，还可以通过 `useRef` 获取节点信息，所以我们做个兼容：
~~~ts
import type BasicTarget from "./BasicTarget";
type TargetType = HTMLElement | Element | Window | Document;

const getTarget = <T extends TargetType>(target: BasicTarget<T>) => {
  let targetElement: any;

  if (!target) {
    targetElement = window;
  } else if ("current" in target) {
    targetElement = target.current;
  } else {
    targetElement = target;
  }

  return targetElement;
};
export default getTarget;
~~~
**代码展示：**
~~~ts
import screenfull from "screenfull";
import { useLatest, useSafeState } from "..";
import { getTarget } from "../utils";
import type { BasicTarget } from "../utils";
import { useCallback } from "react";

interface Options {
  onEnter?: () => void;
  onExit?: () => void;
}

const useFullscreen = (target: BasicTarget, options?: Options) => {
  const { onEnter, onExit } = options || {};

  const [isFullscreen, setIsFullscreen] = useSafeState(false);

  const onExitRef = useLatest(onExit);
  const onEnterRef = useLatest(onEnter);

  const onChange = () => {
    if (screenfull.isEnabled) {
      const ele = getTarget(target);
      if (!screenfull.element) {
        onExitRef.current?.();
        setIsFullscreen(false);
        screenfull.off("change", onChange);
      } else {
        const isFullscreen = screenfull.element === ele;
        if (isFullscreen) {
          onEnterRef.current?.();
        } else {
          onExitRef.current?.();
        }
        setIsFullscreen(isFullscreen);
      }
    }
  };

  const enterFullscreen = useCallback(() => {
    const ele = getTarget(target);
    if (!ele) return;
    if (screenfull.isEnabled) {
      screenfull.request(ele);
      screenfull.on("change", onChange);
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    const ele = getTarget(target);
    if (screenfull.isEnabled && screenfull.element === ele) {
      screenfull.exit();
    }
  }, []);

  return {
    isFullscreen,
    isEnabled: screenfull.isEnabled,
    enterFullscreen,
    exitFullscreen,
  };
};

export default useFullscreen;
~~~
::: tip
注：这里要注意一点，有些浏览器在点击全屏后，背景会是黑色，而非白色，这是因为浏览器默认全屏没有背景色，所以是黑色，所以此时需要在整个项目下设置颜色，如：

`*:-webkit-full-screen { background: #fff; }`
:::
**使用方式：**
~~~ts
const { 
  isFullscreen,
  isEnabled,
  enterFullscreen,
  exitFullscreen } = useFullscreen(target, {
    onEnter?: () => void,
    onExit?: () => void
});
~~~

### useCopy
用于复制信息，在平常的开发中，为了用户操作方便，会设置复制按钮，将复制好的数据自动回传到选项的值，或是粘贴板，此时这个钩子就派上了用场。

使用：[copy-to-clipboard](https://github.com/sudodoki/copy-to-clipboard) 库。

**确定出入参：**很明显，这个钩子并不需要入参，出参是复制后的文字，以及触发复制的方法。

**代码展示：**
~~~ts
import writeText from "copy-to-clipboard";
import { useSafeState } from "..";
import { useCallback } from "react";

type copyTextProps = string | undefined;
type CopyFn = (text: string) => void; // Return success

const useCopy = (): [copyTextProps, CopyFn] => {
  const [copyText, setCopyText] = useSafeState<copyTextProps>(undefined);

  const copy = useCallback((value?: string | number) => {
    if (!value) return setCopyText("");
    try {
      writeText(value.toString());
      setCopyText(value.toString());
    } catch (err) {
      setCopyText("");
    }
  }, []);

  return [copyText, copy];
};

export default useCopy;
~~~
**使用方式：**
~~~ts
const [copyText, copy] = useCopy();
~~~

### useTextSelection
实时获取用户当前选取的文本内容及位置。当我们要实时获取用户所选择的文字、位置等，这个钩子会有很好的效果。

**确定出入参：**
- **入参**： 选取文本的范围，可以是指定节点下的文字，当没有指定的节点，应该监听全局的，也就是 `document`。
- **出参**： 首先是选取的文字，以及文字距离屏幕的间距，除此之外，还有文字本身的宽度和高度。这里推荐使用 `window.getSelection()` 方法。

`getSelection()`：表示用户选择的文本范围或光标的当前位置。

如果有值的话，`getSelection()` 返回的值进行 `toString()` 则是选取的值，否则为空。

然后使用 `selection.getRangeAt(index)` 来获取 `Range` 对象，主要包含选取文本的开始索引（`startOffset`）和结束索引（`endOffset`）。

最后通过 `Range` 的 `getBoundingClientRect()` 方法获取对应的宽、高、屏幕的距离等信息。

至于监听事件，我们可以利用 `useEventListener` 去监听对应的鼠标事件：`mousedown`（鼠标按下）、`mouseup`（鼠标松开）去完成。

**代码展示：**
~~~ts
import useEventListener from "../useEventListener";
import useSafeState from "../useSafeState";
import useLatest from "../useLatest";
import type { BasicTarget } from "../utils";

interface RectProps {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}

interface StateProps extends RectProps {
  text: string;
}

const initRect: RectProps = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN,
};

const initState: StateProps = {
  text: "",
  ...initRect,
};

const getRectSelection = (selection: Selection | null): RectProps | {} => {
  const range = selection?.getRangeAt(0);
  if (range) {
    const { height, width, top, left, right, bottom } =
      range.getBoundingClientRect();
    return { height, width, top, left, right, bottom };
  }
  return {};
};

const useTextSelection = (
  target: BasicTarget | Document = document
): StateProps => {
  const [state, setState] = useSafeState(initState);
  const lastRef = useLatest(state);

  useEventListener(
    "mouseup",
    () => {
      if (!window.getSelection) return;
      const select = window.getSelection();
      const text = select?.toString() || "";
      if (text) setState({ ...state, text, ...getRectSelection(select) });
    },
    target
  );

  useEventListener(
    "mousedown",
    () => {
      if (!window.getSelection) return;
      if (lastRef.current.text) setState({ ...initState });
      const select = window.getSelection();
      select?.removeAllRanges();
    },
    target
  );

  return state;
};

export default useTextSelection;
~~~
**使用方式：**
~~~ts
const state = useTextSelection(target?)
~~~
::: tip
除此之外，`useTextSelection` 可配合 `Popover` 做划词翻译的效果。
:::

### useResponsive
获取响应式信息，当屏幕尺寸发生改变时，返回的尺寸信息不同，换言之，useResponsive 可以获取浏览器窗口的响应式信息。

**确定出入参：**
- 入参： 设定屏幕的尺寸范围，这里我们使用栅格布局（bootstrap）的范围，如：
  - xs：0px，最小尺寸；
  - sm：576px，设备：平板；
  - md：768px，设备：桌面显示屏；
  - lg：992px，设备：大桌面显示器；
  - xl：1200px 超大屏幕显示器
- 出参： 尺寸范围是否符合条件，如果符合则为 true，否则为 false。

但这里要注意下，我们默认的入参是栅格的范围，但在真实情况下，入参是允许改变，而出参根据入参的范围而来，所以我们并不知道 `useResponsive` 具体参数，但可以确定出入参的类型，所以我们需要 `Record` 的帮助。如：
~~~ts
// 入参
type ResponsiveConfig = Record<string, number>;

// 出参
type ResponsiveInfo = Record<string, boolean>;
~~~
解决了 `ts` 问题后，再来看看另一个问题，对于整个系统而言，所有的布局应该相同，如果把入参放入 `useResponsive` 中，那么每次调用 `useResponsive` 都要进行配置，那样会很麻烦，所以我们把入参提取出来，再额外封装个方法，用来设置 `responsiveConfig`。

最后，我们用 `useEventListener` 来监听尺寸即可。

**代码展示：**
~~~ts
import useSafeState from "../useSafeState";
import useEventListener from "../useEventListener";
import isBrowser from "../utils/isBrowser";

type ResponsiveConfig = Record<string, number>;
type ResponsiveInfo = Record<string, boolean>;

// bootstrap 对应的四种尺寸
let responsiveConfig: ResponsiveConfig = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
};

let info: ResponsiveInfo = {};

export const configResponsive = (config: ResponsiveConfig) => {
  responsiveConfig = config;
};

const clac = () => {
  const width = window.innerWidth;
  const newInfo = {} as ResponsiveInfo;
  let shouldUpdate = false;
  for (const key of Object.keys(responsiveConfig)) {
    newInfo[key] = width >= responsiveConfig[key];
    // 如果发生改变，则出发更新
    if (newInfo[key] !== info[key]) {
      shouldUpdate = true;
    }
  }
  if (shouldUpdate) {
    info = newInfo;
  }
  return {
    shouldUpdate,
    info,
  };
};

const useResponsive = () => {
  if (isBrowser) {
    clac();
  }

  const [state, setState] = useSafeState<ResponsiveInfo>(() => clac().info);

  useEventListener("resize", () => {
    const res = clac();
    if (res.shouldUpdate) setState(res.info);
  });

  return state;
};

export default useResponsive;
~~~
在这里我们简单做了个处理，用 `shouldUpdate` 来判断是否更新 `info`，如果 `newInfo` 和 `info` 不等，则证明需要更新视图，防止视图不断刷新。

**使用方式：**
~~~ts
// 配置
configResponsive({
  small: 0,
  middle: 800,
  large: 1200,
});

// 使用
const responsive = useResponsive();
~~~

### useTrackedEffect
可监听 `useEffect` 中的 `deps` 中的那个发生变化，用法与 `useEffect` 基本一致。

我们都知道， `useEffect` 可以监听 `deps` 的变化，而触发对应的函数，但如果变量值存在多个值时， `useEffect` 并无法监听是哪个 `deps` 发生了改变。
::: info
如：`useEffect` 同时监听了 A 和 B，我们想要的效果是 A 改变触发对应的函数，B 改变触发对应的函数，A 和 B 共同触发一个函数，针对这种情况，使用 `useEffect` 就会变得很麻烦，而 `useTrackedEffect` 可以完美地解决这个问题，并且还会记录上次的值，方便我们更好地操作。
:::
**确定出入参：**`useTrackedEffect` 的结构应该与 `useEffect` 的结构保持一致，所以并不存在出参，只需要涉及入参即可。

**入参参数：**
1. `effect`：对应 `useEffect` 的第一个参数，执行函数；
2. `deps`：对应 `useEffect` 的第二个参数，发生改变的函数依赖；
3. `type_list`：增加第三个参数，对应 `deps` 的名称，注意，要和 `deps` 一一对应，否则结果会有所差异。

确定完入参，那么 `useTrackedEffect` 中的第一个参数 `effect` 应该返回哪些信息呢，一起来看看：
- `changes`：改变对应 `deps` 的索引，通过索引去判断哪个 `deps` 发生改变；
- `previousDeps`：上一次改变的 `deps` 值；
- `currentDeps`：改变后的 `deps` 值；
- `type_changes`：改变对应 `deps` 的索引，不过对应于中文，而非索引。

除此之外，我们需要记录上一次的值，需要利用 useRef 的特性来帮助我们完成。

**代码展示：**
~~~ts
import type { DependencyList } from "react";
import { useEffect, useRef } from "react";

type Effect = (
  changes?: number[], // 改变的 deps 参数
  previousDeps?: DependencyList, // 上一次的 deps 集合
  currentDeps?: DependencyList, // 本次最新的 deps 集合
  type_changes?: string[] // 返回匹配的字段名
) => void | (() => void);

// 判断改变的effect
const onChangeEffect = (deps1?: DependencyList, deps2?: DependencyList) => {
  if (deps1) {
    return deps1
      .map((_, index) =>
        !Object.is(deps1[index], deps2?.[index]) ? index : -1
      )
      .filter((v) => v !== -1);
  } else if (deps2) {
    return deps2.map((_, index) => index);
  } else return [];
};

const useTrackedEffect = (
  effect: Effect,
  deps?: DependencyList,
  type_list?: string[]
) => {
  const previousDepsRef = useRef<DependencyList>();

  useEffect(() => {
    const changes = onChangeEffect(previousDepsRef.current, deps);
    const previousDeps = previousDepsRef.current;
    previousDepsRef.current = deps;
    const type_changes = (type_list || []).filter((_, index) =>
      changes.includes(index)
    );
    return effect(changes, previousDeps, deps, type_changes);
  }, deps);
};

export default useTrackedEffect;
~~~
这里有个关键点是：`onChangeEffect` 函数，用来判断哪一个 `deps` 发生改变，`deps1` 为旧的 `deps`， `deps2` 为新的 `deps`，但要注意，`deps1` 和 `deps2` 应该一一对应，总共分为三种情况。
1. `dep1` 不存在：第一次，改变的应该是 `deps2`，所以改动点为 `deps2` 的索引；
2. `dep1` 存在：说明存在旧值，然后依次比较 `dep1` 和 `deps2` 的值，如果不想等，则更新最新值的索引，想等的话，则返回 -1， 之后再整体过滤一遍不等于 -1 的值，所得到的就是更新的索引；
3. 特别要注意，`useEffect` 存在为空数组的情况，说明 `dep1` 、`dep2` 都不存在。

**使用方式：**
~~~ts
useTrackedEffect(
  effect: (changes: [], previousDeps: [], currentDeps: [], type_changes: [) => (void | (() => void | undefined)),
  deps?: deps,
  type_list?: string[]
)
~~~

## 搞懂 Fiber 和并发
我们需要了解两个核心概念：Fiber 和并发。 因为学习源码必然绕不开这两大核心概念，了解它们，对我们之后学习源码有着莫大的好处。

### 知悉 Fiber


































