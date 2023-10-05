# Nest
[中文文档](https://docs.nestjs.cn/9/introduction) <br>
[英文文档](https://nestjs.com)
## 简介

Nest (NestJS) 是一个用于构建高效、可扩展的 Node.js 服务器端应用程序的开发框架。它利用 JavaScript 的渐进增强的能力，使用并完全支持 TypeScript （仍然允许开发者使用纯 JavaScript 进行开发），并结合了 OOP （面向对象编程）、FP （函数式编程）和 FRP （函数响应式编程）。

## 流程图
![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/nestjs-process.webp)

## Cli
- 全局安装
  ~~~shell
  npm install -g @nestjs/cli  #安装
  npm update -g @nestjs/cli   #更新
  ~~~
- 新建项目
  ~~~shell
  nest new <Project name>
  ~~~
- 生成代码文件
  ~~~shell
  nest generate <module | controller | service> <filename>  #单独生成某一项
  nest generate resource <filename>   #生成整个模块
  # 参数
  --flat      # 不生成对应目录
  --no-flat   # 生成对应目录
  --spec      # 生成测试文件
  --no-spec   # 不生成测试文件
  --skip-import   # 指定不在 AppModule 里引入
  ~~~
  
## Provider
- Nest 实现了 IOC 容器，会从入口模块开始扫描，分析 Module 之间的引用关系，对象之间的依赖关系，自动把 provider 注入到目标对象
- 一般使用 @Injectable 修饰的 class
  ~~~js
  @Injectable()
  export class AppService {
    getHello(): string {
      return "hello world"
    }
  }
  ~~~
- 在 Module 的 providers 里声明
  ~~~js
  // 简写方式
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [AppService]
  })
  export class AppModule {}
  // 完整方式
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: AppService, // 通过 provide 指定注入的 token 标识, 通过 useClass 指定注入的对象的类, Nest 会自动对它做实例化再注入
      useClass: AppService
    }]
  })
  export class AppModule {}
  // provide 可以是字符串
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: "app_service",
      useClass: AppService
    }]
  })
  export class AppModule {}
  ~~~
- 在 Controller 中注入
  ~~~js
  // 普遍的注入方式
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @Get()
    getHello():sting {
      return this.appService.getHello();
    }
  }
  // provide 是字符串时的注入方式
  @Controller()
  export class AppController {
    constructor(@Inject('app_service') private readonly appService: AppService) {}
    
    @Get()
    getHello():sting {
      return this.appService.getHello();
    }
  }
  ~~~
- 在 providers 中直接使用值来注册
  ~~~js
  // 注册
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: "person",
      useValue: {
        name: 'gaojianghua',
        age: 28
      } 
    }]
  })
  export class AppModule {}
  // 注入
  @Controller()
  export class AppController {
    constructor(@Inject('person') private readonly person: {name: sting, age: number}) {}
    
    @Get()
    getHello():sting {
      return this.person;
    }
  }
  ~~~
- 在 providers 中注册动态产生的值
  ~~~js
  // 注册
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [{
      provide: "person",
      useExisting: "person-s",  // 使用别名
      async useFactory(appService: AppService) { // 支持传参，支持异步
        await new Promise((resole)=> {
          setTimeout(resole, 1000)
        })
        return {
          name: 'gaojianghua',
          age: 28,
          desc: appService.getHello()
        }
      },
      inject: [AppService]  // 额外申明token, 调用 useFactory 方法的时候，Nest 就会注入它
    }]
  })
  export class AppModule {}
  // 注入
  @Controller()
  export class AppController {
    constructor(@Inject('person-s') private readonly person: {name: sting, age: number, desc: AppService}) {}
    
    @Get()
    getHello():sting {
      return this.person;
    }
  }
  ~~~
- 引入和导出
  ~~~js
  // 导出
  @Module({
    controllers: [MaleController],
    providers: [MaleService],
    exports: [MaleService]
  })
  export class MaleModule {}
  // 引入
  @Module({
    imports: [MaleService],
    controllers: [PeopleController],
    providers: [PeopleService]
  })
  export class PeopleModule {}
  // 注入
  @Controller()
  export class PeopleController {
    constructor(private readonly maleService: MaleService) {}
    
    @Get()
    getHello():sting {
      return this.maleService.getHello();
    }
  }
  ~~~
- 在全局申明
  ~~~js
  // 全局申明
  @Global()
  @Module({
    controllers: [MaleController],
    providers: [MaleService],
    exports: [MaleService]
  })
  export class MaleModule {}
  // 无需引入
  @Module({
    imports: [],
    controllers: [PeopleController],
    providers: [PeopleService]
  })
  export class PeopleModule {}
  // 直接注入使用
  @Controller()
  export class PeopleController {
    constructor(private readonly maleService: MaleService) {}
    
    @Get()
    getHello():sting {
      return this.maleService.getHello();
    }
  }
  ~~~
  
## 生命周期
- Nest 在启动的时候，会递归解析 Module 依赖，扫描其中的 provider、controller，注入它的依赖。
  全部解析完后，会监听网络端口，开始处理请求。这个过程中，Nest 暴露了一些生命周期方法。
- 首先，递归初始化模块，会依次调用模块内的 controller、provider 的 onModuleInit 方法，然后再调用 module 的 onModuleInit 方法。
- 全部初始化完之后，再依次调用模块内的 controller、provider 的 onApplicationBootstrap 方法，然后调用 module 的 onApplicationBootstrap 方法。
- 然后监听网络端口。
- 这个过程中，onModuleInit、onApplicationBootstrap 都是我们可以实现的生命周期方法。
- 实现 onModuleInit、onApplicationBootstrap
  ~~~js
  // Controller
  @Controller()
  export class AppController implements OnModuleInit, OnApplicationBootstrap {
    constructor(private readonly appService: AppService) {}
    
    onModuleInit() {
      console.log('Controller OnModuleInit')
    }
    onApplicationBootstrap() {
      console.log('Controller OnApplicationBootstrap')
    }
  }
  // Service
  @Injectable()
  export class AppService implements OnModuleInit, OnApplicationBootstrap {
    
    onModuleInit() {
      console.log('Service OnModuleInit')
    }
    onApplicationBootstrap() {
      console.log('Service OnApplicationBootstrap')
    }
  }
  // Module
  @Module({
    controllers: [AppController],
    providers: [AppService]
  })
  export class AppModule implements OnModuleInit, OnApplicationBootstrap {
    
    onModuleInit() {
      console.log('Module OnModuleInit')
    }
    onApplicationBootstrap() {
      console.log('Module OnApplicationBootstrap')
    }
  }
  // 执行后的打印结果: 所有模块的 Module 初始化完成才会执行 app 引导
  // Controller OnModuleInit
  // Service OnModuleInit
  // Module OnModuleInit
  // Controller OnApplicationBootstrap
  // Service OnApplicationBootstrap
  // Module OnApplicationBootstrap
  ~~~
- 应用销毁时先调用每个模块的 controller、provider 的 onModuleDestroy 方法，然后调用 Module 的 onModuleDestroy 方法。
- 之后再调用每个模块的 controller、provider 的 beforeApplicationShutdown 方法。
- 然后停止监听网络端口。
- 之后调用每个模块的 controller、provider 的 onApplicationShutdown 方法，然后调用 Module 的 onApplicationShutdown 方法。
- 之后停止进程。
- beforeApplicationShutdown 是可以拿到 signal 系统信号的，比如 SIGTERM。
- 这些终止信号是别的进程传过来的，让它做一些销毁的事情，比如用 k8s 管理容器的时候，可以通过这个信号来通知它。
- 实现 onModuleDestroy、beforeApplicationShutdown、onApplicationShutdown
  ~~~js
  // Controller
  @Controller()
  export class AppController implements OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
    constructor(private readonly appService: AppService) {}
    
    onModuleDestroy() {
      console.log('Controller OnModuleDestroy')
    }
    beforeApplicationShutdown(signal: string) {
      console.log('Controller BeforeApplicationShutdown')
    }
    onApplicationShutdown() {
      console.log('Controller OnApplicationShutdown')
    }
  }
  // Service
  @Injectable()
  export class AppService implements OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
    
    onModuleDestroy() {
      console.log('Service OnModuleDestroy')
    }
    beforeApplicationShutdown(signal: string) {
      console.log('Service BeforeApplicationShutdown')
    }
    onApplicationShutdown() {
      console.log('Service OnApplicationShutdown')
    }
  }
  // Module
  @Module({
    controllers: [AppController],
    providers: [AppService]
  })
  export class AppModule implements OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
    
    onModuleDestroy() {
      console.log('Module OnModuleDestroy')
    }
    beforeApplicationShutdown(signal: string) {
      console.log('Module BeforeApplicationShutdown')
    }
    onApplicationShutdown() {
      console.log('Module OnApplicationShutdown')
    }
  }
  // 在 main.ts 中执行销毁
  async function bootstrap () {
    const app = await NestFactory.create(AppModule)
    await app.listen(3000)
    setTimeout(() => {
      app.close()
    }, 3000)
  }
  bootstrap()
  // 执行后的打印结果: 所有模块的 Module 初始化完成才会执行 app 引导
  // Controller OnModuleDestroy
  // Service OnModuleDestroy
  // Module OnModuleDestroy
  // Controller BeforeApplicationShutdown
  // Service BeforeApplicationShutdown
  // Module BeforeApplicationShutdown
  // Controller OnApplicationShutdown
  // Service OnApplicationShutdown
  // Module OnApplicationShutdown
  ~~~
- 所有的生命周期函数都是支持 async 的。
- 一般都是通过 moduleRef 取出一些 provider 来销毁，比如关闭连接。
- 这里的 moduleRef 就是当前模块的对象。
  ~~~js
  @Module({
    controllers: [AppController],
    providers: [AppService]
  })
  export class AppModule implements OnModuleDestroy, BeforeApplicationShutdown, OnApplicationShutdown {
    constructor(private moduleRef: ModuleRef) {}
  
    onModuleDestroy() {
      console.log('Module OnModuleDestroy')
    }
    beforeApplicationShutdown(signal: string) {
      console.log('Module BeforeApplicationShutdown')
    }
    async onApplicationShutdown() {
      const appService = this.moduleRef.get<AppService>(AppService)
      await appService.close()
      console.log('Module OnApplicationShutdown')
    }
  }
  ~~~
## AOP架构
- MVC 是 Model View Controller 的简写。MVC 架构下，请求会先发送给 Controller，由它调度 Model 层的 Service 来完成业务逻辑，然后返回对应的 View。
- 在调用 Controller 之前和之后加入一个执行通用逻辑的阶段，这样的横向扩展点就叫做切面，这种透明的加入一些切面逻辑的编程方式就叫做 AOP （面向切面编程）。
- AOP 的好处是可以把一些通用逻辑分离到切面中，保持业务逻辑的存粹性，这样切面逻辑可以复用，还可以动态的增删。
- Nest 实现 AOP 的方式有五种，包括 Middleware、Guard、Pipe、Interceptor、ExceptionFilter。
- Middleware(中间件): 在请求之前和之后加入额外的处理逻辑
  ~~~js
  // 全局中间件
  const app = await NestFactory.create(AppModule)
  app.use(logger)   // 全局中间件，每个请求都会走logger中间件
  await app.listen(3000)
  // 路由中间件
  export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
      consumer.apply(logger).forRoutes('home')    // 指定对应home路由会走logger中间件
    }
  }
  ~~~
- Guard(路由守卫): 在调用某个 Controller 之前判断权限，返回 true 或者 false 来决定是否放行
  ~~~js
  // Guard 要实现 CanActivate 接口，实现 canActivate 方法，可以从 context 拿到请求的信息，然后做一些权限验证等处理之后返回 true 或者 false。
  @Injectable()
  export class RolesGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      return true
    }
  }
  // 通过 @Injectable 装饰器加到 IOC 容器中，然后就可以在某个 Controller 启用了
  @Controller('home')
  @UseGuards(RolesGuard)
  export class HomeController {}
  // 全局启用
  const app = await NestFactory.create(AppModule)
  app.useGlobalGuards(new RolesGuard())
  ~~~
- Interceptor(拦截器): 可以在目标 Controller 方法前后(请求和响应)加入一些逻辑
  ~~~js
  // 实现 NestInterceptor 接口，实现 intercept 方法，调用 next.handle() 就会调用目标 Controller，可以在之前和之后加入一些处理逻辑。
  @Injectable()
  export class LoggerInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const now = Date.now()
      return next.handle().pipe(tap(()=> console.log(`after...${Date.now() - now}ms`)))
    }
  }
  // Controller 之前之后的处理逻辑可能是异步的。Nest 里通过 rxjs.md 来组织它们，所以可以使用 rxjs.md 的各种 operator。
  // 单独启用
  @Controller('home')
  @UseInterceptors(new LoggerInterceptor())
  export class HomeController {}
  // 全局启用
  const app = await NestFactory.create(AppModule)
  app.useGlobalInterceptors(new LoggerInterceptor())
  ~~~
- Pipe(管道): 用来对参数做一些检验和转换
  ~~~js
  // 实现 PipeTransform 接口，实现 transform 方法，里面可以对传入的参数值 value 做参数验证，比如格式、类型是否正确，不正确就抛出异常。也可以做转换，返回转换后的值。
  @Injectable()
  export class ValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata): Observable<any> {
      return value
    }
  }
  // Nest 内置有9个Pipe：
  ValidationPipe
  ParseIntPipe
  ParseBoolPipe
  ParseArrayPipe
  ParseUUIDPipe
  DefaultValuePipe
  ParseEnumPipe
  ParseFloatPipe
  ParseFilePipe
  // 对某个参数启用
  @Controller('home')
  export class HomeController {
    
    @Get()
    hello(@Param('id', ParseIntPipe) id: number) {
      return 'hello'
    }
  }
  // 单独启用
  @Controller('home')
  @UsePipes(ValidationPipe)
  export class HomeController {}
  // 全局启用
  const app = await NestFactory.create(AppModule)
  app.useGlobalPipes(new ValidationPipe())
  // 自定义Pipe
  import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common'
  
  @Injectable()
  export class AaaPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
      console.log(value, metadata)  // 打印的 value 就是 query、param 的值，而 metadata 里包含 type、metatype、data
      return 'gaojianghua'  // 返回值就是传给 handler 的参数值
    }
  }
  ~~~
- ExceptionFilter(异常过滤器): 对抛出的异常做处理，返回对应的响应
  ~~~js
  // 实现 ExceptionFilter 接口，实现 catch 方法，就可以拦截异常了，但是要拦截什么异常还需要用 @Catch 装饰器来声明，拦截了异常之后，可以返回对应的响应，给用户更友好的提示。
  @Catch(HttpException)
  export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp()
      const response = ctx.getResponse<Response>()
      const request = ctx.getRequest<Request>()
      const status = exception.getStatus()
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url  
      })
    }
  }
  // Nest 内置了很多 http 相关的异常，都是 HttpException 的子类:
  BadRequestException
  UnauthorizedException
  NotFoundException
  ForbiddenException
  NotAcceptableException
  RequestTimeoutException
  ConflictException
  GoneException
  PayloadTooLargeException
  UnsupportedMediaTypeException
  UnprocessableException
  InternalServerErrorException
  NotImplementedException
  BadGatewayException
  ServiceUnavailableException
  GatewayTimeoutException
  // 自定义扩展
  export class ForbiddenException extends HttpException {
    constructor() {
      super('Forbidden', HttpStatus.FORBIDDEN)
    }
  }
  // 对单个路由启用
  @Post()
  @UseFilters(new HttpExceptionFilter())
  async create(@Body() createUserDto: CreateUserDto) {
    throw new ForbiddenException()
  }
  // 全局启用
  const app = await NestFactory.create(AppModule)
  app.useGlobalFilters(new HttpExceptionFilter())
  ~~~
- 调用顺序
  1. Middleware
  2. Guard
  3. Interceptor
  4. Pipe
  5. ExceptionFilter
- Middleware 是 Express 的概念，在最外层，到了某个路由之后，会先调用 Guard，Guard 用于判断路由有没有权限访问，然后会调用 Interceptor，对 Contoller 前后扩展一些逻辑，在到达目标 Controller 之前，还会调用 Pipe 来对参数做检验和转换。所有的 HttpException 的异常都会被 ExceptionFilter 处理，返回不同的响应。

## 内置装饰器
- @Module: Nest提供了一套模块系统，用于声明模块。
- @Controller: 声明模块中的controller
- @Injectable: 声明模块中的provider
- @Inject: 指定注入provider的token
- @Optional: 声明可选，没有对应的provider也可正常创建对象
- @Catch: 指定处理的异常
- @UseFilters: 注册异常过滤器
- @UseGuards: 注册路由守卫
- @UseInterceptors: 注册拦截器
- @UsePipes: 注册管道
- @Query: 取 url 后面的参数，如：(?id=1&name=gaojianghua)
- @Param: 取路径中的参数，如：(/gaojianghua/:id)中的id
- @Body: 取 body 中的参数
- @Headers: 取请求头信息
- @Ip: 取消 IP 
- @HostParam: 取域名部分的参数
- @Req | @Request: 注入 request 对象，可以取请求中的任何参数
- @Res | @Response: 注入 response 对象，Nest不会把返回值做为响应内容，需手动通过 res.end() 响应或者设置 response 的配置属性 passthrough 为true告诉Nest通过返回值来响应。
- @Session: 拿到 session 对象，使用时需安装(npm install express-session)
- @Get: 指定接口请求方式为 GET
- @Post: 指定接口请求方式为 POST
- @Put: 指定接口请求方式为 PUT
- @Delete: 指定接口请求方式为 DELETE
- @Patch: 指定接口请求方式为 PATCH
- @Options: 指定接口请求方式为 OPTIONS
- @Head: 指定接口请求方式为 HEAD
- @SetMetadata: 指定 metadata 元数据
- @Next: 请求转发，Nest 不会处理注入 @Next 的 handler 的返回值。
- @HttpCode: 指定返回响应的状态码
- @Header: 修改响应头信息
- @Redirect: 指定重定向的 URL
- @Render: 指定html渲染模板
  ~~~js
  // 安装模板引擎：npm install --save hbs
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';
  import { NestExpressApplication } from '@nestjs/platform-express';
  import { join } from 'path';
  
  async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  app.useStaticAssets(join(__dirname, '..', 'public')); // 静态资源路径
  app.setBaseViewsDir(join(__dirname, '..', 'views'));  // 模板文件路径
  app.setViewEngine('hbs'); // 指定模板引擎
  
  await app.listen(3000);
  }
  bootstrap();
  // 写好模板文件内容后，指定模板和数据
  @Get('user')
  @Render('user')  // user 模板文件名
  user() {
    retuen {name: 'gaojianghua', age: 28}
  }
  ~~~
## 装饰器扩展
- 自定义装饰器
  ~~~js
  // 自定义单独在home中使用的SetMetadata装饰器
  import { SetMetadata } from '@nestjs/common'
  export const HomeSetMetadata = (...args: string[]) => SetMetadata('home', args)
  // 使用
  @Get()
  @HomeSetMetadata('gaojianghua')
  @UseGuards(HomeGuard)
  home() {
    return
  }
  // 在Guard中取出metadata
  import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Observable } from 'rxjs.md';
  
  @Injectable()
  export class HomeGuard implements CanActivate {
    @Inject(Reflector)
    private reflector: Reflector;
  
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
      console.log(this.reflector.get('aaa', context.getHandler()));
      return true;
    }
  }
  ~~~
- 合并装饰器
  ~~~js
  import { applyDecorators, Get, UseGuards } from '@nestjs/common';
  import { Home } from './home.decorator';
  import { HomeGuard } from './home.guard';
  
  export function HomeMerge(path, role) {
  return applyDecorators(
    Get(path),
    Home(role),
    UseGuards(HomeGuard)
    )
  }
  // @HomeMerge('home', 'gaojianghua') 等同于 @Get() @HomeSetMetadata('gaojianghua') @UseGuards(HomeGuard)
  // 使用
  @HomeMerge('home', 'gaojianghua')
  home() {
    return
  }
  ~~~
- 自定义参数装饰器
  ~~~js
  // data 是传入的参数，而 ExecutionContext 可以取出 request、response 对象
  import { createParamDecorator, ExecutionContext } from '@nestjs/common'
  export const HomeData = createParamDecorator((data: string, ctx: ExecutionContext) => {
    return data
  })
  // 通过 ctx 我们还能自己实现一些内置获取参数的装饰器，如：@Headers
  import { createParamDecorator, ExecutionContext } from '@nestjs/common';
  import { Request } from 'express';
  
  export const MyHeaders = createParamDecorator(
    (key: string, ctx: ExecutionContext) => {
      const request: Request = ctx.switchToHttp().getRequest();
      return key ? request.headers[key] : request.headers;
    }
  );
  ~~~
  
## ExecutionContext: 切换不同上下文
  ~~~js
  // ArgumentHost 是用于切换 http、ws、rpc 等上下文类型的，可以根据上下文类型取到对应的 argument。
  import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
  import { Response } from 'express';
  import { HomeException } from './HomeException';
  
  @Catch(HomeException)
  export class HomeAFilter implements ExceptionFilter {
    catch(exception: HomeException, host: ArgumentsHost) {
      if(host.getType() === 'http') {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
  
        response
                .status(500)
                .json({
                  aaa: exception.aaa,
                  bbb: exception.bbb
                });
      } else if(host.getType() === 'ws') {
  
      } else if(host.getType() === 'rpc') {
  
      }
    }
  }
  // Guard 和 Interceptor 中的用法
  // ExecutionContext 是 ArgumentHost 的子类，扩展了 getClass、getHandler 方法。
  // Guard、Interceptor 的逻辑可能要根据目标 class、handler 有没有某些装饰而决定怎么处理。
  import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import { Observable } from 'rxjs.md';
  import { Role } from './role';
  
  @Injectable()
  export class AaaGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
  
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.get<Role[]>('roles', context.getHandler());
  
    if (!requiredRoles) {
      return true;
    }
  
    const { user } = context.switchToHttp().getRequest();
      return requiredRoles.some((role) => user && user.roles?.includes(role));
    }
  }
  ~~~
## Nest 核心实现原理
- 通过装饰器给 class 或者对象添加 metadata，并且开启 ts 的 emitDecoratorMetadata 来自动添加类型相关的 metadata，然后运行的时候通过这些元数据来实现依赖的扫描，对象的创建等等功能。
- Nest 的装饰器都是依赖 Reflect 的 metadata 的 API 实现的，而且还提供了一个 @SetMetadata 的装饰器让我们可以给 class、method 添加一些 metadata。
- 通过 reflector 上的 api 可以拿到 metadata
  ~~~js
  // reflector 上有四个方法
  get()     //获取 metadata 数据
  getAll()  // 返回一个 metadata 的数组。
  getAllAndMerge()  // 会把 metadata 合并为一个对象或者数组。
  getAllAndOverride()   // 会返回第一个非空的 metadata。
  ~~~
## 循环依赖
- Module的循环依赖
  ~~~js
  // A 模块
  @Module({
    imports: [BbbModule]
  })
  export class AaaModule {}
  // B 模块
  @Module({
    imports: [AaaModule]
  })
  export class BbbModule {}
  // 上面的示例执行后会报错 undefined
  // 因为 Nest 创建 Module 的时候会递归创建它的依赖，而它的依赖又依赖了这个 Module，所以没法创建成功，拿到的就是 undefined。
  // 使用 forwardRef 关联两个模块
  // A 模块
  @Module({
    imports: [forwardRef(() => BbbModule)]
  })
  export class AaaModule {}
  // B 模块
  @Module({
    imports: [forwardRef(() => AaaModule)]
  })
  export class BbbModule {}
  ~~~
