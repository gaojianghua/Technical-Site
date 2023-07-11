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
可以使用postmain进行测试，每次请求返回的数据都不同，而且返回了一个 cookie 是 connect.sid，这个就是对应 session 的 id。因为 cookie 在请求的时候会自动带上，就可以实现请求的标识，给 http 请求加上状态。

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

使用 postmain 测试后可以看到，返回的响应确实带上了这个 header。下面让后面的请求需要带上这个 token，在服务端取出来，然后 +1 之后再放回去：
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
