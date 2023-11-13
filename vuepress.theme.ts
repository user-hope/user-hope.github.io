import { hopeTheme } from 'vuepress-theme-hope';
import NavBar from './vuepress.navbar';

/**
 * theme 插件扩展
 * https://theme-hope.vuejs.press/zh/guide/markdown/tex.html
 */

export default hopeTheme({
    /**
     * 色系切换时候的提示
     */
    darkmode: 'switch',
    /**
     * icon 方式
     */
    iconAssets: 'fontawesome',
    plugins: {
        prismjs: {
            light: 'one-light',
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
    pure: true
})
