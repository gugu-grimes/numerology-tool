<template>
  <div class="jixiong-view">
    <h2>断吉凶</h2>
    <a-spin :spinning="bingStore.loading">
      <template v-if="bingStore.jixiongData">
        <a-descriptions bordered :column="1" v-for="(dim, key) in dimensions" :key="key" :title="dim.label" style="margin-bottom: 16px">
          <a-descriptions-item label="论断结论">{{ bingStore.jixiongData[key]?.conclusion }}</a-descriptions-item>
          <a-descriptions-item label="病机依据">{{ bingStore.jixiongData[key]?.diseaseBasis }}</a-descriptions-item>
          <a-descriptions-item label="用神推导">{{ bingStore.jixiongData[key]?.yongShenLogic }}</a-descriptions-item>
          <a-descriptions-item label="严重程度">{{ bingStore.jixiongData[key]?.severity }}</a-descriptions-item>
          <a-descriptions-item label="详细论断">{{ bingStore.jixiongData[key]?.details }}</a-descriptions-item>
        </a-descriptions>
      </template>
      <a-empty v-else description="请先进行用神喜忌推导后查看断吉凶" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBingStore } from '../../stores/bing';
import { useChartStore } from '../../stores/chart';

const bingStore = useBingStore();
const chartStore = useChartStore();

const dimensions: Record<string, { label: string }> = {
  personality: { label: '性格特质' },
  career: { label: '事业官运' },
  wealth: { label: '财运' },
  marriage: { label: '婚姻感情' },
  health: { label: '健康寿元' },
  education: { label: '学业文昌' },
};

onMounted(async () => {
  if (chartStore.chartData?.id) {
    try { await bingStore.fetchJiXiong(chartStore.chartData.id); } catch (e) { /* handled */ }
  }
});
</script>