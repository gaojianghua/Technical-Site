# 优缺点

- 优
  - 一套代码，多端运行
  - 插件市场，生态强大
  - 成本较低，效率较高
- 缺
  - 性能较差，兼容较差



# nvue

uni-app渲染引擎:

- 性能略次
- 可直接使用uni-app组件

weex渲染引擎:

- 性能略优
- 需要使用weex官方组件
- 必须遵循weex规范

## html

1. 盒子标签: 
    ~~~html
    <div></div>
    ~~~
2. 默认页面无法滚动, 需要使用滚动标签: 
    ~~~html
    <list></list>与<scroller></scroller>
    ~~~

3. **list**标签中存放内容必须使用标签: 

   - `<cell></cell>: 用于定义列表中的子列表项, weex会对<cell></cell>进行高效的内存回收以达到更好的性能`
   - `<header></header>: 到达屏幕顶部时, 会吸附于屏幕顶部`
   - `<refresh></refresh>: 用于给列表添加下拉刷新功能`
   - `<loading></loading>: 用于给列表添加上拉加载功能`

4. 图片必须指定宽高

5. 不支持v-show

6. 默认布局为: 

   ```css
   display: flex;
   flex-direction: column;
   ```

7. 存放文字必须使用标签: 
    ~~~html
    <text></text>
    ~~~
   - 字体样式不继承父元素







## css

1. 单位只支持: rpx, px	不支持: em, rem, pt, %, upx

2. 不能使用预编译语言: less, scss等

3. 最后出现的层级最高, 不支持: z-index

4. 默认盒子属性并且不可修改: 

   ```css
   box-sizing: border-box;
   ```

5. 不支持背景图片, 需使用定位实现

6. 不支持阴影效果

7. 字体图标需使用Unicode编码

8. 只支持单类选择器, 并集选择器

9. 样式属性必须分开写, 不可使用简写, 如: 

   ```css
    border-width: 5rpx;
    border-color: red;
    border-style: solid;	//默认值为: solid 可不写
   ```
   
10. 字体引入与动画需要使用dom对象实现:

    - 引入字体图标

      ```js
      const domModule = weex.requireModule('dom')
      domModule.addRule('fontFace', {
        'fontFamily': "iconfont",
        'src':"url('http://at.alicdn.com/t/font_1859985_7mxozsfdvib.ttf')"
      });
      ```

11. 定位偏移量优先级：top高于bottom，left高于right。

    - 使用规则：

      ```css
      position: fixed;
      top: auto;		//必须使用
      left: auto;		//必须使用
      bottom: 5rpx;
      right: 5rpx;
      ```

12. 不支持white-space控制文本换行, 可设置lines属性, 值为多少则显示多少行。

13. 样式文件引入需使用:

    ```css
    <style src="@/common/nvue-common.css"></style>
    ```

14. 宽: 750px=100%  高: 1250px=100%





## js

1. 生命周期函数: 同vue生命周期

2. nvue与vue通讯:
   - 一　：nvue传vue
     - uni.postMessage( data ): 在nvue页面中使用，发送data数据。
     - onUniNViewMessage( e ): 与App.vue文件中生命周期函数平级，监听uni.postMessage发送的数据。
     - uni.$emit( event, data ): 定义全局事件，event为事件名，data为数据，在onUniNViewMessage中使用。
     - uni.$on( event, data ): 监听全局事件，event为事件名，data为数据，在vue页面生命周期函数中使用
   - 二　：vue传nvue
     - getCurrentPages(): 当前页面栈实例，数组形式，第一个为首页，最后一个为当前页
     - $getAppWebview(): 获取getCurrentPages()中页面对象实例
     - plus.webview.postMessageToUniNView( data, nvueId ): 发送data数据，nvueId为页面对象实例Id
     - weex.requireModule( 'globalEvent' ): 引入全局持久化监听模块，在created中使用
     - globalEvent.addEventListener('plusMessage', e=>{}): 获取plus.webview.postMessageToUniNView发送的data数据，e为获取到的数据

3. vue和nvue共享变量和数据：不支持vuex
   - 使用本地存储：uni.getStorageSync()
   - 使用全局变量：App.vue中定义globalData对象，getApp().globalData获取或修改数据

4. nvue可使用的API:
   - uni.onNavigationBarButtonTap( e=>{} )：监听原生导航栏按钮，在created中使用，e为被点击的按钮属性数据
   - uni.onNavigationBarSearchInputClicked( ()=>{} )：监听原生导航栏点击事件，在created中使用
   - uni.onNavigationBarSearchInputChanged( e=>{} )：监听原生导航栏输入框内容变化，在created中使用，e.text为输入内容

## 获取胶囊信息
uni.getMenuButtonBoundingClientRect()     //获取胶囊的信息

~~~css
bottom:58	//胶囊包含top的高度
height:32	//胶囊的高度
left:278	//胶囊左边的距离
right:365	//胶囊包含左边一起的宽度
top:26	//距离顶部的距离
width:87	//胶囊的宽度
~~~

## 获取DOM高度

~~~js
uni.createSelectorQuery().select('.title').boundingClientRect(item => {
	this.titleHeight = item.height
}).exec()
~~~

## 监听全局GlobalData

~~~js
//App.vue文件内
export default {
    globalData: {
        status: null
	},
    onLaunch: function() {
        //获取code码, 静默授权
        uni.login({
            provider: 'weixin',
            success: async (res) => {
                let {
                    data,
                    code
                } = await this.$post('/v1/login/create', {
                    code: res.code
                })
                if (code == 200) {
                    console.log(data)
                    //当用户信息存在时
                    if(data.inviteCode && data.phone) {
                        //保存openId
                        uni.setStorageSync('openId', data.openId)
                        //更新vuex中的用户信息
                        this.$store.dispatch('getUserInfo', data)
                        //修改this.globalData.status
                        this.globalData.status = true
                    }else{		//当用户信息不存在时
                        this.globalData.status = false
                    }
                }
            }
        })
    },
    methods: {
        //全局监听globalData内的变量
        watch: function(method, istr){
            let obj = this.globalData
            //对globalData对象做代理
            Object.defineProperty(obj, istr, {
                configurable: true,		//能否通过delete删除istr
                enumerable: true,		//该属性是否可枚举
                set: function(value) {
                    //_consumerGoodsStatus是Object.defineProperty上的自定义属性
                    this._consumerGoodsStatus = value
                    //对应使用页面的getApp().watch(this.getcartcount, 'status')
                    method(value)
                },
                get: function(value) {
                    return this._consumerGoodsStatus
                }
            })
        }
    }
}

//需要使用的页面内
export default {
    onLoad() {
        if('此处判断是否需要使用静默授权') {
            uni.showLoading()
            //指定监听的变量变化后传入对应的函数中
            getApp().watch(this.getcartcount, 'status')
        }
    },
    methods: {
        //获取监听的全局变量中变化的值
        getcartcount(val){
            console.log('输出变化的值',val)
            let time = null
            if(val) {
                time = setTimeout(()=>{
                    //初始化函数, 静默授权后的具体操作
                    this.init()
                    uni.hideLoading()
                    clearTimeout(time)	//销毁定时器
                },500)
            }
        },
    }
}
~~~

## 解决精度问题

~~~js
var intNum = parseInt(floatNum * times + 0.5, 10)
~~~