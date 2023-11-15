import { sidebar } from 'vuepress-theme-hope';

export default sidebar([
    {
        text: '服务端',
        prefix: '/pages/web-server/',
        children: [
            {
                text: 'odoo',
                link: 'odoo/index.md'
            }
        ]
    }
])
