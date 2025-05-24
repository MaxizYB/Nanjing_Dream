<template>
  <div class="ai-guide-container">
    <div class="chat-wrapper">
      <div class="chat-history" ref="chatHistoryRef">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-row', msg.role]">
          <template v-if="msg.role==='assistant'">
            <div class="chat-avatar-bubble-row left">
              <div class="avatar ai-avatar">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#e6e1d3"/><rect x="8" y="12" width="16" height="10" rx="5" fill="#a08c5b"/><circle cx="12" cy="17" r="2" fill="#fff"/><circle cx="20" cy="17" r="2" fill="#fff"/><rect x="13" y="22" width="6" height="2" rx="1" fill="#fff"/></svg>
              </div>
              <div class="bubble-inner ai-bubble">
                <span class="bubble-content" v-html="renderMarkdown(msg.content)"></span>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="chat-avatar-bubble-row right">
              <div class="bubble-inner user-bubble">
                <span class="bubble-content" v-html="renderMarkdown(msg.content)"></span>
              </div>
              <div class="avatar user-avatar">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#d6c9a5"/><ellipse cx="16" cy="13" rx="5" ry="5.5" fill="#fff"/><ellipse cx="16" cy="24" rx="8" ry="5" fill="#fff"/></svg>
              </div>
            </div>
          </template>
        </div>
        <div v-if="streamingText" class="chat-row assistant">
          <div class="chat-avatar-bubble-row left">
            <div class="avatar ai-avatar">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="16" fill="#e6e1d3"/><rect x="8" y="12" width="16" height="10" rx="5" fill="#a08c5b"/><circle cx="12" cy="17" r="2" fill="#fff"/><circle cx="20" cy="17" r="2" fill="#fff"/><rect x="13" y="22" width="6" height="2" rx="1" fill="#fff"/></svg>
            </div>
            <div class="bubble-inner ai-bubble">
              <span class="bubble-content" v-html="renderMarkdown(streamingText)"></span>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-input-bar">
        <textarea v-model="input" :disabled="loading" @keydown.enter.exact.prevent="sendMessage" placeholder="请输入你的问题..." class="chat-input"></textarea>
        <button class="send-btn" :disabled="!input.trim() || loading" @click="sendMessage" title="发送">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 20L21 12L3 4V10L17 12L3 14V20Z" fill="#fff"/></svg>
        </button>
      </div>
    </div>
    <div class="enter-map-panel">
      <button class="enter-map-btn" @click="goToModernMap">进入地图</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { marked } from 'marked'
import { BASE_URL } from '@/api'

const props = defineProps({
  isLoggedIn: Boolean
})
const emit = defineEmits(['showLoginModal'])

const router = useRouter()
const input = ref('')
const messages = ref([])
const streamingText = ref('')
const loading = ref(false)
const chatHistoryRef = ref(null)

// markdown渲染
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
  pedantic: false,
  smartLists: true,
  smartypants: true
})

// 自定义渲染器
const renderer = new marked.Renderer()
renderer.strong = (text) => `<strong style="font-weight: 600;">${text}</strong>`
marked.setOptions({ renderer })

const renderMarkdown = (text) => marked.parse(text || '')

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (chatHistoryRef.value) {
      chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
    }
  })
}

// 检查登录状态
const checkLogin = () => {
  if (!props.isLoggedIn) {
    emit('showLoginModal')
    return false
  }
  return true
}

// 加载历史消息
const fetchHistory = async () => {
  if (!checkLogin()) return
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(`${BASE_URL}/api/chat/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    messages.value = res.data
    scrollToBottom()
  } catch (e) {
    if (e.response?.status === 401) {
      localStorage.removeItem('token')
      emit('showLoginModal')
    }
    messages.value = []
  }
}

// 发送消息
const sendMessage = async () => {
  if (!checkLogin()) return
  if (!input.value.trim() || loading.value) return
  const prompt = input.value.trim()
  input.value = ''
  loading.value = true
  streamingText.value = ''
  
  // 立即显示用户消息
  messages.value.push({ role: 'user', content: prompt })
  scrollToBottom()

  try {
    const token = localStorage.getItem('token')
    const response = await fetch(`${BASE_URL}/api/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prompt })
    })

    if (response.status === 401) {
      localStorage.removeItem('token')
      emit('showLoginModal')
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data:')) {
          try {
            const data = JSON.parse(line.replace('data:', '').trim())
            if (data.text) {
              streamingText.value += data.text
              scrollToBottom()
            }
          } catch (e) {
            console.error('解析数据失败:', e)
          }
        } else if (line.startsWith('event: end')) {
          if (streamingText.value.trim()) {
            messages.value.push({ role: 'assistant', content: streamingText.value })
          }
          streamingText.value = ''
          loading.value = false
          fetchHistory()
        }
      }
    }
  } catch (e) {
    console.error('请求失败:', e)
    if (e.response?.status === 401) {
      localStorage.removeItem('token')
      emit('showLoginModal')
    }
    loading.value = false
    streamingText.value = ''
  }
}

onMounted(() => {
  if (checkLogin()) {
    fetchHistory()
  }
})

const goBack = () => {
  router.push('/')
}

function goToModernMap() {
  router.push({ path: '/map', query: { period: 'modern' } })
}
</script>

