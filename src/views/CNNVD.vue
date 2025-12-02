<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Public/Header.vue'

// 搜索相关
const searchKeyword = ref('')
const searchPlaceholder = ref('请输入关键词进行搜索')

// 分类标签
const categories = ref([
  { key: 'all', label: '全部', active: true },
  { key: 'product', label: '产品公告', active: false },
  { key: 'policy', label: '政策公告', active: false },
  { key: 'technical', label: '技术公告', active: false },
  { key: 'report', label: '统计报告', active: false }
])

// 热门搜索标签
const hotTags = ref([
  'CNNVD动态',
  '漏洞公告',
  '安全通报',
  '技术支撑'
])

// 公告数据
const announcements = ref([
  {
    id: 1,
    title: '2023年6月CNNVD关于印发新产品公告',
    category: 'product',
    date: '2023-06-15 14:17:30',
    summary: '国家CNNVD漏洞库发布了印发新产品的公告，涉及多个重要安全产品的发布和更新情况，请相关 单位和个人及时关注并采取相应的安全防护措施...',
    isHot: true,
    views: 1245
  },
  {
    id: 2,
    title: '2023年6月CNNVD漏洞人工审核公告',
    category: 'technical',
    date: '2023-06-10 16:45:20',
    summary: '国家CNNVD漏洞库发布人工审核相关公告，本月共审核漏洞报告3000余条，其中高危漏洞600余条，中危漏洞1200余条，低危1.1千余条...',
    isHot: false,
    views: 892
  },
  {
    id: 3,
    title: '2023年5月CNNVD漏洞库服务新产品公告',
    category: 'product',
    date: '2023-05-28 09:30:15',
    summary: '为进一步提升CNNVD漏洞库服务质量，现推出多项新产品和服务，包括漏洞预警系统、安全评估工具等，欢迎广大用户使用...',
    isHot: true,
    views: 2156
  },
  {
    id: 4,
    title: '2023年5月CNNVD漏洞库技术支撑单位公告',
    category: 'technical',
    date: '2023-05-20 11:22:45',
    summary: '国家CNNVD漏洞库技术支撑单位名单更新，新增多家专业安全机构，进一步加强漏洞发现、分析和处置能力...',
    isHot: false,
    views: 756
  },
  {
    id: 5,
    title: '2023年4月CNNVD漏洞库月度统计报告',
    category: 'report',
    date: '2023-04-30 17:15:30',
    summary: '2023年4月，CNNVD漏洞库共收录各类安全漏洞1580个，其中高危漏洞320个，中危漏洞890个，低危漏洞370个...',
    isHot: false,
    views: 1023
  }
])

// 最新动态
const latestNews = ref([
  {
    title: '2023年6月CNNVD关于印发新产品公告',
    date: '2023年6月15日'
  },
  {
    title: '2023年6月CNNVD漏洞库人工审核公告',
    date: '2023年6月10日'
  },
  {
    title: '2023年5月CNNVD漏洞库服务新产品公告',
    date: '2023年5月28日'
  },
  {
    title: '2023年5月CNNVD漏洞库技术支撑单位公告',
    date: '2023年5月20日'
  },
  {
    title: '2023年4月CNNVD漏洞库月度统计报告',
    date: '2023年4月30日'
  }
])

// 分类统计
const categoryStats = ref([
  { name: '产品公告', count: 9 },
  { name: '政策公告', count: 7 },
  { name: '技术公告', count: 12 },
  { name: '统计报告', count: 5 }
])

// 搜索功能
const handleSearch = () => {
  console.log('搜索关键词:', searchKeyword.value)
  // 这里实现搜索逻辑
}

// 分类切换
const handleCategoryChange = (categoryKey: string) => {
  categories.value.forEach(cat => {
    cat.active = cat.key === categoryKey
  })
  console.log('切换分类:', categoryKey)
  // 这里实现分类筛选逻辑
}

// 热门标签点击
const handleHotTagClick = (tag: string) => {
  searchKeyword.value = tag
  handleSearch()
}

// 查看详情
const handleViewDetail = (id: number) => {
  console.log('查看详情:', id)
  // 这里实现跳转到详情页
}

onMounted(() => {
  // 页面加载时的初始化逻辑
  console.log('CNNVD页面已加载')
})
</script>

