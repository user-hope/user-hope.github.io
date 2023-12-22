---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-02/控制器.md
next:
  link: /pages/web-server/odoo/section-02/Mixin.md
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










