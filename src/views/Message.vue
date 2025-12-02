<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Header from './Public/Header.vue'

// 消息类型枚举
enum MessageType {
  SYSTEM = 'system',
  SECURITY = 'security',
  VULNERABILITY = 'vulnerability',
  NOTIFICATION = 'notification'
}

// 消息状态枚举
enum MessageStatus {
  UNREAD = 'unread',
  READ = 'read',
  STARRED = 'starred',
  ARCHIVED = 'archived'
}

// 消息接口定义
interface Message {
  id: number
  type: MessageType
  title: string
  content: string
  sender: string
  timestamp: string
  status: MessageStatus
  priority: 'high' | 'medium' | 'low'
  category: string
}

// 当前选中的消息类型
const activeTab = ref('all')

// 搜索关键词
const searchKeyword = ref('')

// 选中的消息ID列表
const selectedMessages = ref<number[]>([])

// 消息数据
const messages = ref<Message[]>([
  {
    id: 1,
    type: MessageType.SECURITY,
    title: '高危漏洞预警：Apache Log4j远程代码执行漏洞',
    content: '发现Apache Log4j 2.x版本存在远程代码执行漏洞（CVE-2021-44228），攻击者可通过构造恶意请求触发漏洞，建议立即更新到安全版本。',
    sender: '安全中心',
    timestamp: '2024-07-23 14:30:25',
    status: MessageStatus.UNREAD,
    priority: 'high',
    category: '安全预警'
  },
  {
    id: 2,
    type: MessageType.VULNERABILITY,
    title: '漏洞报告审核通过通知',
    content: '您提交的漏洞报告"某CMS系统SQL注入漏洞"已通过审核，漏洞编号：CNVD-2024-12345，感谢您的贡献。',
    sender: '审核中心',
    timestamp: '2024-07-23 10:15:42',
    status: MessageStatus.READ,
    priority: 'medium',
    category: '审核通知'
  },
  {
    id: 3,
    type: MessageType.SYSTEM,
    title: '系统维护通知',
    content: '系统将于2024年7月25日凌晨2:00-4:00进行例行维护，期间可能影响部分功能使用，请提前做好相关准备。',
    sender: '系统管理员',
    timestamp: '2024-07-22 16:45:18',
    status: MessageStatus.READ,
    priority: 'medium',
    category: '系统通知'
  },
  {
    id: 4,
    type: MessageType.NOTIFICATION,
    title: '月度安全报告已发布',
    content: '2024年6月份信息安全漏洞月报已发布，本月共收录各类安全漏洞156个，请及时查看相关内容。',
    sender: '报告中心',
    timestamp: '2024-07-22 09:20:33',
    status: MessageStatus.STARRED,
    priority: 'low',
    category: '报告通知'
  },
  {
    id: 5,
    type: MessageType.SECURITY,
    title: '可疑登录行为检测',
    content: '检测到您的账户在异地登录，登录IP：192.168.1.100，登录时间：2024-07-21 23:45:12，如非本人操作请及时修改密码。',
    sender: '安全监控',
    timestamp: '2024-07-21 23:46:05',
    status: MessageStatus.UNREAD,
    priority: 'high',
    category: '安全提醒'
  },
  {
    id: 6,
    type: MessageType.VULNERABILITY,
    title: '漏洞赏金计划奖励发放',
    content: '恭喜您在漏洞赏金计划中获得奖励，奖励金额：￥5000，将在3个工作日内发放到您的账户。',
    sender: '奖励中心',
    timestamp: '2024-07-21 14:22:17',
    status: MessageStatus.READ,
    priority: 'medium',
    category: '奖励通知'
  },
  {
    id: 7,
    type: MessageType.SYSTEM,
    title: '账户安全设置更新提醒',
    content: '为了提高账户安全性，建议您开启双因素认证，并定期更新密码。点击此处进行安全设置。',
    sender: '安全中心',
    timestamp: '2024-07-20 11:30:45',
    status: MessageStatus.READ,
    priority: 'low',
    category: '安全建议'
  },
  {
    id: 8,
    type: MessageType.NOTIFICATION,
    title: '新功能上线通知',
    content: '漏洞情报中心新增AI智能分析功能，可自动识别漏洞类型和风险等级，欢迎体验使用。',
    sender: '产品团队',
    timestamp: '2024-07-19 15:18:29',
    status: MessageStatus.ARCHIVED,
    priority: 'low',
    category: '功能更新'
  }
])

