import { City } from 'src/city/city.entity';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, AfterInsert, Column } from 'typeorm';
import clamp from 'lodash.clamp';
@Entity()
export class Score {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  latitude: number;

  @Column()
  longitude: number;

  @Column()
  deltaTimeSeconds: number;

  score: number;

  @AfterInsert()
  updateScore() {
    const { sin, cos, sqrt, atan2, PI } = Math;
    const degreesToRadians = (degrees: number) => (degrees * PI) / 180;
    const earthRadiusKm = 6371;
    const dLat = degreesToRadians(this.city.latitude - this.latitude);
    const dLon = degreesToRadians(this.city.longitude - this.longitude);

    const a =
      sin(dLat / 2) * sin(dLat / 2) +
      sin(dLon / 2) * sin(dLon / 2) * cos(degreesToRadians(this.latitude)) * cos(degreesToRadians(this.city.latitude));
    const c = 2 * atan2(sqrt(a), sqrt(1 - a));
    const distance = earthRadiusKm * c;

    const distanceScore = 10 - clamp(distance / 100, 0, 10);
    const timeScore = 10 * this.deltaTimeSeconds;

    this.score = timeScore * distanceScore;
  }

  @ManyToOne(
    type => City,
    city => city.scores,
  )
  city: City;

  @ManyToOne(
    type => Game,
    game => game.scores,
  )
  game: Game;

  @ManyToOne(
    type => User,
    user => user.scores,
  )
  user: User;
}
