# Mysql
[官方网站](https://www.mysql.com/)
## 数据类型

~~~sql
/*字符串*/
char 		/*定长字符串*/
varchar 	/*变长字符串*/
text 		/*长文本*/
blog 		/*无规则二进制字符串*/

/*整型 (常用tinyint(1)表示布尔型，1 为真，0为假)*/
tinyint     /*1字节 8位*/
smallint    /*2字节 16位*/
mediumint   /*3字节 24位*/
int         /*4字节 32位*/
bigint      /*8字节 64位*/

/*浮点型*/
float		/*(单精度) 4字节*/
double		/*(双精度) 8字节*/
decimal		/*精准类型, 其能指定储存精度，decimal(M,D), 其中M代表总位数，D代表小数位，M-D 代表整数位；比如金钱相关的计算就推荐使用decimal，否则会造成精度丢失问题，*/

/*日期时间*/
date  		/*日期 通常就是 YYYY-MM-DD 格式*/
time		/*时间 格式 hh:mm:ss*/
year		/*年份 YYYY 不建议使用YY*/
datetime	/*日期时间格式，其日期范围为 1001 至 9999 年，精度为秒 占用8位*/
timestamp	/*挺多人称其为时间戳，其实是与Unix时间戳相同而已，从1970年1月1日午夜来表示秒数，最多储存至2038年。其依赖于时区，占用4位*/

/*枚举or集合*/
enum(val1, val2, val3...)	/*储存固定值:其内部使用整型排序，显示时使用字符串，故在排序的时候可能会发生一些奇怪的现象，可以用field进行指定排序; 储存大小为16位*/
set(val1, val2, val3...)	/*类似数组:能存储多个值; 储存大小为64位*/

/*其他*/
bit			/*储存位，坑很大；不建议使用*/
/*尽量不要使用外键，每次外键都会带来额外的性能开销*/
~~~



## 条件词

on:				过滤

where:		 筛选

having:		只能在group by子句中出现的筛选



**详解**

~~~sql
/*
优先级: no -> where -> having
*/

/*
所有的查询都会产生一个中间临时报表，查询结果就是从返回临时报表中得到。
*/

/*
区别:
	on和where后面所跟限制条件的区别，主要与限制条件起作用的时机有关;
	on根据限制条件对数据库记录进行过滤，然后生产临时报表；
	where是在临时报表生产之后，根据限制条件从临时报表中筛选结果;
总结：
	在左外连接中，on会返回左表中的所有记录；而where中，此时相当于inner join，只会返回满足条件的记录。
	
速度：
	因为on限制条件发生时间较早，产生的临时报表数据集要小，因此on的性能要优于where。
*/

/*
区别:
	having和where的区别也是与限制条件起作用时机有关;
	having是在聚集函数计算结果出来之后筛选结果，查询结果只返回符合条件的分组，having不能单独出现，只能出现在group by子句中。
	where是在计算之前筛选结果，如果聚集函数使用where，那么聚集函数只计算满足where子句限制条件的数据。
	
总结：
	where即可以和select等其他子句搭配使用，也可以和group by子句搭配使用，where的优先级要高于having。
	
速度：
	因为where在聚集函数之前筛选数据，having在计算之后筛选分组，因此where的性能要优于having
*/
~~~



## 运算符

~~~sql
=		/*等于*/
>		/*大于*/
<		/*小于*/
>=		/*大于等于*/
<=		/*小于等于*/
<>		/*不等于*/
!=		/*不等于*/
between	min and max		/*筛选min和max之间的*/
is null					/*是空值的*/
is not null				/*不是空值的*/
like					/*指定包含对应的字符, %代表任意数量的字符, _代表任意一个字符*/
not like				/*指定不包含对应的字符, %代表任意数量的字符, _代表任意一个字符*/
in						/*判断列的值在指定的范围内*/
not in					/*判断列的值不在指定的范围内*/
and						/*两边的表达式都为真,返回结果才为真*/
&&						/*两边的表达式都为真,返回结果才为真*/
or						/*两边的表达式有一项为真,返回结果就为真*/
||						/*两边的表达式有一项为真,返回结果就为真*/
union all				/*关联合并两条语句的结果*/
xor						/*异或,查出左真右假和左假右真的,不查出左真右真和左假右假的*/
join					/*多表关联*/
on						/*按指定条件过滤*/
left join				/*左外关联*/
right join				/*右外关联*/
group by ... having		/*把结果集按某些列分成不同的组,并对分组后的数据进行聚合操作*/
as						/*指定别名,也可做连接语句*/
order by ... asc/desc	/*指定字段排序,asc升序/desc降序*/
limit index, number		/*分页,index为起始下标,number为记录条数*/

/*注意*/
/*
任何运算符和null值运算结果都为null
*/
~~~



## 聚合函数

~~~sql
/*
*表示所有
col_name列名
*/
count(*/col_name)	/*统计总数*/
sum(col_name)		/*计算表中符合条件的数值列的合计值*/
avg(col_name)		/*计算表中符合条件的数值列的平均值*/
max(col_name)		/*计算表中符合条件的任意列中数据的最大值*/
min(col_name)		/*计算表中符合条件的任意列中数据的最小值*/
~~~





## 系统函数

~~~sql
curdate()			/*返回当前日期*/
curtime()			/*返回当前时间*/
now()				/*返回当前的日期和时间*/
date_format(date, fmt)		/*按照fmt自定义的格式,对日期date进行格式化,fmt例:%Y%m%d %H:%i:%s*/
sec_to_time(seconds)	/*把秒数转换为(时:分:秒)*/
time_to_sec(time)		/*把时间(时:分:秒)转换为秒数*/
datediff(date1, date2)	/*返回date1和date2两个日期相差的天数*/
unix_timestamp()		/*返回unix时间戳*/
from_unixtime()			/*把unix时间戳转换为日期时间*/	
~~~

~~~sql
/*
时间单元unit:
	MICROSECOND			间隔单位：毫秒
	SECOND				间隔单位：秒
	MINUTE				间隔单位：分钟
	HOUR				间隔单位：小时
	DAY					间隔单位：天
	WEEK				间隔单位：星期
	MONTH				间隔单位：月
	QUARTER				间隔单位：季度
	YEAR				间隔单位：年
	SECOND_MICROSECOND	复合型，间隔单位：秒、毫秒，expr可以用两个值来分别指定秒和毫秒
	MINUTE_MICROSECOND	复合型，间隔单位：分、毫秒
	MINUTE_SECOND		复合型，间隔单位：分、秒
	HOUR_MICROSECOND	复合型，间隔单位：小时、毫秒
	HOUR_SECOND			复合型，间隔单位：小时、秒
	HOUR_MINUTE			复合型，间隔单位：小时、分
	DAY_MICROSECOND		复合型，间隔单位：天、毫秒
	DAY_SECOND			复合型，间隔单位：天、秒
	DAY_MINUTE			复合型，间隔单位：天、分
	DAY_HOUR			复合型，间隔单位：天、小时
	YEAR_MONTH			复合型，间隔单位：年、月
*/
date_add(date, interval expr unit)	/*对给定的日期增加或减少指定的时间单元*/
extract(unit from date)				/*返回日期date的指定部分*/

/*例:*/
select now(),
	date_add(now(), interval 1 day), --当前时间加一天
	date_add(now(), interval 1 year), --当前时间加一年
	date_add(now(), interval -1 day), --当前时减一天
	date_add(now(), interval '-1:30' hour_minute), --当前时间减1:30
	extract(year from now()),	--提取当前时间的年份
	extract(month from now()),	--提取当前时间的月份
	
~~~

~~~sql
concat(str1,str2,...)			/*把多个字符串拼接成一个字符串*/
concat_ws(sep,str1,str2,...)	/*用指定的分割符sep连接字符串*/
char_length(str)				/*返回字符串的字符个数*/
length(str)						/*返回字符串的字节个数*/
format(x,d,[locale])			/*格式化数值x为0,000.00,并舍入到d位小数,locale语言环境是可选参数,默认为:en_US,可选:de_DE*/
left(str,len)					/*从左侧截取字符串str,截取len位字符*/
right(str,len)					/*从右侧截取字符串str,截取len位字符*/
substring(str,index,[len])		/*截取字符串str,指定起始下标index,可选截取长度len*/
substring_index(str,delim,count)/*返回字符串str按delim分割的前count个子字符串*/
locate(substr,str)				/*返回子串substr在str中第一次出现的位置*/
trim([substr from] str)			/*默认去除两端空格,可指定去除两端substr字符,[]表示可选参数*/

/*例:*/
select title,
	locate('_', title),
	substring(title,1,locate('-',title)),
	substring(title,1,locate('-',title)-1),
	substring_index(title,'-')
from imc_course
~~~

~~~ sql
MD5(str)			/*返回给str字符串MD5加密后的值*/
rand()				/*返回在0和1之间的随机值*/
round(x,d)			/*对数组x进行四舍五入保留d位小数*/
case when			/*多种情况返回不同的值*/
/*例:*/
select user_nick,
	case when sex = 1 then '男',
		 when sex = 0 then '女',
		 else '未知'
	end as '性别'
from imc_user
where case when sex = 1 then '男',
		 when sex = 0 then '女',
		 else '未知'
	end = '男'
~~~

~~~sql
row_count()			/*返回前一个SQL进行UPDATE，DELETE，INSERT操作所影响的行数*/
~~~





## SQL种类

DCL:		数据库管理语句	

DDL:		数据库表定义语句

DML:		数据操作语句

TCL:		  事务的控制语句



### DCL

建立数据库账号:	create user

~~~sql
/*
查看已安装的插件
*/
show plugins;

/*
mc_class 用户名
@'192.168.1.%' 允许访问控制的客户端IP
with 'mysql_native_password' 选择密码加密方式
with max_user_connections 1	只允许一个线程连接
*/

create user mc_class@'192.168.1.%' identified with 'mysql_native_password' by '123456' with max_user_connections 1;
~~~



对用户授权:	grant

~~~sql
/*
查看所有支持的权限
*/
show privileges\G

/*
给用户mc_class授予mysql.user表上的user和host列的查询权限
*/
grant select(user,host) on mysql.user to mc_class@'192.168.1.%'; 

/*
给用户mc_class授予mysql.user表上的所有列的查询权限
*/
grant select on mysql.user to mc_class@'192.168.1.%'; 

/*
给用户mc_class授予mysql中所有表的查询权限
*/
grant select on mysql.* to mc_class@'192.168.1.%'; 
~~~

~~~sql
/*
注意事项
1.使用grant授权的数据库账号必须存在
2.用户使用grant命令授权必须自身具有对应的权限
3.获取命令帮助 \h grant
*/
~~~



回收用户权限:	revoke

~~~sql
/*
回收用户mc_class在mysql.user表上的user和host列的查询权限
*/
revoke select(user,host) on mysql.user to mc_class@'192.168.1.%'; 

/*
回收用户mc_class在mysql.user表上的所有列的查询权限
*/
revoke select on mysql.user to mc_class@'192.168.1.%'; 

/*
回收用户mc_class在mysql中所有表的查询权限
*/
revoke select on mysql.* to mc_class@'192.168.1.%'; 
~~~

~~~sql
/*
注意事项
1.使用revoke授权的数据库账号必须存在
2.用户使用revoke命令授权必须自身具有对应的权限
3.获取命令帮助 \h revoke
*/
~~~



### DDL

建立/修改/删除数据库:	create/alter/drop database

建立/修改/删除表:	create/alter/drop table

~~~sql
/*
unsigned 无符号
auto_increment 自增
not null 不为空
comment 备注信息
default	默认值
current_timestamp 当前时间戳
primary key 主键
*/
create table imc_test (
	id int unsigned auto_increment not null comment 'id',
    user_id int unsigned not null default 0 comment '用户id',
    user_name varchar (50) not null default '' comment '用户名',
    user_gender enum ('男', '女') not null default '男' comment '用户性别',
    user_content text comment '用户介绍',
    add_time datetime not null default current_timestamp comment '创建时间',
    primary key (id)
) comment '测试表';
~~~



建立/删除索引:	create/drop index

清空表:	truncate table

重命名表:	rename table

建立/修改/删除视图:	create/alter/drop view

~~~sql
/*
基于按条件查询出的a.course_id, a.title, b.class_name, c.type_name, d.level_name这些列的数据创建名为vm_course的视图
*/
create view vm_course
as
select a.course_id, a.title, b.class_name, c.type_name, d.level_name
from imc_course a
join imc_class b on b.class_id = a.class_id
join imc_type c on c.type_id = a.type_id
join imc_level d on d.level_id = a.level_id
~~~



### DML

新增表中的数据:		insert into

~~~sql
/*
查看表结构
*/
show create table imc_class
/*
新增数据前, 需先确认表结构, 哪些列不能为null, 哪些列可以为null, 不能为null的列是否有默认值;
插入的值需与每一列一一对应的
*/
/*
向imc_class表中的class_name字段插入多条数据,插入多条以逗号分隔;

*/
insert into imc_class(class_name) values('mysql'),('redis'),('mongoDB'),('安全测试'),('oracle') on duplicate key update add_time = current_time;
~~~



删除表中的数据:		delete

~~~sql
/*
删除只存在于imc_course表中imc_course表和imc_chapter表中course_id相等并且imc_chapter表中course_id不为空的数据
*/
delete a
from imc_course a
left join imc_chapter b on b.course_id = a.course_id
where b.course_id is null
~~~

~~~sql
/*
查询imc_type表中以type_name分组并总数大于1的type_name,min_type_id,总数列的数据做为临时表
删除imc_type表中与临时表type_name相等并且type_id大于min_type_id的数据
*/
delete a
from imc_type a
join (
	select type_name, min(type_id) as min_type_id, count(*)
    from imc_type
    group by type_name having count(*) > 1
) b
on a.type_name = b.type_name and a.type_Id > min_type_id

/*
给imc_type表的type_name建立唯一索引
*/
create unique index uqx_typename on imc_tyoe(type_name)
~~~



修改表中的数据:		update

~~~sql
/*
修改imc_user表中user_nick为'太狼'的数据的user_status列为0
*/
update imc_user
set user_status = 0
where user_nick = '太狼'
~~~

~~~sql
/*
修改imc_course表中随机排序后前10条记录的is_recommand列为1
*/
update imc_course
set is_recommand = 1
order by rand()
limit 10
~~~

~~~sql
/*
按course_id分组查询出imc_classvalue表中course_id和4个评分列的平均值做为临时表
修改imc_course表与临时表的course_id相等的4个评分列的值为平均值
*/
update imc_course a
join
(
	select course_id,
    	avg(content_score) as avg_content,
    	avg(level_score) as avg_level,
    	avg(logic_score) as avg_logic,
    	avg(score) as avg_score
    from imc_classvalue
    group by course_id
) b on a.course_id = b.course_id
set a.content_score = avg_content,
	a.level_score = avg_level,
	a.logic_score = avg_logic,
	a.score = avg_score;
~~~





查询表中的数据:		select

~~~sql
/*
查询imc_db库中imc_class表的所有数据
星号表示所有
*/
select * from imc_db.'imc_class';

/*
user_id指定要查询的列
*/
select user_id from imc_db.'imc_class';
~~~

~~~sql
/*
查询imc_course表中包含mysql字符的title列
%代表可以存在任意多个字符
*/
select title from imc_course where title like '%mysql%'
~~~

~~~sql
/*
查询出imc_course表与imc_class表中class_id相等数据与imc_level表中level_id相等数据,按level_name与 class_name分组的level_name,class_name,总数三列并且总数大于3的数据

*/
select level_name, class_name, count(*) 
from imc_course a 
join imc_class b on b.class_id = a.class_id
join imc_level c on c.level_id = a.level_id
group by level_name, class_name
having count(*) > 3
~~~



## 高级特性

### CTE

全称: 公用表表达式CTE ( Common Table Expressions )

- 8.0版本后才可使用
- CTE生成一个命名临时表, 并且只在查询期间有效
- CTE临时表在一个查询中可以多次引用和自引用

~~~sql
/*
使用with开头, recursive可选参数(是否可以自引用)
*/
with recursive cte as (
	select title, study_cnt, class_id
    from imc_course
    where study_cnt>2000
    union all
    select title, study_cnt, class_id
    from cte
    where study_cnt<5000
)
select * from cte
~~~



### 窗口函数

聚合函数都可以做为窗口函数使用

~~~sql
row_number()		/*返回窗口分区内数据的行号*/
rank()				/*类似于row_number,对于相同数据会产生重复的行号,之后的数据行号会产生间隔*/
dense_rank()		/*类似于rank,区别在于当组内某行数据重复时,虽然行号会重复,但后续的行号不会产生间隔*/
~~~

~~~sql
/*
over内定义分组排序规则,partition by定义分组
*/
select study_name, class_name score,
	row_number() over(partition by class_name order by score desc) as rw,
	rank() over(partition by class_name order by score desc) as rk,
	dense_rank() over(partition by class_name order by score desc) as drk
from test
order by class_name, rw;
~~~



## 配置日志

~~~sql
/*开启慢查询日志,默认为off*/
set global slow_query_log = on
/*指定日志存的路径,默认在mysql目录文件下*/
set global slow_query_log_file = /sql_log/slowlog.log
/*sql执行时间超过设定的时间阈值就会被记录到日志中(单位:秒)*/
set global long_query_time = xx.xxx
/*记录所有未使用索引的sql到日志中,默认为off*/
set global log_queries_not_using_indexes = on
~~~

分析日志工具

~~~sql
/*官方的分析工具(后面跟上日志文件名即可查看分析)*/
mysqldumpslow
/*社区的分析工具(需要先下载安装,然后跟上日志文件名即可查看分析)*/
pt-query-digest
~~~

下载地址: https://www.percona.com/downloads/percona-toolkit/LATEST/

~~~shell
wget https://downloads.percona.com/downloads/percona-toolkit/3.3.1/binary/redhat/7/x86_64/percona-toolkit-3.3.1-1.el7.x86_64.rpm
~~~

~~~shell
/*安装依赖包*/
yum install -y perl-DBD-MySQL.X86_64 perl-DBI.x86 perl-Time-HiRes.x86_64
perl-IO-Socket-SSL.noarch perl-TermReadKey.x86_64 perl-Digest-MD5
~~~

~~~shell
/*安装pt-query-digest*/
rpm -ivh percona-toolkit-3.3.1-1.el7.x86_64.rpm
/*列出工具集文件*/
pt
~~~

~~~sql
/*查看长时间运行的SQL*/
select id, user, host, DB, command, time, state, info
from information_schema.PROCESSLIST
~~~



## 执行计划

explain

~~~sql
explain
select course_id, title, study_cnt from imc_course
where study_cnt > 3000

id: 1							
/*id表示查询执行的顺序;id相同时由上到下执行;id不同时,由大到小执行*/
select_type: simple
/*
simple				不包含子查询或union操作的查询
primary				查询中包含任何子查询,最外层的查询被标记为primary
subquery			select列表中的子查询
dependent subquery	依赖外部结果的子查询
union				union操作的第二个或之后的查询的值为union
dependent union		当union做为子查询时,第二或第二个后的查询的select_type值
union result		union产生的结果集
derived				出现在from子句中的子查询
*/
table: imc_course
/*
指明是从哪个表中获取数据
<unionM,N>由ID为M,N查询union产生的结果集
<derived N>/<subquery N>由ID为N的查询产生的结果集
*/
partitions: null
/*是分区表则显示分区ID,不是则为null*/
type: all
/*
性能:
system			这是const联接类型的一个特例,当查询的表只有一行时使用
const			表中有且只有一个匹配的行时使用,对主键或唯一索引查询是效率最高的
eq_ref			唯一索引或主键查找,对于每个索引键,表中只有一条记录与之匹配
ref				非唯一索引查找,返回匹配某个单独值的所有行
ref_or_null		类似于ref类型的查询,但是附加了对null值列的查询
index_merge		该联接类型表示使用了索引合并优化方法
range			索引范围扫描,常见于between、>、<这样的查询条件
index			full index sacn全索引扫描,通all的区别是遍历的索引树
all				full table scan全表扫描,这是效率最差的联接方式
*/
possible_keys: null				
/*
指出查询中可能会用到的索引
*/
key: null
/*
指出查询时实际用到的索引
*/
key_len: null
/*
实际使用索引的最大长度
*/
ref: null
/*
指出哪些列或常量被用于索引查找
*/
rows: 100
/*
指出哪些列或常量被用于索引查找
*/
filtered: 33.33
/*
表示返回结果的行数占需读取行数的百分比
*/
extra: using where
/*
额外信息:
distinct			优化distinct操作,在找到第一匹配的元组后即停止找同样值的动作
not exists			使用not exists来优化查询
using filesort		使用文件来进行排序,通常会出现在order by或group by查询中
using index			使用了覆盖索引进行查询
using temporary		mysql需要使用临时表来查询,常见于排序、子查询和分组查询
using where			需要在mysql服务器层使用where条件来过滤数据
select tables optimized away	直接通过索引来获取数据,不用访问表
*/
~~~



## SQL优化

优化方案

- 优化SQL查询所涉及到的表中的索引
- 改写SQL以达到更好的利用索引的目的



### 索引

告诉存储引擎如何快速的查找到所需要的数据



应该在什么列上建立索引

- where子句中的列
- 包含在order by、group by、distinct中的字段
- 多表join的关联列

选择复合索引键的顺序

- 区分度最高的列放在联合索引的最左侧
- 使用最频繁的列放到联合索引的最左侧
- 尽量把字段长度小的列放在联合索引列的最左侧

索引使用误区

- 索引越多越好 ( 纠正: 并不是 )
- 使用in列表查询不能用到索引 ( 纠正: 是可以用到索引的 )
- 查询过滤顺序必须用索引键顺序相同才可以使用索引 ( 纠正: 并不是 )





#### Innodb支持的索引类型

- Btree索引 ( 以B+树的结构存储索引数据 )

  - 特性

  1. Btree索引适用于全值匹配的查询
  2. Btree索引适合处理范围查找
  3. Btree索引从索引的最左侧列开始匹配查找列

  - 限制

  1. 只能从最左侧开始按索引键的顺序使用索引, 不能跳过索引键
  2. not in和<>操作无法使用索引
  3. 索引列上不能使用表达式或是函数

- 自适应HASH索引

- 全文索引

- 空间索引





### 改写

#### SQL改写的原则

- 使用 outer join 代替 not in

- 使用CTE代替子查询
- 拆分复杂的大SQL为多个简单的小SQL
- 通过计算列巧妙的优化

~~~sql
/*优化前*/
explain
select * 
from imc_classvalue
where (content_score + level_score + logic_score) > 28

/*使用计算列*/
alter table imc_classvalue
add column total_score decimal(3, 1) 
as (content_score + level_score + logic_score)
/*给计算列添加索引*/
create index idx_totalScore on imc_classvalue(total_score)

/*优化后*/
explain
select * 
from imc_classvalue
where total_score > 28
~~~



## 事务

事务是数据库执行操作的最小逻辑单元

事务可以由一个SQL组成也可以由多个SQL组成

只能使用DML操作

~~~sql
/*
start transaction				开启事务
begin							开启事务
commit							提交事务
rollback						回滚事务
*/
~~~



### 特性

~~~sql
原子性(A)		
/*一个事务中的所有操作,要么全部完成,要么全部不完成,不会结束在中间某个环节*/
一致性(C)
/*在事务开始之前和事务结束之后,数据库的完整性没有被破坏*/
隔离性(I)
/*事务的隔离性要求每个读写事务的对象与其它事务的操作对象能相互分离,即该事务提交前对其它事务都不可见*/
持久性
/*事务一旦提交了,其结果就是永久性的,就算发送了宕机等事故,数据库也能将数据恢复*/
~~~



#### 并发带来的问题

脏读

- 一个事务读取了另一个事务未提交的数据

不可重复读

- 一个事务前后两次读取的同一数据不一致

幻读

- 指一个事务两次查询的结果集记录数不一致



### 隔离级别

InnoDB的事务隔离级别

|           隔离级别           | 脏读 | 不可重复读 | 幻读  | 隔离性 | 并发性 |
| :--------------------------: | :--: | :--------: | :---: | :----: | :----: |
|    顺序读( serializable )    |  N   |     N      |   N   |  最高  |  最低  |
| 可重复读( repeatable read )  |  N   |     N      | **N** |        |        |
|  读以提交( read committed )  |  N   |     Y      |   Y   |        |        |
| 读未提交( read uncommitted ) |  Y   |     Y      |   Y   |  最低  |  最高  |

~~~sql
/*
设置事务的隔离级别
persist			所有连接都会生效,mysql服务重启也不会丢失
global			修改后,新的连接才会生效,mysql服务重启后会丢失
session			当前的连接,连接断开则会失效
*/
set session transaction isolation level serializable;

/*查看事务隔离级别*/
show variables like '%iso%'
~~~





### 阻塞

由于不同锁之间的兼容关系, 造成的一个事务需要等待另一个事务释放其所占用的资源的现象

~~~sql
/*
查看阻塞情况
*/
select waiting_pid as '被阻塞的线程',
	waiting_query as '被阻塞的sql',
	blocking_pid as '阻塞线程',
	blocking_query as '阻塞sql',
	wait_age as '阻塞时间',
	sql_kill_blocking_query as '建议操作'
from sys.innodb_lock_waits
where (unix_timestamp() - unix_timestamp(wait_started)) > 30
~~~





### 死锁

并行执行的多个事务相互之间占有了对方所需要的资源

~~~sql
/*
开启死锁日志
*/
set global innodb_print_all_deadlocks=on;
~~~





## 存储过程

语法:

~~~sql
create procedure proName(in|out|inout parName parType)
[characteristics]
begin
	/*存储过程体*/
end

/*
创建存储过程
proName		存储过程名称
parName		参数名
parType		参数类型
参数分类:
没有参数(无参数无返回值)
仅有in(有参数无返回)
仅有out(无参数有返回)
带inout(有参数有返回)
即带in又带out(有参数有返回)
注意:	
in、out、inout都可以在一个存储过程中带多个
存储过程中可以有多条sql语句, 如果仅有一条sql语句, 可以省略begin和end
*/
/*
[characteristics]
表示创建存储过程时指定的对存储过程的约束条件, 取值信息如需下
*/
language sql		
/*说明存储过程执行体是由SQL语句组成, 当前系统支持的语言是SQL*/
[not] deterministic
/*指明存储过程执行的结果是否确定。deterministic表示结果是确定的, 每次执行存储过程时, 相同的输入会得到相同的输出。not deterministic表示结果是不确定的, 相同的输入可能得到不同的输出。如果没有指定任意一个值, 默认为not deterministic*/
{ contains sql | no sql | reads sql data | modifies sql data }
/*
指明子程序使用sql语句的限制
contains sql: 表示当前存储过程的子程序包含sql语句, 但是并不包含读写数据的sql语句
no sql:	表示当前存储过程的子程序中不包含任何sql语句
reads sql data:	表示当前存储过程的子程序中包含读数据的sql语句
modifies sql data: 表示当前存储过程的子程序中包含写数据的sql语句
默认情况下, 系统会指定为contains sql
*/
sql security { definer | invoker }
/*
执行当前存储过程的权限, 即指明哪些用户能够执行当前存储过程
definer表示只有当前存储过程的创建者或者定义者才能执行该存储过程
invoker表示拥有当前存储过程的访问权限的用户能够执行当前存储过程
如果没有设置相关值, 系统默认为definer
*/
commit 'string'
/*注释信息, 可以用来描述存储过程*/
~~~

~~~sql
/*
delimiter 指定sql语句的结束符号
*/
delimiter $
create procedure select_all_data()
begin
	select * from emps;
end $
delimiter ;

/*
调用存储过程
*/
call select_all_data();
~~~



### 优点

1. 存储过程可以一次编译多次使用, 存储过程只在创建时进行编译, 之后的使用都不需要重新编译, 这就提升了sql的执行效率
2. 可以减少开发工作量, 将代码封装成模块, 实际上是编程的核心思想之一, 这样可以把复杂的问题拆解成不同的模块, 然后模块之间可以重复使用, 在减少开发工作量的同时, 还能保证代理的结构清晰
3. 存储过程的安全性强, 我们在设定存储过程的时候可以设置对用的使用权限, 这样就和视图一样具有较强的安全性
4. 可以减少网络传输量, 因为代码封装到存储过程中, 每次使用只需要调用存储过程即可, 这样就减少了网络传输量
5. 良好的封装性, 在进行相对复杂的数据库操作时, 原本需要使用一条一条的sql语句, 可能要连接多次数据库才能完成的操作, 现在变成了一次存储过程, 只需要连接一次即可

### 缺点

1. 可移植性差, 存储过程不能跨数据库移植, 如在MySql、Oracle和SQL Server里编写的存储过程, 在换成其他数据库时都需要重新编写
2. 调试困难, 只有少数DBMS支持存储过程的调试, 对于复杂的存储过程来说, 开发和维护都不容易, 虽然也有一些第三方工具可以对存储过程进行调试, 但要收费
3. 存储过程的版本管理很困难, 比如数据表索引发送变化了, 可能会导致存储过程失败, 我们在开发软件的时候往往需要进行版本管理, 但是存储过程本身没有版本控制, 版本迭代更的时候很麻烦
4. 它不适合高并发的场景, 高并发的场景需要减少数据库的压力, 有时数据库会采用分库分表的方式, 而且对可扩展性要求很高, 在这种情况下, 存储过程会变得难以维护, 增加数据库的压力, 显然就不适用了





## 存储函数

语法:

~~~sql
create function funcName(parName parType)
returns retType
[characteristics]
begin
	/*函数体(必须有return)*/
end
/*
funcName	函数名
parName		参数名
parType		参数类型
retType		返回值类型
*/
/*
[characteristics]
表示创建存储过程时指定的对存储过程的约束条件, 取值信息同存储过程一样
*/
/*
注意: 
若创建存储函数报错'you might want to use the less safe log_bin_trust_function_creators variable'
解决: 
1. 加上必要的函数约束'[not] deterministic'和'{ contains sql | no sql | reads sql data | modifies sql data }'
2. set global log_bin_trust_function_creators = 1;
*/
~~~



## 查看

~~~sql
/*
查看存储过程和存储函数的信息的方式
name		存储过程和函数的名称
{ procedure | function }	表示procedure或者function
*/
show create { procedure | function } name;
show { procedure | function } status like 'name';
select * from information_schema.Routines
where ROUTINE_NAME='name' and ROUTINE_TYPE = '{ procedure | function }';
~~~

## 修改

~~~sql
alter { procedure | function } name 
[characteristics]
/*
修改存储过程和函数的约束特性
name		存储过程和函数的名称
{ procedure | function }	表示procedure或者function
*/
/*
[characteristics]
表示创建存储过程时指定的对存储过程的约束条件, 取值信息如下
*/
{ contains sql | no sql | reads sql data | modifies sql data }
/*
指明子程序使用sql语句的限制
contains sql: 表示当前存储过程的子程序包含sql语句, 但是并不包含读写数据的sql语句
no sql:	表示当前存储过程的子程序中不包含任何sql语句
reads sql data:	表示当前存储过程的子程序中包含读数据的sql语句
modifies sql data: 表示当前存储过程的子程序中包含写数据的sql语句
默认情况下, 系统会指定为contains sql
*/
sql security { definer | invoker }
/*
执行当前存储过程的权限, 即指明哪些用户能够执行当前存储过程
definer表示只有当前存储过程的创建者或者定义者才能执行该存储过程
invoker表示拥有当前存储过程的访问权限的用户能够执行当前存储过程
如果没有设置相关值, 系统默认为definer
*/
commit 'string'
/*注释信息, 可以用来描述存储过程*/
~~~

## 删除

~~~sql
/*
name		存储过程和函数的名称
{ procedure | function }	表示procedure或者function
if exists	存储过程和函数的名称存在才执行删除
*/
drop { procedure | function } if exists name;
~~~





## 变量

### 系统变量

~~~sql
#查看所以全局系统变量
show global variables;
#查看所以会话系统变量
show session variables;
或
show variables;
#查看符合条件的全部系统变量
show global variables like '%标识符%';
#查看符合条件的会话系统变量
show session variables like '%标识符%';
/*
查看指定系统变量
name	变量名称
[global | session]  全局或者会话,不指定默认先找会话系统变量
*/
select @@[global | session].name;
~~~

~~~sql
/*
修改系统变量
1. 在my.ini文件里配置系统变量 (永久修改)
2. 使用set命令设置系统变量 (临时修改)
*/
/*
name	变量名称
value	变量值
[global | session]  全局或者会话,不指定默认先找会话系统变量
*/
set @@[global | session].name = value;
~~~

~~~sql
#mysql8.0中新增了set persist命令
set persist global max_connections = 1000;
#mysql会将该命令的配置保存到数据目录下的mysqld-auto.cnf文件中, 下次启动时会读取该文件, 用其中的配置来覆盖默认的配置文件
~~~



### 用户变量

会话变量: 作用域和会话变量一样, 只对当前连接会话有效

局部变量: 只在begin和end语句块中有效, 局部变量只能在存储过程和函数中使用

#### 会话变量

需要使用'@'开头

语法:

~~~sql
#创建赋值变量
set @name = 1;
或
set @name := 1;
#使用sql语句方式创建赋值变量
select @name := 表达式 [from子句];
select 表达式 into @name [from子句];
#例
select @count := count(*) from empty;
select avg(salary) into @avg_sal from empty;
~~~



#### 局部变量

需要使用declare声明

语法:

~~~sql
delimiter $
create procedure select_all_data()
begin
	#声明局部变量
	declare a int default 0;
	declare b varchar(25) default '高江华';
	#赋值
	set a = 1;
	set b := '灰太狼';
	#sql语句方式赋值
	select last_name into b from empty where empty_id = 100;
	#使用
	select a,b;
end $
delimiter ;
~~~





## 定义条件与处理程序

定义条件是事先定义程序执行过程中可能遇到的问题, 处理程序定义了在遇到问题时应当采取的处理方式, 并且保证存储过程或函数在遇到警告或错误时能继续执行, 这样可以增强存储程序处理问题的能力, 避免程序异常停止运行

说明: 定义条件和处理程序在存储过程, 存储函数中都是支持的

案例:

~~~sql
#创建存储过程
delimiter $
create procedure UpdateDataNoCondition()
	begin
		set @x = 1;
		update empty set email = null where last_name = '灰太狼';
		set @x = 2;
		update empty set email = '598670138@qq.com' where last_name = '灰太狼';
		set @x = 3;
	end $
delimiter ;
#调用存储过程
call UpdateDataNoCondition();
#报错信息
Column 'email' cannot be null
#查看变量@x为1
select @x;
~~~

结论: 在存储过程中未定义条件和处理程序, 且当存储过程中执行的sql语句报错时, mysql数据库会抛出错误, 并退出当前sql逻辑, 不再向下继续执行。



### 定义条件

定义条件就是给mysql中的错误码命名, 这有助于存储的程序代码更清晰, 它将一个错误名字和指定的错误条件关联起来, 这个名字可以随后被用在定义处理程序的DECLARE HANDLER语句中

语法:

~~~sql
declare 错误名称 condition for 错误码(或错误条件)
~~~

错误码说明:

- MySQL_error_code和sqlstate_value都可以表示MySQL的错误
  - MySQL_error_code是数值类型错误代码
  - sqlstate_value是长度为5的字符串类型错误代码
- 例如: 在ERROR 1418 (HY000)中, 1418是MySQL_error_code, 'HY000'是sqlstate_value
- 例如: 在ERROR 1142(42000)中, 1142是MySQL_error_code, '42000'是sqlstate_value

~~~~sql
#使用MySQL_error_code
declare Field_Not_Be_NULL condition for 1048;
#使用sqlstate_value
declare Field_Not_Be_NULL condition for '23000';
~~~~



### 定义处理程序

可以为sql执行过程中发送的某个类型的错误定义特殊的处理程序, 定义处理程序时。

语法:

~~~sql
declare 处理方式 handler for 错误类型 处理语句
~~~

- 处理方式: 处理方式有3个取值: continue、exit、undo
  - continue: 表示遇到错误不处理, 继续执行
  - exit: 表示遇到错误立即退出
  - undo: 表示遇到错误后撤回之前的操作, mysql中暂时不支持该操作
- 错误类型( 即条件 ):
  - sqlstate '字符串错误码': 表示长度为5的sqlstate_value类型的错误代码
  - MySQL_error_code: 匹配数组类型错误代码
  - 错误名称: 表示declare...condition定义的错误条件名称
  - sqlwarning: 匹配所有以01开头的sqlstate错误代码
  - not found: 匹配所有以02开头的sqlstate错误代码
  - SQLexception: 匹配所有没有被sqlwarning或not found捕获的sqlstate错误代码
- 处理语句: 如果出现上述条件之一, 则采用对应的处理方式, 并执行指定的处理语句。语句可以是像"set 变量 = 值"这样的简单语句, 也可以是使用"begin ... end"编写的复合语句



~~~sql
#捕获sqlstate_value
declare continue handler for sqlstate '42S02' set @info = 'NO_SUCH_TABLE';
#捕获mysql_error_value
declare continue handler for 1146 set @info = 'NO_SUCH_TABLE';
#先定义条件, 再调用
declare no_such_table condition for 1146;
declare continue handler for no_such_table set @info = 'NO_SUCH_TABLE';
#使用sqlwarning
declare exit handler for sqlwarning set @info = 'error';
#使用not found
declare exit handler for not found set @info = 'NO_SUCH_TABLE';
#使用SQLexception
declare exit handler for sqlexception set @info = 'error';
~~~

~~~sql
#存储过程方式
delimiter $
create procedure UpdateDataNoCondition()
	begin
		#声明处理程序
		#处理方式
		declare continue handler for 1048 set @prc_value = -1;
		
		set @x = 1;
		update empty set email = null where last_name = '灰太狼';
		set @x = 2;
		update empty set email = '598670138@qq.com' where last_name = '灰太狼';
		set @x = 3;
	end $
delimiter ;
#调用存储过程(可正常执行结束)
call UpdateDataNoCondition();
#查看@prc_value = -1
select @prc_value;
#查看@x = 3
select @x;
~~~





## 流程控制

针对与mysql的流程控制语句主要有3类。注意: 只能用于存储程序。

- 条件判断语句: if语句和case语句
- 循环语句: loop、while和repeat语句
- 跳转语句: iterate和leave语句



if语法

~~~sql
if 表达式1 then 操作1
[elseif 表达式2 then 操作2]...
[else 操作n]
end if
~~~



case语法

~~~sql
#类似switch
case 表达式
when 值1 then 结果1或语句1(如果是语句需要加分号)
when 值2 then 结果2或语句2(如果是语句需要加分号)
...
else 结果n或语句n(如果是语句需要加分号)
end [case] (如果放在"begin...end"语句中需要加上case, 如果放在select后面不需要加)

#类似多重if
case
when 条件1 then 结果1或语句1(如果是语句需要加分号)
when 条件2 then 结果2或语句2(如果是语句需要加分号)
...
else 结果n或语句n(如果是语句需要加分号)
end [case] (如果放在"begin...end"语句中需要加上case, 如果放在select后面不需要加)
~~~



loop语法

~~~sql
#loop_name: loop的标签名称
[loop_name]:loop
	循环体
end loop [loop_name]
~~~

~~~sql
#举例
declare id int default 0;
add_loop:loop
	set id = id + 1;
	if id >= 10 then leave add_loop;
	end if
end loop add_loop;
~~~



while语法

~~~sql
#while_name: while的标签名称
[while_name]:while 循环条件 do
	循环体
end while [while_name];
~~~

~~~sql
#举例
delimiter $
create procedure test_while()
	begin
		#初始化条件
		declare num int default 1;
		#循环条件
		while num <=10 do
			#循环体
			insert into imc_class(class_num) values (class_num + 1000);
			#迭代条件
			set num = num + 1;
		end while;
	end $
delimiter ;
~~~



repeat语法

~~~sql
#repeat_name: repeat的标签名称
[repeat_name]:repeat
	循环体
until 结束循环的条件表达式
end while [repeat_name];
~~~

~~~sql
#举例
delimiter $
create procedure test_repeat()
	begin
		#初始化条件
		declare num int default 1;
		#循环条件
		repeat
			#循环体
			insert into imc_class(class_num) values (class_num + 1000);
			#迭代条件
			set num = num + 1;
		until num >=10
		end repeat;
	end $
delimiter ;
~~~



leave语法

可以用在循环语句内, 或者是"begin...end"包裹的程序体内, 表示跳出循环或跳出程序体的操作, 类似break。

~~~sql
#举例
delimiter $
create procedure leave_begin(in num int)
	begin_label:begin
		if num <= 0
			then leave begin_label;
		elseif num = 1
			then select avg(salary) from empty;
		elseif num = 2
			then select min(salary) from empty;
		else 
			select max(salary) from empty;
		end if;
		#查询总人数
		select count(*) from empty
	end $
delimiter ;
#调用(传入0直接跳出)
call leave_begin(0)
~~~



iterate语法

只能用在循环语句内, 表示重新开始循环, 将执行顺序转到语句段开头处, 进行下一次循环, 类似continue

~~~sql
#举例
delimiter $
create procedure test_iterate()
	begin
		declare num int default 0;
		loop_name:loop
			#赋值
			set num = num + 1;
			if num < 10
				then iterate loop_name;
			elseif num > 15
				then leave loop_name;
			end if;
			select '灰太狼'
		end loop;
	end $
delimiter ;
#调用(num为10-15为输出'灰太狼',一共6次)
call test_iterate()
~~~





## 游标

游标必须在声明处理程序之前被声明, 并且变量和条件还必须在声明游标或处理程序之前被声明

创建游标:

~~~sql
#适用于mysql, sql server, DB2和MariaDB
declare cursor_name cursor for select_statement;
#适用于Oracle和PostgreSQL
declare cursor_name cursor is select_statement;
#select_statement是select语句返回用于创建游标的结果集
~~~

打开游标:

定义游标后, 若要使用游标, 必须先打开游标, 打开后select语句的查询结果集就会送到游标工作区。

为后面游标的逐条读取结果集中的记录做准备

~~~sql
open cursor_name;
~~~

使用游标:

~~~sql
#使用cursor_name游标读取当前行, 将数据保存到var_name变量中, 若当前行有多个列, 则在into后面添加多个变量接收, 此时游标指针指到下一行
fetch cursor_name into var_name [, var_name]...
~~~

关闭游标:

~~~sql
close cursor_name;
~~~



举例:

~~~sql
delimiter $
create procedure get_count_bt_limit_total_salary(in limit_total_salary double, out total_count int)
	begin
		#声明局部变量
		declare sum_sal double default 0.0; #记录累加的工资总额
		declare emp_sal double; #记录每个员工的工资
		declare emp_count int default 0; #记录累加的人数
		#声明游标
		declare emp_cursor cursor for select salary from employees order by salary desc;
		#打开游标
		open emp_cursor;
		repeat
			#使用游标
			fetch emp_cursor into emp_sal;
			set sum_sal = sum_sal + emp_sal;
			set emp_count = emp_count + 1;
			until sum_sal >= limit_total_salary
		end repeat;
		set total_count = emp_count;
		#关闭游标
		close emp_cursor;
	end $
delimiter ;
#调用
call get_count_bt_limit_total_salary(200000, @total_count)
#获取@total_count
select @total_count;
~~~



小结:

游标的使用过程中会对数据进行加锁, 在业务并发量大的时候, 不仅影响业务效率, 还会消耗系统资源, 造成内存不足, 因为游标是在内存中进行的处理。

建议: 用完之后一定记得关闭游标



## 触发器

创建触发器:

~~~sql
/*
brfore		表示在事件之前触发
after		表示在事件之后触发
insert		表示插入记录时触发
update		表示更新记录时触发
delete		表示删除记录时触发
触发器执行的语句块		可以是单条sql也可以是'begin...end'复合语句块
*/
create trigger 触发器名称
{brfore|after} {insert|update|delete} on 表名
for each row
触发器执行的语句块
~~~

~~~sql
#例
delimiter $
create trigger before_inset_test_tri
before insert on test_trigger
for each row
begin
	insert into test_trigger_log(t_log)
	values('before insert ...')
end $
delimiter ;
~~~

查看触发器:

~~~sql
#查看当前数据库里所有触发器的定义
show trigger\G;
#查看当前数据库中某个触发器的定义
show create trigger 触发器名称;
#从系统库information_schma的trigger表中查询"salary_check_trigger"触发器的信息
show * from information_schma.triggers;
~~~

删除触发器:

~~~sql
#触发器也是数据库对象
drop trigger if exists 触发器名称;
~~~



## 注意事项

忌: 使用count( * )判断是否存在符合条件的数据

荐: 使用select ... limit 1

忌: 在执行一个更新语句后, 使用查询方式判断此更新语句是否有执行成功

荐: 使用row_count( )函数判断修改行数
