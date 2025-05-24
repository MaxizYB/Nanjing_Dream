<template>
  <div class="home-container">
    <button class="help-btn" @click="goToHelp" title="帮助文档">帮助文档</button>
    <div class="content-wrapper">
      <img src="/assets/images/logo.png" alt="云游金陵" class="logo-image animate-in">
      <p class="description animate-in">
        穿越时空，探索金陵古都的千年风华。<br>
        从隋唐五代到现代，感受南京的历史变迁，<br>
        领略这座城市的独特魅力。
      </p>
      <div class="btn-group">
        <button class="ai-guide-btn animate-in" @click="goToAIGuide" style="animation-delay: 0.6s;">
          <span class="btn-icon">🤖</span>
          <span class="btn-text">AI引导</span>
        </button>
        <button class="ai-guide-btn animate-in" @click="goToModernMap" style="animation-delay: 0.6s;">
          <span class="btn-icon">🗺️</span>
          <span class="btn-text">进入地图</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goToAIGuide = () => {
  router.push('/ai-guide')
}
const goToModernMap = () => {
  router.push({ path: '/map', query: { period: 'modern' } })
}
const goToHelp = () => {
  router.push('/help')
}
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f5f3e7 0%, #e6e1d3 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.home-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/images/pattern.png') repeat;
  opacity: 0.1;
  pointer-events: none;
}

.content-wrapper {
  text-align: center;
  max-width: 1000px;
  padding: 4rem 2rem 4rem 2rem;
  position: relative;
  z-index: 1;
  margin-top: -4rem;
}

.main-title {
  display: none;
}

.logo-image {
  width: 400px;
  height: auto;
  margin-bottom: 2rem;
  filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
}

.description {
  font-size: 1.4rem;
  color: #4b3e2e;
  line-height: 1.8;
  margin-bottom: 3rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  letter-spacing: 0.1rem;
  opacity: 0.9;
}

.btn-group {
  display: flex;
  gap: 1.2rem;
  justify-content: center;
  margin-top: 0.5rem;
}

.ai-guide-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 2.5rem;
  font-size: 1.2rem;
  color: #f5f3e7;
  background: linear-gradient(135deg, #4b3e2e 0%, #2c1810 100%);
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'STKaiti', 'KaiTi', serif;
  box-shadow: 0 4px 20px rgba(75, 62, 46, 0.2);
  letter-spacing: 0.1rem;
  flex: 1 1 0;
  justify-content: center;
}

.ai-guide-btn:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 30px rgba(75, 62, 46, 0.3);
  background: linear-gradient(135deg, #2c1810 0%, #4b3e2e 100%);
}

.btn-icon {
  font-size: 1.6rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.btn-text {
  font-weight: 500;
  letter-spacing: 0.1rem;
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 3rem 1.5rem;
  }

  .logo-image {
    width: 300px;
    margin-bottom: 1.5rem;
  }

  .description {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
  }

  .ai-guide-btn {
    padding: 0.8rem 2rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .logo-image {
    width: 250px;
    margin-bottom: 1.2rem;
  }

  .description {
    font-size: 1.1rem;
    line-height: 1.5;
    margin-bottom: 2rem;
  }

  .ai-guide-btn {
    padding: 0.7rem 1.8rem;
    font-size: 1rem;
  }
}

.animate-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeInUp 0.8s ease forwards;
}

.logo-image.animate-in {
  animation-delay: 0.2s;
}

.description.animate-in {
  animation-delay: 0.4s;
}

.ai-guide-btn.animate-in {
  animation-delay: 0.6s;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.help-btn {
  position: absolute;
  top: 32px;
  left: 32px;
  min-width: 48px;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  background: #f4f1da;
  color: #a08c5b;
  font-size: 1.05rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  border: none;
  box-shadow: none;
  cursor: pointer;
  z-index: 10;
  transition: background 0.2s, color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.08em;
}
.help-btn:hover {
  background: #e6e1d3;
  color: #634d0d;
  box-shadow: none;
}
</style> 