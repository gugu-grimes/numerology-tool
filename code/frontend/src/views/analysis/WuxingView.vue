<template>
  <div class="wuxing-view">
    <h2>五行力量分布</h2>
    <a-spin :spinning="analysisStore.loading">
      <template v-if="analysisStore.wuxingData">
        <a-descriptions bordered :column="2" style="margin-bottom: 24px">
          <a-descriptions-item label="金">{{ analysisStore.wuxingData.metal?.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="木">{{ analysisStore.wuxingData.wood?.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="水">{{ analysisStore.wuxingData.water?.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="火">{{ analysisStore.wuxingData.fire?.toFixed(2) }}</a-descriptions-item>
          <a-descriptions-item label="土">{{ analysisStore.wuxingData.earth?.toFixed(2) }}</a-descriptions-item>
        </a-descriptions>
        <a-alert v-if="analysisStore.wuxingData.missing?.length" :message="`五行缺失：${analysisStore.wuxingData.missing.join('、')}`" type="warning" show-icon style="margin-bottom: 16px" />
        <a-alert v-if="analysisStore.wuxingData.dominant?.length" :message="`五行过旺：${analysisStore.wuxingData.dominant.join('、')}`" type="warning" show-icon />
      </template>
      <a-empty v-else description="请先进行排盘后查看五行分析" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useAnalysisStore } from '../../stores/analysis';
import { useChartStore } from '../../stores/chart';

const analysisStore = useAnalysisStore();
const chartStore = useChartStore();

onMounted(async () => {
  if (chartStore.chartData?.id) {
    try {
      await analysisStore.fetchWuxing(chartStore.chartData.id);
    } catch (e) { /* handled in store */ }
  }
});
</script>