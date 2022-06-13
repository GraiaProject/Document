---
id: 'hello-world'
title: Hello, World!
---

## Installation

首先, 我们需要安装 `graia-broadcast`:

```bash
pip install graia-broadcast
```

使用 poetry:

```bash
poetry add graia-broadcast
```

## Prepare

在程序中导入主实现类 `Broadcast` 和前置标准库 `asyncio`:

```python
import asyncio
from graia.broadcast import Broadcast
```

获取事件循环, 并实例化 `Broadcast`:

```python
loop = asyncio.get_event_loop()
broadcast = Broadcast(loop=loop)
```

由于分发事件的方式是使用 `loop.create_task`, 所以 `Broadcast` 需要依附于一个正在运行的 `loop` 才能使用,
通常你可以通过 `loop.run_until_complete` 或者 `loop.run_forever` 方法运行事件循环.

!!! note

    针对 `Graia Ariadne` 用户: 当你执行 `Ariadne.launch_blocking` 方法时,
    等同于上面的方式.


## Create a Event

导入相关基类:

```python
from graia.broadcast.entities.event import Dispatchable
from graia.broadcast.entities.dispatcher import BaseDispatcher
```

声明一个类，仅需满足以下条件：
 - 包含一继承了 `BaseDispatcher`, 名为 `Dispatcher` 的类声明；
 - 继承 `Dispatchable`，尽管这项在最新版中可选，但还是建议，以保证 `findEvent` 方法可以使用。

```python
class ExampleEvent(Dispatchable):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(self, interface: DispatcherInterface):
            pass
```

若该类继承了 `Dispatchable`，你就可以通过 `Broadcast.findEvent` 方法检查事件声明是否有效：

```python
print(Broadcast.findEvent("ExampleEvent"))
# 传入事件类的名称, 若返回为 None, 则事件声明无效
```

## Ensure a event receiver

通过使用装饰器方法 `Broadcast.receiver` 声明一个事件的监听:

```python
@broadcast.receiver(ExampleEvent) # 传入字符串 "ExampleEvent" 效果一样
async def event_receiver(event: ExampleEvent):
    print("Hello World!")
```

你需要也仅需要声明类型注解为 `ExampleEvent` 就能获取收到的事件的类实例.

这里的 `event_receiver`, 我们称其为 "监听器(Listener)".

## Create and broadcast an event

创建事件就是实例化事件类, 在这里, `ExampleEvent` 只需要简单的实例化就好，
因为也没什么其他的方法。

```python
event = ExampleEvent()
```

然后通过 `Broadcast.postEvent` 方法即可广播事件到监听器:

```python
broadcast.postEvent(event)
```

通过 `asyncio` 的相关接口（比如 run 一个 do nothing 的异步函数）运行程序，将打印一个 `"Hello World!"`.  
很好，你已经运行起来了一个最小最小的，基于 `Broadcast Control` 的程序实例，现在我们将正式开始此行。 

