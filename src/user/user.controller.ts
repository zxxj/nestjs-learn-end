import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUser(@Req() req, @Headers() headers) {
    // console.log(req);
    console.log(headers);
    return this.userService.findAll();
  }

  @Get('/:id')
  getUserById(@Param('id') id: number) {
    return this.userService.find(id);
  }

  @Post()
  addUser(@Body() dto: any): any {
    return this.userService.create(dto as User);
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() dto: any) {
    return this.userService.update(id, dto as User);
  }

  @Delete('/:id')
  removeUser(@Param('id') id) {
    return this.userService.delete(id);
  }

  @Get('/profile/:id')
  getUserProfile(@Param('id') id: number) {
    return this.userService.findProfile(id);
  }

  @Get('/logs/:id')
  getUserLogs(@Param('id') id: number) {
    return this.userService.findLogs(id);
  }
}
