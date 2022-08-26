# Avilla: The next-generation framework for IM-development & More.

Avilla 是 Graia Project 继 Graia Ariadne 后推出的新一代框架设计与其实现, 其具有以下突出特性:

- **原生跨平台**: 开创性的 Relationship 操作模型, 配合最小功能单元, 行为扩展等诸多独特设计, 无论是简单的消息收发还是平台设计的独特交互, Avilla 都能处理地得心应手.
- **原生多账号**: Avilla 在设计之初, 就考虑了同时管理多个账号, 甚至是多个平台上的多个账号这些问题, 并加以研究与解决. 而现在, 账号管理本应如此简单便捷而收放自如.
- **一次编写, 多平台可用**: 得益于 Avilla 的强大抽象, 开发者只需面向 Avilla 就能完成核心业务的开发, 显著的减少了维护成本.
- **平台特性友好**: Avilla 以 Activity, Reaction, Extension 等诸项设计, 使得开发者在运用平台特性的方式更加规范而不失表达性. 担心平台间特性的不通用? 你可以同时为多个平台编写不同的特性用例, Avilla 会自动应用可用的适配, 不改动核心逻辑的同时保证基本特性的可用!
  > 担心可用性? 我们同样提供了一些核心的非平台依赖实现, 例如 `TextCommand`, 这些组件仅要求平台实现最基本的交互实现, 剩下的一切交给 Avilla 处理!
- **现有基建兼容**: 得益于 `Amnesia`, `Commander`, `Twilight`, `Alconna` 或是基于 `Launart` 编写的各式扩展, 可以直接与 Avilla 协同而无需任何迁移成本.
- **高可伸缩性**: Avilla 既支持单文件使用, 亦支持基于 Graia Saya 驱动的模块系统编写应用.

> 以上摘录自 Avilla 的 README.

那么, 废话少说, 我们开始吧.