- Provider的循环依赖
  ~~~js
  // A 服务
  @Injectable()
  export class AaaService {
    constructor(private bbbService: BbbService) {}
  }
  // B 服务
  @Injectable()
  export class BbbService {
    constructor(private aaaService: AaaService) {}
  }
  // 上面的示例执行后会报错 无法解析
  // 不能使用默认的注入方式，需要通过 @Inject 手动指定注入的 token 并使用 forwardRef 的方式注入。
  // A 服务
  @Injectable()
  export class AaaService {
    constructor(@Inject(forwardRef(() => BbbService)) private bbbService: BbbService) {}
  }
  // B 服务
  @Injectable()
  export class BbbService {
    constructor(@Inject(forwardRef(() => AaaService)) private aaaService: AaaService) {}
  }
  ~~~
## 创建动态模块
- 自定义静态方法生成
  ~~~js
  // 给 BbbModule 加一个 register 的静态方法，返回模块定义的对象
  import { DynamicModule, Module } from '@nestjs/common';
  import { BbbService } from './bbb.service';
  import { BbbController } from './bbb.controller';
  
  @Module({})
  export class BbbModule {
  
    static register(options: Record<string, any>): DynamicModule {
      return {
        module: BbbModule,
        providers: [
          {
            provide: 'CONFIG_OPTIONS',
            useValue: options,
          },
          BbbService,
        ],
        exports: []
      };
    }
  }
  // import 的时候通过 register 方法传入参数，返回值就是模块定义。
  // Nest 约定了 3 种方法名:
  // register：用一次模块传一次配置，比如这次调用是 BbbModule.register({aaa:1})，下一次就是 BbbModule.register({aaa:2}) 了
  // forRoot：配置一次模块用多次，比如 XxxModule.forRoot({}) 一次，之后就一直用这个 Module，一般在 AppModule 里 import
  // forFeature：用了 forRoot 固定了整体模块，用于局部的时候，可能需要再传一些配置，比如用 forRoot 指定了数据库链接信息，再用 forFeature 指定某个模块访问哪个数据库和表。
  @Module({
    imports: [BbbModule.register({name: 'gaojianghua', age: 28})],
    controllers: [AppController],
    providers: [AppService]
  })
  export class AppModule {}
  // 在 Controller 中使用
  @Controller('bbb')
  export class BbbController {
    constructor(
      private readonly bbbService: BbbService,
      @Inject('CONFIG_OPTIONS') private configOptions: Record<string, any>
    ) {}
    
    @Get()
    getHello() {
      console.log(this.configOptions)  
    }   
  }
  ~~~
- 通过 builder 来生成
  ~~~js
  // 用 ConfigurableModuleBuilder 生成一个 class，这个 class 里就带了 register、registerAsync 方法。
  // 返回的 ConfigurableModuleClass、MODULE_OPTIONS_TOKEN 分别是生成的 class 、options 对象的 token。
  import { ConfigurableModuleBuilder } from "@nestjs/common";
  export interface CccModuleOptions {
    aaa: number;
    bbb: string;
  }
  export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
    new ConfigurableModuleBuilder<CccModuleOptions>().build() 
  // setClassMethodName() 设置静态方法名称
  // ConfigurableModuleBuilder<CccModuleOptions>().setClassMethodName('forRoot').build() 
  // 然后让Module 继承它
  @Module({
    controllers: [CccController] 
  })
  export class CccModule extends ConfigurableModuleClass {}
  // 这样这个 CccModule 就已经有了 register 和 registerAsync 方法。
  // 注入
  @Controller('ccc')
  export class CccController {
  
      @Inject(MODULE_OPTIONS_TOKEN)
      private options: CccModuleOptions;
  
      @Get('')
      hello() {
          return this.options;
      }
  }
  // 用 registerAsync 方法，用 useFactory 动态创建 options 对象
  @Module({
    imports: [CccModule.registerAsync({
      useFactory: async () => {
        let name = await 'gaojianghua'
        return {
          name,
          age: 28
        }
      }
    })],
    controllers: [AppController],
    providers: [AppService]
  })
  export class AppModule {}
  // 根据传入的参数决定是否设置为全局模块
  // setExtras 第一个参数是给 options 扩展啥 extras 属性，第二个参数是收到 extras 属性之后如何修改模块定义。
  // 我们定义了 isGlobal 的 option，收到它之后给模块定义加上个 global。
  export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN, OPTIONS_TYPE, ASYNC_OPTIONS_TYPE } =
  new ConfigurableModuleBuilder<CccModuleOptions>().setClassMethodName('register').setExtras({
    isGlobal: true
  }, (definition, extras) => ({
    ...definition,
    global: extras.isGlobal,
  })).build();
  // 注入
  @Controller('ccc')
  export class CccController {
  
      @Inject(MODULE_OPTIONS_TOKEN)
      private options: typeof OPTIONS_TYPE;
  
      @Get('')
      hello() {
          return this.options.isGlobal;
      }
  }
  ~~~
## Nest 与 Express、Fastify
- Nest 内部并没有直接依赖任何一个 http 处理的库，只是依赖了抽象的接口，想用什么库则需要实现这些接口的适配器
- Nest 内部分别提供了 express 和 fastify 的适配器实现
- 可以用 express，也可以灵活的切换成 fastify，对 Nest 没有任何影响
- 适配器分别在 @nestjs/platform-express 和 @nestjs/platform-fastify 中
- 默认使用的是 platform-express 的包
- 下面切换到 fastify
  ~~~js
  // 安装包：npm install fastify @nestjs/platform-fastify
  async function boostrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter())
    await app.listen(3000)
  }
  boostrap()
  ~~~
## Rxjs
- Rxjs 是一个处理异步逻辑的库，它的特点就是 operator 多，你可以通过组合 operator 来完成逻辑。
- Nest 的 interceptor 集成了 rxjs 来处理响应，常用 operator 如下:
- tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
  ~~~js
  import { AppService } from './app.service';
  import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
  import { Observable, tap } from 'rxjs.md';
  
  @Injectable()
  export class TapTestInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}
  private readonly logger = new Logger(TapTestInterceptor.name);
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  return next.handle().pipe(tap((data) => {
  
        // 这里是更新缓存的操作，这里模拟下
        this.appService.getHello();
  
        this.logger.log(`log something`, data);
      }))
    }
  }
  ~~~
- map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
  ~~~js
  import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
  import { map, Observable } from 'rxjs.md';
  
  @Injectable()
  export class MapTestInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(map(data => {
        return {
          code: 200,
          message: 'success',
          data
        }
      }))
    }
  }
  ~~~
- catchError：在 exception filter 之前处理抛出的异常，可以记录或者抛出别的异常
  ~~~js
  import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
  import { catchError, Observable, throwError } from 'rxjs.md';
  
  @Injectable()
  export class CatchErrorTestInterceptor implements NestInterceptor {
    private readonly logger = new Logger(CatchErrorTestInterceptor.name)
  
    intercept (context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(catchError(err => {
        this.logger.error(err.message, err.stack)
        return throwError(() => err)
      }))
    }
  }
  ~~~
- timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchError 可以返回超时的响应
  ~~~js
  // timeout 操作符会在 3s 没收到消息的时候抛一个 TimeoutError。
  // 然后用 catchError 操作符处理下，如果是 TimeoutError，就返回 RequestTimeoutException，这个有内置的 exception filter 会处理成对应的响应格式。
  import { CallHandler, ExecutionContext, Injectable, NestInterceptor, RequestTimeoutException } from '@nestjs/common';
  import { catchError, Observable, throwError, timeout, TimeoutError } from 'rxjs.md';
  
  @Injectable()
  export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        timeout(3000),
        catchError(err => {
          if(err instanceof TimeoutError) {
            console.log(err);
            return throwError(() => new RequestTimeoutException());
          }
          return throwError(() => err);
        })
      )
    }
  }
  ~~~
- 全局可注意依赖的拦截器
  ~~~js
  // 很多情况下我们是需要全局 interceptor 的，而且还用到一些 provider
  // nest 提供了一个 token，用这个 token 在 AppModule 里声明的 interceptor，Nest 会把它作为全局 interceptor
  // 全局 interceptor 可以通过 APP_INTERCEPTOR 的 token 声明，这种能注入依赖，比 app.useGlobalInterceptors 更好。
  import { Module } from '@nestjs/common'
  import { APP_INTERCEPTOR } from '@nestjs/core'
  import { AaaInterceptor } from './aaa.interceptor'
  import { AppController } from './app.controller'
  import { AppService } from './app.service'
  
  @Module({
    imports:[],
    contrillers: [AppController],
    providers: [
      AppService,
      {
        provide: APP_INTERCEPTOR,
        useClass: AaaInterceptor
      }
    ] 
  })
  export class AppModule {}
  ~~~
## ValidationPipe 验证 POST 参数
- 安装依赖包
  ~~~shell
  npm install -D class-validator class-transformer
  ~~~
- 示例:
  ~~~js
  // dto
  import { IsInt } from 'class-validator'
  export class Home{
    name: string;
    @IsInt()
    age: number;
    sex: boolean;
    hobbies: Array<string>
  }
  // 使用
  @Post('home')
  home(@Body(new ValidationPipe()) obj: Home) {
    console.log(obj)
  }
  ~~~
- class-validator 包提供了基于装饰器声明的规则对对象做校验的功能
- class-transformer 则是把一个普通对象转换为某个 class 的实例对象的
- Pipe 也可以注入依赖，Nest 会自己去创建对象，所以不能使用 new ValidationPipe()，直接 ValidationPipe。
- 全局 Pipe 可以通过 APP_PIPE 的 token 声明
  ~~~js
  import { Module, ValidationPipe } from '@nestjs/common'
  import { APP_PIPE } from '@nestjs/core'
  import { AppController } from './app.controller'
  import { AppService } from './app.service'
  
  @Module({
    imports:[],
    contrillers: [AppController],
    providers: [
      AppService,
      {
        provide: APP_PIPE,
        useClass: ValidationPipe
      }
    ] 
  })
  export class AppModule {}
  ~~~
- 常用的 class-validator 验证方式
  ~~~js
  import { Contains, IsDate, IsEmail, IsFQDN, IsInt, Length, Max, Min } from 'class-validator';

  export class Ppp {
    // message 自定义返回的错误信息
    @Length(10, 20, {
      message({targetName, property, value, constraints}) {
        return `${targetName} 类的 ${property} 属性的值 ${value} 不满足约束: ${constraints}`
      }
    })
    title: string;
  
    @Contains('hello')
    text: string;
  
    @IsInt()
    @Min(0)
    @Max(10)
    rating: number;
  
    @IsEmail()
    email: string;
  
    @IsFQDN()
    site: string;
  }
  ~~~
## 日志打印
- 创建个 logger 对象，使用它的 api 打印日志
  ~~~js
  import { ConsoleLogger, Controller, Get, Logger } from '@nestjs/common';
  import { AppService } from './app.service';
  
  @Controller()
  export class AppController {
    private logger = new Logger();
  
    constructor(private readonly appService: AppService) {}
  
    @Get()
    getHello(): string {
      this.logger.debug('aaa', AppController.name);
      this.logger.error('bbb', AppController.name);
      this.logger.log('ccc', AppController.name);
      this.logger.verbose('ddd', AppController.name);
      this.logger.warn('eee', AppController.name);
  
      return this.appService.getHello();
    }
  }
  // 打印后的日志里的 verbose、debug、log、warn、error 就是日志级别，而 [] 中的是 context，也就是当前所在的上下文，最后是日志的内容。
  ~~~
- 指定日志是否开启
  ~~~js
  async function bootstrap () {
    const app = await NestFactory.create(AppModule, {
      logger: false     // 默认为true: 开启日志；false: 不开启日志
    })
    await app.listen(3000)
  }
  bootstrap()
  ~~~
- 指定输出的日志级别
  ~~~js
  async function bootstrap () {
    const app = await NestFactory.create(AppModule, {
      logger: ['warn, error']
    })
    await app.listen(3000)
  }
  bootstrap()
  ~~~
- 自定义日志打印方式
  ~~~js
  // 自定义所有日志打印
  import { LoggerService, LogLevel } from '@nestjs/common';
  
  export class MyLogger implements LoggerService {
    log(message: string, context: string) {
      console.log(`---log---[${context}]---`, message)
    }
  
    error(message: string, context: string) {
        console.log(`---error---[${context}]---`, message)
    }
  
    warn(message: string, context: string) {
        console.log(`---warn---[${context}]---`, message)
    }
  }
  // 或重写某一种打印方式，其他的则保留为nest自己的
  import { ConsoleLogger } from '@nestjs/common';
  
  export class MyLogger extends ConsoleLogger{
    log(message: string, context: string) {
      console.log(`[${context}]`,message)
    }
  }
  // 启用自定义日志打印
  async function bootstrap () {
    const app = await NestFactory.create(AppModule, {
      logger: new MyLogger()
    })
    await app.listen(3000)
  }
  bootstrap()
  ~~~
- 让 Logger 可以注入依赖
  ~~~js
  // bufferLogs 就是先不打印日志，把它放到 buffer 缓冲区，直到用 useLogger 指定了 Logger 并且应用初始化完毕。
  // app.get 就是从容器中取这个类的实例的
  async function bootstrap () {
    const app = await NestFactory.create(AppModule, {
      bufferLogs: true
    })
    app.useLogger(app.get(MyLogger))
    await app.listen(3000)
  }
  bootstrap()
  // 写一个 Logger 类注入到容器中
  import { Inject } from '@nestjs/common';
  import { ConsoleLogger, Injectable } from '@nestjs/common';
  import { AppService } from './app.service';
  
  @Injectable()
  export class MyLogger extends ConsoleLogger{
    @Inject(AppService)
    private appService: AppService;
  
    log(message, context) {
      console.log(this.appService.getHello());
      console.log(`[${context}]`, message);
      console.log('--------------')
    }
  }
  // 在 provider 中声明
  @Module({
    imports: [],
    controllers: [AppContriller],
    providers: [AppService, MyLogger]
  })
  export class AppModule {}
  ~~~
## 文件上传
- 使用 multer 包实现文件上传
- 安装 multer 类型包
  ~~~shell
  npm install -D @types/multer
  ~~~
- 代码实现
  ~~~js
  // 单文件上传
  @Post('aaa')
  @UseInterceptors(FileInterceptor('aaa', {
    dest: 'uploads'
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
  }
  // 多文件上传
  @Post('aaa')
  @UseInterceptors(FilesInterceptor('aaa', 3, {
    dest: 'uploads'
  }))
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
  }
  // 多个文件的不同字段
  @Post('ccc')
  @UseInterceptors(FileFieldsInterceptor([
      { name: 'aaa', maxCount: 2 },
      { name: 'bbb', maxCount: 3 },
    ], {
      dest: 'uploads'
  }))
  uploadFileFields(@UploadedFiles() files: { aaa?: Express.Multer.File[], bbb?: Express.Multer.File[] }, @Body() body) {
    console.log('body', body);
    console.log('files', files);
  }
  // 并不确定有哪些字段是 file 
  @Post('ddd')
  @UseInterceptors(AnyFilesInterceptor({
    dest: 'uploads'
  }))
  uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
  }
  ~~~
- 自定义文件存储方式
  ~~~js
  // multer.distkStorage 是磁盘存储，通过 destination、filename 的参数分别指定保存的目录和文件名。
  import * as multer from "multer";
  import * as fs from 'fs';
  import * as path from "path";
  
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      try {
        fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
      }catch(e) {}
      cb(null, path.join(process.cwd(), 'my-uploads'))
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });
  export { storage };
  // 使用
  @Post('ddd')
  @UseInterceptors(AnyFilesInterceptor({
    storage: storage
  }))
  uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
  }
  ~~~
- 使用 Pipe 对上传的文件做限制
  ~~~js
  // 大于 10k 就抛出异常，返回 400 的响应
  import { PipeTransform, Injectable, ArgumentMetadata, HttpException, HttpStatus } from '@nestjs/common';

  @Injectable()
  export class FileSizeValidationPipe implements PipeTransform {
    transform(value: Express.Multer.File, metadata: ArgumentMetadata) {
      if(value.size > 10 * 1024) {
        throw new HttpException('文件大于 10k', HttpStatus.BAD_REQUEST);
      }
      return value;
    }
  }
  // 使用
  @Post('ddd')
  @UseInterceptors(AnyFilesInterceptor({
    dest: 'uploads'
  }))
  uploadAnyFiles(@UploadedFiles(FileSizeValidationPipe) files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);
  }
  // 也可使用 Nest 内置的 ParseFilePipe
  @Post('fff')
  @UseInterceptors(FileInterceptor('aaa', {
    dest: 'uploads'
  }))
  uploadFile3(@UploadedFile(new ParseFilePipe({
    exceptionFactory: err => {
      throw new HttpException('上传文件出错：' + err, 404)
    },
    validators: [
      new MaxFileSizeValidator({ maxSize: 1000 }),
      new FileTypeValidator({ fileType: 'image/jpeg' }),
    ],
  })) file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
  }
  // 自定义 FileValidator
  import { FileValidator } from "@nestjs/common";

  export class MyFileValidator extends FileValidator{
    constructor(options) {
      super(options);
    }
  
    isValid(file: Express.Multer.File): boolean | Promise<boolean> {
      if(file.size > 10000) {
          return false;
      }
      return true;
    }
    buildErrorMessage(file: Express.Multer.File): string {
      return `文件 ${file.originalname} 大小超出 10k`;
    }
  }
  // 使用
  @Post('fff')
  @UseInterceptors(FileInterceptor('aaa', {
    dest: 'uploads'
  }))
  uploadFile3(@UploadedFile(new ParseFilePipe({
    validators: [
      new MyFileValidator({})
    ],
  })) file: Express.Multer.File, @Body() body) {
    console.log('body', body);
    console.log('file', file);
  }
  ~~~
  
## TypeORM
[中文文档](https://typeorm.bootcss.com/decorator-reference) <br>
[英文文档](https://typeorm.io)
- 安装 mysql2
  ~~~shell
  npm install --save mysql2
  ~~~
- 安装 typeORM
  ~~~shell
  npm install typeorm --save
  npm install reflect-metadata --save
  npm install @types/node --save
  ~~~
- 新建user的entity
  ~~~js
  import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column()
    firstName: number
  
    @Column()
    lastName: number
  
    @Column()
    age: number
  }
  ~~~
- 使用 typeORM 链接数据库
  ~~~js
  import "reflect-metadata"
  import { DataSource } from "typeorm"
  import { User } from "./entity/User"
  
  export const AppDataSource = new DataSource({
    type: "mysql",              // 数据库的类型, TypeORM 支持 MySQL postgres、oracle、sqllite 等数据库
    host: "localhost",          // 数据库服务器的主机
    port: 3306,                 // 数据库服务器的端口号
    username: "root",           // 登录数据库的用户名
    password: "guang",          // 登录数据库的密码
    database: "practice",       // 指定要操作的数据库
    synchronize: true,          // 是否同步建表, 即没有和 Entity 对应的表的时候, 会自动生成建表 sql 语句并执行
    logging: true,              // 是否打印生成的 sql 语句
    entities: [User],           // 指定有哪些和数据库的表对应的 Entity
    migrations: [],             // 统一修改表结构之类的 sql
    subscribers: [],            // 是一些 Entity 生命周期的订阅者，比如 insert、update、remove 前后，可以加入一些逻辑
    poolSize: 10,               // 指定数据库连接池中连接的最大数量
    connectorPackage: 'mysql2', // 指定用什么驱动包
    extra: {                    // 额外发送给驱动包的一些选项
      authPlugin: 'sha256_password',
    }
  })
  // DataSource 会根据你传入的连接配置、驱动包，来创建数据库连接，并且如果制定了 synchronize 的话，会同步创建表。
  ~~~
- Aaa的entity
  ~~~js
  import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

  @Entity({
    name: 't_aaa'       // name 指定表名为 t_aaa
  })
  export class Aaa {

    @PrimaryGeneratedColumn({       // 指定它是一个自增的主键，通过 comment 指定注释
      comment: '这是 id'
    })
    id: number

    @Column({               // 映射属性和字段的对应关系
      name: 'a_aa',         // 指定字段名
      type: 'text',         // 指定映射的类型(数据库数据类型)
      comment: '这是 aaa'    // 指定注释
    })
    aaa: string

    @Column({           // 映射属性和字段的对应关系
      unique: true,     // 设置 UNIQUE 唯一索引
      nullable: false,  // 设置 NOT NULL 约束
      length: 10,       // 指定长度
      width: 5,         // 指定显示宽度
      type: 'varchar',  // 指定映射的类型(数据库数据类型)
      default: 'bbb'    // 指定默认值
    })
    bbb: string

    @Column({
      type: 'double',
    })
    ccc: number
  }
  ~~~
- 新增数据
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  // initialize() 初始化
  AppDataSource.initialize().then(async () => {
  
    const user = new User()
    user.firstName = "aaa"
    user.lastName = "bbb"
    user.age = 25
  
    await AppDataSource.manager.save(user)    // 调用save方法保存新增
  
  }).catch(error => console.log(error))
  ~~~
- 批量新增数据
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  // initialize() 初始化
  AppDataSource.initialize().then(async () => {
  
    await AppDataSource.manager.save(User, [
      { firstName: 'ccc', lastName: 'ccc', age: 21},
      { firstName: 'ddd', lastName: 'ddd', age: 22},
      { firstName: 'eee', lastName: 'eee', age: 23}
    ]);   // 第一个参数指定entity，第二个参数指定批量数据
  
  }).catch(error => console.log(error))
  ~~~
- 更新数据
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  // initialize() 初始化
  AppDataSource.initialize().then(async () => {
  
    const user = new User()
    user.id = 1;
    user.firstName = "aaa111"
    user.lastName = "bbb"
    user.age = 25
    // 指定 id 后，typeorm 会先查询这个 id 的记录，如果查到了，那就执行 update 更新
    await AppDataSource.manager.save(user)
  
  }).catch(error => console.log(error))
  ~~~
- 批量更新数据
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  // initialize() 初始化
  AppDataSource.initialize().then(async () => {
    // 同理在批量数据中指定 id 就是批量执行 select 查询，再执行 update 更新
    await AppDataSource.manager.save(User, [
        { id: 2 ,firstName: 'ccc111', lastName: 'ccc', age: 21},
        { id: 3 ,firstName: 'ddd222', lastName: 'ddd', age: 22},
        { id: 4, firstName: 'eee333', lastName: 'eee', age: 23}
    ]);
  
  }).catch(error => console.log(error))
  ~~~
- ***update 和 insert 方法，分别是修改和插入的，但是它们不会先 select 查询一次。***
- 删除和批量删除
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    // 第一次参数指定entity，指定要删除的数据的 id 或批量数据的 id
    await AppDataSource.manager.delete(User, 1);
    await AppDataSource.manager.delete(User, [2,3]);
  
  }).catch(error => console.log(error))
  ~~~
- 普通查询
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    // 通过 find 方法指定要查询的entity映射的数据表的数据, 第一个参数为实体类，第二个参数为查询条件的配置对象
    const users = await AppDataSource.manager.find(User);
    console.log(users);     // user表中的所有数据，返回是一个数组
  
  }).catch(error => console.log(error))
  ~~~
- 条件查询
  ~~~js
  import { In } from "typeorm";
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    // 通过 findBy 的第二个参数指定条件进行查询
    const users = await AppDataSource.manager.findBy(User, {
      age: 23
    });
    console.log(users); // 返回的数组中的每条数据的age都为23
  
  }).catch(error => console.log(error))
  ~~~
