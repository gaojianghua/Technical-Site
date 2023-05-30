# RxJS
## 简介
- RxJS 是一套藉由 Observable sequences 来组合异步行为和事件基础程序的 Library！
- RxJS 提供了一套完整的异步解決方案，让我们在面对各种异步行为，不管是 Event, AJAX, 还是 Animation 等，我们都可以使用相同的 API (Application Programming Interface) 做开发。

## 异步所面临的问题
- 竞态条件(Race Condition)
  > 每当我们对同一个资源同时做多次的异步存取时，就可能发生 Race Condition 的问题。比如说我们发了一个 Request 更新使用者资料，然后我们又立即发送另一个 Request 取得使用者资料，这时第一个 Request 和第二个 Request 先后顺序就会影响到最終接收到的結果不同，这就是 Race Condition。
- 内存泄漏(Memory Leak)
  > Memory Leak 是最常被大家忽略的一点。原因是在传统网站的行为，我们每次换页都是整页重刷，并重新执行 JavaScript，所以不太需要理会内存的问题！但是当我们希望将网站做得像应用程序时，这件事就变得很重要。例如做 SPA (Single Page Application) 网站时，我们是透过 JavaScript 来达到切换页面的内容，这时如果有对 DOM 注册监听事件，而没有在适当的时机点把监听的事件移除，就有可能造成 Memory Leak。比如说在 A 页面监听 body 的 scroll 事件，但页面切换时，没有把 scroll 的监听事件移除。
- 复杂的状态(Complex State)
  > 当有异步行为时，应用程序的状态就会变得非常复杂！比如说我们有一支付費用户才能播放的影片，首先可能要先抓取这部影片的资讯，接着我们要在播放时去验证使用者是否有权限播放，而使用者也有可能再按下播放后又立即按了取消，而这些都是异步执行，这时就会有各种复杂的状态需要处理。
- 异常处理(Exception Handling)
  > JavaScript 的 try/catch 可以捕捉同步的异常，但异步的代码就没这么容易，尤其当我们的异步行为很复杂时，这个问题就愈加明显。
## 异步 API
- 我们除了要面对异步会遇到的各种问题外，还要为很多不同的 API 而烦恼。
  1. DOM Events
  2. XMLHttpRequest
  3. Fetch
  4. WebSockets
  5. Server Send Events
  6. Service Worker
  7. Node Stream
  8. Timer
  > 上面列的 API 都是异步的，但他们都有各自的 API 及写法！如果我们使用 RxJS，上面所有的 API 都可以通过 RxJS 來处理，就能用同样的 API 操作 (RxJS 的 API)。
- 示例: 监听点击事件(click event)，但点击一次之后不再监听。
  ~~~js
  // 原生JS
  var handler = (e) => {
	console.log(e);
	document.body.removeEventListener('click', handler); // 结束监听
  }
  // 注册监听
  document.body.addEventListener('click', handler);
  ~~~
  ~~~js
  // RxJS
  Rx.Observable
	.fromEvent(document.body, 'click') // 注册监听
	.take(1) // 只取一次
	.subscribe(console.log);
  ~~~
## 函数式编程(Functional Programming)的基本观念
- 重要特性
  > 函数式编程都是 表达式 (Expression) 不会是 陈述式(Statement)
- 表达式
  ~~~js
  // 表达式是一個運算過程，一定會有返回值，例如執行一個函数
  add(1, 3)
  ~~~
- 陈述式
  ~~~js
  // 陈述式是表现某个行为，例如一个值赋值給一个变量
  a = 1
  ~~~
- 纯函数(Pure Function)
  > 是指一个 function 给予相同的參数，永远会返回相同的返回值，并且没有任何显著的副作用(Side Effect)

  > 函数式编程强调没有 Side Effect，也就是 function 要保持纯粹，只做运算并返回一个值，没有其他额外的行为。
- 优势
  1. 可读性高
      > 当我们通过一系列的函数封裝的操作过程，代码能变得非常的简洁且可读性极高，例如下面的例子：
      ~~~js
      [9, 4].concat([8, 7]) // 合并数组
        .sort()  // 排序
        .filter(x => x > 5) // 过滤出大于 5 的
      ~~~
  2. 可维护性高
      > 因为 Pure function 等特性，执行结果不依赖外部状态，且不会对外部环境有任何操作，使 Functional Programming 能更好的除错及编写单元测试。
  3. 易于并发/并行处理
      > 易于做并发/并行(Concurrency/Parallel)处理，因为我们基本上只做运算不碰 I/O，再加上没有 Side Effect 的特性，所以不用担心 deadlock 等问题。

