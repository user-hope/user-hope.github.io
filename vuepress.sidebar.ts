import type { SidebarObjectOptions } from 'vuepress-theme-hope';

import { odooSidebars } from './docs/sidebars';

/**
 * 每个独立模块的 sidebar 都单独提出来了;
 * 这边是可以建公共的;
 */
const sidebarConfig: SidebarObjectOptions = {
    ...odooSidebars
}

export default sidebarConfig
