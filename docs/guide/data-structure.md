# 时间复杂度

是一个函数,用大O表示, 例: O(1)  O(n)  O(logN)

定性描述该算法的运行时间

O(1) + O(n) = O(n) 		取最大的那个

O(n) * O(n) = O(n^2)		



## 空间复杂度

是一个函数,用大O表示, 例: O(1)  O(n)  O(n^2)

算法在运行过程中临时占用存储空间大小的量度



## 栈

先进后出, 后进先出

模拟:

~~~js
const stack = []
stack.push(1)
stack.push(2)

const item1 = stack.pop()
const item2 = stack.pop()
~~~

LeetCode示例: 第20题

~~~js
var isValid = function(s) {
    if(s.length % 2 === 1) {return false;}
    const stack = []
    for(let i = 0; i < s.length; i += 1){
        const c = s[i]
        if (c === '(' || c === '[' || c === '{') {
            stack.push(c);
        }else{
            const t = stack[stack.length - 1]
            if(
                (t === '(' && c === ')') ||
                (t === '[' && c === ']') ||
                (t === '{' && c === '}')
            ){
                stack.pop()
            }else{
                return false
            }
        }
    }
    return stack.length === 0
};
~~~





## 队列

先进先出

模拟:

~~~js
const stack = []
stack.push(1)
stack.push(2)

const item1 = stack.shift()
const item2 = stack.shift()
~~~

LeetCode示例: 第933题

~~~js
var RecentCounter = function() {
    this.q = []
};

/** 
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function(t) {
    this.q.push(t)
    while(this.q[0] < t-3000){
        this.q.shift()
    }
    return this.q.length
};
~~~



## 链表

多个元素组成的列表

元素存储不连续, 用next指针连接

模拟:

~~~js
const a = { val: 'a' }
const b = { val: 'b' }
const c = { val: 'c' }
const d = { val: 'd' }
a.next = b
b.next = c
c.next = d

let p = a
while (p){
    console.log(p.next)
    p = p.next
}
~~~

LeetCode示例: 第237题

~~~js
var deleteNode = function(node) {
    node.val = node.next.val
    node.next = node.next.next
};
~~~



LeetCode示例: 第206题

~~~js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var reverseList = function(head) {
    let p1 = head //{1,2,3,4,5}
    let p2 = null
    while(p1){
        console.log(p1)
        const tmp = p1.next //tmp = [2,3,4,5]
        console.log(tmp)
        p1.next = p2  //p1.next = null
        console.log(p1.next)
        p2 = p1     //p2 = [1]
        console.log(p2)
        p1 = tmp    //p1 = [2,3,4,5]  继续循环
        console.log(p1)
    }
    return p2   //[5,4,3,2,1]
};
~~~



LeetCode示例: 第2题

~~~js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var addTwoNumbers = function(l1, l2) {
    const l3 = new ListNode(0)
    let p1 = l1
    let p2 = l2
    let p3 = l3
    let carry = 0
    while(p1 || p2){
        const v1 = p1 ? p1.val : 0
        const v2 = p2 ? p2.val : 0
        const val = v1 + v2 + carry
        carry = Math.floor(val/10)
        p3.next = new ListNode(val % 10) 
        if (p1) p1 = p1.next
        if (p2) p2 = p2.next
        p3 = p3.next
    }
    if (carry) {
        p3.next = new ListNode(carry) 
    }
    return l3.next
};
~~~

LeetCode示例: 第141题

~~~js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */

/**
 * @param {ListNode} head
 * @return {boolean}
 */
var hasCycle = function(head) {
    let p1 = head
    let p2 = head
    while(p1 && p2 && p2.next){
        p1 = p1.next
        p2 = p2.next.next
        if(p1 === p2){
            return true
        }
    }
    return false
};
~~~

LeetCode示例: 第83题

