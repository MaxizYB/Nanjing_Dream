<template>
  <div class="location-detail">
    <!-- 左侧固定栏 -->
    <div class="fixed-sidebar">
      <div class="title-container">
        <h1 class="vertical-title">{{ location?.name }}</h1>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="main-content">
      <div class="description-container">
        <!-- 图片容器 -->
        <div v-if="periodInfo?.images && periodInfo.images.length > 0" class="images-container">
          <div v-for="(image, index) in periodInfo.images" 
               :key="index" 
               class="image-wrapper">
            <img :src="image" 
                 :alt="`${location?.name} - ${currentPeriod}`"
                 class="location-image"
                 @load="onImageLoad" />
          </div>
        </div>

        <!-- Markdown内容 -->
        <MarkdownViewer v-if="periodInfo?.description" :content="periodInfo.description" />
        
        <!-- 问答组件 -->
        <Quiz v-if="currentPeriodQuestions.length > 0" :questions="currentPeriodQuestions" />
      </div>
    </div>

    <!-- 右侧固定按钮组 -->
    <div class="right-buttons">
      <!-- 返回按钮 -->
      <div class="back-button" @click="goBack">
        <span class="arrow">←</span>
        <span class="button-text">返回地图</span>
      </div>

      <!-- 时期切换按钮 -->
      <div class="period-switcher">
        <button v-for="period in availablePeriods" 
                :key="period"
                :class="['period-button', { active: period === currentPeriod }]"
                @click="switchPeriod(period)">
          {{ getPeriodName(period) }}
        </button>
      </div>
    </div>

    <!-- 右侧滚动条区域 -->
    <div class="scrollbar-area"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getLocationPeriods, getLocationPeriodInfo } from '../../assets/scripts/markers'
import { locationMarkers } from '../../assets/scripts/markers/locations'
import MarkdownViewer from '../components/MarkdownViewer.vue'
import Quiz from '../components/Quiz.vue'
import { locationQuizzes } from '../data/quizzes'

const route = useRoute()
const router = useRouter()
const location = ref(null)
const currentPeriod = ref('')
const availablePeriods = ref([])
const periodInfo = ref(null)

// 获取当前时期的问答内容
const currentPeriodQuestions = computed(() => {
  if (!location.value || !currentPeriod.value) return []
  return locationQuizzes[location.value.id]?.[currentPeriod.value]?.questions || []
})

const loadPeriodInfo = async () => {
  if (!location.value || !currentPeriod.value) {
    periodInfo.value = null
    return
  }
  const info = getLocationPeriodInfo(location.value.id, currentPeriod.value)
  if (info && typeof info.description === 'function') {
    try {
      const module = await info.description()
      periodInfo.value = { ...info, description: module.default }
    } catch (e) {
      periodInfo.value = { ...info, description: '加载内容失败' }
    }
  } else {
    periodInfo.value = info
  }
}

const getPeriodName = (period) => {
  const periodNames = {
    'sui-tang': '隋唐五代',
    'song-yuan': '宋元',
    'ming': '明朝',
    'qing': '清朝',
    'jindai': '近代',
    'modern': '现代'
  }
  return periodNames[period] || period
}

const switchPeriod = (period) => {
  currentPeriod.value = period
  router.replace({
    name: 'LocationDetail',
    params: { id: location.value.id, period }
  })
}

onMounted(() => {
  const { id, period } = route.params
  location.value = locationMarkers.find(marker => marker.id === id)
  currentPeriod.value = period
  availablePeriods.value = getLocationPeriods(id)
  loadPeriodInfo()
})

watch([location, currentPeriod], () => {
  if (location.value) {
    availablePeriods.value = getLocationPeriods(location.value.id)
    loadPeriodInfo()
  }
})

const goBack = () => {
  router.push({ path: '/map', query: { period: currentPeriod.value } })
}

// 添加图片加载处理函数
const onImageLoad = (event) => {
  const img = event.target;
  const wrapper = img.parentElement;
  // 根据图片实际尺寸设置容器样式
  if (img.naturalWidth > img.naturalHeight) {
    wrapper.style.gridColumn = 'span 2';
  } else {
    wrapper.style.gridColumn = 'span 1';
  }
}
</script>

