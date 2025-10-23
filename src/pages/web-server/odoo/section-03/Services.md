---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/Registries.md
next:
  link: /pages/web-server/odoo/section-03/Services.md
---

## Service

`Service` 是常驻服务的, 它可以通过组件使用(useService) 或其他服务导入使用, 此外, 它还可以声明一些依赖项, 从这个意义上来说, service 其实基本上就是一个依赖注入系统; 例如: 通过 service 实现显示通知的方法, 或者是 rpc 服务发送请求等;

例如: 下面这个 service 定义了服务启动的时候, 没间隔 5s 发送一个 notification 消息通知;

```js
import { registry } from "@web/core/registry";

const myService = {
    dependencies: ["notification"],
    start(env, { notification }) {
        let counter = 1;
        setInterval(() => {
            notification.add(`Tick Tock ${counter++}`);
        }, 5000);
    }
};

registry.category("services").add("myService", myService);
```

> 当启动 odoo 服务的时候, Web 客户端将启动服务注册表中存在的所有服务; 


## 定义一个 Service

一个 service 需要实现以下接口:

- **dependencies**: 可选依赖项;
- **start(env, deps)**: 这个是 service 的主要函数, 它可以返回一个值; 或者是 promise, 在这种情况下, 服务的加载器只需要等待 promise 执行完成, 然后 promise 的返回值将作为 service 的值;

## Service 的使用

可以直接使用 hook 来引用一个 service;

```js{18,19}
/** @odoo-module */

import { registry } from "@web/core/registry";
import { useService } from "@web/core/utils/hooks";

import { standardWidgetProps } from "@web/views/widgets/standard_widget_props";
import { onWillStart, useState, onWillUpdateProps, Component } from "@odoo/owl";

export class DepartmentChart extends Component {
    static template = "hr.DepartmentChart";
    static props = {
        ...standardWidgetProps,
    };

    setup() {
        super.setup();

        this.action = useService("action");
        this.orm = useService("orm");
        this.state = useState({
            hierarchy: {},
        });
        onWillStart(async () => await this.fetchHierarchy(this.props.record.resId));

        onWillUpdateProps(async (nextProps) => {
            await this.fetchHierarchy(nextProps.record.resId);
        });
    }

    async fetchHierarchy(departmentId) {
        this.state.hierarchy = await this.orm.call("hr.department", "get_department_hierarchy", [
            departmentId,
        ]);
    }

    async openDepartmentEmployees(departmentId) {
        const dialogAction = await this.orm.call(
            this.props.record.resModel,
            "action_employee_from_department",
            [departmentId],
            {}
        );
        this.action.doAction(dialogAction);
    }
}

export const departmentChart = {
    component: DepartmentChart,
};
registry.category("view_widgets").add("hr_department_chart", departmentChart);
```

## odoo 预设的 Service

- **action**: 管理 action;
- **effect**: 展示图形效果;
- **http**: 调用 http 服务;
- **notification**: 通知;
- **router**: 管理浏览器的 ui 跳转;
- **rpc**: request 服务调用;
- **title**: 网站的 title 展示管理;
- **user**: 当前用户相关的信息

### Action Service

```js{9}
/** @odoo-module **/

import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { useComponent } from "@odoo/owl";

export function useArchiveEmployee() {
    const component = useComponent();
    const action = useService("action");
    return (id) => {
        action.doAction(
            {
                type: "ir.actions.act_window",
                name: _t("Employee Termination"),
                res_model: "hr.departure.wizard",
                views: [[false, "form"]],
                view_mode: "form",
                target: "new",
                context: {
                    active_id: id,
                    toggle_active: true,
                },
            },
            {
                onClose: async () => {
                    await component.model.wload();
                },
            }
        );
    };
}
```

### Effect Service

