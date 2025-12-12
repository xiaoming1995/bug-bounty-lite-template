/**
 * HTTP 请求工具
 * 基于 fetch API 封装，支持拦截器、错误处理等
 */

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const API_TIMEOUT = 30000 // 30秒超时

// 请求配置接口
interface RequestConfig extends RequestInit {
  timeout?: number
  showError?: boolean // 是否显示错误提示
}

// 响应数据接口
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 创建超时 Promise
 */
function createTimeoutPromise(timeout: number): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`请求超时 (${timeout}ms)`))
    }, timeout)
  })
}

/**
 * 获取认证 token
 */
function getAuthToken(): string | null {
  return localStorage.getItem('token') || localStorage.getItem('auth_token')
}

/**
 * 请求拦截器 - 添加认证头等
 */
function requestInterceptor(config: RequestConfig): RequestConfig {
  const token = getAuthToken()

  // 设置默认 headers
  const headers = new Headers(config.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  headers.set('Content-Type', 'application/json')

  return {
    ...config,
    headers
  }
}

/**
 * 响应拦截器 - 统一处理响应
 */
async function responseInterceptor<T>(response: Response): Promise<T> {
  // 解析响应数据（先解析，再判断状态码）
  const contentType = response.headers.get('content-type')
  let responseData: any = null

  if (contentType && contentType.includes('application/json')) {
    responseData = await response.json()
  } else {
    responseData = await response.text()
  }

  // HTTP 状态码检查
  if (!response.ok) {
    let errorMessage = `请求失败: ${response.status} ${response.statusText}`

    // 尝试从响应数据中提取错误信息
    if (responseData) {
      if (typeof responseData === 'object') {
        errorMessage = responseData.message || responseData.error || responseData.msg || errorMessage
      } else if (typeof responseData === 'string') {
        errorMessage = responseData || errorMessage
      }
    }

    // 401 未授权，清除 token 并跳转登录（但不影响当前登录流程）
    if (response.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('user_info')
      localStorage.removeItem('tokenExpiresAt')

      // 只有在非登录页面才跳转（避免登录页面的401错误导致跳转）
      if (!window.location.pathname.includes('/login')) {
        setTimeout(() => {
          window.location.href = '/login'
        }, 100)
      }
    }

    // 抛出错误，但不跳转（由调用方处理）
    const error = new Error(errorMessage) as any
    error.status = response.status
    error.response = responseData
    throw error
  }

  // 如果后端统一返回 { code, message, data } 格式
  if (typeof responseData === 'object' && responseData !== null && 'code' in responseData) {
    // 只有 code 为 200 或 0 才认为是成功
    if (responseData.code === 200 || responseData.code === 0) {
      return responseData.data as T
    } else {
      // 非200状态码，抛出错误
      const error = new Error(responseData.message || '请求失败') as any
      error.status = responseData.code
      error.response = responseData
      throw error
    }
  }

  // 如果后端直接返回数据（HTTP 200 且没有 code 字段）
  return responseData as T
}

/**
 * 通用请求方法
 */
async function request<T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> {
  const { timeout = API_TIMEOUT, showError = true, ...fetchConfig } = config

  try {
    // 请求拦截
    const interceptedConfig = requestInterceptor(fetchConfig)

    // 构建完整 URL
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`

    // 创建请求 Promise 和超时 Promise
    const requestPromise = fetch(fullUrl, interceptedConfig)
    const timeoutPromise = createTimeoutPromise(timeout)

    // 执行请求（带超时控制）
    const response = await Promise.race([requestPromise, timeoutPromise])

    // 响应拦截
    return await responseInterceptor<T>(response as Response)
  } catch (error: any) {
    // 错误处理
    const errorMessage = error.message || '网络请求失败'

    if (showError) {
      console.error('API 请求错误:', errorMessage)
      // 这里可以集成消息提示组件，如 DevUI 的 Toast
      // Toast.open({ type: 'error', content: errorMessage })
    }

    throw error
  }
}

/**
 * GET 请求
 */
export function get<T = any>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'GET'
  })
}

/**
 * POST 请求
 */
export function post<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined
  })
}

/**
 * PUT 请求
 */
export function put<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined
  })
}

/**
 * DELETE 请求
 */
export function del<T = any>(url: string, config?: RequestConfig): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'DELETE'
  })
}

/**
 * PATCH 请求
 */
export function patch<T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> {
  return request<T>(url, {
    ...config,
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined
  })
}

/**
 * 文件上传
 */
export function upload(
  url: string,
  file: File | FormData,
  config?: RequestConfig
): Promise<any> {
  const formData = file instanceof FormData ? file : (() => {
    const fd = new FormData()
    fd.append('file', file)
    return fd
  })()

  const token = getAuthToken()
  const headers = new Headers()

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  // 不设置 Content-Type，让浏览器自动设置（包含 boundary）

  return request(url, {
    ...config,
    method: 'POST',
    headers,
    body: formData
  })
}

export default {
  get,
  post,
  put,
  del,
  delete: del,
  patch,
  upload
}

