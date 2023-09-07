# RabbitMQ
`RabbitMQ` 是一个开源、高性能、可靠的消息队列软件，用于在应用程序之间进行异步通信。它实现了 `AMQP（Advanced Message Queuing Protocol）`协议，提供了强大的消息传递功能和灵活的消息路由机制。

[官网地址](https://www.rabbitmq.com/)

## 关键特点
- **消息队列**：`RabbitMQ` 提供了消息队列的功能，用于将生产者发送的消息存储在服务器上，并将其传递给消费者进行处理。
- **可靠性**：`RabbitMQ` 使用持久化机制来确保即使在发生故障时也不会丢失消息。它将消息存储在磁盘上，并支持消息的复制和故障转移。
- **灵活的路由**：`RabbitMQ` 提供了丰富的路由选项，包括直接交换机、主题交换机、扇形交换机等，使你可以根据消息的内容和标签将其发送到不同的队列中。
- **发布/订阅模式**：`RabbitMQ` 支持发布/订阅模式，允许多个消费者同时订阅同一个队列，从而实现消息广播和多播。
- **高可用性**：`RabbitMQ` 可以配置成集群模式，多台服务器共同组成一个集群，提供高可用性和横向扩展能力。
- **插件系统**：`RabbitMQ` 提供了丰富的插件系统，可以扩展其功能，如消息转换、身份验证、监控等。
::: tip
`RabbitMQ` 在分布式系统、微服务架构和异步任务处理等场景中广泛应用。它易于使用、稳定可靠，并有大量的客户端库和工具支持，如 `Java`、`Python`、`JavaScript` 等语言的客户端。
:::

## GO 中使用 RabbitMQ
要在 `Go` 中使用 `RabbitMQ`，您需要使用 `RabbitMQ` 的官方 `Go` 客户端库，它叫做 "`amqp`"。以下是一个简单的示例，展示了如何在 `Go` 中使用 `RabbitMQ` 发送正常消息和延时消息。

首先，确保您已经安装 `RabbitMQ` 并且 `RabbitMQ` 服务器正在运行。

**安装 "amqp" Go 客户端库:**
~~~shell
go get github.com/streadway/amqp
~~~
**发送正常消息:**
~~~go
package main

import (
    "fmt"
    "log"

    "github.com/streadway/amqp"
)

func main() {
    // 连接 RabbitMQ 服务器
    conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    // 创建一个通道
    ch, err := conn.Channel()
    if err != nil {
        log.Fatal(err)
    }
    defer ch.Close()

    // 声明一个队列
    queueName := "myqueue"
    _, err = ch.QueueDeclare(
        queueName, // 队列名称
        false,     // 持久性
        false,     // 自动删除
        false,     // 排他性
        false,     // 不阻塞
        nil,       // 额外参数
    )
    if err != nil {
        log.Fatal(err)
    }

    // 发送消息到队列
    message := "Hello, RabbitMQ!"
    err = ch.Publish(
        "",        // 交换机
        queueName, // 队列名称
        false,     // 强制
        false,     // 立即
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(message),
        },
    )
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Sent message: %s\n", message)
}
~~~
**发送延时消息:**
要发送延时消息，您可以结合 `RabbitMQ` 的 `TTL（Time-To-Live`）和**死信队列机制**。以下是一个示例代码，用于发送延时消息：
~~~go
package main

import (
    "fmt"
    "log"

    "github.com/streadway/amqp"
)

