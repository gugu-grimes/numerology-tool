<template>
  <div class="geju-view">
    <h2>格局判定与喜忌</h2>
    <a-spin :spinning="analysisStore.loading">
      <template v-if="analysisStore.gejuData">
        <a-descriptions bordered :column="1" style="margin-bottom: 24px">
          <a-descriptions-item label="月令本气十神">{{ analysisStore.gejuData.monthBranchGod }}</a-descriptions-item>
          <a-descriptions-item label="格局类型">{{ analysisStore.gejuData.patternType }}</a-descriptions-item>
          <a-descriptions-item label="格局状态">{{ analysisStore.gejuData.isEstablished ? '成格' : '破格' }}</a-descriptions-item>
          <a-descriptions-item v-if="analysisStore.gejuData.breakReason" label="破格原因">{{ analysisStore.gejuData.breakReason }}</a-descriptions-item>
          <a-descriptions-item label="喜神五行">{{ analysisStore.gejuData.favorableElements?.join('、') }}</a-descriptions-item>
          <a-descriptions-item label="忌神五行">{{ analysisStore.gejuData.unfavorableElements?.join('、') }}</a-descriptions-item>
          <a-descriptions-item label="闲神五行">{{ analysisStore.gejuData.neutralElements?.join('、') }}</a-descriptions-item>
        </a-descriptions>
      </template>
      <a-empty v-else description="请先进行排盘后查看格局判定" />
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
    try { await analysisStore.fetchGeju(chartStore.chartData.id); } catch (e) { /* handled */ }
  }
});
</script>