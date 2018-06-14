// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],//用户信息
    visitUserList: [],//访客记录
    visitUserCount: 0, //访客总数
    bookList: [],// 书架列表
    bookCount: 0,//书架总数
    btnIsShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.checkIsFriends(options.SelectId)
    that.getUser(options.SelectId)
  },

  //获取会员信息
  getUser: function (SelectId) {
    const that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'GetUserHomeInfo',
        UserId: userId,
        SelectId: SelectId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        // 循环，只拿5个用户的信息进行展示
        var visitUserList = [];
        for (var i = 0; i < 5; i++) {
          visitUserList[i] = res.data.VisitUserList[i]
        }
        that.setData({
          userInfo: res.data.UserInfo,
          visitUserList: visitUserList,
          visitUserCount: res.data.VisitUserList.length,
          bookList: res.data.BookList,
          bookCount: res.data.BookList.length
        })
      }
    })
  },

  //检测是否为好友
  checkIsFriends: function (otherId) {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'GetApplyInfo',
        UserId: userId,
        Type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          for (var i = 0; i < data.ApplysList.length; i++) {
            if (data.ApplysList[i]['UserId'] == otherId) {
              that.setData({
                btnIsShow: true
              })
              return false;
            }
          }
        }
      }
    })
  },

  //提交用户好友申请
  addApply:function() {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'AddApplyInfo',
        UserId: userId,
        OtherId: that.data.userInfo.UserId,
        Content: '请求加为好友',
        Type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          wx.showToast({
            title: '请求发送成功',
          })
        }else if(data.code == -2) {
          wx.showToast({
            title: '等待对方同意',
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