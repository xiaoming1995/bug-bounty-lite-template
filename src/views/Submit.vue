<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import Header from './Public/Header.vue'
import { get, post } from '../utils/request'
import { PROJECT_API, REPORT_API, CONFIG_API } from '../api/config'

// 表单数据
const formData = reactive({
  activityType: '参与活动',
  project_id: null as number | null,
  vulnerabilityName: '',
  vulnerabilityType: null as number | null,
  terminationReason: '',
  riskLevel: '',
  vulnerabilityLink: '',
  vulnerabilityDetails: '',
  attachments: []
})

// 响应式状态
const loading = ref(false)
const agreeTerms = ref(false)
const projectLoading = ref(false)

// 项目名称选项（动态加载）
const projectNameOptions = ref<Array<{ name: string; value: number | null }>>([
  { name: '请选择项目', value: null }
])

// 项目加载失败标志
const projectLoadFailed = ref(false)

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
  data: ProjectItem[]
  page: number
  total: number
}

// 加载项目列表
const loadProjects = async () => {
  projectLoading.value = true
  try {
    const response = await get<ProjectResponse>(PROJECT_API.LIST)
    
    // 解析返回数据：{ data: [...], page: number, total: number }
    const projects = response?.data || []
    
    // 检查数据是否有效
    if (projects.length > 0) {
      const options = projects.map(project => ({
        name: project.name,
        value: project.id
      }))
      projectNameOptions.value = [
        ...options
      ]
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

// 项目加载失败时的处理
const handleProjectLoadFailed = () => {
  projectLoadFailed.value = true
  projectNameOptions.value = [
    { name: '加载失败，请刷新页面重试', value: null }
  ]
}

// 漏洞类型选项（动态加载）
const vulnerabilityTypeOptions = ref<Array<{ name: string; value: number | null }>>([
  { name: '请选择漏洞类型', value: null }
])

// 漏洞类型加载状态
const vulnerabilityTypeLoading = ref(false)
const vulnerabilityTypeLoadFailed = ref(false)

// 漏洞类型接口返回类型
interface VulnerabilityTypeItem {
  id: number
  created_at: string
  updated_at: string
  name: string
}

interface VulnerabilityTypeResponse {
  data: VulnerabilityTypeItem[]
  page: number
  total: number
}

// 加载漏洞类型列表
const loadVulnerabilityTypes = async () => {
  vulnerabilityTypeLoading.value = true
  try {
    const response = await get<VulnerabilityTypeResponse>(CONFIG_API.VULNERABILITY_TYPE)
    
    const types = response?.data || []
    
    if (types.length > 0) {
      const options = types.map(type => ({
        name: type.name,
        value: type.id
      }))
      vulnerabilityTypeOptions.value = [...options]
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

// 风险等级选项
const riskLevelOptions = [
  { label: '无危害', value: '无危害' },
  { label: '低危', value: '低危' },
  { label: '中危', value: '中危' },
  { label: '高危', value: '高危' },
  { label: '严重', value: '严重' }
]

// 方法
const handleSubmit = async () => {
  // 表单验证
  if (!formData.project_id) {
    alert('请选择项目名称')
    return
  }

  if (!formData.vulnerabilityName.trim()) {
    alert('请填写漏洞名称')
    return
  }

  if (!formData.vulnerabilityType) {
    alert('请选择漏洞类型')
    return
  }

  if (!formData.terminationReason.trim()) {
    alert('请填写漏洞危害')
    return
  }

  if (!formData.riskLevel) {
    alert('请选择危害自评')
    return
  }

  if (!formData.vulnerabilityLink.trim()) {
    alert('请填写漏洞链接')
    return
  }

  if (!formData.vulnerabilityDetails.trim()) {
    alert('请填写漏洞详情')
    return
  }

  if (!agreeTerms.value) {
    alert('请先同意服务协议')
    return
  }

  loading.value = true
  try {
    // 构建提交数据
    const submitData = {
      project_id: formData.project_id,
      vulnerability_name: formData.vulnerabilityName,
      vulnerability_type_id: formData.vulnerabilityType,
      harm_description: formData.terminationReason,
      risk_level: formData.riskLevel,
      vulnerability_link: formData.vulnerabilityLink,
      vulnerability_details: formData.vulnerabilityDetails
    }

    // 调用提交接口
    await post(REPORT_API.CREATE, submitData)

    alert('漏洞提交成功！')

    // 重置表单
    resetForm()
  } catch (error: any) {
    console.error('提交失败:', error)
    alert(error.message || '提交失败，请重试！')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    activityType: '参与活动',
    project_id: null,
    vulnerabilityName: '',
    vulnerabilityType: null,
    terminationReason: '',
    riskLevel: '',
    vulnerabilityLink: '',
    vulnerabilityDetails: '',
    attachments: []
  })
  agreeTerms.value = false
}

const handleFileUpload = (files: FileList) => {
  console.log('上传文件:', files)
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

onMounted(() => {
  // 加载项目列表和漏洞类型
  loadProjects()
  loadVulnerabilityTypes()
  
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
    <div class="main-content">
      <!-- 左侧表单区域 -->
      <div class="form-section">
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
          <d-form-item label="项目名称" required>
            <d-select
              v-model="formData.project_id"
              :options="projectNameOptions"
              :placeholder="projectLoading ? '加载中...' : (projectLoadFailed ? '加载失败' : '请选择项目')"
              :disabled="projectLoading || projectLoadFailed"
              class="project-select"
            />
          </d-form-item>

          <!-- 漏洞名称 -->
          <d-form-item label="漏洞名称" required>
            <d-input
              v-model="formData.vulnerabilityName"
              placeholder="请填写漏洞名称（字数限制50以内）"
              :maxlength="50"
              show-word-limit
            />
          </d-form-item>

          <!-- 漏洞类型 -->
          <d-form-item label="漏洞类型" required>
            <d-select
              v-model="formData.vulnerabilityType"
              :options="vulnerabilityTypeOptions"
              :placeholder="vulnerabilityTypeLoading ? '加载中...' : (vulnerabilityTypeLoadFailed ? '加载失败' : '请选择漏洞类型')"
              :disabled="vulnerabilityTypeLoading || vulnerabilityTypeLoadFailed"
            />
          </d-form-item>

          <!-- 漏洞危害 -->
          <d-form-item label="漏洞危害" required>
            <d-textarea
              v-model="formData.terminationReason"
              placeholder="请填写漏洞危害描述"
              :rows="6"
              :maxlength="500"
              show-word-limit
            />
          </d-form-item>

          <!-- 危害自评 -->
          <d-form-item label="危害自评" required>
            <d-radio-group v-model="formData.riskLevel" direction="horizontal">
              <d-radio
                v-for="option in riskLevelOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </d-radio>
            </d-radio-group>
          </d-form-item>

          <!-- 漏洞链接 -->
          <d-form-item label="漏洞链接" required>
            <d-input
              v-model="formData.vulnerabilityLink"
              placeholder="请填写存在安全问题的链接地址（字数限制500以内）"
              :maxlength="500"
              show-word-limit
            />
          </d-form-item>

          <!-- 漏洞详情 -->
          <d-form-item label="漏洞详情" required>
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
              我已仔细阅读并同意《百度安全应急响应中心》(bsrc) 服务协议
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
              提交报告
            </d-button>
          </div>
        </d-form>
      </div>

      <!-- 右侧提示区域 -->
      <div class="tips-section">
        <div class="tips-card">
          <h3>提示:</h3>
          <ul class="tips-list">
            <li class="tip-danger">
              百度不允许任何未经授权的渗透测试行为或恶意漏洞攻击行为
            </li>
            <li class="tip-warning">
              测试过程中不得获取、修改、删除用户数据，不得影响业务正常运行
            </li>
            <li class="tip-info">
              SSRF内网探测地址
              <div class="tip-details">
                <p>域名: http://bsrc.baidu.com</p>
                <p>IP: http://10.1.1.1</p>
              </div>
            </li>
            <li class="tip-info">
              注意事项:
              <div class="tip-details">
                <p>1. 证明SSRF漏洞时请访问测试其他内网地址，参考文档info，参数攻击</p>
                <p>2. 使用绕过时请按技术文档说明，参考文档info，参数攻击</p>
              </div>
            </li>
          </ul>

          <div class="additional-info">
            <p>提交前请仔细阅读</p>
            <a href="#" class="info-link">厂商行为 V8.0.pdf</a>
            <p>《百度安全应急响应中心》</p>
          </div>

          <div class="evaluation-info">
            <h4>我们的评判标准</h4>
            <ul>
              <li>BSRC收到的漏洞将按照漏洞等级进行奖励</li>
              <li>BSRC将每月对外公布漏洞统计信息</li>
              <li>危害较大、利用方式巧妙的漏洞将获得额外漏洞奖励</li>
            </ul>
          </div>

          <div class="contact-info">
            <a href="#" class="contact-link">测试报告人员</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.submit-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.main-content {
  display: flex;
  gap: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

// 左侧表单区域
.form-section {
  flex: 1;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

      &::before {
        content: '*';
        color: #ff4444;
        margin-right: 4px;
      }
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