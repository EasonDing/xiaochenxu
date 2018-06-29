// pages/bindWechat/bindWechat.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {
      showTopText: '错误提示',
      btn_text: '获取验证码',
      codeTime: 0,//倒计时
      wechat: '',//微信号号
      fromTo: 'my', //app|invite 标记是从哪个页面来的
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // if (options.from) {
    //   that.setData({
    //     fromTo: options.from
    //   })
    // }
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
    var wechat = e.detail.value.wechat

    if (wechat == '') {
      that.setData({
        showTopText: '请输入微信号'
      })
      that.showTopTips()
      return false;
    }
    // var reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/; 
    // if (!reg.test(wechat)) {
    //   that.setData({
    //     showTopText: '请输入正确的微信号！'
    //   })
    //   that.showTopTips()
    //   return false;
    // }

    //验证通过
    // if (that.data.fromTo == 'my') {
    //   that.bindWechat( wechat)
    // } else if (that.data.fromTo == 'updateBindWechat') {
    //   that.updateBindPhone( phone)
    // }
    that.bindWechat(wechat)

  },

  bindWechat: function (wechat) {
    
    var that = this
    var token = wx.getStorageSync('token')
    wx.getUserInfo({
      withCredentials: true,
      lang: 'zh_CN',
      success: function (res) {
        wx.setStorageSync('userInfo', res.userInfo)
      }
    })
    var userInfo = wx.getStorageSync('userInfo')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/bindWechat',
      data: {
        wechat: wechat,
        userId:wx.getStorageSync('userId'),
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
          wx.showToast({
            title: '绑定成功！',
          })
          // wx.redirectTo({
          //   url: '/pages/bindWechatSuccess/bindWechatSuccess',
          // })
          wx.switchTab({
            url: '/pages/my/my',
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