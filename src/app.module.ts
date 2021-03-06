import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { CityModule } from './city/city.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ScoreModule } from './score/score.module';
import { LobbyModule } from './lobby/lobby.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    GameModule,
    CityModule,
    UserModule,
    ScoreModule,
    LobbyModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
