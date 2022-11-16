# Kayaku - 强大的配置管理解决方案

:construction: 施工中

## 安装

=== "PDM"

    ```shell
    pdm add kayaku
    ```

=== "Poetry"

    ```shell
    poetry add kayaku
    ```

## 开始

首先让我们用一段代码解释你能用 `kayaku` 做到的东西。

先写一个模块，其作用是根据用户传入的内容生成图片。

```py title="workspace/module.py"
from dataclasses import field # 需要使用可变默认值则需要导入
from kayaku import config, create
from ... import command  # 假想的一个 “注册命令” 装饰器
from ... import Message  # 假想的 “消息” 容器
from ... import to_message  # 假想的从字符串转换为消息的函数
from .generator import gen_image


@config("platform.account.credential")
class PlatformCredential:
    """XX 平台的访问凭据"""

    url: str
    """平台的 API URL"""

    token: str | None = None
    """可选的 Token"""


@config("module.permission")
class ModulePerm:
    """模块的访问权限设置"""

    users: list[int] = field(default_factory=list)
    """允许使用本模块的用户列表"""

    groups: list[int] = field(default_factory=lambda: [1, 2, 3])
    """允许使用本模块的群组列表
    默认为 1, 2, 3
    """
    # 多行字符串也是可以使用的


@config("module.format")
class Format:
    """设置模块的格式化相关选项"""

    command: str = ".command {content: str}"
    """设置触发的命令，需要 {content: str}"""

    format: str = "生成完毕：{content}"
    """回复时的消息链格式, 会将生成的图片传入 {content}"""

    reply: bool = True
    """是否要回复消息源"""


fmt: Format = create(Format)


@command(fmt.command)
async def generate_img(app: App, msg: Message, content: str) -> None:
    perm = create(ModulePerm, flush=True)  # 显式声明重载文件
    if not (
        (msg.source.type == "users" and msg.source.ctx not in perm.users)
        or (msg.source.type == "group" and msg.source.ctx not in perm.groups)
    ):  # 原始的权限控制
        return
    credential = create(Credential)  # 获取凭据
    img_data: bytes = await gen_image(credential.url, credential.token, content)
    return await app.send(
        target=message,
        msg=to_message(fmt.format, content=await app.to_image(img_data)),
        reply_src=fmt.reply,
    )
```

这里我们的主代码会造成不同的结果。


```py title="workspace/main.py"
import kayaku
from ... import load_module # 假想的加载模块函数

if __name__ == "__main__":
    kayaku.initialize(
        {
            "{**}": "./config/{**}" # 存储到 config 文件夹下
        }
    )

    kayaku.bootstrap() # 验证并生成 JSON Schema 文件

    ...

    kayaku.save_all() # 保存
```

尝试运行代码，虽然 `bootstrap()` 函数使得其报错退出，但是你应该可以看到已经生成了以下结构：

``` 
📁 workspace/
├── 🐍 main.py
├── 🐍 module.py
└── 📁 config/
    ├── 📁 module/
    │   ├── 📝 format.jsonc
    │   ├── 📄 format.schema.json
    │   ├── 📝 permission.jsonc
    │   └── 📄 permission.schema.json
    └── 📁 platform/
        └── 📁 account/
            ├── 📝 credential.jsonc
            └── 📄 credential.schema.json
```

我们先不管那几个神秘的 `.schema.json` 文件，看看 `.jsonc` 文件。

=== "config/module/format.jsonc"

    ```json
    {
        /*
        * 设置触发的命令，需要 {content: str}
        *
        * @type: str
        */
        "command": ".command {content: str}",
        /*
        * 回复时的消息链格式, 会将生成的图片传入 {content}
        *
        * @type: str
        */
        "format": "生成完毕：{content}",
        /*
        * 是否要回复消息源
        *
        * @type: bool
        */
        "reply": true,
        "$schema": "file:///[snip]/workspace/config/module/format.schema.json"
    }
    ```

=== "config/module/permission.jsonc"

    ```json hl_lines="7 13"
    {
        /*
        * 允许使用本模块的用户列表
        *
        * @type: List[int]
        */
        "users": null,
        /*
        * 允许使用本模块的群组列表
        *
        * @type: List[int]
        */
        "groups": null,
        "$schema": "file:///[snip]/workspace/config/module/permission.schema.json"
    }
    ```

