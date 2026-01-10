<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from './Public/Header.vue'

// 统计数据
const stats = ref([
  {
    value: 156,
    title: '严重漏洞',
    iconColor: '#7c3aed', // 紫色 - 最严重
    trend: { value: 12, direction: 'up', color: '#ef4444', percentage: '8.2%' }
  },
  {
    value: 896,
    title: '高危漏洞',
    iconColor: '#ef4444', // 红色
    trend: { value: 23, direction: 'down', color: '#10b981', percentage: '12.5%' }
  },
  {
    value: 1284,
    title: '中危漏洞',
    iconColor: '#f59e0b', // 橙色
    trend: { value: 45, direction: 'up', color: '#10b981', percentage: '5.3%' }
  },
  {
    value: 2156,
    title: '低危漏洞',
    iconColor: '#3b82f6', // 蓝色
    trend: { value: 18, direction: 'down', color: '#ef4444', percentage: '3.1%' }
  }
])

// 漏洞数据
interface Vulnerability {
  id: string
  title: string
  severity: '高危' | '中危' | '低危'
  status: '未审核' | '已审核' | '已修复'
  publishTime: string
  author: string
  cveId?: string
  score?: number
}

const loading = ref(true)
const publishedVulnerabilities = ref<Vulnerability[]>([])
const reviewedVulnerabilities = ref<Vulnerability[]>([])

// 模拟数据获取
const fetchVulnerabilities = () => {
  loading.value = true
  setTimeout(() => {
    publishedVulnerabilities.value = [
      { id: 'VUL-2023-001', title: 'SQL注入漏洞存在于用户登录模块', severity: '高危', status: '未审核', publishTime: '2023-05-15 14:30', author: '张研究员' },
      { id: 'VUL-2023-002', title: 'XSS跨站脚本漏洞在评论功能中', severity: '中危', status: '未审核', publishTime: '2023-05-15 10:15', author: '李测试' },
      { id: 'VUL-2023-003', title: 'CSRF跨站请求伪造漏洞', severity: '中危', status: '未审核', publishTime: '2023-05-14 16:45', author: '王开发', cveId: 'CVE-2023-12345' },
      { id: 'VUL-2023-004', title: '文件上传漏洞允许执行恶意代码', severity: '高危', status: '未审核', publishTime: '2023-05-14 09:20', author: '安全团队' },
      { id: 'VUL-2023-005', title: '信息泄露漏洞在API响应中', severity: '低危', status: '未审核', publishTime: '2023-05-13 11:10', author: '渗透测试员' },
      { id: 'VUL-2023-006', title: '未授权访问漏洞', severity: '高危', status: '未审核', publishTime: '2023-05-12 09:00', author: '匿名' }
    ]

    reviewedVulnerabilities.value = [
      { id: 'VUL-2023-006', title: '权限提升漏洞在管理员面板', severity: '高危', status: '已审核', publishTime: '2023-05-12 08:30', author: '赵研究员', cveId: 'CVE-2023-12346', score: 8.2 },
      { id: 'VUL-2023-007', title: 'SSRF服务器端请求伪造漏洞', severity: '高危', status: '已审核', publishTime: '2023-05-11 15:20', author: '外部研究员', cveId: 'CVE-2023-12347', score: 7.5 },
      { id: 'VUL-2023-008', title: '不安全的反序列化漏洞', severity: '中危', status: '已审核', publishTime: '2023-05-10 13:45', author: '开发团队', score: 5.8 },
      { id: 'VUL-2023-009', title: '密码重置功能存在逻辑缺陷', severity: '中危', status: '已审核', publishTime: '2023-05-09 17:30', author: '安全审计员', score: 6.4 },
      { id: 'VUL-2023-010', title: '目录遍历漏洞允许访问系统文件', severity: '高危', status: '已审核', publishTime: '2023-05-08 10:15', author: '白帽黑客', cveId: 'CVE-2023-12348', score: 9.1 },
      { id: 'VUL-2023-011', title: '弱口令漏洞', severity: '低危', status: '已审核', publishTime: '2023-05-07 11:00', author: '内部自查', score: 3.5 }
    ]

    loading.value = false
  }, 1500)
}

const getSeverityColor = (severity: string) => {
  const colors: Record<string, string> = {
    '高危': 'danger', 
    '中危': 'warning',
    '低危': 'primary'
  }
  return colors[severity] || 'default'
}

