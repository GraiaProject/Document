# 参数装饰器

有时候，我们只希望对一个参数做一些调校，或者是灵活的对多个不同的参数进行特性的加成。这个时候，我不是很建议你使用 Dispatcher 实现这样的 —— 毕竟那样好像要三层还是四层的缩进，不太好啊。。。

所以这时候，我们需要使用接下来所提到的特性 —— 参数装饰器（`Decorator`）。

## 介绍

字面意思上，参数装饰器其实就是以一种灵活的方式对参数进行 “装饰" 的东西。

> 在实际实现中，这项技术通过一个内置的，由 [执行器(Executor)](/docs/broadcast/abyss/executor-and-exectarget) 自动注入到路径的第一个，称为 `DecoratorInterface` 的  `Dispatcher` 实现，且由内部机制保证其被第一个解析。
>
> ~~。。虽然你还是能通过一些黑魔法解决这个问题就是了。~~

要想声明一个 `Decorator` ，我们需要先引入 `Decorator`：

```python
from graia.broadcast.entities.decorator import Decorator
```

然后声明一个类，其继承 `Decorator`：

```python
class ExampleDecorator(Decorator):
    ...
```

声明一个 `target` 方法（不限制是否为异步），接受一个 `DecoratorInterface` ，返回值类型不限制：

```python
async def target(self, interface: DecoratorInterface):
    ...
```

!!! tip

    这里也可以为 `staticmethod`。


这里，我们打算让这个装饰器将原本的返回值处理下 —— 如果类型为 `int` 就递增 `1`，我们这样写：

```python
async def target(self, interface: DecoratorInterface):
    if isinstance(interface.return_value, int):
        return interface.return_value + 1
    return interface.return_value
```

!!! important

    这里必须返回一个值，不然默认将返回 `None`。


然后我们在一个事件监听器里这样写，假设 `a_num` 原本会接受到整数 `2`：

```python
async def event_receiver(a_num: int = ExampleDecorator()):
    print(a_num) # 输出: 3
```

如果我们想让一个参数只受设定的装饰器的影响（通常用于一些 Dispatcher 支持没覆盖到的地方），只需要这样：

```python
class ExampleDecorator(Decorator):
    pre = True
    
    async def target(self, interface: DecoratorInterface):
        ...
```

在这种情况下，原本的值 `interface.return_value` 将为 `None`，但有时候没有 `pre=True` 也会这样，所以如果用到这点，记得做判断（如果你用了什么魔法）

然后，以下是 `DecoratorInterface` 内部接口的说明：

|          名称          | 描述                                                         |
| :--------------------: | ------------------------------------------------------------ |
|         `name`         | 同 `DispatcherInterface` 内同名接口。                        |
|      `annotation`      | 同 `DispatcherInterface` 内同名接口。                        |
|       `default`        | 仅用来占位，值恒为 `None`。                                  |
|     `return_value`     | 若 `pre` 不为 `True`，则该项是本来将返回的值（特别说明：这样的情况下，其他 Dispatcher 获取到的　`default` 将会是 `None`），否则为 `None`。 |
| `dispatcher_interface` | 当前 `DispatcherInterface` 实例，上面的 `name` 和 `annotation` 就是 ref 到这里的。 |

