<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Message } from 'vue-devui'
import Header from './Public/Header.vue'
import { get, post, upload } from '../utils/request'
import { PROJECT_API, REPORT_API, CONFIG_API } from '../api/config'

// 表单数据
const formData = reactive({
  activityType: '参与活动',
  project_id: null as number | null,
  vulnerabilityName: '',
  vulnerabilityType: null as number | null,
  terminationReason: '',
  riskLevel: null as number | null,
  vulnerabilityLink: '',
  vulnerabilityDetails: '',
  attachments: [] as File[]
})

// 定义漏洞报告接口类型
interface ReportItem {
  id: number
  project_id: number
  vulnerability_name: string
  vulnerability_type_id: number
  vulnerability_impact: string
  severity_level_id: number
  vulnerability_url: string
  vulnerability_detail: string
  created_at: string
  updated_at: string
}


// 响应式状态
const loading = ref(false)
const agreeTerms = ref(false)
const projectLoading = ref(false)
const router = useRouter()
const route = useRoute()

// 编辑模式相关
const editId = computed(() => route.params.id ? Number(route.params.id) : null)
const isEditMode = computed(() => !!editId.value)

// 项目名称选项（动态加载）
const projectNameOptions = ref<Array<{ name: string; value: number | null }>>([
])

// 项目加载失败标志
const projectLoadFailed = ref(false)

// 成功弹窗控制
const successModalVisible = ref(false)
const resetForm = () => {
  formData.project_id = null
  formData.vulnerabilityName = ''
  formData.vulnerabilityType = null
  formData.terminationReason = ''
  formData.riskLevel = null
  formData.vulnerabilityLink = ''
  formData.vulnerabilityDetails = ''
  formData.attachments = []
  agreeTerms.value = false
}

const goToRecords = () => {
  successModalVisible.value = false
  router.push('/database')
}


// 项目接口返回类型
interface ProjectItem {
  id: number
  created_at: string
  updated_at: string
  name: string
  description: string
  note: string
  status: string
}

interface ProjectResponse {
  list: ProjectItem[]
  page: number
  total: number
}

// 加载项目列表
const loadProjects = async () => {
  projectLoading.value = true
  try {
    const response = await get<ProjectResponse>(PROJECT_API.LIST)
    
    // 解析返回数据：{ list: [...], page: number, total: number }
    const projects = response?.list || []
    
    // 检查数据是否有效
    if (projects.length > 0) {
      const options = projects.map(project => ({
        name: project.name,
        value: project.id
      }))
      projectNameOptions.value = options
    } else {
      // 响应为空时显示错误
      handleProjectLoadFailed()
    }
  } catch (error) {
    console.error('加载项目列表失败:', error)
    // 加载失败时显示错误
    handleProjectLoadFailed()
  } finally {
    projectLoading.value = false
  }
}
// 加载漏洞详情 (编辑模式)
const loadReportDetail = async (id: number) => {
  loading.value = true
  try {
    const response = await get<any>(REPORT_API.DETAIL(id))
    // 兼容可能存在的 data 包裹
    const data = response?.data || response
    if (data) {
      formData.project_id = data.project_id ? Number(data.project_id) : null
      formData.vulnerabilityName = data.vulnerability_name || ''
      formData.vulnerabilityType = data.vulnerability_type_id ? Number(data.vulnerability_type_id) : null
      formData.terminationReason = data.vulnerability_impact || ''
      formData.riskLevel = data.self_assessment_id ? Number(data.self_assessment_id) : (data.self_assessment?.id ? Number(data.self_assessment.id) : null)
      formData.vulnerabilityLink = data.vulnerability_url || ''
      formData.vulnerabilityDetails = data.vulnerability_detail || ''
      
      // 强制触发一次同步，确保 radio-group 状态刷新
      await nextTick()
    }
  } catch (error) {
    console.error('加载漏洞详情失败:', error)
    Message.error('加载漏洞详情失败')
  } finally {
    loading.value = false
  }
}