// 消息类型标签配置
const messageTabs = ref([
  { key: 'all', label: '全部消息', count: 0 },
  { key: 'unread', label: '未读消息', count: 0 },
  { key: 'starred', label: '星标消息', count: 0 },
  { key: 'system', label: '系统通知', count: 0 },
  { key: 'security', label: '安全预警', count: 0 },
  { key: 'vulnerability', label: '漏洞相关', count: 0 }
])

// 计算过滤后的消息列表
const filteredMessages = computed(() => {
  let filtered = messages.value

  // 按标签筛选
  if (activeTab.value !== 'all') {
    if (activeTab.value === 'unread') {
      filtered = filtered.filter(msg => msg.status === MessageStatus.UNREAD)
    } else if (activeTab.value === 'starred') {
      filtered = filtered.filter(msg => msg.status === MessageStatus.STARRED)
    } else {
      filtered = filtered.filter(msg => msg.type === activeTab.value)
    }
  }

  // 按搜索关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(msg =>
      msg.title.toLowerCase().includes(keyword) ||
      msg.content.toLowerCase().includes(keyword) ||
      msg.sender.toLowerCase().includes(keyword)
    )
  }

  return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
})

// 更新消息数量统计
const updateMessageCounts = () => {
  messageTabs.value.forEach(tab => {
    switch (tab.key) {
      case 'all':
        tab.count = messages.value.length
        break
      case 'unread':
        tab.count = messages.value.filter(msg => msg.status === MessageStatus.UNREAD).length
        break
      case 'starred':
        tab.count = messages.value.filter(msg => msg.status === MessageStatus.STARRED).length
        break
      default:
        tab.count = messages.value.filter(msg => msg.type === tab.key).length
    }
  })
}

// 获取消息类型图标
const getMessageIcon = (type: MessageType) => {
  const icons = {
    [MessageType.SYSTEM]: '⚙️',
    [MessageType.SECURITY]: '🛡️',
    [MessageType.VULNERABILITY]: '🔍',
    [MessageType.NOTIFICATION]: '📢'
  }
  return icons[type] || '📧'
}

// 获取优先级颜色
const getPriorityColor = (priority: string) => {
  const colors = {
    high: '#ff4757',
    medium: '#ffa502',
    low: '#2ed573'
  }
  return colors[priority] || '#666'
}

// 格式化时间
const formatTime = (timestamp: string) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  return date.toLocaleDateString()
}

// 切换标签
const handleTabChange = (tabKey: string) => {
  activeTab.value = tabKey
}

// 标记消息为已读
const markAsRead = (messageId: number) => {
  const message = messages.value.find(msg => msg.id === messageId)
  if (message && message.status === MessageStatus.UNREAD) {
    message.status = MessageStatus.READ
    updateMessageCounts()
  }
}

// 切换星标状态
const toggleStar = (messageId: number) => {
  const message = messages.value.find(msg => msg.id === messageId)
  if (message) {
    message.status = message.status === MessageStatus.STARRED
      ? MessageStatus.READ
      : MessageStatus.STARRED
    updateMessageCounts()
  }
}

// 删除消息
const deleteMessage = (messageId: number) => {
  const index = messages.value.findIndex(msg => msg.id === messageId)
  if (index > -1) {
    messages.value.splice(index, 1)
    updateMessageCounts()
  }
}

// 批量操作
const handleBatchOperation = (operation: string) => {
  selectedMessages.value.forEach(messageId => {
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      switch (operation) {
        case 'read':
          message.status = MessageStatus.READ
          break
        case 'star':
          message.status = MessageStatus.STARRED
          break
        case 'delete':
          deleteMessage(messageId)
          break
      }
    }
  })
  selectedMessages.value = []
  updateMessageCounts()
}

// 全选/取消全选
const toggleSelectAll = () => {
  if (selectedMessages.value.length === filteredMessages.value.length) {
    selectedMessages.value = []
  } else {
    selectedMessages.value = filteredMessages.value.map(msg => msg.id)
  }
}

// 搜索消息
const handleSearch = () => {
  // 搜索逻辑已在computed中实现
  console.log('搜索关键词:', searchKeyword.value)
}

onMounted(() => {
  updateMessageCounts()
})
</script>

