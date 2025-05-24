<template>
  <div class="egg-modal-overlay">
    <div class="egg-modal">
      <img :src="egg.image" class="egg-img" />
      <h3>{{ egg.name }}</h3>
      <p>{{ egg.description }}</p>
      <button class="close-btn" @click="$emit('close')">关闭</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  egg: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.egg-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.egg-modal {
  background-color: #f5f3e7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 380px;
  width: 90vw;
  max-height: 80%;
  overflow: auto;
}

.egg-img {
  max-width: 100%;
  max-height: 100%;
  border-radius: 4px;
  margin-bottom: 16px;
  display: block;
  margin-left: auto;
  margin-right: auto;
}

.close-btn {
  background-color: #a08c5b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 16px;
}

.egg-modal p {
  word-break: break-all;
  white-space: pre-line;
  font-size: 1.08rem;
  color: #4b3e2e;
  margin: 12px 0 0 0;
  line-height: 1.7;
}
</style> 