import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CalculateChartDto } from './dto/chart.dto';
import {
  calculateFourPillars,
  calculateYearPillar,
  calculateMonthPillar,
  calculateDayPillar,
  calculateHourPillar,
  identifyDayMaster,
  validateChartInput,
  handleZiHour,
  getJieqiMonth,
  TIANGAN,
  DIZHI,
  TIANGAN_WUXING,
  DIZHI_WUXING,
  DIZHI_CANGGAN,
  NAYIN_TABLE,
} from './lib/sizhu';
import type { FourPillars, JieqiInfo } from './lib/sizhu';

@Injectable()
export class ChartService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 计算八字排盘并保存结果
   */
  async calculate(dto: CalculateChartDto) {
    // 1. 校验输入
    const validation = validateChartInput(dto);
    if (!validation.valid) {
      throw new HttpException(
        {
          type: 'https://bazi.app/errors/invalid-input',
          title: '输入校验失败',
          status: HttpStatus.BAD_REQUEST,
          detail: validation.errors.join('; '),
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 2. 农历转公历（如需要）
    let solarDate: Date;
    let lunarBirthInfo: any = null;

    if (dto.birthDateType === 'lunar' && dto.lunarBirthInfo) {
      // 使用内置万年历数据库进行转换
      const converted = this.convertLunarToSolar(
        dto.lunarBirthInfo.year,
        dto.lunarBirthInfo.month,
        dto.lunarBirthInfo.day,
        dto.lunarBirthInfo.isLeapMonth || false,
      );
      solarDate = converted;
      lunarBirthInfo = dto.lunarBirthInfo;
    } else {
      solarDate = new Date(dto.birthDate!);
    }

    // 3. 确定节气交接点
    const jieqiInfo = this.determineJieqiBoundary(solarDate);

    // 4. 处理子时日柱归属
    const ziHourResult = handleZiHour(solarDate, dto.zhourule || 'early_zi');

    // 5. 计算四柱
    const pillars = calculateFourPillars(solarDate, jieqiInfo, dto.zhourule || 'early_zi');

    // 6. 识别日主
    const { dayMaster, dayMasterElement } = identifyDayMaster(pillars.day.heavenlyStem);

    // 7. 保存到数据库
    const chart = await this.prisma.chart.create({
      data: {
        birthDate: solarDate,
        birthDateType: dto.birthDateType,
        gender: dto.gender,
        lunarBirthInfo: lunarBirthInfo,
        dayMaster,
        dayMasterElement,
        jieqiName: jieqiInfo.currentJieqi,
        jieqiTime: jieqiInfo.jieqiTime,
        isBeforeLichun: jieqiInfo.isBeforeLichun,
        zhourule: dto.zhourule || 'early_zi',
        pillars: {
          create: [
            {
              position: 'year',
              heavenlyStem: pillars.year.heavenlyStem,
              earthlyBranch: pillars.year.earthlyBranch,
              hiddenStems: pillars.year.hiddenStems,
              nayin: pillars.year.nayin,
            },
            {
              position: 'month',
              heavenlyStem: pillars.month.heavenlyStem,
              earthlyBranch: pillars.month.earthlyBranch,
              hiddenStems: pillars.month.hiddenStems,
              nayin: pillars.month.nayin,
            },
            {
              position: 'day',
              heavenlyStem: pillars.day.heavenlyStem,
              earthlyBranch: pillars.day.earthlyBranch,
              hiddenStems: pillars.day.hiddenStems,
              nayin: pillars.day.nayin,
            },
            {
              position: 'hour',
              heavenlyStem: pillars.hour.heavenlyStem,
              earthlyBranch: pillars.hour.earthlyBranch,
              hiddenStems: pillars.hour.hiddenStems,
              nayin: pillars.hour.nayin,
            },
          ],
        },
      },
      include: { pillars: true },
    });

    return this.formatChartResult(chart, chart.pillars);
  }

  /**
   * 按 ID 获取已保存的排盘结果
   */
  async getChart(id: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    return this.formatChartResult(chart, chart.pillars);
  }

  /**
   * 格式化排盘结果
   */
  private formatChartResult(chart: any, pillars: any[]) {
    const pillarMap: Record<string, any> = {};
    for (const p of pillars) {
      pillarMap[p.position] = {
        position: p.position,
        heavenlyStem: p.heavenlyStem,
        earthlyBranch: p.earthlyBranch,
        hiddenStems: p.hiddenStems,
        nayin: p.nayin,
      };
    }

    return {
      id: chart.id,
      birthDate: chart.birthDate.toISOString(),
      birthDateType: chart.birthDateType,
      gender: chart.gender,
      lunarBirthInfo: chart.lunarBirthInfo,
      dayMaster: chart.dayMaster,
      dayMasterElement: chart.dayMasterElement,
      jieqiName: chart.jieqiName,
      jieqiTime: chart.jieqiTime ? chart.jieqiTime.toISOString() : null,
      isBeforeLichun: chart.isBeforeLichun,
      zhourule: chart.zhourule,
      pillars: [
        pillarMap['year'],
        pillarMap['month'],
        pillarMap['day'],
        pillarMap['hour'],
      ],
      createdAt: chart.createdAt.toISOString(),
    };
  }

  // ==================== 农历公历转换 ====================

  /**
   * 农历转公历 — 简化实现，使用内置万年历对照表
   */
  private convertLunarToSolar(year: number, month: number, day: number, isLeapMonth: boolean): Date {
    // 简化实现：使用1900-2100年对照数据
    // 实际生产中应使用完整的万年历数据库
    // 此处使用近似算法
    const lunarToSolarOffset: Record<number, number> = {
      1900: -31, 1910: -28, 1920: -21, 1930: -20, 1940: -20,
      1950: -31, 1960: -28, 1970: -31, 1980: -30, 1990: -30,
      2000: -30, 2010: -30, 2020: -24, 2030: -31, 2040: -30,
      2050: -31, 2060: -31, 2070: -31, 2080: -31, 2090: -31, 2100: -31,
    };

    const baseYear = Math.floor(year / 10) * 10;
    const offset = lunarToSolarOffset[baseYear] || -30;
    const solarMonth = month;
    const solarDay = day + offset;

    return new Date(Date.UTC(year, solarMonth - 1, solarDay > 0 ? solarDay : day));
  }

  /**
   * 确定出生时刻对应的节气交接点
   */
  private determineJieqiBoundary(solarDate: Date): JieqiInfo {
    // 二十四节气近似计算
    // 实际生产中应使用精确的节气交接时刻数据表
    const year = solarDate.getUTCFullYear();
    const month = solarDate.getUTCMonth() + 1;
    const day = solarDate.getUTCDate();

    // 节气月份映射（近似值，实际应查表）
    const jieqiNames: string[] = [
      '小寒', '立春', '惊蛰', '清明', '立夏', '芒种',
      '小暑', '立秋', '白露', '寒露', '立冬', '大雪',
    ];

    // 根据月份和日期确定当前节气
    const jieqiDays: number[] = [6, 4, 6, 5, 6, 6, 7, 8, 8, 8, 7, 7]; // 近似节气日期
    let currentJieqiIndex = 0;
    let currentJieqi: string;
    let jieqiTime: Date;
    let isBeforeLichun = false;

    // 确定当前节气
    for (let i = 0; i < 12; i++) {
      const jieqiMonth = i + 1;
      if (month === jieqiMonth && day < jieqiDays[i]) {
        currentJieqiIndex = i > 0 ? i - 1 : 11;
        break;
      }
      currentJieqiIndex = i;
    }

    currentJieqi = jieqiNames[currentJieqiIndex];
    jieqiTime = new Date(Date.UTC(year, currentJieqiIndex, jieqiDays[currentJieqiIndex]));

    // 判断是否在立春之前
    const lichunMonth = 1; // 二月
    const lichunDay = 4;
    isBeforeLichun = (month < lichunMonth + 1) || (month === lichunMonth + 1 && day < lichunDay);

    return {
      currentJieqi,
      jieqiTime,
      isBeforeLichun,
    };
  }
}