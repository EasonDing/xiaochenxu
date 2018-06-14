//app.js
App({
  onLaunch: function () {
    var that = this
    that.checkUserInfo()
  },

  // 判断本地是否有token 如果没有就去后台数据检查
  checkUserInfo: function () {
    var that = this
    var token = wx.getStorageSync('token')
    //没有token 就进行静默授权，有token就验证码token是否还有有效，无效需要重新授权换取token
    if (token != '') {
      wx.request({
        url: 'https://na.bookfan.cn/api/mini/program/checkUserInfo',
        header: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,//Bearer后面要加空格
        },
        method: "POST",
        success: function (res) {
          var data = res.data
          //判断本地token是否有效，无效就重新授权
          if (data.code === 200) {
            wx.setStorageSync('userId', data.data.user_id)
          } else {
            that.auth()
          }
        }
      })
    } else {
      //本地无token需要进行授权
      that.auth()
    }
  },
  auth: function () {
    var that = this
      wx.login({
        success: res => {
          //微信静默授权 并在后台生成token
          wx.request({
            url: 'https://na.bookfan.cn/api/mini/program/auth',
            data: {
              code: res.code
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            method: "POST",
            success: function (res) {
              //本地保存token
              wx.setStorageSync('token', res.data.data.token)
              that.getUserInfo()
            }
          })
        }
      })
  },
  getUserInfo: function () {
    var that = this
    wx.getUserInfo({
      lang: 'zh_CN',
      success: res => {
        //授权状态，用于判断显示
        wx.setStorageSync('isAuth', true)
        that.saveUserInfo(res.userInfo)
      },
      fail: res => {
        wx.setStorageSync('isAuth', false)
        var userInfo = {}
        that.saveUserInfo(userInfo)
      }
    })
  },

  //保存用户信息
  saveUserInfo: function (userInfo) {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/update',
      data: {
        nickname: userInfo['nickName'],
        sex: userInfo['gender'],
        language: userInfo['language'],
        city: userInfo['city'],
        province: userInfo['province'],
        country: userInfo['country'],
        headimgurl: userInfo['avatarUrl'],
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data;
        if (data.code === 200) {
          wx.setStorageSync('userId', data.data.user_id)
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none',
            mask: true,
          })
        }
      }
    })
  },
  
})
