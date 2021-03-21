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
}

export interface LobbyPipeDTO {
  user: User;
  lobby: Lobby;
  admin: User;
}
