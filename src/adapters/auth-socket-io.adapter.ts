import { INestApplicationContext } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { UserService } from 'src/user/user.service';

export class AuthSocketIOAdapter extends IoAdapter {
  private readonly userService: UserService;

  constructor(private app: INestApplicationContext) {
    super(app);
    this.userService = this.app.get(UserService);
  }

  createIOServer(port: number, options?: SocketIO.ServerOptions): any {
    options.allowRequest = async (request, allowFunction) => {
      const { token } = request['_query'];
      const verified = await this.userService.validateUser(token);
      return allowFunction(verified ? null : 'Unauthorized', verified);
    };

    return super.createIOServer(port, options);
  }
}
