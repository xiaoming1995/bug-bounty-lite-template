<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './Public/Header.vue'

// 文章详情类型
interface ArticleDetail {
  id: number
  title: string
  content: string
  author: string
  avatar?: string
  views: number
  likes: number
  publishDate: string
  category: string
}

// 评论类型
interface Comment {
  id: number
  author: string
  content: string
  date: string
  likes: number
}

const route = useRoute()
const router = useRouter()
const loading = ref(true)

// 文章详情
const article = ref<ArticleDetail | null>(null)

// 点赞状态
const liked = ref(false)

// 评论列表
const comments = ref<Comment[]>([
  { id: 1, author: '安全小白', content: '写得非常详细，对新手很友好！', date: '2026-01-06', likes: 12 },
  { id: 2, author: '渗透测试员', content: '实战案例很有价值，已收藏。', date: '2026-01-05', likes: 8 },
  { id: 3, author: '学习者', content: '感谢分享，期待更多教程。', date: '2026-01-04', likes: 5 }
])

// 新评论内容
const newComment = ref('')
const submittingComment = ref(false)

// 加载文章详情
const loadArticle = async (id: string) => {
  loading.value = true
  
  await new Promise(resolve => setTimeout(resolve, 500))
  
  article.value = {
    id: parseInt(id),
    title: 'Web安全入门：SQL注入攻击原理与防护',
    content: `
## 什么是SQL注入？

SQL注入（SQL Injection）是一种常见的Web安全漏洞，攻击者通过在用户输入中插入恶意SQL代码，从而操纵后端数据库执行非预期的操作。

## 攻击原理

当应用程序直接将用户输入拼接到SQL查询语句中，而没有进行适当的过滤或转义时，就可能产生SQL注入漏洞。

\`\`\`sql
-- 正常查询
SELECT * FROM users WHERE username = 'admin' AND password = '123456'

-- 注入攻击
SELECT * FROM users WHERE username = 'admin' OR '1'='1' -- ' AND password = ''
\`\`\`

## 常见攻击类型

### 1. 联合查询注入（Union-based）

通过UNION语句将恶意查询结果合并到正常查询结果中。

### 2. 报错注入（Error-based）

利用数据库的报错信息来获取敏感数据。

### 3. 盲注（Blind SQL Injection）

当页面不显示查询结果或错误信息时，通过条件判断来逐步推断数据。

## 防护措施

### 1. 参数化查询

使用预编译语句（Prepared Statements）是最有效的防护方法。

\`\`\`python
# 不安全的写法
cursor.execute("SELECT * FROM users WHERE id = " + user_id)

# 安全的写法
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
\`\`\`

### 2. 输入验证

对用户输入进行严格的类型和格式验证。

### 3. 最小权限原则

数据库账户应只拥有必要的最小权限。

### 4. Web应用防火墙（WAF）

部署WAF可以检测和阻止常见的SQL注入攻击。

## 总结

SQL注入是一种历史悠久但仍然常见的漏洞类型。开发者应始终对用户输入保持警惕，采用安全的编程实践来防止此类攻击。
    `,
    author: '安全小白',
    views: 3256,
    likes: 128,
    publishDate: '2026-01-05',
    category: 'Web安全'
  }
  
  loading.value = false
}

// 返回列表
const goBack = () => {
  router.push('/learning-center')
}

// 点赞
const toggleLike = () => {
  if (!article.value) return
  
  if (liked.value) {
    article.value.likes--
  } else {
    article.value.likes++
  }
  liked.value = !liked.value
}

// 提交评论
const submitComment = () => {
  if (!newComment.value.trim()) return
  
  submittingComment.value = true
  
  setTimeout(() => {
    comments.value.unshift({
      id: Date.now(),
      author: '当前用户',
      content: newComment.value,
      date: new Date().toISOString().split('T')[0],
      likes: 0
    })
    newComment.value = ''
    submittingComment.value = false
  }, 500)
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 格式化浏览量
const formatNumber = (num: number) => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadArticle(id)
  }
})
</script>

