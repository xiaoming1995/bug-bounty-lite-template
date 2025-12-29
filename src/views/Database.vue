<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import Header from './Public/Header.vue';
import { get } from '../utils/request';
import { REPORT_API } from '../api/config';

const router = useRouter();

// 接口返回数据类型
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

// Reactive state
const loading = ref(false);
const selectedRows = ref<ReportItem[]>([]);
const searchKeyword = ref('');

// Table data
const tableData = ref<ReportItem[]>([]);

// Pagination config
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,  // 默认每页显示 10 条
  total: 0,
});

// 加载漏洞列表
const loadReports = async () => {
  loading.value = true;
  
  try {
    // 构建查询参数
    const params: any = {
      page: pagination.value.pageIndex,
      page_size: pagination.value.pageSize,
    };

    // 添加搜索关键词
    if (searchKeyword.value.trim()) {
      params.search = searchKeyword.value.trim();
    }

    // 构建查询字符串
    const filteredParams: Record<string, string> = {};
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        filteredParams[key] = String(value);
      }
    });

    const queryString = new URLSearchParams(filteredParams).toString();
    const url = queryString ? `${REPORT_API.LIST}?${queryString}` : REPORT_API.LIST;
    
    const response = await get<ReportResponse | ReportItem[]>(url);

    // 兼容多种返回格式
    if (Array.isArray(response)) {
      // 如果直接返回数组
      tableData.value = response;
      pagination.value.total = response.length;
    } else if (response && typeof response === 'object') {
      // 如果返回 { list: [...], total: ... } 格式
      const list = response.list || [];
      tableData.value = Array.isArray(list) ? list : [];
      pagination.value.total = response.total || 0;
    } else {
      tableData.value = [];
      pagination.value.total = 0;
    }
  } catch (error: any) {
    console.error('加载漏洞列表失败:', error);
    tableData.value = [];
    pagination.value.total = 0;
  } finally {
    loading.value = false;
  }
};

// 标记是否已初始化
const initialized = ref(false);

// 监听分页变化（跳过初始化）
watch(
  () => [pagination.value.pageIndex, pagination.value.pageSize],
  () => {
    if (initialized.value) {
      loadReports();
    }
  }
);

// Methods
const handleSearch = () => {
  // 搜索时重置到第一页
  pagination.value.pageIndex = 1;
  loadReports();
};


const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedRows.value = [...tableData.value];
  } else {
    selectedRows.value = [];
  }
};

const toggleRowSelection = (row: any, checked: boolean) => {
  if (checked) {
    if (!selectedRows.value.includes(row)) selectedRows.value.push(row);
  } else {
    const idx = selectedRows.value.indexOf(row);
    if (idx > -1) selectedRows.value.splice(idx, 1);
  }
};

const handleBatchExport = () => {
  console.log('批量导出:', selectedRows.value);
};

const handleBatchDelete = async () => {
  if (!confirm(`确定要删除选中的 ${selectedRows.value.length} 条记录吗？`)) {
    return;
  }
  
  try {
    // TODO: 调用批量删除接口
    // await del(REPORT_API.BATCH_DELETE, { ids: selectedRows.value.map(r => r.id) })
  console.log('批量删除:', selectedRows.value);
  selectedRows.value = [];
    await loadReports();
  } catch (error) {
    console.error('批量删除失败:', error);
    alert('删除失败，请重试');
  }
};

const viewDetail = (row: ReportItem) => {
  router.push(`/database/detail/${row.id}`);
};

const editItem = (row: ReportItem) => {
  console.log('编辑:', row);
  // TODO: 实现编辑功能
};

const deleteItem = async (row: ReportItem) => {
  if (!confirm('确定要删除这条记录吗？')) {
    return;
  }
  
  try {
    // TODO: 调用删除接口
    // await del(REPORT_API.DELETE(row.id))
  console.log('删除单条:', row);
    await loadReports();
  } catch (error) {
    console.error('删除失败:', error);
    alert('删除失败，请重试');
  }
};

// 将英文危害等级转换为中文
const getSeverityText = (severity: string | undefined): string => {
  if (!severity) return '-';
  
  // 统一转换为首字母大写进行比较
  const severityNormalized = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
  
  const textMap: Record<string, string> = {
    'Critical': '严重',
    'High': '高危',
    'Medium': '中危',
    'Low': '低危',
    // 如果已经是中文，直接返回
    '高危': '高危',
    '严重': '严重',
    '中危': '中危',
    '低危': '低危',
    '无危害': '无危害',
  };
  
  return textMap[severityNormalized] || textMap[severity] || severity;
};

