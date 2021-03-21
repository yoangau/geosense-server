import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { uniqueNamesGenerator, adjectives, colors, animals } from 'unique-names-generator';

export default class Lobby {
  static generateId = () => uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals], separator: '-' });

  id: string;
  admin: User;
  users: User[];
  games: Game[];

  constructor(admin: User) {
    this.admin = admin;
    this.users = [];
    this.games = [];
    this.id = Lobby.generateId();
  }
}
