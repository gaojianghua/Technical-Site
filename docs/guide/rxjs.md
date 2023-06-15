# RxJS
## 简介
- RxJS 是一套藉由 Observable sequences 来组合异步行为和事件基础程序的 Library！
- RxJS 提供了一套完整的异步解决方案，让我们在面对各种异步行为，不管是 Event, AJAX, 还是 Animation 等，我们都可以使用相同的 API (Application Programming Interface) 做开发。

## 异步所面临的问题
- 竞态条件(Race Condition)
  > ***每当我们对同一个资源同时做多次的异步存取时，就可能发生 Race Condition 的问题。比如说我们发了一个 Request 更新使用者资料，然后我们又立即发送另一个 Request 取得使用者资料，这时第一个 Request 和第二个 Request 先后顺序就会影响到最终接收到的结果不同，这就是 Race Condition。***
- 内存泄漏(Memory Leak)
  > ***Memory Leak 是最常被大家忽略的一点。原因是在传统网站的行为，我们每次换页都是整页重刷，并重新执行 JavaScript，所以不太需要理会内存的问题！但是当我们希望将网站做得像应用程序时，这件事就变得很重要。例如做 SPA (Single Page Application) 网站时，我们是透过 JavaScript 来达到切换页面的内容，这时如果有对 DOM 注册监听事件，而没有在适当的时机点把监听的事件移除，就有可能造成 Memory Leak。比如说在 A 页面监听 body 的 scroll 事件，但页面切换时，没有把 scroll 的监听事件移除。***
- 复杂的状态(Complex State)
  > ***当有异步行为时，应用程序的状态就会变得非常复杂！比如说我们有一支付費用户才能播放的影片，首先可能要先抓取这部影片的资讯，接着我们要在播放时去验证使用者是否有权限播放，而使用者也有可能再按下播放后又立即按了取消，而这些都是异步执行，这时就会有各种复杂的状态需要处理。***
- 异常处理(Exception Handling)
  > ***JavaScript 的 try/catch 可以捕捉同步的异常，但异步的代码就没这么容易，尤其当我们的异步行为很复杂时，这个问题就愈加明显。***
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
  > 上面列的 API 都是异步的，但他们都有各自的 API 及写法！如果我们使用 RxJS，上面所有的 API 都可以通过 RxJS 来处理，就能用同样的 API 操作 (RxJS 的 API)。
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
  // 表达式是一个运算过程，一定会有返回值，例如执行一个函数
  add(1, 3)
  ~~~
- 陈述式
  ~~~js
  // 陈述式是表现某个行为，例如一个值赋值给一个变量
  a = 1
  ~~~
- 纯函数(Pure Function)
  > 是指一个 function 给予相同的参数，永远会返回相同的返回值，并且没有任何显着的副作用(Side Effect)

  > 函数式编程强调没有 Side Effect，也就是 function 要保持纯粹，只做运算并返回一个值，没有其他额外的行为。
- 优势
  1. 可读性高
      > 当我们通过一系列的函数封装的操作过程，代码能变得非常的简洁且可读性极高，例如下面的例子：
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
要理解 Observable 之前，我们必须先谈谈两个设计模式(Design Pattern)，迭代器模式(Iterator Pattern) 跟 观察者模式(Observer Pattern)。
- 迭代器模式(Iterator Pattern)
  > Iterator 是一个物件，它就像是一个指针(pointer)，指向一个数据结构并产生一个序列(sequence)，这个序列会有数据结构中的所有元素(element)。
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
  * JavaScript 的 Iterator 只有一个 next 方法，这个 next 方法只会回传这两种结果：
      1. 在最后一个元素前： `{ done: false, value: elem }`
      2. 在最后一个元素之后： `{ done: true, value: undefined }`
  * 实现一个迭代器模式
    ~~~js
    // ES5 的写法
    function IteratorFromArray(arr) {
      if(!(this instanceof IteratorFromArray)) {
        throw new Error('请用 new IteratorFromArray()!');
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
    > Iterator Pattern 虽然很单纯，但同时带来了两个优势，第一它渐进式取得资料的特性可以拿来做延迟运算(Lazy evaluation)，让我们能用它来处理大数据结构。第二因为 iterator 本身是序列，所以可以实现所有队列的运算方法像 map, filter... 等！
  * 实现一个 map 方法
    ~~~js
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
      map(callback) {
        const iterator = new IteratorFromArray(this._array);
        return {
          next: () => {
            const { done, value } = iterator.next();
            return {
              done: done,
              value: done ? undefined : callback(value)
            }
          }
        }
      }
    }
    var iterator = new IteratorFromArray([1,2,3]);
    var newIterator = iterator.map(value => value + 3);
    newIterator.next();
    // { value: 4, done: false }
    newIterator.next();
    // { value: 5, done: false }
    newIterator.next();
    // { value: 6, done: false }
    ~~~
  - 延迟运算(Lazy evaluation)
    > 延迟运算，或说 call-by-need，是一种运算策略(evaluation strategy)，简单来说我们延迟一个表达式的运算时机直到真正需要它的值在做运算。
  - 用 generator 实现 iterator 来举一个例子
    ~~~js
    function* getNumbers(words) {
      for (let word of words) {
        if (/^[0-9]+$/.test(word)) {
          yield parseInt(word, 10);
        }
      }
    }
    const iterator = getNumbers('30 天精通 RxJS');
	
    iterator.next();
    // { value: 3, done: false }
    iterator.next();
    // { value: 0, done: false }
    iterator.next();
    // { value: undefined, done: true }
    ~~~
    > 这里我们写了一个函数用来抓取字符串中的数字，在这个函数中我们用 for...of 的方式来取得每个字符并用正则表示式来判断是不是数值，如果为真就转成数值并回传。当我们把一个字符串丟进 getNumbers 函数时，并没有马上运算出字符串中的所有数字，必须等到我们执行 next() 时，才会真的做运算，这就是所谓的延迟运算(evaluation strategy)
- 观察者模式(Observer Pattern)
  ~~~js
  // 最常见的例子，DOM的事件监听
  function clickHandler(event) {
	console.log('user click!');
  }
  document.body.addEventListener('click', clickHandler)
  ~~~
  > 在上面的代码中，我们先创建了一个 clickHandler 函数，再用 DOM 物件 (范例是 body) 的 addEventListener 来监听点击(click)事件，每次使用者在 body 点击就会执行一次 clickHandler，并把相关的内容(event)带进来！这就是观察者模式，我们可以对某件事注册监听，并在事件发生时，自动执行我们注册的监听者(listener)。
  * 实现一个观察者模式
  ~~~js
  // ES5 写法
  function Producer() {
     // 这个 if 只是避免使用者不小心把 Producer 当作函数来调用。
	    if(!(this instanceof Producer)) {
	        throw new Error('请用 new Producer()!');
	    // 仿 ES6 行为可用： throw new Error('Class constructor Producer cannot be invoked without 'new'')
	    }
     this.listeners = [];
  }
  // 加入监听的方法
  Producer.prototype.addListener = function(listener) {
    if(typeof listener === 'function') {
      this.listeners.push(listener)
    } else {
      throw new Error('listener 必须是 function')
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
			throw new Error('listener 必须是 function')
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
- Observable 释义
  * 在了解 Observer 跟 Iterator 后，不知道大家有没有发现其实 Observer 跟 Iterator 有个共通的特性，就是他们都是 渐进式(progressive) 的取得资料，差別只在于 Observer 是生产者(Producer)推送资料(push)，而 Iterator 是消費者(Consumer)要求资料(pull)!
   
  * Observable 其实就是这两个 Pattern 思想的结合，Observable 具备生产者推送资料的特性，同时能像序列，拥有序列处理资料的方法(map, filter...)！
   
  * 更简单的来说，Observable 就像是一个序列，里面的元素会随着时间推送
## 建立 Observable
- 一个核心三个重点
  > - 一个核心： Observable 再加上相关的 操作符Operators(map, filter...)
  > - 三个重点： Observer Subject Schedulers
- 创建 Observable
  <br>
  建立 Observable 的方法有非常多种，其中 create 是最基本的方法。create 方法在 Rx.Observable 物件中，要传入一个 callback function ，这个 callback function 会接收一个 observer 参数
  ~~~js
  var observable = Rx.Observable
    .create(function(observer) {
      observer.next('Jerry'); // RxJS 4.x 以前的版本用 onNext
      observer.next('Anna');
    })
  // 订阅这个 observable	
  observable.subscribe(function(value) {
    console.log(value);
  })
  ~~~
  当我们订阅这个 observable，他就会顺序送出 'Jerry' 'Anna' 两个字符串。
  <br><br>
  这里有一个重点，很多人认认为 RxJS 是在做异步处理，所以所有行为都是异步的。但其实这个观念是错的，RxJS 确实主要在处理异步行为没错，但也同时能处理同步行为，像是上面的代码就是同步执行的。
  ~~~js
  var observable = Rx.Observable
    .create(function(observer) {
      observer.next('Jerry'); // RxJS 4.x 以前的版本用 onNext
	  observer.next('Anna');
    })

  console.log('start');
  observable.subscribe(function(value) {
    console.log(value);
  });
  console.log('end');
  // 上面的代码会打印：
  start
  Jerry
  Anna
  end
  // 而不是：
  start
  end
  Jerry
  Anna
  ~~~
  所以很明显的上面这段代码是同步执行的，当然我们也可以拿它来处理异步的行为！
  ~~~js
  var observable = Rx.Observable
    .create(function(observer) {
      observer.next('Jerry'); // RxJS 4.x 以前的版本用 onNext
	    observer.next('Anna');
        setTimeout(() => {
          observer.next('RxJS 30 Days!');
		}, 30)
	})

  console.log('start');
  observable.subscribe(function(value) {
    console.log(value);
  });
  console.log('end');
  // 执行后会打印：
  start
  Jerry
  Anna
  end
  RxJS 30 Days!
  ~~~
  >  从上述的代码能看得出来 Observable 同时可以处理同步与异步的行为！
- 观察者 Observer
  <br>
  Observable 可以被订阅(subscribe)，或说可以被观察，而订阅 Observable 的物件又称为 观察者(Observer)。观察者是一个具有三个方法(method)的物件，每当 Observable 发生事件时，便会呼叫观察者相对应的方法。
  
  >- next：每当 Observable 发送出新的值，next 方法就会被呼叫。
  >- complete：在 Observable 没有其他的数据可以取得时，complete 方法就会被呼叫，在 complete 被呼叫之后，next 方法就不会再起作用。
  >- error：每当 Observable 内发生错误时，error 方法就会被呼叫。
  - 实现一个观察者
    ```js
    var observable = Rx.Observable
	  .create(function(observer) {
			observer.next('Jerry');
			observer.next('Anna');
			observer.complete();
			observer.next('not work');
	  })
  
    // 建立一个观察者，具备 next, error, complete 三个方法
    var observer = {
      next: function(value) {
        console.log(value);
      },
      error: function(error) {
        console.log(error)
      },
      complete: function() {
        console.log('complete')
      }
    }
    // 用我们定义好的观察者，来订阅这个 observable
    observable.subscribe(observer)
    ```
    上面这段代码会打印出：Jerry Anna complete
    >上面的示例可以看得出来在 complete 执行后，next 就会自动失效，所以没有印出 not work。
  - 下面是捕获错误的示例
    ```js
    var observable = Rx.Observable
    .create(function(observer) {
      try {
        observer.next('Jerry');
        observer.next('Anna');
        throw 'some exception';
      } catch(e) {
        observer.error(e)
      }
    });

    // 宣告一个观察者，具备 next, error, complete 三个方法
    var observer = {
      next: function(value) {
        console.log(value);
      },
      error: function(error) {
        console.log('Error: ', error)
      },
      complete: function() {
        console.log('complete')
      }
    }
    // 用我们定义好的观察者，来订阅这个 observable
    observable.subscribe(observer)
    ```
    上面这段代码只会执行 error 的 function 印出 Error: some exception。
    <br><br> 
    另外观察者可以是不完整的，他可以只具有一个 next 方法
    ```js
    var observer = {
      next: function(value) {
        //...
      }
    }
    ```
    有时候 Observable 会是一个无限的序列，例如 click 事件，这时 complete 方法就有可能永远不会被呼叫！
    <br><br> 
    我们也可以直接把 next, error, complete 三个 function 依次传入 observable.subscribe
    ```js
    observable.subscribe(
      value => { console.log(value); },
      error => { console.log('Error: ', error); },
      () => { console.log('complete') }
    )
    // observable.subscribe 会在内部自动组成 observer 物件来操作。
    ```
- 实现的细节
  * 其实 Observable 的订阅跟 addEventListener 在实现上有很大的差异，虽然他们的行为很像！
  * addEventListener 本质上就是 Observer Pattern 的实现，在内部会有一份订阅清单，像是我们之前实现的 Producer
    ```js
    class Producer {
      costructor() {
        this.listeners = [];
      }
      addListener(listener) {
        if(typeof listener === 'function') {
          s.listeners.push(listener)
        } else {
          throw new Error('listener 必须是 function')
        }
      }
      removeListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1)
      }
      noify(message) {
        this.listeners.forEach(listener => {
          listener(message);
        })
      }
    }
    ```
    我们在内部储存了一份所有的监听者清单(this.listeners)，在要发布通知时会逐一的呼叫这份清单的监听者。
     
    > 但在 Observable 不是这样实现的，在其内部并没有一份订阅者的清单。订阅 Observable 的行为比较像是执行一个物件的方法，并把资料传进这个方法中。
      ~~~js
      var observable = Rx.Observable
	    .create(function (observer) {
          observer.next('Jerry');
          observer.next('Anna');
        })
  
      observable.subscribe({
        next: function(value) {
          console.log(value);
        },
        error: function(error) {
          console.log(error)
        },
        complete: function() {
          console.log('complete')
        }
      })
      // 像上面这段代码，他的行为比较像这样
      function subscribe(observer) {
        observer.next('Jerry');
        observer.next('Anna');
      }
      subscribe({
        next: function(value) {
          console.log(value);
        },
        error: function(error) {
          console.log(error)
        },
        complete: function() {
          console.log('complete')
        }
      });
      ~~~
      这里可以看到 subscribe 是一个 function，这个 function 执行时会传入观察者，而我们在这个 function 内部去执行观察者的方法。
  
      > 订阅一个 Observable 就像是执行一个 function
- Creation Operator
  * Observable 有许多创建实例的方法，称为 creation operator。下面我们列出 RxJS 常用的 creation operator
    > * create
    > * of
    > * from
    > * fromEvent
    > * fromPromise
    > * never
    > * empty
    > * throw
    > * interval
    > * timer
  * of
    <br>
    当我们想要同步的传递几个值时，就可以用 of 这个 operator 来简洁的表达!
    ~~~js
    var source = Rx.Observable.of('Jerry', 'Anna');
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    // Jerry
    // Anna
    // complete!
    ~~~
  * from
    <br>
    我们可以用 from 来接收任何可列举的参数!
    <br><br>
    记得任何可列举的参数都可以用喔，也就是说像 Set, WeakSet, Iterator 等都可以当作参数！
    ~~~js
    // 传数组
    var arr = ['Jerry', 'Anna', 2016, 2017, '30 days'] 
    var source = Rx.Observable.from(arr);
      source.subscribe({
        next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    // Jerry
    // Anna
    // 2016
    // 2017
    // 30 days
    // complete!
    
    // 传字符串
    var source = Rx.Observable.from('鐵人賽');
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    // 鐵
    // 人
    // 賽
    // complete!
    
    // 传 Promise
    var source = Rx.Observable
      .from(new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('Hello RxJS!');
        },3000)
      }))

    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    // Hello RxJS!
    // complete!
    ~~~
    如果我们传入 Promise 物件实例，当正常回传时，就会被送到 next，并立即送出完成通知，如果有错误则会送到 error。
    
    > 这里也可以用 fromPromise ，会有相同的结果。
  * fromEvent
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    // MouseEvent {...}
    ~~~
    > fromEvent 的第一个参数要传入 DOM 物件，第二个参数传入要监听的事件名称。上面的代码会针对 body 的 click 事件做监听，每当点击 body 就会印出 event。
  * fromEventPattern
    <br>
    这个方法是给类事件使用。所谓的类事件就是指其行为跟事件相像，同时具有注册监听及移除监听两种行为，就像 DOM Event 有 addEventListener 及 removeEventListener 一样！
    ~~~js
    class Producer {
      constructor() {
        this.listeners = [];
      }
      addListener(listener) {
        if(typeof listener === 'function') {
          this.listeners.push(listener)
        } else {
          throw new Error('listener 必须是 function')
        }
      }
      removeListener(listener) {
        this.listeners.splice(this.listeners.indexOf(listener), 1)
      }
      notify(message) {
        this.listeners.forEach(listener => {
          listener(message);
        })
      }
    }
    // ------- 以上都是之前的代码 -------- //
    var egghead = new Producer();
    // egghead 同时具有 注册监听者及移除监听者 两种方法
    var source = Rx.Observable
      .fromEventPattern(
      (handler) => egghead.addListener(handler),
      (handler) => egghead.removeListener(handler)
      );
  
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    })
    egghead.notify('Hello! Can you hear me?');
    // Hello! Can you hear me?
    ~~~
    egghead 是 Producer 的实例，同时具有 注册监听及移除监听两种方法，我们可以将这两个方法依次传入 fromEventPattern 来建立 Observable 的物件实例！
    <br><br>
    这里要注意不要直接将方法传入，避免 this 出错！也可以用 bind 来写。
    ~~~js
    Rx.Observable
    .fromEventPattern(
        egghead.addListener.bind(egghead), 
        egghead.removeListener.bind(egghead)
    )
    .subscribe(console.log)
    ~~~
  * empty
    ~~~js
    var source = Rx.Observable.empty();
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    // complete!
    ~~~
    像是数学上的 零(0) 值，虽然有时候好像没什么，但却非常的重要。empty 会给我们一个空的 observable，如果我们订阅这个 observable 会发生什么事呢？ 它会立即送出 complete 的信息！
      
    > 可以直接把 empty 想成没有做任何事，但它至少会告诉你它没做任何事。
  * never
    ~~~js
    var source = Rx.Observable.never();
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log(error)
      }
    });
    ~~~
    never 会给我们一个无穷的 observable，如果我们订阅它又会发生什么事呢？...什么事都不会发生，它就是一个一直存在但却什么都不做的 observable。
    
    > 可以把 never 想像成一个结束在无穷久以后的 observable，但你永远等不到那一天！
  * throw
    <br>
    它也就只做一件事就是拋出错误。
    ~~~js
    var source = Rx.Observable.throw('Oop!');
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log('Throw Error: ' + error)
      }
    });
    // Throw Error: Oop!
    ~~~
  * interval
    ~~~js
    var source = Rx.Observable.interval(1000);
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log('Throw Error: ' + error)
      }
    });
    // 0
    // 1
    // 2
    // ...
    ~~~
    interval 有一个参数必须是数值(Number)，这的数值代表发出讯号的间隔时间(ms)。上面的代码会持续每隔一秒送出一个从0开始递增的数值！
    <br><br>
  * timer
    ~~~js
    var source = Rx.Observable.timer(1000, 5000);
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log('Throw Error: ' + error)
      }
    });
    // 0
    // 1
    // 2 ...
    ~~~
    当 timer 有两个参数时，第一个参数代表要发出第一个值的等待时间(ms)，第二个参数代表第一次之后发送值的间隔时间，所以上面这段代码会先等一秒送出 0 之后每五秒送出 1, 2, 3, 4...。
    <br><br>
    timer 第一个参数除了可以是数值(Number)之外，也可以是日期(Date)，就会等到指定的时间再发送第一个值。
    <br><br>
    另外 timer 也可以只接收一个参数，下面这段代码就会等一秒后送出 1 同时通知结束。
    ~~~js
    var source = Rx.Observable.timer(1000);
    source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log('Throw Error: ' + error)
      }
    });
    // 0
    // complete!
    ~~~
  * Subscription
    <br>
    有时候我们可能会在某些行为后不需要这些资源，要做到这件事最简单的方式就是 unsubscribe。
    <br><br>
    在订阅 observable 后，会回传一个 subscription 物件，这个物件具有释放资源的 unsubscribe 方法 
    ~~~js
    var source = Rx.Observable.timer(1000, 1000);
    // 取得 subscription
    var subscription = source.subscribe({
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!');
      },
      error: function(error) {
        console.log('Throw Error: ' + error)
      }
    });
    setTimeout(() => {
      subscription.unsubscribe() // 停止订阅(退订)， RxJS 4.x 以前的版本用 dispose()
    }, 5000);
    // 0
    // 1
    // 2
    // 3
    // 4
    ~~~
    这里我们用了 setTimeout 在 5 秒后，执行了 subscription.unsubscribe() 来停止订阅并释放资源。
  
    > Events observable 尽量不要用 unsubscribe ，通常我们会使用 takeUntil，在某个事件发生后来完成 Event observable，这个部份我们之后会讲到！
