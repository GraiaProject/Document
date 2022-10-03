# 消息链

## 为什么是消息链?

QQ 消息并不只是纯文本, 也不只是单一类型的消息. 文本中可以夹杂着图片, At 某人等多种类型的消息.

mirai 为了处理富文本消息, 采用了消息链 (Message Chain)这一方式.

消息链可以看作是一系列元素 (Element) 构成的列表. 消息组件表示消息中的一部分, 比如纯文本 `Plain`, At 某人 `At` 等等.

关于可用的元素, 参看 [API 文档][graia.ariadne.message.element].

## 消息链用法

### 构造消息链

构造消息链时, 建议采用 `MessageChain` 直接实例化.

支持使用以下方法构造.

=== "基础"

    ```py
    message_chain = MessageChain([AtAll(), Plain("Hello World!")])
    ```

=== "使用 `str` 代替 `Plain`"

    ```py
    message_chain = MessageChain([AtAll(), "Hello World!"])
    ```

=== "省略 `[ ]`"

    ```py
    message_chain = MessageChain(AtAll(), "Hello World!")
    ```

### 消息链的字符串表示

使用 `message_chain.display` 属性获取消息链的字符串表示.字符串表示的格式类似于手机 QQ 在通知栏消息中的格式, 例如图片会被转化为 `[图片]`, 等等.

### 消息链持久化

使用 `message_chain.as_persistent_string()` 和 `MessageChain.as_persistent_string()` 可以尽量无损地持久化与恢复消息链,
使用 `binary=False` 可以不包括图片等多媒体元素的二进制数据.

!!! info "提示"

    如果要持久化二进制数据, 可以先 `await message_chain.download_binary()`.

### 遍历

可以使用 for 循环遍历消息链中的消息组件.

```py
for element in message_chain: ...
```

### 比较

可以使用 `==` 运算符比较两个消息链是否相同.

```py
another_msg_chain = MessageChain([AtAll(), Plain("Hello World!")])
assert message_chain == another_msg_chain
```

### 检查子链

可以使用 `in` 运算检查消息链中：

1. 是否有某个消息组件.
2. 是否有某个类型的消息组件.
3. 是否有某子字符串.
4. 是否有某个消息链. (From **0.4.2** )

```py
AtAll in message_chain

At(app.account) in message_chain

'Hello' in message_chain

MessageChain([AtAll(), "Hello World!"]) in message_chain
```

消息链的 `has` 方法和 `in` 等价.

你可以使用 `only` 方法检查消息链是否只有某些元素类型.

还可以使用 `find_sub_chain` 方法寻找可能的消息链子链起始点.

```py
assert message_chain.find_sub_chain(MessageChain(["Hello"])) == [0]
```

### 索引与切片

消息链对索引操作进行了增强.以元素类型为索引, 获取消息链中的全部该类型的消息组件.

```py
assert message_chain[Plain] == [Plain("Hello World!")]
```

以 `类型, 数量` 为索引, 获取前 **至多** 多少个该类型的元素.

```py
assert message_chain[Plain, 1] == [Plain("Hello World!")]
```

以 `下标` 为索引, 获取对应下标的元素.

```py
assert message_chain[0] == Plain("Hello World!")
```

以 `切片对象` 为索引, 相当于调用 `MessageChain(message_chain.content[slice])`.

!!! warning "弃用警告"

    Ariadne 0.10.0 起事件中携带的 MessageChain 将不再以 `Source` / `Quote` 开头.

    请使用 `MessageEvent.source` / `MessageEvent.quote`.

    与此同时，你可以减少代码中消息链直接索引 int / slice 的使用.

    或者，换用 [`graia.ariadne.message.exp.MessageChain`][graia.ariadne.message.exp.MessageChain] 作为 **分派类型标注**.

    它将 0.10.0 后的消息链行为向后移植了.

消息链的 `get` 方法和索引操作等价.

```py
assert message_chain.get(Plain) == [Plain("Hello World!")]
```

消息链的 `get` 方法可指定第二个参数 `count`, 相当于以 `类型, 数量` 为索引.

```py
assert message_chain.get(Plain, 1) == message_chain[Plain, 1]
```

### 获取元素

在 `MessageChain` 对象上, 有以下几种获取元素的方式:

`get_first(T_Element)` 获取第一个类型为 `T_Element` 的元素.
`get(T_Element)` 获取所有类型为 `T_Element` 的元素, 聚合为列表.
`get_one(T_Element, index)` 获取第 `index` 个类型为 `T_Element` 的元素。
`get(T_Element, count)` 获取前 `count` 个类型为 `T_element` 的元素, 聚合为列表.

