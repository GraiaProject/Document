---
id: event-and-post
title: 事件与推送
sidebar-title: 事件与推送
---

在 `Broadcast Control` 这里，任何类的实例都可以拿来当事件广播，前提是他们声明了 `Dispatcher`。

然后你就会发现：声明的事件其实并不需要继承 `Dispatchable` —— 那只不过是拿来给 `Broadcast.findEvent` 用的而已，
虽然我还是建议你那样做，毕竟这样可以得到一个新特性。

而关于 `Dispatcher`, 将在下一章介绍，这里仅特地介绍这个项目中的事件触发 API。

通过 `Broadcast` 实例中的 `postEvent`, 传入一个实例就可以了：

```py
event = SomeEvent()
broadcast.postEvent(event)
```

