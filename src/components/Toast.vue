<template>
  <transition name="toast-fade">
    <div v-if="visible" :class="['toast', type]">
      <span class="icon">
        <svg v-if="type==='success'" viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="12" fill="#4caf50"/><path d="M7 13l3 3 7-7" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <svg v-else-if="type==='error'" viewBox="0 0 24 24" width="22" height="22" fill="none"><circle cx="12" cy="12" r="12" fill="#e53935"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>
      </span>
      <span class="msg">{{ message }}</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success' // 或 'error'
  },
  duration: {
    type: Number,
    default: 2000
  },
  show: Boolean
})

const visible = ref(props.show)

watch(() => props.show, (val) => {
  visible.value = val
  if (val) {
    setTimeout(() => {
      visible.value = false
    }, props.duration)
  }
}, { immediate: true })
</script>

<style scoped>
.toast {
  position: fixed;
  top: 32px;
  right: 32px;
  min-width: 200px;
  max-width: 360px;
  padding: 16px 32px 16px 18px;
  border-radius: 12px;
  color: #fff;
  font-size: 1.08rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  z-index: 9999;
  opacity: 0.98;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(90deg, #fff1, transparent 80%);
  border: 1.5px solid rgba(0,0,0,0.06);
  animation: toast-pop 0.4s cubic-bezier(.68,-0.55,.27,1.55);
}
.toast.success {
  background: linear-gradient(90deg, #4caf50 90%, #43a047 100%);
}
.toast.error {
  background: linear-gradient(90deg, #e53935 90%, #b71c1c 100%);
}
.icon {
  display: flex;
  align-items: center;
  margin-right: 2px;
}
.msg {
  flex: 1;
  word-break: break-all;
}
@keyframes toast-pop {
  0% { transform: translateY(-30px) scale(0.95); opacity: 0; }
  100% { transform: translateY(0) scale(1); opacity: 1; }
}
.toast-fade-enter-active, .toast-fade-leave-active {
  transition: opacity 0.4s;
}
.toast-fade-enter-from, .toast-fade-leave-to {
  opacity: 0;
}
</style> 