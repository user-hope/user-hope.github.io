---
headerDepth: 3
prev:
  link: /pages/web-server/odoo/section-01/基本视图.md
next:
  link: /pages/web-server/odoo/section-01/模型.md
---

## API

odoo API模块定义 Odoo 环境和方法装饰器; 这里对 odoo 的常见的 api 进行学习, 后面会深入 ORM 模型进行学习;

### @api.autovacuum

```@api.autovacuum(method)```

在执行 CRUD 操作(增删改查) 后自动执行清理工作; 它用于自动清理数据库中的孤立记录, 即那些与其它记录没有关联的记录, 并且在删除其关联记录时没有被自动删除的记录;

```python
@api.autovacuum
def _archive_meeting_rooms(self):
    """ 如果暂时没有人加入, 则将 0 参与者的所有非固定房间存档 """
    self.sudo().search([
        ("is_pinned", "=", False),
        ("active", "=", True),
        ("room_participant_count", "=", 0),
        ("room_last_activity", "<", fields.Datetime.now() - self._DELAY_CLEAN),
    ]).active = False
```

### @api.constrains

```@api.constrains(*args)```

装饰约束检查器, 参数为需要进行约束的字段; 当对数据记录进行保存的时候触发校验;

```python
@api.constrains('name', 'description')
def _check_description(self):
    for record in self:
        if record.name == record.description:
            raise ValidationError("Fields name and description must be different")
```
> `@api.constrains` 只支持对简单字段进行约束, 不支持 `relational` 关系字段进行约束; eg: `partner_id.customer`; 只有当装饰器方法中声明的字段包含在 write 或者 create 时才会被调用; 这也就意味着视图中不存在的字段在创建/编辑的时候不会被校验;

odoo 支持另外一种添加限制的方式, 即通过 sql 约束的方式; 方法是在 odoo 类中添加一个 `_sql_constraints` 属性, 值是一个包含了元组的列表, 元组的三个值分别是: 约束名, 条件, 警告信息;

```python
_sql_constraints = [
    ('name_description_check',
     'CHECK(name != description)',
     "The title of the course should not be the description"),
    ('name_unique',
     'UNIQUE(name)',
     "The course title must be unique"),
]
```
这样做的好处是, 在数据库层面就限制了数据的校验, 而不是在代码层面的校验, 显然效率会更高; 缺点是在添加限制之前, 数据库中不能存在违反约束的数据, 否则约束会添加失败;

### @api.depends

```@api.depends(*args)```

指定计算属性方法的依赖字段; 如果有多个, 可以使用 `,` 隔开;

```python
pname = fields.Char(compute='_compute_pname')

@api.depends('partner_id.name', 'partner_id.is_company')
def _compute_pname(self):
    for record in self:
        if record.partner_id.is_company:
            record.pname = (record.partner_id.name or "").upper()
        else:
            record.pname = record.partner_id.name
```

对于 `compute` 方法来说, 加不加 `depends` 装饰的区别在于: 加了 `depends` 的方法会在依赖的字段发生改变时重新计算本字段的值, 而不加 `depends` 的方法只在触发的第一次调用, 也就是说不会持续更新;

### @api.depends_context

`@api.depends_context(*args)`

指定计算属性方法的依赖字段; 字段来源于 `context` 的上下文中; 如果有多个, 可以使用 `,` 隔开;

```python
@api.depends_context('pricelist', 'quantity')
@api.depends('product_id', 'price')
def _compute_price_reduce(self):
    for category in self:
        product = category.product_id
        pricelist = product.product_tmpl_id._get_contextual_pricelist()
        lst_price = product.currency_id._convert(
            product.lst_price,
            pricelist.currency_id,
            self.env.company,
            fields.Datetime.now()
        )
        discount = (lst_price - product._get_contextual_price()) / lst_price if lst_price else 0.0
        category.price_reduce = (1.0 - discount) * category.price
```

### @api.model

