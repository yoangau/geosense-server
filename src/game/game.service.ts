import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from 'src/city/city.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameDTO } from './game.dto';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  private gameRounds: Record<string, number> = {};

  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private cityService: CityService,
    private userService: UserService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  find(id: string): Promise<Game | undefined> {
    return this.gameRepository.findOne({ where: { id }, relations: ['users', 'scores'] });
  }

  async create(game: GameDTO): Promise<Game> {
    const cities = await this.cityService.get(game.cityQuantity);
    const users = await this.userService.findThese(game.userIDs);
    return this.gameRepository.save({ users, cities });
  }

  startGame(game: Game) {
    this.gameRounds[game.id] = game.cities.length - 1;
  }

  startRound(game: Game, callback: CallableFunction) {
    const milliseconds = 10000;
    const timeout = setTimeout(callback, milliseconds);
    this.schedulerRegistry.addTimeout(game.id, timeout);
  }

  stopRound(game: Game) {
    this.schedulerRegistry.deleteTimeout(game.id);
  }
}
