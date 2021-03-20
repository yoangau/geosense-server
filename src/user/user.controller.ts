import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { JwtUserGuard } from './jwt-user.guard';
import { JWTPayload, UserAddDTO, UserDTO } from './user.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async addOne(@Body() { name, color }: UserAddDTO): Promise<UserDTO> {
    const user = await this.userService.addOne(name, color);
    const token = this.userService.login(user.id);
    return { user, token };
  }

  @UseGuards(JwtUserGuard)
  @Get()
  getOne(@Request() { user }: { user: JWTPayload }): Promise<User> {
    return this.userService.getOne(user.userId);
  }
}
