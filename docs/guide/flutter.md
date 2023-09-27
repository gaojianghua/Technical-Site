<!--
 * @Author: 高江华 g598670138@163.com
 * @Date: 2023-04-11 16:57:52
 * @LastEditors: 高江华
 * @LastEditTime: 2023-09-27 15:25:52
 * @Description: file content
-->
# Flutter
[官方文档](https://flutter.cn/)
## 简介
Flutter 是 Google 开源的应用开发框架，仅通过一套代码库，就能构建精美的、原生平台编译的多平台应用。使用 [Dart](https://dart.cn/) 编程语言高效编码，Flutter 由 Dart 强力驱动。
- 优势
  - 最接近原生的开发框架
  - 性能强大，流畅
  - 跨平台，支持插件，可访问原生系统调用
  - 基于Dart语言，学习成本略高
- 缺陷
  - 无法脱离原生，需具备原生开发能力
  - 代码可读性较差
  - 兼容适配较差
  - Widget的类型难以选择，糟糕的UI控件API
  - 生态较差
  - 第三方SDK繁杂，适配性差

### Widget Tree、Element Tree 和 RenderObject Tree
`Flutter` 应用是由是 `Widget Tree`、`Element Tree` 和 `RenderObject Tree` 组成。

`Widget` 可以理解成一个类，`Element` 可以理解成 `Widget` 的实例，`Widget` 与 `Element` 的关系可以是一对
多，一份配置可以创造多个 `Element` 实例。

|属性 |描述|
|---|--|
|Widget| Widget 就是一个类， 是 Element 的配置信息。与 Element 的关系可以是一对多，一份配置可以创造多个 Element 实例|
|Element| Widget 的实例化，内部持有 Widget 和 RenderObject。|
|RenderObject| 负责渲染绘制|

默认情况下，当 `Flutter` 同一个 `Widget` 的大小，顺序变化的时候，`FLutter` 不会改变 `Widget` 的 `state`。

## Dart
Dart 是一种用于构建跨平台移动、Web和桌面应用程序的编程语言，由Google开发并开源。Dart 具有以下特点：
- 强类型语言：Dart 是一种静态类型语言，可以在编译时进行类型检查，提供更好的代码安全性和性能。
- 面向对象：Dart 是一种面向对象的语言，支持类、继承、接口等面向对象的概念和特性。
- 单线程和异步编程：Dart 默认是单线程执行的，但通过使用异步编程模型，可以轻松地处理并发和并行任务。
- 支持库丰富：Dart 提供了丰富的内置库和第三方库，用于处理网络请求、JSON解析、数据库访问、图形绘制等各种常见任务。
- 跨平台开发：Dart 可以用于开发移动应用、Web 应用和桌面应用，并且可以通过 Flutter 框架实现跨平台应用程序的开发。
- JIT 和 AOT 编译：Dart 提供了两种编译模式，即即时编译（JIT）和预先编译（AOT）。JIT 编译模式适用于开发阶段，可以实时地编译和运行代码
加快开发周期；AOT 编译模式适用于发布阶段，将 Dart 代码编译为本机机器码，提高运行性能。
  
通过使用 Dart，您可以构建高质量、高性能的应用程序，并且可以利用 Flutter 框架进行跨平台开发。如果您对 Dart 感兴趣，可以查阅 Dart 官方文档和相关资源，深入学习该语言的特性和用法。

### 变量
dart是一个强大的脚本类语言，可以不预先定义变量类型，自动会类型推倒。

dart中定义变量可以通过`var`关键字可以通过类型来申明变量
~~~dart
var str='this is var';

String str='this is var';

int str=123;
~~~
::: tip
注意： var 后面不要写类型，写了类型就不要var。
:::

### 常量
dart中使用`final` 和 `const`修饰符来定义常量：
- `const`值不变 一开始就得赋值
- `final` 可以开始不赋值 只能赋一次 ; 而`final`不仅有`const`的编译时常量的特性，最重要的它是运行时常量，并且final是惰性初始化，即在运行时第一次使用前才初始化。

::: tip
永远不改量的量，请使用`final`或`const`修饰它，而不是使用`var`或其他变量类型。
:::

常量是可以共享存储空间的
~~~dart
import "dart:core";

void main() {
  const a=[2];
  const b=[2];
  print(identical(a,b)); //true 共享存储空间

  const c=[2];
  const d=[3];
  print(identical(c,d)); //false  不共享存储空间
}
~~~
::: tip
共享存储空间条件：1、常量 2、值相等
:::

常量构造函数总结如下几点：
1. 常量构造函数需以`const`关键字修饰
2. `const`构造函数必须用于成员变量都是`final`的类
3. 如果实例化时不加`const`修饰符，即使调用的是常量构造函数，实例化的对象也不是常量实例
4. 实例化常量构造函数的时候，多个地方创建这个对象，如果传入的值相同，只会保留一个对象。
5. `Flutter`中 `const` 修饰不仅仅是节省组件构建时的内存开销，`Flutter` 在需要重新构建组件的时候，由于这个组件是不应该改变的，重新构建没有任何意义，因此 `Flutter` 不会重建构建 `const` 组件

~~~dart
//常量构造函数
class Container{
  final int width;
  final int height;
  const Container({required this.width,required this.height});
}

void main(){

  var c1=Container(width: 100,height: 100);
  var c2=Container(width: 100,height: 100);
  print(identical(c1, c2)); //false

  
  var c3=const Container(width: 100,height: 100);
  var c4=const Container(width: 100,height: 100);
  print(identical(c3, c4)); //true


  var c5=const Container(width: 100,height: 110);
  var c6=const Container(width: 120,height: 100);
  print(identical(c5, c6)); //false
  
}
// 实例化常量构造函数的时候，多个地方创建这个对象，如果传入的值相同，只会保留一个对象。
~~~

### Dart的命名规则：
1. 变量名称必须由数字、字母、下划线和美元符($)组成。
2. 注意：标识符开头不能是数字。
3. 标识符不能是保留字和关键字。   
4. 变量的名字是区分大小写的如: `age`和`Age`是不同的变量。在实际的运用中,也建议,不要用一个单词大小写区分两个变量。
5. 标识符(变量名称)一定要见名思意 ：变量名称建议用名词，方法名称建议用动词 

### Dart中支持以下数据类型：
- 常用数据类型：
  - Numbers（数值）:
    - int
    - double
  - Strings（字符串）
    - String
  - Booleans(布尔)
    - bool
  - List（数组）
    - 在Dart中，数组是列表对象，所以大多数人只是称它们为列表
  - Maps（字典）
    - 通常来说，Map 是一个键值对相关的对象。 键和值可以是任何类型的对象。每个 `键` 只出现一次， 而一个值则可以出现多次。
- 项目中用不到的数据类型 （用不到）：
  - Runes 
    - Rune是UTF-32编码的字符串。它可以通过文字转换成符号表情或者代表特定的文字。
      ~~~dart
      main() {
        var clapping = '\u{1f44f}';
        print(clapping);
        print(clapping.codeUnits);
        print(clapping.runes.toList());
      
        Runes input = new Runes(
            '\u2665  \u{1f605}  \u{1f60e}  \u{1f47b}  \u{1f596}  \u{1f44d}');
        print(new String.fromCharCodes(input));
      }
      ~~~
  - Symbols
    - Symbol对象表示在Dart程序中声明的运算符或标识符。您可能永远不需要使用符号，但它们对于按名称引用标识符的API非常有用，因为缩小会更改标识符名称而不会更改标识符符号。要获取标识符的符号，请使用符号文字，它只是＃后跟标识符。
::: tip
另外我们可以用 `is` 关键词来判断类型。
:::

### List里面常用的属性和方法：
- 常用属性：
  - length          长度
  - reversed        翻转
  - isEmpty         是否为空
  - isNotEmpty      是否不为空
- 常用方法：  
  - add         增加
  - addAll      拼接数组
  - indexOf     查找  传入具体值
  - remove      删除  传入具体值
  - removeAt    删除  传入索引值
  - fillRange   修改   
  - insert(index,value);            指定位置插入    
  - insertAll(index,list)           指定位置插入List
  - toList()    其他类型转换成List  
  - join()      List转换成字符串
  - split()     字符串转化成List
  - forEach     遍历
  - map         遍历并返回一个新数组
  - where       遍历并返回满足条件的新数组
  - any         只要集合里面有满足条件的就返回true
  - every       每一个都满足条件返回true  否则返回false
### 映射(Maps)是无序的键值对：
- 常用属性：
  - keys            获取所有的key值
  - values          获取所有的value值
  - isEmpty         是否为空
  - isNotEmpty      是否不为空
- 常用方法:
  - remove(key)     删除指定key的数据
  - addAll({...})   合并映射  给映射内增加属性
  - containsValue   查看映射内的值  返回true/false
  - forEach         遍历
  - map             遍历并返回一个新数组
  - where           遍历并返回满足条件的新数组
  - any             只要集合里面有满足条件的就返回true
  - every           每一个都满足条件返回true  否则返回false
### 方法/函数
自定义方法的基本格式：
~~~ts
返回类型  方法名称（参数1，参数2,...）{
  方法体
  return 返回值;
}
~~~
箭头函数内只能写一条语句，并且语句后面没有分号(;)：
~~~dart
list.forEach((value)=>{
  print(value)
});
// 简写
list.forEach((value)=>print(value));
~~~
### 面向对象
面向对象编程(OOP)的三个基本特征是：封装、继承、多态      
- 封装：封装是对象和类概念的主要特性。封装，把客观事物封装成抽象的类，并且把自己的部分属性和方法提供给其他对象调用, 而一部分属性和方法则隐藏。
- 继承：面向对象编程 (OOP) 语言的一个主要功能就是“继承”。继承是指这样一种能力：它可以使用现有类的功能，并在无需重新编写原来的类的情况下对这些功能进行扩展。
- 多态：允许将子类类型的指针赋值给父类类型的指针, 同一个函数调用会有不同的执行效果 。

::: tip
Dart所有的东西都是对象，所有的对象都继承自Object类。Dart是一门使用类和单继承的面向对象语言，所有的对象都是类的实例，并且所有的类都是Object的子类，一个类通常由属性和方法组成。
:::

~~~dart
//最新版本的dart中需要初始化不可为null的实例字段，如果不初始化的话需要在属性前面加上late
class Person{
  late String name;
  late int age; 
  //默认构造函数的简写
  Person(this.name,this.age);
  Person.now() {
    print('我是命名构造函数');
  }
  Person.setInfo(String name, int age) {
    this.name = name;
    this.age = age;
  }
  void printInfo(){   
    print("${this.name}----${this.age}");
  }
}

void main() {
  var d=new DateTime.now();   //实例化DateTime调用它的命名构造函数
  print(d);

  Person p1=new Person('张三', 20);   //默认实例化类的时候调用的是 默认构造函数

  Person p2=new Person.now();   //命名构造函数

  Person p3 = new Person.setInfo('李四', 30);   //指定参数信息实例化
  p3.printInfo();
}
~~~
#### 类的私有成员
Dart和其他面向对象语言不一样，Data中没有 `public` `private` `protected`这些访问修饰符。

但是我们可以使用`_`把一个属性或者方法定义成私有的。
~~~dart
class Animal{
  late String _name;   //私有属性
  late int age; 
  //默认构造函数的简写
  Animal(this._name,this.age);

  void printInfo(){   
    print("${this._name}----${this.age}");
  }

  String getName(){ 
    return this._name;
  } 
  void _run(){
    print('这是一个私有方法');
  }

  execRun(){
    this._run();  //类里面方法的相互调用
  }
}

void main(){
  Animal a=new Animal('小狗', 3);

  print(a.getName());

  a.execRun();   //间接的调用私有方法
}
~~~
#### 类的get和set的使用
~~~dart
class Rect{
  late num height;
  late num width;   
  Rect(this.height,this.width);
  get area{
    return this.height*this.width;
  }
  set areaHeight(value){
    this.height=value;
  }
}

void main(){
  Rect r = new Rect(10,4);
  print("面积:${r.area}");  // get调用直接通过访问属性的方式访问area

  r.areaHeight = 6;   // get调用直接通过访问属性的方式访问area, 6就是传递进去的value参数
  print(r.area);
}
~~~
Dart中我们也可以在构造函数体运行之前初始化实例变量：
~~~dart
class Rect{
  int height;
  int width;
  Rect():height=2,width=10{    
    print("${this.height}---${this.width}");
  }
  getArea(){
    return this.height*this.width;
  } 
}

void main(){
  Rect r=new Rect();
  print(r.getArea()); 
}
~~~
#### 类的静态成员
1. 使用 `static` 关键字来实现类级别的变量和函数
2. 静态方法不能访问非静态成员，非静态方法可以访问静态成员
~~~dart
class Person {
  static String name = '张三';
  int age=20;  
  static void show() {
    print(name);
  }
  void printInfo(){  /*非静态方法可以访问静态成员以及非静态成员*/
    print(name);  //访问静态属性
    print(this.age);  //访问非静态属性
    show();   //调用静态方法
  }
  static void printUserInfo(){//静态方法
    print(name);   //静态属性
    show();        //静态方法
    //print(this.age);     //静态方法没法访问非静态的属性
    // this.printInfo();   //静态方法没法访问非静态的方法
    // printInfo();
  }
}

main(){
  print(Person.name);
  Person.show(); 

  Person p=new Person();
  p.printInfo(); 

  Person.printUserInfo();
}
~~~
#### 对象操作符
- `?`     条件运算符 （了解）        
- `as`    类型转换
- `is`    类型判断
- `..`    级联操作 （连缀）  (记住)
~~~dart
class Person {
  String name;
  num age;
  Person(this.name, this.age);
  void printInfo() {
    print("${this.name}---${this.age}");
  }
}
main() {
  // 条件运算符
  Person pp;
  pp?.printInfo();   //已被最新的dart废弃 了解
  Person p0 = new Person('张三', 20);
  p0?.printInfo();   //已被最新的dart废弃 了解


  // 类型判断
  Person p=new Person('张三', 20);
  if(p is Person){
      p.name="李四";
  }
  p.printInfo();
  print(p is Object);


  // 类型转换
  var p2;
  p2='';
  p2=new Person('张三1', 20);
  p2.printInfo();
  (p2 as Person).printInfo();

  // 级联操作
  Person p1 = new Person('张三1', 20);
  p1.printInfo();
  p1
    ..name = "李四"
    ..age = 30
    ..printInfo();
}
~~~
#### 类的继承
- 子类使用`extends`关键词来继承父类
- 子类会继承父类里面可见的属性和方法 但是不会继承构造函数
- 子类能复写父类的方法 `getter` 和 `setter`
~~~dart
class Person {
  String name;
  num age;
  String sex;
  Person(this.name,this.age);
  void printInfo() {
    print("${this.name}---${this.age}");  
  }
  work(){
    print("${this.name}在工作...");
  }
}
class Web extends Person{
  Web(String name, num age, String sex) : super(name, age){    
  }
  void run() {
    print("${this.name}---${this.age}---${this.sex}");
    super.work(); // 调用父类中的方法
  }
  @override
  work(){ // 覆写父类方法
    print("${this.name}的工作是写代码");
  }
}

main(){
  Web w = new Web('张三', 12, '男');
  w.printInfo();
  w.run();
  w.work();
}
~~~
#### 抽象类
Dart抽象类主要用于定义标准，子类可以继承抽象类，也可以实现抽象类接口。
1. 抽象类通过 `abstract` 关键字来定义
2. Dart中的抽象方法不能用`abstract`声明，Dart中没有方法体的方法我们称为抽象方法。
3. 如果子类继承抽象类必须得实现里面的抽象方法
4. 如果把抽象类当做接口实现的话必须得实现抽象类里面定义的所有属性和方法。
5. 抽象类不能被实例化，只有继承它的子类可以

`extends`抽象类 和 `implements`的区别：
1. 如果要复用抽象类里面的方法，并且要用抽象方法约束自类的话我们就用`extends`继承抽象类
2. 如果只是把抽象类当做标准的话我们就用`implements`实现抽象类

~~~dart
abstract class Animal{
  eat();  //抽象方法，子类必须实现它
  run();  //抽象方法，子类必须实现它
  printInfo(){
    print('我是一个抽象类里面的普通方法');
  }
}

class Dog extends Animal{
  @override
  eat() {
     print('小狗在吃骨头');
  }

  @override
  run() {
    // TODO: implement run
    print('小狗在跑');
  }  
}

class Cat extends Animal{
  @override
  eat() {
    // TODO: implement eat
    print('小猫在吃老鼠');
  }

  @override
  run() {
    // TODO: implement run
    print('小猫在跑');
  }
}

main(){
  Dog d=new Dog();
  d.eat();
  d.printInfo();

  Cat c=new Cat();
  c.eat();
  c.printInfo();

  // Animal a=new Animal();   //抽象类没法直接被实例化，会报错。
}
~~~
#### 多态
- 允许将子类类型的指针赋值给父类类型的指针, 同一个函数调用会有不同的执行效果。
- 子类的实例赋值给父类的引用。
- 多态就是父类定义一个方法不去实现，让继承他的子类去实现，每个子类有不同的表现。

::: tip
抽象类的示例就是一个典型的多态。
:::

#### 接口
- dart的接口没有`interface`关键字定义接口，而是普通类或抽象类都可以作为接口被实现。
- 同样使用`implements`关键字进行实现。
- 但是dart的接口有点奇怪，如果实现的类是普通类，会将普通类和抽象中的属性的方法全部需要覆写一遍。
- 因为抽象类可以定义抽象方法，普通类不可以，所以一般如果要实现像Java接口那样的方式，一般会使用抽象类。
- 建议使用抽象类定义接口。
~~~dart
abstract class Db{   //当做接口   接口：就是约定 、规范
    late String uri;      //数据库的链接地址
    add(String data);
    save();
    delete();
}

class Mysql implements Db{
  @override
  String uri;

  Mysql(this.uri);

  @override
  add(data) {
    // TODO: implement add
    print('这是mysql的add方法'+data);
  }

  @override
  delete() {
    // TODO: implement delete
    return null;
  }

  @override
  save() {
    // TODO: implement save
    return null;
  }
  remove(){
      
  }
}

class MsSql implements Db{
  @override
  late String uri;
  @override
  add(String data) {
    print('这是mssql的add方法'+data);
  }

  @override
  delete() {
    // TODO: implement delete
    return null;
  }

  @override
  save() {
    // TODO: implement save
    return null;
  }
}

main() {
  Mysql mysql = new Mysql('xxxxxx');

  mysql.add('1243214');
}
~~~
一个类实现多个接口：必须实现多个接口中的所有属性和方法。
~~~dart
abstract class A{
  late String name;
  printA();
}

abstract class B{
  printB();
}

class C implements A,B{  
  @override
  late String name;

  @override
  printA() {
    print('printA');
  }
  @override
  printB() {
    print('printB');
  }
}

void main(){
  C c=new C();
  c.printA();
}
~~~
#### Mixins混入
在Dart中可以使用`mixins`实现类似多继承的功能

因为`mixins`使用的条件，随着Dart版本一直在变，这里讲的是Dart2.x中使用`mixins`的条件：
1. 作为`mixins`的类只能继承自`Object`，不能继承其他类
2. 作为`mixins`的类不能有构造函数
3. 一个类可以`mixins`多个`mixins`类
4. `mixins`绝不是继承，也不是接口，而是一种全新的特性
~~~ts
class Person{
  String name;
  num age;
  Person(this.name,this.age);
  printInfo(){
    print('${this.name}----${this.age}');
  }
  void run(){
    print("Person Run");
  }
}

mixin A {
  String info="this is A";
  void printA(){
    print("A");
  }
  void run(){
    print("A Run");
  }
}

mixin B {  
  void printB(){
    print("B");
  }
  void run(){
    print("B Run");
  }
}

class C extends Person with B,A{
  C(String name, num age) : super(name, age);
}

void main(){  
  var c=new C('张三',20);  
  c.printInfo();
  // c.printB();
  // print(c.info);
  c.run();
}
~~~
#### 泛型
泛型就是解决 类 接口 方法的复用性、以及对不特定数据类型的支持(类型校验)
~~~dart
// 传的是什么类型就返回什么类型
getData<T>(T value){
  return value;
}
~~~
集合 List 泛型类的用法
~~~dart
// 把下面类转换成泛型类，要求MyList里面可以增加int类型的数据，也可以增加String类型的数据。但是每次调用增加的类型要统一
class MyList<T> {
  List list = <T>[];
  void add(T value) {
    this.list.add(value);
  }

  List getList() {
    return list;
  }
}
main() {
  List list2 = new List<int>.filled(2, 0);
  list2[0] = 12;
  list2[1] = 13;
  print(list2);
}
~~~
泛型接口示例: 实现数据缓存的功能：有文件缓存、和内存缓存。内存缓存和文件缓存按照接口约束实现。
1. 定义一个泛型接口 约束实现它的子类必须有 `getByKey(key)` 和 `setByKey(key,value)`
2. 要求`setByKey`的时候的`value`的类型和实例化子类的时候指定的类型一致
~~~dart
abstract class Cache<T> {
  getByKey(String key);
  void setByKey(String key, T value);
}

class FileCache<T> implements Cache<T> {
  @override
  getByKey(String key) {
    return null;
  }
  @override
  void setByKey(String key, T value) {
    print("我是文件缓存 把key=${key}  value=${value}的数据写入到了文件中");
  }
}

class MemoryCache<T> implements Cache<T> {
  @override
  getByKey(String key) {
    return null;
  }
  @override
  void setByKey(String key, T value) {
    print("我是内存缓存 把key=${key}  value=${value} -写入到了内存中");
  }
}

void main() {
  MemoryCache m = new MemoryCache<Map>();
  m.setByKey('index', {"name": "张三", "age": 20});
}
~~~
### 库的导入
我们自定义的库
~~~dart
import 'lib/xxx.dart';
~~~
系统内置库       
~~~dart
import 'dart:math';    
import 'dart:io'; 
import 'dart:convert';
~~~
Pub包管理系统中的库
~~~dart
import 'package:http/http.dart' as http;
import 'package:date_format/date_format.dart';
~~~
pub.dev地址：
- https://pub.dev/packages
- https://pub.flutter-io.cn/packages
- https://pub.dartlang.org/flutter/
1. 需要在自己想项目根目录新建一个`pubspec.yaml`
2. 在`pubspec.yaml`文件 然后配置名称 、描述、依赖等信息
3. 然后运行 `pub get` 获取包下载到本地  
4. 项目中引入库 `import 'package:http/http.dart' as http;` 看文档使用

重命名
~~~dart
import 'lib/Person2.dart' as lib;
~~~
部分导入
- 模式一：只导入需要的部分，使用show关键字，如下例子所示：
  ~~~dart
  import 'package:lib1/lib1.dart' show foo;
  ~~~
- 模式二：隐藏不需要的部分，使用hide关键字，如下例子所示：
  ~~~dart
  import 'package:lib2/lib2.dart' hide foo; 
  ~~~

延迟加载也称为懒加载，可以在需要的时候再进行加载。懒加载的最大好处是可以减少APP的启动时间。
- 懒加载使用deferred as关键字来指定，如下例子所示：
  ~~~dart
  import 'package:deferred/hello.dart' deferred as hello;
  ~~~
- 当需要使用的时候，需要使用loadLibrary()方法来加载：
  ~~~dart
  greet() async {
    await hello.loadLibrary();
    hello.printGreeting();
  }
  ~~~

### Null safety 空安全
`null safety` 可以帮助开发者避免一些日常开发中很难被发现的错误，并且额外的好处是可以改善性能。
- `?` 可空类型：被 `?` 修饰的类型可赋值为空。
- `!` 非空断言：被 `!` 修饰的变量表示告诉编译器它不为空，如果编译器发现你使用了一个可能为空的变量，而你却把它当成了非空变量，那么编译器会报错。
~~~dart
String? getData(apiUrl){  // String? 表示字符串返回值可以为空
  if(apiUrl!=null){
    return "this is server data";
  }
  return null;
}

void printLength(String? str){  // String？ 表示字符串参数可为空
  try {
    print(str!.length); // str! 告诉编译器str不为空，若传入参数为空会抛出异常执行catch里面的代码
  } catch (e) {
    print("str is null"); 
  }
}
~~~

### late 关键词
`late` 关键字用于标记一个延迟初始化的非空变量。使用 `late` 关键字，您可以在声明变量时将其初始化推迟到稍后的时间点，而不需要立即赋初始值。
~~~dart
late String name;

void main() {
  name = 'John'; // 在使用之前进行延迟初始化

  print(name); // 输出: John
}
~~~

### required 关键词
`required` 关键字用于标记命名参数或命名参数的字段，表示该参数是调用函数或构造函数时必需提供的。

使用 `required` 关键字可以强制调用方在调用函数或构造函数时提供所需的参数，以确保完整的参数传递。如果未提供必需的参数，则编译器会发出错误。
~~~dart
class Person {
  final String name;
  final int age;

  Person({required this.name, required this.age});
}

void main() {
  var person = Person(name: 'John', age: 25); // 必须提供两个参数
  print(person.name); // 输出: John
  print(person.age); // 输出: 25

  // 错误示例：未提供必需的参数
  var invalidPerson = Person(); // 编译错误！必须提供 name 和 age 参数
}
~~~

## 入口
每一个`flutter`项目的`lib`目录里面都有一个`main.dart`，这个文件就是`flutter`的入口文件。
~~~dart
void main(){
runApp(MyApp());
}
//也可以简写
void main()=>runApp(MyApp());
~~~
其中的`main`方法是`dart`的入口方法。`runApp`方法是`flutter`的入口方法。`MyApp`是自定义的一个组件。

## 自定义组件
在`Flutter`中自定义组件其实就是一个类，这个类需要继承`StatelessWidget` 或 `StatefulWidget`。
- **StatelessWidget** 是无状态组件，状态不可变的`widget`。
  ~~~dart
  import 'package:flutter/material.dart';

  class MyApp extends StatelessWidget{
    const MyApp({Key? key}) : super(key: key);
    @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return const Center(
      child: Text(
          "我是一个文本内容",
          textDirection: TextDirection.ltr,
        ),
      );
    } 
  }
  ~~~
- **StatefulWidget** 是有状态组件，持有的状态可能在`widget`生命周期改变。
  ~~~dart
  import 'package:flutter/material.dart';

  class CounterWidget extends StatefulWidget {
    @override
    _CounterWidgetState createState() => _CounterWidgetState();
  }

  class _CounterWidgetState extends State<CounterWidget> {
    int _counter = 0;

    void _incrementCounter() {
      setState(() {
        _counter++;
      });
    }

    @override
    Widget build(BuildContext context) {
      return Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: <Widget>[
          Text('You have pushed the button this many times:'),
          Text(
            '$_counter',
            style: Theme.of(context).textTheme.headline4,
          ),
          SizedBox(height: 16),
          ElevatedButton(
            onPressed: _incrementCounter,
            child: Text('Increment'),
          ),
        ],
      );
    }
  }
  ~~~