~~~js
/**
 * Definition for singly-linked list.
 * function ListNode(val) {
 *     this.val = val;
 *     this.next = null;
 * }
 */
/**
 * @param {ListNode} head
 * @return {ListNode}
 */
var deleteDuplicates = function(head) {
    let p = head
    while (p && p.next){
        if(p.val === p.next.val){
            p.next = p.next.next
        }else{
            p = p.next
        }
        
    }
    return head
};
~~~



## 集合

一种无序且唯一的数据结构

ES6中有集合:Set

常用操作: 去重, 判断元素是否在集合中, 求交集

实操:

~~~js
const arr = [1,1,2,2]

const arr1 = new Set(arr)

const arr2 = [...new Set(arr)]

const has = arr1.has(1)

const set = new Set([2,3])

const set3 = new Set([...arr1].filter(item => set.has(item)))
const set4 = new Set([...arr1].filter(item => !set.has(item)))

console.log(
    arr2,
    arr1,
    has,
    set3,
    set4
)

let mySet = new Set()

mySet.add(1)
mySet.add(2)
mySet.add(3)
mySet.add(4)
mySet.add(5)
mySet.delete(1)

for (let item of mySet) console.log(item)
for (let item of mySet.keys()) console.log(item)
for (let item of mySet.values()) console.log(item)
for (let [key, value] of mySet.entries()) console.log(key, value)

const myArr = Array.from(mySet)

console.log(mySet, myArr)
~~~



LeetCode示例: 第349题

~~~js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    //1:
    const arr1 = new Set(nums1)
    const arr2 = new Set(nums2)
    const set3 = new Set([...arr2].filter(item => arr1.has(item)))
    return [...set3]
    //2: 
    //return [...new Set(nums1)].filter(n => nums2.includes(n))
};
~~~



## 字典

与集合类似, 字典也是存储唯一值的数据结构, 但它是以键值对的形式存储

ES6中有字典:Map

实操:

~~~js
const m = new Map()
//增
m.set('a', '123456')
m.set('b', '123456')
//删
m.delete('a')
//改
m.set('b', '456456')
//查
const u = m.get('b')

console.log(u)
~~~



LeetCode示例: 第349题

~~~js
/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number[]}
 */
var intersection = function(nums1, nums2) {
    const map = new Map()
    nums1.forEach(n => {
        map.set(n, true)
    })
    const res = []
    nums2.forEach(n => {
        if(map.get(n)){
            res.push(n)
            map.delete(n)
        }
    })
    return res
};
~~~

LeetCode示例: 第20题

~~~js
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    if(s.length % 2 === 1) {return false;}
    const stack = []
    const map = new Map()
    map.set('(', ')')
    map.set('[', ']')
    map.set('{', '}')
    for(let i = 0; i < s.length; i += 1){
        const c = s[i]
        if (map.has(c)) {
            stack.push(c);
        }else{
            const t = stack[stack.length - 1]
            if(map.get(t) === c){
                stack.pop()
            }else{
                return false
            }
        }
    }
    return stack.length === 0
};
~~~

LeetCode示例: 第1题

~~~js
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map()
    for(let i = 0; i < nums.length; i++){
        const n = nums[i]
        const n2 = target - n
        if(map.has(n2)){
            return [map.get(n2), i]
        }else{
            map.set(n, i)
        }
    }
};
~~~

LeetCode示例: 第3题

~~~js
/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    let l = 0
    let res = 0
    const map = new Map()
    for(let i = 0; i < s.length; i++){
        if(map.has(s[i]) && map.get(s[i]) >= l){
            l = map.get(s[i]) + 1
        }
        res = Math.max(res, i-l+1)
        map.set(s[i], i)
    }
    return res
};
~~~

LeetCode示例: 第76题

