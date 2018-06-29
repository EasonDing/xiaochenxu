// pages/vipBookDetail/vipBookDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    book_id:'',
    u_info:[],
    look_info:[],
    liuyan_info:[],
    book_info:[],
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      book_id:options.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    that.bookDetail();
    //that.book_look();
  },

  bookDetail:function(){
    var that = this;
    var book_id = that.data.book_id;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/vipBookDetail',
      data: {
        userId: userId,
        book_id: book_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        if(res.data.code == 500){
          wx.showToast({ title: res.data.message, icon: 'none' });
        }else{
          that.setData({
            u_info:data.u_info,
            book_info:data.book_info,
            look_info:data.look_info,
            liuyan_info:data.liuyan_info
          })
        }
      }
    })
  },

  content:function(event){
    var that = this;
    var content = event.detail.value;
    that.setData({
      content:content
    })
  },

  send_message:function(){
    var that = this;
    var book_id = that.data.book_id;
    var userId = wx.getStorageSync('userId');
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/add_message',
      data: {
        userId: userId,
        book_id: book_id,
        message:that.data.content
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data.data;
        console.log(data);
        wx.showToast({ title: res.data.message, icon: 'none' });
        if (res.data.code == 200){
          that.setData({
            liuyan_info:data
          })
        }
      }
    })
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