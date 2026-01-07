<script setup lang="ts">
import { ref, computed } from 'vue'
import Header from './Public/Header.vue'

// 排行榜类型
const timeRange = ref('monthly') // weekly, monthly, total

// Mock Data - 扩展数据
const rankingData = ref([
  { rank: 1, name: 'CyberNinja', avatar: '', points: 12500, vulns: 42, critical: 8, high: 15, trend: 'up', badge: '🔥' },
  { rank: 2, name: 'BugHunter_X', avatar: '', points: 9800, vulns: 35, critical: 5, high: 12, trend: 'same', badge: '⚡' },
  { rank: 3, name: 'WhiteHat_Pro', avatar: '', points: 8750, vulns: 28, critical: 4, high: 10, trend: 'down', badge: '💎' },
  { rank: 4, name: 'SecMaster', avatar: '', points: 7200, vulns: 25, critical: 3, high: 9, trend: 'up', badge: '' },
  { rank: 5, name: 'VulnSeeker', avatar: '', points: 6800, vulns: 22, critical: 2, high: 8, trend: 'up', badge: '' },
  { rank: 6, name: 'CodeGuardian', avatar: '', points: 5400, vulns: 18, critical: 1, high: 7, trend: 'same', badge: '' },
  { rank: 7, name: 'HackDetection', avatar: '', points: 4900, vulns: 15, critical: 1, high: 5, trend: 'down', badge: '' },
  { rank: 8, name: 'NetDefender', avatar: '', points: 4500, vulns: 12, critical: 0, high: 5, trend: 'up', badge: '' },
  { rank: 9, name: 'SysAdmin_01', avatar: '', points: 3800, vulns: 10, critical: 0, high: 4, trend: 'same', badge: '' },
  { rank: 10, name: 'WebSecGuru', avatar: '', points: 3200, vulns: 8, critical: 0, high: 3, trend: 'down', badge: '' },
])

// 顶部三名
const topThree = computed(() => rankingData.value.slice(0, 3))

// 其余排名
const restList = computed(() => rankingData.value.slice(3))

// 统计数据
const stats = ref({
  totalHunters: 1256,
  totalVulns: 8934,
  totalRewards: '¥2.5M'
})

const handleTimeChange = (type: string) => {
  timeRange.value = type
}

const viewProfile = (name: string) => {
  console.log('查看用户:', name)
  // router.push(`/profile/${name}`)
}

// 格式化分数
const formatPoints = (points: number) => {
  if (points >= 10000) {
    return (points / 1000).toFixed(1) + 'k'
  }
  return points.toLocaleString()
}
</script>