~~~js
/**
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
var minWindow = function(s, t) {
    let l = 0
    let r = 0
    const map = new Map()
    for(let c of t){
        map.set(c, map.has(c) ? map.get(c) + 1 : 1)
    }
    let size = map.size
    let res = ''
    while(r < s.length){
        const c = s[r]
        if(map.has(c)){
            map.set(c, map.get(c) - 1)
            if(map.get(c) === 0) size -=1
        }
        while(size === 0){
            const newRes = s.substring(l, r + 1)
            if(!res || newRes.length < res.length) res = newRes
            const c2 = s[l]
            if(map.has(c2)){
                map.set(c2, map.get(c2) + 1)
                if(map.get(c2) === 1) size += 1
            }
            l += 1
        }
        r += 1
    }   
    return res
};
~~~



## 树

一种分层数据的抽象模型

例如: DOM树, 级联选择, 树形控件

常用操作: 深度/广度优先遍历, 先中后序遍历

实操:

~~~js
const tree = {
    val: 'a',
    children:[
        {
            val: 'b',
            children:[
                {
                    val: 'd',
                    children:[

                    ]
                },
                {
                    val: 'e',
                    children:[

                    ]
                }
            ]
        },
        {
            val: 'c',
            children:[
                {
                    val: 'f',
                    children:[

                    ]
                },
                {
                    val: 'g',
                    children:[

                    ]
                }
            ]
        }
    ]
}
//广度遍历
const afs = (root) => {
    const q = [root]
    while (q.length>0){
        const n = q.shift()
        console.log(n.val)
        n.children.forEach(child => {
            q.push(child)
        })
    }
}
//深度遍历
const dfs = (root) => {
    console.log(root.val)
    root.children.forEach(dfs)
}
//执行
afs(tree)
dfs(tree)
~~~



## 二叉树

树中每个节点最多只能有两个子节点

在js中通常用Object模拟二叉树

实操:

~~~js
const bt = {
    val: 1,
    left: {
        val: 2,
        left: {
            val: 4,
            left: null,
            right: null
        },
        right: {
            val: 5,
            left: null,
            right: null
        }
    },
    right: {
        val: 3,
        left: {
            val: 6,
            left: null,
            right: null
        },
        right: {
            val: 7,
            left: null,
            right: null
        }
    }
}
//先序遍历
const preorder1 = (root) => {
    if (!root){ return  }
    console.log(root.val)
    preorder1(root.left)
    preorder1(root.right)
}
preorder1(bt)
//非递归版
const preorder2 = (root) => {
    if (!root){ return  }
    const stack = [root]
    while (stack.length) {
        const n = stack.pop()
        console.log(n.val)
        if (n.right) stack.push(n.right)
        if (n.left) stack.push(n.left)
    }
}
preorder2(bt)
//中序遍历
const inorder1 = (root) => {
    if (!root){ return  }
    inorder1(root.left)
    console.log(root.val)
    inorder1(root.right)
}
inorder1(bt)
//非递归版
const inorder2 = (root) => {
    if (!root){ return  }
    const stack = []
    let p = root
    while (stack.length || p) {
        while (p) {
            stack.push(p)
            p = p.left
        }
        const n = stack.pop()
        console.log(n.val)
        p = n.right
    }
}
inorder2(bt)
//后序遍历
const postorder1 = (root) => {
    if (!root){ return  }
    postorder1(root.left)
    postorder1(root.right)
    console.log(root.val)
}
postorder1(bt)
//非递归版
const postorder2 = (root) => {
    if (!root){ return  }
    const outputStack = []
    const stack = [root]
    while (stack.length) {
        const n = stack.pop()
        outputStack.push(n)
        if (n.left) stack.push(n.left)
        if (n.right) stack.push(n.right)
    }
    while (outputStack.length) {
        const n = outputStack.pop()
        console.log(n.val)
    }
}
postorder2(bt)
~~~

LeetCode示例: 第104题

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
 * @param {TreeNode} root
 * @return {number}
 */
