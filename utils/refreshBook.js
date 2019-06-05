import { list, latest, latestLst } from '../services/book.js';
export function refreshChapter(booklist) {
  return new Promise((resolve, reject) => {
    let task = booklist.map((item) => {
      return {
        title: item.latestChapter,
        url: item.source[item.plantformId],
      }
    });
    latestLst(task).then(res => {
      let newList = booklist.concat();
      // console.log(res);
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
      needUpdate ? resolve({
        needUpdate,
        list: newList
      }) : resolve({
        needUpdate
      });
    });
  });
}

export function refreshSingleChapter(book) {
  return new Promise((resolve, reject) => {
    let bookChapterLstFlag = `${book.bookName}-${book.author}-${book.plantformId}-list`;
    get(book.source[book.plantformId], bookChapterLstFlag, book.latestChapter).then(latest => {
      book.latestChapter = latest.title;
      resolve(book);
    })
  })

}

export function get(url, bookChapterLst, latech) {
  return new Promise((resolve, reject) => {
    latest(url).then(title => {
      if (title === latech) return;
      list(url).then(data => {
        let length = data.length, num = 0;
        if (length < 1) return { title: '抓取失败', num: -1 };
        for (let i = length - 1; i >= 0; i--) {
          if (data[i].title === latech) {
            num = length - i - 1;
            break;
          }
        }
        wx.setStorage({
          key: bookChapterLst,
          data: JSON.stringify(data)
        });
        resolve({ title, num });
      })
    })
  })

}