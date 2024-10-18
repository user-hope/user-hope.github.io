import{_ as i}from"./plugin-vue_export-helper-DlAUqK2U.js";import{c as t,a,o as n}from"./app-Dj3d3b-P.js";const l={};function h(e,s){return n(),t("div",null,s[0]||(s[0]=[a(`<h2 id="xpath" tabindex="-1"><a class="header-anchor" href="#xpath"><span>Xpath</span></a></h2><p><code>XPath</code> 的选择功能十分强大, 它提供了非常简洁明了的路径选择表达式, 另外它还提供了超过 100 个内建函数用于字符串、数值、时间的匹配以及节点、序列的处理等等, 几乎所有我们想要定位的节点都可以用 <code>XPath</code> 来选择;</p><h2 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h2><p>XPath 使用路径表达式来选取 XML 文档中的节点或节点集. 节点是通过沿着路径 (path) 或者步 (steps) 来选取的; 在 odoo 中, xpath 是一个特殊的标签, 接收以下两个参数:</p><ul><li><strong><code>expr</code></strong>: 完整的 xpath 表达式</li><li><strong><code>position</code></strong>: 对节点的操作方式, 可选: <ul><li><strong><code>inside</code></strong>: 在 expr 匹配的元素内部进行创建(默认添加到最后一个元素);</li><li><strong><code>replace</code></strong>: 替换 expr 匹配到的内容;</li><li><strong><code>before</code></strong>: 在 expr 匹配的元素前面添加;</li><li><strong><code>after</code></strong>: 在 expr 匹配的元素后添加内容;</li><li><strong><code>attributes</code></strong>: 使用 attribute 标签对 expr 匹配的元素属性进行修改;</li></ul></li></ul><h2 id="表达式" tabindex="-1"><a class="header-anchor" href="#表达式"><span>表达式</span></a></h2><p>下面是 expr 常用的路径表达式:</p><table><thead><tr><th>表达式</th><th>描述</th><th style="text-align:left;">举例</th></tr></thead><tbody><tr><td>nodeName</td><td>选取此节点的所有子节点</td><td style="text-align:left;"><code>div</code></td></tr><tr><td>/</td><td>从根节点选取(取子节点)</td><td style="text-align:left;"><code>/div</code></td></tr><tr><td>//</td><td>从匹配选择的当前节点选择文档中的节点, 不考虑它们的位置(取子孙节点)</td><td style="text-align:left;"><code>//div</code></td></tr><tr><td>.</td><td>选取当前节点</td><td style="text-align:left;"><code>. </code></td></tr><tr><td>..</td><td>选取当前节点的父节点</td><td style="text-align:left;"><code>.. </code></td></tr><tr><td>@</td><td>选取属性</td><td style="text-align:left;"><code>div[@class=&#39;app&#39;]</code></td></tr></tbody></table><h2 id="谓语" tabindex="-1"><a class="header-anchor" href="#谓语"><span>谓语</span></a></h2><p>谓语用来查找某个特定的节点或者包含某个指定的值的节点, 谓语被嵌在方括号中;</p><table><thead><tr><th>路径表达式</th><th>结果</th></tr></thead><tbody><tr><td><code>/html/head/meta[2]</code></td><td>选取 html 下的子元素的 head 下的子元素的第一个 meta 元素</td></tr><tr><td><code>/html//div[2]</code></td><td>选取 html 下的子元素的第二个 div 元素</td></tr><tr><td><code>/html/head/meta[last()]</code></td><td>选取 html 下的子元素的 head 下的子元素的最后一个 meta 元素</td></tr><tr><td><code>/html/head/meta[last() - 1]</code></td><td>选取 html 下的子元素的 head 下的子元素的倒数第二个 meta 元素</td></tr><tr><td><code>/html/head/meta[position() &lt; 3]</code></td><td>选取 html 下的子元素的 head 下的子元素的最前面的两个 meta 元素</td></tr><tr><td><code>//title[@lang]</code></td><td>选取所有拥有名为 lang 的属性的 title 元素</td></tr><tr><td><code>//title[@lang=&#39;eng&#39;]</code></td><td>选取所有 title 元素, 且这些元素拥有值为 eng 的 lang 属性</td></tr><tr><td><code>//div[hasclass(&#39;settings&#39;)]</code></td><td>选取所有的拥有 class=&quot;settings&quot; 的 div 元素</td></tr><tr><td><code>//div[contains(@t-attf-class, &#39;oe_kanban_card&#39;)]</code></td><td>模糊选取 div 上拥有 t-attf-class 包含 &#39;oe_kanban_card&#39; 字符的元素</td></tr></tbody></table><h2 id="选取未知节点" tabindex="-1"><a class="header-anchor" href="#选取未知节点"><span>选取未知节点</span></a></h2><p>XPath 通配符可用来选取未知的 XML 元素</p><table><thead><tr><th>通配符</th><th>描述</th><th>示例</th></tr></thead><tbody><tr><td>*</td><td>匹配任何元素节点</td><td><code>//div/*</code></td></tr><tr><td>@*</td><td>匹配任何属性节点</td><td><code>//title[@*]</code></td></tr><tr><td>node()</td><td>匹配任何类型的节点</td><td><code>//html/node()</code></td></tr></tbody></table><h2 id="逻辑表达式" tabindex="-1"><a class="header-anchor" href="#逻辑表达式"><span>逻辑表达式</span></a></h2><p>当一个元素无法定位到唯一值的时候, 我们可以使用逻辑表达式来进行定位</p><table><thead><tr><th>运算符</th><th>描述</th><th>示例</th><th>返回值</th></tr></thead><tbody><tr><td>|</td><td>选取多个节点集合</td><td><code>//svg | //span</code></td><td>找到所有的 svg 和 span 元素</td></tr><tr><td>and</td><td>根据条件选取元素</td><td><code>//span[@class=&#39;n-ellipsis&#39; and @style]</code></td><td>找到所有的 class 为 n-ellipsis 并且拥有 style 属性的 span 元素</td></tr><tr><td>or</td><td>or 和 and 很像, 满足任一条件即匹配成功</td><td><code>//span[@class=&#39;n-ellipsis&#39; or @style]</code></td><td>找到所有的 class 为 n-ellipsis 或者是拥有 style 属性的 span 元素</td></tr><tr><td>=</td><td>根据值查找</td><td><code>//input[@type=&#39;textarea&#39;]</code></td><td>找到所有 input type=&quot;textarea&quot; 的元素</td></tr><tr><td>!=</td><td>同 = 取反</td><td><code>//input[@type!=&#39;textarea&#39;]</code></td><td>找到所有 input type!=&quot;textarea&quot; 的元素</td></tr><tr><td>&lt;</td><td>查找元素的值小于某个范围(值)</td><td><code>//table//td//span[text() &gt; &#39;3617&#39;]</code></td><td>找到 table 下的 td 下的 span 元素的文本 &gt; &#39;3617&#39; 的元素</td></tr><tr><td>&gt;</td><td>查找元素的值大于某个范围(值)</td><td><code>//table//td//span[text() &lt; &#39;3617&#39;]</code></td><td>找到 table 下的 td 下的 span 元素的文本 &lt; &#39;3617&#39; 的元素</td></tr><tr><td>&lt;=</td><td>查找元素的值小于或等于某个范围(值)</td><td><code>//table//td//span[text() &lt;= &#39;3617&#39;]</code></td><td>找到 table 下的 td 下的 span 元素的文本 &lt;= &#39;3617&#39; 的元素</td></tr><tr><td>&gt;=</td><td>查找元素的值大于或等于某个范围(值)</td><td><code>//table//td//span[text() &gt;= &#39;3617&#39;]</code></td><td>找到 table 下的 td 下的 span 元素的文本 &gt;= &#39;3617&#39; 的元素</td></tr><tr><td>not</td><td>找到不满足not条件的</td><td><code>//div[not(@id=&#39;app&#39;)]</code></td><td>找到 div id 不为 app 的元素</td></tr></tbody></table><h2 id="轴方式定位" tabindex="-1"><a class="header-anchor" href="#轴方式定位"><span>轴方式定位</span></a></h2><p>轴可定义相对于当前节点的节点集查找;</p><table><thead><tr><th>标识</th><th>描述</th><th>示例</th></tr></thead><tbody><tr><td>ancestor</td><td>选取当前节点的所有先辈 (父、祖父等)</td><td><code>//div[@id=&quot;app&quot;]/ancestor::*</code></td></tr><tr><td>ancestor-or-self</td><td>选取当前节点的所有先辈 (父、祖父等) 以及当前节点本身</td><td><code>//div[@id=&quot;app&quot;]/ancestor-or-self::*</code></td></tr><tr><td>attribute</td><td>选取当前节点的所有属性</td><td><code>//div[@id=&quot;app&quot;]/attribute::*</code></td></tr><tr><td>child</td><td>选取当前节点的所有子元素(不包含孙节点)</td><td><code>//div[@id=&quot;app&quot;]/child::* </code></td></tr><tr><td>descendant</td><td>选取当前节点的所有子元素(包含子, 孙节点)</td><td><code>//div[@id=&quot;app&quot;]/descendant::*</code></td></tr><tr><td>descendant-or-self</td><td>选取当前节点的所有子元素(包含子, 孙节点) 以及当前节点本身</td><td><code>//div[@id=&quot;app&quot;]/descendant-or-self::*</code></td></tr><tr><td>following</td><td>选取文档中当前节点的结束标签之后的所有节点</td><td><code>//div[@id=&quot;app&quot;]/following::*</code></td></tr><tr><td>following-sibling</td><td>选取当前节点之后的所有兄弟节点</td><td><code>//div[@id=&quot;app&quot;]/following-sibling::*</code></td></tr><tr><td>namespace</td><td>选取当前节点的所有命名空间节点</td><td><code>//div[@id=&quot;app&quot;]/namespace::*</code></td></tr><tr><td>parent</td><td>选取当前节点的父节点</td><td><code>//div[@id=&quot;app&quot;]/parent::*</code></td></tr><tr><td>preceding</td><td>选取文档中当前节点的开始标签之前的所有节点</td><td><code>//div[@id=&quot;app&quot;]/preceding::*</code></td></tr><tr><td>preceding-sibling</td><td>选取当前节点之前的所有同级节点</td><td><code>//div[@id=&quot;app&quot;]/preceding-sibling::*</code></td></tr><tr><td>self</td><td>选取当前节点</td><td><code>//div[@id=&quot;app&quot;]/self::*</code></td></tr></tbody></table><h2 id="示例" tabindex="-1"><a class="header-anchor" href="#示例"><span>示例</span></a></h2><div class="language-typescript line-numbers-mode" data-highlighter="shiki" data-ext="typescript" data-title="typescript" style="--shiki-light:#383A42;--shiki-dark:#abb2bf;--shiki-light-bg:#FAFAFA;--shiki-dark-bg:#282c34;"><pre class="shiki shiki-themes one-light one-dark-pro vp-code"><code><span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">export</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> interface</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Options</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    color</span><span style="--shiki-light:#0184BC;--shiki-dark:#C678DD;">?</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#E5C07B;"> string</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">    defaultColor</span><span style="--shiki-light:#0184BC;--shiki-dark:#C678DD;">?</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#E5C07B;"> string</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">class</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Highlight</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> readonly</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> options</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Options</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      color</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;#2d8cf0&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">      defaultColor</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;#333639&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">,</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    };</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    private</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> readonly</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> el</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> HTMLElement</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">    constructor</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">el</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> HTMLElement</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">opts</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> Options</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> {}) {</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> el</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">options</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> Object</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">assign</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">({}, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">options</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">opts</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">        this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">initStyle</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    initStyle</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> styleEl</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">createElement</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;style&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> cssRule</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> \`</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            .highlight-el {</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                background-color: #afd9db !important;</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">                border-radius: 10px !important; </span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">            }</span></span>
<span class="line"><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">        \`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">        styleEl</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">appendChild</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">createTextNode</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">cssRule</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">));</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">        document</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">head</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">appendChild</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">styleEl</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    contains</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-light-font-style:inherit;--shiki-dark:#E06C75;--shiki-dark-font-style:italic;">str</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#0184BC;--shiki-dark:#E5C07B;"> string</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        if</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">str</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">replace</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;">/</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">\\s</span><span style="--shiki-light:#0184BC;--shiki-dark:#D19A66;">+</span><span style="--shiki-light:#0184BC;--shiki-dark:#E06C75;">/</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">g</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">==</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> &#39;&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">return</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">        /**</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">         * 忽略大小写</span></span>
<span class="line"><span style="--shiki-light:#A0A1A7;--shiki-light-font-style:italic;--shiki-dark:#7F848E;--shiki-dark-font-style:italic;">         */</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> Xpath</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> \`descendant::text()[contains(translate(., &#39;ABCDEFGHIJKLMNOPQRSTUVWXYZ&#39;, &#39;abcdefghijklmnopqrstuvwxyz&#39;), &quot;</span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">\${</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">str</span><span style="--shiki-light:#CA1243;--shiki-dark:#C678DD;">}</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&quot;)]\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> evaluator</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> XPathEvaluator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> evaluator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">evaluate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">Xpath</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">XPathResult</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">ORDERED_NODE_SNAPSHOT_TYPE</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        for</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">let</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> i</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> &lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">snapshotLength</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">++</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> node</span><span style="--shiki-light:#0184BC;--shiki-dark:#ABB2BF;">:</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> HTMLElement</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">snapshotItem</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">as</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> HTMLElement</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">            node</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">parentElement</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">?.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">classList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">add</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;highlight-el&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">    reset</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">() {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> Xpath</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;"> \`descendant-or-self::*[contains(@class, &#39;highlight-el&#39;)]\`</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> evaluator</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;"> new</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;"> XPathEvaluator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">();</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> evaluator</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">evaluate</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">Xpath</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">this</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">el</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;">null</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">, </span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">XPathResult</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#986801;--shiki-dark:#E06C75;">ORDERED_NODE_SNAPSHOT_TYPE</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">        for</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;"> (</span><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">let</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;"> i</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#986801;--shiki-dark:#D19A66;"> 0</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> &lt;</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E06C75;">snapshotLength</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">; </span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;">++</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) {</span></span>
<span class="line"><span style="--shiki-light:#A626A4;--shiki-dark:#C678DD;">            const</span><span style="--shiki-light:#986801;--shiki-dark:#E5C07B;"> node</span><span style="--shiki-light:#0184BC;--shiki-dark:#56B6C2;"> =</span><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;"> result</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">snapshotItem</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#383A42;--shiki-dark:#E06C75;">i</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">) </span><span style="--shiki-light:#383A42;--shiki-dark:#C678DD;">as</span><span style="--shiki-light:#C18401;--shiki-dark:#E5C07B;"> HTMLElement</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">;</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#E5C07B;">            node</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#E45649;--shiki-dark:#E5C07B;">classList</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">.</span><span style="--shiki-light:#4078F2;--shiki-dark:#61AFEF;">remove</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">(</span><span style="--shiki-light:#50A14F;--shiki-dark:#98C379;">&#39;highlight-el&#39;</span><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">);</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">        }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">    }</span></span>
<span class="line"><span style="--shiki-light:#383A42;--shiki-dark:#ABB2BF;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,22)]))}const p=i(l,[["render",h],["__file","Xpath.html.vue"]]),r=JSON.parse('{"path":"/pages/web-server/odoo/section-02/Xpath.html","title":"","lang":"zh-CN","frontmatter":{"headerDepth":4,"prev":{"link":"/pages/web-server/odoo/section-02/Qweb.md"},"next":{"link":"/pages/web-server/odoo/section-02/菜单.md"},"description":"Xpath XPath 的选择功能十分强大, 它提供了非常简洁明了的路径选择表达式, 另外它还提供了超过 100 个内建函数用于字符串、数值、时间的匹配以及节点、序列的处理等等, 几乎所有我们想要定位的节点都可以用 XPath 来选择; 语法 XPath 使用路径表达式来选取 XML 文档中的节点或节点集. 节点是通过沿着路径 (path) 或者步 (...","gitInclude":[],"head":[["meta",{"property":"og:url","content":"https://github.com/user-hope/user-hope.github.io/pages/web-server/odoo/section-02/Xpath.html"}],["meta",{"property":"og:site_name","content":"Blog"}],["meta",{"property":"og:description","content":"Xpath XPath 的选择功能十分强大, 它提供了非常简洁明了的路径选择表达式, 另外它还提供了超过 100 个内建函数用于字符串、数值、时间的匹配以及节点、序列的处理等等, 几乎所有我们想要定位的节点都可以用 XPath 来选择; 语法 XPath 使用路径表达式来选取 XML 文档中的节点或节点集. 节点是通过沿着路径 (path) 或者步 (..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"\\",\\"image\\":[\\"\\"],\\"dateModified\\":null,\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Hope\\",\\"url\\":\\"https://github.com/user-hope/user-hope.github.io\\"}]}"]]},"headers":[{"level":2,"title":"Xpath","slug":"xpath","link":"#xpath","children":[]},{"level":2,"title":"语法","slug":"语法","link":"#语法","children":[]},{"level":2,"title":"表达式","slug":"表达式","link":"#表达式","children":[]},{"level":2,"title":"谓语","slug":"谓语","link":"#谓语","children":[]},{"level":2,"title":"选取未知节点","slug":"选取未知节点","link":"#选取未知节点","children":[]},{"level":2,"title":"逻辑表达式","slug":"逻辑表达式","link":"#逻辑表达式","children":[]},{"level":2,"title":"轴方式定位","slug":"轴方式定位","link":"#轴方式定位","children":[]},{"level":2,"title":"示例","slug":"示例","link":"#示例","children":[]}],"readingTime":{"minutes":4.98,"words":1494},"filePathRelative":"pages/web-server/odoo/section-02/Xpath.md","autoDesc":true,"excerpt":"<h2>Xpath</h2>\\n<p><code>XPath</code> 的选择功能十分强大, 它提供了非常简洁明了的路径选择表达式, 另外它还提供了超过 100 个内建函数用于字符串、数值、时间的匹配以及节点、序列的处理等等, 几乎所有我们想要定位的节点都可以用 <code>XPath</code> 来选择;</p>\\n<h2>语法</h2>\\n<p>XPath 使用路径表达式来选取 XML 文档中的节点或节点集. 节点是通过沿着路径 (path) 或者步 (steps) 来选取的; 在 odoo 中, xpath 是一个特殊的标签, 接收以下两个参数:</p>\\n<ul>\\n<li><strong><code>expr</code></strong>: 完整的 xpath 表达式</li>\\n<li><strong><code>position</code></strong>: 对节点的操作方式, 可选:\\n<ul>\\n<li><strong><code>inside</code></strong>:  在 expr 匹配的元素内部进行创建(默认添加到最后一个元素);</li>\\n<li><strong><code>replace</code></strong>: 替换 expr 匹配到的内容;</li>\\n<li><strong><code>before</code></strong>: 在 expr 匹配的元素前面添加;</li>\\n<li><strong><code>after</code></strong>: 在 expr 匹配的元素后添加内容;</li>\\n<li><strong><code>attributes</code></strong>: 使用 attribute 标签对 expr 匹配的元素属性进行修改;</li>\\n</ul>\\n</li>\\n</ul>"}');export{p as comp,r as data};
