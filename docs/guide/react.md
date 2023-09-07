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
在一个庞大的项目中，如果有某个节点发生变化，就会给 `diff` 带来巨大的压力，此时想要找到真正变化的部分就会耗费大量的时间，也就是说此时，`js` 会占据主线程去做对比，导致无法正常的页面渲染，此时就会发生页面卡顿、页面响应变差、动画、手势等应用效果差。

为了解决这一问题，`React` 团队花费两年时间，重写了 `React` 的核心算法`reconciliation`，在 `React v16` 中发布，为了区分 `reconciler`（调和器），将之前的 `reconciler` 称为 `stack reconciler`，之后称作 `fiber reconciler`（简称：`Fiber`）。

简而言之，`Fiber` 实际上是一种核心算法，为了解决**中断和树庞大**的问题，也可以认为 `Fiber` 就是 `v16` 之后的虚拟 `DOM`。

为了之后更好的理解，我们先来看看 `element`、`fiber`、`DOM` 元素三者的关系：
- `element` 对象就是我们的 `jsx` 代码，上面保存了 `props`、`key`、`children` 等信息；
- `DOM` 元素就是最终呈现给用户展示的效果；
- 而 `fiber` 就是充当 `element` 和 `DOM` 元素的桥梁，简单来说，**只要 element 发生改变，就会通过 fiber 做一次调和，使对应的 DOM 元素发生改变。**

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/9db027b6d5d74dd8ab9e9c569a44d282~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### 虚拟 DOM 如何转化为 Fiber
万物始于 `jsx`，那么我们就从 `jsx` 入手，从而了解 `Fiber`。

先看看最常见的一段 `jsx` 代码：
~~~ts
const Index = () => {
  return <div>大家好，我是小杜杜，一起玩转hooks吧！</div>;
}
~~~
然后到达绑定的结构：
~~~ts
import ReactDOM from 'react-dom/client';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);
~~~
::: tip
注：`React v18` 将原先的 `render` 替换为 `createRoot`，也就是将原先的 `legacy` 模式转化为 `concurrent` 模式。
:::
**ReactDOM.createRoot 结构：**

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3da042995c8c4c52b3c997c7f13871f4~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

实际上，依旧走的是之前的 `render` 方法。
::: tip
- 问：既然都走的 `render` 方法，那么 `React` 为什么要替换为 `createRoot` 呢？

- 答：最大的改变点是模式的转化，原先的 `legacy` 模式是同步的，而转化后的 `concurrent` 模式是异步的。可以说在 `React v18` 的版本中兼容了**同步渲染**和**异步渲染**。

其次是对服务端的改变，在新版本中，替换了原有的 `hydrate API`，做成了配置项，而非原有的 `ReactDOM.hydrate`
:::
### beginWork 方法
当普通的 `JSX` 代码被 `babel` 编译成 `React.createElement` 的形式后，最终会走到 `beginWork` 这个方法中。

这个方法可以说是 `React` 整个流程的开始，要特别注意这个方法。`beginWork` 中有个 `tag`，而这个 `tag` 的类型就是判断 `element` 对应的 `fiber`，如：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/20045ea700984698aa3a96428b70a8f2~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

**beginWork 的入参：**
- **current**：在视图层渲染的树；
- **workInProgress**：这个参数尤为重要，它就是在整个内存中所构建的 `Fiber`树，所有的更新都发生在 `workInProgress` 中，所以这个树是**最新状态**的，之后它将替换给 `current`；
- **renderLanes**：跟优先级有关。

**element 与 fiber 的对应关系：**
fiber | element
------|--------
`FunctionComponent` = 0 | 函数组件
`ClassComponent` = 1 | 类组件
`IndeterminateComponent` = 2 | 初始化的时候不知道是函数组件还是类组件
`HostRoot` = 3 | 根元素，通过`reactDom.render()`产生的根元素
`HostPortal` = 4 | `ReactDOM.createPortal` 产生的 `Portal`
`HostComponent` = 5 | `dom` 元素（如`<div>`）
`HostText` = 6 | 文本节点
`Fragment` = 7 | `<React.Fragment>`
`Mode` = 8 | `<React.StrictMode>`
`ContextConsumer` = 9 | `<Context.Consumer>`
`ContextProvider` = 10 | `<Context.Provider>`
`ForwardRef` = 11 | `React.ForwardRef`
`Profiler` = 12 | `<Profiler>`
`SuspenseComponent` = 13 | `<Suspense>`
`MemoComponent` = 14 | `React.memo` 返回的组件
`SimpleMemoComponent` = 15 | `React.memo` 没有制定比较的方法，所返回的组件
`LazyComponent` = 16 | `<lazy />`

### Fiber 中保存了什么

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/fd05d3e8ff4947a289f596fe5a4b934e~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

::: tip
源码位置：`packages/react-reconciler/src/ReactFiber.js`中的`FiberNode`。
:::
为了更直观地查看 `FiberNode` 的属性，我们直接看对应的 `type`（位置在同目录下的 `ReactInternalTypes`）。

将 `FiberNode` 内容简单化为四个部分，分别是 `Instance`、`Fiber`、`Effect`、`Priority`。

`Instance`：这个部分是用来存储一些对应 `element` 元素的属性。

~~~ts
export type Fiber = {
  tag: WorkTag,  // 组件的类型，判断函数式组件、类组件等（上述的tag）
  key: null | string, // key
  elementType: any, // 元素的类型
  type: any, // 与fiber关联的功能或类，如<div>,指向对应的类或函数
  stateNode: any, // 真实的DOM节点
  ...
}
~~~
**Fiber**：这部分内容存储的是关于 `Fiber` 链表相关的内容和相关的 `props`、`state`。
~~~ts
export type Fiber = {
  ...
  return: Fiber | null, // 指向父节点的fiber
  child: Fiber | null, // 指向第一个子节点的fiber
  sibling: Fiber | null, // 指向下一个兄弟节点的fiber
  index: number, // 索引，是父节点fiber下的子节点fiber中的下表
  
  ref:
    | null
    | (((handle: mixed) => void) & {_stringRef: ?string, ...})
    | RefObject,  // ref的指向，可能为null、函数或对象
    
  pendingProps: any,  // 本次渲染所需的props
  memoizedProps: any,  // 上次渲染所需的props
  updateQueue: mixed,  // 类组件的更新队列（setState），用于状态更新、DOM更新
  memoizedState: any, // 类组件保存上次渲染后的state，函数组件保存的hooks信息
  dependencies: Dependencies | null,  // contexts、events（事件源） 等依赖

  mode: TypeOfMode, // 类型为number，用于描述fiber的模式 
  ...
}
~~~
**Effect**：副作用相关的内容。
~~~ts
export type Fiber = {
  ...
   flags: Flags, // 用于记录fiber的状态（删除、新增、替换等）
   subtreeFlags: Flags, // 当前子节点的副作用状态
   deletions: Array<Fiber> | null, // 删除的子节点的fiber
   nextEffect: Fiber | null, // 指向下一个副作用的fiber
   firstEffect: Fiber | null, // 指向第一个副作用的fiber
   lastEffect: Fiber | null, // 指向最后一个副作用的fiber
  ...
}
~~~
**Priority**：优先级相关的内容。
~~~ts
export type Fiber = {
  ...
  lanes: Lanes, // 优先级，用于调度
  childLanes: Lanes,
  alternate: Fiber | null,
  actualDuration?: number,
  actualStartTime?: number,
  selfBaseDuration?: number,
  treeBaseDuration?: number,
  ...
}
~~~

### 链表之间如何连接的
我们知道了 `Fiber` 中保存的属性，那么我们要知道标签之间是如何连接的。`Fiber` 中通过 `return`、`child`、`sibling` 这三个参数来进行连接，它们分别指向父级、子级、兄弟，也就是说每个 `element` 通过这三个属性进行连接，同时通过 `tag` 的值来判断对应的 `element` 是什么。如：
~~~ts
const Index = (props)=> {

  return (
    <div>
      大家好，我是小杜杜，一起玩转Hooks吧！
      <div>知悉Fiber</div>
      <p>更好的了解Hooks</p>
    </div>
  );
}
~~~
那么按照之前讲的就会转化为：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/34d146c090f04d569f10c34cf9889213~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

**Fiber** 结构的创建和更新都是**深度优先遍历**，遍历顺序为：
- 首先会判断当前组件是类组件还是函数式组件，类组件 `tag` 为 `1`，函数式为 `0`；
- 然后发现 `div` 标签，标记 `tag` 为 `5`；
- 发现 `div` 下包含三个部分，分别是，文本：大家好，我是小杜杜，一起玩转`hooks`吧！、`div`标签、`p`标签；
- 遍历文本：大家好，我是小杜杜，一起玩转 `hooks` 吧！，下面无节点，标记 `tag` 为 `6`；
- 在遍历 `div` 标签，标记 `tag` 为 `5`，此时下面有节点，所以对节点进行遍历，也就是文本 知悉 `fiber`，标记 `tag` 为 `6`；
- 同理最后遍历`p`标签。
  
整个的流程就是这样，通过 `tag` 标记属于哪种类型，然后通过 `return`、`child`、`sibling` 这三个参数来判断节点的位置。

### React v18 并发机制
在 `React v18` 中，最重要的一个概念就是并发（`concurrency`）。其中 `useTransition` 、`useDeferredValue` 的内部原理都是基于并发的，可见并发的重要性。

##### React 中的并发
首先，`js` 是单线程语言，也就是说 `js` 在同一时间只能干一件事情。但这样就会产生一个问题，如果当前的事情非常耗时，那么后续的事情就会被延后（阻塞）。

比如用户点击按钮后，先执行一个非常耗时的操作（大约 500ms），再进行其他操作，但在这 500ms 中，界面是属于卡死的状态，也就是说用户是无法进行其他操作，这种行为是非常影响用户体验的。而并发就是为了解决这类事件。

在并发的情况下，`React` 会先点击这个耗时任务，当其他操作发生时（如滚动），先执行滚动的任务，然后再执行耗时任务，这样既能保持耗时任务的进行，又能让用户进行交互。

虽然想法是好的，但实现起来就比较困难了。比如在更新中又触发了其他更新条件，怎么区分哪个是耗时任务？在更新的时候如何中断耗时任务？又该如何去恢复呢？

::: tip
官网描述**并发属于新的一种幕后机制**，它允许在同一时间内，准备多个版本的 `UI`，即多个版本的更新。
:::

##### 时间分片
首先，我们要知道一个前置知识点：[window.requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)。

它的作用是：**插入一个函数，这个函数将在浏览器空闲时期被调用**。 这使开发者能够在主事件循环上执行后台和低优先级工作，而不会影响延迟关键事件，如动画和输入响应。函数一般会按先进先调用的顺序执行，然而，如果回调函数指定了执行超时时间 `timeout`，则有可能为了在超时前执行函数而打乱执行顺序。

整个页面的内容是一帧一帧绘制出来的，通常来讲，1s 内绘制的帧数越多，就代表变现的画面更加细腻。大多数浏览器绘制一帧在 16.6ms 左右，执行步骤为：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3c1fc8e731054f45b85d1ec505c5ba0b~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

1. 用户的操作：如 `click`、`input` 等；
2. 执行 `JS` 代码，宏任务和微任务；
3. 渲染前执行 `resize/scroll` 等操作，再执行 `requestAnimationFrame` 回调；
4. 渲染页面，绘制 `html、css` 等；
5. 执行 `RIC（requestIdleCallback 回调函数）`，如果前面的步骤执行完成了，一帧还有剩余时间，就会执行该函数。

