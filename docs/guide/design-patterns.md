# 设计模式
## 面向对象

面向对象示例:

~~~js
function CreateCat(name) {
    this.name = name
    this.eat = function () {
        console.log(this.name + 'eat something')
    }
}

let catA = new CreateCat('catA')
let catB = new CreateCat('catB')
let catC = new CreateCat('catC')

catA.eat()
catB.eat()
catC.eat()
~~~



函数知识:

在函数执行的时候会在函数内部创建两个变量: arguments和this

arguments存储着实参的一个类数组对象

this指向函数的执行上下文



New操作符:

1.创建一个空对象

2.将构造函数的原型对象 ( prototype ) 属性赋值给新对象的原型链 ( --proto--)

3.将构造函数的this指向新对象

4.执行构造函数的代码

5.将新对象返回

模拟:

~~~js
function CreateCat(name) {
    this.name = name
    this.eat = function () {
        console.log(this.name + 'eat something')
    }
}
let cat = (function () {
    let obj = {}
    obj.__proto__ = CreateCat.prototype
    CreateCat.call(obj, 'cat')
    return obj
})()
console.log(cat.name)
~~~



### 继承

1.类式继承:

- 这种方法不支持父构造函数带参数
- 父构造函数里的方法和属性都会变成共有属性

2.构造函数继承:

- 不能继承父构造函数的原型方法

3.组合式继承:

- --proto--里面的属性没有用
- 执行了两次父构造函数

4.寄生组合式继承:

- 解决了上面三种方式的问题, 是相对完美的继承方式

~~~js
function A(name) {
    this.name = name
    this.list = [1,2,3]
}
A.prototype.getName = function () {
    console.log(this.name)
}
function SubA(name) {
    A.call(this, name)
    this.subName = 'sub' + this.name
}
function inhertPrototype(subClass, superClass){
    function F(){}
    F.prototype = superClass.prototype
    subClass.prototype = new F()
}
inhertPrototype(SubA, A)
~~~



### 多态

表示不同对象调用相同方法会产生不同结果

示例:

~~~js
function Base() {}
Base.prototype.initial = function () {
    this.init()
}
function SubA() {
    this.init = function () {
        console.log('subA init')
    }
}
function SubB() {
    this.init = function () {
        console.log('subB init')
    }
}
SubA.prototype = new Base()
SubB.prototype = new Base()
let subA = new SubA()
let subB = new SubB()
subA.init()
subB.init()
~~~



### UML类图

~~~js
class People {
    constructor(name, house) {
        this.name = name
        this.house = house
    }
    saySomething(){

    }
}
class A extends People{
    constructor(name, house) {
        super(name, house);
    }
    saySomething() {
        alert('I am A')
    }
}
class B extends People{
    constructor(name, house) {
        super(name, house);
    }
    saySomething() {
        alert('I am B')
    }
}
class House {
    constructor(city) {
        this.city = city
    }
    showCity(){
        alert(`house in ${this.city}`)
    }
}
let aHouse = new House('北京')
let a = new A('aaa', aHouse)
console.log(a)
let b = new B('bbb')
console.log(b)
~~~



## SOLID五大设计原则

S-单一职责原则

- 一个程序只做好一件事
- 如果功能过于复杂就拆分开, 每个部分保持独立

O-开放封闭原则

- 对扩展开放, 对修改封闭
- 增加需求时, 扩展新代码, 而非修改已有代码
- 这是软件设计的终极目标

L-李氏置换原则

- 子类能覆盖父类
- 父类能出现的地方子类就能出现
- JS中使用较少 ( 弱类型 & 继承使用较少 )

I-接口独立原则

- 保持接口的单一独立, 避免出现"胖接口"
- JS中没有接口 ( TS例外 ) , 使用较少
- 类似于单一职责原则, 这里只关注接口

D-依赖导致原则

- 面向接口编程, 依赖于抽象而不依赖于具体
- 使用方只关注接口而不关注具体类的实现
- JS中使用较少 ( 没有接口 & 弱类型 )

