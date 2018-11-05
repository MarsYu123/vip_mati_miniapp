//app.js
var unlock = require('pages/aa.js');
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    for (var i in this.url) {
      this.url[i] = this.dns + this.url[i]
    }
    wx.setStorageSync('source', options.query.type);
    // wx.setStorageSync('share', options.query.share_result);
    console.log("来源" + wx.getStorageSync("source"))
    // console.log("分享人"+wx.getStorageSync("share"))

    var that = this;
    wx.getSystemInfo({
      success: res => {
        console.log(res)
        that.system = res.platform
        if(res.model == 'iPhone 6'){
          that.system = 'ios'
          console.log(that.system)
        }
      }
    });
    // 版本更新重启服务
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) { // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) { // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () { // 新的版本下载失败
    })


  },
  code: '', //login的code
  //获取授权信息
  globalData: {
    userInfo: null
  },
  //用户加密信息 
  userInfo: {
    user: null
  },
  dns: 'https://home.mati.hk/api',
  url: {
    homeData: '/Index/homeData', //vip页面数据
    homeAdvert: '/index/homeAdvert', //首页广告
    login: "/Login/login", //登陆接口
    unlock: "/Login/user_info", //解密获取openid接口
    pay_start: "/wechat/paysfee", //发起支付接口
    pay_back: "/wechat/orderStatus", //支付结果返回接口
    phone_login: "/Login/send_msg_code", //绑定手机接口
    check_num: "/Login/msg_code_verify", //绑定接口
    user_register: "/Login/user_register", //注册接口
    course: "/Course/courseData", //课程接口
    getOneCourse: "/course/getOneCourse", //课程详情
    hasBought: "/wechat/hasBought", //课程借口查询是否购买单次
    getUserData: "/user/getUserData", //接受资料
    personalData: "/user/personalData", //修改资料
    getCardDetail: "/card/getCardDetail", //获取卡次信息
    getOrder: "/Order/allOrder", //查询全部订单
    completedOrder: "/Order/completedOrder", //已完成订单
    cancelOrder: "/Order/cancelOrder", // 取消订单
    getInvoice: "/order/getInvoice", //可开发票
    doneInvoice: "/order/doneInvoice", //已开发票
    getCancelOrder: "/order/getCancelOrder", //已取消订单
    insertInvoice: "/order/insertInvoice", //提交发票请求
    boughtCourse: "/course/boughtCourse", //获取已购课程
    getBoughtCourse: "/course/getBoughtCourse", //单次购买订单查询
    freeTicket: "/User/freeTicket", //试听券
    applyForCourse: "/Course/applyForCourse",
    studyRecord: "/Course/studyRecord", //学习记录
    pay: '/Pay/pay', //vip购买接口，所有vip购买均通过此接口
    refundAdd: '/Pay/refundAdd' //退款
  },
  //登陆情况
  userflag: {
    flag: false
  },
  //post请求的header头
  header: {
    "Content-Type": "application/x-www-form-urlencoded"
  },
  // 用户所有信息
  open_user: {},
  bind: false, //已绑定
  load_flag: false, //首次登录
  invoice: {}, //发票信息
  session: '',
  first_user: false, //第一次登陆
  advertising: false, //是否弹出过广告
  maintained: false, //是否调试
  advert: {}, //活动信息
  join_money: '', //拼团优惠金额
  is_pay: '', //是否开启拼团支付
  join_money: '',
  is_refund: false,
  system: '' //手机系统
})