# Go
Go（又称 Golang）是由 Google 设计和创建的一种开源编程语言。

[官网地址](https://golang.org/)
## 功能特点
- **快速编译和执行**：Go 是一种静态类型、编译型语言，在编译过程中可以检查代码中的错误，避免在运行时出现大量错误。同时因为 Go 的编译器非常快速，因此开发人员能够更快地进行迭代和测试。

- **并发支持**：Go 在语言级别上提供了原生的并发支持，包括轻量级的协程、通道和锁等技术。这使得在 Go 中编写并发程序变得更容易，也可以充分利用多核处理器的性能优势。

- **简洁易学**：Go 的语法简单、直观，学习曲线较低，因此适合初学者入门。同时，标准库提供了许多强大的功能，避免了需要引入第三方库的情况。

- **高效、可靠**：Go 的设计目标是高效、可靠和安全。它使用内存管理和垃圾回收机制来提高运行时性能和资源利用率，并且具有小型的二进制文件大小和数据结构内存对齐等特性。

- **适合网络编程**：Go 在网络编程方面表现出色，特别适合构建高并发且高效的服务端应用程序。它支持 TCP/IP 和 HTTP 等协议，并且标准库提供了许多网络编程相关的功能。
  
总的来说，Go 是一种适合编写高性能、分布式和并发应用程序的语言。它的快速编译和执行、简洁易学、高效可靠以及网络编程等特点使得它在一些领域中备受欢迎。


### 优势
高并发, Go协程优于PHP多进程, java多线程模式

高性能, 编译后的二进制优于PHP解释型, java虚拟机

高效网络模型, epoll优于PHP的BIO, java的NIO

## 环境配置

1. 下载安装GO

2. 选择放置项目的盘符创建GO文件夹, 并创建三个子文件夹, 分别为:`bin, pkg, src`

3. 在src下创建以你github域名和账号命名的文件夹链, 如: `src\github.com\gaojianghua`

4. 将环境变量中的GOPATH改为对应你的工作目录, 如: `E:\GO`

5. 将`E:\GO\bin`添加到`path`环境变量中

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

## 内置规则
1. 函数名首字母大写才能在其他包引用并使用
2. 变量首字母大写并写在外部才能供其他包引用并使用
3. 包名与文件夹名没有必然联系,因便于开发强烈建议同名处理
4. import包时,路径从$GOPATH的src目录下开始,编译器自动从src下开始查找
5. 在同一包下,不能有相同函数名与全局变量
6. main包有且只能有一个,入口即出口,golang的核心
7. main包最终会编译成可执行文件( go build -o bin/main.exe golang/project/main )

## fmt
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
## 基础类型
类型 | 长度(字节) | 默认值 | 说明
---|--------|-----|---
bool | 1 | false | 
byte | 1 | 0 | uint8
rune | 4 | 0 | Unicode Code Point, int32
int, uint | 4或8 | 0 | 32 或 64 位
int8, uint8 | 1 | 0 | -128 ~ 127, 0 ~ 255，byte是uint8 的别名
int16, uint16 | 2 | 0 | -32768 ~ 32767, 0 ~ 65535
int32, uint32 | 4 | 0 | -21亿~ 21亿, 0 ~ 42亿，rune是int32 的别名
int64, uint64 | 8 | 0 | 
float32 | 4 | 0.0 | 
float64 | 8 | 0.0 | 
complex64 | 8 |  | 
complex128 | 16 |  | 
uintptr | 4或8 |  | 以存储指针的 uint32 或 uint64 整数
array |  |  | 值类型
struct |  |  | 值类型
string |  | "" | UTF-8 字符串
slice |  | nil | 引用类型
map |  | nil | 引用类型
channel |  | nil | 引用类型
interface |  | nil | 接口
function |  | nil | 函数

1. 值类型: 变量直接存储值, 内存通常在栈中分配

- 值类型: int系列, float系列, bool, string, array, struct

2. 引用类型: 变量存储的是地址, 地址对应的空间存储真正的值, 通常在堆中分配, 当没有变量引用这个地址时, 地址对应的空间被视为垃圾, 由GC来回收

- 引用类型: 指针pointer, 切片slice, 字典map, 管道chan, 接口interface

**整型**

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

**特殊整型**

|  类型   |                        描述                        |
| :-----: | :------------------------------------------------: |
|  uint   | 32位操作系统上就是uint32，64位操作系统上就是uint64 |
|   int   |  32位操作系统上就是int32，64位操作系统上就是int64  |
| uintptr |            无符号整型，用于存放一个指针            |

::: tip
在使用`int`和 `uint`类型时，不能假定它是32位或64位的整型，而是考虑`int`和`uint`可能在不同平台上的差异。
:::
::: tip
获取对象的长度的内建`len()`函数返回的长度可以根据不同平台的字节长度进行变化。实际使用中，切片或 map 的元素数量等都可以用`int`来表示。在涉及到二进制传输、读写文件的结构描述时，为了保持文件的结构不会受到不同编译目标平台字节长度的影响，不要使用`int`和 `uint`
:::
**浮点型**

Go语言支持两种浮点型数：`float32`和`float64`。这两种浮点型数据格式遵循`IEEE 754`标准：
- `float32` 的浮点数的最大范围约为 `3.4e38`，可以使用常量定义：`math.MaxFloat32`。
- `float64` 的浮点数的最大范围约为 `1.8e308`，可以使用一个常量定义：`math.MaxFloat64`。

**复数**

complex64和complex128

复数有实部和虚部:
- complex64的实部和虚部为32位。
- complex128的实部和虚部为64位。

**基本数据转String**
~~~go
fmt.Sprintf()

strconv.FormatInt(变量, 进制)

strconv.FormatFloat(变量, 格式, 小数保留几位, 小数类型值如: 64)

strconv.FormatBool(变量)

strconv.Itoa(变量)
~~~
**String转基本数据**
~~~go
Parse系列函数有两个返回值,可以用b,_接收,下划线表示忽略

strconv.ParseBool(变量)

strconv.ParseInt(变量, 进制, 整型位数)

strconv.ParseFloat(变量, 小数类型位数)
~~~

## 常量
- 使用关键字const声明
- 常量定义时必须初始化赋值, 不可修改
- 只能修饰bool, 数字, 字符串

`iota`的使用：
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

## 指针
- 变量的地址存的值, 地址通过: &变量 获取
- 指针变量存储的地址里的值通过: *指针变量 获取
- 指针用来存储内存地址,且只能存一个,重复存储会覆盖掉旧值
- 值类型都有对应的指针类型

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
运算符注意点：
1. 整数相除会舍弃小数位
2. ++和--只能独立使用, 如( a = i++ )是错误的
3. 只有(i++, i--) 没有(++i, --i)
4. %取余的本质是: a % b = a - a / b * b
   
获取控制台输入的值：
~~~go
fmt.Scanf(指定%格式, 变量地址)与fmt.Scanln(变量地址)
~~~

## 流程控制
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
    case "a":
    fmt.Println("a")
    case "b":
    fmt.Println("b")
    case "c", "d":
    fmt.Println("c", "d")
	case score > 20 $$ score < 50:
    fmt.Println("判断")
    fallthrough
    case:
    fmt.Println("0")
    default:
    fmt,Println("以上都不匹配,默认输出")
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
        fmt.Println("123")
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
        fmt.Println("123")
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
## 函数
- 返回值支持命名和多个

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

## 常用函数

字符串：
~~~go
len(str)					
//返回变量的长度, 内置函数(无需引包)
~~~
~~~go
[]rune(str)
//转为切片并返回, 内置函数(无需引包), 解决遍历字符串出现乱码的问题.
~~~
~~~go
strconv.Atoi("123")
//有两个返回值: value和error
//字符串转整数并返回, 需要引包, 只能转数字字符串, 否则返回的为nil零值
~~~
~~~go
strconv.Itoa(123)
//整数转字符串并返回, 需要引包
~~~
~~~go
**[]byte("hello")**
//字符串转byte切片并返回ascll码值
~~~
~~~go
string([]byte{97,98,99})
//将byte切片转为字符串并返回, 内置函数
~~~
~~~go
strconv.FormatInt(123, 2)
//10进制转其他进制并返回
~~~
~~~go
strings.Contains("hello", "he")
//查找子字符串是否在指定的字符串中, 返回布尔值, 需要引包
~~~
~~~go
strings.Count("ababa", "ab")
//统计子字符串在指定的字符串中有多少个并返回, 需要引包
~~~
~~~go
strings.EqualFold("abc", "ABC")
//字符串比较, 不区分大小写(==是区分大小写), 返回布尔值, 需要引包
~~~
~~~go
strings.Index("abc", "b")
//返回子字符串在指定字符串中第一次出现的值的索引值, 需要引包
~~~
~~~go
strings.LastIndex("abc", "b")
//返回子字符串在指定字符串中最后一次出现的值的索引值, 需要引包
~~~
~~~go
strings.Replace("gogohello", "go", "ios", -1)
//指定初始字符串, 要替换的位置子串, 替换后的子串, 替换次数
//-1为替换所有匹配的子串, 不改变初始字符串, 返回替换后的新字符串
~~~
~~~go
strings.Split("go,go,hello",  ",")
//按照指定的字符分割字符串,返回一个包含分割后的多个字符串的数组
//不会改变初始字符串本身
~~~
~~~go
strings.ToLower("Go")
//字符串转小写并返回, 不改变字符串本身
~~~
~~~go
strings.ToUpper("Go")
//字符串转大写并返回, 不改变字符串本身
~~~
~~~go
strings.TrimSpace(" gao ")
//去除字符串两端空格并返回, 不改变字符串本身
~~~
~~~go
strings.Trim("!gao!", "!")
//去掉字符串两端指定的字符并返回, 不改变字符串本身
~~~
~~~go
strings.TrimLeft("!gao", "!")
//去掉字符串左边指定的字符并返回, 不改变字符串本身
~~~
~~~go
strings.TrimRight("gao!", "!")
//去掉字符串右边指定的字符并返回, 不改变字符串本身
~~~
~~~go
strings.HasPrefix("!gao", "!")
//判断字符串是否以指定的字符开头并返回布尔值
~~~
~~~go
strings.HasSuffix("gao!", "!")
//判断字符串是否以指定的字符结束并返回布尔值
~~~
时间日期：
~~~go
now := time.Now()
//获取当前时间并返回
~~~
~~~go
now.Year()
// 获取年
~~~
~~~go
int(now.Month())
// 获取月
~~~
~~~go
now.Day()
// 获取日期
~~~
~~~go
now.Hour()
// 获取小时
~~~
~~~go
now.Minute()
// 获取分钟
~~~
~~~go
now.Second()
// 获取秒
~~~
~~~go
now.Format("2006-01-02 15:04:05")
//格式化日期时间
~~~
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
// 内置的时间常量
~~~
~~~go
time.Sleep()
//休眠即延迟执行, 可使用时间常量来计算需要休眠的时间 
~~~
~~~go
now.Unix()
//获取1970年到现在的秒数时间戳
~~~
~~~go
now.UnixNano()
//获取1970年到现在的纳秒数时间戳
~~~

## 变量初始化函数
~~~go
new()
//传入一个值类型, 创建一个指针, 系统分配指针的地址值以及自身的地址
//指针的地址值的值为传入值类型的零值
~~~
~~~go
make()
//传入一个引用类型, 创建一个指针, 系统分配指针的地址值以及自身的地址
//指针的地址值的值为传入引用类型的零值
~~~

## 错误处理
- defer
- panic
- recover

Go中抛出一个panic异常,然后在defer中通过recover捕获, 然后正常处理：
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

**自定义错误**

1. errors.New("错误说明"), 返回error类型的值为一个错误

2. panic内置函数, 接收一个interface()类型的值, 可接收error类型变量，输出错误信息并退出程序：
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
	
## 结构体
- 结构体元素的地址是连续的, 是值类型
- 在方法调用中遵守值拷贝传递的方式
- 若要修改结构体变量的值, 可以通过结构体指针的方式去处理

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
**方法与函数总结**
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
## Map
`map`是一种无序的基于`key:value`的数据结构，Go语言中的 `map` 是引用类型，必须初始化才能使用。

语法定义：
~~~go
map[KeyType]ValueType

//KeyType:表示键的类型。
//ValueType:表示键对应的值的类型。
~~~
`map`类型的变量默认初始值为`nil`，需要使用`make()`函数来分配内存。语法为：
~~~go
make(map[KeyType]ValueType, [cap])

// 其中cap表示map的容量，该参数虽然不是必须的，但是我们应该在初始化map的时候就为其指定一个合适的容量。
~~~
基本用法：
~~~go
scoreMap := make(map[string]int, 8)	// 初始化map，并设置容量8
scoreMap["张三"] = 90	// 向map变量中插入数据
~~~
~~~go
// 声明时填充元素
userInfo := map[string]string{
	"username": "pprof.cn",
	"password": "123456",
}
~~~
判断`map`中键是否存在：
~~~go
scoreMap := make(map[string]int)
// 如果key存在ok为true,v为对应的值；不存在ok为false,v为值类型的零值
v, ok := scoreMap["张三"]
~~~
遍历`map`：
~~~go
scoreMap := make(map[string]int)
scoreMap["张三"] = 90
scoreMap["小明"] = 100
scoreMap["王五"] = 60
// 需要使用 for range 遍历
for k, v := range scoreMap {
	fmt.Println(k, v)
}
~~~
使用 `delete()` 删除 `map` 中的键值对：
~~~go
delete(scoreMap, "小明")// 将键为'小明'的数据从map变量scoreMap中删除
~~~
按照指定顺序遍历`map`：
~~~go
rand.Seed(time.Now().UnixNano()) //初始化随机数种子

var scoreMap = make(map[string]int, 200)

for i := 0; i < 100; i++ {
	key := fmt.Sprintf("stu%02d", i) //生成stu开头的字符串
	value := rand.Intn(100)          //生成0~99的随机整数
	scoreMap[key] = value
}
//取出map中的所有key存入切片keys
var keys = make([]string, 0, 200)
for key := range scoreMap {
	keys = append(keys, key)
}
//对切片进行排序
sort.Strings(keys)
//按照排序后的key遍历map
for _, key := range keys {
	fmt.Println(key, scoreMap[key])
}
~~~
元素为`map`类型的切片：
~~~go
var mapSlice = make([]map[string]string, 3)
for index, value := range mapSlice {
	fmt.Printf("index:%d value:%v\n", index, value)
}
fmt.Println("after init")
// 对切片中的map元素进行初始化
mapSlice[0] = make(map[string]string, 10)
mapSlice[0]["name"] = "王五"
mapSlice[0]["password"] = "123456"
mapSlice[0]["address"] = "红旗大街"
for index, value := range mapSlice {
	fmt.Printf("index:%d value:%v\n", index, value)
}
~~~
值为切片类型的`map`:
~~~go
var sliceMap = make(map[string][]string, 3)
fmt.Println(sliceMap)
fmt.Println("after init")
key := "中国"
value, ok := sliceMap[key]
if !ok {
	value = make([]string, 0, 2)
}
value = append(value, "北京", "上海")
sliceMap[key] = value
fmt.Println(sliceMap)
~~~

## 接口
接口( `interface` )类型可以定义一组方法且不需要实现, 不能包含任何变量, 当某个自定义类型使用的时候, 再将其实现出来。

接口是一个或多个方法签名的集合。任何类型的方法集中只要拥有该接口'对应的全部方法'签名。就表示它 "实现" 了该接口，无须在该类型上显式声明实现了哪个接口。这称为`Structural Typing`。所谓对应方法，是指有相同名称、参数列表 (不包括参数名) 以及返回值。当然，该类型还可以有其他方法。

- 接口只有方法声明，没有实现，没有数据字段。
- 接口可以匿名嵌入其他接口，或嵌入到结构中。
- 对象赋值给接口时，会发生拷贝，而接口内部存储的是指向这个复制品的指针，既无法修改复制品的状态，也无法获取指针。
- 只有当接口存储的类型和对象都为`nil`时，接口才等于`nil`。
- 接口调用不会做`receiver`的自动转换。
- 接口同样支持匿名字段方法。
- 接口也可实现类似`OOP`中的多态。
- 空接口可以作为任何类型数据的容器。
- 一个类型可实现多个接口。
- 接口命名习惯以 `er` 结尾。

语法如下:
- 接口名：使用`type`将接口定义为自定义的类型名。`Go`语言的接口在命名时，一般会在单词后面添加`er`，如有写操作的接口叫Writer，有字符串功能的接口叫`Stringer`等。接口名最好要能突出该接口的类型含义。
- 方法名：当方法名首字母是大写且这个接口类型名首字母也是大写时，这个方法可以被接口所在的包（`package`）之外的代码访问。
- 参数列表、返回值列表：参数列表和返回值列表中的参数变量名可以省略。
~~~go
type 接口类型名 interface{
	方法名1( 参数列表1 ) 返回值列表1
	方法名2( 参数列表2 ) 返回值列表2
	…
}
~~~
值接收者和指针接收者实现接口的区别:
~~~go
type Mover interface {
    move()
}

type dog struct {}
~~~
~~~go
// 值接收者实现接口
func (d dog) move() {
    fmt.Println("狗会动")
}
func main() {
    var x Mover
    var wangcai = dog{} // 旺财是dog类型
    x = wangcai         // x可以接收dog类型
    var fugui = &dog{}  // 富贵是*dog类型
    x = fugui           // x可以接收*dog类型
    x.move()
}
// 使用值接收者实现接口之后，不管是dog结构体还是结构体指针*dog类型的变量都可以赋值给该接口变量。因为Go语言中有对指针类型变量求值的语法糖，dog指针fugui内部会自动求值*fugui。
~~~
~~~go
// 指针接收者实现接口
func (d *dog) move() {
    fmt.Println("狗会动")
}
func main() {
    var x Mover
    var wangcai = dog{} // 旺财是dog类型
    x = wangcai         // x不可以接收dog类型
    var fugui = &dog{}  // 富贵是*dog类型
    x = fugui           // x可以接收*dog类型
}
// 此时实现Mover接口的是*dog类型，所以不能给x传入dog类型的wangcai，此时x只能存储*dog类型的值。
~~~
## 协程

通过go关键字启动协程

协程依赖于系统内核

协程是主线程的分支, 依赖于主线程, 若主线程执行完成, 协程会自动结束

## 管道
- 先进先出
- 遍历管道需使用 `for range`
- 容量固定, 需要用 `make` 声明再使用
- 管道只读: `var Chan <-  chan int`
- 管道只写: `var Chan chan <-  int`
- `select case`语法解决管道阻塞问题

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

## 文件操作
`os.Create`: 文件不存在则创建, 文件存在则清空文件内容
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
`os.Open`: 以只读方式打开文件,文件不存在则打开失败
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
`os.OpenFile`: (适用于操作目录) 以只读, 只写, 读写方式打开文件, 文件不存在则打开失败

参数1: 文件名

参数2:
- O_RDONLY		只读
- O_WRONLY       只写
- O_RDWR            读写

参数3: ( 对于目录传: os.ModeDir )
1. 没有任何权限
2. 执行权限 ( 如果是可执行文件, 是可以运行的 )
3. 写权限
4. 写权限与执行权限
5. 读权限
6. 读权限与执行权限
7. 读权限与写权限
8. 读权限, 写权限, 执行权限
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
- `f.WriteString()`: 返回写入的字符个数, 从起始位置开始, 会覆盖原有内容

- `f.Seek()`: 修改文件的读写指针位置

	- 参数1: 偏移量
    	- 正: 向文件尾部偏移
    	- 负: 向文件头部偏移
  
	- 参数2: 偏移起始位置
    	- `io.SeekStart`: 文件起始位置
    	- `io.SeekCurrent`: 文件当前位置
        - `io.SeekEnd`: 文件结尾位置

- `f.WriteAt()`: 在文件指定偏移位置, 写入`[]byte`, 通常搭配`Seek()`
  - 参数1:	待写入的数据
  - 参数2:	偏移量

创建带缓冲区的读取器
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
## 泛型
要定义泛型函数或类型，可以使用类型 `T` 关键字，后跟用方括号[]括起来的泛型形参的名称。例如，要创建一个接受任意类型的`slice`并返回其第一个元素的泛型函数，可以这样定义:
~~~go
func First[T any](items []T) T {
    return items[0]
}
// [T any]表示类型参数T，它表示任意类型。any关键字表示T类型可以是任何有效类型。
~~~
可以使用任何切片类型调用`First`函数，该函数将返回该切片的第一个元素。例如:
~~~go
func func1() {
	intSlice := []int{1, 2, 3, 4, 5}
	firstInt := First[int](intSlice) // returns 1

	println(firstInt)

	stringSlice := []string{"apple", "banana", "cherry"}
	firstString := First[string](stringSlice) // returns "apple"

	println(firstString)
}

func First[T any](items []T) T {
	return items[0]
}
~~~
编写函数`SumGenerics`，它对各种数字类型(如`int`、`int16`、`int32`、`int64`、`int8`、`float32`和`float64`)执行加法操作：
~~~go
func SumGenerics[T int | int16 | int32 | int64 | int8 | float32 | float64](a, b T) T {
    return a + b
}

func func2() {
	sumInt := SumGenerics[int](2, 3)

	sumFloat := SumGenerics[float32](2.5, 3.5)

	sumInt64 := SumGenerics[int64](10, 20)

	fmt.Println(sumInt)   // returns 5
	fmt.Println(sumFloat) // returns 6.0
	fmt.Println(sumInt64) // returns 30
}
~~~
泛型可以用于任意数据类型的序列化和反序列化，实现序列化和反序列化函数:
~~~go
type Person struct {
 	Name    string
 	Age     int
 	Address string
}

func Serialize[T any](data T) ([]byte, error) {
  	buffer := bytes.Buffer{}
  	encoder := gob.NewEncoder(&buffer)
  	err := encoder.Encode(data)
  	if err != nil {
    	return nil, err
  	}
  	return buffer.Bytes(), nil
}

func Deserialize[T any](b []byte) (T, error) {
	buffer := bytes.Buffer{}
	buffer.Write(b)
	decoder := gob.NewDecoder(&buffer)
	var data T
	err := decoder.Decode(&data)
	if err != nil {
		return data, err
	}
	return data, nil
}
// 函数Serialize和Deserialize，它们利用Go的gob包将任意数据类型转换为字节，反之亦然。

func DeserializeUsage() {
	// 创建一个Person实例
	person := Person{
		Name:    "John",
		Age:     30,
		Address: "123 Main St.",
	}
	// 将person对象转换为字节数组
	serialized, err := Serialize(person)
	if err != nil {
    	panic(err)
	}
	// 将字节数组转换回Person对象
	deserialized, err := Deserialize[Person](serialized)
	if err != nil {
    	panic(err)
  	}
  
	fmt.Printf("Name: %s, Age: %d, Address: %s", deserialized.Name, deserialized.Age, deserialized.Address)
	// Output: Name: John, Age: 30, Address: 123 Main St.
}
~~~
自定义验证器编写一个通用的`Validate`函数:
~~~go
// 接受任意类型T的值并返回一个错误
type Validator[T any] func(T) error
// 使用自定义验证器执行数据验证
func Validate[T any](data T, validators ...Validator[T]) error {
	for _, validator := range validators {
		err := validator(data)
		if err != nil {
			return err
		}
	}
	return nil
}
// 自定义验证器：确保字符串不为空
func StringNotEmpty(s string) error {
	if len(strings.TrimSpace(s)) == 0 {
		return fmt.Errorf("string cannot be empty")
	}
	return nil
}
// 自定义验证器：检查整数是否在指定范围内
func IntInRange(num int, min, max int) error {
	if num < min || num > max {
		return fmt.Errorf("number must be between %d and %d", min, max)
	}
	return nil
}

func main() {
	person := Person{
		Name:    "John",
		Age:     30,
		Address: "123 Main St.",
	}
	
	err := Validate(
		person, // 实例
		func(p Person) error {	// 验证 name 是否为空
			return StringNotEmpty(p.Name)
		}, 
		func(p Person) error {	// 验证 age 是否在0~120之内
			return IntInRange(p.Age, 0, 120)
		}
	)
	
	if err != nil {
		println(err.Error())
		panic(err)
	}
	
	println("Person is valid")
}
~~~
通过使用泛型和自定义验证器，`Validate`函数允许跨不同数据类型进行灵活和可重用的数据验证，增强代码可重用性，并使添加或修改验证规则变得容易。

再写一个登录验证的示例：
~~~go
// 登录表单的结构体
type LoginForm struct {
    Username string
    Password string
}

// 接受任意类型T的值并返回一个错误
type Validator[T any] func(T) error

// 使用自定义验证器执行数据验证
func Validate[T any](data T, validators ...Validator[T]) error {
	for _, validator := range validators {
		err := validator(data)
		if err != nil {
			return err
		}
	}
	return nil
}

// 自定义验证器：确保字符串不为空
func StringNotEmpty(s string) error {
	if len(strings.TrimSpace(s)) == 0 {
		return fmt.Errorf("string cannot be empty")
	}
	return nil
}

// 给 LoginForm 实现一个 Validate 方法
func (f *LoginForm) Validate() error {
    return Validate(f,
        func(l *LoginForm) error {
            return StringNotEmpty(l.Username)	// 验证用户名
        },
        func(l *LoginForm) error {
            return StringNotEmpty(l.Password)	// 验证密码
        },
    )
}

func main() {
    loginForm := LoginForm{
        Username: "John",
        Password: "123",
    }

    err := loginForm.Validate() // 调用校验方法
    if err != nil {
        println(err.Error())
        panic(err)
    }

    println("Login form is valid")
}
~~~

## 反射
反射是指在程序运行期对程序本身进行访问和修改的能力

变量的内在机制：
- 变量包含类型信息和值信息 `var arr [10]int arr[0] = 10`
- 类型信息：是静态的元信息，是预先定义好的
- 值信息：是程序运行过程中动态改变的

反射的使用：
- `reflect`包封装了反射相关的方法
- 获取类型信息：`reflect.TypeOf`，是静态的
- 获取值信息：`reflect.ValueOf`，是动态的

空接口与反射:
- 反射可以在运行时动态获取程序的各种详细信息
- 反射获取`interface`类型信息
  	~~~go
  	//反射获取interface类型信息

	func reflect_type(a interface{}) {
		t := reflect.TypeOf(a)
		fmt.Println("类型是：", t)
		// kind()可以获取具体类型
		k := t.Kind()
		fmt.Println(k)
	    switch k {
			case reflect.Float64:
				fmt.Printf("a is float64\n")
			case reflect.String:
				fmt.Println("string")
		}
	}

	func main() {
		var x float64 = 3.4
		reflect_type(x)
	}
  	~~~
- 反射获取`interface`值信息
	~~~go
	//反射获取interface值信息

	func reflect_value(a interface{}) {
		v := reflect.ValueOf(a)
		fmt.Println(v)
		k := v.Kind()
		fmt.Println(k)
		switch k {
		case reflect.Float64:
			fmt.Println("a是：", v.Float())
		}
	}

	func main() {
		var x float64 = 3.4
		reflect_value(x)
	}
	~~~
- 反射修改值信息
	~~~go
	//反射修改值
	func reflect_set_value(a interface{}) {
		v := reflect.ValueOf(a)
		k := v.Kind()
		switch k {
		case reflect.Float64:
			// 反射修改值
			v.SetFloat(6.9)
			fmt.Println("a is ", v.Float())
		case reflect.Ptr:
			// Elem()获取地址指向的值
			v.Elem().SetFloat(7.9)
			fmt.Println("case:", v.Elem().Float())
			// 地址
			fmt.Println(v.Pointer())
		}
	}

	func main() {
		var x float64 = 3.4
		// 反射认为下面是指针类型，不是float类型
		reflect_set_value(&x)
		fmt.Println("main:", x)
	}
	~~~
结构体与反射:
- 查看类型、字段和方法
	~~~go
	// 定义结构体
	type User struct {
		Id   int
		Name string
		Age  int
	}

	// 绑方法
	func (u User) Hello() {
		fmt.Println("Hello")
	}

	// 传入interface{}
	func Poni(o interface{}) {
		t := reflect.TypeOf(o)
		fmt.Println("类型：", t)
		fmt.Println("字符串类型：", t.Name())
		// 获取值
		v := reflect.ValueOf(o)
		fmt.Println(v)
		// 可以获取所有属性
		// 获取结构体字段个数：t.NumField()
		for i := 0; i < t.NumField(); i++ {
			// 取每个字段
			f := t.Field(i)
			fmt.Printf("%s : %v", f.Name, f.Type)
			// 获取字段的值信息
			// Interface()：获取字段对应的值
			val := v.Field(i).Interface()
			fmt.Println("val :", val)
		}
		fmt.Println("=================方法====================")
		for i := 0; i < t.NumMethod(); i++ {
			m := t.Method(i)
			fmt.Println(m.Name)
			fmt.Println(m.Type)
		}

	}

	func main() {
		u := User{1, "zs", 20}
		Poni(u)
	}
	~~~
- 查看匿名字段
	~~~go
	// 定义结构体
	type User struct {
		Id   int
		Name string
		Age  int
	}

	// 匿名字段
	type Boy struct {
		User
		Addr string
	}

	func main() {
		m := Boy{User{1, "zs", 20}, "bj"}
		t := reflect.TypeOf(m)
		fmt.Println(t)
		// Anonymous：匿名
		fmt.Printf("%#v\n", t.Field(0))
		// 值信息
		fmt.Printf("%#v\n", reflect.ValueOf(m).Field(0))
	}
	~~~
- 修改结构体的值
	~~~go
	// 定义结构体
	type User struct {
		Id   int
		Name string
		Age  int
	}

	// 修改结构体值
	func SetValue(o interface{}) {
		v := reflect.ValueOf(o)
		// 获取指针指向的元素
		v = v.Elem()
		// 取字段
		f := v.FieldByName("Name")
		if f.Kind() == reflect.String {
			f.SetString("kuteng")
		}
	}

	func main() {
		u := User{1, "5lmh.com", 20}
		SetValue(&u)
		fmt.Println(u)
	}
	~~~
- 调用方法
	~~~go
	// 定义结构体
	type User struct {
		Id   int
		Name string
		Age  int
	}

	func (u User) Hello(name string) {
		fmt.Println("Hello：", name)
	}

	func main() {
		u := User{1, "5lmh.com", 20}
		v := reflect.ValueOf(u)
		// 获取方法
		m := v.MethodByName("Hello")
		// 构建一些参数
		args := []reflect.Value{reflect.ValueOf("6666")}
		// 没参数的情况下：var args2 []reflect.Value
		// 调用方法，需要传入方法的参数
		m.Call(args)
	}
	~~~
- 获取字段的tag
	~~~go
	type Student struct {
		Name string `json:"name1" db:"name2"`
	}

	func main() {
		var s Student
		v := reflect.ValueOf(&s)
		// 类型
		t := v.Type()
		// 获取字段
		f := t.Elem().Field(0)
		fmt.Println(f.Tag.Get("json"))
		fmt.Println(f.Tag.Get("db"))
	}
	~~~
案例:
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
获取反射对象的底层类型的方法:
~~~go
var num int = 10
value := reflect.ValueOf(num)

fmt.Println(value.Kind()) // 输出：int
~~~
通过反射来修改变量，使用SetXxx()方法，Xxx就是类型，比如: SetInt()：
~~~go
// 修改前需要使用对应的指针类型来完成
// 同时需要使用Elem()方法
func main() {
	var num int = 100
	fn := reflect.ValueOf(&num)
	fn.Elem().SetInt(200)
    //Elem()用于获取指针指向的变量
	fmt.Printf("%v\n", num)	//输出200
}
~~~
获取结构体（`struct`）类型的值 `val` 的字段数量的方法:
~~~go
type Person struct {
    Name string
    Age  int
}

p := Person{Name: "Alice", Age: 30}

// 获取结构体字段数量
num := reflect.ValueOf(p).NumField()

fmt.Println(num) // 输出：2
~~~
获取结构体类型值的指定字段的值，需要先进行类型断言来将其转换为具体的类型，然后才能对字段的值进行操作：
~~~go
type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	
	value := reflect.ValueOf(p)
	
	nameField := value.Field(0)
	ageField := value.Field(1)
	
	if nameField.Kind() == reflect.String {
		fmt.Println(nameField.String()) // 输出：Alice
	}
	
	if ageField.Kind() == reflect.Int {
		age := ageField.Int()
		fmt.Println(age) // 输出：30
	}
}
~~~
获取结构体类型的指定字段的反射信息：
~~~go
type Person struct {
	Name string
	Age  int
}

