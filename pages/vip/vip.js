// pages/vip/vip.js
var app = getApp()
var num_transition = require('../aa.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_ios:false,
    banner: [{'banner_img':'/web_image/vip/banner1.jpeg'}], // banner图
    advert: {'center_adv':'/web_image/vip/banner.png'}, //首页数据
    people_number: '',
    time: '',
    d: '',
    h: '',
    m: '',
    s: '',
    old_money: [],
    new_money: [],
    asyn: true,
    user_bind: false, // 用户是否绑定
    load: true, //第一次加载
    hasUserInfo: false,
    pay_text:'去抢购',
    team_status: false // 是否取消拼团

  },
  // 登陆成功后获取数据
  login_success: function (e) {
    this.setData({
      user_bind: true,
      load: false,
      hasUserInfo: true,
    })
    if (this.type == "long_vip") {
      this.long_vip()
    } else if (this.type == "video_vip") {
      this.video_vip()
    } else if (this.type == "mt_vip") {
      this.mt_vip()
    } else if (this.type == "join") {
      this.join_pay()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(app.system == 'ios'){
        this.setData({
          pay_text:'了解详情',
          is_ios: true
        })
      }
    console.log(options)
    if(options.course == 'true'){
      wx.navigateTo({
        url: '../course_item/course_item?id='+options.course_id
      });
    }
    num_transition.getuser(this)
    var that = this;
    that.a_jax(that)
  },
  a_jax: function (that) {
    wx.request({
      url: app.url.homeData,
      method: 'GET',
      data: {},
      header: 'application/x-www-form-urlencoded',
      success: (e) => {
        console.log(e)
        var data = e.data.data
        app.advert = data.advert
        app.join_money = data.team_price
        app.is_pay = data.remain_payment
        app.is_refund = data.is_refund
        var new_money = {};
        new_money.online_video_price = num_transition.num_slice(data.advert.online_video_price);
        new_money.vip_price = num_transition.num_slice(data.advert.vip_price)
        that.setData({
          banner: data.banner,
          advert: data.advert,
          people_number: data.people_number,
          time: data.advert.count_down,
          new_money: new_money,
          team_status: data.team_status
        })
        // this.countTime()
      },
      fail: () => {}
    });
  },
  getUserInfo_user: function (e) {
    var type = e.currentTarget.dataset.type;
    this.type = type
    num_transition.login(this, e)
    app.first_user = true;
  },
  // 倒计时
  countTime: function () {
    var that = this;
    // 获取倒计时时间
    // ==========================
    var times = that.data.time;
    // ==========================
    //获取当前时间
    var date = new Date();
    var now = parseInt(date.getTime());
    //时间差

    var leftTime = times * 1000 - now;
    //定义变量 d,h,m,s保存倒计时的时间
    var d, h, m, s;
    if (leftTime >= 0) {
      d = Math.floor(leftTime / 1000 / 60 / 60 / 24);
      h = (Math.floor(leftTime / 1000 / 60 / 60 % 24) + 100 + '').substr(1);
      m = (Math.floor(leftTime / 1000 / 60 % 60) + 100 + '').substr(1);
      s = (Math.floor(leftTime / 1000 % 60) + 100 + '').substr(1);
    }
    //将倒计时赋值到div中
    that.setData({
      d: d,
      h: h,
      m: m,
      s: s
    })
    //递归每秒调用countTime方法，显示动态时间效果
    setTimeout(that.countTime, 1000);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.data.load = false
    this.setData({
      load: false
    })
  },
  imgload: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth; //获取当前屏幕的宽度
    var imgh = e.detail.height; //图片高度
    var imgw = e.detail.width; //图片宽度
    var swiperH = winWid * imgh / imgw //等比设置swiper的高度。 即 屏幕宽度 / swiper高度 = 
    this.setData({
      bannerheight: swiperH + 'px'
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  long_vip: function () {
    console.log('ss')
    var that = this;
    if (that.data.user_bind) {
      wx.navigateTo({
        url: '../long_vip_pay/long_vip_pay'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未绑定学院账号，是否前往绑定',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: e => {
          if (e.confirm) {
            that.type = 'video_vip'
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      });
    }
  },
  video_vip: function () {
    var that = this;
    if (that.data.user_bind) {
      wx.navigateTo({
        url: '../video_vip_pay/video_vip_pay'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未绑定学院账号，是否前往绑定',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: e => {
          if (e.confirm) {
            that.type = 'video_vip'
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      });
    }
  },
  mt_vip: function () {
    var that = this;
    if (that.data.user_bind) {
      wx.navigateTo({
        url: '../mt_vip/mt_vip'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未绑定学院账号，是否前往绑定',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: e => {
          if (e.confirm) {
            that.type = 'mt_vip'
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      });
    }
  },
  join_pay: function () {
    var that = this;
    if (that.data.user_bind) {
      wx.navigateTo({
        url: '../join_pay/join_pay'
      });
    } else {
      wx.showModal({
        title: '提示',
        content: '您尚未绑定学院账号，是否前往绑定',
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: e => {
          if (e.confirm) {
            that.type = 'join'
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      });
    }
  },
    // 首页课程跳转
    jump_course:function (e) {
      var id = e.currentTarget.id;
      var nav = e.currentTarget.dataset.kind - 1;
      wx.navigateTo({
        url: "../course_item/course_item?id="+id+"&nav="+nav
      });
    },
  onShow: function () {
    if (app.bind) {
      num_transition.getuser(this)
      this.a_jax(this)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("dsad")
    this.type = ''
  },
  banner: function (e) {
    var kind = e.currentTarget.dataset.type;
    var id = e.currentTarget.dataset.id;
    console.log(e)
    switch (true) {
      // 课程
      case kind == 1:
        wx.navigateTo({
          url: '../course_item/course_item?id=' + id
        });
        this.setData({
          advertising: false
        })
        break;
      case kind == 2:
        wx.navigateTo({
          url: "../teacher/teacher"
        })
        break;
        // 双十一广告跳转
      case kind == 3:
        wx.navigateTo({
          url: "../double_eleven/double_eleven"
        });
    }
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