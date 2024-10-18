---
headerDepth: 3
prev:
  link: /pages/web-server/odoo/section-01/动作.md
next:
  link: /pages/web-server/odoo/section-01/Manifest.md
---

## Qweb 报表

在上面一节的介绍中, 报表 `ir.actions.report` 的定义如下: 

```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <record id="hr_employee_print_badge" model="ir.actions.report">
        <field name="name">Print Badge</field>
        <field name="model">hr.employee</field>
        <field name="report_type">qweb-pdf</field>
        <field name="report_name">hr.print_employee_badge</field>
        <field name="report_file">hr.print_employee_badge</field>
        <field name="print_report_name">'Print Badge - %s' % (object.name).replace('/', '')</field>
        <field name="binding_model_id" ref="model_hr_employee"/>
        <field name="binding_type">report</field>
        <field name="paperformat_id" ref="paperformat_hrsummary"/>
    </record>
</odoo>
```
是使用数据文件定义了一个 `ir.actions.report` 的记录; 其中, `report_name` 指定了使用的 `qweb` 模板; 在模板中使用 `docs` 数据来进行渲染; 除了 `docs` 以外, `report` 的模板还提供以下上下文变量: 

- **`time`**: Python 标准库中对时间的引用;
- **`user`**: 打印报告的用户的信息; 关联的 `res.user`;
- **`res_company`**: 当前用户的公司的记录;
- **`website`**: 当前网站的对象;
- **`web_base_url`**: 当前 server 的 base url;
- **`context_timestamp`**: 在 `UTC1` 中获取 `datetime.datetime` 并将其转换为打印报告的用户的时区的函数;

## 报表模板

上面的报表动作中, 我们指定了 `report_name` 属性, 该属性将应用一个 `qweb` 的报表模板; 内容如下:

```xml
<template id="print_employee_badge">
    <t t-call="web.basic_layout">
        <div class="page">
            <t t-foreach="docs" t-as="employee">
                <div class="col-md-6">
                    <table style="width:243pt; height:153pt; border: 1pt solid black; border-collapse:separate; border-radius:8pt; margin:5pt">
                        <td style="width:33%;" valign="center">
                            <table style="width:77pt; height:150pt" class="table-borderless">
                                <tr style="height:30%">
                                    <td align="center" valign="center">
                                        <img t-if="employee.company_id.logo" t-att-src="image_data_uri(employee.company_id.logo)" style="max-height:45pt;max-width:90%" alt="Company Logo"/>
                                    </td>
                                </tr>
                                <tr style="height:70%;">
                                    <td align="center" valign="center">
                                        <img t-att-src="image_data_uri(employee.avatar_1920)" style="max-height:85pt;max-width:90%" alt="Employee Image"/>
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td style="width:67%" valign="center">
                            <table style="width:155pt; height:85pt" class="table-borderless">
                                <tr><th><div style="font-size:15pt; margin-bottom:0pt;margin-top:0pt;" align="center"><t t-esc="employee.name"/></div></th></tr>
                                <tr><td><div align="center" style="font-size:10pt;margin-bottom:5pt;"><t t-esc="employee.job_id.name"/></div></td></tr>
                                <tr><td><div t-if="employee.barcode" t-field="employee.barcode" t-options="{'widget': 'barcode', 'width': 600, 'height': 120, 'img_style': 'max-height:50pt;max-width:100%;', 'img_align': 'center'}"/></td></tr>
                            </table>
                        </td>
                    </table>
                </div>
            </t>
        </div>
    </t>
</template>
```
调用 `t-call="web.basic_layout"` 将会在报表上应用 `web.basic_layout` 模板定义的内容; `pdf` 内容体是 `<div class="page">`; 模板的 id 必须为在报表声明中指定的名称, 例如上面的 `print_employee_badge`

这是一个 `qweb` 模板, 可以访问由模板接收的 `docs` 对象的所有字段;

## 可翻译模板

如果要翻译报表模板, 需要定义两个模板:
- 主报表模板;
- 可翻译的文档;

然后可以使用 `t-lang` 为模板设置翻译; 例如: `sale` 模块中的销售订单报表:

