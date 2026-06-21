import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { determineGeju } from './lib/geju-judge';

@Injectable()
export class GejuService {
  constructor(private readonly prisma: PrismaService) {}

  async getGeju(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    // 检查旺衰判定是否存在
    let dayMasterStrength = await this.prisma.dayMasterStrength.findUnique({
      where: { chartId },
    });

    const strength = dayMasterStrength?.strength || 'strong';
    const monthBranch = chart.pillars.find((p) => p.position === 'month')?.earthlyBranch || '';

    const result = determineGeju(
      chart.dayMaster,
      chart.dayMasterElement,
      monthBranch,
      strength,
    );

    // 保存到数据库
    await this.prisma.gejuPattern.upsert({
      where: { chartId },
      create: {
        chartId,
        monthBranchGod: result.monthBranchGod,
        patternType: result.patternType,
        isEstablished: result.isEstablished,
        breakReason: result.breakReason,
        favorableElements: result.favorableElements,
        favorableGods: result.favorableGods,
        unfavorableElements: result.unfavorableElements,
        unfavorableGods: result.unfavorableGods,
        neutralElements: result.neutralElements,
      },
      update: {
        monthBranchGod: result.monthBranchGod,
        patternType: result.patternType,
        isEstablished: result.isEstablished,
        breakReason: result.breakReason,
        favorableElements: result.favorableElements,
        favorableGods: result.favorableGods,
        unfavorableElements: result.unfavorableElements,
        unfavorableGods: result.unfavorableGods,
        neutralElements: result.neutralElements,
      },
    });

    return {
      chartId,
      ...result,
      createdAt: new Date().toISOString(),
    };
  }
}