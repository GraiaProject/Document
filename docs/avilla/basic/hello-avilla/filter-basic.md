在 Avilla 中，所有的消息接收事件，除了自己发送的消息（`MessageSent`），都是通过 `MessageReceived` 事件获取到的。
而我们经常会有需要监听群组，好友消息等的需求，推广一下，我们也会有各种筛选事件内容的需求，
在 Avilla 中，你可以使用 `Filter` 实现这一功能。

`Filter` 类位于 `avilla.core.tools.filter`，你需要导入以使用：

```python
from avilla.core.tools.filter import Filter
```

!!! note
    Filter 基于 Broadcast Control 的 Dispatcher 特性实现，
    这是相当强大的特性，我们基于其实现了 [依赖注入](/avilla/advance/depend-intro)，而且 —— 它本身也是一种依赖注入！

    如果想要了解，建议阅读以下文档：

    - [参数解析器](/broadcast/basic/dispatcher)
    - [参数解析器的生命周期](/broadcast/basic/dispatcher-lifecycle)


## 基础使用

根据前文，我们得知 [Context 对象](./context-basic.md) 包含了很多信息，并且支持通过声明参数的方式获取。
这对于 Filter 来说真是难得的好事。

Filter 可以通过这样的方式判断 `Context.client` 是否满足模式 `::group.member`：

```python
@broadcast.receiver(MessageReceived, dispatcher=[
    Filter.cx.client.follows("::group.member")
])
async def on_message_received(cx: Context):
    ...
```

这段代码等价于：

```python
@broadcast.receiver(MessageReceived)
async def on_message_received(cx: Context):
    if cx.client.follows("::group.member"):
        ...
```

这样的写法能显著减少主体逻辑的复杂度，而且其支持组合逻辑。

```python
not_ = lambda x: lambda y: not x(y)

@broadcast.receiver(MessageReceived, dispatcher=[
    Filter.cx.client.all(
        valid_access,
        service_alive,
        validated_user,
        not_(banned),
        ...
    )
])
async def on_message_received(cx: Context):
    ...
```

具体提供了的运算符方法可以参考我们提供的 API Reference。
