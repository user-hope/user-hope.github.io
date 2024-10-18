---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/框架概述.md
next:
  link: /pages/web-server/odoo/section-03/JavaScript模块.md
---

## 资源

在 odoo 中, 管理资源文件并不像其他的应用程序中这么简单, 原因之一就是 odoo 里面面临着许多中情况, 有些情况下, 需要加载一部分资源, 例如: 网络客户端, 销售点等应用程序; 此外, 某些资源文件可能会比较大, 但是很少有场景使用, 这个时候, 就可以使用懒加载来完成[按需加载](/pages/web-server/odoo/section-03/Assets.html#懒加载)资源;

### 资源类型

在 odoo 中, 资源被分为三种不同的类型: 代码 (js文件), 样式(css 或 scss) 和模板(xml文件);

**代码**

odoo 支持三种不同类型的 javascript 的模块文件, 然后处理所有这些文件 (原生 js 模块转换为 odoo 模块), 然后压缩文件 (如果不是在 debug=assets) 模式下, 被压缩的文件将作为附件存储在附件表总, 这些文件附件通常通过页面的 `<head>` 部分中的 `<script>` 标记加载(作为静态文件);

**样式**

odoo 中的样式可以支持 css 或者是 scss, 与 javascript 文件一样, 这些文件会被 (scss 文件转换为 css), 然后压缩 (同样, 如果不是在 debug=assets) 模式下, 同样, 结果也会保存为附件, 他们通常通过页面的 `<head>` 部分中的 `<link>` 标签加载;

**模板文件**

模板 (xml 文件) 以不同的方式处理: 只要需要它们, 就简单的从文件系统中读取它们, 然后将他们渲染出来; 每当浏览器加载 odoo 时候, 它都会调用 `/web/webclient/qweb/` controller 来获取模板;

## Bundles

odoo 中将每一种类型的资源作为一个资源包打包到一起, 每个资源包 (特定类型的文件路径列表: xml, js, css 或者是 scss) 都列在模块清单中, 可以使用 [`glob`](https://rgb-24bit.github.io/blog/2018/glob.html) 语法来声明, 这意味着可以使用一行声明多个资源文件;

这些 `bundle` 包在每一个模块的 `__manifest__.py` 中定义, 并带有包含字典的专用资源包的键名, 字典将包名(键) 映射到它们包含的文件列表(值), 它们一般是这样的:

```python
'assets': {
    'web.assets_backend': [
        'web/static/src/xml/**/*',
    ],
    'web.assets_common': [
        'web/static/lib/bootstrap/**/*',
        'web/static/src/js/boot.js',
        'web/static/src/js/webclient.js',
    ],
    'web.qunit_suite_tests': [
        'web/static/src/js/webclient_tests.js',
    ],
},
```
以下是大多数经常使用到的资源包名:

- **`web.assets_common`**: 该资源包包含网络客户端, 网站和销售点等常见的大部分资源; 这包含 odoo 较为核心的模块, 比如: `boot.js` 文件, 该文件定义了 odoo 模块系统;
- **`web.assets_backend`**: 该资源包包含特定于 web 服户端(前端)的代码;  
- **`web.assets_frontend`**: 该资源包包含特定于 web 网站端(前端)的代码;
- **`web.qunit_suite_tests`**: 所有的 javascript 单元测试代码; (tests, helpers, mocks)
- **`web.qunit_mobile_suite_tests`**: 移动端特定的单元测试代码;

### 操作符

通常, 处理资源文件很简单: 只需要将一些新的文件添加到常用的 `bundle` 包中, 例如: `assets_common` 或 `assets_backend`, 但还有其他的操作可以用于一些更加具体的使用场景;

请注意, 针对某个资源文件的所有操作符(即 `before`, `after`, `replace`, `remove`), 都需要预先声明该文件, 无论是在层次结构中较高的 list 中, 还是具有较低排序的 `ir.asset` 记录中;

**append**

此操作添加一个或多个文件, 由于它是最常见的操作, 因此可以通过简单地使用文件名来完成:

```python
'web.assets_common': [
    'my_addon/static/src/js/**/*',
],
```
默认情况下, 向包中添加简单字符串会将与 `glob` 模式匹配的文件附加到包的末尾, 该模式也可以直接是单个文件路径;

**prepend**

在资源包的开头添加一个或多个文件; 当我们需要将某个文件放在 `bundle` 包中的其他文件之前 (例如 css 文件) 时很有用, 可以使用以下语法 `('prepend', <path>)`:

```python
'web.assets_common': [
    ('prepend', 'my_addon/static/src/css/bootstrap_overridden.scss'),
],
```
**before**

在特定文件之前添加一个或多个文件; 在包的开头添加文件可能不够精确, `before` 指令可用于在目标文件之前添加给定文件; 它是通过用 3 元素元组 `('before', <target>, <path>)` 来声明的:

```python
'web.assets_common': [
    ('before', 'web/static/src/css/bootstrap_overridden.scss', 'my_addon/static/src/css/bootstrap_overridden.scss'),
],
```
**after**

在特定文件后添加一个或多个文件, 与 `before` 相同, 匹配的文件附加在目标文件之后, 它是通过用 3 元素元组 `('after', <target>, <path>)` 来声明的:

```python
'web.assets_common': [
    ('after', 'web/static/src/css/list_view.scss', 'my_addon/static/src/css/list_view.scss'),
],
```

**include**

使用嵌套 `bundle` 包; `include` 指令是一种在其他 `bundle` 包中使用 `bundle` 包, 以最小化 list 的方法, 在 odoo 中, 我们使用子包 (按照惯例以下划线为前缀) 来批处理多个其他包中使用的文件; 然后可以将子包指定为一对 `('include', <bundle>)`:

```python
'web.assets_common': [
    ('include', 'web._primary_variables'),
],
```

**remove**

删除一个或多个文件; 在某些情况下, 您可能希望从捆绑包中删除一个或多个文件; 这可以通过指定 `('remove', <target>)` 使用删除指令来完成:

```python
'web.assets_common': [
    ('remove', 'web/static/src/js/boot.js'),
],
```

**replace**

将资源文件替换为一个或多个文件; 假设某个资产不仅需要删除, 而且您还希望在同一位置插入该资产的新版本, 这可以通过指定 `('replace', <target>, <path>)` 来完成:

```python
'web.assets_common': [
    ('replace', 'web/static/src/js/boot.js', 'my_addon/static/src/js/boot.js'),
],
```

### 加载顺序

资源加载的顺序有时很关键, 并且必须是确定性的, 主要针对样式表优先级和设置脚本; odoo 中的资源加载顺序如下:

1. 当调用资源包时 (例如 `t-call-assets='web.assets_common'`), 会生成一个空的资源列表;
2. 所有类型为 `ir.asset` 的记录将被获取并按 `sequence` 进行排序; 然后, 所有 `sequence` 严格小于 16 的记录将被处理并应用于当前的资产列表中;
3. 所有声明在 `assets` 中为指定捆绑包提供资产的模块, 将其资源应用于该列表; 这是根据模块依赖关系的顺序进行的 (例如: `web` 模块的 `bundle` 在 `website`之前处理); 如果一个指令尝试添加一个已经存在于列表中的文件, 那么对于该文件将不会有任何操作. 换句话说, 列表中只保留文件的第一次出现;
4. 处理并应用剩余的 `ir.asset` 记录 (那些序列大于或等于 16 的记录)

`assets` 中声明的资源可能需要按特定顺序加载, 例如, 加载 lib 文件夹时, 必须在所有其他 `jquery` 脚本之前加载 `jquery.js`; 一种解决方案是创建具有较低 `sequence` 或 `prepend` 指令的 `ir.asset` 记录, 但还有另一种更简单的方法; 

由于 `assets` 中的每一个文件路径的唯一性得到保证, 因此您可以在包含该文件的 `glob` 之前声明任何特定文件, 因此, 该文件将出现在列表中, 优先于 `glob` 中包含的所有其他文件的加载;

```python
'web.assets_common': [
    'my_addon/static/lib/jquery/jquery.js',
    'my_addon/static/lib/jquery/**/*',
],
```

## 懒加载

有时动态加载 文件和/或资源包 很有用, 例如仅在需要时加载库; 为此, Odoo 框架提供了一些辅助函数, 位于 `@web/core/assets` 包中; 可以查看源码: `addons/web/static/src/core/assets.js` 

```js
await loadBundle({
    jsLibs: ["/web/static/lib/stacktracejs/stacktrace.js"],
});
```
### loadBundle(assets)

加载声明的资源文件, 它是一个可能包含以下键的对象:

- **`jsLibs`**: `string[]`, javascript 文件 list;
- **`cssLibs`**: `string[]`, css 文件 list;

```js
import { loadBundle } from "@web/core/assets";

export class MassMailingHtmlField extends HtmlField {

    async startWysiwyg(...args) {
        await super.startWysiwyg(...args);

        await loadBundle({
            jsLibs: [
                '/mass_mailing/static/src/js/mass_mailing_link_dialog_fix.js',
                '/mass_mailing/static/src/js/mass_mailing_snippets.js',
                '/mass_mailing/static/src/snippets/s_masonry_block/options.js',
                '/mass_mailing/static/src/snippets/s_media_list/options.js',
                '/mass_mailing/static/src/snippets/s_showcase/options.js',
                '/mass_mailing/static/src/snippets/s_rating/options.js',
            ],
        });
        // code
    }
}
```

## ir.asset 模型

在大多数情况下, `assets` 中的资源文件基本上就足够了; 然而, 为了获得更大的灵活性, 该框架还支持在数据库中声明的动态资源;

这是可以通过创建 `ir.asset` 记录来完成;

> 具体模型定义可以查看源码 odoo/addons/base/models/ir_asset.py

```python
# example

self.env['ir.asset'].create({
    'name': '1',
    'bundle': 'test_assetsbundle.manifest4',
    'path': '/test_assetsbundle/static/src/*/**',
    'target': '/test_assetsbundle/static/src/js/test_jsfile3.js',
    'directive': 'after',
})
```