举例:

- 单一职责原则: 每个then中的逻辑只做好一件事
- 开放封闭原则: 如果新增需求, 扩展then

~~~js
function loadImg(src) {
    let promise = new Promise(function (resolve,reject) {
        let img = document.createElement('img')
        img.onload = function () {
            resolve(img)
        }
        img.onerror = function () {
            reject('图片加载失败')
        }
        img.src = src
    })
    return promise
}
let src = 'https://img.com'
let result = loadImg(src)
result.then(function (img) {
    alert(`width: ${img.width}`)
    return img
}).then(function (img) {
    alert(`height: ${img.height}`)
}).catch(function (er) {
    alert(er)
})
~~~



## 设计模式汇总

创建型

1. 工厂模式 ( 工厂方法模式, 抽象工厂模式, 建造者模式 )

2. 单例模式

3. 原型模式

组合型

1. 适配器模式

2. 装饰器模式

3. 代理模式

4. 外观模式

5. 桥接模式

6. 组合模式

7. 享元模式

行为型

1. 策略模式
2. 模板方法模式
3. 观察者模式
4. 迭代器模式
5. 职责链模式
6. 命令模式
7. 备忘录模式
8. 状态模式
9. 访问者模式
10. 中介者模式
11. 解释器模式



## 工厂模式

普通示例:

~~~js
function createPerson(name){
    let a = {}
    a.name = name
    a.getName =  function () {
        console.log(this.name)
    }
    return a
}
let person = createPerson('高江华')
person.getName()
console.log(person.name)
~~~

进阶示例:

~~~js
function Person(name){
    this.name = name
}
Person.prototype.getName = function () {
    console.log(this.name)
}
function Car(model){
    this.model = model
}
Car.prototype.getModel = function () {
    console.log(this.model)
}
function Create(type, param) {
    if (this instanceof Create){
        return new this[type](param)
    } else {
        return new Create(type, param)
    }

}
Create.prototype = {
    person: Person,
    car: Car
}
let person = new Create('person', '高江华')
let car = Create('car', '灰太狼')
person.getName()
car.getModel()
~~~

类示例:

~~~js
class Product{
    constructor(name) {
        this.name = name
    }
    init(){
        alert('init')
    }
    fun1(){
        alert('fun1')
    }
    fun2(){
        alert('fun2')
    }
}
class Creator{
    create(name){
        return new Product(name)
    }
}
let creator = new Creator()
let p = creator.create('p1')
p.init()
~~~

 

## 建造模式

普通示例:

~~~js
let data = [
    {
        name: '高 江华',
        age: 25,
        work: 'engineer'
    },
    {
        name: '灰 太狼',
        age: 25,
        work: 'teacher'
    },
    {
        name: '红 太狼',
        age: 25,
        work: 'xxx'
    }
]
function CandiDate (param) {
    let candiDate = {}
    candiDate.name = param.name
    console.log(param.name)
    candiDate.age = param.age
    candiDate.firstName = candiDate.name.split(' ')[0]
    candiDate.lastName = candiDate.name.split(' ')[1]
    candiDate.work = {}
    switch (param.work) {
        case 'engineer':
            candiDate.work.name = '工程师'
            candiDate.work.description = '热爱编程'
            break
        case 'teacher':
            candiDate.work.name = '老师'
            candiDate.work.description = '乐于分享'
            break
        default:
            candiDate.work.name = param.work
            candiDate.work.description = '无'
    }
    candiDate.work.changeWork = function (work) {
        this.name = work
    }
    candiDate.work.changeDes = function (des) {
        this.description = des
    }
    return candiDate
}
let candiDateArr = []
for (let i = 0; i < data.length; i++){
    candiDateArr[i] = CandiDate(data[i])
}
console.log(candiDateArr[0])
candiDateArr[0].work.changeWork('xxx')
console.log(candiDateArr[0].work)
~~~

