// pages/about/about.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:{
      name: '金牌导游GoldGuide',
      des: '金牌导游GoldGuide，纯净，美好的旅游大使。这里有世界各地的旅行社负责人、旅游顾问、金牌导游用心为您服务，金牌导游，和你一起快乐游全球！',
      logo: '/images/logo.png',
      tel: '400-0731-333',
      email: '4000731333@b.qq.com',
      email2: '158269597@qq.com',
      site: 'www.goldguide.com'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

    tap_tel: function (event) {
        wx.makePhoneCall({
            phoneNumber: this.data.info.tel
        })
    },
})