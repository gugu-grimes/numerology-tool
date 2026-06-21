<template>
  <div class="bing-diagnosis-view">
    <h2>病机诊断总览</h2>
    <a-spin :spinning="bingStore.loading">
      <template v-if="bingStore.bingData">
        <a-alert v-for="disease in bingStore.bingData.diseases" :key="disease.type"
          :message="`${disease.name} — ${disease.position}`"
          :description="`${disease.manifestation}（严重程度：${severityMap[disease.severity] || disease.severity}）`"
          :type="disease.severity === 'severe' ? 'error' : disease.severity === 'moderate' ? 'warning' : 'info'"
          show-icon style="margin-bottom: 8px" />

        <a-descriptions bordered :column="1" title="病机详情" style="margin-top: 16px">
          <a-descriptions-item v-if="bingStore.bingData.dayMasterExcess" label="日主过旺">{{ formatDetail(bingStore.bingData.dayMasterExcess) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.dayMasterWeakness" label="日主过弱">{{ formatDetail(bingStore.bingData.dayMasterWeakness) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.wuxingImbalance" label="五行偏枯">{{ formatDetail(bingStore.bingData.wuxingImbalance) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.wuxingAbsence" label="五行缺漏">{{ formatDetail(bingStore.bingData.wuxingAbsence) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.shishenConflict" label="十神交战">{{ formatDetail(bingStore.bingData.shishenConflict) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.gejuBreak" label="格局破败">{{ formatDetail(bingStore.bingData.gejuBreak) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.heBindYongShen" label="合绊用神">{{ formatDetail(bingStore.bingData.heBindYongShen) }}</a-descriptions-item>
          <a-descriptions-item v-if="bingStore.bingData.temperatureImbalance" label="寒暖湿燥失衡">{{ formatDetail(bingStore.bingData.temperatureImbalance) }}</a-descriptions-item>
        </a-descriptions>
      </template>
      <a-empty v-else description="请先进行排盘后查看病机诊断" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBingStore } from '../../stores/bing';
import { useChartStore } from '../../stores/chart';

const bingStore = useBingStore();
const chartStore = useChartStore();

const severityMap: Record<string, string> = { severe: '重病', moderate: '微恙', latent: '潜伏' };

function formatDetail(detail: any): string {
  if (!detail) return '-';
  return `${detail.name || ''} ${detail.manifestation || ''}`;
}

onMounted(async () => {
  if (chartStore.chartData?.id) {
    try { await bingStore.fetchDiagnosis(chartStore.chartData.id); } catch (e) { /* handled */ }
  }
});
</script>