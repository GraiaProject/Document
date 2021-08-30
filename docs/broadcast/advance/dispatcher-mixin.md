---
id: dispatcher-mixin
title: 在 Dispatcher 内使用混入(Mixin)
sidebar-title: 在 Dispatcher 内使用混入(Mixin)
---

有时候, 我们会需要复用来自其他 Dispatcher 的逻辑, 这时候我们可以用 `Mixin` 机制实现.

在定义事件时, 我们会要求事件内定义一个 `Dispatcher` 的类, 并且继承自 `BaseDispatcher`.

假设我们有以下代码, 并且分别将这些用作 `Event_TestX` 的 Dispatcher.:

```python
class TestDispatcher_1(BaseDispatcher):
    ...

class TestDispatcher_2(BaseDispatcher):
    mixin = [TestDispatcher_1]

    ...

class TestDispatcher_3(BaseDispatcher):
    mixin = [TestDispatcher_2]

    ...
```

那么, 我们将使用这样的行为作为解析时使用的 Dispatcher 的顺序:

```python
broadcast.postEvent(Event_Test3()) # [TestDispatcher_3]
broadcast.postEvent(Event_Test2()) # [TestDispatcher_2, TestDispatcher_3]
broadcast.postEvent(Event_Test1()) # [TestDispatcher_1, TestDispatcher_2, TestDispatcher_3]
```

mixin 允许重复, 这方面不做太多限制, 我相信都看到 Advance 篇了, 你应该算是个聪明的工程师.