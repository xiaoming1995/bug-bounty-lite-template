// src/api/auth.ts
import { post, get } from '@/utils/request'
import { AUTH_API } from './config'

/**
 * 登录响应接口
 */
export interface LoginResponse {
  token: string
  refreshToken?: string
  expiresIn?: number
  user: {
    id: number
    username: string
    email?: string
    avatar?: string
    role?: string
    name?: string
  }
}

/**
 * 登录请求参数
 */
export interface LoginCredentials {
  username: string
  password: string
  remember?: boolean
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number
  username: string
  email?: string
  avatar?: string
  role?: string
  name?: string
  phone?: string
  createdAt?: string
}

/**
 * 登录接口
 * @param credentials 登录凭证
 * @returns 登录响应数据
 */
export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  try {
    const response = await post<LoginResponse>(AUTH_API.LOGIN, credentials)
    return response
  } catch (error: any) {
    // 统一错误处理
    const errorMessage = error.message || '登录失败，请检查用户名和密码'
    throw new Error(errorMessage)
  }
}

/**
 * 登出接口
 */
export const logout = async (): Promise<void> => {
  try {
    await post(AUTH_API.LOGOUT)
  } catch (error) {
    // 即使登出失败，也清除本地 token
    console.error('登出失败:', error)
  } finally {
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('user_info')
  }
}

/**
 * 刷新 token
 */
export const refreshToken = async (refreshToken: string): Promise<LoginResponse> => {
  return await post<LoginResponse>(AUTH_API.REFRESH_TOKEN, { refreshToken })
}

/**
 * 获取当前用户信息
 */
export const getUserInfo = async (): Promise<UserInfo> => {
  return await get<UserInfo>(AUTH_API.GET_USER_INFO)
}

/**
 * 忘记密码
 */
export const forgotPassword = async (email: string): Promise<void> => {
  return await post(AUTH_API.FORGOT_PASSWORD, { email })
}

/**
 * 重置密码
 */
export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<void> => {
  return await post(AUTH_API.RESET_PASSWORD, {
    token,
    newPassword
  })
}

/**
 * 注册接口（如果后端支持）
 */
export const register = async (data: {
  username: string
  email: string
  password: string
  confirmPassword?: string
}): Promise<LoginResponse> => {
  return await post<LoginResponse>(AUTH_API.REGISTER, data)
}
