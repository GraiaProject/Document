---
id: event-propagation-and-priority
title: 事件传播与优先级
sidebar-title: 事件传播与优先级
---

事件的分发由 `postEvent` 方法触发, 该方法实则是启动一个 `Broadcast.layered_scheduler` 的异步任务.

`layered_scheduler` 负责调度不同优先级的 `Listener`, 将其根据相同的 `priority` 进行分组并行发起,
且 `priority` 越小的越先执行.

当一个组中, 有一个执行抛出了 `PropagationCancelled` 错误, 则停止执行这之后的**所有**监听器.

同时, 当一个 `Dispatcher`/`Decorator` 抛出了 `ExecutionStop` 错误, 则事件监听器的主要部分将被跳过.