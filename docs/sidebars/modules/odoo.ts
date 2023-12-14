import type { SidebarObjectOptions } from 'vuepress-theme-hope';

const WEBSERVER_ODOO_PREFIX = '/pages/web-server/odoo';

const odooSidebars: SidebarObjectOptions = {
    [WEBSERVER_ODOO_PREFIX] : [
        {
            text: '前言',
            prefix: WEBSERVER_ODOO_PREFIX,
            link: 'README.md'
        },
        {
            text: '第一部分: 基础知识',
            prefix: `${WEBSERVER_ODOO_PREFIX}/section-01/`,
            children: [
                {
                    text: '一. 环境搭建',
                    link: '环境搭建.md'
                },
                {
                    text: '二. 第一个模块',
                    link: '第一个模块.md'
                },
                {
                    text: '三. 基本字段',
                    link: '基本字段.md'
                },
                {
                    text: '四. 基本视图',
                    link: '基本视图.md'
                },
                {
                    text: '五. API',
                    link: 'API.md'
                },
                {
                    text: '六. 模型',
                    link: '模型.md'
                },
                {
                    text: '七. 数据文件',
                    link: '数据文件.md'
                },
                {
                    text: '八. 动作',
                    link: '动作.md'
                },
                {
                    text: '九. Qweb报表',
                    link: 'Qweb报表.md'
                },
                {
                    text: '十. Manifest',
                    link: 'Manifest.md'
                },
            ]
        }
    ]
}

export { odooSidebars };