## 组件
### MaterialApp
`MaterialApp`是一个方便的`Widget`，它封装了应用程序实现`Material Design`所需要的一些`Widget`。一
般作为顶层`widget`使用。

常用的属性：
|属性名| 说明|
|---|---|
|home |指定应用程序的首页，通常是一个 Scaffold 小部件，其中包含应用程序的主要内容。|
|routes |定义应用程序的路由表，可以使用命名路由来导航到不同的页面。|
|initialRoute |指定应用程序的初始路由。|
|theme |定义应用程序的主题样式，包括颜色、字体等。|
|title |指定应用程序的标题，通常显示在任务管理器或设备窗口中。|
|onGenerateRoute |在路由被请求时生成路由的回调函数，可以用来动态生成路由并进行更高级的导航控制。|
|navigatorKey |提供应用程序的全局导航键，用于在应用程序中进行导航操作。|

~~~dart
void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        appBarTheme: const AppBarTheme(
          centerTitle: true,
        )
      ),
      initialRoute: "/",
      onGenerateRoute: onGenerateRoute,
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
      ),
      body: Center(
        child: Text('Welcome to my app!'),
      ),
    );
  }
}
~~~
### Scaffold
`Scaffold`是`Material Design`布局结构的基本实现。此类提供了用于显示`drawer`、`snackbar`和底部`sheet`
的`API`。

**主要的属性：**
- appBar：显示在界面顶部的一个 AppBar。
- body：当前界面所显示的主要内容 Widget。
- drawer：抽屉菜单控件。
- BottomNavigationBar：底部导航栏控件。
- floatingActionButton：悬浮按钮控件。
- floatingActionButtonLocation：悬浮按钮位置。

#### BottomNavigationBar 自定义底部导航
`BottomNavigationBar` 是底部导航条，可以让我们定义底部`Tab`切换。

BottomNavigationBar 常见的属性
|属性名| 说明|
|---|---|
|items |List 底部导航条按钮集合|
|iconSize |icon|
|currentIndex |默认选中第几个|
|onTap |选中变化回调函数|
|fixedColor |选中的颜色|
|type |BottomNavigationBarType.fixed BottomNavigationBarType.shifting|

~~~dart
// main.dart
import 'package:flutter/material.dart';
import 'pages/index_page.dart';

void main(){
  WidgetsFlutterBinding.ensureInitialized();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: '百姓生活',
      theme: ThemeData(
        primarySwatch: Colors.pink,
      ),
      home: const IndexPage()
    );
  }
}
~~~
~~~dart
// index.dart
import 'package:flutter/material.dart';
import 'home_page.dart';
import 'category_page.dart';
import 'my_page.dart';
import 'cart_page.dart';
import 'message_page.dart';

class IndexPage extends StatefulWidget {
  const IndexPage({super.key});

  @override
  State<IndexPage> createState() => _IndexPageState();
}

class _IndexPageState extends State<IndexPage> {
  final List<BottomNavigationBarItem> bottomTabs = [
    const BottomNavigationBarItem(
      icon: Icon(Icons.home),
      label: '首页',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.search),
      label: '分类',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.message),
      label: '消息',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.shopping_cart),
      label: '购物车',
    ),
    const BottomNavigationBarItem(
      icon: Icon(Icons.account_circle),
      label: '我的',
    ),
  ];

  int currentIndex = 0;
  // ignore: prefer_typing_uninitialized_variables
  var currentPage;

  @override
  void initState() {
    currentPage = pages[currentIndex];
    super.initState();
    
  }

  final List<Widget> pages = [
    const HomePage(),
    const CategoryPage(),
    const MessagePage(),
    const CartPage(),
    const MyPage(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromRGBO(240, 240, 240, 1),
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        currentIndex: currentIndex,
        items: bottomTabs,
        onTap: (index){
          setState(() {
            currentIndex = index;
            currentPage = pages[currentIndex];
          });
        },
      ),
      body: currentPage,
    );
  }
}
~~~
~~~dart
// home_page.dart
import 'package:flutter/material.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Home'),
      ),
      body: Container(),
    );
  }
}
~~~
~~~dart
// category_page.dart
import 'package:flutter/material.dart';

class CategoryPage extends StatefulWidget {
  const CategoryPage({super.key});

  @override
  State<CategoryPage> createState() => _CategoryPageState();
}

class _CategoryPageState extends State<CategoryPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Category'),
      ),
      body: Container(),
    );
  }
}
~~~
~~~dart
// message_page.dart
import 'package:flutter/material.dart';

class MessagePage extends StatelessWidget {
  const MessagePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Message'),
      ),
      body: Container(),
    );
  }
}
~~~
~~~dart
// cart_page.dart
import 'package:flutter/material.dart';

class CartPage extends StatefulWidget {
  const CartPage({super.key});

  @override
  State<CartPage> createState() => _CartPageState();
}

class _CartPageState extends State<CartPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Cart'),
      ),
      body: Container(),
    );
  }
}
~~~
~~~dart
// my_page.dart
import 'package:flutter/material.dart';

class MyPage extends StatefulWidget {
  const MyPage({super.key});

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My'),
      ),
      body: Container(),
    );
  }
}
~~~

#### FloatingActionButton 实现类似闲鱼App底部导航凸起按钮
`FloatingActionButton` 简称`FAB`，可以实现浮动按钮，也可以实现类似闲鱼`app`的底部凸起导航。
|属性名称 |属性值|
|-----|---|
|child |子视图，一般为Icon，不推荐使用文字|
|tooltip |FAB被长按时显示，也是无障碍功能|
|backgroundColor |背景颜色|
|elevation |未点击的时候的阴影|
|hignlightElevation| 点击时阴影值，默认12.0|
|onPressed |点击事件回调|
|shape |可以定义FAB的形状等|
|mini| 是否是mini类型默认false|

~~~dart
// 修改index_page.dart中的Scaffold
Scaffold(
  backgroundColor: const Color.fromRGBO(240, 240, 240, 1),
  bottomNavigationBar: BottomNavigationBar(
    backgroundColor: Color(0xffeeeeee),
    type: BottomNavigationBarType.fixed,  //如果底部有4个或者4个以上的菜单的时候就需要配置这个参数
    currentIndex: currentIndex,
    items: bottomTabs,
    onTap: (index) {
      setState(() {
        currentIndex = index;
        currentPage = pages[currentIndex];
      });
    },
  ),
  body: currentPage,
  floatingActionButton: Container(
    height: 60,
    width: 60,
    padding: const EdgeInsets.all(5),
    margin: const EdgeInsets.only(top: 0),
    decoration: BoxDecoration(
        color: Colors.white, borderRadius: BorderRadius.circular(30)),
    child: FloatingActionButton(
      // backgroundColor: currentPage == 2 ? Colors.red : Colors.blue,
      onPressed: () {
        setState(() {
          currentIndex = 2;
          currentPage = pages[currentIndex];
        });
      },
      child: const Icon(Icons.add),
    ),
  ),
  floatingActionButtonLocation: FloatingActionButtonLocation.centerDocked,
);
~~~
#### 抽屉菜单 Drawer
在 `Scaffold` 组件里面传入 `drawer` 参数可以定义左侧边栏，传入 `endDrawer` 可以定义右侧边栏。侧边栏默
认是隐藏的，我们可以通过手指滑动显示侧边栏，也可以通过点击按钮显示侧边栏。
~~~dart
Scaffold(
  appBar: AppBar(
    title: Text("Flutter App"),
  ),
  drawer: Drawer(
    child: Text('左侧边栏'),
  ),
  endDrawer: Drawer(
    child: Text('右侧侧边栏'),
  ),
);
~~~

#### DrawerHeader
`DrawerHeader` 组件用于定义侧边栏顶部区域，通常用来显示用户头像或者名称。
|属性 |描述|
|---|--|
|decoration |设置顶部背景颜色|
|child| 配置子元素|
|padding| 内边距|
|margin| 外边距|

~~~dart
drawer: Drawer(
  child: Column(
    children: [
      Row(
        children: [
          Expanded(
              flex: 1,
              child: DrawerHeader(
                decoration: const BoxDecoration(
                    // color: Colors.yellow,
                    image: DecorationImage(
                        image: NetworkImage(
                            "https://www.itying.com/images/flutter/2.png"),
                        fit: BoxFit.cover)),
                child: Column(
                  children: const [
                    ListTile(
                      leading: CircleAvatar(
                        backgroundImage:NetworkImage("https://www.itying.com/images/flutter/3.png")                             
                      ),
                      title: Text("张三",style: TextStyle(
                        color: Colors.red
                      )),
                    ),
                    ListTile(
                      title: Text("邮箱：xxxx@qq.com"),
                    )
                  ],
                ),
              ))
        ],
      ),
      const ListTile(
        leading: CircleAvatar(
          child: Icon(Icons.people),
        ),
        title: Text("个人中心"),
      ),
      const Divider(),
      const ListTile(
        leading: CircleAvatar(
          child: Icon(Icons.settings),
        ),
        title: Text("系统设置"),
      ),
      Divider(),
    ],
  ),
),
~~~

