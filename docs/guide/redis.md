# Redis
## 特性

- 速度快
- 持久化
- 多种数据结构
- 支持多种编辑语言
- 功能丰富
- 简单
- 主从复制
- 高可用与分布式

## 典型应用场景

- 缓存系统
- 计数器
- 消息队列系统
- 排行榜
- 社交网络
- 实时系统

## 安装

~~~shell
wget http://download.redis.io/releases/redis-3.0.7.tar.gz
tar -xzf redis-3.0.7.tar.gz
ln -s redis-3.0.7 redis
cd redis
make && make install
~~~

## 启动

~~~shell
redis-server		/#默认启动
redis-server --port 6380	#指定端口启动
~~~

配置文件启动

~~~shell
cd redis
mkdir config
cp redis.conf config
cd config
mv redis.conf redis-6381.conf
cat redis-6381.conf | grep -v "#" | grep -v "^$" > redis-6382.conf
rm -rf redis-6381.conf
vim redis-6382.conf
~~~

~~~shell
#配置redis-6382.conf
daemonize yes
port 6382
dir "/root/redis/data"
logfile "6382.log"
~~~

~~~shell
cd /root/redis
mkdir data
redis-server config/redis-6382.conf			#指定配置文件启动
ps -ef | grep redis-server | grep 6382			#查看启动进程
~~~



## 通用命令

- keys 		#遍历所有的key
- dbsize        #计算key的总数
- exists         #判断key是否存在
- del key [key ...]         #删除指定的key-value
- expire key seconds         #key在seconds秒后过期
- ttl key       #查看key剩余的过期时间
- persist key        #去掉key的过期时间
- type key         #返回key的类型



## 数据结构与内部编码

- string
  - raw
  - int
  - embstr
- hash
  - hashtable
  - ziplist
- list
  - linkedlist
  - ziplist
- set
  - hashtable
  - intset
- zset
  - skiplist
  - ziplist

### 字符串

~~~shell
# key : value
keyname : "{fieldname : '高江华', fieldage : '27', fieldgender : '男'}"
~~~

~~~shell
get key
# 获取key对应的value
mget [key ...]
# 批量获取key对应的value
set key value
# 设置key-value
mset [key value ...]
# 批量设置key-value
setnx key value
# key不存在才能设置(新增操作)
set key value xx
# key存在才能设置(更新操作)
del key
# 删除key-value
incr key
# key自增1, 如果key不存在, 自增后get(key)=1
decr key
# key自减1, 如果key不存在, 自减后get(key)=-1
incrby key k
# key自增k, 如果key不存在, 自增后get(key)=k
decrby key k
# key自减k, 如果key不存在, 自减后get(key)=-k
getset key newvalue
# 设置key的新value, 并返回旧的value
append key value
# 将value追加到旧的value上
strlen key
# 返回字符串的长度(注意中文)
incrbyfloat key 3.5
# 增加key对应的值3.5
getrange key start end
# 获取字符串指定开始下标start到结束下标end的值
setrange key index value
# 设置指定下标所对应的值
~~~



### 哈希

~~~shell
# key : value
keyname : {
	fieldname : '高江华'
	fieldage : '27'
	fieldgender : '男' 
}
~~~

~~~shell
hget key field
# 获取hash key对应field的value
hgetall key
# 获取hash key所有属性和值
hmget key field1 field2 ... fieldN
# 批量获取hash key的一批field对应的值
hset key field value
# 设置hash key对应field的value
hmset key field1 value1 field2 value2 ... fieldN valueN
# 批量设置hash key的一批field value
hdel key field
# 删除hash key对应field的value
hexists key field
# 判断hash key是否有field
hlen key
# 获取hash key field的数量
hvals key
# 返回hash key对应所有field的value
hkeys key
# 返回hash key对应所有的field
~~~



### 列表

~~~shell
# key : value
keyname : [ '高江华', '27', '男', '高江华', '高江华', '27' ]
~~~

