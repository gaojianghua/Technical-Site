# Git
[官方网站](https://git-scm.com/)
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
- 设置代理
  ~~~shell
  git config --global http.proxy "代理地址"
  git config --global https.proxy "代理地址"
  ~~~
- 取消代理
  ~~~shell
  git config --global --unset http.proxy
  git config --global --unset https.proxy
  ~~~

## Git仓库
`Multirepo` 和 `Monorepo` 是两种不同的软件开发结构模式。
- **Multirepo（多仓库）**：`Multirepo`指的是将不同的项目或组件分别存储在独立的版本控制仓库中。每个项目都有自己独立的代码库和版本控制系统。这种结构模式提供了更大的灵活性，使得每个项目可以根据自身需求选择适合的工具和流程。然而，多仓库模式可能导致团队之间的协作和沟通成本增加，并且跨项目的代码共享和重用相对复杂。

- **Monorepo（单一仓库）**：`Monorepo`指的是将多个相关项目或组件统一放置在同一个版本控制仓库中。这种结构模式的目标是集中管理代码和配置，促进代码重用、协作和一致性。`Monorepo`可以提供代码共享和重用、依赖管理统一、协作可见性增强等优势。但随着仓库规模增大，构建时间增加、持续集成和部署复杂性增加等也可能成为挑战。

::: tip
`Multirepo` 和 `Monorepo` 都有各自的优缺点，选择合适的结构模式取决于项目的规模、团队的需求以及特定的开发环境。`Multirepo`适用于较小规模的项目或独立组件，而`Monorepo`适用于较大规模的项目或由多个相关部分组成的应用程序。
:::
