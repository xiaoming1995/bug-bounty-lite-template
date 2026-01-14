<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from 'vue-devui'
import Header from './Public/Header.vue'
import { getProjectDetail, acceptProjectTask, type ProjectDetail } from '@/api/project-hall'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const accepting = ref(false)

// 项目详情数据
const projectDetail = ref<ProjectDetail | null>(null)
const isAccepted = ref(false)

// 状态映射
const statusMap: Record<string, { label: string; class: string }> = {
  recruiting: { label: '招募中', class: 'status-recruiting' },
  in_progress: { label: '进行中', class: 'status-progress' },
  completed: { label: '已完成', class: 'status-completed' },
  closed: { label: '已关闭', class: 'status-closed' }
}

// 难度映射
const difficultyMap: Record<string, { label: string; class: string; stars: number }> = {
  easy: { label: '简单', class: 'diff-easy', stars: 1 },
  medium: { label: '中等', class: 'diff-medium', stars: 2 },
  hard: { label: '困难', class: 'diff-hard', stars: 3 },
  expert: { label: '专家', class: 'diff-expert', stars: 4 }
}

// 加载项目详情
const loadProjectDetail = async (id: string) => {
  loading.value = true
  
  try {
    const res = await getProjectDetail(parseInt(id))
    projectDetail.value = res as unknown as ProjectDetail
    isAccepted.value = (res as unknown as { accepted: boolean }).accepted || false
  } catch (error) {
    console.error('加载项目详情失败:', error)
    Message({
      type: 'error',
      message: '加载项目详情失败'
    })
  } finally {
    loading.value = false
  }
}

// 成功弹窗状态
const successModalVisible = ref(false)

// 按钮文本
const buttonText = computed(() => {
  if (isAccepted.value) return '已接受'
  if (!projectDetail.value || projectDetail.value.status !== 'recruiting') return '不可接受'
  return '接受任务'
})

// 按钮是否禁用
const isButtonDisabled = computed(() => {
  return isAccepted.value || !projectDetail.value || projectDetail.value.status !== 'recruiting' || accepting.value
})

// 接受任务
const acceptTask = async () => {
  if (!projectDetail.value || projectDetail.value.status !== 'recruiting' || isAccepted.value) return
  
  accepting.value = true
  
  try {
    await acceptProjectTask(projectDetail.value.id)
    isAccepted.value = true
    projectDetail.value.status = 'in_progress'  // 更新状态为进行中
    successModalVisible.value = true
  } catch (error: unknown) {
    console.error('接受任务失败:', error)
    const errorMessage = error instanceof Error ? error.message : '接受任务失败，请重试'
    Message({
      type: 'error',
      message: errorMessage
    })
  } finally {
    accepting.value = false
  }
}

// 关闭弹窗并返回列表
const closeAndGoBack = () => {
  successModalVisible.value = false
  router.push('/project-hall')
}

// 返回列表
const goBack = () => {
  router.push('/project-hall')
}

// 格式化日期
const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '暂无'
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

// 获取文件图标
const getFileIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    pdf: 'file-pdf',
    doc: 'file-word',
    image: 'image',
    default: 'file'
  }
  return iconMap[type] || iconMap.default
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    loadProjectDetail(id)
  }
})
</script>