- 查询数据总数以及指定条件
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    // 通过 findAndCount 查询出所有数据以及数据总数, 第一个参数为实体类，第二个参数为查询条件的配置对象
    const [users, count] = await AppDataSource.manager.findAndCount(User);
    console.log(users, count);
    // 通过 findAndCountBy 查询出指定条件的数据以及数据总数
    const [userss, counts] = await AppDataSource.manager.findAndCountBy(User, {
      age: 23
    });
    console.log(userss, counts);
  
  }).catch(error => console.log(error))
  ~~~
- 单一数据查询
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    const user = await await AppDataSource.manager.findOne(User, {
      select: {     // 指定 select 的列为 firstName 和 age
        firstName: true,
        age: true
      },
      where: {      // 指定查询的 where 条件是 id 为 4
        id: 4
      },
      order: {      // 指定根据 age 升序排列
        age: 'ASC'
      }
    });
    console.log(user);
  
  }).catch(error => console.log(error))
  ~~~
- 指定条件单一数据查询
  ~~~js
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    // 通过 findOneBy 方法指定条件查询
    const user = await AppDataSource.manager.findOneBy(User, {
      age: 23
    });
    console.log(user);
  
  }).catch(error => console.log(error))
  ~~~
- 单一数据查询抛异常方法
  ~~~js
  // findOneOrFail 或者 findOneByOrFail，如果没找到，会抛一个 EntityNotFoundError 的异常
  import { AppDataSource } from "./data-source"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    try {
      const user = await AppDataSource.manager.findOneOrFail(User, {
        where: {
          id: 666
        }
      });
      console.log(user);
    }catch(e) {
      console.log(e);
      console.log('没找到该用户');
    }
  }).catch(error => console.log(error))
  ~~~
- 直接使用 SQL 语句
  ~~~js
  import { AppDataSource } from "./data-source"

  AppDataSource.initialize().then(async () => {
    const users = await AppDataSource.manager.query('select * from user where age in(?, ?)', [21, 22]);
    console.log(users);
  
  }).catch(error => console.log(error))
  ~~~
- 复杂的关联查询
  ~~~js
  // 使用 createQueryBuilder 方法创建 queryBuilder 实例来进行查询
  const queryBuilder = await AppDataSource.manager.createQueryBuilder();
  
  const user = await queryBuilder.select("user")
    .from(User, "user")
    .where("user.age = :age", { age: 21 })
    .getOne();
  
  console.log(user);
  ~~~
- 开启事务
  ~~~js
  // 使用 transaction 方法包裹，在回调中做增删改查
  await AppDataSource.manager.transaction(async manager => {
    await manager.save(User, {
        id: 4,
        firstName: 'eee',
        lastName: 'eee',
        age: 20
    });
  });
  ~~~
- 先拿实体类再做数据操作
  ~~~js
  AppDataSource.manager.getRepository(User).find({
    select: {
      firstName: true,
      age: true
    }  
  })
  ~~~

## 一对一映射和关联CRUD
- 新建身份证实体
  ~~~js
  import { Column, Entity, PrimaryGeneratedColumn, JoinColum, OneToTone } from "typeorm"
  import { User } from './user'

  @Entity({
    name: 'id_card'
  })
  export class IdCard {
    @PrimaryGeneratedColumn()
    id: number
  
    @Column({
      length: 50,
      comment: '身份证号'
    })
    cardName: string
    
    @JoinColum                  // 指定外键列
    @OneToTone(() => User, {    // 指定一对一的关系
      cascade: true,            // 告诉 typeorm 当你增删改一个表数据的时候，是否级联增删改它关联的表数据。
      onDelete: 'CASCADE',      // 指定级联关系：级联删除
      onUpdate: 'CASCADE'       // 指定级联关系：级联更新
    })
    user: User
  }
  ~~~
- 对身份证和用户表数据进行新增保存
  ~~~js
  import { AppDataSource } from "./data-source"
  import { IdCard } from "./entity/IdCard"
  import { User } from "./entity/User"
  
  AppDataSource.initialize().then(async () => {
    const user = new User();
    user.firstName = 'guang';
    user.lastName = 'guang';
    user.age = 20;
      
    const idCard = new IdCard();
    idCard.cardName = '1111111';
    idCard.user = user;
    
    // 当身份证实体中一对一装饰器配置了cascade：true，那么下面这行保存user表示数据的新增可以注释掉
    await AppDataSource.manager.save(user);
    // 当身份证实体中一对一装饰器配置了cascade：true，保存idCard表数据是会关联同步的执行保存user表数据
    await AppDataSource.manager.save(idCard);
  
  }).catch(error => console.log(error))
  ~~~
- 关联查询数据
  ~~~js
  const ics = await AppDataSource.manager.find(IdCard, {
    relations: {    // 关联查询
        user: true  // 指定开启 user 实体的关联，会将 user 表数据一并查询出来
    }
  });
  console.log(ics);
  ~~~
- 使用查询构建器查询
  ~~~js
  // 方式一
  const ics = await AppDataSource.manager.getRepository(IdCard)
    .createQueryBuilder("ic")   // 创建构建器，设置IdCard别名为 ic
    .leftJoinAndSelect("ic.user", "u")  // 指定左外键连接字段 user 的表，取别名 u
    .getMany();     // 表示查询所有的数据

  console.log(ics);
  // 方式二
  const ics = await AppDataSource.manager.createQueryBuilder(IdCard, "ic")
    .leftJoinAndSelect("ic.user", "u")
    .getMany();
  
  console.log(ics);
  ~~~
- 关联修改表数据
  ~~~js
  // 指定他们的 Id 再保存即可，因为它们有关联关系，会在一个事务中执行 user 和 idCard 两天 update 语句
  const user = new User();
  user.id = 1;
  user.firstName = 'guang1111';
  user.lastName = 'guang1111';
  user.age = 20;
  
  const idCard = new IdCard();
  idCard.id = 1;
  idCard.cardName = '22222';
  idCard.user = user;
  
  await AppDataSource.manager.save(idCard);
  ~~~
- 关联删除表数据
  ~~~js
  // 因为设置了外键的 onDelete 是 cascade，所以只要删除了 user，那关联的 idCard 就会跟着被删除。
  await AppDataSource.manager.delete(User, 1)
  ~~~
- User 里访问 idCard
  ~~~js
  // 在 User 实体中添加
  import { IdCard } from './idCard'
  
  @OneToOne(()=> IdCard, (idCard) => idCard.user)   // 第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。
  idCard: IdCard
  ~~~
- 关联查询 idCard
  ~~~js
  const user = await AppDataSource.manager.find(User, {
    relations: {    // 关联到 idCard 表，查询 user 数据时会关联查出 idCard 的数据
        idCard: true
    }
  });
  console.log(user);
  ~~~
## 一对多映射和关联CRUD
- 创建两实体：Department 和 Employee
  ~~~js
  import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
  import { Employee } from './employee'
  
  @Entity()
  export class Department {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      length: 50
    })
    name: string;
  
    // 在一的一方使用 @OneToMany 一对多装饰器
    @OneToMany(() => Employee, (employee) => employee.department)    // 第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。 
    employee: Employee[]
  }
  ~~~
  ~~~js
  import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
  import { Department } from './department'

  @Entity()
  export class Employee {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({
      length: 50
    })
    name: string;
  
    // 在多的一方使用 @ManyToOne 多对一装饰器
    @ManyToOne(() => Department, {  
      cascade: true
    })    
    department: Department
  }
  ~~~
  ***因为一对多的关系只可能是在多的那一方保存外键，所以 department 字段并不需要 @JoinColumn。后面我们会通过 @JoinColumn 修改外键名。***


- 新增一批数据
  ~~~js
  import { Department } from './entity/Department';
  import { Employee } from './entity/Employee';
  import { AppDataSource } from "./data-source"
  
  AppDataSource.initialize().then(async () => {
    const d1 = new Department();
    d1.name = '技术部';
  
    const e1 = new Employee();
    e1.name = '张三';
    e1.department = d1;
  
    const e2 = new Employee();
    e2.name = '李四';
    e2.department = d1;
  
    const e3 = new Employee();
    e3.name = '王五';
    e3.department = d1;
  
    AppDataSource.manager.save(Department, d1);     // 如果设置了 cascade: true 可以注释这条代码
    AppDataSource.manager.save(Employee,[e1, e2, e3]);
  
  }).catch(error => console.log(error))
  // 上面的代码执行后，会开启一个事务，在事务中会执行 4 条 insert 语句，分别插入了 Department 和 3 个 Employee。
  ~~~
- 修改外键列的名字
  ~~~js
  // 在 Employee 实体中修改
  @JoinColumn({
    name: 'd_id'
  })
  @ManyToOne(() => Department, {
    // cascade: true   这里的 cascade 的级联关系一定要去掉，双方都级联了会进入死循环。
  })
  department: Department
  ~~~
  ~~~js
  // 在 Department 实体中修改
  @OneToMany(() => Employee, (employee) => employee.department, {
    cascade: true
  })
  employee: Employee[];
  ~~~
- 再来做新增数据
  ~~~js
  import { Department } from './entity/Department';
  import { Employee } from './entity/Employee';
  import { AppDataSource } from "./data-source"
  
  AppDataSource.initialize().then(async () => {
    const e1 = new Employee();
    e1.name = '张三';
  
    const e2 = new Employee();
    e2.name = '李四';
  
    const e3 = new Employee();
    e3.name = '王五';
  
    const d1 = new Department();
    d1.name = '技术部';
    d1.employees = [e1, e2, e3];
  
    AppDataSource.manager.save(Department, d1);     // 因为级联关系，employee 的数据会自动保存
  
  }).catch(error => console.log(error))
  ~~~
- 然后试下查询
  ~~~js
  // 查询 department 表的数据
  const deps = await AppDataSource.manager.find(Department);
  console.log(deps);
  // 关联查询 employee 表的数据
  const deps = await AppDataSource.manager.find(Department, {
    relations: {        // relations 实际就是SQL中的 left join on
      employees: true
    }
  });
  console.log(deps);
  console.log(deps.map(item => item.employees))
  ~~~
- 使用查询构建器
  ~~~js
  // 使用 getRepository()
  const es = await AppDataSource.manager.getRepository(Department)
    .createQueryBuilder('d')
    .leftJoinAndSelect('d.employees', 'e')
    .getMany();

  console.log(es);
  console.log(es.map(item => item.employees))
  
  // 不使用 getRepository()
  const es = await AppDataSource.manager
    .createQueryBuilder(Department, 'd')
    .leftJoinAndSelect('d.employees', 'e')
    .getMany();

  console.log(es);
  console.log(es.map(item => item.employees))
  ~~~
- 普通删除和关联删除
  ~~~js
  // 普通手动删除
  const deps = await AppDataSource.manager.find(Department, {
    relations: {
      employees: true
    }
  });
  
  // 需要先把关联的 employee 删了，再删除 department。
  await AppDataSource.manager.delete(Employee, deps[0].employees);
  await AppDataSource.manager.delete(Department, deps[0].id);
  ~~~
  关联删除，需要在 Employee 实体中修改如下
  ~~~js
  @ManyToOne(() => Department, { 
    // 添加删除的级联关系
    // 设置为 'CASCADE' 会自动把关联的 employee 记录删除 
    // 设置为 'SET NULL' 会自动把关联的 employee 记录的外键 id 置为空 
    onDelete: 'CASCADE'  
  })    
  department: Department
  ~~~
  ~~~js
  // 关联删除
  const deps = await AppDataSource.manager.find(Department, {
    relations: {
      employees: true
    }
  });
  
  // 直接删除 department 后自动关联删除 employees 关联的记录
  await AppDataSource.manager.delete(Department, deps[0].id);
  ~~~
## 多对多映射和关联CRUD
- 先创建两个实体：Article 和 Tag
  ~~~js
  // Article 实体
  import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
  import { Tag } from './tag'

  @Entity()
  export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 100,
      comment: '文章标题'
    })
    title: string;

    @Column({
      type: 'text',
      comment: '文章内容'
    })
    content: string;
  
    @JoinTable()
    @ManyToMany(() => Tag)
    tag: Tag[]
  }
  ~~~
  ~~~js
  // Tag 实体
  import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

  @Entity()
  export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      length: 100,
    })
    name: string;
  }
  ~~~
  执行npm run start 后执行 3 条建表 sql，分别是 article、tag 和中间表 article_tags_tag。并且 article_tags_tag 还有 2 个外键分别引用着两个表。级联删除和级联更新都是 CASCADE，也就是说这两个表的记录删了，那它在中间表中的记录也会跟着被删。


- 尝试插入数据
  ~~~js
  import { AppDataSource } from "./data-source"
  import { Article } from "./entity/Article"
  import { Tag } from "./entity/Tag";

  AppDataSource.initialize().then(async () => {

    const a1 = new Article();
    a1.title = 'aaaa';
    a1.content = 'aaaaaaaaaa';

    const a2 = new Article();
    a2.title = 'bbbbbb';
    a2.content = 'bbbbbbbbbb';

    const t1 = new Tag();
    t1.name = 'ttt1111';

    const t2 = new Tag();
    t2.name = 'ttt2222';

    const t3 = new Tag();
    t3.name = 'ttt33333';

    a1.tags = [t1,t2];
    a2.tags = [t1,t2,t3];

    const entityManager = AppDataSource.manager;

    await entityManager.save(t1);
    await entityManager.save(t2);
    await entityManager.save(t3);

    await entityManager.save(a1);
    await entityManager.save(a2);

  }).catch(error => console.log(error))
  // 创建2篇文章、3个标签，建立它们的关系之后，先保存所有的 tag，再保存 article。
  ~~~
- 关联查询
  ~~~js
  const article = await entityManager.find(Article, {
    relations: {    // 关联 tag 表，将关联的 tag 表记录一并查出来
      tags: true
    }
  });
  
  console.log(article);
  console.log(article.map(item=> item.tags))
  ~~~
- 使用查询构建器
  ~~~js
  // 使用 getRepository()
  const article = await entityManager
    .getRepository(Article)
    .createQueryBuilder( "a")
    .leftJoinAndSelect("a.tags", "t")
    .getMany()

  console.log(article);
  console.log(article.map(item=> item.tags))
  // 不使用 getRepository()
  const article = await entityManager
    .createQueryBuilder(Article, "a")
    .leftJoinAndSelect("a.tags", "t")
    .getMany()
    
  console.log(article);
  console.log(article.map(item=> item.tags))
  ~~~
- 进行文章的标签修改
  ~~~js
  // 查询出一条 id 为2的文章并把关联的标签一并查出
  const article = await entityManager.findOne(Article, {
    where: {
      id: 2
    },
    relations: {
      tags: true
    }
  });
  
  article.title = "ccccc";  // 修改这个文章的标题
  
  // 修改标签数组只包含 name 字段包含 'ttt111' 的
  article.tags = article.tags.filter(item => item.name.includes('ttt111'));
  
  await entityManager.save(article);
  // 执行后删除的标签和中间表的关联数据会一并删除
  ~~~
- 关联删除
  ~~~js
  // 因为中间表的外键设置了 CASCADE 的级联删除，只要删除了 article 或者 tag，它都会跟着删除关联记录。
  await entityManager.delete(Article, 1);
  await entityManager.delete(Tag, 1);
  ~~~
- 双方相互指定外键关系
  ~~~js
  // 在 Tag 实体中添加
  import { Article } from './article'
  
  @ManyToMany(() => Article, (article) => article.tags)
  articles: Article[]
  ~~~
  ~~~js
  // 并在 Article 实体中的外键字段 tag 上指定 Tag 实体中的外键字段
  @JoinTable()
  @ManyToMany(() => Tag, (tag) => tag.articles)
  tag: Tag[]
  ~~~
  
## Nest 中使用 TypeORM
- 配置数据库连接
  ~~~js
  import { Module } from '@nestjs/common';
  import { TypeOrmModule } from '@nestjs/typeorm';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { User } from './user/entities/user.entity';
  import { UserModule } from './user/user.module';
  
  @Module({
    imports: [UserModule,
      TypeOrmModule.forRoot({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "guang",
        database: "typeorm_test",
        synchronize: true,
        logging: true,
        entities: [User],
        poolSize: 10,
        connectorPackage: 'mysql2',
        extra: {
          authPlugin: 'sha256_password',
        }
      }),
    ],
    controllers: [AppController],
    providers: [AppService],
  })
  export class AppModule {}
  ~~~
  
- 使用 EntityManager 操作数据库
  ~~~js
  import { Injectable } from '@nestjs/common';
  import { InjectEntityManager } from '@nestjs/typeorm';
  import { EntityManager } from 'typeorm';
  import { CreateUserDto } from './dto/create-user.dto';
  import { UpdateUserDto } from './dto/update-user.dto';
  import { User } from './entities/user.entity';

  @Injectable()
  export class UserService {
  
    @InjectEntityManager()
    private manager: EntityManager;
  
    create(createUserDto: CreateUserDto) {
      this.manager.save(User, createUserDto);
    }

    findAll() {
      return this.manager.find(User)
    }
  
    findOne(id: number) {
      return this.manager.findOne(User, {
        where: { id }
      })
    }
  
    update(id: number, updateUserDto: UpdateUserDto) {
      this.manager.save(User, {
        id: id,
        ...updateUserDto
      })
    }
  
    remove(id: number) {
      this.manager.delete(User, id);
    }
  }
  // 使用 EntityManager 的缺点是每次都要带上 Entity。如上面的User
  ~~~
- 使用引入动态模块
  ~~~js
  // 在 user 模块引入 TypeOrmModule.forFeature 对应的动态模块，传入 User 的 Entity
  import { Module } from '@nestjs/common'
  import { UserService } from './user.service'
  import { UserContriller } from './user.controller'
  import { TypeOrmModule } from '@nestjs/typeorm'
  import { User } from './ebtities/user.entity'
  
  @Module({
    imports: [TypeOrmModule.forFeature([User])],
    contrillers: [UserContriller],
    providers: [UserService]
  })
  export class UserModule {}
  ~~~
- 在模块中注入 Repository 使用
  ~~~js
  @Injectable()
  export class UserService {
  
    @InjectRepository(User)
    private userRepository: Repository<User>;

    findAll() {
      return this.userRepository.find()
    }
  }
  ~~~
## Nest 中使用 Redis
- 安装 redis 包
  ~~~shell
  npm install redis
  ~~~
- 简单使用
  ~~~js
  import { createClient } from 'redis';

  const client = createClient({
    socket: {
      host: 'localhost',    // 服务器域名
      port: 6379            // redis进程端口号
    }
  });
  
  client.on('error', err => console.log('Redis Client Error', err));    // 监听错误事件
  
  await client.connect();       // 连接到 redis 服务
  
  const value = await client.keys('*');     // * 获取 redis 中所有数据
  
  console.log(value);
  
  await client.disconnect();    // 断开与服务器的连接
  ~~~
- nest 中的使用
  ~~~js
  import { Module } from '@nestjs/common';
  import { AppController } from './app.controller';
  import { AppService } from './app.service';
  import { createClient } from 'redis';
  
  @Module({
    imports: [],
    controllers: [AppController],
    providers: [
      AppService,
      {
        provide: 'REDIS_CLIENT',
        async useFactory() {
          const client = createClient({
            socket: {
              host: 'localhost',
              port: 6379
            }
          });
          await client.connect();
          return client;
        }
      }
    ],
  })
  export class AppModule {}
  // 自定义 provider，通过 useFactory 的方式动态创建 provider，token 为 REDIS_CLIENT。
  ~~~
- 注入到 service 里使用
  ~~~js
  import { Inject, Injectable } from '@nestjs/common';
  import { RedisClientType } from 'redis';
  
  @Injectable()
  export class AppService {
  
    @Inject('REDIS_CLIENT')
    private redisClient: RedisClientType;
  
    async getHello() {
      const value = await this.redisClient.keys('*');
      console.log(value);
  
      return 'Hello World!';
    }
  }
  ~~~
  ~~~js
  // 因为 service 里加了 async、await, 所以 controller 里也得加下
  @Controller()
  export class AppController {
    constructor(private readonly appService: AppService) {}
    
    @Get()
    async getHello () {
      return await this.appService.getHello()
    }
  }
  ~~~


## Nest 中使用 Session 和 JWT
Nest 里实现 session 用的 express 的中间件 `express-session`。安装 express-session 和它的 ts 类型定义：
~~~shell
npm install express-session @types/express-session
~~~
在入口模块里启用：
~~~js
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang',    // 指定加密的密钥
    resave: false,      // true: 不管有无修改，每次访问必更新 session；false：能容变化才更新 session
    saveUninitialized: false    // true：无论 session 是否设置，都会初始化一个空 session；false：不设置即不初始化
  }));
  await app.listen(3000);
}
bootstrap();
~~~
在 controller 里就注入 session 对象：
~~~ts
@Get('sss')
sss(@Session() session) {
    console.log(session)
    session.count = session.count ? session.count + 1 : 1;
    return session.count;
}
~~~
session 里有个 count 的变量，每次访问加一，然后返回这个 count。使用命令启动：
~~~shell
nest start --watch
~~~
可以使用postman进行测试，每次请求返回的数据都不同，而且返回了一个 cookie 是 connect.sid，这个就是对应 session 的 id。因为 cookie 在请求的时候会自动带上，就可以实现请求的标识，给 http 请求加上状态。

使用 JWT 需要引入 @nestjs/jwt 这个包
~~~shell
npm install @nestjs/jwt
~~~
AppModule 里引入 JwtModule：
~~~ts
// 通过 register 传入 option。
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'guang',  // 加密的秘钥
      signOptions: {
        expiresIn: '7d' // 设置过期时间：7d(7天)
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
~~~ts
// 通过 registerAsync 传入 useFactory 函数返回一个配置对象。
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'guang',  // 加密的秘钥
      signOptions: {
        expiresIn: '7d' // 设置过期时间：7d(7天)
      }
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
controller 里注入 JwtModule 里的 JwtService：
~~~ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('ttt')
  ttt(@Res({ passthrough: true}) response: Response) {
    // 使用 jwtService.sign 来生成一个 jwt token
    const newToken = this.jwtService.sign({
      count: 1
    });
    // 将生成的 token 放到 response header 里
    response.setHeader('authorization', 'bearer ' + newToken);
    return 'hello';
  }
}
~~~
> 注入 response 对象之后，默认不会把返回值作为 body 了，需要设置 passthrough 为 true 才可以。

使用 postman 测试后可以看到，返回的响应确实带上了这个 header。下面让后面的请求需要带上这个 token，在服务端取出来，然后 +1 之后再放回去：
~~~ts
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Inject(JwtService)
  private jwtService: JwtService;

  // @Headers 装饰器取出 autorization 的 header
  @Get('ttt')
  ttt(@Headers('authorization') authorization: string, @Res({passthrough: true}) response: Response) {
    if (authorization) {
      try {
        const token = authorization.split(' ')[1];
        // 通过 jwtService.verify 对 token 做验证
        const data = this.jwtService.verify(token);
        // 验证成功 count 加1后重新生成 token 并返回
        const newToken = this.jwtService.sign({
          count: data.count + 1
        });
        response.setHeader('authorization', 'bearer ' + newToken);
        return data.count + 1
      } catch (e) {
        console.log(e);
        // 验证失败抛出异常
        throw new UnauthorizedException();
      }
    } else {
      const newToken = this.jwtService.sign({
        count: 1
      });

      response.setHeader('authorization', 'bearer ' + newToken);
      return 1;
    }
  }
}
~~~

