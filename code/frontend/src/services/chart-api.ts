import apiClient from './api-client';

export const chartApi = {
  calculate(data: {
    birthDateType: 'solar' | 'lunar';
    birthDate?: string;
    gender: 'male' | 'female';
    lunarBirthInfo?: { year: number; month: number; day: number; isLeapMonth?: boolean };
    zhourule?: 'early_zi' | 'late_zi';
  }) {
    return apiClient.post('/chart/calculate', data);
  },

  getChart(id: number) {
    return apiClient.get(`/chart/${id}`);
  },
};

export const calendarApi = {
  convert(params: { direction: 'lunar2solar' | 'solar2lunar'; year: number; month: number; day: number; isLeapMonth?: boolean }) {
    return apiClient.get('/calendar/lunar-solar', { params });
  },

  getJieqi(year?: number) {
    return apiClient.get('/calendar/jieqi', { params: { year } });
  },
};

export const analysisApi = {
  getWuxing(chartId: number) {
    return apiClient.get(`/analysis/wuxing/${chartId}`);
  },

  getWangShuai(chartId: number) {
    return apiClient.get(`/analysis/wangshuai/${chartId}`);
  },

  getShishen(chartId: number) {
    return apiClient.get(`/analysis/shishen/${chartId}`);
  },

  getGeju(chartId: number) {
    return apiClient.get(`/analysis/geju/${chartId}`);
  },
};

export const hechongApi = {
  getRelations(chartId: number) {
    return apiClient.get(`/hechong/${chartId}`);
  },
};

export const bingApi = {
  diagnose(chartId: number) {
    return apiClient.get(`/bing/${chartId}`);
  },

  getYongshen(chartId: number) {
    return apiClient.get(`/yongshen/${chartId}`);
  },

  getJiXiong(chartId: number) {
    return apiClient.get(`/jixiong/${chartId}`);
  },
};