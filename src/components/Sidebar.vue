<template>
  <nav :class="['sidebar', { collapsed }]">
    <div class="sidebar-header">
      <slot name="logo">
        <div class="logo-placeholder">LOGO</div>
      </slot>
      <button class="collapse-btn" @click="$emit('toggle-collapse')">
        <span v-if="collapsed">▶</span>
        <span v-else>◀</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
const props = defineProps({
  collapsed: Boolean
})
</script>

<style scoped>
.sidebar {
  width: 160px;
  min-width: 40px;
  background: linear-gradient(135deg, #f5f3e7 80%, #e6e1d3 100%);
  border-right: 1.5px solid #d6c9a5;
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  border-radius: 0 16px 16px 0;
  box-shadow: 2px 0 8px rgba(0,0,0,0.03);
  height: 100vh;
}
.sidebar.collapsed {
  width: 40px;
  min-width: 40px;
}
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 4px 6px 4px;
  border-bottom: 1px solid #d6c9a5;
}
.logo-placeholder {
  font-size: 1.1rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: #a08c5b;
  font-family: 'STSong', 'SimSun', serif;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.collapse-btn {
  background: none;
  border: none;
  color: #a08c5b;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 50%;
  padding: 2px 6px;
  transition: background 0.2s;
}
</style> 