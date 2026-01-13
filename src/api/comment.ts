import { get, post, del } from '@/utils/request'

const BASE_URL = '/v1/reports'

/**
 * 评论响应接口
 */
export interface CommentAuthor {
    id: number
    username: string
    name: string
    role: string
    avatar?: {
        id: number
        url: string
    }
}

export interface ReportComment {
    id: number
    report_id: number
    author_id: number
    author?: CommentAuthor
    content: string
    created_at: string
    updated_at: string
}

export interface CommentsResponse {
    data: ReportComment[]
    total: number
}

/**
 * 获取报告的评论列表
 */
export const getReportComments = async (reportId: number): Promise<ReportComment[]> => {
    const response = await get<CommentsResponse>(`${BASE_URL}/${reportId}/comments`)
    return response.data || []
}

/**
 * 创建评论
 */
export const createReportComment = async (reportId: number, content: string): Promise<ReportComment> => {
    const response = await post<{ message: string; data: ReportComment }>(`${BASE_URL}/${reportId}/comments`, { content })
    return response.data
}

/**
 * 删除评论
 */
export const deleteReportComment = async (reportId: number, commentId: number): Promise<void> => {
    await del(`${BASE_URL}/${reportId}/comments/${commentId}`)
}
