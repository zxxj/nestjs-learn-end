import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAll() {
    return this.userRepository.find();
  }

  find(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: User) {
    const userObj = await this.userRepository.create(user);
    return this.userRepository.save(userObj);
  }

  update(id: number, user: Partial<User>) {
    return this.userRepository.update(id, user);
  }

  delete(id: number) {
    return this.userRepository.delete(id);
  }
}
