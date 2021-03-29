import { Game } from 'src/game/game.entity';
import { Score } from 'src/score/score.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  UpdateDateColumn,
  CreateDateColumn,
  VersionColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  color: string;

  @CreateDateColumn({ type: 'datetime' })
  dateCreated: Date;

  @UpdateDateColumn({ type: 'datetime' })
  dateUpdated: Date;

  @VersionColumn()
  version: number;

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
