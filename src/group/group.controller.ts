import { Controller, Param, Post } from '@nestjs/common';
import { Group } from './group.entity';
import { GroupService } from './group.service';

@Controller('group')
export class GroupController {
  constructor(private groupService: GroupService) {}

  @Post(':id')
  addOne(@Param('id') id: string): Promise<Group> {
    return this.addOne(id);
  }
}
