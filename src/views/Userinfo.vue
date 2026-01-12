<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Header from './Public/Header.vue'
import { getUserInfo } from '@/api/auth'

// 用户信息数据
const userInfo = reactive({
  avatar: '',
  name: '',
  email: '',
  phone: '',
  department: '',  // 从 org.name 获取
  lastLogin: '',
  status: '在线',
  bio: ''
})

// 表单数据
const formData = reactive({
  name: '',
  email: '',
  phone: '',
  department: '',
  bio: ''
})

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 响应式状态
const loading = ref(false)
const editMode = ref(false)
const showPasswordModal = ref(false)
const avatarUploadRef = ref()

// Toast 提示状态
const toast = reactive({
  visible: false,
  message: '',
  type: 'success' as 'success' | 'error' | 'warning'
})

// 显示 Toast 提示
const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  toast.message = message
  toast.type = type
  toast.visible = true
  setTimeout(() => {
    toast.visible = false
  }, 3000)
}

// 统计数据
const userStats = ref([
  { label: '发现漏洞', value: 156, color: '#ef4444' },
  { label: '提交报告', value: 89, color: '#3b82f6' },
  { label: '处理警告', value: 234, color: '#f59e0b' },
  { label: '在线天数', value: 298, color: '#10b981' }
])

// 技能分布数据
const skillData = ref([
  { name: 'Web安全', value: 90 },
  { name: '渗透测试', value: 85 },
  { name: '代码审计', value: 75 },
  { name: '逆向工程', value: 60 },
  { name: '移动安全', value: 55 },
  { name: '社会工程', value: 70 }
])

// 排行榜数据
const rankingInfo = ref({
  overall: 28,
  totalUsers: 1256,
  weeklyRank: 12,
  monthlyPoints: 850
})

// 最近提交数据
const recentSubmissions = ref([
  { 
    id: 1, 
    title: 'SQL注入漏洞 - 用户登录接口', 
    severity: 'high', 
    status: 'confirmed', 
    time: '2天前',
    points: 500
  },
  { 
    id: 2, 
    title: 'XSS跨站脚本攻击', 
    severity: 'medium', 
    status: 'pending', 
    time: '5天前',
    points: 0
  },
  { 
    id: 3, 
    title: '敏感信息泄露', 
    severity: 'low', 
    status: 'fixed', 
    time: '1周前',
    points: 200
  },
  { 
    id: 4, 
    title: 'CSRF跨站请求伪造', 
    severity: 'medium', 
    status: 'rejected', 
    time: '2周前',
    points: 0
  }
])

// 获取状态文本和样式
const getStatusInfo = (status: string) => {
  const statusMap: Record<string, { text: string; color: string; bg: string }> = {
    'confirmed': { text: '已确认', color: '#059669', bg: '#ecfdf5' },
    'pending': { text: '审核中', color: '#d97706', bg: '#fffbeb' },
    'fixed': { text: '已修复', color: '#0284c7', bg: '#f0f9ff' },
    'rejected': { text: '已拒绝', color: '#dc2626', bg: '#fef2f2' }
  }
  return statusMap[status] || { text: '未知', color: '#6b7280', bg: '#f3f4f6' }
}

const getSeverityInfo = (severity: string) => {
  const severityMap: Record<string, { text: string; color: string }> = {
    'critical': { text: '严重', color: '#7c3aed' },
    'high': { text: '高危', color: '#dc2626' },
    'medium': { text: '中危', color: '#d97706' },
    'low': { text: '低危', color: '#059669' }
  }
  return severityMap[severity] || { text: '未知', color: '#6b7280' }
}

// 方法
const handleEdit = () => {
  editMode.value = true
}

const handleCancel = () => {
  editMode.value = false
  Object.assign(formData, {
    name: userInfo.name,
    email: userInfo.email,
    phone: userInfo.phone,
    department: userInfo.department,
    bio: userInfo.bio
  })
}

