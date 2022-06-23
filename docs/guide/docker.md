# docker

安装

~~~
curl -fsSL https://get.docker.com | bash -s docker --mirror Aliyun
~~~

设置开机自启动

~~~
systemctl enable docker
~~~

启动

~~~
systemctl start docker
~~~

登录阿里云---进入控制台---容器镜像服务---镜像工具---镜像加速器

~~~js
//依次执行
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://2d37goqr.mirror.aliyuncs.com"]
}
EOF
sudo systemctl daemon-reload
sudo systemctl restart docker
~~~

运行镜像

~~~
sudo docker run hello-world
~~~

查看镜像

~~~
docker ps -a
~~~

删除镜像

~~~
docker rm 镜像ID
~~~

安装docker-compose

~~~
curl -L https://get.daocloud.io/docker/compose/releases/download/1.25.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
~~~

设置权限

~~~
sudo chmod +x /usr/local/bin/docker-compose
~~~

安装mysql

~~~
docker pull mysql:5.7
~~~

启动mysql镜像

~~~js
//命令
docker run -p 3306:3306 --name mymysql -v $PWD/conf:/etc/mysql/conf.d -v $PWD/logs:/logs -v $PWD/data:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:5.7
//释义
-p 3306:3306	//将容器的3306端口映射到主机的3306端口
-v $PWD/conf:/etc/mysql/conf.d		//将主机当前目录下的conf/my.conf挂载到容器的/etc/mysql/my.conf
-v $PWD/logs:/logs		//将主机当前目录下的logs目录挂载到容器的/logs
-v $PWD/data:/var/lib/mysql		//将主机当前目录下的data目录挂载到容器的/var/lib/mysql
-e MYSQL_ROOT_PASSWORD=123456	//初始化root用户的密码
~~~

可能的报错

~~~
//runc: symbol lookup error: runc: undefined symbol: seccomp_api_get
//安装
yum install libseccomp-devel
~~~

进入容器

~~~
docker exec -it 镜像ID /bin/bash
~~~

进入mysql

~~~
mysql -uroot -p123456
~~~

建立用户并授权

~~~
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' IDENTIFIED BY 'root' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'127.0.0.1' IDENTIFIED BY 'root' WITH GRANT OPTION;

GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' IDENTIFIED BY 'root' WITH GRANT OPTION;

FLUSH PRIVILEGES;
~~~

## Go

下载

~~~
wget https://dl.google.com/go/go1.17.3.linux-amd64.tar.gz
~~~

解压

~~~
tar -xvf go1.17.3.linux-amd64.tar.gz
~~~

配置环境变量

~~~
vim ~/.bashrc

export GOROOT=/root/go
export GOPATH=/root/projects/go
export PATH=$PATH:$GOROOT/bin:$GPPATH/bin

source ~/.bashrc
~~~

设置代理

~~~
go env -w GO111MODULE=on
go env -w GOPROXY=https://goproxy.cn,direct
~~~

## Node

若无发连接github

~~~
vi /etc/hosts
~~~

加入github.com的IP地址

~~~
140.82.112.4
~~~

使用nvm:

~~~
wget https://github.com/nvm-sh/nvm/archive/refs/tags/v0.38.0.tar.gz
mkdir .nvm
tar -zxvf nvm-0.38.0.tar.gz --strip-components 1  -C /root/.nvm
~~~

配置环境变量

~~~
vi ~/.bashrc
~~~

~~~
export NVM_DIR=".nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
~~~

~~~
source ~/.bashrc
~~~

直接安装:

下载

~~~
wget https://nodejs.org/dist/v16.13.0/node-v16.13.0-linux-x64.tar.xz
~~~

解压

~~~
tar -xvf node-v16.13.0-linux-x64.tar.xz
~~~

配置软链接

~~~
ln -s /root/node-v16.13.0-linux-x64/bin/node /usr/bin/node
ln -s /root/node-v16.13.0-linux-x64/bin/npm /usr/bin/npm
~~~



## Yapi

~~~
git clone https://github.com/Ryan-Miao/docker-yapi.git
~~~

第一次启动

~~~
1.路径：vim  root/dokcer-yapi/docker-compose.yml 

2.去掉#号 command: "yapi server"，

3.给命令 command: "node /my-yapi/vendors/server/app.js" 这个前面加#号

3.再去执行：docker-compose up

4.访问IP：9090
~~~

使用浏览器访问

~~~
http://0.0.0.0:9090/
~~~

完成初始化配置后

~~~
1.路径：vim  root/dokcer-yapi/docker-compose.yml 

2.在这个 command: "yapi server"这个前面加#号

3.去掉#号 command: "node /my-yapi/vendors/server/app.js" 

3.再去执行：docker-compose up

4.访问IP：9090
~~~



## Nginx

docker运行nginx

~~~
docker run --name nginx -d -p 80:80 nginx:latest
~~~

docker运行nginx - 挂载目录映射

~~~
mkdir /docker
~~~

该命令会启动失败, 因/etc/nginx映射到了/docker/nginx/config/nginx/中, 启动命令会去找

/docker/nginx/config/nginx/里的配置文件, 但这个里面是没有配置文件的, 需要手动将启动

正常的nginx中的配置文件拷贝到/docker/nginx/config/nginx/中

~~~
docker run --name nginx -p 80:80 \
-v /docker/nginx/config/nginx/:/etc/nginx \
-v /docker/nginx/data/html:/usr/share/nginx/html \
-v /docker/nginx/logs/:/var/log/nginx \
-d nginx:latest
~~~

拷贝容器nginx中的配置文件到宿主机中

~~~
docker cp nginx:/etc/nginx /docker/nginx/config/
docker cp nginx:/usr/share/nginx/html /docker/nginx/data/
docker cp nginx:/var/log/nginx 
~~~