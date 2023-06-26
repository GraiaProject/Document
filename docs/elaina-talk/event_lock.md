!!! note ""
    本文档的灵感来源是 A60, 第一个实现也是由他完成的.

尽管已经有 `launart` 所提供的完善的应用生命周期解决方案, 对于 `Ariadne` 或是 `Avilla` 来说,
有一个对于大规模的应用供应商来说很尴尬的问题: 事件极有可能在应用的 `prepare` 阶段完成前就发出了.

这个问题会导致例如像是数据库的会话这样的应用前置资源的行为无法依照直觉, 也会导致一些事件的监听器无法正常工作,
其原因是现行的 BCC 独立于 `launart`, 而自成立了基于 `asyncio.create_task` 的触发.

那么, 就我的看法, 基于全局 Dispatcher 等注入方案的预先检查是一个比较好的解决方案. 尽管就我来看确有些多此一举, 我可能会在 `Avilla` 中对此进行优化.

思路是这样的, 我们可以在我们做完一些事前, 对于一个 `asyncio.Event` 的状态进行判定;
至于之所以不使用一个简单的 `bool`, 其原因在之后会提到.

```py
class ProcessLocker(Dispatcher):
    event: asyncio.Event

    def beforeExecution(self, interface: DispatcherInterface):
        ... # 我们的逻辑派发处
```

假设 `ProcessLocker` 已经经由 `Broadcast.global_dispatchers` 注入到了应用中,
我们可以开始讨论实际的几种解决方法了.

## 直接丢弃

这是最简单的一种解决方案, 我们可以在 `beforeExecution` 中直接丢弃那些在 `prepare` 阶段之前就被触发的事件.

```py
class ProcessLocker(Dispatcher):
    event: asyncio.Event

    def beforeExecution(self, interface: DispatcherInterface):
        if not self.event.is_set():
            interface.stop()
```

如此, 除非 `event` 已经被 `set`, 否则**所有**的事件都会被丢弃, 这通常是一个不太好的解决方案,
我们推荐通过 BCC 的 Namespace 机制向有限的监听器注入 `ProcessLocker` 实例, 以避免这种情况的发生.

!!! note
    如果只是想要特定类型的事件被 `ProcessLocker` 丢弃, 你可以使用 `interface.event` 进行判定.

    ```py
    class ProcessLocker(Dispatcher):
        event: asyncio.Event

        def beforeExecution(self, interface: DispatcherInterface):
            if not self.event.is_set() and isinstance(interface.event, ...):
                interface.stop()
    ```

## 等住

除了直接丢弃, 我们也可以选择等待, 上文中使用 `asyncio.Event`, 其原因即在于此.

```py
class ProcessLocker(Dispatcher):
    event: asyncio.Event

    async def beforeExecution(self, interface: DispatcherInterface):
        await self.event
```

这样, 我们就可以在 `prepare` 阶段完成之前, 阻塞所有的事件, 但是这样做有一个问题,
当 `event` 被 `set`, 则会导致一个事件处理的高峰, 这可能会导致应用崩溃, 对此, 使用信号量进行节流是一个比较好的解决方案,
也不排除使用 `asyncio.Queue` 进行缓冲的可能性.

这个方案与上文中对于特定事件类型的判定不冲突, 烦请发挥想象力吧.

```py
class ProcessLocker(Dispatcher):
    event: asyncio.Event
    semaphore: asyncio.Semaphore

    def __init__(self, event: asyncio.Event, max_concurrent: int = 10):
        self.event = event
        self.semaphore = asyncio.Semaphore(max_concurrent)

    async def beforeExecution(self, interface: DispatcherInterface):
        async with self.semaphore:
            await self.event
```

如此一来, `ProcessLocker` 就会保证当 `event` 被 `set` 时, 最多只有 `max_concurrent` 个*最小监听器元*被同时执行.

!!! note 关于 `max_concurrent` 与死锁问题
    注意, 当下由于 [GraiaProject/BroadcastControl#61](https://github.com/GraiaProject/BroadcastControl/issues/61),
    如果你的应用过于复杂, 可能会因为 `max_concurrent` 过小而导致死锁, 这个案例很像 `sys.getrecursionlimit`,
    你需要根据你的应用的复杂程度来调整这个参数.
