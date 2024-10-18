import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
    base: "/",
    locales: {
        "/": {
            lang: "zh-CN",
            title: "Blog",
            description: "原 docsify 站点内容比较多, 将一部分文档放在 vuepress 上",
        },
    },
    theme,

    // Enable it with pwa
    // shouldPrefetch: false,
});
