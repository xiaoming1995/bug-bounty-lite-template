<template>
  <div class="login-page">
    <!-- 全屏动态背景 -->
    <div class="tech-bg">
      <!-- 渐变光晕 -->
      <div class="bg-orb p-1"></div>
      <div class="bg-orb p-2"></div>
      <div class="bg-orb p-3"></div>
      <!-- 流动光波 -->
      <div class="gradient-wave wave-1"></div>
      <div class="gradient-wave wave-2"></div>
      <!-- 微光粒子层 -->
      <div class="shimmer-layer"></div>
      <!-- 网格 -->
      <div class="bg-grid"></div>
    </div>

    <!-- 主容器 -->
    <div class="login-container">
      <!-- 左侧：动态科技视觉 -->
      <div class="side-panel">
        <!-- 背景装饰 -->
        <div class="side-bg-effects">
          <div class="side-gradient"></div>
          <div class="side-grid"></div>
        </div>
        
        <div class="side-content">
          <!-- 品牌 -->
          <div class="brand">
            <div class="logo-box">
              <d-icon name="shield" size="28px" color="#fff" />
            </div>
            <span class="brand-text">SecPlatform</span>
          </div>
          
          <!-- 动态核心视觉 -->
          <div class="tech-core">
            <!-- 外层脉冲环 -->
            <div class="pulse-ring ring-1"></div>
            <div class="pulse-ring ring-2"></div>
            <div class="pulse-ring ring-3"></div>
            
            <!-- 轨道环 -->
            <div class="orbit-ring orbit-1">
              <div class="orbit-dot"></div>
            </div>
            <div class="orbit-ring orbit-2">
              <div class="orbit-dot"></div>
            </div>
            <div class="orbit-ring orbit-3">
              <div class="orbit-dot"></div>
            </div>
            
            <!-- 核心六边形 -->
            <div class="hex-core">
              <div class="hex-inner">
                <d-icon name="shield" size="48px" color="rgba(255,255,255,0.9)" />
              </div>
              <div class="hex-glow"></div>
            </div>
          </div>
          
          <!-- 标语 -->
          <div class="side-tagline">
            <h2>安全 · 可信 · 高效</h2>
            <p>构建企业级安全防护体系</p>
          </div>
        </div>
        
        <!-- 浮动粒子 -->
        <div class="floating-particles">
          <span class="particle p1"></span>
          <span class="particle p2"></span>
          <span class="particle p3"></span>
          <span class="particle p4"></span>
          <span class="particle p5"></span>
          <span class="particle p6"></span>
        </div>
      </div>

      <!-- 右侧：登录区域 -->

      <div class="form-panel">
        <div class="form-card animate-in">
          <div class="form-header stagger-1">
            <h1 class="gradient-text">欢迎回来</h1>
            <p>请登录您的账号以开启安全之旅</p>
          </div>

          <d-form
            ref="loginFormRef"
            :data="formData"
            :rules="formRules"
            @submit="handleSubmit"
            class="auth-form"
            layout="vertical"
          >
            <d-form-item field="username" class="stagger-1">
              <div class="custom-input-group">
                <d-input
                  v-model="formData.username"
                  placeholder="账号/手机号/邮箱"
                  size="lg"
                  @blur="validateUsername"
                  @input="clearFieldError('username')"
                >
                  <template #prefix>
                    <d-icon name="user" />
                  </template>
                </d-input>
                <div v-if="errors.username" class="err-text">{{ errors.username }}</div>
              </div>
            </d-form-item>

            <d-form-item field="password" class="stagger-2">
              <div class="custom-input-group">
                <d-input
                  v-model="formData.password"
                  type="password"
                  show-password
                  placeholder="请输入您的密码"
                  size="lg"
                  @blur="validatePassword"
                  @input="clearFieldError('password')"
                  @keyup.enter="handleSubmit"
                >
                  <template #prefix>
                    <d-icon name="lock" />
                  </template>
                </d-input>
                <div v-if="errors.password" class="err-text">{{ errors.password }}</div>
              </div>
            </d-form-item>

            <div class="form-utils">
              <d-checkbox v-model="formData.remember">记住我</d-checkbox>
              <span class="link-btn" @click="showForgotModal = true">忘记密码？</span>
            </div>

            <d-button
              type="submit"
              variant="solid"
              class="login-btn stagger-3"
              :loading="loading"
              :disabled="!isFormValid"
            >
              {{ loading ? '登录中...' : '立 即 登 录' }}
            </d-button>
          </d-form>



        </div>
      </div>
    </div>

    <!-- 忘记密码模态框 -->
    <d-modal
      v-model="showForgotModal"
      title="找回密码"
      class="custom-modal"
    >
      <div class="modal-body">
        <p>请输入您的邮箱地址，我们将发送重置链接。</p>
        <d-input
          v-model="resetEmail"
          placeholder="email@example.com"
          size="lg"
        >
          <template #prefix>
            <d-icon name="mail" />
          </template>
        </d-input>
      </div>
      <template #footer>
        <d-button @click="closeForgotModal" variant="outline">取消</d-button>
        <d-button
          color="primary"
          @click="handleResetPassword"
          :disabled="!resetEmail"
        >发送邮件</d-button>
      </template>
    </d-modal>

    <!-- 登录状态模态框 -->
    <d-modal
      v-model="showMessageModal"
      :show-close="messageType === 'error'"
      @close="closeMessageModal"
      class="status-modal"
      :class="messageType"
      width="380px"
    >
      <div class="status-content">
        <div class="status-circle" :class="messageType">
          <d-icon :name="messageType === 'success' ? 'right' : 'close'" size="36px" />
        </div>
        <h3>{{ messageType === 'success' ? '登录成功' : '登录失败' }}</h3>
        <p>{{ messageText }}</p>
        <div v-if="messageType === 'success'" class="loader-bar">
          <div class="loader-progress" :style="{ width: ((2 - countdown) / 2 * 100) + '%' }"></div>
        </div>
      </div>
    </d-modal>
  </div>
