
function login (e) {
    var that = this;
    if (e.detail.errMsg == "getUserInfo:ok") {
      app.globalData.userInfo = e.detail.userInfo
      app.userInfo.user = e.detail
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
      userlogin.userlogin(that);
      wx.showLoading({
        title: '请等待。。。',
      })
    } else {
      console.log("用户不同意")
    }
  }
  module.exports.login = login;