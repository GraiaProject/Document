# 消息的接收与发送

本章简单阐述以下内容:

 - `MessageReceived` 事件的应用
 - 关系对象 `Relationship` 的说明
 - 选择器 `Selector` 的简单说明
 - 辅助筛选器 `Filter` 的简单使用

## MessageReceived 事件

于序曲中, 我们有对 `MessageReceived` 事件的初步认识,
本节将继续阐述其各项特性, 并简单介绍 Avilla 中的主要操作接口: 关系对象 `Relationship`.

将目光聚焦于序曲中我们所给出的代码片段.

```py
@broadcast.receiver(MessageReceived)
async def on_message_received(event: MessageReceived, rs: Relationship):
    if Selector.fragment().as_dyn().group("*").member("master-account").match(rs.ctx):
        await rs.send_message("Hello, Avilla!")
```

`MessageReceived` 事件表示应用实例接受到来自某个平台的消息.
而为了后续指代方便, 我们将像是 QQ, Discord, Telegram 这种称为 `Land`.
通常的, MessageReceived 会包含消息的内容, 接受到消息的账号, 事件发生或是接受事件时的时间这些信息.
消息的内容则包含消息的发送者, 消息是在哪里被发送的, 其所回复的另外一条消息(以 Selector 表示)等充分的信息. 关于其字段名称等信息请参阅 [avilla.core.event.message.MessageReceived]

## 关系对象 Relationship

当接受到一条消息后, Avilla 会自动解析当前接受到消息的账号与消息发送者的关系,
将其总结为 `Relationship` 对象. `Relationship` 对象也是开发中最常见的操作接口.

`Relationship.ctx`, 即片段中的 `rs.ctx`, 我们可以根据上下文给出其定义,
因此其被称为 "上下文对象".  
`Relationship.mainline` 表示 Avilla 解析到的上下文场景, 在此举个简单的例子吧, 如果 `rs.ctx` 指代的是群员, 那么 `rs.mainline` 就会指向群员和账号所在的群组, 以此类推.  

### 选择器 Selector

无论是 `ctx` 还是 `mainline`, 他们都采用了 `Selector` 的方式表示.

> 选择器对象是 Avilla 设计中所采用的概念 "对象与数据分离" 的体现, 但在此不做过多介绍.

一个选择器通常是这样的:

```py
Selector().group("...").member("...")
```

作为人类, 我们可以很直观的认识到这样一个选择器所指代的对象, 即 "群员",
而 Selector 还包含了机器可读的特性. 这个选择器可以被视为这样一个字典: `#!py {"group": "...", "member": "..."}`,
由于 Python 中的字典是有序的, 所以 Selector 所包含的信息可以在这两种表达方式间随意转换.

因其具有独特的数据结构, Selector 有着一套复杂的匹配方式, 这将会在后续章节中谈到.

关系对象不仅用于向开发者暴露上下文, 还用于对于不限于上下文对象和上下文场景的操作.
如片段中我们使用 `rs.send_message` 发送了消息, 这项功能的背后是由 `Trait & Fn` 系统提供支持, 同样这套系统亦会在后续章节中细细阐述.

## 发送消息

`rs.send_message` 支持以字符串(`str`), 消息元素(`Element`), 消息元素列表(`list[Element]`), 消息链(`MessageChain`)作为需要发送的消息内容. 消息链的实现由 Graia Amnesia 提供支持.

```py
await rs.send_message("字符串消息")
await rs.send_message(Notice(rs.ctx))  # @rs.ctx, 也通常被称为 At 的消息元素
await rs.send_message([Text("消息元素列表"), Notice(rs.ctx)])
await rs.send_message(MessageChain(...))
```

### 回复消息

如果平台支持, 在调用 `rs.send_message` 时, 可以指定回复的消息.
回复消息需要一个指向消息本身的选择器 Selector, 你可以通过 `#!py MessageReceived.message.to_selector()` 获取接收到的消息的选择器表达形式.

```py
await rs.send_message(..., reply=event.message.to_selector())  # 注意, "reply=" 不能舍去.
```

## 筛选消息类型

由于 `MessageReceived` 事件承载群聊, 私聊等方式的消息, 开发者有需求对消息进行筛选.
在这方面, Avilla 提供了 `Filter` 作为辅助.

```py
from avilla.core.tools.filter import Filter

@broadcast.receiver(MessageReceived, dispatchers=[
    Filter.rs().ctx.follows("group.member")  # 仅对 rs.ctx 为 group.member 时可用.
    Filter.rs().mainline.folllows("group=...")  # 仅在 mainline 为 group=... 时可用.
])
async def on_message_received(event: MessageReceived, rs: Relationship):
    if Selector.fragment().as_dyn().group("*").member("master-account").match(rs.ctx):
        await rs.send_message("Hello, Avilla!")
```

[avilla.core.tools.filter.Filter] 还有很多功能, 在此希望读者能自行前去了解.
