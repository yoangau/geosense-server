import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LobbyUserDTO } from './lobby.dto';
import Lobby from './lobby';

@Injectable()
export class LobbyService {
  private lobbies: Lobby[] = [];

  constructor(private userService: UserService) {}

  findLobby(id: string): Lobby | undefined {
    return this.lobbies.find(lob => lob.id === id);
  }

  async createLobby(userId: string): Promise<Lobby | undefined> {
    const user = await this.userService.findOne(userId);
    if (!user || user.id !== userId) return;
    const lobby = new Lobby(user);
    this.lobbies.push(lobby);
    return lobby;
  }
}
