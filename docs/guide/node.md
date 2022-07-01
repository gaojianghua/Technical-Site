# Node
## node环境

安装node的版本管理工具nvm:

保证电脑上没有node, 有node就卸载干净

下载nvm压缩文件:[nvm-setup.zip](https://github.com/coreybutler/nvm-windows/releases/download/1.1.7/nvm-setup.zip)

执行里面的setup.exe即可

安装路径可自行选择, 必须与环境变量保持一致

nvm ls 			//查看已下载的node版本

nvm install vX.X.X			//安装node对应的版本

nvm use X.X.X				//使用对应版本的node

**注意**:

安装node时若npm不成功, 在nvm下的setting.txt文件加入下面内容

做淘宝镜像

~~~
node_mirror: https://npm.taobao.org/mirrors/node/
npm_mirror: https://npm.taobao.org/mirrors/npm/
~~~



## npm使用

查看镜像地址:

npm get registry 

切换淘宝源:

npm config set registry http://registry.npm.taobao.org/

yarn config set registry http://registry.npm.taobao.org/

切回npm源:

npm config set registry=http://registry.npmjs.org

npm源管理工具nrm:

cnpm i nrm -g			//安装

nrm ls							//查看源

nrm current				//查看当前使用源

nrm use taobao			//切换源

nrm add cnpm http://r.cnpmjs.org		//添加源

nrm del cnpm			//删除源

**注意**

报错:_cacache is not a legal HTTP header value

解决: 改善网络或者换版本

报错: throw new ERR_INVALID_ARG_TYPE(name, 'string', value)

原因: 操作系统是32位的

解决: 修改node\node_modules\nrm\cli.js文件

~~~js
const NRMRC = path.join(process.env.HOME, '.nrmrc');
//改为
const NRMRC = path.join(process.env.USERPROFILE, '.nrmrc');
~~~



## node原理

```
    Node本身能够做到如此高性能的根本原因在于事件（event）的使用，以及对于事件监听者（listener，callback）的调用上。

    Node本身是基于事件循环机制的。

    本质上，当Node启动一个文件或者服务器后，Node实际上是运行在一个死循环中的。

    while(true) {
        ...
    }

    在这个死循环当中，Node会不断发射事件、监听事件并且执行回调逻辑。

    事件来源主要有两种：一是Node自身所发射出的事件，二是来自于Node自身所运行的环境。
    监听事件：回调都是要依附于相应的事件的。
    执行回调逻辑：本质上都是由底层来执行的。

    关于IO操作的异步执行逻辑：

    1. 同步模式：
    2. 异步模式：poll epoll

    IOCP，libuv

    Node的单线程：所谓单线程，指的是Node的逻辑执行主线程是单线程的，即JavaScript代码运行所处的线程，这是个单线程，因为JavaScript
    本身只能执行在单线程当中。

    当我们在程序中引入了某个第三方模块时，那么整体的全部执行逻辑如下所示：

    Node -> 第三方模块 -> 原生模块 -> 原生模块内部的实现 -> C++模块 -> libuv -> 线程池 -> 线程 -> 执行底层的IO操作（涉及到操作系统调用）

    当Node在执行过程中，它会判断当前的操作系统类型：

    Node完整的事件循环逻辑：

    1. 启动Node运行时
    2. 检测是否有待处理的事件
    3. 如果没有，回到循环开始
    4. 如果有，那么从事件队列中取出一个事件
    5. 判断当前这个事件有没有与之关联的事件处理器（回调）
    6. 如果没有，回到循环开始
    7. 如果有，则执行事件的回调逻辑
    8. 回到循环开始，开始新一轮的事件检测流程

    整个Node的执行过程实际上是由完整的事件循环机制 + 底层的操作系统异步IO调用 + 线程池（底层库实现或由操作系统提供）共同配合来完成的。

    对于单线程的Node来说，是否无法利用到多核的优势呢？

    对于Node主线程来说，它只能运行在一个核心上面。
    对于底层的线程池来说，他们却可以运行在多个核心上面，当然也可以同时运行，因此他们是完全可以利用到多核的优势的。
```

## http模块

服务创建以及周期事件

~~~js
const http = require('http');

const server = http.createServer(function(request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello Node.js');
});

server.listen(3000, 'localhost');

server.on('listening', function() {
    console.log('Server is listening');
    // server.close();
});

server.on('connection', function() {
    console.log('Client is connected');
});

server.on('close', function() {
    console.log('Server is closed');
});

console.log('Node Server started on port 3000');
~~~

第二种方式

~~~js
const http = require('http');
const httpServer = new http.Server();

httpServer.on('request', function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Hello Node.js');
});

