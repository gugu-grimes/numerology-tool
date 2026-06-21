/**
 * 八大病机检测逻辑
 * Module 04: Bing (辨病与用神模块) — Task D-8
 */

export interface DiseaseItem {
  type: string;
  name: string;
  position: string;
  manifestation: string;
  severity: 'severe' | 'moderate' | 'latent';
  hasRelief: boolean;
  diseaseSource: string;
}

export interface BingDetectResult {
  diseases: DiseaseItem[];
  dayMasterExcess: any;
  dayMasterWeakness: any;
  wuxingImbalance: any;
  wuxingAbsence: any;
  shishenConflict: any;
  gejuBreak: any;
  heBindYongShen: any;
  temperatureImbalance: any;
}

/**
 * 检测八大病机
 */
export function detectBing(
  strength: string,
  dayMasterElement: string,
  wuxingStats: { metal: number; wood: number; water: number; fire: number; earth: number; missing: string[]; dominant: string[] },
  shishenLabels: any,
  gejuPattern: any,
  hechongBingJudgments: any[],
): BingDetectResult {
  const diseases: DiseaseItem[] = [];

  // 1. 日主过旺
  const dayMasterExcess = detectDayMasterExcess(strength, dayMasterElement);
  if (dayMasterExcess) diseases.push(dayMasterExcess.disease);

  // 2. 日主过弱
  const dayMasterWeakness = detectDayMasterWeakness(strength, dayMasterElement);
  if (dayMasterWeakness) diseases.push(dayMasterWeakness.disease);

  // 3. 五行偏枯
  const wuxingImbalance = detectWuxingImbalance(wuxingStats);
  if (wuxingImbalance) diseases.push(wuxingImbalance.disease);

  // 4. 五行缺漏
  const wuxingAbsence = detectWuxingAbsence(wuxingStats, dayMasterElement);
  if (wuxingAbsence) diseases.push(wuxingAbsence.disease);

  // 5. 十神交战
  const shishenConflict = detectShishenConflict(shishenLabels);
  if (shishenConflict) diseases.push(shishenConflict.disease);

  // 6. 格局破败
  const gejuBreak = detectGejuBreak(gejuPattern);
  if (gejuBreak) diseases.push(gejuBreak.disease);

  // 7. 合绊用神
  const heBindYongShen = detectHeBindYongShen(hechongBingJudgments);
  if (heBindYongShen) diseases.push(heBindYongShen.disease);

  // 8. 寒暖湿燥失衡
  const temperatureImbalance = detectTemperatureImbalance(wuxingStats);
  if (temperatureImbalance) diseases.push(temperatureImbalance.disease);

  return {
    diseases,
    dayMasterExcess: dayMasterExcess?.detail || null,
    dayMasterWeakness: dayMasterWeakness?.detail || null,
    wuxingImbalance: wuxingImbalance?.detail || null,
    wuxingAbsence: wuxingAbsence?.detail || null,
    shishenConflict: shishenConflict?.detail || null,
    gejuBreak: gejuBreak?.detail || null,
    heBindYongShen: heBindYongShen?.detail || null,
    temperatureImbalance: temperatureImbalance?.detail || null,
  };
}

function detectDayMasterExcess(strength: string, dayMasterElement: string) {
  if (strength === 'strong' || strength === 'extremely_strong') {
    const isExtreme = strength === 'extremely_strong';
    return {
      disease: {
        type: 'dayMasterExcess',
        name: isExtreme ? '从强无依' : '身旺无依',
        position: `日主${dayMasterElement}行过旺`,
        manifestation: isExtreme ? '日主极旺，刚愎自用，六亲缘薄' : '日主身旺，主观性强，不易妥协',
        severity: isExtreme ? 'severe' : 'moderate' as 'severe' | 'moderate',
        hasRelief: !isExtreme,
        diseaseSource: `日主${dayMasterElement}行过旺`,
      },
      detail: {
        type: 'dayMasterExcess',
        name: isExtreme ? '从强无依' : '身旺无依',
        position: `日主${dayMasterElement}行过旺`,
        manifestation: isExtreme ? '日主极旺，刚愎自用，六亲缘薄' : '日主身旺，主观性强，不易妥协',
        severity: isExtreme ? 'severe' : 'moderate',
        hasRelief: !isExtreme,
        diseaseSource: `日主${dayMasterElement}行过旺`,
      },
    };
  }
  return null;
}

function detectDayMasterWeakness(strength: string, dayMasterElement: string) {
  if (strength === 'weak' || strength === 'extremely_weak') {
    const isExtreme = strength === 'extremely_weak';
    return {
      disease: {
        type: 'dayMasterWeakness',
        name: isExtreme ? '从弱无根' : '身弱无根',
        position: `日主${dayMasterElement}行过弱`,
        manifestation: isExtreme ? '日主极弱，随波逐流，缺乏主见' : '日主身弱，优柔寡断，依赖性强',
        severity: isExtreme ? 'severe' : 'moderate' as 'severe' | 'moderate',
        hasRelief: !isExtreme,
        diseaseSource: `日主${dayMasterElement}行过弱`,
      },
      detail: {
        type: 'dayMasterWeakness',
        name: isExtreme ? '从弱无根' : '身弱无根',
        position: `日主${dayMasterElement}行过弱`,
        manifestation: isExtreme ? '日主极弱，随波逐流，缺乏主见' : '日主身弱，优柔寡断，依赖性强',
        severity: isExtreme ? 'severe' : 'moderate',
        hasRelief: !isExtreme,
        diseaseSource: `日主${dayMasterElement}行过弱`,
      },
    };
  }
  return null;
}

