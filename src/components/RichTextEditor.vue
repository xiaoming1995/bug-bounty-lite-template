<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

interface Props {
  modelValue: string
  placeholder?: string
  height?: string
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '请输入内容...',
  height: '350px'
})

const emit = defineEmits<Emits>()

const editorRef = ref<HTMLDivElement>()
const content = ref(props.modelValue)
const isComposing = ref(false)
const showUploadArea = ref(false)

// 监听内容变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value && editorRef.value) {
    content.value = newValue
    editorRef.value.innerHTML = newValue
  }
})

// 处理内容变化
const handleInput = () => {
  if (!isComposing.value && editorRef.value) {
    const html = editorRef.value.innerHTML
    content.value = html
    emit('update:modelValue', html)
  }
}

// 处理中文输入
const handleCompositionStart = () => {
  isComposing.value = true
}

const handleCompositionEnd = () => {
  isComposing.value = false
  handleInput()
}

// 插入模板内容
const insertTemplate = () => {
  const template = `<p><strong>1. 发现方式：</strong>请尽量详细描述，保留现场/截图/重现方法等等</p>
<p><br></p>
<p><strong>2. 漏洞证明：</strong>请在这里写POC</p>
<p><br></p>
<p><strong>3. 修复方案：</strong>请提供大致的修复方案</p>
<div class="upload-placeholder">
  <div class="upload-placeholder-content">
    <div class="upload-icon">📁</div>
    <p>请将附件拖放到此处或点击上传</p>
    <div class="upload-info">
      <p>支持格式：jpg/png/gif/pdf/doc/docx</p>
      <p>文件大小：最大10MB</p>
      <p>最多上传5个文件</p>
    </div>
  </div>
</div>`

  if (editorRef.value) {
    editorRef.value.innerHTML = template
    content.value = template
    emit('update:modelValue', template)
  }
}

// 处理文件上传
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    // 这里可以处理文件上传逻辑
    console.log('上传文件:', files)
    showUploadArea.value = false
  }
}

// 切换上传区域显示
const toggleUploadArea = () => {
  showUploadArea.value = !showUploadArea.value
}

onMounted(() => {
  if (editorRef.value) {
    // 如果没有内容，插入模板
    if (!props.modelValue) {
      insertTemplate()
    } else {
      editorRef.value.innerHTML = props.modelValue
    }
  }
})
</script>

