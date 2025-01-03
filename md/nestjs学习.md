nestjs学习

# 一.docker

1. 安装docker

   ```js
   // 1.去docker官网下载安装包,并解决报错问题
   
   // 2.安装成功之后终端输入以下两个命令来检查docker是否安装成功
   docker --version // 检查是否正确输出版本号?
   docker-compose --version // 检查是否正确输出版本号?
   ```

2. docker创建mysql数据库

   ```js
   // 1.首先去dockerhub搜索mysql,在介绍中可以看到如下的一句命令
   $ docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mysql:tag
   
   // 2.然后将这段命粘贴到终端,将密码修改一下,然后回车并执行
   注意: 如果本地不存在mysql,那么执行这段命令时,docker首先会去下载mysql
   docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=123456 -d mysql:tag
   
   // 3.执行成功后,会得到如下的一串随机hash值,这串hash值代表着容器的名字
   4706d11fe4344a7ffa8b94bedf8819a0f278db9e0a64903326f9c37dfa923da1
   
   // 4.可以通过docker ps来查看你所启动的所有docker容器,例如我想看刚刚启动的mysql服务
   输入docker ps后, 就会列出如下信息:
   
   容器ID          镜像                                   运行时间                                  端口
   4706d11fe434   mysql:8.4.1   "docker-entrypoint.s…"   About a minute ago   Up About a minute   3306/tcp, 
   
               名字    
   33060/tcp   some-mysql
   ```

3. docker常用命令

   ```js
   docker run // 
   docker ps // 查看所有正在运行的容器
   docker stop 名称 // 关闭某个容器, 例如需要将some-mysql这个数据库关掉可以执行,docker stop some-mysql
   docker rm 名称 // 删除某个容器, 例如想删除掉some-mysql这个容器可以执行,docker rm some-mysql
   ```

4. docker-compose

   docker-compose是一款旨在帮助定义和共享多容器应用程序的工具,使用docker-compose可以通过创建一个yml文件来定义容器服务,并且可以使用类似于docker的命令将所有内容进行管理,比如启动,停止,重新部署等

   ```yml
   # 例如想要通过docker-compose创建mysql服务,首先需要写入如下配置,然后运行docker-compose up -d 来启动
   
   # Use root/example as user/password credentials
   version: '3.1'
   
   services:
     db:
       # 镜像
       image: mysql
       # 是否重启
       restart: always
       # 环境
       environment:
         # 密码
         MYSQL_ROOT_PASSWORD: 123456
   
       # 端口
       ports:
         - 3390:3306
       # (this is just an example, not intended to be a production configuration)
   
       # adminer服务: 就是可视化界面的插件
     adminer:
       # 镜像
       image: adminer
       # 是否重启
       restart: always
       # 端口
       ports:
         - 8080:8080
   ```


# 二.nest

1. 使用命令创建模块

   ```js
   // 例如创建user模块
   nest g module user
   ```

2. 使用命令创建controller文件

   ```js
   // 例如创建user.controller.ts
   nest g controller user
   
   // 例如创建user.service.ts
   nest g service user
   ```

3. 使用命令创建文件时,指定不需要创建测试文件

   ```js
   // 例如创建user.controller.ts
   nest g controller user --no-spec // --no-spec表示不需要创建测试文件
   ```

4. 使用命令创建某个文件时,可以查看它要做什么

   ```js
   // 例如创建user.controller.ts
   nest g controoler user --no-spec -d // -d表示查看你要做什么
   
   // 回车后,会打印出如下:
   CREATE src/user/user.controller.ts (101 bytes) // 表示你将要在src/user目录下创建user.controller.ts,文件大小为101byte
   UPDATE src/user/user.module.ts (222 bytes) // 这段命令表示的是user.module.ts文件会被更新(导入并挂载刚才创建的user.controller.ts)
   ```

