<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Public/Header.vue'

// 文章类型
interface Article {
  id: number
  title: string
  description: string
  author: string
  avatar?: string
  views: number
  publishDate: string
  category: string
  cover?: string
  featured?: boolean
  hot?: boolean
}

const router = useRouter()
const loading = ref(true)

// 分页
const pagination = ref({
  page: 1,
  pageSize: 5,
  total: 12
})

// 文章列表（Mock 数据）
const articleList = ref<Article[]>([
  {
    id: 1,
    title: 'Web安全入门：SQL注入攻击原理与防护',
    description: '本文详细介绍SQL注入的基本原理、常见攻击手法以及有效的防护措施，帮助开发者构建更安全的Web应用。',
    author: '安全小白',
    views: 3256,
    publishDate: '2026-01-05',
    category: 'Web安全',
    hot: true
  },
  {
    id: 2,
    title: 'XSS跨站脚本攻击全解析',
    description: '深入浅出讲解反射型、存储型、DOM型XSS的区别与利用方式，以及CSP等现代防护技术。',
    author: '渗透达人',
    views: 2891,
    publishDate: '2026-01-04',
    category: 'Web安全',
    featured: true
  },
  {
    id: 3,
    title: 'Burp Suite实战技巧分享',
    description: '从安装配置到高级用法，手把手教你使用Web安全测试神器Burp Suite进行渗透测试。',
    author: '工具专家',
    views: 4512,
    publishDate: '2026-01-03',
    category: '工具教程',
    hot: true,
    featured: true
  },
  {
    id: 4,
    title: '企业安全体系建设指南',
    description: '结合实际案例，探讨如何从零开始构建企业级安全防护体系，包括组织架构、流程规范等。',
    author: '安全架构师',
    views: 1876,
    publishDate: '2026-01-02',
    category: '安全管理'
  },
  {
    id: 5,
    title: 'CTF入门：从零开始的夺旗之旅',
    description: '为CTF新手准备的入门指南，涵盖Web、Crypto、Pwn等方向的基础知识和练习平台推荐。',
    author: 'CTF爱好者',
    views: 5234,
    publishDate: '2026-01-01',
    category: 'CTF',
    featured: true
  },
  {
    id: 6,
    title: '代码审计：PHP常见漏洞模式',
    description: '总结PHP代码中常见的安全漏洞模式，包括文件包含、命令注入、反序列化等。',
    author: '代码审计员',
    views: 2345,
    publishDate: '2025-12-30',
    category: '代码审计'
  },
  {
    id: 7,
    title: '漏洞赏金猎人生存指南',
    description: '分享参与Bug Bounty项目的经验，如何选择目标、提交高质量报告、与厂商沟通等。',
    author: '赏金猎人',
    views: 3890,
    publishDate: '2025-12-29',
    category: '漏洞挖掘',
    hot: true
  }
])

// 热门推荐
const hotArticles = computed(() => {
  return articleList.value.filter(a => a.hot).slice(0, 3)
})

// 精选推荐
const featuredArticles = computed(() => {
  return articleList.value.filter(a => a.featured).slice(0, 3)
})

// 当前页文章
const currentArticles = computed(() => {
  const start = (pagination.value.page - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return articleList.value.slice(start, end)
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(articleList.value.length / pagination.value.pageSize)
})

// 查看文章详情
const viewArticle = (id: number) => {
  router.push(`/learning-center/${id}`)
}

// 切换页码
const changePage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    pagination.value.page = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 格式化浏览量
const formatViews = (views: number) => {
  if (views >= 10000) {
    return (views / 10000).toFixed(1) + 'w'
  }
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'k'
  }
  return views.toString()
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 400)
})
</script>

