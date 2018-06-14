//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      '/public/images/banner1.png',
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否自动切换	
    interval: 5000,//自动切换时间间隔	
    duration: 1000,//滑动动画时长
    groupList: []
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  weiper_click: function (e) {
    console.log(e)
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // that.login()
  },

  // 获取已加入的书吧信息
  getGroupList: function (e) {
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'GetGroupForUserId',
        UserId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        // 如果没有书吧就显示默认的
        if (res.data.GroupsList.length > 0) {
          that.setData({
            groupList: res.data.GroupsList,
          })
        } else {
          that.setData({
            groupList: res.data.AreaGroupsList,
          })
        }
      }
    })
  },
  
  upper: function (e) {
    console.log(e)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.getGroupList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //微信登录
  // login: function () {
  //   var that = this
  //   var token = wx.getStorageSync('token')
  //   //本地无token再进行登录
  //   if (token == '') {
  //     wx.login({
  //       success: res => {
  //         //微信静默授权 并在后台生成token
  //         wx.request({
  //           url: 'https://na.bookfan.cn/api/mini/program/auth',
  //           data: {
  //             code: res.code
  //           },
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           method: "POST",
  //           success: function (res) {
  //             //本地保存token
  //             var token = res.data.data.token
  //             wx.setStorageSync('token', token)
  //             that.checkUserInfo(token)
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     that.checkUserInfo(token)
  //   }
  // },
  // // 判断本地是否有userId 如果没有就去后台数据检查
  // checkUserInfo: function (token) {
  //   wx.request({
  //     url: 'https://na.bookfan.cn/api/mini/program/checkUserInfo',
  //     header: {
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer ' + token,//Bearer后面要加空格
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       var data = res.data
  //       if (data.code === 200) {
  //         wx.setStorageSync('userId', data.data.user_id)
  //       } else {
  //         wx.redirectTo({
  //           url: '/pages/bindPhone/bindPhone?from=app',
  //         })
  //       }
  //     }
  //   })
  // },
})
