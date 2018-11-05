// pages/course_item/course_item.js
var app = getApp();
var userlogin = require('../aa.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_bind: false, //是否绑定
    hasUserInfo: false,
    course_msg: {}, //课程详情
    buyTimes: '', //购买次数
    giftTimes: '', //赠送次数
    id: '', //课程id
    url: '', //教师地址
    load: false, //是否载入
    online_flag: '', //是否下架
    asyn: true,
    pay_down: false, //购买成功 
    is_vip: false, //是否是会员
    is_ios: false
    // adv_title:''//省钱
  },
  // 登陆后操作 
  login_success: function (e) {
    var that = this;
    that.setData({
      user_bind: true,
      load: true,
      is_vip: app.open_user.isFinalVIp,
      hasUserInfo: true
    })
    // 如果点击的是单词购买
    if (that.type == 'one_pay') {
      that.pay_start()
    } else if (that.type == 'course') {
      // 如果点击的是兑换课程
      if (e.isFinalVIp == 0) {
        // 立即购买
        that.once()
      } else {
        if (that.data.buyTimes == 0) {
          that.buy()
        } else {
          wx.showToast({
            icon: "none",
            title: "您已经兑换过此课程",
            duration: 3000,
            mask: true
          })
        }
      }
    }
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
      title: "课程详情"
    });
    
    this.setData({
      id: options.id,
    })
    this.upload();
    userlogin.getuser(this)
  },
  upload: function () {
    var that = this;
    console.log(that.data.id,app.open_user.id)
    wx.request({
      url: app.url.getOneCourse,
      method: "POST",
      header: app.header,
      data: {
        cid: that.data.id,
        uid: app.open_user.id
      },
      success: e => {
        console.log(e)
        var data = e.data.data[0];
        if (data.cover.indexOf("http") == -1) {
          data.cover = "https://home.mati.hk/Public" + data.cover;
        }
        if (data.class_schedule.indexOf("http") == -1) {
          data.class_schedule = "https://home.mati.hk/Public" + data.class_schedule;
        }
        for (var i in data.teacher) {
          if (data.teacher[i].teacher_profile.indexOf("http") == -1) {
            data.teacher[i].teacher_profile = "https://home.mati.hk/Public" + data.teacher[i].teacher_profile
          }
        }
        that.setData({
          course_msg: data,
          buyTimes: e.data.data.buyTimes,
          load: true,
          giftTimes: e.data.data.giftTimes,
          online_flag: data.is_delete
          // adv_title:data.adv_title
        })
      }
    })
  },
  getUserInfo_user: function (e) {
    this.type = "course";
    this.cid = this.data.id;
    userlogin.wx_login(this, e)
    app.first_user = true;
  },
  //兑换课程
  buy: function (e) {
    var id = this.data.course_msg.id;
    var that = this;
    if (!app.open_user.disabled) {
      if (app.open_user.xcx_openid) {
        if (that.data.asyn) {
          that.data.asyn = false
          wx.request({
            url: app.url.hasBought,
            method: 'POST',
            data: {
              uid: app.open_user.id,
              course_id: that.data.course_msg.id
            },
            header: app.header,
            success: (e) => {
              console.log(e)
              that.data.asyn = true;
              if (e.data.status == '1002') {
                wx.showToast({
                  title: "您已购买此课程，请勿重复购买",
                  icon: 'none',
                  duration: 1500,
                  mask: false,
                });
                that.setData({
                  pay_down: true
                })
              } else {
                console.log(app.open_user.id,app.open_user.phone_number,that.data.course_msg.id)
                wx.request({
                  url: app.url.applyForCourse,
                  method: 'POST',
                  data: {
                    uid: app.open_user.id,
                    phone_number: app.open_user.phone_number,
                    course_id: that.data.course_msg.id
                  },
                  header: app.header,
                  success: (e)=>{
                      console.log(e)
                      var title = '';
                      if(e.data.status == 200){
                        title = "您已兑换成功"
                      }else if(e.data.status == 400||e.data.status == 404){
                        title = "网络故障，请稍后重试"
                      }else if(e.data.status == 403){
                        title = "您不是vip，请联系客服"
                      }
                      wx.showToast({
                        title: title,
                        icon: 'none',
                        duration: 1500,
                        mask: false,
                      });
                  },
                  fail: ()=>{
                    that.setData({
                      pay_down: true
                    })
                    wx.showToast({
                      title: "网络异常，请稍后重试",
                      icon: 'none',
                      duration: 1500,
                      mask: false,
                    });
                  }
                });
              }
            },
            fail: () => {
              that.data.asyn = true
              wx.showToast({
                title: "网络异常，请稍后再试",
                icon: 'none',
                duration: 1500,
                mask: false,
              });
            }
          });
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '您尚未绑定学院账号，是否前往绑定',
          success: e => {
            if (e.confirm) {
              wx.redirectTo({
                url: '../login/login?type = course_item' + '&course_id =' + id,
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
  // 单次购买
  once: function () {

    if (app.open_user.xcx_openid) {
        var that = this;
        if (that.data.asyn) {
          that.data.asyn = false
          wx.request({
            url: app.url.hasBought,
            method: 'POST',
            data: {
              uid: app.open_user.id,
              course_id: that.data.course_msg.id
            },
            header: app.header,
            success: (e) => {
              console.log(e)
              that.data.asyn = true;
              if (e.data.status == '1002') {
                wx.showToast({
                  title: "您已购买此课程，请勿重复购买",
                  icon: 'none',
                  duration: 1500,
                  mask: false,
                });
                that.setData({
                  pay_down: true
                })
              } else {
                that.pay_start()
              }
            },
            fail: () => {
              that.data.asyn = true
              wx.showToast({
                title: "网络异常，请稍后再试",
                icon: 'none',
                duration: 1500,
                mask: false,
              });
            }
          });
        }
    } else {
      wx.showModal({
        title: "提示",
        content: "您尚未绑定学院账号，是否前往绑定",
        showCancel: true,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F',
        success: res => {
          if (res.confirm) {
            wx.redirectTo({
              url: '../login/login?type=course_item' + '&course_id =' + that.data.course_msg.id,
            })
          }
        }
      });
    }


  },

  //向服务器发送支付请求并获取支付信息
  pay_start: function () {
    if (this.data.asyn == true) {
      this.setData({
        asyn: false
      });
      var that = this;
      wx.request({
        url: app.url.pay,
        method: "POST",
        header: app.header,
        data: {
          openId: app.open_user.xcx_openid,
          uid: app.open_user.id,
          phone_number: app.open_user.phone_number,
          card_category: 1,
          order_kind: 1, //0为学习卡1单次
          course_id: that.data.course_msg.id,
          description: that.data.course_msg.course_name
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
  pay: function (data) {
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
          duration: 3000,
          mask: true
        });
        var url = "";
        if (that.data.type == "course_item") {
          url = "../course_item/course_item?id=" + that.data.course_id;
        } else {
          url = "../index/index.js";
        }
        wx.navigateBack();
        this.setData({
          asyn: true,
          pay_down: true
        });
        that.req(1)
      },
      fail: function (e) {
        if (e.errMsg == "requestPayment:fail cancel") {
          wx.showToast({
            title: "支付取消",
            icon: 'none',
            duration: 3000,
            mask: true
          });
          that.req(2)
          // that.open_button();
        } else {
          wx.showToast({
            title: "支付失败",
            icon: 'none',
            duration: 3000,
            mask: true
          });
          // that.open_button();
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
      success: e => {}
    })
  },

  //打开外链
  open_view: function (e) {
    var id = e.currentTarget.dataset.id;
    var teacher = this.data.course_msg.teacher;
    var url = '';
    for (var i in teacher) {
      if (teacher[i].id == id) {
        url = teacher[i].personal_details_url
      }
    }
    console.log(url)
    wx.navigateTo({
      url: '../web_view/web_view?url=' + url
    })
  },
  //预览课程
  showimg: function (e) {
    var url = [];
    url[0] = this.data.course_msg.class_schedule
    wx.previewImage({
      urls: url,
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
    console.log(app.bind)
    if (app.bind) {
      this.upload()
      console.log(app.open_user)
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
  },
  onShareAppMessage: function (e) {
    var id = this.data.id
    return {
      title: '马蹄家MTHome，为你的设计思维充电',
      path: 'pages/vip/vip?course_id='+id+'&type=uid_'+app.open_user.uid+'&course=true',
      imageUrl: 'https://home.mati.hk/Public/web_image/share/share.jpg?time='+this.data.time
    }
  },
})