#### UserAccountsDrawerHeader
`userAccountsDrawerHeader`: 用户头像和用户名。
|属性 |描述|
|---|--|
|decoration| 设置顶部背景颜色|
|accountName| 账户名称|
|accountEmail| 账户邮箱|
|currentAccountPicture |用户头像|
|otherAccountsPictures |用来设置当前账户其他账户头像|
|margin|外边距|

~~~dart
drawer: Drawer(
  child: Column(
    children: [
      Row(
        children: [
          Expanded(
              flex: 1,
              child: UserAccountsDrawerHeader(
                accountName: const Text("Oh Shit"),
                accountEmail: const Text("shit@qq.com"),
                otherAccountsPictures: [
                  Image.network(
                      "https://www.itying.com/images/flutter/1.png"),
                  Image.network(
                      "https://www.itying.com/images/flutter/2.png"),
                  Image.network(
                      "https://www.itying.com/images/flutter/3.png"),
                ],
                currentAccountPicture: const CircleAvatar(
                    backgroundImage: NetworkImage(
                        "https://www.itying.com/images/flutter/3.png")),
                decoration: const BoxDecoration(
                    image: DecorationImage(
                        fit: BoxFit.cover,
                        image: NetworkImage(
                            "https://www.itying.com/images/flutter/2.png"))),
              ))
        ],
      ),
      const ListTile(
        leading: CircleAvatar(
          child: Icon(Icons.people),
        ),
        title: Text("个人中心"),
      ),
      const Divider(),
      const ListTile(
        leading: CircleAvatar(
          child: Icon(Icons.settings),
        ),
        title: Text("系统设置"),
      ),
      const Divider(),
    ],
  ),
),
~~~
#### AppBar、TabBar、TabBarView
`AppBar` 自定义顶部按钮图标、颜色
|属性 |描述|
|---|--|
|leading |在标题前面显示的一个控件，在首页通常显示应用的 logo；在其他界面通常显示为返回按钮|
|title |标题，通常显示为当前界面的标题文字，可以放组件|
|actions| 通常使用 IconButton 来表示，可以放按钮组|
|bottom| 通常放tabBar，标题下面显示一个 Tab 导航栏|
|backgroundColor| 导航背景颜色|
|iconTheme| 图标样式|
|centerTitle |标题是否居中显示|

`TabBar` 自定义选项卡栏
|属性 |描述|
|---|--|
|tabs |显示的标签内容，一般使用Tab对象,也可以是其他的Widget。|
|controller |TabController对象|
|isScrollable |是否可滚动|
|indicatorColor |指示器颜色|
|indicatorWeight |指示器高度|
|indicatorPadding| 底部指示器的Padding|
|indicator| 指示器decoration，例如边框等|
|indicatorSize |指示器大小计算方式，TabBarIndicatorSize.label跟文字等宽,TabBarIndicatorSize.tab跟每个tab等宽|
|labelColor |选中label颜色|
|labelStyle |选中label的Style|
|labelPadding| 每个label的padding值|
|unselectedLabelColor| 未选中label颜色|
|unselectedLabelStyle| 未选中label的Style|

~~~dart
import 'package:flutter/material.dart';

class MyPage extends StatefulWidget {
  const MyPage({Key? key}) : super(key: key);

  @override
  State<MyPage> createState() => _MyPageState();
}

class _MyPageState extends State<MyPage> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  //生命周期函数:当组件初始化的时候就会触发
  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 9, vsync: this);
  }

  List<String> list = [];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
            leading: IconButton(
              //左侧的按钮图标
              icon: const Icon(Icons.menu),
              onPressed: () {
                print("左侧的按钮图标");
              },
            ),
            backgroundColor: Colors.red, //导航背景颜色
            title: const Text("Flutter App"),
            actions: [
              //右侧的按钮图标
              IconButton(
                icon: const Icon(Icons.search),
                onPressed: () {
                  print("搜索图标");
                },
              ),
              IconButton(
                icon: const Icon(Icons.more_horiz),
                onPressed: () {
                  print("更多");
                },
              )
            ],
            bottom: TabBar(
                isScrollable: true,
                indicatorColor: Colors.white,
                indicatorWeight: 2,
                indicatorPadding: const EdgeInsets.all(5),
                // indicatorSize:TabBarIndicatorSize.label,
                labelColor: Colors.yellow,
                unselectedLabelColor: Colors.white,
                labelStyle: const TextStyle(fontSize: 14),
                unselectedLabelStyle: const TextStyle(fontSize: 12),
                indicator: BoxDecoration(
                    color: Colors.blue,
                    borderRadius: BorderRadius.circular(10)),
                controller: _tabController, //注意：配置controller需要去掉TabBar上面的const
                tabs: const [
                  Tab(
                    child: Text("关注"),
                  ),
                  Tab(
                    child: Text("热门"),
                  ),
                  Tab(
                    child: Text("视频"),
                  ),
                  Tab(
                    child: Text("关注"),
                  ),
                  Tab(
                    child: Text("热门"),
                  ),
                  Tab(
                    child: Text("视频"),
                  ),
                  Tab(
                    child: Text("关注"),
                  ),
                  Tab(
                    child: Text("热门"),
                  ),
                  Tab(
                    child: Text("视频"),
                  ),
                ])),
        body: TabBarView(controller: _tabController, children: [
          const Text("我是关注"),
          const Text("我是关注"),
          const Text("我是关注"),
          const Text("我是关注"),
          const Text("我是关注"),
          const Text("我是关注"),
          const Text("我是关注"),
          ListView(
            children: const [
              ListTile(
                title: Text("我是热门列表"),
              ),
              ListTile(
                title: Text("我是热门列表"),
              ),
              ListTile(
                title: Text("我是热门列表"),
              ),
              ListTile(
                title: Text("我是热门列表"),
              ),
              ListTile(
                title: Text("我是热门列表"),
              ),
              ListTile(
                title: Text("我是热门列表"),
              ),
              ListTile(
                title: Text("我是热门列表"),
              ),
            ],
          ),
          ListView(
            children: const [
              ListTile(
                title: Text("我是视频列表"),
              )
            ],
          )
        ]));
  }
}
~~~
#### PreferredSize
`PreferredSize` 可以改变 `appBar` 的高度。
~~~dart
Scaffold(
  appBar: PreferredSize(
    preferredSize: Size.fromHeight(50),
    child: AppBar(
      ....
    )
  ),
  body: Test(),
)
~~~
#### AutomaticKeepAliveClientMixin
`AutomaticKeepAliveClientMixin` 可以快速的实现页面缓存功能，但是通过混入的方式实现不是很优
雅，所以我们有必要对 `AutomaticKeepAliveClientMixin` 混入进行封装。
~~~dart
import 'package:flutter/material.dart';

class KeepAliveWrapper extends StatefulWidget {
  const KeepAliveWrapper(
      {Key? key, @required this.child, this.keepAlive = true})
      : super(key: key);

  final Widget? child;
  final bool keepAlive;

  @override
  State<KeepAliveWrapper> createState() => _KeepAliveWrapperState();
}

class _KeepAliveWrapperState extends State<KeepAliveWrapper>
    with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    return widget.child!;
  }

  @override
  bool get wantKeepAlive => widget.keepAlive;

  @override
  void didUpdateWidget(covariant KeepAliveWrapper oldWidget) {
    if (oldWidget.keepAlive != widget.keepAlive) {
      // keepAlive 状态需要更新，实现在 AutomaticKeepAliveClientMixin 中
      updateKeepAlive();
    }
    super.didUpdateWidget(oldWidget);
  }
}
~~~
#### 监听 TabController 改变事件
~~~dart
void initState() {
  super.initState();
  _tabController = TabController(length: 8, vsync: this);
  //监听_tabController的改变事件
  _tabController.addListener(() {
    if (_tabController.animation!.value==_tabController.index){
      print(_tabController.index); //获取点击或滑动页面的索引值
    }
  });
}
~~~
### Container
| 名称 | 功能 |
|----|----|
| alignment | topCenter：顶部居中对齐topLeft：顶部左对齐topRight：顶部右对齐center：水平垂直居中对齐centerLeft：垂直居中水平居左对齐centerRight：垂直居中水平居右对齐bottomCenter底部居中对齐bottomLeft：底部居左对齐 bottomRight：底部居右对齐 |
| decoration | decoration: BoxDecoration( color: Colors.blue, border: Border.all( color: Colors.red, width: 2.0),borderRadius:BorderRadius.circular((8)),// 圆角 ，boxShadow: [ BoxShadow( color: Colors.blue, offset: Offset(2.0, 2.0), blurRadius: 10.0, ) ], ) //LinearGradient 背景线性渐变 RadialGradient径向渐变 gradient: LinearGradient( colors: [Colors.red, Colors.orange], ), |
| margin | margin属性是表示Container与外部其他组件的距离。 EdgeInsets.all(20.0), |
| padding | padding就是Container的内边距，指Container边缘与Child之间的距离 padding:EdgeInsets.all(10.0) |
| transform | 让Container容易进行一些旋转之类的transform: Matrix4.rotationZ(0.2) |
| height | 容器高度 |
| width | 容器宽度 |
| child | 容器子元素 |

~~~dart
import 'package:flutter/material.dart';
void main() {
  runApp(MaterialApp(
    home: Scaffold(
      appBar: AppBar(title: const Text("你好Flutter")),
      body: const MyApp(),
    ),
  ));
}
// 代码块 statelessW
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        alignment: Alignment.center,
        height: 200,
        width: 200,
        decoration: BoxDecoration(
          color: Colors.yellow,
          gradient: const LinearGradient(
            //LinearGradient 背景线性渐变 RadialGradient径向渐变
            colors: [Colors.red, Colors.orange],
          ),
          boxShadow:const [
            //卡片阴影
            BoxShadow(
              color: Colors.blue,
              offset: Offset(2.0, 2.0),
              blurRadius: 10.0,
            )
          ],
          border: Border.all(
            color: Colors.black,
            width: 1
          )
        ),
        transform:Matrix4.rotationZ(.2),
        child: const Text(
          "你好Flutter",
          style: TextStyle(fontSize: 20),
        ),
      ),
    );
  }
}
~~~
### Text
|名称 | 功能|
|----|----|
|textAlign | 文本对齐方式（center居中，left左对齐，right右对齐，justfy两端对齐）|
|textDirection |文本方向（ltr从左至右，rtl从右至左）|
|overflow |文字超出屏幕之后的处理方式（clip裁剪，fade渐隐，ellipsis省略号）|
|textScaleFactor| 字体显示倍率|
|maxLines| 文字显示最大行数|
|style |字体的样式设置|

`TextStyle` 的参数 ：
|名称 | 功能|
|----|----|
|decoration |文字装饰线（none没有线，lineThrough删除线，overline上划线，underline下划线）|
|decorationColor| 文字装饰线颜色|
|decorationStyle| 文字装饰线风格（[dashed,dotted]虚线，double两根线，solid一根实线，wavy波浪线）|
|wordSpacing| 单词间隙（如果是负值，会让单词变得更紧凑）|
|letterSpacing| 字母间隙（如果是负值，会让字母变得更紧凑）|
|fontStyle| 文字样式（italic斜体，normal正常体）|
|fontSize| 文字大小|
|color| 文字颜色|
|fontWeight| 字体粗细（bold粗体，normal正常体）|

~~~dart
import 'package:flutter/material.dart';
void main() {
  runApp(MaterialApp(
    home: Scaffold(
      appBar: AppBar(title: const Text("你好Flutter")),
      body: const MyApp(),
    ),
  ));
}
// 代码块 statelessW
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
  return Center(
    child: Container(
      alignment: Alignment.center,
      height: 200,
      width: 200,
      decoration: BoxDecoration(
        color: Colors.yellow,
        gradient: const LinearGradient(
          //LinearGradient 背景线性渐变 RadialGradient径向渐变
          colors: [Colors.red, Colors.orange],
        ),
        boxShadow: const [
          //卡片阴影
          BoxShadow(
            color: Colors.blue,
            offset: Offset(2.0, 2.0),
            blurRadius: 10.0,
          )
        ],
        border: Border.all(color: Colors.black, width: 1)),
        transform: Matrix4.rotationZ(.2),
        child: const Text(
          '我是傻批',
          textAlign: TextAlign.left,
          overflow: TextOverflow.ellipsis,
          // overflow:TextOverflow.fade ,
          maxLines: 2,
          textScaleFactor: 1.8,
          style: TextStyle(
            fontSize: 16.0,
            color: Colors.black,
            // color:Color.fromARGB(a, r, g, b)
            fontWeight: FontWeight.w800,
            fontStyle: FontStyle.italic,
            decoration: TextDecoration.lineThrough,
            decorationColor: Colors.white,
            decorationStyle: TextDecorationStyle.dashed,
            letterSpacing: 5.0
          )
        ),
      ),
    );
  }
}
~~~

### Image
`Flutter` 中，我们可以通过 `Image` 组件来加载并显示图片 `Image` 的数据源可以是`asset`、文件、内存以
及网络 。
- `Image.asset`: 本地图片
- `Image.network`: 远程图片

~~~dart
// 加载远程图片
Image.network(
  "https://www.itying.com/themes/itying/images/ionic4.png",
  fit: BoxFit.cover,
)
~~~
~~~dart
// 实现圆形图片
Container(
  width: 150,
  height: 150,
  decoration: BoxDecoration(
  color: Colors.yellow,
  borderRadius: BorderRadius.circular(75),
  image: const DecorationImage(
    image: NetworkImage(
      "https://www.itying.com/themes/itying/images/ionic4.png",
    ),
    fit: BoxFit.cover)
  ),
)
~~~
~~~dart
// 实现圆形图片
ClipOval(
  child: Image.network(
    "https://www.itying.com/themes/itying/images/ionic4.png",
    width: 150.0,
    height: 150.0,
    fit: BoxFit.cover,
  ),
),
~~~
~~~dart
// 基本上，CircleAvatar 不提供设置边框的属性。但是，可以将其包裹在具有更大半径和不同背景颜色的不同 CircleAvatar 中，以创建类似于边框的内容。
const CircleAvatar(
  radius: 110,
  backgroundColor: Color(0xffFDCF09),
  child: CircleAvatar(
    radius: 100,
    backgroundImage:
      NetworkImage("https://www.itying.com/images/flutter/3.png"
    ),
  )
)
~~~
使用本地图片：
- 项目根目录新建`images`文件夹，`images`中新建2.x 3.x对应的文件
- 然后，打开 `pubspec.yaml` 声明一下添加的图片文件， 注意: 空格
  ~~~yaml
  assets:
    - images/a.png
    - images/2.x/a.png
    - images/3.x/a.png
  ~~~
- 使用
  ~~~dart
  class MyApp extends StatelessWidget {
    const MyApp({Key? key}) : super(key: key);
    @override
    Widget build(BuildContext context) {
      return Center(
        child: ClipOval(
          child: Image.asset(
            "images/a.jpeg",
            width: 150.0,
            height: 150.0,
            fit: BoxFit.cover
          ),
        ),
      );
    }
  }
  ~~~

### Icons
`Material Design`所有图标可以在其官网查看：https://material.io/tools/icons/
~~~dart
class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        children: const [
          Icon(Icons.search,color: Colors.red,size: 40),
          SizedBox(height: 10),
          Icon(Icons.home),
          SizedBox(height: 10),
          Icon(Icons.category),
          SizedBox(height: 10),
          Icon(Icons.shop),
          SizedBox(height: 10),
        ],
      )
    );
  }
}
~~~
使用字体图标库，在`Flutter`中，我们使用`ttf`格式即可。
- 假设我们的字体图标文件保存在项目根目录下，路径为`fonts/iconfont.ttf`。
- 然后在 `pubspec.yaml` 中添加配置：
  ~~~yaml
  fonts:
    - family: myIcon #指定一个字体名
      fonts:
      - asset: fonts/iconfont.ttf
  # 或者配置多个字体文件
  fonts:
    - family: myIcon #指定一个字体名
      fonts:
      - asset: fonts/iconfont.ttf
    - family: alipayIcon #指定一个字体名
      fonts:
      - asset: fonts/iconfont2.ttf
  ~~~
- 定义一个 `MyIcons` 类，功能和 `Icons` 类一样：将字体文件中的所有图标都定义
成静态变量：
  ~~~dart
  class MyIcons{
    // book 图标
    static const IconData book = IconData(
      0xe614,
      fontFamily: 'myIcon',
      matchTextDirection: true
    );
    // 微信图标
    static const IconData wechat = IconData(
      0xec7d,
      fontFamily: 'myIcon',
      matchTextDirection: true
    );
  }
  ~~~
- 使用
  ~~~dart
  Row(
    mainAxisAlignment: MainAxisAlignment.center,
    children: <Widget>[
      Icon(MyIcons.book,color: Colors.purple),
      Icon(MyIcons.wechat,color: Colors.green),
    ],
  )
  ~~~

### ListView
列表布局是我们项目开发中最常用的一种布局方式。`Flutter`中我们可以通过`ListView`来定义列表项，支
持垂直和水平方向展示。通过一个属性就可以控制列表的显示方向。列表有以下分类：
- 垂直列表
- 垂直图文列表
- 水平列表
- 动态列表

**列表组件常用参数：**

| 名称 | 类型 | 说明 |
|----|----|----|
|scrollDirection| Axis| Axis.horizontal水平列表Axis.vertical垂直列表 |
|padding| EdgeInsetsGeometry| 内边距 |
|resolve| bool| 组件反向排序 |
|children| List| 列表元素 |

