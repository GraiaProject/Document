---
id: dispatchable-with-schema
title: 使用模型(Model)
sidebar-title: 使用模型(Model)
---

从原理上来说, `Dispatchable` 可以描述**任何**包含一 `Dispatcher` 类属性的类声明,
这意味着我们能配合 `pydantic`, `dataclass` 之类的方便事件实例的构建.

在实际实现中, 我们只需要简单的继承 `Dispatchable`,
如果是 `pydantic` 就再继承 `BaseModel`, 如果是 `dataclass` 就直接 `@dataclass`,
我们的 `Dispatchable` 只在乎它有没有声明 `Dispatchable`,
所以这种做法是被允许的.

```py
class TestEvent1(Dispatchable, BaseModel):
    a: int
    b: str

    class Dispatcher(BaseDispatcher):
        ...

@dataclass
class TestEvent2(Dispatchable):
    a: int

    class Dispatcher(BaseDispatcher):
        ...

broadcast.postEvent(TestEvent1(a=1,b="2"))
broadcast.postEvent(TestEvent2(1))
```
