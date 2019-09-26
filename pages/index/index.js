//index.js
//获取应用实例
const app = getApp()
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}



Page({
  data: {
    bcgImg: '',
    bcgImgAreaShow: false,
    bcgColor: '#2d2225',
    // heartbeat 时禁止搜索，防止动画执行
    enableSearch: true,
    // 粗暴直接：移除后再创建，达到初始化组件的作用
    showHeartbeat: true,
    bcgImgList: [{
        src: '../../image/backlit-dawn-dusk-327466.jpg',
        topColor: '#393836'
      },
      {
        src: '../../image/aerial-climate-cold-296559.jpg',
        topColor: '#d6d1e6'
      }
    ],
    danmuList: []
  },
  //---------------------------------------------------------------
  showBcgImgArea() {
    this.setData({
      bcgImgAreaShow: true,
    })
  },
  hideBcgImgArea() {
    this.setData({
      bcgImgAreaShow: false,
    })
  },
  // 选择背景图片
  chooseBcg(e) {
    let dataset = e.currentTarget.dataset
    let src = dataset.src
    let index = dataset.index
    this.setBcgImg(index)
    wx.setStorage({
      key: 'bcgImgIndex',
      data: index,
    })
  },
  //--------------------------------------------------------------------
  // 搜索
  commitSearch(res) {
    let val = ((res.detail || {}).value || '').replace(/\s+/g, '')
    this.search(val)
  },
  search(val, callback) {
    if (val === '520' || val === '521') {
      this.clearInput()
      this.dance()
      return
    }else{
      this.videoContext.sendDanmu({
        text: val,
        color: getRandomColor()
      })
      this.clearInput()
    }
  },
  clearInput() {
    this.setData({
      searchText: '',
    })
  },
  //-----------------------------------------------------------------
  // 页面掉心心动画
  dance() {
    this.setData({
      enableSearch: false,
    })
    let heartbeat = this.selectComponent('#heartbeat')
    console.info(heartbeat)
    heartbeat.dance(() => {
      this.setData({
        showHeartbeat: false,
        enableSearch: true,
      })
      this.setData({
        showHeartbeat: true,
      })
    })
  },
  setBcgImg(index) {
    // 如果index有值传进来
    if (index !== undefined) {
      this.setData({
        bcgImgIndex: index,
        bcgImg: this.data.bcgImgList[index].src,
        bcgColor: this.data.bcgImgList[index].topColor,
      })
      this.setNavigationBarColor()
      return
    }
    // 如果index没有值传进来，从缓存中获取
    wx.getStorage({
      key: 'bcgImgIndex',
      success: (res) => {
        console.info(res)
        let bcgImgIndex = res.data || 0
        this.setData({
          bcgImgIndex,
          bcgImg: this.data.bcgImgList[bcgImgIndex].src,
          bcgColor: this.data.bcgImgList[bcgImgIndex].topColor,
        })
        this.setNavigationBarColor()
      },
      fail: () => {
        this.setData({
          bcgImgIndex: 0,
          bcgImg: this.data.bcgImgList[0].src,
          bcgColor: this.data.bcgImgList[0].topColor,
        })
        this.setNavigationBarColor()
      },
    })
  },
  setNavigationBarColor(color) {
    console.info(color)
    let bcgColor = color || this.data.bcgColor
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: this.data.bcgColor,
    })
  },
//--------------------------------------------------------------
  onLoad: function() {
    this.reloadPage()
    // this.getNavList();

  },
  reloadPage() {
    this.setBcgImg()
  },
  onReady: function(res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  //获取首页导航数据
  getNavList() {
    let that = this;
    //利用小程序内置发送请求的方法
    wx.request({
      url: "https://easy-mock.com/mock/5c1dfd98e8bfa547414a5278/bili/navList",
      success(res) {
        console.log(res);
        // if (res.data.code == 0) {
        //   that.setData({
        //     navList: res.data.data.navList
        //   });
        // }
      }
    });
  },
})