## Nest 中使用双 Token
通常为了安全考虑会设置 `token` 有效期为 30 分钟，考虑到 `token` 失效后用户需要重新登录。这样频繁登录对用户体验不好，为了解决这个问题，我们一般会设置双 token：`access_token` 和 `refresh_token`。
- **access_token** ：用于认证用户身份
- **refresh_token** ：用来刷新token

一般会设置 `refresh_token` 过期时间为7天，如果 `access_token` 过期，那就用 `refresh_token` 刷新下拿到新 `token`。

创建个 nest 项目：
~~~shell
nest new access_token_and_refresh_token -p npm
~~~
添加 user 模块：
~~~shell
nest g resource user --no-spec
~~~
安装 typeorm 的依赖：
~~~shell
npm install --save @nestjs/typeorm typeorm mysql2
~~~
安装 JWT 包：
~~~shell
npm install --save @nestjs/jwt
~~~
AppModule 中引入 TypeOrmModule：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from './user/entity/user.entity'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '30m'
      },
      secret: 'gao'
    }),
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "refresh_token_test",   // 需要手动新建此数据库
      synchronize: true,
      logging: true,
      entities: [User],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
新建 User 的 entity：
~~~ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    username: string;

    @Column({
        length: 50
    })
    password: string;
}
~~~
UserController 中添加 login 的 post 接口：
~~~ts
@Controller()
export class UserController {
    @Inject(JwtService)
    private jwtService: JwtService;

    @Post('login')
    async login(@Body() loginUser: LoginUserDto) {
        const user = await this.userService.login(loginUser);

        const access_token = this.jwtService.sign({
            userId: user.id,
            username: user.username,
        }, {
            expiresIn: '30m'
        });

        const refresh_token = this.jwtService.sign({
            userId: user.id
        }, {
            expiresIn: '7d'
        });

        return {
            access_token,
            refresh_token
        }
    }
}
~~~
创建 src/user/dto/login-user.dto.ts：
~~~ts
export class LoginUserDto {
    username: string;
    password: string;
}
~~~
UserService 中里添加 login 方法：
~~~ts
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {

    @InjectEntityManager()
    private entityManager: EntityManager;

    async login(loginUserDto: LoginUserDto) {
        const user = await this.entityManager.findOne(User, {
            where: {
                username: loginUserDto.username
            }
        });

        if(!user) {
            throw new HttpException('用户不存在', HttpStatus.OK);
        }

        if(user.password !== loginUserDto.password) {
            throw new HttpException('密码错误', HttpStatus.OK);
        }

        return user;
    }
}
~~~
实现 LoginGuard 来做登录鉴权：
~~~shell
nest g guard login --flat --no-spec
~~~
~~~ts
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class LoginGuard implements CanActivate {

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);

      return true;
    } catch(e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
~~~
新建刷新token的接口：
~~~ts
@Get('refresh')
async refresh(@Query('refresh_token') refreshToken: string)
{
    try {
        const data = this.jwtService.verify(refreshToken);

        const user = await this.userService.findUserById(data.userId);

        const access_token = this.jwtService.sign({
            userId: user.id,
            username: user.username,
        }, {
            expiresIn: '30m'
        });

        const refresh_token = this.jwtService.sign({
            userId: user.id
        }, {
            expiresIn: '7d'
        });

        return {
            access_token,
            refresh_token
        }
    } catch (e) {
        throw new UnauthorizedException('token 已失效，请重新登录');
    }
}
~~~
UserService 中实现 findUserById 的方法：
~~~ts
async findUserById(userId: number) {
    return await this.entityManager.findOne(User, {
        where: {
            id: userId
        }
    });
}
~~~
UserController 中新增需要登录后才能访问的接口：
~~~ts
// 以此接口测试登录功能
@Get('userInfo')
@UseGuards(LoginGuard)
getUserInfo() {
    return 'gaojianghua';
}
~~~
前端刷新 token 可以放在 `axios` 中， 示例：
~~~ts
async function refreshToken() {
  const res = await axios.get('http://localhost:3000/user/refresh', {
      params: {
        refresh_token: localStorage.getItem('refresh_token')
      }
  });
  localStorage.setItem('access_token', res.data.access_token);
  localStorage.setItem('refresh_token', res.data.refresh_token);
  return res;
}

axios.interceptors.request.use(function (config) {
  const accessToken = localStorage.getItem('access_token');

  if(accessToken) {
    config.headers.authorization = 'Bearer ' + accessToken;
  }
  return config;
})

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    let { data, config } = error.response;

    if (data.statusCode === 401 && !config.url.includes('/user/refresh')) {
        
      const res = await refreshToken();

      if(res.status === 200) {
        return axios(config);
      } else {
        throw res.data
      }
        
    } else {
      return error.response;
    }
  }
)
~~~

## 基于 Redis 实现分布式 Session
session 是在服务端保存用户数据，然后通过 cookie 返回 sessionId。cookie 在每次请求的时候会自动带上，服务端就能根据 sessionId 找到对应的 session，拿到用户的数据。

jwt 是把用户数据保存在加密后的 token 里返回，客户端只要在 authorization 的 header 里带上 token，服务端就能从中解析出用户数据。

jwt 天然支持分布式的，任何一个服务器都能从 token 出解析出用户数据，但是 session 的方式不行，它的数据是存在单台服务器的内存的，如果再请求另一台服务器就找不到对应的 session 了。

分布式 session 就是在多台服务器都可以访问到同一个 session。 我们可以在 redis 里存储它，接下我们实现一下。

新建项目：
~~~shell
nest new redis-session-test -p npm
~~~
安装 redis 的包：
~~~shell
npm install --save redis
~~~
创建 redis 模块：
~~~shell
nest g module redis
nest g service redis
~~~
RedisModule 中创建连接 redis 的 provider，导出 RedisService，并把这个模块标记为 @Global 模块：
~~~ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
~~~
RedisService 中注入 REDIS_CLIENT，并封装一些方法：
~~~ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async hashGet(key: string) {
        return await this.redisClient.hGetAll(key);
    }
    // Record<string, any> 是对象类型的意思
    async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
        for(let name in obj) {
            await this.redisClient.hSet(key, name, obj[name]);
        }

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}
~~~
因为我们要操作的是对象结构，比较适合使用 hash。redis 的 hash 有这些方法：
- `HSET key field value`： 设置指定哈希表 key 中字段 field 的值为 value。
- `HGET key field`：获取指定哈希表 key 中字段 field 的值。
- `HMSET key field1 value1 field2 value2 ...`：同时设置多个字段的值到哈希表 key 中。
- `HMGET key field1 field2 ...`：同时获取多个字段的值从哈希表 key 中。
- `HGETALL key`：获取哈希表 key 中所有字段和值。
- `HDEL key field1 field2 ...`：删除哈希表 key 中一个或多个字段。
- `HEXISTS key field`：检查哈希表 key 中是否存在字段 field。
- `HKEYS key`：获取哈希表 key 中的所有字段。
- `HVALUES key`：获取哈希表 key 中所有的值。 
- `HLEN key`：获取哈希表 key 中字段的数量。
- `HINCRBY key field increment`：将哈希表 key 中字段 field 的值增加 increment。
- `HSETNX key field value`：只在字段 field 不存在时，设置其值为 value。

创建 session 模块：
~~~shell
nest g module session
nest g service session --no-spec
~~~
导出 SessionService，并且设置 SessionModule 为 Global：
~~~ts
import { Global, Module } from '@nestjs/common';
import { SessionService } from './session.service';

@Global()
@Module({
  providers: [SessionService],
  exports: [SessionService]
})
export class SessionModule {}
~~~
实现 SessionService：
~~~ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class SessionService {

    @Inject(RedisService)
    private redisService: RedisService;
    // 使用 sid_xx 的 key 在 redis 里创建 string 的数据结构
    async setSession(sid: string, value: Record<string, any>, ttl: number = 30 * 60) {
        if(!sid) {
            // 没有传 sid 则随机生成一个
            sid = this.generateSid();
        }
        await this.redisService.hashSet(`sid_${sid}`, value, ttl);
        return sid;
    }
    // 使用 sid_xx 从 redis 中取值
    async getSession<SessionType extends Record<string,any>>(sid: string): Promise<SessionType>;
    async getSession(sid: string) {
        return await this.redisService.hashGet(`sid_${sid}`);
    }
    // 生成随机的 sessionId
    generateSid() {
        return Math.random().toString().slice(2,12);
    }
}
~~~
AppController 中添加方法测试下：
~~~ts
@Inject(SessionService)
private sessionService: SessionService;

@Get('count')
async count(@Req() req: Request, @Res() res: Response) {
    const sid = req.cookies?.sid;
    // 因为 redis 虽然可以存整数、浮点数，但是它会转为 string 来存，所以取到的是 string，需要自己转换一下。
    const session = await this.sessionService.getSession<{count:string}>(sid);
}
~~~
安装 cookie-parser 的包：
~~~shell
npm install --save cookie-parser
~~~
main.ts 里启用：
~~~ts
import * as cookieParser from 'cookie-parser'

app.use(cookieParser())
~~~
SessionController 中实现计数逻辑进行测试：
~~~ts
@Inject(SessionService)
private sessionService: SessionService;

@Get('count')
async count(@Req() req: Request, @Res({ passthrough: true}) res: Response) {
    const sid = req.cookies?.sid;

    const session = await this.sessionService.getSession<{count: string}>(sid);

    const curCount = session.count ? parseInt(session.count) + 1 : 1;
    const curSid = await this.sessionService.setSession(sid, {
      count: curCount
    });

    res.cookie('sid', curSid, { maxAge: 1800000 });
    return curCount;
}
~~~
现在基于 redis 存储的 session，不管请求到了哪台服务器，都能从 redis 中取出对应的 session 从而拿到登录状态、用户数据。

## 实现 ACL 权限控制

新建数据库：
~~~shell
CREATE DATABASE acl_test DEFAULT CHARACTER SET utf8mb4;
~~~
新建项目：
~~~shell
nest new acl-test -p npm
~~~
安装 typeorm 的依赖：
~~~shell
npm install --save @nestjs/typeorm typeorm mysql2
~~~
AppModule 引入 TypeOrmModule：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Permission } from './user/entities/permission.entity'
import { User } from './user/entities/user.entity'

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "acl_test",
      synchronize: true,
      logging: true,
      entities: [User,Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
创建 user 模块：
~~~shell
nest g resource user
~~~
添加 User 和 Permission 的 Entity：
~~~ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    username: string;

    @Column({
        length: 50
    })
    password: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;

    @ManyToMany(() => Permission)
    @JoinTable({    // 指定中间表名
        name: 'user_permission_relation'
    })
    permissions: Permission[]
}
~~~
~~~ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;
    
    @Column({
        length: 100,
        nullable: true
    })
    desc: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}
~~~
启动服务：
~~~shell
npm run start:dev
~~~
修改下 UserService，插入一些数据：
~~~ts
@InjectEntityManager()
entityManager: EntityManager;

async initData() {
  const permission1 = new Permission();
  permission1.name = 'create_aaa';
  permission1.desc = '新增 aaa';

  const permission2 = new Permission();
  permission2.name = 'update_aaa';
  permission2.desc = '修改 aaa';

  const permission3 = new Permission();
  permission3.name = 'remove_aaa';
  permission3.desc = '删除 aaa';

  const permission4 = new Permission();
  permission4.name = 'query_aaa';
  permission4.desc = '查询 aaa';

  const permission5 = new Permission();
  permission5.name = 'create_bbb';
  permission5.desc = '新增 bbb';

  const permission6 = new Permission();
  permission6.name = 'update_bbb';
  permission6.desc = '修改 bbb';

  const permission7 = new Permission();
  permission7.name = 'remove_bbb';
  permission7.desc = '删除 bbb';

  const permission8 = new Permission();
  permission8.name = 'query_bbb';
  permission8.desc = '查询 bbb';

  const user1 = new User();
  user1.username = '东东';
  user1.password = 'aaaaaa';
  user1.permissions  = [
    permission1, permission2, permission3, permission4
  ]

  const user2 = new User();
  user2.username = '光光';
  user2.password = 'bbbbbb';
  user2.permissions  = [
    permission5, permission6, permission7, permission8
  ]

  await this.entityManager.save([
    permission1,
    permission2,
    permission3,
    permission4,
    permission5,
    permission6,
    permission7,
    permission8
  ])
  await this.entityManager.save([
    user1,
    user2
  ]);
}
~~~
注入 EntityManager，实现权限和用户的保存。user1 有 aaa 的 4 个权限，user2 有 bbb 的 4 个权限。调用 entityManager.save 来保存。

然后改下 UserController：
~~~ts
@Get('init')
async initData() {
    await this.userService.initData();
    return 'done'
}
~~~
浏览器访问 init 路由会由一个事务包裹执行一堆 `insert into` 插入数据的SQL。

实现登录的接口，通过 session + cookie 的方式。安装 session 相关的包：
~~~shell
npm install express-session @types/express-session
~~~
在 main.ts 里使用这个中间件：
~~~ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang',
    resave: false,
    saveUninitialized: false
  }));
  await app.listen(3000);
}
bootstrap();
~~~
在 UserController 添加一个 login 的路由：
~~~ts
@Post('login')
login(@Body() loginUser: LoginUserDto, @Session() session){
    console.log(loginUser)
    return 'success'
}
~~~
安装 ValidationPipe 依赖包：
~~~shell
npm install --save class-validator class-transformer
~~~
创建 dto 对象：
~~~ts
import { IsNotEmpty, Length } from "class-validator";

export class LoginUserDto {
  @IsNotEmpty()
  @Length(1, 50)
  username: string;

  @IsNotEmpty()
  @Length(1, 50)
  password: string;
}
~~~
全局启用 ValidationPipe：
~~~ts
// 在 main.ts 中添加下面代码
import { ValidationPipe } from '@nestjs/common'

app.useGlobalPipes(new ValidationPipe())
~~~
实现查询数据库的逻辑，在 UserService 添加 login 方法：
~~~ts
async login(loginUserDto: LoginUserDto) {
    const user = await this.entityManager.findOneBy(User, {
      username: loginUserDto.username
    });

    if(!user) {
      throw new HttpException('用户不存在', HttpStatus.ACCEPTED);
    }

    if(user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    return user;
}
~~~
然后改下 UserController 的 login 方法：
~~~ts
@Post('login')
async login(@Body() loginUser: LoginUserDto, @Session() session){
    const user = await this.userService.login(loginUser);

    session.user = {
      username: user.username
    }

    return 'success';
}
~~~
添加 aaa、bbb 两个模块，分别生成 CRUD 方法：
~~~shell
nest g resource aaa 
nest g resource bbb 
~~~
对接口的调用做限制。先添加一个 LoginGuard，限制只有登录状态才可以访问这些接口：
~~~shell
nest g guard login --no-spec --flat
~~~
然后增加登录状态的检查：
~~~ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

// 因为默认的 session 里没有 user 的类型，所以需要扩展。
declare module 'express-session' {
  interface Session {
    user: {
      username: string
    }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    if(!request.session?.user){
      throw new UnauthorizedException('用户未登录');
    }

    return true;
  }
}
~~~
然后给 aaa bbb 的所有接口上都加上这个 Guard。举例：
~~~ts
@Get()
@UseGuards(LoginGuard)
findAll () {
    return this.aaaService.findAll()
}
~~~
再做登录用户的权限控制，所以再写个 PermissionGuard:
~~~shell
nest g guard permission --no-spec --flat
~~~
因为 PermissionGuard 里需要用到 UserService 来查询数据库，所以需要把它移动到 User 文件夹里。

注入 UserService：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log(this.userService);

    return true;
  }
}
~~~
在 UserModule 的 providers、exports 里添加 UserService 和 PermissionGuard：
~~~ts
import { Module, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PermissionGuard } from './permission.guard';

@Module({
  controllers: [UserController],
  providers: [UserService, PermissionGuard],
  exports: [UserService, PermissionGuard]
})
export class UserModule {}
~~~
在 AaaModule 里引入这个 UserModule：
~~~ts
import { Module } from 'anestjs/common';
import { AaaService } from '. /aaa, service';
import { AaaController } from './aaa. controller';
import { UserModule } from 'src/user/user module';

@Module ({
  imports: [
      UserModule
  ],
  controllers: [AaaController], 
  providers: [AaaService]
})
export class AaaModule {}
~~~
然后在 aaa 的 handler 里添加 PermissionGuard 即可。访问 aaa 的接口，服务端会打印 UserService，说明在 PermissionGuard 里成功注入了 UserService。
~~~ts
@Get()
@UseGuards(LoginGuard, PermissionGuard)
findAll () {
    return this.aaaService.findAll()
}
~~~
接下来实现权限检查的逻辑。在 UserService 里添加一个方法：
~~~ts
// 根据用户名查找用户，并且查询出关联的权限来。
async findByUsername(username: string) {
  const user = await this.entityManager.findOne(User, {
    where: {
      username,
    },
    relations: {
      permissions: true
    }
  });
  return user;
}
~~~
在 PermissionGuard 里调用下：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const foundUser = await this.userService.findByUsername(user.username);

    console.log(foundUser);

    return true;
  }
}
~~~
通过 metadata 设置接口所需要的权限：
~~~ts
@Get()
@UseGuards(LoginGuard, PermissionGuard)
@SetMetedata('permission', 'query_aaa')
findAll () {
    return this.aaaService.findAll()
}
~~~
然后在 PermissionGuard 里通过 reflector 取出来：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }

    const foundUser = await this.userService.findByUsername(user.username);

    const permission = this.reflector.get('permission', context.getHandler());

    if(foundUser.permissions.some(item => item.name === permission)) {
       return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
~~~
进行测试后可以发现每次访问接口，都会触发 3 个表的关联查询。我们使用 redis 进行优化。安装 redis 依赖：
~~~shell
npm install redis 
~~~
新建一个模块来封装 redis 操作：
~~~shell
nest g module redis
~~~
新建一个 service：
~~~shell
nest g service redis --no-spec
~~~
在 RedisModule 里添加 redis 的 provider：
~~~ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [RedisService, 
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
~~~
然后在 RedisService 里添加一些 redis 操作方法：
~~~ts
// 注入 redisClient，封装 listGet 和 listSet 方法，listSet 方法支持传入过期时间。
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType

  async listGet(key: string) {
    return await this.redisClient.lRange(key, 0, -1);
  }

  async listSet(key: string, list: Array<string>, ttl?: number) {
    for (let i = 0; i < list.length; i++) {
      await this.redisClient.lPush(key, list[i]);
    }
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
}
~~~
然后在 PermissionGuard 里注入:
~~~ts
import { RedisService } from './../redis/redis.service';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const user = request.session.user;
    if(!user) {
      throw new UnauthorizedException('用户未登录');
    }
    // 先查询 redis、没有就查数据库并存到 redis，有的话就直接用 redis 的缓存结果。
    // key 为 user_${username}_permissions，这里的 username 是唯一的。
    let permissions = await this.redisService.listGet(`user_${user.username}_permissions`); 

    if(permissions.length === 0) {
      const foundUser = await this.userService.findByUsername(user.username);
      permissions = foundUser.permissions.map(item => item.name);
      // 缓存过期时间为 30 分钟
      this.redisService.listSet(`user_${user.username}_permissions`, permissions, 60 * 30)
    }

    const permission = this.reflector.get('permission', context.getHandler());

    if(permissions.some(item => item === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
~~~
接下来测试后会发现：第一次会产生 2 条关联查询的 sql，后面无论请求多少次都不会打印 sql，而是会去 redis 中获取。


## 实现 RBAC 权限控制
用户、角色、权限都是多对多的关系。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1bbade0f25c94049b3a5ff0362ecaa82~tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.webp)

新建数据库：
~~~shell
CREATE DATABASE rbac_test DEFAULT CHARACTER SET utf8mb4;
~~~
新建项目：
~~~shell
nest new rbac-test -p npm
~~~
安装 typeorm 的依赖：
~~~shell
npm install --save @nestjs/typeorm typeorm mysql2
~~~
在 AppModule 引入 TypeOrmModule：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "rbac_test",
      synchronize: true,
      logging: true,
      entities: [User, Role, Permission],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
然后创建 user 模块：
~~~shell
nest g resource user
~~~
添加 User、Role、Permission 的 Entity：
~~~ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    username: string;

    @Column({
        length: 50
    })
    password: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
    
    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_role_relation'
    })
    roles: Role[] 
}
~~~
~~~ts
import { Column, CreateDateColumn, Entity,PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20
    })
    name: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
    
    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permission_relation'
    })
    permissions: Permission[] 
}
~~~
~~~ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    name: string;
    
    @Column({
        length: 100,
        nullable: true
    })
    desc: string;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;
}
~~~
启动项目：
~~~shell
npm run start:dev
~~~
修改下 UserService，添加数据：
~~~ts
@InjectEntityManager()
entityManager: EntityManager;

async initData() {
    const user1 = new User();
    user1.username = '张三';
    user1.password = '111111';

    const user2 = new User();
    user2.username = '李四';
    user2.password = '222222';

    const user3 = new User();
    user3.username = '王五';
    user3.password = '333333';

    const role1 = new Role();
    role1.name = '管理员';

    const role2 = new Role();
    role2.name = '普通用户';

    const permission1 = new Permission();
    permission1.name = '新增 aaa';

    const permission2 = new Permission();
    permission2.name = '修改 aaa';

    const permission3 = new Permission();
    permission3.name = '删除 aaa';

    const permission4 = new Permission();
    permission4.name = '查询 aaa';

    const permission5 = new Permission();
    permission5.name = '新增 bbb';

    const permission6 = new Permission();
    permission6.name = '修改 bbb';

    const permission7 = new Permission();
    permission7.name = '删除 bbb';

    const permission8 = new Permission();
    permission8.name = '查询 bbb';


    role1.permissions = [
      permission1,
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8
    ]

    role2.permissions = [
      permission1,
      permission2,
      permission3,
      permission4
    ]

    user1.roles = [role1];

    user2.roles = [role2];

    await this.entityManager.save(Permission, [
      permission1, 
      permission2,
      permission3,
      permission4,
      permission5,
      permission6,
      permission7,
      permission8
    ])

    await this.entityManager.save(Role, [
      role1,
      role2
    ])

    await this.entityManager.save(User, [
      user1,
      user2
    ])  
}
~~~
然后在 UserController 里添加一个 handler (接口方法)：
~~~ts
@Get('init')
async initData() {
    await this.userService.initData();
    return 'done';
}
~~~
启动服务：
~~~shell
npm run start:dev
~~~
在浏览器访问 init 接口，这时会产生一批 sql 进行数据插入。

然后通过 jwt 的方式来实现登录，在 UserController 里增加一个 login 的 handler：
~~~ts
@Post('login')
login(@Body() loginUser: UserLoginDto){
    console.log(loginUser)
    return 'success'
}
~~~
安装 ValidationPipe 依赖包：
~~~shell
npm install --save class-validator class-transformer
~~~
创建 dto 对象：
~~~ts
// user/dto/user-login.dto.ts
import { IsNotEmpty, Length } from "class-validator";

export class UserLoginDto {
  @IsNotEmpty()
  @Length(1, 50)
  username: string;

  @IsNotEmpty()
  @Length(1, 50)
  password: string;
}
~~~
全局启用 ValidationPipe：
~~~ts
// 在 main.ts 中添加下面代码
import { ValidationPipe } from '@nestjs/common'

