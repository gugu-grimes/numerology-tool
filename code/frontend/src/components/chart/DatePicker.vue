<template>
  <div class="date-picker">
    <a-form-item label="输入方式">
      <a-radio-group v-model:value="birthDateType" @change="onTypeChange">
        <a-radio-button value="solar">公历</a-radio-button>
        <a-radio-button value="lunar">农历</a-radio-button>
      </a-radio-group>
    </a-form-item>
    <template v-if="birthDateType === 'solar'">
      <a-form-item label="出生日期时间">
        <a-date-picker v-model:value="solarDate" show-time style="width: 100%" />
      </a-form-item>
    </template>
    <template v-else>
      <a-form-item label="农历年">
        <a-input-number v-model:value="lunarYear" :min="1900" :max="2100" style="width: 100%" />
      </a-form-item>
      <a-form-item label="农历月">
        <a-input-number v-model:value="lunarMonth" :min="1" :max="12" style="width: 100%" />
      </a-form-item>
      <a-form-item label="农历日">
        <a-input-number v-model:value="lunarDay" :min="1" :max="30" style="width: 100%" />
      </a-form-item>
      <a-form-item label="闰月">
        <a-switch v-model:checked="isLeapMonth" />
      </a-form-item>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const birthDateType = ref<'solar' | 'lunar'>('solar');
const solarDate = ref<any>(null);
const lunarYear = ref(1990);
const lunarMonth = ref(1);
const lunarDay = ref(1);
const isLeapMonth = ref(false);

function onTypeChange() {
  // Reset form state when switching type
}

defineExpose({
  getFormData() {
    if (birthDateType.value === 'solar') {
      return { birthDateType: 'solar', birthDate: solarDate.value?.toISOString() };
    } else {
      return { birthDateType: 'lunar', lunarBirthInfo: { year: lunarYear.value, month: lunarMonth.value, day: lunarDay.value, isLeapMonth: isLeapMonth.value } };
    }
  },
});
</script>