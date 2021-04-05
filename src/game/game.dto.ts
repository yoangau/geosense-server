import { User } from 'src/user/user.entity';
import { Game } from './game.entity';

export interface GameDTO {
  userIDs: number[];
  cityQuantity: number;
  lobbyId: string;
}

export interface GameUserScoreDTO {
  game: Game;
  user: User;
  longitude: number;
  latitude: number;
}