<template>
  <Header />
  
  <div class="ranking-page">
    <!-- 顶部渐变背景区域 -->
    <div class="hero-section">
      <div class="hero-bg">
        <div class="hero-shape shape-1"></div>
        <div class="hero-shape shape-2"></div>
        <div class="hero-shape shape-3"></div>
      </div>
      
      <div class="hero-content">
        <div class="hero-badge">🏆 安全英雄榜</div>
        <h1 class="hero-title">白帽子荣誉殿堂</h1>
        <p class="hero-subtitle">致敬每一位守护网络安全的卫士</p>
        
        <!-- 统计卡片 -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalHunters }}</div>
            <div class="stat-label">注册白帽子</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalVulns }}</div>
            <div class="stat-label">已发现漏洞</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ stats.totalRewards }}</div>
            <div class="stat-label">累计奖励</div>
          </div>
        </div>
      </div>
    </div>

    <div class="main-content">
      <!-- 时间筛选器 -->
      <div class="filter-section">
        <div class="time-filter">
          <button 
            class="filter-btn" 
            :class="{ active: timeRange === 'weekly' }"
            @click="handleTimeChange('weekly')"
          >
            <d-icon name="calendar" />
            周榜
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: timeRange === 'monthly' }"
            @click="handleTimeChange('monthly')"
          >
            <d-icon name="date" />
            月榜
          </button>
          <button 
            class="filter-btn" 
            :class="{ active: timeRange === 'total' }"
            @click="handleTimeChange('total')"
          >
            <d-icon name="trophy" />
            总榜
          </button>
        </div>
      </div>

      <!-- Top 3 领奖台 - 精美设计 -->
      <div class="podium-section">
        <!-- 第二名 -->
        <div class="podium-card rank-2" @click="viewProfile(topThree[1]?.name)">
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="rank-number">
              <span class="number">2</span>
              <span class="medal-icon">🥈</span>
            </div>
            <div class="avatar-container">
              <div class="avatar-ring">
                <d-avatar :width="68" :height="68" :is-round="true" class="user-avatar">
                  <template #avatar>{{ topThree[1]?.name.substring(0,1) }}</template>
                </d-avatar>
              </div>
            </div>
            <h3 class="user-name">{{ topThree[1]?.name }}</h3>
            <div class="points-display">
              <span class="points-num">{{ formatPoints(topThree[1]?.points || 0) }}</span>
              <span class="points-label">积分</span>
            </div>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-num">{{ topThree[1]?.vulns }}</span>
                <span class="stat-label">漏洞</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num critical">{{ topThree[1]?.critical }}</span>
                <span class="stat-label">严重</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 第一名 - 冠军 -->
        <div class="podium-card rank-1" @click="viewProfile(topThree[0]?.name)">
          <div class="card-glow"></div>
          <div class="crown-decoration">
            <span class="crown-emoji">👑</span>
            <div class="sparkles">
              <span class="sparkle">✨</span>
              <span class="sparkle">✨</span>
            </div>
          </div>
          <div class="champion-ribbon">冠军</div>
          <div class="card-content">
            <div class="rank-number">
              <span class="number">1</span>
              <span class="medal-icon">🥇</span>
            </div>
            <div class="avatar-container">
              <div class="avatar-ring gold">
                <d-avatar :width="80" :height="80" :is-round="true" class="user-avatar">
                  <template #avatar>{{ topThree[0]?.name.substring(0,1) }}</template>
                </d-avatar>
              </div>
              <div class="avatar-glow"></div>
            </div>
            <h3 class="user-name">{{ topThree[0]?.name }}</h3>
            <div class="points-display">
              <span class="points-num">{{ formatPoints(topThree[0]?.points || 0) }}</span>
              <span class="points-label">积分</span>
            </div>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-num">{{ topThree[0]?.vulns }}</span>
                <span class="stat-label">漏洞</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num critical">{{ topThree[0]?.critical }}</span>
                <span class="stat-label">严重</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三名 -->
        <div class="podium-card rank-3" @click="viewProfile(topThree[2]?.name)">
          <div class="card-glow"></div>
          <div class="card-content">
            <div class="rank-number">
              <span class="number">3</span>
              <span class="medal-icon">🥉</span>
            </div>
            <div class="avatar-container">
              <div class="avatar-ring">
                <d-avatar :width="68" :height="68" :is-round="true" class="user-avatar">
                  <template #avatar>{{ topThree[2]?.name.substring(0,1) }}</template>
                </d-avatar>
              </div>
            </div>
            <h3 class="user-name">{{ topThree[2]?.name }}</h3>
            <div class="points-display">
              <span class="points-num">{{ formatPoints(topThree[2]?.points || 0) }}</span>
              <span class="points-label">积分</span>
            </div>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-num">{{ topThree[2]?.vulns }}</span>
                <span class="stat-label">漏洞</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-num critical">{{ topThree[2]?.critical }}</span>
                <span class="stat-label">严重</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 排行榜列表 -->
      <div class="ranking-list">
        <div class="list-header">
          <span class="col-rank">排名</span>
          <span class="col-user">白帽子</span>
          <span class="col-vulns">漏洞数</span>
          <span class="col-critical">严重/高危</span>
          <span class="col-points">积分</span>
          <span class="col-trend">趋势</span>
        </div>
        
        <div class="list-body">
          <div 
            v-for="item in restList" 
            :key="item.rank" 
            class="list-item"
            @click="viewProfile(item.name)"
          >
            <div class="col-rank">
              <span class="rank-num">{{ item.rank }}</span>
            </div>
            <div class="col-user">
              <d-avatar :width="40" :height="40" :is-round="true" class="avatar">
                <template #avatar>{{ item.name.substring(0,1) }}</template>
              </d-avatar>
              <div class="user-info">
                <span class="name">{{ item.name }}</span>
                <span v-if="item.badge" class="badge">{{ item.badge }}</span>
              </div>
            </div>
            <div class="col-vulns">
              <span class="vulns-count">{{ item.vulns }}</span>
            </div>
            <div class="col-critical">
              <span class="critical-tag">{{ item.critical }}</span>
              <span class="separator">/</span>
              <span class="high-tag">{{ item.high }}</span>
            </div>
            <div class="col-points">
              <span class="points-value">{{ formatPoints(item.points) }}</span>
            </div>
            <div class="col-trend">
              <span v-if="item.trend === 'up'" class="trend-up">
                <d-icon name="arrow-up" />
              </span>
              <span v-else-if="item.trend === 'down'" class="trend-down">
                <d-icon name="arrow-down" />
              </span>
              <span v-else class="trend-same">
                <d-icon name="minus" />
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部提示 -->
      <div class="footer-note">
        <p>💡 排行榜数据每小时更新一次，积分计算规则详见 <a href="#">帮助中心</a></p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ranking-page {
  min-height: calc(100vh - 64px);
  background: #f8fafc;
}

