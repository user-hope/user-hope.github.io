---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-02/继承.md
next:
  link: /pages/web-server/odoo/section-02/Xpath.md
---

## QWeb 模板

`QWeb` 是 odoo 使用的主要模板引擎, 它是一个 xml 的模板引擎, 主要用于生成 HTML 片段和页面; 模板指令被指定为以 `t-` 为前缀的 xml 属性, 例如条件语句的 `t-if`, 元素和其他属性直接呈现;

为了避免元素渲染, 还可以使用占位符元素 `<t>`, 它执行其指令但本身不生成任何输出; 例如:

```xml
<t t-if="condition">
    <p>Test</p>
</t>
```
当 `condition` 条件为 `true` 时会输出:

```xml
<p>Test</p>
```
但是如果不使用 `<t>` 标签, 如:

```xml
<div t-if="condition">
    <p>Test</p>
</div>
```
当 `condition` 条件为 `true` 时会输出:

```xml
<div>
    <p>Test</p>
</div>
```
## 数据输出

odoo 的输出指令有以下几种, 分别有不同的作用;

- **`t-out`**: 用于输出数据到模板中, 它将输出原始的文本内容, 不会进行HTML转义; 这意味着如果数据包含HTML标签, 这些标签将被渲染为实际的 HTML 元素;
- **`t-esc`**: 与 `t-out` 类似, 不同的是, `t-esc` 会对数据进行 HTML 转义, 防止潜在的 XSS 攻击和错误渲染 HTML 的问题, 这意味着如果数据包含 HTML 标签, 这些标签将被转义为实体编码以显示为文本;
- **`t-field`**: 用于渲染模型字段的值到模板中, 它会根据字段的类型和属性自动选择合适的方式进行渲染; 例如, 对于 `Char` 类型的字段, 它会使用 `t-esc` 指令进行HTML转义, 并显示为文本; `Many2one` 的关联字段将会显示模型设置的 `_rec_name`;
- **`t-raw`**: odoo 15及以前的版本, 15 版本之后已经移除, 应该使用 `t-out`;

```xml
<p><t t-out="value"/></p>
```
将值设置为 `42` 将会输出:

```xml
<p>42</p>
```

## 条件控制

`QWeb` 有一个条件指令 `if` , 它计算作为属性值给出的表达式;

```xml
<div>
    <t t-if="condition">
        <p>ok</p>
    </t>
</div>
```
如果条件为 `true`, 那么将会输出如下内容:

```xml
<div>
    <p>ok</p>
</div>
```
如果条件为 `false`, 将会移除内容:

```xml
<div> </div>
```
额外的条件分支 `t-elif` 和 `t-else` 也可以用:

```xml
<div>
    <p t-if="user.birthday == today()">Happy birthday!</p>
    <p t-elif="user.login == 'root'">Welcome master!</p>
    <p t-else="">Welcome!</p>
</div>
```
## 循环

`QWeb` 有一个迭代指令 `foreach`, 它接受一个返回要迭代的集合的表达式, 以及第二个参数 `t-as` 提供用于迭代的 `current item` 的名称:

```xml
<t t-foreach="[1, 2, 3]" t-as="i">
    <p><t t-out="i"/></p>
</t>
```
这将会输出:

```html
<p>1</p>
<p>2</p>
<p>3</p>
```
与条件渲染相似, `foreach` 适用于具有指令属性的元素:

```xml
<p t-foreach="[1, 2, 3]" t-as="i">
    <t t-out="i"/>
</p>
```
`foreach` 不仅可以迭代数组, (`array` 的 `current item` 是当前项), 还可以迭代 `dict` (`current item` 是当前键); 通过 `t-as` 传递的名称之外, `foreach` 还为各种数据提供了一些其他的变量:

- **`$as_value`**: 当前遍历值, 和列表与整型的 `$as` 相同, 但对于映射它提供了值 (其中 `$as` 提供了键);
- **`$as_index`**: 当前迭代索引 (遍历中索引为0的第一项);
- **`$as_size`**: 集合的大小 (如果可用);
- **`$as_first`**: 当前项是否是迭代的第一项 (相当于 `$as_index == 0`);
- **`$as_last`**: 当前项是否是迭代的最后一项 (相当于 `$as_index + 1 == $as_size`), 要求迭代者的大小可用;

提供的这些额外变量以及在 `foreach` 中创建的所有新变量仅在 `foreach` 范围内可用, 如果变量存在于 `foreach` 上下文之外, 则该值将在 `foreach` 末尾复制到全局上下文中;

```html
<t t-set="existing_variable" t-value="False"/>
<!-- 现有变量现在为 False -->

<p t-foreach="[1, 2, 3]" t-as="i">
    <t t-set="existing_variable" t-value="True"/>
    <t t-set="new_variable" t-value="True"/>
    <!-- 现有变量和新变量现在为 True-->
</p>

<!-- 现有的变量始终为 True -->
<!-- 新变量现在为 undefined -->
```