而 `React` 是将任务进行拆解，然后放到 `requestIdleCallback` 中执行。比如一个 300ms 的更新，拆解为 6 个 50ms 的更新，然后放到 `requestIdleCallback` 中，如果一帧之内有剩余就会去执行，这样的话更新一直在继续，也可以达到交互的效果。

但 `requestIdleCallback` 的兼容性非常差，`React` 团队并不打算使用，而是自己去实现一个类似 `requestIdleCallback` 的功能，也就是：**时间分片**。

##### 优先级
优先级是 `React` 中非常重要的模块，分为两种方式：
- `紧急更新（Urgent updates）`： 用户的交互，如：点击、输入等，直接影响用户体验的行为都属于紧急情况；
- `过渡更新（Transition updates）`： 页面跳转等操作属于非紧急情况。

优先级的模块非常大，这里不做过多的介绍。我们只需要知道，所有的操作都有对应优先级，`React` 会先执行紧急的更新，其次才会执行非紧急的更新。

##### 并发模式的实现
关于并发模式，整体可分为三步，分别是：
- 每个更新，都会分配一个优先级（`lane`），用于区分紧急程度；
- 将不紧急的更新拆解成多段，并通过宏任务的方式将其合理分配到浏览器的帧当中，使得紧急任务可以插入进来；
- 优先级高的更新会打断优先级低的更新，等优先级高的更新执行完后，再执行优先级低的任务。

##### Concurrent 模式是否默认开启
并发机制是 `React v18` 中的新功能，那么很多小伙伴会产生这样的疑问，`Concurrent` 模式需要手动开启吗？还是说所有的代码都转化成 `Concurrent` 模式了呢？

实际上，在 `React v18` 中，`Concurrent` 并不需要手动开启，而是默认开启，换句话说，`Concurrent` 模式无法关闭，而是一直存在的。

但要注意，并不是所有的代码都执行 `Concurent` 模式，比如事件更新在 `event`、`setTimeout`、网络请求等，`React` 依旧采用 `legacy` （同步阻塞）模式，但如果事件更新与 `Suspense、useTransition、useDeferredValue` 相关，`React` 则会采用 `Concurent` 模式。

总的来说，`React` 的 `Concurrent` 模式是否启用取决于**触发更新的上下文**，这点要特别注意。

## 以 useState 的视角来看 Hooks 的运行机制
我们知道，如果 `React` 并没有 `Hooks`，那么函数式组件只能接收 `props`，渲染 `UI`，做一个展示组件，所有的逻辑就要在 `Class` 中书写，这样势必会导致 `Class` 组件内部错综复杂、代码臃肿。而函数式组件则不然，它能做 `Class` 组件的功能，拥有属于自己的状态，处理一些副作用，获取目标元素的属性、缓存数据等，所以有必要做一套函数式组件代替类组件的方案，`Hooks` 也就诞生了。

`Hooks` 拥有属于自己的状态，提供了 `useState` 和 `useReducer` 两个 `Hook`，解决自身的状态问题，取代 `Class` 组件的 `this.setState`。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/923d24d4edcd4dc0bb2e25437d54b776~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### 引入 useState 后发生了什么
先举个例子：
~~~tsx
import { Button } from "antd";
import { useState } from "react";
const Index = () => {
  const [count, setCount] = useState(0);
  return (
    <><div>大家好，我是小杜杜，一起玩转Hooks吧！</div><div>数字：{count}</div><Button onClick={() => setCount((v) => v + 1)}>点击加1</Button></>
  );
};

export default Index;
~~~
在上述的例子中，我们引入了 `useState`，并存储 `count` 变量，通过 `setCount` 来控制 `count`。也就是说，`count` 是函数式组件自身的状态，`setCount` 是触发数据更新的函数。

在通常的开发中，当引入组件后，会从引用地址跳到对应引用的组件，查看该组件到底是如何书写的。

我们以相同的方式来看看 `useState`，看看它在 `React` 中是如何书写的。

文件位置：`packages/react/src/ReactHooks.js`。
~~~ts
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  const dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
~~~
可以看出 `useState` 的执行就等价于 `resolveDispatcher().useState(initialState)`，那么我们顺着线索看下去：
**resolveDispatcher() ：**
~~~ts
function resolveDispatcher() {
  const dispatcher = ReactCurrentDispatcher.current;
  return ((dispatcher: any): Dispatcher);
}
~~~
**ReactCurrentDispatcher：**
文件位置：`packages/react/src/ReactCurrentDispatcher.js`。
~~~ts
const ReactCurrentDispatcher = {
  current: (null: null | Dispatcher),
};
~~~
通过类型可以看到 `ReactCurrentDispatcher` 不是 `null`，就是 `Dispatcher`，而在初始化时 `ReactCurrentDispatcher.current` 的值必为 `null`，因为此时还未进行操作。

那么此时就很奇怪了，我们并没有发现 `useState` 是如何进行存储、更新的，`ReactCurrentDispatcher.current` 又是何时为 `Dispatcher` 的？

既然我们在 `useState` 自身中无法看到存储的变量，那么就只能从函数执行开始，一步一步探索 `useState` 是如何保存数据的。

### 函数式组件如何执行的
在上节 `Fiber` 的讲解中，了解到我们写的 `JSX` 代码，是被 `babel` 编译成 `React.createElement` 的形式后，最终会走到 `beginWork` 这个方法中，而 `beginWork` 会走到 `mountIndeterminateComponent` 中，在这个方法中会有一个函数叫 `renderWithHooks`。

`renderWithHooks` 就是所有函数式组件触发函数，接下来一起看看：

文件位置：`packages/react-reconciler/src/ReactFiberHooks`。
~~~ts
export function renderWithHooks<Props, SecondArg>(
  current: Fiber | null,
  workInProgress: Fiber,
  Component: (p: Props, arg: SecondArg) => any,
  props: Props,
  secondArg: SecondArg,
  nextRenderLanes: Lanes,
): any {
  currentlyRenderingFiber = workInProgress;

  // memoizedState: 用于存放hooks的信息，如果是类组件，则存放state信息
  workInProgress.memoizedState = null;
  //updateQueue：更新队列，用于存放effect list，也就是useEffect产生副作用形成的链表
  workInProgress.updateQueue = null;

  // 用于判断走初始化流程还是更新流程
  ReactCurrentDispatcher.current =
    current === null || current.memoizedState === null
      ? HooksDispatcherOnMount
      : HooksDispatcherOnUpdate;

  // 执行真正的函数式组件，所有的hooks依次执行
  let children = Component(props, secondArg);

  finishRenderingHooks(current, workInProgress);

  return children;
}

function finishRenderingHooks(current: Fiber | null, workInProgress: Fiber) {
    
  // 防止hooks乱用，所报错的方案
  ReactCurrentDispatcher.current = ContextOnlyDispatcher;

  const didRenderTooFewHooks =
    currentHook !== null && currentHook.next !== null;

  // current树
  currentHook = null;
  workInProgressHook = null;

  didScheduleRenderPhaseUpdate = false;
}
~~~
我们先分析下 `renderWithHooks` 函数的入参。
- **current**： 即 `current fiber`，渲染完成时所生成的 `current` 树，之后在 **commit 阶段替换为真正的 DOM 树**；
- **workInProgress**： 即 `workInProgress fiber`，当更新时，**复制 current fiber，从这棵树进行更新，更新完毕后，再赋值给 current 树**；
- **Component**： 函数组件本身；
- **props**： 函数组件自身的 `props`；
- **secondArg**： 上下文；
- **nextRenderLanes**： 渲染的优先级。

::: tip
问：`Fiber` 架构的三个阶段分别是什么？

答：总共分为 `reconcile`、`schedule`、`commit` 阶段。
- `reconcile` 阶段： `vdom` 转化为 `fiber` 的过程。
- `schedule` 阶段：在 `fiber` 中遍历的过程中，可以打断，也能再恢复的过程。
- `commit` 阶段：`fiber` 更新到真实 `DOM` 的过程。
:::

#### renderWithHooks 的执行流程
1. 在每次函数组件执行之前，先将 `workInProgress` 的 `memoizedState` 和 `updateQueue` 属性进行清空，之后将新的 `Hooks` 信息挂载到这两个属性上，之后在 `commit` 阶段替换 `current` 树，也就是说 `current` 树保存 `Hooks` 信息；
2. 然后通过判断 `current` 树是否存在来判断走初始化（ `HooksDispatcherOnMount` ）流程还是更新（ `HooksDispatcherOnUpdate` ）流程。而 `ReactCurrentDispatcher.current` 实际上包含所有的 `Hooks`，简单地讲，`React` 根据 `current` 的不同来判断对应的 `Hooks`，从而监控 `Hooks` 的调用情况；
3. 接下来调用的 `Component(props, secondArg)` 就是真正的函数组件，然后依次执行里面的 `Hooks`；
4. 最后提供整个的异常处理，防止不必要的报错，再将一些属性置空，如：`currentHook`、`workInProgressHook` 等。

通过 `renderWithHooks` 的执行步骤，可以看出总共分为三个阶段，分别是：初始化阶段、更新阶段以及异常处理三个阶段，同时这三个阶段也是整个 `Hooks` 处理的三种策略，接下来我们逐一分析。

### HooksDispatcherOnMount（初始化阶段）
在初始化阶段中，调用的是 `HooksDispatcherOnMount`，对应的 `useState` 所走的是 `mountState`。

文件位置：`packages/react-reconciler/src/ReactFiberHooks.js`。
~~~ts
 // 包含所有的hooks，这里列举常见的
const HooksDispatcherOnMount = { 
    useRef: mountRef,
    useMemo: mountMemo,
    useCallback: mountCallback,
    useEffect: mountEffect,
    useState: mountState,
    useTransition: mountTransition,
    useSyncExternalStore: mountSyncExternalStore,
    useMutableSource: mountMutableSource,
    ...
}

