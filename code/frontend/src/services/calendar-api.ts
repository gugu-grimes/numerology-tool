import apiClient from './api-client';

export const calendarApi = {
  convert(params: { direction: 'lunar2solar' | 'solar2lunar'; year: number; month: number; day: number; isLeapMonth?: boolean }) {
    return apiClient.get('/calendar/lunar-solar', { params });
  },

  getJieqi(year?: number) {
    return apiClient.get('/calendar/jieqi', { params: { year } });
  },
};