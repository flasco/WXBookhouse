// pages/read.js
import { list, content } from '../../services/book.js';
import { pushIndent } from '../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lines: [],
    title: '',
    isFirst: false,
    scrollTop: 0,
    menuHide: true,
    lstLength: 100,
    currentNum: 0,
    night: false,
  },
  flagLst: [],
  bookRecord: '',
  chapterMap: '',
  chapterLst: '',
  screenWidth: 0,
  loading: false,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let app = getApp();
    this.screenWidth = app.screenWidth;
    this.Quex = this.screenWidth / 4;
    this.Quey = 3 * this.Quex;
    let isFirst = wx.getStorageSync('isFirst');
    if (typeof isFirst !== 'boolean') {
      this.setData({
        isFirst: true
      })
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];

    this.currentBook = prevPage.currentItem;
    wx.setNavigationBarTitle({
      title: this.currentBook.bookName
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#acc7a7',
    });
    this.init();
  },
  init: function () {
    let uniqueStr = `${this.currentBook.bookName}-${this.currentBook.author}-${this.currentBook.plantformId}`;
    this.flagLst[0] = `${uniqueStr}-record`; // record
    this.flagLst[1] = `${uniqueStr}-list`; // lst
    this.flagLst[2] = `${uniqueStr}-map`; // map
    this.bookRecord = wx.getStorageSync(this.flagLst[0]) || { recordChapterNum: 0, top: 0 };
    this.chapterLst = wx.getStorageSync(this.flagLst[1]) || [];
    this.chapterMap = wx.getStorageSync(this.flagLst[2]) || new Map();
    this.bookRecord = typeof this.bookRecord === 'string' ? JSON.parse(this.bookRecord) : this.bookRecord;
    this.chapterLst = typeof this.chapterLst === 'string' ? JSON.parse(this.chapterLst) : this.chapterLst;
    this.chapterMap = typeof this.chapterMap === 'string' ? JSON.parse(this.chapterMap) : this.chapterMap;
    if (this.chapterLst.length === 0) {
      wx.showLoading({
        title: '章节内容走心抓取中...',
      });
      list(this.currentBook.source[this.currentBook.plantformId]).then(val => {
        wx.hideLoading();
        if (val.length === 0) {
          this.setData({
            lines: ['\u3000\u3000章节抓取失败']
          })
          return;
        } else {
          // console.log(val)
          this.chapterLst = val;
          this.setData({
            lstLength: this.chapterLst.length,
          })
          this.getContent(this.bookRecord.recordChapterNum);
        }
      });
    } else {
      this.setData({
        lstLength: this.chapterLst.length,
      })
      this.getContent(this.bookRecord.recordChapterNum, this.bookRecord.top);
    }
  },

  getContent: function (index, top = 0) {
    if (this.loading) return;
    index = (index <= this.chapterLst.length - 1 && index > -1) ? index : 0; //修复index的越界问题
    this.bookRecord.recordChapterNum = index;
    this.setData({
      currentNum: index,
    })
    if (this.chapterLst[index] == null) {
      this.setData({
        title: '章节内容出错',
        lines: ['\u3000\u3000章节内容获取失败.'],
      });
      return;
    }
    let nurl = this.chapterLst[index].url;
    let currentItem = this.chapterMap[nurl];
    if (currentItem == null || typeof currentItem === 'string' || currentItem.lines.length === 0) {
      wx.showLoading({
        title: '获取章节中...',
      })
      this.loading = true;
      content(nurl).then(data => {
        wx.hideLoading();
        this.loading = false;
        if (data !== -1) {
          this.chapterMap[nurl] = {
            title: data.title,
            lines: pushIndent(data.content),
          };
          this.setData({
            ...this.chapterMap[nurl],
            scrollTop: 0
          });

        } else {
          this.setData({
            title: '网络连接超时啦啦啦啦啦',
            lines: ['\u3000\u3000网络连接超时.'],
          });
          return;
        }
      })
    } else {
      this.setData({
        ...this.chapterMap[nurl],
        scrollTop: top
      });
    }
    // 提前缓存下一章节
    if (index < this.chapterLst.length - 1) {
      this.cacheNextChapter(this.chapterLst[index + 1].url)
    }
  },
  cacheNextChapter: function (nurl) {
    if (this.chapterMap[nurl] === undefined || typeof this.chapterMap[nurl] === 'string') {
      content(nurl).then(data => {
        if (data !== -1) {
          this.chapterMap[nurl] = {
            title: data.title,
            lines: pushIndent(data.content),
          };
        } else {
          // 缓存失败
          return;
        }
      });
    }
  },
  slider2change: function (e) {
    this.getContent(e.detail.value);
  },
  prvChapter: function () {
    if (this.bookRecord.recordChapterNum === 0) {
      wx.showToast({
        title: '已经是第一章',
      });
    } else this.getContent(this.bookRecord.recordChapterNum - 1);
  },
  nxtChapter: function () {
    if (this.bookRecord.recordChapterNum === this.chapterLst.length - 1) {
      wx.showToast({
        title: '已经是最后一章',
      })
    } else this.getContent(this.bookRecord.recordChapterNum + 1, 0);
  },
  clickEvent: function (e) {
    let clickX = e.detail.x;
    if (clickX > this.Quex && clickX < this.Quey) {
      // console.log('中心处');
      this.setData({
        menuHide: !this.data.menuHide
      })
    }
  },

  notFirst: function (e) {
    this.setData({
      isFirst: false,
    });
    wx.setStorage({
      key: 'isFirst',
      data: false,
    })
  },
  scroll: function (e, res) {
    // 容器滚动时将此时的滚动距离赋值给 this.data.scrollTop
    this.top = e.detail.scrollTop;
  },
  jmp2Catalog: function (e) {
    wx.navigateTo({
      url: `../catalog/catalog`,
    });
    !this.data.menuHide && this.setData({
      menuHide: true
    })
  },
  jmp2origin: function () {
    wx.navigateTo({
      url: '../origin/origin',
    });
  },
  switchNight: function () {
    let flag = !this.data.night;
    wx.setNavigationBarColor({
      frontColor: flag ? '#ffffff' : '#000000',
      backgroundColor: flag ? '#0c0c0c' : '#acc7a7',
    })
    this.setData({
      night: flag
    });
  },

  saveRecord:function(){
    this.bookRecord.top = this.top;
    wx.setStorage({
      key: this.flagLst[0],
      data: JSON.stringify(this.bookRecord),
    });
    wx.setStorage({
      key: this.flagLst[1],
      data: JSON.stringify(this.chapterLst),
    });
    wx.setStorage({
      key: this.flagLst[2],
      data: JSON.stringify(this.chapterMap),
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.saveRecord();
  },
})