~~~shell
rpush key value1 value2 ... valueN
# 从列表右侧插入值(1~N个)
lpush key value1 value2 ... valueN
# 从列表左侧插入值(1~N个)
linsert key before|after value newvalue
# 在list key指定的value的前|后插入newvalue
rpop key
# 从列表右侧弹出一个value
lpop key
# 从列表左侧弹出一个value
lrem key count value
# 根据count值, 从列表中删除所有value一样的项
# count > 0, 从左到右, 删除最多count个value一样的项
# count < 0, 从右到左, 删除最多Math.abs(count)个value一样的项
# count = 0, 删除所有value一样的项
ltrim key start end
# 按照索引范围start至end修剪列表(保留范围内, 删除范围外)
lrange key start end
# 获取列表指定索引范围start至end的所有项(包含end)
lindex key index
# 获取列表指定索引的项
llen key
# 获取列表的长度
lset key index newvalue
# 设置列表指定索引值为newvalue
blpop key timeout
# lpop阻塞版(延迟执行), timeout延迟时间, timeout=0为不阻塞
brpop key timeout
# rpop阻塞版(延迟执行), timeout延迟时间, timeout=0为不阻塞
~~~

~~~shell
###TIPS口诀
lpush + lpop = stack(栈:先进后出)
lpush + rpop = queue(队列:先进先出)
lpush + ltrim = capped collection(控制列表大小)
lpush + brpop = message queue(消息队列)
~~~



### 集合

~~~shell
# key : value
keyname : [['高江华'], ['27'], ['男']]
~~~

~~~shell
sadd key element
# 向集合key添加element(可多个)(如果element存在, 添加失败)
srem key element
# 将集合key中的element(可多个)移除掉
scard key
# 计算集合大小
sismember key element
# 判断element是否在集合中(1表示存在)
srandmember key count
# 从集合中随机挑count个元素
spop key
# 从集合中随机弹出一个元素
smembers key
# 获取集合中所有元素(结果是无序的)
~~~

~~~shell
###集合间api
sdiff key1 key2
# 差集(取出key1在key2中不存在的元素)
sinter key1 key2
# 交集(取出key1在key2中存在的元素)
sunion key1 key2
# 并集(取出key1和key2所有的元素并去重)
sdiff|sinter|sunion + store destkey
# 将差集, 交集, 并集结果保存在destkey中
~~~

~~~shell
###TIPS口诀
sadd = tagging(标签)
spop/srandmember = random item(随机数)
sadd + sinter = social graph(社交场景)
~~~



### 有序集合

~~~shell
# key : value
keyname : [[["高江华"], 33.0], [["灰太狼"], 66.0], [["懒羊羊"], 99.0]]
~~~

~~~shell
zadd key score element
# 向有序集合key中添加score和element(可多个)(如果element存在, 添加失败)
zrem key element
# 将有序集合key中的element(可多个)移除掉
zscore key element
# 返回有序集合key中element元素的分数score
zincrby key increScore element
# 增加有序集合key中element元素的分数score
zdecrby key decreScore element
# 减少有序集合key中element元素的分数score
zcard key
# 返回有序集合的元素的总个数
zrank key elemet
# 返回有序集合key中element的排名
zrange key start end [withscores]
# 返回有序集合key指定索引范围start至end的元素[加上withscores返回分数]
zrangebyscore key minScore maxScore [withscores]
# 返回有序集合key指定分数范围minScore至maxScore的元素[加上withscores返回分数]
zcount key minScore maxScore
# 返回有序集合key指定分数范围minScore至maxScore的个数
zremrangebyrank key start end
# 删除有序集合key指定索引范围start至end的元素
zremrangebyscore key minScore maxScore
# 删除有序集合key指定分数范围minScore至maxScore的元素
~~~



## 客户端

