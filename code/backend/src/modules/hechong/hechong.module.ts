import { Module } from '@nestjs/common';
import { HechongController } from './hechong.controller';
import { HechongService } from './hechong.service';
import { ChartModule } from '../chart/chart.module';

@Module({
  imports: [ChartModule],
  controllers: [HechongController],
  providers: [HechongService],
  exports: [HechongService],
})
export class HechongModule {}