app.useGlobalPipes(new ValidationPipe())
~~~
实现查询数据库的逻辑，在 UserService 添加 login 方法：
~~~ts
async login(loginUserDto: UserLoginDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUserDto.username
      },
      relations: {
        roles: true
      }
    });

    if(!user) {
      throw new HttpException('用户不存在', HttpStatus.ACCEPTED);
    }

    if(user.password !== loginUserDto.password) {
      throw new HttpException('密码错误', HttpStatus.ACCEPTED);
    }

    return user;
}   
~~~
在 UserController 的 login 方法里调用:
~~~ts
@Post('login')
async login(@Body() loginUser: UserLoginDto){
    const user = await this.userService.login(loginUser);

    console.log(user);

    return 'success'
}
~~~
安装 JWT：
~~~shell
npm install --save @nestjs/jwt
~~~
然后在 AppModule 里引入 JwtModule：
~~~ts
@Module({
  imports: [
      JwtModule.register({
        global: true,
        secret: 'guang',
        signOptions: {
            expiresIn: '7d'
        }
      })
  ]
})
export class AppModule {}
~~~
然后在 UserController 里注入 JwtModule 里的 JwtService：

~~~ts
@Controller('user')
export class UserController {
  @Inject(JwtService)
  private jwtService: JwtService

  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginUser: UserLoginDto){
    const user = await this.userService.login(loginUser);

    const token = this.jwtService.sign({
      user: {
        username: user.username,
        roles: user.roles
      }
    });

    return {
      token
    }
  }
}
~~~
添加 aaa、bbb 两个模块，分别生成 CRUD 方法：
~~~shell
nest g resource aaa 
nest g resource bbb 
~~~
对接口的调用做权限限制，先添加一个 LoginGuard，限制只有登录状态才可以访问这些接口：
~~~shell
nest g guard login --no-spec --flat
~~~
然后增加登录状态的检查：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from './user/entities/role.entity'

declare module 'express' {
    interface Request {
        user: {
            username: string,
            roles: Role[]
        }
    }
}

@Injectable()
export class LoginGuard implements CanActivate {
  
  @Inject(JwtService)
  private jwtService: JwtService;
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      request.user = data.user
      return true;
    } catch(e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
~~~
全局添加 Guard：
~~~ts
@Module({
  imports: [
      JwtModule.register({
        global: true,
        secret: 'guang',
        signOptions: {
            expiresIn: '7d'
        }
      }), UserModule, AaaModule, BbbModule
  ],
  controllers: [AppController],
  providers:[
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    }
  ]
})
export class AppModule {}
~~~
使用 SetMetadata 区分哪些接口需要登录，哪些接口不需要。添加一个 `custom-decorator.ts` 来放自定义的装饰器：
~~~ts
import { SetMetadata } from "@nestjs/common";

export const  RequireLogin = () => SetMetadata('require-login', true);
~~~
声明一个 RequireLogin 的装饰器。在 aaa、bbb 的 controller 上使用即可：
~~~ts
@Controller('aaa')
@RequireLogin()
export class AaaController {
  constructor(private readonly aaaService: AaaService) {}
}
~~~
然后需要改造下 LoginGuard，取出目标 handler 的 metadata 来判断是否需要登录：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from './user/entities/role.entity'

declare module 'express' {
  interface Request {
    user: {
      username: string,
      roles: Role[]
    }
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  // 取 metadata
  @Inject()
  private reflector: Reflector;
  
  @Inject(JwtService)
  private jwtService: JwtService;
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    // 如果目标 handler 或者 controller 不包含 require-login 的 metadata，那就放行，否则才检查 jwt。
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ]);

    console.log(requireLogin)

    if(!requireLogin) {
      return true;
    }
    
    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify(token);
      request.user = data.user
      return true;
    } catch(e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
~~~
再做登录用户的权限控制，所以再写个 PermissionGuard:
~~~shell
nest g guard permission --no-spec --flat
~~~
同样声明成全局 Guard：
~~~ts
@Module({
  providers:[
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard
    }
  ]
})
export class AppModule {}
~~~
PermissionGuard 里需要用到 UserService，所以在 UserModule 里导出下 UserService：
~~~ts
@Module({
  exports:[UserService]
})
export class UserModule {}
~~~
注入 UserService：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { UserService } from './user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    console.log(this.userService);

    return true;
  }
}
~~~
然后在 userService 里实现查询 role 的信息的 service：
~~~ts
async findRolesByIds(roleIds: number[]) {
    return this.entityManager.find(Role, {
      where: {
        id: In(roleIds)
      },
      relations: {
        permissions: true
      }
    });
}
~~~
然后在 PermissionGuard 里调用：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if(!request.user) {
      return true;
    }

    const roles = await this.userService.findRolesByIds(request.user.roles.map(item => item.id))

    const permissions: Permission[]  = roles.reduce((total, current) => {
      total.push(...current.permissions);
      return total;
    }, []);

    console.log(permissions);

    return true;
  }
}
~~~
因为这个 PermissionGuard 在 LoginGuard 之后调用（在 AppModule 里声明在 LoginGuard 之后），所以走到这里 request 里就有 user 对象了。

但也不一定，因为 LoginGuard 没有登录也可能放行，所以要判断下 request.user 如果没有，这里也放行。

然后取出 user 的 roles 的 id，查出 roles 的 permission 信息，然后合并到一个数组里。

再增加个自定义装饰器：
~~~ts
export const  RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);
~~~
然后在 BbbController 上声明需要的权限：
~~~ts
@Get()
@RequirePermission('查询 bbb')
findAll() {
    return this.bbbService.findAll()
}
~~~
修改 PermissionGuard：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(UserService) 
  private userService: UserService;
  
  @Inject(Reflector) 
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if(!request.user) {
      return true;
    }

    const roles = await this.userService.findRolesByIds(request.user.roles.map(item => item.id))

    const permissions: Permission[]  = roles.reduce((total, current) => {
      total.push(...current.permissions);
      return total;
    }, []);

    console.log(permissions);

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [
      context.getClass(),
      context.getHandler()
    ])

    console.log(requiredPermissions);

    for(let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find(item => item.name === curPermission);
      if(!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}
~~~
这样就实现了基于 RBAC 的权限控制。此外，这里查询角色需要的权限没必要每次都查数据库，可以通过 redis 来加一层缓存，减少数据库访问，提高性能。（具体写法参考上节）


## 动态读取环境配置

新建项目：
~~~shell
nest new nest-config-test -p npm
~~~
安装 @nestjs/config 包：
~~~shell
npm install --save @nestjs/config
~~~
在根目录加一个配置文件 .env：
~~~js
aaa = 1
bbb = 2
~~~
在 AppModule 里面引入:
~~~ts
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule{}
~~~
然后在 AppController 里注入 ConfigService 来读取配置：
~~~ts
import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get()
  getHello() {
    return {
      aaa: this.configService.get('aaa'),
      bbb: this.configService.get('bbb')
    }
  }
}
~~~
启动服务：
~~~shell
npm run start:dev
~~~
在浏览器中访问服务地址会出现：`{"aaa":"1","bbb":"2"}`。

如果有多个配置文件，比如还有个 .aaa.env：
~~~ts
aaa = 3
~~~
在 AppModule 里面这样指定：
~~~ts
imports: [
  ConfigModule.forRoot({    // 前面 aaa.env 的配置会覆盖后面的
    envFilePath: [path.join(process.cwd(), '.aaa.env'), path.join(process.cwd(), '.env')]
  })
]
~~~
重新访问服务地址会出现：`{"aaa":"3","bbb":"2"}`。

**使用 ts 文件来配置**

新建 config.ts：
~~~ts
// config.ts
export default async () => {
  const dbPort = await 3306;

  return {
    port: parseInt(process.env.PORT, 10) || 3000,
    db: {
      host: 'localhost',
      port: dbPort
    }
  }
}
~~~
在 AppModule 里面指定：
~~~ts
import config from './config.ts'

imports: [
  ConfigModule.forRoot({
    load: [config]
  })
]
~~~
在 Controller 里取出来:
~~~ts
@Get()
getHello() {
  return {
    db: this.configService.get('db')
  }
}
~~~
在浏览器中访问会出现：`{"db":{"host":"localhost","port":"3306"}}`。

**使用 yaml 文件来配置**

安装 yaml 包：
~~~shell
npm install js-yaml
~~~
新建一个配置文件 aaa.yaml：
~~~yaml
application:
  host: 'localhost'
  port: 8080

aaa:
  bbb:
    ccc: 'ccc'
    port: 3306
~~~
新建 common.ts 加载 yaml：
~~~ts
import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';
import { join } from 'path';


export default async () => {
    const configFilePath = join(process.cwd(), 'aaa.yaml');

    const config = await readFile(configFilePath);

    return yaml.load(config);
};
~~~
在 AppModule 引入：
~~~ts
import common from './common.ts'

imports: [
  ConfigModule.forRoot({
    load: [common]
  })
]
~~~
改下 Controller：
~~~ts
@Controller ()
export class AppController {
  constructor (private readonly appService: AppService) {}
  
  @Inject (ConfigService)
  private configService: ConfigService;
  
  @Get ()
  getHello() {
    return {
      common: this.configService.get ('aaa.bbb.ccc')
    }
  }
}
~~~
在浏览器中访问会出现：`{"common":"ccc"}`。

让别的模块也能使用到配置，新建一个模块：
~~~shell
nest g resource bbb --no-spec
~~~
修改 AppModule：
~~~ts
import common from './common.ts'
import { BbbModule } from './bbb/bbb.module'

imports: [
  ConfigModule.forRoot({
    isGlobal: true,
    load: [common]
  }),
  BbbModule
]
~~~
在 BbbController 中使用：

~~~ts
@Controller('bbb')
export class BbbController {
  constructor(private readonly bbbService:BbbService) {}
  
  @Inject(ConfigService)
  private configService: ConfigService
  
  @Post()
  create(@Body() createBbbDto: CreateBbbDto) {
      return this.bbbService.create(createBbbDto)
  }
  
  @Get()
  findAll() {
      return this.configService.get('aaa.bbb.ccc')
  }
}
~~~
浏览器中访问会出现：`ccc`。

此外，还可以通过 ConfigModule.forFeature 来注册局部配置：
~~~ts
import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forFeature(() => {
      return {
        ddd: 222
      }
    })
  ],
  controllers: [BbbController],
  providers: [BbbService]
})
export class BbbModule {}
~~~
BbbController 里读取下：
~~~ts
@Get()
findAll() {
    return {
      ccc: this.configService.get('aaa.bbb.ccc'),
      ddd: this.configService.get('ddd')
    }
}
~~~
浏览器中访问会出现：`{"ccc":"ccc", "ddd":"222"}`。

这里是再次验证了**动态模块的 forRoot 用于在 AppModule 里注册，一般指定为全局模块，forFeature 用于局部配置，在不同模块里 imports，而 register 用于一次性的配置。**

比如 JwtModule.register、TypeOrmModule.ForRoot、TypeOrmModule.forFeature。


## 使用 Docker Compose
**不使用 Docker Compose 部署项目**

新建项目：
~~~shell
nest new docker-compose-test -p npm
~~~
安装 typeorm、mysql2：
~~~shell
npm install --save @nestjs/typeorm typeorm mysql2
~~~
新建数据库：
~~~shell
CREATE DATABASE `aaa` DEFAULT CHARACTER SET utf8mb4;
~~~
新建一个aaa.entity.ts:
~~~ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Aaa {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30
    })
    aaa: string;

    @Column({
        length: 30
    })
    bbb: string;
}
~~~
AppModule 引入 TypeOrmModule：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Aaa } from './aaa.entity'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "aaa",
      synchronize: true,
      logging: true,
      entities: [Aaa],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
启动服务：
~~~shell
npm run start:dev
~~~
安装 redis：
~~~shell
npm install redis 
~~~
AppModule 中添加 redis client 的 provider：
~~~ts
{
  provide: 'REDIS_CLIENT',
  async useFactory() {
    const client = createClient({
        socket: {
            host: 'localhost',
            port: 6379
        }
    });
    await client.connect();
    return client;
  }
}
~~~
在 AppService 里注入下：
~~~ts
import { Controller, Get, Inject } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  @Get()
  async getHello() {
    const keys = await this.redisClient.keys('*');
    console.log(keys);

    return this.appService.getHello();
  }
}
~~~
需要先编辑 mysql redis 以及 nest项目的 dockerFile 并执行生成镜像，下面以 nest 为例，mysql redis以此为例请自行编写，通过 docker build 命令执行 dockerFile 文件生成镜像。

编写 nest 的 dockerFile 生成镜像：
~~~shell
FROM node:18.0-alpine3.14 as build-stage

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

RUN npm run build

# production stage
FROM node:18.0-alpine3.14 as production-stage

COPY --from=build-stage /app/dist /app
COPY --from=build-stage /app/package.json /app/package.json

WORKDIR /app

RUN npm install --production

EXPOSE 3000

CMD ["node", "/app/main.js"]
~~~
执行 dockerFile 生成 nest项目镜像：
~~~shell
docker build -t eee .
~~~
在服务中部署需要使用命令行的方式，先启动 mysql 的 docker 容器：
~~~shell
docker run -d -p 3306:3306 -v /Users/guang/mysql-data:/var/lib/mysql --name mysql-container mysql
~~~
- -d 是 demon，放到后台运行的意思。
- -p 是端口映射
- -v 是挂载数据卷，把宿主机目录映射到容器内的目录（这里要换成你自己的）
- -name 是容器名
- 可能还需要指定环境变量： -e MYSQL_ROOT_PASSWORD=xxx 设置 root 用户的密码
- 最后面的 mysql 是执行 dockerFile 生成的镜像的名称

然后再启动 redis 的 docker 容器：
~~~shell
docker run -d -p 6379:6379 -v /Users/guang/aaa:/data --name redis-container redis
~~~
接着启动 nest 的：
~~~shell
docker run -d -p 3000:3000 --name nest-container eee
~~~
查看 nest 容器日志：
~~~shell
docker logs nest-container
~~~
会发现连接数据库失败，因为这里的 127.0.0.1 是容器内的端口，不是宿主机的，需要将 IP 改为宿主机 IP ：
~~~ts
imports: [
  TypeOrmModule.forRoot({
    type: "mysql",
    host: "192.168.1.10",   // 查询本机 IP 地址并写入
    port: 3306,
    username: "root",
    password: "guang",
    database: "aaa",
    synchronize: true,
    logging: true,
    entities: [Aaa],
    poolSize: 10,
    connectorPackage: 'mysql2',
    extra: {
        authPlugin: 'sha256_password',
    }
  }),
]
~~~
执行 `docker build -t fff .` 重新生成镜像，将之前的容器删掉：`docker rm nest-container`，再执行 `docker run -d -p 3000:3000 --name nest-container fff
` 启动容器。

**使用 Docker Compose 部署项目**

先停掉那 3 个容器：
~~~shell
docker stop nest-container mysql-container redis-container
~~~
然后在根目录添加一个 docker-compose.yaml：
~~~yaml
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
  mysql-container:
    image: mysql
    ports:
      - '3306:3306'
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
  redis-container:
    image: redis
    ports:
      - '6379:6379'
    volumes:
      - /Users/guang/aaa:/data
~~~
services 下的每个子项都是一个 docker 容器，名字随便指定。nest-app 配置了 depends_on 其他两个 service，docker-compose 就会先启动另外两个，再启动这个，这样解决了顺序问题。然后 mysql-container、redis-container 的 service 指定了 image 和 ports、volumes 的映射。

通过 docker-compose 把它们启动起来：
~~~shell
docker-compose up
~~~
我们只需要定义 docker-compose.yaml 来声明容器的顺序和启动方式，之后执行 docker-compose up 一条命令就能按照顺序启动所有的容器。


## Docker通信之桥接网络
上面的 Docker Compose 部署方式涉及到多个 docker 容器的通信，我们是通过指定宿主机 ip 和端口的方式。

Docker 通过 Namespace 的机制实现了容器的隔离，其中就包括 Network Namespace。因为每个容器都有独立的 Network Namespace，所以不能直接通过端口访问其他容器的服务。

桥接网络：可以创建一个 Network Namespace，然后设置到多个 Docker 容器，这样这些容器就可以在一个 Namespace 下直接访问对应端口了。

创建一个网络：
~~~shell
docker network create common-network
~~~
把之前的 3 个容器停掉并删除：
~~~shell
docker stop mysql-container redis-container nest-container
docker rm mysql-container redis-container nest-container
~~~
指定 --network 重新启动容器：
~~~shell
# mysql
docker run -d --network common-network -v /Users/guang/mysql-data:/var/lib/mysql --name mysql-container mysql
~~~
~~~shell
# redis
docker run -d --network common-network -v /Users/guang/aaa:/data --name redis-container redis
~~~
修改 AppModule 的代码，改成用容器名来访问：
~~~ts
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "mysql-container",  // 使用 mysql 容器名来访问
      port: 3306,
      username: "root",
      password: "guang",
      database: "aaa",
      synchronize: true,
      logging: true,
      entities: [Aaa],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
          socket: {
            host: 'redis-container',    // 使用 redis 容器名来访问
            port: 6379
          }
        });
        await client.connect();
        return client;
      }
    }
  ],
})
export class AppModule {}
~~~
重新生成镜像：
~~~shell
docker build -t mmm .
~~~
指定 --network 运行启动容器：
~~~shell
# mysql
docker run -d --network common-network -p 3000:3000 --name nest-container mmm
~~~

**使用 Docker Compose 的方式**

修改 yaml 文件：
~~~yaml
version: '3.8'
services:
  nest-app:
    build:
      context: ./
      dockerfile: ./Dockerfile
    depends_on:
      - mysql-container
      - redis-container
    ports:
      - '3000:3000'
    networks:
      - common-network
  mysql-container:
    image: mysql
    volumes:
      - /Users/guang/mysql-data:/var/lib/mysql
    networks:
      - common-network
  redis-container:
    image: redis
    volumes:
      - /Users/guang/aaa:/data
    networks:
      - common-network
networks:
  common-network:
    driver: bridge
~~~
version 是指定 docker-compose.yml 的版本，因为不同版本配置不同。把 mysql-container、redis-container 的 ports 映射去掉，指定桥接网络为 common-network。通过 networks 指定创建的 common-network 桥接网络，网络驱动程序指定为 bridge。

删除 3 个容器和它们的镜像：
~~~shell
docker-compose down --rmi all
~~~
重新启动：
~~~shell
docker-compose up
~~~
**其实不指定 networks 也可以，docker-compose 会创建个默认的。** 可以尝试将 networks 属性都注释掉，然后删掉容器和镜像，再重新启动试试。

## Nest 中使用 Swagger
安装 swagger 的包：
~~~shell
npm install --save @nestjs/swagger
~~~
在 main.ts 中添加：
~~~ts
async function bootstrap() {
  //...
  const config = new DocumentBuilder()  // 创建 config 配置
          .setTitle('Test example')
          .setDescription('The API description')
          .setVersion('1.0')
          .addTag('test')
          .build();
  const document = SwaggerModule.createDocument(app, config);   // 基于 config 配置创建文档
  SwaggerModule.setup('doc', app, document);    // 启动并指定文档访问路径
  //...
}
~~~
给接口添加 parameters 的描述和 responses 的描述:
~~~ts
@ApiOperation({ summary: '测试 aaa',description: 'aaa 描述' })  // 接口的描述
@ApiResponse({      // 响应内容的描述
    status: HttpStatus.OK,
    description: 'aaa 成功',
    type: String
})
@ApiQuery({     // 接口参数的描述
  name: 'page',   // 参数名
  type: String,     // 参数类型
  description: 'a1 param',  // 参数描述
  required: false,  // 是否必传
  example: '1111',  // 示例
})
@ApiQuery({
  name: 'limit',
  type: Number,
  description: 'a2 param',
  required: true,
  example: 2222,
})
@Get('list')
aaa(@Query('page') page, @Query('limit') limit) {
    console.log(page, limit);
    return 'select list success';
}
~~~
`@ApiQuery` 用于定义查询参数，而 `@ApiParam` 用于定义路径参数和请求体参数。示例如下：
~~~ts
@Get(':id')
@ApiOperation({ summary: 'Get user by ID' })
@ApiResponse({
  status: HttpStatus.OK,
  description: 'bbb 成功',
  type: String
})
@ApiResponse({  // id 不合法返回 401
  status: HttpStatus.UNAUTHORIZED,
  description: 'id 不合法'
})
@ApiParam({ 
  name: 'id', 
  description: 'User ID',
  required: true,
  example: 1,
})
getUserById(@Param('id') id: string) {
  console.log(id);
  if(id != 111) {  // id 不合法返回 401
    throw new UnauthorizedException();
  }
  return 'select id info success';
}
~~~
使用 dto 与 vo 来描述参数和返回值：
~~~ts
export class CccDto {
  @ApiProperty({ 
    name: 'aaa', // 参数名
    enum: ['a', 'b', 'c'],  // 枚举类型
    maxLength: 30,  // 最大长度
    minLength: 2,   // 最小长度
    required: true  // 是否必传
  }) 
  aaa: string;

  // 表示可选，与 @ApiProperty({ required: false }) 等价
  @ApiPropertyOptional({ 
    name: 'bbb',
    maximum: 60,    // 最大值
    minimum: 40,    // 最小值
    default: 50,    // 默认值
    example: 55     // 示例
  })     
  bbb: number;
  
  @ApiProperty({ name: 'aaa' })
  ccc: Array<string>;
}
~~~
~~~ts
export class CccVo {
  @ApiProperty({ name: 'aaa' })
  aaa: number;
  
  @ApiProperty({ name: 'bbb' })
  bbb: number;
}
~~~
~~~ts
@ApiOperation({summary:'测试 ccc'})
@ApiResponse({
  status: HttpStatus.OK,
  description: 'ccc 成功',
  type: CccVo
})
@ApiBody({      // body 参数的描述
  type: CccDto
})
@Post('ccc')
ccc(@Body('ccc') ccc: CccDto) {
  console.log(ccc);

  const vo = new CccVo();
  vo.aaa = 111;
  vo.bbb = 222;
  return vo;
}
~~~
通过 @ApiTags 来给接口分组：
~~~ts
@ApiTags('user')
@Controller('user')
export class UserController{}
// 或者
@ApiTags('user')
@Get('user/:id')
getUser(@Param('id') id:string) {}

@ApiTags('user')
@Post('user/create')
createUser(@Body('userInfo') userInfo:UserInfoDto) {}
~~~
添加认证方式，在需要认证的接口方法(handle)前加上对应的认证方式：
~~~ts
// 账号密码认证
@ApiBasicAuth('basic')

// JWT认证
@ApiBearerAuth('bearer')

// Cookie认证
@ApiBasicAuth('cookie')
~~~
~~~ts
// main.ts
const config = new DocumentBuilder()
  .setTitle('Test example')
  .setDescription('The API description')
  .setVersion('1.0')
  .addTag('test')
  .addBasicAuth({
    type: 'http',
    name: 'basic',
    description: '用户名 + 密码'
  })
  .addCookieAuth('sid', {
    type: 'apiKey',
    name: 'cookie',
    description: '基于 cookie 的认证'
  })
  .addBearerAuth({
    type: 'http',
    description: '基于 jwt 的认证',
    name: 'bearer'
  })
  .build();
~~~