func main() {
	t := reflect.TypeOf(Person{})
	
	nameField, _ := t.FieldByName("Name")
	ageField, _ := t.FieldByName("Age")
	
	fmt.Println(nameField.Name) // 输出：Name
	fmt.Println(ageField.Name)  // 输出：Age
}
~~~
获取类型的方法数量：
~~~go
type Person struct {
	Name string
	Age  int
}

func (p Person) SayHello() {
	fmt.Println("Hello, my name is", p.Name)
}

func (p Person) GetAge() int {
	return p.Age
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	
	value := reflect.ValueOf(p)
	
	// NumMethod() 只能应用于接收者为值或指针类型的方法，不能应用于接口类型。
	numMethods := value.NumMethod()
	
	fmt.Println(numMethods) // 输出：2
}
~~~
获取指定索引位置的方法的反射值: 
~~~go
//结构体上的方法的排序依据方法首字母在ascll码表上的大小排序
//call方法传入一个反射类型切片并返回一个反射类型切片
//用于方法调用传参
var params []reflect.Value
params = append(params, reflect.ValueOf(10))
params = append(params, reflect.ValueOf(20))
res := params.Method(0).Call(params)
fmt.Println("res=", res[0].Int())
//调用结构体上的第一个方法并传入两个int参数
//输出方法调用后返回的int值并通过Int()转换类型获取真实的值
~~~
根据字段名获取结构体类型值的指定字段的值:
~~~go
type Person struct {
	Name string
	Age  int
}

