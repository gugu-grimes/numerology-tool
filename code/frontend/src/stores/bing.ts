import { defineStore } from 'pinia';
import { ref } from 'vue';
import { bingApi } from '../services/chart-api';

export const useBingStore = defineStore('bing', () => {
  const bingData = ref<any>(null);
  const yongshenData = ref<any>(null);
  const jixiongData = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchDiagnosis(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await bingApi.diagnose(chartId);
      bingData.value = response.data;
      return bingData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取病机诊断失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchYongshen(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await bingApi.getYongshen(chartId);
      yongshenData.value = response.data;
      return yongshenData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取用神喜忌失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchJiXiong(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await bingApi.getJiXiong(chartId);
      jixiongData.value = response.data;
      return jixiongData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取断吉凶数据失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { bingData, yongshenData, jixiongData, loading, error, fetchDiagnosis, fetchYongshen, fetchJiXiong };
});