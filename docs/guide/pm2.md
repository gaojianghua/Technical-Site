# PM2

 pm2需要全局安装

 `npm install -g pm2`

### 进入项目根目录:

启动进程/应用           `pm2 start bin/www 或 pm2 start app.js`

重命名进程/应用           `pm2 start app.js --name wb123`

添加进程/应用 watch         `pm2 start bin/www --watch`

结束进程/应用            `pm2 stop www`

结束所有进程/应用           `pm2 stop all`

删除进程/应用            `pm2 delete www`

删除所有进程/应用             `pm2 delete all`

列出所有进程/应用          `pm2 list`

查看某个进程/应用具体情况      `pm2 describe www`

查看进程/应用的资源消耗情况       `pm2 monit`

查看pm2的日志                 `pm2 logs`

若要查看某个进程/应用的日志,使用  `pm2 logs www`

重新启动进程/应用            `pm2 restart www`

重新启动所有进程/应用        `pm2 restart all`



### 参数说明：

- `--watch`：监听应用目录的变化，一旦发生变化，自动重启。如果要精确监听、不见听的目录，最好通过配置文件。
- `-i --instances`：启用多少个实例，可用于负载均衡。如果`-i 0`或者`-i max`，则根据当前机器核数确定实例数目。
- `--ignore-watch`：排除监听的目录/文件，可以是特定的文件名，也可以是正则。比如`--ignore-watch="test node_modules "some scripts""`
- `-n --name`：应用的名称。查看应用信息的时候可以用到。
- `-o --output `：标准输出日志文件的路径。
- `-e --error `：错误输出日志文件的路径。
- `--interpreter `：the interpreter pm2 should use for executing app (bash, python...)。比如你用的coffee script来编写应用。