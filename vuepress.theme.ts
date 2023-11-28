import { hopeTheme } from 'vuepress-theme-hope';
import NavBar from './vuepress.navbar';
import SideBar from './vuepress.sidebar';

/**
 * theme 插件扩展
 * https://theme-hope.vuejs.press/zh/guide/markdown/tex.html
 */

export default hopeTheme({
    repo: 'https://github.com/user-hope/user-hope.github.io',
    /**
     * 色系切换时候的提示
     */
    darkmode: 'switch',
    /**
     * icon 方式
     */
    iconAssets: '/js/fontawesome.js',
    plugins: {
        /**
         * https://github.com/PrismJS/prism-themes
         */
        prismjs: {
            light: 'coldark-dark',
            dark: 'one-dark',
        },
        mdEnhance: {
            tabs: true,
            chart: true,
            mermaid: true,
            katex: true
        },
        // blog: {
        //     hotReload: true
        // }
    },
    navbar: NavBar,
    sidebar: SideBar,
    /**
     * 是否显示全屏按钮
     */
    fullscreen: true,
    /**
     * 是否显示滚动到顶部按钮
     */
    backToTop: true,
    /**
     * 是否纯净模式
     */
    pure: true,
    /**
     * 导航栏布局
     */
    navbarLayout: {
        start: ['Brand'],
        end: ['Links', 'Repo', 'Outlook', 'Search'],
    },
    /**
     * 路径导航器(面包屑)
     */
    breadcrumb: false
})
