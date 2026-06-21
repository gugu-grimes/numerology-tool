import { defineStore } from 'pinia';
import { ref } from 'vue';
import { analysisApi } from '../services/chart-api';

export const useAnalysisStore = defineStore('analysis', () => {
  const wuxingData = ref<any>(null);
  const wangShuaiData = ref<any>(null);
  const shishenData = ref<any>(null);
  const gejuData = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchWuxing(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await analysisApi.getWuxing(chartId);
      wuxingData.value = response.data;
      return wuxingData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取五行分析失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchWangShuai(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await analysisApi.getWangShuai(chartId);
      wangShuaiData.value = response.data;
      return wangShuaiData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取旺衰判定失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchShishen(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await analysisApi.getShishen(chartId);
      shishenData.value = response.data;
      return shishenData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取十神标注失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function fetchGeju(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await analysisApi.getGeju(chartId);
      gejuData.value = response.data;
      return gejuData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取格局判定失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { wuxingData, wangShuaiData, shishenData, gejuData, loading, error, fetchWuxing, fetchWangShuai, fetchShishen, fetchGeju };
});