<style scoped>
.ai-guide-container {
  min-height: 100vh;
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: stretch;
  background: linear-gradient(135deg, #f5f3e7 0%, #e6e1d3 100%);
  padding: 0;
  margin: 0;
}

.chat-wrapper {
  width: 100%;
  max-width: 1000px;
  height: 93vh;
  min-height: 0;
  background: rgba(255,255,255,0.95);
  border-radius: 0 0 18px 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  position: relative;
}

/* 移除标题样式 */
.page-title { display: none; }

.chat-history {
  flex: 1 1 auto;
  overflow-y: auto;
  max-height: none;
  min-height: 0;
  margin-bottom: 0;
  padding: 0 2rem 0 2rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-row {
  width: 100%;
  display: flex;
}

.chat-avatar-bubble-row {
  display: flex;
  align-items: flex-start;
  gap: 0.7rem;
  width: 100%;
  margin: 0.5rem 0;
}
.chat-avatar-bubble-row.left {
  flex-direction: row;
  justify-content: flex-start;
}
.chat-avatar-bubble-row.right {
  flex-direction: row;
  justify-content: flex-end;
}
/* 用户头像紧贴气泡右侧，AI头像紧贴气泡左侧 */
.chat-avatar-bubble-row.right .user-bubble {
  order: 1;
}
.chat-avatar-bubble-row.right .user-avatar {
  order: 2;
  margin-left: 0.5rem;
  margin-right: 0;
}
.chat-avatar-bubble-row.left .ai-avatar {
  order: 1;
  margin-right: 0.5rem;
  margin-left: 0;
}
.chat-avatar-bubble-row.left .ai-bubble {
  order: 2;
}
.avatar {
  width: 2.6rem;
  height: 2.1rem;
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #f5f3e7;
  box-shadow: 0 2px 8px rgba(99,77,13,0.06);
  flex-shrink: 0;
  margin-top: 0.1rem;
  padding: 0;
}
.ai-avatar {
  background: #e6e1d3;
}
.user-avatar {
  background: #d6c9a5;
}
.bubble-inner {
  max-width: 700px;
  padding: 0.45rem 0.9rem;
  border-radius: 13px;
  font-size: 1.01rem;
  background: #f5f3e7;
  color: #4b3e2e;
  box-shadow: 0 2px 8px rgba(99,77,13,0.06);
  word-break: break-word;
  position: relative;
  display: flex;
  align-items: flex-start;
  min-height: 1.5em;
}
.ai-bubble {
  background: #fff;
  color: #4b3e2e;
  border-top-left-radius: 0.5rem;
}
.user-bubble {
  background: linear-gradient(135deg, #e6e1d3 0%, #d6c9a5 100%);
  color: #634d0d;
  border-top-right-radius: 0.5rem;
}
.bubble-content-wrapper {
  display: inline;
  position: relative;
}
.bubble-content {
  display: inline;
  line-height: 1.6;
}
.bubble-content :deep(strong) {
  font-weight: 600;
  color: #2c1810;
}
.bubble-content :deep(p) {
  margin: 0.5em 0;
}
.bubble-content :deep(ul), 
.bubble-content :deep(ol) {
  margin: 0.5em 0;
  padding-left: 1.5em;
}
.bubble-content :deep(li) {
  margin: 0.3em 0;
}
.streaming-cursor {
  display: inline-block;
  color: #a08c5b;
  font-size: 1.2em;
  margin-left: 2px;
  vertical-align: middle;
  animation: blink 1s steps(1) infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}
.chat-input-bar {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin: 0;
  padding: 0.1rem 1rem 0.1rem 1rem;
  background: transparent;
  border-top: 1px solid #e6e1d3;
  position: relative;
  bottom: 0;
  z-index: 2;
  background: rgba(255,255,255,0.95);
}
.chat-input {
  flex: 1;
  min-height: 1.1em;
  max-height: 2.2em;
  resize: vertical;
  border-radius: 8px;
  border: 1px solid #d6c9a5;
  padding: 0.12em 0.5em;
  font-size: 0.92rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  background: #fff;
  color: #4b3e2e;
  outline: none;
  transition: border-color 0.2s;
}
.chat-input:focus {
  border-color: #a08c5b;
}
.send-btn {
  background: #a08c5b;
  color: #fff;
  border: none;
  border-radius: 50%;
  padding: 0.45em;
  width: 2.2em;
  height: 2.2em;
  min-width: 2.2em;
  min-height: 2.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.send-btn:disabled {
  background: #bdb5a7;
  cursor: not-allowed;
}
@media (max-width: 1200px) {
  .chat-wrapper {
    max-width: 98vw;
    padding: 0;
  }
  .chat-history {
    padding: 0 0.5rem 0 0.5rem;
  }
  .avatar {
    width: 2rem;
    height: 2rem;
    font-size: 1.5rem;
  }
  .bubble-inner {
    max-width: 85vw;
    padding: 0.8rem 1rem;
    font-size: 1rem;
  }
  .chat-input-bar {
    padding: 1rem 0.5rem 1rem 0.5rem;
  }
}
.enter-map-panel {
  position: fixed;
  top: 50%;
  right: 32px;
  transform: translateY(-50%);
  z-index: 2000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.enter-map-btn {
  background: linear-gradient(90deg, #a08c5b 0%, #e6e1d3 100%);
  color: #fff;
  font-size: 1.18rem;
  font-family: 'STKaiti', 'KaiTi', serif;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  box-shadow: 0 4px 16px rgba(160,140,91,0.13);
  cursor: pointer;
  margin-bottom: 12px;
  transition: background 0.2s, box-shadow 0.2s;
}
.enter-map-btn:hover {
  background: linear-gradient(90deg, #bfa14a 0%, #e6e1d3 100%);
  box-shadow: 0 8px 32px rgba(160,140,91,0.18);
}
</style> 