<style scoped>
.location-detail {
  min-height: 100vh;
  display: flex;
  background: #f5f3e7;
  padding-top: 64px;
  position: relative;
  overflow: hidden;
}

/* 左侧固定栏样式 */
.fixed-sidebar {
  width: 150px;
  min-height: 100vh;
  background: #fbfaf8;
  position: fixed;
  left: 0;
  top: 46px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  padding-top: 0;
  z-index: 10;
}

.title-container {
  padding: 2rem 1rem;
  /* 与最底部背景色一致 */
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.vertical-title {
  writing-mode: vertical-lr;
  text-orientation: upright;
  font-size: 2.5rem;
  font-weight: bold;
  color: #634d0d;
  margin: 0;
  letter-spacing: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'STSong', 'SimSun', serif;
  text-align: center;
}

.sidebar-image {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.sidebar-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
}

/* 右侧内容区样式 */
.main-content {
  flex: 1;
  margin-left: 200px;
  margin-right: 120px; /* 为右侧按钮和滚动条留出空间 */
  padding: 3rem;
  max-width: calc(100% - 320px);
  padding-top: 0px;
  height: calc(100vh - 64px);
  overflow-y: auto;
  position: relative;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  top: -50px;
}

/* 隐藏默认滚动条 */
.main-content::-webkit-scrollbar {
  display: none;
}

.description-container {
  padding: 0;
  border-radius: 12px;
  margin-bottom: 2rem;
  top: 0px;
}

.description-container h2 {
  /* 删除历史介绍标题样式 */
}

.description-container p {
  color: #2c1810;
  line-height: 2;
  font-size: 1.1rem;
  font-family: 'STKaiti', 'KaiTi', serif;
}

/* 右侧滚动条区域 */
.scrollbar-area {
  position: fixed;
  right: 0;
  top: 46px;
  width: 20px;
  height: calc(100vh - 46px);
  background: #f5f3e7;
  z-index: 15;
}

/* 右侧固定按钮容器 */
.right-buttons {
  position: fixed;
  right: 30px; /* 调整位置，避免与滚动条重叠 */
  top: 100px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  z-index: 20;
  align-items: flex-end;
}

/* 返回按钮样式 */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.5rem 1rem;
  background: #4b3e2e;
  color: #e6e1d3;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'STKaiti', 'KaiTi', serif;
  box-shadow: 0 4px 12px rgba(75, 62, 46, 0.2);
}

.back-button:hover {
  background: #2c1810;
  transform: translateX(-5px);
}

.arrow {
  font-size: 1.2rem;
  font-weight: bold;
}

.button-text {
  font-size: 0.9rem;
  font-weight: 500;
}

/* 时期切换器样式 */
.period-switcher {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.period-button {
  padding: 8px 16px;
  background: #fbfaf8;
  border: 1px solid #d6c9a5;
  border-radius: 4px;
  color: #634d0d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 14px;
  white-space: nowrap;
  text-align: right;
}

.period-button:hover {
  background: #e6e1d3;
  transform: translateX(-5px);
}

.period-button.active {
  background: #4b3e2e;
  color: #fbfaf8;
  border-color: #4b3e2e;
}

/* 图片容器样式 */
.images-container {
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
}

.image-wrapper {
  width: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.image-wrapper:hover {
  transform: scale(1.02);
}

.location-image {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .location-detail {
    flex-direction: column;
    padding-top: 64px;
  }
  
  .fixed-sidebar {
    position: relative;
    width: 100%;
    height: auto;
    top: 0;
  }
  
  .main-content {
    margin-left: 0;
    margin-right: 0;
    padding: 1.5rem;
    max-width: 100%;
    height: auto;
    overflow-y: visible;
  }
  
  .right-buttons {
    position: fixed;
    bottom: 20px;
    top: auto;
    right: 20px;
    flex-direction: row-reverse;
    gap: 10px;
  }
  
  .period-switcher {
    flex-direction: row;
  }
  
  .vertical-title {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
    font-size: 1.8rem;
    text-align: center;
    padding: 1rem 0;
  }

  .scrollbar-area {
    display: none; /* 在移动端隐藏滚动条区域 */
  }
}
</style> 