function mountState(initialState){
  // 所有的hooks都会走这个函数
  const hook = mountWorkInProgressHook(); 
  
  // 确定初始入参
  if (typeof initialState === 'function') {
    // $FlowFixMe: Flow doesn't like mixed types
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  
  const queue = {
    pending: null,
    lanes: NoLanes,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: (initialState),
  };
  hook.queue = queue;
  
  const dispatch = (queue.dispatch = (dispatchSetState.bind(
    null,
    currentlyRenderingFiber,
    queue,
  ): any));
  return [hook.memoizedState, dispatch];
}
~~~
#### mountWorkInProgressHook
整体的流程先走向 `mountWorkInProgressHook()` 这个函数，它的作用尤为重要，因为这个函数的作用是将 `Hooks` 与 `Fiber` 联系起来，并且你会发现，所有的 `Hooks` 都会走这个函数，只是不同的 `Hooks` 保存着不同的信息。
~~~ts
function mountWorkInProgressHook(): Hook {
  const hook: Hook = {
    memoizedState: null,
    baseState: null,
    baseQueue: null,
    queue: null,
    next: null,
  };

  if (workInProgressHook === null) { // 第一个hooks执行
    currentlyRenderingFiber.memoizedState = workInProgressHook = hook;
  } else { // 之后的hooks
    workInProgressHook = workInProgressHook.next = hook;
  }
  return workInProgressHook;
}
~~~
来看看 `hook` 值的参数：
- **memoizedState**：用于保存数据，不同的 `Hooks` 保存的信息不同，比如 `useState` 保存 `state` 信息，`useEffect` 保存 `effect` 对象，`useRef` 保存 `ref` 对象；
- **baseState**：当数据发生改变时，保存最新的值；
- **baseQueue**：保存最新的更新队列；
- **queue**：保存待更新的队列或更新的函数；
- **next**：用于指向下一个 `hook` 对象。

那么 `mountWorkInProgressHook` 的作用就很明确了，每执行一个 `Hooks` 函数就会生成一个 `hook` 对象，然后将每个 `hook` 串联起来。
::: tip
特别注意：这里的 `memoizedState` 并不是 `Fiber` 链表上的 `memoizedState`，`workInProgress` 保存的是当前函数组件每个 `Hooks` 形成的链表。
:::

#### 执行步骤
了解完 `mountWorkInProgressHook` 后，再来看看之后的流程。

首先通过 `initialState` 初始值的类型（判断是否是函数），并将初始值赋值给 `hook` 的 `memoizedState` 和 `baseState`。再之后，创建一个 `queue` 对象，这个对象中会保存一些数据，这些数据为：
- **pending**：用来调用 `dispatch` 创建时最后一个；
- **lanes**：优先级；
- **dispatch**：用来负责更新的函数；
- **lastRenderedReducer**：用于得到最新的 `state`；
- **lastRenderedState**：最后一次得到的 `state`。

最后会定义一个 `dispath`，而这个 `dispath` 就应该对应最开始的 `setCount`，那么接下来的目的就是搞懂 `dispatch` 的机制。

#### dispatchSetState
`dispatch` 的机制就是 `dispatchSetState`，在源码内部还是调用了很多函数，所以在这里对 `dispatchSetState` 函数做了些优化，方便我们更好地观看。
~~~ts
function dispatchSetState<S, A>(
  fiber: Fiber, // 对应currentlyRenderingFiber
  queue: UpdateQueue<S, A>, // 对应 queue
  action: A, // 真实传入的参数
): void {

  // 优先级，不做介绍，后面也会去除有关优先级的部分
  const lane = requestUpdateLane(fiber);

  // 创建一个update
  const update: Update<S, A> = {
    lane,
    action,
    hasEagerState: false,
    eagerState: null,
    next: (null: any),
  };

   // 判断是否在渲染阶段
  if (fiber === currentlyRenderingFiber || (fiber.alternate !== null && fiber.alternate === currentlyRenderingFiber)) {
      didScheduleRenderPhaseUpdateDuringThisPass = didScheduleRenderPhaseUpdate = true;
      const pending = queue.pending;
      // 判断是否是第一次更新
      if (pending === null) {
        update.next = update;
      } else {
        update.next = pending.next;
        pending.next = update;
      }
      // 将update存入到queue.pending中
      queue.pending = update;
  } else { // 用于获取最新的state值
    const alternate = fiber.alternate;
    if (alternate === null && lastRenderedReducer !== null){
      const lastRenderedReducer = queue.lastRenderedReducer;
      let prevDispatcher;
      const currentState: S = (queue.lastRenderedState: any);
      // 获取最新的state
      const eagerState = lastRenderedReducer(currentState, action);
      update.hasEagerState = true;
      update.eagerState = eagerState;
      if (is(eagerState, currentState)) return;
    }

    // 将update 插入链表尾部，然后返回root节点
    const root = enqueueConcurrentHookUpdate(fiber, queue, update, lane);
    if (root !== null) {
      // 实现对应节点的更新
      scheduleUpdateOnFiber(root, fiber, lane, eventTime);
    }
  }
}
~~~
在代码中，我已经将每段代码执行的目的标注出来，为了我们更好地理解，分析一下对应的入参，以及函数体内较重要的参数与步骤。
- **分析入参**：`dispatchSetState` 一共有三个入参，前两个入参数被 `bind` 分别改为 `currentlyRenderingFiber` 和 `queue`，第三个 `action` 则是我们实际写的函数；
- **update 对象**：生成一个 `update` 对象，用于记录更新的信息；
- **判断是否处于渲染阶段**：如果是渲染阶段，则将 `update` 放入等待更新的 `pending` 队列中，如果不是，就会获取最新的 `state` 值，从而进行更新。
::: tip
问：`bind` 的作用是什么？

答：当函数调用 `bind` 后，会产生一个新的函数，第一个值会作为新函数的 `this`，如果第一个参数为 `null` 或是 `undefined` 时，会默认指向 `window`，其余的参数会依次成为旧函数的参数。
:::
值得注意的是：在更新过程中，也会判断很多，通过调用 `lastRenderedReducer` 获取最新的 `state`，然后进行**比较（浅比较）** ，如果相等则退出，这一点就是证明 `useState` 渲染相同值时，组件不更新的原因。

如果不相等，则会将 `update` 插入链表的尾部，返回对应的 `root` 节点，通过 **scheduleUpdateOnFiber 实现对应的更新**，可见 `scheduleUpdateOnFiber` 是 `React` 渲染更新的主要函数。

### HooksDispatcherOnUpdate（更新阶段）
在更新阶段时，调用 `HooksDispatcherOnUpdate`，对应的 `useState` 所走的是 `updateState`，如：

文件位置：`packages/react-reconciler/src/ReactFiberHooks.js`。
~~~ts
const HooksDispatcherOnUpdate: Dispatcher = {
  useRef: updateRef,
  useMemo: updateMemo,
  useCallback: updateCallback,
  useEffect: updateEffect,
  useState: updateState,
  useTransition: updateTransition,
  useSyncExternalStore: updateSyncExternalStore,
  useMutableSource: updateMutableSource,
  ...
};

function updateState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return updateReducer(basicStateReducer, (initialState: any));
}

function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action;
}
~~~
在 `updateState` 有两个函数，一个是 `updateReducer`，另一个是 `basicStateReducer`。

`basicStateReducer` 很简单，判断是否是函数，返回对应的值即可。

那么下面主要看 `updateReducer` 这个函数，在 `updateReducer` 函数中首先调用 `updateWorkInProgressHook`，我们先来看看这个函数，方便后续对 `updateReducer` 的理解。

#### updateWorkInProgressHook
`updateWorkInProgressHook` 跟 `mountWorkInProgressHook` 一样，当函数更新时，所有的 `Hooks` 都会执行。

文件位置：`packages/react-reconciler/src/ReactFiberHooks.js`。
~~~ts
function updateWorkInProgressHook(): Hook {
  let nextCurrentHook: null | Hook;
  
  // 判断是否是第一个更新的hook
  if (currentHook === null) { 
    const current = currentlyRenderingFiber.alternate;
    if (current !== null) {
      nextCurrentHook = current.memoizedState;
    } else {
      nextCurrentHook = null;
    }
  } else { // 如果不是第一个hook，则指向下一个hook
    nextCurrentHook = currentHook.next;
  }

  let nextWorkInProgressHook: null | Hook;
  // 第一次执行
  if (workInProgressHook === null) { 
    nextWorkInProgressHook = currentlyRenderingFiber.memoizedState;
  } else {
    nextWorkInProgressHook = workInProgressHook.next;
  }

  if (nextWorkInProgressHook !== null) {
    // 特殊情况：发生多次函数组件的执行
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
  } else {
    if (nextCurrentHook === null) {
      const currentFiber = currentlyRenderingFiber.alternate;
      
      const newHook: Hook = {
        memoizedState: null,
        baseState: null,
        baseQueue: null,
        queue: null,
        next: null,
      };
        nextCurrentHook = newHook;
      } else {
        throw new Error('Rendered more hooks than during the previous render.');
      }
    }

    currentHook = nextCurrentHook;

    // 创建一个新的hook
    const newHook: Hook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      baseQueue: currentHook.baseQueue,
      queue: currentHook.queue,
      next: null,
    };

    if (workInProgressHook === null) { // 如果是第一个函数
      currentlyRenderingFiber.memoizedState = workInProgressHook = newHook;
    } else {
      workInProgressHook = workInProgressHook.next = newHook;
    }
  }
  return workInProgressHook;
}
~~~
`updateWorkInProgressHook` 执行流程：如果是首次执行 `Hooks` 函数，就会从已有的 `current` 树中取到对应的值，然后声明 `nextWorkInProgressHook`，经过一系列的操作，得到更新后的 `Hooks` 状态。

在这里要注意一点，大多数情况下，`workInProgress` 上的 `memoizedState` 会被置空，也就是 `nextWorkInProgressHook` 应该为 `null`。但执行多次函数组件时，就会出现循环执行函数组件的情况，此时 `nextWorkInProgressHook` 不为 `null`。

#### updateReducer
掌握了 `updateWorkInProgressHook` 执行流程后， 再来看 `updateReducer` 具体有哪些内容。
~~~ts
function updateReducer<S, I, A>(
  reducer: (S, A) => S,
  initialArg: I,
  init?: I => S,
): [S, Dispatch<A>] {

  // 获取更新的hook，每个hook都会走
  const hook = updateWorkInProgressHook();
  const queue = hook.queue;

  queue.lastRenderedReducer = reducer;

  const current: Hook = (currentHook: any);

  let baseQueue = current.baseQueue;
 
  // 在更新的过程中，存在新的更新，加入新的更新队列
  const pendingQueue = queue.pending;
  if (pendingQueue !== null) {
    // 如果在更新过程中有新的更新，则加入新的队列，有个合并的作用，合并到 baseQueue
    if (baseQueue !== null) {
      const baseFirst = baseQueue.next;
      const pendingFirst = pendingQueue.next;
      baseQueue.next = pendingFirst;
      pendingQueue.next = baseFirst;
    }
    current.baseQueue = baseQueue = pendingQueue;
    queue.pending = null;
  }

  if (baseQueue !== null) {
    const first = baseQueue.next;
    let newState = current.baseState;

    let newBaseState = null;
    let newBaseQueueFirst = null;
    let newBaseQueueLast = null;
    let update = first;
    
    // 循环更新
    do {
      // 获取优先级
      const updateLane = removeLanes(update.lane, OffscreenLane);
      const isHiddenUpdate = updateLane !== update.lane;

      const shouldSkipUpdate = isHiddenUpdate
        ? !isSubsetOfLanes(getWorkInProgressRootRenderLanes(), updateLane)
        : !isSubsetOfLanes(renderLanes, updateLane);

      if (shouldSkipUpdate) {
        const clone: Update<S, A> = {
          lane: updateLane,
          action: update.action,
          hasEagerState: update.hasEagerState,
          eagerState: update.eagerState,
          next: (null: any),
        };
        if (newBaseQueueLast === null) {
          newBaseQueueFirst = newBaseQueueLast = clone;
          newBaseState = newState;
        } else {
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }
        
        // 合并优先级（低级任务）
        currentlyRenderingFiber.lanes = mergeLanes(
          currentlyRenderingFiber.lanes,
          updateLane,
        );
        markSkippedUpdateLanes(updateLane);
      } else {
         // 判断更新队列是否还有更新任务
        if (newBaseQueueLast !== null) {
          const clone: Update<S, A> = {
            lane: NoLane,
            action: update.action,
            hasEagerState: update.hasEagerState,
            eagerState: update.eagerState,
            next: (null: any),
          };
          
          // 将更新任务插到末尾
          newBaseQueueLast = newBaseQueueLast.next = clone;
        }

        const action = update.action;
        
        // 判断更新的数据是否相等
        if (update.hasEagerState) {
          newState = ((update.eagerState: any): S);
        } else {
          newState = reducer(newState, action);
        }
      }
      // 判断是否还需要更新
      update = update.next;
    } while (update !== null && update !== first);

    // 如果 newBaseQueueLast 为null，则说明所有的update处理完成，对baseState进行更新
    if (newBaseQueueLast === null) {
      newBaseState = newState;
    } else {
      newBaseQueueLast.next = (newBaseQueueFirst: any);
    }

    // 如果新值与旧值不想等，则触发更新流程
    if (!is(newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    // 将新值，保存在hook中
    hook.memoizedState = newState;
    hook.baseState = newBaseState;
    hook.baseQueue = newBaseQueueLast;

    queue.lastRenderedState = newState;
  }

  if (baseQueue === null) {
    queue.lanes = NoLanes;
  }

  const dispatch: Dispatch<A> = (queue.dispatch: any);
  return [hook.memoizedState, dispatch];
}
~~~
`updateReducer` 的作用是将待更新的队列 `pendingQueue` 合并到 `baseQueue` 上，之后进行循环更新，最后进行一次合成更新，也就是批量更新，统一更换节点。

这种行为解释了 `useState` 在更新的过程中为何传入相同的值，不进行更新，同时多次操作，只会执行最后一次更新的原因了。

### 更新 state 值
为了更好理解更新流程，我们做一个简单的例子来说明：
~~~tsx
function Index() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: 20 }}>
      <div>数字：{count}</div>
      <Button
        onClick={() => {
          // 第一种方式
          setCount((v) => v + 1);
          setCount((v) => v + 2);
          setCount((v) => v + 3);

          // 第二种方式
          setCount(count + 1);
          setCount(count + 2);
          setCount(count + 3);
        }}
      >
        批量执行
      </Button>
    </div>
  );
}

