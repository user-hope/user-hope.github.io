import { navbar } from 'vuepress-theme-hope';

/**
 * 项目的 navbar 没有那么多, 所以这个就不拆出来了;
 */
export default navbar([
    {
        text: '服务端开发',
        children: [
            {
                text: 'odoo',
                link: '/pages/web-server/odoo/'
            }
        ]
    }
])
