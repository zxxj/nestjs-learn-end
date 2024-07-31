import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { getUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  @Get()
  getUser(@Query() query: getUserDto, @Req() req, @Headers() headers) {
    // console.log(req);
    // console.log(headers);
    console.log(query);
    return this.userService.findAll(query);
  }

  @Get('/:id')
  getUserById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  addUser(@Body() dto: any): any {
    console.log(dto);
    return this.userService.create(dto as User);
  }

  @Put('/:id')
  updateUser(@Param('id') id: number, @Body() dto: any) {
    return this.userService.update(id, dto as User);
  }

  @Delete('/:id')
  removeUser(@Param('id') id) {
    return this.userService.remove(id);
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
