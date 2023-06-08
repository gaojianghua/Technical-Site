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


