<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from 'vue-devui'
import Header from './Public/Header.vue'
import { getMyArticles, deleteArticle, type Article } from '@/api/article'

interface UserArticle {
  id: number
  title: string
  publishDate: string
  likes: number
  views: number
  status: 'pending' | 'approved' | 'rejected'
  statusName: string
  rejectReason?: string
}

const router = useRouter()
const loading = ref(true)

// 分页配置
const pagination = ref({
  current: 1,
  pageSize: 10,
})

// 用户发布的文章数据
const myArticles = ref<UserArticle[]>([])

// 获取文章列表
const fetchArticles = async () => {
  loading.value = true
  try {
    const articles = await getMyArticles()
    myArticles.value = articles.map((a: Article) => ({
      id: a.id,
      title: a.title,
      publishDate: new Date(a.created_at).toLocaleString(),
      likes: a.likes,
      views: a.views,
      status: a.status,
      statusName: a.status === 'approved' ? '已发布' : a.status === 'pending' ? '审核中' : '被驳回',
      rejectReason: a.reject_reason
    }))
  } catch (error) {
    console.error('获取文章列表失败:', error)
    Message.error('获取文章列表失败')
  } finally {
    loading.value = false
  }
}

// 分页后的文章列表
const paginatedArticles = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return myArticles.value.slice(start, end)
})

// 总条数
const total = computed(() => myArticles.value.length)

// 页码变化
const handlePageChange = (page: number) => {
  pagination.value.current = page
}

// 每页条数变化
const handlePageSizeChange = (size: number) => {
  pagination.value.pageSize = size
  pagination.value.current = 1 // 重置到第一页
}

// 每页条数选项
const pageSizeOptions = [5, 10, 20, 50]


const getStatusType = (status: string) => {
  switch (status) {
    case 'approved': return 'success'
    case 'pending': return 'warning'
    case 'rejected': return 'danger'
    default: return 'info'
  }
}

const handleEdit = (article: UserArticle) => {
  if (article.status === 'approved') return
  router.push(`/post-article/${article.id}`)
}

const handleViewDetail = (article: UserArticle) => {
  if (article.status !== 'approved') return
  router.push(`/learning-center/${article.id}`)
}

const showDeleteConfirm = ref(false)
const articleToDelete = ref<UserArticle | null>(null)

const confirmDelete = (article: UserArticle) => {
  if (article.status === 'approved') return
  articleToDelete.value = article
  showDeleteConfirm.value = true
}

const handleDelete = async () => {
  if (articleToDelete.value) {
    try {
      await deleteArticle(articleToDelete.value.id)
      myArticles.value = myArticles.value.filter(a => a.id !== articleToDelete.value!.id)
      Message.success('文章删除成功')
    } catch (error: any) {
      console.error('删除文章失败:', error)
      Message.error(error.message || '删除文章失败')
    } finally {
      showDeleteConfirm.value = false
      articleToDelete.value = null
    }
  }
}

onMounted(() => {
  fetchArticles()
})
</script>

