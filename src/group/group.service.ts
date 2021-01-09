import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Group } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userService: UserService,
  ) {}

  findOne(id: number): Promise<Group> {
    return this.groupRepository.findOne(id, { relations: ['users', 'scores'] });
  }

  async addOne(adminID: number): Promise<Group> {
    const user = await this.userService.getOne(adminID);
    return this.groupRepository.save({ user, users: [user], dateCreated: new Date() });
  }
}
