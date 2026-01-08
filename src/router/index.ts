import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: '登录',
      guestOnly: true,
      requiresAuth: false
    }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '首页',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Dashboard.vue'),
    meta: {
      title: '测试页面',
      requiresAuth: true  // 需要登录
    },
  },
  {
    path: '/database',
    name: 'database',
    component: () => import('@/views/Database.vue'),
    meta: {
      title: '漏洞库',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/database/detail/:id',
    name: 'database-detail',
    component: () => import('@/views/DatabaseDetail.vue'),
    meta: {
      title: '漏洞详情',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('@/views/Userinfo.vue'),
    meta: {
      title: '用户信息页面',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/Message.vue'),
    meta: {
      title: '消息中心',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/submit',
    name: 'submit',
    component: () => import('@/views/Submit.vue'),
    meta: {
      title: '提交漏洞',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '设置中心',
      requiresAuth: true  // 需要登录
    }
  },
  {
    path: '/project-hall',
    name: 'project-hall',
    component: () => import('@/views/ProjectHall.vue'),
    meta: {
      title: '项目大厅',
      requiresAuth: true
    }
  },
  {
    path: '/project-hall/:id',
    name: 'project-hall-detail',
    component: () => import('@/views/ProjectHallDetail.vue'),
    meta: {
      title: '项目详情',
      requiresAuth: true
    }
  },
  {
    path: '/learning-center',
    name: 'learning-center',
    component: () => import('@/views/LearningCenter.vue'),
    meta: {
      title: '学习中心',
      requiresAuth: true
    }
  },
  {
    path: '/learning-center/:id',
    name: 'learning-center-detail',
    component: () => import('@/views/LearningCenterDetail.vue'),
    meta: {
      title: '文章详情',
      requiresAuth: true
    }
  },
  {
    path: '/ranking',
    name: 'ranking',
    component: () => import('@/views/Ranking.vue'),
    meta: {
      title: '白帽子排行榜',
      requiresAuth: true
    }
  },
  {
    path: '/security-dashboard',
    name: 'security-dashboard',
    component: () => import('@/views/SecurityDashboard.vue'),
    meta: {
      title: '安全态势大屏',
      requiresAuth: true
    }
  },
  {
    path: '/post-article',
    name: 'post-article',
    component: () => import('@/views/PostArticle.vue'),
    meta: {
      title: '发布文章',
      requiresAuth: true
    }
  }







  // 404 页面 - 放在最后
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('@/views/NotFound.vue'),
  //   meta: { title: '页面未找到' }
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, _from, savedPosition) {
    // 如果有保存的位置，则恢复到该位置
    if (savedPosition) {
      return savedPosition
    }
    // 如果有锚点，则滚动到锚点
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    }
    // 否则滚动到顶部
    return { top: 0, behavior: 'smooth' }
  }
})

// 全局前置守卫
router.beforeEach(async (to, _from, next) => {
  // 设置页面标题
  const title = to.meta.title ? `${to.meta.title} | 漏洞情报中心` : '漏洞情报中心'
  document.title = title

  // 使用 Pinia store 检查登录状态
  const userStore = useUserStore()
  const isLoggedIn = userStore.isAuthenticated

  // 如果是访客专用页面（如登录页），已登录用户跳转到首页
  if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Home' })
    return
  }

  // 如果需要认证但未登录，重定向到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    // 保存要访问的路径，登录后可以跳转回来
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // 如果已登录，检查 token 是否过期
  if (isLoggedIn && userStore.isTokenExpired()) {
    // 尝试刷新 token
    const refreshed = await userStore.refreshTokenIfNeeded()
    if (!refreshed) {
      // 刷新失败，清除认证信息并跳转登录
      userStore.clearAuth()
      next({
        name: 'Login',
        query: { redirect: to.fullPath }
      })
      return
    }
  }

  // 允许访问
  next()
})

// 路由错误处理
router.onError((error, _to, _from) => {
  console.error('路由错误:', error)

  // 如果是组件加载错误
  if (error.message?.includes('Loading chunk')) {
    // 代码分割导致的加载错误，重新加载页面
    window.location.reload()
  } else if (error.message?.includes('Failed to fetch')) {
    // 网络错误，可以显示错误提示
    console.warn('网络错误，请检查网络连接')
  }
})

// 路由加载进度提示（可选）
router.beforeResolve(async (_to, _from, next) => {
  // 可以在这里显示加载状态
  // showLoading()
  next()
})

router.afterEach((_to, _from) => {
  // 可以在这里隐藏加载状态
  // hideLoading()

  // 页面访问统计等
  // analytics.track('page_view', { path: to.path, title: to.meta.title })
})

export default router