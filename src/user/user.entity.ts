import { Game } from 'src/game/game.entity';
import { Score } from 'src/score/score.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(
    type => Game,
    game => game.users,
  )
  games: Game[];

  @OneToMany(
    type => Score,
    score => score.user,
  )
  scores: Score[];
}
