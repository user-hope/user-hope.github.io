---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-02/控制器.md
next:
  link: /pages/web-server/odoo/section-02/国际化.md
---

## Mixin

`Mixins` 是一种常见的编程模式, 用于将一些通用的功能组装成可重用的模块, `Mixins` 通常是一些类, 它包含了一些通用的功能或特性, 并且可以被其他类继承和重用这些功能;

odoo 中也实现了一些 `Mixins` 来让其易于在自己的对象中添加常用的行为; 


## 消息功能

odoo 中的 `mail` 模块用于向模型添加消息相关的功能, 比如消息线程和活动; 这使得模型能够处理消息、邮件、活动和跟踪记录.

### 基本消息系统

将消息功能集成到模型中极其容易. 只需继承 `mail.thread` 模型并在表单视图添加消息字段(及相应的控件) 就可以马上配置完成并运行;

例如, 为我们第二节中创建的图书模块添加消息交换:

1. **`添加消息依赖`**
```python
# 需要在 __manifest__.py 添加 depends

'depends': ['base', 'mail'], 
```
2. **`继承 mail.thread`**
```python{8}
from odoo.exceptions import ValidationError
from odoo import models, fields, api


class Book(models.Model):
    _name = 'library.book'
    _description = 'Book'
    _inherit = ['mail.thread']

    # 图书名称
    name = fields.Char('Title', required=True) 
    ...
```
3. **`在视图中添加以下元素`**
```xml{21-24}
<record id="view_form_book" model="ir.ui.view">
    <field name="name">Book Form</field>
    <field name="model">library.book</field>
    <field name="arch" type="xml">
        <form string="Book">
            <header>
                <button name="button_check_isbn" type="object" string="Check ISBN" />
            </header>
            <sheet>
                <group>
                    <field name="name" />
                    <field name="author_ids" widget="many2many_tags" />
                    <field name="publisher_id" />
                    <field name="date_published" />
                    <field name="isbn" />
                    <field name="active" />
                    <field name="cover" widget="image" />
                </group>
            </sheet>

            <div class="oe_chatter">
                <field name="message_follower_ids" widget="mail_followers"/>
                <field name="message_ids" widget="mail_thread"/>
            </div>
        </form>
    </field>
</record>
```
这个时候如果升级 `library_app` 模块, 打开 `form` 视图就会发现右边工作区多出了消息模块的内容:

![mail](/images/odoo/S12/mixin.png)

一旦在模型中添加了 `chatter` 支持, 用户就可以在模型的任意记录中轻易的添加消息或者内部记录; 每个都会发送通知(消息) 给所有的关注者, 内部记录会发送给 `base.group_user` 的用户;

如果正确的配置了邮件网关以及 `catchall` 地址, 这些消息会通过邮件发送并可通过邮件客户端进行回复; 自动路由系统会将回复路由到正确的线程中;

odoo 服务端中还提供了一些函数, 可帮助你轻易地发送消息及对记录管理关注者:

#### 发送消息

在线程中发送一条新的消息, 返回新消息 `mail.message` 的 id;

- **`message_post(self, body='', subject=None, message_type='notification', subtype=None, parent_id=False, attachments=None, **kwargs)`**: 发送消息, 接收以下参数:
    - **`body`**: 消息正文, 通常是一段 html 内容;
    - **`message_type`**: 消息类型; 有以下几种选项: (具体请查看 `addons/mail/models/mail_message.py`)
        - **`email`**: 用于发送邮件, 可以包括邮件主题、收件人、抄送、附件等信息, 这样发送的消息可以直接通过邮件发送到相关用户的邮箱;
        - **`comment`**: 用于发送一般的文本消息, 适用于一般的通知、备注和讨论;
        - **`notification`**: 用于发送系统级别的通知, 比如自动化流程产生的消息、提醒或警告等;
        - **`user_notification`**: 用于发送通知, 这种消息会作为用户的提醒和通知显示, 适用于提醒用户一些重要的事项或者状态更新;
    - **`parent_id`**: 在私人讨论的情况下, 通过将父级合作伙伴添加到消息中来处理对上一条消息的回复;
    - **`attachments`**: 消息中添加的附件; `list(tuples)`, 其中 `tuple(name, content)`, `content` 为 base64 字符;
    - **`**kwargs`**: 额外的关键字参数将用作新 `mail.message` 记录的默认列值;