httpServer.listen(3000, function () {
    console.log('Node Server started on port 3000');
});
~~~

当浏览器访问后端服务时返回请求头及其他版本信息

~~~js
const http = require('http');

const server = http.createServer(function (request, response) {
    let data = '';

    request.on('data', function (chunk) {
        data += chunk;
    });

    request.on('end', function () {
        let method = request.method;
        let headers = JSON.stringify(request.headers);
        let httpVersion = request.httpVersion;
        let requestUrl = request.url;

        response.writeHead(200, {'Content-Type': 'text/html'});

        let responseData = method + ", " + headers + ", " + httpVersion + ", " + requestUrl;

        response.end(responseData);
    });
});

server.listen(3000, function () {
    console.log('Node Server started on port 3000');
});
~~~

模拟发送请求

~~~js
const http = require('http');

let responseData = '';

http.request({
    'host': 'localhost',
    'port': '3000',
    'method': 'get',
    'path': '/login?username=zhangsan&password=hello'
}, function (response) {
    response.on('data', function (chunk) {
        responseData += chunk;
    });

    response.on('end', function () {
        console.log(responseData);
    });
}).end();
~~~

模拟GET请求

~~~js
const http = require('http');

let responseData = '';

http.get({
    'host': 'localhost',
    'port': '3000'
}, function(response) {
    response.on('data', function(chunk) {
        responseData += chunk;
    });

    response.on('end', function() {
        console.log(responseData);
    });
}).end();
~~~

第二种方式

~~~js
const http = require('http');

let responseData = '';

const option = {
    'host': 'localhost',
    'port': '3000'
};

const request = http.request(option);

request.on('response', function (response) {
    response.on('data', function (chunk) {
        responseData += chunk;
    });

    response.on('end', function () {
        console.log(responseData);
    });
}).end();
~~~



## url模块

获取url上的所有信息

~~~js
const url = require('url');

const urlString = 'http://www.test.com?orderId=12345';
const urlObject = url.parse(urlString);

console.log(urlObject);
~~~

配置组合成url

```js
const url = require('url');

const urlObject = {
    'host': 'www.test.com',
    'port': 80,
    'protocol': 'http',
    'search': '?order=12345',
    'query': 'order=12345',
    'path': '/'
};

let realAddress = url.format(urlObject);

console.log(realAddress);
```

通过方法组合

~~~js
const url = require('url');

const urlAddress = url.resolve('http://www.test.com', 'order');

console.log(urlAddress);
~~~



## querystring模块

转路由上的参数为对象格式

~~~js
const querystring = require('querystring');

const str = 'name=zhangsan&address=xiamen';

const obj = querystring.parse(str);

console.log(obj);
~~~

反转为路由参数格式

~~~js
const querystring = require('querystring');

const obj = {
    name: 'zhangsan',
    address: 'xiamen'
};

const result = querystring.stringify(obj);

console.log(result);
~~~



## util模块

带有高亮效果的

~~~js
const util = require('util');

const obj = {
    name: 'zhangsan',
    address: 'nanchang',
    age: 25,
    married: false,
    getAge: function () {
        return this.age;
    }
};

