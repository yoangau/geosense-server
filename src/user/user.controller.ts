import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  addOne(@Body() { name }: { name: string }): Promise<User> {
    return this.userService.addOne(name);
  }

  @Get()
  getOne(@Query('id') id: string): Promise<User> {
    return this.userService.getOne(id);
  }
}
