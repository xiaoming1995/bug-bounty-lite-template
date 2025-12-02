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
  joinDate: '2022-03-15',
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

// 系统偏好设置
const preferences = reactive({
  emailNotification: true,
  smsNotification: false,
  autoLogin: true,
  darkMode: false
})

// 响应式状态
const loading = ref(false)
const editMode = ref(false)
const showPasswordModal = ref(false)
const avatarUploadRef = ref()

// 统计数据
const userStats = ref([
  { label: '发现漏洞', value: 156, icon: 'bug', color: '#f66f6a' },
  { label: '提交报告', value: 89, icon: 'file-text', color: '#5e7ce0' },
  { label: '处理警告', value: 234, icon: 'warning', color: '#faa219' },
  { label: '在线天数', value: 298, icon: 'calendar', color: '#50d4ab' }
])

// 最近活动
const recentActivities = ref([
  {
    id: 1,
    type: 'vulnerability',
    title: '发现Apache Struts2高危漏洞',
    time: '2024-01-20 10:30',
    status: 'success'
  },
  {
    id: 2,
    type: 'report',
    title: '提交安全分析报告',
    time: '2024-01-19 16:45',
    status: 'info'
  },
  {
    id: 3,
    type: 'warning',
    title: '处理系统安全警告',
    time: '2024-01-19 09:15',
    status: 'warning'
  },
  {
    id: 4,
    type: 'login',
    title: '登录系统',
    time: '2024-01-18 08:30',
    status: 'default'
  }
])

// 方法
const handleEdit = () => {
  editMode.value = true
}

const handleCancel = () => {
  editMode.value = false
  // 重置表单数据
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
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新用户信息
    Object.assign(userInfo, formData)
    editMode.value = false

    // 显示成功消息
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
    // 模拟API调用
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

const getActivityIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    vulnerability: 'bug',
    report: 'file-text',
    warning: 'warning',
    login: 'user'
  }
  return iconMap[type] || 'info'
}

const getActivityColor = (status: string) => {
  const colorMap: Record<string, string> = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    default: 'secondary'
  }
  return colorMap[status] || 'secondary'
}

// 快捷操作方法
const goToVulnerabilityReport = () => {
  console.log('跳转到漏洞提交页面')
  // 这里可以使用 router.push('/vulnerability-report')
}

const goToDatabase = () => {
  console.log('跳转到漏洞库页面')
  // 这里可以使用 router.push('/database')
}

const downloadReport = () => {
  console.log('下载报告')
  // 实现报告下载功能
}

const exportData = () => {
  console.log('导出数据')
  // 实现数据导出功能
}
</script>

