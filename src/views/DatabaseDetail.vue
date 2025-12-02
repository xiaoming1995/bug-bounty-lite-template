<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './Public/Header.vue'

const route = useRoute()
const router = useRouter()

// 获取路由参数中的ID
const vulnerabilityId = ref(route.params.id as string)

// 漏洞详情数据
const vulnerabilityDetail = ref({
  id: '',
  title: '',
  type: '',
  level: '',
  status: '',
  submitTime: '',
  updateTime: '',
  submitter: '',
  project: '',
  description: '',
  poc: '',
  solution: '',
  attachments: [],
  comments: []
})

// 加载状态
const loading = ref(true)

// 获取漏洞详情
const fetchVulnerabilityDetail = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟数据
    vulnerabilityDetail.value = {
      id: vulnerabilityId.value,
      title: `SQL注入漏洞 - ${vulnerabilityId.value}`,
      type: 'SQL注入',
      level: '高危',
      status: '已确认',
      submitTime: '2024-01-15 10:30:00',
      updateTime: '2024-01-16 14:20:00',
      submitter: '安全研究员',
      project: '百度搜索',
      description: '在用户登录接口发现SQL注入漏洞，攻击者可以通过构造恶意SQL语句获取数据库敏感信息。',
      poc: `
1. 发现方式：
通过对登录接口进行安全测试，发现username参数存在SQL注入漏洞。

2. 漏洞证明：
POST /api/login HTTP/1.1
Content-Type: application/json

{
  "username": "admin' OR '1'='1' --",
  "password": "test"
}

3. 修复方案：
使用参数化查询或预编译语句，对用户输入进行严格过滤和验证。
      `,
      solution: '已修复，使用参数化查询替换字符串拼接SQL语句。',
      attachments: [
        { name: '漏洞截图.png', size: '2.5MB', url: '#' },
        { name: '测试报告.pdf', size: '1.2MB', url: '#' }
      ],
      comments: [
        {
          id: 1,
          author: '安全团队',
          time: '2024-01-16 09:00:00',
          content: '漏洞已确认，正在修复中。'
        },
        {
          id: 2,
          author: '开发团队',
          time: '2024-01-16 14:20:00',
          content: '漏洞已修复，请验证。'
        }
      ]
    }
  } catch (error) {
    console.error('获取漏洞详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 返回列表
const goBack = () => {
  router.push('/database')
}

// 获取危险等级的样式类
const getLevelClass = (level: string) => {
  const levelMap: Record<string, string> = {
    '严重': 'critical',
    '高危': 'high',
    '中危': 'medium',
    '低危': 'low',
    '无危害': 'info'
  }
  return levelMap[level] || 'info'
}

// 获取状态样式类
const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '已确认': 'confirmed',
    '待确认': 'pending',
    '已修复': 'fixed',
    '已关闭': 'closed'
  }
  return statusMap[status] || 'pending'
}

onMounted(() => {
  fetchVulnerabilityDetail()
})
</script>

