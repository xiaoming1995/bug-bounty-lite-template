<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Public/Header.vue'

// 项目数据类型
interface ProjectItem {
  id: number
  name: string
  status: 'recruiting' | 'in_progress' | 'completed' | 'closed'
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  deadline: string
  description?: string
}

const router = useRouter()
const loading = ref(true)

// 项目列表数据（Mock）
const projectList = ref<ProjectItem[]>([
  {
    id: 1,
    name: '某金融系统安全测试',
    status: 'recruiting',
    difficulty: 'hard',
    deadline: '2026-02-15'
  },
  {
    id: 2,
    name: '电商平台渗透测试',
    status: 'in_progress',
    difficulty: 'medium',
    deadline: '2026-01-30'
  },
  {
    id: 3,
    name: '政务系统安全评估',
    status: 'recruiting',
    difficulty: 'expert',
    deadline: '2026-03-01'
  },
  {
    id: 4,
    name: '移动APP安全审计',
    status: 'completed',
    difficulty: 'easy',
    deadline: '2026-01-10'
  },
  {
    id: 5,
    name: '物联网设备漏洞挖掘',
    status: 'recruiting',
    difficulty: 'hard',
    deadline: '2026-02-28'
  }
])

// 状态映射
const statusMap: Record<string, { label: string; class: string }> = {
  recruiting: { label: '招募中', class: 'status-recruiting' },
  in_progress: { label: '进行中', class: 'status-progress' },
  completed: { label: '已完成', class: 'status-completed' },
  closed: { label: '已关闭', class: 'status-closed' }
}

// 难度映射
const difficultyMap: Record<string, { label: string; class: string }> = {
  easy: { label: '简单', class: 'diff-easy' },
  medium: { label: '中等', class: 'diff-medium' },
  hard: { label: '困难', class: 'diff-hard' },
  expert: { label: '专家', class: 'diff-expert' }
}

// 查看项目详情
const viewDetail = (id: number) => {
  router.push(`/project-hall/${id}`)
}

// 成功弹窗状态
const successModalVisible = ref(false)
const acceptedProjectName = ref('')

// 接受任务
const acceptTask = (project: ProjectItem) => {
  if (project.status !== 'recruiting') {
    return
  }
  // TODO: 调用 API 接受任务
  console.log('接受任务:', project.name)
  acceptedProjectName.value = project.name
  successModalVisible.value = true
}

// 关闭弹窗
const closeSuccessModal = () => {
  successModalVisible.value = false
}

// 格式化日期
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

onMounted(() => {
  // 模拟加载
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<template>
  <Header />
  <div class="project-hall-page">
    <div class="page-content">
      <div class="page-header">
        <div class="page-title">
          <h2>项目大厅</h2>
          <span class="subtitle">浏览并参与安全测试项目，展示您的技术实力</span>
        </div>
      </div>

      <div class="main-card">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-state">
          <d-icon name="loading" size="32px" />
          <span>加载中...</span>
        </div>

        <!-- 项目列表 -->
        <div v-else class="project-grid">
          <div 
            v-for="project in projectList" 
            :key="project.id" 
            class="project-card"
          >
            <div class="card-header">
              <h3 class="project-name">{{ project.name }}</h3>
              <span class="status-badge" :class="statusMap[project.status].class">
                {{ statusMap[project.status].label }}
              </span>
            </div>

            <div class="card-body">
              <div class="info-row">
                <div class="info-item">
                  <span class="label">难度等级</span>
                  <span class="value difficulty" :class="difficultyMap[project.difficulty].class">
                    {{ difficultyMap[project.difficulty].label }}
                  </span>
                </div>
                <div class="info-item">
                  <span class="label">截止日期</span>
                  <span class="value">{{ formatDate(project.deadline) }}</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <button class="btn btn-secondary" @click="viewDetail(project.id)">
                <d-icon name="preview" />
                <span>查看详情</span>
              </button>
              <button 
                class="btn btn-primary" 
                :disabled="project.status !== 'recruiting'"
                @click="acceptTask(project)"
              >
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <span>接受任务</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && projectList.length === 0" class="empty-state">
          <d-icon name="info-o" size="48px" color="#cbd5e1" />
          <span>暂无可用项目</span>
        </div>
      </div>
    </div>

    <!-- 成功弹窗 -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div v-if="successModalVisible" class="modal-overlay" @click="closeSuccessModal">
          <div class="success-modal" @click.stop>
            <div class="modal-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12l2.5 2.5L16 9" />
              </svg>
            </div>
            <h3 class="modal-title">任务接受成功</h3>
            <p class="modal-message">您已成功接受任务</p>
            <p class="project-name-text">{{ acceptedProjectName }}</p>
            <button class="modal-btn" @click="closeSuccessModal">确定</button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.project-hall-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8f4fc 50%, #f5f0ff 100%);
  padding-bottom: 40px;
}

.page-content {
  max-width: 1400px;
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

.main-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #64748b;
}

.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

.project-card {
  background: #fafbfc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.25s ease;
  
  &:hover {
    border-color: #5e7ce0;
    box-shadow: 0 8px 24px rgba(94, 124, 224, 0.12);
    transform: translateY(-2px);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
  
  .project-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    flex: 1;
    line-height: 1.4;
  }
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  
  &.status-recruiting {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  }
  
  &.status-progress {
    background: rgba(59, 130, 246, 0.1);
    color: #2563eb;
  }
  
  &.status-completed {
    background: rgba(107, 114, 128, 0.1);
    color: #6b7280;
  }
  
  &.status-closed {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
}

.card-body {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  gap: 24px;
  margin-bottom: 12px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  
  .label {
    font-size: 12px;
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

.difficulty {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px !important;
  
  &.diff-easy {
    background: rgba(34, 197, 94, 0.1);
    color: #16a34a;
  }
  
  &.diff-medium {
    background: rgba(234, 179, 8, 0.1);
    color: #ca8a04;
  }
  
  &.diff-hard {
    background: rgba(249, 115, 22, 0.1);
    color: #ea580c;
  }
  
  &.diff-expert {
    background: rgba(239, 68, 68, 0.1);
    color: #dc2626;
  }
}

.card-footer {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  outline: none;
  
  &:focus {
    outline: none;
  }
  
  &.btn-secondary {
    background: #f1f5f9;
    color: #475569;
    
    &:hover {
      background: #e2e8f0;
    }
  }
  
  &.btn-primary {
    background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
    color: #fff;
    
    &:hover:not(:disabled) {
      box-shadow: 0 4px 12px rgba(94, 124, 224, 0.3);
    }
    
    &:disabled {
      background: #cbd5e1;
      cursor: not-allowed;
    }
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .project-grid {
    grid-template-columns: 1fr;
  }
  
  .page-content {
    padding: 16px;
  }
  
  .info-row {
    flex-direction: column;
    gap: 12px;
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

/* 弹窗动画 */
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
