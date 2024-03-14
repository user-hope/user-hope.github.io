---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-02/Qweb.md
next:
  link: /pages/web-server/odoo/section-02/菜单.md
---

## Xpath

`XPath` 的选择功能十分强大, 它提供了非常简洁明了的路径选择表达式, 另外它还提供了超过 100 个内建函数用于字符串、数值、时间的匹配以及节点、序列的处理等等, 几乎所有我们想要定位的节点都可以用 `XPath` 来选择;


## 语法

XPath 使用路径表达式来选取 XML 文档中的节点或节点集. 节点是通过沿着路径 (path) 或者步 (steps) 来选取的; 在 odoo 中, xpath 是一个特殊的标签, 接收以下两个参数:

- **`expr`**: 完整的 xpath 表达式
- **`position`**: 对节点的操作方式, 可选:
    - **`inside`**:  在 expr 匹配的元素内部进行创建(默认添加到最后一个元素);
    - **`replace`**: 替换 expr 匹配到的内容;
    - **`before`**: 在 expr 匹配的元素前面添加;
    - **`after`**: 在 expr 匹配的元素后添加内容;
    - **`attributes`**: 使用 attribute 标签对 expr 匹配的元素属性进行修改;

## 表达式

下面是 expr 常用的路径表达式:

| 表达式      | 描述                                  | 举例                |
|----------|-------------------------------------|:------------------|
| nodeName | 选取此节点的所有子节点                         | `div`               |
| /        | 从根节点选取(取子节点)                        | `/div`              |
| //       | 从匹配选择的当前节点选择文档中的节点, 不考虑它们的位置(取子孙节点) | `//div`             |
| .        | 选取当前节点                              | `. `                |
| ..       | 选取当前节点的父节点                          | `.. `               |
| @        | 选取属性                                | `div[@class='app']` |

## 谓语

谓语用来查找某个特定的节点或者包含某个指定的值的节点, 谓语被嵌在方括号中;

| 路径表达式                                            | 结果                                                    |
|--------------------------------------------------|-------------------------------------------------------|
| `/html/head/meta[2]`                               | 选取 html 下的子元素的 head 下的子元素的第一个 meta 元素                 |
| `/html//div[2]`                                    | 选取 html 下的子元素的第二个 div 元素                              |
| `/html/head/meta[last()]`                          | 选取 html 下的子元素的 head 下的子元素的最后一个 meta 元素                |
| `/html/head/meta[last() - 1]`                      | 选取 html 下的子元素的 head 下的子元素的倒数第二个 meta 元素               |
| `/html/head/meta[position() < 3]`                  | 选取 html 下的子元素的 head 下的子元素的最前面的两个 meta 元素              |
| `//title[@lang]`                                   | 选取所有拥有名为 lang 的属性的 title 元素                           |
| `//title[@lang='eng']`                             | 选取所有 title 元素, 且这些元素拥有值为 eng 的 lang 属性                |
| `//div[hasclass('settings')]`                      | 选取所有的拥有 class="settings" 的 div 元素                     |
| `//div[contains(@t-attf-class, 'oe_kanban_card')]` | 模糊选取 div 上拥有   t-attf-class 包含 'oe_kanban_card' 字符的元素 |

## 选取未知节点

XPath 通配符可用来选取未知的 XML 元素

| 通配符    | 描述        | 示例            |
|--------|-----------|---------------|
| *      | 匹配任何元素节点  | `//div/*`       |
| @*     | 匹配任何属性节点  | `//title[@*]`   |
| node() | 匹配任何类型的节点 | `//html/node()` |

## 逻辑表达式

当一个元素无法定位到唯一值的时候, 我们可以使用逻辑表达式来进行定位

