<template>
  <div class="zanggan-panel">
    <h4>藏干展示</h4>
    <a-table v-if="pillars && pillars.length" :dataSource="zangganRows" :columns="columns" :pagination="false" bordered size="small" />
    <a-empty v-else description="暂无藏干数据" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DIZHI_CANGGAN } from '../../../../../../backend/src/modules/chart/lib/sizhu';

const props = defineProps<{
  pillars: Array<{ position: string; earthlyBranch: string; hiddenStems: { mainQi: string; middleQi: string | null; residualQi: string | null } }>;
}>();

const columns = [
  { title: '柱位', dataIndex: 'positionLabel' },
  { title: '地支', dataIndex: 'branch' },
  { title: '本气', dataIndex: 'mainQi' },
  { title: '中气', dataIndex: 'middleQi' },
  { title: '余气', dataIndex: 'residualQi' },
];

const posMap: Record<string, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };

const zangganRows = computed(() => {
  if (!props.pillars) return [];
  return props.pillars.map((p) => ({
    positionLabel: posMap[p.position] || p.position,
    branch: p.earthlyBranch,
    mainQi: p.hiddenStems?.mainQi || '-',
    middleQi: p.hiddenStems?.middleQi || '-',
    residualQi: p.hiddenStems?.residualQi || '-',
  }));
});
</script>