import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { UserModule } from 'src/user/user.module';
import { Lobby } from './lobby.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LobbyGateway } from './lobby.gateway';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Lobby])],
  providers: [LobbyService, LobbyGateway],
  controllers: [LobbyController],
})
export class LobbyModule {}
