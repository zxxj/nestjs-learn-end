import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser(): any {
    return {
      code: 200,
      data: [
        {
          username: 'xin',
          age: 18,
        },
      ],
      message: '请求用户信息成功!',
    };
  }
}