// ========== Hero Section ==========
.hero-section {
  position: relative;
  padding: 60px 24px 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  
  .hero-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    
    &.shape-1 {
      width: 400px;
      height: 400px;
      top: -200px;
      right: -100px;
    }
    
    &.shape-2 {
      width: 300px;
      height: 300px;
      bottom: -150px;
      left: -100px;
    }
    
    &.shape-3 {
      width: 200px;
      height: 200px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(255, 255, 255, 0.05);
    }
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 20px;
}

.hero-title {
  font-size: 42px;
  font-weight: 800;
  color: #fff;
  margin: 0 0 12px;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 40px;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 24px;
  flex-wrap: wrap;
}

.stat-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 20px 32px;
  min-width: 140px;
  
  .stat-value {
    font-size: 28px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 4px;
  }
  
  .stat-label {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.7);
  }
}

// ========== Main Content ==========
.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 60px;
  margin-top: -40px;
  position: relative;
  z-index: 2;
}

// ========== Filter Section ==========
.filter-section {
  display: flex;
  justify-content: center;
  margin-bottom: 32px;
}

.time-filter {
  display: inline-flex;
  background: #fff;
  padding: 6px;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  gap: 4px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border: none;
  background: transparent;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f1f5f9;
  }
  
  &.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: #fff;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .devui-icon {
    font-size: 16px;
  }
}

// ========== Podium Section ==========
.podium-section {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 24px;
  margin-bottom: 48px;
  padding: 20px 16px;
}

.podium-card {
  position: relative;
  width: 200px;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    
    .card-glow {
      opacity: 1;
    }
  }
  
  .card-glow {
    position: absolute;
    inset: 0;
    border-radius: 24px;
    opacity: 0;
    transition: opacity 0.4s;
    pointer-events: none;
  }
  
  .card-content {
    position: relative;
    z-index: 1;
    padding: 28px 20px 24px;
    text-align: center;
  }
  
  .rank-number {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-bottom: 16px;
    
    .number {
      font-size: 28px;
      font-weight: 900;
      color: #1e293b;
    }
    
    .medal-icon {
      font-size: 24px;
    }
  }
  
  .avatar-container {
    position: relative;
    display: inline-block;
    margin-bottom: 16px;
  }
  
  .avatar-ring {
    padding: 0;
    border-radius: 50%;
    background: transparent;
    
    .user-avatar {
      border: none;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      background: transparent !important;
    }
    
    &.gold {
      background: transparent;
      
      .user-avatar {
        box-shadow: 0 4px 24px rgba(251, 191, 36, 0.4);
      }
    }
  }
  
  // 强制覆盖 DevUI 头像组件的白色背景
  :deep(.devui-avatar),
  :deep(.devui-avatar--style),
  :deep(.devui-avatar--style > span) {
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }
  
  .avatar-glow {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.3) 0%, transparent 70%);
    pointer-events: none;
    animation: pulse 2s ease-in-out infinite;
  }
  
  .user-name {
    margin: 0 0 8px;
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
  }
  
  .points-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 4px;
    margin-bottom: 16px;
    
    .points-num {
      font-size: 26px;
      font-weight: 800;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .points-label {
      font-size: 13px;
      color: #94a3b8;
      font-weight: 500;
    }
  }
  
  .stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 16px;
    background: rgba(241, 245, 249, 0.8);
    border-radius: 12px;
  }
  
  .stat-item {
    text-align: center;
    
    .stat-num {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      
      &.critical {
        color: #dc2626;
      }
    }
    
    .stat-label {
      font-size: 11px;
      color: #64748b;
    }
  }
  
  .stat-divider {
    width: 1px;
    height: 28px;
    background: #e2e8f0;
  }
  
  // === Rank 1 (冠军) ===
  &.rank-1 {
    width: 220px;
    background: linear-gradient(180deg, #fffbeb 0%, #fff 100%);
    border: 2px solid #fcd34d;
    box-shadow: 0 8px 40px rgba(251, 191, 36, 0.2);
    
    .card-glow {
      box-shadow: 0 0 60px rgba(251, 191, 36, 0.4);
    }
    
    .card-content {
      padding-top: 48px;
    }
    
    .crown-decoration {
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 10;
      
      .crown-emoji {
        font-size: 48px;
        display: block;
        animation: crownFloat 3s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(251, 191, 36, 0.4));
      }
      
      .sparkles {
        position: absolute;
        width: 100%;
        top: 10px;
        
        .sparkle {
          position: absolute;
          font-size: 16px;
          animation: sparkle 2s ease-in-out infinite;
          
          &:first-child {
            left: -20px;
            animation-delay: 0s;
          }
          
          &:last-child {
            right: -20px;
            animation-delay: 1s;
          }
        }
      }
    }
    
    .champion-ribbon {
      position: absolute;
      top: 16px;
      right: -32px;
      padding: 4px 40px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      transform: rotate(45deg);
      box-shadow: 0 2px 8px rgba(245, 158, 11, 0.4);
    }
    
    .rank-number .number {
      color: #f59e0b;
    }
    
    .points-display .points-num {
      background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
      -webkit-background-clip: text;
      background-clip: text;
    }
  }
  
  // === Rank 2 (银牌) ===
  &.rank-2 {
    background: linear-gradient(180deg, #f8fafc 0%, #fff 100%);
    border: 2px solid #e2e8f0;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
    
    .card-glow {
      box-shadow: 0 0 40px rgba(148, 163, 184, 0.3);
    }
    
    .avatar-ring {
      background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
    }
    
    .rank-number .number {
      color: #64748b;
    }
  }
  
  // === Rank 3 (铜牌) ===
  &.rank-3 {
    background: linear-gradient(180deg, #fff7ed 0%, #fff 100%);
    border: 2px solid #fed7aa;
    box-shadow: 0 4px 24px rgba(234, 88, 12, 0.1);
    
    .card-glow {
      box-shadow: 0 0 40px rgba(234, 88, 12, 0.25);
    }
    
    .avatar-ring {
      background: linear-gradient(135deg, #fdba74 0%, #ea580c 100%);
    }
    
    .rank-number .number {
      color: #ea580c;
    }
  }
}

@keyframes crownFloat {
  0%, 100% { transform: translateX(-50%) translateY(0) rotate(-5deg); }
  50% { transform: translateX(-50%) translateY(-8px) rotate(5deg); }
}

@keyframes sparkle {
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.1); }
}

