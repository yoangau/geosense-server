import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CityService } from 'src/city/city.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { GameDTO } from './game.dto';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    private cityService: CityService,
    private userService: UserService,
  ) {}

  findOne(id: string): Promise<Game | undefined> {
    return this.gameRepository.findOne({ where: { id }, relations: ['users', 'scores'] });
  }

  async addOne(game: GameDTO): Promise<Game> {
    const cities = await this.cityService.get(game.cityQuantity);
    const users = await this.userService.findThese(game.userIDs);
    return this.gameRepository.save({ dateCreated: new Date(), users, cities });
  }
}