!!! warning "弃用警告"

    Ariadne 0.10.0 起事件中携带的 MessageChain 将不再以 `Source` / `Quote` 开头.

    也就是说，`chain.get_first(Source)` 之类的用法将会失效.

    请使用 `MessageEvent.source` / `MessageEvent.quote`.


### 连接与复制

可以用 `+` 连接两个消息链, 用 `*` 复制消息链.

```py
assert MessageChain(['Hello World!']) + MessageChain(['Goodbye World!']) == MessageChain([Plain("Hello World!"), Plain("Goodbye World!")])
assert MessageChain(['Hello World!']) * 2 == MessageChain([Plain("Hello World!"), Plain("Hello World!")])
```

### 其他

除此之外, 消息链还支持很多 `list` 拥有的操作, 比如 `index` 和 `count`.

```py
message_chain = MessageChain([AtAll(), "Hello World!"])
assert message_chain.index(Plain) == 0
assert message_chain.count(Plain) == 1
```

!!! warning "弃用警告"

    Ariadne 0.10.0 起事件中携带的 MessageChain 将不再以 `Source` / `Quote` 开头.

    这意味着 `index` 的行为将发生改变.

    或者，换用 [`graia.ariadne.message.exp.MessageChain`][graia.ariadne.message.exp.MessageChain] 作为 **分派类型标注**.

    它将 0.10.0 后的消息链行为向后移植了.

### 前缀与后缀操作

与字符串对象一样, 消息链对象支持 `startswith`, `endswith`, `removeprefix`, `removesuffix` 四个方法.

!!! warning "注意"

    消息链在执行这些方法时 **不会去掉其他元素**.

```py
msg_chain = MessageChain("Hello world!", At(target=12345))
assert msg_chain.removeprefix("Hello") == MessageChain([Plain(text=' world!'), At(target=12345)])
assert msg_chain.removesuffix("world!") == MessageChain([Plain(text='Hello world!'), At(target=12345)])
assert not msg_chain.endswith("world!")
```

!!! warning "弃用警告"

    Ariadne 0.10.0 起事件中携带的 MessageChain 将不再以 `Source` / `Quote` 开头.

    这意味着 `startswith` `removeprefix` 的行为将发生改变. (`startswith` 的行为将变得符合直觉)

    或者，换用 [`graia.ariadne.message.exp.MessageChain`][graia.ariadne.message.exp.MessageChain] 作为 **分派类型标注**.

    它将 0.10.0 后的消息链行为向后移植了.

???+ info "又及"

    你知道的, `Python` 在 3.9 以后才正式引入 `removeprefix` 与 `removesuffix` 方法......

    不过 `Ariadne` 中的这两个方法并不需要 `Python` 3.9+

### replace 方法

`MessageChain` 的 `replace` 方法与 `str` 的 `replace` 方法有异曲同工之妙.

在其表面下, `find_sub_chain` 承担了大部分工作, 找出所有符合 `old` 的部分, 之后由简单的循环完成替换.

```pycon
>>> MessageChain(["Hello World!Hello World!", At(1), "yo"]).replace(
...     MessageChain(["Hello World!"]),
...     MessageChain(["No!"])
... )
MessageChain([Plain("No!No!"), At(1), Plain("yo")])
```

!!! note "提示"

    这对于 `At` 等元素也适用. 此外, `replace` 的 `old`, `new` 参数为 `MessageChain`, `Iterable[Element]`, `Element` 中一种即可.

    ```py
    msg.replace(At(app.account), Plain("[bot]"))
    ```

### join 方法

`MessageChain` 的 `join` 方法与 `str` 的 `join` 方法大致相同.

接受一个内容为 `MessageChain` 的可迭代对象, 并用其自身拼接.

`merge` 参数决定是否自动帮你拼接消息链, 默认为是.

```pycon
>>> MessageChain([" "]).join([MessageChain(["A"]), MessageChain(["B"]), MessageChain(["C"])])
MessageChain([Plain("A B C")])
>>> MessageChain([" "]).join([MessageChain(["A"]), MessageChain(["B"]), MessageChain(["C"])], merge=False)
MessageChain([Plain("A"), Plain(" "), Plain("B"), Plain(" "), Plain("C")])
```

## 多媒体元素

相信你在 `docstring` 与函数签名的辅助下, 能够很快掌握 `Plain` `At` `AtAll` 三种元素类型.

接下来将介绍继承自 `MultimediaElement` 的多媒体元素: `Image` `FlashImage` `Voice`.

### 实例化

你可以通过以下方式自行实例化多媒体元素:

