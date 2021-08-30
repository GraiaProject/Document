---
id: outside-of-event
title: 事件之外的用户空间
sidebar-title: 事件之外的用户空间
---

这里列举了一些可以包含 `Dispatcher` 和/或 `Decorator` 的地方, 活用这些会给你的应用开发带来方便, 但滥用就只会带来维护的无尽苦恼.

 - 调用 `Broadcast.receiver` 时传入的 `dispatchers` 与 `decorators`;
 - 命名空间(`Namespace`) 的 `injected_dispatchers` 属性;
 - `Broadcast.Executor` 的 `dispatchers` 参数;
 - `ExecTarget`(及其子类, eg. `Listener`) 的属性 `inline_dispatchers` 与 `decorators`;
 - `Broadcast` 实例的 `default_namespace` 是应用于所有未特别指定命名空间的事件监听器的命名空间, 也具有 `injected_dispatchers` 属性;
 - `Broadcast.dispatcher_interface.execution_contexts[0].dispatchers` 可以放一些 `Dispatcher`, 这里是**全局应用**的.
 - And more...