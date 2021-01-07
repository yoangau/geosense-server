import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { CityService } from './city.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [CityService],
  exports: [CityService]
})
export class CityModule {}
