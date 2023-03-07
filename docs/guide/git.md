# Git
## 常用命令

- 生成SSH秘钥
  ~~~shell
  ssh-keygen -t rsa -C "email"
  cd ~/.ssh # 里面有一个文件名为id_rsa.pub,把里面的内容复制到git库的我的SSHKEYs中
  ~~~
- 初始化git本地仓库
  ~~~shell
  git init
  ~~~
- 存入暂存区
  ~~~shell
  git add .
  ~~~
- 提交至本地仓库
  ~~~shell
  git commit -m "初始化"
  ~~~
- 查看分支
  ~~~shell
  git branch # 查看本地分支
  git branch -a # 查看全部分支
  git branch -r # 查看远程分支
  ~~~
- 建立远程仓库连接
  ~~~shell
  git remote add origin <url>
  ~~~
- 删除远程仓库关联
  ~~~shell
  git remote rm origin
  ~~~
- 重设远程仓库连接
  ~~~shell
  git remote set-url origin <url>
  ~~~
- 克隆远程仓库项目到本地
  ~~~shell
  git clone <url>
  ~~~
- 设置git用户信息
  ~~~shell
  git config user.name ""
  git config user.email ""
  ~~~
- 显示日志
  ~~~shell
  git log
  ~~~
- 显示操作日志
  ~~~shell
  git reflog
  ~~~
- 列出当前配置
  ~~~shell
  git config --list
  ~~~
- 列出Repository配置
  ~~~shell
  git config --local --list
  ~~~
- 列出全局配置
  ~~~shell
  git config --global --list
  ~~~
- 列出系统配置
  ~~~shell
  git config --system --list
  ~~~
- 切换分支
  ~~~shell
  git checkout <branch-name>
  ~~~
- 创建并切换到新建分支
  ~~~shell
  git checkout -b <branch-name>
  ~~~
- 推送新分支并创建远程分支
  ~~~shell
  git push --set-upstream origin <branch-name>
  ~~~
- 删除分支
  ~~~shell
  git branch -d <branch-name>
  ~~~
- 当前分支与指定分支合并
  ~~~shell
  git merge <branch-name>
  ~~~
- 查看哪些分支已经合并到当前分支
  ~~~shell
  git branch --merged
  ~~~
- 查看哪些分支没有合并到当前分支
  ~~~shell
  git branch --no-merged
  ~~~
- 查看各个分支最后一个提交对象的信息
  ~~~shell
  git branch -v
  ~~~
- 删除远程分支
  ~~~shell
  git push origin -d <branch-name>
  ~~~
- 重命名分支
  ~~~shell
  git branch -m <oldbranch-name> <newbranch-name>
  ~~~
- 拉取远程分支并创建本地分支
  ~~~shell
  git checkout -b <local-branch-name> origin/<remote-branch-name> # 方案一
  git fetch origin <remote-branch-name>:<local-branch-name> # 方案二
  ~~~
- 将某个远程主机的更新，全部取回本地
  ~~~shell
  git fetch <origin-name>
  ~~~
- 取回远程主机下的指定分支的更新
  ~~~shell
  git fetch <origin-name> <branch-name>
  ~~~
- 取回指定远程分支到指定本地分支
  ~~~shell
  git fetch origin <remote-branch-name>:<local-branch-name>
  ~~~
- 撤销工作区的修改
  ~~~shell
  git checkout --
  ~~~
- 暂存区文件撤销
  ~~~shell
  git reset HEAD
  ~~~
- 版本回退
  ~~~shell
  git reset [--soft | --mixed | --hard] <commitId>
  --soft # 撤销 commit提交
  --mixed # 撤销 commit提交和add添加暂存区
  --hard # 撤销并舍弃版本号之后的提交记录
  ~~~
- 撤销某个提交,生成新的commitId,原有提交记录保留
  ~~~shell
  git revert <commitId>
  ~~~
- 指定版本号应用在当前分支
  ~~~shell
  git cherry-pick <commitId>
  ~~~
- 添加改动到缓存栈(已add暂存未commit提交的改动)
  ~~~shell
  git stash save -a "msg"
  ~~~
- 删除指定ID的缓存
  ~~~shell
  git stash drop <stash@{ID}>
  ~~~
- 查看缓存栈列表
  ~~~shell
  git stash list
  ~~~
- 清空缓存栈
  ~~~shell
  git stash clear
  ~~~
