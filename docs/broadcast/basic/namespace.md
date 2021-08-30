---
id: namespace
title: 命名空间
sidebar-title: 命名空间
---

将东西成组, 归类摆放是一种好习惯, 尽管 `Namespace` 是这里的阿卡林, 但同时也是最简单的特性.

我们可以通过 `Broadcast.createNamespace` 方法创建一个命名空间:

```python
namespace = broadcast.createNamespace("example_namespace")
```

我们可以为这个命名空间设置各种东西, 包括优先级, 是否隐藏, 是否禁用, 还有命名空间级作用的 `Dispatcher`.

使用 `removeNamespace` 即可删除命名空间, 但相对的, 在这个命名空间下的事件监听器将**全部**被移除.

使用 `containNamespace` 查询是否有该命名空间.

使用 `getNamespace` 获取 `Namespace` 实例.

`hideNamespace`, `unhideNamespace` 可以设定是否隐藏.

`enableNamespace`, `disableNamespace` 可以设定是否禁用.

`getDefaultNamespace` 可以获取默认的命名空间, 这个也可以拿来 remove.