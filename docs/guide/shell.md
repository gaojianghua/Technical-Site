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
- 数值的进制
  ~~~shell
  number #没有任何特殊表示法的数字是十进制数（以10为底）
  0number #八进制数。
  0xnumber #十六进制数。
  base#number #base进制的数
  ~~~
- 位运算
  ~~~shell
  $((1 << 2)) #位左移运算,把一个数字的所有位向左移动指定的位
  $((1 >> 2)) #位右移运算，把一个数字的所有位向右移动指定的位
  $((1 & 2))  #位的“与”运算，对两个数字的所有位执行一个AND操作
  $((1 | 2))  #位的“或”运算，对两个数字的所有位执行一个OR操作
  $((1 ~ 2))  #位的“否”运算，对一个数字的所有位取反
  $((1 ^ 2))  #位的异或运算（exclusive or），对两个数字的所有位执行一个异或操作
  ~~~
- 逻辑运算
  ~~~shell
  <   #小于
  >   #大于
  <=  #小于或相等
  >=  #大于或相等
  ==  #相等
  !=  #不相等
  &&  #逻辑与
  ||  #逻辑或
  !   #逻辑否
  expr1?expr2:expr3 #三元条件运算符,若表达式expr1的计算结果为非零值（算术真）,则执行表达式expr2,否则执行表达式expr3
  ~~~
- 赋值运算
  ~~~shell
  $((parameter = value))    #简单赋值。
  $((parameter += value))   #等价于$((parameter = parameter + value))
  $((parameter -= value))   #等价于$((parameter = parameter – value))
  $((parameter *= value))   #等价于$((parameter = parameter * value))
  $((parameter /= value))   #等价于$((parameter = parameter / value))
  $((parameter %= value))   #等价于$((parameter = parameter % value))
  $((parameter <<= value))  #等价于$((parameter = parameter << value))
  $((parameter >>= value))  #等价于$((parameter = parameter >> value))
  $((parameter &= value))   #等价于$((parameter = parameter & value))
  $((parameter |= value))   #等价于$((parameter = parameter | value))
  $((parameter ^= value))   #等价于$((parameter = parameter ^ value))
  ~~~
- 求值运算
  ~~~shell
  echo $((foo = 1 + 2, 3 * 4)) #在$((...))内部,逗号是求值运算符,执行前后两个表达式,并返回后一个表达式的值
  ~~~
- expr命令
  ~~~shell
  expr 3 + 2 #支持算术运算,可以不使用((...))语法
  ~~~

## 行操作

- 设置当前快捷键库
  ~~~shell
  #Bash 内置了 Readline 库, 默认采用 Emacs 快捷键
  set -o vi #设置使用vi的快捷键
  set editing-mode vi #永久性更改编辑模式,将命令写在~/.inputrc文件,这个文件是 Readline 的配置文件
  ~~~
- 关闭Readline
  ~~~shell
  bash --noediting
  ~~~
- 光标移动(Emacs模式)
  ~~~shell
  Ctrl + a  #移到行首
  Ctrl + b  #向行首移动一个字符，与左箭头作用相同
  Ctrl + e  #移到行尾
  Ctrl + f  #向行尾移动一个字符，与右箭头作用相同
  Alt + f   #移动到当前单词的词尾
  Alt + b   #移动到当前单词的词首
  ~~~
- 清空屏幕
  ~~~shell
  Ctrl + l
  ~~~
- 编辑操作
  ~~~shell
  Ctrl + d        #删除光标位置的字符（delete）
  Ctrl + w        #删除光标前面的单词
  Ctrl + t        #光标位置的字符与它前面一位的字符交换位置（transpose）
  Alt + t         #光标位置的词与它前面一位的词交换位置（transpose）
  Alt + l         #将光标位置至词尾转为小写（lowercase）
  Alt + u         #将光标位置至词尾转为大写（uppercase）
  Ctrl + k        #剪切光标位置到行尾的文本
  Ctrl + u        #剪切光标位置到行首的文本
  Alt + d         #剪切光标位置到词尾的文本
  Alt + Backspace #剪切光标位置到词首的文本
  Ctrl + y        #在光标位置粘贴文本
  ~~~
