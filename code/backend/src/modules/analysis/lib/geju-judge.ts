/**
 * 格局取法与喜忌推导逻辑
 * Module 02: Analysis (五行与十神分析模块) — Task D-5
 */
import { DIZHI_WUXING, DIZHI_CANGGAN } from '../../chart/lib/sizhu';
import { calculateShishenForStem } from './shishen-calculator';

export interface GejuResult {
  monthBranchGod: string;
  patternType: string;
  isEstablished: boolean;
  breakReason: string | null;
  favorableElements: string[];
  favorableGods: string[];
  unfavorableElements: string[];
  unfavorableGods: string[];
  neutralElements: string[];
}

// 格局类型映射（月令本气十神 → 格局名称）
const GEJU_MAP: Record<string, string> = {
  '正官': '正官格',
  '偏官': '偏官格（七杀格）',
  '正印': '正印格',
  '偏印': '偏印格',
  '正财': '正财格',
  '偏财': '偏财格',
  '食神': '食神格',
  '伤官': '伤官格',
};

// 五行生克关系
const WUXING_SHENG: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const WUXING_KE: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

/**
 * 确定格局类型（月令本气十神取格）
 */
export function determineGejuType(monthBranchGod: string): string {
  return GEJU_MAP[monthBranchGod] || '普通格';
}

/**
 * 判断格局是否成立
 */
export function judgeGejuEstablished(
  monthBranchGod: string,
  dayMasterElement: string,
  strength: string,
): { isEstablished: boolean; breakReason: string | null } {
  // 简化逻辑：正官格、偏官格、正印格等通常能成立
  // 破格条件：日主过弱无法胜任格局、官杀过多等

  if (strength === 'extremely_weak' || strength === 'extremely_strong') {
    return {
      isEstablished: false,
      breakReason: `日主${strength === 'extremely_weak' ? '从弱' : '从强'}，无法成格`,
    };
  }

  // 格局成立的简化判定
  const unstableGods = ['偏官', '伤官'];
  if (unstableGods.includes(monthBranchGod) && strength === 'weak') {
    return {
      isEstablished: false,
      breakReason: `${monthBranchGod}格日主身弱，难以胜任`,
    };
  }

  return { isEstablished: true, breakReason: null };
}

/**
 * 推导喜神忌神
 */
export function deriveXiji(
  dayMasterElement: string,
  strength: string,
  patternType: string,
): {
  favorableElements: string[];
  favorableGods: string[];
  unfavorableElements: string[];
  unfavorableGods: string[];
  neutralElements: string[];
} {
  const allElements = ['金', '木', '水', '火', '土'];
  const shengMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const keMap: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

  let favorableElements: string[] = [];
  let unfavorableElements: string[] = [];
  let neutralElements: string[] = [];

  if (strength === 'strong' || strength === 'extremely_strong') {
    // 身旺：克泄耗为喜（克我、我生、我克的五行）
    favorableElements = [keMap[dayMasterElement], shengMap[dayMasterElement], dayMasterElement === '木' ? '土' : keMap[dayMasterElement]];
    // 生扶为忌（生我、同类的五行）
    unfavorableElements = [
      Object.entries(shengMap).find(([k, v]) => v === dayMasterElement)?.[0] || '',
      dayMasterElement,
    ].filter(Boolean);
  } else {
    // 身弱：生扶为喜（生我、同类的五行）
    favorableElements = [
      Object.entries(shengMap).find(([k, v]) => v === dayMasterElement)?.[0] || '',
      dayMasterElement,
    ].filter(Boolean);
    // 克泄耗为忌
    unfavorableElements = [keMap[dayMasterElement], shengMap[dayMasterElement]].filter(Boolean);
  }

  neutralElements = allElements.filter((e) => !favorableElements.includes(e) && !unfavorableElements.includes(e));

  return {
    favorableElements: [...new Set(favorableElements)],
    favorableGods: [],
    unfavorableElements: [...new Set(unfavorableElements)],
    unfavorableGods: [],
    neutralElements: [...new Set(neutralElements)],
  };
}

/**
 * 完整的格局判定与喜忌推导
 */
export function determineGeju(
  dayMaster: string,
  dayMasterElement: string,
  monthBranch: string,
  strength: string,
): GejuResult {
  // 确定月令本气十神
  const monthMainQi = DIZHI_CANGGAN[monthBranch]?.mainQi || '';
  const monthBranchGod = calculateShishenForStem(dayMaster, monthMainQi);

  // 确定格局类型
  const patternType = determineGejuType(monthBranchGod);

  // 判断格局是否成立
  const { isEstablished, breakReason } = judgeGejuEstablished(monthBranchGod, dayMasterElement, strength);

  // 推导喜忌
  const xiji = deriveXiji(dayMasterElement, strength, patternType);

  return {
    monthBranchGod,
    patternType,
    isEstablished,
    breakReason,
    ...xiji,
  };
}