</template>

<script lang="ts">
import { useUserStore } from '@/stores/user'
import { forgotPassword } from '@/api/auth'

export default {
  name: 'LoginPage',
  data() {
    return {
      loading: false,
      showForgotModal: false,
      showMessageModal: false,
      messageType: 'success' as 'success' | 'error',
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
      
      if (type === 'success') {
        this.countdown = 2
        this.startCountdown()
      }
    },
    startCountdown() {
      if (this.countdownTimer) clearInterval(this.countdownTimer)
      this.countdownTimer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          if (this.countdownTimer) clearInterval(this.countdownTimer)
          this.countdownTimer = null
          this.closeMessageModal()
        }
      }, 1000)
    },
    closeMessageModal() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
      this.showMessageModal = false
      if (this.messageType === 'success') {
        const redirect = this.$route.query.redirect as string
        const targetPath = redirect || '/'
        this.$router.push(targetPath)
      }
    },
    async handleSubmit() {
      if (!this.validateUsername() || !this.validatePassword()) return
      this.loading = true
      try {
        const userStore = useUserStore()
        const success = await userStore.login({
          username: this.formData.username.trim(),
          password: this.formData.password
        })
        if (success) {
          if (this.formData.remember) localStorage.setItem('remember_user', this.formData.username.trim())
          else localStorage.removeItem('remember_user')
          const userName = userStore.userInfo?.name || userStore.userInfo?.username || '用户'
          this.showMessage('success', `欢迎回来，${userName}！`)
        } else {
          this.showMessage('error', '登录失败，请检查账号密码')
        }
      } catch (error: any) {
        this.showMessage('error', error.message || '网络连接异常')
      } finally {
        this.loading = false
      }
    },


    goToRegister() {
      this.$router.push('/register').catch(() => {
        this.showMessage('error', '注册功能暂未开放')
      })
    },
    closeForgotModal() {
      this.showForgotModal = false
      this.resetEmail = ''
    },
    async handleResetPassword() {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.resetEmail)) {
        this.showMessage('error', '邮箱格式不正确')
        return
      }
      try {
        await forgotPassword(this.resetEmail)
        this.closeForgotModal()
        this.showMessage('success', '重置链接已发送至您的邮箱')
      } catch (error: any) {
        this.showMessage('error', error.message || '发送失败')
      }
    }
  },
  mounted() {
    const rememberedUser = localStorage.getItem('remember_user')
    if (rememberedUser) {
      this.formData.username = rememberedUser
      this.formData.remember = true
    }
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

.login-page {
  --primary: #2563eb;
  --primary-glow: rgba(37, 99, 235, 0.25);
  --secondary: #3b82f6;
  --bg-main: #ffffff;
  --side-bg: linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);
  --text-main: #1e293b;
  --text-muted: #64748b;
  --card-bg: rgba(255, 255, 255, 0.95);
  --input-bg: #f8fafc;
  --border-color: rgba(37, 99, 235, 0.08);
  
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-main);
  font-family: 'Plus Jakarta Sans', sans-serif;
  overflow: hidden;
  position: relative;
}



/* 背景装饰 */
.tech-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f0f9ff 100%);
}

/* 渐变光晕 - 优化动画轨迹 */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2;
  mix-blend-mode: normal;
  will-change: transform, opacity;
}

