<template>
  <div class="help-md-container">
    <MarkdownViewer :content="mdContent" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MarkdownViewer from '@/components/MarkdownViewer.vue'

const mdContent = ref('')
const mdModules = import.meta.glob('@/assets/markdown/*.md', { as: 'raw' })

onMounted(async () => {
  // 路径必须以/src开头
  const mod = await mdModules['/src/assets/markdown/help.md']()
  mdContent.value = mod
})
</script>

<style scoped>
.help-md-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f3e7 0%, #e6e1d3 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  overflow: auto;
  box-sizing: border-box;
}
.help-md-container :deep(.markdown-body) {
  background: #fff;
  border-radius: 32px;
  box-shadow: 0 8px 32px rgba(160,140,91,0.10);
  padding: 20px 40px 32px 40px;
  max-width: 1500px;
  width: 90vw;
  min-height: 60vh;
  max-height: 85vh;
  font-size: 1.18rem;
  color: #3a2d1a;
  font-family: 'STKaiti', 'KaiTi', 'serif', 'Microsoft YaHei', sans-serif;
  line-height: 1.85;
  overflow-y: auto;
  margin-top: 0;
  box-sizing: border-box;
}
</style> 