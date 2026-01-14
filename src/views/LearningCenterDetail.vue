<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './Public/Header.vue'
import { getArticle, getFeaturedArticles, getHotArticles, toggleLike as apiToggleLike, getLikeStatus, getComments, addComment, type Article, type ArticleComment } from '@/api/article'

// 页面数据类型
interface DisplayArticle {
  id: number
  title: string
  content: string
  author: string
  avatar?: string
  isAdmin?: boolean
  views: number
  likes: number
  publishDate: string
  category: string
}


const route = useRoute()
const router = useRouter()
const loading = ref(true)

// 文章详情
const article = ref<DisplayArticle | null>(null)

// 点赞状态
const liked = ref(false)
const likeCount = ref(0)
const isLiking = ref(false)

// 评论列表
const comments = ref<ArticleComment[]>([])

// 新评论内容
const newComment = ref('')
const submittingComment = ref(false)

// 推荐文章类型（与首页一致）
interface RecommendArticle {
  id: number
  title: string
  views: number
  author?: string
}

// 热门推荐
const hotArticles = ref<RecommendArticle[]>([])

// 精选推荐
const featuredArticles = ref<RecommendArticle[]>([])

// 查看文章详情
const viewArticle = (id: number) => {
  router.push(`/learning-center/${id}`)
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

// 将 API 返回的文章转换为显示格式
const transformArticle = (data: Article): DisplayArticle => ({
  id: data.id,
  title: data.title,
  content: data.content,
  author: data.author?.name || data.author?.username || (data.author_id === 0 ? '管理员' : '匿名'),
  avatar: data.author?.avatar?.url,
  isAdmin: data.author_id === 0,
  views: data.views,
  likes: data.likes,
  publishDate: data.created_at,
  category: data.category || '技术分享'
})

// 将 API 返回的文章转换为推荐格式
const transformRecommend = (data: Article): RecommendArticle => ({
  id: data.id,
  title: data.title,
  views: data.views,
  author: data.author?.name || data.author?.username || (data.author_id === 0 ? '管理员' : '匿名')
})

// 加载文章详情
const loadArticle = async (id: string) => {
  loading.value = true
  
  try {
    // 获取文章详情（增加浏览量）
    const data = await getArticle(parseInt(id), true)
    article.value = transformArticle(data)
  } catch (error) {
    console.error('获取文章详情失败:', error)
    article.value = null
  } finally {
    loading.value = false
  }
  
  // 分开获取推荐列表、点赞状态和评论，不影响主内容显示
  const articleId = parseInt(id)
  
  // 获取推荐列表
  try {
    const [featured, hot] = await Promise.all([
      getFeaturedArticles(3),
      getHotArticles(3)
    ])
    featuredArticles.value = featured.map(transformRecommend)
    hotArticles.value = hot.map(transformRecommend)
  } catch (error) {
    console.error('获取推荐列表失败:', error)
    featuredArticles.value = []
    hotArticles.value = []
  }
  
  // 获取点赞状态
  try {
    const likeStatus = await getLikeStatus(articleId)
    liked.value = likeStatus.liked
    likeCount.value = likeStatus.like_count
  } catch (error) {
    console.error('获取点赞状态失败:', error)
  }
  
  // 获取评论列表
  try {
    comments.value = await getComments(articleId)
  } catch (error) {
    console.error('获取评论列表失败:', error)
    comments.value = []
  }
}

// 返回列表
const goBack = () => {
  router.push('/learning-center')
}

// 点赞
const toggleLike = async () => {
  if (!article.value || isLiking.value) return
  
  isLiking.value = true
  try {
    const result = await apiToggleLike(article.value.id)
    liked.value = result.liked
    likeCount.value = result.like_count
  } catch (error) {
    console.error('点赞失败:', error)
  } finally {
    isLiking.value = false
  }
}

// 提交评论
const submitComment = async () => {
  if (!newComment.value.trim() || !article.value) return
  
  submittingComment.value = true
  
  try {
    await addComment(article.value.id, newComment.value)
    // 重新加载评论列表以获取用户信息
    comments.value = await getComments(article.value.id)
    newComment.value = ''
  } catch (error: any) {
    console.error('评论失败:', error)
    alert(error.response?.data?.error || '评论失败，请先登录')
  } finally {
    submittingComment.value = false
  }
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

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    loadArticle(newId as string)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

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
        <div class="main-layout">
          <!-- 左侧内容 -->
          <div class="article-section">
            <article class="article-container">
              <!-- 文章头部 -->
              <header class="article-header">
                <span class="category">{{ article.category }}</span>
                <h1 class="article-title">{{ article.title }}</h1>
                <div class="article-meta">
                  <div class="author-info">
                    <div class="author-avatar" :class="{ 'admin-avatar': article.isAdmin }">
                      <img v-if="article.avatar" :src="article.avatar" class="avatar-img" alt="头像" />
                      <d-icon v-else-if="article.isAdmin" name="shield" size="16px" />
                      <d-icon v-else name="user" size="16px" />
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
                  <span class="like-count">{{ formatNumber(likeCount) }}</span>
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
                <template v-if="comments.length > 0">
                  <div v-for="comment in comments" :key="comment.id" class="comment-item">
                    <div class="comment-avatar">
                      <img v-if="comment.user?.avatar?.url" :src="comment.user.avatar.url" class="avatar-img" alt="头像" />
                      <d-icon v-else name="user" size="16px" />
                    </div>
                    <div class="comment-body">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.user?.name || comment.user?.username || '匿名用户' }}</span>
                        <span class="comment-date">{{ formatDate(comment.created_at) }}</span>
                      </div>
                      <p class="comment-content">{{ comment.content }}</p>
                    </div>
                  </div>
                </template>
                <div v-else class="empty-comments">暂无评论，来发表第一条评论吧！</div>
              </div>
            </section>
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
                <template v-if="hotArticles.length > 0">
                  <div 
                    v-for="(item, idx) in hotArticles" 
                    :key="item.id"
                    class="recommend-item"
                    @click="viewArticle(item.id)"
                  >
                    <span class="rank" :class="'rank-' + (idx + 1)">{{ idx + 1 }}</span>
                    <span class="title">{{ item.title }}</span>
                  </div>
                </template>
                <div v-else class="empty-tip">暂无热门文章</div>
              </div>
            </div>

            <!-- 精选推荐 -->
            <div class="sidebar-card">
              <h4 class="sidebar-title">
                <d-icon name="star" />
                <span>精选推荐</span>
              </h4>
              <div class="recommend-list">
                <template v-if="featuredArticles.length > 0">
                  <div 
                    v-for="item in featuredArticles" 
                    :key="item.id"
                    class="recommend-item featured"
                    @click="viewArticle(item.id)"
                  >
                    <span class="title">{{ item.title }}</span>
                    <span class="views">{{ formatViews(item.views) }} 阅读</span>
                  </div>
                </template>
                <div v-else class="empty-tip">暂无精选文章</div>
              </div>
            </div>
          </div>
        </div>
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
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

.main-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 24px;
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

.empty-tip {
  font-size: 13px;
  color: #94a3b8;
  text-align: center;
  padding: 16px 0;
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
    overflow: hidden;
    
    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &.admin-avatar {
      background: linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%);
      color: #d97706;
    }
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
  overflow: hidden;
  
  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.empty-comments {
  text-align: center;
  color: #94a3b8;
  padding: 32px 0;
  font-size: 14px;
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

@media (max-width: 1000px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  
  .sidebar {
    display: none; // 在极小屏幕下隐藏推荐位以保证正文阅读体验
  }
}

@media (max-width: 600px) {
  .page-content {
    padding: 16px;
  }
  
  .article-container {
    padding: 20px;
  }
  
  .article-title {
    font-size: 22px;
  }
  
  .comments-section {
    padding: 20px;
  }
}
</style>
