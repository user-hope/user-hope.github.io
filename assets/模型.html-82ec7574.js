import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as p,c,a as s,b as n,d as l,e as a}from"./app-9b0cd270.js";const i={},d=a(`<h2 id="模型" tabindex="-1"><a class="header-anchor" href="#模型" aria-hidden="true">#</a> 模型</h2><p>与 python 的其他主流框架类似, odoo 的模型也是数据持久化的主要对象, 它是将数据库字段映射成 python 对象, 方便我们对数据进行处理;</p><p>odoo 的模型有下面这些特点:</p><ul><li>支持对层级结构的数据处理;</li><li>确保约束一执行和验证数据有效性;</li><li>对象的元数据根据其状态动态变化;</li><li>通过复杂查询实现优化的数据处理 (可以同时执行多个操作);</li><li>支持默认字段数值;</li><li>优化权限管理;</li><li>支持与持久化数据库 <code>PostgreSQL</code> 的数据交互;</li><li>数据转换功能;</li><li>多层级缓存系统;</li><li>支持多种不同的继承机制;</li><li>丰富的字段类型: 基础字段( varchar, integer, boolean... ), 关系型字段 (one2many, many2one, many2many);</li></ul><h2 id="模型的种类" tabindex="-1"><a class="header-anchor" href="#模型的种类" aria-hidden="true">#</a> 模型的种类</h2><p>odoo 的模型可以分为一下三种类型:</p><ul><li><strong><code>BaseModel</code></strong>: odoo 模型的基类, 所有的模型都是继承自这个类别(不算做模型种类);</li><li><strong><code>AbstractModel</code></strong>: 抽象模型, 用于要由多个继承模型共享的抽象超类;</li><li><strong><code>Model</code></strong>: 数据模型, 常规数据库持久化模型;</li><li><strong><code>TransientModel</code></strong>: 瞬态模型, 用于临时数据, 存储在数据库中, 但每隔一段时间就会自动清空;</li></ul><h2 id="基础属性" tabindex="-1"><a class="header-anchor" href="#基础属性" aria-hidden="true">#</a> 基础属性</h2><p>基础模型包含了一些技术性的参数:</p><ul><li><strong><code>_register</code></strong>: 是否注册, 不注册将在 ORM 中不可用; eg: <code>_register = False</code>;</li><li><strong><code>_auto</code></strong>: 是否应该创建数据表, 如果设置为 False, 需要重新 <code>init()</code> 函数来创建数据表; 对于 <code>Model</code> 和 <code>TransientModel</code>, 自动默认为 <code>True</code>, 对于 <code>AbstractModel</code>, 默认为 <code>False</code>;</li><li><strong><code>_log_access</code></strong>: ORM 是否应自动生成和更新访问日志字段;</li><li><strong><code>_table</code></strong>: 指定数据库中的表名;</li><li><strong><code>_sql_constraints</code></strong>: sql 的约束, 元组 <code>list</code>; eg: <code>[(name, sql_def, message)]</code></li><li><strong><code>_abstract</code></strong>: 是否是抽象模型;</li><li><strong><code>_transient</code></strong>: 是否是瞬态模型;</li><li><strong><code>_name</code></strong>: 模型的名称, 用 <code>.</code> 表示; eg: <code>library.book</code>;</li><li><strong><code>_description</code></strong>: 模型的描述信息;</li><li><strong><code>_inherit</code></strong>: 模型的继承; 如果设置了 <code>_name</code>, 则为要继承的父模型的名称; 如果未设置 <code>_name</code>, 则为扩展 <code>inherit</code> 说标识的模型; (这个比较复杂, 后面会独立展开讨论)</li><li><strong><code>_inherits</code></strong>: 将父业务对象的名称映射到要使用的相应外键字段的名称;</li></ul><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">class</span> <span class="token class-name">BaseModel</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>Model<span class="token punctuation">)</span><span class="token punctuation">:</span>
    _name <span class="token operator">=</span> <span class="token string">&#39;base.model&#39;</span>
    name <span class="token operator">=</span> fields<span class="token punctuation">.</span>Char<span class="token punctuation">(</span>string<span class="token operator">=</span><span class="token string">&quot;Name&quot;</span><span class="token punctuation">)</span>

<span class="token keyword">class</span> <span class="token class-name">CustomModel</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>Model<span class="token punctuation">)</span><span class="token punctuation">:</span>
    _name <span class="token operator">=</span> <span class="token string">&#39;custom.model&#39;</span>
    _inherits <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">&#39;base.model&#39;</span><span class="token punctuation">:</span> <span class="token string">&#39;base_model_id&#39;</span><span class="token punctuation">}</span>

    base_model_id <span class="token operator">=</span> fields<span class="token punctuation">.</span>Many2one<span class="token punctuation">(</span><span class="token string">&#39;base.model&#39;</span><span class="token punctuation">,</span> string<span class="token operator">=</span><span class="token string">&#39;Base Model&#39;</span><span class="token punctuation">,</span> required<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> ondelete<span class="token operator">=</span><span class="token string">&#39;cascade&#39;</span><span class="token punctuation">)</span>
    custom_field <span class="token operator">=</span> fields<span class="token punctuation">.</span>Char<span class="token punctuation">(</span>string<span class="token operator">=</span><span class="token string">&quot;Custom Field&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong><code>_rec_name</code></strong>: 用于指定显示在 <code>Many2one</code> 类型的搜索中的显示字段, 可以简单的理解为该模型的记录集的名称; 默认情况下, <code>_rec_name</code> 的取值为 <code>name</code> 字段;</li><li><strong><code>_order</code></strong>: 排序字段, 默认为 <code>id</code>;</li><li><strong><code>_check_company_auto</code></strong>: 如果设置为 True, 在 <code>write</code>/<code>create</code> 记录的时候, 会调用 <code>_check_company</code> 方法来校验数据的一致性(多公司下非常有用);</li><li><strong><code>_parent_name</code></strong>: 用于存储树形数据时候的关联字段; 默认为 <code>parent_id</code>;</li><li><strong><code>_parent_store</code></strong>: 默认是 False, 设置为 True 的时候会计算 <code>parent_path</code>; 除了 <code>parent_path</code> 字段外, 还设置了记录树结构的索引存储; 以便使用运算符 <code>child_of</code> 和 <code>parent_of</code> 对当前模型的记录进行更快地分层查询;</li><li><strong><code>_fold_name</code></strong>: 用于确定看板视图中折叠组的字段; 默认为 <code>fold</code>;</li><li><strong><code>_date_name</code></strong>: 用于确定在日历视图中使用的字段; 默认为 <code>date</code>;</li><li><strong><code>_rec_names_search</code></strong>: 在 <code>name_search</code> 方法中可以搜索的字段列表;</li></ul><h2 id="abstractmodel" tabindex="-1"><a class="header-anchor" href="#abstractmodel" aria-hidden="true">#</a> AbstractModel</h2><p>抽象模型实际上是基础模型 (BaseModel) 的别称, 不创建数据库表. 抽象模型是数据模型的父类, 数据模型又是瞬态模型的父类, 因此, 抽象模型实际上是所有模型的父类;</p>`,14),r=s("code",null,"BaseModel",-1),u={href:"https://github.com/jellyfrank/odoo/blob/16.0/odoo/models.py#L136",target:"_blank",rel:"noopener noreferrer"},k=a(`<p>抽象模型不存储数据, 可以作为重用的功能集, 任何继承了抽象模型的模型类, 都可以享用抽象模型里面提供的方法; 例如: <code>mail.thread</code> 可以混入到很多模型里面使用;</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> odoo <span class="token keyword">import</span> models


<span class="token keyword">class</span> <span class="token class-name">Http</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>AbstractModel<span class="token punctuation">)</span><span class="token punctuation">:</span>
    _inherit <span class="token operator">=</span> <span class="token string">&#39;ir.http&#39;</span>

    <span class="token keyword">def</span> <span class="token function">session_info</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
        res <span class="token operator">=</span> <span class="token builtin">super</span><span class="token punctuation">(</span>Http<span class="token punctuation">,</span> self<span class="token punctuation">)</span><span class="token punctuation">.</span>session_info<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">if</span> self<span class="token punctuation">.</span>env<span class="token punctuation">.</span>user<span class="token punctuation">.</span>_is_internal<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
            res<span class="token punctuation">[</span><span class="token string">&#39;odoobot_initialized&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> self<span class="token punctuation">.</span>env<span class="token punctuation">.</span>user<span class="token punctuation">.</span>odoobot_state <span class="token keyword">not</span> <span class="token keyword">in</span> <span class="token punctuation">[</span><span class="token boolean">False</span><span class="token punctuation">,</span> <span class="token string">&#39;not_initialized&#39;</span><span class="token punctuation">]</span>
        <span class="token keyword">return</span> res
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="model" tabindex="-1"><a class="header-anchor" href="#model" aria-hidden="true">#</a> Model</h2><p>常规数据持久化 odoo 模型的主类; 每个类的实例都是一个有序的记录集合( RecordSet );</p><p>默认情况下, odoo 将会为每个数据模型实例化一次; 如果希望创建一个不被实例化的类, 可以把 <code>_register</code> 属性设置为 <code>False</code>;</p><p><code>Model</code> 的子类在实例化的过程中都会自动创建数据库表, 如果不希望自动创建数据表, 可以将类的 <code>_auto</code> 属性设置为 <code>False</code>;</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> odoo <span class="token keyword">import</span> models<span class="token punctuation">,</span> fields


<span class="token keyword">class</span> <span class="token class-name">ResPartner</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>Model<span class="token punctuation">)</span><span class="token punctuation">:</span>
    _inherit <span class="token operator">=</span> <span class="token string">&#39;res.partner&#39;</span>
    
    <span class="token comment"># 继承 res.partner 模型, 并添加一个 property_payment_method_id Many2one 类型的字段;</span>
    property_payment_method_id <span class="token operator">=</span> fields<span class="token punctuation">.</span>Many2one<span class="token punctuation">(</span>
        comodel_name<span class="token operator">=</span><span class="token string">&#39;account.payment.method&#39;</span><span class="token punctuation">,</span>
        string<span class="token operator">=</span><span class="token string">&#39;Payment Method&#39;</span><span class="token punctuation">,</span>
        company_dependent<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span>
        domain<span class="token operator">=</span><span class="token string">&quot;[(&#39;payment_type&#39;, &#39;=&#39;, &#39;outbound&#39;)]&quot;</span>
    <span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="transientmodel" tabindex="-1"><a class="header-anchor" href="#transientmodel" aria-hidden="true">#</a> TransientModel</h2><p>瞬态模型是指一种临时对象, 它的数据将被系统定期清理, 因此这就决定了它的使用场景不可以作为数据的持久化使用, 只能作为临时对象使用; 在 odoo 中, 瞬态模型最常被使用的一种场景是作为向导;</p><p>向导是 odoo 中常见的一种操作引导方式, 该方式通常由一个弹出式的窗体和字段、按钮组成; 用户通过向导可以选择指定特定的字段值, 然后进行下一步的操作.</p><p>向导背后的技术即用到了瞬态模型, 作为一种临时性的数据存储方案, 向导的数据不会长期留存在数据库中, 会由系统定期进行清理;</p><p><code>TransientModel</code> 具有简化的访问权限管理, 所有用户都可以创建新记录, 并且只能访问他们创建的记录; <code>TransientModel</code> 具有简化的访问权限管理, 所有用户都可以创建新记录, 并且只能访问他们创建的记录;</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> odoo <span class="token keyword">import</span> models<span class="token punctuation">,</span> fields


<span class="token keyword">class</span> <span class="token class-name">PortalWizardUser</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>TransientModel<span class="token punctuation">)</span><span class="token punctuation">:</span>

    _name <span class="token operator">=</span> <span class="token string">&#39;portal.wizard.user&#39;</span>
    _description <span class="token operator">=</span> <span class="token string">&#39;Portal User Config&#39;</span>
    
    <span class="token comment"># 下面这些字段不会记录在数据库中, 使用完成之后会定期清理掉</span>
    wizard_id <span class="token operator">=</span> fields<span class="token punctuation">.</span>Many2one<span class="token punctuation">(</span><span class="token string">&#39;portal.wizard&#39;</span><span class="token punctuation">,</span> string<span class="token operator">=</span><span class="token string">&#39;Wizard&#39;</span><span class="token punctuation">,</span> required<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> ondelete<span class="token operator">=</span><span class="token string">&#39;cascade&#39;</span><span class="token punctuation">)</span>
    partner_id <span class="token operator">=</span> fields<span class="token punctuation">.</span>Many2one<span class="token punctuation">(</span><span class="token string">&#39;res.partner&#39;</span><span class="token punctuation">,</span> string<span class="token operator">=</span><span class="token string">&#39;Contact&#39;</span><span class="token punctuation">,</span> required<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> readonly<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> ondelete<span class="token operator">=</span><span class="token string">&#39;cascade&#39;</span><span class="token punctuation">)</span>
    email <span class="token operator">=</span> fields<span class="token punctuation">.</span>Char<span class="token punctuation">(</span><span class="token string">&#39;Email&#39;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>瞬态模型有几个差异的属性:</p><ul><li><strong><code>_transient_max_count</code></strong>: 默认为 0; 瞬态记录的最大数量, 如果为 0 则不受限制;</li><li><strong><code>_transient_max_hours</code></strong>: 默认为 1.0; 最大空闲时间;</li><li><strong><code>_transient_vacuum()</code></strong>: 清理瞬态模型的记录;</li></ul>`,15);function m(v,g){const e=t("ExternalLinkIcon");return p(),c("div",null,[d,s("p",null,[r,n(" 是元("),s("a",u,[n("MetaModel"),l(e)]),n(")模型的子类; 元模型的主要用途就是检查模块是否已经注册, 没有注册的话则注册模块;")]),k])}const h=o(i,[["render",m],["__file","模型.html.vue"]]);export{h as default};
