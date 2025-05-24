<template>
  <div class="drift-bottle-send-modal">
    <div class="bottle-header">
      <h3>写下你的漂流瓶</h3>
      <button class="close-btn" @click="$emit('close')">×</button>
    </div>
    <div class="bottle-content">
      <textarea 
        v-model="content" 
        placeholder="写下你想说的话..."
        class="bottle-textarea"
      ></textarea>
      <div class="image-upload">
        <div class="image-preview" v-if="previewImages.length">
          <div class="preview-item">
            <img :src="previewImages[0]" alt="预览图">
            <button class="remove-btn" @click="removeImage(0)">×</button>
          </div>
        </div>
        <label class="upload-btn" v-if="previewImages.length === 0">
          <input 
            type="file" 
            @change="handleImageUpload" 
            accept="image/*"
            style="display: none"
          >
          <span>添加图片</span>
        </label>
      </div>
    </div>
    <div class="bottle-footer">
      <button 
        class="send-btn" 
        @click="sendBottle"
        :disabled="!content.trim()"
      >
        发送漂流瓶
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'
import { BASE_URL } from '@/api'

const emit = defineEmits(['close', 'sent'])
const toast = useToast()

const content = ref('')
const previewImages = ref([])
const selectedFiles = ref([])

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files)
  if (files.length + previewImages.value.length > 1) {
    toast.error('只允许上传1张图片')
    return
  }
  const file = files[0]
  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    previewImages.value = [e.target.result]
  }
  reader.readAsDataURL(file)
  selectedFiles.value = [file]
}

const removeImage = (index) => {
  previewImages.value.splice(index, 1)
  selectedFiles.value.splice(index, 1)
}

const sendBottle = async () => {
  if (!content.value.trim()) {
    toast.error('请输入内容')
    return
  }

  const token = localStorage.getItem('token')
  if (!token) {
    toast.error('请先登录后再发送漂流瓶')
    return
  }

  try {
    const formData = new FormData()
    formData.append('content', content.value)
    selectedFiles.value.forEach(file => {
      formData.append('image', file)
    })
    formData.append('lat', 0)
    formData.append('lng', 0)

    const response = await axios.post(
      `${BASE_URL}/api/drift-bottles`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    toast.success('漂流瓶发送成功！')
    emit('sent')
    emit('close')
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || '发送失败，请重试')
  }
}
</script>

<style scoped>
.drift-bottle-send-modal {
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

.bottle-textarea {
  width: 100%;
  height: 180px;
  padding: 16px;
  border: 1.5px solid #d6c9a5;
  border-radius: 8px;
  resize: none;
  margin-bottom: 18px;
  font-size: 16px;
  background: #fbfaf8;
  color: #4b3e2e;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.image-upload {
  margin-top: 10px;
}

.image-preview {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.preview-item {
  position: relative;
  width: 120px;
  height: 120px;
}

.preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
  border: 1.5px solid #d6c9a5;
  background: #fff;
}

.remove-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
}

.upload-btn {
  display: inline-block;
  padding: 10px 24px;
  background: #f0e6d2;
  border-radius: 6px;
  cursor: pointer;
  color: #a08c5b;
  font-size: 15px;
  border: 1.5px solid #d6c9a5;
  font-family: 'STKaiti', 'KaiTi', serif;
}

.upload-btn:hover {
  background: #e6e1d3;
}

.bottle-footer {
  text-align: right;
}

.send-btn {
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

.send-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.send-btn:hover:not(:disabled) {
  background: #634d0d;
}
</style> 