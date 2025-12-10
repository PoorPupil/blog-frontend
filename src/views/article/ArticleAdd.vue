<template>
  <div class="article-add-container">
    <el-card class="article-card">
      <el-form :model="articleForm" label-position="top">
        <el-form-item label="文章标题">
          <el-input 
            v-model="articleForm.title" 
            placeholder="请输入文章标题"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="文章内容">
          <div ref="vditorRef" class="vditor-wrapper"></div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import Vditor from 'vditor'
import 'vditor/dist/index.css'

// 定义表单数据
const articleForm = reactive({
  title: '',
  content: ''
})

// Vditor实例引用
const vditorRef = ref<HTMLDivElement | null>(null)
let vditor: Vditor | null = null

// 计算Vditor高度
const calculateVditorHeight = () => {
  if (!vditorRef.value) return 500

  // 获取卡片元素
  const cardElement = vditorRef.value.closest('.el-card')
  if (!cardElement) return 500
  
  // 获取已使用高度
  const headerHeight = cardElement.querySelector('.el-card__header')?.clientHeight || 0
  const formItemsHeight = Array.from(cardElement.querySelectorAll('.el-form-item:not(:last-child)'))
    .reduce((acc, item) => acc + (item as HTMLElement).clientHeight, 0)
  
  // 计算剩余高度 (减去一些间距)
  const usedHeight = headerHeight + formItemsHeight + 60 // 60为额外间距
  const windowHeight = window.innerHeight
  const cardRect = cardElement.getBoundingClientRect()
  const cardTop = cardRect.top
  
  // 计算可用高度
  const availableHeight = windowHeight - cardTop - usedHeight - 30 // 30为底部预留空间
  
  // 返回最小300像素，最大800像素的高度
  return Math.max(300, availableHeight)
}

// 初始化Vditor
const initVditor = () => {
  if (!vditorRef.value) return
  
  const height = calculateVditorHeight()
  
  vditor = new Vditor(vditorRef.value, {
    height: height,
    width: '100%',
    toolbarConfig: {
      pin: true,
    },
    cache: {
      enable: false,
    },
    preview: {
      markdown: {
        sanitize: true,
      },
    },
    input(value) {
      articleForm.content = value
    },
    after: () => {
      if (vditor) {
        vditor.setValue(articleForm.content)
      }
    }
  })
}

// 窗口大小变化时重新调整Vditor高度
const handleResize = () => {
  if (vditor) {
    const newHeight = calculateVditorHeight()
    vditor.setHeight(newHeight)
  }
}

// 提交文章
const submitArticle = () => {
  // 校验文章标题
  if (!articleForm.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  // 校验文章内容
  if (!articleForm.content.trim()) {
    ElMessage.warning('请输入文章内容')
    return
  }
  
  // 这里应该调用API提交文章
  console.log('提交文章:', articleForm)
  ElMessage.success('文章发布成功!')
  
  // 重置表单
  articleForm.title = ''
  articleForm.content = ''
  if (vditor) {
    vditor.setValue('')
  }
}

// 快捷键处理
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl + S 保存
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    submitArticle()
  }
}

// 添加事件监听器
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleResize)
  initVditor()
})

// 移除事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('resize', handleResize)
  if (vditor) {
    vditor.destroy()
  }
})
</script>

<style scoped>
.article-add-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.vditor-wrapper {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>