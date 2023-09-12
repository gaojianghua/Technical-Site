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

## 场景分析：提交(commit)
- 我刚才提交了什么?
  
  如果你用 `git commit -a` 提交了一次变化(`changes`)，而你又不确定到底这次提交了哪些内容。你就可以用下面的命令显示当前H`EAD`上的最近一次的提交(`commit`):
  ~~~shell
  git show 
  # 或者
  git log -n1 -p 
  ~~~
- 我的提交信息(`commit message`)写错了

  如果你的提交信息(`commit message`)写错了且这次提交(`commit`)还没有推(`push`), 你可以通过下面的方法来修改提交信息(`commit message`):
  ~~~shell
  # 这会打开你的默认编辑器, 在这里你可以编辑信息
  git commit --amend --only
  # 你也可以用一条命令一次完成
  git commit --amend --only -m 'xxxxxxx'
  ~~~
  如果你已经推(`push`)了这次提交(`commit`), 你可以修改这次提交(`commit`)然后强推(`force push`), 但是不推荐这么做。
- 我提交(`commit`)里的用户名和邮箱不对
  
  如果这只是单个提交(`commit`)，修改它：
  ~~~shell
  git commit --amend --author '作者名 <邮箱>'
  ~~~
  如果你需要修改所有历史, 参考 'git filter-branch'的指南页
- 我想从一个提交(`commit`)里移除一个文件

  通过下面的方法，从一个提交(commit)里移除一个文件:
  ~~~shell
  # 将 "myfile" 这个文件恢复到上一个提交状态，也就是移除该文件的更改。
  git checkout HEAD^ myfile
  # 将所有被修改、被删除和新添加的文件加入到暂存区
  git add -A
  # 修改最近一次的提交，包括之前恢复的 "myfile" 文件的移除。在执行这条命令时，Git会打开编辑器让你编辑提交信息，你可以编辑或保留原有的提交信息。
  git commit --amend
  ~~~
  这将非常有用，当你有一个开放的补丁(`open patch`)，你往上面提交了一个不必要的文件，你需要强推(`force push`)去更新这个远程补丁。
- 我想删除我的的最后一次提交(`commit`)
  
  如果你需要删除推了的提交(`pushed commits`)，你可以使用下面的方法。可是，这会不可逆的改变你的历史，也会搞乱那些已经从该仓库拉取(`pulled`)了的人的历史。简而言之，如果你不是很确定，千万不要这么做。
  ~~~shell
  git reset HEAD^ --hard  
  git push -f [remote] [branch]
  ~~~
  如果你还没有推到远程, 把Git重置(`reset`)到你最后一次提交前的状态就可以了(同时保存暂存的变化):
  ~~~shell
  git reset --soft HEAD@{1} 
  ~~~
  这只能在没有推送之前有用. 如果你已经推了, 唯一安全能做的是 `git revert SHAofBadCommit`， 那会创建一个新的提交(`commit`)用于撤消前一个提交的所有变化(`changes`)；或者, 如果你推的这个分支是`rebase-safe`的 (例如：其它开发者不会从这个分支拉), 只需要使用 `git push -f`。
- 删除任意提交(`commit`)

  同样的警告：不到万不得已的时候不要这么做
  ~~~shell
  git rebase --onto SHA1_OF_BAD_COMMIT^ SHA1_OF_BAD_COMMIT  
  git push -f [remote] [branch] 
  ~~~
  或者做一个 交互式 `rebase` 删除那些你想要删除的提交(`commit`)里所对应的行。
- 我尝试推一个修正后的提交(`amended commit`)到远程，但是报错：
  ~~~shell
  To https://github.com/yourusername/repo.git  
  ! [rejected]        mybranch -> mybranch (non-fast-forward)  
  error: failed to push some refs to 'https://github.com/tanay1337/webmaker.org.git'  
  hint: Updates were rejected because the tip of your current branch is behind  
  hint: its remote counterpart. Integrate the remote changes (e.g.  
  hint: 'git pull ...') before pushing again.  
  hint: See the 'Note about fast-forwards' in 'git push --help' for details.
  ~~~
  注意, `rebasing`(见下面)和修正(`amending`)会用一个新的提交(`commit`)代替旧的, 所以如果之前你已经往远程仓库上推过一次修正前的提交(`commit`)，那你现在就必须强推(`force push`) (`-f`)。注意 – **总是** 确保你指明一个分支!
  ~~~shell
  git push origin mybranch -f  
  ~~~
  一般来说, **要避免强推**. 最好是创建和推(`push`)一个新的提交(`commit`)，而不是强推一个修正后的提交。后者会使那些与该分支或该分支的子分支工作的开发者，在源历史中产生冲突。
