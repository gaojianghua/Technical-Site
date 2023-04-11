# GoLang
## 简介

高并发, Go协程优于PHP多进程, java多线程模式

高性能, 编译后的二进制优于PHP解释型, java虚拟机

高效网络模型, epoll优于PHP的BIO, java的NIO

## 环境配置

1. 下载安装GO

2. 选择放置项目的盘符创建GO文件夹, 并创建三个子文件夹, 分别为:bin, pkg, src

3. 在src下创建以你github域名和账号命名的文件夹链, 如: src\github.com\gaojianghua

4. 将环境变量中的GOPATH改为对应你的工作目录, 如: E:\GO

5. 将E:\GO\bin添加到path环境变量中

6. 使用vscode或者GoLand打开E:\GO\src目录下新建的项目并新建一个go文件

7. 使用https://goproxy.io国内代理安装go插件,执行下方命令

   ~~~go
   go env -w GO111MODULE=on
   go env -w GOPROXY=https://goproxy.cn,direct
   ~~~

8. 在vscode右下角弹出的插件安装提示中点击install all安装所有插件

9. 在GoLand设置中配置GOROOT和GOPATH以及GO Module

   - GOROOT就是GO的安装路径, 默认会自动设置上
   - GOPATH里的三个设置, 全部设置为你创建的E:\GO目录
   - GO Module中勾选启动模块集成并填上GOPROXY=https://goproxy.io,direct

10. GO命令:

    - go build -o 123.go        //编译并运行go文件
    - go install                       //编译并生成可执行文件移动到bin目录下
    - go run                            //像执行脚本文件一样执行go代码

11. 跨平台编译: (其他平台去掉S)

    - SET CGO_ENABLED=0      //禁用CGO
    - SET GOOS=linux               //目标平台是linux(在哪个平台跑就改成哪个平台)
    - SET GOARCH=amd64       //目标处理器架构是amd64

## 基础

1. 函数名首字母大写才能在其他包引用并使用
2. 变量首字母大写并写在外部才能供其他包引用并使用
3. 包名与文件夹名没有必然联系,因便于开发强烈建议同名处理
4. import包时,路径从$GOPATH的src目录下开始,编译器自动从src下开始查找
5. 在同一包下,不能有相同函数名与全局变量
6. main包有且只能有一个,入口即出口,golang的核心
7. main包最终会编译成可执行文件( go build -o bin/main.exe golang/project/main )

### fmt基础包

通用：

```
%v	值的默认格式表示 
%+v	类似%v，但输出结构体时会添加字段名
%#v	值的Go语法表示
%T	值的类型的Go语法表示
%%	百分号
```

布尔值：

```
%t	单词true或false
```

整数：

```
%b	表示为二进制
%c	该值对应的unicode码值
%d	表示为十进制
%o	表示为八进制
%q	该值对应的单引号括起来的go语法字符字面值，必要时会采用安全的转义表示
%x	表示为十六进制，使用a-f
%X	表示为十六进制，使用A-F
%U	表示为Unicode格式：U+1234，等价于"U+%04X"
```

浮点数与复数的两个组分：

```
%b	无小数部分、二进制指数的科学计数法，如-123456p-78；参见strconv.FormatFloat
%e	科学计数法，如-1234.456e+78
%E	科学计数法，如-1234.456E+78
%f	有小数部分但无指数部分，如123.456
%F	等价于%f
%g	根据实际情况采用%e或%f格式（以获得更简洁、准确的输出）
%G	根据实际情况采用%E或%F格式（以获得更简洁、准确的输出）
```

字符串和[]byte：

```
%s	直接输出字符串或者[]byte
%q	该值对应的双引号括起来的go语法字符串字面值，必要时会采用安全的转义表示
%x	每个字节用两字符十六进制数表示（使用a-f）
%X	每个字节用两字符十六进制数表示（使用A-F）    
```

指针：

```
%p	表示为十六进制，并加上前导的0x    
```

没有%u。整数如果是无符号类型自然输出也是无符号的。类似的，也没有必要指定操作数的尺寸（int8，int64）。

