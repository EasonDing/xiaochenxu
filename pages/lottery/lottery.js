// pages/lottery/lottery.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["1分购书", "我的活动", '活动规则'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,

    // 书架列表
    bookList: [],
    myActivityList: []//我的购书列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.getMyActivity()
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  //获取0元购书列表
  getBooks: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/book',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        that.setData({
          bookList: res.data.data.data,
        })
      }
    })
  },

  //获取我的购书列表
  getMyActivity: function () {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "GET",
      success: function (res) {
        that.setData({
          myActivityList: res.data.data.data,
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
    var that = this
    that.getBooks()
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