上下文对象 (`Context`) 是你大部分情况下接触到的统一用户接口，其提供一致的信息，字段，方法，
提供 Avilla 在任一事件或场景下所获得到的所有信息。

## 上下文包含的信息

上下文可以用来描述 **某人** 在 **某地** 对 **某人/物** 做了什么，也可以描述一人与另一人间的关系，
在上下文对象中包含了以下字段：

- `Context.client`：做了什么事，或是被选中的，行为趋向上 *偏主动* 的某人。
- `Context.endpoint`：被做了什么事，或是相对 `client`，*偏被动* 的某人。
- `Context.scene`：上下文所处的场景。
- `Context.self`：在 `scene` 中，当前账号的 *指向*。
- `Context.mediums`：在 `client` 与 `endpoint` 间存在的中间介质，比如 **邀请人**。

这些信息足以以一种完善的方式向开发者提供信息，通过 Python 的各式高级特性，
也能做到像 `cx.scene.send_message` 这种简洁的表示。

这些字段都是 [选择器 (Selector)](/avilla/basic/hello-avilla/selector-basic)，
简单来说，就是对实际对象的一种直观的指代方式。你需要从前文中包含的链接文档了解更多，
这里给出一个浅显的例子。

```python
Context.client = Selector().land("qq").group("941310484").member("1846913566")
#      实例化对象 ^^^^^^^^^^^

Context.scene = Selector().land("qq").group("941310484")
#                  指代路径 ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Context.endpoint = Selector().land("qq").group("941310484")
#                     节点名称 ^^^^   &   ^^^^^

Context.self = Selector().land("qq").group("941310484").member(...)
#                       节点值  ^^^^    &   ^^^^^^^^^^^    &    ^^^
```

## 使用

Context 包含以下方法，分别调用 Avilla 的多种抽象功能，你可以在列表项所指向的相应文档中了解详情。

- `Context.fetch`: 拉取资源内容，详见 [资源对象 Resource](/avilla/basic/hello-avilla/resource-basic)
- `Context.pull`: 拉取对象元数据，详见 [元信息 (Metadata) 基本操作](/avilla/basic/metadata-basic)
- `Context.query`: 枚举特定对象，详见 [查询 (Query)](/avilla/basic/query)

此外，为了方便调用，Context 可以有选择的创建 `ContextSelector`，这是一个 Selector 的子类，
用于快捷的在 Selector 上调用各种 Context 功能。

```python
# prefer this...
cx.scene.pull(Summary)

# than this...
cx.pull(cx.scene, Summary)
```

你可以通过这种方式快捷的获取 ContextSelector 实例：

```python
selector = Selector()#.<k>(v) ...
cx[selector]  # -> ContextSelector
```

!!! warning
    我们不推荐直接通过实例化 `Selector` 的方式创建 `ContextSelector`，
    这容易带来信息的不完整，如 `land` 等字段的遗漏。

    ```python
    # 这样……不太好。
    cx[Selector().member(...)]
    cx[Selector().group(...)]
    cx[Selector().file(...)]
    ```

    更好的办法是使用 `Context.into` 方法，这会有效的避免这种情况。

    ```python
    # "::" 是对 "land" 的缩写，上下这两种方法等效。
    cx.scene.into("::group.member(...)")
    cx.scene.into("land.group.member(...)")

    # 你也可以使用 "~"
    cx.scene.into("~.file(...)")

    # 可以使用 kwargs 传参的方式保护表达式不被注入，kwargs 的优先级较字符串内的更高。
    cx.scene.into("~.group(111)", group="222")  # => group(222)
    ```

除此之外，`cx[...]` 操作还对 Ryanvk Fn 适用，
如 `cx.scene.send_message` 其实等同于以下代码：

```python
from avilla.standard.core.message import MessageSend

cx[MessageSend.send](cx.scene, ...)

# 对于 ContextSelector，相当于使用了 functools.partial。
cx.scene[Message.send](...)
```

对于 `avilla.standard.core`，内置的方法已经尽可能完全覆盖，
但如果要调用像 `Nudge` 这样的功能，就需要使用这种方法。

你可以在以下文档处了解相关详情：

- [Fn 的初等使用](/avilla/advance/ryanvk/fn-basic)
- [上下文 (Context) 解读](/avilla/advance/context-detail)

!!! tip
    通常的，`AvillaEvent` 及其派生子类 (eg. MessageReceived) 都可以直接获取 Context...

    `AvillaLifecycleEvent`，即描述了像应用实例可用，应用实例将下线等与 **生命周期** 相关的事件，
    当你接受此类事件时，将没有相应的上下文对象提供。

    你通常需要以这样的方法获取事件实例本身，这里以 `ApplicationReady` 为例：

    ```python hl_lines="4"
    from avilla.core import ApplicationReady

    @broadcast.receiver(ApplicationReady)
    async def on_app_ready(event: ApplicationReady):
        # 请勿遗漏 event 的类型注解: ^^^^^^^^^^^^^^^^
        ...
    ```