5. 设置请求前缀

   ```js
   // main.ts
   import { NestFactory } from '@nestjs/core';
   import { AppModule } from './app.module';
   
   async function bootstrap() {
     const app = await NestFactory.create(AppModule);
     // 设置路由前缀, 例如设置了/api/v1后,访问某一个接口时路径必须为 /api/v1/user 才可以
     app.setGlobalPrefix('/api/v1');
     await app.listen(3000);
   }
   bootstrap();
   ```

   ## 项目环境配置
   
   1. ### 安装@nestjs/config模块
   
      ```js
      // 1.安装@nestjs/config依赖:
      pnpm i @nestjs/config
      ```
   
      ```js
      // 2.app.module.ts根模块中引入并使用, 
      import { ConfigModule} from "@nestjs/config"
      ```
   
      ```js
      // 3.imports:[ConfigModule]: 使用ConfigModule全局配置模块
      @Module({
        imports: [ConfigModule, UserModule],
        controllers: [AppController],
        providers: [AppService],
      })
      ```
   
      ```js
      // 4.使用ConfigModule.forRoot()方法的目的是读取本地的.env环境文件
      @Module({
        imports: [ConfigModule.forRoot(), UserModule],
        controllers: [AppController],
        providers: [AppService],
      })
      ```
   
      ```js
      // 5.如果想在其他的模块中通过@nestjs/config访问环境变量时,需要将isGlobal设置为true
      ConfigModule.forRoot({ isGlobal: true })
      
      // demo:
      import { Controller, Get } from '@nestjs/common';
      import { UserService } from './user.service';
      import { ConfigService } from '@nestjs/config';
      
      @Controller('user')
      export class UserController {
        constructor(
          private userService: UserService,
          private configService: ConfigService,
        ) {}
      
        @Get()
        getUser(): any {
          const db = this.configService.get('DB');
          console.log(db);
          return this.userService.getUser();
        }
      }
      
      // 不设置时访问环境变量时会报如下错误:
      Potential solutions:
      - Is UserModule a valid NestJS module?
      - If ConfigService is a provider, is it part of the current UserModule?
      - If ConfigService is exported from a separate @Module, is that module imported within UserModule?
        @Module({
          imports: [ /* the Module containing ConfigService */ ]
        })
      ```
   
      2. ### 配置与访问环境变量
   
         ```js
         // 1.首先创建三个环境文件
         .env: 默认环境文件
         .env.development: 开发环境文件
         .env.production: 生产环境文件
         ```
   
         ```js
         // 2.如何实现自动识别并读取对应的环境文件?
         
         // 2.1 首先需要通过一个依赖实现, cross-env
         pnpm i cross-env
         
         // 2.2 配置package.json中的两个项目启动命令,都需要加上cross-env NODE_ENV=对应的环境文件名
             "start:dev": "cross-env NODE_ENV=development nest start --watch",
             "start:prod": "cross-env NODE_ENV=production node dist/main",
         
         // 2.3 在app.module.ts根模块中根据package.json中配置的 cross-env NODE_ENV 来自动拼接环境文件的路径
         
         const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
         console.log(envFilePath); // 例如执行了开发环境命令,则输出 .env.develpoment
         
         // 2.4 配置imports
         @Module({
           imports: [
             ConfigModule.forRoot({
               isGlobal: true,
               envFilePath, // 想要访问环境文件的路径
             }),
             UserModule,
           ],
           controllers: [AppController],
           providers: [AppService],
         })
         
         // tip: 以上操作过后,就能根据当前所处的环境中,正常的访问对应的环境文件中的环境变量了
         ```
   
         ```js
         // 3.如何将开发环境与生产环境中的通用环境变量进行抽离?
         
         // 3.1 第一步,将通用的环境变量全部写到.env这个默认环境文件中
         
         // 3.2 第二步,安装dotenv,首先要知道可以使用dotenv.config({ path: '.env' })方法来加载.env中的所有环境变量
         
         // 3.3 第三步,将dotenv加载到的环境变量放入@nestjs/config模块中forRoot方法里面的load,写法如下
             ConfigModule.forRoot({
               isGlobal: true,
               envFilePath, // 想要访问环境文件的路径
               load: [() => dotenv.config({ path: '.env' })], // 加载.env环境文件,目的是为了将开发与生产环境下共用的配置全写在.env环境文件中,不必写在各自的文件中
             }),
                 
         // tip: 经过以上操作过后,就可以正常的访问到.env默认环境文件下的所有环境变量了
         // 警告: 如果你在当前环境下的环境文件中定义了与.env默认环境文件中相同的环境变量,那么会覆盖掉.env文件中的环境变量!!
         ```
   
         ## 三.数据库
   
         1. nestjs如何连接数据库?
         
            ```js
            // 1.1 通过typeorm连接mysql数据库,首先需要安装以下的依赖
            pnpm i @nestjs/typeorm typeorm mysql2
            
            // 1.2 app.module.ts根模块中引入TypeOrmModule
            import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
            
            // 1.3 在app.module.ts根模块imports中通过typeorm连接数据库
                 TypeOrmModule.forRoot({ // 数据库配置
                   // 使用什么数据库?
                   type: 'mysql',
                   // 连接地址
                   host: '127.0.0.1',
                   // 数据库端口号
                   port: 3390,
                   // 用户名
                   username: 'root',
                   // 密码
                   password: '123456',
                   // 需要连接到的数据库名称
                   database: 'testdb',
                   entities: [],
                   // 数据库初始化时,将本地的schema同步到数据库中
                   synchronize: true,
                   logging: ['error'],
                 }),
            ```
         
            ```js
            // 第二种数据库配置方式, 使用dotenv读取环境变量,并使用枚举抽离
            
            // .env.development
            DB_TYPE=mysql
            DB_HOST=127.0.0.1
            DB_PORT=3390
            DB_USERNAME=root
            DB_PASSWORD=123456
            DB_DATABASE=test_typeorm
            DB_SYNC=true
            DB_LOGGING=error
            
            // enum.config.ts
            enum ConfigEnum {
              DB_TYPE = 'DB_TYPE',
              DB_HOST = 'DB_HOST',
              DB_USERNAME = 'DB_USERNAME',
              DB_PORT = 'DB_PORT',
              DB_PASSWORD = 'DB_PASSWORD',
              DB_DATABASE = 'DB_DATABASE',
              DB_SYNC = 'DB_SYNC',
              DB_LOGGING = 'DB_LOGGING',
            }
            
            export { ConfigEnum };
            
            // app.module.ts
                // 数据库配置第二种方式
                TypeOrmModule.forRootAsync({
                  imports: [ConfigModule],
                  inject: [ConfigService],
                  useFactory: (configService: ConfigService) =>
                    ({
                      type: configService.get(ConfigEnum.DB_TYPE),
                      host: configService.get(ConfigEnum.DB_HOST),
                      port: configService.get(ConfigEnum.DB_PORT),
                      username: configService.get(ConfigEnum.DB_USERNAME),
                      password: configService.get(ConfigEnum.DB_PASSWORD),
                      database: configService.get(ConfigEnum.DB_DATABASE),
                      synchronize: configService.get(ConfigEnum.DB_SYNC),
                      logging: [ConfigEnum.DB_LOGGING],
                    }) as TypeOrmModuleAsyncOptions,
                }),
            ```
         
            
         
         ## 四.nest请求
         
         ```js
         1. @param('/:id'): get参数
         2. @Query('/:id'): 查询参数
         3. @Headers(): 获取请求头信息
         4. @Body(): body参数
         5. @Req(): 获取完整的请求信息
         ```
         
         
         
         