- 自动补全
  ~~~shell
  Tab         #完成自动补全
  Alt + ?     #列出可能的补全，与连按两次 Tab 键作用相同
  Alt + /     #尝试文件路径补全
  Ctrl + x /  #先按Ctrl + x，再按/，等同于Alt + ?，列出可能的文件路径补全
  Alt + !     #命令补全
  Ctrl + x !  #先按Ctrl + x，再按!，等同于Alt + !，命令补全
  Alt + ~     #用户名补全
  Ctrl + x ~  #先按Ctrl + x，再按~，等同于Alt + ~，用户名补全
  Alt + $     #变量名补全
  Ctrl + x $  #先按Ctrl + x，再按$，等同于Alt + $，变量名补全
  Alt + @     #主机名补全
  Ctrl + x @  #先按Ctrl + x，再按@，等同于Alt + @，主机名补全
  Alt + *     #在命令行一次性插入所有可能的补全
  Alt + Tab   #尝试用.bash_history里面以前执行命令，进行补全
  ~~~
- 操作历史
  ~~~shell
  #退出当前 Shell 的时候，Bash 会将用户在当前 Shell 的操作历史写入~/.bash_history文件，该文件默认储存500个操作
  echo $HISTFILE      #显示.bash_history完整路径
  history             #输出.bash_history文件的全部内容
  !e                  #找出操作历史中最近的一条以e开头的命令并执行
  export HISTTIMEFORMAT='%F %T ' && history   #显示每个操作的时间
  export HISTSIZE=0   #设置保存历史的操作数量, 设置0则不保存操作历史
  ~~~

## 目录堆栈

- 返回上一次的目录
  ~~~shell
  cd -
  ~~~
- pushd和popd命令
  ~~~shell
  pushd dirname #进入目录dirname,并将当前目录放入堆栈, 再将dirname目录放入堆栈
  popd          #不带有参数时,会移除堆栈的顶部记录,并进入新的栈顶目录（即原来的第二条目录
  #参数如下:
  -n        #只操作堆栈,不改变目录
  pushd +3  #将从栈顶算起的3号目录（从0开始）移动到栈顶,同时切换到该目录
  popd -3  #将从栈底算起的3号目录（从0开始）移动到栈顶,同时切换到该目录
  popd +3  #删除从栈顶算起的3号目录（从0开始）,不改变当前目录
  popd -3  #删除从栈底算起的3号目录（从0开始）,不改变当前目录
  ~~~
- dirs命令
  ~~~shell
  dirs #命令可以显示目录堆栈的内容
  #参数如下:
  -c #清空目录栈。
  -l #用户主目录不显示波浪号前缀，而打印完整的目录
  -p #每行一个条目打印目录栈，默认是打印在一行
  -v #每行一个条目，每个条目之前显示位置编号（从0开始）
  +N #N为整数，表示显示堆顶算起的第 N 个目录，从零开始
  -N #N为整数，表示显示堆底算起的第 N 个目录，从零开始
  ~~~

## 脚本入门

- shebang行(脚本首行)
  ~~~shell
  #!/bin/bash 
  #指定脚本解释器:/bin/bash, #!读shebang
  ~~~
- 执行权限和路径
  ~~~shell
  $ chmod +x script.sh        # 给所有用户执行权限
  $ chmod +rx script.sh 或 chmod 755 script.sh     # 给所有用户读权限和执行权限
  $ chmod u+rx script.sh      # 只给脚本拥有者读权限和执行权限
  #脚本调用时,一般需要指定脚本的路径（比如path/script.sh）。如果将脚本放在环境变量$PATH指定的目录中，就不需要指定路径了。因为 Bash 会自动到这些目录中，寻找是否存在同名的可执行文件。建议在主目录新建一个~/bin子目录，专门存放可执行脚本，然后把~/bin加入$PATH
  export PATH=$PATH:~/bin     # 将~/bin添加到$PATH的末尾
  source ~/.bashrc            # 刷新环境变量
  ~~~
- env命令
  ~~~shell
  #!/usr/bin/env node
  #env命令总是指向/usr/bin/env文件，或者说，这个二进制文件总是在目录/usr/bin
  #让 Shell 查找$PATH环境变量里面第一个匹配的node
  #参数如下:
  -i, --ignore-environment  #不带环境变量启动
  -u, --unset=NAME          #从环境变量中删除一个变量
  --help                    #显示帮助
  --version                 #输出版本信息
  ~~~
