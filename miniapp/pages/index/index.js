/**
 * Index Page (Service List)
 * @file pages/index/index.js
 * @description Home page displaying service list
 * @see PRD.md Story 2 - 创建页面四文件结构
 */

const request = require('../../utils/request');

Page({
  /**
   * Page initial data
   */
  data: {
    services: [],
    loading: false,
    error: null
  },

  /**
   * Page load event
   */
  onLoad: function () {
    this.loadServices();
  },

  /**
   * Load service list
   */
  loadServices: function () {
    const that = this;

    // Set loading state
    that.setData({
      loading: true,
      error: null
    });

    // Request service list (Mock mode by default)
    request.get('/services')
      .then(response => {
        that.setData({
          services: response.data,
          loading: false
        });

        if (wx.canIUse('hideLoading')) {
          wx.hideLoading();
        }
      })
      .catch(error => {
        that.setData({
          error: error.message || '加载失败',
          loading: false
        });

        wx.showToast({
          title: error.message || '加载失败',
          icon: 'none'
        });
      });
  },

  /**
   * Navigate to service detail
   * @param {Event} e - Tap event
   */
  onServiceTap: function (e) {
    const serviceId = e.currentTarget.dataset.id;

    // Service detail page deferred to RM-XXX (per PRD scope decision)
    // Show toast notification for now
    wx.showToast({
      title: '服务详情页开发中',
      icon: 'none',
      duration: 2000
    });

    console.log('Navigate to service detail:', serviceId);
  },

  /**
   * Navigate to customer service page
   */
  onCustomerTap: function () {
    wx.navigateTo({
      url: '/pages/customer/customer'
    });
  },

  /**
   * Pull down refresh
   */
  onPullDownRefresh: function () {
    this.loadServices();
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
