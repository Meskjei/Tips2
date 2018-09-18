// newTip/newTip.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectedPics: [], //选择的图片的临时地址数组
    tipTypes: ['美食', '出行', '居住', '办事', '购物', '其他'],
    pickerIndex: 0,  //picker的索引
    selectedTipTypes: []  // 被选择的Tip类型
  },
  /**
   * 为添加图片按钮设置点击监听
   */
  selectPics: function(event){
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
        if(toBeAddedLength + currentLength <= 9){
          that.setData({ selectedPics: that.data.selectedPics.concat(res.tempFiles)});
        } else {
          let leftNum = 9 - currentLength;
          let toBeAddedSubArr = res.tempFiles.slice(0, leftNum + 1);
          that.setData({
            selectedPics: that.data.selectedPics.concat(toBeAddedSubArr)
          });
        }
      },
    });
  },
  /**
   * 为取消按钮设置点击监听
   */
  deletePic: function(event){
    let picIndex = event.currentTarget.dataset.index;
    this.data.selectedPics.splice(picIndex, 1);
    this.setData({
      selectedPics: this.data.selectedPics
    });
  },

  /**
   * 为Tip类型选择器设置更改监听
   */
  tipTypeSelected: function(event){
    let index = event.detail.value;
    let currentType = this.data.tipTypes[index];
    if (this.data.selectedTipTypes.indexOf(currentType) != -1){
      wx.showToast({
        title: '已经添加',
      });
      return;
    } else {
      this.data.selectedTipTypes.push(currentType);
      this.setData({ selectedTipTypes: this.data.selectedTipTypes});
    }
  },

  /**
   * 为TipType的删除按钮添加监听
   */
  deleteTipType: function(event){
    let index = event.currentTarget.dataset.index;
    this.data.selectedTipTypes.splice(index, 1);
    this.setData({
      selectedTipTypes: this.data.selectedTipTypes
    });
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