const handleSave = async () => {
  loading.value = true
  try {
    // 调用后端 API 更新用户资料
    const { updateProfile } = await import('@/api/auth')
    await updateProfile({
      name: formData.name,
      bio: formData.bio,
      phone: formData.phone,
      email: formData.email
    })
    
    // 更新本地数据
    Object.assign(userInfo, {
      name: formData.name,
      bio: formData.bio,
      phone: formData.phone,
      email: formData.email
    })
    editMode.value = false
    showToast('个人信息更新成功！', 'success')
  } catch (error: any) {
    console.error('更新失败:', error)
    showToast('更新失败：' + (error.message || '请稍后重试'), 'error')
  } finally {
    loading.value = false
  }
}

const handleAvatarUpload = () => {
  avatarUploadRef.value?.click()
}

const onAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      userInfo.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const handlePasswordChange = () => {
  showPasswordModal.value = true
}

const submitPasswordChange = async () => {
  if (!passwordForm.oldPassword) {
    showToast('请输入当前密码', 'warning')
    return
  }

  if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
    showToast('请输入新密码', 'warning')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    showToast('新密码长度不能少于6位', 'warning')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    showToast('两次输入的密码不一致，请重新输入', 'warning')
    return
  }

  loading.value = true
  try {
    // 调用后端 API 修改密码
    const { changePassword } = await import('@/api/auth')
    await changePassword(passwordForm.oldPassword, passwordForm.newPassword)
    
    showPasswordModal.value = false
    Object.assign(passwordForm, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    showToast('密码修改成功！', 'success')
  } catch (error: any) {
    console.error('密码修改失败:', error)
    showToast('密码修改失败：' + (error.message || '请检查当前密码是否正确'), 'error')
  } finally {
    loading.value = false
  }
}

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    loading.value = true
    const response = await getUserInfo() as any
    const userData = response.data || response
    
    // 填充用户信息
    Object.assign(userInfo, {
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      department: userData.org?.name || '未分配',
      lastLogin: userData.last_login_at ? new Date(userData.last_login_at).toLocaleString('zh-CN') : '暂无记录',
      bio: userData.bio || '',
      status: '在线'
    })
    
    // 同步到表单
    Object.assign(formData, {
      name: userInfo.name,
      email: userInfo.email,
      phone: userInfo.phone,
      department: userInfo.department,
      bio: userInfo.bio
    })

  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.value = false
  }
}

// 页面加载时获取用户信息
onMounted(() => {
  fetchUserProfile()
})
</script>

