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
    > Iterator Pattern 虽然很单纯，但同时带來了两个优势，第一它渐进式取得资料的特性可以拿来做延迟运算(Lazy evaluation)，让我们能用它来处理大资料结构。第二因为 iterator 本身是序列，所以可以实现所有队列的运算方法像 map, filter... 等！
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
  >  从上述的代码能看得出來 Observable 同时可以处理同步与异步的行为！
- 观察者 Observer
  > Observable 可以被订阅(subscribe)，或说可以被观察，而订阅 Observable 的物件又称为 观察者(Observer)。观察者是一个具有三个方法(method)的物件，每当 Observable 发生事件时，便会呼叫观察者相对应的方法。
  
  >- next：每當 Observable 發送出新的值，next 方法就會被呼叫。
  >- complete：在 Observable 沒有其他的資料可以取得時，complete 方法就會被呼叫，在 complete 被呼叫之後，next 方法就不會再起作用。
  >- error：每當 Observable 內發生錯誤時，error 方法就會被呼叫。
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
    
    > 上面的示例可以看得出來在 complete 执行后，next 就会自动失效，所以没有印出 not work。
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

    // 宣告一個觀察者，具備 next, error, complete 三個方法
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
    // 用我們定義好的觀察者，來訂閱這個 observable
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
    // observable.subscribe 会在内部自动組成 observer 物件來操作。
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
    
    > 这里也可以用 fromPromise ，会有相同的結果。
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
    // egghead 同時具有 註冊監聽者及移除監聽者 兩種方法
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
    > 這裡我們用了 setTimeout 在 5 秒後，執行了 subscription.unsubscribe() 來停止訂閱並釋放資源。
  
    > Events observable 尽量不要用 unsubscribe ，通常我们会使用 takeUntil，在某个事件发生后來完成 Event observable，这个部份我們之后会讲到！
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
  > 在这个时间序当中，我们可能会发送出值(value)，如果值是数字则直接用阿拉伯数字取代，其他的资料型別则用相近的英文符号代表，这里我们用 interval 举例
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
    > Observable 的 map 方法使用上跟队列的 map 是一样的，我们传入一个 callback function，这个 callback function 会带入每次发送出來的元素，然后我们回传新的元素，如下
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
    > 有时我们的 Observable 送出的元素又是一个 observable，就像是二维队列，队列里面的元素是队列，这时我们就可以用 concatAll 把它摊平成一维队列，大家也可以直接把 concatAll 想成把所有元素 concat 起來。范例如下
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
    > 這裡可以看到 source observable 內部每次發送的值也是 observable，這時我們用 concatAll 就可以把 source 攤平成 example。
    
    > 這裡需要注意的是 concatAll 會處理 source 先發出來的 observable，必須等到這個 observable 結束，才會再處理下一個 source 發出來的 observable，讓我們用下面這個範例說明。
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
    > 這裡可以看到 source 會送出 3 個 observable，但是 concatAll 後的行為永遠都是先處理第一個 observable，等到當前處理的結束後才會再處理下一個。
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
    > 上面可以看得出來，merge 把多个 observable 同时处理，这跟 concat 一次处理一个 observable 是完全不一样的，由于是同时处理行为会变得较为复杂
    ~~~shell
    # Marble diagram 图示
    source : ----0----1----2|
    source2: --0--1--2--3--4--5|
                merge()
    example: --0-01--21-3--(24)--5|
    ~~~
    > 这里可以看到 merge 之后的 example 在时间序上同时在跑 source 与 source2，当两件事情同时发生时，会同步送出资料(被 merge 的在后面)，当两个 observable 都结束时才会真的結束。
  
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

    > 例如一个影片播放器有两个按钮，一个是暂停(II)，另一个是結束播放(口)。这两个按钮都具有相同的行为就是影片会被停止，只是结束播放会让影片回到 00 秒，这时我们就可以把这两个按钮的事件 merge 起來处理影片暂停这件事。
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
    > 首先 combineLatest 可以接收多个 observable，最后一个参数是 callback function，这个 callback function 接收的参数数量跟合并的 observable 数量相同，依照范例來說，因为我们这里合并了两个 observable 所以后面的 callback function 就接收 x, y 两个参数，x 会接收从 source 发送出來的值，y 会接收从 newest 发送出來的值。