## Observable Operators & Marble Diagrams
- 什么是 Operator？

  Operators 就是一个个被附加到 Observable 上的实例的方法，例如像是 map, filter, contactAll... 等等，所有这些函数都会拿到原本的 observable 并回传一个新的 observable
  ~~~js
  var people = Rx.Observable.of('Jerry', 'Anna');
  function map(source, callback) {
    return Rx.Observable.create((observer) => {
      return source.subscribe(
        (value) => {
          try{
            observer.next(callback(value));
          } catch(e) {
            observer.error(e);
          }
        },
        (err) => { observer.error(err); },
        () => { observer.complete() }
      )
    })
  }
  var helloPeople = map(people, (item) => item + ' Hello~');
  helloPeople.subscribe(console.log);
  // Jerry Hello~
  // Anna Hello~
  ~~~
  这里可以看到我们写了一个 map 的函数，它接收了两个参数，第一个是原本的 observable，第二个是 map 的 callback function。map 内部第一件事就是用 create 建立一个新的 observable 并回传，并且在内部订阅原本的 observable。
  <br>
  <br>
  我们也可以直接把 map 塞到 Observable.prototype 原型上
  ~~~js
  function map(callback) {
    return Rx.Observable.create((observer) => {
      return this.subscribe(
        (value) => {
          try{
            observer.next(callback(value));
          } catch(e) {
            observer.error(e);
          }
        },
        (err) => { observer.error(err); },
        () => { observer.complete() }
      )
    })
  }
  Rx.Observable.prototype.map = map;
  var people = Rx.Observable.of('Jerry', 'Anna');
  var helloPeople = people.map((item) => item + ' Hello~');
  helloPeople.subscribe(console.log);
  // Jerry Hello~
  // Anna Hello~
  ~~~
  > 这里有两个重点是我们一定要知道的，每个 operator 都会回传一个新的 observable，而我们可以通过 create 的方法建立各种 operator。
- Marble diagrams
  我们在传达事物时，文字其实是最糟的手段，虽然文字是我们平时沟通的基础，但常常千言万语也比不过一张清楚的图。如果我们能绘制 observable 的图示，就能让让我们更方便的沟通及理解 observable 的各种 operators！
  <br>
  <br>
  我们把描绘 observable 的图示称为 Marble diagrams，在网络上 RxJS 有非常多的 Marble diagrams，规则大致上都是相同的，这里为了方便编写以及跟读者的留言互动，所以采用类似 ASCII 的绘画方式。

  * 我们用 - 来表达一小段时间，这些 - 串起就代表一个 observable。

  ~~~shell
  ----------------
  ~~~
  * X (大写 X)则代表有错误发生
  ~~~shell
  ---------------X
  ~~~
  * | 则代表 observable 结束
  ~~~shell
  ----------------|
  ~~~
  在这个时间序当中，我们可能会发送出值(value)，如果值是数字则直接用阿拉伯数字取代，其他的资料类型则用相近的英文符号代表，这里我们用 interval 举例
  ~~~js
  var source = Rx.Observable.interval(1000);
  ~~~
  > source 的图形就会长像这样
  ~~~shell
  -----0-----1-----2-----3--...
  ~~~
  > 当 observable 是同步送值的时候，例如
  ~~~js
  var source = Rx.Observable.of(1,2,3,4);
  ~~~
  > source 的图形就会长像这样
  ~~~shell
  (1234)|
  ~~~
  > 小括号代表着同步发生。

  另外的 Marble diagrams 也能够表达 operator 的前后转换，例如
  ~~~js
  var source = Rx.Observable.interval(1000);
  var newest = source.map(x => x + 1);
  ~~~
  > 这时 Marble diagrams 就会长像这样
  ~~~shell
  source: -----0-----1-----2-----3--...
          map(x => x + 1)
  newest: -----1-----2-----3-----4--...
  ~~~
  最上面是原本的 observable，中间是 operator，下面则是新的 observable。

  > 以上就是 Marble diagrams 如何表示 operator 对 observable 的操作，这能让我们更好的理解各个 operator。

  > Marble Diagrams 相关资源：http://rxmarbles.com/ 
- Operators
  * map
    > Observable 的 map 方法使用上跟队列的 map 是一样的，我们传入一个 callback function，这个 callback function 会带入每次发送出来的元素，然后我们回传新的元素，如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var newest = source.map(x => x + 2);
    newest.subscribe(console.log);
    // 2
    // 3
    // 4
    // 5..
    ~~~
    > 用 Marble diagrams 表达就是
    ~~~shell
    source: -----0-----1-----2-----3--...
            map(x => x + 2)
    newest: -----2-----3-----4-----5--...
    ~~~
  * mapTo
    <br>
    mapTo 可以把传进来的值改成一个固定的值，如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var newest = source.mapTo(2);
    newest.subscribe(console.log);
    // 2
    // 2
    // 2
    // 2..
    ~~~
    > mapTo 用 Marble diagrams 表达
    ~~~shell
    source: -----0-----1-----2-----3--...
                mapTo(2)
    newest: -----2-----2-----2-----2--...
    ~~~
  * filter
    <br>
    filter 在使用上也跟队列的相同，我们要传入一个 callback function，这个 function 会传入每个被送出的元素，并且回传一个 boolean 值，如果为 true 的话就会保留，如果为 false 就会被过滤掉，如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var newest = source.filter(x => x % 2 === 0);
    newest.subscribe(console.log);
    // 0
    // 2
    // 4
    // 6..
    ~~~
    > filter 用 Marble diagrams 表达
    ~~~shell
    source: -----0-----1-----2-----3-----4-...
            filter(x => x % 2 === 0)
    newest: -----0-----------2-----------4-...
    ~~~
    读者应该有发现 map, filter 这些方法其实都跟队列的相同，因为这些都是 functional programming 的通用函数，就算换个语言也有机会看到相同的命名及相同的用法。
  
  > 实际上 Observable 跟 Array 的 operators(map, filter)，在行为上还是有极大的差异。当我们的资料量很大时，Observable 的效能会好上非常多。