- 将缓存栈中最新的内容拉出来应用到当前分支上,且会删除记录
  ~~~shell
  git stash pop
  ~~~
- 将缓存栈中最新的内容拉出来应用到当前分支上,不会删除记录
  ~~~shell
  git stash apply
  ~~~
- 查看缓存栈中最新保存的stash和当前⽬录的差异,显⽰做了哪些改动,默认显示第一个缓存
  ~~~shell
  git stash show
  ~~~
- 比较工作区与暂存区
  ~~~shell
  git diff
  ~~~
- 比较暂存区与本地最近一次commit提交的内容
  ~~~shell
  git diff --cached
  ~~~
- 比较工作区与本地最近一次commit提交的内容
  ~~~shell
  git diff HEAD
  ~~~
- 比较两个commit之间差异
  ~~~shell
  git diff <commitId> <commitId>
  ~~~

### Bash 启动环境
- Session
  ~~~shell
  #用户每次使用 Shell，都会开启一个与 Shell 的 Session（对话）。
  #Session 有两种类型：登录 Session 和非登录 Session，也可以叫做 login shell 和 non-login shell。
  ~~~
- 登录Session
  ~~~shell
  #登录 Session 是用户登录系统以后，系统为用户开启的原始 Session，通常需要用户输入用户名和密码进行登录
  #登录 Session 一般进行整个系统环境的初始化，启动的初始化脚本依次如下：
  /etc/profile    #所有用户的全局配置脚本。
  /etc/profile.d  #目录里面所有.sh文件
  ~/.bash_profile #用户的个人配置脚本。如果该脚本存在，则执行完就不再往下执行。
  ~/.bash_login   #如果~/.bash_profile没找到，则尝试执行这个脚本（C shell 的初始化脚本）。如果该脚本存在，则执行完就不再往下执行。
  ~/.profile      #如果~/.bash_profile和~/.bash_login都没找到，则尝试读取这个脚本（Bourne shell 和 Korn shell 的初始化脚本）。
  #注意：
  #Linux 发行版更新的时候，会更新/etc里面的文件，比如/etc/profile，因此不要直接修改这个文件。
  #如果想修改所有用户的登陆环境，就在/etc/profile.d目录里面新建.sh脚本。
  #如果想修改你个人的登录环境，一般是写在~/.bash_profile里面。下面是一个典型的.bash_profile文件。
  ~~~
- 非登录Session
  ~~~shell
  #非登录 Session 是用户进入系统以后，手动新建的 Session，这时不会进行环境初始化。
  #比如，在命令行执行bash命令，就会新建一个非登录 Session。
  #非登录 Session 的初始化脚本依次如下：
  /etc/bash.bashrc  #对全体用户有效。
  ~/.bashrc         #仅对当前用户有效。
  #注意：
  #对用户来说，~/.bashrc通常是最重要的脚本。非登录 Session 默认会执行它，而登录 Session 一般也会通过调用执行它。每次新建一个 Bash 窗口，就相当于新建一个非登录 Session，所以~/.bashrc每次都会执行。
  #执行脚本相当于新建一个非互动的 Bash 环境，但是这种情况不会调用~/.bashrc。
  bash --norc   #禁止在非登录 Session 执行~/.bashrc脚本
  bash --rcfile testrc   #指定另一个脚本代替.bashrc
  ~~~
- bash_logout
  ~~~shell
  #~/.bash_logout脚本在每次退出 Session 时执行，通常用来做一些清理工作和记录工作，比如删除临时文件，记录用户在本次 Session 花费的时间。
  ~~~
- 启动选项
  ~~~shell
  #为了方便 Debug，有时在启动 Bash 的时候，可以加上启动参数
  -n    #不运行脚本，只检查是否有语法错误。
  -v    #输出每一行语句运行结果前，会先输出该行语句。
  -x    #每一个命令处理之前，先输出该命令，再执行该命令。
  ~~~
- 键盘绑定
  ~~~shell
  #Bash 允许用户定义自己的快捷键。
  #全局的键盘绑定文件默认为/etc/inputrc
  #你可以在主目录创建自己的键盘绑定文件.inputrc文件。
  #如果定义了这个文件，需要在其中加入下面这行，保证全局绑定不会被遗漏。
  $include /etc/inputrc
  #.inputrc文件里面的快捷键，可以像这样定义，"\C-t":"pwd\n"表示将Ctrl + t绑定为运行pwd命令。
  ~~~