~~~dart
SizedBox(
  height: 180,  
  // ListView垂直模式下宽度自适应，水平模式下高度自适应，需要在ListView外层套个盒子才能设置对应模式的宽高。内部子元素设置垂直模式(宽)、水平模式(高)是无效的。
  child: ListView(
    scrollDirection: Axis.horizontal, // 水平列表
    children: <Widget>[
      Container(
        width: 180.0,
        color: Colors.red,
      ),
      Container(
        width: 180.0,
        color: Colors.orange,
        child: Column(
          children: <Widget>[
            Image.network("https://www.itying.com/images/flutter/1.png"),
            const Text('我是一个文本')
          ],
        ),
      ),
      Container(
        width: 180.0,
        color: Colors.blue,
      ),
      Container(
        width: 180.0,
        color: Colors.deepOrange,
      ),
      Container(
        width: 180.0,
        color: Colors.deepPurpleAccent,
      ),
    ],
  ),
);
~~~
使用循环渲染列表：
~~~dart
class MyHomePage extends StatelessWidget {
  const MyHomePage({Key? key}) : super(key: key);
  List<Widget> _initListView(){
    List<Widget> list=[];
    for (var i = 0; i < 10; i++) {
      list.add(
        const ListTile(
          title: Text("我是一个列表"),
        )
      );
    }
    return list;
  }
  
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: _initListView(),
    );
  }
}
~~~
实现动态列表：
~~~dart
class MyHomePage extends StatelessWidget {
  MyHomePage({Key? key}) : super(key: key) {
    print(listData);
  }
  //第一种方法
  // List<Widget> _initListData(){
  //   List<Widget> tempList=[];
  //   for (var i = 0; i < listData.length; i++) {
  //       tempList.add(
  //         ListTile(
  //           leading: Image.network("${listData[i]["imageUrl"]}"),
  //           title: Text("${listData[i]["title"]}"),
  //           subtitle: Text("${listData[i]["author"]}"),
  //         )
  //       );
  //   }
  //   return tempList;
  // }

  //第二种方法
  List<Widget> _initListData() {
    var tempList = listData.map((value) {
      return ListTile(
        leading: Image.network("${value["imageUrl"]}"),
        title: Text("${value["title"]}"),
        subtitle: Text("${value["author"]}"),
      );
    });  
    return tempList.toList();
  }

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: _initListData(),
    );
  }
}
~~~
`ListView.builder`实现动态列表：
~~~dart
class MyHomePage extends StatelessWidget {
  List<String> list=[];
  MyHomePage({Key? key}) : super(key: key){
    for (var i = 0; i < 20; i++) {
      list.add("我是第${i}条数据");
    }
  } 

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount:list.length ,
      itemBuilder: (context,index){
        return ListTile(
          title: Text(list[index]),
        );
      }
    );
  }
}
~~~
### GridView
`GridView`网格布局在实际项目中用的也是非常多的，当我们想让可以滚动的元素使用矩阵方式排列的时候。此时我们可以用网格列表组件`GridView`实现布局。

`GridView`创建网格列表主要有下面三种方式
1. 可以通过 `GridView.count` 实现网格布局
2. 可以通过 `GridView.extent` 实现网格布局
3. 通过 `GridView.builder` 实现动态网格布局

**常用属性：**
|名称 | 类型 | 说明|
|---|----|---|
|scrollDirection| Axis |滚动方法|
|padding| EdgeInsetsGeometry |内边距|
|resolve| bool| 组件反向排序|
|crossAxisSpacing| double| 水平子Widget之间间距|
|mainAxisSpacing| double| 垂直子Widget之间间距|
|crossAxisCount| int 用在GridView.count| 一行的Widget数量|
|maxCrossAxisExtent| double 用在GridView.extent| 横轴子元素的最大长度|
|childAspectRatio | double | 子Widget宽高比例 |
|children | `List<Weiget>` | [] |
|gridDelegate | SliverGridDelegateWithFixedCrossAxisCount SliverGridDelegateWithMaxCrossAxisExtent | 控制布局主要用在GridView.builder里面 |

`GridView.count`构造函数内部使用了`SliverGridDelegateWithFixedCrossAxisCount`，我们通过它可以
快速的创建横轴固定数量子元素的`GridView`。
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GridView.count(  
      crossAxisCount: 5,  //一行的Widget数量
      children: const[
        Icon(Icons.pedal_bike),
        Icon(Icons.home),
        Icon(Icons.ac_unit),
        Icon(Icons.search),
        Icon(Icons.settings),
        Icon(Icons.airport_shuttle),
        Icon(Icons.all_inclusive),
        Icon(Icons.beach_access),
        Icon(Icons.cake),
        Icon(Icons.circle),  
      ],
    );
  }
}
~~~
`GridView.extent`构造函数内部使用了`SliverGridDelegateWithMaxCrossAxisExtent`，我们通过它可以
快速的创建横轴子元素为固定最大长度的的`GridView`。
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return GridView.extent(  
      //通过它可以快速的创建横轴子元素为固定最大长度的的GridView。
      maxCrossAxisExtent:180,  //横轴子元素的最大长 度
      children: const [
        Icon(Icons.pedal_bike),
        Icon(Icons.home),
        Icon(Icons.ac_unit),
        Icon(Icons.search),
        Icon(Icons.settings),
        Icon(Icons.airport_shuttle),
        Icon(Icons.all_inclusive),
        Icon(Icons.beach_access),
        Icon(Icons.cake),
        Icon(Icons.circle),  
      ],
    );
  }
}
~~~
`GridView.count` 和 `GridView.extent` 属性详解：
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  List<Widget> _initGridViewData(){
    List<Widget> tempList=[];
    for (var i = 0; i < 12; i++) {
      tempList.add(
          Container(
            alignment: Alignment.center,
            decoration:const BoxDecoration(
              color: Colors.blue
            ),
            child: Text("第${i}个元素",style:const TextStyle(
              fontSize: 20
            ))
          )
      );
    }
    return tempList;
  }

  @override
  Widget build(BuildContext context) {
    return GridView.count(  
      padding:const EdgeInsets.all(10),
      crossAxisSpacing:10,      //水平子Widget之间间 距
      mainAxisSpacing: 10,     //垂直子Widget之间间 距
      crossAxisCount:3,  //一行的Widget数量
      childAspectRatio:1.2,  //宽高比
      children: _initGridViewData(),
    );
  }
}
~~~
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  List<Widget> _initGridViewData(){
    List<Widget> tempList=[];
    for (var i = 0; i < 12; i++) {
      tempList.add(
          Container(
            alignment: Alignment.center,
            decoration:const BoxDecoration(
              color: Colors.blue
            ),
            child: Text("第${i}个元素",style:const TextStyle(
              fontSize: 20
            ))
          )
      );
    }
    return tempList;
  }

  @override
  Widget build(BuildContext context) {
    return GridView.extent(  
      padding:const EdgeInsets.all(10),
      crossAxisSpacing:10,//水平子Widget之间间 距
      mainAxisSpacing: 10,//垂直子Widget之间间 距
      maxCrossAxisExtent:250,//我们通过它可以快速的创建横轴子元素为固定最大长度的的GridView
      childAspectRatio:0.7,//宽高比
      children: _initGridViewData(),
    );
  }
}
~~~
`GridView.count`实现动态列表：
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  List<Widget> _initGridViewData(){
    var tempList=listData.map((value){
        return Container(
            decoration: BoxDecoration(
              border: Border.all(
                color: Colors.black26
              )
            ),
            child: Column(
              children: [
                Image.network(value["imageUrl"]),
                const SizedBox(height: 10),
                Text(value["title"],style: const TextStyle(
                  fontSize: 18
                ))
              ],
            ),
        );
    }); 
    return tempList.toList();
  }

  @override
  Widget build(BuildContext context) {
    return GridView.count(  
      padding:const EdgeInsets.all(10),
      crossAxisSpacing:10,      //水平子Widget之间间距
      mainAxisSpacing: 10,     //垂直子Widget之间间距
      crossAxisCount:2,   //一行显示多少个元素
      childAspectRatio:1,  //宽高比
      children: _initGridViewData(),
    );
  }
}
~~~
`GridView.builder`实现动态列表：
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  Widget _initGridViewData(context, index) {
    return Container(
      decoration: BoxDecoration(border: Border.all(color: Colors.black26)),
      child: Column(
        children: [
          Image.network(listData[index]["imageUrl"]),
          const SizedBox(height: 10),
          Text(listData[index]["title"], style: const TextStyle(fontSize: 18))
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
        padding: const EdgeInsets.all(10),
        itemCount:listData.length,
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisSpacing: 10, //水平子Widget之间间 距
          mainAxisSpacing: 10, //垂直子Widget之间间 距
          crossAxisCount: 2, //一行显示多少个元素
          childAspectRatio: 1, //宽高比
        ),
        itemBuilder: _initGridViewData);
  }
} 
~~~
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);

  Widget _initGridViewData(context, index) {
    return Container(
      decoration: BoxDecoration(border: Border.all(color: Colors.black26)),
      child: Column(
        children: [
          Image.network(listData[index]["imageUrl"]),
          const SizedBox(height: 10),
          Text(listData[index]["title"], style: const TextStyle(fontSize: 18))
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
        padding: const EdgeInsets.all(10),
        itemCount:listData.length,
        gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
          crossAxisSpacing: 10, //水平子Widget之间间 距
          mainAxisSpacing: 10, //垂直子Widget之间间 距          
          childAspectRatio: 0.9,  // 宽高比
          maxCrossAxisExtent: 120, // 最大交叉轴尺寸
        ),
        itemBuilder: _initGridViewData);
  }
}
~~~
### Paddiing
在`html`中常见的布局标签都有`padding`属性，但是`Flutter`中很多`Widget`是没有`padding`属性。这个时候
我们可以用`Padding`组件处理容器与子元素之间的间距。

|属性 |说明|
|---|--|
|padding| padding值, EdgeInsetss设置填充的值|
|child |子组件|

~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return const Padding(
      padding: EdgeInsets.all(20),
      child: Text("你好flutter"),
    );
  }
}
~~~
### Row
`Row` 是一个水平布局组件，其子组件会按照左到右的顺序依次排列。

|属性 |说明|
|---|--|
|mainAxisAlignment |主轴的排序方式|
|crossAxisAlignment |次轴的排序方式|
|children |组件子元素|

~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.black12,
      child: Row(  //外部没有Container 行是自适应的
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          IconContainer(Icons.home),
          IconContainer(Icons.search,color: Colors.yellow,),
          IconContainer(
            Icons.ac_unit_sharp,
            color: Colors.orange,
          ),
        ],
      ),
    );
  }
}

//自定义IconContainer
class IconContainer extends StatelessWidget {
  Color color;
  IconData icon;
  IconContainer(this.icon, {Key? key, this.color = Colors.red})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      height: 100,
      width: 100,
      color: color,
      child: Icon(icon, color: Colors.white, size: 28),
    );
  }
}
~~~
### Column
`Column` 是一个垂直布局组件，其子组件会按照上到下的顺序依次排列。

|属性 |说明|
|---|--|
|mainAxisAlignment| 主轴的排序方式|
|crossAxisAlignment |次轴的排序方式|
|children| 组件子元素|

`double.infinity` 和 `double.maxFinite` 可以让当前元素的`width`或者`height`达到父元素的尺寸。

**底层代码：**
~~~dart
static const double nan = 0.0 / 0.0;
static const double infinity = 1.0 / 0.0;
static const double negativeInfinity = -infinity;
static const double minPositive = 5e-324;
static const double maxFinite = 1.7976931348623157e+308;
~~~
如下可以让Container铺满整个屏幕：
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: Colors.black12,
      child: Column(  
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,   
        crossAxisAlignment: CrossAxisAlignment.end,     
        children: [
          IconContainer(Icons.home),
          IconContainer(Icons.search,color: Colors.yellow,),
          IconContainer(
            Icons.ac_unit_sharp,
            color: Colors.orange,
          ),
        ],
      ),
    );
  }
}

//自定义IconContainer
class IconContainer extends StatelessWidget {
  Color color;
  IconData icon;
  IconContainer(this.icon, {Key? key, this.color = Colors.red})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      height: 100,
      width: 100,
      color: color,
      child: Icon(icon, color: Colors.white, size: 28),
    );
  }
}
~~~
### 弹性布局 Flex 与 Expanded
`Flex` 组件可以沿着水平或垂直方向排列子组件，如果你知道主轴方向，使用 `Row` 或 `Column` 会方便一
些，**因为 Row 和 Column 都继承自 Flex**，参数基本相同，所以能使用Flex的地方基本上都可以使用
`Row` 或 `Column`。`Flex` 本身功能是很强大的，它也可以和 `Expanded` 组件配合实现弹性布局。`Expanded`组件必须放在
`Flex` 或 `Row`、`Column` 组件中，且 `Expanded` 组件的子组件必须是 `Flex` 组件，否则会报错。
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Flex(
      direction:Axis.horizontal,
      children: [
        Expanded(
          flex: 1,
          child: IconContainer(Icons.home),  //这个元素设置宽度是没有效果的
        ),
        Expanded(
          flex: 2,
          child: IconContainer(
            Icons.ac_unit_sharp,
            color: Colors.orange,
          ),         
        ),
      ],
    );
  }
}

//自定义IconContainer
class IconContainer extends StatelessWidget {
  Color color;
  IconData icon;
  IconContainer(this.icon, {Key? key, this.color = Colors.red})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      alignment: Alignment.center,
      height: 100,
      width: 100,
      color: color,
      child: Icon(icon, color: Colors.white, size: 28),
    );
  }
}
~~~
使用 `Row` 或 `Column` 结合 `Expanded` 实现一个 `Demo` 示例：
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Container(
          width: double.infinity,
          height: 200,
          color: Colors.black,
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Expanded(
              flex: 2,
              child: SizedBox(
                height: 180,
                child: Image.network(
                    "https://www.itying.com/images/flutter/2.png",
                    fit: BoxFit.cover),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
                flex: 1,
                child: SizedBox(
                  height: 180,
                  child: Column(
                    children: [
                      Expanded(
                        flex: 1,
                        child: SizedBox(
                          width:double.infinity ,
                          child: Image.network(
                            "https://www.itying.com/images/flutter/3.png",
                            fit: BoxFit.cover),
                        ),
                      ),
                      const SizedBox(height: 10),
                      Expanded(
                        flex: 2,
                        child: SizedBox(
                          width:double.infinity ,
                          child: Image.network(
                            "https://www.itying.com/images/flutter/4.png",
                            fit: BoxFit.cover),
                        ),
                      )
                    ],
                  ),
                ))
          ],
        )
      ],
    );
  }
}
~~~
### 层叠布局 Stack、Align、Positioned
`Stack` 表示堆的意思，我们可以用 `Stack` 或者 `Stack` 结合 `Align` 或者 `Stack` 结合 `Positiond` 来实现页面的定位
布局。

|属性| 说明|
|--|---|
|alignment |配置所有子元素的显示位置|
|children |子组件|

~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {  
    return Stack(
      alignment: Alignment.center,
      children: [
        Container(
          height: 400,
          width: 300,
          color: Colors.red,
        ),
        Container(
          height: 200,
          width: 200,
          color: Colors.yellow,
        ),
        const Text("你好Flutter"),
      ],
    );
  }
}
~~~
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        height: 400,
        width: 300,
        color: Colors.red,
        child: Stack(
          //注意：相对于外部容器进行定位，如果没有外部容器就相对于整个屏幕进行定位
          children: [
            Positioned(
              left: 0,
              bottom: 0,
              child: Container(
              height: 100,
              width: 100,
              color: Colors.yellow,
            )),
            const Positioned(
              top: 190,
              right: 0,
              child: Text("你好Flutter")
            )
          ],
        ),
      ),
    );
  }
}
~~~
`Align` 组件可以调整子组件的位置 , `Stack` 组件中结合 `Align` 组件也可以控制每个子元素的显示位置。

|属性 |说明|
|---|--|
|alignment |配置所有子元素的显示位置|
|child |子组件|

~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    //获取设备的宽度和高度
    // final size = MediaQuery.of(context).size;

    return Container(
      width: 300,
      height: 300,
      color: Colors.red,
      child: const Align(
        alignment: Alignment.center,
        child: Text("你好Flutter"),
      ),
    );
  }
}
~~~
`Align` 结合 `Alignment` 参数，Alignment Widget会以**矩形的中心点作为坐标原点**，即 `Alignment(0.0, 0.0)`。`x、y`的值从 `-1` 到 `1` 分别代表矩形左边到右边的距离和顶部到底边的距离，因此 `2` 个水平（或垂直）单位则等于矩形的宽
（或高），如 `Alignment(-1.0, -1.0)` 代表矩形的左侧顶点，而 `Alignment(1.0, 1.0)` 代表右侧底
部终点，而 `Alignment(1.0, -1.0)` 则正是右侧顶点，即 `Alignment.topRight`。为了使用方便，矩
形的原点、四个顶点，以及四条边的终点在 `Alignment` 类中都已经定义为了**静态常量**。

`Alignment` 可以通过其**坐标转换公式**将其坐标转为子元素的具体偏移坐标：
~~~dart
(Alignment.x*childWidth/2+childWidth/2, Alignment.y*childHeight/2+childHeight/2)
~~~
其中 `childWidth` 为子元素的宽度，`childHeight` 为子元素高度。
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
  return Container(
    height: 120.0,
    width: 120.0,
    color: Colors.blue.shade50,
    child: const Align(
      alignment: Alignment(2, 0.0),
      child: FlutterLogo(
        size: 60,
      ),
    ));
  }
}
~~~
现在我们再看看上面的示例，我们将 `Alignment(2, 0.0)` 带入上面公式，`(2*120/2+120/2, 0*120/2+120/2)`，可得 `FlutterLogo` 的实际偏移坐标正是`(180,60)`。

`Center` 继承自 `Align`，它比 `Align` 只少了一个 `alignment` 参数；由于 `Align` 的构造函数中
`alignment` 值为 `Alignment.center`，所以，我们可以认为 `Center` 组件其实是对齐方式确定。
~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        height: 400,
        width: 300,
        color: Colors.red,
        child: Stack(
          // alignment: Alignment.center,
          children: const <Widget>[
            Align(
              alignment: Alignment(1,-0.2),
              child: Icon(Icons.home,size: 40,color: Colors.white),
            ),
            Align(
              alignment: Alignment.center,
              child: Icon(Icons.search,size: 30,color: Colors.white),
            ),
            Align(
              alignment: Alignment.bottomRight,
              child: Icon(Icons.settings_applications,size: 30,color: Colors.white),
            )
          ],
        ),
      ),
    );
  }
}
~~~
`Stack` 组件中结合 `Positioned` 组件也可以控制每个子元素的显示位置。