.p-1 { 
  width: 600px; 
  height: 600px; 
  background: linear-gradient(180deg, #93c5fd 0%, #60a5fa 100%); 
  top: -15%; 
  left: -10%; 
  animation: orbFloat1 20s ease-in-out infinite; 
}

.p-2 { 
  width: 500px; 
  height: 500px; 
  background: linear-gradient(180deg, #60a5fa 0%, #3b82f6 100%); 
  bottom: -15%; 
  right: -10%; 
  animation: orbFloat2 25s ease-in-out infinite; 
}

.p-3 { 
  width: 450px; 
  height: 450px; 
  background: linear-gradient(180deg, #bfdbfe 0%, #93c5fd 100%); 
  top: 40%; 
  left: 25%; 
  opacity: 0.12; 
  animation: orbFloat3 30s ease-in-out infinite; 
}

/* 流动光波 */
.gradient-wave {
  position: absolute;
  width: 200%;
  height: 100%;
  left: -50%;
  background: linear-gradient(
    90deg, 
    transparent 0%, 
    rgba(59, 130, 246, 0.03) 25%,
    rgba(96, 165, 250, 0.06) 50%,
    rgba(59, 130, 246, 0.03) 75%,
    transparent 100%
  );
  will-change: transform;
}

.wave-1 {
  top: 10%;
  animation: waveFlow 12s linear infinite;
}

.wave-2 {
  bottom: 20%;
  animation: waveFlow 15s linear infinite reverse;
  opacity: 0.7;
}

/* 微光粒子层 */
.shimmer-layer {
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 25%),
    radial-gradient(circle at 80% 70%, rgba(96, 165, 250, 0.06) 0%, transparent 30%),
    radial-gradient(circle at 50% 50%, rgba(147, 197, 253, 0.04) 0%, transparent 40%);
  animation: shimmerPulse 8s ease-in-out infinite;
}

/* 网格 - 呼吸效果 */
.bg-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.04) 1px, transparent 1px), 
    linear-gradient(90deg, rgba(59, 130, 246, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black, transparent);
  animation: gridBreathe 6s ease-in-out infinite;
}

/* 光晕浮动动画 */
@keyframes orbFloat1 {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.2;
  }
  25% { 
    transform: translate(50px, 30px) scale(1.05); 
    opacity: 0.25;
  }
  50% { 
    transform: translate(30px, 60px) scale(1.02); 
    opacity: 0.18;
  }
  75% { 
    transform: translate(-20px, 40px) scale(1.08); 
    opacity: 0.22;
  }
}

@keyframes orbFloat2 {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.18;
  }
  33% { 
    transform: translate(-40px, -30px) scale(1.06); 
    opacity: 0.22;
  }
  66% { 
    transform: translate(-60px, 20px) scale(1.03); 
    opacity: 0.16;
  }
}

@keyframes orbFloat3 {
  0%, 100% { 
    transform: translate(0, 0) scale(1); 
    opacity: 0.12;
  }
  50% { 
    transform: translate(40px, -30px) scale(1.1); 
    opacity: 0.08;
  }
}

/* 光波流动动画 */
@keyframes waveFlow {
  0% { 
    transform: translateX(-25%); 
  }
  100% { 
    transform: translateX(25%); 
  }
}

/* 微光闪烁动画 */
@keyframes shimmerPulse {
  0%, 100% { 
    opacity: 1; 
    transform: scale(1);
  }
  50% { 
    opacity: 0.6; 
    transform: scale(1.02);
  }
}

/* 网格呼吸动画 */
@keyframes gridBreathe {
  0%, 100% { 
    opacity: 0.4; 
  }
  50% { 
    opacity: 0.2; 
  }
}

/* 布局容器 - 居中卡片 */
.login-container {
  width: 85%;
  max-width: 920px;
  height: auto;
  min-height: 520px;
  max-height: 80vh;
  display: flex;
  z-index: 1;
  background: transparent;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
}

/* 左侧面板 */
.side-panel {
  flex: 1.2;
  background: linear-gradient(160deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 60px 40px;
  color: #fff;
  overflow: hidden;
}

/* 左侧背景效果 */
.side-bg-effects {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.side-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 70%, rgba(14, 165, 233, 0.1) 0%, transparent 40%);
  animation: sideGradientShift 15s ease-in-out infinite;
}

.side-grid {
  position: absolute;
  inset: 0;
  background-image: 
    linear-gradient(rgba(59, 130, 246, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(59, 130, 246, 0.06) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent);
  opacity: 0.5;
}

@keyframes sideGradientShift {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(5%, 5%); }
}

