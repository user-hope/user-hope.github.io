---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/JavaScript模块.md
next:
  link: /pages/web-server/odoo/section-03/Registries.md
---

## OWL

odoo 的 JavaScript 框架使用名为 OWL 的自定义组件框架, 它是一个声明式的组件系统, 受 Vue 和 React 框架的启发, OWL 也是数据驱动, 响应式系统; 组件是使用 QWeb 模板定义的, 并添加了一些 OWL 特定的指令; 具体文档请参考 [Owl](https://github.com/odoo/owl/blob/master/doc/readme.md)

> 尽管在 web 模块中可以找到 owl 的源代码, 但是它是从单独的 github 仓库维护的, 因此, 应通过 [owl](https://github.com/odoo/owl) 获取最新的修改;

## 使用 OWL 组件

下面来看一下如何定义一个 owl 组件;

```js
const { Component } = owl;
const { useState } = owl.hooks;
const { xml } = owl.tags;

class MyComponent extends Component {
    
    static template = xml`
        <div t-on-click="increment">
            <t t-esc="state.value">
        </div>
    `;
    
    setup() {
        this.state = useState({ value: 1 });
    }

    increment() {
        this.state.value++;
    }
}
```
上面的示例中, 我们从全局 `owl` 对象中引入 `Component`, 可以像大多数的库一样使用; 然后使用 `xml` 帮助函数将 xml 模板定义在 js 代码中;  这对少量的 xml 代码是比较友好的, 如果代码量比较多, 字符串的 xml 就很难维护了, 因此, odoo 支持将 xml 文件定义在 QWeb 模板中, 以便可以翻译它们;

实际上, 大多数组件应定义在同一个目录的 2-3 个文件: (`component.js`, `component.xml`, `component.scss`); 然后将这些文件添加到  `assets` 的 `bundle` 中, web 框架负责加载这些文件;

例如:

```js
const { Component } = owl;
const { useState } = owl.hooks;
const { xml } = owl.tags;

class MyComponent extends Component {
    
    static template = 'myaddon.MyComponent';
  
}
```
```xml
<?xml version="1.0" encoding="UTF-8" ?>
<templates xml:space="preserve">
    
    <t t-name="myaddon.MyComponent" owl="1">
        <div t-on-click="increment">
            <t t-esc="state.value"/>
        </div>
    </t>

</templates>
```
odoo 的前端框架还尚未完全使用 owl 来编写, 因此需要一种方法来区分 owl 模板还是普通的  QWeb 模板, 为了是向后兼容; 所以新模板都需要 `owl="1"` 来标记当前模板作用域 owl;


## 最佳实践

首先, 组件是 class 类, 因此它们有一个构造函数, 但是 `constructor` 构造函数是 JavaScript 中特殊的方法, 不能以任何方式重写; 因此, 在 odoo 使用的是 `setup` 钩子来模拟 `constructor`:

```js
// 正确的写法
class MyComponent extends Component {
    setup() {
        // init
    }
}

// 错误的写法
class IncorrectComponent extends Component {
    constructor(parent, props) {
        // init
    }
}
```

## 内置组件

odoo 的 web 客户端是使用的 owl 组件构建的, 为了简化起见, odoo JavaScript 框架提供了一套组件, 可以在某些常见情况下重复使用, 下面是 odoo 中内置的一些组件:

### ActionSwiper

源代码: `addons/web/static/src/core/action_swiper/action_swiper.js`, 引入方式: `@web/core/action_swiper/action_swiper`;

这是一个滑动操作组件, 当用户滑动到某一个阈值的时候就会出现操作按钮;

```xml
<?xml version="1.0" encoding="UTF-8"?>
<templates xml:space="preserve">

    <t t-name="web.CalendarRenderer" owl="1">
        <div class="o_calendar_renderer">
            <ActionSwiper t-props="actionSwiperProps">
                <t
                    t-component="calendarComponent"
                    t-props="props"
                    t-key="calendarKey"
                />
            </ActionSwiper>
        </div>
    </t>

</templates>
```

使用该组件的最简单方法是直接在 xml 模板中使用它; 此外还可以有条件的添加属性来管理元素何时可以滑动, 以及动画执行, 或者是操作所需的最小距离;

```xml
<ActionSwiper
    onRightSwipe = " hasRightSwipe() ? {
        action: onRightSwipe.bind(this),
        icon: 'fa-delete',
        bgColor: 'bg-danger',
    } : undefined"
    onLeftSwipe = " hasLeftSwipe() ? {
        action: onLeftSwipe.bind(this),
    } : undefined"
    animationOnMove="false"
    animationType="'forwards'"
    swipeDistanceRatio="6">
    <div>
        Swiper item
    </div>
</ActionSwiper>
```
其中可选的 props 有以下属性:
- **`animationOnMove`**: Boolean, 滑动时候是否添加动画效果;
- **`animationType`**: String, 滑动的时候动画类型 ( `bounce`, `forwards` );
- **`onLeftSwipe`**: Object, 如果设置了, 开启左滑动效果;
- **`onRightSwipe`**: Object, 如果设置了, 开启右滑动效果;
- **`swipeDistanceRatio`**: Number, 最小滑动间距的设备比;

其中, `onLeftSwipe`, `onRightSwipe` 可以传入 Object, 支持的键有:
- **`action`**: 给定方向的滑动完成之后执行的回调函数;
- **`icon`**: icon;
- **`bgColor`**: 背景颜色; 遵循 bootstrap 的颜色预设; (`danger`, `info`, `secondary`, `success` or `warning`);

示例: 扩展现有的组件功能; 例如: 在邮件列表中, 将邮件标记为已读:

```xml
<field type="xml">
    <xpath expr="//*[hasclass('o_Message')]" position="after">
        <ActionSwiper
                onRightSwipe="messaging.device.isMobile and messageView.message.isNeedaction ?
        {
            action: () => messageView.message.markAsRead(),
            icon: 'fa-check-circle',
            bgColor: 'bg-success',
        } : undefined"
        />
    </xpath>
    <xpath expr="//ActionSwiper" position="inside">
        <xpath expr="//*[hasclass('o_Message')]" position="move"/>
    </xpath>
</field>
```

### CheckBox

源代码: `addons/web/static/src/core/checkbox/checkbox.js`, 引入方式: `@web/core/checkbox/checkbox`;

这是一个简单的复选框组件, 带有标签, 当标签点击的时候, 将切换复选框的状态;

```xml
<CheckBox value="boolean" disabled="boolean" t-on-change="onValueChange">
    Some Text
</CheckBox>
```
odoo 中的 bool 字段就是使用它来包装的;

### ColorList

源代码: `addons/web/static/src/core/colorlist/colorlist.js`, 引入方式: `@web/core/colorlist/colorlist`;

可以从预定义的列表中选择颜色, 默认情况下, 该组件显示当前选定的颜色, 并且如果没有设置 `canToggle` props, 该组件是不允许扩展的;

可选属性:
- **`canToggle`**: Boolean, 是否允许操作, 切换颜色;
- **`colors`**: Array, 要显示在列表中的颜色, 每一种颜色都有独立的 id; 
- **`forceExpanded`**: Boolean, 如果设置为 true, 则默认展开选项; 
- **`isExpanded`**: Boolean, 如果设置为 true, 则默认展开状态;
- **`onColorSelected`**: function, 颜色选择点击的回调函数;
- **`selectedColor`**: number, 选中的颜色的 id;

id 的规则为:

| id | color         |
|----|---------------|
| 0  | `No color`    |
| 1  | `Red`         |
| 2  | `Orange`      |
| 3  | `Yellow`      |
| 4  | `Light blue`  |
| 5  | `Dark purple` |
| 6  | `Salmon pink` |
| 7  | `Medium blue` |
| 8  | `Dark blue`   |
| 9  | `Fuchsia`     |
| 12 | `Green`       |
| 11 | `Purple`      |


### Dropdown

源代码: `addons/web/static/src/core/dropdown/dropdown.js`, 引入方式: `@web/core/dropdown/dropdown` and  `@web/core/dropdown/dropdown_item`

下拉菜单是非常的复杂的, 它要提供许多的功能, 例如:
- 切换选项;
- 当一个下拉菜单打开的时候, 在悬停状态切换其他的 item;
- 点击空白的地方可以关闭;
- 选择 item 之后关闭下拉菜单;
- 点击 item 的时候执行回调函数;
- 支持多层级嵌套下拉;
- 自由设计下拉内容;
- 可配置热键, 用于关闭/打开下拉列表;
- 每当页面滚动或调整大小时, 都会重新定位自身;
- 自动识别它应该在哪个方向打开;

为了一劳永逸的解决这些问题, odoo 框架为每个下拉元素提供了两个组件: `Dropdown`, `DropdownItem`;

```xml
<Dropdown t-if="printItems.length" class="'d-inline-block'" togglerClass="'btn btn-light'" hotkey="'shift+u'">
    <t t-set-slot="toggler">
        <i class="me-md-1 fa fa-print"/>
        <span class="o_dropdown_title">Print</span>
    </t>
    <t t-foreach="printItems" t-as="item" t-key="item.key">
        <DropdownItem class="'o_menu_item'" onSelected="() => this.onItemSelected(item)">
            <t t-esc="item.description"/>
        </DropdownItem>
    </t>
</Dropdown>
```

`<Dropdown />` 组件只是一个简单的 `<div class="dropdown" />` 和一个 `<button class="dropdown-toggle"/>` 的按钮组成, 由按钮控制下拉菜单是否展示; 

`Dropdown` 组件可选参数有:
- **`startOpen`**: boolean, 下拉菜单的初始化打开状态, 默认为 false;
- **`menuClass`**: string, 应用与 dropdown 元素的其他的 css 类名;
- **`togglerClass`**: string, 应用与 dropdown button 元素的其他的 css 类名;
- **`hotkey`**: string, 键盘呼出菜单的热键;
- **`tooltip`**: string, 显示在下拉菜单中的提示文本;
- **`beforeOpen`**: function, 在打开菜单之前调用的钩子函数, 可以是异步函数;
- **`manualOnly`**: boolean, 如果设置为 true, 仅在单击按钮时候切换下拉列表;
- **`title`**: string, button 按钮的标题属性, 默认为 none;
- **`position`**: string, 菜单的打开位置, 有效的 usePosition 钩子; 默认为 `bottom-start`;
- **`toggler`**: `parent` or `undefined`, 当设置为 `parent` 的时候, `<button class="dropdown-toggle"/>` 不显示; 切换功能由父节点处理; 默认值 `undefined`;

当选择 `<DropdownItem />` 的时候, 它会调用 `DropdownItem` 提供的 `onSelected` 方法; 

`DropdownItem` 组件可选参数:
- **`onSelected`**: function, 节点被选中的时候调用的回调函数;
- **`parentClosingMode`**: `none` | `closest` | `all`, 选择后, 将控制关闭的父级下拉列表; 默认值为 `all`;
- **`hotkey`**: string, 选择下拉项的热键;
- **`href`**: string, 如果设置这个属性, DropdownItem 将渲染为 `<a href="value" class="dropdown-item"/>` 而不是 `<span class="dropdown-item"/>`;
- **`title`**: string, 可选的 title 属性, 该属性将传递给 DropdownItem 的根节点;
- **`dataset`**: Object, 包含应添加到根元素数据集的值的可选对象. 这可以使用它来更容易以编程方式找到该元素;

#### 说明文档

`<Dropdown />` 组件渲染后的 dom 结构如下:

```xml
<div class="dropdown">
    <button class="dropdown-toggle">Click me !</button>
    <!-- 下面的元素是否出现在 dom 中取决于按钮的控制状态 -->
    <div class="dropdown-menu">
        <span class="dropdown-item">Menu Item 1</span>
        <span class="dropdown-item">Menu Item 2</span>
    </div>
</div>
```
要正确的使用 `<Dropdown/>` 组件, 需要传入两个 [slot](https://github.com/odoo/owl/blob/master/doc/reference/slots.md)
- **`toggler`**: 它包含下拉列表的 `Toggler` 元素, 并在下拉按钮内呈现;
- **`default`**: 它包含下拉菜单本身的元素, 并在 `<div class="dropdown-menu"/>` 中呈现. 尽管这不是强制性的, 但菜单槽内通常至少有一个 `DropdownItem`;

当多个下拉列表在 DOM 中共享相同的父元素时, 它们将被视为组的一部分, 并将相互通知其状态更改. 这意味着当其中一个下拉列表打开时, 其他下拉列表将在鼠标悬停时自动打开, 而无需单击;

#### 示例: 同级下拉菜单

当单击一个下拉列表的时候, 其他的下拉菜单在悬停时自动打开:

```xml
<div>
    <Dropdown>
        <t t-set-slot="toggler">File</t>
        <DropdownItem onSelected="() => this.onItemSelected('file-open')">Open</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('file-new-document')">New Document</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('file-new-spreadsheet')">New Spreadsheet</DropdownItem>
    </Dropdown>
    <Dropdown>
        <t t-set-slot="toggler">Edit</t>
        <DropdownItem onSelected="() => this.onItemSelected('edit-undo')">Undo</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('edit-redo')">Redo</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('edit-find')">Search</DropdownItem>
    </Dropdown>
    <Dropdown>
        <t t-set-slot="toggler">About</t>
        <DropdownItem onSelected="() => this.onItemSelected('about-help')">Help</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('about-update')">Check update</DropdownItem>
    </Dropdown>
</div>
```
#### 示例: 多级下拉菜单

使用 `t-call` 制作 "文件" 下拉菜单, 并且将 "新建" 和 "保存" 作为子菜单展示;

```xml
<template>
    <t t-name="addon.Dropdown.File" owl="1">
        <Dropdown>
            <t t-set-slot="toggler">File</t>
            <DropdownItem onSelected="() => this.onItemSelected('file-open')">Open</DropdownItem>
            <t t-call="addon.Dropdown.File.New"/>
            <DropdownItem onSelected="() => this.onItemSelected('file-save')">Save</DropdownItem>
            <t t-call="addon.Dropdown.File.Save.As"/>
        </Dropdown>
    </t>

    <t t-name="addon.Dropdown.File.New" owl="1">
        <Dropdown>
            <t t-set-slot="toggler">New</t>
            <DropdownItem onSelected="() => this.onItemSelected('file-new-document')">Document</DropdownItem>
            <DropdownItem onSelected="() => this.onItemSelected('file-new-spreadsheet')">Spreadsheet</DropdownItem>
        </Dropdown>
    </t>

    <t t-name="addon.Dropdown.File.Save.As" owl="1">
        <Dropdown>
            <t t-set-slot="toggler">Save as...</t>
            <DropdownItem onSelected="() => this.onItemSelected('file-save-as-csv')">CSV</DropdownItem>
            <DropdownItem onSelected="() => this.onItemSelected('file-save-as-pdf')">PDF</DropdownItem>
        </Dropdown>
    </t>
</template>
```
#### 多级下拉列表嵌套

```xml
<Dropdown>
    <t t-set-slot="toggler">File</t>
    <DropdownItem onSelected="() => this.onItemSelected('file-open')">Open</DropdownItem>
    <Dropdown>
        <t t-set-slot="toggler">New</t>
        <DropdownItem onSelected="() => this.onItemSelected('file-new-document')">Document</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('file-new-spreadsheet')">Spreadsheet</DropdownItem>
    </Dropdown>
    <DropdownItem onSelected="() => this.onItemSelected('file-save')">Save</DropdownItem>
    <Dropdown>
        <t t-set-slot="toggler">Save as...</t>
        <DropdownItem onSelected="() => this.onItemSelected('file-save-as-csv')">CSV</DropdownItem>
        <DropdownItem onSelected="() => this.onItemSelected('file-save-as-pdf')">PDF</DropdownItem>
    </Dropdown>
</Dropdown>
```

#### 示例: 递归多级下拉列表

递归调用模板以显示树状结构;

```xml
<template>
    <t t-name="addon.MainTemplate" owl="1">
        <div>
            <t t-call="addon.RecursiveDropdown">
                <t t-set="name" t-value="'Main Menu'" />
                <t t-set="items" t-value="state.menuItems" />
            </t>
        </div>
    </t>

    <t t-name="addon.RecursiveDropdown" owl="1">
        <Dropdown>
            <t t-set-slot="toggler">
                <t t-esc="name"/>
            </t>
            <t t-foreach="items" t-as="item" t-key="item.id">
                <!-- 如果没有子菜单, 将渲染为 <DropdownItem/> -->
                <t t-if="!item.childrenTree.length">
                    <DropdownItem onSelected="() => this.onItemSelected(item)" t-esc="item.name"/>
                </t>
                <!-- 否则递归调用自己 -->
                <t t-else="" t-call="addon.RecursiveDropdown">
                    <t t-set="name" t-value="item.name" />
                    <t t-set="items" t-value="item.childrenTree" />
                </t>
            </t>
        </Dropdown>
    </t>
</template>
```

### Notebook

源代码: `addons/web/static/src/core/notebook/notebook.js`, 引入方式: `@web/core/notebook/notebook`;

`Notebook` 组件用于在选项卡式的界面中显示多个页面, 选项卡可以位于元素的顶部以水平显示, 也可以位于左侧, 以垂直布局; 

有两种方法可以定义要实例化的 `Notebook` 页面, 一种是使用 `slot`, 另一种是传递专用的 `props`

`Notebook` 接收以下参数:
- **`anchors`**: object, 可选, 允许锚点导航到选项卡内不可见的元素;
- **`className`**: string, 可选, 设置根节点的 class name;
- **`defaultPage`**: string, 可选, page 页面的 id, 如果设置了, 就默认展示指定的 page 页面;
- **`orientation`**: string, 可选, 组件在页面上的展示方式, `horizontal` or `vertical`;
- **`onPageUpdate`**: function, 可选, page 页面切换的时候执行的回调函数;
- **`pages`**: array, 可选, 包含要从模板填充的页面列表;

第一种方式是使用 slot:

```xml
<Notebook orientation="'vertical'">
    <t t-set-slot="page_1" title="'Page 1'" isVisible="true">
        <h1>My First Page</h1>
        <p>It's time to build Owl components. Did you read the documentation?</p>
    </t>
    <t t-set-slot="page_2" title="'2nd page'" isVisible="true">
        <p>Wise owl's silent flight. Through the moonlit forest deep, guides my path to code</p>
    </t>
</Notebook>
```
第二种方式是通过 props 传递:

```js
import { Notebook } from "@web/core/notebook/notebook";

class MyTemplateComponent extends owl.Component {
    static template = owl.tags.xml`
        <h1 t-esc="props.title" />
        <p t-esc="props.text" />
    `;
}

class MyComponent extends owl.Component {
    
    static template = owl.tags.xml`
        <Notebook defaultPage="'page_2'" pages="pages" />
    `;
    
    get pages() {
        return [
            {
                Component: MyTemplateComponent,
                title: "Page 1",
                props: {
                    title: "My First Page",
                    text: "This page is not visible",
                },
            },
            {
                Component: MyTemplateComponent,
                id: "page_2",
                title: "Page 2",
                props: {
                    title: "My second page",
                    text: "You're at the right place!",
                },
            },
        ]
    }
}
```

### Pager

源代码: `addons/web/static/src/core/pager/pager.js`, 引入方式: `@web/core/pager/pager`;

`Pager` 是处理分页的一个小组件, 页面由 `offset` 和 `limit` 限制数据量大小; `Pager` 组件可以在任何地方使用, 但其主要作用是控制面板中; 

```xml
<Pager offset="0" limit="80" total="50" onUpdate="doSomething" />
```

`Pager` 组件接收以下 props:
- **`offset`**: number, 数据里面的第一条的索引, 它以 0 开头, pager 展示的时候会 `offset + 1`;
- **`limit`**: number, 页面大小, 偏移量和限制的总和对应于页面最后一个元素的索引;
- **`total`**: number, 页面可以访问的元素总数;
- **`onUpdate`**: function, 当 pager 的分页改变的时候执行的回调函数;
- **`isEditable`**: boolean, 允许单击当前页面进行编辑, 默认为 true;
- **`withAccessKey`**: boolean, 在默认情况下, 将访问键 `p` 绑定到上一页按钮, 将访问键 `n` 绑定到下一页按钮;