|属性 |说明|
|---|--|
|top |子元素距离顶部的距离|
|bottom |子元素距离底部的距离|
|left |子元素距离左侧距离|
|right |子元素距离右侧距离|
|child |子组件|
|width| 组件的高度(注意：宽度和高度必须是固定值，没法使用double.infinity)|
|height |子组件的高度|

~~~dart
class HomePage extends StatelessWidget {
  const HomePage({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    //获取设备的宽度和高度
    // final size = MediaQuery.of(context).size;

    return Column(
      children: [
        SizedBox(
          width: double.infinity,
          height: 40,
          child: Stack(
            children: const [
              Align(
                alignment: Alignment.topLeft,
                child: Text("收藏"),
              ),
              Align(alignment: Alignment.topRight, child: Text("购买")),
            ],
          ),
        ),
        SizedBox(
          width: double.infinity,
          height: 40,
          child: Stack( 
            children: const [
              Positioned(
                left: 10,
                child: Text("收藏"),
              ),
              Positioned(right: 10, child: Text("购买")),
            ],
          ),
        )
      ],
    );
  }
}
~~~
### AspectRatio
`AspectRatio` 的作用是根据设置调整子元素child的宽高比。

`AspectRatio` 首先会在布局限制条件允许的范围内尽可能的扩展，`widget` 的高度是由宽度和比率决定
的，类似于 `BoxFit` 中的 `contain`，按照固定比率去尽量占满区域。

如果在满足所有限制条件过后无法找到一个可行的尺寸，`AspectRatio` 最终将会去优先适应布局限制条
件，而忽略所设置的比率。

|属性 |说明|
|---|--|
|aspectRatio|宽高比，最终可能不会根据这个值去布局，具体则要看综合因素，外层是否允许按照这种比率进行布局，这只是一个参考值|
|child| 子组件|

~~~dart
List listData=[
  {
    "title": 'Candy Shop',
    "author": 'Mohamed Chahin',
    "imageUrl": 'https://www.itying.com/images/flutter/1.png',
  },
  {
    "title": 'Childhood in a picture',
    "author": 'Google',
    "imageUrl": 'https://www.itying.com/images/flutter/2.png',
  },
]

class LayoutDemo extends StatelessWidget {
  const LayoutDemo({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView(
      children: listData.map((value) {
        return Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          elevation: 20,
          margin: const EdgeInsets.all(10),
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(value["imageUrl"], fit: BoxFit.cover),
              ),
              ListTile(
                leading: ClipOval(
                  child: Image.network(
                    value["imageUrl"],
                    fit: BoxFit.cover,
                    height: 40,
                    width: 40,
                  ),
                ),
                title: Text(value["title"]),
                subtitle: Text(value["author"]),
              )
            ],
          ),
        );
      }).toList(),
    );
  }
}
~~~
### Card
`Card` 是卡片组件块，内容可以由大多数类型的 `Widget` 构成，`Card` 具有圆角和阴影，这让它看起来有立
体感。

|属性 |说明|
|---|--|
|margin |外边距|
|child |子组件|
|elevation| 阴影值的深度|
|color |背景颜色|
|shadowColor| 阴影颜色|
|margin |外边距|
|clipBehavior |clipBehavior 内容溢出的剪切方式 Clip.none不剪切 Clip.hardEdge裁剪但不应用抗锯齿 Clip.antiAlias裁剪而且抗锯齿 Clip.antiAliasWithSaveLayer带有抗锯齿的剪辑，并在剪辑之后立即保存saveLayer|
|Shape | Card的阴影效果，默认的阴影效果为圆角的长方形边。shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.circular(10)))|

通讯录卡片：
~~~dart
class LayoutDemo extends StatelessWidget {
  const LayoutDemo({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Card(
          shape: RoundedRectangleBorder(
              //Card的阴影效果
              borderRadius: BorderRadius.circular(10)),
          elevation: 20, //阴影值的深度
          margin: const EdgeInsets.all(10),
          child: Column(
            children: const [
              ListTile(
                title: Text("张三", style: TextStyle(fontSize: 28)),
                subtitle: Text("高级软件工程师"),
              ),
              Divider(),
              ListTile(
                title: Text("电话：152222222"),
              ),
              ListTile(
                title: Text("地址：北京市海淀区 xxx"),
              ),
            ],
          ),
        ),
        Card(
          shape: RoundedRectangleBorder(
              //Card的阴影效果
              borderRadius: BorderRadius.circular(10)),
          elevation: 20,
          margin: const EdgeInsets.all(10),
          // color:Colors.black12,  //背景颜色
          child: Column(
            children: const [
              ListTile(
                title: Text("李四", style: TextStyle(fontSize: 28)),
                subtitle: Text("Flutter高级软件工程师"),
              ),
              Divider(),
              ListTile(
                title: Text("电话：152222222"),
              ),
              ListTile(
                title: Text("地址：北京市海淀区 xxx"),
              ),
            ],
          ),
        ),
        Card(
          shape: RoundedRectangleBorder(
              //Card的阴影效果
              borderRadius: BorderRadius.circular(10)),
          elevation: 20, //阴影值的深度
          margin: const EdgeInsets.all(10),
          child: Column(
            children: const [
              ListTile(
                title: Text("张三", style: TextStyle(fontSize: 28)),
                subtitle: Text("高级软件工程师"),
              ),
              Divider(),
              ListTile(
                title: Text("电话：152222222"),
              ),
              ListTile(
                title: Text("地址：北京市海淀区 xxx"),
              ),
            ],
          ),
        ),
      ],
    );
  }
}
~~~
图文列表卡片：
~~~dart
class LayoutDemo extends StatelessWidget {
  const LayoutDemo({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ListView(
      children: [
        Card(
          shape: RoundedRectangleBorder(
            borderRadius:BorderRadius.circular(10)
          ),
          elevation: 20,
          margin: const EdgeInsets.all(10),
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                    "https://www.itying.com/images/flutter/3.png",
                    fit: BoxFit.cover),
              ),
              ListTile(
                leading: ClipOval(
                  child:Image.network(
                    "https://www.itying.com/images/flutter/3.png",
                    fit: BoxFit.cover,
                    height: 40,
                    width: 40,
                ),
                ),
                title: const Text("xxxxxxxxx"),
                subtitle: const Text("xxxxxxxxx"),
              )
            ],
          ),
        ),
        Card(
          shape: RoundedRectangleBorder(
            borderRadius:BorderRadius.circular(10)
          ),
          elevation: 20,
          margin: const EdgeInsets.all(10),
          child: Column(
            children: [
              AspectRatio(
                aspectRatio: 16 / 9,
                child: Image.network(
                    "https://www.itying.com/images/flutter/3.png",
                    fit: BoxFit.cover),
              ),
              const ListTile(
                leading: CircleAvatar(
                  backgroundImage: NetworkImage("https://www.itying.com/images/flutter/4.png"),
                ),
                title: Text("xxxxxxxxx"),
                subtitle: Text("xxxxxxxxx"),
              )
            ],
          ),
        )
      ],
    );
  }
}
~~~
### CircleAvatar
`CircleAvatar` 是一个圆形头像组件，默认头像为圆形，如果需要自定义头像，可以设置 `backgroundImage` 属性。
~~~dart
const CircleAvatar(
  radius: 200,
  backgroundImage:
    NetworkImage("https://www.itying.com/images/flutter/3.png"),
)
~~~
基本上，`CircleAvatar` 不提供设置边框的属性。但是，可以将其包裹在具有更大半径和不同背景颜色的
不同 `CircleAvatar` 中，以创建类似于边框的内容。
~~~dart
const CircleAvatar(
  radius: 110,
  backgroundColor: Color(0xffFDCF09),
  child: CircleAvatar(
    radius: 100,
    backgroundImage:
      NetworkImage("https://www.itying.com/images/flutter/3.png"),
  )
)
~~~
### 按钮组件 ElevatedButton、TextButton、OutlinedButton、IconButton
按钮组件的属性：
|属性| 说明|
|--|---|
|onPressed| 必填参数，按下按钮时触发的回调，接收一个方法，传null表示按钮禁用，会显示禁用相关样式|
|child| 子组件|
|style| 通过ButtonStyle装饰|

`ButtonStyle`里面的常用的参数：
|属性名称 |值类型 |属性值|
|-----|----|---|
|foregroundColor |Color |文本颜色|
|backgroundColor |Color |按钮的颜色|
|shadowColor |Color| 阴影颜色|
|elevation |double| 阴影的范围，值越大阴影范围越大|
|padding| |内边距|
|shape| |设置按钮的形状 shape: MaterialStateProperty.all(RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)))|
|side |设置边框|MaterialStateProperty.all(BorderSide(width:1,color: Colors.red))|

`ElevatedButton` 即"凸起"按钮，它默认带有阴影和灰色背景。按下后，阴影会变大。
~~~dart
ElevatedButton(
  onPressed: () {},
  child: const Text("普通按钮")
)
~~~
`TextButton` 即文本按钮，默认背景透明并不带阴影。按下后会有背景色。
~~~dart
TextButton(
  onPressed: () {},
  child: const Text("文本按钮"),
)
~~~
`OutlineButton` 默认有一个边框，不带阴影且背景透明。按下后边框颜色会变亮、同时出现背景和
阴影。
~~~dart
OutlinedButton(
  onPressed: () {},
  child: const Text("边框按钮"),
)
~~~
`IconButton` 是一个可点击的`Icon`，不包括文字，默认没有背景，点击后会出现背景。
~~~dart
IconButton(
  icon: Icon(Icons.thumb_up),
  onPressed: () {},
)
~~~
`ElevatedButton`、`TextButton`、`OutlineButton`都有一个 `icon` 构造函数，通过它可以轻松创建带图标的按钮。
~~~dart
ElevatedButton.icon(
  icon: Icon(Icons.send),
  label: Text("发送"),
  onPressed: _onPressed,
),
OutlineButton.icon(
  icon: Icon(Icons.add),
  label: Text("添加"),
  onPressed: _onPressed,
),
TextButton.icon(
  icon: Icon(Icons.info),
  label: Text("详情"),
  onPressed: _onPressed,
),
~~~
修改按钮的宽度高度：
~~~dart
SizedBox(
  height: 80,
  width: 200,
  child: ElevatedButton(
    style:ButtonStyle(
      backgroundColor:MaterialStateProperty.all(Colors.red),
      foregroundColor: MaterialStateProperty.all(Colors.black)
    ),
    onPressed: () {},
    child: const Text('宽度高度'),
  ),
)
~~~
自适应按钮：
~~~dart
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: <Widget>[
    Expanded(
      child: Container(
        height: 60,
        margin: const EdgeInsets.all(10),
        child: ElevatedButton(
          child: const Text('自适应按钮'),
          onPressed: () {
            print("自适应按钮");
          },
        ),
      ),
    )
  ],
)
~~~
配置圆形圆角按钮：
~~~dart
// 圆角按钮
ElevatedButton(
  style: ButtonStyle(
    backgroundColor:MaterialStateProperty.all(Colors.blue),
    foregroundColor: MaterialStateProperty.all(Colors.white),
    elevation: MaterialStateProperty.all(20),
    shape: MaterialStateProperty.all(
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(10)
      )
    ),
  ),
  onPressed: () {
    print("圆角按钮");
  },
  child: const Text('圆角')
)
~~~
~~~dart
// 圆形按钮
Container(
  height: 80,
  child: ElevatedButton(
    style: ButtonStyle(
      backgroundColor: MaterialStateProperty.all(Colors.blue),
      foregroundColor: MaterialStateProperty.all(Colors.white),
      elevation: MaterialStateProperty.all(20),
      shape: MaterialStateProperty.all(
        CircleBorder(
            side: BorderSide(color: Colors.white)
        ),
      )
    ),
    onPressed: () {
      print("圆形按钮");
    },
    child: const Text('圆形按钮')
  ),
)
~~~
修改 `OutlinedButton` 边框：
~~~dart
Row(
  mainAxisAlignment: MainAxisAlignment.center,
  children: <Widget>[
    Expanded(
      child: Container(
        margin: EdgeInsets.all(20),
        height: 50,
        child: OutlinedButton(
          style: ButtonStyle(
            foregroundColor: MaterialStateProperty.all(Colors.black),
            side: MaterialStateProperty.all(
              const BorderSide(width: 1, color: Colors.red)
            )
          ),
          onPressed: () {},
          child: const Text("注册 配置边框")
        ),
      ),
    )
  ],
)
~~~
### Wrap
`Wrap` 可以实现流布局，单行的 `Wrap` 跟 `Row` 表现几乎一致，单列的 `Wrap` 则跟 `Column` 表现几乎一致。但 `Row` 与 `Column` 都是单行单列的，`Wrap` 则突破了这个限制，`mainAxis` 上空间不足时，则向 `crossAxis` 上去扩展显示。

|属性 |说明|
|---|--|
|direction |主轴的方向，默认水平|
|alignment |主轴的对其方式|
|spacing |主轴方向上的间距|
|textDirection |文本方向|
|verticalDirection| 定义了children摆放顺序，默认是down，见Flex相关属性介绍。|
|runAlignment| run的对齐方式。run可以理解为新的行或者列，如果是水平方向布局的话，run可以理解为新的一行|
|runSpacing| run的间距|

~~~dart
class LayoutDemo extends StatelessWidget {
  const LayoutDemo({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(10),
      child: Wrap(
        alignment:WrapAlignment.spaceAround,
        spacing: 10, //水平间距   *
        runSpacing: 10, //垂直间距 *
        // direction:Axis.vertical,  *  
        children: [
          Button("第1集", onPressed: () {}),
          Button("第2集", onPressed: () {}),
          Button("第3集", onPressed: () {}),
          Button("第4集", onPressed: () {}),
          Button("第5集", onPressed: () {}),
          Button("第6集 (完结)", onPressed: () {}),
          Button("第7集", onPressed: () {}),
          Button("第8集", onPressed: () {}),
          Button("第9集", onPressed: () {}),
          Button("第10集", onPressed: () {}),
          Button("第11集", onPressed: () {}),
          Button("第12集", onPressed: () {}),
          Button("第13集", onPressed: () {}),
          Button("第14集", onPressed: () {}),
          Button("第15集", onPressed: () {}),
          Button("第16集", onPressed: () {}),
          Button("第17集", onPressed: () {}),
          Button("第18集", onPressed: () {}),
        ],
      ),
    );
  }
}

//自定义按钮组件
class Button extends StatelessWidget {
  String text; //按钮的文字
  void Function()? onPressed; //方法
  Button(this.text, {Key? key, required this.onPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ButtonStyle(
        backgroundColor: MaterialStateProperty.all(
          const Color.fromARGB(241, 223, 219, 219)
        ),
        foregroundColor: MaterialStateProperty.all(Colors.black45)
      ),
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
~~~
搜索页面布局：
~~~dart
class LayoutDemo extends StatelessWidget {
  const LayoutDemo({Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(10),
      children: [
        Row(
          children: [Text("热搜", style: Theme.of(context).textTheme.titleLarge)],
        ),
        const Divider(),
        Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            Button("女装", onPressed: () {}),
            Button("笔记本", onPressed: () {}),
            Button("玩具", onPressed: () {}),
            Button("文学", onPressed: () {}),
            Button("女装", onPressed: () {}),
            Button("时尚", onPressed: () {}),
            Button("男装", onPressed: () {}),
            Button("xxxx", onPressed: () {}),
            Button("手机", onPressed: () {})
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: [
            Text("历史记录", style: Theme.of(context).textTheme.titleLarge)
          ],
        ),
        const Divider(),
        Column(
          children: const [
            ListTile(title: Text("女装")),
            Divider(),
            ListTile(title: Text("手机")),
            Divider(),
            ListTile(title: Text("电脑")),
            Divider(),
          ],
        ),
        const SizedBox(height: 40),
        Padding(
          padding:const EdgeInsets.all(40),
          child: OutlinedButton.icon(
            //自适应
            style: ButtonStyle(
              foregroundColor: MaterialStateProperty.all(Colors.black45)
            ),
            onPressed: () {},
            icon: const Icon(Icons.delete),
            label: const Text("清空历史记录")
          ),
        )
      ],
    );
  }
}

//自定义按钮组件
class Button extends StatelessWidget {
  String text; //按钮的文字
  void Function()? onPressed; //方法
  Button(this.text, {Key? key, required this.onPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      style: ButtonStyle(
        backgroundColor: MaterialStateProperty.all(
          const Color.fromARGB(241, 223, 219, 219)
        ),
        foregroundColor: MaterialStateProperty.all(Colors.black45)
      ),
      onPressed: onPressed,
      child: Text(text),
    );
  }
}
~~~
### Dialog
[fluttertoast](https://pub.dev/packages/fluttertoast)的使用

`pubspec.yaml` 的 `dependencies` 中添加
~~~yaml
# add this line to your dependencies
fluttertoast: ^8.0.9
~~~
使用示例
~~~dart
import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

class DialogPage extends StatefulWidget {
  const DialogPage({super.key});

  @override
  State<DialogPage> createState() => _DialogPageState();
}

class _DialogPageState extends State<DialogPage> {
  // 警告对话框
  void _alertDialog() async {
    var result = await showDialog(
        barrierDismissible: false, //表示点击灰色背景的时候是否消失弹出框
        context: context,
        builder: (context) {
          return AlertDialog(
            title: const Text("提示信息!"),
            content: const Text("您确定要删除吗"),
            actions: [
              TextButton(
                  onPressed: () {
                    print("ok");
                    Navigator.of(context).pop("ok"); //点击按钮让AlertDialog消失
                  },
                  child: const Text("确定")),
              TextButton(
                  onPressed: () {
                    print("cancel");
                    Navigator.of(context).pop("取消");
                  },
                  child: const Text("取消"))
            ],
          );
        });

    print("-----------");
    print(result);
  }
  // 简单对话框
  void _simpleDialog() async {
    var result = await showDialog(
        barrierDismissible: false, //表示点击灰色背景的时候是否消失弹出框
        context: context,
        builder: (context) {
          return SimpleDialog(
            title: const Text("请选择语言"),
            children: [
              SimpleDialogOption(
                onPressed: () {
                  print("汉语");
                  Navigator.pop(context, "汉语");
                },
                child: const Text("汉语"),
              ),
              const Divider(),
              SimpleDialogOption(
                onPressed: () {
                  print("英语");
                  Navigator.pop(context, "英语");
                },
                child: const Text("英语"),
              ),
              const Divider(),
              SimpleDialogOption(
                onPressed: () {
                  print("日语");
                  Navigator.pop(context, "日语");
                },
                child: const Text("日语"),
              ),
              const Divider(),
            ],
          );
        });

    print("-----------");
    print(result);
  }
  // 底部弹出层
  void _modelBottomSheet() async {
    var result = await showModalBottomSheet(
        context: context,
        builder: (context) {
          return SizedBox(
            height: 240,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                ListTile(
                  title: const Text("分享"),
                  onTap: () {
                    print("分享");
                    Navigator.of(context).pop("分享");
                  },
                ),
                const Divider(),
                ListTile(
                  title: const Text("收藏"),
                  onTap: () {
                    print("收藏");
                    Navigator.of(context).pop("收藏");
                  },
                ),
                const Divider(),
                ListTile(
                  title: const Text("取消"),
                  onTap: () {
                    print("取消");
                    Navigator.of(context).pop("取消");
                  },
                ),
                const Divider(),
              ],
            ),
          );
        });
    print(result);
  }
  // 提示信息弹窗
  void _toast() {
    Fluttertoast.showToast(
        msg: "提示信息",
        toastLength: Toast.LENGTH_LONG, //值针对 android 平台
        gravity: ToastGravity.CENTER, //方位
        timeInSecForIosWeb: 1, //提示时间 针对ios 和 web
        backgroundColor: Colors.black, //背景颜色
        textColor: Colors.white, //文本颜色
        fontSize: 16.0 //文本字体大小
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text("Dialog"),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              ElevatedButton(
                onPressed: _alertDialog,
                child: const Text('alert弹出框-AlertDialog '),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _simpleDialog,
                child: const Text('select弹出框-SimpleDialog'),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _modelBottomSheet,
                child: const Text('ActionSheet底部弹出框'),
              ),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: _toast,
                child: const Text('Toast'),
              ),
            ],
          ),
        ));
  }
}
~~~
### 自定义 Dialog
自定义 `Dialog` 对象，需要继承 `Dialog` 类，尽管 `Dialog` 提供了 `child` 参数可以用来写视图界面，但是往往会
达不到我们想要的效果，因为默认的 `Dialog` 背景框是满屏的。如果我们想完全定义界面，就需要重写 `build` 函数。
~~~dart
// /widget/myDialog.dart
import 'package:flutter/material.dart';