func main() {
	p := Person{Name: "Alice", Age: 30}
	
	value := reflect.ValueOf(p)
	
	nameField := value.FieldByName("Name")
	ageField := value.FieldByName("Age")
	
	fmt.Println(nameField) // 输出：Alice
	fmt.Println(ageField)  // 输出：30
}
~~~
创建一个指定类型的指针值:
~~~go
type Person struct {
	Name string
	Age  int
}

func main() {
	pType := reflect.TypeOf(Person{})

	// New() 方法返回一个 reflect.Value 对象，该对象包含了一个指向新创建对象的指针值
	ptr := reflect.New(pType)
	
	fmt.Println(ptr) // 输出：&{{ } 0}

	// 如果你想获取指针值所指向的对象，可以使用 Elem() 方法来间接访问
	person := ptr.Elem().Interface().(Person)
	fmt.Println(person) // 输出：{ 0}
}
~~~

## net包
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

## 并发模型
并发模型是一种用于描述和处理并发计算的抽象模型。它提供了一种方式来组织和管理并发系统中的多个任务或进程，以实现并发执行和协作。

并发模型的目标是解决并发计算中的竞态条件、死锁、资源争用等问题，以提高系统的性能、可靠性和可扩展性。

常见的并发模型包括：

1. **线程模型**：基于线程的并发模型，通过创建和管理多个线程来实现并发执行。线程之间可以共享内存，但需要注意同步和互斥机制以避免竞态条件。

