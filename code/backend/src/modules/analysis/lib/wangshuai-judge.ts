/**
 * 日主旺衰判定逻辑
 * Module 02: Analysis (五行与十神分析模块) — Task D-4
 */
import { TIANGAN_WUXING, DIZHI_WUXING, DIZHI_CANGGAN, TIANGAN } from '../../chart/lib/sizhu';

export interface DeLingResult {
  result: boolean;
  monthBranchElement: string;
  relation: string;
  description: string;
}

export interface DeDiResult {
  result: boolean;
  branches: Array<{ position: string; branch: string; element: string; isRoot: boolean }>;
  description: string;
}

export interface DeZhuResult {
  result: boolean;
  helpingStems: Array<{ position: string; stem: string; relation: string }>;
  description: string;
}

export interface WangShuaiResult {
  dayMaster: string;
  dayMasterElement: string;
  deLing: DeLingResult;
  deDi: DeDiResult;
  deZhu: DeZhuResult;
  strength: 'strong' | 'weak' | 'extremely_strong' | 'extremely_weak';
  strengthLabel: string;
}

/**
 * 得令判定 — 月令地支五行是否生扶日主
 */
export function judgeDeLing(dayMasterElement: string, monthBranch: string): DeLingResult {
  const monthElement = DIZHI_WUXING[monthBranch];

  // 五行生扶关系：木生火、火生土、土生金、金生水、水生木
  const shengMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  // 同类：同属一行
  const isSame = monthElement === dayMasterElement;
  // 生扶：月令生扶日主
  const isShengFu = shengMap[monthElement] === dayMasterElement;

  const result = isSame || isShengFu;
  let relation: string;
  if (isSame) {
    relation = '同类';
  } else if (isShengFu) {
    relation = '生扶';
  } else {
    relation = '克泄';
  }

  return {
    result,
    monthBranchElement: monthElement,
    relation,
    description: result
      ? `月令地支五行（${monthElement}）${relation}日主五行（${dayMasterElement}），日主得令`
      : `月令地支五行（${monthElement}）${relation}日主五行（${dayMasterElement}），日主不得令`,
  };
}

/**
 * 得地判定 — 日主在地支是否有根
 */
export function judgeDeDi(
  dayMasterElement: string,
  positions: Array<{ position: string; branch: string }>,
): DeDiResult {
  const shengMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const rootBranches: Array<{ position: string; branch: string; element: string; isRoot: boolean }> = [];

  for (const { position, branch } of positions) {
    const branchElement = DIZHI_WUXING[branch];
    if (branchElement === dayMasterElement) {
      // 同类为根
      rootBranches.push({ position, branch, element: branchElement, isRoot: true });
    } else if (shengMap[branchElement] === dayMasterElement) {
      // 生扶也为根（较弱）
      rootBranches.push({ position, branch, element: branchElement, isRoot: false });
    }
  }

  const result = rootBranches.length > 0;
  return {
    result,
    branches: rootBranches,
    description: result
      ? `日主在地支有根，得地`
      : `日主在地支无根，不得地`,
  };
}

/**
 * 得助判定 — 天干是否有同类或生扶日主者
 */
export function judgeDeZhu(
  dayMasterElement: string,
  dayStem: string,
  stems: Array<{ position: string; stem: string }>,
): DeZhuResult {
  const shengMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const helpingStems: Array<{ position: string; stem: string; relation: string }> = [];

  for (const { position, stem } of stems) {
    if (position === 'day') continue; // 日主本身不算
    const stemElement = TIANGAN_WUXING[stem];
    if (stemElement === dayMasterElement) {
      helpingStems.push({ position, stem, relation: '同类' });
    } else if (shengMap[stemElement] === dayMasterElement) {
      helpingStems.push({ position, stem, relation: '生扶' });
    }
  }

  const result = helpingStems.length > 0;
  return {
    result,
    helpingStems,
    description: result
      ? `天干有同类或生扶日主者，得助`
      : `天干无同类或生扶日主者，不得助`,
  };
}

/**
 * 综合判定日主旺衰结论
 */
export function judgeDayMasterStrength(
  dayMaster: string,
  dayMasterElement: string,
  monthBranch: string,
  positions: Array<{ position: string; branch: string }>,
  stems: Array<{ position: string; stem: string }>,
): WangShuaiResult {
  const deLing = judgeDeLing(dayMasterElement, monthBranch);
  const deDi = judgeDeDi(dayMasterElement, positions);
  const deZhu = judgeDeZhu(dayMasterElement, dayMaster, stems);

  // 计算得分
  let score = 0;
  if (deLing.result) score += 2;
  if (deDi.result) score += 1;
  if (deZhu.result) score += 1;

  let strength: 'strong' | 'weak' | 'extremely_strong' | 'extremely_weak';
  let strengthLabel: string;

  if (score >= 4) {
    strength = 'extremely_strong';
    strengthLabel = '从强';
  } else if (score >= 3) {
    strength = 'strong';
    strengthLabel = '身旺';
  } else if (score <= 0) {
    strength = 'extremely_weak';
    strengthLabel = '从弱';
  } else {
    strength = 'weak';
    strengthLabel = '身弱';
  }

  return {
    dayMaster,
    dayMasterElement,
    deLing,
    deDi,
    deZhu,
    strength,
    strengthLabel,
  };
}