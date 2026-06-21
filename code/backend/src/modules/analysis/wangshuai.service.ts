import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { judgeDayMasterStrength } from './lib/wangshuai-judge';

@Injectable()
export class WangShuaiService {
  constructor(private readonly prisma: PrismaService) {}

  async getWangShuai(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    const pillars = chart.pillars;
    const dayPillar = pillars.find((p) => p.position === 'day');
    const monthBranch = pillars.find((p) => p.position === 'month')?.earthlyBranch || '';

    const positions = pillars.map((p) => ({ position: p.position, branch: p.earthlyBranch }));
    const stems = pillars.map((p) => ({ position: p.position, stem: p.heavenlyStem }));

    const result = judgeDayMasterStrength(
      chart.dayMaster,
      chart.dayMasterElement,
      monthBranch,
      positions,
      stems,
    );

    // 保存到数据库
    await this.prisma.dayMasterStrength.upsert({
      where: { chartId },
      create: {
        chartId,
        dayMaster: result.dayMaster,
        dayMasterElement: result.dayMasterElement,
        deLing: result.deLing as any,
        deDi: result.deDi as any,
        deZhu: result.deZhu as any,
        strength: result.strength,
        strengthLabel: result.strengthLabel,
      },
      update: {
        dayMaster: result.dayMaster,
        dayMasterElement: result.dayMasterElement,
        deLing: result.deLing as any,
        deDi: result.deDi as any,
        deZhu: result.deZhu as any,
        strength: result.strength,
        strengthLabel: result.strengthLabel,
      },
    });

    return {
      chartId,
      ...result,
      createdAt: new Date().toISOString(),
    };
  }
}