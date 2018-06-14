// pages/order/order.js

var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: ["全部", "未完成", "已完成"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    orderList: [],//订单列表
  },

  tabClick: function (e) {
    this.getOrders(e.currentTarget.id)
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });

    that.getOrders()
  },

  //获取所有订单
  getOrders: function (clickId) {
    var that = this
    var userId = wx.getStorageSync('userId')
    var orderStatus = clickId
    if (clickId == 2) {
      orderStatus = 3;
    }
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'GetOrders',
        userId: userId,
        page: 1,
        orderStatus: orderStatus
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          orderList: res.data.OrdersList,
        })
      }
    })
  },

  //提示对话框
  openConfirm: function (e) {
    var that = this
    var orderStatus = e.target.dataset.status
    var orderId = e.target.id
    wx.showModal({
      title: '警告',
      content: '确定要删除吗',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          //删除订单
          if (orderStatus == 3) {
            that.deleteOrder(orderId)
          } else {
            //orderStatus == 1 || ==2执行确认订单
            that.arrirmOrder(orderId)
          }
        } else {
          console.log('用户点击取消')
        }
      }
    });
  },

  //删除订单
  deleteOrder:function(orderId){
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'DelOrder',
        userId: userId,
        orderId: orderId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.openToast('订单删除成功')
        that.getOrders(that.data.activeIndex)
      }
    })
  },

  //确认订单
  arrirmOrder: function (orderId) {
    var that = this
    var userId = wx.getStorageSync('userId')
    console.log(that.data.activeIndex)
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'AffirmOrder',
        userId: userId,
        orderId: orderId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.openToast('订单已确认')
        that.getOrders(that.data.activeIndex)
      }
    })
  },

  //成功提示
  openToast: function (title = '操作成功') {
    wx.showToast({
      title: title,
      icon: 'success',
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