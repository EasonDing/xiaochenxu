// pages/activation/activation.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pic_url:'',
    qrcode:'',
    book_name:'',
    book_auther:'',
    book_cbs:'',
    book_liuyan:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.qrcode){
      that.setData({
        qrcode: options.qrcode
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
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  bookname: function (event){
    var that = this;
    that.setData({
      book_name: event.detail.value
    })
    
  },

  bookcbs: function (e) {
    var that = this;
    this.setData({
      book_cbs: e.detail.value
    })
  },
  bookauther: function (e) {
    var that = this;
    this.setData({
      book_auther: e.detail.value
    })
  },
  bindTextAreaBlur: function (e) {
    var that = this;
    this.setData({
      book_liuyan: e.detail.value
    })
  },

  submit_book:function(){
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://na.bookfan.cn/api/mini/user/upload_book',
      data: {
        book_name:that.data.book_name,
        bookcbs: that.data.book_cbs,
        bookauther: that.data.book_auther,
        book_liuyan: that.data.book_liuyan,
        pic_url: that.data.pic_url,
        userId:userId,
        qrcode: that.data.qrcode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        wx.showToast({ title: res.data.message, icon: 'none' });
        if(res.data.code == 200 ){
          wx.navigateTo({
            url: '/pages/index/index',
          })
        }
      }
    })
  },

  upload_pic:function(){
    var userId = wx.getStorageSync('userId');
    var that = this;
    wx.chooseImage({
      count: 3,  //最多可以选择的图片总数  
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有  
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片  
        var tempFilePaths = res.tempFilePaths;
        //console.log(tempFilePaths);return false;
        //启动上传等待中...  
        wx.showToast({
          title: '正在上传...',
          icon: 'loading',
          mask: true,
          duration: 10000
        })
        wx.uploadFile({
          url: 'https://na.bookfan.cn/api/mini/user/upload_pic',
          filePath: tempFilePaths[0],
          name: 'book_pic',
          formData: {
            'userId': userId
          },
          header: {
            "Content-Type": "multipart/form-data"
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            console.log(data);
            wx.hideToast();
            if(data.code == 200){
              that.setData({
                pic_url: data.data.path
              });
            }
            wx.showToast({ title: data.message, icon: 'none' });
            
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        }); 
      }
    })
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