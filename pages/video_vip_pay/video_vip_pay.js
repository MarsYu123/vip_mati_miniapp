// pages/video_vip_pay/video_vip_pay.js
var app = getApp()
var num_transition = require('../aa.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    new_money: '',
    asyn: true,
    user_bind: false, // 用户是否绑定
    load: true, //第一次加载
    hasUserInfo:false,
    is_ios:false
  },
  // 登陆成功后获取数据
  login_success: function (e) {
    this.setData({
      user_bind: true,
      true: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.system == 'ios'){
      this.setData({
        is_ios: true
      })
    }
    this.setData({
      new_money: num_transition.num_slice(app.advert.online_video_price)
    })
    num_transition.getuser(this)
    wx.setNavigationBarTitle({
      title: '线上视频VIP会员',
    });
  },
  go_pay: function () {
    var that = this;
    if (app.open_user.xcx_openid) {
      if(!app.open_user.isFinalVIp){
        wx.request({
          url: app.url.pay,
          method: 'POST',
          data: {
            openId: app.open_user.xcx_openid,
            uid: app.open_user.uid,
            phone_number: app.open_user.phone_number,
            order_kind: '2',
            description: '马蹄学院视频VIP会员'
          },
          header: app.header,
          success: (e) => {
            var pay = {};
            pay.timeStamp = e.data.timeStamp;
            pay.nonceStr = e.data.nonceStr;
            pay.package = e.data.package;
            pay.signType = e.data.signType;
            pay.paySign = e.data.paySign;
            num_transition.pay(pay, that)
          },
          fail: () => {
            wx.showToast({
              title: "网络异常，请稍后重试",
              icon: 'none',
              duration: 1500,
              mask: false,
            });
          }
        });
      }else{
        wx.showToast({
          title: '您已是永久VIP，已享有所有权益',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '您尚未绑定学院账号，是否前往绑定',
        success: e => {
          var url = '../login/login?type='
          if (e.confirm) {
            if (course_id) {
              url = url + jump_type + '&course_id =' + id
            } else {
              url = url + jump_type
            }
            wx.navigateTo({
              url: url
            })
          }
        }
      })
    }
  
  },
  getUserInfo_user:function (e) {
    num_transition.login(this, e)
    app.first_user = true;
  },
  video_tips:function () {
    wx.navigateTo({
      url: '../vip_tips/vip_tips?type=video_vip'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.bind) {
      num_transition.getuser(this)
    }
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