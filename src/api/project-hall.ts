import request from '@/utils/request'

const BASE_URL = '/v1/projects'

// 项目数据类型
export interface ProjectItem {
    id: number
    name: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard' | 'expert'
    deadline: string | null
    status: 'recruiting' | 'in_progress' | 'completed' | 'closed'
    accepted: boolean
}

// 项目详情类型
export interface ProjectDetail extends ProjectItem {
    created_at: string
    attachments?: Array<{
        name: string
        size: string
        type: string
        url: string
    }>
}

// 获取可见项目列表（基于指派）
export function getAvailableProjects(): Promise<{ list: ProjectItem[], total: number }> {
    return request.get(`${BASE_URL}/available`)
}

// 获取已接受项目列表（用于漏洞提交下拉）
export function getAcceptedProjects(): Promise<{ list: ProjectItem[], total: number }> {
    return request.get(`${BASE_URL}/accepted`)
}

// 获取项目详情（带可见性检查）
export function getProjectDetail(id: number): Promise<ProjectDetail> {
    return request.get(`${BASE_URL}/available/${id}`)
}

// 接受项目任务
export function acceptProjectTask(projectId: number): Promise<{ message: string, data: unknown }> {
    return request.post(`${BASE_URL}/${projectId}/accept`)
}