```@api.model(method)```

`api.model` 装饰的方法, 其 self 只代表模型, 不含有具体的记录值; 典型的应用时对象的 `create` 方法:

```python
@api.model
def create(self,vals):
    return super(Book,self).create(vals)
```
> `create` 方法不会获取页面中标注为 `readonly` 的字段的值, 如果想要保存只读字段的值, 请将其 `force_save` 属性设置为 `True`;

如果需要某一个方法提供给 js 的 rpc 调用, 需要使用 `@api.model` 装饰器进行装饰;

### @api.model_create_multi

```@api.model_create_multi(method)```

将 create 方法转换为创建多个记录的方法;

```python
@api.model_create_multi
def create(self, vals_list):
    for vals in vals_list:
        zip_from = vals.get('zip_from')
        zip_to = vals.get('zip_to')
        if zip_from and zip_to:
            vals['zip_from'], vals['zip_to'] = self._convert_zip_values(zip_from, zip_to)
    return super().create(vals_list)
    
# record = model.create(vals)  -->  records = model.create([vals, ...])
```

### @api.onchange

```@api.onchange(*args)```

通常用于表单视图, 当指定的字段被修改时, 调用该方法; 

```python
@api.onchange('country_id')
def _onchange_country_id(self):
    if self.country_id:
        self.zip_from = self.zip_to = self.country_group_id = False
        self.state_ids = [(5,)]
        self.states_count = len(self.country_id.state_ids)
```
`onchange` 可以有返回值可以没有返回值, 返回值由一个字典组成, 可选的值有 `value` 和 `warning`, `value` 用来返回需要设置的字段值, `warning` 用来返回一些警告信息;

```python
@api.onchange('amount', 'unit_price')
def _onchange_price(self):
    self.price = self.amount * self.unit_price
    return {
        'warning': {
            'title': "Something bad happened",
            'message': "It was very bad indeed",
            'type': 'notification'
        }
    }
```

### @api.ondelete

```@api.ondelete(*, at_uninstall)```

通过使用这个装饰器, 可以为模型的 `unlink()` 方法定义特定的行为; 比如在删除记录之前或之后执行特定的操作; 这可以让我们更好地控制记录删除时的行为, 从而确保系统在记录删除时能够按照您的需求执行相应的操作;

```python
@api.ondelete(at_uninstall=False)
def _unlink_if_partner_in_account_move(self):
    """
    以下情况不能删除合作伙伴(联系人):
    - partner in 'account.move'
    - state: all states (draft and posted)
    """
    moves = self.sudo().env['account.move'].search_count([
        ('partner_id', 'in', self.ids),
        ('state', 'in', ['draft', 'posted']),
    ])
    if moves:
        raise UserError(_("The partner cannot be deleted because it is used in Accounting"))
```
> 用 `ondelete` 修饰的方法应在某些条件下引发错误, 按照规范, 应该将方法命名为 `_unlink_if_<condition>` 或者 `_unlik_except_<not_condition>`

### @api.returns

```@api.returns(model, downgrade=None, upgrade=None)```

主要是用来指定返回值的格式, 它接受三个参数, 第一个为返回值的 `model`, 第二个为向下兼容的 `method`, 第三个为向上兼容的 `method`; 主要用于确保新旧 API 返回值的一致;

第一个参数如果是对象本身, 则写 `'self'`, 如果是其他对象, 则写其他对象名如: `@api.returns('ir.ui.view')`

```python
@api.returns('self', lambda value: value.id)
def copy(self, default=None):
    self.ensure_one()
    sup = super(ResUsers, self)
    if not default or not default.get('email'):
        sup = super(ResUsers, self.with_context(no_reset_password=True))
    return sup.copy(default=default)
```

## ENV

`Environment` 对象代表了当前事务的数据库会话和模型记录集合; 它提供了访问数据库中的记录, 执行搜索, 更新和创建新记录的方法; `Environment` 对象还包含了当前事务中模型的元数据信息, 如字段定义, 操作权限等;

