```python hl_lines="7 15"
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

在这个代码块中被高亮的部分，是被我们普遍称为 **协议配置** 的环节。

!!! tip
    此处会提及多个术语，除了使用搜索功能，你也可以直接查询我们提供的 [术语表](/avilla/glossary.md)。

协议配置是每个 Avilla 应用所需要的，该步骤使得 Avilla 实例能够具备对接各种不同的服务，是平台 (Platform) 或是账号 (Account)，或是在这之上的各种实体，总之，协议配置利用协议实现使得 Avilla 实例能与这些事物接触并发生交互。

不同的协议实现通常会要求不同的协议配置，通常负责任的维护者会相应的附上文档，比如你可以在 [这里](/avilla/other/deploy-protocols/) 找到 Graia Project 提供的协议端适配官方文档。

!!! note
    注意区分 Avilla *实例* 与 Avilla。

    - Avilla 实例：专指 `avilla.core.application.Avilla` 类的实例。
    - Avilla：可以指代整个应用，亦可用于指代 Avilla 框架/支持库/体系本身。

    我们会尽可能保证文档中的相关词句不会造成混淆。
