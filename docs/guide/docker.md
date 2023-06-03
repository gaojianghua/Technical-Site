# Docker
## 起步
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

## DockerFile
- 只要在 dockerfile 里声明要做哪些事情，docker build 的时候就会根据这个 dockerfile 来自动化构建出一个镜像来。
  ~~~shell
  # dockerfile 示例如下:
  FROM node:latest
  # FROM：基于一个基础镜像来修改
  WORKDIR /app
  # WORKDIR：指定当前工作目录
  COPY . .
  # COPY：把容器外的内容复制到容器内
  RUN npm install -g http-server
  # RUN：在容器内执行命令
  EXPOSE 8080
  # EXPOSE：声明当前容器要访问的网络端口，比如这里起服务会用到 8080
  CMD ["http-server", "-p", "8080"]
  # CMD：容器启动的时候执行的命令
  # 解析:
  # 通过 FROM 继承了 node 基础镜像，里面就有 npm、node 这些命令了。
  # 通过 WORKDIR 指定当前目录。
  # 然后通过 COPY 把 Dockerfile 同级目录下的内容复制到容器内，这里的 . 也就是 /app 目录
  # 之后通过 RUN 执行 npm install，全局安装 http-server
  # 通过 EXPOSE 指定要暴露的端口
  # CMD 指定容器跑起来之后执行的命令，这里就是执行 http-server 把服务跑起来。
  # 把这个文件保存为 Dockerfile，然后在同级添加一个 index.html
  # 然后通过 docker build 就可以根据这个 dockerfile 来生成镜像
  ~~~
- 生成镜像
  ~~~shell
  # aaa 是镜像名，ccc 是镜像的标签，. 是构建上下文的目录也可以指定别的路径。
  docker build -t aaa:ccc .   # -f <filename> 指定文件名
  ~~~
- 方便修改文件可设置挂载点
  ~~~shell
  # dockerfile 中添加内容：
  VOLUME /app
  ~~~
- VOLUME 指令看起来没啥用，但能保证你容器内某个目录下的数据一定会被持久化，能保证没挂载数据卷的时候，数据不丢失。
- .dockerignore 的写法
  ~~~shell
  *.md
  # *.md 就是忽略所有 md 结尾的文件
  !README.md
  # !README.md 就是其中不包括 README.md
  node_modules/
  # node_modules/ 就是忽略 node_modules 下 的所有文件
  [a-c].txt
  # [a-c].txt 是忽略 a.txt、b.txt、c.txt 这三个文件
  .git/
  .DS_Store
  # .DS_Store 是 mac 的用于指定目录的图标、背景、字体大小的配置文件，这个一般都要忽略
  .vscode/
  .dockerignore
  .eslintignore
  .eslintrc
  .prettierrc
  .prettierignore
  # eslint、prettier 的配置文件在构建镜像的时候也用不到
  ~~~
- 使用 DockerFile 部署 Nest 项目
  ~~~shell
  *.md
  node_modules/
  .git/
  .DS_Store
  .vscode/
  .dockerignore
  ~~~
  ~~~shell
  FROM node:18
  # 基于 node 18 的镜像
  WORKDIR /app
  # 指定当前目录为容器内的 /app
  COPY package.json .
  # 把 package.json 复制过去
  RUN npm install
  # 执行 npm install 进行依赖包下载
  COPY . .
  # 把其余文件复制过去
  RUN npm run build
  # 执行 npm run build 进行打包
  EXPOSE 3000
  # 指定暴露的运行端口
  CMD [ "node", "./dist/main.js" ]
  # 容器跑起来以后执行 node ./dist/main.js 命令
  ~~~
  ~~~shell
  # 执行 docker 构建镜像
  docker build -t nest:first .
  ~~~
- 镜像运行时只需要 dist 目录，其余无用则不需要了，为了减少镜像体积，下面采用多阶段构建的方式
  ~~~shell
  # build stage
  FROM node:18 as build-stage
  # 基于 node 18 的镜像并指定当前镜像名称 build-stage
  WORKDIR /app
  # 指定当前目录为容器内的 /app
  COPY package.json .
  # 把 package.json 复制过去
  RUN npm install
  # 执行 npm install 进行依赖包下载
  COPY . .
  # 把其余文件复制过去
  RUN npm run build
  # 执行 npm run build 进行打包
  
  # production stage
  FROM node:18 as production-stage
  # 基于 node 18 的镜像并指定当前镜像名称 production-stage
  COPY --from=build-stage /app/dist /app
  # 从 build-stage 镜像内复制 /app/dist 的文件到当前镜像的 /app 下
  COPY --from=build-stage /app/package.json /app/package.json
  # 从 build-stage 镜像内复制 /app/package.json 的文件给当前镜像的 /app/package.json
  WORKDIR /app
  # 指定当前目录为容器内的 /app
  RUN npm install --production
  # 执行 npm install --production 只安装 dependencies 依赖
  EXPOSE 3000
  # 指定暴露的运行端口
  CMD ["node", "/app/main.js"]
  # 容器跑起来以后执行 node ./dist/main.js 命令
  ~~~
  ~~~shell
  # 执行 docker 构建镜像
  docker build -t nest:second .
  ~~~
