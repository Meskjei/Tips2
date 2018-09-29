// recordVideo/recordVideo.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnType: '../img/switchCamera.png', //按钮类型
    eventType: 'switchCamera', //按钮事件类型
    isRecording: false, //判断是否正在录制
    video: {}, //录制完的视频对象
    ctx: {}, //相机上下文
    cameraPosition: 'back', //相机位置
    switchCameraAni: {}, //切换镜头动画
  },

  /**
   * 录制或停止录制视频
   */
  recordOrStop: function(event) {
    let that = this;
    if (!this.data.isRecording) {
      //开始录制
      this.data.ctx.startRecord({
        timeoutCallback: res => {
          let video = {
            videoPath: res.tempVideoPath,
            videoCoverPath: res.tempThumbPath
          }
          app.globalData.video = video;
          that.setData({
            isRecording: false,
            btnType: '../img/submit.png',
            eventType: 'submitVideo',
            video: video
          });
        },
        success: () => {
          that.setData({
            isRecording: true,
            btnType: '../img/switchCamera.png',
            eventType: 'switchCamera'
          });
        }
      });
    } else {
      //停止录制
      wx.showLoading({
        title: '请稍后',
      });
      this.data.ctx.stopRecord({
        success: res=>{
          wx.hideLoading();
          let video = {
            videoPath: res.tempVideoPath,
            videoCoverPath: res.tempThumbPath
          }
          app.globalData.video = video;
          that.setData({
            isRecording: false,
            btnType: '../img/submit.png',
            eventType: 'submitVideo',
            video: video
          });
        }
      });
    }
  },
  /**
   * 切换前后摄像头
   */
  switchCamera: function(event){
    let that = this;
    let cameraPosition = this.data.cameraPosition;
    let animation = wx.createAnimation({});
    if(cameraPosition == 'back'){
      animation.rotateY(180).step();
      this.data.switchCameraAni = animation.export();
      this.setData({ 
        cameraPosition: 'front',
        switchCameraAni: that.data.switchCameraAni
      });
    } else {
      animation.rotateY(0).step();
      this.data.switchCameraAni = animation.export();
      this.setData({ 
        cameraPosition: 'back',
        switchCameraAni: that.data.switchCameraAni
      });
    }
  },

  /**
   * 提交视频
   */
  submitVideo: function(event){
    wx.navigateTo({
      url: '../submitVideo/submitVideo',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //初始化相机上下文
    let ctx = wx.createCameraContext();
    this.data.ctx = ctx;
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