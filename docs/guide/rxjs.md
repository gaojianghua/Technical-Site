# RxJS
## 简介
- RxJS 是一套藉由 Observable sequences 来组合异步行为和事件基础程序的 Library！
- RxJS 提供了一套完整的异步解決方案，让我们在面对各种异步行为，不管是 Event, AJAX, 还是 Animation 等，我们都可以使用相同的 API (Application Programming Interface) 做开发。

## 异步所面临的问题
- 竞态条件(Race Condition)
  > 每当我们对同一个资源同时做多次的异步存取时，就可能发生 Race Condition 的问题。比如说我们发了一个 Request 更新使用者资料，然后我们又立即发送另一个 Request 取得使用者资料，这时第一个 Request 和第二个 Request 先后顺序就会影响到最終接收到的结果不同，这就是 Race Condition。
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
  // 表达式是一个運算过程，一定会有返回值，例如执行一个函数
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
  * JavaScript 的 Iterator 只有一个 next 方法，这个 next 方法只会回传这两种结果：
      1. 在最后一个元素前： `{ done: false, value: elem }`
      2. 在最后一个元素之后： `{ done: true, value: undefined }`
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
    > Iterator Pattern 虽然很单纯，但同时带来了两个优势，第一它渐进式取得资料的特性可以拿来做延迟运算(Lazy evaluation)，让我们能用它来处理大资料结构。第二因为 iterator 本身是序列，所以可以实现所有队列的运算方法像 map, filter... 等！
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
    > 这里我们写了一个函数用来抓取字符串中的数字，在这个函数中我们用 for...of 的方式来取得每个字符并用正则表示式来判断是不是数值，如果为真就转成数值并回传。当我们把一个字串丟进 getNumbers 函数时，并没有马上运算出字串中的所有数字，必須等到我们执行 next() 时，才会真的做运算，这就是所谓的延迟运算(evaluation strategy)
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
- Observable 释义
  > 在了解 Observer 跟 Iterator 后，不知道大家有没有发现其实 Observer 跟 Iterator 有个共通的特性，就是他们都是 渐进式(progressive) 的取得资料，差別只在于 Observer 是生产者(Producer)推送资料(push)，而 Iterator 是消費者(Consumer)要求资料(pull)!
   
  > Observable 其实就是这两个 Pattern 思想的结合，Observable 具备生产者推送资料的特性，同时能像序列，拥有序列处理资料的方法(map, filter...)！
   
  > 更简单的来说，Observable 就像是一个序列，里面的元素会随着时间推送
## 建立 Observable
- 一个核心三个重点
  > - 一个核心： Observable 再加上相关的 操作符Operators(map, filter...)
  > - 三个重点： Observer Subject Schedulers
- 创建 Observable
  > 建立 Observable 的方法有非常多种，其中 create 是最基本的方法。create 方法在 Rx.Observable 物件中，要传入一个 callback function ，这个 callback function 会接收一个 observer 参数
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
  > 当我们订阅这个 observable，他就会顺序送出 'Jerry' 'Anna' 两个字符串。
   
  > 这里有一个重点，很多人認认为 RxJS 是在做异步处理，所以所有行为都是异步的。但其实这个观念是错的，RxJS 确实主要在处理异步行为没錯，但也同时能处理同步行为，像是上面的代码就是同步执行的。
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
  > 所以很明显的上面这段代码是同步执行的，当然我们也可以拿它来处理异步的行为！
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
  > Observable 可以被订阅(subscribe)，或说可以被观察，而订阅 Observable 的物件又称为 观察者(Observer)。观察者是一个具有三个方法(method)的物件，每当 Observable 发生事件时，便会呼叫观察者相对应的方法。
  
  >- next：每當 Observable 發送出新的值，next 方法就会被呼叫。
  >- complete：在 Observable 没有其他的数据可以取得时，complete 方法就会被呼叫，在 complete 被呼叫之后，next 方法就不会再起作用。
  >- error：每當 Observable 內發生錯誤时，error 方法就会被呼叫。
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
    > 上面这段代码会打印出：Jerry Anna complete
    
    > 上面的示例可以看得出来在 complete 执行后，next 就会自动失效，所以没有印出 not work。
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

    // 宣告一个觀察者，具備 next, error, complete 三个方法
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
    // 用我们定義好的觀察者，来訂閱这个 observable
    observable.subscribe(observer)
    ```
    > 上面这段代码只会执行 error 的 function 印出 Error: some exception。
     
    > 另外观察者可以是不完整的，他可以只具有一个 next 方法
    ```js
    var observer = {
      next: function(value) {
        //...
      }
    }
    ```
    > 有时候 Observable 会是一个无限的序列，例如 click 事件，这时 complete 方法就有可能永远不会被呼叫！
     
    > 我们也可以直接把 next, error, complete 三个 function 依次传入 observable.subscribe
    ```js
    observable.subscribe(
      value => { console.log(value); },
      error => { console.log('Error: ', error); },
      () => { console.log('complete') }
    )
    // observable.subscribe 会在内部自动組成 observer 物件来操作。
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
          throw new Error('listener 必須是 function')
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
    > 我们在内部储存了一份所有的监听者清单(this.listeners)，在要发布通知时会逐一的呼叫这份清单的监听者。
     
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
      > 这里可以看到 subscribe 是一个 function，这个 function 执行时会传入观察者，而我们在这个 function 内部去执行观察者的方法。
  
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
    > 当我们想要同步的传递几个值时，就可以用 of 这个 operator 来简洁的表达!
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
    >我们可以用 from 来接收任何可列举的参数!
    
    >记得任何可列举的参数都可以用喔，也就是说像 Set, WeakSet, Iterator 等都可以当作参数！
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
    > 如果我们传入 Promise 物件实例，当正常回传时，就会被送到 next，并立即送出完成通知，如果有错误则会送到 error。
    
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
    > 这个方法是給类事件使用。所谓的类事件就是指其行为跟事件相像，同时具有注册监听及移除监听两种行为，就像 DOM Event 有 addEventListener 及 removeEventListener 一样！
    ~~~js
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
          listener(message);
        })
      }
    }
    // ------- 以上都是之前的程式碼 -------- //
    var egghead = new Producer();
    // egghead 同时具有 註冊監聽者及移除監聽者 两種方法
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
    > egghead 是 Producer 的实例，同时具有 注册监听及移除监听两种方法，我们可以将这两个方法依次传入 fromEventPattern 来建立 Observable 的物件实例！
    
    > 这里要注意不要直接将方法传入，避免 this 出错！也可以用 bind 来写。
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
    > 像是数学上的 零(0) 值，虽然有时候好像没什么，但却非常的重要。empty 会给我们一个空的 observable，如果我们订阅这个 observable 会发生什么事呢？ 它会立即送出 complete 的信息！
      
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
    > never 会给我们一个无穷的 observable，如果我们订阅它又会发生什么事呢？...什么事都不会发生，它就是一个一直存在但却什么都不做的 observable。
    
    > 可以把 never 想像成一个结束在无穷久以后的 observable，但你永远等不到那一天！
  * throw
    > 它也就只做一件事就是拋出错误。
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
    > interval 有一个参数必須是数值(Number)，这的数值代表发出讯号的间隔时间(ms)。上面的代码会持续每隔一秒送出一个从0开始递增的数值！
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
    > 当 timer 有两个参数时，第一个参数代表要发出第一个值的等待时间(ms)，第二个参数代表第一次之后发送值的间隔时间，所以上面这段代码会先等一秒送出 0 之后每五秒送出 1, 2, 3, 4...。
    
    > timer 第一个参数除了可以是数值(Number)之外，也可以是日期(Date)，就会等到指定的时间再发送第一个值。
    
    > 另外 timer 也可以只接收一个参数，下面这段代码就会等一秒后送出 1 同时通知结束。
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
    > 有时候我们可能会在某些行为后不需要这些资源，要做到这件事最简单的方式就是 unsubscribe。
     
    > 在订阅 observable 后，会回传一个 subscription 物件，这个物件具有释放资源的 unsubscribe 方法 
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
    > 这裡我们用了 setTimeout 在 5 秒后，执行了 subscription.unsubscribe() 来停止訂閱并釋放資源。
  
    > Events observable 尽量不要用 unsubscribe ，通常我们会使用 takeUntil，在某个事件发生后来完成 Event observable，这个部份我们之后会讲到！
