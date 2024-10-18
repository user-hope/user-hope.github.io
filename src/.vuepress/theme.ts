import { hopeTheme } from "vuepress-theme-hope";

import Navbar from "./navbar/index.js";
import Sidebar from "./sidebar/index.js";

export default hopeTheme({
    hostname: "https://github.com/user-hope/user-hope.github.io",
    author: {
        name: "Mr.Hope",
        url: "https://github.com/user-hope/user-hope.github.io",
    },
    darkmode: 'toggle',
    iconAssets: "/js/fontawesome.js",
    logo: "logo.png",
    logoDark: "logo-dark.png",
    repo: "https://github.com/user-hope/user-hope.github.io",
    fullscreen: true,
    breadcrumb: false,
    navbarLayout: {
        start: ['Brand'],
        end: ['Links', 'Repo', 'Outlook', 'Search'],
    },
    docsDir: "src",
    locales: {
        /**
         * Chinese locale config
         */
        "/": {
            navbar: Navbar,
            sidebar: Sidebar,
            footer: "默认页脚",
            displayFooter: true,
            metaLocales: {
                editLink: "在 GitHub 上编辑此页",
            },
        },
    },
    plugins: {
        searchPro: {
            indexContent: true,
            autoSuggestions: true,
            customFields: [
                { getter: (page) => page.frontmatter.description as string, formatter: "描述: $content" }
            ]
        },
        // 评论 https://theme-hope.vuejs.press/zh/guide/feature/comment.html
        // https://giscus.app/zh-CN
        comment: {
            provider: "Giscus",
            repo: "user-hope/user-hope.github.io",
            repoId: "R_kgDOKswzpA",
            category: "Announcements",
            categoryId: "DIC_kwDOKswzpM4Cjd9p",
        },

        components: {
            components: ["Badge", "VPCard"],
        },

        // These features are enabled for demo, only preserve features you need here
        markdownImage: {
            figure: true,
            lazyload: true,
            size: true,
        },

        markdownMath: {
          // install katex before enabling it
          type: "katex",
          // or install mathjax-full before enabling it
        //   type: "mathjax",
        },

        // This features is enabled for demo, only preserve if you need it
        markdownTab: true,
        mdEnhance: {
            align: true,
            attrs: true,
            component: true,
            demo: true,
            include: true,
            mark: true,
            plantuml: true,
            spoiler: true,
            stylize: [
                {
                    matcher: "Recommended",
                    replacer: ({ tag }) => {
                        if (tag === "em")
                            return {
                                tag: "Badge",
                                attrs: { type: "tip" },
                                content: "Recommended",
                            };
                    },
                },
            ],
            sub: true,
            sup: true,
            tasklist: true,
            vPre: true,

            // Install chart.js before enabling it
            // chart: true,

            // insert component easily

            // Install echarts before enabling it
            echarts: true,

            // Install flowchart.ts before enabling it
            // flowchart: true,

            // gfm requires mathjax-full to provide tex support
            // gfm: true,

            // Install mermaid before enabling it
            // mermaid: true,

            // playground: {
            //   presets: ["ts", "vue"],
            // },

            // Install @vue/repl before enabling it
            // vuePlayground: true,

            // Install sandpack-vue3 before enabling it
            // sandpack: true,
        },

        // Install @vuepress/plugin-pwa and uncomment these if you want a PWA
        // pwa: {
        //   favicon: "/favicon.ico",
        //   cacheHTML: true,
        //   cacheImage: true,
        //   appendBase: true,
        //   apple: {
        //     icon: "/assets/icon/apple-icon-152.png",
        //     statusBarColor: "black",
        //   },
        //   msTile: {
        //     image: "/assets/icon/ms-icon-144.png",
        //     color: "#ffffff",
        //   },
        //   manifest: {
        //     icons: [
        //       {
        //         src: "/assets/icon/chrome-mask-512.png",
        //         sizes: "512x512",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-mask-192.png",
        //         sizes: "192x192",
        //         purpose: "maskable",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-512.png",
        //         sizes: "512x512",
        //         type: "image/png",
        //       },
        //       {
        //         src: "/assets/icon/chrome-192.png",
        //         sizes: "192x192",
        //         type: "image/png",
        //       },
        //     ],
        //     shortcuts: [
        //       {
        //         name: "Demo",
        //         short_name: "Demo",
        //         url: "/demo/",
        //         icons: [
        //           {
        //             src: "/assets/icon/guide-maskable.png",
        //             sizes: "192x192",
        //             purpose: "maskable",
        //             type: "image/png",
        //           },
        //         ],
        //       },
        //     ],
        //   },
        // },

        // install @vuepress/plugin-revealjs and uncomment these if you need slides
        // revealjs: {
        //   plugins: ["highlight", "math", "search", "notes", "zoom"],
        // },
    },
});
