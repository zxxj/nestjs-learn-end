import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getUserDto } from './dto';
import { Logs } from 'src/logs/logs.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
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

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {
    const userObj = await this.userRepository.create(user);
    try {
      const res = await this.userRepository.save(userObj);
      return res;
    } catch (error) {
      console.log(error, 'error');
      if (error.errno === 1062) {
        throw new HttpException(error.sqlMessage, 500);
      }
    }
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    return this.userRepository.remove(user);
  }

  async findProfile(id: number) {
    const user = await this.findOne(id);

    return this.logsRepository.find({
      where: {
        user: user.logs,
      },
      // relations: {
      //   profile: true,
      // },
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