## Nest 中使用邮件
安装 nodemailer 包:
~~~shell
npm install --save nodemailer
npm install --save-dev @types/nodemailer
~~~
添加 email 模块:
~~~shell
nest g resource email
~~~
EmailService 中编写发生邮件：
~~~ts
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor() {
        this.transporter = createTransport({
            host: "smtp.qq.com",
            port: 587,
            secure: false,
            auth: {
                user: '你的邮箱',  // 发件人邮箱
                pass: '你的授权码'    // 发件人邮箱授权码
            },
        });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '系统邮件',
          address: '你的邮箱'
        },
        to,
        subject,
        html
      });
    }
}
~~~
EmailController 中添加：
~~~ts
import { Controller, Get, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get('code')
  async sendEmailCode(@Query("address") address) {
    // 生成随机验证码
    const code = Math.random().toString().slice(2,8);
    await this.emailService.sendMail({
      to: address,
      subject: '登录验证码',
      html: `<p>你的登录验证码是 ${code}</p>`
    });
    return '发送成功';
  }
}
~~~
使用配置模块将参数放入系统配置中，安装配置模块：
~~~shell
npm install --save @nestjs/config
~~~
在 AppModule 中加入：
~~~ts
@Module({
  imports:[
    //...
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'src/.env'
    })
    //...      
  ]
})
~~~
在 src/.env 中添加：
~~~
email_user=598670138@163.com
email_password=123456
~~~
修改 EmailService ：
~~~ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor(private configService: ConfigService) {
      this.transporter = createTransport({
          host: "smtp.qq.com",
          port: 587,
          secure: false,
          auth: {
              user: this.configService.get('email_user'),
              pass: this.configService.get('email_password')
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '系统邮件',
          address: this.configService.get('email_user')
        },
        to,
        subject,
        html
      });
    }
}
~~~
打包时我们需要将 .env 复制过去，修改nest-cli.json:
~~~json
{
  "compilerOptions": {
    "watchAssets": true,  // 是否监听同步 assets 指定文件的更新
    "assets": ["*.env"]   // assets 只支持 src 下的文件复制
  }
}
~~~
使用 Redis 存储验证码，以用户邮箱地址为 key。创建个 redis 模块：
~~~shell
nest g resource redis  --no-spec
~~~
安装 redis 的包：
~~~shell
npm install redis --save
~~~
把 RedisModule 声明为全局模块，并导出 RedisService。然后添加一个 provider：
~~~ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { createClient } from 'redis';

@Global()
@Module({
  controllers: [RedisController],
  providers: [RedisService, {
    provide: 'REDIS_CLIENT',
    async useFactory() {
      const client = createClient({
          socket: {
              host: 'localhost',
              port: 6379
          }
      });
      await client.connect();
      return client;
    }
  }],
  exports: [RedisService]
})
export class RedisModule {}
~~~
在 RedisService 里封装 redis 的 get、set 方法：
~~~ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}
~~~
修改 EmailController：
~~~ts
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Inject()
  private redisService: RedisService;

  @Get('code')
  async sendEmailCode(@Query("address") address) {
    const code = Math.random().toString().slice(2,8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '登录验证码',
      html: `<p>你的登录验证码是 ${code}</p>`
    });
    return '发送成功';
  }
}
~~~
示例登录接口中进行验证：
~~~ts
@Inject(RedisService)
private redisService: RedisService;

@Post('login')
async login(@Body() loginUserDto: LoginUserDto) {

    const { email, code } = loginUserDto;

    const codeInRedis = await this.redisService.get(`captcha_${email}`);

    if(!codeInRedis) {
      throw new UnauthorizedException('验证码已失效');
    }
    if(code !== codeInRedis) {
      throw new UnauthorizedException('验证码不正确');
    }

    const user = await this.userService.findUserByEmail(email);

    console.log(user);

    return 'success';
}
~~~
在 UserService 里实现下这个方法：
~~~ts
@InjectEntityManager()
private entityManager: EntityManager;

async findUserByEmail(email: string) {
    return await this.entityManager.findOneBy(User, {
      email
    });
}
~~~

## 定时任务 + Redis 实现阅读计数
文章的阅读量计数，我们通常会想到加个 `views` 的字段，然后每次刷新页面都加一，但这样会有两个问题：
- 每次刷新阅读量都加一，其实还是同一个人看的这篇文章，这样统计出来的阅读量是不准的，我们想要的阅读量是有多少人看过这篇文章
- 阅读是个很高频的操作，直接存到数据库，数据库压力会太大

其实我们学完 `Redis` 就应该能想到解决方案：
- 在 `redis` 中存储 `user` 和 `article` 的关系，比如 `user_111_article_222` 为 `key`，10 分钟后删除，如果存在这个 key，就说明该用户看过这篇文章，就不更新阅读量，否则才更新。10 分钟后，这个人再看这篇文章，就可以算是新的一次阅读量。

- 访问文章时把阅读量加载到 `redis`，之后的阅读量计数只更新 `redis`，不更新数据库，等业务低峰期再把最新的阅读量写入数据库。这里的业务低峰期，比如凌晨 4 点的时候写入数据库，可以用定时任务来做。

下面我们来实现一下：

新建项目
~~~shell
nest new article-views -p npm
~~~
安装 `typeorm` 相关的包：
~~~shell
npm install --save @nestjs/typeorm typeorm mysql2
~~~
在 AppModule 引入 TypeOrmModule：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "article_views",
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
创建这个 database：
~~~sql
CREATE DATABASE article-views DEFAULT CHARACTER SET utf8mb4;
~~~
新建个文章和用户的模块：
~~~shell
nest g resource user --no-spec
nest g resource article --no-spec
~~~
添加 user 和 article 的 entity：
~~~ts
import { Column, PrimaryGeneratedColumn, Entity } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '用户名'
    })
    username: string;

    @Column({
        comment: '密码'
    })
    password: string;
}
~~~
~~~ts
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        comment: '文章名字',
        length: 50
    })
    title: string;

    @Column({
        comment: '内容',
        type: 'text'
    })
    content: string;

    @Column({
        comment: '阅读量',
        default: 0
    })
    viewCount: number;

    @Column({
        comment: '点赞量',
        default: 0
    })
    likeCount: number;

    @Column({
        comment: '收藏量',
        default: 0
    })
    collectCount: number;
}
~~~
在 AppModule 引入 entity：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/entities/user.entity'
import { Article } from './article/entities/article.entity'
import { UserModule } from './user/user.module'
import { ArticleModule } from './article/article.module'

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "article_views",
      synchronize: true,
      logging: true,
      entities: [User, Article],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
    UserModule,
    ArticleModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
执行 `npm run start:dev` 后可以看到 `typeorm` 会自动创建了 `user`，`article` 表。

然后插入一些数据，在 `AppController` 创建 `init-data` 的路由，然后注入 `EntityManager`：
~~~ts
@InjectEntityManager()
private entityManager: EntityManager;

@Get('init-data')
async initData() {
  await this.entityManager.save(User, {
    username: 'dong',
    password: '111111'
  });
  await this.entityManager.save(User, {
    username: 'guang',
    password: '222222'
  });

  await this.entityManager.save(Article, {
    title: '基于 Axios 封装一个完美的双 token 无感刷新',
    content: `用户登录之后，会返回一个用户的标识，之后带上这个标识请求别的接口，就能识别出该用户。

    标识登录状态的方案有两种： session 和 jwt。
    `
  });

  await this.entityManager.save(Article, {
    title: 'Three.js 手写跳一跳小游戏',
    content: `前几年，跳一跳小游戏火过一段时间。

    玩家从一个方块跳到下一个方块，如果没跳过去就算失败，跳过去了就会再出现下一个方块。`
  });
  return 'done';
}
~~~
两个 `entity` 分别插入 2 条数据。

然后先实现登录，这里使用 `session` 的方案，安装相关的包：
~~~shell
npm install express-session @types/express-session
~~~
在 `main.ts` 里启用：
~~~ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(session({
    secret: 'guang',
    resave: false,
    saveUninitialized: false
  }));

  await app.listen(3000);
}
bootstrap();
~~~
在 `UserController` 添加 `login` 的路由：
~~~ts
@Post('login')
async login(@Body() loginUserDto: LoginUserDto) {
    console.log(loginUserDto);
    return 'success';
}
~~~
新建 `src/user/dto/login-user.dto.ts`:
~~~ts
export class LoginUserDto {

    username: string;

    password: string;
}
~~~
在 `UserService` 实现登录逻辑：
~~~ts
@InjectEntityManager()
private entityManager: EntityManager;

async login(loginUser: LoginUserDto) {
    const user = await this.entityManager.findOne(User, {
      where: {
        username: loginUser.username
      }
    });

    if(!user) {
      throw new BadRequestException('用户不存在');
    }

    if(user.password !== loginUser.password) {
      throw new BadRequestException('密码错误');
    }

    return user;
}
~~~
在 `UserController` 调用下：
~~~ts
@Post('login')
async login(@Body() loginUserDto: LoginUserDto, @Session() session) {
    const user = await this.userService.login(loginUserDto);

    session.user = {
        id: user.id,
        username: user.username
    }

    return 'success';
}
~~~
调用 `userService` 的 `login` 方法，实现登录验证，然后把用户信息存入 `session`。

在 `ArticleController` 添加一个查询文章的接口：
~~~ts
@Get(':id')
async findOne(@Param('id') id: string) {
    return await this.articleService.findOne(+id);
}
~~~
实现 `articleService.findOne` 方法：
~~~ts
@InjectEntityManager()
private entityManager: EntityManager;

async findOne(id: number) {
    return await this.entityManager.findOneBy(Article, {
      id
    });
}
~~~
在 `ArticleController` 加一个阅读的接口：
~~~ts
@Get(':id/view')
async view(@Param('id') id: string) {
    return await this.articleService.view(+id);
}
~~~
在 `ArticleService` 里实现具体的逻辑：
~~~ts
async view(id: number) {
    const article = await this.findOne(id);

    article.viewCount ++;

    await this.entityManager.save(article);

    return article.viewCount;
}
~~~
安装 `redis` 的包：
~~~shell
npm install --save redis
~~~
创建个 `redis` 模块：
~~~shell
nest g module redis
nest g service redis
~~~
在 `RedisModule` 创建连接 `redis` 的 `provider`，导出 `RedisService`，并把这个模块标记为 `@Global` 模块:
~~~ts
import { Global, Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
~~~
在 `RedisService` 里注入 `REDIS_CLIENT`，并封装一些方法：
~~~ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }

    async hashGet(key: string) {
        return await this.redisClient.hGetAll(key);
    }

    async hashSet(key: string, obj: Record<string, any>, ttl?: number) {
        for(let name in obj) {
            await this.redisClient.hSet(key, name, obj[name]);
        }

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}
~~~
我们封装了 `get`、`set`、`hashGet`、`hashSet` 方法，分别是对 `redis` 的 `string`、`hash` 数据结构的读取。

然后在 `view` 方法里引入 `redis`：
~~~ts
@Inject(RedisService)
private redisService: RedisService;

async view(id: number) {
    const res = await this.redisService.hashGet(`article_${id}`);

    if(res.viewCount === undefined) {
      const article = await this.findOne(id);

      article.viewCount ++;

      await this.entityManager.update(Article, { id }, {
        viewCount: article.viewCount
      });

      await this.redisService.hashSet(`article_${id}`, {
        viewCount: article.viewCount,
        likeCount: article.likeCount,
        collectCount: article.collectCount
      });

      return article.viewCount;

    } else {
      await this.redisService.hashSet(`article_${id}`, {
        ...res,
        viewCount: +res.viewCount + 1
      });
      return +res.viewCount + 1;
    }
}
~~~
先查询 `redis`，如果没查到就从数据库里查出来返回，并存到 `redis` 里。查到了就更新 `redis` 的 `viewCount`，直接返回 `viewCount + 1`

接下来同步到数据库。引入定时任务包 `@nestjs/schedule`：
~~~shell
npm install --save @nestjs/schedule
~~~
在 AppModule 引入下：
~~~ts
//...
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports:[
    ScheduleModule.forRoot(),
    //...
  ]
})
~~~
然后创建一个 `service`：
~~~shell
nest g module task
nest g service task
~~~
定义个方法，通过 `@Cron` 声明每 **10s** 执行一次：
~~~ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('task execute')
  }
}
~~~
在 `TaskModule` 引入 `ArticleModule`：
~~~ts
import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { ArticleModule } from 'src/article/article.module';

@Module({
  imports: [
    ArticleModule
  ],
  providers: [TaskService]
})
export class TaskModule {}
~~~
并且在 `ArticleModule` 导出 `ArticleService`:
~~~ts
import { Module } from 'anestjs/common';
import { ArticleService } from '/article.service'; 
import { ArticleController } from './article.controlller'

@Module({
  controllers: [ArticleController], 
  providers: [ArticleService], 
  exports: [ArticleService]
})
export class ArticleModule {}
~~~
然后在 `TaskService` 里注入 `articleService`：
~~~ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ArticleService } from 'src/article/article.service';

@Injectable()
export class TaskService {

  @Inject(ArticleService)
  private articleService: ArticleService;

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.articleService.flushRedisToDB();
  }
}
~~~
每分钟执行一次，调用 `articleService` 的 `flushRedisToDB` 方法，下面实现下这个方法，先在 `RedisService` 添加一个 `keys` 方法，用来查询 `key`：
~~~ts
async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
}
~~~
然后在 `ArticleService` 里实现同步数据库的逻辑：
~~~ts
async flushRedisToDB() {
    const keys = await this.redisService.keys(`article_*`);
    // 查询出 key 对应的值，更新到数据库。
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      const res = await this.redisService.hashGet(key);

      const [, id] = key.split('_');

      await this.entityManager.update(Article, {
        id: +id
      }, {
        viewCount: +res.viewCount,        
      });
    }
}
~~~
接下来只要把定时任务的执行时间改为 4 点就好了，在 `TaskService` 中修改 `@Cron`：
~~~ts
@Cron(CronExpression.EVERY_DAY_AT_4AM)
~~~
基于 `redis` 的阅读量缓存，以及定时任务更新数据库就完成了。

接下来在用户访问文章的时候在 `redis` 存一个 10 分钟过期的标记，有这个标记的时候阅读量不增加。修改 `view`：
~~~ts
async view(id: number, userId: string) {
  const res = await this.redisService.hashGet(`article_${id}`);
  if (res.viewCount === undefined) {
    const article = await this.findOne(id);
    article.viewCount++;
    await this.entityManager.update(Article, { id }, {
      viewCount: article.viewCount
    });
    await this.redisService.hashSet(`article_${id}`, {
      viewcount: article.viewCount, 
      likeCount: article.likeCount, 
      collectCount: article.collectCount
    });
    await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);  // 设置为 3s 方便测试，可自行修改
    return article.viewCount;
  } else {
    const flag = await this.redisService.get(`user_${userId}_article_${id}`) ;
    if(flag) {
      return res.viewCount;
    }
    await this.redisService.hashSet(`article_${id}`, {
      ...res,
      viewCount: +res.viewCount + 1
    });
    await this.redisService.set(`user_${userId}_article_${id}`, 1, 3);  // 设置为 3s 方便测试，可自行修改
    return +res.viewCount + 1;
  }
}
~~~
在 `ArticleController` 的 `view` 方法里传入下：
~~~ts
@Get(':id/view')
async view(@Param('id') id: string, @Session() session, @Req() req) {
    return await this.articleService.view(+id, session?.user?.id || req.ip);
}
~~~
至此就完成了阅读量统计的功能，可自行测试下。

## Nest 中使用定时任务
新建项目：
~~~shell
nest new schedule-task
~~~
安装定时任务的包：
~~~shell
npm install --save @nestjs/schedule
~~~
在 AppModule 里引入：
~~~ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module ( {
  imports: [
    ScheduleModule.forRoot()
  ], 
  controllers: [AppController], 
  providers: [AppService],
})
export class AppModule {}
~~~
创建 service 模块：
~~~shell
nest g service task --flat --no-spec
~~~
通过 `@Cron` 声明任务执行时间：
~~~ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TaskService {

  @Cron(CronExpression.EVERY_5_SECONDS)
  handleCron() {
    console.log('task execute');
  }
}
~~~
执行 `npm run start:dev` 启动服务，每 5 秒控制台会打印 `task execute`。

也可以注入其他模块的 `service`，新建 aaa 模块：
~~~shell
nest g resource aaa
~~~
导出 AaaService：
~~~ts
import { Module } from '@nestjs/common'; 
import { AaaService } from './aaa.service'; 
import { AaaController } from './aaa.controller'

@Module({
  controllers: [AaaController], 
  providers: [AaaService], 
  exports: [AaaService]
})
export class AaaModule {}
~~~
在 TaskService 注入：
~~~ts
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AaaService } from './aaa/aaa.service';

@Injectable()
export class TaskService {

  @Inject(AaaService)
  private aaaService: AaaService;

  @Cron(CronExpression.EVERY_5_SECONDS, {
    name: "task", // 任务名
    timeZone: "Asia/shanghai" // 时区
  })
  handleCron() {
    console.log('task execute：', this.aaaService.findAll());
  }
}
~~~
这样每 5 秒都会执行 `aaaService` 中的 `findAll` 方法。

`cron` 表达式有这 7 个字段：
字段 | 允许值 | 允许的特殊字符
---|-----|--------
秒( Seconds ) | 0~59的整数 | , - * / 四个字符
分( Minutes ) | 0~59的整数 | , - * / 四个字符
that ( Hours ) | 0~23的整数 | , - * / 四个字符
日期( DavofMonth ) | 1~31的整数( 但是你需要考虑你月的天数 ) | , - * ? / L W C 八个字符
月份( Month ) | 1~12的整教或者 JAN-DEC | , - * / 四个字符
星期( Davorveek ) | 1~7的整数或者 SUN-SAT ( 1=SUN ) | , - * ? / L C ＃ 八个字符
年( 可选，留空 ) ( Year ) | 1970~2099 | , - * / 四个字符

其中**年**是可选的，所以一般都是 6 个。每个字段都可以写 `*` ，比如**秒**写 `*` 就代表每秒都会触发，**日期**写 `*` 就代表每天都会触发。但当你指定了具体的日期的时候，星期得写 `?`， 比如：
~~~shell
7 12 13 10 * ?
~~~
表示每月 10 号的 13:12:07，但这时候你不知道是星期几，如果写 `*` 代表不管哪天都会执行，这时候就要写 `?`，代表忽略星期。同理，指定了星期的时候，日期也可能和它冲突，这时候也要指定 `?`。

指定范围的示例：
~~~shell
0 20-30 * * * *
# 从 20 到 30 的每分钟的第 0 秒都会执行
~~~
指定枚举的示例：
~~~shell
0 5,10 * * * *
# 每小时的第 5 和 第 10 分钟的第 0 秒执行
~~~
指定间隔的示例：
~~~shell
0 5/10 * * * *
# 从第 5 分钟开始，每隔 10 分钟触发一次执行
~~~
L 是 last，L 用在星期的位置就是星期六：
~~~shell
* * * ? * L
~~~
L 用在日期的位置就是每月最后一天：
~~~shell
* * * L * ?
~~~
W 代表工作日 workday，只能用在日期位置，代表从周一到周五：
~~~shell
* * * W * ?
~~~
当你指定 2W 的时候，代表每月的第 2 个工作日：
~~~shell
* * * 2W * ?
~~~
LW 可以在指定日期时连用，代表每月最后一个工作日：
~~~shell
* * * LW * ?
~~~
星期的位置还可以用 `4#3` 表示每个月第 3 周的星期三：
~~~shell
* * * ? * 4#3
~~~
同理，每个月的第二周的星期天就是这样：
~~~shell
* * * ? * 1#2
~~~
::: tip
此外，星期几除了可以用从 1（星期天） 到 7（星期六） 的数字外，还可以用单词的前三个字母：`SUN`, `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`
:::

再来看几个示例：
~~~shell
*/5 * * * * ?
# 每隔 5 秒执行一次
~~~
~~~shell
0 0 5-15 * * ?
# 每天 5-15 点整点触发
~~~
~~~shell
0 0 10,14,16 * * ?
# 每天 10 点、14 点、16 点触发
~~~
~~~shell
0 0 12 ? * WED
# 每个星期三中午12点
~~~
~~~shell
0 0 17 ? * TUES,THUR,SAT
# 每周二、四、六下午五点
~~~
~~~shell
0 0 22 L * ?
# 每月最后一天 22 点执行一次
~~~
~~~shell
0 30 9 ? * 6L 2023-2025 
# 2023 年至 2025 年的每月的最后一个星期五上午 9:30 触发
~~~
~~~shell
0 15 10 ? * 6#3 
# 每月的第三个星期五上午 10:15 触发
~~~

除了使用 `@Cron` 外，我们还可以使用 `@Interval` 指定任务的执行间隔，参数为毫秒值：
~~~ts
@Interval('task2', 500)
task2() {
  console.log('task2');
}
~~~
还可以用 `@Timeout` 指定多长时间后执行一次：
~~~ts
@Timeout('task3', 3000)
task3() {
  console.log('task3');
}
~~~
我们在 `AppModule` 里注入 `SchedulerRegistry`，然后在 `OnApplicationBootstrap` 的声明周期里拿到所有的 `cronJobs` 打印下：
~~~ts
import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule, SchedulerRegistry } from '@nestjs/schedule';
import { TaskService } from './task.service';
import { AaaModule } from './aaa/aaa.module';

@Module ( {
  imports: [
    ScheduleModule.forRoot(),
    AaaModule
  ], 
  controllers: [AppController], 
  providers: [AppService, TaskService],
})
export class AppModule implements OnApplicationBootstrap {
  @Inject(SchedulerRegistry)
  private schedulerRegistry: SchedulerRegistry;

  onApplicationBootstrap() {
    const jobs = this.schedulerRegistry.getCronJobs();
    console.log(jobs);
  }
}
~~~
配置 `vscode` 的 `debug` 调试:

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1456061033.png)

~~~json
{
    // 使用 IntelliSense 了解相关属性。
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "type": "node",
            "request": "launch",
            "name": "debug nest",
            "runtimeExecutable": "npm",
            "args": [
                "run",
                "start:dev"
            ],
            "skipFiles": [
                "<node_internals>/**"
            ],
            "console": "integratedTerminal"
        }
    ]
}
~~~
再在 `console.log(jobs)` 处打上断点，然后点击 `debug` 启动 `name` 为 `debug nest` 的。

自己创建定时任务，需要安装 `cron` 的包：
~~~shell
npm install --save cron
~~~
然后实现下删除定时任务的逻辑：
~~~ts
onApplicationBootstrap() {
  // 获取定时任务队列（job）
  const crons = this.schedulerRegistry.getCronJobs();
  // 遍历定时任务队列（job）
  crons.forEach((item, key) => {
    item.stop();  // 停止定时任务（job）
    this.schedulerRegistry.deleteCronJob(key);  // 删除定时任务（job）
  });
  // 获取定时任务队列（Interval）
  const intervals = this.schedulerRegistry.getIntervals();
  // 遍历定时任务队列（Interval）
  intervals.forEach(item => {
    // 获取定时任务（Interval）
    const interval = this.schedulerRegistry.getInterval(item);
    // 清除定时器（Interval）
    clearInterval(interval);
    // 删除定时任务（Interval）
    this.schedulerRegistry.deleteInterval(item);
  });
  // 获取定时任务队列（Timeout）
  const timeouts = this.schedulerRegistry.getTimeouts();
  // 遍历定时任务队列（Timeout）
  timeouts.forEach(item => {
    // 获取定时任务（Timeout）
    const timeout = this.schedulerRegistry.getTimeout(item);
    // 清除定时器（Timeout）
    clearTimeout(timeout);
    // 删除定时任务（Timeout）
    this.schedulerRegistry.deleteTimeout(item);
  });

  console.log(this.schedulerRegistry.getCronJobs());
  console.log(this.schedulerRegistry.getIntervals());
  console.log(this.schedulerRegistry.getTimeouts());

  // 动态添加任务（job）
  const job = new CronJob(`0/5 * * * * *`, () => {
    console.log('cron job');
  });
  this.schedulerRegistry.addCronJob('job1', job);
  job.start();
  // 动态添加任务（Interval）
  const interval = setInterval(() => {
    console.log('interval job')
  }, 3000);
  this.schedulerRegistry.addInterval('job2', interval);
  // 动态添加任务（Timeout）
  const timeout = setTimeout(() => {
    console.log('timeout job');
  }, 5000);
  this.schedulerRegistry.addTimeout('job3', timeout);
}
~~~
执行 `npm run start:dev`, 在终端可以看到没有之前的定时任务了。新增了动态添加的那几个定时任务。
::: tip
可以看出来 `CronJob` 是基于 `cron` 包封装的，而 `interval` 和 `timeout` 就是用的原生 `api`。
:::