```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <!-- main template -->
    <template id="report_saleorder">
        <t t-call="web.html_container">
            <t t-foreach="docs" t-as="doc">
                <t t-call="sale.report_saleorder_document" t-lang="doc.partner_id.lang"/>
            </t>
        </t>
    </template>

    <!-- Translatable template -->
    <template id="report_saleorder_document">
        <t t-call="web.external_layout">
            <!--  qweb content  -->
        </t>
    </template>
</odoo>
```
主模板调用可翻译模板, 将 `doc.partner_id.lang` 作为 `t-lang` 参数, 因此它会以伙伴的语言进行渲染; 这样, 每个订单会以对应客户的语言进行打印;

## 纸张格式

上面, 我们为报表指定了 `paperformat_id` 属性, 它是一个 `many2one` 类型的, 可以关联 `report.paperformat` 的记录; `report.paperformat` 可包含如下属性:

- **`name`**: 必填, 用于在列表中展示定义的格式的名称;
- **`description`**: 描述内容;
- **`format`**: 预定义的纸张格式; (A0-A9, B0-B10) 或 `custom`; 默认为 `A4`;
- **`dpi`**: 输出 DPI, 默认为 90;
- **`margin_top, margin_bottom, margin_left, margin_right`**: 单位为 `mm` 的页边距;
- **`page_height, page_width`**: 单位为 `mm` 的页面大小;
- **`orientation`**: 纸张布局 横版/竖版; 默认为 `Landscape`, 可选: `Portrait`;
- **`header_line`**: 是否显示顶部的线条;
- **`header_spacing`**: 单位为 `mm` 的头部间距;

> 具体定义请查看 `odoo/addons/base/models/report_paperformat.py` 源码;

```xml
<?xml version="1.0" encoding="utf-8"?>
<odoo>
    <record id="paperformat_hrsummary" model="report.paperformat">
        <field name="name">Time Off Summary</field>
        <field name="default" eval="True"/>
        <field name="format">custom</field>
        <field name="page_height">297</field>
        <field name="page_width">210</field>
        <field name="orientation">Landscape</field>
        <field name="margin_top">30</field>
        <field name="margin_bottom">23</field>
        <field name="margin_left">5</field>
        <field name="margin_right">5</field>
        <field name="header_line" eval="False"/>
        <field name="header_spacing">20</field>
        <field name="dpi">90</field>
    </record>
</odoo>
```
## 自定义报表

报表模型有默认的 `get_html` 函数, 会查找名为 `report.<模块名称>.<报表名称>`的模型, 如果存在, 会使用它来调用 `qweb` 引擎; 否则会使用一个通用的函数; 如果希望通过在模板中包含更多内容来自定义报表; 就可以定义这个模型, 重写 `_get_report_values`, 并在 `docargs` 字典中传递对象;

例如: 模块名称为 `account`, 报表的 `report_name` 为 `account.report_hash_integrity`; 即自定义的报表模型为:

```python{5}
from odoo import api, fields, models


class ReportAccountHashIntegrity(models.AbstractModel):
    _name = 'report.account.report_hash_integrity'
    _description = 'Get hash integrity result as PDF.'

    @api.model
    def _get_report_values(self, docids, data=None):
        if data:
            data.update(self.env.company._check_hash_integrity())
        else:
            data = self.env.company._check_hash_integrity()
        return {
            'doc_ids' : docids,
            'doc_model' : self.env['res.company'],
            'data' : data,
            'docs' : self.env['res.company'].browse(self.env.company.id),
        }
```

## 自定义样式/字体

如果希望使用自定义的样式或者是字体, 则需要将资源文件声明在 `web.report_assets_common` 资源包内 (资源包后面会介绍);

```python
'assets': {
    'web.report_assets_common': [
        'account/static/src/scss/**/*',
    ],
}
```

## 报表是网页

报表通过 `report` 模块动态生成, 并可以直接使用 `url` 进行访问; 例如: 访问销售订单的 `id` 为 `3` 的记录的报表:

```bash
# html 版本的报表
http://localhost:8091/report/html/sale.report_saleorder/3

# pdf 版本的报表
http://localhost:8091/report/html/sale.report_saleorder/3
```
