import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

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
      requiresAuth: false
    }
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('@/views/Dashboard.vue'),
    meta: { 
      title: '测试页面',
      requiresAuth: false
    },
  },
  {
    path: '/database',
    name: 'database',
    component: () => import('@/views/Database.vue'),
    meta: {
      title: '漏洞库',
      requiresAuth: false
    }
  },
  {
    path: '/database/detail/:id',
    name: 'database-detail',
    component: () => import('@/views/DatabaseDetail.vue'),
    meta: {
      title: '漏洞详情',
      requiresAuth: false
    }
  },
  {
    path: '/userinfo',
    name: 'userinfo',
    component: () => import('@/views/Userinfo.vue'),
    meta: { 
      title: '用户信息页面',
      requiresAuth: false 
    }
  },
  {
    path: '/message',
    name: 'message',
    component: () => import('@/views/Message.vue'),
    meta: {
      title: '消息中心',
      requiresAuth: false
    }
  },
  {
    path: '/submit',
    name: 'submit',
    component: () => import('@/views/Submit.vue'),
    meta: {
      title: '提交漏洞',
      requiresAuth: false
    }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: {
      title: '设置中心',
      requiresAuth: false
    }
  },
  {
    path: '/analysis',
    name: 'analysis',
    component: () => import('@/views/Analysis.vue'),
    meta: {
      title: '漏洞报告',
      requiresAuth: false
    }
  },
  {
    path: '/cnnvd',
    name: 'cnnvd',
    component: () => import('@/views/CNNVD.vue'),
    meta: {
      title: 'CNNVD动态',
      requiresAuth: false
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
  history: createWebHistory('/'),
  routes,
  scrollBehavior(to, from, savedPosition) {
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

// 模拟检查用户是否已登录的函数
const isAuthenticated = (): boolean => {
  // 这里可以检查 localStorage, sessionStorage, vuex/pinia 等
  return !!localStorage.getItem('authToken')
}

// 全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  const title = to.meta.title ? `${to.meta.title} | 我的应用` : '我的应用'
  document.title = title

  const isLoggedIn = isAuthenticated()
  
  // 如果是访客专用页面（如登录页）
  if (to.meta.guestOnly && isLoggedIn) {
    next({ name: 'Home' })
    return
  }
  
  // 如果需要认证但未登录
  if (to.meta.requiresAuth && !isLoggedIn) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  next()
})

// 路由错误处理
router.onError((error, to, from) => {
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
router.beforeResolve(async (to, from, next) => {
  // 可以在这里显示加载状态
  // showLoading()
  next()
})

router.afterEach((to, from) => {
  // 可以在这里隐藏加载状态
  // hideLoading()
  
  // 页面访问统计等
  // analytics.track('page_view', { path: to.path, title: to.meta.title })
})

export default router