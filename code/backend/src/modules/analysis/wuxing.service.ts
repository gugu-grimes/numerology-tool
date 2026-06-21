import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { calculateWuxingStats } from './lib/wuxing-calculator';

@Injectable()
export class WuxingService {
  constructor(private readonly prisma: PrismaService) {}

  async getWuxing(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    const pillars = chart.pillars;
    const stems = pillars.map((p) => p.heavenlyStem);
    const branches = pillars.map((p) => p.earthlyBranch);
    const monthBranch = pillars.find((p) => p.position === 'month')?.earthlyBranch || '';

    const stats = calculateWuxingStats(stems, branches, monthBranch);

    // 保存到数据库
    await this.prisma.wuxingStat.upsert({
      where: { chartId },
      create: {
        chartId,
        metal: stats.metal,
        wood: stats.wood,
        water: stats.water,
        fire: stats.fire,
        earth: stats.earth,
        missing: stats.missing,
        dominant: stats.dominant,
      },
      update: {
        metal: stats.metal,
        wood: stats.wood,
        water: stats.water,
        fire: stats.fire,
        earth: stats.earth,
        missing: stats.missing,
        dominant: stats.dominant,
      },
    });

    return {
      chartId,
      ...stats,
      createdAt: new Date().toISOString(),
    };
  }
}