const viewDetail = (id: string) => {
  console.log('查看详情:', id)
}

const viewMore = (style : string) => {
    console.log('跳转更多',style)
}

// 漏洞等级分布数据
const totalVulns = computed(() => stats.value.reduce((sum, item) => sum + item.value, 0))

const distributionData = computed(() => {
  const total = totalVulns.value || 1
  return stats.value.map((item, index) => {
    const colors = ['#7c3aed', '#ef4444', '#f59e0b', '#3b82f6'] // 紫、红、橙、蓝
    const percentage = (item.value / total) * 100
    return {
      label: item.title,
      value: item.value,
      percentage: percentage.toFixed(1),
      color: colors[index]
    }
  })
})

// 计算环形图的SVG路径
const getDonutSegments = computed(() => {
  const total = totalVulns.value || 1
  let cumulativePercent = 0
  const radius = 80
  const cx = 100
  const cy = 100
  
  return distributionData.value.map(item => {
    const percent = (item.value / total) * 100
    const startAngle = cumulativePercent * 3.6 - 90 // 从顶部开始
    cumulativePercent += percent
    const endAngle = cumulativePercent * 3.6 - 90
    
    const startRad = (startAngle * Math.PI) / 180
    const endRad = (endAngle * Math.PI) / 180
    
    const x1 = cx + radius * Math.cos(startRad)
    const y1 = cy + radius * Math.sin(startRad)
    const x2 = cx + radius * Math.cos(endRad)
    const y2 = cy + radius * Math.sin(endRad)
    
    const largeArcFlag = percent > 50 ? 1 : 0
    
    return {
      ...item,
      path: `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
    }
  })
})

// 趋势图周期切换
type TrendPeriod = 'day' | 'month' | 'year'
const trendPeriod = ref<TrendPeriod>('month')

// 生成当前月全部日期
const generateCurrentMonthDays = () => {
  const days = []
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  // 获取当前月的天数
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      label: `${i}日`,
      value: Math.floor(Math.random() * 30) + 5 // 模拟数据
    })
  }
  return days
}

// 模拟趋势数据
const trendDataRaw = ref({
  day: generateCurrentMonthDays(),
  month: [
    { label: '1月', value: 85 }, { label: '2月', value: 92 }, { label: '3月', value: 78 },
    { label: '4月', value: 125 }, { label: '5月', value: 145 }, { label: '6月', value: 168 },
    { label: '7月', value: 210 }, { label: '8月', value: 185 }, { label: '9月', value: 156 },
    { label: '10月', value: 178 }, { label: '11月', value: 198 }, { label: '12月', value: 225 }
  ],
  year: [
    { label: '2021', value: 856 }, { label: '2022', value: 1245 },
    { label: '2023', value: 1689 }, { label: '2024', value: 2156 }, { label: '2025', value: 2892 }
  ]
})

const trendData = computed(() => trendDataRaw.value[trendPeriod.value])
const trendMax = computed(() => Math.max(...trendData.value.map((d: { value: number }) => d.value)))

// 切换周期
const setPeriod = (period: TrendPeriod) => {
  trendPeriod.value = period
}

onMounted(fetchVulnerabilities)
</script>

<template>
  <Header />
  
  <div class="dashboard-container">
    <div class="dashboard-content">
    <!-- 统计卡片 -->
    <div class="stats-row">
      <div v-for="(stat, index) in stats" :key="index" class="stat-item">
        <div class="stat-card">
          <!-- 骨架屏状态 -->
          <template v-if="loading">
            <div class="stat-header">
              <div class="skeleton-pulse icon-placeholder"></div>
              <div class="skeleton-pulse text-placeholder" style="width: 60px"></div>
            </div>
            <div class="stat-body">
              <div class="skeleton-pulse value-placeholder"></div>
              <div class="skeleton-pulse text-placeholder" style="width: 80px; margin-top: 8px"></div>
            </div>
          </template>
          
          <!-- 真实内容 -->
          <template v-else>
            <!-- 左侧颜色条 -->
            <div class="level-indicator" :style="{ backgroundColor: stat.iconColor }"></div>
            
            <div class="stat-header">
              <div class="level-icon" :style="{ backgroundColor: stat.iconColor + '15', color: stat.iconColor }">
                <span class="icon-dot" :style="{ backgroundColor: stat.iconColor }"></span>
              </div>
              <span class="stat-title">{{ stat.title }}</span>
            </div>
            
            <div class="stat-body">
              <div class="stat-value" :style="{ color: stat.iconColor }">
                <d-statistic 
                  :value="stat.value" 
                  group-separator="," 
                  :animation="true"
                />
              </div>
              <div class="trend-info">
                <span class="trend-value" :class="stat.trend.direction">
                  {{ stat.trend.direction === 'up' ? '↑' : '↓' }} {{ stat.trend.percentage }} 较上月
                </span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 图表区域 -->
    <div class="charts-section">
      <!-- 漏洞等级分布 -->
      <div class="chart-card distribution-card">
        <div class="card-header">
          <span class="title">漏洞严重等级分布</span>
          <span class="more-link" @click="viewMore('distribution')">查看详情</span>
        </div>
        <div class="card-body">
          <div v-if="loading" class="chart-wrapper skeleton-chart">
            <div class="skeleton-pulse donut-placeholder"></div>
            <div class="chart-legend">
              <div v-for="n in 4" :key="n" class="legend-item">
                <div class="skeleton-pulse dot-placeholder"></div>
                <div class="skeleton-pulse text-placeholder" style="width: 120px"></div>
              </div>
            </div>
          </div>
          <div v-else class="chart-wrapper">
            <!-- 环形图 -->
            <div class="donut-chart">
              <svg viewBox="0 0 200 200">
                <path
                  v-for="(segment, index) in getDonutSegments"
                  :key="index"
                  :d="segment.path"
                  :fill="segment.color"
                  class="donut-segment"
                />
                <!-- 中心白色圆形 -->
                <circle cx="100" cy="100" r="50" fill="white" />
              </svg>
              <div class="chart-center-text">
                <span class="center-value">{{ totalVulns.toLocaleString() }}</span>
                <span class="center-label">漏洞总数</span>
              </div>
            </div>
            
            <!-- 图例 -->
            <div class="chart-legend">
              <div 
                v-for="(item, index) in distributionData" 
                :key="index" 
                class="legend-item"
              >
                <span class="legend-dot" :style="{ backgroundColor: item.color }"></span>
                <span class="legend-label">{{ item.label }}</span>
                <span class="legend-value">{{ item.value.toLocaleString() }}</span>
                <span class="legend-percent">{{ item.percentage }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 月度漏洞发现趋势 -->
      <div class="chart-card trend-card">
        <div class="card-header">
          <span class="title">月度漏洞发现趋势</span>
          <div class="period-toggle">
            <button 
              :class="{ active: trendPeriod === 'day' }" 
              @click="setPeriod('day')"
            >日</button>
            <button 
              :class="{ active: trendPeriod === 'month' }" 
              @click="setPeriod('month')"
            >月</button>
            <button 
              :class="{ active: trendPeriod === 'year' }" 
              @click="setPeriod('year')"
            >年</button>
          </div>
        </div>
        <div class="card-body">
          <div v-if="loading" class="trend-chart-wrapper skeleton-trend">
            <div class="y-axis">
              <div v-for="n in 3" :key="n" class="skeleton-pulse text-placeholder" style="width: 30px; margin-bottom: 40px"></div>
            </div>
            <div class="bar-chart">
              <div v-for="n in 12" :key="n" class="bar-item">
                <div class="skeleton-pulse bar-placeholder" :style="{ height: (20 + (n * 5) % 60) + '%' }"></div>
                <div class="skeleton-pulse text-placeholder" style="width: 24px; margin-top: 8px"></div>
              </div>
            </div>
          </div>
          <template v-else>
            <div class="trend-chart-wrapper">
              <!-- Y轴标签 -->
              <div class="y-axis">
                <span>{{ trendMax }}</span>
                <span>{{ Math.round(trendMax / 2) }}</span>
                <span>0</span>
              </div>
              
              <!-- 柱状图 -->
              <div class="bar-chart">
                <div 
                  v-for="(item, index) in trendData" 
                  :key="index" 
                  class="bar-item"
                >
                  <div class="bar-wrapper">
                    <div 
                      class="bar" 
                      :style="{ height: (item.value / trendMax * 100) + '%' }"
                    >
                      <span class="bar-value">{{ item.value }}</span>
                    </div>
                  </div>
                  <span class="bar-label">{{ item.label }}</span>
                </div>
              </div>
            </div>
            
            <!-- 底部说明 -->
            <div class="trend-footer">
              <span class="trend-desc">漏洞数量</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- 漏洞列表 -->
    <div class="content-row">
      <!-- 发布漏洞 -->
      <div class="content-col">
        <div class="content-card">
          <div class="card-header">
            <div class="header-left">
              <div class="icon-box danger">
                <div class="box-shape"></div>
              </div>
              <span class="title">发布漏洞</span>
              <span class="badge" v-if="!loading">{{ publishedVulnerabilities.length }}</span>
            </div>
            <d-button bs-style="text" class="more-btn" @click="viewMore('published')">
              查看全部 <d-icon name="arrow-right" size="12px" />
            </d-button>
          </div>
          
          <div class="card-body">
            <div class="vuln-list custom-scrollbar">
              <!-- 骨架屏列表 -->
              <template v-if="loading">
                <div v-for="n in 6" :key="n" class="vuln-item skeleton-item">
                  <div class="skeleton-pulse dot-placeholder"></div>
                  <div class="item-main">
                    <div class="skeleton-pulse title-placeholder"></div>
                    <div class="skeleton-pulse meta-placeholder"></div>
                  </div>
                </div>
              </template>

              <!-- 真实列表 -->
              <template v-else-if="publishedVulnerabilities.length > 0">
                <div 
                  v-for="item in publishedVulnerabilities" 
                  :key="item.id"
                  class="vuln-item"
                  @click="viewDetail(item.id)"
                >
                  <div class="item-status">
                    <span class="dot" :class="getSeverityColor(item.severity)"></span>
                  </div>
                  <div class="item-main">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-meta">
                      <span class="meta-tag">{{ item.id }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ item.author }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ item.publishTime }}</span>
                    </div>
                  </div>
                  <div class="item-tag">
                    <d-tag :type="getSeverityColor(item.severity)" size="sm">{{ item.severity }}</d-tag>
                  </div>
                </div>
              </template>
              <d-empty v-else mode="data" />
            </div>
          </div>
        </div>
      </div>

      <!-- 已审核漏洞 -->
      <div class="content-col">
        <div class="content-card">
          <div class="card-header">
            <div class="header-left">
              <div class="icon-box success">
                <div class="box-shape"></div>
              </div>
              <span class="title">已审核漏洞</span>
              <span class="badge success" v-if="!loading">{{ reviewedVulnerabilities.length }}</span>
            </div>
            <d-button bs-style="text" class="more-btn" @click="viewMore('reviewed')">
              查看全部 <d-icon name="arrow-right" size="12px" />
            </d-button>
          </div>
          
          <div class="card-body">
            <div class="vuln-list custom-scrollbar">
              <!-- 骨架屏列表 -->
              <template v-if="loading">
                <div v-for="n in 6" :key="n" class="vuln-item skeleton-item">
                  <div class="skeleton-pulse dot-placeholder"></div>
                  <div class="item-main">
                    <div class="skeleton-pulse title-placeholder"></div>
                    <div class="skeleton-pulse meta-placeholder"></div>
                  </div>
                </div>
              </template>

              <!-- 真实列表 -->
              <template v-else-if="reviewedVulnerabilities.length > 0">
                <div 
                  v-for="item in reviewedVulnerabilities" 
                  :key="item.id"
                  class="vuln-item"
                  @click="viewDetail(item.id)"
                >
                  <div class="item-status">
                    <span class="dot success"></span>
                  </div>
                  <div class="item-main">
                    <div class="item-title">{{ item.title }}</div>
                    <div class="item-meta">
                      <span class="meta-tag">{{ item.cveId || item.id }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ item.author }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ item.publishTime }}</span>
                    </div>
                  </div>
                  <div class="item-score" v-if="item.score">
                    <span class="score-val">{{ item.score }}</span>
                    <span class="score-label">分</span>
                  </div>
                </div>
              </template>
              <d-empty v-else mode="data" />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.dashboard-container {
  padding: 24px 32px;
  background-color: #f8fafc;
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dashboard-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  height: 100%;
}

// 骨架屏动画
@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.skeleton-pulse {
  background: #f1f5f9;
  border-radius: 4px;
  animation: pulse 1.5s ease-in-out infinite;
}

// 骨架屏占位符
.icon-placeholder { width: 36px; height: 36px; border-radius: 10px; margin-right: 12px; }
.text-placeholder { height: 14px; border-radius: 4px; }
.value-placeholder { height: 28px; width: 120px; border-radius: 4px; }
.dot-placeholder { width: 8px; height: 8px; border-radius: 50%; margin-right: 16px; }
.title-placeholder { height: 14px; width: 60%; margin-bottom: 8px; }
.meta-placeholder { height: 12px; width: 40%; }
.donut-placeholder { width: 180px; height: 180px; border-radius: 50%; flex-shrink: 0; }
.bar-placeholder { width: 18px; border-radius: 4px 4px 0 0; }

.stats-row {
  display: flex;
  gap: 20px;
  flex-shrink: 0;
  
  .stat-item {
    flex: 1;
    min-width: 0;
  }
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 22px 22px 22px 28px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  
  // 左侧等级颜色条
  .level-indicator {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    border-radius: 14px 0 0 14px;
  }
  
  // 等级图标
  .level-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    
    .icon-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
    
    .stat-title {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
    }
  }
  
  .stat-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    position: relative;
    z-index: 1;
    
    .stat-value {
      :deep(.devui-statistic-content-value) {
        font-size: 32px;
        font-weight: 700;
        color: inherit !important;
        font-family: 'Inter', -apple-system, sans-serif;
        letter-spacing: -0.02em;
      }
    }
    
    .trend-info {
      margin-top: 10px;
      display: flex;
      align-items: center;
      font-size: 12px;
      
      .trend-value {
        display: flex;
        align-items: center;
        gap: 4px;
        font-weight: 500;
        color: #94a3b8;
        
        &.up { color: #10b981; }
        &.down { color: #ef4444; }
      }
    }
  }
}

// 图表区域 - 两列布局
.charts-section {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

// 图表卡片基础样式
.chart-card {
  flex: 1;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  
  .card-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .more-link {
      font-size: 14px;
      color: #3b82f6;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #2563eb;
        text-decoration: underline;
      }
    }
  }
  
  .card-body {
    padding: 24px;
  }
}

// 漏洞等级分布卡片
.distribution-card {
  background: white;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.06);
    border-color: #e2e8f0;
  }
  
  .card-header {
    padding: 18px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title {
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
    }
    
    .more-link {
      font-size: 14px;
      color: #3b82f6;
      font-weight: 500;
      cursor: pointer;
      transition: color 0.2s;
      
      &:hover {
        color: #2563eb;
        text-decoration: underline;
      }
    }
  }
  
  .card-body {
    padding: 24px;
  }
  
  .chart-wrapper {
    display: flex;
    align-items: center;
    gap: 60px;
  }
  
  .donut-chart {
    position: relative;
    width: 180px;
    height: 180px;
    flex-shrink: 0;
    
    svg {
      width: 100%;
      height: 100%;
    }
    
    .donut-segment {
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        opacity: 0.8;
        transform: scale(1.02);
        transform-origin: center;
      }
    }
    
    .chart-center-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      
      .center-value {
        display: block;
        font-size: 24px;
        font-weight: 700;
        color: #1e293b;
        line-height: 1.2;
      }
      
      .center-label {
        display: block;
        font-size: 12px;
        color: #64748b;
        margin-top: 2px;
      }
    }
  }
  
  .chart-legend {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 16px 40px;
    
    .legend-item {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 180px;
      
      .legend-dot {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        flex-shrink: 0;
      }
      
      .legend-label {
        font-size: 14px;
        color: #64748b;
        min-width: 60px;
      }
      
      .legend-value {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        min-width: 60px;
      }
      
      .legend-percent {
        font-size: 13px;
        color: #94a3b8;
        background: #f1f5f9;
        padding: 2px 8px;
        border-radius: 4px;
      }
    }
  }
}

// 趋势图卡片
.trend-card {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .period-toggle {
      display: flex;
      gap: 4px;
      background: #f1f5f9;
      padding: 4px;
      border-radius: 8px;
      
      button {
        padding: 6px 16px;
        border: none;
        background: transparent;
        color: #64748b;
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          color: #3b82f6;
        }
        
        &.active {
          background: #3b82f6;
          color: white;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
        }
      }
    }
  }
  
  .trend-chart-wrapper {
    display: flex;
    gap: 16px;
    height: 200px;
  }
  
  .y-axis {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 0 8px 24px 0;
    
    span {
      font-size: 11px;
      color: #94a3b8;
      text-align: right;
      min-width: 36px;
    }
  }
  
  .bar-chart {
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 4px;
    padding-bottom: 28px;
    border-bottom: 1px solid #e2e8f0;
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    min-width: 0;
    
    // 自定义滚动条
    &::-webkit-scrollbar {
      height: 4px;
    }
    &::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 2px;
    }
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }
    
    // 网格线
    &::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      border-top: 1px dashed #e2e8f0;
      pointer-events: none;
    }
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      border-top: 1px dashed #e2e8f0;
      pointer-events: none;
    }
  }
  
  .bar-item {
    flex: 1 0 28px;
    min-width: 28px;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    
    .bar-wrapper {
      flex: 1;
      width: 100%;
      display: flex;
      align-items: flex-end;
      justify-content: center;
    }
    
    .bar {
      width: 80%;
      max-width: 24px;
      min-width: 6px;
      background: linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%);
      border-radius: 2px 2px 0 0;
      position: relative;
      transition: all 0.3s ease;
      min-height: 4px;
      
      &:hover {
        transform: scaleX(1.2);
        background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
      }
      
      .bar-value {
        position: absolute;
        top: -18px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 10px;
        font-weight: 600;
        color: #3b82f6;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.2s;
      }
      
      &:hover .bar-value {
        opacity: 1;
      }
    }
    
    .bar-label {
      font-size: 9px;
      color: #94a3b8;
      margin-top: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      text-align: center;
    }
    

  }
  
  .trend-footer {
    margin-top: 16px;
    text-align: center;
    
    .trend-desc {
      font-size: 12px;
      color: #94a3b8;
    }
  }
}

.content-row {
  flex: 1;
  display: flex;
  gap: 24px;
  min-height: 0;
  
  .content-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
}

.content-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    border-color: #cbd5e1;
  }
  
  .card-header {
    padding: 20px 24px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .icon-box {
        display: flex;
      }
      
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
        letter-spacing: -0.01em;
      }
      
      .badge {
        display: inline-flex;
      }
    }
    
    .more-btn {
      color: #3b82f6;
      font-size: 14px;
      font-weight: 500;
      padding: 0;
      border-radius: 0;
      transition: all 0.2s ease;
      background: transparent;
      border: none;
      
      &:hover { 
        color: #2563eb;
        text-decoration: underline;
      }
      
      :deep(.devui-button-content) {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
  
  .card-body {
    flex: 1;
    overflow: hidden;
    position: relative;
    
    .vuln-list {
      height: 100%;
      overflow-y: auto;
      padding: 0 16px;
      
      .vuln-item {
        display: flex;
        align-items: center;
        padding: 16px 8px;
        border-bottom: 1px solid #f8fafc;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 8px;
        margin: 4px 0;
        
        &:hover {
          background: #f8fafc;
        }
        
        .item-status {
          margin-right: 16px;
          .dot {
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #cbd5e1;
            
            &.danger { background: #ef4444; }
            &.warning { background: #f59e0b; }
            &.primary { background: #3b82f6; }
            &.success { background: #10b981; }
          }
        }
        
        .item-main {
          flex: 1;
          min-width: 0;
          
          .item-title {
            font-size: 14px;
            font-weight: 500;
            color: #334155;
            margin-bottom: 4px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .item-meta {
            font-size: 12px;
            color: #94a3b8;
            display: flex;
            align-items: center;
            gap: 8px;
            
            .meta-tag {
              font-family: 'JetBrains Mono', monospace;
              color: #64748b;
              background: #f1f5f9;
              padding: 1px 6px;
              border-radius: 4px;
            }
            
            .meta-divider {
              color: #e2e8f0;
            }
          }
        }
        
        .item-tag {
          margin-left: 16px;
        }
        
        .item-score {
          margin-left: 16px;
          text-align: right;
          
          .score-val {
            font-size: 16px;
            font-weight: 700;
            color: #10b981;
          }
          
          .score-label {
            font-size: 12px;
            color: #94a3b8;
            margin-left: 2px;
          }
        }
      }
    }
  }
}

.custom-scrollbar {
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 3px;
    &:hover { background: #cbd5e1; }
  }
}

@media (max-width: 1024px) {
  .dashboard-container {
    height: auto;
    overflow: visible;
  }
  
  .stats-row {
    flex-wrap: wrap;
    .stat-item {
      flex: 0 0 calc(50% - 10px);
    }
  }
  
  .content-row {
    flex-direction: column;
  }
  
  .content-card {
    height: 500px;
  }
}

@media (max-width: 640px) {
  .security-dashboard {
    padding: 16px;
  }
  
  .stats-row {
    .stat-item {
      flex: 0 0 100%;
    }
  }
}
</style>
