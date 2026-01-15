<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from './Public/Header.vue'
import { get } from '../utils/request'
import { DASHBOARD_API } from '../api/config'

const router = useRouter()

// ================== 接口返回类型定义 ==================

interface StatisticsResponse {
  critical: number
  high: number
  medium: number
  low: number
  none: number
  total: number
}

interface TrendItem {
  label: string
  value: number
}

interface ReportItem {
  id: number
  vulnerability_name: string
  severity: string
  status: string
  created_at: string
  author?: {
    id: number
    username: string
  }
  self_assessment?: {
    config_value: string
  }
}

interface ReportsResponse {
  list: ReportItem[]
  total: number
}

// ================== 响应式状态 ==================

const loading = ref(true)
const statsLoading = ref(true)
const trendLoading = ref(true)
const reportsLoading = ref(true)

// 统计数据
const stats = ref([
  { value: 0, title: '严重漏洞', iconColor: '#7c3aed', trend: { value: 0, direction: 'up', percentage: '0%' } },
  { value: 0, title: '高危漏洞', iconColor: '#ef4444', trend: { value: 0, direction: 'down', percentage: '0%' } },
  { value: 0, title: '中危漏洞', iconColor: '#f59e0b', trend: { value: 0, direction: 'up', percentage: '0%' } },
  { value: 0, title: '低危漏洞', iconColor: '#3b82f6', trend: { value: 0, direction: 'down', percentage: '0%' } }
])

// 漏洞列表
const publishedVulnerabilities = ref<ReportItem[]>([])
const reviewedVulnerabilities = ref<ReportItem[]>([])
const publishedTotal = ref(0)
const reviewedTotal = ref(0)

// 趋势数据
type TrendPeriod = 'day' | 'month' | 'year'
const trendPeriod = ref<TrendPeriod>('month')
const trendDataRaw = ref<TrendItem[]>([])

// ================== API 调用 ==================

// 获取统计数据
const fetchStatistics = async () => {
  statsLoading.value = true
  try {
    const response = await get<StatisticsResponse>(DASHBOARD_API.STATISTICS)
    if (response) {
      stats.value = [
        { value: response.critical || 0, title: '严重漏洞', iconColor: '#7c3aed', trend: { value: 0, direction: 'up', percentage: '0%' } },
        { value: response.high || 0, title: '高危漏洞', iconColor: '#ef4444', trend: { value: 0, direction: 'down', percentage: '0%' } },
        { value: response.medium || 0, title: '中危漏洞', iconColor: '#f59e0b', trend: { value: 0, direction: 'up', percentage: '0%' } },
        { value: response.low || 0, title: '低危漏洞', iconColor: '#3b82f6', trend: { value: 0, direction: 'down', percentage: '0%' } }
      ]
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  } finally {
    statsLoading.value = false
  }
}

// 获取趋势数据
const fetchTrend = async (period: TrendPeriod) => {
  trendLoading.value = true
  try {
    const response = await get<TrendItem[]>(`${DASHBOARD_API.TREND}?period=${period}`)
    if (response && Array.isArray(response)) {
      trendDataRaw.value = response
    }
  } catch (error) {
    console.error('获取趋势数据失败:', error)
    trendDataRaw.value = []
  } finally {
    trendLoading.value = false
  }
}

// 获取漏洞列表
const fetchReports = async () => {
  reportsLoading.value = true
  try {
    // 获取待审核漏洞
    const pendingResponse = await get<ReportsResponse>(`${DASHBOARD_API.REPORTS}?type=pending&limit=6`)
    if (pendingResponse && pendingResponse.list) {
      publishedVulnerabilities.value = pendingResponse.list
      publishedTotal.value = pendingResponse.total || 0
    }

    // 获取已审核漏洞
    const reviewedResponse = await get<ReportsResponse>(`${DASHBOARD_API.REPORTS}?type=reviewed&limit=6`)
    if (reviewedResponse && reviewedResponse.list) {
      reviewedVulnerabilities.value = reviewedResponse.list
      reviewedTotal.value = reviewedResponse.total || 0
    }
  } catch (error) {
    console.error('获取漏洞列表失败:', error)
  } finally {
    reportsLoading.value = false
  }
}

// 初始化加载
const initDashboard = async () => {
  loading.value = true
  await Promise.all([
    fetchStatistics(),
    fetchTrend(trendPeriod.value),
    fetchReports()
  ])
  loading.value = false
}

// 监听周期变化
watch(trendPeriod, (newPeriod) => {
  fetchTrend(newPeriod)
})

// ================== 辅助函数 ==================

const getSeverityColor = (severity: string | undefined) => {
  if (!severity) return 'default'
  const colors: Record<string, string> = {
    'Critical': 'danger',
    'High': 'danger', 
    'Medium': 'warning',
    'Low': 'primary',
    '高危': 'danger',
    '中危': 'warning',
    '低危': 'primary'
  }
  return colors[severity] || 'default'
}

const getSeverityText = (severity: string | undefined) => {
  if (!severity) return '未定义'
  const textMap: Record<string, string> = {
    'Critical': '严重',
    'High': '高危',
    'Medium': '中危',
    'Low': '低危',
    'None': '无危害'
  }
  return textMap[severity] || severity
}

const formatDate = (dateString: string) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const viewDetail = (id: number) => {
  router.push(`/database/detail/${id}`)
}

const viewMore = (_type: string) => {
  router.push('/database')
}

// ================== 图表计算属性 ==================

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

// 趋势图数据
const trendData = computed(() => trendDataRaw.value)
const trendMax = computed(() => {
  if (trendData.value.length === 0) return 1
  return Math.max(...trendData.value.map((d: TrendItem) => d.value)) || 1
})

// 切换周期
const setPeriod = (period: TrendPeriod) => {
  trendPeriod.value = period
}

onMounted(initDashboard)
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
              <span class="badge" v-if="!loading">{{ publishedTotal }}</span>
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
                    <div class="item-title">{{ item.vulnerability_name }}</div>
                    <div class="item-meta">
                      <span class="meta-tag">#{{ item.id }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ item.author?.username || '未知' }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ formatDate(item.created_at) }}</span>
                    </div>
                  </div>
                  <div class="item-tag">
                    <d-tag :type="getSeverityColor(item.self_assessment?.config_value)" size="sm">{{ getSeverityText(item.self_assessment?.config_value) }}</d-tag>
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
              <span class="badge success" v-if="!loading">{{ reviewedTotal }}</span>
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
                    <div class="item-title">{{ item.vulnerability_name }}</div>
                    <div class="item-meta">
                      <span class="meta-tag">#{{ item.id }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ item.author?.username || '未知' }}</span>
                      <span class="meta-divider">|</span>
                      <span>{{ formatDate(item.created_at) }}</span>
                    </div>
                  </div>
                  <div class="item-tag">
                    <d-tag :type="getSeverityColor(item.severity)" size="sm">{{ getSeverityText(item.severity) }}</d-tag>
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
      color: #1f2937;
      font-size: 12px;
      font-weight: 500;
      padding: 5px 12px;
      border-radius: 6px;
      transition: all 0.25s ease;
      background: rgba(148, 163, 184, 0.15);
      border: none;
      
      &:hover { 
        color: #111827;
        background: rgba(148, 163, 184, 0.3);
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
