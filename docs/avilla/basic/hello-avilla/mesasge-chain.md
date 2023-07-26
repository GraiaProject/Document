消息链 (Message Chain) 是 Avilla 等一系列同类框架/应用使用的，用于表示消息内容的形式。这种形式已经被普遍认同。

Avilla 所使用的消息链实现来自 Graia Amnesia，皆从 `graia.amnesia.message` 导入。

!!! note
    除此之外，消息元素 `Text` 也直接来自 Graia Amnesia。

```python
from graia.amnesia.message import MessageChain
# 也可以直接从 avilla.core 导入
from avilla.core import MessageChain
```

要构建 MessageChain 实例，你也会需要消息元素，查阅以下文档以了解相关事宜；

- [消息链与元素](/avilla/basic/message/chain-and-element.md)
- [文本元素 Text](/avilla/basic/hello-avilla/element-text.md)
- [图片元素 Picture](/avilla/basic/hello-avilla/element-picture.md)
- [Notice / NoticeAll](/avilla/basic/hello-avilla/element-notice.md)

```python
from avilla.core import MessageChain, Text, Picture, Notice

MessageChain([
    Text("..."),
    Text("..."),
    Picture(...),
    Notice(cx.scene.into(...))
])
```

除此之外，消息链中包含了丰富的方法，用于便捷的处理消息链，查阅以下文档以了解相关事宜：

- [消息解析与匹配器](/avilla/basic/message/matcher.md)

同时，官方或是社区也提供了许多工具，围绕消息链提供了命令匹配，参数绑定等功能，查阅以下文档以了解相关事宜：

- [消息链方法](/avilla/basic/message/methods.md)
- [社区：生态系统](/avilla/community/ecosystem.md)
