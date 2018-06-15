// pages/orgin/orgin.js
import { latest } from '../../services/book.js';
import { sites } from '../../config/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '换源'
    });
    this.app = getApp();
    this.currentItem = this.app.list[0];
    let originList = this.currentItem.source;
    
    let tasks = Object.keys(originList).map((key) => {
      return latest(originList[key])
    });
    wx.showLoading({
      title: '加载源列表中',
    })
    Promise.all(tasks).then(res => {
      wx.hideLoading();
      let list = Object.keys(originList).map((key, index) => {
        return {
          site: sites[key],
          key: key,
          latestChapter: res[index],
          isSelect: key === `${this.currentItem.plantformId}`
        }
      });
      this.setData({
        list
      })
    })
  },
  clickJmp:function(e){
    let index = e.currentTarget.dataset.index;
    let key = this.data.list[index].key;
    this.app.list[0].plantformId = key;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.saveRecord();
    prevPage.init();
    wx.navigateBack({
      delta: 1
    });
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