### 命令提示符
- 环境变量 PS1
  ~~~shell
  #命令提示符通常是美元符号$，对于根用户则是井号#。这个符号是环境变量PS1决定的
  echo $PS1   #查看当前命令提示符的定义
  #Bash 允许用户自定义命令提示符，只要改写这个变量即可。
  #改写后的PS1，可以放在用户的 Bash 配置文件.bashrc里面，以后新建 Bash 对话时，新的提示符就会生效。
  #要在当前窗口看到修改后的提示符，可以执行下面的命令。
  source ~/.bashrc
  #命令提示符的定义，可以包含特殊的转义字符，表示特定内容：
  \a    #响铃，计算机发出一记声音。
  \d    #以星期、月、日格式表示当前日期，例如“Mon May 26”。
  \h    #本机的主机名。
  \H    #完整的主机名。
  \j    #运行在当前 Shell 会话的工作数。
  \l    #当前终端设备名。
  \n    #一个换行符。
  \r    #一个回车符。
  \s    #Shell 的名称。
  \t    #24小时制的hours:minutes:seconds格式表示当前时间。
  \T    #12小时制的当前时间。
  \@    #12小时制的AM/PM格式表示当前时间。
  \A    #24小时制的hours:minutes表示当前时间。
  \u    #当前用户名。
  \v    #Shell 的版本号。
  \V    #Shell 的版本号和发布号。
  \w    #当前的工作路径。
  \W    #当前目录名。
  \!    #当前命令在命令历史中的编号。
  \#    #当前 shell 会话中的命令数。
  \$    #普通用户显示为$字符，根用户显示为#字符。
  \[    #非打印字符序列的开始标志。
  \]    #非打印字符序列的结束标志。
  
  #举例来说，[\u@\h \W]\$这个提示符定义，显示出来就是[user@host ~]$（具体的显示内容取决于你的系统）：
  [user@host ~]$ echo $PS1
  [\u@\h \W]\$
  #改写PS1变量，就可以改变这个命令提示符
  $ PS1="\A \h \$ "
  17:33 host $
  #注意，$后面最好跟一个空格，这样的话，用户的输入与提示符就不会连在一起
  ~~~
- 颜色
  ~~~shell
  #默认情况下，命令提示符是显示终端预定义的颜色。Bash 允许自定义提示符颜色
  #使用下面的代码，可以设定其后文本的颜色：
  \033[0;30m    #黑色
  \033[1;30m    #深灰色
  \033[0;31m    #红色
  \033[1;31m    #浅红色
  \033[0;32m    #绿色
  \033[1;32m    #浅绿色
  \033[0;33m    #棕色
  \033[1;33m    #黄色
  \033[0;34m    #蓝色
  \033[1;34m    #浅蓝色
  \033[0;35m    #粉红
  \033[1;35m    #浅粉色
  \033[0;36m    #青色
  \033[1;36m    #浅青色
  \033[0;37m    #浅灰色
  \033[1;37m    #白色
  #举例来说，如果要将提示符设为红色，可以将PS1设成下面的代码
  PS1='\[\033[0;31m\]<\u@\h \W>\$'
  #但是，上面这样设置以后，用户在提示符后面输入的文本也是红色的。为了解决这个问题， 可以在结尾添加另一个特殊代码\[\033[00m\]，表示将其后的文本恢复到默认颜色。
  PS1='\[\033[0;31m\]<\u@\h \W>\$\[\033[00m\]'
  
  #除了设置前景颜色，Bash 还允许设置背景颜色。
  \033[0;40m    #蓝色
  \033[1;44m    #黑色
  \033[0;41m    #红色
  \033[1;45m    #粉红
  \033[0;42m    #绿色
  \033[1;46m    #青色
  \033[0;43m    #棕色
  \033[1;47m    #浅灰色
  #下面是一个带有红色背景的提示符:
  PS1='\[\033[0;41m\]<\u@\h \W>\$\[\033[0m\] '
  ~~~
- 环境变量 PS2，PS3，PS4
  ~~~shell
  #环境变量PS2是命令行折行输入时系统的提示符，默认为>
  #环境变量PS3是使用select命令时，系统输入菜单的提示符
  #环境变量PS4默认为+。它是使用 Bash 的-x参数执行脚本时，每一行命令在执行前都会先打印出来，并且在行首出现的那个提示符
  ~~~