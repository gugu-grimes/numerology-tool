<template>
  <div class="yaoxiao-timeline">
    <h4>岁运药效时间线</h4>
    <a-timeline>
      <a-timeline-item v-for="item in timelineData" :key="item.year" :color="statusColor(item.status)">
        <p><strong>{{ item.year }}年 ({{ item.daYun }})</strong></p>
        <p>流年: {{ item.liuNian }}</p>
        <p :style="{ color: statusColor(item.status) }">{{ item.status }} — {{ item.description }}</p>
      </a-timeline-item>
    </a-timeline>
    <a-empty v-if="!timelineData.length" description="暂无药效数据（大运流年模块未实现，使用桩数据）" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { evaluateYaoXiao } from '../../../../../../backend/src/modules/bing/lib/yaoxiao-evaluator';

const props = defineProps<{
  yongShenElement: string;
  jiShenElements: string[];
  diseases: Array<{ type: string; name: string }>;
}>();

const timelineData = ref<any[]>([]);

function statusColor(status: string): string {
  switch (status) {
    case '药到': return 'green';
    case '病重': return 'red';
    case '仇神助忌': return 'orange';
    case '平稳': return 'blue';
    default: return 'gray';
  }
}

onMounted(() => {
  try {
    const result = evaluateYaoXiao(props.yongShenElement || '木', props.jiShenElements || [], props.diseases || []);
    timelineData.value = result;
  } catch (e) {
    timelineData.value = [];
  }
});
</script>