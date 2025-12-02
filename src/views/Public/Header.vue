<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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

const handleMenuClick = (data: Object) => {
  activeKey.value = data.key
  const  key = data.key
  console.log('进来了',key)
  console.log('可用路由名称:', router.getRoutes().map(r => r.name))
  switch(key) {
    case 'warning':
      router.push({ name: 'WarningCenter' }) // 使用命名路由
      break
    case 'home':
        router.push('/login')
        break;
    case 'test':
        router.push('/test')
        break;
    // 其他菜单项...
  }
}

const handleUserMenuClick = async (data: any) => {
  // DevUI menu 的 select 事件会传递 { id, key } 对象
  const itemId = data.id || data.key
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
    case 'logout':
      // 处理退出登录
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

const handleToggle =  (val :string) => {
        console.log(val)
}

const handleSubmitVulnerability = () => {
  // 跳转到sublime路由
  router.push('/submit')
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
      </d-menu>
    </div>

    <!-- 右侧功能区 - 重点修复区域 -->
    <div class="header-right">
      <d-button
        bs-style="primary"
        bs-size="sm"
        class="submit-btn"
        @click="handleSubmitVulnerability"
      >
        <template #icon><d-icon name="plus"/></template>
        提交漏洞
      </d-button>
        <div class="user-dropdown-container">
        <d-menu 
          mode="horizontal" 
          class="user-trigger" 
          :router="false"
          @select="handleUserMenuClick"
        >
          <d-avatar :width="32" :height="32" :icon="!userInfo.avatar && 'user'">
            <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="avatar">
          </d-avatar>
          <d-sub-menu :title="userInfo.name" key="course" class="username">
            <d-menu-item   
              v-for="item in userMenuOptions" 
              :key="item.id" 
              :id="item.id"
            >
              <template #icon>
                <d-icon :name="item.icon" />
              </template>
              {{ item.name }} 
            </d-menu-item>
          </d-sub-menu>
        </d-menu>
    </div>
      <div class="user-dropdown-container">
      
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
    
    .submit-btn { margin-right: 16px; }

    .user-dropdown-container {
      position: relative;
      
      .user-trigger {
        display: flex;
        align-items: center;
        padding: 4px 12px;
        cursor: pointer;
        border-radius: 16px;
        transition: all 0.3s;
        
        &:hover {
          background: #f2f5fc;
        }
        
        .username {
          margin: 0 8px;
          font-size: 14px;
        }
        
        .devui-icon {
          transition: transform 0.3s;
          &.rotate {
            transform: rotate(180deg);
          }
        }
      }
      
      .user-dropdown {
        position: absolute;
        right: 0;
        top: calc(100% + 8px);
        min-width: 120px;
        
        :deep(.devui-dropdown-menu) {
          display: block !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 0 12px;
    .title, .username { display: none; }
    .submit-btn {
      padding: 0 8px;
      margin-right: 8px;
      :deep(.devui-button-content) span { display: none; }
    }
  }
}
</style>