进阶示例:

~~~js
let data = [
    {
        name: '高 江华',
        age: 25,
        work: 'engineer'
    },
    {
        name: '灰 太狼',
        age: 25,
        work: 'teacher'
    },
    {
        name: '红 太狼',
        age: 25,
        work: 'xxx'
    }
]
function CandiDate (param) {
    let candiDate = new Person(param)
    candiDate.name = new CreateName(param.name)
    candiDate.work = new CreateWork(param.work)
    return candiDate
}
function Person(param) {
    this.name = param.name
    this.age = param.age
}
function CreateName(name) {
    this.wholeName = name
    this.firstName = name.split(' ')[0]
    this.secondNaem = name.split(' ')[1]
}
function CreateWork(work) {
    switch (work) {
        case 'engineer':
            this.name = '工程师'
            this.description = '热爱编程'
            break
        case 'teacher':
            this.name = '老师'
            this.description = '乐于分享'
            break
        default:
            this.name = work
            this.description = '无'
    }
    CreateWork.prototype.changeWork = function (work) {
        this.name = work
    }
    CreateWork.prototype.changeDes = function (des) {
        this.description = des
    }
}
let candiDateArr = []
for (let i = 0; i < data.length; i++){
    candiDateArr[i] = CandiDate(data[i])
}
console.log(candiDateArr[0])
candiDateArr[0].work.changeWork('xxx')
console.log(candiDateArr[0].work)
~~~



## 单例模式

~~~js
let createSingle = (function () {
    let unique = null
    function single() {
        return {
            a: 1
        }
    }

    return function () {
        if (unique === null) {
            unique = single()
        }
        return unique
    }
})()
let a = createSingle()
let b = createSingle()
console.log(a === b)
~~~

## 装饰模式

~~~js
function Car() {
    this.price = 10
}
function carLeft(carClass) {
    carClass.hasHeatSeat = true
    carClass.price += 2
}
function carRight(carClass) {
    carClass.hasAutoMirror = true
    carClass.price += 0.8
}
let car = new Car()
console.log(car.price)
carLeft(car)
carRight(car)
console.log(car.price)
~~~

~~~js
class Circle {
    draw(){
        console.log('画一个圆')
    }
}
class Decorator {
    constructor(circle) {
        this.circle = circle
    }
    draw(){
        this.circle.draw()
        this.setRedBorder(circle)
    }
    setRedBorder(circle){
        console.log('设置红色边框')
    }
}
let circle = new Circle()
circle.draw()
let dec = new Decorator(circle)
dec.draw()
~~~

es7装饰器

~~~js
function dec(isDec) {
    return function (target) {
        target.isDec = isDec
    }
}
@dec(false)
class Demo{
    
}
alert(Demo.isDec)
~~~



## 观察模式

~~~js
let msgCenter = (function () {
    let msg = {} //存消息
    return {
        //订消息
        register: function (type, fn) {
            if (msg[type]){
                msg[type].push(fn)
            }else {
                msg[type] = [fn]
            }
        },
        //发消息
        fire: function (type, args) {
            if (!msg[type]){
                return
            }
            let event = {
                type: type,
                args: args || {}
            }
            for (let i = 0; i < msg[type].length; i++) {
                msg[type][i](event)
            }
        },
        //取消订阅消息
        cancel: function (type, fn) {
            if (!msg[type]) {
                return
            }
            for (let i = 0; i < msg[type].length; i++) {
                if (msg[type][i] === fn) {
                    msg[type].splice(i, 1)
                    break
                }
            }
        }
    }
})()
function Person() {
    this.alreadyRegister = {}
}
Person.prototype.register = function (type, fn) {
    if (this.alreadyRegister[type]) {
        console.log('您已订阅,请不要重复订阅')
    }else {
        msgCenter.register(type,fn)
        this.alreadyRegister[type] = fn
    }
}
Person.prototype.cancel = function (type) {
    msgCenter.cancel(type, this.alreadyRegister[type])
    delete this.alreadyRegister[type]
}
let person1 = new Person()
let person2 = new Person()
let person3 = new Person()
person1.register('carInfo', function (e) {
    console.log('person1:' + e.type + e.args.info)
})
person1.register('newInfo', function (e) {
    console.log('person1:' + e.type + e.args.info)
})
person2.register('carInfo', function (e) {
    console.log('person1:' + e.type + e.args.info)
})
person3.register('newInfo', function (e) {
    console.log('person1:' + e.type + e.args.info)
})
person3.cancel('newInfo')