## Nest 中使用 SSE 数据推送
SSE（Server-Sent Events）是一种基于HTTP的服务器推送技术，用于实时从服务器接收事件和数据更新。通过 `SSE`，服务器可以主动向客户端发送持久性连接上的数据，而不需要客户端发起请求。

我们先来看下 `WebSocket` 的通信过程：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/d77dfe73e74d4fac89f8747266c01cd1~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

首先通过 `http` 切换协议，服务端返回 `101` 的状态码后，就代表协议切换成功。之后就是 `WebSocket` 格式数据的通信了，一方可以随时向另一方推送消息。

再来看下 SSE 的通信过程：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/8d99ee4d7ad0471db06cb16280001d77~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

服务端返回的 `Content-Type` 是 `text/event-stream`，这是一个流，可以多次返回内容。`SSE` 就是通过这种消息来随时推送数据。

接下来我们实现一下，新建项目：
~~~shell
npx nest new sse-test
~~~
在 `AppController` 添加一个 `stream` 接口：
~~~ts
@Sse('stream')  // 表示 event stream 类型的接口
stream() {
    return new Observable((observer) => {
      observer.next({ data: { msg: 'aaa'} });

      setTimeout(() => {
        observer.next({ data: { msg: 'bbb'} });
      }, 2000);

      setTimeout(() => {
        observer.next({ data: { msg: 'ccc'} });
      }, 5000);
    });
}
~~~
返回的是一个 `Observable` 对象，然后内部用 `observer.next` 返回消息。可以返回任意的 `json` 数据。

前端代码中添加如下：
~~~ts
// EventSource 是浏览器原生 api，用来获取 sse 接口的响应
const eventSource = new EventSource('http://localhost:3000/stream');
// 接收到的消息回调
eventSource.onmessage = ({ data }) => {
  console.log('New message', JSON.parse(data));
};
~~~
依次启动后端项目和前端项目，可以看到浏览器控制台中打印的 `New message` 信息。
::: tip
注意：`WebSocket` 断连后需要手动重连，而 `SSE` 并不需要，浏览器会自动重连。它的应用场景有很多，比如站内信、构建日志实时展示、chatgpt 的消息返回等等。
:::

## Nest 中实现扫码登录
解析掘金的登录二维码为例：
~~~ts
https://juejin.cn/app?next_url=https%3A%2F%2Fjuejin.cn%2Fpassport%2Fweb%2Fscan_qrcode%2F&qr_source_aid=2608&token=8af414692e05e444e9e115148d4c0bc5_hl
~~~
解析后的链接中有一个`qr_source_aid
`参数，用于标识生成该二维码的具体应用或来源。通过这个参数，掘金可以追踪和记录用户通过不同应用或来源扫描登录二维码的情况。

二维码分别有 5 个状态，用户扫码进行不同的操作就会修改对应的二维码状态，PC网页端会采用**轮询**的方式每隔 1 
秒来获取二维码的最新状态，一般会设定在用户未扫码以及用户扫码后在 1 
分钟内未做任何操作则二维码过期，PC网页端会重新生成新的二维码并继续执行获取二维码的最新状态：
- 未扫描：
  <br/>
  <br/>
  ![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/1672720770.png)
  
  上图中是轮询获取二维码最新状态的内容，`status`字段便是二维码的最新状态。
- 已扫描，等待用户确认:
  <br/>
  <br/>
  ![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/4145762896.png)
  
  这时`status`状态会变成`scanned`，`scan_app_id`代指扫码来源，也就是手机APP端
- 已扫描，用户同意授权:
  <br/>
  <br/>
  ![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2646552216.png)
  
  当用户点击确定授权登录后会将状态改为`confirmed`并将用户信息返回给前端
- 已扫描，用户取消授权:
  <br/>
  <br/>
  ![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/666380194.png)
  
  当用户点击取消后会将状态改为`refused`并将新的二维码信息返回给前端
- 已过期:
  <br/>
  <br/>
  ![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/2444425371.png)
  
  当二维码过期后会将状态改为`expired`并将新的二维码信息返回给前端

**流程图：**

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/qrcode.png)

1. PC网页端初始时会调用`qrcode/get`接口，此接口会生成一个随机的二维码 `id`，存到 `redis` 
里，并返回二维码。
2. 然后会以轮询的策略每隔 1 秒调用`qrcode/check`接口，此接口会返回存储在`redis`中的二维码最新状态。
3. 通过手机APP扫描后，如果APP端未登录会先跳转至登录页，待APP端登录后会跳转至扫码授权登录页。
4. 扫码后APP端获取到二维码解析后的内容，然后调用`qrcode/scan`接口并将来源 `id` 以及 `token` 传递给服务端。此接口会解析 
   `token` 来获取二维码相关信息(如：`qrcode_id`)
   ，然后修改`redis`中存储的二维码状态为`scanned`，此时`qrcode/check`接口轮询获取的最新状态就会变成`scanned`。
5. 当用户在APP端点击取消后会调用`qrcode/cancel`接口，此接口将来源 `id` 以及 `token` 
   传递给服务端，解析 
   `token` 来获取二维码相关信息(如：`qrcode_id`)，然后修改`redis`中存储的二维码状态为`refused`。当PC
   端调用的`qrcode/check`接口获取`redis`中的二维码状态为`refused`时会重新生成新的二维码一并返回给前端。
6. 当用户在APP端点击授权登录后会调用`qrcode/confirm`接口，此接口将来源 `id` 以及 `token` 
   传递给服务端，解析 
   `token` 来获取二维码相关信息(如：`qrcode_id`)
   ，然后修改`redis`中存储的二维码状态为`confirmed`。然后再解析APP端登录认证的`token`从中获取到`user_id
   `去查询出用户信息`user_data`合并到`redis`中存储的二维码状态信息`qrcode-[qrcode_id]`中。
   此时`qrcode/check`接口轮询获取的最新状态就会变成`confirmed`并获取到用户信息`user_data`，然后依据`user_data
   `来生成JWT的`token`，再设置`redirect_url`字段为根路由，然后将这些数据合并后返回给前端，前端判断是`confirmed
   `状态就存储用户信息`user_data`以及登录凭证`token`并重定向至`redirect_url`字段中的路由地址。

::: tip
另外未扫描的初始状态和扫码后都会有一个 1 分钟内未操作则二维码过期的设定，当二维码过期后调用的`qrcode/check
`接口会将二维码状态修改为`expired`并生成新的二维码一并返回给前端。
:::

接下来我们来简易实现一下，首先创建个新项目：
~~~shell
npm install -g @nestjs/cli

nest new qrcode-login
~~~
安装二维码的包：
~~~shell
npm install qrcode @types/qrcode
~~~
引入 `jwt` 的包：
~~~shell
npm install @nestjs/jwt
~~~
在 `AppModule` 里引入它：
~~~ts
imports: [
    JwtModule.register({
      secret: '123456'
    })
]
~~~
在 `app.controller.ts` 添加：
~~~ts
// 引入
import {randomUUID} from 'crypto';
import * as qrcode from 'qrcode';
// 生成二维码之后，要在 redis 里保存一份，这些简化使用map代替存储。
const map = new Map<string, QrCodeInfo>();

// 类型定义
interface QrCodeInfo {
  status: 'new' | 'scanned' | 'confirmed' | 'refused' |
          'expired',
  userInfo?: {
    userId: number;
  }
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Inject(JwtService)
  private jwtService: JwtService;
  
  private users = [
      {id: 1, username: 'dong', password: '111'},
      {id: 2, username: 'guang', password: '222'},
  ];
  // 获取二维码接口
  @Get('qrcode/get')
  async get() {
    // 生成随机的UUID
    const uuid = randomUUID();
    //生成base64格式的二维码, toDataURL()中的参数就是解析二维码后的内容，内容中的页面需前端去实现。
    const dataUrl = await qrcode.toDataURL(`https://gaojianghua.cn/confirm.html?id=${uuid}`);
    // 存储
    map.set(`qrcode_${uuid}`, {
      status: 'new'
    });
    return {
      qrcode_id: uuid,
      img: dataUrl
    }
  }
  // 轮询接口
  @Get('qrcode/check')
  async check(@Query('id') id: string) {
    const info = map.get(`qrcode_${id}`);
    if(info.status === 'confirmed') {
        return {
          token: await this.jwtService.sign({
            userId: info.userInfo.userId
          }),
          ...info
        }
    }
    return info;
  }
  // 扫码接口
  @Get('qrcode/scan')
  async scan(@Query('id') id: string) {
      const info = map.get(`qrcode_${id}`);
      if(!info) {
        throw new BadRequestException('二维码已过期');
      }
      info.status = 'scanned';
      return 'success';
  }
  // 授权登录接口
  @Get('qrcode/confirm')
  async confirm(@Query('id') id: string, @Headers('Authorization') auth: string) {
    let user;
    try{
      const [, token] = auth.split(' ');
      const info = await this.jwtService.verify(token);

      user = this.users.find(item => item.id == info.userId);
    } catch(e) {
      throw new UnauthorizedException('token 过期，请重新登录');
    }

    const info = map.get(`qrcode_${id}`);
    if(!info) {
      throw new BadRequestException('二维码已过期');
    }
    info.status = 'confirmed';
    info.userInfo = user;
    return 'success';
  }
  // 取消接口
  @Get('qrcode/cancel')
  async cancel(@Query('id') id: string) {
      const info = map.get(`qrcode_${id}`);
      if(!info) {
        throw new BadRequestException('二维码已过期');
      }
      info.status = 'refused';
      return 'success';
  }
  // App端登录接口
  @Get('login')
  async login(@Query('username') username: string, @Query('password') password: string) {

    const user = this.users.find(item => item.username === username);

    if(!user) {
      throw new UnauthorizedException('用户不存在');
    }
    if(user.password !== password) {
      throw new UnauthorizedException('密码错误');
    }

    return {
      token: await this.jwtService.sign({
        userId: user.id
      })
    }
  }
}
~~~
::: tip
前端的代码实现有兴趣的同学可以自行去实现，这样我们就实现了扫码登录。
:::

## Nest 中使用 REPL 模式
新建项目：
~~~shell
nest new repl-test
~~~
创建两个模块：
~~~shell
nest g resource aaa
nest g resource bbb
~~~
在 `src` 下创建个 `repl.ts`，写入如下内容：
~~~ts
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  await repl(AppModule);
}
bootstrap();
~~~
启动项目：
~~~shell
npm run start:dev -- --entryFile repl
~~~
这里的 `--entryFile` 是指定入口文件是 `repl.ts`，前面带了个 `--` 是指后面的参数不是传给 `npm run start:dev` 的，要原封不动保留。也就是会传给 `nest start`，当然，你直接执行 `nest start` 也可以：
~~~shell
nest start --watch --entryFile repl
~~~
测试 `controller` 的话，`repl` 的方式是有一些限制的，它只是单纯的传参调用这个函数，不会解析装饰器。

执行 `debug()`，会打印所有的 `module` 和 `module` 下的 `controllers` 和 `providers`。

`methods()` 可以查看某个 `controller` 或者 `provider` 的方法。

`get()` 或者 `$()` 可以拿到某个 `controller` 或者 `provider` 调用它的方法。

要保留命令历史可以改一下 repl.ts：
~~~ts
import { repl } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const replServer = await repl(AppModule);
    replServer.setupHistory(".nestjs_repl_history", (err) => {
        if (err) {
            console.error(err);
        }
    });
}
bootstrap();
~~~
## Nest 中实现地理位置的附近功能
在我们日常生活中会使用到寻找附近司机，附近充电宝，附近餐厅，附近旅馆，附近酒店等等。那么我可以使用 `redis` 的 `GEO` 能力来实现这个功能。

接下来用代码实现下。创建个 `nest` 项目：
~~~shell
npm install g @nestjs/cli

nest new nearby-search
~~~
安装 `redis` 包：
~~~shell
npm install --save redis
~~~
创建 `redis` 模块和 `service`：
~~~shell
nest g module redis
nest g service redis
~~~
在 `RedisModule` 创建连接 `redis` 的 `provider`，导出 `RedisService`：
~~~ts
import { Module } from '@nestjs/common';
import { createClient } from 'redis';
import { RedisService } from './redis.service';

@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
~~~
然后在 `RedisService` 里注入 `REDIS_CLIENT`，并封装一些操作 `redis` 的方法：
~~~ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

  @Inject('REDIS_CLIENT') 
  private redisClient: RedisClientType;
  // 添加位置信息
  async geoAdd(key: string, posName: string, posLoc: [number, number]) {
      return await this.redisClient.geoAdd(key, {
          longitude: posLoc[0],
          latitude: posLoc[1],
          member: posName
      })
  }
  // 获取指定位置信息
  async geoPos(key: string, posName: string) {
    const res = await this.redisClient.geoPos(key, posName);

    return {
      name: posName,
      longitude: res[0].longitude,
      latitude: res[0].latitude
    }
  }
  // 获取位置信息列表
  async geoList(key: string) {
    // 因为 geo 信息底层使用 zset 存储的，所以查询所有的 key 使用 zrange。
    // zset 是有序列表，列表项会有一个分数，zrange 是返回某个分数段的 key，传入 0、-1 就是返回所有的。
    const positions = await this.redisClient.zRange(key, 0, -1);

    const list = [];
    for(let i = 0; i < positions.length; i++) {
      const pos = positions[i];
      const res = await this.geoPos(key, pos);
      list.push(res);
    }
    return list;
  }
  // 搜索附近的点
  async geoSearch(key: string, pos: [number, number], radius: number) {
    // 先用 geoRadius 搜索半径内的点，然后再用 geoPos 拿到点的经纬度返回。
    const positions = await this.redisClient.geoRadius(key, {
        longitude: pos[0],
        latitude: pos[1]
    }, radius, 'km');

    const list = [];
    for(let i = 0; i < positions.length; i++) {
        const pos = positions[i];
        const res = await this.geoPos(key, pos);
        list.push(res);
    }
    return list;
  }
}
~~~
在 `AppController` 里注入 `RedisService`，然后添加一个路由：
~~~ts
import { BadRequestException, Controller, Get, Inject, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { RedisService } from './redis/redis.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Inject(RedisService)
  private redisService: RedisService;
  // 添加位置信息
  @Get('addPos')
  async addPos(
    @Query('name') posName: string,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number
  ) {
    if(!posName || !longitude || !latitude) {
      throw new BadRequestException('位置信息不全');
    }
    try {
      await this.redisService.geoAdd('positions', posName, [longitude, latitude]);
    } catch(e) {
      throw new BadRequestException(e.message);
    }
    return {
      message: '添加成功',
      statusCode: 200
    }
  }
  // 获取位置信息列表
  @Get('allPos')
  async allPos() {
      return this.redisService.geoList('positions');
  }
  // 获取指定位置信息
  @Get('pos')
  async pos(@Query('name') name: string) {
      return this.redisService.geoPos('positions', name);
  }
  // 搜索附近的点
  @Get('nearbySearch')
  async nearbySearch(
      @Query('longitude') longitude: number,
      @Query('latitude') latitude: number,
      @Query('radius') radius: number
  ) {
    if(!longitude || !latitude) {
      throw new BadRequestException('缺少位置信息');
    }
    if(!radius) {
      throw new BadRequestException('缺少搜索半径');
    }

    return this.redisService.geoSearch('positions', [longitude, latitude], radius);
  }
}
~~~
在 `main.ts` 指定 `public` 目录为静态文件的目录：
~~~ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets('public');

  await app.listen(3000);
}
bootstrap();
~~~
接下来要接入高德地图。创建新应用，选择 `web` 应用，就可以生成 `key` 了。

然后创建 `public/index.html`:
~~~html
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no, width=device-width">
    <title>附近的充电宝</title>
  <link rel="stylesheet" href="https://a.amap.com/jsapi_demos/static/demo-center/css/demo-center.css" />
    <script src="https://cache.amap.com/lbs/static/es5.min.js"></script>
    <script type="text/javascript" src="https://cache.amap.com/lbs/static/addToolbar.js"></script>
    <style>
        html,
        body,
        #container {
          width: 100%;
          height: 100%;
        }
        
        label {
            width: 55px;
            height: 26px;
            line-height: 26px;
            margin-bottom: 0;
        }
        button.btn {
            width: 80px;
        }
    </style>
</head>
<body>
<div id="container"></div>
<script src="https://webapi.amap.com/maps?v=2.0&key=f96fa52474cedb7477302d4163b3aa09"></script>
<script src="https://unpkg.com/axios@1.5.1/dist/axios.min.js"></script>
<script>

    const radius = 0.2;

    axios.get('/nearbySearch', {
        params: {
            longitude: 116.397444,
            latitude: 39.909183,
            radius
        }
    }).then(res => {
        const data = res.data;

        var map = new AMap.Map('container', {
            resizeEnable: true,
            zoom: 6,
            center: [116.397444, 39.909183]
        });

        data.forEach(item => {
            var marker = new AMap.Marker({
                icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
                position: [item.longitude, item.latitude],
                anchor: 'bottom-center'
            });
            map.add(marker);
        });


        var circle = new AMap.Circle({
            center: new AMap.LngLat(116.397444, 39.909183), // 圆心位置
            radius: radius * 1000,
            strokeColor: "#F33",  //线颜色
            strokeOpacity: 1,  //线透明度
            strokeWeight: 3,  //线粗细度
            fillColor: "#ee2200",  //填充颜色
            fillOpacity: 0.35 //填充透明度
        });

        map.add(circle);
        map.setFitView();
    })
        
</script>
</body>
</html>
~~~
## 会议室预订系统
首先，用户分为普通用户和管理员两种，各自有不同的功能：
- **普通用户**：可以注册，注册的时候会发邮件来验证身份，注册之后就可以登录系统。
- **管理员用户**：账号密码是内置的，不需要注册。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/906d4fbf82004b8d98db97b4fcf85086~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

普通用户可以查看会议室列表、搜索可用会议室、提交预订申请、取消预订、查看预订历史等。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/9596890a69e44ce7956ad0667e000468~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

普通用户预订成功会邮件通知(注册时的邮箱)，如果管理员一直没审批，可以催办。

管理员可以查看用户列表、冻结用户、会议室列表、搜索会议室、添加/修改/删除会议室、审批预订申请、查看会议室统计信息等。

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/e4d405db23da46e2982f7b4404c2125a~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

整体分为用户管理、会议室管理、预订管理、统计这 4 部分。
- 如果超过 10 分钟没审批，会发送邮件提醒管理员，如果超过半个小时没审批，会发送短信。
- 管理员可以解除用户的预订，释放会议室。
- 冻结用户是指把用户设置为冻结状态，冻结状态的用户不能预订会议室。
- 统计模块会按照会议室维度和用户维度进行统计，并报表展示。

### 数据库设计
首先是用户表 `users`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | 用户ID
username | VARCHAR(50) | 用户名
password | VARCHAR(50) | 密码
nick_name | VARCHAR(50) | 昵称
email | VARCHAR(50) | 邮箱
head_pic | VARCHAR(100) | 头像
phone_number | VARCHAR(20) | 手机号
is_frozen | BOOLEAN | 是否被冻结
is_admin | BOOLEAN | 是否是管理员
create_time | DATETIME | 创建时间
update_time | DATETIME | 更新时间

会议室表 `meeting_rooms`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | 会议室ID
name | VARCHAR(50) | 会议室名字
capacity | INT | 会议室容量
location | VARCHAR(50) | 会议室位置
equipment | VARCHAR(50) | 设备
description | VARCHAR(100) | 描述
is_booked | BOOLEAN | 是否被预订
create_time | DATETIME | 创建时间
update_time | DATETIME | 更新时间

预订表 `bookings`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | 预订ID
user_id | INT | 预订用户ID
room_id | INT | 会议室ID
start_time | DATETIME | 会议开始时间
end_time | DATETIME | 会议结束时间
status | VARCHAR(20) | 状态（申请中、审批通过、审批驳回、已解除）
note | VARCHAR(100) | 备注
create_time | DATETIME | 创建时间
update_time | DATETIME | 更新时间

预订-参会人表 `booking_attendees`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | ID
user_id | INT | 参会用户ID
booking_id | INT | 预订ID

表关系图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/fb13cbbd6dda4c8e95e46aeea52b21c5~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

角色表 `roles`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | ID
name | VARCHAR(20) | 角色名

权限表 `permissions`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | ID
code | VARCHAR(20) | 权限代码
description | VARCHAR(100) | 权限描述

用户-角色中间表 `user_roles`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | ID
user_id | INT | 用户 ID
role_id | INT | 角色 ID

角色-权限中间表 `role_permissions`：

字段名 | 数据类型 | 描述
----|------|---
id | INT | ID
role_id | INT | 角色 ID
permission_id | INT | 权限 ID

表关系图：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/698725b25d9843af8e5f41691830054e~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### 模块划分
首先是用户模块，实现普通用户和管理员的登录、注册、信息修改的功能：

接口路径 | 请求方式 | 描述
-----|------|---
/user/login | POST | 普通用户登录
/user/register | POST | 普通用户注册
/user/update | POST | 普通用户个人信息修改
/user/update_password | POST | 普通用户修改密码
/user/admin/login | POST | 管理员登录
/user/admin/update_password | POST | 管理员修改密码
/user/admin/update | POST | 管理员个人信息修改
/user/list | GET | 用户列表
/user/freeze | GET | 冻结用户

会议室管理模块：

接口路径 | 请求方式 | 描述
-----|------|---
/meeting_room/list | GET | 会议室列表
/meeting_room/delete/:id | DELETE | 会议室删除
/meeting_room/update/:id | PUT | 会议室更新
/meeting_room/create | POST | 会议室新增
/meeting_room/search | GET | 会议室搜索

预订管理模块：

接口路径 | 请求方式 | 描述
-----|------|---
/booking/list | GET | 预订列表
/booking/approve | POST | 审批预订申请
/booking/add_booking | POST | 申请预订
/booking/cancel_booking/:id | GET | 取消预订
/booking/unbind_booking/:id | GET | 解除预订
/booking/create | POST | 会议室新增
/booking/search | GET | 会议室搜索
/booking/history | GET | 预订历史
/booking/urge | POST | 催办

统计模块：

接口路径 | 请求方式 | 描述
-----|------|---
/statistics/meeting_room_usage_frequency | GET | 会议室使用频率统计
/statistics/user_booking_frequency | GET | 用户预订频率统计

### 角色划分
权限控制使用 **RBAC** 的方式，有普通用户和管理员两个角色。

### 用户管理模块--用户注册
新建项目
~~~shell
nest new meeting_room_booking_system_backend
~~~
安装 `typeorm` 相关的包：
~~~shell
npm install --save @nestjs/typeorm typeorm mysql2
~~~
在 `AppModule` 引入 `TypeOrmModule`：
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "meeting_room_booking_system",
      synchronize: true,
      logging: true,
      entities: [],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
