const app = getApp()
const QQMap = require('../../utils/qqmap.js')
// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickname: '',
    headerimg: '',
    phone: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if (wx.getStorageSync('nickname')) {
          this.setData({
              nickname: wx.getStorageSync('nickname'),
              headerimg: wx.getStorageSync('headerimg')
          })
      }
      if (wx.getStorageSync('phone')) {
          this.setData({
              phone: wx.getStorageSync('phone')
          })
      }
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

  tap_item: function (event) {
    switch (Number(event.currentTarget.dataset.id)) {
      case 3:
        wx.navigateTo({
          url: '/pages/store-enter/store-enter'
        })
        break
      case 5:
        wx.navigateTo({
          url: '/pages/about/about'
        })
        break
      case 6:
        wx.navigateTo({
          url: '/pages/problem/problem'
        })
        break
      default:
        wx.showToast({
            title: '敬请期待',
            icon: 'none'
        })
        break
    }
  },

  getPhoneNumber: function(e) { 
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny'){
      wx.showModal({
          title: '提示',
          showCancel: false,
          content: '请重新点击授权',
          success: function (res) { }
      })
    } else {
      console.log(e.detail.errMsg) 
      console.log(e.detail.iv) 
      console.log(e.detail.encryptedData)
      let t = this
      wx.login({
          success(s) {
              console.log(s)
              app.http_post("Getphone", {
                  code: s.code,
                  encryptedData: e.detail.encryptedData,
                  iv: e.detail.iv
              }, (ss) => {
                  console.log(ss)
                  if (ss.phoneNumber) {
                    let phone = ss.phoneNumber
                    phone = phone.substr(0,3) + '****' + phone.substr(7)
                    t.setData({
                        phone: phone 
                    })
                    wx.setStorageSync("phone", phone)
                    wx.showModal({
                        title: '提示',
                        showCancel: false,
                        content: '已授权',
                        success: function (res) { }
                    })
                  }
              });
          }
      })   
    }
  }

})