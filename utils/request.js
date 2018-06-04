export const httpGet = (url, callback) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url,
      success: function (res) {
        resolve(res.data);
      },
      fail: function (err) {
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
        resolve(res.data);
      },
      fail: function (err) {
        reject(err);
      }
    })
  })
}