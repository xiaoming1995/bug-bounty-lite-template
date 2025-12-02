// src/api/auth.ts
interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    avatar: string
  }
}

export const login = (
  credentials: { username: string; password: string }
): Promise<LoginResponse> => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      if (credentials.username === 'admin' && credentials.password === '123456') {
        resolve({
          token: 'mock-jwt-token-' + Math.random().toString(36).slice(2),
          user: {
            id: 1,
            username: credentials.username,
            avatar: 'https://i.pravatar.cc/150?img=3'
          }
        })
      } else {
        reject(new Error('Invalid credentials: 使用 admin/123456 登录'))
      }
    }, 800) // 800ms 延迟
  })
}

export const logout = (): Promise<void> => {
  return Promise.resolve()
}