## Observable Operators & Marble Diagrams
- 什么是 Operator？
  > Operators 就是一个个被附加到 Observable 上的实例的方法，例如像是 map, filter, contactAll... 等等，所有这些函数都会拿到原本的 observable 并回传一个新的 observable
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
  > 这里可以看到我们写了一个 map 的函数，它接收了两个参数，第一个是原本的 observable，第二个是 map 的 callback function。map 内部第一件事就是用 create 建立一个新的 observable 并回传，并且在内部订阅原本的 observable。
  
  > 我们也可以直接把 map 塞到 Observable.prototype 原型上
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
  > 我们在传达事物时，文字其实是最糟的手段，虽然文字是我们平时沟通的基础，但常常千言万语也比不过一张清楚的图。如果我们能绘制 observable 的图示，就能讓让我们更方便的沟通及理解 observable 的各种 operators！

  > 我们把描绘 observable 的图示称为 Marble diagrams，在网络上 RxJS 有非常多的 Marble diagrams，规则大致上都是相同的，这里为了方便撰写以及跟读者的留言互动，所以采用类似 ASCII 的绘画方式。

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
  > 在这个时间序当中，我们可能会发送出值(value)，如果值是数字则直接用阿拉伯数字取代，其他的资料类型则用相近的英文符号代表，这里我们用 interval 举例
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

  > 另外的 Marble diagrams 也能够表达 operator 的前后转换，例如
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
  > 最上面是原本的 observable，中间是 operator，下面则是新的 observable。

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
    > mapTo 可以把传进来的值改成一个固定的值，如下
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
    > filter 在使用上也跟队列的相同，我们要传入一个 callback function，这个 function 会传入每个被送出的元素，并且回传一个 boolean 值，如果为 true 的话就会保留，如果为 false 就会被过滤掉，如下
    ~~~js
    var source = Rx.Observable.interval(1000);
    var newest = source.filter(x => x % 2 === 0);
    newest.subscribe(console.log);
    // 0
    // 2
    // 4
    // 6..
    ~~~
    > filter 用 Marble diagrams 表達
    ~~~shell
    source: -----0-----1-----2-----3-----4-...
            filter(x => x % 2 === 0)
    newest: -----0-----------2-----------4-...
    ~~~
  > 读者应该有发现 map, filter 这些方法其实都跟队列的相同，因为这些都是 functional programming 的通用函数，就算换个语言也有机会看到相同的命名及相同的用法。
  
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
    // complete (點擊body了
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
    > 这裡可以看到 source observable 內部每次發送的值也是 observable，这时我们用 concatAll 就可以把 source 攤平成 example。
    
    > 这裡需要注意的是 concatAll 会處理 source 先發出来的 observable，必須等到这个 observable 结束，才会再處理下一个 source 發出来的 observable，讓我们用下面这个範例说明。
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
    > 这裡可以看到 source 会送出 3 个 observable，但是 concatAll 后的行为永遠都是先處理第一个 observable，等到當前處理的结束后才会再處理下一个。
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
    > 这里我们先取了前 6 个元素，再取最后两个。所以最后会送出 4, 5, complete，这里有一个重点，就是 takeLast 必須等到整个 observable 完成(complete)，才能知道最后的元素有哪些，并且同步送出
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
    > 跟 concatAll 一样，必須先等前一个 observable 完成(complete)，才会继续下一个
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
      // 暫停播放影片
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
    * source 结束，但 newest 還没结束，所以 example 還不会结束。
    * newest 送出了 4，此时 source 最后一次送出的值为 2，把这两个数传入 callback 得到 6。
    * newest 送出了 5，此时 source 最后一次送出的值为 2，把这两个数传入 callback 得到 7。
    * newest 结束，因为 source 也结束了，所以 example 结束。
    > 不管是 source 还是 newest 送出值来，只要另一方曾有送出过值(有最后的值)，就会执行 callback 并送出新的值，这就是 combineLatest。
    
    > combineLatest 很常用在运算多个因子的结果，例如最常见的 BMI 计算，我们身高变动时就拿上一次的体重计算新的 BMI，当体重变动时则拿上一次的身高计算 BMI，这就很适合用 combineLatest 来处理！

  - zip
    > zip 会取每个 observable 相同順位的元素并传入 callback，也就是说每个 observable 的第 n 个元素会一起被传入 callback，示例如下
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
    * source 结束 example 就直接结束，因为 source 跟 newest 不会再有对应順位的值
    > zip 会把各个 observable 相同順位送出的值传入 callback，这很常拿来做 demo 使用，比如我们想要间隔 100ms 送出 'h', 'e', 'l', 'l', 'o'，就可以这么做：
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

    > 建议大家平常没事不要乱用 zip，除非真的需要。因为 zip 必須 cache 住还没处理的元素，当我们两个 observable 一个很快一个很慢时，就会 cache 非常多的元素，等待比较慢的那个 observable。这很有可能造成内存相关的问题！
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
    
    > 这里我们在 main 送出值时，去判斷 some 最后一次送的值是不是 1 来决定是否要切换大小写，所以这段代码是这样运行的:
    * main 送出了 h，此時 some 上一次送出的值为 0，把这两个參数传入 callback 得到 h。
    * main 送出了 e，此時 some 上一次送出的值为 0，把这两个參数传入 callback 得到 e。
    * main 送出了 l，此時 some 上一次送出的值为 0，把这两个參数传入 callback 得到 l。
    * main 送出了 l，此時 some 上一次送出的值为 1，把这两个參数传入 callback 得到 L。
    * main 送出了 o，此時 some 上一次送出的值为 1，把这两个參数传入 callback 得到 O。
    > withLatestFrom 很常用在一些 checkbox 型的功能，例如说一个编辑器，我们开启粗体后，打出来的字就都要变粗体，粗体就像是 some observable，而我们打字就是 main observable。
  - scan
    <br>
    scan 其實就是 Observable 版本的 reduce 只是命名不同。如果熟悉陣列操作的話，應該會知道原生的 JS Array 就有 reduce 的方法，使用方式如下
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
    reduce 方法需要传兩個參數，第一個是 callback 第二個則是起始狀態，這個 callback 執行時，會传入兩個參數一個是原本的狀態，第二個是修改原本狀態的參數，最後回传一個新的狀態，再繼續執行。
    <br>
    这段代码的运行过程：
    * 第一次執行 callback 起始狀態是 0 所以 origin 传入 0，next 為 arr 的第一個元素 1，相加之後變成 1 回传並當作下一次的狀態。
    * 第二次執行 callback，這時原本的狀態(origin)就變成了 1，next 為 arr 的第二個元素 2，相加之後變成 3 回传並當作下一次的狀態。
    * 第三次執行 callback，這時原本的狀態(origin)就變成了 3，next 為 arr 的第三個元素 3，相加之後變成 6 回传並當作下一次的狀態。
    * 第三次執行 callback，這時原本的狀態(origin)就變成了 6，next 為 arr 的第四個元素 4，相加之後變成 10 回传並當作下一次的狀態。
    * 這時 arr 的元素都已經遍歷過了，所以不會直接把 10 回传。
    
    <br>
    scan 整體的運作方式都跟 reduce 一樣，範例如下
    
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
    這裡可以看到第一次传入 'h' 跟 '' 相加，返回 'h' 當作下一次的初始狀態，一直重複下去。
    
    > scan 跟 reduce 最大的差別就在 scan 一定會回传一個 observable 實例，而 reduce 最後回传的值有可能是任何数据类型，必須看使用者传入的 callback 才能決定 reduce 最後的返回值。

    scan 经常用在狀態的計算處理，最簡單的就是對一個數字的加減，我們可以綁定一個 button 的 click 事件，並用 map 把 click event 轉成 1，之後送處 scan 計算值再做顯示。下面是一个案例：
    
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
    這裡我們用了兩個 button，一個是 add 按鈕，一個是 minus 按鈕。這兩個按鈕的點擊事件各建立了 addClcik, minusClick 兩個 observable，這兩個 observable 直接 mapTo(1) 跟 mapTo(-1)，代表被點擊後會各自送出的數字！
    <br>
    <br>
    接著我們用了 empty() 建立一個空的 observable 代表畫面上數字的狀態，搭配 startWith(0) 來設定初始值，接著用 merge 把兩個 observable 合併透過 scan 處理之後的邏輯，最後在 subscribe 來更改畫面的顯示。
    <br>
    <br>
  - buffer
    <br>
    buffer 是一整個家族，總共有五個相關的 operators

    * buffer
    * bufferCount
    * bufferTime
    * bufferToggle
    * bufferWhen
    
    這裡比較常用到的是 buffer, bufferCount 跟 bufferTime 這三個，我們直接來看範例。
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
    buffer 要传入一個 observable(source2)，它會把原本的 observable (source)送出的元素緩存在陣列中，等到传入的 observable(source2) 送出元素時，就會觸發把緩存的元素送出。
    <br>
    <br>
    這裡的範例 source2 是每一秒就會送出一個元素，我們可以改用 bufferTime 簡潔的表達，如下
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
    除了用時間來作緩存外，我們更常用數量來做緩存，範例如下
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
    在實務上，我們可以用 buffer 來做某個事件的過濾，例如像是滑鼠連點才能真的執行，這裡我們一樣寫了一個小範例
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
    這裡我們只有在 500 毫秒內連點兩下，才能成功印出 'success'，這個功能在某些特殊的需求中非常的好用，也能用在批次處理來降低 request 传送的次數！

  
  - delay

    delay 可以延遲 observable 一開始發送元素的時間點，範例如下
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
    從 Marble Diagram 可以看得出來，第一次送出元素的時間變慢了，雖然在這裡看起來沒什麼用，但是在 UI 操作上是非常有用的

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

    delayWhen 的作用跟 delay 很像，最大的差別是 delayWhen 可以影響每個元素，而且需要傳一個 callback 並回傳一個 observable，範例如下
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
    這裡傳進來的 x 就是 source 送出的每個元素，這樣我們就能對每一個做延遲。

    這裡我們用 delay 來做一個小功能，這個功能很簡單就是讓多張照片跟著滑鼠跑，但每張照片不能跑一樣快！

    首先我們準備六張大頭照，並且寫進 HTML
    ~~~html
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover6.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover5.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover4.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover3.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover2.jpg" alt="">
    <img src="https://res.cloudinary.com/dohtkyi84/image/upload/c_scale,w_50/v1483019072/head-cover1.jpg" alt="">
    ~~~
    用 CSS 把 img 改成圓形，並加上邊筐以及絕對位置
    ~~~css
    img{
        position: absolute;
        border-radius: 50%;
        border: 3px white solid;
        transform: translate3d(0,0,0);
    }
    ~~~
    再來寫 JS
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
    這裡我們把 imgList 從 Collection 轉成 Array 後傳入 followMouse()，並用 forEach 把每個 omg 取出並利用 index 來達到不同的 delay 時間，這個 delay 時間的邏輯大家可以自己想，不用跟我一樣，最後 subscribe 就完成啦！


  - debounce (防抖)

    跟 buffer、bufferTime 一樣，Rx 有 debounce 跟 debounceTime 一個是傳入 observable 另一個則是傳入毫秒，比較常用到的是 debounceTime，這裡我們直接來看一個範例
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
    這裡只印出 4 然後就結束了，因為 debounce 運作的方式是每次收到元素，他會先把元素 cache 住並等待一段時間，如果這段時間內已經沒有收到任何元素，則把元素送出；如果這段時間內又收到新的元素，則會把原本 cache 住的元素釋放掉並重新計時，不斷反覆。
    > 以現在這個範例來講，我們每 300 毫秒就會送出一個數值，但我們的 debounceTime 是 1000 毫秒，也就是說每次 debounce 收到元素還等不到 1000 毫秒，就會收到下一個新元素，然後重新等待 1000 毫秒，如此重複直到第五個元素送出時，observable 結束(complete)了，debounce 就直接送出元素。
    ~~~shell
    # Marble diagram 图示
    source : --0--1--2--3--4|
          debounceTime(1000)
    example: --------------4|    
    ~~~  
    debounce 會在收到元素後等待一段時間，這很適合用來處理間歇行為，間歇行為就是指這個行為是一段一段的，例如要做 Auto Complete 時，我們要打字搜尋不會一直不斷的打字，可以等我們停了一小段時間後再送出，才不會每打一個字就送一次 request！
    ~~~js
    const searchInput = document.getElementById('searchInput');
    const theRequestValue = document.getElementById('theRequestValue');
    Rx.Observable.fromEvent(searchInput, 'input')
      .map(e => e.target.value)
      .subscribe((value) => {
    theRequestValue.textContent = value;
    // 在這裡發 request
    })
    ~~~
    如果用上面這段程式碼，就會每打一個字就送一次 request，當很多人在使用時就會對 server 造成很大的負擔，實際上我們只需要使用者最後打出來的文字就好了，不用每次都送，這時就能用 debounceTime 做優化。
    ~~~js
    const searchInput = document.getElementById('searchInput');
    const theRequestValue = document.getElementById('theRequestValue');
    Rx.Observable.fromEvent(searchInput, 'input')
      .debounceTime(300)
      .map(e => e.target.value)
      .subscribe((value) => {
    theRequestValue.textContent = value;
    // 在這裡發 request
    })
    ~~~

  - throttle (节流)
    跟 debounce 一樣 RxJS 有 throttle 跟 throttleTime 兩個方法，一個是傳入 observable 另一個是傳入毫秒，比較常用到的也是 throttleTime，讓我們直接來看範例
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
    跟 debounce 的不同是 throttle 會先開放送出元素，等到有元素被送出就會沈默一段時間，等到時間過了又會開放發送元素。
    <br>
    <br>
    throttle 比較像是控制行為的最高頻率，也就是說如果我們設定 1000 毫秒，那該事件頻率的最大值就是每秒觸發一次不會再更快，debounce 則比較像是必須等待的時間，要等到一定的時間過了才會收到元素。
    <br>
    <br>
    throttle 更適合用在連續性行為，比如說 UI 動畫的運算過程，因為 UI 動畫是連續的，像我們之前在做拖拉時，就可以加上 throttleTime(12) 讓 mousemove event 不要發送的太快，避免畫面更新的速度跟不上樣式的切換速度。
    > 瀏覽器有一個 requestAnimationFrame API 是專門用來優化 UI 運算的，通常用這個的效果會比 throttle 好，但並不是絕對還是要看最終效果。    

  - distinct (去重)
    它能幫我們把相同值的数据过滤掉只留一个，也就是数据去重，范例如下
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
    另外我們可以傳入一個 selector callback function，這個 callback function 會傳入一個接收到的元素，並回傳我們真正希望比對的值，舉例如下
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
    這裡可以看到，因為 source 送出的都是物件，而 js 物件的比對是比對記憶體位置，所以在這個例子中這些物件永遠不會相等，但實際上我們想比對的是物件中的 value，這時我們就可以傳入 selector callback，來選擇我們要比對的值。
    > distinct 傳入的 callback 在 RxJS 5 幾個 bate 版本中有過很多改變，現在網路上很多文章跟教學都是過時的，請讀者務必小心！
    
    實際上 distinct() 會在背地裡建立一個 Set，當接收到元素時會先去判斷 Set 內是否有相同的值，如果有就不送出，如果沒有則存到 Set 並送出。所以記得盡量不要直接把 distinct 用在一個無限的 observable 裡，這樣很可能會讓 Set 越來越大，建議大家可以放第二個參數 flushes，或用 distinctUntilChanged
    > 這裡指的 Set 其實是 RxJS 自己實作的，跟 ES6 原生的 Set 行為也都一致，只是因為 ES6 的 Set 支援程度還並不理想，所以這裡是直接用 JS 實作。     

    distinct 可以傳入第二個參數 flushes observable 用來清除暫存的数据，范例如下
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
    其實 flushes observable 就是在送出元素時，會把 distinct 的暫存清空，所以之後的暫存就會從頭來過，這樣就不用擔心暫存的 Set 越來愈大的問題，但其實我們平常不太會用這樣的方式來處理，通常會用另一個方法 distinctUntilChanged。

  - distinctUntilChanged
    
    distinctUntilChanged 跟 distinct 一樣會把相同的元素過濾掉，但 distinctUntilChanged 只會跟最後一次送出的元素比較，不會每個都比，舉例如下
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
    這裡 distinctUntilChanged 只會暫存一個元素，並在收到元素時跟暫存的元素比對，如果一樣就不送出，如果不一樣就把暫存的元素換成剛接收到的新元素並送出。
    ~~~shell
    # Marble diagram 图示
    source : --a--b--c--c--b|
            distinctUntilChanged()
    example: --a--b--c-----b|
    ~~~
    從 Marble Diagram 中可以看到，第二個 c 送出時剛好上一個就是 c 所以就被濾掉了，但最後一個 b 則跟上一個不同所以沒被濾掉。
    <br>
    <br>
    distinctUntilChanged 是比較常在實務上使用的，最常見的狀況是我們在做多方同步時。當我們有多個 Client，且每個 Client 有著各自的狀態，Server 會再一個 Client 需要變動時通知所有 Client 更新，但可能某些 Client 接收到新的狀態其實跟上一次收到的是相同的，這時我們就可用 distinctUntilChanged 方法只處理跟最後一次不相同的訊息，像是多方通話、多裝置的資訊同步都會有類似的情境。


  - catch (错误处理)

    catch 是很常見的非同步錯誤處理方法，在 RxJS 中也能夠直接用 catch 來處理錯誤，在 RxJS 中的 catch 可以回傳一個 observable 來送出新的值，讓我們直接來看範例：
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
    這個範例我們每隔 500 毫秒會送出一個字串(String)，並用字串的方法 toUpperCase() 來把字串的英文字母改成大寫，過程中可能未知的原因送出了一個數值(Number) 2 導致發生例外(數值沒有 toUpperCase 的方法)，這時我們在後面接的 catch 就能抓到錯誤。
    
    catch 可以回傳一個新的 Observable、Promise、Array 或任何 Iterable 的物件，來傳送之後的元素。以我們的例子來說最後就會在送出 X 就結束。
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
         ----a----b----c----d----X|
        catch(error => Rx.Observable.of('h'))
    example: ----a----b----c----d----h|
    ~~~
    這裡可以看到，當錯誤發生後就會進到 catch 並重新處理一個新的 observable，我們可以利用這個新的 observable 來送出我們想送的值。
    <br>
    <br>
    也可以在遇到錯誤後，讓 observable 結束，如下
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
    回傳一個 empty 的 observable 來直接結束(complete)。
    <br>
    <br>
    另外 catch 的 callback 能接收第二個參數，這個參數會接收當前的 observalbe，我們可以回傳當前的 observable 來做到重新執行，範例如下
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
    因為是我們只是簡單的示範，所以這裡會一直無限循環，實務上通常會用在斷線重連的情境。
    另上面的處理方式有一個簡化的寫法，叫做 retry()。


  - retry

    如果我們想要一個 observable 發生錯誤時，重新嘗試就可以用 retry 這個方法，跟我們前一個講範例的行為是一致
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
    通常這種無限的 retry 會放在即時同步的重新連接，讓我們在連線斷掉後，不斷的嘗試。另外我們也可以設定只嘗試幾次，如下
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
    這裡我們對 retry 傳入一個數值 1，能夠讓我們只重複嘗試 1 次後送出錯誤
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
            map(x => x.toUpperCase())
             ----a----b----c----d----X|
                retry(1)
    example: ----a----b----c----d--------a----b----c----d----X|
    ~~~
    這種處理方式很適合用在 HTTP request 失敗的場景中，我們可以設定重新發送幾次後，再秀出錯誤訊息。


  - retryWhen

    RxJS 還提供了另一種方法 retryWhen，他可以把例外發生的元素放到一個 observable 中，讓我們可以直接操作這個 observable，並等到這個 observable 操作完後再重新訂閱一次原本的 observable。
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
    這裡 retryWhen 我們傳入一個 callback，這個 callback 有一個參數會傳入一個 observable，這個 observable 不是原本的 observable(example) 而是例外事件送出的錯誤所組成的一個 observable，我們可以對這個由錯誤所組成的 observable 做操作，等到這次的處理完成後就會重新訂閱我們原本的 observable。
    <br>
    <br>
    這個範例我們是把錯誤的 observable 送出錯誤延遲 1 秒，這會使後面重新訂閱的動作延遲 1 秒才執行
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c----d----2|
        map(x => x.toUpperCase())
             ----a----b----c----d----X|
        retryWhen(errorObs => errorObs.delay(1000))
    example: ----a----b----c----d-------------------a----b----c----d----...
    ~~~
    從上圖可以看到後續重新訂閱的行為就被延後了，但實務上我們不太會用 retryWhen 來做重新訂閱的延遲，通常是直接用 catch 做到這件事。這裡只是為了示範 retryWhen 的行為，實務上我們通常會把 retryWhen 拿來做錯誤通知或是例外收集，如下
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
    這裡的 errorObs.map(err => fetch('...')) 可以把 errorObs 裡的每個錯誤變成 API 的發送，通常這裡個 API 會像是送訊息到公司的通訊頻道(Slack 等等)，這樣可以讓工程師馬上知道可能哪個 API 掛了，這樣我們就能即時地處理。
    
    > retryWhen 實際上是在背地裡建立一個 Subject 並把錯誤放入，會在對這個 Subject 進行內部的訂閱，因為我們還沒有講到 Subject 的觀念，大家可以先把它當作 Observable 就好了，另外記得這個 observalbe 預設是無限的，如果我們把它結束，原本的 observable 也會跟著結束。
  
  - repeat

    我們有時候可能會想要 retry 一直重複訂閱的效果，但沒有錯誤發生，這時就可以用 repeat 來做到這件事，範例如下
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
    這裡 repeat 的行為跟 retry 基本一致，只是 retry 只有在例外發生時才觸發
    ~~~shell
    # Marble diagram 图示
    source : ----a----b----c|
            repeat(2)
    example: ----a----b----c----a----b----c|
    ~~~
    同樣的我們可以不給參數讓他無限循環，如下
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
    這樣我們就可以做動不斷重複的行為，這個可以在建立輪詢時使用，讓我們不斷地發 request 來更新畫面。
    <br>
    <br>
    最後我們來看一個錯誤處理在實務應用中的小範例
    ~~~js
    const title = document.getElementById('title');
    var source = Rx.Observable.from(['a','b','c','d',2])
      .zip(Rx.Observable.interval(500), (x,y) => x)
      .map(x => x.toUpperCase());
    // 通常 source 會是建立即時同步的連線，像是 web socket
    var example = source.catch(
      (error, obs) => Rx.Observable.empty()
        .startWith('連線發生錯誤： 5秒後重連')
        .concat(obs.delay(5000))
    );
    example.subscribe({
      next: (value) => { title.innerText = value },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    這個範例其實就是模仿在即時同步斷線時，利用 catch 返回一個新的 observable，這個 observable 會先送出錯誤訊息並且把原本的 observable 延遲 5 秒再做合併，雖然這只是一個模仿，但它清楚的展示了 RxJS 在做錯誤處理時的靈活性。


  - concatAll

    concatAll 最重要的重點就是他會處理完前一個 observable 才會在處理下一個 observable，讓我們來看一個範例
    ~~~js
    var click = Rx.Observable.fromEvent(document.body, 'click');
    var source = click.map(e => Rx.Observable.interval(1000));
    var example = source.concatAll();
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    // (點擊後)
    // 0
    // 1
    // 2
    // 3
    // 4
    // 5 ...
    ~~~
    上面這段程式碼，當我們點擊畫面時就會開始送出數值
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
    從 Marble Diagram 可以看得出來，當我們點擊一下 click 事件會被轉成一個 observable 而這個 observable 會每一秒送出一個遞增的數值，當我們用 concatAll 之後會把二維的 observable 攤平成一維的 observable，但 concatAll 會一個一個處理，一定是等前一個 observable 完成(complete)才會處理下一個 observable，因為現在送出 observable 是無限的永遠不會完成(complete)，就導致他永遠不會處理第二個送出的 observable!
    <br>
    <br>
    我們再看一個例子
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
    現在我們把送出的 observable 限制只取前三個元素
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
    這裡我們把送出的 observable 變成有限的，只會送出三個元素，這時就能看得出來 concatAll 不管兩個 observable 送出的時間多麽相近，一定會先處理前一個 observable 再處理下一個。


  - switch

    switch 同樣能把二維的 observable 攤平成一維的，但他們在行為上有很大的不同，我們來看下面這個範例
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
    switch 最重要的就是他會在新的 observable 送出後直接處理新的 observable 不管前一個 observable 是否完成，每當有新的 observable 送出就會直接把舊的 observable 退訂(unsubscribe)，永遠只處理最新的 observable!
    <br>
    <br>
    所以在這上面的 Marble Diagram 可以看得出來第一次送出的 observable 跟第二次送出的 observable 時間點太相近，導致第一個 observable 還來不及送出元素就直接被退訂了，當下一次送出 observable 就又會把前一次的 observable 退訂。


  - mergeAll

    我們之前講過 merge 他可以讓多個 observable 同時送出元素，mergeAll 也是同樣的道理，它會把二維的 observable 轉成一維的，並且能夠同時處理所有的 observable，讓我們來看這個範例
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
    從 Marble Diagram 可以看出來，所有的 observable 是並行(Parallel)處理的，也就是說 mergeAll 不會像 switch 一樣退訂(unsubscribe)原先的 observable 而是並行處理多個 observable。以我們的範例來說，當我們點擊越多下，最後送出的頻率就會越快。
    <br>
    <br>
    另外 mergeAll 可以傳入一個數值，這個數值代表他可以同時處理的 observable 數量，我們來看一個例子
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
    > 這裡我們送出的 observable 改成取前三個，並且讓 mergeAll 最多只能同時處理 2 個 observable
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
    當 mergeAll 傳入參數後，就會等處理中的其中一個 observable 完成，再去處理下一個。以我們的例子來說，前面兩個 observable 可以被並行處理，但第三個 observable 必須等到第一個 observable 結束後，才會開始。
    >我們可以利用這個參數來決定要同時處理幾個 observable，如果我們傳入 1 其行為就會跟 concatAll 是一模一樣的，這點在原始碼可以看到他們是完全相同的。

    
  - concatMap

    concatMap 其實就是 map 加上 concatAll 的簡化寫法，我們直接來看一個範例
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
    上面這個範例就可以簡化成
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
    前後兩個行為是一致的，記得 concatMap 也會先處理前一個送出的 observable 在處理下一個 observable
    ~~~shell
    # Marble diagram 图示
    source : -----------c--c------------------...
        concatMap(c => Rx.Observable.interval(100).take(3))
    example: -------------0-1-2-0-1-2---------...
    ~~~  
    這樣的行為也很常被用在發送 request。如下
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
    這裡我們每點擊一下畫面就會送出一個 HTTP request，如果我們快速的連續點擊，大家可以在開發者工具的 network 看到每個 request 是等到前一個 request 完成才會送出下一個 request。
    <br>
    <br>
    從 network 的圖形可以看得出來，第二個 request 的發送時間是接在第一個 request 之後的，我們可以確保每一個 request 會等前一個 request 完成才做處理。
    <br>
    <br>
    concatMap 還有第二個參數是一個 selector callback，這個 callback 會傳入四個參數，分別是
    * 外部 observable 送出的元素
    * 內部 observable 送出的元素 
    * 外部 observable 送出元素的 index 
    * 內部 observable 送出元素的 index

    回傳值我們想要的值，範例如下
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
    這個範例的外部 observable 送出的元素就是 click event 物件，內部 observable 送出的元素就是 response 物件，這裡我們回傳 response 物件的 title 屬性，這樣一來我們就可以直接收到 title，這個方法很適合用在 response 要選取的值跟前一個事件或順位(index)相關時。
    

  - switchMap

    switchMap 其實就是 map 加上 switch 簡化的寫法，如下
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
    上面這個範例就可以簡化成
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
    只要注意一個重點 switchMap 會在下一個 observable 被送出後直接退訂前一個未處理完的 observable，這個部份的細節請看上一篇文章 switch 的部分。
    <br>
    <br>
    另外我們也可以把 switchMap 用在發送 HTTP request
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
    如果我們快速的連續點擊五下，可以在開發者工具的 network 看到每個 request 會在點擊時發送
    > 灰色是瀏覽器原生地停頓行為，實際上灰色的一開始就是 fetch 執行送出 request，只是卡在瀏覽器等待發送。

    雖然我們發送了多個 request 但最後真正印出來的 log 只會有一個，代表前面發送的 request 已經不會造成任何的 side-effect 了，這個很適合用在只看最後一次 request 的情境，比如說 自動完成(auto complete)，我們只需要顯示使用者最後一次打在畫面上的文字，來做建議選項而不用每一次的。
    <br>
    <br>
    switchMap 跟 concatMap 一樣有第二個參數 selector callback 可用來回傳我們要的值，這部分的行為跟 concatMap 是一樣的，這裡就不再贅述。


  - mergeMap

    mergeMap 其實就是 map 加上 mergeAll 簡化的寫法，如下
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
    上面這個範例就可以簡化成
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
    記得 mergeMap 可以並行處理多個 observable，以這個例子來說當我們快速點按兩下，元素發送的時間點是有機會重疊的，這個部份的細節大家可以看上一篇文章 merge 的部分。 
    <br>
    <br>
    另外我們也可以把 mergeMap 用在發送 HTTP request
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
    如果我們快速的連續點擊五下，大家可以在開發者工具的 network 看到每個 request 會在點擊時發送並且會 log 出五個物件
    <br>
    <br>
    mergeMap 也能傳入第二個參數 selector callback，這個 selector callback 跟 concatMap 第二個參數也是完全一樣的，但 mergeMap 的重點是我們可以傳入第三個參數，來限制並行處理的數量
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
    這裡我們傳入 3 就能限制，HTTP request 最多只能同時送出 3 個，並且要等其中一個完成在處理下一個。我連續點按了五下，但第四個 request 是在第一個完成後才送出的，這個很適合用在特殊的需求下，可以限制同時發送的 request 數量。
    > RxJS 5 還保留了 mergeMap 的別名叫 flatMap，雖然官方文件上沒有，但這兩個方法是完全一樣的
    

  - switchMap, mergeMap, concatMap

    這三個 operators 還有一個共同的特性，那就是這三個 operators 可以把第一個參數所回傳的 promise 物件直接轉成 observable，這樣我們就不用再用 Rx.Observable.from 轉一次，如下
    ~~~js
    function getPersonData() {
      return fetch('https://jsonplaceholder.typicode.com/posts/1')
        .then(res => res.json())
    }
    var source = Rx.Observable.fromEvent(document.body, 'click');
    var example = source.concatMap(e => getPersonData());
                                        //直接回傳 promise 物件
    example.subscribe({
      next: (value) => { console.log(value); },
      error: (err) => { console.log('Error: ' + err); },
      complete: () => { console.log('complete'); }
    });
    ~~~
    至於在使用上要如何選擇這三個 operators？ 其實都還是看使用情境而定，這裡筆者簡單列一下大部分的使用情境
    * concatMap 用在可以確定內部的 observable 結束時間比外部 observable 發送時間來快的情境，並且不希望有任何並行處理行為，適合少數要一次一次完成到底的的 UI 動畫或特別的 HTTP request 行為。
    * switchMap 用在只要最後一次行為的結果，適合絕大多數的使用情境。
    * mergeMap 用在並行處理多個 observable，適合需要並行處理的行為，像是多個 I/O 的並行處理。
    > 建議初學者不確定選哪一個時，使用 switchMap

    > 在使用 concatAll 或 concatMap 時，請注意內部的 observable 一定要能夠的結束，且外部的 observable 發送元素的速度不能比內部的 observable 結束時間快太多，不然會有 memory issues
    

  - window
    > window 是一整個家族，總共有五個相關的 operators
    >  * window
    >  * windowCount
    >  * windowTime 
    >  * windowToggle 
    >  * windowWhen

    window 很類似 buffer 可以把一段時間內送出的元素拆出來，buffer 是把拆分出來的元素放到陣列並送出陣列；window 是把拆分出來的元素放到 observable 並送出 observable，讓我們來看一個例子
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
    首先 window 要傳入一個 observable，每當這個 observable 送出元素時，就會把正在處理的 observable 所送出的元素放到新的 observable 中並送出
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
    這裡可以看到 example 變成發送 observable 會在每次 click 事件發送出來後結束，並繼續下一個 observable，這裡我們用 switch 才把它攤平。
    <br>
    <br>
    當然這個範例只是想單存的表達 window 的作用，沒什麼太大的意義，實務上 window 會搭配其他的 operators 使用，例如我們想計算一秒鐘內觸發了幾次 click 事件
    ~~~js
    var click = Rx.Observable.fromEvent(document, 'click');
    var source = Rx.Observable.interval(1000);
    var example = click.window(source)
    example
      .map(innerObservable => innerObservable.count())
      .switch()
      .subscribe(console.log);
    ~~~
    注意這裡我們把 source 跟 click 對調了，並用到了 observable 的一個方法 count()，可以用來取得 observable 總共送出了幾個元素
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
    從 Marble Diagram 中可以看出來，我們把部分元素放到新的 observable 中，就可以利用 Observable 的方法做更靈活的操作


  - windowToggle

    windowToggle 不像 window 只能控制內部 observable 的結束，windowToggle 可以傳入兩個參數，第一個是開始的 observable，第二個是一個 callback 可以回傳一個結束的 observable，讓我們來看範例
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
    從 Marble Diagram 可以看得出來，我們用 windowToggle 拆分出來內部的 observable 始於 mouseDown 終於 mouseUp。


  - groupBy

    它可以幫我們把相同條件的元素拆分成一個 Observable，其實就跟平常在下 SQL 是一樣個概念，我們先來看個簡單的例子
    ~~~js
    var source = Rx.Observable.interval(300).take(5);
    var example = source
      .groupBy(x => x % 2);
    
    example.subscribe(console.log);
    // GroupObservable { key: 0, ...}
    // GroupObservable { key: 1, ...}
    ~~~
    上面的例子，我們傳入了一個 callback function 並回傳 groupBy 的條件，就能區分每個元素到不同的 Observable 中
    ~~~shell
    # Marble diagram 图示
    source : ---0---1---2---3---4|
              groupBy(x => x % 2)
    example: ---o---o------------|
                 \   \
                  \   1-------3----|
                  0-------2-------4|
    ~~~ 
    在實務上，我們可以拿 groupBy 做完元素的區分後，再對 inner Observable 操作，例如下面這個例子我們將每個人的分數作加總再送出
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
    這裡我們範例是想把 Jerry 跟 Anna 的分數個別作加總
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
> 在系列文章的一開頭是以陣列(Array)的 operators(map, filter, concatAll) 作為切入點，讓讀者們在學習 observable 時會更容易接受跟理解，但實際上 observable 的 operators 跟陣列的有很大的不同，主要差異有兩點
> 1. 延遲運算
> 2. 漸進式取值

  - 延遲運算
   
    延遲運算很好理解，所有 Observable 一定會等到訂閱後才開始對元素做運算，如果沒有訂閱就不會有運算的行為
    ~~~js
    var source = Rx.Observable.from([1,2,3,4,5]);
    var example = source.map(x => x + 1);
    ~~~
    上面這段程式碼因為 Observable 還沒有被訂閱，所以不會真的對元素做運算，這跟陣列的操作不一樣，如下
    ~~~js
    var source = [1,2,3,4,5];
    var example = source.map(x => x + 1);
    ~~~
    上面這段程式碼執行完，example 就已經取得所有元素的返回值了。
    > 延遲運算是 Observable 跟陣列最明顯的不同，延遲運算所帶來的優勢在之前的文章也已經提過這裡就不再贅述，因為我們還有一個更重要的差異要講，那就是漸進式取值


  - 漸進式取值

    陣列的 operators 都必須完整的運算出每個元素的返回值並組成一個陣列，再做下一個 operator 的運算，我們看下面這段程式碼
    ~~~js
    var source = [1,2,3];
    var example = source
      .filter(x => x % 2 === 0) // 這裡會運算並返回一個完整的陣列
      .map(x => x + 1) // 這裡也會運算並返回一個完整的陣列
    ~~~
    上面這段程式碼，相信讀者們都很熟悉了，大家應該都有注意到 source.filter(...) 就會返回一整個新陣列，再接下一個 operator 又會再返回一個新的陣列，這一點其實在我們實作 map 跟 filter 時就能觀察到
    ~~~js
    Array.prototype.map = function(callback) {
      var result = []; // 建立新陣列
      this.forEach(function(item, index, array) {
        result.push(callback(item, index, array))
      });
      return result; // 返回新陣列
    }
    ~~~
    每一次的 operator 的運算都會建立一個新的陣列，並在每個元素都運算完後返回這個新陣列，我們可以用下面這張動態圖表示運算過程
    <br>
    <br>
    Observable operator 的運算方式跟陣列的是完全的不同，雖然 Observable 的 operator 也都會回傳一個新的 observable，但因為元素是漸進式取得的關係，所以每次的運算是一個元素運算到底，而不是運算完全部的元素再返回。
    ~~~js
    var source = Rx.Observable.from([1,2,3]);
    var example = source
      .filter(x => x % 2 === 0)
      .map(x => x + 1)
    example.subscribe(console.log);
    ~~~
    上面這段程式碼運行的方式是這樣的
    * 送出 1 到 filter 被過濾掉
    * 送出 2 到 filter 在被送到 map 轉成 3，送到 observer console.log 印出
    * 送出 3 到 filter 被過濾掉

    <br>
    每個元素送出後就是運算到底，在這個過程中不會等待其他的元素運算。這就是漸進式取值的特性，不知道讀者們還記不記得我們在講 Iterator 跟 Observer 時，就特別強調這兩個 Pattern 的共同特性是漸進式取值，而我們在實作 Iterator 的過程中其實就能看出這個特性的運作方式
    
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
    雖然上面這段程式碼是一個非常簡單的示範，但可以看得出來每一次 map 雖然都會返回一個新的 oterator，但實際上在做元素運算時，因為漸進式的特性會使一個元素運算到底，Observable 也是相同的概念，我們可以用下面這張動態圖表示運算過程
    <br>
    <br>
    漸進式取值的觀念在 Observable 中其實非常的重要，這個特性也使得 Observable 相較於 Array 的 operator 在做運算時來的高效很多，尤其是在處理大量資料的時候會非常明顯！

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
    上面這段程式碼，分別用 observerA 跟 observerB 訂閱了 source，從 log 可以看出來 observerA 跟 observerB 都各自收到了元素，但請記得這兩個 observer 其實是分開執行的也就是說他們是完全獨立的，我們把 observerB 延遲訂閱來證明看看
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
    這裡我們延遲一秒再用 observerB 訂閱，可以從 log 中看出 1 秒後 observerA 已經印到了 1，這時 observerB 開始印卻是從 0 開始，而不是接著 observerA 的進度，代表這兩次的訂閱是完全分開來執行的，或者說是每次的訂閱都建立了一個新的執行。
    <br>
    <br>
    這樣的行為在大部分的情境下適用，但有些案例下我們會希望第二次訂閱 source 不會從頭開始接收元素，而是從第一次訂閱到當前處理的元素開始發送，我們把這種處理方式稱為組播(multicast)，那我們要如何做到組播呢？
    

  - 手動建立 subject

    或許已經有讀者想到解法了，其實我們可以建立一個中間人來訂閱 source 再由中間人轉送資料出去，就可以達到我們想要的效果
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
    從上面的程式碼可以看到，我們先建立了一個物件叫 subject，這個物件具備 observer 所有的方法(next, error, complete)，並且還能 addObserver 把 observer 加到內部的清單中，每當有值送出就會遍歷清單中的所有 observer 並把值再次送出，這樣一來不管多久之後加進來的 observer，都會是從當前處理到的元素接續往下走，就像範例中所示，我們用 subject 訂閱 source 並把 observerA 加到 subject 中，一秒後再把 observerB 加到 subject，這時就可以看到 observerB 是直接收 1 開始，這就是組播(multicast)的行為。
    <br>
    <br>
    讓我們把 subject 的 addObserver 改名成 subscribe 如下
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
    > 應該有眼尖的讀者已經發現，subject 其實就是用了 Observer Pattern。但這邊為了不要混淆 Observer Pattern 跟 RxJS 的 observer 就不再內文提及。這也是為什麼我們在一開始講 Observer Pattern 希望大家親自實作的原因。

    雖然上面是我們自己手寫的 subject，但運作方式跟 RxJS 的 Subject 實例是幾乎一樣的，我們把前面的程式碼改成 RxJS 提供的 Subject 試試
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
    大家會發現使用方式跟前面是相同的，建立一個 subject 先拿去訂閱 observable(source)，再把我們真正的 observer 加到 subject 中，這樣一來就能完成訂閱，而每個加到 subject 中的 observer 都能整組的接收到相同的元素。


  - 什麼是 Subject?
    
    雖然前面我們已經示範直接手寫一個簡單的 subject，但到底 RxJS 中的 Subject 的概念到底是什麼呢？
    <br>
    <br>
    首先 Subject 可以拿去訂閱 Observable(source) 代表他是一個 Observer，同時 Subject 又可以被 Observer(observerA, observerB) 訂閱，代表他是一個 Observable。
    <br>
    <br>
    總結成兩句話

    * Subject 同時是 Observable 又是 Observer
    * Subject 會對內部的 observers 清單進行組播(multicast)
    > 其實 Subject 就是 Observer Pattern 的實作並且繼承自 Observable。他會在內部管理一份 observer 的清單，並在接收到值時遍歷這份清單並送出值，所以我們可以這樣用 Subject
    
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
    這裡我們可以直接用 subject 的 next 方法傳送值，所有訂閱的 observer 就會接收到，又因為 Subject 本身是 Observable，所以這樣的使用方式很適合用在某些無法直接使用 Observable 的前端框架中，例如在 React 想對 DOM 的事件做監聽
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
    從上面的程式碼可以看出來，因為 React 本身 API 的關係，如果我們想要用 React 自訂的事件，我們沒辦法直接使用 Observable 的 creation operator 建立 observable，這時就可以靠 Subject 來做到這件事。
    <br>
    <br>
    Subject 因為同時是 observer 和 observable，所以應用面很廣除了前面所提的之外，還有上一篇文章講的組播(multicase)特性也會在接下來的文章做更多應用的介紹，這裡先讓我們來看看 Subject 的三個變形。


  - BehaviorSubject

    很多時候我們會希望 Subject 能代表當下的狀態，而不是單存的事件發送，也就是說如果今天有一個新的訂閱，我們希望 Subject 能立即給出最新的值，而不是沒有回應，例如下面這個例子
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
      subject.subscribe(observerB); // 3 秒後才訂閱，observerB 不會收到任何值。
    },3000)
    ~~~
    以上面這個例子來說，observerB 訂閱的之後，是不會有任何元素送給 observerB 的，因為在這之後沒有執行任何 subject.next()，但很多時候我們會希望 subject 能夠表達當前的狀態，在一訂閱時就能收到最新的狀態是什麼，而不是訂閱後要等到有變動才能接收到新的狀態，以這個例子來說，我們希望 observerB 訂閱時就能立即收到 3，希望做到這樣的效果就可以用 BehaviorSubject。
    <br>
    <br>
    BehaviorSubject 跟 Subject 最大的不同就是 BehaviorSubject 是用來呈現當前的值，而不是單純的發送事件。BehaviorSubject 會記住最新一次發送的元素，並把該元素當作目前的值，在使用上 BehaviorSubject 建構式需要傳入一個參數來代表起始的狀態，範例如下
    ~~~js
    var subject = new Rx.BehaviorSubject(0); // 0 為起始值
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
    從上面這個範例可以看得出來 BehaviorSubject 在建立時就需要給定一個狀態，並在之後任何一次訂閱，就會先送出最新的狀態。其實這種行為就是一種狀態的表達而非單存的事件，就像是年齡跟生日一樣，年齡是一種狀態而生日就是事件；所以當我們想要用一個 stream 來表達年齡時，就應該用 BehaviorSubject。


  - ReplaySubject

    在某些時候我們會希望 Subject 代表事件，但又能在新訂閱時重新發送最後的幾個元素，這時我們就可以用 ReplaySubject，範例如下
    ~~~js
    var subject = new Rx.ReplaySubject(2); // 重複發送最後 2 個元素
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
    可能會有人以為 ReplaySubject(1) 是不是就等同於 BehaviorSubject，其實是不一樣的，BehaviorSubject 在建立時就會有起始值，比如 BehaviorSubject(0) 起始值就是 0，BehaviorSubject 是代表著狀態而 ReplaySubject 只是事件的重放而已。


  - AsyncSubject

    AsyncSubject 是最怪的一個變形，他有點像是 operator last，會在 subject 結束後送出最後一個值，範例如下
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
    從上面的程式碼可以看出來，AsyncSubject 會在 subject 結束後才送出最後一個值，其實這個行為跟 Promise 很像，都是等到事情結束後送出一個值，但實務上我們非常非常少用到 AsyncSubject，絕大部分的時候都是使用 BehaviorSubject 跟 ReplaySubject 或 Subject。

    >我們把 AsyncSubject 放在大腦的深處就好

  - multicast

    multicast 可以用來掛載 subject 並回傳一個可連結(connectable)的 observable，如下
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
    上面這段程式碼我們透過 multicast 來掛載一個 subject 之後這個 observable(source) 的訂閱其實都是訂閱到 subject 上。
    ~~~js
    source.subscribe(observerA); // subject.subscribe(observerA)
    ~~~
    必須真的等到 執行 connect() 後才會真的用 subject 訂閱 source，並開始送出元素，如果沒有執行 connect() observable 是不會真正執行的。
    ~~~js
    source.connect();
    ~~~
    另外值得注意的是這裡要退訂的話，要把 connect() 回傳的 subscription 退訂才會真正停止 observable 的執行，如下
    ~~~js
    var source = Rx.Observable.interval(1000)
      .do(x => console.log('send: ' + x))
      .multicast(new Rx.Subject()); // 無限的 observable 
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
    // 這裡雖然 A 跟 B 都退訂了，但 source 還會繼續送元素
    }, 5000);
    setTimeout(() => {
      realSubscription.unsubscribe();
    // 這裡 source 才會真正停止送元素
    }, 7000);
    ~~~
    上面這段的程式碼，必須等到 realSubscription.unsubscribe() 執行完，source 才會真的結束。
    <br>
    <br>
    雖然用了 multicast 感覺會讓我們處理的對象少一點，但必須搭配 connect 一起使用還是讓程式碼有點複雜，通常我們會希望有 observer 訂閱時，就立即執行並發送元素，而不要再多執行一個方法(connect)，這時我們就可以用 refCount。

  - refCount

    refCount 必須搭配 multicast 一起使用，他可以建立一個只要有訂閱就會自動 connect 的 observable，範例如下
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
    // 訂閱數 0 => 1
    var subscriptionB;
    setTimeout(() => {
      subscriptionB = source.subscribe(observerB);
    // 訂閱數 0 => 2
    }, 1000);
    ~~~
    上面這段程式碼，當 source 一被 observerA 訂閱時(訂閱數從 0 變成 1)，就會立即執行並發送元素，我們就不需要再額外執行 connect。
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
    // 訂閱數 0 => 1
    var subscriptionB;
    setTimeout(() => {
      subscriptionB = source.subscribe(observerB);
    // 訂閱數 0 => 2
    }, 1000);
    setTimeout(() => {
      subscriptionA.unsubscribe(); // 訂閱數 2 => 1
      subscriptionB.unsubscribe(); // 訂閱數 1 => 0，source 停止發送元素
    }, 5000);
    ~~~
    
  - publish

    其實 multicast(new Rx.Subject()) 很常用到，我們有一個簡化的寫法那就是 publish，下面這兩段程式碼是完全等價的
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

    另外 publish + refCount 可以在簡寫成 share
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
Subject 其實在 RxJS 中最常被誤解的一部份，因為 Subject 可以讓你用命令式的方式雖送值到一個 observable 的串流中。

