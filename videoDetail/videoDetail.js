// videoDetail/videoDetail.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoData: {} //视频对象
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData.tapVideo);
    this.setData({
      videoData: app.globalData.tapVideo
    });
  },

  /**
   * 导航去tip地址
   */
  navigation: function (event) {
    let that = this;
    let location = that.data.videoData.video.location;
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})