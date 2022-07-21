---
id: interrupt
title: 中断
sidebar-title: 中断(Interrupt)
---

有时候, 你可能需要处理一些交互式的操作, 像是等待一个 `FileUploadSuccessfully` 的事件来获取其内容,
这时候你可以考虑使用我们的 中断(Interrupt) 特性.

首先我们需要一个 `InterruptControl` 实例, 用于生成内部使用的一些东西以及接受并传回结果.

```python
from graia.broadcast.interrupt import InterruptControl

inc = InterruptControl(broadcast)
```

让我们假设, 客户端需要先将当前的 Session 的模式转换为上传图片, 服务端在收到请求后指示客户端上传图片文件数据.  
一般来讲是这样写的:

```python
@bcc.receiver(WebsocketDataReceived, decorators=[
    Endpoint("set_mode_upload")
])
async def set_mode_upload(session: Session = getCurrentSession()):
    session.stats['mode'] = 'upload'

@bcc.receiver(WebsocketDataReceived, decorators=[
    DataType(bytes)
])
async def upload(session: Session = getCurrentSession()):
    if session.stats['mode'] == 'upload':
        ...
```

那, 有没有更加简单的办法? `Interrupt` 就是拿来消灭这种 "勤劳" 的设计的, 毕竟懒惰是工程师的美德.

```python
@bcc.receiver(WebsocketDataReceived, decorators=[
    Endpoint("upload")
])
async def upload(session: Session = getCurrentSession()):
    @Waiter.create_using_function([WebsocketDataReceived], decorators=[DataType(bytes)])
    def waiter(received: bytes = Received.toBytes(), sub_session: Session = getCurrentSession()):
        if sub_session == session:
            return received
    
    received_resource = await inc.wait(waiter)
    resource = await database.save(Resource.create_from_bytes(received_resource))
    return {
        "id": resource.id,
        # ...
    }
```

很好, 这段代码虽然比上面那段要长一点点, 但维护起来应该是更容易的, 并且也方便加上各种校验什么的.  

在这段代码中, 我们使用 `Interrupt`, 从当前正在运行的流程切出, 并等待客户端上传数据, 也就是 "交互".

而差不多有一年了吧? 无数的实例都在说明 `Interrupt` 在处理 **交互式** 的流程处理时, 有着很大优势,
这差不多就像 JavaScript 中将 `Promise(...).then(...)` 的回调地狱换成 `async-await` 一样.

或者, 更进一步, 我们造了一个多用户/多房间的游戏, 我们便可以直接将一个房间/频道/作战地图/会话直接通过单个的处理器进行处理,
而不用去设立繁杂的状态和判断, 这还可以用于各种各样需要频繁交互的, 比如说

 - 使用了多 BOT 账号的 Arcaea 的查分器, 配合一个资源池去简单的处理;
 - 需要填的选项太多而需要不断问询用户的应用;
 - 服务端处理用户, 抑或反过来, 用于双方并行处理并共享各种各样的消息/情报等.

同时, 因为 `Interrupt` 使用了经过高层封装的 `Executor`, 所以 `Dispatcher`, `Decorator` 等等特性也可以一并使用,
你就简单的当个可以向上层返回结果的事件接受器, 这样理解也是没问题的.

这个特性的应用相当广泛, 限制它可能性的也许只有想象力吧.

!!! tip
    在 Graia Ariadne 的文档中也有对于 `Interrupt` 这一特性的阐述, 另见[此处](../../ariadne/extra/broadcast/interrupt.md)