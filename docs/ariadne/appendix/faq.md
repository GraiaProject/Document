# FAQ - 常见问答

## 如何正确的截取日志？

> Ariadne 费尽心思用 loguru 的彩色日志不是没有理由的......

`Ariadne` 日志中的报错第一行与最后一行是最重要的.

第一行通常为 日期 + 时间 + 红色的 `ERROR` + 红色的异常说明.

最后一行通常为 红色的 `XXXError` 或 `XXXException` 之类的, 再跟着白色的说明文字.

如果能用长截图之类的同时截完当然最好, 如果做不到请优先最后一行 (及其之前的异常回溯).


## 为什么收不到 xxx 事件?

请检查 `Mirai Console` 的配置, 你账号的 `PROTOCOL` (登录协议) 影响接收事件的类型. 这不是 `Ariadne` 的问题.

`NugetEvent` 需要 `Mirai` 的登录协议是 `ANDROID_PHONE/IPAD/MACOS` 中的一种

`ANDROID_PAD/ANDROID_WATCH` 协议由于腾讯服务器原因并不能接受 `NugetEvent`.

## 为什么不像 Application 一样支持 Mirai Code?

`Ariadne` 只支持构造 `Mirai Code` 而无法转换, 是因为我们不想鼓励用户先转换成 `Mirai Code`, 之后再对文本化元素进行处理.

如果你喜欢这种风格, `OneBot` 系列可能更适合你.

## 文档里怎么没有 xxx 的介绍?

`Ariadne` 是一个非常庞大的框架, 有许许多多的方法与函数, 自然无法面面俱到.

目前 `Ariadne` 的 `API 文档` 已经支持搜索功能, 你可以搜索自己想要的功能, 或者利用 `GitHub` 搜索源码.

如果你说的是 `HTTPAdapter` 与 `WebsocketAdapter` 的话, 因为 `Ariadne` 重点目前不在这里, 所以并没有怎么动 (而且可能有潜在 bug)...

## 多媒体元素的 get_bytes 方法为什么会存储 base64 属性?

你可能会有这个迷惑:

```py
img = Image(url=...)
await img.get_bytes()
assert img.base64 is not None
```

这是正常且符合设计的, 因为:

-   这个设计加速了后续的 `get_bytes` 操作.
-   `url` 优先级高于 `base64`, 不会对发送产生任何影响.
-   可以保证 `asPersistentString` 完整存储了图片数据, 以防止不可靠 `url` 影响.

可能后续会添加一个 `remove_url` 的仅关键字参数.

## TROUBLESHOOTING - 常见故障排查

> 本部分用于排查常见用户错误.

### 发不出消息，且控制台显示 `Failed to send message, your account may be blocked.`

你的账号可能被 **风控** 了. 请等待几天后再试.

### MCL 显示 `Cannot download package "net.mamoe:mirai-api-http"`

如果你的 MCL 显示以下错误输出:

```text
[INFO] Verifying "net.mamoe:mirai-api-http" v2.5.0
[ERROR] "net.mamoe:mirai-api-http" is corrupted.
[ERROR] Cannot download package "net.mamoe:mirai-api-http"
[ERROR] The local file "net.mamoe:mirai-api-http" is still corrupted, please check the network.
```

请手动下载 `mirai-api-http` 包, 并将其放置于 `MCL` 的 `plugins` 目录下.

