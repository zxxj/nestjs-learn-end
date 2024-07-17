import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { ConfigEnum } from 'src/enum/enum.config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUser(): any {
    const db = this.configService.get(ConfigEnum.DB);
    console.log(db);
    return this.userService.getUser();
  }
}
