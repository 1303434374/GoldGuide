// pages/problem/problem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [
      {
        title: '当地玩乐产品需要提前几天预定？',
        content: '查看到例如：“您最晚要在出行前1天22：00前下单，表示此产品在有资源的情况下，最晚在出行前1天22：00截止提交预定。您可以在最晚预定时间前可提前多天预定，建议您确定好行程后尽早下单，以免耽误行程。'
      },
      {
        title: '门票最晚何时可以购买？',
        content: '门票内容'
      },
      {
        title: '首单是否会有优惠？',
        content: '首单内容'
      }
    ]
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
        let list = this.data.list
        list.forEach((value, index, array) => {
            value.on = false
            if (index == list.length - 1) {
                this.setData({
                    list: list
                })
            }
        })
    },

  tap_item: function (event) {
        let list = this.data.list
        let item = list[event.currentTarget.dataset.id]
        item.on = !item.on
        this.setData({
            list: list
        })
  }
})