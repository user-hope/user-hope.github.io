import{_ as h}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as p,b as a,d as s,e as n,f as t,a as l,r as k,o as d}from"./app-Dj3d3b-P.js";const r="/images/odoo/S15/menu.png",o={};function g(u,i){const e=k("RouteLink");return d(),p("div",null,[i[14]||(i[14]=a("h2",{id:"菜单",tabindex:"-1"},[a("a",{class:"header-anchor",href:"#菜单"},[a("span",null,"菜单")])],-1)),a("p",null,[i[1]||(i[1]=s("菜单是 odoo 中最常见的组件之一了, 其基本的作用就是为前端和动作(action) 的纽带, 菜单的定义, 我们在前面已经接触过了, 在 ")),n(e,{to:"/pages/web-server/odoo/section-01/%E6%95%B0%E6%8D%AE%E6%96%87%E4%BB%B6.html#%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F"},{default:t(()=>i[0]||(i[0]=[s("数据文件")])),_:1}),i[2]||(i[2]=s(" 章节中, 也有简单的介绍, 下面我们来着重看一下菜单的本质是什么;"))]),i[15]||(i[15]=l(`<h2 id="菜单的本质" tabindex="-1"><a class="header-anchor" href="#菜单的本质"><span>菜单的本质</span></a></h2><p>前面有提到过, 菜单实际上也是一种数据文件, 属于 <code>ir.ui.menu</code> 模型, <code>&lt;menuitem /&gt;</code> 实际上是一个语法糖; 菜单的对象所拥有的常见属性有以下几个:</p><ul><li><strong><code>name</code></strong>: 菜单名称;</li><li><strong><code>complete_name</code></strong>: 完整的名称路径, 这个是由系统自动计算出来的;</li><li><strong><code>parent_id</code></strong>: 上级菜单的 id;</li><li><strong><code>action</code></strong>: 绑定的动作;</li><li><strong><code>web_icon</code></strong>: 菜单的图标;</li><li><strong><code>sequence</code></strong>: 优先级(值越小越靠前);</li><li><strong><code>web_icon_data</code></strong>: 上传的图标文件;</li><li><strong><code>child_id</code></strong>: 子菜单的 id 集合;</li><li><strong><code>group_ids</code></strong>: 权限组;</li></ul><p>我们在 xml 文件中常用的写法是:</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">menuitem</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> id</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mass_mailing_sms_menu_mass_sms&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">    name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;SMS Marketing&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">    action</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mailing_mailing_action_sms&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">    parent</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mass_mailing_sms_menu_root&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">    sequence</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;1&quot;</span></span>
<span class="line"><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">    groups</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mass_mailing.group_mass_mailing_user&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>实际上它就是 <code>&lt;record&gt;</code> 的简写, 完整的菜单可以写成如下的模式:</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">record</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> id</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mass_mailing_sms_menu_mass_sms&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> model</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;ir.ui.menu&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;name&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;SMS Marketing&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;sequence&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;1&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;action&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> ref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mailing_mailing_action_sms&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;parent&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> ref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;mass_mailing_sms_menu_root&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;groups&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> eval</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;[(6, 0, [ref(&#39;mass_mailing.group_mass_mailing_user&#39;)])]&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> /&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">record</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><blockquote><p>具体的菜单定义, 请查看源码 odoo/addons/base/models/ir_ui_menu.py;</p></blockquote>`,8)),a("p",null,[i[4]||(i[4]=s("xml 中提供的")),n(e,{to:"/pages/web-server/odoo/section-01/%E6%95%B0%E6%8D%AE%E6%96%87%E4%BB%B6.html#%E6%A0%B8%E5%BF%83%E6%93%8D%E4%BD%9C"},{default:t(()=>i[3]||(i[3]=[s("上下文")])),_:1}),i[5]||(i[5]=s("操作在菜单数据中也是可用的, 例如上面的 ")),i[6]||(i[6]=a("code",null,"action",-1)),i[7]||(i[7]=s(" 和 ")),i[8]||(i[8]=a("code",null,"groups",-1)),i[9]||(i[9]=s(" 分别使用了 ")),i[10]||(i[10]=a("code",null,"ref",-1)),i[11]||(i[11]=s(" 和 ")),i[12]||(i[12]=a("code",null,"eval",-1)),i[13]||(i[13]=s(" 函数;"))]),i[16]||(i[16]=l(`<h2 id="菜单的继承" tabindex="-1"><a class="header-anchor" href="#菜单的继承"><span>菜单的继承</span></a></h2><p>在 odoo 中, 可以通过继承的方式对模型和数据文件进行扩展, 菜单也属于数据的一种, 因此我们也可以通过 xml 来对菜单进行继承/重写; 比如, 我们希望对 odoo 原有的菜单进行修改或者是移动原有菜单所在的位置;</p><p>实际上, 菜单的继承和重写是非常简单, 只需要把 xml 中定义的 id 跟需要重写的菜单保持一致就可以, 也就是通过覆盖的方式, 把对应的属性修改成新的值;</p><p>例如，我们希望把采购- <code>采购</code> 菜单下面的产品菜单单独拿出来作为一个新的菜单 <code>基础数据</code> 的子菜单, 那么我们就可以这么写:</p><div class="language-xml line-numbers-mode" data-highlighter="shiki" data-ext="xml" data-title="xml" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">record</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> id</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;purchase.product_product_menu&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> model</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;ir.ui.menu&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;parent_id&quot;</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> ref</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;menu_purchase_main_data&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">/&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    &lt;</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> name</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">=</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;name&quot;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;Products&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">field</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&lt;/</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">record</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">&gt;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>menu_purchase_main_data</code> 是我自己新定义的一个菜单, 这样就完成了对原有菜单的父菜单的重写, 界面上的变化, 就是我们把 <code>产品</code> 菜单移走了;</p><p>系统中所有定义的菜单, 都可以在 设置 --&gt; 技术 --&gt; 菜单项目 中可以看到</p><figure><img src="`+r+'" alt="menu" tabindex="0" loading="lazy"><figcaption>menu</figcaption></figure><h2 id="特殊的菜单" tabindex="-1"><a class="header-anchor" href="#特殊的菜单"><span>特殊的菜单</span></a></h2><p>odoo 中有一类菜单, 是只有在开发者模式下才可以被看到, 这个菜单就是其他设置/技术特性(<code>base.group_no_one</code>); 如果仅将用户添加到这个组中, 指定了技术特性的菜单是无法在正常模式下被看到的, 只有将菜单绑定其他可见的用户组, 才可以被这个用户组在普通模式下可见;</p>',10))])}const A=h(o,[["render",g],["__file","菜单.html.vue"]]),c=JSON.parse('{"path":"/pages/web-server/odoo/section-02/%E8%8F%9C%E5%8D%95.html","title":"","lang":"zh-CN","frontmatter":{"headerDepth":4,"prev":{"link":"/pages/web-server/odoo/section-02/Xpath.md"},"next":{"link":"/pages/web-server/odoo/section-02/二进制字段与附件.md"},"description":"菜单 菜单是 odoo 中最常见的组件之一了, 其基本的作用就是为前端和动作(action) 的纽带, 菜单的定义, 我们在前面已经接触过了, 在 章节中, 也有简单的介绍, 下面我们来着重看一下菜单的本质是什么; 菜单的本质 前面有提到过, 菜单实际上也是一种数据文件, 属于 ir.ui.menu 模型, <menuitem /> 实际上是一个语法糖...","gitInclude":[],"head":[["meta",{"property":"og:url","content":"https://github.com/user-hope/user-hope.github.io/pages/web-server/odoo/section-02/%E8%8F%9C%E5%8D%95.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:description","content":"菜单 菜单是 odoo 中最常见的组件之一了, 其基本的作用就是为前端和动作(action) 的纽带, 菜单的定义, 我们在前面已经接触过了, 在 章节中, 也有简单的介绍, 下面我们来着重看一下菜单的本质是什么; 菜单的本质 前面有提到过, 菜单实际上也是一种数据文件, 属于 ir.ui.menu 模型, <menuitem /> 实际上是一个语法糖..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://github.com/user-hope/user-hope.github.io/images/odoo/S15/menu.png"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"https://github.com/user-hope/user-hope.github.io/images/odoo/S15/menu.png\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Hope\\",\\"url\\":\\"https://github.com/user-hope/user-hope.github.io\\"}]}"]]},"headers":[{"level":2,"title":"菜单","slug":"菜单","link":"#菜单","children":[]},{"level":2,"title":"菜单的本质","slug":"菜单的本质","link":"#菜单的本质","children":[]},{"level":2,"title":"菜单的继承","slug":"菜单的继承","link":"#菜单的继承","children":[]},{"level":2,"title":"特殊的菜单","slug":"特殊的菜单","link":"#特殊的菜单","children":[]}],"readingTime":{"minutes":2.73,"words":818},"filePathRelative":"pages/web-server/odoo/section-02/菜单.md","autoDesc":true,"excerpt":"<h2>菜单</h2>\\n<p>菜单是 odoo 中最常见的组件之一了, 其基本的作用就是为前端和动作(action) 的纽带, 菜单的定义, 我们在前面已经接触过了, 在 <a href=\\"/pages/web-server/odoo/section-01/%E6%95%B0%E6%8D%AE%E6%96%87%E4%BB%B6.html#%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F\\" target=\\"_blank\\">数据文件</a> 章节中, 也有简单的介绍, 下面我们来着重看一下菜单的本质是什么;</p>\\n<h2>菜单的本质</h2>\\n<p>前面有提到过, 菜单实际上也是一种数据文件, 属于 <code>ir.ui.menu</code> 模型, <code>&lt;menuitem /&gt;</code> 实际上是一个语法糖; 菜单的对象所拥有的常见属性有以下几个:</p>"}');export{A as comp,c as data};
