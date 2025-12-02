<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './Public/Header.vue'

// 统计数据
const stats = ref([
  {
    value: 336969,
    title: '高危漏洞',
    useShape: true, // Use CSS shape instead of icon
    iconColor: '#ef4444', // Red 500
    trend: { value: 1399, direction: 'down', color: '#ef4444', percentage: '12.3%' }
  },
  {
    value: 25565566,
    title: '中危漏洞',
    useShape: true,
    iconColor: '#f59e0b', // Amber 500
    trend: { value: 2669, direction: 'up', color: '#10b981', percentage: '8.2%' }
  },
  {
    value: 18724321,
    title: '低危漏洞',
    useShape: true,
    iconColor: '#3b82f6', // Blue 500
    trend: { value: 1234, direction: 'down', color: '#ef4444', percentage: '5.6%' }
  },
  {
    value: 9842,
    title: '今日警告',
    useShape: true,
    iconColor: '#8b5cf6', // Violet 500
    trend: { value: 42, direction: 'up', color: '#10b981', percentage: '3.1%' }
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

onMounted(fetchVulnerabilities)
</script>

<template>
  <Header />
  
  <div class="security-dashboard">
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
            <div class="stat-header">
              <div class="icon-wrapper" :style="{ background: `${stat.iconColor}15`, color: stat.iconColor }">
                <div class="icon-shape"></div>
              </div>
              <span class="stat-title">{{ stat.title }}</span>
            </div>
            
            <div class="stat-body">
              <div class="stat-value">
                <d-statistic 
                  :value="stat.value" 
                  group-separator="," 
                  :animation="true"
                />
              </div>
              <div class="trend-info">
                <span class="label">较昨日</span>
                <span class="trend-value" :class="stat.trend.direction">
                  {{ stat.trend.direction === 'up' ? '↑' : '↓' }} {{ stat.trend.percentage }}
                </span>
              </div>
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
</template>

<style scoped lang="scss">
.security-dashboard {
  padding: 24px 32px;
  background-color: #ffffff;
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 24px;
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
  padding: 20px;
  border: 1px solid #f1f5f9;
  transition: all 0.3s;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    border-color: #e2e8f0;
  }
  
  .stat-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    
    .icon-wrapper {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      
      .icon-shape {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: currentColor;
      }
    }
    
    .stat-title {
      font-size: 14px;
      color: #64748b;
      font-weight: 500;
      flex: 1;
    }
  }
  
  .stat-body {
    .stat-value {
      :deep(.devui-statistic-content-value) {
        font-size: 28px;
        font-weight: 700;
        color: #0f172a;
        font-family: 'Inter', sans-serif;
      }
    }
    
    .trend-info {
      margin-top: 8px;
      display: flex;
      align-items: center;
      font-size: 13px;
      
      .label {
        color: #94a3b8;
        margin-right: 8px;
      }
      
      .trend-value {
        display: flex;
        align-items: center;
        gap: 2px;
        font-weight: 600;
        
        &.up { color: #10b981; }
        &.down { color: #ef4444; }
      }
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
  border: 1px solid #f1f5f9;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01);
    border-color: #e2e8f0;
  }
  
  .card-header {
    padding: 24px 28px;
    border-bottom: 1px solid #f1f5f9;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-shrink: 0;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
      
      .icon-box {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        .box-shape {
          width: 14px;
          height: 14px;
          border-radius: 3px;
          background: currentColor;
        }
        
        &.danger { background: #fef2f2; color: #ef4444; }
        &.success { background: #ecfdf5; color: #10b981; }
      }
      
      .title {
        font-size: 17px;
        font-weight: 600;
        color: #0f172a;
        letter-spacing: -0.02em;
      }
      
      .badge {
        background: #f8fafc;
        color: #64748b;
        font-size: 12px;
        padding: 3px 11px;
        border-radius: 999px;
        font-weight: 600;
        
        &.success { background: #ecfdf5; color: #059669; }
      }
    }
    
    .more-btn {
      color: #64748b;
      font-size: 14px;
      font-weight: 400;
      padding: 8px 18px;
      border-radius: 8px;
      transition: all 0.2s ease;
      background: transparent;
      border: 1px solid #e2e8f0;
      
      &:hover { 
        color: #0f172a;
        border-color: #cbd5e1;
        background: #fafbfc;
      }
      
      :deep(.devui-button-content) {
        display: flex;
        align-items: center;
        gap: 6px;
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
  .security-dashboard {
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
