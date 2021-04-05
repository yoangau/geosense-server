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

  addUser(user: User): Lobby {
    this.users.push(user);
    return this;
  }

  removeUser(user: User): Lobby {
    return this.removeUserById(user.id);
  }

  removeUserById(userId: string): Lobby {
    this.users = this.users.filter(u => u.id !== userId);
    if (this.admin.id === userId && this.users.length) this.admin = this.users[0];
    return this;
  }

  isEmpty(): boolean {
    return !this.users.length;
  }
}
