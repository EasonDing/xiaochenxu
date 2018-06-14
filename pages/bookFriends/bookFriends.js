// pages/bookFriends/bookFriends.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputShowed: false,// 搜索框是否显示
    inputVal: "",// 搜索框值
    searchFriends: [],
    bookFriends: [],
    applys: [],//用户申请列表
  },
  // 搜索框的js事件
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'GetInfoForSearch',
        UserId: userId,
        Keyword: e.detail.value,
        ActionType: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          that.setData({
            searchFriends: data.DataList
          })
        }
      }
    })
    that.setData({
      inputVal: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getApplyInfo()
    that.getBookFriends()
  },

  getBookFriends:function() {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'GetReAttentionInfo',
        UserId: userId,
        SelectId: userId,
        ActionType: 3
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          that.setData({
            bookFriends: data.UsersList
          })
        }
      }
    })
  },

  getApplyInfo: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'GetApplyInfo',
        UserId: userId,
        Type: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          var applys = [];
          for (var i = 0; i < data.ApplysList.length; i++) {
            if (data.ApplysList[i]['ApplyResult'] == 0) {
              applys.push(data.ApplysList[i])
            }
          }
          that.setData({
            applys: applys
          })
        }
      }
    })
  },

  //接受申请
  updateApply: function (res) {
    var that = this
    var ApplyId = res.target.dataset.id
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'UpdateApplyInfoById',
        UserId: userId,
        ApplyId: ApplyId,
        ActionType: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          wx.showToast({
            title: '添加成功！',
          })
          that.getApplyInfo()
          that.getBookFriends()
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