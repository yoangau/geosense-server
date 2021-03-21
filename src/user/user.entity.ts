import { Game } from 'src/game/game.entity';
import { Score } from 'src/score/score.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @Column({ type: 'datetime' })
  dateCreated: Date;

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
