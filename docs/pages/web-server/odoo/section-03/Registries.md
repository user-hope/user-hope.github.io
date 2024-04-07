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

`effects registry` 包含所有的可用效果的实现, 更多详细信息请参考 [Effect Service]()

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

#### rainbow_man 实现











