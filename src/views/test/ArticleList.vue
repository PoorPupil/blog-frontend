<template>
    <div class="home-container">

        <!-- 1. 极简头部 (Hero Section) -->
        <!-- 这里不放图，只放一句你的 Slogan 或者名字，留白要大 -->
        <header class="blog-header">
            <h1 class="logo">Ccl.Blog</h1>
            <p class="slogan">Talk is cheap. Show me the code.</p>
        </header>

        <!-- 2. 文章列表 (按年份分组) -->
        <main class="article-list">

            <!-- 循环年份组 -->
            <section v-for="group in groupedArticles" :key="group.year" class="year-section">

                <!-- 年份大标题 (类似档案标签) -->
                <div class="year-label">{{ group.year }}</div>

                <!-- 该年份下的文章 -->
                <div class="article-items">
                    <article v-for="item in group.list" :key="item.id" class="article-item" @click="goDetail(item.id)">
                        <!-- 标题 -->
                        <h2 class="article-title">
                            {{ item.title }}
                        </h2>

                        <!-- 元信息 (日期 + 标签) -->
                        <div class="article-meta">
                            <!-- 使用等宽字体显示日期，更有代码感 -->
                            <span class="meta-date">{{ formatDate(item.createTime) }}</span>

                            <!-- 标签循环 -->
                            <span class="meta-tags">
                                <span v-for="tag in item.tags" :key="tag" class="tag">#{{ tag }}</span>
                            </span>
                        </div>
                    </article>
                </div>
            </section>

            <!-- 到底了/加载更多 -->
            <div class="list-footer">
                <span class="eof">EOF</span>
            </div>

        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- 定义数据接口 ---
interface ArticleItem {
    id: number
    title: string
    createTime: string // 格式: yyyy-MM-dd HH:mm:ss
    tags: string[]
}

interface YearGroup {
    year: string
    list: ArticleItem[]
}

// --- Mock 数据 (后续替换为 API 调用) ---
// 注意：为了测试分组效果，我特意造了跨年份的数据
const rawArticles = ref<ArticleItem[]>([
    { id: 1, title: 'HashMap 源码分析与手写实现', createTime: '2025-11-28 10:00:00', tags: ['Java', 'DataStructure'] },
    { id: 2, title: '为什么我建议后端程序员学点 Vue3？', createTime: '2025-10-15 14:30:00', tags: ['Frontend', 'Vue3'] },
    { id: 3, title: 'Spring Boot 3.0 迁移踩坑记录', createTime: '2025-05-20 09:00:00', tags: ['SpringBoot'] },
    { id: 4, title: '深入理解 JVM 垃圾回收算法', createTime: '2024-12-11 18:20:00', tags: ['JVM', 'Java'] },
    { id: 5, title: '我的 2024 年度总结', createTime: '2024-01-01 00:00:00', tags: ['Life'] },
])

// --- 核心逻辑：按年份分组 ---
const groupedArticles = computed<YearGroup[]>(() => {
    const groups: Record<string, ArticleItem[]> = {}

    // 1. 遍历归类
    rawArticles.value.forEach(article => {
        // 提取年份 (假设时间格式是 yyyy-MM-dd...)
        const year = article.createTime.substring(0, 4)
        if (!groups[year]) {
            groups[year] = []
        }
        groups[year].push(article)
    })

    // 2. 转为数组并按年份倒序 (2025 -> 2024)
    return Object.keys(groups)
        .sort((a, b) => Number(b) - Number(a))
        .map(year => ({
            year,
            list: groups[year] // 这里列表内部通常本来就是后端排好序的，如果没排可以在这里再sort一下
        }))
})

// --- 工具方法 ---
const goDetail = (id: number) => {
    router.push(`/article/${id}`)
}

// 格式化日期：只显示 "月-日" (如 11-28) 或者英文 (Nov 28)
// 这里我们用极简数字风格: "11-28"
const formatDate = (timeStr: string) => {
    const date = new Date(timeStr)
    const m = (date.getMonth() + 1).toString().padStart(2, '0')
    const d = date.getDate().toString().padStart(2, '0')
    return `${m}-${d}`
}
</script>

<style scoped>
/* 引入等宽字体 (如果没有安装 Fira Code，会回退到 monospace) */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&display=swap');

.home-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 60px 20px;
    background-color: #fff;
    min-height: 100vh;
    /* 整体字体优化 */
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #2c3e50;
}

/* 头部 Slogan */
.blog-header {
    margin-bottom: 80px;
    text-align: left;
    /* 极客风通常靠左，也可以居中 */
}

.logo {
    font-size: 24px;
    font-weight: 900;
    margin: 0;
    letter-spacing: -0.5px;
}

.slogan {
    margin-top: 10px;
    color: #666;
    font-size: 14px;
    font-family: 'Fira Code', monospace;
    /* 代码体 Slogan */
}

/* 年份区块 */
.year-section {
    position: relative;
    margin-bottom: 60px;
}

/* 年份标签 - 设计亮点 */
.year-label {
    font-size: 80px;
    /* 超大 */
    font-weight: 900;
    color: #f2f2f2;
    /* 极淡的灰色背景字 */
    position: absolute;
    top: -40px;
    left: -20px;
    z-index: 0;
    /* 沉在底下 */
    pointer-events: none;
    /* 不挡鼠标 */
    user-select: none;
    line-height: 1;
}

/* 文章列表容器 */
.article-items {
    position: relative;
    z-index: 1;
    /* 浮在年份文字上面 */
    padding-left: 10px;
    /* 稍微缩进一点 */
}

/* 单个文章项 */
.article-item {
    margin-bottom: 40px;
    cursor: pointer;
    transition: transform 0.2s ease;
}

.article-title {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 12px 0;
    color: #2c3e50;
    line-height: 1.4;
    /* 交互 */
    transition: color 0.2s;
}

.article-item:hover .article-title {
    color: #3498db;
    /* 经典的极客蓝 */
    text-decoration: underline;
    text-decoration-thickness: 2px;
    text-underline-offset: 4px;
}

/* 元信息 */
.article-meta {
    font-family: 'Fira Code', monospace;
    /* 核心：等宽字体 */
    font-size: 13px;
    color: #999;
    display: flex;
    align-items: center;
    gap: 15px;
    /* 间距 */
}

.meta-date {
    color: #999;
}

.meta-tags {
    display: flex;
    gap: 8px;
}

.tag {
    color: #b0b0b0;
    transition: color 0.2s;
}

/* 鼠标悬停在文章上时，标签稍微亮一点 */
.article-item:hover .tag {
    color: #666;
}

/* 底部 EOF */
.list-footer {
    text-align: center;
    margin-top: 80px;
    border-top: 1px dashed #eee;
    padding-top: 40px;
}

.eof {
    font-family: 'Fira Code', monospace;
    color: #ddd;
    font-size: 14px;
    letter-spacing: 2px;
}
</style>