<template>
  <Header />

  <div class="userinfo-page">
    <div class="page-content">
      <!-- 左侧：用户信息 -->
      <div class="main-section">
        <div class="user-card">
          <div class="user-header">
            <div class="avatar-wrapper">
              <d-avatar
                :width="72"
                :height="72"
                :img-src="userInfo.avatar"
                :icon="!userInfo.avatar ? 'user' : undefined"
              />
              <input
                ref="avatarUploadRef"
                type="file"
                accept="image/*"
                @change="onAvatarChange"
                hidden
              />
              <button class="avatar-edit" @click="handleAvatarUpload">
                <d-icon name="camera" size="14px" />
              </button>
            </div>
            
            <div class="user-meta">
              <div class="name-row">
                <h1>{{ userInfo.name }}</h1>
                <d-tag :color="userInfo.status === '在线' ? 'success' : 'secondary'" size="sm">
                  {{ userInfo.status }}
                </d-tag>
              </div>
              <p class="position">{{ userInfo.department }}</p>
            </div>

            <div class="header-actions">
              <template v-if="!editMode">
                <button class="action-btn secondary" @click="handlePasswordChange">
                  <d-icon name="lock" size="14px" />
                  <span>修改密码</span>
                </button>
                <button class="action-btn primary" @click="handleEdit">
                  <d-icon name="edit" size="14px" color="#ffffff" />
                  <span>编辑</span>
                </button>
              </template>
              <template v-else>
                <button class="action-btn primary" :disabled="loading" @click="handleSave">
                  {{ loading ? '保存中...' : '保存' }}
                </button>
                <button class="action-btn secondary" @click="handleCancel">取消</button>
              </template>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="bio-section">
            <h3>个人简介</h3>
            <div v-if="!editMode" class="bio-text">{{ userInfo.bio }}</div>
            <d-textarea
              v-else
              v-model="formData.bio"
              :rows="3"
              resize="none"
              placeholder="请输入个人简介"
            />
          </div>

          <!-- 信息表单 -->
          <div class="info-grid">
            <div class="info-item">
              <label>用户名</label>
              <d-input v-model="formData.name" :disabled="!editMode" />
            </div>
            <div class="info-item">
              <label>邮箱</label>
              <d-input v-model="formData.email" :disabled="!editMode" />
            </div>
            <div class="info-item">
              <label>手机号</label>
              <d-input v-model="formData.phone" :disabled="!editMode" />
            </div>
            <div class="info-item">
              <label>部门</label>
              <div class="readonly-field">
                <d-input v-model="formData.department" disabled />
                <div class="lock-indicator">
                  <d-icon name="lock" size="12px" />
                  <span>不可修改</span>
                </div>
              </div>
            </div>
            <div class="info-item">
              <label>最后登录</label>
              <d-input :model-value="userInfo.lastLogin" disabled />
            </div>
          </div>

          <!-- 最近提交 -->
          <div class="submissions-section">
            <div class="section-header">
              <h3>
                <d-icon name="list-check" />
                最近提交
              </h3>
              <router-link to="/database" class="view-all-link">
                查看全部
                <d-icon name="arrow-right-s" />
              </router-link>
            </div>
            <div class="submissions-list">
              <div 
                v-for="item in recentSubmissions" 
                :key="item.id" 
                class="submission-item"
                :class="item.status"
              >
                <div class="submission-main">
                  <div class="submission-title">{{ item.title }}</div>
                  <div class="submission-meta">
                    <span 
                      class="severity-tag" 
                      :style="{ color: getSeverityInfo(item.severity).color }"
                    >
                      {{ getSeverityInfo(item.severity).text }}
                    </span>
                    <span class="submission-time">{{ item.time }}</span>
                  </div>
                </div>
                <div class="submission-status">
                  <span 
                    class="status-badge"
                    :style="{ 
                      color: getStatusInfo(item.status).color,
                      background: getStatusInfo(item.status).bg
                    }"
                  >
                    {{ getStatusInfo(item.status).text }}
                  </span>
                  <span v-if="item.points > 0" class="points-earned">+{{ item.points }}</span>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>

      <!-- 右侧：统计与技能 -->
      <div class="side-section">
        <!-- 数据概览 -->
        <div class="stats-card">
          <h3>数据概览</h3>
          <div class="stats-list">
            <div v-for="stat in userStats" :key="stat.label" class="stat-row">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <!-- 技能分布 -->
        <div class="skill-card">
          <h3>技能分布</h3>
          <div class="skill-chart">
            <div v-for="skill in skillData" :key="skill.name" class="skill-item">
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-value">{{ skill.value }}%</span>
              </div>
              <div class="skill-bar">
                <div class="skill-progress" :style="{ width: skill.value + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 排行榜 -->
        <div class="ranking-card">
          <h3>我的排名</h3>
          <div class="ranking-content">
            <div class="ranking-main">
              <span class="ranking-number">#{{ rankingInfo.overall }}</span>
              <span class="ranking-total">/ {{ rankingInfo.totalUsers }}</span>
            </div>
            <div class="ranking-details">
              <div class="ranking-item">
                <span class="ranking-label">本周排名</span>
                <span class="ranking-value">#{{ rankingInfo.weeklyRank }}</span>
              </div>
              <div class="ranking-item">
                <span class="ranking-label">本月积分</span>
                <span class="ranking-value">{{ rankingInfo.monthlyPoints }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 密码修改弹窗（自定义实现以确保显示） -->
  <Teleport to="body">
    <div v-if="showPasswordModal" class="custom-modal-overlay" @click.self="showPasswordModal = false">
      <div class="custom-modal">
        <div class="modal-header">
          <h3>修改密码</h3>
          <button class="close-btn" @click="showPasswordModal = false">
            <d-icon name="close" />
          </button>
        </div>
        
        <div class="password-form">
          <div class="form-item">
            <label>当前密码</label>
            <input 
              v-model="passwordForm.oldPassword" 
              type="password" 
              placeholder="请输入当前密码"
              class="password-input"
            />
          </div>
          <div class="form-item">
            <label>新密码</label>
            <input 
              v-model="passwordForm.newPassword" 
              type="password" 
              placeholder="请输入新密码（至少6位）"
              class="password-input"
            />
          </div>
          <div class="form-item">
            <label>确认新密码</label>
            <input 
              v-model="passwordForm.confirmPassword" 
              type="password" 
              placeholder="请再次输入新密码"
              class="password-input"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="modal-btn secondary" @click="showPasswordModal = false">取消</button>
          <button class="modal-btn primary" :disabled="loading" @click="submitPasswordChange">
            {{ loading ? '修改中...' : '确认修改' }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Toast 提示组件 -->
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="toast.visible" class="toast-notification" :class="toast.type">
        <div class="toast-icon">
          <d-icon v-if="toast.type === 'success'" name="right-o" />
          <d-icon v-else-if="toast.type === 'error'" name="error-o" />
          <d-icon v-else name="warning-o" />
        </div>
        <span class="toast-message">{{ toast.message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.userinfo-page {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
  padding: var(--spacing-page, 24px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  overflow-y: auto;
}

.page-content {
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}

.user-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 24px;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;

  .avatar-edit {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #5e7ce0;
    color: #fff;
    border: 2px solid #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;

    &:hover {
      background: #4c6bcf;
      transform: scale(1.1);
    }
  }
}

.user-meta {
  flex: 1;
  min-width: 0;

  .name-row {
    display: flex;
    align-items: center;
    gap: 12px;

    h1 {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      color: #1e293b;
    }
  }

  .position {
    margin: 6px 0 0;
    font-size: 14px;
    color: #64748b;
  }
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 500;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    outline: none;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    // 主要按钮（编辑/保存）
    &.primary {
      background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
      color: #fff;

      // 图标颜色为白色
      .devui-icon,
      :deep(.devui-icon) {
        color: #fff !important;
      }

      &:hover:not(:disabled) {
        background: linear-gradient(135deg, #4c6bcf 0%, #6b2dc9 100%);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(94, 124, 224, 0.4);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }

    // 次要按钮（修改密码/取消）
    &.secondary {
      background: #f1f5f9;
      color: #475569;

      &:hover:not(:disabled) {
        background: #e2e8f0;
        color: #334155;
      }

      &:active:not(:disabled) {
        background: #cbd5e1;
      }
    }

    .devui-icon {
      font-size: 14px;
    }
  }
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  flex: 1;
  align-content: start;
}

.info-item {
  label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #64748b;
    margin-bottom: 6px;
  }

  :deep(.devui-input) {
    &:disabled {
      background: #f8fafc;
      border-color: #e2e8f0;
      color: #334155;
    }
  }
}

// 只读字段样式（如部门）
.readonly-field {
  position: relative;

  :deep(.devui-input) {
    &:disabled {
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      border-color: #cbd5e1;
      color: #64748b;
      cursor: not-allowed;
    }
  }

  .lock-indicator {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    color: #94a3b8;
    font-size: 11px;
    pointer-events: none;
    background: rgba(248, 250, 252, 0.9);
    padding: 2px 6px;
    border-radius: 4px;

    .devui-icon {
      font-size: 12px;
    }
  }
}



.stats-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;

  .stat-label {
    font-size: 13px;
    color: #64748b;
  }

  .stat-value {
    font-size: 18px;
    font-weight: 700;
  }
}

// 个人简介样式
.bio-section {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 10px;
  border-left: 4px solid #5e7ce0;

  h3 {
    margin: 0 0 10px;
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
  }

  .bio-text {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: #475569;
  }
}

// 最近提交样式
.submissions-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;

      .devui-icon {
        color: #5e7ce0;
      }
    }

    .view-all-link {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 13px;
      color: #5e7ce0;
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        color: #4c6bcf;
        gap: 6px;
      }

      .devui-icon {
        font-size: 14px;
      }
    }
  }
}

