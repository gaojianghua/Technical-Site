# Shell
## 查看shell
- 查看当前设备的默认shell
  ~~~shell
  echo $SHELL
  ~~~
- 查看当前使用的shell
  ~~~shell
  ps  #倒数第二行为当前使用的shell
  ~~~
- 查看当前系统安全的所有shell
  ~~~shell
  cat /etc/shells
  ~~~
- 退出Bash环境
  ~~~shell
  exit  #快捷键Ctrl + d
  ~~~
- 查看Bash版本
  ~~~shell
  bash --version
  ~~~
## 基本语法
- 在屏幕中输出文本
  ~~~shell
  echo hello world
  ~~~
- 在屏幕中输出文本
  ~~~shell
  echo hello world
  #参数含义
  -n #取消换行
  -e #解析特殊字符, 如\n为换行
  ~~~
- 组合符&&和||
  ~~~shell
  ls && clear #ls执行成功则执行clear
  ls || clear #ls执行失败则执行clear
  ~~~
- 判断命令的来源
  ~~~shell
  type ls #ls是外部程序
  #参数含义
  -a #查看命令的所有定义
  -t #返回一个命令的类型：别名（alias），关键词（keyword），函数（function），内置命令（builtin）和文件（file）
  ~~~
## 模式扩展
- 关闭扩展
  ~~~shell
  set -o noglob
  #或
  set -f
  ~~~
- 开启扩展
  ~~~shell
  set +o noglob
  #或
  set +f
  ~~~
- 波浪线扩展
  ~~~shell
  echo ~ #波浪线代表用户主目录
  echo ~+ #表示当前所在目录, 等同pwd
  ~~~
- 问号扩展
  ~~~shell
  ls ?.txt ~ #问号匹配文件路径的单个字符, 若文件路径是多个字符,则使用多个问号占位
  ~~~
- 星号扩展
  ~~~shell
  ls *.txt ~ #星号匹配文件路径里任意数量的任意字符, 不会匹配隐藏文件
  echo .* #显示所有隐藏文件
  ls */*.txt #匹配子目录
  ~~~
- 方括号扩展
  ~~~shell
  ls [ab].txt #匹配满足方括号内的单字符的文件
  ls [!ab].txt 或 ls [^ab].txt #匹配不满足方括号内的单字符的文件
  ls */*.txt #匹配子目录
  ~~~
- 范围扩展
  ~~~shell
  ls [a-z].txt #匹配满足a到z之间的单字符的文件
  ~~~
- 大括号扩展
  ~~~shell
  echo {a,b,c} #分别扩展成大括号里的所有值, 遍历式输出
  echo {a..c} #范围连续扩展
  echo {a..c,{b,c,d}} #嵌套扩展
  echo {0..8..2} #指定步长为2, 输出: 0 2 4 6 8
  echo {001..3} #若开头有前导字符则每项都有, 输出: 001 002 003
  ~~~
- 变量扩展
  ~~~shell
  $SHELL 或 ${SHELL} #表示变量
  ${!S*} 或 ${!S@} #返回所有匹配给定字符串S的变量名
  ~~~
- 子命令扩展
  ~~~shell
  $(date) 或 `date` #返回date命令的结果
  $(ls $(pwd)) #子命令嵌套
  $((2 + 2)) #算术运算
  ~~~
- 字符类
  ~~~shell
  #字符类属于文件名扩展
  [[:alnum:]] #匹配任意英文字母与数字
  [[:alpha:]] #匹配任意英文字母
  [[:blank:]] #空格和 Tab 键
  [[:cntrl:]] #ASCII 码 0-31 的不可打印字符
  [[:digit:]] #匹配任意数字 0-9
  [[:graph:]] #A-Z、a-z、0-9 和标点符号
  [[:lower:]] #匹配任意小写字母 a-z
  [[:upper:]] #匹配任意大写字母 A-Z
  [[:print:]] #ASCII 码 32-127 的可打印字符
  [[:punct:]] #标点符号（除了 A-Z、a-z、0-9 的可打印字符）
  [[:space:]] #空格、Tab、LF（10）、VT（11）、FF（12）、CR（13）
  [[:xdigit:]] #16进制字符（A-F、a-f、0-9）
  ~~~