## Operators
  - take
    > take 是一个很简单的 operator，顾名思义就是取前几个元素后就结束，范例如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var example = source.take(3);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 1
    // 2
    // complete
    ~~~
    > 这里可以看到我们的 source 原本是会发出无限个元素的，但这里我们用 take(3) 就会只取前 3 个元素，取完后就直接结束(complete)。
    ~~~shell
    # Marble diagram 图示
    source : -----0-----1-----2-----3--..
                  take(3)
    example: -----0-----1-----2|
    ~~~
  - first
    > first 会取 observable 送出的第 1 个元素之后就直接结束，行为跟 take(1) 一致。范例如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var example = source.first();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : -----0-----1-----2-----3--..
                first()
    example: -----0|
    ~~~
  - takeUntil
    > 在实际业务上 takeUntil 经常使用到，他可以在某件事情发生时，让一个 observable 直送出 完成(complete)讯息，范例如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.takeUntil(click);
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 1
    // 2
    // 3
    // complete (点击body了
    ~~~
    > 这里我们一开始先用 interval 建立一个 observable，这个 observable 每隔 1 秒会送出一个从 0 开始递增的数值，接着我们用 takeUntil，传入另一个 observable。

    > 当 takeUntil 传入的 observable 发送值时，原本的 observable 就会直接进入完成(complete)的状态，并且发送完成讯息。也就是说上面这段代码的行为，会先每 1 秒印出一个数字(从 0 递增)直到我们点击 body 为止，他才会送出 complete 讯息。
    ~~~shell
    # Marble diagram 图示
    source : -----0-----1-----2------3--
    click  : ----------------------c----
              takeUntil(click)
    example: -----0-----1-----2----|
    ~~~
  - concatAll
    > 有时我们的 Observable 送出的元素又是一个 observable，就像是二维队列，队列里面的元素是队列，这时我们就可以用 concatAll 把它摊平成一维队列，大家也可以直接把 concatAll 想成把所有元素 concat 起来。范例如下
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.of(1,2,3));
    var example = source.concatAll();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    > 这个范例我们每点击一次 body 就会立刻送出 1,2,3
    ~~~shell
    # Marble diagram 图示
    click  : ------c------------c--------
        map(e => Rx.Observable.of(1,2,3))
    source : ------o------------o--------
                    \            \
                     (123)|       (123)|
                      concatAll()
    example: ------(123)--------(123)------------
    ~~~
    > 这里可以看到 source observable 内部每次发送的值也是 observable，这时我们用 concatAll 就可以把 source 摊平成 example。
    
    > 这里需要注意的是 concatAll 会处理 source 先发出来的 observable，必须等到这个 observable 结束，才会再处理下一个 source 发出来的 observable，让我们用下面这个范例说明。
    ~~~js
    var obs1 = Rx.Observable.interval(1000).take(5);
    var obs2 = Rx.Observable.interval(500).take(2);
    var obs3 = Rx.Observable.interval(2000).take(1);
    var source = Rx.Observable.of(obs1, obs2, obs3);
    var example = source.concatAll();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 1
    // 2
    // 3
    // 4
    // 0
    // 1
    // 0
    // complete
    ~~~
    > 这里可以看到 source 会送出 3 个 observable，但是 concatAll 后的行为永远都是先处理第一个 observable，等到当前处理的结束后才会再处理下一个。
    ~~~shell
    # Marble diagram 图示
    source : (o1                 o2      o3)|
           \                  \       \
            --0--1--2--3--4|   -0-1|   ----0|
                
                concatAll()        
    example: --0--1--2--3--4-0-1----0|
    ~~~
  - skip
    > 忽略掉前几个送出元素，范例如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var example = source.skip(3);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 3
    // 4
    // 5...
    ~~~
    > 原本从 0 开始的就会从成从 3 开始，但是记得原本元素的等待时间仍然存在，也就是说此范例第一个取得的元素需要等 4 秒
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2----3----4----5--....
                    skip(3)
    example: -------------------3----4----5--...
    ~~~
  - takeLast
    > 除了可以用 take 取前几个之外，我们也可以倒过来取最后几个，范例如下
    ~~~js
    var source = Rx.Observable.interval(1000).take(6);
    var example = source.takeLast(2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 4
    // 5
    // complete
    ~~~
    > 这里我们先取了前 6 个元素，再取最后两个。所以最后会送出 4, 5, complete，这里有一个重点，就是 takeLast 必须等到整个 observable 完成(complete)，才能知道最后的元素有哪些，并且同步送出
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2----3----4----5|
                takeLast(2)
    example: ------------------------------(45)|
    ~~~
  - last
    > 跟 take(1) 相同，我们有一个 takeLast(1) 的简化写法，那就是 last() 用来取得最后一个元素。范例如下
    ~~~js
    var source = Rx.Observable.interval(1000).take(6);
    var example = source.last();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 5
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2----3----4----5|
                    last()
    example: ------------------------------(5)|
    ~~~
  - concat
    > concat 可以把多个 observable 实例合并成一个。范例如下
    ~~~js
    var source = Rx.Observable.interval(1000).take(3);
    var source2 = Rx.Observable.of(3)
    var source3 = Rx.Observable.of(4,5,6)
    var example = source.concat(source2, source3);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 1
    // 2
    // 3
    // 4
    // 5
    // 6
    // complete
    ~~~
    > 跟 concatAll 一样，必须先等前一个 observable 完成(complete)，才会继续下一个
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2|
    source2: (3)|
    source3: (456)|
              concat()
    example: ----0----1----2(3456)|
    ~~~
    > 另外 concat 还可以当作静态方法使用
    ~~~js
    var source = Rx.Observable.interval(1000).take(3);
    var source2 = Rx.Observable.of(3);
    var source3 = Rx.Observable.of(4,5,6);
    var example = Rx.Observable.concat(source, source2, source3);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
  - startWith
    > startWith 可以在 observable 的一开始塞入要发送的元素，有点像 concat 但参数不是 observable 而是要发送的元素。范例如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var example = source.startWith(0);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 0
    // 1
    // 2
    // 3...
    ~~~
    > 这里可以看到我们在 source 的一开始塞了一个 0，让 example 会在一开始就立即送出 0
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2----3--...
                startWith(0)
    example: (0)----0----1----2----3--...
    ~~~
    > 记得 startWith 的值是一开始就同步发出的，这个 operator 很常被用来保存代码的起始状态！
  - merge
    > merge 跟 concat 一样都是用来合并 observable，但他们在行为上有非常大的不同！。范例如下
    ~~~js
    var source = Rx.Observable.interval(500).take(3);
    var source2 = Rx.Observable.interval(300).take(6);
    var example = source.merge(source2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 0
    // 1
    // 2
    // 1
    // 3
    // 2
    // 4
    // 5
    // complete
    ~~~
    > 上面可以看得出来，merge 把多个 observable 同时处理，这跟 concat 一次处理一个 observable 是完全不一样的，由于是同时处理行为会变得较为复杂
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2|
    source2: --0--1--2--3--4--5|
                merge()
    example: --0-01--21-3--(24)--5|
    ~~~
    > 这里可以看到 merge 之后的 example 在时间序上同时在跑 source 与 source2，当两件事情同时发生时，会同步送出资料(被 merge 的在后面)，当两个 observable 都结束时才会真的结束。
  
    > merge 同样可以当作静态方法用
    ~~~js
    var source = Rx.Observable.interval(500).take(3);
    var source2 = Rx.Observable.interval(300).take(6);
    var example = Rx.Observable.merge(source, source2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    > merge 的逻辑有点像是 OR(||)，就是当两个 observable 其中一个被触发时都可以被处理，这很常用在一个以上的按钮具有部分相同的行为。

    > 例如一个影片播放器有两个按钮，一个是暂停(II)，另一个是结束播放(口)。这两个按钮都具有相同的行为就是影片会被停止，只是结束播放会让影片回到 00 秒，这时我们就可以把这两个按钮的事件 merge 起来处理影片暂停这件事。
    ~~~js
    var stopVideo = Rx.Observable.merge(stopButton, endButton);
    stopVideo.subscribe(() => {
      // 暂停播放影片
    })
    ~~~
  - combineLatest
    > 它会取得各个 observable 最后送出的值，再输出成一个值，示例如下
    ~~~js
    var source = Rx.Observable.interval(500).take(3);
    var newest = Rx.Observable.interval(300).take(6);
    var example = source.combineLatest(newest, (x, y) => x + y);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 1
    // 2
    // 3
    // 4
    // 5
    // 6
    // 7
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2|
    newest : --0--1--2--3--4--5|
        combineLatest(newest, (x, y) => x + y);
    example: ----01--23-4--(56)--7|
    ~~~
    > 首先 combineLatest 可以接收多个 observable，最后一个参数是 callback function，这个 callback function 接收的参数数量跟合并的 observable 数量相同，依照范例来说，因为我们这里合并了两个 observable 所以后面的 callback function 就接收 x, y 两个参数，x 会接收从 source 发送出来的值，y 会接收从 newest 发送出来的值。

    > 最后一个重点就是一定会等两个 observable 都曾有送值出来才会呼叫我们传入的 callback，所以这段代码是这样运行的:
    * newest 送出了 0，但此时 source 并没有送出过任何值，所以不会执行 callback
    * source 送出了 0，此时 newest 最后一次送出的值为 0，把这两个数传入 callback 得到 0。
    * newest 送出了 1，此时 source 最后一次送出的值为 0，把这两个数传入 callback 得到 1。
    * newest 送出了 2，此时 source 最后一次送出的值为 0，把这两个数传入 callback 得到 2。
    * source 送出了 1，此时 newest 最后一次送出的值为 2，把这两个数传入 callback 得到 3。
    * newest 送出了 3，此时 source 最后一次送出的值为 1，把这两个数传入 callback 得到 4。
    * source 送出了 2，此时 newest 最后一次送出的值为 3，把这两个数传入 callback 得到 5。
    * source 结束，但 newest 还没结束，所以 example 还不会结束。
    * newest 送出了 4，此时 source 最后一次送出的值为 2，把这两个数传入 callback 得到 6。
    * newest 送出了 5，此时 source 最后一次送出的值为 2，把这两个数传入 callback 得到 7。
    * newest 结束，因为 source 也结束了，所以 example 结束。
    > 不管是 source 还是 newest 送出值来，只要另一方曾有送出过值(有最后的值)，就会执行 callback 并送出新的值，这就是 combineLatest。
    
    > combineLatest 很常用在运算多个因子的结果，例如最常见的 BMI 计算，我们身高变动时就拿上一次的体重计算新的 BMI，当体重变动时则拿上一次的身高计算 BMI，这就很适合用 combineLatest 来处理！

  - zip
    > zip 会取每个 observable 相同顺位的元素并传入 callback，也就是说每个 observable 的第 n 个元素会一起被传入 callback，示例如下
    ~~~js
    var source = Rx.Observable.interval(500).take(3);
    var newest = Rx.Observable.interval(300).take(6);
    var example = source.zip(newest, (x, y) => x + y);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 2
    // 4
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2|
    newest : --0--1--2--3--4--5|
          zip(newest, (x, y) => x + y)
    example: ----0----2----4|
    ~~~
    > zip 会等到 source 跟 newest 都送出了第一个元素，再传入 callback，下次则等到 source 跟 newest 都送出了第二个元素再一起传入 callback，所以这段代码是这样运行的:
    * newest 送出了第一个值 0，但此时 source 并没有送出第一个值，所以不会执行 callback。
    * source 送出了第一个值 0，newest 之前送出的第一个值为 0，把这两个数传入 callback 得到 0。
    * newest 送出了第二个值 1，但此时 source 并没有送出第二个值，所以不会执行 callback。
    * newest 送出了第三个值 2，但此时 source 并没有送出第三个值，所以不会执行 callback。
    * source 送出了第二个值 1，newest 之前送出的第二个值为 1，把这两个数传入 callback 得到 2。
    * newest 送出了第四个值 3，但此时 source 并没有送出第四个值，所以不会执行 callback。
    * source 送出了第三个值 2，newest 之前送出的第三个值为 2，把这两个数传入 callback 得到 4。
    * source 结束 example 就直接结束，因为 source 跟 newest 不会再有对应顺位的值
    > zip 会把各个 observable 相同顺位送出的值传入 callback，这很常拿来做 demo 使用，比如我们想要间隔 100ms 送出 'h', 'e', 'l', 'l', 'o'，就可以这么做：
    ~~~js
    var source = Rx.Observable.from('hello');
    var source2 = Rx.Observable.interval(100);
    var example = source.zip(source2, (x, y) => x);
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : (hello)|
    source2: -0-1-2-3-4-...
          zip(source2, (x, y) => x)
    example: -h-e-l-l-o|
    ~~~
    > 这里我们利用 zip 来达到原本只能同步送出的资料变成了异步的，很适合用在建立示范用的资料。

    > 建议大家平常没事不要乱用 zip，除非真的需要。因为 zip 必须 cache 住还没处理的元素，当我们两个 observable 一个很快一个很慢时，就会 cache 非常多的元素，等待比较慢的那个 observable。这很有可能造成内存相关的问题！
  - withLatestFrom
    > withLatestFrom 运行方式跟 combineLatest 有点像，只是他有主从的关系，只有在主要的 observable 送出新的值时，才会执行 callback，附带的 observable 只是在背景下运作。示例如下
    ~~~js
    var main = Rx.Observable.from('hello').zip(Rx.Observable.interval(500), (x, y) => x);
    var some = Rx.Observable.from([0,1,0,0,0,1]).zip(Rx.Observable.interval(300), (x, y) => x);
    var example = main.withLatestFrom(some, (x, y) => {
    return y === 1 ? x.toUpperCase() : x;
    });
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    main   : ----h----e----l----l----o|
    some   : --0--1--0--0--0--1|
          withLatestFrom(some, (x, y) =>  y === 1 ? x.toUpperCase() : x);
    example: ----h----e----l----L----O|
    ~~~
    > withLatestFrom 会在 main 送出值的时候执行 callback，但请注意如果 main 送出值时 some 之前没有送出过任何值 callback 仍然不会执行！
    
    > 这里我们在 main 送出值时，去判断 some 最后一次送的值是不是 1 来决定是否要切换大小写，所以这段代码是这样运行的:
    * main 送出了 h，此时 some 上一次送出的值为 0，把这两个参数传入 callback 得到 h。
    * main 送出了 e，此时 some 上一次送出的值为 0，把这两个参数传入 callback 得到 e。
    * main 送出了 l，此时 some 上一次送出的值为 0，把这两个参数传入 callback 得到 l。
    * main 送出了 l，此时 some 上一次送出的值为 1，把这两个参数传入 callback 得到 L。
    * main 送出了 o，此时 some 上一次送出的值为 1，把这两个参数传入 callback 得到 O。
    > withLatestFrom 很常用在一些 checkbox 型的功能，例如说一个编辑器，我们开启粗体后，打出来的字就都要变粗体，粗体就像是 some observable，而我们打字就是 main observable。
  - scan
    <br>
    scan 其实就是 Observable 版本的 reduce 只是命名不同。如果熟悉队列操作的话，应该会知道原生的 JS Array 就有 reduce 的方法，使用方式如下
    ~~~js
    var arr = [1, 2, 3, 4];
    var result = arr.reduce((origin, next) => {
      console.log(origin)
      return origin + next
    }, 0);
    console.log(result)
    // 0
    // 1
    // 3
    // 6
    // 10
    ~~~
    reduce 方法需要传两个参数，第一个是 callback 第二个则是起始状态，这个 callback 执行时，会传入两个参数一个是原本的状态，第二个是修改原本状态的参数，最后回传一个新的状态，再继续执行。
    <br>
    这段代码的运行过程：
    * 第一次执行 callback 起始状态是 0 所以 origin 传入 0，next 为 arr 的第一个元素 1，相加之后变成 1 回传并当作下一次的状态。
    * 第二次执行 callback，这时原本的状态(origin)就变成了 1，next 为 arr 的第二个元素 2，相加之后变成 3 回传并当作下一次的状态。
    * 第三次执行 callback，这时原本的状态(origin)就变成了 3，next 为 arr 的第三个元素 3，相加之后变成 6 回传并当作下一次的状态。
    * 第三次执行 callback，这时原本的状态(origin)就变成了 6，next 为 arr 的第四个元素 4，相加之后变成 10 回传并当作下一次的状态。
    * 这时 arr 的元素都已经遍历过了，所以不会直接把 10 回传。
    
    <br>
    scan 整体的运作方式都跟 reduce 一样，范例如下
    
    ~~~js
    var source = Rx.Observable.from('hello')
             .zip(Rx.Observable.interval(600), (x, y) => x);
    var example = source.scan((origin, next) => origin + next, '');
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // h
    // he
    // hel
    // hell
    // hello
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : ----h----e----l----l----o|
            scan((origin, next) => origin + next, '')
    example: ----h----(he)----(hel)----(hell)----(hello)|
    ~~~
    这里可以看到第一次传入 'h' 跟 '' 相加，返回 'h' 当作下一次的初始状态，一直重复下去。
    
    > scan 跟 reduce 最大的差別就在 scan 一定会回传一个 observable 实例，而 reduce 最后回传的值有可能是任何数据类型，必须看使用者传入的 callback 才能决定 reduce 最后的返回值。

    scan 经常用在状态的计算处理，最简单的就是对一个数字的加减，我们可以綁定一个 button 的 click 事件，并用 map 把 click event 转成 1，之后送处 scan 计算值再做显示。下面是一个案例：
    
    ~~~js
    const addButton = document.getElementById('addButton');
    const minusButton = document.getElementById('minusButton');
    const state = document.getElementById('state');
    const addClick = Rx.Observable.fromEvent(addButton, 'click').mapTo(1);
    const minusClick = Rx.Observable.fromEvent(minusButton, 'click').mapTo(-1);
    const numberState = Rx.Observable.empty()
      .startWith(0)
      .merge(addClick, minusClick)
      .scan((origin, next) => origin + next, 0)
    
    numberState
      .subscribe({
        next: (value) => { state.innerHTML = value;},
        error: (err) => { console.log('Error: ' + err); },
        complete: () => { console.log('complete'); }
    });
    ~~~
    这里我们用了两个 button，一个是 add 按鈕，一个是 minus 按鈕。这两个按鈕的点击事件各建立了 addClick, minusClick 两个 observable，这两个 observable 直接 mapTo(1) 跟 mapTo(-1)，代表被点击后会各自送出的数字！
    <br>
    <br>
    接着我们用了 empty() 建立一个空的 observable 代表画面上数字的状态，搭配 startWith(0) 来设定初始值，接着用 merge 把两个 observable 合併透过 scan 处理之后的逻辑，最后在 subscribe 来更改画面的显示。
    <br>
    <br>
  - buffer
    <br>
    buffer 是一整个家族，总共有五个相关的 operators

    * buffer
    * bufferCount
    * bufferTime
    * bufferToggle
    * bufferWhen
    
    这里比较常用到的是 buffer, bufferCount 跟 bufferTime 这三个，我们直接来看范例。
    ~~~js
    var source = Rx.Observable.interval(300);
    var source2 = Rx.Observable.interval(1000);
    var example = source.buffer(source2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]...
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : --0--1--2--3--4--5--6--7..
    source2: ---------0---------1--------...
            buffer(source2)
    example: ---------([0,1,2])---------([3,4,5])  
    ~~~
    buffer 要传入一个 observable(source2)，它会把原本的 observable (source)送出的元素缓存在队列中，等到传入的 observable(source2) 送出元素时，就会触发把缓存的元素送出。
    <br>
    <br>
    这里的范例 source2 是每一秒就会送出一个元素，我们可以改用 bufferTime 简洁的表达，如下
    ~~~js
    var source = Rx.Observable.interval(300);
    var example = source.bufferTime(1000);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]...
    ~~~
    除了用时间来作缓存外，我们更常用数量来做缓存，范例如下
    ~~~js
    var source = Rx.Observable.interval(300);
    var example = source.bufferCount(3);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]...
    ~~~    
    在实际业务上，我们可以用 buffer 来做某个事件的过滤，例如像是鼠标连点才能真的执行，这里我们一样写了一个小范例
    ~~~js
    const button = document.getElementById('demo');
    const click = Rx.Observable.fromEvent(button, 'click')
    const example = click
      .bufferTime(500)
      .filter(arr => arr.length >= 2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // [0,1,2]
    // [3,4,5]
    // [6,7,8]...
    ~~~    
    这里我们只有在 500 毫秒内连点两下，才能成功印出 'success'，这个功能在某些特殊的需求中非常的好用，也能用在批次处理来降低 request 传送的次数！

  
  - delay

    delay 可以延迟 observable 一开始发送元素的时间点，范例如下
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source.delay(500);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 1
    // 2
    // 3
    // 4
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : --0--1--2--3--4|
            delay(500)
    example: -------0--1--2--3--4|
    ~~~
    从 Marble Diagram 可以看得出来，第一次送出元素的时间变慢了，虽然在这里看起来没什么用，但是在 UI 操作上是非常有用的

    delay 除了可以入毫秒以外，也可以传入 Date 类型的数据
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source.delay(new Date(new Date().getTime() + 1000));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    

  - delayWhen

    delayWhen 的作用跟 delay 很像，最大的差別是 delayWhen 可以影响每个元素，而且需要传一个 callback 并回传一个 observable，范例如下
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source
      .delayWhen(
        x => Rx.Observable.empty().delay(100 * x * x)
      );
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : --0--1--2--3--4|
            .delayWhen(x => Rx.Observable.empty().delay(100 * x * x));
    example: --0---1----2-----3-----4|
    ~~~  
    这里传进来的 x 就是 source 送出的每个元素，这样我们就能对每一个做延迟。

    这里我们用 delay 来做一个小功能，这个功能很简单就是让多张照片跟着鼠标跑，但每张照片不能跑一样快！

    首先我们准备六张大头照，并且写进 HTML
    ~~~html
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover6.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover5.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover4.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover3.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover2.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover1.jpg" alt="">
    ~~~
    用 CSS 把 img 改成圆形，并加上边框以及绝对位置
    ~~~css
    img{
        position: absolute;
        border-radius: 50%;
        border: 3px white solid;
        transform: translate3d(0,0,0);
    }
    ~~~
    再来写 JS
    ~~~js
    var imgList = document.getElementsByTagName('img');

    var movePos = Rx.Observable.fromEvent(document, 'mousemove')
      .map(e => ({ x: e.clientX, y: e.clientY }))
    
    function followMouse(DOMArr) {
      const delayTime = 600;
      DOMArr.forEach((item, index) => {
        movePos.delay(delayTime * (Math.pow(0.65, index) + Math.cos(index / 4)) / 2)
          .subscribe(function (pos){
            item.style.transform = 'translate3d(' + pos.x + 'px, ' + pos.y + 'px, 0)';
          });
      });
    }
    
    followMouse(Array.from(imgList))
    ~~~
    这里我们把 imgList 从 Collection 转成 Array 后传入 followMouse()，并用 forEach 把每个 omg 取出并利用 index 来达到不同的 delay 时间，这个 delay 时间的逻辑大家可以自己想，不用跟我一样，最后 subscribe 就完成啦！


  - debounce (防抖)

    跟 buffer、bufferTime 一样，Rx 有 debounce 跟 debounceTime 一个是传入 observable 另一个则是传入毫秒，比较常用到的是 debounceTime，这里我们直接来看一个范例
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source.debounceTime(1000);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 4
    // complete
    ~~~
    这里只印出 4 然后就结束了，因为 debounce 运作的方式是每次收到元素，他会先把元素 cache 住并等待一段时间，如果这段时间内已经没有收到任何元素，则把元素送出；如果这段时间内又收到新的元素，则会把原本 cache 住的元素释放掉并重新计时，不断反覆。
    > 以现在这个范例来讲，我们每 300 毫秒就会送出一个数值，但我们的 debounceTime 是 1000 毫秒，也就是说每次 debounce 收到元素还等不到 1000 毫秒，就会收到下一个新元素，然后重新等待 1000 毫秒，如此重复直到第五个元素送出时，observable 结束(complete)了，debounce 就直接送出元素。
    ~~~shell
    # Marble diagram 图示
    source : --0--1--2--3--4|
          debounceTime(1000)
    example: --------------4|    
    ~~~  
    debounce 会在收到元素后等待一段时间，这很适合用来处理间歇行为，间歇行为就是指这个行为是一段一段的，例如要做 Auto Complete 时，我们要打字搜寻不会一直不断的打字，可以等我们停了一小段时间后再送出，才不会每打一个字就送一次 request！
    ~~~js
    const searchInput = document.getElementById('searchInput');
    const theRequestValue = document.getElementById('theRequestValue');
    Rx.Observable.fromEvent(searchInput, 'input')
      .map(e => e.target.value)
      .subscribe((value) => {
    theRequestValue.textContent = value;
    // 在这里发 request
    })
    ~~~
    如果用上面这段代码，就会每打一个字就送一次 request，当很多人在使用时就会对 server 造成很大的负担，实际上我们只需要使用者最后打出来的文字就好了，不用每次都送，这时就能用 debounceTime 做优化。
    ~~~js
    const searchInput = document.getElementById('searchInput');
    const theRequestValue = document.getElementById('theRequestValue');
    Rx.Observable.fromEvent(searchInput, 'input')
      .debounceTime(300)
      .map(e => e.target.value)
      .subscribe((value) => {
    theRequestValue.textContent = value;
    // 在这里发 request
    })
    ~~~

  - throttle (节流)
    跟 debounce 一样 RxJS 有 throttle 跟 throttleTime 两个方法，一个是传入 observable 另一个是传入毫秒，比较常用到的也是 throttleTime，让我们直接来看范例
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source.throttleTime(1000);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // 0
    // 4
    // complete
    ~~~
    跟 debounce 的不同是 throttle 会先开放送出元素，等到有元素被送出就会沉默一段时间，等到时间过了又会开放发送元素。
    <br>
    <br>
    throttle 比较像是控制行为的最高频率，也就是说如果我们设定 1000 毫秒，那该事件频率的最大值就是每秒触发一次不会再更快，debounce 则比较像是必须等待的时间，要等到一定的时间过了才会收到元素。
    <br>
    <br>
    throttle 更适合用在连续性行为，比如说 UI 动画的运算过程，因为 UI 动画是连续的，像我们在做拖拉案例时，就可以加上 throttleTime(12) 让 mousemove event 不要发送的太快，避免画面更新的速度跟不上样式的切换速度。
    > 浏览器有一个 requestAnimationFrame API 是专门用来优化 UI 运算的，通常用这个的效果会比 throttle 好，但并不是绝对还是要看最终效果。    

  - distinct (去重)
    它能帮我们把相同值的数据过过滤掉只留一个，也就是数据去重，范例如下
    ~~~js
    var source = Rx.Observable.from(['a', 'b', 'c', 'a', 'b'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
    var example = source.distinct()
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // a
    // b
    // c
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : --a--b--c--a--b|
            distinct()
    example: --a--b--c------|
    ~~~
    另外我们可以传入一个 selector callback function，这个 callback function 会传入一个接收到的元素，并回传我们真正希望比对的值，舉例如下
    ~~~js
    var source = Rx.Observable.from([{ value: 'a'}, { value: 'b' }, { value: 'c' }, { value: 'a' }, { value: 'c' }])
            .zip(Rx.Observable.interval(300), (x, y) => x);
    var example = source.distinct((x) => {
      return x.value
    });
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // {value: "a"}
    // {value: "b"}
    // {value: "c"}
    // complete
    ~~~
    这里可以看到，因为 source 送出的都是物件，而 js 物件的比对是比对记憶体位置，所以在这个例子中这些物件永远不会相等，但实际上我们想比对的是物件中的 value，这时我们就可以传入 selector callback，来选择我们要比对的值。
    > distinct 传入的 callback 在 RxJS 5 几个 bate 版本中有过很多改变，现在网络上很多文章跟教学都是过时的，请读者务必小心！
    
    实际上 distinct() 会在背地里建立一个 Set，当接收到元素时会先去判断 Set 内是否有相同的值，如果有就不送出，如果没有则存到 Set 并送出。所以记得尽量不要直接把 distinct 用在一个无限的 observable 里，这样很可能会让 Set 越来越大，建议大家可以放第二个参数 flushes，或用 distinctUntilChanged
    > 这里指的 Set 其实是 RxJS 自己实现的，跟 ES6 原生的 Set 行为也都一致，只是因为 ES6 的 Set 支援程度还并不理想，所以这里是直接用 JS 实现。     

    distinct 可以传入第二个参数 flushes observable 用来清除暂存的数据，范例如下
    ~~~js
    var source = Rx.Observable.from(['a', 'b', 'c', 'a', 'c'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
    var flushes = Rx.Observable.interval(1300);
    var example = source.distinct(null, flushes);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // a
    // b
    // c
    // c
    // complete
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : --a--b--c--a--c|
    flushes: ------------0---...
          distinct(null, flushes);
    example: --a--b--c-----c|
    ~~~
    其实 flushes observable 就是在送出元素时，会把 distinct 的暂存清空，所以之后的暂存就会从头来过，这样就不用担心暂存的 Set 越来愈大的问题，但其实我们平常不太会用这样的方式来处理，通常会用另一个方法 distinctUntilChanged。

  - distinctUntilChanged
    
    distinctUntilChanged 跟 distinct 一样会把相同的元素过滤掉，但 distinctUntilChanged 只会跟最后一次送出的元素比较，不会每个都比，舉例如下
    ~~~js
    var source = Rx.Observable.from(['a', 'b', 'c', 'c', 'b'])
            .zip(Rx.Observable.interval(300), (x, y) => x);
    var example = source.distinctUntilChanged()
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // a
    // b
    // c
    // b
    // complete
    ~~~
    这里 distinctUntilChanged 只会暂存一个元素，并在收到元素时跟暂存的元素比对，如果一样就不送出，如果不一样就把暂存的元素换成刚接收到的新元素并送出。
    ~~~shell
    # Marble diagram 图示
    source : --a--b--c--c--b|
            distinctUntilChanged()
    example: --a--b--c-----b|
    ~~~
    从 Marble Diagram 中可以看到，第二个 c 送出时刚好上一个就是 c 所以就被过滤掉了，但最后一个 b 则跟上一个不同所以没被过滤掉。
    <br>
    <br>
    distinctUntilChanged 是比较常在实际业务上使用的，最常见的状况是我们在做多方同步时。当我们有多个 Client，且每个 Client 有着各自的状态，Server 会再一个 Client 需要变动时通知所有 Client 更新，但可能某些 Client 接收到新的状态其实跟上一次收到的是相同的，这时我们就可用 distinctUntilChanged 方法只处理跟最后一次不相同的讯息，像是多方通话、多装置的资讯同步都会有类似的情境。


  - catch (错误处理)

    catch 是很常见的异步错误处理方法，在 RxJS 中也能够直接用 catch 来处理错误，在 RxJS 中的 catch 可以回传一个 observable 来送出新的值，让我们直接来看范例：
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .catch(error => Rx.Observable.of('h'));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这个范例我们每隔 500 毫秒会送出一个字符串(String)，并用字符串的方法 toUpperCase() 来把字符串的英文字母改成大写，过程中可能未知的原因送出了一个数值(Number) 2 导致发生例外(数值没有 toUpperCase 的方法)，这时我们在后面接的 catch 就能抓到错误。
    
    catch 可以回传一个新的 Observable、Promise、Array 或任何 Iterable 的物件，来传送之后的元素。以我们的例子来说最后就会在送出 X 就结束。
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch(error => Rx.Observable.of('h'))
    example: ----a----b----c----d----h|
    ~~~
    这里可以看到，当错误发生后就会进到 catch 并重新处理一个新的 observable，我们可以利用这个新的 observable 来送出我们想送的值。
    <br>
    <br>
    也可以在遇到错误后，让 observable 结束，如下
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .catch(error => Rx.Observable.empty());
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    回传一个 empty 的 observable 来直接结束(complete)。
    <br>
    <br>
    另外 catch 的 callback 能接收第二个参数，这个参数会接收当前的 observable，我们可以回传当前的 observable 来做到重新执行，范例如下
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .catch((error, obs) => obs);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch((error, obs) => obs)
    example: ----a----b----c----d--------a----b----c----d--..
    ~~~
    因为是我们只是简单的示范，所以这里会一直无限循环，实际业务上通常会用在断线重连的情境。
    另上面的处理方式有一个简化的写法，叫做 retry()。


  - retry

    如果我们想要一个 observable 发生错误时，重新尝试就可以用 retry 这个方法，跟我们前一个讲范例的行为是一致
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .retry();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    通常这种无限的 retry 会放在即时同步的重新连接，让我们在连线断掉后，不断的尝试。另外我们也可以设定只尝试几次，如下
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .retry(1);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // a
    // b
    // c
    // d
    // a
    // b
    // c
    // d
    // Error: TypeError: x.toUpperCase is not a function
    ~~~
    这里我们对 retry 传入一个数值 1，能够让我们只重复尝试 1 次后送出错误
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
            map(x => x.toUpperCase())
             ----a----b----c----d----X|
                retry(1)
    example: ----a----b----c----d--------a----b----c----d----X|
    ~~~
    这种处理方式很适合用在 HTTP request 失败的场景中，我们可以设定重新发送几次后，再抛出错误讯息。


  - retryWhen

    RxJS 还提供了另一种方法 retryWhen，他可以把例外发生的元素放到一个 observable 中，让我们可以直接操作这个 observable，并等到这个 observable 操作完后再重新订阅一次原本的 observable。
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .retryWhen(errorObs => errorObs.delay(1000));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这里 retryWhen 我们传入一个 callback，这个 callback 有一个参数会传入一个 observable，这个 observable 不是原本的 observable(example) 而是例外事件送出的错误所组成的一个 observable，我们可以对这个由错误所组成的 observable 做操作，等到这次的处理完成后就会重新订阅我们原本的 observable。
    <br>
    <br>
    这个范例我们是把错误的 observable 送出错误延迟 1 秒，这会使后面重新订阅的动作延迟 1 秒才执行
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
             ----a----b----c----d----X|
        retryWhen(errorObs => errorObs.delay(1000))
    example: ----a----b----c----d-------------------a----b----c----d----...
    ~~~
    从上图可以看到后续重新订阅的行为就被延后了，但实际业务上我们不太会用 retryWhen 来做重新订阅的延迟，通常是直接用 catch 做到这件事。这里只是为了示范 retryWhen 的行为，实际业务上我们通常会把 retryWhen 拿来做错误通知或是例外收集，如下
    ~~~js
    var source = Rx.Observable.from(['a','b','c','d',2])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source
      .map(x => x.toUpperCase())
      .retryWhen(
    errorObs => errorObs.map(err => fetch('...')));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这里的 errorObs.map(err => fetch('...')) 可以把 errorObs 里的每个错误变成 API 的发送，通常这里个 API 会像是送讯息到公司的通讯频道(Slack 等等)，这样可以让工程師馬上知道可能哪个 API 挂了，这样我们就能即时地处理。
    
    > retryWhen 实际上是在背地里建立一个 Subject 并把错误放入，会在对这个 Subject 进行内部的订阅，因为我们还没有讲到 Subject 的观念，大家可以先把它当作 Observable 就好了，另外记得这个 observalbe 预设是无限的，如果我们把它结束，原本的 observable 也会跟着结束。
  
  - repeat

    我们有时候可能会想要 retry 一直重复订阅的效果，但没有错误发生，这时就可以用 repeat 来做到这件事，范例如下
    ~~~js
    var source = Rx.Observable.from(['a','b','c'])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source.repeat(2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    
    // a
    // b
    // c
    // a
    // b
    // c
    // complete
    ~~~
    这里 repeat 的行为跟 retry 基本一致，只是 retry 只有在例外发生时才触发
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c|
            repeat(2)
    example: ----a----b----c----a----b----c|
    ~~~
    同样的我们可以不给参数让他无限循环，如下
    ~~~js
    var source = Rx.Observable.from(['a','b','c'])
            .zip(Rx.Observable.interval(500), (x,y) => x);
    var example = source.repeat();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这样我们就可以做动不断重复的行为，这个可以在建立轮询时使用，让我们不断地发 request 来更新画面。
    <br>
    <br>
    最后我们来看一个错误处理在实际业务应用中的小范例
    ~~~js
    const title = document.getElementById('title');
    var source = Rx.Observable.from(['a','b','c','d',2])
      .zip(Rx.Observable.interval(500), (x,y) => x)
      .map(x => x.toUpperCase());
    // 通常 source 会是建立即时同步的连线，像是 web socket
    var example = source.catch(
      (error, obs) => Rx.Observable.empty()
        .startWith('连线发生错误： 5秒后重连')
        .concat(obs.delay(5000))
    );
    example.subscribe({
      next: (value) => { title.innerText = value },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这个范例其实就是模仿在即时同步断线时，利用 catch 返回一个新的 observable，这个 observable 会先送出错误讯息并且把原本的 observable 延迟 5 秒再做合併，虽然这只是一个模仿，但它清楚的展示了 RxJS 在做错误处理时的灵活性。


  - concatAll

    concatAll 最重要的重点就是他会处理完前一个 observable 才会在处理下一个 observable，让我们来看一个范例
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.interval(1000));
    var example = source.concatAll();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // (点击后)
    // 0
    // 1
    // 2
    // 3
    // 4
    // 5 ...
    ~~~
    上面这段代码，当我们点击画面时就会开始送出数值
    ~~~shell
    # Marble diagram 图示
    click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
    source : ---------o-o------------------o--..
                       \ \
                        \ ----0----1----2----3----4--...
                         ----0----1----2----3----4--...
                         concatAll()
    example: ----------------0----1----2----3----4--..
    ~~~
    从 Marble Diagram 可以看得出来，当我们点击一下 click 事件会被转成一个 observable 而这个 observable 会每一秒送出一个递增的数值，当我们用 concatAll 之后会把二维的 observable 摊平成一维的 observable，但 concatAll 会一个一个处理，一定是等前一个 observable 完成(complete)才会处理下一个 observable，因为现在送出 observable 是无限的永远不会完成(complete)，就导致他永远不会处理第二个送出的 observable!
    <br>
    <br>
    我们再看一个例子
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.interval(1000).take(3));
    var example = source.concatAll();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    现在我们把送出的 observable 限制只取前三个元素
    ~~~shell
    # Marble diagram 图示
    click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
    source : ---------o-o------------------o--..
                   \ \                  \
                    \ ----0----1----2|   ----0----1----2|
                     ----0----1----2|
                     concatAll()
    example: ----------------0----1----2----0----1----2--..
    ~~~
    这里我们把送出的 observable 变成有限的，只会送出三个元素，这时就能看得出来 concatAll 不管两个 observable 送出的时间多么相近，一定会先处理前一个 observable 再处理下一个。


  - switch

    switch 同样能把二维的 observable 摊平成一维的，但他们在行为上有很大的不同，我们来看下面这个范例
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.interval(1000));
    var example = source.switch();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
    source : ---------o-o------------------o--..
                   \ \                  \----0----1--...
                    \ ----0----1----2----3----4--...
                     ----0----1----2----3----4--...
                     switch()
    example: -----------------0----1----2--------0----1--...
    ~~~    
    switch 最重要的就是他会在新的 observable 送出后直接处理新的 observable 不管前一个 observable 是否完成，每当有新的 observable 送出就会直接把舊的 observable 退订(unsubscribe)，永远只处理最新的 observable!
    <br>
    <br>
    所以在这上面的 Marble Diagram 可以看得出来第一次送出的 observable 跟第二次送出的 observable 时间点太相近，导致第一个 observable 还来不及送出元素就直接被退订了，当下一次送出 observable 就又会把前一次的 observable 退订。


  - mergeAll

    我们之前讲过 merge 他可以让多个 observable 同时送出元素，mergeAll 也是同样的道理，它会把二维的 observable 转成一维的，并且能够同时处理所有的 observable，让我们来看这个范例
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.interval(1000));
    var example = source.mergeAll();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    click  : ---------c-c------------------c--.. 
        map(e => Rx.Observable.interval(1000))
    source : ---------o-o------------------o--..
                       \ \                  \----0----1--...
                        \ ----0----1----2----3----4--...
                         ----0----1----2----3----4--...
                         switch()
    example: ----------------00---11---22---33---(04)4--...
    ~~~   
    从 Marble Diagram 可以看出来，所有的 observable 是并行(Parallel)处理的，也就是说 mergeAll 不会像 switch 一样退订(unsubscribe)原先的 observable 而是并行处理多个 observable。以我们的范例来说，当我们点击越多下，最后送出的频率就会越快。
    <br>
    <br>
    另外 mergeAll 可以传入一个数值，这个数值代表他可以同时处理的 observable 数量，我们来看一个例子
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.interval(1000).take(3));
    var example = source.mergeAll(2);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    > 这里我们送出的 observable 改成取前三个，并且让 mergeAll 最多只能同时处理 2 个 observable
    ~~~shell
    # Marble diagram 图示
    click  : ---------c-c----------o----------.. 
        map(e => Rx.Observable.interval(1000))
    source : ---------o-o----------c----------..
                       \ \          \----0----1----2|     
                        \ ----0----1----2|  
                         ----0----1----2|
                         mergeAll(2)
    example: ----------------00---11---22---0----1----2--..
    ~~~   
    当 mergeAll 传入参数后，就会等处理中的其中一个 observable 完成，再去处理下一个。以我们的例子来说，前面两个 observable 可以被并行处理，但第三个 observable 必须等到第一个 observable 结束后，才会开始。
    >我们可以利用这个参数来决定要同时处理几个 observable，如果我们传入 1 其行为就会跟 concatAll 是一模一样的，这点在源码可以看到他们是完全相同的。

    
  - concatMap

    concatMap 其实就是 map 加上 concatAll 的简化写法，我们直接来看一个范例
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source
      .map(e => Rx.Observable.interval(1000).take(3))
      .concatAll();
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    上面这个范例就可以简化成
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source
      .concatMap(e => Rx.Observable.interval(100).take(3));
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    前后两个行为是一致的，记得 concatMap 也会先处理前一个送出的 observable 在处理下一个 observable
    ~~~shell
    # Marble diagram 图示
    source : -----------c--c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
    example: -------------0-1-2-0-1-2---------...
    ~~~  
    这样的行为也很常被用在发送 request。如下
    ~~~js
    function getPostData() {
      return fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.concatMap(
      e => Rx.Observable.from(getPostData()));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这里我们每点击一下画面就会送出一个 HTTP request，如果我们快速的连续点击，大家可以在开发者工具的 network 看到每个 request 是等到前一个 request 完成才会送出下一个 request。
    <br>
    <br>
    从 network 的图形可以看得出来，第二个 request 的发送时间是接在第一个 request 之后的，我们可以确保每一个 request 会等前一个 request 完成才做处理。
    <br>
    <br>
    concatMap 还有第二个参数是一个 selector callback，这个 callback 会传入四个参数，分別是
    * 外部 observable 送出的元素
    * 内部 observable 送出的元素 
    * 外部 observable 送出元素的 index 
    * 内部 observable 送出元素的 index

    回传值我们想要的值，范例如下
    ~~~js
    function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.concatMap(
      e => Rx.Observable.from(getPostData()),(e, res, eIndex, resIndex) => res.title);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这个范例的外部 observable 送出的元素就是 click event 物件，内部 observable 送出的元素就是 response 物件，这里我们回传 response 物件的 title 属性，这样一来我们就可以直接收到 title，这个方法很适合用在 response 要选取的值跟前一个事件或顺位(index)相关时。
    

  - switchMap

    switchMap 其实就是 map 加上 switch 简化的写法，如下
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source
      .map(e => Rx.Observable.interval(1000).take(3))
      .switch();
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    上面这个范例就可以简化成
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source
      .switchMap(e => Rx.Observable.interval(100).take(3));
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : -----------c--c-----------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
    example: -------------0--0-1-2-----------...
    ~~~  
    只要注意一个重点 switchMap 会在下一个 observable 被送出后直接退订前一个未处理完的 observable，这个部份的细节请看之前 switch 的部分。
    <br>
    <br>
    另外我们也可以把 switchMap 用在发送 HTTP request
    ~~~js
    function getPostData() {
    return fetch('https://jsonplaceholder.typicode.com/posts/1')
      .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.switchMap(
      e => Rx.Observable.from(getPostData()));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    如果我们快速的连续点击五下，可以在开发者工具的 network 看到每个 request 会在点击时发送
    > 灰色是浏览器原生地停顿行为，实际上灰色的一开始就是 fetch 执行送出 request，只是卡在浏览器等待发送。

    虽然我们发送了多个 request 但最后真正印出来的 log 只会有一个，代表前面发送的 request 已经不会造成任何的 side-effect 了，这个很适合用在只看最后一次 request 的情境，比如说 自动完成(auto complete)，我们只需要显示使用者最后一次打在画面上的文字，来做建议选项而不用每一次的。
    <br>
    <br>
    switchMap 跟 concatMap 一样有第二个参数 selector callback 可用来回传我们要的值，这部分的行为跟 concatMap 是一样的，这里就不再赘述。


  - mergeMap

    mergeMap 其实就是 map 加上 mergeAll 简化的写法，如下
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source
      .map(e => Rx.Observable.interval(1000).take(3))
      .mergeAll();
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    上面这个范例就可以简化成
    ~~~js
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source
      .mergeMap(e => Rx.Observable.interval(100).take(3));
    
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    ~~~shell
    # Marble diagram 图示
    source : -----------c--c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
    example: -------------0-1-2-0-1-2---------...
    ~~~ 
    记得 mergeMap 可以并行处理多个 observable，以这个例子来说当我们快速连点两下，元素发送的时间点是有机会重叠的，这个部份的细节大家可以看上一篇文章 merge 的部分。 
    <br>
    <br>
    另外我们也可以把 mergeMap 用在发送 HTTP request
    ~~~js
    function getPostData() {
      return fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.mergeMap(e => Rx.Observable.from(getPostData()));
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    如果我们快速的连续点击五下，大家可以在开发者工具的 network 看到每个 request 会在点击时发送并且会 log 出五个物件
    <br>
    <br>
    mergeMap 也能传入第二个参数 selector callback，这个 selector callback 跟 concatMap 第二个参数也是完全一样的，但 mergeMap 的重点是我们可以传入第三个参数，来限制并行处理的数量
    ~~~js
    function getPostData() {
      return fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.mergeMap(e => Rx.Observable.from(getPostData()),(e, res, eIndex, resIndex) => res.title, 3);
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    这里我们传入 3 就能限制，HTTP request 最多只能同时送出 3 个，并且要等其中一个完成在处理下一个。我连续点按了五下，但第四个 request 是在第一个完成后才送出的，这个很适合用在特殊的需求下，可以限制同时发送的 request 数量。
    > RxJS 5 还保留了 mergeMap 的別名叫 flatMap，虽然官方文件上没有，但这两个方法是完全一样的
    

  - switchMap, mergeMap, concatMap

    这三个 operators 还有一个共同的特性，那就是这三个 operators 可以把第一个参数所回传的 promise 物件直接转成 observable，这样我们就不用再用 Rx.Observable.from 转一次，如下
    ~~~js
    function getPersonData() {
      return fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.concatMap(e => getPersonData());
                                        //直接回传 promise 物件
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    至于在使用上要如何选择这三个 operators？ 其实都还是看使用情境而定，这里简单列一下大部分的使用情境
    * concatMap 用在可以确定内部的 observable 结束时间比外部 observable 发送时间来快的情境，并且不希望有任何并行处理行为，适合少数要一次一次完成到底的的 UI 动画或特別的 HTTP request 行为。
    * switchMap 用在只要最后一次行为的结果，适合绝大多数的使用情境。
    * mergeMap 用在并行处理多个 observable，适合需要并行处理的行为，像是多个 I/O 的并行处理。
    > 建议初学者不确定选哪一个时，使用 switchMap

    > 在使用 concatAll 或 concatMap 时，请注意内部的 observable 一定要能够的结束，且外部的 observable 发送元素的速度不能比内部的 observable 结束时间快太多，不然会有 memory issues
    

  - window
    > window 是一整个家族，总共有五个相关的 operators
    >  * window
    >  * windowCount
    >  * windowTime 
    >  * windowToggle 
    >  * windowWhen

    window 很类似 buffer 可以把一段时间内送出的元素拆出来，buffer 是把拆分出来的元素放到队列并送出队列；window 是把拆分出来的元素放到 observable 并送出 observable，让我们来看一个例子
    ~~~js
    var click = Rx.Observable.fromEvent(document, 'click');
    var source = Rx.Observable.interval(1000);
    var example = source.window(click);
    example
      .switch()
      .subscribe(console.log);
    // 0
    // 1
    // 2
    // 3
    // 4
    // 5 ...
    ~~~
    首先 window 要传入一个 observable，每当这个 observable 送出元素时，就会把正在处理的 observable 所送出的元素放到新的 observable 中并送出
    ~~~shell
    # Marble diagram 图示
    click  : -----------c----------c------------c--
    source : ----0----1----2----3----4----5----6---..
                        window(click)
    example: o----------o----------o------------o--
              \          \          \
              ---0----1-|--2----3--|-4----5----6|
                        switch()
           : ----0----1----2----3----4----5----6---...
    ~~~ 
    这里可以看到 example 变成发送 observable 会在每次 click 事件发送出来后结束，并继续下一个 observable，这里我们用 switch 才把它摊平。
    <br>
    <br>
    当然这个范例只是想单纯的表达 window 的作用，没什么太大的意义，实际业务上 window 会搭配其他的 operators 使用，例如我们想计算一秒钟内触发了几次 click 事件
    ~~~js
    var click = Rx.Observable.fromEvent(document, 'click');
    var source = Rx.Observable.interval(1000);
    var example = click.window(source)
    example
      .map(innerObservable => innerObservable.count())
      .switch()
      .subscribe(console.log);
    ~~~
    注意这里我们把 source 跟 click 对调了，并用到了 observable 的一个方法 count()，可以用来取得 observable 总共送出了几个元素
    ~~~shell
    # Marble diagram 图示
    source : ---------0---------1---------2--...
    click  : --cc---cc----c-c----------------...
                    window(source)
    example: o--------o---------o---------o--..
              \        \         \         \
              -cc---cc|---c-c---|---------|--..
                    count()
           : o--------o---------o---------o--
              \        \         \         \
              -------4|--------2|--------0|--..
                    switch()
           : ---------4---------2---------0--...
    ~~~ 
    从 Marble Diagram 中可以看出来，我们把部分元素放到新的 observable 中，就可以利用 Observable 的方法做更灵活的操作


  - windowToggle

    windowToggle 不像 window 只能控制内部 observable 的结束，windowToggle 可以传入两个参数，第一个是开始的 observable，第二个是一个 callback 可以回传一个结束的 observable，让我们来看范例
    ~~~js
    var source = Rx.Observable.interval(1000);
    var mouseDown = Rx.Observable.fromEvent(document, 'mousedown');
    var mouseUp = Rx.Observable.fromEvent(document, 'mouseup');
    var example = source
      .windowToggle(mouseDown, () => mouseUp)
      .switch();
    
    example.subscribe(console.log);
    ~~~
    ~~~shell
    # Marble diagram 图示
    source   : ----0----1----2----3----4----5--...
    mouseDown: -------D------------------------...
    mouseUp  : ---------------------------U----...
            windowToggle(mouseDown, () => mouseUp)
             : -------o-------------------------...
                       \
                        -1----2----3----4--|
                        switch()
    example  : ---------1----2----3----4---------...  
    ~~~ 
    从 Marble Diagram 可以看得出来，我们用 windowToggle 拆分出来内部的 observable 始于 mouseDown 终于 mouseUp。


  - groupBy

    它可以帮我们把相同条件的元素拆分成一个 Observable，其实就跟平常在下 SQL 是一样个概念，我们先来看个简单的例子
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source
      .groupBy(x => x % 2);
    
    example.subscribe(console.log);
    // GroupObservable { key: 0, ...}
    // GroupObservable { key: 1, ...}
    ~~~
    上面的例子，我们传入了一个 callback function 并回传 groupBy 的条件，就能区分每个元素到不同的 Observable 中
    ~~~shell
    # Marble diagram 图示
    source : ---0---1---2---3---4|
              groupBy(x => x % 2)
    example: ---o---o------------|
                 \   \
                  \   1-------3----|
                  0-------2-------4|
    ~~~ 
    在实际业务上，我们可以拿 groupBy 做完元素的区分后，再对 inner Observable 操作，例如下面这个例子我们将每个人的分数分别做总和再送出
    ~~~js
    var people = [
      {name: 'Anna', score: 100, subject: 'English'},
      {name: 'Anna', score: 90, subject: 'Math'},
      {name: 'Anna', score: 96, subject: 'Chinese' }, 
      {name: 'Jerry', score: 80, subject: 'English'},
      {name: 'Jerry', score: 100, subject: 'Math'},
      {name: 'Jerry', score: 90, subject: 'Chinese' }, 
    ];
    var source = Rx.Observable.from(people)
      .zip(Rx.Observable.interval(300), (x, y) => x);
    var example = source
      .groupBy(person => person.name)
      .map(group => group.reduce((acc, curr) => ({
        name: curr.name,
        score: curr.score + acc.score
    }))).mergeAll();
    
    example.subscribe(console.log);
    // { name: "Anna", score: 286 }
    // { name: 'Jerry', score: 270 }
    ~~~
    这里我们范例是想把 Jerry 跟 Anna 的分数分别做总和
    ~~~shell
    # Marble diagram 图示
    source : --o--o--o--o--o--o|

    groupBy(person => person.name)
    
           : --i--------i------|
                \        \
                 \         o--o--o|
                  o--o--o--|
    
           map(group => group.reduce(...))
             
           : --i---------i------|
               \         \
               o|        o|
            
                 mergeAll()
    example: --o---------o------|
    ~~~ 

## 深入 Observable
> 在系列文章的一开头是以队列(Array)的 operators(map, filter, concatAll) 作为切入点，让读者们在学习 observable 时会更容易接受跟理解，但实际上 observable 的 operators 跟队列的有很大的不同，主要差异有两点
> 1. 延迟运算
> 2. 渐进式取值

  - 延迟运算
   
    延迟运算很好理解，所有 Observable 一定会等到订阅后才开始对元素做运算，如果没有订阅就不会有运算的行为
    ~~~js
    var source = Rx.Observable.from([1,2,3,4,5]);
    var example = source.map(x => x + 1);
    ~~~
    上面这段代码因为 Observable 还没有被订阅，所以不会真的对元素做运算，这跟队列的操作不一样，如下
    ~~~js
    var source = [1,2,3,4,5];
    var example = source.map(x => x + 1);
    ~~~
    上面这段代码执行完，example 就已经取得所有元素的返回值了。
    > 延迟运算是 Observable 跟队列最明显的不同，延迟运算所带来的优势在之前的文章也已经提过这里就不再赘述，因为我们还有一个更重要的差异要讲，那就是渐进式取值


  - 渐进式取值

    队列的 operators 都必须完整的运算出每个元素的返回值并组成一个队列，再做下一个 operator 的运算，我们看下面这段代码
    ~~~js
    var source = [1,2,3];
    var example = source
      .filter(x => x % 2 === 0) // 这里会运算并返回一个完整的队列
      .map(x => x + 1) // 这里也会运算并返回一个完整的队列
    ~~~
    上面这段代码，相信读者们都很熟悉了，大家应该都有注意到 source.filter(...) 就会返回一整个新队列，再接下一个 operator 又会再返回一个新的队列，这一点其实在我们实现 map 跟 filter 时就能观察到
    ~~~js
    Array.prototype.map = function(callback) {
      var result = []; // 建立新队列
      this.forEach(function(item, index, array) {
        result.push(callback(item, index, array))
      });
      return result; // 返回新队列
    }
    ~~~
    每一次的 operator 的运算都会建立一个新的队列，并在每个元素都运算完后返回这个新队列，我们可以用下面这张动态图表示运算过程
    <br>
    <br>
    Observable operator 的运算方式跟队列的是完全的不同，虽然 Observable 的 operator 也都会回传一个新的 observable，但因为元素是渐进式取得的关系，所以每次的运算是一个元素运算到底，而不是运算完全部的元素再返回。
    ~~~js
    var source = Rx.Observable.from([1,2,3]);
    var example = source
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
    example.subscribe(console.log);
    ~~~
    上面这段代码运行的方式是这样的
    * 送出 1 到 filter 被过滤掉
    * 送出 2 到 filter 在被送到 map 转成 3，送到 observer console.log 印出
    * 送出 3 到 filter 被过滤掉

    <br>
    每个元素送出后就是运算到底，在这个过程中不会等待其他的元素运算。这就是渐进式取值的特性，不知道读者们还记不记得我们在讲 Iterator 跟 Observer 时，就特別強调这两个 Pattern 的共同特性是渐进式取值，而我们在实现 Iterator 的过程中其实就能看出这个特性的运作方式
    
    ~~~js
    class IteratorFromArray {
      constructor(arr) {
        this._array = arr;
        this._cursor = 0;
      }
      next() {
        return this._cursor < this._array.length ?
            { value: this._array[this._cursor++], done: false } : { done: true };
      }
      map(callback) {
        const iterator = new IteratorFromArray(this._array);
        return {
          next: () => {
            const { done, value } = iterator.next();
            return {
              done: done,
              value: done ? undefined : callback(value)
            }
          }
        }
      }
    }
    var myIterator = new IteratorFromArray([1,2,3]);
    var newIterator = myIterator.map(x => x + 1);
    newIterator.next(); // { done: false, value: 2 }
    ~~~
    虽然上面这段代码是一个非常简单的示范，但可以看得出来每一次 map 虽然都会返回一个新的 oterator，但实际上在做元素运算时，因为渐进式的特性会使一个元素运算到底，Observable 也是相同的概念，我们可以用下面这张动态图表示运算过程
    <br>
    <br>
    渐进式取值的观念在 Observable 中其实非常的重要，这个特性也使得 Observable 相较于 Array 的 operator 在做运算时来的高效很多，尤其是在处理大量数据的时候会非常明显！

## Subject 基本观念
  - Multiple subscriptions(多次订阅)
    ~~~js
    var source = Rx.Observable.interval(1000).take(3);
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    source.subscribe(observerA);
    source.subscribe(observerB);
    // "A next: 0"
    // "B next: 0"
    // "A next: 1"
    // "B next: 1"
    // "A next: 2"
    // "A complete!"
    // "B next: 2"
    // "B complete!"
    ~~~
    上面这段代码，分別用 observerA 跟 observerB 订阅了 source，从 log 可以看出来 observerA 跟 observerB 都各自收到了元素，但请记得这两个 observer 其实是分开执行的也就是说他们是完全獨立的，我们把 observerB 延迟订阅来證明看看
    ~~~js
    var source = Rx.Observable.interval(1000).take(3);
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    source.subscribe(observerA);
    setTimeout(() => {
      source.subscribe(observerB);
    }, 1000);
    // "A next: 0"
    // "A next: 1"
    // "B next: 0"
    // "A next: 2"
    // "A complete!"
    // "B next: 1"
    // "B next: 2"
    // "B complete!"
    ~~~
    这里我们延迟一秒再用 observerB 订阅，可以从 log 中看出 1 秒后 observerA 已经印到了 1，这时 observerB 开始印却是从 0 开始，而不是接着 observerA 的进度，代表这两次的订阅是完全分开来执行的，或者说是每次的订阅都建立了一个新的执行。
    <br>
    <br>
    这样的行为在大部分的情境下适用，但有些案例下我们会希望第二次订阅 source 不会从头开始接收元素，而是从第一次订阅到当前处理的元素开始发送，我们把这种处理方式称为组播(multicast)，那我们要如何做到组播呢？
    

  - 手动建立 subject

    或许已经有读者想到解法了，其实我们可以建立一个中间人来订阅 source 再由中间人转送数据出去，就可以达到我们想要的效果
    ~~~js
    var source = Rx.Observable.interval(1000).take(3);
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    var subject = {
      observers: [],
      addObserver: function(observer) {
        this.observers.push(observer)
      },
      next: function(value) {
        this.observers.forEach(o => o.next(value))    
      },
      error: function(error){
        this.observers.forEach(o => o.error(error))
      },
      complete: function() {
        this.observers.forEach(o => o.complete())
      }
    }
    subject.addObserver(observerA)
    source.subscribe(subject);
    setTimeout(() => {
      subject.addObserver(observerB);
    }, 1000);
    // "A next: 0"
    // "A next: 1"
    // "B next: 1"
    // "A next: 2"
    // "B next: 2"
    // "A complete!"
    // "B complete!"
    ~~~
    从上面的代码可以看到，我们先建立了一个物件叫 subject，这个物件具备 observer 所有的方法(next, error, complete)，并且还能 addObserver 把 observer 加到内部的清单中，每当有值送出就会遍历清单中的所有 observer 并把值再次送出，这样一来不管多久之后加进来的 observer，都会是从当前处理到的元素接续往下走，就像范例中所示，我们用 subject 订阅 source 并把 observerA 加到 subject 中，一秒后再把 observerB 加到 subject，这时就可以看到 observerB 是直接收 1 开始，这就是组播(multicast)的行为。
    <br>
    <br>
    让我们把 subject 的 addObserver 改名成 subscribe 如下
    ~~~js
    var subject = {
      observers: [],
      subscribe: function(observer) {
        this.observers.push(observer)
      },
      next: function(value) {
        this.observers.forEach(o => o.next(value))    
      },
      error: function(error){
        this.observers.forEach(o => o.error(error))
      },
      complete: function() {
        this.observers.forEach(o => o.complete())
      }
    }
    ~~~
    > 应该有眼尖的读者已经发现，subject 其实就是用了 Observer Pattern。但这边为了不要混淆 Observer Pattern 跟 RxJS 的 observer 就不再内文提及。这也是为什么我们在一开始讲 Observer Pattern 希望大家親自实现的原因。

    虽然上面是我们自己手写的 subject，但运作方式跟 RxJS 的 Subject 实例是几乎一样的，我们把前面的代码改成 RxJS 提供的 Subject 试试
    ~~~js
    var source = Rx.Observable.interval(1000).take(3);
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    var subject = new Rx.Subject()
    subject.subscribe(observerA)
    source.subscribe(subject);
    setTimeout(() => {
      subject.subscribe(observerB);
    }, 1000);
    // "A next: 0"
    // "A next: 1"
    // "B next: 1"
    // "A next: 2"
    // "B next: 2"
    // "A complete!"
    // "B complete!"
    ~~~
    大家会发现使用方式跟前面是相同的，建立一个 subject 先拿去订阅 observable(source)，再把我们真正的 observer 加到 subject 中，这样一来就能完成订阅，而每个加到 subject 中的 observer 都能整组的接收到相同的元素。


  - 什么是 Subject?
    
    虽然前面我们已经示范直接手写一个简单的 subject，但到底 RxJS 中的 Subject 的概念到底是什么呢？
    <br>
    <br>
    首先 Subject 可以拿去订阅 Observable(source) 代表他是一个 Observer，同时 Subject 又可以被 Observer(observerA, observerB) 订阅，代表他是一个 Observable。
    <br>
    <br>
    总结成两句话

    * Subject 同时是 Observable 又是 Observer
    * Subject 会对内部的 observers 清单进行组播(multicast)
    > 其实 Subject 就是 Observer Pattern 的实现并且继承自 Observable。他会在内部管理一份 observer 的清单，并在接收到值时遍历这份清单并送出值，所以我们可以这样用 Subject
    
    ~~~js
    var subject = new Rx.Subject();
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    subject.subscribe(observerA);
    subject.subscribe(observerB);
    subject.next(1);
    // "A next: 1"
    // "B next: 1"
    subject.next(2);
    // "A next: 2"
    // "B next: 2"
    ~~~
    这里我们可以直接用 subject 的 next 方法传送值，所有订阅的 observer 就会接收到，又因为 Subject 本身是 Observable，所以这样的使用方式很适合用在某些无法直接使用 Observable 的前端框架中，例如在 React 想对 DOM 的事件做监听
    ~~~js
    class MyButton extends React.Component {
      constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.subject = new Rx.Subject();
        
        this.subject
          .mapTo(1)
          .scan((origin, next) => origin + next)
          .subscribe(x => {
            this.setState({ count: x })
          })
      }
      render() {
        return <button onClick={event => this.subject.next(event)}>{this.state.count}</button>
      }
    }
    ~~~    
    从上面的代码可以看出来，因为 React 本身 API 的关系，如果我们想要用 React 自订的事件，我们没办法直接使用 Observable 的 creation operator 建立 observable，这时就可以靠 Subject 来做到这件事。
    <br>
    <br>
    Subject 因为同时是 observer 和 observable，所以应用面很广除了前面所提的之外，还有上一篇文章讲的组播(multicast)特性也会在接下来的文章做更多应用的介紹，这里先让我们来看看 Subject 的三个变形。


  - BehaviorSubject

    很多时候我们会希望 Subject 能代表当下的状态，而不是单存的事件发送，也就是说如果今天有一个新的订阅，我们希望 Subject 能立即给出最新的值，而不是没有回应，例如下面这个例子
    ~~~js
    var subject = new Rx.Subject();
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    subject.subscribe(observerA);
    subject.next(1);
    // "A next: 1"
    subject.next(2);
    // "A next: 2"
    subject.next(3);
    // "A next: 3"
    setTimeout(() => {
      subject.subscribe(observerB); // 3 秒后才订阅，observerB 不会收到任何值。
    },3000)
    ~~~
    以上面这个例子来说，observerB 订阅的之后，是不会有任何元素送给 observerB 的，因为在这之后没有执行任何 subject.next()，但很多时候我们会希望 subject 能够表达当前的状态，在一订阅时就能收到最新的状态是什么，而不是订阅后要等到有变动才能接收到新的状态，以这个例子来说，我们希望 observerB 订阅时就能立即收到 3，希望做到这样的效果就可以用 BehaviorSubject。
    <br>
    <br>
    BehaviorSubject 跟 Subject 最大的不同就是 BehaviorSubject 是用来呈现当前的值，而不是单纯的发送事件。BehaviorSubject 会记住最新一次发送的元素，并把该元素当作目前的值，在使用上 BehaviorSubject 构造函数需要传入一个参数来代表起始的状态，范例如下
    ~~~js
    var subject = new Rx.BehaviorSubject(0); // 0 为起始值
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    subject.subscribe(observerA);
    // "A next: 0"
    subject.next(1);
    // "A next: 1"
    subject.next(2);
    // "A next: 2"
    subject.next(3);
    // "A next: 3"
    setTimeout(() => {
      subject.subscribe(observerB);
      // "B next: 3"
    },3000)
    ~~~
    从上面这个范例可以看得出来 BehaviorSubject 在建立时就需要给定一个状态，并在之后任何一次订阅，就会先送出最新的状态。其实这种行为就是一种状态的表达而非单存的事件，就像是年齡跟生日一样，年齡是一种状态而生日就是事件；所以当我们想要用一个 stream 来表达年齡时，就应该用 BehaviorSubject。


  - ReplaySubject

    在某些时候我们会希望 Subject 代表事件，但又能在新订阅时重新发送最后的几个元素，这时我们就可以用 ReplaySubject，范例如下
    ~~~js
    var subject = new Rx.ReplaySubject(2); // 重复发送最后 2 个元素
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    subject.subscribe(observerA);
    subject.next(1);
    // "A next: 1"
    subject.next(2);
    // "A next: 2"
    subject.next(3);
    // "A next: 3"
    setTimeout(() => {
      subject.subscribe(observerB);
      // "B next: 2"
      // "B next: 3"
    },3000)
    ~~~
    可能会有人以为 ReplaySubject(1) 是不是就等同于 BehaviorSubject，其实是不一样的，BehaviorSubject 在建立时就会有起始值，比如 BehaviorSubject(0) 起始值就是 0，BehaviorSubject 是代表着状态而 ReplaySubject 只是事件的重放而已。


  - AsyncSubject

    AsyncSubject 是最怪的一个变形，他有点像是 operator last，会在 subject 结束后送出最后一个值，范例如下
    ~~~js
    var subject = new Rx.AsyncSubject();
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    subject.subscribe(observerA);
    subject.next(1);
    subject.next(2);
    subject.next(3);
    subject.complete();
    // "A next: 3"
    // "A complete!"
    setTimeout(() => {
      subject.subscribe(observerB);
      // "B next: 3"
      // "B complete!"
    },3000)
    ~~~
    从上面的代码可以看出来，AsyncSubject 会在 subject 结束后才送出最后一个值，其实这个行为跟 Promise 很像，都是等到事情结束后送出一个值，但实际业务上我们非常非常少用到 AsyncSubject，绝大部分的时候都是使用 BehaviorSubject 跟 ReplaySubject 或 Subject。

    >我们把 AsyncSubject 放在大脑的深处就好

  - multicast

    multicast 可以用来挂载 subject 并回传一个可连接(connectable)的 observable，如下
    ~~~js
    var source = Rx.Observable.interval(1000)
      .take(3)
      .multicast(new Rx.Subject());
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    source.subscribe(observerA); // subject.subscribe(observerA)
    source.connect(); // source.subscribe(subject)
    setTimeout(() => {
      source.subscribe(observerB); // subject.subscribe(observerB)
    }, 1000);
    ~~~
    上面这段代码我们透过 multicast 来挂载一个 subject 之后这个 observable(source) 的订阅其实都是订阅到 subject 上。
    ~~~js
    source.subscribe(observerA); // subject.subscribe(observerA)
    ~~~
    必须真的等到 执行 connect() 后才会真的用 subject 订阅 source，并开始送出元素，如果没有执行 connect() observable 是不会真正执行的。
    ~~~js
    source.connect();
    ~~~
    另外值得注意的是这里要退订的话，要把 connect() 回传的 subscription 退订才会真正停止 observable 的执行，如下
    ~~~js
    var source = Rx.Observable.interval(1000)
      .do(x => console.log('send: ' + x))
      .multicast(new Rx.Subject()); // 无限的 observable 
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    var subscriptionA = source.subscribe(observerA);
    var realSubscription = source.connect();
    var subscriptionB;
    setTimeout(() => {
      subscriptionB = source.subscribe(observerB);
    }, 1000);
    setTimeout(() => {
      subscriptionA.unsubscribe();
      subscriptionB.unsubscribe();
    // 这里虽然 A 跟 B 都退订了，但 source 还会继续送元素
    }, 5000);
    setTimeout(() => {
      realSubscription.unsubscribe();
    // 这里 source 才会真正停止送元素
    }, 7000);
    ~~~
    上面这段的代码，必须等到 realSubscription.unsubscribe() 执行完，source 才会真的结束。
    <br>
    <br>
    虽然用了 multicast 感觉会让我们处理的对象少一点，但必须搭配 connect 一起使用还是让代码有点复杂，通常我们会希望有 observer 订阅时，就立即执行并发送元素，而不要再多执行一个方法(connect)，这时我们就可以用 refCount。

  - refCount

    refCount 必须搭配 multicast 一起使用，他可以建立一个只要有订阅就会自动 connect 的 observable，范例如下
    ~~~js
    var source = Rx.Observable.interval(1000)
      .do(x => console.log('send: ' + x))
      .multicast(new Rx.Subject())
      .refCount();
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    var subscriptionA = source.subscribe(observerA);
    // 订阅数 0 => 1
    var subscriptionB;
    setTimeout(() => {
      subscriptionB = source.subscribe(observerB);
    // 订阅数 0 => 2
    }, 1000);
    ~~~
    上面这段代码，当 source 一被 observerA 订阅时(订阅数从 0 变成 1)，就会立即执行并发送元素，我们就不需要再额外执行 connect。
    ~~~js
    var source = Rx.Observable.interval(1000)
      .do(x => console.log('send: ' + x))
      .multicast(new Rx.Subject())
      .refCount();
    var observerA = {
      next: value => console.log('A next: ' + value),
      error: error => console.log('A error: ' + error),
      complete: () => console.log('A complete!')
    }
    var observerB = {
      next: value => console.log('B next: ' + value),
      error: error => console.log('B error: ' + error),
      complete: () => console.log('B complete!')
    }
    var subscriptionA = source.subscribe(observerA);
    // 订阅数 0 => 1
    var subscriptionB;
    setTimeout(() => {
      subscriptionB = source.subscribe(observerB);
    // 订阅数 0 => 2
    }, 1000);
    setTimeout(() => {
      subscriptionA.unsubscribe(); // 订阅数 2 => 1
      subscriptionB.unsubscribe(); // 订阅数 1 => 0，source 停止发送元素
    }, 5000);
    ~~~
    
  - publish

    其实 multicast(new Rx.Subject()) 很常用到，我们有一个简化的写法那就是 publish，下面这两段代码是完全等价的
    ~~~js
    var source = Rx.Observable.interval(1000)
      .publish() 
      .refCount();
             
    // var source = Rx.Observable.interval(1000)
    //   .multicast(new Rx.Subject())
    //   .refCount();
    ~~~
    加上 Subject 的三种变形
    ~~~js
    var source = Rx.Observable.interval(1000)
      .publishReplay(1) 
      .refCount();
             
    // var source = Rx.Observable.interval(1000)
    //   .multicast(new Rx.ReplaySubject(1))
    //   .refCount();
    ~~~
    ~~~js
    var source = Rx.Observable.interval(1000)
      .publishBehavior(0) 
      .refCount();
             
    // var source = Rx.Observable.interval(1000)
    //   .multicast(new Rx.BehaviorSubject(0))
    //   .refCount();
    ~~~
    ~~~js
    var source = Rx.Observable.interval(1000)
      .publishLast() 
      .refCount();
             
    // var source = Rx.Observable.interval(1000)
    //   .multicast(new Rx.AsyncSubject(1))
    //   .refCount();
    ~~~
    
  - share

    另外 publish + refCount 可以在简写成 share
    ~~~js
    var source = Rx.Observable.interval(1000).share();
             
    // var source = Rx.Observable.interval(1000)
    //   .publish()
    //   .refCount();
    // var source = Rx.Observable.interval(1000)
    //   .multicast(new Rx.Subject())
    //   .refCount();
    ~~~

## Subject 总结
Subject 其实在 RxJS 中最常被误解的一部份，因为 Subject 可以让你用命令式的方式输送值到一个 observable 的串流中。

很多人会直接把 Subject 拿来用在 不知道如何建立 Observable 的状况，比如我之前提到的可以用在 ReactJS 的 Event 中，来建立 event 的 observable

~~~js
class MyButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = { count: 0 };
        this.subject = new Rx.Subject();
        
        this.subject
            .mapTo(1)
            .scan((origin, next) => origin + next)
            .subscribe(x => {
                this.setState({ count: x })
            })
    }
    render() {
        return <button onClick={event => this.subject.next(event)}>{this.state.count}</button>
    }
}
~~~
因为在 React API 的关系，如果我们想要把 React Event 转乘 observable 就可以用 Subject 帮我们做到这件事；但绝大多数的情况我们是可以透过 Observable.create 来做到这件事，像下面这样
~~~js
const example = Rx.Observable.creator(observer => {
    const source = getSomeSource(); // 某个数据源
    source.addListener('some', (some) => {
        observer.next(some)
    })
});
~~~
大概就会像上面这样，如果没有合适的 creation operators 我们还是可以利用 Observable.create 来建立 observable，除非真的因为框架限制才会直接用 Subject。

  - Subject 与 Observable 的差异
    <br>
    <br>
    永远记得 Subject 其实是 Observer Design Pattern 的实现，所以当 observer 订阅到 subject 时，subject 会把订阅者塞到一份订阅者清单，在元素发送时就是在遍历这份清单，并把元素一一送出，这跟 Observable 像是一个 function 执行是完全不同的。
    <br>
    <br>
    Subject 之所以具有 Observable 的所有方法，是因为 Subject 继承了 Observable 的类型，其实 Subject 类型中主要实做的方法只有 next、error、 complete、subscribe 及 unsubscribe 这五个方法，而这五个方法就是依照 Observer Pattern 下去实现的。
    <br>
    <br>
    总而言之，Subject 是 Observable 的子类別，这个子类別当中用上述的五个方法实现了 Observer Pattern，所以他同时具有 Observable 与 Observer 的特性，而跟 Observable 最大的差异就是 Subject 是具有状态的，也就是储存的那份清单！


  - 当前版本会遇到的问题
    <br>
    <br>
    因为 Subject 在订阅时，是把 observer 放到一份清单当中，并在元素要送出(next)的时候遍历这份清单，大概就像下面这样
    ~~~js
    //...
    next() {
        // observers 是一个队列存有所有的 observer
        for (let i = 0; i < observers.length; i++) {
            observers[i].next(value);
        }
    }
    //...
    ~~~
    这会衍伸一个大问题，就是在某个 observer 发生错误却没有做错误处理时，就会影响到別的订阅，看下面这个例子
    ~~~js
    const source = Rx.Observable.interval(1000);
    const subject = new Rx.Subject();
    const example = subject.map(x => {
        if (x === 1) {
            throw new Error('oops');
        }
        return x;
    });
    subject.subscribe(x => console.log('A', x));
    example.subscribe(x => console.log('B', x));
    subject.subscribe(x => console.log('C', x));
    source.subscribe(subject);
    ~~~
    上面这个例子，大家可能会预期 B 会在送出 1 的时候挂掉，另外 A 跟 C 则会持续发送元素，确实正常应该像这样运行；但目前 RxJS 的版本中会在 B 报错之后，A 跟 C 也同时停止运行。原因就像我前面所提的，在遍历所有 observer 时发生了例外会导致之后的行为停止。
    > 这个应该会在之后的版本中改掉的

    那要如何解决这个问题呢？ 目前最简单的方式当然是尽可能地把所有 observer 的错误处理加进去，这样一来就不会有例外发生
    ~~~js
    const source = Rx.Observable.interval(1000);
    const subject = new Rx.Subject();
    const example = subject.map(x => {
        if (x === 1) {
            throw new Error('oops');
        }
        return x;
    });
    subject.subscribe(x => console.log('A', x), error => console.log('A Error:' + error));
    example.subscribe(x => console.log('B', x), error => console.log('B Error:' + error));
    subject.subscribe(x => console.log('C', x), error => console.log('C Error:' + error));
    source.subscribe(subject);
    ~~~    
    像上面这段代码，当 B 发生错误时就只有 B 会停止，而不会影响到 A 跟 C。

    当然还有另一种解法是用 Scheduler，但因为我们这系列的文章还没有讲到 Scheduler 所以这个解法大家看看就好
    ~~~js
    const source = Rx.Observable.interval(1000);
    const subject = new Rx.Subject().observeOn(Rx.Scheduler.asap);
    const example = subject.map(x => {
        if (x === 1) {
            throw new Error('oops');
        }
        return x;
    });
    subject.subscribe(x => console.log('A', x));
    example.subscribe(x => console.log('B', x));
    subject.subscribe(x => console.log('C', x));
    source.subscribe(subject);
    ~~~


  - 一定需要使用 Subject 的时机？
    <br>
    <br>
    Subject 必要的使用时机除了本篇文章一开始所提的之外，正常应该是当我们一个 observable 的操作过程中发生了 side-effect 而我们不希望这个 side-effect 因为多个 subscribe 而被触发多次，比如说下面这段代码
    ~~~js
    var result = Rx.Observable.interval(1000).take(6)
      .map(x => Math.random()); // side-effect，平常有可能是呼叫 API 或其他 side effect
    var subA = result.subscribe(x => console.log('A: ' + x));
    var subB = result.subscribe(x => console.log('B: ' + x));
    ~~~
    这段代码 A 跟 B 印出来的乱数就不一样，代表 random(side-effect) 被执行了两次，这种情况就一定会用到 subject(或其相关的 operators)
    ~~~js
    var result = Rx.Observable.interval(1000).take(6)
      .map(x => Math.random()) // side-effect
      .multicast(new Rx.Subject())
      .refCount();
    var subA = result.subscribe(x => console.log('A: ' + x));
    var subB = result.subscribe(x => console.log('B: ' + x));
    ~~~
    改成这样后我们就可以让 side-effect 不会因为订阅数而多执行，这种情况就是一定要用 subject 的。


## 简易实现Observable
  - 重点观念
    
    Observable 跟 Observer Pattern 是不同的，Observable 内部并没有管理一份订阅清单，订阅 Observable 就像是执行一个 function 一样！

    所以实现过程的重点
    * 订阅就是执行一个 function
    * 订阅接收的物件具备 next, error, complete 三个方法
    * 订阅会返回一个可退订(unsubscribe)的物件

  - 基本 observable 实现
    先用最简单的 function 来建立 observable 物件
    ~~~js
    function create(subscriber) {
        var observable = {
            subscribe: function(observer) {
                subscriber(observer)
            }       
        };
        return observable;
    }
    ~~~
    上面这段代码就可以做最简单的订阅，像下面这样
    ~~~js
    function create(subscriber) {
      var observable = {
        subscribe: function(observer) {
          subscriber(observer)
        }       
      };
      return observable;
    }
    var observable = create(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
    })
    var observer = {
      next: function(value) {
        console.log(value)
      }
    }
    observable.subscribe(observer)
    // 1
    // 2
    // 3
    ~~~
    这时我们已经有最简单的功能了，但这里有一个大问题，就是 observable 在结束(complete)就不应该再发送元素
    ~~~js
    var observable = create(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      observer.next('still work');
    })
    var observer = {
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!')
      }
    }
    observable.subscribe(observer)
    // 1
    // 2
    // 3
    // "complete!"
    // "still work"
    ~~~
    从上面的代码可以看到 complete 之后还是能送元素出来，另外还有一个问题就是 observer，如果是不完整的就会出错，这也不是我们希望看到的。
    ~~~js
    var observable = create(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete(); // error: complete is not a function
    })
    var observer = {
      next: function(value) {
        console.log(value)
      }
    }
    observable.subscribe(observer)
    // 1
    // 2
    // 3
    // "complete!"
    // "still work"
    ~~~
    上面这段代码可以看出来，当使用者 observer 物件没有 complete 方法时，就会报错。 我们应该修正这两个问题！


  - 实现简易 Observer
    <br>
    <br>
    要修正这两个问题其实并不难，我们只要实现一个 Observer 的类，每次使用者传入的 observer 都会利用这个类別转乘我们想要 Observer 物件。
    <br>
    <br>
    首先订阅时有可能传入一个 observer 物件，或是一到三个 function(next, error, complete)，所以我们要建立一个类別可以接受各种可能的参数
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
        switch (arguments.length) {
          case 0:
            // 空的 observer
          case 1:
            if (!destinationOrNext) {
            // 空的 observer
            }
            if (typeof destinationOrNext === 'object') {
            // 传入了 observer 物件
            }
          default:
            // 如果上面都不是，代表应该是传入了一到三个 function
          break;
        }
      }
    }
    ~~~
    写一个方法(safeObserver)来回传正常的 observer
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
      // ... 一些代码
      }
      safeObserver(observerOrNext, error, complete) {
        let next;
        if (typeof (observerOrNext) === 'function') {
          // observerOrNext 是 next function
          next = observerOrNext;
        } else if (observerOrNext) {
          // observerOrNext 是 observer 物件
          next = observerOrNext.next || () => {};
          error = observerOrNext.error || function(err) {
            throw err
          };
          complete = observerOrNext.complete || () => {};
        }
        // 最后回传我们预期的 observer 物件
        return {
          next: next,
          error: error,
          complete: complete
        };
      }
    }
    ~~~
    再把 constructor 完成
    ~~~js
    // 预设空的 observer 
    const emptyObserver = {
      next: () => {},
      error: (err) => { throw err; },
      complete: () => {}
    }
    class Observer {
      constructor(destinationOrNext, error, complete) {
      switch (arguments.length) {
        case 0:
          // 空的 observer
          this.destination = this.safeObserver(emptyObserver);
        break;
        case 1:
          if (!destinationOrNext) {
            // 空的 observer
            this.destination = this.safeObserver(emptyObserver);
            break;
          }
          if (typeof destinationOrNext === 'object') {
            // 传入了 observer 物件
            this.destination = this.safeObserver(destinationOrNext);
            break;
          }
        default:
          // 如果上面都不是，代表应该是传入了一到三个 function
          this.destination = this.safeObserver(destinationOrNext, error, complete);
          break;
        }
      }
      safeObserver(observerOrNext, error, complete) {
      // ... 一些代码
      }
    }
    ~~~
    这里我们把真正的 observer 塞到 this.destination，接着完成 observer 的方法。
    <br>
    <br>
    Observer 的三个主要的方法(next, error, complete)都应该结束或退订后不能再被执行，所以我们在物件内部偷塞一个 boolean 值来作为是否曾經结束的依据。
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
        // ... 一些代码
      }
      safeObserver(observerOrNext, error, complete) {
        // ... 一些代码
      }
      unsubscribe() {
        this.isStopped = true; // 偷塞一个属性 isStopped
      }
    }
    ~~~
    接着要实现三个主要的方法就很简单了，只要先判断 isStopped 在使用 this.destination 物件来传送值就可以了
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
        // ... 一些代码
      }
      safeObserver(observerOrNext, error, complete) {
        // ... 一些代码
      }
      next(value) {
        if (!this.isStopped && this.next) {
          // 先判断是否停止过
          try {
            this.destination.next(value); // 传送值
          } catch (err) {
            this.unsubscribe();
            throw err;
          }
        }
      }
      error(err) {
        if (!this.isStopped && this.error) {
          // 先判断是否停止过
          try {
            this.destination.error(err); // 传送错误
          } catch (anotherError) {
            this.unsubscribe();
            throw anotherError;
          }
          this.unsubscribe();
        }
      }
      complete() {
        if (!this.isStopped && this.complete) {
        // 先判断是否停止过
          try {
            this.destination.complete(); // 发送停止讯息
          } catch (err) {
            this.unsubscribe();
            throw err;
          }
            this.unsubscribe(); // 发送停止讯息后退订
        }
      }
      unsubscribe() {
        this.isStopped = true;
      }
    }
    ~~~
    到这里我们就完成基本的 Observer 实现了，接着让我们拿到基本版的 observable 中使用吧。
    ~~~js
    function create(subscriber) {
      const observable = {
        subscribe: function(observerOrNext, error, complete) {
          const realObserver = new Observer(observerOrNext, error, complete)
          subscriber(realObserver);
          return realObserver;
        }      
      };
      return observable;
    }
    var observable = create(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      observer.next('not work');
    })
    var observer = {
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!')
      }
    }
    observable.subscribe(observer);
    // 1
    // 2
    // 3
    // complete!
    ~~~
    到这里我们就完成最基本的 observable 了，至少基本的行为都跟我们期望的一致，我知道读者们仍然不会放过我，你们会希望做出一个 Observable 类型以及至少一个 operator 对吧？ 不用担心，我们下一篇就会讲解如何建立一个 Observable 类型和 operator 的方法！


  - 建立简易 Observable 类
    <br>
    <br>
    根据之前我们建立的 observable 物件的函数可以看出来，回传的 observable 物件至少会有 subscribe 方法，所以最简单的 Observable 类別大概会長像下面这样
    ~~~js
    class Observable {
      subscribe() {
        // ...做某些事
      }
    }
    ~~~
    另外 create 的函数在执行时会传入一个 subscribe 的 function，这个 function 会决定 observable 的行为，我们改成下面这样
    ~~~js
    var observable = new Observable(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      observer.next('not work');
    })
    ~~~
    所以我们的 Observable 的构造函数应该会接收一个 subscribe function
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到属性中
        }
      }
      subscribe() {
        // ...做某些事
      }
    }
    ~~~
    接着我们就能完成 subscribe 要做的事情了
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到 _subscribe 属性中
        }
      }
      subscribe() {
        const observer = new Observer(...arguments);
        this._subscribe(observer); // 就是执行一个 function 对吧
        return observer;
      }
    }
    ~~~
    到这里我们就成功的把 create 的函数改成 Observable 的类別了，我们可以直接来使用看看
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到属性中
        }
      }
      subscribe() {
        const observer = new Observer(...arguments);
        this._subscribe(observer);
        return observer;
      }
    }
    var observable = new Observable(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      observer.next('not work');
    })
    var observer = {
      next: function(value) {
        console.log(value)
      },
      complete: function() {
        console.log('complete!')
      }
    }
    observable.subscribe(observer);
    ~~~
    我们可以仿 RxJS 在静态方法中加入 create，如下
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到属性中
        }
      }
      subscribe() {
        const observer = new Observer(...arguments);
        this._subscribe(observer);
        return observer;
      }
    }
    Observable.create = function(subscribe) {
      return new Observable(subscribe);
    }
    ~~~
    这样一来我们就可以用 Observable.create 建立 observable 物件实例。
    ~~~js
    var observable = Observable.create(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      observer.next('not work');
    });
    ~~~
    <br>
  - 建立 transform operator - map
    <br>
    <br>
    相信很多人在实现 Observable 都是卡在这个阶段，因为 operators 都是回传一个新的 observable 这中间有很多细节需要注意，并且有些小技巧才能比较好的实现，在开始实现之前先让我们理清几个重点
    * operators(transform, filter, conditional...) 都是回传一个新个 observable
    * 大部分的 operator 其实就是在原本 observer 外包裹一层物件，让执行 next 方法前先把元素做一次处理
    * operator 回传的 observable 订阅时，还是需要执行原本的 observable(数据源)，也就说我们要想办法保留原本的 observable

    让我们一步一步来，首先 operators 执行完会回传一个新的 observable，这个 observable 在订阅时会先去执行 operator 的行为再发送元素，所以 observable 的订阅方法就不能像现在这样直接把 observer 传给 subscribe 执行
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到属性中
        }
      }
      subscribe() {
        const observer = new Observer(...arguments);
        // 先做某个判断是否当前的 observable 是具有 operator 的
        if(??) {
          // 用 operator 的操作
        } else {
          // 如果没有 operator 再直接把 observer 丟给 _subscribe
          this._subscribe(observer);
        }
        return observer;
      }
    }
    ~~~
    > 以我们的 Observable 实现为例，这里最重要的就是 this._subscribe 执行，每当执行时就是开始发送元素。
    
    这里我们可以想像一下当一个 map 产生的 observable 订阅时，应该先判断出有 map 这个 operator 并且传入原本的数据源以及当前的 observer。也就是说我们的 map 至少有以下这几件事要做
    * 建立新的 observable
    * 保存原本的 observable(数据源)，之后订阅时才有办法执行
    * 建立并保存 operator 本身的行为，等到订阅时执行
    ~~~js
    class Observable {
      constructor(subscribe) {
        // 一些代码...
      }
      subscribe() {
        // 一些代码...
      }
      map(callback) {
        const observable = new Observable(); // 建立新的 observable
        observable.source = this; // 保存当前的 observable(数据源)
        observable.operator = {
          call: (observer, source) => { 
            // 执行这个 operator 的行为
          }
        }; // 储存当前 operator 行为，并作为是否有 operator 的依据  
        return observable; // 返回这个新的 observable
      }
    }
    ~~~
    上面这三个步骤都是必要的，特別是用到了 observable.source = this 这个小技巧，来保存原本的 observable。但这里我们还有一个地方没完成就是 operator 要做的事，这个部分我们等一下再补，先把 subscribe 写完
    ~~~js
    class Observable {
      constructor(subscribe) {
        // 一些代码...
      }
      subscribe() {
        const observer = new Observer(...arguments);
        // 先用 this.operator 判断当前的 observable 是否具有 operator
        if(this.operator) {
          this.operator.call(observer, this.source)
        } else {
          // 如果没有 operator 再直接把 observer 丟给 _subscribe
          this._subscribe(observer);
        }
        return observer;
      }
      map(callback) {
        const observable = new Observable(); // 建立新的 observable
        observable.source = this; // 保存当前的 observable(数据源)
        observable.operator = {
          call: (observer, source) => {
            // 执行这个 operator 的行为
          }
        } // 储存当前 operator 行为，并作为是否有 operator 的依据
        return observable; // 返回这个新的 observable
      }
    }
    ~~~
    记得这里补的 subscribe 行为，已经是 map 回传新 observable 的行为，不是原本的 observable 了。
    <br>
    <br>
    到这里我们就几乎要完成了，接着只要实现 map 这个 operator 的行为就可以啰！记得我们在前面讲的 operator 其实就是在原本的 observer 做一层包裹，让 next 执行前先对元素做处理，所以我们改写一下 Observer 并建立一个 MapObserver 来做这件事
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
        switch (arguments.length) {
          case 0:
            this.destination = this.safeObserver(emptyObserver);
          break;
          case 1:
            if (!destinationOrNext) {
              this.destination = this.safeObserver(emptyObserver);
              break;
            }
            // 多一个判断，是否传入的 destinationOrNext 原本就是 Observer 的实例，如果是就不用在用执行 `this.safeObserver`
            if(destinationOrNext instanceof Observer){
              this.destination = destinationOrNext;
              break;
            }
            if (typeof destinationOrNext === 'object') {
              this.destination = this.safeObserver(destinationOrNext);
              break;
            }
          default:
            this.destination = this.safeObserver(destinationOrNext, error, complete);
          break;
        }
      }

      // ...下面都一样
    }
    class MapObserver extends Observer {
      constructor(observer, callback) {
        // 这里会传入原本的 observer 跟 map 的 callback
        super(observer); // 因为有继承所以要先执行一次父层的构造函数
        this.callback = callback; // 保存 callback
        this.next = this.next.bind(this); // 确保 next 的 this
      }
      next(value) {
        try {
          this.destination.next(this.callback(value));
          // this.destination 是父层 Observer 保存的 observer 物件
          // 这里 this.callback(value) 就是 map 的操作
        } catch (err) {
          this.destination.error(err);
          return;
        }
      }
    }
    ~~~
    上面这段代码就可以让我们包裹 observer 物件，利用物件的继承覆写原本的 next 方法。
    <br>
    <br>
    最后我们就只要补完 map 方法就可以了
    ~~~js
    class Observable {
      constructor(subscribe) {
        // 一些代码...
      }
      subscribe() {
        // 一些代码...
      }
      map(callback) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = {
          call: (observer, source) => {
            // 执行这个 operator 的行为
            const newObserver = new MapObserver(observer, callback);
            // 建立包裹后的 observer
            // 订阅原本的数据源，并回传
            return source.subscribe(newObserver);
          }
        };    
        return observable;
      }
    }
    ~~~
    这里做的事情就简单很多，我们只要建立包裹过的 observer，并用这个包裹后的 observer 订阅原本的 source。(记得这个 function 是在 subscribe 时执行的)

