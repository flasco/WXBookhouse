// pages/bookDet/bookDet.js
import { search } from '../../services/book.js';
import { refreshSingleChapter } from '../../utils/refreshBook.js';

import Toast from '../../third-party/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentItem: {
      author: "",
      bookName: "",
      desc: "我不喜欢你了，\n从白天\n到黑夜",
      img: "",
      plantformId: 2,
      source: { 2: "http://www.kanshuzhong.com/book/55579/" }
    },
    addLoading: false,
    exist: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    this.app = getApp()
    if (options.title != null) {
      search(options.title, options.author).then(val => {
        if (val === -1) {
          Toast({
            message: '抓取失败',
            position: 'bottom',
          });
          return;
        } else {
          this.book = val[0];
          if (typeof this.book === 'string') {
            // 如果后台没有搜索到本书会返回一段字符串。
            wx.showModal({
              title: '提示',
              content: '本书没有记录！如果迫切需要加入本书，请及时反馈给开发人员~',
            });
          } else {
            this.book.source[1] && this.book.source[1].indexOf('m.xs') === -1 && (this.book.source[1] = this.book.source[1].replace(/www/, 'm'));
            this.setData({
              currentItem: this.book,
              exist: this.isExist(this.book, this.app.list)
            });
          }
        }
      });
    } else {
      let prevPage = pages[pages.length - 2];
      this.setData({
        currentItem: prevPage.selectObj,
        exist: this.isExist(prevPage.selectObj, this.app.list)
      });
    }

  },

  isExist: function (select, list) {
    if (list.length === 0 || list == null) return false;
    else return list.some((item) => {
      return item.bookName === select.bookName && item.author === select.author;
    });
  },

  addBook: function (e) {
    this.setData({
      addLoading: true,
    })
    refreshSingleChapter(this.data.currentItem).then(val => {
      this.app.list.unshift(val);
      this.setData({
        addLoading: false,
        exist: true,
      })
    })
  },

  readNow: function (e) {
    this.currentItem = this.data.currentItem;
    wx.navigateTo({
      url: '../read/read',
    })
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