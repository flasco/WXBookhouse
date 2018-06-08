// pages/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    level: 8,
    curExp:1040,
    reqExp:5000,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  jmp2Search:function(e){
    wx.navigateTo({
      url: '../search/search',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})