- 查询extglob是否打开
  ~~~shell
  shopt extglob #量词语法在bash的extglob参数打开的情况下才能使用
  ~~~
- 开启extglob
  ~~~shell
  shopt -s extglob
  ~~~
- 量词语法
  ~~~shell
  ?(s) #模式匹配零次或一次, 如: ls abc?(.)txt 输出: abctxt abc.txt
  *(s) #模式匹配零次或多次, 如: ls abc*(.txt) 输出: abctxt abc.txt.txt
  +(s) #模式匹配一次或多次, 如: ls abc+(.txt) 输出: abc.txt abc.txt.txt
  @(s) #只匹配一次模式, 如: ls abc@(.txt|.php) 输出: abc.php abc.txt
  !(s) #匹配给定模式以外的任何内容, 如: ls a!(b).txt 输出: a.txt abb.txt ac.txt
  ~~~
- shopt命令
  ~~~shell
  #用于调整bash的行为
  shopt -s [optionname] #开启某个参数
  shopt -u [optionname] #关闭某个参数
  shopt [optionname] #查看某个参数状态
  #参数含义
  dotglob #使扩展结果包含隐藏文件
  nullglob #使通配符不匹配任何文件名时，返回空字符
  failglob #使通配符不匹配任何文件名时，Bash 会直接报错
  extglob #使Bash支持扩展语法
  nocaseglob #使通配符扩展不区分大小写
  globstar #使**匹配零个或多个子目录。该参数默认是关闭的
  ~~~
- here文档
  ~~~shell
  cat << _EOF_
  _EOF_
  #_EOF_名称可任意取, 
  ~~~
- here字符串
  ~~~shell
  cat <<< 'holle world' #将字符串通过标准输入，传递给命令
  ~~~
  
## 变量
- 显示所有环境变量
  ~~~shell
  env
  或
  printenv
  ~~~
- 常见环境变量
  ~~~shell
  BASHPID #Bash 进程的进程 ID
  BASHOPTS #当前 Shell 的参数，可以用shopt命令修改
  DISPLAY #图形环境的显示器名字，通常是:0，表示 X Server 的第一个显示器
  EDITOR #默认的文本编辑器
  HOME #用户的主目录
  HOST #当前主机的名称
  IFS #词与词之间的分隔符，默认为空格
  LANG #字符集以及语言编码，比如zh_CN.UTF-8
  PATH #由冒号分开的目录列表，当输入可执行程序名后，会搜索这个目录列表
  PS1 #Shell 提示符
  PS2 #输入多行命令时，次要的 Shell 提示符
  PWD #当前工作目录
  RANDOM #返回一个0到32767之间的随机数
  SHELL #Shell 的名字
  SHELLOPTS #启动当前 Shell 的set命令的参数
  TERM #终端类型名，即终端仿真器所用的协议
  UID #当前用户的 ID 编号
  USER #当前用户的用户名
  ~~~
- 显示所有变量（包括环境变量和自定义变量），以及所有的 Bash 函数
  ~~~shell
  set
  ~~~
- 创建变量
  ~~~shell
  #规则如下:
  #字母、数字和下划线字符组成
  #第一个字符必须是一个字母或一个下划线，不能是数字
  #不允许出现空格和标点符号
  variable=value #等号左边是变量名，右边是变量。注意，等号两边不能有空格
  variable="hello world" #如果变量的值包含空格，则必须将值放在引号中
  ~~~
- 读取变量
  ~~~shell
  echo $variable
  ~~~
- 删除变量
  ~~~shell
  unset variable
  或
  variable=''
  ~~~
- 输出变量传递给子shell
  ~~~shell
  export variable #子shell修改变量不会影响父shell
  ~~~