宽度通过一个紧跟在百分号后面的十进制数指定，如果未指定宽度，则表示值时除必需之外不作填充。精度通过（可选的）宽度后跟点号后跟的十进制数指定。如果未指定精度，会使用默认精度；如果点号后没有跟数字，表示精度为0。举例如下：

```
%f:    默认宽度，默认精度
%9f    宽度9，默认精度
%.2f   默认宽度，精度2
%9.2f  宽度9，精度2
%9.f   宽度9，精度0 
```



### 基础类型

1. 值类型: 变量直接存储值, 内存通常在栈中分配

- 值类型: int系列, float系列, bool, string, array, struct

2. 引用类型: 变量存储的是地址, 地址对应的空间存储真正的值, 通常在堆中分配, 当没有变量引用这个地址时, 地址对应的空间被视为垃圾, 由GC来回收

- 引用类型: 指针pointer, 切片slice, 字典map, 管道chan, 接口interface



整型

|  类型  |                             描述                             |
| :----: | :----------------------------------------------------------: |
| uint8  |                  无符号 8位整型 (0 到 255)                   |
| uint16 |                 无符号 16位整型 (0 到 65535)                 |
| uint32 |              无符号 32位整型 (0 到 4294967295)               |
| uint64 |         无符号 64位整型 (0 到 18446744073709551615)          |
|  int8  |                 有符号 8位整型 (-128 到 127)                 |
| int16  |              有符号 16位整型 (-32768 到 32767)               |
| int32  |         有符号 32位整型 (-2147483648 到 2147483647)          |
| int64  | 有符号 64位整型 (-9223372036854775808 到 9223372036854775807) |

特殊整型

|  类型   |                        描述                        |
| :-----: | :------------------------------------------------: |
|  uint   | 32位操作系统上就是uint32，64位操作系统上就是uint64 |
|   int   |  32位操作系统上就是int32，64位操作系统上就是int64  |
| uintptr |            无符号整型，用于存放一个指针            |

**注意：**
在使用`int`和 `uint`类型时，不能假定它是32位或64位的整型，而是考虑`int`和`uint`可能在不同平台上的差异。

**注意事项**
获取对象的长度的内建`len()`函数返回的长度可以根据不同平台的字节长度进行变化。实际使用中，切片或 map 的元素数量等都可以用`int`来表示。在涉及到二进制传输、读写文件的结构描述时，为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用`int`和 `uint`



浮点型

Go语言支持两种浮点型数：`float32`和`float64`。这两种浮点型数据格式遵循`IEEE 754`标准：
`float32` 的浮点数的最大范围约为 `3.4e38`，可以使用常量定义：`math.MaxFloat32`。
`float64` 的浮点数的最大范围约为 `1.8e308`，可以使用一个常量定义：`math.MaxFloat64`。



复数

complex64和complex128

复数有实部和虚部，complex64的实部和虚部为32位，complex128的实部和虚部为64位。



基本数据转String

fmt.Sprintf()

strconv.FormatInt(变量, 进制)

strconv.FormatFloat(变量, 格式, 小数保留几位, 小数类型值如: 64)

strconv.FormatBool(变量)

strconv.Itoa(变量)



String转基础数据

Parse系列函数有两个返回值,可以用b,_接收,下划线表示忽略

strconv.ParseBool(变量)

strconv.ParseInt(变量, 进制, 整型位数)

strconv.ParseFloat(变量, 小数类型位数)



**指针(slice)**

变量的地址存的值, 地址通过: &变量 获取

指针变量存储的地址里的值通过: *指针变量 获取

指针用来存储内存地址,且只能存一个,重复存储会覆盖掉旧值

值类型都有对应的指针类型

值类型: int系列, float系列, bool, string, 数组 , struct

~~~go
var num int = 10 
var ptr *int = &num
//将num的内存地址赋值给指针类型的ptr
//*int表示指针类型, &num表示num在内存中的地址
fmt.Printf("%v", &num)//num的内存地址
fmt.Printf("%v", ptr)//num的内存地址
fmt.Printf("%v", &ptr)//ptr的内存地址
fmt.Printf("%v", *ptr)//取出存储的num地址里的值,也就是10

