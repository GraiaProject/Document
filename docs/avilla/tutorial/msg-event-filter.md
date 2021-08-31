---
id: msg-event-filter
title: 筛选消息事件类型
---

在 Avilla 中, 接收到的所有消息都会被解析为 `MessageEvent`,
而当我们不希望一个事件监听器监听例如说好友消息时, 我们就得用上这章提到的东西.

:::tip

如果你还没有阅读过 [Decorator](/docs/broadcast/basic/decorator) 与/或 [Headless Decorator](/docs/broadcast/advance/headless-decorator),
我建议你去读一读, 没什么坏处.

:::

:::note

这章所引用的东西都能在 `avilla.core.utilles.depends` 里面找到.

:::

## 限制为群聊

```python
from avilla.core.utilles.depends import useCtxProfile, useCtx
from avilla.core.builtins.profile import MemberProfile
from avilla.core.entity import Entity

@broadcast.receiver(
    MessageEvent,
    # highlight-next-line
    decorators=[useCtx(Entity), useCtxProfile(Entity, MemberProfile)],
)
async def event_handle():
    ...

```

## 限制为特定群

```python
from avilla.core.utilles.depends import useCtxProfile, useCtx, useGroupInMemberProfile
from avilla.core.builtins.profile import MemberProfile
from avilla.core.entity import Entity

@broadcast.receiver(
    MessageEvent,
    decorators=[
        useCtx(Entity),
        useCtxProfile(Entity, MemberProfile),
        # highlight-next-line
        useGroupInMemberProfile("123", "456", "789")
    ],
)
async def event_handle():
    ...

```

## 限制为好友

```python
from avilla.core.utilles.depends import useCtxProfile, useCtx
from avilla.core.builtins.profile import FriendProfile
from avilla.core.entity import Entity

@broadcast.receiver(
    MessageEvent,
    # highlight-next-line
    decorators=[useCtx(Entity), useCtxProfile(Entity, FriendProfile)],
)
async def event_handle():
    ...
```

## 限制为特定好友

```python
from avilla.core.utilles.depends import useCtxProfile, useCtx, useCtxId
from avilla.core.builtins.profile import FriendProfile
from avilla.core.entity import Entity

@broadcast.receiver(
    MessageEvent,
    decorators=[
        useCtx(Entity),
        useCtxProfile(Entity, FriendProfile),
        useCtxId(Entity, "123456789")
    ],
)
async def event_handle():
    ...

```