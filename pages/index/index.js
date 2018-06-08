//index.js
//获取应用实例
const app = getApp();
import { content, latestLst, list } from '../../services/book.js';

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
    },]
  },
  onLoad: function (options){
    let x = wx.getStorageSync('bookLst');
    if(x !== ''){
      this.setData({
        listx: JSON.parse(x)
      })
    }
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    // wx.clearStorageSync(); // 清除缓存信息
    let task = this.data.listx.map((item) => {
      return {
        title: item.latestChapter,
        url: item.source[item.plantformId],
      }
    });
    latestLst(task).then(res => {
      let newList = [...this.data.listx];
      let updateNum = 0;
      let needUpdate = res.some((item, index) => {
        if (item !== '-1') {
          let curListItem = newList[index];
          curListItem.latestChapter = item.title;
          curListItem.isUpdate = true;
          wx.setStorage({
            key: `${curListItem.bookName}-${curListItem.author}-${curListItem.plantformId}-list`,
            data: item.list
          }); // 缓存列表文件
          return true;
        } else return false;
      });
      needUpdate && this.setData({
        listx: newList
      });
      wx.showToast({
        title: '刷新完成',
      });
      wx.stopPullDownRefresh(); //停止下拉刷新
    })
  },
  clickJmp: function(e){
    wx.navigateTo({
      url: `../read/read?index=${e.currentTarget.dataset.index}`,
    })
  },
  pres:function(e){
    console.log('longPress');
  },
  onHide: function () {
    wx.setStorage({
      key: 'bookLst',
      data: JSON.stringify(this.data.listx),
    })
  },
})
