import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [vue()],
  build: {
    // 使用 esbuild 压缩 (比 terser 快 20-100x)
    minify: 'esbuild',
    // 目标浏览器 (移除 IE11 支持)
    target: 'es2015',
    // 关闭 sourcemap 加速构建
    sourcemap: false,
    // 提高警告阈值
    chunkSizeWarningLimit: 1000,
    // CSS 代码分割
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // 优化 chunk 分割
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Echarts 单独打包
            if (id.includes('echarts')) {
              return 'echarts';
            }
            // DevUI 组件库
            if (id.includes('devui')) {
              return 'vendor-devui';
            }
            // 编辑器
            if (id.includes('quill')) {
              return 'vendor-editor';
            }
            // Monaco Editor
            if (id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            // Vue 核心
            if (id.includes('vue') || id.includes('pinia') || id.includes('router')) {
              return 'vendor-vue';
            }
          }
        }
      }
    }
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['vue', 'vue-router', 'pinia']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "vue-devui/style.css";`
      }
    }
  },
  resolve: {
    alias: {
      '@devui-design/icons': path.resolve(__dirname, 'node_modules/@devui-design/icons'),
      '@': path.resolve(__dirname, './src'),
      '@stores': path.resolve(__dirname, './src/stores'),
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.css', '.vue']
  }
})

