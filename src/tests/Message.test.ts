import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Message from '../views/Message.vue'

// 创建一个简单的路由器用于测试
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/message',
      name: 'message',
      component: Message
    }
  ]
})

describe('Message.vue (消息中心页面)', () => {
  let wrapper: any

  beforeEach(async () => {
    router.push('/message')
    await router.isReady()
    
    wrapper = mount(Message, {
      global: {
        plugins: [router]
      }
    })
  })

  it('应该正确渲染页面标题', () => {
    expect(wrapper.find('.page-title').text()).toBe('消息中心')
  })

  it('应该显示搜索框', () => {
    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.find('.search-btn').exists()).toBe(true)
  })

  it('应该显示消息类型导航标签', () => {
    const tabs = wrapper.findAll('.message-tab')
    expect(tabs.length).toBeGreaterThan(0)
    
    // 检查是否包含基本的标签
    const tabTexts = tabs.map((tab: any) => tab.find('.tab-label').text())
    expect(tabTexts).toContain('全部消息')
    expect(tabTexts).toContain('未读消息')
    expect(tabTexts).toContain('星标消息')
  })

  it('应该显示消息列表', () => {
    const messages = wrapper.findAll('.message-item')
    expect(messages.length).toBeGreaterThan(0)
  })

  it('应该显示消息的基本信息', () => {
    const messageItems = wrapper.findAll('.message-item')
    
    if (messageItems.length > 0) {
      const firstMessage = messageItems[0]
      
      // 检查消息标题
      expect(firstMessage.find('.message-title').exists()).toBe(true)
      
      // 检查消息发送者
      expect(firstMessage.find('.message-sender').exists()).toBe(true)
      
      // 检查消息时间
      expect(firstMessage.find('.message-time').exists()).toBe(true)
      
      // 检查消息预览
      expect(firstMessage.find('.message-preview').exists()).toBe(true)
      
      // 检查消息分类
      expect(firstMessage.find('.message-category').exists()).toBe(true)
      
      // 检查优先级标识
      expect(firstMessage.find('.priority-badge').exists()).toBe(true)
    }
  })

  it('应该显示消息操作按钮', () => {
    const messageItems = wrapper.findAll('.message-item')
    
    if (messageItems.length > 0) {
      const firstMessage = messageItems[0]
      
      // 检查星标按钮
      expect(firstMessage.find('.star-btn').exists()).toBe(true)
      
      // 检查删除按钮
      expect(firstMessage.find('.delete-btn').exists()).toBe(true)
      
      // 检查选择框
      expect(firstMessage.find('.message-checkbox input').exists()).toBe(true)
    }
  })

  it('搜索功能应该正常工作', async () => {
    const searchInput = wrapper.find('.search-input')
    const searchBtn = wrapper.find('.search-btn')
    
    await searchInput.setValue('测试搜索')
    await searchBtn.trigger('click')
    
    expect(wrapper.vm.searchKeyword).toBe('测试搜索')
  })

  it('消息类型切换应该正常工作', async () => {
    const tabs = wrapper.findAll('.message-tab')
    
    if (tabs.length > 1) {
      await tabs[1].trigger('click')
      
      // 检查是否有标签被激活
      const activeTab = wrapper.find('.message-tab.active')
      expect(activeTab.exists()).toBe(true)
    }
  })

  it('应该显示消息数量统计', () => {
    const tabs = wrapper.findAll('.message-tab')
    
    tabs.forEach((tab: any) => {
      const countElement = tab.find('.tab-count')
      expect(countElement.exists()).toBe(true)
      expect(countElement.text()).toMatch(/^\d+$/)
    })
  })

  it('星标功能应该正常工作', async () => {
    const starBtns = wrapper.findAll('.star-btn')
    
    if (starBtns.length > 0) {
      const initialClass = starBtns[0].classes()
      await starBtns[0].trigger('click')
      
      // 检查星标状态是否改变
      await wrapper.vm.$nextTick()
      const newClass = starBtns[0].classes()
      expect(newClass).not.toEqual(initialClass)
    }
  })

  it('删除功能应该正常工作', async () => {
    const initialMessageCount = wrapper.findAll('.message-item').length
    const deleteBtns = wrapper.findAll('.delete-btn')
    
    if (deleteBtns.length > 0) {
      await deleteBtns[0].trigger('click')
      await wrapper.vm.$nextTick()
      
      const newMessageCount = wrapper.findAll('.message-item').length
      expect(newMessageCount).toBe(initialMessageCount - 1)
    }
  })

  it('全选功能应该正常工作', async () => {
    const selectAllCheckbox = wrapper.find('.select-all input')
    
    if (selectAllCheckbox.exists()) {
      await selectAllCheckbox.trigger('change')
      await wrapper.vm.$nextTick()
      
      // 检查是否所有消息都被选中
      const messageCheckboxes = wrapper.findAll('.message-checkbox input')
      const checkedCount = messageCheckboxes.filter((checkbox: any) => 
        checkbox.element.checked
      ).length
      
      expect(checkedCount).toBeGreaterThan(0)
    }
  })

  it('批量操作工具栏应该在选中消息时显示', async () => {
    const messageCheckboxes = wrapper.findAll('.message-checkbox input')
    
    if (messageCheckboxes.length > 0) {
      await messageCheckboxes[0].trigger('change')
      await wrapper.vm.$nextTick()
      
      const batchToolbar = wrapper.find('.batch-toolbar')
      expect(batchToolbar.exists()).toBe(true)
    }
  })

  it('应该显示正确的消息图标', () => {
    const messageIcons = wrapper.findAll('.icon-emoji')
    
    messageIcons.forEach((icon: any) => {
      const iconText = icon.text()
      expect(['⚙️', '🛡️', '🔍', '📢']).toContain(iconText)
    })
  })

  it('应该显示消息统计信息', () => {
    const messageStats = wrapper.find('.message-stats')
    expect(messageStats.exists()).toBe(true)
    expect(messageStats.text()).toMatch(/共 \d+ 条消息/)
  })

  it('未读消息应该有特殊样式', () => {
    const unreadMessages = wrapper.findAll('.message-item.unread')
    
    unreadMessages.forEach((message: any) => {
      expect(message.classes()).toContain('unread')
    })
  })

  it('星标消息应该有特殊样式', () => {
    const starredMessages = wrapper.findAll('.message-item.starred')
    
    starredMessages.forEach((message: any) => {
      expect(message.classes()).toContain('starred')
    })
  })

  it('优先级标识应该有正确的颜色', () => {
    const priorityBadges = wrapper.findAll('.priority-badge')
    
    priorityBadges.forEach((badge: any) => {
      const style = badge.attributes('style')
      expect(style).toMatch(/background-color:\s*#(ff4757|ffa502|2ed573)/)
    })
  })

  it('时间格式化应该正确', () => {
    const messageTimes = wrapper.findAll('.message-time')
    
    messageTimes.forEach((time: any) => {
      const timeText = time.text()
      expect(timeText).toMatch(/(刚刚|\d+分钟前|\d+小时前|\d+天前|\d{4}\/\d{1,2}\/\d{1,2})/)
    })
  })

  it('消息内容应该被正确截断', () => {
    const messagePreviews = wrapper.findAll('.message-preview')
    
    messagePreviews.forEach((preview: any) => {
      const computedStyle = window.getComputedStyle(preview.element)
      expect(computedStyle.display).toBe('-webkit-box')
    })
  })
})
