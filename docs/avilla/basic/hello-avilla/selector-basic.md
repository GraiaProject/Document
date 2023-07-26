选择器 (Selector) 在 Avilla 中的地位举足轻重，各个功能都围绕这一组件发挥功用，
透过使用稳定的对象指示，Avilla 实现了易扩展的用户接口。

本质上，选择器其实就是一个 `dict[str, str]`。

```python
Selector().land("qq").group("941310484").member("1846913566")
# 相当于
{
    "land": "qq",
    "group": "941310484",
    "member": "1846913566"
}
```

!!! note
    自 Python 3.6 开始，字典 (dict) 就是有序的了。

对于大部分方法，我们都推荐在我们的 API Reference 查看，这里仅特别提及 `follows` 与 `into` 方法，也是我们推荐用于处理 Selector 的方法。

## Selector.follows

我们推荐使用 `Selector.follows` 方法判断一个选择器是否满足要求。

!!! note
    [过滤器 (Filter)](/avilla/basic/filter.md) 也采用了 `follows-style` 作为推荐使用的高层封装。

```python
if cx.client.follows("::group.member(1234567890)"):
    ...
```

这段代码检查 `cx.client` 是否符合模式 `"::group.member(1234567890)"`, 并返回布尔值供 if 控制。

!!! tip
    "::" 是对 "land" 的缩写，以下代码片段中，这两种方法等效。

    ```python
    cx.scene.follows("::group.member(...)")
    cx.scene.follows("land.group.member(...)")
    ```

不难发现，这一方式更符合直觉，并且写法也和构建 Selector 的一般方式相同。

你也可以使用 `"*"` 实现前缀匹配。

```python
if cx.client.follows("::group.*"):
    ...
```

除此之外，你也可以使用自定义的函数来判断是否符合要求。注意，若存在后置括号，则使用该方法的优先级更高。

```python
if cx.client.follows("::group.member", member=lambda mem: mem == "..."):
    ...
```

!!! tip
    你还可以使用 `Selector.from_follows_pattern` 来构造选择器，但你需要同时给出所有节点的值。

    ```python
    Selector.from_follows_pattern("land(qq).group(941310484).member(1846913566)")
    ```

## Selector.into

如果需要对 Selector 获得其的一个变换，我们推荐使用 `Selector.into` 方法。

```python
if cx.scene.follows("::group.*"):
    cx.scene.into("::group.member(1111111)")
```

因为如果不符合条件就会报错，我们推荐与 `Selector.follows` 合用。

同样，也支持使用 kwargs 传参：

```python
cx.scene.into(..., group="11111111111")
```