const getSeverityColor = (severity: string | undefined) => {
  if (!severity) return 'primary';
  
  // 统一转换为首字母大写进行比较（匹配 Low/Medium/High/Critical）
  const severityNormalized = severity.charAt(0).toUpperCase() + severity.slice(1).toLowerCase();
  
  const map: Record<string, string> = {
    // 英文危害等级映射
    'Critical': 'danger',  // 严重 - 红色
    'High': 'danger',      // 高危 - 红色
    'Medium': 'warning',   // 中危 - 黄色
    'Low': 'success',      // 低危 - 绿色
    // 中文映射（兼容）
    '高危': 'danger',
    '严重': 'danger',
    '中危': 'warning',
    '低危': 'success',
    '无危害': 'success',
  };
  
  return map[severityNormalized] || map[severity] || 'primary';
};

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};



onMounted(async () => {
  try {
    await loadReports();
  } catch (error) {
    console.error('初始化失败:', error);
  } finally {
    initialized.value = true;
  }
});
</script>

<template>
  <Header />
  <div class="database-page">
    <div class="page-header">
      <div class="page-title">
        <h2>漏洞库</h2>
        <span class="subtitle">管理和监控系统安全漏洞</span>
      </div>
      <div class="page-actions">
      </div>
    </div>
    <div class="main-card">
      <div class="toolbar-section">
        <div class="left-tools">
          <!-- 筛选按钮已移除 -->
        </div>
        <div class="right-tools">
          <div class="search-box">
            <d-input
              v-model="searchKeyword"
              placeholder="搜索漏洞名称/编号..."
              @keyup.enter="handleSearch"
              class="custom-search"
            />
            <button class="search-btn" @click="handleSearch" title="搜索">
              <d-icon name="search" />
            </button>
          </div>
          <d-button bs-style="text" class="icon-btn" title="刷新" @click="loadReports">
            <d-icon name="refresh" />
          </d-button>
        </div>
      </div>
      <div class="batch-bar" v-if="selectedRows.length > 0">
        <div class="selected-count">
          <d-icon name="info-o" color="#5e7ce0" />
          <span>已选择 <span class="count">{{ selectedRows.length }}</span> 项数据</span>
        </div>
        <div class="batch-ops">
          <d-button bs-style="text" class="batch-btn" @click="handleBatchExport">导出选中</d-button>
          <div class="divider"></div>
          <d-button bs-style="text" class="batch-btn danger" @click="handleBatchDelete">删除选中</d-button>
        </div>
        <d-icon name="close" class="close-batch" @click="toggleSelectAll(false)" />
      </div>
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th class="checkbox-col">
                <d-checkbox
                  :model-value="selectedRows.length === tableData.length && tableData.length > 0"
                  @change="toggleSelectAll"
                />
              </th>
              <th class="col-id">ID</th>
              <th class="col-name">漏洞名称</th>
              <th class="col-type">风险类型</th>
              <th class="col-severity">风险等级</th>
              <th class="col-date">创建日期</th>
              <th class="col-actions text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" class="empty-state">
                <div class="empty-content">
                  <d-icon name="loading" size="24px" color="#9ca3af" />
                  <span>加载中...</span>
                </div>
              </td>
            </tr>
            <tr v-else-if="tableData.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-content">
                  <d-icon name="info-o" size="32px" color="#cbd5e1" />
                  <span>暂无数据</span>
                  <p class="empty-tip">请尝试调整筛选条件或搜索关键词</p>
                </div>
              </td>
            </tr>
            <template v-else>
              <tr v-for="row in tableData" :key="row.id" :class="{ selected: selectedRows.includes(row) }" class="table-row">
              <td class="checkbox-col">
                <d-checkbox
                  :model-value="selectedRows.includes(row)"
                  @change="(checked: boolean) => toggleRowSelection(row, checked)"
                />
              </td>
              <td><span class="cve-tag">#{{ row.id }}</span></td>
              <td><div class="vuln-title">{{ row.vulnerability_name }}</div></td>
              <td><span class="vuln-type">{{ row.vulnerability_type?.config_value || '-' }}</span></td>
              <td>
                <div class="severity-badge" :class="getSeverityColor(row?.severity)">
                  <span class="dot"></span>{{ getSeverityText(row?.severity) }}
                </div>
              </td>
              <td><span class="date-text">{{ formatDate(row.created_at) }}</span></td>
              <td class="text-right">
                <div class="row-actions">
                  <button class="action-btn view-btn" title="查看" @click="viewDetail(row)">
                    <span class="btn-shape view-shape"></span>
                  </button>
                  <button class="action-btn edit-btn" title="编辑" @click="editItem(row)">
                    <span class="btn-shape edit-shape"></span>
                  </button>
                  <button class="action-btn delete-btn" title="删除" @click="deleteItem(row)">
                    <span class="btn-shape delete-shape"></span>
                  </button>
                </div>
              </td>
            </tr>
            </template>
          </tbody>
        </table>
        
        <!-- 移动端卡片视图 -->
        <div class="mobile-card-list">
          <div v-if="loading" class="loading-state">
            <d-icon name="loading" size="24px" color="#9ca3af" />
            <span>加载中...</span>
          </div>
          <div v-else-if="tableData.length === 0" class="empty-state-card">
            <d-icon name="info-o" size="32px" color="#cbd5e1" />
            <span>暂无数据</span>
            <p class="empty-tip">请尝试调整筛选条件</p>
          </div>
          <template v-else>
            <div 
              v-for="row in tableData" 
              :key="row.id" 
              class="mobile-card" 
              :class="{ selected: selectedRows.includes(row) }"
            >
              <div class="card-header">
                <div class="header-left">
                  <d-checkbox
                    :model-value="selectedRows.includes(row)"
                    @change="(checked: boolean) => toggleRowSelection(row, checked)"
                  />
                  <span class="cve-tag">#{{ row.id }}</span>
                </div>
                <div class="severity-badge" :class="getSeverityColor(row?.severity)">
                  <span class="dot"></span>{{ getSeverityText(row?.severity) }}
                </div>
              </div>
              
              <div class="card-body" @click="viewDetail(row)">
                <h3 class="vuln-title">{{ row.vulnerability_name }}</h3>
                <div class="vuln-meta">
                  <span class="vuln-type">
                    <d-icon name="tag" size="12px" />
                    {{ row.vulnerability_type?.config_value || '未知类型' }}
                  </span>
                </div>
              </div>
              
              <div class="card-footer">
                <span class="date-text">{{ formatDate(row.created_at) }}</span>
                <div class="row-actions">
                  <button class="action-btn view-btn" @click.stop="viewDetail(row)">
                    <span class="btn-shape view-shape"></span>
                  </button>
                  <button class="action-btn edit-btn" @click.stop="editItem(row)">
                    <span class="btn-shape edit-shape"></span>
                  </button>
                  <button class="action-btn delete-btn" @click.stop="deleteItem(row)">
                    <span class="btn-shape delete-shape"></span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="pagination-bar">
        <div class="total-info">共 {{ pagination.total }} 条</div>
        <d-pagination
          v-model:pageIndex="pagination.pageIndex"
          v-model:pageSize="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          :can-change-page-size="true"
          :show-total="true"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.database-page {
  padding: var(--spacing-page, 32px) clamp(16px, 4vw, 40px);
  background: #f8f9fa; // Lighter, cleaner background
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end; // Align bottom
  margin-bottom: 32px; // More space
  padding-bottom: 0;
  border-bottom: none; // Remove border
  .page-title {
    h2 {
      margin: 0 0 8px 0;
      font-size: 32px; // Larger title
      font-weight: 700;
      color: #1a1a1a;
      letter-spacing: -0.02em;
    }
    .subtitle {
      font-size: 14px;
      color: #858585;
      font-weight: 400;
    }
  }
}
.main-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px; // Larger radius
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03); // Very subtle shadow
  overflow: hidden;
  border: none; // Remove border
}
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px; // More padding
  border-bottom: 1px solid rgba(0,0,0,0.03); // Very subtle separator
  gap: 16px;
  background: #fff; // Seamless white
  .left-tools {
    display: flex;
    gap: 12px;
    align-items: center;
    // ... filter styles if needed
  }
  .right-tools {
    display: flex;
    gap: 16px;
    align-items: center;
    
    .search-box { 
      display: flex;
      align-items: stretch;
      height: 44px;
      
      .custom-search { 
        position: relative;
        width: clamp(200px, 30vw, 320px);
        height: 44px;
        
        // Reset all wrapper styles
        :deep(.devui-input__wrapper),
        :deep(.d-input),
        :deep(.devui-input) {
          height: 100%;
          margin: 0;
          padding: 0;
        }
        
        // Target the actual input element with multiple selectors
        :deep(.d-input__inner),
        :deep(.devui-input__inner),
        :deep(input.d-input__inner),
        :deep(input) { 
          border-radius: 8px 0 0 8px !important;
          padding: 0 20px 0 24px !important;
          padding-left: 24px !important;
          border: 1px solid #e0e0e0 !important;
          border-right: none !important;
          background: #fafafa;
          font-size: 15px;
          color: #333;
          transition: all 0.25s ease;
          height: 44px !important;
          line-height: 44px !important;
          box-sizing: border-box !important;
          
          &::placeholder {
            color: #aaa;
            font-weight: 400;
            padding-left: 0;
          }
          
          &:hover {
            background: #fff;
            border-color: #ccc !important;
          }
          
          &:focus,
          &:focus-visible,
          &:focus-within {
            background: #fff;
            border-color: #e0e0e0 !important;
            outline: none !important;
            box-shadow: none !important;
            --devui-form-control-line-active: #e0e0e0 !important;
            --devui-brand: #e0e0e0 !important;
          }
        }
        
        // Also override the wrapper focus styles
        :deep(.devui-input__wrapper:focus-within),
        :deep(.d-input:focus-within) {
          border-color: #e0e0e0 !important;
          box-shadow: none !important;
          outline: none !important;
        }
        
        :deep(.d-input__prefix),
        :deep(.d-input__suffix),
        :deep(.devui-input__prefix),
        :deep(.devui-input__suffix) {
          display: none;
        }
      } 
      
      .search-btn { 
        color: #666;
        background: #fafafa;
        padding: 0;
        border: 1px solid #e0e0e0;
        border-left: none;
        border-radius: 0 8px 8px 0;
        transition: all 0.25s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 52px;
        height: 44px;
        box-sizing: border-box;
        cursor: pointer;
        
        :deep(.d-icon) {
          font-size: 20px;
        }
        
        &:hover { 
          color: #5e7ce0;
          background: #fff;
        }
      } 
      
      &:focus-within {
        .custom-search :deep(.d-input__inner),
        .custom-search :deep(input) {
          border-color: #e0e0e0 !important;
        }
        .search-btn {
          border-color: #e0e0e0;
        }
      }
    }
    
    .icon-btn { 
      color: #6b7280; 
      padding: 0;
      border-radius: 10px;
      transition: all 0.15s ease;
      border: 1px solid #e5e7eb;
      background: #fff;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 1px 2px rgba(0,0,0,0.04);
      
      &:hover { 
        border-color: #d1d5db;
        color: #5e7ce0; 
        box-shadow: 0 2px 4px rgba(0,0,0,0.06);
      } 
      
      &:active {
         transform: scale(0.95);
      }
    }
  }
}
.batch-bar {
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #bfdbfe;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  
  .selected-count {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #1e40af;
    font-weight: 500;
    
    .count {
      font-weight: 600;
      color: #1d4ed8;
    }
  }
  
  .batch-ops {
    display: flex;
    align-items: center;
    gap: 8px;
    
    .batch-btn {
      padding: 6px 12px;
      border-radius: 4px;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(255, 255, 255, 0.8);
      }
      
      &.danger:hover {
        background: #fee2e2;
        color: #dc2626;
      }
    }
    
    .divider {
      width: 1px;
      height: 20px;
      background: #bfdbfe;
    }
  }
  
  .close-batch {
    cursor: pointer;
    color: #64748b;
    transition: color 0.2s;
    
    &:hover {
      color: #1e40af;
    }
  }
}
.table-container {
  flex: 1;
  overflow-x: auto;
  overflow-y: auto;
  padding: 16px;
  background: #fafbfc;
  display: flex;
  flex-direction: column;

  -webkit-overflow-scrolling: touch;
  
  .modern-table {
    flex-shrink: 0;
    min-width: 800px; // 确保表格最小宽度，小屏幕时横向滚动

    display: table; // 确保表格正常显示
  }
  
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
    
    &:hover {
      background: #94a3b8;
    }
  }
}
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  color: #374151;
  background: #fff;
  border-radius: 0; // Reset radius
  box-shadow: none; // Remove shadow
  table-layout: auto; 

  th, td { 
    padding: 20px 24px; // Large padding
    text-align: left; 
    border-bottom: 1px solid #f3f5f7; // Very light separator
    transition: background-color 0.2s;
    word-wrap: break-word;
    word-break: break-word;
  }
  
  th { 
    background-color: #fff; // White background
    font-weight: 700; 
    color: #1a1a1a; 
    white-space: nowrap; 
    text-transform: uppercase; // Optional: stylistic choice
    font-size: 12px;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #f3f5f7; // Slightly thicker header border
    user-select: none;
  }
  
  // Hover effect
  .table-row {
      &:hover {
          background-color: #fafbfc; // Subtle hover
          td {
             border-bottom-color: transparent; // Clean hover
          }
      }
  }

  // 优化列宽分配 - 使用类名选择器
  .checkbox-col {
    width: 60px;
    min-width: 60px;
    max-width: 60px;
  }
  
  .col-id {
    width: 120px;
    min-width: 100px;
  }
  
  .col-name {
    min-width: 200px;
    max-width: 400px;
  }
  
  .col-type {
    width: 140px;
    min-width: 120px;
  }
  
  .col-severity {
    width: 120px;
    min-width: 100px;
  }
  
  .col-date {
    width: 140px;
    min-width: 120px;
  }
  
  .col-actions {
    width: 140px;
    min-width: 120px;
  }
  td { 
    vertical-align: middle; 
    
    .cve-tag { 
      display: inline-block; 
      background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
      color: #4f46e5; 
      padding: 5px 10px; 
      border-radius: 6px; 
      font-size: 12px; 
      font-weight: 600;
      border: 1px solid #c7d2fe;
      box-shadow: 0 1px 2px rgba(79, 70, 229, 0.1);
    } 
    
    .vuln-title { 
      font-weight: 500; 
      color: #1f2937;
      line-height: 1.5;
      max-width: 400px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    } 
    
    .vuln-type { 
      color: #6b7280;
      font-size: 13px;
    } 
    
    .severity-badge { 
      display: inline-flex; 
      align-items: center; 
      gap: 6px; 
      padding: 5px 10px; 
      border-radius: 6px; 
      font-size: 12px; 
      font-weight: 600;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      
      .dot { 
        width: 6px; 
        height: 6px; 
        border-radius: 50%; 
        display: inline-block; 
      } 
      
      &.danger { 
        background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
        color: #dc2626; 
        border: 1px solid #fca5a5;
        
        .dot { 
          background-color: #dc2626; 
        } 
      } 
      
      &.warning { 
        background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
        color: #d97706; 
        border: 1px solid #fcd34d;
        
        .dot { 
          background-color: #d97706; 
        } 
      } 
      
      &.success { 
        background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
        color: #059669; 
        border: 1px solid #6ee7b7;
        
        .dot { 
          background-color: #059669; 
        } 
      } 
      
      &.primary { 
        background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
        color: #0284c7; 
        border: 1px solid #7dd3fc;
        
        .dot { 
          background-color: #0284c7; 
        } 
      } 
    } 
    
    .date-text { 
      color: #6b7280;
      font-size: 13px;
    } 
  }
  tr.selected { 
    background-color: #f0f4ff;
    border-left: 3px solid #5e7ce0;
    
    // 选中行的最后一行也需要底部圆角
    &:last-child td {
      &:first-child {
        border-bottom-left-radius: 8px;
      }
      
      &:last-child {
        border-bottom-right-radius: 8px;
      }
    }
  }
  
  .checkbox-col { 
    padding-left: 24px; 
  }
  
  .text-right { 
    text-align: right; 
  }
  .table-row { 
    transition: all 0.2s;
    height: 64px; // 设置固定行高，让表格看起来更饱满
    
    &:hover { 
      background-color: #f8fafc;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
    }
    
    // 最后一行底部圆角
    &:last-child td {
      border-bottom: none;
      
      &:first-child {
        border-bottom-left-radius: 8px;
      }
      
      &:last-child {
        border-bottom-right-radius: 8px;
      }
    }
    
    td {
      padding: 20px 12px; // 增加内边距，让表格看起来更饱满
      vertical-align: middle;
      height: 64px; // 确保单元格高度一致
    }
  }
  
  // 空状态样式 - class 在 td 元素上
  td.empty-state {
    padding: 60px 20px !important;
    text-align: center !important;
    background: #fff;
    border-bottom: none !important;


    
    .empty-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 20px;
      color: #9ca3af;
      width: 100%;
      
      :deep(.d-icon) {
        opacity: 0.7;
      }
      
      span {
        font-size: 16px;
        font-weight: 500;
        color: #6b7280;
      }
      
      .empty-tip {
        font-size: 14px;
        color: #cbd5e1;
        margin: 4px 0 0 0;
        font-weight: 400;
      }
    }
  }
}
.row-actions { 
  display: flex; 
  justify-content: flex-end; 
  gap: 8px; 
  
  .action-btn { 
    width: 36px; 
    height: 36px; 
    padding: 0; 
    border: 1px solid transparent;
    background: #f8fafc;
    border-radius: 8px; 
    cursor: pointer; 
    display: inline-flex; 
    align-items: center; 
    justify-content: center; 
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    
    .btn-shape { 
      display: block; 
      position: relative; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    } 
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
      
      .btn-shape {
        transform: scale(1.1);
      }
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      
      .btn-shape {
        transform: scale(0.95);
      }
    }
  } 
  
  .view-shape { 
    width: 14px; 
    height: 9px; 
    border: 1.5px solid #94a3b8; 
    border-radius: 7px; 
    transition: all 0.3s;
    
    &::before { 
      content: ''; 
      position: absolute; 
      top: 50%; 
      left: 50%; 
      transform: translate(-50%, -50%); 
      width: 4px; 
      height: 4px; 
      background: #94a3b8; 
      border-radius: 50%; 
      transition: all 0.3s;
    } 
  } 
  
  .edit-shape { 
    width: 10px; 
    height: 10px; 
    border: 1.5px solid #94a3b8; 
    border-radius: 2px; 
    transition: all 0.3s;
    
    &::before { 
      content: ''; 
      position: absolute; 
      top: -2px; 
      right: -2px; 
      width: 4px; 
      height: 1.5px; 
      background: #94a3b8; 
      transform: rotate(45deg); 
      transition: all 0.3s;
    } 
  } 
  
  .delete-shape { 
    width: 10px; 
    height: 10px; 
    border: 1.5px solid #f66f6a; 
    border-radius: 2px; 
    transition: all 0.3s;
    
    &::before { 
      content: ''; 
      position: absolute; 
      top: 5px; 
      left: 2px; 
      width: 6px; 
      height: 1.5px; 
      background: #f66f6a; 
      transform: rotate(45deg); 
      transition: all 0.3s;
    } 
  } 
  
  .view-btn {
    &:hover {
      background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
      border-color: rgba(14, 165, 233, 0.3);
      
      .view-shape {
        border-color: #0284c7;
        transform: scale(1.1);
        
        &::before {
          background: #0284c7;
        }
      }
    }
    
    &:active {
      background: linear-gradient(135deg, #bae6fd 0%, #7dd3fc 100%);
      border-color: rgba(14, 165, 233, 0.4);
    }
  }
  
  .edit-btn {
    &:hover {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      border-color: rgba(245, 158, 11, 0.3);
      
      .edit-shape {
        border-color: #d97706;
        transform: scale(1.1);
        
        &::before {
          background: #d97706;
        }
      }
    }
    
    &:active {
      background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
      border-color: rgba(245, 158, 11, 0.4);
    }
  }
  
  .delete-btn {
    &:hover {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      border-color: rgba(239, 68, 68, 0.3);
      
      .delete-shape {
        border-color: #dc2626;
        transform: scale(1.1);
        
        &::before {
          background: #dc2626;
        }
      }
    }
    
    &:active {
      background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
      border-color: rgba(239, 68, 68, 0.4);
    }
  }
}
.pagination-bar {
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
  background: #fff;
  
  .total-info { 
    font-size: 14px; 
    color: #64748b;
    font-weight: 500;
  }
}
// 平板设备 (768px - 1024px)
@media (max-width: 1024px) and (min-width: 769px) {
  .database-page {
    padding: 20px 24px;
  }
  
  .table-container {
    padding: 12px;
    
    .modern-table {
      min-width: 700px;
      
      th, td {
        padding: 14px 10px;
        font-size: 13px;
      }
    }
  }
  
  .row-actions {
    gap: 6px;
    
    .action-btn {
      width: 32px;
      height: 32px;
    }
  }
}

