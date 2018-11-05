// pages/teacher/teacher.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    teacher_msg:{},//导师数据
    title:""//首页图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: "授课导师",
    });
    wx.showLoading({
      title: "正在读取...",
      mask: true,
    });
    wx.request({
      url: "https://home.mati.hk/Api/User/starTeacher",
      method: 'POST',
      data: {},
      header: 'application/x-www-form-urlencoded',
      success: (e)=>{
        wx.hideLoading();
        // console.log(e)
        var img_host = "https://home.mati.hk/Public";
        var data = e.data.data;
        for(var i in data){
          data[i].content_img = img_host+data[i].content_img;
          data[i].teacher_img = img_host+data[i].teacher_img;
        }
        that.setData({
          teacher_msg : data,
          title: img_host+data[0].title_img
        })
      },
      fail: ()=>{
        wx.showLoading({
          title: "网络异常，请稍后",
          mask: true,
        });
      }
    });
  },
  open_view:function(e){
    var id = e.currentTarget.id;
    var url = this.data.teacher_msg[id].detail_url;
    wx.navigateTo({
      url: "../web_view/web_view?url="+url
    });
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

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {
  
  // },

  // /**
  //  * 页面上拉触底事件的处理函数
  //  */
  // onReachBottom: function () {
  
  // },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})