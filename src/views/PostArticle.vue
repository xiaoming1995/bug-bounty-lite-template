<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import { Message } from 'vue-devui'
import Header from './Public/Header.vue'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const showSuccessModal = ref(false)
const showLeaveConfirmModal = ref(false)
const isSubmitted = ref(false)
const isEditMode = ref(false)
let leaveNext: any = null

// 判断是否为编辑模式
onMounted(() => {
  if (route.params.id) {
    isEditMode.value = true
    loadArticleData(route.params.id as string)
  }
})

// 加载 Mock 文章数据（编辑模式）
const loadArticleData = (id: string) => {
  console.log('加载文章数据 ID:', id)
  // 模拟从后端获取数据
  setTimeout(() => {
    formModel.title = '深入理解 Web 安全中的 XSS 攻击与防御'
    formModel.description = '这是一篇关于 XSS 攻击原理与深度防护技术的专业研究文章。'
    formModel.content = `
      <h2>研究背景</h2>
      <p>随着 Web 应用的功能日益复杂，跨站脚本攻击 (XSS) 仍然是最具威胁的漏洞之一...</p>
      <h2>防护建议</h2>
      <p>1. 始终对用户输入进行严格的转义处理；2. 部署强大的内容安全策略 (CSP)...</p>
    `
  }, 500)
}

const formModel = reactive({
  title: '',
  description: '',
  content: '',
  attachments: [] as any[]
})

// 离开页面前的二次确认
onBeforeRouteLeave((to, from, next) => {
  // 如果已经提交成功，或者表单没有任何内容，则直接离开
  const hasContent = formModel.title || formModel.description || (formModel.content && formModel.content !== '<p><br></p>')
  
  if (isSubmitted.value || !hasContent) {
    next()
  } else {
    // 保存 next 回调，显示自定义弹窗
    leaveNext = next
    showLeaveConfirmModal.value = true
  }
})

const handleConfirmLeave = () => {
  showLeaveConfirmModal.value = false
  if (leaveNext) {
    leaveNext()
    leaveNext = null
  }
}

const handleCancelLeave = () => {
  showLeaveConfirmModal.value = false
  if (leaveNext) {
    leaveNext(false)
    leaveNext = null
  }
}

// 修复 lint: 虽然 to, from 未直接读取，但在导航守卫中必须声明
// @ts-ignore
console.log('Router sync:', { to: route.path }) 