function detectWuxingImbalance(stats: { dominant: string[] }) {
  if (stats.dominant.length > 0) {
    return {
      disease: {
        type: 'wuxingImbalance',
        name: `${stats.dominant.join('、')}行偏旺`,
        position: `${stats.dominant.join('、')}行力量过旺`,
        manifestation: `${stats.dominant.join('、')}行偏枯，命局失衡`,
        severity: 'moderate' as const,
        hasRelief: true,
        diseaseSource: `五行偏枯：${stats.dominant.join('、')}行力量过旺`,
      },
      detail: {
        type: 'wuxingImbalance',
        name: `${stats.dominant.join('、')}行偏旺`,
        position: `${stats.dominant.join('、')}行力量过旺`,
        manifestation: `${stats.dominant.join('、')}行偏枯，命局失衡`,
        severity: 'moderate' as const,
        hasRelief: true,
        diseaseSource: `五行偏枯：${stats.dominant.join('、')}行力量过旺`,
      },
    };
  }
  return null;
}

function detectWuxingAbsence(stats: { missing: string[] }, dayMasterElement: string) {
  if (stats.missing.length > 0) {
    const isCritical = stats.missing.includes(dayMasterElement);
    return {
      disease: {
        type: 'wuxingAbsence',
        name: `缺${stats.missing.join('、')}行`,
        position: `${stats.missing.join('、')}行缺失`,
        manifestation: isCritical ? `缺日主所需之${dayMasterElement}行，严重影响命局平衡` : `${stats.missing.join('、')}行缺失，命局不完整`,
        severity: isCritical ? ('severe' as const) : ('moderate' as const),
        hasRelief: !isCritical,
        diseaseSource: `五行缺漏：缺${stats.missing.join('、')}行`,
      },
      detail: {
        type: 'wuxingAbsence',
        name: `缺${stats.missing.join('、')}行`,
        position: `${stats.missing.join('、')}行缺失`,
        manifestation: isCritical ? `缺日主所需之${dayMasterElement}行，严重影响命局平衡` : `${stats.missing.join('、')}行缺失，命局不完整`,
        severity: isCritical ? 'severe' : 'moderate',
        hasRelief: !isCritical,
        diseaseSource: `五行缺漏：缺${stats.missing.join('、')}行`,
      },
    };
  }
  return null;
}

function detectShishenConflict(shishenLabels: any) {
  // 简化：检查是否存在相冲的十神对
  return null; // 实际实现需检查十神冲突
}

function detectGejuBreak(gejuPattern: any) {
  if (gejuPattern && !gejuPattern.isEstablished) {
    return {
      disease: {
        type: 'gejuBreak',
        name: `${gejuPattern.patternType}破败`,
        position: gejuPattern.breakReason || '格局破败',
        manifestation: `格局破败：${gejuPattern.breakReason || '原因未明'}`,
        severity: 'moderate' as const,
        hasRelief: true,
        diseaseSource: gejuPattern.breakReason || '格局破败',
      },
      detail: {
        type: 'gejuBreak',
        name: `${gejuPattern.patternType}破败`,
        position: gejuPattern.breakReason || '格局破败',
        manifestation: `格局破败：${gejuPattern.breakReason || '原因未明'}`,
        severity: 'moderate' as const,
        hasRelief: true,
        diseaseSource: gejuPattern.breakReason || '格局破败',
      },
    };
  }
  return null;
}

function detectHeBindYongShen(hechongBingJudgments: any[]) {
  const binding = hechongBingJudgments?.find((j) => j.type === '合绊用神');
  if (binding) {
    return {
      disease: {
        type: 'heBindYongShen',
        name: '合绊用神',
        position: binding.bingWei || '用神',
        manifestation: binding.bingXiang || '用神被合绊，效力减弱',
        severity: binding.severity || 'moderate',
        hasRelief: binding.severity !== 'severe',
        diseaseSource: binding.source || '合绊用神',
      },
      detail: binding,
    };
  }
  return null;
}

function detectTemperatureImbalance(stats: { metal: number; wood: number; water: number; fire: number; earth: number }) {
  // 检查寒暖湿燥失衡
  if (stats.fire < 0.5 && stats.water > 2) {
    return {
      disease: {
        type: 'temperatureImbalance',
        name: '命局过寒无火调候',
        position: '水行过旺火行不足',
        manifestation: '命局过寒，缺火调候，生机不足',
        severity: 'severe' as const,
        hasRelief: false,
        diseaseSource: '寒暖湿燥失衡：过寒无火调候',
      },
      detail: {
        type: 'temperatureImbalance',
        name: '命局过寒无火调候',
        position: '水行过旺火行不足',
        manifestation: '命局过寒，缺火调候，生机不足',
        severity: 'severe' as const,
        hasRelief: false,
        diseaseSource: '寒暖湿燥失衡：过寒无火调候',
      },
    };
  }
  if (stats.fire > 2.5 && stats.water < 0.5) {
    return {
      disease: {
        type: 'temperatureImbalance',
        name: '命局过热少水润泽',
        position: '火行过旺水行不足',
        manifestation: '命局过热，缺水润泽，燥气太重',
        severity: 'moderate' as const,
        hasRelief: true,
        diseaseSource: '寒暖湿燥失衡：过热少水润泽',
      },
      detail: {
        type: 'temperatureImbalance',
        name: '命局过热少水润泽',
        position: '火行过旺水行不足',
        manifestation: '命局过热，缺水润泽，燥气太重',
        severity: 'moderate' as const,
        hasRelief: true,
        diseaseSource: '寒暖湿燥失衡：过热少水润泽',
      },
    };
  }
  return null;
}