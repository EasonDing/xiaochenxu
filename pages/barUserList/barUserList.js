// pages/barUserList/barUserList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupBarUserList: [],//书吧用户列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getBarUserList(options.groupId)
  },

  // 书吧用户列表
  getBarUserList: function(groupId){
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'GetGroupInfoById',
        UserId: userId,
        GroupId: groupId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          groupBarUserList: res.data.MembersList
        })
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