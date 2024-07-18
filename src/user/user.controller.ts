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
    // const db = this.configService.get(ConfigEnum.DB);
    const url = this.configService.get('DB_URL');
    // console.log(db);
    console.log('url', url);
    return this.userService.getUser();
  }
}
