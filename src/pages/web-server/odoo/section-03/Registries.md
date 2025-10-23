---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/OWL Components.md
next:
  link: /pages/web-server/odoo/section-03/Services.md
---

## Registries

`registry` 是有序的键值对映射, 它们是主要的 web 客户端的扩展函数, odoo JavaScript 框架提供的许多功能只需要在某个对象的定义时查找 `registry`; 例如: `fields`, `views`, `client`, `action` 或是 `services`; 通过 `registry` 可以很轻松的对这些字段或者是视图进行扩展;

```js
import { Registry } from "@web/core/registry";

const myRegistry = new Registry();

myRegistry.add("hello", "odoo");

console.log(myRegistry.get("hello"));
```

`registry` 的一个很有用的功能是它维护一组通过类别方法获得子 `registry` 的方法, 如果不存在, 则会即时创建; web 客户端使用的所有的 `registry` 方法都可以从一个根方法里面获取; 

源代码: `addons/web/static/src/core/registry.js`, 引入方式: `@web/core/registry`;

```js
import { registry } from "@web/core/registry";

const fieldRegistry = registry.category("fields");
const serviceRegistry = registry.category("services");
const viewRegistry = registry.category("views");
```

## Registry API

创建一个新的 `registry`, 请注意 `registry` 是一个全局的 `event bus`, 因此如果有必要, 可以使用 `UPDATE` 事件来监听变化; `registry` 的排序是由 `getAll` 方法返回的根据 `sequence` 的编号排序的;

- **`Registry.add(key, value[, options])`**: 返回一个新的 `Registry`; 其中:
    - **`key`**: string, 标识;
    - **`value`**: any, 值;
    - **`options`**: object, 
        - **`force`**: boolean, 如果 key 存在的时候是否 throw error;
        - **`sequence`**: number, sequence 用来排序的值;

- **`Registry.get(key[, defaultValue])`**: 返回参数对应的值, 如果 `registry` 不包含该 `key`, 则此方法返回 `defaultValue`, 否则抛出错误;
    - **`key`**: string, 标识;
    - **`any`**: any, 如果 key 没有获取到的默认值;

- **`Registry.contains(key)`**: 返回值为 boolean, 表示 key 有没有在注册表里面注册过;
    - **`key`**: string, 标识;

- **`Registry.getAll()`**: 返回注册表中所有的元素的列表, 它是按照 `sequence` 排序的;

- **`Registry.remove(key)`**: 从注册表中删除 键/值 对, 此操作会触发 `UPDATE` 事件;

- **`Registry.category(subcategory)`**: 返回与之类比关联的子注册表, 如果尚不存在, 则会动态的创建子注册表;

## 子注册表参考列表

| 类别                | 说明                   |
|-------------------|----------------------|
| `effects`         | 实现所有可用的效果            |
| `formatters`      | 用于格式化值的实用函数(主要是字段值)  |
| `main_components` | 顶级组件                 |
| `parsers`         | 用于解析值的实用函数(主要是字段值)   |
| `services`        | 所有激活的 service 服务     |
| `systray`         | 显示在导航栏系统托盘区域中的组件     |
| `user_menuitems`  | 用户菜单中显示的菜单项 (导航栏右上角) |

### Effect registry