很多人會直接把 Subject 拿來用在 不知道如何建立 Observable 的狀況，比如我之前提到的可以用在 ReactJS 的 Event 中，來建立 event 的 observable

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
因為在 React API 的關係，如果我們想要把 React Event 轉乘 observable 就可以用 Subject 幫我們做到這件事；但絕大多數的情況我們是可以透過 Observable.create 來做到這件事，像下面這樣
~~~js
const example = Rx.Observable.creator(observer => {
    const source = getSomeSource(); // 某個資料源
    source.addListener('some', (some) => {
        observer.next(some)
    })
});
~~~
大概就會像上面這樣，如果沒有合適的 creation operators 我們還是可以利用 Observable.create 來建立 observable，除非真的因為框架限制才會直接用 Subject。

  - Subject 與 Observable 的差異
    <br>
    <br>
    永遠記得 Subject 其實是 Observer Design Pattern 的實作，所以當 observer 訂閱到 subject 時，subject 會把訂閱者塞到一份訂閱者清單，在元素發送時就是在遍歷這份清單，並把元素一一送出，這跟 Observable 像是一個 function 執行是完全不同的(請參考 05 篇)。
    <br>
    <br>
    Subject 之所以具有 Observable 的所有方法，是因為 Subject 繼承了 Observable 的型別，其實 Subject 型別中主要實做的方法只有 next、error、 complete、subscribe 及 unsubscribe 這五個方法，而這五個方法就是依照 Observer Pattern 下去實作的。
    <br>
    <br>
    總而言之，Subject 是 Observable 的子類別，這個子類別當中用上述的五個方法實作了 Observer Pattern，所以他同時具有 Observable 與 Observer 的特性，而跟 Observable 最大的差異就是 Subject 是具有狀態的，也就是儲存的那份清單！


  - 當前版本會遇到的問題
    <br>
    <br>
    因為 Subject 在訂閱時，是把 observer 放到一份清單當中，並在元素要送出(next)的時候遍歷這份清單，大概就像下面這樣
    ~~~js
    //...
    next() {
        // observers 是一個陣列存有所有的 observer
        for (let i = 0; i < observers.length; i++) {
            observers[i].next(value);
        }
    }
    //...
    ~~~
    這會衍伸一個大問題，就是在某個 observer 發生錯誤卻沒有做錯誤處理時，就會影響到別的訂閱，看下面這個例子
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
    上面這個例子，大家可能會預期 B 會在送出 1 的時候掛掉，另外 A 跟 C 則會持續發送元素，確實正常應該像這樣運席；但目前 RxJS 的版本中會在 B 報錯之後，A 跟 C 也同時停止運行。原因就像我前面所提的，在遍歷所有 observer 時發生了例外會導致之後的行為停止。
    > 這個應該會在之後的版本中改掉的

    那要如何解決這個問題呢？ 目前最簡單的方式當然是盡可能地把所有 observer 的錯誤處理加進去，這樣一來就不會有例外發生
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
    像上面這段程式碼，當 B 發生錯誤時就只有 B 會停止，而不會影響到 A 跟 C。

    當然還有另一種解法是用 Scheduler，但因為我們這系列的文章還沒有講到 Scheduler 所以這個解法大家看看就好
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


  - 一定需要使用 Subject 的時機？
    <br>
    <br>
    Subject 必要的使用時機除了本篇文章一開始所提的之外，正常應該是當我們一個 observable 的操作過程中發生了 side-effect 而我們不希望這個 side-effect 因為多個 subscribe 而被觸發多次，比如說下面這段程式碼
    ~~~js
    var result = Rx.Observable.interval(1000).take(6)
      .map(x => Math.random()); // side-effect，平常有可能是呼叫 API 或其他 side effect
    var subA = result.subscribe(x => console.log('A: ' + x));
    var subB = result.subscribe(x => console.log('B: ' + x));
    ~~~
    這段程式碼 A 跟 B 印出來的亂數就不一樣，代表 random(side-effect) 被執行了兩次，這種情況就一定會用到 subject(或其相關的 operators)
    ~~~js
    var result = Rx.Observable.interval(1000).take(6)
      .map(x => Math.random()) // side-effect
      .multicast(new Rx.Subject())
      .refCount();
    var subA = result.subscribe(x => console.log('A: ' + x));
    var subB = result.subscribe(x => console.log('B: ' + x));
    ~~~
    改成這樣後我們就可以讓 side-effect 不會因為訂閱數而多執行，這種情狀就是一定要用 subject 的。