- Jedis

  - 直连

  ~~~html
  <--maven依赖-->
  <dependency>
  	<groupId>redis.clients</groupId>    
      <artifactId>jedis</artifactId>
      <version>2.9.0</version>
      <type>jar</type>
      <scope>compile</scope>
  </dependency>
  ~~~

  ~~~java
  // 生成一个Jedis对象, 这个对象负责和指定Redis节点进行通信
  Jedis jedis = new Jedis("127.0.0.1", 6379);
  // Jedis执行set操作
  jedis.set("hello", "world");
  // Jedis执行get操作
  String value = jedis.get("hello");	//value="world"
  ~~~

  - 连接池

  ~~~java
  // 初始化连接池
  GenericObjectPoolConfig poolConfig = new GenericObjectPoolConfig();
  // 创建连接池对象
  JedisPool jedisPool = new JedisPool(poolConfig, "127.0.0.1", 6379);
  // 创建jedis变量
  Jedis jedis = null;
  // 操作步骤
  try {
      // 从连接池获取jedis对象
      jedis = jedisPool.getResource();
      // 执行操作
      jedis.set("hello", "world");
  }catch (Exception e) {
  	e.printStackTrace();
  }finally {
  	if (jedis != null)
      //如果使用JedisPool, close操作不是关闭连接, 代表归还连接池
     	jedis.close();
  }
  ~~~

|        |               优点               |                             缺点                             |
| :----: | :------------------------------: | :----------------------------------------------------------: |
|  直连  |             简单方便             |                   存在每次新建/关闭TCP开销                   |
|        |     适用于少量长期连接的场景     |              资源无法控制, 存在连接池泄露的可能              |
|        |                                  |                     Jedis对象线程不安全                      |
| 连接池 |   Jedis预先生成, 降低开销使用    | 相对于直连, 使用相对麻烦, 尤其在资源的管理上需要很多参数来保证, 一旦规划不合理也会出现问题 |
|        | 连接池的形式保护和控制资源的使用 |                                                              |



## 瑞士军刀

- 慢查询
- pipeline( 流水线 )
- 发布订阅
- Bitmap( 位图 )
- HyperLogLog
- GEO



### 慢查询

Redis生命周期

1. 发送命令
2. 排队等候
3. 执行命令
4. 返回结果

说明

1. 慢查询发生在第3阶段
2. 客户端超时不一定是慢查询, 但慢查询是客户端超时的一个可能因素

两个配置

- slowlog-max-len
  1. 先进先出的队列
  2. 固定长度
  3. 保存在内存中
- slowlog-log-slower-than
  1. 慢查询阈值(单位: 微秒)
  2. slowlog-log-slower-than=0  记录所有命令
  3. slowlog-log-slower-than<0  不记录任何命令

~~~shell
#默认值
config get slowlog-max-len #128
config get slowlog-log-slower-than #10000
#手动配置
config set slowlog-max-len 1000
config set slowlog-log-slower-than 100000
~~~

慢查询命令

~~~shell
slowlog get [n]
# 获取慢查询队列, 指定条数n
slowlog len
# 获取慢查询队列长度
slowlog reset
# 清空慢查询队列
~~~



### 流水线

|  命令  |    N个命令操作    | 1次pipeline(n个命令) |
| :----: | :---------------: | :------------------: |
|  时间  | n次网络 + n次命令 |  1次网络 + n次命令   |
| 数据量 |      1条命令      |       n条命令        |

java中使用

~~~java
//执行10000次命令, 分100次流水线, 每次流水线执行100条命令
Jedis jedis = new Jedis("127.0.0.1", 6379);
for (int i = 0; i < 100; i++) {
    Pipeline pipeline = jedis.pipelined();
    for (int j = i * 100; j < (i + 1) * 100; j++) {
        pipeline.hset("hashkey:" + j, "field" + j, "value" + j);
    }
    pipeline.syncAndReturnAll();
}
~~~

M操作( 批量操作的命令: mget, mset )与pipeline区别

1. M操作是原子操作, 与其他命令一起排队
2. pipeline不是原子操作, 会被拆分为多个子命令进行排队, 返回结果是顺序的

使用建议

1. 注意每次pipeline携带数据量
2. pipeline每次只能作用在一个Redis节点上
3. M操作与pipeline区别



### 发布订阅

