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
        <p>{{ location?.description }}</p>
      </div>
    </div>

    <!-- 返回按钮 -->
    <div class="back-button-container">
      <div class="back-button" @click="goBack">
        <span class="arrow">←</span>
        <span class="button-text">返回地图</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getPeriodConfig } from '../data/periods'

const route = useRoute()
const router = useRouter()
const location = ref(null)

onMounted(() => {
  const [period, id] = route.params.id.split('-')
  const periodConfig = getPeriodConfig(period)
  location.value = periodConfig.markers.find(marker => marker.id === `${period}-${id}`)
})

const goBack = () => {
  router.push('/map?period=modern')
}
</script>

<style scoped>
.location-detail {
  min-height: 100vh;
  display: flex;
  background: #f5f3e7;
  padding-top: 64px; /* 防止与导航栏重叠 */
}

/* 左侧固定栏样式 */
.fixed-sidebar {
  width: 200px;
  min-height: 100vh;
  background: #fbfaf8;
  position: fixed;
  left: 0;
  top: 46px; /* 关键：让侧边栏从导航栏下方开始 */
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
  padding: 3rem;
  max-width: 1000px;
  padding-top: 0px; /* 防止与导航栏重叠 */
}

.description-container {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
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

@media (max-width: 1024px) {
  .fixed-sidebar {
    width: 200px;
  }
  
  .main-content {
    margin-left: 200px;
    padding: 2rem;
  }
  
  .vertical-title {
    font-size: 2rem;
  }
}

@media (max-width: 768px) {
  .location-detail {
    flex-direction: column;
    padding-top: 64px;
  }
  
  .fixed-sidebar {
    position: relative;
    width: 100%;
    min-height: auto;
    padding-top: 0;
  }
  
  .vertical-title {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
    font-size: 1.8rem;
    text-align: center;
    padding: 1rem 0;
  }
  
  .sidebar-image {
    height: 200px;
  }
  
  .main-content {
    margin-left: 0;
    padding: 1.5rem;
    padding-top: 0;
  }
}

.back-button-container {
  position: fixed;
  right: 20px;
  top: 100px; /* 假设导航栏高度为46px */
  z-index: 20;
}
</style> 