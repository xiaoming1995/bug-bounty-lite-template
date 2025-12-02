<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Public/Header.vue'

// 搜索相关
const searchKeyword = ref('')
const searchPlaceholder = ref('请输入关键词进行搜索')

// 报告类型标签
const reportTypes = ref([
  { key: 'weekly', label: '周报', active: true },
  { key: 'monthly', label: '月报', active: false }
])

// 热门搜索标签
const hotTags = ref([
  '漏洞报告',
  '安全分析',
  '威胁情报',
  '风险评估'
])

// 漏洞报告数据
const vulnerabilityReports = ref([
  {
    id: 1,
    title: '信息安全漏洞周报第789期',
    type: 'weekly',
    date: '2024-07-15 18:30',
    summary: '本周共收录各类安全漏洞45个，其中高危漏洞12个，中危漏洞23个，低危漏洞10个。主要涉及操作系统、Web应用、数据库等领域...',
    reportNumber: '第789期',
    views: 1456
  },
  {
    id: 2,
    title: '信息安全漏洞周报第788期',
    type: 'weekly',
    date: '2024-07-08 14:30',
    summary: '本周共收录各类安全漏洞38个，其中高危漏洞8个，中危漏洞20个，低危漏洞10个。重点关注Apache、Microsoft等厂商的安全更新...',
    reportNumber: '第788期',
    views: 1234
  },
  {
    id: 3,
    title: '信息安全漏洞周报第787期',
    type: 'weekly',
    date: '2024-07-01 10:45',
    summary: '本周共收录各类安全漏洞52个，其中高危漏洞15个，中危漏洞27个，低危漏洞10个。特别关注零日漏洞和供应链安全问题...',
    reportNumber: '第787期',
    views: 1678
  },
  {
    id: 4,
    title: '信息安全漏洞周报第786期',
    type: 'weekly',
    date: '2024-06-24 13:15',
    summary: '本周共收录各类安全漏洞41个，其中高危漏洞9个，中危漏洞22个，低危漏洞10个。重点分析了IoT设备和移动应用的安全风险...',
    reportNumber: '第786期',
    views: 987
  }
])

// 最新报告
const latestReports = ref([
  {
    title: '信息安全漏洞周报第789期',
    date: '2024年7月15日'
  },
  {
    title: '信息安全漏洞周报第788期',
    date: '2024年7月8日'
  },
  {
    title: '信息安全漏洞周报第787期',
    date: '2024年7月1日'
  },
  {
    title: '信息安全漏洞周报第786期',
    date: '2024年6月24日'
  },
  {
    title: '信息安全漏洞周报第785期',
    date: '2024年6月17日'
  }
])

// 报告统计
const reportStats = ref([
  { name: '周报', count: 52 },
  { name: '月报', count: 12 },
  { name: '专题报告', count: 8 },
  { name: '年度报告', count: 3 }
])

// 搜索功能
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
  // 这里实现搜索逻辑
}

// 报告类型切换
const handleTypeChange = (typeKey: string) => {
  reportTypes.value.forEach(type => {
    type.active = type.key === typeKey
  })
  console.log('切换报告类型:', typeKey)
  // 这里实现类型筛选逻辑
}

// 热门标签点击
const handleHotTagClick = (tag: string) => {
  searchKeyword.value = tag
  handleSearch()
}

// 查看报告详情
const handleViewReport = (id: number) => {
  console.log('查看报告详情:', id)
  // 这里实现跳转到报告详情页
}

onMounted(() => {
  console.log('漏洞报告页面已加载')
})
</script>

<template>
  <div class="vulnerability-report-page">
    <Header />

    <!-- 主横幅区域 -->
    <div class="hero-section">
      <div class="hero-background">
        <!-- 代码背景效果 -->
        <div class="code-background">
          <div class="code-lines">
            <div class="code-line">function analyzeVulnerability() {</div>
            <div class="code-line">  const threats = detectThreats();</div>
            <div class="code-line">  const risk = calculateRisk(threats);</div>
            <div class="code-line">  return generateReport(risk);</div>
            <div class="code-line">}</div>
            <div class="code-line"></div>
            <div class="code-line">class SecurityAnalyzer {</div>
            <div class="code-line">  constructor() {</div>
            <div class="code-line">    this.vulnerabilities = [];</div>
            <div class="code-line">  }</div>
          </div>
        </div>

        <!-- 3D立方体效果 -->
        <div class="cube-container">
          <div class="cube">
            <div class="cube-face front"></div>
            <div class="cube-face back"></div>
            <div class="cube-face right"></div>
            <div class="cube-face left"></div>
            <div class="cube-face top"></div>
            <div class="cube-face bottom"></div>
          </div>
        </div>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">漏洞报告</h1>

        <!-- 搜索框 -->
        <div class="search-container">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              :placeholder="searchPlaceholder"
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button
              class="search-btn"
              @click="handleSearch"
            >
              🔍
            </button>
          </div>
        </div>

        <!-- 热门搜索标签 -->
        <div class="hot-tags">
          <span class="hot-tags-label">热门搜索：</span>
          <span
            v-for="tag in hotTags"
            :key="tag"
            class="hot-tag"
            @click="handleHotTagClick(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="main-content">
      <div class="container">
        <div class="content-wrapper">
          <!-- 左侧内容区 -->
          <div class="content-left">
            <!-- 报告类型导航 -->
            <div class="type-nav">
              <button
                v-for="type in reportTypes"
                :key="type.key"
                :class="['type-btn', { active: type.active }]"
                @click="handleTypeChange(type.key)"
              >
                {{ type.label }}
              </button>
            </div>

            <!-- 报告列表 -->
            <div class="report-list">
              <div
                v-for="item in vulnerabilityReports"
                :key="item.id"
                class="report-item"
                @click="handleViewReport(item.id)"
              >
                <div class="report-header">
                  <div class="report-meta">
                    <span class="report-number">{{ item.reportNumber }}</span>
                    <span class="report-date">{{ item.date }}</span>
                  </div>
                  <div class="report-views">
                    <span>👁 {{ item.views }}</span>
                  </div>
                </div>

                <h3 class="report-title">{{ item.title }}</h3>
                <p class="report-summary">{{ item.summary }}</p>

                <div class="report-footer">
                  <button class="download-btn">
                    📄 查看报告
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="sidebar">
            <!-- 最新报告 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">最新报告</h3>
              <div class="report-news-list">
                <div
                  v-for="(report, index) in latestReports"
                  :key="index"
                  class="report-news-item"
                >
                  <div class="report-news-title">{{ report.title }}</div>
                  <div class="report-news-date">{{ report.date }}</div>
                </div>
              </div>
            </div>

            <!-- 报告统计 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">报告统计</h3>
              <div class="stats-list">
                <div
                  v-for="stat in reportStats"
                  :key="stat.name"
                  class="stat-item"
                >
                  <span class="stat-name">{{ stat.name }}</span>
                  <span class="stat-count">{{ stat.count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vulnerability-report-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 主横幅区域 */
.hero-section {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

/* 代码背景效果 */
.code-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
}

.code-lines {
  position: absolute;
  top: 20%;
  left: 5%;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #00ff88;
  line-height: 1.8;
  animation: codeScroll 20s linear infinite;
}

.code-line {
  margin-bottom: 8px;
  white-space: nowrap;
}

@keyframes codeScroll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50px);
  }
}