~~~shell
publish channel message
# 向指定的channel频道发送message消息, 返回订阅者个数
subscribe [channel ...]
# 订阅指定的channel频道(可一个或多个), 返回频道的消息
unsubscribe [channel ...]
# 取消指定的channel频道的订阅(可一个或多个)
psubscribe [pattern ...]
# 订阅指定的模式
punsubscribe [pattern ...]
# 退订指定的模式
pubsub channels
# 列出至少有一个订阅者的频道
pubsub numsub [channel ...]
# 列出指定频道的订阅者数量
pubsub numpat
# 列出被订阅模式的数量
~~~



### 位图

~~~shell
setbit key offset value
# 给位图key指定索引offset设置value值
getbit key offset
# 获取位图key指定索引offset的值
bitcount key [start end]
# 获取位图key指定范围(start到end, 单位为字节, 如果不指定就是获取全部)位置为1的个数
bitop op destkey key [key ...]
# 做多个Bitmap的op(and(交集), or(并集), not(非), xor(异或))操作将结果保存到destkey
bitpos key targetBit [start] [end]
# 计算位图指定范围(start到end, 单位为字节, 如果不知道就是获取全部)第一个偏移量对应的值等于targetBit的位置
~~~

对比set与Bitmap

| 数据类型 |                  每个userId占用空间                  | 需要存储的用户量 |         全部内存量         |
| :------: | :--------------------------------------------------: | :--------------: | :------------------------: |
|   set    | 32位(假设userid用的是整型, 实际很多网站用的是长整型) |    50,000,000    | 32位 * 50,000,000 = 200MB  |
|  Bitmap  |                         1位                          |   100,000,000    | 1位 * 100,000,000 = 12.5MB |



### HyperLogLog

- 基于HyperLogLog算法 : 极小空间完成独立数量统计
- 本质还是字符串

~~~shell
pfadd key element [element ...]
# 向hyperloglog key中添加元素(可添加多个)
pfcount key [key ...]
# 计算hyperloglog的独立总数
pfmerge destkey sourcekey [sourcekey ...]
# 合并多个hyperloglog
~~~

内存消耗(百万独立用户)

|       |     内存消耗     |
| :---: | :--------------: |
|  1天  |       15KB       |
| 1个月 |      450KB       |
|  1年  | 15KB * 365 ≈ 5MB |

注意点

- 是否能容忍错误? ( 错误率 : 0.81% )
- 是否需要单条数据?



### GEO

- 地理信息定位 : 存储经纬度, 计算两地距离, 范围计算等
- 实际是zset类型

~~~shell
geoadd key longitude latitude member [longitude latitude member ...]
# 向geo key中添加地理位置信息longitude(经度) latitude(纬度) member(标识)(可添加多个)
zrem key member
# 删除geo key中指定的member(标识)的元素
geopos key member [member ...]
# 获取geo key中指定member标识的地理位置信息(可获取多个)
geodist key member1 member2 [unit]
# 获取geo key中指定member1(标识1)与member2(标识2)之间的距离
# unit(单位): m(米), km(千米), mi(英里), ft(英尺)
georadius key longitude latitude radiusm|km|ft|mi [withcoord] [withdist] [withhash] [COUNT count] [asc|desc] [store key] [storedist key]
# 获取geo key中指定经纬度的指定位置范围内的地理位置信息集合
georadiusbymember key member radiusm|km|ft|mi [withcoord] [withdist] [withhash] [COUNT count] [asc|desc] [store key] [storedist key]
# 获取geo key中指定member(标识)的指定位置范围内的地理位置信息集合

# withcoord : 返回结果中包含经纬度
# withdist : 返回结果中包含距离中心节点位置
# withhash : 返回结果中包含geohash
# COUNT count : 指定返回结果的数量
# asc|desc : 返回结果按照距离中心节点的距离做升序或者降序
# store key : 将返回结果的地理位置信息保存到指定键
# storedist key : 将返回结果距离中心节点的距离保存到指定键
~~~



## 持久化

- redis所有数据保存在内存中, 对数据的更新将异步保存到磁盘上

持久化方式

1. 快照
   - MySQL Dump
   - Redis RDB