.side-content {
  position: relative;
  z-index: 2;
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 60px;
}

.logo-box {
  width: 48px;
  height: 48px;
  background: rgba(59, 130, 246, 0.2);
  backdrop-filter: blur(12px);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(59, 130, 246, 0.3);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.2);
}

.brand-text {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: #fff;
}

/* 动态核心视觉 */
.tech-core {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 50px;
}

/* 脉冲环 */
.pulse-ring {
  position: absolute;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50%;
  animation: pulseExpand 4s ease-out infinite;
}

.ring-1 { width: 120px; height: 120px; animation-delay: 0s; }
.ring-2 { width: 120px; height: 120px; animation-delay: 1.3s; }
.ring-3 { width: 120px; height: 120px; animation-delay: 2.6s; }

@keyframes pulseExpand {
  0% {
    transform: scale(1);
    opacity: 0.6;
    border-color: rgba(59, 130, 246, 0.5);
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
    border-color: rgba(59, 130, 246, 0);
  }
}

/* 轨道环 */
.orbit-ring {
  position: absolute;
  border: 1px solid rgba(96, 165, 250, 0.2);
  border-radius: 50%;
}

.orbit-1 { width: 200px; height: 200px; animation: orbitSpin 12s linear infinite; }
.orbit-2 { width: 240px; height: 240px; animation: orbitSpin 18s linear infinite reverse; transform: rotateX(60deg); }
.orbit-3 { width: 270px; height: 270px; animation: orbitSpin 24s linear infinite; transform: rotateY(60deg); }

@keyframes orbitSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.orbit-dot {
  position: absolute;
  top: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 8px;
  height: 8px;
  background: linear-gradient(135deg, #60a5fa, #3b82f6);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.8), 0 0 24px rgba(59, 130, 246, 0.4);
}

/* 核心六边形 */
.hex-core {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hex-inner {
  width: 90px;
  height: 90px;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(14, 165, 233, 0.2) 100%);
  border: 1.5px solid rgba(96, 165, 250, 0.5);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 0 40px rgba(59, 130, 246, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  animation: coreFloat 5s ease-in-out infinite;
}

.hex-glow {
  position: absolute;
  width: 140px;
  height: 140px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%);
  filter: blur(20px);
  z-index: -1;
  animation: glowPulse 3s ease-in-out infinite;
}

@keyframes coreFloat {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(3deg); }
}

@keyframes glowPulse {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* 标语 */
.side-tagline {
  text-align: center;
}

.side-tagline h2 {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 10px;
  letter-spacing: 4px;
}

.side-tagline p {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 400;
}

/* 浮动粒子 */
.floating-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: rgba(96, 165, 250, 0.6);
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(96, 165, 250, 0.4);
}

.p1 { top: 15%; left: 20%; animation: particleFloat 8s ease-in-out infinite; }
.p2 { top: 25%; right: 15%; animation: particleFloat 10s ease-in-out infinite 1s; }
.p3 { bottom: 30%; left: 15%; animation: particleFloat 9s ease-in-out infinite 2s; }
.p4 { bottom: 20%; right: 25%; animation: particleFloat 11s ease-in-out infinite 0.5s; }
.p5 { top: 50%; left: 10%; animation: particleFloat 7s ease-in-out infinite 1.5s; width: 3px; height: 3px; }
.p6 { top: 60%; right: 10%; animation: particleFloat 12s ease-in-out infinite 2.5s; width: 5px; height: 5px; }

@keyframes particleFloat {
  0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.6; }
  25% { transform: translate(15px, -20px) scale(1.2); opacity: 1; }
  50% { transform: translate(-10px, -40px) scale(0.8); opacity: 0.4; }
  75% { transform: translate(20px, -20px) scale(1.1); opacity: 0.8; }
}

.form-panel {
  flex: 1;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px 50px;
  position: relative;
}



.form-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 40px;
  padding-left: 36px;
}

.form-header h1 {
  font-size: 34px;
  font-weight: 800;
  color: var(--text-main);
  margin-bottom: 12px;
  letter-spacing: -1px;
}