- 我意外的做了一次硬重置(`hard reset`)，我想找回我的内容

  如果你意外的做了 `git reset --hard`, 你通常能找回你的提交(`commit`), 因为Git对每件事都会有日志，且都会保存几天。
  ~~~shell
  git reflog
  ~~~
  你将会看到一个你过去提交(`commit`)的列表, 和一个重置的提交。选择你想要回到的提交(`commit`)的SHA，再重置一次:
  ~~~shell
  git reset --hard SHA1234
  ~~~

## 场景分析：暂存(Staging)
- 我需要把暂存的内容添加到上一次的提交(`commit`)
  ~~~shell
  git commit --amend
  ~~~
- 我想要暂存一个新文件的一部分，而不是这个文件的全部

  一般来说, 如果你想暂存一个文件的一部分, 你可这样做:
  ~~~shell
  git add --patch filename.x
  ~~~
  `-p` 简写。这会打开交互模式，你将能够用 `s` 选项来分隔提交(`commit`)；然而, 如果这个文件是新的, 会没有这个选择， 添加一个新文件时, 这样做:
  ~~~shell
  git add -N filename.x  
  ~~~
  然后, 你需要用 `e` 选项来手动选择需要添加的行，执行 `git diff --cached` 将会显示哪些行暂存了哪些行只是保存在本地了。
- 我想把在一个文件里的变化(`changes`)加到两个提交(`commit`)里

  `git add` 会把整个文件加入到一个提交. `git add -p` 允许交互式的选择你想要提交的部分.
- 我想把暂存的内容变成未暂存，把未暂存的内容暂存起来

  多数情况下，你应该将所有的内容变为未暂存，然后再选择你想要的内容进行`commit`。但假定你就是想要这么做，这里你可以创建一个临时的`commit`来保存你已暂存的内容，然后暂存你的未暂存的内容并进行`stash`。然后`reset`最后一个`commit`将原本暂存的内容变为未暂存，最后`stash pop`回来。
  ~~~shell
  git commit -m "WIP"  
  git add .  
  git stash  
  git reset HEAD^  
  git stash pop --index 0 
  ~~~
  ::: tip
  注意1: 这里使用`pop`仅仅是因为想尽可能保持幂等。
  注意2: 假如你不加上`--index`你会把暂存的文件标记为为存储。
  :::

## 场景分析：未暂存(Unstaged)的内容
- 我想把未暂存的内容移动到一个新分支
  ~~~shell
  # 将会新建一个分支然后切换到那个分支。所有未暂存的内容将会在切换到那个分支时暂存。
  git checkout -b <new-branch-name>
  ~~~
- 我想把未暂存的内容移动到另一个已存在的分支
  ~~~shell
  git stash  
  git checkout my-branch  
  git stash pop  
  ~~~
- 我想丢弃本地未提交的变化(`uncommitted changes`)

  如果你只是想重置源(`origin`)和你本地(`local`)之间的一些提交(`commit`)，你可以：
  ~~~shell
  # 重置1个提交
  git reset --hard HEAD^  
  # 重置2个提交 
  git reset --hard HEAD^^  
  # 重置4个提交
  git reset --hard HEAD~4  
  # 或者恢复工作区文件
  git checkout -f 
  ~~~
  重置某个特殊的文件, 你可以用文件名做为参数:
  ~~~shell
  git reset filename
  ~~~
- 我想丢弃某些未暂存的内容

  如果你想丢弃工作拷贝中的一部分内容，而不是全部。

  签出(`checkout`)不需要的内容，保留需要的。
  ~~~shell
  git checkout -p  
  # 回答所有你想丢弃的片段。
  ~~~
  另外一个方法是使用 `stash`， `Stash`所有要保留下的内容, 重置工作拷贝, 重新应用保留的部分。
  ~~~shell
  git stash -p  
  # 选择要保存的所有代码段
  git reset --hard  
  git stash pop  
  ~~~
  或者, `stash` 你不需要的部分, 然后`stash drop`。
  ~~~shell
  git stash -p  
  # 选择您不想保存的所有代码段
  git stash drop
  ~~~

