# UniApp
## 模板
[uniapp模板](https://github.com/gaojianghua/uniapp-tmp "uniapp模板")
## 优缺点
- 优
  - 一套代码，多端运行
  - 插件市场，生态强大
  - 成本较低，效率较高
- 缺
  - 性能较差，兼容较差

## nvue

uni-app渲染引擎:

- 性能略次
- 可直接使用uni-app组件

weex渲染引擎:

- 性能略优
- 需要使用weex官方组件
- 必须遵循weex规范

### html

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

   ~~~css
   display: flex;
   flex-direction: column;
   ~~~

7. 存放文字必须使用标签: 
    ~~~html
    <text></text>
    ~~~
   - 字体样式不继承父元素

### css

1. 单位只支持: rpx, px	不支持: em, rem, pt, %, upx

2. 不能使用预编译语言: less, scss等

3. 最后出现的层级最高, 不支持: z-index

4. 默认盒子属性并且不可修改: 

   ~~~css
   box-sizing: border-box;
   ~~~

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

### js

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



## APP上架

### 安卓上架

1. 各开放平台的开发者账号申请及认证 (免费)

   - 主流平台（自行选择想要上架的平台进行申请和认证）：

     | 平台 | 网址                                      |
     | ---- | ----------------------------------------- |
     | 华为 | https://developer.huawei.com/consumer/cn/ |
     | 腾讯 | https://wikinew.open.qq.com/              |
     | 小米 | https://dev.mi.com/console/               |
     | 百度 | http://app.baidu.com/                     |
     | 阿里 | http://open.uc.cn/                        |
     | 360  | http://dev.360.cn/                        |
     | Vivo | https://dev.vivo.com.cn/home              |
     | oppo | https://open.oppomobile.com/              |
     | 搜狗 | http://zhushou.sogou.com/open/            |
     | 魅族 | http://open.flyme.cn/                     |
     | 联想 | http://open.lenovomm.com/developer/       |

   -   开发者类型

     - 个人开发者账号：认证需个人手持身份证拍照上传（部分平台不支持个人开发者上传App）
     - 公司开发者账号：认证需公司营业执照、开户银行账号信息等，部分平台需公司法人手持身份证拍照上传
     - 以上认证所需资料可能各平台略有不同

2. 软著 (计算机软件著作权) (收费)

   - 申请时间及费用 (仅做参考)

     - | 工作日(不含节假日) | 费用(无材料) | 费用(有材料) |
       | :----------------: | :----------: | :----------: |
       |     1个工作日      |    可协商    |    可协商    |
       |     2个工作日      |    可协商    |    可协商    |
       |     3个工作日      |  5200元/件   |  5000元/件   |
       |     4个工作日      |  4700元/件   |  4400元/件   |
       |     5个工作日      |  4200元/件   |  3900元/件   |
       |    6-10个工作日    |  3800元/件   |  3500元/件   |
       |   11-15个工作日    |  3200元/件   |  2900元/件   |
       |   16-20个工作日    |  2700元/件   |  2500元/件   |
       |   21-25个工作日    |  2400元/件   |  2200元/件   |
       |   26-30个工作日    |  2100元/件   |  1900元/件   |
       |    31-&个工作日    |  1800元/件   |  1600元/件   |

   - 软著主体与开发者账号主体最好保持一致（即申请软著的主体和开发者账号主体是同一公司），若不一致，提交App时还需要双方的授权书。

   - 部分平台上架时可能需要额外的资质文件，如华为需要签署免责函等。

### 苹果上架

#### 开发者账号申请（收费）

1. 个人开发者账号

   - 费用：$99 /年 (￥688/年)
   - 时间：30min（填好信息付完账走完流程就可以了）
   - 协作人数：仅限开发者自己
   - 最大udid支持数（内测时添加的设备数）：100
   - App Store上架：是
   - 该账号在App Store销售者只能显示个人的ID，比如 Abu
   - 说明：“个人”开发者可以申请升级“公司”

   

2. 公司开发者账号

   - 费用：$99 /年 (￥688/年)
   - 时间：15-20个工作日（公司没有邓百氏编码的情况下）
   - 所需资料：公司营业执照等
   - 协作人数：多人
   - 最大udid支持数（内测时添加的设备数）：100
   - App Store上架：是
   - 该账号在App Store销售时可以显示类似Studios，或者自定义的团队名称，例如：Game omiga
   - 公司账号可以自己定义一定数量的开发者子账号，不过只能由主账号来执行提交，发布等操作。
   - 说明：允许多个开发者进行协作开发，比个人多一些帐号管理的设置，可设置多个Apple ID，分4种管理级别的权限。公司帐号比个人多一些帐号管理的设置：个人帐号集Agent，Admin，Developer等为一身，而公司帐号可以设置不同的AppleID来担当。
   - 分4种管理级别权限：
     - Admin Legal权限：超级管理员。可以管理开发者和管理app store中的应用。
     - Admin权限：管理员，可以管理开发者。添加测试机子和管理团队证书。
     - Member权限：是普通开发者。只能下载证书和使用证书
     - No Access权限：没有相应的权限。

3.  企业开发者账号

   - 费用：$299 /年 (￥2010/年)
   - 时间：30个工作日以上
   - 难度：大
   - 协作人数：多人
   - 企业开发者不能通过app store途径发app，但是可以直接无上限的分发app（in-house 发布）
   - 说明：企业账号不能上线应用到App Store，适用于那些不希望公开发布应用的企业且还需要大量安装使用的公司。

4. 该怎么选择账号类型

   - 个人账号：简单的发布一个应用，适合个人公司用户。
   - 公司账号：希望以公司品牌来发布应用，适合公司用户。
   - 企业账号：希望不审核，直接扫码下载应用，适合一些不可说目的的用户。

**注意**：企业账号的设备数无限制，并且不用通过App Store的审核，还是奉劝一下大家，苹果的管控是十分严格的，任何违背苹果条款运用企业账号，都会有企业账号被封的可能性。

申请苹果企业开发者账号需要准备一个公司的资质（包含企业营业执照、企业邮箱，企业网站），最好是资质较好的企业，因为目前申请iOS企业开发者账号的难度非常的大，除非资质非常好的企业，才可能申请到iOS企业开发者账号。
