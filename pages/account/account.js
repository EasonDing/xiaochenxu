// pages/account/account.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: 0,
    accountList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getAccount()
  },

  //获取账户信息
  getAccount: function() {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'Account',
        UserId: userId,
        page: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            account: res.data.account,
            accountList: res.data.checkList
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
    var that = this
    that.getAccount();
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