<template>
  <Header />

  <div class="userinfo-container">
    <!-- 用户基本信息卡片 -->
    <d-card class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <d-avatar
            :width="80"
            :height="80"
            :img-src="userInfo.avatar"
            :icon="!userInfo.avatar ? 'user' : undefined"
            class="user-avatar"
          />
          <input
            ref="avatarUploadRef"
            type="file"
            accept="image/*"
            @change="onAvatarChange"
            style="display: none"
          />
          <d-button
            bs-style="text"
            bs-size="sm"
            class="avatar-upload-btn"
            @click="handleAvatarUpload"
          >
            <d-icon name="camera" />
            更换头像
          </d-button>
        </div>

        <div class="user-basic-info">
          <div class="user-name-section">
            <h2 class="username">{{ userInfo.username }}</h2>
            <d-tag :color="userInfo.status === '在线' ? 'success' : 'secondary'" size="sm">
              {{ userInfo.status }}
            </d-tag>
          </div>
          <div class="user-details">
            <div class="detail-item">
              <d-icon name="mail" />
              <span>{{ userInfo.email }}</span>
            </div>
            <div class="detail-item">
              <d-icon name="phone" />
              <span>{{ userInfo.phone }}</span>
            </div>
            <div class="detail-item">
              <d-icon name="building" />
              <span>{{ userInfo.department }}</span>
            </div>
            <div class="detail-item">
              <d-icon name="user-circle" />
              <span>{{ userInfo.position }}</span>
            </div>
          </div>
        </div>

        <div class="profile-actions">
          <d-button
            v-if="!editMode"
            bs-style="primary"
            @click="handleEdit"
          >
            <template #icon><d-icon name="edit" /></template>
            编辑资料
          </d-button>
          <div v-else class="edit-actions">
            <d-button
              bs-style="primary"
              :loading="loading"
              @click="handleSave"
            >
              保存
            </d-button>
            <d-button
              bs-style="common"
              @click="handleCancel"
            >
              取消
            </d-button>
          </div>
          <d-button
            bs-style="text"
            @click="handlePasswordChange"
          >
            <template #icon><d-icon name="lock" /></template>
            修改密码
          </d-button>
        </div>
      </div>
    </d-card>

    <d-row :gutter="24">
      <!-- 左侧：详细信息表单 -->
      <d-col :xs="24" :lg="16">
        <d-card class="info-form-card">
          <div class="card-header">
            <h3>
              <d-icon name="user" />
              个人信息
            </h3>
          </div>

          <d-form
            :data="formData"
            layout="horizontal"
            label-size="md"
            class="user-form"
          >
            <d-row :gutter="16">
              <d-col :xs="24" :md="12">
                <d-form-item label="用户名">
                  <d-input
                    v-model="formData.username"
                    :disabled="!editMode"
                    placeholder="请输入用户名"
                  />
                </d-form-item>
              </d-col>

              <d-col :xs="24" :md="12">
                <d-form-item label="邮箱">
                  <d-input
                    v-model="formData.email"
                    :disabled="!editMode"
                    placeholder="请输入邮箱地址"
                  />
                </d-form-item>
              </d-col>
            </d-row>

            <d-row :gutter="16">
              <d-col :xs="24" :md="12">
                <d-form-item label="手机号">
                  <d-input
                    v-model="formData.phone"
                    :disabled="!editMode"
                    placeholder="请输入手机号"
                  />
                </d-form-item>
              </d-col>

              <d-col :xs="24" :md="12">
                <d-form-item label="部门">
                  <d-input
                    v-model="formData.department"
                    :disabled="!editMode"
                    placeholder="请输入部门"
                  />
                </d-form-item>
              </d-col>
            </d-row>

            <d-row :gutter="16">
              <d-col :xs="24" :md="12">
                <d-form-item label="职位">
                  <d-input
                    v-model="formData.position"
                    :disabled="!editMode"
                    placeholder="请输入职位"
                  />
                </d-form-item>
              </d-col>

              <d-col :xs="24" :md="12">
                <d-form-item label="入职日期">
                  <d-input
                    :model-value="userInfo.joinDate"
                    disabled
                    placeholder="入职日期"
                  />
                </d-form-item>
              </d-col>
            </d-row>

            <d-form-item label="最后登录">
              <d-input
                :model-value="userInfo.lastLogin"
                disabled
                placeholder="最后登录时间"
              />
            </d-form-item>
          </d-form>
        </d-card>

        <!-- 安全设置卡片 -->
        <d-card class="security-card">
          <div class="card-header">
            <h3>
              <d-icon name="shield" />
              安全设置
            </h3>
          </div>

          <div class="security-items">
            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <d-icon name="lock" />
                  登录密码
                </div>
                <div class="security-desc">定期更换密码可以提高账户安全性</div>
              </div>
              <d-button bs-style="text" @click="handlePasswordChange">
                修改
              </d-button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <d-icon name="phone" />
                  手机绑定
                </div>
                <div class="security-desc">已绑定手机：{{ userInfo.phone }}</div>
              </div>
              <d-button bs-style="text">
                更换
              </d-button>
            </div>

            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <d-icon name="mail" />
                  邮箱验证
                </div>
                <div class="security-desc">已验证邮箱：{{ userInfo.email }}</div>
              </div>
              <d-tag color="success" size="sm">已验证</d-tag>
            </div>

            <div class="security-item">
              <div class="security-info">
                <div class="security-title">
                  <d-icon name="key" />
                  两步验证
                </div>
                <div class="security-desc">开启两步验证可以大大提高账户安全性</div>
              </div>
              <d-button bs-style="text">
                开启
              </d-button>
            </div>
          </div>
        </d-card>

        <!-- 系统偏好设置 -->
        <d-card class="preferences-card">
          <div class="card-header">
            <h3>
              <d-icon name="setting" />
              系统偏好
            </h3>
          </div>

          <div class="preferences-items">
            <div class="preference-item">
              <div class="preference-info">
                <div class="preference-title">邮件通知</div>
                <div class="preference-desc">接收系统重要通知和安全警报</div>
              </div>
              <d-switch v-model="preferences.emailNotification" />
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <div class="preference-title">短信通知</div>
                <div class="preference-desc">接收紧急安全事件短信提醒</div>
              </div>
              <d-switch v-model="preferences.smsNotification" />
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <div class="preference-title">自动登录</div>
                <div class="preference-desc">在此设备上保持登录状态</div>
              </div>
              <d-switch v-model="preferences.autoLogin" />
            </div>

            <div class="preference-item">
              <div class="preference-info">
                <div class="preference-title">深色模式</div>
                <div class="preference-desc">使用深色主题保护眼睛</div>
              </div>
              <d-switch v-model="preferences.darkMode" />
            </div>
          </div>
        </d-card>
      </d-col>

      <!-- 右侧：统计信息和活动记录 -->
      <d-col :xs="24" :lg="8">
        <!-- 统计卡片 -->
        <d-card class="stats-card">
          <div class="card-header">
            <h3>
              <d-icon name="bar-chart" />
              数据统计
            </h3>
          </div>

          <div class="stats-grid">
            <div
              v-for="stat in userStats"
              :key="stat.label"
              class="stat-item"
            >
              <div class="stat-icon" :style="{ color: stat.color }">
                <d-icon :name="stat.icon" size="20px" />
              </div>
              <div class="stat-content">
                <div class="stat-value">{{ stat.value }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </d-card>

        <!-- 最近活动 -->
        <d-card class="activity-card">
          <div class="card-header">
            <h3>
              <d-icon name="clock" />
              最近活动
            </h3>
          </div>

          <div class="activity-list">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="activity-item"
            >
              <div class="activity-icon">
                <d-icon :name="getActivityIcon(activity.type)" />
              </div>
              <div class="activity-content">
                <div class="activity-title">{{ activity.title }}</div>
                <div class="activity-time">{{ activity.time }}</div>
              </div>
              <d-tag :color="getActivityColor(activity.status)" size="sm">
                {{ activity.status }}
              </d-tag>
            </div>
          </div>
        </d-card>

        <!-- 快捷操作 -->
        <d-card class="quick-actions-card">
          <div class="card-header">
            <h3>
              <d-icon name="flash" />
              快捷操作
            </h3>
          </div>

          <div class="quick-actions">
            <d-button
              bs-style="primary"
              class="quick-action-btn"
              @click="goToVulnerabilityReport"
            >
              <template #icon><d-icon name="plus" /></template>
              提交漏洞
            </d-button>

            <d-button
              bs-style="common"
              class="quick-action-btn"
              @click="goToDatabase"
            >
              <template #icon><d-icon name="database" /></template>
              查看漏洞库
            </d-button>

            <d-button
              bs-style="common"
              class="quick-action-btn"
              @click="downloadReport"
            >
              <template #icon><d-icon name="download" /></template>
              下载报告
            </d-button>

            <d-button
              bs-style="text"
              class="quick-action-btn"
              @click="exportData"
            >
              <template #icon><d-icon name="export" /></template>
              导出数据
            </d-button>
          </div>
        </d-card>

        <!-- 系统信息 -->
        <d-card class="system-info-card">
          <div class="card-header">
            <h3>
              <d-icon name="info" />
              系统信息
            </h3>
          </div>

          <div class="system-info-list">
            <div class="system-info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">v2.1.0</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">浏览器</span>
              <span class="info-value">Chrome 120.0</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">IP地址</span>
              <span class="info-value">192.168.1.100</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">登录时间</span>
              <span class="info-value">{{ userInfo.lastLogin }}</span>
            </div>
            <div class="system-info-item">
              <span class="info-label">会话状态</span>
              <d-tag color="success" size="sm">活跃</d-tag>
            </div>
          </div>
        </d-card>

        <!-- 帮助与支持 -->
        <d-card class="help-card">
          <div class="card-header">
            <h3>
              <d-icon name="help" />
              帮助与支持
            </h3>
          </div>

          <div class="help-links">
            <a href="#" class="help-link">
              <d-icon name="book" />
              <span>用户手册</span>
            </a>
            <a href="#" class="help-link">
              <d-icon name="question" />
              <span>常见问题</span>
            </a>
            <a href="#" class="help-link">
              <d-icon name="message" />
              <span>联系客服</span>
            </a>
            <a href="#" class="help-link">
              <d-icon name="feedback" />
              <span>意见反馈</span>
            </a>
          </div>
        </d-card>
      </d-col>
    </d-row>
  </div>

  <!-- 密码修改弹窗 -->
  <d-modal
    v-model:visible="showPasswordModal"
    title="修改密码"
    :show-close="true"
    width="400px"
  >
    <d-form
      :data="passwordForm"
      layout="vertical"
      class="password-form"
    >
      <d-form-item label="当前密码">
        <d-input
          v-model="passwordForm.oldPassword"
          type="password"
          placeholder="请输入当前密码"
        />
      </d-form-item>

      <d-form-item label="新密码">
        <d-input
          v-model="passwordForm.newPassword"
          type="password"
          placeholder="请输入新密码"
        />
      </d-form-item>

      <d-form-item label="确认新密码">
        <d-input
          v-model="passwordForm.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
        />
      </d-form-item>
    </d-form>

    <template #footer>
      <d-button @click="showPasswordModal = false">取消</d-button>
      <d-button
        bs-style="primary"
        :loading="loading"
        @click="submitPasswordChange"
      >
        确认修改
      </d-button>
    </template>
  </d-modal>
</template>

<style scoped lang="scss">
.userinfo-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

// 个人资料卡片
.profile-card {
  margin-bottom: 24px;

  .profile-header {
    display: flex;
    align-items: flex-start;
    gap: 24px;

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;

      .user-avatar {
        border: 3px solid #f0f0f0;
        transition: all 0.3s;

        &:hover {
          border-color: #5e7ce0;
        }
      }

      .avatar-upload-btn {
        font-size: 12px;
        color: #666;

        &:hover {
          color: #5e7ce0;
        }
      }
    }

    .user-basic-info {
      flex: 1;

      .user-name-section {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;

        .username {
          margin: 0;
          font-size: 24px;
          font-weight: 600;
          color: #252b3a;
        }
      }

      .user-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 12px;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #666;

          .devui-icon {
            color: #999;
          }
        }
      }
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .edit-actions {
        display: flex;
        gap: 8px;
      }
    }
  }
}

