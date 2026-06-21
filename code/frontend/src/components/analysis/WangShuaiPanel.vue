<template>
  <div class="wang-shuai-panel">
    <h4>日主旺衰判定</h4>
    <template v-if="data">
      <a-descriptions bordered :column="1" size="small">
        <a-descriptions-item label="日主">{{ data.dayMaster }} ({{ data.dayMasterElement }})</a-descriptions-item>
        <a-descriptions-item label="旺衰结论">{{ data.strengthLabel }}</a-descriptions-item>
        <a-descriptions-item label="得令">{{ data.deLing?.result ? '✓' : '✗' }} — {{ data.deLing?.description }}</a-descriptions-item>
        <a-descriptions-item label="得地">{{ data.deDi?.result ? '✓' : '✗' }} — {{ data.deDi?.description }}</a-descriptions-item>
        <a-descriptions-item label="得助">{{ data.deZhu?.result ? '✓' : '✗' }} — {{ data.deZhu?.description }}</a-descriptions-item>
      </a-descriptions>
    </template>
    <a-empty v-else description="暂无旺衰数据" />
  </div>
</template>

<script setup lang="ts">
defineProps<{ data: any }>();
</script>