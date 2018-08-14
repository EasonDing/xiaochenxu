// pages/joinJuide/joinJuide.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      '/public/images/vip_juide.png',
    ],
    groupList: [],
    order: [],
    url_type:''
  },
  getUserInfo: function (res) {
      var that = this
      var token = wx.getStorageSync('token')
      wx.request({
        url: 'https://na.bookfan.cn/api/mini/user/order_vip',
        data: {
          userId: wx.getStorageSync('userId'),
          title:'书友会VIP开通',
        },
        header: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,//Bearer后面要加空格
        },
        method: "POST",
        success: function (res) {
          if (res.data.code === 200) {
            that.setData({
              order: res.data.data
            })
            that.pay();
          } else {
            wx.showToast({
              title: res.data.message,
              icon: 'none'
            })
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
            title: '书友会vip开通',
            number: order.order_number,
            total_fee: order.price
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
    var that = this;
    var userId = wx.getStorageSync('userId');
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/update_order',
      data: {
        order: that.data.order.order_number,
        invited_id: 0,
        userId: userId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var url_type = that.data.url_type;
        if(url_type == 1){
          wx.navigateTo({
            url: '/pages/lottery/lottery',
          })
        }else{
          wx.navigateTo({
            url: '/pages/invitation/invitation',
          })
        }
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userId = options.userId
    var url_type = options.type
    that.setData({
      isAuth: wx.getStorageSync('isAuth'),
      url_type:url_type
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