// 卡片通用样式
.card-header {
  margin-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #252b3a;
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

// 信息表单卡片
.info-form-card {
  margin-bottom: 24px;

  .user-form {
    :deep(.devui-form-item) {
      margin-bottom: 20px;

      .devui-form-label {
        font-weight: 500;
        color: #333;
      }

      .devui-input {
        &:disabled {
          background: #f8f9fa;
          color: #666;
        }
      }
    }
  }
}

// 统计卡片
.stats-card {
  margin-bottom: 24px;

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      background: #f8f9fa;
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        background: #f0f2f5;
        transform: translateY(-2px);
      }

      .stat-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
      }

      .stat-content {
        .stat-value {
          font-size: 20px;
          font-weight: bold;
          color: #252b3a;
          line-height: 1.2;
        }

        .stat-label {
          font-size: 12px;
          color: #666;
          margin-top: 2px;
        }
      }
    }
  }
}

// 活动卡片
.activity-card {
  .activity-list {
    .activity-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .activity-icon {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border-radius: 50%;
        color: #666;
      }

      .activity-content {
        flex: 1;

        .activity-title {
          font-size: 14px;
          color: #333;
          margin-bottom: 4px;
        }

        .activity-time {
          font-size: 12px;
          color: #999;
        }
      }
    }
  }
}

