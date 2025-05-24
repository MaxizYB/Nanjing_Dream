<template>
  <div class="achievements-bg">
    <div class="achievements-page">
      <h2 class="achieve-title">我的成就</h2>
      <div class="achievement-cards">
        <div class="achievement-card">
          <div class="card-header">
            <span class="badge-icon">🏞️</span>
            <h3>地点探索</h3>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: locationPercent + '%', background: themeColor }">
              <span class="progress-text">{{ locationPercent }}%</span>
            </div>
          </div>
          <p class="progress-desc">
            <span v-if="totalLocations">已探索 {{ visitedLocations.length }} / {{ totalLocations }} 个地点</span>
            <span v-else>暂无可探索地点</span>
          </p>
        </div>
        <div class="achievement-card">
          <div class="card-header">
            <span class="badge-icon">📖</span>
            <h3>故事探索</h3>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: storyPercent + '%', background: themeColor }">
              <span class="progress-text">{{ storyPercent }}%</span>
            </div>
          </div>
          <p class="progress-desc">
            <span v-if="totalStories">已探索 {{ visitedStories.length }} / {{ totalStories }} 个故事</span>
            <span v-else>暂无可探索故事</span>
          </p>
        </div>
        <div class="achievement-card">
          <div class="card-header">
            <span class="badge-icon">🌟</span>
            <h3>隐藏彩蛋收集</h3>
          </div>
          <div class="progress-bar">
            <div class="progress" :style="{ width: eggPercent + '%', background: themeColor }">
              <span class="progress-text">{{ eggPercent }}%</span>
            </div>
          </div>
          <p class="progress-desc">
            <span v-if="totalEggs">已收集 {{ collectedEggIds.length }} / {{ totalEggs }} 个彩蛋</span>
            <span v-else>暂无可收集彩蛋</span>
          </p>
        </div>
      </div>
      <div v-if="!visitedLocations.length && !visitedStories.length" class="empty-tip">
        你还没有探索过任何地点或故事，快去地图上开启你的南京文化之旅吧！
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { BASE_URL } from '@/api'
import { storyMarkers } from '@/assets/scripts/markers/storyMarkers'
import { locationMarkers } from '@/assets/scripts/markers/locations'
import { eggMarkers } from '@/assets/scripts/markers/eggMarkers'

const visitedLocations = ref([])
const totalLocations = ref(0)
const visitedStories = ref([])
const totalStories = ref(0)
const collectedEggIds = ref([])
const totalEggs = eggMarkers.length
const themeColor = '#a08c5b'

const locationPercent = computed(() =>
  totalLocations.value ? Math.round((visitedLocations.value.length / totalLocations.value) * 100) : 0
)
const storyPercent = computed(() =>
  totalStories.value ? Math.round((visitedStories.value.length / totalStories.value) * 100) : 0
)
const eggPercent = computed(() =>
  totalEggs ? Math.round((collectedEggIds.value.length / totalEggs) * 100) : 0
)

function getUserIdFromToken() {
  const token = localStorage.getItem('token')
  if (!token) return ''
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.userId || payload.id || ''
  } catch (e) {
    return ''
  }
}

function calcTotalLocations() {
  let count = 0
  locationMarkers.forEach(loc => {
    if (loc.periods) {
      count += Object.keys(loc.periods).length
    }
  })
  return count
}
function calcTotalStories() {
  return storyMarkers.length
}

onMounted(async () => {
  const userId = getUserIdFromToken()
  if (!userId) return
  const token = localStorage.getItem('token')
  const totalLocationsDynamic = calcTotalLocations()
  const totalStoriesDynamic = calcTotalStories()
  await axios.post(`${BASE_URL}/api/achievement/update-total`, {
    user_id: userId,
    total_locations: totalLocationsDynamic,
    total_stories: totalStoriesDynamic
  }, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const res = await axios.get(`${BASE_URL}/api/achievement/summary?user_id=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  visitedLocations.value = res.data.visitedLocations
  totalLocations.value = res.data.totalLocations
  visitedStories.value = res.data.visitedStories
  totalStories.value = res.data.totalStories
  // 获取已收集彩蛋
  const eggsRes = await axios.get(`${BASE_URL}/api/achievement/eggs?user_id=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  collectedEggIds.value = eggsRes.data.eggs.map(e => e.egg_id)
})
</script>

<style scoped>
.achievements-bg {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f3e7 0%, #e6e1d3 100%);
  padding: 0;
}
.achievements-page {
  max-width: 700px;
  margin: 48px auto 0 auto;
  background: rgba(255,255,245,0.95);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(160,140,91,0.10);
  padding: 36px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.achieve-title {
  color: #a08c5b;
  font-size: 2.1rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin-bottom: 32px;
  letter-spacing: 0.1em;
  text-shadow: 1px 2px 8px #e6e1d3;
}
.achievement-cards {
  display: flex;
  gap: 32px;
  width: 100%;
  justify-content: center;
  flex-wrap: wrap;
}
.achievement-card {
  background: #fbfaf8;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(160,140,91,0.08);
  padding: 28px 32px 22px 32px;
  min-width: 260px;
  max-width: 320px;
  flex: 1 1 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
  transition: box-shadow 0.2s;
}
.achievement-card:hover {
  box-shadow: 0 6px 24px rgba(160,140,91,0.16);
}
.card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 18px;
}
.badge-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px #e6e1d3);
}
.progress-bar {
  width: 100%;
  height: 28px;
  background: #f5f1e6;
  border-radius: 14px;
  overflow: hidden;
  margin-bottom: 12px;
  position: relative;
}
.progress {
  height: 100%;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  color: #fff;
  font-weight: bold;
  font-size: 1.1rem;
  padding-right: 16px;
  transition: width 0.8s cubic-bezier(.4,2,.6,1);
  box-shadow: 0 2px 8px rgba(160,140,91,0.10);
  position: relative;
}
.progress-text {
  position: absolute;
  right: 16px;
  color: #fff;
  font-size: 1.1rem;
  text-shadow: 0 1px 4px #a08c5b;
}
.progress-desc {
  color: #a08c5b;
  font-size: 1.05rem;
  margin-top: 2px;
  font-family: 'STKaiti', 'KaiTi', serif;
}
.empty-tip {
  margin-top: 36px;
  color: #bfa14a;
  font-size: 1.15rem;
  background: #f5f1e6;
  border-radius: 10px;
  padding: 18px 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(160,140,91,0.08);
}
@media (max-width: 900px) {
  .achievements-page {
    padding: 18px 4vw 18px 4vw;
  }
  .achievement-cards {
    flex-direction: column;
    gap: 18px;
  }
}
</style> 