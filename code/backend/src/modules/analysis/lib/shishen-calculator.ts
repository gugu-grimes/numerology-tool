/**
 * 十神取法核心逻辑
 * Module 02: Analysis (五行与十神分析模块) — Task D-5
 */
import { TIANGAN_WUXING, TIANGAN_YINYANG } from '../../chart/lib/sizhu';

// 十神名称表（日主五行 × 他干五行 × 阴阳关系）
const SHISHEN_TABLE: Record<string, Record<string, string>> = {
  // 同行：比肩/劫财
  '同类同类': '比肩', '同类异类': '劫财',
  // 我生：食神/伤官
  '我生同类': '食神', '我生异类': '伤官',
  // 我克：偏财/正财
  '我克同类': '偏财', '我克异类': '正财',
  // 克我：偏官/正官（七杀/正官）
  '克我同类': '偏官', '克我异类': '正官',
  // 生我：偏印/正印
  '生我同类': '偏印', '生我异类': '正印',
};

// 五行生克关系
const WUXING_SHENG: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const WUXING_KE: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };

/**
 * 计算单个天干相对日主的十神
 */
export function calculateShishenForStem(dayStem: string, targetStem: string): string {
  if (targetStem === dayStem) return '日主';

  const dayElement = TIANGAN_WUXING[dayStem];
  const targetElement = TIANGAN_WUXING[targetStem];
  const dayYinYang = TIANGAN_YINYANG[dayStem];
  const targetYinYang = TIANGAN_YINYANG[targetStem];
  const sameYinYang = dayYinYang === targetYinYang ? '同类' : '异类';

  // 判断五行关系
  let relation: string;
  if (targetElement === dayElement) {
    relation = '同类';
  } else if (WUXING_SHENG[dayElement] === targetElement) {
    relation = '我生';
  } else if (WUXING_KE[dayElement] === targetElement) {
    relation = '我克';
  } else if (WUXING_KE[targetElement] === dayElement) {
    relation = '克我';
  } else if (WUXING_SHENG[targetElement] === dayElement) {
    relation = '生我';
  } else {
    return '未知';
  }

  const key = `${relation}${sameYinYang}`;
  return SHISHEN_TABLE[key] || '未知';
}

/**
 * 批量计算四柱天干十神标注
 */
export function calculateStemShishen(dayStem: string, stems: Record<string, string>): Record<string, { stem: string; god: string }> {
  const result: Record<string, { stem: string; god: string }> = {};
  for (const [position, stem] of Object.entries(stems)) {
    result[position] = {
      stem,
      god: calculateShishenForStem(dayStem, stem),
    };
  }
  return result;
}

/**
 * 批量计算地支藏干十神标注
 */
export function calculateHiddenStemShishen(
  dayStem: string,
  branches: Record<string, { branch: string; mainQi: string; middleQi: string | null; residualQi: string | null }>,
): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [position, data] of Object.entries(branches)) {
    result[position] = {
      branch: data.branch,
      mainQi: {
        stem: data.mainQi,
        god: calculateShishenForStem(dayStem, data.mainQi),
      },
      middleQi: data.middleQi
        ? { stem: data.middleQi, god: calculateShishenForStem(dayStem, data.middleQi) }
        : null,
      residualQi: data.residualQi
        ? { stem: data.residualQi, god: calculateShishenForStem(dayStem, data.residualQi) }
        : null,
    };
  }
  return result;
}