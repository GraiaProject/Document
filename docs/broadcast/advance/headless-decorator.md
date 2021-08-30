---
id: headless-decorator
title: 无头装饰器
sidebar-title: 无头装饰器
---

你可以在调用 `Broadcast.receiver` 时, 传入一个 `decorators` 的参数,
内容为一个 `List[Decorator]`, 可以填入一些 `Decorator`.

这里的 `Decorator` 只有在所有参数被解析, 值分配完毕后才会开始执行,
且获取到的 `name` 是且只能是 `_bcc_headless_decorators`, `annotation` 为 `None`,
且 `default` 为其自身.

该 `Decorator` 可以通过 `DecoratorInterface.dispatcher_interface` 调用 `DispatcherInterface`,
也就能使用 [Proxy Mode](proxy-mode)