msgCenter.fire('carInfo', {info: '新款汽车上市'})
msgCenter.fire('newInfo', {info: '国家领导人访华'})
~~~



## 适配模式

~~~js
class Adaptee {
    specificRequest(){
        return '德国标准插头'
    }
}
class Target{
    constructor() {
        this.adaptee = new Adaptee()
    }
    request(){
        let info = this.adaptee.specificRequest()
        return `${info} -> 转换器 -> 中国标准插头`
    }
}
let target = new Target()
target.request()
~~~



## 代理模式

~~~js
class ReadImg{
    constructor(filename) {
        this.fileName = filename
        this.loadFromDisk()
    }
    display(){
        console.log('display...' + this.fileName)
    }
    loadFromDisk(){
        console.log('loading...' + this.fileName)
    }
}
class ProxyImg {
    constructor(fileName) {
        this.realImg = new ReadImg(fileName)
    }
    display(){
        this.realImg.display()
    }
}
let proxyImg = new ProxyImg('1.png')
proxyImg.display()
~~~

jquery代理

~~~js
$('#div1').click(function(){
	setTimeout($.proxy(function(){
        $(this).css('background-color', 'yellow')
    }, this), 1000)
})
~~~

es6代理

~~~js
let star = {
    name: '高江华',
    age: 25,
    phone: '15257184434'
}
let agent = new Proxy(star, {
    get: function (target, key) {
        if (key === 'phone'){
            return '16899997777'
        }
        if (key === 'price'){
            return 120000
        }
        return target[key]
    },
    set: function (target, key, val) {
        if (key === 'customPrice'){
            if (val < 100000){
                throw new Error('价格太低')
            }else {
                target[key] = val
                return true
            }
        }
    }
})
console.log(agent.name)
console.log(agent.age)
console.log(agent.phone)
console.log(agent.price)
agent.customPrice = 150000
console.log(agent.customPrice)
~~~



## 迭代模式

- 顺序访问一个集合
- 使用者无需知道集合内部结构

~~~js
class Iterator{
    constructor(container) {
        this.list = container.list
        this.index = 0
    }
    next(){
        if (this.hasNext()){
            return this.list[this.index++]
        }
        return null
    }
    hasNext(){
        return this.index < this.list.length;
    }
}
class Container {
    constructor(list) {
        this.list = list
    }
    getIterator(){
        return new Iterator(this)
    }
}
let arr = [1,2,3,4,5]
let container = new Container(arr)
let iterator = container.getIterator()
while (iterator.hasNext()){
    console.log(iterator.next())
}
~~~

es6中的Iterator

~~~js
Array.prototype[Symbol.iterator]().next()
//原型对象下有Symbol.iterator方法执行后会得到一个迭代器
//迭代器的原型链上有一个next()方法
//执行next()方法,若value为undefined,done为true表示遍历完成
~~~

~~~js
function each(data){
    let iterator = data[Symbol.iterator]()
    let item = {done: false}
    while (!item.done){
        item = iterator.next()
        if (!item.done){
            console.log(item.value)
        }
    }
}
//简化
function each(data){
    for(let item of data){
    	console.log(item)
    }
}
let arr = [1,2,3,4,5]
let m = new Map()
m.set('a', 100)
m.set('b', 200)
each(arr)
each(m)
~~~



## 状态模式

