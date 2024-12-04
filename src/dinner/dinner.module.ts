import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinnerService } from './dinner.service';
import { DinnerController } from './dinner.controller';
import { Dinner } from './entities/dinner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Dinner])],
  controllers: [DinnerController],
  providers: [DinnerService],
})
export class DinnerModule {}