2. 写日志
   - MySQL Binlog
   - Hbase Hlog
   - Redis AOF

### RDB

- 二进制文件, 保存在硬盘中

~~~shell
save
# 同步创建RDB文件, 会出现阻塞情况, 会替换掉旧的RDB
bgsave
# 异步创建RDB文档, 使用linux的fork()函数生成一个子进程去创建, fork慢会发生阻塞
~~~

|  命令  |       save       |       bgsave       |
| :----: | :--------------: | :----------------: |
| IO类型 |       同步       |        异步        |
| 阻塞?  |        是        | 是(阻塞发生在fork) |
| 复杂度 |       O(n)       |        O(n)        |
|  优点  | 不会消耗额外内存 |  不阻塞客户端命令  |
|  缺点  |  阻塞客户端命令  | 需要fork会消耗内存 |

RDB配置

~~~shell
save 900 1			#900秒内改变了1条数据
save 300 10			#300秒内改变了10条数据
save 60 10000		#60秒内改变了10000条数据
#满足上面任意一条都会自动bgsave生成RDB文件
dbfilename dump.rdb
#配置生成的RDB文件的名称为dump
dir ./
#配置生成的RDB文件在./路径下
stop-writes-on-bgsave-error yes
#bgsave在写入的过程中发生错误是否停止
rdbcompression yes
#rdb文件是否采用压缩格式
rdbchecksum yes
#是否对rdb文件进行校验和校验(用于保证在通信中的数据完整性和准确性)
~~~

最佳配置

~~~shell
dbfilename dump-${port}.rdb
#使用port端口号以区分多个redis服务
dir /bigdiskpath
#自定义大硬盘的目录
stop-writes-on-bgsave-error yes
rdbcompression yes
rdbchecksum yes
~~~

触发生成RDB文件的其他方式

1. 全量复制
   - 在主从复制的时候, 主会自动生成RDB文件
2. debug reload
   - debug重启, 也会触发生成RDB文件
3. shutdown命令
   - 有save参数, 会生成RDB文件



### AOF

- 每执行一条命令都会写入到AOF文件中

RDB存在的问题

1. O(n)数据: 耗时
2. fork(): 消耗内存, copy-on-write策略
3. Disk I/O: IO性能
4. 不可控, 容易丢失数据

AOF的三种策略

1. always
   - 写命令刷新缓冲区, 每执行一条命令都会根据缓冲区策略同步到AOF文件中
2. everysec
   - 写命令刷新缓冲区, 每秒执行一次缓冲区同步到AOF文件中
3. no
   - 由操作系统来决定什么时候刷新缓存区同步AOF文件

三种策略的比较

| 命令 |              always               |           everysec            |   no   |
| :--: | :-------------------------------: | :---------------------------: | :----: |
| 优点 |            不丢失数据             | 每秒一次fsync, IO开销相对小点 | 不用管 |
| 缺点 | IO开销大, 一般的sata盘只有几百TPS |           丢1秒数据           | 不可控 |



AOF重写优化

- 多条相同的命令, 只保留最后结果的命令

- 过滤掉过期数据的命令

优点

1. 减少硬盘占用量
2. 加快恢复速度

~~~shell
bgrewriteaof
# fock子进程在redis缓存中进行AOF重写, 并不是重写AOF文件
~~~

配置

~~~shell
auto-aof-rewrite-min-size
# 设定当AOF文件多大的时候才开始AOF重写
auto-aof-rewrite-percentage
# 增长率, 依据上一次达到重写要求的尺寸乘以增长率设定为下一次需要重写的尺寸要求
# 如: 第一次100MB, 增长率200%, 第二次需要AOF文件大小达到200MB才会进行重写
~~~

统计

~~~shell
aof_current_size
# 实时统计AOF文件大小(单位: 字节)
aof_base_size
# AOF上次启动和重写的大小(单位: 字节)
~~~

配置文件

