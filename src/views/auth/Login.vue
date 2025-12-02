<template>
  <div class="login-page" :class="{ 'dark-mode': isDark }">
    <!-- 左侧品牌区域 -->
    <div class="brand-section">
      <div class="brand-content">
        <div class="brand-logo">
          <d-icon name="shield" size="48px" color="#fff" />
          <span class="brand-name">SecPlatform</span>
        </div>
        <div class="brand-slogan">
          <h1>安全漏洞管理平台</h1>
          <p>专业的企业级安全风险管控系统</p>
        </div>
        <div class="brand-features">
          <div class="feature-item">
            <d-icon name="priority" size="20px" />
            <span>全方位漏洞监控</span>
          </div>
          <div class="feature-item">
            <d-icon name="data-transfer" size="20px" />
            <span>实时风险预警</span>
          </div>
          <div class="feature-item">
            <d-icon name="collapse" size="20px" />
            <span>自动化报告生成</span>
          </div>
        </div>
      </div>
      <!-- 动态背景装饰 -->
      <div class="brand-bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
      </div>
    </div>

    <!-- 右侧登录表单区域 -->
    <div class="form-section">
      <div class="theme-toggle" @click="toggleTheme">
        <d-icon :name="isDark ? 'sun' : 'moon'" size="20px" />
      </div>

      <div class="form-container">
        <div class="form-header">
          <h2>欢迎回来</h2>
          <p>请登录您的账户以继续使用</p>
        </div>

        <d-form
          ref="loginFormRef"
          :data="formData"
          :rules="formRules"
          @submit="handleSubmit"
          class="login-form"
          layout="vertical"
        >
          <d-form-item field="username" class="form-item-custom">
            <d-input
              v-model="formData.username"
              placeholder="请输入用户名或邮箱"
              size="lg"
              :error="!!errors.username"
              @blur="validateUsername"
              @input="clearFieldError('username')"
            >
              <template #prefix>
                <d-icon name="user" />
              </template>
            </d-input>
            <div v-if="errors.username" class="field-error">{{ errors.username }}</div>
          </d-form-item>

          <d-form-item field="password" class="form-item-custom">
            <d-input
              ref="passwordInput"
              v-model="formData.password"
              password
              :show-password="true"
              placeholder="请输入密码"
              size="lg"
              :error="!!errors.password"
              :disabled="loading"
              autocomplete="current-password"
              @blur="validatePassword"
              @input="clearFieldError('password')"
              @keyup.enter="handleSubmit"
            >
              <template #prefix>
                <d-icon name="lock" />
              </template>
            </d-input>
            <div v-if="errors.password" class="field-error">{{ errors.password }}</div>
          </d-form-item>

          <div class="login-options">
            <d-checkbox v-model="formData.remember">记住我</d-checkbox>
            <span class="forgot-link" @click="showForgotModal = true">忘记密码？</span>
          </div>

          <d-button
            type="submit"
            variant="solid"
            color="primary"
            size="lg"
            :loading="loading"
            :disabled="!isFormValid"
            class="submit-btn"
          >
            {{ loading ? '登录中...' : '立即登录' }}
          </d-button>
        </d-form>

        <div class="social-login-divider">
          <span>其他登录方式</span>
        </div>

        <div class="social-login-actions">
          <div class="social-btn wechat" @click="socialLogin('wechat')">
            <d-icon name="wechat" size="20px" />
          </div>
          <div class="social-btn github" @click="socialLogin('github')">
            <d-icon name="github" size="20px" />
          </div>
        </div>

        <div class="register-hint">
          还没有账号？ <span class="register-link" @click="goToRegister">立即注册</span>
        </div>
      </div>
    </div>

    <!-- 忘记密码模态框 -->
    <d-modal
      v-model="showForgotModal"
      title="重置密码"
      :show-close="true"
      class="forgot-modal"
    >
      <div class="modal-content">
        <p class="modal-desc">请输入您的注册邮箱，我们将向您发送重置密码的链接。</p>
        <d-form-item>
          <d-input
            v-model="resetEmail"
            placeholder="请输入邮箱地址"
            size="lg"
          >
            <template #prefix>
              <d-icon name="mail" />
            </template>
          </d-input>
        </d-form-item>
      </div>
      <template #footer>
        <d-button @click="closeForgotModal" variant="outline">取消</d-button>
        <d-button
          variant="solid"
          color="primary"
          @click="handleResetPassword"
          :disabled="!resetEmail"
        >
          发送重置链接
        </d-button>
      </template>
    </d-modal>

    <!-- 消息提示模态框 -->
    <d-modal
      v-model="showMessageModal"
      :title="messageType === 'success' ? '登录成功' : '登录失败'"
      :show-close="messageType === 'error'"
      @close="closeMessageModal"
      class="message-modal"
      :class="messageType"
      width="400px"
    >
      <div class="message-modal-content">
        <div class="message-icon" :class="messageType">
          <d-icon :name="messageType === 'success' ? 'right' : 'close'" size="48px" />
        </div>
        <p class="message-text" :class="messageType">
          {{ messageText }}
        </p>
        <p v-if="messageType === 'success'" class="countdown-text">
          {{ countdown }} 秒后自动跳转...
        </p>
      </div>

    </d-modal>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user'

