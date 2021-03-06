// pages/catalog/catalog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    current: 0,
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pages = getCurrentPages();
    this.prevPage = pages[pages.length - 2];
    
    let current = this.prevPage.bookRecord.recordChapterNum;
    this.setData({
      list: this.prevPage.chapterLst,
      current,
      scrollTop: (current - 6) * 45
    })
  },
  clickJmp: function (e) {
    let select = e.currentTarget.dataset.index;
    wx.navigateBack({
      delta: 1
    });
    this.prevPage.getContent(select);
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