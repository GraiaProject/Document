---
id: dispatcher-inject
title: 参数解析器注入
sidebar-title: 参数解析器注入
---

!!! note
    在 [事件之外的用户空间](../advance/outside-of-event.md) 中其实已经有相关的阐述

## Prelude Dispatcher

`Broadcast.prelude_dispatchers` 先于其他 **所有** Dispatchers 被调用.  
`Decorator` 与 `Derive` 的底层支持都在实例化时已经被安放到这个列表中了,
除非必要, 否则 **无论如何** 都不要修改他们的次序!

## Finale Dispatcher

`Broadcast.finale_dispatchers` 后于其他 **所有** Dispatchers 被调用.  
你可以在这里放一些需要被全局调用的 Dispatcher.

`BroadcastBuiltinDispatcher` 在实例化时被预先注入到此列表中,
该 Dispatcher 用于分发像 `Broadcast` 这样的重要实例,
除非必要, 否则 **无论如何** 都不要删除!
