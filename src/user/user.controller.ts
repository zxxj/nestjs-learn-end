import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUser() {
    return this.userService.findAll();
  }

  @Get(':id')
  getUserById(@Param('id') id: number) {
    return this.userService.find(id);
  }

  @Post()
  addUser() {
    const obj = {
      username: 'test',
      password: '123456',
    };
    return this.userService.create(obj);
  }

  @Put(':id')
  updateUser(@Param() id, @Body() user) {
    return this.userService.update(id, user);
  }

  @Delete(':id')
  removeUser(@Param() id) {
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