该环境存储 ORM 的各种上下文的数据:
- `cr`: 当前环境使用的数据库的指针;
- `uid`: 当前用户的 id;
- `context`: 当前上下文字典;
- `su`: 是否是在超级用户模式;
- `lang`: 当前环境中使用的语言;
- `user`: `res.users` 的当前用户的实例;
- `company`: 当前用户的所属公司的实例;
- `companies`: 当前用户已启用的公司的记录集;

`env` 环境中还提供了一些便捷的方法:
- `env.ref(xml_id, raise_if_not_found=True)`: 获取 `xml_id` 的 id;
- `env.is_superuser()`: 是否是在超级用户模式;
- `env.is_admin()`: 是否有用户组访问权限, 或是否是超级用户模式;
- `env.is_system()`: 是否有 `setting` 访问权限, 或者是否是超级用户模式;

改变环境变量的方法, odoo 的环境变量是不可以直接修改的, 需要使用以下方法对模型下的静态方法进行修改: 
- `Model.width_context([context][, **overrides])`: 扩展上下文或合并覆盖当前的上下文; 
```python
# current context is {'key1': True}

r2 = records.with_context({}, key2=True)
# -> r2._context is {'key2': True}

r2 = records.with_context(key2=True)
# -> r2._context is {'key1': True, 'key2': True}
```
- `Model.with_user(user)`: 在非超级用户模式下, 返回附加到给定用户的此记录集的新版本;
```python
from odoo import SUPERUSER_ID, api, fields, models, _

# 使用超级用户下面的数据
def action_confirm(self):
    res = super().action_confirm()
    if self.env.su:
        self = self.with_user(SUPERUSER_ID)

    for order in self:
        if order.sale_order_template_id and order.sale_order_template_id.mail_template_id:
            order.sale_order_template_id.mail_template_id.send_mail(order.id)
    return res
```
- `Model.with_company(company)`: 返回指定公司下的记录集;
- `Model.with_env(env)`: 可以确保在特定的环境中处理记录, 有助于避免环境上下文的混淆和数据的隔离;
- `Model.sudo([flag=True])`: 返回启用/禁用超级用户模式的此记录集的新实例; 使用 `sudo` 不会更改当前用户, 只是跳过部分访问权的限制;


## SQL 执行

`env` 上的 `cr` 属性是当前数据库事务的指针, 允许直接执行 `sql`, 无论是对于难以使用 ORM 表达式实现的复杂查询, 还是出于性能原因;

```python
self.env.cr.execute("some_sql", params)

# 查询sql
self.env.cr.execute(`sql`)
# 当前 sql 查询的所有字段名
headers = [d[0] for d in self.env.cr.description]
# 当前 sql 查询的所有数据
records = self.env.cr.fetchall()
# 当前 sql 查询出来的记录 total
rowcount = self.env.cr.rowcount
```
> 注意: 执行原生 sql 会绕过 orm , 从而绕过 odoo 的记录规则以及权限规则; 在使用的时候, 请确保 sql 语句的安全性;

关于模型, 需要了解的一件重要事情是, 它们不一定立即执行数据库更新; 事实上, 由于性能原因, 框架在修改记录后延迟了字段的重新计算; 一些数据库更新也被延迟了; 因此, 在查询数据库之前, 必须确保它包含查询的相关数据. 此操作称为刷新, 并执行预期的数据库更新;

```python
# 刷新模型, 确保模型上的 `partner_id` 是最新的数据
self.env['model'].flush_model(['partner_id'])

self.env.cr.execute("SELECT id FROM model WHERE partner_id IN %s", [ids])
ids = [row[0] for row in self.env.cr.fetchall()]
```
在每次 sql 查询之前, 都必须刷新该查询所需的数据; 刷新数据有三个级别, 每个级别都有自己的 api; 可以刷新所有内容, 模型的所有记录 或 某些特定的记录; 因为延迟更新通常会提高性能, 所以我们建议在刷新时要特别注意:

- `env.flush_all()`: 将所有挂起的计算和更新刷新到数据库;
```python{7}
@api.model_create_multi
def create(self, vals_list):
    events = super(EventEvent, self).create(vals_list)
    for res in events:
        if res.organizer_id:
            res.message_subscribe([res.organizer_id.id])
    self.env.flush_all()
    return events 
```
- `Model.flush_model(fnames=None)`: 刷新 `self` 当前模型上面的指定字段的数据;
- `Model.flush_recordset(fnames=None)`: 自行处理挂起的计算和记录上的数据库更新. 当给定参数时, 该方法保证至少将记录自身上的给定字段刷新到数据库中;

由于模型使用相同的游标, 而环境中包含各种缓存, 因此在原始 `sql` 中更改数据库时, 这些缓存必须无效; 在 SQL 中使用 `CREATE` , `UPDATE` 或 `DELETE` 时, 有必要清除缓存, 而不是 `SELECT`;
```python
# 确保数据库中的 state 字段是最新的
self.env['model'].flush_model(['state'])

self.env.cr.execute("UPDATE model SET state=%s WHERE state=%s", ['new', 'old'])

# 使缓存中的 state 字段无效
self.env['model'].invalidate_model(['state'])
```

就像刷新一样, 可以使整个缓存, 模型的所有记录的缓存或特定记录的缓存无效; 甚至可以使模型的某些记录或所有记录上的特定字段无效. 由于缓存通常会提高性能, 因此我们建议在无效时进行特定处理;

- `env.invalidate_all(flush=True)`: 使所有的记录缓存都无效;
```python{14}
@api.model
def schedule_communications(self, autocommit=False):
    schedulers = self.search([
        ('event_id.active', '=', True),
        ('mail_done', '=', False),
        ('scheduled_date', '<=', fields.Datetime.now())
    ])

    for scheduler in schedulers:
        try:
            self.browse(scheduler.id).execute()
        except Exception as e:
            _logger.exception(e)
            self.env.invalidate_all()
            self._warn_template_error(scheduler, e)
        else:
            if autocommit and not getattr(threading.current_thread(), 'testing', False):
                self.env.cr.commit()
    return True 
```

- `Model.invalidate_model(fnames=None, flush=True)`: 当前模型上缓存的值与数据库的值不在对应的时候, 使当前模型上的所有的记录缓存无效;
```python{14}
def write(self, vals):
    self._sanitize_vals(vals)
    if 'uom_id' in vals or 'uom_po_id' in vals:
        uom_id = self.env['uom.uom'].browse(vals.get('uom_id')) or self.uom_id
        uom_po_id = self.env['uom.uom'].browse(vals.get('uom_po_id')) or self.uom_po_id
        if uom_id and uom_po_id and uom_id.category_id != uom_po_id.category_id:
            vals['uom_po_id'] = uom_id.id
    res = super(ProductTemplate, self).write(vals)
    if 'attribute_line_ids' in vals or (vals.get('active') and len(self.product_variant_ids) == 0):
        self._create_variant_ids()
    if 'active' in vals and not vals.get('active'):
        self.with_context(active_test=False).mapped('product_variant_ids').write({'active': vals.get('active')})
    if 'image_1920' in vals:
        self.env['product.product'].invalidate_model([
            'image_1920',
            'image_1024',
            'image_512',
            'image_256',
            'image_128',
            'can_image_1024_be_zoomed',
        ])
    return res 
```
- `Model.invalidate_recordset(fnames=None, flush=True)`: 当缓存的值不再与数据库值对应时, 使 `self`当前模型中记录的缓存无效; 如果给定了参数, 则只有 `self` 上的给定字段从缓存中无效;


