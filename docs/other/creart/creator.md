# Creator

`Creator` 是工厂模式在 `creart` 中的具体实现, 即所声明的目标类的工厂.

一个合法的 `Creator` 继承自 `creart.creator.AbstactCreator`, 并声明:

 - 创建目标 (`targets`): Creator 会承担的创建职能, 在环境中唯一.
 - 可用性检查 (`available`): Creator 履行职能的需求, 通常是对特定的模块的存在性检查.
 - 创建器 (`create`): 在行为成立时实际调用的方法.


!!! danger
    需要注意的是, `Creator` 的声明在编写的时候 **绝对不应该** 实际引用创建目标.  
    这会完美的破坏用户的使用体验.


## 编写

通常的, 如果对不同的创建目标, 可用性检查的行为是一致的, 我们会把他们全部在一个 `Creator` 里面实现.

以下是 `example.example1:ExampleClass` 的 Creator 实现:

```py
from __future__ import annotation  # 优化类型标注的编写体验
from creart import exists_module
from creart.creator import AbstractCreator, CreateTargetInfo

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    ## 处于此处时的 import 不被认为是 "实际引用", 因此这里是安全的.
    ## 注意: 如果不适用 __future__ (本代码段第一行), 需要为类型注解加上引号.
    from example.example1 import ExampleClass

# 通常的, Creator 的实际实现命名为目标或其的要求通称后面加一个 `Creator`.
class ExampleClassCreator(AbstractCreator):
    """Creart support for example.example1.ExampleClass
    """

    ## targets 即创建目标, 类型为 ClassVar[tuple[CreateTargetInfo, ...]]
    targets = (
        ## CreateTargetInfo 需要声明创建目标的所在模块与名称, 内部名称分别是 module 与 identify.
        ## 我们也推荐填入 人性化名称(humanized_name), 短描述(description) 与 提供者(author) 三个字段,
        ## 这可以为各式命令行工具提供美观的支持.
        
        ## 这里可以填入多个 CreateTargetInfo, 要求详见前文.
        CreateTargetInfo("example.example1", "ExampleClass"),
    )


    ## available, 即可用性检查器, 静态方法在返回 True 时, Creator 才会被自动发现并处于可用状态.
    ## 你应该在这里检查 create 方法中所引用到的模块的可用状态, 如下所示.
    @staticmethod
    def available() -> bool:
        ## 当你要判断一个包或是一个模块是否存在时, 应该使用 exists_module 函数,
        ## try import 会直接进行导入并拖慢启动速度, 尤其是当你不使用一些模块的时候.
        ## 如果需要复用其他 Creator 的可用性判断, 请使用 Mixin, 详见 <#mixin>.
        return exists_module("example.example1")
    
    ## create, 创建器, 需要为静态方法.
    ## 注意, 这里接收到的是原始对象而不是 CreateTargetInfo 中的字符串.
    ## 如果 Creator 并没有对多个类支持, 则可以直接实例化, 否则需要加以判断/内省.
    ## 你既可以使用 creart._signature 对其取简易签名, 亦可直接导入相关模块并判断 issubclass.
    @staticmethod
    def create(create_type: Type[ExampleClass]) -> ExampleClass:
        return create_type(...)
```

## 启用

### 动态启用

使用 `creart.add_creator` 函数将该 Creator 启用:

```py
from creart import add_creator

add_creator(ExampleClassCreator)
```

### 使用 Entry Point

如果我们想像各式 `stub package` 那样, 通过发布一个 PyPI 包为其他的模块提供 `creart` 支持,
需要在 `pyproject.toml` 或是 `setup.py` 中按照各式包管理器/打包器的格式声明 [`Entry Point`](https://docs.python.org/zh-cn/3.12/library/importlib.metadata.html#entry-points).

=== "PDM(PEP-621)"

    ```toml
    [project.entry-points."creart.creators"]
    example_class = "example_creart.example1:ExampleClassCreator"
    ```

=== "Poetry"

    ```toml
    [tool.poetry.plugins."creart.creators"]
    example_class = "example_creart.example1:ExampleClassCreator"
    ```

=== "setup.py(setuptools)"

    ```py
    setup(
        ...,
        entry_points = {
            'creart.creators': [
                'example_class = example_creart.example1:ExampleClassCreator'
            ]
        }
    )
    ```

当其他用户安装了我们发布的 PyPI 包到环境内后, 启动使用了 Creart 的应用实例时,
Creart 会自动进行 **所有** 被 Entry Point 指向的 Creator 并进行可用性检查,
当确认可用后即添加到当前应用实例中.

!!! note
    `Graia Project` 中的所有 `Creart` 支持由 <https://github.com/GraiaProject/creart-graia> 提供,
    或许是个不错的示范.

## Mixin - 混入

我们可以使用 `mixin` 函数在一个 Creator 实现中复用其他 Creator 的可用性判断.

```py
from creart import mixin
from creart.creator import AbstractCreator, CreateTargetInfo

## 你可以直接在类上使用该装饰器, 也可以单独在 `available` 上使用.
## 我们通常推荐在 `available` 上单独使用, 以避免往后迭代版本改变了 mixin 行为造成了向后不兼容的问题.

# @mixin(creator1, creator2, ...)
class CreatorN(AbstactCreator):
    targets = ...

    @staticmethod
    @mixin(creator1, creator2, ...)
    ## 此处会先调用 CreatorN 的, 然后再依次调用 1, 2, 以此类推.
    def available():
        ...
    
    def create(create_type):
        ...

```