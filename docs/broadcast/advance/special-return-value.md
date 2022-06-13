# 特殊返回值

!!! tip

    本章中所有内容均可以在 `graia.broadcast.entities.signatures` 中找到.


## `Force` - 原值直接传递

当一个 `Dispatcher` 返回了一个 `Force` 实例, 则返回其属性 `target` 的值.

```python
return Force(None) # 通常的, None 为一个特殊的值, 用于表示该 Dispatcher 不打算解析当前的参数; 使用 Force 可使 None 作为参数解析的结果被传入.
```

`Force` 接受到一个嵌套时, 会自动解包, 也就是说:

```python
Force(Force("嗯?")) == Force("嗯?")
```

## `RemoveMe` - 尝试移除当前监听器

!!! warning

    `RemoveMe` 的满足需要符合以下条件:

    - 需要 `Listener` 作为执行对象;
    - 需要当前 `Listener` 确实存在于当前 `Broadcast` 实例内.

    否则, 该返回将被忽略, 这方便了你在一些情景下的使用.

返回的必须为一个实例, 也就是说, `return RemoveMe` 是无效的.
