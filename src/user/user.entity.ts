import { Game } from 'src/game/game.entity';
import { Score } from 'src/score/score.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column({ type: 'datetime' })
  dateCreate: Date;

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

  @Column({ default: true })
  isActive: boolean;
}
