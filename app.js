App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    require('libs/sdk-v1.7.0.js');
    let clientID = '223fb3928608af46fa96';
    wx.BaaS.init(clientID);

    
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  },
  globalData: {
    tableID: {
      tips: '52389',
      videos: '52657'
    },
    userInfo: {},
    tencentMapKey: 'WIVBZ-6U4W6-KW7S7-MGXYV-NTTHF-DLFVI',
    video: undefined,
    tapVideo: {}  //在短视频界面点击的视频
  }
})
