/**
 * 合冲刑害辨病判定逻辑
 * Module 03: Hechong (合冲刑害分析模块) — Task D-7
 */

export interface BingJudgment {
  type: string;
  source: string;
  description: string;
  severity: 'severe' | 'moderate' | 'mild';
  bingWei: string;
  bingXiang: string;
}

/**
 * 评估合冲刑害辨病
 * 依赖天干合化、地支合局、冲刑害识别结果
 */
export function evaluateHechongBing(
  tianganHe: any[],
  hechongRelations: { liuchong: any[]; sanxing: any[]; liuhai: any[]; ziXing: any[] },
  yongShenInfo?: { element: string; shishen: string },
): BingJudgment[] {
  const judgments: BingJudgment[] = [];

  // 1. 合绊用神病机
  if (yongShenInfo) {
    for (const he of tianganHe) {
      // 简化：如果合化涉及的干支与用神五行相关
      const isBindingYongShen = he.stem1 === yongShenInfo.element || he.stem2 === yongShenInfo.element;
      if (isBindingYongShen) {
        judgments.push({
          type: '合绊用神',
          source: he.combination,
          description: `${he.combination}合绊用神${yongShenInfo.element}，用神效力减弱`,
          severity: he.isTransformed ? 'moderate' : 'severe',
          bingWei: `用神${yongShenInfo.element}`,
          bingXiang: he.isTransformed ? '合化后部分失力' : '合绊用神完全失力',
        });
      }
    }
  }

  // 2. 冲破格局病机
  for (const chong of hechongRelations.liuchong) {
    judgments.push({
      type: '冲破格局',
      source: chong.combination,
      description: `${chong.combination}冲破命局平衡`,
      severity: 'moderate',
      bingWei: `${chong.branch1}${chong.branch2}冲位`,
      bingXiang: chong.impact,
    });
  }

  // 3. 刑害伤喜神病机
  for (const xing of hechongRelations.sanxing) {
    judgments.push({
      type: '刑伤喜神',
      source: xing.combination,
      description: `${xing.combination}（${xing.xingType}）刑力伤及命局`,
      severity: 'moderate',
      bingWei: xing.affectedPart,
      bingXiang: xing.impact,
    });
  }

  for (const hai of hechongRelations.liuhai) {
    judgments.push({
      type: '害伤喜神',
      source: hai.combination,
      description: `${hai.combination}害力伤及命局`,
      severity: 'mild',
      bingWei: `${hai.branch1}${hai.branch2}害位`,
      bingXiang: hai.impact,
    });
  }

  // 无病机情况
  if (judgments.length === 0) {
    judgments.push({
      type: '未构成病机',
      source: '无',
      description: '合冲刑害未构成病机',
      severity: 'mild',
      bingWei: '无',
      bingXiang: '命局无明显病机',
    });
  }

  return judgments;
}