创建这个 `database`：
~~~sql
CREATE DATABASE meeting_room_booking_system DEFAULT CHARACTER SET utf8mb4;
~~~
先在 `nest-cli.json` 里添加 `generateOptions`，设置 `spec` 为 `false`:
~~~json
{
  "$schema": "https: //json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "generateOptions":{
    "spec": false
  },
  "sourceRoot": "src",
  "compilerOptions": {
    "deleteOutDir": true
  }
}
~~~
这样生成代码的时候不会生成测试代码，和 `nest g xxx --no-spec` 效果一样

生成 `user` 模块：
~~~shell
nest g resource user
~~~
添加个 `src/user/entities` 目录，新建 3 个实体 `User`、`Role`、`Permission`。
~~~ts
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from "./role.entity";

@Entity({
    name: 'users'
})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50,
        comment: '用户名'
    })
    username: string;

    @Column({
        length: 50,
        comment: '密码'
    })
    password: string;

    @Column({
        name: 'nick_name',
        length: 50,
        comment: '昵称'
    })
    nickName: string;


    @Column({
        comment: '邮箱',
        length: 50
    })
    email: string;


    @Column({
        comment: '头像',
        length: 100,
        nullable: true
    })
    headPic: string;

    @Column({
        comment: '手机号',
        length: 20,
        nullable: true
    })
    phoneNumber: string;

    @Column({
        comment: '是否冻结',
        default: false
    })
    isFrozen: boolean;

    @Column({
        comment: '是否是管理员',
        default: false
    })
    isAdmin: boolean;

    @CreateDateColumn()
    createTime: Date;

    @UpdateDateColumn()
    updateTime: Date;

    @ManyToMany(() => Role)
    @JoinTable({
        name: 'user_roles'
    })
    roles: Role[] 
}
~~~
~~~ts
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Permission } from "./permission.entity";

@Entity({
    name: 'roles'
})
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        comment: '角色名'
    })
    name: string;

    @ManyToMany(() => Permission)
    @JoinTable({
        name: 'role_permissions'
    })
    permissions: Permission[] 
}
~~~
~~~ts
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'permissions'
})
export class Permission {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 20,
        comment: '权限代码'
    })
    code: string;

    @Column({
        length: 100,
        comment: '权限描述'
    })
    description: string;
}
~~~
在 `AppModule` 引入 `UserModule`, `User`, `Role`, `Permission`
~~~ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Role } from './user/entities/role.entity'
import { User } from './user/entities/User.entity'
import { Permission } from './user/entities/Permission.entity'
import { UserModule } from './user/user.module'

@Module({
  imports: [ 
    UserModule,
    TypeOrmModule.forRoot({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "guang",
      database: "meeting_room_booking_system",
      synchronize: true,
      logging: true,
      entities: [
        User, Role, Permission
      ],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
~~~
启动项目：
~~~shell
npm run start:dev
~~~
::: tip
注意：`mysql` 里没有 `boolean` 类型，使用 `TINYINT` 实现的，用 1、0 存储 `true`、`false`。
`typeorm` 会自动把它映射成 `true`、`false`。
:::
实现注册，在 `UserController` 增加一个 `post` 接口：
~~~ts
@Post('register')
register(@Body() registerUser: RegisterUserDto) {
    console.log(registerUser);
    return "success"
}
~~~
创建 `RegisterUserDto`：
~~~ts
export class RegisterUserDto {

    username: string;
    
    nickName: string;
    
    password: string;
    
    email: string;
    
    captcha: string;
}
~~~
安装 `ValidationPipe` 用到的包：
~~~shell
npm install --save class-validator class-transformer
~~~
全局启用 `ValidationPipe`：
~~~ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from 'anestjs/core';
import { AppModule } from ' ./app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes (new ValidationPipe ());
  await app. listen (3000);
}
bootstrap ();
~~~
加一下校验规则：
~~~ts
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsNotEmpty({
        message: "用户名不能为空"
    })
    username: string;
    
    @IsNotEmpty({
        message: '昵称不能为空'
    })
    nickName: string;
    
    @IsNotEmpty({
        message: '密码不能为空'
    })
    @MinLength(6, {
        message: '密码不能少于 6 位'
    })
    password: string;
    
    @IsNotEmpty({
        message: '邮箱不能为空'
    })
    @IsEmail({}, {
        message: '不是合法的邮箱格式'
    })
    email: string;
    
    @IsNotEmpty({
        message: '验证码不能为空'
    })
    captcha: string;
}
~~~
在 `userService` 里添加 `register` 方法：
~~~ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { md5 } from 'src/utils';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
    private logger = new Logger();

    @InjectRepository(User)
    private userRepository: Repository<User>;

    async register(user: RegisterUserDto) {
        
    }
}
~~~
创建 `logger` 对象，注入 `Repository<User>`。

这里注入 `Repository` 需要在 `UserModule` 里引入下 `TypeOrm.forFeature`：
~~~ts
import { Module } from '@nestjs/common';
import { UserService } from ' ./user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User])
  ],
  controllers: [UserController], 
  providers: [UserServicel]
})
export class UserModule {}
~~~
封装个 `redis` 模块：
~~~shell
nest g module redis
nest g service redis
~~~
安装 `redis` 的包：
~~~shell
npm install --save redis
~~~
添加连接 `redis` 的 `provider`：
~~~ts
import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            },
            database: 1
        });
        await client.connect();
        return client;
      }
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
~~~
这里用 `@Global()` 把它声明为全局模块，这样只需要在 `AppModule` 里引入，别的模块不用引入也可以注入 `RedisService` 了。

然后写下 `RedisService`：
~~~ts
import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {

    @Inject('REDIS_CLIENT') 
    private redisClient: RedisClientType;

    async get(key: string) {
        return await this.redisClient.get(key);
    }

    async set(key: string, value: string | number, ttl?: number) {
        await this.redisClient.set(key, value);

        if(ttl) {
            await this.redisClient.expire(key, ttl);
        }
    }
}
~~~
注入 `redisClient`，实现 `get`、`set` 方法，`set` 方法支持指定过期时间。

然后回过头来继续实现 `register` 方法：
~~~ts
@Inject(RedisService)
private redisService: RedisService;

async register(user: RegisterUserDto) {
    const captcha = await this.redisService.get(`captcha_${user.email}`);

    if(!captcha) {
        throw new HttpException('验证码已失效', HttpStatus.BAD_REQUEST);
    }

    if(user.captcha !== captcha) {
        throw new HttpException('验证码不正确', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.userRepository.findOneBy({
      username: user.username
    });

    if(foundUser) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser = new User();
    newUser.username = user.username;
    newUser.password = md5(user.password);
    newUser.email = user.email;
    newUser.nickName = user.nickName;

    try {
      await this.userRepository.save(newUser);
      return '注册成功';
    } catch(e) {
      this.logger.error(e, UserService);
      return '注册失败';
    }
}
~~~
`md5` 方法放在 `src/utils.ts` 里，用 `node` 内置的 `crypto` 包实现:
~~~ts
import * as crypto from 'crypto';

export function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}
~~~
在 `controller` 里调用下：
~~~ts
@Post('register')
async register(@Body() registerUser: RegisterUserDto) {    
    return await this.userService.register(registerUser);
}
~~~
创建个 `email` 模块：
~~~shell
nest g resource email
~~~
安装发送邮件用的包：
~~~shell
npm install nodemailer --save
~~~
在 `EmailService` 里实现 `sendMail` 方法:
~~~ts
import { Injectable } from '@nestjs/common';
import { createTransport, Transporter} from 'nodemailer';

@Injectable()
export class EmailService {

    transporter: Transporter
    
    constructor() {
      this.transporter = createTransport({
          host: "smtp.qq.com",
          port: 587,
          secure: false,
          auth: {
              user: '你的邮箱地址',
              pass: '你的授权码'
          },
      });
    }

    async sendMail({ to, subject, html }) {
      await this.transporter.sendMail({
        from: {
          name: '会议室预定系统',
          address: '你的邮箱地址'
        },
        to,
        subject,
        html
      });
    }
}
~~~
把 `EmailModule` 声明为全局的，并且导出 `EmailService`：
~~~ts
import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';

@Global()
@Module({
  controllers: [EmailControllerl], 
  providers: [EmailServicel], 
  exports: [EmailService]
})
export class EmailModule {}
~~~
然后在 `UserController` 里添加一个 `get` 接口：
~~~ts
@Inject(EmailService)
private emailService: EmailService;

@Inject(RedisService)
private redisService: RedisService;

@Get('register-captcha')
async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2,8);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`
    });
    return '发送成功';
}
~~~
到这里就完成了整个注册功能，可以进行测试下，注册的流程如下：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/d91b2715c99c4e699f00087a3fa9ca89~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

### 用户管理模块--配置抽离、登录认证鉴权
实现登录认证鉴权之前，我们先抽离下配置，安装 `config` 的包：
~~~shell
npm install --save @nestjs/config
~~~
在 `AppModule` 的 `imports` 中引入下：
~~~ts
ConfigModule.forRoot({
  isGlobal: true,   // 设为全局模块
  envFilePath: 'src/.env'   // 指定 env 文件地址
})
~~~
在 `src` 下添加 `.env` 文件：
~~~shell
redis_server_host=localhost
redis_server_port=3306
~~~
在 `RedisModule` 里注入 `ConfigService` 来读取配置：
~~~ts
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            },
            database: 1
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService]
    }
  ],
  exports: [RedisService]
})
export class RedisModule {}
~~~
在 `.env` 里添加 `redis`、`mysql`、`nodemailer` 和 `nest` 服务的配置：
~~~shell
# redis 相关配置
redis_server_host=localhost
redis_server_port=6379
redis_server_db=1

# nodemailer 相关配置
nodemailer_host=smtp.qq.com
nodemailer_port=587
nodemailer_auth_user=你的邮箱
nodemailer_auth_pass=你的授权码

# mysql 相关配置
mysql_server_host=localhost
mysql_server_port=3306
mysql_server_username=root
mysql_server_password=123456
mysql_server_database=meeting_room_booking_system

# nest 服务配置
nest_server_port=3000
~~~
修改 `main.ts`：
~~~ts
import { ConfigService } from '@nestjs/config';
// ...
const configService = app.get(ConfigService);
await app.listen(configService.get('nest_server_port'));
~~~
修改 `EmailService`：
~~~ts
constructor(private configService: ConfigService) {
    this.transporter = createTransport({
        host: this.configService.get('nodemailer_host'),
        port: this.configService.get('nodemailer_port'),
        secure: false,
        auth: {
            user: this.configService.get('nodemailer_auth_user'),  // 发件人邮箱
            pass: this.configService.get('nodemailer_auth_pass')   // 发件人邮箱授权码
        },
    });
}

async sendMail({ to, subject, html }) {
  await this.transporter.sendMail({
    from: {
      name: '会议室预定系统',
      address: this.configService.get('nodemailer_auth_user')
    },
    to,
    subject,
    html
  });
}
~~~
修改 `RedisModule`：
~~~ts
{
  provide: 'REDIS_CLIENT',
  async useFactory(configService: ConfigService) {
    const client = createClient({
        socket: {
            host: configService.get('redis_server_host'),
            port: configService.get('redis_server_port')
        },
        database: configService.get('redis_server_db')
    });
    await client.connect();
    return client;
  },
  inject: [ConfigService]
}
~~~
修改 `AppModule`：
~~~ts
TypeOrmModule.forRootAsync({
  useFactory(configService: ConfigService) {
    return {
      type: "mysql",
      host: configService.get('mysql_server_host'),
      port: configService.get('mysql_server_port'),
      username: configService.get('mysql_server_username'),
      password: configService.get('mysql_server_password'),
      database: configService.get('mysql_server_database'),
      synchronize: true,
      logging: true,
      entities: [
        User, Role, Permission
      ],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
          authPlugin: 'sha256_password',
      }
    }
  },
  inject: [ConfigService]
})
~~~

接下来继续实现登录功能。我们先初始化用户、角色、权限的数据。在 `UserService` 注入 `Role` 和 `Permission` 的 `Repository`：
~~~ts
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity' 
import { User } from './entities/user.entity'; 
import { Role } from './entities/role.entity';

@Module ({
  imports: [
    TypeOrmModule.forfeature([User, Role, Permission])
  ], 
  controllers: [UserController], 
  providers: [UserService]
})
export class UserModule {}
~~~
~~~ts
// user.service.ts
@Injectable()
export class UserService {
  private logger = new Logger();
  
  @InjectRepository(User)
  private userRepository: Repository<User>;
  
  @InjectRepository(Role)
  private roleRepository: Repository<Role>;
  
  @InjectRepository(Permission)
  private permissionRepository: Repository<Permission>;
}
~~~
写个初始化数据的方法：
~~~ts
// user.service.ts
async initData() {
  const user1 = new User();
  user1.username = "zhangsan";
  user1.password = md5("111111");
  user1.email = "xxx@xx.com";
  user1.isAdmin = true;
  user1.nickName = '张三';
  user1.phoneNumber = '13233323333';

  const user2 = new User();
  user2.username = 'lisi';
  user2.password = md5("222222");
  user2.email = "yy@yy.com";
  user2.nickName = '李四';

  const role1 = new Role();
  role1.name = '管理员';

  const role2 = new Role();
  role2.name = '普通用户';

  const permission1 = new Permission();
  permission1.code = 'ccc';
  permission1.description = '访问 ccc 接口';

  const permission2 = new Permission();
  permission2.code = 'ddd';
  permission2.description = '访问 ddd 接口';

  user1.roles = [role1];
  user2.roles = [role2];

  role1.permissions = [permission1, permission2];
  role2.permissions = [permission1];

  await this.permissionRepository.save([permission1, permission2]);
  await this.roleRepository.save([role1, role2]);
  await this.userRepository.save([user1, user2]);
}
~~~
然后在 `UserController` 添加个 `handler`：
~~~ts
@Get("init-data") 
async initData() {
  await this.userService.initData();
  return 'done';
}
~~~
在浏览器中访问这个接口，查看数据库可以发现数据都插入成功了。
::: tip
注意：开发环境可以用代码来初始化数据，然后把数据导出为 `sql`，生产环境可以用这个 `sql` 文件来初始化。
:::

接下来实现登录，在 `UserController` 添加两个接口：
~~~ts
@Post('login')
async userLogin(@Body() loginUser: LoginUserDto) {
  console.log(loginUser);
  return 'success';
}

@Post('admin/login')
async adminLogin(@Body() loginUser: LoginUserDto) {
  console.log(loginUser);
  return 'success';
}
~~~
添加 `src/user/dto/login-user.dto.ts`：
~~~ts
import { IsNotEmpty } from "class-validator";

export class LoginUserDto {

  @IsNotEmpty({
      message: "用户名不能为空"
  })
  username: string;
  
  @IsNotEmpty({
      message: '密码不能为空'
  })
  password: string;    
}
~~~
创建 `src/user/vo/login-user.vo.ts`：
~~~ts
interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  isAdmin: boolean;

  createTime: number;

  roles: string[];

  permissions: string[]
}
export class LoginUserVo {

  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}
~~~
然后在 `UserService` 实现 `login` 方法：
~~~ts
async login(loginUserDto: LoginUserDto, isAdmin: boolean) {
  const user = await this.userRepository.findOne({
    where: {
        username: loginUserDto.username,
        isAdmin
    },
    relations: [ 'roles', 'roles.permissions']
  });

  if(!user) {
    throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
  }

  if(user.password !== md5(loginUserDto.password)) {
    throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
  }

  const vo = new LoginUserVo();
  vo.userInfo = {
    id: user.id,
    username: user.username,
    nickName: user.nickName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    headPic: user.headPic,
    createTime: user.createTime.getTime(),
    isFrozen: user.isFrozen,
    isAdmin: user.isAdmin,
    roles: user.roles.map(item => item.name),
    permissions: user.roles.reduce((arr, item) => {
      item.permissions.forEach(permission => {
        if(arr.indexOf(permission) === -1) {
            arr.push(permission);
        }
      })
      return arr;
    }, [])
  }
  return vo;
}
// 根据 username 和 isAdmin 查询数据库，设置级联查询 roles 和 roles.permissions。
// 如果没有找到用户，返回 400 响应提示用户不存在。
// 如果密码不对，返回 400 响应，提示密码错误。
~~~
在 `UserController` 里调用下：
~~~ts
@Post('login')
async userLogin(@Body() loginUser: LoginUserDto) {
  const vo = await this.userService.login(loginUser, false);

  return vo;
}

@Post('admin/login')
async adminLogin(@Body() loginUser: LoginUserDto) {
  const vo = await this.userService.login(loginUser, true);

  return vo;
}
~~~
引入 `jwt` 模块：
~~~shell
npm install --save @nestjs/jwt
~~~
在 `AppModule` 里引入：
~~~ts
import { JwtModule } from '@nestjs/jwt'

// 在 imports 中加入
JwtModule.registerAsync({
  global: true,
  useFactory(configService: ConfigService) {
    return {
      secret: configService.get('jwt_secret'),
      signOptions: {
        expiresIn: '30m' // 默认 30 分钟
      }
    }
  },
  inject: [ConfigService]
}),
~~~
在 .env 中添加：
~~~shell
# jwt 配置
jwt_secret=guang
jwt_access_token_expires_time=30m
jwt_refresh_token_expres_time=7d
~~~
然后登录认证通过之后返回 `access_token` 和 `refresh_token`：
~~~ts
@Inject(JwtService)
private jwtService: JwtService;

@Inject(ConfigService)
private configService: ConfigService;

@Post('login')
async userLogin(@Body() loginUser: LoginUserDto) {
  const vo = await this.userService.login(loginUser, false);

  vo.accessToken = this.jwtService.sign({
    userId: vo.userInfo.id,
    username: vo.userInfo.username,
    roles: vo.userInfo.roles,
    permissions: vo.userInfo.permissions
  }, {
    expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
  });

  vo.refreshToken = this.jwtService.sign({
    userId: vo.userInfo.id
  }, {
    expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
  });

  return vo;
}
~~~
另一个接口同样的处理。然后再增加一个 `refresh_token` 的接口用来刷新 `token`：
~~~ts
@Get('refresh')
async refresh(@Query('refreshToken') refreshToken: string) {
  try {
    const data = this.jwtService.verify(refreshToken);

    const user = await this.userService.findUserById(data.userId, false);

    const access_token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    const refresh_token = this.jwtService.sign({
      userId: user.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return {
      access_token,
      refresh_token
    }
  } catch(e) {
    throw new UnauthorizedException('token 已失效，请重新登录');
  }
}
~~~
在 `UserService` 实现这个 `findUserById` 方法：
~~~ts
async findUserById(userId: number, isAdmin: boolean) {
  const user =  await this.userRepository.findOne({
    where: {
        id: userId,
        isAdmin
    },
    relations: [ 'roles', 'roles.permissions']
  });

  return {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin,
    roles: user.roles.map(item => item.name),
    permissions: user.roles.reduce((arr, item) => {
      item.permissions.forEach(permission => {
        if(arr.indexOf(permission) === -1) {
            arr.push(permission);
        }
      })
      return arr;
    }, [])
  }
}
~~~
同样的方式再实现一个后台管理的 `refresh` 接口：
~~~ts
@Get('admin/refresh')
async adminRefresh(@Query('refreshToken') refreshToken: string) {
  try {
    const data = this.jwtService.verify(refreshToken);

    const user = await this.userService.findUserById(data.userId, true);

    const access_token = this.jwtService.sign({
      userId: user.id,
      username: user.username,
      roles: user.roles,
      permissions: user.permissions
    }, {
      expiresIn: this.configService.get('jwt_access_token_expires_time') || '30m'
    });

    const refresh_token = this.jwtService.sign({
      userId: user.id
    }, {
      expiresIn: this.configService.get('jwt_refresh_token_expres_time') || '7d'
    });

    return {
      access_token,
      refresh_token
    }
  } catch(e) {
    throw new UnauthorizedException('token 已失效，请重新登录');
  }
}
~~~
接下来我们加上 `LoginGuard` 和 `PermissionGuard` 来做鉴权：

![](https://technical-site.oss-cn-hangzhou.aliyuncs.com/a363d08394dc4a5ab4a0d7d17aafc0c2~tplv-k3u1fbpfcp-jj-mark_1512_0_0_0_q75.webp)

~~~shell
nest g guard login --flat --no-spec
nest g guard permission --flat --no-spec
~~~
`LoginGuard` 的实现代码如下：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Permission } from './user/entities/permission.entity';

interface JwtUserData {
  userId: number;
  username: string;
  roles: string[];
  permissions: Permission[]
}

declare module 'express' {
  interface Request {
    user: JwtUserData
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    
    const requireLogin = this.reflector.getAllAndOverride('require-login', [
      context.getClass(),
      context.getHandler()
    ]);


    if(!requireLogin) {
      return true;
    }
    
    const authorization = request.headers.authorization;

    if(!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try{
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
        roles: data.roles,
        permissions: data.permissions
      }
      return true;
    } catch(e) {
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
~~~
用 `reflector` 从目标 `controller` 和 `handler` 上拿到 `require-login` 的 `metadata`。如果没有 `metadata`，就是不需要登录，返回 `true` 放行。否则从 `authorization` 的 `header` 取出 `jwt` 来，把用户信息设置到 `request`，然后放行。如果 `jwt` 无效，返回 `401` 响应，提示 `token` 失效，请重新登录。

然后全局启用这个 `Guard`，在 `AppModule` 里添加这个 `provider`：
~~~ts
import { APP_GUARD } from '@nestjs/core'
import { LoginGuard } from './login.guard'

// providers 中添加
{
  provide: APP_GUARD,
  useClass: LoginGuard
}
~~~
继续实现 `PermissionGuard`：
~~~ts
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class PermissionGuard implements CanActivate {

  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if(!request.user) {
      return true;
    }

    const permissions = request.user.permissions;

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('require-permission', [
      context.getClass(),
      context.getHandler()
    ])
    
    if(!requiredPermissions) {
      return true;
    }
    
    for(let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find(item => item.code === curPermission);
      if(!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}
~~~
同样是用 `reflector` 取出 `handler` 或者 `controller` 上的 `require-permission` 的 `metadata`。如果没有，就是不需要权限，直接放行，返回 `true`。对于需要的每个权限，检查下用户是否拥有，没有的话就返回 `401`，提示没权限。否则就放行，返回 `true`。

同样是全局启用这个 `PermissionGuard`：
~~~ts
import { PermissionGuard } from './permissionGuard.guard'

// providers 中添加
{
  provide: APP_GUARD,
  useClass: PermissionGuard
}
~~~
最后我们把这两个 @SetMetadata 封装成自定义装饰器，新建 `src/custom.decorator.ts`：
~~~ts
import { SetMetadata } from "@nestjs/common";
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from "express";

export const  RequireLogin = () => SetMetadata('require-login', true);

export const  RequirePermission = (...permissions: string[]) => SetMetadata('require-permission', permissions);

// 自定义参数装饰器
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if(!request.user) {
        return null;
    }
    return data ? request.user[data] : request.user;
  },
)
~~~
在 `AppController` 中添加：
~~~ts
@Get('aaa')
@SetMetadata()
@SetMetadata('ddd')
aaa(@UserInfo('username') username: string, @UserInfo() userInfo) {
  console.log(username)
  console.log(userInfo)
  return 'aaa';
}
~~~
浏览器访问 `aaa` 接口，可以看到服务端从 `request` 取出了 `user` 的值传入了 `handler`，而这个 `request.user` 是在 `LoginGuard` 里设置的。这样，就完成了鉴权和拿到用户信息的功能。


### 用户管理模块-- interceptor、修改信息接口


