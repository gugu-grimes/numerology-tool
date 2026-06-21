import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { ChartModule } from './modules/chart/chart.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { HechongModule } from './modules/hechong/hechong.module';
import { BingModule } from './modules/bing/bing.module';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    ChartModule,
    CalendarModule,
    AnalysisModule,
    HechongModule,
    BingModule,
  ],
})
export class AppModule {}