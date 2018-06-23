// pages/my/my.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: wx.getStorageSync('isAuth'),
    userInfo: [],
    userId:'',
    nickname: '',
    avatarUrl: '',
    income: '0.00',
    invite_number: 0,
    invite_list: [],
    u_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userId = options.userId
    that.setData({
      isAuth: wx.getStorageSync('isAuth'),
      
    })
  
    that.getUserInfo();
    that.getlist(userId);
  },

  getlist: function (userId) {
    var that = this;
    var userId = userId;
    console.log(userId);
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/invite_user',
      data: {
        t_type: 'other',
        UserId: userId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        console.log(data);
        that.setData({
          invite_number: data.number,
          invite_list: data.info,
          u_info:data.u_info
        })
      }
    })
  },

  bindphone: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/checkBindPhone',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '/pages/bindMobileSuccess/bindMobileSuccess',
          })
        } else {
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone?from=my',
          })
        }
      }
    })
  },

  getUserInfo: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/show',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        that.setData({
          userInfo: res.data.data,
        })
      }
    })
  },

  authUserInfo: function (res) {
    var that = this
    var userInfo = res.detail.userInfo
    if (userInfo) {
      wx.setStorageSync('isAuth', true)
      that.setData({
        isAuth: wx.getStorageSync('isAuth')
      })
      var token = wx.getStorageSync('token')
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
            app.saveUserInfo(userInfo)
            that.getUserInfo()
          }else {
            app.auth()
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