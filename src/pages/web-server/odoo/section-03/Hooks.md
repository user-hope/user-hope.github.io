---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/Services.md
next:
  link: /pages/web-server/odoo/section-03/Patch.md
---

## Hooks

Owl 提供的大多数的 hook 都与组件的生命周期相关, 但是期中一些 hook, 例如: `useComponent` 提供了一种构建特定的 hook 的方法;

使用这些 hook, 可以完成很多自定的 hook, 用来解决一些特定的问题; 下面是 odoo Web 框架提供的一些 hook;

### useAutofocus

在当前组件中出现 `t-ref="autofocus"` 的元素, 并且在 dom 节点中之前是隐藏状态的, 就对其进行聚焦;

```js
import { useAutofocus } from "@web/core/utils/hooks";

class Comp {
    setup() {
        this.inputRef = useAutofocus();
    }
    static template = "Comp";
}
```
```xml
<t t-name="Comp">
    <input t-ref="autofocus" type="text"/>
</t>
```

### useBus

向总线添加和清除 `event listener`, 该 hook 可以确保组件在销毁的时候自动移除事件监听;

```js
import { useBus } from "@web/core/utils/hooks";

class MyComponent {
    setup() {
        useBus(this.env.bus, "some-event", event => {
            console.log(event);
        });
    }
}
```

### usePager

在视图中显示分页器, 该 hook 会设置当前的 `env.config` 并向当前控制视图提供 props;

```js
usePager(() => {
    if (!this.model.root.isNew) {
        const resIds = this.model.root.resIds;
        return {
            offset: resIds.indexOf(this.model.root.resId),
            limit: 1,
            total: resIds.length,
            onUpdate: ({ offset }) => this.onPagerUpdate({ offset, resIds }),
        };
    }
});
```


### usePosition

帮助一个 html 元素相对于另一个 html 元素进行定位, 该 hook 可以确保在调整窗口大小/滚动的时候实时更新定位;

```js
this.position = usePosition("ref", () => this.props.target, {
    onPositioned: (el, solution) => {
        (this.props.onPositioned || this.onPositioned.bind(this))(el, solution);
        if (this.props.arrow && this.props.onPositioned) {
            this.onPositioned.bind(this)(el, solution);
        }

        if (shouldAnimate) {
            shouldAnimate = false;
            const transform = {
                top: ["translateY(-5%)", "translateY(0)"],
                right: ["translateX(5%)", "translateX(0)"],
                bottom: ["translateY(5%)", "translateY(0)"],
                left: ["translateX(-5%)", "translateX(0)"],
            }[solution.direction];
            this.position.lock();
            const animation = el.animate(
                { opacity: [0, 1], transform },
                this.constructor.animationTime
            );
            animation.finished.then(this.position.unlock);
        }

        if (this.props.fixedPosition) {
            this.position.lock();
        }
    },
    position: this.props.position,
});
```

















