# 生命周期事件

当 Saya 在实例化时接受到了一个可用的 `Broadcast` 实例时, 生命周期这一特性会被启用.

## `SayaModuleInstalled`

如其名称, 在一个模块及其所有内容被导入完毕后, 该事件会被触发.

## `SayaModuleUninstall`

如其名称, 在一个模块及其所有内容被卸载之前, 该事件会被触发.

## `SayaModuleUninstalled`

如其名称, 在一个模块及其所有内容被卸载之后, 该事件会被触发.

上述事件, 如果全部都使用了 `Saya` 的 `channel.use(...)` 声明监听器, 则不需要让模块内声明的监听器返回 `RemoveMe`,
因为他们会被自动清理, 换言之, 如果有必要不使用 `channel.use(...)` 在模块内声明监听器, 则有可能需要返回 `RemoveMe`.