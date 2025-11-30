export type Article = {
  id: number
  title: string
  summary: string
  author: string
  publishedAt: string // ISO string
}

// 模拟获取文章列表（后续可替换为真实后端接口）
export async function fetchArticles(): Promise<Article[]> {
  // 模拟网络延迟
  await new Promise((resolve) => setTimeout(resolve, 300))

  return [
    {
      id: 1,
      title: '使用 Java 与 Spring Boot 构建博客后端',
      summary: '介绍如何设计 REST API、数据模型与认证授权。',
      author: '你自己',
      publishedAt: '2024-11-01T10:00:00Z',
    },
    {
      id: 2,
      title: 'Vue 3 + Vite 前端项目从零上手',
      summary: '从项目初始化到路由与页面搭建的基本流程。',
      author: '你自己',
      publishedAt: '2024-11-05T09:20:00Z',
    },
    {
      id: 3,
      title: '前后端联调的最佳实践',
      summary: '约定接口规范、错误码与统一返回结构，提升协作效率。',
      author: '你自己',
      publishedAt: '2024-11-12T08:30:00Z',
    },
  ]
}