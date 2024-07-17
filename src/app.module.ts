import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
