// pages/bookForISBN/bookForISBN.js
var sliderWidth = 110; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["简介", "流转"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 65,
    book: [],//扫码获取到的用户信息
    floatList: [],//流转信息
  },

  //获取图书信息按条码
  getBookForISBN: function (isbn) {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'GetBookInfoForISBN',
        BookISBN: isbn,
        UserId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        const data = res.data
        console.log(res)
        that.setData({
          book: data.BookInfo,
          floatList: res.data.FloatList,
        })
      }
    })
  },

  //我要流入
  bookAdd:function(e){
    var that = this
    var isbn = e.target.dataset.isbn
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'UpdateCollectBookInfo',
        BookISBN: isbn,
        UserId: userId,
        Type: 1,//1.APP用户 2.书友群
        ActionType: 1, //1.收藏，2.取消收藏
        inType: 1,//0.订单、1自己扫码流入、2.线下扫码 3/他人书架流入
        Address: ''
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.navigateBack({
          
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.getBookForISBN(options.isbn)
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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