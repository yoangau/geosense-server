import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from 'src/city/city.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameDTO } from './game.dto';
import { Game } from './game.entity';

class GameState {
  roundNumber = 0;
  roundUsers: string[] = [];
  state: 'wait' | 'play' = 'wait';
}

@Injectable()
export class GameService {
  private gameStates: Record<string, GameState> = {};

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
    this.gameStates[game.id] = new GameState();
    this.startRound(game);
  }

  endGame(game: Game) {
    console.log('emit end-game');
    delete this.gameStates[game.id];
  }

  startRound(game: Game) {
    const gameState = this.gameStates[game.id];
    if (!gameState || gameState.roundNumber >= game.cities.length) {
      return this.endGame(game);
    }
    console.log('emit round-starting');
    gameState.state = 'wait';

    const waitTimeout = setTimeout(() => {
      console.log('emit round-starting');
      gameState.state = 'play';
      const playTimeout = setTimeout(() => {
        this.gameStates[game.id].roundNumber++;
        this.startRound(game);
      }, 10000);
      this.schedulerRegistry.addTimeout(game.id, playTimeout);
    }, 5000);
    this.schedulerRegistry.addTimeout(game.id, waitTimeout);
  }

  nextRound(game: Game) {
    this.schedulerRegistry.deleteTimeout(game.id);
    this.gameStates[game.id].roundNumber++;
    this.startRound(game);
  }

  private prepareGame(game: Game, gameSate: GameState): Game {
    return {
      ...game,
      cities: game.cities.slice(0, gameSate.roundNumber),
    };
  }
}
