import type { SidebarObjectOptions } from 'vuepress-theme-hope';

const WEBSERVER_FASTAPI_PREFIX = '/pages/web-server/fastapi';

export const fastapiSidebars: SidebarObjectOptions = {
    [WEBSERVER_FASTAPI_PREFIX] : [
        {
            text: '前言',
            prefix: WEBSERVER_FASTAPI_PREFIX,
            link: 'README.md'
        },
    ]
}