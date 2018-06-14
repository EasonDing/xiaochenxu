var sliderWidth = 110; // 需要设置slider的宽度，用于计算中间位置

Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupInfo: {},
    groupId: '',
    memberCount: 0,//书吧用户总数
    groupUserPart: [],//展示部分用户
    groupUserAll: [],//全部用户
    // navBar 
    tabs: ['专栏','书架', '贴吧'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    columnList: [],//专栏列表
    bookList: [],// 书架列表
    blogList: [],// 帖子
    isJoinGroup: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中...',
    //   mask: true
    // })
    var that = this;
    that.getGroupInfo(options.groupId) //获取书吧信息
    that.getColumnList(options.groupId) //获取专栏列表
    that.getBookList(options.groupId) //获取书架列表

    that.setData({
      groupId: options.groupId
    })
    
    //tabar 需要计算间距
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
  // 获取书吧详情
  getGroupInfo: function(groupId) {
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'GetGroupInfoById',
        UserId: userId,
        GroupId: groupId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        // 循环，只拿5个用户的信息进行展示
        var groupUserPart = [];
        for(var i=0; i<5; i++ ){
          groupUserPart[i] = res.data.MembersList[i]
        }
        that.setData({
          groupInfo: res.data.GroupInfo,
          memberCount: res.data.MemberCount,
          groupUserPart: groupUserPart,
          groupUserall: res.data.MembersList
        })
      }
    })
  },

  //获取专栏列表
  getColumnList: function(groupId){
    var that = this;
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'Columns',
        page: 1,
        GroupId: groupId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          columnList: res.data.ColumnList
        })
      }
    })
  },

  //获取书吧书架列表
  getBookList: function(groupId){
    var that = this;
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/book.php',
      data: {
        t: 'GetCollectBookInfo',
        Type: 2,
        AltId: groupId,
        page: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          bookList: res.data.BooksListIn
        })
      }
    })
  },

  //获取帖子列表
  getBlogList: function (groupId) {
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'GetBlogInfoByGroupId',
        UserId: userId,
        GroupId: groupId,
        page: 1,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        that.setData({
          blogList: res.data.BlogsList
        })
      }
    })
  },

  //查询是否加入过该书吧
  isJoinGroup: function () {
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://na.bookfan.cn/api/bookfan/group/isJoinGrouop',
      data: {
        userId: userId,
        groupId: that.data.groupId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        var data = res.data
        //标识是否加入书吧
        if (data.code === 200) {
          that.setData({
            isJoinGroup: true
          })
        } else {
          that.setData({
            isJoinGroup: false
          })
        }
      }
    })
  },

  joinGroup:function () {
    var that = this;
    var userId = wx.getStorageSync('userId')
    wx.request({
      url: 'https://m.bookfan.cn/admin/servlet/group.php',
      data: {
        t: 'UpdateGroupInfo',
        ActionType: 2,
        UserId: userId,
        GroupId: that.data.groupId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "POST",
      success: function (res) {
        console.log(res)
        var data = res.data
        if (data.code == 1) {
          that.setData({
            isJoinGroup: true
          })
          wx.showToast({
            title: '加入成功',
          })
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
    this.getBlogList(this.data.groupId)
    // this.isJoinGroup()
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

  },
  // navBar 导航
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  }
})