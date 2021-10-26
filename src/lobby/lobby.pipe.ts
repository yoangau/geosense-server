import { ArgumentMetadata, Inject, Injectable, PipeTransform } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { GameService } from 'src/game/game.service';
import { UserService } from 'src/user/user.service';
import { LobbyAdminDTO } from './lobby.dto';
import { LobbyService } from './lobby.service';

@Injectable()
export class LobbyPipe implements PipeTransform {
  constructor(
    @Inject(LobbyService) private lobbyService: LobbyService,
    @Inject(UserService) private userService: UserService,
    @Inject(GameService) private gameService: GameService,
  ) { }

  async transform({ lobbyId, userId, adminId, currentGameId }: LobbyAdminDTO, metadata: ArgumentMetadata) {
    const lobby = this.lobbyService.findLobby(lobbyId);
    const user = await this.userService.findOne(userId);
    const game = currentGameId ? await this.gameService.find(currentGameId) : currentGameId
    if (!lobby) throw new WsException('This lobby does not exist');
    if (!user) throw new WsException('This user does not exist');
    if (adminId && lobby.admin.id !== adminId) throw new WsException('This is not the lobby admin');

    return { lobby, user, game };
  }
}
