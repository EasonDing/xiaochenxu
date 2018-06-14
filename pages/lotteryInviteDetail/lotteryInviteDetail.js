// pages/lotteryInviteDetail/lotteryInviteDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    userId: '',//邀请人 Id
    userInfo: [],//邀请人用户信息
    inviteUsers: [],//TA邀请的好友
    inviteCount: 0,//邀请好友总数
    btnStatus: 0,//按钮状态
    // sign: 0, //标记用户是否授权 0.未授权|1.已授权
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
      orderId: options.orderId,
      userId: options.userId,
    })
    that.getUserInfo()
    app.auth()
  },

  getUserInfo: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/show',
      dataType: 'json',
      data: {
        userId: that.data.userId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        wx.hideLoading()
        that.setData({
          userInfo: data.data
        })
      }
    })
  },

  getOrderDetail: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order/show/' + that.data.orderId,
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data
        that.setData({
          inviteUsers: data.buy_invite,
          inviteCount: data.invite_count
        })
      }
    })
  },

  help: function () {
    var that = this
    var token = wx.getStorageSync('token')
    //判断本地是否有userId 如果没有就去后台数据检查
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/invite/store',
      data: {
        order_id: that.data.orderId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data;
        if (data.code === 200) {
          that.setData({
            btnStatus: 0
          })
          that.getOrderDetail()
          wx.showToast({
            title: '成功助力好友！',
          })
        }
      }
    })
  },

  //我也要0元购书 ，跳转到首页
  jump: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  checkUserInvite: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    var userId = wx.getStorageSync('userId');
    //自己不能邀请自己
    if (userId != that.data.userId) {
      wx.request({
        url: 'https://na.bookfan.cn/api/mini/program/buy/invite/checkUserInvite',
        data: {
          userId: userId,
        },
        header: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,//Bearer后面要加空格
        },
        method: "POST",
        success: function (res) {
          console.log(res)
          if (res.data.code === 200) {
            that.setData({
              btnStatus: 1
            })
          } else {
            that.setData({
              btnStatus: 0
            })
          }
        }
      })
    }
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
    var that = this
    that.getOrderDetail()
    that.checkUserInvite()
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
})