class MyDialog extends Dialog {
  final String title;
  final String content;
  final Function()? onTap;
  const MyDialog(
      {Key? key,
      required this.title,
      required this.content,
      required this.onTap})
      : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Material(
      type: MaterialType.transparency, //设置背景透明
      child: Center(
        //主要要包裹一个组件，不然会全屏
        child: Container(
          height: 240,
          width: 240,
          color: Colors.white,
          child: Column(
            children: [
              Padding(
                padding: const EdgeInsets.all(5),
                child: Stack(
                  children: [
                    Align(
                      alignment: Alignment.centerLeft,
                      child: Text(
                        title,
                        style: const TextStyle(fontSize: 18),
                      ),
                    ),
                    Align(
                      alignment: Alignment.centerRight,
                      child: InkWell(
                        onTap: onTap,
                        child: const Icon(Icons.close),
                      ),
                    )
                  ],
                ),
              ),
              const Divider(),
              Container(
                padding: const EdgeInsets.all(10),
                width: double.infinity,
                child: Text(content, style: const TextStyle(fontSize: 14)),
              )
            ],
          ),
        ),
      ),
    );
  }
}
~~~
~~~dart
import 'package:flutter/material.dart';
import '../widget/myDialog.dart';

class DialogPage extends StatefulWidget {
  const DialogPage({super.key});

  @override
  State<DialogPage> createState() => _DialogPageState();
}

class _DialogPageState extends State<DialogPage> {
  @override
  void initState() {
    super.initState();
  }

  void _myDialog() async {
    var result = await showDialog(
        barrierDismissible: false, //表示点击灰色背景的时候是否消失弹出框
        context: context,
        builder: (context) {
          return MyDialog(
            title: "提示!",
            content: "我是一个内容",
            onTap: (){
              print("close");
              Navigator.of(context).pop("我是自定义dialog关闭的事件");              
            },
          );
        });
    print(result);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Dialog"),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ElevatedButton(
              onPressed: _myDialog,
              child: const Text('自定义dialog'),
            ),
          ],
        ),
      )
    );
  }
}
~~~
### PageView
`Flutter` 中的轮动图以及抖音上下滑页切换视频功能等等，这些都可以通过 `PageView` 轻松实现。

`PageView` 常见属性：
|属性 |描述|
|---|--|
|scrollDirection| Axis.horizonta水平方向、 Axis.vertical垂直方向|
|children| 配置子元素|
|allowImplicitScrolling |缓存当前页面的前后两页|
|onPageChanged |page改变的时候触发|

~~~dart
import 'package:flutter/material.dart';

class PageViewPage extends StatefulWidget {
  const PageViewPage({super.key});

  @override
  State<PageViewPage> createState() => _PageViewPageState();
}

class _PageViewPageState extends State<PageViewPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: PageView(
        scrollDirection: Axis.vertical, //配置PageView滑动的方向,默认是水平方向
        children: [
          Center(
              child: Text(
            "第1屏",
            style: Theme.of(context).textTheme.headline1,
          )),
          Center(
              child: Text(
            "第2屏",
            style: Theme.of(context).textTheme.headline1,
          )),
          Center(
              child: Text(
            "第3屏",
            style: Theme.of(context).textTheme.headline1,
          )),
          Center(
              child: Text(
            "第4屏",
            style: Theme.of(context).textTheme.headline1,
          )),
          Center(
              child: Text(
            "第5屏",
            style: Theme.of(context).textTheme.headline1,
          )),
          Center(
              child: Text(
            "第6屏",
            style: Theme.of(context).textTheme.headline1,
          )),
          Center(
              child: Text(
            "第7屏",
            style: Theme.of(context).textTheme.headline1,
          )),
        ],
      ),
    );
  }
}
~~~
`PageView.builder` 的使用
~~~dart
import 'package:flutter/material.dart';

class PageViewBuilderPage extends StatefulWidget {
  const PageViewBuilderPage({super.key});

  @override
  State<PageViewBuilderPage> createState() => _PageViewBuilderPageState();
}

class _PageViewBuilderPageState extends State<PageViewBuilderPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PageViewBuilder'),
      ),
      body: PageView.builder(
        scrollDirection:Axis.vertical,  //垂直
        itemCount: 10,
        itemBuilder: (context, index) {
          return Center(
              child: Text(
            "第${index + 1}屏",
            style: Theme.of(context).textTheme.headline1,
          ));
        }
      ),
    );
  }
}
~~~
`PageView` 上拉无限加载的实现思路
~~~dart
import 'package:flutter/material.dart';

class PageViewFullPage extends StatefulWidget {
  const PageViewFullPage({super.key});

  @override
  State<PageViewFullPage> createState() => _PageViewFullPageState();
}

class _PageViewFullPageState extends State<PageViewFullPage> {
  List<Widget> list = [];

  @override
  void initState() {
    super.initState();
    for (var i = 0; i < 10; i++) {
      list.add(Center(
          child: Text("第${i + 1}屏", style: const TextStyle(fontSize: 60))));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Full Page'),
      ),
      body: PageView(
        scrollDirection: Axis.vertical,
        onPageChanged: (index) {
          print(index);
          if (index + 2 == list.length) {
            setState(() {
              for (var i = 0; i < 10; i++) {
                list.add(Center(
                    child: Text("第${i + 1}屏",
                        style: const TextStyle(fontSize: 60))));
              }
            });
          }
        },
        children: list,
      ),
    );
  }
}
~~~
`PageView` 实现一个无限轮播的轮播图
~~~dart
// /widget/image.dart
import 'package:flutter/material.dart';

class ImagePage extends StatelessWidget {
  final double width;
  final double height;
  final String src;
  const ImagePage(
    {
      super.key,
      this.width = double.infinity,
      this.height = 200,
      required this.src
    }
  );

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Image.network(
        src,
        fit: BoxFit.cover,
      ),
    );
  }
}
~~~
~~~dart
import 'package:flutter/material.dart';
import '../widget/image.dart';

class PageViewSwiper extends StatefulWidget {
  const PageViewSwiper({super.key});

  @override
  State<PageViewSwiper> createState() => _PageViewSwiperState();
}

class _PageViewSwiperState extends State<PageViewSwiper> {
  List<Widget> list = [];
  int _currentIndex = 0;
  @override
  void initState() {
    super.initState();
    list = const [
      ImagePage(
        src: "https://www.itying.com/images/flutter/1.png",
      ),
      ImagePage(
        src: "https://www.itying.com/images/flutter/2.png",
      ),
      ImagePage(
        src: "https://www.itying.com/images/flutter/3.png",
      ),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('PageViewSwiper'),
      ),
      body: Stack(
        children: [
          SizedBox(
            height: 200,
            child: PageView.builder(
              onPageChanged: (index) {
                /*
                  1、刚开始     _currentIndex=0
                  2、index=1    _currentIndex=1
                  3、index=2    _currentIndex=2
                  4、index=3    _currentIndex=0
                  5、index=4     _currentIndex=1
                  6、index=5     _currentIndex=2
                  7、index=6     _currentIndex=0
                */
                setState(() {
                  _currentIndex = index % list.length;
                });
              },
              itemCount: 1000,
              itemBuilder: (context, index) {
                return list[index % list.length];
                // index的值是0-1000
                // 0  1  2    0  1  2   0  1 2
              }
            ),
          ),
          Positioned(
            left: 0,
            right: 0, //设置 left:0 right:0就会站满整行
            bottom: 2,
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: List.generate(list.length, (index) {
                return Container(
                  margin: const EdgeInsets.all(5),
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: _currentIndex == index ? Colors.blue : Colors.grey,
                    shape: BoxShape.circle, //圆
                    // borderRadius: BorderRadius.circular(5) //圆
                  ),
                );
              }).toList(),
            )
          )
        ],
      ),
    );
  }
}
~~~
### 定时器
~~~dart
const timeout = Duration(seconds: 3);
var t = Timer.periodic(timeout, (timer) {
  print('afterTimer='+DateTime.now().toString());
  // timer.cancel(); // 取消定时器
});
t.cancel(); // 取消定时器
~~~
组件销毁的时候取消定时器
~~~dart
void dispose() {
  super.dispose();
  t.cancel();
}
~~~
使用定时器封装轮播图组件
~~~dart
import 'dart:async';
import 'package:flutter/material.dart';

class Swiper extends StatefulWidget {
  final double width;
  final double height;
  final List<String> list;
  const Swiper(
    {super.key,
    this.height = 200,
    this.width = double.infinity,
    required this.list}
  );

  @override
  State<Swiper> createState() => _SwiperState();
}

class _SwiperState extends State<Swiper> {
  int _currentIndex = 0;
  List<Widget> pageList = [];
  late PageController _pageController;
  late Timer timer;
  @override
  void initState() {
    super.initState();
    //数据
    for (var i = 0; i < widget.list.length; i++) {
      pageList.add(ImagePage(
        width: widget.width, height: widget.height, src: widget.list[i]));
    }
    //PageController
    _pageController = PageController(initialPage: 0);

    timer = Timer.periodic(const Duration(seconds: 5), (t) {
      _pageController.animateToPage((_currentIndex + 1) % pageList.length,
        duration: const Duration(milliseconds: 200), curve: Curves.linear);
    });
  }

  @override
  void dispose() {
    super.dispose();
    timer.cancel();
    _pageController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        SizedBox(
          height: 200,
          child: PageView.builder(
            controller: _pageController,
            onPageChanged: (index) {
              setState(() {
                _currentIndex = index % pageList.length;
              });
            },
            itemCount: 1000,
            itemBuilder: (context, index) {
              return pageList[index % pageList.length];
              // index的值是0-1000
              // 0  1  2    0  1  2   0  1 2
            }
          ),
        ),
        Positioned(
          left: 0,
          right: 0, //设置 left:0 right:0就会站满整行
          bottom: 2,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(pageList.length, (index) {
              return Container(
                margin: const EdgeInsets.all(5),
                width: 10,
                height: 10,
                decoration: BoxDecoration(
                  color: _currentIndex == index ? Colors.blue : Colors.grey,
                  shape: BoxShape.circle //圆
                  // borderRadius: BorderRadius.circular(5) //圆
                ),
              );
            }).toList(),
          )
        )
      ],
    );
  }
}

class ImagePage extends StatelessWidget {
  final double width;
  final double height;
  final String src;
  const ImagePage(
      {super.key,
      this.width = double.infinity,
      this.height = 200,
      required this.src});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      height: height,
      child: Image.network(
        src,
        fit: BoxFit.cover,
      ),
    );
  }
}
~~~
###  AutomaticKeepAliveClientMixin 缓存 PageView 页面
通过上面的例子我们会发现 每次滑动的时候都会触发子组件中的 `build` 方法 `print(widget.url);`
可见 `PageView` 默认并没有缓存功能，一旦页面滑出屏幕它就会被销毁 ,实际项目开发中对页面进行缓
存是很常见的一个需求，下面我们就看看如何使用 `AutomaticKeepAliveClientMixin` 缓存页面。
::: tip
注意：使用时一定要注意是否必要，因为对所有列表项都缓存的会导致更多的内存消耗。
:::
~~~dart
// 缓存封装 /tools/keepAliveWrapper.dart
import 'package:flutter/material.dart';

class KeepAliveWrapper extends StatefulWidget {
  const KeepAliveWrapper(
    {Key? key, @required this.child, this.keepAlive = true})
    : super(key: key);

  final Widget? child;
  final bool keepAlive;

  @override
  State<KeepAliveWrapper> createState() => _KeepAliveWrapperState();
}

class _KeepAliveWrapperState extends State<KeepAliveWrapper> with AutomaticKeepAliveClientMixin {
  @override
  Widget build(BuildContext context) {
    return widget.child!;
  }

  @override
  bool get wantKeepAlive => widget.keepAlive;  
}
~~~
~~~dart
import 'package:flutter/material.dart';
import '../tools/keepAliveWrapper.dart';

class PageViewKeepAlive extends StatefulWidget {
  const PageViewKeepAlive({super.key});

  @override
  State<PageViewKeepAlive> createState() => _PageViewKeepAliveState();
}

class _PageViewKeepAliveState extends State<PageViewKeepAlive> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: PageView.builder(
        scrollDirection: Axis.vertical,
        itemCount: 10,
        itemBuilder: (context, index) {
          return KeepAliveWrapper(   //注意：如果页面比较多,缓存会耗费内存, 注意 注意
            child: MyContainer(num: index,),
          );
        }
      ),
    );
  }
}

//自定义组件
class MyContainer extends StatefulWidget {
  final int num;
  const MyContainer({super.key, required this.num});

  @override
  State<MyContainer> createState() => _MyContainerState();
}

class _MyContainerState extends State<MyContainer>  {
  @override
  Widget build(BuildContext context) {
    print(widget.num);  //默认数据是没有缓存,每次滑动都会执行build
    return Center(
        child: Text(
      "第${widget.num}屏",
      style: Theme.of(context).textTheme.headline1,
    ));
  }
}
~~~
### AnimatedList
`AnimatedList` 和 `ListView` 的功能大体相似，不同的是，`AnimatedList` 可以在列表中插入或删除节点
时执行一个动画，在需要添加或删除列表项的场景中会提高用户体验。

`AnimatedList` 是一个 `StatefulWidget`，它对应的 `State` 类型为 `AnimatedListState`，添加和删除元素的
方法位于 `AnimatedListState` 中：
~~~dart
void insertItem(int index, { Duration duration = _kDuration });
void removeItem(int index, AnimatedListRemovedItemBuilder builder, { Duration
duration = _kDuration });
~~~
AnimatedList常见属性：
|属性 |描述|
|---|--|
|key |globalKey final globalKey = GlobalKey();|
|initialItemCount |子元素数量|
|itemBuilder| 方法 ( BuildContext context, int index, Animation animation) {}|

**关于 GlobalKey** ：每个 `Widget` 都对应一个 `Element`，我们可以直接对 `Widget` 进行操作，但是无法直
接操作 `Widget` 对应的 `Element`。而 `GlobalKey` 就是那把直接访问 Element 的钥匙。通过 `GlobalKey`
可以获取到 `Widget` 对应的 `Element`。

