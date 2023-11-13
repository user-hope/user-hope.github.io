import { defineUserConfig } from 'vuepress';
import { searchProPlugin } from 'vuepress-plugin-search-pro';
import HopeTheme from './vuepress.theme';

export default defineUserConfig({
    base: '/',
    lang: 'zh-CN',
    title: 'vuepress 个人站点',
    description: '原 docsify 站点内容比较多, 将一部分文档放在 vuepress 上',
    head: [
        ['link', { rel: 'icon', href: '/images/icon.png' }]
    ],
    theme: HopeTheme,
    plugins: [
        searchProPlugin({
            indexContent: true,
            customFields: [
                { getter: (page) => page.frontmatter.description, formatter: "描述: $content" }
            ]
        })
    ]
})

