# Schema

Schema 是描述某一类内容的元信息模板, 需要用 `dataclass` 修饰.

在他们的基类 `BaseSchema` 中, 声明了以下字段:

 - id: 一般不用管
 - channel: 实例化时可以获取到的环境中的 Channel.

其实例化结果会被 `channel.use` 和 `Saya` 传递到传入 `Behaviour` 的谓词行为方法的 `Cube` 的属性 `metaclass`,
通常一类内容会安排一个 Schema, 例如 BCC 的事件监听器是 `ListenerSchema`.