<template>
  <div class="yongshen-view">
    <h2>用神喜忌推导</h2>
    <a-spin :spinning="bingStore.loading">
      <template v-if="bingStore.yongshenData">
        <a-descriptions bordered :column="1" title="用神" style="margin-bottom: 24px">
          <a-descriptions-item label="用神五行">{{ bingStore.yongshenData.yongShen?.element }}</a-descriptions-item>
          <a-descriptions-item label="用神十神">{{ bingStore.yongshenData.yongShen?.shishen }}</a-descriptions-item>
          <a-descriptions-item label="推导逻辑">{{ bingStore.yongshenData.yongShen?.derivationLogic }}</a-descriptions-item>
          <a-descriptions-item label="病机来源">{{ bingStore.yongshenData.yongShen?.diseaseSource }}</a-descriptions-item>
          <a-descriptions-item label="力量">{{ bingStore.yongshenData.yongShen?.strength }}</a-descriptions-item>
        </a-descriptions>

        <h3>喜神</h3>
        <a-table :dataSource="bingStore.yongshenData.xiShen || []" :columns="xiJiColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />

        <h3>忌神</h3>
        <a-table :dataSource="bingStore.yongshenData.jiShen || []" :columns="xiJiColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />

        <h3>仇神</h3>
        <a-table :dataSource="bingStore.yongshenData.chouShen || []" :columns="xiJiColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />

        <h3>闲神</h3>
        <a-table :dataSource="bingStore.yongshenData.xianShen || []" :columns="xiJiColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />

        <h3>推导逻辑链</h3>
        <a-timeline>
          <a-timeline-item v-for="step in bingStore.yongshenData.derivationChains || []" :key="step.step">
            <p><strong>步骤 {{ step.step }}:</strong> {{ step.disease }} → {{ step.yongShenCandidate }}（{{ step.logic }}）</p>
          </a-timeline-item>
        </a-timeline>
      </template>
      <a-empty v-else description="请先进行病机诊断后查看用神喜忌" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBingStore } from '../../stores/bing';
import { useChartStore } from '../../stores/chart';

const bingStore = useBingStore();
const chartStore = useChartStore();

const xiJiColumns = [
  { title: '五行', dataIndex: 'element' },
  { title: '十神', dataIndex: 'shishen' },
  { title: '推导逻辑', dataIndex: 'derivationLogic' },
];

onMounted(async () => {
  if (chartStore.chartData?.id) {
    try { await bingStore.fetchYongshen(chartStore.chartData.id); } catch (e) { /* handled */ }
  }
});
</script>