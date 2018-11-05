// pages/join_pay/join_pay.js
var app = getApp();
var num_slice = require('../aa.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_join: false, //是否已参团
    money: '', //尾款价格
    is_pay: false, //是否可以支付
    asyn: true, 
    user_bind: false, // 用户是否绑定
    load: true, //第一次加载
    hasUserInfo: false,
    is_VIP: false,
    is_ios: false
  },
  // 登陆成功后获取数据
  login_success: function (e) {
    this.setData({
      user_bind: true,
      load: false,
      hasUserInfo: true,
      is_join: app.open_user.has_team,
      money: num_slice.num_slice(app.join_money),
      is_pay: app.is_pay,
      is_VIP: app.open_user.isFinalVIp
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
    num_slice.getuser(this)
    wx.setNavigationBarTitle({
      title: '百人拼团',
    });
  },
  join_vip: function () {
    wx.navigateTo({
      url: '../vip_tips/vip_tips?type=long_vip'
    });
  },
  go_pay: function () {
    var that = this;
    console.log(that.data.index)
    if (app.open_user.xcx_openid) {
      var kind = '';
      var description = '';
      if(!this.data.is_join&&!this.data.is_pay){
        kind = '3'
        description = '永久VIP拼团定金'
      }else if(this.data.is_join && this.data.is_pay){
        if(this.data.money == '27,000'){
          kind = '7'
        }else if (this.data.money == '17,000'){
          kind = '8'
        }
        description = '永久VIP拼团尾款'
      }
      console.log(kind)
      wx.request({
        url: app.url.pay,
        method: 'POST',
        data: {
          openId: app.open_user.xcx_openid,
          uid: app.open_user.uid,
          phone_number: app.open_user.phone_number,
          order_kind: kind,
          description: description
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
        fail: () => {
          wx.showModal({
            title: '提示',
            content: '网络异常，请稍后重试！',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: res => {
              if(res.confirm){}
            }
          });
        }
      });
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.bind){
     this.login_success()
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