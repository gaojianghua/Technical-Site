# GRPC
[官网](https://grpc.io/)

## 简介
`gRPC`是一个高性能、开源的通用**RPC**框架，由**Google**主导开发，其主要目标是使得微服务之间的调用更加简单、高效。`gRPC`支持多种语言，并提供了许多高级特性，如负载均衡、双向流、流控、超时、重试等。

以下是gRPC的一些主要特性：
1. **多语言支持**：`gRPC`支持多种语言，包括`Java`、`C#`、`Node.js`、`Ruby`、`Python`、`Go`等，使得你可以在不同的语言中开发和部署服务。
2. **基于HTTP/2**：`gRPC`基于**HTTP/2**协议，支持双向流和流控，可以实现更高的性能和更低的延迟。
3. **使用ProtoBuf**：`gRPC`使用`Protocol Buffers（ProtoBuf）`作为接口定义语言和消息交换格式，**ProtoBuf**是一种语言中立、平台中立、可扩展的序列化结构数据的协议，它比**JSON**和**XML**更小、更快、更简单。

## RPC
1. RPC ( Remote Procedure Call ) 远程过程调用, 简单理解就是一个节点请求另一个节点提供的服务
2. 对应rpc的是本地过程调用, 函数调用是最常见的本地过程调用
3. 将本地过程调用变成远程过程调用会面临各种问题

三大问题:
- Call ID : 远程函数的唯一标识, 让本地知道调用的远程函数是哪种函数
- 序列化与反序列化: 将数据对象设置成某种数据结构进行传输, 通过传输获取到该数据结构的内容反向设置为数据对象进行逻辑处理
- 网络传输: http1.0存在性能问题, 一次性问题. http2.0优化了性能, 可一次性也能长连接

## protobuf
优点:
1. 性能
    - 压缩性好
    - 序列化和反序列化快 ( 比xml和json快2-100倍 )
    - 传输速度快
2. 便捷性
    - 使用简单 ( 自动生成序列化和反序列化代码 )
    - 维护成本低 ( 只维护proto文件 )
    - 向后兼容 ( 不必破坏旧格式 )
    - 加密性好
3. 跨语言
    - 跨平台
    - 支持各种主流语言

缺点:
1. 通用性差
    - json可以任何语言都支持, 但protobuf需要专门的解析器
2. 自解释性差
    - 只有通过proto文件了解数据结构

下载protobuf

地址：https://github.com/protocolbuffers/protobuf/releases

解压指定文件夹，配置环境变量：bin目录

安装grpc-gateway

地址：https://github.com/grpc-ecosystem/grpc-gateway
~~~
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-grpc-gateway
go install github.com/grpc-ecosystem/grpc-gateway/protoc-gen-swagger
go install github.com/grpc-ecosystem/grpc-gateway/v2/protoc-gen-openapiv2
go install google.golang.org/protobuf/cmd/protoc-gen-go
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc
~~~
新建protos/trip.proto
~~~
syntax = "proto3";
package CarRental;
option go_package="./gen";

message Trip {			//以下分别为第几字段
    string start = 1;
    string end = 2;
    int64 duration_dec = 3;
    int64 fee_cent = 4;
}
~~~
新建pb

执行命令
~~~
protoc --go_out=. --go-grpc_out=. user.proto
~~~