```python
def button_post_comment(self):
    self.sudo().message_post(
        body=f"""
            <div>
                <p>message record</p>
                <p>message content...</p>
            </div>
        """, 
        subtype_xmlid="mail.mt_comment", 
        author_id=self.env.uid
    )
```
当调用这个方法之后, 系统会在消息区添加一条消息内容:

![mail-comment](/images/odoo/S12/mail-comment.png)

- **`message_post_with_view(views_or_xmlid, **kwargs)`**: 使用 `ir.qweb` 引擎渲染的 `view_id` 发送邮件/消息的快捷方法; 此方法是独立的, 因为模板和编辑器中没有任何内容允许批量处理视图; 当模板处理 `ir.ui` 视图时, 此方法可能会消失

```python{1}
activity_message = record.message_post_with_view(
    'mail.message_activity_done',
    values={
        'activity': activity,
        'feedback': feedback,
        'display_assignee': activity.user_id != self.env.user
    },
    subtype_id=self.env['ir.model.data']._xmlid_to_res_id('mail.mt_activities'),
    mail_activity_type_id=activity.activity_type_id.id,
    attachment_ids=[Command.link(attachment_id) for attachment_id in attachment_ids] if attachment_ids else [],
)
```

- **`message_post_with_template(template_id, **kwargs)`**: 使用模板发送邮件的快捷方法

```python{7}
def activity_send_mail(self, template_id):

    template = self.env['mail.template'].browse(template_id).exists()
    if not template:
        return False
    for record in self:
        record.message_post_with_template(
            template_id,
            composition_mode='comment'
        )
    return True
```

#### 接收消息

当邮件网关处理新电子邮件时, 将调用这些方法; 这些电子邮件可以是新线程 (如果它们通过别名到达), 也可以只是来自现有线程的回复; 允许您根据电子邮件的某些值来覆盖它们; (更新日期或电子邮件地址、添加抄送地址作为关注者等)

- **`message_new(msg_dict, custom_values=None)`**: 当给定线程模型收到新消息时, 如果该消息不属于现有线程, 则由 `message_process` 调用; 默认行为是创建相应模型的新记录 (基于从消息中提取的一些非常基本的信息) 可以通过重写此方法来实现其他行为
    - **`msg_dict`**: 包含电子邮件详细信息和附件的地图; 详细信息请查看 `addons/mail/models/mail_thread.py`;
    - **`custom_values`**: 创建新线程记录时传递给 `create()` 的附加字段值的可选字典; 请注意, 这些值可能会覆盖来自消息的任何其他值;
```python{9}
@api.model
def message_new(self, msg_dict, custom_values=None):
    if custom_values is None:
        custom_values = {}
    cc_values = {
        'email_cc': ", ".join(self._mail_cc_sanitized_raw_dict(msg_dict.get('cc')).values()),
    }
    cc_values.update(custom_values)
    return super(MailCCMixin, self).message_new(msg_dict, cc_values)
```    

- **`message_update(msg_dict, update_vals=None)`**: 当现有线程收到新消息时由 `message_process` 调用; 默认行为是使用从传入电子邮件中获取的 `update_vals` 更新记录; 可以通过重写此方法来实现其他行为
    - **`msg_dict`**: 包含电子邮件详细信息和附件的地图; 详细信息请查看 `addons/mail/models/mail_thread.py`;
    - **`update_vals`**: 字典, 包含根据给定的 id 更新记录的值; 如果字典为 None 或 void, 则不执行写入操作;

