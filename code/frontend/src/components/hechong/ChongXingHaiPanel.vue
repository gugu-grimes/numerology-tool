<template>
  <div class="chong-xing-hai-panel">
    <h4>冲刑害分析</h4>
    <h5>六冲</h5>
    <a-table v-if="liuchong && liuchong.length" :dataSource="liuchong" :columns="chongColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />
    <a-empty v-else description="无六冲组合" style="margin-bottom: 16px" />
    <h5>三刑</h5>
    <a-table v-if="sanxing && sanxing.length" :dataSource="sanxing" :columns="xingColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />
    <a-empty v-else description="无三刑组合" style="margin-bottom: 16px" />
    <h5>六害</h5>
    <a-table v-if="liuhai && liuhai.length" :dataSource="liuhai" :columns="haiColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />
    <a-empty v-else description="无六害组合" style="margin-bottom: 16px" />
    <h5>自刑</h5>
    <a-table v-if="ziXing && ziXing.length" :dataSource="ziXing" :columns="zixingColumns" :pagination="false" bordered size="small" />
    <a-empty v-else description="无自刑组合" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ liuchong: any[]; sanxing: any[]; liuhai: any[]; ziXing: any[] }>();

const chongColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '方向', dataIndex: 'direction' }, { title: '影响', dataIndex: 'impact' },
];
const xingColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '刑力类型', dataIndex: 'xingType' }, { title: '受刑部位', dataIndex: 'affectedPart' },
];
const haiColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '方向', dataIndex: 'direction' }, { title: '影响', dataIndex: 'impact' },
];
const zixingColumns = [
  { title: '地支', dataIndex: 'branch' }, { title: '柱位', dataIndex: 'position' }, { title: '组合', dataIndex: 'combination' }, { title: '影响', dataIndex: 'impact' },
];
</script>