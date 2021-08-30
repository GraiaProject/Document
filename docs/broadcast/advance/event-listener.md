---
id: event-listener
title: 事件监听器
sidebar-title: 事件监听器
---

`Listener` 是用于描述一个事件监听器的类, 通常在 `Broadcast.listeners` 中出现.

`Listener` 实例在调用 `Broadcast.receiver` 方法时被创建, 并保存到 `Broadcast.listeners`.

`Listener` 在 `graia.broadcast.entities.listener` 处被定义.

```python
class Listener(ExecTarget):
    namespace: Namespace
    listening_events: List[Type[Dispatchable]]
    priority: int
```

你也可在该文档的其他地方找到关于这些字段的信息.