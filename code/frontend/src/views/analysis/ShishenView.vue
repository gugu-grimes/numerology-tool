<template>
  <div class="shishen-view">
    <h2>十神标注</h2>
    <a-spin :spinning="analysisStore.loading">
      <template v-if="analysisStore.shishenData">
        <h3>天干十神</h3>
        <a-table :dataSource="stemRows" :columns="stemColumns" :pagination="false" bordered style="margin-bottom: 24px" />
        <h3>藏干十神</h3>
        <a-table :dataSource="hiddenRows" :columns="hiddenColumns" :pagination="false" bordered />
      </template>
      <a-empty v-else description="请先进行排盘后查看十神标注" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAnalysisStore } from '../../stores/analysis';
import { useChartStore } from '../../stores/chart';

const analysisStore = useAnalysisStore();
const chartStore = useChartStore();

const stemColumns = [
  { title: '柱位', dataIndex: 'position', key: 'position' },
  { title: '天干', dataIndex: 'stem', key: 'stem' },
  { title: '十神', dataIndex: 'god', key: 'god' },
];

const hiddenColumns = [
  { title: '柱位', dataIndex: 'position', key: 'position' },
  { title: '地支', dataIndex: 'branch', key: 'branch' },
  { title: '本气', dataIndex: 'mainQi', key: 'mainQi' },
  { title: '中气', dataIndex: 'middleQi', key: 'middleQi' },
  { title: '余气', dataIndex: 'residualQi', key: 'residualQi' },
];

const stemRows = computed(() => {
  if (!analysisStore.shishenData?.stemLabels) return [];
  const labels = analysisStore.shishenData.stemLabels;
  const posMap: Record<string, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };
  return Object.entries(labels).map(([pos, val]: [string, any]) => ({
    position: posMap[pos] || pos,
    stem: val.stem,
    god: val.god,
  }));
});

const hiddenRows = computed(() => {
  if (!analysisStore.shishenData?.hiddenStemLabels) return [];
  const labels = analysisStore.shishenData.hiddenStemLabels;
  const posMap: Record<string, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };
  return Object.entries(labels).map(([pos, val]: [string, any]) => ({
    position: posMap[pos] || pos,
    branch: val.branch,
    mainQi: val.mainQi ? `${val.mainQi.stem}(${val.mainQi.god})` : '-',
    middleQi: val.middleQi ? `${val.middleQi.stem}(${val.middleQi.god})` : '-',
    residualQi: val.residualQi ? `${val.residualQi.stem}(${val.residualQi.god})` : '-',
  }));
});

onMounted(async () => {
  if (chartStore.chartData?.id) {
    try { await analysisStore.fetchShishen(chartStore.chartData.id); } catch (e) { /* handled */ }
  }
});
</script>