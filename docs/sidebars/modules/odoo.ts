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
                }
            ]
        }
    ]
}

export { odooSidebars };
