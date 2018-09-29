// videoSearchDetail/videoSearchDetail.js
let utils = require('../libs/utils.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videosData: [], //搜索得到的视频数据
    hasNext: false, //判断是否还有数据
    currentQuery: null, //当前搜索所用的query
    currentKeyWord: '', //当前关键字
    offset: 0 //当前偏移量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //获取到关键字
    let keyWord = options.keyword;
    this.data.currentKeyWord = keyWord;
    this.getSearchDataPerPage(this.data.currentKeyWord);
  },

  /**
   * 获取Query
   */
  getQuery: function(keyWord) {
    if (this.data.currentQuery == null) {
      let locationQuery = new wx.BaaS.Query();
      locationQuery.contains('locationName', keyWord);
      let typesQuery = new wx.BaaS.Query();
      typesQuery.in('selectedVideoTypes', [keyWord]);
      let titleQuery = new wx.BaaS.Query();
      titleQuery.contains('detail', keyWord);
      let detailQuery = new wx.BaaS.Query();
      detailQuery.contains('title', keyWord);
      let orQuery = new wx.BaaS.Query.or(locationQuery, typesQuery, titleQuery, detailQuery);
      this.data.currentQuery = orQuery;
    }
    return this.data.currentQuery;
  },

  /**
   * 获取搜索结果
   */

  getSearchDataPerPage: function(keyWord) {
    let that = this;
    let query = this.getQuery(keyWord);
    let Product = new wx.BaaS.TableObject(app.globalData.tableID.videos);
    wx.showNavigationBarLoading();
    Product.limit(20).setQuery(query).offset(this.data.offset).orderBy('-created_at').find().then(res => {
      console.log(res);
      that.data.hasNext = res.data.meta.next == null ? false : true;
      if (that.data.hasNext) {
        that.data.offset += 20;
      }
      wx.hideNavigationBarLoading();
      that.setData({
        videosData: that.data.videosData.concat(res.data.objects)
      });
    }, err => {
      wx.showToast({
        title: '网络故障',
      });
    })
  },
  /**
   * 点击视频前往详情页
   */
  toDetail: function(event) {
    let index = event.currentTarget.dataset.index;
    app.globalData.tapVideo = this.data.videosData[index];
    wx.navigateTo({
      url: '../videoDetail/videoDetail'
    });
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
    if(this.data.hasNext){
      this.getSearchDataPerPage(this.data.currentKeyWord);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})