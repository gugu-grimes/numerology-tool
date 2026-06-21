<template>
  <div class="hechong-bing-panel">
    <h4>合冲刑害辨病</h4>
    <a-table v-if="bingJudgments && bingJudgments.length" :dataSource="bingJudgments" :columns="columns" :pagination="false" bordered size="small" />
    <a-empty v-else description="未检测到病机" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ bingJudgments: any[] }>();

const columns = [
  { title: '病机类型', dataIndex: 'type' }, { title: '来源', dataIndex: 'source' },
  { title: '描述', dataIndex: 'description' }, { title: '严重程度', dataIndex: 'severity' },
  { title: '病位', dataIndex: 'bingWei' }, { title: '病象', dataIndex: 'bingXiang' },
];
</script>