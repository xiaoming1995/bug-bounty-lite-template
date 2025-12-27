<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { logout } from '@/api/auth'

const activeKey = ref('home')
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

    <!-- 中间导航菜单 -->
    <div class="header-center">
      <d-menu 
        mode="horizontal" 
        :default-active="activeKey"
        :router= true
      >
        <d-menu-item id="home" key="/">
          <template #icon><d-icon name="home"/></template>
          首页
        </d-menu-item>
        <d-menu-item id="database" key="database">
          <template #icon><d-icon name="database"/></template>
          漏洞库
        </d-menu-item>
        <d-menu-item id="cnnvd" key="cnnvd">
          <template #icon><d-icon name="notice"/></template>
          CNNVD动态
        </d-menu-item>
        <d-menu-item id="analysis" key="analysis">
          <template #icon><d-icon name="analysis"/></template>
          漏洞报告
        </d-menu-item>
        <d-menu-item id="ranking" key="ranking">
          <template #icon><d-icon name="trophy"/></template>
          排行榜
        </d-menu-item>
      </d-menu>
    </div>

    <!-- 右侧功能区 - 重点修复区域 -->
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
    :deep(.devui-menu) { background: transparent; }
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

@media (max-width: 768px) {
  .header-container {
    padding: 0 16px;
    
    .title, .username { 
      display: none; 
    }
    
    .header-right {
      gap: 12px;
      
      .submit-vuln-btn {
        padding: 10px 16px;
        font-size: 14px;
      }
    }
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
    
    .header-right {
      gap: 8px;
      
      .submit-vuln-btn {
        padding: 10px;
        min-width: 44px;
      }
    }
  }
}
</style>