2. **进程模型**：基于进程的并发模型，通过创建和管理多个独立的进程来实现并发执行。进程之间通常通过消息传递进行通信，可以避免竞态条件和共享内存带来的问题。

3. **事件驱动模型**：基于事件和回调的并发模型，通过事件驱动的方式处理并发任务。当事件发生时，相应的回调函数会被触发执行，从而实现并发处理。

4. **数据流模型**：基于数据流的并发模型，通过数据流的传递和处理来实现并发执行。数据流模型将计算任务表示为数据流图，任务之间通过数据流进行通信和协作。

5. **Actor 模型**：基于 `actor` 的并发模型，每个 `actor` 是一个独立的计算单元，通过消息传递进行通信和交互。`Actor` 模型强调封装状态和行为，避免共享状态带来的问题。
::: tip
不同的并发模型适用于不同的应用场景和需求。选择适合的并发模型可以提高系统的性能、可靠性和可维护性。
:::

### Actor模型
Actor模型是一种并发计算模型，用于描述并发系统中的实体和它们之间的通信。

Actor 模型最初由计算机科学家 Carl Hewitt 在 1973 年提出，它将并发系统中的实体称为 `actors`，系统中的每个实体被称为一个 `Actor`，每个 `Actor` 都是一个独立的计算单元，具有自己的状态和行为。`Actor` 之间通过消息传递进行通信和交互。

