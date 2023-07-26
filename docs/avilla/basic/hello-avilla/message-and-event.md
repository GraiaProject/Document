消息(Message) 是 Avilla 着重支持的交互形式，我们提供了完善的抽象来处理不同平台上的这一行为。

```python
from avilla.core.message import Message
from avilla.standard.core.message import MessageReceived

@broadcast.receiver(MessageReceived)
async def on_message_received(message: Message):
    ...
```

Avilla 在标准化模块(`avilla.standard.core`)中包含了以下事件声明，你可以直接从该模块导入，并通过文档中提供的 API Reference 获取其详情：

- `MessageReceived`: 接收到消息。
- `MessageSent`: 消息发送，可能获取到其他客户端的同步事件。
- `MessageEdited`: 消息被编辑，可能获取到其他客户端的同步事件。
- `MessageRevoked`: 消息被撤回/删除。**无法获取 Message 对象**

消息 (Message) 对象的字段定义如下所示。

```python
class Message(
    id: str,
    scene: Selector,              # 消息所处的场景。
    sender: Selector,             # 消息的发送者，通常也在 scene 范围内。
    content: MessageChain,        # 消息的内容，以 MessageChain 表示。
    time: datetime,               # 消息发送的时刻。
    reply: Selector | None = None # 消息的回复对象，可选。
)
```

注意，消息对象是可以被转换为选择器形式的 (`Selectable`，具备 `to_selector` 方法)，请参考以下示例：

```python
msg = Message(
    id="message-test",
    scene=Selector().land(...).group(...)
)
msg.to_selector()  # => Selector().land(...).group(...).message("message-test")
```

你可以认为 `Selector.last_key` (返回最后一个节点名称的 property) 是 `"message"` 的，
都指向某个 Message。

此外，Message 可以作为 `Metadata` 使用，关于这方面的详情可以参考以下链接：

- [元信息 (Metadata) 基本操作](/avilla/basic/metadata-basic.md)

!!! tip
    如果你希望了解关于消息发送的内容，请参考这里：

    - [发送消息](/avilla/basic/hello-avilla/message-send.md)
    - [消息链与元素](/avilla/basic/message/chain-and-element.md)