// 项目加载失败时的处理
const handleProjectLoadFailed = () => {
  projectLoadFailed.value = true
  projectNameOptions.value = [
    { name: '加载失败，请刷新页面重试', value: null }
  ]
}

// 漏洞类型选项（动态加载）
const vulnerabilityTypeOptions = ref<Array<{ name: string; value: number | null }>>([
])

// 漏洞类型加载状态
const vulnerabilityTypeLoading = ref(false)
const vulnerabilityTypeLoadFailed = ref(false)

// 漏洞类型接口返回类型
interface VulnerabilityTypeItem {
  id: number
  created_at?: string
  updated_at?: string
  config_value: string
}

// 加载漏洞类型列表
const loadVulnerabilityTypes = async () => {
  vulnerabilityTypeLoading.value = true
  try {
    const response = await get<VulnerabilityTypeItem[] | { list: VulnerabilityTypeItem[] }>(CONFIG_API.VULNERABILITY_TYPE)
    
    // 兼容两种返回格式：直接数组 或 { data: [...] }
    const types = Array.isArray(response) ? response : (response?.list || [])
    
    if (types.length > 0) {
      const options = types.map(type => ({
        name: type.config_value,
        value: type.id
      }))
      vulnerabilityTypeOptions.value = options
    } else {
      handleVulnerabilityTypeLoadFailed()
    }
  } catch (error) {
    console.error('加载漏洞类型失败:', error)
    handleVulnerabilityTypeLoadFailed()
  } finally {
    vulnerabilityTypeLoading.value = false
  }
}

// 漏洞类型加载失败时的处理
const handleVulnerabilityTypeLoadFailed = () => {
  vulnerabilityTypeLoadFailed.value = true
  vulnerabilityTypeOptions.value = [
    { name: '加载失败，请刷新页面重试', value: null }
  ]
}

// 风险等级选项（动态加载）
const riskLevelOptions = ref<Array<{ name: string; value: number | null }>>([
])

// 风险等级加载状态
const riskLevelLoading = ref(false)
const riskLevelLoadFailed = ref(false)

// 风险等级接口返回类型
interface SeverityLevelItem {
  id: number
  created_at?: string
  updated_at?: string
  config_value: string
}

// 加载风险等级列表
const loadSeverityLevels = async () => {
  riskLevelLoading.value = true
  try {
    const response = await get<SeverityLevelItem[] | { list: SeverityLevelItem[] }>(CONFIG_API.SEVERITY_LEVEL)
    
    // 兼容两种返回格式：直接数组 或 { data: [...] }
    const levels = Array.isArray(response) ? response : (response?.list || [])
    
    if (levels.length > 0) {
      const options = levels.map(level => ({
        name: level.config_value,
        value: level.id
      }))
      riskLevelOptions.value = options
    } else {
      handleSeverityLevelLoadFailed()
    }
  } catch (error) {
    console.error('加载风险等级失败:', error)
    handleSeverityLevelLoadFailed()
  } finally {
    riskLevelLoading.value = false
  }
}

// 风险等级加载失败时的处理
const handleSeverityLevelLoadFailed = () => {
  riskLevelLoadFailed.value = true
  riskLevelOptions.value = [
    { name: '加载失败', value: null }
  ]
}

