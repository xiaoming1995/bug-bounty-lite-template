import { get } from '@/utils/request'
import { REPORT_API } from './config'

/**
 * 报告实体接口
 */
export interface Report {
    id: number
    vulnerability_name: string
    vulnerability_type_id: number
    self_assessment_id: number
    vulnerability_impact: string
    vulnerability_detail: string
    attachment_url: string
    severity: string
    status: string
    created_at: string
    updated_at: string
    author?: {
        id: number
        name: string
        username: string
    }
    project?: {
        id: number
        name: string
    }
    vulnerability_type?: {
        id: number
        config_value: string
    }
    self_assessment?: {
        id: number
        config_value: string
        config_key: string
    }
}

/**
 * 获取报告列表
 */
export const getReports = async (params?: {
    page?: number
    page_size?: number
}): Promise<Report[]> => {
    let url = REPORT_API.LIST
    if (params) {
        const searchParams = new URLSearchParams()
        if (params.page) searchParams.append('page', params.page.toString())
        if (params.page_size) searchParams.append('page_size', params.page_size.toString())
        const queryString = searchParams.toString()
        if (queryString) url += '?' + queryString
    }
    const response = await get<any>(url)
    // 后端返回格式: { list: [...], total: ..., page: ..., page_size: ... }
    const reports = response.list || response.reports || response.data || response
    return Array.isArray(reports) ? reports : []
}

/**
 * 获取报告详情
 */
export const getReportDetail = async (id: number): Promise<Report> => {
    const response = await get<any>(REPORT_API.DETAIL(id))
    return response.data || response
}
