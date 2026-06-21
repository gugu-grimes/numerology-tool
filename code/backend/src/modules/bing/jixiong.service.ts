import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { judgeJiXiong } from './lib/jixiong-engine';

@Injectable()
export class JiXiongService {
  constructor(private readonly prisma: PrismaService) {}

  async getJiXiong(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
    });

    if (!chart) return null;

    const bingMachine = await this.prisma.bingMachine.findUnique({ where: { chartId } });
    const yongShenJiXi = await this.prisma.yongShenJiXi.findUnique({ where: { chartId } });
    const dayMasterStrength = await this.prisma.dayMasterStrength.findUnique({ where: { chartId } });

    if (!bingMachine || !yongShenJiXi) {
      return null;
    }

    const strength = dayMasterStrength?.strength || 'strong';
    const diseases = (bingMachine.diseases as Array<{ type: string; name: string }>) || [];
    const yongShen = yongShenJiXi.yongShen as any;

    const result = judgeJiXiong(
      strength,
      chart.dayMasterElement,
      { element: yongShen?.element || '', shishen: yongShen?.shishen || '' },
      diseases,
    );

    // 保存到数据库
    await this.prisma.jiXiongVerdict.upsert({
      where: { chartId },
      create: {
        chartId,
        personality: result.personality as any,
        career: result.career as any,
        wealth: result.wealth as any,
        marriage: result.marriage as any,
        health: result.health as any,
        education: result.education as any,
      },
      update: {
        personality: result.personality as any,
        career: result.career as any,
        wealth: result.wealth as any,
        marriage: result.marriage as any,
        health: result.health as any,
        education: result.education as any,
      },
    });

    return {
      chartId,
      ...result,
      createdAt: new Date().toISOString(),
    };
  }
}