<template>
  <Header />
  <div class="learning-center-page">
    <div class="page-content">
      <div class="page-header">
        <div class="page-title">
          <h2>学习中心</h2>
          <span class="subtitle">探索安全知识，提升技术能力</span>
        </div>
      </div>

      <div class="main-layout">
        <!-- 左侧文章列表 -->
        <div class="article-section">
          <!-- 加载状态 -->
          <div v-if="loading" class="loading-state">
            <d-icon name="loading" size="32px" />
            <span>加载中...</span>
          </div>

          <!-- 文章列表 -->
          <div v-else class="article-list">
            <div 
              v-for="article in currentArticles" 
              :key="article.id" 
              class="article-card"
              @click="viewArticle(article.id)"
            >
              <div class="article-content">
                <div class="article-meta">
                  <span class="category">{{ article.category }}</span>
                  <span class="date">{{ formatDate(article.publishDate) }}</span>
                </div>
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-desc">{{ article.description }}</p>
                <div class="article-footer">
                  <div class="author-info">
                    <div class="author-avatar">
                      <d-icon name="user" size="14px" />
                    </div>
                    <span class="author-name">{{ article.author }}</span>
                  </div>
                  <div class="stats">
                    <span class="views">
                      <d-icon name="preview" />
                      {{ formatViews(article.views) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="!loading && totalPages > 1" class="pagination">
            <span class="page-info">
              共 <strong>{{ articleList.length }}</strong> 条，第 <strong>{{ pagination.page }}</strong> / {{ totalPages }} 页
            </span>
            <div class="page-controls">
              <button 
                class="page-btn" 
                :disabled="pagination.page === 1"
                @click="changePage(pagination.page - 1)"
              >
                <d-icon name="arrow-left" />
              </button>
              <div class="page-numbers">
                <button 
                  v-for="p in totalPages" 
                  :key="p"
                  class="page-num"
                  :class="{ active: p === pagination.page }"
                  @click="changePage(p)"
                >
                  {{ p }}
                </button>
              </div>
              <button 
                class="page-btn" 
                :disabled="pagination.page === totalPages"
                @click="changePage(pagination.page + 1)"
              >
                <d-icon name="arrow-right" />
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧推荐栏 -->
        <div class="sidebar">
          <!-- 热门推荐 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <d-icon name="fire" />
              <span>热门推荐</span>
            </h4>
            <div class="recommend-list">
              <div 
                v-for="(article, idx) in hotArticles" 
                :key="article.id"
                class="recommend-item"
                @click="viewArticle(article.id)"
              >
                <span class="rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
                <span class="title">{{ article.title }}</span>
              </div>
            </div>
          </div>

          <!-- 精选推荐 -->
          <div class="sidebar-card">
            <h4 class="sidebar-title">
              <d-icon name="star" />
              <span>精选推荐</span>
            </h4>
            <div class="recommend-list">
              <div 
                v-for="article in featuredArticles" 
                :key="article.id"
                class="recommend-item featured"
                @click="viewArticle(article.id)"
              >
                <span class="title">{{ article.title }}</span>
                <span class="views">{{ formatViews(article.views) }} 阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.learning-center-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f4fc 50%, #f5f0ff 100%);
  padding-bottom: 40px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-header {
  margin-bottom: 24px;
  
  .page-title {
    h2 {
      font-size: 28px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 8px 0;
    }
    
    .subtitle {
      font-size: 14px;
      color: #64748b;
    }
  }
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #64748b;
  background: #fff;
  border-radius: 16px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.article-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  
  &:hover {
    box-shadow: 0 8px 24px rgba(94, 124, 224, 0.12);
    transform: translateY(-2px);
  }
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  
  .category {
    padding: 4px 10px;
    background: rgba(94, 124, 224, 0.1);
    color: #5e7ce0;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }
  
  .date {
    font-size: 12px;
    color: #94a3b8;
  }
}

.article-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 10px 0;
  line-height: 1.5;
  
  &:hover {
    color: #5e7ce0;
  }
}

.article-desc {
  font-size: 14px;
  color: #64748b;
  line-height: 1.7;
  margin: 0 0 16px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .author-avatar {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5e7ce0;
  }
  
  .author-name {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
  }
}

.stats {
  .views {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: #94a3b8;
  }
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
  padding: 16px 24px;
  background: #fff;
  border-radius: 16px;
}

.page-info {
  font-size: 14px;
  color: #64748b;
  
  strong {
    color: #5e7ce0;
    font-weight: 600;
  }
}

.page-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.page-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f1f5f9;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  color: #475569;
  transition: all 0.2s;
  outline: none;
  
  &:hover:not(:disabled) {
    background: #e2e8f0;
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
  }
}

.page-numbers {
  display: flex;
  gap: 8px;
}

.page-num {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  transition: all 0.2s;
  outline: none;
  
  &:hover {
    background: #f1f5f9;
  }
  
  &.active {
    background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
    color: #fff;
  }
  
  &:focus {
    outline: none;
  }
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f5f9;
}

.recommend-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommend-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f8fafc;
  }
  
  .rank {
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    font-size: 12px;
    font-weight: 600;
    flex-shrink: 0;
    background: #f1f5f9;
    color: #64748b;
    
    &.rank-1 {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #fff;
    }
    
    &.rank-2 {
      background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
      color: #fff;
    }
    
    &.rank-3 {
      background: linear-gradient(135deg, #cd7f32 0%, #b87333 100%);
      color: #fff;
    }
  }
  
  .title {
    font-size: 13px;
    color: #334155;
    line-height: 1.5;
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  &.featured {
    flex-direction: column;
    gap: 6px;
    
    .views {
      font-size: 12px;
      color: #94a3b8;
    }
  }
}

@media (max-width: 900px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    order: -1;
    flex-direction: row;
    overflow-x: auto;
    gap: 16px;
    
    .sidebar-card {
      min-width: 280px;
      flex-shrink: 0;
    }
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 16px;
  }
  
  .article-card {
    padding: 16px;
  }
}
</style>
