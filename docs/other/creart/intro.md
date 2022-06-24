# Creart - 介绍

`Creart` 是一款通用, 易于扩展, 实现简洁的类实例化器,
致力于简化 `Graia Project` 中各个部件在单一应用实例中的创建及引用.

PyPI Project: `creart`; `creart-graia`(support for graia)

## 速览

你可以简单的在入口文件中声明使用到的前置部件, 这些部件会通过 `creart` 于其间自动传递:

```py
from creart import create

from graia.broadcast import Broadcast
from graia.scheduler import GraiaScheduler
from graia.broadcast.interrupt import InterruptControl

from graia.saya import Saya

from graia.ariadne.app import Ariadne


create(Broadcast)
create(GraiaScheduler)
create(InterruptControl)

# create(Saya) 会自动启用 Broadcast 与 Scheduler 的支持.
saya = create(Saya)

app = Ariadne(...)  # 自动使用上方通过 create 使用的各式组件


with saya.module_context():
    ...

app.launch_blocking()
```

当我们需要使用已经被 `create` 创造的实例, 除了通过接受返回值外, 直接 `create(...)` 亦是不错的选择.

```py
from creart import it # it 是 create 的简写, 等价于 create

await it(InterruptControl).wait(waiter)

it(Saya).require(...)
```

通过编写 [Creator](./creator.md) 与 [`Entry Point`](https://docs.python.org/zh-cn/3.12/library/importlib.metadata.html#entry-points),
我们也可以为其他的第三方库提供 `creart` 的支持.

```toml
[project.entry-points."creart.creators"]
example = "example_creart:ExampleCreator"
```
