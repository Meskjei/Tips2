// videoSearchDetail/videoSearchDetail.js
let utils = require('../libs/utils.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videosData: []  //搜索得到的视频数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取到关键字
    let keyWord = options.keyWord;
    let locationQuery = new wx.BaaS.Query();
    locationQuery.contains('locationName', keyWord);
    let typesQuery = new wx.BaaS.Query();
    typesQuery.contains('selectedVideoTypes', keyWord);
    let orQuery = new wx.BaaS.Query.or(locationQuery, typesQuery);
    utils.searchData(app.globalData.tableID.video, res=>{
      that.setData({
        videosData: res.data.objects
      });
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