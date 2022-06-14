# Channel - 模块频道

在 `Saya` 中, 每个被导入的模块都会被分配一个独一无二的 `Channel` 实例,
除了在 `Quick Start` 一章中粗略介绍的 `Channel.use` 方法外, 我们还提供了其他的属性与特性.

## `Channel.meta`

`Channel.meta` 的类型 `ChannelMeta` 被声明为一个 `TypedDict`,
这意味着你能通过继承 `ChannelMeta` 来扩展可以在 `Channel.meta` 上使用的字段.

```py
class ExtendedMeta(ChannelMeta):
    example: str

channel = Channel[ExtendedMeta].current() # type: Channel[ExtendedMeta]

channel.example = "example"
```

## `Channel.{name, author, description}`

这三者皆为方法, 与 `Channel.meta["name"]`, `Channel.meta["author"]`, `Channel.meta["description"]` 一一对应,

需要注意的: `author` 方法的具体行为为附加, 你可以以此来描述多个作者.

```py
channel.name("plugin_example")

channel.author({ "name": "GreyElaina", "email": ... })
channel.author({ "name": "BlueGlassBlock", "email": ... })
channel.author({ "name": "???", "email": "witch_stellaium@witch.org" })

channel.description("Example Plugin for Saya")
```

## ScopedContext

!!! warn
    该特性尚处于 `experiment`(实验性) & `work-in-process`(半成品) 阶段, 请**不要**在实际开发中使用.  

`ScopedContext` 旨在改善模块内运行时数据的共享与存储.

```py
@channel.scoped_context
class Scoped1:
    a: str = "1"

    @channel.use(ListenerSchema(...))
    async def n1(self):
        self.a = "2"
    
    ...
```

被接管的数据在 `reload` 前后都不会失效, 其生命周期与 `Channel` 一致, 但极可能引发未定义行为.

我们可能会在之后将这个特性删除并重新迭代设计.