## 场景分析：分支(Branches)
- 我从错误的分支拉取了内容，或把内容拉取到了错误的分支

  这是另外一种使用 `git reflog` 情况，找到在这次错误拉(`pull`) 之前`HEAD`的指向。
  ~~~shell
  git reflog
  ab7555f HEAD@{0}: pull origin wrong-branch: Fast-forward  
  c5bc55a HEAD@{1}: checkout: checkout message goes here 
  ~~~
  重置分支到你所需的提交(`desired commit`):
  ~~~shell
  git reset --hard c5bc55a
  ~~~
- 我想扔掉本地的提交(`commit`)，以便我的分支与远程的保持一致

  先确认你没有推(`push`)你的内容到远程。

  `git status` 会显示你领先(`ahead`)源(`origin`)多少个提交:
  ~~~shell
  git status
  # On branch my-branch  
  # Your branch is ahead of 'origin/my-branch' by 2 commits.  
  #   (use "git push" to publish your local commits)  
  #  
  ~~~
  一种方法是:
  ~~~shell
  git reset --hard origin/my-branch
  ~~~
- 我需要提交到一个新分支，但错误的提交到了`main`

  在`main`下创建一个新分支，不切换到新分支,仍在`main`下:
  ~~~shell
  git branch my-branch
  ~~~
  把`main`分支重置到前一个提交:
  ~~~shell
  git reset --hard HEAD^
  ~~~
  `HEAD^` 是 `HEAD^1` 的简写，你可以通过指定要设置的HEAD来进一步重置。

  或者, 如果你不想使用 `HEAD^`, 找到你想重置到的提交(`commit`)的`hash`(`git log` 能够完成)， 然后重置到这个`hash`。使用`git push` 同步内容到远程

  例如, `main`分支想重置到的提交的`hash`为`a13b85e`:
  ~~~shell
  git reset --hard a13b85e  
  HEAD is now at a13b85e  
  ~~~
  签出(`checkout`)刚才新建的分支继续工作:
  ~~~shell
  git checkout my-branch
  ~~~
- 我想保留来自另外一个`ref-ish`的整个文件

  假设你正在做一个原型方案(原文为 `working spike (see note)`), 有成百的内容，每个都工作得很好。现在, 你提交到了一个分支，保存工作内容:
  ~~~shell
  (solution)$ git add -A && git commit -m "Adding all changes from this spike into one big commit."
  ~~~
  当你想要把它放到一个分支里 (可能是`feature`, 或者 `develop`), 你关心是保持整个文件的完整，你想要一个大的提交分隔成比较小。

  假设你有:
  - 分支 `solution`, 拥有原型方案， 领先 `develop` 分支。
  - 分支 `develop`, 在这里你应用原型方案的一些内容。

  我去可以通过把内容拿到你的分支里，来解决这个问题:
  ~~~shell
  (develop)$ git checkout solution -- file1.txt
  ~~~
  这会把这个文件内容从分支 `solution` 拿到分支 `develop` 里来:
  ~~~shell
  # On branch develop  
  # Your branch is up-to-date with 'origin/develop'.  
  # Changes to be committed:  
  #  (use "git reset HEAD <file>..." to unstage)  
  #  
  #        modified:   file1.txt 
  ~~~
  然后, 正常提交。

  ::: tip
  注: `Spike` 解决方案是为了分析或解决问题而制定的。这些解决方案用于估计，一旦每个人都对问题有了清晰的可视化，就会被丢弃。
  :::
