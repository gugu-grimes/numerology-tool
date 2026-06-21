/**
 * 四柱排盘核心计算库 — 天干地支推算、万年历数据
 * Module 01: Chart (八字排盘与历法模块)
 *
 * 天干: 甲乙丙丁戊己庚辛壬癸
 * 地支: 子丑寅卯辰巳午未申酉戌亥
 * 五行: 金木水火土
 */

// ==================== 常量定义 ====================

export const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const WUXING = ['金', '木', '水', '火', '土'] as const;

// 天干五行映射
export const TIANGAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

// 地支五行映射（本气）
export const DIZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

// 天干阴阳
export const TIANGAN_YINYANG: Record<string, string> = {
  '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
  '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴',
};

// 地支阴阳
export const DIZHI_YINYANG: Record<string, string> = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳',
  '巳': '阴', '午': '阳', '未': '阴', '申': '阳', '酉': '阴',
  '戌': '阳', '亥': '阴',
};

// 地支藏干表（本气、中气、余气）
export const DIZHI_CANGGAN: Record<string, { mainQi: string; middleQi: string | null; residualQi: string | null }> = {
  '子': { mainQi: '癸', middleQi: null, residualQi: null },
  '丑': { mainQi: '己', middleQi: '癸', residualQi: '辛' },
  '寅': { mainQi: '甲', middleQi: '丙', residualQi: '戊' },
  '卯': { mainQi: '乙', middleQi: null, residualQi: null },
  '辰': { mainQi: '戊', middleQi: '乙', residualQi: '癸' },
  '巳': { mainQi: '丙', middleQi: '庚', residualQi: '戊' },
  '午': { mainQi: '丁', middleQi: '己', residualQi: null },
  '未': { mainQi: '己', middleQi: '丁', residualQi: '乙' },
  '申': { mainQi: '庚', middleQi: '壬', residualQi: '戊' },
  '酉': { mainQi: '辛', middleQi: null, residualQi: null },
  '戌': { mainQi: '戊', middleQi: '辛', residualQi: '丁' },
  '亥': { mainQi: '壬', middleQi: '甲', residualQi: null },
};

// 纳音五行对照表 (60甲子纳音)
export const NAYIN_TABLE: Record<string, string> = {
  '甲子': '海中金', '乙丑': '海中金', '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木', '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金', '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水', '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金', '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水', '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火', '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水', '甲午': '砂石金', '乙未': '砂石金',
  '丙申': '山下火', '丁酉': '山下火', '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土', '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火', '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土', '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木', '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土', '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木', '壬戌': '大海水', '癸亥': '大海水',
};

// ==================== 计算函数 ====================

/**
 * 根据公历年份计算年柱天干地支
 * 以立春为年界：立春前出生归属上一年
 */
export function calculateYearPillar(year: number, isBeforeLichun: boolean): { heavenlyStem: string; earthlyBranch: string } {
  const adjustedYear = isBeforeLichun ? year - 1 : year;
  const stemIndex = (adjustedYear - 4) % 10; // 甲=4
  const branchIndex = (adjustedYear - 4) % 12; // 子=4
  return {
    heavenlyStem: TIANGAN[stemIndex >= 0 ? stemIndex : stemIndex + 10],
    earthlyBranch: DIZHI[branchIndex >= 0 ? branchIndex : branchIndex + 12],
  };
}

/**
 * 根据公历日期确定月柱天干地支
 * 月柱以节气为月界
 */
export function calculateMonthPillar(year: number, month: number, jieqiMonth: number): { heavenlyStem: string; earthlyBranch: string } {
  // 月柱地支由节气月份决定
  const branchIndex = (jieqiMonth + 1) % 12; // 寅月=1→index 2
  const earthlyBranch = DIZHI[(jieqiMonth + 1) % 12];

  // 月柱天干由年干推算（五虎遁月法）
  const yearStemIndex = ((year - 4) % 10 + 10) % 10;
  const monthStemBase = [2, 4, 6, 8, 0][yearStemIndex % 5]; // 甲己之年丙作首
  const stemIndex = (monthStemBase + jieqiMonth) % 10;
  const heavenlyStem = TIANGAN[stemIndex];

  return { heavenlyStem, earthlyBranch };
}

