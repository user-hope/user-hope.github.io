---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/Assets.md
next:
  link: /pages/web-server/odoo/section-03/OWL Components.md
---

## JavaScript 模块

odoo 支持三种不同类型的 javascript 文件:
- 纯 javascript 文件; (原生 js, 无模块化);
- esm 模块化系统;
- odoo 的模块化定义; (`odoo.define()`);

如资源管理所述, 所有的 js 文件都会打包到一起, 并提供给浏览器; 需要注意的是, esm 模块, 和 odoo 的模块化开发的 js 文件将由 odoo 服务器处理并转换为自定义的 odoo 模块;

现在, 我们来看一下每一种 js 文件背后的用途; 

### 原生 js

原生的 js 文件可以包含任何内容, 建议在编写此类文件的时候使用 `iife` 风格编写, 避免全局的变量污染;

```js
!(function() {
    let a = 1;
    console.log(a);
})()
```
此类文件的有点是我们可以避免将局部变量泄露到全局范围; 显然, 纯 js 文件无法提供模块系统的好处, 因此需要注意 bundle 包中的加载顺序; (因为浏览器将按照顺序精确执行它们);

### esm 模块化

大多数新的 odoo JavaScript 代码应该使用 esm 的模块化去实现, 这更简单, 并且通过与 IDE 更好的集成, 带来更好的开发人员体验;

使用 esm 模块化进行开发的时候, 有一点比较重要: odoo 需要知道哪些文件需要被编译成 odoo 的模块化, 哪些文件不需要被编译; 所以 odoo 提供了一个选项: 在 js 文件的第一行检查是否包含字符串 `@odoo-module`, 如果是这样, 它将会自动编译为 odoo 的模块;

来看一个例子: 例如我们在 `web/static/src/file_a.js`:

```js
/** @odoo-module **/
import { someFunction } from './file_b';

export function otherFunction(val) {
    return someFunction(val + 3);
}
```
请注意文件的第一行注释: 它描述了应该将文件编译成 odoo 的模块, (任何没有包含 `@odoo-module` 的 js 文件将按照原样保留), 然后该文件将会被编译成:

```js
odoo.define('@web/file_a', function (require) {
    'use strict';
    let __exports = {};
    
    const { someFunction } = require("@web/file_b");
    
    __exports.otherFunction = function otherFunction(val) {
        return someFunction(val + 3);
    };
    
    return __exports;
});
```
odoo 会将 esm 的模块引入方式转换成 odoo 内置的模块化的方式, 更重要的一点是: 被转换的模块具有正式的模块名称 `@web/file_a`, 这是模块的实际名称; 每一个 `addons` 模块中的 `/static/src/path/to/file.js` 都将会被分配一个由模块名组成的 js 的模块名;

例如: 当目录结构如下时:

```js
addons/
    web/
        static/
            src/
                file_a.js
                file_b.js
    stock/
        static/
            src/
                file_c.js
```
`file_b` 引入 `file_a` 的时候可以写成:

```js
/** @odoo-module **/

import { something } from './file_a'
```
但是, 如果 `file_c` 引入 `file_a` 的时候, 就需要写成:

```js
/** @odoo-module **/

import { something } from '@web/file_a'
```

#### alias 别名

因为 odoo 的模块遵循不同的模块命名规则, 因此存在一个允许平稳过渡到新系统的模块化系统, 目前, 如果一个 esm 的模块被转换成 odoo 的模块, 项目中尚未转换的 esm 模块就无法加载该模块了, 因此, odoo 提供了一个别名机制, 通过创建一个小的代理函数来将旧名称与新的名称映射, 然后可以通过其新的名称和旧的名称来调用该模块;

要添加别名, 文件的第一行的注释标记应该如下:

```js
/** @odoo-module alias=web.someName**/
import { someFunction } from './file_b';

export default function otherFunction(val) {
    return someFunction(val + 3);
}
```
然后, 被编译后的文件还将会使用定义的 alias 创建一个别名:

```js
odoo.define(`web.someName`, function(require) {
    return require('@web/file_a')[Symbol.for("default")];
});
```

#### 局限性

出于性能考虑, odoo 不会使用完整的 javascript 解析器来转换 esm 模块, 因此, 存在许多限制, 包括但不限于:

- `import` 或 `export` 关键字前面不能有非空格字符;
- 多行注释或字符串不能有以 `import` 或 `export` 开头的行;
- `export` 导出一个对象的时候不能包含注释行;
    ```js
    // 错误的
    export {
        a as b,
        // c,
        d,
    }
    ```
- odoo 需要一种方法来确定模块是由路径 (例如: `./views/form_view`) 还是名称 (例如: `web.FormView`) 描述的, 因此 odoo 不能够支持名称中带有的 `/` 的模块名;

由于经典的模块化方式 (`odoo.define` 定义的模块) 未被弃用, 因此如果有遇到 `esm` 模块化的一些限制, 您任然可以使用 `odoo.define` 来定义模块, 这两种风格可以在 odoo 中共存;


### odoo.define 模块化

odoo 定义了一个小的模块化系统, (具体代码位于: `addons/web/static/src/js/boot.js`) 受 AMD 启发的 ODOO 模块系统通过在全局 ODOO 对象上定义函数来工作; 然后, 我们通过调用该函数来定义每一个 Javascript 模块;

```js
// in file a.js
odoo.define('module.A', function (require) {
    "use strict";

    var A = {};

    return A;
});

// in file b.js
odoo.define('module.B', function (require) {
    "use strict";

    var A = require('module.A');

    var B = {}; // something that involves A

    return B;
});
```
定义模块的另一种方法是在第二个参数中明确给出依赖项的列表:

```js
odoo.define('module.Something', ['module.A', 'module.B'], function (require) {
    "use strict";

    var A = require('module.A');
    var B = require('module.B');

    // some code
});
```

如果某一些依赖丢失, 或者是资源还未加载完成, 则该模块将无法被加载, odoo 会将警告信息输出到控制台;

> 请注意: 任何时候, 都不支持循环依赖!!;

### 定义一个模块

`odoo.define` 函数接收 3 个参数:
- `moduleName`: 模块的名称, 它应该是一个唯一字符; 例如: `web.Widget`;
- `dependencies`: 依赖项, 第二个参数是可选的, 如果有, 它应该是一个字符串列表, 这描述了再执行模块之前需要预加载的依赖项; 模块系统将通过在其上调用 `toString`, 然后使用正则表达式来查找所有需要语句, 来从功能中提取它们;
- `callback`: 回调函数, 它的返回值是模块的值; 该值可以传递给其他需要它的模块;

如果发生错误, 将在控制台中输出以下类型的日志:
- `Missing dependencies`: js 文件可能不在页面中, 或者模块名称是错误的;
- `Failed modules`: js 错误
- `Rejected modules`: 该模块的返回值是一个 `Promise.reject()` 类型; 
- `Rejected linked modules`: 依赖模块拒绝;
- `Non loaded modules`: 依赖缺失或加载失败;

### 异步模块

可能会有一个模块需要在准备好之前执行一些工作. 例如, 它可以执行 RPC 来加载一些数据. 在这种情况下, 模块可以简单地返回 `Promise`; 模块系统将只等待 `promise` 在注册模块之前完成;

```js
odoo.define('module.Something', function (require) {
    "use strict";

    var ajax = require('web.ajax');

    return ajax.rpc({}).then(function (result) {
        // some code here
        return something;
    });
});
```