var maxDepth = function(root) {
    let res = 0
    const dfs = (n, l) => {
        if(!n){return}
        if(!n.left && !n.right){
       		res = Math.max(res, l)
        }
        dfs(n.left, l+1)
        dfs(n.right, l+1)
    }
    dfs(root, 1)
    return res
};
~~~



LeetCode示例: 第111题

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
 * @param {TreeNode} root
 * @return {number}
 */
var minDepth = function(root) {
    if(!root){return 0}
    const q = [[root, 1]];
    while(q.length){
        const [n, l] = q.shift()
        if(!n.left && !n.right){
            return l
        }
        if(n.left)q.push([n.left, l+1])
        if(n.right)q.push([n.right, l+1])
    }
};
~~~

LeetCode示例: 第102题

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
 * @return {number[][]}
 */
//方式1
var levelOrder = function(root) {
    if(!root) return []
    const q = [[root, 0]]
    const res = []
    while(q.length){
        const [n, l] = q.shift()
        if(!res[l]){
            res.push([n.val])
        }else{
            res[l].push(n.val)
        }
        if(n.left) q.push([n.left, l + 1])
        if(n.right) q.push([n.right, l + 1])
    }
    return res
};

//方式2
var levelOrder = function(root) {
    if(!root) return []
    const q = [root]
    const res = []
    while(q.length){
        let len = q.length
        res.push([])
        while(len--){
            const n = q.shift()
            res[res.length - 1].push(n.val)
            if(n.left) q.push(n.left)
            if(n.right) q.push(n.right)
        }
    }
    return res
};
~~~



LeetCode示例: 第94题

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
 * @param {TreeNode} root
 * @return {number[]}
 */
//递归版
var inorderTraversal = function(root) {
    const res = []
    const rec = (n) => {
        if(!n)return
        rec(n.left)
        res.push(n.val)
        rec(n.right)
    }
    rec(root)
    return res
};
//迭代版
var inorderTraversal = function(root) {
    const res = []
    const stack = []
    let p = root
    while(stack.length || p){
        while(p){
        stack.push(p)
        p = p.left
        }
        const n = stack.pop()
        res.push(n.val)
        p = n.right
    }
    return res
};
~~~

LeetCode示例: 第112题

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
 * @param {number} sum
 * @return {boolean}
 */
var hasPathSum = function(root, sum) {
    if(!root)return false
    let res = false
    const dfs = (n,s) => {
        if(!n.left && !n.right && s === sum){
            res = true
        }
        if(n.left) dfs(n.left, s + n.left.val)
        if(n.right) dfs(n.right, s + n.right.val)
    }
    dfs(root, root.val)
    return res
};
~~~

遍历json数据

~~~js
const json = {
    a: {
        b: {
            c: 1
        }
    },
    d: [1,2]
}

const dfs = (n, path) => {
    console.log(n, path)
    Object.keys(n).forEach(k => {
        dfs(n[k])
    })
}
dfs(json, [])
~~~



## 图

图是网络结构的抽象模型, 是一组由边连接的节点

图可以表示任何二元关系, 比如道路, 航班

JS中可以使用Object和Array构建图

图的表示法: 邻接矩阵, 邻接表, 关联矩阵

实操:

~~~js
const graph = {
    0: [1,2],
    1: [2],
    2: [0,3],
    3: [3]
}
//深度优先遍历
const visited1 = new Set()
const dfs1 = (n) => {
    console.log(n)
    visited1.add(n)
    graph[n].forEach(c => {
       if(!visited1.has(c)){
           dfs1(c)
       }
    })
}
dfs1(2)
//广度优先遍历
const visited2 = new Set()
visited2.add(2)
const q = [2]
while (q.length){
    const n = q.shift()
    console.log(n)
    graph[n].forEach(c => {
        if(!visited2.has(c)){
            q.push(c)
            visited2.add(c)
        }
    })
}
~~~



LeetCode示例: 第65题

