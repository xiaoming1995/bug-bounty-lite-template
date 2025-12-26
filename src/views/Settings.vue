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

    <d-row :gutter="24">
      <!-- 左侧：系统偏好 -->
      <d-col :xs="24" :lg="16">
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
        </d-card>
      </d-col>

      <!-- 右侧：快捷操作和帮助支持 -->
      <d-col :xs="24" :lg="8">
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
.settings-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 24px;

  .page-title {
    margin: 0 0 8px;
    font-size: 24px;
    font-weight: 600;
    color: #252b3a;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .page-desc {
    margin: 0;
    font-size: 14px;
    color: #666;
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

// 密码表单
.password-form {
  :deep(.devui-form-item) {
    margin-bottom: 16px;
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
  .settings-container {
    padding: 16px;
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
</style>