.gradient-text {
  background: linear-gradient(135deg, var(--text-main) 0%, var(--primary) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-header p {
  font-size: 16px;
  color: var(--text-muted);
}

.auth-form {
  width: 100%;
}

.custom-input-group {
  margin-bottom: 20px;
}

/* 输入框外层容器 - 移除所有默认样式 */
:deep(.devui-input__wrapper) {
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  padding: 0 !important;
}

/* 输入框 - 简洁下划线风格 */
:deep(.devui-input) {
  height: 48px !important;
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid rgba(200, 200, 200, 0.35) !important;
  border-radius: 0 !important;
  padding: 0 40px 0 30px !important;
  font-size: 15px !important;
  color: var(--text-main) !important;
  transition: border-color 0.3s ease !important;
  width: 100% !important;
}

:deep(.devui-input:focus) {
  background: transparent !important;
  border: none !important;
  border-bottom: 1px solid var(--primary) !important;
  box-shadow: none !important;
  transform: none !important;
  outline: none !important;
}

:deep(.devui-input::placeholder) {
  color: var(--text-muted);
  opacity: 0.6;
  font-weight: 400;
  transition: all 0.3s ease;
}

:deep(.devui-input:focus::placeholder) {
  opacity: 0.4;
}

/* 输入框前缀图标 */
:deep(.devui-input-prefix) {
  left: 4px !important;
  color: rgba(180, 180, 180, 0.7) !important;
  transition: all 0.3s ease !important;
}

.custom-input-group:focus-within :deep(.devui-input-prefix) {
  color: var(--primary) !important;
  transform: none !important;
}

/* 密码框后缀图标（眼睛图标） */
:deep(.devui-input-suffix) {
  right: 4px !important;
  color: rgba(180, 180, 180, 0.7) !important;
  transition: all 0.3s ease !important;
}

:deep(.devui-input-suffix:hover) {
  color: var(--primary) !important;
}

.err-text {
  color: #fb7185;
  font-size: 12px;
  margin-top: 8px;
  font-weight: 500;
  margin-left: 36px;
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-10px); }
  to { opacity: 1; transform: translateX(0); }
}

.form-utils {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0 30px;
}

.link-btn {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary);
  cursor: pointer;
  transition: opacity 0.2s;
}

.highlight {
  margin-left: 6px;
}

.link-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  height: 56px !important;
  border-radius: 16px !important;
  background: linear-gradient(135deg, var(--primary) 0%, #00a3ff 100%) !important;
  font-weight: 700 !important;
  font-size: 16px !important;
  letter-spacing: 2px !important;
  box-shadow: 0 8px 25px -5px var(--primary-glow) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) !important;
  border: none !important;
  color: #fff !important;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 30px -5px var(--primary-glow) !important;
  filter: brightness(1.1);
}

.login-btn:active:not(:disabled) {
  transform: translateY(-1px) scale(0.98);
}



@keyframes floating {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(30px, 30px) scale(1.05); }
}

/* 入场动画 */
.animate-in .stagger-1 { animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
.animate-in .stagger-2 { animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.1s forwards; opacity: 0; }
.animate-in .stagger-3 { animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards; opacity: 0; }
.animate-in .stagger-4 { animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards; opacity: 0; }
.animate-in .stagger-5 { animation: slideUpFade 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) 0.4s forwards; opacity: 0; }

@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes move-forever {
  0% { transform: translate3d(-90px,0,0); }
  100% { transform: translate3d(85px,0,0); }
}

/* ========== 响应式适配 ========== */

/* 平板 (max-width: 992px) */
@media (max-width: 992px) {
  .login-container {
    max-width: 100%;
    width: 100%;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }
  
  .side-panel { 
    display: none; 
  }
  
  .form-panel { 
    padding: 40px 30px; 
    border-left: none;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
  }
  
  .form-card { 
    max-width: 420px; 
    padding: 0;
    background: transparent;
    border-radius: 0;
    backdrop-filter: none;
    border: none;
    box-shadow: none;
  }
  
  .form-header {
    padding-left: 30px;
    margin-bottom: 35px;
  }
  
  .form-header h1 {
    font-size: 30px;
  }
  
  .login-btn {
    height: 52px !important;
  }
}

/* 大手机 (max-width: 768px) */
@media (max-width: 768px) {
  .login-page {
    padding: 0;
  }
  
  .tech-bg .bg-orb {
    filter: blur(100px);
  }
  
  .p-1 { width: 400px; height: 400px; }
  .p-2 { width: 350px; height: 350px; }
  .p-3 { width: 300px; height: 300px; }
  
  .form-panel {
    padding: 30px 24px;
  }
  
  .form-card {
    max-width: 100%;
  }
  
  .form-header {
    padding-left: 24px;
    margin-bottom: 30px;
  }
  
  .form-header h1 {
    font-size: 26px;
  }
  
  .form-header p {
    font-size: 14px;
  }
  
  .custom-input-group {
    margin-bottom: 16px;
  }
  
  :deep(.devui-input) {
    height: 44px !important;
    font-size: 14px !important;
    padding: 0 36px 0 28px !important;
  }
  
  .err-text {
    margin-left: 28px;
  }
  
  .form-utils {
    margin: 16px 0 24px;
  }
  
  .login-btn {
    height: 50px !important;
    border-radius: 14px !important;
    font-size: 15px !important;
  }
}

