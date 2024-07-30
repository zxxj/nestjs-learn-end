import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAll(query: getUserDto) {
    // 查询参数
    const { pageNum, pageSize, username, role, gender } = query;

    // 分页配置
    const take = pageSize || 10;
    const skip = ((pageNum || 1) - 1) * take;

    return this.userRepository.find({
      // 对结果的筛选,是否显示?
      select: {
        id: true,
        username: true,
        profile: {
          gender: true,
        },
      },

      // 条件查询
      where: {
        // user表查询条件
        username: username,

        // 用户信息表查询条件
        profile: {
          gender: gender,
        },

        // 角色表查询条件
        roles: {
          id: role,
        },
      },

      // 开启那几张表的联合查询?
      relations: {
        profile: true,
        roles: true,
      },

      // 分页配置
      take,
      skip,
    });
  }

  find(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {
    const userObj = await this.userRepository.create(user);
    return this.userRepository.save(userObj);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  findLogs(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        logs: true,
      },
    });
  }
}