const str = util.inspect(obj, {
    'colors': true
});

console.log(str);
~~~



## path模块

拼接文件路径

~~~js
const path = require('path');

const outputPath = path.join(__dirname, 'myDir', 'hello.js');

console.log(outputPath);
~~~

获取文件后缀名

~~~js
const path = require('path');

const extInfo = path.extname(path.join(__dirname, 'myDir', 'hello.js'));

console.log(extInfo);
~~~

以对象格式显示文件路径的各种信息

~~~js
const path = require('path');

const filePath = '/Users/helloworld/node/test.js';

const obj = path.parse(filePath);

console.log(obj);
~~~

'..'可返回上一级目录

~~~js
const path = require('path');

const myPath = path.join('/hello', 'world', 'test/welcome', 'helloworld', '..');

console.log(myPath);
~~~





## dns模块

解析域名为IP地址

~~~js
const dns = require('dns');

const domain = 'www.sohu.com';

dns.resolve(domain, function (error, address) {
    if (error) {
        console.log(error);
        return;
    }

    console.log(address);
});
~~~

通过IP查询出域名地址

~~~js
const dns = require('dns');

dns.reverse('114.114.114.114', function (error, domain) {
    console.log(domain);
});
~~~



## 暴露方式

第一种

~~~json
var myInfo = {
    name: 'zhangsan',
    age: 20
};

var myFunction = function (inputNumber) {
    return inputNumber + 5;
};

exports.myInfo = myInfo;
exports.myFunction = myFunction;
~~~

第二种

~~~js
const myModule2 = {
    myInfo: {
        name: 'zhangsan',
        age: 20
    },

    myFunction: function (inputNumber) {
        return inputNumber + 5;
    }
};

// exports.myModule2 = myModule2;
module.exports = myModule2;
~~~





## 模拟登录

login接口获取前端路由上的参数并解析为对象格式

~~~js
const http = require('http');
const querystring = require('querystring');
const url = require('url');

const userService = require('./UserService');


const server = http.createServer(function (request, response) {
    let data = '';

    request.on('data', function (chunk) {
        data += chunk;
    });

    request.on('end', function () {
        const requestUrl = request.url;
        const requestMethod = request.method;

        if (requestUrl.includes('login') && requestMethod === 'GET') {
            const requestParams = url.parse(requestUrl);
            console.log(requestParams);

            const queryObject = querystring.parse(requestParams.query);
            console.log(queryObject);

            const loginResult = userService.login(queryObject.username, queryObject.password);
            console.log('loginResult: ' + loginResult);

            response.writeHead(200, {'Content-Type': 'text/plain'});
            response.end('username: ' + queryObject.username + ', password: ' + queryObject.password);
        }
    });
});

server.listen(3000, function () {
    console.log('Server is listening on port 3000');
});
~~~

封装用户方法

~~~js
class UserService {

    login(username, password) {
        console.log('entered UserService login method');
        console.log('info from UserService.login: ' + username + ', ' + password);

        return true;
    }
}

module.exports = new UserService();
~~~



## fs模块

```
对于fs中的绝大多数api来说，Node都提供了相同功能的两个版本：同步版本与异步版本
尽最大可能去使用异步版本
```

~~~js
const fs = require('fs');
//同步
try {
    const data = fs.readFileSync('test.txt', 'utf8');
    console.log(data);
} catch (e) {
    console.log(e);
}
//异步
fs.readFile('test.txt', 'utf8', function (error, data) {
    if (error) {
        console.log(error);
        console.log('error occured')
    } else {
        console.log(data);
    }
});

fs.writeFile('mytest.txt', 'hello world', function (error) {
    if (error) {
        console.log('write file error');
    } else {
        console.log('write file successful');
    }
});
//flag:'a'表示文件不存在为自动创建
fs.writeFile('mytest2.txt', 'mytest2, node.js\r\n', {flag: 'a'}, function (error) {
    if (error) {
        console.log('write file error');
    } else {
        console.log('write file successful');
    }
});
~~~

