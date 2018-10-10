// my/my.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uesrInfo: {}, //用户信息
    tipOptionUrl: '../img/tip2.png',  //tip选项卡图片路径
    videoOptionUrl: '../img/videoOption2.png', //video选项卡图片路径
    currentOptions: 0, //当前选项卡索引值
    hasNext: false,  //判断是否还有数据可以加载
    offset: 0,
    dataSet: [],  //瀑布流插件数据
    videos: []  //短视频数据
  },
  /**
   * 为选项卡设置监听
   */
  switchOptions: function(event){
    let index = event.currentTarget.dataset.index;
    if(index == 0){
      this.setData({
        currentOptions: index,
        tipOptionUrl: '../img/tip1.png',
        videoOptionUrl: '../img/videoOption2.png'
      });
      this.data.dataSet = [];
      this.getDataPerPage();
    } else {
      this.setData({
        currentOptions: index,
        tipOptionUrl: '../img/tip2.png',
        videoOptionUrl: '../img/videoOption1.png'
      });
      this.data.videos = [];
      this.getDataPerPage();
    }
  },

  /**
 * 分页加载
 */
  getDataPerPage: function () {
    let that = this;
    let tableID = this.data.currentOptions == 0 ? app.globalData.tableID.tips : app.globalData.tableID.videos;
    let Product = new wx.BaaS.TableObject(tableID);
    let query = new wx.BaaS.Query();
    query.compare('created_by', '=', this.data.userInfo.id);

    wx.showNavigationBarLoading();
    Product.limit(20).setQuery(query).offset(this.data.offset).orderBy('-created_at').find().then(res => {
      //判断是否有下一页
      that.data.hasNext = res.data.meta.next == null ? false : true;
      if (that.data.hasNext) {
        that.data.page += 20;
      }
      console.log(res);
      if(that.data.currentOptions == 0){
        let tipObjArr = [];
        res.data.objects.map((item, index) => {
          tipObjArr.push(item.tipObj);
        });
        that.setData({
          dataSet: that.data.dataSet.concat(tipObjArr)
        });
        console.log(that.data);
      } else {
        that.setData({
          videos: that.data.videos.concat(res.data.objects)
        });
      }
      
      wx.hideNavigationBarLoading();

    }, err => {
      wx.showToast({
        title: '网络故障',
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    });
    console.log(this.data.userInfo);
    this.getDataPerPage();
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
    if(this.data.hasNext){
      this.getDataPerPage();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})