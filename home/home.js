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
    dataSet: [], //瀑布流组件使用的数据
    hasNext: false,  //判断服务器是否还有数据
    page: 0, //当前加载的页
    currentQuery: {}  //当前要查询的Tip类型query
  },
  /**
   * 分页加载
   */
  getDataPerPage: function(query){
    let that = this;
    let Product = new wx.BaaS.TableObject(app.globalData.tableID.tips);
    if(query == undefined){
      query = new wx.BaaS.Query();
    }
    wx.showNavigationBarLoading();
    Product.limit(20).setQuery(query).offset(this.data.page).orderBy('-created_at').find().then(res => {
      //判断是否有下一页
      that.data.hasNext = res.data.meta.next == null ? false : true;
      if(that.data.hasNext){
        that.data.page += 20;
      }
      //进一步处理获取到的数据使之能被瀑布流插件使用
      let tipObjArr = [];
      res.data.objects.map((item, index) => {
        tipObjArr.push(item.tipObj);
      });
      that.setData({
        dataSet: that.data.dataSet.concat(tipObjArr)
      });
      wx.hideNavigationBarLoading();
    
    }, err => {
      wx.showToast({
        title: '网络故障',
      });
    });
  },
  /**
   * 为类型选择器添加监听事件
   */
  changeType: function(event){
    let index = event.currentTarget.dataset.index;
    this.setData({currentIndex: index});
    this.data.dataSet = [];
    let newQuery = new wx.BaaS.Query();
    if(this.data.tipTypes[index] != '全部'){
      newQuery.in('tipTypes', [this.data.tipTypes[index]]);  
    }
    this.data.currentQuery = newQuery;
    this.getDataPerPage(newQuery);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.currentQuery = new wx.BaaS.Query();
    this.getDataPerPage(this.data.currentQuery);
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
    this.data.page = 0;
    this.data.dataSet = [];
    this.getDataPerPage(this.data.currentQuery);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('foo');
    if(this.data.hasNext){
      this.getDataPerPage(this.data.currentQuery);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})