~~~js
/**
 * @param {string} s
 * @return {boolean}
 */
var isNumber = function(s) {
    const graph = {
        0: {'blank': 0, 'sign': 1, '.': 2, 'digit': 6},
        1: {'digit': 6, '.': 2},
        2: {'digit': 3},
        3: {'digit': 3, 'e': 4},
        4: {'digit': 5, 'sign': 7},
        5: {'digit': 5},
        6: {'digit': 6, '.': 3, 'e': 4},
        7: {'digit': 5}
    }
    let state = 0
    for(c of s.trim()){
        if(c >= '0' && c <= '9'){
            c = 'digit'
        } else if (c === ' ') {
            c = 'blank'
        } else if (c === '+' || c === '-') {
            c = 'sign'
        }
        state = graph[state][c]
        if(state === undefined){
            return false
        }
    }
    if(state === 3 || state === 5 || state ===6){
        return true
    }
    return false
};
~~~



LeetCode示例: 第417题

~~~js
/**
 * @param {number[][]} matrix
 * @return {number[][]}
 */
var pacificAtlantic = function(matrix) {
    if(!matrix || !matrix[0]){return []}
    const m = matrix.length
    const n = matrix[0].length
    const flow1 = Array.from({length: m}, () => new Array(n).fill(false))
    const flow2 = Array.from({length: m}, () => new Array(n).fill(false))
    const dfs = (r,c,flow) => {
        flow[r][c] = true;
        [[r-1, c], [r+1, c], [r, c-1], [r, c+1]].forEach(([nr, nc])=>{
            if(
                nr >= 0 && nr < m &&
                nc >= 0 && nc < n &&
                !flow[nr][nc] &&
                matrix[nr][nc] >= matrix[r][c]
            ){
                dfs(nr, nc, flow)
            }
        })
    }
    for(let r = 0; r<m; r++){
        dfs(r, 0, flow1)
        dfs(r, n-1, flow2)
    }
    for(let c=0; c<n; c++){
        dfs(0, c, flow1)
        dfs(m-1, c, flow2)
    }
    const res = []
    for(let r = 0; r<m; r++){
        for(let c = 0; c<n; c++){
            if(flow1[r][c] && flow2[r][c]){
                res.push([r,c])
            }
        }
    }
    return res
};
~~~

LeetCode示例: 第133题

~~~js
/**
 * // Definition for a Node.
 * function Node(val, neighbors) {
 *    this.val = val === undefined ? 0 : val;
 *    this.neighbors = neighbors === undefined ? [] : neighbors;
 * };
 */

/**
 * @param {Node} node
 * @return {Node}
 */
var cloneGraph = function(node) {
    if(!node) return
    const visited = new Map()
    const dfs = (n) => {
        const nCopy = new Node(n.val)
        visited.set(n, nCopy);
        (n.neighbors || []).forEach(ne => {
            if(!visited.has(ne)){
                dfs(ne)
            }
            nCopy.neighbors.push(visited.get(ne))
        })
    }
    dfs(node)
    return visited.get(node)
};
~~~



## 堆

堆是一种特殊的完全二叉树

所有的节点都大于等于 ( 最大堆 ) 或小于等于 ( 最小堆 ) 它的子节点

实操:

~~~js
class MinHeep {
    constructor() {
        this.heap = []
    }
    swap(i1, i2){
        const temp = this.heap[i1]
        this.heap[i1] = this.heap[i2]
        this.heap[i2] = temp
    }
    getParentIndex(i){
        return (i - 1) >> 1
    }
    getLeftIndex(i){
        return i * 2 + 1
    }
    getRightIndex(i){
        return i * 2 + 2
    }
    shiftUp(index){
        if (index === 0) { return }
        const parentIndex = this.getParentIndex(index)
        if(this.heap[parentIndex] > this.heap[index]){
            this.swap(parentIndex, index)
            this.shiftUp(parentIndex)
        }
    }
    shiftDown(index){
        const leftIndex = this.getLeftIndex(index)
        const rightIndex = this.getRightIndex(index)
        if (this.heap[leftIndex] < this.heap[index]){
            this.swap(leftIndex, index)
            this.shiftDown(leftIndex)
        }
        if (this.heap[rightIndex] < this.heap[index]){
            this.swap(rightIndex, index)
            this.shiftDown(rightIndex)
        }
    }
    insert(value){
        this.heap.push(value)
        this.shiftUp(this.heap.length - 1)
    }
    pop(){
        this.heap[0] = this.heap.pop()
        this.shiftDown(0)
    }
    peek(){
        return this.heap[0]
    }
    size(){
        return this.heap.length
    }
}
const h = new MinHeep()
h.insert(3)
h.insert(2)
h.insert(1)
h.pop()
~~~

LeetCode示例: 第215题

~~~js
class MinHeep {
    constructor() {
        this.heap = []
    }
    swap(i1, i2){
        const temp = this.heap[i1]
        this.heap[i1] = this.heap[i2]
        this.heap[i2] = temp
    }
    getParentIndex(i){
        return (i - 1) >> 1
    }
    getLeftIndex(i){
        return i * 2 + 1
    }
    getRightIndex(i){
        return i * 2 + 2
    }
    shiftUp(index){
        if (index === 0) { return }
        const parentIndex = this.getParentIndex(index)
        if(this.heap[parentIndex] > this.heap[index]){
            this.swap(parentIndex, index)
            this.shiftUp(parentIndex)
        }
    }
    shiftDown(index){
        const leftIndex = this.getLeftIndex(index)
        const rightIndex = this.getRightIndex(index)
        if (this.heap[leftIndex] < this.heap[index]){
            this.swap(leftIndex, index)
            this.shiftDown(leftIndex)
        }
        if (this.heap[rightIndex] < this.heap[index]){
            this.swap(rightIndex, index)
            this.shiftDown(rightIndex)
        }
    }
    insert(value){
        this.heap.push(value)
        this.shiftUp(this.heap.length - 1)
    }
    pop(){
        this.heap[0] = this.heap.pop()
        this.shiftDown(0)
    }
    peek(){
        return this.heap[0]
    }
    size(){
        return this.heap.length
    }
}
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number}
 */
var findKthLargest = function(nums, k) {
    const h = new MinHeep()
    nums.forEach(n => {
        h.insert(n)
        if(h.size() > k){
            h.pop()
        }
    })
    return h.peek()
};
~~~

LeetCode示例: 第347题

~~~js
class MinHeep {
    constructor() {
        this.heap = []
    }
    swap(i1, i2){
        const temp = this.heap[i1]
        this.heap[i1] = this.heap[i2]
        this.heap[i2] = temp
    }
    getParentIndex(i){
        return (i - 1) >> 1
    }
    getLeftIndex(i){
        return i * 2 + 1
    }
    getRightIndex(i){
        return i * 2 + 2
    }
    shiftUp(index){
        if (index === 0) { return }
        const parentIndex = this.getParentIndex(index)
        if(this.heap[parentIndex] && this.heap[parentIndex].value > this.heap[index].value){
            this.swap(parentIndex, index)
            this.shiftUp(parentIndex)
        }
    }
    shiftDown(index){
        const leftIndex = this.getLeftIndex(index)
        const rightIndex = this.getRightIndex(index)
        if (this.heap[leftIndex] && this.heap[leftIndex].value < this.heap[index].value){
            this.swap(leftIndex, index)
            this.shiftDown(leftIndex)
        }
        if (this.heap[rightIndex] && this.heap[rightIndex].value < this.heap[index].value){
            this.swap(rightIndex, index)
            this.shiftDown(rightIndex)
        }
    }
    insert(value){
        this.heap.push(value)
        this.shiftUp(this.heap.length - 1)
    }
    pop(){
        this.heap[0] = this.heap.pop()
        this.shiftDown(0)
    }
    peek(){
        return this.heap[0]
    }
    size(){
        return this.heap.length
    }
}
/**
 * @param {number[]} nums
 * @param {number} k
 * @return {number[]}
 */