在Actor模型中，每个Actor都是独立的，它们之间没有共享的内存。Actor之间通过异步消息传递进行通信，一个Actor可以向其他Actor发送消息，也可以接收其他Actor发送的消息。当一个Actor接收到消息时，它可以根据消息内容和自身的状态来决定如何处理消息，并可能改变自身的状态或向其他Actor发送消息。

Actor模型的特点包括：

1. **并发性**： 每个Actor都可以独立地执行，不受其他Actor的影响，从而实现并发执行。

2. **无共享状态**： 每个Actor都有自己的状态，不与其他Actor共享内存，避免了共享状态带来的并发问题。

3. **异步消息传递**： Actor之间通过异步消息传递进行通信，消息的发送和接收是非阻塞的，提高了系统的响应性能。

4. **面向对象**： 每个Actor都可以看作是一个对象，具有自己的状态和行为，可以封装数据和方法。
::: tip
**总结一下：通过使用Actor模型，可以简化并发系统的设计和实现，提高系统的可扩展性和可维护性。同时，Actor模型也能够有效地处理并发问题，避免了传统并发编程中常见的共享状态和锁竞争的问题。**
:::

### 对比Go的GMP模型和Actor模型
Go的GMP（Goroutine, M, P）模型和Actor模型都是用于并发编程的模型，但在一些方面有所不同。

