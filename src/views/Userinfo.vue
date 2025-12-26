<script setup lang="ts">
import { ref, reactive } from 'vue'
import Header from './Public/Header.vue'

// 用户信息数据
const userInfo = reactive({
  avatar: '',
  username: '安全研究员',
  email: 'security@example.com',
  phone: '138****8888',
  department: '安全研究部',
  position: '高级安全工程师',
  lastLogin: '2024-01-20 14:30:25',
  status: '在线'
})

// 表单数据
const formData = reactive({
  username: userInfo.username,
  email: userInfo.email,
  phone: userInfo.phone,
  department: userInfo.department,
  position: userInfo.position
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

// 统计数据
const userStats = ref([
  { label: '发现漏洞', value: 156, color: '#ef4444' },
  { label: '提交报告', value: 89, color: '#3b82f6' },
  { label: '处理警告', value: 234, color: '#f59e0b' },
  { label: '在线天数', value: 298, color: '#10b981' }
])

// 方法
const handleEdit = () => {
  editMode.value = true
}

const handleCancel = () => {
  editMode.value = false
  Object.assign(formData, {
    username: userInfo.username,
    email: userInfo.email,
    phone: userInfo.phone,
    department: userInfo.department,
    position: userInfo.position
  })
}

const handleSave = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    Object.assign(userInfo, formData)
    editMode.value = false
    console.log('用户信息更新成功')
  } catch (error) {
    console.error('更新失败:', error)
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
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    console.error('两次输入的密码不一致')
    return
  }

  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    showPasswordModal.value = false
    Object.assign(passwordForm, {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    console.log('密码修改成功')
  } catch (error) {
    console.error('密码修改失败:', error)
  } finally {
    loading.value = false
  }
}
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
                <h1>{{ userInfo.username }}</h1>
                <d-tag :color="userInfo.status === '在线' ? 'success' : 'secondary'" size="sm">
                  {{ userInfo.status }}
                </d-tag>
              </div>
              <p class="position">{{ userInfo.position }} · {{ userInfo.department }}</p>
            </div>

            <div class="header-actions">
              <template v-if="!editMode">
                <d-button bs-style="primary" @click="handleEdit">
                  <template #icon><d-icon name="edit" /></template>
                  编辑
                </d-button>
              </template>
              <template v-else>
                <d-button bs-style="primary" :loading="loading" @click="handleSave">保存</d-button>
                <d-button bs-style="common" @click="handleCancel">取消</d-button>
              </template>
            </div>
          </div>

          <!-- 信息表单 -->
          <div class="info-grid">
            <div class="info-item">
              <label>用户名</label>
              <d-input v-model="formData.username" :disabled="!editMode" />
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
              <d-input v-model="formData.department" :disabled="!editMode" />
            </div>
            <div class="info-item">
              <label>职位</label>
              <d-input v-model="formData.position" :disabled="!editMode" />
            </div>
            <div class="info-item">
              <label>最后登录</label>
              <d-input :model-value="userInfo.lastLogin" disabled />
            </div>
          </div>

          <div class="card-footer">
            <d-button bs-style="text" @click="handlePasswordChange">
              <template #icon><d-icon name="lock" /></template>
              修改密码
            </d-button>
          </div>
        </div>
      </div>

      <!-- 右侧：统计 -->
      <div class="side-section">
        <div class="stats-card">
          <h3>数据概览</h3>
          <div class="stats-list">
            <div v-for="stat in userStats" :key="stat.label" class="stat-row">
              <span class="stat-label">{{ stat.label }}</span>
              <span class="stat-value" :style="{ color: stat.color }">{{ stat.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 密码修改弹窗 -->
  <d-modal
    v-model:visible="showPasswordModal"
    title="修改密码"
    :show-close="true"
    width="400px"
  >
    <d-form :data="passwordForm" layout="vertical">
      <d-form-item label="当前密码">
        <d-input v-model="passwordForm.oldPassword" type="password" placeholder="请输入当前密码" />
      </d-form-item>
      <d-form-item label="新密码">
        <d-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
      </d-form-item>
      <d-form-item label="确认新密码">
        <d-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </d-form-item>
    </d-form>

    <template #footer>
      <d-button @click="showPasswordModal = false">取消</d-button>
      <d-button bs-style="primary" :loading="loading" @click="submitPasswordChange">确认修改</d-button>
    </template>
  </d-modal>
</template>

<style scoped lang="scss">
.userinfo-page {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
  padding: 24px;
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
}

.user-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  gap: 8px;
  flex-shrink: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
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

.card-footer {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.stats-card {
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

@media (max-width: 900px) {
  .page-content {
    grid-template-columns: 1fr;
  }

  .side-section {
    order: -1;
  }
}

@media (max-width: 640px) {
  .userinfo-page {
    padding: 16px;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
  }

  .header-actions {
    width: 100%;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
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
  }
}
</style>