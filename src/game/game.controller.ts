import { Controller, Get, Param } from '@nestjs/common';
import { Game } from './game.entity';
import { GameService } from './game.service';

@Controller('game')
export class GameController {
  constructor(private gameService: GameService) {}
  @Get()
  findAll(): Promise<Game[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  addOne(@Param('id') id: string): void {
    this.gameService.addOne(id);
  }
}
