<script setup lang="ts">
import { ref, reactive } from 'vue'
import Header from './Public/Header.vue'

// 表单数据
const formData = reactive({
  title: '',
  severity: '',
  category: '',
  affectedProduct: '',
  version: '',
  description: '',
  reproductionSteps: '',
  impact: '',
  solution: '',
  attachments: []
})

// 响应式状态
const loading = ref(false)

// 选项数据
const severityOptions = [
  { label: '高危', value: '高危' },
  { label: '中危', value: '中危' },
  { label: '低危', value: '低危' }
]

const categoryOptions = [
  { label: '远程代码执行', value: '远程代码执行' },
  { label: 'SQL注入', value: 'SQL注入' },
  { label: '跨站脚本攻击(XSS)', value: 'XSS' },
  { label: '跨站请求伪造(CSRF)', value: 'CSRF' },
  { label: '文件上传漏洞', value: '文件上传漏洞' },
  { label: '信息泄露', value: '信息泄露' },
  { label: '权限提升', value: '权限提升' },
  { label: '其他', value: '其他' }
]

// 方法
const handleSubmit = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('提交漏洞信息:', formData)
    
    // 显示成功消息
    alert('漏洞提交成功！')
    
    // 重置表单
    Object.assign(formData, {
      title: '',
      severity: '',
      category: '',
      affectedProduct: '',
      version: '',
      description: '',
      reproductionSteps: '',
      impact: '',
      solution: '',
      attachments: []
    })
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请重试！')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  Object.assign(formData, {
    title: '',
    severity: '',
    category: '',
    affectedProduct: '',
    version: '',
    description: '',
    reproductionSteps: '',
    impact: '',
    solution: '',
    attachments: []
  })
}

const handleFileUpload = (files: FileList) => {
  // 处理文件上传
  console.log('上传文件:', files)
}
</script>

<template>
  <Header />
  
  <div class="sublime-container">
    <div class="page-header">
      <h2>提交漏洞</h2>
      <p>请详细填写漏洞信息，帮助我们更好地评估和处理安全问题</p>
    </div>

    <d-card class="submit-form-card">
      <d-form 
        :data="formData" 
        layout="vertical"
        class="vulnerability-form"
      >
        <d-row :gutter="24">
          <d-col :xs="24" :md="12">
            <d-form-item label="漏洞标题" required>
              <d-input 
                v-model="formData.title"
                placeholder="请输入漏洞标题"
              />
            </d-form-item>
          </d-col>
          
          <d-col :xs="24" :md="12">
            <d-form-item label="危险等级" required>
              <d-select 
                v-model="formData.severity"
                :options="severityOptions"
                placeholder="请选择危险等级"
              />
            </d-form-item>
          </d-col>
        </d-row>

        <d-row :gutter="24">
          <d-col :xs="24" :md="12">
            <d-form-item label="漏洞类型" required>
              <d-select 
                v-model="formData.category"
                :options="categoryOptions"
                placeholder="请选择漏洞类型"
              />
            </d-form-item>
          </d-col>
          
          <d-col :xs="24" :md="12">
            <d-form-item label="影响产品">
              <d-input 
                v-model="formData.affectedProduct"
                placeholder="请输入影响的产品名称"
              />
            </d-form-item>
          </d-col>
        </d-row>

        <d-form-item label="产品版本">
          <d-input 
            v-model="formData.version"
            placeholder="请输入受影响的产品版本"
          />
        </d-form-item>

        <d-form-item label="漏洞描述" required>
          <d-textarea 
            v-model="formData.description"
            :rows="4"
            placeholder="请详细描述漏洞的具体情况"
          />
        </d-form-item>

        <d-form-item label="复现步骤" required>
          <d-textarea 
            v-model="formData.reproductionSteps"
            :rows="6"
            placeholder="请详细描述漏洞的复现步骤"
          />
        </d-form-item>

        <d-form-item label="影响范围">
          <d-textarea 
            v-model="formData.impact"
            :rows="3"
            placeholder="请描述漏洞可能造成的影响"
          />
        </d-form-item>

        <d-form-item label="修复建议">
          <d-textarea 
            v-model="formData.solution"
            :rows="3"
            placeholder="请提供修复建议或解决方案"
          />
        </d-form-item>

        <d-form-item label="附件">
          <d-upload
            :file-list="formData.attachments"
            :auto-upload="false"
            multiple
            @file-select="handleFileUpload"
          >
            <d-button bs-style="common">
              <template #icon><d-icon name="upload" /></template>
              选择文件
            </d-button>
            <template #tip>
              <div class="upload-tip">
                支持上传图片、文档等文件，单个文件不超过10MB
              </div>
            </template>
          </d-upload>
        </d-form-item>

        <div class="form-actions">
          <d-button 
            bs-style="primary" 
            :loading="loading"
            @click="handleSubmit"
          >
            提交漏洞
          </d-button>
          <d-button 
            bs-style="common" 
            @click="handleReset"
          >
            重置表单
          </d-button>
        </div>
      </d-form>
    </d-card>
  </div>
</template>

<style scoped lang="scss">
.sublime-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 24px;
  
  h2 {
    margin: 0 0 8px 0;
    font-size: 24px;
    font-weight: 600;
    color: #252b3a;
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 14px;
  }
}

.submit-form-card {
  max-width: 1000px;
  margin: 0 auto;
  
  .vulnerability-form {
    :deep(.devui-form-item) {
      margin-bottom: 24px;
      
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
    }
  }
  
  .upload-tip {
    font-size: 12px;
    color: #999;
    margin-top: 8px;
  }
  
  .form-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
  }
}

@media (max-width: 768px) {
  .sublime-container {
    padding: 16px;
  }
  
  .form-actions {
    flex-direction: column;
    
    .devui-button {
      width: 100%;
    }
  }
}
</style>
