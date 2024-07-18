import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigEnum } from './enum/enum.config';
import { User } from './user/user.entity';
import { Profile } from './user/profile.entity';
import { Roles } from './roles/roles.entity';
import { Logs } from './logs/logs.entity';

// 根据package.json中配置的 cross-env NODE_ENV 来自动拼接环境文件的路径
const envFilePath = `.env.${process.env.NODE_ENV || 'development'}`;
console.log(envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath, // 想要访问环境文件的路径
      load: [() => dotenv.config({ path: '.env' })], // 加载.env环境文件,目的是为了将开发与生产环境下共用的配置全写在.env环境文件中,不必写在各自的文件中
    }),
    UserModule,

    // 数据库配置第一种方式
    // TypeOrmModule.forRoot({
    //   // 使用什么数据库?
    //   type: 'mysql',
    //   // 连接地址
    //   host: '127.0.0.1',
    //   // 数据库端口号
    //   port: 3390,
    //   // 用户名
    //   username: 'root',
    //   // 密码
    //   password: '123456',
    //   // 需要连接到的数据库名称
    //   database: 'testdb',
    //   entities: [],
    //   // 数据库初始化时,将本地的schema同步到数据库中
    //   synchronize: true,
    //   logging: ['error'],
    // }),

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
          entities: [User, Profile, Roles, Logs],
          synchronize: configService.get(ConfigEnum.DB_SYNC),
          logging: [configService.get(ConfigEnum.DB_LOGGING)],
        }) as TypeOrmModuleAsyncOptions,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
