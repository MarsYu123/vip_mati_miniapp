// pages/home/home.js
var app = getApp();
var userlogin = require('../aa.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    advertising: false, // 广告
    animate: {}, //动画
    // time:3//倒计时
    course_id: '', //广告跳转课程id
    bannerheight: "",
    userInfo: {}, //获取授权信息
    hasUserInfo: false, //授权成功状态
    video:'',//视频组件
    advert:{},//广告
    bannerid:'',
    load_flag:false,
    history:{}, //往期课程
    online:{}, //上线
    user_info:{},//用户信息
    is_ios: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  login_success:function (e) {
    console.log(e)
    this.setData({
        userInfo:app.globalData.userInfo,
        hasUserInfo: true,
        user_info:e,
        load_flag: true
    })  
  },
  onLoad: function (options) {
    if(app.system == 'ios'){
      this.setData({
        is_ios: true
      })
    }
    wx.hideShareMenu()
    var that = this;
    that.type = 'index'
    wx.setNavigationBarTitle({
      title: '马蹄课程'
    })
    wx.request({
      url: app.url.homeAdvert,
      method: 'POST',
      data: {},
      header: 'application/x-www-form-urlencoded', 
      success: e => {
        var data = e.data.data;
        console.log(e)
        if (data.is_maintained) {
          app.maintained = true
          wx.showLoading({
            title: "正在维护",
            mask: true,
          });
        } else {
          userlogin.getuser(that)
          that.setData({
            history: data.history,
            online: data.online
          })
          if (data.is_buy == 0) {
            that.setData({
              course_id: data.advert.course_id
            })
          }
        }
      },
      fail: () => {}
    });
    this.data.load_flag = true;
  },
  join_course:function (e) {
    var id = e.currentTarget.dataset.id;
    var kind = e.currentTarget.dataset.course_kind
    wx.navigateTo({
      url: '../course_item/course_item?id='+id+'&nav='+kind
    });
  },
  jump_course:function (e) {
    var id = e.currentTarget.id;
    var kind = e.currentTarget.dataset.kind;
    wx.navigateTo({
      url: '../course_item/course_item?id='+id+'&nav='+kind
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
    var that = this;
    this.type="";
    console.log(app.bind)
    if (app.bind) {
      userlogin.getuser(that);
    }
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