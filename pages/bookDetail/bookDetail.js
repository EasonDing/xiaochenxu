// pages/bookDetail/bookDetail.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    tabs: ["简介", "流转"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 65,
    book: [],//图书详情
    floatList: [],//流转状态
    collectCount: 0,//收藏总数
    //可以通过hidden是否掩藏弹出框的属性，来指定那个弹出框
    hiddenmodalput: true,
    price: 0,//流转金额
    bookCode: '',//书本CODE
    isInflow: '',//流入或流出
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
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

    that.setData({
      bookCode: options.bookCode,
      isInflow: options.isInflow
    })
    that.getBook(options.bookCode)
  },

  getBook: function (bookCode) {
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'GetBookInfoForCODE',
        BookCODE: bookCode,
        UserId: userId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          book: res.data.BookInfo,
          floatList: res.data.FloatList,
          collectCount: res.data.CollectCount,
        })
      }
    })
  },

  //点击按钮痰喘指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //提交  
  confirm: function (res) {
    var that = this
    var userId = wx.getStorageSync('userId')
    //这里延时一秒再检测
    setInterval(function() {
      if (!that.data.price > 0) {
        that.showTopTips('请输入流转金额')
        return false
      }
    }, 1000)

    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'SetFlowPrice',
        FlowPrice: that.data.price,
        BookCODE: that.data.bookCode,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var picUrl = encodeURIComponent(that.data.book.PicUrl)
        wx.navigateTo({
          url: '/pages/bookMarket/bookMarket?price=' + that.data.price + '&picUrl=' + picUrl,
        })
        that.setData({
          hiddenmodalput: true
        })
      }
    })
  },
  //获取设置的流转金额
  getPrice: function (res) {
    var that = this
    that.setData({
      price: res.detail.value
    })
  },

  //错误提示
  showTopTips: function (text = '请正确输入') {
    var that = this;
    this.setData({
      showTopTips: true,
      showTopTipsText: text
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
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