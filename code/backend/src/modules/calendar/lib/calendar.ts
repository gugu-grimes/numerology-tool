/**
 * 农历数据库与节气计算逻辑
 * Module 01: Calendar (农历与节气模块) — Task D-3
 */

// 二十四节气名称
export const JIEQI_NAMES = [
  '小寒', '立春', '惊蛰', '清明', '立夏', '芒种',
  '小暑', '立秋', '白露', '寒露', '立冬', '大雪',
] as const;

// 二十四节气完整列表（含中气）
export const ALL_JIEQI = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
  '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
  '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
  '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
] as const;

/**
 * 获取指定年份的二十四节气交接时刻
 * 使用近似算法 — 生产环境应使用精确的天文计算数据表
 */
export function getJieqiBoundary(year: number): Array<{ name: string; datetime: Date; description: string }> {
  const jieqiDescriptions: Record<string, string> = {
    '小寒': '寒冷开始加剧',
    '大寒': '一年中最冷的时候',
    '立春': '春季开始',
    '雨水': '降雨开始增多',
    '惊蛰': '春雷始鸣，万物复苏',
    '春分': '昼夜等长',
    '清明': '天气晴朗，万物明洁',
    '谷雨': '雨水增多，有利于谷物生长',
    '立夏': '夏季开始',
    '小满': '麦类等夏熟作物籽粒开始饱满',
    '芒种': '麦类等有芒作物成熟',
    '夏至': '白昼最长',
    '小暑': '暑热开始',
    '大暑': '一年中最热的时候',
    '立秋': '秋季开始',
    '处暑': '暑天即将结束',
    '白露': '天气转凉，露水始白',
    '秋分': '昼夜等长',
    '寒露': '露水以寒，将要结冰',
    '霜降': '天气渐冷，开始降霜',
    '立冬': '冬季开始',
    '小雪': '开始降雪，雪量不大',
    '大雪': '雪量增大，地面积雪',
    '冬至': '白昼最短',
  };

  // 近似节气日期计算（基于寿星公式简化版）
  // 月份和日期的近似值
  const jieqiApproxDates: Array<[number, number]> = [
    [1, 6], [1, 20], [2, 4], [2, 19], [3, 6], [3, 21],
    [4, 5], [4, 20], [5, 6], [5, 21], [6, 6], [6, 21],
    [7, 7], [7, 23], [8, 8], [8, 23], [9, 8], [9, 23],
    [10, 8], [10, 23], [11, 7], [11, 22], [12, 7], [12, 22],
  ];

  return ALL_JIEQI.map((name, i) => {
    const [month, day] = jieqiApproxDates[i];
    return {
      name,
      datetime: new Date(Date.UTC(year, month - 1, day)),
      description: jieqiDescriptions[name] || '',
    };
  });
}

/**
 * 农历转公历 — 简化万年历对照实现
 * 生产环境应使用完整的万年历数据库（如 lunar-javascript 库）
 */
export function convertLunarToSolar(
  year: number, month: number, day: number, isLeapMonth: boolean = false,
): { year: number; month: number; day: number } {
  // 简化实现：基于1900-2100年对照数据
  // 实际生产中应使用精确的万年历数据库
  // 此处使用近似偏移量
  const lunarInfo = getLunarInfo(year);
  const offsetDays = calculateLunarOffset(lunarInfo, month, day, isLeapMonth);

  const baseDate = new Date(Date.UTC(year, 0, 31)); // 农历正月初一约为1月下旬
  const solarDate = new Date(baseDate.getTime() + offsetDays * 24 * 60 * 60 * 1000);

  return {
    year: solarDate.getUTCFullYear(),
    month: solarDate.getUTCMonth() + 1,
    day: solarDate.getUTCDate(),
  };
}

/**
 * 公历转农历
 */
export function convertSolarToLunar(
  year: number, month: number, day: number,
): { year: number; month: number; day: number; isLeapMonth: boolean } {
  // 简化实现
  const solarDate = new Date(Date.UTC(year, month - 1, day));
  const baseDate = new Date(Date.UTC(year, 0, 31)); // 近似春节
  const daysSinceLunarNewYear = Math.floor(
    (solarDate.getTime() - baseDate.getTime()) / (24 * 60 * 60 * 1000),
  );

  // 简化：粗略估算农历月份和日期
  const lunarMonth = Math.floor(daysSinceLunarNewYear / 30) + 1;
  const lunarDay = daysSinceLunarNewYear % 30 + 1;

  return {
    year,
    month: Math.min(Math.max(lunarMonth, 1), 12),
    day: Math.min(Math.max(lunarDay, 1), 30),
    isLeapMonth: false,
  };
}

// 农历信息简化数据（实际生产中应使用完整的万年历数据库）
interface LunarYearInfo {
  leapMonth: number; // 闰月月份，0表示无闰月
  monthDays: number[]; // 各月天数（大月30天，小月29天）
}

function getLunarInfo(year: number): LunarYearInfo {
  // 简化版：返回默认月份数据
  // 实际生产中应使用精确的万年历数据
  return {
    leapMonth: 0,
    monthDays: [29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30],
  };
}

function calculateLunarOffset(lunarInfo: LunarYearInfo, month: number, day: number, isLeapMonth: boolean): number {
  let offset = 0;
  const months = lunarInfo.monthDays;

  for (let i = 0; i < month - 1; i++) {
    offset += months[i];
  }
  offset += day - 1;

  return offset;
}