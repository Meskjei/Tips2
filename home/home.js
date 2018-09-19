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
    page: 0 //当前加载的页
  },
  /**
   * 分页加载
   */
  getDataPerPage: function(){
    let that = this;
    let Product = new wx.BaaS.TableObject(app.globalData.tableID.tips);
    Product.limit(20).offset(this.data.page).find().then(res => {
      //判断是否有下一页
      that.data.hasNext = res.data.meta.next == null ? false : true;
      if(that.data.hasNext){
        that.data.page += 20;
      }
      //进一步处理获取到的数据使之能被瀑布流插件使用
      let tipObjArr = [];
      res.data.objects.map((item, index) => {
        tipObjArr.unshift(item.tipObj);
      });
      that.setData({
        dataSet: tipObjArr
      });
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
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.data.page = 0;
    this.getDataPerPage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('foo');
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