## Observable
> 要理解 Observable 之前，我们必須先谈谈两个设计模式(Design Pattern)，迭代器模式(Iterator Pattern) 跟 观察者模式(Observer Pattern)。
- 迭代器模式(Iterator Pattern)
  > Iterator 是一个物件，它就像是一个指针(pointer)，指向一个资料结构并产生一个序列(sequence)，这个序列会有资料结构中的所有元素(element)。
  * 原生 JS 建立 iterator
  ~~~js
  var arr = [1, 2, 3];
  var iterator = arr[Symbol.iterator]();
  iterator.next();
  // { value: 1, done: false }
  iterator.next();
  // { value: 2, done: false }
  iterator.next();
  // { value: 3, done: false }
  iterator.next();
  // { value: undefined, done: true }
  ~~~
  * JavaScript 的 Iterator 只有一个 next 方法，这个 next 方法只会回传这两种結果：
      1. 在最后一个元素前： { done: false, value: elem }
      2. 在最后一个元素之后： { done: true, value: undefined }
  * 实现一个迭代器模式
    ~~~js
    // ES5 的写法
    function IteratorFromArray(arr) {
      if(!(this instanceof IteratorFromArray)) {
        throw new Error('請用 new IteratorFromArray()!');
      }
      this._array = arr;
      this._cursor = 0;	
    }
    IteratorFromArray.prototype.next = function() {
      return this._cursor < this._array.length ?
        { value: this._array[this._cursor++], done: false } :
        { done: true };
    }
    // ES6 的写法
    class IteratorFromArray {
	  constructor(arr) {
        this._array = arr;
        this._cursor = 0;
      }
      next() {
        return this._cursor < this._array.length ?
          { value: this._array[this._cursor++], done: false } :
          { done: true };
      }
    }
    ~~~
- 观察者模式(Observer Pattern)
  ~~~js
  // 最常见的例子，DOM的事件监听
  function clickHandler(event) {
	console.log('user click!');
  }
  document.body.addEventListener('click', clickHandler)
  ~~~
  > 在上面的代码中，我们先创建了一个 clickHandler 函数，再用 DOM 物件 (范例是 body) 的 addEventListener 来监听点击(click)事件，每次使用者在 body 点击就会执行一次 clickHandler，并把相关的内容(event)带进來！这就是观察者模式，我们可以对某件事注册监听，并在事件发生时，自动执行我们注册的监听者(listener)。
  * 实现一个观察者模式
  ~~~js
  // ES5 写法
  function Producer() {
     // 这个 if 只是避免使用者不小心把 Producer 当作函数來调用。
	    if(!(this instanceof Producer)) {
	        throw new Error('請用 new Producer()!');
	    // 仿 ES6 行为可用： throw new Error('Class constructor Producer cannot be invoked without 'new'')
	    }
     this.listeners = [];
  }
  // 加入监听的方法
  Producer.prototype.addListener = function(listener) {
    if(typeof listener === 'function') {
      this.listeners.push(listener)
    } else {
      throw new Error('listener 必須是 function')
    }
  }
  // 移除监听的方法
  Producer.prototype.removeListener = function(listener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1)
  }
  // 发送通知的方法
  Producer.prototype.notify = function(message) {
      this.listeners.forEach(listener => {
      listener(message);
    })
  }
  // ES6 写法
  class Producer {
    constructor() {
        this.listeners = [];
    }
    addListener(listener) {
        if(typeof listener === 'function') {
			this.listeners.push(listener)
        } else {
			throw new Error('listener 必須是 function')
        }
    }
    removeListener(listener) {
      this.listeners.splice(this.listeners.indexOf(listener), 1)
    }
    notify(message) {
      this.listeners.forEach(listener => {
        listener(message)
      })
    }
  }
  ~~~
  ~~~js
  // 注册使用
  var egghead = new Producer(); 
  // new 出一个 Producer 实例叫 egghead
  function listener1(message) {
    console.log(message + 'from listener1');
  }
  function listener2(message) {
    console.log(message + 'from listener2');
  }
  egghead.addListener(listener1); // 注册监听
  egghead.addListener(listener2);
  egghead.notify('A new course!!') // 当某件事情发生时，执行
  ~~~
