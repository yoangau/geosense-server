import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id }, relations: ['games', 'scores'] });
  }

  findThese(ids: number[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  addOne(name: string, color: string): Promise<User> {
    return this.userRepository.save({ name, color, dateCreated: new Date() });
  }

  async validateUser(userToken: string): Promise<boolean> {
    try {
      const { userId } = this.jwtService.verify<{ userId: string }>(userToken);
      const user = await this.findOne(userId);
      return Boolean(user);
    } catch {
      return false;
    }
  }

  login(userId: string) {
    return this.jwtService.sign({ userId });
  }
}
