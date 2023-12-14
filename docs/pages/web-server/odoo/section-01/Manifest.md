---
headerDepth: 4
prev:
  link: /pages/web-server/odoo/section-01/Qweb报表.md
next:
  link: /pages/web-server/odoo/section-01/动作.md
---
## Module Manifests

`manifest` 文件用于将 python 包声明为 odoo 的模块, 并指定模块的元数据; 在 [第二章](/pages/web-server/odoo/section-01/第一个模块.md#odoo-模块结构) 的模块结构中就简单的介绍了一下 `manifest` 文件的作用;

`manifest` 的内容是一个 python 的 `dict`, 每一个 `key` 都指定对应的元数据, 下面来看一下一个完整的 `manifest` 所包含的内容;

### name 

`str` 类型, 必填; 标识为模块的名称; 用于在 `apps` 里面展示;

### version

`str` 类型, 模块的版本;

### description

`str` 类型, 模块的扩展描述; 可以是一个普通的文本; 也可以是 `RST` 格式的藏描述; 通常放在 `""" """` 当中;  

### author

`str` 类型, 是一个作者姓名的字符串; 如果有多个作者的话, 一般使用逗号来进行分隔, 但注意它仍应是一个字符串, 而非 Python 列表;

### website

`str` 类型, 这个 URL 可供人们访问来了解模块或作者的更多信息;

### license

`str` 类型, 默认为 `LGPL-3` 可选值:

- `GPL-2`
- `GPL-2 or any later version`
- `GPL-3`
- `GPL-3 or any later version`
- `AGPL-3`
- `LGPL-3`
- `Other OSI approved licence`
- `OEEL-1` (Odoo Enterprise Edition License v1.0)
- `OPL-1` (Odoo Proprietary License v1.0)
- `Other proprietary`

### category

`str` 类型, odoo 中的模块类别; 标准的模块类别请查看源码 `odoo/addons/base/data/ir_module_category_data.xml`; 默认为 `Uncategorized`;

该字段是自定义的, 并且 odoo 会动态创建类别; 类别层次结构可以使用 `/` 分隔符创建; 例如: `Services/Library`, 将会创建一个类别 `Services`, 并且将 `Library` 作为 `Services` 的子类别;

在 `apps` 界面点击 `Group By` --> `Category` 可以看到:

![odoo-module-category](/images/odoo/S09/category.png)

### depends

`list(str)` 类型; 当前模块所依赖的其他模块的名称; 如果当前模块不依赖于任何其他模块, 则 `depends` 至少为 `['base']`; 别忘记包含这个模块所引用的 `XML ID`、视图或模块的定义模型. 那样可确保它们以正确的顺序进行加载, 避免难以调试的错误;

### data

`list(str)` 类型; 这是在模块安装或升级时需加载数据文件的相对路径列表. 这些路径相对于模块的根目录. 通常, 这些是 `XML` 和 `CSV` 文件, 但也可以使用 `YAML` 格式的数据文件;

### demo

`list(str)` 类型; 仅在演示模式下安装或更新的数据文件列表; 仅在创建数据库时启用了 `Demo Data` 标记时才会进行加载;

### auto_install

`bool` 或者是 `list(str)` 类型, 默认为 `False`; 如果为 True, 则在安装了该模块的所有依赖项后, 该模块将自动安装; 

它通常用于实现两个独立模块之间协同集成的 "链接模块"; 例如: `sale_crm` 依赖于 `sale` 和 `crm` 模块, 当 `sale_crm` 的这个字段设置为 True 时, `sale` 模块和 `crm` 模块都安装好了, 就会自动安装 `sale_crm`;

如果它是一个列表, 那么它必须包含依赖项的子集; 一旦安装了子集中的所有依赖项, 就会自动安装此模块; 其余的依赖项也将自动安装. 如果列表为空, 则无论其依赖关系如何, 都将自动安装此模块;

### external_dependencies

`dict{ key: list(str) }` 类型; 声明模块所依赖的 python 包或者是二进制文件; `key` 值可选为 `python`, `bin`;

```python
'external_dependencies': {
    'python' : ['pyusb','pyserial','qrcode'],
},
```
当 `key` 为 `python` 的时候, `list` 里面的值为 python 的依赖包; 

当 `key` 为 `bin` 的时候, `list` 里面为二进制可执行文件的名称;

如果主机中没有安装 python 的模块, 或者是在主机的 PATH 环境变量中找不到二进制可执行文件, 则不会安装该模块;

### application

`bool` 类型, 默认为 `False`, 如果声明为 `True`, 则该模块将作为一个完整的应用, 这意味着该模块将显示在应用程序主菜单中, 而不仅仅是在其他菜单中; 

### assets

`dict` 类型;  用于指定模块所需的静态资源文件, 比如 `JavaScript`, `CSS` 和 `xml` 模板 等; 这些资源文件可以用于自定义界面、添加新的样式或功能; 以及优化用户体验.

### installable

`bool` 类型, 默认为 `True`, 用于定义模块是否可以被安装;

### maintainer

`str` 类型, 用于定义模块的维护者或负责人. 这个属性的值通常是一个字符串, 包含了模块的维护者的姓名或者联系方式;

### {pre_init, post_init, uninstall}_hook

`str` 类型, 可以定义用于在安装或卸载模块时执行的钩子函数;

- **`pre_init_hook`**: 在模块安装之前调用的钩子函数;
- **`post_init_hook`**: 在模块安装之后调用的钩子函数;
- **`uninstall_hook`**: 在卸载模块时调用的钩子函数;

这些钩子函数可以执行任意的操作, 例如初始化数据、检查依赖关系、更新配置等; 通过定义这些钩子函数, 开发者可以在模块安装和卸载时执行自定义的逻辑, 以满足特定的需求;

### active

`bool` 类型, 用于指定模块是否处于激活状态; 如果 `active` 属性为 `False`, 则表示该模块在安装后会处于非激活状态, 需要手动激活才能使用;
