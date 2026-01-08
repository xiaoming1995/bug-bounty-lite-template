<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout } from '@/api/auth'

const route = useRoute()
const activeKey = ref('home')

watch(() => route.path, (path) => {
  if (path === '/') activeKey.value = 'home'
  else if (path.startsWith('/database')) activeKey.value = 'database'

  else if (path.startsWith('/ranking')) activeKey.value = 'ranking'
  else if (path.startsWith('/security-dashboard')) activeKey.value = 'security-dashboard'
  else activeKey.value = ''
}, { immediate: true })
const mobileMenuVisible = ref(false)

const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}

const closeMobileMenu = () => {
  mobileMenuVisible.value = false
}
const userDropdownVisible = ref(false)
const router = useRouter()
const userStore = useUserStore()

// 从 store 获取用户信息
const userInfo = computed(() => {
  return {
    name: userStore.userInfo?.name || userStore.userInfo?.username || '安全研究员',
    avatar: userStore.userInfo?.avatar || ''
  }
})

const userMenuOptions = ref([
  { id: 'userinfo', name: '个人信息', icon: 'member-new' },
  { id: 'settings', name: '账号设置', icon: 'setting' },
  { id: 'message', name: '消息中心', icon: 'notice' },
  { id: 'logout', name: '退出登录', icon: 'log-out' }
])

const toggleUserDropdown = () => {
  userDropdownVisible.value = !userDropdownVisible.value
}

// Close dropdown when clicking outside (simple implementation)
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    userDropdownVisible.value = false
  })
}

