<script setup lang="ts">
import { ref } from 'vue'
import Header from './Public/Header.vue'

// 排行榜类型
const timeRange = ref('monthly') // weekly, monthly, total

// Mock Data
const rankingData = ref([
  { rank: 1, name: 'CyberNinja', avatar: '', points: 12500, vulns: 42, trend: 'up' },
  { rank: 2, name: 'BugHunter_X', avatar: '', points: 9800, vulns: 35, trend: 'same' },
  { rank: 3, name: 'WhiteHat_Pro', avatar: '', points: 8750, vulns: 28, trend: 'down' },
  { rank: 4, name: 'SecMaster', avatar: '', points: 7200, vulns: 25, trend: 'up' },
  { rank: 5, name: 'VulnSeeker', avatar: '', points: 6800, vulns: 22, trend: 'up' },
  { rank: 6, name: 'CodeGuardian', avatar: '', points: 5400, vulns: 18, trend: 'same' },
  { rank: 7, name: 'HackDetection', avatar: '', points: 4900, vulns: 15, trend: 'down' },
  { rank: 8, name: 'NetDefender', avatar: '', points: 4500, vulns: 12, trend: 'up' },
  { rank: 9, name: 'SysAdmin_01', avatar: '', points: 3800, vulns: 10, trend: 'same' },
  { rank: 10, name: 'WebSecGuru', avatar: '', points: 3200, vulns: 8, trend: 'down' },
])

// Filter data based on timeRange (mock logic)
const currentList = ref(rankingData.value)

const handleTimeChange = (type: string) => {
  timeRange.value = type
  // In real app, fetch data here. For mock, just shuffle slightly or keep same
}

</script>

<template>
  <Header />
  
  <div class="ranking-page">
    <div class="page-content">
      <!-- 顶部 Banner -->
      <div class="ranking-header">
        <h1>白帽子英雄榜</h1>
        <p>致敬每一位为安全生态做出贡献的守护者</p>
        
        <div class="time-filter">
          <div 
            class="filter-item" 
            :class="{ active: timeRange === 'weekly' }"
            @click="handleTimeChange('weekly')"
          >
            周榜
          </div>
          <div 
            class="filter-item" 
            :class="{ active: timeRange === 'monthly' }"
            @click="handleTimeChange('monthly')"
          >
            月榜
          </div>
          <div 
            class="filter-item" 
            :class="{ active: timeRange === 'total' }"
            @click="handleTimeChange('total')"
          >
            总榜
          </div>
        </div>
      </div>

      <!-- 领奖台 (Top 3) -->
      <div class="podium-section">
        <!-- Rank 2 -->
        <div class="podium-item rank-2">
          <div class="crown-icon">🥈</div>
          <d-avatar :width="80" :height="80" :is-round="true" class="podium-avatar">
            <template #avatar>{{ rankingData[1].name.substring(0,1) }}</template>
          </d-avatar>
          <div class="podium-info">
            <div class="podium-name">{{ rankingData[1].name }}</div>
            <div class="podium-points">{{ rankingData[1].points }} 积分</div>
          </div>
          <div class="podium-base">2</div>
        </div>

        <!-- Rank 1 -->
        <div class="podium-item rank-1">
          <div class="crown-icon">👑</div>
          <d-avatar :width="100" :height="100" :is-round="true" class="podium-avatar">
             <template #avatar>{{ rankingData[0].name.substring(0,1) }}</template>
          </d-avatar>
           <div class="podium-info">
            <div class="podium-name">{{ rankingData[0].name }}</div>
            <div class="podium-points">{{ rankingData[0].points }} 积分</div>
          </div>
          <div class="podium-base">1</div>
        </div>

        <!-- Rank 3 -->
        <div class="podium-item rank-3">
          <div class="crown-icon">🥉</div>
           <d-avatar :width="80" :height="80" :is-round="true" class="podium-avatar">
            <template #avatar>{{ rankingData[2].name.substring(0,1) }}</template>
          </d-avatar>
           <div class="podium-info">
            <div class="podium-name">{{ rankingData[2].name }}</div>
            <div class="podium-points">{{ rankingData[2].points }} 积分</div>
          </div>
          <div class="podium-base">3</div>
        </div>
      </div>

      <!-- 排行榜列表 (4-100) -->
      <div class="ranking-list-card">
        <div class="list-header">
          <div class="col-rank">排名</div>
          <div class="col-user">白帽子</div>
          <div class="col-vulns">漏洞数</div>
          <div class="col-points">积分</div>
          <div class="col-trend">趋势</div>
        </div>
        
        <div class="list-body">
          <div v-for="item in currentList.slice(3)" :key="item.name" class="list-item">
            <div class="col-rank">{{ item.rank }}</div>
            <div class="col-user">
              <d-avatar :width="32" :height="32" :is-round="true" class="user-avatar">
                <template #avatar>{{ item.name.substring(0,1) }}</template>
              </d-avatar>
              <span class="user-name">{{ item.name }}</span>
            </div>
            <div class="col-vulns">{{ item.vulns }}</div>
            <div class="col-points">{{ item.points }}</div>
            <div class="col-trend">
              <d-icon v-if="item.trend === 'up'" name="arrow-up" color="#16a34a" />
              <d-icon v-else-if="item.trend === 'down'" name="arrow-down" color="#dc2626" />
              <d-icon v-else name="minus" color="#94a3b8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.ranking-page {
  min-height: calc(100vh - 64px);
  background: linear-gradient(180deg, #f0fdf4 0%, #f8fafc 400px);
  padding-bottom: 40px;
}

