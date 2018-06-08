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
    scrollTop: 0
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
    wx.getSystemInfo({
      success: (res) => {
        this.screenWidth = res.windowWidth;
        this.Quex = this.screenWidth / 4;
        this.Quey = 3 * this.Quex;
      }
    });
    let isFirst = wx.getStorageSync('isFirst');
    if (typeof isFirst !== 'boolean') {
      this.setData({
        isFirst: true
      })
    }
    let currentBook = JSON.parse(options.objstr);
    wx.setNavigationBarTitle({
      title: currentBook.bookName
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#acc7a7',
    })
    let uniqueStr = `${currentBook.bookName}-${currentBook.author}-${currentBook.plantformId}`;
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
      list(currentBook.source[currentBook.plantformId]).then(val => {
        wx.hideLoading();
        if (val.length === 0) {
          this.setData({
            lines: ['\u3000\u3000章节抓取失败']
          })
          return;
        } else {
          console.log(val)
          this.chapterLst = val;
          this.getContent(this.bookRecord.recordChapterNum);
        }
      });
    } else {
      this.getContent(this.bookRecord.recordChapterNum, this.bookRecord.top);
    }
  },
  
  getContent: function (index, top = 0) {
    if (this.loading) return;
    index = (index <= this.chapterLst.length - 1 && index > -1) ? index : 0; //修复index的越界问题
    this.bookRecord.recordChapterNum = index;
    let nurl = this.chapterLst[index].url;
    if (this.chapterMap[nurl] === undefined || typeof this.chapterMap[nurl] === 'string') {
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
  },

  clickEvent: function (e) {
    let clickX = e.detail.x;
    if (clickX > this.Quex && clickX < this.Quey) {
      // console.log('中心处');
    } else if (clickX < this.Quex) {
      // console.log('左侧上一章');
      if (this.bookRecord.recordChapterNum === 0) {
        wx.showToast({
          title: '已经是第一章',
        })
      } else this.getContent(this.bookRecord.recordChapterNum - 1);
    } else {
      // console.log('右侧下一章');
      if (this.bookRecord.recordChapterNum === this.chapterLst.length - 1) {
        wx.showToast({
          title: '已经是最后一章',
        })
      } else this.getContent(this.bookRecord.recordChapterNum + 1);
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
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
})