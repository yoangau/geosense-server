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

  addUser(user: User) {
    this.users.push(user);
    return this;
  }

  removeUser(user: User) {
    this.users = this.users.filter(u => u.id !== user.id);
    return this;
  }

  removeUserById(userId: string) {
    this.users = this.users.filter(u => u.id !== userId);
    return this;
  }
}
