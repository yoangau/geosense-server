import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { UserDTO } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  addOne(@Body() { name, color }: UserDTO): Promise<User> {
    return this.userService.addOne(name, color);
  }

  @Get()
  getOne(@Query('id') id: number): Promise<User> {
    return this.userService.getOne(id);
  }
}
