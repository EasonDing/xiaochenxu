// pages/recharge/recharge.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      { name: '50元', value: 50, checked: 'true' },
      { name: '100元', value: 100 },
      { name: '150元', value: 150 }
    ],
    money: 0.01,
    order: [],//订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  radioChange: function (e) {
    var that = this;
    that.setData({
      money: e.detail.value
    })
  },

  //创建订单
  createPayOrder: function () {
    var that = this
    wx.showLoading({
      title: '支付中..',
    })
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/createOrder',
      data: {
        money: that.data.money
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        if (res.data.code === 200) {
          // that.openToast('订单创建成功！')
          that.setData({
            order: res.data.data
          })
          that.pay()
        } else {
          that.openToast('订单创建失败！')
        }
      }
    })
  },

  pay: function() {
    var that = this
    var order = that.data.order
    wx.login({
      success: res => {
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://na.bookfan.cn/api/mini/program/pay',
          data: {
            code: res.code,
            title: '会员充值',
            number: order.orderNo,
            total_fee: that.data.money
          },
          header: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,//Bearer后面要加空
          },
          method: "POST",
          success: function (res) {
            wx.hideLoading();
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success: function (res) {
                wx.showToast({
                  title: '支付成功！',
                })
                //支付成功后更新订单状态
                that.updatePayStatus()
              },
              fail: function (res) {
                wx.showToast({
                  title: '取消支付！',
                })
                wx.navigateBack({})
              },
              complete: function (res) {

              },
            })
          }
        })
      }
    })
  },

  updatePayStatus: function() {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/updatePayStatus',
      data: {
        orderId: that.data.order.id,
        money: that.data.money
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.navigateBack({})
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