// submitVideo/submitVideo.js
let app = getApp();
// 引入SDK核心类
let QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
let qqmapsdk;
let utils = require('../libs/utils.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    video: {}, //录制好的视频对象
    locationName: '', //选择的地名
    currentLocation: {}, //目前的地址对象
    videoTypes: ['美食', '出行', '居住', '办事', '购物', '其他'],  //视频类型
    selectedVideoTypes: []  //被选择的视频类型
  },

  /**
   * 为video类型选择器设置更改监听
   */
  videoTypeSelected: function (event) {
    let index = event.detail.value;
    let currentType = this.data.videoTypes[index];
    if (this.data.selectedVideoTypes.indexOf(currentType) != -1) {
      wx.showToast({
        title: '已经添加',
      });
      return;
    } else {
      this.data.selectedVideoTypes.push(currentType);
      this.setData({
        selectedVideoTypes: this.data.selectedVideoTypes
      });
    }
  },

  /**
   * 为TipType的删除按钮添加监听
   */
  deleteVideoType: function (event) {
    let index = event.currentTarget.dataset.index;
    this.data.selectedVideoTypes.splice(index, 1);
    this.setData({
      selectedVideoTypes: this.data.selectedVideoTypes
    });
  },

  /**
   * 选择位置
   */
  chooseLocation: function(event) {
    let that = this;
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          locationName: res.name,
          currentLocation: {
            latitude: res.latitude,
            longitude: res.longitude
          }
        });
      },
    });
  },

  /**
   * 将坐标转换为地名
   */
  formatPosition: function() {
    let that = this;
    qqmapsdk.reverseGeocoder({
      location: this.data.currentLocation,
      success: res => {
        that.setData({
          locationName: res.result.formatted_addresses.recommend,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    this.setData({
      video: app.globalData.video
    });
    //初始化腾讯地图SDK
    qqmapsdk = new QQMapWX({
      key: app.globalData.tencentMapKey
    });
    //获取用户地址
    wx.getLocation({
      success: function(res) {
        that.data.currentLocation = {
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.formatPosition();
      },
    });
    console.log(this.data.video);
  },
  /**
   * 点击提交按钮的事件监听
   */
  formSubmit: function(event) {
    let that = this;
    let title = event.detail.value['videoTitle'];
    let detail = event.detail.value['detail'];
    let selectedVideoTypes = this.data.selectedVideoTypes;
    //检测标题是否为空
    if(title.length == 0 || selectedVideoTypes.length == 0){
      wx.showToast({
        title: '内容不得为空',
      });
      return;
    }
    //检测title是否违规
    wx.showLoading({
      title: '请稍后',
    });
    wx.BaaS.wxCensorText(title + ' ' + detail).then(res => {
      console.log(res.data.risky)
      if (res.data.risky) {
        wx.hideLoading();
        wx.showToast({
          title: '标题存在违规内容',
        });
        return;
      } else {
        that.uploadData(title, selectedVideoTypes, detail);
      }
    }, err => {
      console.log('err');
    });
  },
  /**
   * 上传数据
   */
  uploadData: function(title, selectedVideoTypes, detail){
    let that = this;
    let userInfo = app.globalData.userInfo;
    let tempVideoObj = {};
    //初始化tempVideoObj
    tempVideoObj.title = title;
    tempVideoObj.detail = detail;
    tempVideoObj.location = this.data.currentLocation;
    tempVideoObj.userInfo = {
      avatar: userInfo.avatarUrl,
      username: userInfo.nickName
    }
    //上传视频
    utils.uploadFile(this.data.video.videoPath ,(res)=>{
      tempVideoObj.videoPath = res.data.path;
      //上传视频封面
      utils.uploadFile(that.data.video.videoCoverPath, (res)=>{
        tempVideoObj.videoCoverPath = res.data.path;
        utils.createRecord(app.globalData.tableID.videos, { video: tempVideoObj, locationName: that.data.locationName, selectedVideoTypes: selectedVideoTypes }, (res) => {
          console.log(res);
          wx.switchTab({
            url: '../shortVideo/shortVideo',
            success: () => {
              wx.showToast({
                title: '提交成功',
              });
            }
          });
        });
      });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})