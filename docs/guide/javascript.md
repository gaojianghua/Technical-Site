# 数据类型检测

1. typeof
   - typeof null => "object"
   - typeof 不能细分对象类型的值, 返回结果都是"object" [检测函数返回"function"]
   - typeof 10 => "number"
   - typeof new Number(10) => "object"
   - 底层原理: typeof是按照"值"在计算机中存储的"二进制"值来检测的, 凡是以000开始的都认为是对象, null => 000000
   - 优势: 使用方便, 检测原始值类型和函数类型很方便

2. instanceof

   - 检测某个实例是否隶属于某个类 [临时拉来做数据类型检测]

   - 不能检测原始值类型

   - 原型链可以被肆意重构, 导致结果不准确

   - 底层原理 (例: xxx instanceof Ctor)

     - 首先调用Symbol.hasInstance, 存在就基于这个检测 

       ~~~js
       Ctor[Symbol.hasInstance](xxx)
       ~~~

     - 如果没有, 就基于原型链proto查找: 只要Ctor.prototype出现在xxx的原型链上, 结果就是true

3. Object.prototype.toString.call(val)
   - 除了null/undefined, 大部分数据类型所属类的原型上, 都有toSting方法; 但是除了Object.prototype.toString用来检测数据类型, 其余的都是转换为字符串的
   - 返回值: "[object ?]"
     - 先查找[val]上的Symbol.toStringTag [先找私有的, 私有没有则向所属类原型上找], 属性值就是"?"的值
     - 没有则内部是返回当前实例所属构造函数的名字