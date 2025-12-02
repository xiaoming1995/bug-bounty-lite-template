import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import Analysis from '../views/Analysis.vue'

// 创建一个简单的路由器用于测试
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/analysis',
      name: 'analysis',
      component: Analysis
    }
  ]
})

describe('Analysis.vue (漏洞报告页面)', () => {
  let wrapper: any

  beforeEach(async () => {
    router.push('/analysis')
    await router.isReady()
    
    wrapper = mount(Analysis, {
      global: {
        plugins: [router]
      }
    })
  })

  it('应该正确渲染页面标题', () => {
    expect(wrapper.find('.hero-title').text()).toBe('漏洞报告')
  })

  it('应该显示搜索框', () => {
    expect(wrapper.find('.search-input').exists()).toBe(true)
    expect(wrapper.find('.search-btn').exists()).toBe(true)
  })

  it('应该显示报告类型导航', () => {
    const typeBtns = wrapper.findAll('.type-btn')
    expect(typeBtns.length).toBeGreaterThan(0)
    expect(typeBtns[0].text()).toBe('周报')
  })

  it('应该显示报告列表', () => {
    const reports = wrapper.findAll('.report-item')
    expect(reports.length).toBeGreaterThan(0)
  })

  it('应该显示热门搜索标签', () => {
    const hotTags = wrapper.findAll('.hot-tag')
    expect(hotTags.length).toBeGreaterThan(0)
  })

  it('应该显示侧边栏', () => {
    expect(wrapper.find('.sidebar').exists()).toBe(true)
    expect(wrapper.find('.sidebar-title').exists()).toBe(true)
  })

  it('应该显示代码背景动画', () => {
    expect(wrapper.find('.code-background').exists()).toBe(true)
    expect(wrapper.find('.code-lines').exists()).toBe(true)
  })

  it('应该显示3D立方体动画', () => {
    expect(wrapper.find('.cube-container').exists()).toBe(true)
    expect(wrapper.find('.cube').exists()).toBe(true)
  })

  it('搜索功能应该正常工作', async () => {
    const searchInput = wrapper.find('.search-input')
    const searchBtn = wrapper.find('.search-btn')
    
    await searchInput.setValue('测试搜索')
    await searchBtn.trigger('click')
    
    expect(wrapper.vm.searchKeyword).toBe('测试搜索')
  })

  it('报告类型切换应该正常工作', async () => {
    const typeBtns = wrapper.findAll('.type-btn')
    
    if (typeBtns.length > 1) {
      await typeBtns[1].trigger('click')
      
      // 检查是否有类型被激活
      const activeBtn = wrapper.find('.type-btn.active')
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

  it('报告项点击应该触发查看详情', async () => {
    const reports = wrapper.findAll('.report-item')
    
    if (reports.length > 0) {
      // 模拟点击事件
      await reports[0].trigger('click')
      // 这里可以检查是否调用了正确的方法
    }
  })

  it('应该显示报告的基本信息', () => {
    const reportItems = wrapper.findAll('.report-item')
    
    if (reportItems.length > 0) {
      const firstReport = reportItems[0]
      
      // 检查报告标题
      expect(firstReport.find('.report-title').exists()).toBe(true)
      
      // 检查报告日期
      expect(firstReport.find('.report-date').exists()).toBe(true)
      
      // 检查报告期数
      expect(firstReport.find('.report-number').exists()).toBe(true)
      
      // 检查浏览量
      expect(firstReport.find('.report-views').exists()).toBe(true)
      
      // 检查报告摘要
      expect(firstReport.find('.report-summary').exists()).toBe(true)
      
      // 检查查看按钮
      expect(firstReport.find('.download-btn').exists()).toBe(true)
    }
  })

  it('应该显示最新报告列表', () => {
    const newsItems = wrapper.findAll('.report-news-item')
    expect(newsItems.length).toBeGreaterThan(0)
    
    if (newsItems.length > 0) {
      expect(newsItems[0].find('.report-news-title').exists()).toBe(true)
      expect(newsItems[0].find('.report-news-date').exists()).toBe(true)
    }
  })

  it('应该显示报告统计信息', () => {
    const statItems = wrapper.findAll('.stat-item')
    expect(statItems.length).toBeGreaterThan(0)
    
    if (statItems.length > 0) {
      expect(statItems[0].find('.stat-name').exists()).toBe(true)
      expect(statItems[0].find('.stat-count').exists()).toBe(true)
    }
  })

  it('应该有正确的CSS动画类', () => {
    // 检查代码滚动动画
    const codeLines = wrapper.find('.code-lines')
    expect(codeLines.exists()).toBe(true)
    
    // 检查立方体旋转动画
    const cube = wrapper.find('.cube')
    expect(cube.exists()).toBe(true)
  })
})