## 属性

`QWeb` 可以即时计算属性并将计算结果设置在输出节点上, 这是通过 `t-att` (属性) 指令完成的, 该指令有 3 种不同的形式:

- **`t-att-$name`**: 创建名为 `$name` 的属性, 评估属性值并将结果设置为属性的值;
    ```xml
    <div t-att-a="42"/>
    ```
    这将会输出为:
    ```xml
    <div a="42"> </div>
    ```
- **`t-attf-$name`**: 与 `t-att`相似, 但是参数格式不仅仅可以为字符串, 还可以使用混合文字和表达式:
    ```xml
    <t t-foreach="[1, 2, 3]" t-as="item">
        <li t-attf-class="row {{ (item_index % 2 === 0) ? 'even' : 'odd' }}">
           <t t-out="item"/>
        </li>
    </t>
    ```
    这将会输出为:
    ```html
    <li class="row even">1</li>
    <li class="row odd">2</li>
    <li class="row even">3</li>
    ```
> 小技巧: 格式化字符串有两种等效语法 "`plain_text {{ code }}`" (又名 jinja 风格) 和 "`plain_text #{ code }`" (又名 ruby 风格);

- **`t-att=mapping`**: 如果参数是一个 `map`, 则每个键值对生成一个新属性及其值:
    ```xml
    <div t-att="{'a': 1, 'b': 2}"/>
    ```
    将会输出为:
    ```xml
    <div a="1" b="2"> </div>
    ```
- **`t-att=pair`**: 如果参数是一对 (元组或者是 2 个元素的数组), 则该对的第一项是属性名称, 第二项是值:
    ```xml
    <div t-att="['a', 'b']"/>
    ```
    将会输出为:
    ```xml
    <div a="b"> </div>
    ```

## 设置变量

`QWeb` 允许在模板内创建变量, 记忆计算(多次使用), 为数据提供更清晰的名称; 这是通过 `t-set` 指令完成的, 该指令采用要创建的变量名称, 可以通过两种方式提供要设置的值:

包含表达式的 `t-value` 属性, 并且将设置其计算结果:

```xml
<t>
    <t t-set="foo" t-value="2 + 1"/>
    <t t-out="foo"/>
</t>
```
这将输出为 `3`;

如果没有 `t-value` 属性, 则渲染节点的主体并将其设置为变量的值:

```xml
<t>
    <t t-set="foo">
        <li>ok</li>
    </t>
    <t t-out="foo"/>
</t>
```
将会生成 `&lt;li&gt;ok&lt;/li&gt;` (因我们使用了 `esc` 指令内容会进行转义)

## 调用子模板

`QWeb` 模板可用于顶级渲染, 但也可以使用 `t-call` 指令在另一个模板中使用它们 (以避免重复或为模板的各个部分命名):

```xml
<!-- QWeb模板 -->
<t t-name="other-template">
    <p><t t-value="var"/></p>
</t>
```

```xml
<!-- t-call 调用 -->
<t>
    <t t-set="var" t-value="1"/>
    <t t-call="other-template"/>
</t>
```
这将会输出为:

```xml
<p>1</p>
```
这样写有一个弊端, 就是 `var` 变量会是全局变量, 因此可以将 `t-set` 放在 `call` 内部调用:

```xml
<t t-call="other-template">
    <t t-set="var" t-value="1"/>
</t>

<!-- 在外面访问不了 var 变量 -->
```
### 插槽

`t-call` 里面还有一种比较特殊的标记 `<t t-out="0">`, 这个标记的作用就是将子节点的 dom 当作 slot 插入到指定的位置;

```xml{17}
<template id="web.layout" name="Web layout">&lt;!DOCTYPE html&gt;
    <html t-att="html_data or {}">
        <head>
            <meta charset="utf-8"/>
            <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
            <title t-esc="title or 'Odoo'"/>
            <link type="image/x-icon" rel="shortcut icon" t-att-href="x_icon or '/web/static/img/favicon.ico'"/>
            <script id="web.layout.odooscript" type="text/javascript">
                var odoo = {
                    csrf_token: "<t t-nocache="The csrf token must always be up to date." t-esc="request.csrf_token(None)"/>",
                    debug: "<t t-esc="debug"/>",
                };
            </script>
            <t t-out="head or ''"/>
        </head>
        <body t-att-class="body_classname">
            <t t-out="0"/>
        </body>
    </html>
</template>
```
调用的时候 `t-call` 下面的内容会被插入到 `web.layout` 的 `<t t-out="0" />` 这个下面;

