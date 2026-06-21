import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { identifyTianganHe } from './lib/tiangan-he';
import { identifyDizhiLiuhe, identifyDizhiSanhe } from './lib/dizhi-he';
import { identifyChong, identifyXing, identifyHai, identifyZiXing } from './lib/chong-xing-hai';
import { evaluateHechongBing } from './lib/hechong-bing';

@Injectable()
export class HechongService {
  constructor(private readonly prisma: PrismaService) {}

  async getRelations(chartId: number) {
    const chart = await this.prisma.chart.findUnique({
      where: { id: chartId, deletedAt: null },
      include: { pillars: true },
    });

    if (!chart) return null;

    const pillars = chart.pillars;
    const stems: Record<string, string> = {};
    const branches: Record<string, string> = {};
    for (const p of pillars) {
      stems[p.position] = p.heavenlyStem;
      branches[p.position] = p.earthlyBranch;
    }

    // 识别天干五合
    const tianganHe = identifyTianganHe(stems);

    // 识别地支六合三合
    const dizhiLiuhe = identifyDizhiLiuhe(branches);
    const dizhiSanhe = identifyDizhiSanhe(branches);

    // 识别冲刑害
    const liuchong = identifyChong(branches);
    const sanxing = identifyXing(branches);
    const liuhai = identifyHai(branches);
    const ziXing = identifyZiXing(branches);

    // 辨病判定
    const bingJudgments = evaluateHechongBing(
      tianganHe,
      { liuchong, sanxing, liuhai, ziXing },
    );

    // 保存到数据库
    await this.prisma.hechongRelation.upsert({
      where: { chartId },
      create: {
        chartId,
        tianganHe: tianganHe as any,
        dizhiLiuhe: dizhiLiuhe as any,
        dizhiSanhe: dizhiSanhe as any,
        liuchong: liuchong as any,
        sanxing: sanxing as any,
        liuhai: liuhai as any,
        ziXing: ziXing as any,
        bingJudgments: bingJudgments as any,
      },
      update: {
        tianganHe: tianganHe as any,
        dizhiLiuhe: dizhiLiuhe as any,
        dizhiSanhe: dizhiSanhe as any,
        liuchong: liuchong as any,
        sanxing: sanxing as any,
        liuhai: liuhai as any,
        ziXing: ziXing as any,
        bingJudgments: bingJudgments as any,
      },
    });

    return {
      chartId,
      tianganHe,
      dizhiLiuhe,
      dizhiSanhe,
      liuchong,
      sanxing,
      liuhai,
      ziXing,
      bingJudgments,
      createdAt: new Date().toISOString(),
    };
  }
}