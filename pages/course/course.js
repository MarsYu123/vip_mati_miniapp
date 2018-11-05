// pages/course/course.js
var app = getApp();
var userlogin = require('../aa.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: [
      {
        title: "在售"
      },
      {
        title: "往期"
      }
    ],
    class: 0,
    online: {}, //在线课程
    history: {}, //历史课程
    id: [],
    // course_data: {}, //分类课程
    user_info:{},
    bind: false,
    is_ios: false
  },
  login_success: function (e) {
    this.setData({
      user_info:e,
      bind: true
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
    var that = this;
    wx.setNavigationBarTitle({
      title:"马蹄课程"
    })
    wx.showLoading({
      title:"加载中..."
    })
    userlogin.getuser(this)
    wx.request({
      url: app.url.course,
      header: app.header,
      method: "POST",
      data: '',
      success: e => {
        console.log(e)
        if(e.data.true_false){
          that.joint(e.data.data)
          that.setData({
            online: that.joint(e.data.data.online) || [],
            history: that.joint(e.data.data.history) || []
          })
          wx.hideLoading()
        }
      }
    })
  },
  joint: function (e) {
    var data = e;
    if (data.length > 0) {
    
        for (var i in data) {
          if (data[i].cover.indexOf("http") == -1) {
            data[i].cover = "https://home.mati.hk/Public" + data[i].cover;
          }
        }  
   
      return data
    }
  },
  nav_click: function (e) {
    var index = e.target.dataset.id;
    this.setData({
      class: index,
    })
  },
  details:function(e){
    var id = e.currentTarget.id;
    wx.navigateTo({
      url:"../course_item/course_item?id="+id
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
      if(app.bind){
        this.setData({
          user_info: app.open_user
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
  call:function(){
    wx.navigateTo({
      url:'../web_view/web_view?url=call'
    });
  }
})