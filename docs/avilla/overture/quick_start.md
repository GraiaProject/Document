# Quick Start

!!! warning 关于生态
    因为一些原因, 截止本文写作时, 仍然只有处于 alpha 发行阶段的 `elizabeth`(mirai-api-http) 与仍然处于 WIP 阶段的 `onebot-v11` 的协议实现可用, 接下来为了聚焦于重点, 我们在此省略关于 `mirai-api-http v2.6.x` 与 `gocqhttp` 的部署叙述, 请读者移步至其他地方获取关于这些部分的详细说明.  
    接下来的文档将使用项目仓库中的最新提交(截止目前是 `48d1545@master`), 代号为 `Elizabeth` 的 `mirai-api-http` 协议实现作为教程的范例.  
    别担心, 我们保证这些说明对于其他实现仍然通用, 只因为这是 Avilla.

## Install

截至目前, 我们仍然需要从源码来源直接安装 Avilla,
但由于这一情况或许会在不久的将来发生改变, 我们也推荐你关注我们的 [PyPI 发布页(core)](https://pypi.org/project/avilla-core).

`avilla-core` 发行版本状况: ![image](https://img.shields.io/pypi/v/avilla-core)  
`avilla-elizabeth` 发行版本情况: ![image](https://img.shields.io/pypi/v/avilla-elizabeth)

注意, 无论是 `0.0.12` 还是 `1.0.0-rc3`, 都是不可用或过时的发行版本.

使用 pdm/poetry/pip 安装:

```bash
pdm add avilla-core avilla-elizabeth
poetry add avilla-core avilla-elizabeth
# 使用 pip 是我们不推荐的方式, 请确保你使用了 VirtualEnv!
pip install avilla-core avilla-elizabeth
```

## 编写实现

注意, 我们假设你已经部署好了版本为 `2.6.x` 的 `mirai-api-http` 实例,
这里不会再述其部署流程, 请前往其他地方获取.

向 `main.py` 中填入以下内容:

```py
from creart import create
from graia.amnesia.builtins.aiohttp import AiohttpService
from graia.broadcast import Broadcast
from avilla.core import Avilla, MessageReceived, Relationship, Selector
from avilla.elizabeth.connection.config import WebsocketClientConfig
from avilla.elizabeth.protocol import ElizabethProtocol

broadcast = create(Broadcast)
avilla = Avilla(broadcast, [
    ElizabethProtocol(
        WebsocketClientConfig("bot-account", "mah-verify-code")
    )
], [AiohttpService()])

@broadcast.receiver(MessageReceived)
async def on_message_received(event: MessageReceived, rs: Relationship):
    if Selector.fragment().as_dyn().group("*").member("master-account").match(rs.ctx):
        await rs.send_message("Hello, Avilla!")

avilla.launch_manager.launch_blocking(loop=broadcast.loop)
```

以上代码片段中, 你需要填入 `bot-account`, `mah-verify-code` 与 `master-account` 三个字段, 且保证你的 mirai-api-http 实例启用了 `ws` 适配器(adapter) 且在 8080 端口上可用.

!!! tip 
    鉴于 8080 是个常用的, 容易被占用的端口, 我们也可以将其替换为其他端口.  
    在样式代码中配置其他的端口, 你需要这样填写:

    ```py
    Avilla(broadcast, [
        ElizabethProtocol(
            WebsocketClientConfig(
                "bot-account", "mah-verify-code",  # 注意替换
                host="http://mah-host:mah-port"
            )
        )
    ], [...])
    ```

启动应用, 当看到以下信息的时候即启动成功:

```
2022-08-26 10:03:41.942 | INFO     | launart.manager:launch:363 - All components prepared, start blocking phase.
2022-08-26 10:03:42.168 | SUCCESS  | avilla.elizabeth.connection.ws:_:66 - Successfully got session key
2022-08-26 10:03:42.169 | SUCCESS  | avilla.elizabeth.connection:register_account:80 - Registered account: <bot-account>
```

使用任一方式 - 无论是群聊, 好友私聊还是临时消息聊天(可能需要在 mirai-api-http 侧配置启用), 你应该都能接收到来自 Avilla 的热情问好.

你应该能注意到, 我们在这一样例中可以同时使用群聊与好友私聊触发,
这虽然也带来根据业务需要约束场合的不便, 但这也是 Avilla 希望带来的改变之一.

这则文档主要是为了希望基于 Avilla 进行开发的开发者而写,
但我们也希望通过展示实例的方式让希望扩展 Avilla 的开发者理解 Avilla 背后的诸多我们暂时无法用言语表述出的思想, 这些思想支撑起了整个 Avilla, 但我们还无法断言这是否会改变一切.

至于余下的部分, 我们会在接下来的章节中细细阐述.