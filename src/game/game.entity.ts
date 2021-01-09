import { City } from 'src/city/city.entity';
import { Group } from 'src/group/group.entity';
import { Score } from 'src/score/score.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ type: 'datetime' })
  dateCreated: Date;

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

  @ManyToOne(
    type => Group,
    group => group.games,
  )
  group: Group;

  @Column({ default: true })
  isActive: boolean;
}
