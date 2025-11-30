<template>
    <div class="article-container">

        <!-- 1. 顶部导航 (简易版) -->
        <nav class="nav-header">
            <div class="nav-content">
                <span class="logo">MyBlog</span>
                <el-button link @click="$router.push('/')">返回首页</el-button>
            </div>
        </nav>

        <!-- 2. 文章主体区域 -->
        <main class="main-content">

            <!-- 标题区 -->
            <header class="article-header">
                <h1 class="title">{{ article.title }}</h1>

                <div class="meta-info">
                    <span class="author">
                        <el-avatar :size="24" :src="article.authorAvatar"
                            style="vertical-align: middle; margin-right: 5px;" />
                        {{ article.authorName }}
                    </span>
                    <span class="dot">·</span>
                    <span class="time">{{ article.createTime }}</span>
                    <span class="dot">·</span>
                    <span class="category">{{ article.categoryName }}</span>
                </div>

                <!-- 封面图 -->
                <div class="cover-image" :style="{ backgroundImage: `url(${article.cover})` }"></div>
            </header>

            <!-- 文章内容区 (Markdown渲染) -->
            <!-- v-html 是 Vue 用来渲染原生 HTML 的指令 -->
            <article class="markdown-body" v-html="htmlContent"></article>

        </main>

        <!-- 3. 底部 -->
        <footer class="page-footer">
            <p>© 2025 MyBlog · Designed by Ccl</p>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // 代码高亮样式，喜欢亮的可以换 github.css
import { markedHighlight } from 'marked-highlight'

// 配置 marked 支持代码高亮
// marked.setOptions({
//     highlight: function (code, lang) {
//         const language = hljs.getLanguage(lang) ? lang : 'plaintext';
//         return hljs.highlight(code, { language }).value;
//     },
//     langPrefix: 'hljs language-',
// });

marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code: string, lang?: string) {
        const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
    }
}))

// --- Mock 数据 (后端接口好了之后替换这里) ---
const article = ref({
    id: 1,
    title: '为什么我建议Java程序员都要学点Vue3？',
    authorName: 'ccl',
    authorAvatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    createTime: '2025-11-28',
    categoryName: '前端技术',
    cover: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80',
    // 模拟一段 Markdown 文本
    content: `
    > 这是一个不再只有后端的时代。

    ## 前言

    很多 **Java 后端** 总是觉得前端很难，其实 Vue 3 的 \`Composition API\` 和 Java 的逻辑非常像。

    ### 代码示例

    下面是一段 Java 代码：

    \`\`\`java
    @SpringBootApplication
    public class Application {
        public static void main(String[] args) {
            SpringApplication.run(Application.class, args);
        }
    }
    \`\`\`

    ### 列表展示
    - 易上手
    - 生态好
    - 性能强

    希望大家都能成为全栈工程师！
    `
})

// 计算属性：将 Markdown 转为 HTML
const htmlContent = computed(() => {
    return marked.parse(article.value.content)
})
</script>

<style scoped>
/* 容器 */
.article-container {
    min-height: 100vh;
    background-color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

/* 导航栏 */
.nav-header {
    position: sticky;
    top: 0;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid #f0f0f0;
    z-index: 10;
}

.nav-content {
    max-width: 800px;
    margin: 0 auto;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
}

.logo {
    font-weight: 700;
    font-size: 20px;
    color: #333;
}

/* 主内容区 */
.main-content {
    max-width: 720px;
    /* 经典的阅读宽度 */
    margin: 0 auto;
    padding: 40px 20px;
}

/* 头部信息 */
.title {
    font-size: 32px;
    font-weight: 700;
    color: #292525;
    margin-bottom: 20px;
    line-height: 1.4;
}

.meta-info {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #757575;
    margin-bottom: 30px;
}

.dot {
    margin: 0 8px;
}

/* 封面图 */
.cover-image {
    width: 100%;
    height: 300px;
    background-position: center;
    background-size: cover;
    border-radius: 8px;
    margin-bottom: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* 页脚 */
.page-footer {
    text-align: center;
    padding: 40px;
    color: #999;
    font-size: 13px;
    border-top: 1px solid #f0f0f0;
    margin-top: 40px;
}

/* --- Markdown 内容样式 (简易版) --- */
/* 这里使用了 :deep() 因为 v-html 渲染的内容属于子内容 */
:deep(.markdown-body) {
    line-height: 1.8;
    color: #2c3e50;
    font-size: 17px;
    /* 大字体阅读体验更好 */
}

:deep(.markdown-body h2) {
    border-bottom: 1px solid #eaecef;
    padding-bottom: 0.3em;
    margin-top: 24px;
}

:deep(.markdown-body p) {
    margin-bottom: 16px;
}

:deep(.markdown-body blockquote) {
    margin: 0;
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
    background-color: #f9f9f9;
}

:deep(.markdown-body pre) {
    background-color: #282c34;
    border-radius: 6px;
    padding: 16px;
    overflow: auto;
}

:deep(.markdown-body code) {
    font-family: "Fira Code", monospace;
    /* 程序员专用字体 */
}

/* 行内代码 */
:deep(.markdown-body p code) {
    background-color: #fff5f5;
    color: #ff502c;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 0.9em;
}

:deep(.markdown-body img) {
    max-width: 100%;
    border-radius: 4px;
}
</style>