之后便可以安全忽略这个错误. (这是因为 `mirai-api-http` 的维护者忘记发布 `mirai-api-http` 到 maven 仓库托管了, 详见 [这里](https://github.com/project-mirai/mirai-api-http/issues/557#issuecomment-1099900036))

### ClientConnectorError

若在运行时出现如下报错：
```text
2022-08-16 13:16:41.372 | WARNING  | graia.amnesia.builtins.aiohttp:connection_manage:277 - ClientConnectorError(ConnectionKey(host='127.0.0.1', port=8899, is_ssl=False, ssl=None, proxy=None, proxy_auth=None, proxy_headers_hash=None), ConnectionRefusedError(22, 'The remote computer refused the network connection', None, 1225, None))
2022-08-16 13:16:41.372 | WARNING  | graia.ariadne.connection.ws:_:79 - Websocket reconnecting in 5s...
2022-08-16 15:16:46.592 | WARNING | graia.ariadne.connection.ws::84 - Websocket reconnecting...
2022-08-16 15:16:46.626 | INFO | graia.ariadne.connection.ws::91 - Websocket connection closed
```
请检查以下内容：

1. 查看 `mirai-concole-loader(mcl)` 是否启动成功

2. 查看 `mirai-api-http(mah)` 是否启动成功

3. 查看 `mirai-api-http(mah)` 版本是否为 `2.x`（仅支持 `2.x` ）

4. 查看 `mirai-api-http(mah)` 是否配置正确，详细配置请看 [配置 mirai-api-http-v2](./mah-install.md)

5. 查看是否在 `mirai-concole-loader(mcl)` 中登录了帐号

6. 若在 `mirai-concole-loader(mcl)` 中出现类似 `W/net.mamoe.mirai-api-http: USING INITIAL KEY, please edit the key` 的信息，请更换新的 `verifyKey` 后重启尝试

7. 查看是否同时启动了多个 `mirai-console-loader(mcl)`

8. `Python` 版本 (3.8 以上)

9. `Ariadne` 版本是否为最新 (![PyPI](https://img.shields.io/pypi/v/graia-ariadne?label=%20))

10. 其他 `Graia Project` 相关的库是否为最新 (e.g. `graia-saya` `graia-scheduler`)

11. `Ariadne` 配置是否与 `mirai-api-http` 相同. (包括 QQ 号，地址和验证密钥)

### yamlDecodingException

若在运行时出现如下报错：
```text
2022-04-30 18:34:34 E/net.mamoe.mirai-api-http: net.mamoe.yamlkt.YamlDecodingException:There must be a COLON between class key and value but found null for 'setting'
```

请尝试重新粘贴 `mirai-api-http` 配置，或更换端口，可能是有不可见字符混入配置文件

### Address in use

1. 检查是否开启了多个 `mirai-console-loader(mcl)`
2. 检查 `mirai-api-http(mah)` 使用的端口是否为常用端口，如 `80` `443` `8080` `8000` 等，该情况下请更换为非常用端口，如 `21476` `47683` 等
3. 检查 `mirai-api-http(mah)` 使用的端口是否被其他软件占用

??? question "如何检查是否开启了多个 `mcl`？"

    - Windows

        > 打开任务管理器，检查是否有多个 Java 正在运行

    - Linux / macOS

        > 打开终端，输入 `ps -ef | grep "mcl" | grep -v "grep"`，检查是否有多个 `mcl` 正在运行

### 当前QQ版本过低

请参考 [mirai 论坛中的解决方案](https://mirai.mamoe.net/topic/223/%E6%97%A0%E6%B3%95%E7%99%BB%E5%BD%95%E7%9A%84%E4%B8%B4%E6%97%B6%E5%A4%84%E7%90%86%E6%96%B9%E6%A1%88)

### java.lang.illegalStateException: plugin 'net.mamoe.mirai-api-http' is already loaded and cannot be reloaded

前往 `mirai-console-loader` 的 `plugin` 文件夹下删除重复的 `mirai-api-http` 插件

### /lib/x86_64-linux-gnu/libc.so.6: version GLIBC_2.28 not found

请使用 `musl` 版本的 [`mcl-installer`](https://https://github.com/iTXTech/mcl-installer/releases)

一般为 `mcl-installer-{版本}-linux-{你的系统架构}-musl`

### 日志显示已发送图片，但是QQ无法显示

账号被腾讯风险控制，尝试开关设备锁、重新登录、或者登录满一至两周后再试。

> ## 消息时提示 graia.ariadne.exception.RemoteException

该类报错需要读取错误详情

* `MessageSvcPbSendMsg.Response.Failed(resultType=46, ...)`
    * 账号被冻结群消息发送，可手动登录机器人账号发送群消息解除冻结。