.submissions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submission-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
  border-left: 3px solid transparent;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }

  // 状态边框颜色
  &.confirmed {
    border-left-color: #059669;
  }
  
  &.pending {
    border-left-color: #d97706;
  }
  
  &.fixed {
    border-left-color: #0284c7;
  }
  
  &.rejected {
    border-left-color: #dc2626;
  }

  .submission-main {
    flex: 1;
    min-width: 0;

    .submission-title {
      font-size: 14px;
      font-weight: 500;
      color: #1e293b;
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .submission-meta {
      display: flex;
      align-items: center;
      gap: 12px;

      .severity-tag {
        font-size: 12px;
        font-weight: 600;
      }

      .submission-time {
        font-size: 12px;
        color: #94a3b8;
      }
    }
  }

  .submission-status {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;

    .status-badge {
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 6px;
    }

    .points-earned {
      font-size: 13px;
      font-weight: 700;
      color: #059669;
    }
  }
}

// 右侧区域布局调整
.side-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
}

.stats-card,
.skill-card,
.ranking-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  h3 {
    margin: 0 0 16px;
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
  }
}

.stats-card {
  flex-shrink: 0;
}

// 技能卡片样式
.skill-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;

  .skill-chart {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
    overflow-y: auto;
  }
}

.skill-item {
  .skill-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .skill-name {
    font-size: 13px;
    color: #475569;
    font-weight: 500;
  }

  .skill-value {
    font-size: 12px;
    color: #5e7ce0;
    font-weight: 600;
  }

  .skill-bar {
    height: 8px;
    background: #e2e8f0;
    border-radius: 4px;
    overflow: hidden;
  }

  .skill-progress {
    height: 100%;
    background: linear-gradient(90deg, #5e7ce0, #7c3aed);
    border-radius: 4px;
    transition: width 0.5s ease;
  }
}

// 排行榜卡片样式
.ranking-card {
  flex-shrink: 0;

  .ranking-content {
    text-align: center;
  }

  .ranking-main {
    margin-bottom: 16px;
    padding: 16px;
    background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
    border-radius: 10px;
    color: #fff;
  }

  .ranking-number {
    font-size: 36px;
    font-weight: 800;
    letter-spacing: -1px;
  }

  .ranking-total {
    font-size: 16px;
    opacity: 0.8;
    margin-left: 4px;
  }

  .ranking-details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .ranking-item {
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    text-align: center;
  }

  .ranking-label {
    display: block;
    font-size: 12px;
    color: #64748b;
    margin-bottom: 4px;
  }

  .ranking-value {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
  }
}

// 大平板设备 (900px - 1024px)
@media (max-width: 1024px) and (min-width: 901px) {
  .page-content {
    gap: 20px;
  }
  
  .user-card {
    padding: 20px;
  }
  
  .info-grid {
    gap: 16px;
  }
}

// 平板设备 (768px - 900px)
@media (max-width: 900px) {
  .userinfo-page {
    padding: 20px 16px;
  }
  
  .page-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .main-section {
    order: 1;
  }

  .side-section {
    order: 0;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 16px;
  }

  .stats-card,
  .skill-card,
  .ranking-card {
    flex: 1;
    min-width: 200px;
  }
}

// 手机设备 (640px - 768px)
@media (max-width: 768px) and (min-width: 641px) {
  .userinfo-page {
    padding: 20px 16px;
  }
  
  .user-header {
    gap: 16px;
    
    .name-row h1 {
      font-size: 20px;
    }
  }
  
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
  
  .submissions-section {
    margin-top: 24px;
    padding-top: 16px;
  }
  
  .submission-item {
    padding: 14px;
  }
}

@media (max-width: 640px) {
  .userinfo-page {
    padding: 12px;
  }

  .page-content {
    gap: 16px;
  }

  .user-card {
    padding: 16px;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
    gap: 16px;
    padding-bottom: 16px;
    margin-bottom: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .side-section {
    flex-direction: column;
    gap: 12px;
  }

  .stats-card,
  .skill-card,
  .ranking-card {
    min-width: 100%;
  }

  .stats-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .stat-row {
    flex-direction: column;
    text-align: center;
    gap: 4px;
    padding: 10px;
  }

  .submissions-section {
    margin-top: 20px;
    padding-top: 16px;
    
    .section-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
  }

  .submission-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 14px;
    
    .submission-status {
      flex-direction: row;
      width: 100%;
      justify-content: space-between;
    }
  }
  
  .bio-section {
    padding: 12px;
    margin-bottom: 16px;
  }
}

// 自定义弹窗样式
.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.custom-modal {
  background: #fff;
  width: 400px;
  max-width: 90%;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalFadeIn 0.3s ease-out;

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
    }

    .close-btn {
      border: none;
      background: none;
      color: #94a3b8;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.2s;
      outline: none;

      &:hover {
        background: #f1f5f9;
        color: #64748b;
      }

      &:focus {
        outline: none;
        box-shadow: none;
      }
    }
  }

  // 自定义密码表单样式
  .password-form {
    .form-item {
      margin-bottom: 20px;

      label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        margin-bottom: 8px;
      }

      .password-input {
        width: 100%;
        padding: 10px 14px;
        font-size: 14px;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        background: #f8fafc;
        color: #1e293b;
        transition: all 0.2s ease;
        box-sizing: border-box;

        &::placeholder {
          color: #94a3b8;
        }

        &:focus {
          outline: none;
          border-color: #5e7ce0;
          background: #fff;
        }
      }
    }
  }

  // 移除按钮聚焦边框效果
  .modal-footer {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;

    .modal-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 24px;
      font-size: 14px;
      font-weight: 500;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      // 主要按钮（确认修改）
      &.primary {
        background: linear-gradient(135deg, #5e7ce0 0%, #7c3aed 100%);
        color: #fff;

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #4c6bcf 0%, #6b2dc9 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(94, 124, 224, 0.4);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }

      // 次要按钮（取消）
      &.secondary {
        background: #f1f5f9;
        color: #475569;

        &:hover:not(:disabled) {
          background: #e2e8f0;
          color: #334155;
        }

        &:active:not(:disabled) {
          background: #cbd5e1;
        }
      }
    }
  }
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
// Toast 通知样式
.toast-notification {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  font-size: 14px;
  font-weight: 500;

  .toast-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  .toast-message { max-width: 300px; }

  &.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #fff;
    .toast-icon { background: rgba(255, 255, 255, 0.2); }
  }

  &.error {
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    color: #fff;
    .toast-icon { background: rgba(255, 255, 255, 0.2); }
  }

  &.warning {
    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
    color: #fff;
    .toast-icon { background: rgba(255, 255, 255, 0.2); }
  }
}

.toast-enter-active { animation: toastIn 0.3s ease-out; }
.toast-leave-active { animation: toastOut 0.3s ease-in; }

@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

@keyframes toastOut {
  from { opacity: 1; transform: translateX(-50%) translateY(0); }
  to { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}
</style>