<template>
  <div class="message-center">
    <Header />

    <div class="message-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1 class="page-title">消息中心</h1>
        <div class="header-actions">
          <div class="search-box">
            <input
              v-model="searchKeyword"
              placeholder="搜索消息..."
              class="search-input"
              @keyup.enter="handleSearch"
            />
            <button class="search-btn" @click="handleSearch">
              🔍
            </button>
          </div>
        </div>
      </div>

      <div class="message-content">
        <!-- 左侧消息类型导航 -->
        <div class="message-sidebar">
          <div class="message-tabs">
            <div
              v-for="tab in messageTabs"
              :key="tab.key"
              :class="['message-tab', { active: activeTab === tab.key }]"
              @click="handleTabChange(tab.key)"
            >
              <span class="tab-label">{{ tab.label }}</span>
              <span class="tab-count">{{ tab.count }}</span>
            </div>
          </div>
        </div>

        <!-- 右侧消息列表 -->
        <div class="message-main">
          <!-- 批量操作工具栏 -->
          <div v-if="selectedMessages.length > 0" class="batch-toolbar">
            <div class="selected-info">
              已选择 {{ selectedMessages.length }} 条消息
            </div>
            <div class="batch-actions">
              <button class="batch-btn" @click="handleBatchOperation('read')">
                标记已读
              </button>
              <button class="batch-btn" @click="handleBatchOperation('star')">
                添加星标
              </button>
              <button class="batch-btn danger" @click="handleBatchOperation('delete')">
                删除
              </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <div class="message-list">
            <div v-if="filteredMessages.length === 0" class="empty-state">
              <div class="empty-icon">📭</div>
              <div class="empty-text">暂无消息</div>
            </div>

            <div
              v-for="message in filteredMessages"
              :key="message.id"
              :class="['message-item', {
                unread: message.status === 'unread',
                starred: message.status === 'starred',
                selected: selectedMessages.includes(message.id)
              }]"
            >
              <!-- 消息选择框 -->
              <div class="message-checkbox">
                <input
                  type="checkbox"
                  :checked="selectedMessages.includes(message.id)"
                  @change="(e) => {
                    if ((e.target as HTMLInputElement).checked) {
                      selectedMessages.push(message.id)
                    } else {
                      const index = selectedMessages.indexOf(message.id)
                      if (index > -1) selectedMessages.splice(index, 1)
                    }
                  }"
                />
              </div>

              <!-- 消息图标 -->
              <div class="message-icon">
                <span class="icon-emoji">
                  {{ message.type === 'system' ? '⚙️' :
                     message.type === 'security' ? '🛡️' :
                     message.type === 'vulnerability' ? '🔍' : '📢' }}
                </span>
              </div>

              <!-- 消息内容 -->
              <div class="message-content-area" @click="markAsRead(message.id)">
                <div class="message-header">
                  <div class="message-title">{{ message.title }}</div>
                  <div class="message-meta">
                    <span class="message-sender">{{ message.sender }}</span>
                    <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                    <span
                      class="priority-badge"
                      :style="{ backgroundColor: message.priority === 'high' ? '#ff4757' :
                                                message.priority === 'medium' ? '#ffa502' : '#2ed573' }"
                    >
                      {{ message.priority === 'high' ? '高' :
                         message.priority === 'medium' ? '中' : '低' }}
                    </span>
                  </div>
                </div>
                <div class="message-preview">{{ message.content }}</div>
                <div class="message-category">{{ message.category }}</div>
              </div>

              <!-- 消息操作 -->
              <div class="message-actions">
                <button
                  class="action-btn star-btn"
                  :class="{ active: message.status === 'starred' }"
                  @click="toggleStar(message.id)"
                  title="星标"
                >
                  ⭐
                </button>
                <button
                  class="action-btn delete-btn"
                  @click="deleteMessage(message.id)"
                  title="删除"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>

          <!-- 全选操作 -->
          <div class="list-footer">
            <label class="select-all">
              <input
                type="checkbox"
                :checked="selectedMessages.length === filteredMessages.length && filteredMessages.length > 0"
                @change="toggleSelectAll"
              />
              全选
            </label>
            <div class="message-stats">
              共 {{ filteredMessages.length }} 条消息
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.message-center {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.message-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;
}

