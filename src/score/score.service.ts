import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from 'src/city/city.entity';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoreService {
  constructor(
    @InjectRepository(Score)
    private scoreRepository: Repository<Score>,
  ) {}

  getThese(scores: string[]): Promise<Score[]> {
    return this.scoreRepository.findByIds(scores);
  }

  async score(
    game: Game,
    user: User,
    city: City,
    latitude: number,
    longitude: number,
    deltaTimeSeconds: number,
  ): Promise<Score> {
    return this.scoreRepository.save({ game, user, city, latitude, longitude, deltaTimeSeconds });
  }

  updateScore(score: Score) {
    this.scoreRepository.save(score);
  }
}
