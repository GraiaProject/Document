---
id: proxy-mode
title: 代理模式(Proxy Mode)
sidebar-title: 代理模式(Proxy Mode)
---

:::tip

关于这里所提到的 Dispatcher 的调用顺序问题, 简单的答复你可以参考 [dispatcher-mixin](docs/broadcast/advance/dispatcher-mixin) 一章, 如果需要更详细的, 记住一句话, 这句话也是我们在开发时遵循的规范:

局部先于全局, 有既是有, 无既是无.

:::

我们在上一章中简单的提到了 Dispatcher 的调用顺序问题, 那么, 我们便可以利用这点, 在调用顺序更优先的 Dispatcher 内获取到本应在事件监听器里才能获取到的值.

一般的, 我们的 Dispatcher 是长这样的:

```python
class TestDispatcher(BaseDispatcher):
    mixin = [...]

    async def catch(self, interface: DispatcherInterface):
        ...
```

顶多也就是当作为事件本身提供的 Dispatcher 的时候, `catch` 方法是个 `staticmethod` 而已.

那么, 我们在上一章, 所提到的 `mixin` 机制, 在实际使用时, 偶尔也会有 "需要重载行为" 的需求, 那么, 我们又不想 copy & paste, 也不想将这些 mixin 分割成更小的单元, 我们就可以用上 `DispatcherInterface` 里用到的一些方法.

:::tip
这里, 我想我不免的要提上一嘴. 我的作品足够聪明, 不需要你去关心 "欸这样会不会丢掉 Fastest Path 啊" 这样的问题, 尽管你可能完全不知道这里说的 "Fastest Path" 是什么, 这就是一个极其卓越的优化机制而已, 现在的性能大多托此所赐.
:::

使用 `DispatcherInterface.lookup_param` 方法, 即可模拟对实际参数的解析.

```python
await interface.lookup_param(
    "_what_is_me", str, None
)
```

这里的参数, 从左到右分别是 **名称**, **类型注解** 和 **默认值**.

:::warning
无论如何, 除非你用了某种魔法, 否则你不应该能在这里使用 `Decorator`.
:::

这样, 你就能够获得你想要的值, 对其进行包装后扔到外面去, 也就是 `return` 出去.

:::tip
其实, 你也不必扔外面, 但这可能会让某个 Dispatcher 被调用两次, 造成内存泄漏, 所以我建议你还是多做推理, 以避免出现这样的情况. 人胜过机器的永远是方法这方面.......吧?
:::

如果你要丢一个可能会被当作特殊处理的对象, 比如说 `None`, 你可以使用 `Force`.

```python
from graia.broadcast.entities.signatures import Force

return Force(None)
```

对于我们来说, `Force(Force(None))` 就等同于 `Force(None)`, 这有助于避免用到一些奇怪的, 非常难以维护的魔法.