.page-title {
  font-size: 2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.search-input {
  padding: 12px 16px;
  border: none;
  outline: none;
  font-size: 14px;
  width: 300px;
}

.search-btn {
  padding: 12px 16px;
  background: #007bff;
  border: none;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-btn:hover {
  background: #0056b3;
}

/* 消息内容区域 */
.message-content {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 24px;
  min-height: 600px;
}

/* 左侧边栏 */
.message-sidebar {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 0;
  height: fit-content;
}

.message-tabs {
  padding: 0;
}

.message-tab {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
}

.message-tab:hover {
  background: #f8f9fa;
}

.message-tab.active {
  background: #e3f2fd;
  border-left: 4px solid #007bff;
  color: #007bff;
}

.message-tab:last-child {
  border-bottom: none;
}

.tab-label {
  font-size: 14px;
  font-weight: 500;
}

.tab-count {
  background: #e9ecef;
  color: #666;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.message-tab.active .tab-count {
  background: #007bff;
  color: white;
}

/* 右侧主内容区 */
.message-main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 批量操作工具栏 */
.batch-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.selected-info {
  font-size: 14px;
  color: #666;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

.batch-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.batch-btn:hover {
  background: #f8f9fa;
}

.batch-btn.danger {
  color: #dc3545;
  border-color: #dc3545;
}

.batch-btn.danger:hover {
  background: #dc3545;
  color: white;
}

/* 消息列表 */
.message-list {
  max-height: 600px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
}

/* 消息项 */
.message-item {
  display: flex;
  align-items: flex-start;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;
  position: relative;
}

.message-item:hover {
  background: #f8f9fa;
}

.message-item.unread {
  background: #fff3cd;
  border-left: 4px solid #ffc107;
}

.message-item.starred {
  background: #e8f5e8;
}

.message-item.selected {
  background: #e3f2fd;
}

.message-item:last-child {
  border-bottom: none;
}

.message-checkbox {
  margin-right: 12px;
  margin-top: 4px;
}

.message-checkbox input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.message-icon {
  margin-right: 12px;
  margin-top: 2px;
}

.icon-emoji {
  font-size: 20px;
}

.message-content-area {
  flex: 1;
  cursor: pointer;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.message-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
  margin-right: 16px;
}

.message-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.message-sender {
  font-size: 12px;
  color: #666;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.priority-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  color: white;
  font-weight: 600;
}

.message-preview {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.message-category {
  font-size: 12px;
  color: #007bff;
  background: #e3f2fd;
  padding: 2px 8px;
  border-radius: 12px;
  display: inline-block;
}

.message-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-left: 12px;
  opacity: 0;
  transition: opacity 0.3s;
}

.message-item:hover .message-actions {
  opacity: 1;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: #f8f9fa;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn:hover {
  background: #e9ecef;
  transform: scale(1.1);
}

.star-btn.active {
  background: #fff3cd;
  color: #ffc107;
}

.delete-btn:hover {
  background: #f8d7da;
  color: #dc3545;
}

/* 列表底部 */
.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.select-all {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
}

.select-all input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.message-stats {
  font-size: 14px;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .message-content {
    grid-template-columns: 240px 1fr;
    gap: 16px;
  }

  .search-input {
    width: 200px;
  }
}

@media (max-width: 768px) {
  .message-container {
    padding: 12px;
  }

  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .message-content {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .message-sidebar {
    order: 2;
  }

  .message-main {
    order: 1;
  }

  .message-tabs {
    display: flex;
    overflow-x: auto;
    padding: 0;
  }

  .message-tab {
    flex-shrink: 0;
    min-width: 120px;
    border-bottom: none;
    border-right: 1px solid #f0f0f0;
  }

  .message-tab:last-child {
    border-right: none;
  }

  .message-item {
    padding: 12px 16px;
  }

  .message-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .message-meta {
    gap: 8px;
  }

  .message-actions {
    flex-direction: row;
    opacity: 1;
  }

  .batch-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .search-input {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .message-item {
    flex-direction: column;
    gap: 12px;
  }

  .message-checkbox {
    margin: 0;
  }

  .message-icon {
    margin: 0;
  }

  .message-content-area {
    width: 100%;
  }

  .message-actions {
    align-self: flex-end;
  }
}

/* 滚动条样式 */
.message-list::-webkit-scrollbar {
  width: 6px;
}

.message-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.message-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.message-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画效果 */
.message-item {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 消息状态指示器 */
.message-item.unread::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 8px;
  height: 8px;
  background: #007bff;
  border-radius: 50%;
  margin-left: 8px;
}

/* 加载状态 */
.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  color: #666;
}

.loading::after {
  content: '';
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-left: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>