// 方法
const handleSubmit = async () => {
  // 表单验证
  if (!formData.project_id) {
    Message.warning('请选择项目名称')
    return
  }

  if (!formData.vulnerabilityName.trim()) {
    Message.warning('请填写漏洞名称')
    return
  }

  if (!formData.vulnerabilityType) {
    Message.warning('请选择漏洞类型')
    return
  }

  if (!formData.terminationReason.trim()) {
    Message.warning('请填写漏洞危害')
    return
  }

  if (!formData.riskLevel) {
    Message.warning('请选择危害自评')
    return
  }

  if (!formData.vulnerabilityLink.trim()) {
    Message.warning('请填写漏洞链接')
    return
  }



  if (!formData.vulnerabilityDetails.trim()) {
    Message.warning('请填写漏洞详情')
    return
  }

  if (!agreeTerms.value) {
    Message.warning('请先同意服务协议')
    return
  }

  loading.value = true
  try {
    // 构建提交数据（根据 API 文档格式）
    const submitData: any = {
      project_id: formData.project_id,
      vulnerability_name: formData.vulnerabilityName,
      vulnerability_type_id: formData.vulnerabilityType,
      vulnerability_impact: formData.terminationReason,
      vulnerability_url: formData.vulnerabilityLink,
      vulnerability_detail: formData.vulnerabilityDetails
    }

    // 如果有危害自评，添加 self_assessment_id 字段（可选，确保为 number 类型）
    if (formData.riskLevel !== null && formData.riskLevel !== undefined) {
      submitData.self_assessment_id = Number(formData.riskLevel)
    }

    const apiUrl = isEditMode.value ? REPORT_API.UPDATE(editId.value!) : REPORT_API.CREATE

    // 如果有附件，使用 FormData；否则使用 JSON
    if (formData.attachments && formData.attachments.length > 0) {
      const formDataToSubmit = new FormData()
      
      // 添加所有字段到 FormData
      Object.keys(submitData).forEach(key => {
        const value = submitData[key]
        if (value !== null && value !== undefined) {
          formDataToSubmit.append(key, String(value))
        }
      })
      
      // 添加附件
      formData.attachments.forEach((file: File, index: number) => {
        formDataToSubmit.append(`attachments[${index}]`, file)
      })

      // 使用 upload 方法提交 FormData
      await upload(apiUrl, formDataToSubmit)
    } else {
      // 没有附件，使用 JSON 格式提交
      await post(apiUrl, submitData)
    }

    // 成功处理
    successModalVisible.value = true
    resetForm()
  } catch (error: any) {
    console.error('提交失败:', error)
    Message.error(error.message || '提交失败，请重试！')
  } finally {
    loading.value = false
  }
}



const handleFileUpload = (files: File[] | FileList) => {
  // DevUI Upload 组件的 file-select 事件会传递文件数组
  const fileArray = Array.isArray(files) ? files : Array.from(files)
  
  // 将新文件添加到附件列表
  fileArray.forEach((file: File) => {
    // 检查文件大小限制
    const maxSize = file.name.match(/\.(pdf|docx?)$/i) ? 8 * 1024 * 1024 : 500 * 1024 * 1024 // 8MB 或 500MB
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024)
      Message.warning(`文件 ${file.name} 超过大小限制 ${maxSizeMB}MB`)
      return
    }
    
    // 检查文件类型
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const allowedExtensions = ['pdf', 'doc', 'docx', 'apk', 'ipa', 'aar', 'zip', 'jar', 'rar', '7z']
    
    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
      Message.warning(`文件 ${file.name} 格式不支持，支持的格式：${allowedExtensions.join(', ')}`)
      return
    }
    
    // 添加到附件列表
    if (!formData.attachments.find((f: File) => f.name === file.name && f.size === file.size)) {
      formData.attachments.push(file)
    }
  })
}

