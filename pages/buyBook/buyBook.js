// pages/buyBook/buyBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 图书信息
    book: [],
    address: [],//默认地址
    addressList: [],//地址列表
    code: '',//书本code
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      code: options.code
    })
    that.getBook()
  },

  getBook: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'GetBookInfoForCODE',
        UserId: userId,
        BookCODE: that.data.code,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          book: res.data.BookInfo
        })
      }
    })
  },

  //获取地址信息
  getAddress: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'GetAllAdd',
        UserId: userId,
        page: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var addressList = res.data.AddList
        var address = []
        if (addressList.length > 0) {
          for (var i = 0; i < addressList.length; i++) {
            if (addressList[i].AddStatus == 1) {
              that.setData({
                address: addressList[i]
              })
            }
          }
        }
      }
    })
  },

  buy: function () {
    wx.showLoading({
      title: '支付中',
    })
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'UpdateCollectBookInfo',
        UserId: userId,
        BookCODE: that.data.code,
        BookISBN: that.data.book.ISBN,
        Type: 2,//书吧流入
        ActionType: 1,//收藏
        inType: 0,//订单
        price: that.data.book.price,
        ownId: that.data.book.ownId,
        Address: that.data.address.address,
        Name: that.data.address.name,
        Tel: that.data.address.phone,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        //购买成功
        if (res.data.code == '1') {
          wx.navigateTo({
            url: '/pages/order/order',
          })
        } else if (res.data.code == '-11') {
          wx.showModal({
            title: '账户余额不足',
            content: '是否充值！',
            confirmText: '充值',
            success:function(res) {
              if(res.confirm) {
                wx.navigateTo({
                  url: '/pages/recharge/recharge',
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none'
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
    that.getAddress()
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