import { defineStore } from 'pinia';
import { ref } from 'vue';
import { hechongApi } from '../services/chart-api';

export const useHechongStore = defineStore('hechong', () => {
  const hechongData = ref<any>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRelations(chartId: number) {
    loading.value = true;
    error.value = null;
    try {
      const response = await hechongApi.getRelations(chartId);
      hechongData.value = response.data;
      return hechongData.value;
    } catch (e: any) {
      error.value = e.response?.data?.detail || '获取合冲刑害数据失败';
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return { hechongData, loading, error, fetchRelations };
});