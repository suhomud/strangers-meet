import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DinnerService } from './dinner.service';
import { DinnerController } from './dinner.controller';
import { Dinner } from './entities/dinner.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dinner]),
    UserModule,
  ],
  controllers: [
    DinnerController
  ],
  providers: [DinnerService],
})
export class DinnerModule {}