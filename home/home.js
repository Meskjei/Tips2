// home/home.js
let utils = require('../libs/utils.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipTypes: ['全部','美食', '出行', '居住', '办事', '购物', '其他'],
    keyWord: '',
    currentIndex: 0, //当前选择的类型的索引
    dataSet: [] //瀑布流组件使用的数据
  },
  /**
   * 添加按钮的点击事件监听函数
   */
  toNewTip: function(event){
    wx.navigateTo({
      url: '../newTip/newTip',
    });
  },
  /**
   * 为类型选择器添加监听事件
   */
  changeType: function(event){
    let index = event.currentTarget.dataset.index;
    this.setData({currentIndex: index});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    let that = this;
    //获取数据
    utils.searchData(app.globalData.tableID.tips, undefined, res => {
      let tipObjArr = [];
      res.data.objects.map((item, index) => {
        tipObjArr.push(item.tipObj);
      });
      that.setData({
        dataSet: tipObjArr
      });
    });
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