打开一个文件

~~~js
const fs = require('fs');

fs.open('test.txt', 'r+', function (error, fd) {
    if (error) {
        return console.error(error);
    }
    console.log('file is open');
});
~~~

打开并关闭文件

~~~js
const fs = require('fs');

fs.open('test.txt', 'r+', function (error, fd) {
    if (error) {
        return console.error(error);
    }

    console.log('file is open');

    fs.close(fd, function (error) {
        if (error) {
            console.error(error);
        }
        console.log('file is closed');
    });
});
~~~

删除文件

~~~js
const fs = require('fs');

fs.unlink('hello.txt', (error) => {
    if (error) {
        throw error;
    }

    console.log("success");
});
~~~

强制重命名并读取文件状态信息

~~~js
const fs = require('fs');

fs.rename('world.txt', 'hello.txt', (error) => {
    if (error) {
        throw error;
    }

    fs.stat('hello.txt', (error, stats) => {
        if (error) {
            throw error;
        }

        console.log(JSON.stringify(stats));
    });
});
~~~

向指定文件中添加内容

~~~js
const fs = require('fs');

fs.appendFile('info.txt', 'hello world', 'utf8', (error) => {
    if (error) {
        throw error;
    }

    console.log('success');
});
~~~

创建多级文件夹

~~~js
const fs = require('fs');

fs.mkdir('mydir/hello/world', {recursive: true}, (error) => {
    if (error) {
        throw  error;
    }

    console.log('success');
});
~~~

获取当前目录下所有文件及文件夹名称

~~~js
const fs = require('fs');

fs.readdir('./', (error, files) => {
    if (error) {
        throw error;
    }

    console.log(files);
});
~~~

判断文件或文件夹是否存在

~~~js
const fs = require('fs');

fs.access('./app.js', (error) => {
    if (error) {
        throw error;
    }

    console.log('success');
});
~~~

获取指定文件的完整路径

~~~js
const fs = require('fs');

fs.realpath('app0.js', (error, resolvedPath) => {
    if (error) {
        throw error;
    }

    console.log(resolvedPath);
});
~~~

删除文件夹, 多级文件夹

```js
const fs = require('fs');

fs.rmdir('mydir', {recursive: true}, (error) => {
    if (error) {
        throw error;
    }

    console.log('success');
});
```

创建文件读取流, 读取流的各种事件

~~~js
const fs = require('fs');

const readStream = fs.createReadStream('./app12.js', {encoding: 'utf8'});
//打开
readStream.on('open', (fd) => {
    console.log(fd);
});
//准备
readStream.on('ready', () => {
    console.log('ready');
});
//内容
readStream.on('data', (data) => {
    console.log(data);
});
//结束
readStream.on('end', () => {
    console.log('end');
});
//关闭
readStream.on('close', () => {
    console.log('close');
});
//错误
readStream.on('error', (error) => {
    console.log(error);
});
~~~

创建读取和写入流, 将读取流的目标文件内容写入到写入流的目标文件中

若文件不存在会自动创建

~~~js
const fs = require('fs');

const readStream = fs.createReadStream('./app12.js', {encoding: 'utf8'});
const writeStream = fs.createWriteStream('mytest.js', {encoding: 'utf8'});

readStream.on('data', (data) => {
    writeStream.write(data, () => {
        console.log(data);
    });
});
~~~



## buffer模块

创建缓存空间并写入内容

~~~js
const buffer = Buffer.alloc(128);

const length = buffer.write('helloworld你好', 'utf8');

console.log('byte count: ' + length);
~~~

创建时便写入内容, 比较两个缓存空间内容是否相同

相同返回0 不同返回-1

~~~js
const buffer1 = Buffer.from('hello');
const buffer2 = Buffer.from('hello');

const compareResult = buffer1.compare(buffer2);

console.log(compareResult);
~~~

