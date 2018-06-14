// pages/blog/blog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    // 帖子
    blog: [],
    blogCommentList: [],
    commentText: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getBlog(options.blogId)
  },

  //获取帖子详情
  getBlog:function(blogId){
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'GetBlogDetailByBlogId',
        BlogId: blogId,
        UserId: userId,
        page: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          blog: res.data.BlogInfo,
          blogCommentList: res.data.LatestCommentList
        })
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

  //提交评论
  formSubmit: function (e) {
    var that = this;
    var userId = wx.getStorageSync('userId')
    if (!e.detail.value.comment) {
      that.showTopTips('请输入评论内容')
      return false;
    }
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/comment.php',
      data: {
        t: 'AddCommentInfo',
        UserId: userId,
        Type: 2,//评论类型(1.图书 2.帖子 3专栏)
        AltId: e.detail.value.blogId,
        Content: e.detail.value.comment
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.openToast('评论成功')
        var data = e.detail.value.comment
        that.setData({
          commentText: ''
        })
        that.getBlog(e.detail.value.blogId)
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