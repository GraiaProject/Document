文本元素 (Text) 承载了一段纯文本，这在绝大部分平台上都可用。

直接从 `avilla.core`，或是从 `avilla.core.elements` 处导入：

```python
from avilla.core import Text
from avilla.core.elements import Text
```

直接传入一字符串即可：

```python
Text("...")
```

有些协议实现支持在文本上附加特殊样式，Avilla 提供 `Text.style` 作为最基本的支持。

```python
Text.style
#    ^^^^^?: str | None = None
```

在这方面，Avilla 并未提供标准化抽象，你需要根据平台支持与/或协议实现支持调整。

!!! tip
    虽然但是，Avilla 支持根据不同的平台使用不同的逻辑，甚至更进一步，查阅以下文档以了解相关事宜：

    - [使用 Ryanvk 编写多平台逻辑](/avilla/best-practive/ryanvk-cross-platform/)