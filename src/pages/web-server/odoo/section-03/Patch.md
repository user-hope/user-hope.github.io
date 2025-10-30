---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-03/Hooks.md
next:
  link: /pages/web-server/odoo/section-03/Javascript指南.md
---

## Patch Code

有时候, 我们需要定制 ui 和一些交互效果, 虽然 odoo 给我们提供了很多的开放 api 来进行一些常见的需求开发, 例如: 视图扩展, 字段扩展, 以及各种服务扩展; 但是, 这在某种情况下, 还是不够, 有些情况, 我们需要修改 odoo 提供的类或者是对象和方法; 因此 odoo 提供了 patch 函数, 用来完成这一类特定的需求;

下面是一个简单的例子, 用来复写对象上面的一个函数:

```js
import { patch } from "@web/core/utils/patch";

const object = {
    field: 'a field',
    fn() {
        // do something
    }
}

patch(object, {
    fn() {
        // do things
    }
})
```
当我们在复写 fn 函数的时候, 又希望原有的逻辑不被破坏, 因此, 我们可以使用 `super` 关键字, 来执行原有父对象里面的逻辑:

```js
patch(object, {
    fn() {
        super.fn(...arguments);
        // do things
    }
})
```

> 注意, super 只能用在方法里面, 不能直接在函数定义里面使用, 下面的这两种写法都是不被支持的:

```js
// 都是错误的写法
const obj = {
    a: function() {
        super.a();
    },
    b: () => {
        super.b();
    }
}
```
除了对对象的扩展以外, patch 函数还可以扩展组件和类; 

## Patch Javascript Class

patch 函数可以处理对象或者是 ES6 里面提供的类;

然而, 由于 javascript 的继承是基于原型链实现的, 因此, 如果需要在类上面扩展方法的时候, 需要扩展类的 `prototype` 属性:

```js
class MyClass {

    static myStaticFn() {

    }

    myPrototypeFn() {

    }
}


// 这将会修改类的静态方法
patch(MyClass, {
    myStaticFn() {

    }
})

// 这才是修改类的实例方法
patch(MyClass.prototype, {
    myPrototypeFn() {

    }
})
```

## Patch Component

odoo 的 Component 组件也是一个类, 所以它有一个构造函数, 但是 `constructor` 是 js 中的特殊方法, 不能以任何方式进行重写, 因此, odoo 的类提供的 `setup` 函数; 因此, 如果我们需要扩展原有类, 可以对 `setup` 方法进行扩展;

```js
patch(MyComponent.prototype, {
    setup() {
        useMyHook();
    },
});
```



