- 我把几个提交(`commit`)提交到了同一个分支，而这些提交应该分布在不同的分支里

  假设你有一个`main`分支， 执行`git log`, 你看到你做过两次提交:
  ~~~shell
  (main)$ git log  
  
  commit e3851e817c451cc36f2e6f3049db528415e3c114  
  Author: Alex Lee <alexlee@example.com>  
  Date:   Tue Jul 22 15:39:27 2014 -0400  
    
      Bug #21 - Added CSRF protection  
    
  commit 5ea51731d150f7ddc4a365437931cd8be3bf3131  
  Author: Alex Lee <alexlee@example.com>  
  Date:   Tue Jul 22 15:39:12 2014 -0400  
    
      Bug #14 - Fixed spacing on title  
    
  commit a13b85e984171c6e2a1729bb061994525f626d14  
  Author: Aki Rose <akirose@example.com>  
  Date:   Tue Jul 21 01:12:48 2014 -0400  
  
    First commit 
  ~~~
  让我们用提交`hash(commit hash)`标记`bug (e3851e8 for #21, 5ea5173 for #14)`

  首先, 我们把`main`分支重置到正确的提交(`a13b85e`):
  ~~~shell
  (main)$ git reset --hard a13b85e  
  HEAD is now at a13b85e
  ~~~
  现在, 我们对 `bug #21` 创建一个新的分支:
  ~~~shell
  (main)$ git checkout -b 21  
  (21)$ 
  ~~~
  接着, 我们用 `_cherry-pick_` 把对`bug #21`的提交放入当前分支。这意味着我们将应用(`apply`)这个提交(`commit`)，仅仅这一个提交(`commit`)，直接在`HEAD`上面。
  ~~~shell
  (21)$ git cherry-pick e3851e8 
  ~~~
  这时候, 这里可能会产生冲突， 参见交互式 `rebasing` 章 **冲突节** 解决冲突

  再者， 我们为`bug #14` 创建一个新的分支, 也基于`main`分支
  ~~~shell
  (21)$ git checkout main  
  (main)$ git checkout -b 14  
  (14)$
  ~~~
  最后, 为 `bug #14` 执行 `cherry-pick`:
  ~~~shell
  (14)$ git cherry-pick 5ea5173 
  ~~~
- 我想删除上游(`upstream`)分支被删除了的本地分支

  一旦你在 `github` 上面合并(`merge`)了一个`pull request`, 你就可以删除你`fork`里被合并的分支。如果你不准备继续在这个分支里工作, 删除这个分支的本地拷贝会更干净，使你不会陷入工作分支和一堆陈旧分支的混乱之中。
  ~~~shell
  git fetch -p
  ~~~
- 我不小心删除了我的分支

  如果你定期推送到远程, 多数情况下应该是安全的，但有些时候还是可能删除了还没有推到远程的分支。让我们先创建一个分支和一个新的文件:
  ~~~shell
  (main)$ git checkout -b my-branch  
  (my-branch)$ git branch  
  (my-branch)$ touch foo.txt  
  (my-branch)$ ls  
  README.md foo.txt
  ~~~
  添加文件并做一次提交
  ~~~shell
  (my-branch)$ git add .  
  (my-branch)$ git commit -m 'foo.txt added'  
  (my-branch)$ foo.txt added  
  1 files changed, 1 insertions(+)  
  create mode 100644 foo.txt  
  (my-branch)$ git log  
    
  commit 4e3cd85a670ced7cc17a2b5d8d3d809ac88d5012  
  Author: siemiatj <siemiatj@example.com>  
  Date:   Wed Jul 30 00:34:10 2014 +0200  
    
      foo.txt added  
    
  commit 69204cdf0acbab201619d95ad8295928e7f411d5  
  Author: Kate Hudson <katehudson@example.com>  
  Date:   Tue Jul 29 13:14:46 2014 -0400  
    
      Fixes #6: Force pushing after amending commits 
  ~~~
  现在我们切回到主(`main`)分支，‘不小心的’删除`my-branch`分支
  ~~~shell
  (my-branch)$ git checkout main  
  Switched to branch 'main'  
  Your branch is up-to-date with 'origin/main'.  
  (main)$ git branch -D my-branch  
  Deleted branch my-branch (was 4e3cd85).  
  (main)$ echo oh noes, deleted my branch!  
  oh noes, deleted my branch!
  ~~~
  在这时候你应该想起了`reflog`, 一个升级版的日志，它存储了仓库(`repo`)里面所有动作的历史。
  ~~~shell
  (main)$ git reflog  
  69204cd HEAD@{0}: checkout: moving from my-branch to main  
  4e3cd85 HEAD@{1}: commit: foo.txt added  
  69204cd HEAD@{2}: checkout: moving from main to my-branch
  ~~~
  正如你所见，我们有一个来自删除分支的提交`hash(commit hash)`，接下来看看是否能恢复删除了的分支。
  ~~~shell
  (main)$ git checkout -b my-branch-help  
  Switched to a new branch 'my-branch-help'  
  (my-branch-help)$ git reset --hard 4e3cd85  
  HEAD is now at 4e3cd85 foo.txt added  
  (my-branch-help)$ ls  
  README.md foo.txt
  ~~~
  看! 我们把删除的文件找回来了。Git的 `reflog` 在`rebasing`出错的时候也是同样有用的。
