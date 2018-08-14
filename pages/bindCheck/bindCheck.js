// pages/bindCheck/bindCheck.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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
  
  },
  check_phone_success:function()
  {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/phone_account',
      data: {
       
        UserId: userId,
       
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/bindMobileSuccess/bindMobileSuccess?userid=' + userId,
          })
        } else {
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone',
          })
        }
      }
    })
  },
  check_weixin_success: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/weixin_account',
      data: {
       
        UserId: userId,
       
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        if(res.data.code == 200){
          wx.navigateTo({
            url: '/pages/bindWechatSuccess/bindWechatSuccess?userid='+userId,
          })
        }else{
          wx.navigateTo({
            url: '/pages/bindWechat/bindWechat',
          })
        }
      }
    })
  },

})