// 移动设备 (最大 768px)
@media (max-width: 768px) {
  .database-page { 
    padding: 12px; 
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 16px;
    padding-bottom: 12px;
    
    .page-title {
      h2 {
        font-size: 24px;
      }
      
      .subtitle {
        font-size: 13px;
      }
    }
    
    .page-actions {
      width: 100%;
      
      .add-btn {
        width: 100%;
        padding: 8px 16px;
        font-size: 14px;
      }
    }
  }
  
  .main-card {
    border-radius: 8px;
  }
  
  .toolbar-section { 
    flex-direction: column; 
    align-items: stretch; 
    gap: 12px;
    padding: 12px 16px;
    
    .left-tools { 
      flex-wrap: wrap; 
      gap: 8px;
    } 
    
    .right-tools { 
      width: 100%;
      flex-direction: column;
      gap: 8px;
      
      .search-box { 
        width: 100%;
        
        .custom-search {
          :deep(.d-input__inner) {
            font-size: 14px;
            padding: 8px 44px 8px 36px;
            height: 36px;
          }
        }
      }
      
      .icon-btn {
        width: 100%;
        justify-content: center;
      }
    } 
  }
  
  .table-container { 
    overflow-x: auto;
    padding: 8px;
    -webkit-overflow-scrolling: touch;
    
    .modern-table {
      min-width: 600px;
      font-size: 12px;
      
      th, td {
        padding: 12px 8px;
        font-size: 12px;
      }
      
      th {
        font-size: 11px;
        font-weight: 600;
      }
      
      // 移动端列宽调整
      .checkbox-col {
        width: 50px;
        min-width: 50px;
        max-width: 50px;
      }
      
      .col-id {
        width: 100px;
        min-width: 80px;
      }
      
      .col-name {
        min-width: 150px;
        max-width: 250px;
      }
      
      .col-type {
        width: 100px;
        min-width: 90px;
      }
      
      .col-severity {
        width: 100px;
        min-width: 90px;
      }
      
      .col-date {
        width: 110px;
        min-width: 100px;
      }
      
      .col-actions {
        width: 110px;
        min-width: 100px;
      }
      
      // 移动端内容调整
      .cve-tag {
        font-size: 11px;
        padding: 4px 8px;
      }
      
      .vuln-title {
        max-width: 200px;
        font-size: 13px;
      }
      
      .vuln-type {
        font-size: 11px;
      }
      
      .severity-badge {
        padding: 4px 8px;
        font-size: 11px;
        
        .dot {
          width: 5px;
          height: 5px;
        }
      }
      
      .date-text {
        font-size: 11px;
      }
    }
  }
  
  .row-actions {
    gap: 4px;
    justify-content: center;
    
    .action-btn {
      width: 32px;
      height: 32px;
      
      .btn-shape {
        transform: scale(0.9);
      }
    }
  }
  
  .pagination-bar {
    flex-direction: column;
    gap: 12px;
    align-items: center;
    padding: 12px;
    
    .total-info {
      font-size: 13px;
    }
  }
  
  .batch-bar {
    padding: 10px 12px;
    flex-wrap: wrap;
    gap: 8px;
    
    .selected-count {
      font-size: 13px;
      width: 100%;
      justify-content: center;
    }
    
    .batch-ops {
      width: 100%;
      justify-content: center;
    }
  }
}

