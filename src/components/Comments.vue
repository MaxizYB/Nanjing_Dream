<template>
  <div class="comments-section">
    <h3 class="comments-title">分享区</h3>
    
    <!-- 评论输入框 -->
    <div v-if="isLoggedIn" class="comment-form">
      <textarea
        v-model="newComment"
        placeholder="写下你的评论..."
        class="comment-input"
        :maxlength="500"
      ></textarea>
      <div class="image-upload-section">
        <input
          type="file"
          ref="fileInput"
          accept="image/*"
          @change="handleImageUpload"
          style="display: none"
        />
        <button 
          @click="triggerFileInput" 
          class="upload-button"
          :disabled="!!selectedImage"
        >
          <span class="upload-icon">📷</span>
          添加图片
        </button>
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="预览图" />
          <button @click="removeImage" class="remove-image">×</button>
        </div>
      </div>
      <div class="comment-form-footer">
        <span class="char-count">{{ newComment.length }}/500</span>
        <button 
          @click="submitComment" 
          class="submit-button"
          :disabled="!newComment.trim()"
        >
          发布评论
        </button>
      </div>
    </div>
    <div v-else class="login-prompt">
      请<button @click="goLogin" class="login-link">登录</button>后发表评论
    </div>

    <!-- 评论列表 -->
    <div class="comments-list">
      <div v-if="comments.length === 0" class="no-comments">
        暂无评论，快来发表第一条评论吧！
      </div>
      <div v-else v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <span class="username">{{ comment.username }}</span>
          <span class="time-and-delete">
            <span class="time">{{ formatTime(comment.created_at) }}</span>
            <button v-if="comment.user_id === currentUserId" @click="deleteComment(comment.id, comment.image_url)" class="delete-btn" title="删除">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 7h12M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m2 0v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V7h12z" stroke="#a08c5b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 11v6M14 11v6" stroke="#a08c5b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <img v-if="comment.image_url" :src="`${BASE_URL}${comment.image_url}`" class="comment-image" alt="评论图片" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { BASE_URL } from '@/api'

const props = defineProps({
  locationId: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true
  },
  isLoggedIn: {
    type: Boolean,
    required: true
  }
})

const router = useRouter()
const route = useRoute()

const comments = ref([])
const newComment = ref('')
const fileInput = ref(null)
const selectedImage = ref(null)
const imagePreview = ref(null)

// 当前登录用户id
const currentUserId = ref(null)

// 获取评论列表
const fetchComments = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/comments/${props.locationId}/${props.period}`)
    comments.value = response.data
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 触发文件选择
const triggerFileInput = () => {
  fileInput.value.click()
}

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) { // 5MB限制
      alert('图片大小不能超过5MB')
      return
    }
    selectedImage.value = file
    // 预览用
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

// 移除已选图片
const removeImage = () => {
  selectedImage.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// 修改提交评论函数
const submitComment = async () => {
  if (!newComment.value.trim() && !selectedImage.value) return

  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('locationId', props.locationId)
    formData.append('period', props.period)
    formData.append('content', newComment.value.trim())
    if (selectedImage.value) {
      formData.append('image', selectedImage.value)
    }

    const response = await axios.post(
      `${BASE_URL}/api/comments`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )
    
    comments.value.unshift(response.data)
    newComment.value = ''
    selectedImage.value = null
    imagePreview.value = null
  } catch (error) {
    console.error('发布评论失败:', error)
    if (error.response?.status === 401) {
      router.push({ path: '/login', query: { redirect: route.fullPath } })
    }
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听地点或时期变化
watch([() => props.locationId, () => props.period], () => {
  fetchComments()
})

onMounted(() => {
  // 解析token获取当前用户id
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      currentUserId.value = payload.userId || payload.id
    } catch (e) {
      currentUserId.value = null
    }
  }
  fetchComments()
})

// 恢复 emit 事件
const emit = defineEmits(['show-login'])

// 跳转到登录页
const goLogin = () => {
  emit('show-login')
}

// 删除评论
const deleteComment = async (commentId, imageUrl) => {
  if (!window.confirm('确定要删除这条评论吗？')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${BASE_URL}/api/comments/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    // 前端移除该评论
    comments.value = comments.value.filter(c => c.id !== commentId)
  } catch (error) {
    alert('删除失败')
  }
}
</script>

<style scoped>
.comments-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: #fbfaf8;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.comments-title {
  color: #4b3e2e;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-input {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  border: 1px solid #d6c9a5;
  border-radius: 8px;
  background: #fff;
  font-family: 'STKaiti', 'KaiTi', serif;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.comment-input:focus {
  outline: none;
  border-color: #a08c5b;
  box-shadow: 0 0 0 2px rgba(160, 140, 91, 0.2);
}

.comment-form-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.char-count {
  color: #8a7a4f;
  font-size: 0.9rem;
}

.submit-button {
  padding: 0.5rem 1.5rem;
  background: #4b3e2e;
  color: #fbfaf8;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: background-color 0.3s;
}

.submit-button:hover:not(:disabled) {
  background: #2c1810;
}

.submit-button:disabled {
  background: #d6c9a5;
  cursor: not-allowed;
}

.login-prompt {
  text-align: center;
  padding: 1rem;
  background: #f5f3e7;
  border-radius: 4px;
  margin-bottom: 2rem;
  color: #634d0d;
}

.login-link {
  background: none;
  border: none;
  color: #4b3e2e;
  text-decoration: underline;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  padding: 0;
  margin: 0 0.2rem;
}

.login-link:hover {
  color: #2c1810;
}

.comments-list {
  margin-top: 1rem;
}

.no-comments {
  text-align: center;
  color: #8a7a4f;
  padding: 2rem;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid #e6e1d3;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.username {
  font-weight: bold;
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.time-and-delete {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.time {
  color: #8a7a4f;
  font-size: 0.9rem;
}

.comment-content {
  color: #2c1810;
  line-height: 1.6;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.image-upload-section {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e6e1d3;
  color: #4b3e2e;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: 'STKaiti', 'KaiTi', serif;
  transition: all 0.3s;
}

.upload-button:hover {
  background: #d6c9a5;
}

.upload-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-icon {
  font-size: 1.2rem;
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 4px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 24px;
  height: 24px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.comment-item {
  padding: 1rem;
  border-bottom: 1px solid #e6e1d3;
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.username {
  font-weight: bold;
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.time {
  color: #8a7a4f;
  font-size: 0.9rem;
}

.comment-content {
  margin-top: 0.5rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.comment-image {
  margin-top: 1rem;
  max-width: 680px;
  max-height: 500px;
  width: auto;
  height: auto;
  border-radius: 4px;
  object-fit: contain;
  display: block;
}

.delete-btn {
  margin-left: 0.2rem;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  vertical-align: middle;
  display: flex;
  align-items: center;
  transition: background 0.2s;
}
.delete-btn svg {
  display: block;
  fill: none;
  stroke: #a08c5b;
  transition: stroke 0.2s;
}
.delete-btn:hover svg {
  stroke: #4b3e2e;
}
</style> 