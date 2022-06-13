# 参数解析器

# 问题引入

我们在 [`Hello World!`](hello-world) 中使用了以下形式声明事件的监听：

```python
@broadcast.receiver(ExampleEvent)
async def event_receiver(event: ExampleEvent):
    print("Hello World!")
```

稍微改动一下：

```python
@broadcast.receiver(ExampleEvent)
async def event_receiver():
    print("Hello World!")
```

这段代码和上一段代码一样运作正常。

再改动一下：

```python
@broadcast.receiver(ExampleEvent)
async def event_receiver(event: ExampleEvent, event_2: ExampleEvent):
    print(event, event_2)
    assert event is event_2
```

这段代码依旧运作正常，并且参数中 `event` 与 `event_2` 所指向的是同一个 `ExampleEvent` 实例。

而当我们将参数部分修改为这样（其余修改部分省略）：

!!! error "这段代码将会报错！"

```python
async def event_receiver(event):
```

报错了，我们的程序被一个 `RequirementCrashed` 错误崩掉了，于是我们明白，要给 `event` 添加一个类型注解（`annotation`）才能获取到事件实例，而这个部分，也就是解析监听器中参数的相关抽象，我们称之为 `Dispatcher`（参数解析器）。

# 正式课程

再把目光投向 `ExampleEvent` 这个我们自己造出来的事件类：

```python
class ExampleEvent(Dispatchable):
    class Dispatcher(BaseDispatcher):
        @staticmethod
        async def catch(self, interface: DispatcherInterface):
            pass
```

修改一下 `ExampleEvent.Dispatcher.catch`：

```python
async def catch(self, interface: DispatcherInterface):
    print(interface.name, interface.annotation, interface.default)
```

再将那个事件监听器修改一下：

```python
async def event_receiver(
    event_1: ExampleEvent = 1,
    event_2: ExampleEvent = "2323123",
    event_3: ExampleEvent = 3.0
):
```

当事件触发时，程序的输出：

```
event_1 ExampleEvent 1
event_2 ExampleEvent 2323123
event_3 ExampleEvent 3.0
```

我们可以看到，程序依次输出了参数的 “名称（`name`）”、“类型注解（`annotation`）” 与 “默认值（`default`）”。这表示 `Dispatcher` 可以获取到参数的各项信息并加以处理。

根据这些信息，我们就可以在事件上扩展事件监听器中参数的部分，从而实现另外一种特别的编程方式。

> 准确的说，参数解析这个过程是被独立出来的，如果你对这个部分抱有兴趣，欢迎阅读遁入深渊（Into the abyss）篇的 [执行器与被执行对象](/docs/broadcast/abyss/executor-and-exectarget)，但如果你还只是初学，那么现在就还不是看这篇文档的时候。

从 “参数解析” 这个名字中，我们大概就能了解到它的用途，而获取到信息也只不过是其中一环而已，接下来我们将让它 “输出” 些东西。

我们设定当一个参数的名称为 `a`，类型注解为 `str` 时，让这个参数的值为一个特定的字符串，那么我们需要这样写：

```python
async def catch(self, interface: DispatcherInterface):
    if interface.name == "a" and interface.annotation is str:
        return "special string" # 是不是字符串无所谓，返回了就好。
```

而当我们的事件监听器是这样的时候：

```python
async def event_receiver(
    event_1: ExampleEvent,
    a: str
):
```

用 `print` 输出一下 `a`，发现程序输出了我们上面设定的值。

我们总结一下：

- 我们可以在定义事件的 `Dispatcher` 时通过声明  `catch` 静态方法，借此自定义对事件监听器的参数部分的处理。

- 我们可以通过 `DispatcherInterface` 中的以下属性获取当前上下文中的信息：

  |    属性名    | 描述                                                         |
  | :----------: | ------------------------------------------------------------ |
  |    `name`    | 当前解析的参数的名称，通常类型为 `str`，也就是字符串         |
  | `annotation` | 当前解析的参数所设定的类型注解                               |
  |  `default`   | 当前解析的参数所设定的默认值。注意：默认值与类型注解可能不是一个类型。 |
  |   `event`    | 监听器监听到的事件实例                                       |
  | `broadcast`  | 当前 `Broadcast` 实例                                        |

- `catch` 方法的返回值**通常**就是当前解析的参数将会传入的值。

- 关于这个特性，还有很多的点要讲，若需知悉，请阅读后面的文档。

