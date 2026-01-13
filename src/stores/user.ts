// src/stores/user.ts
import { defineStore } from 'pinia'
import { login, refreshToken as refreshTokenApi } from '@/api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    async login(credentials: { username: string; password: string }) {
      try {
        const data = await login(credentials)

        // 确保返回的数据有效
        if (!data || !data.token) {
          throw new Error('登录失败：服务器返回数据无效')
        }

        this.token = data.token
        this.userInfo = data.user

        // 保存 token 和用户信息到 localStorage
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.user))

        // 如果有 refreshToken，也保存
        if (data.refreshToken) {
          localStorage.setItem('refreshToken', data.refreshToken)
        }

        // 如果有过期时间，保存过期时间戳
        if (data.expiresIn) {
          const expiresAt = Date.now() + data.expiresIn * 1000
          localStorage.setItem('tokenExpiresAt', expiresAt.toString())
        }

        return true
      } catch (error: any) {
        // 清除认证信息
        this.clearAuth()

        // 如果是非200状态码，抛出错误（不跳转，由调用方处理）
        if (error.status && error.status !== 200) {
          throw error
        }

        // 其他错误也抛出
        throw error
      }
    },

    clearAuth() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('user_info')
      localStorage.removeItem('tokenExpiresAt')
    },

    /**
     * 更新用户头像
     */
    updateAvatar(avatarUrl: string, avatarId?: number) {
      if (this.userInfo) {
        this.userInfo = {
          ...this.userInfo,
          avatar: avatarUrl,
          avatar_id: avatarId
        }
        localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      }
    },

    /**
     * 检查 token 是否过期
     */
    isTokenExpired(): boolean {
      const expiresAt = localStorage.getItem('tokenExpiresAt')
      if (!expiresAt) return false // 如果没有过期时间，认为未过期
      return Date.now() >= parseInt(expiresAt)
    },

    /**
     * 刷新 token（如果需要）
     */
    async refreshTokenIfNeeded() {
      if (this.isTokenExpired() && localStorage.getItem('refreshToken')) {
        try {
          // 使用静态导入的 refreshTokenApi
          const refreshToken = localStorage.getItem('refreshToken')
          if (refreshToken) {
            const data = await refreshTokenApi(refreshToken)
            this.token = data.token
            localStorage.setItem('token', data.token)
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken)
            }
            return true
          }
        } catch (error) {
          console.error('刷新 token 失败:', error)
          this.clearAuth()
          return false
        }
      }
      return true
    }
  }
})
