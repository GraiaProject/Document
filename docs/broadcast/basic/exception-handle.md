---
id: exception-handle
title: 处理错误
---

有时候, 我们需要通过一个统一的接口去接受错误, 除了使用不方便的 `execution_contexts[0]`,
还有一个内置的事件 `ExceptionThrowed`, 用于处理各式错误.

导入 `ExceptionThrowed`:

```python
from graia.broadcast.builtins.event import ExceptionThrowed
```

当创建时, 我强烈建议用这样的格式:

```python
@broadcast.receiver(ExceptionThrowed)
async def error_handler(event: ExceptionThrowed):
    event.exception # 错误本体
    event.event # 错误抛出时处理的事件
```

然后再进行处理.

如果在这里面有错误被抛出, 则该错误不会引起另一个 `ExceptionThrowed` 的抛出, 而是直接打印.