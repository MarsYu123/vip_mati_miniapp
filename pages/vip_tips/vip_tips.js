// pages/vip_tips/vip_tips.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '',
    old_x: '',
    new_x: '',
    scroll: 0,
    start: false,
    scroll_index: 1,
    scroll_style: '',
    scroll_width: 0,
    scroll_tran: '',
    page_overflow: 'auto',
    n_hours: '',
    is_ios: false
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
    var type = options.type;
    var query = wx.createSelectorQuery();
    var that = this;
    var window_width = wx.getSystemInfoSync().windowWidth;
    var add_width = 0;
    var h = new Date().getHours()
    console.log(h)
    that.setData({
      type: type,
      n_hours: h
    })
    query.select('.swiper_item').boundingClientRect(function (e) {
      if (type == 'long_vip') {
        var width = e.width
        console.log(width)
        that.data.scroll_width = width
        add_width = (window_width - width) / 2
        that.setData({
          scroll_style: 'transform:translateX(-' + parseFloat(width - add_width) + 'px)',
          scroll_tran: '-' + parseFloat(width - add_width),

        })
      }

    }).exec()
  },
  // 按下记录初始坐标
  touchstart: function (e) {
    var x = e.changedTouches[0].pageX;
    var that = this;
    that.data.old_x = x;
    that.data.start = true;
    that.setData({
      page_overflow: 'hidden'
    })
  },
  // 抬起清除记录
  touchend: function (e) {
    var x = e.changedTouches[0].pageX;
    if (Math.abs(x - this.data.old_x) > 20) {
      if (this.data.scroll == -1) {
        this.go_left()
      } else if (this.data.scroll == 1) {
        this.go_right()
      } else {
        return false
      }
    }
    this.setData({
      page_overflow: 'auto'
    })

  },
  // 移动记录坐标
  touchmove: function (e) {
    var new_x = e.changedTouches[0].pageX;
    var old_x = this.data.old_x
    if (this.data.start) {
      if (old_x - new_x > 50) {
        // 往左滑
        this.data.scroll = -1
      } else if (old_x - new_x < -80) {
        // 往右划
        this.data.scroll = 1
      }
    }
  },
  // 往左滑，显示下一张
  go_left: function () {
    var index = this.data.scroll_index;
    var scroll_tran = parseFloat(this.data.scroll_tran)
    var scroll_width = parseFloat(this.data.scroll_width)
    index++;

    if (index < 3) {
      this.setData({
        scroll_style: 'transform: translateX(' + (scroll_tran - scroll_width) + 'px)',
        scroll_tran: scroll_tran - scroll_width,
        scroll_index: index
      })
    } else {
      this.setData({
        scroll_index: 2
      })
    }
  },
  // 往右滑，显示上一张
  go_right: function () {
    var index = this.data.scroll_index;
    var scroll_tran = parseFloat(this.data.scroll_tran)
    var scroll_width = parseFloat(this.data.scroll_width)
    index--;
    if (index > -1) {
      this.setData({
        scroll_style: 'transform: translateX(' + (scroll_tran + scroll_width) + 'px)',
        scroll_tran: scroll_tran + scroll_width,
        scroll_index: index
      })
    } else {
      this.setData({
        scroll_index: 0
      })
    }

  },
  open_img:function (e) {
    var src = e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
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