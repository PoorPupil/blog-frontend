import request from '../utils/request'

export type Article = {
  id: number //文章 ID
  title: string // 标题
  summary: string // 摘要
  author: string // 作者
  publishAt: string // ISO string
}

// 定义文章表单数据类型
export interface ArticleForm {
  id?: number
  title: string
  content: string
}

// 发布文章
export const publishArticle = (data: ArticleForm) => {
  return request.post<any, any>('/article/add', data)
}

// 保存草稿
export const updateById = (data: ArticleForm) => {
  return request.post<any, any>('/article/update-by-id', data)
}