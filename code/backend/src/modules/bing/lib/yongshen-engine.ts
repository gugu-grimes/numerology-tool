/**
 * 用神推导逻辑链引擎
 * Module 04: Bing (辨病与用神模块) — Task D-9
 */

export interface YongShenInfo {
  element: string;
  shishen: string;
  position: string[];
  derivationLogic: string;
  diseaseSource: string;
  strength: 'strong' | 'moderate' | 'weak';
}

export interface XiJiItem {
  element: string;
  shishen: string;
  position: string[];
  derivationLogic: string;
  diseaseSource: string;
}

export interface DerivationStep {
  step: number;
  disease: string;
  diseaseType: string;
  yongShenCandidate: string;
  logic: string;
  isFinalYongShen: boolean;
}

export interface YongshenResult {
  yongShen: YongShenInfo;
  xiShen: XiJiItem[];
  jiShen: XiJiItem[];
  chouShen: XiJiItem[];
  xianShen: XiJiItem[];
  derivationChains: DerivationStep[];
}

const WUXING_SHENG: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
const WUXING_KE: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
const WUXING_ALL = ['金', '木', '水', '火', '土'];

/**
 * 用神推导 — 根据病机推导用神候选并确定最有力用神
 */
export function deriveYongshen(
  strength: string,
  dayMasterElement: string,
  diseases: Array<{ type: string; name: string; diseaseSource: string }>,
): YongshenResult {
  const derivationChains: DerivationStep[] = [];
  let yongShenElement = '';
  let yongShenLogic = '';
  let diseaseSource = '';

  // 根据病机推导用神
  const dayMasterExcess = diseases.find((d) => d.type === 'dayMasterExcess');
  const dayMasterWeakness = diseases.find((d) => d.type === 'dayMasterWeakness');
  const wuxingAbsence = diseases.find((d) => d.type === 'wuxingAbsence');

  if (dayMasterWeakness) {
    // 身弱：生扶为用（印比为用）
    yongShenElement = findShengFuElement(dayMasterElement);
    yongShenLogic = '身弱则印比为用，生扶日主';
    diseaseSource = dayMasterWeakness.diseaseSource;
  } else if (dayMasterExcess) {
    // 身旺：克泄耗为用（官杀财食为用）
    yongShenElement = findKeXieElement(dayMasterElement);
    yongShenLogic = '身旺则克泄耗为用，抑制日主';
    diseaseSource = dayMasterExcess.diseaseSource;
  } else if (wuxingAbsence) {
    // 缺漏：补缺为用
    yongShenElement = dayMasterElement;
    yongShenLogic = '五行缺漏，以补缺为用';
    diseaseSource = wuxingAbsence.diseaseSource;
  } else {
    // 中和：扶抑适中
    yongShenElement = findShengFuElement(dayMasterElement);
    yongShenLogic = '日主中和，以扶抑适中为用';
    diseaseSource = '日主中和';
  }

  // 确定用神十神
  const yongShenShishen = elementToShishen(dayMasterElement, yongShenElement);

  const yongShen: YongShenInfo = {
    element: yongShenElement,
    shishen: yongShenShishen,
    position: [],
    derivationLogic: yongShenLogic,
    diseaseSource,
    strength: 'moderate',
  };

  // 推导喜忌仇闲
  const xiShen = deriveXiShen(dayMasterElement, yongShenElement, diseaseSource);
  const jiShen = deriveJiShen(dayMasterElement, yongShenElement, diseaseSource);
  const chouShen = deriveChouShen(jiShen, diseaseSource);
  const xianShen = deriveXianShen(xiShen, jiShen, chouShen, diseaseSource);

  // 推导逻辑链
  derivationChains.push({
    step: 1,
    disease: diseaseSource,
    diseaseType: dayMasterWeakness ? 'dayMasterWeakness' : dayMasterExcess ? 'dayMasterExcess' : 'wuxingAbsence',
    yongShenCandidate: yongShenElement,
    logic: yongShenLogic,
    isFinalYongShen: true,
  });

  return {
    yongShen,
    xiShen,
    jiShen,
    chouShen,
    xianShen,
    derivationChains,
  };
}

function findShengFuElement(dayMasterElement: string): string {
  // 生我者
  for (const [element, target] of Object.entries(WUXING_SHENG)) {
    if (target === dayMasterElement) return element;
  }
  return dayMasterElement;
}

function findKeXieElement(dayMasterElement: string): string {
  // 克我者
  return WUXING_KE[dayMasterElement] || dayMasterElement;
}

function findShengFuElement(dayMasterElement: string): string {
  // 生我者
  for (const [element, target] of Object.entries(WUXING_SHENG)) {
    if (target === dayMasterElement) return element;
  }
  return dayMasterElement;
}

function elementToShishen(dayMasterElement: string, targetElement: string): string {
  if (targetElement === dayMasterElement) return '比肩';
  if (WUXING_SHENG[dayMasterElement] === targetElement) return '食神';
  if (WUXING_KE[dayMasterElement] === targetElement) return '偏财';
  for (const [element, target] of Object.entries(WUXING_SHENG)) {
    if (element === dayMasterElement && target === targetElement) return '食神';
    if (target === dayMasterElement && element === targetElement) return '正印';
  }
  for (const [element, target] of Object.entries(WUXING_KE)) {
    if (element === dayMasterElement && target === targetElement) return '偏财';
    if (target === dayMasterElement && element === targetElement) return '偏官';
  }
  return '比肩';
}

function deriveXiShen(dayMasterElement: string, yongShenElement: string, diseaseSource: string): XiJiItem[] {
  const xiShen: XiJiItem[] = [];
  // 生助用神的五行为喜神
  for (const [element, target] of Object.entries(WUXING_SHENG)) {
    if (target === yongShenElement || element === yongShenElement) {
      xiShen.push({
        element,
        shishen: elementToShishen(dayMasterElement, element),
        position: [],
        derivationLogic: `生助用神${yongShenElement}，增强药力`,
        diseaseSource,
      });
    }
  }
  return xiShen;
}

function deriveJiShen(dayMasterElement: string, yongShenElement: string, diseaseSource: string): XiJiItem[] {
  const jiShen: XiJiItem[] = [];
  // 加重病情的五行为忌神
  // 克泄用神的五行
  jiShen.push({
    element: WUXING_KE[yongShenElement] || '',
    shishen: elementToShishen(dayMasterElement, WUXING_KE[yongShenElement] || ''),
    position: [],
    derivationLogic: `克泄用神${yongShenElement}，加重病情`,
    diseaseSource,
  });
  return jiShen.filter((j) => j.element);
}

function deriveChouShen(jiShen: XiJiItem[], diseaseSource: string): XiJiItem[] {
  // 生助忌神的五行为仇神
  return jiShen.map((j) => ({
    element: Object.entries(WUXING_SHENG).find(([k, v]) => v === j.element)?.[0] || '',
    shishen: '',
    position: [],
    derivationLogic: `生助忌神${j.element}，间接加重病情`,
    diseaseSource,
  })).filter((c) => c.element);
}

function deriveXianShen(xiShen: XiJiItem[], jiShen: XiJiItem[], chouShen: XiJiItem[], diseaseSource: string): XiJiItem[] {
  const usedElements = new Set([
    ...xiShen.map((x) => x.element),
    ...jiShen.map((j) => j.element),
    ...chouShen.map((c) => c.element),
  ]);
  return WUXING_ALL.filter((e) => !usedElements.has(e)).map((e) => ({
    element: e,
    shishen: '',
    position: [],
    derivationLogic: `对命局影响不大的五行`,
    diseaseSource,
  }));
}