// 小屏移动设备 (最大 480px)
@media (max-width: 480px) {
  .database-page {
    padding: 8px;
  }
  
  .table-container {
    padding: 4px;
    
    .modern-table {
      min-width: 500px;
      border-radius: 6px;
      
      th, td {
        padding: 10px 6px;
        font-size: 11px;
      }
      
      th {
        font-size: 10px;
        padding: 10px 6px;
      }
      
      // 超小屏幕列宽进一步压缩
      .checkbox-col {
        width: 45px;
        min-width: 45px;
        max-width: 45px;
      }
      
      .col-id {
        width: 80px;
        min-width: 70px;
      }
      
      .col-name {
        min-width: 120px;
        max-width: 200px;
      }
      
      .col-type {
        width: 80px;
        min-width: 70px;
      }
      
      .col-severity {
        width: 80px;
        min-width: 70px;
      }
      
      .col-date {
        width: 90px;
        min-width: 80px;
      }
      
      .col-actions {
        width: 90px;
        min-width: 80px;
      }
    }
  }
  
  .row-actions {
    gap: 3px;
    
    .action-btn {
      width: 28px;
      height: 28px;
      
      .btn-shape {
        transform: scale(0.85);
      }
    }
  }
  
  .page-header {
    .page-title {
      h2 {
        font-size: 20px;
      }
    }
  }
}
</style>

