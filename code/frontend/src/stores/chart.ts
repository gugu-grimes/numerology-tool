import { defineStore } from 'pinia';
import { ref } from 'vue';
import { chartApi } from '../services/chart-api';

export const useChartStore = defineStore('chart', () => {
  const chartData = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function calculate(input: {
    birthDateType: 'solar' | 'lunar';
    birthDate?: string;
    gender: 'male' | 'female';
    lunarBirthInfo?: { year: number; month: number; day: number; isLeapMonth?: boolean };
    zhourule?: 'early_zi' | 'late_zi';
  }) {
    loading.value = true;
    error.value = null;
    try {
      const response = await chartApi.calculate(input);
      chartData.value = response.data;
      return chartData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '排盘计算失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function getChart(id: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await chartApi.getChart(id);
      chartData.value = response.data;
      return chartData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取排盘结果失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { chartData, loading, error, calculate, getChart };
});