- 脚本参数
  ~~~shell
  script.sh word1 word2 word3   #调用脚本时后面可以带有参数
  # 脚本文件内部，可以使用特殊变量，引用这些参数
  $0        #脚本文件名，即script.sh。
  $1~$9     #对应脚本的第一个参数到第九个参数。脚本的参数多于9个，那么第10个参数可以用${10}的形式引用，以此类推
  $#        #参数的总数。
  $@        #全部的参数，参数之间使用空格分隔。
  $*        #全部的参数，参数之间使用变量$IFS值的第一个字符分隔，默认为空格，但是可以自定义
  ~~~
- shift命令
  ~~~shell
  #shift命令移除脚本参数
  shift 3   #指定移除第三个参数, $4向前进一位变成$3
  ~~~
- getopts命令
  ~~~shell
  #getopts命令用在脚本内部，可以解析复杂的脚本命令行参数，通常与while循环一起使用，取出脚本所有的带有前置连词线（-）的参数
  ~~~
- 配置项参数终止符
  ~~~shell
  cat -- --file   #--它的作用是告诉 Bash，在它后面的参数开头的-和--不是配置项，只能当作实体参数解释
  ~~~
- read命令
  ~~~shell
  echo -n "输入一些文本 > "   #让用户输入文本
  read text                 #将用户输入的内容存入text变量中, 可接收用户输入多个值,用逗号分隔,用多个变量接收
  #更多规则:
  #如果用户的输入项少于read命令给出的变量数目，那么额外的变量值为空。
  #如果用户的输入项多于定义的变量，那么多余的输入项会包含到最后一个变量中。
  #如果read命令之后没有定义变量名，那么环境变量REPLY会包含所有的输入

  filename='/etc/hosts'
  while read myline
  do
  echo "$myline"
  done < $filename
  #done命令后面的定向符<，将文件内容导向read命令，每次读取一行，存入变量myline，直到文件读取完毕
  
  #参数如下:
  -t  #指定超时时间,超时将放弃等待,继续向下执行
  -p  #指定用户输入前的提示信息
  -a  #把用户的输入赋值给一个数组，从零号位置开始
  -n  #只读取若干个字符作为变量值，而不是整行读取
  -e  #允许用户输入的时候，使用readline库提供的快捷键，比如自动补全
  -d delimiter #定义字符串delimiter的第一个字符作为用户输入的结束，而不是一个换行符
  -r           #raw 模式，表示不把用户输入的反斜杠字符解释为转义字符
  -s           #使得用户的输入不显示在屏幕上，这常常用于输入密码或保密信息
  -u fd        #使用文件描述符fd作为输入
  ~~~
- IFS变量
  ~~~shell
  #可以通过自定义环境变量IFS（内部字段分隔符，Internal Field Separator 的缩写），修改分隔标志
  #IFS的赋值命令和read命令写在一行，这样的话，IFS的改变仅对后面的命令生效，该命令执行后IFS会自动恢复原来的值
  ~~~

## 条件判断

- if判断
  ~~~shell
  echo -n "输入一个1到3之间的数字（包含两端）> "
  read character
  if [ "$character" = "1" ]; then
    echo 1
  elif [ "$character" = "2" ]; then
    echo 2
  elif [ "$character" = "3" ]; then
    echo 3
  else
    echo 输入不符合要求
  fi
  #if主判断条件, elif次判断条件, fi结束符, then满足判断条件的主体内容
  ~~~