- 我想删除一个分支
  
  删除一个远程分支:
  ~~~shell
  git push origin --delete my-branch
  # 或者
  git push origin :my-branch  
  ~~~
  删除一个本地分支:
  ~~~shell
  git branch -D my-branch
  ~~~
- 我想从别人正在工作的远程分支签出(`checkout`)一个分支

  首先, 从远程拉取(`fetch`) 所有分支:
  ~~~shell
  git fetch --all
  ~~~
  假设你想要从远程的`daves`分支签出到本地的`daves`
  ~~~shell
  (main)$ git checkout --track origin/daves  
  Branch daves set up to track remote branch daves from origin.  
  Switched to a new branch 'daves'
  ~~~
  (`--track` 是 `git checkout -b [branch] [remotename]/[branch]` 的简写)，
  这样就得到了一个`daves`分支的本地拷贝, 任何推过(`pushed`)的更新，远程都能看到

## 场景分析：Rebasing 和合并(Merging)
- 我想撤销`rebase/merge`

  你可以合并(`merge`)或`rebase`了一个错误的分支, 或者完成不了一个进行中的`rebase/merge`。Git 在进行危险操作的时候会把原始的`HEAD`保存在一个叫`ORIG_HEAD`的变量里, 所以要把分支恢复到`rebase/merge`前的状态是很容易的。
  ~~~shell
  git reset --hard ORIG_HEAD
  ~~~
- 我已经`rebase`过, 但是我不想强推(`force push`)

  不幸的是，如果你想把这些变化(`changes`)反应到远程分支上，你就必须得强推(`force push`)。是因你快进(`Fast forward`)了提交，改变了Git历史, 远程分支不会接受变化(`changes`)，除非强推(`force push`)。

  这就是许多人使用 `merge` 工作流, 而不是 `rebasing` 工作流的主要原因之一， 开发者的强推(`force push`)会使大的团队陷入麻烦。使用时需要注意，一种安全使用 `rebase` 的方法是，不要把你的变化(`changes`)反映到远程分支上, 而是按下面的做:
  ~~~shell
  (main)$ git checkout my-branch  
  (my-branch)$ git rebase -i main  
  (my-branch)$ git checkout main  
  (main)$ git merge --ff-only my-branch
  ~~~
