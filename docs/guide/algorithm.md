# 算法思维
## 分而治之

算法设计中的一种思想方法

它将一个问题分成多个和原问题相似的小问题, 递归解决小问题, 再将结果合并以解决原理的问题

场景一: 归并排序

- 分: 把数组从中间一份为二
- 解: 递归的对两个子数组进行归并排序
- 合: 合并有序子数组

场景二: 快速排序

- 分: 选基准, 按基准把数组分成两个子数组
- 解: 递归的对两个子数组进行快速排序
- 合: 对两个子数组进行合并

LeetCode示例: 第226题

- 分: 获取左右子树
- 解: 递归的翻转左右子树
- 合: 将翻转后的左右子树换个位置放到根节点上

~~~js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {TreeNode}
 */
var invertTree = function(root) {
    if(!root){return null;}
    return {
        val: root.val,
        left: invertTree(root.right),
        right: invertTree(root.left)
    }
};
~~~

LeetCode示例: 第100题

- 分: 获取两个树的左右子树
- 解: 递归的判断两个树的左子树是否相同, 右子树是否相同
- 合: 将上述结果合并, 如果根节点的值也相同, 树就相同

~~~js
/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
/**
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {boolean}
 */
var isSameTree = function(p, q) {
    if(!p && !q) return true;
    if(p && q && p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right)){
        return true
    }
    return false
};
~~~

LeetCode示例: 第101题

- 分: 获取两个树的左右子树
- 解: 递归的判断树1的左子树和树2的右子树是否镜像, 树1的右子树和树2的左子树是否镜像
- 合: 如果上述都成立, 且根节点值也相同, 两树就镜像

~~~js
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */
/**
 * @param {TreeNode} root
 * @return {boolean}
 */
var isSymmetric = function(root) {
    if(!root) return true;
    const isMirror = (l,r) =>{
        if(!l && !r) return true
        if(l && r && l.val === r.val && isMirror(l.left, r.right) && isMirror(l.right, r.left)){
            return true
        }
        return false
    }
    return isMirror(root.left, root.right)
};
~~~



## 动态规划

算法设计中的一种思想方法

它将一个问题分解为互相重叠的子问题, 通过反复求解子问题来解决问题

LeetCode示例: 第70题 ( 同斐波那契数列 )

- 定义子问题: F(n) = F(n-1) + F(n-2)
- 反复执行: 从2循环到n, 执行上述公式

~~~js
/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    if(n < 2) return 1
    const dp = [1, 1]
    for(let i = 2; i <= n; i++){
        dp[i] = dp[i-1] + dp[i-2]
    }
    return dp[n]
};

//优化
var climbStairs = function(n) {
    if(n < 2) return 1
    let dp0 = 1
    let dp1 = 1
    for(let i = 2; i <= n; i++){
        const temp = dp0
        dp0 = dp1
        dp1 = dp1 + temp
    }
    return dp1
};
~~~



LeetCode示例: 第198题

- f(k) = 从前k个房屋中能偷窃到的最大数额
- Ak = 第k个房屋的钱数
- 定义子问题: f(k) = max(f(k - 2) + Ak, f(k - 1))
- 反复执行: 从2循环到n, 执行上述公式

~~~js
/**
 * @param {number[]} nums
 * @return {number}
 */
var rob = function(nums) {
    if (nums.length === 0) { return 0 }
    const dp = [0, nums[0]]
    for(let i = 2; i <= nums.length; i++){
        dp[i] = Math.max(dp[i-2] + nums[i-1], dp[i-1])
    }
    return dp[nums.length]
};
//优化
var rob = function(nums) {
    if (nums.length === 0) { return 0 }
    let dp0 = 0
    let dp1 = nums[0]
    for(let i = 2; i <= nums.length; i++){
        const dp2 = Math.max(dp0 + nums[i-1], dp1)
        dp0 = dp1
        dp1 = dp2
    }
    return dp1
};
~~~



## 贪心算法

算法设计中的一种思想方法

期盼通过每个阶段的局部最优选择, 从而达到全局的最优

结果并不一定是最优

LeetCode示例: 第455题

- 局部最优: 既能满足孩子, 还消耗最少
- 先将较小的饼干分给胃口最小的孩子
- 对饼干数组和胃口数组升序排序
- 遍历饼干数组, 找到能满足第一个孩子的饼干
- 然后继续遍历饼干数组, 找到满足第二,三,...,n个孩子的饼干

~~~js
/**
 * @param {number[]} g
 * @param {number[]} s
 * @return {number}
 */
var findContentChildren = function(g, s) {
    const sortFunc = function (a, b){
        return a - b
    }
    g.sort(sortFunc)
    s.sort(sortFunc)
    let i = 0
    s.forEach(n => {
        if(n>=g[i]){
            i += 1
        }
    })
    return i
};
~~~



LeetCode示例: 第122题

- 前提: 上帝视角, 知道未来价格
- 局部最优: 见好就收, 见差就不动, 不做任何长远打算
- 新建变量, 用来统计总利润
- 遍历价格数组, 如果当前价格比昨天高, 就在昨天买, 今天卖, 否则就不交易

~~~js
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    let profit = 0
    for(let i = 1; i < prices.length; i++){
        if(prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1] 
        }
    }
    return profit
};
~~~



## 回溯算法

算法设计中的一种思想方法

回溯算法是一种渐进式寻找并构建问题解决方式的策略

回溯算法会先从一个可能的动作开始解决问题, 如果不行,就回溯并选择另一个动作, 直到将问题解决

LeetCode示例: 第46题

- 用递归模拟出所有情况
- 遇到包含重复元素的情况, 就回溯
- 收集所有到达递归终点的情况, 并返回

~~~js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var permute = function(nums) {
    const res = []
    const backtrack = (path) => {
        if(path.length === nums.length){
            res.push(path)
            return
        }
        nums.forEach(n => {
            if(path.includes(n)) { return }
            backtrack(path.concat(n))
        })
    }
    backtrack([])
    return res
};
~~~



LeetCode示例: 第78题

- 用递归模拟出所有情况
- 保证接的数字都是后面的数字
- 收集所有到达递归终点的情况, 并返回

~~~js
/**
 * @param {number[]} nums
 * @return {number[][]}
 */
var subsets = function(nums) {
    const res = []
    const backtrack = (path, l, start) => {
        if (path.length === l){
            res.push(path)
            return
        }
        for(let i = start; i < nums.length; i++){
            backtrack(path.concat(nums[i]), l, i+1)
        }
    }
    for(let i = 0; i <=nums.length; i++){
        backtrack([], i, 0)
    }
    return res
};
~~~