上述方法使缓存和数据库保持一致. 然而, 如果已在数据库中修改了计算字段相关性, 则必须通知要重新计算的计算字段的模型; 框架唯一需要知道的是哪些字段在哪些记录上发生了更改;
```python
# 确保数据库中的 state 是最新的
self.env['model'].flush_model(['state'])

# 使用 RETURNING 子句检索已更改的行
self.env.cr.execute("UPDATE model SET state=%s WHERE state=%s RETURNING id", ['new', 'old'])
ids = [row[0] for row in self.env.cr.fetchall()]

# 使缓存无效, 并将更新通知给框架;
records = self.env['model'].browse(ids)
records.invalidate_recordset(['state'])
records.modified(['state'])
```

有很多方法可以清楚的知道哪些记录被修改了, 在上面的例子中我们利用 `postgresql` 的 `RETURNING` 子句来检索信息, 而不需要进行额外的查询; 
- `Model.modified(fnames, create=False, before=False)`: 通知自己将修改或已经修改字段; 这将在必要时使缓存无效, 并准备重新计算相关存储字段;

```python{3,4,11}
def _ondelete_stock_moves(self):
    modified_fields = ['qty_received_manual', 'qty_received_method']
    self.flush_recordset(fnames=['qty_received', *modified_fields])
    self.invalidate_recordset(fnames=modified_fields, flush=False)
    query = f'''
        UPDATE {self._table}
        SET qty_received_manual = qty_received, qty_received_method = 'manual'
        WHERE id IN %(ids)s
    '''
    self.env.cr.execute(query, {'ids': self._ids or (None,)})
    self.modified(modified_fields)
```

## CURD 方法

上面介绍了多种 api 装饰器以及环境变量和函数的一些用法, 下面来了解一下 odoo orm 框架的标准 `CURD` 方法的用法;

### Create/Update

- `Model.create(vals_list) -> records`: 为模型创建新的记录; 返回值是当前模型的实例;
```python
user = self.env['res.users'].create({
    'name': 'I am accountman!',
    'login': 'accountman',
    'password': 'accountman',
    'groups_id': [
        (6, 0, cls.env.user.groups_id.ids),
        (4, cls.env.ref('account.group_account_manager').id),
        (4, cls.env.ref('account.group_account_user').id),
    ],
})

records = self.env['res.currency.rate'].create([
    {
        'currency_id': cls.env.ref('base.EUR').id,
        'name': '2010-01-02',
        'rate': 1.0,
    }, {
        'currency_id': cls.env.ref('base.USD').id,
        'name': '2010-01-02',
        'rate': 1.2834,
    }, {
        'currency_id': cls.env.ref('base.USD').id,
        'name': time.strftime('%Y-06-05'),
        'rate': 1.5289,
    }
]) 
```

- `Model.copy(default=None)`: 重复记录使用默认值自我更新;
```python
attachment = self.env['ir.attachment'].copy({
    'res_model': 'hr.expense', 
    'res_id': 122
}) 
```

- `Model.default_get(fields_list) -> default_values`: 返回 `fields_list` 中字段的默认值, 默认值由上下文, 用户默认值和模型本身决定;
```python
defaults = self.env['account.tax'].with_company(self).default_get([
    'invoice_repartition_line_ids', 
    'refund_repartition_line_ids'
]) 
```

- `Model.name_create(name) -> record`: 通过调用 `create()` 方法创建一个新的记录, 只提供一个值: 新纪录的显示名称; 
```python
category_id = self.env['uom.category'].with_context({}).name_create('Unsorted/Imported Units') 
```

- `Model.write(vals)`: 使用提供的值更新当前的所有记录;
```python
partner = self.env['res.partner'].browse(1)

partner.write({
    'signup_token': False, 
    'signup_type': False, 
    'signup_expiration': False
})
```

### Search/Read

- `Model.browse([ids]) -> records`: 返回值为查询的 id 的记录集的实例; 
```python
# 查询一条记录
partner = self.env['res.partner'].browse(7)

# 查询多条记录
partners = self.env['res.partner'].browse([7, 18, 12])
```

