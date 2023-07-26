```python hl_lines="3 9 12 19-21"
import asyncio

from launart import Launart
from graia.broadcast import Broadcast

from avilla.core import Avilla, Context, MessageReceived
from avilla.console.protocol import ConsoleProtocol

broadcast = Broadcast()
launart = Launart()
avilla = Avilla(
    broadcast,
    launart,
    [
        ConsoleProtocol()
    ]
)

@broadcast.receiver(MessageReceived)
async def on_message_received(cx: Context, event: MessageReceived):
    await cx.scene.send_message("Hello, Avilla!")

launart.launch_blocking(loop=broadcast.loop)
```

如上高亮的部分，其作用分别是：

- 导入事件总线
- 创建事件总线实例
- 将事件总线用于创建 Avilla 实例
- 声明监听 `MessageReceived` 事件的事件监听器。

!!! note
    我们自豪的使用 [Broadcast Control](/broadcast/basic/hello-world/) 作为事件总线的实现，这一实现可以以强大的表现力实现丰富的逻辑，我们推荐你参考链接中指向的文档，以及其所指向的其他文档了解更详细的信息。

    以下是 Avilla 文档中提及或说明了 Broadcast Control 的页面：

    - [引言：Broadcast Control](/avilla/advance/intro-bcc.md)
    - [事件监听与优先级](/avilla/advance/event-listen-priority.md)
    - [依赖注入](/avilla/advance/depend-intro.md)
    - [扩展：使用 Filter](/avilla/basic/hello-avilla/filter-basic.md)
    - [过滤器 (Filter)](/avilla/basic/filter.md)

这里我们监听了 `MessageReceived` 方法，当 Avilla 实例上的某个账号收到了一条消息，这一事件就会被触发。

## 监听器中的参数

关于声明函数 `on_message_received` 时所声明的参数，你可以理解为对特定资源的获取，
这种 *声明即获取* 的方法在编写事件监听器时时常使用，
你可以在 [Broadcast Control](/broadcast/basic/hello-world/) 的相关文档中了解详情。

这里，`on_message_received` 可以获取到 [上下文对象](/avilla/basic/hello-avilla/context-basic.md) 与
`MessageReceived` 事件的实例。并进行进一步处理。

## 事件索引

Avilla 提供的核心模块 `avilla.core.event` 与 `avilla.standard.core` 提供所有内置事件的定义，
你可以在我们的 API Reference 页面查询，此外，`avilla.core` 已经为你预先导入了所有的 core 抽象层支持，
此外，对于有一定能力的读者，你也可以参览
[这里](https://github.com/GraiaProject/Avilla/blob/master/avilla/core/__init__.py)，
这可以作为我们提供的内容清单使用。

但注意，我们依旧希望文档是你所需要的唯一参考，所以我们在 [事件总览页面](/avilla/other/events) 同步了这些事件声明的代码内文档字符串 (docstring)，你可以使用现代浏览器的页内搜索功能快速找寻你所需要的事件。

!!! note
    为了能够使用平台上的特有功能（如 Tencent QQ 的头像戳一戳 `Nudge`），
    `avilla-core` 提供 `avilla.standard` 来提供这些功能的统一抽象层，
    如 Tencent QQ 由 `avilla.standard.qq` 提供支持。

    这些模块均作为 [命名空间包](https://packaging.python.org/en/latest/guides/packaging-namespace-packages/) ，可以独立于 `avilla-core` 增补与更新。  
    有些由社区中有能人士维护的平台，其协议实现可能要求同时安装包含 `avilla.standard`
    增补的包，具体情况具体分析，你可能需要额外查询相关的文档记述。
