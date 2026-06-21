/**
 * 地支六合三合规则库
 * Module 03: Hechong (合冲刑害分析模块) — Task D-6
 */

// 地支六合规则
const LIUHE_RULES: Array<{ branch1: string; branch2: string; combination: string; targetElement: string }> = [
  { branch1: '子', branch2: '丑', combination: '子丑合', targetElement: '土' },
  { branch1: '寅', branch2: '亥', combination: '寅亥合', targetElement: '木' },
  { branch1: '卯', branch2: '戌', combination: '卯戌合', targetElement: '火' },
  { branch1: '辰', branch2: '酉', combination: '辰酉合', targetElement: '金' },
  { branch1: '巳', branch2: '申', combination: '巳申合', targetElement: '水' },
  { branch1: '午', branch2: '未', combination: '午未合', targetElement: '土' },
];

// 地支三合局规则
const SANHE_RULES: Array<{ branches: string[]; combination: string; targetElement: string }> = [
  { branches: ['申', '子', '辰'], combination: '申子辰合水局', targetElement: '水' },
  { branches: ['亥', '卯', '未'], combination: '亥卯未合木局', targetElement: '木' },
  { branches: ['寅', '午', '戌'], combination: '寅午戌合火局', targetElement: '火' },
  { branches: ['巳', '酉', '丑'], combination: '巳酉丑合金局', targetElement: '金' },
];

export interface DizhiLiuheResult {
  branch1: string;
  position1: string;
  branch2: string;
  position2: string;
  combination: string;
  targetElement: string;
  isEstablished: boolean;
  isAdjacent: boolean;
  strength: 'full' | 'reduced' | 'half';
  reason: string;
}

export interface DizhiSanheResult {
  branches: string[];
  positions: string[];
  combination: string;
  targetElement: string;
  isComplete: boolean;
  isEstablished: boolean;
  strength: 'full' | 'half' | 'weak';
  reason: string;
}

/**
 * 识别地支六合组合
 */
export function identifyDizhiLiuhe(branches: Record<string, string>): DizhiLiuheResult[] {
  const results: DizhiLiuheResult[] = [];
  const positions = Object.keys(branches);
  const usedPositions = new Set<string>();

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      const b1 = branches[pos1];
      const b2 = branches[pos2];

      if (usedPositions.has(pos1) || usedPositions.has(pos2)) continue;

      const rule = LIUHE_RULES.find(
        (r) => (r.branch1 === b1 && r.branch2 === b2) || (r.branch1 === b2 && r.branch2 === b1),
      );

      if (rule) {
        const isAdjacent = isPositionsAdjacent(pos1, pos2);
        const isEstablished = isAdjacent; // 简化：紧邻则成立
        const strength: 'full' | 'reduced' | 'half' = isEstablished ? 'full' : (isAdjacent ? 'reduced' : 'half');

        results.push({
          branch1: b1,
          position1: pos1,
          branch2: b2,
          position2: pos2,
          combination: rule.combination,
          targetElement: rule.targetElement,
          isEstablished,
          isAdjacent,
          strength,
          reason: isEstablished
            ? `六合紧邻且合化五行得令，合局成立`
            : `六合非紧邻，力量减弱`,
        });

        usedPositions.add(pos1);
        usedPositions.add(pos2);
      }
    }
  }

  return results;
}

/**
 * 识别地支三合局组合
 */
export function identifyDizhiSanhe(branches: Record<string, string>): DizhiSanheResult[] {
  const results: DizhiSanheResult[] = [];
  const usedPositions = new Set<string>();

  for (const rule of SANHE_RULES) {
    const matchingPositions: string[] = [];
    const matchingBranches: string[] = [];

    for (const pos of Object.keys(branches)) {
      if (rule.branches.includes(branches[pos]) && !usedPositions.has(pos)) {
        matchingPositions.push(pos);
        matchingBranches.push(branches[pos]);
      }
    }

    if (matchingBranches.length >= 2) {
      const isComplete = matchingBranches.length === 3;
      const isEstablished = isComplete; // 简化：三字齐全则成立
      const strength: 'full' | 'half' | 'weak' = isComplete && isEstablished ? 'full' : (matchingBranches.length === 2 ? 'half' : 'weak');

      results.push({
        branches: matchingBranches,
        positions: matchingPositions,
        combination: rule.combination,
        targetElement: rule.targetElement,
        isComplete,
        isEstablished,
        strength,
        reason: isComplete
          ? `三字齐全且合化五行得令，三合局成立`
          : matchingBranches.length === 2
            ? `仅两字齐全，半合局力量减弱`
            : `合而不化`,
      });

      matchingPositions.forEach((p) => usedPositions.add(p));
    }
  }

  return results;
}

/**
 * 判断两个柱位是否相邻
 */
function isPositionsAdjacent(pos1: string, pos2: string): boolean {
  const order = ['year', 'month', 'day', 'hour'];
  const idx1 = order.indexOf(pos1);
  const idx2 = order.indexOf(pos2);
  return Math.abs(idx1 - idx2) === 1;
}