- 我需要组合(`combine`)几个提交(`commit`)

  假设你的工作分支将会做对于 `main` 的`pull-request`。一般情况下你不关心提交(`commit`)的时间戳，只想组合 所有 提交(`commit`) 到一个单独的里面, 然后重置(`reset`)重提交(`recommit`)。确保主(`main`)分支是最新的和你的变化都已经提交了, 然后:
  ~~~shell
  (my-branch)$ git reset --soft main  
  (my-branch)$ git commit -am "New awesome feature" 
  ~~~
  如果你想要更多的控制, 想要保留时间戳, 你需要做交互式`rebase (interactive rebase)`:
  ~~~shell
  (my-branch)$ git rebase -i main
  ~~~
  如果没有相对的其它分支， 你将不得不相对自己的 `HEAD` 进行 r`ebase`。例如：你想组合最近的两次提交(`commit`), 你将相对于 `HEAD~2` 进行`rebase`， 组合最近3次提交(`commit`), 相对于`HEAD~3`, 等等。
  ~~~shell
  (main)$ git rebase -i HEAD~2
  ~~~
  在你执行了交互式 `rebase` 的命令(`interactive rebase command`)后, 你将在你的编辑器里看到类似下面的内容:
  ~~~shell
  pick a9c8a1d Some refactoring  
  pick 01b2fd8 New awesome feature  
  pick b729ad5 fixup  
  pick e3851e8 another fix  
    
  # Rebase 8074d12..b729ad5 onto 8074d12  
  #  
  # Commands:  
  #  p, pick = use commit  
  #  r, reword = use commit, but edit the commit message  
  #  e, edit = use commit, but stop for amending  
  #  s, squash = use commit, but meld into previous commit  
  #  f, fixup = like "squash", but discard this commit's log message  
  #  x, exec = run command (the rest of the line) using shell  
  #  
  # These lines can be re-ordered; they are executed from top to bottom.  
  #  
  # If you remove a line here THAT COMMIT WILL BE LOST.  
  #  
  # However, if you remove everything, the rebase will be aborted.  
  #  
  # Note that empty commits are commented out 
  ~~~
  所有以 `#` 开头的行都是注释, 不会影响 `rebase`.

  然后，你可以用任何上面命令列表的命令替换 `pick`, 你也可以通过删除对应的行来删除一个提交(`commit`)。

  例如, 如果你想 **单独保留最旧(first)的提交(commit),组合所有剩下的到第二个里面**, 你就应该编辑第二个提交(`commit`)后面的每个提交(`commit`) 前的单词为 `f`:
  ~~~shell
  pick a9c8a1d Some refactoring  
  pick 01b2fd8 New awesome feature  
  f b729ad5 fixup  
  f e3851e8 another fix
  ~~~
  如果你想组合这些提交(`commit`) **并重命名这个提交(commit)**, 你应该在第二个提交(`commit`)旁边添加一个`r`，或者更简单的用`s` 替代 `f`:
  ~~~shell
  pick a9c8a1d Some refactoring  
  pick 01b2fd8 New awesome feature  
  s b729ad5 fixup  
  s e3851e8 another fix
  ~~~
  你可以在接下来弹出的文本提示框里重命名提交(`commit`)。
  ~~~shell
  Newer, awesomer features  
  
  # Please enter the commit message for your changes. Lines starting  
  # with '#' will be ignored, and an empty message aborts the commit.  
  # rebase in progress; onto 8074d12  
  # You are currently editing a commit while rebasing branch 'main' on '8074d12'.  
  #  
  # Changes to be committed:  
  # modified:   README.md  
  # 
  ~~~
  如果成功了, 你应该看到类似下面的内容:
  ~~~shell
  (main)$ Successfully rebased and updated refs/heads/main.  
  ~~~

  **安全合并(merging)策略**

  `--no-commit` 执行合并(`merge`)但不自动提交, 给用户在做提交前检查和修改的机会。`no-ff` 会为特性分支(`feature branch`)的存在过留下证据, 保持项目历史一致。
  ~~~shell
  git merge --no-ff --no-commit my-branch 
  ~~~

  **我需要将一个分支合并成一个提交(commit)**
  ~~~shell
  git merge --squash my-branch
  ~~~

  **我只想组合(combine)未推的提交(unpushed commit)**

  有时候，在将数据推向上游之前，你有几个正在进行的工作提交(`commit`)。这时候不希望把已经推(`push`)过的组合进来，因为其他人可能已经有提交(`commit`)引用它们了。
  ~~~shell
  git rebase -i @{u}
  ~~~
  这会产生一次交互式的`rebase(interactive rebase)`, 只会列出没有推(`push`)的提交(`commit`)， 在这个列表时进行`reorder/fix/squash` 都是安全的。

- 检查是否分支上的所有提交(`commit`)都合并(`merge`)过了

  检查一个分支上的所有提交(`commit`)是否都已经合并(`merge`)到了其它分支, 你应该在这些分支的`head`(或任何 `commits`)之间做一次`diff`:
  ~~~shell
  git log --graph --left-right --cherry-pick --oneline HEAD...feature/120-on-scroll
  ~~~
  这会告诉你在一个分支里有而另一个分支没有的所有提交(`commit`), 和分支之间不共享的提交(`commit`)的列表。另一个做法可以是:
  ~~~shell
  git log main ^feature/120-on-scroll --no-merges
  ~~~
