import { httpGet, httpPost } from '../utils/request.js';
import { spliceLine } from '../utils/util';
import { serverIps } from '../config/index.js';
const StorageIp = 'https://koapi.leanapp.cn';

const getIp = (() => {
  let prevIp;
  let lockTime = Date.now();

  return () => {
    const current = Date.now();
    if (prevIp == null || current - lockTime > 3600 * 1000) {
      const currenthours = new Date().getHours();
      const curPoi = currenthours >= 9 && currenthours < 22 ? 0 : 1;
      prevIp = serverIps[curPoi];
      lockTime = current;
    }
    // return 'http://localhost:3001';
    return prevIp;
  };
})();

export function content(url) {
  return httpGet(`${getIp()}/v2/analysis?action=2&url=${url}`);
}

export function latest(url) {
  return httpGet(`${getIp()}/v2/analysis?action=3&url=${url}`);
}

export function latestLst(list) {
  return httpPost(`${getIp()}/v2/analysis`, list);
}

/**
 * 输入url 返回书籍列表
 * @param {String} url
 */
export function list(url) {
  return new Promise((resolve, reject) => {
    httpGet(`${getIp()}/v2/analysis?action=1&url=${url}`)
      .then(data => {
        if (data !== -1) {
          const n = data.map(item => {
            return {
              url: item.url,
              title: spliceLine(item.title, 18)
            };
          });
          resolve(n);
        }
      })
      .catch(err => resolve([]));
  });
}

export function rnk(page) {
  return httpGet(`${getIp()}/v2/rnklist?p=${page}`).then(val =>
    val.map(item => {
      item.latestChapter = spliceLine(item.latestChapter, 22);
      return item;
    })
  );
}

export function search(name, author = '', pid = '') {
  return httpGet(`${StorageIp}/v2/sear?name=${name}&aut=${author}&pid=${pid}`);
}
