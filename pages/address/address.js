// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    addressList: []
  },
  radioChange: function (e) {
    var radioItems = this.data.addressList;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].AddId == e.detail.value;
    }
    this.setData({
      addressList: radioItems
    });

    //设置默认地址
    this.setDefaultAddress(e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
  },

  getAddressList: function () {
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
        var data = res.data
        var addressList = []
        if (data.code == 1) {
          for (var i = 0; i < data.AddList.length; i++) {
            if (data.AddList[i].AddStatus == '1') {
              addressList[i] = data.AddList[i]
              addressList[i].checked = true
            } else {
              addressList[i] = data.AddList[i]
            }
          }
        }
        that.setData({
          addressList: addressList
        })
      }
    })
  },
  //添加地址
  add: function () {
    wx.chooseAddress({
      success: function (res) {
        var that = this;
        var userId = wx.getStorageSync('userId')
        wx.request({
          url: 'https://m.bookfan.cn/admin/servlet/other.php',
          data: {
            t: 'UpdateAddInfo',
            UserId: userId,
            ActionType: 1,
            name: res.userName,
            phone: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            area: res.countyName,
            address: res.detailInfo,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: "POST",
          success: function (res) {
            that.getAddressList()
          }
        })
      }
    })
  },

  edit: function () {
    wx.chooseAddress({
      success: function (res) {
        var that = this;
        var userId = wx.getStorageSync('userId')
        wx.request({
          url: 'https://m.bookfan.cn/admin/servlet/other.php',
          data: {
            t: 'UpdateAddInfo',
            UserId: userId,
            ActionType: 1,
            name: res.userName,
            phone: res.telNumber,
            province: res.provinceName,
            city: res.cityName,
            area: res.countyName,
            address: res.detailInfo,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          method: "POST",
          success: function (res) {
            that.getAddressList()
          }
        })
      }
    })
  },

  //设置默认地址
  setDefaultAddress: function (addressId) {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'SetAddStatus',
        UserId: userId,
        AddId: addressId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
      }
    })
  },

  //删除地址
  deleteAddress: function (addressId) {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/other.php',
      data: {
        t: 'DeleteAddInfo',
        UserId: userId,
        AddId: addressId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.openToast('删除成功')
        that.onShow()
      },
      fail: function () {
        that.showTopTips('地址删除失败')
      }
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
  //成功提示
  openToast: function (title = '操作成功') {
    wx.showToast({
      title: title,
      icon: 'success',
      duration: 3000
    });
  },

  //提示对话框
  openConfirm: function (event) {
    var that = this
    var addressId = event.currentTarget.id
    wx.showModal({
      title: '警告',
      content: '确定要删除吗',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          that.deleteAddress(addressId)
        } else {
          console.log('用户点击取消')
        }
      }
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
    this.getAddressList()
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