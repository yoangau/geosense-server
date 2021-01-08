import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  getOne(id: string): Promise<User> {
    return this.userRepository.findOne(id, { relations: ['games', 'scores'] });
  }

  addOne(name: string): Promise<User> {
    return this.userRepository.save({ name, dateCreated: new Date() });
  }
}