通过索引加入内容, 数字对应ACSll码表中的字符

~~~js
const buffer = Buffer.alloc(3);

buffer[0] = 65;
buffer[1] = 66;
buffer[2] = 67;

console.log(buffer.toString('utf8'));
~~~

一个文字占用3个字节, buffer中存的是ACSll码值与unicode字符码

使用tostring()可以转换为对应的字符

~~~js
const str = 'abcde天';
const buffer = Buffer.from(str);

console.log(str.length);
console.log(buffer.length);

console.log(buffer);
console.log(buffer.toString('utf8'));
~~~

合并多个buffer为一个buffer

totalLength不填默认为所有buffer长度之和

若所填的字小于所有buffer长度之和会截断buffer并返回

~~~js
const buffer1 = Buffer.from('hello');
const buffer2 = Buffer.from('world');
const buffer3 = Buffer.from('welcome');
const buffer4 = Buffer.from('你好');

const bufferArray = [buffer1, buffer2, buffer3, buffer4];

const bufferResult = Buffer.concat(bufferArray, 10);

console.log(bufferResult.length);

console.log(bufferResult.toString('utf8'));
~~~

JSON格式转换buffer

~~~js
const buffer = Buffer.from('你好世界');
const jsonString = JSON.stringify(buffer);

console.log(jsonString);

const jsonObject = JSON.parse(jsonString);

console.log(jsonObject);

const buffer2 = Buffer.from(jsonObject);

console.log(buffer2.toString('utf8'));
~~~

判断是否为buffer支持的字符编码格式

~~~js
const str = 'utf8';
const str2 = 'utf-8';
const str3 = 'UTF-8';
const str4 = 'utf9';
const str5 = 'gb2312';
const str6 = 'gbk';

console.log(Buffer.isEncoding(str));	//true
console.log(Buffer.isEncoding(str2));	//true
console.log(Buffer.isEncoding(str3));	//true
console.log(Buffer.isEncoding(str4));	//false
console.log(Buffer.isEncoding(str5));	//false
console.log(Buffer.isEncoding(str6));	//false
~~~

buffer是对象类型, isBuffer判断是否为一个buffer

~~~js
const buffer = Buffer.from('hello');
const myObj = {};
const str = "aa";
const flag = true;
const count = 4;

console.log(typeof myObj);
console.log(typeof buffer);
console.log(typeof str);
console.log(typeof flag);
console.log(typeof count);

console.log(Buffer.isBuffer(myObj));	//false
console.log(Buffer.isBuffer(buffer));	//true
~~~



## net模块

创建一个net服务

方式一

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('client connected');
    console.log(socket);
});

server.listen(8888, () => {
    console.log('server is listening');
});
~~~

方式二

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('client connected');
});

server.listen(8888);

server.on('listening', () => {
    console.log('server is listening');
});
~~~

net服务的事件机制

~~~js
const net = require('net');

const server = new net.Server();

server.on('connection', (socket) => {
    console.log('client connected');
});

server.listen(8888);

server.on('listening', () => {
    console.log('server is listening');

    server.close();
});

server.on('close', () => {
    console.log('server closed');
});

server.on('error', (error) => {
    console.log('server error');
});
~~~

获取端口网络等信息

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('client connected');
});

server.listen(8888, () => {
    const address = server.address();

    console.log(address.port + ", " + address.address + ", " + address.family);
});
~~~

设置服务最大连接数

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('client connected');

    server.maxConnections = 2;

    server.getConnections((error, count) => {
        console.log('client count: ' + count);
    });
});

server.listen(8888, () => {
    console.log('server is listening');
});
~~~

data为请求连接的请求头信息

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        console.log(data.toString());
    });
});

server.listen(8888, () => {
    console.log('server is listening');
});
~~~

socket.bytesWritten发送的字节数