// 隐藏所有错误提示的函数
const hideErrorMessages = () => {
  nextTick(() => {
    // 隐藏所有 popover 和 tooltip
    const popovers = document.querySelectorAll('.devui-popover, .devui-tooltip, [class*="popover"], [class*="tooltip"]')
    popovers.forEach(el => {
      const htmlEl = el as HTMLElement
      htmlEl.style.display = 'none'
      htmlEl.style.visibility = 'hidden'
      htmlEl.style.opacity = '0'
      htmlEl.style.pointerEvents = 'none'
    })
    
    // 移除所有输入框的错误类名和样式
    const formElement = document.querySelector('.vulnerability-form')
    if (formElement) {
      // 移除 error 类名
      const errorElements = formElement.querySelectorAll('[class*="error"]')
      errorElements.forEach(el => {
        const htmlEl = el as HTMLElement
        // 移除 error 相关的类名
        htmlEl.className = htmlEl.className
          .split(' ')
          .filter(cls => !cls.includes('error'))
          .join(' ')
        
        // 移除 error 属性
        htmlEl.removeAttribute('error')
        
        // 强制设置边框颜色
        if (htmlEl.tagName === 'INPUT' || htmlEl.tagName === 'TEXTAREA' || htmlEl.tagName === 'SELECT') {
          htmlEl.style.borderColor = '#d9d9d9'
          htmlEl.style.boxShadow = 'none'
        }
      })
      
      // 移除输入框包装器的错误状态
      const inputWrappers = formElement.querySelectorAll('.devui-input-wrapper, .devui-select-input, .devui-textarea-wrapper')
      inputWrappers.forEach(wrapper => {
        const htmlEl = wrapper as HTMLElement
        htmlEl.className = htmlEl.className
          .split(' ')
          .filter(cls => !cls.includes('error'))
          .join(' ')
        htmlEl.style.borderColor = '#d9d9d9'
        htmlEl.style.boxShadow = 'none'
      })
    }
  })
}

// 监听 DOM 变化，自动隐藏错误提示
let observer: MutationObserver | null = null

