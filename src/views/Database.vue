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

// Filter conditions
const filterConditions = ref({
  category: '全部风险类型',
  product: '全部影响产品',
  severity: '全部风险等级',
});

// Table data
const tableData = ref<ReportItem[]>([]);

// Pagination config
const pagination = ref({
  pageIndex: 1,
  pageSize: 20,  // 默认每页显示 20 条
  total: 0,
});

// Filter options
const categoryOptions = [
  { label: '全部风险类型', value: '全部风险类型' },
  { label: '远程代码执行', value: '远程代码执行' },
  { label: 'SQL注入', value: 'SQL注入' },
  { label: '信息泄露', value: '信息泄露' },
];

const productOptions = [
  { label: '全部影响产品', value: '全部影响产品' },
  { label: 'Apache', value: 'Apache' },
  { label: 'WordPress', value: 'WordPress' },
  { label: 'Nginx', value: 'Nginx' },
];

const severityOptions = [
  { label: '全部风险等级', value: '全部风险等级' },
  { label: '高危', value: '高危' },
  { label: '中危', value: '中危' },
  { label: '低危', value: '低危' },
];

// 加载漏洞列表
const loadReports = async () => {
  loading.value = true;
  console.log('开始加载漏洞列表...');
  
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
    
    console.log('请求URL:', url);
    
    const response = await get<ReportResponse | ReportItem[]>(url);

    console.log('接口返回数据:', response);
    console.log('数据类型:', typeof response);
    console.log('是否数组:', Array.isArray(response));
    console.log('response 的键:', response && typeof response === 'object' ? Object.keys(response) : 'N/A');

    // 兼容多种返回格式
    if (Array.isArray(response)) {
      // 如果直接返回数组
      console.log('处理数组格式，长度:', response.length);
      tableData.value = response;
      pagination.value.total = response.length;
    } else if (response && typeof response === 'object') {
      // 如果返回 { list: [...], total: ... } 格式
      console.log('处理对象格式，response.list:', response.list);
      console.log('处理对象格式，response.total:', response.total);
      console.log('response.list 类型:', typeof response.list);
      console.log('response.list 是否为数组:', Array.isArray(response.list));
      
      const list = response.list || [];
      tableData.value = Array.isArray(list) ? list : [];
      pagination.value.total = response.total || 0;
      
      console.log('设置后的 tableData.value:', tableData.value);
      console.log('设置后的 tableData.value.length:', tableData.value.length);
    } else {
      console.log('未知格式，设置为空');
      tableData.value = [];
      pagination.value.total = 0;
    }
    
    console.log('最终 tableData.value:', tableData.value);
    console.log('最终 tableData.value.length:', tableData.value.length);
    console.log('最终 pagination.total:', pagination.value.total);
  } catch (error: any) {
    console.error('加载漏洞列表失败:', error);
    console.error('错误详情:', error.message, error.status, error.response);
    tableData.value = [];
    pagination.value.total = 0;
  } finally {
    loading.value = false;
    console.log('加载完成，loading:', loading.value);
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

const handleFilterChange = () => {
  // 筛选时重置到第一页
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

const addNewItem = () => {
  console.log('添加漏洞');
};

onMounted(async () => {
  console.log('组件已挂载，开始加载数据...');
  try {
    await loadReports();
    console.log('数据加载完成');
  } catch (error) {
    console.error('onMounted 中捕获错误:', error);
  } finally {
    initialized.value = true;
    console.log('初始化完成，initialized:', initialized.value);
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
        <d-button bs-style="primary" class="add-btn" @click="addNewItem">
          <template #icon>
            <d-icon name="plus" />
          </template>
          添加漏洞
        </d-button>
      </div>
    </div>
    <div class="main-card">
      <div class="toolbar-section">
        <div class="left-tools">
          <d-dropdown class="filter-dropdown">
            <d-button bs-style="text" class="filter-trigger">
              {{ filterConditions.category }}
              <template #suffix>
                <d-icon name="chevron-down" />
              </template>
            </d-button>
            <template #menu>
              <d-dropdown-menu>
                <d-dropdown-item
                  v-for="option in categoryOptions"
                  :key="option.value"
                  @click="filterConditions.category = option.value; handleFilterChange()"
                >
                  {{ option.label }}
                </d-dropdown-item>
              </d-dropdown-menu>
            </template>
          </d-dropdown>
          <d-dropdown class="filter-dropdown">
            <d-button bs-style="text" class="filter-trigger">
              {{ filterConditions.product }}
              <template #suffix>
                <d-icon name="chevron-down" />
              </template>
            </d-button>
            <template #menu>
              <d-dropdown-menu>
                <d-dropdown-item
                  v-for="option in productOptions"
                  :key="option.value"
                  @click="filterConditions.product = option.value; handleFilterChange()"
                >
                  {{ option.label }}
                </d-dropdown-item>
              </d-dropdown-menu>
            </template>
          </d-dropdown>
          <d-dropdown class="filter-dropdown">
            <d-button bs-style="text" class="filter-trigger">
              {{ filterConditions.severity }}
              <template #suffix>
                <d-icon name="chevron-down" />
              </template>
            </d-button>
            <template #menu>
              <d-dropdown-menu>
                <d-dropdown-item
                  v-for="option in severityOptions"
                  :key="option.value"
                  @click="filterConditions.severity = option.value; handleFilterChange()"
                >
                  {{ option.label }}
                </d-dropdown-item>
              </d-dropdown-menu>
            </template>
          </d-dropdown>
        </div>
        <div class="right-tools">
          <div class="search-box">
            <d-input
              v-model="searchKeyword"
              placeholder="搜索漏洞名称/编号..."
              @keyup.enter="handleSearch"
              class="custom-search"
            >
              <template #suffix>
                <d-button bs-style="text" class="search-btn" @click="handleSearch">
                  <d-icon name="search" />
                </d-button>
              </template>
            </d-input>
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
      <!-- 调试信息（开发时可见） -->
      <div v-if="false" style="padding: 10px; background: #f0f0f0; margin: 10px 0; font-size: 12px;">
        <p>调试信息:</p>
        <p>loading: {{ loading }}</p>
        <p>tableData.length: {{ tableData.length }}</p>
        <p>pagination.total: {{ pagination.total }}</p>
        <p>tableData: {{ JSON.stringify(tableData.slice(0, 2)) }}</p>
      </div>
      <div class="table-container">
        <table class="modern-table">
          <thead>
            <tr>
              <th width="60px" class="checkbox-col">
                <d-checkbox
                  :model-value="selectedRows.length === tableData.length && tableData.length > 0"
                  @change="toggleSelectAll"
                />
              </th>
              <th width="160px">ID</th>
              <th>漏洞名称</th>
              <th width="140px">风险类型</th>
              <th width="120px">风险等级</th>
              <th width="140px">创建日期</th>
              <th width="120px" class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="7" style="text-align: center; padding: 40px;">
                <span>加载中...</span>
              </td>
            </tr>
            <tr v-else-if="tableData.length === 0">
              <td colspan="7" style="text-align: center; padding: 40px; color: #999;">
                <span>暂无数据</span>
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
  padding: 24px 32px;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  .page-title {
    h2 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
      color: #111827;
      letter-spacing: -0.8px;
    }
    .subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-top: 8px;
      display: block;
      font-weight: 400;
    }
  }
  .add-btn {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    padding: 10px 20px;
    font-weight: 500;
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.35);
    }
  }
}
.main-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
.toolbar-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #f3f4f6;
  gap: 16px;
  .left-tools {
    display: flex;
    gap: 12px;
    align-items: center;
    .filter-dropdown .filter-trigger {
      font-size: 14px;
      color: #6b7280;
      padding: 0 8px;
      height: 32px;
      border-radius: 4px;
      &:hover { background: #f3f4f6; }
    }
  }
  .right-tools {
    display: flex;
    gap: 12px;
    align-items: center;
    .search-box { width: 240px; .custom-search { .d-input__inner { border-radius: 6px; padding-right: 0; } } .search-btn { color: #9ca3af; &:hover { color: #5e7ce0; } } }
    .icon-btn { color: #9ca3af; padding: 6px; &:hover { background: #f3f4f6; color: #5e7ce0; } }
  }
}
.batch-bar {
  background: #eff6ff;
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #dbeafe;
}
.table-container {
  flex: 1;
  overflow: auto;
  padding: 0 16px;
}
.modern-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
  color: #374151;
  th, td { padding: 14px 12px; text-align: left; border-bottom: 1px solid #f3f4f6; }
  th { background-color: #f9fafb; font-weight: 600; color: #4b5563; white-space: nowrap; &:first-child { border-top-left-radius: 8px; } &:last-child { border-top-right-radius: 8px; } }
  td { vertical-align: middle; .cve-tag { display: inline-block; background-color: #eef2ff; color: #4f46e5; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; } .vuln-title { font-weight: 500; color: #1f2937; } .vuln-type { color: #6b7280; } .severity-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; .dot { width: 6px; height: 6px; border-radius: 50%; display: inline-block; } &.danger { background-color: #fee2e2; color: #ef4444; .dot { background-color: #ef4444; } } &.warning { background-color: #fffbeb; color: #f59e0b; .dot { background-color: #f59e0b; } } &.success { background-color: #ecfdf5; color: #10b981; .dot { background-color: #10b981; } } &.primary { background-color: #e0f2fe; color: #0ea5e9; .dot { background-color: #0ea5e9; } } } .date-text { color: #6b7280; } }
  tr.selected { background-color: #f7f9ff; }
  .checkbox-col { padding-left: 24px; }
  .text-right { text-align: right; }
  .table-row:hover { background-color: #f5f7ff; }
}
.row-actions { display: flex; justify-content: flex-end; gap: 8px; .action-btn { width: 28px; height: 28px; padding: 0; border: none; background: transparent; border-radius: 4px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; transition: all 0.2s; .btn-shape { display: block; position: relative; } } .view-shape { width: 14px; height: 9px; border: 1.5px solid #94a3b8; border-radius: 7px; &::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 4px; height: 4px; background: #94a3b8; border-radius: 50%; } } .edit-shape { width: 10px; height: 10px; border: 1.5px solid #94a3b8; border-radius: 2px; &::before { content: ''; position: absolute; top: -2px; right: -2px; width: 4px; height: 1.5px; background: #94a3b8; transform: rotate(45deg); } } .delete-shape { width: 10px; height: 10px; border: 1.5px solid #f66f6a; border-radius: 2px; &::before { content: ''; position: absolute; top: 5px; left: 2px; width: 6px; height: 1.5px; background: #f66f6a; transform: rotate(45deg); } } .action-btn:hover { background: #f1f5f9; } }
.pagination-bar {
  padding: 8px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #f1f5f9;
  margin-top: auto;
  .total-info { font-size: 13px; color: #64748b; }
}
@media (max-width: 768px) {
  .database-page { padding: 16px; }
  .toolbar-section { flex-direction: column; align-items: stretch; gap: 16px; .left-tools { flex-wrap: wrap; } .right-tools { .search-box { width: 100%; } } }
  .table-container { overflow-x: auto; }
}
</style>