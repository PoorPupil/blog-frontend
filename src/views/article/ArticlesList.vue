<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { fetchArticles, type Article } from '@/api/articles'

const articles = ref<Article[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    // 模拟数据：为了展示铺满的效果，我多造了几条数据
    await new Promise(r => setTimeout(r, 500))
    articles.value = [
      { id: 1, title: 'Spring AI 与 Java 后端的未来融合：从入门到实战', publishAt: '2025-11-27T10:00:00' },
      { id: 2, title: '极简主义设计美学：留白不是空，是呼吸', publishAt: '2025-11-15T09:30:00' },
      { id: 3, title: '越南市场直销系统架构复盘：高并发挑战', publishAt: '2025-10-28T14:20:00' },
      { id: 4, title: '游戏策划转型之路', publishAt: '2025-09-13T16:00:00' },
      { id: 5, title: 'Vue 3 + Vite + TypeScript 最佳实践', publishAt: '2025-08-20T11:00:00' },
      { id: 6, title: '构建高性能博客系统：数据库优化指南', publishAt: '2025-08-10T09:00:00' },
      { id: 7, title: 'DevOps 自动化部署流程详解', publishAt: '2025-07-05T14:00:00' },
      { id: 8, title: '深入理解 Java 虚拟机：内存模型', publishAt: '2025-06-15T10:00:00' },
      { id: 9, title: 'UI/UX 设计心理学：用户如何浏览网页', publishAt: '2025-06-01T09:00:00' },
      { id: 10, title: '微服务架构下的服务治理', publishAt: '2025-05-20T16:30:00' },
    ]
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})

function formatDate(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="page-wrapper">
    <header class="header">
      <div class="header-content">
        <h1 class="page-title">Articles Library</h1>
        <p class="page-subtitle">Designed for Widescreen</p>
      </div>
    </header>

    <main class="fluid-container">
      <div v-if="loading" class="loading-state">Loading...</div>

      <ul v-else class="grid-layout">
        <li v-for="post in articles" :key="post.id" class="card">
          <div class="card-body">
            <h2 class="card-title">{{ post.title }}</h2>
            <p class="card-desc">Click to read more details about this topic...</p>
          </div>

          <div class="card-footer">
            <div class="date-badge">
              <span class="date-icon">📅</span>
              {{ formatDate(post.publishAt) }}
            </div>
            <div class="arrow-icon">→</div>
          </div>
        </li>
      </ul>
    </main>
  </div>
</template>
<style scoped>
/* 【暴力全屏版】
  核心指令：No Gaps, Full Width.
*/

.page-wrapper {
  min-height: 100vh;
  min-width: 100%;
  background: linear-gradient(135deg, #F0F2F5 0%, #E6E9F0 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  display: flex;
  flex-direction: column;
  /* 移除 wrapper 的任何默认边距 */
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止因为阴影导致的横向滚动条 */
}

.header {
  background: #FFFFFF;
  /* 头部也拉满，左右只留极小的安全距离 */
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);
  z-index: 10; /* 保证头部浮在卡片之上 */
  position: relative;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 800;
  color: #111;
  margin: 0;
  letter-spacing: -0.5px;
  /* 稍微加个渐变字效果，既然要暴力美学 */
  background: linear-gradient(90deg, #333, #666);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  margin: 5px 0 0 0;
  color: #888;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 核心容器：没有任何多余的 padding */
.fluid-container {
  flex: 1;
  width: 100%; /* 强制 100% */
  box-sizing: border-box;
  padding: 20px; /* 这里的 padding 仅仅是为了不让卡片贴到屏幕边框上，如果不想要可以设为 0 */
}

.grid-layout {
  display: grid;
  /* ★ 关键修改 ★
     1. auto-fit: 哪怕一行只有 3 个卡片，只要后面有空隙，这 3 个卡片就会自动变宽拉满整行。
     2. minmax(300px, 1fr): 卡片最小300px，最大无限(1fr)，保证永远铺满。
  */
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px; /* 卡片之间的缝隙 */
  width: 100%;
  list-style: none;
  padding: 0;
  margin: 0;
}

.card {
  background: #FFFFFF;
  border-radius: 8px; /* 稍微减小圆角，更显硬朗、紧凑 */
  padding: 24px;

  /* 这种阴影更扁平，更贴近“仪表盘”风格 */
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0,0,0,0.05);

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;

  transition: all 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
}

/* Hover 时整张卡片微微上浮，阴影加深 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border-color: #CBD5E0;
  z-index: 2; /* 让 hover 的卡片浮在其他卡片上面 */
}

/* 给卡片左侧加一条色条，区分度更高 */
.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #3182CE; /* 科技蓝 */
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.card:hover::before {
  opacity: 1;
}

.card-body {
  margin-bottom: 20px;
}

.card-title {
  margin: 0 0 10px 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: #2D3748;
  line-height: 1.4;
  /* 标题不做截断了，既然要拉满，就让它完整显示 */
}

.card-desc {
  margin: 0;
  font-size: 0.95rem;
  color: #718096;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 16px;
  border-top: 1px dashed #E2E8F0; /* 虚线分割，更有技术感 */
}

.date-badge {
  font-family: 'SF Mono', monospace;
  font-size: 0.85rem;
  color: #718096;
  background: #EDF2F7;
  padding: 4px 8px;
  border-radius: 4px;
}

.loading-state {
  text-align: center;
  padding: 50px;
  font-size: 1.5rem;
  color: #A0AEC0;
}
</style>