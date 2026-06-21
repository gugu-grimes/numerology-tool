import { Module } from '@nestjs/common';
import { BingController } from './bing.controller';
import { YongshenController } from './yongshen.controller';
import { JiXiongController } from './jixiong.controller';
import { BingService } from './bing.service';
import { YongshenService } from './yongshen.service';
import { JiXiongService } from './jixiong.service';
import { ChartModule } from '../chart/chart.module';

@Module({
  imports: [ChartModule],
  controllers: [BingController, YongshenController, JiXiongController],
  providers: [BingService, YongshenService, JiXiongService],
  exports: [BingService, YongshenService, JiXiongService],
})
export class BingModule {}