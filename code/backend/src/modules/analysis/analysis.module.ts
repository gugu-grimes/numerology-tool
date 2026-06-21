import { Module } from '@nestjs/common';
import { WuxingController } from './wuxing.controller';
import { WangShuaiController } from './wangshuai.controller';
import { ShishenController } from './shishen.controller';
import { GejuController } from './geju.controller';
import { WuxingService } from './wuxing.service';
import { WangShuaiService } from './wangshuai.service';
import { ShishenService } from './shishen.service';
import { GejuService } from './geju.service';
import { ChartModule } from '../chart/chart.module';

@Module({
  imports: [ChartModule],
  controllers: [WuxingController, WangShuaiController, ShishenController, GejuController],
  providers: [WuxingService, WangShuaiService, ShishenService, GejuService],
  exports: [WuxingService, WangShuaiService, ShishenService, GejuService],
})
export class AnalysisModule {}