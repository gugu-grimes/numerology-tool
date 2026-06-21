import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { LunarSolarConvertDto, JieqiQueryDto } from './dto/calendar.dto';
import { convertLunarToSolar, convertSolarToLunar, getJieqiBoundary } from './lib/calendar';

@Injectable()
export class CalendarService {
  /**
   * 公历与农历日期互转
   */
  async convert(dto: LunarSolarConvertDto) {
    const { direction, year, month, day, isLeapMonth } = dto;

    // 校验年份范围
    if (year < 1900 || year > 2100) {
      throw new HttpException(
        {
          type: 'https://bazi.app/errors/date-out-of-range',
          title: '日期超出范围',
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          detail: '年份须在 1900–2100 年范围内',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (direction === 'lunar2solar') {
      const converted = convertLunarToSolar(year, month, day, isLeapMonth);
      return {
        direction: 'lunar2solar',
        originalDate: { year, month, day, isLeapMonth: isLeapMonth || false },
        convertedDate,
      };
    } else {
      const converted = convertSolarToLunar(year, month, day);
      return {
        direction: 'solar2lunar',
        originalDate: { year, month, day },
        convertedDate: converted,
      };
    }
  }

  /**
   * 查询指定年份的二十四节气交接时刻
   */
  async getJieqi(dto: JieqiQueryDto) {
    const year = dto.year || new Date().getFullYear();

    if (year < 1900 || year > 2100) {
      throw new HttpException(
        {
          type: 'https://bazi.app/errors/year-out-of-range',
          title: '年份超出范围',
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          detail: '年份须在 1900–2100 年范围内',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const jieqiList = getJieqiBoundary(year);

    return {
      year,
      jieqiList: jieqiList.map((j) => ({
        name: j.name,
        datetime: j.datetime.toISOString(),
        description: j.description,
      })),
    };
  }
}