var topKFrequent = function(nums, k) {
    const map = new Map()
    nums.forEach(n => {
        map.set(n, map.has(n) ? map.get(n) + 1 : 1)
    })
    const h = new MinHeep()
    map.forEach((value, key) => {
        h.insert({value, key})
        if(h.size() > k){
            h.pop()
        }
    })
    return h.heap.map(a => a.key)
};
~~~

LeetCode示例: 第23题

~~~js
class MinHeep {
    constructor() {
        this.heap = []
    }
    swap(i1, i2){
        const temp = this.heap[i1]
        this.heap[i1] = this.heap[i2]
        this.heap[i2] = temp
    }
    getParentIndex(i){
        return (i - 1) >> 1
    }
    getLeftIndex(i){
        return i * 2 + 1
    }
    getRightIndex(i){
        return i * 2 + 2
    }
    shiftUp(index){
        if (index === 0) { return }
        const parentIndex = this.getParentIndex(index)
        if(this.heap[parentIndex] && this.heap[parentIndex].val > this.heap[index].val){
            this.swap(parentIndex, index)
            this.shiftUp(parentIndex)
        }
    }
    shiftDown(index){
        const leftIndex = this.getLeftIndex(index)
        const rightIndex = this.getRightIndex(index)
        if (this.heap[leftIndex] && this.heap[leftIndex].val < this.heap[index].val){
            this.swap(leftIndex, index)
            this.shiftDown(leftIndex)
        }
        if (this.heap[rightIndex] && this.heap[rightIndex].val < this.heap[index].val){
            this.swap(rightIndex, index)
            this.shiftDown(rightIndex)
        }
    }
    insert(value){
        this.heap.push(value)
        this.shiftUp(this.heap.length - 1)
    }
    pop(){
        if(this.size() === 1) return this.heap.shift()
        const top = this.heap[0]
        this.heap[0] = this.heap.pop()
        this.shiftDown(0)
        return top
    }
    peek(){
        return this.heap[0]
    }
    size(){
        return this.heap.length
    }
}
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode[]} lists
 * @return {ListNode}
 */
var mergeKLists = function(lists) {
    const res = new ListNode(0)
    let p = res
    const h = new MinHeep()
    lists.forEach(l => {
        if(l) h.insert(l)
    })
    while(h.size()){
        const n = h.pop()
        p.next = n
        p = p.next
        if(n.next) h.insert(n.next)
    }
    return res.next
};

~~~



## 排序

冒泡排序:

~~~js
Array.prototype.bubbleSort = function () {
    for (let i = 0; i < this.length -1; i++){
        for (let j = 0; j < this.length - 1 - i; j++){
            if (this[j] > this[j+1]){
                const temp = this[j]
                this[j] = this[j + 1]
                this[j + 1] = temp
            }
        }
    }
}
const arr = [5,4,3,2,1]
arr.bubbleSort()
console.log(arr)
~~~

选择排序:

~~~js
Array.prototype.selectSort = function () {
    for (let i = 0; i < this.length - 1; i++) {
        let indexMin = i
        for (let j = i; j < this.length; j++){
            if (this[j] < this[indexMin]){
                indexMin = j
            }
        }
        if (indexMin !== i) {
            const temp = this[i]
            this[i] = this[indexMin]
            this[indexMin] = temp
        }
    }
}
const arr = [5,4,3,2,1]
arr.selectSort()
console.log(arr)
~~~

插入排序:

