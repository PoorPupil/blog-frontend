<template>
  <div class="article-add-container">
    <el-card class="article-card">
      <template #header>
        <div class="card-header">
          <span>添加新文章</span>
          <div>
            <el-button type="primary" @click="submitArticle">发布文章</el-button>
          </div>
        </div>
      </template>
      
      <el-form :model="articleForm" label-position="top">
        <el-form-item label="文章标题">
          <el-input 
            v-model="articleForm.title" 
            placeholder="请输入文章标题"
            clearable
          />
        </el-form-item>
        
        <el-form-item label="文章内容">
          <div class="editor-container">
            <div class="editor-toolbar">
              <el-button-group>
                <el-button @click="insertText('# ')"># 标题</el-button>
                <el-button @click="insertText('**', '**')">**粗体**</el-button>
                <el-button @click="insertText('*', '*')">斜体</el-button>
                <el-button @click="insertText('> ')">引用</el-button>
                <el-button @click="insertText('- ')">列表</el-button>
                <el-button @click="insertText('`', '`')">代码</el-button>
              </el-button-group>
            </div>
            
            <div class="editor-wrapper">
              <textarea
                ref="editorRef"
                v-model="articleForm.content"
                class="editor-textarea"
                placeholder="请输入文章内容，支持Markdown语法..."
                @keydown.tab.exact.prevent="insertText('  ')"
                @keydown.ctrl.quotemark.prevent="insertText('`', '`')"
                @keydown.ctrl.b.prevent="insertText('**', '**')"
                @keydown.ctrl.i.prevent="insertText('*', '*')"
                @keydown.ctrl.enter.prevent="submitArticle"
              />
              
              <div class="editor-preview">
                <div class="preview-header">
                  <span>预览效果</span>
                </div>
                <div class="preview-content markdown-body" v-html="previewContent"></div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'
import { markedHighlight } from 'marked-highlight'

// 配置marked支持代码高亮
marked.use(markedHighlight({
  langPrefix: 'hljs language-',
  highlight(code: string, lang?: string) {
    const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
    return hljs.highlight(code, { language }).value
  }
}))

// 定义表单数据
const articleForm = reactive({
  title: '',
  content: ''
})

// 编辑器引用
const editorRef = ref<HTMLTextAreaElement | null>(null)

// 预览内容计算属性
const previewContent = computed(() => {
  return marked.parse(articleForm.content || '')
})

// 插入文本到编辑器
const insertText = (before: string, after: string = '') => {
  const editor = editorRef.value
  if (!editor) return
  
  const startPos = editor.selectionStart
  const endPos = editor.selectionEnd
  const text = articleForm.content
  const selectedText = text.substring(startPos, endPos)
  
  // 插入文本
  articleForm.content = 
    text.substring(0, startPos) + 
    before + 
    selectedText + 
    after + 
    text.substring(endPos)
  
  // 设置光标位置
  setTimeout(() => {
    const newCursorPos = startPos + before.length + selectedText.length
    editor.focus()
    editor.setSelectionRange(newCursorPos, newCursorPos)
  }, 0)
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
})

// 移除事件监听器
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
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

.editor-container {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  overflow: hidden;
}

.editor-toolbar {
  padding: 10px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
}

.editor-wrapper {
  display: flex;
  height: 500px;
}

.editor-textarea {
  flex: 1;
  padding: 15px;
  border: none;
  resize: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  outline: none;
}

.editor-textarea:focus {
  outline: none;
}

.editor-preview {
  flex: 1;
  border-left: 1px solid #dcdfe6;
  display: flex;
  flex-direction: column;
  overflow: auto;
}

.preview-header {
  padding: 10px 15px;
  border-bottom: 1px solid #dcdfe6;
  background-color: #f5f7fa;
  font-weight: bold;
}

.preview-content {
  flex: 1;
  padding: 15px;
  overflow: auto;
}

/* Markdown样式 */
.markdown-body {
  line-height: 1.6;
  color: #333;
  font-size: 15px;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  background-color: #282c34;
  border-radius: 6px;
  margin: 16px 0;
}

.markdown-body code {
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 85%;
}

.markdown-body pre code {
  background: transparent;
  padding: 0;
}

.markdown-body blockquote {
  margin: 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  background-color: #f9f9f9;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-top: 0;
  margin-bottom: 16px;
}

.markdown-body li {
  margin-bottom: 4px;
}

.markdown-body li > p {
  margin-top: 16px;
}
</style>