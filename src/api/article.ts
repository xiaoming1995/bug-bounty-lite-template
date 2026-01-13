import { get, post, put, del } from '@/utils/request'

const BASE_URL = '/v1/articles'

/**
 * 文章作者接口
 */
export interface ArticleAuthor {
    id: number
    username: string
    name: string
    avatar?: {
        id: number
        url: string
    }
}

/**
 * 文章接口
 */
export interface Article {
    id: number
    title: string
    description: string
    content: string
    author_id: number
    author?: ArticleAuthor
    status: 'pending' | 'approved' | 'rejected'
    reject_reason?: string
    views: number
    likes: number
    created_at: string
    updated_at: string
}

/**
 * 文章列表响应
 */
export interface ArticlesResponse {
    data: Article[]
    total: number
}

/**
 * 创建文章请求
 */
export interface CreateArticleRequest {
    title: string
    description: string
    content: string
}

/**
 * 更新文章请求
 */
export interface UpdateArticleRequest {
    title: string
    description: string
    content: string
}

/**
 * 审核文章请求
 */
export interface ReviewArticleRequest {
    approved: boolean
    reject_reason?: string
}

/**
 * 创建文章
 */
export const createArticle = async (data: CreateArticleRequest): Promise<Article> => {
    const response = await post<{ message: string; data: Article }>(`${BASE_URL}`, data)
    return response.data
}

/**
 * 获取我的文章列表
 */
export const getMyArticles = async (): Promise<Article[]> => {
    const response = await get<ArticlesResponse>(`${BASE_URL}`)
    return response.data || []
}

/**
 * 获取文章详情
 */
export const getArticle = async (id: number, incrementView: boolean = false): Promise<Article> => {
    const url = incrementView ? `${BASE_URL}/${id}?view=true` : `${BASE_URL}/${id}`
    const response = await get<{ data: Article }>(url)
    return response.data
}

/**
 * 更新文章
 */
export const updateArticle = async (id: number, data: UpdateArticleRequest): Promise<Article> => {
    const response = await put<{ message: string; data: Article }>(`${BASE_URL}/${id}`, data)
    return response.data
}

/**
 * 删除文章
 */
export const deleteArticle = async (id: number): Promise<void> => {
    await del(`${BASE_URL}/${id}`)
}

/**
 * 获取已发布的文章列表（学习中心）
 */
export const getPublishedArticles = async (): Promise<Article[]> => {
    const response = await get<ArticlesResponse>(`${BASE_URL}/public`)
    return response.data || []
}

/**
 * 审核文章（管理员）
 */
export const reviewArticle = async (id: number, data: ReviewArticleRequest): Promise<Article> => {
    const response = await put<{ message: string; data: Article }>(`/v1/admin/articles/${id}/review`, data)
    return response.data
}
