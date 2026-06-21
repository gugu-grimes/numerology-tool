/**
 * 岁运药效评估逻辑
 * Module 04: Bing (辨病与用神模块) — Task D-10
 */

export interface YaoXiaoItem {
  year: number;
  daYun: string;
  liuNian: string;
  status: '药到' | '病重' | '平稳' | '仇神助忌';
  description: string;
  affectedDimensions: string[];
}

/**
 * 逐年评估大运流年对命局病机的影响
 * 注：大运流年数据依赖模块06，开发阶段使用桩数据
 */
export function evaluateYaoXiao(
  yongShenElement: string,
  jiShenElements: string[],
  diseases: Array<{ type: string; name: string }>,
  stubDayunData?: Array<{ year: number; daYun: string; liuNian: string; ganZhi: string }>,
): YaoXiaoItem[] {
  // 桩数据：若未提供大运数据，使用空数组
  const dayunData = stubDayunData || generateStubDayunData();

  return dayunData.map((item) => {
    const dayunElement = getGanZhiElement(item.ganZhi);
    const isYaoDao = dayunElement === yongShenElement || isShengFu(dayunElement, yongShenElement);
    const isBingZhong = jiShenElements.includes(dayunElement) || isKeXie(dayunElement, yongShenElement);
    const isChouShenZhuJi = isShengFu(dayunElement, jiShenElements[0] || '');

    let status: '药到' | '病重' | '平稳' | '仇神助忌';
    let description: string;
    const affectedDimensions = ['性格', '事业', '财运', '婚姻', '健康', '学业'];

    if (isYaoDao) {
      status = '药到';
      description = `${item.ganZhi}大运，${dayunElement}行为用神得力，病情缓解`;
    } else if (isBingZhong) {
      status = '病重';
      description = `${item.ganZhi}大运，${dayunElement}行为忌神得力，病情加重`;
    } else if (isChouShenZhuJi) {
      status = '仇神助忌';
      description = `${item.ganZhi}大运，${dayunElement}行生助忌神，间接受损`;
    } else {
      status = '平稳';
      description = `${item.ganZhi}大运，${dayunElement}行影响不大，运势平稳`;
    }

    return {
      year: item.year,
      daYun: item.daYun,
      liuNian: item.liuNian,
      status,
      description,
      affectedDimensions,
    };
  });
}

function generateStubDayunData(): Array<{ year: number; daYun: string; liuNian: string; ganZhi: string }> {
  // 桩数据：10个大运周期
  const data: Array<{ year: number; daYun: string; liuNian: string; ganZhi: string }> = [];
  const ganZhiList = ['甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉'];

  for (let i = 0; i < 10; i++) {
    data.push({
      year: 2020 + i * 10,
      daYun: `第${i + 1}步大运`,
      liuNian: `${2020 + i * 10}年`,
      ganZhi: ganZhiList[i],
    });
  }
  return data;
}

function getGanZhiElement(ganZhi: string): string {
  const gan = ganZhi[0];
  const ganWuxing: Record<string, string> = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
  };
  return ganWuxing[gan] || '木';
}

function isShengFu(element: string, target: string): boolean {
  const shengMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  return shengMap[element] === target || element === target;
}

function isKeXie(element: string, yongShen: string): boolean {
  const keMap: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  return keMap[element] === yongShen;
}