//app.js
import { version, versionLog } from './config/index.js';
App({
  onLaunch: function () {
    // 展示本地存储能力
    this.night = wx.getStorageSync('night') || false;
    this.version = wx.getStorageSync('version') || '';
    if (this.version !== version) {
      wx.showModal({
        title: '版本更新日志',
        content: versionLog,
        success: (res) => {
          if (res.confirm) {
            wx.setStorage({
              key: 'version',
              data: version,
            });
          }
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.screenWidth = res.screenWidth;
        this.screenHeight = res.screenHeight;
        this.windowHeight = res.windowHeight;
        this.barHeight = res.statusBarHeight * res.pixelRatio;
      },
    })

    // 登录
    wx.login({
      success: res => {
        this.openId = res.code;
        // console.log(res.code)
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
  }
})