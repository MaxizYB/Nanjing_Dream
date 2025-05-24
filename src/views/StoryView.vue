<template>
  <div class="story-view" :style="{ backgroundImage: `url(${story?.background || ''})` }">
    <div class="dialogue-box" @click="handleDialogueBoxClick" @wheel="handleWheel">
      <div class="speaker" v-if="currentLine.speaker">{{ currentLine.speaker }}</div>
      <div class="text">{{ currentLine.text }}</div>
      <button v-if="isEnd" @click="returnToMap" class="return-btn">返回地图</button>
    </div>
    <div v-if="currentLine.options" class="center-options">
      <button v-for="(opt, idx) in currentLine.options" :key="idx" @click.stop="chooseOption(opt)" class="option-btn">{{ opt.text }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storyMarkers } from '../assets/scripts/markers/storyMarkers'
import axios from 'axios'
import { BASE_URL } from '@/api'

const route = useRoute()
const router = useRouter()
const storyId = route.params.id
const story = storyMarkers.find(s => s.id === storyId)

const lineIndex = ref(0)
const currentLine = computed(() => story?.script[lineIndex.value] || {})
const isEnd = computed(() => !currentLine.value.options && !currentLine.value.next && lineIndex.value >= story.script.length - 1)

function nextLine() {
  if (currentLine.value.next !== undefined) {
    lineIndex.value = currentLine.value.next
  } else {
    lineIndex.value++
  }
}

function chooseOption(opt) {
  if (opt.next !== undefined) {
    lineIndex.value = opt.next
  }
}

function handleDialogueBoxClick() {
  if (!currentLine.value.options && !isEnd.value) {
    nextLine()
  }
}

function handleWheel(e) {
  if (currentLine.value.options || isEnd.value) return
  if (e.deltaY > 0) {
    nextLine()
  } else if (e.deltaY < 0 && lineIndex.value > 0) {
    lineIndex.value--
  }
}

function returnToMap() {
  if (story && story.period) {
    router.push({ path: '/map', query: { period: story.period } })
  } else {
    router.push('/map')
  }
}

watchEffect(() => {
  if (story && story.id) {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const userId = payload.userId || payload.id
      if (!userId) return
      axios.post(`${BASE_URL}/api/achievement/visit-story`, {
        user_id: userId,
        story_id: story.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(() => {
        console.log('访问故事统计已上报', story.id)
      }).catch(err => {
        console.error('访问故事统计失败', err)
      })
    } catch (e) {}
  }
})
</script>

<style scoped>
.story-view {
  width: 100vw;
  height: 100vh;
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.dialogue-box {
  width: 90vw;
  max-width: 900px;
  height: 200px;
  background: rgba(255, 255, 245, 0.75);
  border-radius: 18px;
  box-shadow: 0 0 24px rgba(80,60,30,0.13);
  margin-bottom: 2vh;
  padding: 28px 32px 24px 32px;
  font-family: 'STKaiti', 'KaiTi', 'STSong', 'SimSun', serif;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.speaker {
  font-weight: bold;
  color: #a08c5b;
  font-size: 1.1rem;
  margin-bottom: 8px;
  flex-shrink: 0;
}
.text {
  color: #4b3e2e;
  font-size: 1.18rem;
  margin-bottom: 18px;
  word-break: break-all;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
}
.return-btn {
  position: fixed;
  top: 60px;
  right: 20px;
  z-index: 100;
  padding: 8px 24px;
  background: #a08c5b;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  cursor: pointer;
  transition: background 0.2s;
}
.return-btn:hover {
  background: #8b7a4d;
}
.center-options {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  z-index: 10;
}
.option-btn {
  min-width: 420px;
  max-width: 90vw;
  padding: 16px 64px;
  background: rgba(255,255,245,0.92);
  border: 2.5px solid #d6c9a5;
  border-radius: 18px;
  color: #634d0d;
  font-size: 1.35rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  box-shadow: 0 2px 16px rgba(160,140,91,0.10);
  cursor: pointer;
  transition: background 0.2s, border 0.2s;
  margin: 0 auto;
  text-align: center;
}
.option-btn:hover {
  background: #e6e1d3;
  border-color: #a08c5b;
}
</style> 