<template>
  <div class="cnnvd-page">
    <Header />

    <!-- 主横幅区域 -->
    <div class="hero-section">
      <div class="hero-background">
        <div class="geometric-shapes">
          <div class="shape shape-1"></div>
          <div class="shape shape-2"></div>
          <div class="shape shape-3"></div>
          <div class="shape shape-4"></div>
          <div class="shape shape-5"></div>
        </div>
      </div>

      <div class="hero-content">
        <h1 class="hero-title">CNNVD动态</h1>

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
            <!-- 分类导航 -->
            <div class="category-nav">
              <button
                v-for="category in categories"
                :key="category.key"
                :class="['category-btn', { active: category.active }]"
                @click="handleCategoryChange(category.key)"
              >
                {{ category.label }}
              </button>
            </div>

            <!-- 公告列表 -->
            <div class="announcement-list">
              <div
                v-for="item in announcements"
                :key="item.id"
                class="announcement-item"
                @click="handleViewDetail(item.id)"
              >
                <div class="announcement-header">
                  <div class="announcement-meta">
                    <span
                      v-if="item.isHot"
                      class="hot-badge"
                    >
                      热门
                    </span>
                    <span class="announcement-date">{{ item.date }}</span>
                  </div>
                  <div class="announcement-views">
                    <span>👁 {{ item.views }}</span>
                  </div>
                </div>

                <h3 class="announcement-title">{{ item.title }}</h3>
                <p class="announcement-summary">{{ item.summary }}</p>

                <div class="announcement-footer">
                  <button class="detail-btn">
                    查看详情
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧边栏 -->
          <div class="sidebar">
            <!-- 最新动态 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">最新动态</h3>
              <div class="news-list">
                <div
                  v-for="(news, index) in latestNews"
                  :key="index"
                  class="news-item"
                >
                  <div class="news-title">{{ news.title }}</div>
                  <div class="news-date">{{ news.date }}</div>
                </div>
              </div>
            </div>

            <!-- 分类统计 -->
            <div class="sidebar-card">
              <h3 class="sidebar-title">分类统计</h3>
              <div class="stats-list">
                <div
                  v-for="stat in categoryStats"
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
.cnnvd-page {
  min-height: 100vh;
  background-color: #f5f7fa;
}

/* 主横幅区域 */
.hero-section {
  position: relative;
  height: 400px;
  background: linear-gradient(135deg, #00c4cc 0%, #7b68ee 100%);
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

.geometric-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.shape {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 120px;
  height: 120px;
  top: 10%;
  right: 15%;
  animation-delay: 0s;
}

.shape-2 {
  width: 80px;
  height: 80px;
  top: 60%;
  right: 25%;
  animation-delay: 1s;
}

.shape-3 {
  width: 100px;
  height: 100px;
  top: 20%;
  left: 10%;
  animation-delay: 2s;
}

.shape-4 {
  width: 60px;
  height: 60px;
  top: 70%;
  left: 20%;
  animation-delay: 3s;
}

.shape-5 {
  width: 140px;
  height: 140px;
  top: 40%;
  right: 5%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
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
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.search-container {
  margin-bottom: 2rem;
}

.search-box {
  display: flex;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-radius: 50px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.search-input {
  flex: 1;
  padding: 15px 25px;
  border: none;
  outline: none;
  font-size: 1.1rem;
  background: transparent;
}

.search-btn {
  padding: 15px 25px;
  background: #ff6b6b;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1.2rem;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background: #ff5252;
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
  background: rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.hot-tag:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
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

.category-nav {
  display: flex;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  padding: 0;
}

.category-btn {
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

.category-btn:hover {
  background: #e9ecef;
  color: #333;
}

.category-btn.active {
  color: #007bff;
  background: white;
  border-bottom-color: #007bff;
  font-weight: 600;
}

/* 公告列表 */
.announcement-list {
  padding: 0;
}

.announcement-item {
  padding: 25px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.3s;
}

.announcement-item:hover {
  background: #f8f9fa;
  transform: translateX(5px);
}

.announcement-item:last-child {
  border-bottom: none;
}

.announcement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.announcement-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.hot-badge {
  background: #ff4757;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.announcement-date {
  color: #666;
  font-size: 0.9rem;
}

.announcement-views {
  color: #999;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 5px;
}

.announcement-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  line-height: 1.4;
}

.announcement-summary {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.announcement-footer {
  display: flex;
  justify-content: flex-end;
}

.detail-btn {
  padding: 8px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.detail-btn:hover {
  background: #0056b3;
  transform: translateY(-2px);
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

.news-list {
  padding: 0;
}

.news-item {
  padding: 15px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.3s;
}

.news-item:hover {
  background: #f8f9fa;
}

.news-item:last-child {
  border-bottom: none;
}

.news-title {
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
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
  background: #007bff;
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

  .category-nav {
    flex-wrap: wrap;
  }

  .category-btn {
    flex: none;
    min-width: 100px;
  }

  .announcement-item {
    padding: 20px;
  }

  .announcement-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .hot-tags {
    justify-content: center;
  }
}
</style>