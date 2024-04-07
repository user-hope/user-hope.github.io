import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o as c,c as i,a as n,b as s,d as l,e}from"./app-9b0cd270.js";const a="/images/odoo/S14/add_language.png",r="/images/odoo/S14/zh_cn_language.png",u="/images/odoo/S14/preferences.png",d="/images/odoo/S14/language_actives.png",k="/images/odoo/S14/export_translation.png",v="/images/odoo/S14/import_language.png",m="/images/odoo/S14/language_config.png",g="/images/odoo/S14/field_translation.png",b="/images/odoo/S14/field_translation_tag.png",h="/images/odoo/S14/field_translation_dialog.png",_="/images/odoo/S14/field_translation_description.png",y="/images/odoo/S14/website_url_code.png",f={},q=e('<h2 id="国际化" tabindex="-1"><a class="header-anchor" href="#国际化" aria-hidden="true">#</a> 国际化</h2><p>Odoo 支持多语言并允许不同的用户按自己的习惯选用不同的语言. 这通过 Odoo 内置的 i18n 功能实现. 通过字符串翻译, Odoo 还支持日期的数字格式及时间格式化等;</p><p>Odoo 已预置了本地化语言, 也就是说它支持多语言和本地化设置, 如日期和数字格式;</p><p>初次安装时, 仅能使用默认语言英语, 要对用户开放其他语言和地点, 需要先安装这些语言, 下面我们就来学习一下如何设置用户首选项以及如何进行应用;</p><h2 id="安装语言及配置用户首选项" tabindex="-1"><a class="header-anchor" href="#安装语言及配置用户首选项" aria-hidden="true">#</a> 安装语言及配置用户首选项</h2><p>启用开发者模式并按照如下步骤在 Odoo 实例中安装新的语言:</p><p>打开 <code>Setting</code> --&gt; <code>Translations</code> --&gt; <code>Languages</code>:</p><p><img src="'+a+'" alt="add-language"></p><p>选择我们需要安装的语言, 点击 <code>ACTIVATE</code>, 这个时候会弹出来一个添加语言的提示框, 点击 <code>Add</code>;</p><p><img src="'+a+'" alt="confirm-add-language"></p><p>安装完成之后会提示是否需要切换到中文, 点击切换到中文; 这个时候我们的用户界面就会变成简体中文的;</p><p><img src="'+r+`" alt="zh-cn-language"></p><p>除了上面的在界面上安装, 我们还可以通过命令行的方式安装语言;</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code> python odoo<span class="token operator">-</span><span class="token builtin">bin</span> <span class="token operator">-</span>d odoo_16_test_20231127 <span class="token operator">-</span><span class="token operator">-</span>load<span class="token operator">-</span>language<span class="token operator">=</span>zh_CN
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>修改用户语言, 还可以通过右上角的用户下的首选项来设置语言;</p><p><img src="`+u+'" alt="Preferences"></p><h2 id="导出翻译" tabindex="-1"><a class="header-anchor" href="#导出翻译" aria-hidden="true">#</a> 导出翻译</h2><p>在语言可供用户选择之前, 必须先通过 <code>Add language</code> 选项进行过安装; 可用的语言列表在开发者模式下可通过 <code>设置</code> &gt; <code>翻译</code> &gt; <code>语言</code> 菜单项进行查看. 带有 <code>激活</code> 标记的语言是已安装的;</p><p><img src="'+d+'" alt="language-actives"></p><p>每个 <code>Odoo</code> 插件模块负责其自身的翻译资源, 位于 <code>i18n</code> 子目录中, 每种语言的数据应该放在 <code>.po</code> 文件中, 在我们的项目中, 简体中文的翻译文件是通过 <code>zh_CN.po</code> 数据文件进行加载的;</p>',20),w={href:"https://poedit.net/",target:"_blank",rel:"noopener noreferrer"},x=e('<p>在 odoo16 中, <code>i18n</code> 的子目录中还应该包含 <code>&lt;modelName&gt;.pot</code> 文件, 提供一个翻译的模板并包含所有的可翻译字符串, 然后访问模块的时候会根据当前设置的语言找到对应的 <code>&lt;lang&gt;.po</code> 文件;</p><blockquote><p>这与 odoo16 之前的版本非常的不一样, 在 odoo15 中, <code>.po</code> 文件的翻译内容会被保存在 <code>ir.translation</code> 数据表内, 通过 <code>设置</code> --&gt; <code>翻译</code> --&gt; <code>已翻译术语</code> 可以查看所有的翻译内容;</p></blockquote><p>已安装语言的翻译文件还会在新插件模块安装或已有插件模块升级时进行载入;</p><p>模块中的许多术语都是隐式可翻译的, 因此, 即使没有在 <code>i18n</code> 目录下面添加任何语种的 <code>.po</code> 文件, 也可以将导出模块的可翻译术语, 并且可能找到可以使用的内容;</p><p><strong>导出翻译</strong>是通过界面进行管理的, 方法是点击 <code>设置</code> --&gt; <code>翻译</code> --&gt; <code>导出翻译</code>:</p><p><img src="'+k+`" alt="export-translation"></p><p>这将生成一个名为 <code>&lt;modelName&gt;.pot</code> 文件, 它是一个基础的翻译文件模板, 通常情况下, 我们需要将它与 <code>&lt;lang&gt;.po</code> 同时放在 <code>i18n</code> 目录下面; <code>&lt;modelName&gt;.pot</code> 文件是一个 <code>po</code> 模板, 如果我们需要新增其他的语种, 应该要将 <code>.pot</code> 文件里面的内容复制出来, 并新增指定语种的 <code>.po</code> 文件;</p><p>然后为文件内容里面的 <code>msgstr</code> 手动添加翻译内容;</p><p>除了这种界面的操作方式外, 我们还可以使用 odoo 提供的脚手架进行导出翻译:</p><p><strong><code>python odoo-bin -c &lt;odoo_config&gt; -d &lt;database&gt; -u &lt;module_name&gt; --i18n-export=&lt;filepath&gt;</code></strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>python odoo-bin <span class="token parameter variable">-c</span> ./odoo.conf <span class="token parameter variable">-d</span> odoo_16_test_20231127 <span class="token parameter variable">-u</span> library_app <span class="token parameter variable">--modules</span><span class="token operator">=</span>library_app --i18n-export<span class="token operator">=</span>./translation/library_app.pot
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="隐式导出" tabindex="-1"><a class="header-anchor" href="#隐式导出" aria-hidden="true">#</a> 隐式导出</h3><p>odoo 将自动从 <code>data</code> 类型内容中导出可翻译字符串, 其中:</p><ul><li>在非 <code>Qweb</code> 视图中, 导出所有文本节点以及字符串、帮助、总和、确认和占位符属性的内容;</li><li><code>Qweb</code>模板中(服务端和客户端), 除了设置 <code>t-translation=&quot;off&quot;</code> 的快内的所有文本节点都会被导出, 标题, alt, 标签和占位符属性的内容也会被导出;</li><li>对于 <code>field</code> 字段, 除非模型标记为 <code>_translate = False</code>: <ul><li>它们的 <code>string</code> 和 <code>help</code> 属性被导出;</li><li>如果存在 <code>selection</code> 并且元素为 <code>tuple</code>, 也会被导出;</li><li>如果字段设置了 <code>translate = True</code>, 则所有记录的值也会被导出;</li></ul></li><li><code>_constraints</code> 和 <code>_sql_constraints</code> 的 <code>help</code> 或 <code>error</code> 信息会被导出;</li></ul><h3 id="显式导出" tabindex="-1"><a class="header-anchor" href="#显式导出" aria-hidden="true">#</a> 显式导出</h3><p>当涉及到 <code>python</code> 代码或者是 <code>javascript</code> 代码中需要翻译的情况时, odoo 无法自动导出可翻译的术语, 因此必须明确的标记它们以供导出; 这是通过在函数调用中包装字符串来完成的;</p><p><strong>Python中</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> odoo <span class="token keyword">import</span> api<span class="token punctuation">,</span> fields<span class="token punctuation">,</span> models<span class="token punctuation">,</span> tools<span class="token punctuation">,</span> _

<span class="token keyword">def</span> <span class="token function">write</span><span class="token punctuation">(</span>self<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
    <span class="token keyword">raise</span> ValidationError<span class="token punctuation">(</span>_<span class="token punctuation">(</span><span class="token string">&quot;A packaging already uses the barcode&quot;</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>javascript中</strong></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">var</span> core <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;web.core&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> _t <span class="token operator">=</span> core<span class="token punctuation">.</span>_t<span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">_setPopOver</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> $content <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">_getContent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>$content<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> options <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">content</span><span class="token operator">:</span> $content<span class="token punctuation">,</span>
        <span class="token literal-property property">html</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
        <span class="token literal-property property">placement</span><span class="token operator">:</span> <span class="token string">&#39;left&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">title</span><span class="token operator">:</span> <span class="token function">_t</span><span class="token punctuation">(</span><span class="token string">&#39;Availability&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token literal-property property">trigger</span><span class="token operator">:</span> <span class="token string">&#39;focus&#39;</span><span class="token punctuation">,</span>
        <span class="token literal-property property">delay</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token string-property property">&#39;show&#39;</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token string-property property">&#39;hide&#39;</span><span class="token operator">:</span> <span class="token number">100</span> <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>$el<span class="token punctuation">.</span><span class="token function">popover</span><span class="token punctuation">(</span>options<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>注意: 只能标记文字字符串以供导出, 而不能标记表达式或变量. 对于格式化字符串的情况, 这意味着必须标记格式字符串, 而不是格式化字符串;</p></blockquote><h3 id="翻译懒加载" tabindex="-1"><a class="header-anchor" href="#翻译懒加载" aria-hidden="true">#</a> 翻译懒加载</h3><p>懒加载翻译, 通常在渲染执行时候查找翻译内容, 可以用于在全局变量的类方法中声明可翻译属性;</p><p>懒加载翻译在 <code>python</code> 中的方法为: <code>_lt</code>:</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> odoo <span class="token keyword">import</span> _lt

TWITTER_EXCEPTION <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token number">304</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;There was no new data to return.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">400</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;The request was invalid or cannot be otherwise served. Requests without authentication are considered invalid and will yield this response.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">401</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;Authentication credentials were missing or incorrect. Maybe screen name tweets are protected.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">403</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;The request is understood, but it has been refused or access is not allowed. Please check your Twitter API Key and Secret.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">429</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;Request cannot be served due to the applications rate limit having been exhausted for the resource.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">500</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;Twitter seems broken. Please retry later. You may consider posting an issue on Twitter forums to get help.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">502</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;Twitter is down or being upgraded.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">503</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;The Twitter servers are up, but overloaded with requests. Try again later.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token number">504</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;The Twitter servers are up, but the request could not be serviced due to some failure within our stack. Try again later.&#39;</span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

<span class="token comment"># 更详细的代码请查看 \`addons\\website_twitter\\models\\res_config_settings.py\`;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在 <code>javascript</code> 中调用:</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> <span class="token punctuation">{</span> _lt <span class="token keyword">as</span> lazyTranslate <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">&quot;@web/core/l10n/translation&quot;</span><span class="token punctuation">;</span>
<span class="token keyword">const</span> <span class="token function-variable function">_lt</span> <span class="token operator">=</span> <span class="token parameter">str</span> <span class="token operator">=&gt;</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">stringify</span><span class="token punctuation">(</span><span class="token function">lazyTranslate</span><span class="token punctuation">(</span>str<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">const</span> emojiCategoriesData <span class="token operator">=</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span><span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">[
    {
        &quot;name&quot;: &quot;Smileys &amp; Emotion&quot;,
        &quot;displayName&quot;: &quot;</span><span class="token template-punctuation string">\`</span></span><span class="token operator">+</span> <span class="token function">_lt</span><span class="token punctuation">(</span><span class="token string">&quot;Smileys &amp; Emotion&quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">&quot;,
        &quot;title&quot;: &quot;🙂&quot;,
        &quot;sortId&quot;: 1
    },
    {
        &quot;name&quot;: &quot;People &amp; Body&quot;,
        &quot;displayName&quot;: &quot;</span><span class="token template-punctuation string">\`</span></span><span class="token operator">+</span> <span class="token function">_lt</span><span class="token punctuation">(</span><span class="token string">&quot;People &amp; Body&quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">&quot;,
        &quot;title&quot;: &quot;🤟&quot;,
        &quot;sortId&quot;: 2
    }]</span><span class="token template-punctuation string">\`</span></span>
<span class="token punctuation">)</span>

<span class="token comment">// 更详细的代码请查看 \`addons\\mail\\static\\src\\models_data\\emoji_data.js\`;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>默认情况下, 模块的翻译不会暴露给前端, 因此无法从 <code>javascript</code> 访问, 为了实现这一点, 模块名必须以 <code>website</code> 为前缀, (例如: <code>website_sale</code>, <code>website_event</code>), 或者是通过为 <code>ir.http</code> 模型实现 <code>_get_translation_frontend_modules_name()</code> 方法;</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token keyword">from</span> odoo <span class="token keyword">import</span> models

<span class="token keyword">class</span> <span class="token class-name">IrHttp</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>AbstractModel<span class="token punctuation">)</span><span class="token punctuation">:</span>
    _inherit <span class="token operator">=</span> <span class="token string">&#39;ir.http&#39;</span>

    <span class="token decorator annotation punctuation">@classmethod</span>
    <span class="token keyword">def</span> <span class="token function">_get_translation_frontend_modules_name</span><span class="token punctuation">(</span>cls<span class="token punctuation">)</span><span class="token punctuation">:</span>
        mods <span class="token operator">=</span> <span class="token builtin">super</span><span class="token punctuation">(</span>IrHttp<span class="token punctuation">,</span> cls<span class="token punctuation">)</span><span class="token punctuation">.</span>_get_translation_frontend_modules_name<span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span> mods <span class="token operator">+</span> <span class="token punctuation">[</span><span class="token string">&#39;portal_rating&#39;</span><span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="正确的使用方法" tabindex="-1"><a class="header-anchor" href="#正确的使用方法" aria-hidden="true">#</a> 正确的使用方法</h3><p><strong>变量</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># 错误的; 字符可能会有效输出, 但不会被翻译;</span>
_<span class="token punctuation">(</span><span class="token string">&quot;Scheduled meeting with %s&quot;</span> <span class="token operator">%</span> invitee<span class="token punctuation">.</span>name<span class="token punctuation">)</span>

<span class="token comment"># 正确的; 将变量设置为翻译要查找的内容;</span>
_<span class="token punctuation">(</span><span class="token string">&quot;Scheduled meeting with %s&quot;</span><span class="token punctuation">,</span> invitee<span class="token punctuation">.</span>name<span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>代码块</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># 错误的;</span>
_<span class="token punctuation">(</span><span class="token string">&quot;You have &quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token builtin">len</span><span class="token punctuation">(</span>invoices<span class="token punctuation">)</span> <span class="token operator">+</span> _<span class="token punctuation">(</span><span class="token string">&quot; invoices waiting&quot;</span><span class="token punctuation">)</span>
_t<span class="token punctuation">(</span><span class="token string">&quot;You have &quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> invoices<span class="token punctuation">.</span>length <span class="token operator">+</span> _t<span class="token punctuation">(</span><span class="token string">&quot; invoices waiting&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment"># 正确的;</span>
_<span class="token punctuation">(</span><span class="token string">&quot;You have %s invoices wainting&quot;</span><span class="token punctuation">)</span> <span class="token operator">%</span> <span class="token builtin">len</span><span class="token punctuation">(</span>invoices<span class="token punctuation">)</span>
_<span class="token punctuation">.</span><span class="token builtin">str</span><span class="token punctuation">.</span>sprintf<span class="token punctuation">(</span>_t<span class="token punctuation">(</span><span class="token string">&quot;You have %s invoices wainting&quot;</span><span class="token punctuation">)</span><span class="token punctuation">,</span> invoices<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># 错误的; </span>
_<span class="token punctuation">(</span><span class="token string">&quot;Reference of the document that generated &quot;</span><span class="token punctuation">)</span> <span class="token operator">+</span> \\
_<span class="token punctuation">(</span><span class="token string">&quot;this sales order request.&quot;</span><span class="token punctuation">)</span>

<span class="token comment"># 正确的;</span>
_<span class="token punctuation">(</span><span class="token string">&quot;Reference of the document that generated &quot;</span> <span class="token operator">+</span> \\
  <span class="token string">&quot;this sales order request.&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>数值</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># 错误的;</span>
msg <span class="token operator">=</span> _<span class="token punctuation">(</span><span class="token string">&quot;You have %(count)s invoice&quot;</span><span class="token punctuation">,</span> count<span class="token operator">=</span>invoice_count<span class="token punctuation">)</span>
<span class="token keyword">if</span> invoice_count <span class="token operator">&gt;</span> <span class="token number">1</span><span class="token punctuation">:</span>
    msg <span class="token operator">+=</span> _<span class="token punctuation">(</span><span class="token string">&quot;s&quot;</span><span class="token punctuation">)</span>
    
<span class="token comment"># 正确的;</span>
<span class="token keyword">if</span> invoice_count <span class="token operator">&gt;</span> <span class="token number">1</span><span class="token punctuation">:</span>
    msg <span class="token operator">=</span> _<span class="token punctuation">(</span><span class="token string">&quot;You have %(count)s invoices&quot;</span><span class="token punctuation">,</span> count<span class="token operator">=</span>invoice_count<span class="token punctuation">)</span>
<span class="token keyword">else</span><span class="token punctuation">:</span>
    msg <span class="token operator">=</span> _<span class="token punctuation">(</span><span class="token string">&quot;You have one invoice&quot;</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>读取 vs 运行时</strong></p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code><span class="token comment"># 错误的, 服务在启动时就会去查找翻译;</span>
ERROR_MESSAGE <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string">&#39;access_error&#39;</span><span class="token punctuation">:</span> _<span class="token punctuation">(</span><span class="token string">&#39;Access Error&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token string">&#39;missing_error&#39;</span><span class="token punctuation">:</span> _<span class="token punctuation">(</span><span class="token string">&#39;Missing Record&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Record</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>Model<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">_raise_error</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> code<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">raise</span> UserError<span class="token punctuation">(</span>ERROR_MESSAGE<span class="token punctuation">[</span>code<span class="token punctuation">]</span><span class="token punctuation">)</span>
        

<span class="token comment"># 正确的, 使用懒加载的方式</span>
ERROR_MESSAGE <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token string">&#39;access_error&#39;</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;Access Error&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token string">&#39;missing_error&#39;</span><span class="token punctuation">:</span> _lt<span class="token punctuation">(</span><span class="token string">&#39;Missing Record&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>

<span class="token keyword">class</span> <span class="token class-name">Record</span><span class="token punctuation">(</span>models<span class="token punctuation">.</span>Model<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">def</span> <span class="token function">_raise_error</span><span class="token punctuation">(</span>self<span class="token punctuation">,</span> code<span class="token punctuation">)</span><span class="token punctuation">:</span>
        <span class="token keyword">raise</span> UserError<span class="token punctuation">(</span>ERROR_MESSAGE<span class="token punctuation">[</span>code<span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 错误的, 读取 js 文件的时候就会去查找翻译</span>
<span class="token keyword">var</span> core <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;web.core&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> _t <span class="token operator">=</span> core<span class="token punctuation">.</span>_t<span class="token punctuation">;</span>
<span class="token keyword">var</span> map_title <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">access_error</span><span class="token operator">:</span> <span class="token function">_t</span><span class="token punctuation">(</span><span class="token string">&#39;Access Error&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">missing_error</span><span class="token operator">:</span> <span class="token function">_t</span><span class="token punctuation">(</span><span class="token string">&#39;Missing Record&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>


<span class="token comment">// 正确的</span>
<span class="token keyword">var</span> core <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&#39;web.core&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> _lt <span class="token operator">=</span> core<span class="token punctuation">.</span>_lt<span class="token punctuation">;</span>
<span class="token keyword">var</span> map_title <span class="token operator">=</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">access_error</span><span class="token operator">:</span> <span class="token function">_lt</span><span class="token punctuation">(</span><span class="token string">&#39;Access Error&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
    <span class="token literal-property property">missing_error</span><span class="token operator">:</span> <span class="token function">_lt</span><span class="token punctuation">(</span><span class="token string">&#39;Missing Record&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="导入翻译" tabindex="-1"><a class="header-anchor" href="#导入翻译" aria-hidden="true">#</a> 导入翻译</h2><p>在开发过程中, 通常我们只需要将导出的文本手动翻译好之后放在模块的 <code>i18n</code> 目录, 然后启动的时候升级模块, 就会将翻译内容写入; 不过, 也有一些场景, 需要用到导入功能, 例如: 修改一个比较小的文案的时候, 如果用升级的方式就不太合适, 因为升级往往需要重启服务, 这在某些时候是比较糟糕的;</p><p>这个时候就可以用到导入功能了;</p><p>上面说到了导出功能会导出一个 <code>.pot</code> 翻译模板, 现在我们需要导入一个 <code>zh_CN.po</code> 的中文翻译, 所以需要新建 <code>zh_CN.po</code> 文件, 然后将 <code>.pot</code> 内生成的文件复制到 <code>zh_CN.po</code> 中, 手动修改翻译内容后:</p><p>打开导入功能: <code>设置</code> --&gt; <code>翻译</code> --&gt; <code>导入翻译</code>:</p><p><img src="`+v+`" alt="import-language"></p><p>网页客户端功能中要求填写语言名, 但它并没有在导入过程中使用到; 还有一个重写选项. 如果勾选, 会强制导入所有的翻译字符串, 即便这些字符串已经存在, 在这个过程中会进行覆盖;</p><p>除了使用网站界面的方式导入文件以外, 还可以使用 odoo 提供的脚手架来进行导入:</p><p><strong><code>python odoo-bin -c &lt;odoo_config&gt; -d &lt;database&gt; --i18n-import=&lt;filepath&gt; --language=&lt;code&gt; [--i18n-overwrite]</code></strong></p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>python odoo-bin <span class="token parameter variable">-c</span> ./odoo.config <span class="token parameter variable">-d</span> odoo_16_test_20231127 --i18n-import<span class="token operator">=</span>./translation/zh_CN.po <span class="token parameter variable">--language</span><span class="token operator">=</span>zh_CN --i18n-overwrite
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="配置语言和相关设置" tabindex="-1"><a class="header-anchor" href="#配置语言和相关设置" aria-hidden="true">#</a> 配置语言和相关设置</h2><p>语言和一些首选项, 也提供本地化设置, 如日期和数字格式等; 它们都有相应的默认值, 只要用户使用正确的语言, 本地化设置就应该是正确的;</p><p>但是你可能会想要修改语言的设置. 比如, 你可能会偏向于在用户界面中使用默认的英语, 但又希望修改美式英语的默认日期和数字格式匹配自己的要求; 这个时候就需要进行配置了;</p><p>点击 <code>设置</code> --&gt; <code>翻译</code> --&gt; <code>语言</code>:</p><p><img src="`+m+`" alt="language-config"></p><p>在登录并创建新的 Odoo 用户会话时, 用户首选项中勾选了用户语言并在 <code>lang</code> 上下文键中进行了设置. 然后使用它来格式化对应的输出 – 源文本翻译为用户语言, 日期和数字以语言的当前本地化设置进行格式化;</p><p>因此, 当我们的代码运行模型的 ORM 查询的时候, 也会使用用户设置的 <code>lang</code> 为首选项进行查询; 例如: 当前用户设置的首选语言是 <code>zh_CN</code>, 那么:</p><div class="language-python line-numbers-mode" data-ext="py"><pre class="language-python"><code>records <span class="token operator">=</span> self<span class="token punctuation">.</span>search<span class="token punctuation">(</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>默认查询的内容就是 <code>zh_CN</code> 的, 相当于是 <code>self.with_context(lang=&#39;zh_CN&#39;).search([])</code>;</p><p>当然, 我们可以通过改变 <code>context</code>, 来改变当前这一次的查询结果, 例如改成 <code>en_US</code>: <code>self.with_context(lang=&#39;en_US&#39;).search([])</code></p><h2 id="通过网页客户端在用户界面翻译文本" tabindex="-1"><a class="header-anchor" href="#通过网页客户端在用户界面翻译文本" aria-hidden="true">#</a> 通过网页客户端在用户界面翻译文本</h2><p>进行翻译最简单的方式就是使用网页客户端提供的翻译功能, 这里我们用第一章节里面创建的 <code>library_app</code> 模块为例, 使用网页来为字段添加翻译:</p><p>首先进入到我们的 <code>Library</code> 模块, 然后在开发者模式下, 点击 <code>虫子小图标</code> --&gt; <code>查看字段</code>:</p><p><img src="`+g+'" alt="field-translation"></p><p>在表单视图中可以看到 <code>ZH</code> 的标识, 表示当前字段是可以被翻译的, 点击 <code>ZH</code>:</p><p><img src="'+b+'" alt="field-translation-tag"></p><p>这里我们将 <code>publisher_id</code> 字段的中文翻译修改为 <code>发布者</code>:</p><p><img src="'+h+'" alt="field-translation-dialog"></p><p>保存之后再回去看列表, 字段名称就变成中文了;</p><p>模型的字段存储在 <code>ir.model.fields</code> 的这个表里面, 在 odoo16 中, <code>field_description</code> 字段存储字段的翻译内容, 上面我们是对 <code>library.book</code> 模型的字段添加了中文翻译, 它将翻译值写入 <code>field_description</code> 字段中;</p><p><img src="'+_+'" alt="field-translation-description"></p><p>这个时候如果我们再执行导出翻译的话, 也可以看到我们翻译好的内容会出现在 <code>.po</code> 文件中;</p><h2 id="对网站修改自定义的-url-语言代码" tabindex="-1"><a class="header-anchor" href="#对网站修改自定义的-url-语言代码" aria-hidden="true">#</a> 对网站修改自定义的 URL 语言代码</h2><p>Odoo对网站应用也支持多语言, 在网站中, 当前语言标记为语言字符串;</p><p>通过 <code>设置</code> --&gt; <code>翻译</code> --&gt; <code>语言</code> 菜单, 打开语言列表, 点击一个已安装的语言, 会打开以下表单:</p><p><img src="'+y+'" alt="website-url-code"></p><p>例如: 我们将 &quot;简体中文&quot; 的 URL 代码设置为 <code>cn</code>, 将 &quot;英文&quot; 的 URL 代码设置为 <code>en</code>; 设置完成之后, odoo 就会通过 URL 路径来识别网站的语言;</p><p>例如: http://localhost:8091/cn/ 将会访问到我们的中文网站, 而 http://localhost:8091/en/ 会访问到我们的英文网站;</p>',78);function S(E,R){const t=p("ExternalLinkIcon");return c(),i("div",null,[q,n("blockquote",null,[n("p",null,[s("在这里可以推荐一个 po 文件的工具, 用来维护和管理 po 文件; "),n("a",w,[s("poedit"),l(t)])])]),x])}const j=o(f,[["render",S],["__file","国际化.html.vue"]]);export{j as default};
