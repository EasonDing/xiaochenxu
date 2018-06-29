//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      '/public/images/banner1.png',
    ],
    indicatorDots: true,//是否显示面板指示点
    autoplay: true,//是否自动切换	
    interval: 5000,//自动切换时间间隔	
    duration: 1000,//滑动动画时长
    groupList: [],
    invited_id: '',
    order:[],
    qrcode:''
  },
  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },
  weiper_click: function (e) {
    console.log(e)
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function (options) {
    var that = this;
    var scene = decodeURIComponent(options.q);
    that.setData({
      qrcode: scene
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    if (options.invited_id){
      that.setData({
        invited_id: options.invited_id,
      })
    }
    
    // that.login()
   
  },
  

  onReady:function(){
    var that = this;
    var invited_id = that.data.invited_id;
    
    if (invited_id > 0 ) {
      setTimeout(function () {

        that.invit_pay(invited_id);//自己调用自己

      }, 1000)
    }
    var qrcode = that.data.qrcode;
    if (qrcode != '' && qrcode != 'undefined') {
      that.jump_url(qrcode);
    }
  },

  jump_url:function (scene) {
    var token = wx.getStorageSync('token');
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/is_activation',
      data: {
        qrcode: scene,
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        if (res.data.code == 200) {
          wx.navigateTo({
            url: '/pages/activation/activation?qrcode=' + scene,
          })
        } else {
          console.log(res.data.data.id)
          wx.navigateTo({
            url: '/pages/vipBookDetail/vipBookDetail?id=' + res.data.data.id,
          })
        }
      }
    })
  },

  invit_pay: function (invited_id){
    var that = this
    var userId = wx.getStorageSync('userId');
    var token = wx.getStorageSync('token');
    if (invited_id == userId){
  return;
    }
    wx.showLoading({
      title: '支付中',
    })
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/order_vip',
      data: {
        invited_id: invited_id,
        userId: userId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        console.log(res);
        if (res.data.code === 200) {
            that.setData({
              order:res.data.data
            })
            if(res.data.data.status != 1){
              that.pay();
            }else{
              wx.showToast({ title: '您已为该好友助力', icon: 'none' });
            }
            
        } else {
          wx.showToast({ title: res.data.message, icon: 'none' });
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
            title: '书友会vip助力',
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
    var invited_id = that.data.invited_id;
    var userId = wx.getStorageSync('userId');
    var token = wx.getStorageSync('token')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/update_order',
      data: {
        order: that.data.order.order_number,
        invited_id: invited_id,
        userId: userId
      },
      header: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token,//Bearer后面要加空格
      },
      method: "POST",
      success: function (res) {
        wx.navigateTo({
          url: '/pages/index/index',
        })
      }
    })
  },

  //  点击书友会会员跳转
  is_vip:function(e){
    var that = this;
    var userId = wx.getStorageSync('userId');
    console.log(1);
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/check_vip',
      data: {
        t: 'GetGroupForUserId',
        UserId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        //console.log(res.data.code)
        if(res.data.code == 200){
          if(res.data.data == 1){
            wx.navigateTo({
              url: '/pages/invitation/invitation',
           })
          }else{
            wx.navigateTo({
              url: '/pages/joinJuide/joinJuide',
            })
          }
        }else{
          wx.showToast({
            title: '您未关注公众号或未登录',
          })
        }
       
      }
    })
  },

  // 获取已加入的书吧信息
  getGroupList: function (e) {
    var that = this;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'GetGroupForUserId',
        UserId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading()
        // 如果没有书吧就显示默认的
        if (res.data.GroupsList.length > 0) {
          that.setData({
            groupList: res.data.GroupsList,
          })
        } else {
          that.setData({
            groupList: res.data.AreaGroupsList,
          })
        }
      }
    })
  },
  
  upper: function (e) {
    console.log(e)
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    that.getGroupList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //微信登录
  // login: function () {
  //   var that = this
  //   var token = wx.getStorageSync('token')
  //   //本地无token再进行登录
  //   if (token == '') {
  //     wx.login({
  //       success: res => {
  //         //微信静默授权 并在后台生成token
  //         wx.request({
  //           url: 'https://na.bookfan.cn/api/mini/program/auth',
  //           data: {
  //             code: res.code
  //           },
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           method: "POST",
  //           success: function (res) {
  //             //本地保存token
  //             var token = res.data.data.token
  //             wx.setStorageSync('token', token)
  //             that.checkUserInfo(token)
  //           }
  //         })
  //       }
  //     })
  //   } else {
  //     that.checkUserInfo(token)
  //   }
  // },
  // // 判断本地是否有userId 如果没有就去后台数据检查
  // checkUserInfo: function (token) {
  //   wx.request({
  //     url: 'https://na.bookfan.cn/api/mini/program/checkUserInfo',
  //     header: {
  //       'Accept': 'application/json',
  //       'Authorization': 'Bearer ' + token,//Bearer后面要加空格
  //     },
  //     method: "POST",
  //     success: function (res) {
  //       var data = res.data
  //       if (data.code === 200) {
  //         wx.setStorageSync('userId', data.data.user_id)
  //       } else {
  //         wx.redirectTo({
  //           url: '/pages/bindPhone/bindPhone?from=app',
  //         })
  //       }
  //     }
  //   })
  // },
})
