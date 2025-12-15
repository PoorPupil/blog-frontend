<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { getArticleList } from '@/api/articles'
import { useRouter } from 'vue-router'
type ArticleItem = { id: number; title: string; publishAt: string }

const router = useRouter()
const currentPage = ref(1)
const pageSize = ref(5)
const total = ref(0)
const tableData = ref<ArticleItem[]>([])

const loadData = async () => {
  try {
    const res = await getArticleList({
      pageNum: currentPage.value,
      pageSize: pageSize.value,
    })
    total.value = res.total || 0
    tableData.value = res.records || []
  } catch (e) {
    ElMessage.error('加载文章列表失败')
  }
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadData()
}

onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  loadData()
})

// 快捷键监听
const handleKeyDown = async (event: KeyboardEvent) => {
  // Ctrl + Enter
  if (event.ctrlKey && event.key === 'Enter') {
    event.preventDefault()
    router.push({ name: 'ArticlePublish' })
  }
}

const goDetail = (item: ArticleItem) => {
  router.push({ name: 'ArticlePublish', query: { id: String(item.id) } })
}

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div class="list-page">
    <div class="list-container" :style="{ '--page-size': String(pageSize) }">
      <ul class="article-list" v-if="tableData.length">
        <li v-for="item in tableData" :key="item.id" class="article-item" @click="goDetail(item)">
          <span class="title">{{ item.title }}</span>
          <span class="time">{{ item.publishAt }}</span>
        </li>
      </ul>
      <el-empty v-else description="暂无数据" />
      <div class="example-pagination-block">
        <el-pagination background layout="prev, pager, next, total" v-model:current-page="currentPage"
          v-model:page-size="pageSize" :total="total" @current-change="handleCurrentChange" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-page {
  --radius: 12px;
  --neon: #00F2EA;
  --neon2: #00B4FF;
  padding: 24px 16px;
}

.list-container {
  width: min(720px, 80%);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  --item-height: 56px;
}

.article-list {
  list-style: none;
  margin: 0 0 16px 0;
  padding: 0;
  min-height: calc(var(--page-size, 5) * var(--item-height, 56px));
}

.article-item {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: var(--radius);
  background: #fff;
  border: 1px solid transparent;
  transition: transform .2s ease, box-shadow .2s ease;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
}

.article-item::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  padding: 1px;
  background: linear-gradient(120deg, var(--neon), var(--neon2));
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.article-item::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: var(--radius);
  background:
    radial-gradient(60% 60% at 20% 20%, rgba(0, 242, 234, .18), transparent 60%),
    radial-gradient(50% 50% at 80% 80%, rgba(0, 180, 255, .12), transparent 60%);
  opacity: 0;
  transition: opacity .2s ease;
  pointer-events: none;
}

.article-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 242, 234, .18), 0 6px 18px rgba(255, 38, 160, .12);
}

.article-item:hover::after {
  opacity: 1;
}

.article-item .title {
  font-size: 15px;
  font-weight: 600;
}

.article-item .time {
  color: #909399;
  font-size: 13px;
}

.example-pagination-block {
  margin-top: auto;
  padding-top: 8px;
}

.example-pagination-block {
  margin-bottom: 16px;
}
</style>
