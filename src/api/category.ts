import request from '../utils/request'

// 定义返回的数据结构 (对应后端的 CategoryPO)
export interface CategoryVO {
    id: number
    name: string
    createTime: string
}

// 查列表
export const getCategoryList = () => {
    return request.get<any, CategoryVO[]>('/category/list')
}