/**
 * 根据公历日期计算日柱天干地支
 * 使用简化的日柱计算法
 */
export function calculateDayPillar(date: Date): { heavenlyStem: string; earthlyBranch: string } {
  // 儒略日数法计算日柱
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  // 计算儒略日数
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // 日干支：儒略日数对60取余
  const ganZhiIndex = ((jd - 1) % 60 + 60) % 60; // 确保正数
  const stemIndex = ganZhiIndex % 10;
  const branchIndex = ganZhiIndex % 12;

  return {
    heavenlyStem: TIANGAN[stemIndex],
    earthlyBranch: DIZHI[branchIndex],
  };
}

/**
 * 根据出生时间计算时柱天干地支
 * 使用五鼠遁时法（日干推时干）
 */
export function calculateHourPillar(hourStem: string, birthHour: number): { heavenlyStem: string; earthlyBranch: string } {
  // 时支由出生时辰确定
  const branchIndex = Math.floor((birthHour + 1) / 2) % 12;
  const earthlyBranch = DIZHI[branchIndex];

  // 时干由日干推算（五鼠遁时法）
  const dayStemIndex = TIANGAN.indexOf(hourStem);
  const baseIndex = [0, 2, 4, 6, 8][dayStemIndex % 5];
  const stemIndex = (baseIndex + branchIndex) % 10;
  const heavenlyStem = TIANGAN[stemIndex];

  return { heavenlyStem, earthlyBranch };
}

/**
 * 完整的四柱排盘计算
 */
export interface FourPillars {
  year: { position: 'year'; heavenlyStem: string; earthlyBranch: string; hiddenStems: { mainQi: string; middleQi: string | null; residualQi: string | null }; nayin: string };
  month: { position: 'month'; heavenlyStem: string; earthlyBranch: string; hiddenStems: { mainQi: string; middleQi: string | null; residualQi: string | null }; nayin: string };
  day: { position: 'day'; heavenlyStem: string; earthlyBranch: string; hiddenStems: { mainQi: string; middleQi: string | null; residualQi: string | null }; nayin: string };
  hour: { position: 'hour'; heavenlyStem: string; earthlyBranch: string; hiddenStems: { mainQi: string; middleQi: string | null; residualQi: string | null }; nayin: string };
}

export function calculateFourPillars(
  solarDate: Date,
  jieqiInfo: JieqiInfo,
  zhourule: 'early_zi' | 'late_zi',
): FourPillars {
  const year = solarDate.getUTCFullYear();
  const month = solarDate.getUTCMonth() + 1;
  const hour = solarDate.getUTCHours();

  // 年柱 — 以立春为界
  const isBeforeLichun = jieqiInfo.isBeforeLichun;
  const yearPillar = calculateYearPillar(year, isBeforeLichun);

  // 月柱 — 以节气为界
  const jieqiMonth = getJieqiMonth(jieqiInfo);
  const monthPillar = calculateMonthPillar(year, month, jieqiMonth);

  // 日柱
  const adjustedDate = handleZiHour(solarDate, zhourule).adjustedDate;
  const dayPillar = calculateDayPillar(adjustedDate);

  // 时柱
  const hourPillar = calculateHourPillar(dayPillar.heavenlyStem, hour);

  // 组装四柱
  const positions = ['year', 'month', 'day', 'hour'] as const;
  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];

  const result: any = {};
  positions.forEach((pos, i) => {
    const pillar = pillars[i];
    result[pos] = {
      position: pos,
      heavenlyStem: pillar.heavenlyStem,
      earthlyBranch: pillar.earthlyBranch,
      hiddenStems: extractHiddenStems(pillar.earthlyBranch),
      nayin: lookupNayin(pillar.heavenlyStem + pillar.earthlyBranch),
    };
  });

  return result as FourPillars;
}

// ==================== 辅助函数 ====================

/**
 * 根据节气信息确定月份序号（节气月）
 */
export function getJieqiMonth(jieqiInfo: JieqiInfo): number {
  // 节气月份：立春=1, 惊蛰=2, 清明=3, 立夏=4, 芒种=5, 小暑=6,
  //            立秋=7, 白露=8, 寒露=9, 立冬=10, 大雪=11, 小寒=12
  const jieqiToMonth: Record<string, number> = {
    '立春': 1, '惊蛰': 2, '清明': 3, '立夏': 4, '芒种': 5, '小暑': 6,
    '立秋': 7, '白露': 8, '寒露': 9, '立冬': 10, '大雪': 11, '小寒': 12,
  };
  return jieqiToMonth[jieqiInfo.currentJieqi] || 1;
}

