import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { UserModule } from 'src/user/user.module';
import { Group } from './group.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([Group])],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
