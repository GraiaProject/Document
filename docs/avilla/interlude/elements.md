# 消息元素

Avilla 内置了许多种常见的消息元素, 如 `Text`, `Notice`, `Picture` 等.

!!! tip `Text` 其实是由 Graia Amnesia 提供.

## Text - 文本

导入: `#!py from avilla.core.elements import Text`

使用:

```py
Text("I'm a text.")
Text(f"I'm a formatted text: {123456}")
Text(f"I'm a text with style setting", style="bold")  # 注意, style 不一定受到平台支持, 也就是说你可能会遇到意料之外的情况, 如完全无效或是效果有差异等.
```

## Notice - 提醒

也常被称为 `At`, 在不同平台有着大致相同的功能.

导入: `#!py from avilla.core.elements import Notice`

使用:

```py
Notice(Selector().group(...).member(...))  # 得是 Selector
```

## NoticeAll - 提醒全员

也被称为 `AtAll`

导入: `#!py from avilla.core.elements import NoticeAll`

使用:

```py
NoticeAll()
```

## Picture - 图像

需要用到资源(`Resource`), 但是可以简单介绍.

导入: `#!py from avilla.core.elements import Picture`

使用:

```py
from pathlib import Path

Picture("./image.png")
Picture(Path("./image.png"))
Picture(LocalFileResource("./image.png"))
Picture(LocalFileResource(Path("./image.png")))
```

可以提供任何 `Resource[bytes]`.

## Audio, Video - 语音与视频

导入: `#!py from avilla.core.elements import Audio, Video`

用法与 Picture 大致相同.

## Unknown - 未知

表示协议实现无法解析的元素, 此时你可以通过访问其 `type`, `raw_data` 属性来提取其信息并处理.
