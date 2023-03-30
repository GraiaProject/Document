# 冷却

> 位置: [`graia.ariadne.util.cooldown`][graia.ariadne.util.cooldown]

该模块提供了 `CoolDown` 类用于方便的实现冷却功能。

`CoolDown` 应该作为一个 `Dispatcher` 被使用.

## 示例

```py
@bcc.receiver(GroupMessage, dispatchers=[CoolDown(5)])
async def handle():
    ...
```

这样即可设置 5 秒为触发间隔, 默认全局共用.

### 获取剩余冷却时间

### 不同的上下文

通过向 `CoolDown` 传入 source 参数，你可以定义不同的冷却上下文。

传入 `str` 时，冷却时间会与同名的 `CoolDown` 实例共享。

### 设置越权条件

### 异常处理

## 手动触发

`CoolDown` 的实例还可以作为 **异步上下文管理器** 使用.