socket.bytesRead接收的字节数

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    const address = socket.address();
    const message = 'server address is ' + JSON.stringify(address);

    socket.write(message, () => {
        const writeSize = socket.bytesWritten;

        console.log(message);
        console.log('message size is: ' + writeSize);
    });

    socket.on('data', (data) => {
        console.log(data.toString());

        const readSize = socket.bytesRead;

        console.log('data size is: ' + readSize);
    });
});

server.listen(8888, () => {
    console.log('server is listening');
});
~~~

客户端连接过来的网络信息

~~~js
const net = require('net');

const server = net.createServer((socket) => {
    console.log('local port: ' + socket.localPort);
    console.log('local address: ' + socket.localAddress);
    console.log('remote port: ' + socket.remotePort);
    console.log('remote family: ' + socket.remoteFamily);
    console.log('remote address: ' + socket.remoteAddress);
});

server.listen(8888, () => {
    console.log('server is listening');
});
~~~

创建socket客户端

~~~js
const net = require('net');
const client = new net.Socket();

client.connect(8888, 'localhost', () => {
    console.log('connected to the server');
});
~~~



## dgram模块

创建一个socket服务监听9999端口

无限循环互发消息

服务端

~~~js
const dgram = require('dgram');

const message = Buffer.from('This message comes from server');

const socket = dgram.createSocket('udp4', (msg, info) => {
    //发送消息
    socket.send(message, 0, message.length, info.port, info.address, (error, bytes) => {
        if (error) {
            console.log(error);
            return;
        }

        console.log('Server has sent ' + bytes + ' bytes message');
    });
});
//监听
socket.bind(9999, 'localhost', () => {
    console.log('Server has binded to 9999');
});
//接收
socket.on('message', (msg, info) => {
    console.log('message event occured');
    console.log(msg.toString());
});
~~~

客户端

~~~js
const dgram = require('dgram');

const message = Buffer.from('This message comes from client');
const socket = dgram.createSocket('udp4');
//发送消息,第一次发送
socket.send(message, 0, message.length, 9999, 'localhost', (error, bytes) => {
    if (error) {
        console.log(error);
        return;
    }

    console.log('client has sent ' + bytes + ' bytes message');
});
//接收消息
socket.on('message', (msg, info) => {
    console.log(msg.toString())
    const message2Send = 'hello world';
    //发送消息
    socket.send(message2Send, 0, message2Send.length, 9999, 'localhost');
});
~~~



## socket.io

服务端

~~~js
const http = require('http');
const io = require('socket.io');
const fs = require('fs');

const server = http.createServer((request, response) => {
    response.writeHead(200, {'Content-Type': 'text/html'});

    if (request.url === '/') {
        fs.readFile('./client.html', 'utf8', (error, data) => {
            if (error) {
                console.log('error occured');
                return;
            } else {
                response.end(data.toString());
            }
        });
    } else {
        response.end('<html><body>Error</body></html>');
    }
});

server.listen(3000, 'localhost');

const socket = io.listen(server);

socket.on('connection', (socket) => {
    console.log('connection has been established');

    socket.on('message', (message) => {
        console.log('message: ' + message);
    });

    socket.on('disconnect', () => {
        console.log('connection has lost');
    });

    socket.emit('serverEvent', 'this is serverEvent');

    socket.on('clientEvent', (data) => {
        console.log(data.address + ", " + data.age);
    });

    socket.on('broadcastEventClient', (message) => {
        console.log(message);
        socket.broadcast.emit('broadcastEventServer', 'you are good!');
    });

    socket.send('hello client');
});
~~~

客户端

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

    <script src="/socket.io/socket.io.js"></script>

    <script type="text/javascript">
        const socket = io('http://localhost:3000');
        //接收消息
        socket.on('message', (message) => {
            console.log('data from server: ' + message);
        });
        //断开连接
        socket.on('disconnect', () => {
            console.log('disconnect');
        });
        //接收服务端对应事件消息
        socket.on('serverEvent', (data) => {
            console.log('serverEvent: ' + data);
            //发送对应事件消息给服务端
            socket.emit('clientEvent', {address: 'taiyuan', age: 20});
        });
        //发给服务端的广播消息
        socket.emit('broadcastEventClient', 'take care');
        //接收服务端广播消息
        socket.on('broadcastEventServer', (message) => {
            console.log(message);
        });


    </script>

