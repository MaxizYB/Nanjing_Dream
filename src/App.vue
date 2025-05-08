<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TimelineSwitcher from './components/TimelineSwitcher.vue'

const currentPeriod = ref('modern') // 默认最新
const router = useRouter()
const route = useRoute()

function handlePeriodChange(period) {
  currentPeriod.value = period
  if (route.path !== '/map') {
    router.push('/map')
  }
}
</script>

<template>
  <div class="app-layout">
    <nav class="top-navbar">
      <div class="navbar-section logo">LOGO</div>
      <button class="menu-btn" @click="router.push('/')">主页面</button>
      <TimelineSwitcher
        :current-period="currentPeriod"
        @period-change="handlePeriodChange"
        style="margin-left: 16px; width: 300px;"
      />
    </nav>
    <main class="main-content">
      <router-view :period="currentPeriod" />
    </main>
  </div>
</template>

<style>
html, body, #app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.top-navbar {
  width: 100%;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #f5f3e7 80%, #e6e1d3 100%);
  border-bottom: 1.5px solid #d6c9a5;
  padding: 0 24px;
  height: 48px;
  min-height: 48px;
  box-sizing: border-box;
}
.navbar-section.logo {
  font-size: 1.4rem;
  font-weight: bold;
  color: #a08c5b;
  font-family: 'STSong', 'SimSun', serif;
  margin-right: 24px;
  white-space: nowrap;
}
.menu-btn {
  background: #e6e1d3;
  color: #4b3e2e;
  border: none;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 1.1rem;
  margin-right: 20px;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-btn:hover {
  background: #d6c9a5;
  color: #3a2d1a;
}
.main-content {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>