func main() {
    // 连接 RabbitMQ 服务器
    conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
    if err != nil {
        log.Fatal(err)
    }
    defer conn.Close()

    // 创建一个通道
    ch, err := conn.Channel()
    if err != nil {
        log.Fatal(err)
    }
    defer ch.Close()

    // 声明一个交换机
    exchangeName := "delayed-exchange"
    err = ch.ExchangeDeclare(
        exchangeName, // 交换机名称
        "x-delayed-message", // 交换机类型，注意这是 RabbitMQ 插件 "rabbitmq_delayed_message_exchange" 的类型
        true,  // 持久性
        false, // 自动删除
        false, // 内部
        false, // 不阻塞
        map[string]interface{}{
            "x-delayed-type": "direct", // 声明交换机的类型，direct、topic、fanout 等
        },
    )
    if err != nil {
        log.Fatal(err)
    }

    // 声明一个队列
    queueName := "delayed-queue"
    _, err = ch.QueueDeclare(
        queueName, // 队列名称
        true,      // 持久性
        false,     // 自动删除
        false,     // 排他性
        false,     // 不阻塞
        map[string]interface{}{
            "x-message-ttl":    5000, // 消息的 TTL，以毫秒为单位
            "x-dead-letter-exchange":    "",
            "x-dead-letter-routing-key": "myqueue", // 死信消息发送的目标队列
        },
    )
    if err != nil {
        log.Fatal(err)
    }

    // 发送消息到队列
    message := "Hello, Delayed RabbitMQ!"
    err = ch.Publish(
        exchangeName, // 交换机
        "",           // 队列名称
        false,        // 强制
        false,        // 立即
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(message),
        },
    )
    if err != nil {
        log.Fatal(err)
    }

    fmt.Printf("Sent delayed message: %s\n", message)
}
~~~
在上述代码中，我们创建了一个交换机类型为 "`x-delayed-message`" 的交换机，并设置了消息的 `TTL（Time-To-Live）` 为 5 秒。这会导致消息被延时发送到队列，然后通过死信队列机制发送到目标队列（"`myqueue`"）。
::: tip
请确保在代码中的连接字符串、队列名称和其他参数中适当配置您的 `RabbitMQ` 环境。
:::

### 封装的完整代码
**封装代码:**
~~~go
package rabbitmq

import (
    "fmt"
    "log"
    "strconv"
    "strings"
    "yoyo/pkg/config"

    "github.com/streadway/amqp"
)

// 消息体：DelayTime 仅在 SendDelayMessage 方法有效
type Message struct {
    DelayTime int // desc:延迟时间(秒)
    Body      string
}

type MessageQueue struct {
    conn         *amqp.Connection // amqp链接对象
    ch           *amqp.Channel    // channel对象
    ExchangeName string           // 交换器名称
    RouteKey     string           // 路由名称
    QueueName    string           // 队列名称
}

// 消费者回调方法
type Consumer func(amqp.Delivery)

// NewRabbitMQ 新建 rabbitmq 实例
func NewRabbitMQ(exchange, route, queue string) MessageQueue {
    var messageQueue = MessageQueue{
        ExchangeName: exchange,
        RouteKey:     route,
        QueueName:    queue,
    }

    // 建立amqp链接
    conn, err := amqp.Dial(fmt.Sprintf(
        "amqp://%s:%s@%s:%s%s",
        config.Viper.GetString("rabbitmq.username"),
        config.Viper.GetString("rabbitmq.password"),
        config.Viper.GetString("rabbitmq.host"),
        config.Viper.GetString("rabbitmq.port"),
        "/"+strings.TrimPrefix(config.Viper.GetString("rabbitmq.vhost"), "/"),
    ))
    failOnError(err, "Failed to connect to RabbitMQ")
    messageQueue.conn = conn

    // 建立channel通道
    ch, err := conn.Channel()
    failOnError(err, "Failed to open a channel")
    messageQueue.ch = ch

    // 声明exchange交换器
    messageQueue.declareExchange(exchange, nil)

    return messageQueue
}

// SendMessage 发送普通消息
func (mq *MessageQueue) SendMessage(message Message) {
    err := mq.ch.Publish(
        mq.ExchangeName, // exchange
        mq.RouteKey,     // route key
        false,
        false,
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(message.Body),
        },
    )
    failOnError(err, "send common msg err")
}

