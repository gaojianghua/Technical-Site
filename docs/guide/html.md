# HTML

## 头部meta标签
~~~html
<!DOCTYPE html> <!-- 使用 HTML5 doctype，不区分大小写 -->
<html lang="zh-cmn-Hans"> <!-- 更加标准的 lang 属性写法 http://zhi.hu/XyIa -->
<head>
    <!-- 声明文档使用的字符编码 -->
    <meta charset='utf-8'>
    <!-- 页面内容描述 -->
    <meta name="description" content="不超过150个字符"/>
    <!-- 页面关键词 -->
    <meta name="keywords" content=""/>
    <!-- 网页作者 -->
    <meta name="author" content="高江华, g598670138@163.com"/>
    <!-- 搜索引擎抓取
        1.none : 搜索引擎将忽略此网页，等价于noindex，nofollow。
        2.noindex : 搜索引擎不索引此网页。
        3.nofollow: 搜索引擎不继续通过此网页的链接索引搜索其它的网页。
        4.all : 搜索引擎将索引此网页与继续通过此网页的链接索引，等价于index，follow。
        5.index : 搜索引擎索引此网页。
        6.follow : 搜索引擎继续通过此网页的链接索引搜索其它的网页。
    -->
    <meta name="robots" content="index,follow"/>
    <!-- 为移动设备添加 viewport
        `width=device-width` 会导致 iPhone 5 添加到主屏后以 WebApp 全屏模式打开页面时出现黑边 http://bigc.at/ios-webapp-viewport-meta.orz 
    -->
    <meta name="viewport" content="initial-scale=1, maximum-scale=3, minimum-scale=1, user-scalable=no" />
 
    <!-- iOS 设备 begin -->
    <!-- 添加到主屏后的标题（iOS 6 新增） -->
    <meta name="apple-mobile-web-app-title" content="标题" />
     <!-- 是否启用 WebApp 全屏模式，删除苹果默认的工具栏和菜单栏 -->
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    <!-- 添加智能 App 广告条 Smart App Banner（iOS 6+ Safari） -->
    <meta name="apple-itunes-app" content="app-id=myAppStoreID, affiliate-data=myAffiliateData, app-argument=myURL" />
    <!-- 设置苹果工具栏颜色 -->
    <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
    <!-- 忽略页面中的数字识别为电话，忽略email识别 -->
    <meta name="format-detection" content="telphone=no, email=no"/>
    
    <!-- 双核浏览器渲染方式
        webkit //默认webkit内核
        ie-comp //默认IE兼容模式
        ie-stand //默认IE标准模式
    -->
    <meta name="renderer" content="webkit" />
    <!-- 针对手持设备优化，主要是针对一些老的不识别viewport的浏览器，比如黑莓 -->
    <meta name="HandheldFriendly" content="true" />
    <!-- 微软的老式浏览器 -->
    <meta name="MobileOptimized" content="320" />
    <!-- uc强制竖屏 -->
    <meta name="screen-orientation" content="portrait" />
    <!-- QQ强制竖屏 -->
    <meta name="x5-orientation" content="portrait" />
    <!-- UC强制全屏 -->
    <meta name="full-screen" content="yes" />
    <!-- QQ强制全屏 -->
    <meta name="x5-fullscreen" content="true" />
    <!-- UC应用模式 -->
    <meta name="browsermode" content="application" />
    <!-- QQ应用模式 -->
    <meta name="x5-page-mode" content="app" />
    <!-- windows phone 点击无高光 -->
    <meta name="msapplication-tap-highlight" content="no" />
    <!-- 用于标明网页是什么软件做的 -->
    <meta name="generator" content="Sublime Text3" />
    <!-- 用于标注版权信息 -->
    <meta name="copyright" content="高江华" />
    <!-- 搜索引擎爬虫重访时间
        如果页面不是经常更新，为了减轻搜索引擎爬虫对服务器带来的压力，可以设置一个爬虫的重访时间。如果重访时间过短，爬虫将按它们定义的默认时间来访问
    -->
    <meta name="revisit-after" content="7 days" />

    <!-- [ http-equiv ] -->
    <!-- 浏览器采取何种版本渲染当前页面(优先使用 IE 最新版本和 Chrome) -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <!-- 避免IE使用兼容模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!-- 不让百度转码 -->
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <!-- 设定网页字符集(推荐使用HTML5的方式)
        下面是旧的HTML字符集配置，不推荐
    -->
    <meta http-equiv="content-Type" content="text/html;charset=utf-8">
    <!-- 指定请求和响应遵循的缓存机制
        no-cache: 先发送请求，与服务器确认该资源是否被更改，如果未被更改，则使用缓存。
        no-store: 不允许缓存，每次都要去服务器上，下载完整的响应。（安全措施）
        public : 缓存所有响应，但并非必须。因为max-age也可以做到相同效果
        private : 只为单个用户缓存，因此不允许任何中继进行缓存。（比如说CDN就不允许缓存private的响应）
        maxage : 表示当前请求开始，该响应在多久内能被缓存和重用，而不去服务器重新请求。例如：max-age=60表示响应可以再缓存和重用 60 秒。
    -->
    <meta http-equiv="cache-control" content="no-cache" />
    <!-- 禁止百度自动转码 
        用于禁止当前页面在移动端浏览时，被百度自动转码。虽然百度的本意是好的，但是转码效果很多时候却不尽人意。所以可以在head中加入例子中的那句话，就可以避免百度自动转码了
    -->
    <meta http-equiv="Cache-Control" content="no-siteapp" />
    <!-- 网页到期时间(用于设定网页的到期时间，过期后网页必须到服务器上重新传输) -->
    <meta http-equiv="expires" content="Sunday 26 October 2016 01:00 GMT" />
    <!-- 自动刷新并指向某页面(网页将在设定的时间内，自动刷新并调向设定的网址) 
        以下是2秒后跳转到指定网页
    -->
    <meta http-equiv="refresh" content="2；URL=http://gaojianghua.cn/" />
    <!-- cookie设定 (如果网页过期。那么这个网页存在本地的cookies也会被自动删除)
        <meta http-equiv="Set-Cookie" content="name, date" /> //格式
    -->
    <meta http-equiv="Set-Cookie" content="User=gaojianghua; path=/; expires=Sunday, 10-Jan-16 10:00:00 GMT" />
    <!-- 启动DNS预解析, 以及src与href属性的预解析-->
    <meta http-equiv="x-dns-prefetch-control" content="on" />

    <!-- [ rel ] -->
    <!-- iOS 图标 begin -->
    <link rel="apple-touch-icon-precomposed" href="/apple-touch-icon-57x57-precomposed.png"/>
    <!-- iPhone 和 iTouch，默认 57x57 像素，必须有 -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/apple-touch-icon-114x114-precomposed.png"/>
    <!-- Retina iPhone 和 Retina iTouch，114x114 像素，可以没有，但推荐有 -->
    <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/apple-touch-icon-144x144-precomposed.png"/>
    <!-- Retina iPad，144x144 像素，可以没有，但推荐有 -->
    <!-- iOS 图标 end -->
 
    <!-- iOS 启动画面 begin -->
    <link rel="apple-touch-startup-image" sizes="768x1004" href="/splash-screen-768x1004.png"/>
    <!-- iPad 竖屏 768 x 1004（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="1536x2008" href="/splash-screen-1536x2008.png"/>
    <!-- iPad 竖屏 1536x2008（Retina） -->
    <link rel="apple-touch-startup-image" sizes="1024x748" href="/Default-Portrait-1024x748.png"/>
    <!-- iPad 横屏 1024x748（标准分辨率） -->
    <link rel="apple-touch-startup-image" sizes="2048x1496" href="/splash-screen-2048x1496.png"/>
    <!-- iPad 横屏 2048x1496（Retina） -->
 
    <link rel="apple-touch-startup-image" href="/splash-screen-320x480.png"/>
    <!-- iPhone/iPod Touch 竖屏 320x480 (标准分辨率) -->
    <link rel="apple-touch-startup-image" sizes="640x960" href="/splash-screen-640x960.png"/>
    <!-- iPhone/iPod Touch 竖屏 640x960 (Retina) -->
    <link rel="apple-touch-startup-image" sizes="640x1136" href="/splash-screen-640x1136.png"/>
    <!-- iPhone 5/iPod Touch 5 竖屏 640x1136 (Retina) -->
    <!-- iOS 启动画面 end -->
 
    <!-- iOS 设备 end -->
    <meta name="msapplication-TileColor" content="#000"/>
    <!-- Windows 8 磁贴颜色 -->
    <meta name="msapplication-TileImage" content="icon.png"/>
    <!-- Windows 8 磁贴图标 -->
 
    <link rel="alternate" type="application/rss+xml" title="RSS" href="/rss.xml"/>
    <!-- 添加 RSS 订阅 -->
    <link rel="shortcut icon" type="image/ico" href="/favicon.ico"/>
    <!-- 添加 favicon icon -->

    <!-- sns 社交标签 begin
        Open Graph Protocol，是 Facebook 制订的一个社交网络分享协议，有了上面的内容，分享之后会带上更多的信息、展示图片等，让分享的内容更吸引人
     -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://gaojianghua.cn/docs/" />
    <meta property="og:title" content="Wolffy-Document" />
    <meta property="og:image" content="https://gaojianghua.oss-cn-hangzhou.aliyuncs.com/home/%E7%81%B0%E5%A4%AA%E7%8B%BC.png" />
    <meta property="og:description" content="技术博客--前端后端运维知识点收录: Vue, React, Taro, ReactNative, Webpack, Vite, UniApp, 小程序, H5, Docker, GitGoLang, Node, Nest, Mysql, Redis, 数据结构, 算法" />
    <!-- sns 社交标签 end -->
 
    <title>标题</title>
