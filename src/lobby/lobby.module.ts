import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { UserModule } from 'src/user/user.module';
import { LobbyGateway } from './lobby.gateway';

@Module({
  imports: [UserModule],
  providers: [LobbyService, LobbyGateway],
  controllers: [LobbyController],
})
export class LobbyModule {}
