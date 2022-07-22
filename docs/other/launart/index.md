# Launart - 统一的部件生命周期管理

## Launart 可以做什么?

你是否在利用 Broadcast 的 Dispatcher 来获得一个全局/只有少量状态的，依赖于全局配置的接口？

考虑以下例子：

- `aiohttp`/`httpx` 等网络客户端的 `Session` 对象

- `uvicorn`/`fastapi`/`aiohttp` 等网络服务器的 `Server`/`Application` 实例

- `MySQL`/`redis` 等的 `Connection` 实例

这些东西都是半全局的，但是因为它们不像 [`AbstractEventLoop`][asyncio.AbstractEventLoop] 或 [`Broadcast`](./../../broadcast/basic/hello-world.md)
那样可以基本保证全局唯一, 所以不能直接托管给 [`creart`](./../creart/intro.md) 来创建和管理.

那我们要怎么处理呢？

这时我们的 `Launart` 就可以出场了.

!!! note "Tips: Launart 的命名来自于 Launch Art 的组合"

## 第一步

:construction: 施工中