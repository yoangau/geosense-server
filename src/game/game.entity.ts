import { City } from 'src/city/city.entity';
import { Score } from 'src/score/score.entity';
import { User } from 'src/user/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'datetime' })
  dateCreated: Date;

  @UpdateDateColumn({ type: 'datetime' })
  dateUpdated: Date;

  @VersionColumn()
  version: number;

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

  @Column({ default: true })
  isActive: boolean;
}