export default Index;
~~~
案例中就是普通的点击按钮，触发 `count` 变化的操作，那么大家可以猜想下，这两种方式点击按钮后的 `count` 的值究竟是多少？

答案：
- 第一种 `count` 等于：**6**；
- 第二种 `count` 等于：**3**。

出现这种原因也非常简单，当 `setCount` 的参数为函数时，此时的返参 `v` 就是 `baseQueue` 链表不断更新的值，所以为 `0 + 1 + 2 + 3 = 6`。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/ac2a852268ad4466bbb0218b66664fbe~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

而第二种的 `count` 为渲染后的值，也就是说，三个 `setCount` 全部执行完成，合并之后，`count` 才会变，在合并前为 `0 + 1， 0 + 2， 0 + 3`。最后一次为 `3`，所以 `count` 为 `3`。

### ContextOnlyDispatcher 异常处理阶段
在 `renderWithHooks` 流程最后，调用了 `finishRenderingHooks` 函数，这个函数中用到了 `ContextOnlyDispatcher`，那么它的作用是什么呢？看看代码：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/f508cfac3c534d3ca129cad61e1d1546~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

**throwInvalidHookError**：
~~~ts
function throwInvalidHookError() {
  throw new Error(
    'Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' +
      ' one of the following reasons:\n' +
      '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' +
      '2. You might be breaking the Rules of Hooks\n' +
      '3. You might have more than one copy of React in the same app\n' +
      'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.',
  );
}
~~~
可以看到，`ContextOnlyDispatcher` 是判断所需 `Hooks` 是否在函数组件内部，有**捕获并抛出异常的作用**，这也就解释了 `Hooks` 无法在 `React` 之外运行的原因。

### useState 运行流程
我们以 `useState` 为例，讲解了对应的初始化和更新，简单回顾一下运行流程：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/232fa16909db4636a3d4283816c3ccd4~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### Hooks 规则：时序问题
了解完 `useState` 源码，以及存储、更新、异常的处理方案，我们发现其中有一个问题点，在我们多次调用 `useState` `的时候，React` 是如何知道我们要改变的 `useState` 就是想要改变的 `useState` 呢？如：
~~~ts
const [name, setName] = useState("小杜杜")
const [age, setAge] = useState(0)

useEffect(() => {}, [])
~~~
这两个 `useState` 只有参数上的区别，那么 `React` 是如何区分是 `name` 还是 `age` 呢？

答案其实很简单，就是时序，`React` 相当于做了一个合并操作，当我们第一次调用 `useState` 时，保存了 `name`，第二次调用时保存了 `age`，相当于类中的结构。
~~~ts
this.setState({
    name: "小杜杜",
    age: 7
})
~~~
当然，在 `mountWorkInProgressHook` 讲解中说过，所有的 `Hooks` 在创建时，都会产生对应的 `hook` 对象，当有多个 `Hooks` 时会以 `next` 连接起来。

当初始化完成后，对应的结构应该是：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/9503fa7935e64be29cda24c738f36293~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

同时，在 `Hooks` 的规则中有这么一条：只在最顶层使用 `Hook`，不要在循环、条件或嵌套函数中使用 `Hook`。

那如果就把它放在条件中，会发生什么变化呢？
~~~ts
let age, setAge
if(name! == "小杜杜"){
   [age, setAge] = useState(0)
}

useEffect(() => {}, [])
~~~
在初始化中 `name` 为小杜杜，但当 `name` 改变时，便没有了 `age`，看看此时的报错：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1baaa0b516484e269d4875ce9a38647f~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

造成这样的结果，是因为在新的中缺少了 `useState2`，换句话说，在更新状态的时候，表的结构遭到了**破坏**，**让原本指向 useState2 的，指向到 useEffect**。

从源码的角度来讲，`current` 树的 `memoizedState` 缓存 `hook` 信息，和当前的 `workInProgress` 不一致，此时就会发生异常。这也是**不能在条件语句中创建的原因**。
::: tip
注：另外可以在 `Fiber` 中的 `_debugHookTypes` 属性中查看调用 `Hooks` 的顺序。
:::

### Hooks 的实现与 Fiber 有必然联系吗
最终 `Hooks` 存储的数据保存在 `Fiber` 中，`Hooks` 的产生也确实在 `Fiber` 的基础上，那么 `Hooks` 与 `Fiber` 的关系是必然的吗？

从 `React` 的角度出发，整个的渲染流程中是通过 `Fiber` 去进行转化的，流程为：**jsx => vdom => Fiber => 真实 DOM**。

**而 Hooks 对应 Fiber 中的 memorizedState 链表，依靠 next 链接，只是不同的 hooks 对应保存的值不同而已**。 换言之，可以把 `Fiber` 当作保存 `Hooks` 值的容器，但这与本身是否依赖 `Fiber` 并没有太大的联系。

就好比 `preact` 中的 `Hooks`，它并没有实现 `Fiber` 架构，但也同样实现了 `Hooks`，它把 `Hooks` 链表放在了 `vnode._component._hooks` 属性上。

总的来说 ：实现 `Hooks` 与 `Fiber` 并没有必然的联系，相反，只要有对应保存的地方就 `ok` 了。

## 从 useEffect 的源码上解决闭包问题
众所周知，`useEffect` 是用来处理副作用函数的，那么什么是副作用呢？

副作用（`Side Effect`）是指 `function` 做了和本身运算返回值无关的事，如请求数据、修改全局变量，打印、数据获取、设置订阅，以及手动更改 `React` 组件中的 `DOM`，这些操作都属于副作用。

`useEffect` 与 `useState` 的阶段有所不同，共分为：初始化阶段、更新阶段、`commit` 阶段，接下来我们围绕这三个阶段全面了解它。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/428a8de0c26a424f9eaa93ff9a998847~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### mountEffect（初始化阶段）
文件位置：`packages/react-reconciler/src/ReactFiberHooks.js`。
~~~ts
function mountEffect(
  create: () => (() => void) | void, // 回调函数，也是副作用函数
  deps: Array<mixed> | void | null, // 依赖项
): void {
  mountEffectImpl(
    PassiveEffect | PassiveStaticEffect,
    HookPassive,
    create,
    deps,
  );
}

function mountEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  currentlyRenderingFiber.flags |= fiberFlags;
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    undefined,
    nextDeps,
  );
}
~~~
从 `mountEffect` 进来，直接走向 `mountEffectImpl` 函数，先来看看 `mountEffectImpl` 的入参：
- `fiberFlags`：有副作用的更新标记，用来标记 `hook` 在 `fiber` 中的位置；
- `hookFlags`：副作用标记；
- `create`：用户传入的回调函数，也是副作用函数；
- `deps`：用户传递的依赖项。

`mountEffectImpl` 执行流程：
1. 初始化一个 `hook` 对象，并和 `fiber` 建立关系；
2. 判断 `deps` 是否存在，没有的话则是 `null`（需要注意下这个参数，后续会详细讲解）；
3. 给 `hook` 所在的 `fiber` 打上副作用的更新标记；
4. 将副作用的操作存放到 `hook.memoizedState` 中。

#### pushEffect
副作用的操作来到了 `pushEffect`，一起来看看：
~~~ts
function pushEffect(tag, create, destroy, deps): Effect {

  // 初始化一个effect对象
  const effect: Effect = {
    tag,
    create,
    destroy,
    deps,
    next: (null: any),
  };
  
  let componentUpdateQueue = (currentlyRenderingFiber.updateQueue: any);
  
  if (componentUpdateQueue === null) { //第一个effect对象
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    currentlyRenderingFiber.updateQueue = (componentUpdateQueue: any);
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else { // 存放多个effect对象
    const lastEffect = componentUpdateQueue.lastEffect;
    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      const firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }
  return effect;
}
~~~
别看 `pushEffect` 中有一大坨，但是不是有种似曾相识的感觉呢？没错，它与上节的内容类似，它的作用是创建一个 `effect` 对象，然后形成一个 `effect` 链表，通过 `next` 链接 ，最后绑定在 `fiber` 中的 `updateQueue` 上。比如下面这段代码：
~~~ts
const [name, setName] = useState("小杜杜");
const [count, setCount] = useState(0);

useEffect(() => {
  console.log(1);
}, []);

useEffect(() => {
  console.log(2);
}, [name]);

useEffect(() => {
  console.log(3);
}, [count]);
~~~
转化后的 `fiber.updateQueue` 为：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/d9ee0a06fbb14654b7b95f1f7603c37a~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

#### 不同的 Effect
值得注意的是 `fiber.updateQueue` 保存的是所有副作用，除了包含 `useEffect`，同时还包含 `useLayoutEffect` 和 `useInsertionEffect`。

这里会通过不同的 `fiberFlags` 给对应的 `effect` 打上标记，之后在 `updateQueue` 链表中的 `tag` 字段体现出来，最后在 `commit` 阶段，判断到底是哪种 `effect`，是同步还是异步等。如：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/3bf98be8cc3c44c68c0e5345021b992f~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### updateEffect（更新阶段）
~~~ts
function updateEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {
  updateEffectImpl(PassiveEffect, HookPassive, create, deps);
}

function updateEffectImpl(
  fiberFlags: Flags,
  hookFlags: HookFlags,
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null,
): void {

  // 获取更新的hooks
  const hook = updateWorkInProgressHook();
  // 处理deps
  const nextDeps = deps === undefined ? null : deps;
  let destroy = undefined;

  if (currentHook !== null) {
    const prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;
    if (nextDeps !== null) {
      const prevDeps = prevEffect.deps;
      
      // 判断依赖是否发生改变，如果没有，只更新副作用链表
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        hook.memoizedState = pushEffect(hookFlags, create, destroy, nextDeps);
        return;
      }
    }
  }

  // 如果依赖发生改变，则在更新链表的时候，打上对应的标签
  currentlyRenderingFiber.flags |= fiberFlags;

  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags,
    create,
    destroy,
    nextDeps,
  );
}
~~~
`updateEffect`：在更新阶段做的事其实很简单，就是判断 `deps` 是否发生改变，如果没有发生改变，则直接执行 `pushEffect`，如果发生改变，则附上不同的标签，最后在 `commit` 阶段，通过这些标签来判断是否执行 `effect` 函数。

