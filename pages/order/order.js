// pages/order/order.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: {}, //订单数据
    nav: [{
        title: "全部订单"
      },
      {
        title: "已完成"
      },
      {
        title: "已取消"
      },
      // {
      //   title: "已开发票"
      // }
    ],
    class: 0,
    button: 0,
    val: [],
    checkbox: '',
    flag: false, //是否有数据
    none_tips: ["还没有相关订单", "还没有可开的发票", "还没有已开的发票"], //空白时提示文字
    load_flag: false, //加载判断
    is_refund: false //是否可以退款
  },

  /**
   * 生命周期函数--监听页面加载
   */
  download: function (down_url) {
    var that = this;
    wx.request({
      url: down_url,
      header: app.header,
      method: "POST",
      data: {
        uid: app.open_user.id
      },
      success: e => {
        that.setData({
          load_flag: true
        })
        if (!e.data.true_false) {
          that.setData({
            flag: false,
            msg: {}
          })
        } else {
          that.setData({
            flag: true,
            msg: e.data.data
          })
        }
      }
    })
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "订单中心"
    })
    this.setData({
      is_refund: app.is_refund
    })
    this.download(app.url.getOrder)
  },
  refund: function (e) {
    var trade = e.currentTarget.dataset.trade;
    var fee = e.currentTarget.dataset.fee;
    console.log(trade , fee , app.open_user.uid)
    wx.request({
      url: app.url.refundAdd,
      method: 'POST',
      data: {
        uid: app.open_user.uid,
        out_trade_no: trade,
        total_fee: fee
      },
      header: app.header,
      success: (e) => {
        getCurrentPages()[getCurrentPages().length - 1].onLoad()
      },
      fail: () => {
        wx.showToast({
          title: '网络异常，请稍后重试！',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
      }
    });
  },
  nav_click: function (e) {
    this.setData({
      msg: {}
    })
    var index = e.target.dataset.id;
    var button = 0;
    if (index == 0) {
      this.download(app.url.getOrder)
      button = 0
    } else if (index == 1) {
      console.log(index)
      this.setData({
        flag: false
      })
      button = 2
      this.download(app.url.completedOrder)
    } else if (index == 2) {
      // button = 3
      // this.download(app.url.doneInvoice)
      this.download(app.url.cancelOrder)
    }
    this.setData({
      class: index,
      // button: button
      // course_data: data
    })
  },
  start: function () {
    this.setData({
      button: 2
    })
  },
  next: function () {
    var checkbox = this.data.checkbox;
    var data = {
      uid: app.open_user.id,
      out_trade_no: [],
      amount: 0,
      shui_number: '',
      invoice_company: '',
      address: '',
      express_name: '',
      express_phone_number: ''
    };
    if (checkbox.length > 0) {
      for (var i in checkbox) {
        data.out_trade_no.push(this.data.msg[i].out_trade_no);
        data.amount += parseFloat(this.data.msg[i].total_fee)
      }
      app.invoice = data;
      wx.navigateTo({
        url: "../invoice/invoice"
      })
    } else {
      wx.showToast({
        "title": "请选择发票!",
        icon: 'none',
        duration: 3000,
        mask: true
      })
    }
  },
  checkbox: function (e) {
    var checkbox = e.detail.value; //选中订单
    var index = e.detail.value.length; //选中个数
    var button = 1; //按钮状态
    //选中状态切换
    for (var i in this.data.val) {
      if (checkbox.indexOf(this.data.val[i].kaci_number) != -1) {
        this.data.val[i].checked = true
      } else {
        this.data.val[i].checked = false
      }
    }
    this.setData({
      val: this.data.val,
      checkbox: checkbox
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
    if (app.bind) {
      this.download(app.url.getOrder)
      this.setData({
        class: 0,
        button: 1
      })
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
  call: function () {
    wx.navigateTo({
      url: '../web_view/web_view?url=call'
    });
  }
})