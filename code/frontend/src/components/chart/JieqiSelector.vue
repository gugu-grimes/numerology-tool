<template>
  <div class="jieqi-selector">
    <h4>节气交接点</h4>
    <a-select v-model:value="selectedYear" style="width: 120px; margin-bottom: 16px" @change="fetchJieqi">
      <a-select-option v-for="y in years" :key="y" :value="y">{{ y }}年</a-select-option>
    </a-select>
    <a-table v-if="jieqiList.length" :dataSource="jieqiList" :columns="columns" :pagination="false" bordered size="small" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { calendarApi } from '../../services/chart-api';

const selectedYear = ref(new Date().getFullYear());
const jieqiList = ref<Array<{ name: string; datetime: string; description: string }>>([]);
const columns = [
  { title: '节气', dataIndex: 'name' },
  { title: '交接时刻', dataIndex: 'datetime' },
  { title: '说明', dataIndex: 'description' },
];

const years = Array.from({ length: 201 }, (_, i) => 1900 + i);

async function fetchJieqi() {
  try {
    const response = await calendarApi.getJieqi(selectedYear.value);
    jieqiList.value = response.data.jieqiList;
  } catch (e) { /* handled */ }
}

onMounted(() => {
  fetchJieqi();
});
</script>