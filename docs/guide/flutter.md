<!--
 * @Author: 高江华 g598670138@163.com
 * @Date: 2023-04-11 16:57:52
 * @LastEditors: 高江华
 * @LastEditTime: 2023-09-23 17:44:07
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

**常用的属性：**
- home（主页）
- title（标题）
- color（颜色）
- theme（主题）
- routes（路由）

### Scaffold
`Scaffold`是`Material Design`布局结构的基本实现。此类提供了用于显示`drawer`、`snackbar`和底部`sheet`
的`API`。

**主要的属性：**
- appBar：显示在界面顶部的一个 AppBar。
- body：当前界面所显示的主要内容 Widget。
- drawer：抽屉菜单控件。

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
使用字体图标库，在Flutter中，我们使用ttf格式即可。
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