指针初始化：// &i为指针地址，i为值地址，*I为具体值
var i *int; 
i = new(int); 
*i = 1
~~~



运算符注意点

1. 整数相除会舍弃小数位
2. ++和--只能独立使用, 如( a = i++ )是错误的
3. 只有(i++, i--) 没有(++i, --i)
4. %取余的本质是: a % b = a - a / b * b



获取控制台输入的值

fmt.Scanf(指定%格式, 变量地址)与fmt.Scanln(变量地址)



流程控制语句

~~~go
if a < 10 {

}
//if语句判断不需要小括号
if b := 1; b < 10 {  

}
//if判断中可以直接定义变量
~~~

~~~go
switch score := 30; {
    case 'a':
    fmt.Println('a')
    case 'b':
    fmt.Println('b')
    case 'c', 'd':
    fmt.Println('c', 'd')
	case score > 20 $$ score < 50:
    fmt.Println('判断')
    fallthrough
    case:
    fmt.Println('0')
    default:
    fmt,Println('以上都不匹配,默认输出')
}
//不需要break, case后面可以带多个表达式用逗号分隔
//case后面也可不带表达式, 也可以直接定义变量, 不推荐
//fallthrough穿透: 当前case成立,仍执行后面的case,只穿透一层
~~~

~~~go
for i := 1; i <= 10;i++ {

}
//传统循环,不需要小括号
//如果字符串含中文循环出来会乱码,按字节来遍历的,转为切片可解决
for index, value := range str {
    
}
//for-range默认按字符方式遍历
~~~

~~~go
lable2:
for i := 0;i < 4;i++ {
    label1:
    for j := 0;j < 10;j++ {
        if j == 2 {
            break label1
        }
        fmt.Println('123')
    }
}
//break默认会跳出最近的循环
//当指定跳出的标签时,会跳出标签层对应的for循环
~~~

~~~go
lable2:
for i := 0;i < 4;i++ {
    label1:
    for j := 0;j < 10;j++ {
        if j == 2 {
            continue label1
        }
        fmt.Println('123')
    }
}
//continue默认结束当前最近的循环,执行下次循环
//当指定跳出的标签时,会结束标签层对应的当前循环,执行下次循环
~~~

~~~go
fmt.Println("1")
goto label
fmt.Println("2")
fmt.Println("3")
fmt.Println("4")
fmt.Println("5")
label:
fmt.Println("6")
//goto语句指定标签,直接跳到标签处执行代码,不建议使用该语句
//通常与if语句一起使用
~~~



函数类型

返回值支持命名和多个

~~~go
//定义函数类型
type myFunc func(int, int ) int
//定义函数
func getSun(num1 int, num2 int) int {
	return num1 + num2
}
//定义传函数参数的函数
func myFunc2(funvar myFunc, num1 int, num2 int) int  {
	return funvar(num1, num2)
}
//在main中使用
func main() {
	res3 := myFunc2(getSun, 500, 500)
	fmt.Println(res3)
}
~~~

~~~go
func myfunc(args... int) (i int, o int) {
    num := 1
    for a :=0; a<len(args); a++{
       num += args[a]
    } 
    return num, a
}
//args...代表传进来的多个参数,类型是切片
~~~

~~~go
var abc int = 567
func init(){
    res := 123
    defer fmt.Println(res)	//123
    res++
}
func main(){
    
}
//defer后面的代码会推入栈中等待函数执行完后再执行,并拷贝引用的值
//在全局中,go语言会依次解析全局变量->init初始化函数->main主函数
~~~



### 常用函数

#### 字符串

**len(str)**					

//返回变量的长度, 内置函数(无需引包)

**[]rune(str)**

//转为切片并返回, 内置函数(无需引包), 解决遍历字符串出现乱码的问题.

**strconv.Atoi("123")**

//有两个返回值: value和error