~~~shell
appendonly yes
# 是否使用AOF的所有功能
appendfilename "appendonly-${port}.aof"
# 设置AOF文件名, 根据port端口号区分服务
appendfsync everysec
# 设置AOF的同步策略
dir /bigdiskpath
# 自定义大硬盘的目录
no-appendfsync-on-rewrite yes
# 指定是否在后台aof文件rewrite期间调用fsync，默认为no，表示要调用fsync（无论后台是否有子进程在刷盘）。
# Redis在后台写RDB文件或重写AOF文件期间会存在大量磁盘IO，此时，在某些linux系统中，调用fsync可能会阻塞。
auto-aof-rewrite-min-size 64mb
auto-aof-rewrite-percentage 100
~~~





### 总结

|    命令    |  RDB   |     AOF      |
| :--------: | :----: | :----------: |
| 启动优先级 |   低   |      高      |
|    体积    |   小   |      大      |
|  恢复速度  |   快   |      慢      |
| 数据安全性 | 丢数据 | 根据策略决定 |
|    轻重    |   重   |      轻      |



## 常见问题

### fork问题

场景

-  备份时需要生成RDB文件，因此Redis需要触发一次fork。 
-  全量复制场景（包括初次复制或其他堆积严重的情况），主节点需要产生RDB文件来加速同步，同样需要触发fork。 
-  当AOF文件较大，需要合并重写时，也会产生一次fork。 

影响

1. 业务抖动

   原生Redis采用单线程架构，如果在电商大促、热点事件等业务高峰时发生上述fork，会导致Redis阻塞，进而对业务造成雪崩的影响。

2. 内存利用率只有50%

   Fork时子进程需要拷贝父进程的内存空间，虽然是COW，但也要预留足够空间以防不测，因此内存利用率只有50%，也使得成本高了一倍。

3. 容量规模影响

   为减小fork的影响，生产环境上原生Redis单个进程的最大内存量，通常控制在5G以内，导致原生Redis实例的容量大大受限，无法支撑海量数据。



~~~shell
info:latest_fork_usec
# 上一次执行fork的时间
~~~



### 子进程

1. CPU

   - 开销: RDB和AOF文件生成, 属于CPU密集型

   - 不做CPU绑定, 不和CPU密集型应用部署在一起

2. 内存

   - 开销: fork内存开销, copy-on-write
   - 优化: echo never > /sys/kernel/mm/transparent_hugepage/enabled

3. 硬盘

   - 开销: AOF和RDB文件写入, 可以结合iostat, iotop分析

   - 优化: 
     1. 不要和高硬盘负载服务部署在一起: 存储服务, 消息队列等
     2. no-appendfsync-on-rewrite yes : AOF重写期间不要做AOF文件追加操作
     3. 根据写入量决定磁盘类型: 例如ssd
     4. 单机多实例持久化文件目录可以考虑分盘



### AOF追加阻塞

- 如果AOF文件fsync同步时间大于2s，Redis主进程就会阻塞；


- 如果AOF文件fsync同步时间小于2s，Redis主进程就会返回；


- 其实这样做的目的是为了保证文件安全性的一种策略。


 产生的问题：

1. fsync大于2s时候，会阻塞redis主进程，我们都知道redis主进程是用来执行redis命令的，是不能阻塞的。

2. 虽然每秒everysec刷盘策略，但是实际上不是丢失1s数据，实际有可能丢失2s数据。



## 主从复制

- 数据副本
- 扩展读性能
- 一个master可以有多个slave
- 一个slave只能有一个master
- 数据流向是单向的, master到slave

~~~shell
slaveof 192.168.0.5 6379
# 复制主节点192.168.0.5 6379到当前从机上(异步执行)
slaveof no one
# 取消复制, 不允许复制
~~~

配置

~~~shell
slaveof ip port
# 指定主节点IP和端口
slave-read-only yes
# 指定当前从节点只做读操作
~~~



全量复制开销

1. bgsave时间
2. RDB文件网络传输时间
3. 从节点清空数据时间
4. 从节点加载RDB时间
5. 可能的AOF重写时间



##  GaussDB 

- GaussDB(for Redis)由华为云基于存算分离架构自主开发，因此不存在原生Redis的fork调用的场景。 