<template>
  <Header />
  
  <div class="detail-container">
    <div class="detail-content">
      <!-- 头部操作栏 -->
      <div class="detail-header">
        <d-button 
          bs-style="text" 
          @click="goBack"
          class="back-btn"
        >
          ← 返回漏洞库
        </d-button>
        
        <div class="header-actions">
          <d-button bs-style="outline">编辑</d-button>
          <d-button bs-style="primary">导出</d-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <d-loading />
        <p>加载中...</p>
      </div>

      <!-- 漏洞详情内容 -->
      <div v-else class="detail-body">
        <!-- 基本信息卡片 -->
        <div class="info-card">
          <h1 class="vulnerability-title">{{ vulnerabilityDetail.title }}</h1>
          
          <div class="info-grid">
            <div class="info-item">
              <label>漏洞类型:</label>
              <span>{{ vulnerabilityDetail.type }}</span>
            </div>
            <div class="info-item">
              <label>危险等级:</label>
              <span :class="['level-badge', getLevelClass(vulnerabilityDetail.level)]">
                {{ vulnerabilityDetail.level }}
              </span>
            </div>
            <div class="info-item">
              <label>状态:</label>
              <span :class="['status-badge', getStatusClass(vulnerabilityDetail.status)]">
                {{ vulnerabilityDetail.status }}
              </span>
            </div>
            <div class="info-item">
              <label>所属项目:</label>
              <span>{{ vulnerabilityDetail.project }}</span>
            </div>
            <div class="info-item">
              <label>提交者:</label>
              <span>{{ vulnerabilityDetail.submitter }}</span>
            </div>
            <div class="info-item">
              <label>提交时间:</label>
              <span>{{ vulnerabilityDetail.submitTime }}</span>
            </div>
            <div class="info-item">
              <label>更新时间:</label>
              <span>{{ vulnerabilityDetail.updateTime }}</span>
            </div>
          </div>
        </div>

        <!-- 漏洞描述 -->
        <div class="content-card">
          <h3>漏洞描述</h3>
          <p class="description">{{ vulnerabilityDetail.description }}</p>
        </div>

        <!-- 漏洞详情 -->
        <div class="content-card">
          <h3>漏洞详情</h3>
          <div class="poc-content">
            <pre>{{ vulnerabilityDetail.poc }}</pre>
          </div>
        </div>

        <!-- 修复方案 -->
        <div class="content-card">
          <h3>修复方案</h3>
          <p class="solution">{{ vulnerabilityDetail.solution }}</p>
        </div>

        <!-- 附件列表 -->
        <div class="content-card" v-if="vulnerabilityDetail.attachments.length > 0">
          <h3>相关附件</h3>
          <div class="attachments-list">
            <div 
              v-for="attachment in vulnerabilityDetail.attachments" 
              :key="attachment.name"
              class="attachment-item"
            >
              <d-icon name="file" />
              <span class="attachment-name">{{ attachment.name }}</span>
              <span class="attachment-size">{{ attachment.size }}</span>
              <d-button bs-style="text" bs-size="sm">下载</d-button>
            </div>
          </div>
        </div>

        <!-- 评论区域 -->
        <div class="content-card">
          <h3>处理记录</h3>
          <div class="comments-list">
            <div 
              v-for="comment in vulnerabilityDetail.comments" 
              :key="comment.id"
              class="comment-item"
            >
              <div class="comment-header">
                <span class="comment-author">{{ comment.author }}</span>
                <span class="comment-time">{{ comment.time }}</span>
              </div>
              <p class="comment-content">{{ comment.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  .back-btn {
    color: #5e7ce0;
    font-size: 14px;

    &:hover {
      color: #3a8ee6;
    }
  }

  .header-actions {
    display: flex;
    gap: 12px;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;

  p {
    margin-top: 16px;
    color: #666;
    font-size: 14px;
  }
}

.detail-body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card,
.content-card {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vulnerability-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;

  .info-item {
    display: flex;
    align-items: center;

    label {
      font-weight: 500;
      color: #666;
      margin-right: 12px;
      min-width: 80px;
    }

    span {
      color: #333;
    }
  }
}

.level-badge,
.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;

  &.critical {
    background: #fff2f0;
    color: #a8071a;
    border: 1px solid #ffccc7;
  }

  &.high {
    background: #fff7e6;
    color: #ad6800;
    border: 1px solid #ffd591;
  }

  &.medium {
    background: #fffbe6;
    color: #ad8b00;
    border: 1px solid #ffe58f;
  }

  &.low {
    background: #f6ffed;
    color: #389e0d;
    border: 1px solid #b7eb8f;
  }

  &.info {
    background: #f0f5ff;
    color: #1d39c4;
    border: 1px solid #adc6ff;
  }

  &.confirmed {
    background: #fff7e6;
    color: #ad6800;
    border: 1px solid #ffd591;
  }

  &.pending {
    background: #f0f5ff;
    color: #1d39c4;
    border: 1px solid #adc6ff;
  }

  &.fixed {
    background: #f6ffed;
    color: #389e0d;
    border: 1px solid #b7eb8f;
  }

  &.closed {
    background: #f5f5f5;
    color: #666;
    border: 1px solid #d9d9d9;
  }
}

.content-card {
  h3 {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .description,
  .solution {
    line-height: 1.6;
    color: #666;
    margin: 0;
  }

  .poc-content {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 4px;
    padding: 16px;

    pre {
      margin: 0;
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      font-size: 13px;
      line-height: 1.5;
      color: #333;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .attachment-item {
    display: flex;
    align-items: center;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 4px;
    gap: 12px;

    .attachment-name {
      flex: 1;
      color: #333;
      font-weight: 500;
    }

    .attachment-size {
      color: #666;
      font-size: 12px;
    }
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .comment-item {
    padding: 16px;
    background: #f8f9fa;
    border-radius: 4px;
    border-left: 4px solid #5e7ce0;

    .comment-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      .comment-author {
        font-weight: 500;
        color: #333;
      }

      .comment-time {
        font-size: 12px;
        color: #999;
      }
    }

    .comment-content {
      margin: 0;
      line-height: 1.5;
      color: #666;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .detail-container {
    padding: 16px;
  }

  .detail-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;

    .header-actions {
      justify-content: center;
    }
  }

  .info-grid {
    grid-template-columns: 1fr;

    .info-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 4px;

      label {
        min-width: auto;
        margin-right: 0;
      }
    }
  }

  .vulnerability-title {
    font-size: 20px;
  }

  .info-card,
  .content-card {
    padding: 16px;
  }
}
</style>