Go的GMP模型是Go语言并发编程的基础，它通过 `goroutine`（轻量级线程）和调度器（`scheduler`）来实现并发。GMP模型中的 `goroutine` 是Go语言中的并发执行单元，它可以独立地执行函数或方法。调度器负责将 `goroutine` 分配给线程（P），以便并行执行。线程（P）是操作系统线程的抽象，它负责执行 `goroutine`。M（`Machine`）是Go语言运行时系统的一部分，它管理线程的创建和销毁，并提供与操作系统的交互。GMP模型的优点是轻量级的 `goroutine` 和高效的调度器，使得并发编程变得简单且高效。

Actor模型是一种并发编程模型，它通过将并发执行的单元（称为actor）之间的通信和状态封装在一起来实现并发。在Actor模型中，每个actor都是独立的实体，它们通过消息传递进行通信。每个actor都有自己的状态和行为，并且只能通过接收和发送消息来与其他actor进行通信。**Actor模型的优点是提供了一种结构化的方式来处理并发，避免了共享状态和锁的问题。**

虽然GMP模型和Actor模型都是用于并发编程，但它们在实现方式和语义上有所不同。**GMP模型更加底层，直接操作线程和 `goroutine`，适用于需要更细粒度控制的场景。而Actor模型更加高级，通过消息传递来实现并发，适用于需要更结构化和可扩展的场景。**
::: tip
总结起来，GMP模型适用于Go语言中的并发编程，提供了轻量级的 `goroutine` 和高效的调度器；**而 `Actor` 模型适用于一般的并发编程，通过消息传递来实现并发。**
:::

