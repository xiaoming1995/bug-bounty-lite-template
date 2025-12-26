<script setup lang="ts">
import { reactive, ref } from 'vue'
import Header from './Public/Header.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 系统偏好设置
const preferences = reactive({
  emailNotification: true,
  smsNotification: false,
  autoLogin: true,
  darkMode: false
})

// 安全设置数据
const securityInfo = reactive({
  phone: '138****8888',
  email: 'security@example.com'
})

// 登录设备数据
const loginDevices = ref([
  { id: 1, name: 'MacBook Pro 14"', location: '杭州', ip: '192.168.1.100', time: '当前设备', icon: 'laptop', active: true },
  { id: 2, name: 'Windows 11 Desktop', location: '上海', ip: '10.0.0.55', time: '2小时前', icon: 'pc', active: false },
  { id: 3, name: 'Ubuntu Workstation', location: '北京', ip: '172.16.0.5', time: '3天前', icon: 'pc', active: false }
])

// 密码修改表单
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const showPasswordModal = ref(false)
const loading = ref(false)

// 快捷操作方法
const goToVulnerabilityReport = () => {
  router.push('/submit')
}

const goToDatabase = () => {
  router.push('/database')
}

const downloadReport = () => {
  console.log('下载报告')
  // 实现报告下载功能
}

const exportData = () => {
  console.log('导出数据')
  // 实现数据导出功能
}

// 安全设置方法
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
</script>

<template>
  <Header />

  <div class="settings-container">
    <div class="page-header">
      <h1 class="page-title">
        <d-icon name="setting" />
        设置中心
      </h1>
      <p class="page-desc">管理您的系统偏好设置和快捷操作</p>
    </div>

    <div class="page-content">
      <div class="left-section">
        <!-- 系统偏好设置 -->
        <div class="preferences-card card-common">
          <div class="card-header">
            <h3><d-icon name="setting" />系统偏好</h3>
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
        </div>

        <!-- 安全设置卡片 -->
        <div class="security-card card-common">
          <div class="card-header">
            <h3><d-icon name="shield" />安全设置</h3>
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
                <div class="security-desc">已绑定手机：{{ securityInfo.phone }}</div>
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
                <div class="security-desc">已验证邮箱：{{ securityInfo.email }}</div>
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

        </div>
      </div>

      <div class="right-section">
        <!-- 快捷操作 -->
        <div class="quick-actions-card card-common">
          <div class="card-header">
            <h3><d-icon name="flash" />快捷操作</h3>
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
        </div>

        <!-- 帮助与支持 -->
        <div class="help-card card-common">
          <div class="card-header">
            <h3><d-icon name="help" />帮助与支持</h3>
          </div>
          <div class="help-links">
            <a href="#" class="help-link"><d-icon name="book" /><span>用户手册</span></a>
            <a href="#" class="help-link"><d-icon name="question" /><span>常见问题</span></a>
            <a href="#" class="help-link"><d-icon name="message" /><span>联系客服</span></a>
            <a href="#" class="help-link"><d-icon name="feedback" /><span>意见反馈</span></a>
          </div>
        </div>

        <!-- 登录设备 -->
        <div class="devices-card card-common">
          <div class="card-header">
            <h3><d-icon name="laptop" />登录设备</h3>
          </div>
          <div class="device-list">
            <div v-for="device in loginDevices" :key="device.id" class="device-item">
              <div class="device-icon">
                <d-icon :name="device.icon === 'mobile' ? 'mobile' : 'laptop'" />
              </div>
              <div class="device-info">
                <div class="device-name">
                  {{ device.name }}
                  <d-tag v-if="device.active" color="success" size="sm">当前</d-tag>
                </div>
                <div class="device-meta">{{ device.location }} · {{ device.ip }}</div>
                <div class="device-time">{{ device.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 密码修改弹窗 -->
  <!-- 密码修改弹窗（自定义实现） -->
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
.settings-container {
  padding: 24px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  height: calc(100vh - 64px);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-header {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 24px;
  flex-shrink: 0;
}

.page-content {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  height: 100%;
  min-height: 0;
}

.left-section, .right-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  overflow-y: auto;
  padding-bottom: 24px;
  
  &::-webkit-scrollbar {
    width: 0px;
  }
}

.card-common {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}

.card-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .devui-icon {
    color: #5e7ce0;
  }
}

// Preference & Security Items
.preference-item, .security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f1f5f9;
  
  &:last-child {
    border-bottom: none;
  }
  
  .preference-title, .security-title {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .devui-icon {
      color: #94a3b8;
      font-size: 16px;
    }
  }
  
  .preference-desc, .security-desc {
    font-size: 12px;
    color: #64748b;
  }
}

// Quick Actions
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  .quick-action-btn {
    height: 48px;
    width: 100%;
    justify-content: center;
    font-weight: 500;
  }
}

// Help Links
.help-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  
  .help-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 20px;
    background: #f8fafc;
    border-radius: 8px;
    text-decoration: none;
    color: #64748b;
    font-size: 13px;
    border: 1px solid transparent;
    transition: all 0.2s;
    
    .devui-icon {
      font-size: 24px;
      color: #94a3b8;
    }
    
    &:hover {
      background: #fff;
      border-color: #e2e8f0;
      color: #5e7ce0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transform: translateY(-2px);
      
      .devui-icon {
        color: #5e7ce0;
      }
    }
  }
}

// Device List
.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-item {
  display: flex;
  align-items: center; // Align center vertically
  gap: 16px; // Increase gap
  padding: 16px; // Increase padding
  background: #ffffff; // White background
  border: 1px solid #f1f5f9; // Subtle border
  border-radius: 12px; // Rounded corners
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #e2e8f0;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
  
  .device-icon {
    width: 42px; // Larger icon
    height: 42px;
    background: #f8fafc;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    font-size: 20px; // Larger icon size
    transition: all 0.3s;
  }

  &:hover .device-icon {
    background: #eff6ff;
    color: #3b82f6;
  }
  
  .device-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .device-name {
      font-size: 15px; // Slightly larger title
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .device-meta {
      font-size: 13px;
      color: #64748b;
    }

    .device-time {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 2px;
    }
  }
}

// Custom Modal Theme
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

@media (max-width: 900px) {
  .page-content {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .settings-container {
    height: auto;
  }
}
</style>