/* 手机 (max-width: 576px) */
@media (max-width: 576px) {
  .form-panel {
    padding: 24px 20px;
    justify-content: flex-start;
    padding-top: 60px;
  }
  
  .form-header {
    padding-left: 20px;
    margin-bottom: 28px;
  }
  
  .form-header h1 {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .form-header p {
    font-size: 13px;
  }
  
  :deep(.devui-input) {
    height: 42px !important;
    padding: 0 32px 0 24px !important;
  }
  
  :deep(.devui-input-prefix) {
    left: 2px !important;
  }
  
  .err-text {
    margin-left: 24px;
    font-size: 11px;
  }
  
  .form-utils {
    margin: 14px 0 20px;
  }
  
  :deep(.devui-checkbox) {
    font-size: 13px;
  }
  
  .link-btn {
    font-size: 13px;
  }
  
  .login-btn {
    height: 48px !important;
    border-radius: 12px !important;
    font-size: 14px !important;
    letter-spacing: 1px !important;
  }
  
  /* 隐藏部分背景动画以提升性能 */
  .gradient-wave,
  .shimmer-layer {
    display: none;
  }
  
  .bg-grid {
    opacity: 0.2;
  }
}

/* ========== 弹框样式 - 蓝白清新 ========== */

/* 遮罩 */
:deep(.devui-modal-container) {
  background: rgba(241, 245, 249, 0.85) !important;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 弹框主体 */
:deep(.devui-modal) {
  width: clamp(420px, 40vw, 560px) !important;
  min-width: unset !important;
  max-width: unset !important;
  background: #ffffff !important;
  border: 1px solid rgba(59, 130, 246, 0.15) !important;
  border-radius: 20px !important;
  box-shadow: 
    0 25px 60px rgba(59, 130, 246, 0.12),
    0 10px 30px rgba(0, 0, 0, 0.06) !important;
  overflow: hidden;
  animation: modalFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
  position: relative;
}

/* 顶部装饰线 */
:deep(.devui-modal)::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd, #60a5fa, #3b82f6);
  background-size: 200% 100%;
  animation: gradientFlow 3s ease infinite;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes modalFadeIn {
  0% { 
    opacity: 0; 
    transform: translateY(20px) scale(0.96);
  }
  100% { 
    opacity: 1; 
    transform: translateY(0) scale(1);
  }
}

/* 头部 */
:deep(.devui-modal-header) {
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.04) 0%, transparent 100%) !important;
  border: none !important;
  border-bottom: 1px solid rgba(59, 130, 246, 0.08) !important;
  padding: 32px 36px 24px !important;
  position: relative;
  z-index: 1;
}

:deep(.devui-modal-title) {
  font-size: 22px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  letter-spacing: -0.02em;
}

/* 内容区 */
:deep(.devui-modal-body) {
  padding: 28px 36px 36px !important;
  color: #475569 !important;
  font-size: 15px;
  line-height: 1.7;
  position: relative;
  z-index: 1;
}

/* 底部 */
:deep(.devui-modal-footer) {
  background: rgba(248, 250, 252, 0.6) !important;
  border-top: 1px solid rgba(59, 130, 246, 0.08) !important;
  padding: 20px 36px !important;
  gap: 12px;
  position: relative;
  z-index: 1;
}

/* 关闭按钮 */
:deep(.devui-modal-close) {
  color: #94a3b8 !important;
  transition: all 0.25s ease !important;
  width: 32px !important;
  height: 32px !important;
}

:deep(.devui-modal-close:hover) {
  color: #3b82f6 !important;
  transform: rotate(90deg);
}

/* ===== 忘记密码弹框 ===== */
.custom-modal .modal-body p {
  color: #64748b;
  font-size: 15px;
  margin-bottom: 24px;
  line-height: 1.6;
}

.custom-modal :deep(.devui-input) {
  height: 50px !important;
  background: #f8fafc !important;
  border: 1px solid rgba(59, 130, 246, 0.15) !important;
  border-radius: 12px !important;
  color: #1e293b !important;
  font-size: 15px !important;
  transition: all 0.25s ease !important;
}

.custom-modal :deep(.devui-input:focus) {
  border-color: #3b82f6 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

.custom-modal :deep(.devui-input::placeholder) {
  color: #94a3b8 !important;
}

.custom-modal :deep(.devui-btn) {
  height: 46px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 15px !important;
  padding: 0 28px !important;
  transition: all 0.25s ease !important;
}

.custom-modal :deep(.devui-btn-primary) {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3) !important;
}

