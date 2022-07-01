# Vue2原理
## snabbdom

著名的虚拟dom库, diff算法的鼻祖, vue源码借鉴了snabbdom

  

## h函数

用来生成虚拟节点( vnode )

可嵌套, 一个子元素可以直接当参数传入, 多个需要用数组包裹

~~~js
h('a', { props: { href: 'http://www.baidu.com' } }, '高江华')
//生成的虚拟节点
{
  "sel": "a",
  "data": { props: { href: 'http://www.baidu.com' } },
  "text": "高江华"
}
//真实的DOM节点
<a href="http://www.baidu.com">高江华</a>
~~~

示例 ( 基于snabbdom ) :

~~~js
//创建patch函数
const patch = init([classModule, propsModule, styleModule, eventListenersModule])
//创建虚拟节点
const myVnode = h('a', { props: { href: 'http://www.baidu.com } }, '高江华')
//让虚拟节点上树
const container = document.getElementById('container')
patch(container, myVnode)
~~~



简易版手写虚拟DOM:

~~~js
function vnode(sel, data, children, text, elm) {
  return {
    sel, data, children, text, elm
  }
}
function h(sel, data, c) {
  if (arguments.length !== 3){
    throw new Error('必须传入3个参数')
  }
  if (typeof c == 'string' || typeof c == 'number'){
    return vnode(sel, data, undefined, c, undefined)
  }else if (Array.isArray(c)){
    let children = []
    for (let i = 0; i < c.length; i++){
      if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel')))
        throw new Error('传入的数组参数中有项不是h函数')
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  }else if (typeof c == 'object' && c.hasOwnProperty('sel')){
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  }else {
    throw new Error('传入的第三个参数不对')
  }
}
let myVnode = h('div', {}, [
  h('ul', {}, [
    h('li', {}, '苹果'),
    h('li', {}, '香蕉'),
    h('li', {}, '桔子'),
    h('li', {}, [
      h('p', {}, '123'),
      h('p', {}, '456')
    ]),
  ])
])
console.log(myVnode)
~~~



##  DIFF算法

- 最小量更新, key很重要, key是这个节点的唯一标识, 告诉diff算法, 在更改前后它们是同一个DOM节点

- 只有是同一个虚拟节点,才进行精细化比较, 否则暴力删旧插新

- 选择器相同且key相同就是同一虚拟节点

- 只进行同层比较, 不会进行跨层比较, 即使同一虚拟节点,但是跨层了也不会精细化比较, 只会删旧插新

- 四种命中查找: 设置四个指针 ( 新前 旧前 新后 旧后 )

  1. 新前与旧前
  2. 新后与旧后
  3. 新后与旧前 ( 此种发生了, 涉及移动节点, 那么新前指向的节点, 移动到旧后之后 )
  4. 新前与旧后 ( 此种发生了, 涉及移动节点, 那么新前指向的节点, 移动到旧前之前 )

  注: 命中一种就不再进行命中判断, 若没命中则继续顺序使用命中判断, 若都未命中则循环旧子节点查找有没有对应的新子节点



![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210105173343133.png)

精细化比较如下:

![](https://raw.githubusercontent.com/gaojianghua/PicGO/master/img/image-20210107111327461.png)



简易版diff算法:

~~~js
function vnode(sel, data, children, text, elm) {
  const key = data.key
  return {
    sel, data, children, text, elm, key
  }
}
function h(sel, data, c) {
  if (arguments.length !== 3){
    throw new Error('必须传入3个参数')
  }
  if (typeof c == 'string' || typeof c == 'number'){
    return vnode(sel, data, undefined, c, undefined)
  }else if (Array.isArray(c)){
    let children = []
    for (let i = 0; i < c.length; i++){
      if (!(typeof c[i] == 'object' && c[i].hasOwnProperty('sel')))
        throw new Error('传入的数组参数中有项不是h函数')
      children.push(c[i])
    }
    return vnode(sel, data, children, undefined, undefined)
  }else if (typeof c == 'object' && c.hasOwnProperty('sel')){
    let children = [c]
    return vnode(sel, data, children, undefined, undefined)
  }else {
    throw new Error('传入的第三个参数不对')
  }
}
function createElement(vnode) {
  let domNode = document.createElement(vnode.sel)
  if (vnode.text != '' && (vnode.children == undefined || vnode.children.length == 0)){
    domNode.innerText = vnode.text
    vnode.elm = domNode
  }else if (Array.isArray(vnode.children) && vnode.children.length > 0){
    for (let i = 0; i < vnode.children.length; i++){
      let ch = vnode.children[i]
      let chdom = createElement(ch)
      domNode.appendChild(chdom)
    }
  }
  vnode.elm = domNode
  return vnode.elm
}
function checkSameVnode(a, b) {
  return a.sel == b.sel && a.key == b.key
}
function updateChildren(parentElm, oldCh, newCh){
  //旧前
  let oldStartIdx = 0
  //新前
  let newStartIdx = 0
  //旧后
  let oldEndIdx = oldCh.length - 1
  //新后
  let newEndIdx = newCh.length - 1
  //旧前节点
  let oldStartVnode = oldCh[0]
  //旧后节点
  let oldEndVnode = oldCh[oldEndIdx]
  //新前节点
  let newStartVnode = newCh[0]
  //新后节点
  let newEndVnode = newCh[newEndIdx]
  //标杆
  let keyMap = null
  //循环精细化比较开始
  while (oldStartIdx <= oldEndIdx && newSrartIdx <= newEndIdx) {
    if (oldStartVnode === null || oldCh[oldStartIdx] === undefined){
      oldStartVnode = oldCh[++oldStartIdx]
    }else if (oldEndVnode === null || oldCh[oldEndIdx] === undefined){
      oldEndVnode = oldCh[--oldEndIdx]
    }else if (newStartVnode === null || newCh[newStartIdx] === undefined){
      newStartVnode = newCh[++newStartIdx]
    }else if (newEndVnode === null || newCh[newEndIdx] === undefined){
      newEndVnode = newCh[--newEndIdx]
    }else if (checkSameVnode(oldStartVnode, newSrartIdx)){
      patchVnode(oldStartVnode, newStartVnode)
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newSrartIdx]
    }else if (checkSameVnode(oldEndVnode,newEndVnode)){
      patchVnode(oldEndVnode, newEndVnode)
      oldEndVnode = oldCh[--oldEndIdx]
      newEndVnode = newCh[--newEndIdx]
    }else if (checkSameVnode(oldStartVnode,newEndVnode)){
      patchVnode(oldStartVnode, newEndVnode)
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm.nextSibling())
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    }else if (checkSameVnode(oldEndVnode,newStartVnode)){
      patchVnode(oldEndVnode,newStartVnode)
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm.nextSibling())
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    }else {
      //四种命中都未命中,则制作keyMap映射对象
      keyMap = {}
      if (!keyMap){
        //从oldStartIdx开始, 到oldEndIdx结束, 创建keyMap映射对象
        for (let i = oldStartIdx; i <= oldEndIdx; i++){
          const key = oldCh[i].key
          if (key !== undefined){
            keyMap[key] = i
          }
        }
      }
      const idxInOld = keyMap[newStartVnode.key]
      if (idxInOld === undefined){
        //是全新的项, 被加入的项(就是newStartVnode)现不是真正的DOM节点
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }else {
        //不是全新的项,需要移动
        const elmToMove = oldCh[idxInOld]
        patchVnode(elmToMove, newStartVnode)
        oldCh[idxInOld] = undefined
        parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm)
      }
      newStartVnode = newCh[++newStartIdx]
    }
  }
  //判断还有没有剩余的,start比end小
  if (newStartIdx <= newEndIdx){
    //new还有剩余节点没处理
    //const before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm
    for (let i = newStartIdx; i <= newEndIdx; i++){
      //insertBefore方法可以自动识别null, 如果是null就会自动排到队尾去, 和appendChild是一致的
      parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx].elm)
    }
  }else if (oldStartIdx <= oldEndIdx){
    //old还有剩余节点没处理
    for (let i = oldStartIdx; i <= oldEndIdx; i++){
      if (oldCh[i]){
        parentElm.removeChild(oldCh[i].elm)
      }
    }
  }
}
function patchVnode(oldVnode, newVnode) {
  if (oldVnode === newVnode) return ;
  if (newVnode.text != undefined && newVnode.children == undefined || newVnode.children.length == 0){
    if (newVnode.text != oldVnode.text){
      oldVnode.elm.innerText = newVnode.text
    }
  }else {
    if (oldVnode.children != undefined && oldVnode.children.length > 0){
      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    }else {
      oldVnode.elm.innerText = ''
      for (let i = 0; i < newVnode.children.length; i++){
        let dom = createElement(newVnode.children[i])
        oldVnode.elm.appendChild(dom)
      }
    }
  }
}
function patch(oldVnode, newVnode){
  if (oldVnode.sel == '' || oldVnode.sel == undefined){
    oldVnode = vnode(oldVnode.tagName.toLowerCase(), {}, [], undefined, oldVnode)
  }
  if (oldVnode.key == newVnode.key && oldVnode.sel == oldVnode.sel){
    patchVnode(oldVnode, newVnode)
  }else {
    let newVnodeElm = createElement(newVnode)
    if (oldVnode.elm && newVnodeElm) {
      oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm)
    }
    oldVnode.elm.parentNode.removeChild(oldVnode.elm)
  }
}
let myVnode1 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'E'}, 'E'),
])
const container = document.getElementById('container')
const btn = document.getElementById('btn')
patch(container, myVnode1)
const myVnode2 = h('ul', {}, [
  h('li', {key: 'A'}, 'A'),
  h('li', {key: 'B'}, 'B'),
  h('li', {key: 'C'}, 'C'),
  h('li', {key: 'D'}, 'D'),
  h('li', {key: 'E'}, 'E'),
  h('li', {key: 'F'}, 'F'),
  h('li', {key: 'G'}, 'G'),
])
btn.onclick = function(){
  patch(myVnode1, myVnode2)
}
~~~