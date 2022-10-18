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

```py
# file: module.py
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

    users: list[int]
    """允许使用本模块的用户列表"""

    groups: list[int]
    """允许使用本模块的群组列表"""


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


```py
# file: main.py
import kayaku
from ... import load_module # 假想的加载模块函数

if __name__ == "__main__":
    kayaku.initialize(
        {
            "{**}": "./config/{**}"
        }
    )

    kayaku.bootstrap()

    ...

    kayaku.save_all()
```


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