onMounted(async () => {
  // 并行加载所有基础配置
  await Promise.all([
    loadProjects(),
    loadVulnerabilityTypes(),
    loadSeverityLevels()
  ])

  // 配置加载完成后，如果是编辑模式，再加载详情进行回显
  if (editId.value) {
    loadReportDetail(editId.value)
  }
  
  // 初始隐藏
  hideErrorMessages()
  
  // 创建 MutationObserver 监听 DOM 变化
  observer = new MutationObserver(() => {
    hideErrorMessages()
  })
  
  // 开始观察整个表单区域
  const formElement = document.querySelector('.vulnerability-form')
  if (formElement) {
    observer.observe(formElement, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'style']
    })
  }
  
  // 监听所有 blur 事件，阻止验证
  const formItems = document.querySelectorAll('.vulnerability-form .devui-form-item')
  formItems.forEach(item => {
    const inputs = item.querySelectorAll('input, textarea, select')
    inputs.forEach(input => {
      input.addEventListener('blur', (e) => {
        e.stopPropagation()
        setTimeout(() => {
          hideErrorMessages()
        }, 0)
      }, true)
    })
  })
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <Header />

  <div class="submit-container">
    <div class="page-header">
      <h1 class="page-title">
        <d-icon :name="isEditMode ? 'edit' : 'edit'" /> <!-- using edit icon for submission -->
        {{ isEditMode ? '编辑漏洞报告' : '提交漏洞' }}
      </h1>
      <p class="page-desc">{{ isEditMode ? '修改并完善您的安全漏洞报告' : '欢迎提交安全漏洞报告，共同守护网络安全' }}</p>
    </div>

    <div class="main-content">
      <!-- 左侧表单区域 -->
      <d-card class="submit-card">
        <div class="card-header">
          <h3>漏洞详情表单</h3>
        </div>
        <d-form 
          :data="formData" 
          layout="vertical" 
          class="vulnerability-form"
          :rules="{}"
          :validate-on-blur="false"
          :validate-on-change="false"
          :validate-on-submit="false"
        >
          <!-- 项目名称 -->
          <d-form-item>
            <template #label>
              <span>项目名称</span>
              <span class="required-star">*</span>
            </template>
            <d-select
              v-model="formData.project_id"
              :options="projectNameOptions"
              :placeholder="projectLoading ? '加载中...' : (projectLoadFailed ? '加载失败' : '请选择项目')"
              :disabled="projectLoading || projectLoadFailed"
              class="project-select"
            />
          </d-form-item>

          <!-- 漏洞名称 -->
          <d-form-item>
            <template #label>
              <span>漏洞名称</span>
              <span class="required-star">*</span>
            </template>
            <d-input
              v-model="formData.vulnerabilityName"
              placeholder="请填写漏洞名称（字数限制50以内）"
              :maxlength="50"
              show-word-limit
            />
          </d-form-item>

          <!-- 漏洞类型 -->
          <d-form-item>
            <template #label>
              <span>漏洞类型</span>
              <span class="required-star">*</span>
            </template>
            <d-select
              v-model="formData.vulnerabilityType"
              :options="vulnerabilityTypeOptions"
              :placeholder="vulnerabilityTypeLoading ? '加载中...' : (vulnerabilityTypeLoadFailed ? '加载失败' : '请选择漏洞类型')"
              :disabled="vulnerabilityTypeLoading || vulnerabilityTypeLoadFailed"
            />
          </d-form-item>

          <!-- 漏洞危害 -->
          <d-form-item>
            <template #label>
              <span>漏洞危害</span>
              <span class="required-star">*</span>
            </template>
            <d-textarea
              v-model="formData.terminationReason"
              placeholder="请填写漏洞危害描述"
              :rows="6"
              :maxlength="500"
              show-word-limit
            />
          </d-form-item>

          <!-- 危害自评 -->
          <d-form-item>
            <template #label>
              <span>危害自评</span>
              <span class="required-star">*</span>
            </template>
            <template v-if="riskLevelLoading">
              <span class="loading-text">加载中...</span>
            </template>
            <template v-else-if="riskLevelLoadFailed">
              <span class="error-text">加载失败，请刷新页面</span>
            </template>
            <d-radio-group 
              v-else 
              v-if="riskLevelOptions.length > 0" 
              v-model="formData.riskLevel" 
              direction="horizontal"
            >
              <d-radio
                v-for="option in riskLevelOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.name }}
              </d-radio>
            </d-radio-group>
          </d-form-item>

          <!-- 漏洞链接 -->
          <d-form-item>
            <template #label>
              <span>漏洞链接</span>
              <span class="required-star">*</span>
            </template>
            <d-input
              v-model="formData.vulnerabilityLink"
              placeholder="请填写存在安全问题的链接地址（字数限制500以内）"
              :maxlength="500"
              show-word-limit
            />
          </d-form-item>

          <!-- 漏洞详情 -->
          <d-form-item>
             <template #label>
              <span>漏洞详情</span>
              <span class="required-star">*</span>
            </template>
            <d-textarea
              v-model="formData.vulnerabilityDetails"
              placeholder="请详细描述漏洞信息..."
              :rows="8"
              :maxlength="10000"
              show-word-limit
            />
          </d-form-item>

          <!-- 上传附件 -->
          <d-form-item label="上传附件">
            <div class="upload-section">
              <div class="upload-area">
                <d-upload
                  :file-list="formData.attachments"
                  :auto-upload="false"
                  multiple
                  @file-select="handleFileUpload"
                  class="file-upload"
                >
                  <div class="upload-content">
                    <d-icon name="upload" size="24px" color="#999" />
                    <p>请将附件拖放到此处或点击上传</p>
                  </div>
                </d-upload>
              </div>
              <div class="upload-tips">
                <p>附件支持格式:</p>
                <p>/pdf/docx/doc</p>
                <p>附件上传大小限制8M</p>
                <p>/apk/ipa/aar/zip/jar/rar/7z</p>
                <p>附件上传大小限制500M</p>
              </div>
            </div>
          </d-form-item>

          <!-- 服务协议 -->
          <d-form-item>
            <d-checkbox v-model="agreeTerms">
              我已仔细阅读并同意《安全应急响应中心》服务协议
            </d-checkbox>
          </d-form-item>

          <!-- 提交按钮 -->
          <div class="form-actions">
            <d-button
              bs-style="primary"
              :loading="loading"
              @click="handleSubmit"
              size="lg"
              class="submit-button"
            >
              {{ isEditMode ? '保存修改' : '提交报告' }}
            </d-button>
          </div>
        </d-form>
      </d-card>


    </div>

    <!-- 提交成功模态框 -->
    <d-modal
      v-model="successModalVisible"
      :show-close="false"
      class="status-modal"
      width="440px"
    >
      <div class="status-content success">
        <div class="status-circle">
          <d-icon name="right" size="36px" color="#fff" />
        </div>
        <div class="text-content">
          <h3>{{ isEditMode ? '漏洞修改成功' : '漏洞提交成功' }}</h3>
          <p>{{ isEditMode ? '您的报告已更新，我们将重新审核您的反馈。' : '感谢您的贡献！我们将会尽快处理您的报告，您可以在记录页面查看处理进度。' }}</p>
        </div>
      </div>
      <template #footer>
        <div class="modal-actions">
          <d-button bs-style="common" class="btn-secondary" @click="goToRecords">查看记录</d-button>
          <d-button bs-style="primary" class="btn-primary" @click="successModalVisible = false">继续提交</d-button>
        </div>
      </template>
    </d-modal>
  </div>
