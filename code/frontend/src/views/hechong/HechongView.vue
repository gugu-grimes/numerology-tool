<template>
  <div class="hechong-view">
    <h2>合冲刑害分析</h2>
    <a-spin :spinning="hechongStore.loading">
      <template v-if="hechongStore.hechongData">
        <a-tabs v-model:activeKey="activeTab">
          <a-tab-pane key="tianganHe" tab="天干合化">
            <a-table :dataSource="hechongStore.hechongData.tianganHe || []" :columns="tianganHeColumns" :pagination="false" bordered size="small" />
          </a-tab-pane>
          <a-tab-pane key="dizhiLiuhe" tab="地支六合">
            <a-table :dataSource="hechongStore.hechongData.dizhiLiuhe || []" :columns="dizhiHeColumns" :pagination="false" bordered size="small" />
          </a-tab-pane>
          <a-tab-pane key="dizhiSanhe" tab="地支三合">
            <a-table :dataSource="hechongStore.hechongData.dizhiSanhe || []" :columns="dizhiSanheColumns" :pagination="false" bordered size="small" />
          </a-tab-pane>
          <a-tab-pane key="chongXingHai" tab="冲刑害">
            <h4>六冲</h4>
            <a-table :dataSource="hechongStore.hechongData.liuchong || []" :columns="chongColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />
            <h4>三刑</h4>
            <a-table :dataSource="hechongStore.hechongData.sanxing || []" :columns="xingColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />
            <h4>六害</h4>
            <a-table :dataSource="hechongStore.hechongData.liuhai || []" :columns="haiColumns" :pagination="false" bordered size="small" />
          </a-tab-pane>
          <a-tab-pane key="bing" tab="辨病">
            <a-table :dataSource="hechongStore.hechongData.bingJudgments || []" :columns="bingColumns" :pagination="false" bordered size="small" />
          </a-tab-pane>
        </a-tabs>
      </template>
      <a-empty v-else description="请先进行排盘后查看合冲刑害分析" />
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useHechongStore } from '../../stores/hechong';
import { useChartStore } from '../../stores/chart';

const hechongStore = useHechongStore();
const chartStore = useChartStore();
const activeTab = ref('tianganHe');

const tianganHeColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '化出五行', dataIndex: 'targetElement' },
  { title: '合化状态', dataIndex: 'isTransformed', customRender: ({ text }: any) => text ? '合化成功' : '合而不化' },
  { title: '原因', dataIndex: 'reason' },
];
const dizhiHeColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '化出五行', dataIndex: 'targetElement' },
  { title: '合局状态', dataIndex: 'isEstablished', customRender: ({ text }: any) => text ? '成立' : '合而不化' },
  { title: '力量', dataIndex: 'strength' }, { title: '原因', dataIndex: 'reason' },
];
const dizhiSanheColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '化出五行', dataIndex: 'targetElement' },
  { title: '三字齐全', dataIndex: 'isComplete', customRender: ({ text }: any) => text ? '齐全' : '半合' },
  { title: '力量', dataIndex: 'strength' }, { title: '原因', dataIndex: 'reason' },
];
const chongColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '方向', dataIndex: 'direction' }, { title: '影响', dataIndex: 'impact' },
];
const xingColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '刑力类型', dataIndex: 'xingType' }, { title: '受刑部位', dataIndex: 'affectedPart' },
];
const haiColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '方向', dataIndex: 'direction' }, { title: '影响', dataIndex: 'impact' },
];
const bingColumns = [
  { title: '病机类型', dataIndex: 'type' }, { title: '来源', dataIndex: 'source' }, { title: '描述', dataIndex: 'description' },
  { title: '严重程度', dataIndex: 'severity' }, { title: '病位', dataIndex: 'bingWei' }, { title: '病象', dataIndex: 'bingXiang' },
];

onMounted(async () => {
  if (chartStore.chartData?.id) {
    try { await hechongStore.fetchRelations(chartStore.chartData.id); } catch (e) { /* handled */ }
  }
});
</script>