```python{11}
def message_update(self, msg_dict, update_vals=None):
    if update_vals is None:
        update_vals = {}
    cc_values = {}
    new_cc = self._mail_cc_sanitized_raw_dict(msg_dict.get('cc'))
    if new_cc:
        old_cc = self._mail_cc_sanitized_raw_dict(self.email_cc)
        new_cc.update(old_cc)
        cc_values['email_cc'] = ", ".join(new_cc.values())
    cc_values.update(update_vals)
    return super(MailCCMixin, self).message_update(msg_dict, cc_values)
```

#### 关注者管理

上面的例子中, 我们在 `library_app` 的 `form` 表单中添加了消息管理, 在消息中, 还可以对当前记录的关注者进行管理;

![flowers-manager](/images/odoo/S12/flowers_manager.png)

- **`message_subscribe(partner_ids=None, channel_ids=None, subtype_ids=None, force=True)`**: 将 `res.partner` 添加到记录关注者中;
    - **`partner_ids`**: 需要关注当前记录的 `res.partner` 的 ids;
    - **`channel_ids`**: 需要关注当前记录的 `channels` 的 ids;
    - **`subtype_ids`**: 需要关注当前记录的 `channels/partners` 的 ids; 如果为 `None`, 则默认为子类型;
    - **`force`**: 如果设置为 True, 则使用参数中的 `subtype_ids` 创建的关注者覆盖之前的;

```python
def button_message_subscribe(self):
    self.sudo().message_subscribe(
        partner_ids=self.env.user.partner_id.ids
    )
```
执行以上函数之后, 会将当前用户下的联系人添加到当前记录的关注者中:

![add-subscribe](/images/odoo/S12/add_subscrible.png)

- **`message_unsubscribe(partner_ids=None, channel_ids=None)`**: 从关注者中移除指定的 `res.partner`;
    - **`partner_ids`**: 需要移除当前记录的 `res.partner` 的 ids;
    - **`channel_ids`**: 需要移除当前记录的 `channels` 的 ids;

```python
def _action_unfollow(self, partner):
    self.message_unsubscribe(partner.ids)
```

### 记录更新

`mail` 模块在字段上添加了强大的跟踪系统; 允许您记录对记录聊天中特定字段的更改; 只需要向字段中添加 `tracking=True` 属性就可以对字段进行跟踪记录;

例如: 我们需要知道图书的名称变更记录, 那么就需要在 `name` 字段上添加 `tracking=True`:

```python{11}
from odoo.exceptions import ValidationError
from odoo import models, fields, api


class Book(models.Model):
    _name = 'library.book'
    _description = 'Book'
    _inherit = ['mail.thread']

    # 图书名称
    name = fields.Char('Title', required=True, tracking=True)
    ...
```
当我们对图书的名称做出修改的时候, 就会自动将修改的追踪记录添加到消息区:

![tracking](/images/odoo/S12/tracking.png)

### subtypes

`Subtypes` 允许我们对消息提供更精准的控制, `subtype` 充当系统的分类系统, 允许订阅者到文档自定义它们希望接收的通知子类型;

子类型是在模块中作为数据创建的, 该模型具有以下字段: (具体字段请查看 `addons/mail/models/mail_message_subtype.py`)
- **`name`**: subtype 的 name, 将显示在通知自定义弹出窗口中;
- **`description`**: 将添加到为此子类型发布的消息中的描述; 如果未设置, 则默认使用 `name`;
- **`internal`**: 带有内部子类型的消息仅对雇员可见, 即 `base.group_user` 组中的成员;
- **`parent_id`**: 自动订阅的链接子类型; 例如项目子类型通过这一关联链接到了任务子类型. 在有人订阅项目时, 他会订阅项目中通过父级子类型所查询到的子类型的所有任务;
- **`relation_field`**: 在链接项目和任务子类型时, 关联字段是任务的 `project_id` 字段;
- **`res_model`**: 子类型适用的模型; 如果为 False, 则此子类型适用于所有模型;
- **`default`**: 订阅时是否默认激活子类型;
- **`sequence`**: 用于在通知自定义弹窗中排序子类型;
- **`hidden`**: 在通知自定义弹窗中是否隐藏该子类型;
- **`_track_subtype()`**: 根据所更新的值对记录上的变更所触发的给予子类型, 与字段追踪交接的子类型允许根据用户所感兴趣的订阅不同类型通知. 这样, 可以重载 `_track_subtype()` 函数

