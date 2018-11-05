// pages/user_vip/user_vip.js
var app = getApp()
var login = require('../aa.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: {},
    load:false,
    img:['1_no','2_no','3_no'],
    text:[],
    h:'',
    hasUserInfo:false,
    is_ios: false
  },
  login_success: function (e) {
    this.setData({
      user_bind: e,
      hasUserInfo: true
    })
    this.is_vip()
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
    wx.setNavigationBarTitle({
      title: '会员中心',
    });
    var hasUserInfo = false
    if(app.globalData.userInfo != null){
      hasUserInfo = true
    }
    this.setData({
      load:true,
      user_info:app.open_user,
      h: new Date().getHours(),
      hasUserInfo:hasUserInfo
    })
    this.is_vip();
  },
  is_vip:function () {
    var data = this.data
    var img = ['','','']
    var text = ['','','']
    if(JSON.stringify(data.user_info) != '{}'){
      if(data.user_info.isFinalVIp){
        img = ['1','2','3']
        text = ['','永久','永久']
      }else{
        img[0] = '1_no'
        if(data.user_info.EduVIp != ''){
          img[1] = '2'
          text[1] = data.user_info.EduVIp
        }else {
          img[1] = '2_no'
        }
  
        if(data.user_info.MatiVip != ''){
          img[2] = '3'
          text[2] = data.user_info.MatiVip
        }else{
          img[2] = '3_no'
        }
      }
    }else{
      img = ['1_no','2_no','3_no']
    }
    this.setData({
      img:img,
      text:text
    })
  },
  go_vip_pay:function (e) {
    var data = this.data
    var id = e.currentTarget.dataset.id - 1;
    console.log(id)
    if(app.bind){
      if(id == 0){
        if(!data.user_info.isFinalVIp){
            wx.navigateTo({
              url: '../long_vip_pay/long_vip_pay'
            });
        }
      }else if(id == 1){
        if(data.user_info.EduVIp == ''){
          wx.navigateTo({
            url: '../video_vip_pay/video_vip_pay'
          });
        }
      }else if(id == 2){
        if(data.user_info.MatiVip == ''){
          wx.navigateTo({
            url: '../mt_vip/mt_vip'
          });
        }
      }
    }else{
      wx.showModal({
        title: '提示',
        content: '您尚未绑定学院账号，是否前往绑定',
        success: e => {
          if (e.confirm) {
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      })
    }
  },
  getUserInfo_user:function (e) {
    login.login(this, e)
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
    if(app.globalData.userInfo != null){
      this.setData({
        hasUserInfo: true
      })
    }
    if(app.bind){
      this.setData({
        user_info:app.open_user
      })
      this.is_vip()
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