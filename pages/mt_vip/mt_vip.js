// pages/mt_vip/mt_vip.js
var num_slice = require('../aa.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 4,
    new_money: '',
    asyn: true,
    user_bind: false, // 用户是否绑定
    load: true, //第一次加载
    hasUserInfo: false,
    money:'9',
    is_ios:false
  },
  // 登陆成功后获取数据
  login_success: function (e) {
    this.setData({
      user_bind: true,
      load: false,
      hasUserInfo: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    num_slice.getuser(this)
    wx.setNavigationBarTitle({
      title: '马蹄网VIP会员',
    });
    if(app.system == 'ios'){
      this.setData({
        is_ios: true
      })
    }
  },
  getUserInfo_user:function (e) {
    num_transition.login(this, e)
    app.first_user = true;
  },
  go_pay: function () {
    var that = this;
    console.log(that.data.index)
    if (app.open_user.xcx_openid) {
      if(!app.open_user.isFinalVIp){
        wx.request({
          url: app.url.pay,
          method: 'POST',
          data: {
            openId: app.open_user.xcx_openid,
            uid: app.open_user.uid,
            phone_number: app.open_user.phone_number,
            order_kind: that.data.index,
            description: '马蹄学院视频VIP会员'
          },
          header: app.header,
          success: (e) => {
            console.log(e)
            var pay = {};
            pay.timeStamp = e.data.timeStamp;
            pay.nonceStr = e.data.nonceStr;
            pay.package = e.data.package;
            pay.signType = e.data.signType;
            pay.paySign = e.data.paySign;
            num_slice.pay(pay, that)
          },
          fail: () => {}
        });
      }else{
        wx.showToast({
          title: '您已是永久VIP，已享有所有权益',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    } else {
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
  mt_tips:function () {
    wx.navigateTo({
      url: '../vip_tips/vip_tips?type=mt_vip'
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  checked: function (e) {
    var id = e.currentTarget.id;
    var money = ''
    if(id == 4){
      money = '9'
    }else if (id == 5){
      money = '99'
    }else if(id == 6){
      money = '990'
    }
    this.setData({
      index: id,
      money: num_slice.num_slice(money)
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.bind) {
      num_slice.getuser(this)
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