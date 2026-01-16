<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Header from './Public/Header.vue'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Message } from 'vue-devui'
import { getReportDetail } from '@/api/report'
import { getReportComments, createReportComment, type ReportComment as ApiComment } from '@/api/comment'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()

// 获取路由参数中的ID
const vulnerabilityId = ref(route.params.id as string)

interface Attachment {
  name: string
  size: string
  url: string
}

interface Comment {
  id: number
  author: string
  avatar: string
  role: 'official' | 'researcher'
  time: string
  content: string
}

interface VulnerabilityDetail {
  id: string
  title: string
  type: string
  level: string
  officialLevel: string
  status: string
  submitTime: string
  updateTime: string
  submitter: string
  project: string
  description: string
  poc: string
  solution: string
  attachments: Attachment[]
  comments: Comment[]
}

// 漏洞详情数据
const vulnerabilityDetail = ref<VulnerabilityDetail>({
  id: '',
  title: '',
  type: '',
  level: '',
  officialLevel: '',
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
    const reportId = Number(vulnerabilityId.value)
    if (isNaN(reportId)) {
      Message.error('无效的漏洞ID')
      router.push('/database')
      return
    }

    const data = await getReportDetail(reportId)
    
    // 映射后端数据到前端接口
    vulnerabilityDetail.value = {
      id: String(data.id),
      title: data.vulnerability_name,
      type: data.vulnerability_type?.config_value || '未知类型',
      level: data.self_assessment?.config_value || String(data.self_assessment_id || ''),
      officialLevel: data.severity || '',
      status: data.status,
      submitTime: data.created_at ? new Date(data.created_at).toLocaleString() : '-',
      updateTime: data.updated_at ? new Date(data.updated_at).toLocaleString() : '-',
      submitter: data.author?.name || '安全研究员',
      project: data.project?.name || '未知项目',
      description: data.vulnerability_impact || '暂无描述',
      poc: data.vulnerability_detail || '暂无详情',
      solution: '请查阅漏洞详情获取修复建议',
      attachments: data.attachment_url ? [
        { 
          name: data.attachment_url.split('/').pop() || '附件', 
          size: '-', 
          url: data.attachment_url 
        }
      ] : [],
      comments: []
    }

    // 获取评论列表
    await fetchComments(reportId)
  } catch (error: any) {
    console.error('获取漏洞详情失败:', error)
    Message.error(error.message || '获取漏洞详情失败')
  } finally {
    loading.value = false
  }
}

