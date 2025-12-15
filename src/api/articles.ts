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

export type ArticleDetail = {
  id: number
  title: string
  content: string
  publishAt?: string
}
// 发布文章
export const publishArticle = (data: ArticleForm) => {
  return request.post<any, any>('/article/add', data)
}

// 保存草稿
export const updateById = (data: ArticleForm) => {
  return request.post<any, any>('/article/update-by-id', data)
}


export type GetArticleListParams = {
  pageNum: number
  pageSize: number
}

export type GetArticleListResponse = {
  total: number
  size: number
  current: number
  pages: number
  records: GetArticleListItem[]
}
export type GetArticleListItem = {
  id: number // 文章id
  title: string // 标题
  publishAt: string // yyyy-MM-dd hh:mm:ss
}
// 获取文章列表
export const getArticleList = (data: GetArticleListParams) => {
  return request.get<any, any>('/article/page-list', { params: data })
}

export const getArticleById = (id: number) => {
  return request.get<any, ArticleDetail>('/article/get-by-id', { params: { id } })
}
