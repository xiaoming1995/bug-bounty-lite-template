<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter, type RouteLocationNormalized } from 'vue-router'
const router = useRouter();
// 安全设置文档标题
const setDocumentTitle = (to: RouteLocationNormalized) => {
  const title = typeof to.meta.title === 'string' 
    ? to.meta.title 
    : '默认标题';
  document.title = title;
};
// 全局路由守卫
onMounted(() => {
  router.afterEach((to) => {
    setDocumentTitle(to);
    
    // 可扩展的其他全局路由逻辑
    // 例如埋点统计、权限校验等
  });
});
</script>



<template>
  <!-- 基础布局容器 -->
  <div class="app-container">
    <!-- 可选的全局导航栏 -->
    <!-- <header class="app-header" v-if="$route.meta.showHeader !== false">
      <img 
        src="./assets/logo.svg" 
        class="logo" 
        alt="Vue logo" 
        @click="router.push('/')"
      >
    </header> -->
    <!-- 主内容区 -->
    <main class="app-main">
      <!-- <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="$route.path" />
        </transition>
      </router-view> -->
      <router-view></router-view>
    </main>
    <!-- 可选的全局页脚 -->
    <footer class="app-footer" v-if="$route.meta.showFooter !== false">
      © 2023 Vue App
    </footer>
  </div>
</template>
<style scoped>
/* 基础布局样式 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.app-header {
  padding: 1rem;
  background-color: #f8f9fa;
}
.app-main {
  flex: 1;
  /* padding: 2rem; */
}
.app-footer {
  padding: 1rem;
  text-align: center;
  background-color: #f8f9fa;
}
/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Logo 样式 */
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
  cursor: pointer;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
<!-- 全局样式 (非scoped) -->
<style>
/* 基础重置 */
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
/* 路由链接样式 */
.router-link-active {
  font-weight: bold;
  color: #42b983;
}
</style>
