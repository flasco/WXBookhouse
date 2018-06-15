// pages/account/account.js
import { version } from '../../config/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    level: 8,
    curExp: 1040,
    reqExp: 5000,
    version,
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
  jmp2Search: function (e) {
    wx.navigateTo({
      url: '../search/search',
    })
  },
  jmp2Rnk: function (e) {
    wx.navigateTo({
      url: '../rank/rank',
    })
  },
  jmp2Help: function(){
    wx.navigateTo({
      url: '../help/help',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})