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

  // 查询所有用户
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

  // 查询某个用户
  find(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  // 创建用户
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

  // 更新用户
  async update(id: number, userDto: Partial<User>) {
    // 更新接口操作时,需要考虑的几点
    // 1.判断用户是否是自己
    // 2.判断用户是否有更新用户信息的权限
    // 3.返回数据不能包敏感信息(密码等)
    console.log('id', id);
    console.log('user', userDto);

    // 1.先根据id查询到用户信息
    const userProfile: any = await this.findProfile(id);

    // 2.合并数据
    const newUser = this.userRepository.merge(userProfile, userDto);

    // 3.联合模型更新需要使用save
    return this.userRepository.save(newUser);

    // this.userRepository.update(id, userDto): 只适合单模型数据的更新,不适合有关系的模型数据更新
    // return this.userRepository.update(id, userDto);
  }

  // 删除用户(软删除)
  async remove(id: number) {
    const user = await this.find(id);
    return this.userRepository.remove(user);
  }

  // 查询用户信息
  async findProfile(id: number) {
    console.log(id);
    return this.userRepository.find({
      where: {
        id,
      },
      relations: ['profile'],
    });
  }

  // 查询用户日志
  async findLogs(id: number) {
    const user = await this.find(id);
    return this.logsRepository.findOne({
      where: {
        user: user.logs,
      },
      // relations: {
      //   : true,
      // },
    });
  }
}
