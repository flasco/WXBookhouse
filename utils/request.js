export const httpGet = (url, callback) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success: function (res) {
        if (res.data.success) resolve(res.data.data);
        reject(res.data.msg);
      },
      fail: function (err) {
        wx.showToast({
          title: '请求失败',
        });
        reject(err);
      }
    });
  });
}

export const httpPost = (url, payload, callback) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      data: payload,
      method: 'POST',
      header: {
        'content-type': 'application/json' // payload为object
      },
      success: function (res) {
        if (res.data.success) resolve(res.data.data);
        reject(res.data.msg);
      },
      fail: function (err) {
        wx.showToast({
          title: '请求失败',
        });
        reject(err);
      }
    })
  })
}