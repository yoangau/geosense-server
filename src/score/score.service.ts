import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  updateScore(score: Score) {
    this.scoreRepository.save(score);
  }
}