</head>
<body>

</body>
</html>
~~~



## events模块

~~~js
const http = require('http');
const events = require('events');

const httpServer = http.createServer();
//设置最大事件监听器
httpServer.setMaxListeners(2);

httpServer.on('request', (request, response) => {
    if (request.url === '/') {
        console.log('addListener');
        response.end('end');
    }
});

const listener = (request, response) => {
    if (request.url === '/') {
        console.log('hello world');
        response.end('welcome');
    }
};

const listener2 = (request, response) => {
    if (request.url === '/') {
        console.log('hello world');
        response.end('welcome');
    }
};

const listener3 = (request, response) => {
    if (request.url === '/') {
        console.log('hello world');
        response.end('welcome');
    }
};
//默认每个事件最多注册10个监听器
console.log('default max listener count: ' + events.EventEmitter.defaultMaxListeners);

httpServer.on('request', listener);
httpServer.on('request', listener2);
httpServer.on('request', listener3);


httpServer.listen(3000, () => {
    console.log('listening to port 3000');
});
~~~

单个事件的多次触发监听

~~~js
const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('myEvent', function myListener() {
    console.log('myListener');
});

emitter.on('myEvent', function myListener2(param1, param2) {
    console.log(`myListener2: ${param1}, ${param2}`);
});

emitter.on('myEvent', function myListener3(...params) {
    const values = params.join(', ');
    console.log(`myListener3: ${values}`);
});

console.log(emitter.listeners('myEvent'));

emitter.emit('myEvent', 'a', 'b', 'c', 'd', 'e', 'f');
~~~

emitter.once只触发一次并且下单触发时会先移除该事件

~~~js
const EventEmitter = require('events');
const emitter = new EventEmitter();
//单次监听一个新事件
emitter.once('newListener', (event, listener) => {
    if (event === 'myEvent') {
        //接收事件
        emitter.on('myEvent', () => {
            console.log('hello');
        });
    }
});

emitter.on('myEvent', () => {
    console.log('world');
});

emitter.emit('myEvent');
~~~



## process模块

进程信息及事件监听

~~~js
console.log(process.version);

console.log(process.versions);

console.log(process.platform);

console.log(process.execPath);

console.log(process.config);

console.log(process.pid);

console.log(process.title);

console.log(process.arch);

console.log(process.memoryUsage());

console.log(process.cwd());

process.chdir('../');

console.log(process.cwd());

console.log(process.env);

console.log(process.uptime());

process.on('exit', () => {
    console.log('node process exited');
});

// process.exit(0);

process.on('beforeExit', () => {
    console.log('node process before exited');
});

process.on('uncaughtException', (error) => {
    console.log(error);
    console.log('=======');
    console.log('uncaughtException occured');
});

process.on('SIGINT', () => {
    console.log('received SIGINT info');
});

setTimeout(() => {
    console.log('timeout');
}, 100000);
~~~



nextTick会在异步之前执行

~~~js
const fs = require('fs');

const myFunction = () => {
    console.log('myFunction invoked');
};
//nextTick会在异步之前执行
process.nextTick(myFunction);
//同步读取
console.log(fs.readFileSync('./app1.js').toString('utf8'));
//异步读取
fs.readFile('./app1.js', (error, data) => {
    console.log(data.toString('utf8'));
});
~~~



## child_process模块

创建子进程执行命令

