/**
 * Customer Service Page
 * @file pages/customer/customer.js
 * @description Customer service contact page
 * @see PRD.md Story 2 - 创建页面四文件结构
 */

Page({
  /**
   * Page initial data
   */
  data: {
    customerPhone: '400-123-4567',
    wechatId: 'companionservice',
    serviceHours: '周一至周日 9:00-22:00'
  },

  /**
   * Page load event
   */
  onLoad: function () {
    console.log('[Customer] Page loaded');
  },

  /**
   * Make phone call
   */
  onPhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.customerPhone,
      fail: (err) => {
        wx.showToast({
          title: '拨打失败',
          icon: 'none'
        });
        console.error('[Customer] Phone call failed:', err);
      }
    });
  },

  /**
   * Copy WeChat ID
   */
  onCopyWechatId: function () {
    wx.setClipboardData({
      data: this.data.wechatId,
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success'
        });
      },
      fail: () => {
        wx.showToast({
          title: '复制失败',
          icon: 'none'
        });
      }
    });
  },

  /**
   * Navigate back to home
   */
  onBackToHome: function () {
    wx.navigateBack({
      delta: 1
    });
  }
});