- case判断
  ~~~shell
  case expression in
    pattern )
      commands ;;
    pattern )
      commands ;;
    * )
      commands ;;
  esac
  #expression为表达式, pattern匹配表达式的多个结果, commands为满足条件的主体内容, 两个分号;;为结束条件块, *匹配其他未设置条件
  
  #支持通配符如下:
  a)      #匹配a。
  a|b)    #匹配a或b。
  [[:alpha:]])    #匹配单个字母。
  ???)    #匹配3个字符的单词。
  *.txt)  #匹配.txt结尾。
  *)      #匹配任意输入，通过作为case结构的最后一个模式
  
  #Bash 4.0之前，case结构只能匹配一个条件，然后就会退出case结构。Bash 4.0之后，允许匹配多个条件，这时可以用;;&终止每个条件块。
  #示例:
  read -n 1 -p "Type a character > "
  echo
  case $REPLY in
  [[:upper:]])    echo "'$REPLY' is upper case." ;;&
  [[:lower:]])    echo "'$REPLY' is lower case." ;;&
  [[:alpha:]])    echo "'$REPLY' is alphabetic." ;;&
  [[:digit:]])    echo "'$REPLY' is a digit." ;;&
  [[:graph:]])    echo "'$REPLY' is a visible character." ;;&
  [[:punct:]])    echo "'$REPLY' is a punctuation symbol." ;;&
  [[:space:]])    echo "'$REPLY' is a whitespace character." ;;&
  [[:xdigit:]])   echo "'$REPLY' is a hexadecimal digit." ;;&
  esac
  #输出:
  Type a character > a
  'a' is lower case.
  'a' is alphabetic.
  'a' is a visible character.
  'a' is a hexadecimal digit.
  ~~~
- test命令
  ~~~shell
  #if结构的判断条件，一般使用test命令，有三种形式:
  test expression
  [ expression ]
  [[ expression ]]
  #规则:
  #三种形式是等价的, 区别:[[]]支持正则, 另外两种不支持
  #expression为表达式, 为真则返回0, 为假则返回1
  #[]和[[]]两种写法, 与内部的表达式expression之间必须有空格
  ~~~

### 判断表达式

- 文件判断
  ~~~shell
  [ -a file ]   #如果 file 存在，则为true。
  [ -b file ]   #如果 file 存在并且是一个块（设备）文件，则为true。
  [ -c file ]   #如果 file 存在并且是一个字符（设备）文件，则为true。
  [ -d file ]   #如果 file 存在并且是一个目录，则为true。
  [ -e file ]   #如果 file 存在，则为true。
  [ -f file ]   #如果 file 存在并且是一个普通文件，则为true。
  [ -g file ]   #如果 file 存在并且设置了组 ID，则为true。
  [ -G file ]   #如果 file 存在并且属于有效的组 ID，则为true。
  [ -h file ]   #如果 file 存在并且是符号链接，则为true。
  [ -k file ]   #如果 file 存在并且设置了它的“sticky bit”，则为true。
  [ -L file ]   #如果 file 存在并且是一个符号链接，则为true。
  [ -N file ]   #如果 file 存在并且自上次读取后已被修改，则为true。
  [ -O file ]   #如果 file 存在并且属于有效的用户 ID，则为true。
  [ -p file ]   #如果 file 存在并且是一个命名管道，则为true。
  [ -r file ]   #如果 file 存在并且可读（当前用户有可读权限），则为true。
  [ -s file ]   #如果 file 存在且其长度大于零，则为true。
  [ -S file ]   #如果 file 存在且是一个网络 socket，则为true。
  [ -t fd ]     #如果 fd 是一个文件描述符，并且重定向到终端，则为true。 这可以用来判断是否重定向了标准输入／输出／错误。
  [ -u file ]   #如果 file 存在并且设置了 setuid 位，则为true。
  [ -w file ]   #如果 file 存在并且可写（当前用户拥有可写权限），则为true。
  [ -x file ]   #如果 file 存在并且可执行（有效用户有执行／搜索权限），则为true。
  [ FILE1 -nt FILE2 ]   #如果 FILE1 比 FILE2 的更新时间更近，或者 FILE1 存在而 FILE2 不存在，则为true。
  [ FILE1 -ot FILE2 ]   #如果 FILE1 比 FILE2 的更新时间更旧，或者 FILE2 存在而 FILE1 不存在，则为true。
  [ FILE1 -ef FILE2 ]   #如果 FILE1 和 FILE2 引用相同的设备和 inode 编号，则为true。
  
  #示例
  FILE=~/.bashrc
  if [ -e "$FILE" ]; then
    if [ -f "$FILE" ]; then
      echo "$FILE is a regular file."
    fi
    if [ -d "$FILE" ]; then
      echo "$FILE is a directory."
    fi
    if [ -r "$FILE" ]; then
      echo "$FILE is readable."
    fi
    if [ -w "$FILE" ]; then
      echo "$FILE is writable."
    fi
    if [ -x "$FILE" ]; then
      echo "$FILE is executable/searchable."
    fi
  else
    echo "$FILE does not exist"
    exit 1
  fi
  #$FILE要放在双引号之中，这样可以防止变量$FILE为空，从而出错。因为$FILE如果为空，这时[ -e $FILE ]就变成[ -e ]，这会被判断为真。而$FILE放在双引号之中，[ -e "$FILE" ]就变成[ -e "" ]，这会被判断为假
  ~~~