export default {
  name: 'LoginPage',
  data() {
    return {
      isDark: false,
      loading: false,
      showPassword: false,
      showForgotModal: false,
      showMessageModal: false,
      messageType: 'success',
      messageText: '',
      countdown: 2,
      countdownTimer: null as ReturnType<typeof setInterval> | null,
      resetEmail: '',
      formData: {
        username: '',
        password: '',
        remember: false
      },
      errors: {
        username: '',
        password: ''
      },
      formRules: {
        username: [],
        password: []
      }
    }
  },
  computed: {
    isFormValid() {
      return this.formData.username.trim() &&
             this.formData.password.trim() &&
             !this.errors.username &&
             !this.errors.password
    }
  },
  methods: {
    toggleTheme() {
      this.isDark = !this.isDark
      document.documentElement.classList.toggle('dark', this.isDark)
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
    },
    togglePasswordVisibility() {
      if (this.loading) return
      this.showPassword = !this.showPassword
    },
    validateUsername() {
      const username = this.formData.username.trim()
      if (!username) {
        this.errors.username = '请输入用户名或邮箱'
        return false
      }
      this.errors.username = ''
      return true
    },
    validatePassword() {
      const password = this.formData.password
      if (!password) {
        this.errors.password = '请输入密码'
        return false
      }
      if (password.length < 6) {
        this.errors.password = '密码至少6个字符'
        return false
      }
      this.errors.password = ''
      return true
    },
    clearFieldError(field: string) {
      this.errors[field as keyof typeof this.errors] = ''
    },
    showMessage(type: 'success' | 'error', text: string) {
      this.messageType = type
      this.messageText = text
      this.showMessageModal = true
      
      // 如果是成功消息，启动倒计时
      if (type === 'success') {
        this.countdown = 2
        this.startCountdown()
      }
    },
    startCountdown() {
      // 清除之前的定时器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
      }
      
      this.countdownTimer = setInterval(() => {
        this.countdown--
        
        if (this.countdown <= 0) {
          if (this.countdownTimer) {
            clearInterval(this.countdownTimer)
          }
          this.countdownTimer = null
          this.closeMessageModal()
        }
      }, 1000)
    },
    closeMessageModal() {
      // 清除倒计时定时器
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      
      this.showMessageModal = false
      
      // 只有成功消息才跳转，错误消息不跳转
      if (this.messageType === 'success') {
        // 登录成功后跳转
        // 检查是否有重定向参数
        const redirect = this.$route.query.redirect as string
        const targetPath = redirect || '/'
        
        this.$router.push(targetPath).catch((err: any) => {
          console.error('路由跳转失败:', err)
          // 如果跳转失败，至少跳转到首页
          this.$router.push('/')
        })
      }
      // 如果是错误消息，不执行任何跳转，停留在登录页
    },
    async handleSubmit() {
      // 前端验证
      const isUsernameValid = this.validateUsername()
      const isPasswordValid = this.validatePassword()

      if (!isUsernameValid || !isPasswordValid) {
        this.showMessage('error', '请填写完整的登录信息')
        return
      }

      // 开始加载
      this.loading = true
      
      try {
        // 使用 Pinia store 进行登录
        const userStore = useUserStore()
        
        // 调用登录接口
        const success = await userStore.login({
          username: this.formData.username.trim(),
          password: this.formData.password
        })
        
        // 只有真正成功（返回 true）才处理后续逻辑
        if (success) {
          // 保存"记住我"选项
          if (this.formData.remember) {
            localStorage.setItem('remember_user', this.formData.username.trim())
          } else {
            localStorage.removeItem('remember_user')
          }
          
          // 获取用户信息显示欢迎消息
          const userName = userStore.userInfo?.name || userStore.userInfo?.username || '用户'
          this.showMessage('success', `欢迎回来，${userName}！`)
          
          // 注意：成功消息模态框会在倒计时后自动跳转（在 closeMessageModal 中处理）
        } else {
          // 如果返回 false，说明登录失败但不抛异常，显示错误信息
          this.showMessage('error', '登录失败，请检查用户名和密码')
          this.formData.password = ''
        }
      } catch (error: any) {
        console.error('登录错误:', error)
        // 显示具体错误信息
        const errorMessage = error.message || '登录失败，请检查网络连接后重试'
        this.showMessage('error', errorMessage)
        // 清空密码
        this.formData.password = ''
      } finally {
        this.loading = false
      }
    },
    initTheme() {
      const savedTheme = localStorage.getItem('theme') ||
                         (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      this.isDark = savedTheme === 'dark'
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    socialLogin(provider: 'wechat' | 'github') {
      if (this.loading) return
      
      // 模拟第三方登录
      const providerNames: Record<'wechat' | 'github', string> = {
        'wechat': '微信',
        'github': 'GitHub'
      }
      
      this.loading = true
      
      setTimeout(() => {
        this.loading = false
        console.log(`${provider}登录功能开发中`)
        this.showMessage('error', `${providerNames[provider]}登录功能开发中，敬请期待`)
      }, 1500)
    },
    goToRegister() {
      if (this.loading) return
      this.$router.push('/register').catch(() => {
        console.log('注册页面开发中')
        this.showMessage('error', '注册页面开发中，敬请期待')
      })
    },
    closeForgotModal() {
      this.showForgotModal = false
      this.resetEmail = ''
    },
    async handleResetPassword() {
      if (!this.resetEmail) return
      
      // 简单的邮箱格式验证
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.resetEmail)) {
        this.showMessage('error', '请输入有效的邮箱地址')
        return
      }
      
      try {
        // 调用忘记密码 API
        const { forgotPassword } = await import('@/api/auth')
        await forgotPassword(this.resetEmail)
        
        this.closeForgotModal()
        this.showMessage('success', `重置密码邮件已发送至 ${this.resetEmail}，请查收`)
      } catch (error: any) {
        console.error('重置密码错误:', error)
        const errorMessage = error.message || '发送失败，请稍后重试'
        this.showMessage('error', errorMessage)
      }
    }
  },
  mounted() {
    this.initTheme()
    const rememberedUser = localStorage.getItem('remember_user')
    if (rememberedUser) {
      this.formData.username = rememberedUser
      this.formData.remember = true
    }
  }
}
</script>