//字符串转整数并返回, 需要引包, 只能转数字字符串, 否则返回的为nil零值

**strconv.Itoa(123)**

//整数转字符串并返回, 需要引包

**[]byte("hello")**

//字符串转byte切片并返回ascll码值

**string([]byte{97,98,99})**

//将byte切片转为字符串并返回, 内置函数

**strconv.FormatInt(123, 2)**

//10进制转其他进制并返回

**strings.Contains("hello", "he")**

//查找子字符串是否在指定的字符串中, 返回布尔值, 需要引包

**strings.Count("ababa", "ab")**

//统计子字符串在指定的字符串中有多少个并返回, 需要引包

**strings.EqualFold("abc", "ABC")**

//字符串比较, 不区分大小写(==是区分大小写), 返回布尔值, 需要引包

**strings.Index("abc", "b")**

//返回子字符串在指定字符串中第一次出现的值的索引值, 需要引包

**strings.LastIndex("abc", "b")**

//返回子字符串在指定字符串中最后一次出现的值的索引值, 需要引包

**strings.Replace("gogohello", "go", "ios", -1)**

//指定初始字符串, 要替换的位置子串, 替换后的子串, 替换次数

//-1为替换所有匹配的子串, 不改变初始字符串, 返回替换后的新字符串

**strings.Split("go,go,hello",  ",")**

//按照指定的字符分割字符串,返回一个包含分割后的多个字符串的数组

//不会改变初始字符串本身

**strings.ToLower("Go")**

//字符串转小写并返回, 不改变字符串本身

**strings.ToUpper("Go")**

//字符串转大写并返回, 不改变字符串本身

**strings.TrimSpace(" gao ")**

//去除字符串两端空格并返回, 不改变字符串本身

**strings.Trim("!gao!", "!")**

//去掉字符串两端指定的字符并返回, 不改变字符串本身

**strings.TrimLeft("!gao", "!")**

//去掉字符串左边指定的字符并返回, 不改变字符串本身

**strings.TrimRight("gao!", "!")**

//去掉字符串右边指定的字符并返回, 不改变字符串本身

**strings.HasPrefix("!gao", "!")**

//判断字符串是否以指定的字符开头并返回布尔值

**strings.HasSuffix("gao!", "!")**

//判断字符串是否以指定的字符结束并返回布尔值



#### 时间日期

**now := time.Now()**

//获取当前时间并返回

**now.Year()**

**int(now.Month())**

**now.Day()**

**now.Hour()**

**now.Minute()**

**now.Second()**

//依次获取年月日, 时分秒 

**now.Format("2006-01-02 15:04:05")**

//格式化日期时间

~~~go
type Duration int64
const (
	Nanosecond Duration = 1						//纳秒
	Microsecond 		= 1000 * Nanosecond		//微秒
	Millisecond			= 1000 * Microsecond	//毫秒
	Second				= 1000 * Millisecond	//秒
	Minute				= 60 * Second			//分
	Hour				= 60 * Minute			//时
)
~~~

//内置的时间常量

**time.Sleep()**

//休眠即延迟执行, 可使用时间常量来计算需要休眠的时间 

**now.Unix()**

//获取1970年到现在的秒数时间戳

**now.UnixNano()**

//获取1970年到现在的纳秒数时间戳



#### 内置 

**new()**

//传入一个值类型, 创建一个指针, 系统分配指针的地址值以及自身的地址

//指针的地址值的值为传入值类型的零值

**make()**

//传入一个引用类型, 创建一个指针, 系统分配指针的地址值以及自身的地址

//指针的地址值的值为传入引用类型的零值





### 错误处理

defer, panic, recover

//Go中抛出一个panic异常,然后在defer中通过recover捕获, 然后正常处理

~~~go
func test () int {
	defer func() {
		err := recover()
		if err != nil {
			fmt.Println(err)
		}
	}()
	num1 := 100
	num2 :=0
	num3 := num1 / num2
	return num3
}


func main()  {

	test := test()

	fmt.Printf("123456")
	fmt.Println(test)
}
~~~