</head>
~~~

## 头部link标签
~~~html
<!DOCTYPE html> <!-- 使用 HTML5 doctype，不区分大小写 -->
<html lang="zh-cmn-Hans"> <!-- 更加标准的 lang 属性写法 http://zhi.hu/XyIa -->
<head>
    <!-- [link] 
        属性: 
        href：指明外部资源文件的路径，即告诉浏览器外部资源的位置
        hreflang：说明外部资源使用的语言
        media：说明外部资源用于哪种设备
        rel：必填，表明当前文档和外部资源的关系
        sizes：指定图标的大小，只对属性rel="icon"生效
        type：说明外部资源的 MIME 类型，如text/css、image/x-icon
    -->
    <!-- title属性会控制css样式文件的加载方式
        无title属性：ref=stylesheet时css样式始终都会加载并渲染
        有title属性：ref=stylesheet时css样式会作为默认样式加载并渲染
        有title属性：ref=alternate stylesheet时css样式会作为预备样式渲染，默认不加载
     -->
    <link rel="stylesheet" type="text/css" href="./index.css">
    <!-- alternate (用于主题样式切换，将css作为预备样式，通过对link使用disabled进行切换) -->
    <link rel="alternate stylesheet" type="text/css" href="./index.css" title="gaojianghua" />
    <!-- alternate (也可以做处于移动端访问时跳转H5的网页) -->
    <link rel="alternate" media="only screen and (max-width:750px)" href="https://gaojianghua.cn/docs/" />
    <!-- 指定网页的规范版本，搜索引擎则会把权重集中到规范版本页面，由此提升网页的权重，排名更加靠前
        可指定为PC端网页, 区分H5移动端
    -->
    <link rel="canonical" href="https://gaojianghua.cn/docs/" />
    <!-- DNS预解析 (link方式的DNS的预解析与页面的加载是并行处理的，不会影响到页面的加载性能) -->
    <link rel="dns-prefetch" href="https://gaojianghua.cn/docs/" />
    <!-- 链接到外部，告知浏览器，此链接非本站链接 -->
    <link rel="external" href="" />
    <!-- 链接到集合中的首个文档 -->
    <link rel="first" href="" />
    <!-- 链接帮助信息 -->
    <link rel="help" href="" />
    <!-- 定义网站或网页在浏览器标题栏中的图标 -->
    <link rel="icon" href="favicon.ico" />
    <!-- 链接到文档的版权信息，即文档的版权声明 -->
    <link rel="license" href="" />
    <!-- 链接到集合中的末尾文档 -->
    <link rel="last" href="" />
    <!-- 指定页面不被搜索引擎跟踪，或者此页面不被搜索引擎爬取 -->
    <link rel="nofollow" href="" />
    <a href="https://gaojianghua.cn/docs/" rel="nofollow"></a>
    <!-- 用于记录文档的下一页，可提示浏览器文章的开始URL，且浏览器可提前加载此页 -->
    <link rel="start" href="https://gaojianghua.cn/docs/" />
    <!-- 阻止浏览器发送访问来源信息 -->
    <link rel="noreferrer" href="" />
    <!-- 在页面渲染之前对资源进行预加载，且不易阻塞页面的初步渲染
        其中href和as属性用于指定被加载资源的路径和类型，as指定资源的类型后，浏览器可以更加精确地优化资源加载优先级。
        as属性值:
        audio: 音频文件。
        document: 一个将要被嵌入到[<frame>]或[<iframe>]内部的HTML文档。
        embed: 一个将要被嵌入到[<embed>]元素内部的资源。
        fetch: 那些将要通过fetch和XHR请求来获取的资源，比如一个ArrayBuffer或JSON文件。
        font: 字体文件。
        image: 图片文件。
        object: 一个将会被嵌入到[<embed>]元素内的文件。
        script: JavaScript文件。
        style: 样式表。
        track: WebVTT文件。
        worker: 一个JavaScript的web worker或shared worker。
        video: 视频文件。
    -->
    <link rel="preload" href="main.js" as="script" />
    <!-- 博客中用来通知其他文章被引用的一种方式 -->
    <link rel="pingback" href="https://gaojianghua.cn/docs/" />
    <!-- 空闲时预加载未来要使用的资源，优先级较低，一般用于加载非本页的其他页面所需要的资源，以便加快后续页面的首屏渲染速度。
        资源加载完成后，可以被缓存 
    -->
    <link rel="prefetch" href="" />
    <!-- 优化可能导航到的下一页上的资源的加载，在后台渲染了整个页面以及整个页面所有的资源 -->
    <link rel="preconnect" href=""/>
    <!-- 允许浏览器在一个 HTTP 请求正式发给服务器前预先执行一些操作，建立与服务器的连接
        其中包括DNS预解析、TLS协商、TCP握手
        消除了往返延迟并为用户节省了时间，以便后续可以更快地获取链接内容
        crossorigin: 浏览器为该模式维护一个单独的套接字池
    -->
    <link rel="preconnect" href="https://gaojianghua.cn/docs/" crossorigin />
    <!-- 用于记录文档的上一页 -->
    <link rel="prev" href="" />
    <!-- 链接到文档的搜索工具 -->
    <link rel="search" href="" />
    <!-- 指定作为样式表的外部资源，若未设置type，浏览器默认为text/css -->
    <link rel="stylesheet" href="style.css" />
    <!-- 指定当前文档使用的标签、关键词 -->
    <link rel="tag" href="" />
    <!-- 指向一个文档，此文档提供此网页的上下文关系 -->
    <link rel="up" href="" />
    <title>标题</title>
</head>

~~~