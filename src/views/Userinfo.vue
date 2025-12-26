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
  status: '在线',
  bio: '专注于Web安全研究5年，擅长漏洞挖掘与渗透测试。曾发现多个高危漏洞，获得多家知名企业致谢。热爱技术分享，致力于推动安全社区发展。'
})

// 表单数据
const formData = reactive({
  username: userInfo.username,
  email: userInfo.email,
  phone: userInfo.phone,
  department: userInfo.department,
  position: userInfo.position,
  bio: userInfo.bio
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

// 荣誉资质数据
const certifications = ref([
  { id: 1, name: 'CISP-PTE', issuer: '中国信息安全测评中心', date: '2023.05', type: 'cert', icon: 'medal' },
  { id: 2, name: 'CISSP', issuer: 'ISC²', date: '2022.11', type: 'cert', icon: 'verified' },
  { id: 3, name: '2023年度核心白帽子', issuer: '漏洞赏金平台', date: '2023.12', type: 'honor', icon: 'trophy' },
  { id: 4, name: '漏洞挖掘精英奖', issuer: 'Ssrc安全应急中心', date: '2024.01', type: 'honor', icon: 'star' }
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
    position: userInfo.position,
    bio: userInfo.bio
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
  if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
    alert('请输入新密码')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    console.error('两次输入的密码不一致')
    alert('两次输入的密码不一致，请重新输入')
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
    alert('密码修改成功！')
  } catch (error) {
    console.error('密码修改失败:', error)
    alert('密码修改失败，请重试')
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
                <d-button bs-style="secondary" @click="handlePasswordChange" class="mr-2">
                  <template #icon><d-icon name="lock" /></template>
                  修改密码
                </d-button>
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

          <!-- 荣誉资质 -->
          <div class="cert-section">
            <h3>
              <d-icon name="medal" />
              荣誉资质
            </h3>
            <div class="cert-grid">
              <div v-for="cert in certifications" :key="cert.id" class="cert-item" :class="cert.type">
                <div class="cert-icon">
                  <d-icon :name="cert.icon" />
                </div>
                <div class="cert-info">
                  <div class="cert-name">{{ cert.name }}</div>
                  <div class="cert-issuer">{{ cert.issuer }} · {{ cert.date }}</div>
                </div>
                <div v-if="cert.type === 'honor'" class="cert-tag">荣誉</div>
                <div v-else class="cert-tag">认证</div>
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

        <div class="modal-footer">
          <d-button @click="showPasswordModal = false">取消</d-button>
          <d-button bs-style="primary" :loading="loading" @click="submitPasswordChange" style="margin-left: 12px">确认修改</d-button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.userinfo-page {
  min-height: calc(100vh - 64px);
  height: calc(100vh - 64px);
  background: #f8fafc;
  padding: 24px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
}

.page-content {
  max-width: 1200px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: stretch;
}

.user-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
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
  gap: 8px;
  flex-shrink: 0;
  
  .mr-2 {
    margin-right: 8px;
    position: relative;
    z-index: 10;
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

// 荣誉资质样式
.cert-section {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f1f5f9;

  h3 {
    margin: 0 0 16px;
    font-size: 15px;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 8px;

    .devui-icon {
      color: #f59e0b; // Gold for medal icon
    }
  }
}

.cert-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.cert-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid transparent;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;

  // Certification Style (Blue)
  &.cert {
    background: #f0f9ff;
    border-color: #bae6fd;

    .cert-icon {
      background: #e0f2fe;
      color: #0ea5e9;
    }

    .cert-tag {
      background: #0ea5e9;
    }
    
    &:hover {
      background: #e0f2fe;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(14, 165, 233, 0.1);
    }
  }

  // Honor Style (Gold)
  &.honor {
    background: #fffbeb;
    border-color: #fde68a;

    .cert-icon {
      background: #fef3c7;
      color: #d97706;
    }

    .cert-tag {
      background: #d97706;
    }

    &:hover {
      background: #fef3c7;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.1);
    }
  }

  .cert-icon {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }

  .cert-info {
    flex: 1;

    .cert-name {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }

    .cert-issuer {
      font-size: 12px;
      color: #64748b;
    }
  }

  .cert-tag {
    font-size: 10px;
    color: #fff;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;
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

@media (max-width: 900px) {
  .page-content {
    grid-template-columns: 1fr;
  }

  .side-section {
    order: -1;
    flex-direction: row;
    flex-wrap: wrap;
    height: auto;
  }

  .stats-card,
  .skill-card,
  .ranking-card {
    flex: 1;
    min-width: 200px;
  }
}

@media (max-width: 640px) {
  .userinfo-page {
    padding: 16px;
    height: auto;
    min-height: calc(100vh - 64px);
  }

  .page-content {
    height: auto;
  }

  .user-card {
    height: auto;
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

  .side-section {
    flex-direction: column;
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
  }

  .cert-grid {
    grid-template-columns: 1fr;
    gap: 12px;
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

      &:hover {
        background: #f1f5f9;
        color: #64748b;
      }
    }
  }

  .modal-footer {
    margin-top: 24px;
    display: flex;
    justify-content: flex-end;
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
</style>