const handleMenuClick = async (itemId: string) => {
  console.log('用户菜单点击:', itemId)
  userDropdownVisible.value = false

  switch(itemId) {
    case 'userinfo':
      router.push('/userinfo')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'message':
      router.push('/message')
      break
    case 'ranking':
      router.push('/ranking')
      break
    case 'security-dashboard':
      router.push('/security-dashboard')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

// 注销登录处理
const handleLogout = async () => {
  try {
    // 调用登出 API（如果后端需要）
    await logout()
  } catch (error) {
    console.error('登出 API 调用失败:', error)
    // 即使 API 调用失败，也继续清除本地数据
  } finally {
    // 清除本地认证信息
    userStore.clearAuth()
    
    // 跳转到登录页
    router.push({
      name: 'Login',
      query: {
        redirect: router.currentRoute.value.fullPath
      }
    }).catch((err) => {
      console.error('跳转登录页失败:', err)
      // 如果路由跳转失败，使用 window.location
      window.location.href = '/login'
    })
  }
}

const isSubmitting = ref(false)

const handleSubmitVulnerability = () => {
  // 防止重复点击
  if (isSubmitting.value) return
  
  isSubmitting.value = true
  
  // 跳转到提交漏洞页面
  router.push('/submit').finally(() => {
    // 延迟重置状态，让用户看到点击反馈
    setTimeout(() => {
      isSubmitting.value = false
    }, 300)
  })
}

</script>

<template>
  <div class="header-container">
    <!-- 移动端汉堡菜单按钮 -->
    <button class="mobile-menu-btn" @click="toggleMobileMenu" :class="{ active: mobileMenuVisible }">
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
      <span class="hamburger-line"></span>
    </button>
    
    <!-- 左侧LOGO和标题 -->
    <div class="header-left">
      <d-avatar 
        :width="36"
        :height="36"
        :is-round="false"
        img-src="./assets/logo.png"
        class="logo"
      />
      <h1 class="title">漏洞情报中心</h1>
    </div>

    <!-- 中间导航菜单 (桌面端) -->
    <div class="header-center desktop-nav">
      <nav class="main-nav">
        <router-link to="/" class="nav-item" exact-active-class="active">
          <d-icon name="home" class="nav-icon" />
          <span>首页</span>
        </router-link>
        <router-link to="/database" class="nav-item" active-class="active">
          <d-icon name="database" class="nav-icon" />
          <span>漏洞管理</span>
        </router-link>
        <router-link to="/project-hall" class="nav-item" active-class="active">
          <d-icon name="classroom-board" class="nav-icon" />
          <span>项目大厅</span>
        </router-link>
        <router-link to="/learning-center" class="nav-item" active-class="active">
          <d-icon name="book-open" class="nav-icon" />
          <span>学习中心</span>
        </router-link>
        <router-link to="/ranking" class="nav-item" active-class="active">
          <d-icon name="trophy" class="nav-icon" />
          <span>排行榜</span>
        </router-link>
        <router-link to="/security-dashboard" class="nav-item" active-class="active">
          <d-icon name="monitor" class="nav-icon" />
          <span>数据屏幕</span>
        </router-link>
      </nav>
    </div>

    <!-- 右侧功能区 -->
    <div class="header-right">
      <button
        class="submit-vuln-btn"
        :class="{ 'is-loading': isSubmitting }"
        :disabled="isSubmitting"
        @click="handleSubmitVulnerability"
      >
        提交漏洞
      </button>
      <!-- 用户个人中心 -->
      <div class="user-profile-trigger" @click.stop="toggleUserDropdown">
        <d-avatar :width="32" :height="32" :is-round="true" :img-src="userInfo.avatar || ''" class="user-avatar">
          <template #avatar v-if="!userInfo.avatar">{{ userInfo.name.substring(0,1) }}</template>
        </d-avatar>
        <span class="username">{{ userInfo.name }}</span>
        <d-icon name="chevron-down" class="dropdown-arrow" :class="{ 'is-active': userDropdownVisible }" />
        
        <!-- 下拉菜单 -->
        <div class="custom-dropdown-menu" v-show="userDropdownVisible" @click.stop>
          <div 
            v-for="item in userMenuOptions" 
            :key="item.id" 
            class="dropdown-item"
            :class="{ 'danger': item.id === 'logout' }"
            @click="handleMenuClick(item.id)"
          >
            <d-icon :name="item.icon" class="item-icon" />
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 移动端抽屉菜单 -->
    <div class="mobile-menu-overlay" v-show="mobileMenuVisible" @click="closeMobileMenu"></div>
    <div class="mobile-menu-drawer" :class="{ visible: mobileMenuVisible }">
      <div class="mobile-menu-header">
        <h2>导航菜单</h2>
        <button class="close-btn" @click="closeMobileMenu">
          <d-icon name="close" />
        </button>
      </div>
      <nav class="mobile-nav-list">
        <router-link to="/" class="mobile-nav-item" @click="closeMobileMenu">
          <d-icon name="home" />
          <span>首页</span>
        </router-link>
        <router-link to="/database" class="mobile-nav-item" @click="closeMobileMenu">
          <d-icon name="database" />
          <span>漏洞库</span>
        </router-link>
        <router-link to="/project-hall" class="mobile-nav-item" @click="closeMobileMenu">
          <d-icon name="classroom-board" />
          <span>项目大厅</span>
        </router-link>
        <router-link to="/learning-center" class="mobile-nav-item" @click="closeMobileMenu">
          <d-icon name="book-open" />
          <span>学习中心</span>
        </router-link>
        <router-link to="/ranking" class="mobile-nav-item" @click="closeMobileMenu">
          <d-icon name="trophy" />
          <span>排行榜</span>
        </router-link>
        <router-link to="/security-dashboard" class="mobile-nav-item" @click="closeMobileMenu">
          <d-icon name="monitor" />
          <span>态势大屏</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<style scoped lang="scss">
.header-container {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 24px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(37, 43, 58, 0.1);
  position: relative;
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;
    min-width: 200px;
    .logo { margin-right: 12px; border-radius: 4px; }
    .title { 
      font-size: 18px; 
      font-weight: bold; 
      color: #5e7ce0; 
    }
  }

  .header-center {
    flex: 1;
    display: flex;
    justify-content: center;
    
    .main-nav {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .nav-item {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 8px;
        color: #64748b;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
        position: relative;
        
        .nav-icon {
          font-size: 16px;
          transition: color 0.2s;
        }
        
        &:hover {
          color: #5e7ce0;
          background: rgba(94, 124, 224, 0.08);
        }
        
        &.active {
          color: #5e7ce0;
          background: rgba(94, 124, 224, 0.12);
        }
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    min-width: 200px;
    gap: 16px;
    
    // 提交漏洞按钮 - 简洁大气风格
    .submit-vuln-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: 500;
      color: #1f2937;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;
      user-select: none;
      line-height: 1.5;
      text-align: center;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      outline: none;
      
      &:focus {
        outline: none;
      }
      
      // 悬停效果 - 简洁的加深效果
      &:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #d1d5db;
        color: #111827;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
      }
      
      // 点击效果 - 轻微下压
      &:active:not(:disabled) {
        transform: scale(0.98);
        background: #f3f4f6;
        border-color: #9ca3af;
      }
      
      // 加载状态
      &.is-loading {
        pointer-events: none;
        opacity: 0.6;
      }
      
      // 禁用状态
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f9fafb;
      }
      
      // 焦点状态
      &:focus-visible {
        outline: 2px solid rgba(31, 41, 55, 0.2);
        outline-offset: 2px;
      }
    }

    .user-profile-trigger {
      display: flex;
      align-items: center;
      padding: 4px 8px 4px 4px;
      margin-left: 8px;
      cursor: pointer;
      border-radius: 99px;
      border: 1px solid transparent;
      background: #fff;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      user-select: none;

      &:hover, &.active {
        background: #f3f4f6;
        border-color: #e5e7eb;
      }

      .user-avatar {
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      }

      .username {
        margin: 0 8px 0 8px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        max-width: 100px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .dropdown-arrow {
        font-size: 12px;
        color: #9ca3af;
        transition: transform 0.3s;
        margin-right: 4px;

        &.is-active {
          transform: rotate(180deg);
        }
      }

      // Dropdown Menu Customization
      .custom-dropdown-menu {
        position: absolute;
        top: calc(100% + 8px);
        right: 0;
        width: 160px;
        background: #fff;
        border-radius: 12px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        border: 1px solid #f3f4f6;
        padding: 6px;
        z-index: 1000;
        transform-origin: top right;
        animation: dropdown-fade-in 0.2s ease-out;

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border-radius: 8px;
          color: #4b5563;
          font-size: 14px;
          transition: all 0.2s;

          .item-icon {
            font-size: 16px;
            color: #9ca3af;
          }

          &:hover {
            background: #f9fafb;
            color: #5e7ce0;
            
            .item-icon {
              color: #5e7ce0;
            }
          }

          &.danger {
            margin-top: 4px;
            border-top: 1px solid #f3f4f6;
            color: #ef4444;

            .item-icon { color: #ef4444; }

            &:hover {
              background: #fef2f2;
              color: #dc2626;
              .item-icon { color: #dc2626; }
            }
          }
        }
        
        // Triangle tip
        &::before {
          content: '';
          position: absolute;
          top: -6px;
          right: 20px;
          width: 12px;
          height: 12px;
          background: #fff;
          border-left: 1px solid #f3f4f6;
          border-top: 1px solid #f3f4f6;
          transform: rotate(45deg);
        }
      }
    }
  }
}

@keyframes dropdown-fade-in {
  from { opacity: 0; transform: translateY(-10px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

// 移动端汉堡菜单按钮
.mobile-menu-btn {
  display: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  gap: 5px;
  border-radius: 8px;
  transition: background 0.2s;
  
  &:hover {
    background: #f3f4f6;
  }
  
  .hamburger-line {
    width: 20px;
    height: 2px;
    background: #374151;
    border-radius: 1px;
    transition: all 0.3s;
  }
  
  &.active {
    .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }
    .hamburger-line:nth-child(2) {
      opacity: 0;
    }
    .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(5px, -5px);
    }
  }
}

// 移动端菜单遮罩
.mobile-menu-overlay {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
  animation: fadeIn 0.2s ease;
}

// 移动端抽屉菜单
.mobile-menu-drawer {
  display: none;
  position: fixed;
  top: 64px;
  left: 0;
  width: 280px;
  height: calc(100vh - 64px);
  background: #fff;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.1);
  z-index: 999;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  
  &.visible {
    transform: translateX(0);
  }
  
  .mobile-menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #f1f5f9;
    
    h2 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .close-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      border-radius: 6px;
      color: #64748b;
      
      &:hover {
        background: #f1f5f9;
        color: #1e293b;
      }
    }
  }
  
  .mobile-nav-list {
    padding: 12px;
    
    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      border-radius: 10px;
      color: #475569;
      text-decoration: none;
      font-size: 15px;
      font-weight: 500;
      transition: all 0.2s;
      
      &:hover {
        background: #f8fafc;
        color: #5e7ce0;
      }
      
      &.router-link-active {
        background: #eff6ff;
        color: #5e7ce0;
      }
      
      .devui-icon {
        font-size: 18px;
      }
    }
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

// 平板设备 (768px - 1024px)
@media (max-width: 1024px) and (min-width: 769px) {
  .header-container {
    padding: 0 20px;
    
    .header-left {
      min-width: 180px;
      
      .title {
        font-size: 16px;
      }
    }
    
    .header-center {
      :deep(.devui-menu-item) {
        padding: 0 12px;
        font-size: 13px;
      }
    }
    
    .header-right {
      min-width: 180px;
      gap: 12px;
      
      .submit-vuln-btn {
        padding: 8px 14px;
        font-size: 13px;
      }
    }
  }
}

// 移动端 (小于 768px)
@media (max-width: 768px) {
  .header-container {
    padding: 0 12px;
    justify-content: space-between;
    
    .mobile-menu-btn {
      display: flex;
      order: -1;
    }
    
    .header-left {
      min-width: auto;
      flex: 1;
      justify-content: center;
      
      .title { 
        display: none; 
      }
      
      .logo {
        margin-right: 0;
      }
    }
    
    .desktop-nav {
      display: none;
    }
    
    .mobile-menu-overlay,
    .mobile-menu-drawer {
      display: block;
    }
    
    .header-right {
      min-width: auto;
      gap: 8px;
      
      .username { 
        display: none; 
      }
      
      .submit-vuln-btn {
        padding: 8px 12px;
        font-size: 13px;
      }
      
      .user-profile-trigger {
        padding: 4px;
        
        .dropdown-arrow {
          display: none;
        }
      }
    }
  }
}

// 小屏手机 (小于 480px)
@media (max-width: 480px) {
  .header-container {
    padding: 0 8px;
    height: 56px;
    
    .mobile-menu-btn {
      width: 36px;
      height: 36px;
    }
    
    .header-right {
      gap: 6px;
      
      .submit-vuln-btn {
        padding: 6px 10px;
        font-size: 12px;
      }
      
      .user-profile-trigger {
        .user-avatar {
          width: 28px !important;
          height: 28px !important;
        }
      }
    }
  }
  
  .mobile-menu-drawer {
    width: 100%;
    top: 56px;
    height: calc(100vh - 56px);
  }
  
  .mobile-menu-overlay {
    top: 56px;
  }
}
</style>
