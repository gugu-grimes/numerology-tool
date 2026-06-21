<template>
  <div class="chart-input">
    <h2>排盘输入</h2>
    <a-form :model="formState" @finish="onSubmit" layout="vertical">
      <a-form-item label="输入方式" name="birthDateType" :rules="[{ required: true, message: '请选择输入方式' }]">
        <a-radio-group v-model:value="formState.birthDateType">
          <a-radio-button value="solar">公历</a-radio-button>
          <a-radio-button value="lunar">农历</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <template v-if="formState.birthDateType === 'solar'">
        <a-form-item label="出生日期时间" name="birthDate" :rules="[{ required: true, message: '请输入出生日期' }]">
          <a-date-picker v-model:value="formState.birthDate" show-time style="width: 100%" />
        </a-form-item>
      </template>

      <template v-if="formState.birthDateType === 'lunar'">
        <a-form-item label="农历年" name="lunarYear" :rules="[{ required: true, message: '请输入农历年' }]">
          <a-input-number v-model:value="formState.lunarYear" :min="1900" :max="2100" style="width: 100%" />
        </a-form-item>
        <a-form-item label="农历月" name="lunarMonth" :rules="[{ required: true, message: '请输入农历月' }]">
          <a-input-number v-model:value="formState.lunarMonth" :min="1" :max="12" style="width: 100%" />
        </a-form-item>
        <a-form-item label="农历日" name="lunarDay" :rules="[{ required: true, message: '请输入农历日' }]">
          <a-input-number v-model:value="formState.lunarDay" :min="1" :max="30" style="width: 100%" />
        </a-form-item>
        <a-form-item label="是否闰月">
          <a-switch v-model:checked="formState.isLeapMonth" />
        </a-form-item>
      </template>

      <a-form-item label="性别" name="gender" :rules="[{ required: true, message: '请选择性别' }]">
        <a-radio-group v-model:value="formState.gender">
          <a-radio-button value="male">男</a-radio-button>
          <a-radio-button value="female">女</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item label="子时处理方式" name="zhourule">
        <a-radio-group v-model:value="formState.zhourule">
          <a-radio-button value="early_zi">早子时（日柱归属当日）</a-radio-button>
          <a-radio-button value="late_zi">夜子时（日柱归属次日）</a-radio-button>
        </a-radio-group>
      </a-form-item>

      <a-form-item>
        <a-button type="primary" html-type="submit" :loading="chartStore.loading" size="large">
          开始排盘
        </a-button>
      </a-form-item>
    </a-form>

    <a-alert v-if="chartStore.error" :message="chartStore.error" type="error" show-icon style="margin-top: 16px" />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useChartStore } from '../../stores/chart';

const chartStore = useChartStore();
const router = useRouter();

const formState = reactive({
  birthDateType: 'solar' as 'solar' | 'lunar',
  birthDate: undefined as any,
  gender: 'male' as 'male' | 'female',
  lunarYear: 1990,
  lunarMonth: 1,
  lunarDay: 1,
  isLeapMonth: false,
  zhourule: 'early_zi' as 'early_zi' | 'late_zi',
});

async function onSubmit() {
  try {
    const input: any = {
      birthDateType: formState.birthDateType,
      gender: formState.gender,
      zhourule: formState.zhourule,
    };

    if (formState.birthDateType === 'solar') {
      input.birthDate = formState.birthDate?.toISOString();
    } else {
      input.lunarBirthInfo = {
        year: formState.lunarYear,
        month: formState.lunarMonth,
        day: formState.lunarDay,
        isLeapMonth: formState.isLeapMonth,
      };
    }

    const result = await chartStore.calculate(input);
    if (result) {
      router.push('/chart/result');
    }
  } catch (e) {
    // Error is already handled in store
  }
}
</script>

<style scoped>
.chart-input {
  max-width: 600px;
  margin: 0 auto;
}
</style>