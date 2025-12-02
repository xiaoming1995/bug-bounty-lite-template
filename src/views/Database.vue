<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import Header from './Public/Header.vue';

const router = useRouter();

// Reactive state
const loading = ref(false);
const selectedRows = ref<any[]>([]);
const searchKeyword = ref('');

// Filter conditions
const filterConditions = ref({
  category: '全部风险类型',
  product: '全部影响产品',
  severity: '全部风险等级',
});

// Table data (example data)
const tableData = ref([
  {
    id: 'CVE-2023-1234',
    title: 'Apache Log4j远程代码执行漏洞',
    severity: '高危',
    affectedProduct: '远程代码执行',
    publishDate: '2023-05-10',
    status: '已确认',
    hasDetails: true,
    _id: 1,
  },
  {
    id: 'CVE-2023-5678',
    title: 'WordPress插件SQL注入漏洞',
    severity: '中危',
    affectedProduct: 'SQL注入',
    publishDate: '2023-05-08',
    status: '已确认',
    hasDetails: true,
    _id: 2,
  },
  {
    id: 'CVE-2023-9012',
    title: 'Nginx配置文件泄露漏洞',
    severity: '低危',
    affectedProduct: '信息泄露',
    publishDate: '2023-05-05',
    status: '已确认',
    hasDetails: true,
    _id: 3,
  },
]);

// Pagination config
const pagination = ref({
  pageIndex: 1,
  pageSize: 10,
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

// Computed filtered data
const filteredData = computed(() => {
  let data = tableData.value;
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase();
    data = data.filter(
      (item) =>
        item.title.toLowerCase().includes(kw) || item.id.toLowerCase().includes(kw)
    );
  }
  return data;
});

// Sync pagination total with filtered data length
watch(filteredData, (newVal) => {
  pagination.value.total = newVal.length;
});

// Methods
const handleSearch = () => {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    console.log('搜索关键词:', searchKeyword.value);
  }, 500);
};

const handleFilterChange = () => {
  console.log('筛选条件变更:', filterConditions.value);
  handleSearch();
};

const toggleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedRows.value = [...filteredData.value];
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

const handleBatchDelete = () => {
  console.log('批量删除:', selectedRows.value);
  tableData.value = tableData.value.filter((item) => !selectedRows.value.includes(item));
  selectedRows.value = [];
};

const viewDetail = (row: any) => {
  console.log('查看详情:', row);
  router.push(`/database/detail/${row.id}`);
};

const editItem = (row: any) => {
  console.log('编辑:', row);
};

const deleteItem = (row: any) => {
  console.log('删除单条:', row);
  tableData.value = tableData.value.filter((item) => item !== row);
};

const getSeverityColor = (severity: string) => {
  const map: Record<string, string> = {
    高危: 'danger',
    中危: 'warning',
    低危: 'success',
  };
  return map[severity] || 'primary';
};

const addNewItem = () => {
  console.log('添加漏洞');
};

onMounted(() => {
  handleSearch();
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
          <d-button bs-style="text" class="icon-btn" title="刷新" @click="handleSearch">
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
              <th width="60px" class="checkbox-col">
                <d-checkbox
                  :model-value="selectedRows.length === filteredData.length && filteredData.length > 0"
                  @change="toggleSelectAll"
                />
              </th>
              <th width="160px">CVE编号</th>
              <th>漏洞名称</th>
              <th width="140px">风险类型</th>
              <th width="120px">风险等级</th>
              <th width="140px">发现日期</th>
              <th width="120px" class="text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in filteredData" :key="row._id" :class="{ selected: selectedRows.includes(row) }" class="table-row">
              <td class="checkbox-col">
                <d-checkbox
                  :model-value="selectedRows.includes(row)"
                  @change="(checked) => toggleRowSelection(row, checked)"
                />
              </td>
              <td><span class="cve-tag">{{ row.id }}</span></td>
              <td><div class="vuln-title">{{ row.title }}</div></td>
              <td><span class="vuln-type">{{ row.affectedProduct }}</span></td>
              <td>
                <div class="severity-badge" :class="getSeverityColor(row.severity)">
                  <span class="dot"></span>{{ row.severity }}
                </div>
              </td>
              <td><span class="date-text">{{ row.publishDate }}</span></td>
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
          </tbody>
        </table>
      </div>
      <div class="pagination-bar">
        <div class="total-info">共 {{ pagination.total }} 条</div>
        <d-pagination
          v-model:pageIndex="pagination.pageIndex"
          v-model:pageSize="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
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