<style scoped>
/* 局部变量定义 */
.login-page {
  --brand-bg: linear-gradient(135deg, #3b5998 0%, #4c6ef5 100%);
  --brand-text: #ffffff;
  --form-bg: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --input-bg: #f9fafb;
  --input-bg-focus: #ffffff;
  --input-border: #e5e7eb;
  --input-border-focus: #4c6ef5;
  --input-placeholder: #9ca3af;
  --primary-color: #4c6ef5;
  --primary-hover: #3b5bdb;
  --error-color: #ef4444;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-focus: 0 0 0 4px rgba(76, 110, 245, 0.15);
  --shadow-error: 0 0 0 4px rgba(239, 68, 68, 0.15);
}

.login-page.dark-mode {
  --brand-bg: linear-gradient(135deg, #111827 0%, #1f2937 100%);
  --form-bg: #111827;
  --text-primary: #f9fafb;
  --text-secondary: #9ca3af;
  --input-bg: #1f2937;
  --input-bg-focus: #374151;
  --input-border: #374151;
  --input-border-focus: #6366f1;
  --input-placeholder: #6b7280;
  --primary-color: #6366f1;
  --primary-hover: #818cf8;
  --shadow-sm: none;
  --shadow-focus: 0 0 0 4px rgba(99, 102, 241, 0.2);
  --shadow-error: 0 0 0 4px rgba(239, 68, 68, 0.2);
}

.login-page {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

/* 左侧品牌区域 */
.brand-section {
  width: 45%;
  flex-shrink: 0;
  background: var(--brand-bg);
  color: var(--brand-text);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 80px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.brand-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin: 0 auto;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}

.brand-name {
  font-size: 32px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.brand-slogan h1 {
  font-size: 56px;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(to right, #fff, rgba(255,255,255,0.8));
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-slogan p {
  font-size: 20px;
  opacity: 0.85;
  margin-bottom: 64px;
  font-weight: 400;
  line-height: 1.6;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 18px;
  font-weight: 500;
  opacity: 0.9;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.feature-item:last-child {
  border-bottom: none;
}

/* 动态背景装饰 */
.brand-bg-shapes .shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  filter: blur(60px);
}

.shape-1 {
  width: 500px;
  height: 500px;
  top: -150px;
  right: -150px;
  animation: float 10s ease-in-out infinite;
}

.shape-2 {
  width: 400px;
  height: 400px;
  bottom: -100px;
  left: -100px;
  animation: float 12s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(30px, 30px); }
}

/* 右侧表单区域 */
.form-section {
  flex: 1;
  background: var(--form-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: background 0.3s ease;
  min-width: 0;
}

.form-container {
  width: 100%;
  max-width: 480px; /* 稍微加宽一点 */
  padding: 40px; /* 统一内边距 */
  box-sizing: border-box;
}

.theme-toggle {
  position: absolute;
  top: 40px;
  right: 40px;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 10px;
  border-radius: 12px;
  transition: all 0.2s;
  z-index: 10;
  background: var(--input-bg);
}

.theme-toggle:hover {
  background: var(--input-border-focus);
  color: #fff;
}

.form-header {
  margin-bottom: 36px;
  text-align: center;
}

.form-header h2 {
  font-size: 28px;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.form-header p {
  color: var(--text-secondary);
  font-size: 15px;
}

/* 表单样式定制 - 强制覆盖 DevUI 样式 */
.login-form {
  width: 100%;
}

.login-form :deep(.devui-form-item) {
  margin-bottom: 18px;
  display: block;
  width: 100%;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

/* 隐藏 DevUI 默认的必填星号和所有验证提示 */
.login-form :deep(.devui-form-item-label-required),
.login-form :deep(.devui-form-item-label-required::before),
.login-form :deep(.devui-form-item-label-required::after),
.login-form :deep(.devui-form-item::before),
.login-form :deep(.devui-form-item::after) {
  display: none !important;
  content: '' !important;
}

/* 隐藏 DevUI 默认的错误提示气泡 */
.login-form :deep(.devui-popover) {
  display: none !important;
}

/* 强制隐藏所有可能的必填标记 */
.login-form :deep(*[class*="required"]),
.login-form :deep(*[class*="asterisk"]) {
  display: none !important;
}

.login-form :deep(.devui-form-item-content) {
  display: block;
  width: 100%;
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
}

.login-form :deep(.devui-input-wrapper) {
  display: block;
  width: 100%;
  border: none !important;
  box-shadow: none !important;
}

/* 强制移除所有可能的错误边框和容器边框 */
.login-form :deep(.devui-input-wrapper.error),
.login-form :deep(.devui-input-wrapper-error),
.login-form :deep(.devui-form-item.error),
.login-form :deep(.devui-form-item-error),
.login-form :deep(.devui-form-item-content.error),
.login-form :deep(.devui-form-item-content-error),
.login-form :deep(.devui-input-prefix.error),
.login-form :deep(.devui-input-suffix.error) {
  border: none !important;
  box-shadow: none !important;
  outline: none !important;
  background: transparent !important;
}

/* 输入框核心样式优化 */
.login-form :deep(.devui-input) {
  background: var(--input-bg) !important;
  border: 1px solid var(--input-border) !important;
  color: var(--text-primary) !important;
  height: 46px;
  width: 100%;
  border-radius: 10px;
  /* padding-left: 42px; */
  /* padding-right: 14px; */
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  transition: all 0.25s ease;
  box-shadow: none !important;
  outline: none !important;
}

/* 覆盖 DevUI 默认的错误状态样式 - 完全移除红色边框 */
.login-form :deep(.devui-input.error),
.login-form :deep(.devui-input-error),
.login-form :deep(.devui-input[error]),
.login-form :deep(input.error),
.login-form :deep(input[error]) {
  background-color: var(--input-bg) !important;
  border: 1px solid var(--input-border) !important;
  box-shadow: none !important;
  outline: none !important;
}

.login-form :deep(.devui-input.error:focus),
.login-form :deep(.devui-input-error:focus),
.login-form :deep(.devui-input[error]:focus),
.login-form :deep(input.error:focus),
.login-form :deep(input[error]:focus) {
  background-color: var(--input-bg-focus) !important;
  border: 1px solid var(--input-border-focus) !important;
  box-shadow: var(--shadow-focus) !important;
  outline: none !important;
}

.login-form :deep(.devui-input::placeholder) {
  color: var(--input-placeholder);
  font-size: 14px;
  font-weight: 400;
  opacity: 0.6;
}

.login-form :deep(.devui-input:hover) {
  background: var(--input-bg-focus) !important;
  border-color: #d1d5db !important;
  box-shadow: 0 0 0 3px rgba(209, 213, 219, 0.08) !important;
}

.login-form :deep(.devui-input:focus) {
  background: var(--input-bg-focus) !important;
  border-color: var(--input-border-focus) !important;
  box-shadow: var(--shadow-focus) !important;
  outline: none !important;
}

/* 图标样式优化 - 移除所有容器边框 */
.login-form :deep(.devui-input-prefix),
.login-form :deep(.devui-input-suffix) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}

.login-form :deep(.devui-input-prefix) {
  left: 14px;
  z-index: 2;
  color: var(--text-secondary);
  transition: color 0.3s;
  font-size: 16px;
  display: flex;
  align-items: center;
  opacity: 0.7;
}

.login-form :deep(.devui-input-suffix) {
  right: 14px;
  z-index: 2;
  border: none !important;
  background: transparent !important;
}

.login-form :deep(.devui-input-wrapper:focus-within .devui-input-prefix) {
  color: var(--primary-color);
  opacity: 1;
}

/* 错误状态下的图标颜色 - 保持中性色 */
.login-form :deep(.devui-input-wrapper.error .devui-input-prefix),
.login-form :deep(.devui-input-wrapper-error .devui-input-prefix) {
  color: var(--text-secondary);
  opacity: 0.7;
}

.field-error {
  color: var(--error-color);
  font-size: 13px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 密码切换按钮容器 */
.password-toggle-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  user-select: none;
}

.password-toggle-wrapper:hover {
  background: rgba(76, 110, 245, 0.08);
}

.password-toggle-wrapper:active {
  transform: scale(0.95);
}

.password-toggle {
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  padding: 6px;
  border-radius: 6px;
  opacity: 0.6;
  font-size: 16px;
  border: none !important;
  background: transparent !important;
  outline: none !important;
}

.password-toggle:hover {
  color: var(--primary-color);
  background: rgba(76, 110, 245, 0.08) !important;
  opacity: 1;
  border: none !important;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  font-size: 14px;
  width: 100%;
}

.forgot-link {
  color: var(--primary-color);
  cursor: pointer;
  font-weight: 600;
  transition: opacity 0.2s;
}

.forgot-link:hover {
  opacity: 0.8;
}

.submit-btn {
  width: 100%;
  height: 46px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 10px;
  background-color: var(--primary-color);
  border: none;
  transition: all 0.3s;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 6px -1px rgba(76, 110, 245, 0.2);
}

.submit-btn:hover {
  background-color: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(76, 110, 245, 0.3);
}

.submit-btn:active {
  transform: translateY(0);
}

/* 社交登录 */
.social-login-divider {
  margin: 28px 0 20px;
  text-align: center;
  position: relative;
}

.social-login-divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background: #f3f4f6;
}

.social-login-divider span {
  background: var(--form-bg);
  padding: 0 20px;
  color: var(--text-secondary);
  font-size: 14px;
  position: relative;
  font-weight: 500;
}

.social-login-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 24px;
}

.social-btn {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  border: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--text-secondary);
  background: #fff;
}

.social-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.register-hint {
  text-align: center;
  color: var(--text-secondary);
  font-size: 15px;
}

.register-link {
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  margin-left: 6px;
  transition: opacity 0.2s;
}
/* 响应式适配 */
@media (max-width: 960px) {
  .brand-section {
    display: none;
  }
  .form-section {
    width: 100%;
  }
  .form-container {
    padding: 32px;
    max-width: 100%;
  }
  .form-header h2 {
    font-size: 28px;
  }
}

/* 消息提示模态框样式优化 */
.message-modal :deep(.devui-modal) {
  z-index: 2000;
}

.message-modal :deep(.devui-modal-content) {
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.message-modal :deep(.devui-modal-header) {
  padding: 32px 32px 16px;
  border-bottom: none;
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  background: var(--form-bg);
  position: relative;
}

/* 失败模态框的关闭按钮样式 */
.message-modal.error :deep(.devui-modal-close) {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 16px;
}

.message-modal.error :deep(.devui-modal-close:hover) {
  background: #e5e7eb;
  color: #374151;
  transform: rotate(90deg);
}

.dark-mode .message-modal.error :deep(.devui-modal-close) {
  background: #374151;
  color: #9ca3af;
}

.dark-mode .message-modal.error :deep(.devui-modal-close:hover) {
  background: #4b5563;
  color: #d1d5db;
}

.message-modal-content {
  padding: 24px 32px 32px;
  text-align: center;
  background: var(--form-bg);
}

.message-icon {
  width: 90px;
  height: 90px;
  margin: 0 auto 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: iconPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.message-icon::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  animation: iconRipple 1.5s infinite;
}

.message-icon.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
}

.message-icon.success::before {
  background: rgba(16, 185, 129, 0.3);
}

.message-icon.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: #ffffff;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
}

.message-icon.error::before {
  background: rgba(239, 68, 68, 0.3);
}

.message-text {
  font-size: 17px;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.3px;
  text-align: center;
  word-break: break-word;
}

.message-text.success {
  color: #059669;
}

.message-text.error {
  color: #dc2626;
}

.dark-mode .message-text.success {
  color: #34d399;
}

.dark-mode .message-text.error {
  color: #f87171;
}

/* 倒计时文字样式 */
.countdown-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 16px;
  margin-bottom: 0;
  font-weight: 400;
  opacity: 0.8;
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 0.8;
    transform: translateY(0);
  }
}

.dark-mode .message-modal :deep(.devui-modal-content) {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.message-modal :deep(.devui-modal-footer) {
  padding: 0 32px 32px;
  border-top: none;
  text-align: center;
  background: var(--form-bg);
  display: flex;
  justify-content: center;
}

.message-btn {
  min-width: 140px;
  height: 44px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
}

.message-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.message-btn:active {
  transform: translateY(0);
}

@keyframes iconPulse {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  50% {
    transform: scale(1.08);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes iconRipple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

/* 模态框遮罩层优化 */
.message-modal :deep(.devui-modal-mask) {
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

.dark-mode .message-modal :deep(.devui-modal-mask) {
  background: rgba(0, 0, 0, 0.75);
}

/* 响应式适配 */
@media (max-width: 960px) {
  .brand-section {
    display: none;
  }
  .form-section {
    width: 100%;
  }
  .form-container {
    padding: 32px;
    max-width: 100%;
  }
  .form-header h2 {
    font-size: 28px;
  }
  
  .message-modal :deep(.devui-modal-content) {
    margin: 20px;
  }
  
  .message-icon {
    width: 75px;
    height: 75px;
  }
  
  .message-text {
    font-size: 15px;
  }
}
</style>
