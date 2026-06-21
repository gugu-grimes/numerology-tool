import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calculateStemShishen, calculateHiddenStemShishen } from './lib/shishen-calculator';
import { DIZHI_CANGGAN } from '../chart/lib/sizhu';

@Injectable()
export class ShishenService {
  constructor(private readonly prisma: PrismaService) {}

  async getShishen(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    const pillars = chart.pillars;
    const dayStem = pillars.find((p) => p.position === 'day')?.heavenlyStem || '';

    // 天干十神标注
    const stems: Record<string, string> = {};
    for (const p of pillars) {
      stems[p.position] = p.heavenlyStem;
    }
    const stemLabels = calculateStemShishen(dayStem, stems);

    // 地支藏干十神标注
    const branches: Record<string, any> = {};
    for (const p of pillars) {
      branches[p.position] = {
        branch: p.earthlyBranch,
        ...DIZHI_CANGGAN[p.earthlyBranch],
      };
    }
    const hiddenStemLabels = calculateHiddenStemShishen(dayStem, branches);

    // 保存到数据库
    await this.prisma.shishenLabel.upsert({
      where: { chartId },
      create: {
        chartId,
        stemLabels: stemLabels as any,
        hiddenStemLabels: hiddenStemLabels as any,
      },
      update: {
        stemLabels: stemLabels as any,
        hiddenStemLabels: hiddenStemLabels as any,
      },
    });

    return {
      chartId,
      stemLabels,
      hiddenStemLabels,
      createdAt: new Date().toISOString(),
    };
  }
}