// 获取评论列表
const fetchComments = async (reportId: number) => {
  try {
    const apiComments = await getReportComments(reportId)
    // 将 API 返回的评论转换为前端格式
    vulnerabilityDetail.value.comments = apiComments.map((c: ApiComment) => ({
      id: c.id,
      author: c.author?.name || c.author?.username || '用户',
      avatar: c.author?.avatar?.url || '',
      role: (c.author?.role === 'admin' ? 'official' : 'researcher') as 'official' | 'researcher',
      time: new Date(c.created_at).toLocaleString(),
      content: c.content
    }))
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

// 返回列表
const goBack = () => {
  router.push('/database')
}

// 获取等级颜色
const getSeverityColor = (severity: string | number | undefined) => {
  if (severity === undefined || severity === null || severity === '' || severity === '未评估') return 'info';
  
  const s = String(severity);
  const severityNormalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  
  const map: Record<string, string> = {
    'Critical': 'danger',  '1': 'danger', '严重': 'danger',
    'High': 'warning',      '2': 'warning', '高危': 'warning',
    'Medium': 'medium',     '3': 'medium', '中危': 'medium',
    'Low': 'success',       '4': 'success', '低危': 'success',
    'None': 'success',      '5': 'success', '无危害': 'success'
  };
  
  return map[severityNormalized] || map[s] || 'info';
};

// 获取等级名称
const getSeverityText = (severity: string | number | undefined): string => {
  if (severity === undefined || severity === null || severity === '' || severity === '未评估') return '未评估';
  
  const s = String(severity);
  const severityNormalized = s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  
  const textMap: Record<string, string> = {
    'Critical': '严重', '1': '严重',
    'High': '高危',     '2': '高危',
    'Medium': '中危',   '3': '中危',
    'Low': '低危',      '4': '低危',
    'None': '无危害',    '5': '无危害'
  };
  
  return textMap[severityNormalized] || textMap[s] || s;
};

// 获取状态样式类
const getStatusClass = (status: string | undefined) => {
  if (!status) return 'pending';
  const s = status.toLowerCase();
  const statusMap: Record<string, string> = {
    'pending': 'pending',
    'audited': 'confirmed',
    'rejected': 'closed'
  }
  return statusMap[s] || 'pending'
}

// 获取状态名称
const getStatusText = (status: string | undefined) => {
  if (!status) return '待审核';
  const s = status.toLowerCase();
  const textMap: Record<string, string> = {
    'pending': '待审核',
    'audited': '已审核',
    'rejected': '驳回'
  }
  return textMap[s] || status;
}

const newComment = ref('')
const submitLoading = ref(false)

// 获取当前用户信息
const userStore = useUserStore()
const currentUser = computed(() => {
  const user = userStore.userInfo
  let avatarUrl = ''
  if (user?.avatar) {
    avatarUrl = typeof user.avatar === 'string' ? user.avatar : user.avatar.url || ''
  }
  return {
    name: user?.name || user?.username || '当前用户',
    avatar: avatarUrl,
    role: user?.role || 'whitehat'
  }
})

// 提交新留言
const submitComment = async () => {
  if (!newComment.value.trim()) {
    return
  }
  
  submitLoading.value = true
  try {
    const reportId = Number(vulnerabilityId.value)
    
    // 调用后端 API 创建评论
    await createReportComment(reportId, newComment.value.trim())
    
    // 刷新评论列表
    await fetchComments(reportId)
    
    newComment.value = ''
    Message.success('留言发布成功')
  } catch (error: any) {
    console.error('提交留言失败:', error)
    Message.error(error.message || '留言发布失败，请重试')
  } finally {
    submitLoading.value = false
  }
}

const exporting = ref(false)

// 导出为PDF
const exportToPDF = async () => {
  if (exporting.value) return
  
  const element = document.getElementById('vulnerability-detail-content')
  if (!element) {
    Message.error('无法找到导出内容')
    return
  }
  
  exporting.value = true
  try {
    // 设置导出时的样式优化（可选）
    const canvas = await html2canvas(element, {
      scale: 2, // 提高清晰度
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${vulnerabilityDetail.value.title || '漏洞详情'}.pdf`)
    
    Message.success('导出成功')
  } catch (error) {
    console.error('导出PDF失败:', error)
    Message.error('导出PDF失败，请重试')
  } finally {
    exporting.value = false
  }
}

// 下载附件
const handleDownload = (url: string) => {
  if (url && url !== '#') {
    window.open(url, '_blank')
  } else {
    Message.warning('附件链接无效')
  }
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
          <d-button 
            bs-style="primary" 
            @click="exportToPDF"
            :loading="exporting"
          >
            导出 PDF
          </d-button>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <d-loading />
        <p>加载中...</p>
      </div>

      <!-- 漏洞详情内容 -->
      <div v-else id="vulnerability-detail-content" class="detail-body">
        <!-- 基本信息卡片 -->
        <div class="info-card">
          <h1 class="vulnerability-title">{{ vulnerabilityDetail.title }}</h1>
          
          <div class="info-grid">
            <div class="info-item">
              <label>漏洞类型:</label>
              <span>{{ vulnerabilityDetail.type }}</span>
            </div>
            <div class="info-item">
              <label>自评等级:</label>
              <span :class="['level-badge', getSeverityColor(vulnerabilityDetail.level)]">
                {{ getSeverityText(vulnerabilityDetail.level) }}
              </span>
            </div>
            <div class="info-item">
              <label>通过等级:</label>
              <span :class="['level-badge', getSeverityColor(vulnerabilityDetail.officialLevel)]">
                {{ getSeverityText(vulnerabilityDetail.officialLevel) }}
              </span>
            </div>
            <div class="info-item">
              <label>状态:</label>
              <span :class="['status-badge', getStatusClass(vulnerabilityDetail.status)]">
                {{ getStatusText(vulnerabilityDetail.status) }}
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
            <div class="rich-content" v-html="vulnerabilityDetail.poc"></div>
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
              <d-button 
                bs-style="text" 
                bs-size="sm" 
                @click="handleDownload(attachment.url)"
              >下载</d-button>
            </div>
          </div>
        </div>

        <!-- 评论区域/审核互动 (时间轴重构) -->
        <div class="content-card comment-section">
          <div class="section-title">
            <h3>处理记录与审核沟通</h3>
            <span class="count-tag">{{ vulnerabilityDetail.comments.length }} 条记录</span>
          </div>
          
          <!-- 时间轴列表 -->
          <div class="timeline-wrapper">
            <div 
              v-for="comment in vulnerabilityDetail.comments" 
              :key="comment.id"
              :class="['timeline-item', comment.role === 'official' ? 'official' : 'researcher']"
            >
              <div class="comment-avatar">
                <d-avatar 
                  :width="36" 
                  :height="36" 
                  :is-round="true" 
                  :img-src="comment.avatar || ''"
                  class="avatar-img"
                >
                  <template #avatar v-if="!comment.avatar">{{ comment.author.substring(0,1) }}</template>
                </d-avatar>
              </div>
              <div class="timeline-content">
                <div class="comment-metadata">
                  <span class="author-tag">
                    <d-icon :name="comment.role === 'official' ? 'manager' : 'user'" size="14px" />
                    {{ comment.author }}
                  </span>
                  <span class="time-stamp">{{ comment.time }}</span>
                </div>
                <div class="comment-body">
                  {{ comment.content }}
                </div>
              </div>
            </div>
            
            <div v-if="vulnerabilityDetail.comments.length === 0" class="empty-timeline">
              <d-icon name="info" size="24px" />
              <p>暂无处理记录，管理员审核后将在此留言</p>
            </div>
          </div>

          <!-- 发送留言 (时间轴末端) -->
          <div class="reply-area">
            <div class="reply-container">
              <div class="reply-avatar">
                <d-avatar 
                  :width="36" 
                  :height="36" 
                  :is-round="true" 
                  :img-src="currentUser.avatar || ''"
                  class="avatar-img"
                >
                  <template #avatar v-if="!currentUser.avatar">{{ currentUser.name.substring(0,1) }}</template>
                </d-avatar>
              </div>
              <div class="input-wrapper">
                <d-textarea
                  v-model="newComment"
                  placeholder="针对审核问题进行沟通或回复..."
                  :rows="2"
                  class="modern-input"
                />
                <div class="action-bar">
                  <span class="tip-text">按回车快捷发送</span>
                  <d-button 
                    bs-style="primary" 
                    @click="submitComment"
                    :loading="submitLoading"
                    :disabled="!newComment.trim()"
                    class="send-btn"
                  >
                    发布留言
                  </d-button>
                </div>
              </div>
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

  &.danger {
    background: #fff1f0;
    color: #cf1322;
    border: 1px solid #ffa39e;
  }

  &.warning {
    background: #fff7e6;
    color: #d46b08;
    border: 1px solid #ffd591;
  }

  &.medium {
    background: #fffbe6;
    color: #ad8b00;
    border: 1px solid #ffe58f;
  }

  &.success {
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
      padding: 20px;

      .rich-content {
        font-size: 14px;
        line-height: 1.8;
        color: #333;
        word-wrap: break-word;

        :deep(img) {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 12px 0;
          box-shadow: 0 2px 12px rgba(0,0,0,0.1);
        }

        :deep(p) {
          margin-bottom: 12px;
        }

        :deep(ul), :deep(ol) {
          padding-left: 24px;
          margin-bottom: 12px;
        }

        :deep(li) {
          margin-bottom: 8px;
        }

        :deep(pre) {
          background: #2d2d2d;
          color: #f8f8f2;
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          font-family: 'Consolas', 'Monaco', monospace;
          margin: 16px 0;
        }

        :deep(code) {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          color: #e83e8c;
        }

        :deep(blockquote) {
          border-left: 4px solid #3b82f6;
          background: #f0f7ff;
          padding: 12px 20px;
          margin: 16px 0;
          color: #475569;
        }
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

.comment-section {
  padding: 32px !important;

  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    
    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 700;
      color: #1a3353;
      position: relative;
      padding-left: 12px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 18px;
        background: #3b82f6;
        border-radius: 2px;
      }
    }

    .count-tag {
      font-size: 13px;
      color: #94a3b8;
      background: #f1f5f9;
      padding: 4px 12px;
      border-radius: 20px;
    }
  }
}

.timeline-wrapper {
  position: relative;
  margin-bottom: 40px;

  .timeline-item {
    display: flex;
    gap: 16px;
    padding-bottom: 24px;
    
    &:last-child {
      padding-bottom: 0;
    }

    .comment-avatar {
      flex-shrink: 0;
      
      .avatar-img {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 2px solid #fff;
      }
    }

    &.official {
      .comment-avatar .avatar-img {
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
      }
      .author-tag { color: #3b82f6; background: rgba(59, 130, 246, 0.08); }
    }

    &.researcher {
      .comment-avatar .avatar-img {
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
      }
      .author-tag { color: #10b981; background: rgba(16, 185, 129, 0.08); }
    }

    .timeline-content {
      flex: 1;
      background: #fcfdfe;
      border: 1px solid #f1f5f9;
      padding: 16px;
      border-radius: 12px;
      transition: all 0.2s ease;

      &:hover {
        border-color: #e2e8f0;
        box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.05);
      }

      .comment-metadata {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 8px;

        .author-tag {
          font-size: 13px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .time-stamp {
          font-size: 12px;
          color: #94a3b8;
        }
      }

      .comment-body {
        font-size: 14px;
        line-height: 1.6;
        color: #475569;
        word-wrap: break-word;
      }
    }
  }

  .empty-timeline {
    text-align: center;
    padding: 48px;
    color: #94a3b8;
    
    .devui-icon { margin-bottom: 12px; opacity: 0.5; }
    p { font-size: 14px; margin: 0; }
  }
}

.reply-area {
  background: #f8fafc;
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #f1f5f9;

  .reply-container {
    display: flex;
    gap: 16px;

    .reply-avatar {
      flex-shrink: 0;
      
      .avatar-img {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border: 2px solid #fff;
      }
    }

    .input-wrapper {
      flex: 1;

      .modern-input {
        :deep(.devui-textarea) {
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
          padding: 12px !important;
          transition: all 0.3s ease !important;
          background: #fff !important;
          
          &:focus {
            border-color: #3b82f6 !important;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
          }
        }
      }

      .action-bar {
        margin-top: 12px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tip-text {
          font-size: 12px;
          color: #94a3b8;
        }

        .send-btn {
          border-radius: 10px !important;
          padding: 0 24px !important;
          height: 36px !important;
          font-weight: 600 !important;
        }
      }
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
