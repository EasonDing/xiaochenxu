// pages/books/books.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    in: '.active',
    out: '',
    books: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.getInBooks()
  },
  //获取图书流入列表
  getInBooks: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'GetCollectBookInfo',
        Type: '1',
        AltId: userId,
        request_type:'xcx',
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        const data = res.data
        if (data.code == 1) {
          that.setData({
            in: '.active',
            out: '',
            books: data.BooksListIn
          })
        }
      }
    })
  },
  //获取流出图书列表
  getOutBooks: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'GetCollectBookInfo',
        Type: '1',
        AltId: userId,
        page: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        const data = res.data
        if (data.code == 1) {
          that.setData({
            in: '',
            out: '.active',
            books: data.BooksListOut
          })
        }
      }
    })
  },

  tabClick: function (event) {
    var that = this
    if (event.currentTarget.id == 0) {
      that.getInBooks()
    } else {
      that.getOutBooks()
    }
  },

  scanCode: function () {
    var that = this
    // 只允许从相机扫码
    wx.scanCode({
      onlyFromCamera: true,
      success: (res) => {
        that.is_activation(res.result);
      }
    })
  },
  /**判断该激活码是否已经激活 已经激活到图书详情 */
  is_activation:function(qrcode){
    console.log(1);return false;
    var that = this;
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/is_activation',
      data: {
        qrcode: qrcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        if(res.data.is_activation != 1){
          wx.navigateTo({
            url: '/pages/activation/activation?qrcode=' + res.result,
          })
        }else{
          //图书详情
          
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
    that.getInBooks()
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