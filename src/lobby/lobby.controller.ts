import { Body, Controller, Post } from '@nestjs/common';
import { LobbyUserAdminDTO } from './lobby.dto';
import Lobby from './lobby';
import { LobbyService } from './lobby.service';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @Post()
  addOne(@Body() { adminId }: LobbyUserAdminDTO): Promise<Lobby> {
    return this.lobbyService.addOne(adminId);
  }
}