- 交互式`rebase(interactive rebase)`可能出现的问题

  **这个 `rebase` 编辑屏幕出现'noop'**

  如果你看到的是这样:
  ~~~shell
  noop
  ~~~
  这意味着你`rebase`的分支和当前分支在同一个提交(`commit`)上, 或者 **领先(ahead)** 当前分支。你可以尝试:
  - 检查确保主(`main`)分支没有问题
  - `rebase  HEAD~2` 或者更早

  **有冲突的情况**

  如果你不能成功的完成`rebase`, 你可能必须要解决冲突。

  首先执行 `git status` 找出哪些文件有冲突:
  ~~~shell
  (my-branch)$ git status  
  On branch my-branch  
  Changes not staged for commit:  
    (use "git add <file>..." to update what will be committed)  
    (use "git checkout -- <file>..." to discard changes in working directory)  
    
  modified:   README.md  
  ~~~
  在这个例子里面, `README.md` 有冲突。打开这个文件找到类似下面的内容:
  ~~~shell
  <<<<<<< HEAD  
    some code  
    =========  
    some code  
    >>>>>>> new-commit
  ~~~
  你需要解决新提交的代码(示例里, 从中间==线到new-commit的地方)与HEAD 之间不一样的地方

  有时候这些合并非常复杂，你应该使用可视化的差异编辑器(`visual diff editor`):
  ~~~shell
  git mergetool -t opendiff
  ~~~
  在你解决完所有冲突和测试过后, `git add` 变化了的(`changed`)文件, 然后用`git rebase --continue` 继续`rebase`。
  ~~~shell
  git add README.md
  git rebase --continue
  ~~~
  如果在解决完所有的冲突过后，得到了与提交前一样的结果, 可以执行`git rebase --skip`。

  任何时候你想结束整个 `rebase` 过程，回来 `rebase` 前的分支状态, 你可以做:
  ~~~shell
  git rebase --abort
  ~~~

## 场景分析：Stash
- 暂存所有改动
  
  暂存你工作目录下的所有改动
  ~~~shell
  git stash
  ~~~
  你可以使用`-u`来排除一些文件
  ~~~shell
  git stash -u
  ~~~
- 暂存指定文件

  假设你只想暂存某一个文件
  ~~~shell
  git stash push working-directory-path/filename.ext
  ~~~
  假设你想暂存多个文件
  ~~~shell
  git stash push working-directory-path/filename1.ext working-directory-path/filename2.ext
  ~~~
- 暂存时记录消息

  这样你可以在`list`时看到它
  ~~~shell
  git stash save <message>
  # 或者
  git stash push -m <message>
  ~~~
- 使用某个指定暂存

  首先你可以查看你的`stash`记录
  ~~~shell
  git stash list
  ~~~
  然后你可以`apply`某个`stash`
  ~~~shell
  git stash apply "stash@{n}"
  ~~~
  此处， `n`是`stash`在栈中的位置，最上层的`stash`会是`0`

  除此之外，也可以使用时间标记(假如你能记得的话)。
  ~~~shell
  git stash apply "stash@{2.hours.ago}"
  ~~~
- 暂存时保留未暂存的内容

  你需要手动`create`一个`stash commit`， 然后使用`git stash store`。
  ~~~shell
  git stash create  
  git stash store -m "commit-message" CREATED_SHA1 
  ~~~

## 场景分析：杂项(Miscellaneous Objects)
- 克隆所有子模块
  ~~~shell
  git clone --recursive git://github.com/foo/bar.git
  ~~~
  如果已经克隆了:
  ~~~shell
  git submodule update --init --recursive
  ~~~
- 删除标签(`tag`)
  ~~~shell
  git tag -d <tag_name>
  git push <remote> :refs/tags/<tag_name>
  ~~~
- 恢复已删除标签(`tag`)

  如果你想恢复一个已删除标签(`tag`), 可以按照下面的步骤: 首先, 需要找到无法访问的标签(`unreachable tag`)。
  ~~~shell
  git fsck --unreachable | grep tag
  ~~~
  记下这个标签(`tag`)的`hash`，然后用Git的 `update-ref`
  ~~~shell
  git update-ref refs/tags/<tag_name> <hash>
  ~~~
- 已删除补丁(`patch`)

  如果某人在 GitHub 上给你发了一个`pull request`, 但是然后他删除了他自己的原始 `fork`, 你将没法克隆他们的提交(`commit`)或使用 `git am`。在这种情况下, 最好手动的查看他们的提交(`commit`)，并把它们拷贝到一个本地新分支，然后做提交。

  做完提交后, 再修改作者，参见变更作者。然后, 应用变化, 再发起一个新的`pull request`。

## 场景分析：跟踪文件(Tracking Files)
- 我只想改变一个文件名字的大小写，而不修改内容
  ~~~shell
  git mv --force myfile MyFile
  ~~~
- 我想从Git删除一个文件，但保留该文件
  ~~~shell
  # 取消对 log.txt 文件的跟踪，将其从 Git 的暂存区中排除，而不影响工作目录中的实际文件
  git rm --cached log.txt
  ~~~