#### 不同类型的 deps 对 effect 函数执行的影响
在日常的开发中，有些不熟悉 `useEffect` 的小伙伴只知道 `deps` 发生改变，则执行对应的 `effect` 函数，但对 `deps` 本身的类型并不了解，这也造就了一些莫名奇怪的 `bug`，怎么找也找不到，有时候真的有可能是规范所引起的，因此我们看看以下关于 `deps` 的问题：
1. `deps` 不存在时，造成的后果是什么？
2. `deps` 是空数组，造成的后果是什么（如：`[]`）？
3. `deps` 是数组、对象、函数时，造成的后果是什么（如：`[ [1] ]、[{ a: 1 }]`）？

实际上，所有的答案都在 `areHookInputsEqual` 函数中：
~~~ts
const nextDeps = deps === undefined ? null : deps;

function areHookInputsEqual(
  nextDeps: Array<mixed>,
  prevDeps: Array<mixed> | null,
): boolean {

  if (prevDeps === null) {
    return false;
  }

  for (let i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if (objectIs(nextDeps[i], prevDeps[i])) {
      continue;
    }
    return false;
  }
  return true;
}

// 存在Object.is，就直接使用，没有的话，手动实现Object.is
const objectIs: (x: any, y: any) => boolean = typeof Object.is === 'function' ? Object.is : is;

function is(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) 
  );
}
~~~
从代码中，共分为三种情况：
- 当 `deps` 不存在时，也就是 `undefined`，则会当作 `null` 处理，所以无论发生什么改变，`areHookInputsEqual` 的值始终为 `false`，从而每次都会执行；
- 当 `deps` 为空数组时，`areHookInputsEqual` 返回值为 `true`，此时只更新链表，并没有执行对应的副作用，所以只会走一次；
- 当 `deps` 为对象、数组、函数时，虽然保存了，但在 `objectIs` 做比较时，旧值与新值永远不相等，也就是`[1] !== [1]`、`{a: 1} !== {a: 1}`（指向不同），所以只要当 `deps` 发生变动，都会触发更新。

::: tip
注意： 如果强行比较对象、数组时，可以通过 `JSON.stringify()` 转化为字符串，当作 `deps` 的参数。

`useMemo` 和 `useCallback` 中的 `deps` 也是同理。
:::

### commitRoot（commit 阶段）
`commitRoot` 是 `commit` 阶段的入口，一起来看看。

文件位置：`packages/react-reconciler/src/ReactFiberWorkLoop.js`。
~~~ts
function commitRoot(
  root: FiberRoot,
  recoverableErrors: null | Array<CapturedValue<mixed>>,
  transitions: Array<Transition> | null,
) {
  // 获取优先级
  const previousUpdateLanePriority = getCurrentUpdatePriority();
  const prevTransition = ReactCurrentBatchConfig.transition;
  ...
  commitRootImpl(
      root,
      recoverableErrors,
      transitions,
      previousUpdateLanePriority,
  );

  return null;
}
~~~
在 `commitRoot` 中，首先会制定函数的优先级，当执行完毕后，恢复优先级，而这个函数的主体为 `commitRootImpl` 函数。

#### commitRootImpl
`commitRootImpl` 函数非常复杂，这里我们只关注 `effect` 的逻辑即可，而关于 `effect` 的逻辑主要是 `scheduleCallback`。
~~~ts
function commitRootImpl(root, recoverableErrors, transitions, renderPriorityLevel ) {
  ...
  scheduleCallback(NormalSchedulerPriority, () => {
    // 调度 Effect
    flushPassiveEffects();
    return null;
  });
  ...
  return null;
}
~~~
`scheduleCallback` 是 `React` 调度器（`Scheduler`）的一个 `API`，最终通过一个宏任务来异步调度传入的回调函数，使得该回调在下一轮事件循环中执行，此时浏览器已经绘制过一次。同时可以看出，`effectlist` 的优先级是：普通优先级。

#### flushPassiveEffects
~~~ts
export function flushPassiveEffects(): boolean {

  if (rootWithPendingPassiveEffects !== null) {
    ...
    try {
      ReactCurrentBatchConfig.transition = null;
      // 设置优先级
      setCurrentUpdatePriority(priority);
      // 调用函数
      return flushPassiveEffectsImpl();
    } finally {
      setCurrentUpdatePriority(previousPriority);
      ReactCurrentBatchConfig.transition = prevTransition;
      releaseRootPooledCache(root, remainingLanes);
    }
  }
  return false;
}
~~~
到 `flushPassiveEffects` 中，也是一系列跟优先级有关的操作，最终走向 `flushPassiveEffectsImpl` 这个函数。而在这个函数中会执行两个方法，分别是：`commitPassiveUnmountEffects`（执行所有 `effect` 的销毁程序） 和 `commitPassiveMountEffects`（执行所有 `effect` 的回调函数）。

接下来逐一进行分析，看看两者的的流向。

#### commitPassiveMountEffects 的流向

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/e6da4e94f10844c78c637e0df48bc541~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

最终的走向为 `commitHookEffectListMount` 函数，着重看下：
~~~ts
function commitHookEffectListMount(flags: HookFlags, finishedWork: Fiber) {
  const updateQueue = (finishedWork.updateQueue: any);
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        if (enableSchedulingProfiler) {
          if ((flags & HookPassive) !== NoHookEffect) {
            markComponentPassiveEffectMountStarted(finishedWork);
          } else if ((flags & HookLayout) !== NoHookEffect) {
            markComponentLayoutEffectMountStarted(finishedWork);
          }
        }

        // 执行effect函数， 并保存effect函数的结果给destroy
        const create = effect.create;
        effect.destroy = create();

        if (enableSchedulingProfiler) {
          if ((flags & HookPassive) !== NoHookEffect) {
            markComponentPassiveEffectMountStopped();
          } else if ((flags & HookLayout) !== NoHookEffect) {
            markComponentLayoutEffectMountStopped();
          }
        }

      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
~~~
主要作用是：遍历所有的 `effect list`，然后依次执行对应的 `effect` 副作用函数，并将其结果保留在 `destroy` 函数中。
::: tip
`effect list` 是一个用于 `effectTag` 副作用列表容器，包含第一个节点：`firstEffect`， 和最后一个节点 `lastEffect`，通过 `next` 链接，在 `commit` 阶段，根据这些 `effectTag` 来判断执行的时机，从而对相应的 `DOM` 树进行更改。
:::

#### commitPassiveUnmountEffects 的流向

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/914fb844b67a4afaae073044ddca8bd6~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

最终的走向为 `commitHookEffectListUnmount` 函数， 来看看：

~~~ts
function commitHookEffectListUnmount(
  flags: HookFlags,
  finishedWork: Fiber,
  nearestMountedAncestor: Fiber | null,
) {
  const updateQueue= finishedWork.updateQueue;
  const lastEffect = updateQueue !== null ? updateQueue.lastEffect : null;
  if (lastEffect !== null) {
    const firstEffect = lastEffect.next;
    let effect = firstEffect;
    do {
      if ((effect.tag & flags) === flags) {
        // Unmount
        const destroy = effect.destroy;
        effect.destroy = undefined;
        if (destroy !== undefined) {
          if (enableSchedulingProfiler) {
            if ((flags & HookPassive) !== NoHookEffect) {
              markComponentPassiveEffectUnmountStarted(finishedWork);
            } else if ((flags & HookLayout) !== NoHookEffect) {
              markComponentLayoutEffectUnmountStarted(finishedWork);
            }
          }
           // 调用销毁逻辑
          safelyCallDestroy(finishedWork, nearestMountedAncestor, destroy);
          if (enableSchedulingProfiler) {
            if ((flags & HookPassive) !== NoHookEffect) {
              markComponentPassiveEffectUnmountStopped();
            } else if ((flags & HookLayout) !== NoHookEffect) {
              markComponentLayoutEffectUnmountStopped();
            }
          }
        }
      }
      effect = effect.next;
    } while (effect !== firstEffect);
  }
}
~~~
主要通过 `safelyCallDestroy` 走对应的销毁逻辑，这里要注意下，`effect` 的执行需要保证所有组件的 `effect` 的销毁函数执行完才能够执行。

因为多个组件可能共用一个 `ref`，如果不将销毁函数执行，改变 `ref` 的值，有可能会影响其他 `effect` 执行。

### 经典的闭包问题
阅读完 `useEffect` 源码后，再来看最为经典的 `React Hooks` 的闭包问题，就会变得异常简单。相信各位小伙伴一定都踩过坑，我们解决一下这个问题，同时巩固之前所学的知识。

先看下面这段代码：
~~~tsx
import { useState, useEffect } from "react";
import { Button, message } from "antd";
const Index = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount((v) => v + 1);
    }, 2000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      message.info(`当前的count为：${count}`);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <div>数字：{count}</div>
      <Button onClick={() => setCount((v) => v + 1)}>加1</Button>
    </div>
  );
};

export default Index;
~~~
例子很简单，进入页面，创建 `count`，在第一个 `useEffect` 中过 `2s` 给 `count` 加 `1`，并且在这 `2s` 中点击按钮两次，之后在第二个 `useEffect` 中过 `3s` 进行获取 `count` 值。

那么你觉得 `info` 中的 `count` 是 `0`、`1` 还是 `3` ？

在页面中可以看到，渲染的值变成了 `3`，但为什么在 `info` 中是 `0` 呢？这种情况就是最经典的闭包问题。

首先，在绝大多数的场景下，并不会出现闭包问题，只有在延迟调用的场景下（如：`setTimeout`、`setInterval`、`Promise.then` 等），才会出现闭包问题。接下来一起看看该如何解决。

我们先温习下上节的内容。当进行初始化后，`Hooks` 信息在 `Fiber` 中的 `memorizedState` 链表中，通过 `next` 链接，直到没有，则为 `null`。

案例中对应 `useState`、`useEffect`、`useEffect` 3 个 `hook`，自然对应链表中的 3 个 `memorizedState`，如：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/de42f00a12a74507af71a18cb24ff48c~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

当执行 `useEffect` 时，一直拿最初的 `count = 0` 来记录引用关系。再加上 `deps` 为空数组，此时只执行一次，所以无论点击多少次按钮，其结果都为 `0`。

#### 设置 deps 为 count
既然在引用时一直拿 `count = 0` 为引用条件，那么我们将 `deps` 的参数设置为 `count`，去监听 `count`，从而初始化定时器，是不是就 `ok` 了呢？

::: tip
问：为什么要在 `useEffect` 的 `return` 中清空定时器呢？

答：`useEffect` 对应的 `return` 就是源码中的 `destroy` 函数，如果不清空，那么还会执行之前的定时器。`setTimeout` 的效果可能不是很清晰，感兴趣的小伙伴可以换成 `setInterval` 试试。
:::

#### useLatest 解决
那么 `deps` 设置为 `count` 真的能够解决闭包问题吗？

