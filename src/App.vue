<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import TimelineSwitcher from './components/TimelineSwitcher.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import { ElMessage } from 'element-plus'
import 'element-plus/dist/index.css'

const currentPeriod = ref('modern') // 默认最新
const router = useRouter()
const route = useRoute()

// 登录相关状态
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const isLoggedIn = ref(false)

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token')
  isLoggedIn.value = !!token
}

// 处理登录按钮点击
const handleAchievementClick = () => {
  if (isLoggedIn.value) {
    router.push('/achievements')
  } else {
    showLoginModal.value = true
  }
}

// 处理登录成功
const handleLoginSuccess = () => {
  isLoggedIn.value = true
  showLoginModal.value = false
}

// 处理模态框切换
const handleShowRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

const handleShowLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

function handlePeriodChange(period) {
  currentPeriod.value = period
  // 如果当前不在地图页面，跳转到地图页面并传递时期参数
  if (route.path !== '/map') {
    router.push({
      path: '/map',
      query: { period: period }
    })
  } else {
    // 如果已经在地图页面，只更新查询参数
    router.replace({
      path: '/map',
      query: { period: period }
    })
  }
}

// 监听路由参数变化
watch(() => route.query.period, (newPeriod) => {
  if (newPeriod) {
    currentPeriod.value = newPeriod
  }
}, { immediate: true })

// 监听路由路径变化
watch(() => route.path, (newPath) => {
  // 当路由变化时，确保 currentPeriod 与 URL 参数同步
  const periodFromUrl = route.query.period
  if (periodFromUrl) {
    currentPeriod.value = periodFromUrl
  }
}, { immediate: true })

// 初始化时检查登录状态
onMounted(() => {
  checkLoginStatus()
  const periodFromUrl = route.query.period
  if (periodFromUrl) {
    currentPeriod.value = periodFromUrl
  }
})

const handleLogoutClick = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  ElMessage.success('已退出登录')
}
</script>

<template>
  <div class="app-layout">
    <nav class="top-navbar">
      <div class="navbar-section logo">云游金陵</div>
      <button class="menu-btn" @click="router.push('/')">主页面</button>
      <TimelineSwitcher
        :current-period="currentPeriod"
        @period-change="handlePeriodChange"
        style="margin-left: 16px; width: 300px;"
      />
      <button class="login-btn" @click="handleAchievementClick">
        {{ isLoggedIn ? '成就' : '登录' }}
      </button>
      <button v-if="isLoggedIn" class="logout-btn" @click="handleLogoutClick">退出登录</button>
    </nav>
    <main class="main-content">
      <router-view :period="currentPeriod" :is-logged-in="isLoggedIn" @loginSuccess="handleLoginSuccess" />
    </main>

    <!-- 登录模态框 -->
    <LoginModal 
      :show="showLoginModal"
      @close="showLoginModal = false"
      @showRegister="handleShowRegister"
      @loginSuccess="handleLoginSuccess"
    />

    <!-- 注册模态框 -->
    <RegisterModal
      :show="showRegisterModal"
      @close="showRegisterModal = false"
      @showLogin="handleShowLogin"
    />
  </div>
</template>

<style>
html, body, #app {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
}

.app-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.top-navbar {
  width: 100%;
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #f5f3e7 80%, #e6e1d3 100%);
  border-bottom: 1.5px solid #d6c9a5;
  padding: 0 24px;
  height: 48px;
  min-height: 48px;
  box-sizing: border-box;
}
.navbar-section.logo {
  font-size: 1.8rem;
  font-weight: bold;
  color: #a08c5b;  /* 改回主题色 */
  font-family: 'STXingkai', 'STKaiti', 'KaiTi', serif;
  margin-right: 24px;
  white-space: nowrap;
  letter-spacing: 0.2rem;
  text-shadow: 2px 2px 4px rgba(160, 140, 91, 0.2);  /* 调整阴影颜色 */
  background: linear-gradient(45deg, #a08c5b, #d6c9a5);  /* 使用主题色系的渐变 */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}
.menu-btn {
  background: #e6e1d3;
  color: #4b3e2e;
  border: none;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 1.1rem;
  margin-right: 20px;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-btn:hover {
  background: #d6c9a5;
  color: #3a2d1a;
}
.main-content {
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.login-btn {
  margin-left: auto;
  background: #4b3e2e;
  color: #f5f3e7;
  border: none;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 1.1rem;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #2c1810;
}

.logout-btn {
  margin-left: 12px;
  background: #e6e1d3;
  color: #a08c5b;
  border: none;
  border-radius: 10px;
  padding: 6px 16px;
  font-size: 1.1rem;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: background 0.2s;
}
.logout-btn:hover {
  background: #d6c9a5;
  color: #3a2d1a;
}
</style>

