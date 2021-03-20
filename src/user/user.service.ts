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

  getOne(id: string): Promise<User> {
    return this.userRepository.findOne(id, { relations: ['games', 'scores'] });
  }

  getThese(ids: number[]): Promise<User[]> {
    return this.userRepository.findByIds(ids);
  }

  addOne(name: string, color: string): Promise<User> {
    return this.userRepository.save({ name, color, dateCreated: new Date() });
  }

  async validateUser(userToken: string): Promise<boolean> {
    const { id }: any = this.jwtService.decode(userToken);
    const user = await this.getOne(id);
    return user && user.id !== id;
  }

  login(userId: string) {
    return this.jwtService.sign({ userId });
  }
}
