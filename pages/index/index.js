//index.js
//获取应用实例
const app = getApp();
import { refreshChapter } from '../../utils/refreshBook.js';
import { insertionSort } from '../../utils/util.js';

import Toast from '../../miniprogram_npm/vant-weapp/toast/toast';

Page({
  data: {
    listx: [{
      bookName: '天醒之路',
      author: '蝴蝶蓝',
      img: 'http://www.xs.la/BookFiles/BookImages/64.jpg',
      desc: '“路平，起床上课。”\n“再睡五分钟。”\n“给我起来！”\n哗！阳光洒下，照遍路平全身。\n“啊！！！”惊叫声顿时响彻云霄，将路平的睡意彻底击碎，之后已是苏唐摔门而出的怒吼：“什么条件啊你玩裸睡？！”\n......',
      latestChapter: '上架感言!',
      plantformId: 1,
      latestRead: 0,
      isUpdate: false,
      updateNum: 0,
      source: {
        '1': 'http://www.xs.la/0_64/',
        '2': 'http://www.kanshuzhong.com/book/36456/',
      }
    },],
  },
  loadRefresh: false,
  onLoad: function (options) {
    let x = wx.getStorageSync('bookLst');
    if (x !== '') {
      this.app = getApp();
      const list = JSON.parse(x);
      list.forEach(item => {
        item.img = item.img.replace('www.xs.la', 'www.xinxs.la')
      })
      this.app.list = list;
    }
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    // wx.clearStorageSync(); // 清除缓存信息
    refreshChapter(this.data.listx).then(val => {
      if (val.needUpdate) {
        this.app.list = val.list;
        this.setData({
          listx: val.list,
        })
      }
      Toast({
        message: '刷新完成',
        position: 'bottom',
      });
      wx.stopPullDownRefresh(); //停止下拉刷新
    })
  },
  clickJmp: function (e) {
    if (this.data.listx != null) {
      wx.navigateTo({
        url: `../read/read?index=0`,
      });
      let index = e.currentTarget.dataset.index;
      let list = this.data.listx.concat();
      list[index].isUpdate = false;
      list[index].latestRead = new Date().getTime();
      insertionSort(list);
      this.app.list = list;// 在onshow 的时候会自动同步
      this.currentItem = this.app.list[0];
    }
  },
  onShow: function (e) {
    if (this.app == null) return;
    if (this.app.list == null) return;
    if (this.app.list.length !== this.data.listx) {
      this.setData({
        listx: this.app.list
      }, () => {
        if (!this.loadRefresh) {
          this.loadRefresh = true;
          this.onPullDownRefresh();
        }
      })
    }
  },
  pres: function (e) {
    let select = e.currentTarget.dataset.index;
    let selectBook = this.data.listx[select];
    wx.showModal({
      title: '警告',
      content: `你真的要删除${selectBook.bookName}吗`,
      success: (res) => {
        if (res.confirm) {
          this.data.listx.splice(select, 1);
          this.app.list = this.data.listx;
          this.setData({
            listx: this.data.listx
          });
        }
      }
    })
  },
  compareLst: function (list1, list2) {
    return list1.length === list2.length && list1.every((item, index) => {
      return item.bookName === list2[index].bookName;
    })
  },
  onHide: function () {
    wx.setStorage({
      key: 'bookLst',
      data: JSON.stringify(this.data.listx),
    })
  },
})
