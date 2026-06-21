<template>
  <div class="nayin-panel">
    <h4>纳音五行 <a-switch v-model:checked="showNayin" size="small" style="margin-left: 8px" /></h4>
    <a-table v-if="showNayin && pillars && pillars.length" :dataSource="nayinRows" :columns="columns" :pagination="false" bordered size="small" />
    <a-empty v-else-if="showNayin" description="暂无纳音数据" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  pillars: Array<{ position: string; heavenlyStem: string; earthlyBranch: string; nayin: string | null }>;
}>();

const showNayin = ref(false);
const columns = [
  { title: '柱位', dataIndex: 'positionLabel' },
  { title: '干支', dataIndex: 'ganZhi' },
  { title: '纳音五行', dataIndex: 'nayin' },
];

const posMap: Record<string, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };

const nayinRows = computed(() => {
  if (!props.pillars) return [];
  return props.pillars.map((p) => ({
    positionLabel: posMap[p.position] || p.position,
    ganZhi: `${p.heavenlyStem}${p.earthlyBranch}`,
    nayin: p.nayin || '-',
  }));
});
</script>