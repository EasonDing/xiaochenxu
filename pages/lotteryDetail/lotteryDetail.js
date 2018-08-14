// pages/lotteryDetail/lotteryDetail.js
var timer = require('../../utils/wxTimer.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxTimerList: {},
    orderDetail: [],//订单详情
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      orderId: options.orderId
    })
    that.getOrderDetail(options.orderId)
  },

  getOrderDetail: function (orderId) {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order/show/' + orderId,
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        var data = res.data.data
        that.setData({
          orderDetail: data,
        })

        var wxTimer = new timer({
          beginTime: data.buy_book.remaining_time,
          complete: function () {
            if (that.data.orderDetail.activity_status == 0) {
              that.updateActivityStatus()
            }
          }
        })
        wxTimer.start(that);
      }
    })
  },

  //倒计时为0 时更新活动状态
  updateActivityStatus: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order/update/' + that.data.orderId,
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        console.log('状态更新成功')
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
    var wxTimer = new timer()
    wxTimer.calibration()//校准时间
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var userId = wx.getStorageSync('userId')
    return {
      title: '邀请您参加“0元购书活动“',
      path: '/pages/lotteryInviteDetail/lotteryInviteDetail?userId=' + userId + '&orderId=' + this.data.orderDetail.id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})