自定义错误

1. errors.New("错误说明"), 返回error类型的值为一个错误

2. panic内置函数, 接收一个interface()类型的值, 可接收error类型变量

   输出错误信息并退出程序

~~~go
func read(name string) (err error)  {
	if name == "config" {
		return nil
	}else {
		return errors.New("文件错误")
	}
}
func test2()  {
	err := read("config1")
	if err != nil {
		panic(err)
	}
	fmt.Println("正常执行")
}
func main()  {
	test2()
}
~~~



### **结构体**

结构体元素的地址是连续的, 是值类型

在方法调用中遵守值拷贝传递的方式

若要修改结构体变量的值, 可以通过结构体指针的方式去处理

~~~go
type Circle struct {
	raduis float64
}

func (c Circle) area() float64 {
	return 3.14 * c.raduis * c.raduis
}
func (c *Circle) area2() float64 {
	c.raduis = 10.0
	return 3.14 * c.raduis * c.raduis
} 
func main()  {
	var name Circle
	name.raduis = 5.0
	res := name.area2()
	fmt.Println(res)	//输出314
}

//在方法area2中通过指针改变了结构体中radius的值, 指针指向的结构体本身.
~~~



结构体类型相互转换时: 元素的名字, 个数, 类型必须完全相同

~~~go
type A struct {
	number int
}
type B struct {
	number int
}
func main()  {
	var a A
	var b B
	a = A(b)
	fmt.Println(a,b)
}
//当元素的名字, 个数, 类型完全相同, 可以进行类型强转
~~~



公共结构体元素首字母大写转json格式时, 可以通过tag标签标记转换时为小写

~~~go
type Circle struct {
	Radius float64 `json:"radius"`
}
func main()  {
	var name Circle
	a,_ := json.Marshal(name)
	fmt.Println(string(a))	//{"radius":0}
}
//json.Marshal()将结构体转换为字节码, 通过string()内置函数转换为字符串
~~~





方法与函数总结

1. 不管调用形式如何, 真正决定是值拷贝还是地址拷贝, 看这个方法是和哪个类型绑定
2. 如果是值类型, 如(p Person)则是值拷贝, 如果是指针类型, 如(p *Person)则是地址拷贝





工厂模式解决私有结构体跨包使用

~~~go
//主包
type a struct {
	number int
}
func News(b int) *a {
	return &a{
		number: b,
	}
}
//跨包(model包)
func main()  {
	var stu = model.News(10)
	fmt.Println(*stu)
}
~~~





### 接口

接口( interface )类型可以定义一组方法且不需要实现, 不能包含任何变量, 当某个自定义类型使用的时候, 再将其实现出来

空接口可表示任意类型

 

### 协程

通过go关键字启动协程

协程依赖于系统内核

协程是主线程的分支, 依赖于主线程, 若主线程执行完成, 协程会自动结束

### 管道

先进先出

遍历管道需使用for range

容量固定, 需要用make声明再使用

管道只读: var Chan <-  chan int

管道只写: var Chan chan <-  int

select case语法解决管道阻塞问题



协程与管道案例

~~~go
func putNum(iniChan chan int) {
	for i:=0;i<=8000;i++ {
		iniChan<-i
	}
	close(iniChan)
}
func primeChan (intChan chan int, primeChan chan int, exitChan chan bool) {
	//var num int
	var flag bool
	for {
		num, ok := <-intChan
		if !ok {
			break
		}
		flag = true
		for i := 2; i < num; i++ {
			if num % i == 0 {
				flag = false
				break
			}
		}
		if flag {
			primeChan<- num
		}
	}
	exitChan<-true
}

func main() {
	iniChan := make(chan int, 1000)
	promeChan := make(chan int, 2000)
	exitChan := make(chan bool, 4)
	go putNum(iniChan)
	for i := 0; i < 4; i++ {
		go primeChan(iniChan, promeChan, exitChan)
	}
	go func() {

		for i := 0; i < 4; i++ {
			<-exitChan
		}
		close(promeChan)

	}()
	for {
		res, ok :=<-promeChan
		if !ok {
			break
		}
		fmt.Printf("s=%d\n", res)
	}
}
~~~





