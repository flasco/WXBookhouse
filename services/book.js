import { httpGet, httpPost } from '../utils/request.js';
import { serverIp } from '../config/index.js';
const StorageIp = 'https://testdb.leanapp.cn';
const currenthours = new Date().getHours();
let Ip = currenthours >= 9 && currenthours < 22 ? serverIp[0] : serverIp[1];

export function changeServer() {
  let msg = '当前无需切换';
  if (Ip !== serverIp[0]) {
    Ip = serverIp[0];
    msg = '服务器已切换至主线';
  } else if (Ip !== serverIp[1]) {
    Ip = serverIp[1];
    msg = '服务器已切换至备用';
  }
  console.log(msg);
}

export function content(url) {
  return httpGet(`${Ip}/analysis?action=2&url=${url}`);
}

export function latest(url) {
  return httpGet(`${Ip}/analysis?action=3&url=${url}`);
}

export function latestLst(list) {
  return httpPost(`${Ip}/analysis`, list);
}

/**
 * 输入url 返回书籍列表
 * @param {String} url 
 */
export function list(url) {
  url.indexOf('m.xs') !== -1 && (url = url + 'all.html');
  return new Promise((resolve, reject) => {
    httpGet(`${Ip}/analysis?action=1&url=${url}`).then(data => {
      let n = [], i = 0;
      while (i < data.length) {
        n.push({
          key: data[i].url,
          title: (data[i].title.length > 25 ? data[i].title.substr(0, 18) + '...' : data[i].title)
        });
        i++;
      };
      resolve(n);
    }).catch(err => resolve([]));
  })
}

export function rnk(page) {
  return httpGet(`${Ip}/rnklist?p=${page}`);
}

export function search(name, author = '', pid = '') {
  return httpGet(`${StorageIp}/sear?name=${name}&aut=${author}&pid=${pid}`);
}