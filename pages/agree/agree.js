const app = getApp()
const QQMap = require('../../utils/qqmap.js')
// pages/agree/agree.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_data()
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

  get_data: function (event) {
    app.http_get('Getxieyi', (ret) => { 
        let contents = this.escape2Html(ret.result.contents)
        this.setData({
          contents: contents
        })
    })
  },

  tap_btn: function (event) {
    wx.redirectTo({
      url: '/pages/store-enter/store-enter'
    })
  },

  escape2Html: function (str) {
    var arrEntities = { 'lt': '<', 'gt': '>', 'nbsp': ' ', 'amp': '&', 'quot': '"' };
    return str.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, t) { return arrEntities[t]; }).replace(/\<img/gi, '<img style="margin-left: -20px;"');
  }
})