// ========== Ranking List ==========
.ranking-list {
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  margin-bottom: 32px;
}

.list-header {
  display: flex;
  align-items: center;
  padding: 16px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.list-body {
  .list-item {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #f8fafc;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: #fafbfc;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}

// Column styles
.col-rank {
  width: 60px;
  
  .rank-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: #f1f5f9;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    color: #64748b;
  }
}

.col-user {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 14px;
  
  .avatar {
    flex-shrink: 0;
  }
  
  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .name {
      font-weight: 600;
      color: #1e293b;
    }
    
    .badge {
      font-size: 16px;
    }
  }
}

.col-vulns {
  width: 80px;
  text-align: center;
  
  .vulns-count {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 28px;
    padding: 0 10px;
    background: #f0fdf4;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
    color: #16a34a;
  }
}

.col-critical {
  width: 100px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  .critical-tag {
    font-weight: 700;
    color: #dc2626;
  }
  
  .separator {
    color: #cbd5e1;
  }
  
  .high-tag {
    font-weight: 600;
    color: #f59e0b;
  }
}

.col-points {
  width: 100px;
  text-align: right;
  
  .points-value {
    font-weight: 700;
    font-size: 15px;
    color: #667eea;
  }
}

.col-trend {
  width: 50px;
  text-align: center;
  
  .trend-up, .trend-down, .trend-same {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
  }
  
  .trend-up {
    background: #ecfdf5;
    color: #16a34a;
  }
  
  .trend-down {
    background: #fef2f2;
    color: #dc2626;
  }
  
  .trend-same {
    background: #f8fafc;
    color: #94a3b8;
  }
}

// ========== Footer Note ==========
.footer-note {
  text-align: center;
  
  p {
    font-size: 14px;
    color: #64748b;
    margin: 0;
    
    a {
      color: #667eea;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

// ========== Responsive ==========
@media (max-width: 1024px) {
  .hero-title {
    font-size: 36px;
  }
  
  .stats-row {
    gap: 16px;
  }
  
  .stat-card {
    padding: 16px 24px;
    min-width: 120px;
    
    .stat-value {
      font-size: 24px;
    }
  }
  
  .podium-section {
    gap: 16px;
  }
}

@media (max-width: 768px) {
  .hero-section {
    padding: 40px 16px 60px;
  }
  
  .hero-title {
    font-size: 28px;
  }
  
  .hero-subtitle {
    font-size: 15px;
    margin-bottom: 28px;
  }
  
  .stats-row {
    gap: 12px;
  }
  
  .stat-card {
    padding: 14px 20px;
    min-width: 100px;
    
    .stat-value {
      font-size: 20px;
    }
    
    .stat-label {
      font-size: 11px;
    }
  }
  
  .main-content {
    padding: 0 16px 40px;
    margin-top: -30px;
  }
  
  .filter-btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .podium-section {
    gap: 12px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }
  
  .podium-card {
    width: 160px;
    border-radius: 20px;
    
    .card-content {
      padding: 20px 14px 18px;
    }
    
    .rank-number {
      margin-bottom: 12px;
      
      .number {
        font-size: 22px;
      }
      
      .medal-icon {
        font-size: 20px;
      }
    }
    
    .avatar-ring {
      padding: 3px;
      
      .user-avatar {
        width: 56px !important;
        height: 56px !important;
      }
    }
    
    .user-name {
      font-size: 14px;
    }
    
    .points-display {
      margin-bottom: 12px;
      
      .points-num {
        font-size: 20px;
      }
      
      .points-label {
        font-size: 11px;
      }
    }
    
    .stats-row {
      padding: 8px 10px;
      gap: 8px;
    }
    
    .stat-item .stat-num {
      font-size: 15px;
    }
    
    .stat-item .stat-label {
      font-size: 10px;
    }
    
    &.rank-1 {
      width: 180px;
      
      .card-content {
        padding-top: 36px;
      }
      
      .crown-decoration .crown-emoji {
        font-size: 36px;
      }
      
      .champion-ribbon {
        font-size: 9px;
        padding: 3px 32px;
        right: -28px;
      }
      
      .avatar-ring .user-avatar {
        width: 64px !important;
        height: 64px !important;
      }
    }
  }
  
  .list-header {
    display: none;
  }
  
  .list-body .list-item {
    flex-wrap: wrap;
    gap: 12px;
    padding: 16px;
  }
  
  .col-rank {
    width: auto;
    order: 0;
  }
  
  .col-user {
    flex: 1;
    order: 1;
  }
  
  .col-points {
    width: auto;
    order: 2;
  }
  
  .col-vulns,
  .col-critical,
  .col-trend {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 32px 12px 50px;
  }
  
  .hero-badge {
    padding: 6px 16px;
    font-size: 12px;
  }
  
  .hero-title {
    font-size: 24px;
  }
  
  .hero-subtitle {
    font-size: 14px;
  }
  
  .stat-card {
    padding: 12px 16px;
    min-width: 90px;
    
    .stat-value {
      font-size: 18px;
    }
  }
  
  .main-content {
    padding: 0 12px 32px;
  }
  
  .time-filter {
    padding: 4px;
  }
  
  .filter-btn {
    padding: 6px 12px;
    font-size: 12px;
    
    .devui-icon {
      display: none;
    }
  }
  
  .podium-section {
    gap: 8px;
  }
  
  .podium-card {
    width: 110px;
    border-radius: 16px;
    
    .card-content {
      padding: 16px 10px 14px;
    }
    
    .rank-number {
      margin-bottom: 8px;
      gap: 4px;
      
      .number {
        font-size: 18px;
      }
      
      .medal-icon {
        font-size: 16px;
      }
    }
    
    .avatar-ring {
      padding: 2px;
      
      .user-avatar {
        width: 44px !important;
        height: 44px !important;
      }
    }
    
    .avatar-container {
      margin-bottom: 10px;
    }
    
    .user-name {
      font-size: 12px;
      max-width: 90px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    .points-display {
      margin-bottom: 0;
      
      .points-num {
        font-size: 16px;
      }
      
      .points-label {
        font-size: 10px;
      }
    }
    
    .stats-row {
      display: none;
    }
    
    &.rank-1 {
      width: 130px;
      
      .card-content {
        padding-top: 32px;
      }
      
      .crown-decoration {
        top: -4px;
        
        .crown-emoji {
          font-size: 28px;
        }
        
        .sparkles {
          display: none;
        }
      }
      
      .champion-ribbon {
        display: none;
      }
      
      .avatar-ring .user-avatar {
        width: 52px !important;
        height: 52px !important;
      }
    }
  }
  
  .ranking-list {
    border-radius: 16px;
  }
  
  .list-body .list-item {
    padding: 14px 12px;
  }
  
  .col-user {
    gap: 10px;
    
    .avatar {
      width: 36px !important;
      height: 36px !important;
    }
    
    .user-info .name {
      font-size: 14px;
    }
  }
  
  .col-points .points-value {
    font-size: 14px;
  }
}
</style>
