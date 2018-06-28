// pages/my/my.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAuth: wx.getStorageSync('isAuth'),
    userInfo: [],
    userId:'',
    nickname: '',
    avatarUrl: '',
    income: '0.00',
    invite_number: 0,
    invite_list: [],
    u_info:[],
    wx_account:'',
    btnIsShow:false,
    other_id:'',
    all_book:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var userId = options.userId
    that.setData({
      isAuth: wx.getStorageSync('isAuth'),
      other_id:userId
    })
  
    that.getUserInfo();
    that.getlist(userId);
    that.checkIsFriends(userId);
  },

  naviga_url: function (e) {
    var naviga_id = e.currentTarget.id;
    var userId = wx.getStorageSync('userId');
    if (userId != naviga_id){
      wx.navigateTo({
          url: '/pages/invitindex/invitindex?userId='+naviga_id,
        })
    }else{
      wx.navigateTo({
        url: '/pages/invitation/invitation',
      })
    }
  },

  getlist: function (userId) {
    var that = this;
    var userId = userId;
    console.log(userId);
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/invite_user',
      data: {
        t_type: 'other',
        UserId: userId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        console.log(data);
        that.setData({
          invite_number: data.number,
          invite_list: data.info,
          u_info:data.u_info,
          wx_account:data.wx_account,
          all_book:data.all_book
        })
      }
    })
  },

  //检测是否为好友
  checkIsFriends: function (otherId) {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'GetApplyInfo',
        UserId: userId,
        Type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          for (var i = 0; i < data.ApplysList.length; i++) {
            if (data.ApplysList[i]['UserId'] == otherId) {
              that.setData({
                btnIsShow: true
              })
              return false;
            }
          }
        }
      }
    })
  },

  //提交用户好友申请
  add_friend: function () {
    var that = this
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/user.php',
      data: {
        t: 'AddApplyInfo',
        UserId: userId,
        OtherId: that.data.other_id,
        Content: '请求加为好友',
        Type: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        if (data.code == 1) {
          wx.showToast({
            title: '请求发送成功',
          })
        } else if (data.code == -2) {
          wx.showToast({
            title: '等待对方同意',
          })
        }
      }
    })
  },


  bindphone: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/checkBindPhone',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        if (res.data.code === 200) {
          wx.navigateTo({
            url: '/pages/bindMobileSuccess/bindMobileSuccess',
          })
        } else {
          wx.navigateTo({
            url: '/pages/bindPhone/bindPhone?from=my',
          })
        }
      }
    })
  },

  getUserInfo: function () {
    var that = this
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/program/user/show',
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        that.setData({
          userInfo: res.data.data,
        })
      }
    })
  },

  authUserInfo: function (res) {
    var that = this
    var userInfo = res.detail.userInfo
    if (userInfo) {
      wx.setStorageSync('isAuth', true)
      that.setData({
        isAuth: wx.getStorageSync('isAuth')
      })
      var token = wx.getStorageSync('token')
      wx.request({
        url: 'https://na.bookfan.cn/api/mini/program/checkUserInfo',
        header: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token,//Bearer后面要加空格
        },
        method: "POST",
        success: function (res) {
          var data = res.data
          //判断本地token是否有效，无效就重新授权
          if (data.code === 200) {
            app.saveUserInfo(userInfo)
            that.getUserInfo()
          }else {
            app.auth()
          }
        }
      })
    }
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