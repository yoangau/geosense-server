import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, OneToMany } from 'typeorm';

@Entity()
export class Lobby {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(
    type => User,
    user => user.adminLobbies,
  )
  admin: User;

  @ManyToMany(
    type => User,
    user => user.lobbies,
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
    game => game.lobby,
  )
  games: Game[];
}
