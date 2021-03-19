import { Controller, Param, Post } from '@nestjs/common';
import { Lobby } from './lobby.entity';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @Post(':id')
  addOne(@Param('id') id: string): Promise<Lobby> {
    return this.addOne(id);
  }
}
