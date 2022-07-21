# Statv

Statv 是面向 Graia Project 各项目设计的 `Status API` 的实际实现, 包含了一个基于 `asyncio` 和描述器协议实现的状态实体类基类.

PyPI Project: `statv`

## 速览

```py
import asyncio

from statv import Statv, Stats

class ExampleStatus(Statv):
    a = Stats[str]("stats_a")
    b = Stats[int]("stats_b")

    c = Stats[str]("stats_c", default="cc")
    d = Stats[bool]("stats_d", default=False)

    def __init__(self, a: str, b: int, c: str = "cc"):
        super().__init__({
            "stats_a": a,
            "stats_b": b,
            "stats_c": c
        })


async def main():
    stat = ExampleStatus("aaa", 111)
    
    loop = asyncio.get_running_loop()
    def n():
        stat.a = "aa"

    loop.call_later(5, n)

    print(await stat.wait_for_update())

asyncio.run(main())
```

当实例上任何被声明的字段被更改, 所有 `wait_for_update` 都会被触发并推送最新版本的实例.

如果需要同时更改多个字段, 使用 `update_many` 方法. 注意, 传入的字典的键应该为相应的字段 ID, 即实例化 `Stats` 时传入的第一个字符串.

我们预置了名为 `available` 的 property, 默认返回 `True`, 你可以重写该 property.

你亦可以封装 `wait_for_update`, 直接在派生 `Stats` 时声明相应的方法, 并调用 `self.wait_for_update` 方法即可.

所有的内容都存于 `_content` 属性内, 该属性为一 `dict[str, Any]`.

你可以使用 `Statv[...].validator` 审查对应字段上的更改:

```py
@staticmethod
@stats.validator
def _(stats: Stats, past: ..., current: ...):
    ... # some validation
    return current
```

可以使用 `defined_stats` 方法获取所有被声明的字段.