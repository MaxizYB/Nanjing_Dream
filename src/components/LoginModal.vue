<template>
  <div class="modal-overlay" v-if="show" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h2>登录</h2>
        <button class="close-btn" @click="close">&times;</button>
      </div>
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required 
            placeholder="请输入用户名"
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required 
            placeholder="请输入密码"
          >
        </div>
        <button type="submit" class="submit-btn">登录</button>
      </form>
      <div class="register-link">
        还没有账号？<a href="#" @click.prevent="showRegister">立即注册</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { BASE_URL } from '@/api'

const props = defineProps({
  show: Boolean
})

const emit = defineEmits(['close', 'showRegister', 'loginSuccess'])

const username = ref('')
const password = ref('')

const close = () => {
  emit('close')
}

const showRegister = () => {
  emit('showRegister')
}

const handleLogin = async () => {
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      username: username.value,
      password: password.value
    })
    
    localStorage.setItem('token', response.data.token)
    emit('loginSuccess')
    ElMessage.success('登录成功')
    setTimeout(() => { close() }, 800)
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '登录失败')
  }
}

watch(() => props.show, (val) => {
  if (!val) {
    username.value = ''
    password.value = ''
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #f5f3e7;
  padding: 2rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border: 1px solid #d6c9a5;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  color: #634d0d;
  margin: 0;
  font-family: 'STSong', 'SimSun', serif;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #a08c5b;
  cursor: pointer;
  padding: 0.5rem;
  line-height: 1;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #d6c9a5;
  border-radius: 6px;
  background: #fbfaf8;
  color: #2c1810;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #a08c5b;
  box-shadow: 0 0 0 2px rgba(160, 140, 91, 0.2);
}

.submit-btn {
  background: #4b3e2e;
  color: #f5f3e7;
  border: none;
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  font-family: 'STKaiti', 'KaiTi', serif;
  margin-top: 1rem;
}

.submit-btn:hover {
  background: #2c1810;
}

.register-link {
  text-align: center;
  margin-top: 1rem;
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.register-link a {
  color: #a08c5b;
  text-decoration: none;
}

.register-link a:hover {
  text-decoration: underline;
}
</style> 