- 字符串判断
  ~~~shell
  [ string ]                #如果string不为空（长度大于0），则判断为真。
  [ -n string ]             #如果字符串string的长度大于零，则判断为真。
  [ -z string ]             #如果字符串string的长度为零，则判断为真。
  [ string1 = string2 ]     #如果string1和string2相同，则判断为真。
  [ string1 == string2 ]    #等同于[ string1 = string2 ]。
  [ string1 != string2 ]    #如果string1和string2不相同，则判断为真。
  [ string1 '>' string2 ]   #如果按照字典顺序string1排列在string2之后，则判断为真。
  [ string1 '<' string2 ]   #如果按照字典顺序string1排列在string2之前，则判断为真。
  #注意，test命令内部的>和<，必须用引号引起来（或者是用反斜杠转义）。否则，它们会被 shell 解释为重定向操作符
  ~~~
- 整数判断
  ~~~shell
  [ integer1 -eq integer2 ]   #如果integer1等于integer2，则为true。
  [ integer1 -ne integer2 ]   #如果integer1不等于integer2，则为true。
  [ integer1 -le integer2 ]   #如果integer1小于或等于integer2，则为true。
  [ integer1 -lt integer2 ]   #如果integer1小于integer2，则为true。
  [ integer1 -ge integer2 ]   #如果integer1大于或等于integer2，则为true。
  [ integer1 -gt integer2 ]   #如果integer1大于integer2，则为true。
  ~~~
- 正则判断
  ~~~shell
  [[ string1 =~ regex ]]    #=~是正则比较运算符
  ~~~
- test 判断的逻辑运算
  ~~~shell
  &&    #表示: 与，也可使用参数-a。
  ||    #表示: 或，也可使用参数-o。
  !     #表示: 非。
  
  #示例:
  if [ ! \( $INT -ge $MIN_VAL -a $INT -le $MAX_VAL \) ]; then
    echo "$INT is outside $MIN_VAL to $MAX_VAL."
  else
    echo "$INT is in range."
  fi
  #使用否定操作符!时，test命令内部使用的圆括号，必须使用引号或者转义，否则会被 Bash 解释
  ~~~

## 循环

- while循环
  ~~~shell
  while condition; do
    commands
  done
  #condition条件满足, 则会一直循环
  ~~~
- until循环
  ~~~shell
  until condition; do
    commands
  done
  #与while想反, condition条件不满足, 则会一直循环
  ~~~
- for...in循环
  ~~~shell
  for variable in list; do
    commands
  done
  #list为数组, variable为list的每一项
  ~~~
- for循环
  ~~~shell
  for (( i=0; i<5; i=i+1 )); do
    echo $i
  done
  ~~~
- break
  ~~~shell
  for number in 1 2 3 4 5 6
  do
    echo "number is $number"
    if [ "$number" = "3" ]; then
      break
    fi
  done
  #$number等于3时, 执行break, 会立即结束循环不在执行, 输出: 1 2 3
  ~~~
- continue
  ~~~shell
  for number in 1 2 3 4 5 6
  do
    if [ "$number" = "3" ]; then
      continue
    fi
    echo "number is $number"
  done
  #$number等于3时, 执行continue, 会立即结束本轮循环, 继续执行后面的循环, 输出: 1 2 4 5 6
  ~~~
- select结构
  ~~~shell
  select name in list
  do
    commands
  done
  #Bash 会对select依次进行下面的处理:
  # 1. select生成一个菜单，内容是列表list的每一项，并且每一项前面还有一个数字编号。
  # 2. Bash 提示用户选择一项，输入它的编号。
  # 3. 用户输入以后，Bash 会将该项的内容存在变量name，该项的编号存入环境变量REPLY。如果用户没有输入，就按回车键，Bash 会重新输出菜单，让用户选择。
  # 4. 执行命令体commands。
  # 5. 执行结束后，回到第一步，重复这个过程
  ~~~

