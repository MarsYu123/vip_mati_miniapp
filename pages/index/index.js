//index.js
//获取应用实例
const app = getApp()
var userlogin = require('../aa.js');

Page({
  data: {
    wx_tx: "https://home.mati.hk/Public/web_image/index/wx_tx.png", //默认头像
    user_msg: {}, //用户信息
    user_bind: false, // 用户是否绑定
    load: true, //第一次加载判断
    load_active: false, //已登录
    advertising: false, // 广告
    course_id:'',//广告跳转课程id
    time:'',
    hasUserInfo:false
  },
  // 登陆成功后获取数据
  login_success:function (e) {
    var data = e;
    if(JSON.stringify(data) != '{}'){
      if(data.city.length > 0 && data.province.length > 0 && data.province.indexOf('/') == '-1'){
        if(e.city.length>0){
          if(e.city.indexOf('/') == '-1'){
            data.city = "/"+data.city
          }
        }
      }
      this.setData({
        user_msg: data,
        user_bind:true,
        load_active: true,
        wx_tx:app.globalData.userInfo.avatarUrl,
        hasUserInfo:true
      })
    }
  },
  onLoad: function (e) {
    wx.hideShareMenu()
    var that = this;
    that.type = 'index'
    userlogin.getuser(that)
    wx.setNavigationBarTitle({
      title: '个人中心'
    })
    var time = new Date
    time = time.getHours()
    that.setData({
      time: time,
      load: false
    })
  },

  //每次显示首页将重新获取数据
  onShow: function (e) {
    this.type = '';
    if (app.bind) {
      this.login_success(app.open_user)
    }
  },
  // 跳转到试听券页面
  free_voucher:function () {
    wx.navigateTo({
      url: "../free_voucher/free_voucher"
    });
  },

  //购买学习卡
  shop_card: function (e) {
    if (!app.open_user.disabled) {
      if (this.data.user_bind) {
        wx.navigateTo({
          url: '../pay/pay'
        })
      } else {
        wx.showModal({
          title: "提示",
          content: '您未绑定学院账号，是否前往绑定？',
          success: e => {
            if (e.confirm == true) {
              wx.navigateTo({
                url: '../login/login'
              })
            }
          }
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '您的账号已被冻结！',
      })
    }
  },
  //登陆进入注册页面
  user_enter: function (e) {
    if (!app.open_user.disabled) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您的账号已被冻结！',
      })
    }

  },
  // 进入会员中心
  my_vip:function () {
    wx.navigateTo({
      url: '../user_vip/user_vip'
    });
  },
  //首次进入小程序获取权限，
  getUserInfo_user: function (e) { //登陆
    //用户点击同意，获取权限
    this.type = "user";
    userlogin.login(this, e)
    app.first_user = true;
  },
  getUserInfo_pay: function (e) { //购买
    this.type = "pay";
    userlogin.login(this, e);
    app.first_user = true;
  },
  user_edit: function (e) { //修改资料
    wx.navigateTo({
      url: "../user_edit/user_edit"
    })
  },

  //页面跳转
  course: function () {
    wx.navigateTo({
      url: "../course/course"
    })
  },
  order: function () {
    wx.navigateTo({
      url: "../order/order"
    })
  },
  help: function () {
    wx.navigateTo({
      url: "../help/help"
    })
  },
  purchased: function () {
    wx.navigateTo({
      url: "../my_courses/my_courses"
    })
  },
  chance: function () {
    wx.navigateTo({
      // url: "../remain_num/remain_num"
      url: "../one_play/one_play"
    })
  },
  //转发
  share: function (e) {
    wx.onShareAppMessage()
  },
  onShareAppMessage: function (e) {
    return {
      title: '马蹄家MTHome，为你的设计思维充电',
      path: 'pages/vip/vip?type=uid_'+app.open_user.uid,
      imageUrl: 'https://home.mati.hk/Public/web_image/share/share.jpg?time='+this.data.time
    }
  },
  onHide: function () {

  },
  call:function(){
    wx.navigateTo({
      url:'../web_view/web_view?url=call'
    });
  }
})