### epoll模型
`epoll`是一种在`Linux`系统中用于高效处理大量并发连接的`I/O`事件通知机制。它具有以下特点：

1. **支持高并发**：`epoll`使用事件驱动的方式，能够同时处理大量的并发连接，适用于高并发的网络应用场景。

2. **高效的事件通知机制**：`epoll`采用了基于事件驱动的方式，当有事件发生时，内核会将事件通知给应用程序，而不需要应用程序轮询检查事件是否发生，从而减少了系统资源的消耗。

3. **支持边缘触发和水平触发**：`epoll`提供了两种工作模式，边缘触发（`EPOLLET`）和水平触发（`EPOLLIN/EPOLLOUT`）。边缘触发模式只在状态发生变化时通知应用程序，而水平触发模式则在状态可读或可写时都会通知应用程序。

4. **支持多种I/O事件类型**：`epoll`可以同时监控多种`I/O`事件类型，包括读事件、写事件、错误事件等。

5. **高效的内核数据结构**：`epoll`使用红黑树和双向链表等高效的数据结构来管理大量的文件描述符，提高了事件的处理效率。
::: tip
总之，`epoll`模型具有高并发、高效的事件通知机制和多种`I/O`事件类型的支持，适用于处理大量并发连接的网络应用场景。
:::

