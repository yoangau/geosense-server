import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { CityModule } from 'src/city/city.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [CityModule, UserModule, TypeOrmModule.forFeature([Game])],
  providers: [GameService],
  controllers: [GameController],
})
export class GameModule {}