## 简易实现Observable
  - 重點觀念
    
    Observable 跟 Observer Pattern 是不同的，Observable 內部並沒有管理一份訂閱清單，訂閱 Observable 就像是執行一個 function 一樣！

    所以實作過程的重點
    * 訂閱就是執行一個 function
    * 訂閱接收的物件具備 next, error, complete 三個方法
    * 訂閱會返回一個可退訂(unsubscribe)的物件

  - 基本 observable 实现
    先用最簡單的 function 來建立 observable 物件
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
    上面這段程式碼就可以做最簡單的訂閱，像下面這樣
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
    這時我們已經有最簡單的功能了，但這裡有一個大問題，就是 observable 在結束(complete)就不應該再發送元素
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
    從上面的程式碼可以看到 complete 之後還是能送元素出來，另外還有一個問題就是 observer，如果是不完整的就會出錯，這也不是我們希望看到的。
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
    上面這段程式碼可以看出來，當使用者 observer 物件沒有 complete 方法時，就會報錯。 我們應該修正這兩個問題！


  - 实现简易 Observer
    <br>
    <br>
    要修正這兩個問題其實並不難，我們只要实现一個 Observer 的类，每次使用者傳入的 observer 都會利用這個類別轉乘我們想要 Observer 物件。
    <br>
    <br>
    首先訂閱時有可能傳入一個 observer 物件，或是一到三個 function(next, error, complete)，所以我們要建立一個類別可以接受各種可能的參數
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
            // 傳入了 observer 物件
            }
          default:
            // 如果上面都不是，代表應該是傳入了一到三個 function
          break;
        }
      }
    }
    ~~~
    寫一個方法(safeObserver)來回傳正常的 observer
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
      // ... 一些程式碼
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
        // 最後回傳我們預期的 observer 物件
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
    // 預設空的 observer 
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
            // 傳入了 observer 物件
            this.destination = this.safeObserver(destinationOrNext);
            break;
          }
        default:
          // 如果上面都不是，代表應該是傳入了一到三個 function
          this.destination = this.safeObserver(destinationOrNext, error, complete);
          break;
        }
      }
      safeObserver(observerOrNext, error, complete) {
      // ... 一些程式碼
      }
    }
    ~~~
    這裡我們把真正的 observer 塞到 this.destination，接著完成 observer 的方法。
    <br>
    <br>
    Observer 的三個主要的方法(next, error, complete)都應該結束或退訂後不能再被執行，所以我們在物件內部偷塞一個 boolean 值來作為是否曾經結束的依據。
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
        // ... 一些程式碼
      }
      safeObserver(observerOrNext, error, complete) {
        // ... 一些程式碼
      }
      unsubscribe() {
        this.isStopped = true; // 偷塞一個屬性 isStopped
      }
    }
    ~~~
    接著要實作三個主要的方法就很簡單了，只要先判斷 isStopped 在使用 this.destination 物件來傳送值就可以了
    ~~~js
    class Observer {
      constructor(destinationOrNext, error, complete) {
        // ... 一些程式碼
      }
      safeObserver(observerOrNext, error, complete) {
        // ... 一些程式碼
      }
      next(value) {
        if (!this.isStopped && this.next) {
          // 先判斷是否停止過
          try {
            this.destination.next(value); // 傳送值
          } catch (err) {
            this.unsubscribe();
            throw err;
          }
        }
      }
      error(err) {
        if (!this.isStopped && this.error) {
          // 先判斷是否停止過
          try {
            this.destination.error(err); // 傳送錯誤
          } catch (anotherError) {
            this.unsubscribe();
            throw anotherError;
          }
          this.unsubscribe();
        }
      }
      complete() {
        if (!this.isStopped && this.complete) {
        // 先判斷是否停止過
          try {
            this.destination.complete(); // 發送停止訊息
          } catch (err) {
            this.unsubscribe();
            throw err;
          }
            this.unsubscribe(); // 發送停止訊息後退訂
        }
      }
      unsubscribe() {
        this.isStopped = true;
      }
    }
    ~~~
    到這裡我們就完成基本的 Observer 實作了，接著讓我們拿到基本版的 observable 中使用吧。
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
    到這裡我們就完成最基本的 observable 了，至少基本的行為都跟我們期望的一致，我知道讀者們仍然不會放過我，你們會希望做出一個 Observable 型別以及至少一個 operator 對吧？ 不用擔心，我們下一篇就會講解如何建立一個 Observable 型別和 operator 的方法！


  - 建立简易 Observable 类
    <br>
    <br>
    根据之前我们建立的 observable 物件的函式可以看出來，回傳的 observable 物件至少會有 subscribe 方法，所以最簡單的 Observable 類別大概會長像下面這樣
    ~~~js
    class Observable {
      subscribe() {
        // ...做某些事
      }
    }
    ~~~
    另外 create 的函式在執行時會傳入一個 subscribe 的 function，這個 function 會決定 observable 的行為，我们改成下面這樣
    ~~~js
    var observable = new Observable(function(observer) {
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
      observer.next('not work');
    })
    ~~~
    所以我們的 Observable 的建構式應該會接收一個 subscribe function
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到屬性中
        }
      }
      subscribe() {
        // ...做某些事
      }
    }
    ~~~
    接著我們就能完成 subscribe 要做的事情了
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到 _subscribe 屬性中
        }
      }
      subscribe() {
        const observer = new Observer(...arguments);
        this._subscribe(observer); // 就是執行一個 function 對吧
        return observer;
      }
    }
    ~~~
    到這裡我們就成功的把 create 的函式改成 Observable 的類別了，我們可以直接來使用看看
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到屬性中
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
    我們可以仿 RxJS 在靜態方法中加入 create，如下
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到屬性中
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
    這樣一來我們就可以用 Observable.create 建立 observable 物件實例。
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
    相信很多人在實作 Observable 都是卡在這個階段，因為 operators 都是回傳一個新的 observable 這中間有很多細節需要注意，並且有些小技巧才能比較好的實現，在開始實作之前先讓我們釐清幾個重點
    * operators(transform, filter, conditional...) 都是回傳一個新個 observable
    * 大部分的 operator 其實就是在原本 observer 外包裹一層物件，讓執行 next 方法前先把元素做一次處理
    * operator 回傳的 observable 訂閱時，還是需要執行原本的 observable(資料源)，也就說我們要想辦法保留原本的 observable

    讓我們一步一步來，首先 operators 執行完會回傳一個新的 observable，這個 observable 在訂閱時會先去執行 operator 的行為再發送元素，所以 observable 的訂閱方法就不能像現在這樣直接把 observer 傳給 subscribe 執行
    ~~~js
    class Observable {
      constructor(subscribe) {
        if(subscribe) {
          this._subscribe = subscribe; // 把 subscribe 存到屬性中
        }
      }
      subscribe() {
        const observer = new Observer(...arguments);
        // 先做某個判斷是否當前的 observable 是具有 operator 的
        if(??) {
          // 用 operator 的操作
        } else {
          // 如果沒有 operator 再直接把 observer 丟給 _subscribe
          this._subscribe(observer);
        }
        return observer;
      }
    }
    ~~~
    > 以我們的 Observable 實作為例，這裡最重要的就是 this._subscribe 執行，每當執行時就是開始發送元素。








