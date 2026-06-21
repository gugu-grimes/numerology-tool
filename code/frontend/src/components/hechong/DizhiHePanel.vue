<template>
  <div class="dizhi-he-panel">
    <h4>地支合局</h4>
    <h5>六合</h5>
    <a-table v-if="liuheData && liuheData.length" :dataSource="liuheData" :columns="liuheColumns" :pagination="false" bordered size="small" style="margin-bottom: 16px" />
    <a-empty v-else description="无地支六合组合" style="margin-bottom: 16px" />
    <h5>三合局</h5>
    <a-table v-if="sanheData && sanheData.length" :dataSource="sanheData" :columns="sanheColumns" :pagination="false" bordered size="small" />
    <a-empty v-else description="无地支三合局组合" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ liuheData: any[]; sanheData: any[] }>();

const liuheColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '化出五行', dataIndex: 'targetElement' },
  { title: '合局状态', dataIndex: 'isEstablished', customRender: ({ text }: any) => text ? '成立' : '合而不化' },
  { title: '力量', dataIndex: 'strength' }, { title: '原因', dataIndex: 'reason' },
];
const sanheColumns = [
  { title: '组合', dataIndex: 'combination' }, { title: '化出五行', dataIndex: 'targetElement' },
  { title: '三字齐全', dataIndex: 'isComplete', customRender: ({ text }: any) => text ? '齐全' : '半合' },
  { title: '力量', dataIndex: 'strength' }, { title: '原因', dataIndex: 'reason' },
];
</script>