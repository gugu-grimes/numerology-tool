/**
 * 五行力量统计计算逻辑
 * Module 02: Analysis (五行与十神分析模块) — Task D-4
 */
import { TIANGAN_WUXING, DIZHI_WUXING, DIZHI_CANGGAN } from '../../chart/lib/sizhu';

// 五行力量加权系数
const MONTH_SEASON_WEIGHT = 1.5; // 月令旺衰加权系数

export interface WuxingStatResult {
  metal: number;
  wood: number;
  water: number;
  fire: number;
  earth: number;
  rawCounts: {
    stemCounts: Record<string, number>;
    branchMainQiCounts: Record<string, number>;
  };
  missing: string[];
  dominant: string[];
}

/**
 * 统计天干五行个数
 */
export function countStemElements(stems: string[]): Record<string, number> {
  const counts: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  for (const stem of stems) {
    const element = TIANGAN_WUXING[stem];
    if (element) {
      counts[element]++;
    }
  }
  return counts;
}

/**
 * 统计地支本气五行个数
 */
export function countBranchMainQiElements(branches: string[]): Record<string, number> {
  const counts: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  for (const branch of branches) {
    const element = DIZHI_WUXING[branch];
    if (element) {
      counts[element]++;
    }
  }
  return counts;
}

/**
 * 计算五行力量统计（含月令旺衰加权）
 */
export function calculateWuxingStats(
  stems: string[],
  branches: string[],
  monthBranch: string,
): WuxingStatResult {
  const stemCounts = countStemElements(stems);
  const branchMainQiCounts = countBranchMainQiElements(branches);

  // 月令五行得到加权
  const monthElement = DIZHI_WUXING[monthBranch] || '';

  // 合计五行力量（月令五行加权）
  const weights: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };

  for (const element of ['金', '木', '水', '火', '土']) {
    weights[element] = stemCounts[element] * 1.0 + branchMainQiCounts[element] * 1.0;
    // 月令五行加权
    if (element === monthElement) {
      weights[element] += MONTH_SEASON_WEIGHT;
    }
  }

  // 识别缺失与过旺
  const missing: string[] = [];
  const dominant: string[] = [];
  const avgWeight = (weights['金'] + weights['木'] + weights['水'] + weights['火'] + weights['土']) / 5;

  for (const element of ['金', '木', '水', '火', '土']) {
    if (weights[element] === 0) {
      missing.push(element);
    } else if (weights[element] > avgWeight * 1.5) {
      dominant.push(element);
    }
  }

  return {
    metal: weights['金'],
    wood: weights['木'],
    water: weights['水'],
    fire: weights['火'],
    earth: weights['土'],
    rawCounts: { stemCounts, branchMainQiCounts },
    missing,
    dominant,
  };
}

/**
 * 识别五行缺失与过旺
 */
export function identifyMissingAndExcess(stats: WuxingStatResult): { missing: string[]; dominant: string[] } {
  return {
    missing: stats.missing,
    dominant: stats.dominant,
  };
}