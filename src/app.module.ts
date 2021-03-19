import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { CityModule } from './city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ScoreModule } from './score/score.module';
import { LobbyModule } from './lobby/lobby.module';

@Module({
  imports: [GameModule, CityModule, UserModule, ScoreModule, TypeOrmModule.forRoot(), LobbyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
