!!! note
    截至写作时间（2023/7/24），Avilla 的 **任一** 官方组件都尚未在 PyPI 上正式发布。
    因此，以下提及内容的前提为在理想情况下。

!!! tip
    可喜可贺，Avilla 及其文档目前致力于致力于提升使用体验，所以我们会尽可能的让文档记录详尽。

想要运行 Avilla ，你至少需要安装 `avilla-core`。

```
# 使用 PDM （推荐）
pdm add avilla-core

# 使用 Poetry
poetry add avilla-core

# 使用 pip
# 注意，为了减少对宿主机环境的污染，强烈建议同时使用虚拟环境 (virtualenv)
pip install avilla-core
```

我们建议同时安装 [`avilla-console`](/avilla/other/deploy-protocols)，
该包可用于在当前控制台页面展示用于调试的模拟聊天页面，是目前为止最容易配置的协议实现。
但如果有其他的考虑（如已经具备预配置好的环境），也可以不选取。

```
# 使用 PDM （推荐）
pdm add avilla-console

# 使用 Poetry
poetry add avilla-console

# 使用 pip
# 注意，为了减少对宿主机环境的污染，强烈建议同时使用虚拟环境 (virtualenv)
pip install avilla-console
```

!!! note
    协议实现是一种与 Avilla 协同的实现，可以能让 Avilla 具备某些能力，使其可以适配需要**直接**交互操作来操作的各种服务与协议。
    如果谋求深入了解，你可以在阅读完基础章节后，在以下文档中找寻信息：

    - [深入调查：协议](/avilla/advance/protocol-account.md)
    - [平台信息 (Platform)](/avilla/advance/platform.md)
    - [多平台特性：初识特性标准化 (Standards)](/avilla/advance/standards-intro.md)

此外，作为官方，我们亦提供了为数众多的官方协议实现，以下为一部分的列举：

- [OneBot11 - miraigo/gocqhttp](/avilla/other/deploy-protocols/miraigo.md)
- [Elizabeth - mirai-api-http](/avilla/other/deploy-protocols/mah.md)
- [Red - BetterQQNT/RedProtocol](/avilla/other/deploy-protocols/red.md)
- [QQGuild (Official)](/avilla/other/deploy-protocols/qqguild-official.md)

你可以在链接的文档处找寻更多详细信息。

在下一篇，我们将围绕 `avilla-core` 与 `avilla-console` 搭建起一个可交互的最小实例，并将在接下来的许多篇章中一步步解释，辅助你理解 Avilla 的使用方法。