<style scoped lang="scss">
// 移动设备 (最大 768px)
@media (max-width: 768px) {
  .database-page { 
    padding: 12px; 
    background: #f0f2f5; // 移动端背景稍微深一点，突出卡片
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 16px;
    padding-bottom: 0;
    border-bottom: none;
    
    .page-title {
      h2 {
        font-size: 24px;
        margin-bottom: 4px;
      }
      
      .subtitle {
        font-size: 13px;
      }
    }
    
    .page-actions {
      width: 100%;
      
      .add-btn {
        width: 100%;
        justify-content: center;
        padding: 10px;
      }
    }
  }
  
  .main-card {
    background: transparent; // 移动端移除大卡片背景
    box-shadow: none;
    border: none;
    border-radius: 0;
    overflow: visible;
  }
  
  .toolbar-section { 
    background: #fff;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    flex-direction: column;
    gap: 12px;
    
    .right-tools { 
      width: 100%;
      flex-direction: column;
      
      .search-box { 
        width: 100%;
        
        .custom-search {
          :deep(.d-input__inner) {
            height: 40px;
          }
        }
      }

      .icon-btn {
        display: none; // 移动端隐藏刷新按钮，可以通过下拉刷新实现（如果需要）
      }
    } 
  }

  .batch-bar {
    margin: 0 0 12px 0;
    border-radius: 8px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  .table-container { 
    padding: 0;
    background: transparent;
    min-height: auto;
    display: block; // 重置 flex
    
    // 隐藏表格
    .modern-table {
      display: none;
    }
  }

  // 移动端卡片列表样式
  .mobile-card-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-bottom: 20px;

    .loading-state, .empty-state-card {
      background: #fff;
      border-radius: 12px;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: #9ca3af;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      
      span {
        font-size: 14px;
      }
    }

    .mobile-card {
      background: #fff;
      border-radius: 12px;
      padding: 16px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      border: 1px solid transparent;
      transition: all 0.2s;
      position: relative;
      overflow: hidden;

      &.selected {
        border-color: #5e7ce0;
        background-color: #f8faff;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #5e7ce0;
        }
      }

      &:active {
        transform: scale(0.98);
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .header-left {
          display: flex;
          align-items: center;
          gap: 10px;

          .cve-tag {
            font-size: 13px;
            font-weight: 600;
            color: #4b5563;
            background: #f3f4f6;
            padding: 2px 6px;
            border-radius: 4px;
          }
        }
      }

      .card-body {
        margin-bottom: 16px;

        .vuln-title {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0 0 8px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .vuln-meta {
          display: flex;
          align-items: center;
          gap: 8px;

          .vuln-type {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            font-size: 12px;
            color: #6b7280;
          }
        }
      }

      .card-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 12px;
        border-top: 1px solid #f3f4f6;

        .date-text {
          font-size: 12px;
          color: #9ca3af;
        }

        .row-actions {
          gap: 8px;
          
          .action-btn {
            width: 32px;
            height: 32px;
            background: #f3f4f6;
            
            &:active {
              background: #e5e7eb;
            }
          }
        }
      }
    }
  }
  
  .pagination-bar {
    background: transparent;
    border: none;
    padding: 0;
    margin-top: 0;
    
    :deep(.devui-pagination) {
      justify-content: center;
    }
  }
}

// 默认隐藏移动端卡片列表
.mobile-card-list {
  display: none;
}
</style>