| 运算符 | 描述                       | 示例                                     | 返回值                                              |
|-----|--------------------------|----------------------------------------|--------------------------------------------------|
| \|  | 选取多个节点集合                 | `//svg \| //span`                        | 找到所有的 svg 和 span 元素                              |
| and | 根据条件选取元素                 | `//span[@class='n-ellipsis' and @style]` | 找到所有的 class 为 n-ellipsis 并且拥有 style 属性的 span 元素  |
| or  | or 和 and 很像, 满足任一条件即匹配成功 | `//span[@class='n-ellipsis' or @style]`  | 找到所有的 class 为 n-ellipsis 或者是拥有 style 属性的 span 元素 |
| =   | 根据值查找                    | `//input[@type='textarea']`              | 找到所有 input type="textarea" 的元素                   |
| !=  | 同 = 取反                   | `//input[@type!='textarea']`             | 找到所有 input type!="textarea" 的元素                  |
| <   | 查找元素的值小于某个范围(值)          | `//table//td//span[text() > '3617']`     | 找到 table 下的 td 下的 span 元素的文本 > '3617' 的元素        |
| >   | 查找元素的值大于某个范围(值)          | `//table//td//span[text() < '3617']`     | 找到 table 下的 td 下的 span 元素的文本 < '3617' 的元素        |
| <=  | 查找元素的值小于或等于某个范围(值)       | `//table//td//span[text() <= '3617']`    | 找到 table 下的 td 下的 span 元素的文本 <= '3617' 的元素       |
| >=  | 查找元素的值大于或等于某个范围(值)       | `//table//td//span[text() >= '3617']`    | 找到 table 下的 td 下的 span 元素的文本 >= '3617' 的元素       |
| not | 找到不满足not条件的              | `//div[not(@id='app')]`                  | 找到 div id 不为 app 的元素                             |


## 轴方式定位

轴可定义相对于当前节点的节点集查找;

| 标识                 | 描述                                | 示例                                       |
|--------------------|-----------------------------------|------------------------------------------|
| ancestor           | 选取当前节点的所有先辈 (父、祖父等)               | `//div[@id="app"]/ancestor::*`           |
| ancestor-or-self   | 选取当前节点的所有先辈 (父、祖父等) 以及当前节点本身      | `//div[@id="app"]/ancestor-or-self::*`   |
| attribute          | 选取当前节点的所有属性                       | `//div[@id="app"]/attribute::*`          |
| child              | 选取当前节点的所有子元素(不包含孙节点)              | `//div[@id="app"]/child::* `             |
| descendant         | 选取当前节点的所有子元素(包含子, 孙节点)            | `//div[@id="app"]/descendant::*`         |
| descendant-or-self | 选取当前节点的所有子元素(包含子, 孙节点)   以及当前节点本身 | `//div[@id="app"]/descendant-or-self::*` |
| following          | 选取文档中当前节点的结束标签之后的所有节点             | `//div[@id="app"]/following::*`          |
| following-sibling  | 选取当前节点之后的所有兄弟节点                   | `//div[@id="app"]/following-sibling::*`  |
| namespace          | 选取当前节点的所有命名空间节点                   | `//div[@id="app"]/namespace::*`          |
| parent             | 选取当前节点的父节点                        | `//div[@id="app"]/parent::*`             |
| preceding          | 选取文档中当前节点的开始标签之前的所有节点             | `//div[@id="app"]/preceding::*`          |
| preceding-sibling  | 选取当前节点之前的所有同级节点                   | `//div[@id="app"]/preceding-sibling::*`  |
| self               | 选取当前节点                            | `//div[@id="app"]/self::*`               |


## 示例

```typescript
export interface Options {
    color?: string;
    defaultColor?: string;
}

class Highlight {
    private readonly options: Options = {
      color: '#2d8cf0',
      defaultColor: '#333639',
    };
    private readonly el: HTMLElement;

    constructor(el: HTMLElement, opts: Options = {}) {
        this.el = el;
        this.options = Object.assign({}, this.options, opts);
        this.initStyle();
    }

    initStyle() {
        const styleEl = document.createElement('style');
        const cssRule = `
            .highlight-el {
                background-color: #afd9db !important;
                border-radius: 10px !important; 
            }
        `;
        styleEl.appendChild(document.createTextNode(cssRule));
        document.head.appendChild(styleEl);
    }

    contains(str: string) {
        if (str.replace(/\s+/g, '') == '') return;
        /**
         * 忽略大小写
         */
        const Xpath = `descendant::text()[contains(translate(., 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), "${str}")]`;
        const evaluator = new XPathEvaluator();
        const result = evaluator.evaluate(Xpath, this.el, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        for (let i = 0; i < result.snapshotLength; i++) {
            const node: HTMLElement = result.snapshotItem(i) as HTMLElement;
            node.parentElement?.classList.add('highlight-el');
        }
    }

    reset() {
        const Xpath = `descendant-or-self::*[contains(@class, 'highlight-el')]`;
        const evaluator = new XPathEvaluator();
        const result = evaluator.evaluate(Xpath, this.el, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
        for (let i = 0; i < result.snapshotLength; i++) {
            const node = result.snapshotItem(i) as HTMLElement;
            node.classList.remove('highlight-el');
        }
    }
}
```

