import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { LobbyUserDTO } from './lobby.dto';
import { Lobby } from './lobby.entity';

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(Lobby)
    private lobbyRepository: Repository<Lobby>,
    private userService: UserService,
  ) {}

  findOne(id: string): Promise<Lobby> {
    return this.lobbyRepository.findOne(id, { relations: ['users'] });
  }

  async addOne(adminId: string): Promise<Lobby> {
    const user = await this.userService.getOne(adminId);
    return this.lobbyRepository.save({ admin: user, users: [], dateCreated: new Date() });
  }

  async addUser({ userId, lobbyId }: LobbyUserDTO) {
    const user = await this.userService.getOne(userId);
    const lobby = await this.findOne(lobbyId);
    if (!lobby.users.find(u => u.id === userId)) return lobby;
    return this.lobbyRepository.save({ ...lobby, users: [...lobby.users, user] });
  }

  async removeUser({ userId, lobbyId }: LobbyUserDTO) {
    const lobby = await this.findOne(lobbyId);
    return this.lobbyRepository.save({ ...lobby, users: lobby.users.filter(u => u.id !== userId) });
  }
}
