const app = getApp()
const QQMap = require('../../utils/qqmap.js')
// pages/store-detail/store-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude: 0,
    longitude: 0,
    data: [],
    load: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_location(options.id)
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

  },

    get_location: function (id) {
        wx.showNavigationBarLoading()
        wx.showLoading({
            title: '加载中'
        })
        wx.getLocation({
            type: 'gcj02',
            success: (res) => {
                this.setData({
                    latitude: res.latitude,
                    longitude: res.longitude
                })
                this.get_data(id)
            },
            fail: (err) => {

            }
        })
    },

  get_data: function (id) {
    app.http_get(`Getoneshangjia&s_id=${id}`, (ret) => {
      if (ret.result) {
        let data = ret.result
        let distance = ''
        let distance_count = this.get_distance(this.data.latitude, this.data.longitude, data.latitude, data.longitude)
        if (distance_count < 1000) {
            distance = distance_count + '米'
        } else if (distance_count >= 1000 && distance_count <= 100000) {
            distance = (distance_count / 1000).toFixed(1) + '公里'
        } else if (distance_count > 100000) {
            distance = '>100公里'
        }
        data.distance = distance
        this.setData({
          data: data,
          load: 1
        })
        wx.hideLoading()
         wx.hideNavigationBarLoading()
      }
    })
  },

    get_distance: function (lat1, lng1, lat2, lng2) {
        lat1 = lat1 || 0
        lng1 = lng1 || 0
        lat2 = lat2 || 0
        lng2 = lng2 || 0

        let rad1 = lat1 * Math.PI / 180.0
        let rad2 = lat2 * Math.PI / 180.0
        let a = rad1 - rad2
        let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0

        let r = 6378137
        return Math.round(r * 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2))))
    },

    tap_gps:  function (event) {
        wx.openLocation({
            scale: 18,
            name: this.data.data.s_name,
            address: this.data.data.s_address,
            latitude: Number(this.data.data.latitude),
            longitude: Number(this.data.data.longitude)
        })
    },

    tap_tel: function (event) {
        wx.makePhoneCall({
            phoneNumber: this.data.data.s_headphone
        })
    },
})