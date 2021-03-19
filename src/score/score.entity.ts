import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  score: number;

  @ManyToOne(
    type => Game,
    game => game.scores,
  )
  game: Game;

  @ManyToOne(
    type => User,
    user => user.scores,
  )
  user: User;
}
