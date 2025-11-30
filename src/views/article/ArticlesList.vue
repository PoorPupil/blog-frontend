<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchArticles, type Article } from '@/api/articles'

const loading = ref(true)
const articles = ref<Article[]>([])

onMounted(async () => {
  articles.value = await fetchArticles()
  loading.value = false
})

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <main class="container">
    <h1 class="title">文章列表</h1>

    <div v-if="loading" class="loading">加载中...</div>

    <ul v-else class="list">
      <li v-for="post in articles" :key="post.id" class="card">
        <h2 class="card-title">{{ post.title }}</h2>
        <p class="card-meta">作者：{{ post.author }} · 发布于：{{ formatDate(post.publishedAt) }}</p>
        <p class="card-summary">{{ post.summary }}</p>
        <!-- 未来可以加：阅读全文链接、标签等 -->
      </li>
    </ul>
  </main>
</template>

<style scoped>
.container {
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px;
}
.title {
  font-size: 24px;
  font-weight: 600;
  margin: 16px 0 24px;
}
.loading {
  color: #666;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}
.card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}
.card-title {
  font-size: 18px;
  margin: 0 0 8px;
}
.card-meta {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 8px;
}
.card-summary {
  font-size: 14px;
  color: #111827;
  margin: 0;
}

@media (min-width: 640px) {
  .list {
    grid-template-columns: 1fr 1fr;
  }
}
</style>