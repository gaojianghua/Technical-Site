export default {
    lang: "zh-CN",
    title: "Woffly",
    description: "Woffly",
    lastUpdated: true,
    themeConfig: {
        siteTitle: "Woffly",
        logo: "/woffly.png",
        sidebar: {
            "/guide/": sidebarGuide(),
        },
        socialLinks: [
            { icon: "github", link: "https://github.com/gaojianghua" },
            { icon: "twitter", link: "https://twitter.com/VIPWoffly" },
            { icon: "discord", link: "https://discord.gg/RuMHus8Bkg" },
            {
                icon: "youtube",
                link: "https://www.youtube.com/channel/UC6WLTyRQCoNQn69qd3sX1cQ/featured",
            },
            {
                icon: "facebook",
                link: "https://www.facebook.com/profile.php?id=100082765715223",
            },
        ],
        footer: {
            message: "邮箱：g598670138@163.com 个人微信号：woshigaojianghua",
            copyright:
                "Copyright © 2022-present JiangHua Gao 版权所有 浙ICP备2022001576号",
        },
        editLink: {
            pattern: "https://github.com/gaojianghua",
            text: "Edit this page on GitHub",
        },
        algolia: {
            appId: "8J64VVRP8K",
            apiKey: "a18e2f4cc5665f6602c5631fd868adfd",
            indexName: "vitepress",
        }
    },
};
function sidebarGuide() {
    return [
        {
            text: "常识",
            collapsible: true,
            items: [
                { text: "Process To Thread", link: "/guide/process-to-thread" },
                { text: "URL To CRP", link: "/guide/url-to-crp" },
            ],
        },
        {
            text: "前端",
            collapsible: true,
            items: [
                { text: "HTML", link: "/guide/html" },
                { text: "CSS", link: "/guide/css" },
                { text: "JavaScript", link: "/guide/javascript" },
                { text: "Vue", link: "/guide/vue" },
                { text: "React", link: "/guide/react" },
            ],
        },
        {
            text: "移动端",
            collapsible: true,
            items: [
                { text: "H5", link: "/guide/h5" },
                { text: "UniApp", link: "/guide/uniapp" },
                { text: "Small Program", link: "/guide/small-program" },
                { text: "React Native", link: "/guide/react-native" },
                { text: "Flutter", link: "/guide/flutter" },
                { text: "Taro", link: "/guide/taro" },
            ],
        },
        {
            text: "数据库",
            collapsible: true,
            items: [
                { text: "Mysql", link: "/guide/mysql" },
                { text: "Redis", link: "/guide/redis" },
            ],
        },
        {
            text: "服务端",
            collapsible: true,
            items: [
                { text: "GoLang", link: "/guide/goLang" },
                { text: "Gin", link: "/guide/gin" },
                { text: "Node", link: "/guide/node" },
                { text: "Nest", link: "/guide/nest" },
            ],
        },
        {
            text: "运维",
            collapsible: true,
            items: [
                { text: "Linux", link: "/guide/linux" },
                { text: "Docker", link: "/guide/docker" },
                { text: "Shell", link: "/guide/shell" },
            ],
        },
        {
            text: "算法",
            collapsible: true,
            items: [
                { text: "Data Structure", link: "/guide/data-structure" },
                { text: "algorithm", link: "/guide/algorithm" },
            ],
        },
        {
            text: "扩展",
            collapsible: true,
            items: [
                { text: "Design Patterns", link: "/guide/design-patterns" },
                { text: "JavaScript Extension", link: "/guide/javascript-extension" },
            ],
        },
    ];
}
