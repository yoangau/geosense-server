import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.adminGroups,
  )
  admin: User;

  @ManyToMany(
    type => User,
    user => user.groups,
    {
      cascade: true,
    },
  )
  @JoinTable()
  users: User[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    type => Game,
    game => game.group,
  )
  games: Game[];
}
