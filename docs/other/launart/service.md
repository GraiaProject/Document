# Service 和 ExportInterface

`Service` 和 `ExportInterface` 是用来声明 “服务” 和 “接口” 的，
通过定义抽象的 `ExportInterface`，我们可以从不同服务中获得通用接口（比如基础的网络 I/O，`Amnesia` 很大一部分就是在干这事）

`Service` 除了提供接口的能力以外，在其他方面和 `Launchable` 操作基本相同.

## 提供接口

继承 `Service`，并往 `supported_interface_types` 写入对应的 `ExportInterface` 子类即可.

`supported_interface_types` 是一个 `Set[Type[ExportInterface]]` 或 `Dict[Type[ExportInterface], float]` 的单例或元组.

有点迷糊？看看下面的示例：

- `#!py {MyInterface, AnInterface}`
- `#!py {AbstractInterface: 5}`
- `#!py {MyInterface}, {AbstractInterface: 5.4}`

??? quote "[PEP 484 - 类型标注: The Numeric Tower(数字塔)](https://peps.python.org/pep-0484/#the-numeric-tower)"

    [PEP 3141](https://peps.python.org/pep-3141) 定义了 Python 的数值类型层级关系（numeric tower），
    并且 [`numbers`][numbers] 模块定义了对应的抽象基类
    （[`Number`][numbers.Number]、[`Complex`][numbers.Complex]、[`Real`][numbers.Real]、[`Rational`][numbers.Rational] 和 [`Integral`][numbers.Integral]）。
    关于这些抽象基类存在争议，但内置的具体类型 [`complex`][complex]、[`float`][float] 和 [`int`][int] 已得到广泛应用（尤其是后两个类）。

    本 PEP 提出了一种简单、快捷、几乎也是高效的方案，用户不必先写 `import numbers` 语句再使用 [`Real`][numbers.Real]：只要注解为 `float` 类型，即可接受 `int` 类型的参数。类似地，注解为 `complex` 类型的参数，则可接受 `float` 或 int 类型。这种方案无法应对实现抽象基类或 [`fractions.Fraction`][fractions.Fraction] 类的类，但可以相信那些用户场景极为罕见。

这里，用 **字典** 形式声明的 `supported_interface_types` 的 **值** 表示为 “优先级”，
我们非常推荐你在支持抽象接口时这样做。

!!! warning "当然，在实现统一接口时每个人可能都会有点私心...不过还是希望你能客观的标定"

使用 **集合** 形式来声明支持的接口时，请确保没有其他 `Service` 会提供相同接口，否则将会报错.

## 获取接口

其他 `Launchable` 可以使用 `mgr.get_interface(interface)` 来获取接口 **实例**.

问题来了，单个接口可能会有多个不同的 `Service` 提供，如何保证你的 `Launchable` 依赖于你需要的 `Service` 呢?

> 只要往 `required` 中填入对应的 `Launchable.id` / `ExportInterface` 类型即可。

将 `Launchable.required` 从实际的唯一 ID 改成抽象的 `ExportInterface` 类型，`Launart` 会自动帮你解析接口对应的 `Service`.

例如，假设 `AiohttpClientService` 提供了 `#!py {AiohttpClientInterface}, {AbstractClientInterface: 5}`，
`HttpXClientService` 提供了 `#!py {AiohttpClientInterface}, {AbstractClientInterface: 3}`

这时你声明 `AbstractClientInterface` 的依赖时，就会自动被认为是依赖于 `AiohttpClientInterface`.

当然，在你没有注入对应的 `Service` 时，`Launart` 会自动报错.