#### AnimatedList 增加列表 FadeTransition、ScaleTransition
~~~dart
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final _globalKey = GlobalKey<AnimatedListState>();
  bool flag = true;
  List<String> list = ["第一条", "第二条"];

  Widget _buildItem(index) {
    return ListTile(
      key: ValueKey(index),
      title: Text(list[index]),
      trailing: IconButton(
        icon: const Icon(Icons.delete),
        onPressed: () {
          //执行删除
          _deleteItem(index);
        },
      ),
    );
  }

  _deleteItem(index) {
    if (flag == true) {
      flag = false;
      //执行删除
      _globalKey.currentState!.removeItem(index, (context, animation) {
        //animation的值是从1到0
        var removeItem = _buildItem(index);
        list.removeAt(index); //数组中删除数据
        return ScaleTransition(
          // opacity: animation,
          scale: animation,
          child: removeItem, //删除的时候执行动画的元素
        );
      });
      //解决快速删除的bug
      Timer.periodic(const Duration(milliseconds: 500), (timer) {
        flag = true;
        timer.cancel();
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Title'),
      ),
      floatingActionButton: FloatingActionButton(
        child: Icon(Icons.add),
        onPressed: () {
          list.add("我是新增的数据");
          _globalKey.currentState!.insertItem(list.length - 1);
        },
      ),
      body: AnimatedList(
        key: _globalKey,
        initialItemCount: list.length,
        itemBuilder: ((context, index, animation) {
          //animation的值是从0到1
          return FadeTransition(
            opacity: animation,
            child: _buildItem(index),
          );
        })
      ),
    );
  }
}
~~~
### AnimatedContainer
~~~dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Scaffold(
          floatingActionButton: FloatingActionButton(
            child: const Icon(Icons.add),
            onPressed: () {
              setState(() {
                flag = !flag;
              });
            },
          ),
          appBar: AppBar(
            title: const Text('Title'),
          ),
          body: Stack(
            children: [
              ListView(
                children: const [
                  ListTile(
                    title: Text("我是一个列表"),
                  )
                ],
              ),
            ],
          ),
        ),
        Positioned(
          left: 0,
          top: 0,
          bottom: 0,
          child: AnimatedContainer(
            duration: const Duration(seconds: 1, milliseconds: 100),
            width: 200,
            height: double.infinity,
            transform: flag
                ? Matrix4.translationValues(-200, 0, 0)
                : Matrix4.translationValues(0, 0, 0),
            color: Colors.yellow,
          )
        )
      ],
    );
  }
}
~~~
### AnimatedPadding
~~~dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          setState(() {
            flag = !flag;
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: AnimatedPadding(
        curve: Curves.bounceInOut,
        padding: EdgeInsets.fromLTRB(10, flag ? 10 : 500, 0, 0),
        duration: const Duration(seconds: 2),
        child: Container(
          width: 100,
          height: 100,
          color: Colors.red,
        ),
      ),
    );
  }
}
~~~
### AnimatedOpacity
~~~dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          setState(() {
            flag = !flag;
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Center(
        child: AnimatedOpacity(
          opacity: flag ? 0.2 : 1,
          duration: const Duration(seconds: 1),
          curve: Curves.easeIn,
          child: Container(
            width: 100,
            height: 100,
            color: Colors.red,
          ),
        ),
      ),
    );
  }
}
~~~
### AnimatedPositioned
~~~dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          setState(() {
            flag = !flag;
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Stack(
        children: [
          ListView(
            children: const [
              ListTile(
                title: Text("我是一个列表"),
              ),
              ListTile(
                title: Text("我是一个列表"),
              ),
              ListTile(
                title: Text("我是一个列表"),
              ),
              ListTile(
                title: Text("我是一个列表"),
              ),
              ListTile(
                title: Text("我是一个列表"),
              ),
              ListTile(
                title: Text("我是一个列表"),
              ),
            ],
          ),
          AnimatedPositioned(
            curve: Curves.linear,
            right: flag ? 10 : 300,
            top: flag ? 10 : 560,
            duration: const Duration(seconds: 1, milliseconds: 500),
            child: Container(
              width: 60,
              height: 60,
              color: Colors.blue,
            )
          ),
        ],
      ),
    );
  }
}
~~~
### AnimatedDefaultTextStyle
~~~dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          setState(() {
            flag = !flag;
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Center(
        child: Container(
          alignment: Alignment.center,
          width: 300,
          height: 300,
          color: Colors.blue,
          child: AnimatedDefaultTextStyle(
            duration: const Duration(seconds: 1),
            style: TextStyle(fontSize: flag ? 20 : 50, color: Colors.black),
            child: const Text("你好Flutter"),
          ),
        ),
      ),
    );
  }
}
~~~
### AnimatedSwitcher
~~~dart
class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key});

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  bool flag = true;
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          setState(() {
            flag = !flag;
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Center(
        child: Container(
          alignment: Alignment.center,
          width: 300,
          height: 220,
          color: Colors.yellow,
          child: AnimatedSwitcher(
            //当子元素改变的时候会触发动画
            transitionBuilder: ((child, animation) {
              //可以改变动画效果
              return ScaleTransition(
                scale: animation,
                child: FadeTransition(
                  opacity: animation,
                  child: child,
                ),
              );
            }),
            duration: const Duration(seconds: 1),
            child: flag
              ? const CircularProgressIndicator()
              : Image.network(
                  "https://www.itying.com/images/flutter/2.png",
                  fit: BoxFit.cover,
                )
          )
        ),
      ),
    );
  }
}
~~~
### Hero
`Hero` 动画是一种可以在页面切换时实现平滑过渡效果的动画。它通常用于在不同页面之间共享和过渡图片、文本或其他小部件。

[photo_view](https://pub.dev/packages/photo_view) 插件支持预览图片，可放大、缩小、滑动图片。

`pubspec.yaml` 的 `dependencies` 中添加
~~~yaml
photo_view: ^0.14.0
~~~
单张图片的预览
~~~dart
import 'package:photo_view/photo_view.dart';

@override
Widget build(BuildContext context) {
  return Container(
    child: PhotoView(
      imageProvider: AssetImage("assets/large-image.jpg"),
    )
  );
}
~~~
多张图片的预览
~~~dart
import 'package:photo_view/photo_view_gallery.dart';

PhotoViewGallery.builder(
  itemCount: 5,
  builder: ((context, index) {
    return PhotoViewGalleryPageOptions(
    imageProvider: NetworkImage(listData[index]["imageUrl"]));
  })
)
~~~
~~~dart
import 'package:photo_view/photo_view_gallery.dart';

PhotoViewGallery.builder(
  scrollPhysics: const BouncingScrollPhysics(),
  builder: (BuildContext context, int index) {
    return PhotoViewGalleryPageOptions(
      imageProvider: NetworkImage(widget.imageItems[index]["imageUrl"]),
    );
  },
  scrollDirection: widget.direction,
  itemCount: widget.imageItems.length,
  backgroundDecoration: const BoxDecoration(color: Colors.black),
  pageController: PageController(initialPage: 1),
  onPageChanged: (index) => setState(() {
      currentIndex = index;
    }
  )
)
~~~
`PhotoViewGallery.builder` 属性：
|属性 |描述|
|---|--|
|scrollPhysics |BouncingScrollPhysics() 滑动到边界的时候有弹跳的效果|
|scrollDirection |Axis.horizontal 水平 、Axis.vertical垂直方向|
|backgroundDecoration |背景颜色|
|builder |builder函数 根据配置的itemCount渲染函数|
|itemCount |数量|
|pageController |PageController(initialPage: 1)|
|onPageChanged |onPageChanged触发的方法|

**使用示例：**
~~~dart
// /res/listData.dart 模拟数据
List listData=[
  {
      "title": 'Candy Shop',
      "author": 'Mohamed Chahin',
      "imageUrl": 'https://www.itying.com/images/flutter/1.png',
  },
    {
      "title": 'Childhood',
      "author": 'Google',
      "imageUrl": 'https://www.itying.com/images/flutter/2.png',
  },
]
~~~
`HeroPage` 页面
~~~dart
import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';

class HeroPage extends StatefulWidget {
  final Map arguments;
  const HeroPage({super.key, required this.arguments});

  @override
  State<HeroPage> createState() => _HeroPageState();
}

class _HeroPageState extends State<HeroPage> {
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        Navigator.pop(context);
      },
      child: Hero(
        tag: widget.arguments["imageUrl"],
        child: Scaffold(
          backgroundColor: Colors.black,
          body: Center(
            child: AspectRatio(
              aspectRatio: 16 / 9,
              child: PhotoView(
                imageProvider: NetworkImage(widget.arguments["imageUrl"]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
~~~
路由
~~~dart
import 'package:flutter/cupertino.dart';
import '../pages/hero.dart';

final Map<String,Function> routes = {
  '/hero': (contxt,{arguments}) => HeroPage(arguments:arguments), 
};

var onGenerateRoute = (RouteSettings settings) {
  // 统一处理
  final String? name = settings.name;
  final Function? pageContentBuilder = routes[name];
  if (pageContentBuilder != null) {
    if (settings.arguments != null) {
      final Route route = CupertinoPageRoute(
          builder: (context) =>
              pageContentBuilder(context, arguments: settings.arguments));
      return route;
    } else {
      final Route route =
          CupertinoPageRoute(builder: (context) => pageContentBuilder(context));
      return route;
    }
  }
  return null;
};
~~~
使用
~~~dart
import 'package:flutter/material.dart';
import '../../res/listData.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Widget> _getListData() {
    var tempList = listData.map((value) {
      return GestureDetector(
        onTap: () {
          Navigator.pushNamed(context, "/hero",
              arguments: {"imageUrl": value['imageUrl']});
        },
        child: Container(
          decoration: BoxDecoration(
              border: Border.all(
                  color: const Color.fromRGBO(233, 233, 233, 0.9), width: 1)),
          child: Column(
            children: <Widget>[
              Hero(
                tag: value['imageUrl'],
                child: Image.network(value['imageUrl'])),
              const SizedBox(height: 10),
              Text(
                value['title'],
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16),
              )
            ],
          ),
        ),
      );
    });
    return tempList.toList();
  }

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisSpacing: 10.0, //水平子 Widget 之间间距
      mainAxisSpacing: 10.0, //垂直子 Widget 之间间距
      padding: const EdgeInsets.all(10),
      crossAxisCount: 2, //一行的 Widget 数量
      // childAspectRatio:0.7,  //宽度和高度的比例
      children: _getListData(),
    );
  }
}
~~~
### TweenAnimationBuilder
`TweenAnimationBuilder` 用于创建自定义的动画效果。通过 `TweenAnimationBuilder`，您可以定义起始值和结束值，并在指定的时间内进行过渡。

|属性 |描述|
|---|--|
|duration |动画过渡的持续时间|
|tween |定义起始值和结束值的 Tween 对象，例如 `Tween<double>(begin: 0.0, end: 1.0)`|
|builder |一个回调函数，在动画过程中被调用。它接收当前动画值和子部件作为参数，并返回一个小部件|
|child(可选) |要包裹的子部件。这是静态不变的部分，不会随动画变化而改变|

~~~dart
class ColorTweenAnimation extends StatefulWidget {
  @override
  _ColorTweenAnimationState createState() => _ColorTweenAnimationState();
}

class _ColorTweenAnimationState extends State<ColorTweenAnimation> {
  Color _startColor = Colors.red;
  Color _endColor = Colors.blue;

  @override
  Widget build(BuildContext context) {
    return TweenAnimationBuilder<Color>(
      duration: Duration(seconds: 2),
      tween: ColorTween(begin: _startColor, end: _endColor),
      builder: (BuildContext context, Color value, Widget? child) {
        return Container(
          color: value,
          width: 200,
          height: 200,
        );
      },
      child: Text('Color Transition'),
    );
  }
}
~~~
## 路由
`Flutter` 中的路由通俗的讲就是页面跳转。在 `Flutter` 中通过 `Navigator` 组件管理路由导航。
并提供了管理堆栈的方法。如：`Navigator.push` 和 `Navigator.pop`。

`Flutter`中给我们提供了两种配置路由跳转的方式：
- 基本路由 
- 命名路由

~~~dart
import '../SearchPage.dart';

Center(
  child: ElevatedButton(
    onPressed: (){
      Navigator.of(context).push(
        MaterialPageRoute(builder: (context){
        return const SearchPage();
      })
    );
  }, child: const Text("跳转到搜索页面")),
)
~~~
### 普通路由跳转传值
跳转传值和调用组件传值的实现方法是一样的。

定义一个SearchPage接收传值
~~~dart
import 'package:flutter/material.dart';

class SearchPage extends StatefulWidget {
  final String title;
  const SearchPage({super.key,this.title="Search Page"});
  
  @override
  State<SearchPage> createState() => _SearchPageState();
}

class _SearchPageState extends State<SearchPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
        centerTitle: true,
      ),
      body: const Center(
        child: Text("组件居中"),
      ),
    );
  }
}
~~~
跳转页面实现传值
~~~dart
Center(
  child: ElevatedButton(
    onPressed: (){
      Navigator.of(context).push(
        MaterialPageRoute(builder: (context){
          return const SearchPage(title: "搜索页面",);
        })
      );
    }, 
    child: const Text("跳转到搜索页面")
  ),
)
~~~
### 配置命名路由
~~~dart
import 'package:flutter/material.dart';
import './pages/tabs.dart';
import './pages/search.dart';
import './pages/news.dart';
import './pages/form.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // home:const Tabs() ,
      initialRoute: "/",
      routes: {
        "/": (contxt) => const Tabs(),
        "/news": (contxt) => const NewsPage(),
        "/search": (contxt) => const SearchPage(),
        "form": (contxt) {
          return const FormPage();
        },
      },
    );
  }
}
~~~
路由跳转
~~~dart
ElevatedButton(
  onPressed: () {
    Navigator.pushNamed(context, '/form');
  },
  child: const Text("跳转到form页面")
)
~~~
### 命名路由传参
~~~dart
import 'package:flutter/material.dart';
import './pages/tabs.dart';
import './pages/search.dart';
import './pages/news.dart';
import './pages/form.dart';
import './pages/shop.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  //1、配置路由
  Map routes = {
    "/": (contxt) => const Tabs(),
    "/news": (contxt) => const NewsPage(),
    "/search": (contxt) => const SearchPage(),
    "/form": (contxt, {arguments}) => FormPage(arguments: arguments),
    "/shop": (contxt, {arguments}) => ShopPage(arguments: arguments),
  };

  MyApp({Key? key}) : super(key: key);

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      // home:const Tabs() ,
      initialRoute: "/",
      //2、配置onGenerateRoute  固定写法
      onGenerateRoute: (RouteSettings settings) {
        // print(settings);
        // print(settings.name);
        // print(settings.arguments);

        final String? name = settings.name; //  /news 或者 /search
        final Function? pageContentBuilder =
            routes[name]; //  Function = (contxt) { return const NewsPage()}

        if (pageContentBuilder != null) {
          if (settings.arguments != null) {
            final Route route = MaterialPageRoute(
                builder: (context) =>
                    pageContentBuilder(context, arguments: settings.arguments));
            return route;
          } else {
            final Route route = MaterialPageRoute(
                builder: (context) => pageContentBuilder(context));

            return route;
          }
        }
        return null;
      },
    );
  }
}
~~~
接收传参
~~~dart
import 'package:flutter/material.dart';

class ShopPage extends StatefulWidget {
  //接收命名路由跳转传值
  final Map arguments;
  const ShopPage({super.key, required this.arguments});

  @override
  State<ShopPage> createState() => _ShopPageState();
}

class _ShopPageState extends State<ShopPage> {
  @override
  void initState() {
    super.initState();

    print(widget.arguments);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("shop"),
      ),
      body: const Center(
        child: Text("shop页面"),
      ),
    );
  }
}
~~~
跳转传参
~~~dart
ElevatedButton(
  onPressed: () {
    Navigator.pushNamed(context, '/shop',arguments: {
      "title": "shop页面",
    });
  },
  child: const Text("shop")
)
~~~
路由配置抽离到独立文件中
~~~dart
// ./routers/routers.dart
import 'package:flutter/material.dart';
import '../pages/tabs.dart';
import '../pages/search.dart';
import '../pages/news.dart';
import '../pages/form.dart';
import '../pages/shop.dart';

//1、配置路由
Map routes = {
  "/": (contxt) => const Tabs(),
  "/news": (contxt) => const NewsPage(),
  "/search": (contxt) => const SearchPage(),
  "/form": (contxt, {arguments}) => FormPage(arguments: arguments),
  "/shop": (contxt, {arguments}) => ShopPage(arguments: arguments),
};

//2、配置onGenerateRoute  固定写法  这个方法也相当于一个中间件，这里可以做权限判断
var onGenerateRoute = (RouteSettings settings) { 
  final String? name = settings.name; // /news 或者 /search
  final Function? pageContentBuilder = routes[name];//  Function = (contxt) { return const NewsPage()}

  if (pageContentBuilder != null) {
    if (settings.arguments != null) {
      final Route route = MaterialPageRoute(
          builder: (context) =>
              pageContentBuilder(context, arguments: settings.arguments));
      return route;
    } else {
      final Route route =
          MaterialPageRoute(builder: (context) => pageContentBuilder(context));

      return route;
    }
  }
  return null;
};
~~~
~~~dart
import 'package:flutter/material.dart';
import './routers/routers.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);
  
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: "/",
      onGenerateRoute: onGenerateRoute,
    );
  }
}
~~~
### 替换路由
比如我们从用户中心页面跳转到了 `registerFirst` 页面，然后从 `registerFirst` 页面通过 `pushReplacementNamed` 跳转到了 `registerSecond` 页面。这个时候当我们点击 `registerSecond` 的返回按钮的时候它会直接返回到用户中心。
~~~dart
Navigator.of(context).pushReplacementNamed('/registerSecond');
~~~
### 返回根路由
比如我们从用户中心跳转到 `registerFirst` 页面，然后从 `registerFirst` 页面跳转到 `registerSecond` 页面，然
后从 `registerSecond` 跳转到了 `registerThird` 页面。这个时候我们想的是 `registerThird` 注册成功后返回到
用户中心。这个时候就用到了返回到根路由的方法。
~~~dart
Navigator.of(context).pushAndRemoveUntil(
  MaterialPageRoute(
    builder: (BuildContext context) {
      return const Tabs();
    }
  ), 
  (route) => false
);
~~~
### Android 和 Ios 使用同样风格的路由跳转
`Material` 组件库中提供了一个 `MaterialPageRoute` 组件，它可以使用和平台风格一致的路由切换动画，
如在 `IOS` 上会左右滑动切换，而在 `Android` 上会上下滑动切换, `CupertinoPageRoute` 是 `Cupertino` 组件
库提供的 `IOS` 风格的路由切换组件如果在 `Android` 上也想使用左右切换风格，可以使用 `CupertinoPageRoute`。
~~~dart
import 'package:flutter/cupertino.dart';
/*
配置ios风格的路由
1、删掉material.dart引入cupertino.dart
  import 'package:flutter/cupertino.dart';

2、把 MaterialPageRoute替换成 CupertinoPageRoute
*/

