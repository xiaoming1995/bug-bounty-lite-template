import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import CNNVD from '../views/CNNVD.vue'

// 创建一个简单的路由器用于测试
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/cnnvd',
      name: 'cnnvd',
      component: CNNVD
    }
  ]
})

describe('CNNVD.vue', () => {
  let wrapper: any

  beforeEach(async () => {
    router.push('/cnnvd')
    await router.isReady()
    
    wrapper = mount(CNNVD, {
      global: {
        plugins: [router]
      }
    })
  })

  it('应该正确渲染页面标题', () => {
    expect(wrapper.find('.hero-title').text()).toBe('CNNVD动态')
  })

  it('应该显示搜索框', () => {
    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.find('.search-btn').exists()).toBe(true)
  })

  it('应该显示分类导航', () => {
    const categoryBtns = wrapper.findAll('.category-btn')
    expect(categoryBtns.length).toBeGreaterThan(0)
    expect(categoryBtns[0].text()).toBe('全部')
  })

  it('应该显示公告列表', () => {
    const announcements = wrapper.findAll('.announcement-item')
    expect(announcements.length).toBeGreaterThan(0)
  })

  it('应该显示热门搜索标签', () => {
    const hotTags = wrapper.findAll('.hot-tag')
    expect(hotTags.length).toBeGreaterThan(0)
  })

  it('应该显示侧边栏', () => {
    expect(wrapper.find('.sidebar').exists()).toBe(true)
    expect(wrapper.find('.sidebar-title').exists()).toBe(true)
  })

  it('搜索功能应该正常工作', async () => {
    const searchInput = wrapper.find('.search-input')
    const searchBtn = wrapper.find('.search-btn')
    
    await searchInput.setValue('测试搜索')
    await searchBtn.trigger('click')
    
    expect(wrapper.vm.searchKeyword).toBe('测试搜索')
  })

  it('分类切换应该正常工作', async () => {
    const categoryBtns = wrapper.findAll('.category-btn')
    
    if (categoryBtns.length > 1) {
      await categoryBtns[1].trigger('click')
      
      // 检查是否有分类被激活
      const activeBtn = wrapper.find('.category-btn.active')
      expect(activeBtn.exists()).toBe(true)
    }
  })

  it('热门标签点击应该更新搜索关键词', async () => {
    const hotTags = wrapper.findAll('.hot-tag')
    
    if (hotTags.length > 0) {
      await hotTags[0].trigger('click')
      expect(wrapper.vm.searchKeyword).toBe(hotTags[0].text())
    }
  })

  it('公告项点击应该触发查看详情', async () => {
    const announcements = wrapper.findAll('.announcement-item')
    
    if (announcements.length > 0) {
      // 模拟点击事件
      await announcements[0].trigger('click')
      // 这里可以检查是否调用了正确的方法
      // 由于我们使用了console.log，在实际应用中应该使用更好的方式来测试
    }
  })
})
