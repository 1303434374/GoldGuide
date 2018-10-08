const app = getApp()
const QQMap = require('../../utils/qqmap.js')
let City = require('../../utils/allcity.js');

Page({

  data: {
    city:City
  },

  bindtap(e){
    // console.log(e.detail)
    this.set_address(e.detail.name)
  },
  input(e){
    this.value = e.detail.value
  },
  searchMt(){
    // 当没有输入的时候，默认inputvalue 为 空字符串，因为组件 只能接受 string类型的 数据 
    if(!this.value){
      this.value = '';
    }
    this.setData({
      value:this.value
    })
  },

    set_address: function (address) {
        let qqmap = new QQMap({
            key: 'L46BZ-4MW6F-UCFJU-NUWQC-KT27E-IEBKO'
        })
        qqmap.geocoder({
            address: address,
            success: (res) => {
                console.log(res.result)
                wx.reLaunch({
                  url: `/pages/index/index?lat=${res.result.location.lat}&lng=${res.result.location.lng}`
                })
            }
        })
    },
  
})