# API 对接说明文档

## 📋 概述

项目已完成 API 对接的基础架构，包括 HTTP 客户端封装、API 配置和认证流程。

## 🚀 快速开始

### 1. 配置环境变量

复制 `.env.example` 文件为 `.env`，并配置你的 API 地址：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 2. 后端 API 要求

#### 登录接口

**请求：**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "123456"
}
```

**响应：**
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "expiresIn": 7200,
    "user": {
      "id": 1,
      "username": "admin",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.jpg",
      "role": "admin",
      "name": "管理员"
    }
  }
}
```

**错误响应：**
```json
{
  "code": 401,
  "message": "用户名或密码错误",
  "data": null
}
```

#### 其他接口

所有需要认证的接口都需要在请求头中携带 token：

```http
Authorization: Bearer {token}
```

## 📁 文件结构

```
src/
├── api/
│   ├── auth.ts          # 认证相关 API
│   └── config.ts        # API 端点配置
├── utils/
│   └── request.ts       # HTTP 请求封装
└── stores/
    └── user.ts          # 用户状态管理
```

## 🔧 使用方式

### 在组件中使用 API

```typescript
import { login, getUserInfo } from '@/api/auth'

// 登录
const handleLogin = async () => {
  try {
    const response = await login({
      username: 'admin',
      password: '123456'
    })
    console.log('登录成功:', response)
  } catch (error) {
    console.error('登录失败:', error)
  }
}
```

### 使用 Pinia Store

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

// 登录
await userStore.login({ username: 'admin', password: '123456' })

// 获取用户信息
console.log(userStore.userInfo)

// 检查是否已登录
console.log(userStore.isAuthenticated)

// 登出
userStore.clearAuth()
```

### 自定义请求

```typescript
import { get, post, put, del } from '@/utils/request'

// GET 请求
const data = await get('/vulnerabilities')

// POST 请求
const result = await post('/vulnerabilities', {
  title: '漏洞标题',
  description: '漏洞描述'
})

// PUT 请求
await put('/vulnerabilities/1', { status: 'fixed' })

// DELETE 请求
await del('/vulnerabilities/1')
```

## 🔐 认证流程

1. **登录**：调用 `login()` API，获取 token 和用户信息
2. **存储**：token 自动保存到 `localStorage`（key: `token`）
3. **请求拦截**：所有请求自动在 header 中添加 `Authorization: Bearer {token}`
4. **401 处理**：如果 token 过期或无效，自动清除 token 并跳转到登录页
5. **登出**：调用 `logout()` API 并清除本地存储

## ⚙️ 配置说明

### API 基础 URL

在 `.env` 文件中配置：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 请求超时

默认超时时间为 30 秒，可在 `src/utils/request.ts` 中修改：

```typescript
const API_TIMEOUT = 30000 // 30秒
```

### 响应数据格式

支持两种后端响应格式：

**格式1：统一格式（推荐）**
```json
{
  "code": 200,
  "message": "成功",
  "data": { ... }
}
```

**格式2：直接返回数据**
```json
{
  "id": 1,
  "name": "数据"
}
```

## 🛠️ 扩展 API

### 添加新的 API 端点

1. 在 `src/api/config.ts` 中添加端点：

```typescript
export const NEW_API = {
  LIST: '/new-resource',
  DETAIL: (id: string | number) => `/new-resource/${id}`,
  CREATE: '/new-resource'
}
```

2. 在 `src/api/` 目录下创建对应的 API 文件：

```typescript
// src/api/new.ts
import { get, post } from '@/utils/request'
import { NEW_API } from './config'

export const getNewList = () => get(NEW_API.LIST)
export const createNew = (data: any) => post(NEW_API.CREATE, data)
```

## 🐛 常见问题

### 1. CORS 跨域问题

如果遇到跨域问题，需要在后端配置 CORS：

```javascript
// Express 示例
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
```

### 2. Token 过期处理

系统会自动处理 401 错误，清除 token 并跳转登录。如需自定义，可修改 `src/utils/request.ts` 中的 `responseInterceptor`。

### 3. 请求失败不显示错误

默认会显示错误提示，如果不想显示，可以：

```typescript
await get('/api/data', { showError: false })
```

## 📝 注意事项

1. **Token 存储**：统一使用 `localStorage` 的 `token` key
2. **错误处理**：所有 API 错误都会抛出异常，需要使用 try-catch
3. **类型安全**：所有 API 都有 TypeScript 类型定义
4. **环境变量**：`.env` 文件不要提交到 git，使用 `.env.example` 作为模板

## 🔄 从模拟数据迁移

如果之前使用的是模拟数据，现在需要：

1. 配置 `.env` 文件
2. 确保后端 API 符合接口规范
3. 测试登录功能
4. 逐步迁移其他功能模块

## 📚 相关文档

- [Vite 环境变量](https://vitejs.dev/guide/env-and-mode.html)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)

