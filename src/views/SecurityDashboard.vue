<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { get } from '../utils/request'
import { REPORT_API } from '../api/config'

// 接口类型定义
interface ReportItem {
  id: number
  project_id: number
  vulnerability_name: string
  vulnerability_type_id: number
  vulnerability_type?: {
    id: number
    config_value: string
  }
  vulnerability_impact: string
  severity_level_id: number
  severity_level?: {
    id: number
    config_value: string
  }
  severity?: string
  vulnerability_url: string
  vulnerability_detail: string
  created_at: string
  updated_at: string
  status?: string
}

interface ReportResponse {
  list: ReportItem[]
  page: number
  page_size: number
  total: number
}

// 加载状态
const loading = ref(true)
const currentTime = ref('')
const router = useRouter()

// 导航菜单
const navItems = [
  { name: '首页', path: '/' },
  { name: '漏洞库', path: '/database' },
  { name: 'CNNVD', path: '/cnnvd' },
  { name: '漏洞报告', path: '/analysis' },
  { name: '排行榜', path: '/ranking' }
]

const handleNav = (path: string) => {
  router.push(path)
}

// 原始数据
const allReports = ref<ReportItem[]>([])

// Mock Data for charts if real data is insufficient
const mockTrendData = ref([
  { date: '12/8', new: 12, recur: 5 },
  { date: '12/11', new: 15, recur: 8 },
  { date: '12/14', new: 28, recur: 12 },
  { date: '12/17', new: 10, recur: 7 },
  { date: '12/20', new: 8, recur: 4 },
  { date: '12/23', new: 22, recur: 10 },
  { date: '12/26', new: 18, recur: 6 },
  { date: '12/29', new: 25, recur: 9 },
  { date: '1/1', new: 15, recur: 8 },
  { date: '1/4', new: 20, recur: 11 },
])

// 从 API 加载数据
const loadData = async () => {
  try {
    loading.value = true
    const response = await get<ReportResponse>(REPORT_API.LIST + '?page=1&page_size=100')
    allReports.value = response.list || []
  } catch (error) {
    console.error('加载数据失败:', error)
    allReports.value = []
  } finally {
    loading.value = false
  }
}

// ----- 统计计算 -----

// 1. 漏洞总数
const totalVulns = computed(() => Math.max(allReports.value.length, 15890)) // Mock base if empty

// 2. 今日新增 (Mock logic for demo)
const todayNew = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  const count = allReports.value.filter(r => r.created_at?.startsWith(today)).length
  return count > 0 ? count : 218 // Fallback mock
})

// 3. 漏洞复现数量 (Mock)
const recurredCount = ref(89)

// 4. 高危漏洞数量
const criticalCount = computed(() => {
  const count = allReports.value.filter(r => {
    const severity = r.severity_level?.config_value || r.severity || ''
    return severity.toLowerCase().includes('critical') || severity.includes('严重') || severity.toLowerCase().includes('high') || severity.includes('高')
  }).length
  return count > 0 ? count : 3256 // Fallback mock
})



// ----- 图表数据 -----

// Donut: 漏洞级别分布
const severityStats = computed(() => {
  // Mock distribution if no real data
  if (allReports.value.length === 0) {
    return [
      { label: '高危', value: 35, color: '#ff4d4f' },
      { label: '中危', value: 25, color: '#ffec3d' },
      { label: '低危', value: 30, color: '#00b7ff' },
      { label: '信息', value: 10, color: '#9254de' }
    ]
  }
  // Real calculation would go here, customized for the donut
  return [
      { label: '高危', value: 35, color: '#ff4d4f' },
      { label: '中危', value: 25, color: '#ffec3d' },
      { label: '低危', value: 30, color: '#00b7ff' },
      { label: '信息', value: 10, color: '#9254de' }
  ]
})

// Bar: 漏洞类型分布
const typeStats = computed(() => {
  return [
    { label: '代码注入', value: 92, max: 100 },
    { label: 'XSS跨站', value: 85, max: 100 },
    { label: '权限绕过', value: 70, max: 100 },
    { label: 'SQL注入', value: 65, max: 100 },
    { label: '缓冲区溢出', value: 50, max: 100 },
    { label: '配置错误', value: 45, max: 100 },
    { label: '其他', value: 98, max: 100 },
  ]
})



// 时间更新
let timeInterval: ReturnType<typeof setInterval> | null = null
const updateTime = () => {
  const now = new Date()
  const YYYY = now.getFullYear()
  const MM = String(now.getMonth() + 1).padStart(2, '0')
  const DD = String(now.getDate()).padStart(2, '0')
  const HH = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')
  currentTime.value = `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss}`
}

