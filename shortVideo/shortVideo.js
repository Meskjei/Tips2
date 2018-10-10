// shortVideo/shortVideo.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasNext: false,  //判断是否有下一页
    offset: 0,  //当前页数
    videos: []  //获取到的视频数组
  },

  /**
   * 分页加载
   */
  getDataPerPage: function() {
    let that = this;
    let Product = new wx.BaaS.TableObject(app.globalData.tableID.videos);
    
    wx.showNavigationBarLoading();
    Product.limit(20).offset(this.data.offset).orderBy('-created_at').find().then(res => {
      //判断是否有下一页
      that.data.hasNext = res.data.meta.next == null ? false : true;
      if (that.data.hasNext) {
        that.data.page += 20;
      }
      console.log(res);
      that.setData({
        videos: that.data.videos.concat(res.data.objects)
      });
      wx.hideNavigationBarLoading();

    }, err => {
      wx.showToast({
        title: '网络故障',
      });
    });
  },
  /**
   * 点击视频前往详情页
   */
  toDetail: function(event){
    let index = event.currentTarget.dataset.index;
    app.globalData.tapVideo = this.data.videos[index];
    wx.navigateTo({
      url: '../videoDetail/videoDetail'
    });
  },

  /**
   * 点击键盘上的确定键开始搜索
   */
  startSearch: function(event){
    let keyWord = event.detail.value;
    wx.navigateTo({
      url: '../videoSearchDetail/videoSearchDetail?keyword=' + keyWord,
    });
  },

  /**
   * 录制按钮监听函数
   */
  recordVideo: function(event) {
    wx.navigateTo({
      url: '../recordVideo/recordVideo',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDataPerPage();
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
    this.data.videos = [];
    this.getDataPerPage();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if(this.data.hasNext){
      this.getDataPerPage();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})