- `Model.search(domain[, offset=0][, limit=None][, order=None][, count=False])`: 根据条件查询当前模型下面的所有的记录;
```python
users = self.env['res.users'].search([('name', '=', 'xiangyuan')])
```

- `Model.search_count(domain) -> int`: 返回当前模型中与 domain 匹配的记录集的数量;
```python
leads = self.env['crm.lead'].search_count([
    ('type', '=', 'opportunity'),
    ('user_id', '=', self.user_id.id),
    ('probability', '=', 100),
    ('date_closed', '>=', date_utils.start_of(fields.Datetime.today(), 'year')),
    ('date_closed', '<', date_utils.end_of(fields.Datetime.today(), 'year')),
])
```

- `Model.name_search(name='', args=None, operator='ilike', limit=100) -> records`: 通过给定运算符搜索显示名称与给定名称匹配的记录;
```python
product_names = self.env['product.template'].name_search(name='PTN', operator='not ilike') 
```

- `Model.read([fields])`: 读取当前记录中的请求字段;
```python
mail_values = self.env['mail.mail'].read(['id', 'email_from', 'mail_server_id'])
```

- `Model.read_group(domain, fields, groupby, offset=0, limit=None, orderby=False, lazy=True)`: 主要用于在 `Odoo` 模型中执行类似 `SQL` 中的 `GROUP BY` 操作; 其中:
    - `domain`: 过滤记录的条件;
    - `fields`: 要过滤的字段列表;
    - `groupby`: 要分组的字段列表;
    - `offset`: 偏移量;
    - `limit`: limit 结果集限制条数;
    - `orderby`: 结果排序方式
    - `lazy`: 如果为True, 则仅在获取时计算聚合值
```python
from dateutil.relativedelta import relativedelta

data = self.env['procurement.group'].read_group([('sale_id', 'in', self.ids)], ['ids:array_agg(id)'], ['sale_id'])


incoming_moves = self.env['stock.move.line'].read_group([
    ('product_id', 'in', self.ids),
    ('state', '=', 'done'),
    ('picking_code', '=', 'incoming'),
    ('date', '>=', fields.Datetime.now() - relativedelta(years=1))
], ['product_id'], ['product_id'])
```

### Fields

> `fields` 下面提供的这些方法应该也归属于 `Search/Read`, 同在模型下面的读取/查找数据, 只是这些 api 只用于操作 fields;

- `Model.fields_get([allfields][, attributes])`: 返回每个字段的定义, 返回值是一个字典;
```python
fields = self.env['sale.order'].fields_get(['trigger', 'state'], attributes=('string', 'type', 'selection', 'currency_field'))
```

### Search domains

`domain` 表达式的写法, 标准的 `domain` 为一个包含多个 `(field_name, operator, value)` 元组的 `list`, 其中:
- `field_name`: 字段名称, 字符类型, 可以为基本字段, 也可以是关联字段; eg: `'street'` or `'partner_id.country'`;
- `operator`: 运算符; 有效运算符有:
    - `=`: 等于;
    - `!=`: 不等于;
    - `>`: 大于;
    - `>=`: 大于等于;
    - `<`: 小于;
    - `<=`: 小于等于;
    - `=?`: unset 或 等于; (如果值为 None 或者是 False, 则返回 True, 否则表现为 `=` );
    - `=like`: 一般用于字符模糊匹配; 其中 `_` 代表任何单个字符, `%` 代表任何零个或多个字符的字符串; eg: `[('name', '=like', 'delivery_%')]`;
    - `like`: 与 sql 里面的 `like` 相似; 用于对值进行模糊匹配; eg: `[('code', 'like', '2607%')]`, `[('code', 'like', '%2607%')]`;
    - `not like`: 与 `like` 取反;
    - `ilike`: 不区分大小写的模糊匹配; eg: `[('name', 'ilike', 'test%')]` 表示匹配字段以 `test` 开头的字符串, 不区分大小写;
    - `not ilike`: 与 `ilike` 取反;
    - `=ilike`: 与 `=like` 一致, 不区分大小写;
    - `in`: 等于值中的任何一个选项, 值应该为 `list`; eg: `[('id', 'in', [7, 8, 12])]`;
    - `not in`: `in` 取反;
    - `child_of`: 是记录集的子级; 值可以是一项, 也可以是多项; 遵循模型中定义的 `_parent_name` 字段; eg: `[('order.partner_id', 'child_of', partner.ids)]`;
    - `parent_of`: 是记录集的父级; 值可以是一项, 也可以是多项; 遵循模型中定义的 `_parent_name` 字段;