~~~js
class State {
    constructor(color) {
        this.color = color
    }
    handle(context){
        console.log(this.color)
        context.setState(this)
    }
}
class Context {
    constructor() {
        this.state = null
    }
    getState(){
        return this.state
    }
    setState(state){
        this.state = state
    }
}
let context = new Context()
let green = new State('green')
let yellow = new State('yellow')
let red = new State('red')
green.handle(context)
console.log(context.getState())
yellow.handle(context)
console.log(context.getState())
red.handle(context)
console.log(context.getState())
~~~



## 中介模式

~~~js
class A{
    constructor() {
        this.number = 0
    }
    setNumber(num, m){
        this.number = num
        if (m){
            m.setB()
        }
    }
}
class B {
    constructor() {
        this.number = 0
    }
    setNumber(num, m){
        this.number = num
        if (m){
            m.setA()
        }
    }
}
class Mediator {
    constructor(a, b) {
        this.a = a
        this.b = b
    }
    setB(){
        let number = this.a.number
        this.b.setNumber(number * 100)
    }
    setA(){
        let number = this.b.number
        this.b.setNumber(number / 100)
    }
}
let a = new A()
let b = new B()
let m = new Mediator(a, b)
a.setNumber(100, m)
console.log(a.number, b.number)
b.setNumber(100, m)
console.log(a.number, b.number)
~~~



## 原型模式

~~~js
let prototype = {
    getName:function () {
        return this.first + ' ' + this.last
    },
    say:function () {
        alert('hello')
    }
}
let x = Object.create(prototype)
x.first = 'A'
x.last = 'B'
alert(x.getName())
x.say()
let y = Object.create(prototype)
y.first = 'C'
y.last = 'D'
alert(y.getName())
y.say()
~~~



## 桥接模式

~~~~js
class Color {
    constructor(name) {
        this.name = name
    }
}
class Shape {
    constructor(name, color) {
        this.name = name
        this.color = color
    }
    draw(){
        console.log(this.color.name, this.name)
    }
}
let red = new Color('red')
let yellow = new Color('yellow')
let circle = new Shape('circle', red)
circle.draw()
let triangle = new Shape('triangle', yellow)
triangle.draw()
~~~~

## 策略模式

~~~js
class User {
    constructor(type) {
        this.type = type
    }
    buy(){
        if (this.type === 'ordinary'){
            console.log('普通用户')
        }else if (this.type === 'member'){
            console.log('会员用户')
        }else if (this.type === 'vip'){
            console.log('vip用户')
        }
    }
}
let u1 = new User('ordinary')
u1.buy()
let u2 = new User('member')
u2.buy()
let u3 = new User('vip')
u3.buy()

//策略优化
class OrdinaryUser {
    buy(){
        console.log('普通用户')
    }
}
class MemberUser {
    buy(){
        console.log('会员用户')
    }
}
class VipUser {
    buy(){
        console.log('vip用户')
    }
}
let u1 = new OrdinaryUser()
u1.buy()
let u2 = new MemberUser()
u2.buy()
let u3 = new VipUser()
u3.buy()
~~~



## 命令模式

~~~js
class Receiver {
    exec(){
        console.log('执行')
    }
}
class Command{
    constructor(receiver) {
        this.receiver = receiver
    }
    cmd(){
        console.log('执行命令')
        this.receiver.exec()
    }
}
class Invoker{
    constructor(command) {
        this.command = command
    }
    invoke(){
        console.log('开始')
        this.command.cmd()
    }
}
let soldier = new Receiver()
let trumpeter = new Command(soldier)
let general = new Invoker(trumpeter)
general.invoke()
~~~



## 备忘模式

~~~js
class Editor {
    constructor() {
        this.content = null
    }
    setContent(content){
        this.content = content
    }
    getContent(){
        return this.content
    }
    saveContentToMemento(){
        return new Memento(this.content)
    }
    getContentFromMemento(memento){
        this.content = memento.getContent()
    }
}
let editor = new Editor()
let careTaker = new CareTaker()
editor.setContent('111')
editor.setContent('222')
careTaker.add(editor.saveContentToMemento())
editor.setContent('333')
careTaker.add(editor.saveContentToMemento())
editor.setContent('444')