## Etcd
Etcd 是一个分布式键值存储系统，用于可靠地存储和检索数据。它是由 `CoreOS` 开发并开源的，现在是 `Cloud Native Computing Foundation`（`CNCF`）的一个孵化项目。

Etcd 提供了一个简单的接口，允许应用程序以键值对的形式存储和检索数据。它的设计目标是提供高可用性、一致性和分布式的数据存储解决方案。

Etcd 的主要特点包括：

1. **分布式存储**：`Etcd` 使用 `Raft` 一致性算法来实现数据的分布式存储。它将数据分布在多个节点上，以提供高可用性和容错性。

2. **强一致性**：`Etcd` 保证在分布式环境下的强一致性。它使用 `Raft` 算法来确保数据的一致性和可靠性，即使在节点故障或网络分区的情况下也能保持数据的一致性。

3. **高可用性**：`Etcd` 支持多节点部署，可以容忍节点故障。当节点发生故障时，`Etcd` 会自动进行故障转移，保证数据的可用性。

4. **监视和通知**：`Etcd` 提供了监视功能，可以监视指定键的变化，并在变化发生时发送通知。这使得应用程序可以实时获取数据的变化。

5. **安全性**：`Etcd` 支持基于 `TLS` 的安全通信，并提供访问控制机制，可以限制对数据的访问和操作。
::: tip
`Etcd` 在分布式系统中有广泛的应用，特别是在容器编排系统（如 `Kubernetes`）中被广泛使用，用于存储和共享集群的配置信息、服务发现和状态信息等。它提供了一个可靠和高效的分布式存储解决方案，为构建可扩展的分布式应用程序提供了支持。 
:::

### Etcd保证数据一致性
`Etcd` 通过使用 `Raft` 一致性算法来保证数据的一致性。 `Raft` 是一种分布式一致性算法，它将集群中的节点分为`Leader`、`Follower`和`Candidate`三种角色，通过选举机制选出`Leader`节点来处理客户端的请求。

当客户端向`Etcd`发送写请求时，`Leader`节点会将该请求复制到其他节点的日志中，并等待大多数节点确认接收到该日志条目。一旦大多数节点确认接收到该日志条目，`Leader`节点会将该请求应用到自己的状态机中，并将结果返回给客户端。同时，`Leader`节点会通知其他节点将该请求应用到自己的状态机中。

如果`Leader`节点失去连接或崩溃，剩余的节点会通过选举机制选出新的`Leader`节点。新的`Leader`节点会根据自己的日志和其他节点的日志进行比较，保证自己的日志是最新的，并将缺失的日志条目复制给其他节点，以保持数据的一致性。

通过`Raft`算法，`Etcd`能够保证数据在集群中的一致性，并且在`Leader`节点失效时能够快速选举出新的`Leader`节点，保证系统的可用性和数据的一致性。
