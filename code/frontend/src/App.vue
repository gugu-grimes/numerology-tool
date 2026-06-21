<template>
  <a-config-provider :locale="zhCN">
    <div id="app-layout">
      <a-layout style="min-height: 100vh">
        <a-layout-sider v-model:collapsed="collapsed" collapsible breakpoint="lg">
          <div class="logo">八字论断</div>
          <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
            <a-menu-item key="/" @click="$router.push('/')">
              <span>首页</span>
            </a-menu-item>
            <a-menu-item key="/chart" @click="$router.push('/chart')">
              <span>排盘输入</span>
            </a-menu-item>
            <a-menu-item key="/analysis/wuxing" @click="$router.push('/analysis/wuxing')">
              <span>五行分析</span>
            </a-menu-item>
            <a-menu-item key="/analysis/shishen" @click="$router.push('/analysis/shishen')">
              <span>十神标注</span>
            </a-menu-item>
            <a-menu-item key="/analysis/geju" @click="$router.push('/analysis/geju')">
              <span>格局判定</span>
            </a-menu-item>
            <a-menu-item key="/hechong" @click="$router.push('/hechong')">
              <span>合冲刑害</span>
            </a-menu-item>
            <a-menu-item key="/bing" @click="$router.push('/bing')">
              <span>识病诊断</span>
            </a-menu-item>
            <a-menu-item key="/yongshen" @click="$router.push('/yongshen')">
              <span>用神喜忌</span>
            </a-menu-item>
            <a-menu-item key="/jixiong" @click="$router.push('/jixiong')">
              <span>断吉凶</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0 16px">
            <h2 style="margin: 14px 0">八字论断系统</h2>
          </a-layout-header>
          <a-layout-content style="margin: 16px">
            <div style="padding: 24px; background: #fff; min-height: 360px">
              <router-view />
            </div>
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';

const collapsed = ref(false);
const selectedKeys = ref<string[]>(['/']);
</script>

<style>
.logo {
  height: 32px;
  margin: 16px;
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
}
</style>