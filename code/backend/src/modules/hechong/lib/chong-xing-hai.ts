/**
 * 六冲三刑六害自刑规则库
 * Module 03: Hechong (合冲刑害分析模块) — Task D-7
 */

// 六冲规则（地支六冲）
const LIUCHONG_RULES: Array<{ branch1: string; branch2: string; combination: string }> = [
  { branch1: '子', branch2: '午', combination: '子午冲' },
  { branch1: '丑', branch2: '未', combination: '丑未冲' },
  { branch1: '寅', branch2: '申', combination: '寅申冲' },
  { branch1: '卯', branch2: '酉', combination: '卯酉冲' },
  { branch1: '辰', branch2: '戌', combination: '辰戌冲' },
  { branch1: '巳', branch2: '亥', combination: '巳亥冲' },
];

// 三刑规则
const SANXING_RULES: Array<{ branches: string[]; combination: string; xingType: string }> = [
  { branches: ['寅', '巳', '申'], combination: '寅巳申三刑', xingType: '无恩之刑' },
  { branches: ['丑', '戌', '未'], combination: '丑戌未三刑', xingType: '持势之刑' },
  { branches: ['子', '卯'], combination: '子卯刑', xingType: '无礼之刑' },
];

// 六害规则
const LIUHAI_RULES: Array<{ branch1: string; branch2: string; combination: string }> = [
  { branch1: '子', branch2: '未', combination: '子未害' },
  { branch1: '丑', branch2: '午', combination: '丑午害' },
  { branch1: '寅', branch2: '巳', combination: '寅巳害' },
  { branch1: '卯', branch2: '辰', combination: '卯辰害' },
  { branch1: '申', branch2: '亥', combination: '申亥害' },
  { branch1: '酉', branch2: '戌', combination: '酉戌害' },
];

// 自刑规则
const ZIXING_RULES: string[] = ['辰', '午', '酉', '亥'];

export interface ChongResult {
  branch1: string; position1: string; branch2: string; position2: string;
  combination: string; direction: string; affectedGod: string; impact: string;
}

export interface XingResult {
  branches: string[]; positions: string[]; combination: string;
  xingType: string; affectedPart: string; impact: string;
}

export interface HaiResult {
  branch1: string; position1: string; branch2: string; position2: string;
  combination: string; direction: string; affectedGod: string; impact: string;
}

export interface ZiXingResult {
  branch: string; position: string; combination: string; impact: string;
}

/**
 * 识别六冲组合
 */
export function identifyChong(branches: Record<string, string>): ChongResult[] {
  const results: ChongResult[] = [];
  const positions = Object.keys(branches);

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      const b1 = branches[pos1];
      const b2 = branches[pos2];

      const rule = LIUCHONG_RULES.find(
        (r) => (r.branch1 === b1 && r.branch2 === b2) || (r.branch1 === b2 && r.branch2 === b1),
      );

      if (rule) {
        results.push({
          branch1: b1, position1: pos1,
          branch2: b2, position2: pos2,
          combination: rule.combination,
          direction: `${b1}冲${b2}`,
          affectedGod: '待定',
          impact: `${rule.combination}，冲力对命局产生影响`,
        });
      }
    }
  }
  return results;
}

/**
 * 识别三刑组合
 */
export function identifyXing(branches: Record<string, string>): XingResult[] {
  const results: XingResult[] = [];
  const branchList = Object.entries(branches);

  for (const rule of SANXING_RULES) {
    const matching: Array<{ branch: string; position: string }> = [];
    for (const [pos, branch] of branchList) {
      if (rule.branches.includes(branch)) {
        matching.push({ branch, position: pos });
      }
    }

    if (rule.branches.length === 3 && matching.length >= 2) {
      results.push({
        branches: matching.map((m) => m.branch),
        positions: matching.map((m) => m.position),
        combination: rule.combination,
        xingType: rule.xingType,
        affectedPart: matching[0]?.position === 'day' ? '日支' : matching[0]?.position + '支',
        impact: `${rule.combination}（${rule.xingType}），刑力影响运势`,
      });
    } else if (rule.branches.length === 2 && matching.length >= 2) {
      results.push({
        branches: matching.map((m) => m.branch),
        positions: matching.map((m) => m.position),
        combination: rule.combination,
        xingType: rule.xingType,
        affectedPart: matching[0]?.position + '支',
        impact: `${rule.combination}（${rule.xingType}），刑力影响命局`,
      });
    }
  }
  return results;
}

/**
 * 识别六害组合
 */
export function identifyHai(branches: Record<string, string>): HaiResult[] {
  const results: HaiResult[] = [];
  const positions = Object.keys(branches);

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const pos1 = positions[i];
      const pos2 = positions[j];
      const b1 = branches[pos1];
      const b2 = branches[pos2];

      const rule = LIUHAI_RULES.find(
        (r) => (r.branch1 === b1 && r.branch2 === b2) || (r.branch1 === b2 && r.branch2 === b1),
      );

      if (rule) {
        results.push({
          branch1: b1, position1: pos1,
          branch2: b2, position2: pos2,
          combination: rule.combination,
          direction: `${b1}害${b2}`,
          affectedGod: '待定',
          impact: `${rule.combination}，害力影响命局`,
        });
      }
    }
  }
  return results;
}

/**
 * 识别自刑
 */
export function identifyZiXing(branches: Record<string, string>): ZiXingResult[] {
  const results: ZiXingResult[] = [];
  const branchCounts: Record<string, string[]> = {};

  for (const [pos, branch] of Object.entries(branches)) {
    if (!branchCounts[branch]) branchCounts[branch] = [];
    branchCounts[branch].push(pos);
  }

  for (const [branch, positions] of Object.entries(branchCounts)) {
    if (ZIXING_RULES.includes(branch) && positions.length >= 2) {
      for (let i = 0; i < positions.length - 1; i++) {
        results.push({
          branch,
          position: positions[i],
          combination: `${branch}${branch}自刑`,
          impact: `${branch}${branch}自刑，主内心矛盾，运势不稳`,
        });
      }
    }
  }
  return results;
}