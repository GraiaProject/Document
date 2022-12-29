# Graia Framework

> `Graia Framework` 的新版文档, 由开发者名义释出.

## 特性

### 框架式开发
Graia Framework 在 Graia Project 中作为基础设施的一部分, 借鉴了多种机器人开发框架的设计, 并创造出了多种独有设计, 从而使开发者能更好的表现逻辑思维.

### 简洁而强大
在思考 "该怎么样能将机器人应用作为一个大型项目开发" 的问题上, 我们给出了 "渐进式框架" 的答案. 我们正努力使入门开发尽可能简单的同时, 让高阶开发也能创造出更多的可能性.

### 富有表现性
通过使用 Dispatcher, Decorator, Interrupt 等特性, 你可以用更简洁的代码实现更为复杂的逻辑, 做出更有趣的东西.

## 关于我们

Graia Project 是一系列的项目的集合, 并最终致力于建立开放包容, 具有丰富创造力的活跃 Bot 社区.

Graia Project 目前的主要工作是为 Bot Development 提供一系列高效, 现代化, 充分可扩展的工具链,
以及提供优秀的基础设施实现.

目前我们以不同的形式开源了许多的项目, 接下来将会一一列举出来.

部分项目存于由社区成员建立, 有官方人员提供支持的 [GraiaCommunity](https://github.com/GraiaCommunity) 处,
其中由官方人员维护的项目也会出现.

部分存于官方人员的个人 GitHub 账号下的项目, 若有一定关联亦会出现.

* Framework

    - [Ariadne](https://github.com/GraiaProject/Ariadne)
      一个优雅且完备的 Python QQ 自动化框架, 基于 Mirai API HTTP v2.
    - [Avilla](https://github.com/GraiaProject/Avilla)
      "下一代" 框架实现, 一个理论上可以实现零成本切换对接平台的框架.
  
* Framework Tools

    - [Broadcast Control](https://github.com/GraiaProject/BroadcastControl)
      极具扩展性的, 并不止于事件系统的事件系统实现.
    - [Saya](https://github.com/GraiaProject/Saya)
      社区中通用的插件/模块管理器.
    - [Scheduler](https://github.com/GraiaProject/Scheduler)
      一个简单的定时任务实现, 与 Broadcast Control 深度结合.

* Infrastructure

    - [Amnesia](https://github.com/GraiaProject/Amnesia)  
      一系列共用组件的集合.
    - [creart](https://github.com/GraiaProject/creart) & [creart-graia](https://github.com/GraiaProject/creart-graia)
      通用, 易于扩展, 实现简洁的类实例化器, 致力于简化 Graia Project 中各个部件在单一应用实例中的创建及引用.
    - [launart](https://github.com/GraiaProject/launart)  
      统一的应用实例启动时部件管理.
    - [statv](https://github.com/GraiaProject/statv)
      `Status API` 的实际实现.
    - [GreyElaina/richuru](https://github.com/GreyElaina/richuru)  
      一个轻量级的依赖, 为 [`loguru`](https://github.com/Delgan/loguru) 提供 [`rich`](https://github.com/textualize/rich) 强大的终端渲染支持.
    - [GreyElaina/Mina](https://github.com/GreyElaina/Mina)  
      基于 `pdm-pep517` 实现的 Monorepo for Python 实现.
    - [kayaku](https://github.com/GraiaProject/kayaku)  
      强大的配置管理解决方案.
    - **Planned** [Luma](https://github.com/GraiaProject/Luma)
      基于 `kayaku` 与 `creart` 等组件, 实现无入口文件的应用实例启动, 为之诞生的 CLI 工具.  
      亦提供基于现有设施的 Saya 模块的管理, 目前 `pdm` 与 `poetry` 的支持已列入 Roadmap.

## 改进文档

请到 <https://github.com/GraiaProject/Document/> 为我们的文档提供改进建议.

## 许可协议

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="知识共享许可协议" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />本文档采用<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">知识共享署名-非商业性使用-相同方式共享 4.0 国际许可协议</a>进行许可。

## 鸣谢

本文档使用 [`Material for MkDocs`](https://squidfunk.github.io/mkdocs-material/) 构建，
由 [`Netlify`](https://www.netlify.com/)，[`CloudFlare Pages`](https://www.cloudflare.com/) 和 [`ReadTheDocs`](http://readthedocs.org/) 提供免费的托管服务。

## 行为准则

请在 [此处](https://github.com/GraiaProject/.github/blob/master/CODE_OF_CONDUCT.md) 查阅我们的行为准则.