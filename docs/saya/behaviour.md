# 行为(Behaviour)

行为(Behaviour) 用于实际对接相应接口, 为 `Schema` 修饰过的 `Cube` 提供实际支持.

## 编写 Behaviour

行为的实现需要基于两个谓词: `allocate` 与 `release`;
allocate 用于在实际对接的接口上载入部件, release 则是注销已载入的部件.

```py
class ExampleBehaviour(Behaviour):
    ...

    def allocate(self, cube: Cube):
        ...
    
    def release(self, cube: Cube):
        ...
```

Saya 的 Behaviour 在分配职权上采用沿袭自 Broadcast Control 中 Dispatcher Interface 的简化,
当某个 Behaviour 返回一个非 `None` 值之前, Saya 会面向**所有**的 Behaviour 进行一次尝试;
若所有的尝试都以失败告终, 表示对于当前 Cube 的特定操作失败, Saya 会抛出 `RequirementCrashed` 错误.

> 对, 就是 Broadcast Control 那个.

这意味着你可能接收到带着各式各样 Schema 的 Cube, 你需要先对其进行一系列内省...

```py
def allocate(self, cube: Cube):
    if isinstance(cube.metadata, ExampleSchema):
        ...
    elif isinstance(cube.metadata, ExampleSchema2):
        ...
    else:
        return
    
    return True # 返回 True 是约定俗成, 当然其他非 None 值也是可以接受的.
```

这些对于 `release` 也是同样的规则.

## 载入至 Saya

只需要执行 `Saya.install_behaviours` 方法即可.

```py
saya.install_behaviours(ExampleBehaviour())
```

!!! note
    `Saya.install_behaviours` 可以接受一系列的 Behaviour 实例, 也就是说可以同时将多个 Behaviour 载入 Saya.