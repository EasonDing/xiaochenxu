// pages/bindMobileSuccess/bindMobileSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    uid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      uid: options.userid
    });
    
  },

  //检测是否绑定手机号
  bindphone: function () {
    var that = this
    var uid = that.data.uid;
    console.log(uid);
    if(uid != '' && uid > 0){
      var userId = uid;
    }else{
      var userId = wx.getStorageSync('userId')
    }
    
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
        that.setData({
          phone:res.data.data.wx_account
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.bindphone()
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