.custom-modal :deep(.devui-btn-primary:hover) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
}

.custom-modal :deep(.devui-btn-outline) {
  border: 1px solid #e2e8f0 !important;
  color: #64748b !important;
  background: transparent !important;
}

.custom-modal :deep(.devui-btn-outline:hover) {
  border-color: #cbd5e1 !important;
  background: #f8fafc !important;
}

/* ===== 状态弹框 ===== */
.status-modal :deep(.devui-modal) {
  width: clamp(360px, 35vw, 440px) !important;
}

.status-modal :deep(.devui-modal-header) {
  display: none !important;
}

.status-modal :deep(.devui-modal-body) {
  padding: 48px 40px !important;
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.status-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
  animation: circleScale 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes circleScale {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

.status-circle.success {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%);
  border: 2px solid rgba(34, 197, 94, 0.3);
}

.status-circle.success :deep(.devui-icon) {
  color: #22c55e !important;
  font-size: 40px !important;
}

.status-circle.error {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.12) 0%, rgba(239, 68, 68, 0.06) 100%);
  border: 2px solid rgba(239, 68, 68, 0.3);
}

.status-circle.error :deep(.devui-icon) {
  color: #ef4444 !important;
  font-size: 40px !important;
}

.status-content h3 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 10px;
  letter-spacing: -0.02em;
}

.status-content p {
  font-size: 15px;
  color: #64748b;
  margin: 0;
  max-width: 300px;
  line-height: 1.5;
}

.loader-bar {
  width: 200px;
  height: 4px;
  background: #e2e8f0;
  border-radius: 2px;
  overflow: hidden;
  margin-top: 28px;
}

.loader-progress {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border-radius: 2px;
  transition: width 0.3s ease;
  transition: width 0.3s linear;
  animation: progressGlow 2s ease infinite;
}

@keyframes progressGlow {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.3); }
}

/* ========== 模态框响应式适配 ========== */

/* 平板设备 (宽度 <= 992px) */
@media (max-width: 992px) {
  :deep(.devui-modal) {
    /* 平板上占视口60% */
    width: clamp(420px, 60vw, 600px) !important;
  }
  
  .status-modal :deep(.devui-modal) {
    width: clamp(380px, 55vw, 520px) !important;
  }
}

/* 手机设备 (宽度 <= 576px) */
@media (max-width: 576px) {
  :deep(.devui-modal) {
    /* 手机上占视口90%，确保足够显眼 */
    width: 90vw !important;
    max-width: 90vw !important;
    border-radius: 20px !important;
  }
  
  :deep(.devui-modal-header) {
    padding: 28px 24px 18px !important;
  }
  
  :deep(.devui-modal-title) {
    font-size: 22px !important;
  }
  
  :deep(.devui-modal-body) {
    padding: 20px 24px 28px !important;
    font-size: 15px;
  }
  
  :deep(.devui-modal-footer) {
    padding: 18px 24px !important;
    gap: 12px;
  }
  
  .status-modal :deep(.devui-modal) {
    width: 90vw !important;
  }
  
  .status-modal :deep(.devui-modal-body) {
    padding: 40px 28px !important;
  }
  
  .status-circle {
    width: 90px;
    height: 90px;
  }
  
  .status-content h3 {
    font-size: 22px;
  }
  
  .status-content p {
    font-size: 15px;
  }
  
  .loader-bar {
    width: 200px;
  }
}
</style>

<!-- 全局样式 - 必须不带 scoped，因为模态框渲染在 body 下面 -->
<style>
/* ========== DevUI 模态框全局样式覆盖 - 蓝白清新 ========== */

/* 遮罩层 */
.devui-modal__overlay {
  background: rgba(241, 245, 249, 0.8) !important;
  backdrop-filter: blur(8px) !important;
  -webkit-backdrop-filter: blur(8px) !important;
  position: fixed !important;
  inset: 0 !important;
  z-index: 1000 !important;
}

/* 模态框主体 */
.devui-modal {
  width: clamp(400px, 40vw, 520px) !important;
  min-width: unset !important;
  max-width: unset !important;
  background: #ffffff !important;
  border: 1px solid rgba(59, 130, 246, 0.12) !important;
  border-radius: 20px !important;
  box-shadow: 
    0 25px 60px rgba(59, 130, 246, 0.1),
    0 10px 30px rgba(0, 0, 0, 0.05) !important;
  overflow: visible !important;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  z-index: 1001 !important;
  animation: modalFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
}



