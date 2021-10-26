import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { UserModule } from 'src/user/user.module';
import { LobbyGateway } from './lobby.gateway';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [UserModule, GameModule],
  providers: [LobbyService, LobbyGateway],
  controllers: [LobbyController],
})
export class LobbyModule { }