## Scheduler 基本观念
其实 RxJS 用久了之后就会发现 Observable 有一个优势是可以同时处理同步和异步行为，但这个优势也带来了一个问题，就是我们常常会搞不清处现在的 observable 执行方式是同步的还是异步的。换句话说，我们很容易搞不清楚 observable 到底什么时候开始发送元素！
<br>
<br>
舉例来说，我们可能很清楚 interval 是异步送出元素的，但 range 呢？ from 呢？他们可能有时候是异步有时候是同步，这就会变得有点困擾，尤其在除错时执行顺序就非常重要。
<br>
<br>
而 Scheduler 基本上就是拿来处理这个问题的！

- 什么是 Scheduler？
  <br>
  Scheduler 控制一个 observable 的订阅什么时候开始，以及发送元素什么时候送达，主要由以下三个元素所组成

  * Scheduler 是一个数据结構。 它知道如何根据优先級或其他标準来储存并佇列任务。
  * Scheduler 是一个执行环境。 它意味着任务何时何地被执行，比如像是 立即执行、在回呼(callback)中执行、setTimeout 中执行、animation frame 中执行
  * Scheduler 是一个虛擬时钟。 它透过 now() 这个方法提供了时间的概念，我们可以让任务在特定的时间点被执行。
<br>
<br>
    简言之 Scheduler 会影响 Observable 开始执行及元素送达的时机，比如下面这个例子
    ~~~js
    var observable = Rx.Observable.create(function (observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    });
    console.log('before subscribe');
    observable.observeOn(Rx.Scheduler.async) // 设为 async
      .subscribe({
        next: (value) => { console.log(value); },
        error: (err) => { console.log('Error: ' + err); },
        complete: () => { console.log('complete'); }
      });
    console.log('after subscribe');
    // "before subscribe"
    // "after subscribe"
    // 1
    // 2
    // 3
    // "complete"
    ~~~
    上面这段代码原本是同步执行的，但我们用了 observable.observeOn(Rx.Scheduler.async) 原本是同步执行的就变成了异步执行了。