</template>

<style scoped lang="scss">
.submit-container {
  padding: 40px 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
  min-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-header {
  margin-bottom: 32px;
  width: 100%;
  max-width: 1200px;
  text-align: center;

  .page-title {
    margin: 0 0 12px;
    font-size: 28px;
    font-weight: 700;
    color: #1a3353;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;

    .devui-icon {
      color: #3b82f6;
    }
  }

  .page-desc {
    margin: 0;
    font-size: 16px;
    color: #64748b;
  }
}

.main-content {
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
}

// 提交卡片
.submit-card {
  width: 100%;
  max-width: 850px;
  border-radius: 16px !important;
  border: 1px solid rgba(59, 130, 246, 0.1) !important;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.05), 0 8px 10px -6px rgba(59, 130, 246, 0.05) !important;
  background: #ffffff !important;
  
  :deep(.devui-card__body) {
    padding: 40px;
  }
}

.card-header {
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f7ff;
  padding-bottom: 20px;

  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1a3353;
    display: flex;
    align-items: center;
    gap: 8px;

    &::before {
      content: '';
      width: 4px;
      height: 20px;
      background: #3b82f6;
      border-radius: 2px;
    }
  }
}

// 状态弹框样式 (借鉴登录页)
.status-modal {
  :deep(.devui-modal) {
    border-radius: 20px !important;
    overflow: hidden !important;
    border: none !important;
    box-shadow: 0 25px 50px -12px rgba(59, 130, 246, 0.2) !important;
    animation: modalFadeIn 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  :deep(.devui-modal-header) {
    display: none !important;
  }

  :deep(.devui-modal-body) {
    padding: 60px 40px 40px !important;
    background: #ffffff !important;
  }

  :deep(.devui-modal-footer) {
    border: none !important;
    padding: 0 40px 52px !important;
    justify-content: flex-end !important;
    background: #ffffff !important;
  }
}

.status-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .status-circle {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      border: 1px solid currentColor;
      opacity: 0.15;
    }
  }

  &.success .status-circle {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: #10b981;
    box-shadow: 0 8px 16px rgba(16, 185, 129, 0.2);
  }

  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 12px;
  }

  p {
    font-size: 16px;
    color: #64748b;
    line-height: 1.8;
    margin: 0;
  }
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  width: 100%;

  .devui-btn {
    min-width: 100px;
    height: 44px !important;
    border-radius: 12px !important;
    font-weight: 600 !important;
    font-size: 14px !important;
    transition: all 0.3s ease !important;
  }

  .btn-primary {
    background: #3b82f6 !important;
    border: none !important;
    color: white !important;
    box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3) !important;

    &:hover {
      background: #2563eb !important;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4) !important;
    }
  }

  .btn-secondary {
    background: #f1f5f9 !important;
    border: 1px solid #e2e8f0 !important;
    color: #64748b !important;

    &:hover {
      background: #e2e8f0 !important;
      color: #1e293b !important;
    }
  }
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.2; }
  50% { transform: scale(1.2); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

// 全局覆盖 Message 组件样式，移除边框
:global(.devui-message) {
  border: none !important;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1) !important;
  border-radius: 12px !important;
}