<template>
  <Header />
  <div class="article-management-page">
    <div class="management-container">
      <div class="page-header">
        <div class="header-left">
          <h2>文章管理</h2>
          <p class="subtitle">管理并追踪您发布的每一篇技术文章</p>
        </div>
      </div>

      <div class="table-card">
        <div v-if="loading" class="loading-state">
          <d-icon name="loading" size="32px" />
          <span>正在拼命加载中...</span>
        </div>
        
        <div v-else-if="myArticles.length === 0" class="empty-state">
          <d-empty mode="data" title="暂无文章" description="您还没有发布过任何文章，快去开启您的技术分享之旅吧！" />
        </div>

        <div v-else class="article-list">
          <div class="list-header">
            <div class="col-main">文章标题</div>
            <div class="col-stats">状态与数据</div>
            <div class="col-date">发布时间</div>
            <div class="col-actions">操作</div>
          </div>
          
          <div v-for="article in paginatedArticles" :key="article.id" class="article-item">
            <div class="col-main">
              <h3 class="title">{{ article.title }}</h3>
              <div v-if="article.status === 'rejected'" class="reject-tip">
                <d-icon name="error-o" size="12px" />
                驳回原因：{{ article.rejectReason }}
              </div>
            </div>
            
            <div class="col-stats">
              <div class="status-wrap">
                <d-tag :type="getStatusType(article.status)" size="sm">{{ article.statusName }}</d-tag>
              </div>
              <div class="stats-data">
                <span title="浏览量"><d-icon name="preview" /> {{ article.views }}</span>
                <span title="点赞量"><d-icon name="like" /> {{ article.likes }}</span>
              </div>
            </div>
            
            <div class="col-date">{{ article.publishDate }}</div>
            
            <div class="col-actions">
              <button 
                v-if="article.status === 'approved'"
                class="action-btn view" 
                @click="handleViewDetail(article)"
                title="查看详情"
              >
                <d-icon name="preview" />
              </button>
              <button 
                v-if="article.status !== 'approved'"
                class="action-btn edit" 
                @click="handleEdit(article)"
                title="编辑"
              >
                <d-icon name="edit" />
              </button>
              <button 
                v-if="article.status !== 'approved'"
                class="action-btn delete" 
                @click="confirmDelete(article)"
                title="删除"
              >
                <d-icon name="delete" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="total > 0" class="pagination-wrapper">
          <div class="total-info">共 {{ total }} 条</div>
          <d-pagination
            v-model:pageIndex="pagination.current"
            v-model:pageSize="pagination.pageSize"
            :total="total"
            :page-sizes="pageSizeOptions"
            :can-change-page-size="true"
            :show-total="false"
          />
        </div>
      </div>
    </div>

    <!-- 删除确认弹窗 -->
    <d-modal v-model="showDeleteConfirm" :show-close="false" width="400px">
      <div class="delete-confirm-content">
        <div class="confirm-icon">
          <d-icon name="warning-o" color="#ef4444" size="32px" />
        </div>
        <h3>确认删除？</h3>
        <p>文章删除后将无法找回，确定要删除《{{ articleToDelete?.title }}》吗？</p>
        <div class="confirm-footer">
          <button class="btn-cancel" @click="showDeleteConfirm = false">取消</button>
          <button class="btn-confirm" @click="handleDelete">确认删除</button>
        </div>
      </div>
    </d-modal>
  </div>
</template>

<style scoped lang="scss">
.article-management-page {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
  padding: 32px 24px;
}

.management-container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  h2 {
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 4px 0;
  }
  .subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
  }

  .create-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #5e7ce0;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background: #4a66cc;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(94, 124, 224, 0.2);
    }
  }
}

.table-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  min-height: 400px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;
  color: #64748b;
  gap: 16px;
}

.article-list {
  .list-header {
    display: flex;
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
    color: #64748b;
    font-size: 14px;
    font-weight: 600;
  }

  .article-item {
    display: flex;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    transition: background 0.2s;
    &:last-child { border-bottom: none; }
    &:hover { background: #fbfcfe; }
  }

  .col-main { flex: 1; padding-right: 20px; }
  .col-stats { width: 180px; }
  .col-date { width: 160px; color: #64748b; font-size: 13px; }
  .col-actions { width: 100px; display: flex; gap: 8px; justify-content: flex-end; }

  .title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 6px 0;
    line-height: 1.5;
  }

  .reject-tip {
    font-size: 12px;
    color: #ef4444;
    display: flex;
    align-items: center;
    gap: 4px;
    background: #fef2f2;
    padding: 4px 8px;
    border-radius: 4px;
    display: inline-flex;
  }

  .stats-data {
    display: flex;
    gap: 12px;
    margin-top: 8px;
    font-size: 12px;
    color: #94a3b8;
    span { display: flex; align-items: center; gap: 4px; }
  }

  .action-btn {
    width: 34px;
    height: 34px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.2s;
    outline: none;

    &:hover:not(:disabled) {
      background: #f1f5f9;
      color: #3b82f6;
    }

    &.delete:hover:not(:disabled) {
      color: #ef4444;
    }

    &.view:hover {
      color: #5e7ce0;
      background: rgba(94, 124, 224, 0.05);
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
      background: #f8fafc;
    }
  }
}

// 删除弹窗样式
.delete-confirm-content {
  padding: 32px 24px;
  text-align: center;
  .confirm-icon { margin-bottom: 16px; }
  h3 { font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; }
  p { font-size: 14px; color: #64748b; margin: 0 0 32px 0; line-height: 1.6; }
  
  .confirm-footer {
    display: flex;
    gap: 12px;
    button {
      flex: 1;
      height: 40px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel {
      background: #f1f5f9;
      border: none;
      color: #475569;
      &:hover { background: #e2e8f0; }
    }
    .btn-confirm {
      background: #ef4444;
      border: none;
      color: #fff;
      &:hover { background: #dc2626; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2); }
    }
  }
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-top: 1px solid #f1f5f9;
  
  .total-info {
    font-size: 14px;
    color: #64748b;
  }
}
</style>