- 有哪些 Scheduler 可以用
  <br>
  目前 RxJS 5 Scheduler 跟 RxJS 4.x 以前的版本完全不同，在 RxJS 5 当中有提供四个 scheduler，预设为 undefined 会直接以递回的方式执行

    * queue
    * asap
    * async
    * animationFrame

  这四个 scheduler 我们会在下面搭配代码一一讲解
  > RxJS 5 跟 RxJS 4.x 预设的 Scheduler 不同，所以在某些使用情境下会出现不同的结果，例如[这个](https://github.com/ReactiveX/rxjs/issues/1994) issue，请特別注意。

- 使用 Scheduler

  其实我们在使用各种不同的 operator 时，这些 operator 就会各自预设不同的 scheduler，例如一个无限的 observable 就会预设为 queue scheduler，而 timer 相关的 operator 则预设为 async scheduler。
  <br>
  <br>
  要使用 Scheduler 除了前面用到的 observeOn() 方法外，以下这几个 creation operators 最后一个参数都能接收 Scheduler
  * bindCallback
  * bindNodeCallback
  * combineLatest
  * concat
  * empty
  * from
  * fromPromise
  * interval
  * merge
  * of
  * range
  * throw
  * timer

  例如下面这个例子
  ~~~js
  var observable = Rx.Observable.from([1,2,3,4,5], Rx.Scheduler.async);
  ~~~
  另外还有多个 operators 最后一个参数可以传入 Scheduler 这边就不一一列出，这已参考官方的文件，最通用的方式还是 observeOn() 只要是 observable 就可以用这个方法。
    <br>
    <br>
    * queue
    <br>
    queue 的运作方式跟预设的立即执行很像，但是当我们使用到递回的方法时，他会佇列这些行为而非直接执行，一个递回的 operator 就是他会执行另一个 operator，最好的例子就是 repeat()，如果我们不给他参数的话，他会执行无限多次，像下面这个例子
      ~~~js
      Rx.Observable.of(10).repeat().take(1)
        .subscribe(console.log);
      ~~~
      这个例子在 RxJS 4.x 的版本中执行会使浏览器挂掉，因为 take(1) 永远不会被执行到 repeat 会一直重复要元素，而在 RxJS 5 中他预设了无限的 observable 为 queue 所以他会把 repeat 的 next 行为先佇列起来，因为前一个 complete 还在执行中，而这时 repeat 就会回传一个可退订的物件给 take(1) 等到 repeat 的 next 被第一次执行时就会结束，因为 take(1) 会直接收到值。
      <br>
      <br>
      使用情境：<br>
      queue 很适合用在会有递回的 operator 且具有大量数据时使用，在这个情况下 queue 能避免不必要的效能損耗。
    <br>
    <br>
    * asap
    <br>
    asap 的行为很好理解，它是异步的执行，在浏览器其实就是 setTimeout 设为 0 秒 (在 NodeJS 中是用 process.nextTick)，因为行为很好理解这里就不写例子了。
      <br>
      <br>
      使用情境：<br>
    asap 因为都是在 setTimeout 中执行，所以不会有 block event loop 的问题，很适合用在永远不会退订的 observable，例如在背景下持续监听 server 送来的通知。
    <br>
    <br>
    * async
      <br>
      这个是在 RxJS 5 中新出现的 Scheduler，它跟 asap 很像但是使用 setInterval 来运作，通常是跟时间相关的 operator 才会用到。
    <br>
    <br>
    * animationFrame<br>
      这个相信大家应该都知道，他是利用 Window.requestAnimationFrame 这个 API 去实现的，所以执行週期就跟 Window.requestAnimationFrame 一模一样。
      <br>
      <br>
      使用情境：<br>
      在做复杂运算，且高频率触发的 UI 动画时，就很适合使用 animationFrame，以可以搭配 throttle operator 使用。


## Cold & Hot Observable
Hot Observable 跟 Cold Observable 的差別，其实就是 **数据源(Data Source)** 在 Observable 内部建立还是外部建立。

在 RxJS 中很常会看到 Cold Observable 跟 Hot Observable 这两个名詞，其实他们是在区分不同行为的 Observable，所謂的 Cold Observable 就是指每次订阅都是獨立的执行，而 Hot Observable 则是共用的订阅。

  - Cold Observable

    Cold Observable 代表 Observable 的每个订阅都是獨立的，他们不会互相影响，如下
    ~~~js
    const source = Rx.Observable.interval(1000).take(5);
    source.subscribe(value => console.log('sub1: ' + value))
    setTimeout(() => {
      source.subscribe(value => console.log('sub2: ' + value))    
    }, 3500);
    // sub1: 0
    // sub1: 1
    // sub1: 2
    // sub1: 3
    // sub2: 0
    // sub1: 4
    // sub2: 1
    // sub2: 2
    // sub2: 3
    // sub2: 4
    ~~~
    从上面的代码可以看出来每次订阅 source 都是獨立运行的，这种每次订阅都是 獨立执行 的 Observable 就称为 Cold Observable。
    <br>
    <br>
    如果从 Observable 内部来看，代表 数据源(Data Source) 是在 Observable 内部建立的的，大概会長像下面
    ~~~js
    const source = Rx.Observable.create(function(observer) {
      // 订阅时，才建立新的数据源
      const someDataSource = getSomeDataSource();
      someDataSource.addEventListener('message', (data) => {
        observer.next(data)
      })
    })
    ~~~
    因为每次订阅都建立一个新的数据源，就会使数据从头开始传送。


  - Hot Observable

    Hot Observable 代表 Observable 的每个订阅是共用的，所謂的共用订阅就是指 一个 Observable 在多次订阅时，不会每次都从新开始发送元素，例如
    ~~~js
    var source = Rx.Observable.interval(1000)
      .take(5)
      .share(); // 共用
    source.subscribe(value => console.log('sub1: ' + value))
    setTimeout(() => {
      source.subscribe(value => console.log('sub2: ' + value))    
    }, 3500);
    // sub1: 0
    // sub1: 1
    // sub1: 2
    // sub1: 3
    // sub2: 3
    // sub1: 4
    // sub2: 4
    ~~~
    从上面的代码可以看出，当我们对 source 第二次做订阅时，接收到的元素是接续第一个订阅往下发送的，而不是从新(0)开始，这种 共用订阅 的 Observable 就称为 Hot Observable。
    <br>
    <br>
    如果从 Observable 内部来看，就是数据源是在 Observable 外部建立的，代码大概就会像下面这样
    ~~~js
    // 只有一个数据源，每次订阅都是用同一个
    const someDataSource = getSomeDataSource();
    const source = Rx.Observable.create(function(observer) {
      someDataSource.addEventListener('message', (data) => {
        observer.next(data)
      })
    });
    ~~~
    
  - Cold 与 Hot

    一般的情况下 Observable 都是 Cold 的，这样不同的订阅才不会有 Side Effect 互相影响。但在需要多次订阅的情境下，我们就很有可能需要 Hot Observable，而让 RxJS 提供了很多让 Cold Observable 变成 Hot Observable 的方法。
    <br>
    <br>
    Hot Observable 跟 Cold Observable 的差异就是多次订阅时，是否共用订阅或是獨立执行。 而这一切的差异就是来自于 数据源 是在 Observable 内部建立还是外部建立。


## 如何 Debug？
Debug 一直是 RxJS 的难题，原因是当我们使用 RxJS 后，代码就会变得高度 **抽象化**；实际上抽象并不是什么坏事，抽象会让代码显得简洁、干净，但同时也带来了除错上的困难。
<br>
<br>
在编写代码时，我们都会希望代码是简洁且可读的。但当我们用 简洁 的代码来处理 复杂 的问题，就表示我们的代码会变得 高度抽象！其实人类在思考复杂的问题都会偏好用抽象的方式来处理，例如说在下围棋时，常常说的 棋形 或是黑白哪一边的 势 比较好，这都是在抽象化处理问题。

- RxJS 如何除错？
  * do
  
    在 RxJS 的世界中，有一个 Operator 叫作 do，它不会对元素产生任何影响，在实际业务上很常用来做错误的追踪，如下
    ~~~js
    const source = Rx.Observable.interval(1000).take(3);
    const example = source
      .do(x => console.log('do log: ' + x))
      .map(x => x + 1);
    example.subscribe((x) => {
      console.log('subscription log: ' + x)
    })
    // do log: 0
    // subscription log: 1
    // do log: 1
    // subscription log: 2
    // do log: 2
    // subscription log: 3
    ~~~
    从上面的例子可以看出来，我们可以传入一个 callback function 给 do，我们可以在 do 的内部对元素作任何操作（像是 log），但不会对元素产生影响。这很适合用在检测每一步送出的元素是否符合我们的预期。
    >do(...) 的行为跟 map(x => { ... return x; }) 本质上是一样的
  
  * Observable 间的关系图
  
    当代码有点复杂时，我们最好是能先画出 Observable 与 Observable 之间的关联，在理清各个 Observable 间的关系后，我们就能更轻易地找出问题在哪。范例如下
    ~~~js
    const addButton = document.getElementById('addButton');
    const minusButton = document.getElementById('minusButton');
    const state = document.getElementById('state');
    const addClick = Rx.Observable.fromEvent(addButton, 'click');
    const minusClick = Rx.Observable.fromEvent(minusButton, 'click');
    const initialState = Rx.Observable.of(0);
    const numberState = initialState
      .merge(
        addClick.mapTo(1),
        minusClick.mapTo(-1)
      )
      .scan((origin, next) => origin + next)
    
    numberState
      .subscribe({
        next: (value) => { state.innerHTML = value;},
        error: (err) => { console.log('Error: ' + err); },
        complete: () => { console.log('complete'); }
      });
    ~~~
    上面这段代码，我们可以把关系图画成以下的样子
    ~~~shell
    --------------        --------------        --------------
    '            '        '            '        '            '
    'initialState'        '  addClick  '        ' minusClick '
    '            '        '            '        '            '
    --------------        --------------        --------------
          |                     |                      |
          |                     |  mapTo(1)            | mapTo(-1)
    merge | ____________________|                      |
          | \__________________________________________|
          |                      
         \|/
          |
          | scan((origin, next) => origin + next)
          |
         \|/
    -------------
    '           '
    'numberState'  
    '           '
    -------------
    ~~~
    把每个一 observable 物件都框起来，并画出之间的关联，以及中间使用到的 Operators，这样一来我们就能够很清楚的了解这段代码在做什么，以及如何运作。最后我们只要在每一个环节去确认送出的元素就能找出错误出现在哪里。
    <br>
    <br>
    在理清每个 observable 之间的关系并找出问题出现在哪个环节后，我们只要画出该环节的 Marble Diagram 前后变化就能清楚地知道问题是如何发生。接续上面的例子，如果今天问题出在 merge() 之后，那我们就把 merge() 前后的 Marble Diagram 画出来
    ~~~shell
    # Marble diagram 图示
    initialState: 0|
    addClick    : ----------1---------1--1-------
    minusClick  : -----(-1)---(-1)---------------
                        merge(...)
                : 0----(-1)-1-(-1)----1--1-------
    
               scan((origin, next) => origin +next)
    numberState : 0----(-1)-0-(-1)----0--1-------  
    ~~~
    到这里我们应该就能清楚地知道问题出在哪，最后就只要想如何解决问题就行了。
    <br>
    <br>
    只要照着以上三个步骤做除错，基本上就不用担心会有解决不了的错误，但是这三个步骤仍然显得太过繁琐，或许我们应该做一个工具来简化这整个流程！

- RxJS Devtools
  使用方式很简单如下
  ~~~js
  Observable.prototype.debug = window.rxDevTool(Observable);
  ~~~
  首先我们的 extension 会在 window 底下塞入一个方法叫 rxDevTool，所以开发者只要传入 Observable 并把这个 rxDevTool 的回传值塞到 Observable.prototype.debug 就能使用 debug 了。
  ~~~js
  Observable.interval(1000).take(5)
    .debug('source1')
    .map(x => x + 1)
    .debug('source2')
    .subscribe(function() {
        //...
    })
  ~~~
  这个 debug() 跟 do() 一样，不会对元素造成任何影响，但不同的是 debug() 要传入的参数是 开发者自订的名称，代表当前的 observable，这时在 Chrome 的开发者工具中切到 RxJS 的 tab 页就能看到自动画出 Marble Diagram
  <br>
  <br>
  目前 RxJS Devtools 已经能够自动画出 Marble Diagram，也能做到类似 do 的功能(放在第二个参数)，之后会希望能够自动画出 observable 之间的关系图，这样一来我们在做 RxJS 的除错时就会方便非常多！


## 案例-完整的拖拽功能
  - 需求分析
    > 首先我们会有一个影片在最上方，原本是位置是静态(static)的，卷轴滚动到低于影片高度后，影片改为相对于视窗的绝对位置(fixed)，往回滚会再变回原本的状态。当影片为 fixed 时，鼠标移至影片上方(hover)会有遮罩(masker)与鼠标变化(cursor)，可以拖拉移动(drag)，且移动范围不超过可视区间！

    > 上面可以拆分成以下几个步骤
      * 准备 static 样式与 fixed 样式
      * HTML 要有一个固定位置的描点(anchor)
      * 当滚动超过描点，则影片变成 fixed
      * 当往回滚动过描点上方，则影片变回 static
      * 影片 fixed 时，要能够拖拉
      * 拖拉范围限制在当前可视区间
    > 先让我们看一下 HTML，首先在 HTML 里有一个 div(#anchor)，这个 div(#anchor) 就是待会要做描点用的，它内部有一个 div(#video)，则是滚动后要改变成 fixed 的元素。

    > CSS 的部分我们只需要知道滚动到下方后，要把 div(#video) 加上 video-fixed 这个 class。
  - 实现滚动的效果切换 class 的效果
    * 第一步，取得会用到的 DOM
      > 因为先做滚动切换 class，所以这里用到的 DOM 只有 #video, #anchor。
      ~~~js
      const video = document.getElementById('video');
      const anchor = document.getElementById('anchor');
      ~~~
    * 第二步，建立会用到的 observable
      > 这里做滚动效果，所以只需要监听滚动事件。
      ~~~js
      const scroll = Rx.Observable.fromEvent(document, 'scroll');
      ~~~
    * 第三步，编写代码逻辑
      > 这里我们要取得了 scroll 事件的 observable，当滚过 #anchor 最底部时，就改变 #video 的 class。
      
      > 首先我们会需要滚动事件发生时，去判断是否滚过 #anchor 最底部，所以把原本的滚动事件变成是否滚过最底部的 true or false。
      ~~~js
      scroll.map(e => anchor.getBoundingClientRect().bottom < 0)
      ~~~
      > 这里我们用到了 getBoundingClientRect 这个浏览器原生的 API，他可以取得 DOM 物件的宽高以及上下左右离屏幕可视区间上(左)的距离，如下图
       
      > 当我们可视范围区间滚过 #anchor 底部时， anchor.getBoundingClientRect().bottom 就会变成负值，此时我们就改变 #video 的 class。
      ~~~js
      scroll.map(e => anchor.getBoundingClientRect().bottom < 0)
        .subscribe(bool => {
          if(bool) {
            video.classList.add('video-fixed');
          } else {
            video.classList.remove('video-fixed');
          }
        })
      ~~~
      + 到这里我们就已经完成滚动变更样式的效果了！全部的 JS 代码，如下
      ~~~js
      const video = document.getElementById('video');
      const anchor = document.getElementById('anchor');
      const scroll = Rx.Observable.fromEvent(document, 'scroll');
      scroll
        .map(e => anchor.getBoundingClientRect().bottom < 0)
        .subscribe(bool => {
          if(bool) {
            video.classList.add('video-fixed');
          } else {
            video.classList.remove('video-fixed');
          }
        })
      ~~~
      > 当然这段还能在用 debounce/throttle 或 requestAnimationFrame 做优化，这个部分我们日后的文章会在提及。
  - 实现拖拽的行为
    * 第一步，取得会用到的 DOM <br>
      这里我们会用到的 DOM 跟前面是一样的(#video)，所以不用多做什么。
    * 第二步，建立会用到的 observable <br>
      这里跟上次一样，我们会用到 mousedown, mouseup, mousemove 三个事件。
      ~~~js
      const mouseDown = Rx.Observable.fromEvent(video, 'mousedown')
      const mouseUp = Rx.Observable.fromEvent(document, 'mouseup')
      const mouseMove = Rx.Observable.fromEvent(document, 'mousemove')
      ~~~
    * 第三步，编写代码逻辑 <br>
      跟上次是差不多的，首先我们会点击 #video 元素，点击(mousedown)后要变成移动事件(mousemove)，而移动事件会在鼠标放开(mouseup)时结束(takeUntil)
      ~~~js
      mouseDown
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
      ~~~
      因为把 mouseDown observable 发送出来的事件换成了 mouseMove observable，所以变成了 observable(mouseDown) 送出 observable(mouseMove)。因此最后用 concatAll 把后面送出的元素变成 mouse move 的事件。
      <br><br> 但这里会有一个问题，就是我们的这段拖拉事件其实只能做用到 video-fixed 的时候，所以我们要加上 filter
      ~~~js
      mouseDown
        .filter(e => video.classList.contains('video-fixed'))
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
      ~~~
      这里我们用 filter 如果当下 #video 没有 video-draggable class 的话，事件就不会送出。
      <br>
      <br>
      再来我们就能跟上次一样，把 mousemove 事件变成 { x, y } 的物件，并订阅来改变 #video 元素
      ~~~js
      mouseDown
        .filter(e => video.classList.contains('video-fixed'))
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
        .map(m => {
          return {
            x: m.clientX,
            y: m.clientY
          }
        })
        .subscribe(pos => {
          video.style.top = pos.y + 'px';
          video.style.left = pos.x + 'px';
        })
      ~~~
      到这里我们基本上已经完成了所有功能，但这里有两个大问题我们还没有解决：
      * 第一次拉动的时候会闪一下，不像优酷那么顺
      * 拖拉会跑出当前可视区间，跑上出去后就抓不回来了
      
      <br>
      首先第一个问题是因为我们的拖拉直接给元素鼠标的位置(clientX, clientY)，而非给鼠标相对移动的距离！我们只要把点击目标的左上角当作 (0,0)，并以此改变元素的样式，就不会有闪动的问题。我们可以用 withLatestFrom 来把 mousedown 与 mousemove 两个 Event 的值同时传入 callback。
      
      ~~~js
      mouseDown
        .filter(e => video.classList.contains('video-fixed'))
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
        .withLatestFrom(mouseDown, (move, down) => {
          return {
            x: move.clientX - down.offsetX,
            y: move.clientY - down.offsetY
          }
        })
        .subscribe(pos => {
          video.style.top = pos.y + 'px';
          video.style.left = pos.x + 'px';
        })
      // 当我们能够同时得到 mousemove 跟 mousedown 的事件，接着就只要把 鼠标相对可视区间的距离(client) 减掉点按下去时 鼠标相对元素边界的距离(offset) 就行了。这时拖拉就不会先闪动一下啰！
      ~~~
      这个问题其实只要给最大最小值就行了，因为需求的关系，这里我们的元素是相对可视居间的绝对位置(fixed)，也就是说
      + top 最小是 0
      + left 最小是 0
      + top 最大是可视高度扣掉元素本身高度
      + left 最大是可视宽度扣掉元素本身宽度
      ~~~js
      const validValue = (value, max, min) => {
        return Math.min(Math.max(value, min), max)
      }
      // 第一个参数给原本要给的位置值，后面给最大跟最小，如果今天大于最大值我们就取最大值，如果今天小于最小值则取最小值。
      mouseDown
        .filter(e => video.classList.contains('video-fixed'))
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
        .withLatestFrom(mouseDown, (move, down) => {
          return {
            x: validValue(move.clientX - down.offsetX, window.innerWidth - 320, 0),
            y: validValue(move.clientY - down.offsetY, window.innerHeight - 180, 0)
          }
        })
        .subscribe(pos => {
          video.style.top = pos.y + 'px';
          video.style.left = pos.x + 'px';
        })
      // 这里偷懒了一下，直接写死元素的宽高(320, 180)，实际上应该用 getBoundingClientRect 计算是比较好的。
      ~~~

## 案例-简易的 Auto Complete 实现
  - 需求分析
    > 首先我们会有一个搜寻框(input#search)，当我们在上面打字并停顿超过 100 毫秒就发送 HTTP Request 来取得建议选项并显示在收寻框下方(ul#suggest-list)，如果使用者在前一次发送的请求还没有回来就打了下一个字，此时前一个发送的请求就要舍弃掉，当建议选项显示之后可以用鼠标点击取建议选项代搜寻框的文字。

    > 上面可以拆分成以下几个步骤
      * 准备 input#search 以及 ul#suggest-list 的 HTML 与 CSS
      * 在 input#search 输入文字时，等待 100 毫秒再无输入，就发送 HTTP Request
      * 当 Response 还没回来时，使用者又输入了下一个文字就舍弃前一次的并再发送一次新的 Request 
      * 接受到 Response 之后显示建议选项 
      * 鼠标点击后取代 input#search 的文字
        <br>
        <br>
    
    首先在 HTML 里有一个 input(#search)，这个 input(#search) 就是要用来输入的栏位，它下方有一个 ul(#suggest-list)，则是放建议选项的地方
    ~~~js
    const url = 'https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*';

    const getSuggestList = (keyword) => fetch(url + '&search=' + keyword, { method: 'GET', mode: 'cors' })
      .then(res => res.json())
    ~~~
    上面是已经写好了要发送 API 的 url 跟方法getSuggestList，接着就开始实现自动完成的效果吧！
    

  - 开始实现
    * 第一步，取得需要的 DOM 物件
        
      这里我们会用到 #search 以及 #suggest-list 这两个 DOM
      ~~~js
      const searchInput = document.getElementById('search');
      const suggestList = document.getElementById('suggest-list');
      ~~~
    * 第二步，建立所需的 Observable

      这里我们要监听 搜寻栏位的 input 事件，以及建议选项的点击事件
      ~~~js
      const keyword = Rx.Observable.fromEvent(searchInput, 'input');
      const selectItem = Rx.Observable.fromEvent(suggestList, 'click');
      ~~~
    * 第三步，编写代码逻辑

      每当使用者输入文字就要发送 HTTP request，并且有新的值被输入后就舍弃前一次发送的，所以这里用 switchMap
      ~~~js
      keyword.switchMap(e => getSuggestList(e.target.value))
      ~~~
      这里我们先试着订阅，看一下 API 会回传什么样的数据
      ~~~js
      keyword
        .switchMap(e => getSuggestList(e.target.value))
        .subscribe(console.log)
      ~~~
      在 search 栏位乱打几个字，大家可以在 console 看到数据，他会回传一个队列带有四个元素，其中第一个元素是我们输入的值，第二个元素才是我们要的建议选项清单。
      <br>
      <br>
      所以我们要取的是 response 队列的第二的元素，用 switchMap 的第二个参数来选取我们要的
      ~~~js
      keyword
        .switchMap(e => getSuggestList(e.target.value),(e, res) => res[1])
        .subscribe(console.log)
      ~~~
      这时再输入文字就可以看到确实是我们要的返回值
      <br>
      <br>
      写一个 render 方法，把队列转成 li 并写入 suggestList
      ~~~js
      const render = (suggestArr = []) => {
        suggestList.innerHTML = suggestArr
          .map(item => '<li>'+ item +'</li>')
          .join('');  
      }
      ~~~
      这时我们就可用 render 方法把取得的队列传入
      ~~~js
      const render = (suggestArr = []) => {
        suggestList.innerHTML = suggestArr
          .map(item => '<li>'+ item +'</li>')
          .join('');  
      }
      keyword
        .switchMap(e => getSuggestList(e.target.value), (e, res) => res[1])
        .subscribe(list => render(list))
      ~~~
      如此一来我们打字就能看到结果出现在 input 下方了，只是目前还不能点选，先让我们来做点选的功能，这里点选的功能我们需要用到 delegation event 的小技巧，利用 ul 的 click 事件，来筛选是否点到了 li，如下
      ~~~js
      selectItem.filter(e => e.target.matches('li'))
      ~~~
      上面我们利用 DOM 物件的 matches 方法(里面的字符串放 css 的 selector)来过滤出有点击到 li 的事件，再用 map 转出我们要的值并写入 input。
      ~~~js
      selectItem
        .filter(e => e.target.matches('li'))
        .map(e => e.target.innerText)
        .subscribe(text => searchInput.value = text)
      ~~~
      现在我们就能点击建议清单了，但是点击后清单没有消失，这里我们要在点击后重新 render，所以把上面的代码改一下
      ~~~js
      selectItem
        .filter(e => e.target.matches('li'))
        .map(e => e.target.innerText)
        .subscribe(text => {
          searchInput.value = text;
          render();
        })
      ~~~
      这样一来我们就完成最基本的功能了，还记得我们前面说每次打完字要等待 100 毫秒在发送 request 吗？ 这样能避免过多的 request 发送，可以降低 server 的负载也会有比较好的使用者体验，要做到这件事很简单只要加上 debounceTime(100) 就完成了
      ~~~js
      keyword
        .debounceTime(100)
        .switchMap(e => getSuggestList(e.target.value),(e, res) => res[1])
        .subscribe(list => render(list))
      ~~~
      当然这个数值可以依照需求或是请 UX 针对这个细节作调整。这样我们就完成所有功能了。
  - 扩展
    
    当我们能够自己从头到尾的完成这样的功能，在面对各种不同的需求，我们就能很方便的针对需求作调整，而不会受到套件的牽制！比如说我们希望使用者打了 2 个字以上在发送 request，这时我们只要加上一行 filter 就可以了
    ~~~js
    keyword
      .filter(e => e.target.value.length > 2)
      .debounceTime(100)
      .switchMap(e => getSuggestList(e.target.value), (e, res) => res[1])
      .subscribe(list => render(list))
    ~~~
    又或者网站的使用量很大，可能 API 在量大的时候会回传失败，主管希望可以在 API 失败的时候重新尝试 3 次，我们只要加个 retry(3) 就完成了
    ~~~js
    keyword
      .filter(e => e.target.value.length > 2)
      .debounceTime(100)
      .switchMap(e => Rx.Observable.from(getSuggestList(e.target.value)).retry(3), (e, res) => res[1])
      .subscribe(list => render(list))
    ~~~