/**
 * 提取地支藏干
 */
export function extractHiddenStems(earthlyBranch: string): { mainQi: string; middleQi: string | null; residualQi: string | null } {
  return DIZHI_CANGGAN[earthlyBranch] || { mainQi: '', middleQi: null, residualQi: null };
}

/**
 * 识别日主天干及五行属性
 */
export function identifyDayMaster(dayStem: string): { dayMaster: string; dayMasterElement: string } {
  return {
    dayMaster: dayStem,
    dayMasterElement: TIANGAN_WUXING[dayStem] || '',
  };
}

/**
 * 查找纳音五行
 */
export function lookupNayin(ganZhi: string): string {
  return NAYIN_TABLE[ganZhi] || '';
}

// ==================== 子时处理 ====================

export interface ZiHourResult {
  adjustedDate: Date;
  zhourule: string;
  description: string;
}

/**
 * 处理子时日柱归属
 * 早子时(23:00-00:00): zhourule=early_zi → 日柱归属当日
 * 夜子时(23:00-00:00): zhourule=late_zi → 日柱归属次日
 * 正子时(00:00-01:00): 日柱归属新一日
 */
export function handleZiHour(solarDate: Date, zhourule: string): ZiHourResult {
  const hour = solarDate.getUTCHours();

  // 正子时 (00:00-01:00): 日柱归属新一日
  if (hour >= 0 && hour < 1) {
    return {
      adjustedDate: solarDate,
      zhourule,
      description: '正子时，日柱归属新一日',
    };
  }

  // 早子时/夜子时 (23:00-00:00): 根据zhourule确定日柱归属
  if (hour >= 23) {
    if (zhourule === 'late_zi') {
      // 夜子时：日柱归属次日
      const nextDay = new Date(solarDate);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);
      return {
        adjustedDate: nextDay,
        zhourule,
        description: '夜子时，日柱归属次日',
      };
    }
    // 早子时：日柱归属当日
    return {
      adjustedDate: solarDate,
      zhourule,
      description: '早子时，日柱归属当日',
    };
  }

  // 非子时：日柱按常规规则
  return {
    adjustedDate: solarDate,
    zhourule,
    description: '非子时，日柱按常规规则',
  };
}

// ==================== 输入校验 ====================

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface JieqiInfo {
  currentJieqi: string;
  jieqiTime: Date;
  isBeforeLichun: boolean;
}

export function validateChartInput(input: {
  birthDateType?: string;
  birthDate?: string;
  gender?: string;
  lunarBirthInfo?: { year?: number; month?: number; day?: number; isLeapMonth?: boolean };
  zhourule?: string;
}): ValidationResult {
  const errors: string[] = [];

  // 必填字段检查
  if (!input.birthDateType) {
    errors.push('birthDateType 为必填项');
  }
  if (!input.gender) {
    errors.push('gender 为必填项');
  }

  if (input.birthDateType === 'solar') {
    if (!input.birthDate) {
      errors.push('公历出生日期为必填项');
    } else {
      const date = new Date(input.birthDate);
      const year = date.getUTCFullYear();
      if (year < 1900 || year > 2100) {
        errors.push('出生日期须在 1900–2100 年范围内');
      }
    }
  }

  if (input.birthDateType === 'lunar') {
    if (!input.lunarBirthInfo) {
      errors.push('农历出生信息为必填项');
    } else {
      const { year, month, day } = input.lunarBirthInfo;
      if (!year || year < 1900 || year > 2100) {
        errors.push('农历年份须在 1900–2100 年范围内');
      }
      if (!month || month < 1 || month > 12) {
        errors.push('农历月份须在 1–12 范围内');
      }
      if (!day || day < 1 || day > 30) {
        errors.push('农历日须在 1–30 范围内');
      }
    }
  }

  if (input.zhourule && !['early_zi', 'late_zi'].includes(input.zhourule)) {
    errors.push('zhourule 仅允许 early_zi 或 late_zi');
  }

  return { valid: errors.length === 0, errors };
}