## 场景分析：配置(Configuration)
- 我想给一些Git命令添加别名(`alias`)

  在 `OS X` 和 `Linux` 下, 你的 Git的配置文件储存在 `~/.gitconfig`。我在 `[alias]` 部分添加了一些快捷别名(和一些我容易拼写错误的)，如下: 
  ~~~shell
  [alias]  
    a = add  
    amend = commit --amend  
    c = commit  
    ca = commit --amend  
    ci = commit -a  
    co = checkout  
    d = diff  
    dc = diff --changed  
    ds = diff --staged  
    f = fetch  
    loll = log --graph --decorate --pretty=oneline --abbrev-commit  
    m = merge  
    one = log --pretty=oneline  
    outstanding = rebase -i @{u}  
    s = status  
    unpushed = log @{u}  
    wc = whatchanged  
    wip = rebase -i @{u}  
    zap = fetch -p 
  ~~~
- 我想缓存一个仓库(`repository`)的用户名和密码

  你可能有一个仓库需要授权，这时你可以缓存用户名和密码，而不用每次推/拉(push/pull)的时候都输入，`Credential helper`能帮你。
  ~~~shell
  git config --global credential.helper cache  
  # 设置git使用凭证内存缓存 
  ~~~
  ~~~shell
  git config --global credential.helper 'cache --timeout=3600'  
  # 将缓存设置为1小时后超时(以秒为单位) 
  ~~~
- 我不知道我做错了些什么

  你把事情搞砸了：你 重置(`reset`) 了一些东西, 或者你合并了错误的分支, 亦或你强推了后找不到你自己的提交(`commit`)了。有些时候, 你一直都做得很好, 但你想回到以前的某个状态。

  这就是 `git reflog` 的目的， `reflog` 记录对分支顶端(`the tip of a branch`)的任何改变, 即使那个顶端没有被任何分支或标签引用。基本上, 每次`HEAD`的改变, 一条新的记录就会增加到reflog。遗憾的是，这只对本地分支起作用，且它只跟踪动作 (例如，不会跟踪一个没有被记录的文件的任何改变)。
  ~~~shell
  (main)$ git reflog  
  0a2e358 HEAD@{0}: reset: moving to HEAD~2  
  0254ea7 HEAD@{1}: checkout: moving from 2.2 to main  
  c10f740 HEAD@{2}: checkout: moving from main to 2.2
  ~~~
  上面的`reflog`展示了从`main`分支签出(`checkout`)到2.2 分支，然后再签回。那里，还有一个硬重置(`hard reset`)到一个较旧的提交。最新的动作出现在最上面以 `HEAD@{0}` 标识

  如果事实证明你不小心回移(`move back`)了提交(`commit`), `reflog` 会包含你不小心回移前`main`上指向的提交(`0254ea7`)。
  ~~~shell
  git reset --hard 0254ea7 
  ~~~
  然后使用`git reset`就可以把`main`改回到之前的`commit`，这提供了一个在历史被意外更改情况下的安全网。

## Git仓库
`Multirepo` 和 `Monorepo` 是两种不同的软件开发结构模式。
- **Multirepo（多仓库）**：`Multirepo`指的是将不同的项目或组件分别存储在独立的版本控制仓库中。每个项目都有自己独立的代码库和版本控制系统。这种结构模式提供了更大的灵活性，使得每个项目可以根据自身需求选择适合的工具和流程。然而，多仓库模式可能导致团队之间的协作和沟通成本增加，并且跨项目的代码共享和重用相对复杂。

- **Monorepo（单一仓库）**：`Monorepo`指的是将多个相关项目或组件统一放置在同一个版本控制仓库中。这种结构模式的目标是集中管理代码和配置，促进代码重用、协作和一致性。`Monorepo`可以提供代码共享和重用、依赖管理统一、协作可见性增强等优势。但随着仓库规模增大，构建时间增加、持续集成和部署复杂性增加等也可能成为挑战。

::: tip
`Multirepo` 和 `Monorepo` 都有各自的优缺点，选择合适的结构模式取决于项目的规模、团队的需求以及特定的开发环境。`Multirepo`适用于较小规模的项目或独立组件，而`Monorepo`适用于较大规模的项目或由多个相关部分组成的应用程序。
:::
