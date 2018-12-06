// pages/my_courses/my_courses.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    msg: {}, //页面数据
    phone_num: "", //卡号
    flag: false, //是否有数据
    type: '' //跳转入口
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "学习记录"
    });
    var that = this;
    var type = ''
    if (options.type) {
      type = options.type
    }
    that.setData({
      type: type
    })
    this.download()
  },
  download:function () {
    var that = this
    wx.request({
      url: app.url.studyRecord,
      header: app.header,
      method: "POST",
      data: {
        uid: app.open_user.id
      },
      success: e => {
        console.log(e)
        var data = e.data.data;
        if (e.data.true_false) {
          if (data.length > 0) {
            for (var i in data) {
              // data[i].teacher = data[i].teacher.replace(/[|]/g, " ");
              var status = data[i].status;
              if (status == 0) {
                data[i].status = "自用"
                data[i].type = "购买"
              } else if (status == 1) {
                data[i].status = "已转赠此课程给好友"
                data[i].type = "购买"
              } else if (status == 2) {
                data[i].status = "来自好友转赠的课程"
                data[i].type = "购买"
              } else if (status == 3){
                data[i].status = "永久VIP会员报名"
                data[i].type = "报名"
              } else if (status == 4){
                data[i].status = "单次购买"
                data[i].type = "购买"
              }
            }
            that.setData({
              msg: data,
              flag: true
            });
          } else {
            that.setData({
              msg: data,
              flag: false
            });
          }
        } else {
          data = {};
          data.remainTimes = "0";
          data.usedTimes = "0";
          data.data = {};
          that.setData({
            msg: data,
            flag: false
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if(app.bind){
      this.download()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    var type = this.data.type;
    if (type == 1) {
      wx.navigateBack({
        delta: 2
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  call: function () {
    wx.navigateTo({
      url: '../web_view/web_view?url=call'
    });
  }
});