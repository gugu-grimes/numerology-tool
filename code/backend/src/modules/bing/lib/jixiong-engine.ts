/**
 * 六维论断推导引擎
 * Module 04: Bing (辨病与用神模块) — Task D-9
 */

export interface DimensionVerdict {
  conclusion: string;
  diseaseBasis: string;
  yongShenLogic: string;
  severity: 'severe' | 'moderate' | 'mild';
  details: string;
}

export interface JiXiongResult {
  personality: DimensionVerdict;
  career: DimensionVerdict;
  wealth: DimensionVerdict;
  marriage: DimensionVerdict;
  health: DimensionVerdict;
  education: DimensionVerdict;
}

/**
 * 六维论断推导
 */
export function judgeJiXiong(
  strength: string,
  dayMasterElement: string,
  yongShen: { element: string; shishen: string },
  diseases: Array<{ type: string; name: string }>,
): JiXiongResult {
  const isStrong = strength === 'strong' || strength === 'extremely_strong';
  const diseaseBasis = diseases.map((d) => d.name).join('、') || '无明显病机';

  return {
    personality: judgePersonality(isStrong, dayMasterElement, yongShen, diseaseBasis),
    career: judgeCareer(isStrong, dayMasterElement, yongShen, diseaseBasis),
    wealth: judgeWealth(isStrong, dayMasterElement, yongShen, diseaseBasis),
    marriage: judgeMarriage(isStrong, dayMasterElement, yongShen, diseaseBasis),
    health: judgeHealth(dayMasterElement, diseases, diseaseBasis),
    education: judgeEducation(isStrong, dayMasterElement, yongShen, diseaseBasis),
  };
}

function judgePersonality(isStrong: boolean, dayMasterElement: string, yongShen: any, diseaseBasis: string): DimensionVerdict {
  const conclusion = isStrong
    ? `性格偏刚毅自主，${yongShen.shishen}为用时外向善表达`
    : `性格偏柔顺依赖，${yongShen.shishen}为用时内敛善思虑`;
  return {
    conclusion,
    diseaseBasis,
    yongShenLogic: `${yongShen.shishen}为用神，性格受${yongShen.element}行影响`,
    severity: isStrong ? 'moderate' : 'mild',
    details: isStrong
      ? `日主${isStrong ? '得令得地' : '不得令'}，性格刚毅果断；${yongShen.shishen}为用，善表达善交际`
      : `日主身弱，性格温和内敛；${yongShen.shishen}为用，善思考善谋划`,
  };
}

function judgeCareer(isStrong: boolean, dayMasterElement: string, yongShen: any, diseaseBasis: string): DimensionVerdict {
  return {
    conclusion: isStrong ? '仕途通达，事业有成' : '仕途平稳，需借力而行',
    diseaseBasis,
    yongShenLogic: `${yongShen.shishen}为用神，${yongShen.element}行影响事业`,
    severity: 'moderate',
    details: isStrong
      ? `官杀为用，仕途通达，事业有成`
      : `官杀为忌，仕途多舛，需借助外力`,
  };
}

function judgeWealth(isStrong: boolean, dayMasterElement: string, yongShen: any, diseaseBasis: string): DimensionVerdict {
  return {
    conclusion: isStrong ? '财运亨通，财来财去有度' : '财运平稳，需节流守财',
    diseaseBasis,
    yongShenLogic: `${yongShen.shishen}为用神，${yongShen.element}行影响财运`,
    severity: 'moderate',
    details: isStrong
      ? `财星为用，财运亨通，善于理财`
      : `财星为忌，财运平淡，需节流守财`,
  };
}

function judgeMarriage(isStrong: boolean, dayMasterElement: string, yongShen: any, diseaseBasis: string): DimensionVerdict {
  return {
    conclusion: isStrong ? '配偶得力，婚姻和谐' : '婚姻需经营，配偶助力有限',
    diseaseBasis,
    yongShenLogic: `${yongShen.shishen}为用神，${yongShen.element}行影响婚姻`,
    severity: 'mild',
    details: isStrong
      ? `财星/官杀为用，配偶得力，婚姻和谐`
      : `财星/官杀为忌，婚姻不顺，需多经营`,
  };
}

function judgeHealth(dayMasterElement: string, diseases: Array<{ type: string; name: string }>, diseaseBasis: string): DimensionVerdict {
  const hasAbsence = diseases.some((d) => d.type === 'wuxingAbsence');
  const hasImbalance = diseases.some((d) => d.type === 'wuxingImbalance');

  return {
    conclusion: hasAbsence || hasImbalance ? '健康需注意，五行失衡影响脏腑' : '健康平稳，无明显病机',
    diseaseBasis,
    yongShenLogic: hasAbsence ? '五行缺漏所主脏腑薄弱' : '命局平衡健康平稳',
    severity: hasAbsence ? 'moderate' : 'mild',
    details: hasAbsence
      ? '五行缺漏所主脏腑薄弱，需注意调养'
      : hasImbalance
        ? '五行偏枯克伐脏腑，需注意养生'
        : '命局平衡，健康平稳',
  };
}

function judgeEducation(isStrong: boolean, dayMasterElement: string, yongShen: any, diseaseBasis: string): DimensionVerdict {
  return {
    conclusion: `${yongShen.shishen}为用，学业有机缘`,
    diseaseBasis,
    yongShenLogic: `${yongShen.shishen}为用神，${yongShen.element}行影响学业`,
    severity: 'mild',
    details: `${yongShen.shishen}为用神，学业有机缘，善于学习`,
  };
}