## 函数

- 创建函数
  ~~~shell
  fn() {} 或 function fn() {}    #两种方式是等价的
  ~~~
- 删除函数
  ~~~shell
  unset -f functionName
  ~~~
- 查看函数
  ~~~shell
  declare -f    #查看当前 Shell 定义的所有函数
  declare -f  functionName  #查看当前 Shell 定义的指定的函数
  declare -F    #查看当前 Shell 定义的函数名，不含函数体
  ~~~
- 参数变量
  ~~~shell
  #函数的参数变量与脚本参数变量是一致的
  ~~~
- return
  ~~~shell
  #return命令用于从函数返回一个值。函数执行到这条命令，就不再往下执行了，直接返回了
  ~~~
- 全局变量和局部变量 local 命令
  ~~~shell
  #函数内直接声明的变量，属于全局变量，整个脚本都可以读取
  #local命令声明的变量，只在函数体内有效，函数体外没有定义
  ~~~

## 数组

- 创建数组
  ~~~shell
  #数组可以采用逐个赋值的方法创建, 也可采用一次性赋值
  array[0] = 0
  array[1] = 1
  array[2] = 2
  或
  array = (0 1 2)
  
  array=([2]=c [0]=a [1]=b)  #指定下标赋值
  mp3s=( *.mp3 )    #可以使用通配符
  ~~~
- 读取数组
  ~~~shell
  echo ${array[0]}  #读取数组下标为0的值
  echo ${foo[@]}    #@和*是数组的特殊索引，表示返回数组的所有成员
  #在for in循环中一定要用双引号, 否则会出错
  for i in "${names[@]}"; do
    echo $i
  done
  #拷贝数组,添加新成员
  hobbies=( "${activities[@]}" diving )
  ~~~