<template>
  <div class="vulnerability-details-editor">
    <!-- 工具栏 -->
    <div class="editor-toolbar">
      <div class="toolbar-left">
        <button
          class="toolbar-btn search-btn"
          title="搜索"
        >
          🔍
        </button>
        <button
          class="toolbar-btn image-btn"
          @click="toggleUploadArea"
          title="上传图片"
        >
          📷
        </button>
      </div>

      <div class="toolbar-right">
        <select class="code-language-select">
          <option value="Code语言">Code语言</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="php">PHP</option>
          <option value="sql">SQL</option>
        </select>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container">
      <div
        ref="editorRef"
        class="editor-content"
        contenteditable="true"
        :style="{ minHeight: props.height }"
        @input="handleInput"
        @compositionstart="handleCompositionStart"
        @compositionend="handleCompositionEnd"
        :data-placeholder="props.placeholder"
      ></div>

      <!-- 上传区域 -->
      <div v-if="showUploadArea" class="upload-overlay">
        <div class="upload-content">
          <div class="upload-icon">📁</div>
          <p>请将图片拖放到此处或点击上传</p>
          <input
            type="file"
            accept="image/*"
            @change="handleFileUpload"
            style="display: none;"
            ref="fileInput"
          />
          <d-button
            bs-style="primary"
            bs-size="sm"
            @click="($refs.fileInput as HTMLInputElement)?.click()"
          >
            选择文件
          </d-button>
          <d-button
            bs-style="text"
            bs-size="sm"
            @click="showUploadArea = false"
            style="margin-left: 8px;"
          >
            取消
          </d-button>
        </div>
      </div>
    </div>

    <!-- 底部信息栏 -->
    <div class="editor-footer">
      <div class="footer-left">
        <span class="element-info">元素限长: body > p</span>
      </div>
      <div class="footer-right">
        <span class="word-count">
          当前已输入64个字符，您还可以输入9936个字符。
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.vulnerability-details-editor {
  border: 2px solid #ff4444;
  border-radius: 4px;
  background: white;
  position: relative;

  .editor-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 8px;

      .toolbar-btn {
        background: none;
        border: none;
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        color: #666;
        transition: all 0.2s ease;

        &:hover {
          background: #e9ecef;
          color: #333;
        }

        &.search-btn {
          font-size: 16px;
        }

        &.image-btn {
          font-size: 16px;
        }
      }
    }

    .toolbar-right {
      .code-language-select {
        padding: 4px 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: white;
        font-size: 12px;
        color: #666;
        cursor: pointer;
        min-width: 80px;

        &:focus {
          outline: none;
          border-color: #ff4444;
        }
      }
    }
  }

  .editor-container {
    position: relative;

    .editor-content {
      padding: 16px;
      min-height: 300px;
      max-height: none;
      font-size: 14px;
      line-height: 1.6;
      outline: none;
      background: white;
      overflow-y: auto;

      &:empty::before {
        content: attr(data-placeholder);
        color: #999;
        font-style: italic;
      }

      &:focus {
        background: #fefefe;
      }

      p {
        margin: 12px 0;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 0;
        }

        strong {
          font-weight: 600;
          color: #333;
        }
      }

      h1, h2, h3, h4, h5, h6 {
        margin: 20px 0 12px 0;
        font-weight: 600;
        color: #333;

        &:first-child {
          margin-top: 0;
        }
      }

      h3 {
        font-size: 16px;
        color: #2c3e50;
      }

      ul, ol {
        margin: 12px 0;
        padding-left: 24px;

        li {
          margin: 6px 0;
          line-height: 1.5;
        }
      }

      blockquote {
        border-left: 4px solid #e9ecef;
        margin: 16px 0;
        padding: 12px 16px;
        background: #f8f9fa;
        color: #666;
        font-style: italic;
      }

      pre {
        background: #f4f4f4;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 16px;
        margin: 16px 0;
        overflow-x: auto;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.4;
      }

      code {
        background: #f4f4f4;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 13px;
        color: #e83e8c;
      }

      img {
        max-width: 100%;
        height: auto;
        margin: 12px 0;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      a {
        color: #007bff;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
          color: #0056b3;
        }
      }

      // 选中状态样式
      ::selection {
        background: #b3d4fc;
        color: #333;
      }

      // 上传占位符样式
      .upload-placeholder {
        margin: 20px 0;
        border: 2px dashed #d9d9d9;
        border-radius: 8px;
        background: #fafafa;

        .upload-placeholder-content {
          padding: 40px 20px;
          text-align: center;

          .upload-icon {
            font-size: 48px;
            margin-bottom: 16px;
            color: #999;
          }

          p {
            margin: 8px 0;
            color: #666;
            font-size: 14px;

            &:first-of-type {
              font-size: 16px;
              color: #333;
              margin-bottom: 16px;
            }
          }

          .upload-info {
            margin-top: 16px;

            p {
              font-size: 12px;
              color: #999;
              margin: 4px 0;
            }
          }
        }

        &:hover {
          border-color: #ff4444;
          background: #fff5f5;
          cursor: pointer;
        }
      }
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;

      .upload-content {
        text-align: center;
        padding: 40px;
        border: 2px dashed #ccc;
        border-radius: 8px;
        background: white;

        .upload-icon {
          font-size: 48px;
          margin-bottom: 16px;
        }

        p {
          margin: 16px 0;
          color: #666;
          font-size: 14px;
        }
      }
    }
  }

  .editor-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 12px;

    .footer-left {
      .element-info {
        font-weight: 500;
        color: #333;
      }
    }

    .footer-right {
      .word-count {
        color: #666;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .vulnerability-details-editor {
    .editor-toolbar {
      flex-direction: column;
      gap: 8px;
      align-items: stretch;

      .toolbar-left,
      .toolbar-right {
        justify-content: center;
      }
    }

    .editor-container {
      .editor-content {
        padding: 12px;
        font-size: 13px;
        min-height: 250px;
      }
    }

    .editor-footer {
      flex-direction: column;
      gap: 4px;
      text-align: center;
    }
  }
}
</style>