例如: 当我们的图书名称变化的时候, 需要使用指定的 `subtype` 来记录名称的更新;

1. **`定义一个 subtype`**: `library/library_app/views/library_app_subtype.xml`;
```xml
<odoo>
    <data>
        <record id="mt_book_name_change" model="mail.message.subtype">
            <field name="name">Trip Book Name</field>
            <field name="res_model">library.book</field>
            <field name="default" eval="True"/>
            <field name="description">Book Name Trip!</field>
        </record>
    </data>
</odoo>
```
2. **`在模型里面复写 _track_subtype() 方法`**
```python
# library\library_app\models\library_book.py

def _track_subtype(self, init_vals):
    self.ensure_one()
    if 'name' in init_vals:
        return self.env.ref('library_app.mt_book_name_change')
    return super(Book, self)._track_subtype(init_vals) 
```
这个时候, 当我们的图书名称变更的时候, 将会使用预定义的 `subtype` 进行字段追踪:

![subtype](/images/odoo/S12/subtype.png)


### 重载默认值

有好几种方法来自定义 `mail.thread` 模型行为, 包含(但不限于):

- **`_mail_post_access`**: 能够对该模型提交信息的所需访问权限; 默认需要 `write` 权限, 也可设置为 `read`;

```python{5}
class Contract(models.Model):
    _name = 'hr.contract'
    _description = 'Contract'
    _inherit = ['mail.thread', 'mail.activity.mixin']
    _mail_post_access = 'read'
    
    ...
```

上下文键: 这些上下文键可用于某种控制 `mail.thread` 功能如自动订阅或 `create()` 或 `write()` 调用期间的字段追踪 (或任意其它可能有用的方法);

- **`mail_create_nosubscribe`**: 在 `create` 或 `message_post` 时, 不要订阅当前用户到记录线程中;
- **`mail_create_nolog`**: 在创建时, 不要记录自动的 `<Document> created` 消息;
- **`mail_notrack`**: 在创建和写入时, 不要执行值追踪创建消息;
- **`tracking_disable`**: 在创建和写入时, 不执行 `MailThread` 功能 (自动订阅、追踪、提交 …);
- **`mail_auto_delete`**: 自动删除邮件通知; 默认为 True;
- **`mail_notify_force_send`**:  如果发送了50个以内的邮件通知, 直接发送它们而不使用队列; 默认为 True;
- **`mail_notify_user_signature`**: 在 `email` 通知中添加当前用户签名; 默认为 `True`;

```python{4,5}
def _chatbot_post_message(self, chatbot_script, body):

    return self.with_context(
        mail_create_nosubscribe=True,
        mail_auto_delete=False
    ).message_post(
        author_id=chatbot_script.operator_partner_id.id,
        body=body,
        message_type='comment',
        subtype_xmlid='mail.mt_comment',
    )
```

## 活动追踪

活动是用户应接收像打电话或组织会议这样的文档的动作, 活动自带 `mail` 模块, 它们在 `chatter` 中继承了, 但并未与 `mail.thread` 捆绑在一起; 活动是 `mail.activity` 类的记录, 它拥有类型 `mail.activity.type`, 名称, 描述, 计划时间等; 进行中的活动在 `chatter` 控件中的消息历史内可见;

可以对记录 (分别为 `mail_activity` 和 `kanban_activity` 控件) 的对象和具体模块在表单视图和看板视图中使用 `activity_ids` 来展示它们使用 `mail.activity.mixin` 类集成的活动;

例如给我们的 book 模型添加如下 `mixin`:

```python{8}
from odoo.exceptions import ValidationError
from odoo import models, fields, api


class Book(models.Model):
    _name = 'library.book'
    _description = 'Book'
    _inherit = ['mail.thread', 'mail.activity.mixin']

    # 图书名称
    name = fields.Char('Title', required=True, tracking=True)
    ...
```
然后需要在视图中添加 `activity_ids` 字段展示:

```python{21}
<form string="Book">
    <header>
        <button name="button_check_isbn" type="object" string="Check ISBN" />
        <button name="button_post_comment" type="object" string="Message Comment" />
        <button name="button_message_subscribe" type="object" string="Add Subscribe" />
    </header>
    <sheet>
        <group>
            <field name="name" />
            <field name="author_ids" widget="many2many_tags" />
            <field name="publisher_id" />
            <field name="date_published" />
            <field name="isbn" />
            <field name="active" />
            <field name="cover" widget="image" />
        </group>
    </sheet>

    <div class="oe_chatter">
        <field name="message_follower_ids" widget="mail_followers"/>
        <field name="activity_ids" widget="mail_activity"/>
        <field name="message_ids" widget="mail_thread"/>
    </div>
</form>
```
`form` 视图中就会出现活动的页签, 点击页签, 可以为当前记录创建一条活动记录;

![activities](/images/odoo/S12/activity_plan.png)

## 网站功能

除了管理端提供的这些常用的 `Mixin` 之外, 还有一些网站使用的 `Mixin` 类, 用来快速扩展网站的功能;

### 访客追踪

`utm.mixin` 类可用于追踪通过指定资源链接中的参数来跟踪在线营销/传播活动, `utm.mixin` 向模型添加了 3 个字段:
- **`campaign_id`**: `many2one` 类型, 关联模型为 `utm.campaign`; (如 Christmas_Special, Fall_Collection等)
- **`source_id`**: `many2one` 类型, 关联模型为 `utm.source`; (如搜索引擎、邮件列表等)
- **`medium_id`**: `many2one` 类型, 关联模型为 `utm.medium`; (如Snail Mail, e-Mail, 社交网络更新等)

这些关联的 `many2one` 都有一个 `name` 字段, 它只是为了区分活动名称, 没有其他的特定的行为;

