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
    }]
  },
  // 下拉刷新  
  onPullDownRefresh: function () {
    // content('http://www.xs.la/34_34495/2266828.html').then(res => {
    //   console.log(res)
    // });
    // latestLst([{
    //   title:'上架感言！',
    //   url: 'http://www.xs.la/0_64/'
    // }]).then(res=>{
    //   console.log(res)
    // })

    list('http://www.xs.la/0_64/').then(res=>{
      console.log(res)
    })
  },
})