-   从`Mirai API HTTP` 缓存的图片构造: 传入完整 `id` (不是 uuid)
-   从网络图片构造: 传入 `url`
-   从 `bytes` 字节对象构造: 通过 `data_bytes` 传入 `bytes` 包装的二进制数据.
-   从 `base64` 字符串构造: 传入 `base64` 作为二进制存储.
-   从本地文件构造: 传入 `path` 并以 **当前工作目录** 读入二进制数据.

!!! note "提示: 传入的 `path` 会自动被立即提取出二进制数据. 所以不要想着先传 path 再写文件."

### 获取二进制

你可以通过 `get_bytes()` 异步方法获取多媒体元素的二进制数据.

!!! info "提示"

    通过 base64 存储的多媒体元素也可通过本方法取出二进制数据.

    网络图片的二进制数据会在下载后被存储于 `base64` 属性内作为缓存.

### 图片类型转换

可以通过对 `FlashImage` 与 `Image` **实例** 使用 `to_image` `from_image` `to_flash_image` `from_flash_image` 方法进行两种图片类型转换.

### 等价性比较

多媒体元素之间的相等比较需要以下条件:

-   类型相同 (也就是说 `Image` 与 `FlashImage` **必定不等**)
-   以下属性中任意一个相等
    -   base64 (data_bytes)
    -   uuid (剔除了 "/" "{}" 等用于区分图片类型的符号后得到)
    -   url

## 转发消息相关

!!! warning "警告"

    Graia Project 不对你随意构建转发消息造成的任何可能后果负责.

使用 `Forward` 并传入一个 `ForwardNode` 的列表即可构建.

`ForwardNode` 可以自定义单个消息的发出者名字与其 QQ 号, 通过传入 `name` 与 `target` 参数实现.

同时, 直接向 `target` 传入 `Friend` `Member` 等对象可以从中提取出 `name` (`Member` 使用群名片, `Friend` 使用昵称)
而不用单独传入.

### 筛选元素

使用 `include` 与 `exclude` 方法可以筛选消息链中的元素.

```py
msg_chain = MessageChain("Hello", At(target=12345))
assert msg_chain.include(Plain) == MessageChain([Plain(text='Hello')])
assert msg_chain.exclude(Plain) == MessageChain([At(target=12345)])
```

### 分割

使用 `split` 方法以切割消息链为 **多个消息链**.

`raw_string` 参数用于指示是否要保留 "空" 的文本元素.

```py
msg_chain = MessageChain("Hello world!", At(target=12345))
assert msg_chain.split("world!", raw_string=True) == [MessageChain([Plain(text='Hello ')]), MessageChain([Plain(text=''), At(target=12345)])]
assert msg_chain.split("world!") == [MessageChain([Plain(text='Hello ')]), MessageChain([At(target=12345)])]
```

## 元素安全性

因为 `MessageChain` 是一个可变对象, 其底层的 `Element` 属性可以被修改, 所以自然可以这样做:

```pycon
>>> chain = MessageChain([Plain("hello"), At(12345)])
>>> chain[1].target = 99999
>>> chain
MessageChain([Plain("hello"), At(99999)])
```

然后, 这样是 **预期行为** :

```pycon
>>> chain = MessageChain([Plain("Hello"), Plain("World"), At(12345)])
>>> merged = chain.merge()
>>> chain
MessageChain([Plain(text='HelloWorld'), At(target=12345)])
>>> merged[0].text = "test"
>>> chain
MessageChain([Plain(text='test'), At(target=12345)])
```

```pycon
>>> chain = MessageChain([Plain("Hello"), Plain("World"), At(12345)])
>>> merged = chain.merge(copy=True)
>>> chain
MessageChain([Plain(text='HelloWorld'), At(target=12345)])
>>> merged[0].text = "test"
>>> chain
MessageChain([Plain(text='HelloWorld'), At(target=12345)])
>>> merged
MessageChain([Plain(text='test'), At(target=12345)])
```

原因很简单, `Ariadne` 的 `MessageChain` 是支持链式调用的, 所以 **所有对消息链的操作都会返回一个消息链引用** .

自 `0.5.1` 起, 消息链的大部分修改操作都支持参数 `copy` (可能为仅关键字参数), `copy = True` 时会返回消息链的 **副本** (相当于在 `chain.copy()` 上操作),
否则会返回自身的引用.

!!! graiax "社区文档相关章节"

    [总览](https://graiax.cn/guide/message_chain.html)

    [多媒体元素](https://graiax.cn/guide/multimedia_message.html)

    [文件发送](https://graiax.cn/guide/file_operation.html)

    [合并转发](https://graiax.cn/guide/forward_message.html)
