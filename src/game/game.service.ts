import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './game.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private usersRepository: Repository<Game>,
  ) {}

  findAll(): Promise<Game[]> {
    return this.usersRepository.find();
  }

  addOne(name: string): void {
    this.usersRepository.save({name})
  }
}
