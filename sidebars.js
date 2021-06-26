module.exports = {
  docs: [
    {
      type: 'category',
      label: "Broadcast Control",
      items: [
        {
          type: 'category',
          label: "Basic", // 基础
          items: [
            'hello-world', // Hello, World!
            'event-and-post', // 事件与推送
            'dispatcher', // 参数解析器
            'dispatcher-lifecycle', // 参数解析器的生命周期
            /*'decorator', // 参数装饰器
            'depend', // 依赖注入
            'middleware', //中间件
            'interrupt', // 中断
            'namespace' // 命名空间
	    */
          ].map(value => `broadcast/basic/${value}`)
        },/*
        {
          type: 'category',
          label: "Adcance", // 高级
          items: [
            'dispatcher-mixin', //混入(Mixin)模式
            'proxy-mode', // 代理(Proxy)模式
            'event-listener', // 事件监听器
            'event-propagation-and-priority', // 事件传播与优先级
            'special-return-value', // 特殊返回值
            'outside-of-event', // 事件之外的用户空间
            'headless-decorator', // 无头装饰器
          ].map(value => `broadcast/advance/${value}`)
        },
        'broadcast/the-origin-of-everything', // 一切的开始
        {
          type: 'category',
          label: "Abyss", // 遁入深渊
          items: [
            'about-abyss',
            'executor-and-exectarget', // 执行器(Executor)与被执行对象(ExecTarget)
            'dispatchable-with-schema', // 使用模型(Model)
            'just-executor-no-eventbus', // 只用执行器
            'universal-event-or-meta-event', // 通用事件，或者说元事件
            'dispatcher-inject', // 参数解析器注入
            'more-than-eventbus' // 不只是事件总线
          ].map(value => `broadcast/abyss/${value}`)
        },
        'broadcast/the-future' // 展望未来*/
      ]
    },
  ],
};
