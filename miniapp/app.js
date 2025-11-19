/**
 * Mini-Program Entry Point
 * @file app.js
 * @description Application lifecycle management and global data
 * @see TECH_DESIGN.md Section 1 (System Architecture)
 */

const { APP_CONFIG } = require('./utils/config');

App({
  /**
   * Application launch
   * Called when mini-program initialization is complete
   */
  onLaunch: function () {
    // Log app launch
    if (APP_CONFIG.debug) {
      console.log(`[App] ${APP_CONFIG.name} v${APP_CONFIG.version} launched`);
    }

    // Check for updates (WeChat automatic update mechanism)
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              updateManager.applyUpdate();
            }
          }
        });
      });
    }
  },

  /**
   * Application show
   * Called when mini-program enters foreground
   */
  onShow: function () {
    if (APP_CONFIG.debug) {
      console.log('[App] Show');
    }
  },

  /**
   * Application hide
   * Called when mini-program enters background
   */
  onHide: function () {
    if (APP_CONFIG.debug) {
      console.log('[App] Hide');
    }
  },

  /**
   * Global data
   * Shared across all pages
   */
  globalData: {
    userInfo: null,
    systemInfo: null
  }
});
