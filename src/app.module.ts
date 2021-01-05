import { Module } from '@nestjs/common';
import { GameModule } from './game/game.module';
import { MapModule } from './map/map.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [GameModule, MapModule, TypeOrmModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