我认为并不能彻底解决。在上述的问题中，`useEffect` 函数本身执行了 3 遍（2 次点击，1 次count+1），换句话说，只要 `count` 发生变化，就会执行 `useEffect` 函数。

如果现在的需求变为只想在 3s 后获取到最新值，之后再点击按钮，不获取最新值，该怎么办？

其实答案很简单，利用 `ref` 的高级用法——缓存数据，也就是 `useLatest` 去解决就 ok 了。如：
~~~ts
const countRef = useLatest(count);
useEffect(() => {
  const timer = setTimeout(() => {
    message.info(`当前的count为：${countRef.current}`);
  }, 3000);

}, []);
~~~

#### 结果何时为 1
我在一开始的问题中写了 3 个答案，分别是：0、1、3。0 和 3 讲解了原因，那么 1 是怎么出现的呢？答案是将 `setCount((v) => v + 1)` 替换为 `setCount(count + 1)`。


## 彻底搞懂 useMemo 和 useCallback
在 `React Hooks` 中，有专门针对优化的两个 `Hooks`，它们分别是 `useMemo` 和 `useCallback`。同时，它们哥俩也是最具争议的 `Hooks`，因为如果使用不当，非但达不到优化的效果，还有可能降低性能，让人头大。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/66412f174ccc4a9ca19b4182b760f8cc~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### useMemo、useCallback 源码
从源码角度上来看，`useMemo` 和 `useCallback` 并不复杂，甚至两者的源码十分相似，所以这里我们直接放到一起观看。

#### mountMemo/mountCallback（初始化）
~~~ts
// mountMemo
function mountMemo<T>(
  nextCreate: () => T, 
  deps: Array<mixed> | void | null,
): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

// mountCallback
function mountCallback<T>(
  callback: T,
  deps: Array<mixed> | void | null
): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
~~~
在初始化中，`useMemo` 首先创建一个 `hook`，然后判断 `deps` 的类型，执行 `nextCreate`，这个参数是需要缓存的值，然后**将值与 deps 保存到 memoizedState 上**。

而 `useCallback` 更加简单，**直接将 callback和 deps 存入到 memoizedState 里**。

#### updateMemo/updateCallback（更新）
~~~ts
// updateMemo
function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = updateWorkInProgressHook();
  // 判断新值
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      //之前保存的值
      const prevDeps: Array<mixed> | null = prevState[1];
      // 与useEffect判断deps一致
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

// updateCallback
function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
        //之前保存的值
      const prevDeps: Array<mixed> | null = prevState[1];
      // 与useEffect判断deps一致
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
~~~
在更新过程中，`useMemo` 实际上只做了一件事，就是通过判断两次的 `deps` 是否发生改变，如果发生改变，则重新执行 `nextCreate()`，将得到的新值重新复制给 `memoizedState`；如果没发生改变，则直接返回缓存的值。

而 `useCallBack` 也是同理。通过判断 `deps` 是否相等的 `areHookInputsEqual`，与 `useEffect` 中的一致，所以这里不做过多赘述。

`useMemo` 和 `useCallback` 的关系：

从源码角度上来看，无论初始化，亦或者更新，`useMemo` 比 `useCallback` 多了一步，即执行 `nextCreate()` 的步骤，那么说明 `useCallback(fn, deps)` 等价于 `useMemo(() => fn, deps)`。
::: tip
注意：`useMemo` 中的 `nextCreate()` 中如果引用了 `useState` 等信息，无法被垃圾机制回收（闭包问题），那么访问的属性有可能不是最新的值，所以需要将引用的值传递给 `deps`，则重新执行 `nextCreate()`。
:::

### 性能优化的几种方案
我们知道 `useMemo`、 `useCallback` 是函数组件提供的优化方案，除此之外，`React` 还提供其余两种优化方案，接下来一起来看看，有何异同。

#### 类组件的性能优化
在类组件中主要包含两种方式，分别是 **shouldComponentUpdate** 和 **PureComponent**。

**shouldComponentUpdate(nextProps, nextState)**：生命周期函数，通过比较 `nextProps（当前组件的 this.props）` 和 `nextState（当前组件的 this.state）`，来判断当前组件是否有必要继续执行更新过程。

如果 `shouldComponentUpdate` 返回的结果为 `true`，则继续执行对应的更新；如果为 `false`，则代表停止更新，用于减少组件的不必要渲染，从而优化性能。

**PureComponent**：与 `Component` 的用法基本一致，但 `PureComponent` 会对 `props` 和 `state` 进行浅比较，从而跳过不必要的更新（减少 `render` 的次数），提高组件性能。

举个例子：
~~~tsx
import { PureComponent } from "react";
import { Button } from "antd";

class Index extends PureComponent<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: {
        number: 0,
      },
    };
  }

  render() {
    const { data } = this.state;
    return (
      <>
        <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
        <div> 数字： {data.number}</div>
        <Button
          type="primary"
          onClick={() => {
            const { data } = this.state;
            data.number++;
            this.setState({ data });
          }}
        >
          数字加1
        </Button>
      </>
    );
  }
}

export default Index;
~~~
当点击按钮时，对应的数字并没有变化，这是因为 `PureComponent` 会比较两次的 `data` 对象，它会认为这种写法并没有改变原先的 `data`，所以不会改变。

解决方法：
~~~ts
this.setState({ data: {...data} })
~~~
#### 对比 shouldComponentUpdate 和 PureComponent
首先要特别明确 **shouldComponentUpdate 是生命周期的方法，而 PureComponent 是组件**。

换言之，在 `PureComponent` 也可以调取 `shouldComponentUpdate` 函数，如果调取，则会对新旧 `props`、`state` 进行 `shallowEqual` 浅比较，另外 **shouldComponentUpdate 的权重要高于 PureComponent**。

##### shallowEqual 浅比较
我们可以简单地看下对应的源码，其中有一个专门检查是否更新的函数：`checkShouldComponentUpdate`。

文件位置：`packages/react-reconciler/src/ReactFiberClassComponent.js`
~~~ts
function checkShouldComponentUpdate(workInProgress, ctor, oldProps, newProps, oldState, newState, nextContext) {
  const instance = workInProgress.stateNode;
  if (typeof instance.shouldComponentUpdate === 'function') {
    // shouldComponentUpdate 更新
    let shouldUpdate = instance.shouldComponentUpdate(
      newProps,
      newState,
      nextContext,
    );
    return shouldUpdate;
  }

   // 判断原型链是否存在isPureReactComponent
  if (ctor.prototype && ctor.prototype.isPureReactComponent) {
    return (
      !shallowEqual(oldProps, newProps) || !shallowEqual(oldState, newState)
    );
  }

  return true;
}
~~~
在 `PureComponent` 组件的原型链包含 `isPureReactComponent` 属性，同时也是通过这个属性来判断是否要进行浅比较。

**shallowEqual：**
~~~ts
function shallowEqual(objA: mixed, objB: mixed): boolean {
  // 这里的is和useEffect源码中的is一致，不做过多的介绍
  if (is(objA, objB)) {
    return true;
  }

  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  for (let i = 0; i < keysA.length; i++) {
    const currentKey = keysA[i];
    if (
      !hasOwnProperty.call(objB, currentKey) ||
      !is(objA[currentKey], objB[currentKey])
    ) {
      return false;
    }
  }

  return true;
}
~~~
**shallowEqual 浅比较流程：**
1. 首先比较新旧 `props/state` 是否相等，如果相等，则返回 `true`，不更新组件；
2. 接下来判断新旧 `props/state` 是否为对象，如果不是对象或为 `null` 的情况，则返回 `false`，更新组件；
3. 然后将新旧 `props/state` 通过 `Object.keys` 转化为数组，如果不相等，则证明有新增或减少，返回 `false`，更新组件；
4. 最后进行遍历（浅比较），如果有不相同的话，则返回 `false` 更新组件。

总的来说，`PureComponent` 通过自带的 `props` 和 `state` 的浅比较实现了 `shouldComponentUpdate()` ，这点是 `Component` 所不具备的。
::: tip
注意：`PureComponent` 可能会因深层的数据不一致而产生错误的否定判断，从而导致 `shouldComponentUpdate` 结果返回 `false`，界面得不到更新，要谨慎使用。
:::

#### React.memo 高阶组件
结合了 `pureComponent` 和 `componentShouldUpdate` 功能，会对传入的 `props` 进行一次对比，然后根据第二个函数返回值来进一步判断哪些 `props` 需要更新。

要注意 `React.memo` 是一个高阶组件，函数式组件和类组件都可以使用。

**`React.memo`接收两个参数：**
- 第一个参数：组件本身，也就是要优化的组件；
- 第二个参数：`(pre, next) => boolean`， `pre`：之前的数据，`next`：现在的数据，返回一个布尔值，若为 `true` 则不更新，为 `false` 更新。
::: tip
注意：如果 `React.memo` 的第二个参数不存在时，则按照**浅比较**的方式进行比较。
:::
举个例子：
~~~tsx
import { Component, memo } from "react";
import { Button } from "antd";

const Child = ({ number, msg = "" }: any) => {
  return (
    <>
      {console.log(`${msg}子组件渲染`)}
      <p>
        {msg}数字：{number}
      </p>
    </>
  );
};

const HOCChild = memo(Child, (pre, next) => {
  if (pre.number === next.number) return true;
  if (next.number < 7) return false;
  return true;
});

class Index extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      flag: true,
      number: 1,
    };
  }

  render() {
    const { flag, number } = this.state;
    return (
      <div>
        大家好，我是小杜杜，一起玩转Hooks吧！
        <Child number={number} />
        <HOCChild number={number} msg="被memo包的" />
        <Button type="primary" onClick={() => this.setState({ flag: !flag })}>
          状态切换{JSON.stringify(flag)}
        </Button>
        <Button
          type="primary"
          style={{ marginLeft: 8 }}
          onClick={() => this.setState({ number: number + 1 })}
        >
          数字加一：{number}
        </Button>
      </div>
    );
  }
}

export default Index;
~~~
在 `Index` 中，我们定义了 `number` 和 `flag` 两个变量，`number` 传入对应的 `Child`，而 `flag` 与 `Child` 并没有直接的关联。

当我们变更无关变量：`flag` 时，没有被 `memo` 包裹的子组件 `Child` 也会进行渲染，而包裹的则不会。同时 `memo` 的第二个参数可以主动控制是否渲染，当数字大于等于 `7` 时，则对包裹的组件停止渲染。
::: tip
注意：`memo` 的第二个参数的返回值与 `shouldComponentUpdate` 的返回值是相反的。这点要注意下。
:::

#### 优化方案的区别

优化方式 | 服务对象 | 返回结果
-----|------|-----
PureComponent | 类组件 | true：不渲染，false：渲染
memo | 类组件或函数组件 | true：渲染，false：不渲染
useMemo | 函数组件 | -

### useCallback 的性能问题
在所有的 `Hooks` 中，`useCallback` 可能是最具争议的一个 `hook`，根本原因还是性能问题。

首先 `useCallback` 可以记住函数，避免函数的重复生成，缓存后的函数传递给子组件时，可以避免子组件的重复渲染，从而提升性能。

那是不是说只要是函数，都加入 `useCallback`，性能都会得到提升呢？

实际不然，性能的提升还有一个前提：**其子组件必须通过 `React.memo` 包裹，或者必须使用 `shouldComponentUpdate` 处理**。

那么如果不进行配套使用，单独使用 `useCallback`，这种情况下性能不但没有提升，反而还会影响性能。

