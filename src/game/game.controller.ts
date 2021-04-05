import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GameDTO } from './game.dto';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get()
  findOne(@Query('id') id: string): Promise<Game | undefined> {
    return this.gameService.find(id);
  }

  @Post()
  addOne(@Body() game: GameDTO): Promise<Game> {
    return this.gameService.create(game);
  }
}
