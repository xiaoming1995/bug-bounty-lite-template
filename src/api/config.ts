/**
 * API 配置文件
 * 统一管理 API 端点
 */

// API 基础路径
export const API_BASE = '/api'

// 认证相关 API
export const AUTH_API = {
  LOGIN: '/v1/auth/login',
  LOGOUT: '/auth/logout',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  GET_USER_INFO: '/auth/user'
}

// 漏洞相关 API
export const VULNERABILITY_API = {
  LIST: '/vulnerabilities',
  DETAIL: (id: string | number) => `/vulnerabilities/${id}`,
  CREATE: '/vulnerabilities',
  UPDATE: (id: string | number) => `/vulnerabilities/${id}`,
  DELETE: (id: string | number) => `/vulnerabilities/${id}`,
  SUBMIT: '/vulnerabilities/submit',
  SEARCH: '/vulnerabilities/search'
}

// 消息相关 API
export const MESSAGE_API = {
  LIST: '/messages',
  DETAIL: (id: string | number) => `/messages/${id}`,
  MARK_READ: (id: string | number) => `/messages/${id}/read`,
  MARK_ALL_READ: '/messages/read-all',
  DELETE: (id: string | number) => `/messages/${id}`,
  BATCH_DELETE: '/messages/batch-delete',
  STATS: '/messages/stats'
}

// 用户相关 API
export const USER_API = {
  PROFILE: '/user/profile',
  UPDATE_PROFILE: '/user/profile',
  CHANGE_PASSWORD: '/user/change-password',
  AVATAR: '/user/avatar'
}

// 报告相关 API
export const REPORT_API = {
  LIST: '/reports',
  DETAIL: (id: string | number) => `/reports/${id}`,
  WEEKLY: '/reports/weekly',
  MONTHLY: '/reports/monthly'
}

// CNNVD 相关 API
export const CNNVD_API = {
  LIST: '/cnnvd',
  DETAIL: (id: string | number) => `/cnnvd/${id}`,
  SYNC: '/cnnvd/sync'
}

// 项目相关 API
export const PROJECT_API = {
  LIST: '/v1/projects'
}

