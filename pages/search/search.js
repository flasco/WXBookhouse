// pages/search/search.js
import { search } from '../../services/book.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    hintText:'输入后点击done即可搜索书籍',
  },

  search: function(e){
    console.log(e.detail)
    search(e.detail).then(val=>{
      this.setData({
        list: val,
        hintText:`本次搜索到${val.length}条相关数据`
      })
    })
  },

  jmp2Det:function(e){
    this.selectObj = this.data.list[e.currentTarget.dataset.index];
    wx.navigateTo({
      url: `../bookDet/bookDet`,
    })
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