### 文件操作

os.Create:		文件不存在则创建, 文件存在则清空文件内容

~~~go
func main () {
	f, err := os.Create('./test/is')
	if err != nil {
		fmt.Println("create err:", err)
		return
	}
	defer f.Close()		//关闭文件
}
~~~

os.Open:			以只读方式打开文件,文件不存在则打开失败

~~~go
func main () {
	f, err := os.Open('./test/is')
	if err != nil {
		fmt.Println("create err:", err)
		return
	}
	_, err := f.WriteString("高江华")
	if err != nil {
		fmt.Println("WriteString err:", err)
		return
	}					//会报错,权限不足
	defer f.Close()		//关闭文件
}
~~~

os.OpenFile:	(适用于操作目录)	以只读, 只写, 读写方式打开文件, 文件不存在则打开失败

参数1: 文件名

参数2:

- O_RDONLY		只读
- O_WRONLY       只写
- O_RDWR            读写

参数3: ( 对于目录传: os.ModeDir )

0. 没有任何权限
1. 执行权限 ( 如果是可执行文件, 是可以运行的 )
2. 写权限
3. 写权限与执行权限
4. 读权限
5. 读权限与执行权限
6. 读权限与写权限
7. 读权限, 写权限, 执行权限

~~~go
func main () {
	f, err := os.OpenFile('./test/is', O_RDWR, 6)
	if err != nil {
		fmt.Println("create err:", err)
		return
	}
	_, err := f.WriteString("高江华")
	if err != nil {
		fmt.Println("WriteString err:", err)
		return
	}
	defer f.Close()		//关闭文件
}
~~~



f.WriteString ( ) :	返回写入的字符个数, 从起始位置开始, 会覆盖原有内容



f.Seek ( ) :	修改文件的读写指针位置

参数1:	偏移量	正: 向文件尾部偏移	负: 向文件头部偏移

参数2:	偏移起始位置:	io.SeekStart ( 文件起始位置 )	io.SeekCurrent ( 文件当前位置 )

io.SeekEnd ( 文件结尾位置 )

返回:	从起始位置到当前位置的偏移量



f.WriteAt ( ) :	在文件指定偏移位置, 写入[]byte, 通常搭配Seek()

参数1:	待写入的数据

参数2:	偏移量

返回:	实际写出的字节数



bufio.NewReader(f)

~~~go
reader := bufio.NewReader(f) 	//创建一个带有缓冲区的reader
buf, err := reader.ReadBytes('\n')		//到\n结束,读一行数据
if err != nil {			//err == io.EOF则读完所有内容
	fmt.Println("ReadBytes err:", err)
	return
}
fmt.Println(string(buf))
~~~



文件拷贝

~~~go
func main () {
	//打开要读取的文件
    fr, err := os.Open("C:/123/test.txt")
    if err != nil {
        fmt.Println("Open err:", err)
        return
    }
    defer fr.Close()
    //创建要写入的文件
    fw, err := os.Create("C:/123/my.txt")
    if err != nil {
        fmt.Println("Create err:", err)
        return
    }
    defer fw.Close()
    //创建一个切片缓冲区
    buf := make([]byte, 4096)
    for {
        //将读到的数据放入buf切片缓冲区中
        n, err := fr.Read(buf)
        if err != nil && err == io.EOF {
            fmt.Printf("读完")
            return
        }
        //将读取后放入缓冲区的内容写入要写入的文件中
        fw.Write(buf[:n])
    }
}
~~~





遍历目录

