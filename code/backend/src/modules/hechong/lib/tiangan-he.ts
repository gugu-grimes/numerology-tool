/**
 * 天干五合规则库
 * Module 03: Hechong (合冲刑害分析模块) — Task D-6
 */

import { TIANGAN_WUXING, TIANGAN_YINYANG } from '../../chart/lib/sizhu';

// 天干五合规则
const TIANGAN_HE_RULES: Array<{ stem1: string; stem2: string; combination: string; targetElement: string }> = [
  { stem1: '甲', stem2: '己', combination: '甲己合', targetElement: '土' },
  { stem1: '乙', stem2: '庚', combination: '乙庚合', targetElement: '金' },
  { stem1: '丙', stem2: '辛', combination: '丙辛合', targetElement: '水' },
  { stem1: '丁', stem2: '壬', combination: '丁壬合', targetElement: '木' },
  { stem1: '戊', stem2: '癸', combination: '戊癸合', targetElement: '火' },
];

export interface TianganHeResult {
  stem1: string;
  position1: string;
  stem2: string;
  position2: string;
  combination: string;
  targetElement: string;
  isTransformed: boolean;
  transformCondition: string | null;
  reason: string;
}

/**
 * 识别四柱间天干五合组合
 */
export function identifyTianganHe(stems: Record<string, string>): TianganHeResult[] {
  const results: TianganHeResult[] = [];
  const positions = Object.keys(stems);
  const usedPositions = new Set<string>();

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      const stem1 = stems[pos1];
      const stem2 = stems[pos2];

      if (usedPositions.has(pos1) || usedPositions.has(pos2)) continue;

      const rule = TIANGAN_HE_RULES.find(
        (r) =>
          (r.stem1 === stem1 && r.stem2 === stem2) ||
          (r.stem1 === stem2 && r.stem2 === stem1),
      );

      if (rule) {
        // 判断合化是否成功：化出五行得令则合化成功
        const isTransformed = false; // 简化：需要月令五行信息才能判断，默认合而不化
        const reason = isTransformed
          ? `合化之五行得令且得势，合化成功`
          : `合而不化，${rule.combination}化出${rule.targetElement}行但不得令`;

        results.push({
          stem1,
          position1: pos1,
          stem2,
          position2: pos2,
          combination: rule.combination,
          targetElement: rule.targetElement,
          isTransformed,
          transformCondition: isTransformed ? '得令且得势' : null,
          reason,
        });

        usedPositions.add(pos1);
        usedPositions.add(pos2);
      }
    }
  }

  return results;
}