- 特殊变量
  ~~~shell
  $? #上一个命令的退出码: 0表示上个命令执行成功, 不是0表示上个命令执行失败
  $$ #当前shell的进程ID
  $_ #上一个命令的最后一个参数
  $! #最近一个后台执行的异步命令的进程 ID, firefox & 或 echo $!
  $0 #为当前 Shell 的名称
  $- #为当前 Shell 的启动参数
  $# #表示脚本的参数数量
  $@ #表示脚本的参数值
  ~~~
- 变量的默认值
  ~~~shell
  ${varname:-word} #表示变量varname不存在时返回word
  ${varname:=word} #表示变量varname不存在时返回word, 并将varname设置为word
  ${varname:+word} #表示变量varname不存在时返回空值, 存在时返回word, 用于测试变量是否存在
  ${varname:?word} #表示变量varname不存在时打印出varname:word, 并中断脚本的执行, 它的目的是防止变量未定义
  ~~~
- declare命令
  ~~~shell
  #declare命令可以声明一些特殊类型的变量，为变量设置一些限制，比如声明只读类型的变量和整数类型的变量
  #declare命令如果用在函数中，声明的变量只在函数内部有效，等同于local命令
  declare OPTION varname=value
  #OPTION参数如下:
  -a #声明数组变量
  -f #输出所有函数定义
  -F #输出所有函数名
  -i #声明整数变量
  -l #声明变量为小写字母
  -p #查看变量信息
  -r #声明只读变量
  -u #声明变量为大写字母
  -x #该变量输出为环境变量
  ~~~
- readonly命令
  ~~~shell
  #readonly命令等同于declare -r，用来声明只读变量，不能改变变量值，也不能unset变量
  readonly OPTION varname=value
  #OPTION参数如下:
  -a #声明的变量为数组
  -f #声明的变量为函数名
  -p #打印出所有的只读变量
  ~~~
- let命令
  ~~~shell
  #let命令声明变量时，可以直接执行算术表达式
  let foo=1+2
  #let命令的参数表达式如果包含空格，就需要使用引号
  let "foo = 1 + 2"
  #let可以同时对多个变量赋值，赋值表达式之间使用空格分隔
  let "v1 = 1" "v2 = v1++"
  ~~~
  
## 字符串操作
- 获取变量长度
  ~~~shell
  ${#varname}
  ~~~
- 获取子串
  ~~~shell
  ${varname:offset:length} #offset起始下标, length获取的长度
  ${varname: -5:2} #负值起始下标前面必须有空格
  ${varname: -5:-2} #length为负值表示排除从字符串末尾开始的length个字符
  ~~~
- 转换大小写
  ~~~shell
  ${varname^^} #转为大写
  ${varname,,} #转为小写
  ~~~
- 字符串头部的模式匹配
  ~~~shell
  ${varname#/*/} #如果 /*/ 匹配变量 varname 的开头, 则删除最短匹配的部分，返回剩余部分
  ${varname##/*/} #如果 /*/ 匹配变量 varname 的开头, 则删除最长匹配的部分，返回剩余部分
  ~~~
- 字符串尾部的模式匹配
  ~~~shell
  ${varname%/*/} #如果 /*/ 匹配变量 varname 的开头, 则删除最短匹配的部分，返回剩余部分
  ${varname%%/*/} #如果 /*/ 匹配变量 varname 的开头, 则删除最长匹配的部分，返回剩余部分
  ~~~
- 任意位置的模式匹配
  ~~~shell
  ${varname//*//abc} #如果 /*/ 匹配变量 varname 的任意位置, 则最长匹配的那部分替换为abc, 仅替换第一个匹配的
  ${varname///*//abc} #如果 /*/ 匹配变量 varname 的任意位置, 则最长匹配的那部分替换为abc, 所有匹配都替换
  #abc为替换字符串, 若不设置则替换为空, 即删除匹配的字符
  ~~~

## 算术运算
- 算术表达式
  ~~~shell
  echo $((2 + 2)) #会自动忽略内部空格
  #支持的算术运算符
  + #加法
  - #减法
  * #乘法
  / #除法(整除)
  % #取余
  ** #指数
  ++ #自增运算（前缀或后缀）
  -- #自减运算（前缀或后缀）
  ~~~