~~~go
func main() {
	var path string
    fmt.Scan(&path)
    //打开目录
    f, err := os.OpenFile(path, os.O_RDONLY, os.ModeDir)
    if err != nil {
        fmt.Println("OpenFile err:", err)
        return
    }
    defer f.Close()
    //读取目录项
    info, err := f.Readdir(-1)	//负值代表读取目录中的所有目录项
    if err != nil {
        fmt.Println("Readdir err:", err)
        return
    }
    //遍历返回的切片
    for _, fileinfo := range info {
        if fileinfo.IsDir() {
            fmt.Println(fileinfo.Name(),"是一个目录")
        }else{
        	fmt.Println(fileinfo.Name(),"是一个文件")
        }
    }
}
~~~







### 反射

需引入reflect包

案例

~~~go
//对int类型的反射
func reflect1(b interface{}) {
	rtype := reflect.TypeOf(b)
	fmt.Println("rtype=", rtype)
	//输出类型为int, 实际类型为reflect.type
	rvalue := reflect.ValueOf(b)
	fmt.Printf("rvalue=%v type=%T\n", rvalue, rvalue)
	//输出值为100, 实际类型为reflect.value
	a := 2 + rvalue.Int()
	fmt.Println("a=", a)
	//无法做值操作,需要使用方法Int()转换
	iv := rvalue.Interface()
	//转回interface{}类型
	num := iv.(int)
	fmt.Println("num=", num)
	//将interface通过断言转成需要的类型
}
//对结构体的反射
func reflect2(b interface{})  {
	rtype := reflect.TypeOf(b)
	fmt.Println("rtype=", rtype)
	//输出类型为student, 实际类型为reflect.type
	rvalue := reflect.ValueOf(b)
	fmt.Printf("rvalue=%v type=%T\n", rvalue, rvalue)
	//输出值为{高江华, 26}, 实际类型为reflect.value
	iv := rvalue.Interface()
	//转回interface{}类型
	fmt.Printf("iv=%v iv=%T\n", iv, iv)
	//值{高江华, 26} 类型student
	//反射是运行时的反射, 这里的iv无法取到内部的值, 因编译不通过
	stu, ok := iv.(student)
	if ok {
		fmt.Printf("stu.Name=%v\n", stu.Name)
	}
	//需要进行类型断言后,才能取到内部的值
}
//声明结构体类型
type student struct {
	Name string
	Age int
}

func main() {
	var num int = 100
	reflect1(num)
	//定义结构体实例
	stu := student{
		Name: "高江华",
		Age: 26,
	}
	reflect2(stu)
}
~~~

Kind()方法

获取变量的类别, 返回一个常量

Type是类型, Kind是类别

~~~go
var num int = 10
//num的Type是int, Kind也是int
var stu Student
//stu的Type是包名.Student, Kind是struct
~~~



通过反射来修改变量, 使用SetXxx() (Xxx就是类型如: SetInt())方法

修改前需要使用对应的指针类型来完成

同时需要使用Elem()方法

~~~go
func main() {
	var num int = 100
	fn := reflect.ValueOf(&num)
	fn.Elem().SetInt(200)
    //Elem()用于获取指针指向的变量
	fmt.Printf("%v\n", num)	//输出200
}
~~~



NumField()方法

返回结构体有多少个字段

~~~go
num := val.Num.Field() 
~~~



reflect.ValueOf().Field()方法

获取到结构体中指定的字段的值, 需断言后才能操作该值



reflect.TypeOf().Field()方法

获取到结构体的tag标签的值

~~~go
type.Field(i).Tag.Get("json") //获取json转换后的tag标签值
~~~



reflect.ValueOf().NumMethod()方法

获取该结构体的方法的个数

~~~go
num := val.NumMethod()
~~~



Method()与Call()方法

获取指定的第几个方法并调用它

~~~go
val.Method(1).Call(nil)
//结构体上的方法的排序依据方法首字母在ascll码表上的大小排序
//call方法传入一个反射类型切片并返回一个反射类型切片
//用于方法调用传参
var params []reflect.Value
params = append(params, reflect.ValueOf(10))
params = append(params, reflect.ValueOf(20))
res := val.Method(0).Call(params)
fmt.Println("res=", res[0].Int())
//调用结构体上的第一个方法并传入两个int参数
//输出方法调用后返回的int值并通过Int()转换类型获取真实的值
~~~