- 数组长度
  ~~~shell
  ${#array[*]}
  ${#array[@]}
  #上面命令均可获取数组长度
  echo ${#a[100]}   #返回数组第100项的字符串的长度
  ~~~
- 提取数组序号
  ~~~shell
  ${!array[@]}
  或
  ${!array[*]}  #可以返回数组的成员序号，即哪些位置是有值的
  ~~~
- 提取数组成员
  ~~~shell
  echo ${food[@]:index:length}  #提取指定起始位置和长度的数组成员, index起始下标, length要提取的成员数量  
  ~~~
- 追加数组成员
  ~~~shell
  foo+=(d e f)  #可使用+=运算符直接添加 
  ~~~
- 删除数组
  ~~~shell
  unset foo[2]  #删除数组下标为2的一项
  foo[1]=''     #设置为空, 可以隐藏该项, 不会删除
  unset foo     #清空数组
  ~~~
- 关联数组
  ~~~shell
  #使用declare -A声明关联数组
  declare -A colors
  colors["red"]="#ff0000"
  colors["green"]="#00ff00"
  colors["blue"]="#0000ff"
  #访问数组的某一项
  echo ${colors["blue"]}
  ~~~

## set shopt

- set
  ~~~shell
  set -u
  或
  set -o nounset
  #脚本在头部加上它，遇到不存在的变量就会报错，并停止执行
  set -x
  或
  set -o xtrace
  #运行结果之前，先输出执行的那一行命令
  set +x
  #关闭命令输出
  ~~~
- Bash 的错误处理
  ~~~shell
  command || exit 1      #只要command有非零返回值(命令执行失败 )，脚本就会停止执行
  #如果停止执行之前需要完成多个操作, 可采用下面的方式:
  # 写法一
  command || { echo "command failed"; exit 1; }
  # 写法二
  if ! command; then echo "command failed"; exit 1; fi
  # 写法三
  command
  if [ "$?" -ne 0 ]; then echo "command failed"; exit 1; fi
  #命令有继承关系, 前一个命令成功才执行后一个命令
  command1 && command2
  
  set -e 或 set -o errexit    #只要发生错误, 就终止执行
  set +e    #关闭-e
  command || true  #使得该命令即使执行失败，脚本也不会终止执行
  set -o pipefail  #只要一个子命令失败，整个管道命令就失败，脚本就会终止执行
  set -E  #设置了-e会导致函数内错误不会被trap捕获, 使用-E可以纠正这个行为
  ~~~
- 其他参数
  ~~~shell
  set -n 或 set -o noexec    #运行命令，只检查语法是否正确。
  set -f 或 set -o noglob    #示不对通配符进行文件名扩展。
  set -v 或 set -o verbose   #表示打印 Shell 接收到的每一行输入。
  set -o noclobber           #防止使用重定向运算符>覆盖已经存在的文件
  # -f 和 -v 可以分别使用 +f 和 +v 关闭
  ~~~
- set 总结
  ~~~shell
  # 写法一
  set -Eeuxo pipefail
  # 写法二
  set -Eeux
  set -o pipefail
  #上面写法建议放在shell脚本的头部
  ~~~
- shopt
  ~~~shell
  shopt     #可以查看所有参数，以及它们各自打开和关闭的状态
  shopt globstar     #指定参数名, 查看该参数的状态
  #命令参数如下:
  -s    #用来开启某个参数的状态
  -u    #用来关闭某个参数的状态
  -q    #查询某个参数是否打开, 返回状态为0表示打开, 为1表示关闭
  ~~~

## 脚本除错
- 常见错误
  ~~~shell
  [[ -d $dir_name ]] && cd $dir_name && rm *  #进入某目录进行文件删除操作, 该避免目录为空, 导致删除了所有文件
  ~~~
- bush -x参数
  ~~~shell
  #! /bin/bash -x
  #在执行脚本内的命令前, 会打印该命令
  ~~~
  
## mktemp trap
- 临时文件的安全问题
  ~~~shell
  #直接创建临时文件，尤其在/tmp目录里面，往往会导致安全问题
  #首先，/tmp目录是所有人可读写的，任何用户都可以往该目录里面写文件。创建的临时文件也是所有人可读的
  #其次，如果攻击者知道临时文件的文件名，他可以创建符号链接，链接到临时文件，可能导致系统运行异常。攻击者也可能向脚本提供一些恶意数据。因此，临时文件最好使用不可预测、每次都不一样的文件名，防止被利用
  #最后，临时文件使用完毕，应该删除。但是，脚本意外退出时，往往会忽略清理临时文件
  #生成临时文件应该遵循下面的规则:
  #创建前检查文件是否已经存在。
  #确保临时文件已成功创建。
  #临时文件必须有权限的限制。
  #临时文件要使用不可预测的文件名。
  #脚本退出时，要删除临时文件（使用trap命令）。
  ~~~
- mktemp
  ~~~shell
  #mktemp命令就是为安全创建临时文件而设计的。虽然在创建临时文件之前，它不会检查临时文件是否存在，但是它支持唯一文件名和清除机制，因此可以减轻安全攻击的风险
  mktemp  #创建一个随机名的临时文件，仅本人可读写
  TMPFILE=$(mktemp) || exit 1   #为了确保临时文件创建成功，mktemp命令后面最好使用 OR 运算符（||），保证创建失败时退出脚本
  trap 'rm -f "$TMPFILE"' EXIT  #为了保证脚本退出时临时文件被删除，可以使用trap命令指定退出时的清除操作
  #命令参数如下:
  -d    #创建一个临时目录
  -p    #指定临时文件所在的目录。默认是使用$TMPDIR环境变量指定的目录，如果这个变量没设置，那么使用/tmp目录
  -t    #指定临时文件的文件名模板，模板的末尾必须至少包含三个连续的X字符，表示随机字符，建议至少使用六个X。默认的文件名模板是tmp.后接十个随机字符
  ~~~
- trap
  ~~~shell
  #trap命令用来在 Bash 脚本中响应系统信号
  #注意，trap命令必须放在脚本的开头。否则，它上方的任何命令导致脚本退出，都不会被它捕获
  trap -l #列出所有信号
  trap [动作] [信号] ...  #动作为bash脚本命令
  #常用信号如下:
  HUP   #编号1，脚本与所在的终端脱离联系。
  INT   #编号2，用户按下 Ctrl + C，意图让脚本终止运行。
  QUIT   #编号3，用户按下 Ctrl + 斜杠，意图退出脚本。
  KILL   #编号9，该信号用于杀死进程。
  TERM   #编号15，这是kill命令发出的默认信号。
  EXIT   #编号0，这不是系统信号，而是 Bash 脚本特有的信号，不管什么情况，只要退出脚本就会产生。
  ~~~