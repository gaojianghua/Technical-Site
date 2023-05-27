# Nest
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
  // Controller 之前之后的处理逻辑可能是异步的。Nest 里通过 rxjs 来组织它们，所以可以使用 rxjs 的各种 operator。
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
  import { Observable } from 'rxjs';
  
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
  import { Observable } from 'rxjs';
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