## 案例-完整的拖拽功能
  - 需求分析
    > 首先我們會有一個影片在最上方，原本是位置是靜態(static)的，捲軸滾動到低於影片高度後，影片改為相對於視窗的絕對位置(fixed)，往回滾會再變回原本的狀態。當影片為 fixed 時，滑鼠移至影片上方(hover)會有遮罩(masker)與鼠標變化(cursor)，可以拖拉移動(drag)，且移動範圍不超過可視區間！

    > 上面可以拆分成以下幾個步驟
      * 準備 static 樣式與 fixed 樣式
      * HTML 要有一個固定位置的錨點(anchor)
      * 當滾動超過錨點，則影片變成 fixed
      * 當往回滾動過錨點上方，則影片變回 static
      * 影片 fixed 時，要能夠拖拉
      * 拖拉範圍限制在當前可視區間
    > 先讓我們看一下 HTML，首先在 HTML 裡有一個 div(#anchor)，這個 div(#anchor) 就是待會要做錨點用的，它內部有一個 div(#video)，則是滾動後要改變成 fixed 的元件。

    > CSS 的部分我們只需要知道滾動到下方後，要把 div(#video) 加上 video-fixed 這個 class。
  - 實作滾動的效果切換 class 的效果
    * 第一步，取得會用到的 DOM
      > 因為先做滾動切換 class，所以這裡用到的 DOM 只有 #video, #anchor。
      ~~~js
      const video = document.getElementById('video');
      const anchor = document.getElementById('anchor');
      ~~~
    * 第二步，建立會用到的 observable
      > 這裡做滾動效果，所以只需要監聽滾動事件。
      ~~~js
      const scroll = Rx.Observable.fromEvent(document, 'scroll');
      ~~~
    * 第三步，编写代码逻辑
      > 這裡我們要取得了 scroll 事件的 observable，當滾過 #anchor 最底部時，就改變 #video 的 class。
      
      > 首先我們會需要滾動事件發生時，去判斷是否滾過 #anchor 最底部，所以把原本的滾動事件變成是否滾過最底部的 true or false。
      ~~~js
      scroll.map(e => anchor.getBoundingClientRect().bottom < 0)
      ~~~
      > 這裡我們用到了 getBoundingClientRect 這個瀏覽器原生的 API，他可以取得 DOM 物件的寬高以及上下左右離螢幕可視區間上(左)的距離，如下圖
       
      > 當我們可視範圍區間滾過 #anchor 底部時， anchor.getBoundingClientRect().bottom 就會變成負值，此時我們就改變 #video 的 class。
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
      + 到這裡我們就已經完成滾動變更樣式的效果了！全部的 JS 程式碼，如下
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
      > 當然這段還能在用 debounce/throttle 或 requestAnimationFrame 做優化，這個部分我們日後的文章會在提及。
  - 实现拖拽的行为
    * 第一步，取得會用到的 DOM <br>
      這裡我們會用到的 DOM 跟前面是一樣的(#video)，所以不用多做什麼。
    * 第二步，建立會用到的 observable <br>
      這裡跟上次一樣，我們會用到 mousedown, mouseup, mousemove 三個事件。
      ~~~js
      const mouseDown = Rx.Observable.fromEvent(video, 'mousedown')
      const mouseUp = Rx.Observable.fromEvent(document, 'mouseup')
      const mouseMove = Rx.Observable.fromEvent(document, 'mousemove')
      ~~~
    * 第三步，撰寫程式邏輯 <br>
      跟上次是差不多的，首先我們會點擊 #video 元件，點擊(mousedown)後要變成移動事件(mousemove)，而移動事件會在滑鼠放開(mouseup)時結束(takeUntil)
      ~~~js
      mouseDown
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
      ~~~
      因為把 mouseDown observable 發送出來的事件換成了 mouseMove observable，所以變成了 observable(mouseDown) 送出 observable(mouseMove)。因此最後用 concatAll 把後面送出的元素變成 mouse move 的事件。
      <br><br> 但這裡會有一個問題，就是我們的這段拖拉事件其實只能做用到 video-fixed 的時候，所以我們要加上 filter
      ~~~js
      mouseDown
        .filter(e => video.classList.contains('video-fixed'))
        .map(e => mouseMove.takeUntil(mouseUp))
        .concatAll()
      ~~~
      這裡我們用 filter 如果當下 #video 沒有 video-dragable class 的話，事件就不會送出。
      <br>
      <br>
      再來我們就能跟上次一樣，把 mousemove 事件變成 { x, y } 的物件，並訂閱來改變 #video 元件
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
      到這裡我們基本上已經完成了所有功能，但這裡有兩個大問題我們還沒有解決：
      * 第一次拉動的時候會閃一下，不像優酷那麼順
      * 拖拉會跑出當前可視區間，跑上出去後就抓不回來了
      
      <br>
      首先第一個問題是因為我們的拖拉直接給元件滑鼠的位置(clientX, clientY)，而非給滑鼠相對移動的距離！我們只要把點擊目標的左上角當作 (0,0)，並以此改變元件的樣式，就不會有閃動的問題。我們可以用 withLatestFrom 來把 mousedown 與 mousemove 兩個 Event 的值同時传入 callback。
      
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
      // 當我們能夠同時得到 mousemove 跟 mousedown 的事件，接著就只要把 滑鼠相對可視區間的距離(client) 減掉點按下去時 滑鼠相對元件邊界的距離(offset) 就行了。這時拖拉就不會先閃動一下囉！
      ~~~
      這個問題其實只要給最大最小值就行了，因為需求的關係，這裡我們的元件是相對可視居間的絕對位置(fixed)，也就是說
      + top 最小是 0
      + left 最小是 0
      + top 最大是可視高度扣掉元件本身高度
      + left 最大是可視寬度扣掉元件本身寬度
      ~~~js
      const validValue = (value, max, min) => {
        return Math.min(Math.max(value, min), max)
      }
      // 第一個參數給原本要給的位置值，後面給最大跟最小，如果今天大於最大值我們就取最大值，如果今天小於最小值則取最小值。
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
      // 這裡偷懶了一下，直接寫死元件的寬高(320, 180)，實際上應該用 getBoundingClientRect 計算是比較好的。
      ~~~

## 案例-简易的 Auto Complete 实现
  - 需求分析
    > 首先我們會有一個搜尋框(input#search)，當我們在上面打字並停頓超過 100 毫秒就發送 HTTP Request 來取得建議選項並顯示在收尋框下方(ul#suggest-list)，如果使用者在前一次發送的請求還沒有回來就打了下一個字，此時前一個發送的請求就要捨棄掉，當建議選項顯示之後可以用滑鼠點擊取建議選項代搜尋框的文字。

    > 上面可以拆分成以下幾個步驟
      * 準備 input#search 以及 ul#suggest-list 的 HTML 與 CSS
      * 在 input#search 輸入文字時，等待 100 毫秒再無輸入，就發送 HTTP Request
      * 當 Response 還沒回來時，使用者又輸入了下一個文字就捨棄前一次的並再發送一次新的 Request 
      * 接受到 Response 之後顯示建議選項 
      * 滑鼠點擊後取代 input#search 的文字
        <br>
        <br>
    
    首先在 HTML 裡有一個 input(#search)，這個 input(#search) 就是要用來輸入的欄位，它下方有一個 ul(#suggest-list)，則是放建議選項的地方
    ~~~js
    const url = 'https://zh.wikipedia.org/w/api.php?action=opensearch&format=json&limit=5&origin=*';

    const getSuggestList = (keyword) => fetch(url + '&search=' + keyword, { method: 'GET', mode: 'cors' })
      .then(res => res.json())
    ~~~
    上面是已經寫好了要發送 API 的 url 跟方法getSuggestList，接著就開始實作自動完成的效果吧！
    

  - 开始实现
    * 第一步，取得需要的 DOM 物件
        
      這裡我們會用到 #search 以及 #suggest-list 這兩個 DOM
      ~~~js
      const searchInput = document.getElementById('search');
      const suggestList = document.getElementById('suggest-list');
      ~~~
    * 第二步，建立所需的 Observable

      這裡我們要監聽 收尋欄位的 input 事件，以及建議選項的點擊事件
      ~~~js
      const keyword = Rx.Observable.fromEvent(searchInput, 'input');
      const selectItem = Rx.Observable.fromEvent(suggestList, 'click');
      ~~~
    * 第三步，撰寫程式邏輯

      每當使用者輸入文字就要發送 HTTP request，並且有新的值被輸入後就捨棄前一次發送的，所以這裡用 switchMap
      ~~~js
      keyword.switchMap(e => getSuggestList(e.target.value))
      ~~~
      這裡我們先試著訂閱，看一下 API 會回傳什麼樣的資料
      ~~~js
      keyword
        .switchMap(e => getSuggestList(e.target.value))
        .subscribe(console.log)
      ~~~
      在 search 栏位亂打幾個字，大家可以在 console 看到数据，他會回傳一個陣列帶有四個元素，其中第一個元素是我們輸入的值，第二個元素才是我們要的建議選項清單。
      <br>
      <br>
      所以我們要取的是 response 陣列的第二的元素，用 switchMap 的第二個參數來選取我們要的
      ~~~js
      keyword
        .switchMap(e => getSuggestList(e.target.value),(e, res) => res[1])
        .subscribe(console.log)
      ~~~
      這時再輸入文字就可以看到確實是我們要的返回值
      <br>
      <br>
      寫一個 render 方法，把陣列轉成 li 並寫入 suggestList
      ~~~js
      const render = (suggestArr = []) => {
        suggestList.innerHTML = suggestArr
          .map(item => '<li>'+ item +'</li>')
          .join('');  
      }
      ~~~
      這時我們就可用 render 方法把取得的陣列傳入
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
      如此一來我們打字就能看到結果出現在 input 下方了，只是目前還不能點選，先讓我們來做點選的功能，這裡點選的功能我們需要用到 delegation event 的小技巧，利用 ul 的 click 事件，來塞選是否點到了 li，如下
      ~~~js
      selectItem.filter(e => e.target.matches('li'))
      ~~~
      上面我們利用 DOM 物件的 matches 方法(裡面的字串放 css 的 selector)來過濾出有點擊到 li 的事件，再用 map 轉出我們要的值並寫入 input。
      ~~~js
      selectItem
        .filter(e => e.target.matches('li'))
        .map(e => e.target.innerText)
        .subscribe(text => searchInput.value = text)
      ~~~
      現在我們就能點擊建議清單了，但是點擊後清單沒有消失，這裡我們要在點擊後重新 redner，所以把上面的程式碼改一下
      ~~~js
      selectItem
        .filter(e => e.target.matches('li'))
        .map(e => e.target.innerText)
        .subscribe(text => {
          searchInput.value = text;
          render();
        })
      ~~~
      這樣一來我們就完成最基本的功能了，還記得我們前面說每次打完字要等待 100 毫秒在發送 request 嗎？ 這樣能避免過多的 request 發送，可以降低 server 的負載也會有比較好的使用者體驗，要做到這件事很簡單只要加上 debounceTime(100) 就完成了
      ~~~js
      keyword
        .debounceTime(100)
        .switchMap(e => getSuggestList(e.target.value),(e, res) => res[1])
        .subscribe(list => render(list))
      ~~~
      當然這個數值可以依照需求或是請 UX 針對這個細節作調整。這樣我們就完成所有功能了。
  - 扩展
    
    當我們能夠自己從頭到尾的完成這樣的功能，在面對各種不同的需求，我們就能很方便的針對需求作調整，而不會受到套件的牽制！比如說我們希望使用者打了 2 個字以上在發送 request，這時我們只要加上一行 filter 就可以了
    ~~~js
    keyword
      .filter(e => e.target.value.length > 2)
      .debounceTime(100)
      .switchMap(e => getSuggestList(e.target.value), (e, res) => res[1])
      .subscribe(list => render(list))
    ~~~
    又或者網站的使用量很大，可能 API 在量大的時候會回傳失敗，主管希望可以在 API 失敗的時候重新嘗試 3 次，我們只要加個 retry(3) 就完成了
    ~~~js
    keyword
      .filter(e => e.target.value.length > 2)
      .debounceTime(100)
      .switchMap(e => Rx.Observable.from(getSuggestList(e.target.value)).retry(3), (e, res) => res[1])
      .subscribe(list => render(list))
    ~~~