```js
const effectService = useService("effect");
effectService.add({
    type: "rainbow_man",
    message: "Boom! Team record for the past 30 days.",
});
```
如何自定义一个 effect, 可以查看 [定义一个-effect](/pages/web-server/odoo/section-03/Registries.html#定义一个-effect)

### Http Service

虽然 odoo 中客户端和服务端进行通信大多数的交互都是调用的 rpc 服务, 但有的时候可能需要请求一些第三方的服务, http 提供了 get 和 post 方法用来调用 其他的 http 服务;

```js
export function useFileUploader() {
    const http = useService("http");
    const notification = useService("notification");
    /**
     * @param {string} route
     * @param {Object} params
     */
    return async (route, params) => {
        if ((params.ufile && params.ufile.length) || params.file) {
            const fileSize = (params.ufile && params.ufile[0].size) || params.file.size;
            if (!checkFileSize(fileSize, notification)) {
                return null;
            }
        }
        const fileData = await http.post(route, params, "text");
        const parsedFileData = JSON.parse(fileData);
        if (parsedFileData.error) {
            throw new Error(parsedFileData.error);
        }
        return parsedFileData;
    };
}
```

### Notification service

`notification` 允许在屏幕展示一个消息通知; 其中可以有以下参数:

- **title**: 消息通知的标题内容;
- **type**: 消息通知的类型, 枚举值, 可选 `warning` | `danger` | `success` | `info`;
- **sticky**: 是否常驻, 直到用户手动关闭;
- **className**: 自定义消息体的 class 类名;
- **onClose**: 点击当前消息的关闭的时候触发的回调函数;
- **buttons**: 定制显示按钮;
- **autocloseDelay**: 通知自动关闭之前的持续时间;

其中, 按钮的属性可以定义为:
- **name**: 按钮展示名称;
- **onClick**: 按钮点击时候执行的回调函数;
- **primary**: boolean, 按钮是否应设置为主按钮的样式;

```js
// in setup
this.notificationService = useService("notification");
this.actionService = useService("action");

// later
this.notificationService.add("You closed a deal!", {
    title: "Congrats",
    type: "success",
    buttons: [
        {
            name: "See your Commission",
            onClick: () => {
                this.actionService.doAction("commission_action");
            },
        },
    ],
});
```

### Router Service

```js
import { Component } from "@odoo/owl";
import { useSelfOrder } from "@pos_self_order/app/self_order_service";
import { useService } from "@web/core/utils/hooks";

export class EatingLocationPage extends Component {
    static template = "pos_self_order.EatingLocationPage";
    static props = {};

    setup() {
        this.selfOrder = useSelfOrder();
        this.router = useService("router");
    }

    back() {
        this.router.navigate("default");
    }

    selectLocation(loc) {
        this.selfOrder.currentOrder.takeaway = loc === "out";
        this.selfOrder.orderTakeAwayState[this.selfOrder.currentOrder.uuid] = true;

        if (loc === "out") {
            this.selfOrder.currentOrder.update({
                fiscal_position_id: this.selfOrder.config.takeaway_fp_id,
            });
        }
        this.router.navigate("product_list");
    }
}
```

### RPC Service

```js
import { rpc } from "@web/core/network/rpc";

const result = await rpc('/web/dataset/call_kw', {
    model: 'ir.logging', method: 'send_key',
    args: [key],
    kwargs: {},
});
```

### Title Service

odoo 提供了一个简单的 API, 允许用户读取或者是修改网站的 title;

```js
const titleService = useService("title");

titleService.setParts({ odoo: "Odoo 15", fruit: "Apple" });
```

### User Service

用户服务提供了一堆数据和一些关于连接用户的辅助功能

- **context**: 当前用户的上下文信息;
- **db**: 数据库相关信息;
- **home_action_id**: 用户主页的 id;
- **isAdmin**: 是否是管理员用户; 用户组(base.group_erp_manager) or superuser;
- **isSystem**: 是否是系统管理员用户; 用户组(base.group_system)
- **lang**: 当前使用的语种;
- **name**: 用户名;
- **partnerId**: partner_id;
- **tz**: 用户的时区;
- **userId**: 用户的 id;
- **userName**: 用户的昵称;

```js{21}
/** @odoo-module **/

import { onWillStart } from "@odoo/owl";
import { user } from "@web/core/user";

/**
 * Mixin that handles public/private access of employee records in many2X fields
 * @param { Class } fieldClass
 * @returns Class
 */
export function EmployeeFieldRelationMixin(fieldClass) {
    return class extends fieldClass {
        static props = {
            ...fieldClass.props,
            relation: { type: String, optional: true },
        };

        setup() {
            super.setup();
            onWillStart(async () => {
                this.isHrUser = await user.hasGroup("hr.group_hr_user");
            });
        }

        get relation() {
            if (this.props.relation) {
                return this.props.relation;
            }
            return this.isHrUser ? "hr.employee" : "hr.employee.public";
        }
    };
}
```