// 密码表单
.password-form {
  :deep(.devui-form-item) {
    margin-bottom: 16px;
  }
}

// 安全设置卡片
.security-card {
  margin-bottom: 24px;

  .security-items {
    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .security-info {
        flex: 1;

        .security-title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .security-desc {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}

// 偏好设置卡片
.preferences-card {
  margin-bottom: 24px;

  .preferences-items {
    .preference-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .preference-info {
        flex: 1;

        .preference-title {
          font-size: 14px;
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .preference-desc {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
}

// 快捷操作卡片
.quick-actions-card {
  margin-bottom: 24px;

  .quick-actions {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .quick-action-btn {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      border-radius: 6px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

// 系统信息卡片
.system-info-card {
  margin-bottom: 24px;

  .system-info-list {
    .system-info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      &:last-child {
        border-bottom: none;
      }

      .info-label {
        font-size: 14px;
        color: #666;
      }

      .info-value {
        font-size: 14px;
        color: #333;
        font-weight: 500;
      }
    }
  }
}

// 帮助卡片
.help-card {
  .help-links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;

    .help-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 6px;
      text-decoration: none;
      color: #666;
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        background: #e9ecef;
        color: #5e7ce0;
        text-decoration: none;
      }

      .devui-icon {
        font-size: 16px;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .userinfo-container {
    padding: 16px;
  }

  .profile-header {
    flex-direction: column !important;
    text-align: center;

    .user-basic-info {
      .user-details {
        grid-template-columns: 1fr !important;
      }
    }

    .profile-actions {
      width: 100%;

      .edit-actions {
        justify-content: center;
      }
    }
  }

  .stats-grid {
    grid-template-columns: 1fr !important;
  }

  .quick-actions {
    grid-template-columns: 1fr !important;

    .quick-action-btn {
      height: 40px !important;
    }
  }

  .help-links {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .profile-header {
    .avatar-section {
      .user-avatar {
        width: 60px !important;
        height: 60px !important;
      }
    }

    .user-name-section {
      flex-direction: column !important;
      gap: 8px !important;
    }
  }
}
</style>