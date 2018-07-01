// pages/bindPhone/bindPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopText: '错误提示',
    btn_text: '获取验证码',
    codeTime: 0,//倒计时
    phone: '',//手机号
    fromTo: '', //app|invite 标记是从哪个页面来的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.from) {
      that.setData({
        fromTo: options.from
      })
    }
  },

  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },

  //提交数据
  formSubmit: function (e) {
    var that = this
    var captcha = e.detail.value.captcha
    var phone = e.detail.value.phone

    if (phone == '') {
      that.setData({
        showTopText: '请输入手机号'
      })
      that.showTopTips()
      return false;
    }
    var regPhone = /^0?(13|14|15|17|18)[0-9]{9}$/;
    if (!regPhone.test(phone)) {
      that.setData({
        showTopText: '请输入正确的手机号！'
      })
      that.showTopTips()
      return false;
    }
    if (captcha == '') {
      that.setData({
        showTopText: '请输入验证码'
      })
      that.showTopTips()
      return false;
    }

    //验证码通过
    //console.log(that.data.fromTo);return;
    if (that.data.fromTo == 'my') {
      that.bindphone(captcha, phone)
    } else if (that.data.fromTo == 'updateBindPhone') {
      that.updateBindPhone(captcha, phone)
    }

  },

  bindphone: function (captcha, phone) {
    var that = this
    var token = wx.getStorageSync('token');
    var userId = wx.getStorageSync('userId')
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success : function(res) {
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
    var userInfo = wx.getStorageSync('userInfo')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/bindPhone',
      data: {
        captcha: captcha,
        phone: phone,
        nickname: userInfo.nickName,
        headimgurl: userInfo.avatarUrl,
        gender: userInfo.gender,
        province: userInfo.province,
        city: userInfo.city,
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        if (res.data.code === 200) {
          wx.setStorageSync('userId', res.data.data.userId)
          wx.redirectTo({
            url: '/pages/bindMobileSuccess/bindMobileSuccess?userid=' + userId,
          })
        } else {
          wx.showToast({
            title: res.data.message,
            icon: 'none'
          })
        }
      }
    })
  },

  updateBindPhone: function (captcha, phone) {
    var that = this
    var token = wx.getStorageSync('token')
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/updateBindPhone',
      data: {
        captcha: captcha,
        phone: phone
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code === 200) {
          wx.navigateTo({
            url: '/pages/bindMobileSuccess/bindMobileSuccess?userid=' + userId,
          })
        } else {
          wx.showToast({
            title: data.message,
            icon: 'none'
          })
        }
      }
    })
  },

  //通过绑定事件 获取手机号
  phoneInputEvent: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //获取验证码
  getCode: function (e) {
    var that = this
    var timing = setInterval(function () {
      clearInterval(timing)
    }, 3000)
    var phone = that.data.phone
    if (phone == '') {
      that.setData({
        showTopText: '请输入手机号'
      })
      that.showTopTips()
      return false;
    }
    var regPhone = /^0?(13|14|15|17|18)[0-9]{9}$/;
    if (!regPhone.test(phone)) {
      that.setData({
        showTopText: '请输入正确的手机号！'
      })
      that.showTopTips(phone)
      return false;
    }
    //前端验证通过后，发送短信
    that.sendSMS(phone)
  },
  //发送短信
  sendSMS: function (phone) {
    var that = this
    if (that.data.codeTime === 0) {
      wx.request({
        url: 'https://na.bookfan.cn/api/captcha',
        data: {
          phone: phone,
          prefix: 0,//代表小程序发起
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded' // 默认值
        },
        method: "POST",
        success: function (res) {
          var data = res.data
          if (data.code === 200) {
            that.countDown()
          } else {
            wx.showToast({
              title: data.message,
              icon: 'none',
              mask: true,
            })
          }
        }
      })
    }
  },

  //短信倒计时
  countDown: function () {
    var that = this
    var time = 60
    that.setData({
      btn_text: '短信发送中..',
    })
    var interval = setInterval(function () {
      var nowTime = time--
      var btn_text = '剩余' + nowTime + 's'
      that.setData({
        btn_text: btn_text,
        codeTime: nowTime
      })
      if (nowTime == 0) {
        that.setData({
          btn_text: '获取验证码',
        })
        clearInterval(interval)
      }
    }, 1000)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})