// SendDelayMessage 发送延迟消息
func (mq *MessageQueue) SendDelayMessage(message Message) {
    delayQueueName := mq.QueueName + "_delay:" + strconv.Itoa(message.DelayTime)
    delayRouteKey := mq.RouteKey + "_delay:" + strconv.Itoa(message.DelayTime)

    // 定义延迟队列(死信队列)
    dq := mq.declareQueue(
        delayQueueName,
        amqp.Table{
            "x-dead-letter-exchange":    mq.ExchangeName, // 指定死信交换机
            "x-dead-letter-routing-key": mq.RouteKey,     // 指定死信routing-key
        },
    )

    // 延迟队列绑定到exchange
    mq.bindQueue(dq.Name, delayRouteKey, mq.ExchangeName)

    // 发送消息，将消息发送到延迟队列，到期后自动路由到正常队列中
    err := mq.ch.Publish(
        mq.ExchangeName,
        delayRouteKey,
        false,
        false,
        amqp.Publishing{
            ContentType: "text/plain",
            Body:        []byte(message.Body),
            Expiration:  strconv.Itoa(message.DelayTime * 1000),
        },
    )
    failOnError(err, "send delay msg err")
}

// Consume 获取消费消息
func (mq *MessageQueue) Consume(fn Consumer) {
    // 声明队列
    q := mq.declareQueue(mq.QueueName, nil)

    // 队列绑定到exchange
    mq.bindQueue(q.Name, mq.RouteKey, mq.ExchangeName)

    // 设置Qos
    err := mq.ch.Qos(1, 0, false)
    failOnError(err, "Failed to set QoS")

    // 监听消息
    msgs, err := mq.ch.Consume(
        q.Name, // queue name,
        "",     // consumer
        false,  // auto-ack
        false,  // exclusive
        false,  // no-local
        false,  // no-wait
        nil,    // args
    )
    failOnError(err, "Failed to register a consumer")

    // forever := make(chan bool), 注册在主进程，不需要阻塞

    go func() {
        for d := range msgs {
            fn(d)
            d.Ack(false)
        }
    }()

    log.Printf(" [*] Waiting for logs. To exit press CTRL+C")
    // <-forever
}

// Close 关闭链接
func (mq *MessageQueue) Close() {
    mq.ch.Close()
    mq.conn.Close()
}

// declareQueue 定义队列
func (mq *MessageQueue) declareQueue(name string, args amqp.Table) amqp.Queue {
    q, err := mq.ch.QueueDeclare(
        name,
        true,
        false,
        false,
        false,
        args,
    )
    failOnError(err, "Failed to declare a delay_queue")

    return q
}

// declareQueue 定义交换器
func (mq *MessageQueue) declareExchange(exchange string, args amqp.Table) {
    err := mq.ch.ExchangeDeclare(
        exchange,
        "direct",
        true,
        false,
        false,
        false,
        args,
    )
    failOnError(err, "Failed to declare an exchange")
}

// bindQueue 绑定队列
func (mq *MessageQueue) bindQueue(queue, routekey, exchange string) {
    err := mq.ch.QueueBind(
        queue,
        routekey,
        exchange,
        false,
        nil,
    )
    failOnError(err, "Failed to bind a queue")
}

// failOnError 错误处理
func failOnError(err error, msg string) {
    if err != nil {
        log.Fatalf("%s : %s", msg, err)
    }
}
~~~
**消费消息:**
~~~go
func registerRabbitMQConsumer() {
    // 新建连接
    rabbit := rabbitmq.NewRabbitMQ("yoyo_exchange", "yoyo_route", "yoyo_queue")
    // 一般来说消费者不关闭，常驻进程进行消息消费处理
    // defer rabbit.Close() 

    // 执行消费
    rabbit.Consume(func(d amqp.Delivery) {
        //logger.Info("rabbitmq", zap.String("rabbitmq", string(d.Body)))
    })
}
~~~
**发送消息:**
~~~go
rabbit := rabbitmq.NewRabbitMQ("yoyo_exchange", "yoyo_route", "yoyo_queue")
defer rabbit.Close()
rabbit.SendMessage(rabbitmq.Message{Body: "这是一条普通消息"})
rabbit.SendDelayMessage(rabbitmq.Message{Body: "这是一条延时5秒的消息", DelayTime: 5})
~~~