// Quill 编辑器选项
const editorOptions = {
  placeholder: '在此输入正文内容...',
  theme: 'snow',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ 'header': 1 }, { 'header': 2 }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'font': [] }],
      [{ 'align': [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  }
}

const handleSubmit = async () => {
  if (!formModel.title) {
    Message.warning('请输入文章标题')
    return
  }
  if (!formModel.description) {
    Message.warning('请输入文章简要描述')
    return
  }
  if (!formModel.content || formModel.content === '<p><br></p>') {
    Message.warning('请输入文章内容')
    return
  }

  loading.value = true
  try {
    console.log('提交的文章数据:', formModel)
    await new Promise(resolve => setTimeout(resolve, 1500))
    isSubmitted.value = true
    showSuccessModal.value = true
  } catch (error) {
    console.error('发布失败:', error)
    Message.error('发布失败，请检查网络或重试')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  router.back()
}

const handleCloseModal = () => {
  showSuccessModal.value = false
  router.push(isEditMode.value ? '/article-management' : '/')
}
</script>

<template>
  <Header />
  <div class="post-article-container">
    <div class="form-card">
      <div class="form-header">
        <h2 class="form-title">{{ isEditMode ? '编辑技术文章' : '发布技术文章' }}</h2>
        <p class="form-subtitle">{{ isEditMode ? '修改并完善您的技术成果' : '分享您的技术见解与研究成果' }}</p>
      </div>

      <div class="article-form">
        <!-- 标题 -->
        <div class="form-item">
          <label class="form-label required">文章标题</label>
          <input 
            v-model="formModel.title" 
            type="text" 
            placeholder="请输入引人入胜的标题" 
            class="custom-input"
          />
        </div>

        <!-- 描述 -->
        <div class="form-item">
          <label class="form-label required">简要描述</label>
          <textarea 
            v-model="formModel.description" 
            placeholder="请提供文章的简短摘要" 
            class="custom-textarea"
            rows="3"
          ></textarea>
        </div>

        <!-- 内容 (富文本) -->
        <div class="form-item">
          <label class="form-label required">文章内容</label>
          <div class="editor-wrapper">
            <QuillEditor 
              v-model:content="formModel.content" 
              contentType="html"
              :options="editorOptions"
              class="quill-editor"
            />
          </div>
        </div>

        <!-- 附件上传 -->
        <div class="form-item">
          <label class="form-label">附件</label>
          <div class="upload-zone">
            <div class="upload-trigger">
              <d-icon name="upload" class="upload-icon" />
              <span>点击或拖拽文件上传</span>
            </div>
            <p class="upload-tip">支持 PDF, DOCX, ZIP, PNG, JPG (最大 10MB)</p>
          </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="form-actions">
          <button class="btn btn-secondary" @click="handleCancel">取消</button>
          <button 
            class="btn btn-primary" 
            :disabled="loading" 
            @click="handleSubmit"
          >
            {{ loading ? (isEditMode ? '保存中...' : '发布中...') : (isEditMode ? '保存修改' : '立即发布') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 成功提示模态框 -->
    <d-modal
      v-model="showSuccessModal"
      :show-close="false"
      class="status-modal"
      width="440px"
    >
      <div class="status-content success">
        <div class="status-circle">
          <d-icon name="right" size="40px" color="#fff" />
        </div>
        <div class="text-content">
          <h3>{{ isEditMode ? '修改成功' : '发布成功' }}</h3>
          <p>{{ isEditMode ? '您的文章已成功更新，并进入审核队列。' : '您的文章已成功发布，正等待审核通过后展示。' }}</p>
        </div>
        <div class="modal-actions">
          <d-button bs-style="primary" class="btn-confirm" @click="handleCloseModal">确 定</d-button>
        </div>
      </div>
    </d-modal>
    <d-modal
      v-model="showLeaveConfirmModal"
      :show-close="false"
      class="compact-confirm-modal"
      width="480px"
    >
      <div class="compact-confirm-content" style="display: flex; flex-direction: column; align-items: center; text-align: center; padding: 40px; background: #fff;">
        <div class="confirm-main" style="display: flex; flex-direction: column; align-items: center; gap: 16px; margin-bottom: 32px;">
          <d-icon name="warning-o" size="32px" color="#f59e0b" class="main-icon" style="margin-bottom: 8px;" />
          <div class="text-wrap" style="display: flex; flex-direction: column; align-items: center;">
            <h4 class="confirm-title" style="font-size: 18px; font-weight: 700; color: #0f172a; margin: 0 0 12px 0; letter-spacing: -0.01em;">离开此页面？</h4>
            <p class="confirm-desc" style="font-size: 14px; color: #475569; margin: 0; line-height: 1.6; max-width: 280px;">当前编辑的内容尚未提交，离开会导致这些信息丢失。</p>
          </div>
        </div>
        <div class="confirm-footer" style="display: flex; justify-content: center; gap: 16px; width: 100%;">
          <button class="btn-plain" style="flex: 1; max-width: 120px; height: 38px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; background: #f1f5f9; color: #475569; letter-spacing: 2px; text-indent: 2px;" @click="handleCancelLeave">取消</button>
          <button class="btn-solid" style="flex: 1; max-width: 120px; height: 38px; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; background: #0f172a; color: #fff; letter-spacing: 2px; text-indent: 2px;" @click="handleConfirmLeave">确定</button>
        </div>
      </div>
    </d-modal>
  </div>
</template>

<style scoped lang="scss">
.post-article-container {
  padding: 40px 20px;
  background: #f8fafc;
  min-height: calc(100vh - 64px);
  display: flex;
  justify-content: center;

  .form-card {
    width: 100%;
    max-width: 1000px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    padding: 32px;
  }

  .form-header {
    margin-bottom: 32px;
    border-bottom: 1px solid #f1f5f9;
    padding-bottom: 20px;

    .form-title {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 8px;
    }

    .form-subtitle {
      font-size: 14px;
      color: #64748b;
    }
  }

  .article-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .form-item {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .form-label {
      font-size: 14px;
      font-weight: 600;
      color: #475569;
      
      &.required::after {
        content: '*';
        color: #ef4444;
        margin-left: 4px;
      }
    }
  }

  .custom-input, .custom-textarea {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.2s;
    outline: none;

    &:focus {
      border-color: #5e7ce0;
      box-shadow: 0 0 0 3px rgba(94, 124, 224, 0.1);
    }
    
    &::placeholder {
      color: #94a3b8;
    }
  }

  // 富文本编辑器样式
  .editor-wrapper {
    :deep(.quill-editor) {
      min-height: 400px;
      display: flex;
      flex-direction: column;

      .ql-toolbar {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        border-color: #e2e8f0;
        background: #f8fafc;
      }

      .ql-container {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
        border-color: #e2e8f0;
        flex: 1;
        font-family: inherit;
        font-size: 15px;

        .ql-editor {
          min-height: 350px;
          line-height: 1.6;
          
          &.ql-blank::before {
            color: #94a3b8;
            font-style: normal;
          }
        }
      }
    }
  }

  .upload-zone {
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    padding: 32px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: #5e7ce0;
      background: rgba(94, 124, 224, 0.02);
    }

    .upload-trigger {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      color: #64748b;

      .upload-icon {
        font-size: 24px;
        color: #94a3b8;
      }
    }

    .upload-tip {
      font-size: 12px;
      color: #94a3b8;
      margin-top: 12px;
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #f1f5f9;

    .btn {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary {
      background: #fff;
      border: 1px solid #e2e8f0;
      color: #64748b;

      &:hover {
        background: #f8fafc;
        border-color: #cbd5e1;
      }
    }

    .btn-primary {
      background: #5e7ce0;
      border: 1px solid #5e7ce0;
      color: #fff;

      &:hover {
        background: #4a66cc;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}

// 成功模态框样式
.status-modal {
  :deep(.devui-modal) {
    border-radius: 20px !important;
    overflow: hidden !important;
    border: none !important;
    box-shadow: 0 25px 50px -12px rgba(94, 124, 224, 0.25) !important;
  }
  
  :deep(.devui-modal-header) {
    display: none !important;
  }
  
  :deep(.devui-modal-body) {
    padding: 0 !important;
  }

  .status-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 60px 40px 48px;
    text-align: center;

    .status-circle {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 24px;
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        inset: -10px;
        border: 2px solid #10b981;
        border-radius: 50%;
        opacity: 0.2;
        animation: pulse 2s infinite;
      }
    }

    h3 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 12px;
      letter-spacing: 0.5px;
    }

    p {
      font-size: 15px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 36px;
      max-width: 320px;
    }

    .btn-confirm {
      width: 160px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
      border-radius: 12px;
      background: #5e7ce0 !important;
      border-color: #5e7ce0 !important;
      color: #ffffff !important;
      box-shadow: 0 8px 16px rgba(94, 124, 224, 0.3);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

      &:hover {
        background: #4a66cc !important;
        transform: translateY(-2px);
        box-shadow: 0 12px 20px rgba(94, 124, 224, 0.4);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }

  // 紧凑型长方形确认弹窗 (强制居中版)
  .compact-confirm-modal {
    :deep(.devui-modal) {
      border-radius: 12px !important;
      overflow: hidden !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    }
    
    :deep(.devui-modal-header), :deep(.devui-modal-body) {
      padding: 0 !important;
    }

    .compact-confirm-content {
      padding: 40px !important;
      background: #fff !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      text-align: center !important;

      .confirm-main {
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 16px !important;
        margin-bottom: 32px !important;
        width: 100% !important;

        .main-icon {
          margin-bottom: 8px !important;
        }

        .text-wrap {
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          width: 100% !important;

          .confirm-title {
            font-size: 18px !important;
            font-weight: 700 !important;
            color: #0f172a !important;
            margin: 0 0 12px 0 !important;
            letter-spacing: -0.01em !important;
            width: 100% !important;
          }
          .confirm-desc {
            font-size: 14px !important;
            color: #475569 !important;
            margin: 0 !important;
            line-height: 1.6 !important;
            max-width: 280px !important;
            display: inline-block !important;
          }
        }
      }

      .confirm-footer {
        display: flex !important;
        justify-content: center !important;
        gap: 12px !important;
        width: 100% !important;

        button {
          flex: 1 !important;
          max-width: 140px !important;
          height: 40px !important;
          border-radius: 8px !important;
          font-size: 14px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
          border: none !important;
        }

        .btn-plain {
          background: #f1f5f9 !important;
          color: #475569 !important;
          &:hover {
            background: #e2e8f0 !important;
            color: #1e293b !important;
          }
        }

        .btn-solid {
          background: #0f172a !important;
          color: #fff !important;
          &:hover {
            background: #000 !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(15, 23, 42, 0.15) !important;
          }
        }
      }
    }
  }

  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.2; }
    50% { transform: scale(1.15); opacity: 0.1; }
    100% { transform: scale(1); opacity: 0.2; }
  }
}
</style>