```xml
<template id="subcontracting_portal_embed" name="Subcontracting Portal">
    <t t-call="web.layout">
        <t t-set="head_subcontracting_portal">
            <script type="text/javascript">
                odoo.__session_info__ = <t t-out="json.dumps(session_info)"/>;
            </script>
            <base target="_parent"/>
            <t t-call-assets="web.assets_common" t-js="false"/>
            <t t-call-assets="web.assets_backend" t-js="false"/>
            <t t-call-assets="web.assets_common" t-css="false"/>
            <t t-call-assets="mrp_subcontracting.webclient" t-css="false"/>
            <t t-call="web.conditional_assets_tests"/>
        </t>
        <t t-set="head" t-value="head_subcontracting_portal + (head or '')"/>
        <t t-set="body_classname" t-value="'o_web_client o_subcontracting_portal'"/>
    </t>
</template>
```
## Python 独有指令

### 智能记录 - 字段格式化

`t-field` 指令只能在对关联字段, 执行字段访问 (a.b) 时使用, 它能够根据字段类型自动格式化, 并集成在网站的富文本编辑器中;

```xml
<div>
    Stage: <span t-field="lead.stage_id"/>
</div>
```
例如上面的 `stage_id` 是关联的 `crm.stage`, 会自动输出为 `crm.stage` 的 `_rec_name`(一般如果不修改的话就是 `display_name`)

`t-options` 可用于自定义字段, 最常见的选项是 `widget`, 其他选项与字段或 `widget` 相关;

```xml
<div 
    t-if="employee.barcode" 
    t-field="employee.barcode" 
    t-options="{
        'widget': 'barcode', 
        'width': 600, 
        'height': 120, 
        'img_style': 'max-height:50pt;max-width:100%;', 
        'img_align': 'center'
    }"
/>
```
### Debug

`t-debug` 使用 `PDB` 的 `set_trace` API 调用调试器, 参数应该是调用 `set_trace` 方法的模块的名称:

```xml
<t t-debug="pdb"/>
```
在 `QWeb` 里面调用 `t-debug="pdb"`, 将会在客户端插入 `js` 的 `debugger`, 可以看到虚拟 dom 转 html 的过程;

### 帮助函数

**基于请求**

`QWeb` 的大部分是在 `Python` 端使用在控制器 (HTTP请求时) 中进行, 在这种情况下, 可以通过调用 `odoo.http.HttpRequest.render()` 轻松呈现存储在数据库中的模板 (作为视图);

```python
response = http.request.render('my-template', {
    'context_value': 42
})
```
这会自动创建一个 `Response` 对象, 该对象可以从控制器返回 `content-type:text/html` 的请求头; 渲染为 `html` 页面;

**基于视图**

比之前的帮助器更深层次的是 `ir.qweb` 上的 _`render` 方法 (使用数据表) 和公共模块方法 `render` (不使用数据库):

这在某些时候是特别有用的, 例如: 调用接口直接返回一个 Html 内容; 下面就来看一下实际应用的例子:

在 `library_app` 目录的 `views` 新增一个 `book_template.xml`, 内容如下:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<odoo>
    <template id="book_content_html" name="Book Content Html">
        <div>
            <h2>This Content Render By QWeb!</h2>
            <h2>
                <t t-out='name'> </t>
            </h2>
        </div>
    </template>
</odoo>
```
> 注意: 这里的 xml 必须在 `views` 目录下, 不能放在 `static/xml` 里面, 因为它需要被添加到 `ir.qweb` 数据表中;

然后, 我们在 `controller` 里面添加一个接口:

```python
from odoo import http

class Books(http.Controller):

    @http.route('/library/test_book_qweb', auth='user', type='http')
    def list(self, **kwargs):
        return http.request.env['ir.qweb']._render('library_app.book_content_html', {
                "name": 'Test Book Name'
            })
```
当我们在访问 `/library/test_book_qweb` 路由的时候, 就会看到如下内容:

![_render](/images/odoo/S15/_render.png)

`_render` 不仅仅可以在 `controller` 里面调用, 还有一种场景, 在模型的字段里面有 `fields.Html` 的时候, 也是可以使用 `qweb` 的 `_render` 函数计算出来:

```python
from odoo.exceptions import ValidationError
from odoo import models, fields, api
import logging

_logger = logging.getLogger(__name__)


class Book(models.Model):
    _name = 'library.book'
    _description = 'Book'
    
    html_content = fields.Html(compute='_compute_html_content')
    
    def _compute_html_content(self):
        for rec in self:
            html = self.env['ir.qweb']._render('library_app.book_content_html', {
                    "name": "Test Book Name"
                }, raise_if_not_found=False)
            if html:
                rec.html_content = html
            else:
                rec.html_content = ""
```









