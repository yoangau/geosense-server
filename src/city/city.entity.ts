import { Game } from 'src/game/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  city: string;

  @Column()
  country: string;

  @Column()
  adminName: string;

  @Column()
  flag: string;

  @Column()
  isCapital: boolean;

  @Column()
  coordinates: [number, number];

  @Column({ default: true })
  isActive: boolean;

  @ManyToMany(
    type => Game,
    game => game.cities,
  )
  games: Game[];
}