=== "platform/account/credential.jsonc"

    ```json hl_lines="7"
    {
        /*
        * 平台的 API URL
        *
        * @type: str
        */
        "url": null,
        /*
        * 可选的 Token
        *
        * @type: Union[str, NoneType]
        */
        "token": null,
        "$schema": "file:///[snip]/workspace/config/platform/account/credential.schema.json"
    }
    ```

如果你使用的是较为智能的编辑器 (VS Code 或 PyCharm) 中，上面那些被高亮的行应该有错误曲线（标红等）。

这就是那些 `.schema.json` 文件的目的：通过 [`JSON Schema`](https://json-schema.org) 辅助编辑器检查，并提供补全功能。

同时，那些 dataclass field 下方的 “注释字符串” 同样也被写入文件了。

## 标注你的配置类

`Kayaku` 的很多功能依赖于 `PEP 484 类型标注`。因此，你应该保证你的类型标注是准确的，尤其是在处理 `None` 时。

例如：使用 `#!py Dict[str, Optional[Any]]` 代替 `#!py Dict[str, Any]`

如果不这样做， `Kayaku` 就无法自动转换文件内的 `None`，导致 `is None` 比对出错。

同时你不应该直接使用 `dict` `list` 之类的默认全为 `Any` 的类型作为标注。

## 在 Saya 模块中使用

### 注意
1. 此处使用独立的文件储存模块配置，当然你也可以将所有模块配置储存在一个文件中。 
2. 如果你的机器人项目使用了 Saya 模块热加载支持，
请确保在 `saya.require()` 后写入配置文件，或使用后文的 `Launart Component`
来统一管理生命周期。

### 创建模型

可直接使用 `channel.module` 作为 `kayaku.config` 的参数。

如果你的模块有多个部件，最好考虑采用 `模块名.部件属性` 的方式命名。
（`module.connection` `module.credential` 等）

```python
from graia.saya import Channel
from kayaku import config, create

channel = Channel.current()


@config(channel.module)
class ModuleConfig:
    """ 模块配置 """

    bearer: str = ""
    """ Bearer Token """


create(ModuleConfig)    # 创建对应模型
```

### 在模块中使用

向 `kayaku.create()` 传入 `flush=True` 时，会在每次调用时都从配置文件中读取最新的配置，
省去了以往重启机器人才能生效的麻烦。

```python
from kayaku import create

from ... import listen    # 假想的监听器 
from ... import ModuleConfig    # 导入上文创建的模型
from ... import SomeEvent    # 假想的事件

@listen(SomeEvent)
async def some_func(event: SomeEvent):
    config: ModuleConfig = create(ModuleConfig, flush=True) # 确保每次都是最新的配置
    # do something
```

## 使用 Launart Component 管理

可通过 `launart` 在启动以及退出时自动保存模型数据。

```python
from launart import Launart, Launchable
import kayaku


class ConfigService(Launchable):
    id = "bot.config"

    @property
    def required(self):
        return set()

    @property
    def stages(self):
        return {"preparing", "cleanup"}

    async def launch(self, _mgr: Launart):
        async with self.stage("preparing"):
            # 在 preparing 阶段预加载模型并写入 JSON Schema
            kayaku.bootstrap()

        async with self.stage("cleanup"):
            # 在 cleanup 阶段写入所有模型
            kayaku.save_all()

manager: Launart
manager.add_service(ConfigService()) # 添加部件
```

## 重定向配置

```json
{
    "{**}": "./config/{**}", // 重定向所有配置到 config 文件夹下
    "{**}.credential": "./secrets/credential.jsonc:{**}",
    // 重定向所有后缀为 credential 的配置到 secrets/credential.jsonc
    "modules.dangerous.{**}": "./secrets/module/dangerous.jsonc::{**}"
    // 将 modules.dangerous 及其子 domain 重定向到 dangerous.jsonc
    // 这条 rule 优先于上面的 credential rule
}
```

每个 domain 会优先进行前缀匹配，


## 流程

一般来说，你的操作流程应该长这样

```mermaid
flowchart TB
    Initialize("初始化：kayaku.initialize")
    subgraph DefClass["定义 Config 类 (加载 saya 模块)"]
    Class1
    Class2
    ...
    end
    BootStrap("检查，写入 JSON Schema 与默认值等：kayaku.bootstrap")
    subgraph Run["运行"]
    Create("创建：kayaku.create(model_cls, [flush])")
    Save("保存：kayaku.save(model)")
    end
    SaveAll("清理并保存：kayaku.save_all")
    Initialize --> DefClass --> BootStrap --> Run --> SaveAll
```