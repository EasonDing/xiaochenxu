// pages/lotteryBuyBook/lotteryBuyBook.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book: [],
    address: [],//默认地址
    isAddress: false,
    order: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getBook(options.bookId)
  },

  //获取图书信息
  getBook: function (bookId) {
    var that = this;
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/book/show/' + bookId,
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "GET",
      success: function (res) {
        that.setData({
          book: res.data.data.data,
        })
      }
    })
  },

  //获取默认地址
  getAddress: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'GetDefaultAdd',
        UserId: userId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            address: res.data.AddInfo,
            isAddress: true
          })
        }
      }
    })
  },
  //立即支付 生成订单
  createOrder: function () {
    var that = this
    if (!that.data.isAddress) {
      wx.showToast({
        title: '请先添加地址信息！',
        icon: 'none'
      })
      return false
    }
    wx.showLoading({
      title: '支付中',
    })

    var that = this
    var token = wx.getStorageSync('token')
    var book = that.data.book
    var address = that.data.address
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order/store',
      data: {
        book_id: book.id,
        area: address.area,
        address: address.address,
        phone: address.phone,
        price: 0,//book.price,
        real_price: book.activity_price
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        if (res.data.code === 200) {
          // that.openToast('订单创建成功！')
          that.setData({
            order: res.data.data
          })
          wx.navigateTo({
            url: '/pages/lottery/lottery',
          })
        } else {
          that.openToast('订单创建失败！')
        }
      }
    })
  },

  pay: function () {
    var that = this
    var order = that.data.order
    wx.login({
      success: res => {
        var token = wx.getStorageSync('token')
        wx.request({
          url: 'https://na.bookfan.cn/api/mini/program/pay',
          data: {
            code: res.code,
            title: '购买书籍',
            number: order.number,
            total_fee: order.real_price
          },
          header: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token,//Bearer后面要加空
          },
          method: "POST",
          success: function (res) {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: 'MD5',
              paySign: res.data.paySign,
              success: function (res) {
                wx.showToast({
                  title: '支付成功！',
                })
                that.updatePayStatus()
              },
              fail: function (res) {
                wx.showToast({
                  title: '取消支付！',
                })
                that.destroyOrder()
              },
              complete: function (res) {

              },
            })
          }
        })
      }
    })
  },
  //支付成功，更新订单支付状态
  updatePayStatus: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order/payStatus/' + that.data.order.id,
      data: {},
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.navigateTo({
          url: '/pages/lottery/lottery',
        })
      }
    })
  },

  //订单未支付就将订单软删除
  destroyOrder: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/buy/order/destroy/' + that.data.order.id,
      data: {
        bookId:that.data.order.book_id
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.navigateTo({
          url: '/pages/lottery/lottery',
        })
      }
    })
  },

  openToast: function (title) {
    wx.showToast({
      title: title,
      icon: 'loading',
      duration: 3000
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