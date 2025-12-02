<script setup lang="ts">
import { ref, reactive } from 'vue'
import Header from './Public/Header.vue'
import VulnerabilityEditor from '@/components/VulnerabilityEditor.vue'

// 表单数据
const formData = reactive({
  activityType: '参与活动',
  projectName: '',
  vulnerabilityName: '',
  vulnerabilityType: '',
  terminationReason: '',
  riskLevel: '',
  vulnerabilityLink: '',
  vulnerabilityDetails: '',
  attachments: [],
  verificationCode: ''
})

// 响应式状态
const loading = ref(false)
const agreeTerms = ref(false)

// 活动类型选项
const activityTypeOptions = [
  { label: '参与活动', value: '参与活动' },
  { label: '当前暂无活动', value: '当前暂无活动' }
]

// 项目名称选项
const projectNameOptions = [
  { label: '请选择项目', value: '' },
  { label: '百度搜索', value: '百度搜索' },
  { label: '百度地图', value: '百度地图' },
  { label: '百度网盘', value: '百度网盘' },
  { label: '百度贴吧', value: '百度贴吧' },
  { label: '百度知道', value: '百度知道' },
  { label: '百度文库', value: '百度文库' },
  { label: '百度百科', value: '百度百科' },
  { label: '百度翻译', value: '百度翻译' },
  { label: '百度云', value: '百度云' },
  { label: '百度APP', value: '百度APP' },
  { label: '百度小程序', value: '百度小程序' },
  { label: '百度智能云', value: '百度智能云' },
  { label: '百度开放平台', value: '百度开放平台' },
  { label: '百度开发者中心', value: '百度开发者中心' },
  { label: '百度统计', value: '百度统计' },
  { label: '百度推广', value: '百度推广' },
  { label: '百度商桥', value: '百度商桥' },
  { label: '其他百度产品', value: '其他百度产品' }
]

// 漏洞类型选项
const vulnerabilityTypeOptions = [
  { label: 'SQL注入', value: 'SQL注入' },
  { label: 'XSS跨站脚本', value: 'XSS跨站脚本' },
  { label: '文件上传', value: '文件上传' },
  { label: '命令执行', value: '命令执行' },
  { label: '信息泄露', value: '信息泄露' },
  { label: '逻辑漏洞', value: '逻辑漏洞' },
  { label: '其他', value: '其他' }
]

// 终止原因选项
const terminationReasonOptions = [
  { label: '其他危害等', value: '其他危害等' },
  { label: '无法复现', value: '无法复现' },
  { label: '重复提交', value: '重复提交' },
  { label: '不符合要求', value: '不符合要求' }
]

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
  if (!formData.projectName) {
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
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    console.log('提交漏洞信息:', formData)
    alert('漏洞提交成功！')

    // 重置表单
    resetForm()
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请重试！')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  Object.assign(formData, {
    activityType: '参与活动',
    projectName: '',
    vulnerabilityName: '',
    vulnerabilityType: '',
    terminationReason: '',
    riskLevel: '',
    vulnerabilityLink: '',
    vulnerabilityDetails: '',
    attachments: [],
    verificationCode: ''
  })
  agreeTerms.value = false
}

const handleFileUpload = (files: FileList) => {
  console.log('上传文件:', files)
}

const refreshCaptcha = () => {
  console.log('刷新验证码')
}
</script>

<template>
  <Header />

  <div class="submit-container">
    <div class="main-content">
      <!-- 左侧表单区域 -->
      <div class="form-section">
        <div class="form-header">
          <div class="activity-tabs">
            <d-radio-group v-model="formData.activityType" direction="horizontal">
              <d-radio
                v-for="option in activityTypeOptions"
                :key="option.value"
                :value="option.value"
                :class="{ 'active-tab': formData.activityType === option.value }"
              >
                {{ option.label }}
              </d-radio>
            </d-radio-group>
          </div>
        </div>

        <d-form :data="formData" layout="vertical" class="vulnerability-form">
          <!-- 项目名称 -->
          <d-form-item label="项目名称" required>
            <d-select
              v-model="formData.projectName"
              :options="projectNameOptions"
              placeholder="请选择项目"
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
              placeholder="请选择"
            />
          </d-form-item>

          <!-- 漏洞终止运行的危害 -->
          <d-form-item label="漏洞终止运行的危害">
            <d-select
              v-model="formData.terminationReason"
              :options="terminationReasonOptions"
              placeholder="其他危害等"
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
            <VulnerabilityEditor
              v-model="formData.vulnerabilityDetails"
              placeholder="请详细描述漏洞信息..."
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

          <!-- 验证码 -->
          <d-form-item label="验证码" required>
            <div class="captcha-section">
              <d-input
                v-model="formData.verificationCode"
                placeholder="验证码不区分大小写"
                class="captcha-input"
              />
              <div class="captcha-container">
                <div class="captcha-image" @click="refreshCaptcha">
                  <span class="captcha-placeholder">验证码图片</span>
                </div>
                <span class="refresh-link" @click="refreshCaptcha">换一张</span>
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

.form-header {
  margin-bottom: 24px;

  .activity-tabs {
    margin-bottom: 16px;

    :deep(.devui-radio-group) {
      .devui-radio {
        margin-right: 0;

        .devui-radio-material {
          padding: 8px 16px;
          border: 1px solid #d9d9d9;
          border-radius: 0;
          background: #f5f5f5;

          &:first-child {
            border-top-left-radius: 4px;
            border-bottom-left-radius: 4px;
          }

          &:last-child {
            border-top-right-radius: 4px;
            border-bottom-right-radius: 4px;
          }

          &.devui-radio-checked {
            background: #ff4444;
            color: white;
            border-color: #ff4444;
          }
        }
      }
    }
  }

  .form-title {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }
}

.vulnerability-form {
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

// 富文本编辑器样式
:deep(.rich-text-editor) {
  .quill-editor {
    .ql-editor {
      font-family: inherit;
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

// 验证码区域
.captcha-section {
  display: flex;
  gap: 12px;
  align-items: center;

  .captcha-input {
    width: 200px;
  }

  .captcha-container {
    display: flex;
    align-items: center;
    gap: 8px;

    .captcha-image {
      width: 80px;
      height: 32px;
      border: 1px solid #d9d9d9;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f5f5f5;
      cursor: pointer;

      .captcha-placeholder {
        font-size: 12px;
        color: #999;
      }
    }

    .refresh-link {
      color: #5e7ce0;
      font-size: 12px;
      cursor: pointer;
      text-decoration: underline;

      &:hover {
        color: #3a8ee6;
      }
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

  .captcha-section {
    flex-direction: column;
    align-items: flex-start;

    .captcha-input {
      width: 100%;
    }
  }
}
</style>