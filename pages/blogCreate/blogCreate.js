// pages/blogCreate/blogCreate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTopTips: false,
    filePaths: [],//上传的图片
    files: [],
    groupId: '',
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          filePaths: that.data.filePaths.concat(res.tempFilePaths),
          files: that.data.files.concat(res.tempFiles)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.filePaths // 需要预览的图片http链接列表
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
      duration: 2000
    });
  },

  

  formSubmit:function(e) {
    var that = this;
    var userId = wx.getStorageSync('userId')
    var content = e.detail.value.content;
    var imgCount = that.data.filePaths.length;
    if(imgCount > 3) {
      that.showTopTips('最多上传5张图片')
      return false;
    }
    if (content == '') {
      that.showTopTips('请输入内容')
      return false;
    }

    // for (var i=0; i<imgCount; i++) {
    //   wx.setStorageSync('ImageData' + i, that.data.files[i])
    // }
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'AddBlogInfo',
        UserId: userId,
        Content: content,
        GroupId: that.data.groupId,
        ImageCount: imgCount
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.openToast()
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      groupId: options.groupId
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