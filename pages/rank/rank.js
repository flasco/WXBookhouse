// pages/rank/rank.js
import { rnk } from '../../services/book.js';
import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },
  page: 1,
  isFetching: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    rnk(this.page).then(val => {
      this.page++;
      this.setData({
        list: val
      });
    });
  },

  jmp2Det:function(e){
    let index = e.currentTarget.dataset.index;
    let currentItem = this.data.list[index];
    wx.navigateTo({
      url: `../bookDet/bookDet?title=${currentItem.name}&author=${currentItem.author}`,
    });
  },

  lower:function(){
    Toast.loading({
      mask: true,
      message: '加载中...',
      duration: 0
    });
    if (!this.isFetching) {
      this.isFetching = true;
      rnk(this.page).then(val => {
        this.isFetching = false;
        Toast.clear();
        this.page++;
        const list = this.data.list.concat(val);
        this.setData({
          list,
        });
      }).catch(e => {
        Toast.clear();
      });
    } else {
      Toast({
        message: '正在加载中，请不要频繁操作。',
        position: 'bottom',
      });
    }
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