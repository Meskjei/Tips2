// welcome/welcome.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = wx.BaaS.storage.get('userinfo');
    console.log(userInfo);
    console.log(userInfo != "");
    if (userInfo != "" && userInfo != undefined && !this.isEmptyObject(userInfo)) {
       wx.reLaunch({
        url: '../home/home',
        success: ()=>{
          app.globalData.userInfo = userInfo;
          console.log(app.globalData);
        }
      });
    }
  },
  /**
   * 判断对象是否为空
   */
  isEmptyObject: function(obj) {
    for (var key in obj) {
      return false
    };
    return true
  },

  userInfoHandler: function(data) {
    wx.BaaS.handleUserInfo(data).then(res => {
      // res 包含用户完整信息，详见下方描述
      console.log(res);
      app.globalData.userInfo = res;
      wx.reLaunch({
        url: '../home/home',
      });
    }, res => {
      // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})