// newTip/newTip.js
let utils = require('../libs/utils.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedPics: [], //选择的图片的临时地址数组
    tipTypes: ['美食', '出行', '居住', '办事', '购物', '其他'],
    pickerIndex: 0, //picker的索引
    selectedTipTypes: [], // 被选择的Tip类型
    uploadedPics: [], //图片上传至服务器后返回的路径
    uploadTimes: 1, //上传图片函数递归次数
    illegalPic: false, //是否存在违规图片
    illegalContent: false, //是否存在违规文字内容
    tipContentBgColor: ['#99cee8', '#62b5dc', '#00b99e', '#feafac', '#f58f3d', '#91ddce', '#00a686', '#d6ab00'] //tip内容的背景颜色
  },
  /**
   * 为添加图片按钮设置点击监听
   */
  selectPics: function(event) {
    let that = this;
    let currentLength = this.data.selectedPics.length;
    if (currentLength >= 9) {
      wx.showToast({
        title: '图片数已达上限',
      });
      return;
    }
    wx.chooseImage({
      success: function(res) {
        let toBeAddedLength = res.tempFiles.length;
        if (toBeAddedLength + currentLength <= 9) {
          that.setData({
            selectedPics: that.data.selectedPics.concat(res.tempFiles)
          });
        } else {
          let leftNum = 9 - currentLength;
          let toBeAddedSubArr = res.tempFiles.slice(0, leftNum + 1);
          that.setData({
            selectedPics: that.data.selectedPics.concat(toBeAddedSubArr)
          });
        }
        //检测是否存在违规图片
        that.data.selectedPics.map(function(item, index) {
          console.log(item);
          wx.BaaS.wxCensorImage(item.path).then(res => {
            console.log(res);
            if (res.risky == 'true') {
              that.data.illegalPic = true;
              wx.showToast({
                title: '存在违规图片',
              });
            }
          }, err => {
            console.log(err);
          });
        });
      },
    });
  },
  /**
   * 为取消按钮设置点击监听
   */
  deletePic: function(event) {
    let picIndex = event.currentTarget.dataset.index;
    this.data.selectedPics.splice(picIndex, 1);
    this.setData({
      selectedPics: this.data.selectedPics
    });
  },

  /**
   * 为Tip类型选择器设置更改监听
   */
  tipTypeSelected: function(event) {
    let index = event.detail.value;
    let currentType = this.data.tipTypes[index];
    if (this.data.selectedTipTypes.indexOf(currentType) != -1) {
      wx.showToast({
        title: '已经添加',
      });
      return;
    } else {
      this.data.selectedTipTypes.push(currentType);
      this.setData({
        selectedTipTypes: this.data.selectedTipTypes
      });
    }
  },

  /**
   * 为TipType的删除按钮添加监听
   */
  deleteTipType: function(event) {
    let index = event.currentTarget.dataset.index;
    this.data.selectedTipTypes.splice(index, 1);
    this.setData({
      selectedTipTypes: this.data.selectedTipTypes
    });
  },

  /**
   * 预览图片监听
   */
  previewPics: function(event) {
    let that = this;
    let tempPicsArr = [];
    this.data.selectedPics.map(function(item, index) {
      tempPicsArr.push(item.path);
    });
    let index = event.currentTarget.dataset.index;
    wx.previewImage({
      urls: tempPicsArr,
      current: tempPicsArr[index]
    });
  },
  /**
   * 生产uuid
   */
  generateUUID: function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c){
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },

  /**
   * 为提交按钮添加监听
   */
  formSubmit: function(event) {
    let tipContent = event.detail.value.tipContent;
    //检测内容是否为空
    if(this.data.selectedTipTypes.length == 0 || tipContent.length == 0){
      wx.showToast({
        title: '内容不得为空',
      });
      return;
    }

    //检测违规文字
    wx.showLoading({
      title: '请稍后',
    });
    wx.BaaS.wxCensorText(tipContent).then(res => {
      console.log(res.data.risky)
      wx.hideLoading();
      if(res.data.risky){
        that.data.illegalContent = true;
        wx.showToast({
          title: '存在违规内容',
        });
        return;
      } else {
        this.uploadPic(tipContent);
      }
    }, err => {
      wx.hideLoading();
      wx.showToast({
        title: '网络故障',
      });
    });
  },

  /**
   * tip对象的构造
   * @params event 传入的是表单提交事件
   * @params tipContent Tip内容
   */

  formTipObjThenUpload: function(tipContent){
    let that = this;
    let randomColorIndex = Math.floor(Math.random() * (this.data.tipContentBgColor.length + 1));
    let tipTypes = this.data.selectedTipTypes;
    console.log(tipContent);
    //构造tip对象
    let tipObject = {
      id: this.generateUUID(),
      content: tipContent,
      backgroundColor: this.data.tipContentBgColor[randomColorIndex],
      time: Math.round(new Date().getTime() / 1000),
      likedCount: 0,
      liked: false,
      user: {
        avatar: app.globalData.userInfo.avatarUrl,
        username: app.globalData.userInfo.nickName,
        userId: app.globalData.userInfo.openid
      },
      images: this.data.uploadedPics
    }
    console.log(tipObject);
    //上传tip对象
    utils.createRecord(app.globalData.tableID.tips, {tipObj: tipObject}, res=>{
      wx.hideLoading();
      wx.switchTab({
        url: '../home/home',
        success: ()=>{
          wx.showToast({
            title: '上传成功',
          });
        }
      });
    });
  },

  /**
   * 上传图片函数,在上传完成时调用构造tip对象的函数
   * @params event 传入的是表单提交事件
   * @params tipContent Tip内容
   */
  uploadPic: function(tipContent) {
    let that = this;
    let length = this.data.selectedPics.length;
    wx.showLoading({
      title: '提交中',
    });
    if (length == 0) {
      this.formTipObjThenUpload(tipContent);
      return;
    } else {
      let picObj = this.data.selectedPics.shift();
      utils.uploadFile(picObj.path, res => {
        console.log(res);
        that.data.uploadedPics.push(res.data.path);
        this.uploadPic(tipContent);
      });
    }
  },

  /**
   * 为重置按钮提交监听
   */
  formReset: function(event) {
    this.setData({
      selectedPics: [],
      selectedTipTypes: []
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.userInfo);
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