```js
const childProcess = require('child_process');
//创建子进程执行命令
const lsChildProcess = childProcess.spawn('cmd', ['-al', './']);

lsChildProcess.stdout.on('data', (data) => {
    console.log(data.toString());
    //子进程的pid
    console.log(`child process id: ${lsChildProcess.pid}`);
});
//关闭事件
lsChildProcess.on('exit', (code, signal) => {
    console.log(code);
});
```

创建子进程执行node运行其他文件

~~~js
const childProcess = require('child_process');

const nodeChildProcess = childProcess.spawn('node', ['app2']);

nodeChildProcess.stdout.on('data', (data) => {
    console.log(data.toString());
    console.log(`child process id: ${nodeChildProcess.pid}`);
});

nodeChildProcess.on('exit', (code, signal) => {
    console.log(code);
});
~~~

silent: true 只获取接收到的消息: 下面只输出welcome

此为./app5.js代码

~~~js
[1, 2, 3, 4, 5].forEach(i => {
    console.log(i);
});
//接收
process.on('message', (message) => {
    console.log(message);
//发送
    process.send('welcome');
});
~~~

此为执行子进程命令代码

~~~js
const childProcess = require('child_process');
//在子进程中运行
const forkProcess = childProcess.fork('./app5', {silent: true});
//接收消息
forkProcess.on('message', (message) => {
    console.log(message);
});
//发送消息
forkProcess.send('hello world');
~~~



exec执行命令

~~~js
const childProcess = require('child_process');

childProcess.exec('node app7', (error, stdout, stderr) => {
    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log(stdout.toString());
    }
});

//app7代码
['hello', 'world', 'hello world', 'welcome'].forEach((str) => {
    console.log(str);
});
~~~

execFile执行命令

~~~js
const childProcess = require('child_process');

childProcess.execFile('node', ['app9'], (error, stdout, stderr) => {
    if (error) {
        console.log(error);
        throw error;
    } else {
        console.log(stdout.toString());
    }
});
//app9代码
const addFunction = (a, b) => {
    return a + b;
};

console.log(addFunction(5, 8));
~~~

## os与cluster模块

操作系统与集群

~~~js
const cluster = require('cluster');
const http = require('http');
const os = require('os');

const cpuCount = os.cpus().length;
console.log(cpuCount)

//cluster.schedulingPolicy = cluster.SCHED_RR;

/*
    Master - Worker 模式
 */
//是否为主线程
if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; ++i) {
        cluster.fork();//启动工作进程
    }
    //工作进程关闭时触发
    cluster.on('exit', (worker, code, signal) => {
        console.log(worker.process.pid);
    })
} else {
    const httpServer = http.createServer((request, response) => {
        let data = '';

        request.on('data', (chunk) => {
            data += chunk;
        });

        request.on('end', () => {
            response.writeHead(200, {'Content-Type': 'text/plain'});

            response.end(`${process.pid}`);
        });
    });

    httpServer.listen(3000, () => {
        console.log('listening to port 3000');
    });
}
~~~



## koa特性

洋葱模型

~~~js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx, next) => {
    console.log('myFunction started');
    await next();
    console.log('myFunction finished');
});

app.use(async (ctx, next) => {
    console.log('myFunction2 started');
    await next();
    console.log('myFunction2 finished');
});


app.use(async (ctx, next) => {
    console.log('myFunction3 started');
    await next();
    console.log('myFunction3 finished');
});

app.use(async (ctx) => {
    // ctx.body = 'Hello Koa';

    ctx.response.type = 'text/html';
    ctx.response.body = '<h2>Hello Koa</h2>';
});

app.listen(3000);
~~~

服务监听与接口数据传输的简单实现

~~~js
const Koa = require('koa');
const app = new Koa();

app.use(async (ctx) => {
    ctx.response.type = 'application/json';

    const responseBody = {
        result: {
            code: 0,
            description: 'success'
        }, data: {
            username: 'zhangsan',
            address: 'taiyuan',
            age: 20
        }
    };

    ctx.body = JSON.stringify(responseBody);
});

app.listen(4000);
~~~