`effects registry` 包含所有的可用效果的实现, 更多详细信息请参考 [Effect Service](/pages/web-server/odoo/section-03/Services.html#effect-service)

`effects` 是可以临时显示在页面顶图的图形元素, 通常是为了向用户提供发生了有趣的事情的反馈, 例如: crm 里面的阶段变更为 "赢得" 的时候, 会出现一个有趣的彩虹动画;

![effect](/images/odoo/S22/effect.png)

下面我们来看一下这个动画效果的实现方式:

```js
const effectService = useService("effect");
effectService.add({
    type: "rainbow_man", // 可以省略, 默认类型就是 rainbow_man
    message: "Boom! Team record for the past 30 days.",
});
```
`rainbow_man` 是官方实现的一个效果, 也是目前唯一可用的 `effects`,  它的使用也是非常简单的, 只需要调用 `effectService.add({ type: "rainbow_man" });`, 它还允许以下参数来进行配置:

- **`Component`**: 类型是一个 owl 的  Component, 允许替换 `RainbowMan` 组件实例化的 owl 模板;
- **`props`**: 如果给定了 `Component` 参数, props 将作为参数传入 `Component`;
- **`message`**: string 类型, 如果用户禁用了 `effect`, 则不会显示中间的 svg 效果, 只会显示 message 字符;
- **`messageIsHtml`**: boolean, 如果设置为 true, 那么 message 将会被当作 html 插入到 dom 中;
- **`img_url`**: 图片的 url, 默认为 `/web/static/img/smile.svg`;
- **`fadeout`**: 展示 `effects` 的动画效果; 可选: `"slow"|"medium"|"fast"|"no"` , 默认 `medium`;

#### 定义一个 Effect

所有的 `effect` 都被存储在 `effects` 注册表中, 我们可以通过提供名称和函数来添加新的 `effect`;

```js
/** @odoo-module **/

import { registry } from "@web/core/registry";
const { Component, xml } = owl;

class SepiaEffect extends Component {
    static template = xml`
        <div style="
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            background: rgba(124,87,0, 0.4);
        "></div>
    `;
}

export function sepiaEffectProvider(env, params = {}) {
    return {
        Component: SepiaEffect,
    };
}

const effectRegistry = registry.category("effects");
effectRegistry.add("sepia", sepiaEffectProvider);
```
例如上面我们定义了一个名为 `sepia` 的 `effect`, 然后可以在任意地方调用它; 

```js
const effectService = useService("effect");
effectService.add({ type: "sepia" });
```

#### 在 python 函数里面调用

使用 `effect` 注册的 `effects` 不仅可以在 js 里面调用, 还可以在 python 的函数中调用: 例如在页面中有一个按钮如下:

```xml
<button name="button_show_effect" class="button_show_effect" type="object" string="Effect" />
```
点击按钮的时候调用 `sepia` 这个注册的效果:

```python
def button_show_effect(self):
    return {
        'effect': {
            'message': '这是测试用的 Effect',
            'type': 'sepia',
        }
    }
```
当我们点击按钮的时候, 页面就会出现定义好的 `sepia`:

![sepia](/images/odoo/S22/sepia.png)

官方提供的 `rainbow_man` 也可以通过这种方式调用:

```python
def button_show_effect(self):
    return {
        'effect': {
            'fadeout': 'slow',
            'message': '这是测试用的 Effect',
            'img_url': '/web/static/img/smile.svg',
            'type': 'rainbow_man',
        }
    }
```

### Main components registry

主组件注册表 (`main_components`) 可用于添加顶级组件, 在 web 客户端中有一个 `MainComponentsContainer` 组件作为其直接子项; 

Main components registry 的核心目标是:
- 集中管理核心UI组件: 将 odoo web 客户端中的所有重要的, 可复用的 UI 组件(如视图管理器, 动作管理器, 通知服务, 路由服务等) 都注册到同一个地方;
- 提供组件访问接口: 允许其他模块或组件通过一个统一的接口来获取和使用这些核心组件的实例;
- 支持依赖注入:  结合 Odoo 的服务机制, Main Components Registry 使得组件可以声明它们所依赖的其他核心组件, Odoo 框架会自动将这些依赖注入到组件中;
- 模块化和可扩展性: 进 Odoo Web 客户端的模块化设计, 使得开发者可以更容易地替换、扩展或添加新的核心组件;
- 生命周期管理: 框架可以更好地管理这些核心组件的生命周期;


Odoo 框架在启动时, 会将所有预定义的核心组件 (例如 action 服务、dialog 服务、notification 服务、router 服务、各种视图类型等) 注册到 Main Components Registry 中. 这些组件通常是 Odoo Web 客户端的 "服务" 或 "管理器"; 

当一个 Odoo 组件需要使用另一个核心组件的功能时, 就可以通过 `setup()` 方法里面使用 `useService()` 来获取其他的功能, 而不用耦合的使用 `import` 导入:

```js
import { Component, useState } from "@odoo/owl";
import { useService } from "@web/core/utils/hooks"; // 引入 useService hook

class MyCustomComponent extends Component {
    setup() {
        super.setup();
        this.notification = useService("notification"); // 声明依赖 notification 服务
        this.action = useService("action"); // 声明依赖 action 服务
        this.state = useState({ count: 0 });
    }

    onClick() {
        this.state.count++;
        this.notification.add(`Count is now: ${this.state.count}`, { type: 'info' });
        if (this.state.count > 5) {
            this.action.doAction({
                type: 'ir.actions.client',
                tag: 'my_custom_client_action',
            });
        }
    }
}
```

### Service registry

Service 服务类注册; 包含由 odoo 框架激活的所有服务; 声明方法:

```js
import { registry } from "@web/core/registry";

const myService = {
    dependencies: [...],
    start(env, deps) {
        // some code here
    }
};

registry.category("services").add("myService", myService);
```
在 odoo 内部自定了很多的 service, 可以方便我们做客户端的开发, 例如: orm 的定义;

```js
import { registry } from "@web/core/registry";
import { rpc } from "@web/core/network/rpc";
import { user } from "@web/core/user";

export const x2ManyCommands = {
    // (0, virtualID | false, { values })
    CREATE: 0,
    create(virtualID, values) {
        delete values.id;
        return [x2ManyCommands.CREATE, virtualID || false, values];
    },
    // (1, id, { values })
    UPDATE: 1,
    update(id, values) {
        delete values.id;
        return [x2ManyCommands.UPDATE, id, values];
    },
    // (2, id[, _])
    DELETE: 2,
    delete(id) {
        return [x2ManyCommands.DELETE, id, false];
    },
    // (3, id[, _]) removes relation, but not linked record itself
    UNLINK: 3,
    unlink(id) {
        return [x2ManyCommands.UNLINK, id, false];
    },
    // (4, id[, _])
    LINK: 4,
    link(id) {
        return [x2ManyCommands.LINK, id, false];
    },
    // (5[, _[, _]])
    CLEAR: 5,
    clear() {
        return [x2ManyCommands.CLEAR, false, false];
    },
    // (6, _, ids) replaces all linked records with provided ids
    SET: 6,
    set(ids) {
        return [x2ManyCommands.SET, false, ids];
    },
};

function validateModel(value) {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`Invalid model name: ${value}`);
    }
}
function validatePrimitiveList(name, type, value) {
    if (!Array.isArray(value) || value.some((val) => typeof val !== type)) {
        throw new Error(`Invalid ${name} list: ${value}`);
    }
}
function validateObject(name, obj) {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
        throw new Error(`${name} should be an object`);
    }
}
function validateArray(name, array) {
    if (!Array.isArray(array)) {
        throw new Error(`${name} should be an array`);
    }
}

export const UPDATE_METHODS = [
    "unlink",
    "create",
    "write",
    "web_save",
    "action_archive",
    "action_unarchive",
];

export class ORM {
    constructor() {
        this.rpc = rpc; // to be overridable by the SampleORM
        /** @protected */
        this._silent = false;
    }

    /** @returns {ORM} */
    get silent() {
        return Object.assign(Object.create(this), { _silent: true });
    }

    /**
     * @param {string} model
     * @param {string} method
     * @param {any[]} [args=[]]
     * @param {any} [kwargs={}]
     * @returns {Promise<any>}
     */
    call(model, method, args = [], kwargs = {}) {
        validateModel(model);
        const url = `/web/dataset/call_kw/${model}/${method}`;
        const fullContext = Object.assign({}, user.context, kwargs.context || {});
        const fullKwargs = Object.assign({}, kwargs, { context: fullContext });
        const params = {
            model,
            method,
            args,
            kwargs: fullKwargs,
        };
        return this.rpc(url, params, { silent: this._silent });
    }

    /**
     * @param {string} model
     * @param {any[]} records
     * @param {any} [kwargs=[]]
     * @returns {Promise<number>}
     */
    create(model, records, kwargs = {}) {
        validateArray("records", records);
        for (const record of records) {
            validateObject("record", record);
        }
        return this.call(model, "create", [records], kwargs);
    }

    /**
     * @param {string} model
     * @param {number[]} ids
     * @param {string[]} fields
     * @param {any} [kwargs={}]
     * @returns {Promise<any[]>}
     */
    read(model, ids, fields, kwargs = {}) {
        validatePrimitiveList("ids", "number", ids);
        if (fields) {
            validatePrimitiveList("fields", "string", fields);
        }
        if (!ids.length) {
            return Promise.resolve([]);
        }
        return this.call(model, "read", [ids, fields], kwargs);
    }

    /**
     * @param {string} model
     * @param {import("@web/core/domain").DomainListRepr} domain
     * @param {string[]} fields
     * @param {string[]} groupby
     * @param {any} [kwargs={}]
     * @returns {Promise<any[]>}
     */
    readGroup(model, domain, fields, groupby, kwargs = {}) {
        validateArray("domain", domain);
        validatePrimitiveList("fields", "string", fields);
        validatePrimitiveList("groupby", "string", groupby);
        groupby = [...new Set(groupby)];
        return this.call(model, "read_group", [], { ...kwargs, domain, fields, groupby });
    }

    /**
     * @param {string} model
     * @param {import("@web/core/domain").DomainListRepr} domain
     * @param {any} [kwargs={}]
     * @returns {Promise<any[]>}
     */
    search(model, domain, kwargs = {}) {
        validateArray("domain", domain);
        return this.call(model, "search", [domain], kwargs);
    }

    /**
     * @param {string} model
     * @param {import("@web/core/domain").DomainListRepr} domain
     * @param {string[]} fields
     * @param {any} [kwargs={}]
     * @returns {Promise<any[]>}
     */
    searchRead(model, domain, fields, kwargs = {}) {
        validateArray("domain", domain);
        if (fields) {
            validatePrimitiveList("fields", "string", fields);
        }
        return this.call(model, "search_read", [], { ...kwargs, domain, fields });
    }

    /**
     * @param {string} model
     * @param {import("@web/core/domain").DomainListRepr} domain
     * @param {any} [kwargs={}]
     * @returns {Promise<number>}
     */
    searchCount(model, domain, kwargs = {}) {
        validateArray("domain", domain);
        return this.call(model, "search_count", [domain], kwargs);
    }

    /**
     * @param {string} model
     * @param {number[]} ids
     * @param {any} [kwargs={}]
     * @returns {Promise<boolean>}
     */
    unlink(model, ids, kwargs = {}) {
        validatePrimitiveList("ids", "number", ids);
        if (!ids.length) {
            return Promise.resolve(true);
        }
        return this.call(model, "unlink", [ids], kwargs);
    }

    /**
     * @param {string} model
     * @param {import("@web/core/domain").DomainListRepr} domain
     * @param {string[]} fields
     * @param {string[]} groupby
     * @param {any} [kwargs={}]
     * @returns {Promise<any[]>}
     */
    webReadGroup(model, domain, fields, groupby, kwargs = {}) {
        validateArray("domain", domain);
        validatePrimitiveList("fields", "string", fields);
        validatePrimitiveList("groupby", "string", groupby);
        return this.call(model, "web_read_group", [], {
            ...kwargs,
            groupby,
            domain,
            fields,
        });
    }

    /**
     * @param {string} model
     * @param {number[]} ids
     * @param {any} [kwargs={}]
     * @param {Object} [kwargs.specification]
     * @param {Object} [kwargs.context]
     * @returns {Promise<any[]>}
     */
    webRead(model, ids, kwargs = {}) {
        validatePrimitiveList("ids", "number", ids);
        return this.call(model, "web_read", [ids], kwargs);
    }

    /**
     * @param {string} model
     * @param {import("@web/core/domain").DomainListRepr} domain
     * @param {any} [kwargs={}]
     * @returns {Promise<any[]>}
     */
    webSearchRead(model, domain, kwargs = {}) {
        validateArray("domain", domain);
        return this.call(model, "web_search_read", [], { ...kwargs, domain });
    }

    /**
     * @param {string} model
     * @param {number[]} ids
     * @param {any} data
     * @param {any} [kwargs={}]
     * @returns {Promise<boolean>}
     */
    write(model, ids, data, kwargs = {}) {
        validatePrimitiveList("ids", "number", ids);
        validateObject("data", data);
        return this.call(model, "write", [ids, data], kwargs);
    }

    /**
     * @param {string} model
     * @param {number[]} ids
     * @param {any} data
     * @param {any} [kwargs={}]
     * @param {Object} [kwargs.specification]
     * @param {Object} [kwargs.context]
     * @returns {Promise<any[]>}
     */
    webSave(model, ids, data, kwargs = {}) {
        validatePrimitiveList("ids", "number", ids);
        validateObject("data", data);
        return this.call(model, "web_save", [ids, data], kwargs);
    }
}

/**
 * Note:
 *
 * when we will need a way to configure a rpc (for example, to setup a "shadow"
 * flag, or some way of not displaying errors), we can use the following api:
 *
 * this.orm = useService('orm');
 *
 * ...
 *
 * const result = await this.orm.withOption({shadow: true}).read('res.partner', [id]);
 */
export const ormService = {
    async: [
        "call",
        "create",
        "nameGet",
        "read",
        "readGroup",
        "search",
        "searchRead",
        "unlink",
        "webSearchRead",
        "write",
    ],
    start() {
        return new ORM();
    },
};

registry.category("services").add("orm", ormService);
```
然后我们在任何小部件里面, 都可以使用 `useService` 来进行使用:

```js{26}
/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { registry } from "@web/core/registry";
import { usePopover } from "@web/core/popover/popover_hook";
import { useService } from "@web/core/utils/hooks";
import { localization } from "@web/core/l10n/localization";
import { formatDate, deserializeDate } from "@web/core/l10n/dates";

import { formatMonetary } from "@web/views/fields/formatters";
import { standardFieldProps } from "@web/views/fields/standard_field_props";
import { Component } from "@odoo/owl";

class AccountPaymentPopOver extends Component {
    static props = { "*": { optional: true } };
    static template = "account.AccountPaymentPopOver";
}

export class AccountPaymentField extends Component {
    static props = { ...standardFieldProps };
    static template = "account.AccountPaymentField";

    setup() {
        const position = localization.direction === "rtl" ? "bottom" : "left";
        this.popover = usePopover(AccountPaymentPopOver, { position });
        this.orm = useService("orm");
        this.action = useService("action");
    }

    getInfo() {
        const info = this.props.record.data[this.props.name] || {
            content: [],
            outstanding: false,
            title: "",
            move_id: this.props.record.resId,
        };
        for (const [key, value] of Object.entries(info.content)) {
            value.index = key;
            value.amount_formatted = formatMonetary(value.amount, {
                currencyId: value.currency_id,
            });
            if (value.date) {
                value.formattedDate = formatDate(deserializeDate(value.date))
            }
        }
        return {
            lines: info.content,
            outstanding: info.outstanding,
            title: info.title,
            moveId: info.move_id,
        };
    }

    onInfoClick(ev, line) {
        this.popover.open(ev.currentTarget, {
            title: _t("Journal Entry Info"),
            ...line,
            _onRemoveMoveReconcile: this.removeMoveReconcile.bind(this),
            _onOpenMove: this.openMove.bind(this),
        });
    }

    async assignOutstandingCredit(moveId, id) {
        await this.orm.call(this.props.record.resModel, 'js_assign_outstanding_line', [moveId, id], {});
        await this.props.record.model.root.load();
    }

    async removeMoveReconcile(moveId, partialId) {
        this.popover.close();
        await this.orm.call(this.props.record.resModel, 'js_remove_outstanding_partial', [moveId, partialId], {});
        await this.props.record.model.root.load();
    }

    async openMove(moveId) {
        const action = await this.orm.call(this.props.record.resModel, 'action_open_business_doc', [moveId], {});
        this.action.doAction(action);
    }
}

export const accountPaymentField = {
    component: AccountPaymentField,
    supportedTypes: ["char"],
};

registry.category("fields").add("payment", accountPaymentField);
```

### Systray registry

`systray` 系统托盘是导航栏右侧的区域, 其中包含各种小组件, 通常显示某种信息(如: 未读消息的数量), 通知或是让用户与他们进行交互

一个 `systray` 应该包含下面这些参数:

- **props**: 应该传入给组件的 props;
- **Component**: class 组件, 它的根元素应该是一个 `<li>` 标签, 否则可能没办法正确的设置样式;
- **isDisplayed**: 一个接受 env 并返回 boolean 值的函数, 如果返回 true, 则显示系统托盘, 否则将不显示;

```js

import { registry } from "@web/core/registry";
import { Transition } from "@web/core/transition";
import { user } from "@web/core/user";
import { useBus, useService } from "@web/core/utils/hooks";
import { BurgerUserMenu } from "./burger_user_menu/burger_user_menu";
import { MobileSwitchCompanyMenu } from "./mobile_switch_company_menu/mobile_switch_company_menu";

import { Component, useState } from "@odoo/owl";

const SWIPE_ACTIVATION_THRESHOLD = 100;

export class BurgerMenu extends Component {
    static template = "web.BurgerMenu";
    static props = {};
    static components = {
        BurgerUserMenu,
        MobileSwitchCompanyMenu,
        Transition,
    };

    setup() {
        this.company = useService("company");
        this.user = user;
        this.state = useState({
            isBurgerOpened: false,
        });
        this.swipeStartX = null;
        useBus(this.env.bus, "HOME-MENU:TOGGLED", () => {
            this._closeBurger();
        });
        useBus(this.env.bus, "ACTION_MANAGER:UPDATE", ({ detail: req }) => {
            if (req.id) {
                this._closeBurger();
            }
        });
    }
    _closeBurger() {
        this.state.isBurgerOpened = false;
    }
    _openBurger() {
        this.state.isBurgerOpened = true;
    }
    _onSwipeStart(ev) {
        this.swipeStartX = ev.changedTouches[0].clientX;
    }
    _onSwipeEnd(ev) {
        if (!this.swipeStartX) {
            return;
        }
        const deltaX = ev.changedTouches[0].clientX - this.swipeStartX;
        if (deltaX < SWIPE_ACTIVATION_THRESHOLD) {
            return;
        }
        this._closeBurger();
        this.swipeStartX = null;
    }
}

const systrayItem = {
    Component: BurgerMenu,
};

registry.category("systray").add("burger_menu", systrayItem, { sequence: 0 });
```

> 示例为系统托盘里面的切换 debug 模式的按钮;

### Usermenu registry

用户菜单注册, 分类为 `user_menuitems`, 包含打开用户菜单时显示的所有菜单项 (右上角带有用户名的导航栏元素); 

用户带单由一个函数定义, 该函数会回调回来一个 env 并需要返回一个普通的 object, 其中包含如下信息:

- **description**: 菜单项的文本展示;
- **href**: 如果给定 href 选项, 则该菜单会被放在具有指定 href 的 a 标签中;
- **callback**: 在当前菜单被选中的时候执行的回调函数;
- **hide**: 是否隐藏此菜单, 默认值为 false;
- **sequence**: 排序, 默认值为 100;

```js
import { Component, markup } from "@odoo/owl";
import { isMacOS } from "@web/core/browser/feature_detection";
import { _t } from "@web/core/l10n/translation";
import { rpc } from "@web/core/network/rpc";
import { user } from "@web/core/user";
import { escape } from "@web/core/utils/strings";
import { session } from "@web/session";
import { browser } from "../../core/browser/browser";
import { registry } from "../../core/registry";

function documentationItem(env) {
    const documentationURL = "https://www.odoo.com/documentation/18.0";
    return {
        type: "item",
        id: "documentation",
        description: _t("Documentation"),
        href: documentationURL,
        callback: () => {
            browser.open(documentationURL, "_blank");
        },
        sequence: 10,
    };
}

function supportItem(env) {
    const url = session.support_url;
    return {
        type: "item",
        id: "support",
        description: _t("Support"),
        href: url,
        callback: () => {
            browser.open(url, "_blank");
        },
        sequence: 20,
    };
}

class ShortcutsFooterComponent extends Component {
    static template = "web.UserMenu.ShortcutsFooterComponent";
    static props = {
        switchNamespace: { type: Function, optional: true },
    };
    setup() {
        this.runShortcutKey = isMacOS() ? "CONTROL" : "ALT";
    }
}

function shortCutsItem(env) {
    const translatedText = _t("Shortcuts");
    return {
        type: "item",
        id: "shortcuts",
        hide: env.isSmall,
        description: markup(
            `<div class="d-flex align-items-center justify-content-between p-0 w-100">
                <span>${escape(translatedText)}</span>
                <span class="fw-bold">${isMacOS() ? "CMD" : "CTRL"}+K</span>
            </div>`
        ),
        callback: () => {
            env.services.command.openMainPalette({ FooterComponent: ShortcutsFooterComponent });
        },
        sequence: 30,
    };
}

function separator() {
    return {
        type: "separator",
        sequence: 40,
    };
}

export function preferencesItem(env) {
    return {
        type: "item",
        id: "settings",
        description: _t("Preferences"),
        callback: async function () {
            const actionDescription = await env.services.orm.call("res.users", "action_get");
            actionDescription.res_id = user.userId;
            env.services.action.doAction(actionDescription);
        },
        sequence: 50,
    };
}

export function odooAccountItem(env) {
    return {
        type: "item",
        id: "account",
        description: _t("My Odoo.com account"),
        callback: () => {
            rpc("/web/session/account")
                .then((url) => {
                    browser.open(url, "_blank");
                })
                .catch(() => {
                    browser.open("https://accounts.odoo.com/account", "_blank");
                });
        },
        sequence: 60,
    };
}

function installPWAItem(env) {
    let description = _t("Install App");
    let callback = () => env.services.pwa.show();
    let show = () => env.services.pwa.isAvailable;
    const currentApp = env.services.menu.getCurrentApp();
    if (currentApp && ["barcode", "field-service", "shop-floor"].includes(currentApp.actionPath)) {
        // While the feature could work with all apps, we have decided to only
        // support the installation of the apps contained in this list
        // The list can grow in the future, by simply adding their path
        description = _t("Install %s", currentApp.name);
        callback = () => {
            window.open(
                `/scoped_app?app_id=${currentApp.webIcon.split(",")[0]}&path=${encodeURIComponent(
                    "scoped_app/" + currentApp.actionPath
                )}`
            );
        };
        show = () => !env.services.pwa.isScopedApp;
    }
    return {
        type: "item",
        id: "install_pwa",
        description,
        callback,
        show,
        sequence: 65,
    };
}

function logOutItem(env) {
    let route = "/web/session/logout";
    if (env.services.pwa.isScopedApp) {
        route += `?redirect=${encodeURIComponent(env.services.pwa.startUrl)}`;
    }
    return {
        type: "item",
        id: "logout",
        description: _t("Log out"),
        href: `${browser.location.origin}${route}`,
        callback: () => {
            browser.location.href = route;
        },
        sequence: 70,
    };
}

registry
    .category("user_menuitems")
    .add("documentation", documentationItem)
    .add("support", supportItem)
    .add("shortcuts", shortCutsItem)
    .add("separator", separator)
    .add("profile", preferencesItem)
    .add("odoo_account", odooAccountItem)
    .add("install_pwa", installPWAItem)
    .add("log_out", logOutItem);

```










