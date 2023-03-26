import { Module } from '@nestjs/common';
import { DayService } from './day.service';

@Module({
  providers: [DayService],
  exports: [DayService],
})
export class DayModule {}
