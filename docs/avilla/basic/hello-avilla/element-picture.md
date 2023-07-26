图片 (Picture) 是 Avilla 提供核心标准化支持的消息元素之一。你需要从 `avilla.core` 或 `avilla.core.elements` 处导入。

```python
from avilla.core.elements import Picture

from avilla.core import Picture
```

Picture 元素需要一个提供类型为 `bytes` 的资源 (Resource)，
最常用的有这两种，都可以从 `avilla.core` 或 `avilla.core.resource` 处导入。

- `LocalFileResource`：指向本地文件。
    ```python
    from pathlib import Path  # 推荐使用 pathlib 处理路径相关。

    # 四种方法等价，皆自动转换为第一种形式。

    Picture(LocalFileResource(Path("D:\\kaf.webp")))
    Picture(LocalFileResource("D:\\kaf.webp"))

    Picture(Path("D:\\kaf.webp"))
    Picture("D:\\kaf.webp")
    ```
- `RawResource`: 直接给出 `bytes`。
    ```python
    Picture(RawResource(b'...'))
    ```

而对于协议实现，情况有所不同。不同的协议实现，根据其对接平台所需的与给出的信息，
协议实现会自行声明各种的资源类。如 OneBot/v11 协议实现就派生了 `OneBot11ImageResource`，`OneBot11FileResource` 等资源类。
在实际情况中，如果需要获取资源本身的详细信息，你有两种方法：一是使用[元信息 (Metadata) 机制](/avilla/basic/metadata-basic.md)，如果资源类型本身支持，也是我们所推荐的方法；二是通过 `isinstance` 类型自省。

获取资源本身的信息，这一需求一般来说并不常见，请保证你知道你正在做些什么！

!!! note
    资源 (Resource) 是 Avilla 对于提供某种类型的资源的抽象，
    其只关心特定类型资源的提供，而不关心其背后的细节。

    你可以在以下文档中找到更详细的信息：

    - [资源对象 Resource](/avilla/basic/hello-avilla/resource-basic.md)
    - [资源 (Resource)](/avilla/basic/resource.md)
