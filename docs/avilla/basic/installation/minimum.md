在上一章中，我们安装了 `avilla-core` 与 `avilla-console`，在这一章中，我们将给出一段代码，并以总括的形式解释这段代码干了什么。

```python
import asyncio

from launart import Launart
from graia.broadcast import Broadcast

from avilla.core import Avilla, Context, MessageReceived
from avilla.console.protocol import ConsoleProtocol

broadcast = Broadcast()
launart = Launart()
avilla = Avilla(broadcast, launart, [ConsoleProtocol()])

@broadcast.receiver(MessageReceived)
async def on_message_received(cx: Context, event: MessageReceived):
    await cx.scene.send_message("Hello, Avilla!")

launart.launch_blocking(loop=broadcast.loop)  # 启动应用
```

当你启动应用，你理应会在控制台发现以下界面：

![svg](/avilla/assets/img/minimum-terminal.svg)

如果我们试着，在左侧下方的输入框内输入些什么，然后摁下回车……：

![svg](/avilla/assets/img/console-hello.svg)

太棒了！于昏暗 (?) 的世界中，Avilla 成功的发出了第一声啼鸣！

可别小瞧了这段代码，基础章节，甚至进阶篇章中的大部分都以这段为基板进行不同程度的扩展，这也是你会碰到的最常见的用户界面。

!!! note
    Avilla 由 Launart 与 Graia Amnesia 负责应用实例生命周期的管理，
    上方代码示例中最后一行即是启动 Launart 的主进程。  

    Launart 具有强大的功能，你可以在以下文档中获取更多信息，
    但还是建议先将 Avilla 了解个大概后再去：

    - [Launart](/other/launart/)

## 接下来做什么

接下来，你可以尝试 [配置其他协议端](/avilla/other/deploy-protocols/)；
也可以先继续阅读文档的剩余部分，探索 Avilla 所具备的诸项特性与功能；
同时，你也可以探索 [生态系统](/avilla/community/ecosystem)，找寻社区中有趣的千奇百怪，不过，记得要仔细阅读文档中的相关说明，遇到问题要善用搜索功能，或者你也可以 [抱持良好的态度](https://lug.ustc.edu.cn/wiki/doc/smart-questions/) 寻求 [社区](/avilla/community/intro) 的帮助。

我们并不面向毫无基础的读者，也为了节省篇幅，我们不会在文档中过多的解释 *发生了什么* ，相对的，我们提供详尽的描述与必要的指示。

!!! tip
    这里是一些有用的链接，有助于你理解上面给出的代码片段。  
    此外，也欢迎使用本站的搜索功能。

    - [引言：Broadcast Control](avilla/advance/intro-bcc)
    - [事件监听器](basic/hello-avilla/listen)
    - [上下文对象 Context](basic/hello-avilla/context-basic)
    - [消息与消息事件](basic/hello-avilla/message-and-event)
    - [发送消息](basic/hello-avilla/message-send)
  