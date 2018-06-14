// pages/bindMobile/bindMobile.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopText: '错误提示',
    btn_text: '获取验证码',
    codeTime: 0,//倒计时
    phone: '',//手机号
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
    var code = e.detail.value.code
    var phone = e.detail.value.phone
    var userId = wx.getStorageSync('userId')
    if(phone == ''){
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
    if(code == '') {
      that.setData({
        showTopText: '请输入验证码'
      })
      that.showTopTips()
      return false;
    }

    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'bindPhone',
        UserId: userId,
        phone: phone,
        Smscode: code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.redirectTo({
          url: '/pages/bindMobileSuccess/bindMobileSuccess',
        })
      }
    })

  },
  //通过失去焦点事件 获取手机号
  phoneInputEvent: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  //获取验证码
  getCode: function (e) {
    var that = this
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
      that.showTopTips()
      return false;
    }
    var time = 60
    if (that.data.codeTime == 0) {
      that.setData({
        btn_text: '短信发送中..',
      })
      that.sendSMS(phone)
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
    }
  },
  //发送短信
  sendSMS:function(phone){
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t:'getSms',
        mobile: phone,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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