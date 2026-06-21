<template>
  <div class="tiangan-he-panel">
    <h4>天干合化</h4>
    <a-table v-if="data && data.length" :dataSource="data" :columns="columns" :pagination="false" bordered size="small" />
    <a-empty v-else description="无天干合化组合" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ data: any[] }>();

const columns = [
  { title: '组合', dataIndex: 'combination' },
  { title: '化出五行', dataIndex: 'targetElement' },
  { title: '合化状态', dataIndex: 'isTransformed', customRender: ({ text }: any) => text ? '合化成功' : '合而不化' },
  { title: '原因', dataIndex: 'reason' },
];
</script>