在客户通过 [`url`](https://www.odoo.com/zh_CN?campaign_id=mixin_talk&source_id=www.odoo.com&medium_id=website)中所设置的参数访问网站时; 就会在访问者的网站中为这些参数设置了三个 cookie;

一旦从网站创建了继承自 `utm.mixin` 的数据记录, `utm.mixin` 代码就会启动并且从 `cookie` 中取值将它们设置到当前创建的记录中, 完成之后, 我们可以定义报表和视图时 就可以使用这三个字段的值;

例如 crm 的市场营销模块: 这可以很方便的为我们的记录提供数据来源的展示

![crm-utm-mixin](/images/odoo/S12/crm_utm_mixin.png)

要扩展这一个默认行为, 只需要在简单模型 (能够支持快速创建的模型) 里面添加关联字段, 并继承函数 `tracking_fields()`:

```python
class UtmMixin(models.AbstractModel):

    _name = 'utm.mixin'
    _description = 'UTM Mixin'

    campaign_id = fields.Many2one('utm.campaign', 'Campaign')
    source_id = fields.Many2one('utm.source', 'Source')
    medium_id = fields.Many2one('utm.medium', 'Medium')
    
    def tracking_fields(self):
        return [
            # ("URL_PARAMETER", "FIELD_NAME_MIXIN", "NAME_IN_COOKIES")
            ('utm_campaign', 'campaign_id', 'odoo_utm_campaign'),
            ('utm_source', 'source_id', 'odoo_utm_source'),
            ('utm_medium', 'medium_id', 'odoo_utm_medium'),
        ]
```

### 网站可见性

您可以轻松地在任何记录上添加网站可见性切换, 虽然这个 `mixin` 很容易手动实现, 但它是继 `mail.thread` 继承之后最常用的; 该 `mixin` 的典型用例是任何具有前端页面的对象; 能够控制页面的可见性使您可以在编辑页面时花些时间, 并且仅在满意时才发布它;

通过使用 `website.published.mixin`, 您可以轻松地为自定义模型添加网站发布相关的功能, 并在网站上管理和展示这些记录的发布状态;

```python
class BlogPost(models.Model):
    _name = "blog.post"
    _description = "Blog Post"
    _inherit = ['website.published.mixin']
```
这个 `mixin` 会向模型中添加下面几个字段:
- **`website_published`**: 网站的发布状态;
- **`website_url`**: 访问对象的 url 字段;

需要注意的是 `website_url` 是一个计算字段, 我们可以通过复写 `_compute_website_url` 函数来实现:

```python
def _compute_website_url(self):
    for blog_post in self:
        blog_post.website_url = "/blog/%s" % (log_post.blog_id)
```
然后就可以在 `xml` 里面给记录添加发布的功能按钮:

```xml{12-16}
<record id="view_delivery_carrier_form_website_delivery" model="ir.ui.view">
    <field name="name">delivery.carrier.website.form</field>
    <field name="model">delivery.carrier</field>
    <field name="inherit_id" ref="delivery.view_delivery_carrier_form"/>
    <field name="arch" type="xml">
        <field name="company_id" position='after'>
            <field name="website_id" groups="website.group_multi_website" options="{'no_open': True, 'no_create_edit': True}"/>
        </field>
        <field name="carrier_description" position='before'>
            <field name="website_description"  placeholder="Description displayed on the eCommerce and on online quotations."/>
        </field>
        <xpath expr="//button[@name='toggle_prod_environment']" position='before'>
            <button name="website_publish_button" type="object" class="oe_stat_button" icon="fa-globe">
                <field name="is_published" widget="website_publish_button"/>
            </button>
        </xpath>
    </field>
</record>
```
例如: 网站的付款方式, 如果在这边进行了发布, 网站上就可以选择不同的付款方式了;

![publish](/images/odoo/S12/publish.png)

![published](/images/odoo/S12/published.png)

> 网站端处理的源代码请查看 `addons\website_sale\views\templates.xml` `<template id="payment" name="Payment">`;

操作 `website_publish_button` 在 `mixin` 中定义, 并根据您的对象调整其行为: 如果该类具有有效的 `website_url` 计算函数, 则当用户单击该按钮时将被重定向到前端; 然后, 用户可以直接从前端发布页面. 这确保了在线发布不会意外发生. 如果没有计算函数, 则简单地触发布尔 `website_published`

### 网站元数据

`website.seo.metadata` 允许我们可以轻松的在网站添加元数据;

该 `mixin` 对模型添加了3个字段:
- **`website_meta_title`**: 允许对页面设置额外标题的 `Char` 字段;
- **`website_meta_description`**: 包含页面短描述 (有时在搜索引擎结果中使用) 的 `Char` 字段;
- **`website_meta_keywords`**: 包含一些有助于在搜索引擎更精准分类页面的关键词的 `Char` 字段;

这些字段可以使用编辑器工具栏中的 "升级" 工具在前端进行编辑. 设置这些字段可以帮助搜索引擎更好地索引您的页面. 请注意, 搜索引擎的结果不仅仅基于这些元数据; 最好的搜索引擎优化实践仍然应该是获得可靠来源的参考;

```python{6}
class BlogPost(models.Model):
    _name = "blog.post"
    _description = "Blog Post"
    _inherit = [
        'mail.thread', 
        'website.seo.metadata', 
        'website.published.multi.mixin',
        'website.cover_properties.mixin', 
        'website.searchable.mixin'
    ]
    _order = 'id DESC'
    _mail_post_access = 'read'
    
```

![blog-post](/images/odoo/S12/blog_post_meta.png)

## 用户评分

评级 `mixin` 允许发送电子邮件以询问客户评级, 在看板流程中自动过渡并汇总评级的统计数据;

### 对模型添加评分

只需要在模型里面添加 `rating.mixin` 的支持:

```python{7}
# 需要安装 website_slides 模块

class Channel(models.Model):
    _name = 'slide.channel'
    _description = 'Course'
    _inherit = [
        'mail.thread', 'rating.mixin',
        'mail.activity.mixin',
        'image.mixin',
        'website.cover_properties.mixin',
        'website.seo.metadata',
        'website.published.multi.mixin',
        'website.searchable.mixin',
    ]
    _order = 'sequence, id'
```
`mixin` 的行为会适应您的模型:
- `rating.rating` 记录将链接到模型的 `partner_id` 字段(如果字段存在); 如果使用 `partner_id` 之外的其他字段, 则可以使用函数 `rating_get_partner_id()` 覆盖此行为;
- `rating.rating` 记录将链接到模型的 `user_id` 字段的合作伙伴(如果字段存在); 如果使用 `user_id` 之外的其他字段, 则可以使用函数 `rating_get_rated_partner_id()` 覆盖此行为; (注意: 该函数必须返回 `res.partner`, 对于 `user_id`系统会自动获取用户的合作伙伴);
- 聊天历史记录将显示评分事件(如果同时还继承了 `mail.thread`);

![rating-mixin](/images/odoo/S12/rating_mixin.png)

如上, `slide.channel` 模型同时继承了 `mail.thread`, `rating.mixin`;  在管理端就可以看到网站提交的评分数据;

![rating-mixin](/images/odoo/S12/rating_mixin_backend.png)

### 通过 email 发送评分请求

如果希望发送邮件索要评分, 仅需要生成带有评分对象链接的 `e-mail`. 最基本的 `email` 模板像下面这样:

```xml
<record id="rating_my_model_email_template" model="mail.template">
    <field name="name">My Model: Rating Request</field>
    <field name="email_from">${object.rating_get_rated_partner_id().email or '' | safe}</field>
    <field name="subject">Service Rating Request</field>
    <field name="model_id" ref="my_module.model_my_model"/>
    <field name="partner_to" >${object.rating_get_partner_id().id}</field>
    <field name="auto_delete" eval="True"/>
    <field name="body_html">
        <![CDATA[
            % set access_token = object.rating_get_access_token()
            <p>Hi,</p>
            <p>How satsified are you?</p>
            <ul>
                <li><a href="/rate/${access_token}/5">Satisfied</a></li>
                <li><a href="/rate/${access_token}/3">Okay</a></li>
                <li><a href="/rate/${access_token}/1">Dissatisfied</a></li>
            </ul>
        ]]>
    </field>
</record>
```
然后, 您的客户将收到一封电子邮件, 其中包含指向简单网页的链接, 从而使他们可以提供有关与用户互动的反馈 (包括自由文本反馈消息);

然后, 您可以通过定义评级的动作来轻松地将评级与表单视图集成在一起:

```xml
<record id="rating_rating_action_my_model" model="ir.actions.act_window">
    <field name="name">Customer Ratings</field>
    <field name="res_model">rating.rating</field>
    <field name="view_mode">kanban,pivot,graph</field>
    <field name="domain">[('res_model', '=', 'my_module.my_model'), ('res_id', '=', active_id), ('consumed', '=', True)]</field>
</record>

<record id="my_module_my_model_view_form_inherit_rating" model="ir.ui.view">
    <field name="name">my_module.my_model.view.form.inherit.rating</field>
    <field name="model">my_module.my_model</field>
    <field name="inherit_id" ref="my_module.my_model_view_form"/>
    <field name="arch" type="xml">
        <xpath expr="//div[@name='button_box']" position="inside">
            <button name="%(rating_rating_action_my_model)d" type="action"
                    class="oe_stat_button" icon="fa-smile-o">
                <field name="rating_count" string="Rating" widget="statinfo"/>
            </button>
        </xpath>
    </field>
</record>
```
注意评分存在默认视图 (kanban,pivot,graph), 让我们可以对客户评分有一个快速全景视图;

可以在以下模块中找到示例:
- `project.task`:  在 Project (rating_project)应用中
- `helpdesk.ticket`: 在Helpdesk (helpdesk – 仅在Odoo企业版中存在)应用中










