import { Controller, Get, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { LunarSolarConvertDto, JieqiQueryDto } from './dto/calendar.dto';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  /**
   * GET /api/calendar/lunar-solar
   * 公历与农历日期互转
   */
  @Get('lunar-solar')
  async convert(@Query() dto: LunarSolarConvertDto) {
    return this.calendarService.convert(dto);
  }

  /**
   * GET /api/calendar/jieqi
   * 查询指定年份的二十四节气交接时刻
   */
  @Get('jieqi')
  async getJieqi(@Query() dto: JieqiQueryDto) {
    return this.calendarService.getJieqi(dto);
  }
}