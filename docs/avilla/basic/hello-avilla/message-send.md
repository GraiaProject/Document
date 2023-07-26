```python
@broadcast.receiver(MessageReceived)
async def on_message_received(cx: Context, event: MessageReceived):
    await cx.scene.send_message("Hello, Avilla!")
```

这段代码使得应用在接收到 **任何消息** 时，都会发送文本消息 `"Hello, Avilla!"`。

!!! warning
    当要发送/回复一项消息时（消歧义：并非使用 `reply` 具名形参），请确保你知道你在做什么。
    根据[这篇文档](/avilla/basic/hello-avilla/message-and-event.md)中关于 `scene` 与实际逻辑关系的解释，我们给出以下建议：

    - 当你要简单的回复一条消息时，使用 `cx.scene.send_message`；
    - 当你要给对方发送**私聊消息**时，使用 `cx.client.send_message`；
  
    同时，我们也提醒您注意 Selector 内容对于回复方式的影响，这里以 Tencent QQ 为例：

    - 当选择器为 `::group.member` 时，发送群组临时消息（`TempMessage`）；
    - 当选择器为 `::friend` 时，发送好友消息。

    如群组临时消息需要在**同一群组**，且协议端开放这一功能；好友消息需要账号与对方具有好友关系，请注意这方面所存在的隐性限制。

## 发送消息的方法

根据原声明，我们得到 `ContextSelector.send_message` 的声明如下：

```python
async def send_message(
    self,
    message: MessageChain | Iterable[str | Element] | Element | str ,
    *,
    reply: Message | Selector | str | None = None,
) -> Selector
```

其中，`message` 是发送消息的内容，而具名形参 `reply` 则表示需要回复的消息。
`reply` 在不同的协议实现上的行为可能会有所不同，请参考相应协议实现的所附文档。

!!! note
    `reply` 参数需要使用形似 `send_message(..., reply=...)` 的方式给出。

发送消息的内容可以是字符串，单个消息元素，消息元素的迭代器(Iterable)，以及他们最后的转换结果，消息链 `MessageChain`。

关于消息链与消息元素，请参阅[这篇文档](/avilla/basic/message/chain-and-element)。

如使用该方法发送成功，则返回一选择器，指向发送的消息。同时在协议端和/或协议实现允许的情况下会广播 `MessageSent` 事件，但注意，该行为在不同的协议实现/协议端配置的情况下 **可能不一致**。

## 回复消息

回复消息的方式是使用 `reply` 具名形参，`send_message` 方法支持以下类型的传入，他们最终被转换为对应消息的选择器。

- `Message`：Message 的实例。
- `Selector`: 指向某个消息的选择器，如果不加以限制可能引发错误。
- `str`：**不安全** ，等价于当前场景 (scene) 下的 `scene.message(<reply>)`。

如不给出 `reply` 的值，或是传入 `None`，则不回复任何消息。

!!! warning
    这在例如使用 Tencent QQGuild Official 协议实现，存在协议端束缚的情况下可能无法发送消息。
