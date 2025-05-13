<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup>
import { computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import 'github-markdown-css'

const props = defineProps({
  content: {
    type: String,
    required: true
  }
})

// 配置marked
marked.setOptions({
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value
    }
    return hljs.highlightAuto(code).value
  },
  breaks: true,
  gfm: true
})

const renderedContent = computed(() => {
  // 处理图片路径
  const processedContent = props.content.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (match, alt, src) => {
      // 如果路径不是以http开头，则添加/assets前缀
      if (!src.startsWith('http')) {
        src = `/assets/${src}`
      }
      return `![${alt}](${src})`
    }
  )
  return marked(processedContent)
})
</script>

<style scoped>
.markdown-body {
  padding: 20px;
  max-width: 100%;
  overflow-x: auto;
  background-color: #f5f3e7; /* 与页面底色保持一致 */
}

:deep(.markdown-body) {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.6;
  background-color: #f5f3e7; /* 与页面底色保持一致 */
  color: #2c1810; /* 文字颜色 */
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  color: #634d0d; /* 标题颜色 */
  border-bottom-color: #d6c9a5; /* 标题下划线颜色 */
}

:deep(.markdown-body a) {
  color: #a08c5b; /* 链接颜色 */
}

:deep(.markdown-body a:hover) {
  color: #8a7a4f; /* 链接悬停颜色 */
}

:deep(.markdown-body code) {
  background-color: #fbfaf8; /* 代码块背景色 */
  color: #634d0d; /* 代码文字颜色 */
}

:deep(.markdown-body pre) {
  background-color: #fbfaf8; /* 代码块背景色 */
  border: 1px solid #d6c9a5; /* 代码块边框 */
}

:deep(.markdown-body blockquote) {
  border-left-color: #d6c9a5; /* 引用块边框颜色 */
  color: #634d0d; /* 引用文字颜色 */
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.markdown-body table) {
  border-color: #d6c9a5; /* 表格边框颜色 */
}

:deep(.markdown-body table th) {
  background-color: #fbfaf8; /* 表头背景色 */
  color: #634d0d; /* 表头文字颜色 */
}

:deep(.markdown-body table td) {
  border-color: #d6c9a5; /* 表格单元格边框颜色 */
}
</style> 