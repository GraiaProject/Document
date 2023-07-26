提醒 (Notice)，它更常见的名称是 `At/@`。`Notice` 与 `NoticeAll` 都是 Avilla 提供核心标准化支持的消息元素之一。你需要从 `avilla.core` 或 `avilla.core.elements` 处导入。

```python
from avilla.core.elements import Notice, NoticeAll

from avilla.core import Notice, NoticeAll
```

## Notice

Notice 元素，也就是 `@某人`，其构建需要一个 Selector 实例。

```python
Notice(cx.client)

Notice(cx.scene.into("~.member", member=...))
```

!!! note
    我们推荐同时配套 `Selector.follows` 与 `Selector.into` 方法使用。

    你可以在以下文档中找到更详细的信息：

    - [选择器对象 Selector](/avilla/basic/hello-avilla/selector-basic.md)
    - [选择器概述与基本操作](/avilla/basic/selector-further.md)

## NoticeAll

通常需要账号在群组里具有一定权限，否则有可能抛出 `PermissionError`。在不同的平台上可能有不同的限制，如 Tencent QQ 要求一天使用量不能超过 10 次。

实例的构建不需要参数。

```python
NoticeAll()
```
