// 获取code并存储sessionId
var that = this;

function wx_login(that) {
  var app = getApp()
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      var code = res.code;
      if (res.errMsg == "login:ok") {
        //发送请求
        app.code = code;
        console.log('请求成功')
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.showLoading({
                title: "加载中..."
              })
              wx.getUserInfo({
                withCredentials: true,
                success: res => {
                  // 可以将 res 发送给后台解码出 unionId
                  app.userInfo.user = res
                  app.globalData.userInfo = res.userInfo
                  getsession(that)
                }
              })
            }
          }
        })
      } else {
        console.log('code请求失败')
      }
    }
  })
}

function userlogin(e) {
  var app = getApp();
  var page = e || '';
  if (wx.getStorageSync("sessionId") /*  && app.userflag.flag == true */ ) {
    console.log("通过")
    unlock(page)
  } else {
    console.log("初始访问")
    wx_login(page)
  }
};


// 获取session
function getsession(page) {
  var app = getApp();
  wx.request({
    url: app.url.login,
    method: "POST",
    header: app.header,
    dataType: 'json',
    data: {
      "code": app.code
    },
    success: e => {
      if (e) {
        //需获取sessionid
        wx.setStorageSync("sessionId", e.data.data.session);
        wx.setStorageSync("string", e.data.data.string);
        app.session = e.data.data.session
        unlock(page)
      } else {
        console.log("服务器回执失败")
      }
    },
    fail: e => {
      console.log("服务器访问失败" + e)
    }
  })
}

function unlock(e) {
  var app = getApp();
  console.log("直接获取")
  var page = e || '';
  app.load_flag = false;

  // 获取调用page的数据修改方法，用于获取到数据以后填充当前页面的data 
  var login_success = function () {}; 
  if(page.login_success){
    login_success = page.login_success;
  }

  //发送请求
  wx.request({
    url: app.url.unlock,
    data: {
      "encryptedData": encodeURIComponent(app.userInfo.user.encryptedData),
      "iv": encodeURIComponent(app.userInfo.user.iv),
      "session": wx.getStorageSync("sessionId"),
      "string": wx.getStorageSync("string")
    },
    method: "POST",
    header: app.header,
    dataType: 'json',
    success: e => {
      console.log(e)
      var data = e.data.data
      var jump_type = ''; //跳转辨识type
      var course_id = '';

      if (e.data.status != "3333") { // 不是冻结用户

        // 获取数据失败
        if (e.data.true_false == false) {
          app.userflag.flag = false;
          wx_login(page);
        } else {
          // 获取数据成功
          app.userflag.flag = true;
          app.open_user = e.data.data;
          // 首次登陆
          app.load_flag = true;
          // 是否调试
          if (!app.maintained) {
            wx.hideLoading();
          }
          // 执行调用登陆js的填充数据函数
          if (data.xcx_openid != undefined) {
            app.bind = true;
            console.log("已注册会员")
            login_success(data)
          } else {
            if (e.data.status == "4000") {
              if (app.first_user) {
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

            }
          }
        }
      } else {
        wx.hideLoading();
        wx.showModal({
          title: "提示",
          content: '您的账号已被冻结！'
        })
        app.open_user.disabled = true
      }
      return false
    }
  })
}
//已授权，获取userInfo
function getuser(that) {
  var app = getApp()
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          withCredentials: true,
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            app.userInfo.user = res
            app.globalData.userInfo = res.userInfo;
            that.setData({
              userInfo: app.globalData.userInfo,
              hasUserInfo: true,
              wx_tx: app.globalData.userInfo.avatarUrl,
              load: false
            })
            //调用
            userlogin(that)
          }
        })
      }
    }
  })
}



function login(tthat, e) {
  var app = getApp();
  if (e.detail.errMsg == "getUserInfo:ok") {
    app.globalData.userInfo = e.detail.userInfo
    app.userInfo.user = e.detail
    app.first_user = true
    tthat.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      wx_tx: app.globalData.userInfo.avatarUrl
    })
    userlogin(tthat);
  } else {
    console.log("用户不同意")
  }
}

function back(thatt) {
  var that = thatt;
  var app = getApp()
  //递归查看绑定状态
  if (app.open_user.xcx_openid) {
    that.setData({
      user_bind: true
    })
  }
  if (!app.load_flag) {
    setTimeout(function () {
      back(that);
    }, 100)
  } else {
    if (app.open_user.profession != '' && app.open_user.profession.indexOf('/') == '-1') {
      app.open_user.profession = '/' + app.open_user.profession
    }
    that.setData({
      user_msg: app.open_user,
      userInfo: app.globalData.userInfo,
      hasUserInfo: true,
      wx_tx: app.globalData.userInfo.avatarUrl,
      load: false
    })
    wx.hideLoading();
  }
}

function num_slice(e) {
  var data = e;
  if(typeof data != 'string'){
    data = String(e);
  }

  var money = data.replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  return money;
}


//向微信发送支付调用，并提交支付信息
function pay(data,that) {
  var app = getApp()
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
      that.setData({
        asyn: true
      });
      req(1)
      unlock(that)
    },
    fail: function(e) {
      if (e.errMsg == "requestPayment:fail cancel") {
        wx.showToast({
          title: "支付取消",
          icon:'none',
          duration:3000,
          mask:true
        });
        req(2)
      } else {
        wx.showToast({
          title: "支付失败",
          icon:'none',
          duration:3000,
          mask:true
        });
        req(0)
      }
      that.setData({
        asyn: true
      });
    }
  });
}
//返回支付结果
function req(state) {
  var app = getApp()
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
}



module.exports.userlogin = userlogin;
module.exports.unlock = unlock;
module.exports.login = login;
// module.exports.fn_load = fn_load;
module.exports.wx_login = wx_login;
module.exports.getuser = getuser;
module.exports.getsession = getsession;
module.exports.back = back;
module.exports.num_slice = num_slice
module.exports.pay = pay