这是因为当一个函数执行完毕后，就会从调用函数的栈中被弹出，里面的内存也会被回收，即便在函数的内部再创建多个函数，最终也会被释放掉。

而**函数式组件的性能本身是非常快的**，它不同于 `Class` 组件，本身并没有 `renderProps` 等额外层级技术，所以相对轻量，而我们使用 `useCallack` 的时候，这本身就有一定的代价，相当于在原本的基础上增加了**闭包的使用、deps 对比的逻辑**，因此，盲目的使用反而会造成组件的负担。
~~~tsx
import { useState, useCallback, memo } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  let [count, setCount] = useState(0);
  let [number, setNumber] = useState(0);
  let [flag, setFlag] = useState(true);

  const add = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return (
    <>
      <div>数字number：{number}</div>
      <div>数字count：{count}</div>
      <TestButton onClick={() => setNumber((v) => v + 1)}>普通点击</TestButton>
      <TestButton onClick={add}>useCallback点击</TestButton>
      <Button
        style={{ marginLeft: 10 }}
        type="primary"
        onClick={() => setFlag((v) => !v)}
      >
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
在父组件（ `Index` ）中共有三个变量：`number`、`count`、`flag`，子组件（`TestButton`）封装了一个按钮，控制 `number` 和 `count` 的变化，其中 `count` 的变化 `add` 被 `useCallback` 包裹。

简要地分析下：`flag` 这个变量与 `count` 和 `number` 没有关系，同时也和 `TestButton` 没有关系，但它的更改，却能让没有被 `useCallBack` 包裹的组件刷新。

这是因为子组件认为两个函数并非相等，所以会触发更新；相反，用 `usecallBack` 包裹的组件传递的 `onClick` 还是之前缓存的 `add`，没有发生改变，所以不会触发更新。

同理，如果没有 `memo/shouldComponentUpdate` 的协助，就没有浅比较的逻辑，不管有没有 `useCallck` 的缓存，都会重新执行子组件。

所以说，`useCallback` 一定要配合 `memo/shouldComponentUpdate` 的协助，才能起到优化作用。

### useCallback 不推荐使用
对于 `useCallback`，我的建议是：**绝大部分场景不使用**。原因有以下几点：
1. **很难看到优化后的效果**：从效果上来讲，`useCallBack` 配合 `memo/shouldComponentUpdate` 确实能够阻止子组件的无关渲染，但这个渲染是 **render 的渲染，并非浏览器渲染**， 但 `js` 的运行要远远快于浏览器的 `Rendering` 和 `Painting`，再加上 `React` 本身提供 `diff` 算法，所以很难看到优化后的价值。
2. **使用起来较为麻烦**： 当判断是否使用时，要先考虑其价值是否值得，如果是案例中的场景，那么使用 `useCallback` 就完全没有必要。除非是特别复杂的组件，才会考虑单独使用。
3. **对新手不友好**： 要让 `useCallback` 起到优化作用，必须配合`memo/shouldComponentUpdate`，也就是说你要了解对应的 `API`，否则很容易出现 `bug`，其次 `useCallback` 本身存在闭包问题，很容易入坑。
4. **代码可读性变差**：使用 `useCallback` 的时候很容易出现“**无限套娃**”的情况，引用维护依赖关系时要变得小心翼翼，修改时要考虑的要素很多，一点没考虑到，就会出现 `bug`。

### useCallback 使用场景
1. 当设计一个`极其复杂的组件`，其函数体非常复杂时，优先考虑 `useCallback`。
2. 自定义 `Hooks` 的设计，因为在自定义 `Hooks` 里面的函数，不会依赖于引用它的组件里面的数据，同时如果函数传递给第三方使用，可以规避第三方组件的重复渲染。

### useMemo 适当使用
相对于 `useCallback`，`useMemo` 的收益就显而易见了，但 `useMemo` 也并不是无限制使用，在简单的场景下同样也不建议使用，比如：
~~~ts
a = 1
b = 2

c = a + b;
d = useMemo(() => a + b, [a, b])
~~~
很明显 `c` 是只计算 `a + b`，而 `d` 还要记录 `a` 和 `b` 的值，还要比较是否更改，这种情况下，`c` 的消耗明显小于 `d` 的消耗。

综上所述，**useMemo 推荐适当使用**。

## 全方面剖析 Ref
`Ref` 是我们工作中常用的 `API`，我们通常用它获取真实 `DOM` 元素和获取类组件实例层面上，但 `Ref` 本身还存在进阶的用法。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/abe0faa8977443f5848ead51329b93ec~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### Ref 的基本使用
关于 `Ref`，`React` 主要提供 **React.createRef（类组件） 和 React.useRef（函数组件）** 两种方式进行创建，会生成一个 `ref` 对象，结构为：
~~~ts
{
    current: null; 
}
~~~
::: tip
`current` 为 `ref` 对象获取的实际内容，可以是 `DOM` 元素、组件实例、其他元素。
:::
具体使用：
~~~ts
import { Component, createRef, useEffect, useRef } from "react";

// createRef: 类组件
class Index extends Component<any, any> {
  currentRef: any;
  constructor(props: any) {
    super(props);
    this.currentRef = createRef();
  }

  componentDidMount() {
    console.log(this.currentRef);
  }

  render() {
    return <div ref={this.currentRef}>class 中获取 Ref 的实例</div>;
  }
}

// useRef：函数组件
const Index = () => {
  const currentRef = useRef<any>();

  useEffect(() => {
    console.log(currentRef);
  }, []);

  return <div ref={currentRef}>函数中获取 Ref 的实例</div>;
};
~~~
打印结果：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/0a0c2c66dc3842a4af65e373d2d8cb83~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

我们发现类组件中的 `createRef` 和函数组件中的 `useRef` 用法基本相同。
::: tip
问：`DOM` 元素的获取一定要通过 `ref` 对象获取吗？

答：不一定，`React` 本身就提供多种方法去获取，从 `ts` 的类型去看看：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/7d4793df4d9a4d1ab6fc3efe95f69f50~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

可以看到除了 `ref` 对象的方式，还提供字符串（只能用在 `Class` 中）和回调函数的情况。但随着时间的发展，字符串的方式逐渐被淘汰。
:::

### createRef 源码
文件位置：`packages/react/src/ReactCreateRef.js`。
~~~ts
export function createRef(): RefObject {
  const refObject = {
    current: null,
  };
  return refObject;
}
~~~

### useRef 源码
`useRef` 的源码分为 `mountRef`（初始化） 和 `updateRef`（更新）阶段。

文件位置：`packages/react-reconciler/src/ReactFiberHooks`。
~~~ts
// 初始化
function mountRef<T>(initialValue: T): {current: T} {
  const hook = mountWorkInProgressHook();
  const ref = {current: initialValue};
  hook.memoizedState = ref;
  return ref;
}

// 更新
function updateRef<T>(initialValue: T): {current: T} {
  const hook = updateWorkInProgressHook();
  return hook.memoizedState;
}
~~~
从源码的角度来看，`createRef` 和 `useRef` 的逻辑非常简单，两者都是创建了一个对象，对象上的 `currrent` 属性，用来保存**通过 `ref` 属性获取的 DOM 元素、组件实例、数据等**，以便后续使用。

但两者的**保存位置不同**，`createRef` 保存的数据通过实例 `instance` 维护，而 `useRef` 通过 `memoizedState` 维护。

### useRef 的诞生
在上文中，我们发现 ，`createRef` 和 `useRef` 的底层逻辑实际上是相差无几的。那么就产生了这样一个疑问：为什么不能直接在函数组件中使用 `createRef` 呢？而是会多出一个新的 `API` 呢？

假设我们在函数组件中使用 `createRef`，来看看它与 `useRef` 具体有什么不同：
~~~tsx
import { useState, useRef, createRef } from "react";
import { Button } from "antd";

const Index = () => {
  const [count, useCount] = useState(0);

  const ref = useRef(0);
  const cRef = createRef(0);

  if (!ref.current) {
    ref.current = count;
  }

  if (!cRef.current) {
    cRef.current = count;
  }

  return (
    <>
      <div>数字：{count}</div>
      <div>useRef 包裹的数字： {ref.current}</div>
      <div>createRef 包裹的数字： {cRef.current}</div>
      <Button type="primary" onClick={() => useCount((v) => v + 1)}>
        点击加1
      </Button>
    </>
  );
};

export default Index;
~~~
从案例来看，`useRef` 和 `createRef` 创建的 `ref` 对象只有在没有值的情况下，才会被 `count` 的赋值，但在实际效果中，每次点击按钮，`createRef` 创建的 `cRef` 仍然在变化，这就说明每次渲染时，`cRef` 的值始终**不存在**。

这是因为类组件和函数组件的**机制不同**，通俗来讲就是**生命周期**的问题。

在类组件中是将生命周期分离出来的，有明确的 `componentDidMount`、`componentDidUpdate` 等 `API`，`createRef` 在初始化的过程中被初始化，在更新过程中并不会初始化类组件的实例，所以在非手动更改的情况下，`createRef` 的值并不会改变。

但函数组件则不同，虽然被说是组件，但其行为仍是函数，在**渲染和更新时，仍然会重新执行、重新创建、对所有的变量和表达式进行初始化**。因此，`createRef` 每次都会被执行，对应的值也为 `null`，每次都会被重新赋值。

为了解决这个问题，`useRef`诞生了。通过与函数组件对应的 `Fiber` 建立关联，将 `useRef` 创建的 `ref` 对象挂载到对应的 `Fiber` 上，**只要组件不被销毁，对应 Fiber 上的对象就一直存在**，无论函数组件如何重新执行，都能拿到对应的 `ref` 值，这也是函数组件能拥有自己状态的根本原因。

经过上面的总结，我们得出 **createRef 只能运用在类组件，useRef 只能运用在函数组件上**。

### useRef 高阶用法
通过上面介绍了 `ref` 的基本用法，`createRef` 在函数组件中出现的问题，所衍生出 `useRef`。除此之外，在一些特定的场合中需要 `useRef` 配合完成，使项目中写的组件更加灵活多变。

#### 缓存数据：对比 useState
`useRef` 除了获取 `DOM` 元素之外，还可以接受一些其他元素，用来保存数据，比如之前讲解的 `useLatest` 就是活用了这一特性。

既然 `useRef` 可以缓存数据，而 `useState` 的作用也是缓存数据，那么可以用 `useRef` 来替换 `useState` 吗？两者都可以缓存数据，那么又有何区别呢？

先做一个计数器的功能，来对比下：
~~~tsx
import { useState, useRef } from "react";
import { Button } from "antd";

const Index: React.FC<any> = () => {
  const [count, setCount] = useState(0);
  const countRef = useRef<number>(0);

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <div>useState的count：{count}</div>
      <Button type="primary" onClick={() => setCount((v) => v + 1)}>
        useState点击
      </Button>
      <div>ref的count：{countRef.current}</div>
      <Button
        type="primary"
        onClick={() => (countRef.current = countRef.current + 1)}
      >
        useRef点击
      </Button>
    </>
  );
};

export default Index;
~~~
我们发现，`useState` 的 `count` 会随着点击按钮的变化而变化，`useRef` 的 `count` 并不会变化，但再次点击 `useState` 时，`useRef` 的 `count` 产生了变化。

这说明 `useRef` 点击时，**值发生了改变，但视图未发生改变**，换句话说 **useRef 并没有能力去触发 render，而 useState 能触发 render**，这是两者最主要的区别。

