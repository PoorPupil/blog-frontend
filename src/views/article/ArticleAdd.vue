<template>
  <div class="article-add-container">
    <el-card class="article-card">
      <el-form :model="articleForm" label-position="top">
        <el-form-item label="文章标题">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" clearable class="title-input" />
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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import Vditor from 'vditor'
import 'vditor/dist/index.css'
import { publishArticle, updateById, getArticleById } from '@/api/articles'

// 定义表单数据
const articleForm = reactive<{ id?: number; title: string; content: string }>({
  id: undefined,
  title: '',
  content: ''
})

// Vditor实例引用
const vditorRef = ref<HTMLDivElement | null>(null)
let vditor: Vditor | null = null
const route = useRoute()
const router = useRouter()

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
      ; (vditor as any).setHeight?.(newHeight)
  }
}

// 提交文章
const submitArticle = async () => {
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

  try {
    // 调用API提交文章
    const result = await publishArticle({
      title: articleForm.title,
      content: articleForm.content
    })

    console.log('发布文章结果:', result)

    // 从返回结果获取Id
    articleForm.id = result ?? undefined

    ElMessage.success('文章发布成功!')
  } catch (error) {
    console.error('发布文章失败:', error)
    ElMessage.error('文章发布失败!')
  }
}

// 保存草稿功能
const updateArticle = async () => {
  // 校验id
  if (!articleForm.id) {
    ElMessage.warning('异常！应该是新增文章，现在缺少文章Id');
  }

  // 校验文章标题
  if (!articleForm.title.trim()) {
    ElMessage.warning('请输入文章标题')
    return
  }

  try {
    // 调用API保存草稿
    await updateById({
      id: articleForm.id ?? undefined,
      title: articleForm.title,
      content: articleForm.content
    })

    ElMessage.success('保存成功!')
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败!')
  }
}

// 快捷键处理
const handleKeyDown = async (event: KeyboardEvent) => {
  // Ctrl + S 保存
  if (event.ctrlKey && event.key === 's') {
    event.preventDefault()
    console.log('id:', articleForm.id);
    if (articleForm.id) {
      updateArticle()
    } else {
      submitArticle()
    }
    return
  }

  // Esc 键保存并退出
  if (event.key === 'Escape') {
    const ae = document.activeElement as HTMLElement | null
    const focusingTitle = !!ae?.closest('.title-input')
    const focusingEditor = !!ae?.closest('.vditor')
    if (focusingTitle || focusingEditor) {
      ae?.blur()
      return
    }
    try {
      if (articleForm.id) {
        await updateArticle()
      } else {
        await submitArticle()
      }
      router.back()
    } catch (error: any) {
      console.error('保存失败', error)
      ElMessage.error(error?.message || error?.response?.data?.message || '保存失败')
    }
  }
}

// 添加事件监听器
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('resize', handleResize)
  initVditor()
  const idStr = route.query.id as string | undefined
  if (idStr) {
    const id = Number(idStr)
    if (!Number.isNaN(id)) {
      getArticleById(id).then(detail => {
        articleForm.id = detail.id
        articleForm.title = detail.title
        articleForm.content = detail.content
        if (vditor) {
          vditor.setValue(articleForm.content || '')
        }
      }).catch((error: any) => {
        console.error('加载文章详情失败', error)
        ElMessage.error(error?.message || error?.response?.data?.message || '加载文章详情失败')
      })
    }
  }
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

/* 新增样式 */
.article-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.title-input :deep(.el-input__inner) {
  border: none;
  border-bottom: 1px solid #dcdfe6;
  border-radius: 0;
  font-size: 18px;
  padding: 12px 0;
  height: auto;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.title-input :deep(.el-input__inner:focus) {
  border-color: #42b883;
  box-shadow: 0 0 0 2px rgba(66, 184, 131, 0.1);
  outline: none;
}

:deep(.vditor-toolbar) {
  background-color: #f8f8f8;
  border-bottom: 1px solid #ebeef5;
}

:deep(.vditor-toolbar__item button:hover) {
  background-color: #ebeef5;
  color: #35495e;
}

:deep(.vditor-content) {
  padding: 20px;
}

:deep(.vditor) {
  border: 1px solid #ebeef5;
  border-radius: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.publish-button {
  background-color: #42b883;
  border-color: #42b883;
}
</style>