/* 3D立方体效果 */
.cube-container {
  position: absolute;
  top: 20%;
  right: 10%;
  perspective: 1000px;
}

.cube {
  width: 120px;
  height: 120px;
  position: relative;
  transform-style: preserve-3d;
  animation: rotateCube 10s infinite linear;
}

.cube-face {
  position: absolute;
  width: 120px;
  height: 120px;
  background: rgba(0, 255, 136, 0.1);
  border: 2px solid rgba(0, 255, 136, 0.3);
  backdrop-filter: blur(10px);
}

.cube-face.front {
  transform: rotateY(0deg) translateZ(60px);
}

.cube-face.back {
  transform: rotateY(180deg) translateZ(60px);
}

.cube-face.right {
  transform: rotateY(90deg) translateZ(60px);
}

.cube-face.left {
  transform: rotateY(-90deg) translateZ(60px);
}

.cube-face.top {
  transform: rotateX(90deg) translateZ(60px);
}

.cube-face.bottom {
  transform: rotateX(-90deg) translateZ(60px);
}

@keyframes rotateCube {
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg);
  }
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  max-width: 800px;
  padding: 0 20px;
}

.hero-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  background: linear-gradient(45deg, #00ff88, #00d4ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.search-container {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.search-input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  outline: none;
  font-size: 1.1rem;
  background: transparent;
  color: white;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.search-btn {
  padding: 15px 25px;
  background: linear-gradient(45deg, #00ff88, #00d4ff);
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s;
}

.search-btn:hover {
  transform: scale(1.05);
}

.hot-tags {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.hot-tags-label {
  font-size: 1rem;
  margin-right: 10px;
  opacity: 0.9;
}

.hot-tag {
  padding: 8px 16px;
  background: rgba(0, 255, 136, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  border: 1px solid rgba(0, 255, 136, 0.3);
}

.hot-tag:hover {
  background: rgba(0, 255, 136, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
}

/* 主内容区域 */
.main-content {
  padding: 40px 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 40px;
}

/* 左侧内容区 */
.content-left {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.type-nav {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 0;
}

.type-btn {
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #666;
  transition: all 0.3s;
  border-bottom: 3px solid transparent;
}

.type-btn:hover {
  background: #e9ecef;
  color: #333;
}

.type-btn.active {
  color: #007bff;
  background: white;
  border-bottom-color: #007bff;
  font-weight: 600;
}

/* 报告列表 */
.report-list {
  padding: 0;
}

.report-item {
  padding: 25px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.report-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.report-item:last-child {
  border-bottom: none;
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.report-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.report-number {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.report-date {
  color: #666;
  font-size: 0.9rem;
}

.report-views {
  color: #999;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.report-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.report-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.report-footer {
  display: flex;
  justify-content: flex-end;
}

.download-btn {
  padding: 8px 20px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 右侧边栏 */
.sidebar {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.sidebar-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.sidebar-title {
  background: #f8f9fa;
  padding: 20px;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e9ecef;
}

.report-news-list {
  padding: 0;
}

.report-news-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
  cursor: pointer;
}

.report-news-item:hover {
  background: #f8f9fa;
}

.report-news-item:last-child {
  border-bottom: none;
}

.report-news-title {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.report-news-date {
  font-size: 0.8rem;
  color: #999;
}

.stats-list {
  padding: 0;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-name {
  font-size: 0.9rem;
  color: #333;
}

.stat-count {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .type-nav {
    flex-wrap: wrap;
  }

  .type-btn {
    flex: none;
    min-width: 100px;
  }

  .report-item {
    padding: 20px;
  }

  .report-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .hot-tags {
    justify-content: center;
  }

  .cube-container {
    display: none;
  }
}
</style>