其次，在更改值的时候，`useState` 是通过 `setCount` 去改变的，这也就说明 `count` 本身是**不可改变的**，而 `useRef` 是直接更改值，属于**可变值**。

那么是否可变，是否影响 `React` 的渲染呢？答案是肯定的，因为在渲染阶段时，`React` 并没有办法发现 `ref.current` 是何时发生改变的，这样在读取值的时候就会变得难以预测，所以在渲染阶段时，尽量使用 `state`。

总的来说，`useState` 适用于**自身组件的状态值**，而 `useRef` 更适合存储**外部通信的值**，并且这些值不会影响 `render` 的逻辑。比如在 `setTimeout`、`setInterval` 用到的值。

#### 跨层级获取实例与通信
我们可以通过 `forwardRef` 转发 `ref` 来获取子组件的实例，获取一些方法、值，并且可以自定义设置 `ref` 的值。如：
~~~tsx
import { useRef, useEffect, Component, forwardRef } from "react";
class Son extends Component {
  render() {
    return <div>我是孙组件</div>;
  }
}

class Child extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  div: any = null;
  son: any = null;
  componentDidMount() {
    this.props.forwardRef.current = {
      div: this.div, // 子组件的div
      child: this, // 子组件的实例
      son: this.son, // 孙组件的实例
    };
  }

  render() {
    return (
      <>
        <div ref={(node) => (this.div = node)}>我是子组件</div>
        <Son ref={(node) => (this.son = node)} />
      </>
    );
  }
}

const ForwardChild = forwardRef((props, ref) => (
  <Child {...props} forwardRef={ref} />
));

const Index = () => {
  const ref = useRef(null);

  useEffect(() => {
    console.log(ref.current);
  }, []);

  return (
    <>
      <div>大家好，我是小杜杜，一起玩转Hooks吧！</div>
      <ForwardChild ref={ref} />
    </>
  );
};

export default Index;
~~~
打印下 `Index` 中的 `ref.current`：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/a27cf85ac7054aa5ae5fcfe4c36b135e~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

在此场景中，在 `Index` 中获取到子组件 `Child` 的信息，包括 `props`、`state` 等信息，同时也可以获取到孙组件 `Son` 的信息。当我们拿到对应的实例后，就可以做一些特定的事情，比如**跨层级通信**。
::: tip
注意：这里使用的 `Child` 和 `Son` 是 `Class` 组件，不能为函数式组件，原因是函数式组件并没有实例，如果想要获取函数式组件的方法，可使用 `useImperativeHandle`，具体的使用在第三章中介绍过，就不做过多的赘述。
:::

### 探索 Ref 的奥秘
首先，我们要特别明确一点：`createRef` 和 `useRef` 属于对 `Ref` 属性的创建和使用，而非是 `Ref` 属性。 换言之，`ref` 属性和 `useRef` 是两个完全不同的东西，我们不能混为一谈。

当然，为了更好地掌握 `useRef`，我们应该探索 `Ref` 属性，在 `React` 中是如何处理 `ref` 的，以此彻底掌握相关的 `Ref` 问题。

关于 `ref` 属性，大体分为四段操作，分别是：**置空操作**、**标记操作**、**更新操作**、**卸载操作**。

在上文中提及到 `ref` 共用三种方式来获取，其中通过回调函数的情况有一个特殊的现象，我们先来看看：
~~~tsx
import { Button } from "antd";
import { useState } from "react";

const Index = () => {
  const [_, setCount] = useState<number>(0);

  return (
    <>
      <div
        ref={(node) => {
          console.log(node);
        }}
      >
        大家好，我是小杜杜，一起玩转Hooks吧！
      </div>
      <Button type="primary" onClick={() => setCount((v) => v + 1)}>
        点击
      </Button>
    </>
  );
};

export default Index;
~~~
我们发现点击按钮，刷新视图的时候，`node` 会获取两次，且第一次为 `null`，这是为什么呢？

从函数式组件的时机来看，其根本还是因为生命周期的问题，我们看下 `Hooks` 的生命周期图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/658eda796d934b0f8bcfecc6b73b869d~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

可以看到，在 `Render phase`（渲染阶段） 是不允许做副作用，原因是在此阶段可能会被 `React` 引擎随时取消或重新渲染。

而修改 `Ref` 属于副作用操作，因此不能在 `Render` 阶段，而是在 `Commit` 阶段处理，或者在 `setTimeout` 中处理（脱离 `React` 的机制）。

换言之，**所有关于 `Ref` 的操作，处理的方式都在 `Commit` 阶段**。
::: tip
但特别要注意，函数式组件是不允许 `ref` 属性的，也就是说，处理 `Ref` 的逻辑在 `Class` 组件和原生组件上。
:::

#### 浅谈 commitRootImpl
在 `useEffect` 源码的时候涉及过 `commitRootImpl`，从 `commit` 阶段的入口 `commitRoot` 到达 `commitRootImpl`。

源码位置：`packages/react-reconciler/src/ReactFiberWorkLoop.js`。

`commitRootImpl` 包含很多东西，主要包含三个阶段（这里只是提及下，感兴趣的可自行研究，在这里主要看 `Ref` 的处理逻辑）：
~~~ts
function commitRootImpl(){
    ...
    // BeforeMutation 阶段
    commitBeforeMutationEffects(root, finishedWork);
    
    // Mutation 阶段
    commitMutationEffects(root, finishedWork, lanes);
    
    // Layout 阶段
    commitLayoutEffects(finishedWork, root, lanes);
}
~~~
1. **BeforeMutation 阶段**： 进行深度优先遍历，找到最后一个带有标识的 `Fiber` 作为起点（子 => 父 查找），然后会调用一个实例 `instance` 的 `getSnapshotBeforeUpdate` 方法，并生成快照对象，之后作为 `componentDidUpdate` 的第三个参数，这里主要针对的是 `Class` 组件的操作，对其他类型的组件并不做处理。
2. **Mutation 阶段**： 此阶段为核心阶段，是真正进行更新 `DOM` 树的阶段。 是真正处理 `Class` 组件、函数式组件以及原生组件的地方，同时也是增加、删除、更新的处理阶段。
3. **Layout 阶段**： 它与 `BeforeMutation` 阶段一样，也是先进行深度优先遍历，找到最后一个带有标识的 `Fiber` 作为起点。之后会根据不同的组件处理不同的逻辑，比如函数式组件处理 `useLayoutEffect` 的回调函数。经历过此步骤后就会更新 `ref`，最终处理 `useEfect`，也就是在 `useEffect` 章节中的 `Scheduler（异步）` 调度器了。

画个简易版的图，来帮助我们理解：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/8f45ad10ce494ac4a9d094055e201164~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

接下来，我们继续探索 `React` 对 `ref` 的处理方式。

#### safelyDetachRef 置空/卸载操作
在更新的过程中，首先在 `conmmit` 的 `Mutation` 阶段，会将 `ref` 重置为 `null`，最终在 `safelyDetachRef` 函数中处理，如：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/65c39270983747cb94bee7ab5e62eddc~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

同时，`safelyDetachRef` 也是卸载操作，有关 `Ref` 的卸载也是在此函数中完成。在 `v16` 的版本中，置空操作是 `commitDetachRef` 函数，这点有所不同。

::: tip
问：`ref` 的获取有字符串、函数、 `ref` 对象三种情况，但在 `safelyDetachRef` 函数中，只判断了是函数和 `ref` 对象的情况，那么字符串的形式，是如何走的？

答：当 `ref` 是字符串的情况时，实际上会走函数的方式，这是因为之前有统一处理 `ref` 的地方。

文件位置：`packages/react-reconciler/src/ReactChildFiber.js`。
~~~ts
const ref = function(value: mixed) {
  const refs = resolvedInst.refs;
  if (value === null) {
    delete refs[stringRef];
  } else {
    refs[stringRef] = value;
  }
};
~~~
也就是说，当 `ref` 是字符串类型时，会自动转化为函数，绑定在组件的实例的 `refs` 属性下。
:::

#### markRef 标记操作
我们要知道 `Ref` 的更新是有条件的，**并不是每一次 `Fiber` 更新都会让 `ref` 进行更新，只有具备 `Ref tag` 的时候才会更新**。

所以，我们首先要明白 `React` 是如何打上 `Ref tag` 的。主要是在 `markRef` 函数中。
~~~ts
function markRef(current: Fiber | null, workInProgress: Fiber) {
  const ref = workInProgress.ref;
  if (
    (current === null && ref !== null) || // 初始化
    (current !== null && current.ref !== ref) // 更新时
  ) {
    // Schedule a Ref effect
    workInProgress.flags |= Ref;
    workInProgress.flags |= RefStatic;
  }
}
~~~
当然，`markRef` 是在 `Class` 组件或原生组件的更新过程中进行调用，同时分为两种情况，一种是初始化，另一种是更新中发生变化，

#### commitAttachRef 更新操作
阅读完标记操作后，再来看看 `Ref` 具体的更新逻辑。

`Ref` 的更新操作在 `Layout` 阶段，在更新真实元素节点之后，会进行有关 `Ref` 的更新。我们先来看下源码：
~~~ts
// 更新条件
if (flags & Ref) {
  safelyAttachRef(finishedWork, finishedWork.return);
}

// safelyAttachRef
function safelyAttachRef(current: Fiber, nearestMountedAncestor: Fiber | null) {
  try {
    commitAttachRef(current);
  } catch (error) {
    captureCommitPhaseError(current, nearestMountedAncestor, error);
  }
}

// commitAttachRef 更新操作
function commitAttachRef(finishedWork: Fiber) {
  const ref = finishedWork.ref;
  if (ref !== null) {
    const instance = finishedWork.stateNode;
    let instanceToUse;
    switch (finishedWork.tag) {
      case HostResource:
      case HostSingleton:
      case HostComponent: // 原生元素
        instanceToUse = getPublicInstance(instance);
        break;
      default: // 类组件
        instanceToUse = instance;
    }
    if (enableScopeAPI && finishedWork.tag === ScopeComponent) {
      instanceToUse = instance;
    }
    if (typeof ref === 'function') {
      if (shouldProfile(finishedWork)) {
        try {
          startLayoutEffectTimer();
          finishedWork.refCleanup = ref(instanceToUse);
        } finally {
          recordLayoutEffectDuration(finishedWork);
        }
      } else {
        finishedWork.refCleanup = ref(instanceToUse);
      }
    } else {
      ref.current = instanceToUse;
    }
  }
}
~~~
当具备更新条件后会走到 `safelyAttachRef` 中，而 `safelyAttachRef` 中的主体是 `commitAttachRef` 函数。

`commitAttachRef` 函数主要判断是类组件还是原生组件，通过 `tag` 去判断，其中 `HostComponent` 是原生组件（在之前的 `Fiber` 中介绍过），`Class` 组件是直接使用的实例 `instance`，剩余的步骤与 `safelyDetachRef` 类似。

#### 出现的原因
了解完 `Ref` 的相关操作后，我们再来看看一开始的问题。

之所以会打印两次，是因为一次在 `DOM` 更新之前（即置空操作），另一次是 `DOM` 更新之后（即更新操作）。

说白了，在每次更新的时候，`markRef` 认为 `current.ref !== ref`，就会打上新的标签，导致在 `commit` 阶段会更新 `ref`，从而会打印两次。

## 探索 useSyncExternalStore 的神秘面纱