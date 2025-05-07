<template>
  <div class="timeline-switcher">
    <div class="timeline-bar">
      <div class="line"></div>
      <div
        v-for="(period, idx) in periods"
        :key="period.key"
        class="timeline-item"
        :class="{ active: period.key === currentPeriod }"
        @click="$emit('period-change', period.key)"
        :style="{ left: `calc(${(0.12 + idx * 0.76/(periods.length-1)) * 100}% )` }"
      >
        <div class="dot"></div>
        <div class="label">{{ period.label }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  currentPeriod: String
})
const periods = [
  { key: 'sui-tang', label: '隋唐五代' },
  { key: 'song-yuan', label: '宋元' },
  { key: 'ming', label: '明' },
  { key: 'qing', label: '清' },
  { key: 'minguo', label: '民国' },
  { key: 'modern', label: '新中国至今' }
]
</script>

<style scoped>
.timeline-switcher {
  padding: 0 2px;
  background: transparent;
  overflow: hidden;
  height: 22px;
  min-width: 320px;
  max-width: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.timeline-bar {
  position: relative;
  width: 100%;
  height: 16px;
  min-width: 220px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  box-sizing: border-box;
}
.line {
  position: absolute;
  top: 8px;
  left: 0;
  right: 0;
  height: 2px;
  background: #bfae8e;
  border-radius: 1px;
  z-index: 0;
}
.timeline-item {
  position: absolute;
  top: 2px;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  z-index: 1;
  width: 32px;
}
.dot {
  width: 5px;
  height: 5px;
  background: #e6e1d3;
  border-radius: 50%;
  border: 1px solid #bfae8e;
  margin-bottom: 1px;
  transition: background 0.2s, border 0.2s;
}
.timeline-item.active .dot {
  background: #a08c5b;
  border: 1px solid #a08c5b;
}
.label {
  font-size: 0.52rem;
  color: #7c6a4d;
  margin-top: 0px;
  text-align: center;
  white-space: nowrap;
  font-family: 'STKaiti', 'KaiTi', serif;
  line-height: 1.1;
  overflow: visible;
}
.timeline-item.active .label {
  color: #a08c5b;
  font-weight: bold;
}
</style> 