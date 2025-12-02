# 🛡️ 漏洞情报中心 - Bug Bounty Lite

一个企业级安全漏洞管理平台，用于漏洞的收集、管理、分析和报告。类似于百度安全应急响应中心（BSRC）的漏洞提交与管理系统。

## 📌 项目概述

本项目采用 Vue 3 + TypeScript + Vite 现代化技术栈构建，使用华为 DevUI 组件库，提供美观、响应式的用户界面。

## 🔧 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **前端框架** | Vue 3 | 3.5.17 |
| **构建工具** | Vite | 7.0.4 |
| **类型系统** | TypeScript | 5.8.3 |
| **状态管理** | Pinia | 3.0.3 |
| **UI组件库** | Vue DevUI | 1.6.33 |
| **路由管理** | Vue Router | 4.5.1 |
| **富文本编辑器** | @vueup/vue-quill | 1.2.0 |
| **工具库** | @vueuse/core | 13.5.0 |
| **CSS预处理** | Sass | 1.89.2 |

## 📁 项目结构

```
src/
├── api/                    # API接口层
│   └── auth.ts            # 认证相关API（模拟实现）
├── components/             # 可复用组件
│   ├── HelloWorld.vue
│   ├── RichTextEditor.vue # 富文本编辑器组件
│   └── VulnerabilityEditor.vue  # 漏洞编辑器组件
├── router/                 # 路由配置
│   └── index.ts           # 路由定义与守卫
├── stores/                 # Pinia状态管理
│   └── user.ts            # 用户状态管理
├── views/                  # 页面视图
│   ├── auth/
│   │   └── Login.vue      # 登录页
│   ├── Public/
│   │   └── Header.vue     # 公共头部导航
│   ├── Dashboard.vue      # 仪表盘首页
│   ├── Database.vue       # 漏洞库
│   ├── DatabaseDetail.vue # 漏洞详情
│   ├── Submit.vue         # 漏洞提交
│   ├── Message.vue        # 消息中心
│   ├── Analysis.vue       # 漏洞报告
│   ├── CNNVD.vue          # CNNVD动态
│   ├── Settings.vue       # 设置中心
│   └── Userinfo.vue       # 用户信息
├── tests/                  # 测试文件
├── App.vue                # 根组件
├── main.ts                # 入口文件
└── style.css              # 全局样式
```

## 🎯 核心功能模块

### 1. 🔐 用户认证系统
- **登录功能**: 用户名/密码登录，支持"记住我"
- **第三方登录**: 微信、GitHub登录（预留接口）
- **密码重置**: 邮箱重置密码功能
- **主题切换**: 支持亮色/暗色主题

### 2. 📊 仪表盘
- **统计卡片**: 高危/中危/低危漏洞数量统计
- **趋势指标**: 较昨日增减百分比展示
- **漏洞列表**: 待审核漏洞与已审核漏洞列表
- **骨架屏**: 优雅的加载状态展示

### 3. 📚 漏洞库
- **数据表格**: 漏洞信息表格展示
- **多维筛选**: 按风险类型、产品、等级筛选
- **搜索功能**: 关键词搜索
- **批量操作**: 批量导出、删除
- **分页控制**: 分页显示

### 4. 📝 漏洞提交
- **完整表单**: 项目名称、漏洞类型、危害等级、详情描述等
- **富文本编辑**: 支持富文本格式的漏洞描述
- **附件上传**: 支持多种格式附件上传
- **安全须知**: 右侧提示栏展示评判标准

### 5. 💬 消息中心
- **消息分类**: 全部/未读/星标/系统/安全/漏洞
- **优先级标识**: 高/中/低优先级区分
- **批量管理**: 批量标记已读、添加星标、删除
- **实时统计**: 各类别消息数量统计

### 6. 📈 漏洞报告
- **炫酷横幅**: 代码背景 + 3D立方体动画
- **报告类型**: 周报/月报切换
- **报告列表**: 期数、时间、摘要、阅读量
- **侧边栏**: 最新报告、报告统计

## 🛣️ 路由配置

| 路径 | 名称 | 页面 | 说明 |
|------|------|------|------|
| `/login` | Login | Login.vue | 登录页 |
| `/` | Home | Dashboard.vue | 仪表盘首页 |
| `/database` | database | Database.vue | 漏洞库 |
| `/database/detail/:id` | database-detail | DatabaseDetail.vue | 漏洞详情 |
| `/submit` | submit | Submit.vue | 漏洞提交 |
| `/message` | message | Message.vue | 消息中心 |
| `/analysis` | analysis | Analysis.vue | 漏洞报告 |
| `/cnnvd` | cnnvd | CNNVD.vue | CNNVD动态 |
| `/settings` | settings | Settings.vue | 设置中心 |
| `/userinfo` | userinfo | Userinfo.vue | 用户信息 |

## 🚀 快速启动

```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🔑 测试账号

| 用户名 | 密码 | 角色 |
|--------|------|------|
| admin | 123456 | 管理员 |
| user | 123456 | 普通用户 |
| test@example.com | 123456 | 测试用户 |

## 🎨 UI/UX 特点

### 设计风格
- **主色调**: DevUI 蓝色系 (`#5e7ce0`)
- **现代化**: 圆角卡片、阴影层次、渐变背景
- **动效丰富**: 骨架屏加载、过渡动画、悬浮效果

### 响应式设计
- 支持桌面端、平板、移动端自适应
- 关键断点：`1024px`、`768px`、`640px`、`480px`

## 📋 项目状态

### ✅ 已实现
- [x] 登录认证流程（含模拟API）
- [x] 仪表盘数据展示
- [x] 漏洞库表格管理
- [x] 漏洞提交表单
- [x] 消息中心功能
- [x] 漏洞报告页面
- [x] 路由守卫与权限控制
- [x] 响应式布局

### ⏳ 待完善
- [ ] 真实后端API对接
- [ ] 注册功能
- [ ] 漏洞详情页完善
- [ ] 第三方登录实现
- [ ] 404页面
- [ ] 单元测试覆盖

## 🔐 状态管理 (Pinia)

```typescript
// user.ts - 用户状态管理
- state: token, userInfo
- getters: isAuthenticated
- actions: login(), clearAuth()
```

## 📄 License

MIT License

---

> 本项目适合作为安全团队的漏洞收集与管理系统的前端模板。
