# 日志记录

[loguru_api]: https://loguru.readthedocs.io/en/stable/api/logger.html

`Ariadne` 没有使用内置 `logging` 模块, 而是使用 [`loguru`](https://github.com/Delgan/loguru) 进行日志记录.

因为这并非重点, 所以只讲讲最重要的几个方法.

!!! info "提示"

    你可以在 [这里][loguru_api] 找到所有方法, 不过是英文的.

`logger.remove()` 移除所有记录器. (`logger.remove(0)` 移除预配置的 (`sys.stderr`) 记录器.)

`logger.add(sink, ...)` 添加一个记录器. `sink` 可以为 `logging.Handler`, 也可以为一个字符串 (代表文件名). 当然更多参数可以参考 [`API 文档`] [loguru_api].

如果你想要每日滚动日志, 并且自动带上日期之类的格式, 可这样做:

```py
logger.add("{time: YYYY-MM-DD}.log", rotation="00:00", encoding="utf-8")
```

如果你想要在某个日志处理器 (handler) 中过滤某个模块（这里以 graia 的模块举例）：

```py
logger.add("{time: YYYY-MM-DD}.log", rotation="00:00", encoding="utf-8", filter=lambda rec: rec["name"].split(".")[0] != "graia")
```

!!! warning "注意这样做会直接导致 Ariadne 的消息记录对这个 Handler 失效。"

!!! info "Ariadne 启动时使用的 launart 是一个单独的模块，而不是 `graia.launart`。"

这些都不是很重要, 放在这里只是顺口一提.
