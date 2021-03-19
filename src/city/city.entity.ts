import { Game } from 'src/game/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  adminName?: string;

  @Column()
  flag: string;

  @Column()
  isCapital: boolean;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(
    type => Game,
    game => game.cities,
  )
  games: Game[];
}