// 加载状态文字
.loading-text {
  color: #999;
  font-size: 14px;
}

// 错误状态文字
.error-text {
  color: #ff4d4f;
  font-size: 14px;
}

// 必填项样式 - 强制显示红星
// 必填项样式 - 强制显示红星
.required-star {
  color: #f5222d;
  margin-left: 4px;
  font-family: SimSun, sans-serif;
}


.vulnerability-form {
  // 强制隐藏所有 DevUI 验证错误提示（包括动态创建的）
  :deep(.devui-popover),
  :deep(.devui-tooltip),
  :deep(.devui-form-item-error-tip),
  :deep(.devui-form-item-message),
  :deep(.devui-form-item-error),
  :deep([class*="error-tip"]),
  :deep([class*="error-message"]),
  :deep([class*="popover"]),
  :deep([class*="tooltip"]),
  :deep([id*="popover"]),
  :deep([id*="tooltip"]),
  :deep([role="tooltip"]),
  :deep([role="popover"]) {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
    position: absolute !important;
    left: -9999px !important;
    width: 0 !important;
    height: 0 !important;
    overflow: hidden !important;
  }
  
  // 全局样式：隐藏所有可能的错误提示
  :deep(*) {
    &[class*="error-tip"],
    &[class*="error-message"],
    &[class*="popover"],
    &[class*="tooltip"],
    &[id*="popover"],
    &[id*="tooltip"] {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
    }
  }

  // 禁用所有输入框的错误状态 - 强制覆盖红色边框
  :deep(.devui-input-wrapper.error),
  :deep(.devui-input-wrapper-error),
  :deep(.devui-input.error),
  :deep(.devui-input-error),
  :deep(.devui-input[error]),
  :deep(.devui-form-item.error),
  :deep(.devui-form-item-error),
  :deep(.devui-select.error),
  :deep(.devui-select-error),
  :deep(.devui-select-input.error),
  :deep(.devui-select-input-error),
  :deep(.devui-textarea.error),
  :deep(.devui-textarea-error),
  :deep(input.error),
  :deep(input[error]),
  :deep(textarea.error),
  :deep(textarea[error]),
  :deep(select.error),
  :deep(select[error]),
  :deep([class*="error"] input),
  :deep([class*="error"] textarea),
  :deep([class*="error"] select) {
    border-color: #d9d9d9 !important;
    box-shadow: none !important;
    outline: none !important;
    background-color: white !important;
  }
  
  // 移除错误状态的 focus 样式
  :deep(.devui-input-wrapper.error:focus),
  :deep(.devui-input-wrapper-error:focus),
  :deep(.devui-input.error:focus),
  :deep(.devui-input-error:focus),
  :deep(.devui-input[error]:focus),
  :deep(.devui-select.error:focus),
  :deep(.devui-select-error:focus),
  :deep(.devui-select-input.error:focus),
  :deep(.devui-select-input-error:focus),
  :deep(.devui-textarea.error:focus),
  :deep(.devui-textarea-error:focus),
  :deep(input.error:focus),
  :deep(input[error]:focus),
  :deep(textarea.error:focus),
  :deep(textarea[error]:focus) {
    border-color: #5e7ce0 !important;
    box-shadow: 0 0 0 2px rgba(94, 124, 224, 0.2) !important;
    outline: none !important;
  }
  
  // 移除 hover 时的错误状态
  :deep(.devui-input-wrapper.error:hover),
  :deep(.devui-input-wrapper-error:hover),
  :deep(.devui-input.error:hover),
  :deep(.devui-input-error:hover),
  :deep(.devui-select.error:hover),
  :deep(.devui-select-error:hover),
  :deep(.devui-textarea.error:hover),
  :deep(.devui-textarea-error:hover) {
    border-color: #bfbfbf !important;
  }
  
  // 移除所有可能的错误类名
  :deep(.devui-form-item) {
    &[class*="error"] {
      .devui-input,
      .devui-textarea,
      .devui-select,
      .devui-input-wrapper,
      .devui-select-input {
        border-color: #d9d9d9 !important;
      }
    }
  }

  :deep(.devui-form-item) {
    margin-bottom: 20px;

    .devui-form-label {
      font-weight: 500;
      color: #333;
      margin-bottom: 8px;
    }



    .devui-input,
    .devui-textarea,
    .devui-select {
      width: 100%;
    }

    .project-select {
      :deep(.devui-select) {
        .devui-select-input {
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          padding: 8px 12px;
          font-size: 14px;
          background: white;

          &:hover {
            border-color: #bfbfbf;
          }

          &:focus {
            border-color: #ff4444;
            box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
            outline: none;
          }

          .devui-select-placeholder {
            color: #999;
          }
        }

        .devui-select-arrow {
          color: #666;
        }
      }
    }

    .devui-radio-group {
      .devui-radio {
        margin-right: 16px;
        margin-bottom: 8px;
      }
    }
  }
}


