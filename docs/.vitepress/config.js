export default {
    lang: 'zh-CN',
    title: 'Wolffy',
    base: '/docs/',
    description:
        '技术博客--前端后端运维知识点收录: Vue, React, Taro, ReactNative, Webpack, Vite, UniApp, 小程序, H5, Docker, GitGoLang, Node, Nest, Mysql, Redis, 数据结构, 算法',
    lastUpdated: true,
    ignoreDeadLinks: true,
    head: [
        ['link', { rel: 'icon', href: 'https://gaojianghua.oss-cn-hangzhou.aliyuncs.com/home/wolffy.ico' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:title', content: '高江华' }],
    ],
    themeConfig: {
        siteTitle: 'Wolffy',
        logo: 'https://gaojianghua.oss-cn-hangzhou.aliyuncs.com/home/wolffy.png',
        sidebar: {
            '/guide/': sidebarGuide(),
        },
        socialLinks: [
            { icon: 'github', link: 'https://github.com/gaojianghua' },
            { icon: 'twitter', link: 'https://twitter.com/VIPWoffly' },
            { icon: 'discord', link: 'https://discord.gg/RuMHus8Bkg' },
            {
                icon: 'youtube',
                link: 'https://www.youtube.com/channel/UC6WLTyRQCoNQn69qd3sX1cQ/featured',
            },
            {
                icon: 'facebook',
                link: 'https://www.facebook.com/profile.php?id=100082765715223',
            },
        ],
        footer: {
            message: '邮箱：g598670138@163.com 个人微信号：woshigaojianghua',
            copyright:
                'Copyright © 2022-present JiangHua Gao 版权所有 浙ICP备2022001576号',
        },
        editLink: {
            pattern: 'https://github.com/gaojianghua',
            text: 'Edit this page on GitHub',
        },
        algolia: {
            appId: '8J64VVRP8K',
            apiKey: 'a18e2f4cc5665f6602c5631fd868adfd',
            indexName: 'vitepress',
        },
    }
};

function sidebarGuide() {
    const menus = [
        {
            text: '常识',
            collapsible: true,
            items: [
                { text: 'Process To Thread', link: '/guide/process-to-thread' },
                { text: 'URL To CRP', link: '/guide/url-to-crp' },
            ],
        },
        {
            text: '前端',
            collapsible: true,
            items: [
                { text: 'HTML', link: '/guide/html' },
                { text: 'CSS', link: '/guide/css' },
                { text: 'JavaScript', link: '/guide/javascript' },
                { text: 'TypeScript', link: '/guide/typescript' },
                { text: 'JQuery', link: '/guide/jquery' },
                { text: 'Vue', link: '/guide/vue' },
                { text: 'React', link: '/guide/react' },
                { text: 'Vite', link: '/guide/vite' },
                { text: 'WebPack', link: '/guide/webpack' },
                { text: 'Test', link: '/guide/test' },
                { text: 'RxJS', link: '/guide/rxjs' },
                { text: 'Electron', link: '/guide/electron' },
                { text: 'Three', link: '/guide/three' },
                { text: 'Micro-Frontends', link: '/guide/micro-frontends' },
            ],
        },
        {
            text: '移动端',
            collapsible: true,
            items: [
                { text: 'H5', link: '/guide/h5' },
                { text: 'UniApp', link: '/guide/uniapp' },
                { text: 'Small Program', link: '/guide/small-program' },
                { text: 'React Native', link: '/guide/react-native' },
                { text: 'Flutter', link: '/guide/flutter' },
                { text: 'Taro', link: '/guide/taro' },
            ],
        },
        {
            text: '数据库',
            collapsible: true,
            items: [
                { text: 'Mysql', link: '/guide/mysql' },
                { text: 'Redis', link: '/guide/redis' },
            ],
        },
        {
            text: '服务端',
            collapsible: true,
            items: [
                { text: 'GoLang', link: '/guide/goLang' },
                { text: 'Gin', link: '/guide/gin' },
                { text: 'Grpc', link: '/guide/grpc' },
                { text: 'Node', link: '/guide/node' },
                { text: 'Nest', link: '/guide/nest' },
                { text: 'Micro-Services', link: '/guide/micro-services' },
            ],
        },
        {
            text: '运维',
            collapsible: true,
            items: [
                { text: 'Linux', link: '/guide/linux' },
                { text: 'CentOS', link: '/guide/centos' },
                { text: 'Ubuntu', link: '/guide/ubuntu' },
                { text: 'Docker', link: '/guide/docker' },
                { text: 'Shell', link: '/guide/shell' },
            ],
        },
        {
            text: '算法',
            collapsible: true,
            items: [
                { text: 'Data Structure', link: '/guide/data-structure' },
                { text: 'algorithm', link: '/guide/algorithm' },
            ],
        },
        {
            text: '扩展',
            collapsible: true,
            items: [
                { text: 'Design Patterns', link: '/guide/design-patterns' },
                { text: 'JavaScript Extension', link: '/guide/javascript-extension' },
                { text: 'Web Security', link: '/guide/web-security' },
                { text: 'WebAssembly', link: '/guide/webAssembly' },
                { text: 'WebRTC', link: '/guide/webrtc' },
            ],
        },
        {
            text: '工具',
            collapsible: true,
            items: [
                { text: 'Nvm', link: '/guide/nvm' },
                { text: 'PM2', link: '/guide/pm2' },
                { text: 'Git', link: '/guide/git' },
                { text: 'PS', link: '/guide/ps' },
            ],
        },
    ];
    return menus;
}