<template>
  <Header />
  <div class="project-detail-page">
    <div class="page-content">
      <!-- 返回按钮 -->
      <div class="back-nav">
        <button class="back-btn" @click="goBack">
          <d-icon name="arrow-left" />
          <span>返回项目大厅</span>
        </button>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-state">
        <d-icon name="loading" size="32px" />
        <span>加载中...</span>
      </div>

      <!-- 项目详情 -->
      <template v-else-if="projectDetail">
        <div class="detail-header">
          <div class="header-left">
            <h1 class="project-title">{{ projectDetail.name }}</h1>
            <div class="meta-tags">
              <span class="status-badge" :class="statusMap[projectDetail.status].class">
                {{ statusMap[projectDetail.status].label }}
              </span>
              <span class="difficulty-badge" :class="difficultyMap[projectDetail.difficulty].class">
                <d-icon name="star-o" v-for="n in difficultyMap[projectDetail.difficulty].stars" :key="n" />
                {{ difficultyMap[projectDetail.difficulty].label }}
              </span>
            </div>
          </div>
          <div class="header-right">
            <button 
              class="accept-btn" 
              :class="{ 'accepted': isAccepted }"
              :disabled="isButtonDisabled"
              @click="acceptTask"
            >
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>{{ buttonText }}</span>
            </button>
          </div>
        </div>

        <div class="detail-grid">
          <!-- 左侧主内容 -->
          <div class="main-section">
            <!-- 项目描述 -->
            <div class="detail-card">
              <h3 class="card-title">
                <d-icon name="file-text" />
                <span>项目描述</span>
              </h3>
              <div class="description-content" v-html="projectDetail.description.replace(/\n/g, '<br>')"></div>
            </div>
          </div>

          <!-- 右侧信息 -->
          <div class="side-section">
            <!-- 基本信息 -->
            <div class="info-card">
              <h4 class="info-title">项目信息</h4>
              <div class="info-list">
                <div class="info-item">
                  <span class="label">截止日期</span>
                  <span class="value">{{ formatDate(projectDetail.deadline) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">发布时间</span>
                  <span class="value">{{ formatDate(projectDetail.created_at) }}</span>
                </div>
              </div>
            </div>

            <div class="info-card">
              <h4 class="info-title">附件资源</h4>
              <div v-if="projectDetail.attachments && projectDetail.attachments.length > 0" class="attachments-list">
                <a 
                  v-for="(file, idx) in projectDetail.attachments" 
                  :key="idx"
                  :href="file.url"
                  class="attachment-item"
                >
                  <d-icon :name="getFileIcon(file.type)" />
                  <div class="file-info">
                    <span class="file-name">{{ file.name }}</span>
                    <span class="file-size">{{ file.size }}</span>
                  </div>
                  <d-icon name="download" class="download-icon" />
                </a>
              </div>
              <div v-else class="empty-attachments">
                <d-icon name="folder-open" />
                <span>暂无附件</span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- 成功弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="successModalVisible" class="modal-overlay" @click="closeAndGoBack">
          <div class="success-modal" @click.stop>
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2.5 2.5L16 9" />
              </svg>
            </div>
            <h3 class="modal-title">任务接受成功</h3>
            <p class="modal-message">您已成功接受任务</p>
            <p class="project-name-text">{{ projectDetail?.name }}</p>
            <button class="modal-btn" @click="closeAndGoBack">返回项目大厅</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.project-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f4fc 50%, #f5f0ff 100%);
  padding-bottom: 40px;
}

.page-content {
  max-width: 1200px;
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

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  
  .header-left {
    flex: 1;
  }
  
  .project-title {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px 0;
  }
  
  .meta-tags {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }
}

.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  
  &.status-recruiting { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
  &.status-progress { background: rgba(59, 130, 246, 0.1); color: #2563eb; }
  &.status-completed { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
  &.status-closed { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
}

.difficulty-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  
  &.diff-easy { background: rgba(34, 197, 94, 0.1); color: #16a34a; }
  &.diff-medium { background: rgba(234, 179, 8, 0.1); color: #ca8a04; }
  &.diff-hard { background: rgba(249, 115, 22, 0.1); color: #ea580c; }
  &.diff-expert { background: rgba(239, 68, 68, 0.1); color: #dc2626; }
}

.accept-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    box-shadow: 0 6px 20px rgba(94, 124, 224, 0.35);
  }
  
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
  
  &.accepted {
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    cursor: default;
    
    &:disabled {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      opacity: 0.9;
    }
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 24px;
}

.detail-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  
  .card-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .description-content {
    font-size: 14px;
    line-height: 1.8;
    color: #475569;
  }
  
  .requirements-list {
    margin: 0;
    padding-left: 20px;
    
    li {
      font-size: 14px;
      color: #475569;
      line-height: 2;
    }
  }
}

.info-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  
  .info-title {
    font-size: 14px;
    font-weight: 600;
    color: #64748b;
    margin: 0 0 16px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

.info-list {
  .info-item {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    
    &:last-child { border-bottom: none; }
    
    .label {
      font-size: 13px;
      color: #94a3b8;
    }
    
    .value {
      font-size: 14px;
      font-weight: 500;
      color: #334155;
      
      &.reward {
        color: #ea580c;
        font-weight: 600;
      }
    }
  }
}

.publisher-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  
  .publisher-avatar {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #5e7ce0;
  }
  
  .publisher-detail {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .name {
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .company {
      font-size: 13px;
      color: #64748b;
    }
  }
}

.contact-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #5e7ce0;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
}

.attachments-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.attachment-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
    
    .download-icon {
      color: #5e7ce0;
    }
  }
  
  .file-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    
    .file-name {
      font-size: 13px;
      font-weight: 500;
      color: #334155;
    }
    
    .file-size {
      font-size: 12px;
      color: #94a3b8;
    }
  }
  
  .download-icon {
    color: #94a3b8;
    transition: color 0.2s;
  }
}

.empty-attachments {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: #94a3b8;
  font-size: 13px;
  gap: 8px;
  background: #f8fafc;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .detail-header {
    flex-direction: column;
    gap: 16px;
    
    .header-right {
      width: 100%;
      
      .accept-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

/* 成功弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.success-modal {
  background: #fff;
  border-radius: 20px;
  padding: 40px 48px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 90%;
}

.modal-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 32px;
    height: 32px;
    color: #fff;
  }
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.modal-message {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.project-name-text {
  font-size: 16px;
  font-weight: 600;
  color: #5e7ce0;
  margin: 0 0 24px 0;
}

.modal-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 8px 20px rgba(94, 124, 224, 0.35);
    transform: translateY(-1px);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  
  .success-modal {
    transform: scale(0.9) translateY(20px);
  }
}
</style>
