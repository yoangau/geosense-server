import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GroupUserDTO } from './group.dto';
import { Group } from './group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
    private userService: UserService,
  ) {}

  findOne(id: string): Promise<Group> {
    return this.groupRepository.findOne(id, { relations: ['users', 'scores'] });
  }

  async addOne(adminId: string): Promise<Group> {
    const user = await this.userService.getOne(adminId);
    return this.groupRepository.save({ admin: user, users: [user], dateCreated: new Date() });
  }

  async addUser({ userId, groupId }: GroupUserDTO) {
    const user = await this.userService.getOne(userId);
    const group = await this.findOne(groupId);
    return this.groupRepository.save({ ...group, users: [...group.users, user] });
  }

  async removeUser({ userId, groupId }: GroupUserDTO) {
    const group = await this.findOne(groupId);
    return this.groupRepository.save({ ...group, users: group.users.filter(u => u.id !== userId) });
  }
}
