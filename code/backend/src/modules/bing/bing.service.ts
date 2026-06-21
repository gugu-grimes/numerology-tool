import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { detectBing } from './lib/bing-detector';

@Injectable()
export class BingService {
  constructor(private readonly prisma: PrismaService) {}

  async diagnose(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    // 获取依赖数据
    const wuxingStat = await this.prisma.wuxingStat.findUnique({ where: { chartId } });
    const dayMasterStrength = await this.prisma.dayMasterStrength.findUnique({ where: { chartId } });
    const shishenLabel = await this.prisma.shishenLabel.findUnique({ where: { chartId } });
    const gejuPattern = await this.prisma.gejuPattern.findUnique({ where: { chartId } });
    const hechongRelation = await this.prisma.hechongRelation.findUnique({ where: { chartId } });

    const strength = dayMasterStrength?.strength || 'strong';

    // 检测八大病机
    const result = detectBing(
      strength,
      chart.dayMasterElement,
      wuxingStat ? { metal: wuxingStat.metal, wood: wuxingStat.wood, water: wuxingStat.water, fire: wuxingStat.fire, earth: wuxingStat.earth, missing: (wuxingStat.missing as string[]) || [], dominant: (wuxingStat.dominant as string[]) || [] } : { metal: 1, wood: 1, water: 1, fire: 1, earth: 1, missing: [], dominant: [] },
      shishenLabel,
      gejuPattern,
      hechongRelation ? (hechongRelation.bingJudgments as any[]) || [] : [],
    );

    // 保存到数据库
    await this.prisma.bingMachine.upsert({
      where: { chartId },
      create: {
        chartId,
        diseases: result.diseases as any,
        dayMasterExcess: result.dayMasterExcess as any,
        dayMasterWeakness: result.dayMasterWeakness as any,
        wuxingImbalance: result.wuxingImbalance as any,
        wuxingAbsence: result.wuxingAbsence as any,
        shishenConflict: result.shishenConflict as any,
        gejuBreak: result.gejuBreak as any,
        heBindYongShen: result.heBindYongShen as any,
        temperatureImbalance: result.temperatureImbalance as any,
      },
      update: {
        diseases: result.diseases as any,
        dayMasterExcess: result.dayMasterExcess as any,
        dayMasterWeakness: result.dayMasterWeakness as any,
        wuxingImbalance: result.wuxingImbalance as any,
        wuxingAbsence: result.wuxingAbsence as any,
        shishenConflict: result.shishenConflict as any,
        gejuBreak: result.gejuBreak as any,
        heBindYongShen: result.heBindYongShen as any,
        temperatureImbalance: result.temperatureImbalance as any,
      },
    });

    return {
      chartId,
      ...result,
      createdAt: new Date().toISOString(),
    };
  }
}