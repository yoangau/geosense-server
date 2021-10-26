import { Injectable } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from 'src/city/city.service';
import { Score } from 'src/score/score.entity';
import { ScoreService } from 'src/score/score.service';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameDTO } from './game.dto';
import { Game } from './game.entity';
import { GameState, GameStateCtorParams } from './game.state';

@Injectable()
export class GameService {
  private gameStates: Map<string, GameState> = new Map();

  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private cityService: CityService,
    private userService: UserService,
    private scoreService: ScoreService,
    private schedulerRegistry: SchedulerRegistry,
  ) { }

  find(id: string): Promise<Game | undefined> {
    return this.gameRepository.findOne({ where: { id }, relations: ['users', 'cities', 'scores'] });
  }

  async create(game: GameDTO): Promise<Game> {
    const cities = await this.cityService.get(game.cityQuantity);
    const users = await this.userService.findThese(game.userIDs);
    return this.gameRepository.save({ users, cities });
  }

  startGame(game: Game, gameStateCtorParams: GameStateCtorParams) {
    const gameState = new GameState(gameStateCtorParams);
    this.gameStates.set(game.id, gameState);
    this.startRound(game);
  }

  endGame(game: Game) {
    this.gameStates.get(game.id)?.endGameEvent();
    this.gameStates.delete(game.id);
  }

  startRound(game: Game) {
    const gameState = this.gameStates.get(game.id);
    if (!gameState || gameState.roundNumber >= game.cities.length) {
      return this.endGame(game);
    }
    gameState.nextRound();

    const waitTimeout = setTimeout(() => {
      gameState.playRound();
      const playTimeout = setTimeout(() => {
        this.startRound(game);
      }, 10000);
      this.schedulerRegistry.addTimeout(game.id, playTimeout);
    }, 5000);
    this.schedulerRegistry.addTimeout(game.id, waitTimeout);
  }

  nextRound(game: Game) {
    this.schedulerRegistry.deleteTimeout(game.id);
    this.startRound(game);
  }

  async getGameUpdate(gameId: string): Promise<Game | undefined> {
    const game = await this.find(gameId)
    if (!game) return
    const gameState = this.gameStates.get(game.id)
    if (!gameState) return
    return this.prepareGame(game, gameState)
  }

  private prepareGame(game: Game, gameSate: GameState): Game {
    return {
      ...game,
      cities: game.cities.slice(0, gameSate.roundNumber),
    };
  }

  async score(game: Game, user: User, latitude: number, longitude: number): Promise<Score | undefined> {
    const gameState = this.gameStates.get(game.id);
    if (!gameState || gameState.state === 'wait' || !gameState.roundUsers.find(uid => uid === user.id)) return;
    const city = game.cities[gameState.roundNumber];
    const deltaTimeSeconds = (Date.now() - gameState.roundStartTime) / 1000;
    const score = this.scoreService.score(game, user, city, latitude, longitude, deltaTimeSeconds);
    if (gameState.roundUsers.length >= game.users.length) this.nextRound(game);
    return score;
  }
}