console.log(editor.getContent())
editor.getContentFromMemento(careTaker.get(1))
console.log(editor.getContent())
editor.getContentFromMemento(careTaker.get(0))
console.log(editor.getContent())
~~~



## 面试题

第一题:

- 打车时, 可以打专场和快车, 任何车都有车牌和名称
- 不同车价格不同, 快车每公里1元, 专车每公里2元
- 行程开始时, 显示车辆信息
- 行程结束时, 显示打车金额 ( 假定行程为5公里 )

~~~js
class Car {
    constructor(number, name) {
        this.number = number
        this.name = name
    }
}
class Kuaiche extends Car{
    constructor(number, name) {
        super(number, name);
        this.price = 1
    }
}
class Zhuanche extends Car{
    constructor(number, name) {
        super(number, name);
        this.price = 2
    }
}
class Trip {
    constructor(car) {
        this.car = car
    }
    start(){
        console.log(`行程开始, 名称: ${this.car.name},
            车牌号: ${this.car.number}`)
    }
    end(){
        console.log('行程结束, 价格: ' + (this.car.price * 5))
    }
}
let car = new Kuaiche(100, '桑塔纳')
let trip = new Trip(car)
trip.start()
trip.end()
~~~



第二题

- 某停车场,分3层,每层100车位
- 每个车位都能监控到车辆的驶入和离开
- 车辆进入前,显示每层的空余车位数量
- 车辆进入时,摄像头可识别车牌号和时间
- 车辆出来时, 出口显示器显示车牌号和停车时长

~~~js
class Car {
    constructor(num) {
        this.num = num
    }
}
class Camera {
    shot(car){
        return{
            num: car.num,
            inTime: Date.now()
        }
    }
}
class Screen {
    show(car, inTime){
        console.log('车牌号', car.num)
        console.log('停车时间', Date.now() - inTime)
    }
}
class Park {
    constructor(floors) {
        this.floors = floors || []
        this.camera = new Camera()
        this.screen = new Screen()
        this.carList = {}
    }
    in(car){
        const info = this.camera.shot(car)
        const i = parseInt(Math.random() * 100 % 100)
        const place = this.floors[0].places[i]
        place.in()
        info.place = place
        this.carList[car.num] = info
    }
    out(car){
        const info = this.carList[car.num]
        const place = info.place
        place.out()
        this.screen.show(car, info.inTime)
        delete this.carList[car.num]
    }
    emptyNum(){
        return this.floors.map(floor => {
            return `${floor.index} 层还有 ${floor.emptyPlaceNum()} 个空闲车位`
        }).join('\n')
    }
}
class Floor{
    constructor(index, places) {
        this.index = index
        this.places = places || []
    }
    emptyPlaceNum(){
        let num = 0
        this.places.forEach(p => {
            if (p.empty){
                num = num + 1
            }
        })
        return num
    }
}
class Place{
    constructor() {
        this.empty = true
    }
    in(){
        this.empty = false
    }
    out(){
        this.empty = true
    }
}
const floors = []
for (let i = 0; i < 3; i++){
    const places = []
    for (let j = 0; j < 100; j++){
        places[j] = new Place()
    }
    floors[i] = new Floor(i+1, places)
}
const park = new Park(floors)
const car1 = new Car(100)
const car2 = new Car(200)
const car3 = new Car(300)
console.log('第一辆车进入')
console.log(park.emptyNum())
park.in(car1)
console.log('第二辆车进入')
console.log(park.emptyNum())
park.in(car2)
console.log('第一辆车离开')
park.out(car1)
console.log('第二辆车离开')
park.out(car2) 
console.log('第三辆车进入')
console.log(park.emptyNum())
park.in(car3)
~~~