onMounted(async () => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
  await loadData()
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

const getDonutStyle = (index: number) => {
  const items = severityStats.value
  const item = items[index]
  const value = item.value
  
  // Calculate offset based on previous items
  let previousTotal = 0
  for (let i = 0; i < index; i++) {
    previousTotal += items[i].value
  }
  
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const dashArray = `${(value / 100) * circumference} ${circumference}`
  const dashOffset = -((previousTotal / 100) * circumference)
  return { 
    strokeDasharray: dashArray, 
    strokeDashoffset: dashOffset 
  }
}



// Helper for Trend Line
const getTrendPath = (type: 'new' | 'recur') => {
  const data = mockTrendData.value
  const width = 1100
  const height = 180
  const step = width / (data.length - 1)
  const maxVal = 35 // logical max
  
  let d = ''
  data.forEach((item, i) => {
    const val = type === 'new' ? item.new : item.recur
    // Adjust y: high value = low y
    const y = height - (val / maxVal) * height
    const x = i * step
    if (i === 0) d += `M ${x} ${y}`
    else {
      // Bezier curve approximation to make it smooth like the image
      const prevX = (i - 1) * step
      const prevVal = type === 'new' ? data[i-1].new : data[i-1].recur
      const prevY = height - (prevVal / maxVal) * height
      const cp1x = prevX + step * 0.5
      const cp1y = prevY
      const cp2x = x - step * 0.5
      const cp2y = y
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x} ${y}`
    }
  })
  return d
}
</script>

<template>
  <div class="screen-container">
    <!-- Header -->
    <header class="app-header">
      <div class="header-left">
        <div class="logo-shield">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#1890ff" stroke="none"/>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#40a9ff" fill-opacity="0.3"/>
            <path d="M9 12l2 2 4-4" stroke="#fff" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div class="app-title">
          <h1>漏洞智能管理平台</h1>
          <span class="subtitle">Vulnerability Intelligence Platform</span>
        </div>
      </div>
      
      <!-- Center Navigation -->
      <nav class="header-nav">
        <a 
          v-for="(item, index) in navItems" 
          :key="index"
          @click.prevent="handleNav(item.path)"
          class="nav-item"
        >
          {{ item.name }}
        </a>
      </nav>

      <div class="header-right">
        <div class="time-widget">
          <svg viewBox="0 0 24 24" class="icon-sm"><circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/><path d="M12 6v6l4 2" stroke="currentColor" fill="none"/></svg>
          {{ currentTime }}
        </div>
        <button class="action-btn">
          <svg viewBox="0 0 24 24" class="icon-sm"><path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" fill="none"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" stroke="currentColor" fill="none"/></svg>
          刷新数据
        </button>
        <button class="action-btn">
          <svg viewBox="0 0 24 24" class="icon-sm"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" fill="none"/></svg>
          导出报告
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="dashboard-grid">
      
      <!-- Top Section: Core Data Overview -->
      <section class="section-container core-data">
        <div class="section-header">
          <div class="title-group">
            <svg viewBox="0 0 24 24" class="deco-icon"><path d="M21.21 15.89A10 10 0 1 1 8 2.83" stroke="currentColor" fill="none"/><path d="M22 12A10 10 0 0 0 12 2v10z" stroke="currentColor" fill="currentColor"/></svg>
            <h2>核心数据概览</h2>
          </div>
          <div class="status-badge">
            <span class="dot"></span> 数据实时更新中
          </div>
        </div>
        
        <div class="cards-row">
          <!-- Card 1 -->
          <div class="stat-card">
            <div class="card-content">
              <span class="label">漏洞总数</span>
              <div class="value-row">
                <span class="number">{{ totalVulns }}</span>
                <span class="icon-box blue">
                  <svg viewBox="0 0 24 24" class="card-icon"><path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="none" stroke="currentColor"/></svg>
                </span>
              </div>
              <div class="trend up">
                <span>⬆ 12.5%</span> <span class="period">较上周</span>
              </div>
            </div>
          </div>
          <!-- Card 2 -->
          <div class="stat-card">
             <div class="card-content">
              <span class="label">今日新增漏洞</span>
              <div class="value-row">
                <span class="number">{{ todayNew }}</span>
                <span class="icon-box purple">
                  <svg viewBox="0 0 24 24" class="card-icon"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"/><path d="M12 8v8M8 12h8" stroke="currentColor"/></svg>
                </span>
              </div>
              <div class="trend up">
                <span>⬆ 8.2%</span> <span class="period">较昨日</span>
              </div>
            </div>
          </div>
          <!-- Card 3 -->
          <div class="stat-card">
             <div class="card-content">
              <span class="label">漏洞复现数量</span>
              <div class="value-row">
                <span class="number">{{ recurredCount }}</span>
                <span class="icon-box orange">
                  <svg viewBox="0 0 24 24" class="card-icon"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" fill="none" stroke="currentColor"/></svg>
                </span>
              </div>
              <div class="trend down">
                <span>⬇ 5.7%</span> <span class="period">较上月</span>
              </div>
            </div>
          </div>
          <!-- Card 4 -->
          <div class="stat-card">
             <div class="card-content">
              <span class="label">高危漏洞数量</span>
              <div class="value-row">
                <span class="number">{{ criticalCount }}</span>
                <span class="icon-box red">
                  <svg viewBox="0 0 24 24" class="card-icon"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" fill="none" stroke="currentColor"/></svg>
                </span>
              </div>
              <div class="trend up">
                <span>⬆ 3.1%</span> <span class="period">较上周</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- Middle Section: Charts -->
      <div class="charts-row">
        <!-- Chart 1: Donut -->
        <section class="chart-card">
          <div class="chart-header">
            <div class="title-group">
               <svg viewBox="0 0 24 24" class="deco-icon blue"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" fill="none" stroke="currentColor"/><path d="M8 21h8M12 17v4" stroke="currentColor"/></svg>
               <h3>漏洞级别分布</h3>
            </div>
            <select class="cyber-select"><option>全部数据</option></select>
          </div>
          <div class="chart-body flex-center">
            <div class="donut-wrapper">
               <svg viewBox="0 0 150 150">
                  <circle cx="75" cy="75" r="60" fill="none" class="donut-bg"/>
                  <!-- Segments -->
                  <circle 
                    v-for="(item, index) in severityStats" 
                    :key="index"
                    cx="75" cy="75" r="60" 
                    fill="none" 
                    :stroke="item.color" 
                    stroke-width="15" 
                    :style="getDonutStyle(index)"
                    transform="rotate(-90 75 75)"
                  />
               </svg>
               <div class="donut-hole"></div>
            </div>
            <div class="legend-row">
              <div class="legend-item"><span class="dot red"></span>高危</div>
              <div class="legend-item"><span class="dot yellow"></span>中危</div>
              <div class="legend-item"><span class="dot blue"></span>低危</div>
              <div class="legend-item"><span class="dot purple"></span>信息</div>
            </div>
          </div>
        </section>

        <!-- Chart 2: Bars -->
        <section class="chart-card">
           <div class="chart-header">
            <div class="title-group">
               <svg viewBox="0 0 24 24" class="deco-icon blue"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" fill="none" stroke="currentColor"/><line x1="7" y1="7" x2="7.01" y2="7" stroke="currentColor"/></svg>
               <h3>漏洞类型分布</h3>
            </div>
            <select class="cyber-select"><option>全部数据</option></select>
          </div>
          <div class="chart-body">
             <div class="bar-list">
                <div class="bar-item" v-for="(item, i) in typeStats" :key="i">
                   <div class="bar-label">{{ item.label }}</div>
                    <div class="bar-track">
                       <div class="bar-fill" :style="{ width: item.value + '%' }"></div>
                    </div>
                </div>
             </div>
             <div class="x-axis-mock">
                <span>0</span><span>1k</span><span>2k</span><span>3k</span><span>4k</span>
             </div>
             <div class="legend-center">
                <span class="dot blue"></span> 漏洞数量
             </div>
          </div>
        </section>


      </div>

      <!-- Bottom Section: Trend Chart -->
      <section class="section-container trend-section">
         <div class="section-header">
            <div class="title-group">
               <svg viewBox="0 0 24 24" class="deco-icon blue"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" fill="none" stroke="currentColor"/></svg>
               <h2>漏洞新增&复现趋势分析</h2>
            </div>
            <div class="controls">
               <button class="filter-btn active">按日</button>
               <select class="cyber-select"><option>近30天</option></select>
            </div>
         </div>
         <div class="chart-body trend-chart-container">
            <svg viewBox="0 0 1150 220" class="trend-svg">
               <!-- Grid Lines -->
               <line x1="50" y1="40" x2="1150" y2="40" stroke="#1f2d3d" stroke-dasharray="4"/>
               <line x1="50" y1="80" x2="1150" y2="80" stroke="#1f2d3d" stroke-dasharray="4"/>
               <line x1="50" y1="120" x2="1150" y2="120" stroke="#1f2d3d" stroke-dasharray="4"/>
               <line x1="50" y1="160" x2="1150" y2="160" stroke="#1f2d3d" stroke-dasharray="4"/>
               <line x1="50" y1="200" x2="1150" y2="200" stroke="#1f2d3d" stroke-dasharray="4"/>
               
               <!-- Y Axis Labels -->
               <text x="35" y="40" fill="#5d6d7e" font-size="10" text-anchor="end">12</text>
               <text x="35" y="80" fill="#5d6d7e" font-size="10" text-anchor="end">10</text>
               <text x="35" y="120" fill="#5d6d7e" font-size="10" text-anchor="end">8</text>
               <text x="35" y="160" fill="#5d6d7e" font-size="10" text-anchor="end">6</text>
               <text x="35" y="200" fill="#5d6d7e" font-size="10" text-anchor="end">4</text>
               <text x="35" y="220" fill="#5d6d7e" font-size="10" text-anchor="end">0</text>

               <!-- Areas & Lines -->
               <g transform="translate(50, 40)"> <!-- Offset for axis -->
                  <!-- Blue Line (New) -->
                  <path :d="getTrendPath('new')" fill="none" stroke="#00b7ff" stroke-width="2"/>
                  <!-- Yellow Line (Recur) -->
                  <path :d="getTrendPath('recur')" fill="none" stroke="#ffec3d" stroke-width="2"/>
               </g>
               
               <!-- X Axis Labels -->
               <g transform="translate(50, 240)">
                  <text v-for="(item, i) in mockTrendData" :key="i" :x="i * (1100/9)" y="0" 
                        fill="#5d6d7e" font-size="10" text-anchor="middle">{{ item.date }}</text>
               </g>
            </svg>
            <div class="legend-bottom">
               <div class="legend-item"><span class="dot blue"></span>新增漏洞</div>
               <div class="legend-item"><span class="dot yellow"></span>复现漏洞</div>
            </div>
         </div>
      </section>

    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Reset & Base */
* { box-sizing: border-box; }
.screen-container {
  min-height: 100vh;
  background-color: #050b14; /* Deep dark blue background */
  font-family: 'Inter', system-ui, sans-serif;
  color: #fff;
  padding-bottom: 20px;
}

/* Header */
.app-header {
  height: 64px;
  background-color: #08101a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #142030;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-shield {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #003a8c 0%, #002357 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #0050b3;
}
.logo-shield svg { width: 24px; height: 24px; }

.app-title h1 {
  font-size: 18px;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: #e6f7ff;
}
.app-title .subtitle {
  font-size: 11px;
  color: #5d6d7e;
  display: block;
  letter-spacing: 0.5px;
}

.header-nav {
  display: flex;
  gap: 4px;
  background: #0d1723;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid #1f2d3d;
}

.nav-item {
  color: #8899aa;
  padding: 6px 16px;
  font-size: 13px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #e6f7ff;
    background: #1f2d3d;
  }
  
  /* Active state logic could be added if needed, but for dashboard usually implies we are here */
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-widget {
  font-family: 'Inter', monospace;
  color: #8899aa;
  font-size: 13px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.icon-sm { width: 14px; height: 14px; }

.action-btn {
  background: #0d1b2a;
  border: 1px solid #1f2d3d;
  color: #00b7ff;
  padding: 6px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}
.action-btn:hover {
  background: #00b7ff;
  color: #fff;
  border-color: #00b7ff;
}

/* Dashboard Grid */
.dashboard-grid {
  padding: 24px;
  max-width: 1440px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Common Section Styles */
.section-container, .chart-card {
  background: #08101a;
  border: 1px solid rgba(0, 183, 255, 0.2);
  border-radius: 8px;
  box-shadow: 
    0 0 20px rgba(0, 183, 255, 0.15),
    0 0 40px rgba(0, 183, 255, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.section-container:hover, .chart-card:hover {
  border-color: rgba(0, 183, 255, 0.35);
  box-shadow: 
    0 0 25px rgba(0, 183, 255, 0.25),
    0 0 50px rgba(0, 183, 255, 0.12),
    0 8px 24px rgba(0, 0, 0, 0.5);
}

.section-header, .chart-header {
  height: 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #142030;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 8px;
}
.title-group h2, .title-group h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0;
  color: #e6f7ff;
}
.deco-icon {
  width: 18px; height: 18px;
  color: #00b7ff;
}

.status-badge {
  background: #0a1929;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  color: #5d6d7e;
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #1f2d3d;
}
.status-badge .dot {
  width: 6px; height: 6px; background: #00b7ff; border-radius: 50%;
  animation: pulse 2s infinite;
}

/* Core Data Cards */
.cards-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px;
}

.stat-card {
  background: #0d1723;
  border-radius: 6px;
  padding: 16px;
  border: 1px solid #1f2d3d;
  transition: transform 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  border-color: #2a3d52;
}

.card-content {
  display: flex;
  flex-direction: column;
}

.stat-card .label {
  font-size: 12px;
  color: #8899aa;
  margin-bottom: 12px;
}

.value-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.stat-card .number {
  font-size: 26px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.5px;
}
.stat-card .number.percent {
  font-size: 26px;
}

.icon-box {
  width: 36px; height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.card-icon { width: 20px; height: 20px; }

.icon-box.blue { background: #002357; color: #00b7ff; }
.icon-box.purple { background: #1a0f35; color: #9254de; }
.icon-box.orange { background: #2b1d11; color: #fa8c16; }
.icon-box.red { background: #2a0f11; color: #f5222d; }
.icon-box.green { background: #0f2a11; color: #52c41a; }
.icon-box.cyan { background: #082a30; color: #13c2c2; }

.trend {
  font-size: 11px;
}
.trend.up { color: #f5222d; }
.trend.down { color: #52c41a; }
.trend .period { color: #5d6d7e; margin-left: 4px; }

/* Charts Row */
.charts-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.chart-card {
  min-height: 320px;
  display: flex;
  flex-direction: column;
}

.chart-body {
  flex: 1;
  padding: 24px;
  position: relative;
}
.flex-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.cyber-select {
  background: #0d1723;
  border: 1px solid #1f2d3d;
  color: #8899aa;
  font-size: 12px;
  padding: 4px 12px;
  border-radius: 4px;
  outline: none;
}

/* Donut */
.donut-wrapper {
  position: relative;
  width: 160px; height: 160px;
  margin-bottom: 24px;
}
.donut-bg { stroke: #142030; stroke-width: 15; }
.donut-hole {
  position: absolute;
  inset: 20px;
  border-radius: 50%;
  border: 1px solid rgba(0,0,0,0.0); /* placeholder alignment */
}

.legend-row {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8899aa;
}
.legend-item { display: flex; align-items: center; gap: 6px; }

/* Bar Chart */
.bar-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 16px;
}
.bar-item {
  display: flex;
  align-items: center;
  gap: 12px;
}
.bar-label {
  font-size: 12px;
  color: #8899aa;
  width: 70px;
  text-align: right;
}
.bar-track {
  flex: 1;
  height: 8px;
  background: #142030;
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #0050b3, #00b7ff);
  border-radius: 4px;
}
.x-axis-mock {
  display: flex;
  justify-content: space-between;
  padding-left: 82px;
  font-size: 10px;
  color: #5d6d7e;
}
.legend-center {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #8899aa;
  gap: 8px;
}

/* Radar */
.radar-box { padding: 10px; }
.radar-svg { width: 220px; height: 220px; overflow: visible; }

/* Trend Chart */
.trend-section {
  min-height: 320px;
}

.controls {
  display: flex;
  gap: 12px;
}
.filter-btn {
  background: transparent;
  border: 1px solid #1f2d3d;
  color: #8899aa;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-btn.active {
  background: #142030;
  color: #e6f7ff;
  border-color: #2a3d52;
}

.trend-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}
.legend-bottom {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-top: 20px;
  font-size: 12px;
  color: #8899aa;
}

/* Dots */
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot.red { background: #f5222d; }
.dot.yellow { background: #ffec3d; }
.dot.blue { background: #00b7ff; }
.dot.check-blue { background: #00b7ff; border: 2px solid #08101a; box-shadow: 0 0 0 1px #00b7ff; }
.dot.purple { background: #9254de; }

@keyframes pulse {
  0% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.2); }
  100% { opacity: 1; transform: scale(1); }
}

@media (max-width: 1200px) {
  .cards-row { grid-template-columns: repeat(3, 1fr); }
  .charts-row { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .cards-row { grid-template-columns: 1fr; }
  .header-right { display: none; }
}
</style>