.page-content {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 24px;
}

.ranking-header {
  text-align: center;
  padding: 40px 0;

  h1 {
    font-size: 32px;
    color: #1e293b;
    margin-bottom: 8px;
    font-weight: 800;
  }

  p {
    color: #64748b;
    margin-bottom: 32px;
  }
}

// 时间过滤器
.time-filter {
  display: inline-flex;
  background: #fff;
  padding: 4px;
  border-radius: 99px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);

  .filter-item {
    padding: 8px 24px;
    border-radius: 99px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    color: #64748b;
    transition: all 0.3s;

    &.active {
      background: #5e7ce0;
      color: #fff;
      box-shadow: 0 2px 4px rgba(94, 124, 224, 0.2);
    }
  }
}

// 领奖台
.podium-section {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 16px; // Decreased gap for mobile friendlyish
  margin-bottom: 40px;
  padding: 0 16px;
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  
  .crown-icon {
    font-size: 32px;
    margin-bottom: 8px;
    animation: bounce 2s infinite;
  }
  
  .podium-avatar {
    border: 4px solid #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    margin-bottom: 12px;
    z-index: 1;
  }

  .podium-info {
    text-align: center;
    margin-bottom: 12px;
    background: rgba(255,255,255,0.8);
    backdrop-filter: blur(4px);
    padding: 4px 12px;
    border-radius: 8px;
    
    .podium-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 16px;
    }
    
    .podium-points {
      font-size: 12px;
      color: #5e7ce0;
      font-weight: 600;
    }
  }

  .podium-base {
    width: 120px;
    background: linear-gradient(180deg, #e2e8f0 0%, #cbd5e1 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    font-weight: 900;
    color: rgba(255,255,255,0.5);
    border-radius: 12px 12px 0 0;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  }

  // Rank specific styles
  &.rank-1 {
    .crown-icon { font-size: 48px; }
    .podium-base { height: 160px; background: linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%); }
    .podium-avatar { border-color: #fcd34d; }
  }
  
  &.rank-2 {
    .podium-base { height: 120px; background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%); }
    .podium-avatar { border-color: #e2e8f0; }
  }
  
  &.rank-3 {
    .podium-base { height: 90px; background: linear-gradient(135deg, #fdba74 0%, #d97706 100%); }
    .podium-avatar { border-color: #fdba74; }
  }
}

// 列表卡片
.ranking-list-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  margin-bottom: 40px;

  .list-header {
    display: flex;
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
    font-weight: 600;
    color: #64748b;
    font-size: 13px;
  }

  .list-item {
    display: flex;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid #f1f5f9;
    transition: all 0.2s;

    &:hover {
      background: #f8fafc;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  // Columns
  .col-rank { width: 60px; font-weight: 700; color: #94a3b8; font-size: 16px; }
  .col-user { 
    flex: 1; 
    display: flex; 
    align-items: center; 
    gap: 12px;
    font-weight: 600;
    color: #1e293b;
  }
  .col-vulns { width: 100px; text-align: center; color: #475569; }
  .col-points { width: 100px; text-align: right; color: #5e7ce0; font-weight: 600; font-family: monospace; font-size: 15px; }
  .col-trend { width: 60px; text-align: right; display: flex; justify-content: flex-end; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

// Responsive
@media (max-width: 768px) {
  .ranking-page {
    padding-bottom: 20px;
  }

  .ranking-header h1 { font-size: 24px; }
  
  .podium-section {
    gap: 8px;
    align-items: flex-end;
  }
  
  .podium-item {
    .podium-base { width: 80px; }
    &.rank-1 .podium-base { height: 120px; }
    &.rank-2 .podium-base { height: 90px; }
    &.rank-3 .podium-base { height: 70px; }
    
    .podium-info {
       display: none; // Hide info on small screens to save space
    }
  }
  
  .ranking-list-card {
    .col-vulns, .col-trend { display: none; } // Simplify table
  }
}
</style>