~~~js
Array.prototype.insertionSort = function () {
    for (let i = 0; i < this.length; i++) {
        const temp = this[i]
        let j = i
        while (j > 0) {
            if (this[j - 1] > temp) {
                this[j] = this[j - 1]
            }else {
                break;
            }
            j -= 1
        }
        this[j] = temp
    }
}
const arr = [5,4,3,2,1]
arr.insertionSort()
console.log(arr)
~~~

归并排序:

~~~js
Array.prototype.mergeSort = function () {
    const rec = (arr) => {
        if (arr.length === 1) { return  arr }
        const mid = Math.floor(arr.length / 2)
        const left = arr.slice(0, mid)
        const right = arr.slice(mid, arr.length)
        const orderLeft = rec(left)
        const orderRight = rec(right)
        const res = []
        while (orderLeft.length || orderRight.length) {
            if (orderLeft.length && orderRight.length) {
                res.push(orderLeft[0] < orderRight[0] ? orderLeft.shift() : orderRight.shift())
            }else if (orderLeft.length) {
                res.push(orderLeft.shift())
            }else if (orderRight.length) {
                res.push(orderRight.shift())
            }
        }
        return res
    }
    const res = rec(this)
    res.forEach((n, i) => { this[i] = n })
}
const arr = [5,4,3,2,1]
arr.mergeSort()
console.log(arr)
~~~

快速排序:

~~~js
Array.prototype.quickSort = function () {
    const rec = (arr) => {
        if (arr.length === 1) { return arr; }
        const left = []
        const right = []
        const mid = arr[0]
        for (let i = 1; i < arr.length; i++){
            if (arr[i] < mid){
                left.push(arr[i])
            }else {
                right.push(arr[i])
            }
        }
        return [...rec(left), mid, ...rec(right)]
    };
    const res = rec(this);
    res.forEach((n, i) => {
        this[i] = n
    })
}
const arr = [2,4,3,5,1]
arr.quickSort()
console.log(arr)
~~~

LeetCode示例: 第21题

~~~js
/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} l1
 * @param {ListNode} l2
 * @return {ListNode}
 */
var mergeTwoLists = function(l1, l2) {
    let res = new ListNode(0)
    let p = res
    let p1 = l1
    let p2 = l2
    while(p1&&p2){
        if(p1.val < p2.val){
            p.next = p1
            p1 = p1.next
        }else{
            p.next = p2
            p2 = p2.next
        }
        p = p.next
    }
    if(p1){
        p.next = p1
    }
    if(p2){
        p.next = p2
    }
    return res.next
};
~~~



## 搜索

顺序搜索:

~~~js
Array.prototype.sequentialSearch = function (item) {
    for (let i = 0; i < this.length; i++){
        if (this[i] === item) {
            return i
        }
    }
    return -1
}
const arr = [5,4,3,2,1].sequentialSearch(3)
console.log(arr)
~~~

二分搜索:

~~~js
Array.prototype.binarySearch = function (item) {
    let low = 0
    let high = this.length - 1
    while (low <= high){
        const mid = Math.floor((low + high) / 2)
        const element = this[mid]
        if (element < item){
            low = mid + 1
        }else if (element > item){
            high = mid - 1
        }else {
            return mid
        }
    }
    return -1
}
const arr = [5,4,3,2,1].binarySearch(3)
console.log(arr)
~~~



LeetCode示例: 第374题

~~~js
/** 
 * Forward declaration of guess API.
 * @param {number} num   your guess
 * @return 	            -1 if num is lower than the guess number
 *			             1 if num is higher than the guess number
 *                       otherwise return 0
 * var guess = function(num) {}
 */

/**
 * @param {number} n
 * @return {number}
 */
var guessNumber = function(n) {
    let low = 1
    let high = n
    while(low <= high){
        const mid = Math.floor((low + high) / 2)
        const res = guess(mid)
        if(res === 0){
            return mid
        }else if(res === 1){
            low = mid + 1
        }else{
            high = mid - 1
        }
    }
};
~~~

