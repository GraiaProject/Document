资源 (Resource) 是 Avilla 对于提供某种类型的资源的抽象，
其只关心特定类型资源的提供，而不关心其背后的细节。

通常，我们使用 `Context.fetch` 方法来拉取资源内容。

得益于 typing，你可以在这方面得到更优秀的自动补全。

```python
a = await cx.fetch(LocalFileResource(...))

# LocalFileResource <: Resource[bytes]
reveal_type(a) # => bytes
```

## 元信息

对于 Resource，如果其实现了 `to_selector` 方法，则可以通过 `Context.pull` 或是 `Staff.pull_metadata` 方法获取一个资源类实例的 Metadata。

你可以在以下文档中找到更详细的信息：

- [元信息 (Metadata) 基本操作](/avilla/basic/metadata-basic.md)
- [手杖 (Staff)](/avilla/advance/ryanvk/staff.md)

!!! warning
    对于不同的协议实现，根据其对接平台所需的与给出的信息，
    协议实现会自行声明各种的资源类。如 OneBot/v11 协议实现就派生了 `OneBot11ImageResource`，`OneBot11FileResource` 等资源类。
    在实际情况中，如果需要获取资源本身的详细信息，你有两种方法：
    一是使用[元信息 (Metadata) 机制](/avilla/basic/metadata-basic.md)，
    如果资源类型本身支持，也是我们所推荐的方法；
    二是使用 `isinstance` 类型自省。
