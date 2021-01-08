import { City } from 'src/city/city.entity';
import { Score } from 'src/score/score.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(
    type => User,
    user => user.games,
    {
      cascade: true,
    },
  )
  @JoinTable()
  users: User[];

  @ManyToMany(
    type => City,
    city => city.games,
    {
      cascade: true,
    },
  )
  @JoinTable()
  cities: City[];

  @OneToMany(
    type => Score,
    score => score.game,
  )
  scores: Score[];
}
