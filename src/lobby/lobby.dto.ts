import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import Lobby from './lobby';

export interface LobbyAdminDTO extends LobbyUserDTO {
  adminId: string;
}

export interface LobbyUserDTO extends LobbyIdDTO {
  userId: string;
}
export interface LobbyIdDTO {
  lobbyId: string;
  currentGameId?: string;
}

export interface LobbyPipeDTO {
  user: User;
  lobby: Lobby;
  admin: User;
  game?: Game;
}
