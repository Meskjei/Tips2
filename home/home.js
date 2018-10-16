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
    offset: 0, //当前的偏移量
    currentQuery: {},  //当前要查询的Tip类型query
    currentTip: {},  //当前点击的tip对象
    isDetailOpen: false, //判断详情页是否打开
    keyWord: '' //搜索关键词
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
    Product.limit(20).setQuery(query).offset(this.data.offset).orderBy('-created_at').find().then(res => {
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
   * 为卡片点击事件设置监听
   */
  tapCard: function(event){
    let that = this;
    let cardID = event.detail.card_id;
    let worker = wx.createWorker('workers/request/index.js');
    wx.showNavigationBarLoading();
    worker.postMessage({
      cardID: cardID,
      dataSet: this.data.dataSet
    });
    worker.onMessage(res=>{
      wx.hideNavigationBarLoading();
      that.setData({
        currentTip: res.currentTip,
        isDetailOpen: true
      });
      worker.terminate();
    });
  },
  //关闭tip详情
  closeDetail: function(event){
    this.setData({
      isDetailOpen: false
    });
  },
  //阻止遮罩层内子元素的事件冒泡
  stopBubble: function(event){
    return;
  },
  /**
   * 导航去tip地址
   */
  navigation: function(event){
    let that = this;
    let location = that.data.currentTip.location;
    wx.openLocation({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  },

  /**
   * 查看详情中图片大图
   */
  previewImgs: function(event){
    let that = this;
    let index = event.currentTarget.dataset.index;
    let images = that.data.currentTip.images;
    wx.previewImage({
      urls: images,
      current: images[index]
    });
  },

  /**
   * 搜索框输入监听
   */
  saveKeyword: function(event){
    let keyWord = event.detail.value;
    this.data.keyWord = keyWord;
  },
  /**
   * 搜索按钮监听
   */
  startSearch: function(event){
    //清空dataSet数组
    this.data.dataSet = [];
    //初始化查询条件
    let keyWordQuery = new wx.BaaS.Query();
    if(this.data.keyWord.length != 0){
      keyWordQuery.contains('locationName', this.data.keyWord);
    }
    let andQuery = new wx.BaaS.Query.and(keyWordQuery, this.data.currentQuery);
    this.getDataPerPage(andQuery);
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
    wx.stopPullDownRefresh();
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