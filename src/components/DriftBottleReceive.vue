<template>
  <div class="drift-bottle-receive-modal">
    <div class="bottle-header">
      <h3>漂流瓶</h3>
      <button class="close-btn" @click="closeBottle">×</button>
    </div>
    <div class="bottle-content">
      <div v-if="errorMsg" class="error-msg">{{ errorMsg }}</div>
      <template v-else>
        <div class="message">{{ bottle.content }}</div>
        <div class="image-wrapper" v-if="bottle.image_url">
          <img :src="BASE_URL + bottle.image_url" alt="漂流瓶图片" class="bottle-image" />
        </div>
        <div class="time">{{ formatTime(bottle.created_at || bottle.createdAt) }}</div>
      </template>
    </div>
    <div class="bottle-footer">
      <button class="close-bottle-btn" @click="closeBottle">关闭漂流瓶</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { BASE_URL } from '@/api'

const emit = defineEmits(['close'])
const toast = useToast()

const bottle = ref({
  content: '',
  images: [],
  createdAt: null
})

const errorMsg = ref('')
const lastBottleId = ref(null)

const fetchRandomBottle = async () => {
  errorMsg.value = ''
  try {
    const response = await axios.get(`${BASE_URL}/api/drift-bottles/random`, {
      params: lastBottleId.value ? { exclude: lastBottleId.value } : {}
    })
    bottle.value = response.data
    lastBottleId.value = response.data.id
  } catch (error) {
    errorMsg.value = error.response?.data?.message || '暂无漂流瓶'
  }
}

const closeBottle = () => {
  emit('close')
}

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchRandomBottle()
})
</script>

<style scoped>
.drift-bottle-receive-modal {
  background: #f5f3e7;
  border-radius: 16px;
  border: 1.5px solid #d6c9a5;
  padding: 32px 32px 24px 32px;
  width: 660px;
  max-width: 98vw;
  box-shadow: 0 6px 32px rgba(160, 140, 91, 0.13);
  font-family: 'STKaiti', 'KaiTi', 'STSong', 'SimSun', serif;
}

.bottle-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.bottle-header h3 {
  margin: 0;
  color: #634d0d;
  font-size: 22px;
  font-family: 'STSong', 'SimSun', serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  color: #a08c5b;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.bottle-content {
  margin-bottom: 24px;
}

.message {
  font-size: 18px;
  line-height: 1.7;
  color: #4b3e2e;
  margin-bottom: 18px;
  white-space: pre-wrap;
  font-family: 'STKaiti', 'KaiTi', serif;
  word-break: break-all;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;
}

.bottle-image {
  max-width: 420px;
  max-height: 320px;
  border-radius: 10px;
  border: 1.5px solid #d6c9a5;
  background: #fff;
  box-shadow: 0 2px 12px rgba(160, 140, 91, 0.08);
}

.time {
  font-size: 13px;
  color: #a08c5b;
  text-align: right;
  font-family: 'STSong', 'SimSun', serif;
}

.bottle-footer {
  text-align: right;
}

.close-bottle-btn {
  padding: 10px 36px;
  background: #a08c5b;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: background 0.2s;
}

.close-bottle-btn:hover {
  background: #634d0d;
}

.error-msg {
  color: #d9534f;
  font-size: 18px;
  text-align: center;
  margin: 40px 0;
  font-family: 'STKaiti', 'KaiTi', serif;
}
</style> 