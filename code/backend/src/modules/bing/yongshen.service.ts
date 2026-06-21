import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { deriveYongshen } from './lib/yongshen-engine';

@Injectable()
export class YongshenService {
  constructor(private readonly prisma: PrismaService) {}

  async getYongshen(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
    });

    if (!chart) return null;

    // 获取病机数据
    let bingMachine = await this.prisma.bingMachine.findUnique({ where: { chartId } });
    const dayMasterStrength = await this.prisma.dayMasterStrength.findUnique({ where: { chartId } });

    const strength = dayMasterStrength?.strength || 'strong';
    const diseases = bingMachine ? (bingMachine.diseases as Array<{ type: string; name: string; diseaseSource: string }>) || [] : [];

    const result = deriveYongshen(strength, chart.dayMasterElement, diseases);

    // 保存到数据库
    await this.prisma.yongShenJiXi.upsert({
      where: { chartId },
      create: {
        chartId,
        yongShen: result.yongShen as any,
        xiShen: result.xiShen as any,
        jiShen: result.jiShen as any,
        chouShen: result.chouShen as any,
        xianShen: result.xianShen as any,
        derivationChains: result.derivationChains as any,
      },
      update: {
        yongShen: result.yongShen as any,
        xiShen: result.xiShen as any,
        jiShen: result.jiShen as any,
        chouShen: result.chouShen as any,
        xianShen: result.xianShen as any,
        derivationChains: result.derivationChains as any,
      },
    });

    return {
      chartId,
      ...result,
      createdAt: new Date().toISOString(),
    };
  }
}