// src/stores/user.ts
import { defineStore } from 'pinia'
import { login } from '@/api/auth'

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
        this.token = data.token
        this.userInfo = data.user
        localStorage.setItem('token', data.token)
        localStorage.setItem('userInfo', JSON.stringify(data.user))
        return true
      } catch (error) {
        this.clearAuth()
        throw error
      }
    },

    clearAuth() {
      this.token = null
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})