@keyframes modalFadeIn {
  0% { 
    opacity: 0; 
    transform: translate(-50%, -50%) translateY(20px) scale(0.96);
  }
  100% { 
    opacity: 1; 
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
}

/* 头部 */
.devui-modal__header {
  border: none !important;
  border-bottom: 1px solid rgba(59, 130, 246, 0.08) !important;
  padding: 24px 28px !important;
  position: relative;
  z-index: 1;
  font-size: 20px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  letter-spacing: -0.02em;
  background: transparent !important;
  display: flex;
  align-items: center;
}

/* 内容区 */
.devui-modal__body {
  padding: 24px 32px 32px !important;
  color: #475569 !important;
  font-size: 15px !important;
  line-height: 1.7 !important;
  position: relative;
  z-index: 1;
  background: transparent !important;
}

.devui-modal__body p,
.devui-modal .modal-body p {
  color: #64748b !important;
  font-size: 15px !important;
  margin-bottom: 20px !important;
  line-height: 1.6 !important;
}

/* 模态框内的输入框 */
.devui-modal .devui-input__wrapper {
  height: 48px !important;
  background: #f8fafc !important;
  border: 1px solid rgba(59, 130, 246, 0.12) !important;
  border-radius: 10px !important;
  padding: 0 12px !important;
  transition: all 0.2s ease !important;
}

.devui-modal .devui-input__inner {
  color: #1e293b !important;
  font-size: 15px !important;
  background: transparent !important;
  padding: 12px 0 12px 8px !important;
}

.devui-modal .devui-input__inner::placeholder {
  color: #94a3b8 !important;
  font-weight: 400 !important;
}

/* 输入框前缀图标 */
.devui-modal .devui-input__prefix {
  color: #94a3b8 !important;
  margin-right: 8px !important;
}

.devui-modal .devui-input__prefix .devui-icon__container,
.devui-modal .devui-input__prefix svg {
  width: 18px !important;
  height: 18px !important;
  color: inherit !important;
  fill: currentColor !important;
}

.devui-modal .devui-input__wrapper:focus-within {
  border-color: #3b82f6 !important;
  background: #ffffff !important;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
}

.devui-modal .devui-input__wrapper:focus-within .devui-input__prefix {
  color: #3b82f6 !important;
}

/* 模态框底部按钮靠右对齐 */
.devui-modal {
  text-align: right !important;
}

.devui-modal .devui-modal__header {
  text-align: left !important;
}

.devui-modal .devui-modal__body {
  text-align: left !important;
}

.devui-modal > .devui-button {
  display: inline-block !important;
  margin: 12px 8px !important;
}

/* 模态框按钮 */
.devui-modal .devui-button {
  height: 44px !important;
  border-radius: 10px !important;
  font-weight: 600 !important;
  font-size: 14px !important;
  padding: 0 24px !important;
  transition: all 0.25s ease !important;
  margin: 8px 6px !important;
}

.devui-modal .devui-button--outline--primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border: none !important;
  color: #ffffff !important;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.25) !important;
}

.devui-modal .devui-button--outline--primary:hover:not(:disabled) {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.35) !important;
}

.devui-modal .devui-button--outline--secondary {
  border: 1px solid #e2e8f0 !important;
  color: #64748b !important;
  background: transparent !important;
}

.devui-modal .devui-button--outline--secondary:hover {
  border-color: #cbd5e1 !important;
  background: #f8fafc !important;
}

/* 隐藏关闭按钮 */
.devui-modal .btn-close {
  display: none !important;
}

/* ===== 状态弹框 ===== */
.status-modal .devui-modal {
  width: clamp(340px, 32vw, 420px) !important;
}

.status-modal .devui-modal__header {
  display: none !important;
}

.status-modal .devui-modal__body {
  padding: 44px 36px !important;
}

/* ========== 模态框响应式适配 ========== */

@media (max-width: 992px) {
  .devui-modal {
    width: clamp(360px, 65vw, 500px) !important;
  }
  
  .status-modal .devui-modal {
    width: clamp(320px, 60vw, 420px) !important;
  }
}

@media (max-width: 576px) {
  .devui-modal {
    width: 90vw !important;
    max-width: 90vw !important;
    border-radius: 16px !important;
  }
  
  .devui-modal__header {
    padding: 22px 20px 16px !important;
    font-size: 18px !important;
  }
  
  .devui-modal__body {
    padding: 16px 20px 24px !important;
    font-size: 14px !important;
  }
  
  .devui-modal .devui-button {
    height: 42px !important;
    padding: 0 18px !important;
    font-size: 13px !important;
    margin: 6px 4px !important;
  }
  
  .status-modal .devui-modal {
    width: 90vw !important;
  }
  
  .status-modal .devui-modal__body {
    padding: 32px 24px !important;
  }
}
</style>

