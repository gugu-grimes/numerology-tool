<template>
  <div class="chart-result">
    <h2>四柱排盘结果</h2>
    <a-spin :spinning="loading" v-if="!chartData">
      <a-empty description="暂无排盘结果，请先进行排盘" />
    </a-spin>
    <template v-else-if="chartData">
      <a-descriptions bordered :column="1" title="命盘信息" style="margin-bottom: 24px">
        <a-descriptions-item label="日主">{{ chartData.dayMaster }} ({{ chartData.dayMasterElement }})</a-descriptions-item>
        <a-descriptions-item label="出生时间">{{ chartData.birthDate }}</a-descriptions-item>
        <a-descriptions-item label="输入方式">{{ chartData.birthDateType === 'solar' ? '公历' : '农历' }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{ chartData.gender === 'male' ? '男' : '女' }}</a-descriptions-item>
        <a-descriptions-item label="节气">{{ chartData.jieqiName || '无' }}</a-descriptions-item>
        <a-descriptions-item label="子时处理">{{ chartData.zhourule === 'early_zi' ? '早子时' : '夜子时' }}</a-descriptions-item>
      </a-descriptions>

      <h3>四柱</h3>
      <a-table :columns="pillarColumns" :dataSource="chartData.pillars" :pagination="false" rowKey="position" bordered>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'hiddenStems'">
            <div>本气: {{ record.hiddenStems?.mainQi || '-' }}</div>
            <div v-if="record.hiddenStems?.middleQi">中气: {{ record.hiddenStems.middleQi }}</div>
            <div v-if="record.hiddenStems?.residualQi">余气: {{ record.hiddenStems.residualQi }}</div>
          </template>
        </template>
      </a-table>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useChartStore } from '../../stores/chart';

const chartStore = useChartStore();
const route = useRoute();
const chartData = ref<any>(null);
const loading = ref(false);

const pillarColumns = [
  { title: '柱位', dataIndex: 'position', key: 'position', customRender: ({ text }: any) => {
    const map: Record<string, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };
    return map[text] || text;
  }},
  { title: '天干', dataIndex: 'heavenlyStem', key: 'heavenlyStem' },
  { title: '地支', dataIndex: 'earthlyBranch', key: 'earthlyBranch' },
  { title: '藏干', dataIndex: 'hiddenStems', key: 'hiddenStems' },
  { title: '纳音五行', dataIndex: 'nayin', key: 'nayin' },
];

onMounted(async () => {
  const chartId = route.query.id ? Number(route.query.id) : null;
  if (chartId) {
    loading.value = true;
    try {
      chartData.value = await chartStore.getChart(chartId);
    } catch (e) {
      // Error handled in store
    } finally {
      loading.value = false;
    }
  } else if (chartStore.chartData) {
    chartData.value = chartStore.chartData;
  }
});
</script>

<style scoped>
.chart-result {
  max-width: 900px;
  margin: 0 auto;
}
</style>