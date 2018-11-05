// pages/pay/pay.js
var login = require('../aa.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: "", //卡号
    num: 1, //数量
    unit_price: "38000", //单价
    money: 0, //总价
    open_window: false, //弹窗
    animate: {}, //遮罩层
    asyn: true,
    type: "", //跳转入口标识
    couse_id: "" //课程id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: "购买学习卡"
    });
    var type = "",
      course_id = "";
    if (options.type) {
      type = options.type;
    }
    if (options.course_id) {
      course_id = options.course_id;
    }
    this.setData({
      money: this.num_slice(1),
      type: type,
      course_id: course_id,
      phone: app.open_user.phone_number
    });
  },
  sub: function() {
    var num = this.data.num;
    var money = this.data.money;
    if (num > 1) {
      num--;
      this.setData({
        num: num,
        money: this.num_slice(num)
      });
    }
  },
  add: function() {
    var num = this.data.num;
    var money = this.data.money;
    if(num<10){
      num++;
      this.setData({
        num: num,
        money: this.num_slice(num)
      });
    }else{
      wx.showToast({
        title: '单次最多购买10份学习卡（即100次兑换课程次数）',
        icon: 'none',
        duration: 3000,
        mask: true
      })
    }
  },
  num_slice: function(e) {
    var e = e * this.data.unit_price;
    var e = String(e);
    var money = e.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    return money;
  },
  //向服务器发送支付请求并获取支付信息
  pay_start: function() {
    if (this.data.asyn == true) {
      this.setData({
        asyn: false
      });
      var that = this;
      var pay_fee = that.data.money.replace(/,/g, "");
      wx.request({
        url: app.url.pay_start,
        method: "POST",
        header: app.header,
        data: {
          total_fee: pay_fee,
          pay_name: "study_card",
          openId: app.open_user.xcx_openid,
          uid: app.open_user.id,
          count: that.data.num,
          phone_number: app.open_user.phone_number,
          card_category:1,
          order_kind: 0//0为学习卡1单次
        },
        success: e => {
          var pay = {};
          pay.timeStamp = e.data.timeStamp;
          pay.nonceStr = e.data.nonceStr;
          pay.package = e.data.package;
          pay.signType = e.data.signType;
          pay.paySign = e.data.paySign;
          that.pay(pay);
        }
      });
    }
  },
  //向微信发送支付调用，并提交支付信息
  pay: function(data) {
    var that = this;
    wx.requestPayment({
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: e => {
        wx.showToast({
          title: "支付成功",
          icon: "success",
          duration:3000,
          mask:true
        });
        var url = "";
        if (that.data.type == "course_item") {
          url = "../course_item/course_item?id=" + that.data.course_id;
        } else {
          url = "../index/index.js";
        }
        wx.navigateBack();
        this.setData({
          asyn: true
        });
        that.req(1)
      },
      fail: function(e) {
        if (e.errMsg == "requestPayment:fail cancel") {
          wx.showToast({
            title: "支付取消",
            icon:'none',
            duration:3000,
            mask:true
          });
          that.req(2)
          that.open_button();
        } else {
          wx.showToast({
            title: "支付失败",
            icon:'none',
            duration:3000,
            mask:true
          });
          that.open_button();
          that.req(0)
        }
        that.setData({
          asyn: true
        });
      }
    });
  },
  //返回支付结果
  req: function (state) {
    wx.request({
      url: app.url.pay_back,
      method: 'POST',
      header: app.header,
      data: {
        "pay_status": state,
        "uid": app.open_user.id,
      },
      success: e => {
      }
    })
  },
  open_button: function() {
    var that = this;
    //创建动画
    var animate = wx.createAnimation({
      duration: 300,
      timingFunction: "linear"
    });
    //将变量赋值给动画对象
    that.animate = animate;
    //定义动画
    animate.translateY("100%").step();
    //赋值动画
    that.setData({
      animate: animate.export(),
      open_window: true
    });
    //延时动画
    setTimeout(function() {
      animate.translateY(0).step();
      that.setData({
        animate: animate.export()
      });
    }, 300);
  },
  // 关闭弹窗
  hide_button: function() {
    var that = this;
    var animate = wx.createAnimation({
      duration: 300,
      timingFunction: "linear"
    });
    that.animate = animate;
    animate.translateY("100%").step();
    that.setData({
      animate: animate.export()
    });
    setTimeout(function() {
      that.setData({
        open_window: false
      });
    }, 300);
  },
  open_tips: function() {
    wx.navigateTo({
      url:"../publicity/publicity"
    })
  },
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {},
  call:function(){
    wx.navigateTo({
      url:'../web_view/web_view?url=call'
    });
  }
});