FieldByName()方法

指定结构体的字段名,可做后续修改操作

~~~go
sv.Elem().FieldByName("UserId").SetString("123")
sv.Elem().FieldByName("Name").SetString("高江华")
~~~



reflect.New()方法

返回一个Value类型值,该值持有一个指向类型为type的新申请的零值的指针

~~~go
elem = reflect.New(st)
//st为新申请的零值的指针
//elem是一个指向st的指针
~~~





### 常量

使用关键字const声明

常量定义时必须初始化赋值, 不可修改

只能修饰bool, 数字, 字符串



iota的使用

~~~go
func main() {
	//iota数值递增
	const (
		a = iota
		b
		c, d = iota, iota	//不会递增
	)
	fmt.Println(a,b,c,d) //0,1,2,2
}
~~~



### net包

~~~go
listen, err := net.Listen("tcp", "0.0.0.0:8888")
//使用tcp协议监听本地8888端口
conn, err := listen.Accpet()
//等待连接并返回
//conn下有大量方法使用
conn.RemoteAddr().String()
//获取连接上的客户端地址及端口号
func process(conn net.Conn)  {
	//循环接收客户端发送的数据
	//结束后需关闭连接
	defer conn.Close()
	for {
		//创建接收数据的切片
		buf := make([]byte, 1024)
		//获取客户端的数据
		n, err :=conn.Read(buf)
		if err != nil {
			fmt.Println("客户端退出了")
			return
		}
		//输入获取到的数据
		//需要将切片强转为字符串,n是真实获取到的内容
		fmt.Print(string(buf[:n]))
	}
}
~~~



~~~go
conn, err := net.Dial("tcp", "127.0.0.1:8888")
//创建客户端连接
//conn下有大量方法使用
reader := bufio.NewReader(os.Stdin)
//终端标准输入流实例
line, err := reader.ReadString('\n')
//读取终端中的输入内容
conn.Write([]byte(line))
//发送给服务端,Write参数为切片类型,所以需要强转
~~~

## RPC

1. RPC ( Remote Procedure Call ) 远程过程调用, 简单理解就是一个节点请求另一个节点提供的服务
2. 对应rpc的是本地过程调用, 函数调用是最常见的本地过程调用
3. 将本地过程调用变成远程过程调用会面临各种问题

三大问题:

- Call ID : 远程函数的唯一标识, 让本地知道调用的远程函数是哪种函数
- 序列化与反序列化: 将数据对象设置成某种数据结构进行传输, 通过传输获取到该数据结构的内容反向设置为数据对象进行逻辑处理
- 网络传输: http1.0存在性能问题, 一次性问题. http2.0优化了性能, 可一次性也能长连接



## GRPC

#### protobuf

优点:

1.  性能
   - 压缩性好
   - 序列化和反序列化快 ( 比xml和json快2-100倍 )
   - 传输速度快
2. 便捷性
   - 使用简单 ( 自动生成序列化和反序列化代码 )
   - 维护成本低 ( 只维护proto文件 )
   - 向后兼容 ( 不必破坏旧格式 )
   - 加密性好
3. 跨语言
   - 跨平台
   - 支持各种主流语言

缺点:

1. 通用性差
   - json可以任何语言都支持, 但protobuf需要专门的解析器
2. 自解释性差
   - 只有通过proto文件了解数据结构

下载protobuf

地址：https://github.com/protocolbuffers/protobuf/releases

解压指定文件夹，配置环境变量：bin目录

安装grpc-gateway

地址：https://github.com/grpc-ecosystem/grpc-gateway

~~~
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway
go install github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2
go install google.golang.org/protobuf/cmd/protoc-gen-go
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc
~~~



新建protos/trip.proto

~~~
syntax = "proto3";
package CarRental;
option go_package="./gen";

message Trip {			//以下分别为第几字段
    string start = 1;
    string end = 2;
    int64 duration_dec = 3;
    int64 fee_cent = 4;
}
~~~

新建pb

执行命令

~~~
protoc --go_out=. *.proto
~~~
