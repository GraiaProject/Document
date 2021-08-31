---
id: message-send
title: 消息类型说明
---

`Avilla` 中内置了多种的大概是平台间都有的一些消息元素(Message Element),
这些消息元素用一个列表有序的排列, 就构成一个消息链(Message Chain):

```python
await rs.exec(MessageSend(MessageChain.create([
    ... # 这里放一堆消息元素就行了
])))
```

关于 `rs.exec`, `MessageSend` 我会在这之后进行详细说明, 在这里,
你就只需要知道这是个样板, 可以拿来发消息.

我们在 `avilla.core.builtins.elements` 提供了多个平台都共有并且 API 基本通用的消息元素,
例如 `Text`(纯文本), `Image`(图片) 等. 我们可以这样导入:

```python
from avilla.core.builtins.elements import Text, Image, ... # 等等等
```

而对于像是 `Image` 这种基于二进制信息的消息元素, 我们有专门的 `Resource API` 与 `Provider API`,
但你现在还不需要了解太多.

接下来, 我们将开始讲解这些消息元素的基本使用方法.

:::tip

这些元素都需要平台及其 Avilla 实现支持, 通常的, 我们会在 `avilla.<protocol>.elements` 下安排平台特有的,
像是 `Dice`, `Face`(OneBot, Tencent QQ) 等, 但我们不建议你直接使用这些,
而是配合 `Ability API` 或者是 `Platform API` 使用, 这些会在后面的章节谈到.

:::

## `Text` - 文本

对于文本没什么好说的, 传入一个字符串就可以了:

```python
Text("I'm a text.")
```

对于某些平台, 可以让 Text 作为类似 `Code`, `Markdown` 这样的方式被具有相应渲染实现的客户端用更具表现力的方式呈现,
为了适配这个功能, `Text` 可以在实例化时将描述这类方式的字符串传入名为 `style` 的参数,
相当于 CSS 或者是 `classname` 一样:

```python
Text("# I'm a markdown title", style="markdown")
```

## `Notice` - 提醒

这个元素其实就是 `@某人`, 很好理解, 但注意, Avilla 使用的 ID 形式**统一**为一个字符串, 所以**不能**传整数什么的,
或许 UUID 用 `UUID.hex` 可以?

这个元素虽然没做太多限制, 但大部分平台都限制这个元素只能在群组消息中使用,
对于筛选群组/好友消息我们会在之后的章节提到这样一种方法.

```python
Notice("1234567890")
Notice(uuid4().hex)
```

## `NoticeAll` - 提醒

提醒一个群组中所有人, 也就是 `@全体成员`, 平台应该会有次数限制, 请注意.

这个元素没做限制, Avilla 不会爆 warning 什么的, 但大部分平台都限制这个元素只能在群组消息中使用,
对于筛选群组/好友消息我们会在之后的章节提到这样一种方法.

```python
NoticeAll()
```

## `Image` - 图像

这里我们可能要多花点笔墨, 因为这牵扯到了 `Resource API` 和 `Provider API`,
我们就在这里做简单的介绍吧.

`Provider API` 提供了一个 `Provider` 基类, 顾名思义, 它可以向外部提供一些东西,
这个东西通常就是 bytes, 而它的内部细节对于外界来说并不重要,
这也就是说, `Provider` 的通用性是很强的.

`Resource API` 提供了一个 `Resource` 基类, 描述一个由 `Provider` 提供的内容(content)
还有一些其他的元数据组成的资源单位(Resource Unit),
外界获取到 Resource 实例, 会根据其元数据和其自身的用途去进行各种操作.

整个过程中都与 `Provider` 的内部细节无关, 实现了一个易用的接口,
也就是 Python 一直很崇尚的 `Duck Typing`.

Avilla 内置了一些 Provider, 实现了从文件系统或者是 `HTTP URL` 获取并提供信息的功能,
这些都在 `avilla.core.provider` 中, 以下是对这些内置 Provider 的列举与说明:

 - `FileProvider`: 从指向一个特定文件的路径 (`pathlib.Path` 或者是 `str`) 读取其内容, 并提供给外部;
 - `RawProvider`: 提供给外部的, 是实例化时给出的一个 bytes 值;
 - `HttpGetProvider`: 简单的从一个 HTTP URL 读取接收到的 bytes, 并提供给外部.

而 `Image` 就是一个继承了 `Resource`, 描述资源的类, 和其他继承了 `Resource` 的类一样,
实例化时接收一个 `Provider`.

了解了这些, 我们就可以用 `Image` 了:

```python
Image(FileProvider(pathlib.Path("./photo.png"))) # 直接用 str 也不是不可以, 但不推荐.

Image(RawProvider(pil_image_bytes_id.read()))

Image(HttpGetProvider("https://img.moegirl.org.cn/common/9/97/%E8%89%BE%E7%BB%B4%E8%8E%89%E4%BA%9A.png"))
```

装进 `MessageChain` 里, 用 `MessageSend` 发送出去, 如果你使用的是样例的第三个, 并且网络通畅, 就有一张可爱的图片出现在聊天窗口了(如果有的话).

而 `Voice`(语音消息) 与 `Video`(视频消息), 其实也是 `Resource` 的基类, 和 `Image` 大同小异,
我也不想在这多费笔墨, 就这样吧.