- `value`: 值域;

可以使用前缀形式的逻辑运算符组合 domain 条件, 其中:
- `&`: 逻辑 and; 用于组合多个条件;
- `|`: 逻辑 or; 
- `!`: 逻辑 not;

> 大多数情况下, `!` 是很少使用的, 因为运算符中的 `!=`, `>=` 基本上能够满足多数情况;

```python
[('name','=','ABC'), ('language.code','!=','en_US'), '|',('country_id.code','=','be'), ('country_id.code','=','de')]

# 换算成 sql 表达式为:
    (name is 'ABC')
AND (language is NOT english)
AND (country is Belgium OR Germany)
```
### domain 的运算过程

odoo 的 domain 使用的是 **波兰表示法**:  运算波兰表达式时, 无需记住运算的层次, 只需要直接寻找第一个运算的操作符, 以二元运算为例, 从左至右读入表达式, 遇到一个操作符后跟随两个操作数时, 则计算, 然后将结果作为操作数替换这个操作符和两个操作数; 重复此步骤, 直至所有操作符处理完毕;

简单的说, 波兰表示法是一种操作符置于操作数前, 并且不需要括号任然能无歧义的解析表达的方法;

例如: `['|','&','|', a , b, c, '&', d, e]`

其中 `a, b, c, e, f, g` 分别是不带逻辑运算符的表达式, 表达式的运算顺序;

```
--> ['|','&','|', a , b, c, '&', d, e]

--> ['|','&', (a | b), c, '&', d, e]

--> ['|', ((a | b) & c), '&', d, e]

--> ['|', ((a | b) & c), (d & e)]

--> [(((a | b) & c) | (d & e))]
```

### Unlink

- `Model.unlink()`: 删除当前记录;

### Record API

- `Model.ids`: 返回当前模型所有的记录集的 id;
- `Model.exists() -> records`: 返回 self 中存在的记录的子集;
```python
user_exist = self.env['res.users'].sudo().browse(user_id).exists(); 
```
- `Model.ensure_one()`: 验证当前记录集是否包含一条记录;
- `Model.name_get()`: 返回一个包含记录 ID 和记录名称的元组列表; 通常用于在界面上显示记录时, 系统需要展示记录的名称而不是 ID;


### Func

odoo 的模型上还提供了一些数据集处理的函数, 能够快捷方便的对数据进行处理; 
- `Model.filtered(func)`: 按照条件对数据进行过滤;
```python
records = self.env['sale.order'].search([])

# 只保留 amount_total > 1000 的数据;
filtered_records = records.filtered(lambda r: r.amount_total > 1000)

# 只保留公司客户
companys = self.env['res.partner'].search([]).filtered("partner_id.is_company")
```

- `Model.mapped(func)`: 可以方便地提取指定字段的数值并进行处理; 返回新的 map
```python
records = self.env['sale.order'].search([])

# 获取所有的 sale.order 记录的名称
order_names = records.mapped('name')
```

- `Model.sorted(key=None, reverse=False)`: 对数据集进行重新排序;
```python
records = self.env['sale.order'].search([])
sorted_orders = records.sorted('date_order')
```






