import { Body, Controller, UnauthorizedException, Post, Get, NotFoundException, Query } from '@nestjs/common';
import Lobby from './lobby';
import { LobbyService } from './lobby.service';
import { UserIdDTO } from 'src/user/user.dto';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @Post()
  addOne(@Body() { userId }: UserIdDTO): Promise<Lobby> {
    const lobby = this.lobbyService.createLobby(userId);
    if (!lobby) throw new UnauthorizedException();
    return lobby as Promise<Lobby>;
  }

  @Get()
  getOne(@Query('lobbyId') lobbyId: string): Lobby {
    const lobby = this.lobbyService.findLobby(lobbyId);
    if (!lobby) throw new NotFoundException();
    return lobby;
  }
}