<template>
  <Header />
  <div class="article-detail-page">
    <div class="page-content">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <button class="back-btn" @click="goBack">
          <d-icon name="arrow-left" />
          <span>返回学习中心</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <d-icon name="loading" size="32px" />
        <span>加载中...</span>
      </div>

      <!-- 文章详情 -->
      <template v-else-if="article">
        <article class="article-container">
          <!-- 文章头部 -->
          <header class="article-header">
            <span class="category">{{ article.category }}</span>
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <div class="author-info">
                <div class="author-avatar">
                  <d-icon name="user" size="16px" />
                </div>
                <span class="author-name">{{ article.author }}</span>
              </div>
              <span class="divider">·</span>
              <span class="date">{{ formatDate(article.publishDate) }}</span>
              <span class="divider">·</span>
              <span class="views">
                <d-icon name="preview" />
                {{ formatNumber(article.views) }} 阅读
              </span>
            </div>
          </header>

          <!-- 文章内容 -->
          <div class="article-content" v-html="article.content.replace(/\n/g, '<br>')"></div>

          <!-- 互动区域 -->
          <div class="interaction-bar">
            <button class="like-btn" :class="{ liked }" @click="toggleLike">
              <svg v-if="!liked" class="like-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <svg v-else class="like-icon filled" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{{ liked ? '已点赞' : '点赞' }}</span>
              <span class="like-count">{{ formatNumber(article.likes) }}</span>
            </button>
            <span class="comment-count">
              <d-icon name="message" />
              {{ comments.length }} 评论
            </span>
          </div>
        </article>

        <!-- 评论区 -->
        <section class="comments-section">
          <h3 class="section-title">评论 ({{ comments.length }})</h3>
          
          <!-- 发表评论 -->
          <div class="comment-form">
            <textarea 
              v-model="newComment"
              placeholder="写下你的评论..."
              rows="3"
            ></textarea>
            <button 
              class="submit-btn" 
              :disabled="!newComment.trim() || submittingComment"
              @click="submitComment"
            >
              {{ submittingComment ? '发布中...' : '发表评论' }}
            </button>
          </div>

          <!-- 评论列表 -->
          <div class="comments-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                <d-icon name="user" size="16px" />
              </div>
              <div class="comment-body">
                <div class="comment-header">
                  <span class="comment-author">{{ comment.author }}</span>
                  <span class="comment-date">{{ formatDate(comment.date) }}</span>
                </div>
                <p class="comment-content">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f4fc 50%, #f5f0ff 100%);
  padding-bottom: 60px;
}

.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;
}

.back-nav {
  margin-bottom: 20px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #fff;
  border: none;
  outline: none;
  color: #5e7ce0;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.2s ease;
  
  &:hover {
    background: #f8fafc;
    box-shadow: 0 4px 12px rgba(94, 124, 224, 0.15);
    transform: translateX(-2px);
  }
  
  &:focus {
    outline: none;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120px 0;
  gap: 16px;
  color: #64748b;
}

.article-container {
  background: #fff;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 24px;
}

.article-header {
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  
  .category {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(94, 124, 224, 0.1);
    color: #5e7ce0;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
  }
}

.article-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin: 0 0 20px 0;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  .divider {
    color: #cbd5e1;
  }
  
  .date, .views {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 14px;
    color: #64748b;
  }
}

.author-info {
  display: flex;
  align-items: center;
  gap: 8px;
  
  .author-avatar {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5e7ce0;
  }
  
  .author-name {
    font-size: 14px;
    color: #334155;
    font-weight: 500;
  }
}

.article-content {
  font-size: 16px;
  line-height: 1.9;
  color: #334155;
  
  :deep(h2) {
    font-size: 22px;
    font-weight: 700;
    color: #1e293b;
    margin: 32px 0 16px 0;
  }
  
  :deep(h3) {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 24px 0 12px 0;
  }
  
  :deep(p) {
    margin: 0 0 16px 0;
  }
  
  :deep(code) {
    background: #f1f5f9;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'Monaco', 'Consolas', monospace;
    font-size: 14px;
    color: #e11d48;
  }
  
  :deep(pre) {
    background: #1e293b;
    padding: 16px 20px;
    border-radius: 12px;
    overflow-x: auto;
    margin: 16px 0;
    
    code {
      background: transparent;
      color: #e2e8f0;
      padding: 0;
    }
  }
}

.interaction-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: #f8fafc;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  outline: none;
  
  &:hover {
    background: #f1f5f9;
  }
  
  &.liked {
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }
  
  &:focus {
    outline: none;
  }
  
  .like-count {
    padding-left: 8px;
    border-left: 1px solid #e2e8f0;
    color: #94a3b8;
  }
  
  &.liked .like-count {
    border-left-color: rgba(239, 68, 68, 0.2);
    color: #ef4444;
  }
  
  .like-icon {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
    
    &.filled {
      animation: heartPop 0.3s ease;
    }
  }
}

@keyframes heartPop {
  0% { transform: scale(0.8); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.comment-count {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #64748b;
}

.comments-section {
  background: #fff;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.comment-form {
  margin-bottom: 32px;
  
  textarea {
    width: 100%;
    padding: 16px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 14px;
    resize: none;
    outline: none;
    font-family: inherit;
    transition: border-color 0.2s;
    
    &:focus {
      border-color: #5e7ce0;
    }
    
    &::placeholder {
      color: #94a3b8;
    }
  }
  
  .submit-btn {
    margin-top: 12px;
    padding: 12px 24px;
    background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
    color: #fff;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
    
    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(94, 124, 224, 0.3);
    }
    
    &:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }
    
    &:focus {
      outline: none;
    }
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.comment-avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5e7ce0;
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
  
  .comment-author {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }
  
  .comment-date {
    font-size: 12px;
    color: #94a3b8;
  }
}

.comment-content {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
  margin: 0 0 10px 0;
}

.comment-actions {
  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 10px;
    background: transparent;
    border: none;
    border-radius: 6px;
    font-size: 12px;
    color: #94a3b8;
    cursor: pointer;
    transition: all 0.2s;
    outline: none;
    
    &:hover {
      background: #f1f5f9;
      color: #64748b;
    }
    
    &:focus {
      outline: none;
    }
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 16px;
  }
  
  .article-container {
    padding: 24px;
  }
  
  .article-title {
    font-size: 22px;
  }
  
  .comments-section {
    padding: 20px;
  }
}
</style>
