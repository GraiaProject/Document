# 依赖注入 (Depend)


你或许会遇到各种需要代码复用的情况, 像是获取 URL 中的路径参数, 然后验证它在数据库中存不存在: 如果存在, 给主体的逻辑部分以你查询到的数据, 否则返回 404.

事实上, [`FastAPI`](https://fastapi.tiangolo.com/) 就是这么做的,
它也推荐用户使用框架中的 `Depend` 特性来做这些事情, 这样的代码复用方式在 Broadcast Control 中也同样被称为 `依赖注入`.

## 简单的使用

使用这个特性, 你首先需要引入 `Depend` 类:

```py
from graia.broadcast.builtin.decorators import Depend
```

假设我们有以下事件声明:

```py
from graia.broadcast import Dispatchable, BaseDispatcher
from graia.broadcast.interfaces.dispatcher import DispatcherInterface

from web_service import request, GetParam

# request.get_params: Dict[str, str]

class HttpGetRequestEvent(Dispatchable):
    class Dispatcher(BaseDispatcher):
        def catch(interface: "DispatcherInterface"):
            if isinstance(interface.default, GetParam):
                return request.get_params.get(interface.default.name)
```

我们假设真的有这么一个 web 应用, 你的数据库有各种完善的 schema, 还有相应的数据, 那么, 作为一个 CRUD boy, 首先先让我们设定让下面这个 `group_members` 函数作为一个 HTTP GET 请求处理器.

```py
@bcc.receiver(HttpGetRequestEvent, decorators=[
    Endpoint("/group/members"),
    Method.GET
])
async def group_members(group_id: str = GetParam('group_id')):
    ...
```

我们假设当用户访问 `/group/members?group_id=qwertyuioop` 时, `group_id` 会被赋值为 `qwertyuioop`, 以此类推.

!!! tip

    其实这个 `GetParam` 还真能实现...你可以用 Dispatcher 或者 Decorator 套一个比如说 starlette/aiohttp 实现.


我们声明以下 Depend 实现:

```python
@db_session
async def getGroup(group_id: str = GetParam('group_id')):
    result = Group.findone(id=group_id)
    if not result:
        raise ExecutionStop()
        # 这个在之后的 advance/event-propagation-and-priority 有讲到
        # 在这里只需要理解这是跳出去并且放弃执行就可以了
        # 实际上, 这里应该是 raise HttpErrorCode(403) 才对.

    return result
```

应用到逻辑中:

```py
@bcc.receiver(HttpGetRequestEvent, decorators=[
    Endpoint("/group/members"),
    Method.GET
])
async def group_members(group: Group = Depend(getGroup)):
    ...
```

这样就可以直接获取到 `Group` 了, 而这就是 Depend 最简单的应用.

!!! tip
    在 Graia Ariadne 的文档中也有对于 `Depend` 这一特性的阐述, 另见[此处](../../ariadne/extra/broadcast/depend.md)