import '../pages/tabs.dart';
import '../pages/shop.dart';
import '../pages/user/login.dart';
import '../pages/user/registerFirst.dart';
import '../pages/user/registerSecond.dart';
import '../pages/user/registerThird.dart';

//1、配置路由
Map routes = {
  "/": (contxt) => const Tabs(),
  "/login": (contxt) => const LoginPage(),
  "/registerFirst": (contxt) => const RegisterFirstPage(),
  "/registerSecond": (contxt) => const RegisterSecondPage(),
  "/registerThird": (contxt) => const RegisterThirdPage(),
  "/shop": (contxt, {arguments}) => ShopPage(arguments: arguments),
};

//2、配置onGenerateRoute  固定写法  这个方法也相当于一个中间件，这里可以做权限判断
var onGenerateRoute = (RouteSettings settings) {
  final String? name = settings.name; //  /news 或者 /search
  final Function? pageContentBuilder =
      routes[name]; //  Function = (contxt) { return const NewsPage()}

  if (pageContentBuilder != null) {
    if (settings.arguments != null) {
      final Route route = CupertinoPageRoute(
          builder: (context) =>
              pageContentBuilder(context, arguments: settings.arguments));
      return route;
    } else {
      final Route route =
          CupertinoPageRoute(builder: (context) => pageContentBuilder(context));

      return route;
    }
  }
  return null;
};
~~~
全局主题配置：
~~~dart
return MaterialApp(
  debugShowCheckedModeBanner: false,
  title: 'Flutter Demo',
  theme: ThemeData(
      primarySwatch: Colors.blue,
      appBarTheme: const AppBarTheme(
        centerTitle: true,
      )),
  initialRoute: "/",
  onGenerateRoute: onGenerateRoute,
);
~~~
## Key 详解
我们平时一定接触过很多的 `Widget`，比如 `Container`、`Row`、`Column` 等，它们在我们绘制界面的过程
中发挥着重要的作用。但是不知道你有没有注意到，在几乎每个 `Widget` 的构造函数中，都有一个共同
的参数，它们通常在参数列表的第一个，那就是 **Key**。

在 `Flutter` 中，**`Key` 是不能重复使用的**，所以 `Key` 一般用来做唯一标识。组件在更新的时候，其状态的保
存主要是通过判断**组件的类型**或者 **`key` 值**是否一致。因此，当各组件的类型不同的时候，类型已经足够
用来区分不同的组件了，此时我们可以不必使用 `key`。但是如果同时存在多个同一类型的控件的时候，
此时类型已经无法作为区分的条件了，我们就需要使用到 `key`。

**Key** 子类包含 `LocalKey` 和 `GlobalKey` 。
- **局部键（LocalKey）**：`ValueKey`、`ObjectKey`、`UniqueKey`
  - ValueKey:（值key）把一个值作为key。
  - UniqueKey:（唯一key）程序生成唯一的Key，当我们不知道如何指定ValueKey的时候就可以使用UniqueKey。
  - ObjectKey:（对象key）把一个对象实例作为key。
- **全局键（GlobalKey）**： `GlobalKey`、`GlobalObjectKey`
  - GlobalKey:（全局key）。
  - GlobalObjectKey:（全局Objec key，和ObjectKey有点类似）。

`LocalKey` 的使用：
~~~dart
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Widget> list = [
    //注意：常量没法改变
    //1、可以保存状态 2、可以排序
    const Box(
      key: ValueKey('1'), //值key
      color: Colors.red,
    ),
    Box(
      key: UniqueKey(), //唯一值 每次运行的时候会随机生成
      color: Colors.yellow,
    ),
    const Box(key: ObjectKey(Box(color: Colors.blue)), color: Colors.blue) //对象key
  ];
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.refresh),
        onPressed: () {
          setState(() {
            list.shuffle(); //shuffle:打乱list元素的顺序
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: list,
        ),
      ),
    );
  }
}

class Box extends StatefulWidget {
  final Color color;
  const Box({Key? key, required this.color}) : super(key: key);

  @override
  State<Box> createState() => _BoxState();
}

class _BoxState extends State<Box> {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      width: 100,
      child: ElevatedButton(
        style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(widget.color)),
        onPressed: () {
          setState(() {
            _count++;
          });
        },
        child: Text(
          "$_count",
          style: Theme.of(context).textTheme.headline2,
        ),
      ),
    );
  }
}
~~~
`GlobalKey` 的使用：如果把 `LocalKey` 比作局部变量，`GlobalKey` 就类似于全局变量
~~~dart
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  List<Widget> list = [];
  final GlobalKey _globalKey1 = GlobalKey();
  final GlobalKey _globalKey2 = GlobalKey();
  final GlobalKey _globalKey3 = GlobalKey();

  @override
  void initState() {
    super.initState();
    list = [
      //注意：常量没法改变
      //1、可以保存状态 2、可以排序
      Box(
        key: _globalKey1,
        color: Colors.red,
      ),
      Box(
        key: _globalKey2, //唯一值 每次允许的时候会随机生成
        color: Colors.yellow,
      ),
      Box(key: _globalKey3, color: Colors.blue)
    ];
  }

  @override
  Widget build(BuildContext context) {
    print(MediaQuery.of(context).orientation);

    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.refresh),
        onPressed: () {
          setState(() {
            list.shuffle(); //shuffle:打乱list元素的顺序
          });
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Center(
        child: MediaQuery.of(context).orientation == Orientation.portrait
            ? Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: list,
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: list,
              ),
      ),
    );
  }
}

class Box extends StatefulWidget {
  final Color color;
  const Box({Key? key, required this.color}) : super(key: key);

  @override
  State<Box> createState() => _BoxState();
}

class _BoxState extends State<Box> {
  int _count = 0;
  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      width: 100,
      child: ElevatedButton(
        style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(widget.color)),
        onPressed: () {
          setState(() {
            _count++;
          });
        },
        child: Text(
          "$_count",
          style: Theme.of(context).textTheme.headline2,
        ),
      ),
    );
  }
}
~~~
`globalKey.currentState` 可以获取子组件的状态，执行子组件的方法，`globalKey.currentWidget` 可以获
取子组件的属性，`_globalKey.currentContext!.findRenderObject()` 可以获取渲染的属性。
~~~dart
//父Widget
class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final GlobalKey _globalKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      floatingActionButton: FloatingActionButton(
        child: const Icon(Icons.add),
        onPressed: () {
          //1、获取currentState Widget的属性（记住）
          var boxState = _globalKey.currentState as _BoxState;
          print(boxState._count);
          setState(() {
            boxState._count++;
          });
          //调用currentState Widget的方法
          boxState.run();

          //2、获取子Widget (了解)
          var boxWidget = _globalKey.currentWidget as Box;
          print(boxWidget
              .color); //值：MaterialColor(primary value: Color(0xfff44336))

          // 3、获取子组件渲染的属性（了解）

          var renderBox =
              _globalKey.currentContext!.findRenderObject() as RenderBox;
          print(renderBox.size); //值：Size(100.0, 100.0)
        },
      ),
      appBar: AppBar(
        title: const Text('Title'),
      ),
      body: Center(
        child: Box(key: _globalKey, color: Colors.red),
      ),
    );
  }
}

//子Widget
class Box extends StatefulWidget {
  final Color color;
  const Box({Key? key, required this.color}) : super(key: key);
  @override
  State<Box> createState() => _BoxState();
}

class _BoxState extends State<Box> {
  int _count = 0;
  void run() {
    print("我是box的run方法");
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      width: 100,
      child: ElevatedButton(
        style: ButtonStyle(
            backgroundColor: MaterialStateProperty.all(widget.color)),
        onPressed: () {
          setState(() {
            _count++;
          });
        },
        child: Text(
          "$_count",
          style: Theme.of(context).textTheme.headline2,
        ),
      ),
    );
  }
}
~~~
## 状态管理
在 `Flutter` 中，还有其他的状态管理方法可供选择，以下是一些常见的状态管理方法。
- **InheritedWidget 和 InheritedModel**：这些是 `Flutter` 提供的允许状态在组件树中向下传递的特殊类型的组件。它们可以帮助你在应用程序的不同层级之间共享状态。这种方法对于较小的应用程序或有限的状态共享需求较为合适。

- **Provider**： 一个依赖注入和状态管理第三方库，它是在 `InheritedWidget` 基础上做了封装，有上面组件的能力，但是更简单易用。`Provider` 可以监听状态变化，并在需要时重新构建关联的组件。这种方法适用于各种规模的应用程序，具有良好的可扩展性和灵活性。

- **Riverpod**： 一个相对较新的状态管理库，类似于 `Provider`，但提供了更多的功能和改进。`Riverpod` 允许你创建不可变的、可组合的和可测试的状态管理解决方案。这种方法适用于需要更高度可控和可测试性的应用程序。

- **BLoC（Business Logic Component）**：一种基于响应式编程的状态管理方法。`BLoC` 将业务逻辑与 `UI` 分离，使你可以轻松地测试和重用代码。`BLoC` 通常与 `RxDart`（一种 `Dart` 的响应式编程库）一起使用，以提供强大的数据流处理能力。这种方法适用于需要处理复杂业务逻辑和大量数据流的应用程序。

- **Redux**： 一种集中式状态管理库，它将应用程序的状态存储在一个单一的状态树中。`Redux` 使用纯函数（称为`reducers`）来处理状态更新，使你可以轻松地跟踪和管理应用程序的状态变化。这种方法适用于需要严格的状态管理和可预测性的应用程序。


### InheritedWidget
`InheritedWidget` 是一个基类，用于定义可以在 `Widget` 树中共享的数据。它是 `Flutter` `中实现数据共享的一种简单方式。InheritedWidget` 的子类可以从父级向子级传递数据，并且只有在数据发生变化时，才会通知子级进行更新。

要使用 `InheritedWidget`，通常需要完成以下步骤：
1. 创建一个继承自 `InheritedWidget` 的数据模型类，并在其中定义要共享的数据。
2. 实现 `InheritedWidget` 的 `updateShouldNotify()` 方法，以确定是否通知子部件进行更新。
3. 在需要访问共享数据的子部件中，使用 `BuildContext` 的 `dependOnInheritedWidgetOfExactType()` 方法来获取并订阅该数据模型。

~~~dart
class CounterModel extends InheritedWidget {
  final int count;

  CounterModel({
    required this.count,
    required Widget child,
  }) : super(child: child);

  static CounterModel? of(BuildContext context) {
    return context.dependOnInheritedWidgetOfExactType<CounterModel>();
  }

  @override
  bool updateShouldNotify(CounterModel oldWidget) {
    return count != oldWidget.count;
  }
}

class CounterButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counterModel = CounterModel.of(context);
    return ElevatedButton(
      onPressed: () {
        // 更新计数器数据
        // 注意：这里修改了共享的数据，会触发依赖该数据的子部件进行更新
        // 如果不需要更新依赖，可以在这里创建新的 CounterModel 对象
        // 并将其传递给对应的子部件
        counterModel!.count++;
      },
      child: Text('Increment'),
    );
  }
}

class CounterDisplay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counterModel = CounterModel.of(context);
    return Text('Count: ${counterModel!.count}');
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CounterModel(
      count: 0,
      child: MaterialApp(
        title: 'My App',
        home: Scaffold(
          appBar: AppBar(
            title: Text('InheritedWidget Example'),
          ),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CounterDisplay(),
                CounterButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
~~~
`CounterModel` 继承自 `InheritedWidget`，表示一个计数器数据模型。`CounterButton` 和 `CounterDisplay` 部件都通过 `CounterModel.of(context)` 获取共享的计数器数据，并相应地进行更新和展示。通过修改 `CounterModel` 对象中的 `count` 值，会自动触发依赖该数据的子部件进行更新。

### InheritedModel
`InheritedModel` 是在 `InheritedWidget` 的基础上进行了改进的进阶概念。与 `InheritedWidget` 一样，`InheritedModel` 也提供了共享数据和依赖管理的机制，但是相比于 `InheritedWidget`，`InheritedModel` 具备更精细的依赖控制能力。

`InheritedModel` 在数据更新时可以选择性地通知特定的子部件进行更新，而不是通知整个子部件树。这对于在大规模数据结构中优化性能非常有用。

使用 `InheritedModel` 需要完成以下步骤：
1. 创建一个继承自 `InheritedModel` 的数据模型类，并定义要共享的数据。
2. 实现 `InheritedModel` 的 `updateShouldNotifyDependent()` 方法，以确定是否通知特定的子部件进行更新。
3. 在需要访问共享数据的子部件中，使用 `BuildContext` 的 `dependOnInheritedModel()` 方法来订阅特定的共享数据。

~~~dart
enum CounterAspect {
  count,
}

class CounterModel extends InheritedModel<CounterAspect> {
  final int count;

  CounterModel({
    required this.count,
    required Widget child,
  }) : super(child: child);

  static CounterModel? of(BuildContext context, {required CounterAspect aspect}) {
    return InheritedModel.inheritFrom<CounterModel>(context, aspect: aspect);
  }

  @override
  bool updateShouldNotifyDependent(CounterModel oldWidget, Set<CounterAspect> dependencies) {
    return dependencies.contains(CounterAspect.count) && count != oldWidget.count;
  }
}

class CounterButton extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counterModel = CounterModel.of(context, aspect: CounterAspect.count);
    return ElevatedButton(
      onPressed: () {
        counterModel!.count++;
      },
      child: Text('Increment'),
    );
  }
}

class CounterDisplay extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final counterModel = CounterModel.of(context, aspect: CounterAspect.count);
    return Text('Count: ${counterModel!.count}');
  }
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return CounterModel(
      count: 0,
      child: MaterialApp(
        title: 'My App',
        home: Scaffold(
          appBar: AppBar(
            title: Text('InheritedModel Example'),
          ),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CounterDisplay(),
                CounterButton(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
~~~
`CounterAspect` 是一个枚举类型，用于定义共享数据的依赖方面。`CounterModel` 继承自 `InheritedModel`，并根据 `CounterAspect` 对数据进行划分。`CounterButton` 和 `CounterDisplay` 部件仅订阅 `CounterAspect.count`，因此只有在计数器数据更改时才会进行更新。

### Provider
`Provider` 是 `Flutter` 中一个非常流行的第三方状态管理库，它提供了一种简单而强大的方式来共享和更新数据。

在使用 `Provider` 时，您可以将应用程序的状态分解成单独的小组件，并使用 `Provider` 来共享这些组件之间的数据。`Provider` 支持多种类型的数据共享，包括：
- `ValueNotifier`：用于跟踪某个值的变化。
- `ChangeNotifier`：用于跟踪多个值的变化。
- `Stream`：用于从异步源中获取数据。

~~~dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class Counter with ChangeNotifier {
  int _count = 0;

  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

class CounterApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Counter App',
      home: ChangeNotifierProvider(
        create: (_) => Counter(),
        child: Scaffold(
          appBar: AppBar(
            title: Text('Counter App'),
          ),
          body: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  'You have pushed the button this many times:',
                ),
                Consumer<Counter>(
                  builder: (context, counter, child) => Text(
                    '${counter.count}',
                    style: Theme.of(context).textTheme.headline3,
                  ),
                ),
              ],
            ),
          ),
          floatingActionButton: FloatingActionButton(
            onPressed: () {
              Provider.of<Counter>(context, listen: false).increment();
            },
            tooltip: 'Increment',
            child: Icon(Icons.add),
          ),
        ),
      ),
    );
  }
}

void main() {
  runApp(CounterApp());
}
~~~
`Counter` 类继承自 `ChangeNotifier`，用于跟踪计数器值的变化。在 `CounterApp` 部件的 `build` 方法中，我们使用 `ChangeNotifierProvider` 来创建一个 `Counter` 对象，并将其共享给应用程序的其他部件。我们使用 `Consumer` 来订阅计数器对象的变化，以便在计数器值发生更改时更新`UI`。通过使用 `Provider.of`，我们可以访问和更新共享的计数器数据。

除了基本的 `Provider` 和 `Consumer`，`Provider` 还包括许多其他特性，如：
- `MultiProvider`：用于组合多个 `Provider`。
- `ProxyProvider`：允许您从一个 `Provider` 中提取数据并将其传递给另一个 `Provider`。
- `Selector`：允许您选择 `Provider` 中的部分数据，以避免不必要的重建。

### Riverpod
`Riverpod` 是一个基于 `Provider` 的 `Flutter` 状态管理库，它提供了更简洁和强大的方式来共享和管理应用程序的状态。`Riverpod` 是由 `Provider` 的作者 `Remi Rousselet` 创建的，旨在提供更好的开发体验和更好的性能。

使用 `Riverpod`，您可以将应用程序的状态分解成单独的小组件，并使用 `ProviderContainer` 来共享这些组件之间的数据。与 `Provider` 不同的是，`Riverpod` 引入了一些新概念和功能，如使用自动启动的计算器、`ScopedProvider`、`FamilyProvider` 等，以简化状态管理流程。

~~~dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final counterProvider = Provider<int>((ref) => 0);

void main() {
  runApp(
    ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Riverpod Example',
      home: Scaffold(
        appBar: AppBar(
          title: Text('Riverpod Example'),
        ),
        body: Center(
          child: Consumer(builder: (context, watch, child) {
            final count = watch(counterProvider);
            return Text('Count: $count');
          }),
        ),
        floatingActionButton: FloatingActionButton(
          onPressed: () {
            context.read(counterProvider).state++;
          },
          child: Icon(Icons.add),
        ),
      ),
    );
  }
}
~~~
我们创建了一个名为 `counterProvider` 的 `Provider`，它提供一个整数值并初始化为 `0`。在 `main()` 方法中，我们用 `ProviderScope` 包裹整个应用程序，以便在 `Flutter` 组件树中使用 `Provider`。

在 `MyApp` 组件的 `build` 方法中，我们使用 `Consumer` 将 `counterProvider` 订阅到 `UI` 中，并在屏幕上显示计数器的值。当用户点击浮动操作按钮时，我们使用 `context.read` 方法直接访问 `counterProvider` 并增加其值。




