// 上传区域
.upload-section {
  display: flex;
  gap: 16px;

  .upload-area {
    flex: 1;

    .file-upload {
      width: 100%;

      .upload-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px;
        border: 2px dashed #d9d9d9;
        border-radius: 4px;
        background: #fafafa;

        p {
          margin: 8px 0 0 0;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }

  .upload-tips {
    width: 200px;
    font-size: 12px;
    color: #666;
    line-height: 1.5;

    p {
      margin: 4px 0;
    }
  }
}

// 提交按钮
.form-actions {
  text-align: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;

  .submit-button {
    padding: 12px 48px;
    font-size: 16px;
  }
}

// 右侧提示区域
.tips-section {
  width: 300px;
  flex-shrink: 0;
}

.tips-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  h3 {
    margin: 0 0 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
  }

  h4 {
    margin: 16px 0 8px 0;
    font-size: 14px;
    font-weight: 600;
    color: #333;
  }
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    margin-bottom: 12px;
    padding: 8px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;

    &.tip-danger {
      background: #fff2f0;
      border-left: 3px solid #ff4d4f;
      color: #a8071a;
    }

    &.tip-warning {
      background: #fffbe6;
      border-left: 3px solid #faad14;
      color: #ad6800;
    }

    &.tip-info {
      background: #f6ffed;
      border-left: 3px solid #52c41a;
      color: #389e0d;
    }
  }
}

.tip-details {
  margin-top: 8px;
  padding-left: 8px;

  p {
    margin: 4px 0;
    font-size: 11px;
  }
}

.additional-info {
  margin: 16px 0;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 12px;
  text-align: center;

  p {
    margin: 4px 0;
    color: #666;
  }

  .info-link {
    color: #5e7ce0;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.evaluation-info {
  margin: 16px 0;

  ul {
    list-style: none;
    padding: 0;
    margin: 8px 0;

    li {
      font-size: 12px;
      color: #666;
      margin-bottom: 4px;
      padding-left: 12px;
      position: relative;

      &::before {
        content: '•';
        position: absolute;
        left: 0;
        color: #999;
      }
    }
  }
}

.contact-info {
  text-align: center;
  margin-top: 16px;

  .contact-link {
    color: #5e7ce0;
    text-decoration: none;
    font-size: 12px;

    &:hover {
      text-decoration: underline;
    }
  }
}

// 响应式设计
@media (max-width: 1200px) {
  .main-content {
    flex-direction: column;
  }

  .tips-section {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .submit-container {
    padding: 16px;
  }

  .form-section {
    padding: 16px;
  }

  .upload-section {
    flex-direction: column;

    .upload-tips {
      width: 100%;
    }
  }

}
</style>