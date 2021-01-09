import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepository: Repository<City>,
  ) {}

  get(quantity: number): Promise<City[]> {
    return this.cityRepository
      .createQueryBuilder()
      .select('*')
      .orderBy('RANDOM()')
      .limit(quantity)
      .execute();
  }
}
